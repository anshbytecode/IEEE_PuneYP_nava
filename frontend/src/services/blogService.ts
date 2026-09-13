import api from './api';

export interface BlogItem {
  id: string;
  title: string;
  content: string;
  thumbnailUrl: string;
  tags: string[];
  publishStatus: 'Draft' | 'Published';
  authorId?: string;
  author_name?: string;
  author_email?: string;
  createdAt: string;
  updatedAt: string;
}

interface BlogsQuery {
  status?: string;
  search?: string;
  tag?: string;
  page?: number;
  limit?: number;
}

interface BlogsResponse {
  success: boolean;
  blogs: BlogItem[];
  pagination: {
    totalItems: number;
    currentPage: number;
    totalPages: number;
    limit: number;
  };
}

export const blogService = {
  getBlogs: async (params?: BlogsQuery): Promise<BlogsResponse> => {
    const response = await api.get<BlogsResponse>('/blogs', { params });
    return response.data;
  },

  getBlogById: async (id: string): Promise<{ success: boolean; blog: BlogItem }> => {
    const response = await api.get<{ success: boolean; blog: BlogItem }>(`/blogs/${id}`);
    return response.data;
  },

  createBlog: async (formData: FormData): Promise<{ success: boolean; message: string; blog: BlogItem }> => {
    const response = await api.post<{ success: boolean; message: string; blog: BlogItem }>('/blogs', formData, {
      headers: { 'Content-Type': 'multipart/form-data' }
    });
    return response.data;
  },

  updateBlog: async (id: string, formData: FormData): Promise<{ success: boolean; message: string; blog: BlogItem }> => {
    const response = await api.put<{ success: boolean; message: string; blog: BlogItem }>(`/blogs/${id}`, formData, {
      headers: { 'Content-Type': 'multipart/form-data' }
    });
    return response.data;
  },

  deleteBlog: async (id: string): Promise<{ success: boolean; message: string }> => {
    const response = await api.delete<{ success: boolean; message: string }>(`/blogs/${id}`);
    return response.data;
  }
};
