# Terraform AWS Scaffold

This scaffold provisions the minimum shared Shiftbloom Archon stack:

- EC2 runtime host
- RDS PostgreSQL for Archon metadata
- Secrets Manager secret for compose environment variables
- IAM role for SSM access
- optional Route53 record

## Usage

```bash
cd infra/terraform/aws
cp terraform.tfvars.example terraform.tfvars
terraform init
terraform plan
terraform apply
```

## Notes

- The scaffold expects an existing VPC and subnets.
- The generated secret contains placeholder values for shared AI and GitHub credentials and must be updated after apply.
- The EC2 user data only prepares the host. It does not clone this repository or deploy compose automatically.

