'use client'
/**
 * ArticleDetail 页面 - 文章详情页
 * 
 * 功能：
 * - 显示文章完整内容
 * - 合集菜单栏（左侧）
 * - 文章目录（右侧）
 * - 上一页/下一页导航
 * - 与主页风格一致的布局
 * 
 * @author lijingru
 * @created 2025-10-19
 */

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import CategorySidebar from '@/components/article/CategorySidebar';
import ArticleContent from '@/components/article/ArticleContent';
import ArticleTOC from '@/components/article/ArticleTOC';
import { getBlogDetail, getBlogList } from '@/api/blog';

/**
 * 文章数据类型
 */
interface Article {
  id: string;
  title: string;
  date: string;
  author: string;
  content: string;
  category: string;
}

interface ArticleDetailProps {
  id: string;
}

const ArticleDetail: React.FC<ArticleDetailProps> = ({ id }) => {
  const router = useRouter();
  const [currentArticle, setCurrentArticle] = useState<Article | null>(null);
  const [categoryArticles, setCategoryArticles] = useState<Article[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [previousArticle, setPreviousArticle] = useState<Article | null>(null);
  const [nextArticle, setNextArticle] = useState<Article | null>(null);

  useEffect(() => {
    const fetchArticle = async () => {
      try {
        setIsLoading(true);
        const blog = await getBlogDetail(id);
        
        const article: Article = {
          id: blog._id,
          title: blog.title,
          date: blog.publishedAt ? new Date(blog.publishedAt).toISOString().split('T')[0].replace(/-/g, '/') : new Date(blog.createdAt).toISOString().split('T')[0].replace(/-/g, '/'),
          author: blog.author?.username || 'lijingru',
          content: blog.content || '',
          category: blog.category
        };

        setCurrentArticle(article);

        // 获取同分类的文章
        const categoryResponse = await getBlogList({
          page: 1,
          limit: 100,
          status: 'published',
          category: blog.category
        });

        const formattedArticles: Article[] = categoryResponse.data.map((b: { _id: string; title: string; publishedAt?: string; createdAt: string; author?: { username?: string }; content?: string; category: string }) => ({
          id: b._id,
          title: b.title,
          date: b.publishedAt ? new Date(b.publishedAt).toISOString().split('T')[0].replace(/-/g, '/') : new Date(b.createdAt).toISOString().split('T')[0].replace(/-/g, '/'),
          author: b.author?.username || 'lijingru',
          content: b.content || '',
          category: b.category
        }));

        setCategoryArticles(formattedArticles);

        // 找到当前文章在列表中的位置
        const currentIndex = formattedArticles.findIndex(a => a.id === id);
        setPreviousArticle(currentIndex > 0 ? formattedArticles[currentIndex - 1] : null);
        setNextArticle(currentIndex < formattedArticles.length - 1 ? formattedArticles[currentIndex + 1] : null);
      } catch (error) {
        console.error('获取文章详情失败:', error);
      } finally {
        setIsLoading(false);
      }
    };

    if (id) {
      fetchArticle();
    }
  }, [id]);

  const handleArticleClick = (articleId: string) => {
    router.push(`/article/${articleId}`);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center text-gray-500">加载中...</div>
      </div>
    );
  }

  if (!currentArticle) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">文章未找到</h1>
          <button
            onClick={() => router.push('/articles')}
            className="text-primary hover:underline"
          >
            返回文章列表
          </button>
        </div>
      </div>
    );
  }

    return (
    <div className="flex min-h-screen bg-linear-to-tr from-sky-100 via-amber-50 to-slate-100">
      {/* 左侧合集菜单栏 */}
      <CategorySidebar
        categoryName={currentArticle.category}
        articles={categoryArticles.map(a => ({
          id: a.id,
          title: a.title,
          date: a.date
        }))}
        currentArticleId={currentArticle.id}
        onArticleClick={handleArticleClick}
      />

      {/* 中间文章内容区 */}
      <main className="flex-1 flex">
        <ArticleContent
          title={currentArticle.title}
          date={currentArticle.date}
          author={currentArticle.author}
          content={currentArticle.content}
          previousArticle={previousArticle ? {
            id: previousArticle.id,
            title: previousArticle.title
          } : null}
          nextArticle={nextArticle ? {
            id: nextArticle.id,
            title: nextArticle.title
          } : null}
          onNavigate={handleArticleClick}
        />

        {/* 右侧文章目录 */}
        <ArticleTOC content={currentArticle.content} />
      </main>
      </div>
    );
};

export default ArticleDetail;
  