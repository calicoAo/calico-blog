/**
 * 速率限制中间件
 * 
 * 功能：
 * - 防止暴力破解攻击
 * - 限制 API 请求频率
 * 
 * @author lijingru
 * @created 2025-11-13
 */

const rateLimit = require('express-rate-limit');

/**
 * 登录速率限制
 * 15分钟内最多5次尝试
 */
const loginLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15分钟
  max: 5, // 最多5次尝试
  message: {
    message: '登录尝试次数过多，请15分钟后再试'
  },
  standardHeaders: true, // 返回速率限制信息到 `RateLimit-*` 头
  legacyHeaders: false, // 禁用 `X-RateLimit-*` 头
  skipSuccessfulRequests: true, // 成功请求不计入限制
});

/**
 * 通用 API 速率限制
 * 15分钟内最多100次请求
 */
const apiLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15分钟
  max: 100, // 最多100次请求
  message: {
    message: '请求过于频繁，请稍后再试'
  },
  standardHeaders: true,
  legacyHeaders: false,
  handler: (req, res) => {
    console.log('速率限制触发:', req.path);
    res.status(429).json({
      message: '请求过于频繁，请稍后再试'
    });
  }
});

/**
 * 严格速率限制（用于敏感操作）
 * 1小时内最多10次请求
 */
const strictLimiter = rateLimit({
  windowMs: 60 * 60 * 1000, // 1小时
  max: 10, // 最多10次请求
  message: {
    message: '操作过于频繁，请1小时后再试'
  },
  standardHeaders: true,
  legacyHeaders: false,
});

module.exports = {
  loginLimiter,
  apiLimiter,
  strictLimiter
};

