'use client'

/**
 * Analytics 页面 - 访问统计分析
 * 
 * 功能：
 * - 显示访问统计数据
 * - 显示热门页面
 * - 显示访问趋势图表
 * 
 * @author lijingru
 * @created 2025-11-13
 */

import { useState, useEffect, useCallback } from 'react';
import { motion } from 'framer-motion';
import BackToHome from '@/components/ui/BackToHome';
import { getAnalyticsStats, type AnalyticsResponse } from '@/api/analytics';
import { useAuth } from '@/hooks/useAuth';
import { useRouter } from 'next/navigation';

export default function Analytics() {
  const { isAuthenticated, isLoading: authLoading } = useAuth();
  const router = useRouter();
  const [stats, setStats] = useState<AnalyticsResponse | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [dateRange, setDateRange] = useState<{ startDate?: string; endDate?: string }>({});

  const fetchStats = useCallback(async () => {
    try {
      setIsLoading(true);
      const data = await getAnalyticsStats({
        ...dateRange,
        groupBy: 'day'
      });
      setStats(data);
    } catch (error) {
      console.error('获取统计数据失败:', error);
    } finally {
      setIsLoading(false);
    }
  }, [dateRange]);

  useEffect(() => {
    // 等待认证状态检查完成
    if (authLoading) {
      return;
    }

    // 检查是否已登录
    if (!isAuthenticated) {
      router.push('/login');
      return;
    }

    fetchStats();
  }, [isAuthenticated, authLoading, router, fetchStats]);

  // 等待认证状态检查完成
  if (authLoading) {
    return (
      <div className="min-h-screen bg-linear-to-tr from-sky-100 via-amber-50 to-slate-100 flex items-center justify-center">
        <div className="text-gray-500">加载中...</div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return null;
  }

  return (
    <div className="min-h-screen bg-linear-to-tr from-sky-100 via-amber-50 to-slate-100 p-8">
      <div className="max-w-7xl mx-auto">
        <div className="mb-6">
          <BackToHome />
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <h1 className="text-3xl font-bold text-gray-900 mb-2">访问统计分析</h1>
          <p className="text-gray-600">查看网站访问数据和用户行为分析</p>
        </motion.div>

        {/* 日期范围选择 */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-white rounded-xl shadow-lg p-6 mb-6"
        >
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="flex-1">
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                开始日期
              </label>
              <input
                type="date"
                value={dateRange.startDate || ''}
                onChange={(e) => setDateRange(prev => ({ ...prev, startDate: e.target.value }))}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-ring focus:border-transparent outline-none"
              />
            </div>
            <div className="flex-1">
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                结束日期
              </label>
              <input
                type="date"
                value={dateRange.endDate || ''}
                onChange={(e) => setDateRange(prev => ({ ...prev, endDate: e.target.value }))}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-ring focus:border-transparent outline-none"
              />
            </div>
            <div className="flex items-end">
              <button
                onClick={() => setDateRange({})}
                className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
              >
                重置
              </button>
            </div>
          </div>
        </motion.div>

        {isLoading ? (
          <div className="text-center py-12 text-gray-500">加载中...</div>
        ) : stats ? (
          <>
            {/* 总统计卡片 */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                className="bg-white rounded-xl shadow-lg p-6"
              >
                <div className="text-sm text-gray-600 mb-2">总访问量</div>
                <div className="text-3xl font-bold text-gray-900">{stats.totals.totalVisits}</div>
              </motion.div>
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
                className="bg-white rounded-xl shadow-lg p-6"
              >
                <div className="text-sm text-gray-600 mb-2">独立访客</div>
                <div className="text-3xl font-bold text-gray-900">{stats.totals.uniqueVisitors}</div>
              </motion.div>
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 }}
                className="bg-white rounded-xl shadow-lg p-6"
              >
                <div className="text-sm text-gray-600 mb-2">独立会话</div>
                <div className="text-3xl font-bold text-gray-900">{stats.totals.uniqueSessions}</div>
              </motion.div>
            </div>

            {/* 访问趋势 */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 }}
              className="bg-white rounded-xl shadow-lg p-6 mb-6"
            >
              <h2 className="text-xl font-semibold text-gray-900 mb-4">访问趋势</h2>
              {stats.stats.length === 0 ? (
                <div className="text-center py-8 text-gray-500">暂无数据</div>
              ) : (
                <div className="space-y-3">
                  {stats.stats.map((stat, index) => (
                    <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                      <div className="flex-1">
                        <div className="font-medium text-gray-900">{stat.date}</div>
                        <div className="text-sm text-gray-600">
                          访问: {stat.visits} | 访客: {stat.uniqueVisitors} | 会话: {stat.uniqueSessions}
                        </div>
                      </div>
                      <div className="w-32 h-2 bg-gray-200 rounded-full overflow-hidden">
                        <div
                          className="h-full bg-primary rounded-full transition-all"
                          style={{ width: `${(stat.visits / Math.max(...stats.stats.map(s => s.visits))) * 100}%` }}
                        />
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </motion.div>

            {/* 热门页面 */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6 }}
              className="bg-white rounded-xl shadow-lg p-6"
            >
              <h2 className="text-xl font-semibold text-gray-900 mb-4">热门页面</h2>
              {stats.popularPages.length === 0 ? (
                <div className="text-center py-8 text-gray-500">暂无数据</div>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead className="bg-gray-50 border-b border-gray-200">
                      <tr>
                        <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                          页面路径
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                          访问次数
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                          独立访客
                        </th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-200">
                      {stats.popularPages.map((page, index) => (
                        <tr key={index} className="hover:bg-gray-50 transition-colors">
                          <td className="px-6 py-4 text-sm text-gray-900 font-mono">
                            {page.path}
                          </td>
                          <td className="px-6 py-4 text-sm text-gray-700">
                            {page.visits}
                          </td>
                          <td className="px-6 py-4 text-sm text-gray-700">
                            {page.uniqueVisitors}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </motion.div>
          </>
        ) : (
          <div className="text-center py-12 text-gray-500">暂无数据</div>
        )}
      </div>
    </div>
  );
}

