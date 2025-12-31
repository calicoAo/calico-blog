#!/bin/bash
# 快速查看数据库概览

set -e

# 加载环境变量
if [ -f .env ]; then
    export $(cat .env | grep -v '^#' | xargs)
fi

DB_NAME="${MONGO_DATABASE:-calicosBlog}"
ROOT_USERNAME="${MONGO_ROOT_USERNAME:-admin}"
ROOT_PASSWORD="${MONGO_ROOT_PASSWORD}"

if [ -z "$ROOT_PASSWORD" ]; then
  echo "❌ 错误：MONGO_ROOT_PASSWORD 未设置"
  exit 1
fi

echo "📊 数据库快速概览"
echo "================================"
echo ""

# 统计信息
echo "📈 集合统计："
docker exec calico-mongo mongosh -u "$ROOT_USERNAME" -p "$ROOT_PASSWORD" --authenticationDatabase admin --quiet --eval "
use('$DB_NAME');
print('Users: ' + db.users.countDocuments() + ' 个用户');
print('Blogs: ' + db.blogs.countDocuments() + ' 篇文章');
print('VisitLogs: ' + db.visitlogs.countDocuments() + ' 条访问记录');
print('LoginLogs: ' + db.loginlogs.countDocuments() + ' 条登录记录');
"

echo ""
echo "👤 用户列表："
docker exec calico-mongo mongosh -u "$ROOT_USERNAME" -p "$ROOT_PASSWORD" --authenticationDatabase admin --quiet --eval "
use('$DB_NAME');
db.users.find({}, {username: 1, email: 1, role: 1, isActive: 1, _id: 0}).forEach(function(user) {
  print('  - ' + (user.username || 'N/A') + ' (' + user.email + ') - ' + user.role + (user.isActive ? ' [启用]' : ' [禁用]'));
});
"

echo ""
echo "💡 提示：运行 ./scripts/view-database.sh 查看详细数据"

