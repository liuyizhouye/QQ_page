#!/usr/bin/env bash
set -euo pipefail

ARTIFACT_PATH="${1:?usage: deploy-ecs.sh /path/to/release.tar.gz}"

APP_NAME="${APP_NAME:-qq-story-api}"
DEPLOY_ROOT="${DEPLOY_ROOT:-/root/QQ_page}"
STATIC_ROOT="${STATIC_ROOT:-/srv/www/hanbaodoudou.com}"
DATA_ROOT="${DATA_ROOT:-/srv/qq-story}"
CADDY_ROOT="${CADDY_ROOT:-/root/server/deploy/cloud}"
RELEASE_ID="${RELEASE_ID:-$(date +%Y%m%d%H%M%S)}"
WORK_DIR="$(mktemp -d "/tmp/qq-page-release.${RELEASE_ID}.XXXXXX")"

cleanup() {
  rm -rf "$WORK_DIR"
}

trap cleanup EXIT

wait_for_http() {
  local name="$1"
  local url="$2"
  local attempt

  for attempt in $(seq 1 10); do
    if curl --fail --silent --show-error --max-time 20 "$url" >/dev/null; then
      echo "Health check passed: $name"
      return 0
    fi

    sleep 2
  done

  echo "Health check failed: $name ($url)" >&2
  return 1
}

if [[ ! -f "$ARTIFACT_PATH" ]]; then
  echo "Release artifact not found: $ARTIFACT_PATH" >&2
  exit 1
fi

echo "==> Extracting release artifact"
tar -xzf "$ARTIFACT_PATH" -C "$WORK_DIR"

if [[ ! -d "$WORK_DIR/docs" || ! -d "$WORK_DIR/server" ]]; then
  echo "Release artifact is missing docs/ or server/" >&2
  exit 1
fi

echo "==> Ensuring live directories exist"
mkdir -p \
  "$STATIC_ROOT" \
  "$DEPLOY_ROOT" \
  "$CADDY_ROOT" \
  "$DATA_ROOT/data" \
  "$DATA_ROOT/uploads" \
  "$DATA_ROOT/logs"

echo "==> Installing production dependencies in release workspace"
pushd "$WORK_DIR/server" >/dev/null
npm ci --omit=dev
npm rebuild better-sqlite3
popd >/dev/null

echo "==> Syncing public site"
rsync -a --delete "$WORK_DIR/docs/" "$STATIC_ROOT/"

echo "==> Syncing repository mirror"
rsync -a --delete \
  --exclude ".git/" \
  --exclude "server/.env" \
  --exclude "server/database/" \
  --exclude "server/uploads/" \
  --exclude "server/logs/" \
  "$WORK_DIR/" "$DEPLOY_ROOT/"

mkdir -p \
  "$DEPLOY_ROOT/server/database" \
  "$DEPLOY_ROOT/server/uploads" \
  "$DEPLOY_ROOT/server/logs"

echo "==> Updating active Caddy config"
install -m 644 "$DEPLOY_ROOT/server/deploy/cloud/Caddyfile" "$CADDY_ROOT/Caddyfile"
install -m 644 "$DEPLOY_ROOT/server/deploy/cloud/compose.yaml" "$CADDY_ROOT/compose.yaml"

echo "==> Restarting API"
pushd "$DEPLOY_ROOT/server" >/dev/null
if pm2 describe "$APP_NAME" >/dev/null 2>&1; then
  pm2 restart "$APP_NAME" --update-env
else
  pm2 start src/app.js --name "$APP_NAME" --cwd "$DEPLOY_ROOT/server"
fi
pm2 save
popd >/dev/null

echo "==> Reloading Caddy"
pushd "$CADDY_ROOT" >/dev/null
docker compose up -d
popd >/dev/null

echo "==> Running health checks"
sleep 3
wait_for_http "local-api" "http://127.0.0.1:8080/health"
wait_for_http "public-api" "https://api.hanbaodoudou.com/health"
wait_for_http "public-site" "https://hanbaodoudou.com"

echo "Deploy completed successfully: $RELEASE_ID"
