'use client';

import React, { useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Minimize2,
  Play,
  Pause,
  RotateCcw,
  Users,
  Radio,
  Clock,
  ShieldCheck,
  Globe2,
  ArrowRight,
  Sparkles
} from 'lucide-react';
import { useMun } from '@/context/MunContext';

interface FullscreenChamberViewProps {
  isOpen: boolean;
  onClose: () => void;
}

export function FullscreenChamberView({ isOpen, onClose }: FullscreenChamberViewProps) {
  const {
    sessionState,
    toggleTimer,
    resetTimer,
    setTimerSeconds,
    advanceSpeaker,
    activeCommitteeId,
    getCommitteeById,
    committees
  } = useMun();

  const committee = getCommitteeById(activeCommitteeId) || committees[0];

  // Keybindings: ESC to exit, Space to toggle timer, N for next speaker
  useEffect(() => {
    if (!isOpen) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose();
      } else if (e.code === 'Space' && (e.target as HTMLElement)?.tagName !== 'INPUT') {
        e.preventDefault();
        toggleTimer();
      } else if ((e.key === 'n' || e.key === 'N') && (e.target as HTMLElement)?.tagName !== 'INPUT') {
        e.preventDefault();
        advanceSpeaker();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose, toggleTimer, advanceSpeaker]);

  // Lock body scroll while open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [isOpen]);

  if (!isOpen) return null;

  const formatTime = (sec: number) => {
    const m = Math.floor(sec / 60);
    const s = sec % 60;
    return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  };

  const timerPercentage = (sessionState?.timer?.totalSeconds ?? 0) > 0
    ? ((sessionState?.timer?.remainingSeconds ?? 0) / (sessionState?.timer?.totalSeconds ?? 1)) * 100
    : 0;

  const currentSpeaker = sessionState.speakersList[0];
  const upcomingSpeakers = sessionState.speakersList.slice(1, 6);

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.2 }}
        className="fixed inset-0 z-[999999] bg-[#07080a] text-neutral-100 flex flex-col justify-between p-6 sm:p-10 select-none overflow-hidden"
      >
        {/* Subtle architectural grid lines and minimal gradient overlay */}
        <div className="absolute inset-0 bg-[linear-gradient(to_right,rgba(255,255,255,0.02)_1px,transparent_1px),linear-gradient(to_bottom,rgba(255,255,255,0.02)_1px,transparent_1px)] bg-[size:4rem_4rem] pointer-events-none opacity-40" />
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[700px] h-[220px] bg-white/[0.02] blur-[120px] rounded-full pointer-events-none" />

        {/* ── TOP PROJECTION BAR ── */}
        <div className="relative z-10 flex items-center justify-between pb-6 border-b border-white/[0.08]">
          <div className="flex items-center gap-4">
            <div className="w-11 h-11 rounded-2xl bg-white/[0.04] border border-white/10 flex items-center justify-center text-neutral-300 shadow-sm">
              <Globe2 className="w-5 h-5 text-neutral-200" />
            </div>
            <div>
              <div className="flex items-center gap-2.5">
                <span className="px-2.5 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/25 text-[11px] font-mono font-medium flex items-center gap-1.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                  SESSION #{sessionState.sessionNumber} &bull; IN ORDER
                </span>
                <span className="text-xs font-mono text-neutral-400">
                  {committee?.shortName || 'UNSC'} &bull; Presiding: <strong className="text-neutral-200 font-medium">{committee?.dais.chair}</strong>
                </span>
              </div>
              <h1 className="font-display font-semibold text-xl sm:text-2xl text-white tracking-tight mt-0.5">
                {committee?.name || 'Security Council Plenary'}
              </h1>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className="px-4 py-2 rounded-xl bg-white/[0.03] border border-white/[0.08] font-mono text-xs text-neutral-300">
              Quorum: <strong className="text-emerald-400 font-semibold">{committee?.presentCount || 15}/{committee?.totalDelegates || 15}</strong> &bull; Majority: <strong className="text-white font-medium">8</strong>
            </div>

            <button
              type="button"
              onClick={onClose}
              className="p-2.5 px-3.5 rounded-xl bg-white/5 hover:bg-white/10 text-neutral-300 hover:text-white border border-white/10 font-mono text-xs transition cursor-pointer flex items-center gap-2 active:scale-95"
              title="Exit Stage View (ESC)"
            >
              <Minimize2 className="w-4 h-4" />
              <span className="hidden sm:inline">Exit (ESC)</span>
            </button>
          </div>
        </div>

        {/* ── CENTER STAGE: REFINED CLOCK & ACTIVE SPEAKER ── */}
        <div className="relative z-10 grid grid-cols-1 lg:grid-cols-12 gap-8 items-center my-auto py-6 max-w-7xl mx-auto w-full">
          
          {/* Projection Timer (6 cols) */}
          <div className="lg:col-span-6 flex flex-col items-center justify-center space-y-6">
            <div className="relative flex items-center justify-center">
              {/* Minimal SVG Progress Ring */}
              <svg className="w-72 h-72 sm:w-88 sm:h-88 transform -rotate-90">
                <circle
                  cx="176"
                  cy="176"
                  r="152"
                  stroke="currentColor"
                  strokeWidth="5"
                  className="text-white/[0.06]"
                  fill="transparent"
                />
                <circle
                  cx="176"
                  cy="176"
                  r="152"
                  stroke="currentColor"
                  strokeWidth="5"
                  strokeDasharray={2 * Math.PI * 152}
                  strokeDashoffset={2 * Math.PI * 152 * (1 - timerPercentage / 100)}
                  strokeLinecap="round"
                  className="text-neutral-200 transition-all duration-1000 ease-linear drop-shadow-[0_0_15px_rgba(255,255,255,0.2)]"
                  fill="transparent"
                />
              </svg>

              {/* Digital Numbers */}
              <div className="absolute flex flex-col items-center text-center">
                <span className="text-[11px] font-mono font-medium tracking-widest text-neutral-400 uppercase px-3 py-1 rounded-full bg-white/[0.04] border border-white/[0.08] mb-2">
                  {sessionState.sessionMode.replace('_', ' ')}
                </span>
                <span className="font-mono font-bold text-6xl sm:text-7xl text-white tracking-tight">
                  {formatTime(sessionState.timer.remainingSeconds)}
                </span>
                <span className="text-xs font-mono text-neutral-400 mt-2 tracking-wider">
                  {sessionState.timer.label}
                </span>
              </div>
            </div>

            {/* Dais Quick Presentation Controls */}
            <div className="flex items-center gap-2.5">
              <button
                type="button"
                onClick={toggleTimer}
                className={`px-7 py-3 rounded-xl font-display font-semibold text-xs flex items-center gap-2.5 transition-all cursor-pointer shadow-md active:scale-95 ${
                  sessionState.timer.isRunning
                    ? 'bg-white/10 text-neutral-200 border border-white/20 hover:bg-white/15'
                    : 'bg-white text-black hover:bg-neutral-200'
                }`}
              >
                {sessionState.timer.isRunning ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4 fill-black" />}
                <span>{sessionState.timer.isRunning ? 'PAUSE FLOOR' : 'START FLOOR'}</span>
              </button>

              <button
                type="button"
                onClick={() => resetTimer(sessionState.timer.totalSeconds || 540, sessionState.timer.label, sessionState.sessionMode)}
                className="p-3 rounded-xl bg-white/[0.04] hover:bg-white/10 border border-white/[0.08] text-neutral-300 hover:text-white transition cursor-pointer active:scale-95"
                title="Reset Timer"
              >
                <RotateCcw className="w-4 h-4" />
              </button>

              <button
                type="button"
                onClick={() => setTimerSeconds(sessionState.timer.remainingSeconds + 30)}
                className="px-3.5 py-3 rounded-xl bg-white/[0.04] hover:bg-white/10 border border-white/[0.08] text-neutral-300 hover:text-white font-mono font-medium text-xs transition cursor-pointer active:scale-95"
              >
                +30s
              </button>
            </div>
          </div>

          {/* Active Floor Speaker & Motions Queue (6 cols) */}
          <div className="lg:col-span-6 space-y-5">
            
            {/* Active Floor Speaker Spotlight */}
            <div className="p-6 sm:p-7 rounded-2xl bg-[#0c0e14] border border-white/[0.08] shadow-xl space-y-4">
              <div className="flex items-center justify-between pb-3 border-b border-white/[0.06]">
                <span className="text-xs font-mono font-medium text-emerald-400 uppercase tracking-wider flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                  <span>CURRENT DELEGATION HOLDING FLOOR</span>
                </span>
                <span className="text-xs font-mono text-neutral-400">
                  {currentSpeaker ? `${currentSpeaker.timeRemaining || 60}s Remaining` : 'Floor Open'}
                </span>
              </div>

              {currentSpeaker ? (
                <div className="flex items-center justify-between gap-4">
                  <div className="flex items-center gap-4">
                    <span className="text-4xl sm:text-5xl">{currentSpeaker.flagEmoji}</span>
                    <div>
                      <h2 className="font-display font-semibold text-2xl sm:text-3xl text-white">
                        {currentSpeaker.portfolio}
                      </h2>
                      <span className="text-xs font-mono text-neutral-400">
                        Delegate: <strong className="text-neutral-200 font-medium">{currentSpeaker.delegateName}</strong>
                      </span>
                    </div>
                  </div>

                  <button
                    type="button"
                    onClick={advanceSpeaker}
                    className="px-4 py-2.5 rounded-xl bg-white hover:bg-neutral-200 text-black font-display font-semibold text-xs transition cursor-pointer flex items-center gap-1.5 active:scale-95 shrink-0"
                  >
                    <span>Next Speaker</span>
                    <ArrowRight className="w-4 h-4" />
                  </button>
                </div>
              ) : (
                <div className="py-6 text-center text-neutral-400 font-mono text-xs">
                  Floor is currently open for speakers.
                </div>
              )}
            </div>

            {/* Active Motion & Agenda Mandate */}
            <div className="p-5 sm:p-6 rounded-2xl bg-[#0c0e14] border border-white/[0.08] space-y-2.5">
              <span className="text-[11px] font-mono font-medium text-neutral-400 uppercase tracking-wider block">
                ACTIVE MOTION ON FLOOR
              </span>
              <h3 className="font-display font-semibold text-lg text-white">
                {sessionState.currentMotion ? `"${sessionState.currentMotion.topic}"` : 'General Speakers List Debate'}
              </h3>
              <p className="text-xs font-mono text-neutral-400 line-clamp-2">
                Agenda: {committee?.agenda}
              </p>
            </div>

            {/* Next Speakers Queue */}
            {upcomingSpeakers.length > 0 && (
              <div className="space-y-2">
                <span className="text-[11px] font-mono font-medium text-neutral-500 uppercase tracking-wider block">
                  UPCOMING SPEAKERS QUEUE ({upcomingSpeakers.length})
                </span>
                <div className="flex flex-wrap gap-2">
                  {upcomingSpeakers.map((spk, idx) => (
                    <div
                      key={spk.id}
                      className="px-3 py-1.5 rounded-lg bg-white/[0.03] border border-white/[0.06] flex items-center gap-2 text-xs font-mono text-neutral-200"
                    >
                      <span className="text-neutral-500 font-semibold">#{idx + 2}</span>
                      <span>{spk.flagEmoji}</span>
                      <span className="font-medium">{spk.portfolio}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* ── BOTTOM HOTKEYS BAR ── */}
        <div className="relative z-10 pt-4 border-t border-white/[0.08] flex flex-wrap items-center justify-between text-xs font-mono text-neutral-500">
          <div className="flex items-center gap-4">
            <span>[SPACE] Toggle Clock</span>
            <span>[ESC] Exit Fullscreen</span>
            <span>[N] Next Speaker</span>
          </div>
          <div>
            <span>MUN Stage Projection &bull; Zenvitra Assembly</span>
          </div>
        </div>
      </motion.div>
    </AnimatePresence>
  );
}

export default FullscreenChamberView;
