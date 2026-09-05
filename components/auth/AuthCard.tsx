import React from 'react';
import { GlassCard } from '@/components/ui/GlassCard';
import { Sparkles } from 'lucide-react';

interface AuthCardProps {
  children: React.ReactNode;
  subtitle?: string;
}

export const AuthCard: React.FC<AuthCardProps> = ({
  children,
  subtitle = 'Sovereign Network Authentication',
}) => {
  return (
    <GlassCard intensity="high" glow className="w-full max-w-md mx-auto space-y-6">
      <div className="text-center space-y-2">
        <div className="inline-flex items-center justify-center w-10 h-10 rounded-2xl bg-white/10 border border-white/15 mx-auto">
          <Sparkles className="w-5 h-5 text-white" />
        </div>
        <h2 className="font-mono text-base font-bold tracking-widest text-white uppercase">
          ZENVITRA
        </h2>
        <p className="text-xs font-mono text-neutral-400">{subtitle}</p>
      </div>
      {children}
    </GlassCard>
  );
};