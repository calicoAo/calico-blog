/**
 * Contact 页面 - 联系页面
 *
 * 功能：
 * - 显示个人简短简历
 * - 提供留言表单（名字和邮箱）
 * - 展示其他平台的图标链接
 * - 与主页保持一致的布局（左侧 Sidebar，右侧内容）
 *
 * @author lijingru
 * @created 2025-11-12
 */

import React, { useState } from "react";
import { motion } from "framer-motion";
import Sidebar from "@/components/layout/Sidebar";
import AdminToolbar from "@/components/admin/AdminToolbar";
import BackToHome from "@/components/ui/BackToHome";

/**
 * 社交平台链接配置
 */
interface SocialLink {
  name: string;
  url: string;
  icon: React.ReactElement;
}

/**
 * 联系页面
 */
const Contact: React.FC = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    message: "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitMessage, setSubmitMessage] = useState<{
    type: "success" | "error";
    text: string;
  } | null>(null);

  // 社交平台链接配置
  const socialLinks: SocialLink[] = [
    {
      name: "GitHub",
      url: "https://github.com",
      icon: (
        <svg
          className="w-6 h-6"
          fill="currentColor"
          viewBox="0 0 24 24"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z" />
        </svg>
      ),
    },
    {
      name: "Twitter",
      url: "https://twitter.com",
      icon: (
        <svg
          className="w-6 h-6"
          fill="currentColor"
          viewBox="0 0 24 24"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path d="M23.953 4.57a10 10 0 01-2.825.775 4.958 4.958 0 002.163-2.723c-.951.555-2.005.959-3.127 1.184a4.92 4.92 0 00-8.384 4.482C7.69 8.095 4.067 6.13 1.64 3.162a4.822 4.822 0 00-.666 2.475c0 1.71.87 3.213 2.188 4.096a4.904 4.904 0 01-2.228-.616v.06a4.923 4.923 0 003.946 4.827 4.996 4.996 0 01-2.212.085 4.936 4.936 0 004.604 3.417 9.867 9.867 0 01-6.102 2.105c-.39 0-.779-.023-1.17-.067a13.995 13.995 0 007.557 2.209c9.053 0 13.998-7.496 13.998-13.985 0-.21 0-.42-.015-.63A9.935 9.935 0 0024 4.59z" />
        </svg>
      ),
    },
    {
      name: "LinkedIn",
      url: "https://linkedin.com",
      icon: (
        <svg
          className="w-6 h-6"
          fill="currentColor"
          viewBox="0 0 24 24"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
        </svg>
      ),
    },
    {
      name: "Email",
      url: "mailto:your-email@example.com",
      icon: (
        <svg
          className="w-6 h-6"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
          />
        </svg>
      ),
    },
  ];

  // 处理表单输入变化
  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
    setSubmitMessage(null);
  };

  // 处理表单提交
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setSubmitMessage(null);

    // 验证必填字段
    if (!formData.name.trim() || !formData.email.trim()) {
      setSubmitMessage({ type: "error", text: "请填写姓名和邮箱" });
      setIsSubmitting(false);
      return;
    }

    // 验证邮箱格式
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(formData.email)) {
      setSubmitMessage({ type: "error", text: "请输入有效的邮箱地址" });
      setIsSubmitting(false);
      return;
    }

    try {
      // 这里可以调用后端API发送留言
      // await sendMessageAPI(formData);

      // 模拟API调用
      await new Promise((resolve) => setTimeout(resolve, 1000));

      setSubmitMessage({
        type: "success",
        text: "留言已发送，我会尽快回复您！",
      });

      // 清空表单
      setFormData({
        name: "",
        email: "",
        message: "",
      });
    } catch (error) {
      setSubmitMessage({ type: "error", text: "发送失败，请稍后重试" });
      console.error("Submit error:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="flex min-h-screen relative">
      <Sidebar />

      {/* 右侧内容区域 */}
      <main className="flex-1 p-8 bg-linear-to-tr from-sky-100 via-amber-50 to-slate-100 h-screen overflow-y-auto">
        <div className="max-w-4xl mx-auto">
          {/* 返回首页按钮 */}
          <div className="mb-6">
            <BackToHome />
          </div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="space-y-6"
          >
            {/* 页面标题 */}
            <div>
              <h1 className="text-4xl font-bold text-gray-900 mb-4">联系我</h1>
              <p className="text-lg text-gray-600">
                很高兴认识你，期待与你的交流
              </p>
            </div>

            {/* 个人简历部分 */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1, duration: 0.6 }}
              className="bg-white rounded-xl shadow-lg p-8 border border-gray-200"
            >
              <h2 className="text-2xl font-bold text-gray-900 mb-6">关于我</h2>
              <div className="prose prose-lg max-w-none">
                <p className="text-gray-700 leading-relaxed mb-4">
                  你好，我是 <strong>lijingru</strong>
                  ，一名热爱技术的前端开发工程师。
                </p>
                <p className="text-gray-700 leading-relaxed mb-4">
                  我专注于现代 Web 开发技术，包括 React、TypeScript、Node.js
                  等。 喜欢探索新技术，分享开发经验，并致力于构建优雅、高效的
                  Web 应用。
                </p>
                <p className="text-gray-700 leading-relaxed">
                  目前居住在成都，四川，中国。如果你有任何问题或合作意向，欢迎通过下方表单或社交平台联系我。
                </p>
              </div>
            </motion.div>

            {/* 留言表单部分 */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2, duration: 0.6 }}
              className="bg-white rounded-xl shadow-lg p-8 border border-gray-200"
            >
              <h2 className="text-2xl font-bold text-gray-900 mb-6">留言</h2>

              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="flex flex-row gap-4">
                  {/* 姓名输入 */}
                  <div className="flex-1">
                    <label
                      htmlFor="name"
                      className="block text-sm font-semibold text-gray-700 mb-2"
                    >
                      姓名 <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      id="name"
                      name="name"
                      value={formData.name}
                      onChange={handleInputChange}
                      placeholder="请输入您的姓名"
                      required
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-ring focus:border-transparent outline-none transition-all"
                    />
                  </div>

                  {/* 邮箱输入 */}
                  <div className="flex-1">
                    <label
                      htmlFor="email"
                      className="block text-sm font-semibold text-gray-700 mb-2"
                    >
                      邮箱 <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="email"
                      id="email"
                      name="email"
                      value={formData.email}
                      onChange={handleInputChange}
                      placeholder="your-email@example.com"
                      required
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-ring focus:border-transparent outline-none transition-all"
                    />
                  </div>
                </div>
                {/* 留言内容 */}
                <div className="w-full">
                  <label
                    htmlFor="message"
                    className="block text-sm font-semibold text-gray-700 mb-2"
                  >
                    留言内容
                  </label>
                  <textarea
                    id="message"
                    name="message"
                    value={formData.message}
                    onChange={handleInputChange}
                    placeholder="请输入您的留言内容..."
                    rows={6}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-ring focus:border-transparent outline-none transition-all resize-none"
                  />
                </div>

                {/* 提交消息提示 */}
                {submitMessage && (
                  <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className={`p-4 rounded-lg ${
                      submitMessage.type === "success"
                        ? "bg-green-50 text-green-800 border border-green-200"
                        : "bg-red-50 text-red-800 border border-red-200"
                    }`}
                  >
                    {submitMessage.text}
                  </motion.div>
                )}

                {/* 提交按钮 */}
                <motion.button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full px-6 py-3 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed font-semibold"
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  {isSubmitting ? "发送中..." : "发送留言"}
                </motion.button>
              </form>
            </motion.div>

            {/* 社交平台链接部分 */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3, duration: 0.6 }}
              className="bg-white rounded-xl shadow-lg p-8 border border-gray-200"
            >
              <h2 className="text-2xl font-bold text-gray-900 mb-6">
                其他平台
              </h2>
              <div className="flex flex-wrap gap-6">
                {socialLinks.map((link, index) => (
                  <motion.a
                    key={link.name}
                    href={link.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-3 p-4 rounded-lg border border-gray-200 hover:border-primary hover:bg-primary/10 transition-all duration-200 group"
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: 0.4 + index * 0.1 }}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    <div className="text-gray-600 group-hover:text-primary transition-colors">
                      {link.icon}
                    </div>
                    <span className="text-gray-700 font-medium group-hover:text-primary transition-colors">
                      {link.name}
                    </span>
                  </motion.a>
                ))}
              </div>
            </motion.div>
          </motion.div>
        </div>
      </main>

      {/* 管理工具栏 - 仅登录后显示 */}
      <AdminToolbar />
    </div>
  );
};

export default Contact;
