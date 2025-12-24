import { useState, useEffect, useCallback } from 'react';
import { loadConfig, updateConfig } from '../utils/config';

export type Theme = 'dark' | 'light' | 'system';

export interface UseThemeReturn {
  theme: Theme;
  setTheme: (theme: Theme) => void;
  resolvedTheme: 'dark' | 'light';
  error: string | null;
}

function getSystemTheme(): 'dark' | 'light' {
  if (typeof window !== 'undefined' && window.matchMedia) {
    return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
  }
  return 'dark';
}

function applyTheme(theme: 'dark' | 'light') {
  const root = document.documentElement;
  if (theme === 'dark') {
    root.classList.add('dark');
  } else {
    root.classList.remove('dark');
  }
}

export function useTheme(): UseThemeReturn {
  const [theme, setThemeState] = useState<Theme>('dark');
  const [error, setError] = useState<string | null>(null);

  // Calculate resolved theme (dark or light)
  const resolvedTheme = theme === 'system' ? getSystemTheme() : theme;

  // Load theme from localStorage on mount
  useEffect(() => {
    const config = loadConfig();
    if (config.theme && ['dark', 'light', 'system'].includes(config.theme)) {
      setThemeState(config.theme);
      const resolved = config.theme === 'system' ? getSystemTheme() : config.theme;
      applyTheme(resolved);
    } else {
      // Default to dark theme
      applyTheme('dark');
    }
  }, []);

  // Apply theme whenever it changes
  useEffect(() => {
    applyTheme(resolvedTheme);
  }, [resolvedTheme]);

  // Listen for system theme changes when theme is 'system'
  useEffect(() => {
    if (theme !== 'system') return;

    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
    const handleChange = (e: MediaQueryListEvent) => {
      applyTheme(e.matches ? 'dark' : 'light');
    };

    mediaQuery.addEventListener('change', handleChange);
    return () => mediaQuery.removeEventListener('change', handleChange);
  }, [theme]);

  const setTheme = useCallback((newTheme: Theme) => {
    if (!['dark', 'light', 'system'].includes(newTheme)) {
      setError('Invalid theme. Must be "dark", "light", or "system"');
      return;
    }

    const success = updateConfig({ theme: newTheme });

    if (success) {
      setThemeState(newTheme);
      const resolved = newTheme === 'system' ? getSystemTheme() : newTheme;
      applyTheme(resolved);
      setError(null);
    } else {
      setError('Failed to save theme preference');
    }
  }, []);

  return {
    theme,
    setTheme,
    resolvedTheme,
    error,
  };
}
