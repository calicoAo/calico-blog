/**
 * 访问分析相关 API
 * 
 * 功能：
 * - 获取访问统计
 * - 获取热门页面
 * - 获取访问趋势
 * 
 * @author lijingru
 * @created 2025-11-13
 */

import axiosInstance, { type ApiResponse } from '@/lib/axios';

/**
 * 访问统计数据
 */
export interface AnalyticsStats {
  date: string;
  visits: number;
  uniqueVisitors: number;
  uniqueSessions: number;
}

/**
 * 热门页面数据
 */
export interface PopularPage {
  path: string;
  visits: number;
  uniqueVisitors: number;
}

/**
 * 总统计数据
 */
export interface TotalStats {
  totalVisits: number;
  uniqueVisitors: number;
  uniqueSessions: number;
}

/**
 * 统计响应数据
 */
export interface AnalyticsResponse {
  stats: AnalyticsStats[];
  popularPages: PopularPage[];
  totals: TotalStats;
}

/**
 * 获取访问统计
 */
export const getAnalyticsStats = async (params?: {
  startDate?: string;
  endDate?: string;
  groupBy?: 'day' | 'hour';
}): Promise<AnalyticsResponse> => {
  const response = await axiosInstance.get<ApiResponse<AnalyticsResponse>>(
    '/analytics/stats',
    { params }
  );
  return response.data.data!;
};

