/**
 * BlogCard 组件 - 单个博客卡片
 * 
 * 功能：
 * - 显示博客标题、描述、分类和日期
 * - 支持悬停动画效果（缩放、上浮、阴影）
 * - 响应式设计，适配不同屏幕尺寸
 * - 使用 Framer Motion 提供流畅的进入动画
 * 
 * @author lijingru
 * @created 2025-10-19
 */

import React from "react";
import { motion } from "framer-motion";

/**
 * 博客卡片组件的 Props 类型定义
 */
interface BlogCardProps {
  /** 博客标题 */
  title: string;
  /** 博客描述内容 */
  description: string;
  /** 博客分类标签 */
  category: string;
  /** 发布日期 */
  date: string;
}

/**
 * 博客卡片组件
 * 
 * 这是一个可复用的博客卡片组件，用于在瀑布流布局中显示博客文章的基本信息。
 * 组件包含标题、描述、分类和日期，并具有优雅的动画效果。
 * 
 * @param props - 博客卡片属性
 * @returns JSX 元素
 */
const BlogCard: React.FC<BlogCardProps> = ({
  title,
  description,
  category,
  date,
}) => {
  return (
    <motion.div
      // 进入动画：从下方淡入并上浮
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, ease: "easeOut" }}
      viewport={{ once: true }} // 只触发一次动画
      
      // 悬停动画：轻微放大、上浮并添加阴影
      whileHover={{
        scale: 1.03,
        y: -4,
        boxShadow: "0 10px 25px rgba(0,0,0,0.1)",
      }}
      
      // 样式类：半透明背景、圆角、内边距、弹性布局、阴影
      className="bg-amber-50/80 backdrop-blur-sm rounded-xl p-5 flex flex-col justify-between shadow-sm
                 hover:shadow-md transition-all duration-300 border border-amber-100"
    >
      {/* 主要内容区域 */}
      <div>
        {/* 博客标题 */}
        <h2 className="text-lg font-semibold text-gray-800 mb-2">
          {title}
        </h2>
        
        {/* 博客描述 - 限制显示行数 */}
        <p className="text-sm text-gray-600 leading-snug mb-4 line-clamp-3">
          {description}
        </p>
      </div>

      {/* 底部信息栏 */}
      <div className="flex justify-between items-center text-xs text-gray-500 border-t pt-2">
        {/* 分类标签 - 带下划线装饰 */}
        <span className="underline decoration-amber-400">
          {category}
        </span>
        
        {/* 发布日期 */}
        <span>{date}</span>
      </div>
    </motion.div>
  );
};

export default BlogCard;
