import api from './api';
import { AdminUser } from '../context/AuthContext';

interface LoginResponse {
  success: boolean;
  message: string;
  token: string;
  admin: AdminUser;
}

interface MeResponse {
  success: boolean;
  admin: AdminUser;
}

export const authService = {
  login: async (credentials: { email: string; password: string }): Promise<LoginResponse> => {
    const response = await api.post<LoginResponse>('/auth/login', credentials);
    return response.data;
  },

  signup: async (credentials: { name: string; email: string; password: string }): Promise<LoginResponse> => {
    const response = await api.post<LoginResponse>('/auth/signup', credentials);
    return response.data;
  },

  googleLogin: async (credential: string): Promise<LoginResponse> => {
    const response = await api.post<LoginResponse>('/auth/google', { credential });
    return response.data;
  },

  getMe: async (): Promise<MeResponse> => {
    const response = await api.get<MeResponse>('/auth/me');
    return response.data;
  }
};

