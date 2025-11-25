variable "project_name" {
  type    = string
  default = "galicos"
}

variable "aws_region" {
  type    = string
  default = "us-east-1"
}

variable "image_tag" {
  type    = string
  default = "latest"
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

variable "cpu" {
  type    = number
  default = 256
}

variable "memory" {
  type    = number
  default = 512
}

variable "db_username" {
  type    = string
  default = "galicos"
}

variable "db_password" {
  type    = string
  default = "galicospass"
}

variable "db_name" {
  type    = string
  default = "galicos"
}