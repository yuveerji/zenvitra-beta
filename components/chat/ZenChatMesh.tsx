'use client';

import React, { useState, useRef, useEffect, useMemo, useCallback } from 'react';
import { 
  Phone, 
  PhoneCall,
  Video, 
  Search, 
  MoreVertical, 
  Paperclip, 
  Smile, 
  Mic, 
  MicOff,
  Send, 
  Check, 
  CheckCheck, 
  Pin, 
  Volume2, 
  VolumeX, 
  PhoneOff, 
  Hash, 
  Headphones, 
  Settings, 
  Plus, 
  UserPlus, 
  LogOut, 
  Sparkles, 
  X, 
  Radio, 
  ShieldCheck, 
  Image as ImageIcon, 
  FileText, 
  Play, 
  Pause, 
  Trash2, 
  Edit3, 
  MessageSquare, 
  Globe2, 
  Lock, 
  ChevronRight, 
  PanelLeftClose, 
  PanelLeftOpen, 
  Info, 
  Copy, 
  Share2,
  Users,
  RadioTower,
  Flame,
  Camera,
  Maximize2,
  Minimize2,
  CheckCircle2,
  AlertCircle,
  FolderPlus,
  HelpCircle,
  Sliders,
  ChevronDown,
  Eye,
  Sticker,
  Link2,
  Calendar,
  Clock,
  ExternalLink,
  ChevronLeft,
  ArrowLeft,
  Zap
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useZenChat } from '@/context/ZenChatPlatformContext';
import { useZenPulse } from '@/context/ZenPulsePlatformContext';
import { useAuth } from '@/context/AuthContext';
import { ChatMessage, ChatConversation, ChatCommunity, ChatCommunityGroup, ChatChannel, ChannelCategory, DiscordRole, CommunityMember, GlimpseSnap, ScheduledCall, CallLink, SharedMediaItem } from '@/types/chat';
import { ZenNotesRow } from '@/components/chat/ZenNotesRow';
import { GlimpseSnapModal } from '@/components/chat/GlimpseSnapModal';
import { GlimpseViewerModal } from '@/components/chat/GlimpseViewerModal';
import { NewChatActionModal } from '@/components/chat/NewChatActionModal';
import { StickersDrawer } from '@/components/chat/StickersDrawer';
import { ZenChatSettingsModal } from '@/components/chat/ZenChatSettingsModal';
import { DiscordRoleSettingsModal } from '@/components/chat/DiscordRoleSettingsModal';
import { ManageCommunityGroupModal } from '@/components/chat/ManageCommunityGroupModal';
import { ManageCommunityModal } from '@/components/chat/ManageCommunityModal';
import { ZenChatCommandBar } from '@/components/chat/ZenChatCommandBar';
import { ZenIdentityCardModal } from '@/components/chat/ZenIdentityCardModal';
import { ZenNativeMessageCard } from '@/components/chat/ZenNativeMessageCard';
import { UniversalEmojiGifPicker } from '@/components/common/UniversalEmojiGifPicker';
import { formatViewerTime } from '@/lib/timezone';
import { useRouter } from 'next/navigation';

/* ── Server & Caucus Templates (Replaced hardcoded seeded groups) ── */
export interface CommunityTemplate {
  id: string;
  name: string;
  icon: string;
  badge: string;
  description: string;
  categories: ChannelCategory[];
  channels: ChatChannel[];
  roles: DiscordRole[];
}

export const COMMUNITY_TEMPLATES: CommunityTemplate[] = [
  {
    id: 'template-mun',
    name: 'Model UN Conference',
    icon: '🌐',
    badge: 'MUN',
    description: 'Premier Model UN Conference with plenary chamber, committees, press corps, and dais voice stage.',
    categories: [
      { id: 'cat-bulletins', name: '[BULLETINS]' },
      { id: 'cat-committees', name: '[CHAMBERS]' },
      { id: 'cat-press', name: '[PRESS CORPS]' },
      { id: 'cat-voice', name: '[DAIS VOICE]' },
    ],
    roles: [
      {
        id: 'role-sec-gen',
        name: '🏛️ | Secretary General',
        color: '#f59e0b',
        hoist: true,
        position: 1,
        permissions: { manageServer: true, manageRoles: true, manageChannels: true, kickMembers: true, banMembers: true, sendMessages: true, embedLinks: true, attachFiles: true, connectVoice: true, speakVoice: true, prioritySpeaker: true }
      },
      {
        id: 'role-eb',
        name: '⚖️ | Executive Board (EB)',
        color: '#a855f7',
        hoist: true,
        position: 2,
        permissions: { manageServer: false, manageRoles: false, manageChannels: true, kickMembers: true, banMembers: false, sendMessages: true, embedLinks: true, attachFiles: true, connectVoice: true, speakVoice: true, prioritySpeaker: true }
      },
      {
        id: 'role-delegate',
        name: 'Delegate',
        color: '#94a3b8',
        hoist: false,
        position: 3,
        isDefault: true,
        permissions: { manageServer: false, manageRoles: false, manageChannels: false, kickMembers: false, banMembers: false, sendMessages: true, embedLinks: true, attachFiles: true, connectVoice: true, speakVoice: true, prioritySpeaker: false }
      }
    ],
    channels: [
      { id: 'ch-announcements', name: 'announcements', type: 'announcement', categoryId: 'cat-bulletins', description: 'Secretariat dispatches and schedule alerts' },
      { id: 'ch-secretariat', name: 'secretariat-eb', type: 'text', categoryId: 'cat-bulletins', description: 'Dais coordination & crisis directives' },
      { id: 'ch-delegates', name: 'delegates-assembly', type: 'text', categoryId: 'cat-committees', description: 'Plenary chamber and caucus debate' },
      { id: 'ch-eb', name: 'eb-caucus', type: 'text', categoryId: 'cat-committees', description: 'Executive Board procedural consultations' },
      { id: 'ch-press', name: 'international-press', type: 'text', categoryId: 'cat-press', description: 'Press communiqués and interview requests' },
      { id: 'ch-voice-main', name: 'Floor Mic [Plenary]', type: 'voice', categoryId: 'cat-voice', description: 'Live floor microphone & speeches', userLimit: 25, activeVoiceUsers: [] }
    ]
  },
  {
    id: 'template-parliament',
    name: 'Diplomatic Parliamentary Assembly',
    icon: '🏛️',
    badge: 'PARLIAMENT',
    description: 'Multilateral parliamentary simulation with UNGA, UNSC crisis response, and speaker floor audio stage.',
    categories: [
      { id: 'cat-alerts', name: '[DISPATCHES]' },
      { id: 'cat-chambers', name: '[COMMITTEES]' },
      { id: 'cat-voice', name: '[LIVE AUDIO]' },
    ],
    roles: [
      {
        id: 'role-chair',
        name: '🏛️ | Dais Chair',
        color: '#f59e0b',
        hoist: true,
        position: 1,
        permissions: { manageServer: true, manageRoles: true, manageChannels: true, kickMembers: true, banMembers: true, sendMessages: true, embedLinks: true, attachFiles: true, connectVoice: true, speakVoice: true, prioritySpeaker: true }
      },
      {
        id: 'role-diplomat',
        name: 'Diplomat',
        color: '#94a3b8',
        hoist: false,
        position: 2,
        isDefault: true,
        permissions: { manageServer: false, manageRoles: false, manageChannels: false, kickMembers: false, banMembers: false, sendMessages: true, embedLinks: true, attachFiles: true, connectVoice: true, speakVoice: true, prioritySpeaker: false }
      }
    ],
    channels: [
      { id: 'ch-bulletins', name: 'bulletins', type: 'announcement', categoryId: 'cat-alerts', description: 'Official announcements' },
      { id: 'ch-unga', name: 'unga-committee', type: 'text', categoryId: 'cat-chambers', description: 'General Assembly debates' },
      { id: 'ch-unsc', name: 'unsc-crisis', type: 'text', categoryId: 'cat-chambers', description: 'Security Council emergency response' },
      { id: 'ch-voice-dais', name: 'Chamber Audio Stage', type: 'voice', categoryId: 'cat-voice', description: 'Speakers list audio floor', userLimit: 20, activeVoiceUsers: [] }
    ]
  },
  {
    id: 'template-crisis',
    name: 'Sovereign Crisis Chamber',
    icon: '⚡',
    badge: 'CRISIS',
    description: 'Rapid response multilateral crisis room with encrypted operations and high command voice.',
    categories: [
      { id: 'cat-ops', name: '[OPERATIONS]' },
      { id: 'cat-cmd-voice', name: '[COMMAND VOICE]' }
    ],
    roles: [
      {
        id: 'role-high-cmd',
        name: '⚡ | High Command',
        color: '#ef4444',
        hoist: true,
        position: 1,
        permissions: { manageServer: true, manageRoles: true, manageChannels: true, kickMembers: true, banMembers: true, sendMessages: true, embedLinks: true, attachFiles: true, connectVoice: true, speakVoice: true, prioritySpeaker: true }
      },
      {
        id: 'role-operator',
        name: 'Field Operator',
        color: '#94a3b8',
        hoist: false,
        position: 2,
        isDefault: true,
        permissions: { manageServer: false, manageRoles: false, manageChannels: false, kickMembers: false, banMembers: false, sendMessages: true, embedLinks: true, attachFiles: true, connectVoice: true, speakVoice: true, prioritySpeaker: false }
      }
    ],
    channels: [
      { id: 'ch-war-room', name: 'war-room-text', type: 'text', categoryId: 'cat-ops', description: 'Fast-paced crisis directive broadcast' },
      { id: 'ch-intel', name: 'intelligence-briefs', type: 'text', categoryId: 'cat-ops', description: 'Encrypted intelligence leaks and evidence' },
      { id: 'ch-voice-crisis', name: 'High Command [Voice]', type: 'voice', categoryId: 'cat-cmd-voice', description: 'Live emergency audio command', isLocked: false, activeVoiceUsers: [] }
    ]
  },
  {
    id: 'template-blank',
    name: 'Custom Server / Blank Caucus',
    icon: '💬',
    badge: 'SERVER',
    description: 'Clean slate server with general floor, announcements, and floor audio stage.',
    categories: [
      { id: 'cat-general', name: '[GENERAL]' },
      { id: 'cat-audio', name: '[AUDIO FLOOR]' }
    ],
    roles: [
      {
        id: 'role-owner',
        name: '👑 | Owner',
        color: '#f59e0b',
        hoist: true,
        position: 1,
        permissions: { manageServer: true, manageRoles: true, manageChannels: true, kickMembers: true, banMembers: true, sendMessages: true, embedLinks: true, attachFiles: true, connectVoice: true, speakVoice: true, prioritySpeaker: true }
      },
      {
        id: 'role-member',
        name: 'Member',
        color: '#94a3b8',
        hoist: false,
        position: 2,
        isDefault: true,
        permissions: { manageServer: false, manageRoles: false, manageChannels: false, kickMembers: false, banMembers: false, sendMessages: true, embedLinks: true, attachFiles: true, connectVoice: true, speakVoice: true, prioritySpeaker: false }
      }
    ],
    channels: [
      { id: 'ch-announcements', name: 'announcements', type: 'announcement', categoryId: 'cat-general', description: 'General server announcements' },
      { id: 'ch-general', name: 'general-floor', type: 'text', categoryId: 'cat-general', description: 'General discussions' },
      { id: 'ch-voice', name: 'Floor Audio', type: 'voice', categoryId: 'cat-audio', description: 'Live audio floor', activeVoiceUsers: [] }
    ]
  }
];

export function buildDefaultUserServer(userId?: string, userName?: string, userHandle?: string): ChatCommunity {
  const sName = userName && userName !== 'You' ? `${userName}'s Server` : "Your Server";
  return {
    id: 'comm-user-primary',
    name: sName,
    icon: '🏛️',
    badge: 'COUNCIL',
    description: `Official sovereign diplomatic server & caucus chamber for @${userHandle || 'you'}`,
    categories: [
      { id: 'cat-user-bulletins', name: '[BULLETINS]' },
      { id: 'cat-user-chambers', name: '[CHAMBERS]' },
      { id: 'cat-user-voice', name: '[AUDIO STAGE]' },
    ],
    roles: [
      {
        id: 'role-owner',
        name: '👑 | Server Owner',
        color: '#f59e0b',
        hoist: true,
        position: 1,
        permissions: { manageServer: true, manageRoles: true, manageChannels: true, kickMembers: true, banMembers: true, sendMessages: true, embedLinks: true, attachFiles: true, connectVoice: true, speakVoice: true, prioritySpeaker: true }
      },
      {
        id: 'role-delegate',
        name: 'Delegate',
        color: '#94a3b8',
        hoist: false,
        position: 2,
        isDefault: true,
        permissions: { manageServer: false, manageRoles: false, manageChannels: false, kickMembers: false, banMembers: false, sendMessages: true, embedLinks: true, attachFiles: true, connectVoice: true, speakVoice: true, prioritySpeaker: false }
      }
    ],
    members: [
      {
        id: userId || 'u_self',
        name: userName || 'You',
        username: userHandle || 'you',
        status: 'online',
        roleIds: ['role-owner'],
        customStatus: 'Server Founder & Architect'
      }
    ],
    channels: [
      { id: 'ch-user-announcements', name: 'announcements', type: 'announcement', categoryId: 'cat-user-bulletins', description: 'Dispatches and executive directives' },
      { id: 'ch-user-general', name: 'general-floor', type: 'text', categoryId: 'cat-user-chambers', description: 'General debate and floor speeches' },
      { id: 'ch-user-resolutions', name: 'working-drafts', type: 'text', categoryId: 'cat-user-chambers', description: 'Collaborative draft resolutions' },
      { id: 'ch-user-voice', name: 'Chamber Audio [Live]', type: 'voice', categoryId: 'cat-user-voice', description: 'Speakers list microphone floor', userLimit: 20, activeVoiceUsers: [] }
    ],
    groups: []
  };
}

/* ── Base Direct Messaging Space ── */
const DEFAULT_COMMUNITIES: ChatCommunity[] = [
  {
    id: 'comm-direct',
    name: 'Direct Envoys & DMs',
    icon: '💬',
    badge: 'DMs',
    roles: [],
    channels: []
  }
];

const EMOJI_LIST = ['👍', '❤️', '⚡', '📜', '🔥', '👏', '🎯', '🤝', '💎', '🚀', '💡', '🛡️', '⚖️', '🌍', '✨'];

export function ZenChatMesh() {
  const router = useRouter();
  const [mounted, setMounted] = useState(false);
  const { isMockMode } = useAuth();

  const {
    conversations,
    activeConversationId,
    activeConversation,
    messagesMap,
    activeMessages,
    activeCall,
    calls,
    statuses,
    setActiveConversationId,
    sendMessage,
    sendVoiceNote,
    sendSnap,
    openSnap,
    sendSticker,
    editMessage,
    deleteMessage,
    reactToMessage,
    pinMessage,
    createDirectChat,
    createGroupChat,
    createBroadcastList,
    startCall,
    startDirectNumberCall,
    endCall,
    toggleCallMute,
    toggleCallDeafen,
    toggleCallScreenShare,
    glimpseScore,
    currentUser,
    currentUserName,
    currentUserUsername,
    sendNativeObjectMessage,
    votePoll,
    toggleMuteConversation,
    deleteConversation,
    clearChatMessages,
  } = useZenChat();

  const { profiles } = useZenPulse();

  /* Local UI State */
  const [communities, setCommunities] = useState<ChatCommunity[]>(DEFAULT_COMMUNITIES);
  const [selectedCommunityId, setSelectedCommunityId] = useState<string>('comm-direct');
  const [activeChannelId, setActiveChannelId] = useState<string>('ch-general');
  const [activeCommunityGroupId, setActiveCommunityGroupId] = useState<string | null>(null);
  const [activeVoiceChannel, setActiveVoiceChannel] = useState<ChatChannel | null>(null);
  const [showGroupSettingsMenu, setShowGroupSettingsMenu] = useState(false);
  const [showSidebarHeaderMenu, setShowSidebarHeaderMenu] = useState(false);
  
  /* Custom community groups & modals */
  const [showCreateCommunityGroupModal, setShowCreateCommunityGroupModal] = useState(false);
  const [newCommunityGroupName, setNewCommunityGroupName] = useState('');
  const [newCommunityGroupDesc, setNewCommunityGroupDesc] = useState('');
  const [newCommunityGroupIcon, setNewCommunityGroupIcon] = useState('💬');
  const [showRoomInfoModal, setShowRoomInfoModal] = useState(false);
  const [showInviteLinkModal, setShowInviteLinkModal] = useState(false);
  const [mutedContexts, setMutedContexts] = useState<Record<string, boolean>>({});

  const [messageText, setMessageText] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [activeCategoryFilter, setActiveCategoryFilter] = useState<'all' | 'primary' | 'requests' | 'general' | 'broadcasts'>('primary');
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
  const [mobileActiveView, setMobileActiveView] = useState<'list' | 'chat'>('list');
  const [showMembersDrawer, setShowMembersDrawer] = useState(false);
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const [showStickerDrawer, setShowStickerDrawer] = useState(false);
  const [replyingTo, setReplyingTo] = useState<ChatMessage | null>(null);

  /* WhatsApp & Navigation Rail State */
  const [activeRailTab, setActiveRailTab] = useState<'chats' | 'calls' | 'communities' | 'media'>('chats');
  const [selectedTemplateId, setSelectedTemplateId] = useState<string>('template-mun');
  const [showCallDropdown, setShowCallDropdown] = useState(false);
  const [showNewCallLinkModal, setShowNewCallLinkModal] = useState(false);
  const [showScheduleCallModal, setShowScheduleCallModal] = useState(false);
  const [showMediaGalleryModal, setShowMediaGalleryModal] = useState(false);
  const [callLinkType, setCallLinkType] = useState<'video' | 'voice'>('video');
  const [requireApproval, setRequireApproval] = useState(false);
  const [scheduleCallType, setScheduleCallType] = useState<'video' | 'voice'>('video');
  const [scheduleCallName, setScheduleCallName] = useState('');
  const [scheduleCallDesc, setScheduleCallDesc] = useState('');
  const [scheduleStartDate, setScheduleStartDate] = useState('');
  const [scheduleStartTime, setScheduleStartTime] = useState('15:00');
  const [scheduleEndDate, setScheduleEndDate] = useState('');
  const [scheduleEndTime, setScheduleEndTime] = useState('16:00');
  const [hasEndTime, setHasEndTime] = useState(true);
  const [scheduledCalls, setScheduledCalls] = useState<ScheduledCall[]>([]);
  const [mediaGalleryTab, setMediaGalleryTab] = useState<'media' | 'docs' | 'links'>('media');

  /* Modals */
  const [showSettingsModal, setShowSettingsModal] = useState(false);
  const [showNewChatActionModal, setShowNewChatActionModal] = useState(false);
  const [showGlimpseSnapModal, setShowGlimpseSnapModal] = useState(false);
  const [activeViewingSnap, setActiveViewingSnap] = useState<{ snap: GlimpseSnap; messageId: string } | null>(null);
  const [showDirectCallModal, setShowDirectCallModal] = useState(false);
  const [showCreateCaucusModal, setShowCreateCaucusModal] = useState(false);
  const [showCreateChannelModal, setShowCreateChannelModal] = useState(false);
  const [showManageMembersModal, setShowManageMembersModal] = useState(false);
  const [showRoleSettingsModal, setShowRoleSettingsModal] = useState(false);
  const [showCommandBar, setShowCommandBar] = useState(false);
  const [identityCardUser, setIdentityCardUser] = useState<any | null>(null);
  const [collapsedCategories, setCollapsedCategories] = useState<Record<string, boolean>>({});

  /* Dialer & Creation Forms */
  const [directDialInput, setDirectDialInput] = useState('');
  const [isOnlineCallingError, setIsOnlineCallingError] = useState<string | null>(null);
  const [newCaucusName, setNewCaucusName] = useState('');
  const [newCaucusIcon, setNewCaucusIcon] = useState('🏛️');
  const [newCaucusDescription, setNewCaucusDescription] = useState('');
  const [newChannelName, setNewChannelName] = useState('');
  const [newChannelType, setNewChannelType] = useState<'text' | 'voice'>('text');
  const [newChannelDesc, setNewChannelDesc] = useState('');

  /* Voice Recording */
  const [isRecordingVoice, setIsRecordingVoice] = useState(false);
  const [recordingSeconds, setRecordingSeconds] = useState(0);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioChunksRef = useRef<Blob[]>([]);

  /* Subgroup & Community Configuration Modals */
  const [managingSubgroup, setManagingSubgroup] = useState<ChatCommunityGroup | null>(null);
  const [showManageCommunityModal, setShowManageCommunityModal] = useState(false);

  /* Call state & streams */
  const [isVoiceMuted, setIsVoiceMuted] = useState(false);
  const [isVoiceDeafened, setIsVoiceDeafened] = useState(false);
  const [localMediaStream, setLocalMediaStream] = useState<MediaStream | null>(null);
  const localVideoRef = useRef<HTMLVideoElement>(null);

  /* Discord Live Voice Channel Web Audio & Microphone Streams */
  const [micVolumeLevel, setMicVolumeLevel] = useState<number>(0);
  const [isCurrentUserSpeaking, setIsCurrentUserSpeaking] = useState<boolean>(false);
  const voiceStreamRef = useRef<MediaStream | null>(null);
  const audioContextRef = useRef<AudioContext | null>(null);
  const analyserRef = useRef<AnalyserNode | null>(null);
  const voiceAnimFrameRef = useRef<number | null>(null);

  /* Toast Notification */
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setMounted(true);

    // 2. Restore user communities or initialize personal server
    try {
      const savedComm = localStorage.getItem('zenvitra_user_communities_v4');
      if (savedComm) {
        const parsed = JSON.parse(savedComm);
        if (Array.isArray(parsed) && parsed.length > 0) {
          setCommunities([DEFAULT_COMMUNITIES[0], ...parsed]);
        } else {
          const userServer = buildDefaultUserServer(currentUser?.id, currentUserName, currentUserUsername);
          setCommunities([DEFAULT_COMMUNITIES[0], userServer]);
          localStorage.setItem('zenvitra_user_communities_v4', JSON.stringify([userServer]));
        }
      } else {
        const userServer = buildDefaultUserServer(currentUser?.id, currentUserName, currentUserUsername);
        setCommunities([DEFAULT_COMMUNITIES[0], userServer]);
        localStorage.setItem('zenvitra_user_communities_v4', JSON.stringify([userServer]));
      }
    } catch (_) {
      const userServer = buildDefaultUserServer(currentUser?.id, currentUserName, currentUserUsername);
      setCommunities([DEFAULT_COMMUNITIES[0], userServer]);
    }

    // 3. Restore saved custom groups for communities
    try {
      const savedGroups = localStorage.getItem('zenvitra_community_custom_groups_v2');
      if (savedGroups) {
        const parsedMap: Record<string, any[]> = JSON.parse(savedGroups);
        setCommunities((prev) =>
          prev.map((c) => ({
            ...c,
            groups: parsedMap[c.id] || []
          }))
        );
      }

      const sm = localStorage.getItem('zenvitra_muted_contexts_v2');
      if (sm) setMutedContexts(JSON.parse(sm));
    } catch (_) {}
  }, []);

  // Update default user server title if current user name loads asynchronously
  useEffect(() => {
    if (!currentUserName || currentUserName === 'You') return;
    setCommunities((prev) => {
      let changed = false;
      const next = prev.map((c) => {
        if (c.id === 'comm-user-primary' && (c.name === 'Your Server' || c.name.endsWith("'s Server"))) {
          const expectedName = `${currentUserName}'s Server`;
          if (c.name !== expectedName) {
            changed = true;
            return {
              ...c,
              name: expectedName,
              description: `Official sovereign diplomatic server & caucus chamber for @${currentUserUsername || 'you'}`
            };
          }
        }
        return c;
      });
      if (changed) {
        try {
          localStorage.setItem(
            'zenvitra_user_communities_v4',
            JSON.stringify(next.filter((c) => c.id !== 'comm-direct'))
          );
        } catch (_) {}
        return next;
      }
      return prev;
    });
  }, [currentUserName, currentUserUsername]);

  const saveCommunityGroups = (communityId: string, updatedGroups: any[]) => {
    setCommunities((prev) =>
      prev.map((c) => (c.id === communityId ? { ...c, groups: updatedGroups } : c))
    );
    try {
      const saved = localStorage.getItem('zenvitra_community_custom_groups_v2');
      const map = saved ? JSON.parse(saved) : {};
      map[communityId] = updatedGroups;
      localStorage.setItem('zenvitra_community_custom_groups_v2', JSON.stringify(map));
    } catch (_) {}
  };

  const handleCreateCommunityGroup = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newCommunityGroupName.trim()) return;

    const newGroup = {
      id: `grp-${Date.now()}`,
      name: newCommunityGroupName.trim(),
      description: newCommunityGroupDesc.trim() || 'Community taskforce working group',
      icon: newCommunityGroupIcon || '💬',
      membersCount: 1,
      createdAt: new Date().toISOString(),
    };

    const existing = currentCommunity.groups || [];
    const updated = [...existing, newGroup];
    saveCommunityGroups(currentCommunity.id, updated);

    setActiveCommunityGroupId(newGroup.id);
    setMobileActiveView('chat');
    setShowCreateCommunityGroupModal(false);
    setNewCommunityGroupName('');
    setNewCommunityGroupDesc('');
    showToast(`Group "${newGroup.name}" created in ${currentCommunity.name}`);
  };

  const handleDeleteCommunityGroup = (groupId: string) => {
    const existing = currentCommunity.groups || [];
    const updated = existing.filter((g) => g.id !== groupId);
    saveCommunityGroups(currentCommunity.id, updated);

    // Purge messages for that group
    clearChatMessages(`grp_${currentCommunity.id}_${groupId}`);

    if (activeCommunityGroupId === groupId) {
      setActiveCommunityGroupId(null);
      if (currentCommunity.channels.length > 0) {
        setActiveChannelId(currentCommunity.channels[0].id);
      }
    }
    showToast('🚪 Group caucus removed');
  };

  const toggleMuteContext = (contextId: string) => {
    const next = !mutedContexts[contextId];
    const updated = { ...mutedContexts, [contextId]: next };
    setMutedContexts(updated);
    try {
      localStorage.setItem('zenvitra_muted_contexts_v2', JSON.stringify(updated));
    } catch (_) {}
    showToast(next ? '🔕 Notifications muted for this room' : '🔔 Notifications unmuted');
  };

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 2500);
  };

  // Voice recording timer
  useEffect(() => {
    let interval: any;
    if (isRecordingVoice) {
      interval = setInterval(() => {
        setRecordingSeconds((prev) => prev + 1);
      }, 1000);
    } else {
      setRecordingSeconds(0);
    }
    return () => clearInterval(interval);
  }, [isRecordingVoice]);

  // WebRTC Video Preview
  useEffect(() => {
    if (activeCall.isActive && activeCall.callType === 'video') {
      navigator.mediaDevices?.getUserMedia({ video: true, audio: true })
        .then((stream) => {
          setLocalMediaStream(stream);
          if (localVideoRef.current) {
            localVideoRef.current.srcObject = stream;
          }
        })
        .catch(() => {});
    } else {
      if (localMediaStream) {
        localMediaStream.getTracks().forEach((track) => track.stop());
        setLocalMediaStream(null);
      }
    }
  }, [activeCall.isActive, activeCall.callType]);

  const currentCommunity = useMemo(() => {
    return communities.find((c) => c.id === selectedCommunityId) || communities[0];
  }, [communities, selectedCommunityId]);

  const activeChannel = useMemo(() => {
    if (selectedCommunityId === 'comm-direct' || activeCommunityGroupId) return null;
    return currentCommunity.channels.find((ch) => ch.id === activeChannelId) || currentCommunity.channels[0] || null;
  }, [currentCommunity, activeChannelId, selectedCommunityId, activeCommunityGroupId]);

  /* Permission check for Server Roles & Configuration */
  const canManageCurrentRoles = useMemo(() => {
    if (currentUserUsername === 'yuveer') return true;
    const currentMember = currentCommunity.members?.find((m) => m.username === currentUserUsername);
    if (!currentMember) return false;
    const memberRoles = currentCommunity.roles.filter((r) => currentMember.roleIds.includes(r.id));
    return memberRoles.some((r) => r.permissions.manageRoles || r.permissions.manageServer);
  }, [currentUserUsername, currentCommunity]);

  const toggleCategoryCollapse = (catId: string) => {
    setCollapsedCategories((prev) => ({ ...prev, [catId]: !prev[catId] }));
  };

  const activeCommunityGroup = useMemo(() => {
    if (selectedCommunityId === 'comm-direct' || !activeCommunityGroupId) return null;
    return (currentCommunity.groups || []).find((g) => g.id === activeCommunityGroupId) || null;
  }, [currentCommunity, activeCommunityGroupId, selectedCommunityId]);

  /* Current Conversation / Channel / Group ID for messages */
  const currentChatContextId = useMemo(() => {
    if (selectedCommunityId === 'comm-direct') {
      return activeConversationId || 'conv-zenvitra-hq';
    }
    if (activeCommunityGroupId) {
      return `grp_${selectedCommunityId}_${activeCommunityGroupId}`;
    }
    return `chan_${activeChannel?.id || 'ch-general'}`;
  }, [selectedCommunityId, activeConversationId, activeCommunityGroupId, activeChannel]);

  /* Messages displayed in current view */
  const displayedMessages = useMemo(() => {
    return messagesMap[currentChatContextId] || [];
  }, [messagesMap, currentChatContextId]);

  /* Dynamic room info (used by header, participants button, and room info modal) */
  const currentRoomInfo = useMemo(() => {
    if (activeCommunityGroup) {
      const allMembers = (activeCommunityGroup.members && activeCommunityGroup.members.length > 0)
        ? activeCommunityGroup.members
        : (currentCommunity.members && currentCommunity.members.length > 0 ? currentCommunity.members : []);
      const activeMembers = allMembers.filter((m) => m.status === 'online' || m.status === 'idle');
      const activeCount = activeMembers.length > 0 ? activeMembers.length : 1;
      const totalCount = allMembers.length > 0 ? allMembers.length : (activeCommunityGroup.membersCount || 1);

      return {
        title: activeCommunityGroup.name,
        badge: 'COMMUNITY GROUP',
        description: activeCommunityGroup.description || 'Specialized multilateral taskforce caucus',
        type: 'group',
        icon: activeCommunityGroup.icon || '💬',
        memberCount: totalCount,
        activeParticipantCount: activeCount,
        link: typeof window !== 'undefined' ? `${window.location.origin}/chat?community=${selectedCommunityId}&group=${activeCommunityGroup.id}` : '',
        id: activeCommunityGroup.id,
      };
    }
    if (activeChannel) {
      if (activeChannel.type === 'voice') {
        const voiceUsers = activeChannel.activeVoiceUsers || [];
        const activeCount = voiceUsers.length;
        const totalCount = currentCommunity.members?.length || Math.max(voiceUsers.length, 1);
        return {
          title: `#${activeChannel.name}`,
          badge: 'VOICE STAGE',
          description: activeChannel.description || 'Live floor microphone & speeches',
          type: 'channel',
          icon: '🔊',
          memberCount: totalCount,
          activeParticipantCount: activeCount,
          link: typeof window !== 'undefined' ? `${window.location.origin}/chat?community=${selectedCommunityId}&channel=${activeChannel.id}` : '',
          id: activeChannel.id,
        };
      }
      const allMembers = currentCommunity.members || [];
      const activeMembers = allMembers.filter((m) => m.status === 'online' || m.status === 'idle');
      const activeCount = activeMembers.length > 0 ? activeMembers.length : 1;
      const totalCount = allMembers.length > 0 ? allMembers.length : 1;

      return {
        title: `#${activeChannel.name}`,
        badge: activeChannel.type === 'announcement' ? 'ANNOUNCEMENT' : 'CHAMBER CHANNEL',
        description: activeChannel.description || 'Official chamber channel dispatches',
        type: 'channel',
        icon: activeChannel.type === 'announcement' ? '📢' : '#',
        memberCount: totalCount,
        activeParticipantCount: activeCount,
        link: typeof window !== 'undefined' ? `${window.location.origin}/chat?community=${selectedCommunityId}&channel=${activeChannel.id}` : '',
        id: activeChannel.id,
      };
    }
    const convMembers = activeConversation?.members || [];
    const activeMembers = convMembers.filter((m) => m.status === 'online' || m.status === 'idle');
    const activeCount = activeMembers.length > 0 ? activeMembers.length : 1;
    const totalCount = convMembers.length > 0 ? convMembers.length : 2;

    return {
      title: activeConversation?.name || 'Direct Link',
      badge: activeConversation?.type === 'broadcast' ? 'BROADCAST' : activeConversation?.type === 'group' ? 'GROUP DM' : 'DIRECT ENVOY',
      description: activeConversation?.description || (activeConversation?.handle ? `@${activeConversation.handle}` : 'Encrypted sovereign DM wire'),
      type: 'conversation',
      icon: '💬',
      memberCount: totalCount,
      activeParticipantCount: activeCount,
      link: typeof window !== 'undefined' ? `${window.location.origin}/chat?conv=${activeConversationId}` : '',
      id: activeConversationId || '',
    };
  }, [activeCommunityGroup, activeChannel, activeConversation, activeConversationId, selectedCommunityId, currentCommunity]);

  /* Subgroup Posting Restriction Check */
  const isSubgroupRestricted = useMemo(() => {
    if (!activeCommunityGroup) return false;
    if (canManageCurrentRoles) return false;

    if (activeCommunityGroup.isLocked) return true;
    if (activeCommunityGroup.onlyAdminsCanPost) return true;

    if (activeCommunityGroup.allowedRoleIds && activeCommunityGroup.allowedRoleIds.length > 0) {
      const myMember = currentCommunity.members?.find((m) => m.id === (currentUser?.id || 'u_self'));
      const myRoleIds = myMember?.roleIds || [];
      const hasAllowedRole = activeCommunityGroup.allowedRoleIds.some((rId) => myRoleIds.includes(rId));
      if (!hasAllowedRole) return true;
    }

    return false;
  }, [activeCommunityGroup, canManageCurrentRoles, currentCommunity.members, currentUser]);

  /* Dynamic Roster for Participants Drawer */
  const drawerRoster = useMemo(() => {
    if (activeCommunityGroup) {
      const mems: CommunityMember[] = (activeCommunityGroup.members && activeCommunityGroup.members.length > 0)
        ? activeCommunityGroup.members
        : (currentCommunity.members && currentCommunity.members.length > 0 ? currentCommunity.members : []);
      const online = mems.filter((m) => m.status === 'online' || m.status === 'idle');
      const offline = mems.filter((m) => m.status === 'offline' || m.status === 'dnd');
      return {
        title: `${activeCommunityGroup.name} Participants`,
        subtitle: `${online.length} Active / ${mems.length} Total`,
        sections: [
          { name: `ACTIVE MEMBERS — ${online.length}`, members: online },
          { name: `OFFLINE MEMBERS — ${offline.length}`, members: offline }
        ]
      };
    }

    if (activeChannel) {
      if (activeChannel.type === 'voice') {
        const connectedUsers = activeChannel.activeVoiceUsers || [];
        const communityMems = currentCommunity.members || [];
        const connectedIds = connectedUsers.map((u) => u.id);
        const offlineMems = communityMems.filter((m) => !connectedIds.includes(m.id));

        return {
          title: `#${activeChannel.name} Participants`,
          subtitle: `${connectedUsers.length} In Voice / ${communityMems.length || connectedUsers.length} Total`,
          sections: [
            {
              name: `IN VOICE FLOOR — ${connectedUsers.length}`,
              members: connectedUsers.map((u) => ({
                id: u.id,
                name: u.name,
                username: u.username,
                avatar: u.avatar,
                status: 'online' as const,
                roleIds: ['role-voice'],
                customStatus: u.isSpeaking ? 'Speaking Floor' : u.isMuted ? 'Muted' : 'Listening',
                isSpeaking: u.isSpeaking,
                isMuted: u.isMuted,
              }))
            },
            {
              name: `OFFLINE DELEGATES — ${offlineMems.length}`,
              members: offlineMems
            }
          ]
        };
      }

      const allMembers = currentCommunity.members || [];
      const online = allMembers.filter((m) => m.status === 'online' || m.status === 'idle');
      const offline = allMembers.filter((m) => m.status === 'offline' || m.status === 'dnd');

      return {
        title: `#${activeChannel.name} Participants`,
        subtitle: `${online.length} Active / ${allMembers.length} Total`,
        sections: [
          { name: `ONLINE DELEGATES — ${online.length}`, members: online },
          { name: `OFFLINE DELEGATES — ${offline.length}`, members: offline }
        ]
      };
    }

    const convMembers = activeConversation?.members || [];
    const online = convMembers.filter((m) => m.status === 'online' || m.status === 'idle');
    const offline = convMembers.filter((m) => m.status !== 'online' && m.status !== 'idle');

    return {
      title: `${activeConversation?.name || 'Conversation'} Participants`,
      subtitle: `${online.length} Active / ${convMembers.length} Total`,
      sections: [
        {
          name: `ONLINE PARTICIPANTS — ${online.length}`,
          members: online.map((m) => ({
            id: m.id || m.username,
            name: m.name,
            username: m.username,
            avatar: m.avatar,
            status: m.status || 'online',
            roleIds: ['role-delegate'],
            customStatus: m.role || 'Member'
          }))
        },
        {
          name: `OFFLINE PARTICIPANTS — ${offline.length}`,
          members: offline.map((m) => ({
            id: m.id || m.username,
            name: m.name,
            username: m.username,
            avatar: m.avatar,
            status: m.status || 'offline',
            roleIds: ['role-delegate'],
            customStatus: m.role || 'Member'
          }))
        }
      ]
    };
  }, [activeCommunityGroup, activeChannel, currentCommunity, activeConversation]);

  /* Real dynamic Media, Docs, and Links extracted from room messages */
  const channelMediaItems = useMemo(() => {
    const items: { id: string; url: string; title: string; date: string; sender: string; type: 'image' | 'video' }[] = [];
    displayedMessages.forEach((msg) => {
      if (msg.attachments && msg.attachments.length > 0) {
        msg.attachments.forEach((att: any, idx: number) => {
          if (att.type === 'image' || att.type === 'video' || /\.(png|jpe?g|gif|webp|mp4|mov)$/i.test(att.url || '')) {
            items.push({
              id: `${msg.id}_att_${idx}`,
              url: att.url || '',
              title: att.name || 'Shared Media',
              date: msg.timestamp,
              sender: msg.senderName,
              type: att.type === 'video' ? 'video' : 'image',
            });
          }
        });
      }
      if (msg.snap?.mediaUrl) {
        items.push({
          id: `${msg.id}_snap`,
          url: msg.snap.mediaUrl,
          title: msg.snap.caption || 'Glimpse Snap',
          date: msg.timestamp,
          sender: msg.senderName,
          type: 'image',
        });
      }
      if (msg.stickerUrl) {
        items.push({
          id: `${msg.id}_sticker`,
          url: msg.stickerUrl,
          title: msg.content || 'Sticker',
          date: msg.timestamp,
          sender: msg.senderName,
          type: 'image',
        });
      }
      const imgMatch = msg.content.match(/https?:\/\/[^\s]+?\.(png|jpe?g|gif|webp)/i);
      if (imgMatch) {
        items.push({
          id: `${msg.id}_url`,
          url: imgMatch[0],
          title: 'Media Link',
          date: msg.timestamp,
          sender: msg.senderName,
          type: 'image',
        });
      }
    });
    return items;
  }, [displayedMessages]);

  const channelDocItems = useMemo(() => {
    const docs: { id: string; title: string; size?: string; date: string; sender: string; url?: string }[] = [];
    displayedMessages.forEach((msg) => {
      if (msg.attachments && msg.attachments.length > 0) {
        msg.attachments.forEach((att: any, idx: number) => {
          if (att.type === 'file' || att.type === 'document' || att.type === 'pdf' || /\.(pdf|docx?|xlsx?|txt|json)$/i.test(att.name || att.url || '')) {
            docs.push({
              id: `${msg.id}_doc_${idx}`,
              title: att.name || 'Document Dispatch',
              size: att.size || 'Document',
              date: msg.timestamp,
              sender: msg.senderName,
              url: att.url,
            });
          }
        });
      }
      if (msg.nativeObject?.type === 'doc') {
        docs.push({
          id: `${msg.id}_native_doc`,
          title: msg.nativeObject.title || 'Official Document',
          size: 'ZENVITRA DOC',
          date: msg.timestamp,
          sender: msg.senderName,
          url: (msg.nativeObject as any)?.url || `/docs`,
        });
      }
    });
    return docs;
  }, [displayedMessages]);

  const channelLinkItems = useMemo(() => {
    const links: { id: string; url: string; title: string; date: string; sender: string }[] = [];
    const urlRegex = /(https?:\/\/[^\s]+)/g;
    displayedMessages.forEach((msg) => {
      const matches = msg.content.match(urlRegex);
      if (matches) {
        matches.forEach((url, idx) => {
          let domain = url;
          try {
            domain = new URL(url).hostname;
          } catch (_) {}
          links.push({
            id: `${msg.id}_link_${idx}`,
            url,
            title: domain,
            date: msg.timestamp,
            sender: msg.senderName,
          });
        });
      }
    });
    return links;
  }, [displayedMessages]);

  // Scroll to bottom on message change
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [displayedMessages]);

  /* Filtered Conversations List */
  const filteredConversations = useMemo(() => {
    return conversations.filter((c) => {
      if (activeCategoryFilter === 'broadcasts' && c.type !== 'broadcast') return false;
      if (activeCategoryFilter === 'general' && c.category !== 'general') return false;
      if (activeCategoryFilter === 'requests' && c.category !== 'requests') return false;
      
      if (!searchQuery.trim()) return true;
      const q = searchQuery.toLowerCase();
      return (
        c.name.toLowerCase().includes(q) ||
        (c.handle && c.handle.toLowerCase().includes(q)) ||
        (c.lastMessage?.text && c.lastMessage.text.toLowerCase().includes(q))
      );
    });
  }, [conversations, searchQuery, activeCategoryFilter]);

  /* Handle Send Message */
  const handleSendMessage = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!messageText.trim()) return;

    // Sender role: if user is yuveer, show Founder; else Delegate
    const myRole = currentUserUsername === 'yuveer' ? '👑 FOUNDER' : 'DELEGATE';

    sendMessage(
      messageText.trim(),
      undefined,
      replyingTo ? {
        id: replyingTo.id,
        senderName: replyingTo.senderName,
        snippet: replyingTo.content.slice(0, 80),
      } : undefined,
      currentChatContextId,
      myRole
    );

    setMessageText('');
    setReplyingTo(null);
    setShowEmojiPicker(false);
  };

  /* Start Voice Note Recording */
  const startRecordingAudio = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const mediaRecorder = new MediaRecorder(stream);
      mediaRecorderRef.current = mediaRecorder;
      audioChunksRef.current = [];

      mediaRecorder.ondataavailable = (event) => {
        if (event.data.size > 0) {
          audioChunksRef.current.push(event.data);
        }
      };

      mediaRecorder.onstop = () => {
        const audioBlob = new Blob(audioChunksRef.current, { type: 'audio/webm' });
        const reader = new FileReader();
        reader.readAsDataURL(audioBlob);
        reader.onloadend = () => {
          const base64Audio = reader.result as string;
          sendVoiceNote(base64Audio, recordingSeconds || 5, currentChatContextId);
          showToast('🎙️ Sovereign Voice Note dispatched');
        };
        stream.getTracks().forEach((track) => track.stop());
      };

      mediaRecorder.start();
      setIsRecordingVoice(true);
    } catch {
      setIsRecordingVoice(true);
    }
  };

  const stopRecordingAudio = () => {
    if (mediaRecorderRef.current && mediaRecorderRef.current.state !== 'inactive') {
      mediaRecorderRef.current.stop();
    } else {
      sendVoiceNote('data:audio/mp3;base64,mock', recordingSeconds || 6, currentChatContextId);
      showToast('🎙️ Sovereign Voice Note dispatched');
    }
    setIsRecordingVoice(false);
  };

  /* Handle Direct Number / Handle Call */
  const handleInitiateDirectCall = (handleOrNumber: string, callType: 'voice' | 'video') => {
    const clean = handleOrNumber.replace(/^@/, '').trim().toLowerCase();
    if (!clean) return;

    const isPlatformUser = 
      profiles.some((p) => p.username.toLowerCase() === clean) ||
      conversations.some((c) => (c.handle?.toLowerCase() === clean || c.members.some((m) => m.username.toLowerCase() === clean))) ||
      clean === 'yuveer' ||
      clean === 'yuveerji';

    if (!isPlatformUser) {
      setIsOnlineCallingError(`Delegate @${clean} is currently offline or not registered on Zenvitra. Direct calling is only available for active platform members.`);
      return;
    }

    setIsOnlineCallingError(null);
    setShowDirectCallModal(false);
    startDirectNumberCall(clean, `@${clean}`, callType);
  };

  /* Web Audio Synthesizer for Zero-Asset Discord-Style Chimes */
  const playVoiceTone = (type: 'join' | 'leave' | 'mute' | 'unmute') => {
    try {
      const AudioCtx = window.AudioContext || (window as any).webkitAudioContext;
      if (!AudioCtx) return;
      const ctx = new AudioCtx();
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.connect(gain);
      gain.connect(ctx.destination);

      if (type === 'join') {
        osc.type = 'sine';
        osc.frequency.setValueAtTime(392, ctx.currentTime);
        osc.frequency.exponentialRampToValueAtTime(784, ctx.currentTime + 0.12);
        gain.gain.setValueAtTime(0.08, ctx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.25);
        osc.start();
        osc.stop(ctx.currentTime + 0.25);
      } else if (type === 'leave') {
        osc.type = 'sine';
        osc.frequency.setValueAtTime(659.25, ctx.currentTime);
        osc.frequency.exponentialRampToValueAtTime(329.63, ctx.currentTime + 0.15);
        gain.gain.setValueAtTime(0.08, ctx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.25);
        osc.start();
        osc.stop(ctx.currentTime + 0.25);
      } else if (type === 'mute') {
        osc.type = 'triangle';
        osc.frequency.setValueAtTime(350, ctx.currentTime);
        osc.frequency.exponentialRampToValueAtTime(200, ctx.currentTime + 0.08);
        gain.gain.setValueAtTime(0.06, ctx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.1);
        osc.start();
        osc.stop(ctx.currentTime + 0.1);
      } else if (type === 'unmute') {
        osc.type = 'triangle';
        osc.frequency.setValueAtTime(220, ctx.currentTime);
        osc.frequency.exponentialRampToValueAtTime(440, ctx.currentTime + 0.08);
        gain.gain.setValueAtTime(0.06, ctx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.1);
        osc.start();
        osc.stop(ctx.currentTime + 0.1);
      }
    } catch (_) {}
  };

  /* Leave Voice Channel */
  const handleLeaveVoiceChannel = (playTone = true) => {
    if (playTone) playVoiceTone('leave');

    if (voiceAnimFrameRef.current) {
      cancelAnimationFrame(voiceAnimFrameRef.current);
      voiceAnimFrameRef.current = null;
    }
    if (voiceStreamRef.current) {
      voiceStreamRef.current.getTracks().forEach((track) => track.stop());
      voiceStreamRef.current = null;
    }
    if (audioContextRef.current && audioContextRef.current.state !== 'closed') {
      audioContextRef.current.close().catch(() => {});
      audioContextRef.current = null;
    }
    analyserRef.current = null;
    setMicVolumeLevel(0);
    setIsCurrentUserSpeaking(false);

    if (activeVoiceChannel) {
      const leavingChannelId = activeVoiceChannel.id;
      setCommunities((prev) => {
        const updated = prev.map((c) => {
          if (c.id === currentCommunity.id) {
            return {
              ...c,
              channels: c.channels.map((ch) =>
                ch.id === leavingChannelId
                  ? {
                      ...ch,
                      activeVoiceUsers: (ch.activeVoiceUsers || []).filter(
                        (u) => u.id !== (currentUser?.id || 'u_self')
                      )
                    }
                  : ch
              )
            };
          }
          return c;
        });
        try {
          localStorage.setItem(
            'zenvitra_user_communities_v4',
            JSON.stringify(updated.filter((c) => c.id !== 'comm-direct'))
          );
        } catch (_) {}
        return updated;
      });
      showToast(`Disconnected from ${activeVoiceChannel.name}`);
    }
    setActiveVoiceChannel(null);
  };

  /* Join Voice Channel with Live User Roster & Real Audio Analysis */
  const handleJoinVoiceChannel = async (channel: ChatChannel) => {
    if (activeVoiceChannel?.id === channel.id) {
      handleLeaveVoiceChannel(true);
      return;
    }

    if (activeVoiceChannel) {
      handleLeaveVoiceChannel(false);
    }

    playVoiceTone('join');
    setActiveVoiceChannel(channel);
    showToast(`🔊 Connected to ${channel.name}`);

    const selfVoiceUser = {
      id: currentUser?.id || 'u_self',
      name: currentUserName && currentUserName !== 'You' ? currentUserName : 'You',
      username: currentUserUsername || 'you',
      avatar: (currentUser as any)?.avatar || (currentUser as any)?.photoURL || undefined,
      isSpeaking: false,
      isMuted: isVoiceMuted,
      isDeafened: isVoiceDeafened,
      activityText: 'Floor Speaker'
    };

    const peerVoiceUsers = (channel.activeVoiceUsers && channel.activeVoiceUsers.length > 0)
      ? channel.activeVoiceUsers.filter((u) => u.id !== selfVoiceUser.id)
      : [];

    const updatedVoiceUsers = [selfVoiceUser, ...peerVoiceUsers];

    setCommunities((prev) => {
      const updated = prev.map((c) => {
        if (c.id === currentCommunity.id) {
          return {
            ...c,
            channels: c.channels.map((ch) =>
              ch.id === channel.id ? { ...ch, activeVoiceUsers: updatedVoiceUsers } : ch
            )
          };
        }
        return c;
      });
      try {
        localStorage.setItem(
          'zenvitra_user_communities_v4',
          JSON.stringify(updated.filter((c) => c.id !== 'comm-direct'))
        );
      } catch (_) {}
      return updated;
    });

    try {
      if (typeof navigator !== 'undefined' && navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
        const stream = await navigator.mediaDevices.getUserMedia({ audio: true, video: false });
        voiceStreamRef.current = stream;

        const AudioCtx = window.AudioContext || (window as any).webkitAudioContext;
        if (AudioCtx) {
          const ctx = new AudioCtx();
          audioContextRef.current = ctx;
          const source = ctx.createMediaStreamSource(stream);
          const analyser = ctx.createAnalyser();
          analyser.fftSize = 64;
          analyser.smoothingTimeConstant = 0.4;
          source.connect(analyser);
          analyserRef.current = analyser;

          const dataArray = new Uint8Array(analyser.frequencyBinCount);

          const detectAudio = () => {
            if (!analyserRef.current) return;
            analyserRef.current.getByteFrequencyData(dataArray);

            let sum = 0;
            for (let i = 0; i < dataArray.length; i++) {
              sum += dataArray[i];
            }
            const avg = sum / dataArray.length;
            const normalized = Math.min(100, Math.round((avg / 128) * 100));
            setMicVolumeLevel(normalized);

            const isSpeakingNow = !isVoiceMuted && avg > 14;
            setIsCurrentUserSpeaking(isSpeakingNow);

            setCommunities((prev) =>
              prev.map((c) => {
                if (c.id === currentCommunity.id) {
                  return {
                    ...c,
                    channels: c.channels.map((ch) => {
                      if (ch.id === channel.id && ch.activeVoiceUsers) {
                        return {
                          ...ch,
                          activeVoiceUsers: ch.activeVoiceUsers.map((u) =>
                            u.id === (currentUser?.id || 'u_self')
                              ? { ...u, isSpeaking: isSpeakingNow, isMuted: isVoiceMuted, isDeafened: isVoiceDeafened }
                              : u
                          )
                        };
                      }
                      return ch;
                    })
                  };
                }
                return c;
              })
            );

            voiceAnimFrameRef.current = requestAnimationFrame(detectAudio);
          };

          voiceAnimFrameRef.current = requestAnimationFrame(detectAudio);
        }
      }
    } catch (err) {
      console.warn('Microphone stream optional note:', err);
    }
  };

  /* Toggle Voice Mute */
  const handleToggleVoiceMute = () => {
    const nextMuted = !isVoiceMuted;
    setIsVoiceMuted(nextMuted);
    playVoiceTone(nextMuted ? 'mute' : 'unmute');

    if (voiceStreamRef.current) {
      voiceStreamRef.current.getAudioTracks().forEach((t) => {
        t.enabled = !nextMuted;
      });
    }

    if (activeVoiceChannel) {
      setCommunities((prev) =>
        prev.map((c) => {
          if (c.id === currentCommunity.id) {
            return {
              ...c,
              channels: c.channels.map((ch) => {
                if (ch.id === activeVoiceChannel.id && ch.activeVoiceUsers) {
                  return {
                    ...ch,
                    activeVoiceUsers: ch.activeVoiceUsers.map((u) =>
                      u.id === (currentUser?.id || 'u_self')
                        ? { ...u, isMuted: nextMuted, isSpeaking: nextMuted ? false : u.isSpeaking }
                        : u
                    )
                  };
                }
                return ch;
              })
            };
          }
          return c;
        })
      );
    }
    showToast(nextMuted ? 'Microphone muted' : 'Microphone unmuted');
  };

  /* Toggle Voice Deafen */
  const handleToggleVoiceDeafen = () => {
    const nextDeafened = !isVoiceDeafened;
    setIsVoiceDeafened(nextDeafened);
    playVoiceTone(nextDeafened ? 'mute' : 'unmute');

    if (activeVoiceChannel) {
      setCommunities((prev) =>
        prev.map((c) => {
          if (c.id === currentCommunity.id) {
            return {
              ...c,
              channels: c.channels.map((ch) => {
                if (ch.id === activeVoiceChannel.id && ch.activeVoiceUsers) {
                  return {
                    ...ch,
                    activeVoiceUsers: ch.activeVoiceUsers.map((u) =>
                      u.id === (currentUser?.id || 'u_self')
                        ? { ...u, isDeafened: nextDeafened }
                        : u
                    )
                  };
                }
                return ch;
              })
            };
          }
          return c;
        })
      );
    }
    showToast(nextDeafened ? 'Deafened' : 'Undeafened');
  };

  /* Create Caucus Community from Template or Custom */
  const handleCreateCaucus = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newCaucusName.trim()) return;

    const chosenTemplate =
      COMMUNITY_TEMPLATES.find((t) => t.id === selectedTemplateId) || COMMUNITY_TEMPLATES[0];

    const newCommId = `comm-user-${Date.now()}`;
    const newComm: ChatCommunity = {
      id: newCommId,
      name: newCaucusName.trim(),
      icon: newCaucusIcon || chosenTemplate.icon,
      badge: chosenTemplate.badge,
      description: newCaucusDescription.trim() || chosenTemplate.description,
      categories: chosenTemplate.categories.map((cat) => ({
        ...cat,
        id: `cat-${Date.now()}-${cat.id}`
      })),
      roles: chosenTemplate.roles.map((r, i) => ({
        ...r,
        id: `role-${Date.now()}-${i}`,
      })),
      members: [
        {
          id: currentUser?.id || 'u_self',
          name: currentUserName || 'You',
          username: currentUserUsername || 'you',
          status: 'online',
          roleIds: [`role-${Date.now()}-0`],
          customStatus: 'Caucus Founder'
        }
      ],
      channels: chosenTemplate.channels.map((ch, i) => ({
        ...ch,
        id: `ch-${Date.now()}-${i}`,
        activeVoiceUsers: ch.type === 'voice' ? [] : undefined
      })),
      groups: []
    };

    setCommunities((prev) => {
      const updated = [...prev, newComm];
      try {
        localStorage.setItem(
          'zenvitra_user_communities_v4',
          JSON.stringify(updated.filter((c) => c.id !== 'comm-direct'))
        );
      } catch (_) {}
      return updated;
    });

    setActiveRailTab('communities');
    setSelectedCommunityId(newComm.id);
    if (newComm.channels.length > 0) {
      setActiveChannelId(newComm.channels[0].id);
      setActiveCommunityGroupId(null);
    }
    setShowCreateCaucusModal(false);
    setNewCaucusName('');
    setNewCaucusDescription('');
    showToast(`Caucus "${newComm.name}" established`);
  };

  /* Delete Community */
  const handleDeleteCommunity = (communityId: string) => {
    if (communityId === 'comm-direct') return;
    setCommunities((prev) => {
      const filtered = prev.filter((c) => c.id !== communityId);
      try {
        localStorage.setItem(
          'zenvitra_user_communities_v4',
          JSON.stringify(filtered.filter((c) => c.id !== 'comm-direct'))
        );
      } catch (_) {}
      return filtered;
    });

    if (selectedCommunityId === communityId) {
      setSelectedCommunityId('comm-direct');
      setActiveRailTab('chats');
    }
    showToast('Server deleted');
  };

  /* Create Channel */
  const handleCreateChannel = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newChannelName.trim()) return;

    const cleanName = newChannelName.trim().toLowerCase().replace(/[^a-z0-9_-]/g, '-');
    const newChan: ChatChannel = {
      id: `ch-${Date.now()}`,
      name: cleanName,
      type: newChannelType,
      description: newChannelDesc || undefined,
      activeVoiceUsers: newChannelType === 'voice' ? [] : undefined
    };

    setCommunities((prev) => {
      const updated = prev.map((c) => {
        if (c.id === selectedCommunityId) {
          return { ...c, channels: [...c.channels, newChan] };
        }
        return c;
      });
      try {
        localStorage.setItem(
          'zenvitra_user_communities_v4',
          JSON.stringify(updated.filter((c) => c.id !== 'comm-direct'))
        );
      } catch (_) {}
      return updated;
    });

    setActiveChannelId(newChan.id);
    setShowCreateChannelModal(false);
    setNewChannelName('');
    setNewChannelDesc('');
    showToast(`Channel #${cleanName} created`);
  };

  if (!mounted) {
    return (
      <div className="h-screen w-full bg-[#050608] flex items-center justify-center">
        <div className="w-8 h-8 rounded-full border-2 border-purple-500/20 border-t-purple-400 animate-spin" />
      </div>
    );
  }

  return (
    <div className="relative h-full w-full bg-[#050608] text-white flex overflow-hidden font-sans select-none">
      
      {/* ── Toast Notification ── */}
      <AnimatePresence>
        {toastMessage && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="fixed top-6 left-1/2 -translate-x-1/2 z-50 px-4 py-2 rounded-full bg-white text-black font-semibold text-xs shadow-2xl flex items-center gap-2"
          >
            <Check className="w-3.5 h-3.5 text-emerald-600" />
            <span>{toastMessage}</span>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ══════════════════════════════════════════════════════════════
          1. WHATSAPP & SOVEREIGN CAUCUS RAIL (FAR-LEFT)
          ══════════════════════════════════════════════════════════════ */}
      <div className={`${
        mobileActiveView === 'chat' ? 'hidden md:flex' : 'flex'
      } w-16 sm:w-18 bg-[#030406] border-r border-white/[0.06] flex-col items-center py-4 justify-between z-30 flex-shrink-0`}>
        
        {/* Top App Tabs (WhatsApp Desktop style) */}
        <div className="flex flex-col items-center gap-2.5 w-full">
          {/* Chats Tab */}
          <button
            onClick={() => {
              setActiveRailTab('chats');
              setSelectedCommunityId('comm-direct');
            }}
            title="Chats"
            className={`relative group w-11 h-11 rounded-2xl flex items-center justify-center transition-all duration-200 cursor-pointer ${
              activeRailTab === 'chats' && selectedCommunityId === 'comm-direct'
                ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/40 shadow-[0_0_15px_rgba(16,185,129,0.25)]'
                : 'bg-white/[0.03] hover:bg-white/[0.08] text-neutral-400 hover:text-white'
            }`}
          >
            {activeRailTab === 'chats' && selectedCommunityId === 'comm-direct' && (
              <div className="absolute -left-3 top-1/2 -translate-y-1/2 w-1.5 h-6 bg-emerald-400 rounded-r-full" />
            )}
            <MessageSquare className="w-5 h-5" />
          </button>

          {/* Calls Tab */}
          <button
            onClick={() => setActiveRailTab('calls')}
            title="Calls & Schedule"
            className={`relative group w-11 h-11 rounded-2xl flex items-center justify-center transition-all duration-200 cursor-pointer ${
              activeRailTab === 'calls'
                ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/40 shadow-[0_0_15px_rgba(16,185,129,0.25)]'
                : 'bg-white/[0.03] hover:bg-white/[0.08] text-neutral-400 hover:text-white'
            }`}
          >
            {activeRailTab === 'calls' && (
              <div className="absolute -left-3 top-1/2 -translate-y-1/2 w-1.5 h-6 bg-emerald-400 rounded-r-full" />
            )}
            <Phone className="w-5 h-5" />
          </button>

          {/* Communities Hub Tab */}
          <button
            onClick={() => {
              setActiveRailTab('communities');
              if (selectedCommunityId === 'comm-direct') {
                const firstUserComm = communities.find((c) => c.id !== 'comm-direct');
                if (firstUserComm) {
                  setSelectedCommunityId(firstUserComm.id);
                  if (firstUserComm.channels.length > 0) {
                    setActiveChannelId(firstUserComm.channels[0].id);
                    setActiveCommunityGroupId(null);
                  }
                }
              }
            }}
            title="Communities"
            className={`relative group w-11 h-11 rounded-2xl flex items-center justify-center transition-all duration-200 cursor-pointer ${
              activeRailTab === 'communities'
                ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/40 shadow-[0_0_15px_rgba(16,185,129,0.25)]'
                : 'bg-white/[0.03] hover:bg-white/[0.08] text-neutral-400 hover:text-white'
            }`}
          >
            {activeRailTab === 'communities' && (
              <div className="absolute -left-3 top-1/2 -translate-y-1/2 w-1.5 h-6 bg-emerald-400 rounded-r-full" />
            )}
            <Users className="w-5 h-5" />
          </button>

          {/* Media / Docs / Links Gallery Tab (from WhatsApp Desktop media gallery) */}
          <button
            onClick={() => {
              setActiveRailTab('media');
              setShowMediaGalleryModal(true);
            }}
            title="Media, Docs & Links Gallery"
            className={`relative group w-11 h-11 rounded-2xl flex items-center justify-center transition-all duration-200 cursor-pointer ${
              showMediaGalleryModal
                ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/40 shadow-[0_0_15px_rgba(16,185,129,0.25)]'
                : 'bg-white/[0.03] hover:bg-white/[0.08] text-neutral-400 hover:text-white'
            }`}
          >
            <ImageIcon className="w-5 h-5" />
          </button>

          <div className="w-8 h-px bg-white/[0.08] my-1" />

          {/* Sovereign Communities / Caucus Icons */}
          <div className="flex flex-col items-center gap-2 max-h-52 overflow-y-auto scrollbar-none w-full px-1">
            {communities.filter((c) => c.id !== 'comm-direct').map((comm) => {
              const isSelected = selectedCommunityId === comm.id && activeRailTab !== 'calls';
              return (
                <button
                  key={comm.id}
                  onClick={() => {
                    setActiveRailTab('communities');
                    setSelectedCommunityId(comm.id);
                    if (comm.channels.length > 0) {
                      setActiveChannelId(comm.channels[0].id);
                      setActiveCommunityGroupId(null);
                    }
                  }}
                  title={comm.name}
                  className={`relative group w-10 h-10 rounded-2xl flex items-center justify-center text-base transition-all duration-200 cursor-pointer ${
                    isSelected 
                      ? 'bg-gradient-to-tr from-purple-600 to-indigo-600 text-white rounded-[16px] shadow-[0_0_16px_rgba(168,85,247,0.4)]' 
                      : 'bg-white/[0.04] hover:bg-white/[0.08] text-neutral-300 hover:text-white rounded-2xl hover:rounded-[16px]'
                  }`}
                >
                  {isSelected && (
                    <div className="absolute -left-2.5 top-1/2 -translate-y-1/2 w-1.5 h-5 bg-white rounded-r-full shadow-md" />
                  )}
                  <span>{comm.icon}</span>
                </button>
              );
            })}

            {/* Add Server / Caucus Button */}
            <button
              onClick={() => {
                setNewCaucusName(currentUserName && currentUserName !== 'You' ? `${currentUserName}'s Server` : 'New Server');
                setShowCreateCaucusModal(true);
              }}
              title="Add a Server / Caucus"
              className="w-10 h-10 rounded-2xl bg-white/[0.03] hover:bg-emerald-500/20 border border-dashed border-white/20 hover:border-emerald-500/50 text-neutral-400 hover:text-emerald-400 flex items-center justify-center transition-all duration-200 cursor-pointer hover:rounded-[16px] group shrink-0"
            >
              <Plus className="w-5 h-5 transition-transform group-hover:rotate-90 text-neutral-300 group-hover:text-emerald-400" />
            </button>
          </div>
        </div>

        {/* Bottom Rail Actions */}
        <div className="flex flex-col items-center gap-2.5 w-full pt-3 border-t border-white/[0.06]">
          {/* Direct Call / Dialer Button */}
          <button
            onClick={() => setShowDirectCallModal(true)}
            title="Direct Dial / Handle Call"
            className="w-10 h-10 rounded-2xl bg-white/[0.03] hover:bg-purple-500/15 border border-white/[0.08] hover:border-purple-500/30 text-neutral-400 hover:text-purple-300 flex items-center justify-center transition-all shadow-sm cursor-pointer"
          >
            <Phone className="w-4 h-4" />
          </button>

          {/* Settings */}
          <button
            onClick={() => setShowSettingsModal(true)}
            title="Settings & Profile"
            className="w-10 h-10 rounded-2xl bg-white/[0.03] hover:bg-white/[0.08] text-neutral-400 hover:text-white flex items-center justify-center transition-all cursor-pointer"
          >
            <Settings className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* ══════════════════════════════════════════════════════════════
          2. SECONDARY SIDEBAR: INSTAGRAM DMs & DISCORD CHANNELS
          ══════════════════════════════════════════════════════════════ */}
      <div className={`${
        isSidebarCollapsed ? 'w-0 hidden md:w-0' : 'w-full md:w-72 lg:w-84'
      } ${
        mobileActiveView === 'chat' ? 'hidden md:flex' : 'flex'
      } bg-[#070709] border-r border-white/[0.06] flex-col transition-all duration-300 flex-shrink-0 relative z-20 h-full`}>
        
        {/* Top Header: Username + GlimpseScore + New Chat Compose Button */}
        {/* Top Header: Community Name or @Username + Actions */}
        <div className="p-3.5 border-b border-white/[0.06] flex items-center justify-between">
          <div className="flex items-center gap-2 min-w-0">
            {selectedCommunityId === 'comm-direct' ? (
              <button
                onClick={() => setShowSettingsModal(true)}
                className="font-display font-bold text-sm text-white flex items-center gap-1.5 cursor-pointer hover:text-purple-300 transition text-left truncate"
                title="ZEN.CHAT Settings & Profile"
              >
                <span className="truncate">@{currentUserUsername}</span>
                <span className="w-2 h-2 rounded-full bg-emerald-400 inline-block ml-0.5 animate-pulse flex-shrink-0" />
                <ChevronDown className="w-3.5 h-3.5 text-neutral-400 flex-shrink-0" />
              </button>
            ) : (
              <div className="flex items-center gap-2 min-w-0">
                <span className="text-base flex-shrink-0">{currentCommunity.icon}</span>
                <div className="min-w-0">
                  <h2 className="font-display font-bold text-xs sm:text-sm text-white truncate">
                    {currentCommunity.name}
                  </h2>
                  <span className="font-mono text-[9px] text-purple-400 font-semibold uppercase tracking-wider block">
                    {currentCommunity.badge || 'CHAMBER'}
                  </span>
                </div>
              </div>
            )}
          </div>

          <div className="flex items-center gap-1.5 flex-shrink-0">
            {/* Server Roles button if permitted in caucus */}
            {selectedCommunityId !== 'comm-direct' && canManageCurrentRoles && (
              <button
                onClick={() => setShowRoleSettingsModal(true)}
                className="p-1.5 rounded-xl bg-purple-500/10 hover:bg-purple-500/20 text-purple-300 transition shadow-sm cursor-pointer flex items-center justify-center"
                title="Configure Server Roles & Permissions"
              >
                <Sliders className="w-4 h-4" />
              </button>
            )}

            {/* 3-Dot Options & Management Menu in sidebar header (Replacing + button) */}
            <div className="relative">
              <button
                onClick={() => setShowSidebarHeaderMenu((prev) => !prev)}
                className="p-1.5 rounded-xl bg-white/[0.04] hover:bg-white/[0.08] text-neutral-300 hover:text-white transition shadow-sm cursor-pointer flex items-center justify-center"
                title="Options & Management"
              >
                <MoreVertical className="w-4 h-4" />
              </button>

              {showSidebarHeaderMenu && (
                <div className="absolute right-0 top-9 w-56 p-1.5 rounded-2xl bg-[#0e1017]/95 backdrop-blur-xl border border-white/10 shadow-2xl z-50 space-y-1 text-xs font-sans">
                  {selectedCommunityId !== 'comm-direct' ? (
                    <>
                      <div className="px-3 py-1.5 border-b border-white/[0.06]">
                        <p className="font-semibold text-white truncate">{currentCommunity.name}</p>
                        <p className="font-mono text-[9px] text-purple-400">Community Management</p>
                      </div>
                      <button
                        onClick={() => {
                          setShowSidebarHeaderMenu(false);
                          setShowCreateCommunityGroupModal(true);
                        }}
                        className="w-full flex items-center gap-2 px-3 py-2 rounded-xl text-neutral-200 hover:text-white hover:bg-purple-500/20 text-left transition cursor-pointer"
                      >
                        <Users className="w-4 h-4 text-purple-400" />
                        <span>Create Community Group</span>
                      </button>
                      <button
                        onClick={() => {
                          setShowSidebarHeaderMenu(false);
                          setShowCreateChannelModal(true);
                        }}
                        className="w-full flex items-center gap-2 px-3 py-2 rounded-xl text-neutral-200 hover:text-white hover:bg-white/[0.06] text-left transition cursor-pointer"
                      >
                        <Hash className="w-4 h-4 text-cyan-400" />
                        <span>Create Channel</span>
                      </button>
                      {canManageCurrentRoles && (
                        <button
                          onClick={() => {
                            setShowSidebarHeaderMenu(false);
                            setShowManageCommunityModal(true);
                          }}
                          className="w-full flex items-center gap-2 px-3 py-2 rounded-xl text-neutral-200 hover:text-white hover:bg-white/[0.06] text-left transition cursor-pointer"
                        >
                          <Settings className="w-4 h-4 text-purple-400" />
                          <span>Server Settings & Channels</span>
                        </button>
                      )}
                      {canManageCurrentRoles && (
                        <button
                          onClick={() => {
                            setShowSidebarHeaderMenu(false);
                            setShowRoleSettingsModal(true);
                          }}
                          className="w-full flex items-center gap-2 px-3 py-2 rounded-xl text-neutral-200 hover:text-white hover:bg-white/[0.06] text-left transition cursor-pointer"
                        >
                          <ShieldCheck className="w-4 h-4 text-amber-400" />
                          <span>Roles & Permissions</span>
                        </button>
                      )}
                      <button
                        onClick={() => {
                          setShowSidebarHeaderMenu(false);
                          setShowRoomInfoModal(true);
                        }}
                        className="w-full flex items-center gap-2 px-3 py-2 rounded-xl text-neutral-200 hover:text-white hover:bg-white/[0.06] text-left transition cursor-pointer"
                      >
                        <Info className="w-4 h-4 text-emerald-400" />
                        <span>Community Details</span>
                      </button>
                      <button
                        onClick={() => {
                          setShowSidebarHeaderMenu(false);
                          if (typeof navigator !== 'undefined' && navigator.clipboard) {
                            navigator.clipboard.writeText(`${window.location.origin}/chat?community=${selectedCommunityId}`);
                          }
                          showToast('📋 Community invite link copied');
                        }}
                        className="w-full flex items-center gap-2 px-3 py-2 rounded-xl text-neutral-200 hover:text-white hover:bg-white/[0.06] text-left transition cursor-pointer"
                      >
                        <Copy className="w-4 h-4 text-blue-400" />
                        <span>Copy Community Link</span>
                      </button>
                      <div className="pt-1 border-t border-white/[0.06]">
                        <button
                          onClick={() => {
                            setShowSidebarHeaderMenu(false);
                            handleDeleteCommunity(selectedCommunityId);
                          }}
                          className="w-full flex items-center gap-2 px-3 py-2 rounded-xl text-rose-400 hover:text-rose-300 hover:bg-rose-500/10 text-left transition cursor-pointer"
                        >
                          <Trash2 className="w-4 h-4 text-rose-400" />
                          <span>Delete Server</span>
                        </button>
                      </div>
                    </>
                  ) : (
                    <>
                      <div className="px-3 py-1.5 border-b border-white/[0.06]">
                        <p className="font-semibold text-white">Direct Envoys</p>
                        <p className="font-mono text-[9px] text-neutral-400">Compose & Caucus</p>
                      </div>
                      <button
                        onClick={() => {
                          setShowSidebarHeaderMenu(false);
                          setShowNewChatActionModal(true);
                        }}
                        className="w-full flex items-center gap-2 px-3 py-2 rounded-xl text-neutral-200 hover:text-white hover:bg-purple-500/20 text-left transition cursor-pointer"
                      >
                        <MessageSquare className="w-4 h-4 text-purple-400" />
                        <span>New Direct Message</span>
                      </button>
                      <button
                        onClick={() => {
                          setShowSidebarHeaderMenu(false);
                          setShowCreateCaucusModal(true);
                        }}
                        className="w-full flex items-center gap-2 px-3 py-2 rounded-xl text-neutral-200 hover:text-white hover:bg-white/[0.06] text-left transition cursor-pointer"
                      >
                        <Globe2 className="w-4 h-4 text-emerald-400" />
                        <span>Establish Caucus</span>
                      </button>
                    </>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>

        {/* ── CONDITIONAL VIEWS BASED ON ACTIVE RAIL TAB ── */}
        {activeRailTab === 'calls' ? (
          /* ── WHATSAPP-STYLE CALLS HUB & HISTORY ── */
          <div className="flex-1 flex flex-col overflow-y-auto p-3 space-y-4">
            <div className="flex items-center justify-between pb-2 border-b border-white/[0.06]">
              <h3 className="font-display font-bold text-sm text-white flex items-center gap-2">
                <Phone className="w-4 h-4 text-emerald-400" />
                <span>Calls</span>
              </h3>
              <button
                onClick={() => setShowDirectCallModal(true)}
                className="p-1.5 rounded-xl bg-white/[0.04] hover:bg-white/[0.08] text-neutral-300 hover:text-white transition cursor-pointer"
                title="Direct Dial"
              >
                <PhoneCall className="w-4 h-4 text-neutral-400 hover:text-emerald-400" />
              </button>
            </div>

            {/* Quick Action Cards: New Call Link & Schedule Call */}
            <div className="space-y-2">
              <button
                onClick={() => setShowNewCallLinkModal(true)}
                className="w-full flex items-center gap-3 p-2.5 rounded-2xl bg-white/[0.03] hover:bg-emerald-500/10 border border-white/[0.06] hover:border-emerald-500/30 transition text-left cursor-pointer group"
              >
                <div className="w-10 h-10 rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center shrink-0 group-hover:scale-105 transition">
                  <Link2 className="w-5 h-5" />
                </div>
                <div className="min-w-0">
                  <h4 className="font-display font-semibold text-xs text-white">Create a call link</h4>
                  <p className="font-sans text-[11px] text-neutral-400 truncate">Share a link for your diplomatic meeting</p>
                </div>
              </button>

              <button
                onClick={() => {
                  setScheduleCallName(`${currentUserName}'s call`);
                  setShowScheduleCallModal(true);
                }}
                className="w-full flex items-center gap-3 p-2.5 rounded-2xl bg-white/[0.03] hover:bg-purple-500/10 border border-white/[0.06] hover:border-purple-500/30 transition text-left cursor-pointer group"
              >
                <div className="w-10 h-10 rounded-full bg-purple-500/20 text-purple-400 flex items-center justify-center shrink-0 group-hover:scale-105 transition">
                  <Calendar className="w-5 h-5" />
                </div>
                <div className="min-w-0">
                  <h4 className="font-display font-semibold text-xs text-white">Schedule call</h4>
                  <p className="font-sans text-[11px] text-neutral-400 truncate">Set date, duration & participant approvals</p>
                </div>
              </button>
            </div>

            {/* Scheduled Calls List */}
            {scheduledCalls.length > 0 && (
              <div className="space-y-2 pt-2">
                <span className="font-mono text-[9px] tracking-[0.2em] text-neutral-400 uppercase font-semibold block px-1">
                  UPCOMING SCHEDULED
                </span>
                {scheduledCalls.map((item) => (
                  <div
                    key={item.id}
                    className="p-3 rounded-2xl bg-white/[0.02] border border-white/[0.06] space-y-2"
                  >
                    <div className="flex items-start justify-between gap-2">
                      <div className="flex items-center gap-2">
                        <div className="w-8 h-8 rounded-xl bg-purple-500/20 text-purple-300 flex items-center justify-center font-bold text-xs">
                          {item.callType === 'video' ? <Video className="w-4 h-4" /> : <Phone className="w-4 h-4" />}
                        </div>
                        <div>
                          <h5 className="font-display font-medium text-xs text-white">{item.title}</h5>
                          <span className="font-mono text-[9px] text-emerald-400">
                            {item.startDate} • {item.startTime} {item.endTime ? `- ${item.endTime}` : ''}
                          </span>
                        </div>
                      </div>
                      <span className="font-mono text-[9px] px-1.5 py-0.5 rounded bg-emerald-500/10 text-emerald-400 border border-emerald-500/30">
                        SCHEDULED
                      </span>
                    </div>
                    {item.description && (
                      <p className="font-sans text-[11px] text-neutral-400 line-clamp-2">{item.description}</p>
                    )}
                    <div className="flex items-center gap-2 pt-1 border-t border-white/[0.04]">
                      <button
                        onClick={() => {
                          startCall(activeConversationId || 'conv-zenvitra-hq', item.callType);
                          showToast('Connecting to scheduled call...');
                        }}
                        className="flex-1 py-1.5 rounded-xl bg-emerald-500 hover:bg-emerald-600 text-black font-bold text-[11px] transition text-center cursor-pointer"
                      >
                        Join Call
                      </button>
                      <button
                        onClick={() => {
                          navigator.clipboard?.writeText(item.link);
                          showToast('Call link copied to clipboard');
                        }}
                        className="p-1.5 rounded-xl bg-white/[0.04] hover:bg-white/[0.08] text-neutral-300 hover:text-white transition cursor-pointer"
                        title="Copy Link"
                      >
                        <Copy className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* Recent Calls Log */}
            <div className="space-y-2 pt-2">
              <span className="font-mono text-[9px] tracking-[0.2em] text-neutral-400 uppercase font-semibold block px-1">
                RECENT CALLS
              </span>
              {calls.length === 0 ? (
                <div className="text-center py-8 text-neutral-500 text-xs">
                  <Phone className="w-8 h-8 mx-auto mb-2 opacity-30" />
                  <p>No recent calls</p>
                </div>
              ) : (
                calls.map((call) => (
                  <div
                    key={call.id}
                    className="flex items-center justify-between p-2 rounded-2xl hover:bg-white/[0.03] transition"
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-9 h-9 rounded-full bg-white/[0.04] border border-white/[0.08] flex items-center justify-center font-bold text-xs text-neutral-300">
                        {call.contactName.charAt(0)}
                      </div>
                      <div>
                        <h5 className="font-display font-semibold text-xs text-white">{call.contactName}</h5>
                        <div className="flex items-center gap-1.5 text-[10px] text-neutral-400">
                          {call.direction === 'incoming' ? (
                            <span className="text-emerald-400">↙ Incoming</span>
                          ) : (
                            <span className="text-purple-400">↗ Outgoing</span>
                          )}
                          <span>•</span>
                          <span>{formatViewerTime(call.timestamp)}</span>
                        </div>
                      </div>
                    </div>
                    <button
                      onClick={() => startCall(activeConversationId || 'conv-zenvitra-hq', call.type)}
                      className="p-2 rounded-xl bg-white/[0.03] hover:bg-emerald-500/20 text-neutral-300 hover:text-emerald-400 transition cursor-pointer"
                    >
                      {call.type === 'video' ? <Video className="w-3.5 h-3.5" /> : <Phone className="w-3.5 h-3.5" />}
                    </button>
                  </div>
                ))
              )}
            </div>
          </div>
        ) : activeRailTab === 'communities' && selectedCommunityId === 'comm-direct' ? (
          /* ── WHATSAPP-STYLE COMMUNITIES HUB OVERVIEW (media_1788634705090.png) ── */
          <div className="flex-1 flex flex-col overflow-y-auto p-3 space-y-4">
            <div className="flex items-center justify-between pb-2 border-b border-white/[0.06]">
              <h3 className="font-display font-bold text-sm text-white flex items-center gap-2">
                <Users className="w-4 h-4 text-emerald-400" />
                <span>Communities</span>
              </h3>
            </div>

            {/* + New Community Button (WhatsApp Style Green Icon) */}
            <button
              onClick={() => setShowCreateCaucusModal(true)}
              className="w-full flex items-center gap-3 p-2.5 rounded-2xl bg-white/[0.03] hover:bg-emerald-500/10 border border-white/[0.06] hover:border-emerald-500/30 transition text-left cursor-pointer group"
            >
              <div className="w-10 h-10 rounded-2xl bg-emerald-500 text-black flex items-center justify-center shrink-0 group-hover:scale-105 transition font-bold shadow-md">
                <Users className="w-5 h-5 text-black" />
              </div>
              <div>
                <h4 className="font-display font-semibold text-xs text-white">New community</h4>
                <p className="font-sans text-[11px] text-neutral-400">Bring members together in topic groups</p>
              </div>
            </button>

            {/* Communities Hierarchy List */}
            <div className="space-y-4 pt-2">
              {communities.filter((c) => c.id !== 'comm-direct').map((comm) => (
                <div key={comm.id} className="p-3 rounded-2xl bg-white/[0.02] border border-white/[0.06] space-y-2">
                  <div
                    onClick={() => {
                      setSelectedCommunityId(comm.id);
                      if (comm.channels.length > 0) setActiveChannelId(comm.channels[0].id);
                    }}
                    className="flex items-center gap-3 cursor-pointer hover:opacity-80 transition"
                  >
                    <div className="w-11 h-11 rounded-2xl bg-gradient-to-tr from-purple-600 to-indigo-600 flex items-center justify-center text-lg shadow-md shrink-0">
                      {comm.icon}
                    </div>
                    <div className="min-w-0">
                      <h4 className="font-display font-semibold text-xs text-white truncate">{comm.name}</h4>
                      <p className="font-mono text-[9px] text-purple-400 truncate">{comm.badge || 'COMMUNITY'}</p>
                    </div>
                  </div>

                  {/* WhatsApp Subgroups & Channels in Community */}
                  <div className="pl-4 space-y-1 pt-1 border-l-2 border-white/10 ml-5">
                    {/* Announcements sub-channel */}
                    <button
                      onClick={() => {
                        setSelectedCommunityId(comm.id);
                        if (comm.channels.length > 0) setActiveChannelId(comm.channels[0].id);
                        setMobileActiveView('chat');
                      }}
                      className="w-full flex items-center gap-2 px-2 py-1.5 rounded-xl hover:bg-white/[0.04] text-xs text-neutral-300 text-left transition"
                    >
                      <span className="text-sm">📢</span>
                      <span className="truncate font-medium">Announcements</span>
                    </button>

                    {/* Community Groups */}
                    {(comm.groups || []).map((grp) => (
                      <button
                        key={grp.id}
                        onClick={() => {
                          setSelectedCommunityId(comm.id);
                          setActiveCommunityGroupId(grp.id);
                          setMobileActiveView('chat');
                        }}
                        className="w-full flex items-center justify-between px-2 py-1.5 rounded-xl hover:bg-white/[0.04] text-xs text-neutral-300 text-left transition"
                      >
                        <div className="flex items-center gap-2 truncate">
                          <span>{grp.icon || '💬'}</span>
                          <span className="truncate">{grp.name}</span>
                        </div>
                        <span className="font-mono text-[9px] text-neutral-500">{grp.membersCount}</span>
                      </button>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        ) : selectedCommunityId === 'comm-direct' ? (
          /* ── Direct Messages View with Instagram Notes ── */
          <div className="flex-1 flex flex-col overflow-hidden relative">
            
            {/* 1. Instagram-Style Zen Notes Row */}
            <ZenNotesRow />

            {/* 2. Search & Category Filters */}
            <div className="p-3 space-y-2 border-b border-white/[0.06]">
              <div className="relative">
                <Search className="w-3.5 h-3.5 text-neutral-400 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search dispatches & delegates..."
                  className="w-full pl-9 pr-3 py-1.5 rounded-xl bg-white/[0.03] border border-white/[0.06] focus:border-purple-500/40 text-xs text-white placeholder-neutral-500 focus:outline-none transition"
                />
              </div>

              {/* Category Filter Pills (Primary, Requests, General, Broadcasts) */}
              <div className="flex items-center gap-1.5 overflow-x-auto scrollbar-none pt-0.5">
                {[
                  { id: 'primary', label: 'Primary' },
                  { id: 'requests', label: 'Requests' },
                  { id: 'general', label: 'General' },
                  { id: 'broadcasts', label: 'Broadcasts' },
                ].map((tab) => (
                  <button
                    key={tab.id}
                    onClick={() => setActiveCategoryFilter(tab.id as any)}
                    className={`px-3 py-1 rounded-full text-[10px] font-mono whitespace-nowrap transition cursor-pointer ${
                      activeCategoryFilter === tab.id
                        ? 'bg-white text-black font-bold shadow-sm'
                        : 'bg-white/[0.03] text-neutral-400 hover:bg-white/[0.06] hover:text-white'
                    }`}
                  >
                    {tab.label}
                  </button>
                ))}
              </div>
            </div>

            {/* 3. Conversation List */}
            <div className="flex-1 overflow-y-auto divide-y divide-white/[0.02] p-2 space-y-1">
              {filteredConversations.length === 0 ? (
                <div className="flex flex-col items-center justify-center h-48 text-center p-4 space-y-3">
                  <div className="w-12 h-12 rounded-2xl bg-white/[0.04] border border-white/[0.08] flex items-center justify-center text-neutral-400">
                    <MessageSquare className="w-6 h-6 text-purple-400" />
                  </div>
                  <div>
                    <h5 className="font-display font-semibold text-xs text-white">No Conversations</h5>
                    <p className="font-sans text-[11px] text-neutral-400 mt-1 max-w-[200px]">
                      Tap the <span className="text-purple-400 font-bold">+</span> button above to start a secure direct message or group chat.
                    </p>
                  </div>
                </div>
              ) : (
                filteredConversations.map((conv) => {
                  const isActive = activeConversationId === conv.id;
                  return (
                    <div
                      key={conv.id}
                      onClick={() => {
                        setActiveConversationId(conv.id);
                        setMobileActiveView('chat');
                      }}
                      className={`flex items-center gap-3 p-2.5 rounded-2xl cursor-pointer transition-all duration-200 ${
                        isActive 
                          ? 'bg-white/[0.08] border border-white/10 shadow-sm' 
                          : 'hover:bg-white/[0.03] border border-transparent'
                      }`}
                    >
                    {/* Avatar with Story / Online Ring */}
                    <div className="relative w-10 h-10 rounded-full p-[2px] bg-gradient-to-tr from-purple-500 to-indigo-600 flex items-center justify-center flex-shrink-0">
                      <div className="w-full h-full rounded-full bg-black flex items-center justify-center text-xs font-bold text-white uppercase overflow-hidden">
                        {conv.avatar ? (
                          <img src={conv.avatar} alt={conv.name} className="w-full h-full object-cover" />
                        ) : conv.isAi ? (
                          <span>🤖</span>
                        ) : (
                          conv.name.charAt(0)
                        )}
                      </div>
                      <span className="absolute bottom-0 right-0 w-2.5 h-2.5 rounded-full bg-emerald-500 border-2 border-[#070709]" />
                    </div>

                    {/* Details */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between gap-1">
                        <h4 className="font-display font-semibold text-xs text-white truncate">
                          {conv.name}
                        </h4>
                        <span className="font-mono text-[9px] text-neutral-400 shrink-0">
                          {formatViewerTime(conv.lastMessage?.timestamp) || 'Now'}
                        </span>
                      </div>
                      <p className="font-sans text-[11px] text-neutral-400 truncate mt-0.5">
                        {conv.lastMessage?.text || 'Direct link open'}
                      </p>
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </div>
        ) : (
          /* Discord-Style Channel Hierarchy with Collapsible Categories */
          <div className="flex-1 flex flex-col overflow-y-auto p-2.5 space-y-4">
            
            {/* Render channels grouped by category if categories exist */}
            {(currentCommunity.categories && currentCommunity.categories.length > 0) ? (
              currentCommunity.categories.map((cat) => {
                const isCollapsed = !!collapsedCategories[cat.id];
                const catChannels = currentCommunity.channels.filter((ch) => ch.categoryId === cat.id);
                if (catChannels.length === 0) return null;

                return (
                  <div key={cat.id} className="space-y-1">
                    {/* Collapsible Category Header (media_1788634768430.png) */}
                    <button
                      onClick={() => toggleCategoryCollapse(cat.id)}
                      className="w-full flex items-center gap-1 px-1.5 py-1 text-neutral-400 hover:text-neutral-200 text-left transition cursor-pointer group select-none"
                    >
                      {isCollapsed ? (
                        <ChevronRight className="w-3 h-3 text-neutral-500 group-hover:text-neutral-300 transition-transform" />
                      ) : (
                        <ChevronDown className="w-3 h-3 text-neutral-500 group-hover:text-neutral-300 transition-transform" />
                      )}
                      <span className="font-mono text-[10px] tracking-wider uppercase font-bold text-neutral-400 group-hover:text-neutral-200">
                        {cat.name}
                      </span>
                    </button>

                    {/* Channels inside this category */}
                    {!isCollapsed && (
                      <div className="space-y-0.5 pl-1">
                        {catChannels.map((ch) => {
                          const isVoice = ch.type === 'voice';
                          const isAnnouncement = ch.type === 'announcement';
                          const isActive = !activeCommunityGroupId && activeChannelId === ch.id;
                          const isConnected = activeVoiceChannel?.id === ch.id;

                          if (isVoice) {
                            return (
                              <div key={ch.id} className="space-y-1">
                                <button
                                  onClick={() => {
                                    if (ch.isLocked) {
                                      showToast('🔒 Voice Chamber is restricted/locked');
                                      return;
                                    }
                                    handleJoinVoiceChannel(ch);
                                  }}
                                  className={`w-full flex items-center justify-between px-2.5 py-1.5 rounded-xl text-xs transition text-left cursor-pointer ${
                                    isConnected
                                      ? 'bg-purple-500/20 border border-purple-500/30 text-purple-200 font-medium'
                                      : 'text-neutral-400 hover:bg-white/[0.04] hover:text-neutral-200'
                                  }`}
                                >
                                  <div className="flex items-center gap-2 truncate">
                                    <Volume2 className={`w-3.5 h-3.5 shrink-0 ${isConnected ? 'text-purple-400 animate-pulse' : 'text-neutral-500'}`} />
                                    <span className="truncate">{ch.name}</span>
                                  </div>
                                  <div className="flex items-center gap-1.5 shrink-0">
                                    {ch.userLimit && (
                                      <span className="font-mono text-[9px] px-1.5 py-0.5 rounded bg-black/40 border border-white/10 text-neutral-400">
                                        {ch.activeVoiceUsers ? String(ch.activeVoiceUsers.length).padStart(2, '0') : '00'}{' '}
                                        {String(ch.userLimit).padStart(2, '0')}
                                      </span>
                                    )}
                                    {ch.isLocked && (
                                      <span className="flex items-center gap-1 font-mono text-[9px] px-1.5 py-0.5 rounded bg-amber-500/10 border border-amber-500/20 text-amber-400">
                                        <Lock className="w-2.5 h-2.5" />
                                      </span>
                                    )}
                                  </div>
                                </button>

                                {/* Discord indented active voice users with Live Badges */}
                                {ch.activeVoiceUsers && ch.activeVoiceUsers.length > 0 && (
                                  <div className="pl-6 pr-2 py-0.5 space-y-1">
                                    {ch.activeVoiceUsers.map((user) => (
                                      <div
                                        key={user.id}
                                        className={`flex items-center justify-between px-2 py-1 rounded-lg text-xs transition-all duration-150 ${
                                          user.isSpeaking
                                            ? 'bg-emerald-500/10 border border-emerald-500/30 text-white'
                                            : 'bg-white/[0.02] text-neutral-300'
                                        }`}
                                      >
                                        <div className="flex items-center gap-2 truncate">
                                          <div className="relative flex items-center justify-center">
                                            <div
                                              className={`w-5 h-5 rounded-full text-[10px] flex items-center justify-center font-bold transition-all duration-150 ${
                                                user.isSpeaking
                                                  ? 'bg-emerald-500/30 border-2 border-emerald-400 ring-2 ring-emerald-400/80 shadow-[0_0_12px_rgba(52,211,153,0.8)] animate-pulse text-emerald-200'
                                                  : 'bg-purple-600/30 border border-purple-500/40 text-purple-300'
                                              }`}
                                            >
                                              {user.name.charAt(0)}
                                            </div>
                                            {user.isSpeaking && (
                                              <span className="absolute -top-0.5 -right-0.5 w-2 h-2 rounded-full bg-emerald-400 animate-ping ring-2 ring-black" />
                                            )}
                                          </div>
                                          <span
                                            className={`font-sans text-[11px] truncate ${
                                              user.isSpeaking ? 'text-emerald-300 font-semibold' : 'text-neutral-200'
                                            }`}
                                          >
                                            {user.name}
                                          </span>
                                        </div>
                                        <div className="flex items-center gap-1.5 text-[10px]">
                                          {user.activityText && (
                                            <span className="font-mono text-[8px] px-1.5 py-0.2 rounded bg-white/5 border border-white/10 text-neutral-400 font-medium">
                                              {user.activityText}
                                            </span>
                                          )}
                                          {user.isMuted ? (
                                            <MicOff className="w-3 h-3 text-red-400" />
                                          ) : user.isSpeaking ? (
                                            <Volume2 className="w-3 h-3 text-emerald-400 animate-bounce" />
                                          ) : (
                                            <div className="w-1.5 h-1.5 rounded-full bg-emerald-400/60" />
                                          )}
                                        </div>
                                      </div>
                                    ))}
                                  </div>
                                )}
                              </div>
                            );
                          }

                          return (
                            <button
                              key={ch.id}
                              onClick={() => {
                                setActiveCommunityGroupId(null);
                                setActiveChannelId(ch.id);
                                setMobileActiveView('chat');
                              }}
                              className={`w-full flex items-center justify-between px-2.5 py-1.5 rounded-xl text-xs transition text-left cursor-pointer ${
                                isActive
                                  ? 'bg-white/[0.08] text-white font-medium shadow-sm'
                                  : 'text-neutral-400 hover:bg-white/[0.03] hover:text-neutral-200'
                              }`}
                            >
                              <div className="flex items-center gap-2 truncate">
                                {isAnnouncement ? (
                                  <RadioTower className="w-3.5 h-3.5 text-purple-400 shrink-0" />
                                ) : (
                                  <Hash className="w-3.5 h-3.5 text-neutral-500 shrink-0" />
                                )}
                                <span className="truncate">{ch.name}</span>
                              </div>
                              <div className="flex items-center gap-1.5 shrink-0">
                                {ch.unreadCount ? (
                                  <span className="font-mono text-[9px] px-1.5 py-0.2 rounded-full bg-red-500 text-white font-bold">
                                    {ch.unreadCount}
                                  </span>
                                ) : null}
                                {ch.isLocked && <Lock className="w-3 h-3 text-neutral-500" />}
                              </div>
                            </button>
                          );
                        })}
                      </div>
                    )}
                  </div>
                );
              })
            ) : (
              /* Fallback if no categories defined */
              <div className="space-y-1">
                <span className="font-mono text-[9px] tracking-[0.2em] text-neutral-400 uppercase font-semibold px-2 block">
                  CHANNELS
                </span>
                {currentCommunity.channels.map((ch) => (
                  <button
                    key={ch.id}
                    onClick={() => {
                      setActiveCommunityGroupId(null);
                      setActiveChannelId(ch.id);
                      setMobileActiveView('chat');
                    }}
                    className={`w-full flex items-center justify-between px-2.5 py-1.5 rounded-xl text-xs transition text-left cursor-pointer ${
                      activeChannelId === ch.id
                        ? 'bg-white/[0.08] text-white font-medium'
                        : 'text-neutral-400 hover:bg-white/[0.03] hover:text-neutral-200'
                    }`}
                  >
                    <div className="flex items-center gap-2 truncate">
                      <Hash className="w-3.5 h-3.5 text-neutral-500 shrink-0" />
                      <span className="truncate">{ch.name}</span>
                    </div>
                  </button>
                ))}
              </div>
            )}

            {/* Section: COMMUNITY GROUPS (Multilateral Taskforces) */}
            <div className="space-y-1 pt-2 border-t border-white/[0.04]">
              <div className="flex items-center justify-between px-2 pb-1">
                <span className="font-mono text-[9px] tracking-[0.2em] text-neutral-400 uppercase font-semibold block">
                  COMMUNITY GROUPS {currentCommunity.groups && currentCommunity.groups.length > 0 ? `(${currentCommunity.groups.length})` : ''}
                </span>
                <button
                  onClick={() => setShowCreateCommunityGroupModal(true)}
                  className="p-1 rounded-lg hover:bg-white/[0.06] text-neutral-400 hover:text-purple-300 transition cursor-pointer"
                  title="Create Community Group"
                >
                  <Plus className="w-3 h-3" />
                </button>
              </div>

              {currentCommunity.groups && currentCommunity.groups.length > 0 ? (
                currentCommunity.groups.map((group) => {
                  const isActive = activeCommunityGroupId === group.id;
                  return (
                    <button
                      key={group.id}
                      onClick={() => {
                        setActiveCommunityGroupId(group.id);
                        setMobileActiveView('chat');
                      }}
                      className={`w-full flex items-center justify-between px-2.5 py-2 rounded-xl text-xs transition text-left cursor-pointer ${
                        isActive
                          ? 'bg-purple-500/15 border border-purple-500/30 text-purple-200 font-medium'
                          : 'text-neutral-400 hover:bg-white/[0.03] hover:text-neutral-200 border border-transparent'
                      }`}
                    >
                      <div className="flex items-center gap-2 truncate">
                        <span className="text-sm shrink-0">{group.icon || '💬'}</span>
                        <div className="truncate">
                          <span className="truncate block font-medium text-white">{group.name}</span>
                          <span className="font-mono text-[9px] text-neutral-500 block truncate">
                            {group.membersCount || 1} {group.membersCount === 1 ? 'member' : 'members'}
                          </span>
                        </div>
                      </div>
                      <span className="font-mono text-[9px] px-1.5 py-0.5 rounded bg-white/[0.04] text-neutral-400 shrink-0">
                        GROUP
                      </span>
                    </button>
                  );
                })
              ) : (
                <div className="px-2 py-2 text-left">
                  <p className="font-mono text-[10px] text-neutral-500">
                    No community groups yet.
                  </p>
                  <button
                    onClick={() => setShowCreateCommunityGroupModal(true)}
                    className="mt-1 text-[10px] text-purple-400 hover:text-purple-300 font-mono flex items-center gap-1 cursor-pointer"
                  >
                    <Plus className="w-2.5 h-2.5" />
                    <span>Create a group caucus</span>
                  </button>
                </div>
              )}
            </div>
          </div>
        )}

        {/* ── Discord-Style Connected Voice HUD ── */}
        {activeVoiceChannel && (
          <div className="p-3 bg-[#0a0a12] border-t border-purple-500/20 flex flex-col gap-2 shadow-2xl">
            {/* Top row: Status, Ping, Disconnect */}
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2 min-w-0">
                <div className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse shadow-[0_0_8px_rgba(52,211,153,0.8)]" />
                <div className="min-w-0">
                  <div className="flex items-center gap-1.5">
                    <span className="font-mono text-[9px] text-emerald-400 font-bold uppercase tracking-wider">
                      Voice Connected
                    </span>
                    <span className="font-mono text-[8px] text-neutral-500">24ms (RTC HD)</span>
                  </div>
                  <span className="font-display font-medium text-xs text-white truncate block">
                    {activeVoiceChannel.name}
                  </span>
                </div>
              </div>

              <div className="flex items-center gap-1 shrink-0">
                <button
                  onClick={handleToggleVoiceMute}
                  className={`p-1.5 rounded-lg transition cursor-pointer ${
                    isVoiceMuted ? 'bg-red-500/20 text-red-400' : 'bg-white/[0.06] text-neutral-300 hover:text-white'
                  }`}
                  title={isVoiceMuted ? 'Unmute Mic' : 'Mute Mic'}
                >
                  {isVoiceMuted ? <MicOff className="w-3.5 h-3.5" /> : <Mic className="w-3.5 h-3.5" />}
                </button>
                <button
                  onClick={handleToggleVoiceDeafen}
                  className={`p-1.5 rounded-lg transition cursor-pointer ${
                    isVoiceDeafened ? 'bg-red-500/20 text-red-400' : 'bg-white/[0.06] text-neutral-300 hover:text-white'
                  }`}
                  title={isVoiceDeafened ? 'Undeafen' : 'Deafen'}
                >
                  <Headphones className="w-3.5 h-3.5" />
                </button>
                <button
                  onClick={() => handleLeaveVoiceChannel(true)}
                  className="p-1.5 rounded-lg bg-red-500/15 hover:bg-red-500/25 text-red-400 transition cursor-pointer"
                  title="Disconnect Voice"
                >
                  <PhoneOff className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>

            {/* Live Audio Visualizer Waveform (12 Frequency Bars) */}
            <div className="flex items-center justify-center gap-1 h-3.5 px-2 bg-black/40 rounded-lg border border-white/[0.04]">
              {[0.4, 0.7, 1.0, 0.6, 1.2, 0.8, 1.1, 0.5, 0.9, 0.7, 1.0, 0.4].map((mult, idx) => {
                const barHeight = isCurrentUserSpeaking
                  ? Math.max(3, Math.min(14, Math.round(micVolumeLevel * 0.15 * mult)))
                  : 2;
                return (
                  <div
                    key={idx}
                    className={`w-1 rounded-full transition-all duration-75 ${
                      isCurrentUserSpeaking ? 'bg-emerald-400 shadow-[0_0_6px_rgba(52,211,153,0.8)]' : 'bg-neutral-600'
                    }`}
                    style={{ height: `${barHeight}px` }}
                  />
                );
              })}
            </div>
          </div>
        )}

        {/* ── User Audio Control Dock (Bottommost) ── */}
        <div className="p-2.5 bg-[#040406] border-t border-white/[0.04] flex items-center justify-between">
          <div className="flex items-center gap-2 min-w-0">
            <div className="w-8 h-8 rounded-xl bg-purple-600/20 border border-purple-500/30 flex items-center justify-center text-purple-300 font-display text-xs flex-shrink-0">
              {currentUserName.charAt(0)}
            </div>
            <div className="min-w-0">
              <h5 className="font-display font-medium text-xs text-white truncate">
                {currentUserName}
              </h5>
              <p className="font-mono text-[9px] text-neutral-400 truncate">
                @{currentUserUsername}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-1 text-neutral-400">
            <button
              onClick={handleToggleVoiceMute}
              className="p-1.5 hover:text-white hover:bg-white/[0.04] rounded-lg transition cursor-pointer"
              title={isVoiceMuted ? 'Unmute Mic' : 'Mute Mic'}
            >
              {isVoiceMuted ? <MicOff className="w-3.5 h-3.5 text-red-400" /> : <Mic className="w-3.5 h-3.5" />}
            </button>
            <button
              onClick={handleToggleVoiceDeafen}
              className="p-1.5 hover:text-white hover:bg-white/[0.04] rounded-lg transition cursor-pointer"
              title={isVoiceDeafened ? 'Undeafen' : 'Deafen'}
            >
              {isVoiceDeafened ? <VolumeX className="w-3.5 h-3.5 text-red-400" /> : <Headphones className="w-3.5 h-3.5" />}
            </button>
            <button
              onClick={() => setShowSettingsModal(true)}
              className="p-1.5 hover:text-white hover:bg-white/[0.04] rounded-lg transition cursor-pointer"
              title="ZEN.CHAT Settings & Profile"
            >
              <Settings className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </div>

      {/* ══════════════════════════════════════════════════════════════
          3. MAIN STAGE: CONVERSATION WIRE & CALLING STAGE
          ══════════════════════════════════════════════════════════════ */}
      <div className={`flex-1 flex-col bg-[#050608] relative z-10 overflow-hidden h-full ${
        mobileActiveView === 'list' ? 'hidden md:flex' : 'flex'
      }`}>
        
        {/* Chat Stage Header */}
        <div className="h-14 border-b border-white/[0.06] px-3 sm:px-4 flex items-center justify-between bg-[#070709]/80 backdrop-blur-md">
          <div className="flex items-center gap-2 sm:gap-3 min-w-0">
            {/* Mobile Back Button: Returns to conversations list */}
            <button
              onClick={() => setMobileActiveView('list')}
              className="md:hidden p-2 rounded-xl bg-white/[0.06] hover:bg-white/10 text-neutral-300 hover:text-white transition cursor-pointer flex-shrink-0"
              title="Back to Conversations"
            >
              <ChevronLeft className="w-5 h-5 stroke-[2.5]" />
            </button>

            {/* Desktop Sidebar Toggle */}
            <button
              onClick={() => setIsSidebarCollapsed(!isSidebarCollapsed)}
              className="hidden md:flex p-1.5 rounded-lg bg-white/[0.04] text-neutral-400 hover:text-white transition"
            >
              {isSidebarCollapsed ? <PanelLeftOpen className="w-4 h-4" /> : <PanelLeftClose className="w-4 h-4" />}
            </button>

            {selectedCommunityId !== 'comm-direct' ? (
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-full bg-white/[0.05] border border-white/[0.08] text-neutral-300 flex items-center justify-center font-bold text-xs">
                  {activeCommunityGroup ? (
                    <span>{activeCommunityGroup.icon || '💬'}</span>
                  ) : (
                    <Hash className="w-4 h-4 text-neutral-400" />
                  )}
                </div>
                <div>
                  <h3 className="font-display font-medium text-xs sm:text-sm text-white flex items-center gap-1.5">
                    <span>
                      {activeCommunityGroup 
                        ? activeCommunityGroup.name 
                        : `#${activeChannel?.name || 'general'}`}
                    </span>
                    <span className="font-mono text-[9px] px-1.5 py-0.5 rounded bg-purple-500/10 border border-purple-500/30 text-purple-300 font-normal">
                      {activeCommunityGroup ? 'GROUP' : currentCommunity.badge || 'CHAMBER'}
                    </span>
                  </h3>
                  <span className="font-mono text-[10px] text-neutral-400 block truncate max-w-xs sm:max-w-md">
                    {activeCommunityGroup 
                      ? (activeCommunityGroup.description || 'Sovereign direct community group') 
                      : (activeChannel?.description || `${currentCommunity.name} floor wire`)}
                  </span>
                </div>
              </div>
            ) : (
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-full bg-purple-500/20 text-purple-300 flex items-center justify-center font-bold text-xs">
                  {activeConversation ? activeConversation.name.charAt(0) : '#'}
                </div>
                <div>
                  <h3 className="font-display font-medium text-xs text-white">
                    {activeConversation ? activeConversation.name : 'Direct Envoy Wire'}
                  </h3>
                  <span className="font-mono text-[9px] text-emerald-400 flex items-center gap-1">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
                    <span>Sovereign Link Secure</span>
                  </span>
                </div>
              </div>
            )}
          </div>

          <div className="flex items-center gap-1.5 relative">
            {/* WhatsApp-Style Calling Hub & Dropdown (media_1788634705085.png) */}
            <div className="relative flex items-center bg-white/[0.04] border border-white/[0.08] rounded-xl overflow-visible">
              <button
                onClick={() => startCall(activeConversationId || 'conv-zenvitra-hq', 'video')}
                className="px-2.5 py-1.5 hover:bg-emerald-500/20 text-neutral-300 hover:text-emerald-400 transition cursor-pointer flex items-center gap-1.5"
                title="Start Video Call"
              >
                <Video className="w-4 h-4" />
              </button>
              <div className="w-px h-4 bg-white/10" />
              <button
                onClick={() => setShowCallDropdown(!showCallDropdown)}
                className="px-1.5 py-1.5 hover:bg-white/[0.08] text-neutral-400 hover:text-white transition cursor-pointer"
                title="Call Options"
              >
                <ChevronDown className="w-3.5 h-3.5" />
              </button>

              {/* WhatsApp Calling Dropdown Menu */}
              {showCallDropdown && (
                <div className="absolute right-0 top-11 w-52 p-1.5 rounded-2xl bg-[#0e1017] border border-white/10 shadow-2xl z-50 space-y-1 text-xs font-sans">
                  <button
                    onClick={() => {
                      setShowCallDropdown(false);
                      startCall(activeConversationId || 'conv-zenvitra-hq', 'voice');
                    }}
                    className="w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-neutral-300 hover:text-white hover:bg-white/[0.06] transition text-left cursor-pointer"
                  >
                    <Phone className="w-4 h-4 text-emerald-400" />
                    <span>Voice call</span>
                  </button>

                  <button
                    onClick={() => {
                      setShowCallDropdown(false);
                      startCall(activeConversationId || 'conv-zenvitra-hq', 'video');
                    }}
                    className="w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-neutral-300 hover:text-white hover:bg-white/[0.06] transition text-left cursor-pointer"
                  >
                    <Video className="w-4 h-4 text-emerald-400" />
                    <span>Video call</span>
                  </button>

                  <button
                    onClick={() => {
                      setShowCallDropdown(false);
                      const code = `zen-${activeConversationId || 'ch-general'}`;
                      router.push(`/call/${code}?mode=CALL&mic=true&cam=true`);
                    }}
                    className="w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-cyan-300 hover:text-white bg-cyan-500/10 hover:bg-cyan-500/20 border border-cyan-500/30 transition text-left cursor-pointer"
                  >
                    <Radio className="w-4 h-4 text-cyan-400 animate-pulse" />
                    <span className="font-semibold">ZEN.CALL Studio (HD / Live)</span>
                  </button>

                  <button
                    onClick={() => {
                      setShowCallDropdown(false);
                      setShowMembersDrawer(true);
                    }}
                    className="w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-neutral-300 hover:text-white hover:bg-white/[0.06] transition text-left cursor-pointer"
                  >
                    <Users className="w-4 h-4 text-purple-400" />
                    <span>Select people</span>
                  </button>

                  <div className="h-px bg-white/[0.06] my-1" />

                  <button
                    onClick={() => {
                      setShowCallDropdown(false);
                      setShowNewCallLinkModal(true);
                    }}
                    className="w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-neutral-300 hover:text-white hover:bg-white/[0.06] transition text-left cursor-pointer"
                  >
                    <Link2 className="w-4 h-4 text-cyan-400" />
                    <span>Send call link</span>
                  </button>

                  <button
                    onClick={() => {
                      setShowCallDropdown(false);
                      setScheduleCallName(`${currentUserName}'s call`);
                      setShowScheduleCallModal(true);
                    }}
                    className="w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-neutral-300 hover:text-white hover:bg-white/[0.06] transition text-left cursor-pointer"
                  >
                    <Calendar className="w-4 h-4 text-amber-400" />
                    <span>Schedule call</span>
                  </button>
                </div>
              )}
            </div>
            <button
              onClick={() => setShowMembersDrawer(!showMembersDrawer)}
              className="p-2 rounded-xl bg-white/[0.03] hover:bg-white/[0.08] text-neutral-300 hover:text-white transition cursor-pointer"
              title="Inspect Caucus Delegates"
            >
              <Users className="w-4 h-4" />
            </button>

            {activeCommunityGroup && (
              <button
                onClick={() => setManagingSubgroup(activeCommunityGroup)}
                className="hidden sm:flex items-center gap-1.5 px-2.5 py-1.5 rounded-xl bg-purple-500/10 hover:bg-purple-500/20 border border-purple-500/20 text-purple-300 hover:text-white transition text-xs font-medium cursor-pointer"
                title="Configure Subgroup Details & Permissions"
              >
                <Settings className="w-3.5 h-3.5 text-purple-400" />
                <span>Subgroup Settings</span>
              </button>
            )}

            {/* 3-Dot Group / Channel Settings Menu */}
            <div className="relative">
              <button
                onClick={() => setShowGroupSettingsMenu(!showGroupSettingsMenu)}
                className="p-2 rounded-xl bg-white/[0.03] hover:bg-white/[0.08] text-neutral-300 hover:text-white transition cursor-pointer"
                title="Group & Channel Settings"
              >
                <MoreVertical className="w-4 h-4" />
              </button>

              {showGroupSettingsMenu && (
                <div className="absolute right-0 top-11 w-64 p-1.5 rounded-2xl bg-[#0e1017]/95 backdrop-blur-xl border border-white/10 shadow-2xl z-50 space-y-1 text-xs font-sans">
                  <div className="px-3 py-2 border-b border-white/[0.06]">
                    <p className="font-semibold text-white truncate">
                      {currentRoomInfo.title}
                    </p>
                    <p className="font-mono text-[9px] text-purple-400">
                      {currentRoomInfo.badge} &bull; Options
                    </p>
                  </div>

                  {/* 1. Group / Room Info */}
                  <button
                    onClick={() => {
                      setShowGroupSettingsMenu(false);
                      setShowRoomInfoModal(true);
                    }}
                    className="w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-neutral-300 hover:text-white hover:bg-white/[0.06] transition text-left cursor-pointer"
                  >
                    <Info className="w-4 h-4 text-cyan-400" />
                    <span>Group / Room Info</span>
                  </button>

                  {/* 1. Configure Subgroup (If inside community group) */}
                  {activeCommunityGroup && (
                    <button
                      onClick={() => {
                        setShowGroupSettingsMenu(false);
                        setManagingSubgroup(activeCommunityGroup);
                      }}
                      className="w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-purple-300 hover:text-white hover:bg-purple-600/20 transition text-left cursor-pointer"
                    >
                      <Settings className="w-4 h-4 text-purple-400" />
                      <span>Configure Subgroup Details</span>
                    </button>
                  )}

                  {/* 2. View Member Roster */}
                  <button
                    onClick={() => {
                      setShowGroupSettingsMenu(false);
                      setShowMembersDrawer(true);
                    }}
                    className="w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-neutral-300 hover:text-white hover:bg-white/[0.06] transition text-left cursor-pointer"
                  >
                    <Users className="w-4 h-4 text-purple-400" />
                    <span>View Participants ({currentRoomInfo.activeParticipantCount})</span>
                  </button>

                  {/* 3. Add / Invite Members */}
                  <button
                    onClick={() => {
                      setShowGroupSettingsMenu(false);
                      if (typeof navigator !== 'undefined' && navigator.clipboard) {
                        navigator.clipboard.writeText(currentRoomInfo.link);
                      }
                      setShowInviteLinkModal(true);
                    }}
                    className="w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-neutral-300 hover:text-white hover:bg-white/[0.06] transition text-left cursor-pointer"
                  >
                    <UserPlus className="w-4 h-4 text-emerald-400" />
                    <span>Invite / Add Members</span>
                  </button>

                  {/* 4. Copy Link */}
                  <button
                    onClick={() => {
                      setShowGroupSettingsMenu(false);
                      if (typeof navigator !== 'undefined' && navigator.clipboard) {
                        navigator.clipboard.writeText(currentRoomInfo.link);
                      }
                      showToast('📋 Room link copied to clipboard');
                    }}
                    className="w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-neutral-300 hover:text-white hover:bg-white/[0.06] transition text-left cursor-pointer"
                  >
                    <Copy className="w-4 h-4 text-blue-400" />
                    <span>Copy Room Link</span>
                  </button>

                  {/* 5. Server Roles (if in caucus) */}
                  {selectedCommunityId !== 'comm-direct' && canManageCurrentRoles && (
                    <button
                      onClick={() => {
                        setShowGroupSettingsMenu(false);
                        setShowRoleSettingsModal(true);
                      }}
                      className="w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-neutral-300 hover:text-white hover:bg-white/[0.06] transition text-left cursor-pointer"
                    >
                      <ShieldCheck className="w-4 h-4 text-amber-400" />
                      <span>Roles & Permissions</span>
                    </button>
                  )}

                  {/* 6. Mute Notifications */}
                  <button
                    onClick={() => {
                      setShowGroupSettingsMenu(false);
                      toggleMuteContext(currentChatContextId);
                    }}
                    className="w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-neutral-300 hover:text-white hover:bg-white/[0.06] transition text-left cursor-pointer"
                  >
                    {mutedContexts[currentChatContextId] ? (
                      <>
                        <Volume2 className="w-4 h-4 text-emerald-400" />
                        <span className="text-emerald-300">Unmute Notifications</span>
                      </>
                    ) : (
                      <>
                        <VolumeX className="w-4 h-4 text-neutral-400" />
                        <span>Mute Notifications</span>
                      </>
                    )}
                  </button>

                  <div className="h-px bg-white/[0.06] my-1" />

                  {/* 7. Clear Chat History */}
                  <button
                    onClick={() => {
                      setShowGroupSettingsMenu(false);
                      if (typeof window !== 'undefined' && window.confirm('Clear all messages in this room? This action cannot be undone.')) {
                        clearChatMessages(currentChatContextId);
                        showToast('🧹 Room message cache cleared');
                      }
                    }}
                    className="w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-amber-400 hover:bg-amber-500/10 transition text-left cursor-pointer"
                  >
                    <Trash2 className="w-4 h-4" />
                    <span>Clear Chat History</span>
                  </button>

                  {/* 8. Leave Group / Delete Conversation */}
                  {(activeCommunityGroup || activeConversation) && (
                    <button
                      onClick={() => {
                        setShowGroupSettingsMenu(false);
                        if (activeCommunityGroup) {
                          if (typeof window !== 'undefined' && window.confirm(`Are you sure you want to leave or delete "${activeCommunityGroup.name}"?`)) {
                            handleDeleteCommunityGroup(activeCommunityGroup.id);
                          }
                        } else if (activeConversation) {
                          if (typeof window !== 'undefined' && window.confirm(`Are you sure you want to leave or delete "${activeConversation.name}"?`)) {
                            deleteConversation(activeConversation.id);
                            showToast('🚪 Left conversation');
                          }
                        }
                      }}
                      className="w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-rose-400 hover:bg-rose-500/10 transition text-left cursor-pointer"
                    >
                      <LogOut className="w-4 h-4" />
                      <span>{activeCommunityGroup || activeConversation?.type === 'group' ? 'Leave Group' : 'Delete Chat'}</span>
                    </button>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>

        {/* ── Messages Feed ── */}
        <div className="flex-1 overflow-y-auto p-4 space-y-4">
          {displayedMessages.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full min-h-[300px] text-center p-6 space-y-3 select-none">
              <div className="w-14 h-14 rounded-3xl bg-white/[0.03] border border-white/10 flex items-center justify-center text-cyan-400/80 shadow-inner">
                {activeChannel ? (
                  <Hash className="w-7 h-7 text-cyan-400/70" />
                ) : activeCommunityGroup ? (
                  <Users className="w-7 h-7 text-purple-400/70" />
                ) : (
                  <MessageSquare className="w-7 h-7 text-cyan-400/70" />
                )}
              </div>
              <div className="max-w-xs space-y-1">
                <h4 className="font-display font-bold text-sm text-white">
                  {activeChannel
                    ? `Welcome to #${activeChannel.name}`
                    : activeCommunityGroup
                    ? `Welcome to ${activeCommunityGroup.name}`
                    : activeConversation
                    ? `Direct Channel with ${activeConversation.name}`
                    : 'Encrypted Sovereign Channel'}
                </h4>
                <p className="font-sans text-xs text-neutral-400 leading-relaxed">
                  {activeChannel?.description ||
                    'Zero telemetry. Send the first dispatch, proposal, or launch a poll with ⌘K.'}
                </p>
              </div>
            </div>
          ) : (
            displayedMessages.map((msg) => {
            const isSelf = msg.isSelf;
            const isSnap = Boolean(msg.snap);
            const isSticker = Boolean(msg.stickerUrl);

            // Determine role label and style
            const roleLabel = msg.senderRole || (
              msg.senderUsername === 'yuveer' || msg.senderName?.toLowerCase().includes('yuveer') 
                ? '👑 FOUNDER' 
                : msg.senderRole || null
            );
            const isUnread = !isSelf && msg.status !== 'read';

            return (
              <div
                key={msg.id}
                className={`flex gap-3 max-w-[85%] sm:max-w-[70%] ${
                  isSelf ? 'ml-auto flex-row-reverse' : 'mr-auto'
                }`}
              >
                {/* Avatar (Clickable to open ZENVITRA Identity Card) */}
                <button
                  type="button"
                  onClick={() => {
                    const matchedProfile = profiles.find(
                      (p) => p.username.toLowerCase() === msg.senderUsername.toLowerCase()
                    );
                    setIdentityCardUser({
                      id: msg.senderId,
                      name: msg.senderName,
                      username: msg.senderUsername,
                      avatar: msg.senderAvatar || matchedProfile?.avatar,
                      role: roleLabel || 'DELEGATE',
                      status: 'online',
                      bio: matchedProfile?.bio || 'Sovereign Diplomatic Delegate on ZENVITRA.',
                      isVerified: matchedProfile?.isVerified || isSelf,
                      stats: {
                        muns: 12,
                        articles: 8,
                        pulse: 143,
                        chambers: 5,
                        events: 9,
                      }
                    });
                  }}
                  className="w-8 h-8 rounded-full bg-neutral-800 text-neutral-300 flex items-center justify-center font-bold text-xs shrink-0 hover:ring-2 hover:ring-cyan-400 transition cursor-pointer"
                  title={`View ${msg.senderName}'s Diplomatic Identity`}
                >
                  {msg.senderName?.charAt(0) || 'D'}
                </button>

                <div className="space-y-1">
                  {/* Sender Name & Discord Role & Timestamp */}
                  <div className={`flex items-center gap-1.5 font-mono text-[10px] text-neutral-400 flex-wrap ${
                    isSelf ? 'justify-end' : 'justify-start'
                  }`}>
                    <span className="font-semibold text-neutral-200">{msg.senderName}</span>

                    {/* Discord-style Role Badge */}
                    {roleLabel && (
                      <span className={`px-1.5 py-0.2 rounded-md text-[9px] font-bold tracking-wider ${
                        roleLabel.includes('FOUNDER')
                          ? 'bg-amber-400/10 border border-amber-400/30 text-amber-300 shadow-[0_0_10px_rgba(251,191,36,0.15)]'
                          : roleLabel.includes('SECRETARIAT') || roleLabel.includes('GROUP') || roleLabel.includes('EB')
                          ? 'bg-purple-500/10 border border-purple-500/30 text-purple-300'
                          : roleLabel.includes('CHAIR')
                          ? 'bg-cyan-400/10 border border-cyan-400/30 text-cyan-300'
                          : 'bg-white/5 border border-white/10 text-neutral-400'
                      }`}>
                        {roleLabel}
                      </span>
                    )}

                    <span>•</span>
                    <span>{formatViewerTime(msg.createdAt || msg.timestamp)}</span>

                    {isUnread && (
                      <span className="inline-flex items-center gap-1 px-1.5 py-0.2 rounded-full bg-cyan-500/20 border border-cyan-500/40 text-cyan-300 text-[8px] font-mono font-bold uppercase tracking-wider">
                        <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 animate-pulse" />
                        Unread
                      </span>
                    )}
                  </div>

                  {/* Message Bubble */}
                  <div className={`p-3.5 rounded-3xl text-xs sm:text-sm font-sans space-y-2.5 transition-colors ${
                    isSelf 
                      ? 'bg-gradient-to-r from-purple-600 to-indigo-600 text-white shadow-md' 
                      : isUnread
                      ? 'bg-cyan-950/25 border border-cyan-500/30 text-neutral-100 shadow-[0_0_20px_rgba(6,182,212,0.08)] ring-1 ring-cyan-500/20'
                      : 'bg-[#0e0f14] border border-white/10 text-neutral-200'
                  }`}>
                    
                    {/* 0. Native ZENVITRA Message Object (Doc, MUN, Chamber, Pulse, Poll, Event) */}
                    {msg.nativeObject && (
                      <ZenNativeMessageCard
                        nativeObject={msg.nativeObject}
                        messageId={msg.id}
                        isSelf={isSelf}
                        currentUserId={currentUserUsername || 'you'}
                        onVotePoll={(mid, optId) => votePoll(mid, optId, currentChatContextId)}
                      />
                    )}

                    {/* 1. Glimpse Snap Card */}
                    {isSnap && msg.snap && (
                      <div className="space-y-2">
                        {msg.snap.isOneView && msg.snap.isOpened ? (
                          <div className="p-3 rounded-2xl bg-black/40 border border-white/10 flex items-center gap-2 text-neutral-500 font-mono text-xs">
                            <Eye className="w-4 h-4" />
                            <span>1-View Instant • Opened</span>
                          </div>
                        ) : (
                          <button
                            type="button"
                            onClick={() => {
                              setActiveViewingSnap({ snap: msg.snap!, messageId: msg.id });
                            }}
                            className="p-3.5 rounded-2xl bg-gradient-to-r from-purple-900/80 via-pink-900/80 to-amber-900/80 border border-purple-400/50 hover:scale-105 active:scale-95 text-white flex items-center gap-3 transition shadow-lg cursor-pointer"
                          >
                            <div className="w-8 h-8 rounded-xl bg-white/20 flex items-center justify-center text-lg">
                              {msg.snap.isOneView ? '⏱️' : '🔥'}
                            </div>
                            <div className="text-left">
                              <span className="font-display font-medium text-xs block">
                                {msg.snap.isOneView ? '1-View Instant' : 'Glimpse Snap'}
                              </span>
                              <span className="font-mono text-[9px] text-neutral-300">
                                Tap to reveal in full-screen
                              </span>
                            </div>
                          </button>
                        )}
                      </div>
                    )}

                    {/* 2. Custom Sticker Card */}
                    {isSticker && (
                      <div className="p-2 text-center">
                        <span className="text-5xl filter drop-shadow-lg inline-block hover:scale-125 transition-transform">
                          {msg.stickerUrl}
                        </span>
                      </div>
                    )}

                    {/* 3. Text Message Content */}
                    {!isSnap && !isSticker && msg.content && (
                      <p className="leading-relaxed whitespace-pre-wrap font-sans">
                        {msg.content}
                      </p>
                    )}

                    {/* Voice Note Pill */}
                    {msg.voiceNoteUrl && (
                      <div className="flex items-center gap-2 pt-1 font-mono text-xs text-neutral-300">
                        <Play className="w-3.5 h-3.5 fill-current" />
                        <span>Voice Dispatch ({msg.voiceDurationSeconds}s)</span>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            );
          })
          )}
          <div ref={messagesEndRef} />
        </div>

        {/* Sleek Modern Input Bar */}
        <div className="p-3 sm:p-4 bg-[#08090d]/95 backdrop-blur-xl border-t border-white/[0.08] z-10 relative">
          {/* Stickers Drawer */}
          <StickersDrawer
            isOpen={showStickerDrawer}
            onClose={() => setShowStickerDrawer(false)}
            onSelectSticker={(url, name) => sendSticker(url, name)}
          />

          {isSubgroupRestricted ? (
            <div className="max-w-5xl mx-auto p-3.5 bg-amber-500/10 border border-amber-500/20 rounded-2xl flex items-center justify-between text-xs text-amber-300 shadow-lg">
              <div className="flex items-center gap-2.5">
                <Lock className="w-4 h-4 text-amber-400 shrink-0" />
                <span>
                  {activeCommunityGroup?.isLocked
                    ? `🔒 #${activeCommunityGroup.name} discussions are currently frozen by administration.`
                    : activeCommunityGroup?.onlyAdminsCanPost
                    ? `🔒 Only administrators and committee chairs can send messages in this subgroup. You have read-only access.`
                    : `🔒 Message sending in #${activeCommunityGroup?.name} is restricted to authorized parliamentary roles.`}
                </span>
              </div>
              {canManageCurrentRoles && (
                <button
                  type="button"
                  onClick={() => setManagingSubgroup(activeCommunityGroup)}
                  className="px-2.5 py-1 rounded-lg bg-amber-500/20 hover:bg-amber-500/30 text-amber-200 font-medium text-[11px] transition cursor-pointer shrink-0 ml-2"
                >
                  Subgroup Settings
                </button>
              )}
            </div>
          ) : (
            <form onSubmit={handleSendMessage} className="max-w-5xl mx-auto flex items-center gap-2">
              {/* Action Group: ⌘K Command Bar + Snap + Sticker */}
              <div className="flex items-center gap-1.5 shrink-0">
                <button
                  type="button"
                  onClick={() => setShowCommandBar(true)}
                  className="p-2.5 rounded-xl bg-gradient-to-tr from-cyan-500/20 to-purple-500/20 hover:from-cyan-500/30 hover:to-purple-500/30 border border-cyan-500/40 text-cyan-300 font-mono text-xs flex items-center gap-1.5 transition-all duration-150 cursor-pointer shadow-sm"
                  title="Universal Command Palette (⌘K)"
                >
                  <Zap className="w-4 h-4 text-cyan-400" />
                  <span className="hidden md:inline font-bold">⌘K</span>
                </button>

                <button
                  type="button"
                  onClick={() => setShowGlimpseSnapModal(true)}
                  className="p-2.5 rounded-xl bg-white/[0.04] hover:bg-cyan-500/15 border border-white/10 hover:border-cyan-500/40 text-neutral-400 hover:text-cyan-300 transition-all duration-150 cursor-pointer shadow-sm"
                  title="Send Glimpse Snap"
                >
                  <Camera className="w-4 h-4" />
                </button>

                <button
                  type="button"
                  onClick={() => setShowStickerDrawer(!showStickerDrawer)}
                  className="p-2.5 rounded-xl bg-white/[0.04] hover:bg-cyan-500/15 border border-white/10 hover:border-cyan-500/40 text-neutral-400 hover:text-cyan-300 transition-all duration-150 cursor-pointer shadow-sm"
                  title="Stickers Library"
                >
                  <Sparkles className="w-4 h-4" />
                </button>
              </div>

              {/* Main Text Input Field */}
              <div className="flex-1 relative flex items-center rounded-2xl bg-white/[0.04] border border-white/10 hover:border-white/20 focus-within:border-cyan-500/60 focus-within:bg-white/[0.06] transition-all duration-200">
                <input
                  type="text"
                  value={messageText}
                  onChange={(e) => setMessageText(e.target.value)}
                  placeholder="Dispatch a message, treaty amendment, or note..."
                  className="w-full pl-4 pr-10 py-2.5 sm:py-3 bg-transparent text-xs sm:text-sm text-white placeholder-neutral-500 focus:outline-none font-sans"
                />

                <button
                  type="button"
                  onClick={() => setShowEmojiPicker(!showEmojiPicker)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 p-1 text-neutral-400 hover:text-white hover:scale-110 transition cursor-pointer"
                  title="Universal Emojis & GIPHY"
                >
                  <Smile className="w-4 h-4 text-cyan-400" />
                </button>

                {showEmojiPicker && (
                  <div className="absolute bottom-14 right-0 z-50">
                    <UniversalEmojiGifPicker
                      isOpen={showEmojiPicker}
                      onClose={() => setShowEmojiPicker(false)}
                      position="dropdown"
                      onSelectEmoji={(emoji) => {
                        setMessageText((prev) => prev + emoji);
                      }}
                      onSelectGif={(gifUrl) => {
                        const myRole = currentUserUsername === 'yuveer' ? '👑 FOUNDER' : 'DELEGATE';
                        sendMessage(
                          gifUrl,
                          [{ type: 'image', url: gifUrl, name: 'Giphy GIF' }],
                          replyingTo ? {
                            id: replyingTo.id,
                            senderName: replyingTo.senderName,
                            snippet: replyingTo.content.slice(0, 80),
                          } : undefined,
                          currentChatContextId,
                          myRole
                        );
                        setShowEmojiPicker(false);
                      }}
                    />
                  </div>
                )}
              </div>

              {/* Voice Recorder Button */}
              {isRecordingVoice ? (
                <button
                  type="button"
                  onClick={stopRecordingAudio}
                  className="px-3 py-2.5 rounded-xl bg-red-600 hover:bg-red-700 text-white font-mono text-xs transition shadow-md flex items-center gap-1.5 shrink-0 animate-pulse cursor-pointer"
                >
                  <span className="w-2 h-2 rounded-full bg-white animate-ping" />
                  <span>{recordingSeconds}s • SEND</span>
                </button>
              ) : (
                <button
                  type="button"
                  onClick={startRecordingAudio}
                  className="p-2.5 rounded-xl bg-white/[0.04] hover:bg-white/10 border border-white/10 text-neutral-400 hover:text-white transition-all duration-150 shrink-0 cursor-pointer"
                  title="Record Voice Dispatch"
                >
                  <Mic className="w-4 h-4" />
                </button>
              )}

              {/* Send Button */}
              <button
                type="submit"
                disabled={!messageText.trim()}
                className="p-2.5 sm:px-4 sm:py-2.5 rounded-xl bg-cyan-400 hover:bg-cyan-300 disabled:opacity-25 text-black font-bold font-sans text-xs uppercase tracking-wider transition-all shadow-[0_0_15px_rgba(6,182,212,0.3)] flex items-center gap-1.5 shrink-0 cursor-pointer"
              >
                <Send className="w-4 h-4" />
                <span className="hidden sm:inline">Send</span>
              </button>
            </form>
          )}
        </div>
      </div>

      {/* ── Discord-Style Members & Roles Drawer ── */}
      <AnimatePresence>
        {showMembersDrawer && (
          <>
            {/* Mobile Backdrop */}
            <div 
              onClick={() => setShowMembersDrawer(false)}
              className="fixed inset-0 bg-black/60 backdrop-blur-xs z-40 md:hidden"
            />
            <motion.div
              initial={{ width: 0, opacity: 0 }}
              animate={{ width: 260, opacity: 1 }}
              exit={{ width: 0, opacity: 0 }}
              className="fixed right-0 top-0 bottom-0 md:relative h-full bg-[#08090d] border-l border-white/[0.06] flex flex-col z-50 md:z-20 overflow-hidden flex-shrink-0 shadow-2xl md:shadow-none"
            >
            <div className="p-3.5 border-b border-white/[0.06] flex items-center justify-between bg-[#0a0b10]">
              <div className="flex items-center gap-2 min-w-0">
                <Users className="w-4 h-4 text-purple-400 shrink-0" />
                <div className="min-w-0">
                  <h4 className="font-display font-medium text-xs text-white truncate">
                    {drawerRoster.title}
                  </h4>
                  <p className="font-mono text-[9px] text-purple-400 truncate">
                    {drawerRoster.subtitle}
                  </p>
                </div>
              </div>
              <button
                onClick={() => setShowMembersDrawer(false)}
                className="p-1 rounded-lg text-neutral-400 hover:text-white transition cursor-pointer"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto p-3 space-y-4">
              {drawerRoster.sections.map((section, sIdx) => {
                if (!section.members || section.members.length === 0) return null;
                return (
                  <div key={sIdx} className="space-y-1.5">
                    <span className="font-mono text-[9px] uppercase tracking-wider text-purple-400/80 font-bold px-1 block">
                      {section.name}
                    </span>
                    <div className="space-y-1">
                      {section.members.map((member: any) => {
                        const isSpeaking = !!member.isSpeaking;
                        const isMuted = !!member.isMuted;
                        const isOnline = member.status === 'online' || member.status === 'idle' || isSpeaking;
                        return (
                          <div
                            key={member.id || member.username}
                            onClick={() => {
                              setShowMembersDrawer(false);
                              showToast(`Participant @${member.username}`);
                            }}
                            className={`flex items-center justify-between p-2 rounded-xl transition cursor-pointer ${
                              isSpeaking
                                ? 'bg-emerald-500/10 border border-emerald-500/30 text-white'
                                : 'hover:bg-white/[0.04] text-neutral-300'
                            }`}
                          >
                            <div className="flex items-center gap-2.5 min-w-0">
                              <div className="relative shrink-0">
                                <div
                                  className={`w-7 h-7 rounded-full flex items-center justify-center font-bold text-xs transition-all ${
                                    isSpeaking
                                      ? 'bg-emerald-500/30 border-2 border-emerald-400 ring-2 ring-emerald-400/80 shadow-[0_0_10px_rgba(52,211,153,0.8)] text-emerald-200'
                                      : 'bg-purple-600/20 border border-purple-500/30 text-purple-300'
                                  }`}
                                >
                                  {member.name ? member.name.charAt(0) : '?'}
                                </div>
                                <span
                                  className={`absolute bottom-0 right-0 w-2 h-2 rounded-full ring-2 ring-[#08090d] ${
                                    isSpeaking
                                      ? 'bg-emerald-400 animate-ping'
                                      : isOnline
                                      ? 'bg-emerald-400'
                                      : 'bg-neutral-500'
                                  }`}
                                />
                              </div>
                              <div className="min-w-0">
                                <div className="flex items-center gap-1.5">
                                  <span className={`font-sans font-medium text-xs truncate ${isSpeaking ? 'text-emerald-300 font-semibold' : 'text-white'}`}>
                                    {member.name}
                                  </span>
                                  {member.customStatus && (
                                    <span className="font-mono text-[8px] px-1 py-0.2 rounded bg-white/5 border border-white/10 text-neutral-400 truncate max-w-[80px]">
                                      {member.customStatus}
                                    </span>
                                  )}
                                </div>
                                <span className="font-mono text-[9px] text-neutral-500 truncate block">
                                  @{member.username}
                                </span>
                              </div>
                            </div>

                            <div className="flex items-center gap-1 text-[10px] shrink-0">
                              {isMuted && <MicOff className="w-3 h-3 text-red-400" />}
                              {isSpeaking && <Volume2 className="w-3.5 h-3.5 text-emerald-400 animate-bounce" />}
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                );
              })}
            </div>
          </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* ── Glimpse Snap Modal ── */}
      <GlimpseSnapModal
        isOpen={showGlimpseSnapModal}
        onClose={() => setShowGlimpseSnapModal(false)}
        targetConversationId={activeConversationId || undefined}
      />

      {/* ── Glimpse Fullscreen Viewer Modal ── */}
      <GlimpseViewerModal
        isOpen={Boolean(activeViewingSnap)}
        snap={activeViewingSnap?.snap || null}
        messageId={activeViewingSnap?.messageId}
        onClose={() => setActiveViewingSnap(null)}
        onSelfDestruct={(msgId) => openSnap(msgId)}
      />

      {/* ── New Chat Action Sheet Modal (FAB) ── */}
      <NewChatActionModal
        isOpen={showNewChatActionModal}
        onClose={() => setShowNewChatActionModal(false)}
        onOpenGlimpseCamera={() => setShowGlimpseSnapModal(true)}
        onOpenCreateCaucus={() => setShowCreateCaucusModal(true)}
      />

      {/* ── Direct Call Modal ── */}
      <AnimatePresence>
        {showDirectCallModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/80 backdrop-blur-md z-50 flex items-center justify-center p-4"
          >
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="w-full max-w-md rounded-[2.5rem] bg-[#090a0f] border border-white/10 p-6 sm:p-8 shadow-2xl space-y-6"
            >
              <div className="flex items-center justify-between border-b border-white/[0.06] pb-4">
                <div className="flex items-center gap-2.5">
                  <div className="w-8 h-8 rounded-xl bg-purple-500/20 border border-purple-500/30 flex items-center justify-center text-purple-300">
                    <Phone className="w-4 h-4" />
                  </div>
                  <div>
                    <h3 className="font-display font-medium text-base text-white">
                      Direct Sovereign Call
                    </h3>
                    <p className="font-mono text-[10px] text-neutral-400">
                      Connect via Handle (@username) or Sovereign ID
                    </p>
                  </div>
                </div>
                <button
                  onClick={() => setShowDirectCallModal(false)}
                  className="p-2 rounded-xl bg-white/[0.04] text-neutral-400 hover:text-white"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              <div className="space-y-3">
                <input
                  type="text"
                  value={directDialInput}
                  onChange={(e) => setDirectDialInput(e.target.value)}
                  placeholder="e.g. @delegate or 9876543210"
                  className="w-full px-4 py-3 rounded-2xl bg-white/[0.04] border border-white/10 text-xs text-white placeholder-neutral-500 focus:outline-none focus:border-purple-500/50"
                  autoFocus
                />
                {isOnlineCallingError && (
                  <p className="text-xs text-rose-400 font-mono">{isOnlineCallingError}</p>
                )}
              </div>

              <div className="grid grid-cols-2 gap-3">
                <button
                  onClick={() => handleInitiateDirectCall(directDialInput, 'voice')}
                  className="py-3 rounded-2xl bg-purple-600 hover:bg-purple-700 text-white font-mono text-xs font-bold flex items-center justify-center gap-2 transition"
                >
                  <Phone className="w-4 h-4" />
                  <span>Voice Call</span>
                </button>
                <button
                  onClick={() => handleInitiateDirectCall(directDialInput, 'video')}
                  className="py-3 rounded-2xl bg-gradient-to-r from-purple-500 to-indigo-600 hover:opacity-90 text-white font-mono text-xs font-bold flex items-center justify-center gap-2 transition"
                >
                  <Video className="w-4 h-4" />
                  <span>Video Call</span>
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ── Create Caucus Modal ── */}
      <AnimatePresence>
        {showCreateCaucusModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/80 backdrop-blur-md z-50 flex items-center justify-center p-4"
          >
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="w-full max-w-lg rounded-3xl bg-[#090a0f] border border-white/10 p-6 shadow-2xl space-y-5 text-left max-h-[90vh] overflow-y-auto"
            >
              <div className="flex items-center justify-between border-b border-white/[0.06] pb-3">
                <div>
                  <h3 className="font-display font-semibold text-base text-white">
                    Establish Sovereign Server
                  </h3>
                  <p className="font-sans text-xs text-neutral-400 mt-0.5">
                    Select an architecture template or build your own caucus
                  </p>
                </div>
                <button
                  onClick={() => setShowCreateCaucusModal(false)}
                  className="p-1.5 rounded-xl text-neutral-400 hover:text-white hover:bg-white/10 transition cursor-pointer"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              {/* Template Chooser Grid */}
              <div className="space-y-2">
                <label className="font-mono text-[10px] text-neutral-400 uppercase tracking-wider block">
                  Select Server Template
                </label>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                  {COMMUNITY_TEMPLATES.map((tmpl) => {
                    const isChosen = selectedTemplateId === tmpl.id;
                    return (
                      <button
                        key={tmpl.id}
                        type="button"
                        onClick={() => {
                          setSelectedTemplateId(tmpl.id);
                          setNewCaucusIcon(tmpl.icon);
                          const prefix = currentUserName && currentUserName !== 'You' ? `${currentUserName}'s` : 'My';
                          setNewCaucusName(tmpl.id === 'template-blank' ? `${prefix} Server` : `${prefix} ${tmpl.name}`);
                          setNewCaucusDescription(tmpl.description);
                        }}
                        className={`p-3 rounded-2xl border text-left transition cursor-pointer relative group flex flex-col justify-between ${
                          isChosen
                            ? 'bg-purple-500/15 border-purple-500/60 shadow-[0_0_15px_rgba(168,85,247,0.2)]'
                            : 'bg-white/[0.02] border-white/10 hover:border-white/20 hover:bg-white/[0.05]'
                        }`}
                      >
                        <div className="flex items-start justify-between gap-2">
                          <div className="flex items-center gap-2">
                            <span className="text-xl">{tmpl.icon}</span>
                            <div>
                              <h4 className="font-display font-bold text-xs text-white group-hover:text-purple-300 transition">
                                {tmpl.name}
                              </h4>
                              <span className="font-mono text-[9px] text-purple-400 font-semibold uppercase">
                                {tmpl.badge}
                              </span>
                            </div>
                          </div>
                          {isChosen && (
                            <div className="w-4 h-4 rounded-full bg-purple-500 text-white flex items-center justify-center shrink-0">
                              <Check className="w-2.5 h-2.5" />
                            </div>
                          )}
                        </div>
                        <p className="font-sans text-[11px] text-neutral-400 mt-2 line-clamp-2">
                          {tmpl.description}
                        </p>
                        <div className="mt-2.5 pt-2 border-t border-white/[0.04] flex items-center gap-1.5 flex-wrap">
                          {tmpl.channels.slice(0, 3).map((ch) => (
                            <span key={ch.id} className="font-mono text-[9px] px-1.5 py-0.5 rounded bg-white/[0.04] text-neutral-400">
                              {ch.type === 'voice' ? '🔊' : '#'}{ch.name}
                            </span>
                          ))}
                          {tmpl.channels.length > 3 && (
                            <span className="font-mono text-[9px] text-neutral-500">
                              +{tmpl.channels.length - 3} more
                            </span>
                          )}
                        </div>
                      </button>
                    );
                  })}
                </div>
              </div>

              <form onSubmit={handleCreateCaucus} className="space-y-4 pt-1 border-t border-white/[0.06]">
                {/* Server Name & Icon */}
                <div className="space-y-1.5">
                  <label className="font-mono text-[10px] text-neutral-400 uppercase tracking-wider block">
                    Server Name & Icon
                  </label>
                  <div className="flex items-center gap-2">
                    <div className="relative">
                      <input
                        type="text"
                        value={newCaucusIcon}
                        onChange={(e) => setNewCaucusIcon(e.target.value)}
                        maxLength={2}
                        className="w-11 h-10 rounded-2xl bg-white/[0.04] border border-white/10 text-center text-lg text-white focus:outline-none focus:border-purple-500/50"
                        title="Server Icon (Emoji)"
                      />
                    </div>
                    <input
                      type="text"
                      value={newCaucusName}
                      onChange={(e) => setNewCaucusName(e.target.value)}
                      placeholder={currentUserName && currentUserName !== 'You' ? `${currentUserName}'s Server` : "Your Server Name"}
                      className="flex-1 px-4 py-2.5 rounded-2xl bg-white/[0.04] border border-white/10 text-xs text-white focus:outline-none focus:border-purple-500/50"
                      autoFocus
                    />
                  </div>
                  {/* Emoji Quick Select */}
                  <div className="flex items-center gap-1.5 pt-1">
                    {['🏛️', '🌐', '⚡', '💬', '👑', '🛡️', '⚖️', '🚀', '💎'].map((em) => (
                      <button
                        key={em}
                        type="button"
                        onClick={() => setNewCaucusIcon(em)}
                        className={`w-7 h-7 rounded-lg text-xs flex items-center justify-center transition cursor-pointer ${
                          newCaucusIcon === em ? 'bg-purple-500/30 border border-purple-500/50' : 'bg-white/[0.02] hover:bg-white/[0.08]'
                        }`}
                      >
                        {em}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Server Description */}
                <div className="space-y-1.5">
                  <label className="font-mono text-[10px] text-neutral-400 uppercase tracking-wider block">
                    Caucus Mission / Description (Optional)
                  </label>
                  <input
                    type="text"
                    value={newCaucusDescription}
                    onChange={(e) => setNewCaucusDescription(e.target.value)}
                    placeholder="e.g. Official diplomatic deliberations and multilateral caucusing"
                    className="w-full px-4 py-2.5 rounded-2xl bg-white/[0.04] border border-white/10 text-xs text-white focus:outline-none focus:border-purple-500/50"
                  />
                </div>

                <div className="flex items-center justify-end gap-2 pt-2">
                  <button
                    type="button"
                    onClick={() => setShowCreateCaucusModal(false)}
                    className="px-4 py-2.5 rounded-2xl bg-white/[0.04] hover:bg-white/[0.08] text-neutral-300 font-semibold text-xs transition cursor-pointer"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={!newCaucusName.trim()}
                    className="px-6 py-2.5 rounded-2xl bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white font-bold text-xs shadow-lg shadow-purple-600/25 transition cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    Establish Server
                  </button>
                </div>
              </form>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ── WhatsApp "New Call Link" Modal (media_1788634705134.png) ── */}
      <AnimatePresence>
        {showNewCallLinkModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/80 backdrop-blur-md z-50 flex items-center justify-center p-4"
          >
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="w-full max-w-md rounded-3xl bg-[#0e1017] border border-white/10 p-6 shadow-2xl space-y-5"
            >
              <div className="flex items-center justify-between border-b border-white/[0.06] pb-3">
                <h3 className="font-display font-semibold text-sm sm:text-base text-white">
                  New call link
                </h3>
                <button
                  onClick={() => setShowNewCallLinkModal(false)}
                  className="p-1 rounded-lg text-neutral-400 hover:text-white transition cursor-pointer"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              {/* Call Type Selector */}
              <div className="space-y-1.5">
                <label className="font-mono text-[10px] text-neutral-400 uppercase tracking-wider block">
                  Call type
                </label>
                <div className="grid grid-cols-2 gap-2">
                  <button
                    type="button"
                    onClick={() => setCallLinkType('video')}
                    className={`py-2 px-3 rounded-xl border text-xs font-semibold flex items-center justify-center gap-2 transition cursor-pointer ${
                      callLinkType === 'video'
                        ? 'bg-emerald-500/15 border-emerald-500/40 text-emerald-300'
                        : 'bg-white/[0.03] border-white/10 text-neutral-400 hover:text-white'
                    }`}
                  >
                    <Video className="w-4 h-4" />
                    <span>Video</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => setCallLinkType('voice')}
                    className={`py-2 px-3 rounded-xl border text-xs font-semibold flex items-center justify-center gap-2 transition cursor-pointer ${
                      callLinkType === 'voice'
                        ? 'bg-emerald-500/15 border-emerald-500/40 text-emerald-300'
                        : 'bg-white/[0.03] border-white/10 text-neutral-400 hover:text-white'
                    }`}
                  >
                    <Phone className="w-4 h-4" />
                    <span>Voice</span>
                  </button>
                </div>
              </div>

              {/* Generated Call Link with Copy */}
              <div className="space-y-1.5">
                <label className="font-mono text-[10px] text-neutral-400 uppercase tracking-wider block">
                  Link
                </label>
                <div className="flex items-center gap-2 p-2.5 rounded-2xl bg-white/[0.04] border border-white/10">
                  <Link2 className="w-4 h-4 text-emerald-400 shrink-0" />
                  <span className="font-mono text-xs text-white truncate flex-1 select-all">
                    {`https://zenvitra.gov/call/${callLinkType}/sec-${Date.now().toString().slice(-6)}`}
                  </span>
                  <button
                    type="button"
                    onClick={() => {
                      navigator.clipboard?.writeText(`https://zenvitra.gov/call/${callLinkType}/sec-${Date.now().toString().slice(-6)}`);
                      showToast('Call link copied to clipboard');
                    }}
                    className="p-1.5 rounded-lg bg-white/[0.06] hover:bg-white/[0.12] text-neutral-300 hover:text-white transition cursor-pointer shrink-0"
                    title="Copy Link"
                  >
                    <Copy className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>

              {/* Disclaimer Note (WhatsApp style) */}
              <p className="font-sans text-xs text-neutral-400 leading-relaxed">
                Anyone with Zenvitra can use this link to join this call. Only share it with delegates you trust.
              </p>

              {/* Toggle: Require approval to join */}
              <div className="flex items-center justify-between p-3 rounded-2xl bg-white/[0.02] border border-white/[0.06]">
                <div className="min-w-0 pr-2">
                  <span className="font-display font-medium text-xs text-white block">
                    Require approval to join
                  </span>
                  <span className="font-mono text-[10px] text-neutral-500 block truncate">
                    Moderator must approve new delegates
                  </span>
                </div>
                <button
                  type="button"
                  onClick={() => setRequireApproval(!requireApproval)}
                  className={`w-11 h-6 rounded-full transition-colors relative cursor-pointer ${
                    requireApproval ? 'bg-emerald-500' : 'bg-neutral-700'
                  }`}
                >
                  <span
                    className={`block w-4 h-4 rounded-full bg-white transition-transform ${
                      requireApproval ? 'translate-x-6' : 'translate-x-1'
                    }`}
                  />
                </button>
              </div>

              {/* Action Buttons */}
              <div className="flex items-center gap-2 pt-2 border-t border-white/[0.06]">
                <button
                  type="button"
                  onClick={() => {
                    const generatedLink = `https://zenvitra.gov/call/${callLinkType}/sec-${Date.now().toString().slice(-6)}`;
                    sendMessage(`📞 Join our diplomatic ${callLinkType} call: ${generatedLink}`);
                    setShowNewCallLinkModal(false);
                    showToast('Call link posted into conversation wire');
                  }}
                  className="flex-1 py-2.5 rounded-2xl bg-white/[0.06] hover:bg-white/[0.12] text-white font-medium text-xs transition cursor-pointer text-center"
                >
                  Send link via ZEN.CHAT
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setShowNewCallLinkModal(false);
                    startCall(activeConversationId || 'conv-zenvitra-hq', callLinkType);
                  }}
                  className="flex-1 py-2.5 rounded-2xl bg-emerald-500 hover:bg-emerald-600 text-black font-bold text-xs transition cursor-pointer text-center shadow-[0_0_15px_rgba(16,185,129,0.3)]"
                >
                  Join call
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ── WhatsApp "Schedule Call" Modal (media_1788634705144.png) ── */}
      <AnimatePresence>
        {showScheduleCallModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/80 backdrop-blur-md z-50 flex items-center justify-center p-4"
          >
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="w-full max-w-lg rounded-3xl bg-[#0e1017] border border-white/10 p-6 shadow-2xl space-y-4"
            >
              <div className="flex items-center justify-between border-b border-white/[0.06] pb-3">
                <h3 className="font-display font-semibold text-sm sm:text-base text-white flex items-center gap-2">
                  <Calendar className="w-4 h-4 text-emerald-400" />
                  <span>Schedule call</span>
                </h3>
                <button
                  onClick={() => setShowScheduleCallModal(false)}
                  className="p-1 rounded-lg text-neutral-400 hover:text-white transition cursor-pointer"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              {/* Call Name */}
              <div className="space-y-1">
                <label className="font-mono text-[10px] text-neutral-400 uppercase tracking-wider block">
                  Call name
                </label>
                <div className="relative">
                  <input
                    type="text"
                    value={scheduleCallName}
                    onChange={(e) => setScheduleCallName(e.target.value)}
                    placeholder="e.g. Diplomatic Caucus Call"
                    className="w-full px-3.5 py-2.5 rounded-2xl bg-white/[0.04] border border-white/10 text-xs text-white focus:outline-none focus:border-emerald-500/40"
                  />
                  <button
                    type="button"
                    onClick={() => setScheduleCallName((prev) => prev + ' 📜')}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-neutral-400 hover:text-white transition text-xs cursor-pointer"
                  >
                    <Smile className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>

              {/* Description */}
              <div className="space-y-1">
                <label className="font-mono text-[10px] text-neutral-400 uppercase tracking-wider block">
                  Description (optional)
                </label>
                <textarea
                  rows={2}
                  value={scheduleCallDesc}
                  onChange={(e) => setScheduleCallDesc(e.target.value)}
                  placeholder="Agenda notes, draft references, or caucus instructions..."
                  className="w-full px-3.5 py-2 rounded-2xl bg-white/[0.04] border border-white/10 text-xs text-white focus:outline-none focus:border-emerald-500/40 resize-none"
                />
              </div>

              {/* Date & Time Grid */}
              <div className="grid grid-cols-2 gap-3">
                {/* Start Date & Time */}
                <div className="space-y-1">
                  <label className="font-mono text-[10px] text-neutral-400 uppercase tracking-wider block">
                    Start date and time
                  </label>
                  <div className="space-y-1.5">
                    <input
                      type="date"
                      value={scheduleStartDate || '2026-09-06'}
                      onChange={(e) => setScheduleStartDate(e.target.value)}
                      className="w-full px-3 py-2 rounded-xl bg-white/[0.04] border border-white/10 text-xs text-white focus:outline-none"
                    />
                    <input
                      type="time"
                      value={scheduleStartTime}
                      onChange={(e) => setScheduleStartTime(e.target.value)}
                      className="w-full px-3 py-2 rounded-xl bg-white/[0.04] border border-white/10 text-xs text-white focus:outline-none"
                    />
                  </div>
                </div>

                {/* End Date & Time */}
                <div className="space-y-1">
                  <div className="flex items-center justify-between">
                    <label className="font-mono text-[10px] text-neutral-400 uppercase tracking-wider block">
                      End date and time
                    </label>
                    <button
                      type="button"
                      onClick={() => setHasEndTime(!hasEndTime)}
                      className="font-mono text-[9px] text-emerald-400 hover:underline cursor-pointer"
                    >
                      {hasEndTime ? 'Remove end time' : 'Add end time'}
                    </button>
                  </div>
                  {hasEndTime ? (
                    <div className="space-y-1.5">
                      <input
                        type="date"
                        value={scheduleEndDate || scheduleStartDate || '2026-09-06'}
                        onChange={(e) => setScheduleEndDate(e.target.value)}
                        className="w-full px-3 py-2 rounded-xl bg-white/[0.04] border border-white/10 text-xs text-white focus:outline-none"
                      />
                      <input
                        type="time"
                        value={scheduleEndTime}
                        onChange={(e) => setScheduleEndTime(e.target.value)}
                        className="w-full px-3 py-2 rounded-xl bg-white/[0.04] border border-white/10 text-xs text-white focus:outline-none"
                      />
                    </div>
                  ) : (
                    <div className="h-16 rounded-xl bg-white/[0.02] border border-dashed border-white/10 flex items-center justify-center text-[10px] text-neutral-500 font-mono">
                      No end time specified
                    </div>
                  )}
                </div>
              </div>

              <p className="font-mono text-[10px] text-neutral-500">
                Events with call links can't be more than one year in the future.
              </p>

              {/* Call Type Dropdown */}
              <div className="flex items-center justify-between p-3 rounded-2xl bg-white/[0.02] border border-white/[0.06]">
                <div>
                  <span className="font-display font-medium text-xs text-white block">Call type</span>
                  <span className="font-mono text-[10px] text-neutral-400">Specify audio or video caucus</span>
                </div>
                <select
                  value={scheduleCallType}
                  onChange={(e) => setScheduleCallType(e.target.value as any)}
                  className="px-3 py-1.5 rounded-xl bg-[#090a0f] border border-white/15 text-xs text-white focus:outline-none cursor-pointer font-sans"
                >
                  <option value="video">Video</option>
                  <option value="voice">Voice</option>
                </select>
              </div>

              {/* Require approval toggle */}
              <div className="flex items-center justify-between p-3 rounded-2xl bg-white/[0.02] border border-white/[0.06]">
                <div>
                  <span className="font-display font-medium text-xs text-white block">Require approval to join</span>
                  <span className="font-mono text-[10px] text-neutral-500 block">Host verifies joining delegates</span>
                </div>
                <button
                  type="button"
                  onClick={() => setRequireApproval(!requireApproval)}
                  className={`w-11 h-6 rounded-full transition-colors relative cursor-pointer ${
                    requireApproval ? 'bg-emerald-500' : 'bg-neutral-700'
                  }`}
                >
                  <span
                    className={`block w-4 h-4 rounded-full bg-white transition-transform ${
                      requireApproval ? 'translate-x-6' : 'translate-x-1'
                    }`}
                  />
                </button>
              </div>

              {/* Bottom Schedule Dispatch (WhatsApp Style Green FAB Button) */}
              <div className="flex items-center justify-end pt-2 border-t border-white/[0.06]">
                <button
                  type="button"
                  onClick={() => {
                    const newSched: ScheduledCall = {
                      id: 'sched_' + Date.now(),
                      title: scheduleCallName.trim() || `${currentUserName}'s call`,
                      description: scheduleCallDesc.trim() || undefined,
                      startDate: scheduleStartDate || '2026-09-06',
                      startTime: scheduleStartTime,
                      endDate: hasEndTime ? (scheduleEndDate || scheduleStartDate || '2026-09-06') : undefined,
                      endTime: hasEndTime ? scheduleEndTime : undefined,
                      callType: scheduleCallType,
                      requireApproval: requireApproval,
                      link: `https://zenvitra.gov/call/${scheduleCallType}/sec-${Date.now().toString().slice(-6)}`,
                      creatorName: currentUserName,
                      creatorHandle: currentUserUsername,
                      createdAt: new Date().toISOString().split('T')[0]
                    };

                    setScheduledCalls((prev) => [newSched, ...prev]);
                    setShowScheduleCallModal(false);
                    
                    // Post calendar event card into conversation
                    sendMessage(
                      `📅 SCHEDULED CALL: "${newSched.title}" on ${newSched.startDate} at ${newSched.startTime}. Link: ${newSched.link}`
                    );
                    showToast(`Call "${newSched.title}" scheduled and posted!`);
                  }}
                  className="w-12 h-12 rounded-full bg-emerald-500 hover:bg-emerald-400 text-black flex items-center justify-center shadow-lg transition-transform hover:scale-105 active:scale-95 cursor-pointer"
                  title="Schedule & Post Call"
                >
                  <Send className="w-5 h-5 text-black -rotate-12 translate-x-0.5" />
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ── WhatsApp "Media, Docs & Links" Gallery Drawer (media_1788634705126.png) ── */}
      <AnimatePresence>
        {showMediaGalleryModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/80 backdrop-blur-md z-50 flex items-center justify-center p-4"
          >
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="w-full max-w-2xl max-h-[85vh] rounded-3xl bg-[#0e1017] border border-white/10 flex flex-col shadow-2xl overflow-hidden"
            >
              {/* Header with Close */}
              <div className="p-4 border-b border-white/[0.06] flex items-center justify-between bg-[#0a0d14]">
                <div className="flex items-center gap-2">
                  <ImageIcon className="w-5 h-5 text-emerald-400" />
                  <h3 className="font-display font-semibold text-sm sm:text-base text-white">
                    Media, docs and links
                  </h3>
                </div>
                <button
                  onClick={() => setShowMediaGalleryModal(false)}
                  className="p-1 rounded-lg text-neutral-400 hover:text-white transition cursor-pointer"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              {/* Tabs: Media | Docs | Links */}
              <div className="flex border-b border-white/[0.06] bg-[#07090e] px-4">
                {[
                  { id: 'media', label: `Media (${channelMediaItems.length})` },
                  { id: 'docs', label: `Docs (${channelDocItems.length})` },
                  { id: 'links', label: `Links (${channelLinkItems.length})` },
                ].map((tab) => (
                  <button
                    key={tab.id}
                    onClick={() => setMediaGalleryTab(tab.id as any)}
                    className={`flex-1 py-3 font-display font-semibold text-xs text-center border-b-2 transition cursor-pointer ${
                      mediaGalleryTab === tab.id
                        ? 'border-emerald-400 text-emerald-400'
                        : 'border-transparent text-neutral-400 hover:text-white'
                    }`}
                  >
                    {tab.label}
                  </button>
                ))}
              </div>

              {/* Gallery Content */}
              <div className="flex-1 overflow-y-auto p-4 space-y-4">
                {/* Channel Context Header */}
                <div className="sticky top-0 bg-[#0e1017]/95 backdrop-blur-sm py-1 z-10 flex items-center justify-between border-b border-white/[0.04]">
                  <span className="font-display text-xs text-neutral-300 font-medium truncate">
                    Shared in {currentRoomInfo.title}
                  </span>
                  <span className="font-mono text-[9px] text-purple-400 shrink-0">
                    Live Channel Index
                  </span>
                </div>

                {mediaGalleryTab === 'media' && (
                  channelMediaItems.length > 0 ? (
                    <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                      {channelMediaItems.map((item) => (
                        <div
                          key={item.id}
                          className="aspect-square rounded-2xl bg-white/[0.03] border border-white/10 flex flex-col items-center justify-center p-2 relative group overflow-hidden hover:border-emerald-400/50 transition cursor-pointer"
                        >
                          {item.url ? (
                            <img src={item.url} alt={item.title} className="w-full h-full object-cover rounded-xl" />
                          ) : (
                            <span className="text-3xl">🖼️</span>
                          )}
                          <div className="absolute inset-x-0 bottom-0 p-2 bg-gradient-to-t from-black/90 to-transparent">
                            <span className="font-sans text-[10px] text-white truncate block font-medium">
                              {item.title}
                            </span>
                            <span className="font-mono text-[8px] text-neutral-400 block truncate">
                              {item.sender} &bull; {item.date}
                            </span>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="flex flex-col items-center justify-center py-16 text-center space-y-3">
                      <div className="w-12 h-12 rounded-2xl bg-white/[0.04] border border-white/10 flex items-center justify-center text-neutral-500">
                        <ImageIcon className="w-6 h-6 text-emerald-400/60" />
                      </div>
                      <div>
                        <p className="font-display font-medium text-xs text-white">No Shared Media</p>
                        <p className="font-mono text-[10px] text-neutral-500 mt-0.5">Images and videos shared in this room will appear here</p>
                      </div>
                    </div>
                  )
                )}

                {mediaGalleryTab === 'docs' && (
                  channelDocItems.length > 0 ? (
                    <div className="space-y-2">
                      {channelDocItems.map((doc) => (
                        <div
                          key={doc.id}
                          className="flex items-center justify-between p-3 rounded-2xl bg-white/[0.03] border border-white/[0.06] hover:bg-white/[0.06] transition cursor-pointer"
                        >
                          <div className="flex items-center gap-3 min-w-0">
                            <div className="w-9 h-9 rounded-xl bg-purple-500/20 text-purple-300 flex items-center justify-center shrink-0">
                              <FileText className="w-5 h-5" />
                            </div>
                            <div className="min-w-0">
                              <h5 className="font-display font-medium text-xs text-white truncate">{doc.title}</h5>
                              <span className="font-mono text-[9px] text-neutral-400 block truncate">
                                {doc.size} &bull; {doc.sender} &bull; {doc.date}
                              </span>
                            </div>
                          </div>
                          {doc.url && (
                            <a href={doc.url} target="_blank" rel="noreferrer" className="p-1 rounded text-neutral-400 hover:text-white">
                              <ExternalLink className="w-4 h-4" />
                            </a>
                          )}
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="flex flex-col items-center justify-center py-16 text-center space-y-3">
                      <div className="w-12 h-12 rounded-2xl bg-white/[0.04] border border-white/10 flex items-center justify-center text-neutral-500">
                        <FileText className="w-6 h-6 text-purple-400/60" />
                      </div>
                      <div>
                        <p className="font-display font-medium text-xs text-white">No Shared Documents</p>
                        <p className="font-mono text-[10px] text-neutral-500 mt-0.5">PDFs and resolution briefs shared in this room will appear here</p>
                      </div>
                    </div>
                  )
                )}

                {mediaGalleryTab === 'links' && (
                  channelLinkItems.length > 0 ? (
                    <div className="space-y-2">
                      {channelLinkItems.map((lnk) => (
                        <a
                          key={lnk.id}
                          href={lnk.url}
                          target="_blank"
                          rel="noreferrer"
                          className="flex items-center justify-between p-3 rounded-2xl bg-white/[0.03] border border-white/[0.06] hover:bg-white/[0.06] transition"
                        >
                          <div className="flex items-center gap-3 min-w-0">
                            <div className="w-9 h-9 rounded-xl bg-cyan-500/20 text-cyan-300 flex items-center justify-center shrink-0">
                              <Link2 className="w-5 h-5" />
                            </div>
                            <div className="min-w-0">
                              <h5 className="font-display font-medium text-xs text-white truncate">{lnk.title}</h5>
                              <span className="font-mono text-[10px] text-cyan-400 truncate block">{lnk.url}</span>
                              <span className="font-mono text-[8px] text-neutral-500 block">{lnk.sender} &bull; {lnk.date}</span>
                            </div>
                          </div>
                          <ExternalLink className="w-4 h-4 text-neutral-400 shrink-0 ml-2" />
                        </a>
                      ))}
                    </div>
                  ) : (
                    <div className="flex flex-col items-center justify-center py-16 text-center space-y-3">
                      <div className="w-12 h-12 rounded-2xl bg-white/[0.04] border border-white/10 flex items-center justify-center text-neutral-500">
                        <Link2 className="w-6 h-6 text-cyan-400/60" />
                      </div>
                      <div>
                        <p className="font-display font-medium text-xs text-white">No Shared Links</p>
                        <p className="font-mono text-[10px] text-neutral-500 mt-0.5">Web links sent in this room will automatically be indexed here</p>
                      </div>
                    </div>
                  )
                )}
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ── Group / Room Info Modal ── */}
      <AnimatePresence>
        {showRoomInfoModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/80 backdrop-blur-md z-50 flex items-center justify-center p-4"
          >
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="w-full max-w-md rounded-3xl bg-[#0e1017] border border-white/10 p-6 shadow-2xl space-y-5"
            >
              <div className="flex items-center justify-between border-b border-white/[0.06] pb-3">
                <div className="flex items-center gap-2.5">
                  <span className="text-xl">{currentRoomInfo.icon}</span>
                  <div>
                    <h3 className="font-display font-semibold text-sm sm:text-base text-white truncate">
                      {currentRoomInfo.title}
                    </h3>
                    <span className="font-mono text-[9px] text-purple-400 font-semibold">
                      {currentRoomInfo.badge}
                    </span>
                  </div>
                </div>
                <button
                  onClick={() => setShowRoomInfoModal(false)}
                  className="p-1 rounded-lg text-neutral-400 hover:text-white transition cursor-pointer"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              <div className="space-y-4 text-xs">
                <div>
                  <span className="font-mono text-[9px] uppercase tracking-wider text-neutral-500 block mb-1">
                    Description & Charter
                  </span>
                  <p className="font-sans text-neutral-300 leading-relaxed bg-white/[0.02] p-3 rounded-2xl border border-white/[0.04]">
                    {currentRoomInfo.description}
                  </p>
                </div>

                <div className="grid grid-cols-2 gap-2">
                  <div className="p-3 rounded-2xl bg-white/[0.02] border border-white/[0.04]">
                    <span className="font-mono text-[9px] uppercase tracking-wider text-neutral-500 block">
                      Active Participants
                    </span>
                    <span className="font-display font-semibold text-white text-sm mt-1 block">
                      {currentRoomInfo.memberCount} Delegates
                    </span>
                  </div>
                  <div className="p-3 rounded-2xl bg-white/[0.02] border border-white/[0.04]">
                    <span className="font-mono text-[9px] uppercase tracking-wider text-neutral-500 block">
                      Security Protocol
                    </span>
                    <span className="font-display font-semibold text-emerald-400 text-sm mt-1 flex items-center gap-1">
                      <ShieldCheck className="w-3.5 h-3.5" />
                      <span>Encrypted Mesh</span>
                    </span>
                  </div>
                </div>

                <div>
                  <span className="font-mono text-[9px] uppercase tracking-wider text-neutral-500 block mb-1">
                    Room Access Link
                  </span>
                  <div className="flex items-center gap-2 p-2.5 rounded-2xl bg-white/[0.03] border border-white/[0.06]">
                    <span className="font-mono text-[10px] text-neutral-300 truncate flex-1 select-all">
                      {currentRoomInfo.link}
                    </span>
                    <button
                      onClick={() => {
                        if (typeof navigator !== 'undefined' && navigator.clipboard) {
                          navigator.clipboard.writeText(currentRoomInfo.link);
                        }
                        showToast('📋 Room link copied');
                      }}
                      className="p-1.5 rounded-lg bg-white/[0.06] hover:bg-white/[0.12] text-neutral-300 hover:text-white transition cursor-pointer"
                    >
                      <Copy className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              </div>

              <div className="pt-2 border-t border-white/[0.06] flex justify-end">
                <button
                  onClick={() => setShowRoomInfoModal(false)}
                  className="px-4 py-2 rounded-xl bg-white/[0.06] hover:bg-white/[0.1] text-white font-medium text-xs transition cursor-pointer"
                >
                  Close
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ── Invite / Add Members Modal ── */}
      <AnimatePresence>
        {showInviteLinkModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/80 backdrop-blur-md z-50 flex items-center justify-center p-4"
          >
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="w-full max-w-md rounded-3xl bg-[#0e1017] border border-white/10 p-6 shadow-2xl space-y-5"
            >
              <div className="flex items-center justify-between border-b border-white/[0.06] pb-3">
                <div className="flex items-center gap-2">
                  <UserPlus className="w-5 h-5 text-emerald-400" />
                  <h3 className="font-display font-semibold text-sm sm:text-base text-white">
                    Invite Delegates to {currentRoomInfo.title}
                  </h3>
                </div>
                <button
                  onClick={() => setShowInviteLinkModal(false)}
                  className="p-1 rounded-lg text-neutral-400 hover:text-white transition cursor-pointer"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              <p className="font-sans text-xs text-neutral-400 leading-relaxed">
                Share this direct sovereign link to invite other delegates or colleagues into this caucus room.
              </p>

              <div className="flex items-center gap-2 p-2.5 rounded-2xl bg-white/[0.04] border border-white/10">
                <span className="font-mono text-xs text-emerald-300 truncate flex-1 select-all">
                  {currentRoomInfo.link}
                </span>
                <button
                  onClick={() => {
                    if (typeof navigator !== 'undefined' && navigator.clipboard) {
                      navigator.clipboard.writeText(currentRoomInfo.link);
                    }
                    showToast('📋 Invite link copied to clipboard');
                  }}
                  className="px-3 py-1.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-black font-bold text-xs transition cursor-pointer flex items-center gap-1 shrink-0 shadow-sm"
                >
                  <Copy className="w-3.5 h-3.5 text-black" />
                  <span>Copy</span>
                </button>
              </div>

              <div className="pt-2 flex justify-end">
                <button
                  onClick={() => setShowInviteLinkModal(false)}
                  className="px-4 py-2 rounded-xl bg-white/[0.06] hover:bg-white/[0.1] text-white text-xs font-medium cursor-pointer transition"
                >
                  Done
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ── Create Community Group Modal ── */}
      <AnimatePresence>
        {showCreateCommunityGroupModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/80 backdrop-blur-md z-50 flex items-center justify-center p-4"
          >
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="w-full max-w-md rounded-3xl bg-[#0e1017] border border-white/10 p-6 shadow-2xl space-y-4"
            >
              <div className="flex items-center justify-between border-b border-white/[0.06] pb-3">
                <div className="flex items-center gap-2">
                  <Users className="w-5 h-5 text-purple-400" />
                  <h3 className="font-display font-semibold text-sm sm:text-base text-white">
                    New Community Group
                  </h3>
                </div>
                <button
                  onClick={() => setShowCreateCommunityGroupModal(false)}
                  className="p-1 rounded-lg text-neutral-400 hover:text-white transition cursor-pointer"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              <form onSubmit={handleCreateCommunityGroup} className="space-y-4">
                <div className="space-y-1">
                  <label className="font-mono text-[10px] text-neutral-400 uppercase tracking-wider block">
                    Group Name
                  </label>
                  <input
                    type="text"
                    value={newCommunityGroupName}
                    onChange={(e) => setNewCommunityGroupName(e.target.value)}
                    placeholder="e.g. Drafting Working Group Alpha"
                    className="w-full px-3 py-2 rounded-xl bg-white/[0.03] border border-white/10 focus:border-purple-500/50 text-xs text-white focus:outline-none"
                    autoFocus
                  />
                </div>

                <div className="space-y-1">
                  <label className="font-mono text-[10px] text-neutral-400 uppercase tracking-wider block">
                    Purpose / Description
                  </label>
                  <input
                    type="text"
                    value={newCommunityGroupDesc}
                    onChange={(e) => setNewCommunityGroupDesc(e.target.value)}
                    placeholder="e.g. Resolution clause crafting and bilateral bloc consultation"
                    className="w-full px-3 py-2 rounded-xl bg-white/[0.03] border border-white/10 focus:border-purple-500/50 text-xs text-white focus:outline-none"
                  />
                </div>

                <div className="space-y-1">
                  <label className="font-mono text-[10px] text-neutral-400 uppercase tracking-wider block">
                    Group Icon Emoji
                  </label>
                  <div className="flex items-center gap-2 overflow-x-auto py-1">
                    {['📝', '🌐', '⚡', '🏛️', '🛡️', '💬', '⚖️', '🔥', '🎯', '🚀'].map((em) => (
                      <button
                        type="button"
                        key={em}
                        onClick={() => setNewCommunityGroupIcon(em)}
                        className={`w-9 h-9 rounded-xl text-lg flex items-center justify-center border transition cursor-pointer ${
                          newCommunityGroupIcon === em
                            ? 'bg-purple-500/20 border-purple-500 text-white'
                            : 'bg-white/[0.03] border-white/10 hover:bg-white/[0.08]'
                        }`}
                      >
                        {em}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="pt-2 flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => setShowCreateCommunityGroupModal(false)}
                    className="flex-1 py-2.5 rounded-xl bg-white/[0.06] hover:bg-white/[0.1] text-neutral-300 text-xs font-medium cursor-pointer transition"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={!newCommunityGroupName.trim()}
                    className="flex-1 py-2.5 rounded-xl bg-purple-600 hover:bg-purple-500 disabled:opacity-30 text-white text-xs font-bold transition shadow-[0_0_15px_rgba(168,85,247,0.3)] cursor-pointer"
                  >
                    Create Group
                  </button>
                </div>
              </form>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ── ZenChat Settings Modal (WhatsApp Style) ── */}
      <ZenChatSettingsModal
        isOpen={showSettingsModal}
        onClose={() => setShowSettingsModal(false)}
      />

      {/* ── Discord Roles & Permissions Modal ── */}
      <DiscordRoleSettingsModal
        isOpen={showRoleSettingsModal}
        onClose={() => setShowRoleSettingsModal(false)}
        communityName={currentCommunity.name}
        roles={currentCommunity.roles || []}
        members={currentCommunity.members || []}
        canManageRoles={canManageCurrentRoles}
        onUpdateRoles={(newRoles) => {
          setCommunities((prev) => {
            const updated = prev.map((c) => (c.id === currentCommunity.id ? { ...c, roles: newRoles } : c));
            try {
              localStorage.setItem(
                'zenvitra_user_communities_v4',
                JSON.stringify(updated.filter((c) => c.id !== 'comm-direct'))
              );
            } catch (_) {}
            return updated;
          });
          showToast('Server roles updated');
        }}
        onUpdateMembers={(newMembers) => {
          setCommunities((prev) => {
            const updated = prev.map((c) => (c.id === currentCommunity.id ? { ...c, members: newMembers } : c));
            try {
              localStorage.setItem(
                'zenvitra_user_communities_v4',
                JSON.stringify(updated.filter((c) => c.id !== 'comm-direct'))
              );
            } catch (_) {}
            return updated;
          });
          showToast('Member role assignments updated');
        }}
        onToast={showToast}
      />

      {/* ── Manage Subgroup Details & Permissions Modal ── */}
      <ManageCommunityGroupModal
        isOpen={!!managingSubgroup}
        onClose={() => setManagingSubgroup(null)}
        group={managingSubgroup}
        community={currentCommunity}
        onSaveGroup={(updatedGroup) => {
          const existing = currentCommunity.groups || [];
          const updated = existing.map((g) => (g.id === updatedGroup.id ? updatedGroup : g));
          saveCommunityGroups(currentCommunity.id, updated);
          setManagingSubgroup(null);
        }}
        onDeleteGroup={(groupId) => {
          handleDeleteCommunityGroup(groupId);
          setManagingSubgroup(null);
        }}
        onToast={showToast}
      />

      {/* ── Manage Community Server Overview, Categories & Channels Modal ── */}
      <ManageCommunityModal
        isOpen={showManageCommunityModal}
        onClose={() => setShowManageCommunityModal(false)}
        community={currentCommunity}
        onUpdateCommunity={(updatedComm) => {
          setCommunities((prev) => {
            const updated = prev.map((c) => (c.id === updatedComm.id ? updatedComm : c));
            try {
              localStorage.setItem(
                'zenvitra_user_communities_v4',
                JSON.stringify(updated.filter((c) => c.id !== 'comm-direct'))
              );
            } catch (_) {}
            return updated;
          });
        }}
        onOpenRoles={() => setShowRoleSettingsModal(true)}
        onDeleteCommunity={
          currentCommunity.id !== 'comm-direct' && currentCommunity.id !== 'comm-user-primary'
            ? (commId) => {
                setCommunities((prev) => {
                  const filtered = prev.filter((c) => c.id !== commId);
                  try {
                    localStorage.setItem(
                      'zenvitra_user_communities_v4',
                      JSON.stringify(filtered.filter((c) => c.id !== 'comm-direct'))
                    );
                  } catch (_) {}
                  return filtered;
                });
                setSelectedCommunityId('comm-direct');
                showToast('Server deleted');
              }
            : undefined
        }
        onToast={showToast}
      />

      {/* ── Universal ⌘K Command Palette ── */}
      <ZenChatCommandBar
        isOpen={showCommandBar}
        onClose={() => setShowCommandBar(false)}
        onTriggerSlashAction={(action) => {
          if (action === 'poll') {
            sendNativeObjectMessage(
              {
                type: 'poll',
                id: `poll_${Date.now()}`,
                title: 'Caucus Quorum Poll',
                actionLabel: 'Vote',
                actionUrl: '#',
                pollData: {
                  id: `polldata_${Date.now()}`,
                  question: 'Should we introduce the Sovereign AI Governance draft clause now?',
                  options: [
                    { id: 'opt-1', text: 'Yes, table immediately', votes: [] },
                    { id: 'opt-2', text: 'Require bilateral review first', votes: [] },
                    { id: 'opt-3', text: 'Abstain', votes: [] }
                  ],
                  totalVotes: 0,
                  allowMultiple: false
                }
              },
              '📊 New Caucus Poll Dispatched',
              currentChatContextId
            );
            showToast('📊 Poll dispatched to conversation');
          } else if (action === 'doc') {
            sendNativeObjectMessage(
              {
                type: 'doc',
                id: `doc_${Date.now()}`,
                title: 'RISMUN 2027 — UNGA Draft Resolution #04',
                subtitle: 'Sovereign Digital Commons and Multilateral Protocol Covenant',
                badge: 'UN-DRAFT',
                actionLabel: 'Open in ZEN.DOCS',
                actionUrl: '/docs',
                metadata: {
                  clausesCount: 14,
                  docCode: 'RES/2027/04'
                }
              },
              '📄 Shared Document Workspace',
              currentChatContextId
            );
            showToast('📄 Document card dispatched to conversation');
          } else if (action === 'mun') {
            sendNativeObjectMessage(
              {
                type: 'mun',
                id: `mun_${Date.now()}`,
                title: 'United Nations General Assembly — DISEC Committee',
                subtitle: 'Debate resumes tomorrow at 09:00 AM CET in Plenary Hall',
                badge: 'DISEC',
                actionLabel: 'Enter Committee Dais',
                actionUrl: '/committee',
                metadata: {
                  schedule: 'Tomorrow • 09:00 AM CET'
                }
              },
              '🏛️ Committee Chamber Alert',
              currentChatContextId
            );
            showToast('🏛️ MUN Committee card dispatched');
          } else if (action === 'chamber') {
            sendNativeObjectMessage(
              {
                type: 'chamber',
                id: `chamb_${Date.now()}`,
                title: 'Youth Policy Reform Deliberation Stage',
                subtitle: 'Live structured debate with active speakers list and recorded decisions',
                badge: 'POLICY',
                actionLabel: 'Join Stage',
                actionUrl: '/chamber'
              },
              '🧭 Chamber Session Invitation',
              currentChatContextId
            );
            showToast('🧭 Chamber stage card dispatched');
          } else if (action === 'pulse') {
            sendNativeObjectMessage(
              {
                type: 'pulse',
                id: `pulse_${Date.now()}`,
                title: 'Should India change its education system for the AI age?',
                subtitle: 'Civic pulse signal by @founder with 143 signals and 28 verified citations',
                badge: 'CIVIC',
                actionLabel: 'Open in Pulse',
                actionUrl: '/pulse'
              },
              '📡 Shared Civic Signal',
              currentChatContextId
            );
            showToast('📡 Pulse post card dispatched');
          }
        }}
      />

      {/* ── ZENVITRA Diplomatic Identity Card Modal ── */}
      <ZenIdentityCardModal
        isOpen={Boolean(identityCardUser)}
        user={identityCardUser}
        onClose={() => setIdentityCardUser(null)}
        onDirectMessage={(username, name) => {
          const convId = createDirectChat(username, name);
          setActiveConversationId(convId);
          showToast(`💬 Opened direct chat with ${name}`);
        }}
        onStartCall={(username, callType) => {
          handleInitiateDirectCall(username, callType);
        }}
      />
    </div>
  );
}
