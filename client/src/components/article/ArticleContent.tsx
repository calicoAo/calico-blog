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
      {/* 文章标题 */}
      <h1 className="text-4xl font-bold text-gray-900 mb-4">{title}</h1>
      
      {/* 文章元信息 */}
      <div className="flex items-center gap-4 text-sm text-gray-600 mb-8 pb-6 border-b border-gray-200">
        <span>📅 {date}</span>
        <span>✍️ {author}</span>
      </div>

      {/* 富文本内容 */}
      <div 
        className="prose prose-lg max-w-none"
        dangerouslySetInnerHTML={{ __html: content }}
        style={{
          lineHeight: '1.8',
        }}
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

