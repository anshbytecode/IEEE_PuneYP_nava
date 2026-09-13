import api from './api';

export interface MediaItem {
  id: string;
  fileName: string;
  fileUrl: string;
  fileType: 'image' | 'video' | 'pdf';
  fileSize: number;
  cloudinaryPublicId: string;
  eventId?: string;
  event_title?: string;
  createdAt: string;
  updatedAt: string;
}

interface MediaQuery {
  event_id?: string;
  file_type?: string;
  search?: string;
  page?: number;
  limit?: number;
}

interface MediaResponse {
  success: boolean;
  media: MediaItem[];
  pagination: {
    totalItems: number;
    currentPage: number;
    totalPages: number;
    limit: number;
  };
}

export const mediaService = {
  getMedia: async (params?: MediaQuery): Promise<MediaResponse> => {
    const response = await api.get<MediaResponse>('/media', { params });
    return response.data;
  },

  uploadMedia: async (formData: FormData): Promise<{ success: boolean; message: string; mediaItem: MediaItem }> => {
    const response = await api.post<{ success: boolean; message: string; mediaItem: MediaItem }>('/media/upload', formData, {
      headers: { 'Content-Type': 'multipart/form-data' }
    });
    return response.data;
  },

  deleteMedia: async (id: string): Promise<{ success: boolean; message: string }> => {
    const response = await api.delete<{ success: boolean; message: string }>(`/media/${id}`);
    return response.data;
  }
};
