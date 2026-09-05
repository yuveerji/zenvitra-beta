'use client';

import { useState, useEffect } from 'react';

export type ReaderTheme = 'dark' | 'light';

export function useReaderTheme() {
  const [theme, setTheme] = useState<ReaderTheme>('dark');
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    try {
      const saved = localStorage.getItem('zenvitra_reader_theme') as ReaderTheme | null;
      if (saved === 'light' || saved === 'dark') {
        setTheme(saved);
      }
    } catch (_) {}
    setMounted(true);
  }, []);

  const toggleTheme = () => {
    const next = theme === 'light' ? 'dark' : 'light';
    setTheme(next);
    try {
      localStorage.setItem('zenvitra_reader_theme', next);
    } catch (_) {}
  };

  return {
    theme,
    isLight: mounted && theme === 'light',
    toggleTheme,
    mounted
  };
}
