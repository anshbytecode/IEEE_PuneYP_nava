import api from './api';

export interface GrantItem {
  id: string;
  title: string;
  category: string;
  organization: string;
  amount: string;
  year: string;
  status: string;
  badgeColor?: string;
  icon: string;
  description: string;
  impact?: string;
  linkUrl?: string;
  createdAt?: string;
  updatedAt?: string;
}

export const grantService = {
  getGrants: async (category?: string, search?: string): Promise<{ success: boolean; grants: GrantItem[]; count: number }> => {
    const params = new URLSearchParams();
    if (category && category !== 'All') params.append('category', category);
    if (search) params.append('search', search);

    const response = await api.get<{ success: boolean; grants: GrantItem[]; count: number }>(`/grants?${params.toString()}`);
    return response.data;
  },

  getGrantById: async (id: string): Promise<{ success: boolean; grant: GrantItem }> => {
    const response = await api.get<{ success: boolean; grant: GrantItem }>(`/grants/${id}`);
    return response.data;
  },

  createGrant: async (grantData: Partial<GrantItem>): Promise<{ success: boolean; message: string; grant: GrantItem }> => {
    const response = await api.post<{ success: boolean; message: string; grant: GrantItem }>('/grants', grantData);
    return response.data;
  },

  updateGrant: async (id: string, grantData: Partial<GrantItem>): Promise<{ success: boolean; message: string; grant: GrantItem }> => {
    const response = await api.put<{ success: boolean; message: string; grant: GrantItem }>(`/grants/${id}`, grantData);
    return response.data;
  },

  deleteGrant: async (id: string): Promise<{ success: boolean; message: string }> => {
    const response = await api.delete<{ success: boolean; message: string }>(`/grants/${id}`);
    return response.data;
  },
};
