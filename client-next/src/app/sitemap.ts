import { MetadataRoute } from 'next';
import { getBlogList } from '@/api/blog';

/**
 * sitemap.xml 生成
 * 
 * 功能：
 * - 生成所有可索引页面的站点地图
 * - 帮助搜索引擎发现和索引页面
 */
export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://calico-blog.com';

  // 静态页面
  const staticPages: MetadataRoute.Sitemap = [
    {
      url: baseUrl,
      lastModified: new Date(),
      changeFrequency: 'daily',
      priority: 1,
    },
    {
      url: `${baseUrl}/about`,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.8,
    },
    {
      url: `${baseUrl}/contact`,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.7,
    },
    {
      url: `${baseUrl}/articles`,
      lastModified: new Date(),
      changeFrequency: 'daily',
      priority: 0.9,
    },
    {
      url: `${baseUrl}/works`,
      lastModified: new Date(),
      changeFrequency: 'weekly',
      priority: 0.8,
    },
  ];

  // 动态页面 - 文章列表
  try {
    const blogResponse = await getBlogList({
      page: 1,
      limit: 1000, // 获取所有已发布的文章
      status: 'published',
    });

    const blogPages: MetadataRoute.Sitemap = blogResponse.data.map((blog: any) => ({
      url: `${baseUrl}/article/${blog._id}`,
      lastModified: blog.updatedAt ? new Date(blog.updatedAt) : new Date(blog.createdAt),
      changeFrequency: 'weekly' as const,
      priority: 0.8,
    }));

    return [...staticPages, ...blogPages];
  } catch (error) {
    console.error('生成 sitemap 时出错:', error);
    // 如果获取文章列表失败，至少返回静态页面
    return staticPages;
  }
}

