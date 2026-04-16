# Canonical MCP Profiles

These are the canonical Myosotis MCP profile templates.

The repository currently ships with starter conventions shaped by Shiftbloom
Studio. Fork them, rename them, or replace them with your own organization
defaults.

- `github.json`
- `postgres_ro.json`

Use the same names in:

- Codex global configuration
- Claude global configuration
- repository-local `.myosotis/mcp/` files

`postgres_ro` must remain read-only and must not target the Archon metadata database.
