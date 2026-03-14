#!/usr/bin/env bash
set -euo pipefail

REPO_ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
OUTPUT_PATH="${1:-$REPO_ROOT/qq-page-release.tar.gz}"

mkdir -p "$(dirname "$OUTPUT_PATH")"
rm -f "$OUTPUT_PATH"

cd "$REPO_ROOT"

git ls-files -z --cached --others --exclude-standard \
  | tar --null --files-from - -czf "$OUTPUT_PATH"

echo "Created release artifact: $OUTPUT_PATH"
