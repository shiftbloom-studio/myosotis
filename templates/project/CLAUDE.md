# Shiftbloom Repository Claude Instructions

- Prefer the repository's `.archon/` workflows for planning, implementation, and review.
- When attaching MCP to workflow nodes, use only the repository-local canonical profile files under `.archon/mcp/`.
- If a task needs live product database access, use `postgres_ro` only and stay read-only.

