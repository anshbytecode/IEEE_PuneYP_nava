import api from './api';

export interface AnnouncementItem {
  id: string;
  title: string;
  content: string;
  link?: string;
  isActive: boolean;
  is_active?: boolean;
  createdAt: string;
  updatedAt: string;
}

export const announcementService = {
  getAnnouncements: async (): Promise<{ success: boolean; announcements: AnnouncementItem[] }> => {
    const response = await api.get<{ success: boolean; announcements: AnnouncementItem[] }>('/announcements');
    return response.data;
  },

  createAnnouncement: async (announcement: Partial<AnnouncementItem>): Promise<{ success: boolean; announcement: AnnouncementItem }> => {
    const response = await api.post<{ success: boolean; announcement: AnnouncementItem }>('/announcements', announcement);
    return response.data;
  },

  updateAnnouncement: async (id: string, announcement: Partial<AnnouncementItem>): Promise<{ success: boolean; announcement: AnnouncementItem }> => {
    const response = await api.put<{ success: boolean; announcement: AnnouncementItem }>(`/announcements/${id}`, announcement);
    return response.data;
  },

  deleteAnnouncement: async (id: string): Promise<{ success: boolean; message: string }> => {
    const response = await api.delete<{ success: boolean; message: string }>(`/announcements/${id}`);
    return response.data;
  }
};
