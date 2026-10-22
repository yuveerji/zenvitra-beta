// lib/subscriptionTiers.ts
// Single source of truth for ZENVITRA Subscription Plans, Features, and Entitlement Checks

export type SubscriptionPlanId = 
  | 'zen-free' 
  | 'zen-plus' 
  | 'zen-pro' 
  | 'zen-elite' 
  | 'pro-starter' 
  | 'pro-standard' 
  | 'pro-plus' 
  | 'pro-enterprise' 
  | 'event-starter' 
  | 'event-basic' 
  | 'event-pro' 
  | 'event-elite' 
  | 'org-pro' 
  | 'org-elite' 
  | 'org-enterprise';

export interface SubscriptionRecord {
  username: string;
  planId: SubscriptionPlanId;
  planName: string;
  status: 'ACTIVE' | 'EXPIRED' | 'CANCELLED';
  orderId?: string;
  paymentId?: string;
  amountPaid: number;
  currency: string;
  paymentMethod: string;
  activatedAt: string;
  expiresAt: string; // ISO date or 'LIFETIME'
  isTrial?: boolean;
}

export type FeatureKey =
  | 'STAGE_BROADCASTING'            // Host / speak on live auditorium & plenary stages (ZEN.STAGE)
  | 'HD_VIDEO_MEET'                 // Multi-party HD video conferencing in ZEN.CALL & ZEN.MEET
  | 'ORGANIZER_SHOWCASE'            // Featured Events & Organizer profile showcase tab
  | 'EVENT_MANAGEMENT_CONSOLE'      // Advanced Secretariat/Organizer CRM & event configuration
  | 'VERIFIABLE_CERTIFICATES'       // ZEN.CERTIFY digital certificates with QR validation
  | 'SOVEREIGN_PRESS_WIRE'          // Publication mastheads, scheduled publishing & team newsrooms
  | 'ADVANCED_ANALYTICS'            // Read completion telemetry, audience demographics & engagement
  | 'ZEN_AI_MONTHLY_ALLOWANCE'      // AI drafting, speech structuring & citation polishers
  | 'PRIORITY_PLENARY_QUEUE'        // Priority Speaker queueing & floor interventions in summits
  | 'CUSTOM_REGISTRATION_EMBED'     // Embed external / custom payment pass checkout widgets
  | 'UNLIMITED_CATEGORY_SUBSCRIPTIONS' // Unlimited subscriptions across Press, News & Pulse feeds
  | 'MULTI_COUNCIL_EXECUTIVE_BOARD' // Executive board scoring & multi-room dais relays
  | 'EXECUTIVE_BOARD_SCORING'       // Private rubric scoring, diplomacy metrics, and podium rankings
  | 'RESOLUTION_EXPORT_OFFICIAL'    // Official UN-format PDF export without watermarks
  | 'UNLIMITED_CHAMBER_ROSTER';     // Host committees with >15 delegates

export const FEATURE_ENTITLEMENTS: Record<FeatureKey, {
  name: string;
  description: string;
  minimumTierLabel: string;
  allowedPlans: SubscriptionPlanId[];
}> = {
  STAGE_BROADCASTING: {
    name: 'Stage Broadcasting & Plenary Podiums',
    description: 'Host and stream on sovereign live audio/video Stages (ZEN.STAGE) with multi-room broadcasting dais.',
    minimumTierLabel: 'ZEN PRO or EVENT PRO',
    allowedPlans: ['zen-pro', 'zen-elite', 'pro-plus', 'pro-enterprise', 'event-pro', 'event-elite', 'org-pro', 'org-elite', 'org-enterprise'],
  },
  HD_VIDEO_MEET: {
    name: 'HD Multi-Party Video & Conference Rooms',
    description: 'Full-resolution video conferencing, screen sharing, and chamber recording in ZEN.CALL / ZEN.MEET.',
    minimumTierLabel: 'ZEN PRO or PROFESSIONAL',
    allowedPlans: ['zen-pro', 'zen-elite', 'pro-standard', 'pro-plus', 'pro-enterprise', 'event-pro', 'event-elite', 'org-pro', 'org-elite', 'org-enterprise'],
  },
  ORGANIZER_SHOWCASE: {
    name: 'Organizer Events Showcase & Featured Summits',
    description: 'Promote upcoming conferences, summits, and workshops directly on your public profile with custom registration redirects.',
    minimumTierLabel: 'ORGANIZER PRO or EVENT PRO',
    allowedPlans: ['org-pro', 'org-elite', 'org-enterprise', 'event-pro', 'event-elite', 'pro-plus', 'pro-enterprise'],
  },
  EVENT_MANAGEMENT_CONSOLE: {
    name: 'Event Management & Secretarial CRM',
    description: 'Manage delegations, check-ins, attendee rosters, and ticket tier allocations with team access.',
    minimumTierLabel: 'EVENT BASIC or ORGANIZER PRO',
    allowedPlans: ['event-basic', 'event-pro', 'event-elite', 'org-pro', 'org-elite', 'org-enterprise'],
  },
  VERIFIABLE_CERTIFICATES: {
    name: 'Cryptographically Verifiable Certificates (ZEN.CERTIFY)',
    description: 'Issue tamper-proof digital participation credentials and awards with public QR verification and passport wallet minting.',
    minimumTierLabel: 'EVENT PRO or ORGANIZER ELITE',
    allowedPlans: ['event-pro', 'event-elite', 'org-elite', 'org-enterprise'],
  },
  SOVEREIGN_PRESS_WIRE: {
    name: 'Sovereign Publication Newsroom & Wire',
    description: 'Operate an accredited publication with multi-tier editorial workflows (Writer → Editor → Administrator approval).',
    minimumTierLabel: 'PROFESSIONAL PRO',
    allowedPlans: ['pro-plus', 'pro-enterprise'],
  },
  ADVANCED_ANALYTICS: {
    name: 'Advanced Telemetry & Dossier Analytics',
    description: 'Profile visits, reading completion telemetry, audience demographics, and citation engagement metrics.',
    minimumTierLabel: 'ZEN PRO or PROFESSIONAL',
    allowedPlans: ['zen-pro', 'zen-elite', 'pro-standard', 'pro-plus', 'pro-enterprise', 'event-pro', 'event-elite', 'org-pro', 'org-elite', 'org-enterprise'],
  },
  ZEN_AI_MONTHLY_ALLOWANCE: {
    name: 'ZEN AI Diplomatic Draft Engine',
    description: 'AI drafting assistance for resolution working papers, speeches, and investigative articles.',
    minimumTierLabel: 'ZEN PRO or PROFESSIONAL',
    allowedPlans: ['zen-pro', 'zen-elite', 'pro-standard', 'pro-plus', 'pro-enterprise', 'event-pro', 'event-elite', 'org-pro', 'org-elite', 'org-enterprise'],
  },
  PRIORITY_PLENARY_QUEUE: {
    name: 'Priority Floor Queue & Early Registration',
    description: 'Priority floor queuing windows and early delegate registration access across upcoming MUN summits.',
    minimumTierLabel: 'ZEN PRO or EVENT PRO',
    allowedPlans: ['zen-pro', 'zen-elite', 'event-pro', 'event-elite', 'org-pro', 'org-elite', 'org-enterprise'],
  },
  CUSTOM_REGISTRATION_EMBED: {
    name: 'Custom Pass Embeds & Payout Routing',
    description: 'Direct embed links for event registrations and custom Cashfree payout routing.',
    minimumTierLabel: 'ORGANIZER PRO or EVENT PRO',
    allowedPlans: ['org-pro', 'org-elite', 'org-enterprise', 'event-pro', 'event-elite', 'pro-enterprise'],
  },
  UNLIMITED_CATEGORY_SUBSCRIPTIONS: {
    name: 'Unlimited Platform Category Subscriptions',
    description: 'Subscribe to unlimited topics and newsrooms across Press, News, and Pulse with real-time notification alerts.',
    minimumTierLabel: 'ZEN+ or ZEN PRO',
    allowedPlans: ['zen-plus', 'zen-pro', 'zen-elite', 'pro-standard', 'pro-plus', 'pro-enterprise', 'event-pro', 'event-elite', 'org-pro', 'org-elite', 'org-enterprise'],
  },
  MULTI_COUNCIL_EXECUTIVE_BOARD: {
    name: 'Multi-Council Executive Board Sync',
    description: 'Real-time dais relays, multi-room automated award scoring matrices, and dais chat for Chairs & Directors.',
    minimumTierLabel: 'EVENT PRO // MUN PRO',
    allowedPlans: ['event-pro', 'event-elite', 'org-elite', 'org-enterprise'],
  },
  EXECUTIVE_BOARD_SCORING: {
    name: 'Executive Board Scoring & Performance Matrix',
    description: 'Private delegate evaluation rubrics, diplomacy rating matrices, manual adjustment ledger, and live award rankings.',
    minimumTierLabel: 'ZEN PRO',
    allowedPlans: ['zen-pro', 'zen-elite', 'pro-plus', 'pro-enterprise', 'event-pro', 'event-elite', 'org-pro', 'org-elite', 'org-enterprise'],
  },
  RESOLUTION_EXPORT_OFFICIAL: {
    name: 'Official UN-Style Resolution & Bill Exporter',
    description: 'Export unmoderated caucus working papers, draft resolutions, and national bills in pristine print-ready UN/Westminster treaty format without watermarks.',
    minimumTierLabel: 'ZEN PRO',
    allowedPlans: ['zen-pro', 'zen-elite', 'pro-standard', 'pro-plus', 'pro-enterprise', 'event-pro', 'event-elite', 'org-pro', 'org-elite', 'org-enterprise'],
  },
  UNLIMITED_CHAMBER_ROSTER: {
    name: 'Unlimited Delegations & World Chambers',
    description: 'Build and operate full-scale chambers with over 15 delegations (P5 + G20 + EU + 193 UN sovereign states) and custom bloc presets.',
    minimumTierLabel: 'ZEN PRO',
    allowedPlans: ['zen-pro', 'zen-elite', 'pro-plus', 'pro-enterprise', 'event-pro', 'event-elite', 'org-pro', 'org-elite', 'org-enterprise'],
  },
};

/**
 * 3-MONTH LAUNCH PROMOTION:
 * Any user who registers in the next 3 months (Oct 2026 - Jan 2027) gets 1-Month Free Trial of ZEN PRO.
 */
export const PROMO_TRIAL_CAMPAIGN = {
  name: '3-Month Launch Special: 1-Month ZEN PRO Free Trial',
  durationDays: 30,
  startsAt: '2026-10-01T00:00:00Z',
  endsAt: '2027-01-31T23:59:59Z', // Valid for next 3 months
};

export function isPromotionalCampaignActive(): boolean {
  const now = Date.now();
  const start = new Date(PROMO_TRIAL_CAMPAIGN.startsAt).getTime();
  const end = new Date(PROMO_TRIAL_CAMPAIGN.endsAt).getTime();
  return now >= start && now <= end;
}

export const LOCAL_STORAGE_USER_SUBSCRIPTIONS = 'zenvitra_user_active_subscriptions_v1';
export const LOCAL_STORAGE_PROMO_TRIAL_CLAIMED = 'zenvitra_promo_trial_claimed_v1';

/**
 * Normalizes user identifier
 */
export function normalizeUsername(identifier?: string | null): string {
  if (!identifier) return '';
  return identifier.toLowerCase().trim().replace(/^@/, '');
}

/**
 * Maps legacy plan aliases or product strings to standardized SubscriptionPlanId
 */
export function normalizePlanId(rawPlanId?: string | null): SubscriptionPlanId {
  const clean = (rawPlanId || '').toLowerCase().trim();
  if (clean.includes('org-pro') || clean === 'organizer_pro' || clean === 'organizer pro') return 'org-pro';
  if (clean.includes('org-elite') || clean === 'organizer_elite') return 'org-elite';
  if (clean.includes('org-enterprise')) return 'org-enterprise';
  if (clean.includes('event-pro') || clean === 'mun_pro' || clean === 'event pro') return 'event-pro';
  if (clean.includes('event-basic')) return 'event-basic';
  if (clean.includes('event-elite')) return 'event-elite';
  if (clean.includes('pro-plus') || clean === 'professional_pro') return 'pro-plus';
  if (clean.includes('pro-standard') || clean === 'professional') return 'pro-standard';
  if (clean.includes('pro-starter')) return 'pro-starter';
  if (clean.includes('zen-elite')) return 'zen-elite';
  if (clean.includes('zen-pro') || clean === 'pulse_pro') return 'zen-pro';
  if (clean.includes('zen-plus')) return 'zen-plus';
  return 'zen-free';
}

/**
 * Read the active subscription for a user from client-side storage
 */
export function getActiveUserSubscription(username?: string | null): SubscriptionRecord | null {
  if (typeof window === 'undefined') return null;
  const clean = normalizeUsername(username);
  if (!clean) return null;

  try {
    const raw = localStorage.getItem(LOCAL_STORAGE_USER_SUBSCRIPTIONS);
    if (!raw) return null;
    const all = JSON.parse(raw);
    const sub = all[clean];
    if (!sub || sub.status !== 'ACTIVE') return null;

    // Check expiration if not LIFETIME
    if (sub.expiresAt && sub.expiresAt !== 'LIFETIME') {
      const exp = new Date(sub.expiresAt).getTime();
      if (!isNaN(exp) && Date.now() > exp) {
        return null;
      }
    }
    return sub as SubscriptionRecord;
  } catch {
    return null;
  }
}

/**
 * Stores / activates an allotment for a user upon Cashfree verification
 */
export function allotUserSubscription(
  username: string,
  record: Omit<SubscriptionRecord, 'username' | 'status' | 'activatedAt'>
): SubscriptionRecord {
  const clean = normalizeUsername(username);
  const fullRecord: SubscriptionRecord = {
    ...record,
    username: clean,
    status: 'ACTIVE',
    activatedAt: new Date().toISOString(),
  };

  if (typeof window !== 'undefined') {
    try {
      const raw = localStorage.getItem(LOCAL_STORAGE_USER_SUBSCRIPTIONS);
      const all = raw ? JSON.parse(raw) : {};
      all[clean] = fullRecord;
      localStorage.setItem(LOCAL_STORAGE_USER_SUBSCRIPTIONS, JSON.stringify(all));

      // Synchronize into zenvitra_session_user if this matches the logged-in session
      const sessionUserRaw = localStorage.getItem('zenvitra_session_user');
      if (sessionUserRaw) {
        const sessionUser = JSON.parse(sessionUserRaw);
        const sessionUsername = normalizeUsername(sessionUser.username || sessionUser.email);
        if (sessionUsername === clean) {
          sessionUser.subscriptionPlan = fullRecord.planId;
          sessionUser.subscriptionStatus = 'ACTIVE';
          sessionUser.isSubscribedOrganizer = [
            'org-pro', 'org-elite', 'org-enterprise', 'event-pro', 'event-elite'
          ].includes(fullRecord.planId);
          localStorage.setItem('zenvitra_session_user', JSON.stringify(sessionUser));
        }
      }

      // Dispatch global window event so UI reacts without page reload
      window.dispatchEvent(new CustomEvent('zenvitra_subscription_allotted', { detail: fullRecord }));
      window.dispatchEvent(new Event('storage'));
    } catch (e) {
      console.error('Failed to allot subscription in localStorage:', e);
    }
  }

  return fullRecord;
}

/**
 * Checks whether a given user possesses access to a particular feature
 */
export function checkFeatureAccess(
  feature: FeatureKey,
  user?: {
    username?: string | null;
    email?: string | null;
    role?: string | null;
    subscriptionPlan?: string | null;
  } | null,
  isFounderOrAdmin?: boolean
): {
  hasAccess: boolean;
  activePlan: SubscriptionPlanId;
  requiredTierLabel: string;
} {
  const entitlement = FEATURE_ENTITLEMENTS[feature];
  const requiredTierLabel = entitlement?.minimumTierLabel || 'Pro Membership';

  // Founder and Administrator always have universal access
  if (isFounderOrAdmin) {
    return { hasAccess: true, activePlan: 'org-enterprise', requiredTierLabel };
  }

  const cleanUser = normalizeUsername(user?.username || user?.email);
  if (!cleanUser) {
    return { hasAccess: false, activePlan: 'zen-free', requiredTierLabel };
  }

  // Check stored verified subscription record
  const storedSub = getActiveUserSubscription(cleanUser);
  const activePlanId = storedSub?.planId || normalizePlanId(user?.subscriptionPlan);

  if (entitlement && entitlement.allowedPlans.includes(activePlanId)) {
    return { hasAccess: true, activePlan: activePlanId, requiredTierLabel };
  }

  return { hasAccess: false, activePlan: activePlanId, requiredTierLabel };
}

/**
 * Activates 1-Month Free Trial of ZEN PRO for a registered user under the launch campaign.
 */
export function activatePromotionalProTrial(username: string): SubscriptionRecord {
  const clean = normalizeUsername(username);
  const now = new Date();
  const expires = new Date(now.getTime() + 30 * 24 * 60 * 60 * 1000); // 30 days / 1 month

  if (typeof window !== 'undefined') {
    try {
      const rawClaimed = localStorage.getItem(LOCAL_STORAGE_PROMO_TRIAL_CLAIMED);
      const claimed = rawClaimed ? JSON.parse(rawClaimed) : {};
      claimed[clean] = now.toISOString();
      localStorage.setItem(LOCAL_STORAGE_PROMO_TRIAL_CLAIMED, JSON.stringify(claimed));
    } catch {}
  }

  return allotUserSubscription(clean, {
    planId: 'zen-pro',
    planName: 'ZEN PRO (1-Month Launch Special Trial)',
    amountPaid: 0,
    currency: 'INR',
    paymentMethod: 'PROMOTIONAL_LAUNCH_TRIAL',
    expiresAt: expires.toISOString(),
    isTrial: true,
  });
}

/**
 * Checks and auto-provisions the 1-Month Free Trial for eligible users registered in the 3-month window.
 */
export function ensurePromotionalTrial(username?: string | null): SubscriptionRecord | null {
  if (typeof window === 'undefined') return null;
  const clean = normalizeUsername(username);
  if (!clean) return null;

  // If user already has an active subscription, return it
  const existing = getActiveUserSubscription(clean);
  if (existing) return existing;

  // Check if promotional campaign is active
  if (!isPromotionalCampaignActive()) return null;

  // Check if they already claimed and expired the trial
  try {
    const rawClaimed = localStorage.getItem(LOCAL_STORAGE_PROMO_TRIAL_CLAIMED);
    const claimed = rawClaimed ? JSON.parse(rawClaimed) : {};
    if (claimed[clean]) {
      // Trial was already claimed previously
      return null;
    }
  } catch {}

  // Auto-activate the 1-month trial for new registration
  return activatePromotionalProTrial(clean);
}

/**
 * Returns trial telemetry details (days remaining, active status)
 */
export function getTrialDetails(username?: string | null): {
  isTrial: boolean;
  daysRemaining: number;
  expiresAt: string | null;
  isActive: boolean;
} {
  const clean = normalizeUsername(username);
  if (!clean) {
    return { isTrial: false, daysRemaining: 0, expiresAt: null, isActive: false };
  }
  const sub = getActiveUserSubscription(clean);
  if (!sub || !sub.isTrial) {
    return { isTrial: false, daysRemaining: 0, expiresAt: null, isActive: false };
  }

  const expTime = new Date(sub.expiresAt).getTime();
  const diffMs = expTime - Date.now();
  const daysRemaining = Math.max(0, Math.ceil(diffMs / (1000 * 60 * 60 * 24)));

  return {
    isTrial: true,
    daysRemaining,
    expiresAt: sub.expiresAt,
    isActive: daysRemaining > 0,
  };
}
