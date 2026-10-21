'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname, useSearchParams } from 'next/navigation';
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
  Radio,
  Layers,
  Calendar,
  CreditCard,
  TrendingUp,
  Server,
  Building,
  Settings,
  ArrowUpRight,
  Sparkles,
  ExternalLink,
  LifeBuoy,
  Video
} from 'lucide-react';
import { useAuth } from '@/context/AuthContext';
import { useZenPulse } from '@/context/ZenPulsePlatformContext';
import { isFounder, isFounderSessionActive } from '@/lib/founderControl';
import { FOUNDER_SECTIONS, FounderSectionId } from '@/types/founder';

const SECTION_ICONS: Record<FounderSectionId, React.ElementType> = {
  '01_command': Radio,
  '02_platform_control': Sliders,
  '03_zen_modules': Layers,
  '04_people_access': Users,
  '05_events_mun': Calendar,
  '06_finance': CreditCard,
  '07_content_community': Newspaper,
  '08_analytics': TrendingUp,
  '09_infrastructure': Server,
  '10_security_audit': ShieldAlert,
  '11_organisation': Building,
  '12_founder_settings': Settings,
};

export const FounderSidebar = () => {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const activeSection = searchParams?.get('section') || '01_command';

  const { user, profile } = useAuth();
  const { currentUserUsername } = useZenPulse();

  const effectiveUser = (currentUserUsername || user?.email?.split('@')[0] || profile?.username || '').toLowerCase().trim().replace(/^@/, '');
  const userRole = (profile?.role as any) || (profile as any)?.badge;
  const isFounderUser = isFounder(effectiveUser, userRole) || isFounderSessionActive();

  return (
    <aside className="w-full md:w-80 border-r border-amber-500/20 bg-[#040508]/95 backdrop-blur-2xl p-4 sm:p-5 flex flex-col justify-between shrink-0 font-sans shadow-2xl z-40 select-none">
      <div className="space-y-5">
        {/* Brand Master Header */}
        <div className="p-3.5 rounded-2xl bg-[#090b14] border border-amber-500/30 shadow-[0_0_25px_rgba(251,191,36,0.1)] space-y-3">
          <div className="flex items-center justify-between">
            <Link href="/" className="flex items-center gap-2.5 group">
              <div className="w-8 h-8 rounded-xl p-[2px] bg-gradient-to-tr from-amber-400 via-rose-500 to-yellow-500 group-hover:scale-105 transition shadow-lg shrink-0">
                <div className="w-full h-full rounded-[10px] bg-black flex items-center justify-center">
                  <Crown className="w-4 h-4 text-amber-400 fill-amber-400/20" />
                </div>
              </div>
              <div>
                <span 
                  className="uppercase text-white font-extrabold tracking-[0.14em] text-xs leading-none block"
                  style={{ fontFamily: 'Clash Display, var(--font-space), sans-serif' }}
                >
                  ZEN.FOUNDER
                </span>
                <span className="text-[9px] font-mono text-neutral-400 uppercase tracking-wider block pt-0.5">
                  ZENVITRA MASTER CONTROL
                </span>
              </div>
            </Link>

            <span className="text-[9px] font-mono font-black uppercase px-2 py-0.5 rounded bg-amber-400/20 text-amber-300 border border-amber-400/30 tracking-wider">
              OWNER
            </span>
          </div>

          {/* Platform Status Bar */}
          <div className="pt-2 border-t border-white/10 flex items-center justify-between text-[10px] font-mono">
            <div className="flex items-center gap-1.5 text-neutral-400">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
              <span>PLATFORM STATUS:</span>
            </div>
            <span className="text-emerald-400 font-bold tracking-wider">
              OPERATIONAL
            </span>
          </div>
        </div>

        {/* Section Navigation Header */}
        <div className="flex items-center justify-between px-2 pt-1 text-[10px] font-mono uppercase tracking-wider text-neutral-400">
          <span>Master Sections (12)</span>
          <span className="text-amber-400 font-bold">LEVEL 0 ROOT</span>
        </div>

        {/* 12 Master Controls Navigation Menu */}
        <nav className="space-y-1 font-mono text-xs max-h-[calc(100vh-380px)] overflow-y-auto pr-1 custom-scrollbar">
          {FOUNDER_SECTIONS.map((sec) => {
            const Icon = SECTION_ICONS[sec.id] || LayoutDashboard;
            const isSelected = pathname === '/zen-vault-root' && activeSection === sec.id;

            return (
              <Link
                key={sec.id}
                href={`/zen-vault-root?section=${sec.id}`}
                className={`flex items-center justify-between px-3 py-2.5 rounded-xl transition text-left group cursor-pointer ${
                  isSelected
                    ? 'bg-amber-400/15 text-amber-300 border border-amber-400/40 shadow-[0_0_15px_rgba(251,191,36,0.12)]'
                    : 'text-neutral-400 hover:text-white hover:bg-white/[0.04] border border-transparent'
                }`}
              >
                <div className="flex items-center gap-2.5 min-w-0">
                  <Icon className={`w-3.5 h-3.5 shrink-0 transition ${
                    isSelected ? 'text-amber-400 scale-110' : 'text-neutral-500 group-hover:text-amber-300'
                  }`} />
                  <div className="truncate">
                    <div className="text-[11px] font-bold tracking-tight truncate flex items-center gap-1.5">
                      <span className="text-[10px] text-neutral-500 font-normal">{sec.num} ·</span>
                      <span className={isSelected ? 'text-amber-200' : 'text-neutral-200'}>{sec.title}</span>
                    </div>
                  </div>
                </div>

                <span className={`text-[9px] px-1.5 py-0.5 rounded font-bold shrink-0 ml-2 ${
                  isSelected
                    ? 'bg-amber-400/30 text-amber-200'
                    : 'bg-white/5 text-neutral-500 group-hover:text-neutral-300'
                }`}>
                  {sec.controlsCount}
                </span>
              </Link>
            );
          })}
        </nav>
      </div>

      {/* Footer Dual Actions */}
      <div className="pt-4 border-t border-white/10 space-y-2.5">
        {/* Calls Master Oversight */}
        <Link
          href="/zen-vault-root/calls"
          className="w-full p-2.5 rounded-xl bg-amber-950/40 hover:bg-amber-900/50 border border-amber-500/30 text-amber-300 hover:text-amber-200 text-xs font-mono font-bold transition flex items-center justify-between group cursor-pointer"
        >
          <div className="flex items-center gap-2">
            <Video className="w-4 h-4 text-amber-400" />
            <div className="text-left">
              <div className="text-[11px] leading-none font-bold">ZEN.CALL OVERSIGHT</div>
              <div className="text-[9px] text-amber-400/70 font-normal pt-0.5">AV Mesh &amp; Killswitches</div>
            </div>
          </div>
          <ArrowUpRight className="w-3.5 h-3.5 text-amber-400 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition" />
        </Link>

        {/* Support Oversight */}
        <Link
          href="/zen-vault-root/support"
          className="w-full p-2.5 rounded-xl bg-amber-950/40 hover:bg-amber-900/50 border border-amber-500/30 text-amber-300 hover:text-amber-200 text-xs font-mono font-bold transition flex items-center justify-between group cursor-pointer"
        >
          <div className="flex items-center gap-2">
            <LifeBuoy className="w-4 h-4 text-amber-400" />
            <div className="text-left">
              <div className="text-[11px] leading-none font-bold">ZEN.SUPPORT OVERSIGHT</div>
              <div className="text-[9px] text-amber-400/70 font-normal pt-0.5">Level-0 Escalation &amp; SLAs</div>
            </div>
          </div>
          <ArrowUpRight className="w-3.5 h-3.5 text-amber-400 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition" />
        </Link>

        {/* Switch to Admin Center */}
        <Link
          href="/core-team-panel"
          className="w-full p-2.5 rounded-xl bg-cyan-950/40 hover:bg-cyan-900/50 border border-cyan-500/30 text-cyan-300 hover:text-cyan-200 text-xs font-mono font-bold transition flex items-center justify-between group cursor-pointer"
        >
          <div className="flex items-center gap-2">
            <ShieldCheck className="w-4 h-4 text-cyan-400" />
            <div className="text-left">
              <div className="text-[11px] leading-none font-bold">SWITCH TO ZEN.ADMIN</div>
              <div className="text-[9px] text-cyan-400/70 font-normal pt-0.5">Staff Operations Desk</div>
            </div>
          </div>
          <ArrowUpRight className="w-3.5 h-3.5 text-cyan-400 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition" />
        </Link>

        {/* Exit to Public Feed */}
        <Link
          href="/pulse"
          className="w-full py-2.5 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-neutral-300 hover:text-white font-mono text-xs font-bold transition flex items-center justify-center gap-2 cursor-pointer"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>Exit to Public Feed</span>
        </Link>
      </div>
    </aside>
  );
};
