# 安全事件处理指南

## 🚨 紧急情况

如果检测到安全告警，请立即执行以下步骤：

## 立即行动步骤

### 1. 立即检查系统状态

```bash
cd /opt/calico-blog
git pull origin main
chmod +x scripts/security-check.sh
./scripts/security-check.sh
```

### 2. 停止可疑进程

如果发现可疑进程，立即终止：

```bash
# 查找可疑进程
ps aux | grep -E "(python|base64|bash.*base64)"

# 终止进程（替换 PID 为实际进程ID）
kill -9 <PID>
```

### 3. 清理并重启

```bash
chmod +x scripts/security-cleanup.sh
./scripts/security-cleanup.sh
```

### 4. 检查容器日志

```bash
# 检查前端容器日志
docker logs calico-frontend --tail 200 | grep -i -E "(base64|python|suspicious|error)"

# 检查服务器容器日志
docker logs calico-server --tail 200 | grep -i -E "(suspicious|error|unauthorized)"
```

### 5. 检查网络连接

```bash
# 检查异常出站连接
netstat -antp | grep -E "(45\.77\.188\.57|nossl\.segfault\.net)"

# 如果发现，立即阻止
iptables -A OUTPUT -d 45.77.188.57 -j DROP
iptables -A OUTPUT -d nossl.segfault.net -j DROP
```

## 后续安全措施

### 1. 修改所有密码和密钥

```bash
# 生成新的强密码
openssl rand -base64 32

# 更新 .env 文件中的所有密钥：
# - MONGO_ROOT_PASSWORD
# - MONGO_APP_PASSWORD
# - JWT_SECRET
# - JWT_REFRESH_SECRET
# - CRYPTO_SECRET
```

### 2. 重新部署应用

```bash
# 重新构建并部署
./deploy.sh
```

### 3. 加强安全配置

- 确保所有容器以非 root 用户运行（已配置）
- 限制容器的网络访问
- 定期更新镜像
- 监控异常活动

### 4. 检查数据完整性

```bash
# 检查数据库是否有异常数据
./scripts/view-database.sh

# 检查是否有未授权的用户
docker exec calico-mongo mongosh -u admin -p YOUR_PASSWORD --authenticationDatabase admin --quiet --eval "use('calicosBlog'); db.users.find().pretty()"
```

## 预防措施

1. **定期更新镜像**：确保使用最新的安全补丁
2. **监控日志**：设置日志监控和告警
3. **限制网络访问**：使用防火墙规则限制容器网络
4. **最小权限原则**：容器只运行必要的服务
5. **定期安全检查**：运行 `./scripts/security-check.sh`

## 联系支持

如果发现严重的安全问题，请：
1. 立即断开服务器网络连接
2. 保存所有日志文件
3. 联系安全团队

