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
  ChamberRoom,
  MunConference,
  MunConferenceStatus,
  EmergencyBroadcast
} from '@/types/mun';
import { RegistrationPlan } from '@/types/events';
import { broadcastActivitySync } from '@/lib/reactiveActivityHub';
import { computeConferenceStatus } from '@/lib/conferenceStatusHelper';
import { generatePortfoliosForCommittee } from '@/lib/matrixPortfoliosData';

interface MunContextType {
  /* Conferences & Multi-MUN Day Engine */
  conferences: MunConference[];
  activeConferenceId: string;
  activeConference?: MunConference;
  setActiveConferenceId: (id: string) => void;
  createConference: (data: {
    name: string;
    shortName?: string;
    tagline?: string;
    startDate: string;
    endDate: string;
    status?: MunConferenceStatus;
    location?: string;
    secretariatChair?: string;
    ticketPrice?: number;
    plans?: RegistrationPlan[];
    committees?: Array<{
      id?: string;
      name: string;
      shortName: string;
      type: MunCommitteeType;
      agenda: string;
      totalDelegates?: number;
    }>;
  }) => MunConference;
  deleteConference: (confId: string) => void;
  updateConference: (confId: string, data: Partial<MunConference>) => void;
  updateConferenceMatrix: (confId: string, matrix: any[]) => void;
  setConferenceStatus: (confId: string, status: MunConferenceStatus) => void;
  setConferenceDay: (confId: string, day: number) => void;
  setConferenceTotalDays: (confId: string, totalDays: number) => void;
  addConferenceDay: (confId: string) => void;
  advanceConferenceDay: (confId: string) => void;
  concludeConference: (confId: string) => void;
  currentConferenceDay: number;
  passAndArchiveBill: (bill: { title: string; code?: string; sponsors?: string[]; fullText?: string; clauses?: any[] }) => void;
  setCommitteeWinners: (committeeId: string, winners: NonNullable<MunSessionState['winnersSummary']>) => void;
  addCustomAward: (committeeId: string, award: { title: string; recipientPortfolio: string; delegateName: string; citation?: string }) => void;
  removeCustomAward: (committeeId: string, awardId: string) => void;

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
  updateCommitteeDetails: (
    id: string,
    data: Partial<Pick<MunCommittee, 'name' | 'shortName' | 'type' | 'agenda' | 'totalDelegates' | 'presentCount' | 'presentAndVotingCount' | 'quorumNeeded'>>
  ) => void;
  addCustomCommittee: (customData: { 
    name: string; 
    shortName?: string; 
    agenda: string; 
    type?: MunCommitteeType; 
    totalDelegates?: number;
    emblem?: string;
    logoKey?: string;
    iconUrl?: string;
    dais?: { chair: string; viceChair: string; rapporteur?: string };
  }) => MunCommittee;
  deleteCommittee: (committeeId: string) => void;
  clearFloorSession: (committeeId: string) => void;
  addSpeakerToQueue: (portfolio: string, delegateName?: string) => void;
  removeSpeakerFromQueue: (speakerId: string) => void;
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

  /* ─────────── EMERGENCY PROTOCOL BROADCAST DISPATCHER ─────────── */
  activeBroadcast: EmergencyBroadcast | null;
  broadcastHistory: EmergencyBroadcast[];
  transmitBroadcast: (broadcast: Omit<EmergencyBroadcast, 'id' | 'timestamp' | 'isActive'>) => EmergencyBroadcast;
  dismissBroadcast: (broadcastId?: string) => void;
}

/* ─────────── LIVE ZERO-SEEDED PLATFORM DATA ─────────── */

export const DEFAULT_CONFERENCES: MunConference[] = [];
export const DEFAULT_COMMITTEES: MunCommittee[] = [];
const DEFAULT_CHAMBER_ROOMS: ChamberRoom[] = [];

export function eventToMunConference(event: any): MunConference {
  const startDate = event.date ? String(event.date).split('T')[0] : new Date().toISOString().split('T')[0];
  const endDate = event.endDate ? String(event.endDate).split('T')[0] : startDate;
  const statusInfo = computeConferenceStatus({ startDate, endDate });
  const id = event.slug || event.id;
  const name = event.title || 'Platform Event';
  const shortName = name.slice(0, 14).toUpperCase();

  return {
    id,
    name,
    shortName,
    tagline: event.description || 'Sovereign Multilateral Assembly, Summit & Committees',
    startDate,
    endDate,
    status: statusInfo.status,
    currentDay: statusInfo.currentDay,
    totalDays: statusInfo.totalDays,
    conveningDate: `${startDate}T09:00:00.000Z`,
    secretariatChair: event.organizerName || 'Executive Secretariat',
    location: event.location || 'Plenary Enclave',
    committees: [`${id}-chamber-1`],
  };
}

export function createEmptySessionState(committeeId: string): MunSessionState {
  return {
    committeeId,
    sessionNumber: 1,
    status: 'in_session',
    sessionMode: 'GSL',
    timer: {
      totalSeconds: 90,
      remainingSeconds: 90,
      isRunning: false,
      label: 'GSL (General Speakers List)',
      sessionType: 'GSL',
    },
    currentSpeaker: null,
    currentMotion: null,
    motionsQueue: [],
    speakersList: [],
    parliamentaryPoints: [],
    resolutions: [],
    motionHistory: [],
    speakerHistory: [],
    passedBills: [],
  };
}

const INITIAL_COMMITTEES: MunCommittee[] = DEFAULT_COMMITTEES;
const INITIAL_INVITES: MunInvite[] = [];
const INITIAL_SESSION_STATES: Record<string, MunSessionState> = {};

const MunContext = createContext<MunContextType | undefined>(undefined);

const LS_MUN_COMMITTEES = 'zenvitra_mun_committees_v3_clean';
const LS_MUN_INVITES = 'zenvitra_mun_invites_v3_clean';
const LS_MUN_REGISTRATIONS = 'zenvitra_mun_registrations_v3_clean';
const LS_MUN_SESSION = 'zenvitra_mun_session_v3_clean';
const LS_MUN_EXPERIENCES = 'zenvitra_mun_experiences_v3_clean';
const LS_CHAMBER_ROOMS = 'zenvitra_chamber_rooms_v3_clean';
const LS_CHAMBER_VOTES = 'zenvitra_chamber_votes_v3_clean';
const LS_STAGE_PERFORMERS = 'zenvitra_stage_performers_v3_clean';
const LS_MUN_CONFERENCES = 'zenvitra_mun_conferences_v3_clean';
const LS_ACTIVE_CONFERENCE = 'zenvitra_mun_active_conference_v3_clean';
const LS_ACTIVE_COMMITTEE = 'zenvitra_mun_active_committee_v3_clean';
const LS_ACTIVE_BROADCAST = 'zenvitra_active_mun_broadcast_v1';
const LS_BROADCAST_HISTORY = 'zenvitra_mun_broadcast_history_v1';

export function MunProvider({ children }: { children: React.ReactNode }) {
  const { profile, user } = useAuth();
  const currentUserId = profile?.id || user?.id || 'delegate_node';
  const currentUserName = profile?.display_name || user?.name || 'Delegate';
  const currentUserHandle = profile?.username || 'delegate';

  /* Emergency Protocol Broadcast Engine */
  const [activeBroadcast, setActiveBroadcast] = useState<EmergencyBroadcast | null>(null);
  const [broadcastHistory, setBroadcastHistory] = useState<EmergencyBroadcast[]>([]);

  /* Conferences & Multi-MUN Day Engine */
  const [conferences, setConferences] = useState<MunConference[]>(DEFAULT_CONFERENCES);
  const [activeConferenceId, setActiveConferenceIdState] = useState<string>('');

  const [committees, setCommittees] = useState<MunCommittee[]>(INITIAL_COMMITTEES);
  const [activeCommitteeId, setActiveCommitteeIdState] = useState<string>('');
  const [selectedInviteModal, setSelectedInviteModal] = useState<MunInvite | null>(null);

  const setActiveCommitteeId = useCallback((id: string) => {
    setActiveCommitteeIdState(id);
    try {
      if (id) {
        localStorage.setItem(LS_ACTIVE_COMMITTEE, id);
      } else {
        localStorage.removeItem(LS_ACTIVE_COMMITTEE);
      }
    } catch {}
  }, []);

  const activeConference = useMemo(() => {
    const raw = conferences.find((c) => c.id === activeConferenceId) || conferences[0];
    if (!raw) return undefined;
    const info = computeConferenceStatus(raw);
    const effectiveStatus = (raw.status && (raw.status.startsWith('DAY_') || raw.status === 'IN_SESSION')) ? raw.status : info.status;
    return {
      ...raw,
      status: effectiveStatus,
      currentDay: effectiveStatus.startsWith('DAY_') ? (parseInt(effectiveStatus.replace('DAY_', ''), 10) || info.currentDay || 1) : info.currentDay,
      totalDays: info.totalDays,
    };
  }, [conferences, activeConferenceId]);

  const currentConferenceDay: number = useMemo(() => {
    if (!activeConference) return 0;
    const info = computeConferenceStatus(activeConference);
    return info.currentDay;
  }, [activeConference]);

  const setActiveConferenceId = useCallback((id: string) => {
    setActiveConferenceIdState(id);
    try {
      localStorage.setItem(LS_ACTIVE_CONFERENCE, id);
    } catch {}
    const conf = conferences.find((c) => c.id === id);
    if (conf && conf.committees.length > 0) {
      const firstComm = conf.committees[0];
      const commId = typeof firstComm === 'string' ? firstComm : firstComm?.id;
      if (commId) setActiveCommitteeId(commId);
    }
  }, [conferences, setActiveCommitteeId]);

  const createConference = useCallback((data: {
    name: string;
    shortName?: string;
    tagline?: string;
    startDate: string;
    endDate: string;
    status?: MunConferenceStatus;
    location?: string;
    secretariatChair?: string;
    ticketPrice?: number;
    plans?: RegistrationPlan[];
    committees?: Array<{
      id?: string;
      name: string;
      shortName: string;
      type: MunCommitteeType;
      agenda: string;
      totalDelegates?: number;
    }>;
  }) => {
    const cleanName = data.name.trim();
    const slug = cleanName
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/(^-|-$)/g, '') || `mun-${Date.now()}`;
    const id = slug;
    const shortName = data.shortName?.trim() || cleanName.slice(0, 14).toUpperCase();

    const statusInfo = computeConferenceStatus({ startDate: data.startDate, endDate: data.endDate, status: data.status });
    const finalStatus = data.status || statusInfo.status;
    const finalCurrentDay = finalStatus.startsWith('DAY_') ? (parseInt(finalStatus.replace('DAY_', ''), 10) || 1) : statusInfo.currentDay;

    const createdCommitteeIds: string[] = [];
    const newCommittees: MunCommittee[] = [];
    const allPortfolios: any[] = [];

    const rawCommittees = data.committees || [];

    rawCommittees.forEach((c, idx) => {
      const commId = c.id || `${id}-${c.shortName.toLowerCase()}-${idx + 1}`;
      createdCommitteeIds.push(commId);
      newCommittees.push({
        id: commId,
        eventId: id,
        name: c.name,
        shortName: c.shortName,
        agenda: c.agenda,
        type: c.type,
        totalDelegates: c.totalDelegates || 20,
        presentCount: 0,
        presentAndVotingCount: 0,
        quorumNeeded: Math.ceil((c.totalDelegates || 20) / 2),
        dais: { chair: 'Presiding Officer', viceChair: 'Rapporteur' },
      });

      const portfolios = generatePortfoliosForCommittee(c.shortName, c.name, c.type, id);
      allPortfolios.push(...portfolios);
    });

    const newConf: MunConference = {
      id,
      name: cleanName,
      shortName,
      tagline: data.tagline?.trim() || 'Sovereign Youth Diplomacy & Parliamentary Chambers',
      startDate: data.startDate,
      endDate: data.endDate,
      status: finalStatus,
      currentDay: finalCurrentDay,
      totalDays: statusInfo.totalDays,
      conveningDate: `${data.startDate}T09:00:00.000Z`,
      secretariatChair: data.secretariatChair?.trim() || currentUserName || 'Executive Secretariat',
      location: data.location?.trim() || 'Digital Plenary Enclave',
      committees: createdCommitteeIds,
      matrix: allPortfolios,
      plans: data.plans,
    };

    setCommittees((prev) => {
      const existingIds = new Set(prev.map((c) => c.id));
      const filteredNew = newCommittees.filter((c) => !existingIds.has(c.id));
      const updatedPrev = prev.map((c) => {
        const matching = newCommittees.find((nc) => nc.id === c.id);
        return matching ? { ...c, eventId: id } : c;
      });
      const updated = [...updatedPrev, ...filteredNew];
      try {
        localStorage.setItem(LS_MUN_COMMITTEES, JSON.stringify(updated));
      } catch {}
      return updated;
    });
    setConferences((prev) => {
      const updated = [newConf, ...prev.filter((c) => c.id !== id)];
      try {
        localStorage.setItem(LS_MUN_CONFERENCES, JSON.stringify(updated));
      } catch {}
      return updated;
    });

    setActiveConferenceIdState(id);
    try {
      localStorage.setItem(LS_ACTIVE_CONFERENCE, id);
    } catch {}

    if (createdCommitteeIds.length > 0) {
      setActiveCommitteeId(createdCommitteeIds[0]);
    }

    // Seamlessly sync into platform events ecosystem (zenvitra_events_v4_clean)
    try {
      const storedEvtsRaw = localStorage.getItem('zenvitra_events_v4_clean');
      const existingEvts = storedEvtsRaw ? JSON.parse(storedEvtsRaw) : [];
      if (Array.isArray(existingEvts) && !existingEvts.some((e: any) => e.id === id || e.slug === id)) {
        const syncedEvent = {
          id,
          slug: id,
          title: cleanName,
          description: data.tagline?.trim() || 'Sovereign Multilateral Youth Assembly, Summit & Committee Chambers',
          type: 'hybrid',
          location: data.location?.trim() || 'Digital Plenary Enclave',
          date: data.startDate,
          endDate: data.endDate,
          time: '09:00 AM',
          category: 'MUN',
          status: statusInfo.status === 'CONCLUDED' ? 'past' : (statusInfo.isLive ? 'live' : 'upcoming'),
          ticketPrice: data.ticketPrice || (data.plans && data.plans.length > 0 ? data.plans[0].price : 0),
          plans: data.plans,
          attendees: [],
          organizerId: currentUserId,
          organizerName: currentUserName,
          organizerUsername: currentUserHandle,
          tags: ['mun', 'summit', 'diplomacy', 'deliberation'],
          createdAt: new Date().toISOString(),
        };
        const nextEvts = [syncedEvent, ...existingEvts];
        localStorage.setItem('zenvitra_events_v4_clean', JSON.stringify(nextEvts));
        broadcastActivitySync({ source: 'event', action: 'create', timestamp: Date.now() });
      }
    } catch {}

    broadcastActivitySync({ source: 'mun_reg', action: 'create', timestamp: Date.now() });
    return newConf;
  }, [currentUserName, currentUserId, currentUserHandle]);

  const deleteConference = useCallback((confId: string) => {
    setConferences((prev) => {
      const updated = prev.filter((c) => c.id !== confId);
      try {
        localStorage.setItem(LS_MUN_CONFERENCES, JSON.stringify(updated));
      } catch {}
      return updated;
    });
    broadcastActivitySync({ source: 'mun_reg', action: 'delete', timestamp: Date.now() });
  }, []);

  const updateConference = useCallback((confId: string, data: Partial<MunConference>) => {
    setConferences((prev) => {
      const updated = prev.map((c) => (c.id === confId ? { ...c, ...data } : c));
      try {
        localStorage.setItem(LS_MUN_CONFERENCES, JSON.stringify(updated));
      } catch {}
      return updated;
    });
    broadcastActivitySync({ source: 'mun_reg', action: 'update', timestamp: Date.now() });
  }, []);

  const updateConferenceMatrix = useCallback((confId: string, matrix: any[]) => {
    setConferences((prev) => {
      const updated = prev.map((c) => (c.id === confId ? { ...c, matrix } : c));
      try {
        localStorage.setItem(LS_MUN_CONFERENCES, JSON.stringify(updated));
      } catch {}
      return updated;
    });
    broadcastActivitySync({ source: 'mun_reg', action: 'update', timestamp: Date.now() });
  }, []);

  const setConferenceStatus = useCallback((confId: string, status: MunConferenceStatus) => {
    setConferences((prev) => {
      const updated = prev.map((c) => (c.id === confId ? { ...c, status } : c));
      try {
        localStorage.setItem(LS_MUN_CONFERENCES, JSON.stringify(updated));
      } catch {}
      return updated;
    });
    broadcastActivitySync({ source: 'mun_reg', action: 'update', timestamp: Date.now() });
  }, []);

  const setConferenceDay = useCallback((confId: string, day: number) => {
    const cleanDay = Math.max(0, day);
    setConferences((prev) => {
      const updated = prev.map((c) => {
        if (c.id !== confId) return c;
        const total = Math.max(c.totalDays || 3, cleanDay);
        return {
          ...c,
          currentDay: cleanDay,
          totalDays: total,
          status: cleanDay === 0 ? 'NOT_STARTED' : `DAY_${cleanDay}`
        };
      });
      try {
        localStorage.setItem(LS_MUN_CONFERENCES, JSON.stringify(updated));
      } catch {}
      return updated;
    });
    broadcastActivitySync({ source: 'mun_reg', action: 'update', timestamp: Date.now() });
  }, []);

  const setConferenceTotalDays = useCallback((confId: string, totalDays: number) => {
    const cleanTotal = Math.max(1, totalDays);
    setConferences((prev) => {
      const updated = prev.map((c) => (c.id === confId ? { ...c, totalDays: cleanTotal } : c));
      try {
        localStorage.setItem(LS_MUN_CONFERENCES, JSON.stringify(updated));
      } catch {}
      return updated;
    });
    broadcastActivitySync({ source: 'mun_reg', action: 'update', timestamp: Date.now() });
  }, []);

  const addConferenceDay = useCallback((confId: string) => {
    setConferences((prev) => {
      const updated = prev.map((c) => {
        if (c.id !== confId) return c;
        const nextTotal = (c.totalDays || 3) + 1;
        return {
          ...c,
          totalDays: nextTotal,
        };
      });
      try {
        localStorage.setItem(LS_MUN_CONFERENCES, JSON.stringify(updated));
      } catch {}
      return updated;
    });
    broadcastActivitySync({ source: 'mun_reg', action: 'update', timestamp: Date.now() });
  }, []);

  const advanceConferenceDay = useCallback((confId: string) => {
    setConferences((prev) => {
      const updated = prev.map((c) => {
        if (c.id !== confId) return c;
        const current = c.currentDay !== undefined ? c.currentDay : (c.status === 'NOT_STARTED' ? 0 : 1);
        const nextDay = current + 1;
        const total = Math.max(c.totalDays || 3, nextDay);
        return {
          ...c,
          currentDay: nextDay,
          totalDays: total,
          status: `DAY_${nextDay}`
        };
      });
      try {
        localStorage.setItem(LS_MUN_CONFERENCES, JSON.stringify(updated));
      } catch {}
      return updated;
    });
    broadcastActivitySync({ source: 'mun_reg', action: 'update', timestamp: Date.now() });
  }, []);

  const concludeConference = useCallback((confId: string) => {
    setConferences((prev) => {
      const updated = prev.map((c) => (c.id === confId ? { ...c, status: 'CONCLUDED' } : c));
      try {
        localStorage.setItem(LS_MUN_CONFERENCES, JSON.stringify(updated));
      } catch {}
      return updated;
    });
    broadcastActivitySync({ source: 'mun_reg', action: 'update', timestamp: Date.now() });
  }, []);

  const addCustomAward = useCallback((committeeId: string, award: { title: string; recipientPortfolio: string; delegateName: string; citation?: string }) => {
    setSessionStates((prev) => {
      const current = prev[committeeId] || {
        committeeId,
        sessionNumber: 1,
        status: 'in_session',
        sessionMode: 'GSL',
        timer: { totalSeconds: 90, remainingSeconds: 90, isRunning: false, label: 'GSL', sessionType: 'GSL' },
        currentSpeaker: null,
        currentMotion: null,
        motionsQueue: [],
        speakersList: [],
        parliamentaryPoints: [],
        resolutions: [],
      };
      const existingSummary = current.winnersSummary || {};
      const newCustomAward = {
        id: `award_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`,
        title: award.title.trim(),
        recipientPortfolio: award.recipientPortfolio.trim(),
        delegateName: award.delegateName.trim(),
        citation: award.citation?.trim() || ''
      };
      const updated = {
        ...prev,
        [committeeId]: {
          ...current,
          winnersSummary: {
            ...existingSummary,
            customAwards: [...(existingSummary.customAwards || []), newCustomAward]
          }
        }
      };
      try {
        localStorage.setItem(LS_MUN_SESSION, JSON.stringify(updated));
      } catch {}
      return updated;
    });
  }, []);

  const removeCustomAward = useCallback((committeeId: string, awardId: string) => {
    setSessionStates((prev) => {
      const current = prev[committeeId];
      if (!current || !current.winnersSummary) return prev;
      const filtered = (current.winnersSummary.customAwards || []).filter(a => a.id !== awardId);
      const updated = {
        ...prev,
        [committeeId]: {
          ...current,
          winnersSummary: {
            ...current.winnersSummary,
            customAwards: filtered
          }
        }
      };
      try {
        localStorage.setItem(LS_MUN_SESSION, JSON.stringify(updated));
      } catch {}
      return updated;
    });
  }, []);

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

  // Load from localStorage on client mount & scrub any legacy seeded data
  useEffect(() => {
    try {
      // Actively purge all legacy keys from user's browser
      const LEGACY_KEYS_TO_PURGE = [
        'zenvitra_mun_conferences_v1',
        'zenvitra_mun_conferences_v2',
        'zenvitra_mun_conferences_v2_clean',
        'zenvitra_mun_active_conference_v1',
        'zenvitra_mun_active_conference_v2',
        'zenvitra_mun_active_conference_v2_clean',
        'zenvitra_mun_committees_v1',
        'zenvitra_mun_committees_v2',
        'zenvitra_mun_committees_v2_clean',
        'zenvitra_mun_session_v1',
        'zenvitra_mun_session_v2',
        'zenvitra_mun_session_v2_clean',
        'zenvitra_chamber_rooms_v1',
        'zenvitra_chamber_rooms_v2',
        'zenvitra_mun_registrations_v1',
        'zenvitra_mun_registrations_v2',
        'zenvitra_mun_registrations_v2_clean',
        'zenvitra_mun_invites_v1',
        'zenvitra_mun_invites_v2',
        'zenvitra_mun_invites_v2_clean',
        'zenvitra_events_v1',
        'zenvitra_events_v2',
        'zenvitra_events_v3'
      ];
      LEGACY_KEYS_TO_PURGE.forEach((key) => {
        try { localStorage.removeItem(key); } catch {}
      });

      // 1. Conferences & Ecosystem Connection (Events, Summits, MUNs)
      const isSeededMunConference = (c: any) => {
        if (!c) return true;
        const id = String(c.id || '').toLowerCase();
        const name = String(c.name || c.title || '').toLowerCase();
        const slug = String(c.slug || '').toLowerCase();
        return (
          id === 'conf-zenmun-2026' ||
          id === 'mun-zen-2026' ||
          id.includes('evt_showcase') ||
          id.includes('zen-diplomacy') ||
          name.includes('zenmun 2026') ||
          name.includes('model united nations 2026') ||
          name.includes('global mun') ||
          name.includes('geneva world mun') ||
          name.includes('zenvitra youth diplomatic plenary 2026') ||
          name.includes('civic treaty & redline diff') ||
          slug === 'zen-diplomacy' ||
          slug === 'zen-diplomacy-mun-2026'
        );
      };

      const storedConfs = localStorage.getItem(LS_MUN_CONFERENCES);
      let loadedConfs: MunConference[] = [];
      if (storedConfs) {
        try {
          const parsed = JSON.parse(storedConfs);
          if (Array.isArray(parsed) && parsed.length > 0) {
            loadedConfs = parsed.filter((c: any) => c && c.id && !isSeededMunConference(c));
          }
        } catch {}
      }

      // Seamlessly bridge with platform events ecosystem (zenvitra_events_v4_clean)
      const storedEvents = localStorage.getItem('zenvitra_events_v4_clean');
      if (storedEvents) {
        try {
          const evts = JSON.parse(storedEvents);
          if (Array.isArray(evts)) {
            evts.forEach((e: any) => {
              if (e && e.id && !isSeededMunConference(e)) {
                if (!loadedConfs.some((c) => c.id === e.id || c.id === e.slug)) {
                  loadedConfs.push(eventToMunConference(e));
                }
              }
            });
          }
        } catch {}
      }

      setConferences(loadedConfs);
      try {
        localStorage.setItem(LS_MUN_CONFERENCES, JSON.stringify(loadedConfs));
      } catch {}

      // Synchronize verified conferences from database
      fetch('/api/events/list?status=VERIFIED')
        .then((res) => res.json())
        .then((data) => {
          if (data.success && Array.isArray(data.listings)) {
            setConferences((prev) => {
              let updated = [...prev];
              let hasNew = false;
              for (const item of data.listings) {
                const confId = item.slug || item.id;
                if (!updated.some((c) => c.id === confId)) {
                  let plans: any[] = [];
                  try { if (item.tierPlansJson) plans = JSON.parse(item.tierPlansJson); } catch {}
                  const startDate = item.startDate ? new Date(item.startDate).toISOString().split('T')[0] : new Date().toISOString().split('T')[0];
                  const endDate = item.endDate ? new Date(item.endDate).toISOString().split('T')[0] : startDate;
                  const statusInfo = computeConferenceStatus({ startDate, endDate });

                  const newConf: MunConference = {
                    id: confId,
                    slug: item.slug,
                    name: item.title,
                    shortName: item.shortName || item.title.slice(0, 14).toUpperCase(),
                    tagline: item.description || 'Sovereign Multilateral Assembly, Summit & Committees',
                    startDate,
                    endDate,
                    status: statusInfo.status,
                    currentDay: statusInfo.currentDay,
                    totalDays: statusInfo.totalDays,
                    conveningDate: `${startDate}T09:00:00.000Z`,
                    secretariatChair: item.organizerName || 'Executive Secretariat',
                    location: `${item.venue}, ${item.city}`,
                    committees: [`${confId}-chamber-1`],
                    plans,
                    verified: true,
                    verificationStatus: 'VERIFIED',
                  };
                  updated.push(newConf);
                  hasNew = true;
                }
              }
              if (hasNew) {
                try { localStorage.setItem(LS_MUN_CONFERENCES, JSON.stringify(updated)); } catch {}
              }
              return updated;
            });
          }
        })
        .catch(() => {});

      // 2. Active Conference
      const storedActiveConf = localStorage.getItem(LS_ACTIVE_CONFERENCE);
      if (storedActiveConf && loadedConfs.some((c) => c.id === storedActiveConf)) {
        setActiveConferenceIdState(storedActiveConf);
      } else {
        const fallbackConfId = loadedConfs[0]?.id || '';
        setActiveConferenceIdState(fallbackConfId);
        try {
          if (fallbackConfId) localStorage.setItem(LS_ACTIVE_CONFERENCE, fallbackConfId);
          else localStorage.removeItem(LS_ACTIVE_CONFERENCE);
        } catch {}
      }

      // 3. Committees
      const storedCommittees = localStorage.getItem(LS_MUN_COMMITTEES);
      let loadedCommittees: MunCommittee[] = [];
      if (storedCommittees) {
        try {
          const parsed = JSON.parse(storedCommittees);
          if (Array.isArray(parsed)) {
            loadedCommittees = parsed.filter((c: any) => c && c.id);
          }
        } catch {}
      }
      setCommittees(loadedCommittees);
      try {
        localStorage.setItem(LS_MUN_COMMITTEES, JSON.stringify(loadedCommittees));
      } catch {}

      const storedActiveComm = localStorage.getItem(LS_ACTIVE_COMMITTEE);
      if (storedActiveComm && loadedCommittees.some((c) => c.id === storedActiveComm)) {
        setActiveCommitteeId(storedActiveComm);
      } else if (loadedCommittees.length > 0) {
        setActiveCommitteeId(loadedCommittees[0].id);
      } else {
        setActiveCommitteeId('');
      }

      // 4. Chamber Rooms
      const storedRooms = localStorage.getItem(LS_CHAMBER_ROOMS);
      let loadedRooms: ChamberRoom[] = [];
      if (storedRooms) {
        try {
          const parsed = JSON.parse(storedRooms);
          if (Array.isArray(parsed)) {
            loadedRooms = parsed.filter((r: any) => r && r.id);
          }
        } catch {}
      }
      setChamberRooms(loadedRooms);
      try {
        localStorage.setItem(LS_CHAMBER_ROOMS, JSON.stringify(loadedRooms));
      } catch {}

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

      // 5. Emergency Protocol Broadcasts
      const storedActiveBroadcast = localStorage.getItem(LS_ACTIVE_BROADCAST);
      if (storedActiveBroadcast) {
        try {
          const parsed = JSON.parse(storedActiveBroadcast);
          if (parsed && parsed.isActive) {
            setActiveBroadcast(parsed);
          }
        } catch {}
      }

      const storedHistory = localStorage.getItem(LS_BROADCAST_HISTORY);
      if (storedHistory) {
        try {
          const parsed = JSON.parse(storedHistory);
          if (Array.isArray(parsed)) setBroadcastHistory(parsed);
        } catch {}
      }
    } catch {}
    setIsMounted(true);
  }, []);

  // Save to localStorage (only after mounted)
  useEffect(() => {
    if (!isMounted) return;
    try {
      localStorage.setItem(LS_MUN_CONFERENCES, JSON.stringify(conferences));
    } catch {}
  }, [conferences, isMounted]);

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
    (customData: { 
      name: string; 
      shortName?: string; 
      agenda: string; 
      type?: MunCommitteeType; 
      totalDelegates?: number;
      emblem?: string;
      logoKey?: string;
      iconUrl?: string;
      dais?: { chair: string; viceChair: string; rapporteur?: string };
    }) => {
      const newId = `custom-preset-${Date.now()}`;
      const shortName = (customData.shortName?.trim() || customData.name.slice(0, 10).toUpperCase()).trim();
      const totalDelegates = customData.totalDelegates || 25;
      const newCommittee: MunCommittee = {
        id: newId,
        eventId: 'evt_custom_user',
        name: customData.name.trim(),
        shortName,
        type: customData.type || 'OTHER',
        agenda: customData.agenda.trim(),
        totalDelegates,
        presentCount: 0,
        presentAndVotingCount: 0,
        quorumNeeded: Math.ceil(totalDelegates / 3),
        dais: customData.dais || {
          chair: 'Session Moderator',
          viceChair: 'Deputy Rapporteur'
        },
        emblem: customData.emblem || '🇺🇳',
        logoKey: customData.logoKey || 'un',
        iconUrl: customData.iconUrl,
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
    sessionStates[activeCommitteeId] || createEmptySessionState(activeCommitteeId);

  /* Timer Controls */
  const toggleTimer = useCallback(() => {
    setSessionStates((prev) => {
      const s = prev[activeCommitteeId] || createEmptySessionState(activeCommitteeId);
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
        const s = prev[activeCommitteeId] || createEmptySessionState(activeCommitteeId);
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
        const s = prev[activeCommitteeId] || createEmptySessionState(activeCommitteeId);
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
    const country = userAcceptedInvite?.portfolio || (profile?.display_name ? `Delegate (${profile.display_name})` : 'Delegate of Member State');
    const flag = userAcceptedInvite?.flagEmoji || '🌐';

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
      day: currentConferenceDay,
      createdAt: new Date().toISOString(),
    };

    setSessionStates((prev) => {
      const s = prev[activeCommitteeId] || createEmptySessionState(activeCommitteeId);
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
      const s = prev[activeCommitteeId] || createEmptySessionState(activeCommitteeId);
      const targetMotion = s.motionsQueue.find((m) => m.id === motionId);
      if (!targetMotion) return prev;

      const totalSec = targetMotion.totalMinutes * 60;
      const mode: MunSessionMode =
        targetMotion.type === 'MODERATED_CAUCUS'
          ? 'MOD_CAUCUS'
          : targetMotion.type === 'UNMODERATED_CAUCUS'
          ? 'UNMOD_CAUCUS'
          : 'GSL';

      const historyEntry = {
        ...targetMotion,
        day: (targetMotion.day || currentConferenceDay) as 1 | 2 | 3,
        verdict: 'passed' as const,
        status: 'passed' as const,
      };

      return {
        ...prev,
        [activeCommitteeId]: {
          ...s,
          sessionMode: mode,
          currentMotion: { ...targetMotion, status: 'active' },
          motionsQueue: s.motionsQueue.filter((m) => m.id !== motionId),
          motionHistory: [historyEntry, ...(s.motionHistory || [])],
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
      const s = prev[activeCommitteeId] || createEmptySessionState(activeCommitteeId);
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
      const s = prev[activeCommitteeId] || createEmptySessionState(activeCommitteeId);
      const targetMotion = s.motionsQueue.find((m) => m.id === motionId);
      const historyEntry = targetMotion ? [{
        ...targetMotion,
        day: (targetMotion.day || currentConferenceDay) as 1 | 2 | 3,
        verdict: 'withdrawn' as const,
        status: 'withdrawn' as const,
      }] : [];

      return {
        ...prev,
        [activeCommitteeId]: {
          ...s,
          motionsQueue: s.motionsQueue.filter((m) => m.id !== motionId),
          motionHistory: [...historyEntry, ...(s.motionHistory || [])],
        },
      };
    });
  };

  /* Speakers List Controls */
  const joinSpeakersList = (customPortfolio?: string) => {
    const userAcceptedInvite = userInvites.find(
      (i) => i.committeeId === activeCommitteeId && i.status === 'accepted'
    );
    const country = customPortfolio || userAcceptedInvite?.portfolio || (profile?.display_name ? `Delegate (${profile.display_name})` : 'Delegate of Member State');
    const flag = userAcceptedInvite?.flagEmoji || '🌐';

    const newSpeaker: MunSpeaker = {
      id: `spk_${Date.now()}`,
      country: country.replace('Delegation of ', '').replace('Delegate of ', ''),
      portfolio: country,
      delegateName: currentUserName,
      flagEmoji: flag,
      status: 'queued',
      day: currentConferenceDay,
      listType: 'GSL',
    };

    setSessionStates((prev) => {
      const s = prev[activeCommitteeId] || createEmptySessionState(activeCommitteeId);
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

  const addSpeakerToQueue = useCallback((portfolio: string, delegateName?: string) => {
    if (!portfolio.trim()) return;
    const cleanPortfolio = portfolio.trim();
    const newSpeaker: MunSpeaker = {
      id: `spk_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`,
      country: cleanPortfolio.replace('Delegation of ', '').replace('Delegate of ', ''),
      portfolio: cleanPortfolio,
      delegateName: delegateName?.trim() || cleanPortfolio,
      flagEmoji: '🌐',
      status: 'queued',
      day: currentConferenceDay || 1,
      listType: 'GSL',
      timeRemainingSeconds: 90,
    };

    setSessionStates((prev) => {
      const s = prev[activeCommitteeId] || createEmptySessionState(activeCommitteeId);
      return {
        ...prev,
        [activeCommitteeId]: {
          ...s,
          speakersList: [...s.speakersList, newSpeaker],
        },
      };
    });
  }, [activeCommitteeId, currentConferenceDay]);

  const removeSpeakerFromQueue = useCallback((speakerId: string) => {
    setSessionStates((prev) => {
      const s = prev[activeCommitteeId] || createEmptySessionState(activeCommitteeId);
      return {
        ...prev,
        [activeCommitteeId]: {
          ...s,
          speakersList: s.speakersList.filter((sp) => sp.id !== speakerId),
        },
      };
    });
  }, [activeCommitteeId]);

  const clearFloorSession = useCallback((committeeId: string) => {
    setSessionStates((prev) => {
      const current = prev[committeeId] || createEmptySessionState(committeeId);
      const fresh: MunSessionState = {
        ...createEmptySessionState(committeeId),
        sessionNumber: (current.sessionNumber || 1) + 1,
      };
      const updated = { ...prev, [committeeId]: fresh };
      try {
        localStorage.setItem(LS_MUN_SESSION, JSON.stringify(updated));
      } catch {}
      return updated;
    });
  }, []);

  const deleteCommittee = useCallback((committeeId: string) => {
    setCommittees((prev) => {
      const updated = prev.filter((c) => c.id !== committeeId);
      try {
        localStorage.setItem(LS_MUN_COMMITTEES, JSON.stringify(updated));
      } catch {}
      if (activeCommitteeId === committeeId && updated.length > 0) {
        setActiveCommitteeId(updated[0].id);
      }
      return updated;
    });
  }, [activeCommitteeId]);

  const advanceSpeaker = () => {
    setSessionStates((prev) => {
      const s = prev[activeCommitteeId] || createEmptySessionState(activeCommitteeId);
      if (s.speakersList.length === 0) return prev;

      const [nextSpeaker, ...remaining] = s.speakersList;
      const speakerTime = s.currentMotion?.individualSpeakerSeconds || 60;

      const completedLog = s.currentSpeaker ? [{
        ...s.currentSpeaker,
        day: (s.currentSpeaker.day || currentConferenceDay) as 1 | 2 | 3,
        listType: (s.sessionMode === 'GSL' ? 'GSL' : 'MOD') as 'GSL' | 'MOD',
        durationSeconds: s.currentMotion?.individualSpeakerSeconds || 60,
      }] : [];

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
          speakerHistory: [...completedLog, ...(s.speakerHistory || [])],
        },
      };
    });
  };

  const yieldSpeakerTime = (type: 'chair' | 'points_of_info' | 'another_delegate') => {
    setSessionStates((prev) => {
      const s = prev[activeCommitteeId] || createEmptySessionState(activeCommitteeId);
      if (!s.currentSpeaker) return prev;

      const yieldedLog = {
        ...s.currentSpeaker,
        day: (s.currentSpeaker.day || currentConferenceDay) as 1 | 2 | 3,
        listType: (s.sessionMode === 'GSL' ? 'GSL' : 'MOD') as 'GSL' | 'MOD',
        durationSeconds: (s.currentMotion?.individualSpeakerSeconds || 60) - (s.currentSpeaker.timeRemaining || 0),
        status: 'yielded' as const,
        yieldType: type,
      };

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
          speakerHistory: [yieldedLog, ...(s.speakerHistory || [])],
        },
      };
    });
  };

  /* Parliamentary Points */
  const raiseParliamentaryPoint = (type: PointType, detail: string) => {
    const userAcceptedInvite = userInvites.find(
      (i) => i.committeeId === activeCommitteeId && i.status === 'accepted'
    );
    const country = userAcceptedInvite?.portfolio || (profile?.display_name ? `Delegate (${profile.display_name})` : 'Delegate of Member State');
    const flag = userAcceptedInvite?.flagEmoji || '🌐';

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
      const s = prev[activeCommitteeId] || createEmptySessionState(activeCommitteeId);
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
      const s = prev[activeCommitteeId] || createEmptySessionState(activeCommitteeId);
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
      const s = prev[activeCommitteeId] || createEmptySessionState(activeCommitteeId);
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
      const s = prev[activeCommitteeId] || createEmptySessionState(activeCommitteeId);
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
      const s = prev[activeCommitteeId] || createEmptySessionState(activeCommitteeId);
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
      totalDelegates: 25,
      presentCount: 0,
      presentAndVotingCount: 0,
      quorumNeeded: 9,
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
    data: Partial<Pick<MunCommittee, 'name' | 'shortName' | 'type' | 'agenda' | 'totalDelegates' | 'presentCount' | 'presentAndVotingCount' | 'quorumNeeded'>>
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

  const passAndArchiveBill = useCallback((bill: { 
    title: string; 
    code?: string; 
    sponsors?: string[]; 
    fullText?: string; 
    clauses?: any[];
    category?: any;
    documentType?: any;
  }) => {
    const committee = committees.find(c => c.id === activeCommitteeId);
    const committeeName = committee?.name || 'Chamber Plenary';
    const isIndian = committee?.isIndianCommittee || committee?.type === 'LOK_SABHA' || committee?.type === 'AIPPM' || committee?.type === 'PARLIAMENTARY';
    
    const docType = bill.documentType || (isIndian ? 'LEGISLATIVE_BILL' : 'DRAFT_RESOLUTION');
    const docCode = bill.code || (isIndian 
      ? `BILL-2026-LS-${Math.floor(100 + Math.random() * 900)}` 
      : `UN-RES-2026-${Math.floor(100 + Math.random() * 900)}`);
    
    const billRecord = {
      id: `bill_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`,
      title: bill.title,
      code: docCode,
      sponsors: bill.sponsors && bill.sponsors.length > 0 ? bill.sponsors : [currentUserName],
      passedAt: new Date().toISOString(),
      day: currentConferenceDay,
      summary: bill.fullText ? bill.fullText.substring(0, 200) + '...' : 'Adopted unanimously by the chamber delegates.',
      fullText: bill.fullText || ''
    };

    // 1. Update committee sessionState.passedBills
    setSessionStates((prev) => {
      const current = prev[activeCommitteeId] || {
        committeeId: activeCommitteeId,
        sessionNumber: 1,
        status: 'in_session',
        sessionMode: 'GSL',
        timer: { totalSeconds: 90, remainingSeconds: 90, isRunning: false, label: 'GSL', sessionType: 'GSL' },
        currentSpeaker: null,
        currentMotion: null,
        motionsQueue: [],
        speakersList: [],
        parliamentaryPoints: [],
        resolutions: [],
        passedBills: []
      };
      const updated = {
        ...prev,
        [activeCommitteeId]: {
          ...current,
          passedBills: [...(current.passedBills || []), billRecord]
        }
      };
      try {
        localStorage.setItem(LS_MUN_SESSION, JSON.stringify(updated));
      } catch {}
      return updated;
    });

    // 2. Archive to /solutions (zenvitra_solutions_v2_clean)
    try {
      const stored = localStorage.getItem('zenvitra_solutions_v2_clean');
      const solutionsList = stored ? JSON.parse(stored) : [];
      const newSol = {
        id: `sol_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`,
        documentCode: docCode,
        title: bill.title,
        documentType: docType,
        category: bill.category || 'GOVERNANCE',
        committee: committeeName,
        status: 'PUBLISHED',
        leadSponsors: bill.sponsors && bill.sponsors.length > 0 ? bill.sponsors : [currentUserName],
        signatories: [currentUserName],
        abstract: billRecord.summary,
        clauses: bill.clauses || [
          {
            clauseNumber: '1',
            type: isIndian ? 'OPERATIVE' : 'OPERATIVE',
            text: bill.fullText || bill.title,
            sponsorAuthors: billRecord.sponsors
          }
        ],
        fullText: bill.fullText || '',
        votes: { inFavor: 0, against: 0, abstain: 0 },
        votedUserIds: [],
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        publishedAt: new Date().toISOString(),
        isOfficial: true
      };
      localStorage.setItem('zenvitra_solutions_v2_clean', JSON.stringify([newSol, ...solutionsList]));
    } catch {}

    // 3. Update delegate dossier sparks
    try {
      const sparksStored = localStorage.getItem('zenvitra_dossier_sparks_v1');
      const sparks = sparksStored ? JSON.parse(sparksStored) : [];
      const newSpark = {
        id: `spark_${Date.now()}`,
        title: `Passed ${isIndian ? 'Bill' : 'Draft Resolution'}: ${bill.title}`,
        category: 'POLICY_LEGISLATION',
        committee: committeeName,
        date: new Date().toISOString().split('T')[0],
        sparkScore: 98,
        description: `Successfully authored, defended, and enacted ${docCode} on Day ${currentConferenceDay}.`
      };
      localStorage.setItem('zenvitra_dossier_sparks_v1', JSON.stringify([newSpark, ...sparks]));
    } catch {}

    broadcastActivitySync({ source: 'press', action: 'create', timestamp: Date.now() });
  }, [activeCommitteeId, committees, currentUserName, currentConferenceDay]);

  const setCommitteeWinners = useCallback((committeeId: string, winners: NonNullable<MunSessionState['winnersSummary']>) => {
    setSessionStates((prev) => {
      const current = prev[committeeId] || {
        committeeId,
        sessionNumber: 1,
        status: 'concluded',
        sessionMode: 'GSL',
        timer: { totalSeconds: 90, remainingSeconds: 90, isRunning: false, label: 'GSL', sessionType: 'GSL' },
        currentSpeaker: null,
        currentMotion: null,
        motionsQueue: [],
        speakersList: [],
        parliamentaryPoints: [],
        resolutions: [],
      };
      const updated = {
        ...prev,
        [committeeId]: {
          ...current,
          status: 'concluded' as const,
          winnersSummary: winners
        }
      };
      try {
        localStorage.setItem(LS_MUN_SESSION, JSON.stringify(updated));
      } catch {}
      return updated;
    });

    const targetComm = committees.find(c => c.id === committeeId);
    const commName = targetComm?.name || committeeId;
    
    const bestDelPortfolio = typeof winners.bestDelegate === 'string' ? winners.bestDelegate : winners.bestDelegate?.portfolio;
    if (bestDelPortfolio) {
      addExperience({
        munName: activeConference?.name || 'Diplomatic Conference',
        editionYear: '2026',
        isHostedByMe: false,
        portfolioOrTitle: bestDelPortfolio,
        verificationStatus: 'VERIFIED_SECRETARIAT',
        eventId: activeConferenceId,
        eventName: activeConference?.name || 'Diplomatic Conference',
        role: 'DELEGATE',
        committee: commName,
        portfolio: bestDelPortfolio,
        award: 'BEST_DELEGATE',
        startDate: activeConference?.startDate || '2026-09-17',
        endDate: activeConference?.endDate || '2026-09-19',
        isVerified: true
      });
    }

    broadcastActivitySync({ source: 'mun_reg', action: 'update', timestamp: Date.now() });
  }, [committees, activeConferenceId, activeConference, addExperience]);

  /* Emergency Broadcast Dispatcher Implementation */
  const transmitBroadcast = useCallback((broadcastData: Omit<EmergencyBroadcast, 'id' | 'timestamp' | 'isActive'>): EmergencyBroadcast => {
    const id = `eb_${Date.now()}`;
    const newBroadcast: EmergencyBroadcast = {
      ...broadcastData,
      id,
      timestamp: new Date().toISOString(),
      isActive: true,
    };

    setActiveBroadcast(newBroadcast);
    setBroadcastHistory((prev) => [newBroadcast, ...prev]);

    try {
      localStorage.setItem(LS_ACTIVE_BROADCAST, JSON.stringify(newBroadcast));
      const existingHistory = JSON.parse(localStorage.getItem(LS_BROADCAST_HISTORY) || '[]');
      localStorage.setItem(LS_BROADCAST_HISTORY, JSON.stringify([newBroadcast, ...existingHistory]));
    } catch {}

    broadcastActivitySync({
      source: 'mun_reg',
      action: 'create',
      timestamp: Date.now(),
      metadata: { type: 'EMERGENCY_BROADCAST', broadcast: newBroadcast },
    });

    return newBroadcast;
  }, []);

  const dismissBroadcast = useCallback((broadcastId?: string) => {
    setActiveBroadcast(null);
    try {
      localStorage.removeItem(LS_ACTIVE_BROADCAST);
      if (broadcastId) {
        const storedHistory = JSON.parse(localStorage.getItem(LS_BROADCAST_HISTORY) || '[]');
        const updatedHistory = storedHistory.map((b: EmergencyBroadcast) =>
          b.id === broadcastId ? { ...b, isActive: false } : b
        );
        localStorage.setItem(LS_BROADCAST_HISTORY, JSON.stringify(updatedHistory));
        setBroadcastHistory(updatedHistory);
      }
    } catch {}

    broadcastActivitySync({
      source: 'mun_reg',
      action: 'update',
      timestamp: Date.now(),
      metadata: { type: 'EMERGENCY_BROADCAST_DISMISSED', broadcastId },
    });
  }, []);

  // Real-time synchronization for Emergency Broadcasts across all tabs & routes
  useEffect(() => {
    if (typeof window === 'undefined') return;

    const handleStorage = (e: StorageEvent) => {
      if (e.key === LS_ACTIVE_BROADCAST) {
        if (!e.newValue) {
          setActiveBroadcast(null);
        } else {
          try {
            const parsed = JSON.parse(e.newValue);
            if (parsed && parsed.isActive) {
              setActiveBroadcast(parsed);
            } else {
              setActiveBroadcast(null);
            }
          } catch {}
        }
      } else if (e.key === LS_BROADCAST_HISTORY && e.newValue) {
        try {
          const parsed = JSON.parse(e.newValue);
          if (Array.isArray(parsed)) setBroadcastHistory(parsed);
        } catch {}
      }
    };

    const handleCustomSync = (e: Event) => {
      const customEvent = e as CustomEvent;
      if (customEvent.detail?.metadata?.type === 'EMERGENCY_BROADCAST') {
        setActiveBroadcast(customEvent.detail.metadata.broadcast);
      } else if (customEvent.detail?.metadata?.type === 'EMERGENCY_BROADCAST_DISMISSED') {
        setActiveBroadcast(null);
      }
    };

    window.addEventListener('storage', handleStorage);
    window.addEventListener('zenvitra_activity_sync', handleCustomSync);

    return () => {
      window.removeEventListener('storage', handleStorage);
      window.removeEventListener('zenvitra_activity_sync', handleCustomSync);
    };
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
        conferences,
        activeConferenceId,
        activeConference,
        setActiveConferenceId,
        createConference,
        deleteConference,
        updateConference,
        updateConferenceMatrix,
        setConferenceStatus,
        setConferenceDay,
        setConferenceTotalDays,
        addConferenceDay,
        advanceConferenceDay,
        concludeConference,
        currentConferenceDay,
        passAndArchiveBill,
        setCommitteeWinners,
        addCustomAward,
        removeCustomAward,
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
        deleteCommittee,
        clearFloorSession,
        addSpeakerToQueue,
        removeSpeakerFromQueue,
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
        activeBroadcast,
        broadcastHistory,
        transmitBroadcast,
        dismissBroadcast,
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
