'use client';

/**
 * AquaSense Design System - Theme Provider
 * 
 * Provides theme context for light/dark mode switching.
 * Persists theme preference in localStorage and applies to document root.
 * 
 * Requirements:
 * - 17.1: Provide dark mode toggle accessible in user settings/navigation
 * - 17.2: Apply dark mode colors to all pages and components when enabled
 * - 17.5: Persist user's dark mode preference across sessions
 */

import React, { createContext, useContext, useEffect, useState } from 'react';

type Theme = 'light' | 'dark';

interface ThemeContextType {
  theme: Theme;
  toggleTheme: () => void;
  setTheme: (theme: Theme) => void;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

const THEME_STORAGE_KEY = 'aquasense-theme';

interface ThemeProviderProps {
  children: React.ReactNode;
  defaultTheme?: Theme;
}

/**
 * ThemeProvider Component
 * 
 * Provides theme state management for the entire application.
 * Handles theme persistence in localStorage and applies theme class to document root.
 * 
 * @param children - Child components to wrap with theme context
 * @param defaultTheme - Default theme to use if no preference is stored (defaults to 'light')
 */
export function ThemeProvider({ 
  children, 
  defaultTheme = 'light' 
}: ThemeProviderProps) {
  const [theme, setThemeState] = useState<Theme>(defaultTheme);
  const [mounted, setMounted] = useState(false);

  // Initialize theme from localStorage on mount
  useEffect(() => {
    setMounted(true);
    
    // Check localStorage for saved theme preference
    const savedTheme = localStorage.getItem(THEME_STORAGE_KEY) as Theme | null;
    
    if (savedTheme && (savedTheme === 'light' || savedTheme === 'dark')) {
      setThemeState(savedTheme);
    } else {
      // Check system preference as fallback
      const systemPrefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
      const initialTheme = systemPrefersDark ? 'dark' : defaultTheme;
      setThemeState(initialTheme);
      localStorage.setItem(THEME_STORAGE_KEY, initialTheme);
    }
  }, [defaultTheme]);

  // Apply theme class to document root element
  useEffect(() => {
    if (!mounted) return;

    const root = document.documentElement;
    
    // Remove both classes first
    root.classList.remove('light', 'dark');
    
    // Add current theme class
    root.classList.add(theme);
  }, [theme, mounted]);

  /**
   * Toggle between light and dark themes
   */
  const toggleTheme = () => {
    const newTheme: Theme = theme === 'light' ? 'dark' : 'light';
    setThemeState(newTheme);
    localStorage.setItem(THEME_STORAGE_KEY, newTheme);
  };

  /**
   * Set theme explicitly
   */
  const setTheme = (newTheme: Theme) => {
    setThemeState(newTheme);
    localStorage.setItem(THEME_STORAGE_KEY, newTheme);
  };

  return (
    <ThemeContext.Provider value={{ theme, toggleTheme, setTheme }}>
      {children}
    </ThemeContext.Provider>
  );
}

/**
 * useTheme Hook
 * 
 * Access theme context in any component.
 * Must be used within a ThemeProvider.
 * 
 * @returns Theme context with current theme and toggle function
 * @throws Error if used outside ThemeProvider
 */
export function useTheme(): ThemeContextType {
  const context = useContext(ThemeContext);
  
  if (context === undefined) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  
  return context;
}

/**
 * Helper function to get current theme from localStorage
 * Useful for server-side rendering or initial checks
 * 
 * @returns Current theme preference or 'light' as default
 */
export function getStoredTheme(): Theme {
  if (typeof window === 'undefined') {
    return 'light';
  }
  
  const stored = localStorage.getItem(THEME_STORAGE_KEY);
  return (stored === 'dark' ? 'dark' : 'light');
}
