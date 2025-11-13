import React from 'react';
import EditorComponent from '@/components/editor/Editor';
import { motion } from 'framer-motion';

/**
 * TipTap 编辑器测试页面
 * 
 * 用于测试和展示 TipTap 富文本编辑器的功能
 */
const TipTapTest: React.FC = () => {
  return (
    <div className="min-h-screen bg-linear-to-tr from-sky-100 via-amber-50 to-slate-100 p-8">
      <div className="max-w-6xl mx-auto">
        {/* 页面标题 */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <h1 className="text-3xl font-bold text-gray-900 mb-2">TipTap 编辑器测试</h1>
          <p className="text-gray-600">测试富文本编辑器的各项功能</p>
        </motion.div>

        {/* 编辑器区域 */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-white rounded-xl shadow-lg p-6"
        >
          <div className="mb-4">
            <h2 className="text-lg font-semibold text-gray-700 mb-2">编辑器</h2>
            <p className="text-sm text-gray-500">
              使用工具栏按钮格式化文本，支持标题、列表、代码块等功能
            </p>
          </div>
          
          {/* 编辑器组件 */}
          <div className="border border-gray-300 rounded-lg overflow-hidden focus-within:ring-2 focus-within:ring-ring focus-within:border-transparent transition-all">
            <EditorComponent content={""} onChange={() => {}} />
          </div>

          {/* 功能说明 */}
          <div className="mt-6 p-4 bg-primary/10 border border-primary/20 rounded-lg">
            <h3 className="font-semibold text-primary mb-2">✨ 支持的功能：</h3>
            <ul className="list-disc list-inside space-y-1 text-sm text-primary">
              <li>文本格式化：粗体、斜体、删除线、代码</li>
              <li>标题：H1 - H6</li>
              <li>列表：有序列表、无序列表</li>
              <li>代码块：支持语法高亮</li>
              <li>引用块：Blockquote</li>
              <li>对齐方式：文本对齐</li>
              <li>其他：水平线、换行、撤销/重做</li>
            </ul>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default TipTapTest;

