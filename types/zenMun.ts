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

export const PRESET_COMMITTEES = [
  { name: 'UN Human Rights Council', acronym: 'UNHRC', emblem: '🇺🇳', logoKey: 'unhrc' },
  { name: 'UN Refugee Agency', acronym: 'UNHCR', emblem: '🇺🇳', logoKey: 'unhcr' },
  { name: 'UN Security Council', acronym: 'UNSC', emblem: '🇺🇳', logoKey: 'unsc' },
  { name: 'Disarmament and International Security Committee', acronym: 'DISEC', emblem: '🇺🇳', logoKey: 'disec' },
  { name: 'Economic and Social Council', acronym: 'ECOSOC', emblem: '🇺🇳', logoKey: 'ecosoc' },
  { name: 'World Health Organization', acronym: 'WHO', emblem: '🇺🇳', logoKey: 'who' },
  { name: 'Lok Sabha', acronym: 'LOK SABHA', emblem: '🏛️', logoKey: 'loksabha', isIndian: true },
  { name: 'All India Political Parties Meet', acronym: 'AIPPM', emblem: '🏛️', logoKey: 'aippm', isIndian: true },
  { name: 'UN Women', acronym: 'UNW', emblem: '🇺🇳', logoKey: 'unw' },
  { name: 'International Press', acronym: 'IP', emblem: '📰', logoKey: 'ip' },
];

export const QUICK_BLOC_BUNDLES: Array<{
  id: string;
  name: string;
  icon: string;
  count: number;
  countries: Array<{ name: string; code: string; isP5?: boolean }>;
}> = [
  {
    id: 'p5',
    name: 'P5',
    icon: '🇺🇳',
    count: 5,
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

export const DEMO_DEFAULT_DELEGATES: ZenDelegate[] = [
  { id: 'del-bh', name: 'Bahrain', countryCode: 'bh', role: 'member', attendance: 'present' },
  { id: 'del-cn', name: 'China', countryCode: 'cn', role: 'member', attendance: 'present', isP5: true },
  { id: 'del-co', name: 'Colombia', countryCode: 'co', role: 'member', attendance: 'present' },
  { id: 'del-dk', name: 'Denmark', countryCode: 'dk', role: 'member', attendance: 'present' },
  { id: 'del-cd', name: 'DR Congo', countryCode: 'cd', role: 'member', attendance: 'present' },
  { id: 'del-fr', name: 'France', countryCode: 'fr', role: 'member', attendance: 'present', isP5: true },
  { id: 'del-gr', name: 'Greece', countryCode: 'gr', role: 'member', attendance: 'present' },
  { id: 'del-lv', name: 'Latvia', countryCode: 'lv', role: 'member', attendance: 'present' },
  { id: 'del-lr', name: 'Liberia', countryCode: 'lr', role: 'member', attendance: 'present' },
  { id: 'del-pk', name: 'Pakistan', countryCode: 'pk', role: 'member', attendance: 'present' },
  { id: 'del-pa', name: 'Panama', countryCode: 'pa', role: 'member', attendance: 'present' },
  { id: 'del-ru', name: 'Russia', countryCode: 'ru', role: 'member', attendance: 'present', isP5: true },
  { id: 'del-so', name: 'Somalia', countryCode: 'so', role: 'member', attendance: 'present' },
  { id: 'del-gb', name: 'United Kingdom', countryCode: 'gb', role: 'member', attendance: 'present', isP5: true },
  { id: 'del-us', name: 'United States', countryCode: 'us', role: 'member', attendance: 'present', isP5: true },
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
