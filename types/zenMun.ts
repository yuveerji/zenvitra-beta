export type DelegationRole = 'member' | 'observer';
export type AttendanceStatus = 'absent' | 'present' | 'present_voting';
export type ChairRole = 'moderator' | 'commenter';
export type ActiveDebateMode = 'gsl' | 'moderated_caucus' | 'unmoderated_caucus' | 'consultation' | 'voting';

export interface ZenDelegate {
  id: string;
  name: string;
  countryCode: string;
  flagUrl?: string;
  role: DelegationRole;
  attendance: AttendanceStatus;
  isP5?: boolean;
}

export interface PointLedgerEntry {
  id: string;
  delegateId: string;
  delegateName: string;
  category: 
    | 'attendance'
    | 'gsl_speech'
    | 'caucus_speech'
    | 'speaking_time'
    | 'motion_raised'
    | 'motion_passed'
    | 'right_of_reply'
    | 'working_paper'
    | 'draft_resolution'
    | 'dr_passed'
    | 'manual_adjustment';
  points: number;
  reason: string;
  secondsSpoken?: number;
  timestamp: string;
}

export interface CommenterFeedback {
  id: string;
  delegateId: string;
  delegateName: string;
  speechType: 'GSL' | 'CAUCUS' | 'RTR';
  note: string;
  ratings: {
    diplomacy: number;
    publicSpeaking: number;
    collaboration: number;
    contentResearch: number;
  };
  timestamp: string;
  commenterName?: string;
}

export interface ZenMotion {
  id: string;
  type: 'moderated' | 'unmoderated' | 'tour_de_table' | 'consultation' | 'custom' | 'suspend' | 'end_debate';
  typeName: string;
  topic: string;
  proposedById: string;
  proposedByName: string;
  totalSeconds: number;
  delegateSeconds: number;
  status: 'queued' | 'passed' | 'failed' | 'active';
  createdAt: string;
}

export interface ZenDocument {
  id: string;
  type: 'working_paper' | 'draft_resolution';
  code: string;
  title: string;
  sponsors: string[]; // delegate IDs
  signatories: string[]; // delegate IDs
  content: string;
  stage: 'draft' | 'reading' | 'presentation' | 'qa' | 'voting' | 'passed' | 'failed';
  stageTimeRemaining: number;
  readingSeconds: number;
  presentationSeconds: number;
  qaSeconds: number;
  createdAt: string;
}

export interface SubstantiveVoteSession {
  documentId: string;
  documentTitle: string;
  round: 1 | 2;
  votes: Record<string, 'for' | 'against' | 'abstain' | 'pass' | 'for_with_rights' | 'against_with_rights'>;
  passedCount: number;
  againstCount: number;
  abstainCount: number;
  requiredMajority: 'simple' | 'two_thirds';
  p5VetoEnabled: boolean;
  vetoedBy?: string[];
  status: 'voting' | 'passed' | 'failed';
}

export interface ZenMunSession {
  sessionCode: string;
  chairPassword: string;
  chairName: string;
  chairRole: ChairRole;
  committeeName: string;
  committeeAcronym: string;
  topic: string;
  emblemUrl: string;
  isIndianCommittee?: boolean;

  roster: ZenDelegate[];
  speakerQueue: string[]; // delegate IDs
  currentSpeakerId: string | null;
  speakingTimeSeconds: number;
  remainingSeconds: number;
  isTimerRunning: boolean;
  totalSpokenSecondsCurrent: number;

  rtrActive: boolean;
  rtrDelegateId: string | null;
  rtrRemainingSeconds: number;
  rtrIsRunning: boolean;

  yieldPopoverOpen: boolean;
  yieldRemainingSeconds: number;

  activeMode: ActiveDebateMode;
  activeCaucusMotion: ZenMotion | null;
  caucusRemainingTotalSeconds: number;
  caucusIsRunning: boolean;
  caucusSpeakerQueue: string[];

  motions: ZenMotion[];
  documents: ZenDocument[];
  activeVoting: SubstantiveVoteSession | null;

  pointsLedger: PointLedgerEntry[];
  commenterFeedbacks: CommenterFeedback[];

  settings: {
    rankingBlend: number; // 0 to 100%
    qualityFactors: Array<{ id: string; label: string; scaleMin: number; scaleMax: number }>;
    pointValues: {
      attendance: number;
      gslSpeech: number;
      caucusSpeech: number;
      speakingTimePer10s: number;
      motionRaised: number;
      motionPassed: number;
      rightOfReply: number;
      workingPaper: number;
      draftResolution: number;
      drPassed: number;
    };
    allowDelegateGslRequest: boolean;
    allowDelegateMotion: boolean;
    allowDelegateDocs: boolean;
    allowDelegateDMs: boolean;
    allowPhoneVoting: boolean;
    p5VetoEnabled: boolean;
    majorityRule: 'simple' | 'two_thirds';
  };

  sessionState?: 'pre-session' | 'in-session';
  tutorial: {
    isActive: boolean;
    currentStep: number;
    isCompleted: boolean;
    welcomeModalOpen: boolean;
  };
}

export interface PresetCommitteeDef {
  name: string;
  acronym: string;
  emblem: string;
  logoKey: string;
  isIndian?: boolean;
  category: 'Indian Parliamentary' | 'UN' | 'Specialized' | 'Crisis' | 'National Legislature' | 'Regional Bloc';
  seatsCount?: number;
  defaultTopic?: string;
  suggestedBundleId?: string;
  searchTags?: string[];
}

export const PRESET_COMMITTEES: PresetCommitteeDef[] = [
  // ── 1. NATIONAL LEGISLATURES, SENATES & PARLIAMENTS ──
  {
    name: 'United States Senate',
    acronym: 'US Senate',
    emblem: '/assets/committees/us_senate.svg',
    logoKey: 'us_senate',
    category: 'National Legislature',
    seatsCount: 100,
    defaultTopic: 'Confirmations, National Defense Authorization & Foreign Treaties',
    searchTags: ['senate', 'usa', 'united states', 'congress', 'capitol', 'upper house', 'tes', 'us senate'],
  },
  {
    name: 'United States House of Representatives',
    acronym: 'US House',
    emblem: '/assets/committees/us_house.svg',
    logoKey: 'us_house',
    category: 'National Legislature',
    seatsCount: 435,
    defaultTopic: 'Federal Budget Allocations, Taxation & Oversight of Government Agencies',
    searchTags: ['house', 'representatives', 'usa', 'congress', 'capitol', 'lower house'],
  },
  {
    name: 'United States Congress (Joint Session)',
    acronym: 'US Congress',
    emblem: '/assets/committees/us_senate.svg',
    logoKey: 'us_congress',
    category: 'National Legislature',
    seatsCount: 535,
    defaultTopic: 'State of the Union & Bicameral Legislative Directives',
    searchTags: ['congress', 'usa', 'bicameral', 'joint session'],
  },
  {
    name: 'UK House of Commons (British Parliament)',
    acronym: 'House of Commons',
    emblem: '/assets/committees/uk_parliament.svg',
    logoKey: 'house_of_commons',
    category: 'National Legislature',
    seatsCount: 650,
    defaultTopic: "Prime Minister's Questions (PMQs) & Economic Devolution",
    searchTags: ['uk', 'britain', 'westminster', 'parliament', 'commons', 'london'],
  },
  {
    name: 'UK House of Lords',
    acronym: 'House of Lords',
    emblem: '/assets/committees/uk_parliament.svg',
    logoKey: 'house_of_lords',
    category: 'National Legislature',
    seatsCount: 785,
    defaultTopic: 'Constitutional Revision & Legislative Scrutiny',
    searchTags: ['uk', 'lords', 'parliament', 'peers'],
  },
  {
    name: 'French Senate (Sénat de France)',
    acronym: 'Sénat France',
    emblem: '🏛️',
    logoKey: 'senat_france',
    category: 'National Legislature',
    seatsCount: 348,
    defaultTopic: 'Territorial Governance & European Sovereignty Directives',
    searchTags: ['france', 'senate', 'senat', 'paris', 'palais du luxembourg'],
  },
  {
    name: 'French National Assembly (Assemblée Nationale)',
    acronym: 'AN France',
    emblem: '🏛️',
    logoKey: 'assemblee_nationale',
    category: 'National Legislature',
    seatsCount: 577,
    defaultTopic: 'Social Security Financing & Nuclear Energy Renaissance',
    searchTags: ['france', 'assemblee', 'national assembly', 'palais bourbon'],
  },
  {
    name: 'German Bundestag (Federal Diet)',
    acronym: 'Bundestag',
    emblem: '🏛️',
    logoKey: 'bundestag',
    category: 'National Legislature',
    seatsCount: 736,
    defaultTopic: 'Zeitenwende Defense Modernization & Industrial Transition',
    searchTags: ['germany', 'bundestag', 'berlin', 'reichstag', 'deutschland'],
  },
  {
    name: 'German Bundesrat (Federal Council)',
    acronym: 'Bundesrat',
    emblem: '🏛️',
    logoKey: 'bundesrat',
    category: 'National Legislature',
    seatsCount: 69,
    defaultTopic: 'Länder Tax Administration & Federal Infrastructure Protocols',
    searchTags: ['germany', 'bundesrat', 'laender', 'states'],
  },
  {
    name: 'European Parliament',
    acronym: 'EU Parliament',
    emblem: '/assets/committees/eu.svg',
    logoKey: 'eu_parliament',
    category: 'Regional Bloc',
    seatsCount: 720,
    suggestedBundleId: 'eu',
    defaultTopic: 'Artificial Intelligence Act Implementation & Green Taxonomy',
    searchTags: ['eu', 'europe', 'strasbourg', 'brussels', 'european union'],
  },
  {
    name: 'Canadian House of Commons',
    acronym: 'Canada Commons',
    emblem: '🏛️',
    logoKey: 'canada_commons',
    category: 'National Legislature',
    seatsCount: 338,
    defaultTopic: 'Arctic Sovereignty, Resource Corridors & Housing Reform',
    searchTags: ['canada', 'ottawa', 'parliament', 'commons'],
  },
  {
    name: 'Australian Senate',
    acronym: 'Australia Senate',
    emblem: '🏛️',
    logoKey: 'australia_senate',
    category: 'National Legislature',
    seatsCount: 76,
    defaultTopic: 'Indo-Pacific Strategic Posture & Renewable Energy Transition',
    searchTags: ['australia', 'canberra', 'senate'],
  },
  {
    name: 'Australian House of Representatives',
    acronym: 'Australia House',
    emblem: '🏛️',
    logoKey: 'australia_house',
    category: 'National Legislature',
    seatsCount: 151,
    defaultTopic: 'Cost of Living Relief & National Reconstruction Fund',
    searchTags: ['australia', 'canberra', 'representatives'],
  },
  {
    name: 'Japanese National Diet (House of Representatives)',
    acronym: 'Diet Japan',
    emblem: '🏛️',
    logoKey: 'japan_diet',
    category: 'National Legislature',
    seatsCount: 465,
    defaultTopic: 'Semiconductor Supply Chains & Maritime Security in the East China Sea',
    searchTags: ['japan', 'tokyo', 'diet', 'shugiin'],
  },
  {
    name: 'Italian Senate of the Republic (Senato della Repubblica)',
    acronym: 'Senato IT',
    emblem: '🏛️',
    logoKey: 'senato_italia',
    category: 'National Legislature',
    seatsCount: 200,
    defaultTopic: 'Mattei Plan for Mediterranean Energy & Constitutional Reform',
    searchTags: ['italy', 'rome', 'senate', 'senato'],
  },
  {
    name: 'Spanish Congress of Deputies (Congreso de los Diputados)',
    acronym: 'Congreso ES',
    emblem: '🏛️',
    logoKey: 'congreso_spain',
    category: 'National Legislature',
    seatsCount: 350,
    defaultTopic: 'Regional Autonomy, Fiscal Pacts & Southern European Drought Response',
    searchTags: ['spain', 'madrid', 'congreso', 'cortes'],
  },
  {
    name: 'Knesset (Parliament of Israel)',
    acronym: 'Knesset',
    emblem: '🏛️',
    logoKey: 'knesset',
    category: 'National Legislature',
    seatsCount: 120,
    defaultTopic: 'National Defense Directives, Regional Normalization & Judicial Balance',
    searchTags: ['israel', 'jerusalem', 'knesset'],
  },
  {
    name: 'Russian State Duma (Federal Assembly)',
    acronym: 'State Duma',
    emblem: '🏛️',
    logoKey: 'state_duma',
    category: 'National Legislature',
    seatsCount: 450,
    defaultTopic: 'Sovereign Banking Frameworks & Eurasian Trade Integration',
    searchTags: ['russia', 'moscow', 'duma', 'parliament'],
  },
  {
    name: "National People's Congress of China (NPC Standing Committee)",
    acronym: 'NPC China',
    emblem: '🏛️',
    logoKey: 'npc_china',
    category: 'National Legislature',
    seatsCount: 175,
    defaultTopic: 'New Quality Productive Forces & High-Standard Belt and Road Initiatives',
    searchTags: ['china', 'beijing', 'npc', 'congress'],
  },
  {
    name: 'Federal Senate of Brazil (Senado Federal)',
    acronym: 'Senado BR',
    emblem: '🏛️',
    logoKey: 'senado_brazil',
    category: 'National Legislature',
    seatsCount: 81,
    defaultTopic: 'Amazon Bioeconomy Protection & South American Infrastructure',
    searchTags: ['brazil', 'brasilia', 'senate', 'senado'],
  },
  {
    name: 'South African National Assembly',
    acronym: 'SA Parliament',
    emblem: '🏛️',
    logoKey: 'sa_parliament',
    category: 'National Legislature',
    seatsCount: 400,
    defaultTopic: 'Government of National Unity (GNU) Priorities & Energy Grid Expansion',
    searchTags: ['south africa', 'cape town', 'parliament'],
  },

  // ── 2. UNITED NATIONS PRINCIPAL ORGANS & SPECIALIZED AGENCIES ──
  {
    name: 'UN Security Council',
    acronym: 'UNSC',
    emblem: '/assets/committees/un.svg',
    logoKey: 'unsc',
    category: 'UN',
    seatsCount: 15,
    suggestedBundleId: 'unsc_2026',
    defaultTopic: 'Non-Proliferation, Cyber Warfare & Maritime Security in Disputed Corridors',
    searchTags: ['unsc', 'security council', 'un', 'p5', 'veto', 'new york'],
  },
  {
    name: 'UN General Assembly Plenary',
    acronym: 'UNGA',
    emblem: '/assets/committees/un.svg',
    logoKey: 'unga',
    category: 'UN',
    seatsCount: 193,
    suggestedBundleId: 'g20',
    defaultTopic: 'Sustainable Development Goals 2030 & Global Multilateral Reform',
    searchTags: ['unga', 'general assembly', 'un', 'plenary', 'nations'],
  },
  {
    name: 'Disarmament and International Security Committee (GA1)',
    acronym: 'DISEC',
    emblem: '/assets/committees/un.svg',
    logoKey: 'disec',
    category: 'UN',
    seatsCount: 193,
    suggestedBundleId: 'g20',
    defaultTopic: 'Militarization of Artificial Intelligence, Hypersonic Weaponry & Autonomous Drones',
    searchTags: ['disec', 'disarmament', 'ga1', 'arms', 'security', 'un'],
  },
  {
    name: 'Economic and Financial Committee (GA2)',
    acronym: 'ECOFIN',
    emblem: '/assets/committees/un.svg',
    logoKey: 'ecofin',
    category: 'UN',
    seatsCount: 193,
    suggestedBundleId: 'g20',
    defaultTopic: 'Sovereign Debt Relief, International Tax Governance & De-Dollarization Trends',
    searchTags: ['ecofin', 'economy', 'finance', 'ga2', 'debt', 'tax'],
  },
  {
    name: 'Social, Humanitarian and Cultural Committee (GA3)',
    acronym: 'SOCHUM',
    emblem: '/assets/committees/un.svg',
    logoKey: 'sochum',
    category: 'UN',
    seatsCount: 193,
    suggestedBundleId: 'g20',
    defaultTopic: 'Protection of Vulnerable Populations in Conflict Zones & Freedom of Expression in Digital Spaces',
    searchTags: ['sochum', 'humanitarian', 'ga3', 'cultural', 'rights'],
  },
  {
    name: 'Special Political and Decolonization Committee (GA4)',
    acronym: 'SPECPOL',
    emblem: '/assets/committees/un.svg',
    logoKey: 'specpol',
    category: 'UN',
    seatsCount: 193,
    suggestedBundleId: 'g20',
    defaultTopic: 'Peacekeeping Mandates, Outer Space Resources & Non-Self-Governing Territories',
    searchTags: ['specpol', 'decolonization', 'ga4', 'peacekeeping', 'space'],
  },
  {
    name: 'Administrative and Budgetary Committee (GA5)',
    acronym: 'GA5 Budget',
    emblem: '/assets/committees/un.svg',
    logoKey: 'ga5',
    category: 'UN',
    seatsCount: 193,
    defaultTopic: 'Financing UN Peacekeeping Operations & Quota Scale Reforms',
    searchTags: ['ga5', 'budget', 'administrative', 'un'],
  },
  {
    name: 'Legal Committee (Sixth Committee / GA6)',
    acronym: 'GA6 Legal',
    emblem: '/assets/committees/un.svg',
    logoKey: 'ga6',
    category: 'UN',
    seatsCount: 193,
    defaultTopic: 'Universal Jurisdiction on Crimes Against Humanity & State Immunity Protocols',
    searchTags: ['ga6', 'legal', 'law', 'treaties', 'jurisdiction'],
  },
  {
    name: 'UN Human Rights Council',
    acronym: 'UNHRC',
    emblem: '/assets/committees/un.svg',
    logoKey: 'unhrc',
    category: 'UN',
    seatsCount: 47,
    suggestedBundleId: 'g20',
    defaultTopic: 'Protection of Journalists, Digital Privacy & Rights in Post-Conflict Reconciliation',
    searchTags: ['unhrc', 'human rights', 'geneva', 'hrc', 'rights'],
  },
  {
    name: 'Economic and Social Council',
    acronym: 'ECOSOC',
    emblem: '/assets/committees/un.svg',
    logoKey: 'ecosoc',
    category: 'UN',
    seatsCount: 54,
    defaultTopic: 'Global Food Security, Resilient Supply Chains & Green Industrial Policy',
    searchTags: ['ecosoc', 'economic', 'social', 'development'],
  },
  {
    name: 'International Court of Justice',
    acronym: 'ICJ',
    emblem: '/assets/committees/icj.svg',
    logoKey: 'icj',
    category: 'Specialized',
    seatsCount: 15,
    defaultTopic: 'Maritime Boundary Delimitation & State Compliance with Provisional Measures',
    searchTags: ['icj', 'court', 'hague', 'justice', 'judges', 'peace palace'],
  },
  {
    name: 'International Criminal Court',
    acronym: 'ICC',
    emblem: '⚖️',
    logoKey: 'icc',
    category: 'Specialized',
    seatsCount: 18,
    defaultTopic: 'Prosecution of War Crimes & Ecocide Recognition in International Criminal Law',
    searchTags: ['icc', 'rome statute', 'criminal court', 'hague'],
  },
  {
    name: 'International Atomic Energy Agency',
    acronym: 'IAEA',
    emblem: '/assets/committees/un.svg',
    logoKey: 'iaea',
    category: 'Specialized',
    seatsCount: 35,
    defaultTopic: 'Nuclear Safeguards in Conflict Zones & Small Modular Reactor (SMR) Proliferation Risk',
    searchTags: ['iaea', 'nuclear', 'vienna', 'atomic', 'safeguards'],
  },
  {
    name: 'World Health Organization',
    acronym: 'WHO',
    emblem: '/assets/committees/who.svg',
    logoKey: 'who',
    category: 'Specialized',
    seatsCount: 194,
    defaultTopic: 'Pandemic Preparedness Agreement, AMR Countermeasures & Global Vaccine Equity',
    searchTags: ['who', 'health', 'geneva', 'pandemic', 'vaccine'],
  },
  {
    name: 'UN Educational, Scientific and Cultural Organization',
    acronym: 'UNESCO',
    emblem: '/assets/committees/unesco.svg',
    logoKey: 'unesco',
    category: 'Specialized',
    seatsCount: 58,
    defaultTopic: 'Preservation of Endangered Heritage Sites & Ethical Governance of Generative AI',
    searchTags: ['unesco', 'culture', 'heritage', 'education', 'paris'],
  },
  {
    name: "UN Children's Fund",
    acronym: 'UNICEF',
    emblem: '/assets/committees/unicef.svg',
    logoKey: 'unicef',
    category: 'Specialized',
    seatsCount: 36,
    defaultTopic: 'Protection of Children in Armed Conflict & Eradication of Exploitative Child Labor',
    searchTags: ['unicef', 'children', 'youth', 'welfare'],
  },
  {
    name: 'UN Refugee Agency',
    acronym: 'UNHCR',
    emblem: '/assets/committees/un.svg',
    logoKey: 'unhcr',
    category: 'UN',
    seatsCount: 102,
    defaultTopic: 'Refugee Protection compacts & Climate-Induced Cross-Border Displacement',
    searchTags: ['unhcr', 'refugees', 'asylum', 'displacement'],
  },
  {
    name: 'UN Office on Drugs and Crime',
    acronym: 'UNODC',
    emblem: '/assets/committees/un.svg',
    logoKey: 'unodc',
    category: 'UN',
    seatsCount: 53,
    defaultTopic: 'Combating Transnational Synthetic Opioid Cartels & Dark Web Illicit Arms Trading',
    searchTags: ['unodc', 'drugs', 'crime', 'vienna', 'cartels'],
  },
  {
    name: 'UN Environment Programme',
    acronym: 'UNEP',
    emblem: '/assets/committees/unep.svg',
    logoKey: 'unep',
    category: 'Specialized',
    seatsCount: 193,
    defaultTopic: 'Legally Binding Treaty on Global Plastic Pollution & Biodiversity Corridors',
    searchTags: ['unep', 'environment', 'climate', 'nairobi', 'nature'],
  },
  {
    name: 'UN Development Programme',
    acronym: 'UNDP',
    emblem: '/assets/committees/un.svg',
    logoKey: 'undp',
    category: 'Specialized',
    seatsCount: 36,
    defaultTopic: 'Universal Digital Public Infrastructure (DPI) & Climate Adaptation Financing',
    searchTags: ['undp', 'development', 'poverty', 'infrastructure'],
  },
  {
    name: 'UN Commission on the Status of Women',
    acronym: 'UN CSW',
    emblem: '/assets/committees/un.svg',
    logoKey: 'csw',
    category: 'UN',
    seatsCount: 45,
    defaultTopic: 'Economic Empowerment of Women & Combating Gender-Based Cyber Violence',
    searchTags: ['csw', 'women', 'equality', 'gender'],
  },
  {
    name: 'Food and Agriculture Organization',
    acronym: 'FAO',
    emblem: '🌾',
    logoKey: 'fao',
    category: 'Specialized',
    seatsCount: 194,
    defaultTopic: 'Global Grain Corridors, Fertilizer Supply Chains & Agro-Ecological Innovations',
    searchTags: ['fao', 'food', 'agriculture', 'rome', 'crops'],
  },
  {
    name: 'World Trade Organization',
    acronym: 'WTO',
    emblem: '🌐',
    logoKey: 'wto',
    category: 'Specialized',
    seatsCount: 164,
    defaultTopic: 'Appellate Body Reformation, Critical Minerals Subsidies & Carbon Border Tariffs',
    searchTags: ['wto', 'trade', 'tariffs', 'geneva', 'commerce'],
  },
  {
    name: 'International Monetary Fund',
    acronym: 'IMF',
    emblem: '🏦',
    logoKey: 'imf',
    category: 'Specialized',
    seatsCount: 24,
    defaultTopic: 'Global Liquidity Facilities & Sovereign Debt Restructuring Mechanisms',
    searchTags: ['imf', 'monetary', 'currency', 'finance', 'washington'],
  },
  {
    name: 'International Maritime Organization',
    acronym: 'IMO',
    emblem: '⚓',
    logoKey: 'imo',
    category: 'Specialized',
    seatsCount: 40,
    defaultTopic: 'Decarbonization of Ocean Freight & Maritime Security in Chokepoints',
    searchTags: ['imo', 'maritime', 'shipping', 'oceans', 'london'],
  },
  {
    name: 'UN Framework Convention on Climate Change (COP)',
    acronym: 'UNFCCC COP',
    emblem: '/assets/committees/cop.svg',
    logoKey: 'cop',
    category: 'Specialized',
    seatsCount: 198,
    suggestedBundleId: 'g20',
    defaultTopic: 'Loss and Damage Fund Operationalization & Global Renewable Tripling Targets',
    searchTags: ['cop', 'unfccc', 'climate', 'paris agreement', 'emissions'],
  },
  {
    name: 'INTERPOL General Assembly',
    acronym: 'INTERPOL',
    emblem: '🛡️',
    logoKey: 'interpol',
    category: 'Specialized',
    seatsCount: 196,
    defaultTopic: 'Red Notice Review Mechanisms & Dismantling Cyber Ransomware Syndicates',
    searchTags: ['interpol', 'police', 'crime', 'lyon', 'red notice'],
  },

  // ── 3. REGIONAL ALLIANCES & MULTILATERAL SUMMITS ──
  {
    name: 'North Atlantic Council (NATO)',
    acronym: 'NATO',
    emblem: '/assets/committees/nato.svg',
    logoKey: 'nato',
    category: 'Regional Bloc',
    seatsCount: 32,
    suggestedBundleId: 'nato',
    defaultTopic: 'Article 5 Collective Defense Readiness, Eastern Flank Air Shield & Cyber Resilience',
    searchTags: ['nato', 'brussels', 'defense', 'alliance', 'article 5'],
  },
  {
    name: 'European Council (EU Leaders)',
    acronym: 'EU Council',
    emblem: '/assets/committees/eu.svg',
    logoKey: 'eu_council',
    category: 'Regional Bloc',
    seatsCount: 27,
    suggestedBundleId: 'eu',
    defaultTopic: 'Strategic Autonomy, Joint Defense Procurement & EU Enlargement Criteria',
    searchTags: ['eu', 'european council', 'leaders', 'brussels'],
  },
  {
    name: 'African Union Assembly',
    acronym: 'AU Assembly',
    emblem: '/assets/committees/au.svg',
    logoKey: 'au',
    category: 'Regional Bloc',
    seatsCount: 55,
    suggestedBundleId: 'au',
    defaultTopic: 'African Continental Free Trade Area (AfCFTA) & Silencing the Guns Initiative',
    searchTags: ['au', 'african union', 'addis ababa', 'africa'],
  },
  {
    name: 'African Union Peace and Security Council',
    acronym: 'AU PSC',
    emblem: '/assets/committees/au.svg',
    logoKey: 'au_psc',
    category: 'Regional Bloc',
    seatsCount: 15,
    defaultTopic: 'Counter-Terrorism Operations in the Sahel & Standby Force Deployment',
    searchTags: ['au psc', 'security', 'sahel', 'africa'],
  },
  {
    name: 'League of Arab States (Arab League)',
    acronym: 'Arab League',
    emblem: '/assets/committees/arab_league.svg',
    logoKey: 'arab_league',
    category: 'Regional Bloc',
    seatsCount: 22,
    suggestedBundleId: 'arab_league',
    defaultTopic: 'Joint Arab Security Strategy, Humanitarian Corridors & Regional Economic Integration',
    searchTags: ['arab league', 'cairo', 'middle east', 'arab'],
  },
  {
    name: 'Association of Southeast Asian Nations (ASEAN)',
    acronym: 'ASEAN ARF',
    emblem: '/assets/committees/asean.svg',
    logoKey: 'asean',
    category: 'Regional Bloc',
    seatsCount: 11,
    suggestedBundleId: 'asean',
    defaultTopic: 'South China Sea Code of Conduct & Digital Economy Framework Agreement',
    searchTags: ['asean', 'jakarta', 'southeast asia', 'arf'],
  },
  {
    name: 'Shanghai Cooperation Organisation Summit',
    acronym: 'SCO',
    emblem: '🌐',
    logoKey: 'sco',
    category: 'Regional Bloc',
    seatsCount: 10,
    suggestedBundleId: 'sco',
    defaultTopic: 'Regional Anti-Terrorist Structure (RATS) Coordination & National Currency Settlement',
    searchTags: ['sco', 'eurasia', 'beijing', 'security'],
  },
  {
    name: 'Gulf Cooperation Council (GCC)',
    acronym: 'GCC',
    emblem: '🌴',
    logoKey: 'gcc',
    category: 'Regional Bloc',
    seatsCount: 6,
    defaultTopic: 'Unified Customs Union, GCC Railway Network & Hydrogen Energy Hubs',
    searchTags: ['gcc', 'gulf', 'riyadh', 'arabian peninsula'],
  },
  {
    name: 'Organization of American States (OAS)',
    acronym: 'OAS',
    emblem: '🌎',
    logoKey: 'oas',
    category: 'Regional Bloc',
    seatsCount: 34,
    defaultTopic: 'Inter-American Democratic Charter Enforcement & Hemisphere Migration Compacts',
    searchTags: ['oas', 'americas', 'washington', 'latin america'],
  },
  {
    name: 'BRICS+ Leaders Summit',
    acronym: 'BRICS+',
    emblem: '/assets/committees/brics.svg',
    logoKey: 'brics',
    category: 'Regional Bloc',
    seatsCount: 10,
    suggestedBundleId: 'brics',
    defaultTopic: 'BRICS Pay Architecture, New Development Bank (NDB) Expansion & Multipolar Cooperation',
    searchTags: ['brics', 'emerging', 'multipolar', 'ndb'],
  },
  {
    name: 'Group of Twenty (G20 Leaders Summit)',
    acronym: 'G20',
    emblem: '/assets/committees/g20.svg',
    logoKey: 'g20',
    category: 'Regional Bloc',
    seatsCount: 20,
    suggestedBundleId: 'g20',
    defaultTopic: 'Multilateral Development Bank Reforms, Global Value Chains & AI Digital Compacts',
    searchTags: ['g20', 'summit', 'global economy', 'leaders'],
  },
  {
    name: 'Group of Seven (G7 Summit)',
    acronym: 'G7',
    emblem: '/assets/committees/g7.svg',
    logoKey: 'g7',
    category: 'Regional Bloc',
    seatsCount: 7,
    suggestedBundleId: 'g7',
    defaultTopic: 'Economic Resilience, Supply Chain De-risking & Semiconductor Alliances',
    searchTags: ['g7', 'advanced economies', 'summit', 'democracy'],
  },
  {
    name: 'Organization of the Petroleum Exporting Countries',
    acronym: 'OPEC',
    emblem: '/assets/committees/opec.svg',
    logoKey: 'opec',
    category: 'Regional Bloc',
    seatsCount: 12,
    suggestedBundleId: 'opec',
    defaultTopic: 'Crude Production Quotas, Upstream Refining Investments & Energy Transition Balance',
    searchTags: ['opec', 'oil', 'petroleum', 'vienna', 'energy'],
  },
  {
    name: 'South Asian Association for Regional Cooperation',
    acronym: 'SAARC',
    emblem: '🤝',
    logoKey: 'saarc',
    category: 'Regional Bloc',
    seatsCount: 8,
    suggestedBundleId: 'saarc',
    defaultTopic: 'Cross-Border Disaster Preparedness & South Asian Free Trade Agreement (SAFTA)',
    searchTags: ['saarc', 'south asia', 'kathmandu', 'regional'],
  },
  {
    name: 'BIMSTEC Summit',
    acronym: 'BIMSTEC',
    emblem: '🌊',
    logoKey: 'bimstec',
    category: 'Regional Bloc',
    seatsCount: 7,
    suggestedBundleId: 'bimstec',
    defaultTopic: 'Bay of Bengal Maritime Connectivity, Energy Grids & Counter-Terrorism Protocols',
    searchTags: ['bimstec', 'bay of bengal', 'dhaka', 'connectivity'],
  },
  {
    name: 'Commonwealth Heads of Government (CHOGM)',
    acronym: 'Commonwealth',
    emblem: '👑',
    logoKey: 'chogm',
    category: 'Regional Bloc',
    seatsCount: 56,
    defaultTopic: 'Small Island Developing States (SIDS) Resilience & Intra-Commonwealth Trade Advantage',
    searchTags: ['commonwealth', 'chogm', 'london', 'island nations'],
  },

  // ── 4. INDIAN PARLIAMENTARY, CONSTITUTIONAL & CRISIS BODIES ──
  {
    name: 'Lok Sabha (House of the People)',
    acronym: 'LOK SABHA',
    emblem: '/assets/committees/emblem_of_india.svg',
    logoKey: 'loksabha',
    isIndian: true,
    category: 'Indian Parliamentary',
    seatsCount: 543,
    suggestedBundleId: 'major_parties_in',
    defaultTopic: 'Delimitation of Constituencies, Federal Autonomy & Electoral Reforms',
    searchTags: ['lok sabha', 'india', 'parliament', 'sansad', 'new delhi', 'house of people'],
  },
  {
    name: 'Rajya Sabha (Council of States)',
    acronym: 'RAJYA SABHA',
    emblem: '/assets/committees/emblem_of_india.svg',
    logoKey: 'rajyasabha',
    isIndian: true,
    category: 'Indian Parliamentary',
    seatsCount: 245,
    suggestedBundleId: 'indian_states',
    defaultTopic: 'Fiscal Federalism, Centre-State Tax Sharing & Special Economic Zones',
    searchTags: ['rajya sabha', 'council of states', 'upper house', 'sansad', 'india'],
  },
  {
    name: 'All India Political Parties Meet',
    acronym: 'AIPPM',
    emblem: '🇮🇳',
    logoKey: 'aippm',
    isIndian: true,
    category: 'Indian Parliamentary',
    seatsCount: 45,
    suggestedBundleId: 'major_parties_in',
    defaultTopic: 'Simultaneous Elections (One Nation One Election) & Model Code of Conduct Revisions',
    searchTags: ['aippm', 'political parties', 'all india', 'coalition', 'election commission'],
  },
  {
    name: 'Cabinet Committee on Security (CCS)',
    acronym: 'CCS',
    emblem: '🛡️',
    logoKey: 'ccs',
    isIndian: true,
    category: 'Crisis',
    seatsCount: 10,
    suggestedBundleId: 'union_cabinet',
    defaultTopic: 'Northern Border Preparedness, Cyber Espionage & Defense Procurement Directives',
    searchTags: ['ccs', 'security', 'cabinet', 'pmo', 'mod', 'mea', 'mha', 'crisis'],
  },
  {
    name: 'Joint Parliamentary Committee',
    acronym: 'JPC',
    emblem: '🏛️',
    logoKey: 'jpc',
    isIndian: true,
    category: 'Indian Parliamentary',
    seatsCount: 30,
    defaultTopic: 'Data Protection Compliance, Digital Competition Bill & Corporate Monopolies',
    searchTags: ['jpc', 'parliamentary committee', 'sansad'],
  },
  {
    name: 'Constituent Assembly of India (1946)',
    acronym: 'CAI 1946',
    emblem: '📜',
    logoKey: 'cai',
    isIndian: true,
    category: 'Indian Parliamentary',
    seatsCount: 299,
    defaultTopic: 'Drafting of Fundamental Rights, Directive Principles & Federal Balance (1946-1949)',
    searchTags: ['constituent assembly', 'constitution', 'ambedkar', '1946', 'cai'],
  },
  {
    name: 'NITI Aayog Governing Council',
    acronym: 'NITI AAYOG',
    emblem: '📊',
    logoKey: 'nitiaayog',
    isIndian: true,
    category: 'Specialized',
    seatsCount: 36,
    suggestedBundleId: 'indian_states',
    defaultTopic: 'Competitive Federalism, State Capital Expenditure Incentives & Viksit Bharat 2047 Roadmap',
    searchTags: ['niti aayog', 'chief ministers', 'planning', 'policy', 'delhi'],
  },
  {
    name: 'National Security Council (NSC India)',
    acronym: 'NSC INDIA',
    emblem: '⚔️',
    logoKey: 'nsc',
    isIndian: true,
    category: 'Crisis',
    seatsCount: 15,
    suggestedBundleId: 'union_cabinet',
    defaultTopic: 'Integrated Theater Commands, Maritime Domain Awareness & Critical Infrastructure Defense',
    searchTags: ['nsc', 'nsa', 'security council', 'intelligence', 'raw', 'ib'],
  },
  {
    name: 'Delhi Legislative Assembly (Vidhan Sabha)',
    acronym: 'DELHI VIDHAN SABHA',
    emblem: '🏛️',
    logoKey: 'vidhansabha',
    isIndian: true,
    category: 'Indian Parliamentary',
    seatsCount: 70,
    defaultTopic: 'National Capital Territory Governance, Urban Air Quality & Municipal Fiscal Transfers',
    searchTags: ['delhi', 'vidhan sabha', 'assembly', 'nct'],
  },
  {
    name: 'Uttar Pradesh Legislative Assembly',
    acronym: 'UP VIDHAN SABHA',
    emblem: '🏛️',
    logoKey: 'up_vidhansabha',
    isIndian: true,
    category: 'Indian Parliamentary',
    seatsCount: 403,
    defaultTopic: 'Industrial Expressways, Agricultural Mandi Modernization & Law Enforcement Directives',
    searchTags: ['uttar pradesh', 'lucknow', 'up', 'assembly'],
  },
  {
    name: 'Maharashtra Legislative Assembly',
    acronym: 'MAHARASHTRA VIDHAN SABHA',
    emblem: '🏛️',
    logoKey: 'mh_vidhansabha',
    isIndian: true,
    category: 'Indian Parliamentary',
    seatsCount: 288,
    defaultTopic: 'Financial Capital Development, Coastal Road Infrastructure & Marathwada Water Grids',
    searchTags: ['maharashtra', 'mumbai', 'vidhan sabha'],
  },
  {
    name: 'Law Commission of India',
    acronym: 'LAW COMMISSION',
    emblem: '⚖️',
    logoKey: 'lawcommission',
    isIndian: true,
    category: 'Specialized',
    seatsCount: 12,
    defaultTopic: 'Uniform Civil Code (UCC) Consultation & Judicial Case-Pendency Remediation',
    searchTags: ['law commission', 'law', 'justice', 'ucc', 'legal reforms'],
  },
  {
    name: 'Indian War Cabinet (Indo-Pak Crisis)',
    acronym: 'WAR CABINET',
    emblem: '🎖️',
    logoKey: 'warcabinet',
    isIndian: true,
    category: 'Crisis',
    seatsCount: 12,
    suggestedBundleId: 'union_cabinet',
    defaultTopic: 'Strategic Escalation Management, Airspace Closure & Forward Border Deployments',
    searchTags: ['war cabinet', 'crisis', 'indo pak', 'defense', 'military'],
  },

  // ── 5. HISTORICAL, CRISIS & SPECIALIZED COMMITTEES ──
  {
    name: 'Historical Security Council 1962 (Cuban Missile Crisis)',
    acronym: 'HSC 1962',
    emblem: '/assets/committees/un.svg',
    logoKey: 'hsc_1962',
    category: 'Crisis',
    seatsCount: 11,
    defaultTopic: 'Naval Quarantine of Cuba & Nuclear De-escalation Negotiations',
    searchTags: ['hsc', '1962', 'cuban missile', 'kennedy', 'khrushchev', 'cold war'],
  },
  {
    name: 'Historical Security Council 1971 (Indo-Pakistan War)',
    acronym: 'HSC 1971',
    emblem: '/assets/committees/un.svg',
    logoKey: 'hsc_1971',
    category: 'Crisis',
    seatsCount: 15,
    defaultTopic: 'Ceasefire Directives, Bangladesh Liberation & Seventh Fleet Ingress',
    searchTags: ['hsc', '1971', 'bangladesh', 'indo pak', 'cold war', 'un'],
  },
  {
    name: 'Historical Security Council 1994 (Rwandan Crisis)',
    acronym: 'HSC 1994',
    emblem: '/assets/committees/un.svg',
    logoKey: 'hsc_1994',
    category: 'Crisis',
    seatsCount: 15,
    defaultTopic: 'UNAMIR Peacekeeping Mandate Revision & Prevention of Mass Atrocities',
    searchTags: ['hsc', '1994', 'rwanda', 'genocide', 'un'],
  },
  {
    name: 'Historical Security Council 2003 (Invasion of Iraq)',
    acronym: 'HSC 2003',
    emblem: '/assets/committees/un.svg',
    logoKey: 'hsc_2003',
    category: 'Crisis',
    seatsCount: 15,
    defaultTopic: 'Resolution 1441 Inspections, Weapons of Mass Destruction & Unilateral Military Intervention',
    searchTags: ['hsc', '2003', 'iraq', 'resolution 1441', 'wmd'],
  },
  {
    name: 'Continuous Crisis Committee',
    acronym: 'CCC',
    emblem: '🔥',
    logoKey: 'ccc',
    category: 'Crisis',
    seatsCount: 20,
    defaultTopic: 'Live Crisis Escalations, Covert Intelligence Directives & Realtime Direct Action',
    searchTags: ['ccc', 'crisis', 'continuous crisis', 'covert', 'directives'],
  },
  {
    name: 'Joint Crisis Committee (JCC Dual Room)',
    acronym: 'JCC',
    emblem: '⚡',
    logoKey: 'jcc',
    category: 'Crisis',
    seatsCount: 25,
    defaultTopic: 'Asymmetric Warfare, Espionage Networks & Cross-Table Directives',
    searchTags: ['jcc', 'joint crisis', 'dual room', 'war games'],
  },
  {
    name: 'White House Situation Room / US NSC',
    acronym: 'WH Situation Room',
    emblem: '/assets/committees/us_senate.svg',
    logoKey: 'wh_sitroom',
    category: 'Crisis',
    seatsCount: 16,
    defaultTopic: 'National Command Authority Directives & Critical Strategic Interventions',
    searchTags: ['situation room', 'white house', 'national security council', 'potus'],
  },
  {
    name: 'Soviet Politburo (1986 Cold War Crisis)',
    acronym: 'Politburo 1986',
    emblem: '☭',
    logoKey: 'politburo',
    category: 'Crisis',
    seatsCount: 14,
    defaultTopic: 'Chernobyl Disaster Response, Glasnost Reforms & Strategic Arms Reductions',
    searchTags: ['politburo', 'ussr', 'soviet', 'chernobyl', 'gorbachev'],
  },
  {
    name: 'Roman Senate (Ides of March 44 BC)',
    acronym: 'Roman Senate',
    emblem: '🦅',
    logoKey: 'roman_senate',
    category: 'Crisis',
    seatsCount: 30,
    defaultTopic: 'Preservation of the Republic, Dictatorial Powers of Caesar & Provincial Legions',
    searchTags: ['rome', 'roman senate', 'caesar', 'senatus', 'republic'],
  },
  {
    name: 'Ad-Hoc Committee of the Secretary-General',
    acronym: 'AHCSG',
    emblem: '🇺🇳',
    logoKey: 'ahcsg',
    category: 'Crisis',
    seatsCount: 18,
    defaultTopic: 'Emergency Diplomatic Missions, Mediation in Active Hotspots & High-Level Directives',
    searchTags: ['ahcsg', 'ad hoc', 'secretary general', 'un', 'crisis'],
  },
  {
    name: 'International Press Corps',
    acronym: 'IPC',
    emblem: '📰',
    logoKey: 'ip',
    category: 'Specialized',
    seatsCount: 25,
    defaultTopic: 'Investigative Journalism, Press Releases, Dais Press Conferences & Editorial Critiques',
    searchTags: ['ipc', 'international press', 'journalism', 'news', 'press corps'],
  },
];

export const QUICK_BLOC_BUNDLES: Array<{
  id: string;
  name: string;
  icon: string;
  count: number;
  category?: 'indian' | 'international';
  countries: Array<{ name: string; code: string; isP5?: boolean }>;
}> = [
  // ── INDIAN PARLIAMENTARY, POLITICAL & REGIONAL BUNDLES ──
  {
    id: 'nda_bloc',
    name: 'NDA Bloc',
    icon: '🇮🇳',
    count: 8,
    category: 'indian',
    countries: [
      { name: 'Bharatiya Janata Party (BJP)', code: 'in' },
      { name: 'Telugu Desam Party (TDP)', code: 'in' },
      { name: 'Janata Dal (United) - JD(U)', code: 'in' },
      { name: 'Shiv Sena (Shinde)', code: 'in' },
      { name: 'Lok Janshakti Party (Ram Vilas)', code: 'in' },
      { name: 'Jana Sena Party', code: 'in' },
      { name: 'Asom Gana Parishad (AGP)', code: 'in' },
      { name: 'Hindustani Awam Morcha (HAM)', code: 'in' },
    ],
  },
  {
    id: 'india_bloc',
    name: 'I.N.D.I.A. Bloc',
    icon: '🇮🇳',
    count: 10,
    category: 'indian',
    countries: [
      { name: 'Indian National Congress (INC)', code: 'in' },
      { name: 'Samajwadi Party (SP)', code: 'in' },
      { name: 'All India Trinamool Congress (TMC)', code: 'in' },
      { name: 'Dravida Munnetra Kazhagam (DMK)', code: 'in' },
      { name: 'Aam Aadmi Party (AAP)', code: 'in' },
      { name: 'Shiv Sena (UBT)', code: 'in' },
      { name: 'NCP (Sharadchandra Pawar)', code: 'in' },
      { name: 'Rashtriya Janata Dal (RJD)', code: 'in' },
      { name: 'Jharkhand Mukti Morcha (JMM)', code: 'in' },
      { name: 'Communist Party of India (Marxist)', code: 'in' },
    ],
  },
  {
    id: 'major_parties_in',
    name: 'Major Parties',
    icon: '🏛️',
    count: 12,
    category: 'indian',
    countries: [
      { name: 'Bharatiya Janata Party (BJP)', code: 'in' },
      { name: 'Indian National Congress (INC)', code: 'in' },
      { name: 'Samajwadi Party (SP)', code: 'in' },
      { name: 'All India Trinamool Congress (TMC)', code: 'in' },
      { name: 'Dravida Munnetra Kazhagam (DMK)', code: 'in' },
      { name: 'Telugu Desam Party (TDP)', code: 'in' },
      { name: 'Janata Dal (United)', code: 'in' },
      { name: 'Shiv Sena (UBT)', code: 'in' },
      { name: 'NCP (SP)', code: 'in' },
      { name: 'Shiv Sena', code: 'in' },
      { name: 'Aam Aadmi Party (AAP)', code: 'in' },
      { name: 'YSR Congress Party (YSRCP)', code: 'in' },
    ],
  },
  {
    id: 'union_cabinet',
    name: 'Union Cabinet',
    icon: '🛡️',
    count: 10,
    category: 'indian',
    countries: [
      { name: "Prime Minister's Office (PMO)", code: 'in' },
      { name: 'Ministry of Home Affairs (MHA)', code: 'in' },
      { name: 'Ministry of External Affairs (MEA)', code: 'in' },
      { name: 'Ministry of Defence (MoD)', code: 'in' },
      { name: 'Ministry of Finance (MoF)', code: 'in' },
      { name: 'Ministry of Law and Justice', code: 'in' },
      { name: 'Ministry of Commerce and Industry', code: 'in' },
      { name: 'Ministry of Railways', code: 'in' },
      { name: 'Ministry of Electronics & IT (MeitY)', code: 'in' },
      { name: 'National Security Advisor (NSA)', code: 'in' },
    ],
  },
  {
    id: 'indian_states',
    name: 'Indian States',
    icon: '🗺️',
    count: 16,
    category: 'indian',
    countries: [
      { name: 'Uttar Pradesh', code: 'in' },
      { name: 'Maharashtra', code: 'in' },
      { name: 'Bihar', code: 'in' },
      { name: 'West Bengal', code: 'in' },
      { name: 'Madhya Pradesh', code: 'in' },
      { name: 'Tamil Nadu', code: 'in' },
      { name: 'Rajasthan', code: 'in' },
      { name: 'Gujarat', code: 'in' },
      { name: 'Karnataka', code: 'in' },
      { name: 'Andhra Pradesh', code: 'in' },
      { name: 'Odisha', code: 'in' },
      { name: 'Kerala', code: 'in' },
      { name: 'Telangana', code: 'in' },
      { name: 'Punjab', code: 'in' },
      { name: 'Assam', code: 'in' },
      { name: 'Jammu & Kashmir', code: 'in' },
    ],
  },
  {
    id: 'quad',
    name: 'QUAD',
    icon: '⚓',
    count: 4,
    category: 'indian',
    countries: [
      { name: 'India', code: 'in' },
      { name: 'United States', code: 'us', isP5: true },
      { name: 'Japan', code: 'jp' },
      { name: 'Australia', code: 'au' },
    ],
  },
  {
    id: 'sco',
    name: 'SCO',
    icon: '🌐',
    count: 10,
    category: 'indian',
    countries: [
      { name: 'India', code: 'in' },
      { name: 'China', code: 'cn', isP5: true },
      { name: 'Russia', code: 'ru', isP5: true },
      { name: 'Pakistan', code: 'pk' },
      { name: 'Kazakhstan', code: 'kz' },
      { name: 'Kyrgyzstan', code: 'kg' },
      { name: 'Tajikistan', code: 'tj' },
      { name: 'Uzbekistan', code: 'uz' },
      { name: 'Iran', code: 'ir' },
      { name: 'Belarus', code: 'by' },
    ],
  },
  {
    id: 'saarc',
    name: 'SAARC',
    icon: '🤝',
    count: 8,
    category: 'indian',
    countries: [
      { name: 'India', code: 'in' },
      { name: 'Pakistan', code: 'pk' },
      { name: 'Bangladesh', code: 'bd' },
      { name: 'Sri Lanka', code: 'lk' },
      { name: 'Nepal', code: 'np' },
      { name: 'Bhutan', code: 'bt' },
      { name: 'Maldives', code: 'mv' },
      { name: 'Afghanistan', code: 'af' },
    ],
  },
  {
    id: 'bimstec',
    name: 'BIMSTEC',
    icon: '🌊',
    count: 7,
    category: 'indian',
    countries: [
      { name: 'India', code: 'in' },
      { name: 'Bangladesh', code: 'bd' },
      { name: 'Bhutan', code: 'bt' },
      { name: 'Myanmar', code: 'mm' },
      { name: 'Nepal', code: 'np' },
      { name: 'Sri Lanka', code: 'lk' },
      { name: 'Thailand', code: 'th' },
    ],
  },
  {
    id: 'i2u2',
    name: 'I2U2',
    icon: '⚡',
    count: 4,
    category: 'indian',
    countries: [
      { name: 'India', code: 'in' },
      { name: 'Israel', code: 'il' },
      { name: 'United Arab Emirates', code: 'ae' },
      { name: 'United States', code: 'us', isP5: true },
    ],
  },

  // ── INTERNATIONAL MULTILATERAL BUNDLES ──
  {
    id: 'p5',
    name: 'P5',
    icon: '🇺🇳',
    count: 5,
    category: 'international',
    countries: [
      { name: 'United States', code: 'us', isP5: true },
      { name: 'United Kingdom', code: 'gb', isP5: true },
      { name: 'France', code: 'fr', isP5: true },
      { name: 'Russia', code: 'ru', isP5: true },
      { name: 'China', code: 'cn', isP5: true },
    ],
  },
  {
    id: 'g7',
    category: 'international',
    name: 'G7',
    icon: '🌐',
    count: 7,
    countries: [
      { name: 'United States', code: 'us', isP5: true },
      { name: 'United Kingdom', code: 'gb', isP5: true },
      { name: 'France', code: 'fr', isP5: true },
      { name: 'Germany', code: 'de' },
      { name: 'Japan', code: 'jp' },
      { name: 'Italy', code: 'it' },
      { name: 'Canada', code: 'ca' },
    ],
  },
  {
    id: 'brics',
    category: 'international',
    name: 'BRICS+',
    icon: '🌐',
    count: 10,
    countries: [
      { name: 'Brazil', code: 'br' },
      { name: 'Russia', code: 'ru', isP5: true },
      { name: 'India', code: 'in' },
      { name: 'China', code: 'cn', isP5: true },
      { name: 'South Africa', code: 'za' },
      { name: 'Egypt', code: 'eg' },
      { name: 'Ethiopia', code: 'et' },
      { name: 'Iran', code: 'ir' },
      { name: 'Saudi Arabia', code: 'sa' },
      { name: 'United Arab Emirates', code: 'ae' },
    ],
  },
  {
    id: 'g20',
    category: 'international',
    name: 'G20',
    icon: '🌐',
    count: 19,
    countries: [
      { name: 'Argentina', code: 'ar' },
      { name: 'Australia', code: 'au' },
      { name: 'Brazil', code: 'br' },
      { name: 'Canada', code: 'ca' },
      { name: 'China', code: 'cn', isP5: true },
      { name: 'France', code: 'fr', isP5: true },
      { name: 'Germany', code: 'de' },
      { name: 'India', code: 'in' },
      { name: 'Indonesia', code: 'id' },
      { name: 'Italy', code: 'it' },
      { name: 'Japan', code: 'jp' },
      { name: 'Mexico', code: 'mx' },
      { name: 'Russia', code: 'ru', isP5: true },
      { name: 'Saudi Arabia', code: 'sa' },
      { name: 'South Africa', code: 'za' },
      { name: 'South Korea', code: 'kr' },
      { name: 'Turkey', code: 'tr' },
      { name: 'United Kingdom', code: 'gb', isP5: true },
      { name: 'United States', code: 'us', isP5: true },
    ],
  },
  {
    id: 'eu',
    category: 'international',
    name: 'EU',
    icon: '🇪🇺',
    count: 27,
    countries: [
      { name: 'Austria', code: 'at' }, { name: 'Belgium', code: 'be' }, { name: 'Bulgaria', code: 'bg' },
      { name: 'Croatia', code: 'hr' }, { name: 'Cyprus', code: 'cy' }, { name: 'Czech Republic', code: 'cz' },
      { name: 'Denmark', code: 'dk' }, { name: 'Estonia', code: 'ee' }, { name: 'Finland', code: 'fi' },
      { name: 'France', code: 'fr', isP5: true }, { name: 'Germany', code: 'de' }, { name: 'Greece', code: 'gr' },
      { name: 'Hungary', code: 'hu' }, { name: 'Ireland', code: 'ie' }, { name: 'Italy', code: 'it' },
      { name: 'Latvia', code: 'lv' }, { name: 'Lithuania', code: 'lt' }, { name: 'Luxembourg', code: 'lu' },
      { name: 'Malta', code: 'mt' }, { name: 'Netherlands', code: 'nl' }, { name: 'Poland', code: 'pl' },
      { name: 'Portugal', code: 'pt' }, { name: 'Romania', code: 'ro' }, { name: 'Slovakia', code: 'sk' },
      { name: 'Slovenia', code: 'si' }, { name: 'Spain', code: 'es' }, { name: 'Sweden', code: 'se' },
    ],
  },
  {
    id: 'nato',
    category: 'international',
    name: 'NATO',
    icon: '🧭',
    count: 32,
    countries: [
      { name: 'Albania', code: 'al' }, { name: 'Belgium', code: 'be' }, { name: 'Bulgaria', code: 'bg' },
      { name: 'Canada', code: 'ca' }, { name: 'Croatia', code: 'hr' }, { name: 'Czech Republic', code: 'cz' },
      { name: 'Denmark', code: 'dk' }, { name: 'Estonia', code: 'ee' }, { name: 'Finland', code: 'fi' },
      { name: 'France', code: 'fr', isP5: true }, { name: 'Germany', code: 'de' }, { name: 'Greece', code: 'gr' },
      { name: 'Hungary', code: 'hu' }, { name: 'Iceland', code: 'is' }, { name: 'Italy', code: 'it' },
      { name: 'Latvia', code: 'lv' }, { name: 'Lithuania', code: 'lt' }, { name: 'Luxembourg', code: 'lu' },
      { name: 'Montenegro', code: 'me' }, { name: 'Netherlands', code: 'nl' }, { name: 'North Macedonia', code: 'mk' },
      { name: 'Norway', code: 'no' }, { name: 'Poland', code: 'pl' }, { name: 'Portugal', code: 'pt' },
      { name: 'Romania', code: 'ro' }, { name: 'Slovakia', code: 'sk' }, { name: 'Slovenia', code: 'si' },
      { name: 'Spain', code: 'es' }, { name: 'Sweden', code: 'se' }, { name: 'Turkey', code: 'tr' },
      { name: 'United Kingdom', code: 'gb', isP5: true }, { name: 'United States', code: 'us', isP5: true },
    ],
  },
  {
    id: 'asean',
    category: 'international',
    name: 'ASEAN',
    icon: '🌾',
    count: 11,
    countries: [
      { name: 'Brunei', code: 'bn' }, { name: 'Cambodia', code: 'kh' }, { name: 'Indonesia', code: 'id' },
      { name: 'Laos', code: 'la' }, { name: 'Malaysia', code: 'my' }, { name: 'Myanmar', code: 'mm' },
      { name: 'Philippines', code: 'ph' }, { name: 'Singapore', code: 'sg' }, { name: 'Thailand', code: 'th' },
      { name: 'Vietnam', code: 'vn' }, { name: 'Timor-Leste', code: 'tl' },
    ],
  },
  {
    id: 'unsc2026',
    category: 'international',
    name: 'UNSC 2026',
    icon: '🇺🇳',
    count: 15,
    countries: [
      { name: 'United States', code: 'us', isP5: true },
      { name: 'United Kingdom', code: 'gb', isP5: true },
      { name: 'France', code: 'fr', isP5: true },
      { name: 'Russia', code: 'ru', isP5: true },
      { name: 'China', code: 'cn', isP5: true },
      { name: 'Algeria', code: 'dz' },
      { name: 'Guyana', code: 'gy' },
      { name: 'South Korea', code: 'kr' },
      { name: 'Sierra Leone', code: 'sl' },
      { name: 'Slovenia', code: 'si' },
      { name: 'Denmark', code: 'dk' },
      { name: 'Greece', code: 'gr' },
      { name: 'Pakistan', code: 'pk' },
      { name: 'Panama', code: 'pa' },
      { name: 'Somalia', code: 'so' },
    ],
  },
  {
    id: 'au',
    category: 'international',
    name: 'AU',
    icon: '🌍',
    count: 55,
    countries: [
      { name: 'Algeria', code: 'dz' }, { name: 'Angola', code: 'ao' }, { name: 'Benin', code: 'bj' },
      { name: 'Botswana', code: 'bw' }, { name: 'Burkina Faso', code: 'bf' }, { name: 'Burundi', code: 'bi' },
      { name: 'Cameroon', code: 'cm' }, { name: 'Cape Verde', code: 'cv' }, { name: 'Central African Republic', code: 'cf' },
      { name: 'Chad', code: 'td' }, { name: 'Comoros', code: 'km' }, { name: 'Congo', code: 'cg' },
      { name: 'DR Congo', code: 'cd' }, { name: 'Djibouti', code: 'dj' }, { name: 'Egypt', code: 'eg' },
      { name: 'Equatorial Guinea', code: 'gq' }, { name: 'Eritrea', code: 'er' }, { name: 'Eswatini', code: 'sz' },
      { name: 'Ethiopia', code: 'et' }, { name: 'Gabon', code: 'ga' }, { name: 'Gambia', code: 'gm' },
      { name: 'Ghana', code: 'gh' }, { name: 'Guinea', code: 'gn' }, { name: 'Guinea-Bissau', code: 'gw' },
      { name: 'Ivory Coast', code: 'ci' }, { name: 'Kenya', code: 'ke' }, { name: 'Lesotho', code: 'ls' },
      { name: 'Liberia', code: 'lr' }, { name: 'Libya', code: 'ly' }, { name: 'Madagascar', code: 'mg' },
      { name: 'Malawi', code: 'mw' }, { name: 'Mali', code: 'ml' }, { name: 'Mauritania', code: 'mr' },
      { name: 'Mauritius', code: 'mu' }, { name: 'Morocco', code: 'ma' }, { name: 'Mozambique', code: 'mz' },
      { name: 'Namibia', code: 'na' }, { name: 'Niger', code: 'ne' }, { name: 'Nigeria', code: 'ng' },
      { name: 'Rwanda', code: 'rw' }, { name: 'Sao Tome and Principe', code: 'st' }, { name: 'Senegal', code: 'sn' },
      { name: 'Seychelles', code: 'sc' }, { name: 'Sierra Leone', code: 'sl' }, { name: 'Somalia', code: 'so' },
      { name: 'South Africa', code: 'za' }, { name: 'South Sudan', code: 'ss' }, { name: 'Sudan', code: 'sd' },
      { name: 'Tanzania', code: 'tz' }, { name: 'Togo', code: 'tg' }, { name: 'Tunisia', code: 'tn' },
      { name: 'Uganda', code: 'ug' }, { name: 'Zambia', code: 'zm' }, { name: 'Zimbabwe', code: 'zw' },
    ],
  },
  {
    id: 'opec',
    category: 'international',
    name: 'OPEC',
    icon: '🛢️',
    count: 12,
    countries: [
      { name: 'Algeria', code: 'dz' }, { name: 'Congo', code: 'cg' }, { name: 'Equatorial Guinea', code: 'gq' },
      { name: 'Gabon', code: 'ga' }, { name: 'Iran', code: 'ir' }, { name: 'Iraq', code: 'iq' },
      { name: 'Kuwait', code: 'kw' }, { name: 'Libya', code: 'ly' }, { name: 'Nigeria', code: 'ng' },
      { name: 'Saudi Arabia', code: 'sa' }, { name: 'United Arab Emirates', code: 'ae' }, { name: 'Venezuela', code: 've' },
    ],
  },
  {
    id: 'arab_league',
    category: 'international',
    name: 'Arab League',
    icon: '🌙',
    count: 22,
    countries: [
      { name: 'Algeria', code: 'dz' }, { name: 'Bahrain', code: 'bh' }, { name: 'Comoros', code: 'km' },
      { name: 'Djibouti', code: 'dj' }, { name: 'Egypt', code: 'eg' }, { name: 'Iraq', code: 'iq' },
      { name: 'Jordan', code: 'jo' }, { name: 'Kuwait', code: 'kw' }, { name: 'Lebanon', code: 'lb' },
      { name: 'Libya', code: 'ly' }, { name: 'Mauritania', code: 'mr' }, { name: 'Morocco', code: 'ma' },
      { name: 'Oman', code: 'om' }, { name: 'Palestine', code: 'ps' }, { name: 'Qatar', code: 'qa' },
      { name: 'Saudi Arabia', code: 'sa' }, { name: 'Somalia', code: 'so' }, { name: 'Sudan', code: 'sd' },
      { name: 'Syria', code: 'sy' }, { name: 'Tunisia', code: 'tn' }, { name: 'United Arab Emirates', code: 'ae' },
      { name: 'Yemen', code: 'ye' },
    ],
  },
];

export interface TutorialStepDef {
  step: number;
  title: string;
  text: string;
  targets: string[];
  highlightWords: string[];
  actionLabel?: string;
}

export const TUTORIAL_STEPS_CONTENT: TutorialStepDef[] = [
  {
    step: 1,
    title: 'Welcome to your committee room',
    text: 'Welcome to your committee room. Speakers, timers, voting, motions, chat, documents, all bundled in one place, built to run your entire MUN session from the first gavel to the last.',
    targets: ['tutorial-target-nav', 'tutorial-target-sidebar'],
    highlightWords: ['committee room', 'Speakers', 'timers', 'voting', 'motions', 'chat', 'documents', 'entire MUN session'],
  },
  {
    step: 2,
    title: 'Active Committee & Topic',
    text: 'At top-left is your active committee and topic. You can click the pencil icon to edit the topic anytime.',
    targets: ['tutorial-target-topic'],
    highlightWords: ['active committee', 'topic', 'pencil icon'],
  },
  {
    step: 3,
    title: 'Adding Delegates',
    text: 'This bar is how you add delegates to the speakers list. Type any country name and press Enter.',
    targets: ['tutorial-target-bottom-bar'],
    highlightWords: ['add delegates', 'country name', 'Enter'],
  },
  {
    step: 4,
    title: 'Speakers List',
    text: 'Add any 3 countries to the speakers list: use the input bar below or click delegates in the sidebar. Both work!',
    targets: ['tutorial-target-bottom-bar', 'tutorial-target-sidebar'],
    highlightWords: ['input bar', 'sidebar'],
    actionLabel: 'Skip >',
  },
  {
    step: 5,
    title: 'Start Speaking',
    text: 'The top of the list is already standing on the floor, clock set and waiting. Press START to give them the floor and run the timer.',
    targets: ['tutorial-target-start-btn'],
    highlightWords: ['START', 'timer'],
  },
  {
    step: 6,
    title: 'Countdown Clock',
    text: 'The speaking timer counts down for the current delegate. It turns amber for the last 10 seconds. Click the clock itself to start or pause it, exactly like the button.',
    targets: ['tutorial-target-clock'],
    highlightWords: ['clock', 'start or pause'],
  },
  {
    step: 7,
    title: 'Add Time & Reset',
    text: 'Need to grant more time? Add time (the clock icon) adds 15 / 30 / 60 seconds, or any amount you type. It also works before you press Start. The ↺ in the same row restarts the clock at the full speaking time.',
    targets: ['tutorial-target-add-time', 'tutorial-target-reset-btn'],
    highlightWords: ['Add time', 'clock icon', '↺ in the same row'],
  },
  {
    step: 8,
    title: 'Next Speaker',
    text: 'When the delegate finishes, click NEXT to move to the next speaker. This automatically logs their speaking time and awards points.',
    targets: ['tutorial-target-next-btn'],
    highlightWords: ['NEXT', 'points'],
  },
  {
    step: 9,
    title: 'Yielding the Floor',
    text: 'If a speaker finishes early, they can yield. Drag the Yield card or click Yield to pass remaining time to the next speaker or another delegation.',
    targets: ['tutorial-target-yield-box'],
    highlightWords: ['Yield', 'Yield card'],
  },
  {
    step: 10,
    title: 'Right to Reply (RTR)',
    text: 'Right to Reply gives an accused delegate a separate timer to answer. It never touches the speakers list, so nobody loses their place in the queue.',
    targets: ['tutorial-target-rtr'],
    highlightWords: ['Right to Reply', 'separate timer'],
  },
  {
    step: 11,
    title: 'Roll Call Attendance',
    text: 'Roll Call: click here to mark each delegate as Absent, Present, or Present & Voting. You can update attendance at any point during the session.',
    targets: ['tutorial-target-rollcall-tab'],
    highlightWords: ['Roll Call', 'Absent', 'Present', 'Present & Voting'],
  },
  {
    step: 12,
    title: 'Quorum & Add a Seat',
    text: 'Somebody missing from the roster? The small Add a seat box beside the quorum dials takes any country or delegate name you type.',
    targets: ['tutorial-target-quorum-gauges'],
    highlightWords: ['Add a seat', 'quorum dials'],
  },
  {
    step: 13,
    title: 'Motions & Caucuses',
    text: 'Motions: when a delegate raises their placard, you key the motion in here and pick who proposed it: Moderated Caucus, Unmoderated, Tour de Table, or Consultation of the Whole. Suspend and close debate live here too.',
    targets: ['tutorial-target-motions-tab'],
    highlightWords: ['Motions', 'Moderated Caucus', 'Unmoderated', 'Tour de Table', 'Consultation of the Whole'],
  },
  {
    step: 14,
    title: 'Documents & Resolutions',
    text: 'Documents: Working Papers and Draft Resolutions submitted by delegates land here. Introduce runs the Reading, Presentation and Q&A stages; Draft Resolutions go to substantive roll-call voting.',
    targets: ['tutorial-target-documents-tab'],
    highlightWords: ['Documents', 'Working Papers', 'Draft Resolutions', 'Introduce', 'substantive roll-call voting'],
  },
  {
    step: 15,
    title: 'Chat & Broadcast',
    text: 'Chat: message all delegates at once or DM individuals. We recommend keeping this open on your personal device rather than the main committee screen.',
    targets: ['tutorial-target-chat-btn'],
    highlightWords: ['Chat'],
  },
  {
    step: 16,
    title: 'Live Scoreboard',
    text: 'Every delegation, ranked live. Open it any time from the trophy icon, drill into a delegation to see exactly where each point came from, or hit Export CSV for the whole ledger.',
    targets: ['tutorial-target-scoreboard-btn'],
    highlightWords: ['Scoreboard', 'trophy icon', 'Export CSV'],
  },
  {
    step: 17,
    title: 'Session Code & Projection',
    text: 'Your committee broadcast code. Click it to project the session room code and QR overlay to the entire dais hall. Delegates scan the QR or enter the code at zenvitra.xyz to sync their live committee portal in real time.',
    targets: ['tutorial-target-session-code'],
    highlightWords: ['session code', 'QR code'],
  },
];
