# Reference Product Repository

Each Shiftbloom product repository should receive the following managed anchors:

- `.archon/config.yaml`
- `.archon/mcp/github.json`
- `.archon/mcp/postgres_ro.json`
- `.archon/workflows/shiftbloom-plan-to-pr.yaml`
- `.archon/workflows/shiftbloom-pr-review.yaml`
- `AGENTS.md`
- `CLAUDE.md`

## Expected Repository Behavior

- the repository keeps its own workflows in git
- Shiftbloom-specific instructions are available to both Codex and Claude
- MCP profile names remain stable across repositories
- repository-specific environment variables can still be added on top

## Sync Contract

The repository-level sync is intentionally opinionated:

- managed files are overwritten from `templates/project/`
- local backups are created before overwriting existing files
- project-specific customization should happen in clearly marked repository sections or in additional non-managed files

## Recommended Pilot

Start with one repository that exercises:

- backend changes
- frontend changes
- CI or ops changes
- a read-only product database connection

This gives enough surface area to validate the whole Shiftbloom baseline before rolling it out more broadly.

