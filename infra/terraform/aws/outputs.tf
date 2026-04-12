output "ec2_instance_id" {
  value       = aws_instance.archon.id
  description = "EC2 instance ID for the shared Archon stack."
}

output "ec2_public_ip" {
  value       = aws_instance.archon.public_ip
  description = "Public IP of the shared Archon stack."
}

output "rds_endpoint" {
  value       = aws_db_instance.archon.address
  description = "RDS PostgreSQL endpoint."
}

output "app_secret_name" {
  value       = aws_secretsmanager_secret.app_env.name
  description = "Secrets Manager name containing the runtime environment."
}

output "ssm_start_session_command" {
  value       = "aws ssm start-session --target ${aws_instance.archon.id} --region ${var.aws_region}"
  description = "Convenience command to connect to the EC2 instance through SSM."
}

