import React from 'react';

export interface DiasInputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  helperText?: string;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
}

export const DiasInput = React.forwardRef<HTMLInputElement, DiasInputProps>(
  (
    {
      label,
      error,
      helperText,
      leftIcon,
      rightIcon,
      className = '',
      id,
      ...props
    },
    ref
  ) => {
    const generatedId = id || (label ? label.toLowerCase().replace(/\s+/g, '-') : undefined);

    return (
      <div className="w-full space-y-1.5 text-left">
        {label && (
          <label
            htmlFor={generatedId}
            className="block text-xs font-medium tracking-wide uppercase text-[#9A9DA5]"
          >
            {label}
          </label>
        )}
        <div className="relative flex items-center">
          {leftIcon && (
            <div className="absolute left-3.5 pointer-events-none text-[#9A9DA5]">
              {leftIcon}
            </div>
          )}
          <input
            ref={ref}
            id={generatedId}
            className={`w-full bg-[#08090B] border text-[#F4F2ED] placeholder-[#575B66] text-sm rounded-xl px-4 py-2.5 transition-all duration-200 outline-none ${
              leftIcon ? 'pl-10' : ''
            } ${rightIcon ? 'pr-10' : ''} ${
              error
                ? 'border-[#EF4444] focus:ring-2 focus:ring-[#EF4444]/20'
                : 'border-[#232731] focus:border-[#6366F1] focus:ring-2 focus:ring-[#6366F1]/15'
            } ${className}`}
            {...props}
          />
          {rightIcon && (
            <div className="absolute right-3.5 text-[#9A9DA5]">{rightIcon}</div>
          )}
        </div>
        {error && <p className="text-xs text-[#EF4444] mt-1">{error}</p>}
        {helperText && !error && (
          <p className="text-xs text-[#575B66] mt-1">{helperText}</p>
        )}
      </div>
    );
  }
);

DiasInput.displayName = 'DiasInput';
