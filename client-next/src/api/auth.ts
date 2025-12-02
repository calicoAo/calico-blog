/**
 * 认证相关 API
 * 
 * 功能：
 * - 用户登录
 * - 获取当前用户信息
 * - 刷新 token
 * - 用户登出
 * 
 * @author lijingru
 * @created 2025-11-13
 */

import axiosInstance, { type ApiResponse } from '@/lib/axios';
import { encryptPasswordWithTranskey } from '@/lib/crypto';

/**
 * 登录请求参数
 */
export interface LoginParams {
  email: string;
  password: string;
}

/**
 * 登录响应数据
 */
export interface LoginResponse {
  accessToken: string;
  refreshToken: string;
  user: {
    _id: string;
    username: string;
    email: string;
    role: string;
    avatar?: string;
    bio?: string;
  };
}

/**
 * 用户信息
 */
export interface UserInfo {
  _id: string;
  username: string;
  email: string;
  role: string;
  avatar?: string;
  bio?: string;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

/**
 * 获取临时密钥
 */
export const getTranskey = async (): Promise<{ transkey: string }> => {
  const response = await axiosInstance.get<ApiResponse<{ transkey: string }>>(
    '/auth/transkey'
  );
  
  if (response.data.data) {
    return response.data.data;
  }
  
  throw new Error(response.data.msg || '获取临时密钥失败');
};

/**
 * 用户登录（使用临时密钥）
 */
export const login = async (params: LoginParams): Promise<LoginResponse> => {
  // 1. 先获取临时密钥
  const { transkey } = await getTranskey();
  
  // 2. 使用临时密钥加密密码
  const encryptedPassword = encryptPasswordWithTranskey(params.password, transkey);
  
  // 开发环境：输出密码对比信息
  if (process.env.NODE_ENV === 'development') {
    console.log('🔐 [前端] 密码加密信息:');
    console.log('  原始密码:', params.password);
    console.log('  临时密钥:', transkey.substring(0, 16) + '...' + transkey.substring(transkey.length - 8));
    console.log('  加密后密码:', encryptedPassword.substring(0, 50) + '...');
    console.log('  加密后密码长度:', encryptedPassword.length);
  }
  
  // 3. 发送加密后的密码和临时密钥
  const response = await axiosInstance.post<ApiResponse<LoginResponse>>(
    '/auth/login',
    {
      email: params.email,
      encryptedPassword: encryptedPassword,
      transkey: transkey
    }
  );
  
  // 后端返回格式: { code, msg, data: { accessToken, refreshToken, user } }
  if (response.data.data) {
    return response.data.data;
  }
  
  throw new Error(response.data.msg || '登录响应格式错误');
};

/**
 * 获取当前用户信息
 */
export const getCurrentUser = async (): Promise<UserInfo> => {
  const response = await axiosInstance.get<ApiResponse<{ user: UserInfo }>>(
    '/auth/me'
  );
  return response.data.data!.user;
};

/**
 * 刷新 token
 */
export const refreshToken = async (refreshTokenValue: string): Promise<{ accessToken: string }> => {
  const response = await axiosInstance.post<ApiResponse<{ accessToken: string }>>(
    '/auth/refresh',
    { refreshToken: refreshTokenValue }
  );
  return response.data.data!;
};

/**
 * 用户登出
 */
export const logout = async (): Promise<void> => {
  await axiosInstance.post<ApiResponse>('/auth/logout');
};

