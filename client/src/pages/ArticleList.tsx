/**
 * ArticleList 页面 - 文章列表页
 * 
 * 功能：
 * - 左侧显示分类列表及文章数量
 * - 右侧显示文章瀑布流列表
 * - 支持按分类筛选文章
 * - 从主页的 blog 链接跳转过来
 * 
 * @author lijingru
 * @created 2025-11-12
 */

import React, { useEffect, useMemo } from 'react';
import { useSearchParams, useParams } from 'react-router-dom';
import { motion } from 'framer-motion';
import BlogGrid from '@/components/blog/BlogGrid';
import CategorySidebarList from '@/components/article/CategorySidebarList';
import type { CategoryData } from '@/components/article/CategorySidebarList';
import { mockBlogs } from '@/data/mockBlogs';
import BackToHome from '@/components/ui/BackToHome';

/**
 * 文章列表页面
 */
const ArticleList: React.FC = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const { categoryName } = useParams<{ categoryName?: string }>();
  
  // 优先使用 URL 参数，其次使用查询参数
  const selectedCategory = categoryName 
    ? decodeURIComponent(categoryName) 
    : (searchParams.get('category') || '');
  
  // 如果从路由参数进入，同步到查询参数
  useEffect(() => {
    if (categoryName && !searchParams.get('category')) {
      setSearchParams({ category: decodeURIComponent(categoryName) });
    }
  }, [categoryName, searchParams, setSearchParams]);

  // 计算分类数据（包含每个分类的文章数量）
  const categories: CategoryData[] = useMemo(() => {
    const categoryMap = new Map<string, number>();
    
    mockBlogs.forEach(blog => {
      const count = categoryMap.get(blog.category) || 0;
      categoryMap.set(blog.category, count + 1);
    });

    return Array.from(categoryMap.entries())
      .map(([name, count]) => ({ name, count }))
      .sort((a, b) => b.count - a.count); // 按文章数量降序排列
  }, []);

  // 根据选中的分类筛选文章
  const filteredBlogs = useMemo(() => {
    if (!selectedCategory) {
      return mockBlogs;
    }
    return mockBlogs.filter(blog => blog.category === selectedCategory);
  }, [selectedCategory]);

  // 处理分类点击
  const handleCategoryClick = (category: string) => {
    if (category) {
      setSearchParams({ category });
    } else {
      setSearchParams({});
    }
    // 滚动到顶部
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="flex h-screen bg-linear-to-tr from-sky-100 via-amber-50 to-slate-100">
      {/* 左侧分类侧边栏 */}
      <CategorySidebarList
        categories={categories}
        selectedCategory={selectedCategory}
        onCategoryClick={handleCategoryClick}
      />

      {/* 右侧文章列表区域 */}
      <main className="flex-1 p-8 overflow-y-auto h-full">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
        >
          {/* 返回首页按钮 */}
          <div className="mb-6">
            <BackToHome />
          </div>

          {/* 页面标题 */}
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">
              {selectedCategory ? selectedCategory : '全部文章'}
            </h1>
            <p className="text-gray-600">
              共 {filteredBlogs.length} 篇文章
            </p>
          </div>

          {/* 文章瀑布流列表 */}
          <BlogGrid blogs={filteredBlogs} columns={3} />
        </motion.div>
      </main>
    </div>
  );
};

export default ArticleList;

