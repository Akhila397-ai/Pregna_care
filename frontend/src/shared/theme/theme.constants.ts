import { Theme } from './theme.types';

export const THEME_STORAGE_KEY = 'pregnacare_theme';
export const DEFAULT_THEME: Theme = 'light';

export const getSystemTheme = (): Theme => {
  if (typeof window !== 'undefined' && window.matchMedia) {
    return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
  }
  return DEFAULT_THEME;
};

export const getInitialTheme = (): Theme => {
  if (typeof window === 'undefined') return DEFAULT_THEME;
  try {
    const storedTheme = localStorage.getItem(THEME_STORAGE_KEY);
    if (storedTheme === 'light' || storedTheme === 'dark') {
      return storedTheme;
    }
  } catch (err) {
    console.warn('Unable to access localStorage for theme:', err);
  }
  return getSystemTheme();
};
