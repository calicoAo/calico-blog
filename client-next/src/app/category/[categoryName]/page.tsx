import ArticleList from '@/components/pages/ArticleList';

export const metadata = {
  title: '文章分类 - Calico Blog',
  description: '按分类浏览文章',
};

export default async function CategoryPage({
  params,
}: {
  params: Promise<{ categoryName: string }>;
}) {
  const { categoryName } = await params;
  return <ArticleList categoryName={categoryName} />;
}

