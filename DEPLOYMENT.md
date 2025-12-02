# Calico Blog 部署文档

本文档详细说明如何使用 Docker 和 GitHub Actions 部署 Calico Blog 到 Linux 服务器。

## 📋 目录

- [前置要求](#前置要求)
- [服务器准备](#服务器准备)
- [GitHub 配置](#github-配置)
- [首次部署](#首次部署)
- [自动部署](#自动部署)
- [维护操作](#维护操作)
- [故障排查](#故障排查)

## 🔧 前置要求

### 服务器要求

- **操作系统**: Linux (Ubuntu 20.04+ / CentOS 7+)
- **内存**: 至少 2GB RAM
- **磁盘**: 至少 10GB 可用空间
- **网络**: 公网 IP 地址（已提供：8.129.88.130）
- **端口**: 开放 3000, 3001, 27017 端口（或根据需要调整）

### 软件要求

- Docker 20.10+
- Docker Compose 2.0+
- Git
- SSH 访问权限

## 🖥️ 服务器准备

### 1. 连接到服务器

```bash
ssh root@8.129.88.130
# 或使用你的用户名
ssh your-username@8.129.88.130
```

### 2. 运行服务器设置脚本

```bash
# 克隆项目
cd /opt
git clone https://github.com/calicoAo/calico-blog.git
cd calico-blog

# 运行设置脚本
chmod +x scripts/setup-server.sh
./scripts/setup-server.sh
```

设置脚本会自动：
- 安装 Docker 和 Docker Compose
- 创建项目目录结构
- 生成 `.env` 配置文件

### 3. 配置环境变量

编辑 `.env` 文件：

```bash
nano /opt/calico-blog/.env
```

**重要配置项**：

```env
# MongoDB 配置
MONGO_ROOT_USERNAME=admin
MONGO_ROOT_PASSWORD=你的强密码
MONGO_DATABASE=calicosBlog
MONGO_APP_USERNAME=calico_user
MONGO_APP_PASSWORD=应用用户密码

# 服务器配置
SERVER_PORT=3001
FRONTEND_PORT=3000

# JWT 配置（必须使用强密钥）
JWT_SECRET=你的JWT密钥
JWT_REFRESH_SECRET=你的刷新令牌密钥

# 加密密钥（必须与前端保持一致）
CRYPTO_SECRET=你的加密密钥

# API 地址（使用你的服务器 IP）
NEXT_PUBLIC_API_BASE_URL=http://8.129.88.130:3001
```

**安全提示**：
- 所有密码和密钥都应该使用强随机字符串
- 可以使用 `openssl rand -base64 32` 生成随机密钥
- 不要将 `.env` 文件提交到 Git

### 4. 配置防火墙

```bash
# Ubuntu/Debian
sudo ufw allow 3000/tcp
sudo ufw allow 3001/tcp
sudo ufw allow 22/tcp  # SSH
sudo ufw enable

# CentOS/RHEL
sudo firewall-cmd --permanent --add-port=3000/tcp
sudo firewall-cmd --permanent --add-port=3001/tcp
sudo firewall-cmd --permanent --add-port=22/tcp
sudo firewall-cmd --reload
```

**注意**：MongoDB 端口 27017 不需要对外开放，只在 Docker 网络内部使用。

## 🔐 GitHub 配置

### 1. 配置 GitHub Secrets

在 GitHub 仓库设置中添加以下 Secrets：

**Settings → Secrets and variables → Actions → New repository secret**

| Secret 名称 | 说明 | 示例值 |
|------------|------|--------|
| `SERVER_HOST` | 服务器 IP 地址 | `8.129.88.130` |
| `SERVER_USER` | SSH 用户名 | `root` 或你的用户名 |
| `SERVER_SSH_KEY` | SSH 私钥 | 你的 SSH 私钥内容 |
| `SERVER_PORT` | SSH 端口（可选） | `22` |
| `NEXT_PUBLIC_API_BASE_URL` | API 基础 URL | `http://8.129.88.130:3001` |
| `CRYPTO_SECRET` | 加密密钥 | 与服务器 `.env` 中的 `CRYPTO_SECRET` 一致 |

### 2. 生成 SSH 密钥对（如果还没有）

```bash
# 在本地机器上生成 SSH 密钥
ssh-keygen -t ed25519 -C "github-actions"

# 将公钥添加到服务器
ssh-copy-id -i ~/.ssh/id_ed25519.pub root@8.129.88.130

# 复制私钥内容（用于 GitHub Secrets）
cat ~/.ssh/id_ed25519
```

### 3. 配置 GitHub Container Registry 权限

确保 GitHub Actions 有权限推送镜像到 GitHub Container Registry：

1. 进入仓库 **Settings → Actions → General**
2. 在 **Workflow permissions** 中，选择 **Read and write permissions**
3. 勾选 **Allow GitHub Actions to create and approve pull requests**

## 🚀 首次部署

### 方式一：手动部署（推荐首次使用）

```bash
# 在服务器上
cd /opt/calico-blog

# 确保环境变量已配置
cat .env

# 运行部署脚本
chmod +x deploy.sh
./deploy.sh
```

部署脚本会自动：
1. 拉取最新代码
2. 拉取 Docker 镜像
3. 停止旧容器
4. 启动新容器
5. 执行健康检查
6. 初始化数据库（首次部署）

### 方式二：通过 GitHub Actions 自动部署

1. 推送代码到 `main` 分支
2. GitHub Actions 会自动：
   - 构建 Docker 镜像
   - 推送到 GitHub Container Registry
   - 部署到服务器

## 🔄 自动部署

### 工作流程

1. **代码推送** → 推送到 `main` 分支
2. **构建镜像** → GitHub Actions 构建 server 和 frontend 镜像
3. **推送镜像** → 推送到 `ghcr.io/calicoao/calico-blog-*`
4. **部署到服务器** → SSH 连接到服务器并执行 `deploy.sh`

### 查看部署状态

在 GitHub 仓库的 **Actions** 标签页查看部署状态。

## 🛠️ 维护操作

### 查看服务状态

```bash
cd /opt/calico-blog
docker-compose ps
```

### 查看日志

```bash
# 查看所有服务日志
docker-compose logs -f

# 查看特定服务日志
docker-compose logs -f server
docker-compose logs -f frontend
docker-compose logs -f mongo
```

### 重启服务

```bash
# 重启所有服务
docker-compose restart

# 重启特定服务
docker-compose restart server
```

### 停止服务

```bash
docker-compose down
```

### 更新服务

```bash
# 拉取最新镜像并重启
docker-compose pull
docker-compose up -d
```

### 数据库备份

```bash
# 手动备份
cd /opt/calico-blog
./scripts/backup-mongo.sh

# 自动备份（每天凌晨 2 点，通过 GitHub Actions）
# 备份文件会保存到 GitHub Releases
```

### 数据库恢复

```bash
cd /opt/calico-blog
./scripts/restore-mongo.sh /opt/calico-blog/backups/mongodb/备份文件名.tar.gz
```

### 初始化数据库

```bash
# 如果数据库未初始化，运行：
docker-compose exec server npm run init-db
```

## 🔍 故障排查

### 服务无法启动

1. **检查日志**：
   ```bash
   docker-compose logs server
   ```

2. **检查端口占用**：
   ```bash
   netstat -tulpn | grep -E '3000|3001|27017'
   ```

3. **检查环境变量**：
   ```bash
   docker-compose config
   ```

### MongoDB 连接失败

1. **检查 MongoDB 容器状态**：
   ```bash
   docker-compose ps mongo
   docker-compose logs mongo
   ```

2. **检查连接字符串**：
   ```bash
   # 在 .env 文件中检查 MONGODB_URI
   cat .env | grep MONGODB_URI
   ```

3. **测试连接**：
   ```bash
   docker-compose exec mongo mongosh -u admin -p 密码 --authenticationDatabase admin
   ```

### 前端无法访问后端 API

1. **检查 CORS 配置**：
   - 确保 `server/index.js` 中的 `allowedOrigins` 包含前端地址
   - 生产环境需要添加：`http://8.129.88.130:3000`

2. **检查网络连接**：
   ```bash
   # 在服务器上测试
   curl http://localhost:3001/api/health
   ```

3. **检查防火墙**：
   ```bash
   sudo ufw status
   ```

### 健康检查失败

1. **检查健康检查端点**：
   ```bash
   curl http://localhost:3001/api/health
   ```

2. **检查服务器日志**：
   ```bash
   docker-compose logs server | tail -50
   ```

### 镜像拉取失败

1. **检查 GitHub Container Registry 权限**：
   - 确保 GitHub Actions 有推送权限
   - 检查镜像是否成功构建

2. **手动拉取镜像**：
   ```bash
   docker pull ghcr.io/calicoao/calico-blog-server:latest
   docker pull ghcr.io/calicoao/calico-blog-frontend:latest
   ```

## 📊 监控和维护

### 资源使用情况

```bash
# 查看容器资源使用
docker stats

# 查看磁盘使用
df -h
docker system df
```

### 清理未使用的资源

```bash
# 清理未使用的镜像
docker image prune -a

# 清理未使用的容器和网络
docker system prune
```

### 定期维护任务

1. **每日**：自动数据库备份（通过 GitHub Actions）
2. **每周**：检查日志文件大小
3. **每月**：更新 Docker 镜像和依赖

## 🔒 安全建议

1. **使用强密码**：所有密码和密钥都应该使用强随机字符串
2. **限制端口访问**：只开放必要的端口，使用防火墙限制访问
3. **定期更新**：定期更新 Docker 镜像和系统依赖
4. **监控日志**：定期检查日志，发现异常活动
5. **备份数据**：定期备份数据库，测试恢复流程
6. **使用 HTTPS**：生产环境建议使用 Nginx 反向代理并配置 SSL 证书

## 📞 获取帮助

如果遇到问题：

1. 查看日志：`docker-compose logs`
2. 检查 GitHub Actions 工作流状态
3. 查看项目 Issues：https://github.com/calicoAo/calico-blog/issues

## 📝 更新日志

- **2025-01-XX**: 初始部署文档
- 添加了完整的 Docker 和 GitHub Actions 部署流程
- 支持自动构建、部署和数据库备份

