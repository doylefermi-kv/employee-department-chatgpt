resource "aws_ecs_task_definition" "kirmani_task_definition" {
  family = "kirmani-task"
  container_definitions = jsonencode([{
    name = "kirmani-container"
    # image  = "nginx:latest"
    image  = "402338187344.dkr.ecr.ap-south-1.amazonaws.com/chatgpt:latest"
    memory = 128
    cpu    = 128
    environmentFiles = [
      {
        value     = "arn:aws:s3:::chatgp-env/user/.env"
        separator = "="
        type      = "s3"
      }
    ]
    portMappings = [
      {
        containerPort = 3000
        hostPort      = 3000
      }
    ]
  }])

  requires_compatibilities = ["EC2"]

  execution_role_arn = aws_iam_role.ecs_task_execution_role.arn

  tags = {
    Name = local.name
  }
}

resource "aws_ecs_service" "kirmani_service" {
  name            = "kirmani-service"
  cluster         = aws_ecs_cluster.kirmani_cluster.id
  task_definition = aws_ecs_task_definition.kirmani_task_definition.arn
  desired_count   = 1
  launch_type     = "EC2"

  load_balancer {
    target_group_arn = aws_lb_target_group.kirmani_target_group.arn
    container_name   = "kirmani-container"
    container_port   = 3000
  }

  # network_configuration {
  #   security_groups = [aws_security_group.aws_pvt_security_group.id]
  #   subnets         = module.vpc.private_subnets
  # }

  depends_on = [aws_lb_listener.kirmani_listener]

  tags = {
    Name = local.name
  }
}




resource "aws_iam_role" "ecs_task_execution_role" {
  name = "ecs_task_execution_role"

  assume_role_policy = jsonencode({
    Version = "2012-10-17"
    Statement = [
      {
        Action = "sts:AssumeRole"
        Effect = "Allow"
        Principal = {
          Service = "ecs-tasks.amazonaws.com"
        }
      }
    ]
  })
}

resource "aws_iam_role_policy" "ecs_task_execution_role_policy" {
  name = "ecs_task_execution_role_policy"
  role = aws_iam_role.ecs_task_execution_role.id

  policy = jsonencode({
    Version = "2012-10-17",
    Statement = [
      {
        Effect = "Allow",
        Action = [
          "ecr:GetAuthorizationToken",
          "ecr:BatchCheckLayerAvailability",
          "ecr:GetDownloadUrlForLayer",
          "ecr:GetRepositoryPolicy",
          "ecr:DescribeRepositories",
          "ecr:ListImages",
          "ecr:DescribeImages",
          "ecr:BatchGetImage"
        ],
        Resource = "*"
      },
      {
        Effect = "Allow",
        Action = [
          "s3:GetObject",
          "s3:ListBucket"
        ],
        Resource = [
          "arn:aws:s3:::chatgp-env",
          "arn:aws:s3:::chatgp-env/*"
        ]
      }
    ]
  })
}


resource "aws_security_group" "kirmani_lb_sg" {
  name_prefix = "kirmani-lb-sg-"
  vpc_id      = module.vpc.vpc_id

  ingress {
    from_port   = 80
    to_port     = 80
    protocol    = "tcp"
    cidr_blocks = ["0.0.0.0/0"]
  }

  egress {
    from_port   = 0
    to_port     = 0
    protocol    = "-1"
    cidr_blocks = ["0.0.0.0/0"]
  }

  tags = {
    Name = "public-lb-sg"
  }
}

resource "aws_lb" "kirmani_lb" {
  name               = "kirmani-lb"
  internal           = false
  load_balancer_type = "application"
  subnets            = module.vpc.public_subnets
  security_groups    = [aws_security_group.kirmani_lb_sg.id]

  tags = {
    created-by = "chatgpt"
    Name       = local.name
  }
}

resource "aws_lb_target_group" "kirmani_target_group" {
  name        = "kirmani-target-group"
  port        = 80
  protocol    = "HTTP"
  vpc_id      = module.vpc.vpc_id
  target_type = "instance"

  health_check {
    healthy_threshold   = 2
    unhealthy_threshold = 2
    timeout             = 5
    interval            = 10
    path                = "/health"
    matcher             = "200"
  }
}

resource "aws_lb_listener" "kirmani_listener" {
  load_balancer_arn = aws_lb.kirmani_lb.arn
  port              = "80"
  protocol          = "HTTP"

  default_action {
    target_group_arn = aws_lb_target_group.kirmani_target_group.arn
    type             = "forward"
  }
}
resource "aws_lb_listener_rule" "kirmani_listener_rule" {
  listener_arn = aws_lb_listener.kirmani_listener.arn

  action {
    type             = "forward"
    target_group_arn = aws_lb_target_group.kirmani_target_group.arn
  }

  condition {
    path_pattern {
      values = ["/"]
    }
  }

  depends_on = [aws_ecs_service.kirmani_service]
}
