import api from './api';

export interface TeamMemberItem {
  id: string;
  name: string;
  position: string;
  affiliation?: string;
  contact?: string;
  profileImageUrl: string;
  linkedinUrl?: string;
  orderIndex: number;
  createdAt: string;
  updatedAt: string;
}

export interface ChairMessageItem {
  name: string;
  position: string;
  affiliation: string;
  photoUrl: string;
  title: string;
  message: string;
  linkedinUrl?: string;
  email?: string;
}

export const teamService = {
  getTeam: async (): Promise<{ success: boolean; teamMembers: TeamMemberItem[] }> => {
    const response = await api.get<{ success: boolean; teamMembers: TeamMemberItem[] }>('/team');
    return response.data;
  },

  createMember: async (formData: FormData): Promise<{ success: boolean; message: string; teamMember: TeamMemberItem }> => {
    const response = await api.post<{ success: boolean; message: string; teamMember: TeamMemberItem }>('/team', formData, {
      headers: { 'Content-Type': 'multipart/form-data' }
    });
    return response.data;
  },

  updateMember: async (id: string, formData: FormData): Promise<{ success: boolean; message: string; teamMember: TeamMemberItem }> => {
    const response = await api.put<{ success: boolean; message: string; teamMember: TeamMemberItem }>(`/team/${id}`, formData, {
      headers: { 'Content-Type': 'multipart/form-data' }
    });
    return response.data;
  },

  deleteMember: async (id: string): Promise<{ success: boolean; message: string }> => {
    const response = await api.delete<{ success: boolean; message: string }>(`/team/${id}`);
    return response.data;
  },

  reorderTeam: async (orders: { id: string; order_index: number }[]): Promise<{ success: boolean; message: string }> => {
    const response = await api.put<{ success: boolean; message: string }>('/team/reorder', { orders });
    return response.data;
  },

  getChairMessage: async (): Promise<{ success: boolean; chairMessage: ChairMessageItem }> => {
    const response = await api.get<{ success: boolean; chairMessage: ChairMessageItem }>('/team/chair-message');
    return response.data;
  },

  updateChairMessage: async (data: Partial<ChairMessageItem>): Promise<{ success: boolean; message: string; chairMessage: ChairMessageItem }> => {
    const response = await api.put<{ success: boolean; message: string; chairMessage: ChairMessageItem }>('/team/chair-message', data);
    return response.data;
  }
};
