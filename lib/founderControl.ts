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
  id: 'genesis-directive-03',
  title: 'A NOTE FROM THE FOUNDER',
  body: `Every generation inherits a world.

And every once in a while—

someone decides to rebuild it.

Not because the old world has completely failed.

But because they can see what it could become.

———

We grew up in a world of applications.

One for messaging.
One for sharing.
One for creating.
One for reading.
One for communities.
One for events.
One for work.
One for everything.

And somehow—
despite being more connected than any generation before us—
we became scattered.

Our conversations lived in one place.
Our ideas in another.
Our communities somewhere else.

Our voices were divided between platforms we didn't own, systems we couldn't understand, and algorithms we couldn't control.

The internet connected the world.
But it also fragmented it.

And we started asking a question:

WHAT IF THERE WAS ANOTHER WAY?

Not another application.
Not another feature.
Not another company trying to capture attention.

Something bigger.
Something connected.
Something built around people.

———

THAT IS WHERE ZENVITRA BEGAN.

Not in a boardroom.
Not with billions of dollars.
Not with a finished product.

But with an idea.

A belief that technology could feel different.

That the future did not have to be built only by the people who had already been given permission to build it.

That young people could look at the systems around them and say—
WE CAN DO BETTER.

And then actually try.

———

ZENVITRA IS A BET ON POSSIBILITY.

A bet that communication can be more meaningful.
That communities can be stronger.
That creators can have more freedom.
That information can travel without losing its humanity.
That independent voices deserve space.
That events can be easier to build.
That technology can connect experiences instead of separating them.

We are building ZEN.chat because conversations matter.
We are building ZEN.PULSE because ideas deserve movement.
We are building ZEN.FLUX because creativity should have a stage.
We are building ZENVITRA International Press because voices and stories deserve the freedom to exist.
We are building the systems that connect communities, organizations, conferences, and events because people have always built extraordinary things when they come together.

Different products.
Different purposes.
One ecosystem.

ONE ZENVITRA.

———

BUT HERE IS WHAT MATTERS MOST:

Technology is not the story.
PEOPLE ARE.

Every message begins with someone wanting to be understood.
Every post begins with someone wanting to say something.
Every article begins with someone believing a story matters.
Every community begins with people deciding they belong together.
Every event begins with an idea.

And every great movement begins when someone refuses to believe that the world must remain exactly the way it is.

ZENVITRA exists for those people.
The curious.
The ambitious.
The creators.
The builders.
The organizers.
The writers.
The dreamers.

And especially—
the people who have been told:
"You're too young."

———

WE DON'T BELIEVE THAT.

History has never asked permission before changing.
Ideas don't wait until you are old enough.
Curiosity doesn't require experience.
And ambition doesn't need an invitation.

You can be young and still see something that the world has missed.
You can be inexperienced and still ask the right question.
You can start with nothing but an idea—
and still begin something that matters.

That belief is part of ZENVITRA's DNA.

The future should not be something young people simply inherit.
IT SHOULD BE SOMETHING THEY HELP CREATE.

———

WE ARE NOT HERE TO BE ANOTHER COMPANY.

We are here to build something worth remembering.

That doesn't mean everything we create will succeed immediately.
It doesn't mean every idea will survive.
It doesn't mean we won't make mistakes.

We will.

We will build things that need to be rebuilt.
We will make decisions that need to be reconsidered.
We will discover that some of our biggest assumptions were wrong.

And when that happens—
we will learn.

Because perfection has never built the future.
ITERATION HAS.

The willingness to try again.
The courage to admit when something isn't good enough.
The obsession to make it better.
Again. And again. And again.
Until something ordinary becomes something extraordinary.

———

WE ARE AT THE BEGINNING.

That is the most exciting part.
There are no limits written yet.
No final chapter.
No complete map.
Just a direction. Forward.

There are products that haven't been imagined yet.
Technologies that haven't been created yet.
Communities we haven't met yet.
Stories we haven't heard yet.
And people who have no idea that one day, their lives might intersect with this journey.

Right now, ZENVITRA is still becoming.
And perhaps that is exactly what makes this moment important.

Because someday, people may see what ZENVITRA becomes.
But very few will understand what it felt like at the beginning.
When it was still an idea.
When everything was uncertain.
When the impossible still looked impossible.
When we had more questions than answers.
And we built anyway.

———

THIS IS WHAT I WANT ZENVITRA TO BECOME.

Not the loudest company.
Not the company with the most features.
Not a company that measures its success only in numbers.

I want ZENVITRA to become something people trust.
Something people feel proud to build with.
Something creators can call home.
Something communities can depend on.
Something that gives people more power—not less.
A company that remembers that behind every screen—
is a human being.

BECAUSE THE BEST TECHNOLOGY DOESN'T MAKE PEOPLE FEEL SMALL.
IT MAKES THEM FEEL CAPABLE.

Capable of speaking.
Capable of creating.
Capable of connecting.
Capable of building.
Capable of changing something.

That is the kind of technology we want to build.

———

TO EVERYONE WHO IS HERE BEFORE THE WORLD IS WATCHING—

Thank you.
Thank you for believing before there was proof.
Thank you for supporting before there was certainty.
Thank you for seeing possibility where others saw risk.

One day, ZENVITRA will have users who never knew how difficult the beginning was.
They will see the products.
The technology.
The ecosystem.
The communities.
They may see something polished.
Something finished.
Something that looks inevitable.

But nothing meaningful is inevitable.
Everything begins with someone choosing to start.

And this—
THIS IS OUR START.

———

We don't know exactly how far this journey will go.
But we know why it began.

We began because we believed the digital world could be more connected.
More open.
More creative.
More human.

We began because we believed that people deserved better tools to communicate, create, organize, and express themselves.
We began because waiting for someone else to build the future didn't feel like an option.

So we decided to try.

ZENVITRA IS NOT THE FINISHED ANSWER.
IT IS THE BEGINNING OF A QUESTION.

What happens when people decide to build the world they wish existed?

We're about to find out.

———

This is ZENVITRA.
Built from an idea.
Powered by people.
Defined by possibility.
And created for a future that has not been written yet.

The world doesn't change when everyone agrees it's time.
IT CHANGES WHEN SOMEONE BEGINS.

We have begun.

WELCOME TO ZENVITRA.
The future isn't waiting.
Neither are we.`,
  author: 'Yuveer Chhatwani (Founder & System Architect, ZENVITRA)',
  tag: 'FOUNDER\'S NOTE • SEPTEMBER 2026',
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

export function getFounderDirective(): FounderDirective {
  if (typeof window === 'undefined') return DEFAULT_FOUNDER_DIRECTIVE;
  try {
    const raw = localStorage.getItem(DIRECTIVE_STORAGE_KEY);
    if (!raw) return DEFAULT_FOUNDER_DIRECTIVE;
    const parsed = JSON.parse(raw);
    if (!parsed || parsed.id === 'genesis-directive-01' || parsed.id === 'genesis-directive-02') {
      localStorage.setItem(DIRECTIVE_STORAGE_KEY, JSON.stringify(DEFAULT_FOUNDER_DIRECTIVE));
      return DEFAULT_FOUNDER_DIRECTIVE;
    }
    return parsed;
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
