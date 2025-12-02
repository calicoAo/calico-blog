// MongoDB 初始化脚本
// 此脚本在 MongoDB 容器首次启动时自动执行

// 切换到应用数据库
db = db.getSiblingDB('calicosBlog');

// 创建应用专用用户（密码将在部署时通过环境变量设置）
// 注意：这里使用占位符，实际密码需要通过环境变量 MONGO_APP_PASSWORD 设置
// 如果需要在初始化时创建用户，可以使用以下代码：
/*
db.createUser({
  user: 'calico_user',
  pwd: 'CHANGE_ME_IN_DEPLOYMENT', // 需要在部署时替换
  roles: [
    {
      role: 'readWrite',
      db: 'calicosBlog'
    }
  ]
});
*/

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

