'use client';

import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Minimize2,
  Play,
  Pause,
  RotateCcw,
  Users,
  Radio,
  Clock,
  Volume2,
  VolumeX,
  Sparkles,
  Layers,
  ShieldCheck,
  Globe2,
  ArrowRight
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

  // Keybindings (ESC to close, Space to toggle timer)
  useEffect(() => {
    if (!isOpen) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose();
      } else if (e.code === 'Space' && (e.target as HTMLElement)?.tagName !== 'INPUT') {
        e.preventDefault();
        toggleTimer();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose, toggleTimer]);

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
        className="fixed inset-0 z-[999999] bg-[#040407] text-white flex flex-col justify-between p-6 sm:p-12 select-none overflow-hidden"
      >
        {/* Ambient Glows */}
        <div className="absolute -top-32 left-1/2 -translate-x-1/2 w-[600px] h-[600px] bg-amber-500/15 blur-[160px] rounded-full pointer-events-none" />
        <div className="absolute -bottom-32 right-10 w-[500px] h-[500px] bg-purple-500/10 blur-[150px] rounded-full pointer-events-none" />

        {/* ── TOP PROJECTION BAR ── */}
        <div className="relative z-10 flex items-center justify-between pb-6 border-b border-white/10">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-2xl bg-amber-500/15 border border-amber-500/30 flex items-center justify-center text-amber-400 shadow-lg">
              <Globe2 className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="px-2.5 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 text-xs font-mono font-bold flex items-center gap-1.5 animate-pulse">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
                  IN FORMAL SESSION #{sessionState.sessionNumber}
                </span>
                <span className="text-xs font-mono text-neutral-400">
                  {committee?.shortName || 'UNSC'} &bull; Presiding: <strong>{committee?.dais.chair}</strong>
                </span>
              </div>
              <h1 className="font-display font-bold text-xl sm:text-2xl text-white tracking-tight">
                {committee?.name || 'UN Security Council Plenary'}
              </h1>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className="px-4 py-2 rounded-2xl bg-white/[0.03] border border-white/10 font-mono text-xs text-neutral-300">
              Quorum: <strong className="text-emerald-400">{committee?.presentCount || 15}/{committee?.totalDelegates || 15}</strong> &bull; Simple Majority: <strong className="text-white">8</strong>
            </div>

            <button
              type="button"
              onClick={onClose}
              className="p-3 rounded-2xl bg-white/10 hover:bg-white/20 text-white font-mono text-xs transition cursor-pointer flex items-center gap-2"
              title="Exit Fullscreen Mode (ESC)"
            >
              <Minimize2 className="w-4 h-4" />
              <span className="hidden sm:inline">Exit Fullscreen (ESC)</span>
            </button>
          </div>
        </div>

        {/* ── CENTER STAGE: GIANT CLOCK & ACTIVE SPEAKER ── */}
        <div className="relative z-10 grid grid-cols-1 lg:grid-cols-12 gap-8 items-center my-auto py-6">
          
          {/* Giant Projection Clock (6 cols) */}
          <div className="lg:col-span-6 flex flex-col items-center justify-center space-y-6">
            <div className="relative flex items-center justify-center">
              {/* Giant SVG Progress Ring */}
              <svg className="w-80 h-80 sm:w-96 sm:h-96 transform -rotate-90">
                <circle
                  cx="192"
                  cy="192"
                  r="168"
                  stroke="currentColor"
                  strokeWidth="8"
                  className="text-white/10"
                  fill="transparent"
                />
                <circle
                  cx="192"
                  cy="192"
                  r="168"
                  stroke="currentColor"
                  strokeWidth="8"
                  strokeDasharray={2 * Math.PI * 168}
                  strokeDashoffset={2 * Math.PI * 168 * (1 - timerPercentage / 100)}
                  strokeLinecap="round"
                  className="text-amber-400 transition-all duration-1000 ease-linear shadow-[0_0_40px_rgba(245,158,11,0.5)]"
                  fill="transparent"
                />
              </svg>

              {/* Digital Numbers */}
              <div className="absolute flex flex-col items-center text-center">
                <span className="text-[12px] font-mono font-bold tracking-widest text-amber-300 uppercase px-3 py-1 rounded-full bg-amber-500/20 mb-2">
                  {sessionState.sessionMode.replace('_', ' ')}
                </span>
                <span className="font-mono font-bold text-6xl sm:text-8xl text-white tracking-tight">
                  {formatTime(sessionState.timer.remainingSeconds)}
                </span>
                <span className="text-xs font-mono text-neutral-400 mt-2 uppercase tracking-wider">
                  {sessionState.timer.label}
                </span>
              </div>
            </div>

            {/* Dais Quick Presentation Controls */}
            <div className="flex items-center gap-3">
              <button
                type="button"
                onClick={toggleTimer}
                className={`px-8 py-3.5 rounded-2xl font-display font-bold text-sm flex items-center gap-2.5 transition-all cursor-pointer shadow-xl ${
                  sessionState.timer.isRunning
                    ? 'bg-amber-500/20 text-amber-300 border border-amber-500/40 hover:bg-amber-500/30'
                    : 'bg-white text-black hover:bg-neutral-200'
                }`}
              >
                {sessionState.timer.isRunning ? <Pause className="w-5 h-5" /> : <Play className="w-5 h-5 fill-black" />}
                <span>{sessionState.timer.isRunning ? 'PAUSE FLOOR' : 'START FLOOR'}</span>
              </button>

              <button
                type="button"
                onClick={() => resetTimer(sessionState.timer.totalSeconds || 540, sessionState.timer.label, sessionState.sessionMode)}
                className="p-3.5 rounded-2xl bg-white/10 hover:bg-white/20 text-white transition cursor-pointer"
                title="Reset Timer"
              >
                <RotateCcw className="w-5 h-5" />
              </button>

              <button
                type="button"
                onClick={() => setTimerSeconds(sessionState.timer.remainingSeconds + 30)}
                className="px-4 py-3.5 rounded-2xl bg-white/10 hover:bg-white/20 text-white font-mono font-bold text-xs transition cursor-pointer"
              >
                +30s
              </button>
            </div>
          </div>

          {/* Active Floor Speaker & Motions Queue (6 cols) */}
          <div className="lg:col-span-6 space-y-6">
            
            {/* Active Floor Speaker Spotlight */}
            <div className="p-6 sm:p-8 rounded-3xl bg-[#090a10] border border-amber-500/30 shadow-2xl space-y-4">
              <div className="flex items-center justify-between pb-3 border-b border-white/10">
                <span className="text-xs font-mono font-bold text-amber-400 uppercase tracking-widest flex items-center gap-1.5">
                  <Radio className="w-4 h-4 animate-pulse" />
                  <span>CURRENT DELEGATION ON FLOOR</span>
                </span>
                <span className="text-xs font-mono text-neutral-400">
                  {currentSpeaker ? `${currentSpeaker.timeRemaining || 60}s Remaining` : 'Floor Open'}
                </span>
              </div>

              {currentSpeaker ? (
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <span className="text-5xl">{currentSpeaker.flagEmoji}</span>
                    <div>
                      <h2 className="font-display font-bold text-2xl sm:text-3xl text-white">
                        {currentSpeaker.portfolio}
                      </h2>
                      <span className="text-xs font-mono text-neutral-400">
                        Delegate: <strong className="text-white">{currentSpeaker.delegateName}</strong>
                      </span>
                    </div>
                  </div>

                  <button
                    type="button"
                    onClick={advanceSpeaker}
                    className="px-5 py-2.5 rounded-2xl bg-amber-400 hover:bg-amber-300 text-black font-display font-bold text-xs shadow-md transition cursor-pointer flex items-center gap-1.5"
                  >
                    <span>Next Speaker</span>
                    <ArrowRight className="w-4 h-4" />
                  </button>
                </div>
              ) : (
                <div className="py-6 text-center text-neutral-500 font-mono text-sm">
                  Floor is currently open for general speakers.
                </div>
              )}
            </div>

            {/* Active Motion & Agenda Mandate */}
            <div className="p-6 rounded-3xl bg-[#090a10] border border-white/10 space-y-3">
              <span className="text-xs font-mono font-bold text-cyan-400 uppercase tracking-widest block">
                ACTIVE MOTION ON FLOOR
              </span>
              <h3 className="font-display font-bold text-xl text-white">
                {sessionState.currentMotion ? `"${sessionState.currentMotion.topic}"` : 'General Speakers List Debate'}
              </h3>
              <p className="text-xs font-mono text-neutral-400">
                Agenda: {committee?.agenda}
              </p>
            </div>

            {/* Next Speakers Queue */}
            {upcomingSpeakers.length > 0 && (
              <div className="space-y-2">
                <span className="text-xs font-mono font-bold text-neutral-400 uppercase tracking-widest block">
                  UPCOMING SPEAKERS QUEUE ({upcomingSpeakers.length})
                </span>
                <div className="flex flex-wrap gap-2">
                  {upcomingSpeakers.map((spk, idx) => (
                    <div
                      key={spk.id}
                      className="px-3.5 py-2 rounded-xl bg-white/[0.04] border border-white/10 flex items-center gap-2 text-xs font-mono text-white"
                    >
                      <span className="text-neutral-500 font-bold">#{idx + 2}</span>
                      <span>{spk.flagEmoji}</span>
                      <span className="font-bold">{spk.portfolio}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* ── BOTTOM HOTKEYS BAR ── */}
        <div className="relative z-10 pt-4 border-t border-white/10 flex flex-wrap items-center justify-between text-xs font-mono text-neutral-500">
          <div className="flex items-center gap-4">
            <span>[SPACE] Toggle Clock</span>
            <span>[ESC] Exit Fullscreen</span>
            <span>[N] Next Speaker</span>
          </div>
          <div>
            <span>MUN Command Projection Engine &bull; Zenvitra Global Youth Grid</span>
          </div>
        </div>
      </motion.div>
    </AnimatePresence>
  );
}
