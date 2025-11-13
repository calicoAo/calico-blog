const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const authRoutes = require('./routes/auth');
const blogRoutes = require('./routes/blog');
const userRoutes = require('./routes/user');

// 加载环境变量
dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// 中间件
app.use(cors());
app.use(express.json());

// 连接 MongoDB
mongoose.connect(process.env.MONGODB_URI || 'mongodb://192.168.0.103:27017/calicosBlog')
.then(() => console.log('MongoDB 连接成功'))
.catch(err => console.error('MongoDB 连接失败:', err));

// 路由
app.use('/api/auth', authRoutes);
app.use('/api/blog', blogRoutes);
app.use('/api/user', userRoutes);

// 健康检查
app.get('/api/health', (req, res) => {
  res.json({ message: '服务器运行正常', timestamp: new Date().toISOString() });
});

// 错误处理中间件
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ message: '服务器内部错误' });
});

// 404 处理
app.use('*', (req, res) => {
  res.status(404).json({ message: '接口不存在' });
});

app.listen(PORT, () => {
  console.log(`服务器运行在端口 ${PORT}`);
});
