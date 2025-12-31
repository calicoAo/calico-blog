// MongoDB 初始化脚本
// 此脚本在 MongoDB 容器首次启动时自动执行
// 注意：应用用户需要通过 shell 脚本创建（create-user.sh），
// 因为 MongoDB 初始化脚本无法直接访问环境变量

// 切换到应用数据库
db = db.getSiblingDB('calicosBlog');

// 创建集合（如果不存在）
db.createCollection('users');
db.createCollection('blogs');
db.createCollection('visitlogs');
db.createCollection('loginlogs');

// 创建索引
db.users.createIndex({ username: 1 }, { unique: true });
db.users.createIndex({ email: 1 }, { unique: true });
db.users.createIndex({ role: 1 });
db.users.createIndex({ isActive: 1 });

db.blogs.createIndex({ title: 'text', content: 'text' });
db.blogs.createIndex({ category: 1 });
db.blogs.createIndex({ createdAt: -1 });
db.blogs.createIndex({ author: 1 });

db.visitlogs.createIndex({ visitorId: 1 });
db.visitlogs.createIndex({ sessionId: 1 });
db.visitlogs.createIndex({ path: 1 });
db.visitlogs.createIndex({ timestamp: -1 });

db.loginlogs.createIndex({ userId: 1 });
db.loginlogs.createIndex({ timestamp: -1 });
db.loginlogs.createIndex({ ip: 1 });

print('✅ 数据库初始化完成！');
print('📊 已创建集合: users, blogs, visitlogs, loginlogs');
print('📑 已创建索引');

