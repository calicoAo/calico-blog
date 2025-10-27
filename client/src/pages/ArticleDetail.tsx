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

import React, { useState } from 'react';
import CategorySidebar from '@/components/article/CategorySidebar';
import ArticleContent from '@/components/article/ArticleContent';
import ArticleTOC from '@/components/article/ArticleTOC';

/**
 * 文章数据类型
 */
interface Article {
  id: number;
  title: string;
  date: string;
  author: string;
  content: string;
  category: string;
}

/**
 * 模拟文章数据
 */
const mockArticles: Article[] = [
  {
    id: 1,
    title: "Vite and Webpack: Concepts and Configuration",
    date: "2025/10/08",
    author: "lijingru",
    category: "Frontend engineering practices",
    content: `
      <h1>Introduction</h1>
      <p>Vite is designed around native ES modules, on-demand compilation, dependency pre-bundling, and fast hot module replacement (HMR). Unlike traditional bundlers like Webpack, Vite skips the upfront bundling step during development.</p>
      
      <h2>Key Concepts</h2>
      <p>Let's dive into the key differences between Vite and Webpack.</p>
      
      <h3>Development Server</h3>
      <p>Vite uses esbuild for pre-bundling dependencies, which is 10-100x faster than JavaScript-based bundlers.</p>
      
      <h2>Configuration</h2>
      <p>Vite configuration is simpler and more intuitive than Webpack.</p>
      
      <h3>Build Process</h3>
      <p>The production build uses Rollup for optimal performance.</p>
    `
  },
  {
    id: 2,
    title: "Improving Web Performance with Caching",
    date: "2025/10/10",
    author: "lijingru",
    category: "Performance Optimization",
    content: `
      <h1>Web Performance Optimization</h1>
      <p>Explore modern caching strategies like HTTP caching, Service Workers, and IndexedDB for faster and more resilient web applications.</p>
      
      <h2>HTTP Caching</h2>
      <p>Understanding cache headers and strategies.</p>
      
      <h3>Service Workers</h3>
      <p>Leveraging Service Workers for offline-first applications.</p>
      
      <h2>IndexedDB</h2>
      <p>Using IndexedDB for large data storage in browsers.</p>
    `
  },
  {
    id: 3,
    title: "Understanding React Server Components",
    date: "2025/10/15",
    author: "lijingru",
    category: "React Deep Dive",
    content: `
      <h1>React Server Components</h1>
      <p>React Server Components (RSC) enable faster page loads and smaller client bundles. Let's see how they work and how to use them effectively.</p>
      
      <h2>What are RSC?</h2>
      <p>React Server Components allow you to render components on the server.</p>
      
      <h3>Benefits</h3>
      <p>Smaller bundle sizes and better performance.</p>
      
      <h2>Implementation</h2>
      <p>How to implement RSC in your application.</p>
      
      <h3>Best Practices</h3>
      <p>Guidelines for using RSC effectively.</p>
    `
  }
];

const ArticleDetail: React.FC = () => {
  const [currentArticleId, setCurrentArticleId] = useState(1);
  
  const currentArticle = mockArticles.find(a => a.id === currentArticleId) || mockArticles[0];
  const categoryArticles = mockArticles.filter(a => a.category === currentArticle.category);
  
  const currentIndex = mockArticles.findIndex(a => a.id === currentArticleId);
  const previousArticle = currentIndex > 0 ? mockArticles[currentIndex - 1] : null;
  const nextArticle = currentIndex < mockArticles.length - 1 ? mockArticles[currentIndex + 1] : null;

  const handleArticleClick = (articleId: number) => {
    setCurrentArticleId(articleId);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

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
        currentArticleId={currentArticleId}
        onArticleClick={handleArticleClick}
      />

      {/* 中间文章内容区 */}
      <main className="flex-1 flex">
        <ArticleContent
          title={currentArticle.title}
          date={currentArticle.date}
          author={currentArticle.author}
          content={currentArticle.content}
          previousArticle={previousArticle}
          nextArticle={nextArticle}
          onNavigate={handleArticleClick}
        />

        {/* 右侧文章目录 */}
        <ArticleTOC content={currentArticle.content} />
      </main>
    </div>
  );
};

export default ArticleDetail;
