// ─── ZEN.MUN CONFERENCE & INTELLIGENCE TYPE SYSTEM ───

export type ConferenceStatus = 
  | 'DRAFT' 
  | 'SETUP' 
  | 'REGISTRATION_OPEN' 
  | 'REGISTRATION_CLOSED' 
  | 'LIVE' 
  | 'CONCLUDED' 
  | 'ARCHIVED';

export type CommitteeTypeCategory = 
  | 'UN' 
  | 'INDIAN_PARLIAMENT' 
  | 'PRESS' 
  | 'CRISIS';

export interface ConferenceStats {
  totalDelegates: number;
  presentToday: number;
  lateToday: number;
  absentToday: number;
  totalSpeeches: number;
  totalPOIs: number;
  totalMotions: number;
  totalCaucuses: number;
  documentsSubmitted: number;
  votesConducted: number;
}

export interface CommitteeLiveSummary {
  id: string;
  name: string;
  shortName: string;
  room: string;
  type: CommitteeTypeCategory;
  totalDelegates: number;
  presentCount: number;
  chairName: string;
  currentSession: string;       // e.g. "Moderated Caucus (Climate Financing)", "GSL", "Clause-by-Clause Debate"
  currentSpeaker: string;       // e.g. "France (01:14)", "Leader of the Opposition"
  timeRemaining?: string;
  speechesCount: number;
  motionsCount: number;
  poisCount: number;
  caucusesCount: number;
  documentsCount: number;
  activityScore: number;        // 0 to 100
  status: 'LIVE' | 'PAUSED' | 'BREAK' | 'CONCLUDED';
  alerts?: string[];
}

export interface DelegateParticipationSummary {
  id: string;
  name: string;
  countryOrPortfolio: string;
  committee: string;
  schoolOrOrg: string;
  attendanceRate: string;
  speechesCount: number;
  speakingTime: string;
  poisRaised: number;
  motionsProposed: number;
  documentsAuthored: number;
  votesCast: number;
}

export interface ConferenceAlert {
  id: string;
  type: 'CRITICAL' | 'WARNING' | 'NOTICE';
  committee: string;
  message: string;
  timestamp: string;
  actionText?: string;
}

export interface ConferenceMaster {
  id: string;
  name: string;
  shortName: string;
  edition: string;
  dates: string;
  venue: string;
  status: ConferenceStatus;
  readinessScore: number;
  creatorUsername: string;
  creatorEmail?: string;
  authorizedRevenueViewers?: string[];
  stats: ConferenceStats;
  committees: CommitteeLiveSummary[];
  alerts: ConferenceAlert[];
}
