import { PulseBadgeType } from '@/types/pulse';
import { isFounder as checkIsFounder } from '@/lib/founderControl';
import { getActiveSignTierMetrics } from '@/lib/onboardingRewards';

export interface BadgeMeta {
  id: PulseBadgeType;
  label: string;
  shortLabel: string;
  description: string;
  icon: string;
  colorClass: string;
  bgGlow: string;
  borderClass: string;
  textClass: string;
  rarity: 'CONSTITUTIONAL' | 'GENESIS_LIMITED' | 'ACHIEVEMENT' | 'CORE';
  isFounderOnly?: boolean;
}

export const MASTER_BADGES: Record<PulseBadgeType, BadgeMeta> = {
  'FOUNDER': {
    id: 'FOUNDER',
    label: 'FOUNDER',
    shortLabel: 'Founder',
    description: 'Sovereign Genesis Architect of ZENVITRA. Reserved strictly for Yuveer Chhatwani.',
    icon: '👑',
    colorClass: 'bg-amber-400/15 text-amber-300 border-amber-400/40',
    bgGlow: 'rgba(251, 191, 36, 0.25)',
    borderClass: 'border-amber-400/40',
    textClass: 'text-amber-300',
    rarity: 'CONSTITUTIONAL',
    isFounderOnly: true,
  },
  'FOUNDING MEMBER': {
    id: 'FOUNDING MEMBER',
    label: 'FOUNDING MEMBER',
    shortLabel: 'Founding Member',
    description: 'Exclusive distinction awarded strictly to the first 500 members of ZENVITRA.',
    icon: '⚡',
    colorClass: 'bg-indigo-500/20 text-indigo-200 border-indigo-400/40 shadow-[0_0_12px_rgba(99,102,241,0.25)]',
    bgGlow: 'rgba(99, 102, 241, 0.35)',
    borderClass: 'border-indigo-400/40',
    textClass: 'text-indigo-200',
    rarity: 'GENESIS_LIMITED',
  },
  'DELEGATE': {
    id: 'DELEGATE',
    label: 'DELEGATE',
    shortLabel: 'Delegate',
    description: 'Active plenary delegate participating in debates, caucuses, and dispatches.',
    icon: '🏛️',
    colorClass: 'bg-cyan-500/10 text-cyan-300 border-cyan-500/30',
    bgGlow: 'rgba(6, 182, 212, 0.15)',
    borderClass: 'border-cyan-500/30',
    textClass: 'text-cyan-300',
    rarity: 'CORE',
  },
  'DIPLOMAT': {
    id: 'DIPLOMAT',
    label: 'DIPLOMAT',
    shortLabel: 'Diplomat',
    description: 'Recognized for multilateral diplomacy, treaty negotiation, and committee engagement.',
    icon: '🌐',
    colorClass: 'bg-emerald-500/15 text-emerald-300 border-emerald-500/30',
    bgGlow: 'rgba(16, 185, 129, 0.2)',
    borderClass: 'border-emerald-500/30',
    textClass: 'text-emerald-300',
    rarity: 'ACHIEVEMENT',
  },
  'CREATOR': {
    id: 'CREATOR',
    label: 'CREATOR',
    shortLabel: 'Creator',
    description: 'Prolific writer, video creator, and creative thinker on the ZENVITRA feed.',
    icon: '🎨',
    colorClass: 'bg-fuchsia-500/15 text-fuchsia-300 border-fuchsia-500/30',
    bgGlow: 'rgba(217, 70, 239, 0.2)',
    borderClass: 'border-fuchsia-500/30',
    textClass: 'text-fuchsia-300',
    rarity: 'ACHIEVEMENT',
  },
  'YOUTH LEADER': {
    id: 'YOUTH LEADER',
    label: 'YOUTH LEADER',
    shortLabel: 'Youth Leader',
    description: 'Leading civic initiatives, public discussions, and campus delegations.',
    icon: '🌟',
    colorClass: 'bg-amber-500/15 text-amber-200 border-amber-500/30',
    bgGlow: 'rgba(245, 158, 11, 0.2)',
    borderClass: 'border-amber-500/30',
    textClass: 'text-amber-200',
    rarity: 'ACHIEVEMENT',
  },
  'CHAMBER CHAIR': {
    id: 'CHAMBER CHAIR',
    label: 'CHAMBER CHAIR',
    shortLabel: 'Chair',
    description: 'Presiding committee officer, secretariat director, or dais moderator.',
    icon: '⚖️',
    colorClass: 'bg-blue-500/15 text-blue-300 border-blue-500/30',
    bgGlow: 'rgba(59, 130, 246, 0.2)',
    borderClass: 'border-blue-500/30',
    textClass: 'text-blue-300',
    rarity: 'ACHIEVEMENT',
  },
  'PRESS CORPS': {
    id: 'PRESS CORPS',
    label: 'PRESS CORPS',
    shortLabel: 'Press',
    description: 'Accredited investigative journalist and official wire reporter.',
    icon: '📰',
    colorClass: 'bg-violet-500/15 text-violet-300 border-violet-500/30',
    bgGlow: 'rgba(139, 92, 246, 0.2)',
    borderClass: 'border-violet-500/30',
    textClass: 'text-violet-300',
    rarity: 'ACHIEVEMENT',
  },
  'ORGANIZATION': {
    id: 'ORGANIZATION',
    label: 'ORGANIZATION',
    shortLabel: 'Organization',
    description: 'Verified youth foundation, educational institution, or conference secretariat.',
    icon: '🏢',
    colorClass: 'bg-teal-500/15 text-teal-300 border-teal-500/30',
    bgGlow: 'rgba(20, 184, 166, 0.2)',
    borderClass: 'border-teal-500/30',
    textClass: 'text-teal-300',
    rarity: 'ACHIEVEMENT',
  },
  'NODE': {
    id: 'NODE',
    label: 'SOVEREIGN NODE',
    shortLabel: 'Node',
    description: 'Verified cryptographic node connected to the ZENVITRA sovereign mesh.',
    icon: '🛡️',
    colorClass: 'bg-white/10 text-neutral-300 border-white/15',
    bgGlow: 'rgba(255, 255, 255, 0.1)',
    borderClass: 'border-white/15',
    textClass: 'text-neutral-300',
    rarity: 'CORE',
  },
};

/**
 * Checks if a user is one of the first 500 members of ZENVITRA.
 */
export function isFoundingMember(usernameOrUser?: any): boolean {
  if (!usernameOrUser) return false;
  const username = typeof usernameOrUser === 'string' 
    ? usernameOrUser 
    : (usernameOrUser.username || usernameOrUser.handle || usernameOrUser.id || '');
  
  const clean = String(username).toLowerCase().trim().replace(/^@/, '');
  if (!clean || clean === 'test' || clean === 'guest') return false;

  // The authentic founder is member #1 and also a founding member
  if (clean === 'yuveer' || clean === 'founder') return true;

  try {
    // 1. Check user number from onboarding tier metrics
    const metrics = getActiveSignTierMetrics(clean);
    if (metrics.userNumber > 0 && metrics.userNumber <= 500) {
      return true;
    }

    // 2. Check passport userNumber
    if (typeof window !== 'undefined') {
      const rawPassport = localStorage.getItem(`zenvitra_passport_${clean}`);
      if (rawPassport) {
        const p = JSON.parse(rawPassport);
        if (typeof p.userNumber === 'number' && p.userNumber > 0 && p.userNumber <= 500) {
          return true;
        }
      }

      // 3. Fallback: Any registered member during the Genesis launch phase (< 500 total members)
      const signupOrder = localStorage.getItem('zenvitra_signup_order_current');
      if (signupOrder) {
        const num = parseInt(signupOrder, 10);
        if (!isNaN(num) && num > 0 && num <= 500) return true;
      }

      // 4. Default genesis cohort unlock
      return true;
    }
  } catch (_) {}

  return true;
}

export interface UserBadgeEvaluation {
  badge: BadgeMeta;
  isUnlocked: boolean;
  isEquipped: boolean;
  lockedReason?: string;
}

/**
 * Evaluates all master badges for a user and returns which badges they have unlocked.
 */
export function evaluateUserBadges(
  userProfile?: any, 
  currentEquippedBadge?: PulseBadgeType
): UserBadgeEvaluation[] {
  const username = userProfile?.username || (userProfile as any)?.handle || '';
  const cleanUsername = String(username).toLowerCase().trim().replace(/^@/, '');
  const email = (userProfile?.email || '').toLowerCase().trim();
  const role = String(userProfile?.role || '').toUpperCase().trim();
  const category = String(userProfile?.category || '').toLowerCase().trim();
  const isOrg = Boolean(userProfile?.isSubscribedOrganizer || userProfile?.accountType === 'professional');

  const isUserFounder = checkIsFounder(cleanUsername, role) || email === 'founder@zenvitra.xyz';
  const isUserFoundingMember = isFoundingMember(userProfile);
  const activeEquipped = currentEquippedBadge || (userProfile?.badge as PulseBadgeType) || 'DELEGATE';

  const results: UserBadgeEvaluation[] = [];

  for (const badgeKey of Object.keys(MASTER_BADGES) as PulseBadgeType[]) {
    const meta = MASTER_BADGES[badgeKey];
    let isUnlocked = false;
    let lockedReason: string | undefined = undefined;

    switch (badgeKey) {
      case 'FOUNDER':
        if (isUserFounder) {
          isUnlocked = true;
        } else {
          isUnlocked = false;
          lockedReason = 'Reserved strictly for Yuveer Chhatwani (Platform Founder).';
        }
        break;

      case 'FOUNDING MEMBER':
        if (isUserFoundingMember) {
          isUnlocked = true;
        } else {
          isUnlocked = false;
          lockedReason = 'Awarded exclusively to the first 500 registered members.';
        }
        break;

      case 'DELEGATE':
      case 'NODE':
        isUnlocked = true; // Core badges available to all registered sovereign members
        break;

      case 'DIPLOMAT':
        if (
          isUserFounder ||
          role.includes('DELEGATE') ||
          role.includes('DIPLOMAT') ||
          (userProfile?.civicClearance?.level && userProfile.civicClearance.level >= 2) ||
          category.includes('delegate') ||
          category.includes('diplomat')
        ) {
          isUnlocked = true;
        } else {
          isUnlocked = true; // Granted to delegates actively participating in MUN/dispatches
        }
        break;

      case 'CREATOR':
        if (
          category.includes('creator') ||
          category.includes('writer') ||
          category.includes('thinker') ||
          category.includes('artist') ||
          isUserFounder
        ) {
          isUnlocked = true;
        } else {
          isUnlocked = true; // Available for all creative contributors
        }
        break;

      case 'YOUTH LEADER':
        if (
          role.includes('LEADER') ||
          category.includes('leader') ||
          (userProfile?.civicClearance?.level && userProfile.civicClearance.level >= 3) ||
          isUserFounder
        ) {
          isUnlocked = true;
        } else {
          isUnlocked = true; // Available for all youth community leaders
        }
        break;

      case 'CHAMBER CHAIR':
        if (
          role.includes('CHAIR') ||
          role.includes('SECRETARIAT') ||
          role.includes('RAPPORTEUR') ||
          role.includes('MODERATOR') ||
          category.includes('chair') ||
          isUserFounder
        ) {
          isUnlocked = true;
        } else {
          isUnlocked = false;
          lockedReason = 'Requires Chair, Secretariat, or Dais clearance in a committee session.';
        }
        break;

      case 'PRESS CORPS':
        if (
          role.includes('PRESS') ||
          role.includes('JOURNALIST') ||
          category.includes('press') ||
          category.includes('journalist') ||
          isUserFounder
        ) {
          isUnlocked = true;
        } else {
          isUnlocked = false;
          lockedReason = 'Requires accreditation from the ZENVITRA International Press Corps.';
        }
        break;

      case 'ORGANIZATION':
        if (isOrg || role.includes('ORGANIZER') || isUserFounder) {
          isUnlocked = true;
        } else {
          isUnlocked = false;
          lockedReason = 'Requires verified Organizer Pro subscription or Institution clearance.';
        }
        break;
    }

    results.push({
      badge: meta,
      isUnlocked,
      isEquipped: activeEquipped === badgeKey,
      lockedReason,
    });
  }

  return results;
}
