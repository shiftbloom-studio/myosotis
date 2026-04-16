#!/usr/bin/env bash
set -euo pipefail

TARGET_REPO="${1:-$PWD}"
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

check_file "${TARGET_REPO}/AGENTS.md"
check_file "${TARGET_REPO}/CLAUDE.md"
check_file "${TARGET_REPO}/.myosotis/config.yaml"
check_file "${TARGET_REPO}/.myosotis/mcp/github.json"
check_file "${TARGET_REPO}/.myosotis/mcp/postgres_ro.json"
check_file "${TARGET_REPO}/.myosotis/workflows/plan-to-pr.yaml"
check_file "${TARGET_REPO}/.myosotis/workflows/pr-review.yaml"

exit "${failures}"
