output "alb_dns_name" {
  value       = var.enable_alb ? aws_lb.this[0].dns_name : null
  description = "DNS del ALB (solo si está habilitado)"
}