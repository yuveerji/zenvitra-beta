'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Crown,
  X,
  Sparkles,
  Globe2,
  Mic,
  Zap,
  Vote,
  Clock,
  Users,
  Copy,
  Check,
  Send,
  Share2,
  BookOpen,
  Layers,
  Flame,
  ShieldCheck,
  Plus
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
  const { createChamberRoom, setActiveCommitteeId } = useMun();

  const [eventType, setEventType] = useState<ChamberCategory>('MUN_COMMITTEE');
  const [title, setTitle] = useState('UN Security Council Plenary (UNSC)');
  const [agenda, setAgenda] = useState('Autonomous Cyber-Warfare & Global Sovereign Non-Proliferation');
  const [hostName, setHostName] = useState('Presiding Chair / Host');
  const [selectedTimerPreset, setSelectedTimerPreset] = useState<number>(60);
  const [isCustomTimer, setIsCustomTimer] = useState(false);
  const [customMinutes, setCustomMinutes] = useState(2);
  const [customSeconds, setCustomSeconds] = useState(30);
  const [roomCode, setRoomCode] = useState(() => `ZEN-${Math.floor(1000 + Math.random() * 9000)}`);
  const [copiedLink, setCopiedLink] = useState(false);
  const [customInviteHandle, setCustomInviteHandle] = useState('');
  const [selectedFriends, setSelectedFriends] = useState<string[]>([]);
  const [inviteSent, setInviteSent] = useState(false);

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
      label: '🏛️ MUNs (Model UN)',
      desc: 'Committees, GSL, Moderated Caucuses, Resolutions & Roll Calls',
      defaultTitle: 'UN Security Council (UNSC) Youth Plenary',
      defaultAgenda: 'Multilateral Sovereign Defense & AI Autonomous Systems'
    },
    {
      id: 'LOK_SABHA' as const,
      label: '🇮🇳 Lok Sabha / Parliament',
      desc: 'Bills, Zero Hour, Question Hour, Calling Attention, Division Votes',
      defaultTitle: 'Lok Sabha (House of the People) — Youth Parliamentary Session',
      defaultAgenda: 'National Youth Digital Sovereignty & AI Ethics Governance Bill'
    },
    {
      id: 'OPEN_MIC' as const,
      label: '🎤 Open Mic & Stage',
      desc: 'Spoken Word, Acoustic Jam, Standup Comedy, Live Audience Claps',
      defaultTitle: 'Geneva Midnight Youth Open Mic & Poetry Slam',
      defaultAgenda: 'Live Spoken Word, Acoustic Beats, Standup Comedy & Stage Acts'
    },
    {
      id: 'EP_101' as const,
      label: '⚡ EP 101 (Pitches / Founders)',
      desc: '3-Minute Lightning Startup Pitches, Jury Scorecards & Angel Ballots',
      defaultTitle: 'EP 101: Youth DeepTech & Climate Venture Pitch Arena',
      defaultAgenda: '3-Minute Founder Demos & Live Real-Time Jury Venture Balloting'
    },
    {
      id: 'STORYLINE' as const,
      label: '📖 Storyline (Story Stage)',
      desc: 'Oral Storytelling, Interactive Lore & Immersive Narrative Deliberation',
      defaultTitle: 'Global Storyline: Mythos & Oral Heritage Theater',
      defaultAgenda: 'Live Oral Storytelling, Interactive Lore Branches & Narrative Polling'
    },
    {
      id: 'OTHER' as const,
      label: '✨ Other / Anything',
      desc: 'Custom Round Table, Student Council, Referendum, Hackathon Stage',
      defaultTitle: 'Universal Youth Assembly & Multidisciplinary Forum',
      defaultAgenda: 'Open Deliberation, Cross-Sector Direct Policy & Dynamic Consensus'
    }
  ];

  const TIMER_PRESETS = [
    { label: 'GSL 60s', seconds: 60 },
    { label: 'GSL 90s', seconds: 90 },
    { label: '3-Min Pitch (EP 101)', seconds: 180 },
    { label: '4-Min Open Mic', seconds: 240 },
    { label: '10-Min Caucus', seconds: 600 },
    { label: '20-Min Zero Hour', seconds: 1200 },
  ];

  const handleEventTypeSelect = (opt: typeof EVENT_OPTIONS[0]) => {
    setEventType(opt.id);
    setTitle(opt.defaultTitle);
    setAgenda(opt.defaultAgenda);
  };

  const handleCopyLink = () => {
    const link = `${typeof window !== 'undefined' ? window.location.origin : 'https://zenvitra.xyz'}/committee?room=${roomCode}`;
    navigator.clipboard.writeText(link);
    setCopiedLink(true);
    setTimeout(() => setCopiedLink(false), 2000);
  };

  const handleAddCustomInvite = (e: React.FormEvent) => {
    e.preventDefault();
    const clean = customInviteHandle.trim().replace(/^@/, '');
    if (!clean) return;
    if (!selectedFriends.includes(clean)) {
      setSelectedFriends([...selectedFriends, clean]);
    }
    setCustomInviteHandle('');
  };

  const removeFriendInvite = (handle: string) => {
    setSelectedFriends((prev) => prev.filter((h) => h !== handle));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !agenda.trim()) return;

    const newRoom = createChamberRoom(title.trim(), eventType, agenda.trim());
    setActiveCommitteeId(newRoom.id);

    // Broadcast invites to selected friends
    if (selectedFriends.length > 0) {
      broadcastActivitySync({
        source: 'chamber_invite',
        action: 'send_invites',
        metadata: {
          roomCode,
          title: title.trim(),
          category: eventType,
          invitees: selectedFriends
        },
        timestamp: Date.now()
      });
      setInviteSent(true);
    }

    if (onEventCreated) {
      onEventCreated(newRoom.id);
    }
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
          className="relative w-full max-w-2xl my-auto max-h-[92vh] bg-[#090a0f] border border-amber-500/30 rounded-3xl shadow-2xl flex flex-col overflow-hidden z-10 text-white"
        >
          {/* Header */}
          <div className="p-5 sm:p-6 border-b border-white/10 flex items-center justify-between bg-white/[0.02]">
            <div className="flex items-center gap-3">
              <div className="w-11 h-11 rounded-2xl bg-gradient-to-tr from-amber-400 via-rose-500 to-purple-600 p-[2px] shadow-lg">
                <div className="w-full h-full rounded-2xl bg-black flex items-center justify-center text-amber-300">
                  <Sparkles className="w-5 h-5 animate-spin-slow" />
                </div>
              </div>
              <div>
                <h2 className="font-display font-bold text-lg text-white flex items-center gap-2">
                  <span>Host Instant Event &amp; Live Chamber</span>
                  <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/40">
                    Instant Live
                  </span>
                </h2>
                <p className="text-xs text-neutral-400">
                  Create your own event, set instant timers, and invite participants to join your floor.
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
          <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto p-5 sm:p-7 space-y-6">
            
            {/* 1. Event Type Selector */}
            <div className="space-y-2">
              <label className="text-xs font-mono font-bold text-neutral-300 uppercase tracking-wider block">
                1. Select Event / Chamber Format
              </label>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5">
                {EVENT_OPTIONS.map((opt) => (
                  <button
                    key={opt.id}
                    type="button"
                    onClick={() => handleEventTypeSelect(opt)}
                    className={`p-3.5 rounded-2xl text-left border transition-all cursor-pointer ${
                      eventType === opt.id
                        ? 'bg-amber-500/15 border-amber-500 text-white shadow-[0_0_20px_rgba(245,158,11,0.25)] scale-[1.02]'
                        : 'bg-white/[0.03] border-white/10 text-neutral-400 hover:text-white hover:border-white/20'
                    }`}
                  >
                    <span className="font-bold text-xs block text-white">{opt.label}</span>
                    <span className="text-[10px] text-neutral-400 font-mono block mt-1 leading-tight">{opt.desc}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* 2. Event Title & Agenda */}
            <div className="space-y-4">
              <div className="space-y-1.5">
                <label className="text-xs font-mono font-bold text-neutral-300 uppercase tracking-wider block">
                  2. Event / Chamber Title *
                </label>
                <input
                  type="text"
                  required
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="e.g. UN Security Council Plenary or EP 101 Pitch Arena"
                  className="w-full bg-black/60 border border-white/15 rounded-2xl px-4 py-2.5 text-xs text-white placeholder-neutral-500 focus:outline-none focus:border-amber-400 font-medium"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-mono font-bold text-neutral-300 uppercase tracking-wider block">
                  3. Theme / Agenda Mandate *
                </label>
                <textarea
                  required
                  rows={2}
                  value={agenda}
                  onChange={(e) => setAgenda(e.target.value)}
                  placeholder="Define the primary agenda, mandate, or floor rules..."
                  className="w-full bg-black/60 border border-white/15 rounded-2xl p-3 text-xs text-white placeholder-neutral-500 focus:outline-none focus:border-amber-400 resize-none font-sans leading-relaxed"
                />
              </div>
            </div>

            {/* 3. Instant Timer Preset */}
            <div className="space-y-2">
              <label className="text-xs font-mono font-bold text-neutral-300 uppercase tracking-wider flex items-center gap-1.5">
                <Clock className="w-3.5 h-3.5 text-amber-400" />
                <span>4. Set Instant Floor Timer Preset</span>
              </label>
              <div className="flex flex-wrap items-center gap-2">
                {TIMER_PRESETS.map((preset) => (
                  <button
                    key={preset.label}
                    type="button"
                    onClick={() => {
                      setIsCustomTimer(false);
                      setSelectedTimerPreset(preset.seconds);
                    }}
                    className={`px-3.5 py-1.5 rounded-xl font-mono text-xs font-semibold transition cursor-pointer border ${
                      !isCustomTimer && selectedTimerPreset === preset.seconds
                        ? 'bg-amber-400 text-black border-amber-300 shadow-md font-bold'
                        : 'bg-white/5 text-neutral-400 hover:text-white border-white/10'
                    }`}
                  >
                    {preset.label}
                  </button>
                ))}

                <button
                  type="button"
                  onClick={() => {
                    setIsCustomTimer(true);
                    const total = customMinutes * 60 + customSeconds;
                    setSelectedTimerPreset(total > 0 ? total : 60);
                  }}
                  className={`px-3.5 py-1.5 rounded-xl font-mono text-xs font-semibold transition cursor-pointer border ${
                    isCustomTimer
                      ? 'bg-amber-400 text-black border-amber-300 shadow-md font-bold'
                      : 'bg-white/5 text-neutral-400 hover:text-white border-white/10'
                  }`}
                >
                  Custom
                </button>
              </div>

              {/* Custom Duration Fields */}
              {isCustomTimer && (
                <div className="flex flex-wrap items-center gap-3 p-3 rounded-2xl bg-black/70 border border-amber-400/30 text-xs font-mono animate-fadeIn">
                  <span className="text-neutral-400 text-[11px] font-bold uppercase tracking-wider">Set Custom Floor Time:</span>
                  <div className="flex items-center gap-1.5">
                    <input
                      type="number"
                      min={0}
                      max={180}
                      value={customMinutes}
                      onChange={(e) => handleCustomTimeChange(parseInt(e.target.value) || 0, customSeconds)}
                      className="w-16 px-2 py-1.5 rounded-xl bg-neutral-900 border border-white/20 text-center text-white text-xs font-mono font-bold focus:outline-none focus:border-amber-400"
                    />
                    <span className="text-neutral-400 text-xs">min</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <input
                      type="number"
                      min={0}
                      max={59}
                      value={customSeconds}
                      onChange={(e) => handleCustomTimeChange(customMinutes, parseInt(e.target.value) || 0)}
                      className="w-16 px-2 py-1.5 rounded-xl bg-neutral-900 border border-white/20 text-center text-white text-xs font-mono font-bold focus:outline-none focus:border-amber-400"
                    />
                    <span className="text-neutral-400 text-xs">sec</span>
                  </div>
                  <span className="text-amber-400 text-xs font-bold ml-auto">
                    Floor Time: {Math.floor(selectedTimerPreset / 60)}m {selectedTimerPreset % 60}s ({selectedTimerPreset}s)
                  </span>
                </div>
              )}
            </div>

            {/* 4. Instant Share Link & Room Code */}
            <div className="p-4 rounded-2xl bg-black/60 border border-white/10 space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs font-mono font-bold text-neutral-300 uppercase flex items-center gap-1.5">
                  <Share2 className="w-3.5 h-3.5 text-cyan-400" />
                  <span>5. Instant Room Code &amp; Join Link</span>
                </span>
                <span className="text-xs font-mono font-bold px-2 py-0.5 rounded bg-cyan-500/10 text-cyan-300 border border-cyan-500/30">
                  CODE: {roomCode}
                </span>
              </div>

              <div className="flex items-center gap-2">
                <input
                  type="text"
                  readOnly
                  value={`https://zenvitra.xyz/committee?room=${roomCode}`}
                  className="flex-1 bg-neutral-900 border border-white/15 rounded-xl px-3 py-2 text-xs font-mono text-neutral-300 select-all"
                />
                <button
                  type="button"
                  onClick={handleCopyLink}
                  className="px-4 py-2 rounded-xl bg-white/10 hover:bg-white/20 text-white font-mono text-xs font-bold transition flex items-center gap-1.5 cursor-pointer shrink-0"
                >
                  {copiedLink ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                  <span>{copiedLink ? 'Copied!' : 'Copy Link'}</span>
                </button>
              </div>
            </div>

            {/* 6. Invite People / Friends to Join Floor */}
            <div className="space-y-3">
              <label className="text-xs font-mono font-bold text-neutral-300 uppercase tracking-wider flex items-center justify-between">
                <span className="flex items-center gap-1.5">
                  <Users className="w-3.5 h-3.5 text-purple-400" />
                  <span>6. Invite People / Friends to Join Floor</span>
                </span>
                <span className="text-[10px] text-neutral-400 font-mono">
                  {selectedFriends.length} invited
                </span>
              </label>

              {/* Dynamic Add Input */}
              <div className="flex gap-2">
                <div className="relative flex-1">
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
                    placeholder="Enter @username, handle or email..."
                    className="w-full bg-black/60 border border-white/15 rounded-2xl px-4 py-2.5 text-xs text-white placeholder-neutral-500 focus:outline-none focus:border-purple-400 font-mono"
                  />
                </div>
                <button
                  type="button"
                  onClick={handleAddCustomInvite}
                  disabled={!customInviteHandle.trim()}
                  className="px-4 py-2.5 rounded-2xl bg-purple-500/20 hover:bg-purple-500/30 text-purple-300 border border-purple-500/40 text-xs font-mono font-bold transition disabled:opacity-40 cursor-pointer shrink-0"
                >
                  + Add
                </button>
              </div>

              {/* Chips List */}
              {selectedFriends.length > 0 ? (
                <div className="flex flex-wrap gap-2 pt-1">
                  {selectedFriends.map((handle) => (
                    <div
                      key={handle}
                      className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-purple-500/15 border border-purple-500/30 text-purple-300 text-xs font-mono"
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
              ) : (
                <p className="text-[11px] font-mono text-neutral-500">
                  No invitees added yet. Enter a username above or share your instant room link to let anyone join directly.
                </p>
              )}
            </div>

            {/* Footer Submit */}
            <div className="pt-4 border-t border-white/10 flex items-center justify-end gap-3">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2.5 rounded-xl bg-white/5 hover:bg-white/10 text-neutral-400 hover:text-white font-display font-semibold text-xs transition cursor-pointer"
              >
                Cancel
              </button>

              <button
                type="submit"
                className="px-7 py-2.5 rounded-2xl bg-gradient-to-r from-amber-400 via-rose-500 to-purple-600 text-white font-display font-bold text-xs shadow-lg hover:scale-105 transition cursor-pointer flex items-center gap-2"
              >
                <Plus className="w-4 h-4" />
                <span>Launch Floor &amp; Invite Attendees</span>
              </button>
            </div>
          </form>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
