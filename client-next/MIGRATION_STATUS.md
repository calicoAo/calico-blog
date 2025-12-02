# Next.js 迁移状态

## 已完成

### 1. 项目初始化 ✅
- [x] 创建 Next.js 项目
- [x] 安装所有依赖
- [x] 配置 next.config.ts
- [x] 配置全局样式

### 2. 工具函数和 API ✅
- [x] 迁移 lib/axios.ts（适配 Next.js 环境变量）
- [x] 迁移 lib/crypto.ts
- [x] 迁移 lib/utils.ts
- [x] 迁移 lib/font.ts
- [x] 迁移所有 API 文件（auth.ts, blog.ts, user.ts）

### 3. Hooks ✅
- [x] 迁移 useAuth.ts（添加 SSR 支持）
- [x] 迁移 useFadeInOnScroll.ts
- [x] 迁移 useHoverMotion.ts

### 4. 组件迁移 ✅
- [x] 复制所有组件到新项目
- [x] 添加 'use client' 指令到所有需要的组件
- [x] 修改 BackToHome.tsx（React Router → Next.js Link）
- [x] 修改 BlogCard.tsx（React Router → Next.js）
- [x] 修改 ProjectCarousel.tsx（React Router → Next.js）
- [x] 修改 CategorySidebarList.tsx（React Router → Next.js）

### 5. 静态资源 ✅
- [x] 迁移 assets/ 到 public/assets/
- [x] 迁移 data/ 目录
- [x] 迁移 styles/ 目录

## 待完成

### 1. 页面路由迁移（进行中）
需要将 `client/src/pages/` 中的页面迁移到 `client-next/src/app/` 路由结构：

- [ ] `Home.tsx` → `app/page.tsx`
- [ ] `Login.tsx` → `app/login/page.tsx`
- [ ] `ArticleDetail.tsx` → `app/article/[id]/page.tsx`
- [ ] `ArticleList.tsx` → `app/articles/page.tsx`
- [ ] `ArticlePublish.tsx` → `app/publish/page.tsx`
- [ ] `Contact.tsx` → `app/contact/page.tsx`
- [ ] `About.tsx` → `app/about/page.tsx`
- [ ] `ProjectDetail.tsx` → `app/project/[id]/page.tsx`
- [ ] `AccessLogs.tsx` → `app/admin/logs/page.tsx`

### 2. 组件中剩余的 React Router 引用
需要检查并修改以下组件中的 React Router 引用：
- [ ] 检查所有组件中的 `Link` 组件（`to` → `href`）
- [ ] 检查所有组件中的 `useNavigate`（→ `useRouter`）
- [ ] 检查所有组件中的 `useParams`（→ `params` prop）
- [ ] 检查所有组件中的 `useSearchParams`（→ `searchParams` prop）

### 3. 环境变量配置
- [ ] 创建 `.env.local` 文件（已创建但被忽略）
- [ ] 确保所有环境变量使用 `NEXT_PUBLIC_` 前缀

### 4. SSR/SSG 策略
需要为每个页面确定渲染策略：
- [ ] 首页：SSG
- [ ] 文章列表：ISR
- [ ] 文章详情：SSR
- [ ] 登录页：CSR
- [ ] 发布页：CSR（需要认证）
- [ ] 关于页：SSG
- [ ] 联系页：SSG

### 5. 路由动画
- [ ] 创建 `app/template.tsx` 或修改 `app/layout.tsx` 以支持页面转场动画
- [ ] 使用 `usePathname` 作为动画 key

### 6. 测试和验证
- [ ] 测试所有路由
- [ ] 测试 API 调用
- [ ] 测试认证流程
- [ ] 测试 SSR/SSG 功能
- [ ] 检查控制台错误

## 注意事项

1. **客户端组件标记**：所有使用以下特性的组件必须添加 `'use client'`：
   - useState, useEffect 等 Hooks
   - 事件处理器
   - localStorage, window API
   - Framer Motion
   - Tiptap 编辑器

2. **路由导航**：
   - `useNavigate()` → `useRouter()` from `next/navigation`
   - `Link` from `react-router-dom` → `Link` from `next/link`
   - `to` prop → `href` prop

3. **动态路由**：
   - `useParams()` → `params` prop in page component
   - `useSearchParams()` → `searchParams` prop in page component

4. **环境变量**：
   - `import.meta.env.VITE_*` → `process.env.NEXT_PUBLIC_*`
   - 服务端使用 `process.env.*`（不需要 NEXT_PUBLIC_ 前缀）

5. **API 调用**：
   - 客户端：使用现有的 axios 封装
   - 服务端：使用 `fetch` API 或创建服务端 API 函数

## 下一步

1. 开始迁移页面路由
2. 处理页面中的 React Router 引用
3. 配置 SSR/SSG 策略
4. 测试所有功能

