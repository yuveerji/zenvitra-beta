import React from 'react';
import { Loader2 } from 'lucide-react';

export interface DiasButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'gold' | 'indigo' | 'white' | 'charcoal' | 'amber-glass' | 'gold-glass' | 'indigo-glass' | 'outline' | 'ghost' | 'danger';
  size?: 'sm' | 'md' | 'lg';
  isLoading?: boolean;
  pill?: boolean;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
}

export const DiasButton = React.forwardRef<HTMLButtonElement, DiasButtonProps>(
  (
    {
      variant = 'indigo',
      size = 'md',
      isLoading = false,
      pill = true,
      leftIcon,
      rightIcon,
      children,
      className = '',
      disabled,
      ...props
    },
    ref
  ) => {
    const baseStyles =
      'group inline-flex items-center justify-center font-display uppercase tracking-wider select-none focus:outline-none focus-visible:ring-2 focus-visible:ring-indigo-400/60 disabled:opacity-50 disabled:pointer-events-none cursor-pointer transition-all duration-300 ease-out hover:scale-[1.02] active:scale-[0.98]';

    const sizes = {
      sm: `text-[11px] px-4 py-2 gap-2 h-9 ${pill ? 'rounded-full' : 'rounded-xl'}`,
      md: `text-xs sm:text-xs px-6 py-3 gap-2.5 h-11 ${pill ? 'rounded-full' : 'rounded-xl'}`,
      lg: `text-xs sm:text-sm px-7 sm:px-8 py-3.5 sm:py-4 gap-3 h-13 tracking-wider ${pill ? 'rounded-full' : 'rounded-2xl'}`,
    };

    const variants = {
      gold: 'bg-gradient-to-r from-indigo-600 via-indigo-500 to-violet-600 hover:from-indigo-500 hover:to-violet-500 text-white font-bold border border-indigo-400/50 shadow-[0_0_30px_rgba(99,102,241,0.35)] hover:shadow-[0_0_55px_rgba(99,102,241,0.6)] btn-glow',
      indigo: 'bg-gradient-to-r from-indigo-600 via-indigo-500 to-violet-600 hover:from-indigo-500 hover:to-violet-500 text-white font-bold border border-indigo-400/50 shadow-[0_0_30px_rgba(99,102,241,0.35)] hover:shadow-[0_0_55px_rgba(99,102,241,0.6)] btn-glow',
      white:
        'bg-white hover:bg-neutral-100 text-black font-bold border border-white/60 shadow-[0_0_40px_rgba(255,255,255,0.2)] hover:shadow-[0_0_60px_rgba(255,255,255,0.35)] btn-glow',
      charcoal:
        'border border-white/20 bg-white/[0.04] text-neutral-200 hover:text-white hover:bg-white/[0.08] hover:border-white/40 backdrop-blur-md shadow-[0_0_20px_rgba(255,255,255,0.05)] hover:shadow-[0_0_35px_rgba(255,255,255,0.12)]',
      'amber-glass':
        'border border-amber-400/30 bg-amber-400/[0.06] text-amber-300 hover:bg-amber-400/15 hover:border-amber-400/60 backdrop-blur-sm shadow-[0_0_25px_rgba(251,191,36,0.1)] hover:shadow-[0_0_45px_rgba(251,191,36,0.25)] btn-glow',
      'gold-glass':
        'border border-indigo-500/40 bg-indigo-500/[0.08] text-indigo-200 hover:bg-indigo-500/15 hover:border-indigo-500/70 backdrop-blur-md shadow-[0_0_25px_rgba(99,102,241,0.15)] hover:shadow-[0_0_45px_rgba(99,102,241,0.3)]',
      'indigo-glass':
        'border border-indigo-500/40 bg-indigo-500/[0.08] text-indigo-200 hover:bg-indigo-500/15 hover:border-indigo-500/70 backdrop-blur-md shadow-[0_0_25px_rgba(99,102,241,0.15)] hover:shadow-[0_0_45px_rgba(99,102,241,0.3)]',
      outline:
        'border border-indigo-500/50 bg-transparent text-indigo-200 hover:border-indigo-400 hover:bg-indigo-500/10 backdrop-blur-sm shadow-[0_0_20px_rgba(99,102,241,0.12)] hover:shadow-[0_0_35px_rgba(99,102,241,0.28)]',
      ghost:
        'bg-transparent hover:bg-white/[0.06] text-neutral-400 hover:text-[#F4F2ED] shadow-none hover:shadow-none',
      danger:
        'border border-red-500/40 bg-red-500/[0.08] text-red-300 hover:bg-red-500/20 hover:border-red-500/70 shadow-[0_0_25px_rgba(239,68,68,0.2)]',
    };

    return (
      <button
        ref={ref}
        disabled={disabled || isLoading}
        className={`${baseStyles} ${sizes[size]} ${variants[variant]} ${className}`}
        {...props}
      >
        {isLoading ? (
          <Loader2 className="w-4 h-4 animate-spin text-current" />
        ) : (
          leftIcon
        )}
        <span>{children}</span>
        {!isLoading && rightIcon}
      </button>
    );
  }
);

DiasButton.displayName = 'DiasButton';
