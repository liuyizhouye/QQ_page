#!/bin/bash
set -euo pipefail

echo "=== 检查 ECS 当前服务状态 ==="
echo

echo "1. 检查主站与 API..."
curl -I https://hanbaodoudou.com || true
curl -I https://www.hanbaodoudou.com || true
curl https://api.hanbaodoudou.com/health || true
echo

echo "2. 检查 PM2..."
pm2 list || true
echo

echo "3. 检查本机 API..."
curl http://127.0.0.1:8080/health || true
echo

echo "4. 检查 Docker / Caddy..."
docker ps || true
echo

echo "5. 检查运行时目录..."
ls -lh /srv/qq-story/data/qq_story.db || true
ls -ld /srv/qq-story/uploads || true
ls -ld /srv/www/hanbaodoudou.com || true
echo

echo "=== 诊断完成 ==="
