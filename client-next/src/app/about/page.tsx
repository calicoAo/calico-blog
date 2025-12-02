import About from '@/components/pages/About';
import { generateMetadata as generateSEOMetadata } from '@/lib/seo';
import type { Metadata } from 'next';

export const metadata: Metadata = generateSEOMetadata({
  title: '关于我',
  description: '了解我的项目经历、技术栈和个人简介',
  url: '/about',
});

export default function AboutPage() {
  return <About />;
}

