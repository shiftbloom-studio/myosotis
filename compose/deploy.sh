#!/usr/bin/env bash
set -euo pipefail

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"

if [[ ! -f "${SCRIPT_DIR}/.env.shared" ]]; then
  echo "compose/.env.shared is missing. Run compose/render-env-from-secret.sh first." >&2
  exit 1
fi

docker compose --env-file "${SCRIPT_DIR}/.env.shared" -f "${SCRIPT_DIR}/docker-compose.yml" pull
docker compose --env-file "${SCRIPT_DIR}/.env.shared" -f "${SCRIPT_DIR}/docker-compose.yml" up -d --build
docker compose --env-file "${SCRIPT_DIR}/.env.shared" -f "${SCRIPT_DIR}/docker-compose.yml" ps
