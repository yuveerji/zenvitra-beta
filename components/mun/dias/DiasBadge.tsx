import React from 'react';

export interface DiasBadgeProps {
  children: React.ReactNode;
  variant?: 'gold' | 'charcoal' | 'emerald' | 'amber' | 'crimson' | 'muted';
  size?: 'sm' | 'md';
  dot?: boolean;
  className?: string;
}

export const DiasBadge: React.FC<DiasBadgeProps> = ({
  children,
  variant = 'charcoal',
  size = 'md',
  dot = false,
  className = '',
}) => {
  const sizeStyles = {
    sm: 'text-[10px] px-2 py-0.5 rounded-md tracking-wider uppercase font-semibold gap-1',
    md: 'text-xs px-2.5 py-1 rounded-lg font-medium gap-1.5',
  };

  const variantStyles = {
    gold: 'bg-[#C5A46D]/15 text-[#E6D1A5] border border-[#C5A46D]/30',
    charcoal: 'bg-[#181B21] text-[#F4F2ED] border border-[#2A2E39]',
    emerald: 'bg-[#1C3829]/50 text-[#86EFAC] border border-[#22C55E]/30',
    amber: 'bg-[#B87A24]/20 text-[#FCD34D] border border-[#F59E0B]/30',
    crimson: 'bg-[#822424]/20 text-[#FCA5A5] border border-[#EF4444]/30',
    muted: 'bg-[#111318] text-[#9A9DA5] border border-[#1F232B]',
  };

  const dotColors = {
    gold: 'bg-[#C5A46D]',
    charcoal: 'bg-[#9A9DA5]',
    emerald: 'bg-[#22C55E]',
    amber: 'bg-[#F59E0B]',
    crimson: 'bg-[#EF4444]',
    muted: 'bg-[#6B7280]',
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
