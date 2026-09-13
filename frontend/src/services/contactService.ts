import api from './api';

export interface ContactItem {
  id: string;
  name: string;
  email: string;
  subject?: string;
  message: string;
  isResolved: boolean;
  createdAt: string;
  updatedAt: string;
}

interface ContactsQuery {
  is_resolved?: string;
  page?: number;
  limit?: number;
}

interface ContactsResponse {
  success: boolean;
  contacts: ContactItem[];
  pagination: {
    totalItems: number;
    currentPage: number;
    totalPages: number;
    limit: number;
  };
}

export const contactService = {
  getContacts: async (params?: ContactsQuery): Promise<ContactsResponse> => {
    const response = await api.get<ContactsResponse>('/contacts', { params });
    return response.data;
  },

  resolveContact: async (id: string): Promise<{ success: boolean; contact: ContactItem }> => {
    const response = await api.put<{ success: boolean; contact: ContactItem }>(`/contacts/${id}/resolve`);
    return response.data;
  },

  submitContact: async (data: { name: string; email: string; subject?: string; message: string }): Promise<{ success: boolean; message: string }> => {
    const response = await api.post<{ success: boolean; message: string }>('/contacts', data);
    return response.data;
  }
};
