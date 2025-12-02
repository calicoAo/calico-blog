import Link from 'next/link';
import { generateMetadata as generateSEOMetadata } from '@/lib/seo';
import type { Metadata } from 'next';

export const metadata: Metadata = generateSEOMetadata({
  title: '页面未找到',
  description: '抱歉，您访问的页面不存在',
  url: '/404',
});

/**
 * 404 页面
 * 
 * 功能：
 * - 友好的错误提示
 * - 导航链接
 * - SEO 优化
 */
export default function NotFound() {
  return (
    <div className="min-h-screen bg-linear-to-tr from-sky-100 via-amber-50 to-slate-100 flex items-center justify-center p-8">
      <div className="text-center max-w-md">
        <h1 className="text-6xl font-bold text-gray-900 mb-4">404</h1>
        <h2 className="text-2xl font-semibold text-gray-700 mb-4">页面未找到</h2>
        <p className="text-gray-600 mb-8">
          抱歉，您访问的页面不存在。可能已被删除或链接有误。
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link
            href="/"
            className="px-6 py-3 bg-primary text-primary-foreground rounded-lg font-medium hover:bg-primary/90 transition-colors"
          >
            返回首页
          </Link>
          <Link
            href="/articles"
            className="px-6 py-3 border border-primary text-primary rounded-lg font-medium hover:bg-primary/10 transition-colors"
          >
            浏览文章
          </Link>
        </div>
      </div>
    </div>
  );
}

