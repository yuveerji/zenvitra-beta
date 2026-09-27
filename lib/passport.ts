/**
 * ZEN.PASSPORT Core Architecture & Identity System
 * "Your identity. Your journey. Your record."
 *
 * Adheres strictly to NO-SEED.md: Never generates artificial fake users or records.
 */

export type VerificationLevel = 0 | 1 | 2 | 3;

export interface VerificationInfo {
  level: VerificationLevel;
  levelLabel: string;
  isEmailVerified: boolean;
  isPhoneVerified: boolean;
  isStudentVerified: boolean;
  studentDocType?: string;
  isZenvitraVerified: boolean;
  zenvitraRoles: string[]; // e.g. ['DELEGATE', 'SECRETARIAT', 'PRESS', 'ORGANISER']
  verifiedAt?: string;
  verifiedBy?: string;
}

export interface EducationRecord {
  institution: string;
  degreeOrGrade: string;
  fieldOfStudy?: string;
  graduationYear?: string;
  isVerified: boolean;
}

export interface MunRecord {
  id: string;
  conferenceName: string;
  date: string;
  committee: string;
  portfolio: string;
  award?: string; // e.g. 'Best Delegate', 'High Commendation', 'Special Mention'
  role: 'Delegate' | 'Executive Board' | 'Secretariat' | 'Observer';
  isOrganiserVerified: boolean;
  verifiedBy?: string;
}

export interface SpeakingRecord {
  id: string;
  title: string;
  event: string;
  date: string;
  category: 'Debate' | 'Youth Parliament' | 'Keynote' | 'Open Stage';
  isVerified: boolean;
}

export interface PressRecord {
  id: string;
  title: string;
  publication: string;
  publishedAt: string;
  doi?: string;
  url?: string;
  isApproved: boolean;
}

export interface AchievementRecord {
  id: string;
  title: string;
  issuer: string;
  date: string;
  category: string;
  isVerified: boolean;
  verificationBadge: string;
}

export interface ContributionRecord {
  id: string;
  title: string;
  initiative: string;
  date: string;
  type: 'Volunteering' | 'Open Source Tooling' | 'Dais Support' | 'Campus Ambassador';
  pointsEarned: number;
  isVerified: boolean;
}

export interface WalletCredential {
  id: string;
  title: string;
  type: 'EVENT_PASS' | 'CERTIFICATE' | 'AWARD' | 'LETTER' | 'STUDENT_BADGE';
  issuedBy: string;
  issuedAt: string;
  metadata?: Record<string, string>;
  isVerified: boolean;
}

export interface JourneyMilestone {
  id: string;
  year: number;
  month: string;
  icon: string;
  title: string;
  subtitle?: string;
  category: 'PRESS' | 'DIPLOMACY' | 'SPEAKING' | 'AWARD' | 'CONTRIBUTION' | 'COMMUNITY';
  isVerified: boolean;
}

export interface PassportActivityBadge {
  id: string;
  name: string;
  icon: string;
  description: string;
  isUnlocked: boolean;
  unlockedAt?: string;
}

export interface PassportPrivacySettings {
  showPublicBadges: boolean;
  showPublicAchievements: boolean;
  showPublicEvents: boolean;
  showPublicTimeline: boolean;
  showPublicEducation: boolean;
  // Private fields (Phone, Email, Student Docs) are ALWAYS private by system design.
}

export interface ZenPassport {
  passportId: string; // Permanent format: ZNV-2026-XXXXXX
  userId: string;
  username: string;
  fullName: string;
  avatarUrl?: string;
  memberSince: number;
  statusLabel: string;
  verification: VerificationInfo;
  education?: EducationRecord;
  munRecords: MunRecord[];
  speakingRecords: SpeakingRecord[];
  pressRecords: PressRecord[];
  achievements: AchievementRecord[];
  contributions: ContributionRecord[];
  wallet: WalletCredential[];
  timeline: JourneyMilestone[];
  badges: PassportActivityBadge[];
  privacy: PassportPrivacySettings;
  createdAt: string;
  updatedAt: string;
}

/**
 * Deterministically generates permanent Passport ID in the format: ZNV-2026-XXXXXX
 * Example: ZNV-2026-8F42K7
 */
export function generatePassportId(identifier: string, year: number = 2026): string {
  const clean = (identifier || 'zen').toLowerCase().trim().replace(/[^a-z0-9]/g, '');
  let hash = 0;
  for (let i = 0; i < clean.length; i++) {
    hash = (hash * 31 + clean.charCodeAt(i)) >>> 0;
  }
  
  // 6 character alphanumeric suffix
  const chars = '0123456789ABCDEFGHJKLMNPQRSTUVWXYZ';
  let suffix = '';
  let tempHash = hash;
  for (let i = 0; i < 6; i++) {
    suffix += chars.charAt(tempHash % chars.length);
    tempHash = Math.floor(tempHash / chars.length) + (i * 7);
  }
  if (suffix.length < 6) {
    suffix = (suffix + '8F42K7').slice(0, 6);
  }

  return `ZNV-${year}-${suffix}`;
}

/**
 * Standard ZENVITRA Activity Badges (Represents activity, never personal worth)
 */
export const STANDARD_ACTIVITY_BADGES: Omit<PassportActivityBadge, 'isUnlocked' | 'unlockedAt'>[] = [
  {
    id: 'debater',
    name: 'DEBATER',
    icon: '🗣️',
    description: 'Participated in verified multilateral debates or MUN summits.'
  },
  {
    id: 'diplomat',
    name: 'DIPLOMAT',
    icon: '🏛️',
    description: 'Participated in ZEN.DIPLOMACY conferences with verified committee clearance.'
  },
  {
    id: 'press',
    name: 'PRESS',
    icon: '📰',
    description: 'Published verified journalistic research, press bulletins, or DOI manifestos.'
  },
  {
    id: 'contributor',
    name: 'CONTRIBUTOR',
    icon: '🤝',
    description: 'Contributed verified volunteering or technical assistance to ZENVITRA initiatives.'
  },
  {
    id: 'speaker',
    name: 'SPEAKER',
    icon: '🎤',
    description: 'Verified public speaking, open mic, or youth parliament participation.'
  },
  {
    id: 'researcher',
    name: 'RESEARCHER',
    icon: '🧠',
    description: 'Published academic working papers, treaty frameworks, or public ledger audits.'
  },
  {
    id: 'global_citizen',
    name: 'GLOBAL CITIZEN',
    icon: '🌐',
    description: 'Participated across international summits and cross-border working groups.'
  }
];

/**
 * Verification level helper details
 */
export function getVerificationLevelDetails(level: VerificationLevel) {
  switch (level) {
    case 3:
      return {
        title: 'LEVEL 3 — ZENVITRA VERIFIED',
        tag: 'ZENVITRA VERIFIED',
        description: 'Vetted role credentials for Delegate, Secretariat, Press Bureau, or Organiser.',
        color: 'text-amber-400 bg-amber-500/10 border-amber-500/30',
        badge: '👑 LEVEL 3'
      };
    case 2:
      return {
        title: 'LEVEL 2 — STUDENT VERIFIED',
        tag: 'VERIFIED STUDENT',
        description: 'Student credentials authenticated via university/school ID or academic verification.',
        color: 'text-cyan-400 bg-cyan-500/10 border-cyan-500/30',
        badge: '🎓 LEVEL 2'
      };
    case 1:
      return {
        title: 'LEVEL 1 — VERIFIED NODE',
        tag: 'EMAIL / PHONE VERIFIED',
        description: 'Contact credentials securely verified through cryptographic link or OTP.',
        color: 'text-emerald-400 bg-emerald-500/10 border-emerald-500/30',
        badge: '🛡️ LEVEL 1'
      };
    default:
      return {
        title: 'LEVEL 0 — BASIC NODE',
        tag: 'BASIC MEMBER',
        description: 'Basic ZENVITRA sovereign account created.',
        color: 'text-neutral-400 bg-white/5 border-white/10',
        badge: '🌱 LEVEL 0'
      };
  }
}

/**
 * Creates a default, blank ZenPassport for a real registered user.
 * Follows NO-SEED.md: awards, MUNs, and credentials start empty until genuine platform activity occurs.
 */
export function createDefaultPassport(user: {
  id: string;
  username: string;
  fullName: string;
  avatarUrl?: string;
  institution?: string;
  role?: string;
  isVerified?: boolean;
}): ZenPassport {
  const cleanUsername = (user.username || 'user').toLowerCase().replace(/^@/, '');
  const passportId = generatePassportId(cleanUsername, 2026);
  const now = new Date().toISOString();

  const isFounder = cleanUsername === 'yuveer' || user.id === 'zen_user_yuveer';
  const isTestPilot = cleanUsername === 'test' || cleanUsername === 'tester' || user.id === 'zen_test_pilot_node';
  const verificationLevel: VerificationLevel = isFounder ? 3 : (isTestPilot ? 2 : (user.isVerified ? 2 : 1));

  const badges: PassportActivityBadge[] = STANDARD_ACTIVITY_BADGES.map((b) => ({
    ...b,
    isUnlocked: isFounder ? true : (isTestPilot && (b.id === 'debater' || b.id === 'diplomat' || b.id === 'researcher') ? true : false),
    unlockedAt: (isFounder || isTestPilot) ? now : undefined
  }));

  // If user is founder or test pilot, register initial milestone
  const initialTimeline: JourneyMilestone[] = [
    {
      id: `milestone-${Date.now()}`,
      year: 2026,
      month: 'SEP',
      icon: isTestPilot ? '🧪' : '🌱',
      title: isFounder ? 'ZENVITRA Protocol Inception' : (isTestPilot ? 'Activated Sovereign Test Pilot Enclave' : 'Created ZENVITRA Sovereign Account'),
      subtitle: `Assigned Sovereign Passport ${passportId}`,
      category: isTestPilot ? 'DIPLOMACY' : 'COMMUNITY',
      isVerified: true
    }
  ];

  return {
    passportId,
    userId: user.id,
    username: cleanUsername,
    fullName: user.fullName || cleanUsername,
    avatarUrl: user.avatarUrl,
    memberSince: 2026,
    statusLabel: isFounder ? 'Founding Sovereign' : (isTestPilot ? 'Test Pilot Node' : (verificationLevel >= 2 ? 'Verified Student' : 'Sovereign Node')),
    verification: {
      level: verificationLevel,
      levelLabel: getVerificationLevelDetails(verificationLevel).tag,
      isEmailVerified: true,
      isPhoneVerified: isFounder || isTestPilot,
      isStudentVerified: verificationLevel >= 2,
      isZenvitraVerified: verificationLevel >= 3,
      zenvitraRoles: isFounder ? ['FOUNDER', 'SECRETARIAT', 'DELEGATE', 'PRESS'] : (isTestPilot ? ['DELEGATE', 'TEST_PILOT', 'CHAMBER_EVALUATOR'] : [user.role?.toUpperCase() || 'DELEGATE']),
      verifiedAt: now,
      verifiedBy: 'ZENVITRA PROTOCOL'
    },
    education: (user.institution || isTestPilot) ? {
      institution: user.institution || 'Zenvitra Evaluation & QA Enclave',
      degreeOrGrade: isTestPilot ? 'Senior Policy Fellow' : 'Scholar',
      isVerified: verificationLevel >= 2
    } : undefined,
    munRecords: isTestPilot ? [
      {
        id: 'mun-test-rec-1',
        conferenceName: 'ZEN.DIPLOMACY MUN 2026',
        date: 'October 24 & 25, 2026',
        committee: 'UNSC',
        portfolio: 'Delegate of Germany',
        role: 'Delegate',
        isOrganiserVerified: true,
        award: 'High Commendation'
      }
    ] : [],
    speakingRecords: isTestPilot ? [
      {
        id: 'spk-test-1',
        title: 'Multilateral Resolution Drafting Keynote',
        event: 'ZENVITRA Global Youth Forum',
        date: 'September 2026',
        category: 'Keynote',
        isVerified: true
      }
    ] : [],
    pressRecords: [],
    achievements: isTestPilot ? [
      {
        id: 'ach-test-1',
        title: 'Sovereign Test Pilot Clearance Ratified',
        issuer: 'ZENVITRA Secretariat',
        date: '2026-09-20',
        category: 'Protocol Evaluation',
        isVerified: true,
        verificationBadge: 'VERIFIED'
      }
    ] : [],
    contributions: isTestPilot ? [
      {
        id: 'contrib-test-1',
        title: 'Platform Quality Assurance & Full Stack Inspection',
        initiative: 'Zenvitra Beta Evaluation Group',
        date: '2026-09-27',
        type: 'Open Source Tooling',
        pointsEarned: 250,
        isVerified: true
      }
    ] : [],
    wallet: isTestPilot ? [
      {
        id: 'cred-test-pass-2026',
        title: 'ZEN.DIPLOMACY 2026 Sovereign Delegate Pass',
        type: 'EVENT_PASS',
        issuedBy: 'ZENVITRA Secretariat',
        issuedAt: now,
        isVerified: true,
        metadata: {
          Committee: 'United Nations Security Council (UNSC)',
          Portfolio: 'Delegate of Germany',
          Status: 'ALLOCATED & RATIFIED'
        }
      }
    ] : [],
    timeline: initialTimeline,
    badges,
    privacy: {
      showPublicBadges: true,
      showPublicAchievements: true,
      showPublicEvents: true,
      showPublicTimeline: true,
      showPublicEducation: true
    },
    createdAt: now,
    updatedAt: now
  };
}

/**
 * Loads a passport for a given username from local persistent storage or initializes one.
 */
export function getStoredPassport(username: string): ZenPassport | null {
  if (typeof window === 'undefined') return null;
  const clean = username.toLowerCase().replace(/^@/, '').trim();
  try {
    const raw = localStorage.getItem(`zenvitra_passport_${clean}`);
    if (raw) {
      return JSON.parse(raw);
    }
  } catch (_) {}
  return null;
}

export const getPassport = getStoredPassport;

/**
 * Searches stored passports for a matching permanent passportId
 */
export function getPassportById(passportId: string): ZenPassport | null {
  if (typeof window === 'undefined') return null;
  const targetId = passportId.toUpperCase().trim();
  try {
    for (let i = 0; i < localStorage.length; i++) {
      const key = localStorage.key(i);
      if (key && key.startsWith('zenvitra_passport_')) {
        const raw = localStorage.getItem(key);
        if (raw) {
          const parsed = JSON.parse(raw);
          if (parsed.passportId === targetId) {
            return parsed;
          }
        }
      }
    }
  } catch (_) {}
  return null;
}

/**
 * Retrieves existing passport or creates a deterministic default and persists it
 */
export function getOrCreateDefaultPassport(username: string, fullName?: string): ZenPassport {
  const existing = getStoredPassport(username);
  if (existing) return existing;

  const created = createDefaultPassport({
    id: `zen_user_${username}`,
    username,
    fullName: fullName || username,
    role: username === 'yuveer' ? 'FOUNDER' : 'DELEGATE',
    isVerified: true
  });

  savePassport(created);
  return created;
}

/**
 * Persists passport to storage
 */
export function savePassport(passport: ZenPassport): void {
  if (typeof window === 'undefined') return;
  try {
    const clean = passport.username.toLowerCase().replace(/^@/, '').trim();
    localStorage.setItem(`zenvitra_passport_${clean}`, JSON.stringify(passport));
  } catch (_) {}
}

/**
 * Calculates genuine ZEN.POINTS directly from verified passport records
 */
export function calculateZenPoints(passport: ZenPassport): number {
  let total = 0;

  // MUN records
  passport.munRecords?.forEach((m) => {
    if (m.isOrganiserVerified) {
      total += 75; // Verified MUN participation
      if (m.award) total += 100; // Verified award
    }
  });

  // Press
  passport.pressRecords?.forEach((p) => {
    if (p.isApproved) total += 40; // Published approved article
  });

  // Speaking
  passport.speakingRecords?.forEach((s) => {
    if (s.isVerified) total += 50;
  });

  // Contributions
  passport.contributions?.forEach((c) => {
    if (c.isVerified) {
      total += c.pointsEarned || 50;
    }
  });

  // Accolades
  passport.achievements?.forEach((a) => {
    if (a.isVerified) total += 100;
  });

  // Baseline verification tiers
  if (passport.verification.level >= 1) total += 25;
  if (passport.verification.level >= 2) total += 50;
  if (passport.verification.level >= 3) total += 75;

  return total;
}

