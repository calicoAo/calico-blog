'use client'
/**
 * Home 页面 - 主页
 * 
 * 布局结构：
 * - 使用 Flexbox 布局
 * - 左侧 Sidebar 占 25% 宽度
 * - 右侧 MainContent 占 75% 宽度
 * - 管理工具栏（仅登录后显示）
 * - 右下角登录按钮（未登录时显示）
 * 
 * @author lijingru
 * @created 2025-10-19
 */

'use client'

import Sidebar from "@/components/layout/Sidebar";
import MainContent from "@/components/layout/MainContent";
import AdminToolbar from "@/components/admin/AdminToolbar";
import Link from "next/link";
import { motion } from "framer-motion";
import { useAuth } from "@/hooks/useAuth";

export default function Home() {
  const { isAuthenticated } = useAuth();

  return (
    <div className="flex min-h-screen relative">
      <Sidebar />
      <MainContent />
      
      {/* 管理工具栏 - 仅登录后显示 */}
      <AdminToolbar />
      
      {/* 登录按钮 - 仅未登录时显示 */}
      {!isAuthenticated && (
        <motion.div
          initial={{ opacity: 0, scale: 0 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.5, duration: 0.3 }}
          className="fixed bottom-6 right-6 z-40"
        >
          <Link href="/login">
            <motion.button
              className="w-14 h-14 bg-white/80 backdrop-blur-sm border border-primary/20 rounded-full shadow-lg hover:bg-primary/10 hover:border-primary/40 transition-all duration-200 flex items-center justify-center group"
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.95 }}
              aria-label="管理员登录"
            >
              <motion.svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-6 w-6 text-primary group-hover:text-primary"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth={2}
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                />
              </motion.svg>
            </motion.button>
          </Link>
        </motion.div>
      )}
    </div>
  );
}
