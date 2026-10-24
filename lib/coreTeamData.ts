export type TeamDepartment = 
  | 'Executive' 
  | 'Engineering' 
  | 'Secretariat' 
  | 'Design & Media' 
  | 'Press' 
  | 'Operations' 
  | 'Impact';

export interface CoreTeamMember {
  id: string;
  name: string;
  role: string;
  category: 'founder' | 'cofounder' | 'core';
  department: TeamDepartment;
  handle?: string;
  avatarUrl?: string;
  avatarPosition?: string;
  bio: string;
  focusAreas: string[];
  socialLinks?: {
    x?: string;
    github?: string;
    linkedin?: string;
    email?: string;
  };
  isVacancy?: boolean;
  applyTrack?: string;
}

export const INITIAL_CORE_TEAM: CoreTeamMember[] = [
  // ── 1. FOUNDER & SYSTEM ARCHITECT ──
  {
    id: 'yuveer-founder',
    name: 'Yuveer Chhatwani',
    role: 'Founder & Chief Architect',
    category: 'founder',
    department: 'Executive',
    handle: 'yuveer',
    avatarUrl: '/assets/founder.png',
    bio: 'Founding architect of ZENVITRA. Designing sovereign platforms for civic consensus, model diplomacy, real-time matrix deliberative chambers, and unified digital governance.',
    focusAreas: ['System Architecture', 'Sovereign Consensus', 'Product Vision', 'Core Protocols'],
    socialLinks: {
      x: 'https://x.com/yuveer',
      github: 'https://github.com/yuveer',
      linkedin: 'https://linkedin.com/in/yuveer',
      email: 'founder@zenvitra.xyz'
    },
    isVacancy: false
  },

  // ── 2. CO-FOUNDERS (EXECUTIVE COUNCIL) ──
  {
    id: 'khushi-rb-cofounder',
    name: 'Khushi R B',
    role: 'Co-Founder & Chief Operating Officer',
    category: 'cofounder',
    department: 'Executive',
    avatarUrl: '/assets/co-founder.jpeg',
    avatarPosition: 'top',
    bio: 'Co-Founder of ZENVITRA steering institutional diplomacy, global alliances, cross-border chapter expansion, and sovereign operational ecosystems.',
    focusAreas: ['Global Operations', 'Institutional Diplomacy', 'Strategic Expansion', 'Executive Governance'],
    socialLinks: {
      email: 'khushi@zenvitra.xyz'
    },
    isVacancy: false
  },
  {
    id: 'aarush-vijayivargiya-cofounder',
    name: 'Aarush Vijayivargiya',
    role: 'Co-Founder & Chief Product Officer',
    category: 'cofounder',
    department: 'Executive',
    handle: 'aarush',
    avatarUrl: '/assets/co-founder2.jpeg',
    avatarPosition: 'top',
    bio: 'Co-Founder of ZENVITRA pioneering product innovation, sovereign platform strategy, cross-disciplinary deliberative frameworks, and ecosystem growth.',
    focusAreas: ['Product Strategy', 'Platform Innovation', 'Civic Ecosystems', 'Executive Leadership'],
    socialLinks: {
      email: 'aarush@zenvitra.xyz'
    },
    isVacancy: false
  },
  {
    id: 'cofounder-cto-partner',
    name: 'Co-Founder & CTO',
    role: 'Co-Founder & Technical Lead',
    category: 'cofounder',
    department: 'Executive',
    bio: 'Strategic partner stewarding distributed real-time software, chamber multimedia matrix, high-frequency consensus algorithms, and engineering culture.',
    focusAreas: ['Distributed Systems', 'Platform Scaling', 'Civic Tech UX', 'Engineering Culture'],
    isVacancy: true,
    applyTrack: 'cofounder'
  },
  {
    id: 'cofounder-alliances',
    name: 'Co-Founder & VP of Global Alliances',
    role: 'Executive Council · Diplomatic Partnerships',
    category: 'cofounder',
    department: 'Executive',
    bio: 'Championing institutional relationships with collegiate circuits, diplomatic consulates, civil society organizations, and international summit boards.',
    focusAreas: ['Institutional Partnerships', 'Capital Strategy', 'Diplomatic Consulates', 'Summit Governance'],
    isVacancy: true,
    applyTrack: 'cofounder'
  },

  // ── 3. CORE TEAM: ENGINEERING & PROTOCOLS ──
  {
    id: 'core-eng-lead',
    name: 'Chief Technology Officer / Engineering Lead',
    role: 'Head of Software Engineering',
    category: 'core',
    department: 'Engineering',
    bio: 'Leading distributed protocols, Next.js 16 full-stack architecture, Prisma database layer, and sovereign cryptographic authentication enclaves.',
    focusAreas: ['Next.js / TypeScript', 'Distributed Architecture', 'Database Engineering', 'API Security'],
    isVacancy: true,
    applyTrack: 'engineering'
  },
  {
    id: 'core-webrtc-architect',
    name: 'Lead Protocol & WebRTC Architect',
    role: 'Principal Real-Time Systems Engineer',
    category: 'core',
    department: 'Engineering',
    bio: 'Architecting high-throughput WebRTC audio/video mesh for ZEN.CALL, encrypted caucus chits, low-latency roll-call counters, and real-time WebSockets.',
    focusAreas: ['WebRTC Audio/Video Mesh', 'WebSockets & Telemetry', 'Real-Time Caucus Chits', 'Latency Optimization'],
    isVacancy: true,
    applyTrack: 'engineering'
  },
  {
    id: 'core-security-systems',
    name: 'Full-Stack Systems & Security Engineer',
    role: 'Senior Infrastructure & Payments Engineer',
    category: 'core',
    department: 'Engineering',
    bio: 'Building immutable SHA-256 resolution verification ledgers, dual-key sovereign passports, Cashfree payment gateway webhooks, and zero-trust session management.',
    focusAreas: ['Cryptographic Verification', 'Cashfree PG & Webhooks', 'Zero-Trust Architecture', 'Audit Logging'],
    isVacancy: true,
    applyTrack: 'engineering'
  },

  // ── 4. CORE TEAM: SECRETARIAT & MUN DIPLOMACY ──
  {
    id: 'core-sec-lead',
    name: 'Secretariat Team Head / Secretary-General',
    role: 'Head of Diplomatic Affairs & Secretariat',
    category: 'core',
    department: 'Secretariat',
    bio: 'Directing the executive secretariat, parliamentary rules of procedure (UN & AIPPM), delegate allocations, dais governance, and summit conference charters.',
    focusAreas: ['Parliamentary Procedure', 'Executive Dais Curation', 'Conference Governance', 'Resolution Frameworks'],
    isVacancy: true,
    applyTrack: 'secretariat'
  },
  {
    id: 'core-crisis-director',
    name: 'Under-Secretary-General for Crisis & Simulations',
    role: 'Director of Dynamic Cabinet Simulations',
    category: 'core',
    department: 'Secretariat',
    bio: 'Engineering high-stakes continuous crisis simulations, flash communiqués, presidential cabinet war games, and fast-paced bilateral directives.',
    focusAreas: ['Continuous Crisis Simulations', 'Cabinet Directives', 'Crisis Room Mechanics', 'Flash Bulletins'],
    isVacancy: true,
    applyTrack: 'secretariat'
  },
  {
    id: 'core-dais-operations',
    name: 'Dais Operations & Delegate Affairs Director',
    role: 'Director of Delegate Experience & Allocations',
    category: 'core',
    department: 'Secretariat',
    bio: 'Overseeing delegate onboarding, country matrix allocation fairness, dais moderation metrics, study guide curation, and delegate credential verification.',
    focusAreas: ['Delegate Allocations', 'Country Matrix Fair Allocation', 'Study Guides', 'Executive Board Oversight'],
    isVacancy: true,
    applyTrack: 'secretariat'
  },

  // ── 5. CORE TEAM: DESIGN & MEDIA ──
  {
    id: 'core-design-lead',
    name: 'Head of Visual & Product Design',
    role: 'Ecosystem Design & Creative Director',
    category: 'core',
    department: 'Design & Media',
    bio: 'Directing obsidian dark aesthetics, glassmorphism UI/UX design systems, Figma component libraries, typography, and cinematic platform spatial design.',
    focusAreas: ['Figma Design Systems', 'Obsidian Luxe UI/UX', 'Editorial Typography', 'Spatial Design Language'],
    isVacancy: true,
    applyTrack: 'design'
  },
  {
    id: 'core-visual-motion',
    name: 'Motion Graphics & 3D Cinematic Visual Lead',
    role: 'Creative Visuals & Monolith Director',
    category: 'core',
    department: 'Design & Media',
    bio: 'Crafting cinematic promotional trailers, 3D interactive monolith assets, award credentials, and high-impact digital collateral.',
    focusAreas: ['3D Interactive Assets', 'Motion Trailers', 'Cinematic Brand Identity', 'Visual Storytelling'],
    isVacancy: true,
    applyTrack: 'design'
  },

  // ── 6. CORE TEAM: INTERNATIONAL PRESS BUREAU ──
  {
    id: 'core-press-lead',
    name: 'Head of International Press Bureau',
    role: 'Chief Press Officer & Editor-in-Chief',
    category: 'core',
    department: 'Press',
    bio: 'Overseeing independent student investigative journalism, editorial policy, breaking news wire dispatches, and permanent digital DOI research publishing on ZEN.PRESS.',
    focusAreas: ['Investigative Journalism', 'Permanent DOI Archives', 'Press Wire Desks', 'Editorial Direction'],
    isVacancy: true,
    applyTrack: 'press'
  },
  {
    id: 'core-wire-editor',
    name: 'Senior Wire Editor & Fact-Checking Director',
    role: 'Press Bureau Operations & Verification Lead',
    category: 'core',
    department: 'Press',
    bio: 'Leading real-time conference press corps reporting, interview broadcasts, authentic press citations, and multi-chamber investigative bulletin verification.',
    focusAreas: ['Real-Time Press Corps', 'Fact-Checking Protocols', 'Conference Bulletins', 'Investigative Desks'],
    isVacancy: true,
    applyTrack: 'press'
  },

  // ── 7. CORE TEAM: STRATEGIC OPERATIONS & CAMPUS NETWORKS ──
  {
    id: 'core-ops-director',
    name: 'Head of Strategic Operations',
    role: 'Operations & Execution Director',
    category: 'core',
    department: 'Operations',
    bio: 'Managing global summit logistical execution, country allocation algorithms, cross-continental timelines, and scalable event operations.',
    focusAreas: ['Logistical Execution', 'Country Allocation Algorithms', 'Cross-Continental Operations', 'Summit Timelines'],
    isVacancy: true,
    applyTrack: 'operations'
  },
  {
    id: 'core-campus-ambassador-lead',
    name: 'Director of Campus Ambassadorship & Youth Chapters',
    role: 'Head of Grassroots Mobilization & Fellowships',
    category: 'core',
    department: 'Operations',
    bio: 'Leading nationwide Campus Ambassador fellowships, university delegation outreach, high-school circuits, and regional youth governance chapters.',
    focusAreas: ['Campus Ambassador Fellowship', 'University Delegations', 'Circuit Outreach', 'Youth Leadership'],
    isVacancy: true,
    applyTrack: 'operations'
  },

  // ── 8. CORE TEAM: IMPACT & THE 10% PRINCIPLE ──
  {
    id: 'core-impact-lead',
    name: 'Head of Impact & The 10% Principle',
    role: 'Chief Impact Officer & Public Ledger Steward',
    category: 'core',
    department: 'Impact',
    bio: 'Directing the non-profit 10% profit civic escrow, public school aid treasury ledger, ground-level accountability protocols, and bi-annual video proof disbursements.',
    focusAreas: ['The 10% Principle', 'Public School Aid Treasury', 'Ground-Level Audits', 'Civic Escrow Governance'],
    isVacancy: true,
    applyTrack: 'impact'
  },
  {
    id: 'core-impact-auditor',
    name: 'Treasury Auditor & Youth Civic Grants Steward',
    role: 'Public Ledger & Grants Compliance Lead',
    category: 'core',
    department: 'Impact',
    bio: 'Auditing school aid equipment procurement, managing transparent public receipts, verifying youth civic grants, and stewarding community escrow distributions.',
    focusAreas: ['Civic Grants Management', 'Public Receipt Auditing', 'Non-profit Stewardship', 'Bi-Annual Video Proof'],
    isVacancy: true,
    applyTrack: 'impact'
  },

  // ── 9. CUSTOM STRATEGIC PORTFOLIO ──
  {
    id: 'core-custom-fellow',
    name: 'Head of Custom Initiatives & Frontier Innovation',
    role: 'Special Projects & Emerging Verticals Fellow',
    category: 'core',
    department: 'Operations',
    bio: 'Proposing novel strategic ventures, specialized tech pipelines, institutional accelerators, or civic governance paradigms not covered in standard departments.',
    focusAreas: ['Specialized Initiatives', 'Frontier Civic Tech', 'Autonomous Projects', 'Institutional Incubation'],
    isVacancy: true,
    applyTrack: 'other'
  }
];

const LOCAL_STORAGE_KEY = 'zenvitra_core_team_roster_v5';

export function getCoreTeamMembers(): CoreTeamMember[] {
  if (typeof window === 'undefined') {
    return INITIAL_CORE_TEAM;
  }
  try {
    const stored = localStorage.getItem(LOCAL_STORAGE_KEY);
    if (stored) {
      const parsed = JSON.parse(stored);
      if (Array.isArray(parsed) && parsed.length >= 10) {
        const hasAarush = parsed.some((m: CoreTeamMember) => m.name.toLowerCase().includes('aarush'));
        const hasPress = parsed.some((m: CoreTeamMember) => m.department === 'Press');
        const hasImpact = parsed.some((m: CoreTeamMember) => m.department === 'Impact');
        if (hasAarush && hasPress && hasImpact) {
          return parsed;
        }
      }
    }
  } catch (e) {
    console.warn('Failed to load local team roster:', e);
  }
  try {
    localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(INITIAL_CORE_TEAM));
  } catch (_) {}
  return INITIAL_CORE_TEAM;
}

export function saveCoreTeamMembers(members: CoreTeamMember[]): void {
  if (typeof window === 'undefined') return;
  try {
    localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(members));
  } catch (e) {
    console.error('Failed to save team roster:', e);
  }
}
