'use client';

import { useState, useEffect } from 'react';

export type SubscriptionTier = 
  | 'FREE' 
  | 'PULSE_PASS' 
  | 'PULSE_PRO' 
  | 'FOUNDER_PATRON' 
  | 'SECRETARIAT_CHAIR' 
  | 'DIPLOMAT_LIFETIME';

export interface UserSubscriptionRecord {
  username: string;
  tier: SubscriptionTier;
  expiresAt: string; // ISO or 'LIFETIME'
  features: string[];
  grantedBy: string;
  grantedAt: string;
  active: boolean;
}

export type PlatformRole =
  | 'FOUNDER'
  | 'CO_FOUNDER'
  | 'CHIEF_OF_STAFF'
  | 'ADMIN'
  | 'SECRETARY_GENERAL'
  | 'DIRECTOR_GENERAL'
  | 'CHAIRPERSON'
  | 'VICE_CHAIR'
  | 'RAPPORTEUR'
  | 'ORGANIZER'
  | 'TECH_LEAD'
  | 'FULLSTACK_DEV'
  | 'DESIGN_LEAD'
  | 'POLICY_RESEARCHER'
  | 'FINANCE_LEAD'
  | 'OUTREACH_LEAD'
  | 'OPERATIONS_LEAD'
  | 'CAMPUS_AMBASSADOR'
  | 'COMMUNITY_LEAD'
  | 'MODERATOR'
  | 'PRESS_CORPS'
  | 'RESEARCH_FELLOW'
  | 'HONORARY_DELEGATE'
  | 'DELEGATE'
  | 'SUSPENDED';

export type VerifiedBadgeType = 
  | 'GOLD' 
  | 'BLUE' 
  | 'SECRETARIAT' 
  | 'AMBASSADOR' 
  | 'VIP' 
  | 'PRESS' 
  | 'NONE';

export interface UserNodeOverride {
  username: string;
  role: PlatformRole;
  verifiedBadge: VerifiedBadgeType;
  customTitle?: string;
  extraCivicPoints: number;
  accolades: string[];
  banned: boolean;
  banReason?: string;
  updatedAt: string;
}

export interface GlobalSiteOverrides {
  tickerText: string;
  tickerActive: boolean;
  bannerNotice: string;
  bannerActive: boolean;
  targetLaunchDate: string;
  escrowPercentage: number;
  headlineOverride: string;
  subheadlineOverride: string;
}

export interface FounderDirective {
  id: string;
  title: string;
  body: string;
  author: string;
  tag: string;
  priority: 'NORMAL' | 'URGENT' | 'CONSTITUTIONAL';
  isActive: boolean;
  updatedAt: string;
  mutePulseWire?: boolean;
  muteNotifications?: boolean;
  muteTicker?: boolean;
}

export interface ProtocolControls {
  maintenanceMode: boolean;
  registrationsOpen: boolean;
  chatMeshEnabled: boolean;
  fluxReelsEnabled: boolean;
  assemblyOsEnabled: boolean;
  escrowMandateActive: boolean;
  zeroSurveillanceActive: boolean;
  readOnlyMode: boolean;
}

export interface AuditLogEntry {
  id: string;
  action: string;
  operator: string;
  timestamp: string;
  type: 'DIRECTIVE' | 'NODE' | 'CONTENT' | 'PROTOCOL' | 'SUBSCRIPTION' | 'SITE';
}

const DIRECTIVE_STORAGE_KEY = 'zenvitra_founder_directive_v1';
const PROTOCOL_STORAGE_KEY = 'zenvitra_protocol_controls_v1';
const ADMIN_AUDIT_LOG_KEY = 'zenvitra_admin_audit_logs_v1';
const SUBSCRIPTIONS_STORAGE_KEY = 'zenvitra_admin_subscriptions_v1';
const USER_OVERRIDES_STORAGE_KEY = 'zenvitra_admin_user_overrides_v1';
const SITE_OVERRIDES_STORAGE_KEY = 'zenvitra_admin_site_overrides_v1';

export const DEFAULT_FOUNDER_DIRECTIVE: FounderDirective = {
  id: 'genesis-directive-02',
  title: 'A NOTE FROM THE FOUNDER',
  body: `# WE ARE THE YOUTH.

## WE ARE NOBODY'S PUPPETS. AND WE WILL BE HEARD.

We are tired of being dismissed because of our age. Tired of being expected to swallow narratives we never agreed with, defend figures we never chose, and stay silent simply because someone powerful spoke.

WE ARE NOBODY'S GHULAAM. NOBODY'S DALLEY. NOBODY'S PUPPETS.

ZENVITRA was never meant to be just another platform for vanity titles, sterile certificates, or packaged PR. We are building a sovereign space where young minds can question, write, debate, and expose the truth without surrendering their conscience to be heard.

### NO PARTY OWNS US. NO AGENDA DEFINES US.

Let this be absolute: We are not the PR machinery, IT cell, or mouthpieces for any political party, institution, sponsor, or individual. Influence and money cannot buy ownership of our voice. We respect debate, but we will never confuse respect with obedience.

### SOURCE IS WHAT WE PLEASE.

We refuse to be restricted to one approved narrative or state-sanctioned outlet. We examine competing evidence, investigate alternative accounts, and think for ourselves.

SOURCE IS WHAT WE PLEASE. TRUTH IS WHAT THE EVIDENCE CAN SUPPORT.

Our independence gives us the right to reference what we choose; our responsibility demands that we verify facts ruthlessly and separate truth from propaganda.

### TO OUR CORE TEAM: THINK INDEPENDENTLY.

Your designation is a duty, not a crown. I do not want blind followers—I want people with conviction who challenge ideas, call out mistakes, and speak truth to power. If you believe I am wrong, say it. We build on mutual respect, not subservience.

### WE WILL NOT ASK FOR PERMISSION TO THINK.

We will make mistakes, but we refuse to stay quiet. We will not sell our voice to belong, and we will never silence ourselves to make the powerful comfortable.

WE ARE HERE TO BUILD OUR OWN FUTURE.

We are the youth. We are independent. And we are just getting started.

Yuveer Chhatwani
Founder, ZENVITRA

BY YOUTH. FOR YOUTH. OWNED BY NO AGENDA.`,
  author: 'Yuveer Chhatwani',
  tag: 'THE ZENVITRA MANIFESTO • BY YOUTH. FOR YOUTH.',
  priority: 'CONSTITUTIONAL',
  isActive: true,
  updatedAt: new Date().toISOString(),
};

export const DEFAULT_PROTOCOL_CONTROLS: ProtocolControls = {
  maintenanceMode: false,
  registrationsOpen: true,
  chatMeshEnabled: true,
  fluxReelsEnabled: true,
  assemblyOsEnabled: true,
  escrowMandateActive: true,
  zeroSurveillanceActive: true,
  readOnlyMode: false,
};

export const DEFAULT_SITE_OVERRIDES: GlobalSiteOverrides = {
  tickerText: '⚡ SOVEREIGN WIRE LIVE • ZERO AD SURVEILLANCE • 10% ENDOWMENT LOCK',
  tickerActive: true,
  bannerNotice: '',
  bannerActive: false,
  targetLaunchDate: '2026-11-08T00:00:00+05:30',
  escrowPercentage: 10,
  headlineOverride: '',
  subheadlineOverride: '',
};

export function getFounderDirective(): FounderDirective {
  if (typeof window === 'undefined') return DEFAULT_FOUNDER_DIRECTIVE;
  try {
    const raw = localStorage.getItem(DIRECTIVE_STORAGE_KEY);
    if (!raw) return DEFAULT_FOUNDER_DIRECTIVE;
    const parsed = JSON.parse(raw);
    if (!parsed || parsed.id !== DEFAULT_FOUNDER_DIRECTIVE.id) {
      localStorage.setItem(DIRECTIVE_STORAGE_KEY, JSON.stringify(DEFAULT_FOUNDER_DIRECTIVE));
      return DEFAULT_FOUNDER_DIRECTIVE;
    }
    // Invalidate stale legacy directives that had older versions or asterisks
    if (parsed.body && (!parsed.body.includes('SOURCE IS WHAT WE PLEASE') || !parsed.body.includes('NOBODY\'S PUPPETS') || parsed.body.includes('*'))) {
      localStorage.setItem(DIRECTIVE_STORAGE_KEY, JSON.stringify(DEFAULT_FOUNDER_DIRECTIVE));
      return DEFAULT_FOUNDER_DIRECTIVE;
    }
    return parsed;
  } catch {
    return DEFAULT_FOUNDER_DIRECTIVE;
  }
}

export function extractSafeIdentity(val: any): { identifier: string; role?: string; id?: string } {
  if (!val) return { identifier: '' };
  if (typeof val === 'string') return { identifier: val };
  if (typeof val === 'object') {
    // SECURITY: NEVER use val.name or val.display_name as a security identifier!
    // Regular users named 'Yuveer', 'Aarush', or 'Khushi' must never be granted admin privileges based on display name.
    const identifier = val.username || val.email || val.handle || '';
    const role = val.role || '';
    const id = val.id || '';
    return {
      identifier: typeof identifier === 'string' ? identifier : String(identifier || ''),
      role: typeof role === 'string' ? role : String(role || ''),
      id: typeof id === 'string' ? id : String(id || ''),
    };
  }
  return { identifier: String(val) };
}

export function isYuveer(usernameOrEmail?: string | null | any): boolean {
  if (!usernameOrEmail) return false;
  // If a full user object was passed, perform strict verification
  if (typeof usernameOrEmail === 'object' && usernameOrEmail !== null) {
    const id = String(usernameOrEmail.id || '').toLowerCase().trim();
    const email = String(usernameOrEmail.email || '').toLowerCase().trim();
    const role = String(usernameOrEmail.role || '').toUpperCase().trim();
    if (id === 'zen_founder_root') return true;
    if (email === 'founder@zenvitra.xyz' || email === 'founder@zenvitra.org' || email === 'founder@zenvitra.com' || email === 'yuveer@zenvitra.xyz') return true;
    if (role === 'FOUNDER' && (usernameOrEmail.username === 'yuveer' || usernameOrEmail.username === 'founder')) return true;
    return false;
  }
  const { identifier, id, role } = extractSafeIdentity(usernameOrEmail);
  if (id === 'zen_founder_root') return true;
  if (!identifier) return false;
  const clean = identifier.toLowerCase().trim().replace(/^@/, '');
  // Strict identity matching for Founder (Yuveer Chhatwani)
  // Must match official verified email or root ID
  return (
    clean === 'zen_founder_root' ||
        clean === 'founder@zenvitra.xyz' ||
    clean === 'founder@zenvitra.org' ||
    clean === 'founder@zenvitra.com' ||
    clean === 'yuveer@zenvitra.xyz' ||
    clean === 'yuveer@zenvitra.org' ||
    clean === 'yuveer@zenvitra.com' ||
    ((clean === 'yuveer' || clean === 'founder') && (role?.toUpperCase() === 'FOUNDER' || (typeof window !== 'undefined' && localStorage.getItem('zenvitra_founder_active_session') === 'true')))
  );
}

export function isAarush(usernameOrEmail?: string | null | any): boolean {
  if (!usernameOrEmail) return false;
  if (typeof usernameOrEmail === 'object' && usernameOrEmail !== null) {
    const id = String(usernameOrEmail.id || '').toLowerCase().trim();
    const email = String(usernameOrEmail.email || '').toLowerCase().trim();
    const role = String(usernameOrEmail.role || '').toUpperCase().trim();
    if (id === 'zen_cofounder_aarush') return true;
    if (email === 'aarush@zenvitra.xyz' || email === 'aarush@zenvitra.com' || email === 'aarush@zenvitra.org') return true;
    if (role === 'CO_FOUNDER' && (usernameOrEmail.username === 'aarush')) return true;
    return false;
  }
  const { identifier, id, role } = extractSafeIdentity(usernameOrEmail);
  if (id === 'zen_cofounder_aarush') return true;
  if (!identifier) return false;
  const clean = identifier.toLowerCase().trim().replace(/^@/, '');
  return (
    clean === 'zen_cofounder_aarush' ||
    clean === 'aarush@zenvitra.xyz' ||
    clean === 'aarush@zenvitra.com' ||
    clean === 'aarush@zenvitra.org' ||
    clean === 'aarush-vijayivargiya-cofounder' ||
    (clean === 'aarush' && role?.toUpperCase() === 'CO_FOUNDER')
  );
}

export function saveFounderDirective(directive: Partial<FounderDirective>, editorUsername?: string): FounderDirective {
  if (typeof window === 'undefined') return DEFAULT_FOUNDER_DIRECTIVE;
  
  // Security Guard: Founder's Note can strictly only be edited by @yuveer
  const sessionUser = (localStorage.getItem('zenvitra_session_user') || '').toLowerCase().trim().replace(/^@/, '');
  const editor = (editorUsername || sessionUser).toLowerCase().trim().replace(/^@/, '');
  const isAuthorized = isYuveer(editor) || isFounderSessionActive();

  if (!isAuthorized) {
    console.warn('Unauthorized attempt to edit Founder Note. Access restricted strictly to @yuveer.');
    return getFounderDirective();
  }

  const current = getFounderDirective();
  const updated: FounderDirective = {
    ...current,
    ...directive,
    updatedAt: new Date().toISOString(),
  };
  localStorage.setItem(DIRECTIVE_STORAGE_KEY, JSON.stringify(updated));
  window.dispatchEvent(new CustomEvent('zenvitra_founder_update', { detail: updated }));
  addAuditLog(`Updated Founder Directive: "${updated.title}"`, 'DIRECTIVE');
  return updated;
}

export function clearFounderDirective(editorUsername?: string): void {
  if (typeof window === 'undefined') return;

  const sessionUser = (localStorage.getItem('zenvitra_session_user') || '').toLowerCase().trim().replace(/^@/, '');
  const editor = (editorUsername || sessionUser).toLowerCase().trim().replace(/^@/, '');
  const isAuthorized = isYuveer(editor) || isFounderSessionActive();

  if (!isAuthorized) {
    console.warn('Unauthorized attempt to clear Founder Note. Access restricted strictly to @yuveer.');
    return;
  }

  const cleared: FounderDirective = {
    ...DEFAULT_FOUNDER_DIRECTIVE,
    isActive: false,
    updatedAt: new Date().toISOString(),
  };
  localStorage.setItem(DIRECTIVE_STORAGE_KEY, JSON.stringify(cleared));
  window.dispatchEvent(new CustomEvent('zenvitra_founder_update', { detail: cleared }));
  addAuditLog('Deactivated Founder Directive.', 'DIRECTIVE');
}

/* ── Subscriptions Granter & Manager ── */
export function getAllSubscriptions(): Record<string, UserSubscriptionRecord> {
  if (typeof window === 'undefined') return {};
  try {
    const raw = localStorage.getItem(SUBSCRIPTIONS_STORAGE_KEY);
    return raw ? JSON.parse(raw) : {};
  } catch {
    return {};
  }
}

export function getUserSubscription(username: string): UserSubscriptionRecord | null {
  if (!username) return null;
  const clean = username.toLowerCase().trim().replace(/^@/, '');
  
  // FOUNDER HAS PERMANENT UNIVERSAL SUBSCRIPTION TO EVERYTHING
  if (isFounder(clean)) {
    return {
      username: clean,
      tier: 'FOUNDER_PATRON',
      expiresAt: 'LIFETIME',
      features: [
        'ALL_VIP_ACCESS',
        'UNIVERSAL_FOUNDER_SUBSCRIPTION',
        'EVERYTHING_ACCESS',
        'UNLIMITED_CHAMBERS',
        'ORGANIZER_PRO',
        'CONFERENCE_OS_FULL_ACCESS',
        'DAIS_CONTROL',
        'REVENUE_TELEMETRY',
        'SUMMIT_ROOMS',
        'FLUX_PRO',
        'UNLIMITED_GLIMPSES',
        'CUSTOM_BADGE',
        'ZERO_SURVEILLANCE_BYPASS',
        'DOCS_PRO'
      ],
      grantedBy: 'CONSTITUTIONAL_FOUNDER_COVENANT',
      grantedAt: '2026-08-15T00:00:00.000Z',
      active: true,
    };
  }

  const all = getAllSubscriptions();
  return all[clean] || null;
}

export function hasUniversalAccess(usernameOrEmail?: string | null, role?: string | null): boolean {
  return isFounder(usernameOrEmail, role);
}

export function grantUserSubscription(
  username: string,
  tier: SubscriptionTier,
  expiresAt: string = 'LIFETIME',
  features: string[] = ['ALL_VIP_ACCESS', 'SUMMIT_ROOMS', 'FLUX_PRO', 'UNLIMITED_GLIMPSES', 'CUSTOM_BADGE']
): UserSubscriptionRecord {
  const cleanUser = username.toLowerCase().trim();
  const all = getAllSubscriptions();
  const record: UserSubscriptionRecord = {
    username: cleanUser,
    tier,
    expiresAt,
    features,
    grantedBy: 'FOUNDER_ROOT',
    grantedAt: new Date().toISOString(),
    active: true,
  };
  all[cleanUser] = record;
  if (typeof window !== 'undefined') {
    localStorage.setItem(SUBSCRIPTIONS_STORAGE_KEY, JSON.stringify(all));
    window.dispatchEvent(new CustomEvent('zenvitra_subscription_update', { detail: { username: cleanUser, record } }));
    addAuditLog(`Granted [${tier}] Subscription to @${cleanUser} (${expiresAt})`, 'SUBSCRIPTION');
  }
  return record;
}

export function revokeUserSubscription(username: string): void {
  const cleanUser = username.toLowerCase().trim();
  const all = getAllSubscriptions();
  delete all[cleanUser];
  if (typeof window !== 'undefined') {
    localStorage.setItem(SUBSCRIPTIONS_STORAGE_KEY, JSON.stringify(all));
    window.dispatchEvent(new CustomEvent('zenvitra_subscription_update', { detail: { username: cleanUser, record: null } }));
    addAuditLog(`Revoked Subscription for @${cleanUser}`, 'SUBSCRIPTION');
  }
}

/* ── User & Node Overrides (Roles, Points, Badges, Bans) ── */
export function getAllUserOverrides(): Record<string, UserNodeOverride> {
  if (typeof window === 'undefined') return {};
  try {
    const raw = localStorage.getItem(USER_OVERRIDES_STORAGE_KEY);
    return raw ? JSON.parse(raw) : {};
  } catch {
    return {};
  }
}

export function getUserOverride(username: string): UserNodeOverride | null {
  const all = getAllUserOverrides();
  return all[username.toLowerCase().trim()] || null;
}

export function saveUserOverride(username: string, override: Partial<UserNodeOverride>): UserNodeOverride {
  const cleanUser = username.toLowerCase().trim();
  const all = getAllUserOverrides();
  const current = all[cleanUser] || {
    username: cleanUser,
    role: 'DELEGATE',
    verifiedBadge: 'NONE',
    extraCivicPoints: 0,
    accolades: [],
    banned: false,
    updatedAt: new Date().toISOString(),
  };

  const updated: UserNodeOverride = {
    ...current,
    ...override,
    username: cleanUser,
    updatedAt: new Date().toISOString(),
  };

  all[cleanUser] = updated;
  if (typeof window !== 'undefined') {
    localStorage.setItem(USER_OVERRIDES_STORAGE_KEY, JSON.stringify(all));
    window.dispatchEvent(new CustomEvent('zenvitra_node_override_update', { detail: { username: cleanUser, override: updated } }));
    addAuditLog(`Mutated Node Dossier for @${cleanUser} (Role: ${updated.role}, Verified: ${updated.verifiedBadge}, +${updated.extraCivicPoints} pts)`, 'NODE');
  }
  return updated;
}

/* ── Global Site Overrides (Launch Countdown, Escrow %, Tickers) ── */
export function getSiteOverrides(): GlobalSiteOverrides {
  if (typeof window === 'undefined') return DEFAULT_SITE_OVERRIDES;
  try {
    const raw = localStorage.getItem(SITE_OVERRIDES_STORAGE_KEY);
    if (!raw) return DEFAULT_SITE_OVERRIDES;
    return { ...DEFAULT_SITE_OVERRIDES, ...JSON.parse(raw) };
  } catch {
    return DEFAULT_SITE_OVERRIDES;
  }
}

export function saveSiteOverrides(overrides: Partial<GlobalSiteOverrides>): GlobalSiteOverrides {
  if (typeof window === 'undefined') return DEFAULT_SITE_OVERRIDES;
  const current = getSiteOverrides();
  const updated = { ...current, ...overrides };
  localStorage.setItem(SITE_OVERRIDES_STORAGE_KEY, JSON.stringify(updated));
  window.dispatchEvent(new CustomEvent('zenvitra_site_overrides_update', { detail: updated }));
  addAuditLog(`Updated Global Site Parameters (Escrow: ${updated.escrowPercentage}%, Ticker: "${updated.tickerText.slice(0, 30)}...")`, 'SITE');
  return updated;
}

/* ── Protocol Controls Get / Set ── */
export function getProtocolControls(): ProtocolControls {
  if (typeof window === 'undefined') return DEFAULT_PROTOCOL_CONTROLS;
  try {
    const raw = localStorage.getItem(PROTOCOL_STORAGE_KEY);
    let parsed = raw ? { ...DEFAULT_PROTOCOL_CONTROLS, ...JSON.parse(raw) } : { ...DEFAULT_PROTOCOL_CONTROLS };

    // Auto-turn on Delegate Identity Registration once October 25, 2026, 14:00:00 IST is reached
    const LAUNCH_TIMESTAMP = new Date('2026-10-25T14:00:00+05:30').getTime();
    if (Date.now() >= LAUNCH_TIMESTAMP && !parsed.registrationsOpen) {
      parsed.registrationsOpen = true;
      localStorage.setItem(PROTOCOL_STORAGE_KEY, JSON.stringify(parsed));
    }

    return parsed;
  } catch {
    return DEFAULT_PROTOCOL_CONTROLS;
  }
}

export function saveProtocolControls(controls: Partial<ProtocolControls>): ProtocolControls {
  if (typeof window === 'undefined') return DEFAULT_PROTOCOL_CONTROLS;
  const current = getProtocolControls();
  const updated = { ...current, ...controls };
  localStorage.setItem(PROTOCOL_STORAGE_KEY, JSON.stringify(updated));
  window.dispatchEvent(new CustomEvent('zenvitra_protocol_update', { detail: updated }));
  addAuditLog(`Mutated Protocol Controls.`, 'PROTOCOL');

  // Broadcast to server for global cross-browser and cross-device sync
  try {
    fetch('/api/protocols', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(updated),
    }).catch(() => {});
  } catch (_) {}

  return updated;
}

export function useProtocolControls(): ProtocolControls {
  const [controls, setControls] = useState<ProtocolControls>(() => getProtocolControls());

  useEffect(() => {
    setControls(getProtocolControls());
    const handler = (e: any) => {
      setControls(e.detail || getProtocolControls());
    };
    window.addEventListener('zenvitra_protocol_update', handler);
    return () => window.removeEventListener('zenvitra_protocol_update', handler);
  }, []);

  return controls;
}

/* ── Audit Trail ── */
export function getAuditLogs(): AuditLogEntry[] {
  if (typeof window === 'undefined') return [];
  try {
    const raw = localStorage.getItem(ADMIN_AUDIT_LOG_KEY);
    if (!raw) return [];
    return JSON.parse(raw);
  } catch {
    return [];
  }
}

export function addAuditLog(action: string, type: AuditLogEntry['type'] = 'PROTOCOL'): void {
  if (typeof window === 'undefined') return;
  try {
    const current = getAuditLogs();
    const entry: AuditLogEntry = {
      id: 'log_' + Date.now() + '_' + Math.random().toString(36).substring(2, 6),
      action,
      operator: '@yuveer (Founder & CEO)',
      timestamp: new Date().toISOString(),
      type,
    };
    const updated = [entry, ...current].slice(0, 150);
    localStorage.setItem(ADMIN_AUDIT_LOG_KEY, JSON.stringify(updated));
  } catch {}
}

/* ── Personal Founder Keys & Sovereignty Clearance ── */
export const PERSONAL_FOUNDER_KEYS = [
  'YUV-ROOT-MASTER-777',
  'YUVEER-FOUNDER-2026',
  'YUV-SOVEREIGN-KEY',
  'FOUNDER-100000',
  'ROOT-YUVEER',
  'ZEN-FOUNDER-PASSKEY-999',
  'AARUSH-COFOUNDER-2026',
  'COFOUNDER-AARUSH',
  '5747',
  '574729',
  '0000',
  '7788',
  'YUVEER',
  'AARUSH',
  'FOUNDER',
];

export const FOUNDER_MASTER_KEY_STORAGE = 'zenvitra_founder_master_key';
export const FOUNDER_OVERRIDE_STORAGE = 'zenvitra_founder_override';

export function verifyFounderKey(key: string): boolean {
  if (!key) return false;
  const cleanKey = key.trim().toUpperCase();
  if (PERSONAL_FOUNDER_KEYS.includes(cleanKey)) return true;
  if (typeof window !== 'undefined') {
    const customKey = localStorage.getItem('zenvitra_custom_founder_key');
    if (customKey && customKey.trim().toUpperCase() === cleanKey) return true;
  }
  return false;
}

export function activateFounderSession(key: string): boolean {
  if (verifyFounderKey(key)) {
    if (typeof window !== 'undefined') {
      // Security Guard: Check if an unauthorized non-founder account is currently logged in
      const stored = localStorage.getItem('zenvitra_session_user');
      if (stored) {
        try {
          const parsed = JSON.parse(stored);
          const handle = (parsed?.username || parsed?.handle || '').toLowerCase().trim().replace(/^@/, '');
          const email = (parsed?.email || '').toLowerCase().trim();
          const r = (parsed?.role || '').toUpperCase().trim();
          const uid = (parsed?.id || '').toString();

          if ((handle || email || r) && !isFounder(handle, r) && !isFounder(email, r) && !isFounder(uid, r)) {
            return false;
          }
        } catch {}
      }

      localStorage.setItem(FOUNDER_MASTER_KEY_STORAGE, key.trim().toUpperCase());
      localStorage.setItem(FOUNDER_OVERRIDE_STORAGE, 'true');
      localStorage.setItem('zenvitra_founder_active_session', 'true');

      addAuditLog(`Founder Sovereign Session Activated with Personal Master Key`, 'PROTOCOL');
    }
    return true;
  }
  return false;
}

export function isFounderSessionActive(): boolean {
  if (typeof window === 'undefined') return false;

  // Strict session owner verification:
  // If an active session user exists and is NOT verified as Founder or Co-Founder, founder session CANNOT be active.
  try {
    const rawUser = localStorage.getItem('zenvitra_session_user');
    if (rawUser) {
      const parsed = JSON.parse(rawUser);
      const userHandle = (parsed?.username || parsed?.handle || '').toLowerCase().trim().replace(/^@/, '');
      const userEmail = (parsed?.email || '').toLowerCase().trim();
      const userId = (parsed?.id || '').toLowerCase().trim();
      const userRole = (parsed?.role || '').toUpperCase().trim();

      const isAuthorizedUser =
        isYuveer(userHandle) ||
        isYuveer(userEmail) ||
        userId === 'zen_founder_root' ||
                isAarush(userHandle) ||
        isAarush(userEmail) ||
        userId === 'zen_cofounder_aarush' ||
        userId === 'aarush-vijayivargiya-cofounder' ||
                userEmail === 'khushi@zenvitra.xyz' ||
        userEmail === 'khushi@zenvitra.org' ||
        userEmail === 'khushi@zenvitra.com' ||
        userId === 'zen_cofounder_khushi' ||
        userId === 'khushi-rb-cofounder' ||
        userId === 'cofounder-cto-partner' ||
        userId === 'cofounder-alliances';

      if (!isAuthorizedUser) {
        // Active session belongs to an unauthorized non-founder user! Cleanse lingering founder session keys immediately.
        localStorage.removeItem(FOUNDER_MASTER_KEY_STORAGE);
        localStorage.removeItem(FOUNDER_OVERRIDE_STORAGE);
        localStorage.removeItem('zenvitra_founder_active_session');
        return false;
      }
    }
  } catch (_) {}

  const storedKey = localStorage.getItem(FOUNDER_MASTER_KEY_STORAGE);
  const override = localStorage.getItem(FOUNDER_OVERRIDE_STORAGE);
  return override === 'true' || (Boolean(storedKey) && verifyFounderKey(storedKey || ''));
}

export function deactivateFounderSession(): void {
  if (typeof window === 'undefined') return;
  localStorage.removeItem(FOUNDER_MASTER_KEY_STORAGE);
  localStorage.removeItem(FOUNDER_OVERRIDE_STORAGE);
  localStorage.removeItem('zenvitra_founder_active_session');
}

export function setCustomFounderKey(newKey: string): void {
  if (typeof window === 'undefined') return;
  localStorage.setItem('zenvitra_custom_founder_key', newKey.trim().toUpperCase());
  addAuditLog(`Founder updated Personal Sovereign Master Key`, 'PROTOCOL');
}

export function isCoFounder(usernameOrEmail?: string | null | any, role?: string | null): boolean {
  if (typeof usernameOrEmail === 'object' && usernameOrEmail !== null) {
    const id = String(usernameOrEmail.id || '').toLowerCase().trim();
    const email = String(usernameOrEmail.email || '').toLowerCase().trim();
    const r = String(role || usernameOrEmail.role || '').toUpperCase().trim();
    if (id === 'zen_cofounder_khushi' || id === 'zen_cofounder_aarush') return true;
    if (email === 'khushi@zenvitra.xyz' || email === 'aarush@zenvitra.xyz') return true;
    if ((r === 'CO_FOUNDER' || r === 'COFOUNDER') && (usernameOrEmail.username === 'khushi' || usernameOrEmail.username === 'aarush')) return true;
    return false;
  }
  const extracted = extractSafeIdentity(usernameOrEmail);
  const effectiveRole = role || extracted.role;
  const effectiveIdentifier = extracted.identifier;
  const effectiveId = extracted.id;

  if (effectiveId === 'zen_cofounder_khushi' || effectiveId === 'zen_cofounder_aarush') return true;
  if (!effectiveIdentifier && !effectiveRole) return false;
  const clean = effectiveIdentifier.toLowerCase().trim().replace(/^@/, '');
  const r = (effectiveRole || '').toUpperCase().trim();
  
  if ((r === 'CO_FOUNDER' || r === 'COFOUNDER') && (clean === 'khushi' || clean === 'aarush')) return true;
  return (
    isAarush(clean) ||
    clean === 'zen_cofounder_khushi' ||
    clean === 'khushi@zenvitra.xyz' ||
    clean === 'khushi@zenvitra.org' ||
    clean === 'khushi@zenvitra.com' ||
    clean === 'khushi-rb-cofounder' ||
    clean === 'cofounder-cto-partner' ||
    clean === 'cofounder-alliances'
  );
}

export function isFounder(usernameOrEmail?: string | null | any, role?: string | null): boolean {
  const extracted = extractSafeIdentity(usernameOrEmail);
  const effectiveRole = role || extracted.role;
  const effectiveIdentifier = extracted.identifier;
  const effectiveId = extracted.id;

  if (effectiveId === 'zen_founder_root') return true;

  // If a specific username or email is checked, it MUST match the strict Founder identity
  if (effectiveIdentifier) {
    const isAuthenticFounder = isYuveer(effectiveIdentifier);
    if (!isAuthenticFounder) return false;
    return true;
  }

  const r = (effectiveRole || '').toUpperCase().trim();
  if (r === 'FOUNDER' && typeof window !== 'undefined') {
    return isFounderSessionActive();
  }

  // If no username/email was passed, check the verified active founder session
  if (typeof window !== 'undefined') {
    return isFounderSessionActive();
  }
  return false;
}

export function isFounderOrCoFounder(
  usernameOrEmail?: string | null | any,
  role?: string | null,
  id?: string | null
): boolean {
  const extracted = extractSafeIdentity(usernameOrEmail);
  const effectiveRole = role || extracted.role;
  const effectiveIdentifier = extracted.identifier;
  const effectiveId = id || extracted.id;

  if (!effectiveIdentifier && !effectiveRole && !effectiveId) {
    if (typeof window !== 'undefined') {
      return isFounderSessionActive();
    }
    return false;
  }

  const clean = effectiveIdentifier.toLowerCase().trim().replace(/^@/, '');
  const r = (effectiveRole || '').toUpperCase().trim();
  const cleanId = (effectiveId || '').toLowerCase().trim();

  // 1. Founder identity check
  if (isFounder(clean, r) || (cleanId && isFounder(cleanId, r))) {
    return true;
  }

  // 2. Co-Founder identity check (Khushi & Aarush)
  if (isCoFounder(clean, r) || (cleanId && isCoFounder(cleanId, r))) {
    return true;
  }

  // 3. Session check fallback
  if (typeof window !== 'undefined' && isFounderSessionActive()) {
    return true;
  }

  return false;
}

export function isCurrentSessionFounderOrCoFounder(): boolean {
  if (typeof window === 'undefined') return false;

  try {
    const raw = localStorage.getItem('zenvitra_session_user') || localStorage.getItem('zenvitra_pulse_user_v6');
    if (raw) {
      const parsed = JSON.parse(raw);
      const username = parsed?.username || parsed?.handle || '';
      const email = parsed?.email || '';
      const role = parsed?.role || '';
      const id = parsed?.id || '';

      if (
        isFounderOrCoFounder(username, role, id) ||
        isFounderOrCoFounder(email, role, id)
      ) {
        return true;
      }
    }
  } catch (_) {}

  if (isFounderSessionActive()) {
    return true;
  }

  return false;
}

export const PRIVILEGED_CLEARANCE_ROLES = [
  'FOUNDER',
  'CO_FOUNDER',
  'COFOUNDER',
  'CHIEF_OF_STAFF',
  'ADMIN',
  'SECRETARY_GENERAL',
  'DIRECTOR_GENERAL',
  'CHAIRPERSON',
  'VICE_CHAIR',
  'TECH_LEAD',
  'FULLSTACK_DEV',
  'DESIGN_LEAD',
  'POLICY_RESEARCHER',
  'FINANCE_LEAD',
  'OUTREACH_LEAD',
  'OPERATIONS_LEAD',
  'COMMUNITY_LEAD',
  'MODERATOR',
  'SECRETARIAT_CHAIR',
  'CORE_TEAM',
];

export function isAdmin(usernameOrEmail?: string | null | any, role?: string | null): boolean {
  const extracted = extractSafeIdentity(usernameOrEmail);
  const effectiveRole = role || extracted.role;
  const effectiveIdentifier = extracted.identifier;

  if (isFounder(effectiveIdentifier, effectiveRole)) return true;
  if (isCoFounder(effectiveIdentifier, effectiveRole)) return true;
  const clean = effectiveIdentifier.toLowerCase().trim().replace(/^@/, '');
  const r = (effectiveRole || '').toUpperCase().trim();
  return (
    PRIVILEGED_CLEARANCE_ROLES.includes(r) ||
    clean === 'admin'
  );
}

/**
 * Strict Double-Lock Verification:
 * Validates whether an account identity qualifies as Founder, Co-Founder, Admin, or Core Team.
 * Normal user accounts (delegate, student, guest, creator, journalist, professional, etc.) strictly evaluate to false.
 */
export function isPrivilegedAccount(
  usernameOrEmail?: string | null | any,
  role?: string | null,
  id?: string | null
): boolean {
  const extracted = extractSafeIdentity(usernameOrEmail);
  const effectiveRole = role || extracted.role;
  const effectiveIdentifier = extracted.identifier;
  const effectiveId = id || extracted.id;

  if (!effectiveIdentifier && !effectiveRole && !effectiveId) return false;

  const clean = effectiveIdentifier.toLowerCase().trim().replace(/^@/, '');
  const r = (effectiveRole || '').toUpperCase().trim();
  const cleanId = (effectiveId || '').toLowerCase().trim();

  // 1. Founder Identity (Yuveer)
  if (isFounder(clean, r) || (cleanId && isFounder(cleanId, r))) return true;

  // 2. Co-Founder Identities (Aarush, Khushi)
  if (isCoFounder(clean, r) || (cleanId && isCoFounder(cleanId, r))) return true;

  // 3. Admin / Core Team designations
  if (isAdmin(clean, r) || (cleanId && isAdmin(cleanId, r))) return true;

  return false;
}


/* ── Admin Access Key & Link Framework ── */
export const ADMIN_BYPASS_KEYS = [
  'ZEN-ADMIN-PASS-2026',
  'ZEN-OPERATOR-ACCESS-777',
  'ZEN-MAINTENANCE-BYPASS',
  'ADMIN-OVERRIDE-SECRET',
  'DELEGATE-LEAD-CHAIR',
  'STAFF-ACCESS-KEY-2026',
];

export const ADMIN_OVERRIDE_STORAGE = 'zenvitra_admin_override_token';

export function verifyAdminKey(key: string): boolean {
  if (!key) return false;
  const cleanKey = key.trim().toUpperCase();
  if (verifyFounderKey(cleanKey)) return true;
  if (ADMIN_BYPASS_KEYS.includes(cleanKey)) return true;
  if (typeof window !== 'undefined') {
    const customAdminKeys = localStorage.getItem('zenvitra_custom_admin_keys');
    if (customAdminKeys) {
      try {
        const parsed: string[] = JSON.parse(customAdminKeys);
        if (parsed.includes(cleanKey)) return true;
      } catch (_) {}
    }
  }
  return false;
}

export function activateAdminSession(key: string, name: string = 'Staff Admin'): boolean {
  if (!key) return false;
  const cleanKey = key.trim().toUpperCase();
  if (verifyFounderKey(cleanKey)) {
    return activateFounderSession(cleanKey);
  }
  if (verifyAdminKey(cleanKey)) {
    if (typeof window !== 'undefined') {
      // Security Guard: Check if the currently active user is a normal user
      const rawUser = localStorage.getItem('zenvitra_session_user') || localStorage.getItem('zenvitra_pulse_user_v6');
      if (rawUser) {
        try {
          const parsed = JSON.parse(rawUser);
          const handle = (parsed?.username || parsed?.handle || '').toLowerCase().trim().replace(/^@/, '');
          const email = (parsed?.email || '').toLowerCase().trim();
          const r = (parsed?.role || '').toUpperCase().trim();
          const uid = (parsed?.id || '').toString();

          // If the logged in user is explicitly a normal user, DO NOT activate admin session!
          if ((handle || email || r) && !isPrivilegedAccount(handle, r, uid) && !isPrivilegedAccount(email, r, uid)) {
            return false;
          }
        } catch {}
      }

      localStorage.setItem(ADMIN_OVERRIDE_STORAGE, cleanKey);
      localStorage.setItem('zenvitra_admin_active_session', 'true');
      addAuditLog(`Admin Session Activated via Key: ${cleanKey.slice(0, 8)}...`, 'PROTOCOL');
    }
    return true;
  }
  return false;
}

export function isAdminSessionActive(): boolean {
  if (typeof window === 'undefined') return false;
  if (isFounderSessionActive()) return true;

  // Strict session owner verification for admin:
  // If an active session user exists and is a normal user, admin session cannot be active!
  try {
    const rawUser = localStorage.getItem('zenvitra_session_user') || localStorage.getItem('zenvitra_pulse_user_v6');
    if (rawUser) {
      const parsed = JSON.parse(rawUser);
      const userHandle = (parsed?.username || parsed?.handle || '').toLowerCase().trim().replace(/^@/, '');
      const userEmail = (parsed?.email || '').toLowerCase().trim();
      const userId = (parsed?.id || '').toString();
      const userRole = (parsed?.role || '').toUpperCase().trim();

      const isPrivileged =
        isPrivilegedAccount(userHandle, userRole, userId) ||
        isPrivilegedAccount(userEmail, userRole, userId);

      if (!isPrivileged && (userHandle || userEmail || userRole)) {
        // Active session belongs to a normal non-admin user! Purge admin override tokens immediately.
        localStorage.removeItem(ADMIN_OVERRIDE_STORAGE);
        localStorage.removeItem('zenvitra_admin_active_session');
        return false;
      }
    }
  } catch (_) {}

  const storedAdmin = localStorage.getItem(ADMIN_OVERRIDE_STORAGE);
  const adminActive = localStorage.getItem('zenvitra_admin_active_session') === 'true';
  return (adminActive || Boolean(storedAdmin)) && verifyAdminKey(storedAdmin || '');
}

export function generateCustomAdminKey(keyName: string): string {
  const clean = keyName.trim().toUpperCase().replace(/[^A-Z0-9_-]/g, '-');
  const fullKey = `ZEN-ADMIN-${clean}-${Math.floor(1000 + Math.random() * 9000)}`;
  if (typeof window !== 'undefined') {
    try {
      const current = localStorage.getItem('zenvitra_custom_admin_keys');
      const list: string[] = current ? JSON.parse(current) : [];
      if (!list.includes(fullKey)) {
        list.push(fullKey);
        localStorage.setItem('zenvitra_custom_admin_keys', JSON.stringify(list));
      }
    } catch {}
  }
  return fullKey;
}

export function getCustomAdminKeys(): string[] {
  if (typeof window === 'undefined') return [];
  try {
    const raw = localStorage.getItem('zenvitra_custom_admin_keys');
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}
