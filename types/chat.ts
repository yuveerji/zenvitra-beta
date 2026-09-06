export type ConversationType = 'dm' | 'group' | 'broadcast' | 'community_channel';

export interface ChatMember {
  id: string;
  name: string;
  username: string;
  phoneNumber?: string;
  avatar?: string;
  role?: string;
  status?: 'online' | 'offline' | 'idle';
  isAi?: boolean;
}

export interface MessageReaction {
  emoji: string;
  count: number;
  users: string[]; // user IDs
}

export interface MessageAttachment {
  type: 'image' | 'file';
  url: string;
  name: string;
  size?: string;
}

export interface GlimpseSnap {
  id: string;
  senderId: string;
  senderUsername: string;
  senderName: string;
  mediaUrl: string;
  caption?: string;
  stickers?: string[];
  isOneView: boolean;
  isOpened: boolean;
  openedAt?: string;
  audience: 'all' | 'followers' | 'close_friends';
  createdAt: string;
}

export interface ChatMessage {
  id: string;
  conversationId: string;
  senderId: string;
  senderName: string;
  senderUsername: string;
  senderAvatar?: string;
  senderRole?: string;
  isSelf: boolean;
  content: string;
  timestamp: string;
  reactions: MessageReaction[];
  attachments?: MessageAttachment[];
  voiceNoteUrl?: string;
  voiceDurationSeconds?: number;
  snap?: GlimpseSnap;
  stickerUrl?: string;
  replyTo?: {
    id: string;
    senderName: string;
    snippet: string;
  };
  status?: 'sent' | 'delivered' | 'read';
  isEdited?: boolean;
  isPinned?: boolean;
}

export interface ChatConversation {
  id: string;
  type: ConversationType;
  name: string;
  handle?: string;
  phoneNumber?: string;
  avatar?: string;
  isAi?: boolean;
  isPinned?: boolean;
  isMuted?: boolean;
  unreadCount: number;
  lastMessage?: {
    text: string;
    timestamp: string;
    senderName: string;
  };
  members: ChatMember[];
  createdAt: string;
  description?: string;
  about?: string;
  category?: 'primary' | 'general' | 'requests';
}

export interface ChatCall {
  id: string;
  contactName: string;
  contactNumberOrUsername: string;
  contactAvatar?: string;
  type: 'voice' | 'video';
  direction: 'incoming' | 'outgoing' | 'missed';
  timestamp: string;
  duration?: string;
}

export interface ChatStatus {
  id: string;
  authorName: string;
  authorUsername: string;
  authorAvatar?: string;
  mediaUrl?: string;
  text?: string;
  timestamp: string;
  viewed?: boolean;
}

export interface ActiveCallState {
  isActive: boolean;
  conversationId: string;
  conversationName: string;
  phoneNumberOrHandle?: string;
  callType: 'voice' | 'video';
  isMuted: boolean;
  isDeafened: boolean;
  isScreenSharing: boolean;
  durationSeconds: number;
}

export interface DiscordRolePermissions {
  manageServer: boolean;
  manageRoles: boolean;
  manageChannels: boolean;
  kickMembers: boolean;
  banMembers: boolean;
  sendMessages: boolean;
  embedLinks: boolean;
  attachFiles: boolean;
  connectVoice: boolean;
  speakVoice: boolean;
  prioritySpeaker: boolean;
}

export interface DiscordRole {
  id: string;
  name: string;
  color: string; // e.g. '#f59e0b', '#a855f7', '#06b6d4'
  icon?: string;
  hoist: boolean; // Display role members separately from online members (like Discord)
  position: number; // Order/hierarchy of role
  permissions: DiscordRolePermissions;
  isDefault?: boolean;
}

export interface ChannelCategory {
  id: string;
  name: string; // e.g. '[ENTRANCE]', '[ALERTS]', '[COMMUNITY]', '[VOICE AREA]'
  isCollapsed?: boolean;
}

export interface ChatChannel {
  id: string;
  name: string;
  type: 'text' | 'voice' | 'announcement';
  description?: string;
  categoryId?: string;
  isLocked?: boolean;
  unreadCount?: number;
  userLimit?: number; // e.g. 02, 05 or undefined for voice
  activeVoiceUsers?: Array<{
    id: string;
    name: string;
    username: string;
    avatar?: string;
    banner?: string;
    isSpeaking?: boolean;
    isMuted?: boolean;
    isDeafened?: boolean;
    isStreaming?: boolean;
    activityText?: string; // e.g. "Valorant Tracker App", "Live on kick.com", "USD"
  }>;
  allowedRoles?: string[];
}

export interface CommunityMember {
  id: string;
  name: string;
  username: string;
  avatar?: string;
  banner?: string;
  status: 'online' | 'idle' | 'dnd' | 'offline';
  roleIds: string[]; // List of role IDs assigned to this member
  activity?: {
    type: 'playing' | 'streaming' | 'listening' | 'watching' | 'custom';
    name: string;
    details?: string;
    badge?: string; // e.g. "LIVE", "EXP", "ROBLOX", "USD"
  };
  customStatus?: string;
}

export interface ChatCommunityGroup {
  id: string;
  name: string;
  description?: string;
  icon?: string;
  membersCount?: number;
  unreadCount?: number;
  isLocked?: boolean;
}

export interface ChatCommunity {
  id: string;
  name: string;
  icon: string;
  badge?: string;
  description?: string;
  unreadCount?: number;
  categories?: ChannelCategory[];
  channels: ChatChannel[];
  groups?: ChatCommunityGroup[];
  roles: DiscordRole[];
  members?: CommunityMember[];
}

export interface ZenNoteSong {
  id?: string;
  title: string;
  artist: string;
  coverUrl?: string;
  audioUrl?: string;
}

export type ZenNoteColor = 'dark' | 'yellow' | 'sunset' | 'cyan' | 'emerald' | 'lavender';

export interface ZenNote {
  id: string;
  authorId: string;
  authorName: string;
  authorUsername: string;
  authorAvatar?: string;
  text: string;
  moodEmoji?: string;
  locationBadge?: string;
  song?: ZenNoteSong;
  colorTheme?: ZenNoteColor;
  createdAt: string;
  expiresAt: string;
}

export interface GlimpseScore {
  sent: number;
  received: number;
  streak: number;
}

export interface CustomSticker {
  id: string;
  name: string;
  url: string;
  category: string;
}

export interface ScheduledCall {
  id: string;
  title: string;
  description?: string;
  startDate: string;
  startTime: string;
  endDate?: string;
  endTime?: string;
  callType: 'video' | 'voice';
  requireApproval: boolean;
  link: string;
  creatorName: string;
  creatorHandle: string;
  createdAt: string;
}

export interface CallLink {
  id: string;
  url: string;
  callType: 'video' | 'voice';
  requireApproval: boolean;
  createdAt: string;
}

export interface SharedMediaItem {
  id: string;
  type: 'media' | 'doc' | 'link';
  title: string;
  url: string;
  previewUrl?: string;
  senderName: string;
  date: string;
  size?: string;
}
