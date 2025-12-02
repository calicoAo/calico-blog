#!/bin/bash
set -e

BACKUP_DIR="/opt/calico-blog/backups/mongodb"
DATE=$(date +%Y%m%d_%H%M%S)
CONTAINER_NAME="calico-mongo"
DB_NAME="${MONGO_DATABASE:-calicosBlog}"
DB_USER="${MONGO_ROOT_USERNAME:-admin}"

# 加载环境变量
if [ -f /opt/calico-blog/.env ]; then
    export $(cat /opt/calico-blog/.env | grep -v '^#' | xargs)
fi

DB_PASS="${MONGO_ROOT_PASSWORD}"

# 创建备份目录
mkdir -p $BACKUP_DIR

# 执行备份
echo "💾 开始备份数据库..."
docker exec $CONTAINER_NAME mongodump \
  --authenticationDatabase admin \
  -u $DB_USER \
  -p $DB_PASS \
  --db $DB_NAME \
  --out /data/backup/$DATE

# 压缩备份
docker exec $CONTAINER_NAME tar -czf /data/backup/$DATE.tar.gz -C /data/backup $DATE

# 复制到主机
docker cp $CONTAINER_NAME:/data/backup/$DATE.tar.gz $BACKUP_DIR/

# 清理容器内临时文件
docker exec $CONTAINER_NAME rm -rf /data/backup/$DATE

# 保留最近 7 天的备份
find $BACKUP_DIR -name "*.tar.gz" -mtime +7 -delete

echo "✅ 备份完成: $BACKUP_DIR/$DATE.tar.gz"

