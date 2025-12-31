/**
 * Axios 实例配置
 * 
 * 功能：
 * - 创建统一的 axios 实例
 * - 配置请求和响应拦截器
 * - 自动添加 token 到请求头
 * - 统一错误处理
 * 
 * @author lijingru
 * @created 2025-11-13
 */

import axios from 'axios';
import type {
  AxiosError,
  AxiosResponse,
  InternalAxiosRequestConfig
} from 'axios';

/**
 * API 响应数据结构（标准格式）
 */
export interface ApiResponse<T = unknown> {
  code: number;    // HTTP 状态码
  msg: string;     // 响应消息
  data?: T;        // 响应数据
}

/**
 * 获取 API 基础 URL
 */
const getBaseURL = () => {
  // 客户端环境
  if (typeof window !== 'undefined') {
    const baseURL = process.env.NEXT_PUBLIC_API_BASE_URL || '/api';
    // 如果是绝对 URL，确保以 /api 结尾；如果是相对路径，直接返回
    if (baseURL.startsWith('http')) {
      // 绝对 URL，确保以 /api 结尾
      return baseURL.endsWith('/api') ? baseURL : `${baseURL.replace(/\/$/, '')}/api`;
    }
    // 相对路径，直接返回（应该已经是 /api）
    return baseURL;
  }
  // 服务端环境
  return process.env.API_BASE_URL || 'http://127.0.0.1:3001/api';
};

/**
 * 创建 axios 实例
 */
const axiosInstance = axios.create({
  baseURL: getBaseURL(),
  timeout: 30000, // 增加到 30 秒，登录接口可能需要更长时间（密码解密、数据库查询等）
  headers: {
    'Content-Type': 'application/json'
  }
});

/**
 * 请求拦截器
 * - 自动添加 token 到请求头
 */
axiosInstance.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    // 只在客户端环境访问 localStorage
    if (typeof window !== 'undefined') {
      const token = localStorage.getItem('auth_token');
      if (token && config.headers) {
        config.headers.Authorization = `Bearer ${token}`;
      }
    }
    return config;
  },
  (error: AxiosError) => {
    return Promise.reject(error);
  }
);

// 是否正在刷新 token（防止并发请求导致多次刷新）
let isRefreshing = false;
// 等待刷新完成的请求队列
let failedQueue: Array<{
  resolve: (value?: unknown) => void;
  reject: (reason?: unknown) => void;
}> = [];

// 处理队列中的请求
const processQueue = (error: Error | null, token: string | null = null) => {
  failedQueue.forEach((prom) => {
    if (error) {
      prom.reject(error);
    } else {
      prom.resolve(token);
    }
  });
  
  failedQueue = [];
};

/**
 * 响应拦截器
 * - 统一处理响应数据
 * - 自动刷新 token
 * - 统一错误处理
 */
axiosInstance.interceptors.response.use(
  (response: AxiosResponse<ApiResponse>) => {
    // 检查响应格式，如果 code 不是 200-299，视为错误
    if (response.data.code && (response.data.code < 200 || response.data.code >= 300)) {
      const error = new Error(response.data.msg || '请求失败');
      (error as any).response = {
        ...response,
        status: response.data.code,
        data: response.data
      };
      return Promise.reject(error);
    }
    // 直接返回响应数据
    return response;
  },
  async (error: AxiosError<ApiResponse>) => {
    const originalRequest = error.config as InternalAxiosRequestConfig & { _retry?: boolean };
    
    if (error.response) {
      const { status, data } = error.response;
      
      // 401 未授权，尝试刷新 token（仅在客户端环境）
      if (status === 401 && originalRequest && !originalRequest._retry && typeof window !== 'undefined') {
        if (isRefreshing) {
          // 如果正在刷新，将请求加入队列
          return new Promise((resolve, reject) => {
            failedQueue.push({ resolve, reject });
          })
            .then((token) => {
              if (originalRequest.headers) {
                originalRequest.headers.Authorization = `Bearer ${token}`;
              }
              return axiosInstance(originalRequest);
            })
            .catch((err) => {
              return Promise.reject(err);
            });
        }

        originalRequest._retry = true;
        isRefreshing = true;

        const refreshTokenValue = localStorage.getItem('refresh_token');
        
        if (!refreshTokenValue) {
          // 没有 refresh token，清除所有 token 并跳转登录
          localStorage.removeItem('auth_token');
          localStorage.removeItem('refresh_token');
          processQueue(new Error('未授权，请重新登录'), null);
          isRefreshing = false;
          
          if (window.location.pathname !== '/login') {
            window.location.href = '/login';
          }
          return Promise.reject(new Error('未授权，请重新登录'));
        }

        try {
          // 动态导入 refreshToken 函数（避免循环依赖）
          const { refreshToken } = await import('@/api');
          const { accessToken } = await refreshToken(refreshTokenValue);
          
          // 保存新的 access token
          localStorage.setItem('auth_token', accessToken);
          
          // 更新请求头
          if (originalRequest.headers) {
            originalRequest.headers.Authorization = `Bearer ${accessToken}`;
          }
          
          // 处理队列中的请求
          processQueue(null, accessToken);
          isRefreshing = false;
          
          // 重试原始请求
          return axiosInstance(originalRequest);
        } catch {
          // 刷新失败，清除所有 token 并跳转登录
          localStorage.removeItem('auth_token');
          localStorage.removeItem('refresh_token');
          processQueue(new Error('Token 刷新失败，请重新登录'), null);
          isRefreshing = false;
          
          if (window.location.pathname !== '/login') {
            window.location.href = '/login';
          }
          return Promise.reject(new Error('Token 刷新失败，请重新登录'));
        }
      }
      
      // 提取错误消息
      const errorMsg = data?.msg || '请求失败';
      
      // 403 禁止访问
      if (status === 403) {
        return Promise.reject(new Error(errorMsg));
      }
      
      // 404 资源不存在
      if (status === 404) {
        return Promise.reject(new Error(errorMsg));
      }
      
      // 500 服务器错误
      if (status === 500) {
        return Promise.reject(new Error(errorMsg));
      }
      
      // 其他错误
      return Promise.reject(new Error(errorMsg));
    } else if (error.request) {
      // 请求已发出但没有收到响应
      // 可能是超时、网络问题或服务器无响应
      const isTimeout = error.code === 'ECONNABORTED' || error.message?.includes('timeout');
      if (isTimeout) {
        return Promise.reject(new Error('请求超时，请稍后重试'));
      }
      return Promise.reject(new Error('网络错误，请检查网络连接'));
    } else {
      // 请求配置错误
      return Promise.reject(new Error('请求配置错误'));
    }
  }
);

export default axiosInstance;

