export type PulseView = 
  | 'feed' 
  | 'flux' 
  | 'compose' 
  | 'create-flux' 
  | 'post-detail' 
  | 'profile' 
  | 'discover' 
  | 'liked'
  | 'redline-studio'
  | 'floor-transceiver'
  | 'passport-dossier'
  | 'revenue-simulator';

export interface StoryViewer {
  userId: string;
  name: string;
  username: string;
  viewedAt: string;
  liked?: boolean;
}

export interface PulseStory {
  id: string;
  authorId: string;
  authorName: string;
  authorUsername: string;
  avatarLetter: string;
  color: string;
  title: string;
  image?: string;
  videoUrl?: string;
  time: string;
  createdAt: string;
  isLive?: boolean;
  viewers: StoryViewer[];
  linkUrl?: string;
  linkText?: string;
  fontStyle?: string;
  effectStyle?: string;
  textHighlight?: boolean;
  stickers?: string[];
  audioTitle?: string;
  songTitle?: string;
  songArtist?: string;
  songAudioUrl?: string;
  /* ZEN.GLIMPSE SNAP BRANDING */
  isSnap?: boolean;
  snapFilter?: string;
  snapLocation?: string;
  snapTimestamp?: string;
}

/* ─────────── PILLAR 1: LEGISLATIVE & TREATY TYPES ─────────── */

export type RationaleTag = 
  | 'LEGAL_PRECEDENT' 
  | 'BUDGETARY_PRUDENCE' 
  | 'SECURITY_COUNCIL_MANDATE' 
  | 'HUMAN_RIGHTS' 
  | 'EDITORIAL' 
  | 'DIPLOMATIC_AMENDMENT';

export interface LegislativeDiff {
  id: string;
  postId: string;
  authorId: string;
  authorName: string;
  authorUsername: string;
  originalSnippet: string;
  modifiedSnippet: string;
  rationaleTag: RationaleTag;
  rationaleNote: string;
  challengerClearanceLevel: number;
  status: 'pending' | 'ratified' | 'rejected';
  createdAt: string;
  ratifiedAt?: string;
  rejectionReason?: string;
}

export interface TreatyRevision {
  version: string;
  timestamp: string;
  ratifiedByName: string;
  diffSummary: string;
  fullContent: string;
}

export interface RollCallVotes {
  ayes: string[];
  nays: string[];
  abstains: string[];
}

export interface TreatyCoSignature {
  userId: string;
  name: string;
  username: string;
  caucus: string; // e.g. 'G-77 Coalition', 'Permanent Secretariat', 'Youth Plenary'
  clearanceLevel: number;
  timestamp: string;
}

/* ─────────── PILLAR 2: PROOF-OF-CITATION TYPES ─────────── */

export type CitationType = 
  | 'UN_DOC' 
  | 'ARXIV' 
  | 'COURT_DOCKET' 
  | 'IPCC_SYNTHESIS' 
  | 'GAZETTE' 
  | 'TREATY_RECORD'
  | 'NATIONAL_NEWSPAPER'
  | 'PARLIAMENTARY_BROADCAST'
  | 'INVESTIGATIVE_MEDIA'
  | 'CONSTITUENT_ASSEMBLY';

export interface ProofCitation {
  id: string;
  symbolOrId: string; // e.g. 'A/RES/78/230', 'arXiv:2403.12345', 'ICJ-2024-02'
  type: CitationType;
  title: string;
  institution: string;
  archiveUrl: string;
  sha256Hash: string;
  verifiedCount: number;
  verifiedBy: string[];
}

export interface FactBountyChallenge {
  id: string;
  postId: string;
  challengerId: string;
  challengerName: string;
  challengerUsername: string;
  stakedPoints: number;
  premiseTarget: string;
  rationale: string;
  deadline: string; // 24h ISO window
  status: 'open' | 'author_verified' | 'author_forfeited';
  resolutionNote?: string;
}

/* ─────────── PILLAR 3: DIPLOMATIC FLOOR RELAY TYPES ─────────── */

export interface PoiIntervention {
  id: string;
  authorId: string;
  authorName: string;
  authorUsername: string;
  timestampAnchorSeconds: number;
  audioUrl?: string;
  textNote: string;
  createdAt: string;
}

export interface FloorAudioDispatch {
  id: string;
  audioUrl?: string;
  videoUrl?: string;
  speechType?: 'audio' | 'video';
  durationSeconds: number;
  waveform?: number[];
  yieldTarget?: string; // 'Chair' | 'Delegate of France' | 'Plenary Floor'
  pois?: PoiIntervention[];
  transcript?: string;
  delegationName?: string;
}

export interface SpeakerQueueItem {
  id: string;
  delegateName: string;
  delegateUsername: string;
  delegationOrCaucus: string;
  topic: string;
  status: 'queued' | 'speaking' | 'yielded' | 'concluded';
  allocatedSeconds: number;
  requestedAt: string;
}

/* ─────────── PILLAR 4: CIVIC CLEARANCE & PASSPORT ─────────── */

export type ClearanceRank = 1 | 2 | 3 | 4 | 5;

export interface CivicClearance {
  level: ClearanceRank;
  title: 'Delegate' | 'Rapporteur' | 'Committee Chair' | 'Ambassador Extraordinary' | 'Plenary Fellow';
  reliabilityScore: number;
  verifiedCitationsCount: number;
  ratifiedTreatiesCount: number;
  endorsementsCount: number;
  stakedBountiesWon: number;
}

export interface DelegatePassportDossier {
  username: string;
  name: string;
  clearance: CivicClearance;
  ratifiedTreaties: { id: string; title: string; version: string; ratifiedAt: string }[];
  floorSpeechesCount: number;
  verifiedCitationsCount: number;
  accolades: string[];
  issuedAt: string;
  digitalSealHash: string;
}

/* ─────────── PILLAR 5: FINANCIAL & TAKE-RATE SIMULATOR ─────────── */

export interface BountyTip {
  id: string;
  senderUsername: string;
  recipientUsername: string;
  points: number;
  note?: string;
  createdAt: string;
}

export interface DualSidedFeeSimulatorConfig {
  ticketPrice: number;
  expectedAttendees: number;
  attendeePlan: 'STANDARD' | 'PULSE_PASS' | 'PULSE_ELITE';
  hostPlan: 'STANDARD' | 'PRO_HOST' | 'SUMMIT_INSTITUTIONAL';
}

/* ─────────── PRIMARY POST STRUCTURE ─────────── */

export interface PulsePost {
  id: string;
  authorId: string;
  authorName: string;
  authorUsername: string;
  authorAvatar?: string;
  authorRole?: string;
  isGuest?: boolean;
  content: string;
  images: string[];
  createdAt: string;
  likes: number;
  likedBy: string[];
  reposts: number;
  repostedBy: string[];
  replyCount: number;
  location?: string;
  tags?: string[];
  sourceName?: string;
  sourceUrl?: string;
  isSaved?: boolean;
  fontStyle?: string;
  effectStyle?: string;
  postType?: 'treaty' | 'floor_speech' | 'standard';
  
  // Attached Song / Music Track
  songTitle?: string;
  songArtist?: string;
  songAudioUrl?: string;

  // Speech Dispatches (Video & Audio)
  speechFormat?: 'video' | 'audio';
  speechVideoUrl?: string;
  speechAudioUrl?: string;
  speechDuration?: number;
  speechTranscript?: string;
  speechDelegation?: string;
  
  // Repost metadata
  isRepost?: boolean;
  originalPostId?: string;
  repostedByName?: string;
  repostedByUsername?: string;
  parentPostId?: string;

  // Pillar 1: Resolution & Treaty Co-Authorship Matrix
  isTreaty?: boolean;
  treatyTitle?: string;
  treatyVersion?: string;
  treatyStatus?: 'draft' | 'debate' | 'ratified';
  redlineDiffs?: LegislativeDiff[];
  revisions?: TreatyRevision[];
  rollCallVotes?: RollCallVotes;
  coSignatures?: TreatyCoSignature[];

  // Pillar 2: Proof-of-Citation Audit (Anti-Hallucination Wire)
  citations?: ProofCitation[];
  factBounties?: FactBountyChallenge[];
  civicReliabilityScore?: number;

  // Pillar 3: Diplomatic Floor Relays (Video & Audio Speeches)
  audioDispatch?: FloorAudioDispatch;
  caucusTag?: string; // e.g. 'Security Council', 'G-77 Summit', 'Youth Climate Caucus'
  yieldTarget?: string;

  // Pillar 5: Micro-Grants & Bounties
  civicBountiesTipped?: number;
}

export interface PulseReply {
  id: string;
  postId: string;
  authorId: string;
  authorName: string;
  authorUsername: string;
  content: string;
  createdAt: string;
  likes: number;
  likedBy: string[];
}

export interface FluxVideo {
  id: string;
  authorId: string;
  authorName: string;
  authorUsername: string;
  authorAvatar?: string;
  caption: string;
  videoUrl: string;
  sourceName: string;
  sourceUrl: string;
  thumbnailUrl?: string;
  musicTitle: string;
  likes: number;
  likedBy: string[];
  commentsCount: number;
  sharesCount: number;
  tags: string[];
  createdAt: string;
  isPrivate?: boolean;
  fontStyle?: string;
  effectStyle?: string;
}

export interface PulseArticle {
  id: string;
  title: string;
  subtitle?: string;
  slug: string;
  authorName: string;
  authorUsername: string;
  authorAvatar?: string;
  content: string;
  coverImage?: string;
  publishedAt: string;
  readTimeMinutes: number;
  category: string;
  tags: string[];
  likesCount: number;
  fontStyle?: string;
}

export interface PulseSpark {
  id: string;
  title: string;
  summary: string;
  category: string;
  readTime: string;
  points: number;
  image?: string;
  fontStyle?: string;
}

export interface FluxComment {
  id: string;
  fluxId: string;
  authorId: string;
  authorName: string;
  authorUsername: string;
  content: string;
  createdAt: string;
  likes: number;
}

export interface ProfileHostedEvent {
  id: string;
  title: string;
  date: string;
  time: string;
  location: string;
  category: 'SUMMIT' | 'WORKSHOP' | 'KEYNOTE' | 'MEETUP' | 'HACKATHON';
  rsvpUrl?: string;
  registeredCount: number;
  maxCapacity: number;
  coverImage?: string;
  description?: string;
}

export interface ProfileAnalytics {
  profileViews: number;
  dispatchReach: number;
  engagementRate: string;
  activePassesIssued: number;
}

export interface PulseProfile {
  id: string;
  username: string;
  name: string;
  bio: string;
  avatar?: string;
  coverImage?: string;
  isPrivate: boolean;
  isVerified: boolean;
  badge: 'FOUNDER' | 'DELEGATE' | 'CREATOR' | 'YOUTH LEADER' | 'NODE' | 'ORGANIZATION';
  accountType: 'personal' | 'professional';
  category?: string; // e.g. 'MUN Delegation', 'Youth NGO', 'Clean Energy Studio'
  isSubscribedOrganizer: boolean; // Has Event Section Subscription
  subscriptionPlan?: 'FREE' | 'ORGANIZER_PRO';
  hostedEvents?: ProfileHostedEvent[];
  analytics?: ProfileAnalytics;
  followers: string[];
  following: string[];
  pendingFollowRequests: string[];
  website?: string;
  location?: string;
  joinedDate: string;
  civicClearance?: CivicClearance;
}
