variable "project_name" { type = string }
variable "db_username" { type = string }
variable "db_password" { type = string }
variable "db_name" { type = string }
variable "rds_endpoint" {
  type    = string
  default = ""
}

locals {
  db_url = var.rds_endpoint != "" ? "postgresql://${var.db_username}:${var.db_password}@${var.rds_endpoint}/${var.db_name}" : ""
}

resource "aws_secretsmanager_secret" "app" {
  name = "${var.project_name}/app-secrets"
}

resource "aws_secretsmanager_secret_version" "app" {
  secret_id = aws_secretsmanager_secret.app.id
  secret_string = jsonencode({
    DB_URL     = local.db_url
    JWT_SECRET = "changeme-in-prod"
  })
}

output "secret_arn" { value = aws_secretsmanager_secret.app.arn }
