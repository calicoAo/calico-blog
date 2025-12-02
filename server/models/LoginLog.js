/**
 * 登录日志模型
 * 
 * 功能：
 * - 记录用户登录尝试
 * - 用于安全审计和异常检测
 * 
 * @author lijingru
 * @created 2025-11-13
 */

const mongoose = require('mongoose');

const loginLogSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    default: null // 登录失败时可能没有 userId
  },
  email: {
    type: String,
    required: true
  },
  success: {
    type: Boolean,
    required: true,
    default: false
  },
  ip: {
    type: String,
    required: true
  },
  userAgent: {
    type: String,
    default: ''
  },
  reason: {
    type: String,
    default: '' // 失败原因：密码错误、账户禁用、权限不足等
  }
}, {
  timestamps: true,
  // 自动创建索引
  indexes: [
    { userId: 1, createdAt: -1 },
    { email: 1, createdAt: -1 },
    { ip: 1, createdAt: -1 },
    { success: 1, createdAt: -1 }
  ]
});

// 清理旧日志（保留30天）
loginLogSchema.statics.cleanOldLogs = async function() {
  const thirtyDaysAgo = new Date();
  thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
  
  return await this.deleteMany({
    createdAt: { $lt: thirtyDaysAgo }
  });
};

module.exports = mongoose.model('LoginLog', loginLogSchema);

