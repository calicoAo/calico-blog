/**
 * 博客相关 API
 * 
 * 功能：
 * - 获取博客列表
 * - 获取博客详情
 * - 创建博客
 * - 更新博客
 * - 删除博客
 * - 点赞/取消点赞
 * - 添加评论
 * - 获取统计信息
 * 
 * @author lijingru
 * @created 2025-11-13
 */

import axiosInstance, { type ApiResponse } from '@/lib/axios';

/**
 * 博客列表查询参数
 */
export interface BlogListParams {
  page?: number;
  limit?: number;
  status?: 'published' | 'draft' | 'archived' | 'all';
  category?: string;
  tag?: string;
  search?: string;
  author?: string;
}

/**
 * 博客数据
 */
export interface Blog {
  _id: string;
  title: string;
  content: string;
  excerpt?: string;
  coverImage?: string;
  category: string;
  tags: string[];
  status: 'published' | 'draft' | 'archived';
  author: {
    _id: string;
    username: string;
    avatar?: string;
  };
  views: number;
  likes: string[];
  comments: Array<{
    _id: string;
    user: {
      _id: string;
      username: string;
      avatar?: string;
    };
    content: string;
    createdAt: string;
  }>;
  publishedAt?: string;
  createdAt: string;
  updatedAt: string;
}

/**
 * 创建/更新博客参数
 */
export interface BlogParams {
  title: string;
  content: string;
  excerpt?: string;
  coverImage?: string;
  category: string;
  tags?: string[];
  status?: 'published' | 'draft' | 'archived';
}

/**
 * 分页数据
 */
export interface PaginationData<T> {
  data: T[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    pages: number;
  };
}

/**
 * 博客列表响应
 */
export interface BlogListResponse extends PaginationData<Blog> {}

/**
 * 获取博客列表
 */
export const getBlogList = async (
  params?: BlogListParams
): Promise<BlogListResponse> => {
  const response = await axiosInstance.get<ApiResponse<{ blogs: Blog[]; pagination: any }>>(
    '/blog',
    { params }
  );
  return {
    data: response.data.data!.blogs,
    pagination: response.data.data!.pagination
  };
};

/**
 * 获取博客详情
 */
export const getBlogDetail = async (id: string): Promise<Blog> => {
  const response = await axiosInstance.get<ApiResponse<Blog>>(`/blog/${id}`);
  return response.data.data!;
};

/**
 * 创建博客
 */
export const createBlog = async (params: BlogParams): Promise<Blog> => {
  const response = await axiosInstance.post<ApiResponse<Blog>>(
    '/blog',
    params
  );
  return response.data.data!;
};

/**
 * 更新博客
 */
export const updateBlog = async (
  id: string,
  params: Partial<BlogParams>
): Promise<Blog> => {
  const response = await axiosInstance.put<ApiResponse<Blog>>(
    `/blog/${id}`,
    params
  );
  return response.data.data!;
};

/**
 * 删除博客
 */
export const deleteBlog = async (id: string): Promise<void> => {
  await axiosInstance.delete<ApiResponse>(`/blog/${id}`);
};

/**
 * 点赞/取消点赞博客
 */
export const toggleLikeBlog = async (
  id: string
): Promise<{ liked: boolean }> => {
  const response = await axiosInstance.post<ApiResponse<{ liked: boolean }>>(
    `/blog/${id}/like`
  );
  return response.data.data!;
};

/**
 * 添加评论参数
 */
export interface AddCommentParams {
  content: string;
}

/**
 * 评论数据
 */
export interface Comment {
  _id: string;
  user: {
    _id: string;
    username: string;
    avatar?: string;
  };
  content: string;
  createdAt: string;
}

/**
 * 添加评论
 */
export const addComment = async (
  id: string,
  params: AddCommentParams
): Promise<Comment> => {
  const response = await axiosInstance.post<ApiResponse<Comment>>(
    `/blog/${id}/comments`,
    params
  );
  return response.data.data!;
};

/**
 * 博客统计信息
 */
export interface BlogStats {
  totalBlogs: number;
  totalViews: number;
  popularTags: Array<{
    _id: string;
    count: number;
  }>;
}

/**
 * 获取博客统计信息
 */
export const getBlogStats = async (): Promise<BlogStats> => {
  const response = await axiosInstance.get<ApiResponse<BlogStats>>(
    '/blog/stats/overview'
  );
  return response.data.data!;
};

