/**
 * 重置管理员密码脚本
 * 
 * 功能：
 * - 重置指定管理员账户的密码
 * - 使用 bcrypt 正确加密密码
 * - 绕过 User 模型的 pre('save') 中间件，直接更新数据库
 * 
 * 使用方法：
 * node scripts/reset-admin-password.js [email] [newPassword]
 * 
 * 示例：
 * node scripts/reset-admin-password.js admin@calico-blog.com admin123456
 */

const mongoose = require('mongoose');
const dotenv = require('dotenv');
const bcrypt = require('bcryptjs');
const User = require('../models/User');

// 加载环境变量
dotenv.config();

async function resetAdminPassword(email, newPassword) {
  try {
    // 连接 MongoDB
    const mongoUri = process.env.MONGODB_URI || 'mongodb://192.168.0.103:27017/calicosBlog';
    console.log('正在连接 MongoDB...');
    console.log('连接地址:', mongoUri);
    
    await mongoose.connect(mongoUri);
    console.log('✅ MongoDB 连接成功\n');

    // 查找用户
    console.log(`正在查找用户: ${email}`);
    const user = await User.findOne({ email }).select('+password');
    
    if (!user) {
      console.log('❌ 用户不存在');
      console.log('\n💡 建议：运行初始化脚本创建管理员账户');
      console.log('   npm run init-db');
      process.exit(1);
    }

    console.log('✅ 找到用户\n');
    console.log('用户信息:');
    console.log('  ID:', user._id);
    console.log('  用户名:', user.username);
    console.log('  邮箱:', user.email);
    console.log('  角色:', user.role);
    console.log('  状态:', user.isActive ? '✅ 已启用' : '❌ 已禁用');
    console.log('  当前密码哈希:', user.password ? user.password.substring(0, 20) + '...' : '无');

    // 使用 bcrypt 加密新密码
    console.log('\n正在使用 bcrypt 加密新密码...');
    const saltRounds = parseInt(process.env.BCRYPT_ROUNDS) || 12;
    const hashedPassword = await bcrypt.hash(newPassword, saltRounds);
    console.log('✅ 密码加密完成');
    console.log('  新密码哈希:', hashedPassword.substring(0, 20) + '...');

    // 直接更新数据库（绕过 pre('save') 中间件）
    console.log('\n正在更新数据库...');
    await User.updateOne(
      { _id: user._id },
      { $set: { password: hashedPassword } }
    );
    console.log('✅ 密码已更新');

    // 验证新密码
    console.log('\n正在验证新密码...');
    const updatedUser = await User.findById(user._id).select('+password');
    const isValid = await bcrypt.compare(newPassword, updatedUser.password);
    
    if (isValid) {
      console.log('✅ 密码验证成功');
    } else {
      console.log('❌ 密码验证失败');
      process.exit(1);
    }

    console.log('\n📋 重置结果:');
    console.log('  ✅ 密码已成功重置');
    console.log(`  邮箱: ${email}`);
    console.log(`  新密码: ${newPassword}`);
    console.log('  ⚠️  请妥善保管新密码！');

    process.exit(0);
  } catch (error) {
    console.error('❌ 重置密码时出错:', error);
    process.exit(1);
  }
}

// 获取命令行参数
const email = process.argv[2] || process.env.ADMIN_EMAIL || 'admin@calico-blog.com';
const newPassword = process.argv[3] || process.env.ADMIN_PASSWORD || 'admin123456';

if (!newPassword || newPassword.length < 6) {
  console.error('❌ 密码长度至少6个字符');
  process.exit(1);
}

console.log('🔐 重置管理员密码\n');
console.log('参数:');
console.log('  邮箱:', email);
console.log('  新密码:', '*'.repeat(newPassword.length));
console.log('');

resetAdminPassword(email, newPassword);

