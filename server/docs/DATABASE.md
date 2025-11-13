# 数据库设计文档

## 概述

Calico Blog 使用 MongoDB 作为数据库，通过 Mongoose ODM 进行数据建模和操作。

## 数据库信息

- **数据库名称**: `calicosBlog` (可在 `.env` 文件中配置)
- **连接地址**: `mongodb://192.168.0.103:27017/calicosBlog` (可在 `.env` 文件中配置)

## 集合设计

### 1. users（用户集合）

存储用户账户信息。

#### 字段说明

| 字段名 | 类型 | 必填 | 说明 | 约束 |
|--------|------|------|------|------|
| `username` | String | 是 | 用户名 | 3-20字符，唯一 |
| `email` | String | 是 | 邮箱地址 | 唯一，符合邮箱格式 |
| `password` | String | 是 | 密码（加密） | 最少6字符，bcrypt加密 |
| `avatar` | String | 否 | 头像URL | 默认空字符串 |
| `bio` | String | 否 | 个人简介 | 最多200字符 |
| `role` | String | 否 | 用户角色 | `user` 或 `admin`，默认 `user` |
| `isActive` | Boolean | 否 | 账户状态 | 默认 `true` |
| `createdAt` | Date | 自动 | 创建时间 | 自动生成 |
| `updatedAt` | Date | 自动 | 更新时间 | 自动生成 |

#### 索引

- `username`: 唯一索引
- `email`: 唯一索引
- `role`: 普通索引
- `isActive`: 普通索引

#### 示例文档

```json
{
  "_id": ObjectId("..."),
  "username": "john_doe",
  "email": "john@example.com",
  "password": "$2a$12$...",
  "avatar": "https://example.com/avatar.jpg",
  "bio": "热爱编程的开发者",
  "role": "user",
  "isActive": true,
  "createdAt": ISODate("2024-01-01T00:00:00Z"),
  "updatedAt": ISODate("2024-01-01T00:00:00Z")
}
```

### 2. blogs（博客集合）

存储博客文章信息。

#### 字段说明

| 字段名 | 类型 | 必填 | 说明 | 约束 |
|--------|------|------|------|------|
| `title` | String | 是 | 文章标题 | 最多100字符 |
| `content` | String | 是 | 文章内容 | 最少10字符 |
| `excerpt` | String | 否 | 文章摘要 | 最多200字符，自动生成 |
| `coverImage` | String | 否 | 封面图片URL | 默认空字符串 |
| `tags` | Array[String] | 否 | 标签数组 | 字符串数组 |
| `category` | String | 否 | 分类 | 默认 "未分类" |
| `author` | ObjectId | 是 | 作者ID | 引用 `users._id` |
| `status` | String | 否 | 文章状态 | `draft`/`published`/`archived`，默认 `draft` |
| `publishedAt` | Date | 否 | 发布时间 | 发布时自动设置 |
| `views` | Number | 否 | 浏览量 | 默认 0 |
| `likes` | Array[ObjectId] | 否 | 点赞用户ID数组 | 引用 `users._id` |
| `comments` | Array[Object] | 否 | 评论数组 | 嵌套文档 |
| `createdAt` | Date | 自动 | 创建时间 | 自动生成 |
| `updatedAt` | Date | 自动 | 更新时间 | 自动生成 |

#### comments 嵌套文档结构

| 字段名 | 类型 | 必填 | 说明 |
|--------|------|------|------|
| `user` | ObjectId | 是 | 评论用户ID，引用 `users._id` |
| `content` | String | 是 | 评论内容，最多500字符 |
| `createdAt` | Date | 自动 | 评论时间，自动生成 |

#### 索引

- `title` + `content`: 文本索引（用于全文搜索）
- `author` + `status`: 复合索引
- `publishedAt`: 降序索引
- `tags`: 普通索引
- `status`: 普通索引
- `category`: 普通索引

#### 示例文档

```json
{
  "_id": ObjectId("..."),
  "title": "MongoDB 数据库设计指南",
  "content": "这是一篇关于 MongoDB 数据库设计的详细文章...",
  "excerpt": "这是一篇关于 MongoDB 数据库设计的详细文章...",
  "coverImage": "https://example.com/cover.jpg",
  "tags": ["MongoDB", "数据库", "设计"],
  "category": "技术",
  "author": ObjectId("..."),
  "status": "published",
  "publishedAt": ISODate("2024-01-01T00:00:00Z"),
  "views": 150,
  "likes": [ObjectId("..."), ObjectId("...")],
  "comments": [
    {
      "user": ObjectId("..."),
      "content": "很好的文章！",
      "createdAt": ISODate("2024-01-02T00:00:00Z")
    }
  ],
  "createdAt": ISODate("2024-01-01T00:00:00Z"),
  "updatedAt": ISODate("2024-01-01T00:00:00Z")
}
```

## 关系设计

### 用户与博客

- **一对多关系**: 一个用户可以创建多篇博客
- **引用方式**: `blogs.author` 引用 `users._id`

### 用户与点赞

- **多对多关系**: 一个用户可以点赞多篇博客，一篇博客可以被多个用户点赞
- **实现方式**: `blogs.likes` 数组存储用户ID

### 用户与评论

- **一对多关系**: 一个用户可以对多篇博客进行评论，一篇博客可以有多个评论
- **实现方式**: `blogs.comments` 嵌套文档数组，每个评论包含用户ID

## 数据库初始化

### 初始化步骤

1. **确保 MongoDB 服务正在运行**

2. **配置环境变量**

   复制 `env.example` 为 `.env` 并配置：
   ```bash
   cp env.example .env
   ```

3. **运行初始化脚本**

   ```bash
   npm run init-db
   ```

   初始化脚本会：
   - 连接 MongoDB 数据库
   - 创建所有必要的索引
   - 创建默认管理员账户（如果不存在）
   - 显示数据库统计信息

### 默认管理员账户

初始化脚本会自动创建默认管理员账户（如果不存在）：

- **邮箱**: `admin@calico-blog.com` (可在 `.env` 中配置 `ADMIN_EMAIL`)
- **用户名**: `admin` (可在 `.env` 中配置 `ADMIN_USERNAME`)
- **密码**: `admin123456` (可在 `.env` 中配置 `ADMIN_PASSWORD`)

⚠️ **重要**: 首次登录后请立即修改默认管理员密码！

## 索引优化

### User 集合索引

- `username` 唯一索引：快速查找用户，确保用户名唯一
- `email` 唯一索引：快速查找用户，确保邮箱唯一
- `role` 索引：按角色查询用户
- `isActive` 索引：按状态查询用户

### Blog 集合索引

- `title` + `content` 文本索引：支持全文搜索
- `author` + `status` 复合索引：优化按作者和状态查询
- `publishedAt` 降序索引：优化按发布时间排序
- `tags` 索引：优化按标签查询
- `status` 索引：优化按状态查询
- `category` 索引：优化按分类查询

## 数据验证

### User 模型验证

- 用户名：3-20字符，唯一
- 邮箱：符合邮箱格式，唯一
- 密码：最少6字符，自动加密
- 角色：只能是 `user` 或 `admin`
- 个人简介：最多200字符

### Blog 模型验证

- 标题：必填，最多100字符
- 内容：必填，最少10字符
- 摘要：最多200字符，可自动生成
- 状态：只能是 `draft`、`published` 或 `archived`
- 评论内容：最多500字符

## 数据安全

1. **密码加密**: 使用 bcryptjs 进行密码加密，默认12轮加密
2. **JWT 认证**: 使用 JWT token 进行用户认证
3. **权限控制**: 基于角色的访问控制（RBAC）
4. **数据验证**: Mongoose schema 验证确保数据完整性

## 备份建议

建议定期备份 MongoDB 数据库：

```bash
# 备份数据库
mongodump --uri="mongodb://192.168.0.103:27017/calicosBlog" --out=/path/to/backup

# 恢复数据库
mongorestore --uri="mongodb://192.168.0.103:27017/calicosBlog" /path/to/backup/calicosBlog
```

## 性能优化建议

1. **使用索引**: 所有查询字段都已建立索引
2. **分页查询**: 使用 `skip` 和 `limit` 进行分页
3. **字段选择**: 使用 `select()` 只查询需要的字段
4. **聚合查询**: 使用 MongoDB 聚合管道进行复杂统计
5. **连接池**: Mongoose 默认使用连接池，无需额外配置

## 常见问题

### Q: 如何重置数据库？

A: 删除数据库并重新运行初始化脚本：
```bash
# 连接 MongoDB shell
mongo
# 删除数据库
use calicosBlog
db.dropDatabase()
# 退出并运行初始化
npm run init-db
```

### Q: 如何修改管理员密码？

A: 通过 API 接口或直接更新数据库：
```javascript
// 在 MongoDB shell 中
use calicosBlog
db.users.updateOne(
  { email: "admin@calico-blog.com" },
  { $set: { password: "$2a$12$新的加密密码" } }
)
```

### Q: 如何查看数据库统计信息？

A: 运行初始化脚本会显示统计信息，或使用 MongoDB shell：
```bash
mongo
use calicosBlog
db.users.countDocuments()
db.blogs.countDocuments()
```

