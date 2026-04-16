# Myosotis

[![License: AGPL-3.0](https://img.shields.io/badge/license-AGPL--3.0-black.svg)](./LICENSE)
[![Next.js](https://img.shields.io/badge/Next.js-16-black)](https://nextjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5-3178C6)](https://www.typescriptlang.org/)
[![Docker Compose](https://img.shields.io/badge/Deploy-Docker_Compose-2496ED)](./compose/docker-compose.yml)
[![AWS](https://img.shields.io/badge/Infra-AWS-FF9900)](./infra/terraform/aws)

Myosotis is an open-source control surface for AI-native workspace setup.

It gives teams a git-first way to manage:

- MCP server profiles
- reusable `SKILL.md` packs
- Claude and Codex instruction layers
- self-hosted deployment workflows

Instead of hiding this setup behind a database or an internal admin panel, Myosotis keeps the source of truth in plain files you can review, diff, fork, and ship.

> Forget-me-not for your AI workspace.

## Why Myosotis

- Git-first: changes stay readable, reviewable, and easy to revert.
- File-native: MCP configs, skills, and instructions remain regular repository assets.
- Self-hostable: local Next.js app, Docker Compose runtime, and AWS EC2 scaffold included.
- Forkable: bundled starter packs are easy to replace with your own org conventions.
- Multi-surface: designed for Claude Code, Codex, and custom agent environments.

## What You Can Do

### 1. Manage MCP Profiles

Edit canonical MCP commands, arguments, descriptions, and environment placeholders in one place, then sync them back into versioned JSON templates.

### 2. Curate Skill Libraries

Maintain reusable `SKILL.md` directories for prompt-engineered workflows, domain playbooks, and operational recipes.

### 3. Layer Instructions

Keep global and project instruction files for Claude and Codex side by side, with a UI that makes changes obvious before writing them to disk.

### 4. Self-Host the Workspace

Run the app locally for editing or deploy it to EC2 behind Caddy with the included Docker Compose and Terraform scaffold.

## Repository Layout

- `web/` Next.js application for the Myosotis workspace
- `compose/` Docker Compose runtime and deployment helpers
- `infra/terraform/aws/` AWS scaffold for EC2, RDS, Secrets Manager, and SSM
- `templates/` global and project instruction templates
- `mcp/` canonical MCP profile templates
- `skills/` bundled starter skills
- `bootstrap/` local sync and setup scripts
- `checks/` verification scripts
- `docs/` architecture and operations notes

## Quick Start

### Run Locally

```bash
cd web
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

The UI reads from the repository root by default via `CONFIG_ROOT`, so you can edit the local `mcp/`, `skills/`, and `templates/` directories directly.

### Build for Production

```bash
cd web
npm run lint
npm run build
```

## Self-Hosting

### Docker Compose

```bash
cd compose
cp .env.shared.example .env.shared
bash deploy.sh
```

### AWS EC2

The repo ships with a minimal Terraform scaffold for:

- EC2 runtime host
- RDS PostgreSQL
- Secrets Manager runtime config
- IAM + SSM access
- optional Route53 record

Start here:

```bash
cd infra/terraform/aws
cp terraform.tfvars.example terraform.tfvars
terraform init
terraform plan
terraform apply
```

Then deploy the compose stack on the target host.

## Open-Source Posture

Myosotis is structured to be reusable outside the originating organization.

That means:

- the app branding now stands on its own
- the setup flow is documented for public self-hosting
- contributor docs, support docs, and security guidance are included
- starter assets in `skills/` and `templates/` can be treated as examples, not hard requirements

Some bundled content still reflects the original Shiftbloom Studio conventions. That is intentional: the repo includes a real starter kit, not an empty shell. Replace those examples with your own names, prompts, and workflows as you fork.

## Built by Shiftbloom

Myosotis is maintained by Shiftbloom Studio.

If you want to help shape tools for open creative engineering, design systems, and AI-native workflow infrastructure:

**Let’s build open -> [join Shiftbloom](https://shiftbloom.studio)**

## Contributing

Issues, pull requests, and starter-pack improvements are welcome.

Start with:

- [CONTRIBUTING.md](./CONTRIBUTING.md)
- [CODE_OF_CONDUCT.md](./CODE_OF_CONDUCT.md)
- [SECURITY.md](./SECURITY.md)
- [SUPPORT.md](./SUPPORT.md)

## Roadmap Ideas

- import/export flows for starter packs
- multi-workspace support
- better diff views for prompt and instruction changes
- starter-pack marketplace patterns
- deployment presets beyond EC2

## License

Licensed under [AGPL-3.0-only](./LICENSE).
