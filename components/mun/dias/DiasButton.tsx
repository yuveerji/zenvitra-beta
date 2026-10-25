import React from 'react';
import { Loader2 } from 'lucide-react';

export interface DiasButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'gold' | 'charcoal' | 'outline' | 'ghost' | 'danger';
  size?: 'sm' | 'md' | 'lg';
  isLoading?: boolean;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
}

export const DiasButton = React.forwardRef<HTMLButtonElement, DiasButtonProps>(
  (
    {
      variant = 'gold',
      size = 'md',
      isLoading = false,
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
      'inline-flex items-center justify-center font-medium transition-all duration-200 select-none focus:outline-none focus-visible:ring-2 focus-visible:ring-[#C5A46D]/60 disabled:opacity-50 disabled:pointer-events-none active:scale-[0.98]';

    const sizes = {
      sm: 'text-xs px-3 py-1.5 rounded-lg gap-1.5 h-8',
      md: 'text-sm px-4 py-2 rounded-xl gap-2 h-10',
      lg: 'text-base px-6 py-3 rounded-2xl gap-2.5 h-12 tracking-wide',
    };

    const variants = {
      gold: 'bg-[#C5A46D] hover:bg-[#D4B57E] text-[#08090B] font-semibold shadow-[0_2px_14px_rgba(197,164,109,0.25)] hover:shadow-[0_4px_20px_rgba(197,164,109,0.35)] border border-[#E6D1A5]/40',
      charcoal:
        'bg-[#181B21] hover:bg-[#20242C] text-[#F4F2ED] border border-[#2A2E39] hover:border-[#C5A46D]/30 shadow-sm',
      outline:
        'bg-transparent hover:bg-[#181B21]/60 text-[#F4F2ED] border border-[#C5A46D]/40 hover:border-[#C5A46D] text-[#C5A46D]',
      ghost:
        'bg-transparent hover:bg-[#181B21]/50 text-[#9A9DA5] hover:text-[#F4F2ED]',
      danger:
        'bg-[#822424]/20 hover:bg-[#822424]/30 text-[#F87171] border border-[#822424]/40 hover:border-[#F87171]/50',
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
