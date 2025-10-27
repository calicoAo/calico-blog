/**
 * ArticleNavigation 组件 - 文章导航按钮
 * 
 * 功能：
 * - 显示"上一篇文章"按钮
 * - 显示"下一篇文章"按钮
 * - 支持上一页/下一页之间的平滑过渡
 * 
 * @author lijingru
 * @created 2025-10-19
 */

import React from 'react';
import { motion } from 'framer-motion';

interface ArticleNavigationProps {
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
  onNavigate: (articleId: number) => void;
}

/**
 * 文章导航组件
 */
const ArticleNavigation: React.FC<ArticleNavigationProps> = ({
  previousArticle,
  nextArticle,
  onNavigate
}) => {
  return (
    <div className="mt-12 pt-8 border-t border-gray-200">
      <div className="flex justify-between items-center gap-4">
        {/* 上一篇文章 */}
        {previousArticle ? (
          <motion.button
            onClick={() => onNavigate(previousArticle.id)}
            className="flex-1 p-4 text-left bg-gray-50 hover:bg-gray-100 rounded-lg transition-colors duration-200 border border-gray-200"
            whileHover={{ scale: 1.02, x: -4 }}
            whileTap={{ scale: 0.98 }}
          >
            <div className="text-xs text-gray-500 mb-1">← 上一篇文章</div>
            <div className="font-medium text-gray-800">{previousArticle.title}</div>
          </motion.button>
        ) : (
          <div className="flex-1" />
        )}

        {/* 下一篇文章 */}
        {nextArticle ? (
          <motion.button
            onClick={() => onNavigate(nextArticle.id)}
            className="flex-1 p-4 text-right bg-gray-50 hover:bg-gray-100 rounded-lg transition-colors duration-200 border border-gray-200"
            whileHover={{ scale: 1.02, x: 4 }}
            whileTap={{ scale: 0.98 }}
          >
            <div className="text-xs text-gray-500 mb-1">下一篇文章 →</div>
            <div className="font-medium text-gray-800">{nextArticle.title}</div>
          </motion.button>
        ) : (
          <div className="flex-1" />
        )}
      </div>
    </div>
  );
};

export default ArticleNavigation;

