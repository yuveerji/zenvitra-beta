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

