import ArticleList from '@/components/pages/ArticleList';
import { generateMetadata as generateSEOMetadata } from '@/lib/seo';
import type { Metadata } from 'next';

export const metadata: Metadata = generateSEOMetadata({
  title: '文章列表',
  description: '浏览所有文章，按分类筛选，发现感兴趣的内容',
  url: '/articles',
});

export default async function ArticlesPage({
  searchParams,
}: {
  searchParams: Promise<{ category?: string }>;
}) {
  const params = await searchParams;
  return <ArticleList initialCategory={params.category} />;
}

