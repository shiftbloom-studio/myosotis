variable "aws_region" {
  type        = string
  description = "AWS region for the Shiftbloom Archon stack."
  default     = "eu-west-1"
}

variable "name_prefix" {
  type        = string
  description = "Prefix for all AWS resources."
  default     = "shiftbloom-archon"
}

variable "vpc_id" {
  type        = string
  description = "Existing VPC ID."
}

variable "public_subnet_id" {
  type        = string
  description = "Public subnet for the EC2 instance."
}

variable "private_subnet_ids" {
  type        = list(string)
  description = "Private subnet IDs for RDS."
}

variable "key_name" {
  type        = string
  description = "Optional EC2 key pair name. Leave empty when using SSM only."
  default     = ""
}

variable "instance_type" {
  type        = string
  description = "EC2 instance type for the shared stack."
  default     = "t3.large"
}

variable "root_volume_size" {
  type        = number
  description = "EC2 root volume size in GiB."
  default     = 40
}

variable "allowed_ingress_cidrs" {
  type        = list(string)
  description = "CIDRs allowed to reach the public Archon endpoint."
  default     = ["0.0.0.0/0"]
}

variable "route53_zone_id" {
  type        = string
  description = "Optional Route53 zone ID for archon.shiftbloom.studio."
  default     = ""
}

variable "domain_name" {
  type        = string
  description = "DNS name for the Archon endpoint."
  default     = "archon.shiftbloom.studio"
}

variable "db_name" {
  type        = string
  description = "RDS database name."
  default     = "archon"
}

variable "db_username" {
  type        = string
  description = "RDS master username."
  default     = "archon"
}

variable "db_instance_class" {
  type        = string
  description = "RDS instance class."
  default     = "db.t4g.medium"
}

variable "db_allocated_storage" {
  type        = number
  description = "RDS storage size in GiB."
  default     = 50
}

variable "db_engine_version" {
  type        = string
  description = "PostgreSQL engine version."
  default     = "16.13"
}

variable "app_secret_name" {
  type        = string
  description = "Secrets Manager secret name holding compose environment data."
  default     = "shiftbloom-archon/app-env"
}
