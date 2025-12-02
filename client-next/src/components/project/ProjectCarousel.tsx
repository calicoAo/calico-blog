'use client'

/**
 * ProjectCarousel 组件 - 项目轮播图
 * 
 * 功能：
 * - 展示项目列表
 * - 支持左右切换
 * - 点击项目卡片跳转到详情页
 * - 显示项目名称、描述、图片和技术栈标签
 * 
 * @author lijingru
 * @created 2025-11-13
 */

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import BlogTag from '@/components/blog/BlogTag';
import type { Project } from '@/data/mockProjects';

interface ProjectCarouselProps {
  projects: Project[];
  autoPlay?: boolean;
  autoPlayInterval?: number;
}

const ProjectCarousel: React.FC<ProjectCarouselProps> = ({
  projects,
  autoPlay = true,
  autoPlayInterval = 5000,
}) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [direction, setDirection] = useState(0);
  const router = useRouter();

  // 自动播放
  useEffect(() => {
    if (!autoPlay || projects.length <= 1) return;

    const interval = setInterval(() => {
      setDirection(1);
      setCurrentIndex((prev) => (prev + 1) % projects.length);
    }, autoPlayInterval);

    return () => clearInterval(interval);
  }, [autoPlay, autoPlayInterval, projects.length]);

  const goToSlide = (index: number) => {
    if (index === currentIndex) return;
    setDirection(index > currentIndex ? 1 : -1);
    setCurrentIndex(index);
  };

  const goToPrevious = () => {
    setDirection(-1);
    setCurrentIndex((prev) => (prev - 1 + projects.length) % projects.length);
  };

  const goToNext = () => {
    setDirection(1);
    setCurrentIndex((prev) => (prev + 1) % projects.length);
  };

  const handleProjectClick = (projectId: number) => {
    router.push(`/project/${projectId}`);
  };

  const variants = {
    enter: (direction: number) => ({
      x: direction > 0 ? 1000 : -1000,
      opacity: 0,
    }),
    center: {
      zIndex: 1,
      x: 0,
      opacity: 1,
    },
    exit: (direction: number) => ({
      zIndex: 0,
      x: direction < 0 ? 1000 : -1000,
      opacity: 0,
    }),
  };

  const currentProject = projects[currentIndex];

  if (!currentProject) return null;

  return (
    <div className="relative w-full max-w-6xl mx-auto">
      {/* 轮播图容器 */}
      <div className="relative h-[500px] overflow-hidden rounded-2xl bg-gradient-to-br from-white to-gray-50 shadow-xl">
        <AnimatePresence initial={false} custom={direction}>
          <motion.div
            key={currentIndex}
            custom={direction}
            variants={variants}
            initial="enter"
            animate="center"
            exit="exit"
            transition={{
              x: { type: 'spring', stiffness: 300, damping: 30 },
              opacity: { duration: 0.2 },
            }}
            className="absolute inset-0 flex"
          >
            {/* 项目图片 */}
            <div className="w-1/2 relative overflow-hidden">
              <img
                src={currentProject.image}
                alt={currentProject.name}
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-r from-black/50 to-transparent" />
            </div>

            {/* 项目信息 */}
            <div className="w-1/2 p-8 flex flex-col justify-center bg-white">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
              >
                {/* 项目名称 */}
                <h2 className="text-3xl font-bold text-gray-900 mb-4">
                  {currentProject.name}
                </h2>

                {/* 项目描述 */}
                <p className="text-gray-600 mb-6 leading-relaxed">
                  {currentProject.description}
                </p>

                {/* 技术栈标签 */}
                <div className="flex flex-wrap gap-2 mb-6">
                  {currentProject.technologies.map((tech, index) => (
                    <BlogTag
                      key={index}
                      text={tech}
                      variant="primary"
                    />
                  ))}
                </div>

                {/* 操作按钮 */}
                <div className="flex gap-4">
                  <motion.button
                    onClick={() => handleProjectClick(currentProject.id)}
                    className="px-6 py-3 bg-primary text-primary-foreground rounded-lg font-medium hover:bg-primary/90 transition-colors"
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    查看详情
                  </motion.button>
                  {currentProject.link && (
                    <motion.a
                      href={currentProject.link}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="px-6 py-3 border border-primary text-primary rounded-lg font-medium hover:bg-primary/10 transition-colors"
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                    >
                      访问项目
                    </motion.a>
                  )}
                </div>
              </motion.div>
            </div>
          </motion.div>
        </AnimatePresence>

        {/* 左右切换按钮 */}
        {projects.length > 1 && (
          <>
            <button
              onClick={goToPrevious}
              className="absolute left-4 top-1/2 -translate-y-1/2 w-12 h-12 bg-white/90 backdrop-blur-sm rounded-full shadow-lg flex items-center justify-center hover:bg-white transition-colors z-10"
              aria-label="上一个项目"
            >
              <svg
                className="w-6 h-6 text-gray-700"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M15 19l-7-7 7-7"
                />
              </svg>
            </button>
            <button
              onClick={goToNext}
              className="absolute right-4 top-1/2 -translate-y-1/2 w-12 h-12 bg-white/90 backdrop-blur-sm rounded-full shadow-lg flex items-center justify-center hover:bg-white transition-colors z-10"
              aria-label="下一个项目"
            >
              <svg
                className="w-6 h-6 text-gray-700"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9 5l7 7-7 7"
                />
              </svg>
            </button>
          </>
        )}
      </div>

      {/* 指示器 */}
      {projects.length > 1 && (
        <div className="flex justify-center gap-2 mt-6">
          {projects.map((_, index) => (
            <button
              key={index}
              onClick={() => goToSlide(index)}
              className={`w-2 h-2 rounded-full transition-all ${
                index === currentIndex
                  ? 'bg-primary w-8'
                  : 'bg-gray-300 hover:bg-gray-400'
              }`}
              aria-label={`跳转到项目 ${index + 1}`}
            />
          ))}
        </div>
      )}

      {/* 项目缩略图列表 */}
      <div className="mt-8 grid grid-cols-3 gap-4">
        {projects.map((project, index) => (
          <motion.div
            key={project.id}
            onClick={() => goToSlide(index)}
            className={`relative h-32 rounded-lg overflow-hidden cursor-pointer border-2 transition-all ${
              index === currentIndex
                ? 'border-primary shadow-lg scale-105'
                : 'border-transparent hover:border-primary/50'
            }`}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <img
              src={project.image}
              alt={project.name}
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent flex items-end p-3">
              <span className="text-white text-sm font-medium truncate w-full">
                {project.name}
              </span>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
};

export default ProjectCarousel;

