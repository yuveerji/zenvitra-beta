'use client';

import React, { createContext, useContext, useEffect, useState } from 'react';

export type DiasTheme = 'dark' | 'light';

interface DiasThemeContextType {
  theme: DiasTheme;
  setTheme: (theme: DiasTheme) => void;
  toggleTheme: () => void;
  isLight: boolean;
}

const DiasThemeContext = createContext<DiasThemeContextType>({
  theme: 'dark',
  setTheme: () => {},
  toggleTheme: () => {},
  isLight: false,
});

const THEME_STORAGE_KEY = 'zenvitra_dias_theme_v2';

export const DiasThemeProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [theme, setThemeState] = useState<DiasTheme>('dark');
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    try {
      const stored = localStorage.getItem(THEME_STORAGE_KEY) as DiasTheme | null;
      if (stored === 'light' || stored === 'dark') {
        setThemeState(stored);
      }
    } catch {}
    setMounted(true);
  }, []);

  const setTheme = (newTheme: DiasTheme) => {
    setThemeState(newTheme);
    try {
      localStorage.setItem(THEME_STORAGE_KEY, newTheme);
    } catch {}
  };

  const toggleTheme = () => {
    const nextTheme = theme === 'dark' ? 'light' : 'dark';
    setTheme(nextTheme);
  };

  const isLight = theme === 'light';

  return (
    <DiasThemeContext.Provider value={{ theme, setTheme, toggleTheme, isLight }}>
      <div
        data-dias-theme={theme}
        className={isLight ? 'dias-theme-light' : 'dias-theme-dark'}
      >
        {children}
      </div>
    </DiasThemeContext.Provider>
  );
};

export const useDiasTheme = () => useContext(DiasThemeContext);
