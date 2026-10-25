'use client';

import React from 'react';
import { motion } from 'framer-motion';

export function ZenChatBrandStatement() {
  return (
    <section className="relative py-28 px-4 sm:px-6 lg:px-8 border-y border-white/10 bg-gradient-to-b from-[#02040a] via-[#060b19] to-[#02040a] overflow-hidden">
      {/* Subtle Central Glow */}
      <div 
        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-[600px] h-[300px] bg-blue-600/10 rounded-full blur-3xl pointer-events-none" 
        aria-hidden="true" 
      />

      <div className="relative z-10 max-w-4xl mx-auto text-center space-y-8">
        {/* Subtle Brand Tag */}
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/[0.04] border border-white/10 text-[11px] font-mono tracking-[0.25em] text-neutral-400 uppercase">
          Ecosystem Philosophy
        </div>

        {/* Editorial Headline */}
        <h2
          className="text-4xl sm:text-6xl md:text-7xl font-bold tracking-tight text-white uppercase leading-[1.05]"
          style={{ fontFamily: 'Clash Display, var(--font-space), sans-serif' }}
        >
          LESS CHAOS. <br className="hidden sm:inline" />
          <span className="bg-gradient-to-r from-blue-400 via-white to-blue-200 bg-clip-text text-transparent">
            MORE CONNECTION.
          </span>
        </h2>

        {/* Core Manifesto Quote */}
        <p className="max-w-2xl mx-auto text-base sm:text-xl text-neutral-300 font-sans leading-relaxed">
          “Whether you're coordinating a conference, connecting with your committee, or simply finding your people, <span className="text-white font-medium">ZEN.CHAT</span> is being built around one idea: conversations should bring us closer, not scatter us across platforms.”
        </p>

        {/* Restrained ZENVITRA Brand Signature */}
        <div className="pt-8 flex flex-col items-center justify-center gap-3">
          <div className="w-10 h-10 flex items-center justify-center">
            <img
              src="/assets/logo-new.png"
              alt="ZENVITRA Signature"
              className="w-full h-full object-contain mix-blend-screen opacity-90 drop-shadow-[0_0_12px_rgba(255,255,255,0.3)] brand-logo-img"
            />
          </div>
          <span
            className="text-xs sm:text-sm font-bold tracking-[0.25em] text-[#f5f1ea] uppercase"
            style={{ fontFamily: 'Clash Display, var(--font-space), sans-serif' }}
          >
            AN ECOSYSTEM BY ZENVITRA
          </span>
        </div>
      </div>
    </section>
  );
}
