# Calico Blog 后端服务器

基于 Express + MongoDB + JWT 的博客系统后端 API。

## 功能特性

- 🔐 用户认证（注册、登录、JWT）
- 📝 博客管理（CRUD、分类、标签）
- 👤 用户管理（资料更新、权限管理）
- 💬 评论系统
- 👍 点赞功能
- 📊 统计信息
- 🔍 搜索功能

## 技术栈

- **框架**: Express.js
- **数据库**: MongoDB + Mongoose
- **认证**: JWT (jsonwebtoken)
- **加密**: bcryptjs
- **跨域**: cors
- **环境变量**: dotenv

## 快速开始

### 1. 安装依赖

```bash
npm install
```

### 2. 环境配置

复制环境变量模板文件：
```bash
cp env.example .env
```

编辑 `.env` 文件，配置以下变量：
```env
MONGODB_URI=mongodb://localhost:27017/calico-blog
PORT=5000
NODE_ENV=development
JWT_SECRET=your-super-secret-jwt-key-here
JWT_EXPIRES_IN=7d
BCRYPT_ROUNDS=12
```

### 3. 启动服务器

开发模式（自动重启）：
```bash
npm run dev
```

生产模式：
```bash
npm start
```

服务器将在 `http://localhost:5000` 启动。

## API 文档

### 认证接口

- `POST /api/auth/register` - 用户注册
- `POST /api/auth/login` - 用户登录
- `GET /api/auth/me` - 获取当前用户信息
- `POST /api/auth/refresh` - 刷新 token
- `POST /api/auth/logout` - 用户登出

### 博客接口

- `GET /api/blog` - 获取博客列表
- `GET /api/blog/:id` - 获取博客详情
- `POST /api/blog` - 创建博客
- `PUT /api/blog/:id` - 更新博客
- `DELETE /api/blog/:id` - 删除博客
- `POST /api/blog/:id/like` - 点赞/取消点赞
- `POST /api/blog/:id/comments` - 添加评论
- `GET /api/blog/stats/overview` - 获取统计信息

### 用户接口

- `GET /api/user/profile/:id` - 获取用户资料
- `PUT /api/user/profile` - 更新用户资料
- `GET /api/user/:id/blogs` - 获取用户博客列表
- `GET /api/user` - 获取用户列表（管理员）
- `PUT /api/user/:id/status` - 更新用户状态（管理员）
- `PUT /api/user/:id/role` - 更新用户角色（管理员）
- `DELETE /api/user/:id` - 删除用户（管理员）

## 数据模型

### User（用户）
- username: 用户名
- email: 邮箱
- password: 密码（加密存储）
- avatar: 头像
- bio: 个人简介
- role: 角色（user/admin）
- isActive: 账户状态

### Blog（博客）
- title: 标题
- content: 内容
- excerpt: 摘要
- coverImage: 封面图片
- tags: 标签数组
- category: 分类
- author: 作者ID
- status: 状态（draft/published/archived）
- publishedAt: 发布时间
- views: 浏览量
- likes: 点赞用户数组
- comments: 评论数组

## 中间件

- `authenticateToken`: JWT 认证中间件
- `requireAdmin`: 管理员权限中间件
- `optionalAuth`: 可选认证中间件
- `validateRegister`: 注册验证中间件
- `validateLogin`: 登录验证中间件
- `validateBlog`: 博客验证中间件
- `validatePagination`: 分页验证中间件

## 错误处理

所有 API 都返回统一的错误格式：
```json
{
  "message": "错误描述",
  "errors": ["具体错误列表"]
}
```

## 开发说明

1. 确保 MongoDB 服务正在运行
2. 使用 `npm run dev` 启动开发服务器
3. API 文档可通过 Postman 或其他工具测试
4. 所有接口都支持 CORS 跨域请求
