'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { 
  ShieldAlert, 
  ShieldCheck,
  LayoutDashboard, 
  Users, 
  Sliders, 
  Newspaper, 
  Activity, 
  ArrowLeft,
  Crown,
  Flame,
  KeyRound,
  Radio,
  FileText
} from 'lucide-react';
import { useAuth } from '@/context/AuthContext';
import { useZenPulse } from '@/context/ZenPulsePlatformContext';
import { isFounder, isFounderSessionActive } from '@/lib/founderControl';

export const FounderSidebar = () => {
  const pathname = usePathname();
  const { user, profile } = useAuth();
  const { currentUserUsername } = useZenPulse();

  const effectiveUser = (currentUserUsername || user?.email?.split('@')[0] || profile?.username || '').toLowerCase().trim().replace(/^@/, '');
  const userRole = (profile?.role as any) || (profile as any)?.badge;
  const isFounderUser = isFounder(effectiveUser, userRole) || isFounderSessionActive();

  // Founder has access to all 5 routes including Citadel Protocol Omega
  const founderRoutes = [
    { label: 'Overview & Vault', href: '/zen-vault-root', icon: LayoutDashboard, badge: 'ROOT' },
    { label: 'User Registry', href: '/zen-vault-root/users', icon: Users, badge: 'NODES' },
    { label: 'Protocol Omega Matrix', href: '/zen-vault-root/protocol', icon: Sliders, badge: 'CITADEL' },
    { label: 'Sovereign Dispatches', href: '/zen-vault-root/dispatches', icon: Newspaper, badge: 'PRESS' },
    { label: 'Immutable Audit Logs', href: '/zen-vault-root/logs', icon: Activity, badge: 'LEDGER' },
  ];

  // Staff Admin has access to operational routes only (Protocol Omega is hidden)
  const adminRoutes = [
    { label: 'Operations Console', href: '/zen-vault-root', icon: LayoutDashboard, badge: 'OPS' },
    { label: 'User & Member Moderation', href: '/zen-vault-root/users', icon: Users, badge: 'USERS' },
    { label: 'Press & Dispatches', href: '/zen-vault-root/dispatches', icon: Newspaper, badge: 'PRESS' },
    { label: 'Operational Activity Logs', href: '/zen-vault-root/logs', icon: Activity, badge: 'LOGS' },
  ];

  const routes = isFounderUser ? founderRoutes : adminRoutes;

  return (
    <aside className="w-full md:w-72 border-r border-amber-500/20 bg-[#06070a]/95 backdrop-blur-2xl p-5 flex flex-col justify-between shrink-0 font-sans shadow-2xl">
      <div className="space-y-6">
        {/* Brand Header */}
        <Link href="/" className="flex items-center gap-3 group px-2 pt-1">
          <div className={`w-9 h-9 rounded-2xl p-[2px] shrink-0 shadow-lg group-hover:scale-105 transition ${
            isFounderUser
              ? 'bg-gradient-to-tr from-amber-400 via-rose-500 to-yellow-500'
              : 'bg-gradient-to-tr from-cyan-400 via-blue-500 to-indigo-500'
          }`}>
            <div className="w-full h-full rounded-2xl bg-black flex items-center justify-center">
              {isFounderUser ? (
                <Crown className="w-4 h-4 text-amber-400 fill-amber-400/20" />
              ) : (
                <ShieldCheck className="w-4 h-4 text-cyan-400" />
              )}
            </div>
          </div>
          <div className="flex flex-col text-left">
            <span 
              className="uppercase text-white font-bold tracking-[0.14em] text-sm leading-none"
              style={{
                fontFamily: 'Clash Display, var(--font-space), sans-serif',
                fontWeight: 700,
              }}
            >
              ZENVITRA
            </span>
            <span className={`text-[9px] font-mono font-bold uppercase tracking-widest pt-1 flex items-center gap-1 ${
              isFounderUser ? 'text-amber-400' : 'text-cyan-400'
            }`}>
              <span>{isFounderUser ? 'FOUNDER COMMAND' : 'STAFF ADMIN CONSOLE'}</span>
              <span className={`text-[8px] px-1 py-0.2 rounded ${
                isFounderUser ? 'bg-amber-400/20 text-amber-300' : 'bg-cyan-400/20 text-cyan-300'
              }`}>
                {isFounderUser ? '@yuveer' : 'LEVEL 2'}
              </span>
            </span>
          </div>
        </Link>

        {/* Navigation Matrix */}
        <nav className="space-y-1.5 font-mono text-xs">
          <div className="px-3 pb-2 text-[10px] uppercase font-bold text-neutral-500 tracking-wider">
            {isFounderUser ? 'Sovereign Navigation' : 'Staff Admin Navigation'}
          </div>
          {routes.map((route) => {
            const Icon = route.icon;
            const isActive = pathname === route.href;
            return (
              <Link
                key={route.label}
                href={route.href}
                className={`flex items-center justify-between px-3.5 py-3 rounded-2xl transition font-bold ${
                  isActive
                    ? isFounderUser
                      ? 'bg-amber-400/15 text-amber-300 border border-amber-400/30 shadow-[0_0_20px_rgba(251,191,36,0.15)]'
                      : 'bg-cyan-400/15 text-cyan-300 border border-cyan-400/30 shadow-[0_0_20px_rgba(6,182,212,0.15)]'
                    : 'text-neutral-400 hover:text-white hover:bg-white/[0.04] border border-transparent'
                }`}
              >
                <div className="flex items-center gap-3">
                  <Icon className={`w-4 h-4 ${
                    isActive 
                      ? isFounderUser ? 'text-amber-400' : 'text-cyan-400' 
                      : 'text-neutral-400'
                  }`} />
                  <span>{route.label}</span>
                </div>
                {route.badge && (
                  <span className={`text-[9px] px-1.5 py-0.5 rounded-full font-bold ${
                    isActive
                      ? isFounderUser
                        ? 'bg-amber-400/30 text-amber-200'
                        : 'bg-cyan-400/30 text-cyan-200'
                      : 'bg-white/5 text-neutral-500'
                  }`}>
                    {route.badge}
                  </span>
                )}
              </Link>
            );
          })}
        </nav>
      </div>

      {/* Footer Exit Link */}
      <div className="pt-6 border-t border-white/10 space-y-3">
        <div className={`p-3 rounded-2xl bg-black/60 border text-[11px] font-mono text-neutral-400 space-y-1 ${
          isFounderUser ? 'border-amber-400/20' : 'border-cyan-400/20'
        }`}>
          <div className={`flex items-center justify-between font-bold ${
            isFounderUser ? 'text-amber-300' : 'text-cyan-300'
          }`}>
            <span className="flex items-center gap-1.5">
              {isFounderUser ? (
                <>
                  <Crown className="w-3.5 h-3.5 text-amber-400" />
                  <span>LEVEL 0 CLEARANCE</span>
                </>
              ) : (
                <>
                  <ShieldCheck className="w-3.5 h-3.5 text-cyan-400" />
                  <span>LEVEL 2 CLEARANCE</span>
                </>
              )}
            </span>
            <span className="text-[10px] text-neutral-500">{isFounderUser ? '100%' : 'STAFF'}</span>
          </div>
          <p className="text-[10px] text-neutral-500">
            {isFounderUser
              ? 'Sovereign Root Omnipotence Active'
              : 'Operational Staff Administration Active'}
          </p>
        </div>

        <Link
          href="/pulse"
          className="w-full py-3 rounded-2xl bg-white/5 hover:bg-white/10 border border-white/10 text-neutral-300 hover:text-white font-mono text-xs font-bold transition flex items-center justify-center gap-2 cursor-pointer"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>Exit to Public Feed</span>
        </Link>
      </div>
    </aside>
  );
};
