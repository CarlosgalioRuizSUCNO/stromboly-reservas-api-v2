variable "image_tag" {
  type    = string
  default = "latest"
}

variable "project_name" {
  type    = string
  default = "stromboly"
}

variable "aws_region" {
  type    = string
  default = "us-east-1"
}

variable "enable_nat" {
  type    = bool
  default = false
}

variable "enable_rds" {
  type    = bool
  default = true
}

variable "desired_count" {
  type    = number
  default = 1
}

variable "db_username" {
  type    = string
  default = "stromboly"
}

variable "db_password" {
  type    = string
  default = "strombolypass"
}

variable "db_name" {
  type    = string
  default = "stromboly"
}


module "vpc" {
  source       = "../../modules/vpc"
  project_name = var.project_name
  enable_nat   = var.enable_nat
}

module "ecr" {
  source       = "../../modules/ecr"
  project_name = var.project_name
}

module "iam" {
  source       = "../../modules/iam"
  project_name = var.project_name
}

module "cloudwatch" {
  source       = "../../modules/cloudwatch"
  project_name = var.project_name
}

module "secrets" {
  source       = "../../modules/secrets"
  project_name = var.project_name
  db_username  = var.db_username
  db_password  = var.db_password
  db_name      = var.db_name
  rds_endpoint = ""
}

module "ecs" {
  source          = "../../modules/ecs"
  project_name    = var.project_name
  vpc_id          = module.vpc.vpc_id
  public_subnets  = module.vpc.public_subnet_ids
  private_subnets = module.vpc.private_subnet_ids
  repository_url  = module.ecr.repository_url
  image_tag       = var.image_tag
  cpu             = 256
  memory          = 512
  desired_count   = var.desired_count
  log_group_name  = module.cloudwatch.log_group_name
  task_role_arn   = module.iam.task_role_arn
  exec_role_arn   = module.iam.task_execution_role_arn
  secret_arn      = module.secrets.secret_arn
  enable_alb      = var.enable_alb
}

module "rds" {
  count              = var.enable_rds ? 1 : 0
  source             = "../../modules/rds"
  project_name       = var.project_name
  db_username        = var.db_username
  db_password        = var.db_password
  db_name            = var.db_name
  subnet_ids         = module.vpc.private_subnet_ids
  vpc_id             = module.vpc.vpc_id
  ecs_security_group = module.ecs.ecs_security_group_id
  depends_on         = [module.ecs]
}


