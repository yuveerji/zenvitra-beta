'use client';

import React, { useState, useRef, useEffect } from 'react';
import {
  RotateCcw,
  Play,
  Pause,
  SkipForward,
  Clock,
  CornerUpRight,
  Reply,
  PanelLeftClose,
  PanelLeftOpen,
  Plus,
  X,
  Edit2,
  Check,
  Flame,
  Volume2,
  Mic,
  MessageSquare,
  Trophy,
  Settings,
  Gavel,
  BookOpen,
  Vote,
  Sparkles,
  HelpCircle,
  LifeBuoy,
} from 'lucide-react';
import { useZenMun } from '@/context/ZenMunContext';
import { ZenDelegate } from '@/types/zenMun';
import { DaisSupportHotlineModal } from '../support/DaisSupportHotlineModal';

export function CommitteeEmblemDisplay({
  emblem,
  acronym,
  isIndian,
  size = 32,
}: {
  emblem?: string;
  acronym?: string;
  isIndian?: boolean;
  size?: number;
}) {
  const isInd = Boolean(isIndian || (acronym && acronym.toLowerCase().includes('lok')));
  if (isInd) {
    return (
      <img
        src="/assets/committees/emblem_of_india.svg"
        alt="Emblem of India"
        style={{ width: size, height: size }}
        className="object-contain shrink-0"
      />
    );
  }
  if (emblem && (emblem.startsWith('/') || emblem.startsWith('http') || emblem.endsWith('.svg') || emblem.endsWith('.png'))) {
    return (
      <img
        src={emblem}
        alt="Committee Emblem"
        style={{ width: size, height: size }}
        className="object-contain shrink-0"
      />
    );
  }
  return <span className="text-2xl shrink-0">{emblem || '🏛️'}</span>;
}

export function ZenMunChairConsole() {
  const {
    session,
    setSession,
    toggleTimer,
    startTimer,
    pauseTimer,
    resetTimer,
    addTimeToClock,
    setSpeakingSlotTime,
    nextSpeaker,
    addSpeakerToQueue,
    removeSpeakerFromQueue,
    reorderSpeakerQueue,
    openRtr,
    toggleRtrTimer,
    closeRtr,
    openYieldPopover,
    closeYieldPopover,
    yieldToNextSpeaker,
    yieldToDelegate,
    addSeat,
    endCaucusAndReturnToGsl,
    saveCommenterFeedback,
    setChairRole,
    setDelegateAttendance,
    setAllAttendance,
    updateTopic,
    isSidebarCollapsed,
    toggleSidebar,
    setShowQrOverlay,
    setShowRollCallModal,
    setShowMotionsModal,
    setShowDocumentsModal,
    setShowScoreboardModal,
    setShowSettingsModal,
    setShowChatDrawer,
    startTutorial,
    quorum,
  } = useZenMun();

  // Inline topic editing
  const [isEditingTopic, setIsEditingTopic] = useState(false);
  const [topicDraft, setTopicDraft] = useState(session.topic);

  // New seat input in sidebar
  const [newSeatName, setNewSeatName] = useState('');

  // Bottom speaker input
  const [bottomInput, setBottomInput] = useState('');
  const [bottomDropdown, setBottomDropdown] = useState(false);

  // Add time popover
  const [showAddTimePopover, setShowAddTimePopover] = useState(false);
  const [customAddSeconds, setCustomAddSeconds] = useState(30);
  const [showSupportModal, setShowSupportModal] = useState(false);

  // Yield delegation autocomplete
  const [yieldSearch, setYieldSearch] = useState('');
  const [yieldSelectedId, setYieldSelectedId] = useState('');

  // Commenter state (when role === 'commenter')
  const [commenterNote, setCommenterNote] = useState('');
  const [diplomacyRating, setDiplomacyRating] = useState(8);
  const [publicSpeakingRating, setPublicSpeakingRating] = useState(7);
  const [collaborationRating, setCollaborationRating] = useState(9);
  const [contentRating, setContentRating] = useState(7);
  const [savedFeedbackAlert, setSavedFeedbackAlert] = useState(false);

  const activeDelegate: ZenDelegate | undefined = session.roster.find(
    (d) => d.id === session.currentSpeakerId
  ) || session.roster[0];

  const nextQueuedDelegate: ZenDelegate | undefined = session.roster.find(
    (d) => d.id === (session.activeMode === 'gsl' ? session.speakerQueue[1] : session.caucusSpeakerQueue[1])
  );

  // Format MM:SS
  const formatTime = (totalSec: number) => {
    const mins = Math.floor(Math.max(0, totalSec) / 60);
    const secs = Math.max(0, totalSec) % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const isAmber = session.remainingSeconds <= 10 && session.remainingSeconds > 0;
  const progressRatio = session.speakingTimeSeconds > 0
    ? Math.max(0, Math.min(1, session.remainingSeconds / session.speakingTimeSeconds))
    : 0;

  const handleTopicSave = () => {
    if (topicDraft.trim()) {
      updateTopic(topicDraft.trim());
    }
    setIsEditingTopic(false);
  };

  const handleAddSeatKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      addSeat(newSeatName, e.shiftKey);
      setNewSeatName('');
    }
  };

  const filteredBottomDelegates = session.roster.filter(
    (d) =>
      d.name.toLowerCase().includes(bottomInput.toLowerCase()) &&
      !(session.activeMode === 'gsl' ? session.speakerQueue : session.caucusSpeakerQueue).includes(d.id)
  );

  const handleSaveCommenterNote = (e: React.FormEvent) => {
    e.preventDefault();
    if (!activeDelegate) return;
    saveCommenterFeedback({
      delegateId: activeDelegate.id,
      delegateName: activeDelegate.name,
      speechType: session.activeMode === 'gsl' ? 'GSL' : 'CAUCUS',
      note: commenterNote.trim(),
      ratings: {
        diplomacy: diplomacyRating,
        publicSpeaking: publicSpeakingRating,
        collaboration: collaborationRating,
        contentResearch: contentRating,
      },
      commenterName: session.chairName || 'Commenter',
    });
    setCommenterNote('');
    setSavedFeedbackAlert(true);
    setTimeout(() => setSavedFeedbackAlert(false), 2000);
  };

  const isPreSession = session.sessionState === 'pre-session';

  if (isPreSession) {
    return (
      <div className="min-h-screen bg-[#E5E1D5] text-[#1A1D1A] font-sans antialiased flex flex-col select-none">
        {/* Top Header */}
        <header className="h-14 bg-[#E5E1D5] border-b border-[#D6D1C4] px-6 flex items-center justify-between z-40">
          <div className="flex items-center gap-2">
            <span className="text-sm font-bold text-[#243928]">
              {(session.committeeName || 'Lok Sabha').replace(/_/g, ' ')}: {session.topic}
            </span>
          </div>

          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={() => {
                setSession((prev) => ({
                  ...prev,
                  sessionState: 'in-session',
                  tutorial: {
                    ...prev.tutorial,
                    welcomeModalOpen: !prev.tutorial.isCompleted,
                  },
                }));
              }}
              className="px-4 py-1.5 rounded-xl bg-[#243928] hover:bg-[#324f38] text-[#E4DB98] font-black text-xs uppercase tracking-wider transition cursor-pointer shadow-sm active:scale-95 flex items-center gap-1.5"
            >
              <span>Go to Live Dais &rarr;</span>
            </button>
            <button
              type="button"
              onClick={() => setShowQrOverlay(true)}
              className="px-3.5 py-1.5 rounded-xl bg-white hover:bg-[#FAF9F5] text-[#243928] font-mono font-black text-xs border border-[#D6D1C4] flex items-center gap-1.5 shadow-2xs cursor-pointer"
            >
              <span>&nearr;</span>
              <span>{session.sessionCode}</span>
            </button>
            <button
              type="button"
              onClick={() => setShowScoreboardModal(true)}
              className="p-2 rounded-xl bg-white hover:bg-[#FAF9F5] text-[#A1853B] border border-[#D6D1C4] shadow-2xs cursor-pointer"
            >
              <Trophy className="w-4 h-4" />
            </button>
            <button
              type="button"
              onClick={() => setShowSettingsModal(true)}
              className="p-2 rounded-xl bg-white hover:bg-[#FAF9F5] text-[#243928] border border-[#D6D1C4] shadow-2xs cursor-pointer"
            >
              <Settings className="w-4 h-4" />
            </button>
            <button
              type="button"
              onClick={() => setShowSupportModal(true)}
              className="p-2 rounded-xl bg-white hover:bg-[#FAF9F5] text-cyan-700 border border-[#D6D1C4] shadow-2xs cursor-pointer"
              title="Dais & Secretariat Support Hotline"
            >
              <LifeBuoy className="w-4 h-4" />
            </button>
          </div>
        </header>

        {/* Center Canvas: Matches Screenshot 2026-10-18 030241.png */}
        <main className="flex-1 flex items-center justify-center p-6 gap-6 flex-wrap">
          {/* Left Card: Will delegates join on their phones? */}
          <div className="p-6 rounded-3xl bg-white border border-[#D6D1C4] shadow-xl max-w-xs w-full space-y-4 self-center">
            <div className="w-10 h-10 rounded-full bg-[#243928] text-white flex items-center justify-center text-lg shadow-sm">
              📱
            </div>
            <div className="text-sm font-black text-[#1A1D1A] leading-snug">
              Will delegates join on their phones?
            </div>
            <div className="flex items-center gap-2 pt-1">
              <button
                type="button"
                onClick={() => setSession((p) => ({ ...p, settings: { ...p.settings, allowPhoneVoting: true } }))}
                className={`flex-1 py-2.5 rounded-xl text-xs font-black uppercase transition cursor-pointer ${
                  session.settings.allowPhoneVoting
                    ? 'bg-[#243928] text-white shadow-xs'
                    : 'bg-[#FAF9F5] text-[#7A7870] border border-[#D6D1C4]'
                }`}
              >
                Yes
              </button>
              <button
                type="button"
                onClick={() => setSession((p) => ({ ...p, settings: { ...p.settings, allowPhoneVoting: false } }))}
                className={`flex-1 py-2.5 rounded-xl text-xs font-black uppercase transition cursor-pointer ${
                  !session.settings.allowPhoneVoting
                    ? 'bg-[#243928] text-white shadow-xs'
                    : 'bg-[#FAF9F5] text-[#7A7870] border border-[#D6D1C4]'
                }`}
              >
                No
              </button>
            </div>
          </div>

          {/* Right Card: Dark Forest Green Attendance Card */}
          <div className="bg-[#243928] text-white rounded-3xl p-6 sm:p-7 max-w-xl w-full border border-[#1b2b1e] shadow-2xl space-y-5">
            {/* Header */}
            <div className="flex items-center justify-between border-b border-white/10 pb-4">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-2xl bg-white/10 flex items-center justify-center p-1.5 border border-white/10 overflow-hidden shrink-0">
                  <CommitteeEmblemDisplay
                    emblem={session.emblemUrl}
                    acronym={session.committeeAcronym}
                    isIndian={session.isIndianCommittee}
                    size={38}
                  />
                </div>
                <div>
                  <h3 className="text-lg font-black tracking-tight uppercase text-white">
                    {(session.committeeAcronym || session.committeeName || 'LOK SABHA').replace(/_/g, ' ')}
                  </h3>
                  <div className="text-xs text-[#A6C4AD]">
                    {(session.committeeName || 'Lok Sabha').replace(/_/g, ' ')}
                  </div>
                  <div className="text-xs text-[#D8E6DA] flex items-center gap-1.5 mt-1">
                    <span>Topic: {session.topic}</span>
                    <button
                      type="button"
                      onClick={() => {
                        setTopicDraft(session.topic);
                        setIsEditingTopic(!isEditingTopic);
                      }}
                      className="px-2 py-0.5 rounded-lg bg-white/10 hover:bg-white/20 text-[#E4DB98] hover:text-white text-[11px] font-bold flex items-center gap-1 cursor-pointer transition border border-white/15 shadow-2xs"
                      title="Edit Topic / Agenda"
                    >
                      <Edit2 className="w-3 h-3" />
                      <span>Edit</span>
                    </button>
                  </div>
                </div>
              </div>
            </div>

            {/* Quorum and Add a Seat */}
            <div className="flex items-center justify-between gap-3">
              <div className="flex items-center gap-2 text-center">
                <div className="px-2.5 py-1 rounded-xl bg-black/25 border border-white/10">
                  <div className="text-[9px] uppercase tracking-wider text-[#A6C4AD]">Present</div>
                  <div className="text-xs font-black text-[#E4DB98] font-mono">{quorum.present}</div>
                </div>
                <div className="px-2.5 py-1 rounded-xl bg-black/25 border border-white/10">
                  <div className="text-[9px] uppercase tracking-wider text-[#A6C4AD]">2/3</div>
                  <div className="text-xs font-black text-white font-mono">{quorum.twoThirds}</div>
                </div>
                <div className="px-2.5 py-1 rounded-xl bg-black/25 border border-white/10">
                  <div className="text-[9px] uppercase tracking-wider text-[#A6C4AD]">1/2+1</div>
                  <div className="text-xs font-black text-white font-mono">{quorum.simpleMajority}</div>
                </div>
              </div>

              <div className="flex-1 max-w-[200px]">
                <input
                  type="text"
                  value={newSeatName}
                  onChange={(e) => setNewSeatName(e.target.value)}
                  onKeyDown={handleAddSeatKeyDown}
                  placeholder="+ Add a seat"
                  className="w-full px-3 py-1.5 rounded-xl bg-white/10 border border-white/20 text-xs text-white placeholder-white/40 focus:outline-none focus:ring-1 focus:ring-[#E4DB98]"
                />
              </div>
            </div>

            {/* Bulk Attendance Row */}
            <div className="grid grid-cols-3 gap-2">
              <button
                type="button"
                onClick={() => setAllAttendance('absent')}
                className="py-2.5 rounded-xl bg-[#4A2825] hover:bg-[#5a322e] text-white text-[11px] font-black uppercase tracking-wider cursor-pointer transition shadow-2xs"
              >
                CLEAR ALL
              </button>
              <button
                type="button"
                onClick={() => setAllAttendance('present')}
                className="py-2.5 rounded-xl bg-[#2E5536] hover:bg-[#386641] text-white text-[11px] font-black uppercase tracking-wider cursor-pointer transition shadow-2xs"
              >
                ALL PRESENT
              </button>
              <button
                type="button"
                onClick={() => setAllAttendance('present_voting')}
                className="py-2.5 rounded-xl bg-[#4D532B] hover:bg-[#5c6334] text-white text-[11px] font-black uppercase tracking-wider cursor-pointer transition shadow-2xs"
              >
                ALL P+V
              </button>
            </div>

            {/* Roster Attendance Rows */}
            <div className="space-y-2 max-h-72 overflow-y-auto pr-1">
              {session.roster.map((d) => (
                <div
                  key={d.id}
                  className="p-2.5 rounded-2xl bg-white/5 hover:bg-white/10 border border-white/10 flex items-center justify-between gap-3 transition"
                >
                  <div className="flex items-center gap-2.5 min-w-0">
                    <img
                      src={`https://flagcdn.com/w80/${d.countryCode.toLowerCase()}.png`}
                      alt=""
                      className="w-5 h-5 rounded-full object-cover shrink-0"
                    />
                    <span className="text-xs font-bold text-white truncate">{d.name}</span>
                  </div>

                  <div className="flex items-center gap-2 shrink-0">
                    <button
                      type="button"
                      className="text-white/40 hover:text-white p-1 cursor-pointer"
                      title="Audio check"
                    >
                      <Volume2 className="w-3.5 h-3.5" />
                    </button>

                    <div className="inline-flex rounded-full bg-black/30 p-0.5 border border-white/10">
                      <button
                        type="button"
                        onClick={() => setDelegateAttendance(d.id, 'absent')}
                        className={`w-6 h-6 rounded-full text-[10px] font-black cursor-pointer transition ${
                          d.attendance === 'absent'
                            ? 'bg-rose-700 text-white shadow-xs'
                            : 'text-white/50 hover:text-white'
                        }`}
                      >
                        A
                      </button>
                      <button
                        type="button"
                        onClick={() => setDelegateAttendance(d.id, 'present')}
                        className={`px-2 h-6 rounded-full text-[10px] font-black cursor-pointer transition ${
                          d.attendance === 'present'
                            ? 'bg-emerald-600 text-white shadow-xs'
                            : 'text-white/50 hover:text-white'
                        }`}
                      >
                        P
                      </button>
                      <button
                        type="button"
                        onClick={() => setDelegateAttendance(d.id, 'present_voting')}
                        className={`px-2 h-6 rounded-full text-[10px] font-black cursor-pointer transition ${
                          d.attendance === 'present_voting'
                            ? 'bg-amber-600 text-white shadow-xs'
                            : 'text-white/50 hover:text-white'
                        }`}
                      >
                        PV
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Bottom Button */}
            {quorum.present === 0 ? (
              <button
                type="button"
                onClick={() => {
                  setAllAttendance('present');
                  setSession((prev) => ({
                    ...prev,
                    sessionState: 'in-session',
                    tutorial: {
                      ...prev.tutorial,
                      welcomeModalOpen: !prev.tutorial.isCompleted,
                    },
                  }));
                }}
                className="w-full py-4 rounded-2xl bg-[#39683C] hover:bg-[#325b35] text-white font-black text-xs uppercase tracking-wider cursor-pointer shadow-lg active:scale-98 transition text-center flex items-center justify-center gap-2"
              >
                <span>MARK ALL PRESENT &amp; START SESSION &rarr;</span>
              </button>
            ) : (
              <button
                type="button"
                onClick={() => {
                  setSession((prev) => ({
                    ...prev,
                    sessionState: 'in-session',
                    tutorial: {
                      ...prev.tutorial,
                      welcomeModalOpen: !prev.tutorial.isCompleted,
                    },
                  }));
                }}
                className="w-full py-4 rounded-2xl bg-[#39683C] hover:bg-[#325b35] text-white font-black text-xs uppercase tracking-wider cursor-pointer shadow-lg active:scale-98 transition text-center flex items-center justify-center gap-2"
              >
                <span>START SESSION &rarr;</span>
              </button>
            )}
          </div>
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#E5E1D5] text-[#1A1D1A] font-sans antialiased flex flex-col select-none overflow-x-hidden">
      
      {/* ─────────────────────────────────────────────────────────────
          1. TOP BAR (56px, #F2F1ED)
      ───────────────────────────────────────────────────────────── */}
      <header className="h-14 bg-[#F2F1ED] border-b border-[#D6D1C4] px-4 flex items-center justify-between z-40 shrink-0">
        
        {/* Left: Navigation Tabs */}
        <div className="flex items-center gap-1.5" id="tutorial-target-nav">
          <button
            type="button"
            onClick={toggleSidebar}
            className="p-2 rounded-xl text-[#243928] hover:bg-[#E2DDD2] transition cursor-pointer mr-1"
            title="Toggle Sidebar"
          >
            {isSidebarCollapsed ? <PanelLeftOpen className="w-4 h-4" /> : <PanelLeftClose className="w-4 h-4" />}
          </button>

          <button
            type="button"
            id="tutorial-target-rollcall-tab"
            onClick={() => setShowRollCallModal(true)}
            className="px-3.5 py-1.5 rounded-xl font-bold text-xs bg-white hover:bg-[#FAF9F5] text-[#1A1D1A] border border-[#D6D1C4] shadow-2xs cursor-pointer transition active:scale-95"
          >
            Roll Call
          </button>

          <button
            type="button"
            id="tutorial-target-motions-tab"
            onClick={() => setShowMotionsModal(true)}
            className="px-3.5 py-1.5 rounded-xl font-bold text-xs bg-white hover:bg-[#FAF9F5] text-[#1A1D1A] border border-[#D6D1C4] shadow-2xs cursor-pointer transition active:scale-95"
          >
            Motions
          </button>

          <button
            type="button"
            id="tutorial-target-documents-tab"
            onClick={() => setShowDocumentsModal(true)}
            className="px-3.5 py-1.5 rounded-xl font-bold text-xs bg-white hover:bg-[#FAF9F5] text-[#1A1D1A] border border-[#D6D1C4] shadow-2xs cursor-pointer transition active:scale-95"
          >
            Documents
          </button>
        </div>

        {/* Right: Utility Cluster */}
        <div className="flex items-center gap-2">
          
          {/* Moderator vs Commenter Role Switcher */}
          <button
            type="button"
            onClick={() => setChairRole(session.chairRole === 'moderator' ? 'commenter' : 'moderator')}
            className={`px-3 py-1.5 rounded-xl font-bold text-xs flex items-center gap-1.5 transition cursor-pointer border ${
              session.chairRole === 'moderator'
                ? 'bg-[#243928] text-[#E4DB98] border-[#243928]'
                : 'bg-amber-100 text-amber-900 border-amber-300'
            }`}
            title="Switch Dais Role"
          >
            <Gavel className="w-3.5 h-3.5" />
            <span>{session.chairRole === 'moderator' ? 'Moderator' : 'Commenter'}</span>
          </button>

          {/* Session Code Chip */}
          <button
            type="button"
            id="tutorial-target-session-code"
            onClick={() => setShowQrOverlay(true)}
            className="px-3 py-1.5 rounded-xl bg-white hover:bg-[#FAF9F5] text-[#243928] font-mono font-black text-xs border border-[#D6D1C4] flex items-center gap-1.5 shadow-2xs cursor-pointer active:scale-95 transition"
            title="Project Room Code & QR"
          >
            <span>&nearr;</span>
            <span>{session.sessionCode}</span>
          </button>

          {/* Chat */}
          <button
            type="button"
            id="tutorial-target-chat-btn"
            onClick={() => setShowChatDrawer(true)}
            className="p-2 rounded-xl bg-white hover:bg-[#FAF9F5] text-[#243928] border border-[#D6D1C4] shadow-2xs cursor-pointer transition"
            title="Open Chat"
          >
            <MessageSquare className="w-4 h-4" />
          </button>

          {/* Scoreboard Trophy */}
          <button
            type="button"
            id="tutorial-target-scoreboard-btn"
            onClick={() => setShowScoreboardModal(true)}
            className="p-2 rounded-xl bg-white hover:bg-[#FAF9F5] text-[#A1853B] border border-[#D6D1C4] shadow-2xs cursor-pointer transition"
            title="Open Scoreboard"
          >
            <Trophy className="w-4 h-4" />
          </button>

          {/* Settings Gear */}
          <button
            type="button"
            id="tutorial-target-settings-btn"
            onClick={() => setShowSettingsModal(true)}
            className="p-2 rounded-xl bg-white hover:bg-[#FAF9F5] text-[#243928] border border-[#D6D1C4] shadow-2xs cursor-pointer transition"
            title="Open Settings"
          >
            <Settings className="w-4 h-4" />
          </button>

          {/* Dais & Secretariat Support Hotline */}
          <button
            type="button"
            onClick={() => setShowSupportModal(true)}
            className="p-2 rounded-xl bg-white hover:bg-[#FAF9F5] text-cyan-700 border border-[#D6D1C4] shadow-2xs cursor-pointer transition"
            title="Dais & Secretariat Support Hotline"
          >
            <LifeBuoy className="w-4 h-4" />
          </button>

          {/* Tutorial Button */}
          <button
            type="button"
            onClick={startTutorial}
            className="px-2.5 py-1.5 rounded-xl bg-[#EFECE4] hover:bg-[#E0DCCE] text-[#243928] text-xs font-bold flex items-center gap-1 cursor-pointer border border-[#D6D1C4]"
            title="Run Interactive Tutorial"
          >
            <HelpCircle className="w-3.5 h-3.5 text-[#39683C]" />
            <span className="hidden sm:inline">Tutorial</span>
          </button>
        </div>
      </header>

      {/* ─────────────────────────────────────────────────────────────
          2. MAIN SPLIT BODY (Collapsible Left Sidebar + Center Stage)
      ───────────────────────────────────────────────────────────── */}
      <div className="flex-1 flex overflow-hidden relative">

        {/* ── LEFT COLLAPSIBLE SIDEBAR (#2D3F31, 300px) ── */}
        {!isSidebarCollapsed && (
          <aside id="tutorial-target-sidebar" className="w-[300px] bg-[#2D3F31] text-white border-r border-[#1F2B22] flex flex-col shrink-0 z-20">
            
            {/* Header: Emblem + Committee Name + Topic */}
            <div className="p-4 border-b border-white/10 space-y-1">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2.5 min-w-0">
                  <div className="w-8 h-8 rounded-lg bg-white/10 flex items-center justify-center p-1 border border-white/10 overflow-hidden shrink-0">
                    <CommitteeEmblemDisplay
                      emblem={session.emblemUrl}
                      acronym={session.committeeAcronym}
                      isIndian={session.isIndianCommittee}
                      size={24}
                    />
                  </div>
                  <div className="text-sm font-black tracking-tight uppercase text-[#E4DB98] truncate">
                    {(session.committeeAcronym || session.committeeName || 'LOK SABHA').replace(/_/g, ' ')}
                  </div>
                </div>
                <button
                  type="button"
                  onClick={toggleSidebar}
                  className="text-white/60 hover:text-white p-1 cursor-pointer"
                  title="Collapse Sidebar"
                >
                  <PanelLeftClose className="w-4 h-4" />
                </button>
              </div>

              {/* Inline Topic Editor */}
              <div className="pt-1.5" id="tutorial-target-topic">
                {isEditingTopic ? (
                  <div className="flex items-center gap-1">
                    <input
                      type="text"
                      value={topicDraft}
                      onChange={(e) => setTopicDraft(e.target.value)}
                      className="w-full px-2 py-1 rounded bg-[#1F2B22] border border-white/20 text-xs text-white"
                      autoFocus
                    />
                    <button
                      type="button"
                      onClick={handleTopicSave}
                      className="p-1 text-emerald-400 hover:text-white cursor-pointer"
                      title="Save Topic"
                    >
                      <Check className="w-3.5 h-3.5" />
                    </button>
                  </div>
                ) : (
                  <div className="flex items-center justify-between text-xs text-[#A6C4AD] font-medium group">
                    <span className="truncate">Topic: {session.topic}</span>
                    <button
                      type="button"
                      onClick={() => {
                        setTopicDraft(session.topic);
                        setIsEditingTopic(true);
                      }}
                      className="px-1.5 py-0.5 rounded-md bg-white/10 hover:bg-white/20 text-[#E4DB98] hover:text-white text-[10px] font-bold flex items-center gap-1 cursor-pointer transition border border-white/15 ml-1 shrink-0"
                      title="Edit Topic / Agenda"
                    >
                      <Edit2 className="w-2.5 h-2.5" />
                      <span>Edit</span>
                    </button>
                  </div>
                )}
              </div>
            </div>

            {/* Quorum Gauges & +Add a Seat */}
            <div className="p-3 bg-[#243427] border-b border-white/10 flex items-center justify-between gap-2" id="tutorial-target-quorum-gauges">
              <div className="flex items-center gap-2 text-center">
                <div className="px-2 py-1 rounded-lg bg-black/20 border border-white/10">
                  <div className="text-[9px] uppercase tracking-wider text-[#A6C4AD]">Present</div>
                  <div className="text-xs font-black text-[#E4DB98] font-mono">{quorum.present}</div>
                </div>
                <div className="px-2 py-1 rounded-lg bg-black/20 border border-white/10">
                  <div className="text-[9px] uppercase tracking-wider text-[#A6C4AD]">2/3</div>
                  <div className="text-xs font-black text-white font-mono">{quorum.twoThirds}</div>
                </div>
                <div className="px-2 py-1 rounded-lg bg-black/20 border border-white/10">
                  <div className="text-[9px] uppercase tracking-wider text-[#A6C4AD]">1/2+1</div>
                  <div className="text-xs font-black text-white font-mono">{quorum.simpleMajority}</div>
                </div>
              </div>

              {/* Add a seat input */}
              <div className="flex-1 min-w-0">
                <input
                  type="text"
                  value={newSeatName}
                  onChange={(e) => setNewSeatName(e.target.value)}
                  onKeyDown={handleAddSeatKeyDown}
                  placeholder="+ Add a seat"
                  className="w-full px-2.5 py-1.5 rounded-xl bg-white/10 border border-white/15 text-xs text-white placeholder-white/40 focus:outline-none focus:ring-1 focus:ring-[#E4DB98]"
                  title="Press Enter for Present, Shift+Enter for Observer"
                />
              </div>
            </div>

            {/* Pinned Speaker Queue & Alphabetical Seated Roster */}
            <div className="flex-1 overflow-y-auto p-3 space-y-4">
              
              {/* PINNED SPEAKER QUEUE (Top of Sidebar) */}
              <div className="space-y-1.5">
                <div className="text-[10px] font-bold uppercase tracking-wider text-[#A6C4AD] px-1">
                  Active Speaker Queue
                </div>

                {(session.activeMode === 'gsl' ? session.speakerQueue : session.caucusSpeakerQueue).map((delId, qIdx) => {
                  const del = session.roster.find((d) => d.id === delId);
                  if (!del) return null;
                  const isActive = qIdx === 0;

                  return (
                    <div
                      key={del.id}
                      className={`p-2.5 rounded-2xl flex items-center justify-between gap-2 transition ${
                        isActive
                          ? 'bg-[#415039] border-[1.5px] border-[#A1853B] shadow-sm'
                          : 'bg-[#324436] hover:bg-[#3A4E3E] border border-white/5'
                      }`}
                    >
                      <div className="flex items-center gap-2.5 min-w-0">
                        {/* Flag with Badge */}
                        <div className="relative shrink-0">
                          <img
                            src={`https://flagcdn.com/w80/${del.countryCode.toLowerCase()}.png`}
                            alt=""
                            className="w-6 h-6 rounded-full object-cover border border-black/20"
                            onError={(e) => {
                              (e.target as HTMLElement).style.display = 'none';
                            }}
                          />
                          <span
                            className={`absolute -top-1 -right-1 w-3.5 h-3.5 rounded-full flex items-center justify-center text-[9px] font-bold ${
                              isActive && session.isTimerRunning
                                ? 'bg-amber-500 text-black'
                                : 'bg-black/60 text-white'
                            }`}
                          >
                            {isActive && session.isTimerRunning ? <Mic className="w-2 h-2" /> : qIdx + 1}
                          </span>
                        </div>

                        <div className="min-w-0">
                          <div className="text-xs font-bold text-white truncate">{del.name}</div>
                          <div className="text-[10px] text-[#A6C4AD] font-medium leading-none">
                            {isActive
                              ? session.isTimerRunning
                                ? 'SPEAKING'
                                : 'READY TO SPEAK'
                              : 'In Queue'}
                          </div>
                        </div>
                      </div>

                      <div className="flex items-center gap-1 shrink-0">
                        <button
                          type="button"
                          onClick={() => removeSpeakerFromQueue(qIdx)}
                          className="text-white/40 hover:text-rose-400 p-0.5 cursor-pointer"
                          title="Remove from queue"
                        >
                          <X className="w-3.5 h-3.5" />
                        </button>
                        <span className="text-white/30 text-xs cursor-grab">&vellip;&vellip;</span>
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* ALPHABETICAL SEATED ROSTER (Below Queue) */}
              <div className="space-y-1 pt-2 border-t border-white/10">
                <div className="text-[10px] font-bold uppercase tracking-wider text-[#A6C4AD] px-1">
                  Seated Delegations (Click to Add)
                </div>
                {session.roster.map((d) => (
                  <button
                    key={d.id}
                    type="button"
                    onClick={() => addSpeakerToQueue(d.id)}
                    className="w-full p-2 rounded-xl bg-[#324436] hover:bg-[#3A4E3E] text-left flex items-center justify-between border border-white/5 transition cursor-pointer group"
                  >
                    <div className="flex items-center gap-2 min-w-0">
                      <img
                        src={`https://flagcdn.com/w80/${d.countryCode.toLowerCase()}.png`}
                        alt=""
                        className="w-5 h-5 rounded-full object-cover shrink-0"
                        onError={(e) => {
                          (e.target as HTMLElement).style.display = 'none';
                        }}
                      />
                      <span className="text-xs font-semibold text-white truncate">{d.name}</span>
                    </div>
                    <span className="text-[10px] text-[#A6C4AD] opacity-0 group-hover:opacity-100 font-mono transition">
                      + Add
                    </span>
                  </button>
                ))}
              </div>
            </div>
          </aside>
        )}

        {/* ── CENTER STAGE: GSL / CAUCUS RUNNER / COMMENTER DOCK ── */}
        <main className="flex-1 flex flex-col justify-between overflow-y-auto relative p-6">
          
          {/* Subtle Centered UN Laurel Watermark */}
          <div className="absolute inset-0 flex items-center justify-center pointer-events-none opacity-[0.035] text-[35vw]">
            🏛️
          </div>

          {/* IF ROLE IS COMMENTER: SHOW COMMENTER FEEDBACK DOCK */}
          {session.chairRole === 'commenter' ? (
            <div className="max-w-2xl w-full mx-auto my-auto space-y-6 z-10 animate-fade-in">
              <div className="p-6 rounded-3xl bg-white border border-[#D6D1C4] shadow-xl space-y-5">
                <div className="flex items-center justify-between border-b pb-3">
                  <div className="flex items-center gap-3">
                    <span className="text-xs font-bold uppercase bg-[#EFECE4] px-2.5 py-1 rounded text-[#243928]">
                      {session.activeMode === 'gsl' ? 'GSL' : 'CAUCUS'}
                    </span>
                    {activeDelegate && (
                      <div className="flex items-center gap-2">
                        <img
                          src={`https://flagcdn.com/w80/${activeDelegate.countryCode.toLowerCase()}.png`}
                          alt=""
                          className="w-6 h-6 rounded-full object-cover border"
                        />
                        <span className="text-base font-black text-[#1A1D1A]">{activeDelegate.name}</span>
                      </div>
                    )}
                  </div>
                  <span className="text-xs font-mono font-bold uppercase text-amber-700 tracking-wider">
                    NOW SPEAKING
                  </span>
                </div>

                <form onSubmit={handleSaveCommenterNote} className="space-y-4">
                  <div>
                    <label className="block text-[10px] font-bold uppercase tracking-wider text-[#7A7870] mb-1">
                      Private Note (Exported to Scoreboard Ledger)
                    </label>
                    <textarea
                      rows={3}
                      value={commenterNote}
                      onChange={(e) => setCommenterNote(e.target.value)}
                      placeholder="e.g. Strong framing, cited the 2019 protocol directly..."
                      className="w-full p-3 rounded-xl bg-[#FAF9F5] border border-[#D6D1C4] text-xs font-medium text-[#1A1D1A] focus:outline-none focus:ring-1 focus:ring-[#243928]"
                    />
                  </div>

                  {/* 2x2 Slider Grid */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-1">
                    <div className="p-3 rounded-xl bg-[#FAF9F5] border border-[#E0DCCE] space-y-1">
                      <div className="flex justify-between text-xs font-bold">
                        <span>DIPLOMACY</span>
                        <span className="text-[#243928]">{diplomacyRating}/10</span>
                      </div>
                      <input
                        type="range"
                        min={0}
                        max={10}
                        value={diplomacyRating}
                        onChange={(e) => setDiplomacyRating(parseInt(e.target.value))}
                        className="w-full accent-[#243928] cursor-pointer"
                      />
                    </div>

                    <div className="p-3 rounded-xl bg-[#FAF9F5] border border-[#E0DCCE] space-y-1">
                      <div className="flex justify-between text-xs font-bold">
                        <span>PUBLIC SPEAKING</span>
                        <span className="text-[#243928]">{publicSpeakingRating}/10</span>
                      </div>
                      <input
                        type="range"
                        min={0}
                        max={10}
                        value={publicSpeakingRating}
                        onChange={(e) => setPublicSpeakingRating(parseInt(e.target.value))}
                        className="w-full accent-[#243928] cursor-pointer"
                      />
                    </div>

                    <div className="p-3 rounded-xl bg-[#FAF9F5] border border-[#E0DCCE] space-y-1">
                      <div className="flex justify-between text-xs font-bold">
                        <span>COLLABORATION</span>
                        <span className="text-[#243928]">{collaborationRating}/10</span>
                      </div>
                      <input
                        type="range"
                        min={0}
                        max={10}
                        value={collaborationRating}
                        onChange={(e) => setCollaborationRating(parseInt(e.target.value))}
                        className="w-full accent-[#243928] cursor-pointer"
                      />
                    </div>

                    <div className="p-3 rounded-xl bg-[#FAF9F5] border border-[#E0DCCE] space-y-1">
                      <div className="flex justify-between text-xs font-bold">
                        <span>CONTENT &amp; RESEARCH</span>
                        <span className="text-[#243928]">{contentRating}/10</span>
                      </div>
                      <input
                        type="range"
                        min={0}
                        max={10}
                        value={contentRating}
                        onChange={(e) => setContentRating(parseInt(e.target.value))}
                        className="w-full accent-[#243928] cursor-pointer"
                      />
                    </div>
                  </div>

                  <div className="flex items-center justify-between pt-2">
                    {savedFeedbackAlert ? (
                      <span className="text-xs font-bold text-emerald-700 flex items-center gap-1">
                        <Check className="w-4 h-4" /> Note Saved to Ledger!
                      </span>
                    ) : <span />}
                    <button
                      type="submit"
                      className="px-6 py-2.5 rounded-xl bg-[#243928] hover:bg-[#324f38] text-[#E4DB98] font-bold text-xs uppercase cursor-pointer transition shadow-md"
                    >
                      Save Feedback
                    </button>
                  </div>
                </form>
              </div>
            </div>
          ) : (
            /* MODERATOR CENTER STAGE: GSL & TIMER */
            <div className="max-w-3xl w-full mx-auto my-auto flex flex-col items-center justify-center text-center space-y-6 z-10">
              
              {/* Header Title / Active Mode */}
              <div className="flex items-center gap-3">
                <span className="text-xs font-mono font-bold uppercase tracking-widest text-[#7A7870] bg-[#FAF9F5] px-3 py-1 rounded-full border border-[#D6D1C4]">
                  {session.activeMode === 'gsl' ? '☰ General Speaker\'s List' : `🔥 ${session.activeCaucusMotion?.typeName || 'Caucus'}`}
                </span>

                {session.activeMode !== 'gsl' && (
                  <button
                    type="button"
                    onClick={endCaucusAndReturnToGsl}
                    className="text-xs font-bold text-rose-700 hover:underline cursor-pointer"
                  >
                    End Caucus &amp; Return to GSL
                  </button>
                )}
              </div>

              {/* Horizontal Queued Avatars Strip */}
              <div className="flex items-center justify-center gap-4 overflow-x-auto py-2 max-w-full">
                {(session.activeMode === 'gsl' ? session.speakerQueue : session.caucusSpeakerQueue).map((delId, idx) => {
                  const d = session.roster.find((del) => del.id === delId);
                  if (!d) return null;
                  const isFirst = idx === 0;

                  return (
                    <div key={d.id} className="flex flex-col items-center gap-1 relative group shrink-0">
                      <div
                        className={`w-13 h-13 rounded-full overflow-hidden border-2 transition shadow-sm ${
                          isFirst ? 'border-[#A1853B] ring-4 ring-[#A1853B]/20 scale-105' : 'border-[#D6D1C4] opacity-80'
                        }`}
                      >
                        <img
                          src={`https://flagcdn.com/w80/${d.countryCode.toLowerCase()}.png`}
                          alt={d.name}
                          className="w-full h-full object-cover"
                        />
                      </div>
                      <span className="text-[11px] font-bold text-[#1A1D1A] truncate max-w-[70px]">
                        {d.name}
                      </span>
                      {isFirst && (
                        <span className="text-[9px] font-mono text-[#A1853B] font-bold">
                          {session.isTimerRunning ? 'Speaking' : 'Ready'}
                        </span>
                      )}
                      <button
                        type="button"
                        onClick={() => removeSpeakerFromQueue(idx)}
                        className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-rose-600 text-white flex items-center justify-center text-[10px] opacity-0 group-hover:opacity-100 transition cursor-pointer"
                        title="Remove"
                      >
                        &times;
                      </button>
                    </div>
                  );
                })}
              </div>

              {/* Center Active Speaker Flag & Name */}
              {activeDelegate ? (
                <div className="flex flex-col items-center space-y-2 pt-2">
                  <div className="w-36 h-36 rounded-full overflow-hidden border-4 border-white shadow-2xl relative">
                    <img
                      src={`https://flagcdn.com/w160/${activeDelegate.countryCode.toLowerCase()}.png`}
                      alt={activeDelegate.name}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <h3 className="text-2xl sm:text-3xl font-black text-[#1A1D1A] tracking-tight">
                    {activeDelegate.name}
                  </h3>
                </div>
              ) : (
                <div className="py-8 text-sm font-bold text-[#7A7870]">
                  Add delegates below to start the list.
                </div>
              )}

              {/* Countdown Clock (96px, Tabular, Clickable to Toggle, Amber <=10s) */}
              <div
                onClick={toggleTimer}
                id="tutorial-target-clock"
                className={`font-mono font-black text-7xl sm:text-8xl tracking-tight transition cursor-pointer hover:scale-102 select-none ${
                  isAmber ? 'text-[#D97706] animate-pulse' : 'text-[#1A1D1A]'
                }`}
                title="Click clock to Start / Pause"
              >
                {formatTime(session.remainingSeconds)}
              </div>

              {/* 6px Progress Bar & RTR Button on Right End */}
              <div className="w-full max-w-lg space-y-2">
                <div className="flex items-center justify-end">
                  {/* Right to Reply (RTR) Button */}
                  <button
                    type="button"
                    id="tutorial-target-rtr"
                    onClick={() => openRtr(activeDelegate?.id)}
                    className="px-3 py-1 rounded-full bg-[#E7CAA8] hover:bg-[#d8b894] text-[#5D3F1B] font-extrabold text-[11px] flex items-center gap-1.5 shadow-2xs cursor-pointer transition active:scale-95"
                    title="Right to Reply gives accused delegate a separate timer"
                  >
                    <Reply className="w-3 h-3" />
                    <span>RTR</span>
                  </button>
                </div>

                <div className="h-1.5 w-full bg-[#D1CEBF] rounded-full overflow-hidden">
                  <div
                    className={`h-full transition-all duration-300 rounded-full ${
                      isAmber ? 'bg-[#D97706]' : 'bg-[#A1853B]'
                    }`}
                    style={{ width: `${progressRatio * 100}%` }}
                  />
                </div>
              </div>

              {/* Primary Timer Control Row */}
              <div className="flex items-center justify-center gap-3 pt-2">
                
                {/* ↺ Reset Button */}
                <button
                  type="button"
                  id="tutorial-target-reset-btn"
                  onClick={resetTimer}
                  className="w-11 h-11 rounded-2xl bg-[#D1CEBF] hover:bg-[#c2bfaf] text-[#1F241D] flex items-center justify-center cursor-pointer transition shadow-sm active:scale-95"
                  title="Reset clock to full time"
                >
                  <RotateCcw className="w-4 h-4" />
                </button>

                {/* ▷ START / ⏸ PAUSE Button */}
                <button
                  type="button"
                  id="tutorial-target-start-btn"
                  onClick={toggleTimer}
                  className={`w-56 h-12 rounded-2xl font-black text-sm tracking-wider uppercase transition shadow-md flex items-center justify-center gap-2 cursor-pointer active:scale-95 ${
                    session.isTimerRunning
                      ? 'bg-[#DCC254] hover:bg-[#cfb544] text-[#1F241D]'
                      : 'bg-[#39683C] hover:bg-[#325b35] text-white'
                  }`}
                >
                  {session.isTimerRunning ? (
                    <>
                      <Pause className="w-4 h-4 fill-current" />
                      <span>PAUSE</span>
                    </>
                  ) : (
                    <>
                      <Play className="w-4 h-4 fill-current" />
                      <span>START</span>
                    </>
                  )}
                </button>

                {/* ⏭ NEXT Button */}
                <button
                  type="button"
                  id="tutorial-target-next-btn"
                  onClick={nextSpeaker}
                  className="w-44 h-12 rounded-2xl bg-[#223726] hover:bg-[#1a2b1d] text-[#C8BB8E] font-black text-sm uppercase tracking-wider transition shadow-md flex items-center justify-center gap-2 cursor-pointer active:scale-95"
                  title="Next Speaker (Awards speech & time points)"
                >
                  <SkipForward className="w-4 h-4" />
                  <span>NEXT</span>
                </button>

                {/* 🕒+ Add Time Button */}
                <div className="relative">
                  <button
                    type="button"
                    id="tutorial-target-add-time"
                    onClick={() => setShowAddTimePopover(!showAddTimePopover)}
                    className="w-11 h-11 rounded-2xl bg-[#D5E6F6] hover:bg-[#c3d9ed] text-[#1E3A5F] flex items-center justify-center cursor-pointer transition shadow-sm active:scale-95"
                    title="Add time to clock"
                  >
                    <Clock className="w-4 h-4" />
                  </button>

                  {/* Add Time Popover */}
                  {showAddTimePopover && (
                    <div className="absolute bottom-14 right-0 z-50 p-3 rounded-2xl bg-white shadow-xl border border-[#D6D1C4] w-48 space-y-2 animate-fade-in text-left">
                      <div className="text-[10px] font-bold uppercase text-[#7A7870]">Add Time</div>
                      <div className="grid grid-cols-3 gap-1.5">
                        {[15, 30, 60].map((sec) => (
                          <button
                            key={sec}
                            type="button"
                            onClick={() => {
                              addTimeToClock(sec);
                              setShowAddTimePopover(false);
                            }}
                            className="p-1.5 rounded-lg bg-[#EFECE4] hover:bg-[#243928] hover:text-white text-xs font-bold text-center cursor-pointer"
                          >
                            +{sec}s
                          </button>
                        ))}
                      </div>
                      <div className="flex items-center gap-1 pt-1">
                        <input
                          type="number"
                          value={customAddSeconds}
                          onChange={(e) => setCustomAddSeconds(parseInt(e.target.value) || 10)}
                          className="w-16 px-2 py-1 rounded bg-[#FAF9F5] border text-xs font-mono"
                        />
                        <button
                          type="button"
                          onClick={() => {
                            addTimeToClock(customAddSeconds);
                            setShowAddTimePopover(false);
                          }}
                          className="flex-1 py-1 rounded bg-[#243928] text-white text-xs font-bold cursor-pointer"
                        >
                          Add
                        </button>
                      </div>
                    </div>
                  )}
                </div>

                {/* ↱ Yield Button */}
                <button
                  type="button"
                  id="tutorial-target-yield-box"
                  onClick={openYieldPopover}
                  className="w-11 h-11 rounded-2xl bg-[#D1E1D6] hover:bg-[#bfd3c5] text-[#1C3B28] flex items-center justify-center cursor-pointer transition shadow-sm active:scale-95"
                  title="Yield remaining speaking time"
                >
                  <CornerUpRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          )}

          {/* RIGHT TO REPLY SUB-TIMER MODAL */}
          {session.rtrActive && (
            <div className="fixed inset-0 z-70 bg-black/40 backdrop-blur-xs flex items-center justify-center p-4 animate-fade-in">
              <div className="p-6 rounded-3xl bg-[#FAF9F5] border-2 border-[#E7CAA8] shadow-2xl max-w-sm w-full text-center space-y-4">
                <div className="flex items-center justify-between border-b pb-2">
                  <div className="text-xs font-black uppercase text-[#5D3F1B] flex items-center gap-1.5">
                    <Reply className="w-4 h-4" />
                    <span>Right to Reply Active</span>
                  </div>
                  <button type="button" onClick={closeRtr} className="text-[#5D3F1B] p-1 cursor-pointer">
                    <X className="w-4 h-4" />
                  </button>
                </div>

                <div className="text-sm font-bold text-[#1A1D1A]">
                  {session.roster.find((d) => d.id === session.rtrDelegateId)?.name || 'Accused Delegate'}
                </div>

                <div className="text-5xl font-mono font-black text-[#5D3F1B]">
                  {formatTime(session.rtrRemainingSeconds)}
                </div>

                <div className="flex items-center justify-center gap-3">
                  <button
                    type="button"
                    onClick={toggleRtrTimer}
                    className="px-5 py-2 rounded-xl bg-[#5D3F1B] text-[#E7CAA8] font-bold text-xs cursor-pointer"
                  >
                    {session.rtrIsRunning ? 'Pause' : 'Start'}
                  </button>
                  <button
                    type="button"
                    onClick={closeRtr}
                    className="px-4 py-2 rounded-xl bg-neutral-200 text-neutral-800 font-bold text-xs cursor-pointer"
                  >
                    Finish RTR
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* FLOATING DRAGGABLE YIELD POPOVER (Screenshot 2026-10-18 024022.jpg) */}
          {session.yieldPopoverOpen && (
            <div className="absolute top-12 right-12 z-50 w-72 bg-[#FAF9F5] rounded-3xl border border-[#D6D1C4] shadow-2xl overflow-hidden animate-fade-in text-left">
              <div className="p-3.5 bg-[#2D4734] text-white flex items-center justify-between">
                <span className="text-xs font-black tracking-wider uppercase flex items-center gap-1.5">
                  <span>&vellip;&vellip;</span>
                  <span>&bull; YIELD</span>
                </span>
                <button type="button" onClick={closeYieldPopover} className="text-white/60 hover:text-white p-0.5 cursor-pointer">
                  <X className="w-4 h-4" />
                </button>
              </div>

              <div className="p-4 space-y-4">
                <div className="text-xs font-semibold text-[#1A1D1A]">
                  <strong>{activeDelegate?.name || 'Delegate'}</strong> yields &bull;{' '}
                  <span className="text-[#243928] font-bold font-mono">
                    {formatTime(session.yieldRemainingSeconds)} left
                  </span>
                </div>

                {/* Option 1: Next speaker gets time combined */}
                {nextQueuedDelegate && (
                  <button
                    type="button"
                    onClick={yieldToNextSpeaker}
                    className="w-full p-3 rounded-2xl bg-[#D8E8DC] hover:bg-[#cbe0d0] text-left border border-[#BFD5C4] transition cursor-pointer space-y-0.5 shadow-2xs"
                  >
                    <div className="text-xs font-bold text-[#1C3B28]">
                      {nextQueuedDelegate.name} (Next speaker)
                    </div>
                    <div className="text-[11px] text-[#2D4734]">
                      Gets their time plus {formatTime(session.yieldRemainingSeconds)}
                    </div>
                  </button>
                )}

                {/* Option 2: Another delegation */}
                <div className="space-y-1.5 pt-1 border-t border-[#D6D1C4]">
                  <label className="text-[10px] font-bold uppercase text-[#7A7870]">Another delegation</label>
                  <select
                    value={yieldSelectedId}
                    onChange={(e) => setYieldSelectedId(e.target.value)}
                    className="w-full p-2 rounded-xl bg-white border border-[#D6D1C4] text-xs font-semibold"
                  >
                    <option value="">Select country...</option>
                    {session.roster
                      .filter((d) => d.id !== activeDelegate?.id)
                      .map((d) => (
                        <option key={d.id} value={d.id}>
                          {d.name}
                        </option>
                      ))}
                  </select>
                  <button
                    type="button"
                    disabled={!yieldSelectedId}
                    onClick={() => yieldToDelegate(yieldSelectedId)}
                    className="w-full py-2 rounded-xl bg-[#8BA892] hover:bg-[#7b9882] text-white font-bold text-xs uppercase cursor-pointer disabled:opacity-40 transition shadow-2xs mt-1"
                  >
                    Yield {formatTime(session.yieldRemainingSeconds)}
                  </button>
                </div>
              </div>
            </div>
          )}
        </main>
      </div>

      {/* ─────────────────────────────────────────────────────────────
          3. BOTTOM BAR (52px, #F2F1ED)
      ───────────────────────────────────────────────────────────── */}
      <footer id="tutorial-target-bottom-bar" className="h-13 bg-[#F2F1ED] border-t border-[#D6D1C4] px-4 flex items-center justify-between gap-4 z-30 shrink-0">
        
        {/* Left: Add to speakers list input */}
        <div className="relative flex-1 max-w-xl">
          <input
            type="text"
            value={bottomInput}
            onChange={(e) => {
              setBottomInput(e.target.value);
              setBottomDropdown(true);
            }}
            onFocus={() => setBottomDropdown(true)}
            onKeyDown={(e) => {
              if (e.key === 'Enter') {
                e.preventDefault();
                if (filteredBottomDelegates[0]) {
                  addSpeakerToQueue(filteredBottomDelegates[0].id);
                  setBottomInput('');
                  setBottomDropdown(false);
                }
              }
            }}
            placeholder="Add to speakers list... (Type country and press Enter)"
            className="w-full px-4 py-2 rounded-xl bg-white border border-[#D6D1C4] text-xs font-medium text-[#1A1D1A] focus:outline-none focus:ring-1 focus:ring-[#243928] shadow-2xs"
          />

          {bottomDropdown && bottomInput.trim() && filteredBottomDelegates.length > 0 && (
            <div className="absolute bottom-12 left-0 right-0 bg-white rounded-2xl shadow-xl border border-[#D6D1C4] max-h-48 overflow-y-auto z-50">
              {filteredBottomDelegates.map((d) => (
                <button
                  key={d.id}
                  type="button"
                  onClick={() => {
                    addSpeakerToQueue(d.id);
                    setBottomInput('');
                    setBottomDropdown(false);
                  }}
                  className="w-full px-4 py-2.5 text-left hover:bg-[#F5F3EB] flex items-center gap-2 border-b border-[#F0EDE4] last:border-none cursor-pointer text-xs font-bold"
                >
                  <img
                    src={`https://flagcdn.com/w40/${d.countryCode.toLowerCase()}.png`}
                    alt=""
                    className="w-4 h-4 rounded-full object-cover"
                  />
                  <span>{d.name}</span>
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Right: TIME presets selector */}
        <div className="flex items-center gap-2">
          <span className="text-[11px] font-bold uppercase tracking-wider text-[#7A7870]">TIME</span>
          <div className="flex items-center gap-1">
            {[45, 60, 75, 90].map((s) => (
              <button
                key={s}
                type="button"
                onClick={() => setSpeakingSlotTime(s)}
                className={`px-2.5 py-1 rounded-lg text-xs font-mono font-bold transition cursor-pointer ${
                  session.speakingTimeSeconds === s
                    ? 'bg-[#243928] text-white shadow-2xs'
                    : 'bg-white hover:bg-[#FAF9F5] text-[#1A1D1A] border border-[#D6D1C4]'
                }`}
              >
                {s}s
              </button>
            ))}
            <input
              type="number"
              min={10}
              max={300}
              value={session.speakingTimeSeconds}
              onChange={(e) => setSpeakingSlotTime(Math.max(10, parseInt(e.target.value) || 90))}
              className="w-14 px-1.5 py-1 rounded-lg bg-white border border-[#D6D1C4] font-mono text-center font-bold text-xs"
              title="Custom seconds"
            />
          </div>
        </div>
      </footer>

      {/* Dais Support & Secretariat Hotline Modal */}
      <DaisSupportHotlineModal
        isOpen={showSupportModal}
        onClose={() => setShowSupportModal(false)}
        committeeName={session.committeeName}
        committeeId={session.committeeAcronym}
      />
    </div>
  );
}
