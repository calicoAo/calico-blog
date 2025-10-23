/**
 * BlogTag 组件 - 博客分类标签
 * 
 * 功能：
 * - 显示博客文章的分类标签
 * - 支持点击筛选功能
 * - 可自定义标签样式和颜色
 * - 响应式设计，适配不同屏幕尺寸
 * 
 * 使用场景：
 * - 在博客卡片中显示文章分类
 * - 在侧边栏中提供分类筛选
 * - 在文章详情页显示相关标签
 * 
 * @author lijingru
 * @created 2025-10-19
 */

import React from 'react';

/**
 * 博客标签组件的 Props 类型定义
 */
interface BlogTagProps {
  /** 标签文本内容 */
  text: string;
  /** 标签颜色主题 */
  variant?: 'default' | 'primary' | 'secondary' | 'success' | 'warning' | 'danger';
  /** 是否可点击 */
  clickable?: boolean;
  /** 点击事件处理函数 */
  onClick?: () => void;
  /** 自定义样式类名 */
  className?: string;
}

/**
 * 博客标签组件
 * 
 * 这是一个可复用的标签组件，用于显示博客文章的分类信息。
 * 支持多种颜色主题和交互状态，可以根据需要自定义样式。
 * 
 * @param props - 标签组件属性
 * @returns JSX 元素
 */
const BlogTag: React.FC<BlogTagProps> = ({
  text,
  variant = 'default',
  clickable = false,
  onClick,
  className = '',
}) => {
  // 根据变体类型返回对应的样式类名
  const getVariantStyles = () => {
    const baseStyles = 'inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium';
    
    switch (variant) {
      case 'primary':
        return `${baseStyles} bg-blue-100 text-blue-800`;
      case 'secondary':
        return `${baseStyles} bg-gray-100 text-gray-800`;
      case 'success':
        return `${baseStyles} bg-green-100 text-green-800`;
      case 'warning':
        return `${baseStyles} bg-yellow-100 text-yellow-800`;
      case 'danger':
        return `${baseStyles} bg-red-100 text-red-800`;
      default:
        return `${baseStyles} bg-amber-100 text-amber-800`;
    }
  };

  // 组合所有样式类名
  const combinedClassName = `
    ${getVariantStyles()}
    ${clickable ? 'cursor-pointer hover:opacity-80 transition-opacity duration-200' : ''}
    ${className}
  `.trim();

  return (
    <span
      className={combinedClassName}
      onClick={clickable ? onClick : undefined}
      role={clickable ? 'button' : undefined}
      tabIndex={clickable ? 0 : undefined}
    >
      {text}
    </span>
  );
};

export default BlogTag;
