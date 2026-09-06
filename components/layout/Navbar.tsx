'use client';

import React, { useState, useEffect, useRef } from 'react';
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
  Users,
  Scale,
  CreditCard,
  ChevronDown,
  Layers,
  Gavel,
  MessageSquare
} from 'lucide-react';
import { useAuth } from '@/context/AuthContext';
import { SocialMindMapModal } from '@/components/home/SocialMindMapModal';
import SocialHoverMenu from '@/components/home/SocialHoverMenu';
import { SecurityShieldModal } from '@/components/security/SecurityShieldModal';
import { SwitchAccountModal } from '@/components/pulse/SwitchAccountModal';
import { NotificationBell } from '@/components/navigation/NotificationBell';
import { AdminOmniModal } from '@/components/founder/AdminOmniModal';
import { FounderOmniModal } from '@/components/founder/FounderOmniModal';
import { isFounder as checkIsFounder, isAdmin as checkIsAdmin } from '@/lib/founderControl';
import { motion, AnimatePresence } from 'framer-motion';

export function Navbar() {
  const pathname = usePathname();
  const { profile, isAuthenticated, isMockMode, exitMockMode, signOut } = useAuth();

  const primaryNavLinks = [
    { name: 'Constitution', href: '/constitution', icon: Scale },
    { name: 'Discussions', href: '/discussions', icon: Radio },
    { name: 'Summits', href: '/events', icon: Calendar },
    { name: 'News', href: '/news', icon: FileText },
    { name: 'Pricing', href: '/pricing', icon: Crown },
  ];

  const secondaryNavLinks = [
    { name: 'ZEN.CHAT', href: '/chat', icon: MessageSquare, tag: 'Encrypted', desc: 'Sovereign Diplomatic Mesh, Snaps, Voice & Caucuses' },
    { name: 'ZEN.MUN', href: '/mun', icon: Crown, tag: 'OS', desc: 'Complete Model United Nations Operating System' },
    { name: 'Chamber', href: '/committee', icon: Gavel, tag: 'Live Dais', desc: 'Active Committee Dais, Motions & Voting' },
    { name: 'ZEN.DOCS', href: '/docs', icon: Scale, tag: 'Drafting Studio', desc: 'Co-Author UN Resolutions, Parliamentary Bills & Charters' },
    { name: 'ZEN.PAYMENTS', href: '/payments', icon: CreditCard, tag: 'Financial Layer', desc: 'Unified Checkout, Invoices, Subscriptions & Payouts' },
    { name: 'Conference OS', href: '/mun/conference', icon: Layers, tag: 'Secretariat', desc: 'Secretariat Command Center & Liveboard' },
    { name: 'Manifesto', href: '/manifesto', icon: Flame, tag: 'Declaration', desc: 'Declaration of Youth Digital Sovereignty' },
    { name: 'Impact', href: '/impact', icon: Heart, tag: 'Civic Escrow', desc: '25% Profit Endowment Distributed Every 4 Months with Video Proof' },
    { name: 'Solutions', href: '/solutions', icon: Sparkles, tag: 'Architecture', desc: 'Civic, Tech & Media Architecture' },
    { name: 'About', href: '/about', icon: Compass, tag: 'Governance', desc: 'Our Mission, Founders & Global Secretariat' },
  ];

  const allNavLinks = [...primaryNavLinks, ...secondaryNavLinks];

  const [showNavbar, setShowNavbar] = useState(true);
  const [socialMindMapOpen, setSocialMindMapOpen] = useState(false);
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

  // Auto-hide on scroll down, reveal on scroll up or mouse hovering top zone
  useEffect(() => {
    let lastScrollY = window.scrollY;

    const handleScroll = () => {
      const currentScrollY = window.scrollY;
      if (currentScrollY > 80 && currentScrollY > lastScrollY) {
        setShowNavbar(false);
        setUserDropdownOpen(false);
      } else {
        setShowNavbar(true);
      }
      lastScrollY = currentScrollY;
    };

    const handleMouseMove = (e: MouseEvent) => {
      // If mouse cursor moves up to the top 60px of the viewport, reveal the navbar immediately!
      if (e.clientY <= 60) {
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
          setLocalUserSession({
            name: parsed.display_name || parsed.name || parsed.username,
            username: parsed.username,
            avatar: parsed.avatar_url || parsed.avatar,
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
    return () => {
      window.removeEventListener('storage', syncLocal);
      window.removeEventListener('zenvitra_auth_change', syncLocal);
    };
  }, []);

  const handleSignOut = async () => {
    setUserDropdownOpen(false);
    setMobileMenuOpen(false);
    setLocalUserSession(null);
    await signOut();
    window.location.href = '/';
  };

  const hasActiveSession = isAuthenticated || !!profile || !!localUserSession;
  const userIdentifier = (profile?.username || localUserSession?.username || profile?.email || (localUserSession as any)?.email || '').toLowerCase().trim();
  const userRoleVal = (profile?.role || localUserSession?.role || '') as string;
  const isFounder = checkIsFounder(userIdentifier, userRoleVal);
  const isAdminUser = checkIsAdmin(userIdentifier, userRoleVal);
  const displayName = profile?.display_name || profile?.username || localUserSession?.name || (profile?.email ? profile.email.split('@')[0] : 'Member');
  const userHandle = profile?.username || localUserSession?.username || 'member';
  const initial = (displayName ? displayName.charAt(0).toUpperCase() : '') || 'Z';

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

        {/* Navbar Container */}
        <nav className="relative z-10 mx-auto flex h-16 sm:h-[68px] xl:h-[72px] w-full max-w-[1700px] items-center justify-between px-3.5 sm:px-6 lg:px-8">

          {/* LEFT: Brand Logo & Wordmark */}
          <div className="flex items-center shrink-0 mr-3 sm:mr-4 lg:mr-6">
            <Link href="/" className="group flex items-center gap-2 sm:gap-2.5">
              <div className="relative h-7 w-7 sm:h-8 sm:w-8 flex items-center justify-center shrink-0 transition-transform duration-300 group-hover:scale-105">
                <img
                  src="/assets/logo.png"
                  alt="Zenvitra Logo"
                  className="h-full w-full object-contain filter drop-shadow-[0_0_8px_rgba(255,255,255,0.25)] transition-opacity duration-300"
                />
              </div>

              <span
                className="uppercase text-[#f5f1ea] select-none tracking-[0.12em] sm:tracking-[0.14em] text-sm sm:text-base font-bold whitespace-nowrap group-hover:text-white transition-colors"
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

            {/* Ecosystem / More Dropdown */}
            <div
              ref={ecosystemRef}
              className="relative"
              onMouseEnter={handleEcosystemEnter}
              onMouseLeave={handleEcosystemLeave}
            >
              <button
                type="button"
                onClick={() => setEcosystemDropdownOpen(!ecosystemDropdownOpen)}
                className={`group relative px-2.5 xl:px-3 py-1.5 rounded-xl transition-all duration-200 flex items-center gap-1 shrink-0 cursor-pointer ${
                  secondaryNavLinks.some(link => pathname === link.href || (link.href !== '/' && pathname.startsWith(link.href))) || ecosystemDropdownOpen
                    ? 'bg-white/[0.08] text-white'
                    : 'text-neutral-400 hover:text-white hover:bg-white/[0.04]'
                }`}
              >
                <span className="font-display uppercase text-[11px] xl:text-xs font-bold tracking-[0.14em] transition-colors whitespace-nowrap">
                  Ecosystem
                </span>
                <ChevronDown
                  className={`w-3.5 h-3.5 transition-transform duration-200 ${
                    ecosystemDropdownOpen ? 'rotate-180 text-white' : 'text-neutral-400 group-hover:text-white'
                  }`}
                />

                {/* Active indicator */}
                <div
                  className={`absolute -bottom-1 left-2.5 right-2.5 h-[2px] rounded-full transition-all duration-300 origin-center ${
                    secondaryNavLinks.some(link => pathname === link.href || (link.href !== '/' && pathname.startsWith(link.href)))
                      ? 'opacity-100 scale-x-100 bg-white shadow-[0_0_10px_rgba(255,255,255,0.9)]'
                      : 'opacity-0 scale-x-0'
                  }`}
                />
              </button>

              <AnimatePresence>
                {ecosystemDropdownOpen && (
                  <motion.div
                    initial={{ opacity: 0, y: 6, scale: 0.96 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: 6, scale: 0.96 }}
                    transition={{ duration: 0.15 }}
                    className="absolute left-0 top-full mt-2 w-72 rounded-2xl border border-white/15 bg-[#08080c]/98 backdrop-blur-2xl shadow-[0_20px_50px_rgba(0,0,0,0.95)] p-2 z-50 text-left"
                  >
                    <div className="px-2.5 py-1.5 mb-1 border-b border-white/10 flex items-center justify-between">
                      <span className="text-[10px] font-mono uppercase tracking-wider text-neutral-400 font-bold">
                        FOUNDATIONAL CIVICS &amp; ECOSYSTEM
                      </span>
                    </div>

                    <div className="space-y-0.5">
                      {secondaryNavLinks.map((item) => {
                        const Icon = item.icon;
                        const isCurrent = pathname === item.href || (item.href !== '/' && pathname.startsWith(item.href));

                        return (
                          <Link
                            key={item.name}
                            href={item.href}
                            onClick={() => setEcosystemDropdownOpen(false)}
                            className={`p-2 rounded-xl transition flex items-start gap-2.5 ${
                              isCurrent
                                ? 'bg-white/10 text-white font-semibold'
                                : 'hover:bg-white/[0.06] text-neutral-300 hover:text-white'
                            }`}
                          >
                            <div className="w-7 h-7 rounded-lg bg-white/[0.06] border border-white/10 flex items-center justify-center shrink-0 mt-0.5 text-cyan-400">
                              <Icon className="w-3.5 h-3.5" />
                            </div>
                            <div className="min-w-0">
                              <div className="flex items-center gap-1.5">
                                <span className="text-xs font-semibold text-white">{item.name}</span>
                                {item.tag && (
                                  <span className="text-[9px] font-mono px-1.5 py-0.2 rounded bg-white/10 text-neutral-300">
                                    {item.tag}
                                  </span>
                                )}
                              </div>
                              <p className="text-[11px] text-neutral-400 truncate leading-tight mt-0.5 font-sans">
                                {item.desc}
                              </p>
                            </div>
                          </Link>
                        );
                      })}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>

          {/* RIGHT: Actions & Authentication */}
          <div className="flex items-center gap-2 sm:gap-2.5 xl:gap-3 shrink-0 ml-auto">

            {/* 1. @zenvitra Social Hover Menu (Tablet & Desktop) */}
            <div className="hidden sm:block">
              <SocialHoverMenu onOpenFullModal={() => setSocialMindMapOpen(true)} />
            </div>

            {/* 2. Platform & Chat Link Buttons (Primary CTAs) */}
            {hasActiveSession ? (
              <div className="flex items-center gap-1.5 sm:gap-2">
                <Link
                  href="/chat"
                  className="hidden md:inline-flex items-center gap-1.5 h-7 sm:h-8.5 px-3 rounded-full bg-white/[0.06] hover:bg-white/[0.12] border border-white/15 text-white font-display font-semibold text-[10px] sm:text-xs tracking-wider transition-all duration-200 hover:scale-[1.02] whitespace-nowrap shrink-0"
                  title="Open ZenChat Mesh"
                >
                  <MessageSquare className="w-3.5 h-3.5 text-cyan-400" />
                  <span>ZenChat</span>
                </Link>
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
                    {profile?.avatar_url || localUserSession?.avatar ? (
                      <img
                        src={profile?.avatar_url || localUserSession?.avatar}
                        alt={displayName}
                        className="w-full h-full rounded-full object-cover"
                      />
                    ) : (
                      <span className="font-display font-bold text-xs text-white tracking-wider">
                        {initial}
                      </span>
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
                        className="absolute right-0 top-11 w-60 rounded-2xl border border-white/15 bg-[#08080a]/98 backdrop-blur-2xl shadow-[0_20px_60px_rgba(0,0,0,0.95)] p-2 z-50 text-left"
                      >
                        <div className="p-2.5 border-b border-white/10 mb-1">
                          <p className="text-xs font-bold text-white truncate">{displayName}</p>
                          <p className="text-[10px] font-mono text-neutral-400 capitalize">
                            @{userHandle} • {(profile?.role || localUserSession?.role || 'member').replace('_', ' ')}
                          </p>
                        </div>

                        <div className="space-y-1 text-xs font-medium text-neutral-300 font-sans">
                          {isFounder && (
                            <div className="px-3 py-1.5 rounded-xl bg-gradient-to-r from-amber-500/20 via-purple-500/15 to-transparent border border-amber-400/40 text-amber-300 font-mono text-[10px] font-bold flex items-center justify-between shadow-[0_0_15px_rgba(251,191,36,0.2)]">
                              <span className="flex items-center gap-1.5">
                                <Crown className="w-3.5 h-3.5 text-amber-400" />
                                <span>UNIVERSAL FOUNDER PASS</span>
                              </span>
                              <span className="text-[9px] px-1.5 py-0.5 rounded bg-amber-400 text-black font-extrabold tracking-wider">
                                ALL UNLOCKED
                              </span>
                            </div>
                          )}
                          {isFounder && (
                            <button
                              type="button"
                              onClick={() => {
                                setUserDropdownOpen(false);
                                setFounderOmniModalOpen(true);
                              }}
                              className="w-full px-3 py-2 rounded-xl bg-amber-400/20 hover:bg-amber-400/30 text-amber-300 border border-amber-400/40 transition flex items-center gap-2 font-bold shadow-[0_0_15px_rgba(251,191,36,0.3)] text-left cursor-pointer"
                            >
                              <Crown className="w-3.5 h-3.5 text-amber-400" />
                              <span>👑 Founder Sovereign Menu</span>
                            </button>
                          )}
                          {isAdminUser && (
                            <button
                              type="button"
                              onClick={() => {
                                setUserDropdownOpen(false);
                                setAdminOmniModalOpen(true);
                              }}
                              className="w-full px-3 py-2 rounded-xl bg-cyan-500/15 hover:bg-cyan-500/25 text-cyan-300 border border-cyan-500/30 transition flex items-center gap-2 font-bold text-left cursor-pointer"
                            >
                              <ShieldCheck className="w-3.5 h-3.5 text-cyan-400" />
                              <span>🛡️ Admin Operational Menu</span>
                            </button>
                          )}
                          {isFounder && (
                            <Link
                              href="/zen-vault-root"
                              onClick={() => setUserDropdownOpen(false)}
                              className="w-full px-3 py-2 rounded-xl hover:bg-white/10 text-neutral-300 hover:text-white transition flex items-center gap-2 font-mono text-[11px]"
                            >
                              <ShieldCheck className="w-3.5 h-3.5 text-rose-400" />
                              <span>Sovereign Vault (Root)</span>
                            </Link>
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
                            href="/chat"
                            onClick={() => setUserDropdownOpen(false)}
                            className="w-full px-3 py-2 rounded-xl hover:bg-white/10 hover:text-white transition flex items-center gap-2"
                          >
                            <MessageSquare className="w-3.5 h-3.5 text-cyan-400" />
                            <span>ZenChat Mesh</span>
                          </Link>
                          <Link
                            href={`/profile/${userHandle}`}
                            onClick={() => setUserDropdownOpen(false)}
                            className="w-full px-3 py-2 rounded-xl hover:bg-white/10 hover:text-white transition flex items-center gap-2"
                          >
                            <User className="w-3.5 h-3.5 text-cyan-400" />
                            <span>Profile Dossier</span>
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
              className="lg:hidden border-b border-white/10 bg-[#060608]/98 backdrop-blur-3xl px-4 sm:px-6 py-5 space-y-4 text-left shadow-2xl overflow-hidden"
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
                    {isFounder && (
                      <Link
                        href="/zen-vault-root"
                        onClick={() => setMobileMenuOpen(false)}
                        className="w-full p-3 rounded-xl bg-rose-500/15 border border-rose-500/30 text-rose-300 flex items-center justify-between font-bold shadow-[0_0_15px_rgba(244,63,94,0.2)]"
                      >
                        <div className="flex items-center gap-2">
                          <Crown className="w-4 h-4 text-rose-400" />
                          <span>Founders Hub (Root)</span>
                        </div>
                        <ArrowRight className="w-4 h-4" />
                      </Link>
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
                        <span>Open ZenChat Mesh</span>
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
        currentAvatar={profile?.avatar_url || localUserSession?.avatar}
      />

      {/* Operational Admin & Committee Modal */}
      <AdminOmniModal
        isOpen={adminOmniModalOpen}
        onClose={() => setAdminOmniModalOpen(false)}
        onOpenFounderMenu={() => setFounderOmniModalOpen(true)}
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