locals {
  tags = {
    Project     = "shiftbloom-archon"
    ManagedBy   = "terraform"
    Environment = "shared"
  }
}

data "aws_ami" "al2023" {
  most_recent = true
  owners      = ["137112412989"]

  filter {
    name   = "name"
    values = ["al2023-ami-2023.*-x86_64"]
  }
}

resource "aws_iam_role" "ec2_ssm" {
  name = "${var.name_prefix}-ec2-ssm"

  assume_role_policy = jsonencode({
    Version = "2012-10-17"
    Statement = [
      {
        Action = "sts:AssumeRole"
        Effect = "Allow"
        Principal = {
          Service = "ec2.amazonaws.com"
        }
      }
    ]
  })

  tags = local.tags
}

resource "aws_iam_role_policy_attachment" "ssm_core" {
  role       = aws_iam_role.ec2_ssm.name
  policy_arn = "arn:aws:iam::aws:policy/AmazonSSMManagedInstanceCore"
}

resource "aws_iam_instance_profile" "ec2_ssm" {
  name = "${var.name_prefix}-ec2-profile"
  role = aws_iam_role.ec2_ssm.name
}

resource "aws_security_group" "ec2" {
  name        = "${var.name_prefix}-ec2"
  description = "Public access to Shiftbloom Archon"
  vpc_id      = var.vpc_id

  ingress {
    from_port   = 80
    to_port     = 80
    protocol    = "tcp"
    cidr_blocks = var.allowed_ingress_cidrs
  }

  ingress {
    from_port   = 443
    to_port     = 443
    protocol    = "tcp"
    cidr_blocks = var.allowed_ingress_cidrs
  }

  egress {
    from_port   = 0
    to_port     = 0
    protocol    = "-1"
    cidr_blocks = ["0.0.0.0/0"]
  }

  tags = local.tags
}

resource "aws_security_group" "rds" {
  name        = "${var.name_prefix}-rds"
  description = "RDS access from the Shiftbloom Archon EC2 host"
  vpc_id      = var.vpc_id

  ingress {
    from_port       = 5432
    to_port         = 5432
    protocol        = "tcp"
    security_groups = [aws_security_group.ec2.id]
  }

  egress {
    from_port   = 0
    to_port     = 0
    protocol    = "-1"
    cidr_blocks = ["0.0.0.0/0"]
  }

  tags = local.tags
}

resource "aws_db_subnet_group" "archon" {
  name       = "${var.name_prefix}-db-subnets"
  subnet_ids = var.private_subnet_ids
  tags       = local.tags
}

resource "aws_db_instance" "archon" {
  identifier              = "${var.name_prefix}-db"
  engine                  = "postgres"
  engine_version          = var.db_engine_version
  instance_class          = var.db_instance_class
  allocated_storage       = var.db_allocated_storage
  db_name                 = var.db_name
  username                = var.db_username
  password                = var.db_password
  db_subnet_group_name    = aws_db_subnet_group.archon.name
  vpc_security_group_ids  = [aws_security_group.rds.id]
  skip_final_snapshot     = false
  deletion_protection     = true
  backup_retention_period = 7
  publicly_accessible     = false
  storage_encrypted       = true
  apply_immediately       = true

  tags = local.tags
}

resource "aws_secretsmanager_secret" "app_env" {
  name        = var.app_secret_name
  description = "Runtime environment for the Shiftbloom Archon shared stack"
  tags        = local.tags
}

resource "aws_secretsmanager_secret_version" "app_env" {
  secret_id = aws_secretsmanager_secret.app_env.id
  secret_string = jsonencode({
    DOMAIN                    = var.domain_name
    PORT                      = "3000"
    ARCHON_DATA               = "/opt/shiftbloom-archon/data"
    LOG_LEVEL                 = "info"
    MAX_CONCURRENT_CONVERSATIONS = "10"
    DATABASE_URL              = "postgresql://${var.db_username}:${var.db_password}@${aws_db_instance.archon.address}:5432/${var.db_name}"
    DEFAULT_AI_ASSISTANT      = "claude"
    CLAUDE_USE_GLOBAL_AUTH    = "false"
    CLAUDE_CODE_OAUTH_TOKEN   = "REPLACE_ME"
    CLAUDE_API_KEY            = ""
    CODEX_ID_TOKEN            = "REPLACE_ME"
    CODEX_ACCESS_TOKEN        = "REPLACE_ME"
    CODEX_REFRESH_TOKEN       = "REPLACE_ME"
    CODEX_ACCOUNT_ID          = "REPLACE_ME"
    GH_TOKEN                  = "REPLACE_ME"
    GITHUB_TOKEN              = "REPLACE_ME"
    CADDY_BASIC_AUTH          = "basicauth @protected { admin REPLACE_ME }"
  })
}

resource "aws_instance" "archon" {
  ami                         = data.aws_ami.al2023.id
  instance_type               = var.instance_type
  subnet_id                   = var.public_subnet_id
  vpc_security_group_ids      = [aws_security_group.ec2.id]
  iam_instance_profile        = aws_iam_instance_profile.ec2_ssm.name
  associate_public_ip_address = true
  key_name                    = var.key_name != "" ? var.key_name : null

  user_data = <<-EOF
              #!/bin/bash
              set -euxo pipefail
              dnf update -y
              dnf install -y docker git jq
              systemctl enable --now docker
              usermod -aG docker ec2-user
              mkdir -p /opt/shiftbloom-archon/data
              chown -R ec2-user:ec2-user /opt/shiftbloom-archon
              EOF

  root_block_device {
    volume_size = var.root_volume_size
    volume_type = "gp3"
    encrypted   = true
  }

  tags = merge(local.tags, {
    Name = "${var.name_prefix}-ec2"
  })
}

resource "aws_route53_record" "archon" {
  count   = var.route53_zone_id != "" ? 1 : 0
  zone_id = var.route53_zone_id
  name    = var.domain_name
  type    = "A"
  ttl     = 300
  records = [aws_instance.archon.public_ip]
}

