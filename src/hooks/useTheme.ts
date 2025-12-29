/**
 * Theme hook - Always returns dark mode (light mode removed)
 * Kept for backward compatibility with any code that may import it
 */
export type Theme = 'dark';

export interface UseThemeReturn {
  theme: Theme;
  setTheme: (theme: Theme) => void;
  resolvedTheme: 'dark';
  error: null;
}

export function useTheme(): UseThemeReturn {
  return {
    theme: 'dark',
    setTheme: () => {}, // No-op since dark mode is the only mode
    resolvedTheme: 'dark',
    error: null,
  };
}
