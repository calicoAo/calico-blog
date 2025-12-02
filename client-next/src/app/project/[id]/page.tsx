import ProjectDetail from '@/components/pages/ProjectDetail';

export default async function ProjectPage({ 
  params 
}: { 
  params: Promise<{ id: string }> 
}) {
  const { id } = await params;
  return <ProjectDetail id={id} />;
}

