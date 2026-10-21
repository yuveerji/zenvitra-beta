export type ZenRoomType = 'standard' | 'mun' | 'voice' | 'townhall';
export type ZenRoomPersistence = 'persistent' | 'scheduled' | 'onetime' | 'recurring';
export type ZenRoomAccess = 'public' | 'link' | 'members' | 'invite';

export interface ZenMeetRoomConfig {
  camOn: boolean;
  micOn: boolean;
  allowShare: boolean;
  allowChat: boolean;
  allowReactions: boolean;
  allowCaptions: boolean;
}

export interface ZenMunCommitteeConfig {
  committeeName?: string;
  agendaTopic?: string;
  ebRole?: string;
  speakingTimeSecs?: number;
  chitsEnabled?: boolean;
}

export interface ZenMeetRoom {
  id: string;
  roomCode: string; // e.g. ZEN-TEAM-8942
  name: string;
  description?: string;
  roomType: ZenRoomType;
  persistence: ZenRoomPersistence;
  access: ZenRoomAccess;
  hostId: string;
  hostName: string;
  hostEmail?: string;
  coHosts?: string[];
  passcode?: string;
  waitingRoom: boolean;
  lockRoom?: boolean;
  capacity: number;
  durationMinutes: number;
  defaults: ZenMeetRoomConfig;
  munConfig?: ZenMunCommitteeConfig;
  createdAt: string;
  scheduledStart?: string;
  scheduledEnd?: string;
  status: 'IDLE' | 'LIVE' | 'COMPLETED' | 'ARCHIVED';
  participantCount?: number;
}

export interface MeetParticipant {
  id: string;
  name: string;
  role: 'host' | 'co-host' | 'participant' | 'eb' | 'delegate';
  placard?: string; // Country / Portfolio for MUN, e.g. "Delegate · France"
  isMicOn: boolean;
  isCamOn: boolean;
  isScreenSharing?: boolean;
  isHandRaised?: boolean;
  raisedHandTime?: number;
  connectionQuality?: 'excellent' | 'good' | 'fair';
  avatar?: string;
  isPinned?: boolean;
  inWaitingRoom?: boolean;
}

export interface InMeetingMessage {
  id: string;
  senderId: string;
  senderName: string;
  senderPlacard?: string;
  content: string;
  timestamp: string;
  isDirect?: boolean;
  recipientId?: string;
  recipientName?: string;
  isAnnouncement?: boolean;
}

export interface SpeakerQueueItem {
  id: string;
  participantId: string;
  name: string;
  placard?: string;
  requestedAt: number;
  durationSecs: number;
  status: 'waiting' | 'speaking' | 'completed';
}
