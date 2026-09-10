'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Radio, Gavel, Crown, Volume2, VolumeX, Sparkles, Menu, X, ArrowUpRight } from 'lucide-react';
import { useExperienceEngine } from './ExperienceContext';

export function ZenSovereignNav() {
  const pathname = usePathname();
  const { atmosphere, soundEnabled, setSoundEnabled } = useExperienceEngine();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 40);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navItems = [
    { label: 'PULSE', href: '/pulse', icon: Radio, tag: 'Living Feed' },
    { label: 'CHAMBER', href: '/committee', icon: Gavel, tag: 'Decision Dais' },
    { label: 'MUN', href: '/mun', icon: Crown, tag: 'Conference OS' },
  ];

  return (
    <>
      <header
        className={`fixed top-0 inset-x-0 z-50 transition-all duration-300 ${
          scrolled ? 'py-3 bg-black/75 backdrop-blur-2xl border-b border-white/[0.08]' : 'py-5 bg-transparent'
        }`}
      >
        <div className="max-w-6xl mx-auto px-6 flex items-center justify-between">
          {/* Brand Anchor */}
          <Link
            href="/"
            className="group flex items-center gap-2.5 select-none"
          >
            <div className="w-7 h-7 rounded-lg bg-white/5 border border-white/10 flex items-center justify-center group-hover:border-white/30 transition-colors shadow-inner">
              <span className="font-display font-black text-sm text-white">Z</span>
            </div>
            <span className="font-mono text-xs font-bold tracking-[0.28em] uppercase text-white group-hover:text-cyan-300 transition-colors">
              ZENVITRA
            </span>
          </Link>

          {/* Desktop Universe Portals */}
          <nav className="hidden md:flex items-center gap-1.5 p-1 rounded-full bg-white/[0.03] border border-white/[0.08] backdrop-blur-xl shadow-lg">
            {navItems.map((item) => {
              const active = pathname.startsWith(item.href);
              const Icon = item.icon;
              return (
                <Link
                  key={item.label}
                  href={item.href}
                  className={`flex items-center gap-2 px-4 py-1.5 rounded-full text-xs font-mono tracking-wider transition-all duration-200 ${
                    active
                      ? 'bg-white text-black font-semibold shadow-[0_0_20px_rgba(255,255,255,0.3)]'
                      : 'text-neutral-400 hover:text-white hover:bg-white/[0.06]'
                  }`}
                >
                  <Icon className="w-3.5 h-3.5" />
                  <span>{item.label}</span>
                </Link>
              );
            })}
          </nav>

          {/* Controls: Audio & Launch Enclave */}
          <div className="flex items-center gap-2.5">
            <button
              onClick={() => setSoundEnabled(!soundEnabled)}
              type="button"
              className={`p-2 rounded-full border transition-all duration-200 cursor-pointer ${
                soundEnabled
                  ? 'bg-amber-500/15 border-amber-500/40 text-amber-300'
                  : 'bg-white/[0.04] border-white/10 text-neutral-400 hover:text-white'
              }`}
              title={soundEnabled ? 'Disable Atmospheric Audio' : 'Enable Atmospheric Audio'}
            >
              {soundEnabled ? <Volume2 className="w-3.5 h-3.5 animate-pulse" /> : <VolumeX className="w-3.5 h-3.5" />}
            </button>

            <Link
              href="/pulse"
              className="hidden sm:inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white text-black font-mono text-xs font-bold hover:bg-neutral-200 transition shadow-[0_0_25px_rgba(255,255,255,0.2)]"
            >
              <span>ENTER</span>
              <ArrowUpRight className="w-3 h-3" />
            </Link>

            {/* Mobile Menu Toggle */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              type="button"
              className="md:hidden p-2 rounded-xl bg-white/[0.04] border border-white/10 text-neutral-300 hover:text-white cursor-pointer"
            >
              {mobileMenuOpen ? <X className="w-4 h-4" /> : <Menu className="w-4 h-4" />}
            </button>
          </div>
        </div>
      </header>

      {/* Mobile Drawer (Tested for 390x844) */}
      {mobileMenuOpen && (
        <div className="md:hidden fixed inset-0 z-40 bg-[#040508]/95 backdrop-blur-2xl p-6 pt-24 space-y-6 animate-in fade-in duration-200">
          <div className="space-y-2">
            <span className="font-mono text-[10px] tracking-widest uppercase text-neutral-500 block">
              EXPERIENCE WORLDS
            </span>
            <div className="space-y-2">
              {navItems.map((item) => {
                const Icon = item.icon;
                return (
                  <Link
                    key={item.label}
                    href={item.href}
                    onClick={() => setMobileMenuOpen(false)}
                    className="flex items-center justify-between p-4 rounded-2xl bg-white/[0.03] border border-white/10 hover:border-white/20 transition-all text-left"
                  >
                    <div className="flex items-center gap-3">
                      <Icon className="w-4 h-4 text-cyan-400" />
                      <div>
                        <div className="font-display font-bold text-base text-white">{item.label}</div>
                        <div className="font-mono text-[10px] text-neutral-400">{item.tag}</div>
                      </div>
                    </div>
                    <ArrowUpRight className="w-4 h-4 text-neutral-500" />
                  </Link>
                );
              })}
            </div>
          </div>

          <div className="pt-4 border-t border-white/10">
            <Link
              href="/pulse"
              onClick={() => setMobileMenuOpen(false)}
              className="w-full flex items-center justify-center gap-2 py-3 rounded-xl bg-white text-black font-mono font-bold text-xs shadow-lg"
            >
              <span>ENTER SOVEREIGN UNIVERSE</span>
              <ArrowUpRight className="w-3.5 h-3.5" />
            </Link>
          </div>
        </div>
      )}
    </>
  );
}
