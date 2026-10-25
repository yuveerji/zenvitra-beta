import React from 'react';

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
    const base = 'rounded-2xl transition-all duration-300';

    const variants = {
      elevated:
        'bg-[#111318] border border-[#232731] shadow-[0_12px_40px_rgba(0,0,0,0.4)]',
      surface:
        'bg-[#181B21] border border-[#2A2E39] shadow-[0_4px_20px_rgba(0,0,0,0.3)]',
      glass:
        'bg-[#111318]/70 backdrop-blur-xl border border-[#232731]/80 shadow-[0_8px_32px_rgba(0,0,0,0.35)]',
    };

    const hoverStyle = isHoverable
      ? 'hover:border-[#6366F1]/40 hover:-translate-y-0.5 hover:shadow-[0_16px_48px_rgba(0,0,0,0.5)] cursor-pointer'
      : '';

    const goldBorder = hasGoldBorder
      ? 'border-[#6366F1]/30 shadow-[0_0_25px_rgba(99,102,241,0.08)]'
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
