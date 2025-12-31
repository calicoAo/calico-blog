#!/bin/bash
# 修复 MongoDB 连接问题
# 重新创建用户并验证连接

set -e

echo "🔧 修复 MongoDB 连接..."

# 加载环境变量
if [ -f .env ]; then
    export $(cat .env | grep -v '^#' | xargs)
fi

# 获取配置
DB_NAME="${MONGO_DATABASE:-calicosBlog}"
APP_USERNAME="${MONGO_APP_USERNAME:-calico_user}"
APP_PASSWORD="${MONGO_APP_PASSWORD}"
ROOT_USERNAME="${MONGO_ROOT_USERNAME:-admin}"
ROOT_PASSWORD="${MONGO_ROOT_PASSWORD}"

if [ -z "$APP_PASSWORD" ]; then
  echo "❌ 错误：MONGO_APP_PASSWORD 未设置"
  exit 1
fi

if [ -z "$ROOT_PASSWORD" ]; then
  echo "❌ 错误：MONGO_ROOT_PASSWORD 未设置"
  exit 1
fi

echo "📝 步骤 1: 删除旧用户（如果存在）..."
docker exec calico-mongo mongosh -u "$ROOT_USERNAME" -p "$ROOT_PASSWORD" --authenticationDatabase admin --quiet --eval "
use('$DB_NAME');
try {
  db.dropUser('$APP_USERNAME');
  print('✅ 旧用户已删除');
} catch (e) {
  print('ℹ️  用户不存在，跳过删除');
}
"

echo ""
echo "📝 步骤 2: 创建新用户..."
docker exec calico-mongo mongosh -u "$ROOT_USERNAME" -p "$ROOT_PASSWORD" --authenticationDatabase admin --quiet --eval "
use('$DB_NAME');
db.createUser({
  user: '$APP_USERNAME',
  pwd: '$APP_PASSWORD',
  roles: [
    {
      role: 'readWrite',
      db: '$DB_NAME'
    }
  ]
});
print('✅ 用户创建成功: $APP_USERNAME');
"

echo ""
echo "📝 步骤 3: 验证用户连接..."
TEST_RESULT=$(docker exec calico-mongo mongosh -u "$APP_USERNAME" -p "$APP_PASSWORD" --authenticationDatabase "$DB_NAME" --quiet --eval "db.runCommand({connectionStatus: 1})" 2>&1)

if echo "$TEST_RESULT" | grep -q "authenticatedUsers"; then
  echo "✅ 用户连接验证成功"
else
  echo "❌ 用户连接验证失败"
  echo "   错误信息: $TEST_RESULT"
  exit 1
fi

echo ""
echo "📝 步骤 4: 重启服务器容器以应用新配置..."
docker-compose restart server

echo ""
echo "✅ 修复完成！"
echo "   等待 10 秒后检查服务器日志..."
sleep 10

echo ""
echo "📋 服务器日志（最后 20 行）："
docker logs calico-server --tail 20 | grep -i mongo || docker logs calico-server --tail 20

