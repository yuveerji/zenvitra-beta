export type HostSessionFormat =
  | 'general'
  | 'open_mic'
  | 'storyline'
  | 'workshop'
  | 'panel'
  | 'competition'
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
    tagline: 'Performer queue, round limits, stage-ready alerts & audience polls',
    description: 'Purpose-built for slam poetry, standup comedy, acoustic music, talent showcases, and pitch rounds.',
    defaultTimer: 180,
    color: 'amber',
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
  workshop: {
    name: 'Workshop & Masterclass',
    badge: 'ACADEMY',
    icon: 'GraduationCap',
    tagline: 'Structured modules, learning objectives, timed exercises & resource vault',
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
    badge: 'MODULAR',
    icon: 'Sliders',
    tagline: 'Assemble bespoke event modules, timers, and permissions',
    description: 'Configure custom segments, custom participant tiers, and specialized stage controls.',
    defaultTimer: 120,
    color: 'slate',
  },
};
