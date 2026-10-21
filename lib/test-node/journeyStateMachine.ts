/**
 * ZENVITRA TEST NODE — GUIDED JOURNEY STATE MACHINE
 * Section 4A: Concrete Demo User Journey (J00 to J11)
 *
 * Implements a deterministic, resumable, event-driven state machine for the
 * 12-step guided interactive walkthrough across the isolated sandbox.
 * Zero database writes. State strictly persisted in client-side storage.
 */

export type JourneyStepId =
  | 'J00_DISCOVER'
  | 'J01_IDENTITY'
  | 'J02_PULSE'
  | 'J03_EVENT'
  | 'J04_PAYMENT'
  | 'J05_SECRETARIAT'
  | 'J06_COMMITTEE'
  | 'J07_COMMUNICATION'
  | 'J08_SOLUTIONS'
  | 'J09_ECOSYSTEM'
  | 'J10_SUMMARY'
  | 'J11_EXIT';

export type StepStatus = 'LOCKED' | 'AVAILABLE' | 'IN_PROGRESS' | 'COMPLETED' | 'SKIPPED' | 'FAILED';

export type DemoRole = 'DELEGATE' | 'EXECUTIVE_BOARD' | 'SECRETARIAT' | 'ORGANISER' | 'COMMUNITY_MEMBER';

export interface StepDefinition {
  id: JourneyStepId;
  stepNumber: number; // 0 to 11
  displayStep: number; // 1 to 12
  title: string;
  subtitle: string;
  description: string;
  appName: string;
  requiredRole: DemoRole;
  isOptional: boolean;
  objective: string;
  checklist: string[];
  route: string;
  actionPrompt: string;
  accentColor: string;
}

export interface DemoPersonaProfile {
  id: string;
  name: string;
  handle: string;
  role: DemoRole;
  roleTitle: string;
  organization: string;
  avatar: string;
  bio: string;
  credentials: string[];
}

export interface JourneyInteractions {
  hasLikedPost: boolean;
  hasCommented: boolean;
  hasVotedPoll: boolean;
  hasViewedPassport: boolean;
  registeredCommitteeId?: string;
  registrationName?: string;
  paymentStatus?: 'SUCCESS' | 'PENDING' | 'FAILED' | 'REFUNDED';
  paymentTxnId?: string;
  hasReviewedEbApp: boolean;
  hasApprovedEbApp: boolean;
  hasPostedAnnouncement: boolean;
  hasRaisedMotion: boolean;
  hasJoinedSpeakersList: boolean;
  hasVotedResolution: boolean;
  hasSentChatMessage: boolean;
  hasTestedMeet: boolean;
  hasContributedPolicy: boolean;
  hasVotedPolicy: boolean;
  hasExportedPolicyDoc: boolean;
  exploredAppsCount: number;
}

export interface JourneySession {
  sessionId: string;
  version: number;
  currentStepId: JourneyStepId;
  stepStatuses: Record<JourneyStepId, StepStatus>;
  activeRole: DemoRole;
  activePersona: DemoPersonaProfile;
  interactions: JourneyInteractions;
  startedAt: string;
  completedAt?: string;
  lastUpdated: string;
  mode: 'GUIDED' | 'FREE_EXPLORE';
}

export const DEMO_PERSONAS: Record<DemoRole, DemoPersonaProfile> = {
  DELEGATE: {
    id: 'persona_aanya_delegate',
    name: 'Aanya Sharma',
    handle: '@aanya.demo',
    role: 'DELEGATE',
    roleTitle: 'Chief Delegate & Policy Envoy',
    organization: 'ZENVITRA Demo Community',
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=256&q=80',
    bio: 'Passionate youth diplomat specializing in international public health, governance frameworks, and youth empowerment.',
    credentials: ['Verified Sandbox Envoy', 'Best Delegate Simulation 2025', 'Charter Diplomat Rank IV'],
  },
  EXECUTIVE_BOARD: {
    id: 'persona_rohan_eb',
    name: 'Rohan Mehra',
    handle: '@rohan.eb',
    role: 'EXECUTIVE_BOARD',
    roleTitle: 'Committee Chairperson',
    organization: 'ZENVITRA Academic Directorate',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=256&q=80',
    bio: 'Presiding Officer for the All India Political Parties Meet (AIPPM) with 15+ simulated committee sessions moderated.',
    credentials: ['Dais Excellence Award', 'Parliamentary Rules Certified', 'Senior Moderator'],
  },
  SECRETARIAT: {
    id: 'persona_kavita_sec',
    name: 'Kavita Nair',
    handle: '@kavita.sec',
    role: 'SECRETARIAT',
    roleTitle: 'Secretary-General',
    organization: 'ZENVITRA Global Secretariat',
    avatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=256&q=80',
    bio: 'Leading the ZENVITRA Demo MUN 2026 organizing apparatus, overseeing logistics, committee oversight, and delegate experience.',
    credentials: ['SecGen Rank 1', 'Summit Marshal 2025', 'Operations Architect'],
  },
  ORGANISER: {
    id: 'persona_vikram_org',
    name: 'Vikram Patel',
    handle: '@vikram.org',
    role: 'ORGANISER',
    roleTitle: 'Director General of Logistics & Finance',
    organization: 'ZENVITRA Event Organisers Guild',
    avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=256&q=80',
    bio: 'Directing venue allocation, tier ticketing flows, Cashfree payment pipelines, and partner institutional liaisons.',
    credentials: ['FinOps Director', 'Certified Event Producer', 'ZenPass Host Badge'],
  },
  COMMUNITY_MEMBER: {
    id: 'persona_tanya_comm',
    name: 'Tanya Sengupta',
    handle: '@tanya.pulse',
    role: 'COMMUNITY_MEMBER',
    roleTitle: 'Civic Thinker & Youth Columnist',
    organization: 'ZENVITRA Open Assembly',
    avatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=256&q=80',
    bio: 'Active civic contributor on ZEN.PULSE exploring sustainable development goals, youth engagement, and educational summits.',
    credentials: ['Top Pulse Columnist', 'Civic Pollster of the Month', 'Community Fellow'],
  },
};

export const JOURNEY_STEPS: StepDefinition[] = [
  {
    id: 'J00_DISCOVER',
    stepNumber: 0,
    displayStep: 1,
    title: 'Discover the Test Node',
    subtitle: 'The 3D Code Orb Emerges Outside Live Production',
    description: 'Welcome to the ZENVITRA Test Node. Experience a parallel digital universe populated with synthetic conferences, chambers, payments, and policy studios.',
    appName: 'TEST NODE GATEWAY',
    requiredRole: 'DELEGATE',
    isOptional: false,
    objective: 'Launch the guided journey or inspect the floating spherical code orb.',
    checklist: [
      'Observe the spherical orbital code engine',
      'Read the Sandbox Isolation Disclosure',
      'Select START GUIDED DEMO to begin the structured walkthrough',
    ],
    route: '/test-node',
    actionPrompt: 'Initialize Test Node',
    accentColor: 'indigo',
  },
  {
    id: 'J01_IDENTITY',
    stepNumber: 1,
    displayStep: 2,
    title: 'Enter as a Demo User',
    subtitle: 'Select Your Fictional Identity and Role Perspective',
    description: 'Assume the persona of Aanya Sharma (@aanya.demo) or switch between 5 authentic diplomatic roles to unlock specialized capabilities.',
    appName: 'ZEN.AUTH SIMULATOR',
    requiredRole: 'DELEGATE',
    isOptional: false,
    objective: 'Select a persona role and establish your sandbox session.',
    checklist: [
      'Review the demo profile for Aanya Sharma (@aanya.demo)',
      'Explore role permissions (Delegate, Executive Board, Secretariat, Organiser, Community)',
      'Confirm demo identity without any real account creation',
    ],
    route: '/test-node/journey',
    actionPrompt: 'Confirm Demo Identity',
    accentColor: 'blue',
  },
  {
    id: 'J02_PULSE',
    stepNumber: 2,
    displayStep: 3,
    title: 'Explore ZEN.PULSE & ZEN.PASSPORT',
    subtitle: 'Engage with Synthetic Community Discussions & Diplomatic Passports',
    description: 'Interact with community posts, vote in civic polls, view verifiable achievement passports, and inspect the youth summit leaderboard.',
    appName: 'ZEN.PULSE & ZEN.PASSPORT',
    requiredRole: 'DELEGATE',
    isOptional: false,
    objective: 'React to a post, vote in a live poll, and inspect your digital passport credentials.',
    checklist: [
      'React to or comment on a synthetic community post',
      'Cast a vote in the Youth Governance Policy Poll',
      'Open the demo ZEN.PASSPORT to inspect diplomatic credentials and tier status',
    ],
    route: '/test-node/pulse',
    actionPrompt: 'Interact & Check Passport',
    accentColor: 'emerald',
  },
  {
    id: 'J03_EVENT',
    stepNumber: 3,
    displayStep: 4,
    title: 'Discover & Register for Demo MUN',
    subtitle: 'Select Committee & Submit Simulated Delegate Application',
    description: 'Discover the ZENVITRA DEMO MUN 2026 conference. Explore committees like AIPPM, review background guides, and complete a simulated registration.',
    appName: 'ZEN.MUN DISCOVERY',
    requiredRole: 'DELEGATE',
    isOptional: false,
    objective: 'Select AIPPM (All India Political Parties Meet) and submit a simulated delegate registration.',
    checklist: [
      'Inspect conference timeline and committee matrices',
      'Select AIPPM committee and portfolio preferences',
      'Submit simulated registration form and receive sandbox application ID',
    ],
    route: '/test-node/mun',
    actionPrompt: 'Register for Demo MUN',
    accentColor: 'violet',
  },
  {
    id: 'J04_PAYMENT',
    stepNumber: 4,
    displayStep: 5,
    title: 'Experience Mock Checkout & Ticketing',
    subtitle: 'Simulate Cashfree PG Flow & Receive Watermarked Demo Receipt',
    description: 'Test the ₹199 delegate registration checkout flow. Simulate success, pending, failure, and refund states with complete sandbox invoice generation.',
    appName: 'ZEN.PAY SIMULATOR',
    requiredRole: 'DELEGATE',
    isOptional: false,
    objective: 'Complete a successful simulated transaction and inspect the DEMO-INV-1001 receipt.',
    checklist: [
      'Open simulated Cashfree Payment Gateway',
      'Select UPI / Card / NetBanking simulation mode',
      'Trigger "Simulate Payment Success" to generate DEMO-INV-1001',
      'Verify watermarked sandbox receipt and access pass',
    ],
    route: '/test-node/payments',
    actionPrompt: 'Complete Mock Checkout',
    accentColor: 'amber',
  },
  {
    id: 'J05_SECRETARIAT',
    stepNumber: 5,
    displayStep: 6,
    title: 'Switch to Secretariat Perspective',
    subtitle: 'Lead Executive Recruitment & Broadcast Administrative Directives',
    description: 'Experience ZEN.SEC through the eyes of Secretary-General Kavita Nair. Review incoming EB candidate applications, approve allocations, and post notices.',
    appName: 'ZEN.SEC PORTAL',
    requiredRole: 'SECRETARIAT',
    isOptional: false,
    objective: 'Switch to Secretariat role, review an EB application, and broadcast an announcement.',
    checklist: [
      'Switch active role to SECRETARIAT',
      'Review pending Executive Board application for AIPPM Chair',
      'Render an official APPROVAL or REJECTION decision',
      'Broadcast a global secretariat bulletin to delegates',
    ],
    route: '/test-node/sec',
    actionPrompt: 'Review EB & Announce',
    accentColor: 'rose',
  },
  {
    id: 'J06_COMMITTEE',
    stepNumber: 6,
    displayStep: 7,
    title: 'Enter a Committee Session',
    subtitle: 'Experience Live Dais Parliamentary Operations & Roll-Call Voting',
    description: 'Return to Delegate Aanya Sharma inside the AIPPM committee room. Raise a formal caucus motion, join the speakers list, and cast a vote on draft resolutions.',
    appName: 'ZEN.MUN CHAMBER',
    requiredRole: 'DELEGATE',
    isOptional: false,
    objective: 'Raise a moderated caucus motion, enter the speaker queue, and cast an AYE vote.',
    checklist: [
      'Return role to DELEGATE and enter the AIPPM chamber',
      'Raise a formal motion for Moderated Caucus on Youth Healthcare Frameworks',
      'Add delegate to the active Speakers List',
      'Inspect Draft Resolution AIPPM-RES-01 and cast an AYE/NAY vote',
    ],
    route: '/test-node/mun',
    actionPrompt: 'Participate in Chamber',
    accentColor: 'cyan',
  },
  {
    id: 'J07_COMMUNICATION',
    stepNumber: 7,
    displayStep: 8,
    title: 'Test Communications & Collaboration',
    subtitle: 'Real-Time Diplomatic Backchannels & Encrypted Audio-Visual Meet',
    description: 'Test the multi-channel communication suite: dispatch a caucus backchannel note in ZEN.CHAT, observe simulated bot replies, and inspect the ZEN.MEET dais room.',
    appName: 'ZEN.COMMUNICATIONS',
    requiredRole: 'DELEGATE',
    isOptional: true,
    objective: 'Send a message in the AIPPM backchannel and simulate entering the live committee audio room.',
    checklist: [
      'Send a diplomatic dispatch in the #aippm-caucus channel',
      'Receive simulated delegate reply',
      'Inspect the simulated ZEN.MEET dais audio-visual controls',
    ],
    route: '/test-node/chat',
    actionPrompt: 'Dispatch Message & Probe Meet',
    accentColor: 'teal',
  },
  {
    id: 'J08_SOLUTIONS',
    stepNumber: 8,
    displayStep: 9,
    title: 'Participate in ZEN.SOLUTIONS',
    subtitle: 'From Youth Discussion to Enacted Policy & Watermarked PDF Export',
    description: 'Formulate policy on National Youth Mental Health Support. Submit policy clause, simulate roll-call tally, preview in ZEN.DOCS, and export the watermarked draft.',
    appName: 'ZEN.SOLUTIONS & DOCS',
    requiredRole: 'DELEGATE',
    isOptional: false,
    objective: 'Contribute a policy clause, cast a roll-call vote, and export the official demo document.',
    checklist: [
      'Contribute an operative clause to the Youth Health Policy draft',
      'Vote on enactment in the interactive assembly floor',
      'Preview document in ZEN.DOCS with ISO formatting and digital signatures',
      'Export watermarked demonstration PDF document',
    ],
    route: '/test-node/solutions',
    actionPrompt: 'Draft & Export Policy',
    accentColor: 'indigo',
  },
  {
    id: 'J09_ECOSYSTEM',
    stepNumber: 9,
    displayStep: 10,
    title: 'Discover the Broader Ecosystem',
    subtitle: 'Interactive Matrix of All 14 Connected ZENVITRA Applications',
    description: 'Explore the full panorama of ZENVITRA apps (ZEN.PRESS, ZEN.MAPS, ZEN.LEGAL, ZEN.RESEARCH, ZEN.DOCS) categorized by readiness: Interactive, Prototype, Planned.',
    appName: 'ZEN.APPS ECOSYSTEM',
    requiredRole: 'COMMUNITY_MEMBER',
    isOptional: true,
    objective: 'Inspect the ecosystem map and launch at least one auxiliary application preview.',
    checklist: [
      'Explore the interactive grid of all 14 ZEN.APPS',
      'Filter apps by status (Interactive Sandbox, Live Prototype, Architecture Planned)',
      'Launch an auxiliary application simulator',
    ],
    route: '/test-node/apps',
    actionPrompt: 'Explore Ecosystem Matrix',
    accentColor: 'purple',
  },
  {
    id: 'J10_SUMMARY',
    stepNumber: 10,
    displayStep: 11,
    title: 'Review Demo Impact & Summary',
    subtitle: 'Your Personalized Sandbox Achievement Telemetry & Audit Record',
    description: 'Review your personalized demo report synthesized directly from actions taken in this session: committee votes cast, mock invoices settled, and policies authored.',
    appName: 'DEMO IMPACT SUMMARY',
    requiredRole: 'DELEGATE',
    isOptional: false,
    objective: 'Inspect your personalized telemetry record and decide next step.',
    checklist: [
      'Audit your session metrics (Votes cast, Invoices settled, Policies enacted)',
      'Inspect simulated trust score and achievement passport badges',
      'Choose whether to replay, explore freely, or return to live ZENVITRA',
    ],
    route: '/test-node/journey',
    actionPrompt: 'Review Audit Telemetry',
    accentColor: 'sky',
  },
  {
    id: 'J11_EXIT',
    stepNumber: 11,
    displayStep: 12,
    title: 'Return to Real ZENVITRA',
    subtitle: 'Zero Data Migration — Production Database 100% Intact',
    description: 'Exit the sandbox cleanly. All synthetic sessions remain strictly confined to local storage. Your real ZENVITRA account and production databases remain pristine.',
    appName: 'ZENVITRA MAINFRAME',
    requiredRole: 'DELEGATE',
    isOptional: false,
    objective: 'Conclude the demo journey and return safely to the live ZENVITRA homepage.',
    checklist: [
      'Verify sandbox data isolation guarantee',
      'Confirm no mock records were written to production',
      'Safely navigate back to the live platform homepage',
    ],
    route: '/',
    actionPrompt: 'Return to Live Platform',
    accentColor: 'slate',
  },
];

export const JOURNEY_STORAGE_KEY = 'zenvitra_journey_session_v1';

export function createInitialJourneySession(): JourneySession {
  const initialStatuses: Record<JourneyStepId, StepStatus> = {
    J00_DISCOVER: 'AVAILABLE',
    J01_IDENTITY: 'LOCKED',
    J02_PULSE: 'LOCKED',
    J03_EVENT: 'LOCKED',
    J04_PAYMENT: 'LOCKED',
    J05_SECRETARIAT: 'LOCKED',
    J06_COMMITTEE: 'LOCKED',
    J07_COMMUNICATION: 'LOCKED',
    J08_SOLUTIONS: 'LOCKED',
    J09_ECOSYSTEM: 'LOCKED',
    J10_SUMMARY: 'LOCKED',
    J11_EXIT: 'LOCKED',
  };

  return {
    sessionId: `test_node_session_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`,
    version: 1,
    currentStepId: 'J00_DISCOVER',
    stepStatuses: initialStatuses,
    activeRole: 'DELEGATE',
    activePersona: DEMO_PERSONAS.DELEGATE,
    interactions: {
      hasLikedPost: false,
      hasCommented: false,
      hasVotedPoll: false,
      hasViewedPassport: false,
      hasReviewedEbApp: false,
      hasApprovedEbApp: false,
      hasPostedAnnouncement: false,
      hasRaisedMotion: false,
      hasJoinedSpeakersList: false,
      hasVotedResolution: false,
      hasSentChatMessage: false,
      hasTestedMeet: false,
      hasContributedPolicy: false,
      hasVotedPolicy: false,
      hasExportedPolicyDoc: false,
      exploredAppsCount: 0,
    },
    startedAt: new Date().toISOString(),
    lastUpdated: new Date().toISOString(),
    mode: 'GUIDED',
  };
}

export function calculateProgress(session: JourneySession): number {
  const requiredSteps = JOURNEY_STEPS.filter((s) => !s.isOptional && s.id !== 'J11_EXIT');
  const completedRequired = requiredSteps.filter(
    (s) => session.stepStatuses[s.id] === 'COMPLETED'
  ).length;

  return Math.round((completedRequired / requiredSteps.length) * 100);
}

export type JourneyActionType =
  | 'START_GUIDED_DEMO'
  | 'SWITCH_MODE'
  | 'SET_ROLE'
  | 'ADVANCE_STEP'
  | 'GO_BACK_STEP'
  | 'SKIP_STEP'
  | 'JUMP_TO_STEP'
  | 'RECORD_INTERACTION'
  | 'COMPLETE_STEP'
  | 'RESET_JOURNEY';

export function transitionJourney(
  session: JourneySession,
  action: { type: JourneyActionType; payload?: any }
): JourneySession {
  const now = new Date().toISOString();
  const nextSession = { ...session, lastUpdated: now, version: session.version + 1 };

  switch (action.type) {
    case 'START_GUIDED_DEMO': {
      nextSession.mode = 'GUIDED';
      nextSession.stepStatuses.J00_DISCOVER = 'COMPLETED';
      nextSession.stepStatuses.J01_IDENTITY = 'AVAILABLE';
      nextSession.currentStepId = 'J01_IDENTITY';
      return nextSession;
    }

    case 'SWITCH_MODE': {
      nextSession.mode = action.payload.mode;
      return nextSession;
    }

    case 'SET_ROLE': {
      const role = action.payload.role as DemoRole;
      nextSession.activeRole = role;
      nextSession.activePersona = DEMO_PERSONAS[role] || DEMO_PERSONAS.DELEGATE;
      return nextSession;
    }

    case 'RECORD_INTERACTION': {
      nextSession.interactions = {
        ...nextSession.interactions,
        ...action.payload,
      };
      return nextSession;
    }

    case 'COMPLETE_STEP': {
      const stepId = (action.payload?.stepId || session.currentStepId) as JourneyStepId;
      const currentIndex = JOURNEY_STEPS.findIndex((s) => s.id === stepId);

      const updatedStatuses: Record<JourneyStepId, StepStatus> = { ...nextSession.stepStatuses };
      updatedStatuses[stepId] = 'COMPLETED';

      // Unlock next step if available
      if (currentIndex >= 0 && currentIndex < JOURNEY_STEPS.length - 1) {
        const nextStep = JOURNEY_STEPS[currentIndex + 1];
        if (updatedStatuses[nextStep.id] === 'LOCKED') {
          updatedStatuses[nextStep.id] = 'AVAILABLE';
        }
        nextSession.currentStepId = nextStep.id;

        // Auto-switch persona if the step strictly requires a different role
        if (nextStep.requiredRole && nextStep.requiredRole !== nextSession.activeRole) {
          nextSession.activeRole = nextStep.requiredRole;
          nextSession.activePersona = DEMO_PERSONAS[nextStep.requiredRole];
        }
      }

      nextSession.stepStatuses = updatedStatuses;

      if (stepId === 'J10_SUMMARY') {
        nextSession.completedAt = now;
      }

      return nextSession;
    }

    case 'SKIP_STEP': {
      const stepId = (action.payload?.stepId || session.currentStepId) as JourneyStepId;
      const currentStep = JOURNEY_STEPS.find((s) => s.id === stepId);
      if (!currentStep?.isOptional) {
        return session; // Cannot skip mandatory step
      }

      const currentIndex = JOURNEY_STEPS.findIndex((s) => s.id === stepId);
      const updatedStatuses: Record<JourneyStepId, StepStatus> = { ...nextSession.stepStatuses };
      updatedStatuses[stepId] = 'SKIPPED';

      if (currentIndex >= 0 && currentIndex < JOURNEY_STEPS.length - 1) {
        const nextStep = JOURNEY_STEPS[currentIndex + 1];
        if (updatedStatuses[nextStep.id] === 'LOCKED') {
          updatedStatuses[nextStep.id] = 'AVAILABLE';
        }
        nextSession.currentStepId = nextStep.id;
      }

      nextSession.stepStatuses = updatedStatuses;
      return nextSession;
    }

    case 'GO_BACK_STEP': {
      const currentIndex = JOURNEY_STEPS.findIndex((s) => s.id === session.currentStepId);
      if (currentIndex > 0) {
        const prevStep = JOURNEY_STEPS[currentIndex - 1];
        nextSession.currentStepId = prevStep.id;
        if (prevStep.requiredRole && prevStep.requiredRole !== nextSession.activeRole) {
          nextSession.activeRole = prevStep.requiredRole;
          nextSession.activePersona = DEMO_PERSONAS[prevStep.requiredRole];
        }
      }
      return nextSession;
    }

    case 'ADVANCE_STEP': {
      const currentIndex = JOURNEY_STEPS.findIndex((s) => s.id === session.currentStepId);
      if (currentIndex < JOURNEY_STEPS.length - 1) {
        const nextStep = JOURNEY_STEPS[currentIndex + 1];
        nextSession.currentStepId = nextStep.id;
        if (nextSession.stepStatuses[nextStep.id] === 'LOCKED') {
          nextSession.stepStatuses[nextStep.id] = 'AVAILABLE';
        }
        if (nextStep.requiredRole && nextStep.requiredRole !== nextSession.activeRole) {
          nextSession.activeRole = nextStep.requiredRole;
          nextSession.activePersona = DEMO_PERSONAS[nextStep.requiredRole];
        }
      }
      return nextSession;
    }

    case 'JUMP_TO_STEP': {
      const targetStepId = action.payload.stepId as JourneyStepId;
      const targetStep = JOURNEY_STEPS.find((s) => s.id === targetStepId);
      if (!targetStep) return session;

      nextSession.currentStepId = targetStepId;
      if (nextSession.stepStatuses[targetStepId] === 'LOCKED') {
        nextSession.stepStatuses[targetStepId] = 'AVAILABLE';
      }
      if (targetStep.requiredRole && targetStep.requiredRole !== nextSession.activeRole) {
        nextSession.activeRole = targetStep.requiredRole;
        nextSession.activePersona = DEMO_PERSONAS[targetStep.requiredRole];
      }
      return nextSession;
    }

    case 'RESET_JOURNEY': {
      return createInitialJourneySession();
    }

    default:
      return session;
  }
}
