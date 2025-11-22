#!/bin/bash
# 检查 ECS 上的后端服务状态

echo "=== 检查 ECS 后端服务状态 ==="
echo ""

# 1. 检查 API 是否可访问
echo "1. 检查 API 可访问性..."
API_STATUS=$(curl -s -o /dev/null -w "%{http_code}" https://api.hanbaodoudou.com/api/milestones 2>/dev/null)
if [ "$API_STATUS" = "200" ]; then
    echo "   ✅ API 可访问 (HTTP $API_STATUS)"
else
    echo "   ❌ API 无法访问 (HTTP $API_STATUS)"
    echo "   请检查 ECS 上的服务是否运行"
fi
echo ""

# 2. 检查 Caddy 服务
echo "2. 检查 Caddy 服务..."
echo "   请在 ECS 上运行以下命令："
echo "   docker ps | grep caddy"
echo "   docker logs caddy 2>&1 | tail -20"
echo ""

# 3. 检查 Node.js 后端服务
echo "3. 检查 Node.js 后端服务..."
echo "   请在 ECS 上运行以下命令："
echo "   pm2 list"
echo "   pm2 logs qq-story-api --lines 20"
echo "   curl http://127.0.0.1:8080/health"
echo ""

# 4. 检查数据库文件
echo "4. 检查数据库文件..."
echo "   请在 ECS 上运行以下命令："
echo "   ls -lh ~/QQ_page/server/database/qq_story.db"
echo "   sqlite3 ~/QQ_page/server/database/qq_story.db 'SELECT COUNT(*) FROM moments;'"
echo "   sqlite3 ~/QQ_page/server/database/qq_story.db 'SELECT COUNT(*) FROM comments;'"
echo ""

echo "=== 诊断完成 ==="
echo ""
echo "如果服务未运行，请执行："
echo "  cd ~/QQ_page/server"
echo "  pm2 start src/app.js --name qq-story-api"
echo "  pm2 save"
echo ""

