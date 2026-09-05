import React from 'react';
import { GlassCard } from '@/components/ui/GlassCard';
import { Sparkles, ShieldCheck } from 'lucide-react';

interface ProfileHeaderProps {
  name: string;
  handle: string;
  role: string;
  bio?: string | null;
  isOwner?: boolean;
}

export const ProfileHeader: React.FC<ProfileHeaderProps> = ({
  name,
  handle,
  role,
  bio,
  isOwner = false,
}) => {
  return (
    <GlassCard intensity="high" glow className="space-y-6">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6">
        <div className="flex items-center gap-4">
          <div className="w-20 h-20 rounded-2xl bg-white/10 border border-white/20 flex items-center justify-center font-mono text-2xl font-bold text-white shadow-inner">
            {name?.[0] || 'U'}
          </div>
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <h1 className="text-xl font-bold font-mono text-white">{name}</h1>
              <span className="px-2 py-0.5 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-[10px] font-mono text-emerald-400">
                {role}
              </span>
            </div>
            <p className="text-xs font-mono text-neutral-400">@{handle}</p>
          </div>
        </div>

        <div className="font-mono text-xs">
          {isOwner ? (
            <span className="px-4 py-2 rounded-xl bg-white text-black font-semibold">
              Sovereign Owner
            </span>
          ) : (
            <span className="px-4 py-2 rounded-xl bg-white/[0.04] border border-white/10 text-neutral-400">
              Verified Node
            </span>
          )}
        </div>
      </div>

      {bio && (
        <p className="text-xs text-neutral-300 leading-relaxed font-sans pt-2 border-t border-white/10">
          {bio}
        </p>
      )}
    </GlassCard>
  );
};