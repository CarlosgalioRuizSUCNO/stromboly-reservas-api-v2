variable "project_name" {
  description = "Nombre del proyecto"
  type        = string
}

variable "vpc_id" {
  description = "ID de la VPC"
  type        = string
}

variable "public_subnets" {
  description = "Lista de subnets públicas"
  type        = list(string)
}

variable "private_subnets" {
  description = "Lista de subnets privadas"
  type        = list(string)
}

variable "repository_url" {
  description = "URL del repositorio ECR"
  type        = string
}

variable "image_tag" {
  description = "Tag de la imagen Docker"
  type        = string
}

variable "cpu" {
  description = "CPU para la tarea ECS"
  type        = number
}

variable "memory" {
  description = "Memoria para la tarea ECS"
  type        = number
}

variable "desired_count" {
  description = "Número deseado de tareas"
  type        = number
}

variable "log_group_name" {
  description = "Nombre del grupo de logs de CloudWatch"
  type        = string
}

variable "task_role_arn" {
  description = "ARN del rol de la tarea"
  type        = string
}

variable "exec_role_arn" {
  description = "ARN del rol de ejecución"
  type        = string
}

variable "secret_arn" {
  description = "ARN del secreto en Secrets Manager"
  type        = string
}

variable "enable_alb" {
  description = "Habilita o deshabilita el uso de Application Load Balancer (ALB)"
  type        = bool
  default     = false
}

variable "container_name" {
  description = "Nombre del contenedor"
  type        = string
  default     = "app"
}

variable "container_port" {
  description = "Puerto del contenedor FastAPI"
  type        = number
  default     = 8080
}