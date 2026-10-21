import { 
  UniverseGovernanceSpace, 
  FactionOrCouncil, 
  MultiversalElection, 
  AuditLogEntry 
} from '@/types/voting';

export const INITIAL_UNIVERSES: UniverseGovernanceSpace[] = [
  {
    id: 'univ-geneva-diplomatic',
    name: 'Geneva Diplomatic Universe',
    slug: 'geneva-diplomatic',
    description: 'Multilateral assembly space governing inter-state treaties, rules of procedure, and diplomatic summits.',
    charterVersion: 'CHARTER-GD-v2.4',
    charterPreamble: 'Committed to peaceful dispute resolution, sovereign equality, and codified parliamentary decorum.',
    governorHandle: '',
    councilCount: 0,
    factionsCount: 0,
    totalVoters: 0,
    badgeColor: 'border-cyan-500/40 text-cyan-300 bg-cyan-950/40',
    universeWeight: 1.0,
  },
  {
    id: 'univ-lok-sabha-civic',
    name: 'Lok Sabha Civic Forum',
    slug: 'lok-sabha-civic',
    description: 'Parliamentary legislative universe drafting national youth bills, statutory revisions, and civic petitions.',
    charterVersion: 'CHARTER-LS-v1.9',
    charterPreamble: 'Empowering democratic legislative inquiry, ministerial accountability, and constituent representation.',
    governorHandle: '',
    councilCount: 0,
    factionsCount: 0,
    totalVoters: 0,
    badgeColor: 'border-amber-500/40 text-amber-300 bg-amber-950/40',
    universeWeight: 1.0,
  },
  {
    id: 'univ-synthetic-intelligence',
    name: 'Synthetica AI & Tech Council',
    slug: 'synthetica-council',
    description: 'Frontier technology governance, algorithmic ethics covenants, open-source verification, and digital rights.',
    charterVersion: 'CHARTER-ST-v3.0',
    charterPreamble: 'Preserving human agency, open cryptographic verification, and ethical deployment of automated intelligence.',
    governorHandle: '',
    councilCount: 0,
    factionsCount: 0,
    totalVoters: 0,
    badgeColor: 'border-purple-500/40 text-purple-300 bg-purple-950/40',
    universeWeight: 1.0,
  },
  {
    id: 'univ-climatica-accord',
    name: 'Climatica Earth Assembly',
    slug: 'climatica-assembly',
    description: 'Ecological mandates, carbon treaty verification, youth environmental action, and climate resource allocation.',
    charterVersion: 'CHARTER-CA-v2.1',
    charterPreamble: 'Guaranteed stewardship of planetary commons, intergenerational justice, and enforceable green accords.',
    governorHandle: '',
    councilCount: 0,
    factionsCount: 0,
    totalVoters: 0,
    badgeColor: 'border-emerald-500/40 text-emerald-300 bg-emerald-950/40',
    universeWeight: 1.0,
  },
  {
    id: 'univ-press-free-wire',
    name: 'Multiversal Press Guild',
    slug: 'press-guild',
    description: 'Journalistic integrity, independent media protection, fact-verification charters, and freedom of expression.',
    charterVersion: 'CHARTER-PG-v1.5',
    charterPreamble: 'Upholding fearless investigation, zero commercial bias, and the sovereign public right to unredacted truth.',
    governorHandle: '',
    councilCount: 0,
    factionsCount: 0,
    totalVoters: 0,
    badgeColor: 'border-rose-500/40 text-rose-300 bg-rose-950/40',
    universeWeight: 1.0,
  },
];

export const INITIAL_FACTIONS_AND_COUNCILS: FactionOrCouncil[] = [];

export const INITIAL_ELECTIONS: MultiversalElection[] = [];

export const INITIAL_AUDIT_LOGS: AuditLogEntry[] = [];
