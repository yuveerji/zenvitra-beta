'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { Gavel, Menu, X, ArrowRight, ShieldCheck, Compass, Sparkles } from 'lucide-react';
import { DiasButton } from './DiasButton';

export const DiasNav: React.FC = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

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
          <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-[#181B21] to-[#111318] border border-[#C5A46D]/40 flex items-center justify-center text-[#C5A46D] shadow-[0_0_15px_rgba(197,164,109,0.15)] group-hover:border-[#C5A46D] transition-colors">
            <Gavel className="w-4 h-4" />
          </div>
          <div className="flex flex-col text-left">
            <div className="flex items-center gap-2">
              <span className="text-sm font-bold tracking-[0.2em] text-[#F4F2ED] uppercase font-sans">
                ZENVITRA
              </span>
              <span className="text-[10px] uppercase font-semibold px-1.5 py-0.5 rounded bg-[#C5A46D]/20 text-[#E6D1A5] border border-[#C5A46D]/30 tracking-wider">
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
            href="/dias#capabilities"
            className="text-xs font-medium uppercase tracking-wider text-[#9A9DA5] hover:text-[#F4F2ED] transition-colors"
          >
            Platform
          </Link>
          <Link
            href="/dias/features"
            className="text-xs font-medium uppercase tracking-wider text-[#9A9DA5] hover:text-[#F4F2ED] transition-colors"
          >
            Features
          </Link>
          <Link
            href="/dias/how-it-works"
            className="text-xs font-medium uppercase tracking-wider text-[#9A9DA5] hover:text-[#F4F2ED] transition-colors"
          >
            How It Works
          </Link>
          <Link
            href="/chamber"
            className="text-xs font-medium uppercase tracking-wider text-[#9A9DA5] hover:text-[#C5A46D] transition-colors flex items-center gap-1.5"
          >
            <Compass className="w-3.5 h-3.5 text-[#C5A46D]" />
            Live Chamber
          </Link>
        </nav>

        {/* Action Controls */}
        <div className="hidden md:flex items-center gap-3">
          <Link href="/login">
            <DiasButton variant="ghost" size="sm">
              Sign In
            </DiasButton>
          </Link>
          <Link href="/host?dais=true">
            <DiasButton
              variant="gold"
              size="sm"
              rightIcon={<ArrowRight className="w-3.5 h-3.5 ml-0.5" />}
            >
              Enter the Dias
            </DiasButton>
          </Link>
        </div>

        {/* Mobile Hamburger Button */}
        <div className="flex md:hidden items-center gap-2">
          <Link href="/host?dais=true">
            <DiasButton variant="gold" size="sm">
              Dais
            </DiasButton>
          </Link>
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="p-2 rounded-xl bg-[#181B21] border border-[#232731] text-[#F4F2ED] hover:text-[#C5A46D] transition-colors"
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
              href="/dias#capabilities"
              onClick={() => setMobileMenuOpen(false)}
              className="block text-sm font-medium text-[#F4F2ED] hover:text-[#C5A46D] py-1"
            >
              Platform Capabilities
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
            <Link
              href="/chamber"
              onClick={() => setMobileMenuOpen(false)}
              className="block text-sm font-medium text-[#C5A46D] py-1"
            >
              Live Chamber Floor
            </Link>
          </div>
          <div className="flex flex-col gap-2.5 pt-1">
            <Link href="/login" onClick={() => setMobileMenuOpen(false)}>
              <DiasButton variant="charcoal" size="md" className="w-full">
                Sign In
              </DiasButton>
            </Link>
            <Link href="/host?dais=true" onClick={() => setMobileMenuOpen(false)}>
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
