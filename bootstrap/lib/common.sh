#!/usr/bin/env bash
set -euo pipefail

BOOTSTRAP_LIB_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
BOOTSTRAP_DIR="$(cd "${BOOTSTRAP_LIB_DIR}/.." && pwd)"
REPO_ROOT="$(cd "${BOOTSTRAP_DIR}/.." && pwd)"
BACKUP_SUFFIX="$(date +%Y%m%d%H%M%S)"

log() {
  printf '[shiftbloom-bootstrap] %s\n' "$*"
}

die() {
  printf '[shiftbloom-bootstrap] ERROR: %s\n' "$*" >&2
  exit 1
}

require_cmd() {
  command -v "$1" >/dev/null 2>&1 || die "Missing required command: $1"
}

backup_if_exists() {
  local target="$1"
  if [[ -e "${target}" ]]; then
    cp -R "${target}" "${target}.bak.${BACKUP_SUFFIX}"
    log "Backed up ${target} -> ${target}.bak.${BACKUP_SUFFIX}"
  fi
}

copy_managed_file() {
  local source="$1"
  local target="$2"
  mkdir -p "$(dirname "${target}")"
  backup_if_exists "${target}"
  cp "${source}" "${target}"
}

copy_managed_dir() {
  local source="$1"
  local target="$2"
  mkdir -p "$(dirname "${target}")"
  backup_if_exists "${target}"
  rm -rf "${target}"
  cp -R "${source}" "${target}"
}

render_managed_file() {
  local source="$1"
  local target="$2"
  local gh_token="${GH_TOKEN:-REPLACE_ME}"
  local pg_url="${POSTGRES_RO_DATABASE_URL:-postgresql://readonly:REPLACE_ME@example-host:5432/app}"
  local home_dir="${HOME}"

  mkdir -p "$(dirname "${target}")"
  backup_if_exists "${target}"

  sed \
    -e "s|__HOME__|${home_dir}|g" \
    -e "s|__GITHUB_TOKEN__|${gh_token}|g" \
    -e "s|__POSTGRES_RO_DATABASE_URL__|${pg_url}|g" \
    "${source}" >"${target}"
}

copy_skill_set() {
  local source_dir="${REPO_ROOT}/skills"
  local target_root="$1"

  mkdir -p "${target_root}"
  for skill_dir in "${source_dir}"/*; do
    [[ -d "${skill_dir}" ]] || continue
    copy_managed_dir "${skill_dir}" "${target_root}/$(basename "${skill_dir}")"
  done
}

