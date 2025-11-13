
locals {
  container_name = "${var.project_name}-api"
  image          = "${var.repository_url}:${var.image_tag}"
}

data "aws_region" "current" {}

resource "aws_ecs_cluster" "this" {
  name = "${var.project_name}-cluster"
}

# SG del ALB
resource "aws_security_group" "alb" {
  name   = "${var.project_name}-alb-sg"
  vpc_id = var.vpc_id

  ingress {
    from_port   = 80
    to_port     = 80
    protocol    = "tcp"
    cidr_blocks = ["0.0.0.0/0"]
  }

  egress {
    from_port   = 0
    to_port     = 0
    protocol    = "-1"
    cidr_blocks = ["0.0.0.0/0"]
  }
}

# SG de ECS (el ALB puede entrar al 8080)
resource "aws_security_group" "ecs" {
  name   = "${var.project_name}-ecs-sg"
  vpc_id = var.vpc_id

  ingress {
    from_port       = 8080
    to_port         = 8080
    protocol        = "tcp"
    security_groups = [aws_security_group.alb.id]
  }

  egress {
    from_port   = 0
    to_port     = 0
    protocol    = "-1"
    cidr_blocks = ["0.0.0.0/0"]
  }
}

resource "aws_lb" "this" {
  count              = var.enable_alb ? 1 : 0
  name               = "${var.project_name}-alb"
  load_balancer_type = "application"
  security_groups    = [aws_security_group.alb.id]
  subnets            = var.public_subnets
}

resource "aws_lb_target_group" "this" {
  count       = var.enable_alb ? 1 : 0
  name        = "${var.project_name}-tg"
  port        = 8080
  protocol    = "HTTP"
  vpc_id      = var.vpc_id
  target_type = "ip"

  health_check {
    enabled             = true
    healthy_threshold   = 2
    unhealthy_threshold = 10
    timeout             = 10
    interval            = 30
    path                = "/health"
    protocol            = "HTTP"
    matcher             = "200"
  }

  deregistration_delay = 30
}

resource "aws_lb_listener" "http" {
  count             = var.enable_alb ? 1 : 0
  load_balancer_arn = aws_lb.this[0].arn
  port              = 80
  protocol          = "HTTP"
  default_action {
    type             = "forward"
    target_group_arn = aws_lb_target_group.this[0].arn
  }
}

resource "aws_ecs_task_definition" "task" {
  family                   = "${var.project_name}-task"
  cpu                      = var.cpu
  memory                   = var.memory
  network_mode             = "awsvpc"
  requires_compatibilities = ["FARGATE"]
  task_role_arn            = var.task_role_arn
  execution_role_arn       = var.exec_role_arn

  container_definitions = jsonencode([
    {
      name         = local.container_name
      image        = local.image
      essential    = true
      portMappings = [{ containerPort = 8080, hostPort = 8080 }]
      logConfiguration = {
        logDriver = "awslogs"
        options = {
          awslogs-group         = var.log_group_name
          awslogs-region        = data.aws_region.current.id
          awslogs-stream-prefix = "ecs"
        }
      }
      secrets = [
        { name = "DB_URL", valueFrom = "${var.secret_arn}:DB_URL::" },
        { name = "JWT_SECRET", valueFrom = "${var.secret_arn}:JWT_SECRET::" },
        { name = "POSTGRES_USER", valueFrom = "${var.secret_arn}:POSTGRES_USER::" },
        { name = "POSTGRES_PASSWORD", valueFrom = "${var.secret_arn}:POSTGRES_PASSWORD::" },
        { name = "POSTGRES_DB", valueFrom = "${var.secret_arn}:POSTGRES_DB::" },
        { name = "POSTGRES_HOST", valueFrom = "${var.secret_arn}:POSTGRES_HOST::" },
        { name = "POSTGRES_PORT", valueFrom = "${var.secret_arn}:POSTGRES_PORT::" }
      ]
      environment = [
        { name = "APP_PORT", value = "8080" }
      ]
      healthCheck = {
        command     = ["CMD-SHELL", "python -c \"import urllib.request; urllib.request.urlopen('http://localhost:8080/health')\" || exit 1"]
        interval    = 30
        timeout     = 5
        retries     = 3
        startPeriod = 10
      }
    }
  ])
}

resource "aws_ecs_service" "svc" {
  name            = "${var.project_name}-svc"
  cluster         = aws_ecs_cluster.this.id
  task_definition = aws_ecs_task_definition.task.arn
  desired_count   = var.desired_count
  launch_type     = "FARGATE"

  network_configuration {
    subnets          = var.enable_alb ? var.private_subnets : var.public_subnets
    security_groups  = [aws_security_group.ecs.id]
    assign_public_ip = var.enable_alb ? false : true
  }

  dynamic "load_balancer" {
    for_each = var.enable_alb ? [1] : []
    content {
      target_group_arn = aws_lb_target_group.this[0].arn
      container_name   = local.container_name
      container_port   = 8080
    }
  }
}

output "ecs_security_group_id" { value = aws_security_group.ecs.id }
