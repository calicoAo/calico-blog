#!/bin/bash
set -e

echo "🚀 开始部署 Calico Blog..."

# 项目目录
PROJECT_DIR="/opt/calico-blog"
cd $PROJECT_DIR

# 配置 Git 安全目录（解决所有权检测问题）
git config --global --add safe.directory $PROJECT_DIR || true

# 拉取最新代码
echo "📥 拉取最新代码..."
git pull origin main || git pull origin master

# 加载环境变量
if [ -f .env ]; then
    export $(cat .env | grep -v '^#' | xargs)
fi

# 登录到 GitHub Container Registry（如果需要）
# echo "🔐 登录到 GitHub Container Registry..."
# echo "$GITHUB_TOKEN" | docker login ghcr.io -u USERNAME --password-stdin

# 拉取最新镜像
echo "📦 拉取最新 Docker 镜像..."
# 使用 --ignore-pull-failures 忽略拉取失败，使用本地已有镜像
docker-compose pull --ignore-pull-failures || echo "⚠️  部分镜像拉取失败，将使用本地已有镜像..."

# 停止旧容器
echo "🛑 停止旧容器..."
docker-compose down

# 检查并拉取必需的镜像
echo "🔍 检查必需镜像..."
if ! docker images | grep -q "mongo:7.0"; then
  echo "📥 MongoDB 镜像不存在，尝试从多个源拉取..."
  
  # 尝试从多个镜像源拉取
  MIRRORS=(
    "swr.cn-north-4.myhuaweicloud.com/ddn-k8s/docker.io/library/mongo:7.0.12"
    "mongo:7.0"
  )
  
  PULLED=false
  for mirror in "${MIRRORS[@]}"; do
    echo "尝试从 $mirror 拉取..."
    if timeout 120 docker pull "$mirror" 2>&1; then
      # 如果从华为云拉取成功，需要打标签为 mongo:7.0
      if [[ "$mirror" == *"myhuaweicloud.com"* ]]; then
        docker tag "$mirror" mongo:7.0
        echo "✅ 已从华为云镜像源拉取并标记为 mongo:7.0"
      else
        echo "✅ 已从 Docker Hub 拉取 mongo:7.0"
      fi
      PULLED=true
      break
    else
      echo "⚠️  从 $mirror 拉取失败，尝试下一个源..."
    fi
  done
  
  if [ "$PULLED" = false ]; then
    echo "❌ MongoDB 镜像拉取失败，所有镜像源都无法访问"
    echo "   这可能是网络问题，请："
    echo "   1. 检查服务器网络连接"
    echo "   2. 手动在服务器上执行："
    echo "      docker pull swr.cn-north-4.myhuaweicloud.com/ddn-k8s/docker.io/library/mongo:7.0.12"
    echo "      docker tag swr.cn-north-4.myhuaweicloud.com/ddn-k8s/docker.io/library/mongo:7.0.12 mongo:7.0"
    echo "   3. 或者等待网络恢复后重新部署"
    echo ""
    echo "   如果 MongoDB 容器已经在运行，可以跳过此步骤继续部署"
    # 检查是否有运行中的 mongo 容器
    if docker ps -a | grep -q "calico-mongo"; then
      echo "⚠️  检测到已有 MongoDB 容器，尝试使用现有容器继续部署..."
      # 不退出，继续执行
    else
      exit 1
    fi
  fi
fi

# 备份数据库（可选）
if [ "$1" == "--backup" ]; then
    echo "💾 备份数据库..."
    ./scripts/backup-mongo.sh
fi

# 启动新容器
echo "▶️  启动新容器..."
docker-compose up -d || {
  echo "⚠️  容器启动失败，查看日志..."
  docker-compose logs
  exit 1
}

# 等待服务就绪
echo "⏳ 等待服务就绪..."
sleep 10

# 健康检查
echo "🏥 执行健康检查..."
MAX_RETRIES=30
RETRY_COUNT=0

while [ $RETRY_COUNT -lt $MAX_RETRIES ]; do
    if curl -f http://localhost:3001/api/health > /dev/null 2>&1; then
        echo "✅ 服务器健康检查通过"
        break
    fi
    
    RETRY_COUNT=$((RETRY_COUNT + 1))
    echo "⏳ 等待服务器启动... ($RETRY_COUNT/$MAX_RETRIES)"
    sleep 2
done

if [ $RETRY_COUNT -eq $MAX_RETRIES ]; then
    echo "❌ 服务器健康检查失败"
    docker-compose logs server
    exit 1
fi

# 初始化数据库（如果是首次部署）
if [ ! -f .db-initialized ]; then
    echo "🗄️  初始化数据库..."
    docker-compose exec -T server npm run init-db || true
    touch .db-initialized
fi

# 清理旧镜像
echo "🧹 清理旧镜像..."
docker image prune -f

echo "✅ 部署完成！"
echo "📊 服务状态："
docker-compose ps