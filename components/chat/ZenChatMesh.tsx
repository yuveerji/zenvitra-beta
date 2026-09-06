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
  ExternalLink
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useZenChat } from '@/context/ZenChatPlatformContext';
import { useZenPulse } from '@/context/ZenPulsePlatformContext';
import { useAuth } from '@/context/AuthContext';
import { ChatMessage, ChatConversation, ChatCommunity, ChatChannel, ChannelCategory, DiscordRole, CommunityMember, GlimpseSnap, ScheduledCall, CallLink, SharedMediaItem } from '@/types/chat';
import { ZenNotesRow } from '@/components/chat/ZenNotesRow';
import { GlimpseSnapModal } from '@/components/chat/GlimpseSnapModal';
import { GlimpseViewerModal } from '@/components/chat/GlimpseViewerModal';
import { NewChatActionModal } from '@/components/chat/NewChatActionModal';
import { StickersDrawer } from '@/components/chat/StickersDrawer';
import { ZenChatSettingsModal } from '@/components/chat/ZenChatSettingsModal';
import { DiscordRoleSettingsModal } from '@/components/chat/DiscordRoleSettingsModal';

/* ── Seeded Sovereign Communities (Discord + WhatsApp style) ── */
const DEFAULT_COMMUNITIES: ChatCommunity[] = [
  {
    id: 'comm-direct',
    name: 'Direct Envoys & DMs',
    icon: '💬',
    badge: 'DMs',
    roles: [],
    channels: []
  },
  {
    id: 'comm-un-plenary',
    name: 'Global Plenary Council',
    icon: '🏛️',
    badge: 'UN #418',
    description: 'Multilateral diplomatic assembly and working committees',
    categories: [
      { id: 'cat-entrance', name: '[ENTRANCE]' },
      { id: 'cat-alerts', name: '[ALERTS]' },
      { id: 'cat-community', name: '[COMMUNITY]' },
      { id: 'cat-voice', name: '[VOICE AREA]' }
    ],
    roles: [
      {
        id: 'role-founder',
        name: '👑 | Founder',
        color: '#f59e0b',
        hoist: true,
        position: 1,
        permissions: {
          manageServer: true,
          manageRoles: true,
          manageChannels: true,
          kickMembers: true,
          banMembers: true,
          sendMessages: true,
          embedLinks: true,
          attachFiles: true,
          connectVoice: true,
          speakVoice: true,
          prioritySpeaker: true
        }
      },
      {
        id: 'role-admin',
        name: '🏛️ | Admins & Dais',
        color: '#a855f7',
        hoist: true,
        position: 2,
        permissions: {
          manageServer: false,
          manageRoles: true,
          manageChannels: true,
          kickMembers: true,
          banMembers: false,
          sendMessages: true,
          embedLinks: true,
          attachFiles: true,
          connectVoice: true,
          speakVoice: true,
          prioritySpeaker: true
        }
      },
      {
        id: 'role-vip',
        name: '⭐ | VIP & Envoys',
        color: '#06b6d4',
        hoist: true,
        position: 3,
        permissions: {
          manageServer: false,
          manageRoles: false,
          manageChannels: false,
          kickMembers: false,
          banMembers: false,
          sendMessages: true,
          embedLinks: true,
          attachFiles: true,
          connectVoice: true,
          speakVoice: true,
          prioritySpeaker: false
        }
      },
      {
        id: 'role-delegate',
        name: 'Delegate',
        color: '#94a3b8',
        hoist: false,
        position: 4,
        isDefault: true,
        permissions: {
          manageServer: false,
          manageRoles: false,
          manageChannels: false,
          kickMembers: false,
          banMembers: false,
          sendMessages: true,
          embedLinks: true,
          attachFiles: true,
          connectVoice: true,
          speakVoice: true,
          prioritySpeaker: false
        }
      }
    ],
    members: [
      {
        id: 'u_yuveer',
        name: 'Yuveer',
        username: 'yuveer',
        status: 'online',
        roleIds: ['role-founder'],
        activity: {
          type: 'playing',
          name: 'Zenvitra OS',
          details: 'Architecting sovereign nodes',
          badge: 'DEV'
        },
        customStatus: 'building the sovereign stack'
      },
      {
        id: 'u_sec',
        name: 'Darky',
        username: 'darky_admin',
        status: 'online',
        roleIds: ['role-admin'],
        activity: {
          type: 'custom',
          name: 'USD',
          badge: 'USD'
        },
        customStatus: 'Dais oversight'
      },
      {
        id: 'u_chair',
        name: 'RON9IE',
        username: 'ron9ie',
        status: 'dnd',
        roleIds: ['role-admin'],
        customStatus: 'in session'
      },
      {
        id: 'u_tanmay',
        name: 'tanmaybhat',
        username: 'tanmay',
        status: 'idle',
        roleIds: ['role-vip'],
        activity: {
          type: 'playing',
          name: 'Valorant Tracker App',
          badge: 'ROBLOX'
        },
        customStatus: 'streaming live'
      },
      {
        id: 'u_elena',
        name: 'Elena Rostova',
        username: 'elena_press',
        status: 'online',
        roleIds: ['role-delegate'],
        customStatus: 'International Press Wire'
      },
      {
        id: 'u_marcus',
        name: 'Marcus Sterling',
        username: 'marcus_uk',
        status: 'online',
        roleIds: ['role-delegate'],
        customStatus: 'Delegate of United Kingdom'
      },
      {
        id: 'u_aarav',
        name: 'Aarav Sharma',
        username: 'aarav_in',
        status: 'offline',
        roleIds: ['role-delegate'],
        customStatus: 'Delegate of India'
      }
    ],
    channels: [
      { id: 'ch-welcome', name: 'welcome-chamber', type: 'text', categoryId: 'cat-entrance', description: 'Welcome hub & charter overview' },
      { id: 'ch-rules', name: 'assembly-rules', type: 'text', categoryId: 'cat-entrance', description: 'Rules of procedure & diplomatic decorum' },
      { id: 'ch-briefs', name: 'yt-alerts', type: 'announcement', categoryId: 'cat-alerts', description: 'Breaking news and crisis broadcasts', unreadCount: 3 },
      { id: 'ch-general', name: 'general-assembly', type: 'text', categoryId: 'cat-community', description: 'Multilateral sovereign debates & floor speeches' },
      { id: 'ch-resolutions', name: 'policy-drafts', type: 'text', categoryId: 'cat-community', description: 'Collaborative treaty and draft resolution workbench' },
      { id: 'ch-unfiltered', name: 'unfiltered-baatein', type: 'text', categoryId: 'cat-community', description: 'Informal delegate lounge and caucus coffee' },
      { 
        id: 'ch-voice-plenary', 
        name: 'Chamber Alpha [Voice]', 
        type: 'voice', 
        categoryId: 'cat-voice',
        description: 'Live floor microphone & speaking delegates',
        userLimit: 10,
        isLocked: false,
        activeVoiceUsers: [] 
      },
      { 
        id: 'ch-voice-duo1', 
        name: 'Duo Chamber 1', 
        type: 'voice', 
        categoryId: 'cat-voice',
        description: 'Bilateral unmoderated consultation',
        userLimit: 2,
        isLocked: false,
        activeVoiceUsers: [] 
      },
      { 
        id: 'ch-voice-warroom', 
        name: 'Crisis War Room [Voice]', 
        type: 'voice', 
        categoryId: 'cat-voice',
        description: 'Immediate response caucus chamber',
        isLocked: true,
        userLimit: 5,
        activeVoiceUsers: [] 
      }
    ],
    groups: [
      { id: 'grp-un-drafting', name: 'Drafting Committee Alpha', description: 'Treaty working group without channels (Direct Caucus style)', icon: '📝', membersCount: 14 },
      { id: 'grp-un-g77', name: 'G-77 Sovereign Coalition', description: 'Caucus bloc coordination group', icon: '🌐', membersCount: 28 }
    ]
  },
  {
    id: 'comm-crisis-alpha',
    name: 'Sovereign Crisis Chamber',
    icon: '⚡',
    badge: 'CRISIS',
    description: 'Rapid response multilateral war room',
    categories: [
      { id: 'cat-crisis-ops', name: '[OPERATIONS]' },
      { id: 'cat-crisis-voice', name: '[COMMAND VOICE]' }
    ],
    roles: [
      {
        id: 'role-high-cmd',
        name: '⚡ | High Command',
        color: '#ef4444',
        hoist: true,
        position: 1,
        permissions: {
          manageServer: true,
          manageRoles: true,
          manageChannels: true,
          kickMembers: true,
          banMembers: true,
          sendMessages: true,
          embedLinks: true,
          attachFiles: true,
          connectVoice: true,
          speakVoice: true,
          prioritySpeaker: true
        }
      },
      {
        id: 'role-intel',
        name: '🛡️ | Intel Director',
        color: '#f59e0b',
        hoist: true,
        position: 2,
        permissions: {
          manageServer: false,
          manageRoles: true,
          manageChannels: true,
          kickMembers: false,
          banMembers: false,
          sendMessages: true,
          embedLinks: true,
          attachFiles: true,
          connectVoice: true,
          speakVoice: true,
          prioritySpeaker: false
        }
      },
      {
        id: 'role-op',
        name: 'Field Operator',
        color: '#94a3b8',
        hoist: false,
        position: 3,
        isDefault: true,
        permissions: {
          manageServer: false,
          manageRoles: false,
          manageChannels: false,
          kickMembers: false,
          banMembers: false,
          sendMessages: true,
          embedLinks: true,
          attachFiles: true,
          connectVoice: true,
          speakVoice: true,
          prioritySpeaker: false
        }
      }
    ],
    members: [
      {
        id: 'u_yuveer',
        name: 'Yuveer',
        username: 'yuveer',
        status: 'online',
        roleIds: ['role-high-cmd'],
        customStatus: 'Commander-in-Chief'
      },
      {
        id: 'u_sec',
        name: 'Intel Ops',
        username: 'intel_core',
        status: 'online',
        roleIds: ['role-intel'],
        customStatus: 'Monitoring satellites'
      }
    ],
    channels: [
      { id: 'ch-crisis-general', name: 'war-room-text', type: 'text', categoryId: 'cat-crisis-ops', description: 'Fast-paced crisis directive broadcast' },
      { id: 'ch-crisis-intel', name: 'intelligence-briefs', type: 'text', categoryId: 'cat-crisis-ops', description: 'Encrypted intelligence leaks and evidence' },
      { 
        id: 'ch-voice-crisis', 
        name: 'High Command [Voice]', 
        type: 'voice', 
        categoryId: 'cat-crisis-voice',
        description: 'Live emergency audio command',
        isLocked: true,
        activeVoiceUsers: [] 
      }
    ],
    groups: [
      { id: 'grp-crisis-cyber', name: 'Cyber Defense Taskforce', description: 'Specialized encrypted team chat', icon: '💻', membersCount: 8 }
    ]
  }
];

const EMOJI_LIST = ['👍', '❤️', '⚡', '📜', '🔥', '👏', '🎯', '🤝', '💎', '🚀', '💡', '🛡️', '⚖️', '🌍', '✨'];

export function ZenChatMesh() {
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
    toggleMuteConversation,
    deleteConversation,
  } = useZenChat();

  const { profiles } = useZenPulse();

  /* Local UI State */
  const [communities, setCommunities] = useState<ChatCommunity[]>(DEFAULT_COMMUNITIES);
  const [selectedCommunityId, setSelectedCommunityId] = useState<string>('comm-direct');
  const [activeChannelId, setActiveChannelId] = useState<string>('ch-general');
  const [activeCommunityGroupId, setActiveCommunityGroupId] = useState<string | null>(null);
  const [activeVoiceChannel, setActiveVoiceChannel] = useState<ChatChannel | null>(null);
  const [showGroupSettingsMenu, setShowGroupSettingsMenu] = useState(false);
  
  const [messageText, setMessageText] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [activeCategoryFilter, setActiveCategoryFilter] = useState<'all' | 'primary' | 'requests' | 'general' | 'broadcasts'>('primary');
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
  const [showMembersDrawer, setShowMembersDrawer] = useState(false);
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const [showStickerDrawer, setShowStickerDrawer] = useState(false);
  const [replyingTo, setReplyingTo] = useState<ChatMessage | null>(null);

  /* WhatsApp & Navigation Rail State */
  const [activeRailTab, setActiveRailTab] = useState<'chats' | 'calls' | 'communities' | 'media'>('chats');
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

  /* Call state & streams */
  const [isVoiceMuted, setIsVoiceMuted] = useState(false);
  const [isVoiceDeafened, setIsVoiceDeafened] = useState(false);
  const [localMediaStream, setLocalMediaStream] = useState<MediaStream | null>(null);
  const localVideoRef = useRef<HTMLVideoElement>(null);

  /* Toast Notification */
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setMounted(true);
  }, []);

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
    const list = messagesMap[currentChatContextId] || [];
    if (list.length > 0) return list;

    // Fallbacks if channel or group has no messages yet
    if (activeCommunityGroup) {
      return [
        {
          id: `seed_grp_${activeCommunityGroup.id}`,
          conversationId: currentChatContextId,
          senderId: 'sys-group',
          senderName: activeCommunityGroup.name,
          senderUsername: 'group_system',
          senderRole: '🏛️ GROUP',
          content: `Welcome to ${activeCommunityGroup.name}. Direct group chat for coordinating without sub-channels.`,
          timestamp: 'Today',
          isSelf: false,
          reactions: []
        }
      ];
    }
    if (activeChannel) {
      return [
        {
          id: `seed_chan_${activeChannel.id}`,
          conversationId: currentChatContextId,
          senderId: 'sys-chan',
          senderName: `#${activeChannel.name}`,
          senderUsername: 'channel_wire',
          senderRole: '👑 SECRETARIAT',
          content: `Welcome to #${activeChannel.name}. ${activeChannel.description || 'Channel discussion is live.'}`,
          timestamp: 'Today',
          isSelf: false,
          reactions: []
        }
      ];
    }
    return [];
  }, [messagesMap, currentChatContextId, activeCommunityGroup, activeChannel]);

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
      clean === 'yuveerji' ||
      clean === 'elena_press' ||
      clean === 'un_secretariat';

    if (!isPlatformUser) {
      setIsOnlineCallingError(`Delegate @${clean} is currently offline or not registered on Zenvitra. Direct calling is only available for active platform members.`);
      return;
    }

    setIsOnlineCallingError(null);
    setShowDirectCallModal(false);
    startDirectNumberCall(clean, `@${clean}`, callType);
  };

  /* Join Voice Channel */
  const handleJoinVoiceChannel = (channel: ChatChannel) => {
    if (activeVoiceChannel?.id === channel.id) {
      setActiveVoiceChannel(null);
      showToast(`Disconnected from ${channel.name}`);
    } else {
      setActiveVoiceChannel(channel);
      showToast(`Connected to 🔊 ${channel.name}`);
    }
  };

  /* Create Caucus Community */
  const handleCreateCaucus = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newCaucusName.trim()) return;

    const newComm: ChatCommunity = {
      id: `comm-${Date.now()}`,
      name: newCaucusName.trim(),
      icon: newCaucusIcon || '🏛️',
      badge: 'CAUCUS',
      categories: [
        { id: `cat-${Date.now()}-text`, name: '[COMMUNITY]' },
        { id: `cat-${Date.now()}-voice`, name: '[VOICE AREA]' }
      ],
      roles: [
        {
          id: `role-${Date.now()}-admin`,
          name: '👑 | Founder',
          color: '#f59e0b',
          hoist: true,
          position: 1,
          permissions: {
            manageServer: true,
            manageRoles: true,
            manageChannels: true,
            kickMembers: true,
            banMembers: true,
            sendMessages: true,
            embedLinks: true,
            attachFiles: true,
            connectVoice: true,
            speakVoice: true,
            prioritySpeaker: true
          }
        },
        {
          id: `role-${Date.now()}-member`,
          name: 'Delegate',
          color: '#94a3b8',
          hoist: false,
          position: 2,
          isDefault: true,
          permissions: {
            manageServer: false,
            manageRoles: false,
            manageChannels: false,
            kickMembers: false,
            banMembers: false,
            sendMessages: true,
            embedLinks: true,
            attachFiles: true,
            connectVoice: true,
            speakVoice: true,
            prioritySpeaker: false
          }
        }
      ],
      members: [
        {
          id: 'u_yuveer',
          name: 'Yuveer',
          username: 'yuveer',
          status: 'online',
          roleIds: [`role-${Date.now()}-admin`],
          customStatus: 'Caucus Founder'
        }
      ],
      channels: [
        { id: `ch-${Date.now()}-1`, name: 'general-floor', type: 'text', categoryId: `cat-${Date.now()}-text`, description: newCaucusDescription || 'General caucus discourse' },
        { id: `ch-${Date.now()}-2`, name: 'Chamber Alpha [Voice]', type: 'voice', categoryId: `cat-${Date.now()}-voice`, description: 'Live audio floor' }
      ]
    };

    setCommunities((prev) => [...prev, newComm]);
    setSelectedCommunityId(newComm.id);
    setActiveChannelId(newComm.channels[0].id);
    setShowCreateCaucusModal(false);
    setNewCaucusName('');
    setNewCaucusDescription('');
    showToast(`Caucus "${newComm.name}" established`);
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

    setCommunities((prev) =>
      prev.map((c) => {
        if (c.id === selectedCommunityId) {
          return { ...c, channels: [...c.channels, newChan] };
        }
        return c;
      })
    );

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
      <div className="w-16 sm:w-18 bg-[#030406] border-r border-white/[0.06] flex flex-col items-center py-4 justify-between z-30 flex-shrink-0">
        
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
                setSelectedCommunityId('comm-un-plenary');
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
      <div className={`${isSidebarCollapsed ? 'w-0 hidden md:w-0' : 'w-72 sm:w-84'} bg-[#070709] border-r border-white/[0.06] flex flex-col transition-all duration-300 flex-shrink-0 relative z-20`}>
        
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

            {/* Single primary compose + button in sidebar header */}
            <button
              onClick={() => setShowNewChatActionModal(true)}
              className="p-1.5 rounded-xl bg-purple-600 hover:bg-purple-500 text-white transition shadow-sm cursor-pointer flex items-center justify-center hover:scale-105 active:scale-95"
              title="New Message, Group, Caucus or Channel"
            >
              <Plus className="w-4 h-4 stroke-[2.5]" />
            </button>
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
                          <span>{call.timestamp}</span>
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
                      onClick={() => setActiveConversationId(conv.id)}
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
                          {conv.lastMessage?.timestamp || 'Now'}
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
                                        className="flex items-center justify-between px-2 py-1 rounded-lg bg-white/[0.02] text-xs text-neutral-300"
                                      >
                                        <div className="flex items-center gap-2 truncate">
                                          <div className="relative flex items-center justify-center">
                                            <div className="w-5 h-5 rounded-full bg-purple-600/30 border border-purple-500/40 text-[10px] text-purple-300 flex items-center justify-center font-bold">
                                              {user.name.charAt(0)}
                                            </div>
                                            {user.isSpeaking && (
                                              <span className="absolute -top-0.5 -right-0.5 w-2 h-2 rounded-full bg-emerald-400 animate-pulse ring-2 ring-black" />
                                            )}
                                          </div>
                                          <span className="font-sans text-[11px] truncate text-neutral-200">
                                            {user.name}
                                          </span>
                                        </div>
                                        <div className="flex items-center gap-1 text-[10px]">
                                          {user.activityText && (
                                            <span className="font-mono text-[8px] px-1.5 py-0.2 rounded bg-red-500/20 border border-red-500/30 text-red-300 font-bold uppercase tracking-wider">
                                              {user.activityText}
                                            </span>
                                          )}
                                          {user.isMuted ? (
                                            <MicOff className="w-3 h-3 text-red-400" />
                                          ) : (
                                            <div className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
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

            {/* Section: COMMUNITY GROUPS (WhatsApp style taskforces) */}
            {currentCommunity.groups && currentCommunity.groups.length > 0 && (
              <div className="space-y-1 pt-2 border-t border-white/[0.04]">
                <span className="font-mono text-[9px] tracking-[0.2em] text-neutral-400 uppercase font-semibold px-2 block">
                  COMMUNITY GROUPS
                </span>
                {currentCommunity.groups.map((group) => {
                  const isActive = activeCommunityGroupId === group.id;
                  return (
                    <button
                      key={group.id}
                      onClick={() => {
                        setActiveCommunityGroupId(group.id);
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
                            {group.membersCount || 12} members
                          </span>
                        </div>
                      </div>
                      {group.isLocked ? (
                        <Lock className="w-3 h-3 text-neutral-500 shrink-0" />
                      ) : (
                        <span className="font-mono text-[9px] px-1.5 py-0.5 rounded bg-white/[0.04] text-neutral-400 shrink-0">
                          GROUP
                        </span>
                      )}
                    </button>
                  );
                })}
              </div>
            )}
          </div>
        )}

        {/* ── Discord-Style Connected Voice HUD ── */}
        {activeVoiceChannel && (
          <div className="p-3 bg-[#0a0a0f] border-t border-purple-500/20 flex flex-col gap-2">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                <span className="font-mono text-[10px] text-purple-300 uppercase font-semibold truncate">
                  {activeVoiceChannel.name}
                </span>
              </div>
              <button
                onClick={() => setActiveVoiceChannel(null)}
                className="p-1 rounded-md bg-red-500/10 hover:bg-red-500/20 text-red-400 transition"
              >
                <PhoneOff className="w-3 h-3" />
              </button>
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
              onClick={() => setIsVoiceMuted(!isVoiceMuted)}
              className="p-1.5 hover:text-white hover:bg-white/[0.04] rounded-lg transition cursor-pointer"
              title={isVoiceMuted ? 'Unmute Mic' : 'Mute Mic'}
            >
              {isVoiceMuted ? <MicOff className="w-3.5 h-3.5 text-red-400" /> : <Mic className="w-3.5 h-3.5" />}
            </button>
            <button
              onClick={() => setIsVoiceDeafened(!isVoiceDeafened)}
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
      <div className="flex-1 flex flex-col bg-[#050608] relative z-10 overflow-hidden">
        
        {/* Chat Stage Header */}
        <div className="h-14 border-b border-white/[0.06] px-4 flex items-center justify-between bg-[#070709]/80 backdrop-blur-md">
          <div className="flex items-center gap-3">
            <button
              onClick={() => setIsSidebarCollapsed(!isSidebarCollapsed)}
              className="p-1.5 rounded-lg bg-white/[0.04] text-neutral-400 hover:text-white transition"
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
                      {activeCommunityGroup?.name || (activeChannel ? `#${activeChannel.name}` : activeConversation?.name || 'Chat Room')}
                    </p>
                    <p className="font-mono text-[9px] text-neutral-400">
                      {activeConversation?.type === 'group' ? 'Group Settings & Controls' : 'Room Settings & Options'}
                    </p>
                  </div>

                  {/* Group / Room Info */}
                  <button
                    onClick={() => {
                      setShowGroupSettingsMenu(false);
                      const infoDesc = activeConversation?.description || activeChannel?.description || 'Encrypted sovereign communication room';
                      showToast(`ℹ️ ${infoDesc}`);
                    }}
                    className="w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-neutral-300 hover:text-white hover:bg-white/[0.06] transition text-left cursor-pointer"
                  >
                    <Info className="w-4 h-4 text-cyan-400" />
                    <span>Group / Room Info</span>
                  </button>

                  {/* View Member Roster */}
                  <button
                    onClick={() => {
                      setShowGroupSettingsMenu(false);
                      setShowMembersDrawer(true);
                    }}
                    className="w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-neutral-300 hover:text-white hover:bg-white/[0.06] transition text-left cursor-pointer"
                  >
                    <Users className="w-4 h-4 text-purple-400" />
                    <span>View Participants ({activeConversation?.members?.length || (currentCommunity.members?.length ?? 1)})</span>
                  </button>

                  {/* Add / Invite Members */}
                  <button
                    onClick={() => {
                      setShowGroupSettingsMenu(false);
                      if (typeof navigator !== 'undefined' && navigator.clipboard) {
                        navigator.clipboard.writeText(window.location.href);
                      }
                      showToast('🔗 Room invite link copied to clipboard');
                    }}
                    className="w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-neutral-300 hover:text-white hover:bg-white/[0.06] transition text-left cursor-pointer"
                  >
                    <UserPlus className="w-4 h-4 text-emerald-400" />
                    <span>Invite / Add Members</span>
                  </button>

                  {/* Copy Link */}
                  <button
                    onClick={() => {
                      setShowGroupSettingsMenu(false);
                      if (typeof navigator !== 'undefined' && navigator.clipboard) {
                        navigator.clipboard.writeText(window.location.href);
                      }
                      showToast('📋 Link copied to clipboard');
                    }}
                    className="w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-neutral-300 hover:text-white hover:bg-white/[0.06] transition text-left cursor-pointer"
                  >
                    <Copy className="w-4 h-4 text-blue-400" />
                    <span>Copy Room Link</span>
                  </button>

                  {/* Server Roles (if in caucus) */}
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

                  {/* Mute Notifications */}
                  <button
                    onClick={() => {
                      setShowGroupSettingsMenu(false);
                      if (activeConversationId) {
                        toggleMuteConversation(activeConversationId);
                      }
                      showToast('🔔 Notification settings updated');
                    }}
                    className="w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-neutral-300 hover:text-white hover:bg-white/[0.06] transition text-left cursor-pointer"
                  >
                    <VolumeX className="w-4 h-4 text-neutral-400" />
                    <span>Mute Notifications</span>
                  </button>

                  <div className="h-px bg-white/[0.06] my-1" />

                  {/* Clear Chat History */}
                  <button
                    onClick={() => {
                      setShowGroupSettingsMenu(false);
                      showToast('🧹 Room message cache cleared');
                    }}
                    className="w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-amber-400 hover:bg-amber-500/10 transition text-left cursor-pointer"
                  >
                    <Trash2 className="w-4 h-4" />
                    <span>Clear Chat History</span>
                  </button>

                  {/* Leave Group / Delete Conversation */}
                  {activeConversation && (
                    <button
                      onClick={() => {
                        setShowGroupSettingsMenu(false);
                        if (confirm(`Are you sure you want to leave or delete "${activeConversation.name}"?`)) {
                          deleteConversation(activeConversation.id);
                          showToast('🚪 Left conversation');
                        }
                      }}
                      className="w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-rose-400 hover:bg-rose-500/10 transition text-left cursor-pointer"
                    >
                      <LogOut className="w-4 h-4" />
                      <span>{activeConversation.type === 'group' ? 'Leave Group' : 'Delete Chat'}</span>
                    </button>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>

        {/* ── Messages Feed ── */}
        <div className="flex-1 overflow-y-auto p-4 space-y-4">
          {displayedMessages.map((msg) => {
            const isSelf = msg.isSelf;
            const isSnap = Boolean(msg.snap);
            const isSticker = Boolean(msg.stickerUrl);

            // Determine role label and style
            const roleLabel = msg.senderRole || (
              msg.senderUsername === 'yuveer' || msg.senderName?.toLowerCase().includes('yuveer') 
                ? '👑 FOUNDER' 
                : msg.senderRole || null
            );

            return (
              <div
                key={msg.id}
                className={`flex gap-3 max-w-[85%] sm:max-w-[70%] ${
                  isSelf ? 'ml-auto flex-row-reverse' : 'mr-auto'
                }`}
              >
                {/* Avatar */}
                <div className="w-8 h-8 rounded-full bg-neutral-800 text-neutral-300 flex items-center justify-center font-bold text-xs shrink-0">
                  {msg.senderName?.charAt(0) || 'D'}
                </div>

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
                          : roleLabel.includes('SECRETARIAT') || roleLabel.includes('GROUP')
                          ? 'bg-purple-500/10 border border-purple-500/30 text-purple-300'
                          : roleLabel.includes('CHAIR')
                          ? 'bg-cyan-400/10 border border-cyan-400/30 text-cyan-300'
                          : 'bg-white/5 border border-white/10 text-neutral-400'
                      }`}>
                        {roleLabel}
                      </span>
                    )}

                    <span>•</span>
                    <span>{msg.timestamp}</span>
                  </div>

                  {/* Message Bubble */}
                  <div className={`p-3.5 rounded-3xl text-xs sm:text-sm font-sans space-y-2 ${
                    isSelf 
                      ? 'bg-gradient-to-r from-purple-600 to-indigo-600 text-white shadow-md' 
                      : 'bg-[#0e0f14] border border-white/10 text-neutral-200'
                  }`}>
                    
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
                    {!isSnap && !isSticker && (
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
          })}
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

          <form onSubmit={handleSendMessage} className="max-w-5xl mx-auto flex items-center gap-2">
            {/* Action Group: Snap + Sticker */}
            <div className="flex items-center gap-1.5 shrink-0">
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
              >
                <Smile className="w-4 h-4" />
              </button>

              {showEmojiPicker && (
                <div className="absolute bottom-14 right-0 p-3 bg-[#0d1017] border border-white/15 rounded-2xl shadow-2xl grid grid-cols-5 gap-2 z-50">
                  {EMOJI_LIST.map((em) => (
                    <button
                      key={em}
                      type="button"
                      onClick={() => {
                        setMessageText((prev) => prev + em);
                        setShowEmojiPicker(false);
                      }}
                      className="text-lg hover:scale-125 transition p-1 cursor-pointer"
                    >
                      {em}
                    </button>
                  ))}
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
        </div>
      </div>

      {/* ── Discord-Style Members & Roles Drawer ── */}
      <AnimatePresence>
        {showMembersDrawer && (
          <motion.div
            initial={{ width: 0, opacity: 0 }}
            animate={{ width: 260, opacity: 1 }}
            exit={{ width: 0, opacity: 0 }}
            className="h-full bg-[#08090d] border-l border-white/[0.06] flex flex-col z-20 overflow-hidden flex-shrink-0"
          >
            <div className="p-3.5 border-b border-white/[0.06] flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Users className="w-4 h-4 text-purple-400" />
                <h4 className="font-display font-medium text-xs text-white">
                  {activeCommunityGroup ? 'Group Members' : 'Chamber Delegates'}
                </h4>
              </div>
              <button
                onClick={() => setShowMembersDrawer(false)}
                className="p-1 rounded-lg text-neutral-400 hover:text-white transition"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto p-3 space-y-4">
              {/* Category: Leadership / Founder */}
              <div className="space-y-1.5">
                <span className="font-mono text-[9px] uppercase tracking-wider text-amber-400 font-bold px-1 block">
                  👑 FOUNDER & ARCHITECT — 1
                </span>
                <div className="flex items-center gap-2.5 p-2 rounded-xl bg-amber-500/5 border border-amber-500/20">
                  <div className="relative">
                    <div className="w-7 h-7 rounded-full bg-amber-500/20 border border-amber-500/40 text-amber-300 font-bold text-xs flex items-center justify-center">
                      Y
                    </div>
                    <span className="absolute bottom-0 right-0 w-2 h-2 rounded-full bg-emerald-400 ring-2 ring-[#08090d]" />
                  </div>
                  <div className="min-w-0">
                    <div className="flex items-center gap-1.5">
                      <span className="font-sans font-medium text-xs text-white truncate">Yuveer</span>
                      <span className="font-mono text-[8px] px-1 py-0.2 rounded bg-amber-400/20 text-amber-300 font-bold">
                        FOUNDER
                      </span>
                    </div>
                    <span className="font-mono text-[9px] text-neutral-400 truncate block">@yuveer</span>
                  </div>
                </div>
              </div>

              {/* Category: Dais & Secretariat */}
              <div className="space-y-1.5">
                <span className="font-mono text-[9px] uppercase tracking-wider text-purple-400 font-semibold px-1 block">
                  🏛️ SECRETARIAT & DAIS — 2
                </span>
                <div className="flex items-center gap-2.5 p-2 rounded-xl hover:bg-white/[0.03] transition cursor-pointer">
                  <div className="relative">
                    <div className="w-7 h-7 rounded-full bg-purple-600/20 border border-purple-500/30 text-purple-300 font-bold text-xs flex items-center justify-center">
                      S
                    </div>
                    <span className="absolute bottom-0 right-0 w-2 h-2 rounded-full bg-emerald-400 ring-2 ring-[#08090d]" />
                  </div>
                  <div className="min-w-0">
                    <div className="flex items-center gap-1.5">
                      <span className="font-sans font-medium text-xs text-white truncate">UN Secretariat</span>
                      <span className="font-mono text-[8px] px-1 py-0.2 rounded bg-purple-500/20 text-purple-300">
                        SECRETARIAT
                      </span>
                    </div>
                    <span className="font-mono text-[9px] text-neutral-400 truncate block">@un_secretariat</span>
                  </div>
                </div>

                <div className="flex items-center gap-2.5 p-2 rounded-xl hover:bg-white/[0.03] transition cursor-pointer">
                  <div className="relative">
                    <div className="w-7 h-7 rounded-full bg-cyan-600/20 border border-cyan-500/30 text-cyan-300 font-bold text-xs flex items-center justify-center">
                      C
                    </div>
                    <span className="absolute bottom-0 right-0 w-2 h-2 rounded-full bg-neutral-500 ring-2 ring-[#08090d]" />
                  </div>
                  <div className="min-w-0">
                    <div className="flex items-center gap-1.5">
                      <span className="font-sans font-medium text-xs text-white truncate">Council Chair</span>
                      <span className="font-mono text-[8px] px-1 py-0.2 rounded bg-cyan-500/20 text-cyan-300">
                        CHAIR
                      </span>
                    </div>
                    <span className="font-mono text-[9px] text-neutral-400 truncate block">@chair_dais</span>
                  </div>
                </div>
              </div>

              {/* Category: Delegates / Members */}
              <div className="space-y-1.5">
                <span className="font-mono text-[9px] uppercase tracking-wider text-neutral-400 font-semibold px-1 block">
                  ONLINE DELEGATES — 4
                </span>
                {[
                  { name: 'Elena Rostova', handle: '@elena_press', role: 'PRESS', initial: 'E', color: 'bg-emerald-500/20 text-emerald-300' },
                  { name: 'Marcus Sterling', handle: '@marcus_delegate', role: 'DELEGATE', initial: 'M', color: 'bg-white/10 text-neutral-300' },
                  { name: 'Sovereign Ledger', handle: '@ledger_bot', role: 'BOT', initial: '🤖', color: 'bg-blue-500/20 text-blue-300' },
                  { name: 'Aarav Sharma', handle: '@aarav_in', role: 'DELEGATE', initial: 'A', color: 'bg-white/10 text-neutral-300' }
                ].map((member) => (
                  <div 
                    key={member.handle}
                    onClick={() => {
                      setShowMembersDrawer(false);
                      showToast(`Opened envoy dispatch with ${member.name}`);
                    }}
                    className="flex items-center gap-2.5 p-2 rounded-xl hover:bg-white/[0.04] transition cursor-pointer"
                  >
                    <div className="relative">
                      <div className={`w-7 h-7 rounded-full border border-white/10 font-bold text-xs flex items-center justify-center ${member.color}`}>
                        {member.initial}
                      </div>
                      <span className="absolute bottom-0 right-0 w-2 h-2 rounded-full bg-emerald-400 ring-2 ring-[#08090d]" />
                    </div>
                    <div className="min-w-0">
                      <div className="flex items-center gap-1.5">
                        <span className="font-sans font-medium text-xs text-white truncate">{member.name}</span>
                        <span className="font-mono text-[8px] px-1 py-0.2 rounded bg-white/5 border border-white/10 text-neutral-400">
                          {member.role}
                        </span>
                      </div>
                      <span className="font-mono text-[9px] text-neutral-400 truncate block">{member.handle}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </motion.div>
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
                  placeholder="e.g. @yuveerji or 9876543210"
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
              className="w-full max-w-md rounded-[2.5rem] bg-[#090a0f] border border-white/10 p-6 shadow-2xl space-y-4"
            >
              <div className="flex items-center justify-between border-b border-white/[0.06] pb-3">
                <h3 className="font-display font-medium text-sm text-white">
                  Establish Sovereign Caucus Chamber
                </h3>
                <button onClick={() => setShowCreateCaucusModal(false)} className="p-1 rounded-lg text-neutral-400 hover:text-white">
                  <X className="w-4 h-4" />
                </button>
              </div>

              <form onSubmit={handleCreateCaucus} className="space-y-4">
                <input
                  type="text"
                  value={newCaucusName}
                  onChange={(e) => setNewCaucusName(e.target.value)}
                  placeholder="Caucus Name (e.g. ECOSOC Plenary)"
                  className="w-full px-4 py-2.5 rounded-2xl bg-white/[0.04] border border-white/10 text-xs text-white"
                  autoFocus
                />
                <button
                  type="submit"
                  disabled={!newCaucusName.trim()}
                  className="w-full py-3 rounded-2xl bg-purple-600 hover:bg-purple-500 text-white font-bold text-xs"
                >
                  Establish Caucus
                </button>
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
                    placeholder="e.g. Yuveer Chhatwani's call"
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
                  { id: 'media', label: 'Media' },
                  { id: 'docs', label: 'Docs' },
                  { id: 'links', label: 'Links' },
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

              {/* Gallery Content grouped by date (Yesterday - 5 September 2026) */}
              <div className="flex-1 overflow-y-auto p-4 space-y-4">
                {/* Date Group Header */}
                <div className="sticky top-0 bg-[#0e1017]/95 backdrop-blur-sm py-1 z-10">
                  <span className="font-display text-xs text-neutral-300 font-medium">
                    Yesterday - 5 September 2026
                  </span>
                </div>

                {mediaGalleryTab === 'media' && (
                  <div className="grid grid-cols-3 sm:grid-cols-4 gap-2">
                    {[
                      { id: 'm1', label: 'Plenary Floor Resolution', color: 'from-purple-900 to-indigo-950', icon: '📜' },
                      { id: 'm2', label: 'Dais Sovereign Seal', color: 'from-amber-900 to-stone-900', icon: '⚖️' },
                      { id: 'm3', label: 'G-77 Treaty Draft Snapshot', color: 'from-emerald-950 to-teal-900', icon: '🌐' },
                      { id: 'm4', label: 'Security Briefing Graph', color: 'from-blue-950 to-slate-900', icon: '📊' },
                      { id: 'm5', label: 'Delegate Credential QR', color: 'from-cyan-950 to-indigo-950', icon: '🛡️' },
                      { id: 'm6', label: 'Crisis War Room Dispatch', color: 'from-rose-950 to-neutral-900', icon: '⚡' },
                    ].map((item) => (
                      <div
                        key={item.id}
                        className={`aspect-square rounded-xl bg-gradient-to-tr ${item.color} border border-white/10 flex flex-col items-center justify-center p-2 relative group overflow-hidden cursor-pointer hover:border-emerald-400/50 transition`}
                      >
                        <span className="text-3xl group-hover:scale-110 transition">{item.icon}</span>
                        <span className="font-sans text-[10px] text-neutral-300 text-center truncate w-full mt-2 font-medium">
                          {item.label}
                        </span>
                      </div>
                    ))}
                  </div>
                )}

                {mediaGalleryTab === 'docs' && (
                  <div className="space-y-2">
                    {[
                      { title: 'UN_Resolution_418_Draft_v3.pdf', size: '2.4 MB', date: '5 Sep 2026' },
                      { title: 'Bilateral_Pact_Framework.docx', size: '840 KB', date: '5 Sep 2026' },
                      { title: 'Sovereign_Protocol_Manifest.pdf', size: '1.1 MB', date: '4 Sep 2026' },
                    ].map((doc, i) => (
                      <div
                        key={i}
                        className="flex items-center justify-between p-3 rounded-2xl bg-white/[0.03] border border-white/[0.06] hover:bg-white/[0.06] transition cursor-pointer"
                      >
                        <div className="flex items-center gap-3">
                          <div className="w-9 h-9 rounded-xl bg-purple-500/20 text-purple-300 flex items-center justify-center shrink-0">
                            <FileText className="w-5 h-5" />
                          </div>
                          <div>
                            <h5 className="font-display font-medium text-xs text-white">{doc.title}</h5>
                            <span className="font-mono text-[9px] text-neutral-400">{doc.size} • {doc.date}</span>
                          </div>
                        </div>
                        <ExternalLink className="w-4 h-4 text-neutral-400 hover:text-white" />
                      </div>
                    ))}
                  </div>
                )}

                {mediaGalleryTab === 'links' && (
                  <div className="space-y-2">
                    {[
                      { title: 'Zenvitra Sovereign Dais Transmission', url: 'https://zenvitra.gov/dais/live-418', date: '5 Sep 2026' },
                      { title: 'Global Plenary Draft Resolution Workbench', url: 'https://zenvitra.gov/docs/res-418', date: '5 Sep 2026' },
                      { title: 'G-77 Sovereign Multilateral Agreement', url: 'https://zenvitra.gov/treaties/g77-2026', date: '4 Sep 2026' },
                    ].map((lnk, i) => (
                      <a
                        key={i}
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
                          </div>
                        </div>
                        <ExternalLink className="w-4 h-4 text-neutral-400 shrink-0 ml-2" />
                      </a>
                    ))}
                  </div>
                )}
              </div>
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
          setCommunities((prev) =>
            prev.map((c) => (c.id === currentCommunity.id ? { ...c, roles: newRoles } : c))
          );
          showToast('Server roles updated');
        }}
        onUpdateMembers={(newMembers) => {
          setCommunities((prev) =>
            prev.map((c) => (c.id === currentCommunity.id ? { ...c, members: newMembers } : c))
          );
          showToast('Member role assignments updated');
        }}
        onToast={showToast}
      />
    </div>
  );
}
