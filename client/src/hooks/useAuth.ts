/**
 * useAuth Hook - 登录状态管理
 * 
 * 功能：
 * - 检查用户登录状态
 * - 获取登录token
 * - 登出功能
 * - 监听登录状态变化
 * 
 * @author lijingru
 * @created 2025-10-19
 */

import { useState, useEffect } from 'react';

/**
 * 检查用户是否已登录
 */
export const useAuth = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  // 检查登录状态
  const checkAuth = () => {
    const token = localStorage.getItem('auth_token');
    setIsAuthenticated(!!token);
  };

  useEffect(() => {
    // 初始检查
    checkAuth();

    // 监听 storage 事件（跨标签页同步）
    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === 'auth_token') {
        checkAuth();
      }
    };

    window.addEventListener('storage', handleStorageChange);

    // 定期检查（处理同标签页内的变化）
    const interval = setInterval(checkAuth, 1000);

    return () => {
      window.removeEventListener('storage', handleStorageChange);
      clearInterval(interval);
    };
  }, []);

  const login = (token: string) => {
    localStorage.setItem('auth_token', token);
    setIsAuthenticated(true);
    // 触发自定义事件，通知其他组件
    window.dispatchEvent(new Event('auth-change'));
  };

  const logout = () => {
    localStorage.removeItem('auth_token');
    setIsAuthenticated(false);
    // 触发自定义事件，通知其他组件
    window.dispatchEvent(new Event('auth-change'));
  };

  return {
    isAuthenticated,
    login,
    logout
  };
};

