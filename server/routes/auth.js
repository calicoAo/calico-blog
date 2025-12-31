const express = require('express');
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const LoginLog = require('../models/LoginLog');
const { authenticateToken } = require('../middleware/auth');
const { validateLogin } = require('../middleware/validation');
const { decryptPassword, decryptPasswordWithTranskey } = require('../utils/crypto');
const { loginLimiter } = require('../middleware/rateLimit');
const { success, unauthorized, validationError, serverError } = require('../utils/response');
const { createTranskey, validateTranskey, getTranskey, consumeTranskey } = require('../utils/transkey');

const router = express.Router();

// 获取客户端 IP 地址
const getClientIp = (req) => {
  return req.headers['x-forwarded-for']?.split(',')[0] || 
         req.headers['x-real-ip'] || 
         req.connection.remoteAddress || 
         req.socket.remoteAddress ||
         req.ip ||
         'unknown';
};

// 注意：OPTIONS 预检请求通常由 CORS 中间件自动处理
// 如果 CORS 中间件配置正确，这里不需要手动处理
// 但如果需要特殊处理，可以保留此路由
// router.options('/login', (req, res) => {
//   res.header('Access-Control-Allow-Origin', req.headers.origin || '*');
//   res.header('Access-Control-Allow-Methods', 'POST, OPTIONS');
//   res.header('Access-Control-Allow-Headers', 'Content-Type, Authorization, X-Requested-With');
//   res.header('Access-Control-Allow-Credentials', 'true');
//   res.sendStatus(204);
// });

// 获取临时密钥（用于密码加密）
// 注意：此接口不需要认证，是公开接口
router.get('/transkey', (req, res) => {
  try {
    const transkey = createTranskey();
    return success(res, { transkey }, '获取临时密钥成功');
  } catch (error) {
    console.error('生成临时密钥错误:', error);
    return serverError(res);
  }
});

// 用户登录（仅允许管理员登录）
// 注意：此接口不需要认证，是公开接口
router.post('/login', loginLimiter, validateLogin, async (req, res) => {
  console.log('=== 登录接口被调用 ===');
  // 开发环境：隐藏敏感信息
  if (process.env.NODE_ENV === 'development') {
    console.log('请求体:', {
      ...req.body,
      encryptedPassword: req.body.encryptedPassword ? req.body.encryptedPassword.substring(0, 50) + '...' : undefined,
      transkey: req.body.transkey ? req.body.transkey.substring(0, 16) + '...' + req.body.transkey.substring(req.body.transkey.length - 8) : undefined
    });
  } else {
    console.log('请求体:', req.body);
  }
  console.log('请求头:', req.headers);
  
  const clientIp = getClientIp(req);
  const userAgent = req.get('user-agent') || '';
  const { email, encryptedPassword, transkey } = req.body;
  
  console.log('客户端IP:', clientIp);
  console.log('User-Agent:', userAgent);
  console.log('邮箱:', email);
  
  // 开发环境：输出接收到的参数
  if (process.env.NODE_ENV === 'development') {
    console.log('📥 [后端] 接收到的登录参数:');
    console.log('  邮箱:', email);
    console.log('  是否使用临时密钥:', !!transkey);
    if (transkey) {
      console.log('  临时密钥:', transkey.substring(0, 16) + '...' + transkey.substring(transkey.length - 8));
    }
    if (encryptedPassword) {
      console.log('  加密密码:', encryptedPassword.substring(0, 50) + '...');
      console.log('  加密密码长度:', encryptedPassword.length);
    }
  }
  
  // 统一错误信息（防止用户枚举）
  const AUTH_ERROR_MESSAGE = '邮箱或密码错误';

  try {
    // 解密密码
    let password;
    
    if (encryptedPassword && transkey) {
      // 使用临时密钥解密（新方式）
      // 验证临时密钥是否有效
      if (!validateTranskey(transkey)) {
        LoginLog.create({
          email,
          success: false,
          ip: clientIp,
          userAgent,
          reason: '临时密钥无效或已过期'
        }).catch(err => console.error('记录登录日志失败:', err));
        return validationError(res, '临时密钥无效或已过期，请刷新页面重试');
      }
      
      try {
        // 获取临时密钥并解密
        const transkeyValue = getTranskey(transkey);
        if (!transkeyValue) {
          throw new Error('临时密钥无效');
        }
        
        // 开发环境：输出密码对比信息
        if (process.env.NODE_ENV === 'development') {
          console.log('🔐 [后端] 密码解密信息:');
          console.log('  收到的加密密码:', encryptedPassword.substring(0, 50) + '...');
          console.log('  收到的加密密码长度:', encryptedPassword.length);
          console.log('  临时密钥:', transkey.substring(0, 16) + '...' + transkey.substring(transkey.length - 8));
        }
        
        password = decryptPasswordWithTranskey(encryptedPassword, transkeyValue);
        
        // 开发环境：输出解密后的密码
        if (process.env.NODE_ENV === 'development') {
          console.log('  解密后密码:', password);
          console.log('  解密后密码长度:', password.length);
        }
        
        // 使用后删除临时密钥（一次性使用）
        consumeTranskey(transkey);
      } catch (error) {
        console.error('密码解密错误:', error);
        LoginLog.create({
          email,
          success: false,
          ip: clientIp,
          userAgent,
          reason: '密码格式错误'
        }).catch(err => console.error('记录登录日志失败:', err));
        return validationError(res, '密码格式错误');
      }
    } else if (encryptedPassword) {
      // 使用固定密钥解密（向后兼容）
      try {
        // 开发环境：输出密码对比信息
        if (process.env.NODE_ENV === 'development') {
          console.log('🔐 [后端] 密码解密信息（固定密钥）:');
          console.log('  收到的加密密码:', encryptedPassword.substring(0, 50) + '...');
          console.log('  收到的加密密码长度:', encryptedPassword.length);
        }
        
        password = decryptPassword(encryptedPassword);
        
        // 开发环境：输出解密后的密码
        if (process.env.NODE_ENV === 'development') {
          console.log('  解密后密码:', password);
          console.log('  解密后密码长度:', password.length);
        }
      } catch (error) {
        console.error('密码解密错误:', error);
        LoginLog.create({
          email,
          success: false,
          ip: clientIp,
          userAgent,
          reason: '密码格式错误'
        }).catch(err => console.error('记录登录日志失败:', err));
        return validationError(res, '密码格式错误');
      }
    } else if (req.body.password) {
      // 向后兼容：如果没有加密密码，使用普通密码
      password = req.body.password;
    } else {
      LoginLog.create({
        email,
        success: false,
        ip: clientIp,
        userAgent,
        reason: '密码为空'
      }).catch(err => console.error('记录登录日志失败:', err));
      return validationError(res, '密码不能为空');
    }

    // 查找用户
    const user = await User.findOne({ email }).select('+password');
    
    // 统一错误处理：无论用户是否存在，都返回相同错误信息
    let loginSuccess = false;
    let failureReason = '';

    if (!user) {
      failureReason = '用户不存在';
    } else if (!user.isActive) {
      failureReason = '账户已被禁用';
    } else if (user.role !== 'admin') {
      failureReason = '权限不足';
    } else {
      // 验证密码
      // 开发环境：输出密码验证详细信息
      if (process.env.NODE_ENV === 'development') {
        console.log('🔍 [后端] 密码验证信息:');
        console.log('  待验证密码:', password);
        console.log('  数据库密码哈希:', user.password ? user.password.substring(0, 30) + '...' : '无');
        console.log('  密码哈希长度:', user.password ? user.password.length : 0);
        console.log('  密码哈希格式:', user.password ? (user.password.startsWith('$2a$') || user.password.startsWith('$2b$') || user.password.startsWith('$2y$') ? 'bcrypt' : '未知格式') : '无');
      }
      
      const isPasswordValid = await user.comparePassword(password);
      
      // 开发环境：输出验证结果
      if (process.env.NODE_ENV === 'development') {
        console.log('  密码验证结果:', isPasswordValid ? '✅ 通过' : '❌ 失败');
        if (!isPasswordValid && user.password) {
          // 尝试检查是否是 bcrypt 格式
          const isBcryptFormat = user.password.startsWith('$2a$') || user.password.startsWith('$2b$') || user.password.startsWith('$2y$');
          if (!isBcryptFormat) {
            console.log('  ⚠️  警告：数据库中的密码不是 bcrypt 格式！');
            console.log('  建议：运行重置密码脚本修复');
            console.log('  命令：npm run reset-password');
          }
        }
      }
      
      if (!isPasswordValid) {
        failureReason = '密码错误';
      } else {
        loginSuccess = true;
      }
    }

    // 记录登录日志（非阻塞，避免影响登录流程）
    LoginLog.create({
      userId: user?._id || null,
      email,
      success: loginSuccess,
      ip: clientIp,
      userAgent,
      reason: loginSuccess ? '' : failureReason
    }).catch(err => console.error('记录登录日志失败:', err));

    // 如果登录失败，返回统一错误信息
    if (!loginSuccess) {
      // 在开发环境输出详细失败原因（便于调试）
      if (process.env.NODE_ENV === 'development') {
        console.log('❌ 登录失败原因:', failureReason);
        if (user) {
          console.log('   用户存在:', true);
          console.log('   用户角色:', user.role);
          console.log('   账户状态:', user.isActive ? '已启用' : '已禁用');
        } else {
          console.log('   用户存在: false');
        }
      }
      return unauthorized(res, AUTH_ERROR_MESSAGE);
    }

    // 生成 Access Token（短期，15分钟）
    const accessToken = jwt.sign(
      { 
        userId: user._id,
        role: user.role,
        type: 'access'
      },
      process.env.JWT_SECRET,
      { 
        expiresIn: process.env.JWT_EXPIRES_IN || '15m',
        issuer: 'calico-blog',
        audience: 'calico-blog-users'
      }
    );

    // 生成 Refresh Token（长期，7天）
    const refreshToken = jwt.sign(
      { 
        userId: user._id,
        type: 'refresh'
      },
      process.env.JWT_REFRESH_SECRET || process.env.JWT_SECRET,
      { 
        expiresIn: process.env.JWT_REFRESH_EXPIRES_IN || '7d',
        issuer: 'calico-blog',
        audience: 'calico-blog-users'
      }
    );

    return success(res, {
      accessToken,
      refreshToken,
      user: user.toJSON()
    }, '登录成功');
  } catch (error) {
    console.error('登录错误:', error);
    
    // 记录登录失败日志
    await LoginLog.create({
      email,
      success: false,
      ip: clientIp,
      userAgent,
      reason: '服务器错误'
    }).catch(err => console.error('记录登录日志失败:', err));
    
    return serverError(res);
  }
});

// 获取当前用户信息
router.get('/me', authenticateToken, async (req, res) => {
  try {
    return success(res, {
      user: req.user
    }, '获取用户信息成功');
  } catch (error) {
    console.error('获取用户信息错误:', error);
    return serverError(res);
  }
});

// 刷新 token（使用 Refresh Token）
router.post('/refresh', async (req, res) => {
  try {
    const { refreshToken } = req.body;

    if (!refreshToken) {
      return unauthorized(res, 'Refresh Token 缺失');
    }

    // 验证 Refresh Token
    const decoded = jwt.verify(
      refreshToken, 
      process.env.JWT_REFRESH_SECRET || process.env.JWT_SECRET
    );

    // 检查 token 类型
    if (decoded.type !== 'refresh') {
      return unauthorized(res, '无效的 Refresh Token');
    }

    // 查找用户
    const user = await User.findById(decoded.userId);
    if (!user || !user.isActive) {
      return unauthorized(res, '用户不存在或已被禁用');
    }

    // 生成新的 Access Token
    const accessToken = jwt.sign(
      { 
        userId: user._id,
        role: user.role,
        type: 'access'
      },
      process.env.JWT_SECRET,
      { 
        expiresIn: process.env.JWT_EXPIRES_IN || '15m',
        issuer: 'calico-blog',
        audience: 'calico-blog-users'
      }
    );

    return success(res, {
      accessToken
    }, 'Token 刷新成功');
  } catch (error) {
    if (error.name === 'JsonWebTokenError') {
      return unauthorized(res, '无效的 Refresh Token');
    }
    if (error.name === 'TokenExpiredError') {
      return unauthorized(res, 'Refresh Token 已过期，请重新登录');
    }
    console.error('Token 刷新错误:', error);
    return serverError(res);
  }
});

// 登出（客户端处理，这里只是返回成功消息）
// 注意：JWT 是无状态的，真正的登出需要客户端删除 token
// 如果需要服务端控制，可以使用 token 黑名单（Redis）
router.post('/logout', authenticateToken, (req, res) => {
  // 可以在这里记录登出日志
  return success(res, null, '登出成功');
});

module.exports = router;
