'use client';

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
  id: 'genesis-directive-01',
  title: 'CONSTITUTIONAL DECREE: GENESIS OF SOVEREIGN MESH',
  body: 'To all delegates, writers, and sovereign nodes: Zenvitra operates under zero commercial surveillance and a hardcoded 25% educational endowment. Discourse is strictly evaluated on verifiable sources and empirical rigor.',
  author: '@yuveer (Founder & CEO)',
  tag: 'EXECUTIVE DIRECTIVE',
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
  tickerText: '⚡ SOVEREIGN WIRE LIVE • ZERO AD SURVEILLANCE • 25% ENDOWMENT LOCK',
  tickerActive: true,
  bannerNotice: '',
  bannerActive: false,
  targetLaunchDate: '2026-11-08T00:00:00+05:30',
  escrowPercentage: 25,
  headlineOverride: '',
  subheadlineOverride: '',
};

/* ── Founder Directive Get / Set / Reset ── */
export function getFounderDirective(): FounderDirective {
  if (typeof window === 'undefined') return DEFAULT_FOUNDER_DIRECTIVE;
  try {
    const raw = localStorage.getItem(DIRECTIVE_STORAGE_KEY);
    if (!raw) return DEFAULT_FOUNDER_DIRECTIVE;
    return JSON.parse(raw);
  } catch {
    return DEFAULT_FOUNDER_DIRECTIVE;
  }
}

export function saveFounderDirective(directive: Partial<FounderDirective>): FounderDirective {
  if (typeof window === 'undefined') return DEFAULT_FOUNDER_DIRECTIVE;
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

export function clearFounderDirective(): void {
  if (typeof window === 'undefined') return;
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
    if (!raw) return DEFAULT_PROTOCOL_CONTROLS;
    return { ...DEFAULT_PROTOCOL_CONTROLS, ...JSON.parse(raw) };
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
  '5747',
  '574729',
  '0000',
  '7788',
  'YUVEER',
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
      localStorage.setItem(FOUNDER_MASTER_KEY_STORAGE, key.trim().toUpperCase());
      localStorage.setItem(FOUNDER_OVERRIDE_STORAGE, 'true');
      
      try {
        const stored = localStorage.getItem('zenvitra_session_user');
        if (stored) {
          const parsed = JSON.parse(stored);
          parsed.role = 'FOUNDER';
          parsed.username = parsed.username || 'yuveer';
          localStorage.setItem('zenvitra_session_user', JSON.stringify(parsed));
        }
      } catch {}

      addAuditLog(`Founder Sovereign Session Activated with Personal Master Key`, 'PROTOCOL');
    }
    return true;
  }
  return false;
}

export function isFounderSessionActive(): boolean {
  if (typeof window === 'undefined') return false;
  const storedKey = localStorage.getItem(FOUNDER_MASTER_KEY_STORAGE);
  const override = localStorage.getItem(FOUNDER_OVERRIDE_STORAGE);
  return override === 'true' || (Boolean(storedKey) && verifyFounderKey(storedKey || ''));
}

export function deactivateFounderSession(): void {
  if (typeof window === 'undefined') return;
  localStorage.removeItem(FOUNDER_MASTER_KEY_STORAGE);
  localStorage.removeItem(FOUNDER_OVERRIDE_STORAGE);
}

export function setCustomFounderKey(newKey: string): void {
  if (typeof window === 'undefined') return;
  localStorage.setItem('zenvitra_custom_founder_key', newKey.trim().toUpperCase());
  addAuditLog(`Founder updated Personal Sovereign Master Key`, 'PROTOCOL');
}

export function isFounder(usernameOrEmail?: string | null, role?: string | null): boolean {
  if (typeof window !== 'undefined' && isFounderSessionActive()) {
    return true;
  }
  if (!usernameOrEmail && !role) return false;
  const clean = (usernameOrEmail || '').toLowerCase().trim().replace(/^@/, '');
  const r = (role || '').toUpperCase().trim();
  return (
    clean.includes('yuveer') ||
    clean === 'founder' ||
    clean === 'root' ||
    clean.startsWith('yuveer') ||
    r === 'FOUNDER' ||
    r === 'ROOT' ||
    r.includes('FOUNDER')
  );
}

export function isAdmin(usernameOrEmail?: string | null, role?: string | null): boolean {
  if (isFounder(usernameOrEmail, role)) return true;
  const clean = (usernameOrEmail || '').toLowerCase().trim().replace(/^@/, '');
  const r = (role || '').toUpperCase().trim();
  return (
    r === 'ADMIN' ||
    r === 'SECRETARIAT_CHAIR' ||
    r === 'MODERATOR' ||
    clean === 'admin'
  );
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
      localStorage.setItem(ADMIN_OVERRIDE_STORAGE, cleanKey);
      try {
        const stored = localStorage.getItem('zenvitra_session_user');
        const parsed = stored ? JSON.parse(stored) : {};
        parsed.role = 'ADMIN';
        parsed.name = parsed.name || name;
        parsed.username = parsed.username || 'admin_operator';
        localStorage.setItem('zenvitra_session_user', JSON.stringify(parsed));
      } catch {}
      addAuditLog(`Admin Session Activated via Magic Access Link: ${cleanKey.slice(0, 8)}...`, 'PROTOCOL');
    }
    return true;
  }
  return false;
}

export function isAdminSessionActive(): boolean {
  if (typeof window === 'undefined') return false;
  if (isFounderSessionActive()) return true;
  const storedAdmin = localStorage.getItem(ADMIN_OVERRIDE_STORAGE);
  return Boolean(storedAdmin) && verifyAdminKey(storedAdmin || '');
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
