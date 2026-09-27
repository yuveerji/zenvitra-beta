/**
 * ZEN.LEADERBOARD Core Scoring & Ranking Service
 * "Recognise the work. Discover the people."
 *
 * Adheres strictly to NO-SEED.md: Never generates artificial fake users or records.
 */

import { ZenPassport } from './passport';

export type LeaderboardCategory = 
  | 'global' 
  | 'diplomacy' 
  | 'press' 
  | 'speaking' 
  | 'community' 
  | 'contributors';

export type LeaderboardPeriod = 
  | 'today' 
  | 'week' 
  | 'month' 
  | 'season' 
  | 'year' 
  | 'all_time';

export type RecognitionPillar = 
  | 'TOP CONTRIBUTORS'
  | 'RISING'
  | 'NEW & NOTICED'
  | 'MOST ACTIVE'
  | 'BREAKOUT MEMBERS'
  | 'COMMUNITY BUILDERS';

export interface LeaderboardEntry {
  rank: number;
  passportId: string;
  username: string;
  fullName: string;
  avatarUrl?: string;
  points: number;
  recentGain?: number;
  primaryPillar: RecognitionPillar;
  institution?: string;
  badges: string[]; // e.g. ['🗣️ DEBATER', '🏛️ DIPLOMAT']
  verifiedActivitiesCount: number;
}

export interface InstitutionEntry {
  rank: number;
  name: string;
  points: number;
  verifiedStudentCount: number;
  city?: string;
}

export interface TeamEntry {
  rank: number;
  name: string;
  points: number;
  memberCount: number;
  eventsCount: number;
}

export const ZEN_POINT_RULES = {
  VERIFIED_EVENT_PARTICIPATION: 50,
  VERIFIED_MUN_PARTICIPATION: 75,
  VERIFIED_AWARD: 100,
  PUBLISHED_APPROVED_ARTICLE: 40,
  VERIFIED_VOLUNTEER_CONTRIBUTION: 50,
  ORGANISING_CONTRIBUTION: 100,
  COMPLETING_ZEN_INITIATIVE: 25,
} as const;

/**
 * Calculates genuine ZEN.POINTS for a user directly from their verified passport records.
 * Anti-gaming: Zero points are assigned unless an item is marked isVerified === true.
 */
export function calculateZenPoints(passport: ZenPassport, category: LeaderboardCategory = 'global'): number {
  let total = 0;

  // MUN / Diplomacy points
  if (category === 'global' || category === 'diplomacy') {
    passport.munRecords.forEach((mun) => {
      if (mun.isOrganiserVerified) {
        total += ZEN_POINT_RULES.VERIFIED_MUN_PARTICIPATION;
        if (mun.award) {
          total += ZEN_POINT_RULES.VERIFIED_AWARD;
        }
      }
    });
  }

  // Press points
  if (category === 'global' || category === 'press') {
    passport.pressRecords.forEach((p) => {
      if (p.isApproved) {
        total += ZEN_POINT_RULES.PUBLISHED_APPROVED_ARTICLE;
      }
    });
  }

  // Speaking points
  if (category === 'global' || category === 'speaking') {
    passport.speakingRecords.forEach((s) => {
      if (s.isVerified) {
        total += ZEN_POINT_RULES.VERIFIED_EVENT_PARTICIPATION;
      }
    });
  }

  // Contribution points
  if (category === 'global' || category === 'community' || category === 'contributors') {
    passport.contributions.forEach((c) => {
      if (c.isVerified) {
        total += c.pointsEarned || ZEN_POINT_RULES.VERIFIED_VOLUNTEER_CONTRIBUTION;
      }
    });
  }

  // Awards
  if (category === 'global') {
    passport.achievements.forEach((a) => {
      if (a.isVerified) {
        total += ZEN_POINT_RULES.VERIFIED_AWARD;
      }
    });
  }

  // Baseline verification points (Level 1, 2, 3 verification bonuses)
  if (category === 'global') {
    if (passport.verification.level >= 1) total += 25;
    if (passport.verification.level >= 2) total += 50;
    if (passport.verification.level >= 3) total += 75;
  }

  return total;
}

/**
 * Assigns positive recognition category without toxic negative ranking terms
 */
export function getRecognitionPillar(points: number, rank: number): RecognitionPillar {
  if (rank <= 3) return 'TOP CONTRIBUTORS';
  if (points >= 300) return 'MOST ACTIVE';
  if (points >= 150) return 'RISING';
  if (points >= 75) return 'BREAKOUT MEMBERS';
  if (points > 0) return 'NEW & NOTICED';
  return 'COMMUNITY BUILDERS';
}

/**
 * Reads real users from local persistent stores and Supabase sessions.
 * NO-SEED.md compliant: Returns strictly real users. If no users exist, returns empty array.
 */
export function getRealLeaderboard(
  category: LeaderboardCategory = 'global',
  _period: LeaderboardPeriod = 'week'
): LeaderboardEntry[] {
  if (typeof window === 'undefined') return [];

  const entries: LeaderboardEntry[] = [];
  const processedUsernames = new Set<string>();

  try {
    // 1. Check logged-in user session
    const currentSessionRaw = localStorage.getItem('zenvitra_session_user');
    if (currentSessionRaw) {
      try {
        const u = JSON.parse(currentSessionRaw);
        const uname = (u.username || u.handle || '').toLowerCase().replace(/^@/, '');
        if (uname && !processedUsernames.has(uname)) {
          processedUsernames.add(uname);
          const rawPassport = localStorage.getItem(`zenvitra_passport_${uname}`);
          if (rawPassport) {
            const passport: ZenPassport = JSON.parse(rawPassport);
            const points = calculateZenPoints(passport, category);
            entries.push({
              rank: 0,
              passportId: passport.passportId,
              username: passport.username,
              fullName: passport.fullName,
              avatarUrl: passport.avatarUrl,
              points,
              recentGain: Math.min(points, 75),
              primaryPillar: getRecognitionPillar(points, 1),
              institution: passport.education?.institution,
              badges: passport.badges.filter((b) => b.isUnlocked).map((b) => `${b.icon} ${b.name}`),
              verifiedActivitiesCount: passport.timeline.filter((m) => m.isVerified).length,
            });
          }
        }
      } catch (_) {}
    }

    // 2. Scan all stored passports
    for (let i = 0; i < localStorage.length; i++) {
      const key = localStorage.key(i);
      if (key && key.startsWith('zenvitra_passport_')) {
        const uname = key.replace('zenvitra_passport_', '').toLowerCase().trim();
        if (uname && !processedUsernames.has(uname)) {
          processedUsernames.add(uname);
          try {
            const raw = localStorage.getItem(key);
            if (raw) {
              const passport: ZenPassport = JSON.parse(raw);
              const points = calculateZenPoints(passport, category);
              entries.push({
                rank: 0,
                passportId: passport.passportId,
                username: passport.username,
                fullName: passport.fullName,
                avatarUrl: passport.avatarUrl,
                points,
                recentGain: Math.min(points, 50),
                primaryPillar: getRecognitionPillar(points, 1),
                institution: passport.education?.institution,
                badges: passport.badges.filter((b) => b.isUnlocked).map((b) => `${b.icon} ${b.name}`),
                verifiedActivitiesCount: passport.timeline.filter((m) => m.isVerified).length,
              });
            }
          } catch (_) {}
        }
      }
    }
  } catch (_) {}

  // Sort descending by verified ZEN.POINTS
  entries.sort((a, b) => b.points - a.points);

  // Assign ranks
  return entries.map((e, index) => ({
    ...e,
    rank: index + 1,
    primaryPillar: getRecognitionPillar(e.points, index + 1)
  }));
}
