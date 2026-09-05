import {
  ConferenceMaster,
  CommitteeLiveSummary,
  DelegateParticipationSummary,
  ConferenceAlert
} from '@/types/conference';

export const LS_ZEN_CONFERENCE = 'zenvitra_conference_state_v1';

export const ZENMUN_2026_MASTER: ConferenceMaster = {
  id: 'CONF-ZENMUN-2026',
  name: 'ZENMUN 2026 — Sovereign Youth Diplomatic Assembly',
  shortName: 'ZENMUN 2026',
  edition: 'Inaugural National Edition',
  dates: '17–19 October 2026',
  venue: 'Jaipur International Centre, Rajasthan',
  status: 'LIVE',
  readinessScore: 92,
  creatorUsername: 'yuveer',
  creatorEmail: 'founder@zenvitra.org',
  authorizedRevenueViewers: ['treasurer_zen', 'usg_finance'],
  stats: {
    totalDelegates: 486,
    presentToday: 451,
    lateToday: 21,
    absentToday: 14,
    totalSpeeches: 327,
    totalPOIs: 184,
    totalMotions: 96,
    totalCaucuses: 71,
    documentsSubmitted: 52,
    votesConducted: 18
  },
  committees: [
    {
      id: 'COMM-UNSC',
      name: 'United Nations Security Council',
      shortName: 'UNSC',
      room: 'Plenary Hall A',
      type: 'UN',
      totalDelegates: 15,
      presentCount: 15,
      chairName: 'Ananya Sharma (Chair)',
      currentSession: 'Moderated Caucus: AI Governance in Armed Conflict',
      currentSpeaker: 'France (01:12 remaining)',
      timeRemaining: '06:40',
      speechesCount: 42,
      motionsCount: 11,
      poisCount: 27,
      caucusesCount: 8,
      documentsCount: 6,
      activityScore: 89,
      status: 'LIVE'
    },
    {
      id: 'COMM-UNHRC',
      name: 'United Nations Human Rights Council',
      shortName: 'UNHRC',
      room: 'Committee Hall B',
      type: 'UN',
      totalDelegates: 30,
      presentCount: 28,
      chairName: 'Kabir Mehta (Chair)',
      currentSession: 'General Speakers List (GSL)',
      currentSpeaker: 'Germany (01:00 remaining)',
      timeRemaining: '14:20',
      speechesCount: 61,
      motionsCount: 18,
      poisCount: 34,
      caucusesCount: 12,
      documentsCount: 9,
      activityScore: 84,
      status: 'LIVE'
    },
    {
      id: 'COMM-WHO',
      name: 'World Health Assembly (WHO)',
      shortName: 'WHO',
      room: 'Assembly Hall C',
      type: 'UN',
      totalDelegates: 28,
      presentCount: 24,
      chairName: 'Riya Sengupta (Chair)',
      currentSession: 'Unmoderated Caucus: Pandemic Treaty Harmonization',
      currentSpeaker: 'Working Group 2 (Drafting Floor)',
      timeRemaining: '08:15',
      speechesCount: 48,
      motionsCount: 14,
      poisCount: 21,
      caucusesCount: 9,
      documentsCount: 8,
      activityScore: 74,
      status: 'LIVE',
      alerts: ['Attendance dropped by 14% post-lunch; 4 delegates pending roll-call return']
    },
    {
      id: 'COMM-LOKSABHA',
      name: 'Lok Sabha (House of the People)',
      shortName: 'Lok Sabha',
      room: 'Parliamentary Hall D',
      type: 'INDIAN_PARLIAMENT',
      totalDelegates: 40,
      presentCount: 38,
      chairName: 'Hon. Omkar Patil (Speaker of the House)',
      currentSession: 'Clause-by-Clause Debate: Digital Public Ledger Bill, 2026',
      currentSpeaker: 'Leader of Opposition (01:45 remaining)',
      timeRemaining: '18:30',
      speechesCount: 73,
      motionsCount: 23,
      poisCount: 41,
      caucusesCount: 15,
      documentsCount: 14,
      activityScore: 92,
      status: 'LIVE',
      alerts: ['Clause 3 debate running 27 minutes over allocated schedule']
    },
    {
      id: 'COMM-PRESS',
      name: 'International Press Corps',
      shortName: 'Press Corps',
      room: 'Media Operations Suite',
      type: 'PRESS',
      totalDelegates: 15,
      presentCount: 12,
      chairName: 'Tara Varma (Editor-in-Chief)',
      currentSession: 'Editorial Queue & Live Breaking Wire Despatches',
      currentSpeaker: 'Lead Diplomatic Correspondent (Briefing)',
      speechesCount: 103,
      motionsCount: 0,
      poisCount: 0,
      caucusesCount: 0,
      documentsCount: 15,
      activityScore: 88,
      status: 'LIVE',
      alerts: ['8 articles currently awaiting final editorial sign-off for wire distribution']
    }
  ],
  alerts: [
    {
      id: 'ALT-01',
      type: 'WARNING',
      committee: 'Lok Sabha',
      message: 'Bill debate has exceeded scheduled morning session time by 27 minutes.',
      timestamp: '11:42 AM',
      actionText: 'Adjust Session Schedule'
    },
    {
      id: 'ALT-02',
      type: 'NOTICE',
      committee: 'WHO',
      message: 'Attendance dropped by 14% post-lunch (4 delegates absent from caucus).',
      timestamp: '12:15 PM',
      actionText: 'Trigger Check-in Ping'
    },
    {
      id: 'ALT-03',
      type: 'NOTICE',
      committee: 'Press Corps',
      message: '8 articles awaiting editorial review for publication on ZENVITRA Press wire.',
      timestamp: '12:40 PM',
      actionText: 'Open Editorial Desk'
    }
  ]
};

export const INITIAL_DELEGATE_SUMMARIES: DelegateParticipationSummary[] = [
  {
    id: 'DEL-01',
    name: 'Aarav Sharma',
    countryOrPortfolio: 'India',
    committee: 'United Nations Security Council',
    schoolOrOrg: 'The Doon School',
    attendanceRate: '100%',
    speechesCount: 14,
    speakingTime: '18m 40s',
    poisRaised: 9,
    motionsProposed: 4,
    documentsAuthored: 3,
    votesCast: 6
  },
  {
    id: 'DEL-02',
    name: 'Ananya Singh',
    countryOrPortfolio: 'France',
    committee: 'United Nations Security Council',
    schoolOrOrg: 'Step by Step School',
    attendanceRate: '100%',
    speechesCount: 12,
    speakingTime: '15m 10s',
    poisRaised: 7,
    motionsProposed: 3,
    documentsAuthored: 2,
    votesCast: 6
  },
  {
    id: 'DEL-03',
    name: 'Vikramaditya Roy',
    countryOrPortfolio: 'Leader of Opposition',
    committee: 'Lok Sabha',
    schoolOrOrg: 'National Law School of India University',
    attendanceRate: '100%',
    speechesCount: 16,
    speakingTime: '24m 50s',
    poisRaised: 14,
    motionsProposed: 5,
    documentsAuthored: 4,
    votesCast: 8
  },
  {
    id: 'DEL-04',
    name: 'Pooja Nair',
    countryOrPortfolio: 'Chief Diplomatic Correspondent',
    committee: 'International Press Corps',
    schoolOrOrg: 'St. Xavier\'s College, Mumbai',
    attendanceRate: '100%',
    speechesCount: 11,
    speakingTime: '12m 00s',
    poisRaised: 0,
    motionsProposed: 0,
    documentsAuthored: 6,
    votesCast: 0
  }
];

// ─── REVENUE & FINANCIAL ACCESS CONTROL (CONSTITUTIONAL RBAC) ───

export const LS_REVENUE_PERMISSIONS = 'zenvitra_mun_revenue_access_v1';

export const PAYMENTS_TEAM_EMAILS = [
  'payments@zenvitra.org',
  'finance@zenvitra.org',
  'founder@zenvitra.org',
  'treasury@zenvitra.org'
];

export const PAYMENTS_TEAM_USERNAMES = [
  'payments',
  'finance',
  'founder',
  'treasury',
  'yuveer'
];

export interface RevenueAccessCheckResult {
  allowed: boolean;
  role: 'CREATOR' | 'PAYMENTS_TEAM' | 'CHOSEN_BY_CREATOR' | 'UNAUTHORIZED';
  description: string;
}

export function checkRevenueAccess(
  user: {
    username?: string | null;
    email?: string | null;
    role?: string | null;
  } | null | undefined,
  conference: ConferenceMaster = ZENMUN_2026_MASTER
): RevenueAccessCheckResult {
  if (!user) {
    return {
      allowed: false,
      role: 'UNAUTHORIZED',
      description: 'You must be authenticated with sovereign credentials to view confidential revenue telemetry.'
    };
  }

  const username = (user.username || '').toLowerCase().trim().replace(/^@/, '');
  const email = (user.email || '').toLowerCase().trim();
  const userRole = (user.role || '').toLowerCase().trim();

  // 1. Creator of MUN
  const creatorUser = (conference.creatorUsername || '').toLowerCase().trim().replace(/^@/, '');
  const creatorEmail = (conference.creatorEmail || '').toLowerCase().trim();
  if (
    (creatorUser && username && username === creatorUser) ||
    (creatorEmail && email && email === creatorEmail) ||
    username === 'yuveer' ||
    email === 'founder@zenvitra.org'
  ) {
    return {
      allowed: true,
      role: 'CREATOR',
      description: 'Full Sovereign MUN Creator Authority'
    };
  }

  // 2. Payments Team
  if (
    userRole === 'payments_team' ||
    userRole === 'finance' ||
    userRole === 'admin' ||
    (email && PAYMENTS_TEAM_EMAILS.includes(email)) ||
    (username && PAYMENTS_TEAM_USERNAMES.includes(username))
  ) {
    return {
      allowed: true,
      role: 'PAYMENTS_TEAM',
      description: 'ZENVITRA Platform Payments & Settlement Node'
    };
  }

  // 3. People Chosen by Creator of MUN (from conference config + local persistence)
  let chosenUsers = [...(conference.authorizedRevenueViewers || [])];
  if (typeof window !== 'undefined') {
    try {
      const stored = localStorage.getItem(`${LS_REVENUE_PERMISSIONS}_${conference.id}`);
      if (stored) {
        const parsed = JSON.parse(stored);
        if (Array.isArray(parsed)) {
          chosenUsers = [...chosenUsers, ...parsed];
        }
      }
    } catch (_) {}
  }

  const normalizedChosen = chosenUsers.map((u) => u.toLowerCase().trim().replace(/^@/, ''));
  if (
    (username && normalizedChosen.includes(username)) ||
    (email && normalizedChosen.includes(email))
  ) {
    return {
      allowed: true,
      role: 'CHOSEN_BY_CREATOR',
      description: 'Authorized by Conference Head & Secretariat'
    };
  }

  return {
    allowed: false,
    role: 'UNAUTHORIZED',
    description: 'Revenue telemetry is restricted strictly to the MUN Creator, the ZENVITRA Payments Team, and individuals delegated by the Conference Head.'
  };
}
