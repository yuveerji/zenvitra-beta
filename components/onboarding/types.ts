export type OnboardingSceneId =
  | 'welcome'
  | 'rewards'
  | 'platform'
  | 'home'
  | 'events'
  | 'journey'
  | 'ecosystem'
  | 'test_node'
  | 'identity'
  | 'community'
  | 'subscriptions'
  | 'first_5_minutes'
  | 'final_trailer';

export interface OnboardingState {
  completed: boolean;
  skipped: boolean;
  version: string;
  completedAt?: number;
  lastSeenScene?: OnboardingSceneId;
}

export type UserRoleTrack = 'delegate' | 'secretariat' | 'organizer' | 'general';

export interface SceneMeta {
  id: OnboardingSceneId;
  number: string;
  title: string;
  label: string;
}

export const ONBOARDING_SCENES: SceneMeta[] = [
  { id: 'welcome', number: '00', title: 'WELCOME', label: 'ENTRY' },
  { id: 'platform', number: '01', title: 'THIS IS ZENVITRA', label: 'THE PLATFORM' },
  { id: 'home', number: '02', title: 'YOUR HOME', label: 'COMMAND CENTER' },
  { id: 'events', number: '03', title: 'EVENTS & PARTICIPATION', label: 'DISCOVER & REGISTER' },
  { id: 'journey', number: '04', title: 'YOUR EVENT JOURNEY', label: 'WHAT HAPPENS NEXT' },
  { id: 'ecosystem', number: '05', title: 'THE ECOSYSTEM', label: 'ONE PLATFORM. MANY SPACES.' },
  { id: 'test_node', number: '06', title: 'ZENVITRA TEST NODE', label: 'THE PARALLEL SANDBOX' },
  { id: 'rewards', number: '07', title: "OH, SO YOU ARE BACK! LET'S CONTINUE, LET'S REDEEM YOUR REWARDS", label: 'REDEEM REWARDS' },
  { id: 'identity', number: '08', title: 'YOUR IDENTITY & PASSPORT', label: 'YOUR PROFILE' },
  { id: 'community', number: '09', title: 'COMMUNITY & EXPRESSION', label: 'PULSE & FLUX' },
  { id: 'subscriptions', number: '10', title: 'TOPICS & CATEGORIES', label: 'REAL-TIME DISPATCHES' },
  { id: 'first_5_minutes', number: '11', title: 'FIRST 5 MINUTES', label: 'ACTION CHECKLIST' },
  { id: 'final_trailer', number: '12', title: 'TO LEAD', label: 'ENTER ZENVITRA' },
];
