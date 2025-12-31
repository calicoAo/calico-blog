#!/bin/bash
# MongoDB 用户诊断脚本
# 用于检查用户是否存在以及测试连接

set -e

echo "🔍 MongoDB 用户诊断..."

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

if [ -z "$ROOT_PASSWORD" ]; then
  echo "❌ 错误：MONGO_ROOT_PASSWORD 未设置"
  exit 1
fi

echo "📋 配置信息："
echo "   数据库: $DB_NAME"
echo "   应用用户名: $APP_USERNAME"
echo "   Root 用户名: $ROOT_USERNAME"
echo ""

# 检查 MongoDB 容器是否运行
if ! docker ps | grep -q calico-mongo; then
  echo "❌ MongoDB 容器未运行"
  exit 1
fi

echo "✅ MongoDB 容器正在运行"
echo ""

# 列出所有用户
echo "📝 检查数据库中的用户..."
docker exec calico-mongo mongosh -u "$ROOT_USERNAME" -p "$ROOT_PASSWORD" --authenticationDatabase admin --quiet <<EOF
use $DB_NAME
print("数据库: $DB_NAME");
print("用户列表:");
try {
  const users = db.getUsers();
  if (users.users && users.users.length > 0) {
    users.users.forEach(function(user) {
      print("  - 用户名: " + user.user);
      print("    角色: " + JSON.stringify(user.roles));
    });
  } else {
    print("  ⚠️  没有找到用户");
  }
} catch (e) {
  print("  ❌ 错误: " + e.message);
}
EOF

echo ""

# 检查应用用户是否存在
echo "🔍 检查应用用户是否存在..."
USER_EXISTS=$(docker exec calico-mongo mongosh -u "$ROOT_USERNAME" -p "$ROOT_PASSWORD" --authenticationDatabase admin --quiet --eval "use $DB_NAME; try { db.getUser('$APP_USERNAME'); print('EXISTS'); } catch(e) { print('NOT_EXISTS'); }" | grep -E "EXISTS|NOT_EXISTS")

if [ "$USER_EXISTS" = "EXISTS" ]; then
  echo "✅ 用户 $APP_USERNAME 存在"
  
  # 测试连接
  if [ -n "$APP_PASSWORD" ]; then
    echo ""
    echo "🧪 测试应用用户连接..."
    TEST_RESULT=$(docker exec calico-mongo mongosh -u "$APP_USERNAME" -p "$APP_PASSWORD" --authenticationDatabase "$DB_NAME" --quiet --eval "db.runCommand({connectionStatus: 1})" 2>&1)
    
    if echo "$TEST_RESULT" | grep -q "authenticatedUsers"; then
      echo "✅ 应用用户连接测试成功"
    else
      echo "❌ 应用用户连接测试失败"
      echo "   错误信息: $TEST_RESULT"
      echo ""
      echo "💡 可能的原因："
      echo "   1. 密码不正确"
      echo "   2. authSource 配置错误"
      echo "   3. 用户权限不足"
    fi
  else
    echo "⚠️  MONGO_APP_PASSWORD 未设置，无法测试连接"
  fi
else
  echo "❌ 用户 $APP_USERNAME 不存在"
  echo ""
  echo "💡 解决方案：运行以下命令创建用户："
  echo "   ./scripts/create-mongo-user.sh"
fi

echo ""
echo "📝 连接字符串（用于调试）："
if [ -n "$APP_PASSWORD" ]; then
  # URL 编码密码（处理特殊字符）
  ENCODED_PASSWORD=$(python3 -c "import urllib.parse; print(urllib.parse.quote('$APP_PASSWORD'))" 2>/dev/null || echo "$APP_PASSWORD")
  echo "   mongodb://$APP_USERNAME:$ENCODED_PASSWORD@mongo:27017/$DB_NAME?authSource=$DB_NAME"
else
  echo "   mongodb://$APP_USERNAME:****@mongo:27017/$DB_NAME?authSource=$DB_NAME"
fi

