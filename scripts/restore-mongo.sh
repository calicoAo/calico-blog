#!/bin/bash
set -e

BACKUP_FILE=$1
CONTAINER_NAME="calico-mongo"
DB_NAME="${MONGO_DATABASE:-calicosBlog}"
DB_USER="${MONGO_ROOT_USERNAME:-admin}"

# 加载环境变量
if [ -f /opt/calico-blog/.env ]; then
    export $(cat /opt/calico-blog/.env | grep -v '^#' | xargs)
fi

DB_PASS="${MONGO_ROOT_PASSWORD}"

if [ -z "$BACKUP_FILE" ]; then
  echo "❌ 请指定备份文件"
  echo "用法: ./scripts/restore-mongo.sh /opt/calico-blog/backups/mongodb/20250101_120000.tar.gz"
  exit 1
fi

# 确认操作
read -p "⚠️  这将覆盖现有数据库，是否继续？(yes/no): " confirm
if [ "$confirm" != "yes" ]; then
  echo "❌ 操作已取消"
  exit 1
fi

# 复制备份文件到容器
docker cp $BACKUP_FILE $CONTAINER_NAME:/data/backup/restore.tar.gz

# 解压
docker exec $CONTAINER_NAME tar -xzf /data/backup/restore.tar.gz -C /data/backup

# 恢复数据库
docker exec $CONTAINER_NAME mongorestore \
  --authenticationDatabase admin \
  -u $DB_USER \
  -p $DB_PASS \
  --db $DB_NAME \
  --drop \
  /data/backup/$(basename $BACKUP_FILE .tar.gz)/$DB_NAME

# 清理
docker exec $CONTAINER_NAME rm -rf /data/backup/restore.tar.gz /data/backup/$(basename $BACKUP_FILE .tar.gz)

echo "✅ 恢复完成"

