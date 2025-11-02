variable "project_name" { type = string }

resource "aws_ecr_repository" "repo" {
  name = "${var.project_name}-api"
  image_scanning_configuration { scan_on_push = true }
  encryption_configuration { encryption_type = "AES256" }
  force_delete = true
  tags         = { Name = "${var.project_name}-ecr" }
}

output "repository_url" { value = aws_ecr_repository.repo.repository_url }
