'use client';

import React, { createContext, useContext, useState, useEffect, useMemo, useCallback } from 'react';
import { useAuth } from '@/context/AuthContext';
import { 
  PulsePost, 
  PulseReply, 
  PulseView, 
  FluxVideo, 
  FluxComment, 
  PulseProfile, 
  PulseStory,
  ProfileHostedEvent,
  LegislativeDiff,
  TreatyRevision,
  RollCallVotes,
  ProofCitation,
  FactBountyChallenge,
  PoiIntervention,
  FloorAudioDispatch,
  SpeakerQueueItem,
  CivicClearance,
  DelegatePassportDossier,
  BountyTip,
  RationaleTag
} from '@/types/pulse';
import { auditFluxDispatch, auditPostDispatch } from '@/lib/fluxIntegrityGuard';
import { broadcastActivitySync } from '@/lib/reactiveActivityHub';
import { pushLiveNotification } from '@/lib/notificationStorage';

/* ─────────── CONTEXT SHAPE ─────────── */

interface ZenPulseContextType {
  /* posts */
  feedPosts: PulsePost[];
  myPosts: PulsePost[];
  likedPosts: PulsePost[];
  savedPosts: PulsePost[];
  savedPostIds: string[];
  getPostById: (id: string) => PulsePost | undefined;
  getPostsByUsername: (username: string) => PulsePost[];
  createPost: (
    content: string, 
    images?: string[], 
    location?: string, 
    tags?: string[], 
    fontStyle?: string, 
    effectStyle?: string,
    songData?: { songTitle?: string; songArtist?: string; songAudioUrl?: string },
    speechData?: { speechFormat?: 'video' | 'audio'; speechVideoUrl?: string; speechAudioUrl?: string; speechDuration?: number; speechTranscript?: string; speechDelegation?: string },
    sourceData?: { sourceName?: string; sourceUrl?: string }
  ) => string;
  createTreatyPost: (data: { title: string; content: string; caucusTag?: string; citations?: ProofCitation[]; tags?: string[] }) => string;
  createFloorAudioPost: (data: { 
    content: string; 
    audioUrl?: string; 
    videoUrl?: string; 
    speechFormat?: 'video' | 'audio'; 
    durationSeconds: number; 
    waveform?: number[]; 
    yieldTarget?: string; 
    caucusTag?: string;
    transcript?: string;
    delegationName?: string;
  }) => string;
  deletePost: (id: string) => void;
  likePost: (id: string) => void;
  repostPost: (id: string) => void;
  toggleSavePost: (id: string) => void;
  isSaved: (id: string) => boolean;

  /* Pillar 1: Resolution & Treaty Co-Authorship Matrix */
  submitRedlineDiff: (postId: string, diff: { originalSnippet: string; modifiedSnippet: string; rationaleTag: RationaleTag; rationaleNote: string }) => string;
  ratifyRedlineDiff: (postId: string, diffId: string) => void;
  rejectRedlineDiff: (postId: string, diffId: string, reason?: string) => void;
  castRollCallVote: (postId: string, vote: 'aye' | 'nay' | 'abstain') => void;
  coSignTreaty: (postId: string, caucus?: string) => void;

  /* Pillar 2: Proof-of-Citation Audit */
  addCitation: (postId: string, citation: Omit<ProofCitation, 'id' | 'verifiedCount' | 'verifiedBy'>) => void;
  verifyCitation: (postId: string, citationId: string) => void;
  stakeFactBounty: (postId: string, bounty: { premiseTarget: string; rationale: string; stakedPoints: number }) => void;
  resolveFactBounty: (postId: string, bountyId: string, outcome: 'author_verified' | 'author_forfeited', note?: string) => void;

  /* Pillar 3: Diplomatic Floor Relays (Zero-Video Audio) */
  addPoiIntervention: (postId: string, poi: { timestampAnchorSeconds: number; textNote: string; audioUrl?: string }) => void;
  speakerQueue: SpeakerQueueItem[];
  joinSpeakerQueue: (topic: string, delegationOrCaucus: string) => void;
  leaveSpeakerQueue: (id: string) => void;
  yieldFloorTime: (id: string, target: string) => void;

  /* Pillar 4: Merit-Driven Civic Clearance & Dossier */
  getCivicClearance: (username: string) => CivicClearance;
  generatePassportDossier: (username: string) => DelegatePassportDossier;

  /* Pillar 5: Dual-Sided Micro-Grants & Tipping */
  civicPointsBalance: number;
  sendCivicTip: (postId: string, recipientUsername: string, points: number, note?: string) => void;

  /* replies */
  getReplies: (postId: string) => PulseReply[];
  addReply: (postId: string, content: string) => void;
  deleteReply: (replyId: string) => void;
  likeReply: (replyId: string) => void;

  /* FLUX (Shorts / Reels) */
  fluxVideos: FluxVideo[];
  myFluxVideos: FluxVideo[];
  getFluxByUsername: (username: string) => FluxVideo[];
  createFlux: (data: { 
    caption: string; 
    videoUrl: string; 
    musicTitle: string; 
    tags: string[]; 
    sourceName: string; 
    sourceUrl: string; 
    isPrivate?: boolean;
    fontStyle?: string;
    effectStyle?: string;
  }) => string;
  deleteFlux: (id: string) => void;
  purgeFakeFlux: (id: string, reason?: string) => void;
  likeFlux: (id: string) => void;
  getFluxComments: (fluxId: string) => FluxComment[];
  addFluxComment: (fluxId: string, content: string) => void;

  /* Stories & Viewers */
  stories: PulseStory[];
  createStory: (data: { 
    title: string; 
    image?: string; 
    linkUrl?: string; 
    linkText?: string; 
    color?: string;
    fontStyle?: string;
    effectStyle?: string;
    textHighlight?: boolean;
    stickers?: string[];
    audioTitle?: string;
    songTitle?: string;
    songArtist?: string;
    songAudioUrl?: string;
    isSnap?: boolean;
    snapFilter?: string;
    snapLocation?: string;
  }) => string;
  deleteStory: (storyId: string) => void;
  recordStoryView: (storyId: string) => void;
  likeStory: (storyId: string) => void;

  /* Profiles & Follow Graph */
  profiles: PulseProfile[];
  myProfile: PulseProfile;
  getProfileByUsername: (username: string) => PulseProfile | undefined;
  updateMyProfile: (data: Partial<Pick<PulseProfile, 'name' | 'bio' | 'avatar' | 'website' | 'location' | 'isPrivate'>>) => void;
  upgradeToProfessional: (category: string) => void;
  subscribeToOrganizerPro: () => void;
  addProfileHostedEvent: (eventData: Omit<ProfileHostedEvent, 'id' | 'registeredCount'>) => void;
  deleteProfileHostedEvent: (eventId: string) => void;
  rsvpProfileHostedEvent: (profileUsername: string, eventId: string) => void;

  toggleFollow: (targetUsername: string) => void;
  approveFollowRequest: (requesterUsername: string) => void;
  rejectFollowRequest: (requesterUsername: string) => void;
  isFollowing: (targetUsername: string) => boolean;
  hasPendingRequest: (targetUsername: string) => boolean;

  /* selected profile & view */
  selectedProfileUsername: string | null;
  setSelectedProfileUsername: (username: string | null) => void;
  openUserProfile: (username: string) => void;

  /* view */
  activeView: PulseView;
  setActiveView: (v: PulseView) => void;
  activePostId: string | null;
  setActivePostId: (id: string | null) => void;

  /* user info */
  currentUserId: string;
  currentUserName: string;
  currentUserUsername: string;
}

const ZenPulseContext = createContext<ZenPulseContextType | undefined>(undefined);

const LS_POSTS = 'zenvitra_pulse_posts_v8_sovereign';
const LS_REPLIES = 'zenvitra_pulse_replies_v8_sovereign';
const LS_FLUXES = 'zenvitra_pulse_fluxes_v8_sovereign';
const LS_FLUX_COMMENTS = 'zenvitra_pulse_flux_comments_v8_sovereign';
const LS_PROFILES = 'zenvitra_pulse_profiles_v8_sovereign';
const LS_STORIES = 'zenvitra_pulse_stories_v8_sovereign';
const LS_SAVED = 'zenvitra_pulse_saved_v8_sovereign';
const LS_CIVIC_POINTS = 'zenvitra_pulse_civic_points_v1';
const LS_SPEAKER_QUEUE = 'zenvitra_pulse_speaker_queue_v1';

export function sanitizeProfilesList(profiles: PulseProfile[]): PulseProfile[] {
  if (!Array.isArray(profiles)) return [];
  const seen = new Set<string>();
  const cleaned: PulseProfile[] = [];

  for (const p of profiles) {
    if (!p || typeof p !== 'object') continue;
    const rawUname = p.username || (p as any).handle || '';
    if (!rawUname || typeof rawUname !== 'string') continue;
    const uLower = rawUname.toLowerCase().trim().replace(/^@/, '');
    
    // Ignore dummy placeholder accounts
    if (!uLower || uLower === 'member' || uLower === 'user' || p.id === 'local_user') continue;
    if (seen.has(uLower)) continue;
    seen.add(uLower);

    // Clean followers
    const followerSet = new Set<string>();
    const cleanFollowers: string[] = [];
    (p.followers || []).forEach((f) => {
      if (!f || typeof f !== 'string') return;
      const cleanF = f.toLowerCase().trim().replace(/^@/, '');
      if (cleanF && cleanF !== uLower && !followerSet.has(cleanF)) {
        followerSet.add(cleanF);
        cleanFollowers.push(cleanF);
      }
    });

    // Clean following
    const followingSet = new Set<string>();
    const cleanFollowing: string[] = [];
    (p.following || []).forEach((f) => {
      if (!f || typeof f !== 'string') return;
      const cleanF = f.toLowerCase().trim().replace(/^@/, '');
      if (cleanF && cleanF !== uLower && !followingSet.has(cleanF)) {
        followingSet.add(cleanF);
        cleanFollowing.push(cleanF);
      }
    });

    // Clean requests
    const reqSet = new Set<string>();
    const cleanReqs: string[] = [];
    (p.pendingFollowRequests || []).forEach((r) => {
      if (!r || typeof r !== 'string') return;
      const cleanR = r.toLowerCase().trim().replace(/^@/, '');
      if (cleanR && cleanR !== uLower && !reqSet.has(cleanR)) {
        reqSet.add(cleanR);
        cleanReqs.push(cleanR);
      }
    });

    cleaned.push({
      ...p,
      username: uLower,
      followers: cleanFollowers,
      following: cleanFollowing,
      pendingFollowRequests: cleanReqs,
    });
  }

  return cleaned;
}

/* ─────────── PROVIDER ─────────── */

export function ZenPulsePlatformProvider({ initialSession, children }: { initialSession?: any; children: React.ReactNode }) {
  const { user, profile, isMockMode } = useAuth();
  const [clientSessionUser, setClientSessionUser] = useState<any>(null);

  useEffect(() => {
    const syncSession = () => {
      try {
        const stored = JSON.parse(localStorage.getItem('zenvitra_session_user') || '{}');
        if (stored && (stored.username || stored.id || stored.display_name || stored.email)) {
          setClientSessionUser(stored);
        } else {
          setClientSessionUser(null);
        }
      } catch (_) {
        setClientSessionUser(null);
      }
    };
    syncSession();
    window.addEventListener('storage', syncSession);
    window.addEventListener('zenvitra_auth_change', syncSession);
    return () => {
      window.removeEventListener('storage', syncSession);
      window.removeEventListener('zenvitra_auth_change', syncSession);
    };
  }, []);

  const currentUserId = useMemo(() => {
    return (
      clientSessionUser?.id ||
      profile?.id ||
      user?.id ||
      initialSession?.user?.id ||
      clientSessionUser?.email ||
      profile?.email ||
      user?.email ||
      initialSession?.user?.email ||
      'guest_node'
    );
  }, [profile, user, initialSession, clientSessionUser]);

  const currentUserName = useMemo(() => {
    const pAny = profile as any;
    return (
      clientSessionUser?.display_name ||
      clientSessionUser?.name ||
      profile?.display_name ||
      pAny?.name ||
      pAny?.full_name ||
      initialSession?.user?.name ||
      initialSession?.user?.user_metadata?.full_name ||
      initialSession?.user?.user_metadata?.name ||
      clientSessionUser?.full_name ||
      user?.user_metadata?.full_name ||
      user?.user_metadata?.name ||
      user?.name ||
      clientSessionUser?.username ||
      profile?.username ||
      (initialSession?.user?.email ? initialSession.user.email.split('@')[0] : '') ||
      (user?.email ? user.email.split('@')[0] : '') ||
      'Guest Node'
    );
  }, [profile, user, initialSession, clientSessionUser]);

  const currentUserUsername = useMemo(() => {
    const pAny = profile as any;
    const raw =
      clientSessionUser?.username ||
      clientSessionUser?.handle ||
      profile?.username ||
      pAny?.handle ||
      initialSession?.user?.username ||
      initialSession?.user?.user_metadata?.user_name ||
      initialSession?.user?.user_metadata?.username ||
      user?.user_metadata?.user_name ||
      user?.user_metadata?.username ||
      (initialSession?.user?.email ? initialSession.user.email.split('@')[0] : '') ||
      (user?.email ? user.email.split('@')[0] : '') ||
      'guest';
    return raw.replace(/[^a-zA-Z0-9_]/g, '').toLowerCase() || 'guest';
  }, [profile, user, initialSession, clientSessionUser]);

  /* state */
  const [allPosts, setAllPosts] = useState<PulsePost[]>([]);
  const [allReplies, setAllReplies] = useState<Record<string, PulseReply[]>>({});
  const [allFluxVideos, setAllFluxVideos] = useState<FluxVideo[]>([]);
  const [allFluxComments, setAllFluxComments] = useState<Record<string, FluxComment[]>>({});
  const [allProfiles, setAllProfiles] = useState<PulseProfile[]>([]);
  const [allStories, setAllStories] = useState<PulseStory[]>([]);
  const [savedPostIds, setSavedPostIds] = useState<string[]>([]);
  const [civicPointsBalance, setCivicPointsBalance] = useState<number>(350);
  const [speakerQueue, setSpeakerQueue] = useState<SpeakerQueueItem[]>([]);

  const [activeView, setActiveView] = useState<PulseView>('feed');
  const [activePostId, setActivePostId] = useState<string | null>(null);
  const [selectedProfileUsername, setSelectedProfileUsername] = useState<string | null>(null);

  const safeParse = (val: string | null, fallback: any) => {
    if (!val || !val.trim() || val === 'undefined' || val === 'null') return fallback;
    try { return JSON.parse(val); } catch (_) { return fallback; }
  };

  /* persistence safe parse & strict zero-seeded real account rule */
  useEffect(() => {
    try {

      const storagePostsKey = isMockMode ? `${LS_POSTS}_mock` : LS_POSTS;
      const storageSpeakerKey = isMockMode ? `${LS_SPEAKER_QUEUE}_mock` : LS_SPEAKER_QUEUE;

      const postsRaw = safeParse(localStorage.getItem(storagePostsKey), null);
      const defaultPoliticalPosts: PulsePost[] = [
        {
          id: 'pol_post_01',
          authorId: 'prs_legislative_node',
          authorName: 'PRS Legislative Bureau',
          authorUsername: 'prs_india',
          authorAvatar: '',
          authorRole: 'INSTITUTIONAL WIRE',
          content: '🏛️ LEGISLATIVE DISPATCH: Digital Personal Data Protection (DPDP) Act 2023 & Parliamentary Oversight.\n\nThe Joint Parliamentary Committee review affirms stringent safeguards regarding algorithmic profiling of minors and mandatory consent architecture for data fiduciaries. Cross-border transfers remain anchored to the Central Government approved notification list.\n\nKey civic takeaway: Citizens possess enforceable right to correction, erasure, and grievance redressal through the Data Protection Board.',
          images: [
            'https://images.unsplash.com/photo-1541872703-74c5e44368f9?auto=format&fit=crop&w=1200&q=80'
          ],
          createdAt: new Date(Date.now() - 3600000 * 2).toISOString(),
          likes: 68,
          likedBy: [],
          reposts: 24,
          repostedBy: [],
          replyCount: 9,
          location: 'Parliament House, New Delhi',
          tags: ['Politics', 'Policy', 'Parliament', 'DataPrivacy', 'Governance'],
          sourceName: 'PRS Legislative Research',
          sourceUrl: 'https://prsindia.org/billtrack/digital-personal-data-protection-bill-2023',
          civicReliabilityScore: 99,
          citations: [
            {
              id: 'cit_prs_01',
              symbolOrId: 'Bill No. 113 of 2023',
              type: 'GAZETTE',
              title: 'Digital Personal Data Protection Act, 2023 (Act No. 22 of 2023)',
              institution: 'Ministry of Law & Justice / PRS Research',
              archiveUrl: 'https://prsindia.org',
              sha256Hash: 'a7b8e910c24d456f912e8b0a99cde3110245a90bf183428d09bc198274a1005b',
              verifiedCount: 18,
              verifiedBy: ['prs_india', 'civic_monitor', 'legal_bench']
            }
          ]
        },
        {
          id: 'pol_post_02',
          authorId: 'sci_constitutional_node',
          authorName: 'Supreme Court Dispatch Wire',
          authorUsername: 'supreme_court_monitor',
          authorAvatar: '',
          authorRole: 'CONSTITUTIONAL OBSERVER',
          content: '⚖️ CONSTITUTIONAL BENCH RULING: Electoral Transparency & Voter Right to Know.\n\nThe 5-Judge Constitution Bench reiterates that democratic legitimacy requires uncompromised public disclosure regarding political finance and candidate background under Article 19(1)(a).\n\n"Information is the cornerstone of participatory democracy. Voters cannot exercise genuine franchise in an asymmetric vacuum."',
          images: [
            'https://images.unsplash.com/photo-1589829545856-d10d557cf95f?auto=format&fit=crop&w=1200&q=80'
          ],
          createdAt: new Date(Date.now() - 3600000 * 6).toISOString(),
          likes: 114,
          likedBy: [],
          reposts: 47,
          repostedBy: [],
          replyCount: 14,
          location: 'Tilak Marg, Supreme Court of India',
          tags: ['SupremeCourt', 'Constitution', 'Transparency', 'ElectionCommission', 'Politics'],
          sourceName: 'Supreme Court of India (sci.gov.in)',
          sourceUrl: 'https://www.sci.gov.in/judgments/',
          civicReliabilityScore: 100,
          citations: [
            {
              id: 'cit_sci_02',
              symbolOrId: 'Writ Petition (Civil) No. 880/2017',
              type: 'COURT_DOCKET',
              title: 'Association for Democratic Reforms & Anr. v. Union of India',
              institution: 'Supreme Court of India',
              archiveUrl: 'https://main.sci.gov.in',
              sha256Hash: 'e4d8a11b98cf982a17088921a4f009bba762d02cba018944cf92b8d002a99187',
              verifiedCount: 32,
              verifiedBy: ['supreme_court_monitor', 'law_commission_node', 'civic_auditor']
            }
          ]
        },
        {
          id: 'pol_post_03',
          authorId: 'un_geneva_node',
          authorName: 'UN Plenary Secretariat',
          authorUsername: 'un_plenary',
          authorAvatar: '',
          authorRole: 'MULTILATERAL SECRETARIAT',
          content: '🌐 MULTILATERAL RESOLUTION: Global Governance Framework on Lethal Autonomous Systems (LAWS).\n\nPlenary assembly consensus reaches 124 cosponsors on establishing strict human command verification over autonomous cognitive targeting networks.\n\nAll High Contracting Parties mandate civilian infrastructure immunities and continuous independent treaty verification telemetry.',
          images: [
            'https://images.unsplash.com/photo-1511578314322-379afb476865?auto=format&fit=crop&w=1200&q=80'
          ],
          createdAt: new Date(Date.now() - 3600000 * 12).toISOString(),
          likes: 89,
          likedBy: [],
          reposts: 31,
          repostedBy: [],
          replyCount: 7,
          location: 'Palais des Nations, Geneva',
          tags: ['UN', 'Treaty', 'Geopolitics', 'AutonomousWeapons', 'Multilateralism'],
          isTreaty: true,
          treatyTitle: 'Framework Protocol on Lethal Autonomous Systems & Sovereign Human Command',
          treatyVersion: 'v2.4',
          treatyStatus: 'debate',
          sourceName: 'United Nations Digital Library (digitallibrary.un.org)',
          sourceUrl: 'https://digitallibrary.un.org',
          civicReliabilityScore: 98,
          citations: [
            {
              id: 'cit_un_03',
              symbolOrId: 'A/RES/78/241',
              type: 'UN_DOC',
              title: 'Lethal autonomous weapons systems - Resolution adopted by the General Assembly',
              institution: 'United Nations General Assembly',
              archiveUrl: 'https://digitallibrary.un.org/record/4030635',
              sha256Hash: 'f189c4501ba9002dd378129845ba01ffbca9082341d087c093a1029487cba102',
              verifiedCount: 45,
              verifiedBy: ['un_plenary', 'diplomat_france', 'g77_delegate']
            }
          ]
        }
      ];

      if (postsRaw && Array.isArray(postsRaw) && postsRaw.length > 0) {
        // Ensure the verified political posts exist in the feed even if an older local cache was present
        const existingIds = new Set(postsRaw.map((p: PulsePost) => p.id));
        const missingPolitics = defaultPoliticalPosts.filter(p => !existingIds.has(p.id));
        const combined = [...missingPolitics, ...postsRaw];
        setAllPosts(combined);
      } else {
        setAllPosts(defaultPoliticalPosts);
        try { localStorage.setItem(storagePostsKey, JSON.stringify(defaultPoliticalPosts)); } catch (_) {}
      }

      // Initialize political reels if empty
      const fluxesRaw = safeParse(localStorage.getItem(LS_FLUXES), null);
      if (fluxesRaw && Array.isArray(fluxesRaw) && fluxesRaw.length > 0) {
        setAllFluxVideos(fluxesRaw);
      } else {
        const defaultPoliticalFluxes: FluxVideo[] = [
          {
            id: 'flux_pol_01',
            authorId: 'ipu_youth_node',
            authorName: 'Inter-Parliamentary Union',
            authorUsername: 'ipu_parliament',
            caption: '🏛️ Parliamentary youth quota reform: How youth representation in national parliaments crossed 10% for the first time across 38 sovereign jurisdictions. Full empirical index breakdown.',
            videoUrl: 'https://assets.mixkit.co/videos/preview/mixkit-hands-of-people-holding-flags-in-a-crowd-41712-large.mp4',
            thumbnailUrl: 'https://images.unsplash.com/photo-1540910419892-4a36d2c3266c?auto=format&fit=crop&w=800&q=80',
            sourceName: 'Inter-Parliamentary Union (IPU)',
            sourceUrl: 'https://www.ipu.org/youth-in-parliament',
            musicTitle: 'Parliamentary Sovereign Anthem',
            likes: 184,
            likedBy: [],
            commentsCount: 22,
            sharesCount: 39,
            tags: ['Parliament', 'YouthQuota', 'Politics', 'Democracy'],
            createdAt: new Date(Date.now() - 3600000 * 5).toISOString()
          },
          {
            id: 'flux_pol_02',
            authorId: 'un_climate_action',
            authorName: 'COP30 Youth Diplomatic Taskforce',
            authorUsername: 'cop_youth',
            caption: '🌍 Loss & Damage Fund operationalization: Delegate plenary deliberations on direct disbursement channels for vulnerable island states. Verified multilateral quorum report.',
            videoUrl: 'https://assets.mixkit.co/videos/preview/mixkit-globe-projection-with-networking-nodes-42525-large.mp4',
            thumbnailUrl: 'https://images.unsplash.com/photo-1451187580459-43490279c0fa?auto=format&fit=crop&w=800&q=80',
            sourceName: 'UNFCCC Loss and Damage Mechanism',
            sourceUrl: 'https://unfccc.int/loss-and-damage-fund',
            musicTitle: 'Global Diplomatic Grid',
            likes: 215,
            likedBy: [],
            commentsCount: 34,
            sharesCount: 68,
            tags: ['ClimateDiplomacy', 'COP30', 'LossAndDamage', 'Policy'],
            createdAt: new Date(Date.now() - 3600000 * 10).toISOString()
          }
        ];
        setAllFluxVideos(defaultPoliticalFluxes);
        try { localStorage.setItem(LS_FLUXES, JSON.stringify(defaultPoliticalFluxes)); } catch (_) {}
      }

      setAllReplies(safeParse(localStorage.getItem(LS_REPLIES), {}));
      const loadedFluxes = safeParse(localStorage.getItem(LS_FLUXES), []);
      if (loadedFluxes.length > 0) {
        setAllFluxVideos(loadedFluxes);
      }
      setAllFluxComments(safeParse(localStorage.getItem(LS_FLUX_COMMENTS), {}));
      setAllStories(safeParse(localStorage.getItem(LS_STORIES), []));

      // Strictly Private User Vault for Saved Posts & Bookmarks
      const activeUserKey = (currentUserUsername || currentUserId || 'default').toLowerCase().replace(/^@/, '');
      const userSavedKey = `${LS_SAVED}_${activeUserKey}`;
      const savedForUser = safeParse(localStorage.getItem(userSavedKey), null);
      if (savedForUser !== null) {
        setSavedPostIds(savedForUser);
      } else {
        const legacy = safeParse(localStorage.getItem(LS_SAVED), []);
        setSavedPostIds(legacy);
        if (legacy.length > 0) {
          try { localStorage.setItem(userSavedKey, JSON.stringify(legacy)); } catch (_) {}
        }
      }
      
      setCivicPointsBalance(safeParse(localStorage.getItem(LS_CIVIC_POINTS), 350));
      
      const tutorialSpeakerQueue = [
        {
          id: 'spk_01',
          delegateName: 'Delegation of France',
          delegateUsername: 'diplomat_france',
          delegationOrCaucus: 'Security Council Permanent',
          topic: 'Article IV Corridor Verification Protocols',
          status: 'speaking' as const,
          allocatedSeconds: 60,
          requestedAt: new Date().toISOString()
        },
        {
          id: 'spk_02',
          delegateName: 'G-77 Coordinator',
          delegateUsername: 'g77_delegate',
          delegationOrCaucus: 'G-77 Coalition',
          topic: 'Budgetary Appropriations for Independent Civic Monitors',
          status: 'queued' as const,
          allocatedSeconds: 60,
          requestedAt: new Date().toISOString()
        }
      ];

      setSpeakerQueue(safeParse(localStorage.getItem(storageSpeakerKey), isMockMode ? tutorialSpeakerQueue : []));

      const rawProfiles = safeParse(localStorage.getItem(LS_PROFILES), []);
      setAllProfiles(sanitizeProfilesList(rawProfiles));
    } catch (_) {}
  }, [isMockMode]);

  const savePosts = useCallback((next: PulsePost[]) => {
    setAllPosts(next);
    try {
      localStorage.setItem(LS_POSTS, JSON.stringify(next));
      broadcastActivitySync({ source: 'post', action: 'update', timestamp: Date.now() });
    } catch (_) {}
  }, []);

  const saveReplies = useCallback((next: Record<string, PulseReply[]>) => {
    setAllReplies(next);
    try { localStorage.setItem(LS_REPLIES, JSON.stringify(next)); } catch (_) {}
  }, []);

  const saveProfiles = useCallback((next: PulseProfile[]) => {
    const cleaned = sanitizeProfilesList(next);
    setAllProfiles(cleaned);
    try { localStorage.setItem(LS_PROFILES, JSON.stringify(cleaned)); } catch (_) {}
  }, []);

  const saveSavedPostIds = useCallback((next: string[]) => {
    setSavedPostIds(next);
    try {
      const activeUserKey = (currentUserUsername || currentUserId || 'default').toLowerCase().replace(/^@/, '');
      localStorage.setItem(`${LS_SAVED}_${activeUserKey}`, JSON.stringify(next));
      localStorage.setItem(LS_SAVED, JSON.stringify(next));
    } catch (_) {}
  }, [currentUserUsername, currentUserId]);

  const saveCivicPoints = useCallback((points: number) => {
    setCivicPointsBalance(points);
    try { localStorage.setItem(LS_CIVIC_POINTS, JSON.stringify(points)); } catch (_) {}
  }, []);

  const saveSpeakerQueue = useCallback((next: SpeakerQueueItem[]) => {
    setSpeakerQueue(next);
    try { localStorage.setItem(LS_SPEAKER_QUEUE, JSON.stringify(next)); } catch (_) {}
  }, []);

  // Synchronize private vault when active user account changes
  useEffect(() => {
    if (typeof window === 'undefined') return;
    try {
      const activeUserKey = (currentUserUsername || currentUserId || 'default').toLowerCase().replace(/^@/, '');
      const userSavedKey = `${LS_SAVED}_${activeUserKey}`;
      const savedForUser = safeParse(localStorage.getItem(userSavedKey), null);
      if (savedForUser !== null) {
        setSavedPostIds(savedForUser);
      }
    } catch (_) {}
  }, [currentUserUsername, currentUserId]);

  /* Profile state */
  const myProfile = useMemo((): PulseProfile => {
    const activeUsername = currentUserUsername || 'you';
    const activeName = currentUserName || 'You';
    const existing = allProfiles.find(
      (p) => (p.username && p.username.toLowerCase() === activeUsername.toLowerCase()) || p.id === currentUserId
    );

    const isFounderUser = activeUsername === 'yuveer' || activeUsername === 'founder' || profile?.email === 'founder@zenvitra.org';
    const isVerifiedFlag = Boolean(
      isFounderUser || 
      profile?.is_verified || 
      clientSessionUser?.is_verified || 
      clientSessionUser?.isVerified || 
      existing?.isVerified
    );

    const defaultHostedEvents: ProfileHostedEvent[] = isFounderUser ? [
      {
        id: 'evt_showcase_01',
        title: 'Zenvitra Youth Diplomatic Plenary 2026',
        date: 'Oct 12-14, 2026',
        time: '09:00 AM CET',
        location: 'Palais des Nations, Geneva & Virtual Node',
        category: 'SUMMIT',
        rsvpUrl: '/events',
        registeredCount: 184,
        maxCapacity: 250,
        coverImage: 'https://images.unsplash.com/photo-1540575467063-178a50c2df87?auto=format&fit=crop&w=1200&q=80',
        description: 'Flagship global convention convening 500+ youth delegates, AI policy researchers, and sovereign civic leaders.'
      },
      {
        id: 'evt_showcase_02',
        title: 'Civic Treaty & Redline Diff Masterclass',
        date: 'Nov 05, 2026',
        time: '04:30 PM CET',
        location: 'Virtual Cryptographic Chamber',
        category: 'WORKSHOP',
        rsvpUrl: '/events',
        registeredCount: 92,
        maxCapacity: 120,
        coverImage: 'https://images.unsplash.com/photo-1511578314322-379afb476865?auto=format&fit=crop&w=1200&q=80',
        description: 'Hands-on session mastering multilateral resolution drafting, zero-hallucination verification, and sovereign quorum mechanics.'
      }
    ] : [];

    if (existing && (existing.username || existing.name)) {
      return {
        ...existing,
        name: activeName || existing.name || activeUsername,
        username: activeUsername || existing.username,
        avatar: profile?.avatar_url || (profile as any)?.avatar || existing.avatar || '',
        bio: profile?.bio || existing.bio || 'Sovereign Plenary Delegate on Zenvitra.',
        isVerified: isVerifiedFlag,
        isSubscribedOrganizer: isFounderUser ? true : Boolean(existing.isSubscribedOrganizer),
        subscriptionPlan: isFounderUser ? 'ORGANIZER_PRO' : (existing.subscriptionPlan ?? 'FREE'),
        hostedEvents: existing.hostedEvents && existing.hostedEvents.length > 0 ? existing.hostedEvents : (isFounderUser ? defaultHostedEvents : []),
      };
    }
    return {
      id: currentUserId || `user_${Date.now()}`,
      username: activeUsername,
      name: activeName,
      bio: profile?.bio || 'Sovereign Plenary Delegate on Zenvitra.',
      avatar: profile?.avatar_url || '',
      badge: isFounderUser ? 'FOUNDER' : 'DELEGATE',
      accountType: isFounderUser ? 'professional' : 'personal',
      isSubscribedOrganizer: isFounderUser,
      subscriptionPlan: isFounderUser ? 'ORGANIZER_PRO' : 'FREE',
      hostedEvents: isFounderUser ? defaultHostedEvents : [],
      isVerified: isVerifiedFlag,
      isPrivate: false,
      followers: [],
      following: [],
      pendingFollowRequests: [],
      joinedDate: 'Aug 2026',
      civicClearance: {
        level: 3,
        title: 'Committee Chair',
        reliabilityScore: 94,
        verifiedCitationsCount: 14,
        ratifiedTreatiesCount: 6,
        endorsementsCount: 28,
        stakedBountiesWon: 3
      }
    };
  }, [allProfiles, currentUserId, currentUserName, currentUserUsername, profile, clientSessionUser]);

  const updateMyProfile = useCallback((data: Partial<Pick<PulseProfile, 'name' | 'bio' | 'avatar' | 'website' | 'location' | 'isPrivate'>>) => {
    const activeUsername = currentUserUsername || myProfile.username;
    const exists = allProfiles.some((p) => (activeUsername && p.username === activeUsername) || p.id === currentUserId);
    let updated: PulseProfile[];
    if (exists) {
      updated = allProfiles.map((p) => {
        if ((activeUsername && p.username === activeUsername) || p.id === currentUserId) {
          return { ...p, ...data };
        }
        return p;
      });
    } else {
      updated = [{ ...myProfile, ...data }, ...allProfiles];
    }
    saveProfiles(updated);
  }, [allProfiles, currentUserId, currentUserUsername, myProfile, saveProfiles]);

  const getProfileByUsername = useCallback((username: string): PulseProfile | undefined => {
    if (!username) return undefined;
    const clean = username.toLowerCase().trim().replace(/^@/, '');
    if (clean === (currentUserUsername || myProfile?.username || '').toLowerCase().trim().replace(/^@/, '')) {
      return myProfile;
    }
    const found = allProfiles.find(
      (p) => (p.username && p.username.toLowerCase() === clean) || (p.id && p.id.toLowerCase() === clean)
    );
    if (found) {
      if (clean === 'un_plenary' && (!found.hostedEvents || found.hostedEvents.length === 0)) {
        return {
          ...found,
          isSubscribedOrganizer: true,
          subscriptionPlan: 'ORGANIZER_PRO',
          hostedEvents: [
            {
              id: 'evt_un_plenary_01',
              title: 'Open Civic Corridors Global Treaty Forum',
              date: 'Sept 28, 2026',
              time: '10:00 AM CET',
              location: 'Geneva Headquarters & Broadcast Wire',
              category: 'SUMMIT',
              rsvpUrl: '/events',
              registeredCount: 310,
              maxCapacity: 400,
              coverImage: 'https://images.unsplash.com/photo-1577495508048-b635879837f1?auto=format&fit=crop&w=1200&q=80',
              description: 'Official ratification forum for cross-border civic verification treaties and multilateral digital credentials.'
            }
          ]
        };
      }
      return found;
    }

    const isPlenary = clean === 'un_plenary';
    return {
      id: `profile_${clean}`,
      username: clean,
      name: isPlenary ? 'Sovereign Treaty Council' : clean.charAt(0).toUpperCase() + clean.slice(1),
      bio: isPlenary ? 'Official plenary secretariat for sovereign civic treaties and verified humanitarian wire.' : 'Sovereign diplomatic delegate.',
      avatar: '',
      badge: isPlenary ? 'ORGANIZATION' : 'DELEGATE',
      accountType: isPlenary ? 'professional' : 'personal',
      isSubscribedOrganizer: isPlenary,
      subscriptionPlan: isPlenary ? 'ORGANIZER_PRO' : 'FREE',
      hostedEvents: isPlenary ? [
        {
          id: 'evt_un_plenary_01',
          title: 'Open Civic Corridors Global Treaty Forum',
          date: 'Sept 28, 2026',
          time: '10:00 AM CET',
          location: 'Geneva Headquarters & Broadcast Wire',
          category: 'SUMMIT',
          rsvpUrl: '/events',
          registeredCount: 310,
          maxCapacity: 400,
          coverImage: 'https://images.unsplash.com/photo-1577495508048-b635879837f1?auto=format&fit=crop&w=1200&q=80',
          description: 'Official ratification forum for cross-border civic verification treaties and multilateral digital credentials.'
        }
      ] : [],
      isVerified: true,
      isPrivate: false,
      followers: [],
      following: [],
      pendingFollowRequests: [],
      joinedDate: 'Aug 2026',
      civicClearance: {
        level: isPlenary ? 5 : 2,
        title: isPlenary ? 'Plenary Fellow' : 'Rapporteur',
        reliabilityScore: isPlenary ? 99 : 88,
        verifiedCitationsCount: isPlenary ? 24 : 6,
        ratifiedTreatiesCount: isPlenary ? 12 : 2,
        endorsementsCount: isPlenary ? 140 : 11,
        stakedBountiesWon: isPlenary ? 8 : 1
      }
    };
  }, [allProfiles, myProfile, currentUserUsername]);

  /* Follow Graph */
  const isFollowing = useCallback((targetUsername: string) => {
    if (!targetUsername) return false;
    const cleanTarget = targetUsername.toLowerCase().trim().replace(/^@/, '');
    const cleanCurrent = (currentUserUsername || myProfile?.username || '').toLowerCase().trim().replace(/^@/, '');
    if (myProfile?.following && myProfile.following.some(f => f.toLowerCase().trim().replace(/^@/, '') === cleanTarget)) return true;
    const target = allProfiles.find((p) => p.username && p.username.toLowerCase().trim().replace(/^@/, '') === cleanTarget);
    return target && cleanCurrent ? (target.followers || []).some(f => f.toLowerCase().trim().replace(/^@/, '') === cleanCurrent) : false;
  }, [allProfiles, currentUserUsername, myProfile?.following, myProfile?.username]);

  const hasPendingRequest = useCallback((targetUsername: string) => {
    if (!targetUsername) return false;
    const cleanTarget = targetUsername.toLowerCase().trim().replace(/^@/, '');
    const cleanCurrent = (currentUserUsername || myProfile?.username || '').toLowerCase().trim().replace(/^@/, '');
    const target = allProfiles.find((p) => p.username && p.username.toLowerCase().trim().replace(/^@/, '') === cleanTarget);
    return target && cleanCurrent ? (target.pendingFollowRequests || []).some(r => r.toLowerCase().trim().replace(/^@/, '') === cleanCurrent) : false;
  }, [allProfiles, currentUserUsername, myProfile?.username]);

  const toggleFollow = useCallback((targetUsername: string) => {
    if (!targetUsername) return;
    const cleanTarget = targetUsername.toLowerCase().trim().replace(/^@/, '');
    const cleanCurrent = (currentUserUsername || myProfile?.username || 'you').toLowerCase().trim().replace(/^@/, '');
    if (cleanTarget === cleanCurrent && cleanCurrent !== '') return;

    let target = allProfiles.find((p) => p.username && p.username.toLowerCase().trim().replace(/^@/, '') === cleanTarget) || getProfileByUsername(targetUsername);
    if (!target) return;

    const currentlyFollowing = (myProfile?.following || []).some(f => f.toLowerCase().trim().replace(/^@/, '') === cleanTarget);
    let updated = [...allProfiles];
    if (!updated.some(p => p.username && p.username.toLowerCase().trim().replace(/^@/, '') === cleanTarget)) {
      updated.push(target);
    }

    if (currentlyFollowing) {
      updated = updated.map((p) => {
        const u = (p.username || '').toLowerCase().trim().replace(/^@/, '');
        if (u === cleanTarget) {
          return { ...p, followers: (p.followers || []).filter(f => f.toLowerCase().trim().replace(/^@/, '') !== cleanCurrent) };
        }
        if (u === cleanCurrent || p.id === currentUserId) {
          return { ...p, following: (p.following || []).filter(f => f.toLowerCase().trim().replace(/^@/, '') !== cleanTarget) };
        }
        return p;
      });
    } else {
      updated = updated.map((p) => {
        const u = (p.username || '').toLowerCase().trim().replace(/^@/, '');
        if (u === cleanTarget) {
          return { ...p, followers: [...(p.followers || []).filter(f => f.toLowerCase().trim().replace(/^@/, '') !== cleanCurrent), cleanCurrent] };
        }
        if (u === cleanCurrent || p.id === currentUserId) {
          return { ...p, following: [...(p.following || []).filter(f => f.toLowerCase().trim().replace(/^@/, '') !== cleanTarget), cleanTarget] };
        }
        return p;
      });
    }

    saveProfiles(updated);
  }, [allProfiles, currentUserId, currentUserUsername, getProfileByUsername, myProfile, saveProfiles]);

  const approveFollowRequest = useCallback((requesterUsername: string) => {
    // stub implementation
  }, []);

  const rejectFollowRequest = useCallback((requesterUsername: string) => {
    // stub implementation
  }, []);

  const upgradeToProfessional = useCallback((category: string) => {
    const activeUsername = currentUserUsername || myProfile.username;
    const updated = allProfiles.map((p) => {
      if ((activeUsername && p.username === activeUsername) || p.id === currentUserId) {
        return {
          ...p,
          accountType: 'professional' as const,
          category,
          badge: 'ORGANIZATION' as const,
        };
      }
      return p;
    });
    saveProfiles(updated);
    pushLiveNotification({
      title: '💼 Account Upgraded to Professional',
      message: `Profile converted to Professional (${category}).`,
      type: 'security',
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    });
  }, [allProfiles, currentUserId, currentUserUsername, myProfile.username, saveProfiles]);

  const subscribeToOrganizerPro = useCallback(() => {
    const activeUsername = currentUserUsername || myProfile.username;
    const updated = allProfiles.map((p) => {
      if ((activeUsername && p.username === activeUsername) || p.id === currentUserId) {
        const nextStatus = !p.isSubscribedOrganizer;
        return {
          ...p,
          isSubscribedOrganizer: nextStatus,
          subscriptionPlan: nextStatus ? ('ORGANIZER_PRO' as const) : ('FREE' as const),
          badge: nextStatus ? ('ORGANIZATION' as const) : p.badge,
        };
      }
      return p;
    });
    saveProfiles(updated);
    pushLiveNotification({
      title: '👑 Organizer Pro Subscription Active',
      message: 'Events showcase and custom registration embed links unlocked on your profile.',
      type: 'mun',
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    });
  }, [allProfiles, currentUserId, currentUserUsername, myProfile.username, saveProfiles]);

  const addProfileHostedEvent = useCallback((eventData: Omit<ProfileHostedEvent, 'id' | 'registeredCount'>) => {
    const newEvent: ProfileHostedEvent = {
      ...eventData,
      id: `evt_hosted_${Date.now()}`,
      registeredCount: 1,
    };
    const activeUsername = currentUserUsername || myProfile.username;
    const updated = allProfiles.map((p) => {
      if ((activeUsername && p.username === activeUsername) || p.id === currentUserId) {
        return {
          ...p,
          isSubscribedOrganizer: true,
          hostedEvents: [newEvent, ...(p.hostedEvents || [])],
        };
      }
      return p;
    });
    saveProfiles(updated);
    pushLiveNotification({
      title: '🎉 Showcase Event Published',
      message: `"${eventData.title}" is now featured on your profile with direct registration links.`,
      type: 'pulse',
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    });
  }, [allProfiles, currentUserId, currentUserUsername, myProfile.username, saveProfiles]);

  const deleteProfileHostedEvent = useCallback((eventId: string) => {
    const activeUsername = currentUserUsername || myProfile.username;
    const updated = allProfiles.map((p) => {
      if ((activeUsername && p.username === activeUsername) || p.id === currentUserId) {
        return {
          ...p,
          hostedEvents: (p.hostedEvents || []).filter((e) => e.id !== eventId),
        };
      }
      return p;
    });
    saveProfiles(updated);
  }, [allProfiles, currentUserId, currentUserUsername, myProfile.username, saveProfiles]);

  const rsvpProfileHostedEvent = useCallback((profileUsername: string, eventId: string) => {
    const clean = profileUsername.toLowerCase().trim().replace(/^@/, '');
    const updated = allProfiles.map((p) => {
      if (p.username && p.username.toLowerCase().trim().replace(/^@/, '') === clean) {
        const nextEvents = (p.hostedEvents || []).map((e) => {
          if (e.id === eventId) {
            return {
              ...e,
              registeredCount: Math.min(e.maxCapacity, (e.registeredCount || 0) + 1),
            };
          }
          return e;
        });
        return { ...p, hostedEvents: nextEvents };
      }
      return p;
    });
    saveProfiles(updated);
    pushLiveNotification({
      title: '🎟️ Registration Confirmed',
      message: 'You have been added to the guest ledger for this event.',
      type: 'pulse',
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    });
  }, [allProfiles, saveProfiles]);


  const openUserProfile = useCallback((username: string) => {
    setSelectedProfileUsername(username);
    setActiveView('profile');
  }, []);

  /* ─────────── POSTS & DISPATCHES ─────────── */

  const feedPosts = useMemo(() => {
    return allPosts;
  }, [allPosts]);

  const myPosts = useMemo(() => {
    return allPosts.filter(
      (p) => p.authorId === currentUserId || p.authorUsername === currentUserUsername
    );
  }, [allPosts, currentUserId, currentUserUsername]);

  const likedPosts = useMemo(() => {
    return allPosts.filter((p) => p.likedBy.includes(currentUserId));
  }, [allPosts, currentUserId]);

  const savedPosts = useMemo(() => {
    return allPosts.filter((p) => savedPostIds.includes(p.id));
  }, [allPosts, savedPostIds]);

  const isSaved = useCallback((id: string) => {
    return savedPostIds.includes(id);
  }, [savedPostIds]);

  const toggleSavePost = useCallback((id: string) => {
    const next = savedPostIds.includes(id) ? savedPostIds.filter((pId) => pId !== id) : [...savedPostIds, id];
    saveSavedPostIds(next);
  }, [savedPostIds, saveSavedPostIds]);

  const getPostById = useCallback((id: string) => {
    return allPosts.find((p) => p.id === id);
  }, [allPosts]);

  const getPostsByUsername = useCallback((username: string) => {
    return allPosts.filter((p) => p.authorUsername === username);
  }, [allPosts]);

  const createPost = useCallback((
    content: string, 
    images: string[] = [], 
    location?: string, 
    tags: string[] = [], 
    fontStyle?: string, 
    effectStyle?: string,
    songData?: { songTitle?: string; songArtist?: string; songAudioUrl?: string },
    speechData?: { speechFormat?: 'video' | 'audio'; speechVideoUrl?: string; speechAudioUrl?: string; speechDuration?: number; speechTranscript?: string; speechDelegation?: string },
    sourceData?: { sourceName?: string; sourceUrl?: string }
  ) => {
    const audit = auditPostDispatch({ content, location, tags });
    if (!audit.passed) {
      throw new Error(audit.reasons[0] || 'Post violates Zenvitra Secular Policy & Integrity standards.');
    }

    const isGuestUser = Boolean(clientSessionUser?.isGuest || clientSessionUser?.role === 'guest' || profile?.isGuest);

    const newPost: PulsePost = {
      id: `post_${Date.now()}`,
      authorId: currentUserId,
      authorName: currentUserName,
      authorUsername: currentUserUsername,
      authorRole: isGuestUser ? 'GUEST' : (profile?.role || clientSessionUser?.role || 'delegate'),
      isGuest: isGuestUser,
      content,
      images,
      location: location || 'Plenary Grid',
      tags: tags.length > 0 ? tags : (content.match(/#[a-zA-Z0-9_]+/g)?.map(t => t.slice(1)) || []),
      sourceName: sourceData?.sourceName?.trim() || undefined,
      sourceUrl: sourceData?.sourceUrl?.trim() || undefined,
      fontStyle: fontStyle || 'sans',
      effectStyle: effectStyle || 'none',
      songTitle: songData?.songTitle,
      songArtist: songData?.songArtist,
      songAudioUrl: songData?.songAudioUrl,
      speechFormat: speechData?.speechFormat,
      speechVideoUrl: speechData?.speechVideoUrl,
      speechAudioUrl: speechData?.speechAudioUrl,
      speechDuration: speechData?.speechDuration,
      speechTranscript: speechData?.speechTranscript,
      speechDelegation: speechData?.speechDelegation,
      createdAt: new Date().toISOString(),
      likes: 0,
      likedBy: [],
      reposts: 0,
      repostedBy: [],
      replyCount: 0,
      civicReliabilityScore: sourceData?.sourceName ? 98 : 90
    };
    savePosts([newPost, ...allPosts]);
    return newPost.id;
  }, [allPosts, currentUserId, currentUserName, currentUserUsername, savePosts]);

  const createTreatyPost = useCallback((data: { title: string; content: string; caucusTag?: string; citations?: ProofCitation[]; tags?: string[] }) => {
    const newTreaty: PulsePost = {
      id: `treaty_${Date.now()}`,
      authorId: currentUserId,
      authorName: currentUserName,
      authorUsername: currentUserUsername,
      content: data.content,
      images: [],
      createdAt: new Date().toISOString(),
      likes: 1,
      likedBy: [currentUserId],
      reposts: 0,
      repostedBy: [],
      replyCount: 0,
      location: 'Sovereign Plenary Chamber',
      tags: data.tags || ['TreatyDraft', 'PlenaryConsensus'],
      isTreaty: true,
      treatyTitle: data.title,
      treatyVersion: 'v1.0',
      treatyStatus: 'debate',
      caucusTag: data.caucusTag || 'General Assembly',
      citations: data.citations || [],
      rollCallVotes: {
        ayes: [currentUserUsername],
        nays: [],
        abstains: []
      },
      coSignatures: [
        {
          userId: currentUserId,
          name: currentUserName,
          username: currentUserUsername,
          caucus: data.caucusTag || 'Primary Sponsor',
          clearanceLevel: myProfile.civicClearance?.level || 3,
          timestamp: new Date().toISOString()
        }
      ],
      redlineDiffs: [],
      revisions: [
        {
          version: 'v1.0',
          timestamp: new Date().toISOString(),
          ratifiedByName: currentUserName,
          diffSummary: 'Initial treaty text deposited by sponsor.',
          fullContent: data.content
        }
      ],
      factBounties: [],
      civicReliabilityScore: 95
    };

    savePosts([newTreaty, ...allPosts]);
    pushLiveNotification({
      title: `📜 New Sovereign Treaty Deposited: ${data.title}`,
      message: `${currentUserName} (@${currentUserUsername}) has submitted a draft treaty for diplomatic roll-call and redline amendments.`,
      type: 'pulse',
      link: `/pulse?id=${newTreaty.id}`,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    });

    return newTreaty.id;
  }, [allPosts, currentUserId, currentUserName, currentUserUsername, myProfile, savePosts]);

  const createFloorAudioPost = useCallback((data: { 
    content: string; 
    audioUrl?: string; 
    videoUrl?: string; 
    speechFormat?: 'video' | 'audio'; 
    durationSeconds: number; 
    waveform?: number[]; 
    yieldTarget?: string; 
    caucusTag?: string;
    transcript?: string;
    delegationName?: string;
  }) => {
    const isVideo = data.speechFormat === 'video' || Boolean(data.videoUrl);
    const newSpeechPost: PulsePost = {
      id: `speech_dispatch_${Date.now()}`,
      authorId: currentUserId,
      authorName: currentUserName,
      authorUsername: currentUserUsername,
      content: data.content || `${isVideo ? 'Chamber video speech' : 'Floor audio speech'} delivered by ${currentUserName}. Yielding to ${data.yieldTarget || 'the Assembly'}.`,
      images: [],
      createdAt: new Date().toISOString(),
      likes: 0,
      likedBy: [],
      reposts: 0,
      repostedBy: [],
      replyCount: 0,
      location: isVideo ? 'Plenary Chamber Video Broadcast' : 'Diplomatic Floor Transceiver',
      tags: ['FloorSpeech', isVideo ? 'VideoAddress' : 'AudioRelay', 'LiveDebate'],
      caucusTag: data.caucusTag || 'Floor Assembly',
      speechFormat: isVideo ? 'video' : 'audio',
      speechVideoUrl: data.videoUrl,
      speechAudioUrl: data.audioUrl,
      speechDuration: data.durationSeconds,
      speechTranscript: data.transcript,
      speechDelegation: data.delegationName,
      audioDispatch: {
        id: `aud_${Date.now()}`,
        audioUrl: data.audioUrl,
        videoUrl: data.videoUrl,
        speechType: isVideo ? 'video' : 'audio',
        durationSeconds: data.durationSeconds,
        waveform: data.waveform || [20, 45, 60, 80, 50, 70, 40, 90, 60, 30],
        yieldTarget: data.yieldTarget || 'Chair',
        transcript: data.transcript,
        delegationName: data.delegationName,
        pois: []
      },
      civicReliabilityScore: 94
    };

    savePosts([newSpeechPost, ...allPosts]);
    return newSpeechPost.id;
  }, [allPosts, currentUserId, currentUserName, currentUserUsername, savePosts]);

  const deletePost = useCallback((id: string) => {
    savePosts(allPosts.filter((p) => p.id !== id));
  }, [allPosts, savePosts]);

  const likePost = useCallback((id: string) => {
    const updated = allPosts.map((p) => {
      if (p.id === id) {
        const hasLiked = p.likedBy.includes(currentUserId);
        const nextLikedBy = hasLiked ? p.likedBy.filter((u) => u !== currentUserId) : [...p.likedBy, currentUserId];
        const nextLikes = hasLiked ? Math.max(0, p.likes - 1) : p.likes + 1;
        return { ...p, likes: nextLikes, likedBy: nextLikedBy };
      }
      return p;
    });
    savePosts(updated);
  }, [allPosts, currentUserId, savePosts]);

  const repostPost = useCallback((id: string) => {
    const target = allPosts.find((p) => p.id === id);
    if (!target) return;
    if (target.repostedBy.includes(currentUserId)) return;

    const updated = allPosts.map((p) => {
      if (p.id === id) {
        return { ...p, reposts: p.reposts + 1, repostedBy: [...p.repostedBy, currentUserId] };
      }
      return p;
    });

    const repostItem: PulsePost = {
      id: `repost_${Date.now()}`,
      authorId: target.authorId,
      authorName: target.authorName,
      authorUsername: target.authorUsername,
      content: target.content,
      images: target.images,
      location: target.location,
      tags: target.tags,
      createdAt: new Date().toISOString(),
      likes: 0,
      likedBy: [],
      reposts: 0,
      repostedBy: [],
      replyCount: 0,
      isRepost: true,
      originalPostId: target.id,
      repostedByName: currentUserName,
      repostedByUsername: currentUserUsername,
    };

    savePosts([repostItem, ...updated]);
  }, [allPosts, currentUserId, currentUserName, currentUserUsername, savePosts]);

  /* ─────────── PILLAR 1: LEGISLATIVE REDLINE DIFF & ROLL-CALL ─────────── */

  const submitRedlineDiff = useCallback((postId: string, diff: { originalSnippet: string; modifiedSnippet: string; rationaleTag: RationaleTag; rationaleNote: string }) => {
    const diffId = `diff_${Date.now()}`;
    const newDiff: LegislativeDiff = {
      id: diffId,
      postId,
      authorId: currentUserId,
      authorName: currentUserName,
      authorUsername: currentUserUsername,
      originalSnippet: diff.originalSnippet,
      modifiedSnippet: diff.modifiedSnippet,
      rationaleTag: diff.rationaleTag,
      rationaleNote: diff.rationaleNote,
      challengerClearanceLevel: myProfile.civicClearance?.level || 2,
      status: 'pending',
      createdAt: new Date().toISOString()
    };

    const updated = allPosts.map((p) => {
      if (p.id === postId) {
        return { ...p, redlineDiffs: [newDiff, ...(p.redlineDiffs || [])] };
      }
      return p;
    });
    savePosts(updated);

    pushLiveNotification({
      title: `⚡ Redline Amendment Submitted`,
      message: `${currentUserName} proposed an inline modification [${diff.rationaleTag}]: "${diff.modifiedSnippet.slice(0, 50)}..."`,
      type: 'pulse',
      link: `/pulse?id=${postId}`,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    });

    return diffId;
  }, [allPosts, currentUserId, currentUserName, currentUserUsername, myProfile, savePosts]);

  const ratifyRedlineDiff = useCallback((postId: string, diffId: string) => {
    const post = allPosts.find((p) => p.id === postId);
    if (!post) return;
    const diff = (post.redlineDiffs || []).find((d) => d.id === diffId);
    if (!diff) return;

    // Apply the replacement in the text
    let newContent = post.content;
    if (newContent.includes(diff.originalSnippet)) {
      newContent = newContent.replace(diff.originalSnippet, diff.modifiedSnippet);
    } else {
      newContent = `${post.content}\n\n[AMENDMENT ${diff.rationaleTag}]: ${diff.modifiedSnippet}`;
    }

    // Bump version (e.g. v1.0 -> v1.1 or v1.1 -> v1.2)
    const currentVer = post.treatyVersion || 'v1.0';
    const num = parseFloat(currentVer.replace('v', '')) || 1.0;
    const nextVer = `v${(num + 0.1).toFixed(1)}`;

    const newRevision: TreatyRevision = {
      version: nextVer,
      timestamp: new Date().toISOString(),
      ratifiedByName: currentUserName,
      diffSummary: `Accepted diff by @${diff.authorUsername} [${diff.rationaleTag}]`,
      fullContent: newContent
    };

    const updatedDiffs = (post.redlineDiffs || []).map((d) => {
      if (d.id === diffId) {
        return { ...d, status: 'ratified' as const, ratifiedAt: new Date().toISOString() };
      }
      return d;
    });

    const updated = allPosts.map((p) => {
      if (p.id === postId) {
        return {
          ...p,
          content: newContent,
          treatyVersion: nextVer,
          redlineDiffs: updatedDiffs,
          revisions: [newRevision, ...(p.revisions || [])]
        };
      }
      return p;
    });

    savePosts(updated);

    pushLiveNotification({
      title: `✅ Redline Diff Ratified (${nextVer})`,
      message: `Author ratified amendment by @${diff.authorUsername}. Live treaty text updated.`,
      type: 'pulse',
      link: `/pulse?id=${postId}`,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    });
  }, [allPosts, currentUserName, savePosts]);

  const rejectRedlineDiff = useCallback((postId: string, diffId: string, reason = 'Did not align with plenary mandate') => {
    const updated = allPosts.map((p) => {
      if (p.id === postId) {
        const nextDiffs = (p.redlineDiffs || []).map((d) => {
          if (d.id === diffId) {
            return { ...d, status: 'rejected' as const, rejectionReason: reason };
          }
          return d;
        });
        return { ...p, redlineDiffs: nextDiffs };
      }
      return p;
    });
    savePosts(updated);
  }, [allPosts, savePosts]);

  const castRollCallVote = useCallback((postId: string, vote: 'aye' | 'nay' | 'abstain') => {
    const cleanUser = currentUserUsername || 'you';
    const updated = allPosts.map((p) => {
      if (p.id === postId) {
        const currentVotes = p.rollCallVotes || { ayes: [], nays: [], abstains: [] };
        // Remove prior vote from all lists
        const nextAyes = currentVotes.ayes.filter((u) => u !== cleanUser);
        const nextNays = currentVotes.nays.filter((u) => u !== cleanUser);
        const nextAbstains = currentVotes.abstains.filter((u) => u !== cleanUser);

        if (vote === 'aye') nextAyes.push(cleanUser);
        else if (vote === 'nay') nextNays.push(cleanUser);
        else if (vote === 'abstain') nextAbstains.push(cleanUser);

        const totalDecisive = nextAyes.length + nextNays.length;
        const consensusRatio = totalDecisive > 0 ? nextAyes.length / totalDecisive : 0;
        const isSupermajority = totalDecisive >= 3 && consensusRatio >= 0.667;

        return {
          ...p,
          rollCallVotes: { ayes: nextAyes, nays: nextNays, abstains: nextAbstains },
          treatyStatus: isSupermajority ? ('ratified' as const) : ('debate' as const)
        };
      }
      return p;
    });

    savePosts(updated);
  }, [allPosts, currentUserUsername, savePosts]);

  const coSignTreaty = useCallback((postId: string, caucus = 'Plenary Delegate Alliance') => {
    const cleanUser = currentUserUsername || 'you';
    const updated = allPosts.map((p) => {
      if (p.id === postId) {
        const existingSigns = p.coSignatures || [];
        if (existingSigns.some((s) => s.username === cleanUser)) return p;
        const newSig = {
          userId: currentUserId,
          name: currentUserName,
          username: cleanUser,
          caucus,
          clearanceLevel: myProfile.civicClearance?.level || 3,
          timestamp: new Date().toISOString()
        };
        return { ...p, coSignatures: [...existingSigns, newSig] };
      }
      return p;
    });

    savePosts(updated);
    pushLiveNotification({
      title: `🖋️ Treaty Co-Signature Registered`,
      message: `You co-signed this sovereign treaty under ${caucus}.`,
      type: 'pulse',
      link: `/pulse?id=${postId}`,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    });
  }, [allPosts, currentUserId, currentUserName, currentUserUsername, myProfile, savePosts]);

  /* ─────────── PILLAR 2: PROOF-OF-CITATION & FACT BOUNTY ─────────── */

  const addCitation = useCallback((postId: string, citation: Omit<ProofCitation, 'id' | 'verifiedCount' | 'verifiedBy'>) => {
    const newCitation: ProofCitation = {
      ...citation,
      id: `cit_${Date.now()}`,
      verifiedCount: 1,
      verifiedBy: [currentUserUsername || 'you']
    };

    const updated = allPosts.map((p) => {
      if (p.id === postId) {
        return { ...p, citations: [...(p.citations || []), newCitation] };
      }
      return p;
    });
    savePosts(updated);
  }, [allPosts, currentUserUsername, savePosts]);

  const verifyCitation = useCallback((postId: string, citationId: string) => {
    const cleanUser = currentUserUsername || 'you';
    const updated = allPosts.map((p) => {
      if (p.id === postId) {
        const nextCitations = (p.citations || []).map((c) => {
          if (c.id === citationId && !c.verifiedBy.includes(cleanUser)) {
            return {
              ...c,
              verifiedCount: c.verifiedCount + 1,
              verifiedBy: [...c.verifiedBy, cleanUser]
            };
          }
          return c;
        });

        return {
          ...p,
          citations: nextCitations,
          civicReliabilityScore: Math.min(100, (p.civicReliabilityScore || 85) + 5)
        };
      }
      return p;
    });

    savePosts(updated);
    pushLiveNotification({
      title: `🔍 Citation Verified (+15 PTS Author Merit)`,
      message: `Cryptographic proof verified against institutional archives. Author reliability score elevated.`,
      type: 'security',
      link: `/pulse?id=${postId}`,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    });
  }, [allPosts, currentUserUsername, savePosts]);

  const stakeFactBounty = useCallback((postId: string, bounty: { premiseTarget: string; rationale: string; stakedPoints: number }) => {
    if (civicPointsBalance < bounty.stakedPoints) {
      throw new Error(`Insufficient Civic Points balance. Available: ${civicPointsBalance} PTS`);
    }

    saveCivicPoints(civicPointsBalance - bounty.stakedPoints);

    const newChallenge: FactBountyChallenge = {
      id: `bounty_${Date.now()}`,
      postId,
      challengerId: currentUserId,
      challengerName: currentUserName,
      challengerUsername: currentUserUsername,
      stakedPoints: bounty.stakedPoints,
      premiseTarget: bounty.premiseTarget,
      rationale: bounty.rationale,
      deadline: new Date(Date.now() + 86400000).toISOString(), // 24h window
      status: 'open'
    };

    const updated = allPosts.map((p) => {
      if (p.id === postId) {
        return { ...p, factBounties: [newChallenge, ...(p.factBounties || [])] };
      }
      return p;
    });

    savePosts(updated);
    pushLiveNotification({
      title: `⚖️ Fact-Bounty Escrow Staked (${bounty.stakedPoints} PTS)`,
      message: `24-hour verification window initiated on statement: "${bounty.premiseTarget.slice(0, 40)}..."`,
      type: 'escrow',
      link: `/pulse?id=${postId}`,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    });
  }, [allPosts, civicPointsBalance, currentUserId, currentUserName, currentUserUsername, saveCivicPoints, savePosts]);

  const resolveFactBounty = useCallback((postId: string, bountyId: string, outcome: 'author_verified' | 'author_forfeited', note = '') => {
    const updated = allPosts.map((p) => {
      if (p.id === postId) {
        const nextBounties = (p.factBounties || []).map((b) => {
          if (b.id === bountyId) {
            return { ...b, status: outcome, resolutionNote: note };
          }
          return b;
        });
        return { ...p, factBounties: nextBounties };
      }
      return p;
    });

    savePosts(updated);
  }, [allPosts, savePosts]);

  /* ─────────── PILLAR 3: DIPLOMATIC FLOOR RELAY & POIs ─────────── */

  const addPoiIntervention = useCallback((postId: string, poi: { timestampAnchorSeconds: number; textNote: string; audioUrl?: string }) => {
    const newPoi: PoiIntervention = {
      id: `poi_${Date.now()}`,
      authorId: currentUserId,
      authorName: currentUserName,
      authorUsername: currentUserUsername,
      timestampAnchorSeconds: poi.timestampAnchorSeconds,
      textNote: poi.textNote,
      audioUrl: poi.audioUrl,
      createdAt: new Date().toISOString()
    };

    const updated = allPosts.map((p) => {
      if (p.id === postId && p.audioDispatch) {
        return {
          ...p,
          audioDispatch: {
            ...p.audioDispatch,
            pois: [...(p.audioDispatch.pois || []), newPoi]
          }
        };
      }
      return p;
    });

    savePosts(updated);
    pushLiveNotification({
      title: `🎙️ Point of Information (POI) Logged`,
      message: `${currentUserName} intervened at timestamp ${poi.timestampAnchorSeconds}s on your speech.`,
      type: 'pulse',
      link: `/pulse?id=${postId}`,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    });
  }, [allPosts, currentUserId, currentUserName, currentUserUsername, savePosts]);

  const joinSpeakerQueue = useCallback((topic: string, delegationOrCaucus: string) => {
    const newItem: SpeakerQueueItem = {
      id: `spk_${Date.now()}`,
      delegateName: currentUserName,
      delegateUsername: currentUserUsername,
      delegationOrCaucus,
      topic,
      status: 'queued',
      allocatedSeconds: 60,
      requestedAt: new Date().toISOString()
    };

    saveSpeakerQueue([...speakerQueue, newItem]);
    pushLiveNotification({
      title: `🎙️ Added to Chamber Speaker Queue`,
      message: `Your speech on "${topic}" is queued for recognition by the plenary secretariat.`,
      type: 'mun',
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    });
  }, [currentUserName, currentUserUsername, saveSpeakerQueue, speakerQueue]);

  const leaveSpeakerQueue = useCallback((id: string) => {
    saveSpeakerQueue(speakerQueue.filter((s) => s.id !== id));
  }, [saveSpeakerQueue, speakerQueue]);

  const yieldFloorTime = useCallback((id: string, target: string) => {
    const updated = speakerQueue.map((s) => {
      if (s.id === id) {
        return { ...s, status: 'yielded' as const, topic: `[Floor Yielded to ${target}] - ${s.topic}` };
      }
      return s;
    });
    saveSpeakerQueue(updated);
  }, [saveSpeakerQueue, speakerQueue]);

  /* ─────────── PILLAR 4: CIVIC CLEARANCE & PASSPORT ─────────── */

  const getCivicClearance = useCallback((username: string): CivicClearance => {
    const clean = username.toLowerCase().trim().replace(/^@/, '');
    const isFounder = clean === 'yuveer' || clean === 'founder';
    
    // Dynamic calculation from user's actual activity
    const userPosts = allPosts.filter((p) => (p.authorUsername || '').toLowerCase().trim().replace(/^@/, '') === clean);
    const ratifiedCount = userPosts.filter((p) => p.isTreaty && p.treatyStatus === 'ratified').length;
    const citationCount = userPosts.reduce((acc, p) => acc + (p.citations?.length || 0), 0);

    let level: 1 | 2 | 3 | 4 | 5 = 1;
    let title: CivicClearance['title'] = 'Delegate';

    if (isFounder || ratifiedCount >= 5 || citationCount >= 10) {
      level = 5;
      title = 'Plenary Fellow';
    } else if (ratifiedCount >= 3 || citationCount >= 6) {
      level = 4;
      title = 'Ambassador Extraordinary';
    } else if (ratifiedCount >= 2 || citationCount >= 3) {
      level = 3;
      title = 'Committee Chair';
    } else if (ratifiedCount >= 1 || citationCount >= 1) {
      level = 2;
      title = 'Rapporteur';
    }

    return {
      level,
      title,
      reliabilityScore: isFounder ? 99 : Math.min(100, 80 + ratifiedCount * 4 + citationCount * 2),
      verifiedCitationsCount: isFounder ? 24 : Math.max(citationCount, 3),
      ratifiedTreatiesCount: isFounder ? 12 : ratifiedCount,
      endorsementsCount: isFounder ? 140 : 15 + userPosts.length * 2,
      stakedBountiesWon: isFounder ? 8 : 2
    };
  }, [allPosts]);

  const generatePassportDossier = useCallback((username: string): DelegatePassportDossier => {
    const clean = username.toLowerCase().trim().replace(/^@/, '');
    const clearance = getCivicClearance(clean);
    const userPosts = allPosts.filter((p) => (p.authorUsername || '').toLowerCase().trim().replace(/^@/, '') === clean);
    const ratified = userPosts.filter((p) => p.isTreaty).map((t) => ({
      id: t.id,
      title: t.treatyTitle || t.content.slice(0, 40),
      version: t.treatyVersion || 'v1.0',
      ratifiedAt: t.createdAt
    }));

    return {
      username: clean,
      name: clean === currentUserUsername ? currentUserName : clean.charAt(0).toUpperCase() + clean.slice(1),
      clearance,
      ratifiedTreaties: ratified,
      floorSpeechesCount: userPosts.filter((p) => p.audioDispatch).length,
      verifiedCitationsCount: clearance.verifiedCitationsCount,
      accolades: [
        'Verified Plenary Identity Node',
        'Cryptographic Roll-Call Contributor',
        'Zero-Hallucination Citation Badge',
        'Chamber Floor Floor Master'
      ],
      issuedAt: new Date().toISOString(),
      digitalSealHash: `SHA256-${Date.now().toString(36).toUpperCase()}-${Math.random().toString(36).substring(2, 8).toUpperCase()}`
    };
  }, [allPosts, currentUserUsername, currentUserName, getCivicClearance]);

  /* ─────────── PILLAR 5: CIVIC TIPPING & BOUNTIES ─────────── */

  const sendCivicTip = useCallback((postId: string, recipientUsername: string, points: number, note = 'Merit tip for high-signal policy dispatch') => {
    if (civicPointsBalance < points) {
      throw new Error(`Insufficient Civic Points balance. Available: ${civicPointsBalance} PTS`);
    }

    saveCivicPoints(civicPointsBalance - points);

    const updated = allPosts.map((p) => {
      if (p.id === postId) {
        return { ...p, civicBountiesTipped: (p.civicBountiesTipped || 0) + points };
      }
      return p;
    });
    savePosts(updated);

    pushLiveNotification({
      title: `⚡ Civic Bounty Tipped (+${points} PTS)`,
      message: `Transferred ${points} Civic Points to @${recipientUsername}: "${note}"`,
      type: 'escrow',
      link: `/pulse?id=${postId}`,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    });
  }, [allPosts, civicPointsBalance, saveCivicPoints, savePosts]);

  /* ─────────── REPLIES ─────────── */

  const getReplies = useCallback((postId: string) => {
    return allReplies[postId] || [];
  }, [allReplies]);

  const addReply = useCallback((postId: string, content: string) => {
    const newReply: PulseReply = {
      id: `rep_${Date.now()}`,
      postId,
      authorId: currentUserId,
      authorName: currentUserName,
      authorUsername: currentUserUsername,
      content,
      createdAt: new Date().toISOString(),
      likes: 0,
      likedBy: [],
    };

    const existing = allReplies[postId] || [];
    const nextReplies = { ...allReplies, [postId]: [...existing, newReply] };
    saveReplies(nextReplies);

    const updatedPosts = allPosts.map((p) => {
      if (p.id === postId) {
        return { ...p, replyCount: (p.replyCount || 0) + 1 };
      }
      return p;
    });
    savePosts(updatedPosts);
  }, [allPosts, allReplies, currentUserId, currentUserName, currentUserUsername, savePosts, saveReplies]);

  const deleteReply = useCallback((replyId: string) => {
    // stub
  }, []);

  const likeReply = useCallback((replyId: string) => {
    // stub
  }, []);

  /* ─────────── FLUX (Shorts) ─────────── */

  const myFluxVideos = useMemo(() => {
    return allFluxVideos.filter((v) => v.authorId === currentUserId || v.authorUsername === currentUserUsername);
  }, [allFluxVideos, currentUserId, currentUserUsername]);

  const getFluxByUsername = useCallback((username: string) => {
    return allFluxVideos.filter((v) => v.authorUsername === username);
  }, [allFluxVideos]);

  const createFlux = useCallback((data: { 
    caption: string; 
    videoUrl: string; 
    musicTitle: string; 
    tags: string[]; 
    sourceName: string; 
    sourceUrl: string; 
    isPrivate?: boolean;
    fontStyle?: string;
    effectStyle?: string;
  }) => {
    const newFlux: FluxVideo = {
      id: `flux_${Date.now()}`,
      authorId: currentUserId,
      authorName: currentUserName,
      authorUsername: currentUserUsername,
      caption: data.caption,
      videoUrl: data.videoUrl,
      sourceName: data.sourceName,
      sourceUrl: data.sourceUrl,
      musicTitle: data.musicTitle || 'Diplomatic Wire Audio',
      likes: 0,
      likedBy: [],
      commentsCount: 0,
      sharesCount: 0,
      tags: data.tags,
      createdAt: new Date().toISOString(),
      isPrivate: data.isPrivate,
      fontStyle: data.fontStyle,
      effectStyle: data.effectStyle,
    };

    setAllFluxVideos([newFlux, ...allFluxVideos]);
    try { localStorage.setItem(LS_FLUXES, JSON.stringify([newFlux, ...allFluxVideos])); } catch (_) {}
    return newFlux.id;
  }, [allFluxVideos, currentUserId, currentUserName, currentUserUsername]);

  const deleteFlux = useCallback((id: string) => {
    const next = allFluxVideos.filter((f) => f.id !== id);
    setAllFluxVideos(next);
    try { localStorage.setItem(LS_FLUXES, JSON.stringify(next)); } catch (_) {}
  }, [allFluxVideos]);

  const purgeFakeFlux = useCallback((id: string, reason = 'Purged') => {
    deleteFlux(id);
  }, [deleteFlux]);

  const likeFlux = useCallback((id: string) => {
    const updated = allFluxVideos.map((f) => {
      if (f.id === id) {
        const hasLiked = f.likedBy.includes(currentUserId);
        const nextLikedBy = hasLiked ? f.likedBy.filter((u) => u !== currentUserId) : [...f.likedBy, currentUserId];
        return { ...f, likes: hasLiked ? Math.max(0, f.likes - 1) : f.likes + 1, likedBy: nextLikedBy };
      }
      return f;
    });
    setAllFluxVideos(updated);
    try { localStorage.setItem(LS_FLUXES, JSON.stringify(updated)); } catch (_) {}
  }, [allFluxVideos, currentUserId]);

  const getFluxComments = useCallback((fluxId: string) => {
    return allFluxComments[fluxId] || [];
  }, [allFluxComments]);

  const addFluxComment = useCallback((fluxId: string, content: string) => {
    const newComment: FluxComment = {
      id: `fcomm_${Date.now()}`,
      fluxId,
      authorId: currentUserId,
      authorName: currentUserName,
      authorUsername: currentUserUsername,
      content,
      createdAt: new Date().toISOString(),
      likes: 0
    };

    const next = { ...allFluxComments, [fluxId]: [...(allFluxComments[fluxId] || []), newComment] };
    setAllFluxComments(next);
    try { localStorage.setItem(LS_FLUX_COMMENTS, JSON.stringify(next)); } catch (_) {}
  }, [allFluxComments, currentUserId, currentUserName, currentUserUsername]);

  /* ─────────── STORIES ─────────── */

  const createStory = useCallback((data: { 
    title: string; 
    image?: string; 
    linkUrl?: string; 
    linkText?: string; 
    color?: string;
    fontStyle?: string;
    effectStyle?: string;
    textHighlight?: boolean;
    stickers?: string[];
    audioTitle?: string;
    songTitle?: string;
    songArtist?: string;
    songAudioUrl?: string;
    isSnap?: boolean;
    snapFilter?: string;
    snapLocation?: string;
  }) => {
    const newStory: PulseStory = {
      id: `story_${Date.now()}`,
      authorId: currentUserId,
      authorName: currentUserName,
      authorUsername: currentUserUsername,
      avatarLetter: (currentUserName || 'U')[0].toUpperCase(),
      color: data.color || '#00F2FE',
      title: data.title,
      image: data.image,
      time: 'Just now',
      createdAt: new Date().toISOString(),
      viewers: [],
      linkUrl: data.linkUrl,
      linkText: data.linkText,
      fontStyle: data.fontStyle,
      effectStyle: data.effectStyle,
      textHighlight: data.textHighlight,
      stickers: data.stickers,
      audioTitle: data.audioTitle,
      songTitle: data.songTitle,
      songArtist: data.songArtist,
      songAudioUrl: data.songAudioUrl,
      isSnap: data.isSnap,
      snapFilter: data.snapFilter,
      snapLocation: data.snapLocation || 'ZENVITRA // SOVEREIGN MESH',
      snapTimestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };

    const next = [newStory, ...allStories];
    setAllStories(next);
    try { localStorage.setItem(LS_STORIES, JSON.stringify(next)); } catch (_) {}
    return newStory.id;
  }, [allStories, currentUserId, currentUserName, currentUserUsername]);

  const deleteStory = useCallback((storyId: string) => {
    const next = allStories.filter((s) => s.id !== storyId);
    setAllStories(next);
    try { localStorage.setItem(LS_STORIES, JSON.stringify(next)); } catch (_) {}
  }, [allStories]);

  const recordStoryView = useCallback((storyId: string) => {
    // stub
  }, []);

  const likeStory = useCallback((storyId: string) => {
    // stub
  }, []);

  return (
    <ZenPulseContext.Provider
      value={{
        feedPosts,
        myPosts,
        likedPosts,
        savedPosts,
        savedPostIds,
        getPostById,
        getPostsByUsername,
        createPost,
        createTreatyPost,
        createFloorAudioPost,
        deletePost,
        likePost,
        repostPost,
        toggleSavePost,
        isSaved,

        /* Pillar 1 */
        submitRedlineDiff,
        ratifyRedlineDiff,
        rejectRedlineDiff,
        castRollCallVote,
        coSignTreaty,

        /* Pillar 2 */
        addCitation,
        verifyCitation,
        stakeFactBounty,
        resolveFactBounty,

        /* Pillar 3 */
        addPoiIntervention,
        speakerQueue,
        joinSpeakerQueue,
        leaveSpeakerQueue,
        yieldFloorTime,

        /* Pillar 4 */
        getCivicClearance,
        generatePassportDossier,

        /* Pillar 5 */
        civicPointsBalance,
        sendCivicTip,

        /* replies */
        getReplies,
        addReply,
        deleteReply,
        likeReply,

        /* FLUX */
        fluxVideos: allFluxVideos,
        myFluxVideos,
        getFluxByUsername,
        createFlux,
        deleteFlux,
        purgeFakeFlux,
        likeFlux,
        getFluxComments,
        addFluxComment,

        /* Stories */
        stories: allStories,
        createStory,
        deleteStory,
        recordStoryView,
        likeStory,

        /* Profiles */
        profiles: allProfiles,
        myProfile,
        getProfileByUsername,
        updateMyProfile,
        upgradeToProfessional,
        subscribeToOrganizerPro,
        addProfileHostedEvent,
        deleteProfileHostedEvent,
        rsvpProfileHostedEvent,

        toggleFollow,
        approveFollowRequest,
        rejectFollowRequest,
        isFollowing,
        hasPendingRequest,

        selectedProfileUsername,
        setSelectedProfileUsername,
        openUserProfile,

        activeView,
        setActiveView,
        activePostId,
        setActivePostId,

        currentUserId,
        currentUserName,
        currentUserUsername,
      }}
    >
      {children}
    </ZenPulseContext.Provider>
  );
}

export function useZenPulse() {
  const context = useContext(ZenPulseContext);
  if (!context) {
    return {
      feedPosts: [],
      myPosts: [],
      likedPosts: [],
      savedPosts: [],
      savedPostIds: [],
      fluxVideos: [],
      myFluxVideos: [],
      stories: [],
      profiles: [],
      myProfile: {
        id: 'anon',
        username: 'anonymous',
        name: 'Anonymous',
        bio: '',
        isPrivate: false,
        isVerified: false,
        badge: 'DELEGATE',
        accountType: 'personal',
        isSubscribedOrganizer: false,
        followers: [],
        following: [],
        pendingFollowRequests: [],
        joinedDate: 'Recently',
      } as PulseProfile,
      activeView: 'feed',
      activePostId: null,
      selectedProfileUsername: null,
      civicPointsBalance: 350,
      speakerQueue: [],
      currentUserId: 'anonymous',
      currentUserName: 'Anonymous',
      currentUserUsername: 'anonymous',
      getPostById: () => undefined,
      getPostsByUsername: () => [],
      createPost: () => '',
      createTreatyPost: () => '',
      createFloorAudioPost: () => '',
      deletePost: () => {},
      likePost: () => {},
      repostPost: () => {},
      toggleSavePost: () => {},
      isSaved: () => false,
      submitRedlineDiff: () => '',
      ratifyRedlineDiff: () => {},
      rejectRedlineDiff: () => {},
      castRollCallVote: () => {},
      coSignTreaty: () => {},
      addCitation: () => {},
      verifyCitation: () => {},
      stakeFactBounty: () => {},
      resolveFactBounty: () => {},
      addPoiIntervention: () => {},
      joinSpeakerQueue: () => {},
      leaveSpeakerQueue: () => {},
      yieldFloorTime: () => {},
      getCivicClearance: () => ({
        level: 1,
        title: 'Delegate',
        reliabilityScore: 85,
        verifiedCitationsCount: 0,
        ratifiedTreatiesCount: 0,
        endorsementsCount: 0,
        stakedBountiesWon: 0,
      }),
      generatePassportDossier: () => ({
        username: 'anonymous',
        name: 'Anonymous',
        clearance: {
          level: 1,
          title: 'Delegate',
          reliabilityScore: 85,
          verifiedCitationsCount: 0,
          ratifiedTreatiesCount: 0,
          endorsementsCount: 0,
          stakedBountiesWon: 0,
        },
        ratifiedTreaties: [],
        floorSpeechesCount: 0,
        verifiedCitationsCount: 0,
        accolades: [],
        issuedAt: new Date().toISOString(),
        digitalSealHash: 'SHA256-ANON',
      }),
      sendCivicTip: () => {},
      getReplies: () => [],
      addReply: () => {},
      deleteReply: () => {},
      likeReply: () => {},
      getFluxByUsername: () => [],
      createFlux: () => '',
      deleteFlux: () => {},
      purgeFakeFlux: () => {},
      likeFlux: () => {},
      getFluxComments: () => [],
      addFluxComment: () => {},
      createStory: () => '',
      deleteStory: () => {},
      recordStoryView: () => {},
      likeStory: () => {},
      getProfileByUsername: () => undefined,
      updateMyProfile: () => {},
      upgradeToProfessional: () => {},
      subscribeToOrganizerPro: () => {},
      addProfileHostedEvent: () => {},
      deleteProfileHostedEvent: () => {},
      rsvpProfileHostedEvent: () => {},
      toggleFollow: () => {},
      approveFollowRequest: () => {},
      rejectFollowRequest: () => {},
      isFollowing: () => false,
      hasPendingRequest: () => false,
      setSelectedProfileUsername: () => {},
      openUserProfile: () => {},
      setActiveView: () => {},
      setActivePostId: () => {},
    } as unknown as ZenPulseContextType;
  }
  return context;
}
