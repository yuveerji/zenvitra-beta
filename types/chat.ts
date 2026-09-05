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

export interface ChatChannel {
  id: string;
  name: string;
  type: 'text' | 'voice';
  description?: string;
  isLocked?: boolean;
  activeVoiceUsers?: string[];
}

export interface ChatCommunity {
  id: string;
  name: string;
  icon: string;
  badge?: string;
  unreadCount?: number;
  channels: ChatChannel[];
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
