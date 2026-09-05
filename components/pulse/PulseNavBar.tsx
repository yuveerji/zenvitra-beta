'use client';

import React from 'react';
import { 
  Radio, 
  Film, 
  Users, 
  User, 
  PlusCircle, 
  Video, 
  Sparkles,
  ShieldCheck
} from 'lucide-react';
import { useZenPulse } from '@/context/ZenPulsePlatformContext';
import { PulseView } from '@/types/pulse';

export function PulseNavBar() {
  const { activeView, setActiveView, openUserProfile, currentUserUsername } = useZenPulse();

  const navItems: { view: PulseView; label: string; icon: React.ElementType; badge?: string }[] = [
    { view: 'feed', label: 'Feed & Stories', icon: Radio },
    { view: 'flux', label: 'SPARK Shorts', icon: Sparkles, badge: 'REELS' },
    { view: 'discover', label: 'Discover Youth', icon: Users },
    { view: 'profile', label: 'My Profile', icon: User },
  ];

  return (
    <div className="flex flex-col sm:flex-row items-center justify-between gap-3 p-2 rounded-3xl bg-[#070a12]/90 backdrop-blur-2xl border border-white/10 shadow-2xl mb-8">
      {/* View Switcher Pills */}
      <div className="flex items-center gap-1.5 p-1 bg-black/40 rounded-2xl border border-white/[0.06] overflow-x-auto max-w-full">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = activeView === item.view && (item.view !== 'profile' || true);

          return (
            <button
              key={item.view}
              onClick={() => {
                if (item.view === 'profile') {
                  openUserProfile(currentUserUsername);
                } else {
                  setActiveView(item.view);
                }
              }}
              className={`flex items-center gap-2 px-4 py-2.5 rounded-xl font-mono text-xs font-semibold transition-all duration-200 cursor-pointer whitespace-nowrap ${
                isActive
                  ? 'bg-cyan-500/10 text-cyan-300 border border-cyan-500/30'
                  : 'text-neutral-400 hover:text-white hover:bg-white/[0.04] border border-transparent'
              }`}
            >
              <Icon className={`w-4 h-4 ${isActive ? 'text-cyan-400' : 'text-neutral-400'}`} />
              <span>{item.label}</span>
              {item.badge && (
                <span className="text-[8px] font-mono px-1.5 py-0.5 rounded-md bg-gradient-to-r from-rose-500 to-amber-500 text-white font-bold tracking-wider">
                  {item.badge}
                </span>
              )}
            </button>
          );
        })}
      </div>

      {/* Creation Actions */}
      <div className="flex items-center gap-2 w-full sm:w-auto justify-end">
        <a
          href="/pulse/create-story"
          className="flex items-center gap-1.5 px-3.5 py-2 rounded-2xl font-mono text-xs font-bold transition-all cursor-pointer bg-gradient-to-r from-amber-400/15 via-rose-500/15 to-fuchsia-600/15 hover:from-amber-400/25 hover:via-rose-500/25 hover:to-fuchsia-600/25 text-rose-300 border border-rose-500/30"
        >
          <Radio className="w-3.5 h-3.5 text-rose-400 animate-pulse" />
          <span>+ Add Relay</span>
        </a>

        <button
          onClick={() => setActiveView('create-flux')}
          className={`flex items-center gap-1.5 px-3.5 py-2 rounded-2xl font-mono text-xs font-bold transition-all cursor-pointer ${
            activeView === 'create-flux'
              ? 'bg-rose-500 text-white border border-rose-400'
              : 'bg-rose-500/10 hover:bg-rose-500/20 text-rose-300 border border-rose-500/25'
          }`}
        >
          <Sparkles className="w-3.5 h-3.5" />
          <span>+ SPARK</span>
        </button>

        <button
          onClick={() => setActiveView('compose')}
          className={`flex items-center gap-1.5 px-4 py-2 rounded-2xl font-mono text-xs font-bold transition-all cursor-pointer ${
            activeView === 'compose'
              ? 'bg-neutral-200 text-black'
              : 'bg-white text-black hover:bg-neutral-200'
          }`}
        >
          <PlusCircle className="w-3.5 h-3.5" />
          <span>+ Post</span>
        </button>
      </div>
    </div>
  );
}
