'use client'

/**
 * BackToHome 组件 - 返回首页按钮
 * 
 * 功能：
 * - 提供统一的返回首页按钮样式和交互
 * - 支持自定义链接地址
 * - 使用 Framer Motion 提供流畅的动画效果
 * 
 * @author lijingru
 * @created 2025-11-12
 */

import React from 'react';
import { motion } from 'framer-motion';
import Link from 'next/link';

interface BackToHomeProps {
  /** 返回的链接地址，默认为 "/" */
  to?: string;
  /** 自定义类名 */
  className?: string;
  /** 按钮文本，默认为 "返回首页" */
  text?: string;
}

/**
 * 返回首页按钮组件
 */
const BackToHome: React.FC<BackToHomeProps> = ({
  to = "/",
  className = "",
  text = "返回首页"
}) => {
  return (
    <motion.div
      className={className}
      whileHover={{ x: -4 }}
      transition={{ type: "spring", stiffness: 300 }}
    >
      <Link
        href={to}
        className="inline-flex items-center gap-2 text-sm text-gray-600 hover:text-primary transition-colors duration-200"
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
        {text}
      </Link>
    </motion.div>
  );
};

export default BackToHome;

