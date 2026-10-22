'use client';

import React, { useState, useEffect, useRef, useMemo } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { 
  ArrowUpRight, 
  ArrowRight,
  Sparkles, 
  LogOut, 
  Radio, 
  Menu, 
  X,
  User,
  Flame,
  FileText,
  Calendar,
  Heart,
  Compass,
  LayoutDashboard,
  Crown,
  ShieldCheck,
  Trophy,
  Users,
  Scale,
  CreditCard,
  ChevronDown,
  Layers,
  Gavel,
  MessageSquare,
  BookOpen,
  Video,
  Globe,
  Award,
  Newspaper,
  Send,
  LifeBuoy,
  MessageCircle,
  Twitter,
  Cpu,
  Orbit,
  Target,
  ShieldAlert,
  Lock,
} from 'lucide-react';
import { useAuth } from '@/context/AuthContext';
import { SocialMindMapModal } from '@/components/home/SocialMindMapModal';
import SocialHoverMenu from '@/components/home/SocialHoverMenu';
import { EcosystemHoverMenu } from './EcosystemHoverMenu';
import { EcosystemMindMapModal } from './EcosystemMindMapModal';
import { SecurityShieldModal } from '@/components/security/SecurityShieldModal';
import { SwitchAccountModal } from '@/components/pulse/SwitchAccountModal';
import { NotificationBell } from '@/components/navigation/NotificationBell';
import { AdminOmniModal } from '@/components/founder/AdminOmniModal';
import { FounderOmniModal } from '@/components/founder/FounderOmniModal';
import { 
  isFounder as checkIsFounder, 
  isAdmin as checkIsAdmin,
  isFounderOrCoFounder,
  isCurrentSessionFounderOrCoFounder 
} from '@/lib/founderControl';
import { getTrialDetails } from '@/lib/subscriptionTiers';
import { motion, AnimatePresence } from 'framer-motion';

export interface NavbarProps {
  hasPlatformSidebar?: boolean;
  onTogglePlatformSidebar?: () => void;
  onMouseEnterPlatformSidebar?: () => void;
  onMouseLeavePlatformSidebar?: () => void;
  isPlatformSidebarExpanded?: boolean;
}

export function Navbar({
  hasPlatformSidebar = false,
  onTogglePlatformSidebar,
  onMouseEnterPlatformSidebar,
  onMouseLeavePlatformSidebar,
  isPlatformSidebarExpanded = false,
}: NavbarProps = {}) {
  const pathname = usePathname();
  const { profile, isAuthenticated, isMockMode, exitMockMode, signOut } = useAuth();
  const profileRef = useRef(profile);
  useEffect(() => {
    profileRef.current = profile;
  }, [profile]);

  const primaryNavLinks = [
    { name: 'About', href: '/about', icon: Sparkles },
    { name: 'Constitution', href: '/constitution', icon: Scale },
    { name: 'Discussions', href: '/discussions', icon: Radio },
    { name: 'Summits', href: '/events', icon: Calendar },
    { name: 'News', href: '/news', icon: FileText },
    { name: 'Pricing', href: '/pricing', icon: Crown },
  ];

  const secondaryNavLinks = [
    { name: 'About Zenvitra', href: '/about', icon: Sparkles, tag: 'Genesis', desc: 'The Foundational Architecture, 4 Chambers & Sovereign Mission' },
    { name: 'ZEN.APPS', href: '/apps', icon: Orbit, tag: 'Mind Map', desc: 'Interactive 360° Circular Ecosystem Mind Map & 7 Radial Clusters' },
    { name: 'Model UN CV', href: '/cv', icon: Award, tag: 'Dossier', desc: 'Sovereign Diplomatic MUN CV, Verified Accreditations & Track Record' },
    { name: "Who's Core Team", href: '/team', icon: Users, tag: 'Leadership', desc: "Who's Your Core Team? Sovereign Leadership, Co-Founders & Architects" },
    { name: 'ZEN.PASSPORT', href: '/passport', icon: ShieldCheck, tag: 'Identity', desc: 'Permanent Sovereign Identity, Verified Credentials & QR Terminal' },
    { name: 'ZEN.LEADERBOARD', href: '/leaderboard', icon: Trophy, tag: 'Rankings', desc: 'Verified Activity Leaderboards, Seasons, Merits & Recognition' },
    { name: 'ZEN.FORMS', href: '/forms', icon: FileText, tag: 'Studio', desc: 'Sovereign Form Studio, Shareable Templates & Direct Ledger Exports' },
    { name: 'ZEN.SPACE', href: '/space', icon: Globe, tag: 'Paused • Nov 25', desc: 'Paused Until Nov 25 — Something Special Coming Soon' },
    { name: 'Country Matrix', href: '/mun/matrix', icon: Layers, tag: 'Allocations', desc: 'Interactive Portfolios, Allotment Ledgers & Country Matrices' },
    { name: 'ZEN.CALL', href: '/call', icon: Video, tag: 'Encrypted AV', desc: 'Sovereign High-Fidelity Diplomatic Audio & Video Chambers' },
    { name: 'ZEN.MEET', href: '/meet', icon: Calendar, tag: 'Meetings', desc: 'Sovereign Meeting Scheduler, Virtual Stages & Waiting Rooms' },
    { name: 'ZEN.LEGISLATE', href: '/legislate', icon: Scale, tag: 'Lok Sabha', desc: 'Parliamentary Bill Drafting, Official Dispatches & Chamber Motions' },
    { name: 'ZEN.DOCS', href: '/docs', icon: BookOpen, tag: 'Workspace', desc: 'Sovereign Collaborative Drafting, Resolutions & Publishing' },
    { name: 'ZEN.PRESS', href: '/press', icon: Newspaper, tag: 'Bureau', desc: 'Open Publishing, Authentic Citations, Investigative Desks & Editorial Wire' },
    { name: 'Submit News Wire', href: '/news/submit', icon: Send, tag: 'Wire Desk', desc: 'Transmit Breaking Wire Dispatches & Press Reports across Network' },
    { name: 'ZEN.CHAT', href: '/chat', icon: MessageSquare, tag: 'Community', desc: 'Sovereign Diplomatic Mesh, Snaps, Voice & Caucuses' },
    { name: 'ZEN.SUPPORT', href: '/support', icon: LifeBuoy, tag: 'Helpdesk', desc: 'Official Helpdesk, Ticket Triage, Issue Resolution & Service Desk' },
    { name: 'ZEN.HOST', href: '/host', icon: Gavel, tag: 'Live OS', desc: 'Universal Live-Session & Event Operating System (Dais, Stage, Formats)' },
    { name: 'ZEN.PAYMENTS', href: '/payments', icon: CreditCard, tag: 'Financial Layer', desc: 'Unified Checkout, Invoices, Subscriptions & Payouts' },
    { name: 'Conference OS', href: '/mun/conference', icon: Layers, tag: 'Secretariat', desc: 'Secretariat Command Center & Liveboard' },
    { name: 'Impact Ledger', href: '/impact', icon: Heart, tag: 'Civic Escrow', desc: '10% Profit Endowment Distributed Every 6 Months with Video Proof' },
    { name: 'Our Mission', href: '/mission', icon: Target, tag: 'Manifesto', desc: 'A Generation That Deserves to be Heard: By Youth. For Youth. Youth Comes First.' },
    { name: 'Privacy Policy', href: '/privacy', icon: Lock, tag: 'Legal', desc: 'Zero Behavioral Surveillance, Cryptographic Privacy & RLS Security' },
    { name: 'Terms of Service', href: '/terms', icon: Scale, tag: 'Legal', desc: 'Decentralized Civic Operating System Terms & Conditions' },
  ];

  const allNavLinks = [...primaryNavLinks, ...secondaryNavLinks];

  const [showNavbar, setShowNavbar] = useState(true);
  const [socialMindMapOpen, setSocialMindMapOpen] = useState(false);
  const [ecosystemMindMapOpen, setEcosystemMindMapOpen] = useState(false);
  const [securityModalOpen, setSecurityModalOpen] = useState(false);
  const [switchAccountModalOpen, setSwitchAccountModalOpen] = useState(false);
  const [adminOmniModalOpen, setAdminOmniModalOpen] = useState(false);
  const [founderOmniModalOpen, setFounderOmniModalOpen] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [userDropdownOpen, setUserDropdownOpen] = useState(false);
  const [ecosystemDropdownOpen, setEcosystemDropdownOpen] = useState(false);

  const dropdownRef = useRef<HTMLDivElement>(null);
  const ecosystemRef = useRef<HTMLDivElement>(null);
  const ecosystemTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  const handleEcosystemEnter = () => {
    if (ecosystemTimeoutRef.current) clearTimeout(ecosystemTimeoutRef.current);
    setEcosystemDropdownOpen(true);
  };

  const handleEcosystemLeave = () => {
    ecosystemTimeoutRef.current = setTimeout(() => {
      setEcosystemDropdownOpen(false);
    }, 150);
  };

  // Auto-hide on scroll down, reveal on scroll up or at top of page
  useEffect(() => {
    let lastScrollY = window.scrollY;

    const handleScroll = () => {
      const currentScrollY = window.scrollY;
      if (currentScrollY <= 20) {
        setShowNavbar(true);
      } else if (currentScrollY > 80 && currentScrollY > lastScrollY) {
        setShowNavbar(false);
        setUserDropdownOpen(false);
      } else if (currentScrollY < lastScrollY) {
        setShowNavbar(true);
      }
      lastScrollY = currentScrollY;
    };

    const handleMouseMove = (e: MouseEvent) => {
      if (e.clientY <= 35) {
        setShowNavbar(true);
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    window.addEventListener('mousemove', handleMouseMove, { passive: true });
    return () => {
      window.removeEventListener('scroll', handleScroll);
      window.removeEventListener('mousemove', handleMouseMove);
    };
  }, []);

  // Close dropdown on outside click or ESC key
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setUserDropdownOpen(false);
      }
      if (ecosystemRef.current && !ecosystemRef.current.contains(event.target as Node)) {
        setEcosystemDropdownOpen(false);
      }
    }
    function handleKeyDown(event: KeyboardEvent) {
      if (event.key === 'Escape') {
        setUserDropdownOpen(false);
        setMobileMenuOpen(false);
        setEcosystemDropdownOpen(false);
      }
      // Founder & Co-Founder Sovereignty Shortcut (Ctrl+Shift+F or Cmd+Shift+F)
      // STRICT CLEARANCE: Only verified founders and co-founders using their own ID can open this menu
      if ((event.ctrlKey || event.metaKey) && event.shiftKey && (event.key === 'F' || event.key === 'f')) {
        event.preventDefault();
        const curProfile = profileRef.current;
        const isAuthorized =
          isCurrentSessionFounderOrCoFounder() ||
          isFounderOrCoFounder(curProfile?.username, curProfile?.role, curProfile?.id) ||
          isFounderOrCoFounder(curProfile?.email, curProfile?.role, curProfile?.id) || curProfile?.role === 'FOUNDER' || curProfile?.role === 'CO_FOUNDER';

        if (isAuthorized) {
          setFounderOmniModalOpen(true);
        }
      }
      // Admin & Operational Committee Shortcut (Ctrl+Shift+A or Cmd+Shift+A)
      if ((event.ctrlKey || event.metaKey) && event.shiftKey && (event.key === 'A' || event.key === 'a')) {
        event.preventDefault();
        const curProfile = profileRef.current;
        const isAuthorizedAdmin =
          isCurrentSessionFounderOrCoFounder() ||
          isFounderOrCoFounder(curProfile?.username, curProfile?.role, curProfile?.id) ||
          checkIsAdmin(curProfile?.username, curProfile?.role) ||
          checkIsAdmin(curProfile?.email, curProfile?.role) ||
          curProfile?.role === 'ADMIN' ||
          curProfile?.role === 'SECRETARIAT_CHAIR' ||
          curProfile?.role === 'FOUNDER' ||
          curProfile?.role === 'CO_FOUNDER';

        if (isAuthorizedAdmin) {
          setAdminOmniModalOpen(true);
        }
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    document.addEventListener('keydown', handleKeyDown);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, []);

  // Close mobile menu on pathname change
  useEffect(() => {
    setMobileMenuOpen(false);
    setUserDropdownOpen(false);
  }, [pathname]);

  const [localUserSession, setLocalUserSession] = useState<{ name?: string; username?: string; avatar?: string; role?: string } | null>(null);

  // Synchronize local session immediately on client mount and on storage/auth events
  useEffect(() => {
    const syncLocal = () => {
      try {
        const stored = localStorage.getItem('zenvitra_session_user') || localStorage.getItem('zenvitra_pulse_user_v6');
        if (stored) {
          const parsed = JSON.parse(stored);
          const rawAvatar = parsed.avatar_url || parsed.avatar;
          const cleanU = (parsed.username || '').toLowerCase().replace(/^@/, '').trim();

          let resolvedAvatar = (rawAvatar && rawAvatar !== '/assets/default-avatar.svg' && !rawAvatar.includes('default-avatar')) ? rawAvatar : '';
          if (!resolvedAvatar && cleanU) {
            try {
              const passRaw = localStorage.getItem(`zenvitra_passport_${cleanU}`);
              if (passRaw) {
                const pass = JSON.parse(passRaw);
                if (pass?.avatarUrl && pass.avatarUrl !== '/assets/default-avatar.svg') {
                  resolvedAvatar = pass.avatarUrl;
                }
              }
            } catch (_) {}
          }
          if (!resolvedAvatar) {
            try {
              const pulseRaw = localStorage.getItem('zenvitra_pulse_my_profile_v1');
              if (pulseRaw) {
                const pulse = JSON.parse(pulseRaw);
                if (pulse?.avatar && pulse.avatar !== '/assets/default-avatar.svg') {
                  resolvedAvatar = pulse.avatar;
                }
              }
            } catch (_) {}
          }
          if (!resolvedAvatar) {
            resolvedAvatar = '/assets/default-avatar.svg';
          }

          setLocalUserSession({
            name: parsed.display_name || parsed.name || parsed.username,
            username: parsed.username,
            avatar: resolvedAvatar,
            role: parsed.role,
          });
        } else {
          setLocalUserSession(null);
        }
      } catch (_) {
        setLocalUserSession(null);
      }
    };

    syncLocal();
    window.addEventListener('storage', syncLocal);
    window.addEventListener('zenvitra_auth_change', syncLocal);
    window.addEventListener('zenvitra_passport_updated', syncLocal);
    window.addEventListener('zenvitra_profile_sync', syncLocal);
    return () => {
      window.removeEventListener('storage', syncLocal);
      window.removeEventListener('zenvitra_auth_change', syncLocal);
      window.removeEventListener('zenvitra_passport_updated', syncLocal);
      window.removeEventListener('zenvitra_profile_sync', syncLocal);
    };
  }, []);

  const handleSignOut = async () => {
    setUserDropdownOpen(false);
    setMobileMenuOpen(false);
    setLocalUserSession(null);
    const res = await signOut();
    if (res?.switchedTo) {
      window.location.reload();
    } else {
      window.location.href = '/login';
    }
  };

  const hasActiveSession = isAuthenticated || !!profile || !!localUserSession;
  const userIdentifier = (profile?.username || localUserSession?.username || profile?.email || (localUserSession as any)?.email || '').toLowerCase().trim();
  const userRoleVal = (profile?.role || localUserSession?.role || '') as string;
  const isFounder = checkIsFounder(userIdentifier, userRoleVal);
  const isAdminUser = checkIsAdmin(userIdentifier, userRoleVal);

  const isAuthorizedFounder = useMemo(() => {
    return (
      isCurrentSessionFounderOrCoFounder() ||
      isFounderOrCoFounder(userIdentifier, userRoleVal, profile?.id) ||
      userRoleVal === 'FOUNDER' ||
      userRoleVal === 'CO_FOUNDER'
    );
  }, [userIdentifier, userRoleVal, profile?.id]);

  const isAuthorizedAdmin = useMemo(() => {
    return (
      isAuthorizedFounder ||
      checkIsAdmin(userIdentifier, userRoleVal) ||
      userRoleVal === 'ADMIN' ||
      userRoleVal === 'SECRETARIAT_CHAIR'
    );
  }, [isAuthorizedFounder, userIdentifier, userRoleVal]);
  const displayName = profile?.display_name || profile?.username || localUserSession?.name || (profile?.email ? profile.email.split('@')[0] : 'Member');
  const userHandle = profile?.username || localUserSession?.username || 'member';
  const initial = (displayName ? displayName.charAt(0).toUpperCase() : '') || 'Z';

  const trialDetails = useMemo(() => {
    return getTrialDetails(userHandle);
  }, [userHandle]);

  const effectiveDisplayAvatar = useMemo(() => {
    const rawAvatar = profile?.avatar_url || localUserSession?.avatar;
    if (rawAvatar && rawAvatar !== '/assets/default-avatar.svg' && !rawAvatar.includes('default-avatar')) {
      return rawAvatar;
    }
    const cleanU = (userHandle || '').toLowerCase().replace(/^@/, '').trim();
    if (typeof window !== 'undefined' && cleanU) {
      try {
        const pass = JSON.parse(localStorage.getItem(`zenvitra_passport_${cleanU}`) || '{}');
        if (pass?.avatarUrl && pass.avatarUrl !== '/assets/default-avatar.svg') {
          return pass.avatarUrl;
        }
      } catch (_) {}
      try {
        const pulse = JSON.parse(localStorage.getItem('zenvitra_pulse_my_profile_v1') || '{}');
        if (pulse?.avatar && pulse.avatar !== '/assets/default-avatar.svg') {
          return pulse.avatar;
        }
      } catch (_) {}
    }
    return rawAvatar || '/assets/default-avatar.svg';
  }, [profile?.avatar_url, localUserSession?.avatar, userHandle]);

  return (
    <>
      {/* Invisible Top Hover Trigger Zone: Re-engages Navbar when cursor moves to very top of page */}
      <div 
        className="fixed top-0 left-0 right-0 h-4 z-[99] pointer-events-auto"
        onMouseEnter={() => setShowNavbar(true)}
      />

      <header
        className={`fixed left-0 top-0 z-[100] w-full transition-all duration-300 ease-out ${
          showNavbar ? 'translate-y-0 opacity-100' : '-translate-y-full opacity-0 pointer-events-none'
        }`}
      >
        {/* Backdrop Glass & Edge Glow */}
        <div className="absolute inset-0 bg-[#030405]/92 backdrop-blur-2xl" />
        <div className="absolute bottom-0 left-0 h-[1px] w-full bg-gradient-to-r from-transparent via-white/15 to-transparent" />

        {/* Navbar Container with 88% Zoom */}
        <nav 
          className="relative z-10 mx-auto flex h-16 sm:h-[68px] xl:h-[72px] w-full max-w-[1700px] items-center justify-between px-3 sm:px-4 lg:px-6 xl:px-8 [zoom:0.88]"
          style={{ zoom: '88%' }}
        >

          {/* LEFT: Brand Logo & Wordmark (with integrated Platform Drawer Toggle when hasPlatformSidebar=true) */}
          <div className="flex items-center shrink-0 mr-3 sm:mr-4 lg:mr-6 gap-2 sm:gap-2.5">
            {hasPlatformSidebar && (
              <button
                type="button"
                onClick={onTogglePlatformSidebar}
                onMouseEnter={onMouseEnterPlatformSidebar}
                onMouseLeave={onMouseLeavePlatformSidebar}
                className={`h-9 w-9 sm:h-10 sm:w-10 rounded-xl flex items-center justify-center cursor-pointer transition-all duration-200 border backdrop-blur-2xl shadow-md shrink-0 ${
                  isPlatformSidebarExpanded
                    ? 'bg-white text-black border-white shadow-[0_0_20px_rgba(255,255,255,0.4)] scale-105'
                    : 'bg-[#080a10]/90 hover:bg-zinc-800/90 text-zinc-300 hover:text-white border-white/15 hover:border-white/30 hover:scale-105'
                }`}
                title="Navigation Menu (Hover or click to open)"
                aria-label="Toggle Navigation Menu"
              >
                <Menu className="w-4 h-4 sm:w-5 sm:h-5" />
              </button>
            )}

            <Link href="/" className="group flex items-center gap-2.5 sm:gap-3">
              <div className="relative h-9 w-9 sm:h-10 sm:w-10 lg:h-11 lg:w-11 flex items-center justify-center shrink-0 transition-transform duration-300 group-hover:scale-105">
                <img
                  src="/assets/logo-new.png"
                  alt="Zenvitra Logo"
                  className="h-full w-full object-contain mix-blend-screen filter drop-shadow-[0_0_12px_rgba(255,255,255,0.3)] transition-opacity duration-300 brand-logo-img"
                />
              </div>

              <span
                className="uppercase text-[#f5f1ea] select-none tracking-[0.13em] sm:tracking-[0.15em] text-base sm:text-lg font-bold whitespace-nowrap group-hover:text-white transition-colors"
                style={{
                  fontFamily: 'Clash Display, var(--font-space), sans-serif',
                }}
              >
                ZENVITRA
              </span>
            </Link>
          </div>

          {/* CENTER-LEFT: Desktop Nav Links (Hidden below 1024px) */}
          <div className="hidden lg:flex items-center gap-1 xl:gap-2 mr-auto ml-1 sm:ml-3">
            {primaryNavLinks.map((link) => {
              const isActive = pathname === link.href || (link.href !== '/' && pathname.startsWith(link.href));

              return (
                <Link
                  key={link.name}
                  href={link.href}
                  className={`group relative px-2.5 xl:px-3 py-1.5 rounded-xl transition-all duration-200 flex items-center justify-center shrink-0 ${
                    isActive 
                      ? 'bg-white/[0.08] text-white font-medium' 
                      : 'text-neutral-400 hover:text-white hover:bg-white/[0.04]'
                  }`}
                >
                  <span className="font-display uppercase text-[11px] xl:text-xs font-bold tracking-[0.14em] transition-colors whitespace-nowrap">
                    {link.name}
                  </span>

                  {/* Active glowing indicator */}
                  <div
                    className={`absolute -bottom-1 left-2.5 right-2.5 h-[2px] rounded-full transition-all duration-300 origin-center ${
                      isActive
                        ? 'opacity-100 scale-x-100 bg-white shadow-[0_0_10px_rgba(255,255,255,0.9)]'
                        : 'opacity-0 scale-x-0 group-hover:opacity-100 group-hover:scale-x-100 bg-white/70 shadow-[0_0_8px_rgba(255,255,255,0.5)]'
                    }`}
                  />
                </Link>
              );
            })}

            {/* Flabbergasting Ecosystem & Social Command Menu */}
            <EcosystemHoverMenu 
              onOpenSocialModal={() => setSocialMindMapOpen(true)} 
              onOpenFullModal={() => setEcosystemMindMapOpen(true)} 
            />
          </div>

          {/* RIGHT: Actions & Authentication */}
          <div className="flex items-center gap-2 sm:gap-2.5 xl:gap-3 shrink-0 ml-auto">

            {/* 1. @zenvitra Social Hover Menu (Tablet & Desktop) */}
            <div className="hidden sm:block">
              <SocialHoverMenu onOpenFullModal={() => setSocialMindMapOpen(true)} />
            </div>

            {/* ZENVITRA Test Node Sandbox Launcher */}
            <Link
              href="/test-node"
              className="p-1.5 sm:p-2 rounded-full bg-cyan-500/10 hover:bg-cyan-500/20 text-cyan-300 border border-cyan-500/30 transition hover:scale-105 active:scale-95 flex items-center justify-center shrink-0"
              title="Launch ZENVITRA Test Node (Isolated Sandbox Orb)"
            >
              <Orbit className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-cyan-400 animate-spin" style={{ animationDuration: '14s' }} />
            </Link>

            {/* 2. Platform & Feed Link Button (Primary CTA) */}
            {hasActiveSession ? (
              <div className="flex items-center gap-1.5 sm:gap-2">
                <Link
                  href="/pulse"
                  className="group relative inline-flex items-center gap-1 sm:gap-1.5 h-7 sm:h-8.5 px-2.5 sm:px-4 rounded-full bg-white hover:bg-neutral-200 text-black font-display font-bold text-[10px] sm:text-xs tracking-wider uppercase transition-all duration-200 hover:scale-[1.02] hover:shadow-[0_0_20px_rgba(255,255,255,0.35)] active:scale-[0.98] whitespace-nowrap shrink-0 border border-white"
                >
                  <span className="hidden xs:inline sm:inline">Platform</span>
                  <span className="xs:hidden sm:hidden">Feed</span>
                  <ArrowRight className="w-3 h-3 sm:w-3.5 sm:h-3.5 text-black group-hover:translate-x-0.5 transition-transform" />
                </Link>
              </div>
            ) : (
              <Link
                href="/login"
                className="group relative inline-flex items-center gap-1.5 h-8 sm:h-8.5 px-3 sm:px-4 rounded-full bg-white hover:bg-neutral-200 text-black font-display font-bold text-[11px] sm:text-xs tracking-wider uppercase transition-all duration-200 hover:scale-[1.02] hover:shadow-[0_0_20px_rgba(255,255,255,0.35)] active:scale-[0.98] whitespace-nowrap shrink-0 border border-white"
              >
                <span>Sign In</span>
                <ArrowRight className="w-3.5 h-3.5 text-black group-hover:translate-x-0.5 transition-transform" />
              </Link>
            )}

            {/* 3. Global Notification Bell */}
            <NotificationBell />

            {/* 4. Auth CTA & User Dropdown */}
            {hasActiveSession && (
              <div className="flex items-center gap-2 sm:gap-2.5">
                {/* Clean Circular User Profile Trigger */}
                <div className="relative" ref={dropdownRef}>
                  <button
                    type="button"
                    onClick={() => setUserDropdownOpen(!userDropdownOpen)}
                    className="h-8 w-8 sm:h-8.5 sm:w-8.5 rounded-full bg-gradient-to-tr from-white/15 to-white/5 hover:from-white/25 hover:to-white/10 border border-white/25 hover:border-white/50 transition-all duration-200 flex items-center justify-center cursor-pointer shadow-[0_0_15px_rgba(0,0,0,0.6)] hover:scale-105 active:scale-95 shrink-0"
                    title={`Signed in as ${displayName}`}
                  >
                    {effectiveDisplayAvatar ? (
                      <img
                        src={effectiveDisplayAvatar}
                        alt={displayName}
                        className="w-full h-full rounded-full object-cover"
                      />
                    ) : (
                      <img
                        src="/assets/default-avatar.svg"
                        alt={displayName}
                        className="w-full h-full rounded-full object-cover"
                      />
                    )}
                  </button>

                  {/* Dropdown Menu */}
                  <AnimatePresence>
                    {userDropdownOpen && (
                      <motion.div
                        initial={{ opacity: 0, y: 8, scale: 0.95 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: 8, scale: 0.95 }}
                        transition={{ duration: 0.15 }}
                        style={{ backgroundColor: '#07080d' }}
                        className="absolute right-0 top-11 w-64 rounded-2xl border border-white/15 bg-[#07080d] shadow-[0_25px_80px_rgba(0,0,0,0.98),0_0_40px_rgba(0,0,0,0.95)] p-2 z-[100] text-left"
                      >
                        <div className="p-2.5 border-b border-white/10 mb-1.5 bg-white/[0.04] rounded-xl space-y-1">
                          <div className="flex items-center justify-between gap-2">
                            <p className="text-xs font-bold text-white truncate">{displayName}</p>
                            {trialDetails.isTrial && trialDetails.isActive && (
                              <span className="text-[9px] font-mono px-2 py-0.5 rounded-full bg-purple-500/20 text-purple-300 font-bold border border-purple-500/30 shrink-0">
                                PRO TRIAL ({trialDetails.daysRemaining}D)
                              </span>
                            )}
                          </div>
                          <p className="text-[10px] font-mono text-neutral-400 capitalize">
                            @{userHandle} • {(profile?.role || localUserSession?.role || 'member').replace('_', ' ')}
                          </p>
                        </div>

                        <div className="space-y-1 text-xs font-medium text-neutral-300 font-sans">
                          {/* Founder Privilege Suite */}
                          {isAuthorizedFounder && (
                            <div className="p-1 mb-1.5 rounded-xl bg-amber-500/10 border border-amber-500/25 space-y-1">
                              <button
                                type="button"
                                onClick={() => {
                                  setUserDropdownOpen(false);
                                  setFounderOmniModalOpen(true);
                                }}
                                className="w-full px-2.5 py-1.5 rounded-lg bg-amber-400 text-black hover:bg-amber-300 font-bold transition flex items-center justify-between text-xs cursor-pointer shadow"
                              >
                                <div className="flex items-center gap-2 font-display uppercase tracking-wider text-[11px]">
                                  <Crown className="w-3.5 h-3.5 fill-black" />
                                  <span>Founder Suite</span>
                                </div>
                                <span className="text-[9px] font-mono opacity-80 font-bold">Ctrl+Shift+F</span>
                              </button>
                              <Link
                                href="/zen-vault-root"
                                onClick={() => setUserDropdownOpen(false)}
                                className="w-full px-2.5 py-1.5 rounded-lg hover:bg-amber-500/20 text-amber-200 transition flex items-center justify-between text-xs font-semibold"
                              >
                                <div className="flex items-center gap-2">
                                  <ShieldAlert className="w-3.5 h-3.5 text-amber-400" />
                                  <span>Founder Vault (Root 0)</span>
                                </div>
                                <ArrowUpRight className="w-3 h-3 opacity-60" />
                              </Link>
                            </div>
                          )}

                          {/* Admin & Core Team Operational Suite */}
                          {isAuthorizedAdmin && (
                            <div className="p-1 mb-1.5 rounded-xl bg-cyan-500/10 border border-cyan-500/25 space-y-1">
                              <button
                                type="button"
                                onClick={() => {
                                  setUserDropdownOpen(false);
                                  setAdminOmniModalOpen(true);
                                }}
                                className="w-full px-2.5 py-1.5 rounded-lg bg-cyan-500/20 text-cyan-200 hover:bg-cyan-500/30 hover:text-white font-bold transition flex items-center justify-between text-xs cursor-pointer border border-cyan-500/30"
                              >
                                <div className="flex items-center gap-2 font-display uppercase tracking-wider text-[11px]">
                                  <ShieldCheck className="w-3.5 h-3.5 text-cyan-400" />
                                  <span>Admin Console</span>
                                </div>
                                <span className="text-[9px] font-mono text-cyan-400 font-bold">Ctrl+Shift+A</span>
                              </button>
                              <Link
                                href="/core-team-panel"
                                onClick={() => setUserDropdownOpen(false)}
                                className="w-full px-2.5 py-1.5 rounded-lg hover:bg-cyan-500/20 text-cyan-200 transition flex items-center justify-between text-xs font-semibold"
                              >
                                <div className="flex items-center gap-2">
                                  <LayoutDashboard className="w-3.5 h-3.5 text-cyan-400" />
                                  <span>Core Team Control Room</span>
                                </div>
                                <ArrowUpRight className="w-3 h-3 opacity-60" />
                              </Link>
                            </div>
                          )}
                          <Link
                            href="/dashboard"
                            onClick={() => setUserDropdownOpen(false)}
                            className="w-full px-3 py-2 rounded-xl hover:bg-white/10 hover:text-white transition flex items-center gap-2"
                          >
                            <LayoutDashboard className="w-3.5 h-3.5 text-emerald-400" />
                            <span>Platform Dashboard</span>
                          </Link>
                          <Link
                            href="/pulse"
                            onClick={() => setUserDropdownOpen(false)}
                            className="w-full px-3 py-2 rounded-xl hover:bg-white/10 hover:text-white transition flex items-center gap-2"
                          >
                            <Radio className="w-3.5 h-3.5 text-purple-400" />
                            <span>Platform Feed</span>
                          </Link>
                          <Link
                            href="/passport"
                            onClick={() => setUserDropdownOpen(false)}
                            className="w-full px-3 py-2 rounded-xl hover:bg-white/10 hover:text-white transition flex items-center gap-2"
                          >
                            <ShieldCheck className="w-3.5 h-3.5 text-cyan-400" />
                            <span className="font-semibold text-cyan-200">🪪 ZEN.PASSPORT</span>
                          </Link>
                          <Link
                            href="/leaderboard"
                            onClick={() => setUserDropdownOpen(false)}
                            className="w-full px-3 py-2 rounded-xl hover:bg-white/10 hover:text-white transition flex items-center gap-2"
                          >
                            <Trophy className="w-3.5 h-3.5 text-amber-400" />
                            <span className="font-semibold text-amber-200">🏆 ZEN.LEADERBOARD</span>
                          </Link>
                          <Link
                            href="/chat"
                            onClick={() => setUserDropdownOpen(false)}
                            className="w-full px-3 py-2 rounded-xl hover:bg-white/10 hover:text-white transition flex items-center gap-2"
                          >
                            <MessageSquare className="w-3.5 h-3.5 text-cyan-400" />
                            <span>ZEN.CHAT</span>
                          </Link>
                          <Link
                            href={`/profile/${userHandle}`}
                            onClick={() => setUserDropdownOpen(false)}
                            className="w-full px-3 py-2 rounded-xl hover:bg-white/10 hover:text-white transition flex items-center gap-2"
                          >
                            <User className="w-3.5 h-3.5 text-cyan-400" />
                            <span>Profile Dossier</span>
                          </Link>
                          <Link
                            href="/onboarding"
                            onClick={() => setUserDropdownOpen(false)}
                            className="w-full px-3 py-2 rounded-xl hover:bg-white/10 text-cyan-300 hover:text-white transition flex items-center gap-2"
                          >
                            <Sparkles className="w-3.5 h-3.5 text-cyan-400" />
                            <span>ZENVITRA Onboarding Tour</span>
                          </Link>
                          <Link
                            href="/test-node"
                            onClick={() => setUserDropdownOpen(false)}
                            className="w-full px-3 py-2 rounded-xl bg-cyan-500/10 hover:bg-cyan-500/20 text-cyan-300 hover:text-white transition flex items-center gap-2 border border-cyan-500/20"
                          >
                            <Orbit className="w-3.5 h-3.5 text-cyan-400" />
                            <span className="font-semibold">🧪 ZENVITRA Test Node</span>
                          </Link>
                          <button
                            type="button"
                            onClick={() => {
                              setUserDropdownOpen(false);
                              setSwitchAccountModalOpen(true);
                            }}
                            className="w-full px-3 py-2 rounded-xl hover:bg-white/10 text-neutral-300 hover:text-white transition flex items-center gap-2 text-left cursor-pointer"
                          >
                            <Users className="w-3.5 h-3.5 text-indigo-400" />
                            <span>Switch Account</span>
                          </button>
                          <button
                            type="button"
                            onClick={() => {
                              setUserDropdownOpen(false);
                              setSecurityModalOpen(true);
                            }}
                            className="w-full px-3 py-2 rounded-xl hover:bg-cyan-500/10 text-cyan-300 hover:text-cyan-200 transition flex items-center gap-2 text-left cursor-pointer font-semibold"
                          >
                            <ShieldCheck className="w-3.5 h-3.5 text-cyan-400" />
                            <span>Security Shield</span>
                          </button>
                          <button
                            type="button"
                            onClick={handleSignOut}
                            className="w-full px-3 py-2 rounded-xl hover:bg-rose-500/15 text-rose-400 hover:text-rose-300 transition flex items-center gap-2 text-left cursor-pointer font-medium"
                          >
                            <LogOut className="w-3.5 h-3.5 text-rose-400" />
                            <span>Sign Out</span>
                          </button>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              </div>
            )}

            {/* Mobile Hamburger Toggle (Visible on screens < 1024px) */}
            <button
              type="button"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="lg:hidden h-8 w-8 sm:h-8.5 sm:w-8.5 flex items-center justify-center rounded-xl border border-white/15 bg-white/[0.04] text-neutral-300 hover:text-white transition cursor-pointer shrink-0"
              aria-label="Toggle navigation menu"
            >
              {mobileMenuOpen ? <X className="w-4 h-4" /> : <Menu className="w-4 h-4" />}
            </button>
          </div>
        </nav>

        {/* Mobile Dropdown Drawer */}
        <AnimatePresence>
          {mobileMenuOpen && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.25, ease: 'easeOut' }}
              className="lg:hidden border-b border-white/10 bg-[#060608]/98 backdrop-blur-3xl px-4 sm:px-6 py-5 space-y-4 text-left shadow-2xl max-h-[calc(100dvh-4.5rem)] overflow-y-auto overscroll-contain"
            >
              {/* Navigation Links Grid */}
              <div className="grid grid-cols-2 gap-2 font-display text-xs tracking-wider uppercase">
                {allNavLinks.map((link) => {
                  const Icon = link.icon;
                  const isActive = pathname === link.href || (link.href !== '/' && pathname.startsWith(link.href));
                  return (
                    <Link
                      key={link.name}
                      href={link.href}
                      onClick={() => setMobileMenuOpen(false)}
                      className={`p-3 rounded-xl border flex items-center gap-2 transition ${
                        isActive
                          ? 'bg-white/15 border-white/30 text-white font-bold'
                          : 'bg-white/[0.03] border-white/10 text-neutral-300 hover:bg-white/10 hover:text-white'
                      }`}
                    >
                      <Icon className="w-3.5 h-3.5 text-cyan-400 shrink-0" />
                      <span className="truncate">{link.name}</span>
                    </Link>
                  );
                })}
              </div>

              {/* Mobile Actions Stack */}
              <div className="flex flex-col gap-2 pt-2 border-t border-white/10 font-mono text-xs">
                {hasActiveSession ? (
                  <>
                    {/* Mobile Founder Suite */}
                    {isAuthorizedFounder && (
                      <div className="p-2 rounded-xl bg-amber-500/10 border border-amber-500/25 space-y-1.5 mb-1">
                        <button
                          type="button"
                          onClick={() => {
                            setMobileMenuOpen(false);
                            setFounderOmniModalOpen(true);
                          }}
                          className="w-full p-2.5 rounded-lg bg-amber-400 text-black font-bold flex items-center justify-between text-xs cursor-pointer"
                        >
                          <div className="flex items-center gap-2 font-display uppercase tracking-wider">
                            <Crown className="w-4 h-4 fill-black" />
                            <span>👑 ZEN FOUNDER SUITE</span>
                          </div>
                          <span className="text-[10px] font-mono bg-black/10 px-1.5 py-0.5 rounded">MODAL</span>
                        </button>
                        <Link
                          href="/zen-vault-root"
                          onClick={() => setMobileMenuOpen(false)}
                          className="w-full p-2 rounded-lg bg-amber-500/15 hover:bg-amber-500/25 text-amber-200 font-semibold flex items-center justify-between text-xs transition"
                        >
                          <div className="flex items-center gap-2">
                            <ShieldAlert className="w-3.5 h-3.5 text-amber-400" />
                            <span>🏛️ Founder Vault (Root 0)</span>
                          </div>
                          <ArrowRight className="w-3.5 h-3.5 opacity-60" />
                        </Link>
                      </div>
                    )}

                    {/* Mobile Admin Suite */}
                    {isAuthorizedAdmin && (
                      <div className="p-2 rounded-xl bg-cyan-500/10 border border-cyan-500/25 space-y-1.5 mb-1">
                        <button
                          type="button"
                          onClick={() => {
                            setMobileMenuOpen(false);
                            setAdminOmniModalOpen(true);
                          }}
                          className="w-full p-2.5 rounded-lg bg-cyan-500/20 border border-cyan-500/30 text-cyan-200 font-bold flex items-center justify-between text-xs cursor-pointer"
                        >
                          <div className="flex items-center gap-2 font-display uppercase tracking-wider">
                            <ShieldCheck className="w-4 h-4 text-cyan-400" />
                            <span>🛡️ ZEN ADMIN CONSOLE</span>
                          </div>
                          <span className="text-[10px] font-mono bg-cyan-400/10 px-1.5 py-0.5 rounded">MODAL</span>
                        </button>
                        <Link
                          href="/core-team-panel"
                          onClick={() => setMobileMenuOpen(false)}
                          className="w-full p-2 rounded-lg bg-cyan-500/15 hover:bg-cyan-500/25 text-cyan-200 font-semibold flex items-center justify-between text-xs transition"
                        >
                          <div className="flex items-center gap-2">
                            <LayoutDashboard className="w-3.5 h-3.5 text-cyan-400" />
                            <span>⚙️ Core Team Control Room</span>
                          </div>
                          <ArrowRight className="w-3.5 h-3.5 opacity-60" />
                        </Link>
                      </div>
                    )}
                    <Link
                      href="/pulse"
                      onClick={() => setMobileMenuOpen(false)}
                      className="w-full p-3 rounded-xl bg-white text-black flex items-center justify-between font-bold"
                    >
                      <div className="flex items-center gap-2 font-display uppercase tracking-wider">
                        <Radio className="w-4 h-4 text-black" />
                        <span>Enter Platform Feed</span>
                      </div>
                      <ArrowRight className="w-4 h-4" />
                    </Link>
                    <Link
                      href="/chat"
                      onClick={() => setMobileMenuOpen(false)}
                      className="w-full p-3 rounded-xl bg-purple-500/20 border border-purple-500/30 text-purple-200 flex items-center justify-between font-bold"
                    >
                      <div className="flex items-center gap-2 font-display uppercase tracking-wider">
                        <MessageSquare className="w-4 h-4 text-purple-400" />
                        <span>ZEN.CHAT</span>
                      </div>
                      <ArrowRight className="w-4 h-4" />
                    </Link>
                    <button
                      type="button"
                      onClick={handleSignOut}
                      className="w-full p-3 rounded-xl bg-rose-500/10 border border-rose-500/20 text-rose-300 flex items-center justify-between font-bold cursor-pointer hover:bg-rose-500/20 transition font-display uppercase tracking-wider"
                    >
                      <div className="flex items-center gap-2">
                        <LogOut className="w-4 h-4 text-rose-400" />
                        <span>Sign Out</span>
                      </div>
                      <ArrowRight className="w-4 h-4 opacity-50" />
                    </button>
                  </>
                ) : (
                  <Link
                    href="/login"
                    onClick={() => setMobileMenuOpen(false)}
                    className="w-full p-3 rounded-xl bg-white text-black flex items-center justify-between font-bold"
                  >
                    <div className="flex items-center gap-2 font-display uppercase tracking-wider">
                      <User className="w-4 h-4 text-black" />
                      <span>Sign In / Sovereign ID</span>
                    </div>
                    <ArrowRight className="w-4 h-4" />
                  </Link>
                )}

                <button
                  type="button"
                  onClick={() => {
                    setMobileMenuOpen(false);
                    setEcosystemMindMapOpen(true);
                  }}
                  className="w-full p-3 rounded-xl bg-gradient-to-r from-cyan-500/10 via-purple-500/10 to-amber-500/10 border border-cyan-500/30 text-cyan-200 flex items-center justify-between cursor-pointer hover:border-cyan-500/50 transition font-display uppercase tracking-wider text-xs"
                >
                  <div className="flex items-center gap-2">
                    <div className="w-5 h-5 rounded-md bg-gradient-to-tr from-cyan-500 via-purple-500 to-amber-500 p-[1px] flex items-center justify-center shrink-0">
                      <div className="w-full h-full bg-[#07090e] rounded-[4px] flex items-center justify-center">
                        <Cpu className="w-3 h-3 text-cyan-300 animate-pulse" />
                      </div>
                    </div>
                    <span>Nexus Core &bull; Ecosystem Deck</span>
                  </div>
                  <span className="text-[10px] text-cyan-300 font-mono">&rarr;</span>
                </button>

                <Link
                  href="/apps"
                  onClick={() => setMobileMenuOpen(false)}
                  className="w-full p-3 rounded-xl bg-purple-500/10 border border-purple-500/25 hover:border-purple-500/50 text-purple-200 flex items-center justify-between cursor-pointer hover:bg-purple-500/20 transition font-display uppercase tracking-wider text-xs"
                >
                  <div className="flex items-center gap-2">
                    <Orbit className="w-4 h-4 text-purple-300 animate-spin" style={{ animationDuration: '8s' }} />
                    <span>ZEN.APPS &bull; Circular Mind Map</span>
                  </div>
                  <span className="text-[10px] text-purple-300 font-mono">&rarr;</span>
                </Link>

                <button
                  type="button"
                  onClick={() => {
                    setMobileMenuOpen(false);
                    setSocialMindMapOpen(true);
                  }}
                  className="w-full p-3 rounded-xl bg-white/[0.04] border border-white/10 text-neutral-200 flex items-center justify-between cursor-pointer hover:bg-white/[0.08] transition"
                >
                  <div className="flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                    <span className="font-semibold text-white font-mono">zenvitra.xyz</span>
                  </div>
                  <span className="text-[10px] text-purple-300 font-mono">View All Social Nodes &rarr;</span>
                </button>

                {/* Mission, Privacy & Terms Quick Links */}
                <div className="grid grid-cols-3 gap-1.5 pt-1 text-[11px] font-mono text-center">
                  <Link
                    href="/mission"
                    onClick={() => setMobileMenuOpen(false)}
                    className="p-2 rounded-xl bg-white/[0.04] border border-white/10 hover:bg-white/10 text-neutral-300 hover:text-white transition flex items-center justify-center gap-1"
                  >
                    <Target className="w-3 h-3 text-cyan-400" />
                    <span>Mission</span>
                  </Link>
                  <Link
                    href="/privacy"
                    onClick={() => setMobileMenuOpen(false)}
                    className="p-2 rounded-xl bg-white/[0.04] border border-white/10 hover:bg-white/10 text-neutral-300 hover:text-white transition flex items-center justify-center gap-1"
                  >
                    <Lock className="w-3 h-3 text-emerald-400" />
                    <span>Privacy</span>
                  </Link>
                  <Link
                    href="/terms"
                    onClick={() => setMobileMenuOpen(false)}
                    className="p-2 rounded-xl bg-white/[0.04] border border-white/10 hover:bg-white/10 text-neutral-300 hover:text-white transition flex items-center justify-center gap-1"
                  >
                    <Scale className="w-3 h-3 text-amber-400" />
                    <span>Terms</span>
                  </Link>
                </div>

                {/* Direct WhatsApp Community & Twitter Links */}
                <div className="grid grid-cols-2 gap-2 pt-1">
                  <a
                    href="https://chat.whatsapp.com/Cmn9ihpEbRs7kLO1G83Fez"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="p-2.5 rounded-xl bg-emerald-500/10 border border-emerald-500/25 hover:border-emerald-500/50 text-emerald-300 flex items-center justify-center gap-2 text-xs font-semibold transition"
                  >
                    <MessageCircle className="w-3.5 h-3.5" />
                    <span>WhatsApp</span>
                  </a>
                  <a
                    href="https://x.com/zenvitra_"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="p-2.5 rounded-xl bg-sky-500/10 border border-sky-500/25 hover:border-sky-500/50 text-sky-300 flex items-center justify-center gap-2 text-xs font-semibold transition"
                  >
                    <Twitter className="w-3.5 h-3.5" />
                    <span>@zenvitra_</span>
                  </a>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </header>

      {/* Social Media Handles Mind Map Modal */}
      <SocialMindMapModal
        isOpen={socialMindMapOpen}
        onClose={() => setSocialMindMapOpen(false)}
      />

      {/* Comprehensive Ecosystem Command Mind Map Modal */}
      <EcosystemMindMapModal
        isOpen={ecosystemMindMapOpen}
        onClose={() => setEcosystemMindMapOpen(false)}
      />

      {/* Sovereign Security & Anti-Theft Shield Modal */}
      <SecurityShieldModal
        isOpen={securityModalOpen}
        onClose={() => setSecurityModalOpen(false)}
      />

      {/* Sovereign Switch Account Modal */}
      <SwitchAccountModal
        isOpen={switchAccountModalOpen}
        onClose={() => setSwitchAccountModalOpen(false)}
        currentUsername={userHandle}
        currentDisplayName={displayName}
        currentAvatar={effectiveDisplayAvatar}
      />

      {/* Operational Admin & Committee Modal */}
      <AdminOmniModal
        isOpen={adminOmniModalOpen}
        onClose={() => setAdminOmniModalOpen(false)}
        onOpenFounderMenu={() => { if (isCurrentSessionFounderOrCoFounder() || isFounderOrCoFounder(profile?.username, profile?.role, profile?.id)) { setFounderOmniModalOpen(true); } }}
      />

      {/* Supreme Founder Sovereignty Modal */}
      <FounderOmniModal
        isOpen={founderOmniModalOpen}
        onClose={() => setFounderOmniModalOpen(false)}
        onOpenAdminMenu={() => setAdminOmniModalOpen(true)}
      />
    </>
  );
}

export default Navbar;