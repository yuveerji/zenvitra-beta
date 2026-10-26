'use client';

import React from 'react';
import { useDiasTheme } from '@/context/DiasThemeContext';

export interface DiasBadgeProps {
  children: React.ReactNode;
  variant?: 'gold' | 'indigo' | 'charcoal' | 'emerald' | 'amber' | 'crimson' | 'muted';
  size?: 'sm' | 'md';
  dot?: boolean;
  className?: string;
}

export const DiasBadge: React.FC<DiasBadgeProps> = ({
  children,
  variant = 'indigo',
  size = 'md',
  dot = false,
  className = '',
}) => {
  const { isLight } = useDiasTheme();

  const sizeStyles = {
    sm: 'text-[10px] px-2 py-0.5 rounded-md tracking-wider uppercase font-semibold gap-1',
    md: 'text-xs px-2.5 py-1 rounded-lg font-medium gap-1.5',
  };

  const darkVariantStyles = {
    gold: 'bg-indigo-950/50 text-indigo-200 border border-indigo-500/30',
    indigo: 'bg-indigo-950/60 text-indigo-300 border border-indigo-500/40 shadow-[0_0_15px_rgba(99,102,241,0.15)]',
    charcoal: 'bg-[#181B21] text-[#F4F2ED] border border-[#2A2E39]',
    emerald: 'bg-[#1C3829]/50 text-[#86EFAC] border border-[#22C55E]/30',
    amber: 'bg-[#B87A24]/20 text-[#FCD34D] border border-[#F59E0B]/30',
    crimson: 'bg-[#822424]/20 text-[#FCA5A5] border border-[#EF4444]/30',
    muted: 'bg-[#111318] text-[#9A9DA5] border border-[#1F232B]',
  };

  const lightVariantStyles = {
    gold: 'bg-indigo-50 text-indigo-700 border border-indigo-200',
    indigo: 'bg-indigo-50 text-indigo-700 border border-indigo-200 shadow-xs',
    charcoal: 'bg-slate-100 text-slate-800 border border-slate-200',
    emerald: 'bg-emerald-50 text-emerald-700 border border-emerald-200',
    amber: 'bg-amber-50 text-amber-700 border border-amber-200',
    crimson: 'bg-rose-50 text-rose-700 border border-rose-200',
    muted: 'bg-slate-100 text-slate-600 border border-slate-200',
  };

  const variantStyles = isLight ? lightVariantStyles : darkVariantStyles;

  const dotColors = {
    gold: isLight ? 'bg-indigo-600' : 'bg-indigo-400',
    indigo: isLight ? 'bg-indigo-600' : 'bg-indigo-400',
    charcoal: isLight ? 'bg-slate-600' : 'bg-[#9A9DA5]',
    emerald: 'bg-[#22C55E]',
    amber: 'bg-[#F59E0B]',
    crimson: 'bg-[#EF4444]',
    muted: isLight ? 'bg-slate-400' : 'bg-[#6B7280]',
  };

  return (
    <span
      className={`inline-flex items-center select-none ${sizeStyles[size]} ${variantStyles[variant]} ${className}`}
    >
      {dot && (
        <span
          className={`w-1.5 h-1.5 rounded-full animate-pulse ${dotColors[variant]}`}
        />
      )}
      {children}
    </span>
  );
};
