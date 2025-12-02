'use client'
/**
 * AccessLogs 页面 - 访问记录查看页
 * 
 * 功能：
 * - 显示网站访问记录
 * - 访问时间、IP地址、访问页面等信息
 * - 数据筛选和搜索
 * 
 * @author lijingru
 * @created 2025-10-19
 */

import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import BackToHome from '@/components/ui/BackToHome';

/**
 * 访问记录数据类型
 */
interface AccessLog {
  id: number;
  /** 访问时间 */
  timestamp: string;
  /** IP地址 */
  ip: string;
  /** 访问页面 */
  path: string;
  /** 用户代理 */
  userAgent: string;
  /** 访问来源 */
  referer?: string;
}

/**
 * 访问记录页面
 */
const AccessLogs: React.FC = () => {
  const [logs, setLogs] = useState<AccessLog[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');

  // API 基础URL

  // 获取访问记录
  useEffect(() => {
    const fetchLogs = async () => {
      setIsLoading(true);
      try {
        // 这里可以调用后端API获取访问记录
        // const token = localStorage.getItem('auth_token');
        // const response = await fetch(`${API_BASE_URL}/admin/logs`, {
        //   headers: {
        //     'Authorization': `Bearer ${token}`
        //   }
        // });
        // const data = await response.json();
        // setLogs(data);

        // 模拟数据（开发环境）
        const mockLogs: AccessLog[] = [
          {
            id: 1,
            timestamp: new Date().toISOString(),
            ip: '192.168.1.100',
            path: '/',
            userAgent: 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7)',
            referer: 'https://google.com'
          },
          {
            id: 2,
            timestamp: new Date(Date.now() - 3600000).toISOString(),
            ip: '192.168.1.101',
            path: '/article/1',
            userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64)',
          }
        ];
        setLogs(mockLogs);
      } catch (error) {
        console.error('获取访问记录失败:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchLogs();
  }, []);

  // 过滤日志
  const filteredLogs = logs.filter(log =>
    log.path.toLowerCase().includes(searchTerm.toLowerCase()) ||
    log.ip.includes(searchTerm) ||
    log.userAgent.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // 格式化时间
  const formatTime = (timestamp: string) => {
    const date = new Date(timestamp);
    return date.toLocaleString('zh-CN', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit'
    });
  };

  return (
    <div className="min-h-screen bg-linear-to-tr from-sky-100 via-amber-50 to-slate-100 p-8">
      <div className="max-w-6xl mx-auto">
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
          <h1 className="text-3xl font-bold text-gray-900 mb-2">访问记录</h1>
          <p className="text-gray-600">查看网站访问统计和日志</p>
        </motion.div>

        {/* 搜索框 */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="mb-6"
        >
          <input
            type="text"
            placeholder="搜索访问记录（路径、IP、浏览器）..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-ring focus:border-transparent outline-none transition-all"
          />
        </motion.div>

        {/* 统计信息 */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="grid grid-cols-3 gap-4 mb-6"
        >
          <div className="bg-white rounded-lg shadow-md p-4 border border-gray-200">
            <div className="text-sm text-gray-600 mb-1">总访问量</div>
            <div className="text-2xl font-bold text-gray-900">{logs.length}</div>
          </div>
          <div className="bg-white rounded-lg shadow-md p-4 border border-gray-200">
            <div className="text-sm text-gray-600 mb-1">显示记录</div>
            <div className="text-2xl font-bold text-gray-900">{filteredLogs.length}</div>
          </div>
          <div className="bg-white rounded-lg shadow-md p-4 border border-gray-200">
            <div className="text-sm text-gray-600 mb-1">独立IP</div>
            <div className="text-2xl font-bold text-gray-900">
              {new Set(logs.map(log => log.ip)).size}
            </div>
          </div>
        </motion.div>

        {/* 访问记录列表 */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="bg-white rounded-xl shadow-lg border border-gray-200 overflow-hidden"
        >
          {isLoading ? (
            <div className="p-8 text-center text-gray-600">加载中...</div>
          ) : filteredLogs.length === 0 ? (
            <div className="p-8 text-center text-gray-600">暂无访问记录</div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50 border-b border-gray-200">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                      时间
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                      IP地址
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                      访问页面
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                      来源
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                      浏览器
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {filteredLogs.map((log, index) => (
                    <motion.tr
                      key={log.id}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: index * 0.05 }}
                      className="hover:bg-gray-50 transition-colors duration-150"
                    >
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">
                        {formatTime(log.timestamp)}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700 font-mono">
                        {log.ip}
                      </td>
                      <td className="px-6 py-4 text-sm text-primary hover:text-primary/80">
                        <a href={log.path} className="hover:underline">
                          {log.path}
                        </a>
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-700">
                        {log.referer ? (
                          <a
                            href={log.referer}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-primary hover:underline truncate max-w-xs block"
                          >
                            {log.referer}
                          </a>
                        ) : (
                          <span className="text-gray-400">直接访问</span>
                        )}
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-700">
                        <span className="truncate max-w-xs block" title={log.userAgent}>
                          {log.userAgent}
                        </span>
                      </td>
                    </motion.tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </motion.div>
      </div>
    </div>
  );
};

export default AccessLogs;

