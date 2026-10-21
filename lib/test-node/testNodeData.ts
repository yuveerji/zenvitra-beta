/**
 * ZENVITRA TEST NODE — COMPLETE SEEDED SANDBOX DATASET
 * 
 * STRICT ISOLATION NOTICE:
 * This file contains 100% synthetic, fictional demonstration data exclusively for the Test Node sandbox.
 * None of this data is ever written to, queried by, or blended with the production database.
 */

export interface TestNodePersona {
  id: string;
  name: string;
  handle: string;
  role: 'DELEGATE' | 'SECRETARIAT' | 'CHAIR' | 'ORGANIZER' | 'CITIZEN' | 'EXECUTIVE_BOARD' | 'COMMUNITY_MEMBER' | 'ORGANISER';
  country?: string;
  committee?: string;
  avatar: string;
  bio: string;
  passportId: string;
}

export const TEST_PERSONAS: TestNodePersona[] = [
  {
    id: 'persona_aanya_delegate',
    name: 'Aanya Sharma',
    handle: '@aanya.demo',
    role: 'DELEGATE',
    country: 'India',
    committee: 'All India Political Parties Meet (AIPPM)',
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=256&q=80',
    bio: 'Chief Delegate & Policy Envoy specializing in public health frameworks, youth education mandates, and parliamentary debate.',
    passportId: 'PASSPORT-IND-DEMO-01',
  },
  {
    id: 'persona_rohan_eb',
    name: 'Rohan Mehra',
    handle: '@rohan.eb',
    role: 'EXECUTIVE_BOARD',
    committee: 'All India Political Parties Meet (AIPPM)',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=256&q=80',
    bio: 'Committee Chairperson presiding over AIPPM floor debate. Veteran of 15+ collegiate Model UN simulations and youth parliaments.',
    passportId: 'PASSPORT-EB-0042',
  },
  {
    id: 'persona_kavita_sec',
    name: 'Kavita Nair',
    handle: '@kavita.sec',
    role: 'SECRETARIAT',
    avatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=256&q=80',
    bio: 'Secretary-General overseeing summit logistics, chamber quorum health, executive appointments, and emergency bulletins.',
    passportId: 'PASSPORT-SEC-0001',
  },
  {
    id: 'persona_vikram_org',
    name: 'Vikram Patel',
    handle: '@vikram.org',
    role: 'ORGANIZER',
    avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=256&q=80',
    bio: 'Director General of Logistics & Finance. Directing pass tier structures, simulated Cashfree checkouts, and venue protocols.',
    passportId: 'PASSPORT-ORG-1029',
  },
  {
    id: 'persona_tanya_comm',
    name: 'Tanya Sengupta',
    handle: '@tanya.pulse',
    role: 'COMMUNITY_MEMBER',
    avatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=256&q=80',
    bio: 'Civic Thinker & Youth Columnist actively publishing dispatches, polling community sentiment, and auditing policy drafts on ZEN.PULSE.',
    passportId: 'PASSPORT-CTZ-7734',
  },
  {
    id: 'persona_del_france',
    name: 'Elena Rostova',
    handle: 'elena_france',
    role: 'DELEGATE',
    country: 'France',
    committee: 'United Nations Security Council',
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
    bio: 'Permanent Representative of the French Republic to the UNSC. Specializing in cyber deterrence treaties and multilateral security protocols.',
    passportId: 'PASSPORT-FRA-9921',
  },
  {
    id: 'persona_sec_gen',
    name: 'Amb. Marcus Sterling',
    handle: 'secgen_sterling',
    role: 'SECRETARIAT',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80',
    bio: 'Secretary-General of APEX MUN 2026. Managing 800+ international student envoys and 6 sovereign committee chambers.',
    passportId: 'PASSPORT-SEC-0002',
  },
  {
    id: 'persona_chair_unsc',
    name: 'Tara Mukherjee',
    handle: 'director_tara',
    role: 'CHAIR',
    committee: 'United Nations Security Council',
    avatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=150&auto=format&fit=crop&q=80',
    bio: 'President of the Security Council. Veteran of 14 collegiate MUNs across Geneva, Delhi, and Boston.',
    passportId: 'PASSPORT-DIR-4412',
  },
];

// Fictional Conference Data
export interface TestConference {
  id: string;
  name: string;
  shortName: string;
  tagline: string;
  city: string;
  venue: string;
  startDate: string;
  endDate: string;
  status: 'IN_SESSION' | 'REGISTRATION_OPEN' | 'CONCLUDED';
  totalDelegates: number;
  committeesCount: number;
  ticketPrice: number;
  description: string;
}

export const TEST_CONFERENCE: TestConference = {
  id: 'test_conf_apex_2026',
  name: 'APEX Sovereign Model United Nations 2026',
  shortName: 'APEX MUN 2026',
  tagline: 'Multilateral Diplomacy in an Era of Digital Sovereignty',
  city: 'New Delhi',
  venue: 'Vigyan Bhawan International Concourse',
  startDate: '2026-10-24',
  endDate: '2026-10-26',
  status: 'IN_SESSION',
  totalDelegates: 420,
  committeesCount: 4,
  ticketPrice: 1499,
  description:
    'A fully simulated Model United Nations summit designed to showcase real-time speaker queue management, electronic chits, live voting, and instant legislative paper drafting.',
};

// Fictional Committees
export interface TestCommittee {
  id: string;
  name: string;
  shortName: string;
  agenda: string;
  type: string;
  totalSeats: number;
  presentCount: number;
  chairs: string[];
  bannerUrl: string;
}

export const TEST_COMMITTEES: TestCommittee[] = [
  {
    id: 'comm_unsc',
    name: 'United Nations Security Council',
    shortName: 'UNSC',
    agenda: 'Mitigating Autonomous Weapons & AI-Guided Drone Warfare in Disputed Strategic Corridors',
    type: 'UNSC',
    totalSeats: 15,
    presentCount: 14,
    chairs: ['Tara Mukherjee (President)', 'Devon Vance (Vice President)'],
    bannerUrl: 'https://images.unsplash.com/photo-1541872703-74c5e44368f9?w=800&auto=format&fit=crop&q=80',
  },
  {
    id: 'comm_unhrc',
    name: 'United Nations Human Rights Council',
    shortName: 'UNHRC',
    agenda: 'Protection of Stateless Refugees and Displaced Youth Across Cross-Border Climate Crisis Zones',
    type: 'UNHRC',
    totalSeats: 47,
    presentCount: 42,
    chairs: ['Zainab Al-Mansoor (President)', 'Liam O’Connor (Rapporteur)'],
    bannerUrl: 'https://images.unsplash.com/photo-1526778548025-fa2f459cd5c1?w=800&auto=format&fit=crop&q=80',
  },
  {
    id: 'comm_loksatta',
    name: 'Lok Sabha (Lower House of Indian Parliament)',
    shortName: 'LOK SABHA',
    agenda: 'Deliberation on the National Digital Infrastructure & AI Ethics Bill (Special Parliamentary Session)',
    type: 'LOK_SABHA',
    totalSeats: 54,
    presentCount: 51,
    chairs: ['Hon. Speaker Om Prakash Sharma', 'Deputy Speaker Meenakshi Sundaram'],
    bannerUrl: 'https://images.unsplash.com/photo-1587474260584-136574528ed5?w=800&auto=format&fit=crop&q=80',
  },
  {
    id: 'comm_crisis',
    name: 'Continuous Crisis Committee: Strait of Malacca Maritime Emergency',
    shortName: 'CRISIS',
    agenda: 'Response to Unidentified Subsurface EMP Strike on Commercial Shipping Lanes',
    type: 'CRISIS',
    totalSeats: 18,
    presentCount: 18,
    chairs: ['Crisis Director Commander Cole Evans', 'Intelligence Backroom Lead Anya Volkova'],
    bannerUrl: 'https://images.unsplash.com/photo-1509228468518-180dd4864904?w=800&auto=format&fit=crop&q=80',
  },
];

// Fictional Delegates
export interface TestDelegate {
  id: string;
  name: string;
  country: string;
  countryCode: string;
  committeeId: string;
  attendance: 'present' | 'present_voting' | 'absent';
  speechesCount: number;
  pointsScore: number;
  avatar: string;
}

export const TEST_DELEGATES: TestDelegate[] = [
  { id: 'del_1', name: 'Elena Rostova', country: 'France', countryCode: 'fr', committeeId: 'comm_unsc', attendance: 'present_voting', speechesCount: 4, pointsScore: 88, avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=80' },
  { id: 'del_2', name: 'Michael Zhang', country: 'China', countryCode: 'cn', committeeId: 'comm_unsc', attendance: 'present_voting', speechesCount: 5, pointsScore: 92, avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=80' },
  { id: 'del_3', name: 'Jonathan Hayes', country: 'United States', countryCode: 'us', committeeId: 'comm_unsc', attendance: 'present_voting', speechesCount: 6, pointsScore: 95, avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=80' },
  { id: 'del_4', name: 'Dmitri Ivanov', country: 'Russian Federation', countryCode: 'ru', committeeId: 'comm_unsc', attendance: 'present_voting', speechesCount: 3, pointsScore: 84, avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=80' },
  { id: 'del_5', name: 'Sarah Al-Sabah', country: 'United Kingdom', countryCode: 'gb', committeeId: 'comm_unsc', attendance: 'present_voting', speechesCount: 4, pointsScore: 87, avatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=80' },
  { id: 'del_6', name: 'Aarav Malhotra', country: 'India', countryCode: 'in', committeeId: 'comm_unsc', attendance: 'present_voting', speechesCount: 5, pointsScore: 94, avatar: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=80' },
  { id: 'del_7', name: 'Lucas Silva', country: 'Brazil', countryCode: 'br', committeeId: 'comm_unsc', attendance: 'present', speechesCount: 2, pointsScore: 78, avatar: 'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=80' },
  { id: 'del_8', name: 'Amina Diallo', country: 'Ghana', countryCode: 'gh', committeeId: 'comm_unsc', attendance: 'present', speechesCount: 3, pointsScore: 82, avatar: 'https://images.unsplash.com/photo-1531746020798-e6953c6e8e04?w=80' },
  { id: 'del_9', name: 'Kenji Takahashi', country: 'Japan', countryCode: 'jp', committeeId: 'comm_unsc', attendance: 'present', speechesCount: 3, pointsScore: 81, avatar: 'https://images.unsplash.com/photo-1501196354995-cbb51c65aaea?w=80' },
  { id: 'del_10', name: 'Fatima Zahra', country: 'Algeria', countryCode: 'dz', committeeId: 'comm_unsc', attendance: 'present', speechesCount: 2, pointsScore: 76, avatar: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=80' },
];

// Fictional Motions & Caucuses
export interface TestMotion {
  id: string;
  committeeId: string;
  proposedBy: string;
  type: 'MODERATED_CAUCUS' | 'UNMODERATED_CAUCUS' | 'WORKING_PAPER';
  topic: string;
  totalMinutes: number;
  speakerSeconds: number;
  status: 'PASSED' | 'FAILED' | 'ACTIVE';
  votesFor: number;
  votesAgainst: number;
}

export const TEST_MOTIONS: TestMotion[] = [
  {
    id: 'motion_1',
    committeeId: 'comm_unsc',
    proposedBy: 'France',
    type: 'MODERATED_CAUCUS',
    topic: 'Mandatory Human-in-the-Loop Safeguards for Lethal Autonomous Weapons Systems (LAWS)',
    totalMinutes: 12,
    speakerSeconds: 60,
    status: 'ACTIVE',
    votesFor: 12,
    votesAgainst: 2,
  },
  {
    id: 'motion_2',
    committeeId: 'comm_unsc',
    proposedBy: 'United States',
    type: 'MODERATED_CAUCUS',
    topic: 'Establishing a Multi-Agency Verification Registry for Drone Export Interdictions',
    totalMinutes: 10,
    speakerSeconds: 45,
    status: 'PASSED',
    votesFor: 11,
    votesAgainst: 3,
  },
  {
    id: 'motion_3',
    committeeId: 'comm_unsc',
    proposedBy: 'India',
    type: 'UNMODERATED_CAUCUS',
    topic: 'Informal Bloc Consultations for Draft Working Paper 1.2 on Cyber Forensics',
    totalMinutes: 15,
    speakerSeconds: 0,
    status: 'PASSED',
    votesFor: 13,
    votesAgainst: 1,
  },
];

// Fictional Draft Resolutions & Bills
export interface TestDocument {
  id: string;
  code: string;
  title: string;
  committee: string;
  category: 'UN_RESOLUTION' | 'PARLIAMENTARY_BILL' | 'PRESS_RELEASE' | 'WORKING_PAPER';
  sponsors: string[];
  signatories: string[];
  status: 'DRAFTING' | 'INTRODUCED' | 'ADOPTED' | 'REJECTED';
  ayeVotes: number;
  nayVotes: number;
  abstainVotes: number;
  preambleClauses: string[];
  operativeClauses: string[];
}

export const TEST_DOCUMENTS: TestDocument[] = [
  {
    id: 'doc_unsc_res_1',
    code: 'UNSC RES/2026/4.1',
    title: 'Framework on Algorithmic Transparency and Proportionality in Autonomous Defense Installations',
    committee: 'United Nations Security Council',
    category: 'UN_RESOLUTION',
    sponsors: ['France', 'India', 'Japan'],
    signatories: ['United States', 'Brazil', 'Ghana', 'Algeria'],
    status: 'INTRODUCED',
    ayeVotes: 11,
    nayVotes: 2,
    abstainVotes: 1,
    preambleClauses: [
      'Reaffirming the foundational tenets of the United Nations Charter and international humanitarian law,',
      'Deeply conscious of the escalating proliferation of uncrewed autonomous strike platforms in maritime and border theatres,',
      'Recognizing the urgent necessity for sovereign oversight protocols to prevent automated escalation loops,',
    ],
    operativeClauses: [
      '1. Calls upon all Member States to implement mandatory cryptographic human-in-the-loop authorization nodes prior to kinetic engagement;',
      '2. Establishes the International Autonomous Defense Verification Registry under the auspices of the UN Office for Disarmament Affairs;',
      '3. Recommends quarterly compliance inspections of border-sensor telemetry feeds conducted by certified multilateral inspectors;',
    ],
  },
  {
    id: 'doc_bill_lok_sabha_1',
    code: 'BILL NO. 88 OF 2026',
    title: 'The National AI Ethics and Digital Citizen Protection Bill, 2026',
    committee: 'Lok Sabha',
    category: 'PARLIAMENTARY_BILL',
    sponsors: ['Ministry of Electronics & Information Technology', 'Standing Committee on Science & Technology'],
    signatories: ['48 Members of Parliament'],
    status: 'INTRODUCED',
    ayeVotes: 312,
    nayVotes: 44,
    abstainVotes: 12,
    preambleClauses: [
      'BE it enacted by Parliament in the Seventy-seventh Year of the Republic of India as follows:—',
      'WHEREAS modern synthetic cognition systems necessitate constitutional safeguarding of individual citizen sovereignty;',
    ],
    operativeClauses: [
      '1. (1) This Act may be called the National AI Ethics and Digital Citizen Protection Act, 2026.',
      '2. Every citizen shall possess an inalienable right to an algorithmic audit trail for automated state decisions affecting livelihood, licensing, or liberty.',
      '3. There shall be established a statutory Sovereign Algorithmic Commission with appellate powers over automated public sector deployments.',
    ],
  },
];

// Fictional Mock Transactions (Cashfree Simulated)
export interface TestTransaction {
  id: string;
  orderId: string;
  delegateName: string;
  delegateEmail: string;
  committee: string;
  amount: number;
  status: 'SUCCESS' | 'PENDING' | 'REFUNDED' | 'FAILED';
  paymentMode: 'UPI_COLLECT' | 'UPI_QR' | 'CARD' | 'NET_BANKING';
  timestamp: string;
  utrNumber: string;
}

export const TEST_TRANSACTIONS: TestTransaction[] = [
  { id: 'txn_101', orderId: 'CF-SANDBOX-8801', delegateName: 'Elena Rostova', delegateEmail: 'elena@univ-paris.edu', committee: 'UNSC', amount: 1499, status: 'SUCCESS', paymentMode: 'UPI_COLLECT', timestamp: '2026-10-18 10:14 IST', utrNumber: 'MOCK-UTR-998811' },
  { id: 'txn_102', orderId: 'CF-SANDBOX-8802', delegateName: 'Michael Zhang', delegateEmail: 'zhang@tsinghua.org', committee: 'UNSC', amount: 1499, status: 'SUCCESS', paymentMode: 'CARD', timestamp: '2026-10-18 11:32 IST', utrNumber: 'MOCK-UTR-998812' },
  { id: 'txn_103', orderId: 'CF-SANDBOX-8803', delegateName: 'Aarav Malhotra', delegateEmail: 'aarav@iitd.ac.in', committee: 'UNSC', amount: 1499, status: 'SUCCESS', paymentMode: 'UPI_QR', timestamp: '2026-10-18 12:45 IST', utrNumber: 'MOCK-UTR-998813' },
  { id: 'txn_104', orderId: 'CF-SANDBOX-8804', delegateName: 'Simran Kaur', delegateEmail: 'simran@du.ac.in', committee: 'UNHRC', amount: 1199, status: 'SUCCESS', paymentMode: 'UPI_COLLECT', timestamp: '2026-10-18 14:10 IST', utrNumber: 'MOCK-UTR-998814' },
  { id: 'txn_105', orderId: 'CF-SANDBOX-8805', delegateName: 'Lucas Silva', delegateEmail: 'lucas@usp.br', committee: 'UNSC', amount: 1499, status: 'REFUNDED', paymentMode: 'CARD', timestamp: '2026-10-18 15:20 IST', utrNumber: 'MOCK-UTR-998815' },
  { id: 'txn_106', orderId: 'CF-SANDBOX-8806', delegateName: 'Amina Diallo', delegateEmail: 'amina@legon.edu.gh', committee: 'UNSC', amount: 1499, status: 'SUCCESS', paymentMode: 'NET_BANKING', timestamp: '2026-10-18 16:45 IST', utrNumber: 'MOCK-UTR-998816' },
  { id: 'txn_107', orderId: 'CF-SANDBOX-8807', delegateName: 'Dev Sharma', delegateEmail: 'dev@bits-pilani.ac.in', committee: 'LOK SABHA', amount: 1299, status: 'PENDING', paymentMode: 'UPI_COLLECT', timestamp: '2026-10-18 17:10 IST', utrNumber: 'MOCK-UTR-PENDING' },
];

// Fictional Social Feed Posts (ZEN.PULSE)
export interface TestPost {
  id: string;
  authorName: string;
  authorHandle: string;
  authorAvatar: string;
  authorBadge: string;
  content: string;
  timestamp: string;
  likes: number;
  commentsCount: number;
  tags: string[];
  poll?: {
    question: string;
    options: { text: string; votes: number }[];
  };
}

export const TEST_POSTS: TestPost[] = [
  {
    id: 'post_1',
    authorName: 'Amb. Marcus Sterling',
    authorHandle: 'secgen_sterling',
    authorAvatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150',
    authorBadge: '🏛️ SECRETARIAT',
    content: 'Welcome delegates, chairs, and international observers to the APEX MUN 2026 Sandbox. Committee sessions in the UNSC and Lok Sabha are currently active. Ensure your working papers are submitted through ZEN.DOCS by 16:00 IST.',
    timestamp: '15 mins ago',
    likes: 42,
    commentsCount: 9,
    tags: ['#ApexMun2026', '#SecretariatBriefing', '#Diplomacy'],
  },
  {
    id: 'post_2',
    authorName: 'Elena Rostova',
    authorHandle: 'elena_france',
    authorAvatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150',
    authorBadge: '🇫🇷 DELEGATE',
    content: 'The Delegation of France has officially introduced Working Paper 1.1 on mandatory cryptographic kill-switches for uncrewed border units. Open to cosponsors from non-aligned delegations.',
    timestamp: '42 mins ago',
    likes: 29,
    commentsCount: 14,
    tags: ['#UNSC', '#AutonomousWeapons', '#SovereignTech'],
    poll: {
      question: 'Should an international inspection agency hold algorithmic audit rights over military AI?',
      options: [
        { text: 'Yes — Mandatory multilateral registry', votes: 64 },
        { text: 'No — Sovereign defense prerogative', votes: 22 },
        { text: 'Conditional upon bilateral treaties', votes: 14 },
      ],
    },
  },
  {
    id: 'post_3',
    authorName: 'Arjun Sen',
    authorHandle: 'arjun_sen',
    authorAvatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150',
    authorBadge: '⚖️ CITIZEN OBSERVER',
    content: 'Reviewing the Lok Sabha draft bill on algorithmic audits. Clause 2 is a significant step forward for youth data privacy in South Asia. Hope the amendment on open-weight LLMs passes.',
    timestamp: '2 hours ago',
    likes: 18,
    commentsCount: 6,
    tags: ['#LokSabha', '#DigitalRights', '#PolicyDrafting'],
  },
];

// Fictional Chat Channels & Messages
export interface TestChatMessage {
  id: string;
  senderName: string;
  senderHandle: string;
  senderRole: string;
  content: string;
  timestamp: string;
  isOfficial?: boolean;
}

export interface TestChatChannel {
  id: string;
  name: string;
  description: string;
  type: 'COMMITTEE' | 'SECRETARIAT' | 'ANNOUNCEMENTS';
  unreadCount: number;
  messages: TestChatMessage[];
}

export const TEST_CHAT_CHANNELS: TestChatChannel[] = [
  {
    id: 'chan_unsc',
    name: 'UNSC // Chamber Backchannel',
    description: 'Informal delegate communications and working bloc formation for UNSC.',
    type: 'COMMITTEE',
    unreadCount: 2,
    messages: [
      { id: 'm_1', senderName: 'Elena Rostova (France)', senderHandle: 'elena_france', senderRole: 'DELEGATE', content: 'Delegations interested in contributing to Operative Clause 2 on the cyber forensics team, please send chits.', timestamp: '14:22' },
      { id: 'm_2', senderName: 'Aarav Malhotra (India)', senderHandle: 'aarav_india', senderRole: 'DELEGATE', content: 'India supports the inclusion of developing economies in the inspection panel. Chit sent.', timestamp: '14:24' },
      { id: 'm_3', senderName: 'Tara Mukherjee (Director)', senderHandle: 'director_tara', senderRole: 'CHAIR', content: 'Chamber reminder: Formal debate resumes in 2 minutes. Delegates please take your allotted seats.', timestamp: '14:28', isOfficial: true },
    ],
  },
  {
    id: 'chan_sec_bulletin',
    name: 'Secretariat Direct Wire',
    description: 'Official announcements from the Secretary-General & Conference Secretariat.',
    type: 'SECRETARIAT',
    unreadCount: 0,
    messages: [
      { id: 'm_4', senderName: 'Amb. Marcus Sterling', senderHandle: 'secgen_sterling', senderRole: 'SECRETARIAT', content: 'All committee rooms have achieved initial quorum. Session 1 is officially gavelled in.', timestamp: '09:15', isOfficial: true },
      { id: 'm_5', senderName: 'Kavya Nair (Ops Lead)', senderHandle: 'kavya_ops', senderRole: 'ORGANIZER', content: 'Lunch concourse passes are synchronized on your holographic passports. Gate scanners active at Hall 3.', timestamp: '12:00', isOfficial: true },
    ],
  },
];

// Fictional Secretariat EB Applications
export interface TestEbApplication {
  id: string;
  applicantName: string;
  email: string;
  preferredCommittee: string;
  priorExperience: string;
  status: 'PENDING_REVIEW' | 'APPROVED' | 'SHORTLISTED' | 'REJECTED';
  appliedDate: string;
}

export const TEST_EB_APPLICATIONS: TestEbApplication[] = [
  { id: 'eb_1', applicantName: 'Rohan Mehra', email: 'rohan.m@ststephens.edu', preferredCommittee: 'UNSC (Vice President)', priorExperience: 'Chair at HMUN India 2025; Head Delegate at Harvard WorldMUN 2024.', status: 'APPROVED', appliedDate: '2026-10-10' },
  { id: 'eb_2', applicantName: 'Ananya Sharma', email: 'ananya@nludelhi.ac.in', preferredCommittee: 'Lok Sabha (Speaker)', priorExperience: 'National Youth Parliament Champion 2024; Parliamentary Debate Finalist.', status: 'SHORTLISTED', appliedDate: '2026-10-12' },
  { id: 'eb_3', applicantName: 'Julian Thorne', email: 'julian@oxford.edu', preferredCommittee: 'Crisis Committee (Backroom Lead)', priorExperience: 'Crisis Director at OUMUN 2025; 8 collegiate crisis assignments.', status: 'PENDING_REVIEW', appliedDate: '2026-10-14' },
];
