import React, { createContext, useContext, useState, useEffect } from 'react';
import axios from 'axios';

export interface AdminUser {
  id: string;
  name: string;
  email: string;
  role: 'admin' | 'superadmin';
  created_at?: string;
}

interface AuthContextType {
  admin: AdminUser | null;
  token: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (token: string, admin: AdminUser) => void;
  logout: () => void;
  checkAuthSession: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [admin, setAdmin] = useState<AdminUser | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const login = (jwtToken: string, adminUser: AdminUser) => {
    localStorage.setItem('admin_token', jwtToken);
    localStorage.setItem('admin_user', JSON.stringify(adminUser));
    setToken(jwtToken);
    setAdmin(adminUser);
  };

  const logout = () => {
    localStorage.removeItem('admin_token');
    localStorage.removeItem('admin_user');
    setToken(null);
    setAdmin(null);
  };

  const checkAuthSession = async () => {
    const storedToken = localStorage.getItem('admin_token');
    const storedUser = localStorage.getItem('admin_user');
    
    if (storedToken && storedUser) {
      try {
        setToken(storedToken);
        setAdmin(JSON.parse(storedUser));
        
        // Validate with server
        const backendUrl = import.meta.env.VITE_API_URL || 'http://localhost:5000';
        const response = await axios.get(`${backendUrl}/api/auth/me`, {
          headers: { Authorization: `Bearer ${storedToken}` }
        });
        
        if (response.data.success) {
          setAdmin(response.data.admin);
          localStorage.setItem('admin_user', JSON.stringify(response.data.admin));
        } else {
          logout();
        }
      } catch (error) {
        console.error('Session verification failed:', error);
        logout(); // Token expired or network issue
      }
    }
    setIsLoading(false);
  };

  useEffect(() => {
    checkAuthSession();
  }, []);

  return (
    <AuthContext.Provider
      value={{
        admin,
        token,
        isAuthenticated: !!token,
        isLoading,
        login,
        logout,
        checkAuthSession
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
