/**
 * Cookie 管理工具
 * 
 * 功能：
 * - 检查用户 Cookie 同意状态
 * - 根据用户偏好控制 Cookie 使用
 * - 提供 Cookie 操作接口
 */

export interface CookiePreferences {
  necessary: boolean;
  analytics: boolean;
  marketing: boolean;
}

const COOKIE_CONSENT_KEY = 'cookie_consent';

/**
 * 获取用户 Cookie 偏好设置
 */
export function getCookiePreferences(): CookiePreferences | null {
  if (typeof window === 'undefined') return null;
  
  const consent = localStorage.getItem(COOKIE_CONSENT_KEY);
  if (!consent) return null;
  
  try {
    return JSON.parse(consent) as CookiePreferences;
  } catch {
    return null;
  }
}

/**
 * 检查是否允许使用特定类型的 Cookie
 */
export function canUseCookie(type: keyof CookiePreferences): boolean {
  const preferences = getCookiePreferences();
  if (!preferences) return false; // 未同意则不允许
  
  return preferences[type] === true;
}

/**
 * 检查用户是否已做出 Cookie 选择
 */
export function hasCookieConsent(): boolean {
  return getCookiePreferences() !== null;
}

/**
 * 设置 Cookie（根据用户偏好）
 */
export function setCookie(
  name: string,
  value: string,
  type: keyof CookiePreferences = 'necessary',
  days: number = 365
): void {
  if (typeof document === 'undefined') return;
  
  if (!canUseCookie(type)) {
    console.warn(`Cookie "${name}" 被拒绝，用户未同意 ${type} 类型 Cookie`);
    return;
  }

  const expires = new Date();
  expires.setTime(expires.getTime() + days * 24 * 60 * 60 * 1000);
  
  document.cookie = `${name}=${value};expires=${expires.toUTCString()};path=/;SameSite=Lax`;
}

/**
 * 获取 Cookie
 */
export function getCookie(name: string): string | null {
  if (typeof document === 'undefined') return null;
  
  const nameEQ = name + '=';
  const ca = document.cookie.split(';');
  
  for (let i = 0; i < ca.length; i++) {
    let c = ca[i];
    while (c.charAt(0) === ' ') c = c.substring(1, c.length);
    if (c.indexOf(nameEQ) === 0) {
      return c.substring(nameEQ.length, c.length);
    }
  }
  
  return null;
}

/**
 * 删除 Cookie
 */
export function deleteCookie(name: string): void {
  if (typeof document === 'undefined') return;
  document.cookie = `${name}=;expires=Thu, 01 Jan 1970 00:00:00 UTC;path=/;`;
}

