'use client';

import React from 'react';
import { motion } from 'framer-motion';
import {
  Radio,
  Sparkles,
  MessageSquare,
  Flame,
  ArrowRight,
  TrendingUp,
  Share2
} from 'lucide-react';

interface CommunityExpressionSceneProps {
  onNext: () => void;
}

export function CommunityExpressionScene({ onNext }: CommunityExpressionSceneProps) {
  return (
    <div className="relative w-full max-w-5xl mx-auto flex flex-col items-center justify-center px-4 py-6 sm:py-10 select-none">
      {/* Background radial glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-[650px] h-[350px] bg-purple-500/10 rounded-full blur-[140px] pointer-events-none" />

      {/* Header */}
      <div className="text-center space-y-2 mb-8">
        <div className="text-[11px] font-mono tracking-[0.25em] text-neutral-400 uppercase">
          07 &bull; COMMUNITY &amp; EXPRESSION
        </div>
        <h2 className="text-3xl sm:text-5xl font-black font-display tracking-tight text-white uppercase max-w-2xl leading-tight">
          YOUR VOICE <span className="text-purple-400">BELONGS HERE.</span>
        </h2>
        <p className="text-xs sm:text-sm text-neutral-400 font-mono">
          &ldquo;Discourse, ideas, live feedback, and youth-led journalism.&rdquo;
        </p>
      </div>

      {/* Side-by-Side Dual Engine Display (ZEN.PULSE and ZEN.FLUX) */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 w-full">
        {/* ZEN.PULSE Card */}
        <div className="p-6 rounded-3xl bg-[#0a0d14] border border-purple-500/30 text-left space-y-4 shadow-xl relative overflow-hidden">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <div className="w-9 h-9 rounded-2xl bg-purple-500/20 border border-purple-500/40 flex items-center justify-center text-purple-300">
                <Radio className="w-4 h-4 animate-pulse" />
              </div>
              <div>
                <h3 className="font-bold text-white font-mono text-sm">ZEN.PULSE</h3>
                <span className="text-[10px] font-mono text-purple-400">COMMUNITY DISCOURSE</span>
              </div>
            </div>
            <span className="px-2 py-0.5 rounded-full bg-emerald-500/15 text-emerald-300 border border-emerald-500/30 text-[9px] font-mono font-bold">
              ACTIVE
            </span>
          </div>

          <p className="text-xs text-neutral-300 font-sans leading-relaxed">
            The beating heart of youth discussion. Share perspectives, draft live press dispatches, debate public policy, and react with real-time consensus polling.
          </p>

          {/* Micro Post Mockup */}
          <div className="p-3 rounded-2xl bg-black/60 border border-white/10 space-y-2 text-xs font-mono">
            <div className="flex items-center justify-between text-neutral-400 text-[10px]">
              <span>@yuveer &bull; Founder</span>
              <span>2m ago</span>
            </div>
            <p className="text-white text-xs font-sans">
              &ldquo;Diplomacy is no longer confined to marble halls. Youth voices shape the future directly.&rdquo;
            </p>
            <div className="flex items-center gap-4 text-[10px] text-neutral-400 pt-1 border-t border-white/5">
              <span>🔥 42 Endorsements</span>
              <span>💬 18 Arguments</span>
            </div>
          </div>
        </div>

        {/* ZEN.FLUX & Editorial Card */}
        <div className="p-6 rounded-3xl bg-[#0a0d14] border border-white/10 text-left space-y-4 shadow-xl relative overflow-hidden">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <div className="w-9 h-9 rounded-2xl bg-cyan-500/15 border border-cyan-500/30 flex items-center justify-center text-cyan-300">
                <Sparkles className="w-4 h-4" />
              </div>
              <div>
                <h3 className="font-bold text-white font-mono text-sm">ZEN.FLUX</h3>
                <span className="text-[10px] font-mono text-cyan-400">DISCOVERY &amp; EDITORIAL</span>
              </div>
            </div>
            <span className="px-2 py-0.5 rounded-full bg-neutral-500/20 text-neutral-400 border border-neutral-500/30 text-[9px] font-mono font-bold">
              COMING SOON
            </span>
          </div>

          <p className="text-xs text-neutral-300 font-sans leading-relaxed">
            Curated short-form insights, delegate speech clips, investigative wire dossiers, and editorial showcases authored by students and young leaders worldwide.
          </p>

          {/* Micro Feature Bullet list */}
          <div className="p-3 rounded-2xl bg-black/60 border border-white/10 space-y-2 text-xs font-mono text-neutral-400">
            <div className="flex items-center gap-2">
              <TrendingUp className="w-3.5 h-3.5 text-cyan-400" />
              <span>Fast-Wire Student Bulletins</span>
            </div>
            <div className="flex items-center gap-2">
              <Flame className="w-3.5 h-3.5 text-amber-400" />
              <span>Chamber Highlight Reels</span>
            </div>
            <div className="flex items-center gap-2">
              <Share2 className="w-3.5 h-3.5 text-emerald-400" />
              <span>Peer-Reviewed Youth Research</span>
            </div>
          </div>
        </div>
      </div>

      {/* Next CTA */}
      <div className="mt-10">
        <button
          type="button"
          onClick={onNext}
          className="px-8 py-3.5 rounded-2xl bg-gradient-to-r from-purple-500 to-emerald-400 hover:from-purple-400 hover:to-emerald-300 text-black font-display font-bold text-xs uppercase tracking-wider transition-all hover:scale-105 active:scale-95 shadow-xl flex items-center gap-2 cursor-pointer group"
        >
          <span>YOUR FIRST 5 MINUTES</span>
          <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
        </button>
      </div>
    </div>
  );
}
