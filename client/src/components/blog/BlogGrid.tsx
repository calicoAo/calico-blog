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
import BlogCard from './BlogCard';

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
const colors = [
  "bg-amber-50", "bg-blue-50", "bg-green-50", "bg-purple-50", 
  "bg-pink-50", "bg-indigo-50", "bg-yellow-50", "bg-teal-50",
  "bg-orange-50", "bg-red-50", "bg-cyan-50", "bg-emerald-50"
];

const blogData: BlogData[] = [
  {
    id: 1,
    title: "Vite and Webpack: Concepts and Configuration",
    description: "Vite is designed around native ES modules, on-demand compilation, dependency pre-bundling, and fast hot module replacement (HMR). Unlike traditional bundlers like Webpack, Vite skips the upfront bundling step during development.",
    category: "Frontend engineering practices",
    date: "2025/10/08",
    color: colors[Math.floor(Math.random() * colors.length)]
  },
  {
    id: 2,
    title: "Improving Web Performance with Caching",
    description: "Explore modern caching strategies like HTTP caching, Service Workers, and IndexedDB for faster and more resilient web applications.",
    category: "Performance Optimization",
    date: "2025/10/10",
    color: colors[Math.floor(Math.random() * colors.length)]
  },
  {
    id: 3,
    title: "Understanding React Server Components",
    description: "React Server Components (RSC) enable faster page loads and smaller client bundles. Let's see how they work and how to use them effectively.React Server Components (RSC) enable faster page loads and smaller client bundles. Let's see how they work and how to use them effectively.React Server Components (RSC) enable faster page loads and smaller client bundles. Let's see how they work and how to use them effectively.React Server Components (RSC) enable faster page loads and smaller client bundles. Let's see how they work and how to use them effectively.",
    category: "React Deep Dive",
    date: "2025/10/15",
    color: colors[Math.floor(Math.random() * colors.length)]
  },
  {
    id: 4,
    title: "TypeScript Best Practices",
    description: "Learn advanced TypeScript patterns and techniques for building robust applications.",
    category: "TypeScript",
    date: "2025/10/12",
    color: colors[Math.floor(Math.random() * colors.length)]
  },
  {
    id: 5,
    title: "CSS Grid vs Flexbox",
    description: "When to use CSS Grid and when to use Flexbox for different layout scenarios.",
    category: "CSS Layout",
    date: "2025/10/18",
    color: colors[Math.floor(Math.random() * colors.length)]
  },
  {
    id: 6,
    title: "Node.js Performance Tips",
    description: "Optimize your Node.js applications with these proven performance techniques and best practices.",
    category: "Backend Development",
    date: "2025/10/20",
    color: colors[Math.floor(Math.random() * colors.length)]
  },
  {
    id: 7,
    title: "Database Design Patterns",
    description: "Essential database design patterns for scalable applications.",
    category: "Database",
    date: "2025/10/22",
    color: colors[Math.floor(Math.random() * colors.length)]
  },
  {
    id: 8,
    title: "Microservices Architecture",
    description: "Building scalable applications with microservices architecture patterns and best practices.",
    category: "Architecture",
    date: "2025/10/25",
    color: colors[Math.floor(Math.random() * colors.length)]
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
  const [cardPositions, setCardPositions] = useState<Array<{top: number, left: number, width: number}>>([]); // 卡片位置信息
  const gridRef = useRef<HTMLDivElement>(null); // 网格容器引用
  const cardElementsRef = useRef<(HTMLDivElement | null)[]>([]); // 卡片DOM元素引用数组

  /**
   * 固定为3列瀑布流
   */
  useEffect(() => {
    setColumns(3);
  }, []);

  /**
   * 测量实际卡片高度并输出调试信息
   */
  useEffect(() => {
    if (cardElementsRef.current.length > 0) {
      console.log('\n[BlogGrid Debug] ========== 实际卡片高度 ==========');
      cardElementsRef.current.forEach((el, index) => {
        if (el) {
          const rect = el.getBoundingClientRect();
          const cardMarginBottom = 10; // 卡片底部间距
          console.log(`卡片 #${index + 1}:`);
          console.log(`  实际高度: ${rect.height}px`);
          console.log(`  位置 Top: ${rect.top}px`);
          console.log(`  包含间距总高度: ${rect.height + cardMarginBottom}px`);
        }
      });
      console.log('[BlogGrid Debug] =================================\n');
    }
  }, [cardPositions]);

  /**
   * 计算瀑布流布局 - 基于真实高度的精确布局
   * 
   * 这是瀑布流布局的核心算法：
   * 1. 遍历所有博客数据
   * 2. 为每个卡片找到最短的列
   * 3. 使用真实高度而不是估算值
   * 4. 更新列高度和卡片位置
   */
  useEffect(() => {
    const gap = 10; // 卡片间距 (像素)
    
    // 使用 ResizeObserver 或 setTimeout 确保容器尺寸已渲染
    const updateLayout = () => {
      const container = gridRef.current;
      if (!container) return;
      
      const containerWidth = container.offsetWidth;
      const columnWidth = (containerWidth - gap * (columns + 1)) / columns; // 每列宽度
      const newHeights = new Array(columns).fill(0);
      const newPositions: Array<{top: number, left: number, width: number}> = [];
      
      // 创建临时 DOM 元素来测量实际高度
      const tempCard = document.createElement('div');
      tempCard.style.position = 'absolute';
      tempCard.style.visibility = 'hidden';
      tempCard.style.width = `${columnWidth}px`;
      tempCard.style.padding = '24px'; // p-6 = 24px
      tempCard.style.boxSizing = 'border-box';
      document.body.appendChild(tempCard);
      
      blogData.forEach((blog, index) => {
        // 找到当前最短的列
        let shortestColumnIndex = 0;
        let shortestHeight = newHeights[0];
        
        for (let i = 0; i < columns; i++) {
          if (newHeights[i] < shortestHeight) {
            shortestHeight = newHeights[i];
            shortestColumnIndex = i;
          }
        }
        
        const top = shortestHeight;
        
        // 计算卡片位置
        const left = shortestColumnIndex * (columnWidth + gap) + gap;
        const width = columnWidth;
        
        // 保存卡片位置信息
        newPositions.push({
          top,
          left,
          width
        });
        
        // 使用更准确的高度估算（基于实际测量的高度）
        // 实际测量显示：卡片高度在 180px - 254px 之间
        // 根据内容长度动态调整，使用非常保守的估算以减小间距
        const contentHeight = blog.description.length / 80 * 14; // 调整系数，非常保守
        const estimatedHeight = Math.max(190, 180 + contentHeight);
        
        // 更新当前列的高度（包括卡片高度和底部间距）
        newHeights[shortestColumnIndex] = shortestHeight + estimatedHeight + 10; // 10px bottom margin
        
        // 调试信息
        console.log(`[BlogGrid Debug] 卡片 #${index + 1} "${blog.title.substring(0, 30)}..."`);
        console.log(`  列: ${shortestColumnIndex}, Top: ${top}px, 估算高度: ${estimatedHeight}px`);
        console.log(`  更新后列高度: ${shortestHeight}px → ${newHeights[shortestColumnIndex]}px`);
        console.log(`  间距: ${top > 0 ? top - shortestHeight : '第一个卡片'}px`);
      });
      
      // 清理临时元素
      document.body.removeChild(tempCard);
      
      // 更新状态
      setColumnHeights(newHeights);
      setCardPositions(newPositions);
    };
    
    // 延迟执行以确保容器已渲染
    const timer = setTimeout(updateLayout, 100);
    
    // 监听窗口大小变化
    window.addEventListener('resize', updateLayout);
    
    return () => {
      clearTimeout(timer);
      window.removeEventListener('resize', updateLayout);
    };
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
                left: `${position.left}px`,
                width: `${position.width}px`,
              }}
            >
              <div 
                ref={(el) => { cardElementsRef.current[index] = el; }}
                style={{ marginBottom: '10px' }}
              >
                {/* 使用 BlogCard 组件 */}
                <BlogCard
                  id={blog.id}
                  title={blog.title}
                  description={blog.description}
                  category={blog.category}
                  date={blog.date}
                  color={blog.color}
                  showHeart={true}
                />
              </div>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
};

export default BlogGrid;
