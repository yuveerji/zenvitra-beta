'use client';

import React, { useState, useEffect, useMemo } from 'react';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import {
  ShieldCheck,
  Award,
  Crown,
  Play,
  Pause,
  RotateCcw,
  Plus,
  Radio,
  Clock,
  Users,
  Flame,
  FileText,
  MessageSquare,
  Sparkles,
  ArrowRight,
  ArrowLeft,
  ChevronDown,
  Layers,
  Zap,
  Globe2,
  Lock,
  Volume2,
  VolumeX,
  CheckCircle2,
  AlertTriangle,
  Send,
  PlusCircle,
  Vote,
  Mic,
  Maximize2,
  Mail,
  Edit3,
  Gavel,
  Bookmark,
  BookmarkCheck,
  BookOpen,
  X,
  LifeBuoy
} from 'lucide-react';
import { useAuth } from '@/context/AuthContext';
import { isFounder, isAdmin } from '@/lib/founderControl';
import { useMun } from '@/context/MunContext';
import { MotionType, PointType, MunSessionMode, StagePerformer, MunCommitteeType } from '@/types/mun';
import { LiveVotingModal } from './LiveVotingModal';
import { LiveVotingCenter } from './LiveVotingCenter';
import { OpenMicStage } from './OpenMicStage';
import { HostChamberModal } from './HostChamberModal';
import { CreateChamberEventModal } from './CreateChamberEventModal';
import { NoEventsChamberState } from './NoEventsChamberState';
import { CustomTimerModal } from './CustomTimerModal';
import { FullscreenChamberView } from './FullscreenChamberView';
import { RollCallManagementModal } from './RollCallManagementModal';
import { DiplomaticChitsModal } from './DiplomaticChitsModal';
import { EditChamberDetailsModal } from './EditChamberDetailsModal';
import { OfficialSourcesModal } from './OfficialSourcesModal';
import { ConversationMemory } from './ConversationMemory';
import { LiveSpeakerQueue } from './LiveSpeakerQueue';
import { DelegatePerformanceRadar } from './DelegatePerformanceRadar';
import { MunSelectorBar } from './MunSelectorBar';
import { MunNotStartedView } from './MunNotStartedView';
import { ChamberDayHistoryModal } from './ChamberDayHistoryModal';
import { ChamberMatrixModal } from './ChamberMatrixModal';
import { CommitteeMatrixChatModal } from './CommitteeMatrixChatModal';
import { useMatrixChat } from '@/context/MatrixChatContext';
import { CommitteeSummaryPaperModal } from './CommitteeSummaryPaperModal';
import { CreateMunConferenceModal } from './CreateMunConferenceModal';
import { computeConferenceStatus } from '@/lib/conferenceStatusHelper';
import { LokSabhaDraftModal, UnDocsDraftModal } from '@/components/docs/modals';
import { ActiveEmergencyBroadcastBanner } from './ActiveEmergencyBroadcastBanner';
import { CommitteeLogoBadge } from './CommitteeLogoBadges';
import { daisAudio } from '@/lib/daisAudio';
import { DaisSupportHotlineModal } from './support/DaisSupportHotlineModal';
import { useRouter } from 'next/navigation';
import { ScrollText, FileCheck } from 'lucide-react';

export function CommitteeChamber() {
  const router = useRouter();
  const { user, profile } = useAuth();
  const {
    committees,
    activeCommitteeId,
    setActiveCommitteeId,
    getCommitteeById,
    updateCommitteeDetails,
    addCustomCommittee,
    deleteCommittee,
    clearFloorSession,
    sessionState,
    toggleTimer,
    resetTimer,
    setTimerSeconds,
    raiseMotion,
    startMotion,
    voteOnMotion,
    withdrawMotion,
    joinSpeakersList,
    advanceSpeaker,
    yieldSpeakerTime,
    raiseParliamentaryPoint,
    dismissPoint,
    sponsorResolution,
    signResolution,
    createDraftResolution,
    userInvites,
    registrations,
    activeVotingSession,
    votingSessions,
    stagePerformers,
    chamberRooms,
    conferences,
    activeConferenceId,
    activeConference,
    currentConferenceDay,
    passAndArchiveBill,
    setCommitteeWinners,
  } = useMun();

  const DEFAULT_COMMITTEE = {
    id: 'chamber-1',
    name: 'Assembly Committee Chamber',
    shortName: 'CHAMBER',
    type: 'UNSC' as const,
    agenda: 'General Deliberations & Resolution Mandate',
    presentCount: 0,
    presentAndVotingCount: 0,
    totalDelegates: 15,
    quorumNeeded: 8,
    dais: {
      chair: 'Presiding Officer',
      coChair: 'Rapporteur',
    },
    delegates: [],
  };

  const committee = getCommitteeById(activeCommitteeId) || committees[0] || DEFAULT_COMMITTEE;
  const isIndianCommittee = Boolean(
    committee.isIndianCommittee ||
    (committee.type as string) === 'LOK_SABHA' ||
    (committee.type as string) === 'AIPPM' ||
    (committee.type as string) === 'PARLIAMENTARY' ||
    committee.id?.toLowerCase().includes('lok') ||
    committee.name?.toLowerCase().includes('lok sabha') ||
    committee.name?.toLowerCase().includes('constituent') ||
    committee.shortName?.toLowerCase().includes('lok sabha')
  );
  const isLokSabhaChamber = isIndianCommittee;
  const userAcceptedInvite = userInvites.find(
    (i) => i.committeeId === activeCommitteeId && i.status === 'accepted'
  );

  const [isInPracticeMode, setIsInPracticeMode] = useState(false);
  const [showCreateEventModal, setShowCreateEventModal] = useState(false);
  const [showHostMunModal, setShowHostMunModal] = useState(false);

  const hasActiveEvent = userInvites.some((i) => i.status === 'accepted') || (registrations && registrations.length > 0) || Boolean(userAcceptedInvite);

  const [activeTab, setActiveTab] = useState<'motions' | 'voting' | 'open_mic' | 'speakers' | 'points' | 'resolutions' | 'memory' | 'analytics'>('motions');
  const [showRaiseMotionModal, setShowRaiseMotionModal] = useState(false);
  const [showRaisePointModal, setShowRaisePointModal] = useState(false);
  const [showDraftResolutionModal, setShowDraftResolutionModal] = useState(false);
  const [showLiveVotingModal, setShowLiveVotingModal] = useState(false);
  const [showHostChamberModal, setShowHostChamberModal] = useState(false);
  const [showCustomTimerModal, setShowCustomTimerModal] = useState(false);
  const [showFullscreenView, setShowFullscreenView] = useState(false);
  const [showRollCallModal, setShowRollCallModal] = useState(false);
  const [showDiplomaticChitsModal, setShowDiplomaticChitsModal] = useState(false);
  const [showEditChamberModal, setShowEditChamberModal] = useState(false);
  const [showOfficialSourcesModal, setShowOfficialSourcesModal] = useState(false);
  const [showDayHistoryModal, setShowDayHistoryModal] = useState(false);
  const [showSummaryPaperModal, setShowSummaryPaperModal] = useState(false);
  const [showLokSabhaDraftModal, setShowLokSabhaDraftModal] = useState(false);
  const [showUnDocsDraftModal, setShowUnDocsDraftModal] = useState(false);
  const [showMatrixChatModal, setShowMatrixChatModal] = useState(false);
  const [showPortfolioMatrixModal, setShowPortfolioMatrixModal] = useState(false);
  const [showDaisSupportModal, setShowDaisSupportModal] = useState(false);
  const { getRoom } = useMatrixChat();

  const activeMatrixRoom = useMemo(() => {
    if (!committee) return undefined;
    const targetMunId = activeConference?.id || committee.eventId || 'chamber';
    const targetCommId = committee.shortName || committee.id;
    const targetDate = activeConference?.startDate || new Date().toISOString().slice(0, 10);
    return getRoom(targetMunId, targetCommId, targetDate);
  }, [committee, activeConference, getRoom]);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const params = new URLSearchParams(window.location.search);
      if (params.get('matrix') === 'connect' || params.get('matrix') === 'true' || params.get('connect') === 'matrix') {
        setShowMatrixChatModal(true);
      }
    }
  }, []);

  // New Motion Form State
  const [motionType, setMotionType] = useState<MotionType>('MODERATED_CAUCUS');
  const [motionTopic, setMotionTopic] = useState('');
  const [motionTotalMinutes, setMotionTotalMinutes] = useState(10);
  const [motionSpeakerSeconds, setMotionSpeakerSeconds] = useState(60);

  // New Point Form State
  const [pointType, setPointType] = useState<PointType>('ORDER');
  const [pointDetail, setPointDetail] = useState('');

  // New Draft Resolution State
  const [resCode, setResCode] = useState('UNSC RES/2026/1.2');
  const [resTitle, setResTitle] = useState('');
  const [resPreamble, setResPreamble] = useState('');
  const [resOperative, setResOperative] = useState('');

  // Custom Committee / Event Name Quick Preset state
  const [customCommitteeInput, setCustomCommitteeInput] = useState('');
  const [customAgendaInput, setCustomAgendaInput] = useState('');
  const [presetSavedNotice, setPresetSavedNotice] = useState(false);

  // Fast Create New Committee Modal State
  const [showCreateCommitteeModal, setShowCreateCommitteeModal] = useState(false);
  const [newCommName, setNewCommName] = useState('');
  const [newCommShortName, setNewCommShortName] = useState('');
  const [newCommAgenda, setNewCommAgenda] = useState('');
  const [newCommType, setNewCommType] = useState<MunCommitteeType>('UNSC');
  const [newCommDelegates, setNewCommDelegates] = useState(15);

  // Inline Agenda Edit State
  const [isEditingAgenda, setIsEditingAgenda] = useState(false);
  const [agendaInputValue, setAgendaInputValue] = useState('');

  // Gavel Strike state & Audio Synthesizer
  const [gavelActive, setGavelActive] = useState(false);
  const [soundActive, setSoundActive] = useState(true);

  useEffect(() => {
    setSoundActive(daisAudio.isEnabled());
  }, []);

  const playGavelSound = () => {
    daisAudio.playDoubleGavel();
    setGavelActive(true);
    setTimeout(() => setGavelActive(false), 2400);
  };

  // Keyboard Shortcuts for Committee Chamber (Gavelling standard)
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (
        (e.target as HTMLElement)?.tagName === 'INPUT' ||
        (e.target as HTMLElement)?.tagName === 'TEXTAREA' ||
        (e.target as HTMLElement)?.tagName === 'SELECT'
      ) {
        return;
      }
      if (e.code === 'Space') {
        e.preventDefault();
        toggleTimer();
      } else if (e.key === 'g' || e.key === 'G') {
        e.preventDefault();
        playGavelSound();
      } else if (e.key === 'p' || e.key === 'P') {
        e.preventDefault();
        setShowFullscreenView(true);
      } else if (e.key === 'r' || e.key === 'R') {
        e.preventDefault();
        resetTimer(sessionState.timer.totalSeconds || 90, sessionState.timer.label, sessionState.sessionMode);
      } else if (e.key === 'm' || e.key === 'M') {
        e.preventDefault();
        setShowRaiseMotionModal(true);
      } else if (e.key === 'v' || e.key === 'V') {
        e.preventDefault();
        setShowLiveVotingModal(true);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [toggleTimer, resetTimer, sessionState.timer]);

  // Format MM:SS
  const formatTime = (sec: number) => {
    const m = Math.floor(sec / 60);
    const s = sec % 60;
    return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  };

  const timerPercentage = (sessionState?.timer?.totalSeconds ?? 0) > 0
    ? ((sessionState?.timer?.remainingSeconds ?? 0) / (sessionState?.timer?.totalSeconds ?? 1)) * 100
    : 0;

  const handleRaiseMotionSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!motionTopic.trim()) return;
    raiseMotion(motionType, motionTopic.trim(), motionTotalMinutes, motionSpeakerSeconds);
    setMotionTopic('');
    setShowRaiseMotionModal(false);
  };

  const handleRaisePointSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!pointDetail.trim()) return;
    raiseParliamentaryPoint(pointType, pointDetail.trim());
    setPointDetail('');
    setShowRaisePointModal(false);
  };

  const handleCreateResolutionSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!resTitle.trim()) return;
    const preambles = resPreamble.split('\n').filter((p) => p.trim().length > 0);
    const operatives = resOperative.split('\n').filter((o) => o.trim().length > 0);
    createDraftResolution(resCode, resTitle.trim(), preambles, operatives);
    setResTitle('');
    setResPreamble('');
    setResOperative('');
    setShowDraftResolutionModal(false);
  };

  const cleanUsername = (profile?.username || (user as any)?.user_metadata?.username || user?.email?.split('@')[0] || '').toLowerCase().trim().replace(/^@/, '');
  const userRole = (((profile as any)?.role) || ((user as any)?.role) || '').toLowerCase().trim();
  const isSecTeam = Boolean(
    cleanUsername === 'yuveer' ||
    cleanUsername === 'founder' ||
    cleanUsername.includes('founder') ||
    isFounder(cleanUsername, profile?.role as any) ||
    isAdmin(cleanUsername, profile?.role as any) ||
    userRole === 'secretariat' ||
    userRole === 'secretariat_chair' ||
    userRole === 'organizer' ||
    userRole === 'admin'
  );

  const conferenceStatusInfo = computeConferenceStatus(activeConference);

  // Auto-sync active committee if none is selected but committees exist
  useEffect(() => {
    if ((!activeCommitteeId || !committees.some((c) => c.id === activeCommitteeId)) && committees.length > 0) {
      setActiveCommitteeId(committees[0].id);
    }
  }, [activeCommitteeId, committees, setActiveCommitteeId]);

  const hasSelectedCommittee = Boolean(
    activeCommitteeId && (
      committees.some((c) => c.id === activeCommitteeId) ||
      chamberRooms.some((r) => r.id === activeCommitteeId) ||
      Boolean(getCommitteeById(activeCommitteeId))
    )
  );
  const hasAnyChambers = committees.length > 0 || chamberRooms.length > 0;
  const isConferenceLive = Boolean(activeConference && conferenceStatusInfo.isLive && conferenceStatusInfo.status !== 'NOT_STARTED');

  if (!hasSelectedCommittee && !hasAnyChambers && !isConferenceLive) {
    return (
      <div className="w-full min-h-[calc(100vh-6rem)] flex flex-col font-sans text-neutral-100 select-none space-y-6 pb-12">
        <MunSelectorBar
          isEmbedded={true}
          onOpenHistory={() => setShowDayHistoryModal(true)}
          onOpenSummary={() => setShowSummaryPaperModal(true)}
          onOpenInstantEvent={() => setShowCreateEventModal(true)}
          onOpenMatrix={() => setShowMatrixChatModal(true)}
        />
        <MunNotStartedView 
          onCreateInstantEvent={() => setShowCreateEventModal(true)}
          onHostNewEvent={() => setShowHostMunModal(true)}
        />
        <CreateChamberEventModal
          isOpen={showCreateEventModal}
          onClose={() => setShowCreateEventModal(false)}
        />
        <CreateMunConferenceModal
          isOpen={showHostMunModal}
          onClose={() => setShowHostMunModal(false)}
        />
        <ChamberDayHistoryModal
          isOpen={showDayHistoryModal}
          onClose={() => setShowDayHistoryModal(false)}
          committeeName={committee?.name || 'Chamber'}
        />
        <CommitteeSummaryPaperModal
          isOpen={showSummaryPaperModal}
          onClose={() => setShowSummaryPaperModal(false)}
          committee={committee}
        />
      </div>
    );
  }

  return (
    <div className="w-full min-h-[calc(100vh-6rem)] flex flex-col font-sans text-neutral-100 select-none space-y-6 pb-12">
      <ActiveEmergencyBroadcastBanner currentCommitteeId={activeCommitteeId} allowDismiss={false} />

      <MunSelectorBar
        isEmbedded={true}
        onOpenHistory={() => setShowDayHistoryModal(true)}
        onOpenSummary={() => setShowSummaryPaperModal(true)}
        onOpenInstantEvent={() => setShowCreateEventModal(true)}
        onOpenMatrix={() => setShowMatrixChatModal(true)}
      />
      
      {/* ─────────────────────────────────────────────────────────────
          1. TOP DAIS BANNER & COMMITTEE SELECTOR
      ───────────────────────────────────────────────────────────── */}
      <div className="relative z-10 p-5 sm:p-7 rounded-3xl bg-[#0a0c10] border border-white/10 shadow-xl backdrop-blur-3xl overflow-visible">
        {/* Subtle Ambient Light */}
        <div className="absolute -top-16 left-1/4 w-96 h-32 bg-white/[0.02] blur-[90px] rounded-full pointer-events-none" />

        <div className="space-y-4 relative z-10 w-full">
          {/* Back & Breadcrumb & Format Tags */}
          <div className="flex flex-wrap items-center justify-between gap-2.5">
            <div className="flex flex-wrap items-center gap-2 sm:gap-3">
              <Link
                href="/events"
                className="p-1.5 px-2.5 rounded-xl bg-white/[0.04] hover:bg-white/[0.08] text-neutral-400 hover:text-white transition flex items-center gap-1.5 text-xs font-mono"
              >
                <ArrowLeft className="w-3.5 h-3.5" />
                <span>Events</span>
              </Link>
              <span className="text-neutral-700">&bull;</span>
              <div className="flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-emerald-500/10 border border-emerald-500/25 text-[10px] font-mono text-emerald-400 font-medium">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                SESSION #{sessionState.sessionNumber} &bull; IN ORDER
              </div>
              <span className="px-2.5 py-0.5 rounded-full bg-white/[0.04] border border-white/10 text-[10px] font-mono text-neutral-300 font-medium">
                {String(committee.type || 'PARLIAMENTARY').replace(/_/g, ' ')}
              </span>
              {activeMatrixRoom && activeMatrixRoom.status === 'ACTIVE' && (
                <div 
                  onClick={() => setShowMatrixChatModal(true)}
                  className="flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-cyan-500/15 border border-cyan-500/30 text-[10px] font-mono text-cyan-300 font-bold cursor-pointer hover:bg-cyan-500/25 transition shadow-sm"
                  title={`Matrix Room Active: ${activeMatrixRoom.matrixRoomAlias}`}
                >
                  <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 animate-pulse" />
                  <span>MATRIX: {activeMatrixRoom.matrixRoomAlias.split(':')[0]}</span>
                </div>
              )}
            </div>

            <div className="flex items-center gap-2 px-3 py-1 rounded-xl bg-white/[0.03] border border-white/10 text-xs font-mono text-neutral-300">
              <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 animate-pulse" />
              <span>{activeConference?.shortName || activeConference?.name || 'CONFERENCE'} &bull; DAY {currentConferenceDay}</span>
            </div>
          </div>

          {/* Committee Name Selector & Action Controls */}
          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-3 w-full">
            <div className="flex items-center gap-2.5 min-w-0 flex-1 max-w-full lg:max-w-xl xl:max-w-2xl">
              {/* Chamber Insignia or Emblem Badge */}
              {committee?.iconUrl ? (
                <img
                  src={committee.iconUrl}
                  alt="Chamber Crest"
                  className="w-10 h-10 sm:w-11 sm:h-11 rounded-2xl object-cover border border-amber-400/30 bg-black/60 shadow-md shadow-amber-500/10 shrink-0"
                />
              ) : committee?.logoKey ? (
                <div className="w-10 h-10 sm:w-11 sm:h-11 rounded-2xl bg-white/[0.05] border border-white/15 flex items-center justify-center shadow-inner shrink-0 overflow-hidden">
                  <CommitteeLogoBadge logoKey={committee.logoKey} size={32} />
                </div>
              ) : (
                <div className="w-10 h-10 sm:w-11 sm:h-11 rounded-2xl bg-white/[0.05] border border-white/15 flex items-center justify-center text-xl sm:text-2xl shadow-inner shrink-0">
                  {committee?.emblem || '🇺🇳'}
                </div>
              )}

              <div className="relative flex-1 min-w-0">
                <select
                  value={activeCommitteeId}
                  onChange={(e) => setActiveCommitteeId(e.target.value)}
                  className="appearance-none w-full bg-[#111319] border border-white/15 hover:border-white/30 text-white font-display font-semibold text-base sm:text-xl lg:text-2xl px-3.5 sm:px-4 py-2.5 pr-10 rounded-2xl cursor-pointer focus:outline-none transition shadow-inner truncate"
                >
                  {committees.map((c) => {
                    const isOther = c.id === 'custom-chamber-other' || c.type === 'OTHER';
                    const displayName = isOther
                      ? `Other / Custom Forum${c.name && c.name !== 'Universal Youth Assembly & Multidisciplinary Forum' ? `: ${c.name}` : ''}`
                      : (c.name.includes(`(${c.shortName})`) ? c.name : `${c.name} (${c.shortName})`);
                    return (
                      <option key={c.id} value={c.id} className="bg-black text-white font-sans text-sm">
                        {displayName}
                      </option>
                    );
                  })}
                </select>
                <ChevronDown className="w-4 h-4 sm:w-5 sm:h-5 text-neutral-400 absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none" />
              </div>

              {/* + New Committee Button (Fast creation like MUN Command app) */}
              <button
                type="button"
                onClick={() => {
                  setNewCommName('');
                  setNewCommShortName('');
                  setNewCommAgenda('');
                  setShowCreateCommitteeModal(true);
                }}
                className="px-3.5 py-3 rounded-2xl bg-cyan-500/15 hover:bg-cyan-500/25 border border-cyan-500/30 text-cyan-300 font-mono text-xs font-bold transition flex items-center gap-1.5 cursor-pointer shrink-0 shadow-sm active:scale-95 whitespace-nowrap group"
                title="Create & Start New Committee (MUN Command style)"
              >
                <Plus className="w-4 h-4 group-hover:rotate-90 transition-transform" />
                <span className="hidden sm:inline">New Committee</span>
                <span className="sm:hidden">New</span>
              </button>

              {/* + Create Instant Event Button */}
              <button
                type="button"
                onClick={() => setShowCreateEventModal(true)}
                className="px-3.5 py-3 rounded-2xl bg-gradient-to-r from-amber-500/20 via-cyan-500/20 to-emerald-500/20 hover:from-amber-500/30 hover:via-cyan-500/30 hover:to-emerald-500/30 border border-amber-400/40 text-amber-200 font-mono text-xs font-bold transition flex items-center gap-1.5 cursor-pointer shrink-0 shadow-sm active:scale-95 whitespace-nowrap group"
                title="Create an Instant Event (Launch Live Chamber / Room Now)"
              >
                <Zap className="w-4 h-4 text-amber-300 fill-amber-300 group-hover:scale-110 transition-transform" />
                <span className="hidden sm:inline">Instant Event</span>
                <span className="sm:hidden">Instant</span>
              </button>
            </div>

            {/* Action Bar (Observer, Gavel, Edit Details, Secretariat) */}
            <div className="flex items-center flex-wrap gap-2 shrink-0">
              {/* Delegate Passport Badge */}
              {userAcceptedInvite ? (
                <div className="px-3.5 py-2 rounded-2xl bg-white/[0.04] border border-white/10 text-neutral-200 font-mono text-xs font-medium flex items-center gap-2 shadow-sm shrink-0 whitespace-nowrap">
                  <span>{userAcceptedInvite.flagEmoji}</span>
                  <span>{userAcceptedInvite.portfolio} (You)</span>
                </div>
              ) : (
                <div className="px-3.5 py-2 rounded-2xl bg-white/[0.04] border border-white/10 text-neutral-400 font-mono text-xs flex items-center gap-1.5 shrink-0 whitespace-nowrap">
                  <Globe2 className="w-3.5 h-3.5 text-neutral-400" />
                  <span>Observer Node</span>
                </div>
              )}

              {/* Interactive Dais Gavel Button */}
              <button
                type="button"
                onClick={playGavelSound}
                className={`p-2 px-3.5 rounded-2xl border font-mono text-xs font-semibold transition flex items-center gap-2 cursor-pointer shadow-sm active:scale-95 shrink-0 whitespace-nowrap ${
                  gavelActive
                    ? 'bg-emerald-500/15 border-emerald-500/40 text-emerald-300 shadow-[0_0_20px_rgba(16,185,129,0.3)]'
                    : 'bg-white/[0.04] hover:bg-white/[0.08] border-white/10 text-neutral-300 hover:border-white/20'
                }`}
                title="Strike Dais Gavel (Call Floor to Order)"
              >
                {gavelActive ? (
                  <div className="flex items-center gap-1.5">
                    <span className="relative flex h-2 w-2">
                      <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
                      <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-400 shadow-[0_0_8px_#34d399]" />
                    </span>
                    <Gavel className="w-3.5 h-3.5 text-emerald-300 rotate-[-15deg] transition-transform" />
                    <span>In Order</span>
                  </div>
                ) : (
                  <>
                    <Gavel className="w-3.5 h-3.5 text-neutral-400 transition-transform" />
                    <span>Dais Gavel</span>
                  </>
                )}
              </button>

              {/* Projector View / Stage Mode Button (Gavelling Style) */}
              <button
                type="button"
                onClick={() => setShowFullscreenView(true)}
                className="p-2 px-3.5 rounded-2xl bg-amber-500/10 hover:bg-amber-500/20 border border-amber-500/30 text-amber-300 font-mono text-xs font-semibold transition flex items-center gap-1.5 cursor-pointer shadow-sm active:scale-95 shrink-0 whitespace-nowrap group"
                title="Launch Projector View for Room Screens [P]"
              >
                <Maximize2 className="w-3.5 h-3.5 group-hover:scale-110 transition-transform" />
                <span>Projector [P]</span>
              </button>

              {/* Dais Audio Toggle */}
              <button
                type="button"
                onClick={() => {
                  const next = daisAudio.toggle();
                  setSoundActive(next);
                }}
                className={`p-2 px-3 rounded-2xl border font-mono text-xs font-semibold transition flex items-center gap-1.5 cursor-pointer shadow-sm active:scale-95 shrink-0 whitespace-nowrap ${
                  soundActive
                    ? 'bg-white/[0.04] hover:bg-white/[0.08] border-white/10 text-neutral-300'
                    : 'bg-red-500/10 border-red-500/30 text-red-400'
                }`}
                title={soundActive ? 'Mute Dais Sound Effects' : 'Unmute Dais Sound Effects'}
              >
                {soundActive ? <Volume2 className="w-3.5 h-3.5 text-emerald-400" /> : <VolumeX className="w-3.5 h-3.5" />}
                <span className="hidden sm:inline">{soundActive ? 'Audio ON' : 'Audio OFF'}</span>
              </button>

              {/* Connect Matrix Button */}
              <button
                type="button"
                onClick={() => setShowMatrixChatModal(true)}
                className="p-2 px-3.5 rounded-2xl bg-cyan-500/15 hover:bg-cyan-500/25 border border-cyan-500/40 text-cyan-300 font-mono text-xs font-semibold transition flex items-center gap-1.5 cursor-pointer shadow-sm shadow-cyan-500/10 shrink-0 whitespace-nowrap active:scale-95 group"
                title="Connect Matrix — Dedicated committee-based federated conversation room"
              >
                <Layers className="w-3.5 h-3.5 text-cyan-400 group-hover:rotate-12 transition-transform" />
                <span>Connect Matrix</span>
                {activeMatrixRoom && activeMatrixRoom.status === 'ACTIVE' && (
                  <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse ml-0.5" title="Matrix Room Active" />
                )}
              </button>

              {/* Country Portfolio Matrix Button */}
              <button
                type="button"
                onClick={() => setShowPortfolioMatrixModal(true)}
                className="p-2 px-3 rounded-2xl bg-white/[0.04] hover:bg-white/[0.08] border border-white/10 text-neutral-300 font-mono text-xs font-semibold transition flex items-center gap-1.5 cursor-pointer shrink-0 whitespace-nowrap active:scale-95"
                title="View Country Delegation Matrix"
              >
                <Users className="w-3.5 h-3.5 text-neutral-400" />
                <span className="hidden md:inline">Country Matrix</span>
              </button>

              {/* Quick Committee Setup Studio Button */}
              <Link
                href="/committee/create"
                className="p-2 px-3.5 rounded-2xl bg-gradient-to-r from-amber-400 to-amber-500 hover:brightness-110 text-black font-sans text-xs font-extrabold transition flex items-center gap-1.5 cursor-pointer shadow-md shadow-amber-500/20 shrink-0 whitespace-nowrap active:scale-95"
                title="Instant Committee & Dais Setup Studio (Quick Bundles, Roster Builder & Roll Call)"
              >
                <Plus className="w-3.5 h-3.5 stroke-[2.5]" />
                <span>New Committee Session</span>
              </Link>

              {/* Create Instant Event Button */}
              <button
                type="button"
                onClick={() => setShowCreateEventModal(true)}
                className="p-2 px-3.5 rounded-2xl bg-gradient-to-r from-amber-500/15 via-cyan-500/15 to-emerald-500/15 hover:from-amber-500/25 hover:via-cyan-500/25 hover:to-emerald-500/25 border border-amber-400/40 text-amber-200 font-mono text-xs font-bold transition flex items-center gap-1.5 cursor-pointer shadow-sm shrink-0 whitespace-nowrap active:scale-95 group"
                title="Create an Instant Event (Launch Live Chamber / Room Now)"
              >
                <Zap className="w-3.5 h-3.5 text-amber-300 fill-amber-300 group-hover:scale-110 transition-transform" />
                <span>Instant Event</span>
              </button>

              {/* Customize Committee, Agenda & Portfolios Button */}
              <button
                type="button"
                onClick={() => setShowEditChamberModal(true)}
                className="p-2 px-3.5 rounded-2xl bg-white/[0.04] hover:bg-white/[0.08] border border-white/10 text-neutral-300 font-mono text-xs font-medium transition flex items-center gap-1.5 cursor-pointer shadow-sm shrink-0 whitespace-nowrap active:scale-95"
                title="Customize Committee Name, Set Agenda & Define Portfolios"
              >
                <Edit3 className="w-3.5 h-3.5 text-neutral-400" />
                <span>Edit Details</span>
              </button>

              {/* Reset Floor / New Session */}
              <button
                type="button"
                onClick={() => {
                  if (window.confirm(`Reset floor session for ${committee.name}? This will clear active motions, reset the clock to 90s GSL, and clear the speakers list.`)) {
                    clearFloorSession(committee.id);
                  }
                }}
                className="p-2 px-3.5 rounded-2xl bg-red-500/10 hover:bg-red-500/20 border border-red-500/30 text-red-300 font-mono text-xs font-semibold transition flex items-center gap-1.5 cursor-pointer shadow-sm shrink-0 whitespace-nowrap active:scale-95"
                title="Reset Floor (Clears current motion, resets timer to 90s, and clears speaker list)"
              >
                <RotateCcw className="w-3.5 h-3.5 text-red-400" />
                <span>Reset Floor</span>
              </button>

              {/* Direct Connect to Secretariat Command Center */}
              {isSecTeam && (
                <Link
                  href="/mun/conference"
                  className="p-2 px-3.5 rounded-2xl bg-neutral-900 hover:bg-neutral-800 border border-neutral-700 text-neutral-200 font-mono text-xs font-semibold transition flex items-center gap-1.5 cursor-pointer shadow-sm shrink-0 whitespace-nowrap active:scale-95"
                  title="Return to Secretariat Conference Command Center"
                >
                  <Crown className="w-3.5 h-3.5 text-amber-400" />
                  <span>Secretariat</span>
                </Link>
              )}
            </div>
          </div>

          {/* Quick Custom Committee / Event Name Placeholder & Save Preset Bar */}
          {(activeCommitteeId === 'custom-chamber-other' || committee.id === 'custom-chamber-other' || committee.type === 'OTHER') && (
            <motion.div
              initial={{ opacity: 0, y: -6 }}
              animate={{ opacity: 1, y: 0 }}
              className="p-3.5 rounded-2xl bg-white/[0.03] border border-white/10 backdrop-blur-md space-y-2.5 max-w-3xl shadow-lg"
            >
              <div className="flex items-center justify-between gap-2">
                <div className="flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-neutral-400" />
                  <span className="text-[11px] font-mono font-medium uppercase tracking-wider text-neutral-300 flex items-center gap-1.5">
                    <Sparkles className="w-3.5 h-3.5 text-neutral-400" />
                    Custom Committee / Event Builder
                  </span>
                </div>
                {presetSavedNotice && (
                  <span className="text-[10px] font-mono text-emerald-400 flex items-center gap-1 font-medium">
                    <BookmarkCheck className="w-3.5 h-3.5" />
                    Preset Saved to Chamber!
                  </span>
                )}
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-12 gap-2">
                <input
                  type="text"
                  value={customCommitteeInput}
                  onChange={(e) => setCustomCommitteeInput(e.target.value)}
                  placeholder="Enter custom committee or event name (e.g. Oxford Union Debate, COP31 Youth Caucus)"
                  className="sm:col-span-6 bg-black/60 border border-white/15 hover:border-white/30 focus:border-white/50 px-3.5 py-2 rounded-xl text-xs sm:text-sm text-white placeholder-neutral-500 focus:outline-none font-sans"
                />
                <input
                  type="text"
                  value={customAgendaInput}
                  onChange={(e) => setCustomAgendaInput(e.target.value)}
                  placeholder="Enter debate agenda / mandate (e.g. AI Governance & Climate Action)"
                  className="sm:col-span-4 bg-black/60 border border-white/15 hover:border-white/30 focus:border-white/50 px-3.5 py-2 rounded-xl text-xs sm:text-sm text-white placeholder-neutral-500 focus:outline-none font-mono"
                />
                <button
                  type="button"
                  onClick={() => {
                    const name = customCommitteeInput.trim() || 'Custom Committee';
                    const agenda = customAgendaInput.trim() || 'Deliberation & Consensus Mandate';
                    addCustomCommittee({
                      name,
                      shortName: name.slice(0, 10).toUpperCase(),
                      agenda,
                      type: 'OTHER'
                    });
                    setCustomCommitteeInput('');
                    setCustomAgendaInput('');
                    setPresetSavedNotice(true);
                    setTimeout(() => setPresetSavedNotice(false), 3500);
                  }}
                  className="sm:col-span-2 px-3.5 py-2 rounded-xl bg-white hover:bg-neutral-200 text-black font-display font-semibold text-xs transition cursor-pointer flex items-center justify-center gap-1.5 active:scale-95 shrink-0"
                  title="Save as reusable committee preset"
                >
                  <Bookmark className="w-3.5 h-3.5" />
                  <span>Save Preset</span>
                </button>
              </div>
            </motion.div>
          )}

          {/* Agenda Mandate Banner (Inline Editable like MUN Command) */}
          <div className="p-3.5 px-4 rounded-2xl bg-white/[0.02] border border-white/10 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 shadow-inner">
            <div className="flex items-start sm:items-center gap-3 flex-1 min-w-0 w-full">
              <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-cyan-400 shrink-0 px-2.5 py-0.5 rounded-lg bg-cyan-500/10 border border-cyan-500/20">
                AGENDA
              </span>
              {isEditingAgenda ? (
                <div className="flex-1 flex flex-col sm:flex-row items-stretch sm:items-center gap-2 w-full">
                  <input
                    type="text"
                    value={agendaInputValue}
                    onChange={(e) => setAgendaInputValue(e.target.value)}
                    placeholder="Enter debate agenda mandate..."
                    className="flex-1 bg-black/60 border border-cyan-500/40 focus:border-cyan-400 px-3 py-1.5 rounded-xl text-xs sm:text-sm text-white placeholder-neutral-500 focus:outline-none font-mono"
                    autoFocus
                  />
                  <div className="flex items-center gap-1.5 shrink-0">
                    <button
                      type="button"
                      onClick={() => {
                        const trimmed = agendaInputValue.trim();
                        if (trimmed) {
                          updateCommitteeDetails(committee.id, { agenda: trimmed });
                        }
                        setIsEditingAgenda(false);
                      }}
                      className="px-3 py-1.5 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-black font-mono font-semibold text-xs transition cursor-pointer active:scale-95 flex items-center gap-1"
                    >
                      <CheckCircle2 className="w-3 h-3" />
                      <span>Save</span>
                    </button>
                    <button
                      type="button"
                      onClick={() => setIsEditingAgenda(false)}
                      className="px-2.5 py-1.5 rounded-xl bg-white/[0.06] hover:bg-white/[0.1] text-neutral-300 font-mono text-xs transition cursor-pointer active:scale-95"
                    >
                      Cancel
                    </button>
                  </div>
                </div>
              ) : (
                <span className="text-xs sm:text-sm text-neutral-200 font-mono leading-relaxed truncate">
                  {committee.agenda || 'No agenda set. Click edit to set agenda.'}
                </span>
              )}
            </div>
            {!isEditingAgenda && (
              <button
                type="button"
                onClick={() => {
                  setAgendaInputValue(committee.agenda || '');
                  setIsEditingAgenda(true);
                }}
                className="px-2.5 py-1 rounded-xl bg-white/[0.04] hover:bg-white/[0.08] text-neutral-400 hover:text-cyan-300 font-mono text-xs transition flex items-center gap-1 cursor-pointer shrink-0"
                title="Edit committee agenda"
              >
                <Edit3 className="w-3 h-3" />
                <span>Edit</span>
              </button>
            )}
          </div>
        </div>
      </div>

      {/* ─────────────────────────────────────────────────────────────
          2. UNCONSTRAINED DAIS COMMAND & ACTION TOOLBAR (OUTSIDE CARD)
      ───────────────────────────────────────────────────────────── */}
      <div className="w-full flex flex-wrap items-center justify-between gap-3 p-3 sm:p-3.5 rounded-2xl bg-[#0a0c10]/95 border border-white/10 shadow-xl backdrop-blur-2xl">
        {/* Left: Operational Chamber Utilities */}
        <div className="flex items-center flex-wrap gap-2 sm:gap-2.5">
          {/* Quorum Trigger Button */}
          <button
            type="button"
            onClick={() => setShowRollCallModal(true)}
            className="px-3.5 py-2 rounded-xl bg-white/[0.05] hover:bg-white/[0.1] border border-white/10 hover:border-white/20 text-left transition cursor-pointer group flex items-center gap-2.5 shrink-0 whitespace-nowrap shadow-sm active:scale-95"
            title="Open Roll Call & Quorum Intelligence"
          >
            <Users className="w-4 h-4 text-cyan-400 shrink-0" />
            <div className="flex items-center gap-1.5 font-mono text-xs">
              <span className="text-[10px] font-bold text-neutral-400 uppercase tracking-wider">
                QUORUM:
              </span>
              <span className="font-semibold text-neutral-200">
                {committee.presentCount > 0 ? (
                  `${committee.presentCount}/${committee.totalDelegates || 15}`
                ) : (
                  `0/${committee.totalDelegates || 15}`
                )}
              </span>
            </div>
          </button>

          {/* Segmented Dais Controls */}
          <div className="flex items-center flex-wrap gap-1.5 sm:gap-2">
            {/* Custom Timer Trigger */}
            <button
              type="button"
              onClick={() => setShowCustomTimerModal(true)}
              className="px-3 py-2 rounded-xl bg-white/[0.04] hover:bg-white/[0.08] text-neutral-300 hover:text-white border border-white/10 font-mono text-xs font-semibold transition flex items-center gap-1.5 cursor-pointer shrink-0 whitespace-nowrap active:scale-95"
              title="Configure Custom Caucus Time (MM:SS)"
            >
              <Clock className="w-3.5 h-3.5 text-neutral-400 shrink-0" />
              <span>Timer</span>
            </button>

            {/* Projector Fullscreen View */}
            <button
              type="button"
              onClick={() => setShowFullscreenView(true)}
              className="px-3 py-2 rounded-xl bg-white/[0.04] hover:bg-white/[0.08] text-neutral-300 hover:text-white border border-white/10 font-mono text-xs font-semibold transition flex items-center gap-1.5 cursor-pointer shrink-0 whitespace-nowrap active:scale-95"
              title="Stage Projector Mode (ESC to exit)"
            >
              <Maximize2 className="w-3.5 h-3.5 text-neutral-400 shrink-0" />
              <span>Stage</span>
            </button>

            {/* Diplomatic Chits */}
            <button
              type="button"
              onClick={() => setShowDiplomaticChitsModal(true)}
              className="px-3 py-2 rounded-xl bg-white/[0.04] hover:bg-white/[0.08] text-neutral-300 hover:text-white border border-white/10 font-mono text-xs font-semibold transition flex items-center gap-1.5 cursor-pointer shrink-0 whitespace-nowrap active:scale-95"
              title="Diplomatic Chits & Page Messenger"
            >
              <Mail className="w-3.5 h-3.5 text-neutral-400 shrink-0" />
              <span>Chits</span>
            </button>

            {/* Official Sources & Media Reference Hub */}
            <button
              type="button"
              onClick={() => setShowOfficialSourcesModal(true)}
              className="px-3 py-2 rounded-xl bg-white/[0.04] hover:bg-white/[0.08] text-neutral-300 hover:text-white border border-white/10 font-mono text-xs font-semibold transition flex items-center gap-1.5 cursor-pointer shrink-0 whitespace-nowrap active:scale-95"
              title="Official Sources & Reference Material"
            >
              <BookOpen className="w-3.5 h-3.5 text-neutral-400 shrink-0" />
              <span>Sources</span>
            </button>

            {/* Dais Support & Secretariat Hotline */}
            <button
              type="button"
              onClick={() => setShowDaisSupportModal(true)}
              className="px-3 py-2 rounded-xl bg-cyan-500/10 hover:bg-cyan-500/20 text-cyan-300 border border-cyan-500/30 font-mono text-xs font-semibold transition flex items-center gap-1.5 cursor-pointer shrink-0 whitespace-nowrap active:scale-95"
              title="Dais & Secretariat Real-Time Support Hotline"
            >
              <LifeBuoy className="w-3.5 h-3.5 text-cyan-400 shrink-0" />
              <span>Dais Support</span>
            </button>

            {/* Direct ZEN.LEGISLATE / ZEN.DOCS Drafting Gateway */}
            {isIndianCommittee ? (
              <button
                type="button"
                onClick={() => setShowLokSabhaDraftModal(true)}
                className="px-3.5 py-2 rounded-xl bg-amber-500/15 hover:bg-amber-500/25 text-amber-300 border border-amber-500/40 font-mono text-xs font-bold transition flex items-center gap-1.5 cursor-pointer shrink-0 whitespace-nowrap shadow-[0_0_15px_rgba(245,158,11,0.2)] active:scale-95"
                title="ZEN.LEGISLATE — Draft Parliamentary Bill or Press Release"
              >
                <Gavel className="w-3.5 h-3.5 text-amber-400 shrink-0" />
                <span>ZEN.LEGISLATE</span>
              </button>
            ) : (
              <button
                type="button"
                onClick={() => setShowUnDocsDraftModal(true)}
                className="px-3.5 py-2 rounded-xl bg-cyan-500/15 hover:bg-cyan-500/25 text-cyan-300 border border-cyan-500/40 font-mono text-xs font-bold transition flex items-center gap-1.5 cursor-pointer shrink-0 whitespace-nowrap shadow-[0_0_15px_rgba(6,182,212,0.2)] active:scale-95"
                title="ZEN.DOCS Multilateral Drafting Studio"
              >
                <ScrollText className="w-3.5 h-3.5 text-cyan-400 shrink-0" />
                <span>ZEN.DOCS</span>
              </button>
            )}
          </div>
        </div>

        {/* Right: Key Floor Actions */}
        <div className="flex items-center gap-2 shrink-0">
          {/* Live Vote Trigger */}
          <button
            type="button"
            onClick={() => setShowLiveVotingModal(true)}
            className="px-4 py-2 rounded-xl bg-white hover:bg-neutral-200 text-black font-display font-semibold text-xs shadow-sm transition-all cursor-pointer flex items-center justify-center gap-1.5 shrink-0 whitespace-nowrap active:scale-95"
          >
            <Vote className="w-4 h-4 shrink-0" />
            <span>+ Vote</span>
          </button>

          {/* Host Event & Invite */}
          <button
            type="button"
            onClick={() => setShowCreateEventModal(true)}
            className="px-4 py-2 rounded-xl bg-neutral-900 hover:bg-neutral-800 text-white font-display font-semibold text-xs border border-white/15 hover:border-white/30 transition-all cursor-pointer flex items-center justify-center gap-1.5 shrink-0 whitespace-nowrap active:scale-95"
          >
            <Sparkles className="w-4 h-4 text-cyan-300 shrink-0" />
            <span>+ Host</span>
          </button>
        </div>
      </div>

      {/* ── CALL TO ORDER FLASH BANNER ── */}
      <AnimatePresence>
        {gavelActive && (
          <motion.div
            initial={{ opacity: 0, y: -8, scale: 0.99 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -8, scale: 0.99 }}
            className="p-4 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 shadow-lg flex items-center justify-between gap-4 text-emerald-300"
          >
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl bg-emerald-500/20 border border-emerald-500/30 flex items-center justify-center">
                <Gavel className="w-4 h-4 text-emerald-300 rotate-[-15deg]" />
              </div>
              <div>
                <p className="font-display font-semibold text-sm text-white tracking-wide">
                  CHAMBER IN ORDER &bull; EXECUTIVE BOARD GAVEL STRUCK
                </p>
                <p className="font-mono text-xs text-neutral-300">
                  Floor is called to order. Delegates are requested to observe sovereign parliamentary decorum.
                </p>
              </div>
            </div>
            <span className="px-3 py-1 rounded-xl bg-emerald-400 text-black font-mono font-semibold text-xs shrink-0">
              IN ORDER
            </span>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ── AMBIENT LIVE VOTE ACTIVE CALLOUT BANNER ── */}
      {activeVotingSession && activeVotingSession.status === 'active' && activeTab !== 'voting' && (
        <motion.div
          initial={{ opacity: 0, scale: 0.99 }}
          animate={{ opacity: 1, scale: 1 }}
          onClick={() => setActiveTab('voting')}
          className="p-4 rounded-2xl bg-white/[0.04] border border-white/15 shadow-md flex items-center justify-between gap-4 cursor-pointer hover:border-white/30 transition group"
        >
          <div className="flex items-center gap-3">
            <div className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-ping" />
            <div>
              <div className="flex items-center gap-2">
                <span className="font-mono text-xs font-semibold text-emerald-400 uppercase">
                  LIVE VOTE IN SESSION
                </span>
                <span className="text-xs text-neutral-500">&bull;</span>
                <span className="text-xs text-white font-medium">{activeVotingSession.title}</span>
              </div>
              <p className="text-[11px] font-mono text-neutral-400">
                Floor ballot is currently open for delegates. Click to cast your vote.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-1.5 shrink-0 font-display font-semibold text-xs text-neutral-200 group-hover:translate-x-0.5 transition">
            <span>Cast Ballot</span>
            <ArrowRight className="w-4 h-4" />
          </div>
        </motion.div>
      )}

      {/* ─────────────────────────────────────────────────────────────
          2. MAIN STAGE: SYNCHRONIZED TIMER & ACTIVE FLOOR SPOTLIGHT
      ───────────────────────────────────────────────────────────── */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Left Column: Live Synchronous Timer (5 cols) */}
        <div className="lg:col-span-5 rounded-3xl bg-[#0a0c10] border border-white/10 p-6 sm:p-7 shadow-xl flex flex-col justify-between space-y-6 relative overflow-hidden group">
          {/* Ambient Subtle Glow */}
          <div className="absolute top-0 right-0 w-64 h-64 bg-white/[0.02] blur-[90px] rounded-full pointer-events-none" />

          <div className="space-y-3 relative z-10">
            <div className="flex items-center justify-between">
              <span className="text-[10px] font-mono font-medium tracking-widest text-neutral-300 uppercase px-3 py-1 rounded-full bg-white/[0.04] border border-white/10">
                {sessionState.sessionMode.replace('_', ' ')}
              </span>
              <span className="text-xs font-mono text-neutral-400 truncate max-w-[200px] bg-white/[0.03] px-2.5 py-1 rounded-xl border border-white/[0.08]">
                {sessionState.timer.label}
              </span>
            </div>

            {/* Giant Countdown Clock */}
            <div className="py-5 flex flex-col items-center justify-center relative">
              <div className="relative flex items-center justify-center">
                {/* SVG Progress Ring */}
                <svg className="w-60 h-60 transform -rotate-90">
                  <circle
                    cx="120"
                    cy="120"
                    r="104"
                    stroke="currentColor"
                    strokeWidth="6"
                    className="text-white/[0.06]"
                    fill="transparent"
                  />
                  <circle
                    cx="120"
                    cy="120"
                    r="104"
                    stroke="currentColor"
                    strokeWidth="6"
                    strokeDasharray={2 * Math.PI * 104}
                    strokeDashoffset={2 * Math.PI * 104 * (1 - timerPercentage / 100)}
                    strokeLinecap="round"
                    className="text-neutral-200 transition-all duration-1000 ease-linear drop-shadow-[0_0_10px_rgba(255,255,255,0.15)]"
                    fill="transparent"
                  />
                </svg>

                {/* Digital Clock Display */}
                <div className="absolute flex flex-col items-center text-center">
                  <span className="font-mono font-bold text-5xl sm:text-6xl text-white tracking-tight">
                    {formatTime(sessionState.timer.remainingSeconds)}
                  </span>
                  <div className="flex items-center gap-1.5 mt-2 px-2.5 py-0.5 rounded-full bg-white/[0.04] border border-white/[0.08]">
                    <span className={`w-2 h-2 rounded-full ${sessionState.timer.isRunning ? 'bg-emerald-400 animate-ping' : 'bg-neutral-500'}`} />
                    <span className="text-[10px] font-mono text-neutral-300 uppercase tracking-wider font-medium">
                      {sessionState.timer.isRunning ? 'Clock Running' : 'Clock Paused'}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Timer Action Buttons */}
          <div className="space-y-3 relative z-10">
            <div className="flex items-center justify-center gap-2.5 sm:gap-3">
              <button
                type="button"
                onClick={toggleTimer}
                className={`flex-1 max-w-[200px] py-3.5 rounded-2xl font-display font-bold text-xs flex items-center justify-center gap-2.5 transition-all cursor-pointer shadow-lg active:scale-95 ${
                  sessionState.timer.isRunning
                    ? 'bg-amber-500/20 text-amber-300 border border-amber-500/40 hover:bg-amber-500/30 shadow-[0_0_20px_rgba(245,158,11,0.2)]'
                    : 'bg-white text-black hover:bg-neutral-200 shadow-[0_0_25px_rgba(255,255,255,0.25)]'
                }`}
              >
                {sessionState.timer.isRunning ? (
                  <>
                    <Pause className="w-4 h-4" />
                    <span>PAUSE FLOOR</span>
                  </>
                ) : (
                  <>
                    <Play className="w-4 h-4 fill-black" />
                    <span>START FLOOR</span>
                  </>
                )}
              </button>

              <button
                type="button"
                onClick={() => resetTimer(sessionState.timer.totalSeconds || 540, sessionState.timer.label, sessionState.sessionMode)}
                className="p-3.5 rounded-2xl bg-white/5 border border-white/15 text-neutral-300 hover:text-white hover:bg-white/10 transition cursor-pointer active:scale-95"
                title="Reset Timer"
              >
                <RotateCcw className="w-4 h-4" />
              </button>

              <button
                type="button"
                onClick={() => setTimerSeconds(sessionState.timer.remainingSeconds + 30)}
                className="px-3.5 py-3.5 rounded-2xl bg-white/5 border border-white/15 text-neutral-200 hover:text-white hover:bg-white/10 text-xs font-mono font-bold transition cursor-pointer active:scale-95"
                title="Add 30 seconds"
              >
                +30s
              </button>

              <button
                type="button"
                onClick={() => setTimerSeconds(Math.max(0, sessionState.timer.remainingSeconds - 30))}
                className="px-3.5 py-3.5 rounded-2xl bg-white/5 border border-white/15 text-neutral-200 hover:text-white hover:bg-white/10 text-xs font-mono font-bold transition cursor-pointer active:scale-95"
                title="Subtract 30 seconds"
              >
                -30s
              </button>
            </div>

            {/* Quick Mode Presets & Custom Configuration */}
            <div className="space-y-2">
              <div className="grid grid-cols-4 gap-1.5 p-1 rounded-2xl bg-neutral-950/80 border border-white/10 text-center font-mono text-[10px]">
                <button
                  type="button"
                  onClick={() => resetTimer(90, 'General Speakers List (GSL)', 'GSL')}
                  className="py-2 rounded-xl hover:bg-white/10 text-neutral-300 hover:text-white transition cursor-pointer font-semibold"
                >
                  GSL (90s)
                </button>
                <button
                  type="button"
                  onClick={() => resetTimer(600, 'Moderated Caucus', 'MOD_CAUCUS')}
                  className="py-2 rounded-xl hover:bg-white/10 text-neutral-300 hover:text-white transition cursor-pointer font-semibold"
                >
                  Mod (10m)
                </button>
                <button
                  type="button"
                  onClick={() => resetTimer(900, 'Unmoderated Caucus', 'UNMOD_CAUCUS')}
                  className="py-2 rounded-xl hover:bg-white/10 text-neutral-300 hover:text-white transition cursor-pointer font-semibold"
                >
                  Unmod (15m)
                </button>
                <button
                  type="button"
                  onClick={() => resetTimer(300, 'Crisis Disruption Flash', 'CRISIS_FLASH')}
                  className="py-2 rounded-xl bg-rose-500/15 text-rose-300 hover:bg-rose-500/25 transition cursor-pointer font-bold"
                >
                  Crisis (5m)
                </button>
              </div>

              <div className="grid grid-cols-2 gap-2 font-mono text-xs">
                <button
                  type="button"
                  onClick={() => setShowCustomTimerModal(true)}
                  className="py-2.5 px-3 rounded-2xl bg-white/[0.04] hover:bg-white/[0.08] text-neutral-300 hover:text-white border border-white/10 font-semibold transition flex items-center justify-center gap-1.5 cursor-pointer shadow-sm"
                >
                  <Clock className="w-3.5 h-3.5 text-neutral-400" />
                  <span>+ Custom MM:SS</span>
                </button>

                <button
                  type="button"
                  onClick={() => setShowFullscreenView(true)}
                  className="py-2.5 px-3 rounded-2xl bg-white/5 hover:bg-white/15 text-neutral-200 hover:text-white border border-white/10 font-semibold transition flex items-center justify-center gap-1.5 cursor-pointer shadow-sm"
                >
                  <Maximize2 className="w-3.5 h-3.5 text-neutral-400" />
                  <span>Projector Stage</span>
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Right Column: Active Speaker & Current Motion Spotlight (7 cols) */}
        <div className="lg:col-span-7 space-y-6 flex flex-col justify-between">
          
          {/* Current Running Motion Spotlight */}
          <div className="p-6 sm:p-7 rounded-3xl bg-[#0a0c10] border border-white/10 shadow-xl space-y-4 relative overflow-hidden">
            <div className="flex items-center justify-between pb-3 border-b border-white/[0.08] relative z-10">
              <div className="flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-neutral-400" />
                <span className="text-xs font-mono font-medium tracking-widest text-neutral-400 uppercase">
                  ACTIVE FLOOR MOTION
                </span>
              </div>
              {sessionState.currentMotion && (
                <span className="text-xs font-mono text-neutral-400 bg-white/[0.04] px-2.5 py-0.5 rounded-lg border border-white/[0.08]">
                  Total: {sessionState.currentMotion.totalMinutes}m &bull; Speaker: {sessionState.currentMotion.individualSpeakerSeconds}s
                </span>
              )}
            </div>

            {sessionState.currentMotion ? (
              <div className="space-y-3 relative z-10">
                <h3 className="font-display font-semibold text-lg sm:text-xl text-white leading-snug">
                  &ldquo;{sessionState.currentMotion.topic}&rdquo;
                </h3>
                <div className="flex flex-wrap items-center gap-3 text-xs font-mono text-neutral-400">
                  <div className="flex items-center gap-2 bg-white/[0.04] px-3 py-1 rounded-xl border border-white/[0.08]">
                    <span className="text-lg">{sessionState.currentMotion.proposedBy.flagEmoji}</span>
                    <span className="text-white font-medium">{sessionState.currentMotion.proposedBy.portfolio}</span>
                  </div>
                  <span className="text-emerald-400 font-medium">&bull; Passed with {sessionState.currentMotion.votesFor} For votes</span>
                </div>
              </div>
            ) : (
              <div className="py-6 text-center text-neutral-400 font-mono text-xs relative z-10 space-y-2">
                <p>No active motion currently on the floor.</p>
                <button
                  type="button"
                  onClick={() => setShowRaiseMotionModal(true)}
                  className="px-3.5 py-1.5 rounded-xl bg-white/[0.05] hover:bg-white/[0.1] text-neutral-200 border border-white/10 text-xs font-mono font-medium transition inline-flex items-center gap-1.5 cursor-pointer"
                >
                  <Plus className="w-3.5 h-3.5 text-neutral-400" />
                  <span>Raise Motion to Floor</span>
                </button>
              </div>
            )}
          </div>

          {/* Current Active Speaker Spotlight */}
          <div className="p-6 sm:p-7 rounded-3xl bg-[#0a0c10] border border-white/10 shadow-xl space-y-5 relative overflow-hidden">
            <div className="flex items-center justify-between">
              <span className="text-[10px] font-mono font-medium tracking-widest text-emerald-400 uppercase px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/25 flex items-center gap-1.5">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                CURRENT SPEAKER HOLDING THE FLOOR
              </span>
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={advanceSpeaker}
                  className="px-3.5 py-1.5 rounded-xl bg-white hover:bg-neutral-200 text-black font-mono text-xs font-semibold transition cursor-pointer shadow-sm active:scale-95 flex items-center gap-1.5"
                >
                  <span>Advance Speaker</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>

            {sessionState.currentSpeaker ? (
              <div className="space-y-4">
                <div className="flex items-center gap-4">
                  <div className="w-16 h-16 rounded-2xl bg-white/[0.03] border border-white/[0.08] flex items-center justify-center text-4xl sm:text-5xl shrink-0 shadow-inner">
                    {sessionState.currentSpeaker.flagEmoji}
                  </div>
                  <div className="min-w-0">
                    <h2 className="font-display font-semibold text-xl sm:text-2xl text-white truncate">
                      {sessionState.currentSpeaker.portfolio}
                    </h2>
                    <p className="font-mono text-xs text-neutral-400 mt-0.5">
                      Accredited Delegate: <strong className="text-neutral-200 font-medium">{sessionState.currentSpeaker.delegateName}</strong>
                    </p>
                  </div>
                </div>

                {/* Yield Options for Active Speaker */}
                <div className="pt-3 border-t border-white/10 flex flex-wrap items-center gap-2 text-xs font-mono">
                  <span className="text-neutral-400 font-bold">Yield Time:</span>
                  <button
                    type="button"
                    onClick={() => yieldSpeakerTime('chair')}
                    className="px-3 py-1.5 rounded-xl bg-white/5 hover:bg-white/15 text-neutral-200 border border-white/10 transition cursor-pointer active:scale-95"
                  >
                    Yield to Chair
                  </button>
                  <button
                    type="button"
                    onClick={() => yieldSpeakerTime('points_of_info')}
                    className="px-3 py-1.5 rounded-xl bg-white/5 hover:bg-white/15 text-neutral-200 border border-white/10 transition cursor-pointer active:scale-95"
                  >
                    Yield to Points of Info
                  </button>
                  <button
                    type="button"
                    onClick={() => yieldSpeakerTime('another_delegate')}
                    className="px-3 py-1.5 rounded-xl bg-white/5 hover:bg-white/15 text-neutral-200 border border-white/10 transition cursor-pointer active:scale-95"
                  >
                    Yield to Delegate
                  </button>
                </div>
              </div>
            ) : (
              <div className="py-6 text-center text-neutral-400 font-mono text-xs space-y-2">
                <p>No delegate currently holding the floor.</p>
                <button
                  type="button"
                  onClick={() => joinSpeakersList()}
                  className="px-3.5 py-1.5 rounded-xl bg-amber-500/10 hover:bg-amber-500/20 text-amber-300 border border-amber-500/30 text-xs font-mono font-bold transition inline-flex items-center gap-1.5 cursor-pointer"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>Join General Speakers List</span>
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* ─────────────────────────────────────────────────────────────
          3. COMMITTEE OS TABS: MOTIONS QUEUE | SPEAKERS | POINTS | RESOLUTIONS
      ───────────────────────────────────────────────────────────── */}
      <div className="rounded-3xl bg-[#0a0c10] border border-white/10 shadow-xl p-6 sm:p-8 space-y-6 relative overflow-hidden">
        {/* Navigation Switcher */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-white/[0.08] relative z-10">
          <div className="flex items-center gap-2 overflow-x-auto pb-1 sm:pb-0 no-scrollbar w-full sm:w-auto max-w-full">
            <button
              type="button"
              onClick={() => setActiveTab('motions')}
              className={`px-4 py-2.5 rounded-xl font-mono text-xs font-semibold transition-all cursor-pointer flex items-center gap-2 shrink-0 ${
                activeTab === 'motions'
                  ? 'bg-white text-black shadow-sm'
                  : 'bg-white/[0.04] text-neutral-400 hover:text-white hover:bg-white/[0.08]'
              }`}
            >
              <Layers className="w-3.5 h-3.5" />
              <span>Motions ({sessionState.motionsQueue.length})</span>
            </button>

            <button
              type="button"
              onClick={() => setActiveTab('voting')}
              className={`px-4 py-2.5 rounded-xl font-mono text-xs font-semibold transition-all cursor-pointer flex items-center gap-2 shrink-0 ${
                activeTab === 'voting'
                  ? 'bg-white text-black shadow-sm'
                  : activeVotingSession && activeVotingSession.status === 'active'
                  ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 animate-pulse'
                  : 'bg-white/[0.04] text-neutral-400 hover:text-white hover:bg-white/[0.08]'
              }`}
            >
              <Vote className="w-3.5 h-3.5" />
              <span>Live Voting {activeVotingSession && activeVotingSession.status === 'active' && '•'}</span>
            </button>

            <button
              type="button"
              onClick={() => setActiveTab('open_mic')}
              className={`px-4 py-2.5 rounded-xl font-mono text-xs font-semibold transition-all cursor-pointer flex items-center gap-2 shrink-0 ${
                activeTab === 'open_mic'
                  ? 'bg-white text-black shadow-sm'
                  : 'bg-white/[0.04] text-neutral-400 hover:text-white hover:bg-white/[0.08]'
              }`}
            >
              <Mic className="w-3.5 h-3.5" />
              <span>Open Mic &amp; Stage ({stagePerformers.length})</span>
            </button>

            <button
              type="button"
              onClick={() => setActiveTab('speakers')}
              className={`px-4 py-2.5 rounded-xl font-mono text-xs font-semibold transition-all cursor-pointer flex items-center gap-2 shrink-0 ${
                activeTab === 'speakers'
                  ? 'bg-white text-black shadow-sm'
                  : 'bg-white/[0.04] text-neutral-400 hover:text-white hover:bg-white/[0.08]'
              }`}
            >
              <Users className="w-3.5 h-3.5" />
              <span>Speakers ({sessionState.speakersList.length})</span>
            </button>

            <button
              type="button"
              onClick={() => setActiveTab('resolutions')}
              className={`px-4 py-2.5 rounded-xl font-mono text-xs font-semibold transition-all cursor-pointer flex items-center gap-2 shrink-0 ${
                activeTab === 'resolutions'
                  ? 'bg-white text-black shadow-sm'
                  : 'bg-white/[0.04] text-neutral-400 hover:text-white hover:bg-white/[0.08]'
              }`}
            >
              <FileText className="w-3.5 h-3.5" />
              <span>Resolutions ({sessionState.resolutions.length})</span>
            </button>

            <button
              type="button"
              onClick={() => setActiveTab('points')}
              className={`px-4 py-2.5 rounded-xl font-mono text-xs font-semibold transition-all cursor-pointer flex items-center gap-2 shrink-0 ${
                activeTab === 'points'
                  ? 'bg-white text-black shadow-sm'
                  : 'bg-white/[0.04] text-neutral-400 hover:text-white hover:bg-white/[0.08]'
              }`}
            >
              <ShieldCheck className="w-3.5 h-3.5" />
              <span>Points ({sessionState.parliamentaryPoints.length})</span>
            </button>

            <button
              type="button"
              onClick={() => setActiveTab('memory')}
              className={`px-4 py-2.5 rounded-xl font-mono text-xs font-semibold transition-all cursor-pointer flex items-center gap-2 shrink-0 ${
                activeTab === 'memory'
                  ? 'bg-purple-400 text-black shadow-sm font-bold'
                  : 'bg-white/[0.04] text-neutral-400 hover:text-purple-300 hover:bg-white/[0.08]'
              }`}
            >
              <Sparkles className="w-3.5 h-3.5" />
              <span>Memory</span>
            </button>

            <button
              type="button"
              onClick={() => setActiveTab('analytics')}
              className={`px-4 py-2.5 rounded-xl font-mono text-xs font-semibold transition-all cursor-pointer flex items-center gap-2 shrink-0 ${
                activeTab === 'analytics'
                  ? 'bg-amber-400 text-black shadow-sm font-bold'
                  : 'bg-white/[0.04] text-neutral-400 hover:text-amber-300 hover:bg-white/[0.08]'
              }`}
            >
              <Award className="w-3.5 h-3.5" />
              <span>Vectors</span>
            </button>
          </div>

          {/* Action Trigger based on active tab */}
          {activeTab === 'motions' && (
            <button
              type="button"
              onClick={() => setShowRaiseMotionModal(true)}
              className="px-4 py-2.5 rounded-xl bg-white hover:bg-neutral-200 text-black font-display font-semibold text-xs transition flex items-center justify-center gap-2 cursor-pointer shrink-0 shadow-sm active:scale-95"
            >
              <Plus className="w-4 h-4 text-black" />
              <span>Raise New Motion</span>
            </button>
          )}

          {activeTab === 'voting' && (
            <button
              type="button"
              onClick={() => setShowLiveVotingModal(true)}
              className="px-4 py-2.5 rounded-xl bg-white hover:bg-neutral-200 text-black font-display font-semibold text-xs shadow-sm transition flex items-center justify-center gap-2 cursor-pointer shrink-0 active:scale-95"
            >
              <Vote className="w-4 h-4 text-black" />
              <span>Open Live Ballot</span>
            </button>
          )}

          {activeTab === 'open_mic' && (
            <button
              type="button"
              onClick={() => setShowLiveVotingModal(true)}
              className="px-4 py-2.5 rounded-2xl bg-purple-400 hover:bg-purple-300 text-black font-display font-bold text-xs shadow-md transition flex items-center justify-center gap-2 cursor-pointer shrink-0"
            >
              <Vote className="w-4 h-4 text-black" />
              <span>Launch Audience Vote</span>
            </button>
          )}

          {activeTab === 'speakers' && (
            <button
              type="button"
              onClick={() => joinSpeakersList()}
              className="px-4 py-2.5 rounded-2xl bg-white hover:bg-neutral-200 text-black font-display font-bold text-xs transition flex items-center justify-center gap-2 cursor-pointer shrink-0"
            >
              <Plus className="w-4 h-4 text-black" />
              <span>Add Name to Speakers</span>
            </button>
          )}

          {activeTab === 'points' && (
            <button
              type="button"
              onClick={() => setShowRaisePointModal(true)}
              className="px-4 py-2.5 rounded-2xl bg-white hover:bg-neutral-200 text-black font-display font-bold text-xs transition flex items-center justify-center gap-2 cursor-pointer shrink-0"
            >
              <ShieldCheck className="w-4 h-4 text-black" />
              <span>Raise Point</span>
            </button>
          )}

          {activeTab === 'resolutions' && (
            isLokSabhaChamber ? (
              <Link
                href="/docs?committee=lok_sabha&mode=legislate&action=draft_choice"
                className="px-4 py-2.5 rounded-2xl bg-amber-500 hover:bg-amber-400 text-black font-display font-bold text-xs transition flex items-center justify-center gap-2 cursor-pointer shrink-0 shadow-[0_0_20px_rgba(245,158,11,0.3)] active:scale-95"
              >
                <Gavel className="w-4 h-4 text-black" />
                <span>Draft Bill / Press Release (ZEN.LEGISLATE)</span>
              </Link>
            ) : (
              <button
                type="button"
                onClick={() => setShowDraftResolutionModal(true)}
                className="px-4 py-2.5 rounded-2xl bg-white hover:bg-neutral-200 text-black font-display font-bold text-xs transition flex items-center justify-center gap-2 cursor-pointer shrink-0"
              >
                <Plus className="w-4 h-4 text-black" />
                <span>Draft Working Paper</span>
              </button>
            )
          )}
        </div>

        {/* TAB 1: UPCOMING MOTIONS QUEUE */}
        {activeTab === 'motions' && (
          <div className="space-y-4">
            {sessionState.motionsQueue.length === 0 ? (
              <div className="p-12 text-center text-neutral-500 font-mono text-xs border border-dashed border-white/10 rounded-2xl">
                No motions currently in the queue. Click "Raise New Motion" to propose a moderated or unmoderated caucus.
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {sessionState.motionsQueue.map((m) => (
                  <div
                    key={m.id}
                    className="p-5 rounded-2xl bg-white/[0.03] border border-white/10 hover:border-white/20 transition-all flex flex-col justify-between space-y-4"
                  >
                    <div className="space-y-2">
                      <div className="flex items-center justify-between">
                        <span className="text-[10px] font-mono font-bold tracking-widest text-amber-300 uppercase px-2 py-0.5 rounded bg-amber-500/10 border border-amber-500/20">
                          {m.type.replace('_', ' ')}
                        </span>
                        <span className="text-xs font-mono text-neutral-400">
                          {m.totalMinutes} mins {m.individualSpeakerSeconds > 0 ? `• ${m.individualSpeakerSeconds}s / speaker` : ''}
                        </span>
                      </div>

                      <h4 className="font-display font-bold text-base text-white">
                        "{m.topic}"
                      </h4>

                      <div className="flex items-center gap-2 text-xs font-mono text-neutral-400">
                        <span>{m.proposedBy.flagEmoji}</span>
                        <span>{m.proposedBy.portfolio}</span>
                      </div>
                    </div>

                    <div className="pt-3 border-t border-white/10 flex items-center justify-between gap-3">
                      {/* Voting Stance */}
                      <div className="flex items-center gap-2 font-mono text-xs">
                        <button
                          type="button"
                          onClick={() => voteOnMotion(m.id, 'for')}
                          className="px-2.5 py-1 rounded-lg bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 transition cursor-pointer flex items-center gap-1"
                        >
                          <span>▲</span>
                          <span>{m.votesFor}</span>
                        </button>
                        <button
                          type="button"
                          onClick={() => voteOnMotion(m.id, 'against')}
                          className="px-2.5 py-1 rounded-lg bg-rose-500/10 hover:bg-rose-500/20 text-rose-400 border border-rose-500/30 transition cursor-pointer flex items-center gap-1"
                        >
                          <span>▼</span>
                          <span>{m.votesAgainst}</span>
                        </button>
                      </div>

                      {/* Start Motion Button */}
                      <button
                        type="button"
                        onClick={() => startMotion(m.id)}
                        className="px-3.5 py-1.5 rounded-xl bg-white hover:bg-neutral-200 text-black font-mono text-xs font-bold transition flex items-center gap-1.5 cursor-pointer shadow-sm"
                      >
                        <Play className="w-3 h-3 fill-black" />
                        <span>Pass &amp; Put to Floor</span>
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* TAB: LIVE VOTING CENTER */}
        {activeTab === 'voting' && (
          <LiveVotingCenter onOpenNewVoteModal={() => setShowLiveVotingModal(true)} />
        )}

        {/* TAB: OPEN MIC & CULTURAL STAGE */}
        {activeTab === 'open_mic' && (
          <OpenMicStage onOpenVotingForPerformer={(performer) => setShowLiveVotingModal(true)} />
        )}

        {/* TAB 2: SPEAKERS LIST */}
        {activeTab === 'speakers' && (
          <div className="space-y-4">
            {sessionState.speakersList.length === 0 ? (
              <div className="p-12 text-center text-neutral-500 font-mono text-xs border border-dashed border-white/10 rounded-2xl">
                The speakers list is currently empty. Click "Add My Delegation to GSL" above!
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
                {sessionState.speakersList.map((spk, idx) => (
                  <div
                    key={spk.id}
                    className="p-4 rounded-2xl bg-white/[0.03] border border-white/10 flex items-center gap-3.5"
                  >
                    <div className="w-7 h-7 rounded-full bg-white/10 flex items-center justify-center font-mono font-bold text-xs text-neutral-400 shrink-0">
                      {idx + 1}
                    </div>
                    <span className="text-2xl">{spk.flagEmoji}</span>
                    <div className="min-w-0 flex-1">
                      <p className="font-display font-bold text-xs text-white truncate">{spk.portfolio}</p>
                      <p className="font-mono text-[11px] text-neutral-400 truncate">{spk.delegateName}</p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* TAB 3: PARLIAMENTARY POINTS */}
        {activeTab === 'points' && (
          <div className="space-y-4">
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 pb-2">
              <div className="p-3 rounded-xl bg-white/[0.02] border border-white/10 text-xs font-mono space-y-1">
                <span className="text-cyan-400 font-bold">Personal Privilege</span>
                <p className="text-[10px] text-neutral-400">Audibility, room comfort, physical hindrance.</p>
              </div>
              <div className="p-3 rounded-xl bg-white/[0.02] border border-white/10 text-xs font-mono space-y-1">
                <span className="text-amber-400 font-bold">Point of Order</span>
                <p className="text-[10px] text-neutral-400">Rules of Procedure violations by delegate or dais.</p>
              </div>
              <div className="p-3 rounded-xl bg-white/[0.02] border border-white/10 text-xs font-mono space-y-1">
                <span className="text-purple-400 font-bold">Parliamentary Inquiry</span>
                <p className="text-[10px] text-neutral-400">Questions directed to Chair on procedural rules.</p>
              </div>
              <div className="p-3 rounded-xl bg-white/[0.02] border border-white/10 text-xs font-mono space-y-1">
                <span className="text-rose-400 font-bold">Right of Reply</span>
                <p className="text-[10px] text-neutral-400">Response to direct sovereign or personal insult.</p>
              </div>
            </div>

            {sessionState.parliamentaryPoints.length === 0 ? (
              <div className="p-12 text-center text-neutral-500 font-mono text-xs border border-dashed border-white/10 rounded-2xl">
                No active parliamentary points raised.
              </div>
            ) : (
              <div className="space-y-3">
                {sessionState.parliamentaryPoints.map((pt) => (
                  <div
                    key={pt.id}
                    className="p-4 rounded-2xl bg-white/[0.03] border border-white/10 flex items-start justify-between gap-4"
                  >
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <span className="text-[10px] font-mono font-bold tracking-widest text-cyan-300 uppercase px-2 py-0.5 rounded bg-cyan-500/15">
                          {pt.type.replace('_', ' ')}
                        </span>
                        <span className="text-xs font-mono text-neutral-400">
                          {pt.flagEmoji} {pt.country} ({pt.delegateName})
                        </span>
                      </div>
                      <p className="text-xs sm:text-sm text-neutral-200 font-sans">
                        "{pt.detail}"
                      </p>
                    </div>

                    <button
                      type="button"
                      onClick={() => dismissPoint(pt.id)}
                      className="p-1.5 rounded-lg text-neutral-500 hover:text-white hover:bg-white/10 transition cursor-pointer"
                      title="Dismiss Point"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* TAB 4: DRAFT RESOLUTIONS */}
        {activeTab === 'resolutions' && (
          <div className="space-y-6">
            {/* Drafting Studio Launcher Banner */}
            <div className="flex flex-wrap items-center justify-between gap-3 p-4 rounded-2xl bg-white/[0.03] border border-white/10">
              <div>
                <h4 className="font-bold text-sm text-white">
                  {isIndianCommittee ? 'Legislative Drafting Studio (Parliamentary Bills & Press)' : 'Multilateral Drafting Studio (Resolutions & Working Papers)'}
                </h4>
                <p className="text-xs text-neutral-400">
                  {isIndianCommittee
                    ? 'Draft statutory bills with Section clauses, Definitions, and Statements of Objects via ZEN.LEGISLATE.'
                    : 'Draft resolutions with standardized UN preambulatory phrases and operative clauses via ZEN.DOCS.'}
                </p>
              </div>
              <button
                type="button"
                onClick={() => {
                  if (isIndianCommittee) {
                    setShowLokSabhaDraftModal(true);
                  } else {
                    setShowUnDocsDraftModal(true);
                  }
                }}
                className={`px-4 py-2 rounded-xl text-xs font-mono font-bold flex items-center gap-2 cursor-pointer shadow-md transition active:scale-95 ${
                  isIndianCommittee
                    ? 'bg-amber-500 hover:bg-amber-400 text-black'
                    : 'bg-cyan-500 hover:bg-cyan-400 text-black'
                }`}
              >
                {isIndianCommittee ? <Gavel className="w-4 h-4" /> : <ScrollText className="w-4 h-4" />}
                <span>{isIndianCommittee ? 'Draft Bill / Press Release' : 'Draft Resolution / Working Paper'}</span>
              </button>
            </div>

            {sessionState.resolutions.map((res) => (
              <div
                key={res.id}
                className="p-6 sm:p-8 rounded-3xl bg-white/[0.02] border border-white/15 space-y-6"
              >
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-white/10">
                  <div>
                    <span className="text-[10px] font-mono font-bold tracking-widest text-emerald-400 uppercase">
                      {res.code} &bull; STATUS: {res.status.toUpperCase()}
                    </span>
                    <h3 className="font-display font-bold text-lg sm:text-xl text-white mt-1">
                      {res.title}
                    </h3>
                  </div>

                  <div className="flex flex-wrap items-center gap-2">
                    <button
                      type="button"
                      onClick={() => sponsorResolution(res.id)}
                      className="px-3.5 py-1.5 rounded-xl bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 font-mono text-xs font-bold transition cursor-pointer"
                    >
                      + Co-Sponsor
                    </button>
                    <button
                      type="button"
                      onClick={() => signResolution(res.id)}
                      className="px-3.5 py-1.5 rounded-xl bg-white/10 hover:bg-white/20 text-white font-mono text-xs font-bold transition cursor-pointer"
                    >
                      + Signatory
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        passAndArchiveBill({
                          title: res.title,
                          code: res.code,
                          sponsors: res.sponsors,
                          fullText: [...res.preambulatoryClauses, ...res.operativeClauses].join('\n\n'),
                          clauses: [
                            ...res.preambulatoryClauses.map((p, i) => ({ clauseNumber: `P${i+1}`, type: 'PREAMBULARY' as const, text: p })),
                            ...res.operativeClauses.map((o, i) => ({ clauseNumber: `${i+1}`, type: 'OPERATIVE' as const, text: o }))
                          ]
                        });
                        playGavelSound();
                        setShowSummaryPaperModal(true);
                      }}
                      className="px-3.5 py-1.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-black font-mono text-xs font-bold transition cursor-pointer shadow-md flex items-center gap-1.5 active:scale-95"
                    >
                      <FileCheck className="w-3.5 h-3.5 fill-black" />
                      <span>Pass &amp; Archive Bill</span>
                    </button>
                  </div>
                </div>

                {/* Sponsors & Signatories */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs font-mono">
                  <div className="p-3.5 rounded-xl bg-black/40 border border-white/5 space-y-1">
                    <span className="text-neutral-500 uppercase font-bold block">SPONSOR NATIONS</span>
                    <p className="text-emerald-300 font-semibold">{res.sponsors.join(', ')}</p>
                  </div>
                  <div className="p-3.5 rounded-xl bg-black/40 border border-white/5 space-y-1">
                    <span className="text-neutral-500 uppercase font-bold block">SIGNATORY DELEGATIONS</span>
                    <p className="text-neutral-300">{res.signatories.join(', ') || 'Awaiting additional signatories'}</p>
                  </div>
                </div>

                {/* Preambles & Operatives */}
                <div className="space-y-4 text-xs sm:text-sm font-sans leading-relaxed">
                  <div className="space-y-2">
                    <h5 className="font-mono text-xs text-neutral-400 font-bold uppercase">Preambulatory Clauses:</h5>
                    <ul className="list-disc pl-5 space-y-1 text-neutral-300 italic">
                      {res.preambulatoryClauses.map((c, i) => (
                        <li key={i}>{c}</li>
                      ))}
                    </ul>
                  </div>

                  <div className="space-y-2">
                    <h5 className="font-mono text-xs text-emerald-400 font-bold uppercase">Operative Clauses:</h5>
                    <ol className="list-decimal pl-5 space-y-1.5 text-neutral-200">
                      {res.operativeClauses.map((c, i) => (
                        <li key={i}>{c}</li>
                      ))}
                    </ol>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* ── TAB CONTENT: CONVERSATION MEMORY ── */}
        {activeTab === 'memory' && (
          <div className="space-y-6">
            <ConversationMemory />
          </div>
        )}

        {/* ── TAB CONTENT: DELEGATE PERFORMANCE VECTORS ── */}
        {activeTab === 'analytics' && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <LiveSpeakerQueue />
            <DelegatePerformanceRadar />
          </div>
        )}
      </div>

      {/* ─────────────────────────────────────────────────────────────
          4. MODALS (RAISE MOTION / RAISE POINT / DRAFT RESOLUTION)
      ───────────────────────────────────────────────────────────── */}
      
      {/* RAISE MOTION MODAL */}
      <AnimatePresence>
        {showRaiseMotionModal && (
          <div className="fixed inset-0 z-[99999] flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setShowRaiseMotionModal(false)}
              className="fixed inset-0 bg-black/80 backdrop-blur-md"
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="relative w-full max-w-lg rounded-3xl bg-[#07080b] border border-amber-500/30 p-6 sm:p-7 shadow-2xl z-10 text-white space-y-5"
            >
              <div className="flex items-center justify-between pb-3 border-b border-white/10">
                <div className="flex items-center gap-2">
                  <Layers className="w-5 h-5 text-amber-400" />
                  <h3 className="font-display font-bold text-lg text-white">Raise a Committee Motion</h3>
                </div>
                <button
                  onClick={() => setShowRaiseMotionModal(false)}
                  className="p-1 rounded-lg text-neutral-400 hover:text-white"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              <form onSubmit={handleRaiseMotionSubmit} className="space-y-4 text-left">
                <div className="space-y-1.5">
                  <label className="text-xs font-mono text-neutral-300 block font-bold">
                    MOTION TYPE
                  </label>
                  <select
                    value={motionType}
                    onChange={(e) => setMotionType(e.target.value as MotionType)}
                    className="w-full px-4 py-3 rounded-2xl bg-neutral-950 border border-white/15 text-white text-xs font-mono focus:outline-none focus:border-amber-400"
                  >
                    <option value="MODERATED_CAUCUS">Moderated Caucus (Structured Debate)</option>
                    <option value="UNMODERATED_CAUCUS">Unmoderated Caucus (Informal Lobbying)</option>
                    <option value="ZERO_HOUR">🇮🇳 Zero Hour (Urgent Matters of Public Importance)</option>
                    <option value="QUESTION_HOUR">🇮🇳 Question Hour (Ministerial Interpellation)</option>
                    <option value="CALLING_ATTENTION">🇮🇳 Calling Attention Motion</option>
                    <option value="NO_CONFIDENCE">🇮🇳 No-Confidence Motion</option>
                    <option value="ADJOURNMENT">Adjournment Motion / Floor Recess</option>
                    <option value="FORMAL_DEBATE">Formal General Speakers List Debate</option>
                    <option value="WORKING_PAPER">Introduction of Working Paper / Bill</option>
                    <option value="DRAFT_RESOLUTION">Introduction of Draft Resolution / Amendment</option>
                    <option value="SUSPENSION">Suspension of the Meeting (Recess)</option>
                  </select>
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-mono text-neutral-300 block font-bold">
                    TOPIC / PURPOSE OF MOTION
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Humanitarian Corridors in Sovereign Autonomous Airspace"
                    value={motionTopic}
                    onChange={(e) => setMotionTopic(e.target.value)}
                    className="w-full px-4 py-3 rounded-2xl bg-neutral-950 border border-white/15 text-white text-xs placeholder-neutral-500 focus:outline-none focus:border-amber-400"
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div className="space-y-1.5">
                    <label className="text-xs font-mono text-neutral-300 block font-bold">
                      TOTAL TIME (MINS)
                    </label>
                    <input
                      type="number"
                      min={1}
                      max={30}
                      value={motionTotalMinutes}
                      onChange={(e) => setMotionTotalMinutes(Number(e.target.value))}
                      className="w-full px-4 py-3 rounded-2xl bg-neutral-950 border border-white/15 text-white text-xs font-mono focus:outline-none focus:border-amber-400"
                    />
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-xs font-mono text-neutral-300 block font-bold">
                      SPEAKER TIME (SECS)
                    </label>
                    <input
                      type="number"
                      min={15}
                      max={180}
                      step={15}
                      value={motionSpeakerSeconds}
                      onChange={(e) => setMotionSpeakerSeconds(Number(e.target.value))}
                      className="w-full px-4 py-3 rounded-2xl bg-neutral-950 border border-white/15 text-white text-xs font-mono focus:outline-none focus:border-amber-400"
                    />
                  </div>
                </div>

                <button
                  type="submit"
                  className="w-full py-3.5 rounded-2xl bg-white hover:bg-neutral-200 text-black font-display font-bold text-xs transition cursor-pointer mt-2"
                >
                  Submit Motion to Dais Queue
                </button>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* RAISE PARLIAMENTARY POINT MODAL */}
      <AnimatePresence>
        {showRaisePointModal && (
          <div className="fixed inset-0 z-[99999] flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setShowRaisePointModal(false)}
              className="fixed inset-0 bg-black/80 backdrop-blur-md"
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="relative w-full max-w-lg rounded-3xl bg-[#07080b] border border-cyan-500/30 p-6 sm:p-7 shadow-2xl z-10 text-white space-y-5"
            >
              <div className="flex items-center justify-between pb-3 border-b border-white/10">
                <div className="flex items-center gap-2">
                  <ShieldCheck className="w-5 h-5 text-cyan-400" />
                  <h3 className="font-display font-bold text-lg text-white">Raise Parliamentary Point</h3>
                </div>
                <button
                  onClick={() => setShowRaisePointModal(false)}
                  className="p-1 rounded-lg text-neutral-400 hover:text-white"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              <form onSubmit={handleRaisePointSubmit} className="space-y-4 text-left">
                <div className="space-y-1.5">
                  <label className="text-xs font-mono text-neutral-300 block font-bold">
                    POINT CLASSIFICATION
                  </label>
                  <select
                    value={pointType}
                    onChange={(e) => setPointType(e.target.value as PointType)}
                    className="w-full px-4 py-3 rounded-2xl bg-neutral-950 border border-white/15 text-white text-xs font-mono focus:outline-none focus:border-cyan-400"
                  >
                    <option value="ORDER">Point of Order (RoP Violation)</option>
                    <option value="PERSONAL_PRIVILEGE">Point of Personal Privilege (Comfort / Audibility)</option>
                    <option value="PARLIAMENTARY_INQUIRY">Point of Parliamentary Inquiry (Question to Dais)</option>
                    <option value="RIGHT_OF_REPLY">Right of Reply (Sovereign Honor Defamation)</option>
                  </select>
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-mono text-neutral-300 block font-bold">
                    SPECIFIC DETAILS FOR THE CHAIR
                  </label>
                  <textarea
                    required
                    rows={3}
                    placeholder="State your procedural reason clearly for the Executive Board..."
                    value={pointDetail}
                    onChange={(e) => setPointDetail(e.target.value)}
                    className="w-full px-4 py-3 rounded-2xl bg-neutral-950 border border-white/15 text-white text-xs placeholder-neutral-500 focus:outline-none focus:border-cyan-400 resize-none font-sans"
                  />
                </div>

                <button
                  type="submit"
                  className="w-full py-3.5 rounded-2xl bg-white hover:bg-neutral-200 text-black font-display font-bold text-xs transition cursor-pointer mt-2"
                >
                  Transmit Point to Dais
                </button>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* DRAFT RESOLUTION MODAL */}
      <AnimatePresence>
        {showDraftResolutionModal && (
          <div className="fixed inset-0 z-[99999] flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setShowDraftResolutionModal(false)}
              className="fixed inset-0 bg-black/80 backdrop-blur-md"
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="relative w-full max-w-xl rounded-3xl bg-[#07080b] border border-white/20 p-6 sm:p-7 shadow-2xl z-10 text-white space-y-5 max-h-[85vh] overflow-y-auto"
            >
              <div className="flex items-center justify-between pb-3 border-b border-white/10">
                <div className="flex items-center gap-2">
                  <FileText className="w-5 h-5 text-emerald-400" />
                  <h3 className="font-display font-bold text-lg text-white">Draft Working Paper</h3>
                </div>
                <button
                  onClick={() => setShowDraftResolutionModal(false)}
                  className="p-1 rounded-lg text-neutral-400 hover:text-white"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              <form onSubmit={handleCreateResolutionSubmit} className="space-y-4 text-left">
                <div className="space-y-1.5">
                  <label className="text-xs font-mono text-neutral-300 block font-bold">
                    RESOLUTION CODE &amp; TITLE
                  </label>
                  <div className="grid grid-cols-3 gap-2">
                    <input
                      type="text"
                      value={resCode}
                      onChange={(e) => setResCode(e.target.value)}
                      className="px-3 py-2.5 rounded-xl bg-neutral-950 border border-white/15 text-white text-xs font-mono"
                    />
                    <input
                      type="text"
                      required
                      placeholder="Title of Draft Resolution"
                      value={resTitle}
                      onChange={(e) => setResTitle(e.target.value)}
                      className="col-span-2 px-3 py-2.5 rounded-xl bg-neutral-950 border border-white/15 text-white text-xs"
                    />
                  </div>
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-mono text-neutral-300 block font-bold">
                    PREAMBULATORY CLAUSES (ONE PER LINE)
                  </label>
                  <textarea
                    rows={3}
                    placeholder="Affirming the sovereign rights of nations...&#10;Deeply concerned by..."
                    value={resPreamble}
                    onChange={(e) => setResPreamble(e.target.value)}
                    className="w-full px-4 py-3 rounded-2xl bg-neutral-950 border border-white/15 text-white text-xs placeholder-neutral-500 focus:outline-none focus:border-emerald-400 resize-none font-sans"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-mono text-neutral-300 block font-bold">
                    OPERATIVE CLAUSES (ONE PER LINE)
                  </label>
                  <textarea
                    rows={3}
                    placeholder="Mandates the immediate deployment of...&#10;Calls upon member states to..."
                    value={resOperative}
                    onChange={(e) => setResOperative(e.target.value)}
                    className="w-full px-4 py-3 rounded-2xl bg-neutral-950 border border-white/15 text-white text-xs placeholder-neutral-500 focus:outline-none focus:border-emerald-400 resize-none font-sans"
                  />
                </div>

                <button
                  type="submit"
                  className="w-full py-3.5 rounded-2xl bg-white hover:bg-neutral-200 text-black font-display font-bold text-xs transition cursor-pointer shadow-[0_0_25px_rgba(255,255,255,0.2)] mt-2"
                >
                  Introduce Working Paper to Chamber
                </button>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* LIVE VOTING MODAL */}
      <LiveVotingModal
        isOpen={showLiveVotingModal}
        onClose={() => setShowLiveVotingModal(false)}
      />

      {/* HOST CHAMBER / STAGE MODAL */}
      <HostChamberModal
        isOpen={showHostChamberModal}
        onClose={() => setShowHostChamberModal(false)}
      />

      {/* CREATE EVENT & INVITE MODAL */}
      <CreateChamberEventModal
        isOpen={showCreateEventModal}
        onClose={() => setShowCreateEventModal(false)}
      />

      {/* CUSTOM TIMER & PRESETS MODAL */}
      <CustomTimerModal
        isOpen={showCustomTimerModal}
        onClose={() => setShowCustomTimerModal(false)}
        onApplyTimer={(totalSec, speakerSec, label, mode) => {
          resetTimer(totalSec, label, mode);
        }}
      />

      {/* BIG-SCREEN PROJECTOR FULLSCREEN VIEW */}
      <FullscreenChamberView
        isOpen={showFullscreenView}
        onClose={() => setShowFullscreenView(false)}
      />

      {/* ROLL CALL & QUORUM INTELLIGENCE MODAL */}
      <RollCallManagementModal
        isOpen={showRollCallModal}
        onClose={() => setShowRollCallModal(false)}
      />

      {/* DIPLOMATIC CHITS & PAGE MESSENGER MODAL */}
      <DiplomaticChitsModal
        isOpen={showDiplomaticChitsModal}
        onClose={() => setShowDiplomaticChitsModal(false)}
      />

      {/* EDIT CHAMBER TITLE, AGENDA & PORTFOLIOS MODAL */}
      <EditChamberDetailsModal
        isOpen={showEditChamberModal}
        onClose={() => setShowEditChamberModal(false)}
      />

      {/* OFFICIAL SOURCES & NEWS MEDIA REFERENCE MODAL */}
      <OfficialSourcesModal
        isOpen={showOfficialSourcesModal}
        onClose={() => setShowOfficialSourcesModal(false)}
        onSelectForSpeech={(source) => {
          // If delegate is raising a motion or speech, append source
          if (motionTopic) {
            setMotionTopic((prev) => `${prev} [Ref: ${source.name}]`);
          }
        }}
      />

      {/* CHAMBER DAY HISTORY MODAL */}
      <ChamberDayHistoryModal
        isOpen={showDayHistoryModal}
        onClose={() => setShowDayHistoryModal(false)}
        committeeName={committee.name}
      />

      {/* COMMITTEE VALEDICTORY SUMMARY PAPER MODAL */}
      <CommitteeSummaryPaperModal
        isOpen={showSummaryPaperModal}
        onClose={() => setShowSummaryPaperModal(false)}
        committee={committee}
      />

      {/* LOK SABHA / INDIAN BILL DRAFTING MODAL */}
      <LokSabhaDraftModal
        isOpen={showLokSabhaDraftModal}
        onClose={() => setShowLokSabhaDraftModal(false)}
        onSelectDraftType={(type, title) => {
          router.push(`/docs?committee=${encodeURIComponent(committee.shortName || committee.name)}&mode=legislate&type=${type}`);
        }}
      />

      {/* UN DOCS MULTILATERAL DRAFTING MODAL */}
      <UnDocsDraftModal
        isOpen={showUnDocsDraftModal}
        onClose={() => setShowUnDocsDraftModal(false)}
        committeeName={committee.name}
        onSelectDraftType={(type, title) => {
          router.push(`/docs?committee=${encodeURIComponent(committee.shortName || committee.name)}&mode=docs&type=${type}`);
        }}
      />

      {/* QUICK NEW COMMITTEE CREATION MODAL (MUN Command style) */}
      <AnimatePresence>
        {showCreateCommitteeModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="w-full max-w-lg bg-[#0e121a] border border-white/15 rounded-3xl p-6 shadow-2xl space-y-4"
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2.5">
                  <div className="w-9 h-9 rounded-xl bg-cyan-500/10 border border-cyan-500/30 flex items-center justify-center text-cyan-400">
                    <Plus className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="text-base font-display font-semibold text-white">Create New Committee</h3>
                    <p className="text-xs font-mono text-neutral-400">Start a new chamber from scratch</p>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => setShowCreateCommitteeModal(false)}
                  className="p-1.5 rounded-lg text-neutral-400 hover:text-white hover:bg-white/10"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              <div className="space-y-3 font-mono text-xs">
                <div>
                  <label className="text-neutral-400 block mb-1">Committee Name</label>
                  <input
                    type="text"
                    value={newCommName}
                    onChange={(e) => setNewCommName(e.target.value)}
                    placeholder="e.g. Disarmament and International Security (DISEC)"
                    className="w-full bg-black/60 border border-white/15 focus:border-cyan-400 rounded-xl px-3 py-2 text-white placeholder-neutral-600 focus:outline-none"
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="text-neutral-400 block mb-1">Short Name / Code</label>
                    <input
                      type="text"
                      value={newCommShortName}
                      onChange={(e) => setNewCommShortName(e.target.value)}
                      placeholder="e.g. DISEC"
                      className="w-full bg-black/60 border border-white/15 focus:border-cyan-400 rounded-xl px-3 py-2 text-white placeholder-neutral-600 focus:outline-none uppercase"
                    />
                  </div>
                  <div>
                    <label className="text-neutral-400 block mb-1">Chamber Type</label>
                    <select
                      value={newCommType}
                      onChange={(e) => setNewCommType(e.target.value as MunCommitteeType)}
                      className="w-full bg-black/60 border border-white/15 focus:border-cyan-400 rounded-xl px-3 py-2 text-white focus:outline-none"
                    >
                      <option value="UNSC">UNSC</option>
                      <option value="UNGA">UNGA</option>
                      <option value="UNHRC">UNHRC</option>
                      <option value="CRISIS">Crisis Committee</option>
                      <option value="LOK_SABHA">Lok Sabha</option>
                      <option value="AIPPM">AIPPM</option>
                      <option value="DISEC">DISEC</option>
                      <option value="PARLIAMENTARY">Parliamentary</option>
                      <option value="OTHER">Custom / Other</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="text-neutral-400 block mb-1">Debate Agenda / Topic</label>
                  <textarea
                    rows={2}
                    value={newCommAgenda}
                    onChange={(e) => setNewCommAgenda(e.target.value)}
                    placeholder="Enter primary agenda or topic of deliberation..."
                    className="w-full bg-black/60 border border-white/15 focus:border-cyan-400 rounded-xl px-3 py-2 text-white placeholder-neutral-600 focus:outline-none resize-none"
                  />
                </div>

                <div>
                  <label className="text-neutral-400 block mb-1">Total Delegates (Quorum base)</label>
                  <input
                    type="number"
                    min={1}
                    max={200}
                    value={newCommDelegates}
                    onChange={(e) => setNewCommDelegates(Math.max(1, parseInt(e.target.value) || 15))}
                    className="w-full bg-black/60 border border-white/15 focus:border-cyan-400 rounded-xl px-3 py-2 text-white focus:outline-none"
                  />
                </div>
              </div>

              <div className="flex items-center justify-end gap-2 pt-2 border-t border-white/10 font-mono text-xs">
                <button
                  type="button"
                  onClick={() => setShowCreateCommitteeModal(false)}
                  className="px-4 py-2 rounded-xl text-neutral-400 hover:text-white hover:bg-white/5 transition"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={() => {
                    const name = newCommName.trim() || 'New Committee';
                    const shortName = newCommShortName.trim() || name.slice(0, 8).toUpperCase();
                    const agenda = newCommAgenda.trim() || 'General Deliberations';
                    const newComm = addCustomCommittee({
                      name,
                      shortName,
                      agenda,
                      type: newCommType,
                      totalDelegates: newCommDelegates,
                    });
                    setActiveCommitteeId(newComm.id);
                    setShowCreateCommitteeModal(false);
                  }}
                  className="px-5 py-2 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-black font-semibold transition active:scale-95"
                >
                  Create & Launch Chamber
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* MATRIX COMMITTEE CHAT INTEGRATION MODAL */}
      <CommitteeMatrixChatModal
        isOpen={showMatrixChatModal}
        onClose={() => setShowMatrixChatModal(false)}
        initialCommittee={committee}
        initialConferenceId={activeConference?.id}
        initialDate={activeConference?.startDate}
      />

      {/* COUNTRY PORTFOLIO MATRIX ALLOCATION MODAL */}
      <ChamberMatrixModal
        isOpen={showPortfolioMatrixModal}
        onClose={() => setShowPortfolioMatrixModal(false)}
        committee={committee}
        conferenceId={activeConference?.id}
        conferenceName={activeConference?.name}
      />

      {/* DAIS & SECRETARIAT SUPPORT HOTLINE MODAL */}
      <DaisSupportHotlineModal
        isOpen={showDaisSupportModal}
        onClose={() => setShowDaisSupportModal(false)}
        committeeName={committee?.name}
        committeeId={committee?.id}
      />
    </div>
  );
}

export default CommitteeChamber;
