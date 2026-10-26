'use client';

import React, { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import {
  Gavel,
  Menu,
  X,
  ArrowRight,
  Compass,
  Sparkles,
  User,
  LogOut,
  ChevronDown,
  SlidersHorizontal,
  Sun,
  Moon,
  Radio,
  BookOpen,
} from 'lucide-react';
import { useAuth } from '@/context/AuthContext';
import { useDiasTheme } from '@/context/DiasThemeContext';
import { DiasButton } from './DiasButton';
import { ResumeSessionModal } from './ResumeSessionModal';

export const DiasNav: React.FC = () => {
  const router = useRouter();
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [userDropdownOpen, setUserDropdownOpen] = useState(false);
  const [moreDropdownOpen, setMoreDropdownOpen] = useState(false);
  const [resumeModalOpen, setResumeModalOpen] = useState(false);

  const { theme, toggleTheme, isLight } = useDiasTheme();
  const { isAuthenticated, profile, signOut } = useAuth();
  const [localSession, setLocalSession] = useState<{ username?: string; name?: string; role?: string } | null>(null);
  const [activeStoredSession, setActiveStoredSession] = useState<{
    sessionCode: string;
    committeeName: string;
    committeeAcronym?: string;
    topic: string;
    emblemUrl?: string;
    isIndianCommittee?: boolean;
    rosterCount?: number;
    chairName?: string;
  } | null>(null);

  const userDropdownRef = useRef<HTMLDivElement>(null);
  const moreDropdownRef = useRef<HTMLDivElement>(null);

  // Close dropdowns on outside click
  useEffect(() => {
    const handleOutsideClick = (event: MouseEvent) => {
      if (userDropdownRef.current && !userDropdownRef.current.contains(event.target as Node)) {
        setUserDropdownOpen(false);
      }
      if (moreDropdownRef.current && !moreDropdownRef.current.contains(event.target as Node)) {
        setMoreDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handleOutsideClick);
    return () => document.removeEventListener('mousedown', handleOutsideClick);
  }, []);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    if (typeof window === 'undefined') return;
    try {
      const stored = localStorage.getItem('zenvitra_session_user');
      if (stored) {
        setLocalSession(JSON.parse(stored));
      }
    } catch {}

    try {
      const munRaw = localStorage.getItem('zenvitra_zenmun_live_session_v1');
      if (munRaw) {
        const parsed = JSON.parse(munRaw);
        const hasGenuineRoster = Array.isArray(parsed?.roster) && parsed.roster.length > 0;

        if (parsed?.committeeName && parsed?.sessionCode && hasGenuineRoster && parsed?.sessionState === 'in-session') {
          setActiveStoredSession({
            sessionCode: parsed.sessionCode,
            committeeName: parsed.committeeName,
            committeeAcronym: parsed.committeeAcronym || parsed.committeeName.slice(0, 8),
            topic: parsed.topic || '',
            emblemUrl: parsed.emblemUrl,
            isIndianCommittee: Boolean(parsed.isIndianCommittee),
            rosterCount: parsed.roster.length,
            chairName: parsed.chairName || 'Chair',
          });
        } else {
          localStorage.removeItem('zenvitra_zenmun_live_session_v1');
          localStorage.removeItem('zenvitra_dias_active_session');
          setActiveStoredSession(null);
        }
      } else {
        localStorage.removeItem('zenvitra_dias_active_session');
        setActiveStoredSession(null);
      }
    } catch {}
  }, []);

  const isUserLoggedIn = isAuthenticated || Boolean(profile) || Boolean(localSession);
  const displayName = profile?.display_name || localSession?.name || localSession?.username || profile?.username || 'Diplomat';
  const displayHandle = profile?.username || localSession?.username || 'member';

  const handleLaunchClick = () => {
    if (activeStoredSession) {
      setResumeModalOpen(true);
    } else {
      router.push('/dias?create=true');
    }
  };

  const handleRejoinSession = () => {
    setResumeModalOpen(false);
    router.push('/dias?dais=true');
  };

  const handleStartFreshSession = () => {
    setResumeModalOpen(false);
    if (typeof window !== 'undefined') {
      try {
        localStorage.removeItem('zenvitra_zenmun_live_session_v1');
        setActiveStoredSession(null);
      } catch {}
    }
    router.push('/dias?create=true');
  };

  return (
    <>
      <header
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
          isLight
            ? isScrolled
              ? 'bg-white/95 backdrop-blur-2xl border-b border-slate-200/90 shadow-sm py-2.5 sm:py-3'
              : 'bg-white/80 backdrop-blur-md border-b border-slate-200/50 py-3 sm:py-4'
            : isScrolled
              ? 'bg-[#08090B]/95 backdrop-blur-2xl border-b border-white/[0.08] shadow-[0_12px_40px_rgba(0,0,0,0.6)] py-2.5 sm:py-3'
              : 'bg-transparent py-3 sm:py-4'
        }`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between gap-3">
          {/* Brand Identity */}
          <Link href="/dias" className="flex items-center gap-2.5 sm:gap-3 group shrink-0">
            <div
              className={`w-9 h-9 sm:w-9.5 sm:h-9.5 rounded-xl sm:rounded-2xl flex items-center justify-center transition-all duration-300 ${
                isLight
                  ? 'bg-indigo-50 border border-indigo-200 text-indigo-600 shadow-sm group-hover:bg-indigo-100 group-hover:scale-105'
                  : 'bg-gradient-to-br from-[#181B21] to-[#111318] border border-[#6366F1]/50 text-[#6366F1] shadow-[0_0_20px_rgba(99,102,241,0.3)] group-hover:border-[#6366F1] group-hover:scale-105'
              }`}
            >
              <Gavel className="w-4 h-4 sm:w-4.5 sm:h-4.5" />
            </div>
            <div className="flex flex-col text-left">
              <div className="flex items-center gap-1.5 sm:gap-2">
                <span
                  className={`text-sm sm:text-base font-extrabold tracking-[0.18em] uppercase font-sans ${
                    isLight ? 'text-slate-900' : 'text-[#F4F2ED]'
                  }`}
                >
                  ZENVITRA
                </span>
                <span
                  className={`text-[9px] sm:text-[10px] uppercase font-bold px-1.5 sm:px-2 py-0.5 rounded-full tracking-wider ${
                    isLight
                      ? 'bg-indigo-100 text-indigo-700 border border-indigo-200'
                      : 'bg-[#6366F1]/20 text-[#A5B4FC] border border-[#6366F1]/40 shadow-[0_0_12px_rgba(99,102,241,0.2)]'
                  }`}
                >
                  DIAS
                </span>
              </div>
              <span
                className={`text-[9px] tracking-widest font-mono uppercase hidden md:block ${
                  isLight ? 'text-slate-500' : 'text-[#9A9DA5]'
                }`}
              >
                Presidium V2.4 &bull; Diplomatic OS
              </span>
            </div>
          </Link>

          {/* Desktop Navigation Links */}
          <nav className="hidden lg:flex items-center gap-4 xl:gap-6">
            <Link
              href="/dias/tour"
              className={`text-xs font-semibold uppercase tracking-wider transition-colors flex items-center gap-1.5 font-mono px-2 py-1 rounded-lg ${
                isLight
                  ? 'text-indigo-600 hover:text-indigo-700 hover:bg-indigo-50'
                  : 'text-[#818CF8] hover:text-[#C7D2FE] hover:bg-white/[0.04]'
              }`}
            >
              <Compass className="w-3.5 h-3.5" />
              <span>Tour</span>
            </Link>

            <Link
              href="/dias#fleet"
              className={`text-xs font-semibold uppercase tracking-wider transition-colors px-2 py-1 rounded-lg ${
                isLight
                  ? 'text-slate-600 hover:text-slate-900 hover:bg-slate-100/70'
                  : 'text-[#9A9DA5] hover:text-[#F4F2ED] hover:bg-white/[0.04]'
              }`}
            >
              Chambers
            </Link>

            <Link
              href="/dias#codex"
              className={`text-xs font-semibold uppercase tracking-wider transition-colors px-2 py-1 rounded-lg ${
                isLight
                  ? 'text-slate-600 hover:text-slate-900 hover:bg-slate-100/70'
                  : 'text-[#9A9DA5] hover:text-[#F4F2ED] hover:bg-white/[0.04]'
              }`}
            >
              Rules Codex
            </Link>

            <Link
              href="/dias#gateways"
              className={`text-xs font-semibold uppercase tracking-wider transition-colors px-2 py-1 rounded-lg ${
                isLight
                  ? 'text-slate-600 hover:text-slate-900 hover:bg-slate-100/70'
                  : 'text-[#9A9DA5] hover:text-[#F4F2ED] hover:bg-white/[0.04]'
              }`}
            >
              Gateways
            </Link>

            <button
              type="button"
              onClick={handleLaunchClick}
              className={`text-xs font-semibold uppercase tracking-wider transition-colors cursor-pointer flex items-center gap-1.5 px-2 py-1 rounded-lg ${
                isLight
                  ? 'text-slate-600 hover:text-indigo-600 hover:bg-slate-100/70'
                  : 'text-[#9A9DA5] hover:text-[#6366F1] hover:bg-white/[0.04]'
              }`}
            >
              <SlidersHorizontal className="w-3.5 h-3.5 text-indigo-500" />
              <span>Configure</span>
            </button>

            {/* "More" Dropdown for Features & How it works */}
            <div className="relative" ref={moreDropdownRef}>
              <button
                type="button"
                onClick={() => setMoreDropdownOpen(!moreDropdownOpen)}
                className={`text-xs font-semibold uppercase tracking-wider transition-colors flex items-center gap-1 px-2 py-1 rounded-lg cursor-pointer ${
                  isLight
                    ? 'text-slate-600 hover:text-slate-900 hover:bg-slate-100/70'
                    : 'text-[#9A9DA5] hover:text-[#F4F2ED] hover:bg-white/[0.04]'
                }`}
              >
                <span>More</span>
                <ChevronDown className="w-3 h-3 transition-transform" />
              </button>

              {moreDropdownOpen && (
                <div
                  className={`absolute left-0 top-9 w-44 rounded-xl border p-1.5 shadow-xl z-[100] text-left animate-in fade-in slide-in-from-top-2 ${
                    isLight
                      ? 'bg-white border-slate-200 text-slate-800'
                      : 'bg-[#0E1015] border-white/10 text-[#F4F2ED]'
                  }`}
                >
                  <Link
                    href="/dias/features"
                    onClick={() => setMoreDropdownOpen(false)}
                    className={`block w-full px-3 py-2 rounded-lg text-xs font-medium transition ${
                      isLight ? 'hover:bg-slate-100 text-slate-700' : 'hover:bg-white/[0.06] text-neutral-300'
                    }`}
                  >
                    Procedural Features
                  </Link>
                  <Link
                    href="/dias/how-it-works"
                    onClick={() => setMoreDropdownOpen(false)}
                    className={`block w-full px-3 py-2 rounded-lg text-xs font-medium transition ${
                      isLight ? 'hover:bg-slate-100 text-slate-700' : 'hover:bg-white/[0.06] text-neutral-300'
                    }`}
                  >
                    How It Works
                  </Link>
                </div>
              )}
            </div>
          </nav>

          {/* Action Controls & Active Session Beacon */}
          <div className="flex items-center gap-2 sm:gap-3 shrink-0">
            {/* Active Session Pulsing Indicator */}
            {activeStoredSession && (
              <button
                type="button"
                onClick={() => setResumeModalOpen(true)}
                className={`px-2.5 sm:px-3 py-1.5 rounded-full text-[11px] sm:text-xs font-mono font-bold flex items-center gap-1.5 sm:gap-2 transition cursor-pointer shrink-0 ${
                  isLight
                    ? 'bg-indigo-50 border border-indigo-200 text-indigo-700 hover:bg-indigo-100 shadow-xs'
                    : 'bg-[#6366F1]/15 border border-[#6366F1]/40 text-[#A5B4FC] hover:bg-[#6366F1]/25 shadow-[0_0_15px_rgba(99,102,241,0.2)]'
                }`}
                title={`Resume in-progress session: ${activeStoredSession.committeeName}`}
              >
                <span className="relative flex h-2 w-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-indigo-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-indigo-500"></span>
                </span>
                <span className="truncate max-w-[80px] sm:max-w-[120px]">
                  {activeStoredSession.committeeAcronym}
                </span>
                <span className="text-[10px] opacity-70 hidden sm:inline font-mono">
                  ({activeStoredSession.sessionCode})
                </span>
              </button>
            )}

            {/* Dark / Light Mode Toggle Button */}
            <button
              type="button"
              onClick={toggleTheme}
              className={`p-2 rounded-full border transition-all duration-200 cursor-pointer ${
                isLight
                  ? 'bg-slate-100 hover:bg-slate-200 border-slate-300 text-slate-800 shadow-xs'
                  : 'bg-[#181B21] hover:bg-[#232731] border-white/10 text-amber-300 shadow-[0_0_15px_rgba(251,191,36,0.15)]'
              }`}
              title={isLight ? 'Switch to Dark Mode' : 'Switch to Light Mode'}
              aria-label="Toggle Dark and Light Mode"
            >
              {isLight ? (
                <Moon className="w-4 h-4 text-indigo-600 transition-transform duration-200" />
              ) : (
                <Sun className="w-4 h-4 text-amber-400 transition-transform duration-200" />
              )}
            </button>

            {/* User Profile Pill / Menu */}
            {isUserLoggedIn ? (
              <div className="relative" ref={userDropdownRef}>
                <button
                  type="button"
                  onClick={() => setUserDropdownOpen(!userDropdownOpen)}
                  className={`h-9 px-2.5 sm:px-3 rounded-full border flex items-center gap-2 transition-all duration-200 cursor-pointer shrink-0 ${
                    isLight
                      ? 'bg-white hover:bg-slate-50 border-slate-200 text-slate-800 shadow-xs'
                      : 'bg-[#181B21]/90 hover:bg-[#232731] border-white/15 hover:border-[#6366F1]/50 text-white shadow-sm'
                  }`}
                  aria-label="User profile options"
                >
                  <div className="w-6 h-6 rounded-full bg-gradient-to-tr from-indigo-600 to-violet-500 text-white font-bold font-mono text-[11px] flex items-center justify-center shrink-0">
                    {displayName.charAt(0).toUpperCase()}
                  </div>
                  <span
                    className={`text-xs font-semibold max-w-[80px] sm:max-w-[110px] truncate hidden md:block ${
                      isLight ? 'text-slate-800' : 'text-[#F4F2ED]'
                    }`}
                  >
                    {displayName}
                  </span>
                  <ChevronDown
                    className={`w-3.5 h-3.5 transition-transform duration-200 ${
                      userDropdownOpen ? 'rotate-180' : ''
                    } ${isLight ? 'text-slate-500' : 'text-[#9A9DA5]'}`}
                  />
                </button>

                {userDropdownOpen && (
                  <div
                    className={`absolute right-0 top-11 w-52 rounded-2xl border p-2 z-[100] text-left animate-in fade-in slide-in-from-top-2 shadow-2xl ${
                      isLight
                        ? 'bg-white border-slate-200 text-slate-800'
                        : 'bg-[#0E1015] border-white/15 text-white'
                    }`}
                  >
                    <div
                      className={`p-2 border-b mb-1 ${
                        isLight ? 'border-slate-100' : 'border-white/10'
                      }`}
                    >
                      <p className="text-xs font-bold truncate">{displayName}</p>
                      <p className="text-[10px] font-mono text-indigo-500">@{displayHandle}</p>
                    </div>
                    <Link
                      href="/profile"
                      onClick={() => setUserDropdownOpen(false)}
                      className={`w-full px-3 py-2 rounded-xl text-xs font-medium flex items-center gap-2 transition ${
                        isLight ? 'hover:bg-slate-100 text-slate-700' : 'hover:bg-white/[0.06] text-neutral-300'
                      }`}
                    >
                      <User className="w-3.5 h-3.5 text-indigo-500" />
                      <span>My Profile</span>
                    </Link>
                    <button
                      type="button"
                      onClick={() => {
                        setUserDropdownOpen(false);
                        handleLaunchClick();
                      }}
                      className={`w-full px-3 py-2 rounded-xl text-xs font-medium flex items-center gap-2 transition cursor-pointer text-left ${
                        isLight ? 'hover:bg-slate-100 text-slate-700' : 'hover:bg-white/[0.06] text-neutral-300'
                      }`}
                    >
                      <SlidersHorizontal className="w-3.5 h-3.5 text-indigo-500" />
                      <span>Configure Chamber</span>
                    </button>
                    <Link
                      href="/dias#fleet"
                      onClick={() => setUserDropdownOpen(false)}
                      className={`w-full px-3 py-2 rounded-xl text-xs font-medium flex items-center gap-2 transition ${
                        isLight ? 'hover:bg-slate-100 text-slate-700' : 'hover:bg-white/[0.06] text-neutral-300'
                      }`}
                    >
                      <Compass className="w-3.5 h-3.5 text-indigo-500" />
                      <span>Chamber Fleet</span>
                    </Link>
                    <button
                      type="button"
                      onClick={async () => {
                        setUserDropdownOpen(false);
                        if (signOut) {
                          await signOut({ forceFullLogout: true });
                          window.location.replace('/login');
                        }
                      }}
                      className="w-full px-3 py-2 rounded-xl hover:bg-red-500/10 text-red-500 text-xs font-medium flex items-center gap-2 transition cursor-pointer text-left"
                    >
                      <LogOut className="w-3.5 h-3.5" />
                      <span>Sign Out</span>
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <Link href="/login" className="hidden sm:block shrink-0">
                <DiasButton variant="charcoal" size="sm">
                  Sign In
                </DiasButton>
              </Link>
            )}

            {/* Launch Chamber Button */}
            <div className="shrink-0 hidden sm:block">
              <DiasButton
                variant="indigo"
                size="sm"
                onClick={handleLaunchClick}
                className="whitespace-nowrap shadow-sm hover:shadow-indigo-500/25"
                rightIcon={<ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />}
              >
                {activeStoredSession ? 'Chamber Cockpit' : 'Launch Chamber'}
              </DiasButton>
            </div>

            {/* Mobile Menu Hamburger Button */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className={`p-2 rounded-xl border transition-colors cursor-pointer lg:hidden ${
                isLight
                  ? 'bg-slate-100 border-slate-300 text-slate-800 hover:text-indigo-600'
                  : 'bg-[#181B21] border-[#232731] text-[#F4F2ED] hover:text-[#6366F1]'
              }`}
              aria-label="Toggle Navigation Menu"
            >
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>

        {/* Mobile Menu Dropdown */}
        {mobileMenuOpen && (
          <div
            className={`lg:hidden px-6 py-6 space-y-4 animate-in fade-in slide-in-from-top-2 text-left border-b ${
              isLight
                ? 'bg-white/98 backdrop-blur-2xl border-slate-200 text-slate-800 shadow-xl'
                : 'bg-[#08090B]/98 backdrop-blur-2xl border-[#232731] text-[#F4F2ED]'
            }`}
          >
            {activeStoredSession && (
              <button
                type="button"
                onClick={() => {
                  setMobileMenuOpen(false);
                  setResumeModalOpen(true);
                }}
                className={`w-full p-3 rounded-2xl border text-xs font-mono font-bold flex items-center justify-between ${
                  isLight
                    ? 'bg-indigo-50 border-indigo-200 text-indigo-700'
                    : 'bg-[#6366F1]/15 border-[#6366F1]/40 text-[#A5B4FC]'
                }`}
              >
                <div className="flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-[#6366F1] animate-ping" />
                  <span>RESUME: {activeStoredSession.committeeAcronym}</span>
                </div>
                <span>{activeStoredSession.sessionCode} &rarr;</span>
              </button>
            )}

            <div
              className={`space-y-3 pb-4 border-b ${
                isLight ? 'border-slate-100' : 'border-[#181B21]'
              }`}
            >
              <Link
                href="/dias/tour"
                onClick={() => setMobileMenuOpen(false)}
                className="flex items-center gap-2 text-sm font-semibold text-indigo-600 py-1 font-mono"
              >
                <Compass className="w-4 h-4 text-indigo-600" />
                <span>Explore Dias Tour</span>
              </Link>
              <button
                type="button"
                onClick={() => {
                  setMobileMenuOpen(false);
                  handleLaunchClick();
                }}
                className={`block w-full text-left text-sm font-semibold py-1 cursor-pointer ${
                  isLight ? 'text-slate-800 hover:text-indigo-600' : 'text-[#F4F2ED] hover:text-[#6366F1]'
                }`}
              >
                ⚡ Configure New Committee
              </button>
              <Link
                href="/dias#fleet"
                onClick={() => setMobileMenuOpen(false)}
                className={`block text-sm font-medium py-1 ${
                  isLight ? 'text-slate-700 hover:text-indigo-600' : 'text-[#F4F2ED] hover:text-[#6366F1]'
                }`}
              >
                Chamber Fleet
              </Link>
              <Link
                href="/dias#codex"
                onClick={() => setMobileMenuOpen(false)}
                className={`block text-sm font-medium py-1 ${
                  isLight ? 'text-slate-700 hover:text-indigo-600' : 'text-[#F4F2ED] hover:text-[#6366F1]'
                }`}
              >
                Rules of Procedure
              </Link>
              <Link
                href="/dias#gateways"
                onClick={() => setMobileMenuOpen(false)}
                className={`block text-sm font-medium py-1 ${
                  isLight ? 'text-slate-700 hover:text-indigo-600' : 'text-[#F4F2ED] hover:text-[#6366F1]'
                }`}
              >
                Diplomatic Gateways
              </Link>
              <Link
                href="/dias/features"
                onClick={() => setMobileMenuOpen(false)}
                className={`block text-sm font-medium py-1 ${
                  isLight ? 'text-slate-700 hover:text-indigo-600' : 'text-[#F4F2ED] hover:text-[#6366F1]'
                }`}
              >
                Procedural Features
              </Link>
              <Link
                href="/dias/how-it-works"
                onClick={() => setMobileMenuOpen(false)}
                className={`block text-sm font-medium py-1 ${
                  isLight ? 'text-slate-700 hover:text-indigo-600' : 'text-[#F4F2ED] hover:text-[#6366F1]'
                }`}
              >
                How It Works
              </Link>
            </div>

            <div className="flex flex-col gap-2.5 pt-1">
              {isUserLoggedIn ? (
                <div
                  className={`p-3 rounded-2xl border flex items-center justify-between ${
                    isLight
                      ? 'bg-slate-50 border-slate-200'
                      : 'bg-white/[0.04] border-white/10'
                  }`}
                >
                  <div>
                    <div className="text-xs font-bold">{displayName}</div>
                    <div className="text-[10px] font-mono text-indigo-500">@{displayHandle}</div>
                  </div>
                  <button
                    type="button"
                    onClick={async () => {
                      setMobileMenuOpen(false);
                      if (signOut) {
                        await signOut({ forceFullLogout: true });
                        window.location.replace('/login');
                      }
                    }}
                    className="text-xs text-red-500 font-medium cursor-pointer"
                  >
                    Sign Out
                  </button>
                </div>
              ) : (
                <Link href="/login" onClick={() => setMobileMenuOpen(false)}>
                  <DiasButton variant="charcoal" size="md" className="w-full">
                    Sign In
                  </DiasButton>
                </Link>
              )}
              <DiasButton
                variant="indigo"
                size="md"
                className="w-full"
                onClick={() => {
                  setMobileMenuOpen(false);
                  handleLaunchClick();
                }}
              >
                {activeStoredSession ? 'Rejoin Active Chamber' : 'Configure Committee & Launch'}
              </DiasButton>
            </div>
          </div>
        )}
      </header>

      {/* Resume Session Modal */}
      {activeStoredSession && (
        <ResumeSessionModal
          isOpen={resumeModalOpen}
          onClose={() => setResumeModalOpen(false)}
          onRejoin={handleRejoinSession}
          onNewSession={handleStartFreshSession}
          session={activeStoredSession}
        />
      )}
    </>
  );
};
