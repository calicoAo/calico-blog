/**
 * CategorySidebar 组件 - 合集菜单栏
 * 
 * 功能：
 * - 显示当前合集内的所有文章列表
 * - 支持点击跳转到文章详情
 * - 高亮当前文章
 * - 与主页风格一致的设计
 * 
 * @author lijingru
 * @created 2025-10-19
 */

import React from 'react';
import { motion } from 'framer-motion';

/**
 * 文章数据类型
 */
interface Article {
  id: number;
  title: string;
  date: string;
  author?: string;
}

interface CategorySidebarProps {
  /** 合集名称 */
  categoryName: string;
  /** 文章列表 */
  articles: Article[];
  /** 当前文章ID */
  currentArticleId: number;
  /** 点击回调 */
  onArticleClick: (articleId: number) => void;
}

/**
 * 合集菜单栏组件
 */
const CategorySidebar: React.FC<CategorySidebarProps> = ({
  categoryName,
  articles,
  currentArticleId,
  onArticleClick
}) => {
  return (
    <aside className="w-64 bg-linear-to-b from-sky-50 to-primary/5 p-6 border-r border-gray-200">
      {/* 合集标题 */}
      <div className="mb-6">
        <h2 className="text-xl font-bold text-gray-800 mb-2">{categoryName}</h2>
        <p className="text-sm text-gray-500">共 {articles.length} 篇文章</p>
      </div>

      {/* 文章列表 */}
      <nav className="space-y-2">
        {articles.map((article, index) => (
          <motion.a
            key={article.id}
            href={`#article-${article.id}`}
            onClick={(e) => {
              e.preventDefault();
              onArticleClick(article.id);
            }}
            className={`block p-3 rounded-lg transition-all duration-200 ${
              article.id === currentArticleId
                ? 'bg-primary/20 text-primary font-semibold shadow-sm'
                : 'text-gray-700 hover:bg-gray-100'
            }`}
            whileHover={{ x: 4 }}
            transition={{ type: "spring", stiffness: 300 }}
          >
            <div className="text-sm font-medium truncate">{article.title}</div>
            <div className="text-xs text-gray-500 mt-1">{article.date}</div>
          </motion.a>
        ))}
      </nav>
    </aside>
  );
};

export default CategorySidebar;

