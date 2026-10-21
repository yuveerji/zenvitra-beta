'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  X,
  Sparkles,
  Clock,
  Users,
  Copy,
  Check,
  Share2,
  CheckCircle2,
  Radio,
  ArrowRight
} from 'lucide-react';
import { useMun } from '@/context/MunContext';
import { ChamberCategory } from '@/types/mun';
import { broadcastActivitySync } from '@/lib/reactiveActivityHub';

interface CreateChamberEventModalProps {
  isOpen: boolean;
  onClose: () => void;
  onEventCreated?: (roomId: string) => void;
}

export function CreateChamberEventModal({ isOpen, onClose, onEventCreated }: CreateChamberEventModalProps) {
  const { 
    createChamberRoom, 
    setActiveCommitteeId,
    createConference,
    setActiveConferenceId,
    setConferenceStatus
  } = useMun();

  const [eventType, setEventType] = useState<ChamberCategory>('MUN_COMMITTEE');
  const [title, setTitle] = useState('');
  const [agenda, setAgenda] = useState('');
  const [selectedTimerPreset, setSelectedTimerPreset] = useState<number>(60);
  const [isCustomTimer, setIsCustomTimer] = useState(false);
  const [customMinutes, setCustomMinutes] = useState(2);
  const [customSeconds, setCustomSeconds] = useState(30);
  const [roomCode] = useState(() => `ZEN-${Math.floor(1000 + Math.random() * 9000)}`);
  const [copiedLink, setCopiedLink] = useState(false);
  const [customInviteHandle, setCustomInviteHandle] = useState('');
  const [selectedFriends, setSelectedFriends] = useState<string[]>([]);

  const handleCustomTimeChange = (m: number, s: number) => {
    const safeM = Math.max(0, m);
    const safeS = Math.min(59, Math.max(0, s));
    setCustomMinutes(safeM);
    setCustomSeconds(safeS);
    const total = safeM * 60 + safeS;
    setSelectedTimerPreset(total > 0 ? total : 60);
  };

  if (!isOpen) return null;

  const EVENT_OPTIONS = [
    {
      id: 'MUN_COMMITTEE' as const,
      icon: '🏛️',
      name: 'Model UN (MUN)',
      tagline: 'Formal committee debate & working papers',
      accent: 'from-amber-500/20 to-amber-600/5 border-amber-500/40 text-amber-300',
      activeRing: 'ring-1 ring-amber-400 border-amber-400 bg-amber-500/10',
    },
    {
      id: 'LOK_SABHA' as const,
      icon: '🇮🇳',
      name: 'Lok Sabha / Parliament',
      tagline: 'Zero hour, bills & division voting',
      accent: 'from-blue-500/20 to-blue-600/5 border-blue-500/40 text-blue-300',
      activeRing: 'ring-1 ring-blue-400 border-blue-400 bg-blue-500/10',
    },
    {
      id: 'OPEN_MIC' as const,
      icon: '🎤',
      name: 'Open Mic & Stage',
      tagline: 'Spoken word, poetry & acoustic jam',
      accent: 'from-rose-500/20 to-rose-600/5 border-rose-500/40 text-rose-300',
      activeRing: 'ring-1 ring-rose-400 border-rose-400 bg-rose-500/10',
    },
    {
      id: 'EP_101' as const,
      icon: '⚡',
      name: 'Startup Pitch (EP 101)',
      tagline: '3-min lightning founder pitches & scorecards',
      accent: 'from-yellow-500/20 to-yellow-600/5 border-yellow-500/40 text-yellow-300',
      activeRing: 'ring-1 ring-yellow-400 border-yellow-400 bg-yellow-500/10',
    },
    {
      id: 'STORYLINE' as const,
      icon: '📖',
      name: 'Storyline / Lore',
      tagline: 'Interactive narratives & collective world-building',
      accent: 'from-purple-500/20 to-purple-600/5 border-purple-500/40 text-purple-300',
      activeRing: 'ring-1 ring-purple-400 border-purple-400 bg-purple-500/10',
    },
    {
      id: 'OTHER' as const,
      icon: '✨',
      name: 'Round Table & Custom',
      tagline: 'Youth summits, student councils & hackathons',
      accent: 'from-cyan-500/20 to-cyan-600/5 border-cyan-500/40 text-cyan-300',
      activeRing: 'ring-1 ring-cyan-400 border-cyan-400 bg-cyan-500/10',
    }
  ];

  const TIMER_PRESETS = [
    { label: '60s GSL', seconds: 60 },
    { label: '90s GSL', seconds: 90 },
    { label: '3-Min Pitch', seconds: 180 },
    { label: '4-Min Open Mic', seconds: 240 },
    { label: '10-Min Caucus', seconds: 600 },
    { label: '20-Min Session', seconds: 1200 },
  ];

  const handleCopyLink = () => {
    const link = `${typeof window !== 'undefined' ? window.location.origin : 'https://zenvitra.xyz'}/event/committee/matrix?room=${roomCode}`;
    navigator.clipboard.writeText(link);
    setCopiedLink(true);
    setTimeout(() => setCopiedLink(false), 2000);
  };

  const handleAddCustomInvite = (e: React.FormEvent) => {
    e.preventDefault();
    const clean = customInviteHandle.trim().replace(/^@/, '');
    if (!clean) return;
    if (!selectedFriends.includes(clean)) {
      setSelectedFriends((prev) => [...prev, clean]);
      setCustomInviteHandle('');
    }
  };

  const removeFriendInvite = (handle: string) => {
    setSelectedFriends((prev) => prev.filter((h) => h !== handle));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return;

    const roomId = roomCode.toLowerCase();
    const createdRoom = createChamberRoom(
      title.trim(),
      eventType,
      agenda.trim()
    );
    const finalRoomId = createdRoom?.id || roomId;

    broadcastActivitySync({
      source: 'chamber_invite',
      action: 'create',
      timestamp: Date.now(),
      metadata: {
        roomId: finalRoomId,
        title: title.trim(),
        eventType,
        timerPreset: selectedTimerPreset,
        invitedFriends: selectedFriends,
      }
    });

    const now = new Date();
    const todayYMD = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}-${String(now.getDate()).padStart(2, '0')}`;
    const newConf = createConference({
      name: `${title.trim()} Summit`,
      shortName: title.trim().slice(0, 8).toUpperCase(),
      tagline: agenda.trim() || 'Instant Plenary Chamber Session',
      startDate: todayYMD,
      endDate: todayYMD,
      location: 'Digital Plenary Enclave',
      committees: [{
        id: finalRoomId,
        name: title.trim(),
        shortName: title.trim().slice(0, 8).toUpperCase(),
        type: eventType === 'LOK_SABHA' ? 'LOK_SABHA' : 'OTHER',
        agenda: agenda.trim() || 'General Assembly Deliberations',
        totalDelegates: 20
      }]
    });

    if (newConf?.id) {
      setActiveConferenceId(newConf.id);
      setConferenceStatus(newConf.id, 'DAY_1');
    }

    if (onEventCreated) {
      onEventCreated(finalRoomId);
    } else {
      setActiveCommitteeId(finalRoomId);
    }
    onClose();
  };

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-[200] overflow-y-auto flex flex-col justify-start sm:justify-center items-center p-3 sm:p-6 select-none bg-black/80 backdrop-blur-2xl">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          className="fixed inset-0"
        />

        <motion.div
          initial={{ opacity: 0, scale: 0.96, y: 16 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.96, y: 16 }}
          transition={{ duration: 0.2, ease: [0.16, 1, 0.3, 1] }}
          className="relative w-full max-w-2xl my-auto max-h-[92vh] bg-[#07090e] border border-white/10 rounded-3xl shadow-[0_25px_80px_rgba(0,0,0,0.9)] flex flex-col overflow-hidden z-10 text-white"
        >
          {/* Subtle Ambient Radial Highlight */}
          <div className="absolute top-0 right-1/4 w-96 h-96 bg-amber-500/10 rounded-full blur-[120px] pointer-events-none" />

          {/* Header */}
          <div className="p-6 border-b border-white/10 flex items-center justify-between relative z-10 bg-white/[0.02]">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-amber-400 to-amber-600 flex items-center justify-center text-black font-bold shadow-lg shadow-amber-500/20">
                <Sparkles className="w-5 h-5 text-black" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h2 className="font-display font-extrabold text-lg text-white">
                    Host Instant Event &amp; Live Chamber
                  </h2>
                  <span className="inline-flex items-center gap-1 text-[11px] font-sans font-semibold px-2.5 py-0.5 rounded-full bg-emerald-500/15 text-emerald-300 border border-emerald-500/30">
                    <Radio className="w-2.5 h-2.5 text-emerald-400 animate-pulse" />
                    <span>Instant Live</span>
                  </span>
                </div>
                <p className="text-xs text-neutral-400 font-sans mt-0.5">
                  Launch a chamber, set speaker timers, and broadcast real-time floor clearance.
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

          {/* Form Body */}
          <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto p-6 sm:p-7 space-y-6 relative z-10 font-sans">
            
            {/* 1. Format Selection */}
            <div className="space-y-2.5">
              <label className="text-xs font-sans font-bold text-neutral-300 uppercase tracking-wider block">
                Select Chamber Format
              </label>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                {EVENT_OPTIONS.map((opt) => {
                  const isSelected = eventType === opt.id;
                  return (
                    <button
                      key={opt.id}
                      type="button"
                      onClick={() => setEventType(opt.id)}
                      className={`p-3.5 rounded-2xl text-left border transition-all cursor-pointer relative overflow-hidden group ${
                        isSelected
                          ? `${opt.activeRing} shadow-lg shadow-black/40`
                          : 'bg-white/[0.03] border-white/10 hover:border-white/20 hover:bg-white/[0.05]'
                      }`}
                    >
                      <div className="flex items-center justify-between mb-1">
                        <div className="flex items-center gap-2">
                          <span className="text-lg">{opt.icon}</span>
                          <span className={`text-xs font-bold ${isSelected ? 'text-white font-extrabold' : 'text-neutral-200'}`}>
                            {opt.name}
                          </span>
                        </div>
                        {isSelected && (
                          <CheckCircle2 className="w-4 h-4 text-amber-400 shrink-0" />
                        )}
                      </div>
                      <p className="text-[11px] text-neutral-400 line-clamp-1 leading-relaxed pl-7">
                        {opt.tagline}
                      </p>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Title & Agenda */}
            <div className="space-y-4">
              <div className="space-y-1.5">
                <label className="text-xs font-sans font-bold text-neutral-300 uppercase tracking-wider block">
                  Event / Chamber Title *
                </label>
                <input
                  type="text"
                  required
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="e.g. UNSC Crisis Deliberations or Global Youth Climate Assembly"
                  className="w-full bg-white/[0.04] border border-white/10 rounded-2xl px-4 py-3 text-sm text-white placeholder-neutral-500 focus:outline-none focus:border-amber-400 focus:bg-white/[0.06] font-medium transition"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-sans font-bold text-neutral-300 uppercase tracking-wider flex items-center justify-between">
                  <span>Theme / Agenda Mandate (Optional)</span>
                </label>
                <textarea
                  rows={2}
                  value={agenda}
                  onChange={(e) => setAgenda(e.target.value)}
                  placeholder="State the floor agenda, crisis update, or discussion mandate..."
                  className="w-full bg-white/[0.04] border border-white/10 rounded-2xl p-3.5 text-xs text-white placeholder-neutral-500 focus:outline-none focus:border-amber-400 focus:bg-white/[0.06] resize-none leading-relaxed transition"
                />
              </div>
            </div>

            {/* Floor Timer Presets */}
            <div className="space-y-2.5">
              <label className="text-xs font-sans font-bold text-neutral-300 uppercase tracking-wider flex items-center gap-1.5">
                <Clock className="w-3.5 h-3.5 text-amber-400" />
                <span>Floor Speaker Timer Preset</span>
              </label>
              
              <div className="flex flex-wrap items-center gap-2">
                {TIMER_PRESETS.map((preset) => {
                  const isSelected = !isCustomTimer && selectedTimerPreset === preset.seconds;
                  return (
                    <button
                      key={preset.label}
                      type="button"
                      onClick={() => {
                        setIsCustomTimer(false);
                        setSelectedTimerPreset(preset.seconds);
                      }}
                      className={`px-3.5 py-2 rounded-xl text-xs font-semibold transition cursor-pointer border ${
                        isSelected
                          ? 'bg-amber-400 text-black border-amber-300 shadow-md shadow-amber-400/20 font-bold'
                          : 'bg-white/[0.04] text-neutral-300 hover:text-white hover:bg-white/10 border-white/10'
                      }`}
                    >
                      {preset.label}
                    </button>
                  );
                })}

                <button
                  type="button"
                  onClick={() => {
                    setIsCustomTimer(true);
                    const total = customMinutes * 60 + customSeconds;
                    setSelectedTimerPreset(total > 0 ? total : 60);
                  }}
                  className={`px-3.5 py-2 rounded-xl text-xs font-semibold transition cursor-pointer border ${
                    isCustomTimer
                      ? 'bg-amber-400 text-black border-amber-300 shadow-md shadow-amber-400/20 font-bold'
                      : 'bg-white/[0.04] text-neutral-300 hover:text-white hover:bg-white/10 border-white/10'
                  }`}
                >
                  Custom
                </button>
              </div>

              {/* Custom Duration Fields */}
              {isCustomTimer && (
                <div className="flex flex-wrap items-center gap-3 p-3.5 rounded-2xl bg-white/[0.03] border border-amber-400/40 text-xs animate-fadeIn">
                  <span className="text-neutral-400 font-semibold">Custom Duration:</span>
                  <div className="flex items-center gap-1.5">
                    <input
                      type="number"
                      min={0}
                      max={180}
                      value={customMinutes}
                      onChange={(e) => handleCustomTimeChange(parseInt(e.target.value) || 0, customSeconds)}
                      className="w-16 px-2.5 py-1.5 rounded-xl bg-neutral-900 border border-white/20 text-center text-white text-xs font-bold focus:outline-none focus:border-amber-400"
                    />
                    <span className="text-neutral-400">min</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <input
                      type="number"
                      min={0}
                      max={59}
                      value={customSeconds}
                      onChange={(e) => handleCustomTimeChange(customMinutes, parseInt(e.target.value) || 0)}
                      className="w-16 px-2.5 py-1.5 rounded-xl bg-neutral-900 border border-white/20 text-center text-white text-xs font-bold focus:outline-none focus:border-amber-400"
                    />
                    <span className="text-neutral-400">sec</span>
                  </div>
                  <span className="text-amber-300 text-xs font-bold ml-auto">
                    {Math.floor(selectedTimerPreset / 60)}m {selectedTimerPreset % 60}s ({selectedTimerPreset}s)
                  </span>
                </div>
              )}
            </div>

            {/* Instant Room Code & Share */}
            <div className="p-4 rounded-2xl bg-white/[0.03] border border-white/10 space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs font-sans font-bold text-neutral-300 uppercase flex items-center gap-1.5">
                  <Share2 className="w-3.5 h-3.5 text-cyan-400" />
                  <span>Instant Access Code &amp; Link</span>
                </span>
                <span className="text-xs font-mono font-bold px-2.5 py-0.5 rounded-lg bg-cyan-500/15 text-cyan-300 border border-cyan-500/30">
                  {roomCode}
                </span>
              </div>

              <div className="flex items-center gap-2">
                <input
                  type="text"
                  readOnly
                  value={`https://zenvitra.xyz/event/committee/matrix?room=${roomCode}`}
                  className="flex-1 bg-neutral-900/80 border border-white/10 rounded-xl px-3.5 py-2.5 text-xs text-neutral-300 select-all font-mono"
                />
                <button
                  type="button"
                  onClick={handleCopyLink}
                  className="px-4 py-2.5 rounded-xl bg-white/10 hover:bg-white/20 text-white text-xs font-bold transition flex items-center gap-1.5 cursor-pointer shrink-0"
                >
                  {copiedLink ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                  <span>{copiedLink ? 'Copied' : 'Copy'}</span>
                </button>
              </div>
            </div>

            {/* Invite Attendees */}
            <div className="space-y-3">
              <label className="text-xs font-sans font-bold text-neutral-300 uppercase tracking-wider flex items-center justify-between">
                <span className="flex items-center gap-1.5">
                  <Users className="w-3.5 h-3.5 text-purple-400" />
                  <span>Invite Friends or Delegates</span>
                </span>
                <span className="text-xs text-neutral-400">
                  {selectedFriends.length} added
                </span>
              </label>

              <div className="flex gap-2">
                <input
                  type="text"
                  value={customInviteHandle}
                  onChange={(e) => setCustomInviteHandle(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') {
                      e.preventDefault();
                      handleAddCustomInvite(e);
                    }
                  }}
                  placeholder="Enter @username or email..."
                  className="flex-1 bg-white/[0.04] border border-white/10 rounded-2xl px-4 py-2.5 text-xs text-white placeholder-neutral-500 focus:outline-none focus:border-purple-400 transition"
                />
                <button
                  type="button"
                  onClick={handleAddCustomInvite}
                  disabled={!customInviteHandle.trim()}
                  className="px-4 py-2.5 rounded-2xl bg-purple-500/20 hover:bg-purple-500/30 text-purple-300 border border-purple-500/40 text-xs font-bold transition disabled:opacity-40 cursor-pointer shrink-0"
                >
                  + Add
                </button>
              </div>

              {selectedFriends.length > 0 && (
                <div className="flex flex-wrap gap-2 pt-1">
                  {selectedFriends.map((handle) => (
                    <div
                      key={handle}
                      className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-purple-500/15 border border-purple-500/30 text-purple-300 text-xs"
                    >
                      <span>@{handle}</span>
                      <button
                        type="button"
                        onClick={() => removeFriendInvite(handle)}
                        className="p-0.5 rounded hover:bg-white/10 text-neutral-400 hover:text-white cursor-pointer"
                      >
                        <X className="w-3 h-3" />
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Footer Buttons */}
            <div className="pt-4 border-t border-white/10 flex items-center justify-end gap-3">
              <button
                type="button"
                onClick={onClose}
                className="px-5 py-2.5 rounded-xl bg-white/5 hover:bg-white/10 text-neutral-300 hover:text-white font-sans font-semibold text-xs transition cursor-pointer"
              >
                Cancel
              </button>

              <button
                type="submit"
                className="px-7 py-3 rounded-2xl bg-gradient-to-r from-amber-400 via-rose-500 to-purple-600 hover:brightness-110 text-white font-sans font-bold text-xs shadow-xl shadow-amber-500/20 hover:scale-[1.02] active:scale-95 transition cursor-pointer flex items-center gap-2"
              >
                <span>Launch Chamber Floor</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </form>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
