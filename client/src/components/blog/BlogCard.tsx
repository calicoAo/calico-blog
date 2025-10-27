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

/**
 * 博客卡片组件的 Props 类型定义
 */
interface BlogCardProps {
  /** 博客ID */
  id?: number;
  /** 博客标题 */
  title: string;
  /** 博客描述内容 */
  description: string;
  /** 博客分类标签 */
  category: string;
  /** 发布日期 */
  date: string;
  /** 卡片背景色类名 */
  color?: string;
  /** 是否显示心形图标 */
  showHeart?: boolean;
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
  id,
  title,
  description,
  category,
  date,
  color = "bg-amber-50",
  showHeart = false,
}) => {
  const handleCategoryClick = (e: React.MouseEvent) => {
    e.stopPropagation();
  };

  return (
    <a
      href={id ? `/article/${id}` : '#'}
      className={`${color} p-6 shadow-sm hover:shadow-md transition-all duration-300 border border-gray-100 h-full flex flex-col no-underline`}
    >
      {/* 主要内容区域 */}
      <div className="flex-1">
        {/* 博客标题 - 限制显示2行 */}
        <h2 className="text-lg font-semibold text-gray-800 mb-3 line-clamp-2">
          {title}
        </h2>
        
        {/* 博客描述 - 限制显示4行 */}
        <p className="text-sm text-gray-600 leading-relaxed mb-4 line-clamp-4">
          {description}
        </p>
      </div>

      {/* 底部信息栏 */}
      <div className="flex justify-between items-center text-xs text-gray-500 border-t border-gray-200 pt-3 mt-auto">
        {/* 分类标签 - 带心形图标和下划线，可点击跳转 */}
        <a 
          href={`/category/${encodeURIComponent(category)}`}
          onClick={handleCategoryClick}
          className="flex items-center gap-1 hover:text-blue-600 transition-colors duration-200"
        >
          {showHeart && <span className="text-red-500">♥</span>}
          <span className="underline decoration-gray-400">{category}</span>
        </a>
        
        {/* 发布日期 */}
        <span>{date}</span>
      </div>
    </a>
  );
};

export default BlogCard;
