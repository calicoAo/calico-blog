const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const helmet = require('helmet');
const morgan = require('morgan');
const authRoutes = require('./routes/auth');
const blogRoutes = require('./routes/blog');
const userRoutes = require('./routes/user');
const analyticsRoutes = require('./routes/analytics');
const { apiLimiter } = require('./middleware/rateLimit');
const { error, forbidden, serverError } = require('./utils/response');

// 加载环境变量
dotenv.config();

const app = express();
const PORT = process.env.PORT || 3001; // 改为3001，避免与 macOS AirPlay 冲突

// 允许的来源列表
const allowedOrigins = [
  'http://localhost:5173',  // Vite 默认端口
  'http://localhost:3000',  // Next.js 默认端口
  'http://localhost:5174',  // Vite 备用端口
  'http://127.0.0.1:5173',
  'http://127.0.0.1:3000',
  'http://127.0.0.1:5174',
  'http://8.129.88.130:3000',  // 生产环境前端
  'http://8.129.88.130',       // 生产环境（无端口）
  'https://www.calicovo.space', // 添加这行
  'http://www.calicovo.space',  // 添加这行（如果需要支持 HTTP）
];

// CORS 配置
const corsOptions = {
  origin: function (origin, callback) {
    // 开发环境：允许无 origin（如 Postman、curl）或允许的来源
    if (!origin || allowedOrigins.indexOf(origin) !== -1) {
      callback(null, true);
    } else {
      console.warn('CORS: 不允许的来源:', origin);
      callback(new Error('不允许的 CORS 来源'));
    }
  },
  credentials: true, // 允许携带凭证（cookies, authorization headers）
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With'],
  exposedHeaders: ['Authorization'],
  maxAge: 86400, // 预检请求缓存时间（24小时）
  preflightContinue: false, // 立即响应预检请求
  optionsSuccessStatus: 204, // 预检请求成功状态码
};

// ============================================
// 中间件配置（按照 Express 官方文档最佳实践）
// ============================================
// 执行顺序：从上到下依次执行
// 参考：https://expressjs.com/zh-cn/guide/writing-middleware.html

// 1. Helmet - 安全响应头（必须在最前面）
// 作用：设置各种 HTTP 安全响应头
app.use(helmet({
  crossOriginResourcePolicy: { policy: "cross-origin" }, // 允许跨域资源
  contentSecurityPolicy: false, // 开发环境可以关闭，生产环境需要配置
}));

// 2. CORS - 跨域配置（必须在路由之前，在 Helmet 之后）
// 作用：处理跨域请求和 OPTIONS 预检请求
// 注意：CORS 中间件会自动处理 OPTIONS 请求，无需手动处理
app.use(cors(corsOptions));

// 3. 请求日志（在 CORS 之后，解析之前）
// 作用：记录 HTTP 请求日志
if (process.env.NODE_ENV === 'development') {
  app.use(morgan('dev'));
} else {
  app.use(morgan('combined'));
}

// 4. JSON 解析中间件（必须在路由之前）
// 作用：解析 JSON 格式的请求体
// 注意：必须在调试中间件之前，这样 req.body 才能被正确解析
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ limit: '10mb', extended: true }));

// 5. 调试中间件：记录所有请求（在解析之后）
// 作用：开发环境调试，记录请求详情
// 注意：必须在 JSON 解析之后，才能正确显示 req.body
if (process.env.NODE_ENV === 'development') {
  app.use((req, res, next) => {
    console.log(`\n[${new Date().toISOString()}] ${req.method} ${req.path}`);
    console.log('Headers:', JSON.stringify(req.headers, null, 2));
    console.log('Query:', req.query);
    console.log('Body:', req.body);
    next(); // 必须调用 next() 继续执行下一个中间件
  });
}

// 6. 通用速率限制（应用到所有 API，但排除健康检查）
// 作用：防止 API 滥用和暴力攻击
// 注意：必须在路由之前，但在解析之后
app.use('/api', (req, res, next) => {
  // 健康检查不限制速率
  if (req.path === '/health') {
    return next();
  }
  // 调用速率限制中间件
  apiLimiter(req, res, next);
});

// ============================================
// 数据库连接
// ============================================
mongoose.connect(process.env.MONGODB_URI || 'mongodb://192.168.0.103:27017/calicosBlog', {
  // 连接超时设置
  serverSelectionTimeoutMS: 30000, // 30 秒内选择服务器
  socketTimeoutMS: 45000, // 45 秒 socket 超时
  connectTimeoutMS: 30000, // 30 秒连接超时
  // Mongoose 缓冲设置
  bufferTimeoutMS: 30000, // 30 秒缓冲超时（默认 10 秒）
  bufferCommands: true, // 启用命令缓冲
  // 其他选项
  maxPoolSize: 10, // 最大连接池大小
  minPoolSize: 2, // 最小连接池大小
  maxIdleTimeMS: 30000, // 30 秒空闲超时
})
  .then(() => console.log('✅ MongoDB 连接成功'))
  .catch(err => console.error('❌ MongoDB 连接失败:', err));

// ============================================
// 路由配置（必须在所有中间件之后）
// ============================================
// 注意：路由的顺序也很重要，更具体的路由应该放在前面

// 健康检查（放在最前面，避免被其他中间件影响）
app.get('/api/health', (req, res) => {
  res.json({ 
    message: '服务器运行正常', 
    timestamp: new Date().toISOString(),
    uptime: process.uptime()
  });
});

// API 路由
app.use('/api/auth', authRoutes);
app.use('/api/blog', blogRoutes);
app.use('/api/user', userRoutes);
app.use('/api/analytics', analyticsRoutes);

// ============================================
// 错误处理（必须在所有路由之后）
// ============================================

// 404 处理（处理未匹配的路由）
// 注意：必须在所有路由之后，但在错误处理中间件之前
app.use((req, res, next) => {
  const { notFound } = require('./utils/response');
  return notFound(res, '接口不存在');
});

// 错误处理中间件（必须是 4 个参数：err, req, res, next）
// 注意：必须在最后，Express 会自动识别 4 个参数的中间件为错误处理中间件
app.use((err, req, res, next) => {
  // 记录错误日志
  console.error('\n❌ 错误处理中间件被触发');
  console.error('错误信息:', err.message);
  console.error('错误堆栈:', err.stack);
  console.error('请求路径:', req.path);
  console.error('请求方法:', req.method);
  console.error('请求体:', req.body);
  
  // 如果是 CORS 错误
  if (err.message && err.message.includes('CORS')) {
    console.error('CORS 错误:', err.message);
    return forbidden(res, err.message);
  }
  
  // 如果是速率限制错误
  if (err.status === 429) {
    console.error('速率限制错误');
    return error(res, err.message || '请求过于频繁', 429);
  }
  
  // 如果是 JWT 错误
  if (err.name === 'JsonWebTokenError' || err.name === 'TokenExpiredError') {
    const { unauthorized } = require('./utils/response');
    return unauthorized(res, err.message || '认证失败');
  }
  
  // 如果是验证错误
  if (err.name === 'ValidationError') {
    const { validationError } = require('./utils/response');
    return validationError(res, err.message || '验证失败', err.errors);
  }
  
  // 默认服务器错误
  console.error('服务器错误:', err.stack);
  return serverError(res, err.message || '服务器内部错误');
});

app.listen(PORT, () => {
  console.log(`服务器运行在端口 ${PORT}`);
});
