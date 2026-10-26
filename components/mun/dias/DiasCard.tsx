'use client';

import React from 'react';
import { useDiasTheme } from '@/context/DiasThemeContext';

export interface DiasCardProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: 'elevated' | 'surface' | 'glass';
  isHoverable?: boolean;
  hasGoldBorder?: boolean;
}

export const DiasCard = React.forwardRef<HTMLDivElement, DiasCardProps>(
  (
    {
      variant = 'elevated',
      isHoverable = false,
      hasGoldBorder = false,
      className = '',
      children,
      ...props
    },
    ref
  ) => {
    const { isLight } = useDiasTheme();

    const base = 'rounded-2xl transition-all duration-300';

    const darkVariants = {
      elevated:
        'bg-[#111318] border border-[#232731] shadow-[0_12px_40px_rgba(0,0,0,0.4)] text-[#F4F2ED]',
      surface:
        'bg-[#181B21] border border-[#2A2E39] shadow-[0_4px_20px_rgba(0,0,0,0.3)] text-[#F4F2ED]',
      glass:
        'bg-[#111318]/70 backdrop-blur-xl border border-[#232731]/80 shadow-[0_8px_32px_rgba(0,0,0,0.35)] text-[#F4F2ED]',
    };

    const lightVariants = {
      elevated:
        'bg-white border border-slate-200/90 shadow-[0_10px_30px_rgba(0,0,0,0.06)] text-slate-800',
      surface:
        'bg-slate-50 border border-slate-200 shadow-sm text-slate-800',
      glass:
        'bg-white/80 backdrop-blur-xl border border-slate-200/80 shadow-md text-slate-800',
    };

    const variants = isLight ? lightVariants : darkVariants;

    const hoverStyle = isHoverable
      ? isLight
        ? 'hover:border-indigo-400 hover:-translate-y-0.5 hover:shadow-lg cursor-pointer'
        : 'hover:border-[#6366F1]/40 hover:-translate-y-0.5 hover:shadow-[0_16px_48px_rgba(0,0,0,0.5)] cursor-pointer'
      : '';

    const goldBorder = hasGoldBorder
      ? isLight
        ? 'border-indigo-300 shadow-[0_0_20px_rgba(99,102,241,0.1)]'
        : 'border-[#6366F1]/30 shadow-[0_0_25px_rgba(99,102,241,0.08)]'
      : '';

    return (
      <div
        ref={ref}
        className={`${base} ${variants[variant]} ${hoverStyle} ${goldBorder} ${className}`}
        {...props}
      >
        {children}
      </div>
    );
  }
);

DiasCard.displayName = 'DiasCard';
