import { isFounder as checkIsFounder, isAdmin as checkIsAdmin } from './founderControl';
import { UserProfile } from '@/types/auth';
import { getActiveUserSubscription } from './subscriptionTiers';

const STORAGE_KEY_PRO = 'zenvitra_professional_account_enabled';
const STORAGE_KEY_EVENT = 'zenvitra_event_account_enabled';

export function checkIsProfessionalAccountEnabled(profile?: UserProfile | null): boolean {
  // Founder ALWAYS has universal access unconditionally
  const userIdentifier = profile?.username || profile?.email || '';
  if (checkIsFounder(userIdentifier, profile?.role)) return true;

  // Check verified subscription record or active 1-month promotional trial
  const activeSub = getActiveUserSubscription(userIdentifier);
  if (activeSub && activeSub.status === 'ACTIVE') {
    const proPlans = [
      'zen-pro',
      'zen-elite',
      'pro-starter',
      'pro-standard',
      'pro-plus',
      'pro-enterprise',
      'org-pro',
      'org-elite',
      'org-enterprise',
      'event-pro',
      'event-elite',
    ];
    if (proPlans.includes(activeSub.planId)) return true;
  }

  if (typeof window !== 'undefined') {
    const override = localStorage.getItem(STORAGE_KEY_PRO);
    // Explicit tester override
    if (override === 'true') return true;
    if (override === 'false') return false;
  }

  if (!profile) return false;

  if (checkIsAdmin(userIdentifier, profile.role)) return true;

  const role = (profile.role || '').toLowerCase();
  // Professional roles include organization, company, pro, business, creator, journalist, etc.
  if (
    role === 'professional' ||
    role === 'pro' ||
    role === 'organization' ||
    role === 'org' ||
    role === 'creator' ||
    role === 'journalist' ||
    role === 'admin' ||
    role === 'core_team' ||
    role === 'organizer' ||
    role === 'secretariat'
  ) return true;

  const email = (profile.email || '').toLowerCase();
  if (email === 'founder@zenvitra.xyz' || email === 'founder@zenvitra.org' || email === 'admin@zenvitra.xyz') return true;

  const username = (profile.username || '').replace(/^@/, '').toLowerCase();
  if (username === 'test' || username === 'tester' || profile.id === 'zen_test_pilot_node') return true;
  if ((username === 'yuveer' || username === 'founder') && profile.id === 'zen_founder_root') return true;

  return false;
}

export function checkIsEventAccountEnabled(profile?: UserProfile | null): boolean {
  // Founder ALWAYS has universal access unconditionally
  const eventUserIdentifier = profile?.username || profile?.email || '';
  if (checkIsFounder(eventUserIdentifier, profile?.role)) return true;

  // Check verified subscription record or active event plan
  const activeSub = getActiveUserSubscription(eventUserIdentifier);
  if (activeSub && activeSub.status === 'ACTIVE') {
    const eventPlans = [
      'event-starter',
      'event-basic',
      'event-pro',
      'event-elite',
      'org-pro',
      'org-elite',
      'org-enterprise',
    ];
    if (eventPlans.includes(activeSub.planId)) return true;
  }

  if (typeof window !== 'undefined') {
    const override = localStorage.getItem(STORAGE_KEY_EVENT);
    // Explicit tester override
    if (override === 'true') return true;
    if (override === 'false') return false;
  }

  if (!profile) return false;

  if (checkIsAdmin(eventUserIdentifier, profile.role)) return true;

  const role = (profile.role || '').toLowerCase();
  // Event roles include organizer, eventer, events, secretariat, admin, core_team
  if (
    role === 'organizer' ||
    role === 'eventer' ||
    role === 'events' ||
    role === 'secretariat' ||
    role === 'admin' ||
    role === 'core_team'
  ) return true;

  const email = (profile.email || '').toLowerCase();
  if (email === 'founder@zenvitra.xyz' || email === 'founder@zenvitra.org' || email === 'admin@zenvitra.xyz') return true;

  const username = (profile.username || '').replace(/^@/, '').toLowerCase();
  if (username === 'test' || username === 'tester' || profile.id === 'zen_test_pilot_node') return true;
  if ((username === 'yuveer' || username === 'founder') && profile.id === 'zen_founder_root') return true;

  return false;
}

export function setProfessionalAccountEnabled(enabled: boolean): void {
  if (typeof window === 'undefined') return;
  localStorage.setItem(STORAGE_KEY_PRO, enabled ? 'true' : 'false');
  window.dispatchEvent(new Event('zenvitra_account_capabilities_changed'));
}

export function setEventAccountEnabled(enabled: boolean): void {
  if (typeof window === 'undefined') return;
  localStorage.setItem(STORAGE_KEY_EVENT, enabled ? 'true' : 'false');
  window.dispatchEvent(new Event('zenvitra_account_capabilities_changed'));
}
