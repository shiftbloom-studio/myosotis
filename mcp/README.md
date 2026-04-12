# Canonical MCP Profiles

These are the canonical Shiftbloom MCP profile templates.

- `github.json`
- `postgres_ro.json`

Use the same names in:

- Codex global configuration
- Claude global configuration
- repository-local `.archon/mcp/` files

`postgres_ro` must remain read-only and must not target the Archon metadata database.

