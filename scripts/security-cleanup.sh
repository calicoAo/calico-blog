#!/bin/bash
# 安全清理脚本
# 用于清理可能被入侵的痕迹

set -e

echo "🧹 安全清理工具"
echo "================================"
echo ""
echo "⚠️  警告：此脚本将执行以下操作："
echo "   1. 停止所有容器"
echo "   2. 清理可疑文件"
echo "   3. 重新拉取镜像（确保使用最新版本）"
echo "   4. 重启容器"
echo ""
read -p "确认继续？(yes/no): " confirm

if [ "$confirm" != "yes" ]; then
  echo "已取消"
  exit 0
fi

echo ""
echo "1️⃣ 停止所有容器..."
docker-compose down

echo ""
echo "2️⃣ 清理可疑文件..."
# 清理常见的临时目录
find /tmp -name "*.sh" -type f -mtime -1 -delete 2>/dev/null || true
find /var/tmp -name "*.sh" -type f -mtime -1 -delete 2>/dev/null || true
find /dev/shm -name "*.sh" -type f -mtime -1 -delete 2>/dev/null || true
find /tmp -name ".ts" -type f -mtime -1 -delete 2>/dev/null || true
find /var/tmp -name ".ts" -type f -mtime -1 -delete 2>/dev/null || true
find /dev/shm -name ".ts" -type f -mtime -1 -delete 2>/dev/null || true

echo "✅ 可疑文件已清理"

echo ""
echo "3️⃣ 清理 Docker 系统..."
docker system prune -f

echo ""
echo "4️⃣ 重新拉取镜像..."
docker-compose pull

echo ""
echo "5️⃣ 启动容器..."
docker-compose up -d

echo ""
echo "6️⃣ 等待服务就绪..."
sleep 10

echo ""
echo "✅ 清理完成！"
echo ""
echo "📋 建议后续操作："
echo "   1. 运行 ./scripts/security-check.sh 再次检查"
echo "   2. 检查应用日志：docker logs calico-server --tail 100"
echo "   3. 检查前端日志：docker logs calico-frontend --tail 100"
echo "   4. 修改所有密码（数据库、JWT密钥等）"
echo "   5. 检查是否有数据泄露"

