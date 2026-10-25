'use client';

import React from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { ArrowDown, Sparkles, MessageSquare, Compass, ShieldCheck } from 'lucide-react';
import { NetworkMeshVisual } from './NetworkMeshVisual';

interface ZenChatHeroProps {
  onScrollToPreview?: () => void;
  onScrollToInterest?: () => void;
}

export function ZenChatHero({ onScrollToPreview, onScrollToInterest }: ZenChatHeroProps) {
  return (
    <section className="relative min-h-[92vh] flex items-center justify-center pt-24 pb-16 overflow-hidden">
      {/* Dynamic Background Network Mesh Visual */}
      <NetworkMeshVisual />

      {/* Atmospheric Ambient Radial Lighting (Cobalt & Deep Navy) */}
      <div 
        className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-[700px] sm:w-full max-w-[900px] h-[400px] sm:h-[550px] bg-[radial-gradient(ellipse_at_center,_rgba(37,99,235,0.18)_0%,_rgba(15,23,42,0.08)_50%,_transparent_80%)] blur-3xl pointer-events-none"
        aria-hidden="true"
      />
      <div 
        className="absolute bottom-0 left-0 right-0 h-40 bg-gradient-to-t from-black via-black/80 to-transparent pointer-events-none" 
        aria-hidden="true"
      />

      <div className="relative z-10 max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center flex flex-col items-center">
        {/* Eyebrow & Status Pill */}
        <motion.div
          initial={{ opacity: 0, y: 14 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
          className="inline-flex items-center gap-2.5 px-3.5 py-1.5 rounded-full bg-white/[0.04] border border-white/10 backdrop-blur-md mb-8 text-xs font-mono tracking-wider uppercase"
        >
          <div className="flex items-center gap-1.5 text-blue-400">
            <Sparkles className="w-3.5 h-3.5" />
            <span className="font-semibold text-blue-300">ZEN.CHAT BY ZENVITRA</span>
          </div>
          <span className="w-1 h-1 rounded-full bg-white/30" />
          <span className="text-neutral-400 font-semibold tracking-widest text-[11px] text-zinc-300">COMING SOON</span>
        </motion.div>

        {/* Core Vision Subtitle */}
        <motion.p
          initial={{ opacity: 0, y: 14 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.55, delay: 0.08, ease: [0.16, 1, 0.3, 1] }}
          className="text-xs sm:text-sm font-mono tracking-[0.22em] text-blue-400/90 uppercase font-semibold mb-4"
        >
          INTRODUCING THE NEXT CHAPTER OF CONNECTION
        </motion.p>

        {/* Dual Main Headlines */}
        <motion.div
          initial={{ opacity: 0, y: 18 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.14, ease: [0.16, 1, 0.3, 1] }}
          className="space-y-2 sm:space-y-3 mb-6"
        >
          <h1
            className="text-4xl sm:text-6xl md:text-7xl font-bold tracking-tight text-white uppercase leading-[1.05]"
            style={{ fontFamily: 'Clash Display, var(--font-space), sans-serif' }}
          >
            NOT JUST ANOTHER CHAT APP.
          </h1>
          <h2
            className="text-2xl sm:text-4xl md:text-5xl font-bold tracking-tight bg-gradient-to-r from-blue-300 via-white to-blue-200 bg-clip-text text-transparent uppercase leading-[1.1]"
            style={{ fontFamily: 'Clash Display, var(--font-space), sans-serif' }}
          >
            A SPACE THAT CONNECTS US ALL.
          </h2>
        </motion.div>

        {/* Supporting Description */}
        <motion.p
          initial={{ opacity: 0, y: 18 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.22, ease: [0.16, 1, 0.3, 1] }}
          className="max-w-2xl mx-auto text-base sm:text-lg text-neutral-300/90 font-sans leading-relaxed mb-8 sm:mb-10"
        >
          From the first announcement to the final committee session, <span className="text-white font-medium">ZEN.CHAT</span> is being built to bring conversations, communities, and MUN events together under one roof.
        </motion.p>

        {/* Strategic Identity Pillar */}
        <motion.div
          initial={{ opacity: 0, scale: 0.96 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.55, delay: 0.28, ease: [0.16, 1, 0.3, 1] }}
          className="inline-block px-4 py-2 rounded-xl bg-gradient-to-r from-blue-950/40 via-blue-900/20 to-blue-950/40 border border-blue-500/20 mb-10 text-xs sm:text-sm font-mono tracking-widest text-blue-200 uppercase"
        >
          YOUR PEOPLE. YOUR SPACE. YOUR CONVERSATIONS.
        </motion.div>

        {/* Interactive Action Controls */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.55, delay: 0.34, ease: [0.16, 1, 0.3, 1] }}
          className="flex flex-col sm:flex-row items-center gap-3.5 sm:gap-4 w-full sm:w-auto"
        >
          {onScrollToPreview && (
            <button
              type="button"
              onClick={onScrollToPreview}
              className="w-full sm:w-auto px-6 py-3.5 rounded-xl text-sm font-semibold text-white bg-blue-600 hover:bg-blue-500 shadow-[0_0_25px_rgba(37,99,235,0.4)] hover:shadow-[0_0_35px_rgba(37,99,235,0.6)] transition-all duration-200 flex items-center justify-center gap-2 group cursor-pointer active:scale-95"
            >
              <span>Explore Interface Preview</span>
              <ArrowDown className="w-4 h-4 group-hover:translate-y-0.5 transition-transform" />
            </button>
          )}

          {onScrollToInterest ? (
            <button
              type="button"
              onClick={onScrollToInterest}
              className="w-full sm:w-auto px-6 py-3.5 rounded-xl text-sm font-semibold text-neutral-200 bg-white/5 hover:bg-white/10 border border-white/15 hover:border-white/30 transition-all duration-200 flex items-center justify-center gap-2 cursor-pointer active:scale-95"
            >
              <MessageSquare className="w-4 h-4 text-blue-400" />
              <span>Get Early Access Updates</span>
            </button>
          ) : (
            <Link
              href="/"
              className="w-full sm:w-auto px-6 py-3.5 rounded-xl text-sm font-semibold text-neutral-200 bg-white/5 hover:bg-white/10 border border-white/15 hover:border-white/30 transition-all duration-200 flex items-center justify-center gap-2"
            >
              <Compass className="w-4 h-4 text-blue-400" />
              <span>Explore ZENVITRA</span>
            </Link>
          )}
        </motion.div>

        {/* Restrained Reassurance Tag */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.44 }}
          className="mt-8 flex items-center gap-2 text-[11px] font-mono uppercase tracking-wider text-neutral-400"
        >
          <ShieldCheck className="w-3.5 h-3.5 text-blue-400" />
          <span>The way we connect is about to change • Architecture in active development</span>
        </motion.div>
      </div>
    </section>
  );
}
