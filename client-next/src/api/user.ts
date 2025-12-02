/**
 * 用户相关 API
 * 
 * 功能：
 * - 获取用户资料
 * - 更新用户资料
 * - 获取用户的博客列表
 * - 获取用户列表（管理员）
 * - 更新用户状态（管理员）
 * - 更新用户角色（管理员）
 * - 删除用户（管理员）
 * 
 * @author lijingru
 * @created 2025-11-13
 */

import axiosInstance, { type ApiResponse } from '@/lib/axios';
import type { PaginationData, Blog } from './blog';

/**
 * 用户资料
 */
export interface UserProfile {
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
 * 用户资料及统计
 */
export interface UserProfileWithStats {
  user: UserProfile;
  stats: {
    published: number;
    draft: number;
    archived: number;
    totalViews: number;
  };
}

/**
 * 更新用户资料参数
 */
export interface UpdateProfileParams {
  username?: string;
  bio?: string;
  avatar?: string;
}

/**
 * 用户列表查询参数
 */
export interface UserListParams {
  page?: number;
  limit?: number;
  search?: string;
  role?: string;
  isActive?: boolean;
}

/**
 * 用户列表响应
 */
export interface UserListResponse extends PaginationData<UserProfile> {}

/**
 * 获取用户资料
 */
export const getUserProfile = async (
  id: string
): Promise<UserProfileWithStats> => {
  const response = await axiosInstance.get<
    ApiResponse<UserProfileWithStats>
  >(`/user/profile/${id}`);
  return response.data.data!;
};

/**
 * 更新用户资料
 */
export const updateProfile = async (
  params: UpdateProfileParams
): Promise<UserProfile> => {
  const response = await axiosInstance.put<ApiResponse<UserProfile>>(
    '/user/profile',
    params
  );
  return response.data.data!;
};

/**
 * 获取用户的博客列表
 */
export const getUserBlogs = async (
  userId: string,
  params?: {
    page?: number;
    limit?: number;
    status?: string;
  }
): Promise<PaginationData<Blog>> => {
  const response = await axiosInstance.get<ApiResponse<{ blogs: Blog[]; pagination: any }>>(
    `/user/${userId}/blogs`,
    { params }
  );
  return {
    data: response.data.data!.blogs,
    pagination: response.data.data!.pagination
  };
};

/**
 * 获取用户列表（管理员）
 */
export const getUserList = async (
  params?: UserListParams
): Promise<UserListResponse> => {
  const response = await axiosInstance.get<ApiResponse<{ users: UserProfile[]; pagination: any }>>(
    '/user',
    { params }
  );
  return {
    data: response.data.data!.users,
    pagination: response.data.data!.pagination
  };
};

/**
 * 更新用户状态参数
 */
export interface UpdateUserStatusParams {
  isActive: boolean;
}

/**
 * 更新用户状态（管理员）
 */
export const updateUserStatus = async (
  id: string,
  params: UpdateUserStatusParams
): Promise<UserProfile> => {
  const response = await axiosInstance.put<ApiResponse<UserProfile>>(
    `/user/${id}/status`,
    params
  );
  return response.data.data!;
};

/**
 * 更新用户角色参数
 */
export interface UpdateUserRoleParams {
  role: 'user' | 'admin';
}

/**
 * 更新用户角色（管理员）
 */
export const updateUserRole = async (
  id: string,
  params: UpdateUserRoleParams
): Promise<UserProfile> => {
  const response = await axiosInstance.put<ApiResponse<UserProfile>>(
    `/user/${id}/role`,
    params
  );
  return response.data.data!;
};

/**
 * 删除用户（管理员）
 */
export const deleteUser = async (id: string): Promise<void> => {
  await axiosInstance.delete<ApiResponse>(`/user/${id}`);
};

