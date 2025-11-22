#!/bin/bash
# QQ Story 后端诊断脚本

echo "========================================="
echo "QQ Story Backend Diagnostics"
echo "========================================="
echo ""

echo "1. 检查 .env 文件"
echo "-----------------"
if [ -f .env ]; then
    cat .env
else
    echo "❌ .env 文件不存在"
fi
echo ""

echo "2. 检查端口占用"
echo "-----------------"
netstat -tlnp | grep 8080
echo ""

echo "3. 检查 Node.js 进程"
echo "-----------------"
ps aux | grep node | grep -v grep
echo ""

echo "4. 测试启动服务（前台模式，5秒后自动退出）"
echo "-----------------"
timeout 5 node src/app.js 2>&1 &
sleep 6
echo ""

echo "5. 检查数据库文件"
echo "-----------------"
ls -la database/
echo ""

echo "6. 检查上传目录挂载"
echo "-----------------"
df -h | grep nas_uploads
ls -la /mnt/nas_uploads/ 2>/dev/null || echo "❌ NAS 未挂载"
echo ""

echo "7. 检查配置文件语法"
echo "-----------------"
node -e "import('./src/config.js').then(c => console.log('✅ config.js 正常')).catch(e => console.log('❌ config.js 错误:', e.message))"
echo ""

echo "========================================="
echo "诊断完成"
echo "========================================="

