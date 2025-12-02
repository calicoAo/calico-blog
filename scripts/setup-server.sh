#!/bin/bash
set -e

echo "🔧 开始设置服务器..."

# 安装 Docker
if ! command -v docker &> /dev/null; then
    echo "📦 安装 Docker..."
    curl -fsSL https://get.docker.com -o get-docker.sh
    sh get-docker.sh
    rm get-docker.sh
    sudo systemctl start docker
    sudo systemctl enable docker
fi

# 安装 Docker Compose
if ! command -v docker-compose &> /dev/null; then
    echo "📦 安装 Docker Compose..."
    sudo curl -L "https://github.com/docker/compose/releases/latest/download/docker-compose-$(uname -s)-$(uname -m)" -o /usr/local/bin/docker-compose
    sudo chmod +x /usr/local/bin/docker-compose
fi

# 创建项目目录
PROJECT_DIR="/opt/calico-blog"
sudo mkdir -p $PROJECT_DIR
cd $PROJECT_DIR

# 创建必要的目录
sudo mkdir -p backups/mongodb
sudo mkdir -p mongo-init
sudo mkdir -p scripts

# 设置权限
sudo chown -R $USER:$USER $PROJECT_DIR

# 创建 .env 文件（如果不存在）
if [ ! -f .env ]; then
    echo "📝 创建 .env 文件..."
    cat > .env << EOF
# MongoDB 配置
MONGO_ROOT_USERNAME=admin
MONGO_ROOT_PASSWORD=$(openssl rand -base64 32)
MONGO_DATABASE=calicosBlog
MONGO_APP_USERNAME=calico_user
MONGO_APP_PASSWORD=$(openssl rand -base64 32)

# 服务器配置
SERVER_PORT=3001
FRONTEND_PORT=3000

# JWT 配置
JWT_SECRET=$(openssl rand -base64 32)
JWT_EXPIRES_IN=7d
JWT_REFRESH_SECRET=$(openssl rand -base64 32)
JWT_REFRESH_EXPIRES_IN=7d

# 加密密钥
CRYPTO_SECRET=$(openssl rand -base64 32)

# 其他配置
BCRYPT_ROUNDS=12
NODE_ENV=production

# API 地址
NEXT_PUBLIC_API_BASE_URL=http://8.129.88.130:3001
EOF
    echo "✅ .env 文件已创建，请编辑配置"
fi

echo "✅ 服务器设置完成！"
echo "📝 请编辑 $PROJECT_DIR/.env 文件，然后运行 ./deploy.sh"

