# Common environment variables for all Lambda functions
locals {
  lambda_env_vars = {
    DB_HOST             = aws_db_instance.postgres.address
    DB_PORT             = tostring(aws_db_instance.postgres.port)
    DB_NAME             = "onboarding_app"
    DB_USER             = "jmend"
    DB_PASSWORD         = "jmend12!"
    HOST                = aws_db_instance.postgres.address
    PORT                = tostring(aws_db_instance.postgres.port)
    DATABASE            = "onboarding_app"
    USER                = "jmend"
    PASSWORD            = "jmend12!"
    JWT_SECRET          = var.jwt_secret
    SENDGRID_API_KEY    = var.sendgrid_api_key
    SENDGRID_FROM_EMAIL = var.sendgrid_from_email
  }
}

# Main Lambda Function - Onboarding App
resource "aws_lambda_function" "onboarding_app" {
  filename         = "../dist/onboarding-app.zip"
  function_name    = "${var.project_name}-api"
  role             = aws_iam_role.lambda_role.arn
  handler          = "handler.handler"
  source_code_hash = filebase64sha256("../dist/onboarding-app.zip")
  runtime          = var.lambda_runtime
  timeout          = 30
  memory_size      = 512

  vpc_config {
    subnet_ids         = [aws_subnet.private_1.id, aws_subnet.private_2.id]
    security_group_ids = [aws_security_group.lambda.id]
  }

  environment {
    variables = local.lambda_env_vars
  }

  tags = {
    Name = "${var.project_name}-api"
  }

  depends_on = [
    aws_iam_role_policy_attachment.lambda_vpc_execution,
    aws_iam_role_policy_attachment.lambda_basic_execution
  ]
}

# CloudWatch Log Group for Onboarding App Lambda
resource "aws_cloudwatch_log_group" "onboarding_app" {
  name              = "/aws/lambda/${aws_lambda_function.onboarding_app.function_name}"
  retention_in_days = 7
}

# Lambda Function - Database Initialization
resource "aws_lambda_function" "db_init" {
  filename         = "../dist/db-init.zip"
  function_name    = "${var.project_name}-db-init"
  role             = aws_iam_role.lambda_role.arn
  handler          = "db-init-handler.handler"
  source_code_hash = filebase64sha256("../dist/db-init.zip")
  runtime          = var.lambda_runtime
  timeout          = 60
  memory_size      = 256

  vpc_config {
    subnet_ids         = [aws_subnet.private_1.id, aws_subnet.private_2.id]
    security_group_ids = [aws_security_group.lambda.id]
  }

  environment {
    variables = {
      DB_HOST     = aws_db_instance.postgres.address
      DB_PORT     = tostring(aws_db_instance.postgres.port)
      DB_NAME     = "onboarding_app"
      DB_USER     = "jmend"
      DB_PASSWORD = "jmend12!"
    }
  }

  tags = {
    Name = "${var.project_name}-db-init"
  }

  depends_on = [
    aws_iam_role_policy_attachment.lambda_vpc_execution,
    aws_iam_role_policy_attachment.lambda_basic_execution,
    aws_db_instance.postgres
  ]
}

# CloudWatch Log Group for DB Init Lambda
resource "aws_cloudwatch_log_group" "db_init" {
  name              = "/aws/lambda/${aws_lambda_function.db_init.function_name}"
  retention_in_days = 7
}
