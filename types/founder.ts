export type FounderSectionId =
  | '01_command'
  | '02_platform_control'
  | '03_zen_modules'
  | '04_people_access'
  | '05_events_mun'
  | '06_finance'
  | '07_content_community'
  | '08_analytics'
  | '09_infrastructure'
  | '10_security_audit'
  | '11_organisation'
  | '12_founder_settings';

export type ZenModuleKey =
  | 'pulse'
  | 'mun'
  | 'forms'
  | 'press'
  | 'passport'
  | 'call'
  | 'legislate'
  | 'docs'
  | 'chat'
  | 'payments';

export interface ZenModuleControl {
  key: ZenModuleKey;
  name: string;
  tagline: string;
  code: string;
  enabled: boolean;
  comingSoon: boolean;
  beta: boolean;
  status: 'OPERATIONAL' | 'DEGRADED' | 'MAINTENANCE';
  version: string;
  latencyMs: number;
  activeUsers24h: number;
}

export interface FounderSectionMeta {
  id: FounderSectionId;
  num: string;
  title: string;
  controlsCount: number;
  description: string;
  slug: string;
}

export interface GlobalAnnouncement {
  id: string;
  title: string;
  body: string;
  priority: 'NORMAL' | 'URGENT' | 'CRITICAL';
  active: boolean;
  timestamp: string;
  targetAudience?: 'ALL' | 'STUDENTS' | 'ORGANIZERS' | 'DELEGATES';
}

export interface FounderApprovalItem {
  id: string;
  title: string;
  requester: string;
  type: 'REFUND' | 'STUDENT_VERIFY' | 'ACCOUNT_APPEAL' | 'PRIVILEGE_ELEVATION' | 'EVENT_PUBLISH';
  details: string;
  amount?: string;
  status: 'PENDING' | 'APPROVED' | 'REJECTED';
  timestamp: string;
}

export interface FounderCriticalAlert {
  id: string;
  title: string;
  description: string;
  severity: 'CRITICAL' | 'WARNING' | 'SECURITY';
  source: string;
  timestamp: string;
  resolved: boolean;
}

export interface FounderLiveActivity {
  id: string;
  actor: string;
  action: string;
  target: string;
  type: 'REGISTRATION' | 'CONTENT' | 'PAYMENT' | 'ADMIN' | 'SECURITY';
  timestamp: string;
}

export interface FounderControlItem {
  id: string;
  name: string;
  description: string;
  category: string;
  status: 'ACTIVE' | 'STANDBY' | 'LOCKED' | 'CONFIGURED';
}

export const FOUNDER_SECTIONS: Array<FounderSectionMeta & { controls: string[] }> = [
  {
    id: '01_command',
    num: '01',
    title: 'COMMAND',
    controlsCount: 4,
    description: 'Executive platform telemetry, instant crisis broadcast, and real-time ledger monitoring.',
    slug: 'command',
    controls: [
      'Overview & Live Platform Metrics',
      'Global Emergency Announcements',
      'Real-time Member Activity Feed',
      'System Incident & Security Alert Radar',
    ],
  },
  {
    id: '02_platform_control',
    num: '02',
    title: 'PLATFORM CONTROL',
    controlsCount: 7,
    description: 'Single configuration layer governing global platform availability and fail-safes.',
    slug: 'platform-control',
    controls: [
      'Global Maintenance Mode (Preserves Founder/Admin)',
      'Zen Module Master Switch (Toggle 10 Ecosystem Apps)',
      'Coming Soon State & Feature Teasers',
      'Feature Flags & Experimental Capabilities',
      'Registration Gate (Open / Invite-Only / Paused)',
      'Emergency Lockdown (Freeze All Mutations Instantly)',
      'System Runtime Configuration (Zero Deploy Reconfig)',
    ],
  },
  {
    id: '03_zen_modules',
    num: '03',
    title: 'ZEN MODULES',
    controlsCount: 10,
    description: 'Autonomous lifecycle management, latency diagnostics, and toggles for all 10 core modules.',
    slug: 'modules',
    controls: [
      'PULSE · Campus Social Feed & Microblogging Network',
      'MUN · Model UN Suite & Assembly OS Engine',
      'FORMS · Dynamic Registration & Survey Builder',
      'PRESS · Sovereign Dispatches, Op-Eds & Journalism',
      'PASSPORT · Digital Student ID & NFC Credentials',
      'CALL · Encrypted Video Conferencing & Virtual Dais',
      'LEGISLATE · Treaty Drafting, Caucusing & Resolutions',
      'DOCS · Collaborative Conference Dossiers & Archives',
      'CHAT · Encrypted P2P & Delegations Messaging',
      'PAYMENTS · Cashfree Gateway, Split Escrows & GST',
    ],
  },
  {
    id: '04_people_access',
    num: '04',
    title: 'PEOPLE & ACCESS',
    controlsCount: 8,
    description: 'Global identity directory, RBAC governance, enclave passkeys, and privilege escalation.',
    slug: 'people-access',
    controls: [
      'Universal Member Directory & Node Inspector',
      'Staff Clearance & RBAC (Founder / Admin / Mod)',
      'Enclave Hardware-Locked Passkeys & Bypass Links',
      'Student Passport & Student Card Verification Queue',
      'Immediate Session Revocation & Network Blacklist',
      'MFA & Two-Factor Enforcement Rules',
      'Founder Patron & Sovereign Subscriptions',
      'Account Recovery Appeals & Suspension Reviews',
    ],
  },
  {
    id: '05_events_mun',
    num: '05',
    title: 'EVENTS & MUN',
    controlsCount: 8,
    description: 'Global conference lifecycle, dynamic vanity URLs, dais operations, and attendee allocations.',
    slug: 'events-mun',
    controls: [
      'Conference Master Registry & Tier Classifications',
      'Direct Domain / Showcase Routing ([event-name])',
      'Committee Matrix Engine ([event]/[committee]/matrix)',
      'Portfolio Applications & Allocation Algorithms',
      'Live Dais Command & Real-time Roll Call',
      'Parliamentary Voting & Draft Resolution Auditing',
      'Attendee Pass Issuance & Dynamic Age-based GST',
      'Conference Archival, Resolution Repository & Certificates',
    ],
  },
  {
    id: '06_finance',
    num: '06',
    title: 'FINANCE',
    controlsCount: 8,
    description: 'Cashfree transaction ledger, automated GST exemption rules, and organizer payout escrow.',
    slug: 'finance',
    controls: [
      'Gross Merchandise Value (GMV) & Revenue Totals',
      'Cashfree PG Reconciled Settlement Feeds',
      'Age-Aware GST Protocol (≤18: 0% GST | >18: 6% GST)',
      'Founder Refund Approvals & Reversals',
      'Escrow Hold & Multi-Party Split Settlement Engine',
      'Organizer Disbursements & UTR Bank Verifications',
      'Tier Pricing Architect & Platform Commission',
      'Tax Invoicing & Financial Compliance Ledger',
    ],
  },
  {
    id: '07_content_community',
    num: '07',
    title: 'CONTENT & COMMUNITY',
    controlsCount: 7,
    description: 'Freedom of expression oversight, Sovereign Press bureau, Article 12 compliance, and moderation.',
    slug: 'content-community',
    controls: [
      'Sovereign Press Publications & Editorial Desk',
      'Pulse Campus Feed Moderation & Rapid Takedowns',
      'Constitution Article 12 Compliance Verification',
      'Community Guidelines & Assembly Rules of Procedure',
      'Flagged Dispatches, Harassment & Abuse Triage',
      'Media Asset Vault & Sovereign CDN Edge Distribution',
      'Plagiarism Detection & Primary Source Citation Checker',
    ],
  },
  {
    id: '08_analytics',
    num: '08',
    title: 'ANALYTICS',
    controlsCount: 7,
    description: 'Platform telemetry, cross-module user engagement, retention curves, and network latency.',
    slug: 'analytics',
    controls: [
      'Real-Time Active Sessions & Geolocation Heatmap',
      'Registration Funnel & Delegate Conversion Rates',
      'Event Attendance, Check-In & Retention Velocity',
      'Payment Gateway Latency & Cashfree Success Ratio',
      'Module DAU / WAU / MAU Engagement Breakdown',
      'School & University Institutional Penetration',
      'Edge CDN Latency & Network Node Health Graph',
    ],
  },
  {
    id: '09_infrastructure',
    num: '09',
    title: 'INFRASTRUCTURE',
    controlsCount: 8,
    description: 'Server cluster metrics, distributed Redis mesh, database pooling, and edge failovers.',
    slug: 'infrastructure',
    controls: [
      'Server Fleet Health & CPU / Memory Utilization',
      'PostgreSQL Database Pool Latency & Connection Depth',
      'Distributed Redis Cache & Key Eviction Telemetry',
      'Background Task Workers & Cron Job Heartbeats',
      'Cloudflare CDN Edge Routing & Cache Hit Ratios',
      'Automated Database Snapshot & Point-in-Time Recovery',
      'SSL Certificate Status & Custom Domain Bindings',
      'DDoS Mitigation, Rate Limiting & Firewall Rules',
    ],
  },
  {
    id: '10_security_audit',
    num: '10',
    title: 'SECURITY & AUDIT',
    controlsCount: 7,
    description: 'Cryptographic security enforcement, zero-surveillance verification, and immutable audit logs.',
    slug: 'security-audit',
    controls: [
      'Citadel Protocol Omega Emergency Defenses',
      'Immutable Append-Only Audit Ledger',
      'Real-Time Intrusion Radar & Brute-Force Shield',
      'Zero-Surveillance Privacy Mandate Enforcement',
      'Secret Rotation (Cashfree API Keys & JWT Secrets)',
      'IP Whitelisting & Geo-Fenced Access Policies',
      'Vulnerability Scanning & Automated Penetration Reports',
    ],
  },
  {
    id: '11_organisation',
    num: '11',
    title: 'ORGANISATION',
    controlsCount: 6,
    description: 'ZENVITRA Secretariat hierarchy, institutional partnerships, legal constitution, and public roadmap.',
    slug: 'organisation',
    controls: [
      'ZENVITRA Secretariat Hierarchy & Office Bearers',
      'Accredited Schools, Colleges & Partner Councils',
      'Constitutional Law, Privacy Charter & Legal Terms',
      'Official Brand Guidelines, Vector Assets & Press Kit',
      'Strategic Platform Roadmap & Release Milestones',
      'Institutional MoUs & Multi-Year Assembly Contracts',
    ],
  },
  {
    id: '12_founder_settings',
    num: '12',
    title: 'FOUNDER SETTINGS',
    controlsCount: 7,
    description: 'Level 0 Sovereign configuration, personal passkeys, site tickers, directives, and panic room.',
    slug: 'founder-settings',
    controls: [
      'Founder Personal Master Passkey & Seed Phrase',
      'Sovereign Directives & Platform-Wide Executive Orders',
      'Global Site Ticker & Crisis Banner Overrides',
      'Panic Room (Complete Platform Freeze & Vault Lock)',
      'Live Database Direct SQL Query Console',
      'Production Release Pipeline & Canary Deployments',
      'Full Database & Encrypted Backup Export',
    ],
  },
];

export const DEFAULT_ZEN_MODULES: ZenModuleControl[] = [
  {
    key: 'pulse',
    name: 'ZEN.PULSE',
    tagline: 'Campus Social Feed & Microblogging',
    code: 'MOD-01-PLS',
    enabled: true,
    comingSoon: false,
    beta: false,
    status: 'OPERATIONAL',
    version: 'v4.2.0',
    latencyMs: 14,
    activeUsers24h: 3420,
  },
  {
    key: 'mun',
    name: 'ZEN.MUN',
    tagline: 'Model UN & Assembly OS Suite',
    code: 'MOD-02-MUN',
    enabled: true,
    comingSoon: false,
    beta: false,
    status: 'OPERATIONAL',
    version: 'v3.8.1',
    latencyMs: 19,
    activeUsers24h: 2150,
  },
  {
    key: 'forms',
    name: 'ZEN.FORMS',
    tagline: 'Survey & Application Engine',
    code: 'MOD-03-FRM',
    enabled: true,
    comingSoon: false,
    beta: false,
    status: 'OPERATIONAL',
    version: 'v2.4.0',
    latencyMs: 22,
    activeUsers24h: 1840,
  },
  {
    key: 'press',
    name: 'ZEN.PRESS',
    tagline: 'Sovereign Dispatches & Journalism',
    code: 'MOD-04-PRS',
    enabled: true,
    comingSoon: false,
    beta: false,
    status: 'OPERATIONAL',
    version: 'v2.1.0',
    latencyMs: 16,
    activeUsers24h: 960,
  },
  {
    key: 'passport',
    name: 'ZEN.PASSPORT',
    tagline: 'Digital ID & Verified Credentials',
    code: 'MOD-05-PSP',
    enabled: true,
    comingSoon: false,
    beta: false,
    status: 'OPERATIONAL',
    version: 'v3.0.0',
    latencyMs: 18,
    activeUsers24h: 4200,
  },
  {
    key: 'call',
    name: 'ZEN.CALL',
    tagline: 'Encrypted Video & Virtual Dais Rooms',
    code: 'MOD-06-CLL',
    enabled: true,
    comingSoon: false,
    beta: true,
    status: 'OPERATIONAL',
    version: 'v1.5.0-beta',
    latencyMs: 42,
    activeUsers24h: 310,
  },
  {
    key: 'legislate',
    name: 'ZEN.LEGISLATE',
    tagline: 'Treaty Drafting & Resolution Engine',
    code: 'MOD-07-LGS',
    enabled: true,
    comingSoon: false,
    beta: false,
    status: 'OPERATIONAL',
    version: 'v2.0.4',
    latencyMs: 25,
    activeUsers24h: 880,
  },
  {
    key: 'docs',
    name: 'ZEN.DOCS',
    tagline: 'Collaborative Dossiers & Archives',
    code: 'MOD-08-DOC',
    enabled: true,
    comingSoon: false,
    beta: false,
    status: 'OPERATIONAL',
    version: 'v2.9.0',
    latencyMs: 21,
    activeUsers24h: 1450,
  },
  {
    key: 'chat',
    name: 'ZEN.CHAT',
    tagline: 'Encrypted Delegations Messaging',
    code: 'MOD-09-CHT',
    enabled: true,
    comingSoon: false,
    beta: false,
    status: 'OPERATIONAL',
    version: 'v3.3.0',
    latencyMs: 12,
    activeUsers24h: 5120,
  },
  {
    key: 'payments',
    name: 'ZEN.PAYMENTS',
    tagline: 'Cashfree Gateway & Dynamic GST Engine',
    code: 'MOD-10-PAY',
    enabled: true,
    comingSoon: false,
    beta: false,
    status: 'OPERATIONAL',
    version: 'v3.1.2',
    latencyMs: 31,
    activeUsers24h: 1690,
  },
];
