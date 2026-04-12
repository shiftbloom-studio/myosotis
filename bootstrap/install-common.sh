#!/usr/bin/env bash
set -euo pipefail

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
# shellcheck source=bootstrap/lib/common.sh
source "${SCRIPT_DIR}/lib/common.sh"

for cmd in git jq aws; do
  require_cmd "${cmd}"
done

"${SCRIPT_DIR}/sync-global.sh"

log "Common setup finished."
log "Next steps:"
log "  1. gh auth login"
log "  2. claude /login"
log "  3. codex --login"
log "  4. Run checks/verify-global-setup.sh"

