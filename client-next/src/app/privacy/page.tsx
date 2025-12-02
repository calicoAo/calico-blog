'use client'

/**
 * 隐私政策页面
 * 
 * 功能：
 * - 说明 Cookie 使用政策
 * - 隐私保护说明
 * 
 * @author lijingru
 * @created 2025-11-13
 */

import { motion } from 'framer-motion';
import BackToHome from '@/components/ui/BackToHome';

export default function PrivacyPage() {
  return (
    <div className="min-h-screen bg-linear-to-tr from-sky-100 via-amber-50 to-slate-100 p-8">
      <div className="max-w-4xl mx-auto">
        <div className="mb-6">
          <BackToHome />
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white rounded-xl shadow-lg p-8 space-y-6"
        >
          <h1 className="text-3xl font-bold text-gray-900 mb-2">隐私政策</h1>
          <p className="text-gray-600">最后更新：2025年11月13日</p>

          <section className="space-y-4">
            <h2 className="text-2xl font-semibold text-gray-900">Cookie 使用说明</h2>
            <p className="text-gray-700 leading-relaxed">
              我们使用 Cookie 来改善您的浏览体验、分析网站流量并个性化内容。
              以下是我们使用的 Cookie 类型：
            </p>

            <div className="space-y-4">
              <div className="p-4 bg-gray-50 rounded-lg">
                <h3 className="text-lg font-semibold text-gray-900 mb-2">1. 必要 Cookie</h3>
                <p className="text-gray-700">
                  这些 Cookie 是网站正常运行所必需的，包括身份验证、安全性和基本功能。
                  这些 Cookie 无法关闭，因为它们对网站的基本功能至关重要。
                </p>
              </div>

              <div className="p-4 bg-gray-50 rounded-lg">
                <h3 className="text-lg font-semibold text-gray-900 mb-2">2. 分析 Cookie</h3>
                <p className="text-gray-700">
                  这些 Cookie 帮助我们了解访问者如何与网站互动，包括访问的页面、停留时间等信息。
                  这些信息用于改善网站的用户体验和性能。您可以随时选择关闭这些 Cookie。
                </p>
                <p className="text-sm text-gray-600 mt-2">
                  我们使用这些数据来：
                </p>
                <ul className="list-disc list-inside text-sm text-gray-600 ml-4 mt-1">
                  <li>分析网站流量和用户行为</li>
                  <li>识别最受欢迎的页面和内容</li>
                  <li>改善网站性能和用户体验</li>
                </ul>
              </div>

              <div className="p-4 bg-gray-50 rounded-lg">
                <h3 className="text-lg font-semibold text-gray-900 mb-2">3. 营销 Cookie</h3>
                <p className="text-gray-700">
                  这些 Cookie 用于跟踪访问者并提供个性化广告和内容。
                  这些 Cookie 可以帮助我们向您展示更相关的广告和内容。
                  您可以随时选择关闭这些 Cookie。
                </p>
              </div>
            </div>
          </section>

          <section className="space-y-4">
            <h2 className="text-2xl font-semibold text-gray-900">如何管理 Cookie</h2>
            <p className="text-gray-700 leading-relaxed">
              您可以通过浏览器设置或我们网站上的 Cookie 设置来管理 Cookie 偏好。
              请注意，禁用某些 Cookie 可能会影响网站的功能和用户体验。
            </p>
          </section>

          <section className="space-y-4">
            <h2 className="text-2xl font-semibold text-gray-900">数据保护</h2>
            <p className="text-gray-700 leading-relaxed">
              我们重视您的隐私，并采取适当的安全措施来保护您的个人信息。
              我们收集的数据仅用于改善网站体验，不会出售给第三方。
            </p>
          </section>

          <section className="space-y-4">
            <h2 className="text-2xl font-semibold text-gray-900">联系我们</h2>
            <p className="text-gray-700 leading-relaxed">
              如果您对隐私政策或 Cookie 使用有任何疑问，请通过
              <a href="/contact" className="text-primary hover:underline">联系我们</a>
              页面与我们联系。
            </p>
          </section>
        </motion.div>
      </div>
    </div>
  );
}

