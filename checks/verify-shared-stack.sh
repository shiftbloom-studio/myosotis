#!/usr/bin/env bash
set -euo pipefail

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
REPO_ROOT="$(cd "${SCRIPT_DIR}/.." && pwd)"
COMPOSE_DIR="${REPO_ROOT}/compose"
ENV_FILE="${COMPOSE_DIR}/.env.shared"
PORT="${PORT:-3000}"

[[ -f "${ENV_FILE}" ]] || {
  echo "compose/.env.shared is missing." >&2
  exit 1
}

docker compose -f "${COMPOSE_DIR}/docker-compose.yml" --env-file "${ENV_FILE}" config >/dev/null
docker compose -f "${COMPOSE_DIR}/docker-compose.yml" --env-file "${ENV_FILE}" ps
curl -fsS "http://127.0.0.1:${PORT}/api/health" >/dev/null

echo "Shared stack validation succeeded."

