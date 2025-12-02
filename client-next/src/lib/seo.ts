/**
 * SEO 工具函数
 * 
 * 功能：
 * - 生成页面元数据
 * - 生成结构化数据（JSON-LD）
 * - SEO 相关工具函数
 * 
 * @author lijingru
 * @created 2025-11-13
 */

import type { Metadata } from 'next';

/**
 * 网站基础信息
 */
export const siteConfig = {
  name: 'Calico Blog',
  description: '一个现代化的博客平台，分享技术、生活和思考',
  url: process.env.NEXT_PUBLIC_SITE_URL || 'https://calico-blog.com',
  author: 'lijingru',
  keywords: ['博客', '技术', '前端', 'React', 'Next.js', 'Web开发'],
  ogImage: '/og-image.jpg',
  twitterHandle: '@calico_blog',
};

/**
 * 生成页面元数据
 */
export function generateMetadata({
  title,
  description,
  keywords,
  image,
  url,
  type = 'website',
  publishedTime,
  modifiedTime,
  author,
}: {
  title: string;
  description: string;
  keywords?: string[];
  image?: string;
  url?: string;
  type?: 'website' | 'article';
  publishedTime?: string;
  modifiedTime?: string;
  author?: string;
}): Metadata {
  const fullTitle = title.includes(siteConfig.name) 
    ? title 
    : `${title} | ${siteConfig.name}`;
  
  const fullUrl = url ? `${siteConfig.url}${url}` : siteConfig.url;
  const ogImage = image ? `${siteConfig.url}${image}` : `${siteConfig.url}${siteConfig.ogImage}`;

  return {
    title: fullTitle,
    description,
    keywords: keywords || siteConfig.keywords,
    authors: [{ name: author || siteConfig.author }],
    creator: author || siteConfig.author,
    publisher: siteConfig.name,
    metadataBase: new URL(siteConfig.url),
    alternates: {
      canonical: fullUrl,
    },
    openGraph: {
      type,
      locale: 'zh_CN',
      url: fullUrl,
      title: fullTitle,
      description,
      siteName: siteConfig.name,
      images: [
        {
          url: ogImage,
          width: 1200,
          height: 630,
          alt: title,
        },
      ],
      ...(type === 'article' && {
        publishedTime,
        modifiedTime,
        authors: [author || siteConfig.author],
      }),
    },
    twitter: {
      card: 'summary_large_image',
      title: fullTitle,
      description,
      images: [ogImage],
      creator: siteConfig.twitterHandle,
    },
    robots: {
      index: true,
      follow: true,
      googleBot: {
        index: true,
        follow: true,
        'max-video-preview': -1,
        'max-image-preview': 'large',
        'max-snippet': -1,
      },
    },
  };
}

/**
 * 生成文章结构化数据（JSON-LD）
 */
export function generateArticleStructuredData({
  title,
  description,
  url,
  image,
  publishedTime,
  modifiedTime,
  author,
  category,
}: {
  title: string;
  description: string;
  url: string;
  image?: string;
  publishedTime: string;
  modifiedTime?: string;
  author: string;
  category: string;
}) {
  const fullUrl = url.startsWith('http') ? url : `${siteConfig.url}${url}`;
  const ogImage = image 
    ? (image.startsWith('http') ? image : `${siteConfig.url}${image}`)
    : `${siteConfig.url}${siteConfig.ogImage}`;

  return {
    '@context': 'https://schema.org',
    '@type': 'BlogPosting',
    headline: title,
    description,
    image: ogImage,
    datePublished: publishedTime,
    dateModified: modifiedTime || publishedTime,
    author: {
      '@type': 'Person',
      name: author,
    },
    publisher: {
      '@type': 'Organization',
      name: siteConfig.name,
      logo: {
        '@type': 'ImageObject',
        url: `${siteConfig.url}/logo.png`,
      },
    },
    mainEntityOfPage: {
      '@type': 'WebPage',
      '@id': fullUrl,
    },
    articleSection: category,
  };
}

/**
 * 生成博客结构化数据（JSON-LD）
 */
export function generateBlogStructuredData() {
  return {
    '@context': 'https://schema.org',
    '@type': 'Blog',
    name: siteConfig.name,
    description: siteConfig.description,
    url: siteConfig.url,
    author: {
      '@type': 'Person',
      name: siteConfig.author,
    },
  };
}

/**
 * 生成面包屑结构化数据（JSON-LD）
 */
export function generateBreadcrumbStructuredData(items: Array<{ name: string; url: string }>) {
  return {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: items.map((item, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      name: item.name,
      item: item.url.startsWith('http') ? item.url : `${siteConfig.url}${item.url}`,
    })),
  };
}

/**
 * 生成组织结构化数据（JSON-LD）
 */
export function generateOrganizationStructuredData() {
  return {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    name: siteConfig.name,
    url: siteConfig.url,
    logo: `${siteConfig.url}/logo.png`,
    sameAs: [
      // 可以添加社交媒体链接
      // 'https://twitter.com/calico_blog',
      // 'https://github.com/calico-blog',
    ],
  };
}

