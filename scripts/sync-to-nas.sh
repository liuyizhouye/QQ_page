#!/usr/bin/env bash
set -euo pipefail

NAS_HOST="${NAS_HOST:?NAS_HOST is required}"
NAS_USER="${NAS_USER:-backup}"
NAS_ROOT="${NAS_ROOT:?NAS_ROOT is required}"

DATA_ROOT="${DATA_ROOT:-/srv/qq-story}"
DB_PATH="${DB_PATH:-$DATA_ROOT/data/qq_story.db}"
UPLOADS_DIR="${UPLOADS_DIR:-$DATA_ROOT/uploads}"
TMP_DIR="${TMP_DIR:-/tmp/qq-story-backup}"
SSH_KEY="${SSH_KEY:-/root/.ssh/qq_story_nas}"

require_command() {
  if ! command -v "$1" >/dev/null 2>&1; then
    echo "Missing required command: $1" >&2
    exit 1
  fi
}

require_path() {
  if [[ ! -e "$1" ]]; then
    echo "Required path does not exist: $1" >&2
    exit 1
  fi
}

require_command sqlite3
require_command rsync
require_command ssh

require_path "$DB_PATH"
require_path "$UPLOADS_DIR"
require_path "$SSH_KEY"

mkdir -p "$TMP_DIR"

SNAPSHOT_PATH="$TMP_DIR/qq_story.db"
SSH_TARGET="${NAS_USER}@${NAS_HOST}"
SSH_OPTS=(-i "$SSH_KEY" -o BatchMode=yes -o StrictHostKeyChecking=accept-new)

echo "==> Preparing NAS target directories"
ssh "${SSH_OPTS[@]}" "$SSH_TARGET" "mkdir -p '${NAS_ROOT}/database' '${NAS_ROOT}/uploads'"

echo "==> Creating SQLite snapshot"
sqlite3 "$DB_PATH" ".backup '$SNAPSHOT_PATH'"

echo "==> Syncing uploads"
rsync -az --delete -e "ssh ${SSH_OPTS[*]}" \
  "$UPLOADS_DIR/" "${SSH_TARGET}:${NAS_ROOT}/uploads/"

echo "==> Syncing database snapshot"
rsync -az -e "ssh ${SSH_OPTS[*]}" \
  "$SNAPSHOT_PATH" "${SSH_TARGET}:${NAS_ROOT}/database/qq_story.db"

echo "NAS sync completed successfully"
