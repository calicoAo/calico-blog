# 快速部署指南

## 🚀 一键部署

### 服务器端（首次部署）

```bash
# 1. 连接到服务器
ssh root@8.129.88.130

# 2. 克隆项目
cd /opt
git clone https://github.com/calicoAo/calico-blog.git
cd calico-blog

# 3. 运行设置脚本
chmod +x scripts/setup-server.sh
./scripts/setup-server.sh

# 4. 编辑环境变量
nano .env
# 修改必要的配置（密码、密钥等）

# 5. 首次部署
chmod +x deploy.sh
./deploy.sh
```

### GitHub Actions 配置

1. 在 GitHub 仓库添加 Secrets：
   - `SERVER_HOST`: `8.129.88.130`
   - `SERVER_USER`: 你的 SSH 用户名
   - `SERVER_SSH_KEY`: 你的 SSH 私钥
   - `NEXT_PUBLIC_API_BASE_URL`: `http://8.129.88.130:3001`
   - `CRYPTO_SECRET`: 与服务器 `.env` 中的 `CRYPTO_SECRET` 一致

2. 推送代码到 `main` 分支，自动部署

## 📚 详细文档

查看 [DEPLOYMENT.md](./DEPLOYMENT.md) 获取完整的部署文档。

## 🔧 常用命令

```bash
# 查看服务状态
docker-compose ps

# 查看日志
docker-compose logs -f

# 重启服务
docker-compose restart

# 备份数据库
./scripts/backup-mongo.sh

# 恢复数据库
./scripts/restore-mongo.sh /path/to/backup.tar.gz
```

