'use client';

import React, { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Radio,
  MessageSquare,
  Calendar,
  Newspaper,
  LogOut,
  Crown,
  PanelLeftClose,
  PanelLeftOpen,
  Search,
  Bookmark,
  User,
  PlusCircle,
  Sparkles,
  Heart,
  Film,
  Camera,
  BarChart3,
  Settings,
  PlusSquare,
  Award,
  ShieldCheck,
  Bell,
  Menu,
  Activity,
  Moon,
  Clock,
  AlertCircle,
  Users,
  Repeat,
  ChevronDown,
  Globe2,
  BookOpen,
  X
} from 'lucide-react';
import { FloatingChatDrawer } from '@/components/chat/FloatingChatDrawer';
import { SecurityShieldModal } from '@/components/security/SecurityShieldModal';
import { SettingsModal } from '@/components/settings/SettingsModal';
import { SwitchAppearanceModal } from '@/components/modals/SwitchAppearanceModal';
import { ReportProblemModal } from '@/components/modals/ReportProblemModal';
import { ScheduledContentModal } from '@/components/modals/ScheduledContentModal';
import { SwitchAccountModal } from '@/components/pulse/SwitchAccountModal';
import { MobileBottomNav } from '@/components/navigation/MobileBottomNav';
import { NotificationBell } from '@/components/navigation/NotificationBell';
import SocialHoverMenu from '@/components/home/SocialHoverMenu';
import { SocialMindMapModal } from '@/components/home/SocialMindMapModal';
import { useAuth } from '@/context/AuthContext';
import { useZenPulse } from '@/context/ZenPulsePlatformContext';
import { Navbar } from '@/components/layout/Navbar';

interface PlatformShellProps {
  session: any;
  children: React.ReactNode;
  isFounder: boolean;
}

export function PlatformShell({
  session,
  children,
  isFounder,
}: PlatformShellProps) {
  const [isHovered, setIsHovered] = useState(false);
  const [isPinned, setIsPinned] = useState(false);
  const [isMobileOpen, setIsMobileOpen] = useState(false);
  const [securityModalOpen, setSecurityModalOpen] = useState(false);
  const [settingsModalOpen, setSettingsModalOpen] = useState(false);
  const [isMoreMenuOpen, setIsMoreMenuOpen] = useState(false);
  const [appearanceModalOpen, setAppearanceModalOpen] = useState(false);
  const [reportModalOpen, setReportModalOpen] = useState(false);
  const [scheduledModalOpen, setScheduledModalOpen] = useState(false);
  const [switchAccountModalOpen, setSwitchAccountModalOpen] = useState(false);
  const [socialMindMapOpen, setSocialMindMapOpen] = useState(false);
  const [showTopHeader, setShowTopHeader] = useState(true);
  const pathname = usePathname();
  const router = useRouter();
  const { profile, isMockMode, exitMockMode, signOut, isLoading } = useAuth();
  const { myProfile } = useZenPulse();

  // Smart scroll auto-hide & mouse cursor top reveal
  useEffect(() => {
    let lastScrollY = window.scrollY;

    const handleScroll = () => {
      const currentScrollY = window.scrollY;
      if (currentScrollY > 80 && currentScrollY > lastScrollY) {
        setShowTopHeader(false);
      } else {
        setShowTopHeader(true);
      }
      lastScrollY = currentScrollY;
    };

    const handleMouseMove = (e: MouseEvent) => {
      if (e.clientY <= 60) {
        setShowTopHeader(true);
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    window.addEventListener('mousemove', handleMouseMove, { passive: true });
    return () => {
      window.removeEventListener('scroll', handleScroll);
      window.removeEventListener('mousemove', handleMouseMove);
    };
  }, []);

  const [mounted, setMounted] = useState(false);
  const [localUser, setLocalUser] = useState<{ name: string; username: string; isGuest?: boolean; avatar?: string } | null>(null);

  useEffect(() => {
    setMounted(true);
    try {
      const stored = JSON.parse(localStorage.getItem('zenvitra_session_user') || '{}');
      const pulseProfile = JSON.parse(localStorage.getItem('zenvitra_pulse_my_profile_v1') || '{}');
      let fallbackAvatar = stored.avatar || stored.avatar_url || pulseProfile.avatar || '';

      if (!fallbackAvatar) {
        try {
          const profiles = JSON.parse(
            localStorage.getItem('zenvitra_pulse_profiles_v9_clean') || 
            localStorage.getItem('zenvitra_pulse_profiles_v8_sovereign') || 
            '[]'
          );
          const cleanUser = (stored.username || stored.handle || pulseProfile.username || '').toLowerCase().trim().replace(/^@/, '');
          const myP = profiles.find((p: any) => (p.username && p.username.toLowerCase().trim().replace(/^@/, '') === cleanUser) || p.username === 'yuveer');
          if (myP?.avatar) fallbackAvatar = myP.avatar;
        } catch (_) {}
      }

      if (stored?.username || stored?.display_name || pulseProfile?.username || fallbackAvatar) {
        setLocalUser({
          name: stored.display_name || stored.name || stored.username || pulseProfile.name || '',
          username: stored.username || stored.handle || pulseProfile.username || '',
          isGuest: Boolean(stored.isGuest || stored.role === 'guest' || stored.role === 'GUEST'),
          avatar: fallbackAvatar,
        });
      }
    } catch (_) {}
  }, []);

  // Route protection: If completely unauthenticated and not a guest, route to login
  useEffect(() => {
    if (isLoading) return;
    try {
      const stored = localStorage.getItem('zenvitra_session_user');
      const hasAnySession = Boolean(profile || session?.user || stored);
      if (!hasAnySession) {
        const returnUrl = encodeURIComponent(pathname || '/pulse');
        router.replace(`/login?redirect=${returnUrl}`);
      }
    } catch (_) {}
  }, [profile, session, pathname, router, isLoading]);

  const isGuest = Boolean(
    profile?.isGuest ||
    profile?.role === 'guest' ||
    profile?.role === 'GUEST' ||
    (mounted && localUser?.isGuest)
  );

  const currentDisplayName = 
    profile?.display_name || 
    (profile as any)?.name || 
    session?.user?.name || 
    session?.user?.user_metadata?.full_name || 
    session?.user?.user_metadata?.name || 
    (mounted ? localUser?.name : '') || 
    (session?.user?.email ? session.user.email.split('@')[0] : '');

  const currentUsername = 
    profile?.username || 
    (profile as any)?.handle || 
    (session?.user as any)?.username || 
    session?.user?.user_metadata?.user_name || 
    session?.user?.user_metadata?.username || 
    (mounted ? localUser?.username : '') || 
    (session?.user?.email ? session.user.email.split('@')[0].replace(/[^a-zA-Z0-9_]/g, '').toLowerCase() : '');

  const currentAvatar = 
    myProfile?.avatar || 
    profile?.avatar_url || 
    (profile as any)?.avatar || 
    (session?.user as any)?.image || 
    (session?.user?.user_metadata as any)?.avatar_url || 
    (mounted ? localUser?.avatar : '') || 
    '';

  const currentInitial = (currentDisplayName || currentUsername || 'U').charAt(0).toUpperCase() || 'U';

  const isExpanded = isPinned || isHovered || isMobileOpen;

  const hoverTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  const handleMouseEnter = () => {
    if (hoverTimeoutRef.current) {
      clearTimeout(hoverTimeoutRef.current);
      hoverTimeoutRef.current = null;
    }
    setIsHovered(true);
  };

  const handleMouseLeave = () => {
    if (isPinned) return;
    if (hoverTimeoutRef.current) {
      clearTimeout(hoverTimeoutRef.current);
    }
    hoverTimeoutRef.current = setTimeout(() => {
      setIsHovered(false);
      setIsMoreMenuOpen(false);
    }, 150);
  };

  useEffect(() => {
    return () => {
      if (hoverTimeoutRef.current) clearTimeout(hoverTimeoutRef.current);
    };
  }, []);

  // Collapse navigation on route transition
  useEffect(() => {
    setIsHovered(false);
    setIsMobileOpen(false);
    setIsMoreMenuOpen(false);
  }, [pathname]);

  // Auto-dismiss More menu when cursor leaves sidebar or sidebar collapses
  useEffect(() => {
    if (!isHovered && !isPinned && !isMobileOpen) {
      setIsMoreMenuOpen(false);
    }
  }, [isHovered, isPinned, isMobileOpen]);

  // Strict Founder Access: Hidden for all regular users, delegates, and core team.
  // ONLY visible when authenticated specifically as founder@zenvitra.org.
  const hasFounderPrivileges = Boolean(
    profile?.email?.trim().toLowerCase() === 'founder@zenvitra.org' ||
    session?.user?.email?.trim().toLowerCase() === 'founder@zenvitra.org'
  );

  const navItems = [
    { label: 'Home', href: '/pulse', icon: Radio, description: 'Feed Stream' },
    { label: 'FLUX', href: '/pulse?tab=flux', icon: Film, description: 'FLUX Video Reels' },
    { label: 'Messages', href: '/chat', icon: MessageSquare, description: 'ZEN.CHAT' },
    { label: 'Search', href: '/pulse?tab=explore', icon: Search, description: 'Search & Nodes' },
    { label: 'ZEN.GLIMPSE', href: '/glimpse', icon: Camera, tag: '24h', description: 'Snaps App' },
    { label: 'Dashboard', href: '/dashboard', icon: BarChart3, description: 'Adaptive Matrix' },
    { label: 'Events', href: '/events', icon: Calendar, description: 'Summits & Gatherings' },
    { label: 'Chamber', href: '/committee', icon: Award, tag: 'Live', description: 'Assembly Chamber' },
    { label: 'Docs', href: '/docs', icon: BookOpen, description: 'Sovereign Documents & Drafting' },
    { label: 'Press', href: '/press', icon: Newspaper, description: 'Open Newsroom' },
    { label: 'Profile', href: '/pulse?tab=profile', icon: User, description: 'Your Profile' },
  ];

  const isActive = (href: string) => pathname === href || (href !== '/' && pathname?.startsWith(href));

  return (
    <div className="min-h-screen bg-black text-white flex flex-col md:flex-row font-sans relative selection:bg-white/20 selection:text-white">
      {/* ─── THREE LINES HAMBURGER TRIGGER BUTTON (COLLAPSED DEFAULT) ─── */}
      <button
        type="button"
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
        onClick={() => {
          if (isExpanded) {
            setIsHovered(false);
            setIsPinned(false);
            setIsMobileOpen(false);
          } else {
            setIsHovered(true);
            setIsMobileOpen(true);
          }
        }}
        className={`fixed top-3.5 left-3.5 z-[105] h-10 w-10 rounded-xl flex items-center justify-center cursor-pointer transition-all duration-200 border backdrop-blur-2xl shadow-xl ${
          isExpanded
            ? 'bg-white text-black border-white shadow-[0_0_20px_rgba(255,255,255,0.4)] scale-105'
            : 'bg-[#080a10]/90 hover:bg-zinc-800/90 text-zinc-300 hover:text-white border-white/15 hover:border-white/30 hover:scale-105'
        }`}
        title="Navigation Menu (Hover or click to open)"
        aria-label="Toggle Navigation Menu"
      >
        <Menu className="w-5 h-5" />
      </button>

      {/* ─── BACKDROP (WHEN EXPANDED ON DESKTOP HOVER OR MOBILE) ─── */}
      <AnimatePresence>
        {isExpanded && !isPinned && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.18 }}
            onClick={() => {
              setIsHovered(false);
              setIsMobileOpen(false);
            }}
            className="fixed inset-0 bg-black/50 backdrop-blur-[2px] z-[108]"
          />
        )}
      </AnimatePresence>

      {/* ─── SIDEBAR DRAWER (COLLAPSED TO 3-LINES BUTTON BY DEFAULT, EXPANDS ON HOVER) ─── */}
      <motion.aside
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
        initial={false}
        animate={{
          x: isExpanded ? 0 : -320,
          opacity: isExpanded ? 1 : 0,
          pointerEvents: isExpanded ? 'auto' : 'none',
        }}
        transition={{ duration: 0.22, ease: [0.16, 1, 0.3, 1] }}
        className="bg-[#05070d]/98 backdrop-blur-3xl border-r border-zinc-800/90 p-3.5 flex flex-col justify-between shrink-0 select-none z-[110] fixed top-0 left-0 h-screen max-h-screen overflow-y-auto no-scrollbar shadow-[25px_0_70px_rgba(0,0,0,0.95)] w-[275px] max-w-[85vw]"
      >
        <div className="space-y-6">
          {/* Brand Logo & Pin/Lock / Close Toggle */}
          <div className="flex items-center justify-between px-1.5 pt-1.5">
            <Link
              href="/"
              onClick={() => {
                setIsHovered(false);
                setIsMobileOpen(false);
              }}
              className="flex items-center gap-3 group min-w-0"
            >
              <div className="w-8 h-8 flex items-center justify-center shrink-0 group-hover:scale-105 transition-transform">
                <img src="/assets/logo.png" alt="Zenvitra Logo" className="w-full h-full object-contain filter drop-shadow-[0_0_8px_rgba(255,255,255,0.25)]" />
              </div>

              <div className="flex flex-col min-w-0">
                <span 
                  className="uppercase text-[#f5f1ea] font-bold group-hover:text-white transition-colors tracking-[0.14em] truncate text-base leading-none"
                  style={{
                    fontFamily: 'Clash Display, var(--font-space), sans-serif',
                    fontWeight: 700,
                  }}
                >
                  ZENVITRA
                </span>
              </div>
            </Link>

            <div className="flex items-center gap-1">
              <button
                type="button"
                onClick={() => setIsPinned(!isPinned)}
                className="hidden md:flex p-1.5 rounded-lg text-zinc-400 hover:text-white hover:bg-zinc-800/80 transition cursor-pointer"
                title={isPinned ? 'Unpin Sidebar (Auto-collapse on mouse leave)' : 'Pin Sidebar Open'}
              >
                {isPinned ? <PanelLeftClose className="w-4 h-4 text-cyan-400" /> : <PanelLeftOpen className="w-4 h-4" />}
              </button>

              <button
                type="button"
                onClick={() => {
                  setIsHovered(false);
                  setIsMobileOpen(false);
                  setIsPinned(false);
                }}
                className="p-1.5 rounded-lg text-zinc-400 hover:text-white hover:bg-zinc-800/80 transition cursor-pointer"
                title="Collapse Sidebar"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Navigation Links */}
          <nav className="space-y-1 pt-2">
            {navItems.map((item) => {
              const Icon = item.icon;
              const active = isActive(item.href);
              return (
                <Link
                  key={item.label}
                  href={item.href}
                  onClick={() => {
                    setIsHovered(false);
                    setIsMobileOpen(false);
                    if (item.label === 'Home' && typeof window !== 'undefined') {
                      window.dispatchEvent(new CustomEvent('zenvitra-nav-feed'));
                    }
                  }}
                  className={`flex items-center justify-start gap-3.5 px-3 py-2.5 rounded-xl transition-all duration-150 group relative ${
                    active
                      ? 'bg-zinc-900 text-white font-semibold shadow-inner'
                      : 'text-zinc-400 hover:text-white hover:bg-zinc-900/60'
                  }`}
                  title={item.description}
                >
                  <Icon
                    className={`w-5 h-5 shrink-0 transition-transform ${
                      active ? 'text-white scale-105' : 'text-zinc-400 group-hover:text-white'
                    }`}
                  />
                  <div className="flex items-center justify-between flex-1 min-w-0">
                    <span className="text-xs tracking-tight truncate">
                      {item.label}
                    </span>
                    {(item as any).tag && (
                      <span className="px-1.5 py-0.2 bg-pink-500/20 text-pink-300 border border-pink-500/30 rounded text-[9px] font-mono font-bold">
                        {(item as any).tag}
                      </span>
                    )}
                  </div>
                </Link>
              );
            })}

            {/* Sidebar Divider */}
            <div className="pt-2 pb-1">
              <div className="h-[1px] bg-zinc-800/80 w-full" />
            </div>

            {/* Settings & Preferences */}
            <button
              type="button"
              onClick={() => {
                setIsHovered(false);
                setIsMobileOpen(false);
                setSettingsModalOpen(true);
              }}
              className="w-full flex items-center justify-start gap-3.5 px-3 py-2.5 rounded-xl transition-all duration-150 group cursor-pointer text-zinc-400 hover:text-white hover:bg-zinc-900/60"
            >
              <Settings className="w-5 h-5 text-zinc-400 group-hover:text-white transition-transform shrink-0" />
              <span className="text-xs tracking-tight truncate">
                Settings / More
              </span>
            </button>

            {/* Sovereign Security & Anti-Theft Shield */}
            <button
              type="button"
              onClick={() => {
                setIsHovered(false);
                setIsMobileOpen(false);
                setSecurityModalOpen(true);
              }}
              className="w-full flex items-center justify-start gap-3.5 px-3 py-2.5 rounded-xl transition-all duration-150 group cursor-pointer text-cyan-400 hover:text-cyan-300 hover:bg-cyan-500/10 border border-transparent hover:border-cyan-500/20"
            >
              <ShieldCheck className="w-5 h-5 text-cyan-400 group-hover:scale-110 transition-transform shrink-0" />
              <span className="text-xs font-semibold tracking-tight truncate text-cyan-300">
                Security Shield
              </span>
            </button>

            {/* Founders Hub — STRICTLY VISIBLE ONLY TO founder@zenvitra.org */}
            {hasFounderPrivileges && (
              <Link
                href="/zen-vault-root"
                onClick={() => {
                  setIsHovered(false);
                  setIsMobileOpen(false);
                }}
                className="w-full flex items-center justify-start gap-3.5 px-3 py-2.5 rounded-xl transition-all duration-150 group cursor-pointer bg-rose-500/15 hover:bg-rose-500/25 text-rose-300 border border-rose-500/30 hover:border-rose-500/50 shadow-[0_0_15px_rgba(244,63,94,0.2)]"
              >
                <Crown className="w-5 h-5 text-rose-400 group-hover:scale-110 transition-transform shrink-0" />
                <div className="flex items-center justify-between flex-1 min-w-0">
                  <span className="text-xs font-bold tracking-tight truncate text-rose-200 uppercase">
                    Founders Hub
                  </span>
                  <span className="px-1.5 py-0.5 bg-rose-500/30 text-rose-200 border border-rose-500/40 rounded text-[9px] font-mono font-bold">
                    ROOT
                  </span>
                </div>
              </Link>
            )}
          </nav>
        </div>

        {/* ─── INSTAGRAM-STYLE "MORE" POPOVER & FOOTER ─── */}
        <div className="pt-4 border-t border-zinc-800/60 space-y-2 relative">
          
          {/* ── POPUP MENU (OPENS ABOVE "MORE") ── */}
          <AnimatePresence>
            {isMoreMenuOpen && isExpanded && (
              <>
                {/* Invisible backdrop to dismiss on click outside */}
                <div
                  onClick={() => setIsMoreMenuOpen(false)}
                  className="fixed inset-0 z-40"
                />

                <motion.div
                  initial={{ opacity: 0, y: 10, scale: 0.96 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: 10, scale: 0.96 }}
                  transition={{ duration: 0.15, ease: [0.16, 1, 0.3, 1] }}
                  className="absolute bottom-full left-0 mb-2 w-[225px] max-h-[min(70vh,380px)] overflow-y-auto no-scrollbar bg-[#090a0f]/95 border border-white/15 rounded-2xl p-1.5 shadow-[0_20px_60px_rgba(0,0,0,0.95)] backdrop-blur-3xl z-50 text-white font-sans text-left space-y-0.5"
                >
                  {/* 1. Settings */}
                  <button
                    onClick={() => {
                      setIsMoreMenuOpen(false);
                      setSettingsModalOpen(true);
                    }}
                    className="w-full px-2.5 py-1.5 rounded-xl hover:bg-white/[0.08] transition flex items-center gap-2.5 text-xs font-medium cursor-pointer text-zinc-300 hover:text-white group"
                  >
                    <div className="p-1 rounded-lg bg-white/5 border border-white/10 group-hover:border-white/20">
                      <Settings className="w-3.5 h-3.5 text-zinc-300" />
                    </div>
                    <span>Settings</span>
                  </button>

                  {/* 2. Your activity */}
                  <Link
                    href="/your_activity"
                    onClick={() => setIsMoreMenuOpen(false)}
                    className="w-full px-2.5 py-1.5 rounded-xl hover:bg-white/[0.08] transition flex items-center gap-2.5 text-xs font-medium cursor-pointer text-zinc-300 hover:text-white group"
                  >
                    <div className="p-1 rounded-lg bg-emerald-500/10 border border-emerald-500/20 group-hover:border-emerald-500/40">
                      <Activity className="w-3.5 h-3.5 text-emerald-400" />
                    </div>
                    <span>Your activity</span>
                  </Link>

                  {/* 3. Saved */}
                  <Link
                    href="/pulse?tab=saved"
                    onClick={() => setIsMoreMenuOpen(false)}
                    className="w-full px-2.5 py-1.5 rounded-xl hover:bg-white/[0.08] transition flex items-center gap-2.5 text-xs font-medium cursor-pointer text-zinc-300 hover:text-white group"
                  >
                    <div className="p-1 rounded-lg bg-amber-500/10 border border-amber-500/20 group-hover:border-amber-500/40">
                      <Bookmark className="w-3.5 h-3.5 text-amber-400" />
                    </div>
                    <span>Saved</span>
                  </Link>

                  {/* 4. Switch appearance */}
                  <button
                    onClick={() => {
                      setIsMoreMenuOpen(false);
                      setAppearanceModalOpen(true);
                    }}
                    className="w-full px-2.5 py-1.5 rounded-xl hover:bg-white/[0.08] transition flex items-center gap-2.5 text-xs font-medium cursor-pointer text-zinc-300 hover:text-white group"
                  >
                    <div className="p-1 rounded-lg bg-purple-500/10 border border-purple-500/20 group-hover:border-purple-500/40">
                      <Moon className="w-3.5 h-3.5 text-purple-400" />
                    </div>
                    <span>Appearance</span>
                  </button>

                  {/* 5. Sovereign Security Shield */}
                  <button
                    onClick={() => {
                      setIsMoreMenuOpen(false);
                      setSecurityModalOpen(true);
                    }}
                    className="w-full px-2.5 py-1.5 rounded-xl hover:bg-cyan-500/15 text-cyan-300 transition flex items-center gap-2.5 text-xs font-medium cursor-pointer group"
                  >
                    <div className="p-1 rounded-lg bg-cyan-500/20 border border-cyan-500/40">
                      <ShieldCheck className="w-3.5 h-3.5 text-cyan-300" />
                    </div>
                    <span>Security Shield</span>
                  </button>

                  {/* 6. Report a problem */}
                  <button
                    onClick={() => {
                      setIsMoreMenuOpen(false);
                      setReportModalOpen(true);
                    }}
                    className="w-full px-2.5 py-1.5 rounded-xl hover:bg-white/[0.08] transition flex items-center gap-2.5 text-xs font-medium cursor-pointer text-zinc-400 hover:text-white group"
                  >
                    <div className="p-1 rounded-lg bg-rose-500/10 border border-rose-500/20 group-hover:border-rose-500/40">
                      <AlertCircle className="w-3.5 h-3.5 text-rose-400" />
                    </div>
                    <span>Report a problem</span>
                  </button>

                  {/* ── Divider ── */}
                  <div className="h-px bg-white/10 my-1" />

                  {/* 7. Switch Accounts */}
                  <button
                    onClick={() => {
                      setIsMoreMenuOpen(false);
                      setSwitchAccountModalOpen(true);
                    }}
                    className="w-full px-2.5 py-1.5 rounded-xl hover:bg-white/[0.08] transition flex items-center gap-2.5 text-xs font-medium cursor-pointer text-zinc-300 hover:text-white group"
                  >
                    <div className="p-1 rounded-lg bg-white/5 border border-white/10 group-hover:border-white/20">
                      <Users className="w-3.5 h-3.5 text-zinc-400" />
                    </div>
                    <span>Switch accounts</span>
                  </button>

                  {/* 8. Log Out */}
                  <button
                    onClick={async () => {
                      setIsMoreMenuOpen(false);
                      await signOut();
                      window.location.href = '/login';
                    }}
                    className="w-full px-2.5 py-1.5 rounded-xl hover:bg-rose-500/15 text-rose-400 hover:text-rose-300 transition flex items-center gap-2.5 text-xs font-semibold cursor-pointer group"
                  >
                    <div className="p-1 rounded-lg bg-rose-500/10 border border-rose-500/20">
                      <LogOut className="w-3.5 h-3.5 text-rose-400" />
                    </div>
                    <span>Log out</span>
                  </button>
                </motion.div>
              </>
            )}
          </AnimatePresence>

          {/* ── ☰ MORE BUTTON ── */}
          <button
            type="button"
            onClick={() => setIsMoreMenuOpen(!isMoreMenuOpen)}
            className={`w-full flex items-center justify-start gap-3.5 px-3.5 py-3 rounded-2xl transition-all duration-200 group cursor-pointer ${
              isMoreMenuOpen
                ? 'bg-white text-black font-bold shadow-[0_0_20px_rgba(255,255,255,0.3)]'
                : 'text-zinc-300 hover:text-white hover:bg-white/[0.06]'
            }`}
          >
            <Menu className={`w-5 h-5 shrink-0 transition-transform ${isMoreMenuOpen ? 'text-black' : 'text-zinc-300 group-hover:text-white'}`} />
            <span className="text-xs tracking-tight truncate font-bold">
              More
            </span>
          </button>

          {/* User Profile Snippet */}
          <Link
            href="/pulse?tab=profile"
            onClick={() => {
              setIsHovered(false);
              setIsMobileOpen(false);
            }}
            className="flex items-center rounded-2xl transition cursor-pointer group p-2.5 bg-white/[0.03] hover:bg-white/[0.08] border border-white/10 gap-3"
          >
            <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-amber-400 via-rose-500 to-fuchsia-600 p-[1.5px] shrink-0 group-hover:scale-105 transition-transform shadow-md">
              <div className="w-full h-full rounded-full bg-black flex items-center justify-center font-bold text-xs text-white uppercase overflow-hidden" suppressHydrationWarning>
                {mounted && currentAvatar ? (
                  <img src={currentAvatar} alt={currentDisplayName} className="w-full h-full rounded-full object-cover" />
                ) : (
                  currentInitial
                )}
              </div>
            </div>
            <div className="overflow-hidden min-w-0 flex-1 text-left" suppressHydrationWarning>
              <div className="flex items-center gap-1.5">
                <p className="text-xs font-semibold text-white group-hover:underline truncate" suppressHydrationWarning>{currentDisplayName}</p>
                {isGuest && (
                  <span className="px-1.5 py-0.2 rounded bg-purple-500/20 text-purple-300 font-mono text-[9px] font-bold shrink-0">
                    GUEST
                  </span>
                )}
              </div>
              <p className="text-[10px] text-zinc-500 truncate font-mono" suppressHydrationWarning>@{currentUsername}</p>
            </div>
          </Link>
        </div>
      </motion.aside>

      {/* ─── MAIN CONTENT VIEWPORT ─── */}
      <main className="flex-1 min-w-0 min-h-screen flex flex-col bg-black relative z-10">
        {/* Ambient Guest Node Notice Banner */}
        {isGuest && (
          <div className="bg-gradient-to-r from-purple-950/90 via-purple-900/60 to-black border-b border-purple-500/30 px-4 py-2.5 flex items-center justify-between text-xs font-mono shrink-0 z-30">
            <div className="flex items-center gap-2 text-purple-200">
              <Sparkles className="w-4 h-4 text-purple-400 shrink-0" />
              <span>
                Exploring as <strong>Guest Node (@{currentUsername})</strong> &bull; Dispatches enabled &bull; <span className="text-purple-300/80">Medals &amp; Dais voting locked</span>
              </span>
            </div>
            <Link
              href="/register"
              className="px-3 py-1 rounded-full bg-white text-black font-display font-bold text-[11px] hover:bg-neutral-200 transition shrink-0 ml-3 uppercase tracking-wider"
            >
              Connect Email / OAuth &rarr;
            </Link>
          </div>
        )}
        
        {/* Invisible Top Hover Trigger Zone: Re-engages Header when cursor moves to very top of page */}
        <div 
          className="fixed top-0 left-0 right-0 h-4 z-40 pointer-events-auto"
          onMouseEnter={() => setShowTopHeader(true)}
        />

        {/* Global Constant Homepage Navbar (Consistent across entire app, excluded on full-bleed studios) */}
        {!(
          pathname === '/pulse' || 
          pathname?.startsWith('/pulse') || 
          pathname === '/chat' || 
          pathname?.startsWith('/chat') ||
          pathname === '/docs' || 
          pathname?.startsWith('/docs')
        ) && (
          <div className="shrink-0 z-40">
            <Navbar hasPlatformSidebar={true} />
          </div>
        )}

        {/* Viewport Content */}
        {pathname === '/chat' || pathname?.startsWith('/chat') ? (
          <div className="flex-1 w-full h-[100dvh] min-h-[100dvh] overflow-hidden relative">
            {children}
          </div>
        ) : pathname === '/docs' || pathname?.startsWith('/docs') ? (
          <div className="flex-1 w-full overflow-y-auto relative pb-16 md:pb-4">
            <div className="relative z-10 w-full max-w-[1700px] mx-auto px-1 sm:px-4">
              {children}
            </div>
          </div>
        ) : (
          <div className={`flex-1 p-3 sm:p-6 pb-24 md:pb-6 overflow-y-auto relative ${
            !(
              pathname === '/pulse' || 
              pathname?.startsWith('/pulse')
            ) ? 'pt-20 sm:pt-24' : ''
          }`}>
            <div className="relative z-10 max-w-6xl mx-auto">
              {children}
            </div>
          </div>
        )}

        {/* ─── NATIVE MOBILE BOTTOM NAVIGATION (Instagram/Threads Style) ─── */}
        <MobileBottomNav />

        {/* ─── FLOATING COMMS DRAWER (ZEN.CHAT DOCK) ─── */}
        <FloatingChatDrawer />

        {/* ─── SOVEREIGN SECURITY & ANTI-THEFT MODAL ─── */}
        <SecurityShieldModal
          isOpen={securityModalOpen}
          onClose={() => setSecurityModalOpen(false)}
        />

        {/* ─── SOVEREIGN SETTINGS & PREFERENCES MODAL ─── */}
        <SettingsModal
          isOpen={settingsModalOpen}
          onClose={() => setSettingsModalOpen(false)}
          onOpenSecurityShield={() => setSecurityModalOpen(true)}
        />

        {/* ─── SWITCH APPEARANCE MODAL ─── */}
        <SwitchAppearanceModal
          isOpen={appearanceModalOpen}
          onClose={() => setAppearanceModalOpen(false)}
        />

        {/* ─── REPORT A PROBLEM MODAL ─── */}
        <ReportProblemModal
          isOpen={reportModalOpen}
          onClose={() => setReportModalOpen(false)}
        />

        {/* ─── SCHEDULED CONTENT MODAL ─── */}
        <ScheduledContentModal
          isOpen={scheduledModalOpen}
          onClose={() => setScheduledModalOpen(false)}
        />

        {/* ─── SWITCH ACCOUNTS MODAL ─── */}
        <SwitchAccountModal
          isOpen={switchAccountModalOpen}
          onClose={() => setSwitchAccountModalOpen(false)}
          currentUsername={currentUsername}
          currentDisplayName={currentDisplayName}
        />

        {/* ─── SOCIAL MIND MAP MODAL ─── */}
        <SocialMindMapModal
          isOpen={socialMindMapOpen}
          onClose={() => setSocialMindMapOpen(false)}
        />
      </main>
    </div>
  );
}
