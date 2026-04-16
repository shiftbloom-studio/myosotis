#!/usr/bin/env bash
set -euo pipefail

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
# shellcheck source=bootstrap/lib/common.sh
source "${SCRIPT_DIR}/lib/common.sh"

mkdir -p "${HOME}/.codex"
mkdir -p "${HOME}/.claude/mcp-configs"
mkdir -p "${HOME}/.myosotis/.myosotis/workflows"
mkdir -p "${HOME}/.agents/skills"

render_managed_file "${REPO_ROOT}/templates/global/codex/config.toml" "${HOME}/.codex/config.toml"
copy_managed_file "${REPO_ROOT}/templates/global/codex/AGENTS.md" "${HOME}/.codex/AGENTS.md"

copy_managed_file "${REPO_ROOT}/templates/global/claude/CLAUDE.md" "${HOME}/.claude/CLAUDE.md"
render_managed_file "${REPO_ROOT}/templates/global/claude/mcp-servers.json" "${HOME}/.claude/mcp-configs/mcp-servers.json"

copy_managed_file "${REPO_ROOT}/templates/global/myosotis/config.yaml" "${HOME}/.myosotis/config.yaml"
copy_managed_dir "${REPO_ROOT}/templates/global/myosotis/.myosotis/workflows" "${HOME}/.myosotis/.myosotis/workflows"

copy_skill_set "${HOME}/.codex/skills"
copy_skill_set "${HOME}/.claude/skills"
copy_skill_set "${HOME}/.agents/skills"

log "Global Codex, Claude, Myosotis and skill setup synchronized."
