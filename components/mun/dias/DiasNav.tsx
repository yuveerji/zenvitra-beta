'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { Gavel, Menu, X, ArrowRight, ShieldCheck, Compass, Sparkles, User, LogOut, ChevronDown } from 'lucide-react';
import { useAuth } from '@/context/AuthContext';
import { DiasButton } from './DiasButton';

export const DiasNav: React.FC = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [userDropdownOpen, setUserDropdownOpen] = useState(false);

  const { isAuthenticated, profile, signOut } = useAuth();
  const [localSession, setLocalSession] = useState<{ username?: string; name?: string; role?: string } | null>(null);

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
  }, []);

  const isUserLoggedIn = isAuthenticated || Boolean(profile) || Boolean(localSession);
  const displayName = profile?.display_name || localSession?.name || localSession?.username || profile?.username || 'Diplomat';
  const displayHandle = profile?.username || localSession?.username || 'member';

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        isScrolled
          ? 'bg-[#08090B]/90 backdrop-blur-xl border-b border-[#232731]/80 py-3.5 shadow-[0_10px_30px_rgba(0,0,0,0.5)]'
          : 'bg-transparent py-5 sm:py-6'
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between">
        {/* Brand identity */}
        <Link href="/dias" className="flex items-center gap-3 group">
          <div className="w-9 h-9 rounded-full bg-gradient-to-br from-[#181B21] to-[#111318] border border-[#C5A46D]/40 flex items-center justify-center text-[#C5A46D] shadow-[0_0_20px_rgba(197,164,109,0.25)] group-hover:border-[#C5A46D] group-hover:scale-105 transition-all">
            <Gavel className="w-4 h-4" />
          </div>
          <div className="flex flex-col text-left">
            <div className="flex items-center gap-2">
              <span className="text-sm font-bold tracking-[0.2em] text-[#F4F2ED] uppercase font-sans">
                ZENVITRA
              </span>
              <span className="text-[10px] uppercase font-bold px-2 py-0.5 rounded-full bg-[#C5A46D]/20 text-[#E6D1A5] border border-[#C5A46D]/40 tracking-wider shadow-[0_0_10px_rgba(197,164,109,0.15)]">
                DIAS
              </span>
            </div>
            <span className="text-[10px] text-[#9A9DA5] tracking-widest font-mono uppercase">
              Diplomatic Operating System
            </span>
          </div>
        </Link>

        {/* Desktop Navigation Links */}
        <nav className="hidden md:flex items-center gap-8">
          <Link
            href="/dias#gateways"
            className="text-xs font-semibold uppercase tracking-wider text-[#9A9DA5] hover:text-[#F4F2ED] transition-colors"
          >
            Gateways
          </Link>
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
            Rules of Procedure
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

        {/* Action Controls */}
        <div className="hidden md:flex items-center gap-3">
          {isUserLoggedIn ? (
            <div className="relative">
              <button
                type="button"
                onClick={() => setUserDropdownOpen(!userDropdownOpen)}
                className="px-3.5 py-1.5 rounded-full bg-[#181B21]/90 border border-white/15 hover:border-[#C5A46D]/50 text-white flex items-center gap-2.5 transition-all duration-200 cursor-pointer shadow-[0_0_20px_rgba(0,0,0,0.5)] hover:shadow-[0_0_25px_rgba(197,164,109,0.15)]"
              >
                <div className="w-6 h-6 rounded-full bg-[#C5A46D] text-black font-bold font-mono text-[11px] flex items-center justify-center">
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
                    <p className="text-[10px] font-mono text-[#C5A46D]">Authenticated Diplomat</p>
                  </div>
                  <Link
                    href="/profile"
                    onClick={() => setUserDropdownOpen(false)}
                    className="w-full px-3 py-2 rounded-xl hover:bg-white/[0.06] text-neutral-300 hover:text-white text-xs font-medium flex items-center gap-2 transition"
                  >
                    <User className="w-3.5 h-3.5 text-[#C5A46D]" />
                    <span>My Profile</span>
                  </Link>
                  <Link
                    href="/dias#fleet"
                    onClick={() => setUserDropdownOpen(false)}
                    className="w-full px-3 py-2 rounded-xl hover:bg-white/[0.06] text-neutral-300 hover:text-white text-xs font-medium flex items-center gap-2 transition"
                  >
                    <Compass className="w-3.5 h-3.5 text-emerald-400" />
                    <span>Chamber Fleet</span>
                  </Link>
                  <button
                    type="button"
                    onClick={() => {
                      setUserDropdownOpen(false);
                      if (signOut) signOut();
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

          <Link href="/dias?dais=true">
            <DiasButton
              variant="gold"
              size="sm"
              rightIcon={<ArrowRight className="w-3.5 h-3.5 ml-0.5 group-hover:translate-x-1 transition-transform" />}
            >
              Enter the Dias
            </DiasButton>
          </Link>
        </div>

        {/* Mobile Hamburger Button */}
        <div className="flex md:hidden items-center gap-2">
          <Link href="/dias?dais=true">
            <DiasButton variant="gold" size="sm">
              Dais
            </DiasButton>
          </Link>
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="p-2 rounded-xl bg-[#181B21] border border-[#232731] text-[#F4F2ED] hover:text-[#C5A46D] transition-colors cursor-pointer"
            aria-label="Toggle Navigation Menu"
          >
            {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {/* Mobile Menu Dropdown */}
      {mobileMenuOpen && (
        <div className="md:hidden bg-[#08090B]/98 backdrop-blur-2xl border-b border-[#232731] px-6 py-6 space-y-4 animate-in fade-in slide-in-from-top-2">
          <div className="space-y-3 pb-4 border-b border-[#181B21]">
            <Link
              href="/dias#gateways"
              onClick={() => setMobileMenuOpen(false)}
              className="block text-sm font-medium text-[#F4F2ED] hover:text-[#C5A46D] py-1"
            >
              Diplomatic Gateways
            </Link>
            <Link
              href="/dias#fleet"
              onClick={() => setMobileMenuOpen(false)}
              className="block text-sm font-medium text-[#F4F2ED] hover:text-[#C5A46D] py-1"
            >
              Chamber Fleet
            </Link>
            <Link
              href="/dias#codex"
              onClick={() => setMobileMenuOpen(false)}
              className="block text-sm font-medium text-[#F4F2ED] hover:text-[#C5A46D] py-1"
            >
              Rules of Procedure
            </Link>
            <Link
              href="/dias/features"
              onClick={() => setMobileMenuOpen(false)}
              className="block text-sm font-medium text-[#F4F2ED] hover:text-[#C5A46D] py-1"
            >
              Procedural Features
            </Link>
            <Link
              href="/dias/how-it-works"
              onClick={() => setMobileMenuOpen(false)}
              className="block text-sm font-medium text-[#F4F2ED] hover:text-[#C5A46D] py-1"
            >
              How It Works
            </Link>
          </div>
          <div className="flex flex-col gap-2.5 pt-1">
            {isUserLoggedIn ? (
              <div className="p-3 rounded-2xl bg-white/[0.04] border border-white/10 flex items-center justify-between">
                <div>
                  <div className="text-xs font-bold text-white">{displayName}</div>
                  <div className="text-[10px] font-mono text-[#C5A46D]">@{displayHandle}</div>
                </div>
                <button
                  type="button"
                  onClick={() => {
                    setMobileMenuOpen(false);
                    if (signOut) signOut();
                  }}
                  className="text-xs text-red-400 font-medium"
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
            <Link href="/dias?dais=true" onClick={() => setMobileMenuOpen(false)}>
              <DiasButton variant="gold" size="md" className="w-full">
                Enter the Dias
              </DiasButton>
            </Link>
          </div>
        </div>
      )}
    </header>
  );
};
