const mongoose = require('mongoose');

/**
 * 访问日志模型
 * 
 * 记录：
 * - 访客 ID（基于 Cookie）
 * - 会话 ID
 * - 访问路径
 * - 来源页面
 * - 用户代理
 * - IP 地址
 * - 屏幕尺寸
 * - 语言
 * - 时间戳
 * - 事件类型（页面访问/自定义事件）
 */
const visitLogSchema = new mongoose.Schema({
  // 访客标识
  visitorId: {
    type: String,
    required: true,
    index: true, // 添加索引以便快速查询
  },
  
  // 会话标识
  sessionId: {
    type: String,
    required: true,
    index: true,
  },
  
  // 访问路径
  path: {
    type: String,
    required: true,
    index: true,
  },
  
  // 来源页面
  referer: {
    type: String,
    default: null,
  },
  
  // 用户代理
  userAgent: {
    type: String,
    default: 'unknown',
  },
  
  // IP 地址
  ip: {
    type: String,
    default: 'unknown',
  },
  
  // 屏幕宽度
  screenWidth: {
    type: Number,
    default: null,
  },
  
  // 屏幕高度
  screenHeight: {
    type: Number,
    default: null,
  },
  
  // 语言
  language: {
    type: String,
    default: 'unknown',
  },
  
  // 时间戳
  timestamp: {
    type: Date,
    required: true,
    default: Date.now,
    index: true, // 添加索引以便按时间查询
  },
  
  // 事件类型（'visit' 或 'event'）
  eventType: {
    type: String,
    enum: ['visit', 'event'],
    default: 'visit',
  },
  
  // 事件名称（仅用于 event 类型）
  event: {
    type: String,
    default: null,
  },
  
  // 事件分类
  category: {
    type: String,
    default: null,
  },
  
  // 事件标签
  label: {
    type: String,
    default: null,
  },
  
  // 事件值
  value: {
    type: Number,
    default: null,
  },
}, {
  timestamps: true, // 自动添加 createdAt 和 updatedAt
});

// 创建复合索引以提高查询性能
visitLogSchema.index({ visitorId: 1, timestamp: -1 });
visitLogSchema.index({ sessionId: 1, timestamp: -1 });
visitLogSchema.index({ path: 1, timestamp: -1 });
visitLogSchema.index({ timestamp: -1 }); // 按时间倒序

// 设置 TTL 索引，自动删除 90 天前的记录（可选）
// visitLogSchema.index({ timestamp: 1 }, { expireAfterSeconds: 90 * 24 * 60 * 60 });

const VisitLog = mongoose.model('VisitLog', visitLogSchema);

module.exports = VisitLog;

