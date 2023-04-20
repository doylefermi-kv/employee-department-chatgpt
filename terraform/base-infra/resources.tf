locals {
  name = var.name
}

# Create S3 bucket for storing flow logs
resource "aws_s3_bucket" "flow_logs_bucket" {
  bucket = "kirmani-flow-logs"
  acl    = "private"
  tags = {
    created-by = "chatgpt"
    Name       = local.name
  }
}

module "vpc" {
  source = "terraform-aws-modules/vpc/aws"
  name   = local.name
  cidr   = var.cidr

  azs             = var.azs
  private_subnets = var.private_subnets
  public_subnets  = var.public_subnets

  enable_nat_gateway = true
  single_nat_gateway = true

  tags = {
    created-by = "chatgpt"
    Name       = local.name
  }

  # Enable flow logs for VPC
  enable_flow_log           = true
  flow_log_destination_type = "s3"
  flow_log_destination_arn  = aws_s3_bucket.flow_logs_bucket.arn
  flow_log_traffic_type     = "ALL"
}


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

# Create a PostgreSQL RDS instance
resource "aws_db_instance" "postgres_rds" {
  allocated_storage      = 20
  storage_type           = "gp2"
  engine                 = "postgres"
  engine_version         = "13.4"
  instance_class         = var.rds_instance_type
  name                   = "mydatabase"
  username               = var.rds_username
  password               = var.rds_password
  parameter_group_name   = "default.postgres13"
  skip_final_snapshot    = true
  vpc_security_group_ids = [aws_security_group.aws_pvt_security_group.id]
  db_subnet_group_name   = aws_db_subnet_group.private_subnet_group.name

  tags = {
    created-by = "chatgpt"
    Name       = local.name
  }
}

# Create a DB subnet group for the private subnets
resource "aws_db_subnet_group" "private_subnet_group" {
  name        = "private-subnet-group"
  description = "Subnet group for private subnets"

  subnet_ids = module.vpc.private_subnets

  tags = {
    created-by = "chatgpt"
    Name       = local.name
  }
}


# Create a security group for the PostgreSQL RDS instance
resource "aws_security_group" "postgres_sg" {
  name_prefix = "kirmani-postgres-sg-"

  vpc_id = module.vpc.vpc_id

  ingress {
    from_port       = 5432
    to_port         = 5432
    protocol        = "tcp"
    security_groups = [aws_security_group.aws_pvt_security_group.id]
  }

  egress {
    from_port   = 0
    to_port     = 65535
    protocol    = "tcp"
    cidr_blocks = ["0.0.0.0/0"]
  }

  tags = {
    created-by = "chatgpt"
    Name       = local.name
  }
}

# Create a private security group that only allows inbound from VPC IPs
resource "aws_security_group" "aws_pvt_security_group" {
  name_prefix = "aws_pvt_sg_"

  vpc_id = module.vpc.vpc_id

  ingress {
    from_port   = 0
    to_port     = 65535
    protocol    = "tcp"
    cidr_blocks = [module.vpc.vpc_cidr_block]
  }

  ingress {
    from_port   = 0
    to_port     = 65535
    protocol    = "udp"
    cidr_blocks = [module.vpc.vpc_cidr_block]
  }

  tags = {
    created-by = "chatgpt"
    Name       = local.name
  }
}

# Create a security group for the ECS cluster instances
resource "aws_security_group" "kirmani_sg" {
  name_prefix = "kirmani-sg-"

  vpc_id = module.vpc.vpc_id

  ingress {
    from_port   = 0
    to_port     = 65535
    protocol    = "tcp"
    cidr_blocks = ["10.0.0.0/8"]
  }

  ingress {
    from_port   = 0
    to_port     = 65535
    protocol    = "udp"
    cidr_blocks = ["10.0.0.0/8"]
  }

  egress {
    from_port   = 0
    to_port     = 65535
    protocol    = "tcp"
    cidr_blocks = ["0.0.0.0/0"]
  }

  egress {
    from_port   = 0
    to_port     = 65535
    protocol    = "udp"
    cidr_blocks = ["0.0.0.0/0"]
  }

  tags = {
    created-by = "chatgpt"
    Name       = local.name
  }
}

# Attach the private security group to the PostgreSQL RDS instance
resource "aws_security_group_rule" "postgres_sg_ingress" {
  security_group_id = aws_security_group.postgres_sg.id

  type        = "ingress"
  from_port   = 0
  to_port     = 65535
  protocol    = "tcp"
  cidr_blocks = [module.vpc.vpc_cidr_block]

  depends_on = [
    aws_security_group.aws_pvt_security_group
  ]
}
