'use client';

import React, { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import {
  Gavel,
  Clock,
  Users,
  Hand,
  Volume2,
  VolumeX,
  Radio,
  FileText,
  Vote,
  Sparkles,
  ArrowRight,
  ShieldCheck,
  Building2,
  Globe2,
  Send,
  Plus,
  X,
  Check,
  ChevronRight,
  Search,
  MessageSquare,
  BookOpen,
  Award,
  Layers,
  HelpCircle,
  Settings,
  Scale,
  Mic,
  MicOff,
  UserCheck,
  AlignLeft,
  Calendar,
  Share2,
  Lock,
  Eye,
  Edit3,
} from 'lucide-react';
import { daisAudio } from '@/lib/daisAudio';
import { DiasRealtimeManager, DiasConnectionStatus } from '@/lib/mun/diasRealtime';
import { DiasButton } from './DiasButton';
import { DiasBadge } from './DiasBadge';
import { DiasCard } from './DiasCard';

export type DelegateNavSection =
  | 'OVERVIEW'
  | 'LIVE_FLOOR'
  | 'MOTIONS'
  | 'DOCUMENTS'
  | 'AMENDMENTS'
  | 'VOTING'
  | 'CHAT'
  | 'PEOPLE'
  | 'PROFILE'
  | 'RESEARCH'
  | 'SPEECH_PREP'
  | 'PERFORMANCE'
  | 'RULES';

export interface DelegateWorkspaceProps {
  sessionCode?: string;
  committeeName?: string;
  committeeAcronym?: string;
  topic?: string;
  isIndianCommittee?: boolean;
  onSwitchToChair?: () => void;
}

export const DelegateWorkspace: React.FC<DelegateWorkspaceProps> = ({
  sessionCode = 'IF8RV5',
  committeeName = 'Lok Sabha • Parliament of India',
  committeeAcronym = 'LOK SABHA',
  topic = 'Delimitation of Constituencies, Federalism & Democratic Governance',
  isIndianCommittee = true,
  onSwitchToChair,
}) => {
  // ─── Realtime Manager & Connection ───
  const [connectionStatus, setConnectionStatus] = useState<DiasConnectionStatus>('CONNECTING');
  const realtimeRef = useRef<DiasRealtimeManager | null>(null);

  // ─── Sound State ───
  const [soundEnabled, setSoundEnabled] = useState(true);

  // ─── Active Navigation Section ───
  const [activeSection, setActiveSection] = useState<DelegateNavSection>('OVERVIEW');

  // ─── Synchronized Live Floor State ───
  const [durationSec, setDurationSec] = useState(90);
  const [remainingSec, setRemainingSec] = useState(90);
  const [isTimerRunning, setIsTimerRunning] = useState(false);
  const [activeMode, setActiveMode] = useState<string>(
    isIndianCommittee ? 'PARLIAMENT_BILLS' : 'MOD_CAUCUS'
  );

  // ─── Assigned Delegate Identity ───
  const myDelegation = isIndianCommittee
    ? {
        seat: 'Member for Wayanad',
        constituency: 'Wayanad (Kerala)',
        bench: 'Opposition Bench',
        delegateName: 'Hon. Member of Parliament',
        flag: '🇮🇳',
        code: 'KL',
      }
    : {
        seat: 'Delegation of Germany',
        constituency: 'Federal Republic of Germany',
        bench: 'Western European & Others Group',
        delegateName: 'Permanent Representative',
        flag: '🇩🇪',
        code: 'DE',
      };

  // ─── Floor Recognized Speaker ───
  const [currentSpeaker, setCurrentSpeaker] = useState<{
    country: string;
    flag: string;
    name: string;
    subtext?: string;
  }>(() =>
    isIndianCommittee
      ? {
          country: 'Treasury Bench',
          flag: '🇮🇳',
          name: 'Hon. Minister of External Affairs',
          subtext: 'Clause 4 Amendment: Maritime Economic Corridors Bill, 2026',
        }
      : {
          country: 'United States',
          flag: '🇺🇸',
          name: 'Hon. Ambassador to the United Nations',
          subtext: 'General Speakers List • Agenda LAWS-01',
        }
  );

  // ─── Live Speaking Queue ───
  const [queue, setQueue] = useState<any[]>(() =>
    isIndianCommittee
      ? [
          {
            id: 'q_1',
            country: 'Opposition Bench',
            name: 'Leader of Opposition (INC)',
            flag: '🇮🇳',
            code: 'OP',
            position: 1,
            timeSec: 90,
          },
          {
            id: 'q_2',
            country: 'Member for Varanasi',
            name: 'Hon. Member for Varanasi (UP)',
            flag: '🇮🇳',
            code: 'UP',
            position: 2,
            timeSec: 90,
          },
          {
            id: 'q_3',
            country: 'Member for Wayanad',
            name: 'Hon. Member for Wayanad (KL)',
            flag: '🇮🇳',
            code: 'KL',
            position: 3,
            timeSec: 90,
          },
          {
            id: 'q_4',
            country: 'Minister of Finance',
            name: 'Hon. Minister of Finance',
            flag: '🇮🇳',
            code: 'FM',
            position: 4,
            timeSec: 90,
          },
        ]
      : [
          {
            id: 'q_1',
            country: 'United Kingdom',
            name: 'Permanent Representative',
            flag: '🇬🇧',
            code: 'GB',
            position: 1,
            timeSec: 90,
          },
          {
            id: 'q_2',
            country: 'France',
            name: 'Permanent Representative',
            flag: '🇫🇷',
            code: 'FR',
            position: 2,
            timeSec: 90,
          },
          {
            id: 'q_3',
            country: 'Japan',
            name: 'Permanent Representative',
            flag: '🇯🇵',
            code: 'JP',
            position: 3,
            timeSec: 90,
          },
        ]
  );

  const isInQueue = queue.some((item) => item.country === myDelegation.seat);
  const myQueuePosition = queue.findIndex((item) => item.country === myDelegation.seat) + 1;

  // ─── Realtime Subscriptions ───
  useEffect(() => {
    const manager = new DiasRealtimeManager(sessionCode, {
      onStatusChange: (status) => setConnectionStatus(status),
      onTimerSync: (payload) => {
        setDurationSec(payload.durationSec);
        setRemainingSec(payload.remainingSec);
        setIsTimerRunning(payload.isRunning);
      },
      onQueueSync: (newQueue) => {
        if (Array.isArray(newQueue)) setQueue(newQueue);
      },
      onSpeakerSync: (speaker) => {
        if (speaker) setCurrentSpeaker(speaker);
      },
      onModeSync: (mode) => {
        if (mode) setActiveMode(mode);
      },
      onGavelStrike: () => {
        if (soundEnabled) {
          daisAudio.playGavelStrike();
        }
      },
      onChatSync: (msg) => {
        setChatMessages((prev) => [...prev, msg]);
      },
    });

    realtimeRef.current = manager;

    return () => {
      manager.destroy();
    };
  }, [sessionCode, soundEnabled]);

  // Local timer tick fallback if running
  useEffect(() => {
    if (!isTimerRunning) return;
    const interval = setInterval(() => {
      setRemainingSec((prev) => {
        if (prev <= 1) {
          if (soundEnabled) daisAudio.playTimeExpired();
          return 0;
        }
        if (prev === 11 && soundEnabled) {
          daisAudio.playWarningBell();
        }
        return prev - 1;
      });
    }, 1000);
    return () => clearInterval(interval);
  }, [isTimerRunning, soundEnabled]);

  // ─── Queue Actions ───
  const handleToggleQueue = () => {
    if (isInQueue) {
      const updated = queue.filter((item) => item.country !== myDelegation.seat);
      setQueue(updated);
      realtimeRef.current?.broadcastQueue(updated);
    } else {
      const newItem = {
        id: `q_${Date.now()}`,
        country: myDelegation.seat,
        name: myDelegation.delegateName,
        flag: myDelegation.flag,
        code: myDelegation.code,
        position: queue.length + 1,
        timeSec: durationSec,
      };
      const updated = [...queue, newItem];
      setQueue(updated);
      realtimeRef.current?.broadcastQueue(updated);
    }
  };

  const handleRequestFloor = () => {
    realtimeRef.current?.broadcastFloorRequest({
      delegation: myDelegation.seat,
      timestamp: Date.now(),
    });
    alert(`Floor recognition requested for ${myDelegation.seat}. The Chair has been notified.`);
  };

  // ─── Raise a Motion Modal State ───
  const [isMotionModalOpen, setIsMotionModalOpen] = useState(false);
  const [motionType, setMotionType] = useState(
    isIndianCommittee ? 'Calling Attention Notice (Rule 197)' : 'Moderated Caucus'
  );
  const [motionTopic, setMotionTopic] = useState('');
  const [motionTotalTime, setMotionTotalTime] = useState('15');
  const [motionSpeakingTime, setMotionSpeakingTime] = useState('60');

  const [motionsList, setMotionsList] = useState<any[]>(() =>
    isIndianCommittee
      ? [
          {
            id: 'm_1',
            type: 'Calling Attention Notice (Rule 197)',
            topic: 'Maritime Economic Corridors & Coastal Security',
            proposedBy: 'Opposition Bench • Member for Baramati',
            totalTimeMin: 15,
            speakerTimeSec: 90,
            status: 'PENDING_CHAIR_REVIEW',
          },
          {
            id: 'm_2',
            type: 'Division Vote on Clause 4',
            topic: 'Incorporation of Federal Fiscal Guarantee',
            proposedBy: 'Treasury Bench • Chief Whip',
            totalTimeMin: 10,
            speakerTimeSec: 60,
            status: 'ACCEPTED_FOR_VOTE',
          },
        ]
      : [
          {
            id: 'm_1',
            type: 'Moderated Caucus',
            topic: 'Autonomous Weapons Verification Protocols',
            proposedBy: 'Delegation of United Kingdom',
            totalTimeMin: 15,
            speakerTimeSec: 60,
            status: 'PENDING_CHAIR_REVIEW',
          },
        ]
  );

  const handleSubmitMotion = (e: React.FormEvent) => {
    e.preventDefault();
    if (!motionTopic.trim()) return;

    const newMotion = {
      id: `mot_${Date.now()}`,
      type: motionType,
      topic: motionTopic.trim(),
      proposedBy: myDelegation.seat,
      totalTimeMin: parseInt(motionTotalTime, 10) || 15,
      speakerTimeSec: parseInt(motionSpeakingTime, 10) || 60,
      status: 'PENDING_CHAIR_REVIEW',
    };

    const updated = [newMotion, ...motionsList];
    setMotionsList(updated);
    realtimeRef.current?.broadcastMotion(updated);
    setIsMotionModalOpen(false);
    setMotionTopic('');
  };

  // ─── Active Voting Engine State ───
  const [activeBallot, setActiveBallot] = useState<{
    id: string;
    title: string;
    type: string;
    isOpen: boolean;
    myVote: 'FOR' | 'AGAINST' | 'ABSTAIN' | null;
  }>({
    id: 'ballot_1',
    title: isIndianCommittee
      ? 'Clause 4 Amendment: Maritime Economic Corridors Bill, 2026'
      : 'Draft Resolution 1.1: Verification Mechanism on Lethal Autonomous Weapons',
    type: isIndianCommittee ? 'Division Vote (Recorded Bell)' : 'Substantive Resolution Ballot',
    isOpen: true,
    myVote: null,
  });

  const handleCastVote = (vote: 'FOR' | 'AGAINST' | 'ABSTAIN') => {
    setActiveBallot((prev) => ({ ...prev, myVote: vote }));
    realtimeRef.current?.broadcastBallot({
      ballotId: activeBallot.id,
      delegation: myDelegation.seat,
      vote,
    });
  };

  // ─── Chat System State ───
  const [chatChannel, setChatChannel] = useState<'FLOOR' | 'CHAIR' | 'DIRECT'>('FLOOR');
  const [chatInput, setChatInput] = useState('');
  const [chatMessages, setChatMessages] = useState<any[]>([
    {
      id: 'c_1',
      sender: 'DIAS Secretariat',
      role: 'CHAIR',
      text: 'Session officially in order. Quorum confirmed with 48 voting members.',
      timestamp: '11:00 AM',
    },
    {
      id: 'c_2',
      sender: isIndianCommittee ? 'Treasury Bench' : 'United States',
      role: 'DELEGATE',
      text: isIndianCommittee
        ? 'Hon. Speaker, the Treasury is prepared to table the fiscal impact schedule.'
        : 'The Delegation of the United States seconds the motion for moderated caucus.',
      timestamp: '11:04 AM',
    },
  ]);

  const handleSendChat = (e: React.FormEvent) => {
    e.preventDefault();
    if (!chatInput.trim()) return;

    const newMsg = {
      id: `msg_${Date.now()}`,
      sender: myDelegation.seat,
      role: 'DELEGATE',
      text: chatInput.trim(),
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };

    setChatMessages((prev) => [...prev, newMsg]);
    realtimeRef.current?.broadcastChat(newMsg);
    setChatInput('');
  };

  // ─── Speech Preparation & Word Count Estimator ───
  const [speechText, setSpeechText] = useState(
    isIndianCommittee
      ? 'Honourable Speaker Sir, I rise to address the critical clause concerning the delimitation metrics. The federal guarantees enshrined in the Seventh Schedule must not be abrogated under the guise of fiscal centralization...'
      : 'Distinguished Presiding Officer, sovereign delegates, the rapid proliferation of autonomous battlefield systems necessitates a verifiable, multi-lateral non-proliferation regime...'
  );
  const [targetSpeechSeconds, setTargetSpeechSeconds] = useState(90);

  const wordCount = speechText.trim().split(/\s+/).filter(Boolean).length;
  // Standard diplomatic speaking cadence is approximately 130 words per minute (2.16 words/sec)
  const estimatedSeconds = Math.round((wordCount / 130) * 60);

  // ─── Research Notes State ───
  const [researchNotes, setResearchNotes] = useState<string>(
    'Key citations: Article 280 (Finance Commission), 15th FC Population Metrics, Coastal Security Bill 2024.'
  );

  const formatClock = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <div className="h-screen w-screen bg-[#08090B] text-[#F4F2ED] flex flex-col overflow-hidden font-sans select-none antialiased">
      {/* ── TOP STATUS BAR ── */}
      <header className="h-14 bg-[#0D0F14] border-b border-[#181B21] px-4 sm:px-6 flex items-center justify-between shrink-0 z-30">
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2">
            <span
              className={`w-2 h-2 rounded-full ${
                connectionStatus === 'CONNECTED'
                  ? 'bg-emerald-400 animate-pulse'
                  : 'bg-amber-400'
              }`}
            />
            <span className="text-[10px] font-mono tracking-widest uppercase text-[#9A9DA5] font-bold hidden sm:inline">
              DELEGATE COMMAND CENTRE • {connectionStatus}
            </span>
          </div>
          <span className="text-[#2B2F37] hidden sm:inline">•</span>
          <div className="flex items-center gap-2">
            <span className="text-xs font-semibold text-[#F4F2ED] tracking-wide">{committeeAcronym}</span>
            <DiasBadge variant={isIndianCommittee ? 'gold' : 'charcoal'} size="sm">
              {myDelegation.seat}
            </DiasBadge>
          </div>
        </div>

        <div className="flex items-center gap-2 sm:gap-3">
          {/* Audio Synthesizer Toggle */}
          <button
            onClick={() => {
              daisAudio.toggle();
              setSoundEnabled(daisAudio.isEnabled());
            }}
            className={`p-2 rounded-xl border transition-all text-xs flex items-center gap-1.5 ${
              soundEnabled
                ? 'bg-[#181B21] border-[#C5A46D]/40 text-[#E6D1A5]'
                : 'bg-[#111318] border-[#232731] text-[#575B66]'
            }`}
            title="Toggle procedural audio gavel"
          >
            {soundEnabled ? <Volume2 className="w-3.5 h-3.5" /> : <VolumeX className="w-3.5 h-3.5" />}
          </button>

          {/* Quick Role Switcher (Switch to Chair Console) */}
          {onSwitchToChair ? (
            <button
              onClick={onSwitchToChair}
              className="px-3 py-1.5 rounded-xl bg-[#C5A46D]/15 hover:bg-[#C5A46D]/25 border border-[#C5A46D]/40 text-[#E6D1A5] text-xs font-semibold transition-all flex items-center gap-1.5"
            >
              <Gavel className="w-3.5 h-3.5 text-[#C5A46D]" />
              <span className="hidden sm:inline">Switch to Chair Console</span>
            </button>
          ) : (
            <Link href={`/dias/${sessionCode}?role=chair`}>
              <button className="px-3 py-1.5 rounded-xl bg-[#C5A46D]/15 hover:bg-[#C5A46D]/25 border border-[#C5A46D]/40 text-[#E6D1A5] text-xs font-semibold transition-all flex items-center gap-1.5">
                <Gavel className="w-3.5 h-3.5 text-[#C5A46D]" />
                <span className="hidden sm:inline">Chair Console</span>
              </button>
            </Link>
          )}

          <Link href="/dias">
            <button className="p-2 rounded-xl bg-[#111318] border border-[#232731] text-[#9A9DA5] hover:text-[#F4F2ED] transition-colors">
              <X className="w-3.5 h-3.5" />
            </button>
          </Link>
        </div>
      </header>

      {/* ── MAIN WORKSPACE BODY ── */}
      <div className="flex-1 flex overflow-hidden">
        {/* ── LEFT NAVIGATION SIDEBAR (DELEGATE SECTIONS) ── */}
        <aside className="w-64 bg-[#0A0C0F] border-r border-[#181B21] flex flex-col justify-between shrink-0 hidden md:flex">
          {/* Navigation Links */}
          <div className="p-3 space-y-1 overflow-y-auto">
            <div className="px-3 py-2 text-[10px] font-mono tracking-widest text-[#575B66] uppercase">
              DELEGATE PORTAL
            </div>

            {[
              { id: 'OVERVIEW', label: 'Summit Overview', icon: Sparkles },
              { id: 'LIVE_FLOOR', label: 'Live Floor & Stage', icon: Radio },
              { id: 'MOTIONS', label: 'Motions & Caucuses', icon: Scale },
              { id: 'DOCUMENTS', label: isIndianCommittee ? 'Bills & Amendments' : 'Resolutions & Papers', icon: FileText },
              { id: 'VOTING', label: 'Roll Call & Voting', icon: Vote },
              { id: 'CHAT', label: 'Diplomatic Mesh Chat', icon: MessageSquare },
              { id: 'SPEECH_PREP', label: 'Speech Preparation', icon: Mic },
              { id: 'RESEARCH', label: 'Research Desk', icon: BookOpen },
              { id: 'PEOPLE', label: 'People in Room', icon: Users },
              { id: 'PROFILE', label: 'Delegation Dossier', icon: Award },
              { id: 'RULES', label: 'Rules of Procedure', icon: HelpCircle },
            ].map((item) => {
              const Icon = item.icon;
              const isActive = activeSection === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => setActiveSection(item.id as DelegateNavSection)}
                  className={`w-full flex items-center justify-between px-3 py-2.5 rounded-xl text-xs font-medium transition-all ${
                    isActive
                      ? 'bg-[#C5A46D]/15 text-[#E6D1A5] border border-[#C5A46D]/30 font-semibold'
                      : 'text-[#9A9DA5] hover:text-[#F4F2ED] hover:bg-[#111318]'
                  }`}
                >
                  <div className="flex items-center gap-2.5">
                    <Icon className={`w-4 h-4 ${isActive ? 'text-[#C5A46D]' : 'text-[#575B66]'}`} />
                    <span>{item.label}</span>
                  </div>
                  {item.id === 'VOTING' && activeBallot.isOpen && !activeBallot.myVote && (
                    <span className="w-2 h-2 rounded-full bg-amber-400 animate-ping" />
                  )}
                </button>
              );
            })}
          </div>

          {/* User Portfolio Profile Footer */}
          <div className="p-3 border-t border-[#181B21] bg-[#0D0F14]">
            <div className="p-3 rounded-xl bg-[#111318] border border-[#232731] flex items-center gap-2.5 text-left">
              <span className="text-xl">{myDelegation.flag}</span>
              <div className="flex-1 min-w-0">
                <span className="text-xs font-semibold text-[#F4F2ED] block truncate">
                  {myDelegation.seat}
                </span>
                <span className="text-[10px] text-[#9A9DA5] block truncate">
                  {myDelegation.delegateName}
                </span>
              </div>
            </div>
          </div>
        </aside>

        {/* ── CENTER STAGE: DYNAMIC SECTION VIEWS ── */}
        <main className="flex-1 flex flex-col overflow-y-auto bg-[#08090B]">
          {activeSection === 'OVERVIEW' && (
            <div className="p-6 max-w-6xl mx-auto w-full space-y-6 text-left">
              {/* Welcome Banner */}
              <div className="p-6 rounded-2xl bg-gradient-to-r from-[#181B21] to-[#111318] border border-[#232731] flex flex-col md:flex-row md:items-center justify-between gap-6 shadow-xl">
                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    <DiasBadge variant="gold" size="sm">
                      SESSION ACTIVE
                    </DiasBadge>
                    <span className="text-xs font-mono text-[#9A9DA5]">Passcode: {sessionCode}</span>
                  </div>
                  <h1 className="text-2xl font-serif text-[#F4F2ED]">{committeeName}</h1>
                  <p className="text-xs text-[#9A9DA5] max-w-2xl">{topic}</p>
                </div>

                <div className="flex flex-wrap items-center gap-3">
                  <DiasButton
                    onClick={() => setActiveSection('LIVE_FLOOR')}
                    variant="gold"
                    size="sm"
                    rightIcon={<ArrowRight className="w-3.5 h-3.5" />}
                  >
                    Enter Live Floor
                  </DiasButton>
                  <DiasButton
                    onClick={() => setIsMotionModalOpen(true)}
                    variant="charcoal"
                    size="sm"
                    leftIcon={<Plus className="w-3.5 h-3.5" />}
                  >
                    Raise a Motion
                  </DiasButton>
                </div>
              </div>

              {/* Three Stat Cards */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <DiasCard variant="elevated" className="p-4 space-y-2">
                  <span className="text-[10px] font-mono uppercase text-[#9A9DA5]">My Floor Status</span>
                  <div className="text-base font-semibold text-[#F4F2ED] flex items-center gap-2">
                    {isInQueue ? (
                      <>
                        <span className="w-2 h-2 rounded-full bg-emerald-400" />
                        Queue Position #{myQueuePosition}
                      </>
                    ) : (
                      <>
                        <span className="w-2 h-2 rounded-full bg-neutral-500" />
                        Not in Queue
                      </>
                    )}
                  </div>
                  <p className="text-[11px] text-[#9A9DA5]">
                    {isInQueue ? 'Recognized in upcoming turn.' : 'Click to request floor recognition.'}
                  </p>
                </DiasCard>

                <DiasCard variant="elevated" className="p-4 space-y-2">
                  <span className="text-[10px] font-mono uppercase text-[#9A9DA5]">Active Ballot</span>
                  <div className="text-base font-semibold text-[#F4F2ED] flex items-center gap-2">
                    {activeBallot.isOpen ? (
                      activeBallot.myVote ? (
                        <span className="text-emerald-400 flex items-center gap-1 text-sm font-mono">
                          <Check className="w-3.5 h-3.5" /> Ballot Recorded: {activeBallot.myVote}
                        </span>
                      ) : (
                        <span className="text-amber-400 text-sm font-mono animate-pulse">
                          Awaiting My Vote
                        </span>
                      )
                    ) : (
                      <span className="text-[#575B66] text-sm">No Active Ballot</span>
                    )}
                  </div>
                  <p className="text-[11px] text-[#9A9DA5] line-clamp-1">{activeBallot.title}</p>
                </DiasCard>

                <DiasCard variant="elevated" className="p-4 space-y-2">
                  <span className="text-[10px] font-mono uppercase text-[#9A9DA5]">Committee Mode</span>
                  <div className="text-base font-semibold text-[#E6D1A5] font-mono">{activeMode}</div>
                  <p className="text-[11px] text-[#9A9DA5]">
                    {isTimerRunning ? 'Clock actively ticking' : 'Chamber currently suspended or paused'}
                  </p>
                </DiasCard>
              </div>

              {/* Synchronized Mini-Floor Preview */}
              <div className="p-6 rounded-2xl bg-[#111318] border border-[#232731] space-y-4">
                <div className="flex items-center justify-between pb-3 border-b border-[#181B21]">
                  <div className="flex items-center gap-2.5">
                    <Radio className="w-4 h-4 text-[#C5A46D] animate-pulse" />
                    <span className="text-xs font-semibold text-[#F4F2ED] uppercase tracking-wide">
                      Live Chamber Synchronization
                    </span>
                  </div>
                  <span className="text-xs font-mono text-[#C5A46D]">Clock: {formatClock(remainingSec)}</span>
                </div>

                <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-[#181B21] border border-[#2A2E39] flex items-center justify-center text-xl">
                      {currentSpeaker.flag}
                    </div>
                    <div>
                      <span className="text-[10px] font-mono uppercase text-[#C5A46D] font-bold block">
                        FLOOR RECOGNIZED
                      </span>
                      <h3 className="text-sm font-semibold text-[#F4F2ED]">{currentSpeaker.name}</h3>
                      <p className="text-xs text-[#9A9DA5]">{currentSpeaker.subtext}</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <DiasButton
                      onClick={handleToggleQueue}
                      variant={isInQueue ? 'charcoal' : 'gold'}
                      size="sm"
                    >
                      {isInQueue ? 'Leave Speakers Queue' : 'Join Speakers Queue'}
                    </DiasButton>
                    <DiasButton onClick={handleRequestFloor} variant="charcoal" size="sm">
                      Request Floor
                    </DiasButton>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* ── LIVE FLOOR VIEW (DELEGATE SYNCHRONIZED CLOCK) ── */}
          {activeSection === 'LIVE_FLOOR' && (
            <div className="flex-1 flex flex-col justify-between p-6 max-w-5xl mx-auto w-full text-left">
              {/* Floor Recognized Speaker */}
              <div className="p-6 rounded-2xl bg-[#111318] border border-[#232731] flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <div className="w-14 h-14 rounded-2xl bg-[#181B21] border border-[#2A2E39] flex items-center justify-center text-3xl shadow-inner">
                    {currentSpeaker.flag}
                  </div>
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-mono font-bold text-[#C5A46D] uppercase">
                        CURRENT SPEAKER
                      </span>
                      <DiasBadge variant="gold" size="sm">
                        {activeMode}
                      </DiasBadge>
                    </div>
                    <h2 className="text-xl font-semibold text-[#F4F2ED]">{currentSpeaker.name}</h2>
                    <p className="text-xs text-[#9A9DA5]">{currentSpeaker.subtext}</p>
                  </div>
                </div>

                <div className="text-right font-mono hidden sm:block">
                  <span className="text-xs text-[#575B66] block">Allocated Time</span>
                  <span className="text-sm text-[#E6D1A5]">{durationSec}s</span>
                </div>
              </div>

              {/* 64px Digital Clock */}
              <div className="py-12 text-center space-y-3">
                <div className="font-mono text-7xl sm:text-8xl font-bold tracking-tight text-[#F4F2ED]">
                  {formatClock(remainingSec)}
                </div>
                <p className="text-xs font-mono text-[#575B66] uppercase tracking-widest">
                  {isTimerRunning
                    ? '• SYNCHRONIZED TO CHAIR DAIS • 10S WARNING BELL ACTIVE'
                    : 'SPEECH PAUSED BY CHAIR'}
                </p>
              </div>

              {/* Delegate Floor Controls */}
              <div className="p-4 rounded-2xl bg-[#111318] border border-[#232731] flex flex-wrap items-center justify-between gap-4">
                <div className="flex items-center gap-3">
                  <DiasButton
                    onClick={handleToggleQueue}
                    variant={isInQueue ? 'charcoal' : 'gold'}
                    size="md"
                    leftIcon={<Users className="w-4 h-4" />}
                  >
                    {isInQueue ? `Leave Queue (#${myQueuePosition})` : 'Join Speakers Queue'}
                  </DiasButton>
                  <DiasButton
                    onClick={handleRequestFloor}
                    variant="charcoal"
                    size="md"
                    leftIcon={<Hand className="w-4 h-4" />}
                  >
                    Raise Hand / Request Floor
                  </DiasButton>
                </div>

                <div className="flex items-center gap-2">
                  <DiasButton
                    onClick={() => setIsMotionModalOpen(true)}
                    variant="charcoal"
                    size="md"
                    leftIcon={<Scale className="w-4 h-4" />}
                  >
                    Raise a Motion
                  </DiasButton>
                </div>
              </div>
            </div>
          )}

          {/* ── MOTIONS SECTION ── */}
          {activeSection === 'MOTIONS' && (
            <div className="p-6 max-w-5xl mx-auto w-full space-y-6 text-left">
              <div className="flex items-center justify-between pb-4 border-b border-[#181B21]">
                <div>
                  <h2 className="text-xl font-serif text-[#F4F2ED]">Motions & Procedural Caucuses</h2>
                  <p className="text-xs text-[#9A9DA5]">
                    Submit parliamentary motions directly for Chair review and chamber vote.
                  </p>
                </div>
                <DiasButton
                  onClick={() => setIsMotionModalOpen(true)}
                  variant="gold"
                  size="sm"
                  leftIcon={<Plus className="w-3.5 h-3.5" />}
                >
                  Raise New Motion
                </DiasButton>
              </div>

              <div className="space-y-3">
                {motionsList.map((m) => (
                  <div
                    key={m.id}
                    className="p-4 rounded-xl bg-[#111318] border border-[#232731] flex flex-col sm:flex-row sm:items-center justify-between gap-4"
                  >
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <DiasBadge variant="gold" size="sm">
                          {m.type}
                        </DiasBadge>
                        <span className="text-xs font-mono text-[#575B66]">
                          {m.totalTimeMin}m total • {m.speakerTimeSec}s/speaker
                        </span>
                      </div>
                      <h3 className="text-sm font-semibold text-[#F4F2ED]">{m.topic}</h3>
                      <p className="text-xs text-[#9A9DA5]">Proposed by: {m.proposedBy}</p>
                    </div>

                    <div>
                      <span className="text-[11px] font-mono px-2.5 py-1 rounded bg-[#181B21] border border-[#2B2F37] text-[#E6D1A5]">
                        {m.status.replace(/_/g, ' ')}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* ── VOTING & ROLL CALL ── */}
          {activeSection === 'VOTING' && (
            <div className="p-6 max-w-4xl mx-auto w-full space-y-6 text-left">
              <div className="pb-4 border-b border-[#181B21]">
                <h2 className="text-xl font-serif text-[#F4F2ED]">Roll Call & Substantive Voting</h2>
                <p className="text-xs text-[#9A9DA5]">
                  Cast recorded division ballots and procedural vote choices.
                </p>
              </div>

              {activeBallot.isOpen ? (
                <div className="p-6 rounded-2xl bg-[#111318] border border-[#C5A46D]/30 space-y-6 shadow-2xl">
                  <div className="space-y-2">
                    <div className="flex items-center gap-2">
                      <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
                      <span className="text-[10px] font-mono text-[#C5A46D] uppercase font-bold tracking-widest">
                        BALLOT OPEN ON FLOOR
                      </span>
                    </div>
                    <h3 className="text-lg font-semibold text-[#F4F2ED]">{activeBallot.title}</h3>
                    <p className="text-xs text-[#9A9DA5]">{activeBallot.type}</p>
                  </div>

                  {activeBallot.myVote ? (
                    <div className="p-4 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <Check className="w-4 h-4" />
                        <span className="text-xs font-semibold">
                          Your Vote Has Been Recorded on the Summit Ledger: {activeBallot.myVote}
                        </span>
                      </div>
                      <button
                        onClick={() => setActiveBallot((prev) => ({ ...prev, myVote: null }))}
                        className="text-[11px] underline text-[#9A9DA5] hover:text-white"
                      >
                        Change Vote
                      </button>
                    </div>
                  ) : (
                    <div className="grid grid-cols-3 gap-3">
                      <button
                        onClick={() => handleCastVote('FOR')}
                        className="py-4 rounded-xl bg-emerald-500/10 hover:bg-emerald-500/20 border border-emerald-500/30 text-emerald-300 font-bold text-sm transition-all hover:scale-[1.02] active:scale-95"
                      >
                        VOTE FOR
                      </button>
                      <button
                        onClick={() => handleCastVote('AGAINST')}
                        className="py-4 rounded-xl bg-rose-500/10 hover:bg-rose-500/20 border border-rose-500/30 text-rose-300 font-bold text-sm transition-all hover:scale-[1.02] active:scale-95"
                      >
                        VOTE AGAINST
                      </button>
                      <button
                        onClick={() => handleCastVote('ABSTAIN')}
                        className="py-4 rounded-xl bg-[#181B21] hover:bg-[#20242C] border border-[#2B2F37] text-[#9A9DA5] font-bold text-sm transition-all hover:scale-[1.02] active:scale-95"
                      >
                        ABSTAIN
                      </button>
                    </div>
                  )}
                </div>
              ) : (
                <div className="p-8 text-center text-[#9A9DA5] border border-dashed border-[#232731] rounded-2xl">
                  No active ballot currently open. The Chair will announce division votes.
                </div>
              )}
            </div>
          )}

          {/* ── SPEECH PREPARATION DESK ── */}
          {activeSection === 'SPEECH_PREP' && (
            <div className="p-6 max-w-4xl mx-auto w-full space-y-6 text-left">
              <div className="flex items-center justify-between pb-4 border-b border-[#181B21]">
                <div>
                  <h2 className="text-xl font-serif text-[#F4F2ED]">Speech Preparation & Cadence</h2>
                  <p className="text-xs text-[#9A9DA5]">
                    Draft your interventions with real-time word counting and duration estimation.
                  </p>
                </div>
                <div className="flex items-center gap-4 text-xs font-mono">
                  <span className="text-[#9A9DA5]">Target: {targetSpeechSeconds}s</span>
                  <span
                    className={`font-bold ${
                      estimatedSeconds > targetSpeechSeconds ? 'text-amber-400' : 'text-emerald-400'
                    }`}
                  >
                    Est: {estimatedSeconds}s ({wordCount} words)
                  </span>
                </div>
              </div>

              <textarea
                value={speechText}
                onChange={(e) => setSpeechText(e.target.value)}
                rows={12}
                className="w-full p-4 bg-[#111318] border border-[#232731] focus:border-[#C5A46D] rounded-2xl text-sm text-[#F4F2ED] leading-relaxed outline-none"
                placeholder="Draft your floor speech here..."
              />

              <div className="p-4 rounded-xl bg-[#181B21] border border-[#2B2F37] flex items-center justify-between text-xs text-[#9A9DA5]">
                <span>Pace Metric: 130 words per minute (diplomatic standard)</span>
                <DiasButton
                  onClick={() => alert('Speech draft saved to local dossier.')}
                  variant="gold"
                  size="sm"
                >
                  Save to Dossier
                </DiasButton>
              </div>
            </div>
          )}

          {/* ── DIPLOMATIC MESH CHAT ── */}
          {activeSection === 'CHAT' && (
            <div className="flex-1 flex flex-col p-4 sm:p-6 max-w-4xl mx-auto w-full text-left overflow-hidden">
              <div className="pb-3 border-b border-[#181B21] flex items-center justify-between">
                <div>
                  <h2 className="text-lg font-serif text-[#F4F2ED]">Diplomatic Mesh Messaging</h2>
                  <p className="text-xs text-[#9A9DA5]">Real-time encrypted caucus and floor communication</p>
                </div>
                <div className="flex items-center gap-1 p-1 bg-[#111318] rounded-xl border border-[#232731]">
                  {(['FLOOR', 'CHAIR', 'DIRECT'] as const).map((ch) => (
                    <button
                      key={ch}
                      onClick={() => setChatChannel(ch)}
                      className={`px-3 py-1 rounded-lg text-xs font-mono transition-all ${
                        chatChannel === ch
                          ? 'bg-[#C5A46D] text-[#08090B] font-bold'
                          : 'text-[#9A9DA5] hover:text-white'
                      }`}
                    >
                      {ch}
                    </button>
                  ))}
                </div>
              </div>

              {/* Message List */}
              <div className="flex-1 overflow-y-auto py-4 space-y-3">
                {chatMessages.map((msg) => (
                  <div
                    key={msg.id}
                    className="p-3 rounded-xl bg-[#111318] border border-[#232731] space-y-1"
                  >
                    <div className="flex items-center justify-between text-[11px]">
                      <span className="font-semibold text-[#E6D1A5] font-mono">{msg.sender}</span>
                      <span className="text-[#575B66]">{msg.timestamp}</span>
                    </div>
                    <p className="text-xs text-[#F4F2ED] leading-relaxed">{msg.text}</p>
                  </div>
                ))}
              </div>

              {/* Message Input */}
              <form onSubmit={handleSendChat} className="pt-2 flex items-center gap-2">
                <input
                  type="text"
                  value={chatInput}
                  onChange={(e) => setChatInput(e.target.value)}
                  placeholder={`Send message to #${chatChannel.toLowerCase()}...`}
                  className="flex-1 h-10 px-3 bg-[#111318] border border-[#232731] focus:border-[#C5A46D] rounded-xl text-xs text-[#F4F2ED] outline-none"
                />
                <DiasButton type="submit" variant="gold" size="sm" rightIcon={<Send className="w-3.5 h-3.5" />}>
                  Send
                </DiasButton>
              </form>
            </div>
          )}

          {/* ── OTHER SECTIONS FALLBACKS (RESEARCH, PROFILE, RULES, ETC.) ── */}
          {(activeSection === 'DOCUMENTS' ||
            activeSection === 'RESEARCH' ||
            activeSection === 'PEOPLE' ||
            activeSection === 'PROFILE' ||
            activeSection === 'RULES') && (
            <div className="p-6 max-w-4xl mx-auto w-full space-y-6 text-left">
              <div className="pb-4 border-b border-[#181B21]">
                <h2 className="text-xl font-serif text-[#F4F2ED]">
                  {activeSection.replace(/_/g, ' ')}
                </h2>
                <p className="text-xs text-[#9A9DA5]">
                  Sovereign diplomatic dossier and verified committee ledger.
                </p>
              </div>

              <div className="p-6 rounded-2xl bg-[#111318] border border-[#232731] space-y-4">
                <h3 className="text-sm font-semibold text-[#F4F2ED]">
                  Verified Records for {myDelegation.seat}
                </h3>
                <p className="text-xs text-[#9A9DA5] leading-relaxed">
                  All clauses, research notes, and speech drafts are persisted on the sovereign summit ledger.
                </p>
                <div className="pt-2">
                  <DiasButton
                    onClick={() => setActiveSection('LIVE_FLOOR')}
                    variant="gold"
                    size="sm"
                    rightIcon={<ArrowRight className="w-3.5 h-3.5" />}
                  >
                    Return to Live Floor
                  </DiasButton>
                </div>
              </div>
            </div>
          )}
        </main>
      </div>

      {/* ── RAISE A MOTION MODAL (DELEGATE WORKFLOW) ── */}
      {isMotionModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-fadeIn">
          <div className="bg-[#111318] border border-[#232731] rounded-2xl p-6 max-w-lg w-full text-left space-y-5 shadow-2xl">
            <div className="flex items-center justify-between pb-3 border-b border-[#181B21]">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-lg bg-[#C5A46D]/15 flex items-center justify-center text-[#C5A46D]">
                  <Scale className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="text-base font-semibold text-[#F4F2ED]">RAISE A MOTION</h3>
                  <p className="text-xs text-[#9A9DA5]">Proposed by: {myDelegation.seat}</p>
                </div>
              </div>
              <button
                onClick={() => setIsMotionModalOpen(false)}
                className="p-1 rounded-lg text-[#9A9DA5] hover:text-white transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSubmitMotion} className="space-y-4">
              <div>
                <label className="text-xs text-[#9A9DA5] block mb-1">Motion Type</label>
                <select
                  value={motionType}
                  onChange={(e) => setMotionType(e.target.value)}
                  className="w-full h-10 px-3 bg-[#08090B] border border-[#232731] focus:border-[#C5A46D] rounded-xl text-xs text-[#F4F2ED] outline-none"
                >
                  {isIndianCommittee ? (
                    <>
                      <option value="Calling Attention Notice (Rule 197)">
                        Calling Attention Notice (Rule 197)
                      </option>
                      <option value="Division Vote on Clause">Division Vote on Clause</option>
                      <option value="Short Duration Discussion (Rule 193)">
                        Short Duration Discussion (Rule 193)
                      </option>
                      <option value="Adjournment Motion (Rule 56)">Adjournment Motion (Rule 56)</option>
                      <option value="Point of Order">Point of Order</option>
                    </>
                  ) : (
                    <>
                      <option value="Moderated Caucus">Moderated Caucus</option>
                      <option value="Unmoderated Caucus">Unmoderated Caucus</option>
                      <option value="Tour de Table">Tour de Table</option>
                      <option value="Consultation with the Whole">Consultation with the Whole</option>
                      <option value="Suspend Debate">Suspend Debate</option>
                    </>
                  )}
                </select>
              </div>

              <div>
                <label className="text-xs text-[#9A9DA5] block mb-1">Motion Topic / Purpose</label>
                <input
                  required
                  value={motionTopic}
                  onChange={(e) => setMotionTopic(e.target.value)}
                  placeholder="e.g. Delimitation Impact on Federal Fiscal Shares"
                  className="w-full h-10 px-3 bg-[#08090B] border border-[#232731] focus:border-[#C5A46D] rounded-xl text-xs text-[#F4F2ED] outline-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs text-[#9A9DA5] block mb-1">Total Duration (Minutes)</label>
                  <input
                    type="number"
                    min="5"
                    max="60"
                    value={motionTotalTime}
                    onChange={(e) => setMotionTotalTime(e.target.value)}
                    className="w-full h-10 px-3 bg-[#08090B] border border-[#232731] focus:border-[#C5A46D] rounded-xl text-xs text-[#F4F2ED] outline-none"
                  />
                </div>
                <div>
                  <label className="text-xs text-[#9A9DA5] block mb-1">Individual Speaking (Seconds)</label>
                  <input
                    type="number"
                    min="30"
                    max="180"
                    value={motionSpeakingTime}
                    onChange={(e) => setMotionSpeakingTime(e.target.value)}
                    className="w-full h-10 px-3 bg-[#08090B] border border-[#232731] focus:border-[#C5A46D] rounded-xl text-xs text-[#F4F2ED] outline-none"
                  />
                </div>
              </div>

              <div className="pt-3 border-t border-[#181B21] flex items-center justify-end gap-3">
                <DiasButton
                  type="button"
                  variant="charcoal"
                  size="sm"
                  onClick={() => setIsMotionModalOpen(false)}
                >
                  Cancel
                </DiasButton>
                <DiasButton type="submit" variant="gold" size="sm">
                  Transmit Motion to Chair
                </DiasButton>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
