export type HostSessionFormat =
  | 'general'
  | 'open_mic'
  | 'lightning_talks'
  | 'workshop'
  | 'panel'
  | 'competition'
  | 'parliamentary'
  | 'quiz_trivia'
  | 'speed_networking'
  | 'focus_pomodoro'
  | 'storyline'
  | 'mun'
  | 'custom';

export type HostSessionState =
  | 'draft'
  | 'ready'
  | 'live'
  | 'paused'
  | 'completed'
  | 'archived';

export type HostAccessMode = 'online' | 'offline' | 'hybrid';

export type HostParticipantRole =
  | 'host'
  | 'co_host'
  | 'moderator'
  | 'judge'
  | 'speaker'
  | 'performer'
  | 'delegate'
  | 'participant'
  | 'observer';

export interface HostParticipant {
  id: string;
  name: string;
  avatarUrl?: string;
  role: HostParticipantRole;
  status: 'pending' | 'admitted' | 'active' | 'suspended' | 'left';
  joinedAt: string;
  handRaised?: boolean;
  handRaisedAt?: string;
  isReadyForStage?: boolean;
  assignedSeat?: string; // e.g. delegation country, portfolio, team
  notes?: string;
}

export interface HostQueueItem {
  id: string;
  participantId: string;
  participantName: string;
  role: HostParticipantRole;
  avatarUrl?: string;
  slotDurationSeconds: number;
  timeSpokenSeconds: number;
  status: 'waiting' | 'active' | 'completed' | 'skipped';
  addedAt: string;
  titleOrAct?: string; // e.g. Poem title, Speech motion, Pitch deck
}

export interface HostPollOption {
  id: string;
  text: string;
  voteCount: number;
}

export interface HostPoll {
  id: string;
  question: string;
  options: HostPollOption[];
  status: 'draft' | 'open' | 'closed' | 'published';
  isAnonymous: boolean;
  isMultiSelect: boolean;
  totalVotes: number;
  createdAt: string;
  closedAt?: string;
}

export interface HostAnnouncement {
  id: string;
  authorName: string;
  content: string;
  timestamp: string;
  isPinned: boolean;
  targetRole?: HostParticipantRole;
}

// ── CUSTOM EVENT BUILDER TOGGLE CONFIGURATION ──────────────────────────
export interface CustomHostEventConfig {
  eventName: string;
  badge: string;
  tagline: string;
  
  // Timer & Pacing Toggles
  enableMasterTimer: boolean;
  masterTimerMinutes: number;
  enableSpeakerTimer: boolean;
  speakerTimerSeconds: number;
  strictCutoff: boolean; // Cutoff directly vs allow overtime
  warningBellSeconds: number;
  enableAudioChimes: boolean; // Ding, Buzzer, Applause
  
  // Queue & Lineup Toggles
  enableQueue: boolean;
  allowSelfQueue: boolean; // Attendees can join queue via room code
  requireHostApproval: boolean;
  enableOnDeckCallout: boolean; // Show "Next up on deck"
  showQueueOnDisplay: boolean; // Show queue on auditorium projector
  
  // Audience & Interactive Toggles
  enableRapidPolls: boolean;
  enableStageBroadcasts: boolean; // Lower-third announcements
  enableApplauseMeter: boolean; // Energy/clapping meter
  enableAudienceQnA: boolean; // Upvoted questions from audience
  
  // Judging & Scoring Toggles
  enableScoringRubric: boolean;
  rubricCriteria: Array<{ id: string; name: string; maxScore: number }>;
  enableLeaderboardReveal: boolean;
  
  // Public Stage / Projector Toggles
  showSpeakerCardOnDisplay: boolean;
  showTimerOnDisplay: boolean;
  anonymizeParticipants: boolean; // Display aliases/codes instead of personal names
}

export const DEFAULT_CUSTOM_EVENT_CONFIG: CustomHostEventConfig = {
  eventName: 'Custom Stage Event',
  badge: 'MODULAR STAGE',
  tagline: 'Fully custom live session with modular toggles',
  enableMasterTimer: true,
  masterTimerMinutes: 60,
  enableSpeakerTimer: true,
  speakerTimerSeconds: 180,
  strictCutoff: false,
  warningBellSeconds: 30,
  enableAudioChimes: true,
  enableQueue: true,
  allowSelfQueue: true,
  requireHostApproval: false,
  enableOnDeckCallout: true,
  showQueueOnDisplay: true,
  enableRapidPolls: true,
  enableStageBroadcasts: true,
  enableApplauseMeter: true,
  enableAudienceQnA: false,
  enableScoringRubric: false,
  rubricCriteria: [
    { id: 'crit-1', name: 'Delivery & Energy', maxScore: 10 },
    { id: 'crit-2', name: 'Content & Impact', maxScore: 10 },
    { id: 'crit-3', name: 'Originality', maxScore: 10 },
  ],
  enableLeaderboardReveal: false,
  showSpeakerCardOnDisplay: true,
  showTimerOnDisplay: true,
  anonymizeParticipants: false,
};

export interface HostSession {
  id: string;
  sessionCode: string;
  title: string;
  description?: string;
  format: HostSessionFormat;
  state: HostSessionState;
  accessMode: HostAccessMode;
  hostId: string;
  hostName: string;
  venueOrRoom?: string;
  scheduledStartTime?: string;
  startedAt?: string;
  endedAt?: string;
  
  // Realtime Telemetry
  participants: HostParticipant[];
  queue: HostQueueItem[];
  activeQueueItemId: string | null;
  
  // Timer State (Server-authoritative)
  timer: {
    durationSeconds: number;
    remainingSeconds: number;
    isRunning: boolean;
    lastStartedTimestamp?: number;
    overtimeSeconds: number;
    mode: 'countdown' | 'countup';
  };

  // Modules
  polls: HostPoll[];
  announcements: HostAnnouncement[];
  
  // Custom Config when format === 'custom'
  customConfig?: CustomHostEventConfig;

  // Format-specific settings
  settings: {
    allowRaiseHand: boolean;
    requireHostApprovalToJoin: boolean;
    allowPublicChat: boolean;
    allowParticipantQnA: boolean;
    showPublicTimerOnDisplay: boolean;
    showPublicQueueOnDisplay: boolean;
    defaultSpeakerSeconds: number;
    judgingRubricEnabled?: boolean;
    rubricCategories?: Array<{ id: string; name: string; maxScore: number }>;
    storylineChapter?: number;
    storylineTotalChapters?: number;
  };
}

export const HOST_FORMAT_PRESETS: Record<
  HostSessionFormat,
  {
    name: string;
    badge: string;
    icon: string;
    tagline: string;
    description: string;
    defaultTimer: number;
    color: string;
  }
> = {
  general: {
    name: 'General Live Session',
    badge: 'LIVE STAGE',
    icon: 'Radio',
    tagline: 'Lobby, interactive queue, Q&A, and live audience polls',
    description: 'Clean universal operating room for town halls, meetups, community broadcasts, and open discussions.',
    defaultTimer: 120,
    color: 'cyan',
  },
  open_mic: {
    name: 'Open Mic & Showcase',
    badge: 'PERFORMANCE',
    icon: 'Mic',
    tagline: 'Performer lineup, act titles, stage-ready alerts & audience applause',
    description: 'Purpose-built for slam poetry, standup comedy, acoustic music, talent showcases, and open expression.',
    defaultTimer: 180,
    color: 'amber',
  },
  lightning_talks: {
    name: 'Lightning Talks & Pitches',
    badge: 'RAPID FIRE',
    icon: 'Zap',
    tagline: 'Strict 3-5 min cutoffs, deck timers, buzzer chimes & pitch queue',
    description: 'High-velocity startup pitches, demo days, flash presentations, and rapid project showcases with strict timed cutoffs.',
    defaultTimer: 180,
    color: 'orange',
  },
  workshop: {
    name: 'Workshop & Masterclass',
    badge: 'ACADEMY',
    icon: 'GraduationCap',
    tagline: 'Structured modules, learning sprints, exercise timers & resource vault',
    description: 'Designed for intensive skill training, breakout sprints, student lectures, and certification labs.',
    defaultTimer: 600,
    color: 'emerald',
  },
  panel: {
    name: 'Forum & Panel Debate',
    badge: 'SYMPOSIUM',
    icon: 'Users',
    tagline: 'Panelist rotation, moderated audience Q&A, and topic transitions',
    description: 'High-level youth summits, expert dialogues, keynote addresses, and structured debate panels.',
    defaultTimer: 90,
    color: 'blue',
  },
  competition: {
    name: 'Competition & Judged Event',
    badge: 'TOURNAMENT',
    icon: 'Trophy',
    tagline: 'Configurable scoring rubrics, score locking, tie-break rules & public reveal',
    description: 'Hackathons, case competitions, debate championships, and jury-voted showcases.',
    defaultTimer: 300,
    color: 'yellow',
  },
  parliamentary: {
    name: 'Parliament & Youth Assembly',
    badge: 'LEGISLATURE',
    icon: 'Landmark',
    tagline: 'Bills, zero-hour speeches, floor motions & division bell voting',
    description: 'Legislative chambers, mock youth parliaments, Lok Sabha simulations, calling attention motions, and division voting.',
    defaultTimer: 120,
    color: 'rose',
  },
  quiz_trivia: {
    name: 'Quiz & Trivia Championship',
    badge: 'ARENA QUIZ',
    icon: 'HelpCircle',
    tagline: 'Buzzer rounds, question timers, team rosters & live scoreboard',
    description: 'College trivia bowls, tech quiz championships, buzzer-first answering, and real-time point leaderboards.',
    defaultTimer: 30,
    color: 'indigo',
  },
  speed_networking: {
    name: 'Speed Networking & Roundtables',
    badge: 'NETWORKING',
    icon: 'Shuffle',
    tagline: 'Rotational rounds, automatic table-switch bells & elevator pitch clocks',
    description: 'Structured peer meets, founder-investor speed dates, mentor office hours, and timed table rotations.',
    defaultTimer: 240,
    color: 'pink',
  },
  focus_pomodoro: {
    name: 'Focus Pod & Co-Working Sprint',
    badge: 'DEEP WORK',
    icon: 'Clock3',
    tagline: '25/5 or 50/10 sprint intervals, ambient accountability & check-in rounds',
    description: 'Community study halls, hack sprints, writing marathons, and collective productivity sessions.',
    defaultTimer: 1500,
    color: 'emerald',
  },
  storyline: {
    name: 'Storyline / EP 101',
    badge: 'ROLEPLAY & LORE',
    icon: 'BookOpen',
    tagline: 'Sequential chapters, character role allotments, secret lore & branch polls',
    description: 'Interactive narrative simulations, episode campaigns, crisis roleplays, and collaborative worldbuilding.',
    defaultTimer: 300,
    color: 'purple',
  },
  mun: {
    name: 'Model UN & Diplomatic Dais',
    badge: 'DIPLOMACY (ZEN.MUN)',
    icon: 'Shield',
    tagline: 'Dual caucus timers, GSL, motions, roll call, resolution vault & ROP engine',
    description: 'The sovereign diplomatic operating console for Model UN conferences, parliamentary simulations, and assemblies.',
    defaultTimer: 90,
    color: 'teal',
  },
  custom: {
    name: 'Custom Event Studio',
    badge: 'MODULAR BUILDER',
    icon: 'Sliders',
    tagline: 'Assemble bespoke event modules, timers, and modular toggles',
    description: 'Pick and choose exact modules: custom timers, judging rubrics, audience polls, sound effects, and display rules.',
    defaultTimer: 180,
    color: 'slate',
  },
};
