import api from './api';

export interface DashboardStats {
  totalEvents: number;
  totalBlogs: number;
  totalTeamMembers: number;
  totalMediaFiles: number;
  totalRegistrations: number;
  pendingContacts: number;
}

export interface ActivityItem {
  id: string;
  type: 'event' | 'blog' | 'contact';
  title: string;
  description: string;
  date: string;
}

export interface ChartData {
  registrationsTrend: { month: string; count: number }[];
  eventsByCategory: { category: string; count: number }[];
  blogsByStatus: { publish_status: string; count: number }[];
}

export const dashboardService = {
  getStats: async (): Promise<{ success: boolean; stats: DashboardStats }> => {
    const response = await api.get<{ success: boolean; stats: DashboardStats }>('/dashboard/stats');
    return response.data;
  },

  getCharts: async (): Promise<{ success: boolean; charts: ChartData }> => {
    const response = await api.get<{ success: boolean; charts: ChartData }>('/dashboard/charts');
    return response.data;
  },

  getActivities: async (): Promise<{ success: boolean; activities: ActivityItem[] }> => {
    const response = await api.get<{ success: boolean; activities: ActivityItem[] }>('/dashboard/activities');
    return response.data;
  }
};
