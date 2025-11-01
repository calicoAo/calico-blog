/**
 * ArticleContent 组件 - 文章正文内容
 * 
 * 功能：
 * - 显示文章大标题
 * - 显示发布日期和作者
 * - 渲染富文本内容
 * 
 * @author lijingru
 * @created 2025-10-19
 */

import React from 'react';
import { motion } from 'framer-motion';
import ArticleNavigation from './ArticleNavigation';

interface ArticleContentProps {
  /** 文章标题 */
  title: string;
  /** 发布日期 */
  date: string;
  /** 作者 */
  author?: string;
  /** 富文本内容 */
  content: string;
  /** 上一篇文章 */
  previousArticle?: {
    id: number;
    title: string;
  } | null;
  /** 下一篇文章 */
  nextArticle?: {
    id: number;
    title: string;
  } | null;
  /** 导航回调 */
  onNavigate?: (articleId: number) => void;
}

/**
 * 文章正文组件
 */
const ArticleContent: React.FC<ArticleContentProps> = ({
  title,
  date,
  author = "lijingru",
  content,
  previousArticle,
  nextArticle,
  onNavigate
}) => {
  return (
    <article className="max-w-3xl mx-auto px-6 py-8">
      {/* 返回首页按钮 */}
      <motion.a
        href="/"
        className="inline-flex items-center gap-2 text-sm text-gray-600 hover:text-blue-600 mb-6 transition-colors duration-200"
        whileHover={{ x: -4 }}
        transition={{ type: "spring", stiffness: 300 }}
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="h-4 w-4"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M10 19l-7-7m0 0l7-7m-7 7h18"
          />
        </svg>
        返回首页
      </motion.a>

      {/* 文章标题 */}
      <h1 className="text-4xl font-bold text-gray-900 mb-4">{title}</h1>
      
      {/* 文章元信息 */}
      <div className="flex items-center gap-4 text-sm text-gray-600 mb-8 pb-6 border-b border-gray-200">
        <span>📅 {date}</span>
        <span>✍️ {author}</span>
      </div>

      {/* 富文本内容 */}
      <div 
        className="prose prose-lg max-w-none prose-headings:font-bold prose-h1:text-3xl prose-h1:mb-4 prose-h1:mt-8 prose-h2:text-2xl prose-h2:mb-3 prose-h2:mt-6 prose-h3:text-xl prose-h3:mb-2 prose-h3:mt-4 prose-h4:text-lg prose-h4:mb-2 prose-h4:mt-3 prose-p:mb-4 prose-p:text-gray-700 prose-p:leading-relaxed prose-a:text-blue-600 prose-a:no-underline hover:prose-a:underline"
        dangerouslySetInnerHTML={{ __html: content }}
        id="article-content"
      />

      {/* 上一页/下一页导航 */}
      {(previousArticle || nextArticle) && (
        <ArticleNavigation
          previousArticle={previousArticle}
          nextArticle={nextArticle}
          onNavigate={onNavigate || (() => {})}
        />
      )}
    </article>
  );
};

export default ArticleContent;

