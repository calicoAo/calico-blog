'use client'

/**
 * CategorySidebarList 组件 - 分类侧边栏列表
 * 
 * 功能：
 * - 显示所有分类
 * - 显示每个分类下的文章数量
 * - 支持点击分类进行筛选
 * - 高亮当前选中的分类
 * 
 * @author lijingru
 * @created 2025-11-12
 */

import React from 'react';
import { motion } from 'framer-motion';
import Link from 'next/link';

/**
 * 分类数据类型
 */
export interface CategoryData {
  /** 分类名称 */
  name: string;
  /** 该分类下的文章数量 */
  count: number;
}

interface CategorySidebarListProps {
  /** 分类数据数组 */
  categories: CategoryData[];
  /** 当前选中的分类 */
  selectedCategory?: string;
  /** 分类点击回调 */
  onCategoryClick?: (category: string) => void;
}

/**
 * 分类侧边栏列表组件
 */
const CategorySidebarList: React.FC<CategorySidebarListProps> = ({
  categories,
  selectedCategory,
  onCategoryClick
}) => {
  const handleCategoryClick = (category: string, e: React.MouseEvent) => {
    e.preventDefault();
    if (onCategoryClick) {
      onCategoryClick(category);
    }
  };

  return (
    <aside className="w-64 bg-linear-to-b from-sky-50 to-primary/5 p-6 border-r border-gray-200 h-full overflow-y-auto flex-shrink-0">
      <div>
        <h2 className="text-xl font-bold text-gray-800 mb-4">分类</h2>
        
        {/* 全部文章 */}
        <Link
          href="/articles"
          onClick={(e) => handleCategoryClick('', e)}
          className={`block px-4 py-2 rounded-lg mb-2 transition-colors duration-200 ${
            !selectedCategory
              ? 'bg-primary/20 text-primary font-semibold'
              : 'text-gray-700 hover:bg-gray-100'
          }`}
        >
          <div className="flex justify-between items-center">
            <span>全部文章</span>
            <span className="text-sm text-gray-500">
              {categories.reduce((sum, cat) => sum + cat.count, 0)}
            </span>
          </div>
        </Link>

        {/* 分类列表 */}
        <div className="space-y-1">
          {categories.map((category) => (
            <motion.div
              key={category.name}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.3 }}
            >
              <Link
                href={`/articles?category=${encodeURIComponent(category.name)}`}
                onClick={(e) => handleCategoryClick(category.name, e)}
                className={`block px-4 py-2 rounded-lg transition-colors duration-200 ${
                  selectedCategory === category.name
                    ? 'bg-primary/20 text-primary font-semibold'
                    : 'text-gray-700 hover:bg-gray-100'
                }`}
              >
                <div className="flex justify-between items-center">
                  <span className="truncate">{category.name}</span>
                  <span className="text-sm text-gray-500 ml-2 flex-shrink-0">
                    {category.count}
                  </span>
                </div>
              </Link>
            </motion.div>
          ))}
        </div>
      </div>
    </aside>
  );
};

export default CategorySidebarList;

