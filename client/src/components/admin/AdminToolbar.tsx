/**
 * AdminToolbar 组件 - 管理工具栏
 * 
 * 功能：
 * - 文章发布管理按钮
 * - 登出按钮
 * - 查看访问记录按钮
 * - 仅在登录后显示
 * - 隐藏/显示切换
 * 
 * @author lijingru
 * @created 2025-10-19
 */

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '@/hooks/useAuth';

/**
 * 管理工具栏组件
 */
const AdminToolbar: React.FC = () => {
  const { isAuthenticated, logout } = useAuth();
  const [isExpanded, setIsExpanded] = useState(false);

  // 监听登录状态变化
  useEffect(() => {
    const handleAuthChange = () => {
      // 当登录状态变化时，如果已登出则收起菜单
      if (!isAuthenticated) {
        setIsExpanded(false);
      }
    };

    window.addEventListener('auth-change', handleAuthChange);
    return () => window.removeEventListener('auth-change', handleAuthChange);
  }, [isAuthenticated]);

  // 如果未登录，不显示
  if (!isAuthenticated) {
    return null;
  }

  const handleLogout = () => {
    if (window.confirm('确定要登出吗？')) {
      logout();
      window.location.href = '/';
    }
  };

  const handlePublish = () => {
    window.location.href = '/publish';
  };

  const handleViewLogs = () => {
    // 跳转到访问记录页面
    window.location.href = '/admin/logs';
  };

  return (
    <div className="fixed bottom-6 right-6 z-50">
      <AnimatePresence>
        {isExpanded && (
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.9 }}
            className="mb-4 bg-white rounded-xl shadow-lg border border-gray-200 overflow-hidden"
          >
            {/* 文章发布管理 */}
            <button
              onClick={handlePublish}
              className="w-full px-6 py-3 text-left text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors duration-200 flex items-center gap-3 border-b border-gray-100"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-5 w-5 text-primary"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
                />
              </svg>
              文章发布管理
            </button>

            {/* 查看访问记录 */}
            <button
              onClick={handleViewLogs}
              className="w-full px-6 py-3 text-left text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors duration-200 flex items-center gap-3 border-b border-gray-100"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-5 w-5 text-green-600"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"
                />
              </svg>
              查看访问记录
            </button>

            {/* 登出 */}
            <button
              onClick={handleLogout}
              className="w-full px-6 py-3 text-left text-sm font-medium text-red-600 hover:bg-red-50 transition-colors duration-200 flex items-center gap-3"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-5 w-5"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"
                />
              </svg>
              登出
            </button>
          </motion.div>
        )}
      </AnimatePresence>

      {/* 切换按钮 */}
      <motion.button
        onClick={() => setIsExpanded(!isExpanded)}
        className="w-14 h-14 bg-primary text-primary-foreground rounded-full shadow-lg hover:bg-primary/90 transition-colors duration-200 flex items-center justify-center"
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.95 }}
        aria-label="管理菜单"
      >
        <motion.svg
          xmlns="http://www.w3.org/2000/svg"
          className="h-6 w-6"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          animate={{ rotate: isExpanded ? 45 : 0 }}
          transition={{ duration: 0.2 }}
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M12 4v16m8-8H4"
          />
        </motion.svg>
      </motion.button>
    </div>
  );
};

export default AdminToolbar;

