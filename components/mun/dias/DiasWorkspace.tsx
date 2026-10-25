'use client';

import React, { useState, useEffect, useCallback, useRef } from 'react';
import Link from 'next/link';
import {
  Gavel,
  Play,
  Pause,
  RotateCcw,
  SkipForward,
  Users,
  Hand,
  Clock,
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
  Newspaper,
  Flame,
  Plus,
  Trash2,
  X,
  Share2,
  Check,
  ChevronRight,
  Send,
  SlidersHorizontal,
} from 'lucide-react';
import { daisAudio } from '@/lib/daisAudio';
import { DiasButton } from './DiasButton';
import { DiasBadge } from './DiasBadge';
import { DiasCard } from './DiasCard';
import { BillRegistryView } from '../parliamentary/BillRegistryView';
import { BillEditorModal } from '../parliamentary/BillEditorModal';
import { AmendmentReviewDeck, AmendmentItem } from '../parliamentary/AmendmentReviewDeck';
import { QuestionHourDesk, ParliamentaryQuestion } from '../parliamentary/QuestionHourDesk';
import { PressRoomWorkspace, PressStory } from '../press/PressRoomWorkspace';
import { CrisisCommandCenter, CrisisDirectiveItem } from '../crisis/CrisisCommandCenter';

export type CommitteeMode =
  | 'GSL'
  | 'MOD_CAUCUS'
  | 'UNMOD_CAUCUS'
  | 'PARLIAMENT_BILLS'
  | 'VOTING'
  | 'PRESS'
  | 'CRISIS';

export interface SpeakerQueueItem {
  id: string;
  country: string;
  flag: string;
  name: string;
  position: number;
}

export interface ProceduralMotion {
  id: string;
  type: string;
  topic: string;
  proposedBy: string;
  totalTimeMin: number;
  speakerTimeSec: number;
  status: 'PENDING' | 'ACCEPTED' | 'REJECTED' | 'ACTIVE';
}

export interface DiasWorkspaceProps {
  sessionCode?: string;
  committeeName?: string;
  committeeAcronym?: string;
  topic?: string;
  isIndianCommittee?: boolean;
}

export const DiasWorkspace: React.FC<DiasWorkspaceProps> = ({
  sessionCode = 'IF8RV5',
  committeeName = 'Lok Sabha • Parliament of India',
  committeeAcronym = 'LOK SABHA',
  topic = 'Delimitation of Constituencies, Federalism & Democratic Governance',
  isIndianCommittee = true,
}) => {
  // ─── Procedural Audio & Gavel ───
  const [soundEnabled, setSoundEnabled] = useState(true);

  // ─── Mode & Active State ───
  const [activeMode, setActiveMode] = useState<CommitteeMode>(
    isIndianCommittee ? 'PARLIAMENT_BILLS' : 'GSL'
  );

  // ─── Authoritative Timer State ───
  const [durationSec, setDurationSec] = useState(90);
  const [remainingSec, setRemainingSec] = useState(90);
  const [isTimerRunning, setIsTimerRunning] = useState(false);

  // ─── Speaker Stage & Queue ───
  const [currentSpeaker, setCurrentSpeaker] = useState<SpeakerQueueItem | null>({
    id: 'spk_1',
    country: 'Treasury Bench',
    flag: '🇮🇳',
    name: 'Hon. Minister of Parliamentary Affairs',
    position: 1,
  });

  const [queue, setQueue] = useState<SpeakerQueueItem[]>([
    {
      id: 'spk_2',
      country: 'Opposition Leader',
      flag: '🇮🇳',
      name: 'Leader of Opposition (INC)',
      position: 2,
    },
    {
      id: 'spk_3',
      country: 'United Kingdom',
      flag: '🇬🇧',
      name: 'Hon. Representative of UK',
      position: 3,
    },
    {
      id: 'spk_4',
      country: 'France',
      flag: '🇫🇷',
      name: 'Hon. Representative of France',
      position: 4,
    },
  ]);

  // ─── Quick Add Input ───
  const [newCountry, setNewCountry] = useState('Germany');
  const [newDelegateName, setNewDelegateName] = useState('');

  // ─── Raised Hands & Pending Motions ───
  const [raisedHands, setRaisedHands] = useState<string[]>([
    'Germany',
    'South Africa',
    'Brazil',
  ]);

  const [pendingMotions, setPendingMotions] = useState<ProceduralMotion[]>([
    {
      id: 'mot_1',
      type: 'Moderated Caucus',
      topic: 'Fiscal Transfers & State Reorganization',
      proposedBy: 'Germany',
      totalTimeMin: 15,
      speakerTimeSec: 60,
      status: 'PENDING',
    },
    {
      id: 'mot_2',
      type: 'Point of Order',
      topic: 'Breach of Rule 377 on floor recognition',
      proposedBy: 'Opposition Leader',
      totalTimeMin: 0,
      speakerTimeSec: 0,
      status: 'PENDING',
    },
  ]);

  // ─── Parliamentary State ───
  const [bills, setBills] = useState<any[]>([
    {
      id: 'bill_01',
      billNumber: 'LS-BILL-2026-01',
      title: 'The Constitution (One Hundred and Thirtieth Amendment) Bill, 2026',
      sponsoringSeat: 'TREASURY BENCH',
      ministry: 'Ministry of Law and Justice',
      objectives:
        'A Bill further to amend the Constitution of India to balance constituency delimitation with federal balance of representation.',
      stage: 'UNDER_DEBATE',
      clauses: [
        {
          id: 'cl_1',
          clauseIndex: 1,
          clauseTitle: 'Short title and commencement',
          clauseBody: 'This Act may be called the Delimitation & Federal Representation Act, 2026.',
          amendments: [],
        },
        {
          id: 'cl_2',
          clauseIndex: 2,
          clauseTitle: 'Weightage formula for Southern States',
          clauseBody:
            'Notwithstanding anything contained in Article 81, representation shall preserve proportional demographic equity across all States.',
          amendments: [
            {
              id: 'am_1',
              proposedBySeat: 'Opposition Bench',
              proposedText: 'Freeze Lok Sabha seats until demographic parity is reached across all zones.',
              status: 'PENDING',
            },
          ],
        },
      ],
    },
  ]);
  const [activeBill, setActiveBill] = useState<any>(bills[0] || null);
  const [isBillEditorOpen, setIsBillEditorOpen] = useState(false);

  const [amendments, setAmendments] = useState<AmendmentItem[]>([
    {
      id: 'am_1',
      clauseId: 'cl_2',
      proposedBySeat: 'Opposition Bench',
      proposedText: 'Freeze Lok Sabha seat reallocation until demographic parity is achieved.',
      rationale: 'Protecting progressive states from loss of democratic representation.',
      status: 'PENDING',
      createdAt: new Date().toISOString(),
      clauseTitle: 'Clause 2: Representation Weightage',
    },
  ]);

  const [questions, setQuestions] = useState<ParliamentaryQuestion[]>([
    {
      id: 'q_1',
      type: 'STARRED',
      fromSeat: 'Hon. Member from Wayanad',
      targetMinistry: 'Ministry of Finance',
      questionText: 'Will the Minister state the allocation of central tax pool funds under the proposed 16th Finance Commission?',
      replyText: 'Sir, the devolution of taxes remains committed to cooperative federalism based on equalized criteria.',
      status: 'ANSWERED',
      createdAt: new Date().toISOString(),
    },
  ]);

  // ─── Press State ───
  const [pressStories, setPressStories] = useState<PressStory[]>([
    {
      id: 'story_1',
      headline: 'Heated Debate Erupts in Lok Sabha Over Delimitation Bill',
      leadAgency: 'PTI',
      publicationType: 'PRESS_RELEASE',
      authorName: 'Diplomatic Correspondent',
      bodyText: 'The Treasury and Opposition benches traded sharp remarks as discussion opened on the 2026 Delimitation Bill.',
      status: 'PUBLISHED',
      createdAt: new Date().toISOString(),
    },
  ]);

  // ─── Crisis State ───
  const [directives, setDirectives] = useState<CrisisDirectiveItem[]>([
    {
      id: 'dir_1',
      directiveNumber: 'DIR-2026-01',
      title: 'Alert Level Yellow: Coastal Interception Protocol',
      actionType: 'COVERT_OPS',
      fromSeat: 'DEFENCE MINISTRY',
      targetRecipients: ['CRISIS_DIRECTOR', 'HOME_MINISTRY'],
      content: 'Deploy naval interceptor craft to inspect foreign vessels without AIS transponder beacons.',
      isConfidential: true,
      status: 'EXECUTED',
      createdAt: new Date().toISOString(),
    },
  ]);

  // ─── Yield Popover State ───
  const [yieldOpen, setYieldOpen] = useState(false);

  // ─── Authoritative Timer Engine ───
  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (isTimerRunning && remainingSec > 0) {
      interval = setInterval(() => {
        setRemainingSec((prev) => {
          if (prev <= 1) {
            daisAudio.playTimeExpired();
            setIsTimerRunning(false);
            return 0;
          }
          if (prev === 11) {
            daisAudio.playWarningBell();
          }
          return prev - 1;
        });
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [isTimerRunning, remainingSec]);

  // ─── Keyboard Shortcut [G] for Gavel ───
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (
        e.key.toLowerCase() === 'g' &&
        !(e.target instanceof HTMLInputElement || e.target instanceof HTMLTextAreaElement)
      ) {
        e.preventDefault();
        daisAudio.playGavelStrike(1.0);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  const handleStrikeGavel = () => {
    daisAudio.playGavelStrike(1.0);
  };

  const toggleTimer = () => {
    if (!isTimerRunning && remainingSec === 0) {
      setRemainingSec(durationSec);
    }
    setIsTimerRunning(!isTimerRunning);
  };

  const resetTimer = () => {
    setIsTimerRunning(false);
    setRemainingSec(durationSec);
  };

  const handleNextSpeaker = () => {
    daisAudio.playGavelStrike(0.8);
    if (queue.length > 0) {
      const next = queue[0];
      setCurrentSpeaker(next);
      setQueue(queue.slice(1));
      setRemainingSec(durationSec);
      setIsTimerRunning(true);
    } else {
      setCurrentSpeaker(null);
      setIsTimerRunning(false);
      setRemainingSec(durationSec);
    }
  };

  const handleAddToQueue = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!newCountry.trim()) return;

    const newItem: SpeakerQueueItem = {
      id: `spk_${Date.now()}`,
      country: newCountry,
      flag: '🏛️',
      name: newDelegateName || `Hon. Member (${newCountry})`,
      position: queue.length + 1,
    };
    setQueue([...queue, newItem]);
    setNewDelegateName('');
  };

  const handleRemoveQueue = (id: string) => {
    setQueue(queue.filter((q) => q.id !== id));
  };

  const handleRecognizeHand = (country: string) => {
    setRaisedHands(raisedHands.filter((h) => h !== country));
    setQueue([
      ...queue,
      {
        id: `spk_${Date.now()}`,
        country,
        flag: '🏛️',
        name: `Hon. Delegate of ${country}`,
        position: queue.length + 1,
      },
    ]);
  };

  const handleYield = (type: 'CHAIR' | 'DELEGATE' | 'QUESTIONS') => {
    daisAudio.playGavelStrike(0.7);
    setYieldOpen(false);
    if (type === 'CHAIR') {
      handleNextSpeaker();
    }
  };

  const formatClock = (total: number) => {
    const mins = Math.floor(total / 60);
    const secs = total % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <div className="h-screen w-screen bg-[#08090B] text-[#F4F2ED] flex flex-col overflow-hidden select-none font-sans antialiased">
      {/* ─── 1. TOP STATUS BAR ─── */}
      <header className="h-14 bg-[#111318] border-b border-[#232731] px-4 sm:px-6 flex items-center justify-between shrink-0 z-30">
        <div className="flex items-center gap-3 sm:gap-4">
          <Link href="/dias" className="flex items-center gap-2.5 group">
            <div className="w-8 h-8 rounded-xl bg-[#181B21] border border-[#C5A46D]/40 flex items-center justify-center text-[#C5A46D] group-hover:border-[#C5A46D] transition-colors shadow-sm">
              <Gavel className="w-4 h-4" />
            </div>
            <div className="hidden sm:flex flex-col text-left">
              <span className="text-xs font-bold tracking-widest text-[#F4F2ED] uppercase">
                ZENVITRA DIAS
              </span>
              <span className="text-[10px] text-[#9A9DA5] font-mono">
                {committeeAcronym}
              </span>
            </div>
          </Link>

          <div className="h-5 w-px bg-[#232731] hidden sm:block" />

          {/* Live Session Status & Quorum Health */}
          <div className="flex items-center gap-2">
            <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-[#1C3829]/60 text-[#86EFAC] border border-[#22C55E]/40 text-[11px] font-mono font-medium">
              <span className="w-2 h-2 rounded-full bg-[#22C55E] animate-pulse" />
              LIVE IN SESSION
            </span>
            <span className="text-xs text-[#9A9DA5] font-mono hidden md:inline">
              Quorum: <strong>48 Present</strong> (14 P&V)
            </span>
          </div>
        </div>

        {/* Center: Session Join Code */}
        <div className="flex items-center gap-2">
          <span className="text-xs text-[#9A9DA5] font-mono uppercase hidden lg:inline">
            Join Code:
          </span>
          <span className="px-2.5 py-1 rounded-lg bg-[#181B21] border border-[#C5A46D]/40 text-[#E6D1A5] text-xs font-mono font-bold tracking-wider">
            ↗ {sessionCode}
          </span>
        </div>

        {/* Right Actions: Audio Toggle & Fullscreen Gavel */}
        <div className="flex items-center gap-2 sm:gap-3">
          <button
            onClick={() => {
              const next = daisAudio.toggle();
              setSoundEnabled(next);
            }}
            title={soundEnabled ? 'Acoustic Sound Enabled' : 'Sound Muted'}
            className={`p-2 rounded-xl border text-xs flex items-center gap-1.5 transition-colors ${
              soundEnabled
                ? 'bg-[#181B21] border-[#C5A46D]/40 text-[#C5A46D]'
                : 'bg-[#111318] border-[#232731] text-[#575B66]'
            }`}
          >
            {soundEnabled ? <Volume2 className="w-4 h-4" /> : <VolumeX className="w-4 h-4" />}
            <span className="text-[11px] font-mono hidden md:inline">Audio</span>
          </button>

          <DiasButton
            variant="gold"
            size="sm"
            onClick={handleStrikeGavel}
            leftIcon={<Gavel className="w-3.5 h-3.5" />}
          >
            Gavel [G]
          </DiasButton>
        </div>
      </header>

      {/* ─── 2. MAIN THREE-COLUMN WORKSPACE ─── */}
      <div className="flex-1 flex overflow-hidden">
        {/* ── LEFT SIDEBAR: Session Identity & Committee Modes ── */}
        <aside className="w-64 bg-[#0A0C0F] border-r border-[#181B21] p-4 flex flex-col justify-between shrink-0 hidden md:flex overflow-y-auto">
          <div className="space-y-5">
            {/* Session Identity Card */}
            <div className="p-3.5 rounded-2xl bg-[#111318] border border-[#232731] space-y-1.5 text-left">
              <span className="text-[10px] font-mono uppercase tracking-widest text-[#C5A46D]">
                CHAMBER AGENDA
              </span>
              <h3 className="text-xs font-semibold text-[#F4F2ED] leading-snug">
                {committeeName}
              </h3>
              <p className="text-[11px] text-[#9A9DA5] line-clamp-3 leading-relaxed">
                {topic}
              </p>
            </div>

            {/* Committee Mode Switcher */}
            <div className="space-y-1.5 text-left">
              <span className="text-[10px] font-mono uppercase tracking-widest text-[#9A9DA5] px-1">
                PROCEDURAL MODES
              </span>

              <nav className="space-y-1">
                <button
                  onClick={() => setActiveMode('GSL')}
                  className={`w-full flex items-center justify-between px-3 py-2 rounded-xl text-xs font-medium transition-all ${
                    activeMode === 'GSL'
                      ? 'bg-[#C5A46D] text-[#08090B] font-semibold shadow-sm'
                      : 'bg-transparent text-[#9A9DA5] hover:text-[#F4F2ED] hover:bg-[#111318]'
                  }`}
                >
                  <span className="flex items-center gap-2">
                    <Globe2 className="w-3.5 h-3.5" /> General Speakers' List
                  </span>
                  <span className="text-[10px] font-mono">GSL</span>
                </button>

                <button
                  onClick={() => setActiveMode('MOD_CAUCUS')}
                  className={`w-full flex items-center justify-between px-3 py-2 rounded-xl text-xs font-medium transition-all ${
                    activeMode === 'MOD_CAUCUS'
                      ? 'bg-[#C5A46D] text-[#08090B] font-semibold shadow-sm'
                      : 'bg-transparent text-[#9A9DA5] hover:text-[#F4F2ED] hover:bg-[#111318]'
                  }`}
                >
                  <span className="flex items-center gap-2">
                    <Clock className="w-3.5 h-3.5" /> Moderated Caucus
                  </span>
                  <span className="text-[10px] font-mono">MOD</span>
                </button>

                <button
                  onClick={() => setActiveMode('UNMOD_CAUCUS')}
                  className={`w-full flex items-center justify-between px-3 py-2 rounded-xl text-xs font-medium transition-all ${
                    activeMode === 'UNMOD_CAUCUS'
                      ? 'bg-[#C5A46D] text-[#08090B] font-semibold shadow-sm'
                      : 'bg-transparent text-[#9A9DA5] hover:text-[#F4F2ED] hover:bg-[#111318]'
                  }`}
                >
                  <span className="flex items-center gap-2">
                    <Users className="w-3.5 h-3.5" /> Unmoderated Caucus
                  </span>
                  <span className="text-[10px] font-mono">UNMOD</span>
                </button>

                {isIndianCommittee && (
                  <button
                    onClick={() => setActiveMode('PARLIAMENT_BILLS')}
                    className={`w-full flex items-center justify-between px-3 py-2 rounded-xl text-xs font-medium transition-all ${
                      activeMode === 'PARLIAMENT_BILLS'
                        ? 'bg-[#C5A46D] text-[#08090B] font-semibold shadow-sm'
                        : 'bg-transparent text-[#9A9DA5] hover:text-[#F4F2ED] hover:bg-[#111318]'
                    }`}
                  >
                    <span className="flex items-center gap-2">
                      <Building2 className="w-3.5 h-3.5" /> Legislative Bills
                    </span>
                    <DiasBadge variant="gold" size="sm">LS</DiasBadge>
                  </button>
                )}

                <button
                  onClick={() => setActiveMode('VOTING')}
                  className={`w-full flex items-center justify-between px-3 py-2 rounded-xl text-xs font-medium transition-all ${
                    activeMode === 'VOTING'
                      ? 'bg-[#C5A46D] text-[#08090B] font-semibold shadow-sm'
                      : 'bg-transparent text-[#9A9DA5] hover:text-[#F4F2ED] hover:bg-[#111318]'
                  }`}
                >
                  <span className="flex items-center gap-2">
                    <Vote className="w-3.5 h-3.5" /> Division & Voting
                  </span>
                  <span className="text-[10px] font-mono">VOTE</span>
                </button>

                <button
                  onClick={() => setActiveMode('PRESS')}
                  className={`w-full flex items-center justify-between px-3 py-2 rounded-xl text-xs font-medium transition-all ${
                    activeMode === 'PRESS'
                      ? 'bg-[#C5A46D] text-[#08090B] font-semibold shadow-sm'
                      : 'bg-transparent text-[#9A9DA5] hover:text-[#F4F2ED] hover:bg-[#111318]'
                  }`}
                >
                  <span className="flex items-center gap-2">
                    <Newspaper className="w-3.5 h-3.5" /> Press Wire (IPC)
                  </span>
                  <span className="text-[10px] font-mono">NEWS</span>
                </button>

                <button
                  onClick={() => setActiveMode('CRISIS')}
                  className={`w-full flex items-center justify-between px-3 py-2 rounded-xl text-xs font-medium transition-all ${
                    activeMode === 'CRISIS'
                      ? 'bg-[#822424] text-[#FCA5A5] font-semibold shadow-sm'
                      : 'bg-transparent text-[#9A9DA5] hover:text-[#F87171] hover:bg-[#111318]'
                  }`}
                >
                  <span className="flex items-center gap-2">
                    <Flame className="w-3.5 h-3.5" /> Crisis War Room
                  </span>
                  <span className="text-[10px] font-mono">WAR</span>
                </button>
              </nav>
            </div>
          </div>

          <div className="pt-4 border-t border-[#181B21] text-[11px] text-[#575B66] font-mono text-left">
            ZENVITRA DIAS V2.4 • BY YOUTH. FOR YOUTH.
          </div>
        </aside>

        {/* ── CENTER STAGE: Active Mode Workspace ── */}
        <main className="flex-1 flex flex-col justify-between overflow-hidden bg-[#08090B] relative">
          {activeMode === 'PARLIAMENT_BILLS' ? (
            <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-6">
              <BillRegistryView
                bills={bills}
                onOpenCreateModal={() => setIsBillEditorOpen(true)}
                onSelectActiveBill={(b) => setActiveBill(b)}
                activeBillId={activeBill?.id}
                onProposeAmendment={(clauseId, bTitle) => {
                  setAmendments([
                    ...amendments,
                    {
                      id: `am_${Date.now()}`,
                      clauseId,
                      proposedBySeat: 'Opposition Bench',
                      proposedText: 'Amend statutory allocation ratio to preserve federal autonomy.',
                      rationale: 'Submitted under Parliamentary Rule 84.',
                      status: 'PENDING',
                      createdAt: new Date().toISOString(),
                      clauseTitle: 'Selected Clause',
                      billTitle: bTitle,
                    },
                  ]);
                }}
              />
              <AmendmentReviewDeck
                amendments={amendments}
                onDecideAmendment={(amId, status) => {
                  setAmendments(
                    amendments.map((a) => (a.id === amId ? { ...a, status } : a))
                  );
                }}
                onPutAmendmentToVote={(am) => {
                  setActiveMode('VOTING');
                }}
              />
              <QuestionHourDesk
                questions={questions}
                onAskQuestion={(q) => {
                  setQuestions([
                    ...questions,
                    {
                      id: `q_${Date.now()}`,
                      type: q.type,
                      fromSeat: q.fromSeat,
                      targetMinistry: q.ministry,
                      questionText: q.text,
                      status: 'PENDING',
                      createdAt: new Date().toISOString(),
                    },
                  ]);
                }}
              />
            </div>
          ) : activeMode === 'PRESS' ? (
            <div className="flex-1 overflow-y-auto p-4 sm:p-6">
              <PressRoomWorkspace
                stories={pressStories}
                onPublishStory={(story) => setPressStories([story, ...pressStories])}
                onApproveStory={(id) => {
                  setPressStories(
                    pressStories.map((s) => (s.id === id ? { ...s, status: 'PUBLISHED' } : s))
                  );
                }}
              />
            </div>
          ) : activeMode === 'CRISIS' ? (
            <div className="flex-1 overflow-y-auto p-4 sm:p-6">
              <CrisisCommandCenter
                directives={directives}
                onDispatchDirective={(d) => setDirectives([d, ...directives])}
                onUpdateStatus={(id, status) => {
                  setDirectives(
                    directives.map((d) => (d.id === id ? { ...d, status } : d))
                  );
                }}
              />
            </div>
          ) : (
            /* ── Default Live Debate Stage (GSL / Caucus) ── */
            <div className="flex-1 flex flex-col justify-between p-4 sm:p-6 overflow-hidden">
              {/* Speaker Card on Floor */}
              <div className="flex items-center justify-between pb-3 border-b border-[#181B21]">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-2xl bg-[#111318] border border-[#2A2E39] flex items-center justify-center text-2xl shadow-inner">
                    {currentSpeaker ? currentSpeaker.flag : '🏛️'}
                  </div>
                  <div className="text-left space-y-0.5">
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-mono font-bold text-[#C5A46D] uppercase">
                        FLOOR RECOGNIZED
                      </span>
                      <DiasBadge variant="gold" size="sm">
                        {activeMode}
                      </DiasBadge>
                    </div>
                    <h2 className="text-base sm:text-lg font-semibold text-[#F4F2ED]">
                      {currentSpeaker ? currentSpeaker.name : 'Chamber Floor Open'}
                    </h2>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <span className="text-xs text-[#9A9DA5] font-mono hidden sm:inline">
                    Time Allocated: {durationSec}s
                  </span>
                </div>
              </div>

              {/* 64px Authoritative Digital Clock Display */}
              <div className="py-6 sm:py-10 text-center space-y-2">
                <div className="font-mono text-6xl sm:text-7xl font-bold tracking-tight text-[#F4F2ED] select-none">
                  {formatClock(remainingSec)}
                </div>
                <p className="text-[11px] text-[#575B66] font-mono tracking-widest uppercase">
                  {isTimerRunning
                    ? '• SPEECH RUNNING • 10S WARNING BELL ACTIVE'
                    : 'SPEECH PAUSED • STRIKE GAVEL [G] TO CALL ORDER'}
                </p>
              </div>

              {/* Speech Controls & Yield Popover */}
              <div className="flex flex-wrap items-center justify-center gap-3 relative pb-2">
                <DiasButton
                  variant={isTimerRunning ? 'charcoal' : 'gold'}
                  size="md"
                  onClick={toggleTimer}
                  leftIcon={
                    isTimerRunning ? (
                      <Pause className="w-4 h-4" />
                    ) : (
                      <Play className="w-4 h-4 fill-current" />
                    )
                  }
                >
                  {isTimerRunning ? 'Pause Speech' : 'Start Speech'}
                </DiasButton>

                <DiasButton
                  variant="charcoal"
                  size="md"
                  onClick={resetTimer}
                  leftIcon={<RotateCcw className="w-4 h-4" />}
                >
                  Reset
                </DiasButton>

                <DiasButton
                  variant="charcoal"
                  size="md"
                  onClick={handleNextSpeaker}
                  rightIcon={<SkipForward className="w-4 h-4" />}
                >
                  Next Speaker
                </DiasButton>

                {/* Yield Button with Anchored Popover */}
                <div className="relative">
                  <DiasButton
                    variant="outline"
                    size="md"
                    onClick={() => setYieldOpen(!yieldOpen)}
                  >
                    Yield Floor ▾
                  </DiasButton>

                  {yieldOpen && (
                    <div className="absolute bottom-12 right-0 w-52 bg-[#111318] border border-[#232731] rounded-2xl p-2 shadow-2xl z-50 space-y-1 text-left animate-in fade-in">
                      <button
                        onClick={() => handleYield('CHAIR')}
                        className="w-full text-xs text-[#F4F2ED] hover:bg-[#181B21] hover:text-[#C5A46D] px-3 py-2 rounded-xl text-left transition-colors"
                      >
                        Yield to Chair
                      </button>
                      <button
                        onClick={() => handleYield('DELEGATE')}
                        className="w-full text-xs text-[#F4F2ED] hover:bg-[#181B21] hover:text-[#C5A46D] px-3 py-2 rounded-xl text-left transition-colors"
                      >
                        Yield to Another Delegate
                      </button>
                      <button
                        onClick={() => handleYield('QUESTIONS')}
                        className="w-full text-xs text-[#F4F2ED] hover:bg-[#181B21] hover:text-[#C5A46D] px-3 py-2 rounded-xl text-left transition-colors"
                      >
                        Yield to Points of Information
                      </button>
                    </div>
                  )}
                </div>
              </div>

              {/* Docked Speaker Queue */}
              <div className="space-y-2 pt-3 border-t border-[#181B21]">
                <div className="flex items-center justify-between text-xs font-semibold text-[#F4F2ED] uppercase tracking-wider">
                  <span className="flex items-center gap-1.5">
                    <Users className="w-3.5 h-3.5 text-[#C5A46D]" />
                    Upcoming Speakers ({queue.length})
                  </span>
                  <span className="text-[10px] font-mono text-[#575B66]">GSL Order</span>
                </div>

                <div className="flex items-center gap-2 overflow-x-auto pb-1 no-scrollbar">
                  {queue.map((item, index) => (
                    <div
                      key={item.id}
                      className="p-2.5 rounded-xl bg-[#111318] border border-[#232731] flex items-center gap-2 text-xs shrink-0 min-w-[200px] justify-between group"
                    >
                      <div className="flex items-center gap-2">
                        <span className="text-sm">{item.flag}</span>
                        <div className="text-left flex flex-col">
                          <span className="font-medium text-[#F4F2ED] line-clamp-1">
                            #{index + 1} {item.country}
                          </span>
                          <span className="text-[10px] text-[#9A9DA5] line-clamp-1">
                            {item.name}
                          </span>
                        </div>
                      </div>
                      <button
                        onClick={() => handleRemoveQueue(item.id)}
                        className="text-[#575B66] hover:text-[#F87171] p-1 transition-colors opacity-0 group-hover:opacity-100"
                        title="Remove from Queue"
                      >
                        <X className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* ── Fixed Bottom Quick-Add Delegate Bar (Zero Scroll Required) ── */}
          <footer className="h-14 bg-[#111318] border-t border-[#232731] px-4 flex items-center justify-between shrink-0 z-20">
            <form onSubmit={handleAddToQueue} className="flex items-center gap-2 sm:gap-3 w-full">
              <span className="text-xs font-mono uppercase text-[#9A9DA5] hidden sm:inline whitespace-nowrap">
                Quick Add:
              </span>
              <input
                className="bg-[#08090B] border border-[#232731] focus:border-[#C5A46D] text-xs text-[#F4F2ED] rounded-xl px-3 py-1.5 outline-none w-36 sm:w-44"
                placeholder="Country / Bench"
                value={newCountry}
                onChange={(e) => setNewCountry(e.target.value)}
              />
              <input
                className="bg-[#08090B] border border-[#232731] focus:border-[#C5A46D] text-xs text-[#F4F2ED] rounded-xl px-3 py-1.5 outline-none flex-1"
                placeholder="Delegate / Member Name (optional)"
                value={newDelegateName}
                onChange={(e) => setNewDelegateName(e.target.value)}
              />
              <DiasButton
                type="submit"
                variant="gold"
                size="sm"
                leftIcon={<Plus className="w-3.5 h-3.5" />}
              >
                Add to Queue
              </DiasButton>
            </form>
          </footer>
        </main>

        {/* ── RIGHT PANEL: Raised Hands & Motions ── */}
        <aside className="w-72 bg-[#0A0C0F] border-l border-[#181B21] p-4 flex flex-col justify-between shrink-0 hidden lg:flex overflow-y-auto">
          <div className="space-y-6">
            {/* Raised Hands Section */}
            <div className="space-y-3 text-left">
              <div className="flex items-center justify-between pb-1 border-b border-[#181B21]">
                <span className="text-xs font-semibold text-[#F4F2ED] uppercase tracking-wider flex items-center gap-1.5">
                  <Hand className="w-3.5 h-3.5 text-[#C5A46D]" />
                  Raised Hands ({raisedHands.length})
                </span>
                <span className="text-[10px] font-mono text-[#575B66]">Chamber</span>
              </div>

              {raisedHands.length === 0 ? (
                <p className="text-[11px] text-[#575B66]">No hands raised currently.</p>
              ) : (
                <div className="space-y-1.5">
                  {raisedHands.map((country) => (
                    <div
                      key={country}
                      className="p-2.5 rounded-xl bg-[#111318] border border-[#232731] flex items-center justify-between text-xs"
                    >
                      <span className="text-[#F4F2ED] font-medium">{country}</span>
                      <button
                        onClick={() => handleRecognizeHand(country)}
                        className="text-[11px] font-semibold text-[#C5A46D] hover:underline"
                      >
                        + Recognize
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Pending Procedural Motions */}
            <div className="space-y-3 text-left">
              <div className="flex items-center justify-between pb-1 border-b border-[#181B21]">
                <span className="text-xs font-semibold text-[#F4F2ED] uppercase tracking-wider flex items-center gap-1.5">
                  <SlidersHorizontal className="w-3.5 h-3.5 text-[#C5A46D]" />
                  Motions Deck ({pendingMotions.length})
                </span>
              </div>

              <div className="space-y-2">
                {pendingMotions.map((motion) => (
                  <div
                    key={motion.id}
                    className="p-3 rounded-xl bg-[#111318] border border-[#232731] space-y-2 text-left"
                  >
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-semibold text-[#E6D1A5]">
                        {motion.type}
                      </span>
                      {motion.totalTimeMin > 0 && (
                        <span className="text-[10px] font-mono text-[#C5A46D]">
                          {motion.totalTimeMin}m / {motion.speakerTimeSec}s
                        </span>
                      )}
                    </div>
                    <p className="text-xs text-[#F4F2ED] line-clamp-2">
                      {motion.topic}
                    </p>
                    <span className="text-[10px] text-[#9A9DA5] block">
                      By: {motion.proposedBy}
                    </span>

                    <div className="flex items-center justify-end gap-1.5 pt-1.5 border-t border-[#181B21]">
                      <button
                        onClick={() =>
                          setPendingMotions(pendingMotions.filter((m) => m.id !== motion.id))
                        }
                        className="px-2 py-1 rounded bg-[#181B21] text-[#F87171] text-[10px] font-semibold"
                      >
                        Reject
                      </button>
                      <button
                        onClick={() => {
                          daisAudio.playGavelStrike(0.9);
                          setPendingMotions(pendingMotions.filter((m) => m.id !== motion.id));
                          if (motion.type === 'Moderated Caucus') {
                            setActiveMode('MOD_CAUCUS');
                            setDurationSec(motion.speakerTimeSec);
                            setRemainingSec(motion.speakerTimeSec);
                          }
                        }}
                        className="px-2.5 py-1 rounded bg-[#C5A46D] text-[#08090B] text-[10px] font-bold"
                      >
                        Pass Motion
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className="p-3 rounded-2xl bg-[#111318] border border-[#232731] text-center space-y-1">
            <span className="text-[10px] font-mono uppercase text-[#C5A46D] block">
              DIAS HOTKEY
            </span>
            <p className="text-xs text-[#9A9DA5]">
              Press <kbd className="px-1.5 py-0.5 rounded bg-[#181B21] border border-[#2A2E39] text-[#E6D1A5] font-mono">[G]</kbd> for instant Gavel
            </p>
          </div>
        </aside>
      </div>

      {/* Bill Editor Modal */}
      <BillEditorModal
        isOpen={isBillEditorOpen}
        onClose={() => setIsBillEditorOpen(false)}
        committeeId="comm_lok_sabha_01"
        onBillCreated={(newBill) => {
          setBills([newBill, ...bills]);
          setActiveBill(newBill);
        }}
      />
    </div>
  );
};
