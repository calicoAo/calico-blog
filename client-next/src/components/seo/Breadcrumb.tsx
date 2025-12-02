'use client'

/**
 * Breadcrumb 组件 - 面包屑导航
 * 
 * 功能：
 * - 显示页面层级导航
 * - 生成结构化数据
 * - SEO 优化
 * 
 * @author lijingru
 * @created 2025-11-13
 */

import Link from 'next/link';
import { generateBreadcrumbStructuredData } from '@/lib/seo';
import StructuredData from './StructuredData';

interface BreadcrumbItem {
  name: string;
  url: string;
}

interface BreadcrumbProps {
  items: BreadcrumbItem[];
}

/**
 * 面包屑导航组件
 */
export default function Breadcrumb({ items }: BreadcrumbProps) {
  const structuredData = generateBreadcrumbStructuredData(items);

  return (
    <>
      <StructuredData data={structuredData} />
      <nav aria-label="面包屑导航" className="mb-4">
        <ol className="flex flex-wrap items-center gap-2 text-sm text-gray-600">
          {items.map((item, index) => (
            <li key={index} className="flex items-center">
              {index > 0 && (
                <span className="mx-2 text-gray-400" aria-hidden="true">
                  /
                </span>
              )}
              {index === items.length - 1 ? (
                <span className="text-gray-900 font-medium" aria-current="page">
                  {item.name}
                </span>
              ) : (
                <Link
                  href={item.url}
                  className="hover:text-primary transition-colors"
                >
                  {item.name}
                </Link>
              )}
            </li>
          ))}
        </ol>
      </nav>
    </>
  );
}

