output "repository_url" {
  value       = module.ecr.repository_url
  description = "URL del repositorio ECR"
}

output "alb_dns_name" {
  value       = module.ecs.alb_dns_name
  description = "DNS del Application Load Balancer (si está habilitado)"
}

output "cluster_name" {
  value       = module.ecs.cluster_name
  description = "Nombre del cluster ECS"
}

output "service_name" {
  value       = module.ecs.service_name
  description = "Nombre del servicio ECS"
}

output "rds_endpoint" {
  value       = var.enable_rds ? module.rds[0].endpoint : null
  description = "Endpoint de la base de datos RDS (si está habilitada)"
}
