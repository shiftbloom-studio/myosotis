# Shiftbloom Archon

Use this skill when the task involves Archon workflows, setup, rollout, synchronization, or debugging the shared Shiftbloom Archon environment.

## Expectations

- Prefer repository-local `.archon/` workflows when available.
- Keep shared-stack changes compatible with `EC2 + Docker Compose + RDS`.
- Treat `github` and `postgres_ro` as the canonical MCP names.
- Do not use the Archon metadata database as a general-purpose product database.

