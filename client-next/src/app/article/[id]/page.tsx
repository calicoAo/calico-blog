import ArticleDetail from '@/components/pages/ArticleDetail';
import { generateMetadata as generateSEOMetadata, generateArticleStructuredData } from '@/lib/seo';
import { getBlogDetail } from '@/api/blog';
import type { Metadata } from 'next';

/**
 * 生成文章页面的元数据
 */
export async function generateMetadata({
  params,
}: {
  params: Promise<{ id: string }>;
}): Promise<Metadata> {
  const { id } = await params;

  try {
    const blog = await getBlogDetail(id);

    return generateSEOMetadata({
      title: blog.title,
      description: blog.excerpt || blog.content?.substring(0, 200) || '阅读完整文章',
      keywords: blog.tags || [],
      url: `/article/${id}`,
      type: 'article',
      publishedTime: blog.publishedAt || blog.createdAt,
      modifiedTime: blog.updatedAt,
      author: blog.author?.username || 'lijingru',
    });
  } catch (error) {
    console.error('生成文章元数据失败:', error);
    return generateSEOMetadata({
      title: '文章未找到',
      description: '抱歉，找不到这篇文章',
      url: `/article/${id}`,
    });
  }
}

/**
 * 文章详情页面
 */
export default async function ArticlePage({ 
  params 
}: { 
  params: Promise<{ id: string }> 
}) {
  const { id } = await params;

  // 获取文章数据用于结构化数据
  let structuredData = null;
  try {
    const blog = await getBlogDetail(id);
    structuredData = generateArticleStructuredData({
      title: blog.title,
      description: blog.excerpt || blog.content?.substring(0, 200) || '',
      url: `/article/${id}`,
      image: blog.coverImage,
      publishedTime: blog.publishedAt || blog.createdAt,
      modifiedTime: blog.updatedAt,
      author: blog.author?.username || 'lijingru',
      category: blog.category,
    });
  } catch (error) {
    console.error('获取文章数据失败:', error);
  }

  return (
    <>
      {structuredData && (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(structuredData),
          }}
        />
      )}
      <ArticleDetail id={id} />
    </>
  );
}
