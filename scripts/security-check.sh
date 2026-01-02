#!/bin/bash
# 安全检查脚本
# 用于检查服务器是否被入侵

set -e

echo "🔒 安全检查工具"
echo "================================"
echo ""

# 检查可疑进程
echo "1️⃣ 检查可疑进程..."
echo "-------------------"
SUSPICIOUS=$(ps aux | grep -E "(python3.*base64|bash.*base64|sh.*base64|curl.*base64|wget.*base64)" | grep -v grep || true)
if [ -n "$SUSPICIOUS" ]; then
  echo "⚠️  发现可疑进程："
  echo "$SUSPICIOUS"
else
  echo "✅ 未发现可疑进程"
fi

echo ""

# 检查可疑文件
echo "2️⃣ 检查可疑文件..."
echo "-------------------"
SUSPICIOUS_FILES=$(find /tmp /var/tmp /dev/shm -name "*.sh" -o -name "*.py" -o -name ".ts" 2>/dev/null | head -20 || true)
if [ -n "$SUSPICIOUS_FILES" ]; then
  echo "⚠️  发现可疑文件："
  echo "$SUSPICIOUS_FILES"
else
  echo "✅ 未发现可疑文件"
fi

echo ""

# 检查容器中的可疑进程
echo "3️⃣ 检查 Docker 容器中的可疑进程..."
echo "-------------------"
for container in $(docker ps --format "{{.Names}}"); do
  echo "检查容器: $container"
  SUSPICIOUS_IN_CONTAINER=$(docker exec $container ps aux 2>/dev/null | grep -E "(python|base64|bash.*base64)" | grep -v grep || true)
  if [ -n "$SUSPICIOUS_IN_CONTAINER" ]; then
    echo "  ⚠️  发现可疑进程："
    echo "$SUSPICIOUS_IN_CONTAINER"
  else
    echo "  ✅ 正常"
  fi
done

echo ""

# 检查网络连接
echo "4️⃣ 检查异常网络连接..."
echo "-------------------"
SUSPICIOUS_CONNECTIONS=$(netstat -antp 2>/dev/null | grep -E "(45\.77\.188\.57|nossl\.segfault\.net)" || true)
if [ -n "$SUSPICIOUS_CONNECTIONS" ]; then
  echo "⚠️  发现可疑网络连接："
  echo "$SUSPICIOUS_CONNECTIONS"
else
  echo "✅ 未发现可疑网络连接"
fi

echo ""

# 检查最近修改的文件
echo "5️⃣ 检查最近修改的可疑文件（最近1小时）..."
echo "-------------------"
RECENT_FILES=$(find /tmp /var/tmp /dev/shm -type f -mmin -60 2>/dev/null | head -20 || true)
if [ -n "$RECENT_FILES" ]; then
  echo "⚠️  最近修改的文件："
  echo "$RECENT_FILES"
else
  echo "✅ 未发现最近修改的可疑文件"
fi

echo ""
echo "================================"
echo "✅ 检查完成"
echo ""
echo "💡 建议操作："
echo "   1. 如果发现可疑进程，立即终止"
echo "   2. 如果发现可疑文件，检查并删除"
echo "   3. 重启所有容器"
echo "   4. 检查日志文件"
echo "   5. 考虑重新部署应用"

