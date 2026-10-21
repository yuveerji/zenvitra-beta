import {
  ConferenceMaster,
  CommitteeLiveSummary,
  DelegateParticipationSummary,
  ConferenceAlert
} from '@/types/conference';

export const LS_ZEN_CONFERENCE = 'zenvitra_conference_state_v1';

export const ZENMUN_2026_MASTER: ConferenceMaster = {
  id: 'CONF-ZENMUN-2026',
  name: 'ZENVITRA Plenary Assembly',
  shortName: 'Plenary',
  edition: 'Official Conference Edition',
  dates: '17–19 October 2026',
  venue: 'International Conference Centre',
  status: 'LIVE',
  readinessScore: 100,
  creatorUsername: 'yuveer',
  creatorEmail: 'founder@zenvitra.xyz',
  authorizedRevenueViewers: ['payments', 'finance'],
  stats: {
    totalDelegates: 0,
    presentToday: 0,
    lateToday: 0,
    absentToday: 0,
    totalSpeeches: 0,
    totalPOIs: 0,
    totalMotions: 0,
    totalCaucuses: 0,
    documentsSubmitted: 0,
    votesConducted: 0
  },
  committees: [],
  alerts: []
};

export const INITIAL_DELEGATE_SUMMARIES: DelegateParticipationSummary[] = [];

// ─── REVENUE & FINANCIAL ACCESS CONTROL (CONSTITUTIONAL RBAC) ───

export const LS_REVENUE_PERMISSIONS = 'zenvitra_mun_revenue_access_v1';

export const PAYMENTS_TEAM_EMAILS = [
  'payments@zenvitra.xyz',
  'finance@zenvitra.xyz',
  'founder@zenvitra.xyz',
  'treasury@zenvitra.xyz',
  'founder@zenvitra.org'
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
    email === 'founder@zenvitra.xyz' ||
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
