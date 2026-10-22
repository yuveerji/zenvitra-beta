'use client';

import React, { useState } from 'react';
import {
  Sparkles,
  X,
  Play,
  Clock,
  Vote,
  Users,
  Volume2,
  MessageSquare,
  Radio,
  Mic,
  Zap,
  GraduationCap,
  Trophy,
  Landmark,
  Shield,
  Layers,
  RotateCcw,
  Check,
  Globe2,
  Tv,
  Flame,
  KeyRound,
  Sliders,
} from 'lucide-react';
import {
  HOST_FORMAT_PRESETS,
  HostSessionFormat,
  CustomHostEventConfig,
  DEFAULT_CUSTOM_EVENT_CONFIG,
} from '@/types/zenHost';

interface InstantSessionModalProps {
  isOpen: boolean;
  onClose: () => void;
  onLaunch: (payload: {
    format: HostSessionFormat;
    title: string;
    customConfig?: CustomHostEventConfig;
  }) => void;
  onOpenAdvancedStudio?: () => void;
}

// Preset format icons
const FORMAT_ICONS: Record<string, React.ElementType> = {
  Radio: Radio,
  Mic: Mic,
  Zap: Zap,
  GraduationCap: GraduationCap,
  Users: Users,
  Trophy: Trophy,
  Landmark: Landmark,
};

export default function InstantSessionModal({
  isOpen,
  onClose,
  onLaunch,
  onOpenAdvancedStudio,
}: InstantSessionModalProps) {
  const [selectedFormat, setSelectedFormat] = useState<HostSessionFormat>('open_mic');
  const [sessionTitle, setSessionTitle] = useState('');
  const [accessMode, setAccessMode] = useState<'online' | 'hybrid' | 'offline'>('online');

  // Modular Toggles
  const [enableTimer, setEnableTimer] = useState(true);
  const [slotDurationSeconds, setSlotDurationSeconds] = useState(180);
  const [enableVoting, setEnableVoting] = useState(true);
  const [allowSelfQueue, setAllowSelfQueue] = useState(true);
  const [enableAudioChimes, setEnableAudioChimes] = useState(true);
  const [enableReactions, setEnableReactions] = useState(true);

  // Generate a room PIN
  const [roomPin, setRoomPin] = useState(() => {
    const chars = '23456789ABCDEFGHJKLMNPQRSTUVWXYZ';
    let code = '';
    for (let i = 0; i < 6; i++) {
      code += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return code;
  });

  const handleRegeneratePin = () => {
    const chars = '23456789ABCDEFGHJKLMNPQRSTUVWXYZ';
    let code = '';
    for (let i = 0; i < 6; i++) {
      code += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    setRoomPin(code);
  };

  if (!isOpen) return null;

  const currentPreset = HOST_FORMAT_PRESETS[selectedFormat] || HOST_FORMAT_PRESETS.general;

  const handleSelectFormat = (fmt: HostSessionFormat) => {
    setSelectedFormat(fmt);
    const p = HOST_FORMAT_PRESETS[fmt];
    if (p) {
      setSlotDurationSeconds(p.defaultTimer);
      if (fmt === 'competition' || fmt === 'lightning_talks') {
        setAllowSelfQueue(false);
      } else {
        setAllowSelfQueue(true);
      }
    }
  };

  const handleStartSession = (e: React.FormEvent) => {
    e.preventDefault();
    const finalTitle = sessionTitle.trim() || currentPreset.name;

    const customConfig: CustomHostEventConfig = {
      ...DEFAULT_CUSTOM_EVENT_CONFIG,
      eventName: finalTitle,
      badge: currentPreset.badge,
      tagline: currentPreset.tagline,
      speakerTimerSeconds: slotDurationSeconds,
      enableSpeakerTimer: enableTimer,
      strictCutoff: selectedFormat === 'lightning_talks',
      enableAudioChimes: enableAudioChimes,
      enableQueue: true,
      allowSelfQueue: allowSelfQueue,
      requireHostApproval: !allowSelfQueue,
      enableOnDeckCallout: true,
      enableRapidPolls: enableVoting,
      enableStageBroadcasts: true,
      enableApplauseMeter: enableReactions,
      enableAudienceQnA: enableReactions,
      enableScoringRubric: selectedFormat === 'competition',
      rubricCriteria:
        selectedFormat === 'competition'
          ? [
              { id: 'crit-1', name: 'Presentation & Delivery', maxScore: 10 },
              { id: 'crit-2', name: 'Originality & Craft', maxScore: 10 },
              { id: 'crit-3', name: 'Audience Impact', maxScore: 10 },
            ]
          : DEFAULT_CUSTOM_EVENT_CONFIG.rubricCriteria,
    };

    onLaunch({
      format: selectedFormat,
      title: finalTitle,
      customConfig,
    });
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/85 backdrop-blur-xl flex items-center justify-center p-3 sm:p-6 overflow-y-auto animate-fade-in">
      <div className="w-full max-w-4xl my-auto rounded-3xl bg-gradient-to-b from-[#090e1c] via-[#050813] to-[#020409] border border-cyan-500/30 p-6 sm:p-8 space-y-6 text-white shadow-[0_25px_80px_rgba(0,0,0,0.9)] relative overflow-hidden backdrop-blur-2xl">
        {/* Glow Spheres */}
        <div className="absolute top-0 right-0 w-96 h-96 bg-cyan-500/10 rounded-full blur-[110px] pointer-events-none" />
        <div className="absolute bottom-0 left-0 w-80 h-80 bg-amber-500/10 rounded-full blur-[100px] pointer-events-none" />

        {/* ── 1. MODAL HEADER ── */}
        <div className="flex items-start justify-between border-b border-white/[0.08] pb-5 relative z-10">
          <div className="space-y-1.5">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-950/70 border border-cyan-500/40 text-cyan-300 text-[10px] font-mono font-bold tracking-[0.2em] uppercase shadow-[0_0_15px_rgba(6,182,212,0.25)]">
              <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 animate-ping" />
              <Sparkles className="w-3.5 h-3.5 text-amber-400" />
              <span>ZEN.HOST &bull; RAPID STAGE LAUNCHER</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-black font-space text-white tracking-tight uppercase">
              Launch Live Stage Dais
            </h2>
            <p className="text-xs sm:text-sm text-neutral-400 font-outfit max-w-2xl leading-relaxed">
              Configure your stage format, speaking timers, floor permissions, and voting rules in seconds.
            </p>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="p-2.5 rounded-2xl bg-white/[0.04] hover:bg-white/[0.1] border border-white/10 text-neutral-400 hover:text-white transition cursor-pointer active:scale-95"
            aria-label="Close modal"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleStartSession} className="space-y-6 relative z-10">
          {/* ── 2. SESSION TITLE & MODE ── */}
          <div className="grid grid-cols-1 md:grid-cols-12 gap-4">
            <div className="md:col-span-8 space-y-2">
              <label className="block text-[10px] font-mono font-bold uppercase tracking-wider text-neutral-400">
                Session Name / Stage Topic
              </label>
              <div className="relative">
                <input
                  type="text"
                  value={sessionTitle}
                  onChange={(e) => setSessionTitle(e.target.value)}
                  placeholder={`e.g. ${currentPreset.name} #1`}
                  className="w-full pl-4 pr-10 py-3 rounded-2xl bg-black/60 border border-white/15 text-sm text-white placeholder-neutral-500 font-space focus:outline-none focus:border-cyan-400 focus:ring-1 focus:ring-cyan-400/40 transition shadow-inner"
                />
                {sessionTitle && (
                  <button
                    type="button"
                    onClick={() => setSessionTitle('')}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-neutral-400 hover:text-white text-xs"
                  >
                    <X className="w-4 h-4" />
                  </button>
                )}
              </div>
              {/* Quick suggestion pills */}
              <div className="flex flex-wrap items-center gap-1.5 pt-1">
                <span className="text-[10px] font-mono text-neutral-500">Quick:</span>
                {[
                  'Open Mic Night',
                  'Demo Day Pitches',
                  'Youth Forum & Debate',
                  'Masterclass Sprint',
                  'Showcase',
                ].map((sug) => (
                  <button
                    key={sug}
                    type="button"
                    onClick={() => setSessionTitle(sug)}
                    className="px-2 py-0.5 rounded-lg bg-white/[0.04] hover:bg-white/[0.1] text-neutral-400 hover:text-cyan-300 text-[10px] font-mono transition border border-white/5 cursor-pointer"
                  >
                    {sug}
                  </button>
                ))}
              </div>
            </div>

            {/* Access Mode */}
            <div className="md:col-span-4 space-y-2">
              <label className="block text-[10px] font-mono font-bold uppercase tracking-wider text-neutral-400">
                Deployment Mode
              </label>
              <div className="grid grid-cols-3 gap-1.5 p-1 rounded-2xl bg-black/60 border border-white/10">
                {(['online', 'hybrid', 'offline'] as const).map((mode) => (
                  <button
                    key={mode}
                    type="button"
                    onClick={() => setAccessMode(mode)}
                    className={`py-2 rounded-xl text-[10px] font-bold font-space uppercase tracking-wider transition cursor-pointer text-center ${
                      accessMode === mode
                        ? 'bg-gradient-to-r from-cyan-500 to-teal-400 text-black shadow-md'
                        : 'text-neutral-400 hover:text-white hover:bg-white/[0.04]'
                    }`}
                  >
                    {mode}
                  </button>
                ))}
              </div>
              <div className="text-[10px] font-mono text-neutral-500 flex items-center gap-1.5">
                <Globe2 className="w-3.5 h-3.5 text-cyan-400 shrink-0" />
                <span>
                  {accessMode === 'online'
                    ? 'Browser audio/video room'
                    : accessMode === 'hybrid'
                    ? 'Auditorium + remote audience'
                    : 'Local auditorium stage'}
                </span>
              </div>
            </div>
          </div>

          {/* ── 3. VISUAL FORMAT PRESET SELECTOR (CARDS INSTEAD OF UGLY SELECT) ── */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <label className="text-[10px] font-mono font-bold uppercase tracking-wider text-cyan-400">
                Select Stage Format Preset
              </label>
              <span className="text-[10px] font-mono text-neutral-500">
                Auto-configures procedural timers &amp; floor tools
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
              {(
                [
                  'open_mic',
                  'lightning_talks',
                  'workshop',
                  'panel',
                  'competition',
                  'general',
                ] as HostSessionFormat[]
              ).map((fmtKey) => {
                const preset = HOST_FORMAT_PRESETS[fmtKey];
                const isSelected = selectedFormat === fmtKey;
                const IconComponent = FORMAT_ICONS[preset.icon] || Radio;

                return (
                  <button
                    key={fmtKey}
                    type="button"
                    onClick={() => handleSelectFormat(fmtKey)}
                    className={`p-4 rounded-2xl text-left transition-all duration-200 border cursor-pointer flex flex-col justify-between space-y-2 relative overflow-hidden group ${
                      isSelected
                        ? 'bg-cyan-950/40 border-cyan-400 shadow-[0_0_25px_rgba(6,182,212,0.25)] scale-[1.02]'
                        : 'bg-black/40 border-white/10 hover:border-white/25 hover:bg-white/[0.03]'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <div
                        className={`w-9 h-9 rounded-xl flex items-center justify-center transition ${
                          isSelected
                            ? 'bg-cyan-500 text-black shadow-[0_0_15px_rgba(6,182,212,0.5)]'
                            : 'bg-white/[0.06] text-neutral-300 group-hover:text-white'
                        }`}
                      >
                        <IconComponent className="w-4 h-4" />
                      </div>
                      <span
                        className={`text-[9px] font-mono font-bold px-2 py-0.5 rounded-full uppercase ${
                          isSelected
                            ? 'bg-cyan-400/20 text-cyan-300 border border-cyan-400/40'
                            : 'bg-white/[0.04] text-neutral-400'
                        }`}
                      >
                        {preset.defaultTimer}s slot
                      </span>
                    </div>

                    <div>
                      <div className="text-xs font-black font-space text-white uppercase tracking-tight">
                        {preset.name}
                      </div>
                      <div className="text-[10px] text-neutral-400 line-clamp-1 font-outfit mt-0.5">
                        {preset.tagline}
                      </div>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          {/* ── 4. MODULAR FEATURE TOGGLE CONTROLS ── */}
          <div className="p-5 rounded-2xl bg-black/50 border border-white/[0.08] space-y-4">
            <div className="flex items-center justify-between border-b border-white/[0.06] pb-3">
              <div className="flex items-center gap-2">
                <Sliders className="w-4 h-4 text-amber-400" />
                <span className="text-xs font-black font-space uppercase tracking-wider text-white">
                  Stage Mechanics &amp; Floor Rules
                </span>
              </div>
              <span className="text-[10px] font-mono text-neutral-400">
                Tailor instant toggles for this session
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3.5">
              {/* Toggle 1: Speaker Countdown Timer */}
              <div className="p-3 rounded-xl bg-white/[0.03] border border-white/5 space-y-2">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Clock className="w-3.5 h-3.5 text-cyan-400" />
                    <span className="text-xs font-bold text-white">Speaker Timer</span>
                  </div>
                  <input
                    type="checkbox"
                    checked={enableTimer}
                    onChange={(e) => setEnableTimer(e.target.checked)}
                    className="w-4 h-4 accent-cyan-400 cursor-pointer"
                  />
                </div>
                {enableTimer ? (
                  <div className="flex items-center gap-1.5 pt-1">
                    {[60, 90, 120, 180, 300].map((sec) => (
                      <button
                        key={sec}
                        type="button"
                        onClick={() => setSlotDurationSeconds(sec)}
                        className={`px-2 py-0.5 rounded-lg text-[9px] font-mono transition cursor-pointer ${
                          slotDurationSeconds === sec
                            ? 'bg-cyan-500 text-black font-bold'
                            : 'bg-white/5 text-neutral-400 hover:text-white'
                        }`}
                      >
                        {sec}s
                      </button>
                    ))}
                  </div>
                ) : (
                  <div className="text-[10px] font-mono text-neutral-500 italic">Timer disabled</div>
                )}
              </div>

              {/* Toggle 2: Audience Voting & Polls */}
              <div className="p-3 rounded-xl bg-white/[0.03] border border-white/5 space-y-1.5">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Vote className="w-3.5 h-3.5 text-amber-400" />
                    <span className="text-xs font-bold text-white">Audience Voting</span>
                  </div>
                  <input
                    type="checkbox"
                    checked={enableVoting}
                    onChange={(e) => setEnableVoting(e.target.checked)}
                    className="w-4 h-4 accent-amber-400 cursor-pointer"
                  />
                </div>
                <div className="text-[10px] font-mono">
                  {enableVoting ? (
                    <span className="text-emerald-400">Active polls &amp; voting allowed</span>
                  ) : (
                    <span className="text-rose-400 font-bold uppercase">Fully Off (No voting allowed)</span>
                  )}
                </div>
              </div>

              {/* Toggle 3: Performer & Lineup Queue */}
              <div className="p-3 rounded-xl bg-white/[0.03] border border-white/5 space-y-1.5">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Users className="w-3.5 h-3.5 text-teal-400" />
                    <span className="text-xs font-bold text-white">Public Lineup Queue</span>
                  </div>
                  <input
                    type="checkbox"
                    checked={allowSelfQueue}
                    onChange={(e) => setAllowSelfQueue(e.target.checked)}
                    className="w-4 h-4 accent-teal-400 cursor-pointer"
                  />
                </div>
                <div className="text-[10px] font-mono text-neutral-400">
                  {allowSelfQueue ? 'Participants can self-queue' : 'Host approval strictly required'}
                </div>
              </div>

              {/* Toggle 4: Audio Chimes & Warning Bell */}
              <div className="p-3 rounded-xl bg-white/[0.03] border border-white/5 space-y-1.5">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Volume2 className="w-3.5 h-3.5 text-orange-400" />
                    <span className="text-xs font-bold text-white">Buzzer &amp; Chimes</span>
                  </div>
                  <input
                    type="checkbox"
                    checked={enableAudioChimes}
                    onChange={(e) => setEnableAudioChimes(e.target.checked)}
                    className="w-4 h-4 accent-orange-400 cursor-pointer"
                  />
                </div>
                <div className="text-[10px] font-mono text-neutral-400">
                  {enableAudioChimes ? 'Sound alerts on 30s & expiration' : 'Silent stage timer'}
                </div>
              </div>

              {/* Toggle 5: Audience Reactions & Q&A */}
              <div className="p-3 rounded-xl bg-white/[0.03] border border-white/5 space-y-1.5">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Flame className="w-3.5 h-3.5 text-rose-400" />
                    <span className="text-xs font-bold text-white">Applause &amp; Reactions</span>
                  </div>
                  <input
                    type="checkbox"
                    checked={enableReactions}
                    onChange={(e) => setEnableReactions(e.target.checked)}
                    className="w-4 h-4 accent-rose-400 cursor-pointer"
                  />
                </div>
                <div className="text-[10px] font-mono text-neutral-400">
                  {enableReactions ? 'Live applause meter & reactions' : 'Reactions muted'}
                </div>
              </div>

              {/* Room PIN Display */}
              <div className="p-3 rounded-xl bg-black/60 border border-white/10 flex items-center justify-between">
                <div>
                  <div className="text-[9px] font-mono uppercase text-neutral-500 font-bold">STAGE PIN</div>
                  <div className="text-sm font-mono font-black text-amber-300 tracking-widest">{roomPin}</div>
                </div>
                <button
                  type="button"
                  onClick={handleRegeneratePin}
                  className="p-1.5 rounded-lg bg-white/5 hover:bg-white/10 text-neutral-400 hover:text-white transition cursor-pointer"
                  title="Generate new PIN"
                >
                  <RotateCcw className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          </div>

          {/* ── 5. ACTION LAUNCH BAR ── */}
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-2 border-t border-white/[0.08]">
            {onOpenAdvancedStudio ? (
              <button
                type="button"
                onClick={() => {
                  onClose();
                  onOpenAdvancedStudio();
                }}
                className="text-xs font-mono font-bold text-cyan-400 hover:text-cyan-300 underline transition cursor-pointer flex items-center gap-1.5"
              >
                <Sliders className="w-3.5 h-3.5" />
                <span>Configure Advanced Scoring Rubrics...</span>
              </button>
            ) : (
              <div className="text-[10px] font-mono text-neutral-500 flex items-center gap-1.5">
                <Shield className="w-3.5 h-3.5 text-emerald-400" />
                <span>Zero fake records. Live stage persists in browser storage.</span>
              </div>
            )}

            <div className="flex items-center gap-3 w-full sm:w-auto">
              <button
                type="button"
                onClick={onClose}
                className="flex-1 sm:flex-none px-5 py-3 rounded-2xl bg-white/[0.04] hover:bg-white/[0.08] border border-white/10 text-neutral-300 hover:text-white text-xs font-bold font-space uppercase tracking-wider transition cursor-pointer active:scale-95 text-center"
              >
                Cancel
              </button>

              <button
                type="submit"
                className="flex-1 sm:flex-none px-7 py-3 rounded-2xl bg-gradient-to-r from-cyan-500 via-teal-400 to-emerald-400 hover:brightness-110 text-black font-black font-space text-xs uppercase tracking-wider transition shadow-[0_0_30px_rgba(6,182,212,0.45)] active:scale-95 cursor-pointer flex items-center justify-center gap-2"
              >
                <Play className="w-4 h-4 fill-current" />
                <span>ENTER LIVE DAIS STAGE &rarr;</span>
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}
