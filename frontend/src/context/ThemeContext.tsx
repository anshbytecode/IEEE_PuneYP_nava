import React, { createContext, useContext, useState, useEffect } from 'react';

type ThemeMode = 'light' | 'dark';

interface ThemeContextType {
  mode: ThemeMode;
  toggleTheme: () => void;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export const ThemeProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [mode] = useState<ThemeMode>('light'); // Strictly light mode to match corporate IEEE style

  useEffect(() => {
    const root = document.documentElement;
    root.classList.remove('dark');
    root.style.setProperty('--bg-base', '#F8FAFC'); // Cool Light Slate
    root.style.setProperty('--bg-surface', '#FFFFFF');
    root.style.setProperty('--bg-input', '#F8FAFC'); // Premium Soft Slate Input
    root.style.setProperty('--text-main', '#0F172A');
    root.style.setProperty('--text-muted', '#64748B');
    root.style.setProperty('--border-color', '#E2E8F0');
  }, []);

  const toggleTheme = () => {
    // Locked to light mode
  };

  return (
    <ThemeContext.Provider value={{ mode, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  );
};

export const useThemeContext = () => {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useThemeContext must be used within a ThemeProvider');
  }
  return context;
};
