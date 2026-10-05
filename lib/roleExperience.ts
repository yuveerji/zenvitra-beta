export type SovereignRoleType = 'delegate' | 'journalist' | 'architect' | 'founder' | 'guest';

export interface RoleExperienceConfig {
  id: SovereignRoleType;
  title: string;
  shortTitle: string;
  badge: string;
  icon: string;
  colorName: string;
  accentHex: string;
  badgeClass: string;
  borderClass: string;
  dotClass: string;
  directiveBanner: string;
  tagline: string;
  capabilities: string[];
  focusRoutes: {
    label: string;
    href: string;
    tag?: string;
    description: string;
  }[];
  quickAction: {
    label: string;
    href: string;
    type: 'resolution' | 'wire' | 'audit' | 'general';
  };
}

export const SOVEREIGN_ROLE_CONFIGS: Record<SovereignRoleType, RoleExperienceConfig> = {
  delegate: {
    id: 'delegate',
    title: 'Diplomatic Delegate',
    shortTitle: 'Delegate',
    badge: 'CHAMBER SOVEREIGN',
    icon: '👑',
    colorName: 'amber',
    accentHex: '#f59e0b',
    badgeClass: 'bg-amber-500/15 text-amber-300 border-amber-500/30',
    borderClass: 'border-amber-500/40 hover:border-amber-400',
    dotClass: 'bg-amber-400',
    directiveBanner: '🏛️ Diplomatic Chamber Feed • Filtered for Resolutions, Dais Roll-Calls & MUN Debates',
    tagline: 'Lead multilateral summits, draft binding resolutions & execute roll-call votes',
    capabilities: ['Roll-Call Voting', 'Dais Clearance', 'Encrypted Chits', 'Verified MUN Accolades'],
    focusRoutes: [
      { label: 'Chamber Dais', href: '/committee', tag: 'Live', description: 'Assembly Chamber & Motions' },
      { label: 'MUN Summits', href: '/events', tag: 'MUN', description: 'Flagship Gatherings & Model UN' },
      { label: 'Resolutions', href: '/solutions', tag: 'Ballot', description: 'Debate & Civic Voting' },
      { label: 'Sovereign Passport', href: '/passport', tag: 'Credentials', description: 'Verified Credentials & Dossier' },
    ],
    quickAction: {
      label: 'Draft Resolution / Vote',
      href: '/solutions',
      type: 'resolution',
    },
  },
  journalist: {
    id: 'journalist',
    title: 'Investigative Press',
    shortTitle: 'Journalist',
    badge: 'WIRE BUREAU',
    icon: '📰',
    colorName: 'cyan',
    accentHex: '#06b6d4',
    badgeClass: 'bg-cyan-500/15 text-cyan-300 border-cyan-500/30',
    borderClass: 'border-cyan-500/40 hover:border-cyan-400',
    dotClass: 'bg-cyan-400',
    directiveBanner: '📡 Investigative Wire Bureau • Filtered for Fast-Wire Breaking Bulletins & DOI Research',
    tagline: 'Publish uncompromised student dispatches, fast-wire bulletins & permanent DOI research',
    capabilities: ['Fast-Wire Publishing', 'DOI Research Registry', 'Spark Feed Sync', 'Editorial Desk'],
    focusRoutes: [
      { label: 'Press Bureau', href: '/press', tag: 'Wire', description: 'Autonomous Student News Desk' },
      { label: 'Live Wire', href: '/pulse', tag: 'Live', description: 'Fast Feed Stream & Alerts' },
      { label: 'ZEN.GLIMPSE', href: '/glimpse', tag: '24h', description: 'Visual Ephemeral Dispatches' },
      { label: 'DOI Library', href: '/docs', tag: 'Dossier', description: 'Permanent Academic Citations' },
    ],
    quickAction: {
      label: 'File Breaking Wire',
      href: '/pulse?compose=true',
      type: 'wire',
    },
  },
  architect: {
    id: 'architect',
    title: 'Civic & Tech Architect',
    shortTitle: 'Architect',
    badge: 'PROTOCOL ENGINE',
    icon: '⚡',
    colorName: 'emerald',
    accentHex: '#10b981',
    badgeClass: 'bg-emerald-500/15 text-emerald-300 border-emerald-500/30',
    borderClass: 'border-emerald-500/40 hover:border-emerald-400',
    dotClass: 'bg-emerald-400',
    directiveBanner: '⚡ Protocol & Assembly Engine • Filtered for Open Civic Tools & 10% Treasury Audits',
    tagline: 'Build civic tools, govern smart assemblies & audit public school 10% aid ledger',
    capabilities: ['Treasury Audits', 'Open Protocol Tools', 'Decentralized ID', 'Smart Assemblies'],
    focusRoutes: [
      { label: 'Protocol Engine', href: '/solutions', tag: 'Build', description: 'Civic Micro-Tools & Voting' },
      { label: 'Matrix Hub', href: '/matrix', tag: 'Engine', description: 'Adaptive Matrix OS' },
      { label: 'Treasury Ledger', href: '/donate/govt-schools', tag: '10% Aid', description: 'Public School Aid Ledger' },
      { label: 'Developer Enclave', href: '/enclave', tag: 'APIs', description: 'Open Protocol Endpoints' },
    ],
    quickAction: {
      label: 'Audit School Aid Ledger',
      href: '/donate/govt-schools',
      type: 'audit',
    },
  },
  founder: {
    id: 'founder',
    title: 'Founder & Protocol Sovereign',
    shortTitle: 'Founder',
    badge: 'ROOT ARCHITECT',
    icon: '🔱',
    colorName: 'purple',
    accentHex: '#a855f7',
    badgeClass: 'bg-purple-500/15 text-purple-300 border-purple-500/30',
    borderClass: 'border-purple-500/40 hover:border-purple-400',
    dotClass: 'bg-purple-400',
    directiveBanner: '🔱 Sovereign Root Command • Complete Ecosystem Oversight & Protocol Governance',
    tagline: 'Direct ecosystem architecture, oversee treasury & orchestrate assemblies',
    capabilities: ['Root Governance', 'Omni Command', 'Full Access', 'Zero Limits'],
    focusRoutes: [
      { label: 'Home Feed', href: '/pulse', tag: 'All', description: 'Full Platform Stream' },
      { label: 'Chamber Dais', href: '/committee', tag: 'Live', description: 'Assembly Chamber' },
      { label: 'Matrix Hub', href: '/matrix', tag: 'Engine', description: 'Adaptive Matrix OS' },
      { label: 'Treasury Ledger', href: '/donate/govt-schools', tag: '10% Aid', description: 'Public School Aid' },
    ],
    quickAction: {
      label: 'Command Matrix',
      href: '/matrix',
      type: 'general',
    },
  },
  guest: {
    id: 'guest',
    title: 'Guest Observer Node',
    shortTitle: 'Observer',
    badge: 'GUEST NODE',
    icon: '🌐',
    colorName: 'blue',
    accentHex: '#3b82f6',
    badgeClass: 'bg-blue-500/15 text-blue-300 border-blue-500/30',
    borderClass: 'border-blue-500/40 hover:border-blue-400',
    dotClass: 'bg-blue-400',
    directiveBanner: '🌐 Guest Node • Ephemeral Preview Mode with Zero Tracking',
    tagline: 'Explore the diplomatic ecosystem with read-only observer clearance',
    capabilities: ['Live Pulse Viewing', 'Chamber Observation', 'Glimpse Snaps', 'Zero Tracking'],
    focusRoutes: [
      { label: 'Home Stream', href: '/pulse', description: 'Pulse Feed' },
      { label: 'ZEN.GLIMPSE', href: '/glimpse', tag: '24h', description: 'Snaps App' },
      { label: 'Events & Summits', href: '/events', description: 'Model UN Summits' },
      { label: 'Constitution', href: '/constitution', description: 'Sovereign Accord' },
    ],
    quickAction: {
      label: 'Claim Sovereign ID',
      href: '/register',
      type: 'general',
    },
  },
};

export function resolveUserRole(role?: string | null, isFounder?: boolean): SovereignRoleType {
  if (isFounder) return 'founder';
  if (!role) return 'delegate';
  const clean = role.toLowerCase().trim();
  if (clean === 'founder' || clean.includes('founder') || clean === 'root') return 'founder';
  if (clean === 'journalist' || clean === 'press' || clean.includes('journal') || clean.includes('wire')) return 'journalist';
  if (clean === 'architect' || clean === 'tech' || clean.includes('architect') || clean.includes('protocol')) return 'architect';
  if (clean === 'guest' || clean === 'observer') return 'guest';
  return 'delegate';
}

export function getRoleConfig(role?: string | null, isFounder?: boolean): RoleExperienceConfig {
  const resolved = resolveUserRole(role, isFounder);
  return SOVEREIGN_ROLE_CONFIGS[resolved] || SOVEREIGN_ROLE_CONFIGS.delegate;
}
