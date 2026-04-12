# Architecture

## Goal

Shiftbloom uses one shared Archon v2 foundation across repositories and developer machines so that workflows, instructions, MCP naming, and team skills stay consistent.

## Diagram

```mermaid
flowchart LR
  subgraph Dev["Shiftbloom Developer Machines"]
    Dev1["Developer A/B/C"]
    LocalTools["Local Tooling\nCodex + Claude + gh + bun"]
    GlobalState["Global Managed Files\n~/.codex\n~/.claude\n~/.archon\n~/.agents/skills"]
    ProductRepo["Product Repository\n.archon\nAGENTS.md\nCLAUDE.md"]
    Dev1 --> LocalTools
    LocalTools --> GlobalState
    LocalTools --> ProductRepo
  end

  subgraph Setup["shiftbloom-archon-setup"]
    Bootstrap["bootstrap/\ninstall + sync scripts"]
    Templates["templates/\nglobal + project"]
    Skills["skills/\nShiftbloom team skills"]
    Mcp["mcp/\ncanonical MCP profiles"]
    Compose["compose/\nshared stack runtime"]
    Terraform["infra/terraform/aws/\nAWS scaffold"]
  end

  subgraph AWS["AWS Shared Stack"]
    DNS["External DNS for\narchon.shiftbloom.studio"]
    SG["Security Groups\n80/443 public\n5432 app -> db"]
    EC2["EC2\nArchon app + Caddy"]
    Secret["Secrets Manager\nruntime env + tokens"]
    SSM["AWS SSM\nops access"]
    RDS["RDS PostgreSQL\nArchon metadata only"]
    DNS --> EC2
    SG --> EC2
    SG --> RDS
    Secret --> EC2
    SSM --> EC2
    EC2 --> RDS
  end

  Setup --> Bootstrap
  Setup --> Templates
  Setup --> Skills
  Setup --> Mcp
  Setup --> Compose
  Setup --> Terraform

  Bootstrap --> GlobalState
  Bootstrap --> ProductRepo
  Templates --> ProductRepo
  Templates --> GlobalState
  Skills --> GlobalState
  Mcp --> ProductRepo
  Mcp --> GlobalState
  Compose --> EC2
  Terraform --> AWS

  ProductRepo --> EC2
  LocalTools --> EC2
```

Current target topology:

- shared runtime on AWS EC2
- Archon metadata in RDS PostgreSQL
- runtime configuration in Secrets Manager
- operations through SSM
- external DNS mapped to `archon.shiftbloom.studio`

## Shared Stack

The shared stack runs on AWS and consists of:

- one EC2 instance for the Archon application runtime
- one RDS PostgreSQL instance for Archon metadata only
- one Secrets Manager secret containing runtime environment variables
- AWS SSM for operational access
- Caddy for HTTPS termination and MVP basic auth

The shared stack is intended for:

- shared demos
- long-running workflows
- PR and review orchestration
- team-visible execution and monitoring

It is not intended to replace local developer usage.

## Local Developer Setup

Each developer gets:

- a local Codex setup
- a local Claude setup
- a shared set of Shiftbloom skills
- the same MCP profile names
- the same project anchor files in product repositories

Local usage remains important for:

- exploratory work
- pair debugging
- repo-specific experimentation
- tasks that should stay inside personal credentials

## Repository Model

There are two distribution targets:

1. Product repositories:
   - `.archon/`
   - `AGENTS.md`
   - `CLAUDE.md`
2. Developer home directories:
   - `~/.codex/`
   - `~/.claude/`
   - `~/.archon/.archon/workflows/`
   - `~/.agents/skills/`

Distribution is copy/sync based so the setup works the same on macOS, Linux, and WSL2.

## MCP Strategy

Canonical profiles:

- `github`
- `postgres_ro`

Rules:

- use the same profile names in Codex and Claude
- keep `postgres_ro` read-only
- never use the Archon metadata database as a general application MCP target
- document Claude-first behavior for node-level Archon workflow MCP usage

## AI Credential Strategy

The setup uses a hybrid model:

- shared stack uses dedicated service accounts for Claude and Codex
- local developers authenticate with personal accounts

This keeps team automation stable while preserving individual ownership and developer flexibility.
