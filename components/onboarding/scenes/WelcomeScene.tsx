'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { ArrowRight, Sparkles, Shield, Compass } from 'lucide-react';

interface WelcomeSceneProps {
  onStart: () => void;
  onSkip: () => void;
  userName?: string;
  roleTrack?: string;
}

export function WelcomeScene({ onStart, onSkip, userName, roleTrack }: WelcomeSceneProps) {
  return (
    <div className="relative w-full max-w-4xl mx-auto flex flex-col items-center justify-center text-center px-4 py-8 sm:py-16 select-none">
      {/* Background radial ambient glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-[500px] h-[500px] bg-gradient-to-tr from-cyan-500/10 via-emerald-500/5 to-transparent rounded-full blur-[140px] pointer-events-none" />

      {/* Role / Member Pill */}
      <motion.div
        initial={{ opacity: 0, y: -16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
        className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/[0.04] border border-white/10 backdrop-blur-md text-neutral-300 font-mono text-[11px] tracking-widest uppercase mb-8"
      >
        <Sparkles className="w-3.5 h-3.5 text-cyan-400 animate-pulse" />
        <span>SOVEREIGN ACCESS &bull; {userName ? `@${userName}` : 'NEW MEMBER'}</span>
        {roleTrack && (
          <span className="px-2 py-0.5 rounded-full bg-cyan-500/10 text-cyan-300 border border-cyan-500/20 text-[9px] font-bold">
            {roleTrack.toUpperCase()}
          </span>
        )}
      </motion.div>

      {/* Official Zenvitra Logo Emblem */}
      <motion.div
        initial={{ opacity: 0, scale: 0.85 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.65, delay: 0.05, ease: [0.16, 1, 0.3, 1] }}
        className="mb-4 relative flex items-center justify-center"
      >
        <div className="w-14 h-14 sm:w-16 sm:h-16 rounded-2xl bg-white/[0.04] p-2 border border-white/15 shadow-[0_0_35px_rgba(6,182,212,0.2)] flex items-center justify-center backdrop-blur-xl">
          <img
            src="/assets/logo.png"
            alt="Zenvitra Logo"
            className="w-full h-full object-contain filter drop-shadow-[0_0_10px_rgba(255,255,255,0.35)]"
          />
        </div>
      </motion.div>

      {/* Main Title Sequence */}
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.7, delay: 0.1, ease: [0.16, 1, 0.3, 1] }}
        className="space-y-4 max-w-3xl"
      >
        <h1 className="text-4xl sm:text-6xl md:text-7xl font-black font-display tracking-tight text-white uppercase leading-[0.95]">
          WELCOME TO <span className="bg-gradient-to-r from-white via-cyan-200 to-neutral-400 bg-clip-text text-transparent">ZENVITRA.</span>
        </h1>

        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.7, delay: 0.25 }}
          className="text-sm sm:text-base font-mono font-bold tracking-[0.3em] uppercase text-cyan-400/90"
        >
          BY YOUTH. FOR YOUTH.
        </motion.p>
      </motion.div>

      {/* Cinematic Creed Lines */}
      <motion.div
        initial={{ opacity: 0, y: 14 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, delay: 0.4, ease: [0.16, 1, 0.3, 1] }}
        className="mt-8 sm:mt-10 max-w-xl text-neutral-300 font-sans text-sm sm:text-base leading-relaxed space-y-1.5"
      >
        <p className="text-neutral-400">A space to participate.</p>
        <p className="text-neutral-200 font-medium">A space to create.</p>
        <p className="text-white font-semibold">A space to be heard.</p>
      </motion.div>

      {/* Actions */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, delay: 0.55 }}
        className="mt-12 flex flex-col sm:flex-row items-center justify-center gap-4 w-full sm:w-auto"
      >
        <button
          type="button"
          onClick={() => onStart()}
          className="w-full sm:w-auto px-8 py-4 rounded-2xl bg-gradient-to-r from-cyan-500 to-emerald-400 hover:from-cyan-400 hover:to-emerald-300 text-black font-display font-bold text-sm tracking-wide shadow-[0_0_40px_rgba(6,182,212,0.3)] transition-all hover:scale-[1.02] active:scale-[0.98] flex items-center justify-center gap-3 cursor-pointer group"
        >
          <span>START ONBOARDING TOUR</span>
          <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
        </button>

        <button
          type="button"
          onClick={() => onSkip()}
          className="w-full sm:w-auto px-6 py-4 rounded-2xl bg-white/[0.03] hover:bg-white/[0.08] border border-white/10 text-neutral-400 hover:text-white font-mono text-xs tracking-wider uppercase transition cursor-pointer"
        >
          SKIP TOUR
        </button>
      </motion.div>

      {/* Time to explore notice */}
      <motion.span
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.8, delay: 0.7 }}
        className="mt-8 text-[11px] font-mono text-neutral-500"
      >
        Interactive 2-minute overview &bull; Keyboard navigation supported (&larr; &rarr;)
      </motion.span>
    </div>
  );
}
