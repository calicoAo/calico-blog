'use client'
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
import { useRouter } from 'next/navigation';
import EditorComponent from '@/components/editor/Editor';
import { motion } from 'framer-motion';
import BackToHome from '@/components/ui/BackToHome';
import Toast from '@/components/ui/Toast';
import { createBlog } from '@/api/blog';

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
  const router = useRouter();
  
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

  // 分类管理状态
  const [categories, setCategories] = useState<string[]>([
    'Frontend engineering practices',
    'Performance Optimization',
    'React Deep Dive',
    'TypeScript',
    'CSS Layout',
    'Backend Development',
    'Database',
    'Architecture'
  ]);
  const [showCategoryManager, setShowCategoryManager] = useState(false);
  const [newCategory, setNewCategory] = useState('');

  // 从 localStorage 加载分类
  useEffect(() => {
    const savedCategories = localStorage.getItem('article_categories');
    if (savedCategories) {
      try {
        const parsed = JSON.parse(savedCategories);
        if (Array.isArray(parsed) && parsed.length > 0) {
          setCategories(parsed);
        }
      } catch (error) {
        console.error('Failed to load categories:', error);
      }
    }
  }, []);

  // 保存分类到 localStorage
  useEffect(() => {
    localStorage.setItem('article_categories', JSON.stringify(categories));
  }, [categories]);

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
  // const handleContentChange = (content: string) => {
  //   setFormData(prev => ({
  //     ...prev,
  //     content
  //   }));
  // };

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
  const handleContentChange = (content: string) => {
    console.log('content', content);
    setFormData(prev => ({
      ...prev,
      content
    }));
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
      
      // 调用后端API发布文章
      await createBlog({
        title: formData.title,
        content: formData.content,
        excerpt: formData.description,
        category: formData.category,
        status: 'published',
        tags: []
      });

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
        // 跳转到文章列表页面
        router.push('/articles');
      }, 2000);
    } catch (error) {
      setSaveMessage({ type: 'error', text: '发布失败，请重试' });
      console.error('Publish error:', error);
    } finally {
      setIsSaving(false);
    }
  };

  // 添加分类
  const handleAddCategory = () => {
    const trimmed = newCategory.trim();
    if (!trimmed) {
      setSaveMessage({ type: 'error', text: '分类名称不能为空' });
      return;
    }
    if (categories.includes(trimmed)) {
      setSaveMessage({ type: 'error', text: '该分类已存在' });
      return;
    }
    setCategories([...categories, trimmed]);
    setNewCategory('');
    setSaveMessage({ type: 'success', text: '分类添加成功' });
    setTimeout(() => setSaveMessage(null), 2000);
  };

  // 删除分类
  const handleDeleteCategory = (categoryToDelete: string) => {
    if (formData.category === categoryToDelete) {
      setFormData(prev => ({ ...prev, category: '' }));
    }
    setCategories(categories.filter(cat => cat !== categoryToDelete));
    setSaveMessage({ type: 'success', text: '分类删除成功' });
    setTimeout(() => setSaveMessage(null), 2000);
  };

  return (
    <div className="min-h-screen bg-linear-to-tr from-sky-100 via-amber-50 to-slate-100 p-8">
      <div className="max-w-5xl mx-auto">
        {/* 返回首页按钮 */}
        <div className="mb-6">
          <BackToHome />
        </div>

        {/* 页面标题 */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <h3 className="text-3xl font-bold text-gray-900 mb-2">发布文章</h3>
          <p className="text-gray-600">创建并发布新文章</p>
        </motion.div>

        {/* 消息提示 - 浮动在页面最上方 */}
        <Toast
          type={saveMessage?.type || 'info'}
          message={saveMessage?.text || ''}
          visible={!!saveMessage}
          duration={3000}
          onClose={() => setSaveMessage(null)}
        />

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
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-ring focus:border-transparent outline-none transition-all"
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
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-ring focus:border-transparent outline-none transition-all resize-none"
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
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-ring focus:border-transparent outline-none transition-all"
              />
            </div>

            <div>
              <div className="flex items-center justify-between mb-2">
                <label htmlFor="category" className="block text-sm font-semibold text-gray-700">
                  文章分类 <span className="text-red-500">*</span>
                </label>
                <button
                  type="button"
                  onClick={() => setShowCategoryManager(!showCategoryManager)}
                  className="text-xs text-primary hover:text-primary/80 underline"
                >
                  {showCategoryManager ? '收起管理' : '管理分类'}
                </button>
              </div>
              <select
                id="category"
                value={formData.category}
                onChange={(e) => handleInputChange('category', e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-ring focus:border-transparent outline-none transition-all bg-white"
              >
                <option value="">请选择分类</option>
                {categories.map((cat) => (
                  <option key={cat} value={cat}>
                    {cat}
                  </option>
                ))}
              </select>
              
              {/* 分类管理面板 */}
              {showCategoryManager && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  exit={{ opacity: 0, height: 0 }}
                  className="mt-3 p-4 bg-gray-50 border border-gray-200 rounded-lg"
                >
                  <h4 className="text-sm font-semibold text-gray-700 mb-3">分类管理</h4>
                  
                  {/* 添加新分类 */}
                  <div className="flex gap-2 mb-4">
                    <input
                      type="text"
                      value={newCategory}
                      onChange={(e) => setNewCategory(e.target.value)}
                      onKeyDown={(e) => e.key === 'Enter' && handleAddCategory()}
                      placeholder="输入新分类名称"
                      className="flex-1 px-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-ring focus:border-transparent outline-none"
                    />
                    <motion.button
                      type="button"
                      onClick={handleAddCategory}
                      className="px-4 py-2 text-sm bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors"
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                    >
                      添加
                    </motion.button>
                  </div>

                  {/* 分类列表 */}
                  <div className="space-y-2">
                    <p className="text-xs text-gray-600 mb-2">现有分类：</p>
                    <div className="flex flex-wrap gap-2">
                      {categories.map((cat) => (
                        <motion.div
                          key={cat}
                          initial={{ opacity: 0, scale: 0.9 }}
                          animate={{ opacity: 1, scale: 1 }}
                          className="flex items-center gap-2 px-3 py-1.5 bg-white border border-gray-300 rounded-lg text-sm"
                        >
                          <span className="text-gray-700">{cat}</span>
                          <button
                            type="button"
                            onClick={() => handleDeleteCategory(cat)}
                            className="text-red-500 hover:text-red-700 transition-colors"
                            title="删除分类"
                          >
                            <svg
                              xmlns="http://www.w3.org/2000/svg"
                              className="h-4 w-4"
                              fill="none"
                              viewBox="0 0 24 24"
                              stroke="currentColor"
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M6 18L18 6M6 6l12 12"
                              />
                            </svg>
                          </button>
                        </motion.div>
                      ))}
                    </div>
                    {categories.length === 0 && (
                      <p className="text-xs text-gray-500 text-center py-2">暂无分类，请添加新分类</p>
                    )}
                  </div>
                </motion.div>
              )}
            </div>
          </div>

          {/* 富文本编辑器 */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              文章内容 <span className="text-red-500">*</span>
            </label>
            <div className="border border-gray-300 rounded-lg overflow-hidden focus-within:ring-2 focus-within:ring-ring focus-within:border-transparent transition-all">
              <EditorComponent
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
              className="px-6 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
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
          className="mt-6 p-4 bg-primary/10 border border-primary/20 rounded-lg text-sm text-primary"
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

