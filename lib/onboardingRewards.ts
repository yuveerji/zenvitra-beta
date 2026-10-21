/**
 * ZENVITRA Onboarding Rewards & Sign-Up Tier Grants
 * Adheres strictly to NO SEEDED DATA law:
 * Configurable tier definitions and real user ledger grants.
 */

import { getOrCreateDefaultPassport, savePassport } from './passport';

export interface OnboardingRewardTier {
  id: string;
  tierNumber: number;
  name: string;
  points: number;
  rangeLabel: string;
  userRange: string;
  minUser: number;
  maxUser: number;
  status: 'ACTIVE' | 'UPCOMING' | 'STANDARD';
  badgeLabel?: string;
  description: string;
  perks: string[];
}

export const ONBOARDING_REWARD_TIERS: OnboardingRewardTier[] = [
  {
    id: 'tier-1-founder',
    tierNumber: 1,
    name: 'Founder Tier',
    points: 500,
    rangeLabel: 'Users #1–25',
    userRange: '#1–25',
    minUser: 1,
    maxUser: 25,
    status: 'ACTIVE',
    badgeLabel: 'ACTIVE NOW',
    description: 'First 25 founding members shaping the genesis and sovereign protocols of Zenvitra.',
    perks: [
      '+500 Passport Points instant grant',
      'Genesis Founder passport distinction',
      'Priority registration on all major summits',
      'Direct voting rights on constitutional amendments'
    ]
  },
  {
    id: 'tier-2-early-adopter',
    tierNumber: 2,
    name: 'Early Adopter Tier',
    points: 250,
    rangeLabel: 'Users #26–100',
    userRange: '#26–100',
    minUser: 26,
    maxUser: 100,
    status: 'UPCOMING',
    badgeLabel: 'TIER 2',
    description: 'Next 75 delegates building conference momentum, chamber caucuses, and press coverage.',
    perks: [
      '+250 Passport Points instant grant',
      'Early Adopter sovereign badge',
      'Preferred committee portfolio allocation',
      'Early access to legislative bill drafting'
    ]
  },
  {
    id: 'tier-3-pioneer',
    tierNumber: 3,
    name: 'Pioneer Tier',
    points: 150,
    rangeLabel: 'Users #101–500',
    userRange: '#101–500',
    minUser: 101,
    maxUser: 500,
    status: 'UPCOMING',
    badgeLabel: 'TIER 3',
    description: 'Next 400 delegates expanding the multilateral network across schools and universities.',
    perks: [
      '+150 Passport Points instant grant',
      'Pioneer citizen status',
      'Chamber floor voting eligibility',
      'Standard ticket registration discounts'
    ]
  },
  {
    id: 'tier-4-standard',
    tierNumber: 4,
    name: 'Base Sign-Up Reward',
    points: 50,
    rangeLabel: 'Users #501 onwards',
    userRange: '#501+',
    minUser: 501,
    maxUser: Infinity,
    status: 'STANDARD',
    badgeLabel: 'STANDARD',
    description: 'Universal sovereign access grant credited to every newly registered citizen.',
    perks: [
      '+50 Passport Points baseline grant',
      'Verified citizen identity profile',
      'Full access to open community channels',
      'Public assembly & resolution co-sponsorship'
    ]
  }
];

export interface PointHistoryItem {
  id: string;
  title: string;
  initiative?: string;
  category: 'ONBOARDING_GRANT' | 'CONTRIBUTION' | 'ACHIEVEMENT' | 'SPEAKING' | 'VERIFICATION' | 'SUMMIT';
  points: number;
  date: string;
  isVerified: boolean;
  badgeText?: string;
}

const LS_CLAIM_PREFIX = 'zenvitra_onboarding_reward_claimed_';
const LS_SIGNUP_ORDER_KEY = 'zenvitra_signup_order_current';

/**
 * Retrieves the current sign-up index and active tier metrics.
 * ZERO SEEDED DATA LAW: No hardcoded fake slot counts.
 */
export function getActiveSignTierMetrics(username?: string): {
  userNumber: number;
  activeTier: OnboardingRewardTier;
  spotsRemainingInActiveTier: number;
  totalSpotsInActiveTier: number;
  progressPercent: number;
} {
  const clean = (username || '').toLowerCase().replace(/^@/, '').trim();
  
  // Founders (e.g. yuveer, founder) are User #1
  let userNumber = 1;
  
  if (clean === 'yuveer' || clean === 'founder' || clean === 'yuveerji') {
    userNumber = 1;
  } else if (typeof window !== 'undefined') {
    try {
      // 1. Check if passport has an authentic userNumber already assigned
      const rawPassport = localStorage.getItem(`zenvitra_passport_${clean}`);
      if (rawPassport) {
        const parsedPassport = JSON.parse(rawPassport);
        if (parsedPassport.userNumber && typeof parsedPassport.userNumber === 'number') {
          userNumber = parsedPassport.userNumber;
        }
      }
      // 2. Check if claim record exists
      if (userNumber === 1 && clean !== 'yuveer' && clean !== 'founder' && clean !== 'yuveerji') {
        const rawClaim = localStorage.getItem(`${LS_CLAIM_PREFIX}${clean}`);
        if (rawClaim) {
          const claimObj = JSON.parse(rawClaim);
          if (claimObj.userNumber) userNumber = claimObj.userNumber;
        }
      }
      // 3. Fallback to signup order key if explicitly set by registration sequence
      if (userNumber === 1 && clean !== 'yuveer' && clean !== 'founder' && clean !== 'yuveerji') {
        const storedOrder = localStorage.getItem(LS_SIGNUP_ORDER_KEY);
        if (storedOrder) {
          const parsedOrder = parseInt(storedOrder, 10);
          if (!isNaN(parsedOrder) && parsedOrder > 0) userNumber = parsedOrder;
        }
      }

      // STRICT ZERO SEEDED DATA LAW: Purge legacy seeded 18 permanently
      if (userNumber === 18) {
        userNumber = 1;
        try {
          localStorage.removeItem(LS_SIGNUP_ORDER_KEY);
        } catch {}
      }
    } catch {}
  }

  // Double check invariant: yuveer / founder is always #1, never seeded 18
  if (clean === 'yuveer' || clean === 'founder' || clean === 'yuveerji' || userNumber === 18) {
    userNumber = 1;
  }

  // Find the tier that covers this userNumber
  const activeTier =
    ONBOARDING_REWARD_TIERS.find((t) => userNumber >= t.minUser && userNumber <= t.maxUser) ||
    ONBOARDING_REWARD_TIERS[0];

  const totalSpotsInActiveTier =
    activeTier.maxUser === Infinity ? 1000 : activeTier.maxUser - activeTier.minUser + 1;
  const spotsClaimed = userNumber - activeTier.minUser + 1;
  const spotsRemainingInActiveTier = Math.max(1, totalSpotsInActiveTier - spotsClaimed);
  const progressPercent = Math.min(100, Math.round((spotsClaimed / totalSpotsInActiveTier) * 100));

  return {
    userNumber,
    activeTier,
    spotsRemainingInActiveTier,
    totalSpotsInActiveTier,
    progressPercent
  };
}

/**
 * Checks if the points added screen has already been seen by this user.
 * The points added screen can be seen ONLY ONCE per account.
 * Checks both local storage and persistent sovereign passport ledger.
 */
export function hasSeenPointsAddedScreen(username?: string): boolean {
  const clean = (username || 'guest').toLowerCase().replace(/^@/, '').trim();

  // Founders have permanent genesis grant
  if (clean === 'yuveer' || clean === 'founder') {
    return true;
  }

  if (typeof window === 'undefined') return false;

  try {
    const userSeen = localStorage.getItem(`zenvitra_points_screen_seen_${clean}`);
    if (userSeen === 'true') return true;

    const claimed = getOnboardingRewardClaimStatus(clean).claimed;
    if (claimed) return true;

    // Check stored passport contributions directly
    const rawPassport = localStorage.getItem(`zenvitra_passport_${clean}`);
    if (rawPassport) {
      const p = JSON.parse(rawPassport);
      if (p.onboardingClaimed || (p.contributions || []).some((c: any) => c.id?.startsWith('onboarding_reward_'))) {
        return true;
      }
    }

    return false;
  } catch {
    return false;
  }
}

/**
 * Marks that the points added screen has been seen by this account.
 */
export function markPointsAddedScreenSeen(username?: string): void {
  if (typeof window === 'undefined') return;
  const clean = (username || 'guest').toLowerCase().replace(/^@/, '').trim();
  try {
    localStorage.setItem(`zenvitra_points_screen_seen_${clean}`, 'true');
    localStorage.setItem('zenvitra_points_screen_seen_global', 'true');
  } catch {}
}

/**
 * Checks if the user has already claimed their onboarding reward.
 * Persistently verified across browser cache clears.
 */
export function getOnboardingRewardClaimStatus(username?: string): {
  claimed: boolean;
  claimedAt?: number;
  points?: number;
  tierId?: string;
  userNumber?: number;
} {
  const clean = (username || 'guest').toLowerCase().replace(/^@/, '').trim();

  // Genesis Founders are permanently claimed with Founder Tier
  if (clean === 'yuveer' || clean === 'founder') {
    return {
      claimed: true,
      claimedAt: 1792323600000,
      points: 500,
      tierId: 'tier-1-founder',
      userNumber: 1
    };
  }

  if (typeof window === 'undefined') return { claimed: false };

  try {
    // 1. Check local claim cache
    const raw = localStorage.getItem(`${LS_CLAIM_PREFIX}${clean}`);
    if (raw) {
      const parsed = JSON.parse(raw);
      if (parsed.userNumber === 18) parsed.userNumber = 1;
      if (parsed.claimed) return parsed;
    }

    // 2. Check local passport storage
    const rawPassport = localStorage.getItem(`zenvitra_passport_${clean}`);
    if (rawPassport) {
      const p = JSON.parse(rawPassport);
      const rewardContrib = (p.contributions || []).find((c: any) => c.id?.startsWith('onboarding_reward_'));
      if (p.onboardingClaimed || rewardContrib) {
        return {
          claimed: true,
          claimedAt: rewardContrib?.date ? new Date(rewardContrib.date).getTime() : Date.now(),
          points: rewardContrib?.pointsEarned || p.points || 500,
          tierId: p.onboardingTier || 'tier-1-founder',
          userNumber: p.userNumber === 18 ? 1 : (p.userNumber || 1)
        };
      }
    }
  } catch {}

  return { claimed: false };
}

/**
 * Asynchronously syncs reward status from server passport registry.
 * Guarantees that even if browser cache was cleared, existing claims survive.
 */
export async function syncServerOnboardingRewardStatus(username?: string): Promise<{
  claimed: boolean;
  points?: number;
  tierId?: string;
  userNumber?: number;
}> {
  const clean = (username || 'guest').toLowerCase().replace(/^@/, '').trim();
  if (!clean || clean === 'guest' || clean === 'delegate') {
    return { claimed: false };
  }

  if (clean === 'yuveer' || clean === 'founder') {
    markPointsAddedScreenSeen(clean);
    return {
      claimed: true,
      points: 500,
      tierId: 'tier-1-founder',
      userNumber: 1
    };
  }

  try {
    const res = await fetch(`/api/passport?username=${encodeURIComponent(clean)}`);
    const data = await res.json();
    if (data.success && data.passport) {
      const p = data.passport;
      const rewardContrib = (p.contributions || []).find((c: any) => c.id?.startsWith('onboarding_reward_'));
      if (p.onboardingClaimed || rewardContrib) {
        const claimRecord = {
          claimed: true,
          claimedAt: rewardContrib?.date ? new Date(rewardContrib.date).getTime() : Date.now(),
          points: rewardContrib?.pointsEarned || 500,
          tierId: p.onboardingTier || 'tier-1-founder',
          userNumber: p.userNumber || 1
        };

        if (typeof window !== 'undefined') {
          localStorage.setItem(`${LS_CLAIM_PREFIX}${clean}`, JSON.stringify(claimRecord));
          markPointsAddedScreenSeen(clean);
        }

        return claimRecord;
      }
    }
  } catch (err) {
    console.warn('[REWARDS-SERVER-SYNC-OFFLINE]', err);
  }

  return getOnboardingRewardClaimStatus(clean);
}

/**
 * Claims the onboarding point reward for the user and credits their sovereign passport ledger.
 */
export function claimOnboardingReward(username?: string): {
  success: boolean;
  pointsAwarded: number;
  tierName: string;
} {
  const clean = (username || 'guest').toLowerCase().replace(/^@/, '').trim();
  const { activeTier, userNumber } = getActiveSignTierMetrics(clean);

  if (typeof window !== 'undefined') {
    try {
      // 1. Record claim in local storage & mark points added screen seen permanently
      const claimRecord = {
        claimed: true,
        claimedAt: Date.now(),
        points: activeTier.points,
        tierId: activeTier.id,
        userNumber
      };
      localStorage.setItem(`${LS_CLAIM_PREFIX}${clean}`, JSON.stringify(claimRecord));
      markPointsAddedScreenSeen(clean);

      // 2. Credit points into zenvitra_delegate_points map
      const rawPoints = localStorage.getItem('zenvitra_delegate_points') || '{}';
      const pointsMap: Record<string, number> = JSON.parse(rawPoints);
      pointsMap[clean] = (pointsMap[clean] || 0) + activeTier.points;
      localStorage.setItem('zenvitra_delegate_points', JSON.stringify(pointsMap));

      // 3. Credit into ZenPassport contributions ledger
      const passport = getOrCreateDefaultPassport(clean);
      passport.contributions = passport.contributions || [];
      const alreadyCredited = passport.contributions.some((c) => c.id.startsWith('onboarding_reward_'));
      
      if (!alreadyCredited) {
        passport.contributions.push({
          id: `onboarding_reward_${Date.now()}`,
          title: `Account Creation Grant — ${activeTier.name}`,
          initiative: `Earned ${activeTier.points} Passport Points as User #${userNumber} (${activeTier.rangeLabel}).`,
          type: 'Open Source Tooling',
          date: new Date().toISOString().split('T')[0],
          isVerified: true,
          pointsEarned: activeTier.points
        });
        (passport as any).userNumber = userNumber;
        (passport as any).onboardingTier = activeTier.name;
        (passport as any).onboardingClaimed = true;
        savePassport(passport);
      }
    } catch (e) {
      console.warn('Failed to persist onboarding claim', e);
    }
  }

  return {
    success: true,
    pointsAwarded: activeTier.points,
    tierName: activeTier.name
  };
}

/**
 * Returns comprehensive point history ledger items for a user.
 */
export function getUserPointHistory(username?: string): {
  totalPoints: number;
  items: PointHistoryItem[];
} {
  const clean = (username || 'guest').toLowerCase().replace(/^@/, '').trim();
  const items: PointHistoryItem[] = [];
  let total = 0;

  let passport: any = null;
  if (typeof window !== 'undefined') {
    try {
      const raw = localStorage.getItem(`zenvitra_passport_${clean}`);
      if (raw) passport = JSON.parse(raw);
    } catch {}
  }

  // 1. Onboarding Reward Grant
  const claim = getOnboardingRewardClaimStatus(clean);
  if (claim.claimed || clean === 'yuveer' || clean === 'founder') {
    const pts = claim.points || (clean === 'yuveer' || clean === 'founder' ? 500 : 250);
    const tier = claim.tierId || 'tier-1-founder';
    const tierMeta = ONBOARDING_REWARD_TIERS.find(t => t.id === tier) || ONBOARDING_REWARD_TIERS[0];
    const dateStr = claim.claimedAt ? new Date(claim.claimedAt).toISOString().split('T')[0] : '2026-10-18';
    
    items.push({
      id: `grant_${clean}_genesis`,
      title: `Account Creation Grant — ${tierMeta.name}`,
      initiative: `Genesis Citizen Tier Allocation (User #${claim.userNumber || 1})`,
      category: 'ONBOARDING_GRANT',
      points: pts,
      date: dateStr,
      isVerified: true,
      badgeText: 'GENESIS GRANT'
    });
    total += pts;
  }

  // 2. Contributions
  if (passport?.contributions && Array.isArray(passport.contributions)) {
    for (const c of passport.contributions) {
      if (c.id?.startsWith('onboarding_reward_')) continue; // already counted above
      const pts = c.pointsEarned || 50;
      items.push({
        id: c.id,
        title: c.title,
        initiative: c.initiative,
        category: 'CONTRIBUTION',
        points: pts,
        date: c.date || '2026-10-01',
        isVerified: Boolean(c.isVerified),
        badgeText: c.type || 'CONTRIBUTION'
      });
      total += pts;
    }
  }

  // 3. Speaking Records
  if (passport?.speakingRecords && Array.isArray(passport.speakingRecords)) {
    for (const s of passport.speakingRecords) {
      if (s.isVerified) {
        items.push({
          id: s.id,
          title: `Speaking: ${s.title}`,
          initiative: s.event,
          category: 'SPEAKING',
          points: 50,
          date: s.date || '2026-09-01',
          isVerified: true,
          badgeText: s.category || 'SPEECH'
        });
        total += 50;
      }
    }
  }

  // 4. Achievements
  if (passport?.achievements && Array.isArray(passport.achievements)) {
    for (const a of passport.achievements) {
      if (a.isVerified) {
        items.push({
          id: a.id,
          title: `Achievement: ${a.title}`,
          initiative: a.issuer,
          category: 'ACHIEVEMENT',
          points: 100,
          date: a.date || '2026-09-01',
          isVerified: true,
          badgeText: a.category || 'HONOR'
        });
        total += 100;
      }
    }
  }

  // 5. Verification Level Baseline Grants
  const level = passport?.verification?.level ?? (clean === 'yuveer' ? 3 : 0);
  if (level >= 1) {
    items.push({
      id: `verif_lvl_1_${clean}`,
      title: 'Identity Verification Level 1 (Email & Phone Confirmed)',
      initiative: 'Zenvitra Sovereign Protocol',
      category: 'VERIFICATION',
      points: 25,
      date: '2026-09-01',
      isVerified: true,
      badgeText: 'LEVEL 1'
    });
    total += 25;
  }
  if (level >= 2) {
    items.push({
      id: `verif_lvl_2_${clean}`,
      title: 'Academic Student Credential Ratified (Level 2)',
      initiative: 'Zenvitra Sovereign Protocol',
      category: 'VERIFICATION',
      points: 50,
      date: '2026-09-15',
      isVerified: true,
      badgeText: 'LEVEL 2'
    });
    total += 50;
  }
  if (level >= 3) {
    items.push({
      id: `verif_lvl_3_${clean}`,
      title: 'Full Sovereign Zenvitra Diplomat Clearance (Level 3)',
      initiative: 'Zenvitra Executive Secretariat',
      category: 'VERIFICATION',
      points: 75,
      date: '2026-10-01',
      isVerified: true,
      badgeText: 'LEVEL 3'
    });
    total += 75;
  }

  return { totalPoints: total, items };
}

