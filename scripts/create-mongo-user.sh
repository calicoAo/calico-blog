#!/bin/bash
# 手动创建 MongoDB 应用用户脚本
# 用于在 MongoDB 容器已启动后创建或更新应用用户

set -e

echo "🔧 创建 MongoDB 应用用户..."

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
  echo "   请在 .env 文件中设置 MONGO_APP_PASSWORD"
  exit 1
fi

if [ -z "$ROOT_PASSWORD" ]; then
  echo "❌ 错误：MONGO_ROOT_PASSWORD 未设置"
  echo "   请在 .env 文件中设置 MONGO_ROOT_PASSWORD"
  exit 1
fi

echo "📝 正在创建/更新应用用户: $APP_USERNAME"
echo "   数据库: $DB_NAME"

# 在 MongoDB 容器中执行命令
docker exec calico-mongo mongosh -u "$ROOT_USERNAME" -p "$ROOT_PASSWORD" --authenticationDatabase admin --quiet --eval "
use('$DB_NAME');
try {
  const user = db.getUser('$APP_USERNAME');
  print('用户 $APP_USERNAME 已存在，正在更新密码...');
  db.changeUserPassword('$APP_USERNAME', '$APP_PASSWORD');
  print('✅ 用户密码已更新');
} catch (e) {
  print('用户不存在，正在创建...');
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
  print('✅ 应用用户创建成功: $APP_USERNAME');
}
"

echo "✅ 完成！"

