# Shiftbloom Studio Archon Setup

License: AGPL-3.0-only

`shiftbloom-archon-setup` is the source of truth for the internal Archon v2 setup at Shiftbloom Studio.

It standardizes:

- the shared Archon stack on AWS
- the local developer bootstrap for macOS, Linux, and WSL2
- the project-level Archon anchors (`.archon/`, `AGENTS.md`, `CLAUDE.md`)
- the global Codex and Claude setup
- the team MCP profiles and reusable skills

## Repository Layout

- `compose/` shared-stack runtime for EC2
- `bootstrap/` local installation and sync scripts
- `infra/terraform/aws/` AWS infrastructure scaffold
- `templates/project/` files synchronized into product repositories
- `templates/global/` files synchronized into developer home directories
- `mcp/` canonical MCP profile templates
- `skills/` Shiftbloom team skills
- `docs/` architecture, onboarding, operations, and rollout guidance
- `checks/` verification scripts for local, project, and shared-stack setup

## Operating Model

- Shared stack:
  - `EC2 + Docker Compose`
  - `RDS PostgreSQL` for Archon metadata only
  - `AWS Secrets Manager` for runtime secrets
  - `AWS SSM` for administration
  - `Caddy` with HTTPS and basic auth for the MVP
- Local developer setup:
  - primary platform `macOS`
  - supported `Linux`
  - `Windows` only via `WSL2`
- AI agents:
  - `Claude Code` and `Codex` are both supported
  - shared workflows use dedicated service accounts
  - local work uses each developer's own login

## Important Constraints

- Archon v2 workflow MCP support is currently `Claude-first`. The same profile names are still standardized for Codex, but node-level Archon MCP fields should be treated as Claude-specific until upstream behavior changes.
- `postgres_ro` is a template for read-only product database access. It must never point at the Archon metadata database.
- This repository is designed for copy/sync distribution, not symlink or submodule distribution.

## Typical Usage

1. Provision AWS base infrastructure from `infra/terraform/aws/`.
2. Prepare the shared stack on the EC2 instance using `compose/`.
3. Run a local bootstrap from `bootstrap/`.
4. Sync `templates/project/` into a reference product repository.
5. Validate the result with the scripts in `checks/`.

## First Files to Read

- `docs/architecture.md`
- `docs/aws-shared-stack.md`
- `docs/onboarding.md`
- `docs/reference-product-repo.md`
