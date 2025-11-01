/**
 * ArticlePublish 页面 - 文章发布管理页
 * 
 * 功能：
 * - 文章标题输入
 * - 文章描述输入
 * - 发布时间选择
 * - 富文本编辑器（TiptapEditor）
 * - 草稿暂存功能
 * - 文章发布功能
 * 
 * @author lijingru
 * @created 2025-10-19
 */

import React, { useState, useEffect } from 'react';
import { TiptapEditor } from '@/components/editor/index';
import { motion } from 'framer-motion';

/**
 * 文章数据类型
 */
interface ArticleFormData {
  /** 文章标题 */
  title: string;
  /** 文章描述 */
  description: string;
  /** 发布时间 */
  publishDate: string;
  /** 文章内容（HTML） */
  content: string;
  /** 文章分类 */
  category: string;
  /** 文章状态：draft | published */
  status: 'draft' | 'published';
}

/**
 * 文章发布页面
 */
const ArticlePublish: React.FC = () => {
  // 表单数据状态
  const [formData, setFormData] = useState<ArticleFormData>({
    title: '',
    description: '',
    publishDate: new Date().toISOString().split('T')[0],
    content: '',
    category: '',
    status: 'draft'
  });

  // 保存状态
  const [isSaving, setIsSaving] = useState(false);
  const [saveMessage, setSaveMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  // 从 localStorage 加载草稿
  useEffect(() => {
    const savedDraft = localStorage.getItem('article_draft');
    if (savedDraft) {
      try {
        const draft = JSON.parse(savedDraft);
        setFormData(draft);
      } catch (error) {
        console.error('Failed to load draft:', error);
      }
    }
  }, []);

  // 自动保存草稿
  useEffect(() => {
    const timer = setTimeout(() => {
      if (formData.title || formData.content) {
        localStorage.setItem('article_draft', JSON.stringify(formData));
      }
    }, 2000);

    return () => clearTimeout(timer);
  }, [formData]);

  // 处理输入变化
  const handleInputChange = (field: keyof ArticleFormData, value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
    setSaveMessage(null);
  };

  // 处理编辑器内容变化
  const handleContentChange = (content: string) => {
    setFormData(prev => ({
      ...prev,
      content
    }));
  };

  // 保存草稿
  const handleSaveDraft = async () => {
    setIsSaving(true);
    setSaveMessage(null);

    try {
      // 验证必填字段
      if (!formData.title.trim()) {
        setSaveMessage({ type: 'error', text: '请填写文章标题' });
        setIsSaving(false);
        return;
      }

      // 保存到 localStorage
      localStorage.setItem('article_draft', JSON.stringify({
        ...formData,
        status: 'draft'
      }));

      // 这里可以调用后端API保存草稿
      // await saveDraftAPI(formData);

      setSaveMessage({ type: 'success', text: '草稿已保存' });
      
      setTimeout(() => {
        setSaveMessage(null);
      }, 3000);
    } catch (error) {
      setSaveMessage({ type: 'error', text: '保存失败，请重试' });
      console.error('Save draft error:', error);
    } finally {
      setIsSaving(false);
    }
  };

  // 发布文章
  const handlePublish = async () => {
    setIsSaving(true);
    setSaveMessage(null);

    try {
      // 验证必填字段
      if (!formData.title.trim()) {
        setSaveMessage({ type: 'error', text: '请填写文章标题' });
        setIsSaving(false);
        return;
      }

      if (!formData.description.trim()) {
        setSaveMessage({ type: 'error', text: '请填写文章描述' });
        setIsSaving(false);
        return;
      }

      if (!formData.content.trim()) {
        setSaveMessage({ type: 'error', text: '请填写文章内容' });
        setIsSaving(false);
        return;
      }

      if (!formData.category.trim()) {
        setSaveMessage({ type: 'error', text: '请选择文章分类' });
        setIsSaving(false);
        return;
      }

      // 这里可以调用后端API发布文章
      // const article = await publishArticleAPI({
      //   ...formData,
      //   status: 'published'
      // });

      // 清除草稿
      localStorage.removeItem('article_draft');

      setSaveMessage({ type: 'success', text: '文章已发布成功！' });

      // 重置表单
      setTimeout(() => {
        setFormData({
          title: '',
          description: '',
          publishDate: new Date().toISOString().split('T')[0],
          content: '',
          category: '',
          status: 'draft'
        });
        setSaveMessage(null);
      }, 2000);

      console.log('Published article:', { ...formData, status: 'published' });
    } catch (error) {
      setSaveMessage({ type: 'error', text: '发布失败，请重试' });
      console.error('Publish error:', error);
    } finally {
      setIsSaving(false);
    }
  };

  // 文章分类选项
  const categories = [
    'Frontend engineering practices',
    'Performance Optimization',
    'React Deep Dive',
    'TypeScript',
    'CSS Layout',
    'Backend Development',
    'Database',
    'Architecture'
  ];

  return (
    <div className="min-h-screen bg-linear-to-tr from-sky-100 via-amber-50 to-slate-100 p-8">
      <div className="max-w-5xl mx-auto">
        {/* 页面标题 */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <h1 className="text-3xl font-bold text-gray-900 mb-2">发布文章</h1>
          <p className="text-gray-600">创建并发布新文章</p>
        </motion.div>

        {/* 消息提示 */}
        {saveMessage && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className={`mb-6 p-4 rounded-lg ${
              saveMessage.type === 'success'
                ? 'bg-green-50 text-green-800 border border-green-200'
                : 'bg-red-50 text-red-800 border border-red-200'
            }`}
          >
            {saveMessage.text}
          </motion.div>
        )}

        {/* 表单区域 */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-white rounded-xl shadow-lg p-6 space-y-6"
        >
          {/* 文章标题 */}
          <div>
            <label htmlFor="title" className="block text-sm font-semibold text-gray-700 mb-2">
              文章标题 <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              id="title"
              value={formData.title}
              onChange={(e) => handleInputChange('title', e.target.value)}
              placeholder="请输入文章标题"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all"
            />
          </div>

          {/* 文章描述 */}
          <div>
            <label htmlFor="description" className="block text-sm font-semibold text-gray-700 mb-2">
              文章描述 <span className="text-red-500">*</span>
            </label>
            <textarea
              id="description"
              value={formData.description}
              onChange={(e) => handleInputChange('description', e.target.value)}
              placeholder="请输入文章描述（简短介绍）"
              rows={3}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all resize-none"
            />
          </div>

          {/* 发布时间和分类 */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label htmlFor="publishDate" className="block text-sm font-semibold text-gray-700 mb-2">
                发布时间 <span className="text-red-500">*</span>
              </label>
              <input
                type="date"
                id="publishDate"
                value={formData.publishDate}
                onChange={(e) => handleInputChange('publishDate', e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all"
              />
            </div>

            <div>
              <label htmlFor="category" className="block text-sm font-semibold text-gray-700 mb-2">
                文章分类 <span className="text-red-500">*</span>
              </label>
              <select
                id="category"
                value={formData.category}
                onChange={(e) => handleInputChange('category', e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all bg-white"
              >
                <option value="">请选择分类</option>
                {categories.map((cat) => (
                  <option key={cat} value={cat}>
                    {cat}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* 富文本编辑器 */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              文章内容 <span className="text-red-500">*</span>
            </label>
            <div className="border border-gray-300 rounded-lg overflow-hidden focus-within:ring-2 focus-within:ring-blue-500 focus-within:border-transparent transition-all">
              <TiptapEditor
                content={formData.content}
                onChange={handleContentChange}
              />
            </div>
          </div>

          {/* 操作按钮 */}
          <div className="flex justify-end gap-4 pt-4 border-t border-gray-200">
            <motion.button
              onClick={handleSaveDraft}
              disabled={isSaving}
              className="px-6 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              {isSaving ? '保存中...' : '保存草稿'}
            </motion.button>

            <motion.button
              onClick={handlePublish}
              disabled={isSaving}
              className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              {isSaving ? '发布中...' : '发布文章'}
            </motion.button>
          </div>
        </motion.div>

        {/* 提示信息 */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
          className="mt-6 p-4 bg-blue-50 border border-blue-200 rounded-lg text-sm text-blue-800"
        >
          <p className="font-semibold mb-1">💡 提示：</p>
          <ul className="list-disc list-inside space-y-1 ml-2">
            <li>草稿会自动保存到本地，刷新页面后仍可恢复</li>
            <li>发布前请确保所有必填字段已填写完整</li>
            <li>文章发布后将自动清除草稿</li>
          </ul>
        </motion.div>
      </div>
    </div>
  );
};

export default ArticlePublish;

