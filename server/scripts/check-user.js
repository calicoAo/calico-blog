/**
 * 检查用户状态脚本
 * 用于调试登录问题
 * 
 * 使用方法：
 * node scripts/check-user.js <email>
 */

const mongoose = require('mongoose');
const dotenv = require('dotenv');
const User = require('../models/User');
const LoginLog = require('../models/LoginLog');

// 加载环境变量
dotenv.config();

async function checkUser(email) {
  try {
    // 连接 MongoDB
    const mongoUri = process.env.MONGODB_URI || 'mongodb://192.168.0.103:27017/calicosBlog';
    console.log('正在连接 MongoDB...');
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

    console.log('✅ 用户存在\n');
    console.log('用户信息:');
    console.log('  ID:', user._id);
    console.log('  用户名:', user.username);
    console.log('  邮箱:', user.email);
    console.log('  角色:', user.role);
    console.log('  状态:', user.isActive ? '✅ 已启用' : '❌ 已禁用');
    console.log('  创建时间:', user.createdAt);
    console.log('  更新时间:', user.updatedAt);

    // 检查角色
    if (user.role !== 'admin') {
      console.log('\n⚠️  警告：用户角色不是 admin');
      console.log('   当前角色:', user.role);
      console.log('   需要角色: admin');
    }

    // 检查状态
    if (!user.isActive) {
      console.log('\n⚠️  警告：用户账户已被禁用');
    }

    // 检查密码
    if (user.password) {
      console.log('\n✅ 密码已设置');
    } else {
      console.log('\n❌ 密码未设置');
    }

    // 查看最近的登录日志
    console.log('\n最近的登录日志:');
    const recentLogs = await LoginLog.find({ email })
      .sort({ timestamp: -1 })
      .limit(5)
      .lean();

    if (recentLogs.length === 0) {
      console.log('  暂无登录日志');
    } else {
      recentLogs.forEach((log, index) => {
        console.log(`\n  ${index + 1}. ${log.success ? '✅ 成功' : '❌ 失败'}`);
        console.log(`     时间: ${log.timestamp}`);
        console.log(`     IP: ${log.ip}`);
        console.log(`     原因: ${log.reason || '无'}`);
      });
    }

    // 总结
    console.log('\n📋 总结:');
    const issues = [];
    if (user.role !== 'admin') {
      issues.push('用户角色不是 admin');
    }
    if (!user.isActive) {
      issues.push('用户账户已被禁用');
    }
    if (issues.length === 0) {
      console.log('✅ 用户状态正常，可以登录');
      console.log('\n💡 如果仍然无法登录，请检查：');
      console.log('   1. 密码是否正确');
      console.log('   2. 前端密码加密是否正确');
      console.log('   3. 后端密码解密是否正确');
      console.log('   4. CRYPTO_SECRET 环境变量是否配置正确');
    } else {
      console.log('❌ 发现以下问题:');
      issues.forEach(issue => console.log(`   - ${issue}`));
    }

    process.exit(0);
  } catch (error) {
    console.error('❌ 检查用户时出错:', error);
    process.exit(1);
  }
}

// 获取命令行参数
const email = process.argv[2] || process.env.ADMIN_EMAIL || 'admin@calico-blog.com';

checkUser(email);

