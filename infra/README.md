# IaC - Terraform (AWS) para Stromboly

Starter de infraestructura en AWS con VPC, ECS Fargate, ALB, ECR, Secrets Manager, CloudWatch y RDS opcional.

## Prerrequisitos
- AWS CLI configurado (`aws configure`)
- Terraform >= 1.5

## Uso (dev)
```bash
cd infra/envs/dev
terraform init
terraform plan -var="image_tag=latest" -var="enable_nat=false" -var="enable_rds=true"
terraform apply -auto-approve -var="image_tag=latest" -var="enable_nat=false" -var="enable_rds=true"
```
Salida útil: `alb_dns_name` → abre `http://<alb_dns_name>/health`

Notas:
- `enable_nat=false` reduce costos en dev.
- Si `enable_rds=true`, se crea Postgres y se publica `DB_URL` y `JWT_SECRET` en Secrets Manager.
- La ECS Task usa la imagen de ECR `${project}-api:${image_tag}`.
