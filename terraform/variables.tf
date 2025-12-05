variable "aws_region" {
  description = "AWS region"
  type        = string
  default     = "us-east-1"
}

variable "project_name" {
  description = "Project name"
  type        = string
  default     = "onboarding-app"
}

variable "db_name" {
  description = "Database name"
  type        = string
  default     = "onboarding_app"
}

variable "db_username" {
  description = "Database username"
  type        = string
  default     = "mytestuser"
  sensitive   = true
}

variable "db_password" {
  description = "Database password"
  type        = string
  default     = "aVerySecurePassword123"
  sensitive   = true
}

variable "db_instance_class" {
  description = "RDS instance class"
  type        = string
  default     = "db.t3.micro"
}

variable "db_allocated_storage" {
  description = "Allocated storage for RDS in GB"
  type        = number
  default     = 20
}

variable "vpc_cidr" {
  description = "CIDR block for VPC"
  type        = string
  default     = "10.0.0.0/16"
}

variable "lambda_runtime" {
  description = "Lambda runtime"
  type        = string
  default     = "nodejs22.x"
}

variable "jwt_secret" {
  description = "JWT Secret for authentication"
  type        = string
  sensitive   = true
  default     = "your-secret-key-change-in-production"
}

variable "sendgrid_api_key" {
  description = "SendGrid API Key"
  type        = string
  sensitive   = true
}

variable "sendgrid_from_email" {
  description = "SendGrid From Email"
  type        = string
}
