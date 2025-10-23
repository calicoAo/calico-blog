/**
 * BlogGrid 组件 - 瀑布流博客网格布局
 * 
 * 功能：
 * - 实现真正的瀑布流布局，卡片高度根据内容自适应
 * - 响应式设计，根据屏幕宽度自动调整列数
 * - 智能高度计算，确保布局紧凑美观
 * - 流畅的进入动画和悬停效果
 * - 支持多种卡片背景色，增强视觉层次
 * 
 * 技术实现：
 * - 使用 React Hooks 管理状态和副作用
 * - 自定义瀑布流算法，计算每个卡片的最佳位置
 * - Framer Motion 提供流畅的动画效果
 * - TypeScript 提供完整的类型安全
 * 
 * @author lijingru
 * @created 2025-10-19
 */

import React, { useState, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';

/**
 * 博客数据类型定义
 */
interface BlogData {
  /** 博客唯一标识符 */
  id: number;
  /** 博客标题 */
  title: string;
  /** 博客描述内容 */
  description: string;
  /** 博客分类标签 */
  category: string;
  /** 发布日期 */
  date: string;
  /** 卡片背景色类名 */
  color: string;
}

/**
 * 模拟博客数据
 * 
 * 包含8篇示例博客文章，每篇都有不同的背景色，
 * 用于展示瀑布流布局效果。实际项目中这些数据
 * 应该从后端 API 或 CMS 系统获取。
 */
const blogData: BlogData[] = [
  {
    id: 1,
    title: "Vite and Webpack: Concepts and Configuration",
    description: "Vite is designed around native ES modules, on-demand compilation, dependency pre-bundling, and fast hot module replacement (HMR). Unlike traditional bundlers like Webpack, Vite skips the upfront bundling step during development.",
    category: "Frontend engineering practices",
    date: "2025/10/08",
    color: "bg-amber-50"
  },
  {
    id: 2,
    title: "Improving Web Performance with Caching",
    description: "Explore modern caching strategies like HTTP caching, Service Workers, and IndexedDB for faster and more resilient web applications.",
    category: "Performance Optimization",
    date: "2025/10/10",
    color: "bg-blue-50"
  },
  {
    id: 3,
    title: "Understanding React Server Components",
    description: "React Server Components (RSC) enable faster page loads and smaller client bundles. Let's see how they work and how to use them effectively.",
    category: "React Deep Dive",
    date: "2025/10/15",
    color: "bg-green-50"
  },
  {
    id: 4,
    title: "TypeScript Best Practices",
    description: "Learn advanced TypeScript patterns and techniques for building robust applications.",
    category: "TypeScript",
    date: "2025/10/12",
    color: "bg-purple-50"
  },
  {
    id: 5,
    title: "CSS Grid vs Flexbox",
    description: "When to use CSS Grid and when to use Flexbox for different layout scenarios.",
    category: "CSS Layout",
    date: "2025/10/18",
    color: "bg-pink-50"
  },
  {
    id: 6,
    title: "Node.js Performance Tips",
    description: "Optimize your Node.js applications with these proven performance techniques and best practices.",
    category: "Backend Development",
    date: "2025/10/20",
    color: "bg-indigo-50"
  },
  {
    id: 7,
    title: "Database Design Patterns",
    description: "Essential database design patterns for scalable applications.",
    category: "Database",
    date: "2025/10/22",
    color: "bg-yellow-50"
  },
  {
    id: 8,
    title: "Microservices Architecture",
    description: "Building scalable applications with microservices architecture patterns and best practices.",
    category: "Architecture",
    date: "2025/10/25",
    color: "bg-teal-50"
  }
];

/**
 * 瀑布流布局组件
 * 
 * 这是博客网格的核心组件，实现了真正的瀑布流布局。
 * 组件会根据屏幕宽度自动调整列数，并使用自定义算法
 * 计算每个卡片的最佳位置，确保布局紧凑美观。
 * 
 * @returns JSX 元素
 */
const BlogGrid: React.FC = () => {
  // 状态管理
  const [columns, setColumns] = useState<number>(3); // 当前列数
  const [columnHeights, setColumnHeights] = useState<number[]>([0, 0, 0]); // 每列的高度
  const [cardPositions, setCardPositions] = useState<Array<{top: number, left: number, width: string}>>([]); // 卡片位置信息
  const gridRef = useRef<HTMLDivElement>(null); // 网格容器引用

  /**
   * 响应式列数计算
   * 
   * 根据屏幕宽度自动调整瀑布流的列数：
   * - 手机端 (< 640px): 1列
   * - 平板端 (640px - 1024px): 2列  
   * - 桌面端 (> 1024px): 3列
   */
  useEffect(() => {
    const updateColumns = () => {
      const width = window.innerWidth;
      if (width < 640) {
        setColumns(1);
      } else if (width < 1024) {
        setColumns(2);
      } else {
        setColumns(3);
      }
    };

    // 初始化列数
    updateColumns();
    
    // 监听窗口大小变化
    window.addEventListener('resize', updateColumns);
    
    // 清理事件监听器
    return () => window.removeEventListener('resize', updateColumns);
  }, []);

  /**
   * 计算瀑布流布局
   * 
   * 这是瀑布流布局的核心算法：
   * 1. 遍历所有博客数据
   * 2. 为每个卡片找到最短的列
   * 3. 计算卡片的位置和宽度
   * 4. 根据内容长度估算卡片高度
   * 5. 更新列高度和卡片位置
   */
  useEffect(() => {
    const heights = new Array(columns).fill(0); // 初始化每列高度为0
    const positions: Array<{top: number, left: number, width: string}> = []; // 卡片位置数组
    
    blogData.forEach((_, index) => {
      // 找到当前最短的列
      const shortestColumnIndex = heights.indexOf(Math.min(...heights));
      const top = heights[shortestColumnIndex];
      
      // 计算卡片位置（考虑边距）
      const left = (shortestColumnIndex * (100 / columns)) + 1; // 1% 左边距
      const width = (100 / columns) - 2; // 减去2%的总边距
      
      // 保存卡片位置信息
      positions.push({
        top,
        left,
        width: `${width}%`
      });
      
      // 根据内容长度估算卡片高度
      // 基础高度120px + 每3个字符增加1px高度
      const estimatedHeight = 120 + (blogData[index].description.length / 3);
      heights[shortestColumnIndex] += estimatedHeight + 20; // 20px 卡片间距
    });
    
    // 更新状态
    setColumnHeights(heights);
    setCardPositions(positions);
  }, [columns]);

  return (
    <div className="relative w-full">
      {/* 瀑布流容器 - 使用绝对定位布局 */}
      <div 
        ref={gridRef}
        className="relative w-full"
        style={{ height: Math.max(...columnHeights) + 100 }} // 动态设置容器高度
      >
        {/* 渲染所有博客卡片 */}
        {blogData.map((blog, index) => {
          const position = cardPositions[index];
          
          // 如果位置信息不存在，跳过渲染
          if (!position) return null;
          
          return (
            <motion.div
              key={blog.id}
              
              // 进入动画：从下方淡入并上浮
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ 
                duration: 0.6, 
                delay: index * 0.1, // 错开动画时间，形成波浪效果
                ease: "easeOut" 
              }}
              
              // 悬停动画：轻微放大、上浮
              whileHover={{
                scale: 1.02,
                y: -5,
                transition: { duration: 0.2 }
              }}
              
              className="absolute" // 绝对定位，由算法计算位置
              style={{
                top: `${position.top}px`,
                left: `${position.left}%`,
                width: position.width,
              }}
            >
              {/* 博客卡片内容 */}
              <div className={`${blog.color} rounded-xl p-6 shadow-sm hover:shadow-md transition-all duration-300 border border-gray-100 h-full flex flex-col`}>
                {/* 主要内容区域 */}
                <div className="flex-1">
                  {/* 博客标题 - 限制显示2行 */}
                  <h2 className="text-lg font-semibold text-gray-800 mb-3 line-clamp-2">
                    {blog.title}
                  </h2>
                  
                  {/* 博客描述 - 限制显示4行 */}
                  <p className="text-sm text-gray-600 leading-relaxed mb-4 line-clamp-4">
                    {blog.description}
                  </p>
                </div>
                
                {/* 底部信息栏 */}
                <div className="flex justify-between items-center text-xs text-gray-500 border-t border-gray-200 pt-3 mt-auto">
                  {/* 分类标签 - 带心形图标和下划线 */}
                  <span className="flex items-center gap-1">
                    <span className="text-red-500">♥</span>
                    <span className="underline decoration-gray-400">{blog.category}</span>
                  </span>
                  
                  {/* 发布日期 */}
                  <span>{blog.date}</span>
                </div>
              </div>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
};

export default BlogGrid;
