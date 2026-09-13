import api from './api';

export interface BranchOfficer {
  id?: string;
  name: string;
  role: string;
  ieeeNumber?: string | null;
  email?: string | null;
  year: number;
  branchId?: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface StudentBranch {
  id: string;
  name: string;
  code?: string | null;
  logoUrl?: string | null;
  established?: string | null;
  createdAt?: string;
  updatedAt?: string;
  officers?: BranchOfficer[];
}

interface ApiResponse<T> {
  success: boolean;
  message?: string;
  branches?: T;
  branch?: T;
}

export const studentBranchService = {
  getStudentBranches: async (): Promise<ApiResponse<StudentBranch[]>> => {
    const response = await api.get<ApiResponse<StudentBranch[]>>('/student-branches');
    return response.data;
  },

  getStudentBranchById: async (id: string): Promise<ApiResponse<StudentBranch>> => {
    const response = await api.get<ApiResponse<StudentBranch>>(`/student-branches/${id}`);
    return response.data;
  },

  createStudentBranch: async (data: Partial<StudentBranch> | FormData): Promise<ApiResponse<StudentBranch>> => {
    const response = await api.post<ApiResponse<StudentBranch>>('/student-branches', data);
    return response.data;
  },

  updateStudentBranch: async (id: string, data: Partial<StudentBranch> | FormData): Promise<ApiResponse<StudentBranch>> => {
    const response = await api.put<ApiResponse<StudentBranch>>(`/student-branches/${id}`, data);
    return response.data;
  },

  deleteStudentBranch: async (id: string): Promise<ApiResponse<any>> => {
    const response = await api.delete<ApiResponse<any>>(`/student-branches/${id}`);
    return response.data;
  }
};
