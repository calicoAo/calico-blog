'use client'

/**
 * Works 页面 - 项目列表页
 * 
 * 功能：
 * - 通过轮播图展示项目列表
 * - 点击项目卡片跳转到详情页
 * - 项目列表包括项目名称、项目描述、项目图片、项目链接，用tag的方式展示项目技术栈
 * 
 * @author lijingru
 * @created 2025-11-13
 */

import { motion } from 'framer-motion';
import ProjectCarousel from '@/components/project/ProjectCarousel';
import BackToHome from '@/components/ui/BackToHome';
import { mockProjects } from '@/data/mockProjects';

export default function Works() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-sky-100 via-amber-50 to-slate-100">
      {/* 返回按钮 */}
      <div className="container mx-auto px-6 pt-6">
        <BackToHome />
      </div>

      <div className="container mx-auto px-6 py-12">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
        >
          {/* 页面标题 */}
          <div className="text-center mb-12">
            <h1 className="text-4xl font-bold text-gray-900 mb-4">我的作品</h1>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              这里展示了我参与开发的一些项目，涵盖了 Web 应用、工具类应用等多个领域。
              每个项目都包含了详细的技术栈和功能特性。
            </p>
          </div>

          {/* 项目轮播图 */}
          <ProjectCarousel projects={mockProjects} autoPlay={true} autoPlayInterval={5000} />
        </motion.div>
      </div>
    </div>
  );
}

