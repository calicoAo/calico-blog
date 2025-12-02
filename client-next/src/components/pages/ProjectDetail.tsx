'use client'
/**
 * ProjectDetail 页面 - 项目详情页
 * 
 * 功能：
 * - 显示项目完整信息
 * - 项目描述、技术栈、功能特性
 * - 项目截图展示
 * - 项目链接和 GitHub 链接
 * 
 * @author lijingru
 * @created 2025-11-13
 */

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { motion } from 'framer-motion';
import BlogTag from '@/components/blog/BlogTag';
import BackToHome from '@/components/ui/BackToHome';
import { mockProjects } from '@/data/mockProjects';

interface ProjectDetailProps {
  id: string;
}

const ProjectDetail: React.FC<ProjectDetailProps> = ({ id }) => {
  const router = useRouter();
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);

  // 调试信息
  console.log('ProjectDetail - Received id:', id, 'Type:', typeof id);
  console.log('Available projects:', mockProjects.map(p => ({ id: p.id, name: p.name })));

  const project = mockProjects.find((p) => p.id === Number(id));
  
  console.log('Found project:', project);

  if (!project) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">项目未找到</h1>
          <Link href="/works" className="text-primary hover:underline">
            返回项目列表
          </Link>
        </div>
      </div>
    );
  }

  const screenshots = project.screenshots || [project.image];

  return (
    <div className="min-h-screen bg-gradient-to-br from-sky-100 via-amber-50 to-slate-100">
      {/* 返回按钮 */}
      <div className="container mx-auto px-6 pt-6">
        <BackToHome />
      </div>

      <div className="container mx-auto px-6 py-12 max-w-6xl">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
        >
          {/* 项目头部 */}
          <div className="bg-white rounded-2xl shadow-xl overflow-hidden mb-8">
            {/* 项目主图 */}
            <div className="relative h-96 overflow-hidden">
              <img
                src={project.image}
                alt={project.name}
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
              <div className="absolute bottom-0 left-0 right-0 p-8">
                <h1 className="text-4xl font-bold text-white mb-2">
                  {project.name}
                </h1>
                {project.category && (
                  <span className="inline-block px-4 py-1 bg-primary/80 text-white rounded-full text-sm">
                    {project.category}
                  </span>
                )}
              </div>
            </div>

            {/* 项目基本信息 */}
            <div className="p-8">
              <div className="flex flex-wrap items-center gap-4 mb-6">
                {project.link && (
                  <motion.a
                    href={project.link}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="px-6 py-3 bg-primary text-primary-foreground rounded-lg font-medium hover:bg-primary/90 transition-colors flex items-center gap-2"
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    <svg
                      className="w-5 h-5"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"
                      />
                    </svg>
                    访问项目
                  </motion.a>
                )}
                {project.github && (
                  <motion.a
                    href={project.github}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="px-6 py-3 border border-gray-300 text-gray-700 rounded-lg font-medium hover:bg-gray-50 transition-colors flex items-center gap-2"
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    <svg
                      className="w-5 h-5"
                      fill="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        fillRule="evenodd"
                        d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z"
                        clipRule="evenodd"
                      />
                    </svg>
                    GitHub
                  </motion.a>
                )}
              </div>

              {/* 项目描述 */}
              <p className="text-lg text-gray-700 leading-relaxed mb-6">
                {project.description}
              </p>

              {/* 技术栈 */}
              <div className="mb-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-3">
                  技术栈
                </h3>
                <div className="flex flex-wrap gap-2">
                  {project.technologies.map((tech, index) => (
                    <BlogTag key={index} text={tech} variant="primary" />
                  ))}
                </div>
              </div>

              {/* 项目信息 */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 pt-6 border-t border-gray-200">
                {project.status && (
                  <div>
                    <span className="text-sm text-gray-500">状态</span>
                    <p className="text-base font-medium text-gray-900">
                      {project.status === 'completed' && '已完成'}
                      {project.status === 'ongoing' && '进行中'}
                      {project.status === 'archived' && '已归档'}
                    </p>
                  </div>
                )}
                {project.startDate && (
                  <div>
                    <span className="text-sm text-gray-500">开始日期</span>
                    <p className="text-base font-medium text-gray-900">
                      {project.startDate}
                    </p>
                  </div>
                )}
                {project.endDate && (
                  <div>
                    <span className="text-sm text-gray-500">结束日期</span>
                    <p className="text-base font-medium text-gray-900">
                      {project.endDate}
                    </p>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* 项目详情内容 */}
          {project.fullDescription && (
            <div className="bg-white rounded-2xl shadow-xl p-8 mb-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-6">
                项目详情
              </h2>
              <div
                className="prose prose-lg max-w-none"
                dangerouslySetInnerHTML={{ __html: project.fullDescription }}
              />
            </div>
          )}

          {/* 功能特性 */}
          {project.features && project.features.length > 0 && (
            <div className="bg-white rounded-2xl shadow-xl p-8 mb-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-6">
                主要功能
              </h2>
              <ul className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {project.features.map((feature, index) => (
                  <motion.li
                    key={index}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.1 }}
                    className="flex items-start gap-3"
                  >
                    <span className="text-primary mt-1">✓</span>
                    <span className="text-gray-700">{feature}</span>
                  </motion.li>
                ))}
              </ul>
            </div>
          )}

          {/* 项目截图 */}
          {screenshots.length > 0 && (
            <div className="bg-white rounded-2xl shadow-xl p-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-6">
                项目截图
              </h2>
              <div className="space-y-6">
                {/* 主图 */}
                <div className="relative rounded-lg overflow-hidden">
                  <img
                    src={screenshots[selectedImageIndex]}
                    alt={`${project.name} 截图 ${selectedImageIndex + 1}`}
                    className="w-full h-auto"
                  />
                </div>

                {/* 缩略图 */}
                {screenshots.length > 1 && (
                  <div className="grid grid-cols-4 gap-4">
                    {screenshots.map((screenshot, index) => (
                      <motion.button
                        key={index}
                        onClick={() => setSelectedImageIndex(index)}
                        className={`relative rounded-lg overflow-hidden border-2 transition-all ${
                          index === selectedImageIndex
                            ? 'border-primary shadow-lg'
                            : 'border-transparent hover:border-primary/50'
                        }`}
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                      >
                        <img
                          src={screenshot}
                          alt={`缩略图 ${index + 1}`}
                          className="w-full h-24 object-cover"
                        />
                      </motion.button>
                    ))}
                  </div>
                )}
              </div>
            </div>
          )}

          {/* 返回按钮 */}
          <div className="mt-8 text-center">
            <motion.button
              onClick={() => router.push('/works')}
              className="px-6 py-3 bg-primary text-primary-foreground rounded-lg font-medium hover:bg-primary/90 transition-colors"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              返回项目列表
            </motion.button>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default ProjectDetail;

