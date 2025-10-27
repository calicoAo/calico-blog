/**
 * MainContent 组件 - 主内容区域
 *
 * 功能：
 * - 显示博客文章的主要内容区域
 * - 包含最新更新信息展示
 * - 集成瀑布流博客网格布局
 * - 提供页脚版权信息
 * - 响应式设计，适配不同屏幕尺寸
 *
 * 布局特点：
 * - 左侧留出25%空间给Sidebar
 * - 渐变背景增强视觉效果
 * - 流畅的进入动画
 * - 清晰的信息层次结构
 *
 * @author lijingru
 * @created 2025-10-19
 */

import { motion } from "framer-motion";
import BlogGrid from "@/components/blog/BlogGrid";
import Footer from "@/components/footer/Footer";

/**
 * 主内容区域组件
 *
 * 这是网站的主要内容展示区域，包含博客文章网格、
 * 最新更新信息和页脚。使用渐变背景和动画效果
 * 提升视觉体验。
 *
 * @returns JSX 元素
 */
export default function MainContent() {
  return (
    <main className="flex-1 p-8 bg-linear-to-tr from-sky-100 via-amber-50 to-slate-100 h-screen overflow-y-auto">
      {/* 顶部最新更新信息 */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="flex justify-end items-center mb-8 text-sm text-gray-600"
      >
        <span className="mr-2">recent update:</span>
        <a
          href="#"
          className="underline text-sky-700 hover:text-amber-700 transition-colors"
        >
          Vite and Webpack: Concepts and Configuration · 2025/10/08
        </a>
      </motion.div>

      {/* 瀑布流博客网格 - 主要内容区域 */}
      <BlogGrid />
      <Footer />
    </main>
  );
}
