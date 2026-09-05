'use client';

import React, { createContext, useContext, useState, useEffect, useCallback, useMemo } from 'react';
import { useAuth } from '@/context/AuthContext';
import {
  MunRegistration,
  MunInvite,
  MunCommittee,
  MunCommitteeType,
  MunSessionState,
  MunMotion,
  MunSpeaker,
  MunParliamentaryPoint,
  MunDraftResolution,
  MotionType,
  PointType,
  MunSessionMode,
  MunExperienceRecord,
  ChamberCategory,
  VotingSessionType,
  VotingRuleMode,
  ChamberVoteOption,
  ChamberRollCallVote,
  ChamberRatingEntry,
  ChamberVotingSession,
  StagePerformer,
  ChamberRoom
} from '@/types/mun';
import { broadcastActivitySync } from '@/lib/reactiveActivityHub';

interface MunContextType {
  /* Registrations & Invites */
  registrations: MunRegistration[];
  invites: MunInvite[];
  userInvites: MunInvite[];
  pendingInviteCount: number;
  selectedInviteModal: MunInvite | null;
  setSelectedInviteModal: (invite: MunInvite | null) => void;
  registerForMun: (
    eventId: string,
    eventName: string,
    committeePref: string,
    portfolioPrefs: string[],
    experience: 'beginner' | 'intermediate' | 'advanced' | 'veteran'
  ) => MunRegistration;
  acceptMunInvite: (inviteId: string) => void;
  declineMunInvite: (inviteId: string) => void;
  getInviteForEvent: (eventId: string) => MunInvite | undefined;
  hasAcceptedInviteForEvent: (eventId: string) => boolean;

  /* Delegate Experiences & MUN Dossier */
  experiences: MunExperienceRecord[];
  addExperience: (exp: Omit<MunExperienceRecord, 'id' | 'userId' | 'userHandle' | 'createdAt'>) => MunExperienceRecord;
  verifyExperience: (id: string, proofUrl?: string, certificateId?: string) => void;
  deleteExperience: (id: string) => void;
  getUserExperiences: (userIdOrHandle?: string) => MunExperienceRecord[];

  /* Committees & Delegate Node Session */
  committees: MunCommittee[];
  getCommitteeById: (id: string) => MunCommittee | undefined;
  activeCommitteeId: string;
  setActiveCommitteeId: (id: string) => void;
  updateCommitteeDetails: (id: string, data: Partial<Pick<MunCommittee, 'name' | 'shortName' | 'type' | 'agenda' | 'totalDelegates'>>) => void;
  addCustomCommittee: (customData: { name: string; shortName?: string; agenda: string; type?: MunCommitteeType }) => MunCommittee;
  sessionState: MunSessionState;
  
  /* Live Timer Controls */
  toggleTimer: () => void;
  resetTimer: (totalSeconds: number, label: string, mode: MunSessionMode) => void;
  setTimerSeconds: (remainingSeconds: number) => void;

  /* Motion Queue Controls */
  raiseMotion: (
    type: MotionType,
    topic: string,
    totalMinutes: number,
    individualSpeakerSeconds: number
  ) => MunMotion;
  startMotion: (motionId: string) => void;
  voteOnMotion: (motionId: string, vote: 'for' | 'against') => void;
  withdrawMotion: (motionId: string) => void;

  /* Speakers List Controls */
  joinSpeakersList: (customPortfolio?: string) => void;
  advanceSpeaker: () => void;
  yieldSpeakerTime: (type: 'chair' | 'points_of_info' | 'another_delegate') => void;

  /* Parliamentary Points */
  raiseParliamentaryPoint: (type: PointType, detail: string) => void;
  dismissPoint: (pointId: string) => void;

  /* Draft Resolutions */
  sponsorResolution: (resolutionId: string) => void;
  signResolution: (resolutionId: string) => void;
  createDraftResolution: (code: string, title: string, preambles: string[], operatives: string[]) => void;

  /* ─────────── LIVE CHAMBER VOTING & MULTI-MODE STAGE ENGINE ─────────── */
  chamberRooms: ChamberRoom[];
  createChamberRoom: (title: string, category: ChamberCategory, agenda: string) => ChamberRoom;
  activeVotingSession: ChamberVotingSession | null;
  votingSessions: ChamberVotingSession[];
  launchVotingSession: (session: {
    title: string;
    description?: string;
    category: VotingSessionType;
    ruleMode: VotingRuleMode;
    durationSeconds: number;
    options: Array<{ label: string; sublabel?: string }>;
    performerTarget?: { id: string; name: string; actTitle: string };
  }) => ChamberVotingSession;
  castChamberVote: (sessionId: string, optionId: string) => void;
  castRollCallVote: (sessionId: string, vote: 'yes' | 'no' | 'abstain' | 'pass', countryName?: string, isVetoPower?: boolean) => void;
  ratePerformer: (sessionId: string, score: number, feedback?: string) => void;
  closeVotingSession: (sessionId: string) => void;
  stagePerformers: StagePerformer[];
  addStagePerformer: (performerName: string, actTitle: string, genre: StagePerformer['genre'], durationMinutes: number) => void;
  advanceStagePerformer: () => void;
  triggerStageReaction: (emoji: string) => void;
  stageReactions: Array<{ id: string; emoji: string; count: number; x?: number }>;
}

/* ─────────── LIVE DEFAULT PLATFORM DATA ─────────── */

const DEFAULT_COMMITTEES: MunCommittee[] = [
  {
    id: 'unsc-2026',
    eventId: 'evt_summit_2026',
    name: 'UN Security Council (UNSC)',
    shortName: 'UNSC',
    type: 'UNSC',
    agenda: 'Autonomous Cyber-Warfare & Global Sovereign Non-Proliferation',
    totalDelegates: 15,
    presentCount: 15,
    presentAndVotingCount: 15,
    quorumNeeded: 9,
    dais: { chair: 'Presiding Officer (Geneva)', viceChair: 'Deputy Rapporteur' }
  },
  {
    id: 'unga-plenary',
    eventId: 'evt_summit_2026',
    name: 'UN General Assembly Plenary',
    shortName: 'UNGA',
    type: 'DISEC',
    agenda: 'Universal Youth Framework for Sustainable Compute & Climate Action',
    totalDelegates: 30,
    presentCount: 26,
    presentAndVotingCount: 24,
    quorumNeeded: 16,
    dais: { chair: 'President of General Assembly', viceChair: 'Under-Secretary-General' }
  },
  {
    id: 'unhrc-2026',
    eventId: 'evt_summit_2026',
    name: 'UN Human Rights Council (UNHRC)',
    shortName: 'UNHRC',
    type: 'UNHRC',
    agenda: 'Digital Privacy, Algorithmic Transparency & Youth Human Rights in the AI Era',
    totalDelegates: 25,
    presentCount: 22,
    presentAndVotingCount: 20,
    quorumNeeded: 13,
    dais: { chair: 'High Commissioner Rapporteur', viceChair: 'Session Moderator' }
  },
  {
    id: 'lok-sabha-2026',
    eventId: 'evt_parliament_2026',
    name: 'Lok Sabha (House of the People) — Youth Parliamentary Session',
    shortName: 'LOK SABHA',
    type: 'LOK_SABHA',
    agenda: 'National Digital Sovereignty, AI Ethics & Youth Entrepreneurship Promotion Bill',
    totalDelegates: 45,
    presentCount: 38,
    presentAndVotingCount: 35,
    quorumNeeded: 23,
    dais: { chair: "Hon'ble Speaker of the House", viceChair: 'Deputy Speaker' }
  },
  {
    id: 'constituent-assembly-2026',
    eventId: 'evt_constituent_assembly_2026',
    name: 'Constituent Assembly of India (SASSY 2026)',
    shortName: 'CONSTITUENT ASSEMBLY',
    type: 'PARLIAMENTARY',
    agenda: 'Deliberation upon Drafting and Adoption of an Amended Constitution for the Republic',
    totalDelegates: 50,
    presentCount: 44,
    presentAndVotingCount: 40,
    quorumNeeded: 25,
    dais: { 
      chair: 'Hit Upadhyay (Chairman)', 
      viceChair: 'Kavyanshi (Deputy Chairman) & Yuveer Chhatwani (Advisor)' 
    }
  },
  {
    id: 'open-mic-stage',
    eventId: 'evt_stage_2026',
    name: 'Global Youth Open Mic & Spoken Word Stage',
    shortName: 'STAGE',
    type: 'CRISIS',
    agenda: 'Live Poetry, Acoustic Jam, Standup Comedy & Expressive Freedom',
    totalDelegates: 50,
    presentCount: 42,
    presentAndVotingCount: 38,
    quorumNeeded: 10,
    dais: { chair: 'Stage Host & MC', viceChair: 'Sound & Voting Coordinator' }
  },
  {
    id: 'pitch-arena',
    eventId: 'evt_pitch_2026',
    name: 'Youth DeepTech & Climate Venture Pitch Arena',
    shortName: 'PITCH',
    type: 'ECOSOC',
    agenda: '3-Minute Lightning Innovation Pitches & Real-Time Jury Venture Balloting',
    totalDelegates: 25,
    presentCount: 20,
    presentAndVotingCount: 18,
    quorumNeeded: 12,
    dais: { chair: 'Lead Jury Evaluator', viceChair: 'Venture Moderator' }
  },
  {
    id: 'custom-chamber-other',
    eventId: 'evt_custom_2026',
    name: 'Universal Youth Assembly & Multidisciplinary Forum',
    shortName: 'OTHER',
    type: 'OTHER',
    agenda: 'Open Consensus Deliberation, Cross-Sector Direct Policy & Innovation',
    totalDelegates: 25,
    presentCount: 20,
    presentAndVotingCount: 18,
    quorumNeeded: 12,
    dais: { chair: 'Session Moderator', viceChair: 'Assembly Secretary' }
  }
];

const DEFAULT_CHAMBER_ROOMS: ChamberRoom[] = [
  {
    id: 'unsc-2026',
    title: 'UN Security Council (UNSC) Plenary',
    category: 'MUN_COMMITTEE',
    agenda: 'Autonomous Cyber-Warfare & Global Sovereign Non-Proliferation',
    shortCode: 'UNSC-01',
    hostName: 'Presiding Officer',
    hostHandle: 'chair.unsc',
    isLive: true,
    activeVotingSession: null,
    votingHistory: [],
    performersQueue: [],
    reactions: [],
    createdAt: '2026-08-29'
  },
  {
    id: 'unga-plenary',
    title: 'UN General Assembly Plenary',
    category: 'MUN_COMMITTEE',
    agenda: 'Universal Youth Framework for Sustainable Compute & Climate Action',
    shortCode: 'UNGA-01',
    hostName: 'President of General Assembly',
    hostHandle: 'president.ga',
    isLive: true,
    activeVotingSession: null,
    votingHistory: [],
    performersQueue: [],
    reactions: [],
    createdAt: '2026-08-29'
  },
  {
    id: 'open-mic-stage',
    title: 'Geneva Youth Open Mic & Poetry Stage',
    category: 'OPEN_MIC',
    agenda: 'Live Spoken Word, Acoustic Beats, Standup Comedy & Stage Deliberations',
    shortCode: 'MIC-432',
    hostName: 'Stage Host MC',
    hostHandle: 'stage.mc',
    isLive: true,
    activeVotingSession: null,
    votingHistory: [],
    performersQueue: [],
    reactions: [],
    createdAt: '2026-08-29'
  },
  {
    id: 'pitch-arena',
    title: 'Climate & Sovereign AI Demo Pitch Arena',
    category: 'PITCH_STAGE',
    agenda: '3-Minute Lightning Startup Pitches with Live Jury Venture Ballots',
    shortCode: 'PITCH-26',
    hostName: 'Venture Moderator',
    hostHandle: 'venture.lead',
    isLive: true,
    activeVotingSession: null,
    votingHistory: [],
    performersQueue: [],
    reactions: [],
    createdAt: '2026-08-29'
  },
  {
    id: 'lok-sabha-2026',
    title: 'Lok Sabha (House of the People) — Special Youth Parliamentary Session',
    category: 'LOK_SABHA',
    agenda: 'National Digital Sovereignty, AI Ethics & Youth Entrepreneurship Promotion Bill',
    shortCode: 'LS-01',
    hostName: "Hon'ble Speaker of the House",
    hostHandle: 'speaker.loksabha',
    isLive: true,
    activeVotingSession: null,
    votingHistory: [],
    performersQueue: [],
    reactions: [
      { id: 'ls_1', emoji: '🇮🇳', count: 64 },
      { id: 'ls_2', emoji: '⚖️', count: 45 },
      { id: 'ls_3', emoji: '📢', count: 38 }
    ],
    createdAt: '2026-08-29'
  },
  {
    id: 'custom-chamber-other',
    title: 'Universal Youth Assembly & Multidisciplinary Forum',
    category: 'OTHER',
    agenda: 'Open Consensus Deliberation, Cross-Sector Direct Policy & Innovation',
    shortCode: 'YOUTH-99',
    hostName: 'Assembly Moderator',
    hostHandle: 'moderator.custom',
    isLive: true,
    activeVotingSession: null,
    votingHistory: [],
    performersQueue: [],
    reactions: [
      { id: 'c_1', emoji: '✨', count: 30 },
      { id: 'c_2', emoji: '💡', count: 27 }
    ],
    createdAt: '2026-08-29'
  }
];

const INITIAL_COMMITTEES: MunCommittee[] = DEFAULT_COMMITTEES;
const INITIAL_INVITES: MunInvite[] = [];
const INITIAL_SESSION_STATES: Record<string, MunSessionState> = {};

const MunContext = createContext<MunContextType | undefined>(undefined);

const LS_MUN_COMMITTEES = 'zenvitra_mun_committees_v2_clean';
const LS_MUN_INVITES = 'zenvitra_mun_invites_v2_clean';
const LS_MUN_REGISTRATIONS = 'zenvitra_mun_registrations_v2_clean';
const LS_MUN_SESSION = 'zenvitra_mun_session_v2_clean';
const LS_MUN_EXPERIENCES = 'zenvitra_mun_experiences_v2';
const LS_CHAMBER_ROOMS = 'zenvitra_chamber_rooms_v2';
const LS_CHAMBER_VOTES = 'zenvitra_chamber_votes_v2';
const LS_STAGE_PERFORMERS = 'zenvitra_stage_performers_v2';

export function MunProvider({ children }: { children: React.ReactNode }) {
  const { profile, user } = useAuth();
  const currentUserId = profile?.id || user?.id || 'delegate_node';
  const currentUserName = profile?.display_name || user?.name || 'Delegate';
  const currentUserHandle = profile?.username || 'delegate';

  const [committees, setCommittees] = useState<MunCommittee[]>(INITIAL_COMMITTEES);
  const [activeCommitteeId, setActiveCommitteeId] = useState<string>('unsc-2026');
  const [selectedInviteModal, setSelectedInviteModal] = useState<MunInvite | null>(null);

  /* Chamber Rooms */
  const [chamberRooms, setChamberRooms] = useState<ChamberRoom[]>(DEFAULT_CHAMBER_ROOMS);

  /* Live Voting Sessions */
  const [votingSessions, setVotingSessions] = useState<ChamberVotingSession[]>([]);
  const [activeVotingSession, setActiveVotingSession] = useState<ChamberVotingSession | null>(null);

  /* Stage Performers Queue */
  const [stagePerformers, setStagePerformers] = useState<StagePerformer[]>([]);

  /* Live Stage Floating Reactions */
  const [stageReactions, setStageReactions] = useState<Array<{ id: string; emoji: string; count: number; x?: number }>>([
    { id: 'r_clap', emoji: '👏', count: 52 },
    { id: 'r_fire', emoji: '🔥', count: 41 },
    { id: 'r_mic', emoji: '🎤', count: 28 },
    { id: 'r_spark', emoji: '✨', count: 25 },
    { id: 'r_zap', emoji: '⚡', count: 34 },
  ]);

  const [registrations, setRegistrations] = useState<MunRegistration[]>([]);
  const [invites, setInvites] = useState<MunInvite[]>(INITIAL_INVITES);
  const [experiences, setExperiences] = useState<MunExperienceRecord[]>([]);
  const [sessionStates, setSessionStates] = useState<Record<string, MunSessionState>>(INITIAL_SESSION_STATES);
  const [isMounted, setIsMounted] = useState<boolean>(false);

  // Load from localStorage on client mount
  useEffect(() => {
    try {
      const storedCommittees = localStorage.getItem(LS_MUN_COMMITTEES);
      if (storedCommittees) setCommittees(JSON.parse(storedCommittees));

      const storedRooms = localStorage.getItem(LS_CHAMBER_ROOMS);
      if (storedRooms) setChamberRooms(JSON.parse(storedRooms));

      const storedVotes = localStorage.getItem(LS_CHAMBER_VOTES);
      if (storedVotes) setVotingSessions(JSON.parse(storedVotes));

      const storedPerformers = localStorage.getItem(LS_STAGE_PERFORMERS);
      if (storedPerformers) setStagePerformers(JSON.parse(storedPerformers));

      const storedRegs = localStorage.getItem(LS_MUN_REGISTRATIONS);
      if (storedRegs) setRegistrations(JSON.parse(storedRegs));

      const storedInvites = localStorage.getItem(LS_MUN_INVITES);
      if (storedInvites) setInvites(JSON.parse(storedInvites));

      const storedExps = localStorage.getItem(LS_MUN_EXPERIENCES);
      if (storedExps) setExperiences(JSON.parse(storedExps));

      const storedSessions = localStorage.getItem(LS_MUN_SESSION);
      if (storedSessions) setSessionStates(JSON.parse(storedSessions));
    } catch {}
    setIsMounted(true);
  }, []);

  // Save to localStorage (only after mounted)
  useEffect(() => {
    if (!isMounted) return;
    try {
      localStorage.setItem(LS_MUN_COMMITTEES, JSON.stringify(committees));
    } catch {}
  }, [committees, isMounted]);

  useEffect(() => {
    if (!isMounted) return;
    try {
      localStorage.setItem(LS_MUN_INVITES, JSON.stringify(invites));
      broadcastActivitySync({ source: 'mun_reg', action: 'update', timestamp: Date.now() });
    } catch {}
  }, [invites, isMounted]);

  useEffect(() => {
    if (!isMounted) return;
    try {
      localStorage.setItem(LS_MUN_REGISTRATIONS, JSON.stringify(registrations));
      broadcastActivitySync({ source: 'mun_reg', action: 'register', timestamp: Date.now() });
    } catch {}
  }, [registrations, isMounted]);

  useEffect(() => {
    if (!isMounted) return;
    try {
      localStorage.setItem(LS_MUN_EXPERIENCES, JSON.stringify(experiences));
      broadcastActivitySync({ source: 'mun_reg', action: 'update', timestamp: Date.now() });
    } catch {}
  }, [experiences, isMounted]);

  useEffect(() => {
    if (!isMounted) return;
    try {
      localStorage.setItem(LS_MUN_SESSION, JSON.stringify(sessionStates));
    } catch {}
  }, [sessionStates, isMounted]);

  // Synchronized Countdown Timer Interval
  useEffect(() => {
    const timerInterval = setInterval(() => {
      setSessionStates((prev) => {
        const currentSession = prev[activeCommitteeId];
        if (!currentSession || !currentSession.timer.isRunning || currentSession.timer.remainingSeconds <= 0) {
          return prev;
        }

        const newRemaining = currentSession.timer.remainingSeconds - 1;
        const currentSpeakerTime = currentSession.currentSpeaker?.timeRemaining
          ? Math.max(0, currentSession.currentSpeaker.timeRemaining - 1)
          : undefined;

        return {
          ...prev,
          [activeCommitteeId]: {
            ...currentSession,
            timer: {
              ...currentSession.timer,
              remainingSeconds: newRemaining,
              isRunning: newRemaining > 0,
            },
            currentSpeaker: currentSession.currentSpeaker
              ? {
                  ...currentSession.currentSpeaker,
                  timeRemaining: currentSpeakerTime,
                }
              : null,
          },
        };
      });
    }, 1000);

    return () => clearInterval(timerInterval);
  }, [activeCommitteeId]);

  /* Filter invites for active user */
  const userInvites = useMemo(() => {
    return invites.filter(
      (inv) =>
        (currentUserId && inv.userId === currentUserId) ||
        (currentUserHandle && inv.userHandle === currentUserHandle)
    );
  }, [invites, currentUserId, currentUserHandle]);

  const pendingInviteCount = useMemo(() => {
    return userInvites.filter((inv) => inv.status === 'pending').length;
  }, [userInvites]);

  /* Registration Flow -> Auto-generates Secretariat Allotment Letter */
  const registerForMun = (
    eventId: string,
    eventName: string,
    committeePref: string,
    portfolioPrefs: string[],
    experience: 'beginner' | 'intermediate' | 'advanced' | 'veteran'
  ): MunRegistration => {
    const regId = `reg_${Date.now()}`;
    const newReg: MunRegistration = {
      id: regId,
      eventId,
      eventName,
      userId: currentUserId,
      userName: currentUserName,
      userHandle: currentUserHandle,
      committeePreference: committeePref,
      portfolioPreferences: portfolioPrefs,
      experienceLevel: experience,
      status: 'invite_sent',
      registeredAt: new Date().toISOString(),
    };

    // Auto-generate official allotment invitation letter from Secretariat
    const matchedCommittee =
      committees.find((c) => c.name.toLowerCase().includes(committeePref.toLowerCase()) || c.id === committeePref) ||
      committees[0];

    const chosenPortfolio = portfolioPrefs[0] || 'Delegation of France';
    const flag = chosenPortfolio.toLowerCase().includes('france')
      ? '🇫🇷'
      : chosenPortfolio.toLowerCase().includes('united states') || chosenPortfolio.toLowerCase().includes('usa')
      ? '🇺🇸'
      : chosenPortfolio.toLowerCase().includes('germany')
      ? '🇩🇪'
      : chosenPortfolio.toLowerCase().includes('india')
      ? '🇮🇳'
      : chosenPortfolio.toLowerCase().includes('japan')
      ? '🇯🇵'
      : chosenPortfolio.toLowerCase().includes('united kingdom') || chosenPortfolio.toLowerCase().includes('uk')
      ? '🇬🇧'
      : '🌐';

    const newInvite: MunInvite = {
      id: `inv_${Date.now()}`,
      registrationId: regId,
      eventId,
      eventName,
      userId: currentUserId,
      userName: currentUserName,
      userHandle: currentUserHandle,
      committeeId: matchedCommittee.id,
      committeeName: matchedCommittee.name,
      portfolio: chosenPortfolio,
      flagEmoji: flag,
      ebChair: matchedCommittee.dais.chair,
      ebViceChair: matchedCommittee.dais.viceChair,
      allotmentLetterText: `The Secretariat and Executive Board have reviewed your registration and officially ratified your credentialed allocation as ${chosenPortfolio} in the ${matchedCommittee.name}. You are requested to accept your allotment to unlock the live Delegate Node, review the Background Guide, and join session motions.`,
      status: 'pending',
      sentAt: new Date().toISOString(),
    };

    setRegistrations((prev) => [newReg, ...prev]);
    setInvites((prev) => [newInvite, ...prev]);
    setSelectedInviteModal(newInvite);

    return newReg;
  };

  /* Accept Invitation */
  const acceptMunInvite = (inviteId: string) => {
    setInvites((prev) =>
      prev.map((inv) =>
        inv.id === inviteId
          ? { ...inv, status: 'accepted', acceptedAt: new Date().toISOString() }
          : inv
      )
    );

    const inv = invites.find((i) => i.id === inviteId);
    if (inv) {
      setActiveCommitteeId(inv.committeeId);
    }
  };

  /* Decline Invitation */
  const declineMunInvite = (inviteId: string) => {
    setInvites((prev) =>
      prev.map((inv) => (inv.id === inviteId ? { ...inv, status: 'declined' } : inv))
    );
  };

  const getInviteForEvent = (eventId: string) => {
    return userInvites.find((inv) => inv.eventId === eventId);
  };

  const hasAcceptedInviteForEvent = (eventId: string) => {
    const inv = getInviteForEvent(eventId);
    return inv?.status === 'accepted';
  };

  const getCommitteeById = (id: string) => {
    return committees.find((c) => c.id === id);
  };

  const addCustomCommittee = useCallback(
    (customData: { name: string; shortName?: string; agenda: string; type?: MunCommitteeType }) => {
      const newId = `custom-preset-${Date.now()}`;
      const shortName = (customData.shortName?.trim() || customData.name.slice(0, 10).toUpperCase()).trim();
      const newCommittee: MunCommittee = {
        id: newId,
        eventId: 'evt_custom_user',
        name: customData.name.trim(),
        shortName,
        type: customData.type || 'OTHER',
        agenda: customData.agenda.trim(),
        totalDelegates: 25,
        presentCount: 20,
        presentAndVotingCount: 18,
        quorumNeeded: 13,
        dais: {
          chair: 'Session Moderator',
          viceChair: 'Deputy Rapporteur'
        }
      };

      setCommittees((prev) => {
        const updated = [...prev, newCommittee];
        try {
          localStorage.setItem(LS_MUN_COMMITTEES, JSON.stringify(updated));
        } catch {}
        return updated;
      });
      setActiveCommitteeId(newId);

      // Also create a chamber room entry so it seamlessly links everywhere
      const newRoom: ChamberRoom = {
        id: newId,
        title: customData.name.trim(),
        category: 'OTHER',
        agenda: customData.agenda.trim(),
        shortCode: shortName.slice(0, 6),
        hostName: 'Presiding Officer',
        hostHandle: 'chair.custom',
        isLive: true,
        activeVotingSession: null,
        votingHistory: [],
        performersQueue: [],
        reactions: [],
        createdAt: new Date().toISOString()
      };
      setChamberRooms((prev) => {
        const updated = [...prev, newRoom];
        try {
          localStorage.setItem(LS_CHAMBER_ROOMS, JSON.stringify(updated));
        } catch {}
        return updated;
      });

      broadcastActivitySync({ source: 'mun_reg', action: 'create', timestamp: Date.now() });
      return newCommittee;
    },
    []
  );

  const currentSessionState: MunSessionState =
    sessionStates[activeCommitteeId] || INITIAL_SESSION_STATES['unsc-2026'];

  /* Timer Controls */
  const toggleTimer = useCallback(() => {
    setSessionStates((prev) => {
      const s = prev[activeCommitteeId] || INITIAL_SESSION_STATES['unsc-2026'];
      return {
        ...prev,
        [activeCommitteeId]: {
          ...s,
          timer: {
            ...s.timer,
            isRunning: !s.timer.isRunning,
          },
        },
      };
    });
  }, [activeCommitteeId]);

  const resetTimer = useCallback(
    (totalSeconds: number, label: string, mode: MunSessionMode) => {
      setSessionStates((prev) => {
        const s = prev[activeCommitteeId] || INITIAL_SESSION_STATES['unsc-2026'];
        return {
          ...prev,
          [activeCommitteeId]: {
            ...s,
            sessionMode: mode,
            timer: {
              totalSeconds,
              remainingSeconds: totalSeconds,
              isRunning: false,
              label,
              sessionType: mode,
            },
          },
        };
      });
    },
    [activeCommitteeId]
  );

  const setTimerSeconds = useCallback(
    (remainingSeconds: number) => {
      setSessionStates((prev) => {
        const s = prev[activeCommitteeId] || INITIAL_SESSION_STATES['unsc-2026'];
        return {
          ...prev,
          [activeCommitteeId]: {
            ...s,
            timer: {
              ...s.timer,
              remainingSeconds,
            },
          },
        };
      });
    },
    [activeCommitteeId]
  );

  /* Raise Motion for Queue */
  const raiseMotion = (
    type: MotionType,
    topic: string,
    totalMinutes: number,
    individualSpeakerSeconds: number
  ): MunMotion => {
    const userAcceptedInvite = userInvites.find(
      (i) => i.committeeId === activeCommitteeId && i.status === 'accepted'
    );
    const country = userAcceptedInvite?.portfolio || 'Delegation of France';
    const flag = userAcceptedInvite?.flagEmoji || '🇫🇷';

    const newMotion: MunMotion = {
      id: `mot_${Date.now()}`,
      committeeId: activeCommitteeId,
      proposedBy: {
        userId: currentUserId,
        userName: currentUserName,
        country: country.replace('Delegation of ', '').replace('Delegate of ', ''),
        portfolio: country,
        flagEmoji: flag,
      },
      type,
      topic,
      totalMinutes,
      individualSpeakerSeconds,
      status: 'queued',
      votesFor: 1,
      votesAgainst: 0,
      createdAt: new Date().toISOString(),
    };

    setSessionStates((prev) => {
      const s = prev[activeCommitteeId] || INITIAL_SESSION_STATES['unsc-2026'];
      return {
        ...prev,
        [activeCommitteeId]: {
          ...s,
          motionsQueue: [newMotion, ...s.motionsQueue],
        },
      };
    });

    return newMotion;
  };

  /* Start Running a Motion */
  const startMotion = (motionId: string) => {
    setSessionStates((prev) => {
      const s = prev[activeCommitteeId] || INITIAL_SESSION_STATES['unsc-2026'];
      const targetMotion = s.motionsQueue.find((m) => m.id === motionId);
      if (!targetMotion) return prev;

      const totalSec = targetMotion.totalMinutes * 60;
      const mode: MunSessionMode =
        targetMotion.type === 'MODERATED_CAUCUS'
          ? 'MOD_CAUCUS'
          : targetMotion.type === 'UNMODERATED_CAUCUS'
          ? 'UNMOD_CAUCUS'
          : 'GSL';

      return {
        ...prev,
        [activeCommitteeId]: {
          ...s,
          sessionMode: mode,
          currentMotion: { ...targetMotion, status: 'active' },
          motionsQueue: s.motionsQueue.filter((m) => m.id !== motionId),
          timer: {
            totalSeconds: totalSec,
            remainingSeconds: totalSec,
            isRunning: true,
            label: `${targetMotion.type.replace('_', ' ')}: ${targetMotion.topic}`,
            sessionType: mode,
          },
        },
      };
    });
  };

  /* Vote on Motion */
  const voteOnMotion = (motionId: string, vote: 'for' | 'against') => {
    setSessionStates((prev) => {
      const s = prev[activeCommitteeId] || INITIAL_SESSION_STATES['unsc-2026'];
      return {
        ...prev,
        [activeCommitteeId]: {
          ...s,
          motionsQueue: s.motionsQueue.map((m) => {
            if (m.id !== motionId) return m;
            return {
              ...m,
              votesFor: vote === 'for' ? m.votesFor + 1 : m.votesFor,
              votesAgainst: vote === 'against' ? m.votesAgainst + 1 : m.votesAgainst,
            };
          }),
        },
      };
    });
  };

  const withdrawMotion = (motionId: string) => {
    setSessionStates((prev) => {
      const s = prev[activeCommitteeId] || INITIAL_SESSION_STATES['unsc-2026'];
      return {
        ...prev,
        [activeCommitteeId]: {
          ...s,
          motionsQueue: s.motionsQueue.filter((m) => m.id !== motionId),
        },
      };
    });
  };

  /* Speakers List Controls */
  const joinSpeakersList = (customPortfolio?: string) => {
    const userAcceptedInvite = userInvites.find(
      (i) => i.committeeId === activeCommitteeId && i.status === 'accepted'
    );
    const country = customPortfolio || userAcceptedInvite?.portfolio || 'Delegation of France (You)';
    const flag = userAcceptedInvite?.flagEmoji || '🇫🇷';

    const newSpeaker: MunSpeaker = {
      id: `spk_${Date.now()}`,
      country: country.replace('Delegation of ', '').replace('Delegate of ', ''),
      portfolio: country,
      delegateName: currentUserName,
      flagEmoji: flag,
      status: 'queued',
    };

    setSessionStates((prev) => {
      const s = prev[activeCommitteeId] || INITIAL_SESSION_STATES['unsc-2026'];
      // avoid duplicates
      if (s.speakersList.some((sp) => sp.delegateName === currentUserName)) return prev;

      return {
        ...prev,
        [activeCommitteeId]: {
          ...s,
          speakersList: [...s.speakersList, newSpeaker],
        },
      };
    });
  };

  const advanceSpeaker = () => {
    setSessionStates((prev) => {
      const s = prev[activeCommitteeId] || INITIAL_SESSION_STATES['unsc-2026'];
      if (s.speakersList.length === 0) return prev;

      const [nextSpeaker, ...remaining] = s.speakersList;
      const speakerTime = s.currentMotion?.individualSpeakerSeconds || 60;

      return {
        ...prev,
        [activeCommitteeId]: {
          ...s,
          currentSpeaker: {
            ...nextSpeaker,
            status: 'speaking',
            timeRemaining: speakerTime,
          },
          speakersList: remaining,
        },
      };
    });
  };

  const yieldSpeakerTime = (type: 'chair' | 'points_of_info' | 'another_delegate') => {
    setSessionStates((prev) => {
      const s = prev[activeCommitteeId] || INITIAL_SESSION_STATES['unsc-2026'];
      if (!s.currentSpeaker) return prev;

      return {
        ...prev,
        [activeCommitteeId]: {
          ...s,
          currentSpeaker: {
            ...s.currentSpeaker,
            status: 'yielded',
            yieldType: type,
            timeRemaining: 0,
          },
        },
      };
    });
  };

  /* Parliamentary Points */
  const raiseParliamentaryPoint = (type: PointType, detail: string) => {
    const userAcceptedInvite = userInvites.find(
      (i) => i.committeeId === activeCommitteeId && i.status === 'accepted'
    );
    const country = userAcceptedInvite?.portfolio || 'Delegation of France';
    const flag = userAcceptedInvite?.flagEmoji || '🇫🇷';

    const newPoint: MunParliamentaryPoint = {
      id: `pt_${Date.now()}`,
      committeeId: activeCommitteeId,
      delegateName: currentUserName,
      country: country.replace('Delegation of ', '').replace('Delegate of ', ''),
      flagEmoji: flag,
      type,
      detail,
      status: 'pending',
      timestamp: new Date().toISOString(),
    };

    setSessionStates((prev) => {
      const s = prev[activeCommitteeId] || INITIAL_SESSION_STATES['unsc-2026'];
      return {
        ...prev,
        [activeCommitteeId]: {
          ...s,
          parliamentaryPoints: [newPoint, ...s.parliamentaryPoints],
        },
      };
    });
  };

  const dismissPoint = (pointId: string) => {
    setSessionStates((prev) => {
      const s = prev[activeCommitteeId] || INITIAL_SESSION_STATES['unsc-2026'];
      return {
        ...prev,
        [activeCommitteeId]: {
          ...s,
          parliamentaryPoints: s.parliamentaryPoints.filter((p) => p.id !== pointId),
        },
      };
    });
  };

  /* Draft Resolutions */
  const sponsorResolution = (resId: string) => {
    const userAcceptedInvite = userInvites.find(
      (i) => i.committeeId === activeCommitteeId && i.status === 'accepted'
    );
    const country = userAcceptedInvite?.portfolio ? userAcceptedInvite.portfolio.replace('Delegation of ', '').replace('Delegate of ', '') : 'France';

    setSessionStates((prev) => {
      const s = prev[activeCommitteeId] || INITIAL_SESSION_STATES['unsc-2026'];
      return {
        ...prev,
        [activeCommitteeId]: {
          ...s,
          resolutions: s.resolutions.map((res) => {
            if (res.id !== resId) return res;
            if (res.sponsors.includes(country)) return res;
            return {
              ...res,
              sponsors: [...res.sponsors, country],
            };
          }),
        },
      };
    });
  };

  const signResolution = (resId: string) => {
    const userAcceptedInvite = userInvites.find(
      (i) => i.committeeId === activeCommitteeId && i.status === 'accepted'
    );
    const country = userAcceptedInvite?.portfolio ? userAcceptedInvite.portfolio.replace('Delegation of ', '').replace('Delegate of ', '') : 'France';

    setSessionStates((prev) => {
      const s = prev[activeCommitteeId] || INITIAL_SESSION_STATES['unsc-2026'];
      return {
        ...prev,
        [activeCommitteeId]: {
          ...s,
          resolutions: s.resolutions.map((res) => {
            if (res.id !== resId) return res;
            if (res.signatories.includes(country)) return res;
            return {
              ...res,
              signatories: [...res.signatories, country],
            };
          }),
        },
      };
    });
  };

  const createDraftResolution = (
    code: string,
    title: string,
    preambles: string[],
    operatives: string[]
  ) => {
    const userAcceptedInvite = userInvites.find(
      (i) => i.committeeId === activeCommitteeId && i.status === 'accepted'
    );
    const country = userAcceptedInvite?.portfolio ? userAcceptedInvite.portfolio.replace('Delegation of ', '').replace('Delegate of ', '') : 'France';

    const newRes: MunDraftResolution = {
      id: `dr_${Date.now()}`,
      committeeId: activeCommitteeId,
      code,
      title,
      sponsors: [country],
      signatories: [],
      preambulatoryClauses: preambles,
      operativeClauses: operatives,
      status: 'drafting',
      introducedAt: new Date().toISOString(),
    };

    setSessionStates((prev) => {
      const s = prev[activeCommitteeId] || INITIAL_SESSION_STATES['unsc-2026'];
      return {
        ...prev,
        [activeCommitteeId]: {
          ...s,
          resolutions: [newRes, ...s.resolutions],
        },
      };
    });
  };

  /* ─────────── DELEGATE EXPERIENCES & VERIFICATION METHODS ─────────── */

  const addExperience = useCallback((data: Omit<MunExperienceRecord, 'id' | 'userId' | 'userHandle' | 'createdAt'>): MunExperienceRecord => {
    const newExp: MunExperienceRecord = {
      ...data,
      id: `exp_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`,
      userId: currentUserId,
      userHandle: currentUserHandle,
      createdAt: new Date().toISOString(),
      verifiedAt: data.verificationStatus.startsWith('VERIFIED') ? new Date().toISOString() : undefined,
    };

    setExperiences((prev) => [newExp, ...prev]);
    broadcastActivitySync({ source: 'mun_reg', action: 'create', timestamp: Date.now() });
    return newExp;
  }, [currentUserId, currentUserHandle]);

  const verifyExperience = useCallback((id: string, proofUrl?: string, certificateId?: string) => {
    setExperiences((prev) => prev.map((exp) => {
      if (exp.id !== id) return exp;
      return {
        ...exp,
        verificationStatus: 'VERIFIED_CERTIFICATE',
        verificationProofUrl: proofUrl || exp.verificationProofUrl,
        certificateId: certificateId || exp.certificateId,
        verifiedAt: new Date().toISOString(),
      };
    }));
    broadcastActivitySync({ source: 'mun_reg', action: 'update', timestamp: Date.now() });
  }, []);

  const deleteExperience = useCallback((id: string) => {
    setExperiences((prev) => prev.filter((exp) => exp.id !== id));
    broadcastActivitySync({ source: 'mun_reg', action: 'delete', timestamp: Date.now() });
  }, []);

  const getUserExperiences = useCallback((userIdOrHandle?: string) => {
    const target = userIdOrHandle || currentUserHandle || currentUserId;
    return experiences.filter((e) => e.userHandle === target || e.userId === target || target === 'you');
  }, [experiences, currentUserId, currentUserHandle]);

  /* ─────────── LIVE CHAMBER VOTING & MULTI-STAGE ENGINE ─────────── */

  // Sync to localStorage
  useEffect(() => {
    try {
      localStorage.setItem(LS_CHAMBER_ROOMS, JSON.stringify(chamberRooms));
    } catch {}
  }, [chamberRooms]);

  useEffect(() => {
    try {
      localStorage.setItem(LS_CHAMBER_VOTES, JSON.stringify(votingSessions));
    } catch {}
  }, [votingSessions]);

  useEffect(() => {
    try {
      localStorage.setItem(LS_STAGE_PERFORMERS, JSON.stringify(stagePerformers));
    } catch {}
  }, [stagePerformers]);

  const createChamberRoom = useCallback((title: string, category: ChamberCategory, agenda: string): ChamberRoom => {
    const newRoomId = `room_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`;
    const newRoom: ChamberRoom = {
      id: newRoomId,
      title: title.trim(),
      category,
      agenda: agenda.trim(),
      shortCode: category === 'MUN_COMMITTEE' ? 'MUN' : category === 'OPEN_MIC' ? 'STAGE' : category === 'PITCH_STAGE' ? 'PITCH' : 'POLL',
      hostName: currentUserName,
      hostHandle: currentUserHandle,
      isLive: true,
      activeVotingSession: null,
      votingHistory: [],
      performersQueue: [],
      reactions: [
        { id: 'r1', emoji: '👏', count: 12 },
        { id: 'r2', emoji: '🔥', count: 8 },
        { id: 'r3', emoji: '⚡', count: 5 },
      ],
      createdAt: new Date().toISOString(),
    };

    // Also register as a committee if it's MUN or Stage
    const newCommittee: MunCommittee = {
      id: newRoomId,
      eventId: 'evt_chamber_live',
      name: title.trim(),
      shortName: newRoom.shortCode,
      agenda: agenda.trim(),
      type: category === 'MUN_COMMITTEE' ? 'DISEC' : category === 'OPEN_MIC' ? 'CRISIS' : 'ECOSOC',
      totalDelegates: 30,
      presentCount: 20,
      presentAndVotingCount: 18,
      quorumNeeded: 10,
      dais: { chair: currentUserName, viceChair: 'Co-Host / Rapporteur' },
    };

    setChamberRooms((prev) => [newRoom, ...prev]);
    setCommittees((prev) => [newCommittee, ...prev]);
    setActiveCommitteeId(newRoomId);
    broadcastActivitySync({ source: 'mun_reg', action: 'create', timestamp: Date.now() });
    return newRoom;
  }, [currentUserName, currentUserHandle]);

  const updateCommitteeDetails = useCallback((
    id: string,
    data: Partial<Pick<MunCommittee, 'name' | 'shortName' | 'type' | 'agenda' | 'totalDelegates'>>
  ) => {
    setCommittees((prev) => {
      const updated = prev.map((c) => (c.id === id ? { ...c, ...data } : c));
      try {
        localStorage.setItem(LS_MUN_COMMITTEES, JSON.stringify(updated));
      } catch {}
      return updated;
    });

    setChamberRooms((prev) => {
      const updated = prev.map((r) =>
        r.id === id
          ? {
              ...r,
              title: data.name || r.title,
              agenda: data.agenda || r.agenda,
              category: (data.type as any) || r.category,
            }
          : r
      );
      try {
        localStorage.setItem(LS_CHAMBER_ROOMS, JSON.stringify(updated));
      } catch {}
      return updated;
    });

    broadcastActivitySync({ source: 'mun_reg', action: 'update', timestamp: Date.now() });
  }, []);

  const launchVotingSession = useCallback((params: {
    title: string;
    description?: string;
    category: VotingSessionType;
    ruleMode: VotingRuleMode;
    durationSeconds: number;
    options: Array<{ label: string; sublabel?: string }>;
    performerTarget?: { id: string; name: string; actTitle: string };
  }): ChamberVotingSession => {
    const newSession: ChamberVotingSession = {
      id: `vote_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`,
      chamberId: activeCommitteeId || 'unsc-2026',
      title: params.title,
      description: params.description,
      category: params.category,
      ruleMode: params.ruleMode,
      status: 'active',
      startedAt: new Date().toISOString(),
      durationSeconds: params.durationSeconds || 60,
      remainingSeconds: params.durationSeconds || 60,
      options: params.options.map((opt, i) => ({
        id: `opt_${i + 1}`,
        label: opt.label,
        sublabel: opt.sublabel,
        votes: 0,
        voterHandles: [],
      })),
      rollCallVotes: {},
      ratings: [],
      totalBallots: 0,
      quorumMet: true,
      performerTarget: params.performerTarget,
    };

    setActiveVotingSession(newSession);
    setVotingSessions((prev) => [newSession, ...prev]);
    broadcastActivitySync({ source: 'mun_reg', action: 'create', timestamp: Date.now() });
    return newSession;
  }, [activeCommitteeId]);

  const castChamberVote = useCallback((sessionId: string, optionId: string) => {
    setActiveVotingSession((prev) => {
      if (!prev || prev.id !== sessionId || prev.status !== 'active') return prev;

      // check if user already voted
      const alreadyVoted = prev.options.some((o) => o.voterHandles.includes(currentUserHandle));
      if (alreadyVoted) return prev;

      const updatedOptions = prev.options.map((opt) => {
        if (opt.id === optionId) {
          return {
            ...opt,
            votes: opt.votes + 1,
            voterHandles: [...opt.voterHandles, currentUserHandle],
          };
        }
        return opt;
      });

      const total = prev.totalBallots + 1;
      const topOption = [...updatedOptions].sort((a, b) => b.votes - a.votes)[0];
      const updated: ChamberVotingSession = {
        ...prev,
        options: updatedOptions,
        totalBallots: total,
        passed: topOption ? topOption.votes > total / 2 : false,
        resultSummary: topOption ? `Leading Option: ${topOption.label} (${topOption.votes}/${total} votes)` : undefined,
      };

      setVotingSessions((all) => all.map((v) => (v.id === sessionId ? updated : v)));
      return updated;
    });
  }, [currentUserHandle]);

  const castRollCallVote = useCallback((
    sessionId: string,
    vote: 'yes' | 'no' | 'abstain' | 'pass',
    countryName?: string,
    isVetoPower?: boolean
  ) => {
    setActiveVotingSession((prev) => {
      if (!prev || prev.id !== sessionId || prev.status !== 'active') return prev;

      const country = countryName || 'Delegation of ' + (currentUserHandle || 'Delegate');
      const isP5 = isVetoPower ?? ['United States', 'China', 'Russia', 'France', 'United Kingdom'].some((p) => country.includes(p));

      const newRollCall: ChamberRollCallVote = {
        country,
        delegateName: currentUserName,
        userHandle: currentUserHandle,
        flagEmoji: '🌐',
        vote,
        isVetoPower: isP5,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      };

      const updatedRollCalls = {
        ...(prev.rollCallVotes || {}),
        [currentUserHandle]: newRollCall,
      };

      const totalYes = Object.values(updatedRollCalls).filter((v) => v.vote === 'yes').length;
      const totalNo = Object.values(updatedRollCalls).filter((v) => v.vote === 'no').length;
      const hasVeto = Object.values(updatedRollCalls).some((v) => v.isVetoPower && v.vote === 'no');

      const updated: ChamberVotingSession = {
        ...prev,
        rollCallVotes: updatedRollCalls,
        totalBallots: Object.keys(updatedRollCalls).length,
        vetoTriggered: hasVeto,
        passed: !hasVeto && totalYes > totalNo,
        resultSummary: hasVeto
          ? '❌ VETO TRIGGERED: Resolution Vetoed by Permanent Member'
          : totalYes > totalNo
          ? `✅ PASSED (${totalYes} Yes, ${totalNo} No)`
          : `❌ FAILED (${totalYes} Yes, ${totalNo} No)`,
      };

      setVotingSessions((all) => all.map((v) => (v.id === sessionId ? updated : v)));
      return updated;
    });
  }, [currentUserName, currentUserHandle]);

  const ratePerformer = useCallback((sessionId: string, score: number, feedback?: string) => {
    setActiveVotingSession((prev) => {
      if (!prev || prev.id !== sessionId || prev.status !== 'active') return prev;

      const existingRating = prev.ratings?.find((r) => r.userHandle === currentUserHandle);
      const newRating: ChamberRatingEntry = {
        userId: currentUserId,
        userHandle: currentUserHandle,
        score,
        feedback,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      };

      const updatedRatings = existingRating
        ? (prev.ratings || []).map((r) => (r.userHandle === currentUserHandle ? newRating : r))
        : [...(prev.ratings || []), newRating];

      const avg = updatedRatings.reduce((acc, curr) => acc + curr.score, 0) / updatedRatings.length;

      const updated: ChamberVotingSession = {
        ...prev,
        ratings: updatedRatings,
        totalBallots: updatedRatings.length,
        resultSummary: `Average Score: ${avg.toFixed(1)} / 10.0 (${updatedRatings.length} attendees & judges scored)`,
      };

      // Also update performer score in stage performers
      if (prev.performerTarget?.id) {
        setStagePerformers((queue) =>
          queue.map((p) =>
            p.id === prev.performerTarget?.id
              ? { ...p, scores: updatedRatings, averageScore: Number(avg.toFixed(1)), totalVotes: updatedRatings.length }
              : p
          )
        );
      }

      setVotingSessions((all) => all.map((v) => (v.id === sessionId ? updated : v)));
      return updated;
    });
  }, [currentUserId, currentUserHandle]);

  const closeVotingSession = useCallback((sessionId: string) => {
    setActiveVotingSession((prev) => {
      if (!prev || prev.id !== sessionId) return null;
      const closed: ChamberVotingSession = {
        ...prev,
        status: 'closed',
        remainingSeconds: 0,
      };
      setVotingSessions((all) => all.map((v) => (v.id === sessionId ? closed : v)));
      return closed;
    });
  }, []);

  const addStagePerformer = useCallback((
    performerName: string,
    actTitle: string,
    genre: StagePerformer['genre'],
    durationMinutes: number
  ) => {
    const newPerformer: StagePerformer = {
      id: `perf_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`,
      chamberId: activeCommitteeId || 'open-mic-stage',
      performerName: performerName.trim() || currentUserName,
      userHandle: currentUserHandle,
      actTitle: actTitle.trim(),
      genre,
      status: 'queued',
      durationMinutes: durationMinutes || 4,
      scores: [],
      totalVotes: 0,
      joinedAt: 'Just now',
    };

    setStagePerformers((prev) => [...prev, newPerformer]);
    broadcastActivitySync({ source: 'mun_reg', action: 'create', timestamp: Date.now() });
  }, [activeCommitteeId, currentUserName, currentUserHandle]);

  const advanceStagePerformer = useCallback(() => {
    setStagePerformers((prev) => {
      if (prev.length === 0) return prev;
      const currentIdx = prev.findIndex((p) => p.status === 'on_stage');
      if (currentIdx === -1) {
        return prev.map((p, idx) => (idx === 0 ? { ...p, status: 'on_stage' } : p));
      }
      return prev.map((p, idx) => {
        if (idx === currentIdx) return { ...p, status: 'completed' };
        if (idx === currentIdx + 1) return { ...p, status: 'on_stage' };
        return p;
      });
    });
  }, []);

  const triggerStageReaction = useCallback((emoji: string) => {
    setStageReactions((prev) => {
      const existing = prev.find((r) => r.emoji === emoji);
      if (existing) {
        return prev.map((r) => (r.emoji === emoji ? { ...r, count: r.count + 1 } : r));
      }
      return [...prev, { id: `r_${Date.now()}`, emoji, count: 1 }];
    });
  }, []);

  const DEFAULT_SESSION_STATE: MunSessionState = {
    committeeId: activeCommitteeId || 'general-assembly',
    sessionNumber: 1,
    status: 'in_session',
    sessionMode: 'GSL',
    timer: {
      totalSeconds: 90,
      remainingSeconds: 90,
      isRunning: false,
      label: 'General Speakers List (GSL)',
      sessionType: 'GSL',
    },
    currentSpeaker: null,
    currentMotion: null,
    motionsQueue: [],
    speakersList: [],
    parliamentaryPoints: [],
    resolutions: [],
  };

  const activeSessionSnapshot = (activeCommitteeId && sessionStates[activeCommitteeId]) || DEFAULT_SESSION_STATE;

  return (
    <MunContext.Provider
      value={{
        registrations,
        invites,
        userInvites,
        pendingInviteCount,
        selectedInviteModal,
        setSelectedInviteModal,
        registerForMun,
        acceptMunInvite,
        declineMunInvite,
        getInviteForEvent,
        hasAcceptedInviteForEvent,
        experiences,
        addExperience,
        verifyExperience,
        deleteExperience,
        getUserExperiences,
        committees,
        getCommitteeById,
        activeCommitteeId,
        setActiveCommitteeId,
        updateCommitteeDetails,
        addCustomCommittee,
        sessionState: activeSessionSnapshot,
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
        chamberRooms,
        createChamberRoom,
        activeVotingSession,
        votingSessions,
        launchVotingSession,
        castChamberVote,
        castRollCallVote,
        ratePerformer,
        closeVotingSession,
        stagePerformers,
        addStagePerformer,
        advanceStagePerformer,
        triggerStageReaction,
        stageReactions,
      }}
    >
      {children}
    </MunContext.Provider>
  );
}

export const useMun = () => {
  const context = useContext(MunContext);
  if (!context) {
    throw new Error('useMun must be used within a MunProvider');
  }
  return context;
};
