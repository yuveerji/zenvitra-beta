'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import {
  Calendar,
  Sparkles,
  Plus,
  Clock,
  Users,
  Share2,
  ArrowRight,
  ShieldAlert,
  Play,
  RotateCcw,
  Mic,
  Zap,
  BookOpen,
  Vote,
  Compass,
  Copy,
  Check
} from 'lucide-react';
import { CreateChamberEventModal } from './CreateChamberEventModal';

interface NoEventsChamberStateProps {
  onEnterPracticeFloor: () => void;
}

export function NoEventsChamberState({ onEnterPracticeFloor }: NoEventsChamberStateProps) {
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [quickTimerSeconds, setQuickTimerSeconds] = useState(60);
  const [initialTimerSeconds, setInitialTimerSeconds] = useState(60);
  const [isCustomOpen, setIsCustomOpen] = useState(false);
  const [customMinutes, setCustomMinutes] = useState(2);
  const [customSeconds, setCustomSeconds] = useState(0);
  const [timerRunning, setTimerRunning] = useState(false);
  const [copiedCode, setCopiedCode] = useState(false);
  const [joinCodeInput, setJoinCodeInput] = useState('');

  // Standalone Instant Timer logic
  React.useEffect(() => {
    let interval: any;
    if (timerRunning && quickTimerSeconds > 0) {
      interval = setInterval(() => {
        setQuickTimerSeconds((prev) => (prev <= 1 ? 0 : prev - 1));
      }, 1000);
    } else if (quickTimerSeconds === 0) {
      setTimerRunning(false);
    }
    return () => clearInterval(interval);
  }, [timerRunning, quickTimerSeconds]);

  const formatTimer = (sec: number) => {
    const m = Math.floor(sec / 60);
    const s = sec % 60;
    return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  };

  const handleCopyDemoLink = () => {
    if (typeof navigator !== 'undefined') {
      navigator.clipboard.writeText('https://zenvitra.xyz/committee?room=ZEN-OPEN-STAGE');
      setCopiedCode(true);
      setTimeout(() => setCopiedCode(false), 2000);
    }
  };

  return (
    <div className="w-full min-h-[calc(100vh-8rem)] flex flex-col items-center justify-center p-4 sm:p-8 space-y-8 select-none">
      
      {/* ─────────────────────────────────────────────────────────────
          1. HERO NO ACTIVE EVENT BANNER CARD
      ───────────────────────────────────────────────────────────── */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-4xl relative rounded-3xl bg-gradient-to-b from-[#141224] via-[#090812] to-[#040406] border border-amber-500/30 p-8 sm:p-12 shadow-[0_25px_90px_rgba(245,158,11,0.15)] text-center space-y-6 overflow-hidden"
      >
        {/* Ambient Top Glow */}
        <div className="absolute -top-24 left-1/2 -translate-x-1/2 w-96 h-96 bg-amber-500/15 blur-[120px] rounded-full pointer-events-none" />
        <div className="absolute -bottom-24 right-10 w-72 h-72 bg-purple-500/10 blur-[100px] rounded-full pointer-events-none" />

        <div className="relative z-10 space-y-4 max-w-2xl mx-auto">
          <div className="w-16 h-16 rounded-3xl bg-gradient-to-tr from-amber-400 via-rose-500 to-purple-600 p-[2px] mx-auto shadow-xl">
            <div className="w-full h-full rounded-3xl bg-black flex items-center justify-center text-amber-300">
              <ShieldAlert className="w-8 h-8" />
            </div>
          </div>

          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-500/10 border border-amber-500/30 text-amber-400 font-mono text-xs font-bold">
            <span className="w-2 h-2 rounded-full bg-amber-400 animate-ping" />
            NO ACTIVE EVENT ROOM DETECTED
          </div>

          <h1 className="font-display font-bold text-2xl sm:text-4xl text-white tracking-tight leading-tight">
            This Chamber is Only Accessible in an Active Event
          </h1>

          <p className="text-xs sm:text-sm text-neutral-300 font-sans leading-relaxed">
            You haven't joined a live committee or stage session yet. You can <strong>create your own instant event</strong> (MUNs, Lok Sabha, Open Mic, EP 101, Storyline, or Custom), launch standalone timers, or browse available live events.
          </p>

          {/* Top Actions */}
          <div className="pt-2 flex flex-wrap items-center justify-center gap-3">
            <button
              type="button"
              onClick={() => setShowCreateModal(true)}
              className="px-6 py-3.5 rounded-2xl bg-gradient-to-r from-amber-400 via-rose-500 to-purple-600 text-white font-display font-bold text-xs sm:text-sm shadow-[0_0_30px_rgba(245,158,11,0.35)] hover:scale-105 transition cursor-pointer flex items-center gap-2"
            >
              <Plus className="w-4 h-4" />
              <span>+ Create Your Own Event / Chamber</span>
            </button>

            <Link
              href="/events"
              className="px-6 py-3.5 rounded-2xl bg-white/10 hover:bg-white/20 text-white font-display font-bold text-xs sm:text-sm border border-white/15 transition cursor-pointer flex items-center gap-2"
            >
              <Compass className="w-4 h-4 text-cyan-400" />
              <span>Browse Events Directory</span>
            </Link>
          </div>
        </div>
      </motion.div>

      {/* ─────────────────────────────────────────────────────────────
          2. 3-COLUMN ACTION GRID: EVENT TYPES | INSTANT TIMERS | INVITE CODE
      ───────────────────────────────────────────────────────────── */}
      <div className="w-full max-w-4xl grid grid-cols-1 md:grid-cols-3 gap-6">
        
        {/* Card 1: Supported Event Types */}
        <div className="p-6 rounded-3xl bg-[#07080b] border border-white/10 space-y-4 shadow-xl flex flex-col justify-between">
          <div className="space-y-3">
            <div className="flex items-center gap-2 text-xs font-mono font-bold text-amber-400 uppercase">
              <Sparkles className="w-4 h-4" />
              <span>Instant Event Formats</span>
            </div>

            <div className="space-y-2 text-xs font-sans text-neutral-300">
              <div className="p-2.5 rounded-xl bg-white/[0.03] border border-white/5 flex items-center gap-2">
                <span>🏛️</span>
                <span className="font-semibold text-white">MUNs</span>
                <span className="text-[10px] font-mono text-neutral-400 ml-auto">GSL &amp; Roll Calls</span>
              </div>
              <div className="p-2.5 rounded-xl bg-white/[0.03] border border-white/5 flex items-center gap-2">
                <span>🇮🇳</span>
                <span className="font-semibold text-white">Lok Sabha</span>
                <span className="text-[10px] font-mono text-neutral-400 ml-auto">Zero Hour &amp; Bills</span>
              </div>
              <div className="p-2.5 rounded-xl bg-white/[0.03] border border-white/5 flex items-center gap-2">
                <span>🎤</span>
                <span className="font-semibold text-white">Open Mic</span>
                <span className="text-[10px] font-mono text-neutral-400 ml-auto">Poetry &amp; Claps</span>
              </div>
              <div className="p-2.5 rounded-xl bg-white/[0.03] border border-white/5 flex items-center gap-2">
                <span>⚡</span>
                <span className="font-semibold text-white">EP 101</span>
                <span className="text-[10px] font-mono text-neutral-400 ml-auto">3-Min Pitch Jury</span>
              </div>
              <div className="p-2.5 rounded-xl bg-white/[0.03] border border-white/5 flex items-center gap-2">
                <span>📖</span>
                <span className="font-semibold text-white">Storyline</span>
                <span className="text-[10px] font-mono text-neutral-400 ml-auto">Oral Story Stage</span>
              </div>
            </div>
          </div>

          <button
            type="button"
            onClick={() => setShowCreateModal(true)}
            className="w-full py-2.5 rounded-xl bg-amber-500/10 hover:bg-amber-500/20 text-amber-300 border border-amber-500/30 text-xs font-mono font-bold transition cursor-pointer"
          >
            Launch Any Format →
          </button>
        </div>

        {/* Card 2: Standalone Instant Timer Clock */}
        <div className="p-6 rounded-3xl bg-[#07080b] border border-white/10 space-y-4 shadow-xl flex flex-col justify-between">
          <div className="space-y-3 text-center">
            <div className="flex items-center justify-center gap-2 text-xs font-mono font-bold text-cyan-400 uppercase">
              <Clock className="w-4 h-4" />
              <span>Instant Standalone Timer</span>
            </div>

            <div className="p-4 rounded-2xl bg-black/60 border border-white/10 space-y-1">
              <span className="text-[10px] font-mono text-neutral-500 uppercase font-bold block">
                PRACTICE CLOCK
              </span>
              <div className="font-mono font-bold text-3xl text-white">
                {formatTimer(quickTimerSeconds)}
              </div>
            </div>

            {/* Presets */}
            <div className="flex flex-wrap items-center justify-center gap-1.5">
              {[60, 90, 180, 240, 600].map((s) => (
                <button
                  key={s}
                  type="button"
                  onClick={() => {
                    setIsCustomOpen(false);
                    setQuickTimerSeconds(s);
                    setInitialTimerSeconds(s);
                    setTimerRunning(false);
                  }}
                  className={`px-2 py-1 rounded-lg text-[10px] font-mono font-bold transition cursor-pointer border ${
                    !isCustomOpen && quickTimerSeconds === s
                      ? 'bg-cyan-400 text-black border-cyan-300'
                      : 'bg-white/5 text-neutral-400 hover:text-white border-white/10'
                  }`}
                >
                  {s >= 60 ? `${s / 60}m` : `${s}s`}
                </button>
              ))}

              <button
                type="button"
                onClick={() => {
                  setIsCustomOpen(true);
                  const total = customMinutes * 60 + customSeconds;
                  const target = total > 0 ? total : 60;
                  setQuickTimerSeconds(target);
                  setInitialTimerSeconds(target);
                  setTimerRunning(false);
                }}
                className={`px-2 py-1 rounded-lg text-[10px] font-mono font-bold transition cursor-pointer border ${
                  isCustomOpen || ![60, 90, 180, 240, 600].includes(quickTimerSeconds)
                    ? 'bg-cyan-400 text-black border-cyan-300'
                    : 'bg-white/5 text-neutral-400 hover:text-white border-white/10'
                }`}
              >
                Custom
              </button>
            </div>

            {/* Custom Minutes & Seconds Inline Controls */}
            {isCustomOpen && (
              <div className="flex items-center justify-center gap-2 pt-1 text-[10px] font-mono">
                <div className="flex items-center gap-1.5 bg-black/70 px-3 py-1.5 rounded-xl border border-cyan-400/30">
                  <span className="text-neutral-400 text-[9px] uppercase font-bold">Custom:</span>
                  <div className="flex items-center gap-1">
                    <input
                      type="number"
                      min={0}
                      max={120}
                      value={customMinutes}
                      onChange={(e) => {
                        const m = Math.max(0, parseInt(e.target.value) || 0);
                        setCustomMinutes(m);
                        const total = m * 60 + customSeconds;
                        const target = total > 0 ? total : 60;
                        setQuickTimerSeconds(target);
                        setInitialTimerSeconds(target);
                        setTimerRunning(false);
                      }}
                      className="w-10 px-1 py-0.5 rounded bg-neutral-900 border border-white/20 text-center text-white text-[10px] font-mono font-bold focus:outline-none focus:border-cyan-400"
                    />
                    <span className="text-neutral-400">m</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <input
                      type="number"
                      min={0}
                      max={59}
                      value={customSeconds}
                      onChange={(e) => {
                        const s = Math.min(59, Math.max(0, parseInt(e.target.value) || 0));
                        setCustomSeconds(s);
                        const total = customMinutes * 60 + s;
                        const target = total > 0 ? total : 60;
                        setQuickTimerSeconds(target);
                        setInitialTimerSeconds(target);
                        setTimerRunning(false);
                      }}
                      className="w-10 px-1 py-0.5 rounded bg-neutral-900 border border-white/20 text-center text-white text-[10px] font-mono font-bold focus:outline-none focus:border-cyan-400"
                    />
                    <span className="text-neutral-400">s</span>
                  </div>
                </div>
              </div>
            )}
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => setTimerRunning(!timerRunning)}
              className={`flex-1 py-2.5 rounded-xl font-display font-bold text-xs transition cursor-pointer flex items-center justify-center gap-1.5 ${
                timerRunning
                  ? 'bg-rose-500 text-white shadow-md'
                  : 'bg-cyan-400 text-black hover:bg-cyan-300 shadow-md'
              }`}
            >
              <Play className="w-3.5 h-3.5 fill-current" />
              <span>{timerRunning ? 'Pause' : 'Start Timer'}</span>
            </button>
            <button
              type="button"
              onClick={() => {
                setTimerRunning(false);
                setQuickTimerSeconds(initialTimerSeconds);
              }}
              className="p-2.5 rounded-xl bg-white/5 hover:bg-white/10 text-neutral-400 hover:text-white border border-white/10 transition cursor-pointer"
              title="Reset Timer"
            >
              <RotateCcw className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

        {/* Card 3: Invite People & Practice Room */}
        <div className="p-6 rounded-3xl bg-[#07080b] border border-white/10 space-y-4 shadow-xl flex flex-col justify-between">
          <div className="space-y-3">
            <div className="flex items-center gap-2 text-xs font-mono font-bold text-purple-400 uppercase">
              <Share2 className="w-4 h-4" />
              <span>Invite &amp; Join Code</span>
            </div>

            <p className="text-xs text-neutral-300 font-sans leading-relaxed">
              Have a room code from a friend? Enter it below or enter the open practice floor to test motions.
            </p>

            <div className="space-y-2">
              <input
                type="text"
                placeholder="Enter Code (e.g. ZEN-MUN-882)"
                value={joinCodeInput}
                onChange={(e) => setJoinCodeInput(e.target.value.toUpperCase())}
                className="w-full bg-black/60 border border-white/15 rounded-xl px-3.5 py-2 text-xs font-mono text-white placeholder-neutral-500 focus:outline-none focus:border-purple-400 uppercase"
              />

              <button
                type="button"
                onClick={handleCopyDemoLink}
                className="w-full py-2 rounded-xl bg-white/5 hover:bg-white/10 text-neutral-300 hover:text-white border border-white/10 text-[11px] font-mono font-semibold transition flex items-center justify-center gap-1.5 cursor-pointer"
              >
                {copiedCode ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                <span>{copiedCode ? 'Link Copied!' : 'Copy Open Stage Link'}</span>
              </button>
            </div>
          </div>

          <button
            type="button"
            onClick={onEnterPracticeFloor}
            className="w-full py-2.5 rounded-xl bg-purple-500/15 hover:bg-purple-500/25 text-purple-300 border border-purple-500/40 text-xs font-display font-bold transition cursor-pointer flex items-center justify-center gap-1.5"
          >
            <span>Enter Open Practice Floor</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* ─────────────────────────────────────────────────────────────
          3. CREATE EVENT MODAL POPUP
      ───────────────────────────────────────────────────────────── */}
      <CreateChamberEventModal
        isOpen={showCreateModal}
        onClose={() => setShowCreateModal(false)}
        onEventCreated={() => onEnterPracticeFloor()}
      />
    </div>
  );
}
