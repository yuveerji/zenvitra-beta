'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import {
  Gavel,
  Menu,
  X,
  ArrowRight,
  ShieldCheck,
  Compass,
  Sparkles,
  User,
  LogOut,
  ChevronDown,
  SlidersHorizontal,
  RotateCcw,
  BookOpen,
} from 'lucide-react';
import { useAuth } from '@/context/AuthContext';
import { DiasButton } from './DiasButton';
import { ResumeSessionModal } from './ResumeSessionModal';

export const DiasNav: React.FC = () => {
  const router = useRouter();
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [userDropdownOpen, setUserDropdownOpen] = useState(false);
  const [resumeModalOpen, setResumeModalOpen] = useState(false);

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

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 20) {
        setIsScrolled(true);
      } else {
        setIsScrolled(false);
      }
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
          isScrolled
            ? 'bg-[#08090B]/95 backdrop-blur-2xl border-b border-white/[0.08] py-3 shadow-[0_12px_40px_rgba(0,0,0,0.6)]'
            : 'bg-transparent py-4 sm:py-5'
        }`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between">
          {/* Brand identity */}
          <Link href="/dias" className="flex items-center gap-3 group shrink-0">
            <div className="w-9 h-9 rounded-full bg-gradient-to-br from-[#181B21] to-[#111318] border border-[#6366F1]/50 flex items-center justify-center text-[#6366F1] shadow-[0_0_20px_rgba(99,102,241,0.3)] group-hover:border-[#6366F1] group-hover:scale-105 transition-all">
              <Gavel className="w-4 h-4" />
            </div>
            <div className="flex flex-col text-left">
              <div className="flex items-center gap-2">
                <span className="text-sm font-bold tracking-[0.2em] text-[#F4F2ED] uppercase font-sans">
                  ZENVITRA
                </span>
                <span className="text-[10px] uppercase font-bold px-2 py-0.5 rounded-full bg-[#6366F1]/20 text-[#A5B4FC] border border-[#6366F1]/40 tracking-wider shadow-[0_0_12px_rgba(99,102,241,0.2)]">
                  DIAS
                </span>
              </div>
              <span className="text-[9px] text-[#9A9DA5] tracking-widest font-mono uppercase hidden sm:block">
                Diplomatic Operating System &bull; Presidium V2.4
              </span>
            </div>
          </Link>

          {/* Desktop Navigation Links */}
          <nav className="hidden lg:flex items-center gap-7">
            <Link
              href="/dias/tour"
              className="text-xs font-semibold uppercase tracking-wider text-[#6366F1] hover:text-[#A5B4FC] transition-colors flex items-center gap-1.5 font-mono"
            >
              <Compass className="w-3.5 h-3.5 text-[#6366F1]" />
              <span>Explore Tour</span>
            </Link>
            <button
              type="button"
              onClick={handleLaunchClick}
              className="text-xs font-semibold uppercase tracking-wider text-[#9A9DA5] hover:text-[#6366F1] transition-colors cursor-pointer flex items-center gap-1.5"
            >
              <SlidersHorizontal className="w-3.5 h-3.5 text-[#6366F1]" />
              <span>Configure Committee</span>
            </button>
            <Link
              href="/dias#fleet"
              className="text-xs font-semibold uppercase tracking-wider text-[#9A9DA5] hover:text-[#F4F2ED] transition-colors"
            >
              Chambers
            </Link>
            <Link
              href="/dias#codex"
              className="text-xs font-semibold uppercase tracking-wider text-[#9A9DA5] hover:text-[#F4F2ED] transition-colors"
            >
              Rules Codex
            </Link>
            <Link
              href="/dias#gateways"
              className="text-xs font-semibold uppercase tracking-wider text-[#9A9DA5] hover:text-[#F4F2ED] transition-colors"
            >
              Gateways
            </Link>
            <Link
              href="/dias/features"
              className="text-xs font-semibold uppercase tracking-wider text-[#9A9DA5] hover:text-[#F4F2ED] transition-colors"
            >
              Features
            </Link>
            <Link
              href="/dias/how-it-works"
              className="text-xs font-semibold uppercase tracking-wider text-[#9A9DA5] hover:text-[#F4F2ED] transition-colors"
            >
              How It Works
            </Link>
          </nav>

          {/* Action Controls & Active Session Beacon */}
          <div className="hidden md:flex items-center gap-3">
            {/* Active Session Pulsing Pill if session is open */}
            {activeStoredSession && (
              <button
                type="button"
                onClick={() => setResumeModalOpen(true)}
                className="px-3 py-1.5 rounded-full bg-[#6366F1]/15 border border-[#6366F1]/40 text-[#A5B4FC] text-xs font-mono font-bold flex items-center gap-2 hover:bg-[#6366F1]/25 transition cursor-pointer shadow-[0_0_20px_rgba(99,102,241,0.2)] animate-pulse"
                title="Click to resume in-progress chamber session"
              >
                <span className="w-2 h-2 rounded-full bg-[#6366F1]" />
                <span>{activeStoredSession.committeeAcronym} ({activeStoredSession.sessionCode})</span>
              </button>
            )}

            {isUserLoggedIn ? (
              <div className="relative">
                <button
                  type="button"
                  onClick={() => setUserDropdownOpen(!userDropdownOpen)}
                  className="px-3.5 py-1.5 rounded-full bg-[#181B21]/90 border border-white/15 hover:border-[#6366F1]/50 text-white flex items-center gap-2.5 transition-all duration-200 cursor-pointer shadow-[0_0_20px_rgba(0,0,0,0.5)] hover:shadow-[0_0_25px_rgba(99,102,241,0.15)]"
                >
                  <div className="w-6 h-6 rounded-full bg-[#6366F1] text-black font-bold font-mono text-[11px] flex items-center justify-center">
                    {displayName.charAt(0).toUpperCase()}
                  </div>
                  <div className="flex flex-col text-left">
                    <span className="text-xs font-bold text-[#F4F2ED] max-w-[110px] truncate leading-tight">
                      {displayName}
                    </span>
                    <span className="text-[9px] font-mono text-[#9A9DA5] truncate">
                      @{displayHandle}
                    </span>
                  </div>
                  <ChevronDown className="w-3.5 h-3.5 text-[#9A9DA5]" />
                </button>

                {userDropdownOpen && (
                  <div className="absolute right-0 top-12 w-52 rounded-2xl bg-[#08090B] border border-white/15 shadow-[0_20px_60px_rgba(0,0,0,0.9)] p-2 z-[100] text-left animate-in fade-in slide-in-from-top-2">
                    <div className="p-2 border-b border-white/10 mb-1">
                      <p className="text-xs font-bold text-white truncate">{displayName}</p>
                      <p className="text-[10px] font-mono text-[#6366F1]">Authenticated Diplomat</p>
                    </div>
                    <Link
                      href="/profile"
                      onClick={() => setUserDropdownOpen(false)}
                      className="w-full px-3 py-2 rounded-xl hover:bg-white/[0.06] text-neutral-300 hover:text-white text-xs font-medium flex items-center gap-2 transition"
                    >
                      <User className="w-3.5 h-3.5 text-[#6366F1]" />
                      <span>My Profile</span>
                    </Link>
                    <button
                      type="button"
                      onClick={() => {
                        setUserDropdownOpen(false);
                        handleLaunchClick();
                      }}
                      className="w-full px-3 py-2 rounded-xl hover:bg-white/[0.06] text-neutral-300 hover:text-white text-xs font-medium flex items-center gap-2 transition cursor-pointer text-left"
                    >
                      <SlidersHorizontal className="w-3.5 h-3.5 text-[#6366F1]" />
                      <span>Configure Chamber</span>
                    </button>
                    <Link
                      href="/dias#fleet"
                      onClick={() => setUserDropdownOpen(false)}
                      className="w-full px-3 py-2 rounded-xl hover:bg-white/[0.06] text-neutral-300 hover:text-white text-xs font-medium flex items-center gap-2 transition"
                    >
                      <Compass className="w-3.5 h-3.5 text-[#6366F1]" />
                      <span>Chamber Fleet</span>
                    </Link>
                    <button
                      type="button"
                      onClick={async () => {
                        setUserDropdownOpen(false);
                        if (signOut) { await signOut({ forceFullLogout: true }); window.location.replace('/login'); }
                      }}
                      className="w-full px-3 py-2 rounded-xl hover:bg-red-500/10 text-red-400 text-xs font-medium flex items-center gap-2 transition cursor-pointer text-left"
                    >
                      <LogOut className="w-3.5 h-3.5" />
                      <span>Sign Out</span>
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <Link href="/login">
                <DiasButton variant="charcoal" size="sm">
                  Sign In
                </DiasButton>
              </Link>
            )}

            {/* Launch Chamber Button with Homepage Glow */}
            <DiasButton
              variant="indigo"
              size="sm"
              onClick={handleLaunchClick}
              rightIcon={<ArrowRight className="w-3.5 h-3.5 ml-0.5 group-hover:translate-x-1 transition-transform" />}
            >
              {activeStoredSession ? 'Chamber Cockpit' : 'Launch Chamber'}
            </DiasButton>
          </div>

          {/* Mobile Hamburger Button */}
          <div className="flex md:hidden items-center gap-2">
            <DiasButton variant="indigo" size="sm" onClick={handleLaunchClick}>
              {activeStoredSession ? 'Rejoin' : 'Setup'}
            </DiasButton>
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 rounded-xl bg-[#181B21] border border-[#232731] text-[#F4F2ED] hover:text-[#6366F1] transition-colors cursor-pointer"
              aria-label="Toggle Navigation Menu"
            >
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>

        {/* Mobile Menu Dropdown */}
        {mobileMenuOpen && (
          <div className="md:hidden bg-[#08090B]/98 backdrop-blur-2xl border-b border-[#232731] px-6 py-6 space-y-4 animate-in fade-in slide-in-from-top-2 text-left">
            {activeStoredSession && (
              <button
                type="button"
                onClick={() => {
                  setMobileMenuOpen(false);
                  setResumeModalOpen(true);
                }}
                className="w-full p-3 rounded-2xl bg-[#6366F1]/15 border border-[#6366F1]/40 text-[#A5B4FC] text-xs font-mono font-bold flex items-center justify-between"
              >
                <div className="flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-[#6366F1] animate-ping" />
                  <span>RESUME: {activeStoredSession.committeeAcronym}</span>
                </div>
                <span>{activeStoredSession.sessionCode} &rarr;</span>
              </button>
            )}

            <div className="space-y-3 pb-4 border-b border-[#181B21]">
              <Link
                href="/dias/tour"
                onClick={() => setMobileMenuOpen(false)}
                className="flex items-center gap-2 text-sm font-semibold text-[#6366F1] hover:text-[#A5B4FC] py-1 font-mono"
              >
                <Compass className="w-4 h-4 text-[#6366F1]" />
                <span>Explore Dias Tour</span>
              </Link>
              <button
                type="button"
                onClick={() => {
                  setMobileMenuOpen(false);
                  handleLaunchClick();
                }}
                className="block text-sm font-semibold text-[#F4F2ED] hover:text-[#6366F1] py-1 cursor-pointer"
              >
                ⚡ Configure New Committee
              </button>
              <Link
                href="/dias#fleet"
                onClick={() => setMobileMenuOpen(false)}
                className="block text-sm font-medium text-[#F4F2ED] hover:text-[#6366F1] py-1"
              >
                Chamber Fleet
              </Link>
              <Link
                href="/dias#codex"
                onClick={() => setMobileMenuOpen(false)}
                className="block text-sm font-medium text-[#F4F2ED] hover:text-[#6366F1] py-1"
              >
                Rules of Procedure
              </Link>
              <Link
                href="/dias#gateways"
                onClick={() => setMobileMenuOpen(false)}
                className="block text-sm font-medium text-[#F4F2ED] hover:text-[#6366F1] py-1"
              >
                Diplomatic Gateways
              </Link>
              <Link
                href="/dias/features"
                onClick={() => setMobileMenuOpen(false)}
                className="block text-sm font-medium text-[#F4F2ED] hover:text-[#6366F1] py-1"
              >
                Procedural Features
              </Link>
              <Link
                href="/dias/how-it-works"
                onClick={() => setMobileMenuOpen(false)}
                className="block text-sm font-medium text-[#F4F2ED] hover:text-[#6366F1] py-1"
              >
                How It Works
              </Link>
            </div>

            <div className="flex flex-col gap-2.5 pt-1">
              {isUserLoggedIn ? (
                <div className="p-3 rounded-2xl bg-white/[0.04] border border-white/10 flex items-center justify-between">
                  <div>
                    <div className="text-xs font-bold text-white">{displayName}</div>
                    <div className="text-[10px] font-mono text-[#6366F1]">@{displayHandle}</div>
                  </div>
                  <button
                    type="button"
                    onClick={async () => {
                      setMobileMenuOpen(false);
                      if (signOut) { await signOut({ forceFullLogout: true }); window.location.replace('/login'); }
                    }}
                    className="text-xs text-red-400 font-medium cursor-pointer"
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
