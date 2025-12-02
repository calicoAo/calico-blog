import { MetadataRoute } from 'next';

/**
 * robots.txt 生成
 * 
 * 功能：
 * - 告诉搜索引擎哪些页面可以抓取
 * - 指定 sitemap 位置
 */
export default function robots(): MetadataRoute.Robots {
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://calico-blog.com';

  return {
    rules: [
      {
        userAgent: '*',
        allow: '/',
        disallow: [
          '/api/',
          '/admin/',
          '/publish/',
          '/login/',
          '/analytics/',
        ],
      },
    ],
    sitemap: `${baseUrl}/sitemap.xml`,
  };
}

