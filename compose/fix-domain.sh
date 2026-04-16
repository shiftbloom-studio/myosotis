#!/usr/bin/env bash
# fix-domain.sh — Switch Archon from IP-fallback to ai.shiftbloom.studio
# Run on EC2 via SSM:
#   aws ssm start-session --target i-09f6afb95a0c61c6e --region eu-west-1
#   sudo bash /opt/shiftbloom-archon/compose/fix-domain.sh
set -euo pipefail

SECRET_ID="shiftbloom-archon/app-env"
REGION="eu-west-1"
NEW_DOMAIN="ai.shiftbloom.studio"
COMPOSE_DIR="/opt/shiftbloom-archon/compose"

echo "=== Step 0: Preflight ==="
echo "Checking DNS for ${NEW_DOMAIN}..."
RESOLVED_IP=$(dig +short "${NEW_DOMAIN}" A 2>/dev/null || true)
if [ -z "${RESOLVED_IP}" ]; then
  echo "WARNING: ${NEW_DOMAIN} does not resolve to any IP."
  echo "Make sure the DNS A-record points to this instance's public IP before running."
  echo "You can set it and re-run this script."
  read -r -p "Continue anyway? (y/N) " confirm
  [[ "${confirm}" =~ ^[Yy]$ ]] || exit 1
else
  echo "${NEW_DOMAIN} -> ${RESOLVED_IP}"
fi

echo ""
echo "=== Step 1: Update DOMAIN in Secrets Manager ==="
# Read current secret
CURRENT_JSON=$(aws secretsmanager get-secret-value \
  --secret-id "${SECRET_ID}" \
  --region "${REGION}" \
  --query SecretString \
  --output text)

echo "Current DOMAIN value:"
echo "${CURRENT_JSON}" | jq -r '.DOMAIN'

# Update DOMAIN to the bare hostname (Caddy auto-provisions HTTPS)
UPDATED_JSON=$(echo "${CURRENT_JSON}" | jq --arg d "${NEW_DOMAIN}" '.DOMAIN = $d')

aws secretsmanager put-secret-value \
  --secret-id "${SECRET_ID}" \
  --region "${REGION}" \
  --secret-string "${UPDATED_JSON}"

echo "DOMAIN updated to: ${NEW_DOMAIN}"

echo ""
echo "=== Step 2: Re-render .env.shared ==="
cd "${COMPOSE_DIR}"
bash render-env-from-secret.sh
echo "Rendered .env.shared — verifying DOMAIN line:"
grep '^DOMAIN=' .env.shared

echo ""
echo "=== Step 3: Restart Docker Compose stack ==="
docker compose down
docker compose up -d

echo ""
echo "=== Step 4: Wait for health check ==="
echo "Waiting for app container to become healthy..."
for i in $(seq 1 30); do
  STATUS=$(docker compose ps --format json 2>/dev/null | jq -r 'select(.Service=="app") | .Health' 2>/dev/null || echo "starting")
  if [ "${STATUS}" = "healthy" ]; then
    echo "App is healthy after ~$((i * 5))s"
    break
  fi
  echo "  ...attempt ${i}/30 (status: ${STATUS})"
  sleep 5
done

echo ""
echo "=== Step 5: Verify ==="
echo "Docker status:"
docker compose ps

echo ""
echo "Health endpoint:"
curl -fsS "http://127.0.0.1:3000/api/health" 2>&1 || echo "Health check failed!"

echo ""
echo "Caddy logs (last 20 lines):"
docker compose logs caddy --tail 20

echo ""
echo "=== Done ==="
echo "Test: https://${NEW_DOMAIN}/api/health"
echo "Caddy will auto-provision a Let's Encrypt certificate on first request."
echo ""
echo "If you see certificate errors, check:"
echo "  1. DNS A-record points to this instance's public IP"
echo "  2. Ports 80 + 443 are open in the Security Group"
echo "  3. docker compose logs caddy"
