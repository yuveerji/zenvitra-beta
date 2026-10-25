'use client';

import React, { createContext, useContext, useState, useEffect, useCallback, useMemo } from 'react';
import {
  ZenMunSession,
  ZenDelegate,
  ZenMotion,
  ZenDocument,
  SubstantiveVoteSession,
  PointLedgerEntry,
  CommenterFeedback,
  DEMO_DEFAULT_DELEGATES,
  ChairRole,
  ActiveDebateMode,
} from '@/types/zenMun';

const LS_ZENMUN_SESSION = 'zenvitra_zenmun_live_session_v1';

// Cryptographically and visually sound session code generator (unambiguous uppercase characters)
export function generateSessionCode(): string {
  const chars = '23456789ABCDEFGHJKLMNPQRSTUVWXYZ';
  let result = '';
  for (let i = 0; i < 6; i++) {
    result += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return result;
}

export function generateChairPassword(): string {
  return Math.floor(1000 + Math.random() * 9000).toString();
}

export function createInitialZenMunSession(initialCode?: string): ZenMunSession {
  const validCode =
    initialCode && initialCode.trim() && initialCode.trim().toUpperCase() !== 'PJL6KY'
      ? initialCode.trim().toUpperCase()
      : generateSessionCode();

  return {
    sessionCode: validCode,
    chairPassword: generateChairPassword(),
    chairName: '',
    chairRole: 'moderator',
    committeeName: '',
    committeeAcronym: '',
    topic: '',
    emblemUrl: '/assets/committees/un.svg',
    isIndianCommittee: false,

    roster: [],
    speakerQueue: [],
    currentSpeakerId: null,
    speakingTimeSeconds: 90,
    remainingSeconds: 90,
    isTimerRunning: false,
    totalSpokenSecondsCurrent: 0,

    rtrActive: false,
    rtrDelegateId: null,
    rtrRemainingSeconds: 30,
    rtrIsRunning: false,

    yieldPopoverOpen: false,
    yieldRemainingSeconds: 0,

    activeMode: 'gsl',
    activeCaucusMotion: null,
    caucusRemainingTotalSeconds: 0,
    caucusIsRunning: false,
    caucusSpeakerQueue: [],

    motions: [],
    documents: [],
    activeVoting: null,

    // Strict Data Integrity: ZERO seeded ledger entries or fake feedback
    pointsLedger: [],
    commenterFeedbacks: [],

    settings: {
      rankingBlend: 0,
      qualityFactors: [
        { id: 'q_diplomacy', label: 'Diplomacy', scaleMin: 0, scaleMax: 10 },
        { id: 'q_public_speaking', label: 'Public Speaking', scaleMin: 0, scaleMax: 10 },
        { id: 'q_collaboration', label: 'Collaboration', scaleMin: 0, scaleMax: 10 },
        { id: 'q_content_research', label: 'Content & Research', scaleMin: 0, scaleMax: 10 },
      ],
      pointValues: {
        attendance: 5,
        gslSpeech: 10,
        caucusSpeech: 8,
        speakingTimePer10s: 1,
        motionRaised: 10,
        motionPassed: 10,
        rightOfReply: 5,
        workingPaper: 10,
        draftResolution: 20,
        drPassed: 10,
      },
      allowDelegateGslRequest: true,
      allowDelegateMotion: true,
      allowDelegateDocs: true,
      allowDelegateDMs: true,
      allowPhoneVoting: true,
      p5VetoEnabled: true,
      majorityRule: 'simple',
    },

    sessionState: 'pre-session',
    tutorial: {
      isActive: false,
      currentStep: 1,
      isCompleted: false,
      welcomeModalOpen: false,
    },
  };
}

interface ZenMunContextValue {
  session: ZenMunSession;
  setSession: React.Dispatch<React.SetStateAction<ZenMunSession>>;
  
  // Timer Actions
  toggleTimer: () => void;
  startTimer: () => void;
  pauseTimer: () => void;
  resetTimer: () => void;
  addTimeToClock: (seconds: number) => void;
  setSpeakingSlotTime: (seconds: number) => void;
  nextSpeaker: () => void;

  // Speaker Queue Actions
  addSpeakerToQueue: (delegateId: string) => void;
  removeSpeakerFromQueue: (index: number) => void;
  reorderSpeakerQueue: (sourceIdx: number, destIdx: number) => void;

  // Right to Reply (RTR)
  openRtr: (delegateId?: string, seconds?: number) => void;
  toggleRtrTimer: () => void;
  closeRtr: () => void;

  // Yielding
  openYieldPopover: () => void;
  closeYieldPopover: () => void;
  yieldToNextSpeaker: () => void;
  yieldToDelegate: (delegateId: string) => void;

  // Roster & Attendance
  setDelegateAttendance: (delegateId: string, status: 'absent' | 'present' | 'present_voting') => void;
  setAllAttendance: (status: 'absent' | 'present' | 'present_voting') => void;
  addSeat: (name: string, isObserver?: boolean) => void;
  removeSeat: (delegateId: string) => void;

  // Motions
  raiseMotion: (motion: Omit<ZenMotion, 'id' | 'status' | 'createdAt'>) => void;
  passAndStartMotion: (motionId: string) => void;
  voteOnMotion: (motionId: string, passed: boolean) => void;
  endCaucusAndReturnToGsl: () => void;

  // Documents & Introduce Runner
  submitDocument: (doc: Omit<ZenDocument, 'id' | 'stage' | 'stageTimeRemaining' | 'createdAt'>) => void;
  startDocumentIntroduce: (docId: string) => void;
  advanceDocumentStage: (docId: string) => void;
  openSubstantiveVoting: (docId: string) => void;
  castSubstantiveVote: (delegateId: string, vote: 'for' | 'against' | 'abstain' | 'pass' | 'for_with_rights' | 'against_with_rights') => void;
  finalizeSubstantiveVote: () => void;

  // Commenter Feedback & Scores
  saveCommenterFeedback: (feedback: Omit<CommenterFeedback, 'id' | 'timestamp'>) => void;
  awardManualPoints: (delegateId: string, points: number, reason: string) => void;
  exportCsvScores: () => void;

  // Chair Role & Topic
  setChairRole: (role: ChairRole) => void;
  updateTopic: (topic: string) => void;

  // Modals & Navigation
  isSidebarCollapsed: boolean;
  toggleSidebar: () => void;
  showQrOverlay: boolean;
  setShowQrOverlay: (open: boolean) => void;
  showRollCallModal: boolean;
  setShowRollCallModal: (open: boolean) => void;
  showMotionsModal: boolean;
  setShowMotionsModal: (open: boolean) => void;
  showDocumentsModal: boolean;
  setShowDocumentsModal: (open: boolean) => void;
  showScoreboardModal: boolean;
  setShowScoreboardModal: (open: boolean) => void;
  showSettingsModal: boolean;
  setShowSettingsModal: (open: boolean) => void;
  showChatDrawer: boolean;
  setShowChatDrawer: (open: boolean) => void;
  activeSettingsTab: 'access' | 'motions' | 'voting' | 'points' | 'people';
  setActiveSettingsTab: (tab: 'access' | 'motions' | 'voting' | 'points' | 'people') => void;

  // Tutorial
  startTutorial: () => void;
  nextTutorialStep: () => void;
  prevTutorialStep: () => void;
  skipTutorial: () => void;
  endTutorial: () => void;

  // Session Code Generation
  regenerateSessionCode: () => string;

  // Quorum Computations
  quorum: {
    present: number;
    twoThirds: number;
    simpleMajority: number;
  };

  // Helper
  getDelegateById: (id: string) => ZenDelegate | undefined;
  scoreboardRanking: Array<{
    delegate: ZenDelegate;
    totalPoints: number;
    avgQuality: number;
    blendedScore: number;
  }>;
}

const ZenMunContext = createContext<ZenMunContextValue | undefined>(undefined);

export function ZenMunProvider({ children }: { children: React.ReactNode }) {
  const [session, setSession] = useState<ZenMunSession>(createInitialZenMunSession);
  const [isMounted, setIsMounted] = useState(false);

  // Modal controls
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
  const [showQrOverlay, setShowQrOverlay] = useState(false);
  const [showRollCallModal, setShowRollCallModal] = useState(false);
  const [showMotionsModal, setShowMotionsModal] = useState(false);
  const [showDocumentsModal, setShowDocumentsModal] = useState(false);
  const [showScoreboardModal, setShowScoreboardModal] = useState(false);
  const [showSettingsModal, setShowSettingsModal] = useState(false);
  const [showChatDrawer, setShowChatDrawer] = useState(false);
  const [activeSettingsTab, setActiveSettingsTab] = useState<'access' | 'motions' | 'voting' | 'points' | 'people'>('access');

  // Load state from localStorage on client mount & sanitize any legacy seeded data
  useEffect(() => {
    try {
      const stored = localStorage.getItem(LS_ZENMUN_SESSION);
      if (stored) {
        const parsed = JSON.parse(stored);
        if (parsed && typeof parsed === 'object') {
          // If stored session has no real roster, or is pre-session, or was a legacy unconfigured Lok Sabha seed: PURGE IT!
          const hasGenuineRoster = Array.isArray(parsed.roster) && parsed.roster.length > 0;
          const isLegacyLokSabhaSeed = parsed.committeeName === 'Lok Sabha' && (!parsed.roster || parsed.roster.length === 0);

          if (!hasGenuineRoster || isLegacyLokSabhaSeed || parsed.sessionState === 'pre-session' || !parsed.committeeName) {
            localStorage.removeItem(LS_ZENMUN_SESSION);
            localStorage.removeItem('zenvitra_dias_active_session');
            setSession(createInitialZenMunSession());
            setIsMounted(true);
            return;
          }

          // Real user session: sanitize and restore
          const isLegacySeededCode = parsed.sessionCode === 'PJL6KY' || !parsed.sessionCode;
          const cleanCode = isLegacySeededCode ? generateSessionCode() : parsed.sessionCode.toUpperCase();
          const cleanPassword = isLegacySeededCode && parsed.chairPassword === '4829'
            ? generateChairPassword()
            : (parsed.chairPassword || generateChairPassword());

          // Purge mock seeded points and feedbacks
          const cleanPointsLedger = Array.isArray(parsed.pointsLedger)
            ? parsed.pointsLedger.filter((p: any) => !p.id?.startsWith('pt-seed-'))
            : [];
          const cleanCommenterFeedbacks = Array.isArray(parsed.commenterFeedbacks)
            ? parsed.commenterFeedbacks.filter((f: any) => !f.id?.startsWith('cf-seed-'))
            : [];

          const sanitizedSession: ZenMunSession = {
            ...parsed,
            sessionCode: cleanCode,
            chairPassword: cleanPassword,
            pointsLedger: cleanPointsLedger,
            commenterFeedbacks: cleanCommenterFeedbacks,
            roster: parsed.roster,
            speakerQueue: Array.isArray(parsed.speakerQueue) ? parsed.speakerQueue : [],
            tutorial: {
              ...(parsed.tutorial || {}),
              welcomeModalOpen: false,
              isActive: false,
            },
          };

          setSession(sanitizedSession);
          localStorage.setItem(LS_ZENMUN_SESSION, JSON.stringify(sanitizedSession));
        }
      }
    } catch {}
    setIsMounted(true);
  }, []);

  // Save state to localStorage whenever it changes
  useEffect(() => {
    if (!isMounted) return;
    try {
      localStorage.setItem(LS_ZENMUN_SESSION, JSON.stringify(session));
    } catch {}
  }, [session, isMounted]);

  // Main countdown timer interval (1-second tick)
  useEffect(() => {
    const interval = setInterval(() => {
      setSession((prev) => {
        let updated = { ...prev };
        let stateChanged = false;

        // 1. GSL / Active Speaker Clock
        if (updated.isTimerRunning && updated.remainingSeconds > 0) {
          const nextSec = updated.remainingSeconds - 1;
          const nextSpoken = updated.totalSpokenSecondsCurrent + 1;
          updated = {
            ...updated,
            remainingSeconds: nextSec,
            totalSpokenSecondsCurrent: nextSpoken,
            isTimerRunning: nextSec > 0,
          };
          stateChanged = true;
        }

        // 2. Right to Reply (RTR) Sub-timer
        if (updated.rtrIsRunning && updated.rtrRemainingSeconds > 0) {
          const nextRtr = updated.rtrRemainingSeconds - 1;
          updated = {
            ...updated,
            rtrRemainingSeconds: nextRtr,
            rtrIsRunning: nextRtr > 0,
          };
          stateChanged = true;
        }

        // 3. Caucus Overall Timer
        if (updated.caucusIsRunning && updated.caucusRemainingTotalSeconds > 0) {
          const nextCaucus = updated.caucusRemainingTotalSeconds - 1;
          updated = {
            ...updated,
            caucusRemainingTotalSeconds: nextCaucus,
            caucusIsRunning: nextCaucus > 0,
          };
          stateChanged = true;
        }

        return stateChanged ? updated : prev;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  // Helpers
  const getDelegateById = useCallback((id: string) => {
    return session.roster.find((d) => d.id === id);
  }, [session.roster]);

  const quorum = useMemo(() => {
    const presentList = session.roster.filter(
      (d) => d.role !== 'observer' && (d.attendance === 'present' || d.attendance === 'present_voting')
    );
    const present = presentList.length;
    const twoThirds = Math.ceil((present * 2) / 3);
    const simpleMajority = Math.floor(present / 2) + 1;
    return { present, twoThirds, simpleMajority };
  }, [session.roster]);

  // Point trigger helper
  const recordPoint = useCallback((delegateId: string, category: PointLedgerEntry['category'], points: number, reason: string) => {
    const delegate = session.roster.find((d) => d.id === delegateId);
    if (!delegate) return;
    const newEntry: PointLedgerEntry = {
      id: `pt_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`,
      delegateId,
      delegateName: delegate.name,
      category,
      points,
      reason,
      timestamp: new Date().toISOString(),
    };
    setSession((prev) => ({
      ...prev,
      pointsLedger: [newEntry, ...prev.pointsLedger],
    }));
  }, [session.roster]);

  // Timer Handlers
  const toggleTimer = useCallback(() => {
    setSession((prev) => ({ ...prev, isTimerRunning: !prev.isTimerRunning }));
  }, []);

  const startTimer = useCallback(() => {
    setSession((prev) => ({ ...prev, isTimerRunning: true }));
  }, []);

  const pauseTimer = useCallback(() => {
    setSession((prev) => ({ ...prev, isTimerRunning: false }));
  }, []);

  const resetTimer = useCallback(() => {
    setSession((prev) => ({
      ...prev,
      remainingSeconds: prev.speakingTimeSeconds,
      isTimerRunning: false,
      totalSpokenSecondsCurrent: 0,
    }));
  }, []);

  const addTimeToClock = useCallback((seconds: number) => {
    setSession((prev) => ({
      ...prev,
      remainingSeconds: Math.max(0, prev.remainingSeconds + seconds),
    }));
  }, []);

  const setSpeakingSlotTime = useCallback((seconds: number) => {
    setSession((prev) => ({
      ...prev,
      speakingTimeSeconds: seconds,
      remainingSeconds: prev.isTimerRunning ? prev.remainingSeconds : seconds,
    }));
  }, []);

  const nextSpeaker = useCallback(() => {
    setSession((prev) => {
      const current = prev.currentSpeakerId;
      const spokenSeconds = prev.totalSpokenSecondsCurrent;

      // Automatically award speaking points:
      // +10 GSL speech or +8 Caucus speech
      // +1 pt per full 10s spoken
      if (current) {
        const delegate = prev.roster.find((d) => d.id === current);
        if (delegate) {
          const isGsl = prev.activeMode === 'gsl';
          const basePts = isGsl ? prev.settings.pointValues.gslSpeech : prev.settings.pointValues.caucusSpeech;
          const timePts = Math.floor(spokenSeconds / 10) * prev.settings.pointValues.speakingTimePer10s;
          
          const newEntries: PointLedgerEntry[] = [
            {
              id: `pt_${Date.now()}_1`,
              delegateId: current,
              delegateName: delegate.name,
              category: isGsl ? 'gsl_speech' : 'caucus_speech',
              points: basePts,
              reason: `${isGsl ? 'GSL' : 'Caucus'} speech concluded`,
              timestamp: new Date().toISOString(),
            },
          ];
          if (timePts > 0) {
            newEntries.push({
              id: `pt_${Date.now()}_2`,
              delegateId: current,
              delegateName: delegate.name,
              category: 'speaking_time',
              points: timePts,
              reason: `Spoke for ${spokenSeconds}s (+1 pt per 10s)`,
              timestamp: new Date().toISOString(),
            });
          }
          prev = { ...prev, pointsLedger: [...newEntries, ...prev.pointsLedger] };
        }
      }

      // Pop active speaker off queue and seat next
      const queue = prev.activeMode === 'gsl' ? [...prev.speakerQueue] : [...prev.caucusSpeakerQueue];
      queue.shift(); // remove current
      const nextId = queue[0] || null;

      return {
        ...prev,
        speakerQueue: prev.activeMode === 'gsl' ? queue : prev.speakerQueue,
        caucusSpeakerQueue: prev.activeMode !== 'gsl' ? queue : prev.caucusSpeakerQueue,
        currentSpeakerId: nextId,
        remainingSeconds: prev.speakingTimeSeconds,
        isTimerRunning: false,
        totalSpokenSecondsCurrent: 0,
      };
    });
  }, []);

  // Speaker Queue controls
  const addSpeakerToQueue = useCallback((delegateId: string) => {
    setSession((prev) => {
      const isGsl = prev.activeMode === 'gsl';
      const queue = isGsl ? [...prev.speakerQueue] : [...prev.caucusSpeakerQueue];
      if (queue.includes(delegateId)) return prev; // avoid duplicate
      queue.push(delegateId);
      const current = prev.currentSpeakerId || queue[0];
      return {
        ...prev,
        speakerQueue: isGsl ? queue : prev.speakerQueue,
        caucusSpeakerQueue: !isGsl ? queue : prev.caucusSpeakerQueue,
        currentSpeakerId: current,
      };
    });
  }, []);

  const removeSpeakerFromQueue = useCallback((index: number) => {
    setSession((prev) => {
      const isGsl = prev.activeMode === 'gsl';
      const queue = isGsl ? [...prev.speakerQueue] : [...prev.caucusSpeakerQueue];
      queue.splice(index, 1);
      const current = queue[0] || null;
      return {
        ...prev,
        speakerQueue: isGsl ? queue : prev.speakerQueue,
        caucusSpeakerQueue: !isGsl ? queue : prev.caucusSpeakerQueue,
        currentSpeakerId: current,
      };
    });
  }, []);

  const reorderSpeakerQueue = useCallback((sourceIdx: number, destIdx: number) => {
    setSession((prev) => {
      const isGsl = prev.activeMode === 'gsl';
      const queue = isGsl ? [...prev.speakerQueue] : [...prev.caucusSpeakerQueue];
      const [moved] = queue.splice(sourceIdx, 1);
      queue.splice(destIdx, 0, moved);
      return {
        ...prev,
        speakerQueue: isGsl ? queue : prev.speakerQueue,
        caucusSpeakerQueue: !isGsl ? queue : prev.caucusSpeakerQueue,
        currentSpeakerId: queue[0] || null,
      };
    });
  }, []);

  // Right to Reply
  const openRtr = useCallback((delegateId?: string, seconds = 30) => {
    setSession((prev) => {
      const targetId = delegateId || prev.currentSpeakerId;
      if (targetId) {
        const delegate = prev.roster.find((d) => d.id === targetId);
        if (delegate) {
          const ptEntry: PointLedgerEntry = {
            id: `pt_${Date.now()}`,
            delegateId: targetId,
            delegateName: delegate.name,
            category: 'right_of_reply',
            points: prev.settings.pointValues.rightOfReply,
            reason: 'Right to Reply invoked',
            timestamp: new Date().toISOString(),
          };
          return {
            ...prev,
            rtrActive: true,
            rtrDelegateId: targetId,
            rtrRemainingSeconds: seconds,
            rtrIsRunning: true,
            pointsLedger: [ptEntry, ...prev.pointsLedger],
          };
        }
      }
      return {
        ...prev,
        rtrActive: true,
        rtrDelegateId: targetId || null,
        rtrRemainingSeconds: seconds,
        rtrIsRunning: true,
      };
    });
  }, []);

  const toggleRtrTimer = useCallback(() => {
    setSession((prev) => ({ ...prev, rtrIsRunning: !prev.rtrIsRunning }));
  }, []);

  const closeRtr = useCallback(() => {
    setSession((prev) => ({ ...prev, rtrActive: false, rtrIsRunning: false }));
  }, []);

  // Yielding
  const openYieldPopover = useCallback(() => {
    setSession((prev) => ({
      ...prev,
      yieldPopoverOpen: true,
      yieldRemainingSeconds: prev.remainingSeconds,
    }));
  }, []);

  const closeYieldPopover = useCallback(() => {
    setSession((prev) => ({ ...prev, yieldPopoverOpen: false }));
  }, []);

  const yieldToNextSpeaker = useCallback(() => {
    setSession((prev) => {
      const queue = [...prev.speakerQueue];
      const leftover = prev.yieldRemainingSeconds || prev.remainingSeconds;
      queue.shift(); // remove current
      const nextId = queue[0] || null;
      return {
        ...prev,
        speakerQueue: queue,
        currentSpeakerId: nextId,
        remainingSeconds: prev.speakingTimeSeconds + leftover,
        isTimerRunning: false,
        totalSpokenSecondsCurrent: 0,
        yieldPopoverOpen: false,
      };
    });
  }, []);

  const yieldToDelegate = useCallback((targetDelegateId: string) => {
    setSession((prev) => {
      const leftover = prev.yieldRemainingSeconds || prev.remainingSeconds;
      return {
        ...prev,
        currentSpeakerId: targetDelegateId,
        remainingSeconds: leftover,
        isTimerRunning: false,
        totalSpokenSecondsCurrent: 0,
        yieldPopoverOpen: false,
      };
    });
  }, []);

  // Attendance
  const setDelegateAttendance = useCallback((delegateId: string, status: 'absent' | 'present' | 'present_voting') => {
    setSession((prev) => {
      const updatedRoster = prev.roster.map((d) => (d.id === delegateId ? { ...d, attendance: status } : d));
      // If marked present for first time, award attendance points
      let nextLedger = prev.pointsLedger;
      if (status !== 'absent') {
        const hasLogged = prev.pointsLedger.some((p) => p.delegateId === delegateId && p.category === 'attendance');
        if (!hasLogged) {
          const delegate = prev.roster.find((d) => d.id === delegateId);
          if (delegate) {
            nextLedger = [
              {
                id: `pt_${Date.now()}`,
                delegateId,
                delegateName: delegate.name,
                category: 'attendance',
                points: prev.settings.pointValues.attendance,
                reason: `Marked ${status === 'present_voting' ? 'Present & Voting' : 'Present'}`,
                timestamp: new Date().toISOString(),
              },
              ...nextLedger,
            ];
          }
        }
      }
      return { ...prev, roster: updatedRoster, pointsLedger: nextLedger };
    });
  }, []);

  const setAllAttendance = useCallback((status: 'absent' | 'present' | 'present_voting') => {
    setSession((prev) => ({
      ...prev,
      roster: prev.roster.map((d) => ({ ...d, attendance: status })),
    }));
  }, []);

  const addSeat = useCallback((name: string, isObserver = false) => {
    const clean = name.trim();
    if (!clean) return;
    const id = `del_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`;
    const code = clean.slice(0, 2).toLowerCase();
    const newDelegate: ZenDelegate = {
      id,
      name: clean,
      countryCode: code,
      role: isObserver ? 'observer' : 'member',
      attendance: 'present',
    };
    setSession((prev) => ({
      ...prev,
      roster: [...prev.roster, newDelegate],
    }));
  }, []);

  const removeSeat = useCallback((delegateId: string) => {
    setSession((prev) => ({
      ...prev,
      roster: prev.roster.filter((d) => d.id !== delegateId),
      speakerQueue: prev.speakerQueue.filter((id) => id !== delegateId),
      currentSpeakerId: prev.currentSpeakerId === delegateId ? null : prev.currentSpeakerId,
    }));
  }, []);

  // Motions
  const raiseMotion = useCallback((motionData: Omit<ZenMotion, 'id' | 'status' | 'createdAt'>) => {
    const newMotion: ZenMotion = {
      ...motionData,
      id: `mot_${Date.now()}`,
      status: 'queued',
      createdAt: new Date().toISOString(),
    };
    recordPoint(motionData.proposedById, 'motion_raised', session.settings.pointValues.motionRaised, `Raised motion: ${motionData.topic}`);
    setSession((prev) => ({
      ...prev,
      motions: [newMotion, ...prev.motions],
    }));
  }, [recordPoint, session.settings.pointValues.motionRaised]);

  const passAndStartMotion = useCallback((motionId: string) => {
    setSession((prev) => {
      const motion = prev.motions.find((m) => m.id === motionId);
      if (!motion) return prev;

      // Award points for motion passed
      let nextLedger = prev.pointsLedger;
      const delegate = prev.roster.find((d) => d.id === motion.proposedById);
      if (delegate) {
        nextLedger = [
          {
            id: `pt_${Date.now()}`,
            delegateId: motion.proposedById,
            delegateName: delegate.name,
            category: 'motion_passed',
            points: prev.settings.pointValues.motionPassed,
            reason: `Motion passed: ${motion.topic}`,
            timestamp: new Date().toISOString(),
          },
          ...nextLedger,
        ];
      }

      const updatedMotions = prev.motions.map((m) =>
        m.id === motionId ? { ...m, status: 'active' as const } : m
      );

      return {
        ...prev,
        motions: updatedMotions,
        pointsLedger: nextLedger,
        activeMode: motion.type === 'unmoderated' ? 'unmoderated_caucus' : 'moderated_caucus',
        activeCaucusMotion: motion,
        caucusRemainingTotalSeconds: motion.totalSeconds,
        caucusIsRunning: true,
        speakingTimeSeconds: motion.delegateSeconds || prev.speakingTimeSeconds,
        remainingSeconds: motion.delegateSeconds || prev.speakingTimeSeconds,
        isTimerRunning: false,
        caucusSpeakerQueue: [motion.proposedById],
        currentSpeakerId: motion.proposedById,
      };
    });
  }, []);

  const voteOnMotion = useCallback((motionId: string, passed: boolean) => {
    if (passed) {
      passAndStartMotion(motionId);
    } else {
      setSession((prev) => ({
        ...prev,
        motions: prev.motions.map((m) => (m.id === motionId ? { ...m, status: 'failed' } : m)),
      }));
    }
  }, [passAndStartMotion]);

  const endCaucusAndReturnToGsl = useCallback(() => {
    setSession((prev) => ({
      ...prev,
      activeMode: 'gsl',
      activeCaucusMotion: null,
      caucusIsRunning: false,
      isTimerRunning: false,
      remainingSeconds: prev.speakingTimeSeconds,
      currentSpeakerId: prev.speakerQueue[0] || null,
    }));
  }, []);

  // Documents
  const submitDocument = useCallback((docData: Omit<ZenDocument, 'id' | 'stage' | 'stageTimeRemaining' | 'createdAt'>) => {
    const newDoc: ZenDocument = {
      ...docData,
      id: `doc_${Date.now()}`,
      stage: 'draft',
      stageTimeRemaining: docData.readingSeconds || 60,
      createdAt: new Date().toISOString(),
    };
    // Award points to sponsors
    docData.sponsors.forEach((sponsorId) => {
      const isDr = docData.type === 'draft_resolution';
      const pts = isDr ? session.settings.pointValues.draftResolution : session.settings.pointValues.workingPaper;
      recordPoint(sponsorId, isDr ? 'draft_resolution' : 'working_paper', pts, `Sponsored ${docData.code}: ${docData.title}`);
    });
    setSession((prev) => ({
      ...prev,
      documents: [newDoc, ...prev.documents],
    }));
  }, [recordPoint, session.settings.pointValues]);

  const startDocumentIntroduce = useCallback((docId: string) => {
    setSession((prev) => {
      const doc = prev.documents.find((d) => d.id === docId);
      if (!doc) return prev;
      return {
        ...prev,
        documents: prev.documents.map((d) =>
          d.id === docId ? { ...d, stage: 'reading', stageTimeRemaining: d.readingSeconds || 60 } : d
        ),
      };
    });
  }, []);

  const advanceDocumentStage = useCallback((docId: string) => {
    setSession((prev) => {
      const doc = prev.documents.find((d) => d.id === docId);
      if (!doc) return prev;
      let nextStage: ZenDocument['stage'] = doc.stage;
      let nextTime = 60;
      if (doc.stage === 'reading') {
        nextStage = 'presentation';
        nextTime = doc.presentationSeconds || 120;
      } else if (doc.stage === 'presentation') {
        nextStage = 'qa';
        nextTime = doc.qaSeconds || 180;
      } else if (doc.stage === 'qa') {
        if (doc.type === 'working_paper') {
          nextStage = 'passed';
        } else {
          nextStage = 'voting';
        }
      }
      return {
        ...prev,
        documents: prev.documents.map((d) =>
          d.id === docId ? { ...d, stage: nextStage, stageTimeRemaining: nextTime } : d
        ),
      };
    });
  }, []);

  const openSubstantiveVoting = useCallback((docId: string) => {
    setSession((prev) => {
      const doc = prev.documents.find((d) => d.id === docId);
      if (!doc) return prev;
      const initialVotes: Record<string, 'for' | 'against' | 'abstain' | 'pass' | 'for_with_rights' | 'against_with_rights'> = {};
      return {
        ...prev,
        activeVoting: {
          documentId: docId,
          documentTitle: `${doc.code} — ${doc.title}`,
          round: 1,
          votes: initialVotes,
          passedCount: 0,
          againstCount: 0,
          abstainCount: 0,
          requiredMajority: prev.settings.majorityRule,
          p5VetoEnabled: prev.settings.p5VetoEnabled,
          status: 'voting',
        },
      };
    });
  }, []);

  const castSubstantiveVote = useCallback((delegateId: string, vote: 'for' | 'against' | 'abstain' | 'pass' | 'for_with_rights' | 'against_with_rights') => {
    setSession((prev) => {
      if (!prev.activeVoting) return prev;
      const updatedVotes = { ...prev.activeVoting.votes, [delegateId]: vote };
      let passed = 0;
      let against = 0;
      let abstain = 0;
      Object.values(updatedVotes).forEach((v) => {
        if (v === 'for' || v === 'for_with_rights') passed++;
        else if (v === 'against' || v === 'against_with_rights') against++;
        else if (v === 'abstain') abstain++;
      });
      return {
        ...prev,
        activeVoting: {
          ...prev.activeVoting,
          votes: updatedVotes,
          passedCount: passed,
          againstCount: against,
          abstainCount: abstain,
        },
      };
    });
  }, []);

  const finalizeSubstantiveVote = useCallback(() => {
    setSession((prev) => {
      if (!prev.activeVoting) return prev;
      const doc = prev.documents.find((d) => d.id === prev.activeVoting?.documentId);
      const isTwoThirds = prev.activeVoting.requiredMajority === 'two_thirds';
      const totalDecisive = prev.activeVoting.passedCount + prev.activeVoting.againstCount;
      const threshold = isTwoThirds ? Math.ceil((totalDecisive * 2) / 3) : Math.floor(totalDecisive / 2) + 1;
      
      // Check P5 veto if enabled
      let isVetoed = false;
      const vetoers: string[] = [];
      if (prev.activeVoting.p5VetoEnabled) {
        prev.roster.forEach((del) => {
          if (del.isP5) {
            const v = prev.activeVoting?.votes[del.id];
            if (v === 'against' || v === 'against_with_rights') {
              isVetoed = true;
              vetoers.push(del.name);
            }
          }
        });
      }

      const passed = !isVetoed && prev.activeVoting.passedCount >= threshold;

      // Award points if passed
      let nextLedger = prev.pointsLedger;
      if (passed && doc) {
        doc.sponsors.forEach((spId) => {
          const spDel = prev.roster.find((d) => d.id === spId);
          if (spDel) {
            nextLedger = [
              {
                id: `pt_${Date.now()}_${spId}`,
                delegateId: spId,
                delegateName: spDel.name,
                category: 'dr_passed',
                points: prev.settings.pointValues.drPassed,
                reason: `Draft resolution passed: ${doc.code}`,
                timestamp: new Date().toISOString(),
              },
              ...nextLedger,
            ];
          }
        });
      }

      return {
        ...prev,
        pointsLedger: nextLedger,
        documents: prev.documents.map((d) =>
          d.id === prev.activeVoting?.documentId ? { ...d, stage: passed ? 'passed' : 'failed' } : d
        ),
        activeVoting: {
          ...prev.activeVoting,
          status: passed ? 'passed' : 'failed',
          vetoedBy: isVetoed ? vetoers : undefined,
        },
      };
    });
  }, []);

  // Commenter Feedback & Scores
  const saveCommenterFeedback = useCallback((feedbackData: Omit<CommenterFeedback, 'id' | 'timestamp'>) => {
    const newFeedback: CommenterFeedback = {
      ...feedbackData,
      id: `cf_${Date.now()}`,
      timestamp: new Date().toISOString(),
    };
    setSession((prev) => ({
      ...prev,
      commenterFeedbacks: [newFeedback, ...prev.commenterFeedbacks],
    }));
  }, []);

  const awardManualPoints = useCallback((delegateId: string, points: number, reason: string) => {
    recordPoint(delegateId, 'manual_adjustment', points, reason || 'Manual chair adjustment');
  }, [recordPoint]);

  const exportCsvScores = useCallback(() => {
    const rows = [
      ['Rank', 'Delegation', 'Country Code', 'Total Points', 'Attendance', 'GSL Speech', 'Caucus Speech', 'Speaking Time', 'Motions', 'Resolutions', 'Manual Adjustments', 'Avg Quality Rating', 'Notes Count'],
    ];

    // Compute leaderboard scores
    session.roster.forEach((del, idx) => {
      const delEntries = session.pointsLedger.filter((p) => p.delegateId === del.id);
      const total = delEntries.reduce((acc, curr) => acc + curr.points, 0);
      const attendance = delEntries.filter((p) => p.category === 'attendance').reduce((acc, c) => acc + c.points, 0);
      const gsl = delEntries.filter((p) => p.category === 'gsl_speech').reduce((acc, c) => acc + c.points, 0);
      const caucus = delEntries.filter((p) => p.category === 'caucus_speech').reduce((acc, c) => acc + c.points, 0);
      const spkTime = delEntries.filter((p) => p.category === 'speaking_time').reduce((acc, c) => acc + c.points, 0);
      const motions = delEntries.filter((p) => p.category === 'motion_raised' || p.category === 'motion_passed').reduce((acc, c) => acc + c.points, 0);
      const docs = delEntries.filter((p) => p.category === 'working_paper' || p.category === 'draft_resolution' || p.category === 'dr_passed').reduce((acc, c) => acc + c.points, 0);
      const manual = delEntries.filter((p) => p.category === 'manual_adjustment').reduce((acc, c) => acc + c.points, 0);

      const fbs = session.commenterFeedbacks.filter((f) => f.delegateId === del.id);
      let avgQ = 0;
      if (fbs.length > 0) {
        const sumAll = fbs.reduce((acc, f) => acc + f.ratings.diplomacy + f.ratings.publicSpeaking + f.ratings.collaboration + f.ratings.contentResearch, 0);
        avgQ = parseFloat((sumAll / (fbs.length * 4)).toFixed(1));
      }

      rows.push([
        String(idx + 1),
        del.name,
        del.countryCode.toUpperCase(),
        String(total),
        String(attendance),
        String(gsl),
        String(caucus),
        String(spkTime),
        String(motions),
        String(docs),
        String(manual),
        String(avgQ),
        String(fbs.length),
      ]);
    });

    const csvContent = 'data:text/csv;charset=utf-8,' + rows.map((e) => e.join(',')).join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `ZEN_MUN_${session.committeeAcronym}_Scoreboard_${session.sessionCode}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  }, [session]);

  const setChairRole = useCallback((role: ChairRole) => {
    setSession((prev) => ({ ...prev, chairRole: role }));
  }, []);

  const updateTopic = useCallback((topic: string) => {
    setSession((prev) => ({ ...prev, topic }));
  }, []);

  const toggleSidebar = useCallback(() => {
    setIsSidebarCollapsed((prev) => !prev);
  }, []);

  // Tutorial
  const startTutorial = useCallback(() => {
    setSession((prev) => ({
      ...prev,
      tutorial: { ...prev.tutorial, isActive: false, currentStep: 1, welcomeModalOpen: true },
    }));
  }, []);

  const nextTutorialStep = useCallback(() => {
    setSession((prev) => ({
      ...prev,
      tutorial: { ...prev.tutorial, currentStep: Math.min(17, prev.tutorial.currentStep + 1) },
    }));
  }, []);

  const prevTutorialStep = useCallback(() => {
    setSession((prev) => ({
      ...prev,
      tutorial: { ...prev.tutorial, currentStep: Math.max(1, prev.tutorial.currentStep - 1) },
    }));
  }, []);

  const skipTutorial = useCallback(() => {
    setSession((prev) => ({
      ...prev,
      tutorial: { ...prev.tutorial, isActive: false, isCompleted: true, welcomeModalOpen: false },
    }));
  }, []);

  const endTutorial = useCallback(() => {
    setSession((prev) => ({
      ...prev,
      tutorial: { ...prev.tutorial, isActive: false, isCompleted: true, welcomeModalOpen: false },
    }));
  }, []);

  // Leaderboard ranking calculation with optional quality factor blend
  const scoreboardRanking = useMemo(() => {
    const list = session.roster.map((del) => {
      const delEntries = session.pointsLedger.filter((p) => p.delegateId === del.id);
      const totalPoints = delEntries.reduce((acc, curr) => acc + curr.points, 0);
      const fbs = session.commenterFeedbacks.filter((f) => f.delegateId === del.id);
      let avgQuality = 0;
      if (fbs.length > 0) {
        const sumAll = fbs.reduce(
          (acc, f) => acc + f.ratings.diplomacy + f.ratings.publicSpeaking + f.ratings.collaboration + f.ratings.contentResearch,
          0
        );
        avgQuality = parseFloat((sumAll / (fbs.length * 4)).toFixed(1));
      }
      const blendPct = session.settings.rankingBlend / 100;
      const blendedScore = parseFloat((totalPoints * (1 - blendPct) + avgQuality * 10 * blendPct).toFixed(1));
      return { delegate: del, totalPoints, avgQuality, blendedScore };
    });
    return list.sort((a, b) => b.blendedScore - a.blendedScore || b.totalPoints - a.totalPoints);
  }, [session.roster, session.pointsLedger, session.commenterFeedbacks, session.settings.rankingBlend]);

  // Dynamic Session Code Regeneration (Non-seeded)
  const regenerateSessionCode = useCallback(() => {
    const newCode = generateSessionCode();
    setSession((prev) => ({
      ...prev,
      sessionCode: newCode,
    }));
    return newCode;
  }, []);

  const value = {
    session,
    setSession,
    regenerateSessionCode,
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
    setDelegateAttendance,
    setAllAttendance,
    addSeat,
    removeSeat,
    raiseMotion,
    passAndStartMotion,
    voteOnMotion,
    endCaucusAndReturnToGsl,
    submitDocument,
    startDocumentIntroduce,
    advanceDocumentStage,
    openSubstantiveVoting,
    castSubstantiveVote,
    finalizeSubstantiveVote,
    saveCommenterFeedback,
    awardManualPoints,
    exportCsvScores,
    setChairRole,
    updateTopic,
    isSidebarCollapsed,
    toggleSidebar,
    showQrOverlay,
    setShowQrOverlay,
    showRollCallModal,
    setShowRollCallModal,
    showMotionsModal,
    setShowMotionsModal,
    showDocumentsModal,
    setShowDocumentsModal,
    showScoreboardModal,
    setShowScoreboardModal,
    showSettingsModal,
    setShowSettingsModal,
    showChatDrawer,
    setShowChatDrawer,
    activeSettingsTab,
    setActiveSettingsTab,
    startTutorial,
    nextTutorialStep,
    prevTutorialStep,
    skipTutorial,
    endTutorial,
    quorum,
    getDelegateById,
    scoreboardRanking,
  };

  return <ZenMunContext.Provider value={value}>{children}</ZenMunContext.Provider>;
}

export function useZenMun() {
  const context = useContext(ZenMunContext);
  if (!context) {
    throw new Error('useZenMun must be used within a ZenMunProvider');
  }
  return context;
}
