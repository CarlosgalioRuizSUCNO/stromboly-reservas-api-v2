output "alb_dns_name" {
  value       = var.enable_alb ? aws_lb.this[0].dns_name : null
  description = "DNS del ALB (solo si está habilitado)"
}

output "alb_arn" {
  value       = var.enable_alb ? aws_lb.this[0].arn : null
  description = "ARN del ALB"
}

output "target_group_arn" {
  value       = var.enable_alb ? aws_lb_target_group.this[0].arn : null
  description = "ARN del Target Group"
}

output "cluster_name" {
  value       = aws_ecs_cluster.this.name
  description = "Nombre del cluster ECS"
}

output "service_name" {
  value       = aws_ecs_service.svc.name
  description = "Nombre del servicio ECS"
}
