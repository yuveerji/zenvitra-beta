'use client';

import React, { useEffect, useState, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Minimize2,
  Play,
  Pause,
  RotateCcw,
  Users,
  Clock,
  ArrowRight,
  Gavel,
  Volume2,
  VolumeX,
  HelpCircle,
  MessageSquare
} from 'lucide-react';
import { useMun } from '@/context/MunContext';
import { CommitteeLogoBadge } from './CommitteeLogoBadges';
import { lookupFlag } from '@/lib/sessionPresetsData';
import { daisAudio } from '@/lib/daisAudio';
import { DesktopModeAdvisory } from '@/components/common/DesktopModeAdvisory';

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
    yieldSpeakerTime,
    activeCommitteeId,
    getCommitteeById,
    committees
  } = useMun();

  const [soundEnabled, setSoundEnabled] = useState(true);
  const [poiWindowSeconds, setPoiWindowSeconds] = useState<number | null>(null);
  const lastSecondsRef = useRef<number>(sessionState?.timer?.remainingSeconds ?? 0);

  const committee = getCommitteeById(activeCommitteeId) || committees[0];

  useEffect(() => {
    setSoundEnabled(daisAudio.isEnabled());
  }, [isOpen]);

  const toggleSound = () => {
    const next = daisAudio.toggle();
    setSoundEnabled(next);
  };

  // Warning bells at 15s and 0s
  useEffect(() => {
    if (!isOpen || !sessionState.timer.isRunning) return;
    const current = sessionState.timer.remainingSeconds;
    const prev = lastSecondsRef.current;
    lastSecondsRef.current = current;

    if (current === 15 && prev === 16) {
      daisAudio.playWarningBell();
    } else if (current === 0 && prev === 1) {
      daisAudio.playTimeExpired();
    }
  }, [isOpen, sessionState.timer.remainingSeconds, sessionState.timer.isRunning]);

  // Keybindings: ESC exit, Space toggle, N next, G gavel, R reset
  useEffect(() => {
    if (!isOpen) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.target as HTMLElement)?.tagName === 'INPUT' || (e.target as HTMLElement)?.tagName === 'TEXTAREA') return;

      if (e.key === 'Escape') {
        onClose();
      } else if (e.code === 'Space') {
        e.preventDefault();
        toggleTimer();
      } else if (e.key === 'n' || e.key === 'N') {
        e.preventDefault();
        daisAudio.playGavelStrike(0.8);
        advanceSpeaker();
      } else if (e.key === 'g' || e.key === 'G') {
        e.preventDefault();
        daisAudio.playDoubleGavel();
      } else if (e.key === 'r' || e.key === 'R') {
        e.preventDefault();
        resetTimer(sessionState.timer.totalSeconds || 60, sessionState.timer.label, sessionState.sessionMode);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose, toggleTimer, advanceSpeaker, resetTimer, sessionState.timer]);

  // Lock body scroll
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

  // POI Countdown timer
  useEffect(() => {
    if (poiWindowSeconds === null) return;
    if (poiWindowSeconds <= 0) {
      daisAudio.playTimeExpired();
      setPoiWindowSeconds(null);
      return;
    }
    const t = setInterval(() => {
      setPoiWindowSeconds((prev) => (prev !== null ? prev - 1 : null));
    }, 1000);
    return () => clearInterval(t);
  }, [poiWindowSeconds]);

  if (!isOpen) return null;

  const formatTime = (sec: number) => {
    const m = Math.floor(sec / 60);
    const s = sec % 60;
    return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  };

  const remaining = sessionState?.timer?.remainingSeconds ?? 0;
  const total = sessionState?.timer?.totalSeconds ?? 60;
  const timerPercentage = total > 0 ? (remaining / total) * 100 : 0;

  // Dynamic status color
  const isCritical = remaining <= 5 && sessionState.timer.isRunning;
  const isWarning = remaining > 5 && remaining <= 15;

  const ringStrokeColor = isCritical
    ? 'text-red-500 drop-shadow-[0_0_25px_rgba(239,68,68,0.8)]'
    : isWarning
    ? 'text-amber-400 drop-shadow-[0_0_20px_rgba(251,191,36,0.6)]'
    : 'text-neutral-200 drop-shadow-[0_0_15px_rgba(255,255,255,0.25)]';

  const timerTextColor = isCritical
    ? 'text-red-400 animate-pulse'
    : isWarning
    ? 'text-amber-300'
    : 'text-white';

  const currentSpeaker = sessionState.speakersList[0];
  const upcomingSpeakers = sessionState.speakersList.slice(1, 7);
  const speakerFlag = currentSpeaker ? lookupFlag(currentSpeaker.portfolio) : '🇺🇳';

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.2 }}
        className="fixed inset-0 z-[999999] bg-[#050608] text-neutral-100 flex flex-col justify-between p-6 sm:p-10 select-none overflow-hidden"
      >
        <DesktopModeAdvisory studioName="Chamber Dais Fullscreen Studio" storageKey="zen_chamber_fullscreen" />
        {/* Subtle architectural grid lines and ambient glow */}
        <div className="absolute inset-0 bg-[linear-gradient(to_right,rgba(255,255,255,0.02)_1px,transparent_1px),linear-gradient(to_bottom,rgba(255,255,255,0.02)_1px,transparent_1px)] bg-[size:4rem_4rem] pointer-events-none opacity-40" />
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-[800px] h-[250px] bg-amber-500/[0.03] blur-[140px] rounded-full pointer-events-none" />

        {/* ── TOP PROJECTION BAR ── */}
        <div className="relative z-10 flex items-center justify-between pb-6 border-b border-white/[0.08]">
          <div className="flex items-center gap-4">
            {committee?.iconUrl ? (
              <img
                src={committee.iconUrl}
                alt="Chamber Crest"
                className="w-12 h-12 rounded-2xl object-cover border border-amber-400/30 bg-black/60 shadow-md shrink-0"
              />
            ) : committee?.logoKey ? (
              <div className="w-12 h-12 rounded-2xl bg-white/[0.05] border border-white/15 flex items-center justify-center shadow-inner shrink-0 overflow-hidden">
                <CommitteeLogoBadge logoKey={committee.logoKey} size={36} />
              </div>
            ) : (
              <div className="w-12 h-12 rounded-2xl bg-white/[0.04] border border-white/10 flex items-center justify-center text-2xl shadow-sm">
                {committee?.emblem || '🇺🇳'}
              </div>
            )}

            <div>
              <div className="flex items-center gap-2.5">
                <span className="px-2.5 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/25 text-[11px] font-mono font-medium flex items-center gap-1.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                  SESSION #{sessionState.sessionNumber} &bull; IN ORDER
                </span>
                <span className="text-xs font-mono text-neutral-400">
                  {committee?.shortName || 'CHAMBER'} &bull; Presiding:{' '}
                  <strong className="text-neutral-200 font-medium">{committee?.dais.chair}</strong>
                </span>
              </div>
              <h1 className="font-display font-semibold text-xl sm:text-2xl text-white tracking-tight mt-0.5">
                {committee?.name || 'Committee Chamber Plenary'}
              </h1>
            </div>
          </div>

          <div className="flex items-center gap-2.5">
            {/* Gavel Trigger Button */}
            <button
              type="button"
              onClick={() => daisAudio.playDoubleGavel()}
              className="p-2.5 px-3 rounded-xl bg-amber-500/15 hover:bg-amber-500/25 border border-amber-500/30 text-amber-300 font-mono text-xs font-bold transition cursor-pointer flex items-center gap-1.5 active:scale-95 shadow-sm"
              title="Strike Gavel [G]"
            >
              <Gavel className="w-4 h-4" />
              <span className="hidden sm:inline">Gavel [G]</span>
            </button>

            {/* Sound Toggle */}
            <button
              type="button"
              onClick={toggleSound}
              className={`p-2.5 rounded-xl border font-mono text-xs transition cursor-pointer flex items-center gap-1.5 active:scale-95 ${
                soundEnabled
                  ? 'bg-white/5 border-white/10 text-neutral-300 hover:text-white'
                  : 'bg-red-500/10 border-red-500/30 text-red-400'
              }`}
              title={soundEnabled ? 'Mute Dais Audio' : 'Unmute Dais Audio'}
            >
              {soundEnabled ? <Volume2 className="w-4 h-4 text-emerald-400" /> : <VolumeX className="w-4 h-4" />}
            </button>

            {/* Quorum Badge */}
            <div className="px-4 py-2 rounded-xl bg-white/[0.03] border border-white/[0.08] font-mono text-xs text-neutral-300">
              Quorum: <strong className="text-emerald-400 font-semibold">{committee?.presentCount ?? 0}/{committee?.totalDelegates || 15}</strong> &bull; Majority: <strong className="text-white font-medium">{Math.floor((committee?.presentCount ?? 0) / 2) + 1}</strong>
            </div>

            {/* Exit Button */}
            <button
              type="button"
              onClick={onClose}
              className="p-2.5 px-3.5 rounded-xl bg-white/5 hover:bg-white/10 text-neutral-300 hover:text-white border border-white/10 font-mono text-xs transition cursor-pointer flex items-center gap-1.5 active:scale-95"
              title="Exit Stage View (ESC)"
            >
              <Minimize2 className="w-4 h-4" />
              <span className="hidden sm:inline">Exit [ESC]</span>
            </button>
          </div>
        </div>

        {/* ── CENTER STAGE: GIANT CLOCK & ACTIVE SPEAKER SPOTLIGHT ── */}
        <div className="relative z-10 grid grid-cols-1 lg:grid-cols-12 gap-8 items-center my-auto py-6 max-w-7xl mx-auto w-full">
          
          {/* Projection Timer (6 cols) */}
          <div className="lg:col-span-6 flex flex-col items-center justify-center space-y-6">
            <div className="relative flex items-center justify-center">
              {/* Minimal SVG Progress Ring */}
              <svg className="w-72 h-72 sm:w-96 sm:h-96 transform -rotate-90">
                <circle
                  cx="192"
                  cy="192"
                  r="165"
                  stroke="currentColor"
                  strokeWidth="6"
                  className="text-white/[0.05]"
                  fill="transparent"
                />
                <circle
                  cx="192"
                  cy="192"
                  r="165"
                  stroke="currentColor"
                  strokeWidth="6"
                  strokeDasharray={2 * Math.PI * 165}
                  strokeDashoffset={2 * Math.PI * 165 * (1 - timerPercentage / 100)}
                  strokeLinecap="round"
                  className={`${ringStrokeColor} transition-all duration-1000 ease-linear`}
                  fill="transparent"
                />
              </svg>

              {/* Digital Numbers */}
              <div className="absolute flex flex-col items-center text-center">
                <span className="text-[11px] font-mono font-medium tracking-widest text-neutral-400 uppercase px-3.5 py-1 rounded-full bg-white/[0.04] border border-white/[0.08] mb-2">
                  {sessionState.sessionMode.replace('_', ' ')}
                </span>
                <span className={`font-mono font-bold text-6xl sm:text-8xl tracking-tight tabular-nums ${timerTextColor}`}>
                  {formatTime(remaining)}
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
                className={`px-8 py-3.5 rounded-xl font-display font-semibold text-xs flex items-center gap-2.5 transition-all cursor-pointer shadow-lg active:scale-95 ${
                  sessionState.timer.isRunning
                    ? 'bg-white/10 text-neutral-200 border border-white/20 hover:bg-white/15'
                    : 'bg-white text-black hover:bg-neutral-200'
                }`}
              >
                {sessionState.timer.isRunning ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4 fill-black" />}
                <span>{sessionState.timer.isRunning ? 'PAUSE [SPACE]' : 'START [SPACE]'}</span>
              </button>

              <button
                type="button"
                onClick={() => resetTimer(sessionState.timer.totalSeconds || 60, sessionState.timer.label, sessionState.sessionMode)}
                className="p-3.5 rounded-xl bg-white/[0.04] hover:bg-white/10 border border-white/[0.08] text-neutral-300 hover:text-white transition cursor-pointer active:scale-95"
                title="Reset Timer [R]"
              >
                <RotateCcw className="w-4 h-4" />
              </button>

              <button
                type="button"
                onClick={() => setTimerSeconds(remaining + 30)}
                className="px-4 py-3.5 rounded-xl bg-white/[0.04] hover:bg-white/10 border border-white/[0.08] text-neutral-300 hover:text-white font-mono font-medium text-xs transition cursor-pointer active:scale-95"
              >
                +30s
              </button>
            </div>
          </div>

          {/* Active Floor Speaker & Motions Queue (6 cols) */}
          <div className="lg:col-span-6 space-y-5">
            
            {/* Active Floor Speaker Spotlight */}
            <div className="p-6 sm:p-8 rounded-3xl bg-[#0c0e14] border border-white/[0.08] shadow-2xl space-y-5">
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
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                  <div className="flex items-center gap-4">
                    <span className="text-5xl sm:text-6xl filter drop-shadow">{speakerFlag}</span>
                    <div>
                      <h2 className="font-display font-bold text-3xl sm:text-4xl text-white">
                        {currentSpeaker.portfolio}
                      </h2>
                      <span className="text-sm font-mono text-neutral-400 mt-1 block">
                        Delegate: <strong className="text-neutral-200 font-medium">{currentSpeaker.delegateName || 'Accredited Delegate'}</strong>
                      </span>
                    </div>
                  </div>

                  <button
                    type="button"
                    onClick={() => {
                      daisAudio.playGavelStrike(0.8);
                      advanceSpeaker();
                    }}
                    className="px-5 py-3 rounded-xl bg-amber-500 hover:bg-amber-400 text-black font-display font-bold text-xs transition cursor-pointer flex items-center gap-2 active:scale-95 shrink-0 shadow-md shadow-amber-500/10"
                    title="Advance to next speaker [N]"
                  >
                    <span>Next Speaker [N]</span>
                    <ArrowRight className="w-4 h-4" />
                  </button>
                </div>
              ) : (
                <div className="py-8 text-center text-neutral-400 font-mono text-sm">
                  Floor is currently open for recognized speakers.
                </div>
              )}

              {/* Yields Quick Action Bar for Projector */}
              {currentSpeaker && (
                <div className="pt-3 border-t border-white/[0.06] flex items-center gap-2">
                  <span className="text-[10px] font-mono text-neutral-500 uppercase tracking-wider">
                    YIELDS:
                  </span>
                  <button
                    type="button"
                    onClick={() => {
                      daisAudio.playDoubleGavel();
                      yieldSpeakerTime('chair');
                      advanceSpeaker();
                    }}
                    className="px-3 py-1.5 rounded-lg bg-white/5 hover:bg-white/10 text-neutral-200 font-mono text-[11px] transition flex items-center gap-1"
                  >
                    <Gavel className="w-3 h-3 text-amber-400" />
                    <span>To Chair</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      daisAudio.playWarningBell();
                      yieldSpeakerTime('points_of_info');
                      setPoiWindowSeconds(30);
                    }}
                    className="px-3 py-1.5 rounded-lg bg-white/5 hover:bg-white/10 text-neutral-200 font-mono text-[11px] transition flex items-center gap-1"
                  >
                    <HelpCircle className="w-3 h-3 text-emerald-400" />
                    <span>To Questions</span>
                  </button>
                </div>
              )}

              {/* Active POI Countdown Banner */}
              {poiWindowSeconds !== null && (
                <div className="p-3 rounded-xl bg-emerald-500/15 border border-emerald-500/30 flex items-center justify-between text-xs font-mono">
                  <span className="text-emerald-300 font-bold flex items-center gap-1.5">
                    <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
                    POI RESPONSE CLOCK ACTIVE
                  </span>
                  <span className="text-white font-bold text-sm">
                    00:{poiWindowSeconds.toString().padStart(2, '0')}
                  </span>
                </div>
              )}
            </div>

            {/* Active Motion & Agenda Mandate */}
            <div className="p-5 sm:p-6 rounded-2xl bg-[#0c0e14] border border-white/[0.08] space-y-2">
              <span className="text-[11px] font-mono font-medium text-neutral-400 uppercase tracking-wider block">
                ACTIVE MOTION ON FLOOR
              </span>
              <h3 className="font-display font-semibold text-xl text-white">
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
                  UPCOMING SPEAKERS ON DECK ({upcomingSpeakers.length})
                </span>
                <div className="flex flex-wrap gap-2">
                  {upcomingSpeakers.map((spk, idx) => {
                    const flag = lookupFlag(spk.portfolio);
                    return (
                      <div
                        key={spk.id || idx}
                        className="px-3.5 py-2 rounded-xl bg-white/[0.03] border border-white/[0.06] flex items-center gap-2 text-xs font-mono text-neutral-200"
                      >
                        <span className="text-neutral-500 font-semibold">#{idx + 2}</span>
                        <span className="text-base">{flag}</span>
                        <span className="font-medium text-white">{spk.portfolio}</span>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* ── BOTTOM HOTKEYS BAR ── */}
        <div className="relative z-10 pt-4 border-t border-white/[0.08] flex flex-wrap items-center justify-between text-xs font-mono text-neutral-400">
          <div className="flex items-center flex-wrap gap-4">
            <span className="px-2 py-0.5 rounded bg-white/5 border border-white/10">[SPACE] Pause / Run</span>
            <span className="px-2 py-0.5 rounded bg-white/5 border border-white/10">[N] Next Speaker</span>
            <span className="px-2 py-0.5 rounded bg-white/5 border border-white/10">[G] Strike Gavel</span>
            <span className="px-2 py-0.5 rounded bg-white/5 border border-white/10">[R] Reset Clock</span>
            <span className="px-2 py-0.5 rounded bg-white/5 border border-white/10">[ESC] Exit View</span>
          </div>
          <div>
            <span>ZENVITRA DAIS // PROJECTOR CONTROL ROOM</span>
          </div>
        </div>
      </motion.div>
    </AnimatePresence>
  );
}

export default FullscreenChamberView;
