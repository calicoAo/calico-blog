#!/bin/bash
# 检查管理员用户脚本

set -e

echo "🔍 检查管理员用户..."

# 加载环境变量
if [ -f .env ]; then
    export $(cat .env | grep -v '^#' | xargs)
fi

# 检查服务器容器是否运行
if ! docker ps | grep -q calico-server; then
  echo "❌ 服务器容器未运行"
  exit 1
fi

ADMIN_EMAIL="${ADMIN_EMAIL:-admin@calico-blog.com}"

echo "📝 正在检查用户: $ADMIN_EMAIL"
echo ""

# 运行检查用户脚本
docker exec calico-server npm run check-user -- "$ADMIN_EMAIL" || {
  echo ""
  echo "❌ 用户不存在或检查失败"
  echo ""
  echo "💡 解决方案：运行数据库初始化脚本"
  echo "   ./scripts/init-database.sh"
  exit 1
}

