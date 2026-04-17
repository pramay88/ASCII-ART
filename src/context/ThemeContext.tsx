'use client';
// ─── Theme Context ───────────────────────────────────────────────────────────

import React, { createContext, useContext, useState, useEffect, type ReactNode } from 'react';
import { ThemeName } from '../core/types';

interface ThemeContextValue {
  theme: ThemeName;
  setTheme: (theme: ThemeName) => void;
  customColor: string;
  setCustomColor: (color: string) => void;
}

const ThemeContext = createContext<ThemeContextValue | null>(null);

export function ThemeProvider({ children }: { children: ReactNode }) {
  const [theme, setThemeState] = useState<ThemeName>('dark');
  const [customColor, setCustomColorState] = useState<string>('#7d85ff');
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    // Load from localStorage on client mount to avoid hydration mismatch
    const stored = localStorage.getItem('ascii-theme') as ThemeName | null;
    if (stored && ['dark', 'light', 'custom'].includes(stored)) {
      setThemeState(stored);
    } else {
      const prefersDark = window.matchMedia('(prefers-color-scheme: light)').matches;
      setThemeState(prefersDark ? 'light' : 'dark');
    }

    const storedColor = localStorage.getItem('ascii-custom-color');
    if (storedColor) {
      setCustomColorState(storedColor);
    }

    setMounted(true);
  }, []);

  useEffect(() => {
    if (!mounted) return;
    if (typeof window === 'undefined') return;
    document.documentElement.setAttribute('data-theme', theme);
    document.documentElement.style.setProperty('--ascii-color', customColor);
    localStorage.setItem('ascii-theme', theme);
    localStorage.setItem('ascii-custom-color', customColor);
  }, [theme, customColor, mounted]);

  const setTheme = (newTheme: ThemeName) => {
    setThemeState(newTheme);
  };

  const setCustomColor = (color: string) => {
    setCustomColorState(color);
  };

  return (
    <ThemeContext.Provider value={{ theme, setTheme, customColor, setCustomColor }}>
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme(): ThemeContextValue {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
}
