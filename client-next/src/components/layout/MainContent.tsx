'use client'
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

import { useState, useEffect } from 'react';
import { motion } from "framer-motion";
import BlogGrid from "@/components/blog/BlogGrid";
import Footer from "@/components/footer/Footer";
import { getBlogList } from '@/api/blog';
import type { BlogData } from '@/components/blog/BlogGrid';

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
  const [blogs, setBlogs] = useState<BlogData[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [latestBlog, setLatestBlog] = useState<{ title: string; date: string; id: string } | null>(null);

  useEffect(() => {
    const fetchBlogs = async () => {
      try {
        setIsLoading(true);
        const response = await getBlogList({ 
          page: 1, 
          limit: 50,
          status: 'published'
        });
        
        // 转换后端数据格式到前端格式
        const formattedBlogs: BlogData[] = response.data.map((blog: any) => ({
          id: blog._id,
          title: blog.title,
          description: blog.excerpt || blog.content?.substring(0, 200) || '',
          category: blog.category,
          date: blog.publishedAt ? new Date(blog.publishedAt).toISOString().split('T')[0].replace(/-/g, '/') : new Date(blog.createdAt).toISOString().split('T')[0].replace(/-/g, '/'),
          color: `bg-amber-50`
        }));

        setBlogs(formattedBlogs);
        
        // 设置最新文章
        if (formattedBlogs.length > 0) {
          const latest = formattedBlogs[0];
          setLatestBlog({
            title: latest.title,
            date: latest.date,
            id: latest.id.toString()
          });
        }
      } catch (error) {
        console.error('获取博客列表失败:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchBlogs();
  }, []);

  return (
    <main className="flex-1 p-8 bg-linear-to-tr from-sky-100 via-amber-50 to-slate-100 h-screen overflow-y-auto">
      {/* 顶部最新更新信息 */}
      {latestBlog && (
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="flex justify-end items-center mb-8 text-sm text-gray-600"
        >
          <span className="mr-2">recent update:</span>
          <a
            href={`/article/${latestBlog.id}`}
            className="underline text-sky-700 hover:text-amber-700 transition-colors"
          >
            {latestBlog.title} · {latestBlog.date}
          </a>
        </motion.div>
      )}

      {/* 瀑布流博客网格 - 主要内容区域 */}
      {isLoading ? (
        <div className="text-center py-12 text-gray-500">加载中...</div>
      ) : (
        <BlogGrid blogs={blogs} />
      )}
      <Footer />
    </main>
  );
}
