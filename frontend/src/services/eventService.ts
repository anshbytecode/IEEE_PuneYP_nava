import api from './api';

export interface EventOrganization {
  spoid?: string;
  name?: string;
  relationship?: string;
  confidence?: number;
}

export interface EventItem {
  id: string;
  vtoolsId?: string;
  title: string;
  shortDescription: string;
  fullDescription: string;
  bannerUrl: string;
  galleryUrls: string[];
  videoUrl?: string;
  eventDate: string;
  venue: string;
  registrationLink?: string;
  sdgAlignment: string[];
  category: string;
  status: 'Upcoming' | 'Completed';
  isDeleted: boolean;
  createdAt: string;
  updatedAt: string;
  registration_count?: number;
  isYpPune?: boolean;
  spoids?: string[];
  organizations?: EventOrganization[];
}

interface EventsQuery {
  category?: string;
  status?: string;
  search?: string;
  spoid?: string;
  page?: number;
  limit?: number;
}

interface EventsResponse {
  success: boolean;
  events: EventItem[];
  pagination: {
    totalItems: number;
    currentPage: number;
    totalPages: number;
    limit: number;
  };
}

export const eventService = {
  getEvents: async (params?: EventsQuery): Promise<EventsResponse> => {
    try {
      const response = await api.get<EventsResponse>('/events', { params: { limit: 500, ...params } });
      if (response.data && response.data.events && response.data.events.length > 0) {
        // Cache authentic backend events in localStorage for offline availability
        try {
          localStorage.setItem('ieee_yp_cached_events', JSON.stringify(response.data.events));
        } catch {
          // Ignore storage quota errors
        }
        return response.data;
      }
      return response.data;
    } catch (err) {
      console.warn('[eventService] Backend server unreachable. Retrieving cached authentic events:', err);
      
      // Retrieve authentic previously synced events from localStorage cache
      let cachedEvents: EventItem[] = [];
      try {
        const stored = localStorage.getItem('ieee_yp_cached_events');
        if (stored) {
          cachedEvents = JSON.parse(stored);
        }
      } catch {
        cachedEvents = [];
      }

      // Apply client-side parameter filtering if offline
      let filtered = [...cachedEvents];
      if (params?.category && params.category !== 'All') {
        filtered = filtered.filter(e => e.category.toLowerCase() === params.category!.toLowerCase());
      }
      if (params?.status && params.status !== 'all') {
        filtered = filtered.filter(e => e.status.toLowerCase() === params.status!.toLowerCase());
      }
      if (params?.search) {
        const q = params.search.toLowerCase();
        filtered = filtered.filter(e =>
          e.title.toLowerCase().includes(q) ||
          e.shortDescription.toLowerCase().includes(q) ||
          e.venue.toLowerCase().includes(q)
        );
      }

      return {
        success: true,
        events: filtered,
        pagination: {
          totalItems: filtered.length,
          currentPage: params?.page || 1,
          totalPages: 1,
          limit: params?.limit || 500
        }
      };
    }
  },

  getEventById: async (id: string): Promise<{ success: boolean; event: EventItem }> => {
    try {
      const response = await api.get<{ success: boolean; event: EventItem }>(`/events/${id}`);
      return response.data;
    } catch {
      let cachedEvents: EventItem[] = [];
      try {
        const stored = localStorage.getItem('ieee_yp_cached_events');
        if (stored) cachedEvents = JSON.parse(stored);
      } catch {
        cachedEvents = [];
      }
      const found = cachedEvents.find(e => e.id === id || e.vtoolsId === id);
      if (found) {
        return { success: true, event: found };
      }
      throw new Error('Event not found in cache');
    }
  },

  createEvent: async (formData: FormData): Promise<{ success: boolean; message: string; event: EventItem }> => {
    const response = await api.post<{ success: boolean; message: string; event: EventItem }>('/events', formData, {
      headers: { 'Content-Type': 'multipart/form-data' }
    });
    return response.data;
  },

  updateEvent: async (id: string, formData: FormData): Promise<{ success: boolean; message: string; event: EventItem }> => {
    const response = await api.put<{ success: boolean; message: string; event: EventItem }>(`/events/${id}`, formData, {
      headers: { 'Content-Type': 'multipart/form-data' }
    });
    return response.data;
  },

  deleteEvent: async (id: string): Promise<{ success: boolean; message: string }> => {
    const response = await api.delete<{ success: boolean; message: string }>(`/events/${id}`);
    return response.data;
  },

  getRegistrations: async (id: string): Promise<{ success: boolean; eventTitle: string; registrations: any[] }> => {
    const response = await api.get<{ success: boolean; eventTitle: string; registrations: any[] }>(`/events/${id}/registrations`);
    return response.data;
  },

  registerForEvent: async (id: string, data: { name: string; email: string; contact?: string }): Promise<{ success: boolean; message: string }> => {
    const response = await api.post<{ success: boolean; message: string }>(`/events/${id}/register`, data);
    return response.data;
  }
};

