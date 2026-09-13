import api from './api';

export interface SubscriberItem {
  id: string;
  email: string;
  subscribedAt: string;
}

interface SubscribersQuery {
  page?: number;
  limit?: number;
}

interface SubscribersResponse {
  success: boolean;
  subscribers: SubscriberItem[];
  pagination: {
    totalItems: number;
    currentPage: number;
    totalPages: number;
    limit: number;
  };
}

export const newsletterService = {
  getSubscribers: async (params?: SubscribersQuery): Promise<SubscribersResponse> => {
    const response = await api.get<SubscribersResponse>('/newsletter', { params });
    return response.data;
  },

  exportCSV: async (): Promise<Blob> => {
    const response = await api.get('/newsletter/export', {
      responseType: 'blob'
    });
    return response.data;
  },

  subscribe: async (email: string): Promise<{ success: boolean; message: string }> => {
    const response = await api.post<{ success: boolean; message: string }>('/newsletter/subscribe', { email });
    return response.data;
  }
};
