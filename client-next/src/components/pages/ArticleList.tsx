'use client'
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

import React, { useEffect, useMemo, useState } from 'react';
import { useSearchParams, useParams, useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import BlogGrid from '@/components/blog/BlogGrid';
import CategorySidebarList from '@/components/article/CategorySidebarList';
import type { CategoryData } from '@/components/article/CategorySidebarList';
import BackToHome from '@/components/ui/BackToHome';
import AdminToolbar from '@/components/admin/AdminToolbar';
import { getBlogList } from '@/api/blog';
import type { BlogData } from '@/components/blog/BlogGrid';

interface ArticleListProps {
  categoryName?: string;
  initialCategory?: string;
}

/**
 * 文章列表页面
 */
const ArticleList: React.FC<ArticleListProps> = ({ categoryName, initialCategory }) => {
  const searchParams = useSearchParams();
  const params = useParams();
  const router = useRouter();
  const [blogs, setBlogs] = useState<BlogData[]>([]);
  const [categories, setCategories] = useState<CategoryData[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  
  // 优先使用 props 中的 categoryName，其次使用 URL 参数，最后使用查询参数
  const urlCategoryName = (params?.categoryName as string | undefined) || categoryName;
  const queryCategory = searchParams?.get('category') || '';
  const selectedCategory = urlCategoryName
    ? decodeURIComponent(urlCategoryName)
    : (initialCategory || queryCategory || '');
  
  // 如果从路由参数进入，同步到查询参数
  useEffect(() => {
    if (urlCategoryName && !queryCategory) {
      const newParams = new URLSearchParams(searchParams?.toString() || '');
      newParams.set('category', decodeURIComponent(urlCategoryName));
      router.push(`/articles?${newParams.toString()}`);
    }
  }, [urlCategoryName, queryCategory, searchParams, router]);

  // 获取博客列表
  useEffect(() => {
    const fetchBlogs = async () => {
      try {
        setIsLoading(true);
        const params: any = {
          page: 1,
          limit: 100,
          status: 'published'
        };
        
        if (selectedCategory) {
          params.category = selectedCategory;
        }

        const response = await getBlogList(params);
        
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

        // 计算分类数据
        const categoryMap = new Map<string, number>();
        formattedBlogs.forEach(blog => {
          const count = categoryMap.get(blog.category) || 0;
          categoryMap.set(blog.category, count + 1);
        });

        const categoryList: CategoryData[] = Array.from(categoryMap.entries())
          .map(([name, count]) => ({ name, count }))
          .sort((a, b) => b.count - a.count);

        setCategories(categoryList);
      } catch (error) {
        console.error('获取博客列表失败:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchBlogs();
  }, [selectedCategory]);

  // 处理分类点击
  const handleCategoryClick = (category: string) => {
    const params = new URLSearchParams(searchParams?.toString() || '');
    if (category) {
      params.set('category', category);
    } else {
      params.delete('category');
    }
    router.push(`/articles?${params.toString()}`);
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
              共 {blogs.length} 篇文章
            </p>
          </div>

          {/* 文章瀑布流列表 */}
          {isLoading ? (
            <div className="text-center py-12 text-gray-500">加载中...</div>
          ) : (
            <BlogGrid blogs={blogs} columns={3} />
          )}
        </motion.div>
      </main>

      {/* 管理工具栏 */}
      <AdminToolbar />
    </div>
  );
};

export default ArticleList;

