# provider.tf
provider "aws" {
  region = "ap-south-1"
}

terraform {
  backend "s3" {
    bucket = "kirmani-state-backup"
    key    = "terraform.tfstate"
    region = "ap-south-1"
  }
}
