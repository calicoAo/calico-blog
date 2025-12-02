# Calico Blog - Next.js 版本

这是从 React + Vite 迁移到 Next.js 的博客项目。

## 项目结构

```
client-next/
├── src/
│   ├── app/              # Next.js App Router 路由
│   │   ├── layout.tsx   # 根布局
│   │   ├── page.tsx     # 首页
│   │   ├── login/       # 登录页
│   │   ├── articles/    # 文章列表
│   │   ├── article/     # 文章详情
│   │   └── ...
│   ├── components/       # React 组件
│   │   ├── pages/       # 页面组件
│   │   ├── layout/      # 布局组件
│   │   └── ...
│   ├── lib/             # 工具函数
│   ├── api/             # API 封装
│   ├── hooks/           # 自定义 Hooks
│   ├── data/            # 静态数据
│   └── styles/          # 样式文件
├── public/              # 静态资源
└── ...
```

## 开发

```bash
# 安装依赖
npm install

# 启动开发服务器
npm run dev

# 构建生产版本
npm run build

# 启动生产服务器
npm start
```

## 环境变量

创建 `.env.local` 文件：

```env
NEXT_PUBLIC_API_BASE_URL=http://localhost:3001/api
NEXT_PUBLIC_CRYPTO_SECRET=calico-blog-secret-key-2025
API_BASE_URL=http://localhost:3001/api
```

## 迁移状态

查看 `MIGRATION_STATUS.md` 了解详细的迁移进度。

## 主要变化

1. **路由系统**：从 React Router 迁移到 Next.js App Router
2. **环境变量**：从 `import.meta.env.VITE_*` 改为 `process.env.NEXT_PUBLIC_*`
3. **客户端组件**：需要添加 `'use client'` 指令
4. **SSR 支持**：支持服务端渲染和静态生成

## 待完成工作

1. 修改所有页面组件中的 React Router 引用
2. 处理所有 `import.meta.env` 引用
3. 配置 SSR/SSG 策略
4. 测试所有功能
