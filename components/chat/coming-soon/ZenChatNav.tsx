'use client';

import React from 'react';
import Link from 'next/link';
import { ArrowLeft, ArrowUpRight, Compass, Shield } from 'lucide-react';

export function ZenChatNav() {
  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-[#030712]/85 backdrop-blur-xl border-b border-white/10 transition-all duration-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 sm:h-20 flex items-center justify-between gap-4">
        {/* LEFT: ZENVITRA Logo + Divider + Product Label */}
        <div className="flex items-center gap-3 sm:gap-4 shrink-0">
          <Link
            href="/"
            className="flex items-center gap-2.5 sm:gap-3 group select-none transition-transform active:scale-95"
            title="Return to ZENVITRA Sovereign Platform"
          >
            <div className="relative w-8 h-8 sm:w-9 sm:h-9 flex items-center justify-center shrink-0">
              <img
                src="/assets/logo-new.png"
                alt="ZENVITRA Logo"
                className="w-full h-full object-contain mix-blend-screen filter drop-shadow-[0_0_10px_rgba(255,255,255,0.3)] group-hover:scale-105 transition-transform duration-300 brand-logo-img"
              />
            </div>
            <span
              className="text-[#f5f1ea] font-bold text-sm sm:text-base tracking-[0.14em] uppercase group-hover:text-white transition-colors leading-none"
              style={{ fontFamily: 'Clash Display, var(--font-space), sans-serif' }}
            >
              ZENVITRA
            </span>
          </Link>

          {/* Elegant Divider */}
          <span className="h-4 sm:h-5 w-px bg-white/20" aria-hidden="true" />

          {/* Product Identification Label */}
          <div className="flex items-center gap-2">
            <span
              className="text-xs sm:text-sm font-semibold tracking-wider text-blue-300/90 uppercase"
              style={{ fontFamily: 'Clash Display, var(--font-space), sans-serif' }}
            >
              ZEN.CHAT
            </span>
            <span className="hidden md:inline-flex items-center px-1.5 py-0.5 rounded text-[9px] font-mono tracking-widest uppercase bg-blue-500/10 text-blue-400 border border-blue-500/25">
              ECOSYSTEM
            </span>
          </div>
        </div>

        {/* RIGHT: Real verified navigation actions & status pill */}
        <div className="flex items-center gap-2.5 sm:gap-4">
          {/* Status Label */}
          <div className="flex items-center gap-2 px-2.5 py-1 sm:px-3 sm:py-1 rounded-full bg-blue-950/40 border border-blue-500/30 text-blue-200 text-[10px] sm:text-xs font-mono tracking-wider shadow-[0_0_15px_rgba(59,130,246,0.15)]">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-blue-400 opacity-75" />
              <span className="relative inline-flex rounded-full h-2 w-2 bg-blue-500" />
            </span>
            <span className="uppercase font-semibold">IN DEVELOPMENT</span>
          </div>

          {/* Explore ZENVITRA Link */}
          <Link
            href="/mun"
            className="hidden sm:inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium text-neutral-300 hover:text-white hover:bg-white/5 border border-transparent hover:border-white/10 transition-colors"
          >
            <Compass className="w-3.5 h-3.5 text-blue-400" />
            <span>Explore MUN</span>
          </Link>

          {/* Back to ZENVITRA Homepage */}
          <Link
            href="/"
            className="inline-flex items-center gap-1.5 px-3 py-1.5 sm:px-4 sm:py-2 rounded-lg text-xs sm:text-sm font-semibold text-white bg-white/10 hover:bg-white/15 border border-white/20 hover:border-white/30 transition-all duration-200 active:scale-95 shadow-sm"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span className="hidden xs:inline">Back to ZENVITRA</span>
            <span className="xs:hidden">Home</span>
          </Link>
        </div>
      </div>
    </header>
  );
}
