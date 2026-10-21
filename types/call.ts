export type CallMode = 'CALL' | 'GROUP' | 'ROOM' | 'EVENT' | 'LIVE' | 'COMMITTEE';

export type CallRole = 
  | 'SUPER_ADMIN' 
  | 'ORG_ADMIN' 
  | 'HOST' 
  | 'CO_HOST' 
  | 'MODERATOR' 
  | 'SPEAKER' 
  | 'PARTICIPANT' 
  | 'OBSERVER';

export interface CallParticipant {
  id: string;
  name: string;
  handle: string;
  role: CallRole;
  avatar?: string;
  countryFlag?: string;
  isMuted: boolean;
  isCameraOff: boolean;
  isHandRaised: boolean;
  handRaisedAt?: number;
  isSpeaking: boolean;
  isPinned: boolean;
  isScreenSharing: boolean;
  isLocal?: boolean;
  joinedAt: number;
}

export interface CallMessage {
  id: string;
  senderId: string;
  senderName: string;
  senderRole: CallRole;
  text: string;
  timestamp: string;
  target: 'everyone' | 'host' | 'private';
  recipientId?: string;
  attachments?: {
    type: 'image' | 'doc' | 'file';
    url: string;
    name: string;
  }[];
}

export interface CallPollOption {
  id: string;
  text: string;
  votes: number;
}

export interface CallPoll {
  id: string;
  question: string;
  options: CallPollOption[];
  createdBy: string;
  isClosed: boolean;
  totalVotes: number;
  userVotedOptionId?: string;
}

export interface CallQuestion {
  id: string;
  authorName: string;
  authorRole: CallRole;
  question: string;
  upvotes: number;
  isAnswered: boolean;
  timestamp: string;
}

export interface BreakoutRoom {
  id: string;
  name: string;
  participantIds: string[];
}

export interface MunSpeakerItem {
  id: string;
  country: string;
  delegateName: string;
  timeLeft: number;
  isSpeaking: boolean;
}

export interface MunMotionItem {
  id: string;
  proposer: string;
  topic: string;
  totalTime: number;
  speakingTime: number;
  type: 'MODERATED' | 'UNMODERATED' | 'FORMAL_CONSULTATION';
  status: 'PENDING' | 'PASSED' | 'FAILED';
  votesFor: number;
  votesAgainst: number;
}

export interface CallDeviceSettings {
  audioInputId: string;
  audioOutputId: string;
  videoInputId: string;
  isNoiseSuppression: boolean;
  isVoiceIsolation: boolean;
  isLowLightBoost: boolean;
  virtualBackground: 'none' | 'blur' | 'chamber' | 'cyberpunk' | 'office' | 'stars';
}

export type CallLayoutMode = 'GALLERY' | 'SPEAKER' | 'PRESENTATION' | 'PIP';

export type MeetingType = 
  | 'PERSONAL' 
  | 'GROUP' 
  | 'COMMUNITY' 
  | 'MUN_COMMITTEE' 
  | 'STAGE' 
  | 'SUPPORT';

export interface CallSessionItem {
  id: string;
  callNumber: string;
  type: 'VOICE' | 'VIDEO' | 'MEET' | 'STAGE' | 'ROOM';
  title: string;
  status: 'RINGING' | 'CONNECTING' | 'CONNECTED' | 'RECONNECTING' | 'ENDED';
  hostId: string;
  hostName: string;
  roomCode: string;
  isStage: boolean;
  committeeId?: string | null;
  startedAt: string;
  endedAt?: string | null;
  durationSeconds: number;
  recordingUrl?: string | null;
  participantsCount: number;
  participants?: CallParticipant[];
}

export interface CallMeetingItem {
  id: string;
  meetingId: string;
  title: string;
  description?: string | null;
  scheduledStart: string;
  scheduledEnd: string;
  hostId: string;
  hostName: string;
  hostEmail?: string | null;
  passcode?: string | null;
  waitingRoom: boolean;
  inviteesJson?: string | null;
  roomUrl: string;
  status: 'SCHEDULED' | 'LIVE' | 'COMPLETED' | 'CANCELLED';
  type: MeetingType;
  createdAt: string;
  updatedAt: string;
}

export interface CallSpeakerQueueItem {
  id: string;
  sessionId: string;
  userId: string;
  userName: string;
  delegationCountry: string;
  speakDurationSeconds: number;
  status: 'QUEUED' | 'SPEAKING' | 'CONCLUDED' | 'YIELDED';
  queuedAt: string;
  startedAt?: string | null;
}

export interface CallReportItem {
  id: string;
  sessionId: string;
  reporterId: string;
  reporterName: string;
  reportedUserId?: string | null;
  reason: string;
  status: 'PENDING' | 'INVESTIGATING' | 'RESOLVED' | 'DISMISSED';
  createdAt: string;
}

export interface CallPolicyData {
  id: string;
  callsActive: boolean;
  maxParticipantsPerCall: number;
  screenShareAllowed: boolean;
  recordingAllowed: boolean;
  p2pMeshLimit: number;
  emergencyCallLockdown: boolean;
  updatedAt: string;
}


