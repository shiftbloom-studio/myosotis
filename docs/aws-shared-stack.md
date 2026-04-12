# AWS Shared Stack

## Target Topology

- DNS name: `archon.shiftbloom.studio`
- Runtime host: one EC2 instance
- Database: one RDS PostgreSQL instance
- Secrets: one Secrets Manager secret for app runtime configuration
- Admin access: AWS SSM only

If public DNS is not ready yet, the shared stack can be bootstrapped temporarily with
`DOMAIN=http://<ec2-public-ip>`. That keeps Caddy in front of the app and allows basic-auth
protected access over HTTP until the final DNS record is delegated.

## Provisioning Inputs

The Terraform scaffold expects:

- an existing VPC
- at least two private subnets for RDS
- one public subnet for EC2
- an existing Route53 hosted zone if DNS should be managed automatically

## Runtime Files

The EC2 runtime uses:

- `compose/docker-compose.yml`
- `compose/Caddyfile`
- `compose/.env.shared`

The environment file is rendered from Secrets Manager rather than committed to git.

## Secrets Layout

The app secret should be a JSON object containing at least:

- `DOMAIN`
- `PORT`
- `DATABASE_URL`
- `ARCHON_DATA`
- `CADDY_BASIC_AUTH_USER`
- `CADDY_BASIC_AUTH_HASH`
- `CLAUDE_USE_GLOBAL_AUTH`
- `CLAUDE_CODE_OAUTH_TOKEN` or `CLAUDE_API_KEY`
- `CODEX_ID_TOKEN`
- `CODEX_ACCESS_TOKEN`
- `CODEX_REFRESH_TOKEN`
- `CODEX_ACCOUNT_ID`
- `GH_TOKEN`

For AWS RDS PostgreSQL, use
`?sslmode=require&uselibpqcompat=true` on `DATABASE_URL`. The current shared
Shiftbloom deployment requires SSL, and this keeps the Node/Postgres client aligned with
libpq-style `require` semantics instead of strict certificate verification.

## Shared Stack Update Flow

1. Update this setup repository.
2. Pull the setup repository changes onto the EC2 host.
3. Re-render `compose/.env.shared` from Secrets Manager.
4. Run `compose/deploy.sh`.
5. Validate with `checks/verify-shared-stack.sh`.

## MVP Security Model

The initial baseline intentionally stays simple:

- public HTTPS endpoint through Caddy
- Caddy basic auth
- SSM instead of SSH
- least-privilege security group between EC2 and RDS

Future upgrades such as SSO, private ALB, WAF, or split admin/public paths can be added later without changing the local developer contract.
