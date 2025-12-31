#!/bin/bash
# MongoDB 用户创建脚本
# 此脚本在 MongoDB 容器首次启动时自动执行（在 /docker-entrypoint-initdb.d/ 目录下）

# 获取环境变量
DB_NAME="${MONGO_INITDB_DATABASE:-calicosBlog}"
APP_USERNAME="${MONGO_APP_USERNAME:-calico_user}"
APP_PASSWORD="${MONGO_APP_PASSWORD}"
ROOT_USERNAME="${MONGO_INITDB_ROOT_USERNAME:-admin}"
ROOT_PASSWORD="${MONGO_INITDB_ROOT_PASSWORD}"

if [ -z "$APP_PASSWORD" ]; then
  echo "⚠️  警告：MONGO_APP_PASSWORD 未设置，无法创建应用用户"
  echo "   应用将无法连接到数据库，请设置 MONGO_APP_PASSWORD 环境变量"
  exit 0  # 不退出，让其他初始化脚本继续执行
fi

echo "📝 正在创建应用用户: $APP_USERNAME"

# 使用 root 用户创建应用用户
# 注意：在初始化阶段，MongoDB 还没有启用认证，所以可以直接连接
mongosh --quiet <<EOF
use $DB_NAME
try {
  const user = db.getUser("$APP_USERNAME");
  print("⚠️  用户 $APP_USERNAME 已存在，跳过创建");
} catch (e) {
  db.createUser({
    user: "$APP_USERNAME",
    pwd: "$APP_PASSWORD",
    roles: [
      {
        role: "readWrite",
        db: "$DB_NAME"
      }
    ]
  });
  print("✅ 应用用户创建成功: $APP_USERNAME");
}
EOF

