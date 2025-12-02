const mongoose = require('mongoose');
const dotenv = require('dotenv');
const User = require('../models/User');
const Blog = require('../models/Blog');
const bcrypt = require('bcryptjs');

// 加载环境变量
dotenv.config();

// 数据库初始化函数
async function initDatabase() {
  try {
    // 连接 MongoDB
    const mongoUri = process.env.MONGODB_URI || 'mongodb://192.168.0.103:27017/calicosBlog';
    console.log('正在连接 MongoDB...');
    console.log('连接地址:', mongoUri);
    
    await mongoose.connect(mongoUri);
    
    console.log('✅ MongoDB 连接成功');
    
    // 获取数据库名称
    const dbName = mongoose.connection.db.databaseName;
    console.log(`📊 数据库名称: ${dbName}`);
    
    // 创建索引
    console.log('\n正在创建索引...');
    await createIndexes();
    console.log('✅ 索引创建完成');
    
    // 创建默认管理员账户（如果不存在）
    console.log('\n正在检查默认管理员账户...');
    await createDefaultAdmin();
    console.log('✅ 默认管理员账户检查完成');
    
    // 显示数据库统计信息
    console.log('\n📈 数据库统计信息:');
    await showDatabaseStats();
    
    console.log('\n🎉 数据库初始化完成！');
    process.exit(0);
  } catch (error) {
    console.error('❌ 数据库初始化失败:', error);
    process.exit(1);
  }
}

// 创建索引
async function createIndexes() {
  try {
    // User 集合索引
    await User.collection.createIndex({ username: 1 }, { unique: true });
    await User.collection.createIndex({ email: 1 }, { unique: true });
    await User.collection.createIndex({ role: 1 });
    await User.collection.createIndex({ isActive: 1 });
    console.log('  ✓ User 集合索引已创建');
    
    // Blog 集合索引
    await Blog.collection.createIndex({ title: 'text', content: 'text' });
    await Blog.collection.createIndex({ author: 1, status: 1 });
    await Blog.collection.createIndex({ publishedAt: -1 });
    await Blog.collection.createIndex({ tags: 1 });
    await Blog.collection.createIndex({ status: 1 });
    await Blog.collection.createIndex({ category: 1 });
    console.log('  ✓ Blog 集合索引已创建');
  } catch (error) {
    console.error('创建索引时出错:', error);
    throw error;
  }
}

// 创建默认管理员账户
async function createDefaultAdmin() {
  try {
    const adminEmail = process.env.ADMIN_EMAIL || 'admin@calico-blog.com';
    const adminPassword = process.env.ADMIN_PASSWORD || 'admin123456';
    const adminUsername = process.env.ADMIN_USERNAME || 'admin';
    
    // 检查是否已存在管理员
    const existingAdmin = await User.findOne({ 
      $or: [
        { email: adminEmail },
        { username: adminUsername },
        { role: 'admin' }
      ]
    });
    
    if (existingAdmin) {
      console.log('  ℹ️  管理员账户已存在');
      if (existingAdmin.role !== 'admin') {
        existingAdmin.role = 'admin';
        await existingAdmin.save();
        console.log('  ✓ 已更新用户角色为管理员');
      }
      
      // 如果设置了 RESET_PASSWORD 环境变量，强制重置密码
      if (process.env.RESET_PASSWORD === 'true') {
        console.log('  🔄 强制重置密码模式已启用');
        const hashedPassword = await bcrypt.hash(
          adminPassword, 
          parseInt(process.env.BCRYPT_ROUNDS) || 12
        );
        await User.updateOne(
          { _id: existingAdmin._id },
          { $set: { password: hashedPassword } }
        );
        console.log('  ✓ 密码已重置');
        console.log(`    新密码: ${adminPassword}`);
      }
      return;
    }
    
    // 创建新管理员
    const hashedPassword = await bcrypt.hash(
      adminPassword, 
      parseInt(process.env.BCRYPT_ROUNDS) || 12
    );
    
    const admin = new User({
      username: adminUsername,
      email: adminEmail,
      password: hashedPassword,
      role: 'admin',
      isActive: true,
      bio: '系统管理员'
    });
    
    await admin.save();
    console.log('  ✓ 默认管理员账户已创建');
    console.log(`    邮箱: ${adminEmail}`);
    console.log(`    用户名: ${adminUsername}`);
    console.log(`    密码: ${adminPassword}`);
    console.log('    ⚠️  请尽快修改默认密码！');
  } catch (error) {
    console.error('创建管理员账户时出错:', error);
    throw error;
  }
}

// 显示数据库统计信息
async function showDatabaseStats() {
  try {
    const userCount = await User.countDocuments();
    const adminCount = await User.countDocuments({ role: 'admin' });
    const activeUserCount = await User.countDocuments({ isActive: true });
    
    const blogCount = await Blog.countDocuments();
    const publishedBlogCount = await Blog.countDocuments({ status: 'published' });
    const draftBlogCount = await Blog.countDocuments({ status: 'draft' });
    const archivedBlogCount = await Blog.countDocuments({ status: 'archived' });
    
    console.log(`  用户总数: ${userCount}`);
    console.log(`  管理员数量: ${adminCount}`);
    console.log(`  活跃用户: ${activeUserCount}`);
    console.log(`  博客总数: ${blogCount}`);
    console.log(`  已发布: ${publishedBlogCount}`);
    console.log(`  草稿: ${draftBlogCount}`);
    console.log(`  已归档: ${archivedBlogCount}`);
  } catch (error) {
    console.error('获取统计信息时出错:', error);
  }
}

// 运行初始化
initDatabase();

