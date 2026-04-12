#!/usr/bin/env bash
set -euo pipefail

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
# shellcheck source=bootstrap/lib/common.sh
source "${SCRIPT_DIR}/lib/common.sh"

TARGET_REPO="${1:-$PWD}"

[[ -d "${TARGET_REPO}" ]] || die "Target repo does not exist: ${TARGET_REPO}"

copy_managed_file "${REPO_ROOT}/templates/project/AGENTS.md" "${TARGET_REPO}/AGENTS.md"
copy_managed_file "${REPO_ROOT}/templates/project/CLAUDE.md" "${TARGET_REPO}/CLAUDE.md"
copy_managed_file "${REPO_ROOT}/templates/project/.archon/config.yaml" "${TARGET_REPO}/.archon/config.yaml"
copy_managed_dir "${REPO_ROOT}/templates/project/.archon/mcp" "${TARGET_REPO}/.archon/mcp"
copy_managed_dir "${REPO_ROOT}/templates/project/.archon/workflows" "${TARGET_REPO}/.archon/workflows"

log "Project template synchronized to ${TARGET_REPO}"

