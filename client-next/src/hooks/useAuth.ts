'use client'

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
  const [mounted, setMounted] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  // 检查登录状态
  const checkAuth = () => {
    if (typeof window === 'undefined') return;
    const token = localStorage.getItem('auth_token');
    const refreshToken = localStorage.getItem('refresh_token');
    // 只要有 access token 或 refresh token 就认为已登录
    setIsAuthenticated(!!(token || refreshToken));
    setIsLoading(false);
  };

  useEffect(() => {
    // 使用 setTimeout 异步设置 mounted 状态
    setTimeout(() => {
      setMounted(true);
    }, 0);
    
    // 初始检查
    setTimeout(() => {
      checkAuth();
    }, 0);

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

  const login = (accessToken: string, refreshToken?: string) => {
    if (typeof window === 'undefined') return;
    localStorage.setItem('auth_token', accessToken);
    if (refreshToken) {
      localStorage.setItem('refresh_token', refreshToken);
    }
    setIsAuthenticated(true);
    // 触发自定义事件，通知其他组件
    window.dispatchEvent(new Event('auth-change'));
  };

  const logout = () => {
    if (typeof window === 'undefined') return;
    localStorage.removeItem('auth_token');
    localStorage.removeItem('refresh_token');
    setIsAuthenticated(false);
    // 触发自定义事件，通知其他组件
    window.dispatchEvent(new Event('auth-change'));
  };

  // 在 SSR 阶段返回默认值
  if (!mounted) {
    return {
      isAuthenticated: false,
      isLoading: true,
      login: () => {},
      logout: () => {}
    };
  }

  return {
    isAuthenticated,
    isLoading,
    login,
    logout
  };
};

