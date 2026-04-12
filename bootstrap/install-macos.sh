#!/usr/bin/env bash
set -euo pipefail

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
# shellcheck source=bootstrap/lib/common.sh
source "${SCRIPT_DIR}/lib/common.sh"

require_cmd brew

brew update
brew install bun gh jq awscli node

if ! command -v docker >/dev/null 2>&1; then
  brew install --cask docker
fi

if ! command -v claude >/dev/null 2>&1; then
  curl -fsSL https://claude.ai/install.sh | bash
fi

if ! command -v codex >/dev/null 2>&1; then
  npm install -g @openai/codex
fi

"${SCRIPT_DIR}/install-common.sh"

