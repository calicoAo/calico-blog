import Home from '@/components/pages/Home';
import { generateMetadata as generateSEOMetadata, generateBlogStructuredData } from '@/lib/seo';
import type { Metadata } from 'next';

export const metadata: Metadata = generateSEOMetadata({
  title: '首页',
  description: '一个现代化的博客平台，分享技术、生活和思考',
  url: '/',
});

export default function HomePage() {
  const blogStructuredData = generateBlogStructuredData();

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(blogStructuredData),
        }}
      />
      <Home />
    </>
  );
}
