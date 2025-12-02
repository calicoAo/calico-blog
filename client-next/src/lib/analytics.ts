/**
 * 访问分析工具
 * 
 * 功能：
 * - 基于 Cookie 跟踪访客
 * - 记录页面访问
 * - 分析用户行为
 * - 发送访问数据到后端
 * 
 * @author lijingru
 * @created 2025-11-13
 */

import { getCookie, setCookie, canUseCookie } from './cookies';
import axiosInstance from './axios';

const VISITOR_ID_COOKIE = 'visitor_id';
const SESSION_ID_COOKIE = 'session_id';
const VISITOR_ID_LENGTH = 32;

/**
 * 生成唯一访客 ID
 */
function generateVisitorId(): string {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  let result = '';
  for (let i = 0; i < VISITOR_ID_LENGTH; i++) {
    result += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return result;
}

/**
 * 生成会话 ID
 */
function generateSessionId(): string {
  return Date.now().toString(36) + Math.random().toString(36).substr(2);
}

/**
 * 获取或创建访客 ID
 */
export function getVisitorId(): string | null {
  if (!canUseCookie('analytics')) {
    return null;
  }

  let visitorId = getCookie(VISITOR_ID_COOKIE);
  
  if (!visitorId) {
    visitorId = generateVisitorId();
    setCookie(VISITOR_ID_COOKIE, visitorId, 'analytics', 365); // 保存 1 年
  }
  
  return visitorId;
}

/**
 * 获取或创建会话 ID
 */
export function getSessionId(): string | null {
  if (!canUseCookie('analytics')) {
    return null;
  }

  let sessionId = getCookie(SESSION_ID_COOKIE);
  
  if (!sessionId) {
    sessionId = generateSessionId();
    setCookie(SESSION_ID_COOKIE, sessionId, 'analytics', 0.5); // 保存 12 小时
  }
  
  return sessionId;
}

/**
 * 访问数据接口
 */
export interface VisitData {
  visitorId: string;
  sessionId: string;
  path: string;
  referer?: string;
  userAgent: string;
  screenWidth?: number;
  screenHeight?: number;
  language: string;
  timestamp: number;
}

/**
 * 记录页面访问
 */
export async function trackPageView(path: string, referer?: string): Promise<void> {
  // 检查是否允许分析 Cookie
  if (!canUseCookie('analytics')) {
    return;
  }

  const visitorId = getVisitorId();
  const sessionId = getSessionId();

  if (!visitorId || !sessionId) {
    return;
  }

  const visitData: VisitData = {
    visitorId,
    sessionId,
    path,
    referer: referer || document.referrer || undefined,
    userAgent: navigator.userAgent,
    screenWidth: window.screen?.width,
    screenHeight: window.screen?.height,
    language: navigator.language,
    timestamp: Date.now(),
  };

  try {
    // 发送到后端 API
    await axiosInstance.post('/analytics/visit', visitData);
  } catch (error) {
    // 静默失败，不影响用户体验
    console.error('Failed to track page view:', error);
  }
}

/**
 * 记录事件
 */
export interface EventData {
  event: string;
  category?: string;
  label?: string;
  value?: number;
}

export async function trackEvent(eventData: EventData): Promise<void> {
  if (!canUseCookie('analytics')) {
    return;
  }

  const visitorId = getVisitorId();
  const sessionId = getSessionId();

  if (!visitorId || !sessionId) {
    return;
  }

  try {
    await axiosInstance.post('/analytics/event', {
      visitorId,
      sessionId,
      ...eventData,
      timestamp: Date.now(),
    });
  } catch (error) {
    console.error('Failed to track event:', error);
  }
}

/**
 * 初始化访问分析
 */
export function initAnalytics(): void {
  if (typeof window === 'undefined') return;
  
  // 检查是否允许分析
  if (!canUseCookie('analytics')) {
    return;
  }

  // 记录初始页面访问
  trackPageView(window.location.pathname);
}

