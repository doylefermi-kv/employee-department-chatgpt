# variables.tf

variable "name" {
  description = "The name to use for resources"
  type        = string
  default     = "kirmani"
}

variable "cidr" {
  description = "The CIDR block to use for the VPC"
  type        = string
  default     = "10.0.0.0/16"
}

variable "azs" {
  description = "The availability zones to use for the VPC"
  type        = list(string)
  default     = ["ap-south-1a", "ap-south-1b"]
}

variable "private_subnets" {
  description = "The CIDR blocks to use for the private subnets"
  type        = list(string)
  default     = ["10.0.1.0/24", "10.0.2.0/24"]
}

variable "public_subnets" {
  description = "The CIDR blocks to use for the public subnets"
  type        = list(string)
  default     = ["10.0.101.0/24", "10.0.102.0/24"]
}

variable "rds_instance_type" {
  default = "db.t3.large"
}

variable "rds_database_name" {
  default = "kirmani-postgres-rds"
}

variable "rds_username" {
  default = "postgres"
}

variable "rds_password" {
  default = "mysecretpassword"
}

