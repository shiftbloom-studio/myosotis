#!/usr/bin/env bash
set -euo pipefail

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
# shellcheck source=bootstrap/lib/common.sh
source "${SCRIPT_DIR}/lib/common.sh"

require_cmd sudo
require_cmd apt-get

sudo apt-get update
sudo apt-get install -y curl git jq awscli nodejs npm docker.io

if ! command -v bun >/dev/null 2>&1; then
  curl -fsSL https://bun.sh/install | bash
fi

if ! command -v gh >/dev/null 2>&1; then
  sudo apt-get install -y gh
fi

if ! command -v claude >/dev/null 2>&1; then
  curl -fsSL https://claude.ai/install.sh | bash
fi

if ! command -v codex >/dev/null 2>&1; then
  npm install -g @openai/codex
fi

log "WSL note: use Docker Desktop WSL integration or another approved Docker runtime."

"${SCRIPT_DIR}/install-common.sh"

