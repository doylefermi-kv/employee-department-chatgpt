
# Create ECS cluster in private subnet using EC2 instances
resource "aws_ecs_cluster" "kirmani_cluster" {
  name = "kirmani-cluster"

  setting {
    name  = "containerInsights"
    value = "enabled"
  }

  tags = {
    created-by = "chatgpt"
    Name       = local.name
  }
}

data "aws_ami" "ecs" {
  most_recent = true
  filter {
    name   = "name"
    values = ["amzn2-ami-ecs-hvm-*-x86_64-ebs"]
  }
  owners = ["amazon"]
}


data "template_file" "ecs_cluster_userdata" {
  template = file("${path.module}/ecs_cluster_userdata.sh")
}

resource "aws_iam_instance_profile" "ecs_instance_profile" {
  name = "ecs-instance-profile"
  role = aws_iam_role.ecs_instance_role.name
}

resource "aws_iam_role" "ecs_instance_role" {
  name = "ecs-instance-role"
  assume_role_policy = jsonencode({
    Version = "2012-10-17"
    Statement = [
      {
        Action = "sts:AssumeRole"
        Effect = "Allow"
        Principal = {
          Service = "ec2.amazonaws.com"
        }
      }
    ]
  })
}

resource "aws_iam_role_policy_attachment" "ecs_instance_role_policy_attachment" {
  policy_arn = "arn:aws:iam::aws:policy/service-role/AmazonEC2ContainerServiceforEC2Role"
  role       = aws_iam_role.ecs_instance_role.name
}
resource "aws_iam_role_policy_attachment" "ecs_instance_role_policy_attachment_ecr" {
  policy_arn = "arn:aws:iam::aws:policy/AmazonEC2ContainerRegistryFullAccess"
  role       = aws_iam_role.ecs_instance_role.name
}
resource "aws_iam_role_policy_attachment" "s3_full_access_attachment" {
  policy_arn = "arn:aws:iam::aws:policy/AmazonS3FullAccess"
  role       = aws_iam_role.ecs_instance_role.name
}
resource "aws_launch_template" "ecs_cluster_launch_template" {
  name_prefix   = "ecs-cluster-launch-template"
  image_id      = data.aws_ami.ecs.id
  instance_type = "t2.micro"
  key_name      = "chatgpt-poc"
  user_data = base64encode(data.template_file.ecs_cluster_userdata.rendered)
  vpc_security_group_ids = [aws_security_group.aws_pvt_security_group.id]
  # Add ECS instance role to the EC2 instances
  iam_instance_profile {
    name = aws_iam_instance_profile.ecs_instance_profile.name
  }
}

resource "aws_autoscaling_group" "ecs_cluster_asg" {
  name = "ecs-cluster-asg"
  launch_template {
    id = aws_launch_template.ecs_cluster_launch_template.id
    version = "$Latest"
  }
  vpc_zone_identifier = module.vpc.private_subnets
  desired_capacity = 2
  min_size = 2
  max_size = 4
  target_group_arns = [aws_lb_target_group.kirmani_target_group.arn]
  depends_on = [aws_lb_target_group.kirmani_target_group]
}
