output "api_endpoint" {
  description = "API Gateway endpoint URL"
  value       = aws_apigatewayv2_api.main.api_endpoint
}

output "api_id" {
  description = "API Gateway ID"
  value       = aws_apigatewayv2_api.main.id
}

output "onboarding_app_lambda_arn" {
  description = "Onboarding App Lambda ARN"
  value       = aws_lambda_function.onboarding_app.arn
}

output "db_init_lambda_arn" {
  description = "Database Initialization Lambda ARN"
  value       = aws_lambda_function.db_init.arn
}

output "rds_endpoint" {
  description = "RDS endpoint (includes port)"
  value       = aws_db_instance.postgres.endpoint
}

output "rds_address" {
  description = "RDS address (host only)"
  value       = aws_db_instance.postgres.address
}

output "rds_port" {
  description = "RDS port"
  value       = aws_db_instance.postgres.port
}

output "vpc_id" {
  description = "VPC ID"
  value       = aws_vpc.main.id
}

output "private_subnet_ids" {
  description = "Private subnet IDs"
  value       = [aws_subnet.private_1.id, aws_subnet.private_2.id]
}

output "db_name" {
  description = "Database name"
  value       = var.db_name
}
