import React from 'react';
import { cn } from '@/lib/utils';

interface GlassCardProps extends React.HTMLAttributes<HTMLDivElement> {
  glow?: boolean;
  intensity?: 'subtle' | 'standard' | 'high';
}

export const GlassCard: React.FC<GlassCardProps> = ({
  children,
  className,
  glow = false,
  intensity = 'standard',
  ...props
}) => {
  const intensities = {
    subtle: 'bg-[#06070a]/60 backdrop-blur-md border border-white/5',
    standard: 'bg-[#06070a]/85 backdrop-blur-xl border border-white/10',
    high: 'bg-[#06070a]/95 backdrop-blur-2xl border border-white/20',
  };

  return (
    <div
      className={cn(
        'rounded-3xl p-6 transition-all',
        intensities[intensity],
        // Glow / active state only applies crisp border highlight
        glow && 'hover:border-white/30',
        className
      )}
      {...props}
    >
      {children}
    </div>
  );
};