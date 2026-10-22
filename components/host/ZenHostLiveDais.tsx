'use client';

import React, { useState, useEffect, useRef, useCallback } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import {
  Mic,
  Play,
  Pause,
  RotateCcw,
  SkipForward,
  Plus,
  Volume2,
  VolumeX,
  Bell,
  Sparkles,
  Users,
  Clock,
  Tv,
  Share2,
  Check,
  ChevronRight,
  ChevronUp,
  ChevronDown,
  Trash2,
  AlertCircle,
  Trophy,
  Sliders,
  Settings,
  Lock,
  Radio,
  BookOpen,
  GraduationCap,
  MessageSquare,
  BarChart2,
  ThumbsUp,
  X,
  Edit2,
  Maximize2,
  Send,
  Gavel,
} from 'lucide-react';
import {
  HostSessionFormat,
  HOST_FORMAT_PRESETS,
  HostQueueItem,
  HostPoll,
  HostAnnouncement,
  CustomHostEventConfig,
} from '@/types/zenHost';
import CustomEventBuilderModal from '@/components/host/CustomEventBuilderModal';
import DaisSettingsModal, { DaisLiveSettings } from '@/components/host/DaisSettingsModal';
import StageAmbientBackground from '@/components/host/StageAmbientBackground';

interface ZenHostLiveDaisProps {
  sessionCode?: string;
  initialFormat?: HostSessionFormat;
  initialTitle?: string;
  customConfig?: CustomHostEventConfig;
  onExit?: () => void;
}

export default function ZenHostLiveDais({
  sessionCode: propSessionCode,
  initialFormat = 'open_mic',
  initialTitle,
  customConfig: propCustomConfig,
  onExit,
}: ZenHostLiveDaisProps) {
  const router = useRouter();

  // Custom Configuration State (if configured or modular)
  const [customConfig, setCustomConfig] = useState<CustomHostEventConfig | undefined>(propCustomConfig);
  const [isCustomConfigModalOpen, setIsCustomConfigModalOpen] = useState(false);

  // Dais Live Feature Toggles State
  const [isSettingsModalOpen, setIsSettingsModalOpen] = useState(false);
  const [daisSettings, setDaisSettings] = useState<DaisLiveSettings>(() => ({
    showQueue: customConfig ? customConfig.enableQueue : true,
    showOnDeck: customConfig ? customConfig.enableOnDeckCallout : true,
    showCompletedActs: true,
    showSessionClock: customConfig ? customConfig.enableMasterTimer : true,
    enableVoting: customConfig ? customConfig.enableRapidPolls : true,
    showLiveVoteCount: true,
    enableApplauseMeter: customConfig ? customConfig.enableApplauseMeter : true,
    enableStageBroadcast: customConfig ? customConfig.enableStageBroadcasts : true,
    enableHostNotes: true,
    enableSounds: customConfig ? customConfig.enableAudioChimes : true,
    enableWarningBell: true,
    enableBuzzer: true,
    enableCheerSound: true,
    enableTimer: customConfig ? customConfig.enableSpeakerTimer : true,
    strictCutoff: customConfig ? customConfig.strictCutoff : false,
    enableScoring: initialFormat === 'competition' || Boolean(customConfig?.enableScoringRubric),
  }));

  // 1. Session Identity
  const [sessionCode] = useState<string>(() => {
    if (propSessionCode) return propSessionCode;
    return `ZH-${Math.floor(100000 + Math.random() * 900000)}`;
  });

  const [format, setFormat] = useState<HostSessionFormat>(initialFormat);
  const [title, setTitle] = useState<string>(() => {
    if (customConfig?.eventName) return customConfig.eventName;
    if (initialTitle) return initialTitle;
    return HOST_FORMAT_PRESETS[initialFormat]?.name || 'Live Stage';
  });
  const [isEditingTitle, setIsEditingTitle] = useState(false);

  // 2. Timer System
  const formatPreset = HOST_FORMAT_PRESETS[format] || HOST_FORMAT_PRESETS.general;
  const initialSpeakerSecs = customConfig?.speakerTimerSeconds || formatPreset.defaultTimer;
  const [speakerDuration, setSpeakerDuration] = useState<number>(initialSpeakerSecs);
  const [remainingSeconds, setRemainingSeconds] = useState<number>(initialSpeakerSecs);
  const [overtimeSeconds, setOvertimeSeconds] = useState<number>(0);
  const [isTimerRunning, setIsTimerRunning] = useState<boolean>(false);
  const [sessionTotalSeconds, setSessionTotalSeconds] = useState<number>(0);

  // 3. Queue System
  const [queue, setQueue] = useState<HostQueueItem[]>([]);
  const [activeQueueItem, setActiveQueueItem] = useState<HostQueueItem | null>(null);
  const [completedQueue, setCompletedQueue] = useState<HostQueueItem[]>([]);

  // Add Performer Modal / Drawer
  const [newPerformerName, setNewPerformerName] = useState('');
  const [newPerformerAct, setNewPerformerAct] = useState('');
  const [newPerformerMinutes, setNewPerformerMinutes] = useState(
    Math.floor(formatPreset.defaultTimer / 60).toString()
  );
  const [isAddPerformerOpen, setIsAddPerformerOpen] = useState(false);

  // 4. Interactive Modules (Sound, Polls, Broadcast)
  const [soundEnabled, setSoundEnabled] = useState(true);
  const [applauseMeter, setApplauseMeter] = useState(0);
  const [activeTab, setActiveTab] = useState<'queue' | 'interactive' | 'scoring' | 'notes'>('queue');
  
  // Quick Poll
  const [polls, setPolls] = useState<HostPoll[]>([]);
  const [newPollQuestion, setNewPollQuestion] = useState('');
  const [newPollOptionA, setNewPollOptionA] = useState('Yes / Approved');
  const [newPollOptionB, setNewPollOptionB] = useState('No / Objection');
  const [isCreatePollOpen, setIsCreatePollOpen] = useState(false);

  // Stage Announcement / Lower Third Broadcast
  const [announcements, setAnnouncements] = useState<HostAnnouncement[]>([]);
  const [announcementText, setAnnouncementText] = useState('');
  const [isBroadcastBannerActive, setIsBroadcastBannerActive] = useState(false);

  // Host Stage Notes
  const [stageNotes, setStageNotes] = useState('');

  // Competition Rubric Scores
  const [rubricScores, setRubricScores] = useState<{ [category: string]: number }>({
    'Delivery & Stage Presence': 8,
    'Content & Originality': 8,
    'Audience Impact': 8,
  });

  // Copied link toast state
  const [hasCopiedLink, setHasCopiedLink] = useState(false);
  // Gavel shockwave animation state
  const [isGavelStriking, setIsGavelStriking] = useState(false);

  // ── Web Audio API Synthetic Chimes ──────────────────────────────────
  const playSoundEffect = useCallback((type: 'ding' | 'buzzer' | 'applause' | 'gavel') => {
    if (!daisSettings.enableSounds || !soundEnabled || typeof window === 'undefined') return;
    if (type === 'ding' && !daisSettings.enableWarningBell) return;
    if (type === 'buzzer' && !daisSettings.enableBuzzer) return;
    if (type === 'applause' && !daisSettings.enableCheerSound) return;
    try {
      const AudioCtx = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      const ctx = new AudioCtx();

      if (type === 'ding') {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.type = 'sine';
        osc.frequency.setValueAtTime(880, ctx.currentTime);
        osc.frequency.exponentialRampToValueAtTime(1760, ctx.currentTime + 0.1);
        gain.gain.setValueAtTime(0.3, ctx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.8);
        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.start();
        osc.stop(ctx.currentTime + 0.8);
      } else if (type === 'buzzer') {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.type = 'sawtooth';
        osc.frequency.setValueAtTime(160, ctx.currentTime);
        osc.frequency.exponentialRampToValueAtTime(110, ctx.currentTime + 0.5);
        gain.gain.setValueAtTime(0.4, ctx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.5);
        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.start();
        osc.stop(ctx.currentTime + 0.5);
      } else if (type === 'applause') {
        // Synthesize cheering crowd burst using filtered white noise
        const bufferSize = ctx.sampleRate * 1.5;
        const buffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
        const data = buffer.getChannelData(0);
        for (let i = 0; i < bufferSize; i++) {
          data[i] = Math.random() * 2 - 1;
        }
        const noise = ctx.createBufferSource();
        noise.buffer = buffer;
        const filter = ctx.createBiquadFilter();
        filter.type = 'bandpass';
        filter.frequency.value = 1200;
        filter.Q.value = 2;
        const gain = ctx.createGain();
        gain.gain.setValueAtTime(0.25, ctx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 1.5);
        noise.connect(filter);
        filter.connect(gain);
        gain.connect(ctx.destination);
        noise.start();
      } else if (type === 'gavel') {
        // Synthesize resonant double wooden gavel strike
        [0, 0.12].forEach((delay) => {
          const osc = ctx.createOscillator();
          const gain = ctx.createGain();
          osc.type = 'triangle';
          osc.frequency.setValueAtTime(220, ctx.currentTime + delay);
          osc.frequency.exponentialRampToValueAtTime(70, ctx.currentTime + delay + 0.09);
          gain.gain.setValueAtTime(0.55, ctx.currentTime + delay);
          gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + delay + 0.18);
          osc.connect(gain);
          gain.connect(ctx.destination);
          osc.start(ctx.currentTime + delay);
          osc.stop(ctx.currentTime + delay + 0.18);
        });
      }
    } catch {
      // AudioContext unavailable or blocked by autoplay policy
    }
  }, [soundEnabled, daisSettings.enableSounds, daisSettings.enableWarningBell, daisSettings.enableBuzzer, daisSettings.enableCheerSound]);

  // ── Timer Interval Tick ─────────────────────────────────────────────
  useEffect(() => {
    let interval: NodeJS.Timeout | null = null;
    if (isTimerRunning && daisSettings.enableTimer) {
      interval = setInterval(() => {
        setRemainingSeconds((prev) => {
          if (prev > 1) {
            if (prev === 31) {
              playSoundEffect('ding'); // 30 second warning
            }
            return prev - 1;
          } else if (prev === 1) {
            playSoundEffect('buzzer'); // Time's up gong
            if (daisSettings.strictCutoff) {
              setIsTimerRunning(false);
            }
            return 0;
          } else {
            // Count overtime if strict cutoff is false
            if (daisSettings.strictCutoff) {
              return 0;
            }
            setOvertimeSeconds((ot) => ot + 1);
            return 0;
          }
        });
        setSessionTotalSeconds((tot) => tot + 1);
      }, 1000);
    }
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [isTimerRunning, playSoundEffect, daisSettings.enableTimer, daisSettings.strictCutoff]);

  // ── Keyboard Shortcuts ──────────────────────────────────────────────
  const handleGavelStrike = useCallback(() => {
    playSoundEffect('gavel');
    setIsGavelStriking(true);
    setTimeout(() => setIsGavelStriking(false), 800);
  }, [playSoundEffect]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      const target = e.target as HTMLElement;
      if (['INPUT', 'TEXTAREA', 'SELECT'].includes(target?.tagName)) return;

      if (e.code === 'Space') {
        e.preventDefault();
        setIsTimerRunning((prev) => !prev);
      } else if (e.key === 'r' || e.key === 'R') {
        e.preventDefault();
        handleResetTimer();
      } else if (e.key === 'n' || e.key === 'N') {
        e.preventDefault();
        handleNextPerformer();
      } else if (e.key === 'g' || e.key === 'G') {
        e.preventDefault();
        handleGavelStrike();
      } else if (e.key === 'd' || e.key === 'D') {
        e.preventDefault();
        playSoundEffect('ding');
      } else if (e.key === 'b' || e.key === 'B') {
        e.preventDefault();
        playSoundEffect('buzzer');
      } else if (e.key === 'a' || e.key === 'A') {
        e.preventDefault();
        triggerCheer();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [queue, activeQueueItem, handleGavelStrike, playSoundEffect]);

  // ── Queue Operations ────────────────────────────────────────────────
  const handleAddPerformer = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newPerformerName.trim()) return;

    const parsedMin = parseFloat(newPerformerMinutes) || 3;
    const slotSecs = Math.max(30, Math.round(parsedMin * 60));

    const newItem: HostQueueItem = {
      id: `queue-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
      participantId: `part-${Date.now()}`,
      participantName: newPerformerName.trim(),
      role: 'performer',
      slotDurationSeconds: slotSecs,
      timeSpokenSeconds: 0,
      status: 'waiting',
      addedAt: new Date().toISOString(),
      titleOrAct: newPerformerAct.trim() || undefined,
    };

    // If nobody on stage right now, prompt host to put directly on stage or queue
    if (!activeQueueItem) {
      setActiveQueueItem(newItem);
      setSpeakerDuration(slotSecs);
      setRemainingSeconds(slotSecs);
      setOvertimeSeconds(0);
    } else {
      setQueue((prev) => [...prev, newItem]);
    }

    setNewPerformerName('');
    setNewPerformerAct('');
    setIsAddPerformerOpen(false);
  };

  const handleNextPerformer = () => {
    // If active performer exists, archive them to completed
    if (activeQueueItem) {
      setCompletedQueue((prev) => [
        {
          ...activeQueueItem,
          timeSpokenSeconds: activeQueueItem.slotDurationSeconds - remainingSeconds + overtimeSeconds,
          status: 'completed',
        },
        ...prev,
      ]);
    }

    // Pop from queue
    if (queue.length > 0) {
      const [nextPerformer, ...rest] = queue;
      setActiveQueueItem(nextPerformer);
      setQueue(rest);
      setSpeakerDuration(nextPerformer.slotDurationSeconds);
      setRemainingSeconds(nextPerformer.slotDurationSeconds);
      setOvertimeSeconds(0);
      setIsTimerRunning(false);
      playSoundEffect('ding');
    } else {
      setActiveQueueItem(null);
      setRemainingSeconds(speakerDuration);
      setOvertimeSeconds(0);
      setIsTimerRunning(false);
    }
  };

  const handlePutOnStage = (item: HostQueueItem) => {
    if (activeQueueItem) {
      // Put current back to top of queue
      setQueue((prev) => [activeQueueItem, ...prev.filter((q) => q.id !== item.id)]);
    } else {
      setQueue((prev) => prev.filter((q) => q.id !== item.id));
    }
    setActiveQueueItem(item);
    setSpeakerDuration(item.slotDurationSeconds);
    setRemainingSeconds(item.slotDurationSeconds);
    setOvertimeSeconds(0);
    setIsTimerRunning(false);
  };

  const handleMoveQueue = (index: number, direction: 'up' | 'down') => {
    setQueue((prev) => {
      const copy = [...prev];
      const targetIndex = direction === 'up' ? index - 1 : index + 1;
      if (targetIndex < 0 || targetIndex >= copy.length) return copy;
      const temp = copy[index];
      copy[index] = copy[targetIndex];
      copy[targetIndex] = temp;
      return copy;
    });
  };

  const handleRemoveFromQueue = (id: string) => {
    setQueue((prev) => prev.filter((q) => q.id !== id));
  };

  const handleResetTimer = () => {
    setIsTimerRunning(false);
    setRemainingSeconds(speakerDuration);
    setOvertimeSeconds(0);
  };

  const handleAddThirtySeconds = () => {
    setRemainingSeconds((prev) => prev + 30);
  };

  const triggerCheer = () => {
    playSoundEffect('applause');
    setApplauseMeter((prev) => Math.min(100, prev + 25));
    setTimeout(() => {
      setApplauseMeter((prev) => Math.max(0, prev - 15));
    }, 1500);
  };

  const handleCopyJoinLink = () => {
    if (typeof window === 'undefined') return;
    const url = `${window.location.origin}/host/join?code=${sessionCode}`;
    navigator.clipboard.writeText(url);
    setHasCopiedLink(true);
    setTimeout(() => setHasCopiedLink(false), 2000);
  };

  const handleOpenAuditoriumDisplay = () => {
    if (typeof window === 'undefined') return;
    const votingParam = daisSettings.enableVoting ? 'allowed' : 'off';
    window.open(`/host/display?room=${sessionCode}&format=${format}&voting=${votingParam}`, '_blank');
  };

  // Formatting utilities
  const formatTimeMinutesSeconds = (totalSecs: number) => {
    const mins = Math.floor(Math.max(0, totalSecs) / 60);
    const secs = Math.max(0, totalSecs) % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const isOvertime = remainingSeconds === 0 && overtimeSeconds > 0;
  const isWarning = remainingSeconds <= 30 && remainingSeconds > 0;

  return (
    <div className="min-h-screen bg-[#020307] text-neutral-100 font-sans select-none flex flex-col justify-between overflow-x-hidden selection:bg-amber-500/20 selection:text-amber-200 relative">
      {/* ── STAGE AMBIENT THEATRICAL BACKGROUND ── */}
      <StageAmbientBackground theme="dais" />

      {/* ── 1. SOVEREIGN DAIS COMMAND HEADER ─────────────────────────────────── */}
      <header className="border-b border-white/[0.08] bg-[#040711]/90 backdrop-blur-xl px-4 sm:px-6 py-3 sticky top-0 z-40 flex items-center justify-between gap-4">
        {/* Left: Brand & Format Selector */}
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse shadow-[0_0_12px_rgba(52,211,153,0.9)]" />
            <span className="text-[10px] font-mono font-bold uppercase tracking-[0.2em] text-emerald-400">
              {isTimerRunning ? 'ON AIR' : 'STAGE READY'}
            </span>
          </div>

          <div className="h-4 w-px bg-white/15" />

          {/* Session Title (Editable) */}
          <div className="flex items-center gap-2">
            {isEditingTitle ? (
              <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                onBlur={() => setIsEditingTitle(false)}
                onKeyDown={(e) => e.key === 'Enter' && setIsEditingTitle(false)}
                autoFocus
                className="bg-black/70 border border-amber-400/50 rounded-lg px-2.5 py-1 text-sm font-bold font-space text-white focus:outline-none focus:ring-1 focus:ring-amber-400"
              />
            ) : (
              <button
                type="button"
                onClick={() => setIsEditingTitle(true)}
                className="flex items-center gap-1.5 text-sm sm:text-base font-black font-space text-white hover:text-amber-300 transition group text-left tracking-tight"
              >
                <span>{title}</span>
                <Edit2 className="w-3.5 h-3.5 text-neutral-500 group-hover:text-amber-400 opacity-60 transition" />
              </button>
            )}

            {/* Format Badge */}
            <span className="hidden sm:inline-flex px-2.5 py-0.5 rounded-md bg-amber-500/10 border border-amber-500/30 text-amber-400 text-[10px] font-mono font-bold uppercase tracking-wider">
              {formatPreset.badge}
            </span>
          </div>
        </div>

        {/* Center: Format Selector Quick Dropdown */}
        <div className="hidden lg:flex items-center gap-1.5 bg-black/50 border border-white/10 rounded-xl p-1 backdrop-blur-md">
          {(Object.keys(HOST_FORMAT_PRESETS) as HostSessionFormat[])
            .filter((fmt) => fmt !== 'mun') // MUN has its own specialized chair dais
            .map((fmtKey) => {
              const preset = HOST_FORMAT_PRESETS[fmtKey];
              const isSelected = format === fmtKey;
              return (
                <button
                  key={fmtKey}
                  type="button"
                  onClick={() => {
                    setFormat(fmtKey);
                    setSpeakerDuration(preset.defaultTimer);
                    setRemainingSeconds(preset.defaultTimer);
                  }}
                  className={`px-3 py-1 rounded-lg text-xs font-bold font-space transition flex items-center gap-1.5 ${
                    isSelected
                      ? 'bg-gradient-to-r from-amber-500 to-amber-400 text-black shadow-[0_0_15px_rgba(245,158,11,0.4)]'
                      : 'text-neutral-400 hover:text-white hover:bg-white/5'
                  }`}
                >
                  <span>{preset.name.split(' ')[0]}</span>
                </button>
              );
            })}
        </div>

        {/* Right: Room Code, Sound Toggle, Auditorium Display & Exit */}
        <div className="flex items-center gap-2 sm:gap-3">
          {/* Room PIN with Copy */}
          <button
            type="button"
            onClick={handleCopyJoinLink}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white/[0.04] border border-white/15 hover:border-amber-400/50 hover:bg-white/[0.08] transition text-xs font-mono font-bold text-amber-300 shadow-[0_0_15px_rgba(245,158,11,0.15)]"
            title="Click to copy join link for attendees"
          >
            <Share2 className="w-3.5 h-3.5 text-amber-400" />
            <span className="tracking-widest">{sessionCode}</span>
            {hasCopiedLink && (
              <span className="text-[10px] text-emerald-400 font-bold ml-1 animate-pulse">COPIED!</span>
            )}
          </button>

          {/* Audio Chime Mute/Unmute */}
          <button
            type="button"
            onClick={() => setSoundEnabled((prev) => !prev)}
            className={`p-2 rounded-xl border transition ${
              soundEnabled
                ? 'bg-white/[0.05] border-white/15 text-neutral-300 hover:text-white hover:border-amber-400/40'
                : 'bg-red-950/40 border-red-500/40 text-red-400'
            }`}
            title={soundEnabled ? 'Sound FX Enabled' : 'Sound FX Muted'}
          >
            {soundEnabled ? <Volume2 className="w-4 h-4 text-amber-400" /> : <VolumeX className="w-4 h-4" />}
          </button>

          {/* Projector / Stage Display */}
          <button
            type="button"
            onClick={handleOpenAuditoriumDisplay}
            className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-cyan-950/40 border border-cyan-500/40 hover:bg-cyan-900/50 transition text-xs font-bold font-space text-cyan-300 shadow-[0_0_15px_rgba(6,182,212,0.2)]"
            title="Launch Fullscreen Projector / Public Stage Feed"
          >
            <Tv className="w-3.5 h-3.5" />
            <span>Stage Display</span>
          </button>

          {/* Live Settings Modal (Configure Voting, Queue, Timers, Layout, Sounds) */}
          <button
            type="button"
            onClick={() => setIsSettingsModalOpen(true)}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white/[0.04] border border-white/15 hover:border-amber-400/50 hover:bg-white/[0.08] transition text-xs font-bold font-space text-amber-300"
            title="Configure Live Stage Features & Toggles"
          >
            <Settings className="w-3.5 h-3.5" />
            <span className="hidden md:inline">Settings</span>
          </button>

          {/* Modular Toggles / Studio Settings */}
          <button
            type="button"
            onClick={() => setIsCustomConfigModalOpen(true)}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white/[0.04] border border-white/15 hover:border-cyan-400/50 hover:bg-white/[0.08] transition text-xs font-bold font-space text-cyan-300"
            title="Configure Modular Event Toggles"
          >
            <Sliders className="w-3.5 h-3.5" />
            <span className="hidden md:inline">Custom Studio</span>
          </button>

          {/* Exit Dais */}
          <button
            type="button"
            onClick={() => {
              if (onExit) onExit();
              else router.push('/host');
            }}
            className="p-2 rounded-xl bg-white/[0.04] border border-white/15 hover:bg-red-950/40 hover:border-red-500/40 text-neutral-400 hover:text-red-300 transition"
            title="Exit Dais to Host Hub"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      </header>

      {/* ── 2. ACTIVE BROADCAST ANNOUNCEMENT BANNER ──────────────────────────── */}
      {isBroadcastBannerActive && announcementText && (
        <div className="bg-gradient-to-r from-amber-500 via-amber-400 to-amber-500 text-black px-4 py-2 font-black font-space text-xs uppercase tracking-wider flex items-center justify-between shadow-xl relative z-30">
          <div className="flex items-center gap-2">
            <Bell className="w-4 h-4 animate-bounce" />
            <span className="font-mono">STAGE ANNOUNCEMENT:</span>
            <span className="font-normal normal-case text-sm text-neutral-900 font-sans font-semibold">
              {announcementText}
            </span>
          </div>
          <button
            type="button"
            onClick={() => setIsBroadcastBannerActive(false)}
            className="text-black/80 hover:text-black p-1"
          >
            <X className="w-3.5 h-3.5" />
          </button>
        </div>
      )}

      {/* ── 3. MAIN DAIS ARENA ─────────────────────────────────────────────────── */}
      <div className="flex-1 max-w-[1600px] w-full mx-auto px-4 sm:px-6 py-6 grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* ── LEFT/CENTER: THE MAIN STAGE & TIMER CONSOLE (8 Cols or 12 Cols if queue disabled) ── */}
        <main
          className={`${
            daisSettings.showQueue ? 'lg:col-span-8' : 'lg:col-span-12 max-w-5xl mx-auto w-full'
          } flex flex-col space-y-6`}
        >
          {/* Active Performer / Speaker Spotlight Card */}
          <div className="relative rounded-3xl bg-[#050814]/90 border border-white/[0.08] shadow-[0_15px_50px_rgba(0,0,0,0.7)] p-6 sm:p-8 overflow-hidden backdrop-blur-2xl">
            {/* Gavel Strike Shockwave Animation */}
            {isGavelStriking && (
              <div className="absolute inset-0 bg-amber-500/15 animate-ping pointer-events-none rounded-3xl z-20" />
            )}

            {/* Ambient Dynamic Spotlight Glow */}
            <div
              className={`absolute top-0 right-0 w-[450px] h-[450px] rounded-full blur-[100px] pointer-events-none transition duration-700 opacity-25 ${
                isOvertime
                  ? 'bg-red-500'
                  : isWarning
                  ? 'bg-amber-500'
                  : 'bg-cyan-500'
              }`}
            />

            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-white/[0.08] pb-6 relative z-10">
              <div className="flex items-center gap-4">
                {/* Active Speaker Avatar with Live Frequency Pulsing Ring */}
                <div
                  className={`w-14 h-14 sm:w-16 sm:h-16 rounded-2xl flex items-center justify-center font-black text-xl shadow-2xl border transition-all duration-300 relative ${
                    isTimerRunning
                      ? 'bg-gradient-to-br from-amber-500 to-amber-400 text-black border-amber-300 ring-4 ring-amber-400/30 shadow-[0_0_35px_rgba(245,158,11,0.5)] scale-105'
                      : 'bg-white/[0.06] text-white border-white/20'
                  }`}
                >
                  <Mic className="w-7 h-7 sm:w-8 sm:h-8" />
                  {isTimerRunning && (
                    <span className="absolute -inset-1 rounded-2xl border border-amber-400/40 animate-ping pointer-events-none" />
                  )}
                </div>

                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-[10px] font-mono font-bold tracking-[0.2em] text-amber-400 uppercase">
                      {format === 'open_mic'
                        ? 'CURRENT PERFORMER ON MIC'
                        : format === 'custom_timer'
                        ? 'STAGE SPEAKER / TIMER RUN'
                        : format === 'competition'
                        ? 'ACTIVE COMPETITOR PITCH'
                        : 'ACTIVE STAGE FLOOR'}
                    </span>
                    {/* Live Audio Spectrum Bars */}
                    {isTimerRunning && (
                      <div className="flex items-end gap-1 h-3.5 px-1">
                        <span className="w-0.5 bg-amber-400 rounded-full animate-[pulse_0.6s_ease-in-out_infinite] h-2" />
                        <span className="w-0.5 bg-amber-400 rounded-full animate-[pulse_0.4s_ease-in-out_infinite] h-3.5" />
                        <span className="w-0.5 bg-amber-300 rounded-full animate-[pulse_0.8s_ease-in-out_infinite] h-3" />
                        <span className="w-0.5 bg-amber-400 rounded-full animate-[pulse_0.5s_ease-in-out_infinite] h-2.5" />
                        <span className="w-0.5 bg-amber-400 rounded-full animate-[pulse_0.7s_ease-in-out_infinite] h-1.5" />
                      </div>
                    )}
                  </div>

                  <h2 className="text-2xl sm:text-4xl font-black font-space text-white tracking-tight">
                    {activeQueueItem?.participantName || 'Stage Floor Open'}
                  </h2>
                  {activeQueueItem?.titleOrAct && (
                    <p className="text-sm text-neutral-400 italic font-outfit mt-0.5">
                      &ldquo;{activeQueueItem.titleOrAct}&rdquo;
                    </p>
                  )}
                </div>
              </div>

              {/* Total Session Clock */}
              {daisSettings.showSessionClock && (
                <div className="px-4 py-2 rounded-xl bg-white/[0.03] border border-white/10 text-right backdrop-blur-md">
                  <div className="text-[9px] uppercase font-mono font-bold tracking-widest text-neutral-400">SESSION TIME</div>
                  <div className="text-sm font-mono font-bold text-neutral-200 tabular-nums">
                    {formatTimeMinutesSeconds(sessionTotalSeconds)}
                  </div>
                </div>
              )}
            </div>

            {/* Giant Central Countdown Clock or Open Stage Display */}
            {daisSettings.enableTimer ? (
              <div className="py-8 sm:py-12 flex flex-col items-center justify-center relative z-10">
                <div
                  className={`font-mono tabular-nums font-black tracking-tighter text-6xl sm:text-8xl md:text-9xl transition-all duration-300 select-none ${
                    isOvertime
                      ? 'text-red-500 animate-pulse drop-shadow-[0_0_50px_rgba(239,68,68,0.7)]'
                      : isWarning
                      ? 'text-amber-400 drop-shadow-[0_0_45px_rgba(251,191,36,0.6)]'
                      : 'text-white drop-shadow-[0_0_35px_rgba(255,255,255,0.25)]'
                  }`}
                >
                  {isOvertime ? `+${formatTimeMinutesSeconds(overtimeSeconds)}` : formatTimeMinutesSeconds(remainingSeconds)}
                </div>

                {/* Overtime or Warning Status Alert */}
                <div className="h-7 mt-3">
                  {isOvertime ? (
                    <span className="px-3.5 py-1 rounded-full bg-red-950/80 border border-red-500/50 text-red-300 text-xs font-mono font-bold uppercase tracking-[0.2em] animate-pulse shadow-[0_0_20px_rgba(239,68,68,0.4)]">
                      &bull; TIME EXCEEDED / OVERTIME &bull;
                    </span>
                  ) : isWarning ? (
                    <span className="px-3.5 py-1 rounded-full bg-amber-950/80 border border-amber-500/50 text-amber-300 text-xs font-mono font-bold uppercase tracking-[0.2em] shadow-[0_0_20px_rgba(245,158,11,0.3)]">
                      &bull; 30 SECONDS REMAINING &bull;
                    </span>
                  ) : (
                    <span className="text-xs text-neutral-400 font-mono tabular-nums">
                      Slot Limit: {formatTimeMinutesSeconds(speakerDuration)}
                    </span>
                  )}
                </div>

                {/* Visual Progress Bar */}
                <div className="w-full max-w-xl h-2.5 bg-white/10 rounded-full mt-6 overflow-hidden p-0.5 border border-white/[0.05]">
                  <div
                    className={`h-full transition-all duration-300 rounded-full ${
                      isOvertime
                        ? 'bg-red-500 w-full shadow-[0_0_15px_rgba(239,68,68,0.7)]'
                        : isWarning
                        ? 'bg-gradient-to-r from-amber-500 to-red-400 shadow-[0_0_15px_rgba(245,158,11,0.5)]'
                        : 'bg-gradient-to-r from-cyan-400 to-amber-400 shadow-[0_0_15px_rgba(6,182,212,0.4)]'
                    }`}
                    style={{
                      width: isOvertime
                        ? '100%'
                        : `${Math.max(0, Math.min(100, (remainingSeconds / speakerDuration) * 100))}%`,
                    }}
                  />
                </div>
              </div>
            ) : (
              <div className="py-12 flex flex-col items-center justify-center relative z-10 space-y-2">
                <div className="text-3xl sm:text-5xl font-black font-space text-white tracking-tight uppercase">
                  OPEN FLOOR STAGE
                </div>
                <div className="text-xs text-neutral-400 font-mono">
                  Countdown Timer Disabled under Settings &bull; Speaking floor is open
                </div>
              </div>
            )}

            {/* Direct Stage Control Bar */}
            <div className="flex flex-wrap items-center justify-center gap-3 pt-6 border-t border-white/[0.08] relative z-10">
              {/* Play / Pause Toggle */}
              {daisSettings.enableTimer && (
                <>
                  <button
                    type="button"
                    onClick={() => setIsTimerRunning((prev) => !prev)}
                    className={`px-8 py-3.5 rounded-2xl font-black font-space text-sm uppercase tracking-wider transition shadow-2xl active:scale-95 flex items-center gap-2 cursor-pointer ${
                      isTimerRunning
                        ? 'bg-amber-500 hover:bg-amber-400 text-black shadow-[0_0_30px_rgba(245,158,11,0.4)] ring-2 ring-amber-300'
                        : 'bg-gradient-to-r from-emerald-500 to-teal-400 hover:from-emerald-400 hover:to-teal-300 text-black shadow-[0_0_30px_rgba(52,211,153,0.35)]'
                    }`}
                  >
                    {isTimerRunning ? (
                      <>
                        <Pause className="w-4 h-4 fill-current" />
                        <span>Pause (Space)</span>
                      </>
                    ) : (
                      <>
                        <Play className="w-4 h-4 fill-current" />
                        <span>Start (Space)</span>
                      </>
                    )}
                  </button>

                  {/* Reset Timer */}
                  <button
                    type="button"
                    onClick={handleResetTimer}
                    className="p-3.5 rounded-2xl bg-white/[0.05] border border-white/15 hover:bg-white/[0.1] text-neutral-300 hover:text-white transition active:scale-95 shadow-[0_0_15px_rgba(255,255,255,0.05)]"
                    title="Reset Timer (R)"
                  >
                    <RotateCcw className="w-4 h-4" />
                  </button>

                  {/* Add 30s Extension */}
                  <button
                    type="button"
                    onClick={handleAddThirtySeconds}
                    className="px-4 py-3.5 rounded-2xl bg-white/[0.05] border border-white/15 hover:bg-white/[0.1] text-xs font-mono font-bold text-neutral-200 hover:text-white transition active:scale-95 shadow-[0_0_15px_rgba(255,255,255,0.05)]"
                    title="Add 30 Seconds"
                  >
                    +30s
                  </button>
                </>
              )}

              {/* Advance to Next Performer */}
              <button
                type="button"
                onClick={handleNextPerformer}
                className="px-6 py-3.5 rounded-2xl bg-white/[0.08] border border-white/20 hover:bg-white/[0.15] text-white font-black font-space text-xs uppercase tracking-wider transition active:scale-95 flex items-center gap-2 shadow-[0_0_20px_rgba(255,255,255,0.08)] cursor-pointer"
                title="Next Performer / Finish Slot (N)"
              >
                <span>Next (N)</span>
                <SkipForward className="w-4 h-4" />
              </button>

              {/* Gavel Call to Order Strike Button */}
              <button
                type="button"
                onClick={handleGavelStrike}
                className="px-4 py-3 rounded-2xl bg-amber-500/15 hover:bg-amber-500/25 border border-amber-500/40 text-amber-300 font-black font-space text-xs uppercase tracking-wider transition shadow-[0_0_15px_rgba(245,158,11,0.2)] active:scale-95 flex items-center gap-2 cursor-pointer"
                title="Strike Gavel / Call Stage to Order (G)"
              >
                <Gavel className={`w-4 h-4 text-amber-400 transition-transform duration-200 ${isGavelStriking ? '-rotate-45 scale-125' : ''}`} />
                <span>Gavel (G)</span>
              </button>

              {/* Sound FX Triggers */}
              {daisSettings.enableSounds && (
                <div className="flex items-center gap-1.5 ml-1 border-l border-white/10 pl-3">
                  {daisSettings.enableWarningBell && (
                    <button
                      type="button"
                      onClick={() => playSoundEffect('ding')}
                      className="px-3 py-2.5 rounded-xl bg-white/[0.04] border border-white/15 hover:bg-amber-500/20 hover:border-amber-400/40 text-amber-300 text-xs font-bold font-space transition flex items-center gap-1.5"
                      title="Trigger Warning Bell (D)"
                    >
                      <Bell className="w-3.5 h-3.5" />
                      <span>Ding</span>
                    </button>
                  )}
                  {daisSettings.enableBuzzer && (
                    <button
                      type="button"
                      onClick={() => playSoundEffect('buzzer')}
                      className="px-3 py-2.5 rounded-xl bg-white/[0.04] border border-white/15 hover:bg-red-500/20 hover:border-red-400/40 text-red-300 text-xs font-bold font-space transition flex items-center gap-1.5"
                      title="Trigger Stage Buzzer (B)"
                    >
                      <AlertCircle className="w-3.5 h-3.5" />
                      <span>Buzzer</span>
                    </button>
                  )}
                  {daisSettings.enableCheerSound && (
                    <button
                      type="button"
                      onClick={triggerCheer}
                      className="px-3 py-2.5 rounded-xl bg-white/[0.04] border border-white/15 hover:bg-emerald-500/20 hover:border-emerald-400/40 text-emerald-300 text-xs font-bold font-space transition flex items-center gap-1.5"
                      title="Trigger Crowd Cheer & Claps (A)"
                    >
                      <Sparkles className="w-3.5 h-3.5 text-amber-400" />
                      <span>Cheer</span>
                    </button>
                  )}
                </div>
              )}
            </div>
          </div>

          {/* On Deck Preview Banner */}
          {daisSettings.showOnDeck && queue.length > 0 && (
            <div className="rounded-2xl bg-[#050814]/80 border border-amber-500/30 p-4 flex items-center justify-between gap-4 backdrop-blur-md shadow-[0_5px_20px_rgba(245,158,11,0.1)]">
              <div className="flex items-center gap-3">
                <div className="flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-amber-400 animate-ping" />
                  <span className="px-2.5 py-1 rounded-lg bg-amber-500/15 border border-amber-500/30 text-amber-300 text-[10px] font-mono font-bold uppercase tracking-[0.2em]">
                    NEXT UP ON DECK
                  </span>
                </div>
                <div>
                  <div className="font-black font-space text-white text-sm">
                    {queue[0].participantName}
                  </div>
                  {queue[0].titleOrAct && (
                    <div className="text-xs text-neutral-400 font-outfit">
                      &ldquo;{queue[0].titleOrAct}&rdquo;
                    </div>
                  )}
                </div>
              </div>
              <button
                type="button"
                onClick={handleNextPerformer}
                className="px-4 py-2 rounded-xl bg-amber-500 hover:bg-amber-400 text-black font-bold font-space text-xs transition shadow-md shadow-amber-500/20 active:scale-95 cursor-pointer"
              >
                Call to Stage &rarr;
              </button>
            </div>
          )}

          {/* Host Fast Tool Tabs (Interactive / Competition Rubric / Broadcast / Notes) */}
          <div className="rounded-3xl bg-[#070b16] border border-white/10 p-6 space-y-4">
            <div className="flex items-center justify-between border-b border-white/10 pb-3">
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => setActiveTab('interactive')}
                  className={`px-3 py-1.5 rounded-xl text-xs font-bold transition flex items-center gap-1.5 ${
                    activeTab === 'interactive'
                      ? 'bg-amber-500 text-black shadow'
                      : 'text-neutral-400 hover:text-white'
                  }`}
                >
                  <BarChart2 className="w-3.5 h-3.5" />
                  <span>Polls &amp; Alerts</span>
                  {!daisSettings.enableVoting && (
                    <span className="px-1.5 py-0.5 rounded bg-red-500/20 border border-red-500/40 text-red-300 text-[9px] font-mono font-bold flex items-center gap-0.5">
                      <Lock className="w-2.5 h-2.5" />
                      Off
                    </span>
                  )}
                </button>

                {daisSettings.enableScoring && (
                  <button
                    type="button"
                    onClick={() => setActiveTab('scoring')}
                    className={`px-3 py-1.5 rounded-xl text-xs font-bold transition flex items-center gap-1.5 ${
                      activeTab === 'scoring'
                        ? 'bg-amber-500 text-black shadow'
                        : 'text-neutral-400 hover:text-white'
                    }`}
                  >
                    <Trophy className="w-3.5 h-3.5" />
                    <span>Judge Rubric</span>
                  </button>
                )}

                {daisSettings.enableHostNotes && (
                  <button
                    type="button"
                    onClick={() => setActiveTab('notes')}
                    className={`px-3 py-1.5 rounded-xl text-xs font-bold transition flex items-center gap-1.5 ${
                      activeTab === 'notes'
                        ? 'bg-amber-500 text-black shadow'
                        : 'text-neutral-400 hover:text-white'
                    }`}
                  >
                    <BookOpen className="w-3.5 h-3.5" />
                    <span>Host Stage Notes</span>
                  </button>
                )}
              </div>

              {/* Applause Meter Indicator */}
              {daisSettings.enableApplauseMeter && (
                <div className="hidden sm:flex items-center gap-2">
                  <span className="text-[10px] font-mono text-neutral-400">ENERGY METER</span>
                  <div className="w-24 h-2 bg-white/10 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-gradient-to-r from-amber-400 to-red-500 transition-all duration-300"
                      style={{ width: `${applauseMeter}%` }}
                    />
                  </div>
                </div>
              )}
            </div>

            {/* Tab: Interactive Polls & Alerts */}
            {activeTab === 'interactive' && (
              <div className="space-y-4">
                {/* Instant Lower-Third Broadcast Alert */}
                {daisSettings.enableStageBroadcast && (
                  <div className="flex items-center gap-2">
                    <input
                      type="text"
                      value={announcementText}
                      onChange={(e) => setAnnouncementText(e.target.value)}
                      placeholder="Type an announcement to broadcast across stage displays & attendee phones..."
                      className="flex-1 bg-black/50 border border-white/15 rounded-xl px-4 py-2 text-xs text-white placeholder-neutral-500 focus:outline-none focus:border-amber-400"
                    />
                    <button
                      type="button"
                      onClick={() => {
                        if (announcementText.trim()) {
                          setIsBroadcastBannerActive(true);
                        }
                      }}
                      className="px-4 py-2 rounded-xl bg-amber-500 hover:bg-amber-400 text-black font-bold text-xs uppercase tracking-wider transition shrink-0"
                    >
                      Broadcast Alert
                    </button>
                  </div>
                )}

                {/* Voting State: Allowed vs Not Allowed */}
                {!daisSettings.enableVoting ? (
                  <div className="p-5 rounded-2xl bg-red-950/20 border border-red-500/30 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-xl bg-red-500/20 border border-red-500/40 flex items-center justify-center text-red-400 shrink-0">
                        <Lock className="w-5 h-5" />
                      </div>
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="text-xs font-black uppercase text-red-400 tracking-wider">
                            Voting is Not Allowed
                          </span>
                          <span className="px-2 py-0.5 rounded text-[9px] font-mono font-bold bg-red-500/20 text-red-300 border border-red-500/40 uppercase">
                            FULLY DISABLED
                          </span>
                        </div>
                        <p className="text-xs text-neutral-400 mt-0.5 leading-relaxed">
                          Audience voting, motions, and rapid polls are strictly turned off for this session. Participants cannot cast votes.
                        </p>
                      </div>
                    </div>
                    <button
                      type="button"
                      onClick={() => setDaisSettings((prev) => ({ ...prev, enableVoting: true }))}
                      className="px-4 py-2 rounded-xl bg-red-500/20 hover:bg-red-500/30 border border-red-400/40 text-red-300 text-xs font-bold transition whitespace-nowrap cursor-pointer"
                    >
                      Unlock &amp; Allow Voting
                    </button>
                  </div>
                ) : (
                  <>
                    {/* Instant Rapid Poll Launcher */}
                    <div className="pt-2 flex items-center justify-between">
                      <div className="text-xs text-neutral-400">
                        Want instant audience feedback? Launch a 2-option voting pulse.
                      </div>
                      <button
                        type="button"
                        onClick={() => setIsCreatePollOpen((prev) => !prev)}
                        className="px-3 py-1.5 rounded-xl bg-white/[0.05] border border-white/15 text-white hover:border-amber-400/50 text-xs font-bold transition flex items-center gap-1.5"
                      >
                        <Plus className="w-3.5 h-3.5" />
                        <span>Create Rapid Poll</span>
                      </button>
                    </div>

                    {/* Active Polls List */}
                    {polls.map((poll) => (
                      <div key={poll.id} className="p-4 rounded-2xl bg-white/[0.03] border border-white/10 space-y-3">
                        <div className="flex items-center justify-between">
                          <div className="text-xs font-bold text-white">{poll.question}</div>
                          <span className="text-[10px] font-mono text-emerald-400">OPEN ({poll.totalVotes} votes)</span>
                        </div>
                        <div className="grid grid-cols-2 gap-2">
                          {poll.options.map((opt) => (
                            <button
                              key={opt.id}
                              type="button"
                              onClick={() => {
                                setPolls((prev) =>
                                  prev.map((p) =>
                                    p.id === poll.id
                                      ? {
                                          ...p,
                                          totalVotes: p.totalVotes + 1,
                                          options: p.options.map((o) =>
                                            o.id === opt.id ? { ...o, voteCount: o.voteCount + 1 } : o
                                          ),
                                        }
                                      : p
                                  )
                                );
                              }}
                              className="p-2.5 rounded-xl bg-black/40 border border-white/10 hover:border-cyan-400/50 text-left transition flex items-center justify-between"
                            >
                              <span className="text-xs text-neutral-200">{opt.text}</span>
                              <span className="text-xs font-mono font-bold text-cyan-300">{opt.voteCount}</span>
                            </button>
                          ))}
                        </div>
                      </div>
                    ))}
                  </>
                )}

                {isCreatePollOpen && (
                  <div className="p-4 rounded-2xl bg-black/60 border border-amber-500/30 space-y-3">
                    <input
                      type="text"
                      value={newPollQuestion}
                      onChange={(e) => setNewPollQuestion(e.target.value)}
                      placeholder="Enter poll question (e.g. Should we do an encore?)"
                      className="w-full bg-white/[0.05] border border-white/15 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-amber-400"
                    />
                    <div className="grid grid-cols-2 gap-2">
                      <input
                        type="text"
                        value={newPollOptionA}
                        onChange={(e) => setNewPollOptionA(e.target.value)}
                        placeholder="Option A"
                        className="bg-white/[0.05] border border-white/15 rounded-xl px-3 py-1.5 text-xs text-white"
                      />
                      <input
                        type="text"
                        value={newPollOptionB}
                        onChange={(e) => setNewPollOptionB(e.target.value)}
                        placeholder="Option B"
                        className="bg-white/[0.05] border border-white/15 rounded-xl px-3 py-1.5 text-xs text-white"
                      />
                    </div>
                    <div className="flex justify-end gap-2">
                      <button
                        type="button"
                        onClick={() => setIsCreatePollOpen(false)}
                        className="px-3 py-1.5 rounded-xl text-neutral-400 text-xs"
                      >
                        Cancel
                      </button>
                      <button
                        type="button"
                        onClick={() => {
                          if (newPollQuestion.trim()) {
                            setPolls((prev) => [
                              ...prev,
                              {
                                id: `poll-${Date.now()}`,
                                question: newPollQuestion.trim(),
                                options: [
                                  { id: 'opt-a', text: newPollOptionA || 'Yes', voteCount: 0 },
                                  { id: 'opt-b', text: newPollOptionB || 'No', voteCount: 0 },
                                ],
                                status: 'open',
                                isAnonymous: true,
                                isMultiSelect: false,
                                totalVotes: 0,
                                createdAt: new Date().toISOString(),
                              },
                            ]);
                            setNewPollQuestion('');
                            setIsCreatePollOpen(false);
                          }
                        }}
                        className="px-4 py-1.5 rounded-xl bg-amber-500 text-black text-xs font-bold"
                      >
                        Publish Poll
                      </button>
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* Tab: Competition Judging Rubric */}
            {activeTab === 'scoring' && (
              <div className="space-y-4">
                <div className="text-xs text-neutral-400">
                  Rate the active performer ({activeQueueItem?.participantName || 'Active Speaker'}) across evaluation categories:
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  {Object.entries(rubricScores).map(([category, score]) => (
                    <div key={category} className="p-3.5 rounded-2xl bg-white/[0.03] border border-white/10 space-y-2">
                      <div className="flex items-center justify-between text-xs font-bold text-white">
                        <span>{category}</span>
                        <span className="font-mono text-amber-400 text-sm">{score}/10</span>
                      </div>
                      <input
                        type="range"
                        min="1"
                        max="10"
                        value={score}
                        onChange={(e) =>
                          setRubricScores((prev) => ({
                            ...prev,
                            [category]: parseInt(e.target.value, 10),
                          }))
                        }
                        className="w-full accent-amber-400 cursor-pointer"
                      />
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Tab: Host Stage Notes */}
            {activeTab === 'notes' && (
              <div>
                <textarea
                  value={stageNotes}
                  onChange={(e) => setStageNotes(e.target.value)}
                  placeholder="Private MC notes, performer announcements, punchlines, feedback, or sponsor mentions..."
                  rows={4}
                  className="w-full bg-black/50 border border-white/15 rounded-2xl p-4 text-xs text-white placeholder-neutral-500 focus:outline-none focus:border-amber-400 resize-none font-mono"
                />
              </div>
            )}
          </div>
        </main>

        {/* ── RIGHT COLUMN: STAGE QUEUE & LINEUP (4 Cols) ── */}
        {daisSettings.showQueue && (
          <aside className="lg:col-span-4 rounded-3xl bg-[#050814]/90 border border-white/[0.08] shadow-[0_15px_50px_rgba(0,0,0,0.6)] p-6 flex flex-col space-y-6 backdrop-blur-xl">
            <div className="flex items-center justify-between border-b border-white/[0.08] pb-4">
              <div>
                <div className="text-[10px] font-mono font-bold tracking-[0.2em] text-amber-400 uppercase">
                  {format === 'open_mic' ? 'PERFORMER LINEUP' : 'STAGE QUEUE'}
                </div>
                <h3 className="text-lg font-black font-space text-white">
                  Queue ({queue.length})
                </h3>
              </div>

              <button
                type="button"
                onClick={() => setIsAddPerformerOpen((prev) => !prev)}
                className="px-3.5 py-1.5 rounded-xl bg-gradient-to-r from-amber-500 to-amber-400 hover:brightness-110 text-black font-black font-space text-xs uppercase tracking-wider transition flex items-center gap-1.5 shadow-[0_0_15px_rgba(245,158,11,0.3)] active:scale-95 cursor-pointer"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Add Performer</span>
              </button>
            </div>

            {/* Quick Inline Add Form */}
            {isAddPerformerOpen && (
              <form onSubmit={handleAddPerformer} className="p-4 rounded-2xl bg-black/70 border border-amber-500/30 space-y-3 shadow-lg">
                <div className="text-xs font-bold font-space text-amber-300">
                  Add Act to {formatPreset.name}
                </div>
                <input
                  type="text"
                  value={newPerformerName}
                  onChange={(e) => setNewPerformerName(e.target.value)}
                  placeholder="Performer / Speaker name..."
                  required
                  className="w-full bg-white/[0.05] border border-white/15 rounded-xl px-3 py-2 text-xs text-white placeholder-neutral-500 focus:outline-none focus:border-amber-400 font-outfit"
                />
                <input
                  type="text"
                  value={newPerformerAct}
                  onChange={(e) => setNewPerformerAct(e.target.value)}
                  placeholder="Act / Piece title (e.g. Acoustic Set, Standup)..."
                  className="w-full bg-white/[0.05] border border-white/15 rounded-xl px-3 py-2 text-xs text-white placeholder-neutral-500 focus:outline-none focus:border-amber-400 font-outfit"
                />
                <div className="flex items-center gap-2">
                  <span className="text-[10px] text-neutral-400 font-mono">Slot (mins):</span>
                  <input
                    type="number"
                    min="1"
                    max="60"
                    value={newPerformerMinutes}
                    onChange={(e) => setNewPerformerMinutes(e.target.value)}
                    className="w-16 bg-white/[0.05] border border-white/15 rounded-xl px-2 py-1 text-xs text-white text-center font-mono font-bold"
                  />
                  <button
                    type="submit"
                    className="flex-1 py-1.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-black font-bold font-space text-xs transition cursor-pointer"
                  >
                    Push to Lineup
                  </button>
                </div>
              </form>
            )}

            {/* Lineup List */}
            <div className="flex-1 overflow-y-auto space-y-2 max-h-[480px] pr-1">
              {queue.length === 0 ? (
                <div className="py-12 px-4 rounded-2xl border border-dashed border-white/10 text-center space-y-3">
                  <Users className="w-8 h-8 text-neutral-600 mx-auto" />
                  <div className="text-xs text-neutral-400 leading-relaxed font-outfit">
                    Lineup is currently empty.
                  </div>
                  <button
                    type="button"
                    onClick={() => setIsAddPerformerOpen(true)}
                    className="text-xs font-bold font-space text-amber-400 hover:text-amber-300 underline cursor-pointer"
                  >
                    + Add First Performer
                  </button>
                </div>
              ) : (
                queue.map((item, idx) => (
                  <div
                    key={item.id}
                    className="p-3.5 rounded-2xl bg-white/[0.02] border border-white/[0.08] hover:border-amber-400/40 hover:bg-white/[0.04] transition-all flex items-center justify-between gap-3 group backdrop-blur-md"
                  >
                    <div className="flex items-center gap-2.5 min-w-0">
                      <span className="w-6 h-6 rounded-lg bg-white/5 border border-white/10 font-mono text-[10px] flex items-center justify-center text-amber-400 font-bold shrink-0">
                        #{idx + 1}
                      </span>
                      <div className="min-w-0">
                        <div className="text-xs font-bold font-space text-white truncate">
                          {item.participantName}
                        </div>
                        <div className="text-[10px] text-neutral-400 truncate flex items-center gap-1.5 font-mono">
                          {item.titleOrAct && <span className="font-outfit text-neutral-300">{item.titleOrAct} &bull;</span>}
                          <span className="tabular-nums">{formatTimeMinutesSeconds(item.slotDurationSeconds)}</span>
                        </div>
                      </div>
                    </div>

                    {/* Queue Control Buttons */}
                    <div className="flex items-center gap-1 shrink-0 opacity-80 group-hover:opacity-100 transition">
                      <button
                        type="button"
                        onClick={() => handlePutOnStage(item)}
                        className="px-2.5 py-1 rounded-lg bg-amber-500/20 hover:bg-amber-500 text-amber-300 hover:text-black text-[10px] font-bold font-space transition cursor-pointer border border-amber-500/30"
                        title="Put on Stage Now"
                      >
                        Stage
                      </button>
                      <button
                        type="button"
                        onClick={() => handleMoveQueue(idx, 'up')}
                        disabled={idx === 0}
                        className="p-1 text-neutral-400 hover:text-white disabled:opacity-20"
                      >
                        <ChevronUp className="w-3.5 h-3.5" />
                      </button>
                      <button
                        type="button"
                        onClick={() => handleMoveQueue(idx, 'down')}
                        disabled={idx === queue.length - 1}
                        className="p-1 text-neutral-400 hover:text-white disabled:opacity-20"
                      >
                        <ChevronDown className="w-3.5 h-3.5" />
                      </button>
                      <button
                        type="button"
                        onClick={() => handleRemoveFromQueue(item.id)}
                        className="p-1 text-neutral-500 hover:text-red-400"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                ))
              )}
            </div>

            {/* Completed Acts Drawer Preview */}
            {daisSettings.showCompletedActs && completedQueue.length > 0 && (
              <div className="border-t border-white/10 pt-4 space-y-2">
                <div className="text-[10px] font-mono text-neutral-400 uppercase">
                  COMPLETED ACTS ({completedQueue.length})
                </div>
                <div className="max-h-28 overflow-y-auto space-y-1.5">
                  {completedQueue.map((item) => (
                    <div
                      key={item.id}
                      className="flex items-center justify-between text-xs text-neutral-400 px-2 py-1 rounded-lg bg-white/[0.02]"
                    >
                      <span className="truncate">{item.participantName}</span>
                      <span className="font-mono text-[10px] text-emerald-400 shrink-0">
                        {formatTimeMinutesSeconds(item.timeSpokenSeconds)}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </aside>
        )}
      </div>

      {/* ── 4. FOOTER TELEMETRY & HOTKEY CHEATSHEET ─────────────────────────── */}
      <footer className="border-t border-white/10 bg-[#04060d] px-6 py-3 text-[10px] font-mono text-neutral-400 flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <span>HOTKEYS:</span>
          <span><kbd className="px-1.5 py-0.5 rounded bg-white/10 text-white font-bold">Space</kbd> Start/Pause</span>
          <span><kbd className="px-1.5 py-0.5 rounded bg-white/10 text-white font-bold">N</kbd> Next Act</span>
          <span><kbd className="px-1.5 py-0.5 rounded bg-white/10 text-white font-bold">R</kbd> Reset</span>
          <span><kbd className="px-1.5 py-0.5 rounded bg-white/10 text-white font-bold">D</kbd> Bell</span>
          <span><kbd className="px-1.5 py-0.5 rounded bg-white/10 text-white font-bold">B</kbd> Buzzer</span>
          <span><kbd className="px-1.5 py-0.5 rounded bg-white/10 text-white font-bold">A</kbd> Applause</span>
        </div>

        <div className="flex items-center gap-2">
          <span>ZENVITRA LIVE ENGINE</span>
          <span>&bull;</span>
          <span className="text-amber-400">{formatPreset.badge}</span>
        </div>
      </footer>

      {/* ── 5. MODULAR TOGGLES & CUSTOM BUILDER MODAL ───────────────────────── */}
      <CustomEventBuilderModal
        isOpen={isCustomConfigModalOpen}
        onClose={() => setIsCustomConfigModalOpen(false)}
        initialConfig={customConfig}
        onLaunch={(newCfg) => {
          setCustomConfig(newCfg);
          setTitle(newCfg.eventName);
          setSpeakerDuration(newCfg.speakerTimerSeconds);
          setRemainingSeconds(newCfg.speakerTimerSeconds);
          setSoundEnabled(newCfg.enableAudioChimes);
          setDaisSettings((prev) => ({
            ...prev,
            showQueue: newCfg.enableQueue,
            showOnDeck: newCfg.enableOnDeckCallout,
            enableVoting: newCfg.enableRapidPolls,
            enableStageBroadcast: newCfg.enableStageBroadcasts,
            enableApplauseMeter: newCfg.enableApplauseMeter,
            enableSounds: newCfg.enableAudioChimes,
            strictCutoff: newCfg.strictCutoff,
            enableScoring: newCfg.enableScoringRubric,
          }));
          if (newCfg.rubricCriteria?.length) {
            const rubricMap: { [k: string]: number } = {};
            newCfg.rubricCriteria.forEach((c) => {
              rubricMap[c.name] = 8;
            });
            setRubricScores(rubricMap);
          }
          setIsCustomConfigModalOpen(false);
        }}
      />

      {/* ── 6. LIVE FEATURE TOGGLES SETTINGS MODAL ──────────────────────────── */}
      <DaisSettingsModal
        isOpen={isSettingsModalOpen}
        onClose={() => setIsSettingsModalOpen(false)}
        settings={daisSettings}
        onUpdateSettings={setDaisSettings}
        onResetDefaults={() =>
          setDaisSettings({
            showQueue: true,
            showOnDeck: true,
            showCompletedActs: true,
            showSessionClock: true,
            enableVoting: true,
            showLiveVoteCount: true,
            enableApplauseMeter: true,
            enableStageBroadcast: true,
            enableHostNotes: true,
            enableSounds: true,
            enableWarningBell: true,
            enableBuzzer: true,
            enableCheerSound: true,
            enableTimer: true,
            strictCutoff: false,
            enableScoring: format === 'competition',
          })
        }
      />
    </div>
  );
}
