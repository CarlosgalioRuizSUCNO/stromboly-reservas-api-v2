variable "project_name" { type = string }

data "aws_iam_policy_document" "execution" {
  statement {
    actions = [
      "ecr:GetAuthorizationToken",
      "ecr:BatchGetImage",
      "ecr:GetDownloadUrlForLayer",
      "logs:CreateLogStream",
      "logs:PutLogEvents"
    ]
    resources = ["*"]
    effect    = "Allow"
  }
}

resource "aws_iam_role" "task_execution" {
  name = "${var.project_name}-ecsTaskExecutionRole"
  assume_role_policy = jsonencode({
    Version = "2012-10-17",
    Statement = [{
      Effect    = "Allow",
      Principal = { Service = "ecs-tasks.amazonaws.com" },
      Action    = "sts:AssumeRole"
    }]
  })
}

resource "aws_iam_policy" "task_execution" {
  name   = "${var.project_name}-ecs-execution"
  policy = data.aws_iam_policy_document.execution.json
}

resource "aws_iam_role_policy_attachment" "attach_exec" {
  role       = aws_iam_role.task_execution.name
  policy_arn = aws_iam_policy.task_execution.arn
}

data "aws_iam_policy_document" "task" {
  statement {
    actions   = ["secretsmanager:GetSecretValue"]
    resources = ["*"]
    effect    = "Allow"
  }
}
resource "aws_iam_role" "task_role" {
  name = "${var.project_name}-ecsTaskRole"
  assume_role_policy = jsonencode({
    Version = "2012-10-17",
    Statement = [{
      Effect    = "Allow",
      Principal = { Service = "ecs-tasks.amazonaws.com" },
      Action    = "sts:AssumeRole"
    }]
  })
}
resource "aws_iam_policy" "task" {
  name   = "${var.project_name}-ecs-task"
  policy = data.aws_iam_policy_document.task.json
}
resource "aws_iam_role_policy_attachment" "attach_task" {
  role       = aws_iam_role.task_role.name
  policy_arn = aws_iam_policy.task.arn
}

output "task_execution_role_arn" { value = aws_iam_role.task_execution.arn }
output "task_role_arn" { value = aws_iam_role.task_role.arn }
