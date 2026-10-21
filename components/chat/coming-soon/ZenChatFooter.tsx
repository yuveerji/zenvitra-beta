'use client';

import React from 'react';
import Link from 'next/link';

export function ZenChatFooter() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="border-t border-white/10 bg-[#020408] py-12 px-4 sm:px-6 lg:px-8 select-none">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-6 text-center md:text-left">
        {/* LEFT: ZENVITRA Brand Identity + Product Status */}
        <div className="flex flex-col sm:flex-row items-center gap-3 sm:gap-4">
          <Link href="/" className="flex items-center gap-2.5 group">
            <div className="w-7 h-7 flex items-center justify-center">
              <img
                src="/assets/logo-new.png"
                alt="ZENVITRA Logo"
                className="w-full h-full object-contain mix-blend-screen opacity-90 group-hover:opacity-100 transition-opacity brand-logo-img"
              />
            </div>
            <span
              className="text-[#f5f1ea] font-bold text-sm tracking-[0.14em] uppercase group-hover:text-white transition-colors"
              style={{ fontFamily: 'Clash Display, var(--font-space), sans-serif' }}
            >
              ZENVITRA
            </span>
          </Link>

          <span className="hidden sm:inline text-white/20">•</span>

          <span className="text-xs font-mono tracking-wider text-blue-300 uppercase">
            ZEN.CHAT — COMING SOON
          </span>
        </div>

        {/* CENTER: Navigation Links */}
        <div className="flex flex-wrap items-center justify-center gap-5 sm:gap-6 text-xs text-neutral-400">
          <Link href="/" className="hover:text-white transition-colors">
            Main Platform
          </Link>
          <Link href="/mun" className="hover:text-white transition-colors">
            MUN Ecosystem
          </Link>
          <Link href="/events" className="hover:text-white transition-colors">
            Events
          </Link>
          <Link href="/privacy" className="hover:text-white transition-colors">
            Privacy Policy
          </Link>
          <Link href="/terms" className="hover:text-white transition-colors">
            Terms of Service
          </Link>
        </div>

        {/* RIGHT: Restrained Copyright Notice */}
        <div className="text-xs font-mono text-neutral-400">
          © {currentYear} ZENVITRA. All rights reserved.
        </div>
      </div>
    </footer>
  );
}
