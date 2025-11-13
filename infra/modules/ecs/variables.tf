variable "enable_alb" {
  description = "Habilita o deshabilita el uso de Application Load Balancer (ALB)"
  type        = bool
  default     = false
}

variable "container_name" {
  type    = string
  default = "app"    # Debe coincidir con el nombre del contenedor en la task definition
}

variable "container_port" {
  type    = number
  default = 8080     # Puerto del contenedor FastAPI
}