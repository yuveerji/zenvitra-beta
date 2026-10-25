'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Calendar,
  Activity,
  User,
  Sparkles,
  ArrowRight,
  Bell,
  CheckCircle2,
  Trophy,
  Compass,
  Radio,
  Layers,
  Flame,
  Globe2
} from 'lucide-react';

interface DashboardPreviewSceneProps {
  onNext: () => void;
  userName?: string;
}

type SpotlightId = 'upcoming' | 'activity' | 'recommended' | 'profile';

interface SpotlightItem {
  id: SpotlightId;
  label: string;
  tagline: string;
  description: string;
  icon: any;
  color: string;
  activeBorder: string;
  activeGlow: string;
}

const SPOTLIGHTS: SpotlightItem[] = [
  {
    id: 'upcoming',
    label: 'UPCOMING EVENTS',
    tagline: 'See what’s happening next.',
    description: 'Track real-time committee schedules, your booked delegate passes, committee floor sessions, and upcoming summits.',
    icon: Calendar,
    color: 'from-cyan-500/20 text-cyan-400 border-cyan-500/40',
    activeBorder: 'border-cyan-400 bg-cyan-500/15',
    activeGlow: 'shadow-[0_0_30px_rgba(6,182,212,0.25)]',
  },
  {
    id: 'activity',
    label: 'REACTIVE ACTIVITY',
    tagline: 'Track what you’ve been doing across ZENVITRA.',
    description: 'Instant synchronized ledger of your votes, speeches, verified gate checks, payment receipts, and dais roll calls.',
    icon: Activity,
    color: 'from-emerald-500/20 text-emerald-400 border-emerald-500/40',
    activeBorder: 'border-emerald-400 bg-emerald-500/15',
    activeGlow: 'shadow-[0_0_30px_rgba(16,185,129,0.25)]',
  },
  {
    id: 'recommended',
    label: 'DISCOVERY FEED',
    tagline: 'Curated summits and opportunities.',
    description: 'Youth summits, student debates, open mics, hackathons, and pitch arenas tailored directly to your interest track.',
    icon: Sparkles,
    color: 'from-purple-500/20 text-purple-400 border-purple-500/40',
    activeBorder: 'border-purple-400 bg-purple-500/15',
    activeGlow: 'shadow-[0_0_30px_rgba(168,85,247,0.25)]',
  },
  {
    id: 'profile',
    label: 'PROFILE & PASSPORT',
    tagline: 'Your identity across the platform.',
    description: 'Your permanent delegate dossier, verified participation stamps, achievements, level progression, and lifelong credentials.',
    icon: User,
    color: 'from-amber-500/20 text-amber-400 border-amber-500/40',
    activeBorder: 'border-amber-400 bg-amber-500/15',
    activeGlow: 'shadow-[0_0_30px_rgba(245,158,11,0.25)]',
  },
];

export function DashboardPreviewScene({ onNext, userName }: DashboardPreviewSceneProps) {
  const [activeSpotlight, setActiveSpotlight] = useState<SpotlightId>('upcoming');

  const activeItem = SPOTLIGHTS.find((s) => s.id === activeSpotlight) || SPOTLIGHTS[0];

  return (
    <div className="relative w-full max-w-5xl mx-auto flex flex-col items-center justify-center px-4 py-6 sm:py-10 select-none">
      {/* Background radial glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-[700px] h-[450px] bg-cyan-500/10 rounded-full blur-[150px] pointer-events-none" />

      {/* Header */}
      <div className="text-center space-y-2 mb-8">
        <div className="text-[11px] font-mono tracking-[0.25em] text-neutral-400 uppercase">
          02 &bull; COMMAND CENTER
        </div>
        <h2 className="text-3xl sm:text-5xl font-black font-display tracking-tight text-white uppercase">
          YOUR <span className="text-cyan-400">HOME.</span>
        </h2>
        <p className="text-xs sm:text-sm text-neutral-400 font-mono">
          &ldquo;Your central command center across the ZENVITRA ecosystem.&rdquo;
        </p>
      </div>

      {/* Spotlight Switcher Pills */}
      <div className="flex flex-wrap items-center justify-center gap-2 mb-6">
        {SPOTLIGHTS.map((item) => {
          const isSelected = activeSpotlight === item.id;
          const Icon = item.icon;
          return (
            <button
              key={item.id}
              type="button"
              onClick={() => setActiveSpotlight(item.id)}
              className={`px-3.5 py-2 rounded-2xl text-xs font-mono font-bold transition-all cursor-pointer flex items-center gap-2 border ${
                isSelected
                  ? 'bg-white text-black border-white shadow-[0_0_20px_rgba(255,255,255,0.25)] scale-105'
                  : 'bg-white/[0.04] text-neutral-400 hover:text-white border-white/10 hover:border-white/20'
              }`}
            >
              <Icon className="w-3.5 h-3.5" />
              <span>{item.label}</span>
            </button>
          );
        })}
      </div>

      {/* High-Fidelity Animated Mockup Container */}
      <div className="w-full relative rounded-3xl border border-white/15 bg-[#090b10]/95 backdrop-blur-2xl p-4 sm:p-6 shadow-[0_0_80px_rgba(0,0,0,0.8)] overflow-hidden">
        {/* Mock Top Status Bar */}
        <div className="flex items-center justify-between pb-4 border-b border-white/10 text-xs font-mono">
          <div className="flex items-center gap-2 text-neutral-400">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse" />
            <span className="font-bold text-white uppercase">ZENVITRA COMMAND</span>
            <span className="text-neutral-500 hidden sm:inline">&bull; NODE ONLINE</span>
          </div>
          <div className="flex items-center gap-3 text-neutral-400">
            <span className="px-2 py-0.5 rounded bg-cyan-500/10 text-cyan-300 border border-cyan-500/20 text-[10px]">
              @{userName || 'delegate'}
            </span>
            <Bell className="w-3.5 h-3.5 text-neutral-400" />
          </div>
        </div>

        {/* Dashboard 4-Column Grid Mockup */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3.5 mt-5">
          {/* Col 1: Upcoming Events Spotlight */}
          <div
            onClick={() => setActiveSpotlight('upcoming')}
            className={`p-3.5 rounded-2xl border transition-all cursor-pointer flex flex-col justify-between ${
              activeSpotlight === 'upcoming'
                ? 'bg-cyan-500/15 border-cyan-400 shadow-[0_0_30px_rgba(6,182,212,0.25)] ring-1 ring-cyan-400/50'
                : 'bg-white/[0.02] border-white/10 hover:border-white/20'
            }`}
          >
            <div>
              <div className="flex items-center justify-between text-xs font-mono font-bold text-neutral-400 mb-3">
                <span className="flex items-center gap-1.5 text-cyan-400">
                  <Calendar className="w-3.5 h-3.5" />
                  <span>UPCOMING</span>
                </span>
                <span className="px-1.5 py-0.5 rounded bg-cyan-500/20 text-cyan-300 text-[9px] font-bold">LIVE</span>
              </div>
              <div className="space-y-2">
                <div className="p-2.5 rounded-xl bg-black/60 border border-white/10 space-y-1">
                  <span className="text-[10px] font-mono text-cyan-300 uppercase block">Model UN Summit 2026</span>
                  <span className="text-xs font-bold text-white block truncate">UN Security Council Plenary</span>
                  <span className="text-[10px] font-mono text-neutral-500 block">Tomorrow &bull; 09:00 AM UTC</span>
                </div>
                <div className="p-2.5 rounded-xl bg-black/40 border border-white/5 space-y-1">
                  <span className="text-[10px] font-mono text-neutral-400 uppercase block">Youth Forum</span>
                  <span className="text-xs font-bold text-neutral-300 block truncate">Climate &amp; AI Direct Policy</span>
                  <span className="text-[10px] font-mono text-neutral-600 block">Oct 24 &bull; Registered</span>
                </div>
              </div>
            </div>
            <div className="pt-2 text-[10px] font-mono text-neutral-500 border-t border-white/5 mt-2">
              Next Agenda: <strong>09:30 AM</strong>
            </div>
          </div>

          {/* Col 2: Activity Stream Spotlight */}
          <div
            onClick={() => setActiveSpotlight('activity')}
            className={`p-3.5 rounded-2xl border transition-all cursor-pointer flex flex-col justify-between ${
              activeSpotlight === 'activity'
                ? 'bg-emerald-500/15 border-emerald-400 shadow-[0_0_30px_rgba(16,185,129,0.25)] ring-1 ring-emerald-400/50'
                : 'bg-white/[0.02] border-white/10 hover:border-white/20'
            }`}
          >
            <div>
              <div className="flex items-center justify-between text-xs font-mono font-bold text-neutral-400 mb-3">
                <span className="flex items-center gap-1.5 text-emerald-400">
                  <Activity className="w-3.5 h-3.5" />
                  <span>RECENT ACTIVITY</span>
                </span>
                <span className="px-1.5 py-0.5 rounded bg-emerald-500/20 text-emerald-300 text-[9px] font-bold">SYNCED</span>
              </div>
              <div className="space-y-2 text-xs font-mono">
                <div className="p-2 rounded-xl bg-black/60 border border-white/10 flex items-center gap-2">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                  <div className="min-w-0">
                    <span className="text-[11px] text-white block truncate">Pass verified at gate</span>
                    <span className="text-[9px] text-neutral-500 block">Just now</span>
                  </div>
                </div>
                <div className="p-2 rounded-xl bg-black/40 border border-white/5 flex items-center gap-2">
                  <Radio className="w-3.5 h-3.5 text-cyan-400 shrink-0" />
                  <div className="min-w-0">
                    <span className="text-[11px] text-neutral-300 block truncate">Joined GSL Speaker Queue</span>
                    <span className="text-[9px] text-neutral-500 block">2 hrs ago</span>
                  </div>
                </div>
                <div className="p-2 rounded-xl bg-black/40 border border-white/5 flex items-center gap-2">
                  <Trophy className="w-3.5 h-3.5 text-amber-400 shrink-0" />
                  <div className="min-w-0">
                    <span className="text-[11px] text-neutral-300 block truncate">Resolution co-sponsored</span>
                    <span className="text-[9px] text-neutral-500 block">Yesterday</span>
                  </div>
                </div>
              </div>
            </div>
            <div className="pt-2 text-[10px] font-mono text-neutral-500 border-t border-white/5 mt-2">
              Sync State: <strong>100% On-Chain</strong>
            </div>
          </div>

          {/* Col 3: Discovery Feed Spotlight (⭐ Dedicated Card) */}
          <div
            onClick={() => setActiveSpotlight('recommended')}
            className={`p-3.5 rounded-2xl border transition-all cursor-pointer flex flex-col justify-between ${
              activeSpotlight === 'recommended'
                ? 'bg-purple-500/15 border-purple-400 shadow-[0_0_30px_rgba(168,85,247,0.25)] ring-1 ring-purple-400/50'
                : 'bg-white/[0.02] border-white/10 hover:border-white/20'
            }`}
          >
            <div>
              <div className="flex items-center justify-between text-xs font-mono font-bold text-neutral-400 mb-3">
                <span className="flex items-center gap-1.5 text-purple-400">
                  <Sparkles className="w-3.5 h-3.5" />
                  <span>DISCOVERY FEED</span>
                </span>
                <span className="px-1.5 py-0.5 rounded bg-purple-500/20 text-purple-300 text-[9px] font-bold">EXPLORE</span>
              </div>
              <div className="space-y-2">
                <div className="p-2.5 rounded-xl bg-black/60 border border-white/10 space-y-1">
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-mono text-purple-300 uppercase">Youth Innovation Arena</span>
                    <Flame className="w-3 h-3 text-amber-400" />
                  </div>
                  <span className="text-xs font-bold text-white block truncate">Pitch &amp; Policy Challenge</span>
                  <span className="text-[10px] font-mono text-neutral-400 block">New Delhi &bull; Open Pass</span>
                </div>
                <div className="p-2.5 rounded-xl bg-black/40 border border-white/5 space-y-1">
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-mono text-cyan-300 uppercase">Global Diplomacy Forum</span>
                    <Globe2 className="w-3 h-3 text-cyan-400" />
                  </div>
                  <span className="text-xs font-bold text-neutral-300 block truncate">UNGA 2nd Committee</span>
                  <span className="text-[10px] font-mono text-neutral-500 block">Virtual Chamber &bull; Free</span>
                </div>
              </div>
            </div>
            <div className="pt-2 flex items-center gap-1.5 text-[9px] font-mono text-purple-300 border-t border-white/5 mt-2">
              <span className="px-1.5 py-0.5 rounded bg-purple-500/10 border border-purple-500/20">#SUMMIT</span>
              <span className="px-1.5 py-0.5 rounded bg-purple-500/10 border border-purple-500/20">#MUN</span>
              <span className="px-1.5 py-0.5 rounded bg-purple-500/10 border border-purple-500/20">#POLICY</span>
            </div>
          </div>

          {/* Col 4: Profile Snapshot & Passport */}
          <div
            onClick={() => setActiveSpotlight('profile')}
            className={`p-3.5 rounded-2xl border transition-all cursor-pointer flex flex-col justify-between ${
              activeSpotlight === 'profile'
                ? 'bg-amber-500/15 border-amber-400 shadow-[0_0_30px_rgba(245,158,11,0.25)] ring-1 ring-amber-400/50'
                : 'bg-white/[0.02] border-white/10 hover:border-white/20'
            }`}
          >
            <div>
              <div className="flex items-center justify-between text-xs font-mono font-bold text-neutral-400 mb-3">
                <span className="flex items-center gap-1.5 text-amber-400">
                  <User className="w-3.5 h-3.5" />
                  <span>PROFILE &amp; PASSPORT</span>
                </span>
                <span className="px-1.5 py-0.5 rounded bg-amber-500/20 text-amber-300 text-[9px] font-bold">LEVEL 1</span>
              </div>
              <div className="p-3 rounded-xl bg-black/60 border border-white/10 space-y-2">
                <div className="flex items-center gap-2.5">
                  <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-cyan-400 to-amber-400 p-0.5">
                    <div className="w-full h-full rounded-full bg-black flex items-center justify-center text-xs font-bold text-white">
                      {userName ? userName[0].toUpperCase() : 'Z'}
                    </div>
                  </div>
                  <div>
                    <span className="text-xs font-bold text-white block">@{userName || 'delegate'}</span>
                    <span className="text-[10px] font-mono text-cyan-300 block">Sovereign Node #1</span>
                  </div>
                </div>
                <div className="pt-1 flex items-center justify-between text-[10px] font-mono text-neutral-400 border-t border-white/10">
                  <span>Stamps: <strong>4 Verified</strong></span>
                  <span>Karma: <strong>120</strong></span>
                </div>
              </div>
            </div>
            <div className="pt-2 text-[10px] font-mono text-neutral-500 border-t border-white/5 mt-2">
              Credentials: <strong>Permanent Dossier</strong>
            </div>
          </div>
        </div>

        {/* Dynamic Context Spotlight Explainer Box */}
        <AnimatePresence mode="wait">
          <motion.div
            key={activeItem.id}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.2 }}
            className="mt-6 p-4 rounded-2xl bg-white/[0.04] border border-white/10 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-left"
          >
            <div className="space-y-1">
              <span className="text-xs font-mono font-bold text-cyan-300 uppercase block">
                {activeItem.tagline}
              </span>
              <p className="text-xs text-neutral-300 font-sans max-w-xl">
                {activeItem.description}
              </p>
            </div>
            <span className="text-[10px] font-mono px-3 py-1 rounded-full bg-white/10 text-white border border-white/15 self-start sm:self-auto shrink-0">
              CLICK CARDS TO INSPECT
            </span>
          </motion.div>
        </AnimatePresence>
      </div>

      {/* Next CTA */}
      <div className="mt-8">
        <button
          type="button"
          onClick={onNext}
          className="px-8 py-3.5 rounded-2xl bg-gradient-to-r from-cyan-500 to-emerald-400 hover:from-cyan-400 hover:to-emerald-300 text-black font-display font-bold text-xs uppercase tracking-wider transition-all hover:scale-105 active:scale-95 shadow-xl flex items-center gap-2 cursor-pointer group"
        >
          <span>CONTINUE TO EVENTS</span>
          <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
        </button>
      </div>
    </div>
  );
}
