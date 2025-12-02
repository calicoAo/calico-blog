const jwt = require('jsonwebtoken');
const User = require('../models/User');
const { unauthorized, forbidden, serverError } = require('../utils/response');

// 验证 JWT token
// 注意：这是一个异步中间件，必须正确处理 Promise 和错误
const authenticateToken = async (req, res, next) => {
  try {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1]; // Bearer TOKEN

    if (!token) {
      return unauthorized(res, '访问令牌缺失');
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    
    // 检查 token 类型（必须是 access token）
    if (decoded.type && decoded.type !== 'access') {
      return unauthorized(res, '无效的访问令牌类型');
    }
    
    const user = await User.findById(decoded.userId).select('-password');
    
    if (!user) {
      return unauthorized(res, '用户不存在');
    }

    if (!user.isActive) {
      return unauthorized(res, '账户已被禁用');
    }

    req.user = user;
    req.token = token;
    next();
  } catch (error) {
    if (error.name === 'JsonWebTokenError') {
      return unauthorized(res, '无效的访问令牌');
    }
    if (error.name === 'TokenExpiredError') {
      return unauthorized(res, '访问令牌已过期，请刷新');
    }
    console.error('认证中间件错误:', error);
    return serverError(res);
  }
};

// 验证管理员权限
const requireAdmin = (req, res, next) => {
  if (req.user.role !== 'admin') {
    return forbidden(res, '需要管理员权限');
  }
  next();
};

// 可选认证（不强制要求登录）
const optionalAuth = async (req, res, next) => {
  try {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];

    if (token) {
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      const user = await User.findById(decoded.userId).select('-password');
      if (user && user.isActive) {
        req.user = user;
      }
    }
    next();
  } catch (error) {
    // 可选认证失败时不返回错误，继续执行
    next();
  }
};

module.exports = {
  authenticateToken,
  requireAdmin,
  optionalAuth
};
