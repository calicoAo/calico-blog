'use client'

/**
 * AnalyticsProvider 组件
 * 
 * 功能：
 * - 监听 Cookie 同意状态变化
 * - 初始化访问分析
 * - 跟踪页面访问
 * 
 * @author lijingru
 * @created 2025-11-13
 */

import { useEffect } from 'react';
import { usePathname } from 'next/navigation';
import { canUseCookie } from '@/lib/cookies';
import { initAnalytics, trackPageView } from '@/lib/analytics';

export default function AnalyticsProvider() {
  const pathname = usePathname();

  useEffect(() => {
    // 检查是否允许分析 Cookie
    if (canUseCookie('analytics')) {
      // 初始化分析
      initAnalytics();
    }
  }, []);

  useEffect(() => {
    // 路由变化时记录页面访问
    if (canUseCookie('analytics') && pathname) {
      // 延迟一下，确保页面已加载
      const timer = setTimeout(() => {
        trackPageView(pathname);
      }, 100);
      return () => clearTimeout(timer);
    }
  }, [pathname]);

  useEffect(() => {
    // 监听 Cookie 同意状态变化
    const handleConsentUpdate = (event: CustomEvent) => {
      if (event.detail?.analytics) {
        // 用户同意分析 Cookie，初始化分析
        initAnalytics();
        trackPageView(window.location.pathname);
      }
    };

    window.addEventListener('cookie-consent-updated', handleConsentUpdate as EventListener);

    return () => {
      window.removeEventListener('cookie-consent-updated', handleConsentUpdate as EventListener);
    };
  }, []);

  return null; // 这是一个无 UI 组件
}

