export type MunCommitteeType = 
  | 'UNSC' 
  | 'UNHRC' 
  | 'UNODC'
  | 'UNEP' 
  | 'CRISIS' 
  | 'ECOSOC' 
  | 'LOK_SABHA' 
  | 'AIPPM' 
  | 'DISEC'
  | 'PARLIAMENTARY'
  | 'OTHER';

export type MunSessionMode = 
  | 'GSL' 
  | 'MOD_CAUCUS' 
  | 'UNMOD_CAUCUS' 
  | 'CRISIS_FLASH' 
  | 'VOTING' 
  | 'RECESS'
  | 'ZERO_HOUR'
  | 'QUESTION_HOUR';

export type MotionType = 
  | 'MODERATED_CAUCUS' 
  | 'UNMODERATED_CAUCUS' 
  | 'FORMAL_DEBATE' 
  | 'WORKING_PAPER' 
  | 'DRAFT_RESOLUTION' 
  | 'SUSPENSION' 
  | 'CRISIS_UPDATE'
  | 'ZERO_HOUR'
  | 'QUESTION_HOUR'
  | 'CALLING_ATTENTION'
  | 'NO_CONFIDENCE'
  | 'ADJOURNMENT';

export type PointType = 
  | 'PERSONAL_PRIVILEGE' 
  | 'ORDER' 
  | 'PARLIAMENTARY_INQUIRY' 
  | 'RIGHT_OF_REPLY';

export interface MunRegistration {
  id: string;
  eventId: string;
  eventName: string;
  userId: string;
  userName: string;
  userHandle: string;
  committeePreference: string;
  portfolioPreferences: string[];
  experienceLevel: 'beginner' | 'intermediate' | 'advanced' | 'veteran';
  status: 'registered' | 'allotted' | 'invite_sent' | 'accepted' | 'declined';
  registeredAt: string;
}

export interface MunInvite {
  id: string;
  registrationId: string;
  eventId: string;
  eventName: string;
  userId: string;
  userName: string;
  userHandle: string;
  committeeId: string;
  committeeName: string;
  portfolio: string;
  countryCode?: string;
  flagEmoji: string;
  ebChair: string;
  ebViceChair?: string;
  allotmentLetterText: string;
  backgroundGuideUrl?: string;
  status: 'pending' | 'accepted' | 'declined';
  sentAt: string;
  acceptedAt?: string;
}

export type MunConferenceStatus = 'NOT_STARTED' | 'CONCLUDED' | `DAY_${number}` | string;

export interface MunConference {
  id: string;
  name: string;
  shortName: string;
  tagline?: string;
  startDate: string;
  endDate: string;
  status: MunConferenceStatus;
  currentDay: number; // 0 = NOT_STARTED, 1, 2, 3, ... n
  totalDays: number; // Dynamic natural number n set by Secretariat (no limit)
  conveningDate: string; // for countdown when NOT_STARTED
  secretariatChair: string;
  location: string;
  committees: string[]; // committee IDs belonging to this conference
}

export interface MunCommittee {
  id: string;
  eventId: string;
  name: string;
  shortName: string;
  agenda: string;
  type: MunCommitteeType;
  isIndianCommittee?: boolean;
  totalDelegates: number;
  presentCount: number;
  presentAndVotingCount: number;
  quorumNeeded: number;
  dais: {
    chair: string;
    viceChair: string;
    rapporteur?: string;
  };
}

export interface MunMotion {
  id: string;
  committeeId: string;
  proposedBy: {
    userId: string;
    userName: string;
    country: string;
    portfolio: string;
    flagEmoji: string;
  };
  type: MotionType;
  topic: string;
  totalMinutes: number;
  individualSpeakerSeconds: number;
  status: 'queued' | 'active' | 'passed' | 'failed' | 'withdrawn';
  verdict?: 'passed' | 'failed' | 'withdrawn' | 'PASSED' | 'FAILED' | 'WITHDRAWN';
  votesFor: number;
  votesAgainst: number;
  day?: number;
  createdAt: string;
}

export interface MunSpeaker {
  id: string;
  country: string;
  portfolio: string;
  delegateName: string;
  flagEmoji: string;
  status: 'queued' | 'speaking' | 'completed' | 'yielded';
  yieldType?: 'chair' | 'points_of_info' | 'another_delegate';
  timeRemaining?: number;
  speakingSeconds?: number;
  hasSpoken?: boolean;
  day?: number;
  listType?: 'GSL' | 'MOD' | 'UNMOD';
}

export interface MunParliamentaryPoint {
  id: string;
  committeeId: string;
  delegateName: string;
  country: string;
  flagEmoji: string;
  type: PointType;
  detail: string;
  status: 'pending' | 'recognized' | 'dismissed';
  timestamp: string;
}

export interface MunDraftResolution {
  id: string;
  committeeId: string;
  code: string;
  title: string;
  sponsors: string[];
  signatories: string[];
  preambulatoryClauses: string[];
  operativeClauses: string[];
  status: 'drafting' | 'introduced' | 'voting' | 'passed' | 'failed';
  day?: number;
  introducedAt?: string;
  passedAt?: string;
}

export interface MunSessionState {
  committeeId: string;
  sessionNumber: number;
  status: 'in_session' | 'caucus' | 'recess' | 'voting' | 'concluded';
  sessionMode: MunSessionMode;
  activeDay?: number;
  timer: {
    totalSeconds: number;
    remainingSeconds: number;
    isRunning: boolean;
    label: string;
    sessionType: MunSessionMode;
  };
  currentSpeaker: MunSpeaker | null;
  currentMotion: MunMotion | null;
  motionsQueue: MunMotion[];
  speakersList: MunSpeaker[];
  parliamentaryPoints: MunParliamentaryPoint[];
  resolutions: MunDraftResolution[];
  motionHistory?: Array<MunMotion & { day?: number; verdict?: 'passed' | 'failed' | 'withdrawn' | 'PASSED' | 'FAILED' | 'WITHDRAWN' }>;
  speakerHistory?: Array<MunSpeaker & { day?: number; listType?: 'GSL' | 'MOD' | 'UNMOD'; speakingSeconds?: number; hasSpoken?: boolean }>;
  passedBills?: Array<{ id: string; title: string; code: string; day?: number; sponsors?: string[]; passedAt: string; documentUrl?: string; fullText?: string; summary?: string }>;
  winnersSummary?: {
    bestDelegate?: string | { portfolio: string; delegateName?: string; school?: string };
    highCommendation?: string | { portfolio: string; delegateName?: string };
    specialMention?: string;
    specialMentions?: Array<{ portfolio: string; delegateName?: string }>;
    honorableMention?: string;
    bestPositionPaper?: string;
    bestChair?: string;
    customAwards?: Array<{
      id: string;
      title: string;
      recipientPortfolio: string;
      delegateName: string;
      citation?: string;
    }>;
    concludedAt?: string;
    verdictNotes?: string;
  };
}

/* ─────────── DELEGATE MUN EXPERIENCE & VERIFICATION DOSSIER ─────────── */

export type MunParticipationRole = 
  | 'DELEGATE'
  | 'delegate'
  | 'EXECUTIVE_BOARD'
  | 'executive_board'
  | 'SECRETARIAT'
  | 'secretariat'
  | 'HEAD_DELEGATE'
  | 'INTERNATIONAL_PRESS'
  | 'ORGANIZER_FOUNDER'
  | 'PANELIST_SPEAKER'
  | 'RESEARCHER_AUTHOR'
  | 'COMMUNITY_ORGANIZER';

export type MunAward = 
  | 'BEST_DELEGATE'
  | 'Best Delegate (Gavel)'
  | 'HIGH_COMMENDATION'
  | 'High Commendation'
  | 'SPECIAL_MENTION'
  | 'Special Mention'
  | 'HONORABLE_MENTION'
  | 'Honorable Mention'
  | 'VERBAL_MENTION'
  | 'BEST_CHAIR'
  | 'BEST_POSITION_PAPER'
  | 'PARTICIPATION'
  | string;

export type MunVerificationStatus = 
  | 'VERIFIED_SECRETARIAT'
  | 'VERIFIED_CERTIFICATE'
  | 'PENDING_VERIFICATION'
  | 'COMMUNITY_RATIFIED';

export interface MunExperienceRecord {
  id: string;
  userId: string;
  userHandle: string;
  munName: string;
  editionYear: string;
  role: MunParticipationRole;
  isHostedByMe: boolean;
  committee: string;
  portfolioOrTitle: string;
  award?: MunAward;
  agendaOrTopic?: string;
  verificationStatus: MunVerificationStatus;
  eventName?: string;
  eventId?: string;
  portfolio?: string;
  isVerified?: boolean;
  startDate?: string;
  endDate?: string;
  verificationProofUrl?: string;
  secretariatContactEmail?: string;
  certificateId?: string;
  verifiedAt?: string;
  createdAt?: string;
}

/* ─────────── LIVE CHAMBER VOTING & MULTI-MODE STAGES ─────────── */

export type ChamberCategory = 
  | 'MUN_COMMITTEE'
  | 'LOK_SABHA'
  | 'OPEN_MIC'
  | 'EP_101'
  | 'STORYLINE'
  | 'PITCH_STAGE'
  | 'GENERAL_VOTING'
  | 'OTHER';

export type VotingSessionType = 
  | 'mun_motion'
  | 'mun_resolution_rollcall'
  | 'lok_sabha_division'
  | 'open_mic_poll'
  | 'ep_101_pitch'
  | 'storyline_vote'
  | 'performer_rating'
  | 'pitch_evaluation'
  | 'quick_referendum'
  | 'other_vote';

export type VotingRuleMode = 
  | 'simple_majority'
  | 'two_thirds'
  | 'roll_call'
  | 'division_voice_vote'
  | 'star_rating'
  | 'single_choice'
  | 'multiple_choice';

export interface ChamberVoteOption {
  id: string;
  label: string;
  sublabel?: string;
  votes: number;
  voterHandles: string[];
}

export interface ChamberRollCallVote {
  country: string;
  delegateName: string;
  userHandle: string;
  flagEmoji: string;
  vote: 'yes' | 'no' | 'abstain' | 'pass';
  isVetoPower?: boolean;
  timestamp: string;
}

export interface ChamberRatingEntry {
  userId: string;
  userHandle: string;
  score: number; // 1 to 10 or 1 to 5
  feedback?: string;
  timestamp: string;
}

export interface ChamberVotingSession {
  id: string;
  chamberId: string;
  title: string;
  description?: string;
  category: VotingSessionType;
  ruleMode: VotingRuleMode;
  status: 'active' | 'closed';
  startedAt: string;
  durationSeconds: number;
  remainingSeconds: number;
  options: ChamberVoteOption[];
  rollCallVotes?: Record<string, ChamberRollCallVote>;
  ratings?: ChamberRatingEntry[];
  totalBallots: number;
  quorumMet?: boolean;
  passed?: boolean;
  resultSummary?: string;
  vetoTriggered?: boolean;
  performerTarget?: {
    id: string;
    name: string;
    actTitle: string;
  };
}

export interface StagePerformer {
  id: string;
  chamberId: string;
  performerName: string;
  userHandle: string;
  actTitle: string;
  genre: 'Poetry' | 'Music' | 'Standup' | 'Speech' | 'Startup Pitch' | 'Storytelling' | 'Debate';
  status: 'queued' | 'on_stage' | 'completed';
  durationMinutes: number;
  scores: ChamberRatingEntry[];
  averageScore?: number;
  totalVotes: number;
  joinedAt: string;
}

export interface ChamberRoom {
  id: string;
  title: string;
  category: ChamberCategory;
  agenda: string;
  shortCode: string;
  hostName: string;
  hostHandle: string;
  isLive: boolean;
  activeVotingSession?: ChamberVotingSession | null;
  votingHistory: ChamberVotingSession[];
  performersQueue: StagePerformer[];
  reactions: Array<{ id: string; emoji: string; count: number }>;
  createdAt: string;
}
