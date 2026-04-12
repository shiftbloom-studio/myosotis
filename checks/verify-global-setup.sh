#!/usr/bin/env bash
set -euo pipefail

failures=0

check_file() {
  local path="$1"
  if [[ -e "${path}" ]]; then
    printf '[ok] %s\n' "${path}"
  else
    printf '[missing] %s\n' "${path}" >&2
    failures=$((failures + 1))
  fi
}

check_cmd() {
  local cmd="$1"
  if command -v "${cmd}" >/dev/null 2>&1; then
    printf '[ok] command: %s\n' "${cmd}"
  else
    printf '[missing] command: %s\n' "${cmd}" >&2
    failures=$((failures + 1))
  fi
}

for cmd in bun gh aws jq claude codex; do
  check_cmd "${cmd}"
done

check_file "${HOME}/.codex/config.toml"
check_file "${HOME}/.codex/AGENTS.md"
check_file "${HOME}/.claude/CLAUDE.md"
check_file "${HOME}/.claude/mcp-configs/mcp-servers.json"
check_file "${HOME}/.archon/config.yaml"
check_file "${HOME}/.archon/.archon/workflows/shiftbloom-global-review.yaml"
check_file "${HOME}/.agents/skills/shiftbloom-archon/SKILL.md"
check_file "${HOME}/.codex/skills/shiftbloom-pr-review/SKILL.md"
check_file "${HOME}/.claude/skills/shiftbloom-devops/SKILL.md"

if rg -n 'REPLACE_ME' "${HOME}/.codex/config.toml" "${HOME}/.claude/mcp-configs/mcp-servers.json" >/dev/null 2>&1; then
  printf '[warn] Placeholder values still exist in global Codex or Claude config.\n'
fi

exit "${failures}"

