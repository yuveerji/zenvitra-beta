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
  Sun,
  Moon,
} from 'lucide-react';
import { useZenMun } from '@/context/ZenMunContext';
import { ZenDelegate } from '@/types/zenMun';
import { DaisSupportHotlineModal } from '../support/DaisSupportHotlineModal';
import { daisAudio } from '@/lib/daisAudio';

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

interface ZenMunChairConsoleProps {
  onExit?: () => void;
}

export function ZenMunChairConsole({ onExit }: ZenMunChairConsoleProps = {}) {
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
    regenerateSessionCode,
    setShowRollCallModal,
    setShowMotionsModal,
    setShowDocumentsModal,
    setShowScoreboardModal,
    setShowSettingsModal,
    setShowChatDrawer,
    startTutorial,
    quorum,
  } = useZenMun();

  // ── THEME STATE: Light Diplomatic Mode is DEFAULT as requested ──
  const [theme, setTheme] = useState<'light' | 'dark'>('dark');

  useEffect(() => {
    if (typeof window !== 'undefined') {
      try {
        const saved = localStorage.getItem('zenvitra_dais_theme');
        if (saved === 'dark' || saved === 'light') {
          setTheme(saved);
        } else {
          setTheme('light');
        }
      } catch {}
    }
  }, []);

  const toggleTheme = () => {
    const next = theme === 'light' ? 'dark' : 'light';
    setTheme(next);
    if (typeof window !== 'undefined') {
      try {
        localStorage.setItem('zenvitra_dais_theme', next);
      } catch {}
    }
  };

  const isLight = theme === 'light';

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

  // Sidebar Tab & Filter state
  const [sidebarTab, setSidebarTab] = useState<'queue' | 'roster'>('queue');
  const [rosterSearch, setRosterSearch] = useState('');
  const [rosterFilter, setRosterFilter] = useState<'all' | 'present' | 'present_voting' | 'absent'>('all');

  // Audio chime at 10s and double gavel at 0s
  useEffect(() => {
    if (!session.isTimerRunning) return;
    if (session.remainingSeconds === 10) {
      daisAudio.playWarningBell();
    } else if (session.remainingSeconds === 0) {
      daisAudio.playTimeExpired();
    }
  }, [session.remainingSeconds, session.isTimerRunning]);

  // Global Keyboard Shortcuts
  useEffect(() => {
    const handleGlobalKeyDown = (e: KeyboardEvent) => {
      const activeEl = document.activeElement;
      const isInput =
        activeEl instanceof HTMLInputElement ||
        activeEl instanceof HTMLTextAreaElement ||
        activeEl instanceof HTMLSelectElement ||
        activeEl?.getAttribute('contenteditable') === 'true';

      if (isInput) return;

      if (e.code === 'Space') {
        e.preventDefault();
        toggleTimer();
      } else if (e.key === 'n' || e.key === 'N') {
        e.preventDefault();
        nextSpeaker();
      } else if (e.key === 'r' || e.key === 'R') {
        e.preventDefault();
        resetTimer();
      } else if (e.key === 'g' || e.key === 'G') {
        e.preventDefault();
        daisAudio.playDoubleGavel();
      } else if (e.key === 'm' || e.key === 'M') {
        e.preventDefault();
        setShowMotionsModal(true);
      } else if (e.key === 'c' || e.key === 'C') {
        e.preventDefault();
        setShowRollCallModal(true);
      } else if (e.key === 's' || e.key === 'S') {
        e.preventDefault();
        setShowScoreboardModal(true);
      } else if (e.key === 'y' || e.key === 'Y') {
        e.preventDefault();
        openYieldPopover();
      } else if (e.key === 'q' || e.key === 'Q') {
        e.preventDefault();
        setShowQrOverlay(true);
      } else if (e.key === '?') {
        e.preventDefault();
        startTutorial();
      }
    };

    window.addEventListener('keydown', handleGlobalKeyDown);
    return () => window.removeEventListener('keydown', handleGlobalKeyDown);
  }, [
    toggleTimer,
    nextSpeaker,
    resetTimer,
    setShowMotionsModal,
    setShowRollCallModal,
    setShowScoreboardModal,
    openYieldPopover,
    setShowQrOverlay,
    startTutorial,
  ]);

  // First-time Dais visit check
  useEffect(() => {
    try {
      const seen = localStorage.getItem('zenvitra_has_seen_dais_tutorial_v1');
      if (!seen && !session.tutorial.isCompleted) {
        startTutorial();
      }
    } catch {}
  }, [startTutorial, session.tutorial.isCompleted]);

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

  // ═════════════════════════════════════════════════════════════════
  // VIEW 1: PRE-SESSION ROLL CALL (Matches Screenshot 1 Exactly)
  // ═════════════════════════════════════════════════════════════════
  if (isPreSession) {
    return (
      <div className={`min-h-screen font-sans antialiased flex flex-col select-none relative overflow-x-hidden transition-colors duration-200 ${
        isLight ? 'bg-[#F8FAFC] text-[#0F172A]' : 'bg-[#030407] text-white'
      }`}>
        {/* Top Header */}
        <header className={`h-14 px-6 flex items-center justify-between z-40 relative border-b transition-colors ${
          isLight ? 'bg-[#FFFFFF] border-[#E2E8F0] text-[#0F172A]' : 'bg-[#070a12]/95 border-white/10 text-white'
        }`}>
          <div className="flex items-center gap-2.5 min-w-0">
            <div className={`w-8 h-8 rounded-xl flex items-center justify-center p-1 border overflow-hidden shrink-0 ${
              isLight ? 'bg-black/5 border-black/10' : 'bg-white/5 border-white/10'
            }`}>
              <CommitteeEmblemDisplay
                emblem={session.emblemUrl}
                acronym={session.committeeAcronym}
                isIndian={session.isIndianCommittee}
                size={24}
              />
            </div>
            <div className="flex items-center gap-2 min-w-0">
              <span className={`text-sm font-bold tracking-tight truncate ${isLight ? 'text-[#0F172A]' : 'text-cyan-400'}`}>
                {(session.committeeName || 'UN Human Rights Council').replace(/_/g, ' ')}: {session.topic}
              </span>
            </div>
          </div>

          <div className="flex items-center gap-2.5 shrink-0">
            {/* Session Code Badge */}
            <button
              type="button"
              onClick={() => setShowQrOverlay(true)}
              className={`px-3 py-1.5 rounded-xl font-mono font-bold text-xs border flex items-center gap-1.5 transition cursor-pointer ${
                isLight ? 'bg-white border-[#CBD5E1] text-[#0F172A] hover:bg-[#F1F5F9]' : 'bg-cyan-950/40 border-cyan-500/30 text-cyan-300'
              }`}
              title="Present Room Code"
            >
              <span>↗</span>
              <span>{session.sessionCode}</span>
            </button>

            {/* Gavel Strike Sound Button */}
            <button
              type="button"
              onClick={() => daisAudio.playDoubleGavel()}
              className={`p-2 rounded-xl border transition cursor-pointer ${
                isLight ? 'bg-white border-[#CBD5E1] text-[#8C6D1F] hover:bg-[#F1F5F9]' : 'bg-white/5 border-white/10 text-amber-400'
              }`}
              title="Strike Gavel [G]"
            >
              <Gavel className="w-4 h-4" />
            </button>

            {/* Theme Toggle */}
            <button
              type="button"
              onClick={toggleTheme}
              className={`p-2 rounded-xl border transition cursor-pointer text-xs font-bold flex items-center gap-1 ${
                isLight ? 'bg-white border-[#CBD5E1] text-[#0F172A] hover:bg-[#F1F5F9]' : 'bg-white/5 border-white/10 text-neutral-300'
              }`}
              title={isLight ? 'Switch to Dark Mode' : 'Switch to Light Mode'}
            >
              {isLight ? <Moon className="w-4 h-4 text-[#64748B]" /> : <Sun className="w-4 h-4 text-amber-300" />}
            </button>

            {/* Scoreboard */}
            <button
              type="button"
              onClick={() => setShowScoreboardModal(true)}
              className={`p-2 rounded-xl border transition cursor-pointer ${
                isLight ? 'bg-white border-[#CBD5E1] text-[#8C6D1F] hover:bg-[#F1F5F9]' : 'bg-white/5 border-white/10 text-amber-400'
              }`}
              title="Scoreboard"
            >
              <Trophy className="w-4 h-4" />
            </button>

            {/* Settings */}
            <button
              type="button"
              onClick={() => setShowSettingsModal(true)}
              className={`p-2 rounded-xl border transition cursor-pointer ${
                isLight ? 'bg-white border-[#CBD5E1] text-[#64748B] hover:text-[#0F172A] hover:bg-[#F1F5F9]' : 'bg-white/5 border-white/10 text-neutral-300'
              }`}
              title="Settings"
            >
              <Settings className="w-4 h-4" />
            </button>

            {/* Hotline */}
            <button
              type="button"
              onClick={() => setShowSupportModal(true)}
              className={`p-2 rounded-xl border transition cursor-pointer ${
                isLight ? 'bg-white border-[#CBD5E1] text-teal-700 hover:bg-[#F1F5F9]' : 'bg-white/5 border-white/10 text-cyan-400'
              }`}
              title="Dais & Secretariat Support Hotline"
            >
              <LifeBuoy className="w-4 h-4" />
            </button>
          </div>
        </header>

        {/* Center Canvas: Matches Screenshot 1 */}
        <main className="flex-1 flex items-center justify-center p-6 gap-6 flex-wrap">
          {/* Left Card: Join on your phone */}
          <div className={`rounded-3xl shadow-xl p-6 max-w-[270px] w-full text-center space-y-3.5 shrink-0 border ${
            isLight ? 'bg-white text-[#0F172A] border-[#E2E8F0]' : 'bg-[#0E131F] text-white border-white/10'
          }`}>
            <div className="space-y-0.5">
              <div className="text-[10px] font-mono font-black tracking-widest text-[#78716C] uppercase">
                JOIN ON YOUR PHONE
              </div>
              <div className="text-xs font-bold text-[#0F172A] font-mono">
                zenvitra.xyz/host/join
              </div>
            </div>

            <div className="text-3xl sm:text-4xl font-mono font-black tracking-widest text-[#C5A46D] py-1 select-all">
              {session.sessionCode}
            </div>

            {/* Real QR Code */}
            <div className="p-3 bg-white rounded-2xl border border-[#E2E8F0] shadow-sm inline-block mx-auto">
              <img
                src={`https://api.qrserver.com/v1/create-qr-code/?size=180x180&data=${encodeURIComponent(`https://zenvitra.xyz/host/join?code=${session.sessionCode}`)}`}
                alt="Session QR Code"
                className="w-36 h-36 object-contain"
              />
            </div>

            <p className="text-[11px] text-[#78716C] leading-snug px-1">
              Scan the code, or go to the address and type the code.
            </p>

            <button
              type="button"
              onClick={() => setShowQrOverlay(true)}
              className="w-full py-2.5 px-4 rounded-xl bg-[#C5A46D] hover:bg-[#DFBA73] text-[#08090C] font-black text-xs tracking-tight transition shadow-sm cursor-pointer flex items-center justify-center gap-1.5"
            >
              <span>Present on screen ⤢</span>
            </button>

            <button
              type="button"
              onClick={() => regenerateSessionCode()}
              className="text-[11px] font-semibold text-[#78716C] hover:text-[#0F172A] underline transition cursor-pointer"
            >
              Change
            </button>
          </div>

          {/* Center Card: Deep Diplomatic Forest Slate Attendance Card */}
          <div className={`rounded-3xl p-6 sm:p-7 max-w-xl w-full shadow-2xl space-y-4 border ${
            isLight ? 'bg-white text-[#0F172A] border-[#E2E8F0]' : 'bg-[#0E131F] text-white border-white/10'
          }`}>
            {/* Header */}
            <div className="flex items-center justify-between border-b border-white/10 pb-4">
              <div className="flex items-center gap-3 min-w-0">
                <div className="w-12 h-12 rounded-2xl bg-white/10 flex items-center justify-center p-1.5 border border-white/10 overflow-hidden shrink-0">
                  <CommitteeEmblemDisplay
                    emblem={session.emblemUrl}
                    acronym={session.committeeAcronym}
                    isIndian={session.isIndianCommittee}
                    size={38}
                  />
                </div>
                <div className="min-w-0">
                  <h3 className="text-lg font-black tracking-tight uppercase text-amber-300 truncate">
                    {(session.committeeAcronym || session.committeeName || 'UNHRC').replace(/_/g, ' ')}
                  </h3>
                  <div className="text-xs text-emerald-200/80 truncate">
                    {(session.committeeName || 'UN Human Rights Council').replace(/_/g, ' ')}
                  </div>
                  <div className="text-xs text-neutral-300 flex items-center gap-1.5 mt-1 truncate">
                    <span className="truncate">Topic: {session.topic}</span>
                    <button
                      type="button"
                      onClick={() => {
                        setTopicDraft(session.topic);
                        setIsEditingTopic(!isEditingTopic);
                      }}
                      className="px-2 py-0.5 rounded-lg bg-white/10 hover:bg-white/20 text-cyan-300 hover:text-white text-[11px] font-bold flex items-center gap-1 cursor-pointer transition border border-white/15 shadow-sm shrink-0"
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
                <div className="px-2.5 py-1 rounded-xl bg-black/30 border border-white/10">
                  <div className="text-[9px] uppercase tracking-wider text-emerald-200/60 font-semibold">Present</div>
                  <div className="text-xs font-black text-amber-300 font-mono">{quorum.present}</div>
                </div>
                <div className="px-2.5 py-1 rounded-xl bg-black/30 border border-white/10">
                  <div className="text-[9px] uppercase tracking-wider text-emerald-200/60 font-semibold">2/3</div>
                  <div className="text-xs font-black text-cyan-300 font-mono">{quorum.twoThirds}</div>
                </div>
                <div className="px-2.5 py-1 rounded-xl bg-black/30 border border-white/10">
                  <div className="text-[9px] uppercase tracking-wider text-emerald-200/60 font-semibold">1/2+1</div>
                  <div className="text-xs font-black text-cyan-300 font-mono">{quorum.simpleMajority}</div>
                </div>
              </div>

              <div className="flex-1 max-w-[200px]">
                <input
                  type="text"
                  value={newSeatName}
                  onChange={(e) => setNewSeatName(e.target.value)}
                  onKeyDown={handleAddSeatKeyDown}
                  placeholder="+ Add a seat"
                  className="w-full px-3 py-1.5 rounded-xl bg-black/40 border border-white/15 text-xs text-white placeholder-emerald-200/40 focus:outline-none focus:border-cyan-400"
                />
              </div>
            </div>

            {/* Bulk Attendance Buttons */}
            <div className="grid grid-cols-3 gap-2">
              <button
                type="button"
                onClick={() => setAllAttendance('absent')}
                className="py-2.5 rounded-xl bg-[#3D2323] hover:bg-[#4D2B2B] border border-rose-500/25 text-rose-200 text-[11px] font-black uppercase tracking-wider cursor-pointer transition shadow-sm"
              >
                CLEAR ALL
              </button>
              <button
                type="button"
                onClick={() => setAllAttendance('present')}
                className="py-2.5 rounded-xl bg-[#141A29] hover:bg-[#1C2438] border border-white/10 text-[#C5A46D] text-[11px] font-black uppercase tracking-wider cursor-pointer transition shadow-sm"
              >
                ALL PRESENT
              </button>
              <button
                type="button"
                onClick={() => setAllAttendance('present_voting')}
                className="py-2.5 rounded-xl bg-[#3D3A23] hover:bg-[#4D492B] border border-amber-500/25 text-amber-200 text-[11px] font-black uppercase tracking-wider cursor-pointer transition shadow-sm"
              >
                ALL P+V
              </button>
            </div>

            {/* Roster Attendance Rows */}
            <div className="space-y-2 max-h-72 overflow-y-auto pr-1">
              {session.roster.map((d) => (
                <div
                  key={d.id}
                  className="p-2.5 rounded-2xl bg-white/[0.04] hover:bg-white/[0.08] border border-white/10 flex items-center justify-between gap-3 transition"
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
                      onClick={() => daisAudio.playGavelStrike(0.4)}
                      className="text-emerald-200/60 hover:text-white p-1 cursor-pointer transition"
                      title="Audio check"
                    >
                      <Volume2 className="w-3.5 h-3.5" />
                    </button>

                    <div className="inline-flex rounded-full bg-black/40 p-0.5 border border-white/10">
                      <button
                        type="button"
                        onClick={() => setDelegateAttendance(d.id, 'absent')}
                        className={`w-6 h-6 rounded-full text-[10px] font-black cursor-pointer transition ${
                          d.attendance === 'absent'
                            ? 'bg-rose-600 text-white shadow-xs'
                            : 'text-neutral-400 hover:text-white'
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
                            : 'text-neutral-400 hover:text-white'
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
                            : 'text-neutral-400 hover:text-white'
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
                  daisAudio.playDoubleGavel();
                  setSession((prev) => ({
                    ...prev,
                    sessionState: 'in-session',
                    tutorial: {
                      ...prev.tutorial,
                      welcomeModalOpen: false,
                    },
                  }));
                }}
                className="w-full py-3.5 rounded-2xl bg-gradient-to-r from-[#C5A46D] via-[#DFBA73] to-[#C5A46D] text-[#08090C] font-black text-xs uppercase tracking-wider cursor-pointer shadow-[0_0_25px_rgba(197,164,109,0.35)] active:scale-98 transition text-center flex items-center justify-center gap-2"
              >
                <span>MARK AT LEAST 1 DELEGATE PRESENT</span>
              </button>
            ) : (
              <button
                type="button"
                onClick={() => {
                  daisAudio.playDoubleGavel();
                  setSession((prev) => ({
                    ...prev,
                    sessionState: 'in-session',
                    tutorial: {
                      ...prev.tutorial,
                      welcomeModalOpen: false,
                    },
                  }));
                }}
                className="w-full py-3.5 rounded-2xl bg-gradient-to-r from-emerald-500 to-teal-400 hover:from-emerald-400 hover:to-teal-300 text-black font-black text-xs uppercase tracking-wider cursor-pointer shadow-lg shadow-emerald-500/20 active:scale-98 transition text-center flex items-center justify-center gap-2"
              >
                <span>START SESSION &rarr;</span>
              </button>
            )}
          </div>
        </main>
      </div>
    );
  }

  // ═════════════════════════════════════════════════════════════════
  // VIEW 2: LIVE IN-SESSION DAIS (100% Zero-Scroll Viewport Constrained)
  // ═════════════════════════════════════════════════════════════════
  return (
    <div className={`h-screen max-h-screen overflow-hidden font-sans antialiased flex flex-col select-none relative transition-colors duration-200 ${
      isLight ? 'bg-[#F8FAFC] text-[#0F172A]' : 'bg-[#030407] text-white'
    }`}>
      {/* ─────────────────────────────────────────────────────────────
          1. TOP BAR (52px, Diplomatic Porcelain or Obsidian Glass)
      ───────────────────────────────────────────────────────────── */}
      <header className={`h-[52px] px-4 flex items-center justify-between z-40 shrink-0 relative border-b transition-colors ${
        isLight ? 'bg-[#FFFFFF] border-[#E2E8F0] text-[#0F172A]' : 'bg-[#070a12]/95 border-white/10 text-white'
      }`}>
        {/* Left: Navigation Controls */}
        <div className="flex items-center gap-1.5" id="tutorial-target-nav">
          <button
            type="button"
            onClick={toggleSidebar}
            className={`p-2 rounded-xl transition cursor-pointer mr-1 ${
              isLight ? 'text-[#64748B] hover:text-[#18201B] hover:bg-black/5' : 'text-white/70 hover:text-white hover:bg-white/10'
            }`}
            title="Toggle Sidebar"
          >
            {isSidebarCollapsed ? <PanelLeftOpen className="w-4 h-4" /> : <PanelLeftClose className="w-4 h-4" />}
          </button>

          <button
            type="button"
            id="tutorial-target-rollcall-tab"
            onClick={() => setShowRollCallModal(true)}
            className={`px-3 py-1 rounded-xl font-bold text-xs border transition cursor-pointer active:scale-95 ${
              isLight ? 'bg-white hover:bg-[#F1F5F9] border-[#CBD5E1] text-[#0F172A]' : 'bg-white/5 hover:bg-white/10 border-white/10 text-white'
            }`}
          >
            Roll Call
          </button>

          <button
            type="button"
            id="tutorial-target-motions-tab"
            onClick={() => setShowMotionsModal(true)}
            className={`px-3 py-1 rounded-xl font-bold text-xs border transition cursor-pointer active:scale-95 ${
              isLight ? 'bg-white hover:bg-[#F1F5F9] border-[#CBD5E1] text-[#0F172A]' : 'bg-white/5 hover:bg-white/10 border-white/10 text-white'
            }`}
          >
            Motions
          </button>

          <button
            type="button"
            id="tutorial-target-docs-tab"
            onClick={() => setShowDocumentsModal(true)}
            className={`px-3 py-1 rounded-xl font-bold text-xs border transition cursor-pointer active:scale-95 ${
              isLight ? 'bg-white hover:bg-[#F1F5F9] border-[#CBD5E1] text-[#0F172A]' : 'bg-white/5 hover:bg-white/10 border-white/10 text-white'
            }`}
          >
            Documents
          </button>

          {/* Gavel Strike Header Button */}
          <button
            type="button"
            onClick={() => daisAudio.playDoubleGavel()}
            className={`px-2.5 py-1 rounded-xl font-bold text-xs border transition cursor-pointer flex items-center gap-1.5 active:scale-95 ${
              isLight ? 'bg-[#0F172A] text-white hover:bg-[#1E293B] border-[#0F172A]' : 'bg-amber-500/10 text-amber-300 border-amber-500/30 hover:bg-amber-500/20'
            }`}
            title="Strike Gavel [G]"
          >
            <Gavel className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Gavel</span>
          </button>
        </div>

        {/* Center: Live Quorum Status (Compact Pill) */}
        <div className={`hidden md:flex items-center gap-2 px-3 py-0.5 rounded-full border text-[11px] font-mono ${
          isLight ? 'bg-[#EDE8DE] border-[#DDD5C7] text-[#64748B]' : 'bg-white/5 border-white/10 text-neutral-300'
        }`}>
          <span className="font-bold">Quorum:</span>
          <span className={`font-black ${isLight ? 'text-[#0F172A]' : 'text-cyan-400'}`}>{quorum.present} Present</span>
          <span>•</span>
          <span>2/3: {quorum.twoThirds}</span>
          <span>•</span>
          <span>1/2+1: {quorum.simpleMajority}</span>
        </div>

        {/* Right: Actions */}
        <div className="flex items-center gap-1.5">
          {/* Room Code Badge */}
          <button
            type="button"
            onClick={() => setShowQrOverlay(true)}
            className={`px-3 py-1 rounded-xl font-mono font-bold text-xs border flex items-center gap-1.5 transition cursor-pointer ${
              isLight ? 'bg-white border-[#CBD5E1] text-[#0F172A] hover:bg-[#F1F5F9]' : 'bg-cyan-950/40 border-cyan-500/30 text-cyan-300'
            }`}
            title="Project Room Code"
          >
            <span>↗</span>
            <span>{session.sessionCode}</span>
          </button>

          {/* Theme Toggle Button */}
          <button
            type="button"
            onClick={toggleTheme}
            className={`p-1.5 rounded-xl border transition cursor-pointer ${
              isLight ? 'bg-white border-[#CBD5E1] text-[#64748B] hover:text-[#18201B] hover:bg-[#F1F5F9]' : 'bg-white/5 border-white/10 text-neutral-300 hover:text-white'
            }`}
            title={isLight ? 'Switch to Dark Mode' : 'Switch to Light Mode'}
          >
            {isLight ? <Moon className="w-4 h-4 text-[#64748B]" /> : <Sun className="w-4 h-4 text-amber-300" />}
          </button>

          {/* Chat */}
          <button
            type="button"
            onClick={() => setShowChatDrawer(true)}
            className={`p-1.5 rounded-xl border transition cursor-pointer ${
              isLight ? 'bg-white border-[#CBD5E1] text-[#64748B] hover:text-[#18201B] hover:bg-[#F1F5F9]' : 'bg-white/5 border-white/10 text-white/70 hover:text-white'
            }`}
            title="Open Chat"
          >
            <MessageSquare className="w-4 h-4" />
          </button>

          {/* Scoreboard */}
          <button
            type="button"
            onClick={() => setShowScoreboardModal(true)}
            className={`p-1.5 rounded-xl border transition cursor-pointer ${
              isLight ? 'bg-white border-[#CBD5E1] text-[#8C6D1F] hover:bg-[#F1F5F9]' : 'bg-white/5 border-white/10 text-amber-400'
            }`}
            title="Open Scoreboard"
          >
            <Trophy className="w-4 h-4" />
          </button>

          {/* Settings */}
          <button
            type="button"
            onClick={() => setShowSettingsModal(true)}
            className={`p-1.5 rounded-xl border transition cursor-pointer ${
              isLight ? 'bg-white border-[#CBD5E1] text-[#64748B] hover:text-[#18201B] hover:bg-[#F1F5F9]' : 'bg-white/5 border-white/10 text-white/70 hover:text-white'
            }`}
            title="Settings"
          >
            <Settings className="w-4 h-4" />
          </button>

          {/* Hotline */}
          <button
            type="button"
            onClick={() => setShowSupportModal(true)}
            className={`p-1.5 rounded-xl border transition cursor-pointer ${
              isLight ? 'bg-white border-[#CBD5E1] text-teal-700 hover:bg-[#F1F5F9]' : 'bg-white/5 border-white/10 text-cyan-400'
            }`}
            title="Dais & Secretariat Support Hotline"
          >
            <LifeBuoy className="w-4 h-4" />
          </button>

          {/* Tour Guide Button */}
          <button
            type="button"
            onClick={startTutorial}
            className={`px-3 py-1 rounded-xl text-xs font-bold flex items-center gap-1.5 cursor-pointer transition border ${
              isLight
                ? 'bg-[#0F172A] text-white hover:bg-[#1E293B] border-[#0F172A]'
                : 'bg-gradient-to-r from-amber-500/15 to-emerald-500/15 text-amber-200 border-amber-500/30'
            }`}
            title="Dais Protocol Guide & Tour [?]"
          >
            <Sparkles className="w-3.5 h-3.5 text-amber-300" />
            <span className="hidden sm:inline">Guide</span>
          </button>

          {/* Exit Live Dais to Hub */}
          <button
            type="button"
            onClick={() => {
              if (onExit) onExit();
              else if (typeof window !== 'undefined') window.location.href = '/dias';
            }}
            className={`p-1.5 rounded-xl border transition cursor-pointer ${
              isLight
                ? 'bg-white border-[#CBD5E1] text-[#8C8273] hover:text-red-600 hover:border-red-300'
                : 'bg-white/5 border-white/10 text-white/50 hover:text-red-400'
            }`}
            title="Exit Live Dais to Dias Hub"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      </header>

      {/* ─────────────────────────────────────────────────────────────
          2. MAIN BODY (Sidebar + Center Stage, Fits 100% in viewport)
      ───────────────────────────────────────────────────────────── */}
      <div className="flex-1 h-[calc(100vh-104px)] overflow-hidden flex relative">
        {/* ── LEFT COLLAPSIBLE SIDEBAR (280px) ── */}
        {!isSidebarCollapsed && (
          <aside
            id="tutorial-target-sidebar"
            className={`w-[280px] flex flex-col shrink-0 z-20 border-r transition-colors ${
              isLight
                ? 'bg-[#0F172A] text-white border-[#0F172A]'
                : 'bg-[#070a12]/95 text-white border-white/10'
            }`}
          >
            {/* Header: Emblem + Committee Name + Topic */}
            <div className="p-3.5 border-b border-white/10 space-y-1">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2 min-w-0">
                  <div className="w-7 h-7 rounded-lg bg-white/10 flex items-center justify-center p-1 border border-white/10 overflow-hidden shrink-0">
                    <CommitteeEmblemDisplay
                      emblem={session.emblemUrl}
                      acronym={session.committeeAcronym}
                      isIndian={session.isIndianCommittee}
                      size={20}
                    />
                  </div>
                  <div className="text-xs font-black tracking-tight uppercase text-amber-300 truncate">
                    {(session.committeeAcronym || session.committeeName || 'UNHRC').replace(/_/g, ' ')}
                  </div>
                </div>
                <button
                  type="button"
                  onClick={toggleSidebar}
                  className="text-white/40 hover:text-white p-1 cursor-pointer transition"
                  title="Collapse Sidebar"
                >
                  <PanelLeftClose className="w-4 h-4" />
                </button>
              </div>

              {/* Inline Topic Editor */}
              <div className="pt-0.5">
                {isEditingTopic ? (
                  <div className="flex items-center gap-1">
                    <input
                      type="text"
                      value={topicDraft}
                      onChange={(e) => setTopicDraft(e.target.value)}
                      className="w-full px-2 py-0.5 rounded bg-black/40 border border-white/20 text-xs text-white focus:outline-none"
                      autoFocus
                    />
                    <button
                      type="button"
                      onClick={handleTopicSave}
                      className="p-1 text-emerald-400 hover:text-white cursor-pointer"
                    >
                      <Check className="w-3 h-3" />
                    </button>
                  </div>
                ) : (
                  <div className="flex items-center justify-between text-[11px] text-emerald-200/70 font-medium">
                    <span className="truncate">Topic: {session.topic}</span>
                    <button
                      type="button"
                      onClick={() => {
                        setTopicDraft(session.topic);
                        setIsEditingTopic(true);
                      }}
                      className="text-amber-300 hover:text-white ml-1 shrink-0 p-0.5"
                      title="Edit Topic"
                    >
                      <Edit2 className="w-2.5 h-2.5" />
                    </button>
                  </div>
                )}
              </div>
            </div>

            {/* Quorum and Add a Seat */}
            <div className="p-2.5 bg-black/30 border-b border-white/10 flex items-center justify-between gap-1.5">
              <div className="flex items-center gap-1 text-center text-[10px]">
                <div className="px-1.5 py-0.5 rounded bg-white/5 border border-white/10">
                  <span className="text-emerald-200/60 font-semibold block text-[8px] uppercase">P</span>
                  <span className="font-bold text-amber-300 font-mono">{quorum.present}</span>
                </div>
                <div className="px-1.5 py-0.5 rounded bg-white/5 border border-white/10">
                  <span className="text-emerald-200/60 font-semibold block text-[8px] uppercase">2/3</span>
                  <span className="font-bold text-white font-mono">{quorum.twoThirds}</span>
                </div>
                <div className="px-1.5 py-0.5 rounded bg-white/5 border border-white/10">
                  <span className="text-emerald-200/60 font-semibold block text-[8px] uppercase">1/2</span>
                  <span className="font-bold text-white font-mono">{quorum.simpleMajority}</span>
                </div>
              </div>

              <div className="flex-1 min-w-0">
                <input
                  type="text"
                  value={newSeatName}
                  onChange={(e) => setNewSeatName(e.target.value)}
                  onKeyDown={handleAddSeatKeyDown}
                  placeholder="+ Add seat..."
                  className="w-full px-2 py-1 rounded-lg bg-black/40 border border-white/15 text-xs text-white placeholder-emerald-200/40 focus:outline-none focus:border-amber-400"
                />
              </div>
            </div>

            {/* Tab Switcher: Queue vs Roster */}
            <div className="flex border-b border-white/10 bg-black/20">
              <button
                type="button"
                onClick={() => setSidebarTab('queue')}
                className={`flex-1 py-1.5 text-center text-xs font-bold transition flex items-center justify-center gap-1.5 cursor-pointer border-b-2 ${
                  sidebarTab === 'queue'
                    ? 'border-amber-400 text-amber-300 bg-white/5'
                    : 'border-transparent text-emerald-200/60 hover:text-white'
                }`}
              >
                <span>Queue</span>
                <span className="px-1.5 py-0.2 rounded-full bg-black/40 text-amber-300 text-[10px] font-mono border border-amber-500/30">
                  {(session.activeMode === 'gsl' ? session.speakerQueue : session.caucusSpeakerQueue).length}
                </span>
              </button>

              <button
                type="button"
                onClick={() => setSidebarTab('roster')}
                className={`flex-1 py-1.5 text-center text-xs font-bold transition flex items-center justify-center gap-1.5 cursor-pointer border-b-2 ${
                  sidebarTab === 'roster'
                    ? 'border-amber-400 text-amber-300 bg-white/5'
                    : 'border-transparent text-emerald-200/60 hover:text-white'
                }`}
              >
                <span>Roster</span>
                <span className="px-1.5 py-0.2 rounded-full bg-black/40 text-neutral-300 text-[10px] font-mono border border-white/15">
                  {session.roster.length}
                </span>
              </button>
            </div>

            {/* Sidebar Content */}
            <div className="flex-1 overflow-y-auto p-2.5 space-y-2">
              {sidebarTab === 'queue' ? (
                <div className="space-y-1.5">
                  <div className="flex items-center justify-between px-1">
                    <span className="text-[9px] font-bold uppercase tracking-wider text-emerald-200/60">
                      Speaking Order
                    </span>
                    {(session.activeMode === 'gsl' ? session.speakerQueue : session.caucusSpeakerQueue).length > 0 && (
                      <button
                        type="button"
                        onClick={() => {
                          setSession((prev) => ({
                            ...prev,
                            ...(prev.activeMode === 'gsl'
                              ? { speakerQueue: [], currentSpeakerId: null }
                              : { caucusSpeakerQueue: [], currentSpeakerId: null }),
                          }));
                        }}
                        className="text-[9px] font-bold text-rose-300 hover:text-rose-200 cursor-pointer"
                      >
                        Clear
                      </button>
                    )}
                  </div>

                  {(session.activeMode === 'gsl' ? session.speakerQueue : session.caucusSpeakerQueue).length === 0 ? (
                    <div className="p-4 rounded-xl bg-white/[0.02] border border-white/5 text-center space-y-1">
                      <Mic className="w-4 h-4 mx-auto text-emerald-200/40" />
                      <div className="text-xs font-bold text-neutral-300">Queue is empty</div>
                      <p className="text-[10px] text-emerald-200/50">
                        Type in the bottom bar to add speakers.
                      </p>
                    </div>
                  ) : (
                    (session.activeMode === 'gsl' ? session.speakerQueue : session.caucusSpeakerQueue).map((delId, qIdx) => {
                      const del = session.roster.find((d) => d.id === delId);
                      if (!del) return null;
                      const isActive = qIdx === 0;

                      return (
                        <div
                          key={del.id}
                          className={`p-2 rounded-xl flex items-center justify-between gap-2 transition ${
                            isActive
                              ? 'bg-[#C5A46D] text-[#08090C] border border-[#E6D1A5] shadow-[0_0_12px_rgba(197,164,109,0.4)]'
                              : 'bg-black/30 hover:bg-black/50 border border-white/5'
                          }`}
                        >
                          <div className="flex items-center gap-2 min-w-0">
                            <div className="relative shrink-0">
                              <img
                                src={`https://flagcdn.com/w80/${del.countryCode.toLowerCase()}.png`}
                                alt=""
                                className="w-5 h-5 rounded-full object-cover border border-white/20"
                              />
                              <span
                                className={`absolute -top-1 -right-1 w-3 h-3 rounded-full flex items-center justify-center text-[8px] font-bold ${
                                  isActive && session.isTimerRunning
                                    ? 'bg-amber-400 text-black'
                                    : 'bg-black/80 text-white'
                                }`}
                              >
                                {qIdx + 1}
                              </span>
                            </div>

                            <div className="min-w-0">
                              <div className="text-xs font-bold text-white truncate">{del.name}</div>
                              <div className={`text-[9px] font-semibold leading-none ${isActive ? 'text-amber-300' : 'text-emerald-200/60'}`}>
                                {isActive ? (session.isTimerRunning ? 'SPEAKING' : 'ON FLOOR') : `#${qIdx + 1}`}
                              </div>
                            </div>
                          </div>

                          <button
                            type="button"
                            onClick={() => removeSpeakerFromQueue(qIdx)}
                            className="text-white/40 hover:text-rose-400 p-0.5 cursor-pointer"
                          >
                            <X className="w-3 h-3" />
                          </button>
                        </div>
                      );
                    })
                  )}
                </div>
              ) : (
                /* Roster Tab */
                <div className="space-y-2">
                  <input
                    type="text"
                    value={rosterSearch}
                    onChange={(e) => setRosterSearch(e.target.value)}
                    placeholder="Search roster..."
                    className="w-full px-2 py-1 rounded-lg bg-black/40 border border-white/10 text-xs text-white placeholder-emerald-200/40 focus:outline-none"
                  />

                  <div className="space-y-1">
                    {session.roster
                      .filter((d) => d.name.toLowerCase().includes(rosterSearch.toLowerCase()))
                      .map((d) => {
                        const inQueue = (session.activeMode === 'gsl' ? session.speakerQueue : session.caucusSpeakerQueue).includes(d.id);

                        return (
                          <button
                            key={d.id}
                            type="button"
                            onClick={() => addSpeakerToQueue(d.id)}
                            className="w-full p-1.5 rounded-lg bg-black/20 hover:bg-black/40 text-left flex items-center justify-between border border-white/5 transition cursor-pointer"
                          >
                            <div className="flex items-center gap-2 min-w-0">
                              <img
                                src={`https://flagcdn.com/w80/${d.countryCode.toLowerCase()}.png`}
                                alt=""
                                className="w-4 h-4 rounded-full object-cover shrink-0"
                              />
                              <span className="text-xs font-medium text-white truncate">{d.name}</span>
                            </div>
                            <span className="text-[9px] font-mono font-bold text-amber-300">
                              {inQueue ? 'Queued' : '+'}
                            </span>
                          </button>
                        );
                      })}
                  </div>
                </div>
              )}
            </div>
          </aside>
        )}

        {/* ── CENTER STAGE: GSL / CAUCUS RUNNER (Compact, Proportional, Zero Scroll) ── */}
        <main className="flex-1 h-full overflow-hidden flex flex-col justify-between p-3 sm:p-5 relative select-none">
          {/* Subtle Laurel Watermark */}
          <div className="absolute inset-0 flex items-center justify-center pointer-events-none opacity-[0.03] text-[25vw]">
            🏛️
          </div>

          {/* Top Stage Header / Mode Banner */}
          <div className="flex items-center justify-center gap-2 relative z-10 shrink-0">
            <span className={`text-xs font-mono font-bold uppercase tracking-widest px-3 py-1 rounded-full border shadow-xs flex items-center gap-1.5 ${
              isLight
                ? 'bg-white border-[#CBD5E1] text-[#0F172A]'
                : 'bg-cyan-950/40 border-cyan-500/30 text-cyan-300'
            }`}>
              {session.activeMode === 'gsl' ? (
                <>
                  <BookOpen className="w-3.5 h-3.5 text-amber-600" />
                  <span>General Speaker&apos;s List</span>
                </>
              ) : (
                <>
                  <Flame className="w-3.5 h-3.5 text-amber-500" />
                  <span>{session.activeCaucusMotion?.typeName || 'Moderated Caucus'}</span>
                </>
              )}
            </span>

            {session.activeMode !== 'gsl' && (
              <button
                type="button"
                onClick={endCaucusAndReturnToGsl}
                className="text-xs font-bold text-rose-600 hover:underline cursor-pointer"
              >
                End Caucus
              </button>
            )}
          </div>

          {/* Horizontal Queued Avatars Strip (Compact 38px) */}
          <div className="flex items-center justify-center gap-3 overflow-x-auto py-1 max-w-full relative z-10 shrink-0">
            {(session.activeMode === 'gsl' ? session.speakerQueue : session.caucusSpeakerQueue).map((delId, idx) => {
              const d = session.roster.find((del) => del.id === delId);
              if (!d) return null;
              const isFirst = idx === 0;

              return (
                <div key={d.id} className="flex flex-col items-center gap-1 relative group shrink-0">
                  <div
                    className={`w-9 h-9 rounded-full overflow-hidden border-2 transition shadow-sm ${
                      isFirst
                        ? 'border-[#C5A46D] ring-2 ring-[#C5A46D]/30 scale-105'
                        : 'border-black/20 opacity-70 hover:opacity-100'
                    }`}
                  >
                    <img
                      src={`https://flagcdn.com/w80/${d.countryCode.toLowerCase()}.png`}
                      alt={d.name}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <span className={`text-[10px] font-bold truncate max-w-[65px] ${isLight ? 'text-[#0F172A]' : 'text-white'}`}>
                    {d.name}
                  </span>
                  <button
                    type="button"
                    onClick={() => removeSpeakerFromQueue(idx)}
                    className="absolute -top-1 -right-1 w-3.5 h-3.5 rounded-full bg-rose-600 text-white flex items-center justify-center text-[9px] opacity-0 group-hover:opacity-100 transition cursor-pointer"
                    title="Remove"
                  >
                    &times;
                  </button>
                </div>
              );
            })}
          </div>

          {/* Active Speaker Flag & Name (Refined 80px) */}
          <div className="flex flex-col items-center space-y-1.5 relative z-10 shrink-0 my-auto">
            {activeDelegate ? (
              <>
                <div className="relative">
                  <div className={`w-20 h-20 sm:w-24 sm:h-24 rounded-full overflow-hidden border-4 transition-all duration-300 shadow-xl relative ${
                    session.isTimerRunning
                      ? 'border-[#C5A46D] ring-4 ring-[#C5A46D]/30 scale-102'
                      : 'border-black/15 ring-2 ring-black/5'
                  }`}>
                    <img
                      src={`https://flagcdn.com/w160/${activeDelegate.countryCode.toLowerCase()}.png`}
                      alt={activeDelegate.name}
                      className="w-full h-full object-cover"
                    />
                  </div>

                  {session.isTimerRunning && (
                    <div className="absolute -bottom-1.5 left-1/2 -translate-x-1/2 px-2.5 py-0.5 rounded-full bg-[#0E131F] border border-[#C5A46D]/40 shadow-sm flex items-center gap-1 z-10">
                      <div className="flex items-end gap-0.5 h-2.5">
                        <span className="w-0.5 bg-emerald-400 rounded-full animate-pulse h-1.5" />
                        <span className="w-0.5 bg-emerald-300 rounded-full animate-pulse h-2.5" />
                        <span className="w-0.5 bg-emerald-400 rounded-full animate-pulse h-2" />
                      </div>
                      <span className="text-[9px] font-mono font-black text-emerald-300 tracking-wider">SPEAKING</span>
                    </div>
                  )}
                </div>

                <div className="text-center space-y-0.5 pt-1">
                  <h3 className={`text-2xl sm:text-3xl font-black tracking-tight ${isLight ? 'text-[#0F172A]' : 'text-white'}`}>
                    {activeDelegate.name}
                  </h3>
                  <div className={`text-xs font-medium ${isLight ? 'text-[#6B655B]' : 'text-neutral-400'}`}>
                    {session.activeMode === 'gsl' ? 'General Speakers List' : session.activeCaucusMotion?.topic || 'Moderated Caucus'}
                  </div>
                </div>
              </>
            ) : (
              <div className="py-4 text-xs font-bold text-neutral-400">
                Add delegates to the queue to start speaking.
              </div>
            )}
          </div>

          {/* Digital Countdown Clock (Clean 64px, Clickable to Toggle) */}
          <div
            onClick={toggleTimer}
            id="tutorial-target-clock"
            className={`font-mono font-black text-6xl sm:text-7xl tracking-tight transition cursor-pointer select-none leading-none relative z-10 my-auto text-center ${
              session.remainingSeconds === 0 && session.isTimerRunning
                ? 'text-rose-600 animate-pulse'
                : isAmber
                ? 'text-amber-500 animate-pulse'
                : isLight
                ? 'text-[#0F172A] hover:text-[#0F172A]'
                : 'text-white hover:text-cyan-300'
            }`}
            title="Click clock to Start / Pause [Space]"
          >
            {formatTime(session.remainingSeconds)}
          </div>

          {/* Progress Bar & RTR Button */}
          <div className="w-full max-w-md mx-auto space-y-1 relative z-10 shrink-0">
            <div className={`flex items-center justify-between text-[11px] px-1 font-mono ${isLight ? 'text-[#6B655B]' : 'text-neutral-400'}`}>
              <span>
                {session.remainingSeconds === 0 && session.isTimerRunning ? (
                  <span className="text-rose-600 font-bold">TIME EXPIRED</span>
                ) : (
                  <span>Slot: {session.speakingTimeSeconds}s</span>
                )}
              </span>

              {/* Right to Reply */}
              <button
                type="button"
                id="tutorial-target-rtr"
                onClick={() => openRtr(activeDelegate?.id)}
                className="px-2.5 py-0.5 rounded-full bg-rose-500/10 hover:bg-rose-500/20 text-rose-600 border border-rose-500/30 font-bold text-[10px] flex items-center gap-1 cursor-pointer transition active:scale-95"
                title="Right to Reply"
              >
                <Reply className="w-3 h-3" />
                <span>RTR</span>
              </button>
            </div>

            <div className={`h-2 w-full rounded-full overflow-hidden p-0.5 border ${
              isLight ? 'bg-black/5 border-black/10' : 'bg-white/10 border-white/10'
            }`}>
              <div
                className={`h-full transition-all duration-300 rounded-full ${
                  session.remainingSeconds === 0 && session.isTimerRunning
                    ? 'bg-rose-500'
                    : isAmber
                    ? 'bg-gradient-to-r from-amber-500 to-rose-500'
                    : 'bg-gradient-to-r from-emerald-600 to-teal-500'
                }`}
                style={{ width: `${progressRatio * 100}%` }}
              />
            </div>
          </div>

          {/* Primary Timer Controls (Ergonomic h-11 buttons on one plane) */}
          <div className="flex items-center justify-center gap-2.5 pt-1 relative z-10 shrink-0">
            {/* ↺ Reset */}
            <button
              type="button"
              id="tutorial-target-reset-btn"
              onClick={resetTimer}
              className={`w-11 h-11 rounded-xl border flex items-center justify-center cursor-pointer transition shadow-xs active:scale-95 ${
                isLight
                  ? 'bg-white hover:bg-[#F1F5F9] border-[#CBD5E1] text-[#64748B] hover:text-[#0F172A]'
                  : 'bg-white/5 hover:bg-white/10 border-white/10 text-white/70 hover:text-white'
              }`}
              title="Reset clock [R]"
            >
              <RotateCcw className="w-4 h-4" />
            </button>

            {/* ▷ START / ⏸ PAUSE */}
            <button
              type="button"
              id="tutorial-target-start-btn"
              onClick={toggleTimer}
              className={`w-48 h-11 rounded-xl font-bold text-xs tracking-wider uppercase transition shadow-md flex items-center justify-center gap-2 cursor-pointer active:scale-95 ${
                session.isTimerRunning
                  ? 'bg-[#8C6D1F] hover:bg-[#735A19] text-white shadow-amber-900/20'
                  : 'bg-[#0F172A] hover:bg-[#1E293B] text-white shadow-sm'
              }`}
              title="Start / Pause [Space]"
            >
              {session.isTimerRunning ? (
                <>
                  <Pause className="w-4 h-4 fill-current" />
                  <span>PAUSE [Space]</span>
                </>
              ) : (
                <>
                  <Play className="w-4 h-4 fill-current" />
                  <span>START [Space]</span>
                </>
              )}
            </button>

            {/* ⏭ NEXT */}
            <button
              type="button"
              id="tutorial-target-next-btn"
              onClick={nextSpeaker}
              className={`w-36 h-11 rounded-xl border font-bold text-xs uppercase tracking-wider transition shadow-xs flex items-center justify-center gap-1.5 cursor-pointer active:scale-95 ${
                isLight
                  ? 'bg-white hover:bg-[#F1F5F9] border-[#CBD5E1] text-[#0F172A]'
                  : 'bg-[#0c1424] hover:bg-[#121f38] border-cyan-500/30 text-cyan-300'
              }`}
              title="Next Speaker [N]"
            >
              <SkipForward className="w-4 h-4" />
              <span>NEXT [N]</span>
            </button>

            {/* 🕒+ Add Time */}
            <div className="relative">
              <button
                type="button"
                id="tutorial-target-add-time"
                onClick={() => setShowAddTimePopover(!showAddTimePopover)}
                className={`w-11 h-11 rounded-xl border flex items-center justify-center cursor-pointer transition shadow-xs active:scale-95 ${
                  isLight
                    ? 'bg-white hover:bg-[#F1F5F9] border-[#CBD5E1] text-[#0F172A]'
                    : 'bg-cyan-500/10 hover:bg-cyan-500/20 border-cyan-500/30 text-cyan-400'
                }`}
                title="Add time to clock"
              >
                <Clock className="w-4 h-4" />
              </button>

              {/* Add Time Popover (Anchored Right Above Button) */}
              {showAddTimePopover && (
                <div className={`absolute bottom-14 right-0 z-50 p-3 rounded-2xl shadow-2xl border w-48 space-y-2 text-left backdrop-blur-xl ${
                  isLight ? 'bg-[#FFFFFF] border-[#CBD5E1] text-[#0F172A]' : 'bg-[#0a0f1d] border-white/15 text-white'
                }`}>
                  <div className="text-[10px] font-bold uppercase tracking-wider text-neutral-400">Add Time</div>
                  <div className="grid grid-cols-3 gap-1">
                    {[15, 30, 60].map((sec) => (
                      <button
                        key={sec}
                        type="button"
                        onClick={() => {
                          addTimeToClock(sec);
                          setShowAddTimePopover(false);
                        }}
                        className={`p-1.5 rounded-lg border text-xs font-bold text-center cursor-pointer transition ${
                          isLight
                            ? 'bg-white hover:bg-[#F1F5F9] border-[#CBD5E1]'
                            : 'bg-white/5 hover:bg-white/15 border-white/10'
                        }`}
                      >
                        +{sec}s
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* ↱ Yield */}
            <button
              type="button"
              id="tutorial-target-yield-box"
              onClick={openYieldPopover}
              className={`w-11 h-11 rounded-xl border flex items-center justify-center cursor-pointer transition shadow-xs active:scale-95 ${
                isLight
                  ? 'bg-amber-50 hover:bg-amber-100 border-amber-300 text-amber-800'
                  : 'bg-amber-500/10 hover:bg-amber-500/20 border-amber-500/30 text-amber-400'
              }`}
              title="Yield remaining speaking time [Y]"
            >
              <CornerUpRight className="w-4 h-4" />
            </button>

            {/* 🔨 Gavel Strike Button */}
            <button
              type="button"
              onClick={() => daisAudio.playDoubleGavel()}
              className={`w-11 h-11 rounded-xl border flex items-center justify-center cursor-pointer transition shadow-xs active:scale-95 ${
                isLight
                  ? 'bg-[#0F172A] hover:bg-[#1E293B] border-[#0F172A] text-[#C5A46D]'
                  : 'bg-amber-500/20 hover:bg-amber-500/30 border-amber-500/40 text-amber-300'
              }`}
              title="Rap Gavel [G]"
            >
              <Gavel className="w-4 h-4" />
            </button>
          </div>

          {/* Floating Yield Popover (Anchored Right Above Controls) */}
          {session.yieldPopoverOpen && (
            <div className={`absolute bottom-16 right-4 sm:right-12 z-50 w-72 rounded-2xl border shadow-2xl overflow-hidden text-left backdrop-blur-xl ${
              isLight ? 'bg-[#FFFFFF] border-[#CBD5E1] text-[#0F172A]' : 'bg-[#0a0f1d] border-white/15 text-white'
            }`}>
              <div className={`p-3 flex items-center justify-between border-b ${
                isLight ? 'bg-[#EDE8DE] border-[#DDD5C7]' : 'bg-black/40 border-white/10'
              }`}>
                <span className="text-xs font-black tracking-wider uppercase text-amber-700 flex items-center gap-1">
                  <span>• YIELD</span>
                </span>
                <button type="button" onClick={closeYieldPopover} className="p-0.5 cursor-pointer">
                  <X className="w-4 h-4" />
                </button>
              </div>

              <div className="p-3 space-y-3">
                <div className="text-xs font-semibold">
                  <strong>{activeDelegate?.name || 'Delegate'}</strong> yields •{' '}
                  <span className="font-bold font-mono text-amber-600">
                    {formatTime(session.yieldRemainingSeconds)} left
                  </span>
                </div>

                {nextQueuedDelegate && (
                  <button
                    type="button"
                    onClick={yieldToNextSpeaker}
                    className={`w-full p-2.5 rounded-xl border text-left transition cursor-pointer ${
                      isLight ? 'bg-white hover:bg-[#F1F5F9] border-[#CBD5E1]' : 'bg-white/5 hover:bg-white/10 border-white/10'
                    }`}
                  >
                    <div className="text-xs font-bold">{nextQueuedDelegate.name} (Next)</div>
                    <div className="text-[10px] text-neutral-500">
                      Gets their slot + {formatTime(session.yieldRemainingSeconds)}
                    </div>
                  </button>
                )}

                <div className="space-y-1 pt-1 border-t border-black/10">
                  <select
                    value={yieldSelectedId}
                    onChange={(e) => setYieldSelectedId(e.target.value)}
                    className={`w-full p-2 rounded-lg border text-xs font-semibold focus:outline-none ${
                      isLight ? 'bg-white border-[#CBD5E1]' : 'bg-black/40 border-white/15 text-white'
                    }`}
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
                    className="w-full py-2 rounded-lg bg-[#C5A46D] hover:bg-[#DFBA73] text-[#08090C] font-black text-xs uppercase cursor-pointer disabled:opacity-40 transition shadow-sm mt-1"
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
          3. BOTTOM BAR (52px, Quick-Add + Shortcuts + TIME presets)
      ───────────────────────────────────────────────────────────── */}
      <footer
        id="tutorial-target-bottom-bar"
        className={`h-[52px] px-4 flex items-center justify-between gap-4 z-30 shrink-0 relative border-t transition-colors ${
          isLight ? 'bg-[#FFFFFF] border-[#E2E8F0] text-[#0F172A]' : 'bg-[#070a12]/95 border-white/10 text-white'
        }`}
      >
        {/* Left: Quick-add speaker input */}
        <div className="relative flex-1 max-w-sm">
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
            placeholder="Add to queue... (Type country and press Enter)"
            className={`w-full px-3 py-1.5 rounded-xl border text-xs font-medium focus:outline-none shadow-xs transition ${
              isLight
                ? 'bg-white border-[#CBD5E1] text-[#0F172A] placeholder-[#8C857B] focus:border-[#C5A46D]'
                : 'bg-white/5 border-white/10 text-white placeholder-neutral-500 focus:border-cyan-400'
            }`}
          />

          {bottomDropdown && bottomInput.trim() && filteredBottomDelegates.length > 0 && (
            <div className={`absolute bottom-12 left-0 right-0 rounded-2xl shadow-2xl border max-h-48 overflow-y-auto z-50 ${
              isLight ? 'bg-white border-[#CBD5E1] text-[#0F172A]' : 'bg-[#0a0f1d] border-white/15 text-white'
            }`}>
              {filteredBottomDelegates.map((d) => (
                <button
                  key={d.id}
                  type="button"
                  onClick={() => {
                    addSpeakerToQueue(d.id);
                    setBottomInput('');
                    setBottomDropdown(false);
                  }}
                  className={`w-full px-3 py-2 text-left flex items-center gap-2 border-b last:border-none cursor-pointer text-xs font-bold transition ${
                    isLight ? 'hover:bg-[#F1F5F9] border-black/5' : 'hover:bg-white/10 border-white/5'
                  }`}
                >
                  <img
                    src={`https://flagcdn.com/w40/${d.countryCode.toLowerCase()}.png`}
                    alt=""
                    className="w-4 h-4 rounded-full object-cover border border-black/10"
                  />
                  <span>{d.name}</span>
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Center: Command Shortcuts Legend */}
        <div className={`hidden lg:flex items-center gap-2 text-[10px] font-mono ${
          isLight ? 'text-[#7A746A]' : 'text-neutral-400'
        }`}>
          <span><kbd className="px-1 py-0.5 rounded border bg-black/5">Space</kbd> Play</span>
          <span>•</span>
          <span><kbd className="px-1 py-0.5 rounded border bg-black/5">N</kbd> Next</span>
          <span>•</span>
          <span><kbd className="px-1 py-0.5 rounded border bg-black/5">R</kbd> Reset</span>
          <span>•</span>
          <span><kbd className="px-1 py-0.5 rounded border bg-black/5">G</kbd> Gavel</span>
          <span>•</span>
          <span><kbd className="px-1 py-0.5 rounded border bg-black/5">M</kbd> Motions</span>
          <span>•</span>
          <span><kbd className="px-1 py-0.5 rounded border bg-black/5">C</kbd> Roll Call</span>
          <span>•</span>
          <span><kbd className="px-1 py-0.5 rounded border bg-black/5">Y</kbd> Yield</span>
        </div>

        {/* Right: TIME presets */}
        <div className="flex items-center gap-1.5 shrink-0">
          <span className={`text-[10px] font-bold uppercase tracking-wider ${isLight ? 'text-[#7A746A]' : 'text-neutral-400'}`}>
            TIME
          </span>
          <div className="flex items-center gap-1">
            {[45, 60, 75, 90].map((s) => (
              <button
                key={s}
                type="button"
                onClick={() => setSpeakingSlotTime(s)}
                className={`px-2 py-0.5 rounded-lg text-xs font-mono font-bold transition cursor-pointer ${
                  session.speakingTimeSeconds === s
                    ? isLight
                      ? 'bg-[#C5A46D] text-[#08090C] font-black shadow-xs'
                      : 'bg-cyan-500 text-black shadow-xs'
                    : isLight
                    ? 'bg-white border border-[#CBD5E1] text-[#0F172A] hover:bg-[#F1F5F9]'
                    : 'bg-white/5 border border-white/10 text-white/90'
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
              className={`w-12 px-1 py-0.5 rounded-lg font-mono text-center font-bold text-xs focus:outline-none border ${
                isLight ? 'bg-white border-[#CBD5E1] text-[#0F172A]' : 'bg-white/5 border-white/10 text-white'
              }`}
              title="Custom seconds"
            />
          </div>
        </div>
      </footer>

      {/* Hotline Modal */}
      <DaisSupportHotlineModal
        isOpen={showSupportModal}
        onClose={() => setShowSupportModal(false)}
        committeeName={session.committeeName}
        committeeId={session.committeeAcronym}
      />
    </div>
  );
}
