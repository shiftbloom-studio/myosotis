#!/usr/bin/env bash
set -euo pipefail

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
OUTPUT_FILE="${SCRIPT_DIR}/.env.shared"
SECRET_ID="${MYOSOTIS_SECRET_ID:-myosotis/app-env}"
AWS_REGION="${AWS_REGION:-eu-west-1}"

require() {
  command -v "$1" >/dev/null 2>&1 || {
    echo "Missing required command: $1" >&2
    exit 1
  }
}

require aws
require jq

tmp_json="$(mktemp)"
trap 'rm -f "${tmp_json}"' EXIT

aws secretsmanager get-secret-value \
  --secret-id "${SECRET_ID}" \
  --region "${AWS_REGION}" \
  --query SecretString \
  --output text >"${tmp_json}"

jq -r '
  to_entries
  | sort_by(.key)
  | .[]
  | "\(.key)=\(.value | tostring)"
' "${tmp_json}" | sed 's/[$]/$$/g' >"${OUTPUT_FILE}"

chmod 600 "${OUTPUT_FILE}"
echo "Rendered ${OUTPUT_FILE} from ${SECRET_ID}"
