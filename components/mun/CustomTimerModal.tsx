'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Clock,
  X,
  Play,
  RotateCcw,
  Volume2,
  VolumeX,
  Maximize2,
  Sparkles,
  Layers,
  Users,
  Check,
  Plus,
  Minus,
  Bookmark,
  BookmarkCheck,
  Trash2
} from 'lucide-react';
import { useMun } from '@/context/MunContext';
import { MunSessionMode } from '@/types/mun';

interface CustomTimerModalProps {
  isOpen: boolean;
  onClose: () => void;
  onApplyTimer: (totalSeconds: number, speakerSeconds: number, label: string, mode: MunSessionMode) => void;
}

export function CustomTimerModal({ isOpen, onClose, onApplyTimer }: CustomTimerModalProps) {
  const [minutes, setMinutes] = useState<number>(10);
  const [seconds, setSeconds] = useState<number>(0);
  const [speakerMinutes, setSpeakerMinutes] = useState<number>(1);
  const [speakerSeconds, setSpeakerSeconds] = useState<number>(0);
  const [enableSpeakerSubTimer, setEnableSpeakerSubTimer] = useState<boolean>(true);
  const [timerLabel, setTimerLabel] = useState<string>('Moderated Caucus on Global AI Defense');
  const [sessionMode, setSessionMode] = useState<MunSessionMode>('MOD_CAUCUS');
  const [soundEnabled, setSoundEnabled] = useState<boolean>(true);
  const [savedPresetNotice, setSavedPresetNotice] = useState<boolean>(false);

  // Custom User Saved Timer Presets from localStorage
  const LS_TIMER_PRESETS = 'zenvitra_custom_timer_presets_v1';
  const [userPresets, setUserPresets] = useState<
    Array<{ id: string; label: string; m: number; s: number; sm: number; ss: number; mode: MunSessionMode; name: string }>
  >([]);

  React.useEffect(() => {
    try {
      const stored = localStorage.getItem(LS_TIMER_PRESETS);
      if (stored) {
        setUserPresets(JSON.parse(stored));
      }
    } catch {}
  }, []);

  if (!isOpen) return null;

  const totalCalculatedSeconds = minutes * 60 + seconds;
  const speakerCalculatedSeconds = speakerMinutes * 60 + speakerSeconds;

  const PRESETS = [
    { label: 'GSL 60s', m: 1, s: 0, sm: 1, ss: 0, mode: 'GSL' as const, name: 'General Speakers List (60s)' },
    { label: 'GSL 90s', m: 1, s: 30, sm: 1, ss: 30, mode: 'GSL' as const, name: 'General Speakers List (90s)' },
    { label: 'Mod 10m / 60s', m: 10, s: 0, sm: 1, ss: 0, mode: 'MOD_CAUCUS' as const, name: 'Moderated Caucus (10m)' },
    { label: 'Mod 12m / 45s', m: 12, s: 0, sm: 0, ss: 45, mode: 'MOD_CAUCUS' as const, name: 'Moderated Caucus (12m / 45s)' },
    { label: 'Unmod 15m', m: 15, s: 0, sm: 0, ss: 0, mode: 'UNMOD_CAUCUS' as const, name: 'Unmoderated Informal Lobbying (15m)' },
    { label: 'Unmod 20m', m: 20, s: 0, sm: 0, ss: 0, mode: 'UNMOD_CAUCUS' as const, name: 'Unmoderated Caucus (20m)' },
    { label: 'Zero Hour 30m', m: 30, s: 0, sm: 2, ss: 0, mode: 'ZERO_HOUR' as const, name: 'Zero Hour Parliamentary Floor (30m)' },
    { label: 'Question Hour 45m', m: 45, s: 0, sm: 3, ss: 0, mode: 'QUESTION_HOUR' as const, name: 'Question Hour Interpellation (45m)' },
    { label: 'Crisis Flash 5m', m: 5, s: 0, sm: 0, ss: 30, mode: 'CRISIS_FLASH' as const, name: 'Crisis Flash Directive Deliberation' },
  ];

  const handleApplyPreset = (p: { label: string; m: number; s: number; sm: number; ss: number; mode: MunSessionMode; name: string }) => {
    setMinutes(p.m);
    setSeconds(p.s);
    setSpeakerMinutes(p.sm);
    setSpeakerSeconds(p.ss);
    setSessionMode(p.mode);
    setTimerLabel(p.name);
    setEnableSpeakerSubTimer(p.sm > 0 || p.ss > 0);
  };

  const handleSaveCurrentAsPreset = () => {
    if (totalCalculatedSeconds <= 0) return;
    const label = `${minutes}m ${seconds > 0 ? `${seconds}s` : ''} (${sessionMode.replace('_', ' ')})`;
    const name = timerLabel.trim() || `Custom Timer (${minutes}m)`;
    const newPreset = {
      id: `timer_preset_${Date.now()}`,
      label,
      m: minutes,
      s: seconds,
      sm: enableSpeakerSubTimer ? speakerMinutes : 0,
      ss: enableSpeakerSubTimer ? speakerSeconds : 0,
      mode: sessionMode,
      name
    };

    const updated = [newPreset, ...userPresets];
    setUserPresets(updated);
    try {
      localStorage.setItem(LS_TIMER_PRESETS, JSON.stringify(updated));
    } catch {}

    setSavedPresetNotice(true);
    setTimeout(() => setSavedPresetNotice(false), 3000);
  };

  const handleDeleteUserPreset = (id: string) => {
    const updated = userPresets.filter((p) => p.id !== id);
    setUserPresets(updated);
    try {
      localStorage.setItem(LS_TIMER_PRESETS, JSON.stringify(updated));
    } catch {}
  };

  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (totalCalculatedSeconds <= 0) return;
    onApplyTimer(
      totalCalculatedSeconds,
      enableSpeakerSubTimer ? speakerCalculatedSeconds : 0,
      timerLabel.trim() || 'Floor Timer',
      sessionMode
    );
    onClose();
  };

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 overflow-y-auto flex flex-col justify-start sm:justify-center items-center p-3 sm:p-6 select-none">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          className="fixed inset-0 bg-black/85 backdrop-blur-xl"
        />

        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 20 }}
          className="relative w-full max-w-xl my-auto max-h-[92vh] bg-[#090a0f] border border-amber-500/30 rounded-3xl shadow-2xl flex flex-col overflow-hidden z-10 text-white"
        >
          {/* Header */}
          <div className="p-5 sm:p-6 border-b border-white/10 flex items-center justify-between bg-white/[0.02]">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-2xl bg-amber-500/15 border border-amber-500/30 flex items-center justify-center text-amber-400">
                <Clock className="w-5 h-5" />
              </div>
              <div>
                <h2 className="font-display font-bold text-lg text-white flex items-center gap-2">
                  <span>Custom Chamber Timer &amp; Presets</span>
                  <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-amber-500/20 text-amber-300 font-bold">
                    MUN Command
                  </span>
                </h2>
                <p className="text-xs text-neutral-400">
                  Configure custom caucus clocks, individual speaker timers, and audio chimes.
                </p>
              </div>
            </div>

            <button
              type="button"
              onClick={onClose}
              className="p-2 rounded-xl bg-white/5 hover:bg-white/10 text-neutral-400 hover:text-white transition cursor-pointer"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          <form onSubmit={handleFormSubmit} className="p-5 sm:p-7 space-y-6 overflow-y-auto max-h-[80vh]">
            
            {/* Quick 1-Click MUN Command Presets */}
            <div className="space-y-2">
              <span className="text-xs font-mono font-bold text-neutral-300 uppercase tracking-wider block">
                Standard MUN Presets
              </span>
              <div className="grid grid-cols-3 gap-2">
                {PRESETS.map((p) => (
                  <button
                    key={p.label}
                    type="button"
                    onClick={() => handleApplyPreset(p)}
                    className="p-2.5 rounded-xl bg-white/[0.03] hover:bg-white/10 border border-white/10 hover:border-amber-400 text-left transition cursor-pointer group"
                  >
                    <span className="font-mono font-bold text-xs text-white group-hover:text-amber-300 block">
                      {p.label}
                    </span>
                    <span className="text-[9px] font-mono text-neutral-400 truncate block">
                      {p.mode.replace('_', ' ')}
                    </span>
                  </button>
                ))}
              </div>
            </div>

            {/* Custom Saved Presets (if any) */}
            {userPresets.length > 0 && (
              <div className="space-y-2 p-3.5 rounded-2xl bg-amber-500/[0.06] border border-amber-500/20">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-mono font-bold text-amber-300 uppercase tracking-wider flex items-center gap-1.5">
                    <BookmarkCheck className="w-3.5 h-3.5" />
                    Your Saved Custom Presets ({userPresets.length})
                  </span>
                  <span className="text-[10px] font-mono text-neutral-400">Click to load</span>
                </div>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 max-h-36 overflow-y-auto">
                  {userPresets.map((up) => (
                    <div
                      key={up.id}
                      className="p-2.5 rounded-xl bg-black/60 border border-amber-500/30 hover:border-amber-400 text-left transition group relative flex flex-col justify-between"
                    >
                      <button
                        type="button"
                        onClick={() => handleApplyPreset(up)}
                        className="text-left w-full cursor-pointer pr-4"
                      >
                        <span className="font-mono font-bold text-xs text-amber-200 group-hover:text-white truncate block">
                          {up.label}
                        </span>
                        <span className="text-[10px] text-neutral-400 truncate block">
                          {up.name}
                        </span>
                      </button>
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleDeleteUserPreset(up.id);
                        }}
                        className="absolute right-2 top-2 text-neutral-500 hover:text-rose-400 transition p-1"
                        title="Delete Preset"
                      >
                        <Trash2 className="w-3 h-3" />
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Custom Total Duration Input (MM:SS) */}
            <div className="p-5 rounded-2xl bg-black/60 border border-white/10 space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-xs font-mono font-bold text-amber-300 uppercase flex items-center gap-1.5">
                  <Clock className="w-3.5 h-3.5" />
                  <span>Total Caucus / Floor Time</span>
                </span>
                <span className="font-mono text-xs text-neutral-400">
                  Total: {totalCalculatedSeconds}s
                </span>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-[11px] font-mono text-neutral-400 block">Minutes</label>
                  <div className="flex items-center gap-2">
                    <input
                      type="number"
                      min={0}
                      max={180}
                      value={minutes}
                      onChange={(e) => setMinutes(Math.max(0, parseInt(e.target.value) || 0))}
                      className="w-full bg-neutral-900 border border-white/15 rounded-xl p-3 text-center font-mono font-bold text-lg text-white focus:outline-none focus:border-amber-400"
                    />
                    <div className="flex flex-col gap-1">
                      <button
                        type="button"
                        onClick={() => setMinutes((m) => m + 1)}
                        className="p-1.5 rounded-lg bg-white/5 hover:bg-white/15 text-neutral-300 transition"
                      >
                        <Plus className="w-3 h-3" />
                      </button>
                      <button
                        type="button"
                        onClick={() => setMinutes((m) => Math.max(0, m - 1))}
                        className="p-1.5 rounded-lg bg-white/5 hover:bg-white/15 text-neutral-300 transition"
                      >
                        <Minus className="w-3 h-3" />
                      </button>
                    </div>
                  </div>
                </div>

                <div className="space-y-1">
                  <label className="text-[11px] font-mono text-neutral-400 block">Seconds</label>
                  <div className="flex items-center gap-2">
                    <input
                      type="number"
                      min={0}
                      max={59}
                      value={seconds}
                      onChange={(e) => setSeconds(Math.min(59, Math.max(0, parseInt(e.target.value) || 0)))}
                      className="w-full bg-neutral-900 border border-white/15 rounded-xl p-3 text-center font-mono font-bold text-lg text-white focus:outline-none focus:border-amber-400"
                    />
                    <div className="flex flex-col gap-1">
                      <button
                        type="button"
                        onClick={() => setSeconds((s) => (s + 10) % 60)}
                        className="p-1.5 rounded-lg bg-white/5 hover:bg-white/15 text-neutral-300 font-mono text-[10px] transition"
                      >
                        +10
                      </button>
                      <button
                        type="button"
                        onClick={() => setSeconds((s) => Math.max(0, s - 10))}
                        className="p-1.5 rounded-lg bg-white/5 hover:bg-white/15 text-neutral-300 font-mono text-[10px] transition"
                      >
                        -10
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Individual Delegate Speaker Sub-Timer */}
            <div className="p-5 rounded-2xl bg-black/60 border border-white/10 space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    id="enableSubTimer"
                    checked={enableSpeakerSubTimer}
                    onChange={(e) => setEnableSpeakerSubTimer(e.target.checked)}
                    className="rounded bg-neutral-900 border-white/20 text-amber-400 focus:ring-0 cursor-pointer"
                  />
                  <label htmlFor="enableSubTimer" className="text-xs font-mono font-bold text-white cursor-pointer flex items-center gap-1.5">
                    <Users className="w-3.5 h-3.5 text-cyan-400" />
                    <span>Enable Individual Speaker Sub-Timer</span>
                  </label>
                </div>
                {enableSpeakerSubTimer && (
                  <span className="font-mono text-xs text-cyan-300">
                    {speakerCalculatedSeconds}s / speaker
                  </span>
                )}
              </div>

              {enableSpeakerSubTimer && (
                <div className="grid grid-cols-2 gap-4 pt-1">
                  <div className="space-y-1">
                    <label className="text-[11px] font-mono text-neutral-400 block">Speaker Mins</label>
                    <input
                      type="number"
                      min={0}
                      max={10}
                      value={speakerMinutes}
                      onChange={(e) => setSpeakerMinutes(Math.max(0, parseInt(e.target.value) || 0))}
                      className="w-full bg-neutral-900 border border-white/15 rounded-xl p-2.5 text-center font-mono font-bold text-sm text-white focus:outline-none focus:border-cyan-400"
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="text-[11px] font-mono text-neutral-400 block">Speaker Secs</label>
                    <input
                      type="number"
                      min={0}
                      max={59}
                      value={speakerSeconds}
                      onChange={(e) => setSpeakerSeconds(Math.min(59, Math.max(0, parseInt(e.target.value) || 0)))}
                      className="w-full bg-neutral-900 border border-white/15 rounded-xl p-2.5 text-center font-mono font-bold text-sm text-white focus:outline-none focus:border-cyan-400"
                    />
                  </div>
                </div>
              )}
            </div>

            {/* Label & Format Type */}
            <div className="space-y-3">
              <div className="space-y-1.5">
                <label className="text-xs font-mono font-bold text-neutral-300 uppercase tracking-wider block">
                  Timer Label &amp; Topic
                </label>
                <input
                  type="text"
                  required
                  value={timerLabel}
                  onChange={(e) => setTimerLabel(e.target.value)}
                  placeholder="e.g. Moderated Caucus on Cross-Border Data Privacy"
                  className="w-full bg-black/60 border border-white/15 rounded-2xl px-4 py-2.5 text-xs text-white placeholder-neutral-500 focus:outline-none focus:border-amber-400"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1.5">
                  <label className="text-xs font-mono font-bold text-neutral-300 uppercase tracking-wider block">
                    Session Mode
                  </label>
                  <select
                    value={sessionMode}
                    onChange={(e) => setSessionMode(e.target.value as MunSessionMode)}
                    className="w-full bg-neutral-900 border border-white/15 rounded-xl px-3 py-2 text-xs text-white focus:outline-none cursor-pointer"
                  >
                    <option value="MOD_CAUCUS">Moderated Caucus</option>
                    <option value="UNMOD_CAUCUS">Unmoderated Caucus</option>
                    <option value="GSL">General Speakers List</option>
                    <option value="ZERO_HOUR">🇮🇳 Zero Hour</option>
                    <option value="QUESTION_HOUR">🇮🇳 Question Hour</option>
                    <option value="CRISIS_FLASH">Crisis Disruption</option>
                    <option value="VOTING">Voting Procedure</option>
                  </select>
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-mono font-bold text-neutral-300 uppercase tracking-wider block">
                    Procedural Sound
                  </label>
                  <button
                    type="button"
                    onClick={() => setSoundEnabled(!soundEnabled)}
                    className={`w-full py-2 px-3 rounded-xl border flex items-center justify-between text-xs font-mono transition cursor-pointer ${
                      soundEnabled
                        ? 'bg-amber-500/10 border-amber-500/30 text-amber-300'
                        : 'bg-white/5 border-white/10 text-neutral-400'
                    }`}
                  >
                    <span>{soundEnabled ? 'Chimes Active' : 'Sound Muted'}</span>
                    {soundEnabled ? <Volume2 className="w-3.5 h-3.5" /> : <VolumeX className="w-3.5 h-3.5" />}
                  </button>
                </div>
              </div>
            </div>

            {/* Footer Buttons */}
            <div className="pt-3 border-t border-white/10 flex flex-wrap items-center justify-between gap-3">
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={handleSaveCurrentAsPreset}
                  className="px-4 py-2.5 rounded-xl bg-amber-500/10 hover:bg-amber-500/20 border border-amber-500/30 text-amber-300 font-mono text-xs font-bold transition flex items-center gap-1.5 cursor-pointer"
                  title="Save current time configuration as a reusable preset"
                >
                  {savedPresetNotice ? (
                    <>
                      <BookmarkCheck className="w-3.5 h-3.5 text-emerald-400" />
                      <span className="text-emerald-400">Preset Saved!</span>
                    </>
                  ) : (
                    <>
                      <Bookmark className="w-3.5 h-3.5" />
                      <span>Save as Preset</span>
                    </>
                  )}
                </button>
              </div>

              <div className="flex items-center gap-3">
                <button
                  type="button"
                  onClick={onClose}
                  className="px-4 py-2.5 rounded-xl bg-white/5 text-neutral-400 hover:text-white text-xs transition"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-6 py-2.5 rounded-2xl bg-gradient-to-r from-amber-400 via-rose-500 to-purple-600 text-white font-display font-bold text-xs shadow-lg hover:scale-105 transition cursor-pointer flex items-center gap-2"
                >
                  <Play className="w-3.5 h-3.5 fill-current" />
                  <span>Apply &amp; Set Chamber Floor</span>
                </button>
              </div>
            </div>
          </form>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
