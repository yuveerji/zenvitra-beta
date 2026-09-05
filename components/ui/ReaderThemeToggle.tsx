'use client';

import React from 'react';
import { Sun, Moon } from 'lucide-react';
import { useReaderTheme } from '@/hooks/useReaderTheme';

interface ReaderThemeToggleProps {
  isLight: boolean;
  onToggle: () => void;
  className?: string;
}

export function ReaderThemeToggle({ isLight, onToggle, className = '' }: ReaderThemeToggleProps) {
  return (
    <button
      type="button"
      onClick={onToggle}
      title={isLight ? 'Switch to Dark Enclave mode' : 'Switch to Ivory Reader mode'}
      className={`px-3.5 py-1.5 rounded-xl border text-xs font-mono font-semibold transition-all flex items-center gap-2 cursor-pointer shadow-sm ${
        isLight
          ? 'bg-amber-100 hover:bg-amber-200 text-amber-950 border-amber-300'
          : 'bg-white/5 hover:bg-white/10 text-neutral-300 hover:text-white border-white/15'
      } ${className}`}
    >
      {isLight ? (
        <>
          <Moon className="w-3.5 h-3.5 text-amber-900" />
          <span>Dark Enclave</span>
        </>
      ) : (
        <>
          <Sun className="w-3.5 h-3.5 text-amber-400" />
          <span>Ivory Reader</span>
        </>
      )}
    </button>
  );
}
