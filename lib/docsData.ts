import { ZenDocument } from '@/types/docs';

export const LS_ZEN_DOCS = 'zenvitra_docs_storage_v1';

export const UN_PREAMBLE_PREFIXES = [
  'Affirming',
  'Alarmed by',
  'Appreciating',
  'Bearing in mind',
  'Cognizant of',
  'Confident that',
  'Deeply conscious',
  'Deeply convinced',
  'Deeply disturbed',
  'Deeply regretting',
  'Emphasizing',
  'Expecting',
  'Fully alarmed',
  'Guided by',
  'Having adopted',
  'Having considered',
  'Having examined',
  'Noting with satisfaction',
  'Noting with deep concern',
  'Observing',
  'Realizing',
  'Reaffirming',
  'Recalling',
  'Recognizing',
  'Referring to',
  'Seeking',
  'Taking into consideration',
  'Taking note of',
  'Viewing with appreciation',
  'Welcoming'
];

export const UN_OPERATIVE_PREFIXES = [
  'Accepts',
  'Affirms',
  'Applauds',
  'Approves',
  'Authorizes',
  'Calls upon',
  'Commends',
  'Condemns',
  'Congratulates',
  'Considers',
  'Decides',
  'Declares',
  'Deplores',
  'Designates',
  'Emphasizes',
  'Encourages',
  'Endorses',
  'Expresses its appreciation',
  'Further reminds',
  'Further requests',
  'Further resolves',
  'Invites',
  'Notes',
  'Proclaims',
  'Reaffirms',
  'Recommends',
  'Reminds',
  'Requests',
  'Resolves',
  'Solemnly affirms',
  'Strongly advises',
  'Supports',
  'Takes note of',
  'Transmits',
  'Trusts',
  'Urges'
];

export const INDIAN_BILL_SECTIONS = [
  { prefix: '1. Short title, extent and commencement.—', placeholder: '(1) This Act may be called the...\n(2) It extends to the whole of India.' },
  { prefix: '2. Definitions.—', placeholder: 'In this Act, unless the context otherwise requires,—\n(a) "Authority" means the...' },
  { prefix: '3. Declaration of Fundamental Principles.—', placeholder: '(1) The Central Government shall ensure that...' },
  { prefix: '4. Establishment and Constitution of the Council.—', placeholder: '(1) With effect from such date as the Central Government may appoint...' },
  { prefix: '5. Powers and Functions.—', placeholder: 'The Council shall exercise the following powers, namely:—' },
  { prefix: '6. Penalties and Fines.—', placeholder: 'Whoever contravenes any provision of this Act shall be punishable with...' },
  { prefix: '7. Power to make rules.—', placeholder: '(1) The Central Government may, by notification, make rules to carry out the provisions of this Act.' }
];

export const INITIAL_DOCUMENTS: ZenDocument[] = [
  {
    id: 'DOC-UN-2026-001',
    title: 'Framework for Sovereign Artificial Intelligence & Non-Aligned Compute Integrity',
    docCode: 'UNSC/RES/79/AI-GOV',
    docType: 'UN_RESOLUTION',
    committeeOrChamber: 'United Nations Security Council (UNSC)',
    status: 'UNDER_DEBATE',
    leadSponsors: ['France', 'Brazil', 'India'],
    signatories: ['United States', 'United Kingdom', 'Germany', 'Japan', 'South Africa'],
    paperMode: 'light',
    fontFamily: 'Times New Roman',
    fontSize: 12,
    zoomLevel: 100,
    lineSpacing: '1.5',
    starred: true,
    cryptographicHash: '0x8f3c2b1a99d45e0287cb8921a1ef4c29d00b731e847ad3e1987d6052f38ab4c1',
    sealedAt: '2026-09-02T15:30:00Z',
    collaborators: [
      { id: 'u1', name: 'Yuveer', handle: 'yuveer', color: '#06b6d4', role: 'OWNER', active: true },
      { id: 'u2', name: 'Dais Chairperson', handle: 'unsc_chair', color: '#a855f7', role: 'EDITOR', active: true },
      { id: 'u3', name: 'Delegate of France', handle: 'delegate_fr', color: '#3b82f6', role: 'EDITOR', active: false }
    ],
    comments: [
      { id: 'c1', author: 'Delegate of France', authorHandle: 'delegate_fr', text: 'Operative clause 1 phrasing looks strong. Can we add a specific mention of non-commercial verification benchmarks?', createdAt: '2026-09-02T16:00:00Z', resolved: false }
    ],
    contentHtml: `<div style="text-align: center; margin-bottom: 24px;">
  <p style="font-size: 11px; letter-spacing: 0.18em; font-family: monospace; font-weight: bold; color: #4b5563; text-transform: uppercase; margin-bottom: 8px;">United Nations Security Council &bull; Seventy-Ninth Session</p>
  <h1 style="font-size: 22px; font-weight: 800; margin: 0 0 10px 0; color: #111827; letter-spacing: -0.01em;">Draft Resolution UNSC/RES/79/AI-GOV</h1>
  <p style="font-size: 12px; color: #4b5563; margin: 0; font-family: sans-serif;">
    <strong>Lead Sponsors:</strong> France, Brazil, India &nbsp;|&nbsp; <strong>Signatories:</strong> United States, United Kingdom, Germany, Japan, South Africa
  </p>
</div>
<hr style="border: none; border-top: 1.5px solid #d1d5db; margin: 20px 0;" />
<p style="font-size: 14px; line-height: 1.8; font-style: italic; color: #1f2937;">
  <em>The Security Council,</em>
</p>
<p style="font-size: 14px; line-height: 1.8; color: #1f2937;">
  <strong style="text-decoration: underline;">Guided by</strong> the fundamental principles enshrined in the Charter of the United Nations, emphasizing non-intervention, digital sovereignty, and the equal entitlement of developing economies to compute resources,
</p>
<p style="font-size: 14px; line-height: 1.8; color: #1f2937;">
  <strong style="text-decoration: underline;">Deeply conscious</strong> of the rapid asymmetric deployment of algorithmic warfare models and unauthorized data extraction across global south civic infrastructure,
</p>
<p style="font-size: 14px; line-height: 1.8; color: #1f2937;">
  <strong style="text-decoration: underline;">Reaffirming</strong> that international peace and security in the 21st century require open cryptographic verifiability over state-deployed artificial intelligence architectures,
</p>
<p style="font-size: 14px; line-height: 1.8; color: #1f2937;">
  <strong>1. <span style="text-decoration: underline;">Calls upon</span></strong> all Member States to establish independent, cryptographically verifiable sovereign model verification nodes to inspect critical automated decision engines before deployment in diplomatic or judicial workflows;
</p>
<ul style="font-size: 13px; line-height: 1.8; margin-left: 28px; color: #374151;">
  <li>(a) Ensuring zero secret telemetry or unauthorized extraterritorial routing of civic citizen records;</li>
  <li>(b) Mandating open reproducibility of safety evaluations across international neutral observatories;</li>
  <li>(c) Subsidizing neutral hardware verification testbeds for student and university research centers;</li>
</ul>
<p style="font-size: 14px; line-height: 1.8; color: #1f2937;">
  <strong>2. <span style="text-decoration: underline;">Urges</span></strong> the International Telecommunication Union (ITU) and regional diplomatic blocs to subsidize open-weights civic intelligence architectures for developing nations;
</p>
<p style="font-size: 14px; line-height: 1.8; color: #1f2937;">
  <strong>3. <span style="text-decoration: underline;">Decides</span></strong> to remain actively seized of the matter.
</p>`,
    updatedAt: '2026-09-02T15:30:00Z',
    createdAt: '2026-08-30T10:00:00Z',
    version: 3
  },
  {
    id: 'DOC-BILL-2026-002',
    title: 'The Digital Public Civic Ledger & Transparency In Governance Bill, 2026',
    docCode: 'BILL/LS/2026/04',
    docType: 'INDIAN_BILL',
    committeeOrChamber: 'Lok Sabha (Indian Parliament)',
    status: 'TABLED',
    leadSponsors: ['Leader of the House', 'Minister of Electronics & IT'],
    signatories: ['MP from Jaipur Rural', 'MP from Bangalore South', 'MP from Thiruvananthapuram'],
    paperMode: 'light',
    fontFamily: 'Georgia',
    fontSize: 12,
    zoomLevel: 100,
    lineSpacing: '1.5',
    starred: true,
    cryptographicHash: '0x4e29c87b12aa5039f982bcda0011e4c7764f28091daeb50493821034f198eb62',
    sealedAt: '2026-09-03T11:00:00Z',
    collaborators: [
      { id: 'u1', name: 'Yuveer', handle: 'yuveer', color: '#06b6d4', role: 'OWNER', active: true }
    ],
    contentHtml: `<div style="text-align: center; margin-bottom: 24px;">
  <p style="font-size: 11px; letter-spacing: 0.15em; font-family: monospace; font-weight: bold; color: #6b7280; text-transform: uppercase; margin-bottom: 6px;">As Introduced in Lok Sabha &bull; Bill No. 04 of 2026</p>
  <h1 style="font-size: 20px; font-weight: 800; margin: 0 0 10px 0; color: #111827; letter-spacing: 0.02em;">THE DIGITAL PUBLIC CIVIC LEDGER &amp; TRANSPARENCY IN GOVERNANCE BILL, 2026</h1>
  <p style="font-size: 12px; font-style: italic; color: #4b5563; margin: 0; max-width: 620px; margin-left: auto; margin-right: auto;">
    A Bill to establish a sovereign, append-only civic verification framework for public algorithmic administration, judicial records, and government tenders in India.
  </p>
</div>
<hr style="border: none; border-top: 1.5px solid #d1d5db; margin: 20px 0;" />
<p style="font-size: 13px; line-height: 1.8; font-style: italic; text-align: center; color: #374151; margin-bottom: 20px;">
  BE it enacted by Parliament in the Seventy-Seventh Year of the Republic of India as follows:—
</p>
<h3 style="font-size: 14px; font-weight: bold; margin-top: 20px; margin-bottom: 8px; color: #111827;">1. Short title, extent and commencement.—</h3>
<p style="font-size: 13px; line-height: 1.8; color: #374151;">
  (1) This Act may be called the Digital Public Civic Ledger &amp; Transparency In Governance Act, 2026.<br />
  (2) It extends to the whole of India.<br />
  (3) It shall come into force on such date as the Central Government may, by notification in the Official Gazette, appoint.
</p>
<h3 style="font-size: 14px; font-weight: bold; margin-top: 20px; margin-bottom: 8px; color: #111827;">2. Definitions.—</h3>
<p style="font-size: 13px; line-height: 1.8; color: #374151;">
  In this Act, unless the context otherwise requires,—<br />
  (a) <strong>"Civic Ledger"</strong> means the cryptographically verifiable append-only ledger maintained for parliamentary notifications and executive public tenders;<br />
  (b) <strong>"Citizen Audit Council"</strong> means the independent committee constituted under section 4;<br />
  (c) <strong>"Algorithmic Discretion"</strong> means any computational program utilized to determine welfare beneficiary eligibility or civic sanctions.
</p>
<h3 style="font-size: 14px; font-weight: bold; margin-top: 20px; margin-bottom: 8px; color: #111827;">3. Mandatory Disclosure of Algorithmic Parameters.—</h3>
<p style="font-size: 13px; line-height: 1.8; color: #374151;">
  (1) Every Ministry and statutory authority shall publish the decision parameters, training cutoff dates, and audit certificates of all public-facing artificial intelligence services.<br />
  (2) Failure to furnish audit proofs within ninety days shall render the automated scheme voidable upon public petition.
</p>`,
    updatedAt: '2026-09-03T11:00:00Z',
    createdAt: '2026-09-01T08:00:00Z',
    version: 2
  },
  {
    id: 'DOC-STANDARD-2026-003',
    title: 'The Sovereign Digital Treaty: Principles of Decentralized Youth Plenary',
    docCode: 'TREATY/ZEN/2026/01',
    docType: 'STANDARD_DOC',
    committeeOrChamber: 'Global Youth Plenary',
    status: 'PUBLISHED',
    leadSponsors: ['@yuveer (Founder)', 'Zenvitra Secretariat'],
    signatories: ['Plenary Delegates of 42 Nations'],
    paperMode: 'light',
    fontFamily: 'Inter',
    fontSize: 12,
    zoomLevel: 100,
    lineSpacing: '1.5',
    starred: true,
    cryptographicHash: '0x1a77d2039845cebb9910a34882103f5678cd9234b01e7654a9382fba82049102',
    sealedAt: '2026-08-15T00:00:00Z',
    collaborators: [
      { id: 'u1', name: 'Yuveer', handle: 'yuveer', color: '#06b6d4', role: 'OWNER', active: true },
      { id: 'u4', name: 'Sophia Chen', handle: 'sophia_youth', color: '#10b981', role: 'EDITOR', active: true }
    ],
    contentHtml: `<h1 style="font-size: 26px; font-weight: 800; margin-bottom: 8px; color: #111827; letter-spacing: -0.02em;">The Sovereign Digital Treaty: Principles of Decentralized Youth Plenary</h1>
<p style="font-size: 13px; color: #6b7280; margin-bottom: 24px; font-family: monospace;">
  Drafted by @yuveer &bull; Ratified by 42 Delegations &bull; Permanent Constitutional Covenant
</p>
<hr style="border: none; border-top: 1.5px solid #d1d5db; margin: 20px 0;" />
<p style="font-size: 14px; line-height: 1.8; color: #1f2937; margin-bottom: 16px;">
  In an era dominated by closed surveillance capitalism and proprietary data silos, modern civic democracy requires a return to open, verifiable public infrastructure. This document outlines the fundamental pillars of diplomatic autonomy, empirical debate, and cryptographic certainty.
</p>
<h2 style="font-size: 18px; font-weight: bold; margin-top: 24px; margin-bottom: 8px; color: #111827;">Article I: The Principle of Non-Extraterritorial Compute</h2>
<p style="font-size: 14px; line-height: 1.8; color: #374151; margin-bottom: 16px;">
  Every sovereign node retains unalienable rights to verify, audit, and inspect all computational instruments applied to its citizenry. No synthetic intelligence model may be imposed without reproducible safety telemetry and open audit keys.
</p>
<h2 style="font-size: 18px; font-weight: bold; margin-top: 24px; margin-bottom: 8px; color: #111827;">Article II: The 25% Civic Endowment Covenant</h2>
<p style="font-size: 14px; line-height: 1.8; color: #374151; margin-bottom: 16px;">
  Under the ZENVITRA constitutional covenant, 25% of all net platform revenue is irrevocably locked and distributed triannually toward student scholarships, civic hardware, and youth debate councils with cryptographic proof and public video audits.
</p>
<h2 style="font-size: 18px; font-weight: bold; margin-top: 24px; margin-bottom: 8px; color: #111827;">Article III: Real-Time Chamber Telemetry</h2>
<p style="font-size: 14px; line-height: 1.8; color: #374151; margin-bottom: 16px;">
  Every draft resolution or parliamentary motion authored in ZEN.DOCS can be tabled directly to the live Committee Chamber floor with zero intermediary latency. Roll-call votes, speech timers, and diplomatic chits synchronize instantaneously.
</p>`,
    updatedAt: '2026-09-03T18:00:00Z',
    createdAt: '2026-08-15T00:00:00Z',
    version: 4
  }
];

export const INITIAL_WORKSPACES = [
  {
    id: 'ws-foundation',
    name: 'ZENVITRA Foundation',
    icon: 'Building2',
    color: '#06b6d4',
    folders: ['Administration', 'Events & Summits', 'Press & Publications', 'Finance & Grants', 'Research Lab']
  },
  {
    id: 'ws-mun',
    name: 'Diplomatic Secretariat & MUN',
    icon: 'Scale',
    color: '#a855f7',
    folders: ['UNSC Resolutions', 'Lok Sabha Bills', 'Position Papers', 'Working Papers', 'Committee Reports']
  },
  {
    id: 'ws-personal',
    name: 'Personal Workspace',
    icon: 'BookOpen',
    color: '#10b981',
    folders: ['Drafts', 'Study Notes', 'Articles', 'Archive']
  }
];

export interface DocTemplateDefinition {
  id: string;
  type: import('@/types/docs').ZenDocType;
  title: string;
  category: 'Education' | 'Professional' | 'Press' | 'ZEN.MUN';
  description: string;
  iconName: string;
  badge: string;
  color: string;
  initialHtml: string;
}

export const DOC_TEMPLATES: DocTemplateDefinition[] = [
  // ─── ZEN.MUN & Legislative ───
  {
    id: 'tmpl-un-res',
    type: 'UN_RESOLUTION',
    title: 'NAME YOUR DRAFT RESOLUTION',
    category: 'ZEN.MUN',
    description: 'Official UN General Assembly & Security Council format with preambles and numbered operative clauses.',
    iconName: 'Scale',
    badge: 'Diplomatic',
    color: '#06b6d4',
    initialHtml: `<div style="text-align: center; margin-bottom: 24px;">
  <p style="font-size: 11px; letter-spacing: 0.18em; font-family: monospace; font-weight: bold; color: #6b7280; text-transform: uppercase;">United Nations Security Council &bull; Seventy-Ninth Session</p>
  <h1 style="font-size: 22px; font-weight: 800; margin: 8px 0; color: #111827;">NAME YOUR DRAFT RESOLUTION</h1>
  <p style="font-size: 12px; color: #4b5563;"><strong>Sponsors:</strong> Primary Delegation &bull; <strong>Signatories:</strong> Co-Sponsoring States</p>
</div>
<hr style="border: none; border-top: 1.5px solid #d1d5db; margin: 20px 0;" />
<p style="font-size: 14px; line-height: 1.8; font-style: italic; color: #1f2937;">The Security Council,</p>
<p style="font-size: 14px; line-height: 1.8; color: #1f2937;"><strong style="text-decoration: underline;">Guided by</strong> the fundamental principles of sovereign compute governance,</p>
<p style="font-size: 14px; line-height: 1.8; color: #1f2937;"><strong>1. <span style="text-decoration: underline;">Calls upon</span></strong> all Member States to establish open cryptographic audit standards;</p>
<p style="font-size: 14px; line-height: 1.8; color: #1f2937;"><strong>2. <span style="text-decoration: underline;">Decides</span></strong> to remain actively seized of the matter.</p>`
  },
  {
    id: 'tmpl-bill',
    type: 'INDIAN_BILL',
    title: 'NAME YOUR BILL',
    category: 'ZEN.MUN',
    description: 'Gazette-ready Westminster statutory bill with Chapters, Sections (1, 2, 3), Subsections, and enacting formula.',
    iconName: 'Building2',
    badge: 'Parliamentary',
    color: '#f59e0b',
    initialHtml: `<div style="text-align: center; margin-bottom: 24px;">
  <p style="font-size: 11px; letter-spacing: 0.15em; font-family: monospace; font-weight: bold; color: #6b7280; text-transform: uppercase;">As Introduced in Lok Sabha &bull; Bill of 2026</p>
  <h1 style="font-size: 20px; font-weight: 800; margin: 8px 0; color: #111827;">NAME YOUR BILL</h1>
  <p style="font-size: 12px; font-style: italic; color: #4b5563;">A Bill to [State the Objectives / Purpose of Your Bill].</p>
</div>
<hr style="border: none; border-top: 1.5px solid #d1d5db; margin: 20px 0;" />
<p style="font-size: 13px; line-height: 1.8; font-style: italic; text-align: center; color: #374151;">BE it enacted by Parliament in the Seventy-Seventh Year of the Republic of India as follows:—</p>
<h3 style="font-size: 14px; font-weight: bold; margin-top: 20px; margin-bottom: 8px; color: #111827;">1. Short title, extent and commencement.—</h3>
<p style="font-size: 13px; line-height: 1.8; color: #374151;">(1) This Act may be called the [NAME YOUR BILL] Act, 2026.<br />(2) It extends to the whole of India.</p>`
  },
  {
    id: 'tmpl-working-paper',
    type: 'POLICY_WORKING_PAPER',
    title: 'NAME YOUR WORKING PAPER',
    category: 'ZEN.MUN',
    description: 'Collaborative bloc drafting paper for developing consensus clauses during unmoderated caucuses.',
    iconName: 'FileText',
    badge: 'Bloc Draft',
    color: '#a855f7',
    initialHtml: `<h1 style="font-size: 22px; font-weight: 800; color: #111827;">NAME YOUR WORKING PAPER</h1>
<p style="font-size: 12px; color: #6b7280; font-family: monospace;">Authors: Delegation Bloc A &bull; Working Group on [Topic]</p>
<hr style="border: none; border-top: 1.5px solid #d1d5db; margin: 16px 0;" />
<h3 style="font-size: 15px; font-weight: bold; color: #111827;">Core Diplomatic Objectives</h3>
<p style="font-size: 13px; line-height: 1.8; color: #374151;">Outline specific diplomatic mechanisms, logistical safe routes, and verification missions proposed by the signatory bloc.</p>`
  },

  // ─── Press & Publishing ───
  {
    id: 'tmpl-press-article',
    type: 'PRESS_ARTICLE',
    title: 'Editorial Article & Publish to ZEN.PRESS',
    category: 'Press',
    description: 'Long-form journalistic essay with subheadings, quotes, and 1-click publishing to ZENVITRA Press.',
    iconName: 'Newspaper',
    badge: 'ZEN.PRESS',
    color: '#ec4899',
    initialHtml: `<h1 style="font-size: 26px; font-weight: 900; line-height: 1.25; color: #111827; letter-spacing: -0.02em;">The Architecture of Digital Pluralism: Why Decentralized Civic Tech Matters</h1>
<p style="font-size: 13px; color: #6b7280; font-style: italic; margin-bottom: 24px;">By Special Envoy &bull; Zenvitra Bureau of Sovereign Computing</p>
<hr style="border: none; border-top: 1.5px solid #d1d5db; margin: 20px 0;" />
<p style="font-size: 15px; line-height: 1.8; color: #1f2937;">Modern internet infrastructure has consolidated into centralized monopolies that control speech, identity, and commerce. This investigative dispatch examines alternative models built on cryptographic verifiability.</p>
<blockquote style="border-left: 3px solid #ec4899; padding-left: 16px; margin: 20px 0; font-style: italic; color: #374151;">
  "True sovereignty begins when citizen data cannot be confiscated by proprietary platforms."
</blockquote>`
  },

  // ─── Research & Academic ───
  {
    id: 'tmpl-research-paper',
    type: 'RESEARCH_PAPER',
    title: 'Academic Research Paper',
    category: 'Education',
    description: 'Peer-reviewed structure: Abstract, Introduction, Literature Review, Methodology, Data, and Conclusion.',
    iconName: 'BookOpen',
    badge: 'Academic',
    color: '#10b981',
    initialHtml: `<h1 style="font-size: 22px; font-weight: 800; text-align: center; color: #111827;">Empirical Analysis of Youth Deliberation in Simulated Parliamentary Bodies</h1>
<p style="font-size: 12px; text-align: center; color: #6b7280; font-family: monospace; margin-bottom: 24px;">Zenvitra Institute of Civic Informatics &bull; Working Paper Series</p>
<div style="background: #f3f4f6; padding: 16px; border-radius: 8px; margin-bottom: 24px;">
  <h4 style="font-size: 12px; font-weight: bold; text-transform: uppercase; color: #374151; margin-bottom: 6px;">Abstract</h4>
  <p style="font-size: 12px; line-height: 1.7; color: #4b5563;">This paper examines the impact of structured Rules of Procedure and real-time speech telemetry on consensus formation across 500 parliamentary simulation delegates.</p>
</div>
<h2 style="font-size: 16px; font-weight: bold; color: #111827;">1. Introduction</h2>
<p style="font-size: 13px; line-height: 1.8; color: #374151;">Deliberative democracy requires institutional forums where arguments can be weighed systematically.</p>`
  },

  // ─── Professional & Workspaces ───
  {
    id: 'tmpl-meeting-notes',
    type: 'MEETING_MINUTES',
    title: 'Executive Meeting Minutes',
    category: 'Professional',
    description: 'Attendees, Agenda, Decisions, and Action Items with assignees and target deadlines.',
    iconName: 'CheckSquare',
    badge: 'Executive',
    color: '#3b82f6',
    initialHtml: `<h1 style="font-size: 20px; font-weight: 800; color: #111827;">Secretariat Planning &amp; Executive Council Minutes</h1>
<p style="font-size: 12px; color: #6b7280; font-family: monospace;">Date: ${new Date().toLocaleDateString()} &bull; Chaired by Secretariat</p>
<hr style="border: none; border-top: 1.5px solid #d1d5db; margin: 16px 0;" />
<h3 style="font-size: 14px; font-weight: bold; color: #111827;">1. Key Decisions Ratified</h3>
<ul style="font-size: 13px; line-height: 1.8; color: #374151;">
  <li><strong>Motion 1:</strong> Conference venue confirmed at Jaipur International Centre.</li>
  <li><strong>Motion 2:</strong> 25% Civic Endowment treasury allocation approved.</li>
</ul>
<h3 style="font-size: 14px; font-weight: bold; color: #111827; margin-top: 18px;">2. Action Items &amp; Deadlines</h3>
<p style="font-size: 13px; line-height: 1.8; color: #374151;">&bull; Complete country matrix allocations (Due: Friday)<br />&bull; Issue delegate handbook &amp; rules of procedure</p>`
  },
  {
    id: 'tmpl-proposal',
    type: 'PROPOSAL',
    title: 'Strategic Project Proposal',
    category: 'Professional',
    description: 'Problem Statement, Proposed Solution, Deliverables, Budget Breakdown, and Implementation Timeline.',
    iconName: 'Briefcase',
    badge: 'Enterprise',
    color: '#6366f1',
    initialHtml: `<h1 style="font-size: 22px; font-weight: 800; color: #111827;">Sovereign Student Civic Fellowship Proposal</h1>
<p style="font-size: 12px; color: #6b7280;">Prepared for: ZENVITRA Foundation Board</p>
<hr style="border: none; border-top: 1.5px solid #d1d5db; margin: 16px 0;" />
<h3 style="font-size: 14px; font-weight: bold; color: #111827;">Executive Summary</h3>
<p style="font-size: 13px; line-height: 1.8; color: #374151;">A nationwide fellowship granting ₹50,000 stipends and hardware compute to 100 student researchers in non-aligned technology policy.</p>`
  }
];

