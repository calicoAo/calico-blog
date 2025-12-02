'use client'

/**
 * CookieConsent 组件 - Cookie 同意横幅
 * 
 * 功能：
 * - 显示 Cookie 使用说明
 * - 允许用户接受或拒绝 Cookie
 * - 保存用户选择到 localStorage
 * - 符合 GDPR 等隐私法规要求
 * 
 * @author lijingru
 * @created 2025-11-13
 */

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Link from 'next/link';

const COOKIE_CONSENT_KEY = 'cookie_consent';

interface CookiePreferences {
  necessary: boolean;      // 必要 Cookie（始终启用）
  analytics: boolean;      // 分析 Cookie（可选）
  marketing: boolean;      // 营销 Cookie（可选）
}

export default function CookieConsent() {
  const [showBanner, setShowBanner] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  const [preferences, setPreferences] = useState<CookiePreferences>({
    necessary: true,  // 必要 Cookie 始终为 true
    analytics: false,
    marketing: false,
  });

  useEffect(() => {
    // 检查用户是否已经做出选择
    const consent = localStorage.getItem(COOKIE_CONSENT_KEY);
    if (!consent) {
      // 延迟显示，避免影响页面加载
      setTimeout(() => {
        setShowBanner(true);
      }, 1000);
    } else {
      // 加载已保存的偏好设置
      try {
        const saved = JSON.parse(consent);
        setPreferences(saved);
      } catch (e) {
        console.error('Failed to parse cookie consent:', e);
      }
    }
  }, []);

  const handleAcceptAll = () => {
    const allAccepted: CookiePreferences = {
      necessary: true,
      analytics: true,
      marketing: true,
    };
    savePreferences(allAccepted);
  };

  const handleRejectAll = () => {
    const onlyNecessary: CookiePreferences = {
      necessary: true,
      analytics: false,
      marketing: false,
    };
    savePreferences(onlyNecessary);
  };

  const handleSavePreferences = () => {
    savePreferences(preferences);
    setShowSettings(false);
  };

  const savePreferences = (prefs: CookiePreferences) => {
    localStorage.setItem(COOKIE_CONSENT_KEY, JSON.stringify(prefs));
    setShowBanner(false);
    
    // 触发自定义事件，通知其他组件
    window.dispatchEvent(new CustomEvent('cookie-consent-updated', { 
      detail: prefs 
    }));

    // 根据用户选择初始化或清理 Cookie
    if (prefs.analytics) {
      // 初始化访问分析
      if (typeof window !== 'undefined') {
        import('@/lib/analytics').then(({ initAnalytics }) => {
          initAnalytics();
        });
      }
    }
  };

  const handleTogglePreference = (key: keyof CookiePreferences) => {
    if (key === 'necessary') return; // 必要 Cookie 不能关闭
    setPreferences(prev => ({
      ...prev,
      [key]: !prev[key]
    }));
  };

  if (!showBanner) return null;

  return (
    <AnimatePresence>
      {showBanner && (
        <motion.div
          initial={{ y: 100, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: 100, opacity: 0 }}
          transition={{ duration: 0.3 }}
          className="fixed bottom-0 left-0 right-0 z-50 bg-white border-t border-gray-200 shadow-2xl"
        >
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
            {!showSettings ? (
              // 简单横幅视图
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                <div className="flex-1">
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">
                    🍪 Cookie 使用说明
                  </h3>
                  <p className="text-sm text-gray-600">
                    我们使用 Cookie 来改善您的浏览体验、分析网站流量并个性化内容。
                    点击"接受全部"即表示您同意我们使用所有 Cookie。
                    <Link 
                      href="/privacy" 
                      className="text-primary hover:underline ml-1"
                    >
                      了解更多
                    </Link>
                  </p>
                </div>
                <div className="flex flex-wrap gap-3">
                  <button
                    onClick={() => setShowSettings(true)}
                    className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
                  >
                    自定义设置
                  </button>
                  <button
                    onClick={handleRejectAll}
                    className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
                  >
                    拒绝全部
                  </button>
                  <button
                    onClick={handleAcceptAll}
                    className="px-4 py-2 text-sm font-medium text-white bg-primary rounded-lg hover:bg-primary/90 transition-colors"
                  >
                    接受全部
                  </button>
                </div>
              </div>
            ) : (
              // 详细设置视图
              <div className="space-y-4">
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">
                    Cookie 偏好设置
                  </h3>
                  <p className="text-sm text-gray-600 mb-4">
                    选择您希望允许的 Cookie 类型。必要 Cookie 是网站正常运行所必需的，无法关闭。
                  </p>
                </div>

                <div className="space-y-3">
                  {/* 必要 Cookie */}
                  <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                    <div className="flex-1">
                      <h4 className="font-medium text-gray-900">必要 Cookie</h4>
                      <p className="text-sm text-gray-600">
                        这些 Cookie 是网站正常运行所必需的，包括身份验证和安全性。
                      </p>
                    </div>
                    <div className="ml-4">
                      <span className="px-3 py-1 text-xs font-medium text-gray-600 bg-gray-200 rounded-full">
                        始终启用
                      </span>
                    </div>
                  </div>

                  {/* 分析 Cookie */}
                  <div className="flex items-center justify-between p-3 bg-white border border-gray-200 rounded-lg">
                    <div className="flex-1">
                      <h4 className="font-medium text-gray-900">分析 Cookie</h4>
                      <p className="text-sm text-gray-600">
                        帮助我们了解访问者如何与网站互动，以改善用户体验。
                      </p>
                    </div>
                    <button
                      onClick={() => handleTogglePreference('analytics')}
                      className={`ml-4 relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                        preferences.analytics ? 'bg-primary' : 'bg-gray-300'
                      }`}
                    >
                      <span
                        className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                          preferences.analytics ? 'translate-x-6' : 'translate-x-1'
                        }`}
                      />
                    </button>
                  </div>

                  {/* 营销 Cookie */}
                  <div className="flex items-center justify-between p-3 bg-white border border-gray-200 rounded-lg">
                    <div className="flex-1">
                      <h4 className="font-medium text-gray-900">营销 Cookie</h4>
                      <p className="text-sm text-gray-600">
                        用于跟踪访问者并提供个性化广告和内容。
                      </p>
                    </div>
                    <button
                      onClick={() => handleTogglePreference('marketing')}
                      className={`ml-4 relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                        preferences.marketing ? 'bg-primary' : 'bg-gray-300'
                      }`}
                    >
                      <span
                        className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                          preferences.marketing ? 'translate-x-6' : 'translate-x-1'
                        }`}
                      />
                    </button>
                  </div>
                </div>

                <div className="flex justify-end gap-3 pt-2">
                  <button
                    onClick={() => setShowSettings(false)}
                    className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
                  >
                    取消
                  </button>
                  <button
                    onClick={handleSavePreferences}
                    className="px-4 py-2 text-sm font-medium text-white bg-primary rounded-lg hover:bg-primary/90 transition-colors"
                  >
                    保存设置
                  </button>
                </div>
              </div>
            )}
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

