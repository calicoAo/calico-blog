#!/bin/bash
# 初始化数据库脚本
# 用于创建索引和管理员账户

set -e

echo "🗄️  初始化数据库..."

# 加载环境变量
if [ -f .env ]; then
    export $(cat .env | grep -v '^#' | xargs)
fi

# 检查服务器容器是否运行
if ! docker ps | grep -q calico-server; then
  echo "❌ 服务器容器未运行，请先启动容器"
  exit 1
fi

echo "✅ 服务器容器正在运行"
echo ""

# 运行数据库初始化脚本
echo "📝 正在初始化数据库..."
echo "   这将创建索引和默认管理员账户（如果不存在）"
echo ""

docker exec calico-server npm run init-db

echo ""
echo "✅ 数据库初始化完成！"
echo ""
echo "📋 默认管理员账户信息："
echo "   邮箱: ${ADMIN_EMAIL:-admin@calico-blog.com}"
echo "   用户名: ${ADMIN_USERNAME:-admin}"
echo "   密码: ${ADMIN_PASSWORD:-admin123456}"
echo ""
echo "⚠️  请尽快修改默认密码！"

