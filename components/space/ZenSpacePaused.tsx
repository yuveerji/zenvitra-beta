'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { 
  Clock, 
  Sparkles, 
  ShieldAlert, 
  ArrowRight, 
  Globe, 
  Radio, 
  Layers, 
  Music, 
  Compass, 
  CheckCircle2, 
  Bell, 
  Lock, 
  Unlock, 
  ChevronRight,
  ExternalLink,
  Code2,
  Cpu
} from 'lucide-react';
import { useAuth } from '@/context/AuthContext';
import { ZenSpaceView } from './ZenSpaceView';

interface ZenSpacePausedProps {
  username?: string;
}

export function ZenSpacePaused({ username = 'yuveer' }: ZenSpacePausedProps) {
  const { user, profile } = useAuth();
  const [bypassActive, setBypassActive] = useState(false);
  const [emailInput, setEmailInput] = useState('');
  const [isSubscribed, setIsSubscribed] = useState(false);

  // Target: November 25, 2026 00:00:00 IST (+05:30)
  const TARGET_DATE = new Date('2026-11-25T00:00:00+05:30').getTime();

  const [timeLeft, setTimeLeft] = useState<{
    days: number;
    hours: number;
    minutes: number;
    seconds: number;
    totalMs: number;
  }>({
    days: 41,
    hours: 7,
    minutes: 0,
    seconds: 0,
    totalMs: 41 * 86400000,
  });

  useEffect(() => {
    const calculateTime = () => {
      const now = Date.now();
      const difference = TARGET_DATE - now;

      if (difference > 0) {
        setTimeLeft({
          days: Math.floor(difference / (1000 * 60 * 60 * 24)),
          hours: Math.floor((difference / (1000 * 60 * 60)) % 24),
          minutes: Math.floor((difference / 1000 / 60) % 60),
          seconds: Math.floor((difference / 1000) % 60),
          totalMs: difference,
        });
      } else {
        setTimeLeft({
          days: 0,
          hours: 0,
          minutes: 0,
          seconds: 0,
          totalMs: 0,
        });
      }
    };

    calculateTime();
    const interval = setInterval(calculateTime, 1000);
    return () => clearInterval(interval);
  }, [TARGET_DATE]);

  // Check if saved subscription exists
  useEffect(() => {
    try {
      const saved = localStorage.getItem('zen_space_launch_subscribed');
      if (saved) setIsSubscribed(true);
    } catch {}
  }, []);

  const handleSubscribe = (e: React.FormEvent) => {
    e.preventDefault();
    if (!emailInput.trim()) return;
    try {
      localStorage.setItem('zen_space_launch_subscribed', emailInput.trim());
    } catch {}
    setIsSubscribed(true);
    setEmailInput('');
  };

  // Determine if viewer is founder/admin who can bypass
  const currentUsername = (profile?.username || user?.username || '').toLowerCase();
  const isFounder = 
    currentUsername === 'yuveer' || 
    profile?.role === 'core_team' || 
    profile?.role === 'admin' ||
    user?.email?.toLowerCase().includes('yuveer');

  // If founder bypass mode is active, render the live space view with a top banner
  if (bypassActive) {
    return (
      <div className="relative min-h-screen">
        <div className="sticky top-0 z-50 bg-amber-500/20 backdrop-blur-xl border-b border-amber-500/30 px-4 py-2.5 flex items-center justify-between text-xs text-amber-200">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-amber-400 animate-ping" />
            <span className="font-mono font-bold tracking-wider uppercase">
              FOUNDER PREVIEW MODE ACTIVE
            </span>
            <span className="hidden sm:inline text-amber-300/80">
              — ZEN.SPACE is currently paused for public visitors until Nov 25, 2026.
            </span>
          </div>
          <button
            onClick={() => setBypassActive(false)}
            className="px-3 py-1 bg-amber-500/30 hover:bg-amber-500/50 text-white font-mono rounded-lg transition-colors border border-amber-400/40"
          >
            Return to Countdown View
          </button>
        </div>
        <ZenSpaceView username={username} />
      </div>
    );
  }

  return (
    <div className="relative min-h-screen bg-[#040407] text-white overflow-hidden selection:bg-white/20 selection:text-white">
      {/* Background Cosmic Starfield & Ambient Glows */}
      <div className="fixed inset-0 pointer-events-none">
        <div className="absolute top-[-10%] left-1/2 -translate-x-1/2 w-full max-w-[800px] h-[500px] bg-gradient-to-b from-indigo-600/15 via-purple-600/10 to-transparent blur-[120px] rounded-full" />
        <div className="absolute top-[40%] left-[-10%] w-full max-w-[500px] h-[500px] bg-cyan-600/10 blur-[130px] rounded-full" />
        <div className="absolute bottom-[-10%] right-[-10%] w-full max-w-[600px] h-[600px] bg-blue-600/10 blur-[140px] rounded-full" />
        <div className="absolute inset-0 bg-[radial-gradient(#ffffff0a_1px,transparent_1px)] [background-size:24px_24px] opacity-40" />
      </div>

      {/* Main Container */}
      <div className="relative z-10 max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 pt-16 sm:pt-24 pb-20 text-center flex flex-col items-center">
        {/* Protocol Status Pill */}
        <div className="inline-flex items-center gap-2.5 px-4 py-1.5 rounded-full bg-white/[0.04] border border-white/10 backdrop-blur-xl mb-8 shadow-[0_0_25px_rgba(255,255,255,0.04)]">
          <span className="relative flex h-2 w-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-amber-400 opacity-75" />
            <span className="relative inline-flex rounded-full h-2 w-2 bg-amber-500" />
          </span>
          <span className="font-mono text-[10px] sm:text-xs font-semibold tracking-[0.2em] text-neutral-300 uppercase">
            PROTOCOL PAUSED // RESUMING NOV 25, 2026
          </span>
        </div>

        {/* Hero Title */}
        <div className="space-y-4 max-w-3xl mx-auto">
          <div className="inline-flex items-center gap-2 text-xs sm:text-sm font-mono tracking-[0.25em] text-neutral-400 uppercase font-semibold">
            <Sparkles className="w-4 h-4 text-amber-300 animate-pulse" />
            <span>Something Special Coming Soon</span>
            <Sparkles className="w-4 h-4 text-amber-300 animate-pulse" />
          </div>

          <h1 className="text-4xl sm:text-6xl md:text-7xl font-extrabold tracking-tight font-display">
            <span className="text-transparent bg-clip-text bg-gradient-to-b from-white via-neutral-100 to-neutral-500">
              ZEN.SPACE
            </span>{' '}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-200 via-orange-300 to-amber-400">
              IS PAUSED
            </span>
          </h1>

          <p className="text-sm sm:text-base md:text-lg text-neutral-400 leading-relaxed font-sans max-w-2xl mx-auto">
            We are re-engineering the sovereign personal digital canvas from the ground up. 
            ZEN.SPACE reopens on <span className="text-white font-semibold">November 25, 2026</span> featuring 
            next-generation spatial computing, high-fidelity lossless audio studios, cryptographic identity verification, 
            and limitless interactive blocks.
          </p>
        </div>

        {/* Realtime Countdown Timer */}
        <div className="mt-12 sm:mt-16 w-full max-w-3xl">
          <div className="p-6 sm:p-10 rounded-3xl bg-neutral-900/60 border border-white/10 backdrop-blur-2xl shadow-[0_25px_80px_rgba(0,0,0,0.85)] relative overflow-hidden">
            {/* Top accent line */}
            <div className="absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-transparent via-amber-400/50 to-transparent" />

            <div className="flex items-center justify-between mb-6 pb-4 border-b border-white/5">
              <div className="flex items-center gap-2 text-left">
                <Clock className="w-4 h-4 text-amber-400" />
                <span className="font-mono text-xs uppercase tracking-widest text-neutral-300 font-semibold">
                  GLOBAL LAUNCH COUNTDOWN
                </span>
              </div>
              <span className="font-mono text-[11px] text-neutral-500 tracking-wider">
                TARGET: 2026.11.25 • 00:00 IST
              </span>
            </div>

            {/* Countdown Grid */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4">
              {[
                { label: 'DAYS', value: timeLeft.days },
                { label: 'HOURS', value: timeLeft.hours },
                { label: 'MINUTES', value: timeLeft.minutes },
                { label: 'SECONDS', value: timeLeft.seconds },
              ].map((unit) => (
                <div
                  key={unit.label}
                  className="group relative flex flex-col items-center justify-center py-5 sm:py-7 px-3 rounded-2xl bg-black/50 border border-white/10 hover:border-white/20 transition-all duration-300 shadow-inner"
                >
                  <div className="absolute inset-0 bg-gradient-to-b from-white/[0.04] to-transparent rounded-2xl pointer-events-none" />
                  <span className="text-4xl sm:text-6xl font-mono font-extrabold tracking-tight text-white group-hover:scale-105 transition-transform duration-300">
                    {unit.value < 10 ? `0${unit.value}` : unit.value}
                  </span>
                  <span className="text-[10px] sm:text-xs font-mono font-semibold tracking-[0.25em] text-neutral-400 mt-2 uppercase">
                    {unit.label}
                  </span>
                </div>
              ))}
            </div>

            {/* Subtle Progress Bar */}
            <div className="mt-8 space-y-2">
              <div className="flex justify-between text-[11px] font-mono text-neutral-400">
                <span>Phase: Engine Refactor & Polish</span>
                <span>November 25 Unlocking</span>
              </div>
              <div className="w-full h-1.5 bg-white/5 rounded-full overflow-hidden border border-white/5">
                <div 
                  className="h-full bg-gradient-to-r from-amber-400 via-yellow-400 to-amber-200 rounded-full animate-pulse"
                  style={{ width: '68%' }}
                />
              </div>
            </div>
          </div>
        </div>

        {/* Feature Teaser Cards: What's Coming Nov 25 */}
        <div className="mt-16 sm:mt-24 w-full text-left">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-3 mb-8">
            <div>
              <p className="text-[11px] font-mono uppercase tracking-[0.2em] text-amber-300 font-semibold">
                SNEAK PEEK ARCHITECTURE
              </p>
              <h2 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight mt-1">
                What to Expect on November 25
              </h2>
            </div>
            <span className="text-xs font-mono text-neutral-400">
              V2.0 Core Upgrade Manifest
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {/* Card 1 */}
            <div className="p-6 rounded-2xl bg-neutral-900/40 border border-white/10 hover:border-white/20 transition-all duration-300 hover:translate-y-[-2px] group">
              <div className="w-10 h-10 rounded-xl bg-white/[0.05] border border-white/10 flex items-center justify-center text-amber-300 mb-4 group-hover:scale-110 transition-transform">
                <Layers className="w-5 h-5" />
              </div>
              <h3 className="text-lg font-bold text-white group-hover:text-amber-200 transition-colors">
                Spatial 3D Canvas & Layouts
              </h3>
              <p className="text-xs sm:text-sm text-neutral-400 mt-2 leading-relaxed">
                Multi-dimensional floating layers, modular drag-and-drop tiles, glassmorphic card presets, 
                and bespoke typography engines tailored for digital leaders.
              </p>
            </div>

            {/* Card 2 */}
            <div className="p-6 rounded-2xl bg-neutral-900/40 border border-white/10 hover:border-white/20 transition-all duration-300 hover:translate-y-[-2px] group">
              <div className="w-10 h-10 rounded-xl bg-white/[0.05] border border-white/10 flex items-center justify-center text-cyan-300 mb-4 group-hover:scale-110 transition-transform">
                <Music className="w-5 h-5" />
              </div>
              <h3 className="text-lg font-bold text-white group-hover:text-cyan-200 transition-colors">
                Lossless Audio & Soundstage
              </h3>
              <p className="text-xs sm:text-sm text-neutral-400 mt-2 leading-relaxed">
                Seamless background playback, personal diplomatic speech archives, studio audio visualizers, 
                and persistent audio streaming across the platform.
              </p>
            </div>

            {/* Card 3 */}
            <div className="p-6 rounded-2xl bg-neutral-900/40 border border-white/10 hover:border-white/20 transition-all duration-300 hover:translate-y-[-2px] group">
              <div className="w-10 h-10 rounded-xl bg-white/[0.05] border border-white/10 flex items-center justify-center text-purple-300 mb-4 group-hover:scale-110 transition-transform">
                <Cpu className="w-5 h-5" />
              </div>
              <h3 className="text-lg font-bold text-white group-hover:text-purple-200 transition-colors">
                Cryptographic Identity Anchors
              </h3>
              <p className="text-xs sm:text-sm text-neutral-400 mt-2 leading-relaxed">
                Verified civic passport attestations, diplomatic conference badges, apex domain aliasing, 
                and tamper-proof on-chain record seals.
              </p>
            </div>

            {/* Card 4 */}
            <div className="p-6 rounded-2xl bg-neutral-900/40 border border-white/10 hover:border-white/20 transition-all duration-300 hover:translate-y-[-2px] group">
              <div className="w-10 h-10 rounded-xl bg-white/[0.05] border border-white/10 flex items-center justify-center text-emerald-300 mb-4 group-hover:scale-110 transition-transform">
                <Radio className="w-5 h-5" />
              </div>
              <h3 className="text-lg font-bold text-white group-hover:text-emerald-200 transition-colors">
                Live Interactive Micro-Apps
              </h3>
              <p className="text-xs sm:text-sm text-neutral-400 mt-2 leading-relaxed">
                Direct visitor communications, instant voting delegates, embedded micro-surveys, 
                and real-time event booking integration.
              </p>
            </div>
          </div>
        </div>

        {/* VIP Early Access / Notification Signup */}
        <div className="mt-16 sm:mt-20 w-full max-w-2xl p-6 sm:p-8 rounded-3xl bg-white/[0.02] border border-white/10 backdrop-blur-xl relative overflow-hidden">
          <div className="space-y-2">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/5 border border-white/10 text-[11px] font-mono text-neutral-300 uppercase">
              <Bell className="w-3.5 h-3.5 text-amber-300" />
              <span>Priority Access Channel</span>
            </div>
            <h3 className="text-xl sm:text-2xl font-bold text-white">
              Be the first to claim your upgraded space.
            </h3>
            <p className="text-xs sm:text-sm text-neutral-400 max-w-lg mx-auto">
              Join the priority dispatch list. When the countdown completes on November 25, we will notify you immediately.
            </p>
          </div>

          {isSubscribed ? (
            <div className="mt-6 p-4 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-300 text-xs sm:text-sm font-mono flex items-center justify-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-400" />
              <span>You are on the VIP manifest! We will alert you the moment ZEN.SPACE unlocks.</span>
            </div>
          ) : (
            <form onSubmit={handleSubscribe} className="mt-6 flex flex-col sm:flex-row gap-2 max-w-md mx-auto">
              <input
                type="text"
                value={emailInput}
                onChange={(e) => setEmailInput(e.target.value)}
                placeholder="Enter your email or @handle"
                className="flex-1 px-4 py-2.5 rounded-xl bg-black/60 border border-white/10 text-white text-xs sm:text-sm placeholder:text-neutral-500 focus:outline-none focus:border-white/30 font-sans"
              />
              <button
                type="submit"
                className="px-5 py-2.5 rounded-xl bg-white hover:bg-neutral-200 text-black font-semibold text-xs sm:text-sm font-sans transition-all duration-200 hover:scale-[1.02] active:scale-[0.98] whitespace-nowrap shadow-md"
              >
                Notify Me
              </button>
            </form>
          )}
        </div>

        {/* Active Ecosystem Navigation */}
        <div className="mt-16 sm:mt-24 w-full">
          <div className="text-center mb-6">
            <p className="text-[11px] font-mono uppercase tracking-[0.2em] text-neutral-500 font-semibold">
              EXPLORE ACTIVE NETWORKS
            </p>
            <h4 className="text-lg sm:text-xl font-bold text-neutral-300 mt-1">
              Active Zenvitra Ecosystem Modules
            </h4>
          </div>

          <div className="flex flex-wrap items-center justify-center gap-3">
            {[
              { name: 'ZEN.PULSE', desc: 'Civic Feed', href: '/pulse' },
              { name: 'ZEN.LEGISLATE', desc: 'Parliamentary Bills', href: '/legislate' },
              { name: 'ZEN.DOCS', desc: 'Collaborative Drafting', href: '/docs' },
              { name: 'ZEN.MUN', desc: 'Diplomatic Chamber', href: '/mun' },
              { name: 'ZEN.FORMS', desc: 'Form Studio', href: '/forms' },
            ].map((mod) => (
              <Link
                key={mod.name}
                href={mod.href}
                className="px-4 py-2.5 rounded-xl bg-white/[0.03] hover:bg-white/[0.08] border border-white/10 hover:border-white/20 transition-all flex items-center gap-2 text-xs font-mono text-neutral-300 hover:text-white group"
              >
                <span className="font-bold">{mod.name}</span>
                <span className="text-[10px] text-neutral-500 group-hover:text-neutral-400">• {mod.desc}</span>
                <ArrowRight className="w-3.5 h-3.5 text-neutral-500 group-hover:text-white group-hover:translate-x-0.5 transition-all" />
              </Link>
            ))}
          </div>
        </div>

        {/* Founder Preview Bypass Link (Visible for founder or clickable) */}
        <div className="mt-16 pt-8 border-t border-white/5 w-full flex flex-col items-center text-center">
          <p className="text-[10px] font-mono text-neutral-600">
            ZENVITRA PROTOCOL • HIGH PRIVILEGE STATE ENGINE • ALL RIGHTS RESERVED
          </p>

          {(isFounder || process.env.NODE_ENV === 'development') && (
            <button
              onClick={() => setBypassActive(true)}
              className="mt-3 inline-flex items-center gap-1.5 text-[10px] font-mono text-neutral-500 hover:text-amber-300 transition-colors px-3 py-1 rounded border border-transparent hover:border-amber-400/20"
            >
              <Unlock className="w-3 h-3" />
              <span>Founder Preview Access (@{currentUsername || 'founder'})</span>
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
export default ZenSpacePaused;
