// 测试 CORS 配置
const express = require('express');
const cors = require('cors');

const app = express();
const allowedOrigins = [
  'http://localhost:5173',
  'http://localhost:3000',
  'http://localhost:5174',
  'http://127.0.0.1:5173',
  'http://127.0.0.1:3000',
  'http://127.0.0.1:5174',
];

const corsOptions = {
  origin: function (origin, callback) {
    if (!origin || allowedOrigins.indexOf(origin) !== -1) {
      callback(null, true);
    } else {
      console.warn('CORS: 不允许的来源:', origin);
      callback(new Error('不允许的 CORS 来源'));
    }
  },
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With'],
  exposedHeaders: ['Authorization'],
  maxAge: 86400,
  preflightContinue: false,
  optionsSuccessStatus: 204,
};

app.use(cors(corsOptions));
app.options('*', cors(corsOptions));
app.use(express.json());

app.post('/api/test', (req, res) => {
  res.json({ message: 'CORS 测试成功', origin: req.headers.origin });
});

app.listen(5001, () => {
  console.log('CORS 测试服务器运行在端口 5001');
  console.log('测试命令:');
  console.log('curl -X POST http://localhost:5001/api/test -H "Origin: http://localhost:5173" -H "Content-Type: application/json" -v');
});

