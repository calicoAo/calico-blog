#!/bin/bash
# 查看 MongoDB 数据库脚本
# 提供多种查看数据库的方式

set -e

# 加载环境变量
if [ -f .env ]; then
    export $(cat .env | grep -v '^#' | xargs)
fi

# 获取配置
DB_NAME="${MONGO_DATABASE:-calicosBlog}"
ROOT_USERNAME="${MONGO_ROOT_USERNAME:-admin}"
ROOT_PASSWORD="${MONGO_ROOT_PASSWORD}"

if [ -z "$ROOT_PASSWORD" ]; then
  echo "❌ 错误：MONGO_ROOT_PASSWORD 未设置"
  exit 1
fi

# 检查 MongoDB 容器是否运行
if ! docker ps | grep -q calico-mongo; then
  echo "❌ MongoDB 容器未运行"
  exit 1
fi

echo "📊 MongoDB 数据库查看工具"
echo "================================"
echo ""

# 显示菜单
show_menu() {
  echo "请选择要执行的操作："
  echo "  1) 查看所有数据库"
  echo "  2) 查看当前数据库的集合"
  echo "  3) 查看用户列表"
  echo "  4) 查看 users 集合数据"
  echo "  5) 查看 blogs 集合数据"
  echo "  6) 查看 visitlogs 集合数据（最近10条）"
  echo "  7) 查看 loginlogs 集合数据（最近10条）"
  echo "  8) 统计各集合文档数量"
  echo "  9) 进入 MongoDB Shell（交互式）"
  echo "  0) 退出"
  echo ""
  read -p "请输入选项 [0-9]: " choice
}

# 执行操作
execute_choice() {
  case $choice in
    1)
      echo ""
      echo "📋 所有数据库："
      docker exec calico-mongo mongosh -u "$ROOT_USERNAME" -p "$ROOT_PASSWORD" --authenticationDatabase admin --quiet --eval "db.adminCommand('listDatabases')"
      ;;
    2)
      echo ""
      echo "📋 数据库 $DB_NAME 的集合："
      docker exec calico-mongo mongosh -u "$ROOT_USERNAME" -p "$ROOT_PASSWORD" --authenticationDatabase admin --quiet --eval "use('$DB_NAME'); db.getCollectionNames()"
      ;;
    3)
      echo ""
      echo "👤 用户列表："
      docker exec calico-mongo mongosh -u "$ROOT_USERNAME" -p "$ROOT_PASSWORD" --authenticationDatabase admin --quiet --eval "use('$DB_NAME'); db.getUsers()"
      ;;
    4)
      echo ""
      echo "👥 Users 集合数据："
      docker exec calico-mongo mongosh -u "$ROOT_USERNAME" -p "$ROOT_PASSWORD" --authenticationDatabase admin --quiet --eval "use('$DB_NAME'); db.users.find().pretty()"
      ;;
    5)
      echo ""
      echo "📝 Blogs 集合数据："
      docker exec calico-mongo mongosh -u "$ROOT_USERNAME" -p "$ROOT_PASSWORD" --authenticationDatabase admin --quiet --eval "use('$DB_NAME'); db.blogs.find().limit(10).pretty()"
      ;;
    6)
      echo ""
      echo "📊 VisitLogs 集合数据（最近10条）："
      docker exec calico-mongo mongosh -u "$ROOT_USERNAME" -p "$ROOT_PASSWORD" --authenticationDatabase admin --quiet --eval "use('$DB_NAME'); db.visitlogs.find().sort({timestamp: -1}).limit(10).pretty()"
      ;;
    7)
      echo ""
      echo "🔐 LoginLogs 集合数据（最近10条）："
      docker exec calico-mongo mongosh -u "$ROOT_USERNAME" -p "$ROOT_PASSWORD" --authenticationDatabase admin --quiet --eval "use('$DB_NAME'); db.loginlogs.find().sort({timestamp: -1}).limit(10).pretty()"
      ;;
    8)
      echo ""
      echo "📈 集合统计："
      docker exec calico-mongo mongosh -u "$ROOT_USERNAME" -p "$ROOT_PASSWORD" --authenticationDatabase admin --quiet --eval "
      use('$DB_NAME');
      const collections = ['users', 'blogs', 'visitlogs', 'loginlogs'];
      collections.forEach(function(coll) {
        const count = db[coll].countDocuments();
        print(coll + ': ' + count + ' 条文档');
      });
      "
      ;;
    9)
      echo ""
      echo "🔧 进入 MongoDB Shell（交互式）"
      echo "   提示：输入 exit 或按 Ctrl+D 退出"
      echo ""
      docker exec -it calico-mongo mongosh -u "$ROOT_USERNAME" -p "$ROOT_PASSWORD" --authenticationDatabase admin "$DB_NAME"
      ;;
    0)
      echo "退出"
      exit 0
      ;;
    *)
      echo "❌ 无效选项"
      ;;
  esac
}

# 主循环
if [ "$1" != "" ]; then
  # 如果提供了参数，直接执行
  choice=$1
  execute_choice
else
  # 否则显示菜单
  while true; do
    show_menu
    execute_choice
    echo ""
    read -p "按 Enter 继续..."
    echo ""
  done
fi

