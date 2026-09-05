'use client';

import React, { useState, useRef, useEffect, useMemo, useCallback } from 'react';
import { 
  Phone, 
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
  Sticker
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useZenChat } from '@/context/ZenChatPlatformContext';
import { useZenPulse } from '@/context/ZenPulsePlatformContext';
import { useAuth } from '@/context/AuthContext';
import { ChatMessage, ChatConversation, ChatCommunity, ChatChannel, GlimpseSnap } from '@/types/chat';
import { ZenNotesRow } from '@/components/chat/ZenNotesRow';
import { GlimpseSnapModal } from '@/components/chat/GlimpseSnapModal';
import { GlimpseViewerModal } from '@/components/chat/GlimpseViewerModal';
import { NewChatActionModal } from '@/components/chat/NewChatActionModal';
import { StickersDrawer } from '@/components/chat/StickersDrawer';
import { ZenChatSettingsModal } from '@/components/chat/ZenChatSettingsModal';

/* ── Seeded Sovereign Communities (Discord-style) ── */
const DEFAULT_COMMUNITIES: ChatCommunity[] = [
  {
    id: 'comm-direct',
    name: 'Direct Envoys & DMs',
    icon: '💬',
    badge: 'DMs',
    channels: []
  },
  {
    id: 'comm-un-plenary',
    name: 'Global Plenary Council',
    icon: '🏛️',
    badge: 'UN #418',
    channels: [
      { id: 'ch-general', name: 'general-assembly', type: 'text', description: 'Multilateral sovereign debates & floor speeches' },
      { id: 'ch-briefs', name: 'diplomatic-wires', type: 'text', description: 'Breaking dispatches from active summits' },
      { id: 'ch-resolutions', name: 'policy-drafts', type: 'text', description: 'Collaborative treaty and draft resolution workbench' },
      { id: 'ch-voice-plenary', name: 'Chamber Alpha [Voice]', type: 'voice', description: 'Live floor microphone & speaking delegates', activeVoiceUsers: ['yuveer'] },
      { id: 'ch-voice-warroom', name: 'Crisis War Room [Voice]', type: 'voice', description: 'Immediate response caucus chamber', activeVoiceUsers: [] }
    ]
  },
  {
    id: 'comm-crisis-alpha',
    name: 'Sovereign Crisis Chamber',
    icon: '⚡',
    badge: 'CRISIS',
    channels: [
      { id: 'ch-crisis-general', name: 'war-room-text', type: 'text', description: 'Fast-paced crisis directive broadcast' },
      { id: 'ch-crisis-intel', name: 'intelligence-briefs', type: 'text', description: 'Encrypted intelligence leaks and evidence' },
      { id: 'ch-voice-crisis', name: 'High Command [Voice]', type: 'voice', description: 'Live emergency audio command', activeVoiceUsers: [] }
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
  } = useZenChat();

  const { profiles } = useZenPulse();

  /* Local UI State */
  const [communities, setCommunities] = useState<ChatCommunity[]>(DEFAULT_COMMUNITIES);
  const [selectedCommunityId, setSelectedCommunityId] = useState<string>('comm-direct');
  const [activeChannelId, setActiveChannelId] = useState<string>('ch-general');
  const [activeVoiceChannel, setActiveVoiceChannel] = useState<ChatChannel | null>(null);
  
  const [messageText, setMessageText] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [activeCategoryFilter, setActiveCategoryFilter] = useState<'all' | 'primary' | 'requests' | 'general' | 'broadcasts'>('primary');
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
  const [showMembersDrawer, setShowMembersDrawer] = useState(false);
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const [showStickerDrawer, setShowStickerDrawer] = useState(false);
  const [replyingTo, setReplyingTo] = useState<ChatMessage | null>(null);

  /* Modals */
  const [showSettingsModal, setShowSettingsModal] = useState(false);
  const [showNewChatActionModal, setShowNewChatActionModal] = useState(false);
  const [showGlimpseSnapModal, setShowGlimpseSnapModal] = useState(false);
  const [activeViewingSnap, setActiveViewingSnap] = useState<{ snap: GlimpseSnap; messageId: string } | null>(null);
  const [showDirectCallModal, setShowDirectCallModal] = useState(false);
  const [showCreateCaucusModal, setShowCreateCaucusModal] = useState(false);
  const [showCreateChannelModal, setShowCreateChannelModal] = useState(false);

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

  // Scroll to bottom on message change
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [activeMessages]);

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
    if (selectedCommunityId === 'comm-direct') return null;
    return currentCommunity.channels.find((ch) => ch.id === activeChannelId) || currentCommunity.channels[0] || null;
  }, [currentCommunity, activeChannelId, selectedCommunityId]);

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

    sendMessage(
      messageText.trim(),
      undefined,
      replyingTo ? {
        id: replyingTo.id,
        senderName: replyingTo.senderName,
        snippet: replyingTo.content.slice(0, 80),
      } : undefined
    );

    setMessageText('');
    setReplyingTo(null);
    setShowEmojiPicker(false);
  };

  /* AI Copilot Prompt Injector */
  const handleAiPromptClick = (prompt: string) => {
    sendMessage(prompt, undefined, undefined);
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
          sendVoiceNote(base64Audio, recordingSeconds || 5);
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
      sendVoiceNote('data:audio/mp3;base64,mock', recordingSeconds || 6);
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
      clean === 'un_secretariat' ||
      clean === 'zen_ai';

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
      channels: [
        { id: `ch-${Date.now()}-1`, name: 'general-floor', type: 'text', description: newCaucusDescription || 'General caucus discourse' },
        { id: `ch-${Date.now()}-2`, name: 'Chamber Alpha [Voice]', type: 'voice', description: 'Live audio floor' }
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
    <div className="relative h-screen w-full bg-[#050608] text-white flex overflow-hidden font-sans select-none">
      
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
          1. DISCORD-STYLE SERVER / CAUCUS RAIL (FAR-LEFT)
          ══════════════════════════════════════════════════════════════ */}
      <div className="w-16 sm:w-18 bg-[#030406] border-r border-white/[0.06] flex flex-col items-center py-4 gap-3 z-30 flex-shrink-0">
        {communities.map((comm) => {
          const isSelected = selectedCommunityId === comm.id;
          return (
            <button
              key={comm.id}
              onClick={() => {
                setSelectedCommunityId(comm.id);
                if (comm.channels.length > 0) {
                  setActiveChannelId(comm.channels[0].id);
                }
              }}
              title={comm.name}
              className={`relative group w-11 h-11 rounded-2xl flex items-center justify-center text-lg transition-all duration-300 cursor-pointer ${
                isSelected 
                  ? 'bg-gradient-to-tr from-purple-600 to-indigo-600 text-white rounded-[18px] shadow-[0_0_20px_rgba(168,85,247,0.4)]' 
                  : 'bg-white/[0.04] hover:bg-white/[0.08] text-neutral-300 hover:text-white rounded-2xl hover:rounded-[18px]'
              }`}
            >
              {isSelected && (
                <div className="absolute -left-3 top-1/2 -translate-y-1/2 w-1.5 h-7 bg-white rounded-r-full shadow-md" />
              )}
              <span>{comm.icon}</span>
            </button>
          );
        })}

        <div className="w-8 h-px bg-white/[0.08] my-1" />

        {/* Add Caucus / Server Button */}
        <button
          onClick={() => setShowCreateCaucusModal(true)}
          title="Establish New Caucus / Chamber"
          className="w-11 h-11 rounded-2xl bg-white/[0.03] hover:bg-white/[0.08] border border-white/[0.08] hover:border-purple-500/40 text-neutral-400 hover:text-purple-300 flex items-center justify-center transition-all cursor-pointer"
        >
          <Plus className="w-4 h-4" />
        </button>

        {/* Direct Call / Dialer Button */}
        <button
          onClick={() => setShowDirectCallModal(true)}
          title="Direct Dial / Handle Call"
          className="w-11 h-11 rounded-2xl bg-white/[0.03] hover:bg-purple-500/15 border border-white/[0.08] hover:border-purple-500/30 text-neutral-400 hover:text-purple-300 flex items-center justify-center transition-all shadow-sm cursor-pointer"
        >
          <Phone className="w-4 h-4" />
        </button>
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
                title="ZenChat Settings & Profile"
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
            {/* GlimpseScore Badge */}
            <div 
              className="flex items-center gap-1 px-2.5 py-1 rounded-full bg-amber-500/10 border border-amber-500/30 text-amber-300 font-mono text-[10px] font-bold shadow-sm"
              title={`GlimpseScore: ${glimpseScore.sent + glimpseScore.received} (Sent: ${glimpseScore.sent} • Received: ${glimpseScore.received} • Streak: ${glimpseScore.streak}🔥)`}
            >
              <Flame className="w-3 h-3 text-amber-400 fill-amber-400" />
              <span>{glimpseScore.sent + glimpseScore.received}</span>
            </div>

            {/* If in caucus/community, show Add Channel button; if in DMs, show New Message button */}
            {selectedCommunityId === 'comm-direct' ? (
              <button
                onClick={() => setShowNewChatActionModal(true)}
                className="p-1.5 rounded-xl bg-purple-600 hover:bg-purple-500 text-white transition shadow-sm cursor-pointer flex items-center justify-center hover:scale-105 active:scale-95"
                title="New Message or Group"
              >
                <Plus className="w-4 h-4 stroke-[2.5]" />
              </button>
            ) : (
              <button
                onClick={() => setShowCreateChannelModal(true)}
                className="p-1.5 rounded-xl bg-white/[0.04] hover:bg-white/[0.1] text-neutral-300 hover:text-white transition shadow-sm cursor-pointer flex items-center justify-center hover:scale-105 active:scale-95"
                title="Create Channel"
              >
                <Plus className="w-4 h-4 stroke-[2.5]" />
              </button>
            )}
          </div>
        </div>

        {/* ── Direct Messages View with Instagram Notes ── */}
        {selectedCommunityId === 'comm-direct' ? (
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
              {filteredConversations.map((conv) => {
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
              })}
            </div>
          </div>
        ) : (
          /* Discord-Style Channel Hierarchy */
          <div className="flex-1 flex flex-col overflow-y-auto p-3 space-y-6">
            <div className="space-y-1">
              <span className="font-mono text-[9px] tracking-[0.2em] text-neutral-400 uppercase font-semibold px-2 block">
                TEXT CHANNELS
              </span>
              {currentCommunity.channels.filter((c) => c.type === 'text').map((ch) => {
                const isActive = activeChannelId === ch.id;
                return (
                  <button
                    key={ch.id}
                    onClick={() => setActiveChannelId(ch.id)}
                    className={`w-full flex items-center gap-2 px-2.5 py-1.5 rounded-xl text-xs transition text-left cursor-pointer ${
                      isActive 
                        ? 'bg-white/[0.08] text-white font-medium shadow-sm' 
                        : 'text-neutral-400 hover:bg-white/[0.03] hover:text-neutral-200'
                    }`}
                  >
                    <Hash className="w-3.5 h-3.5 text-neutral-500" />
                    <span className="truncate">{ch.name}</span>
                  </button>
                );
              })}
            </div>

            <div className="space-y-1">
              <span className="font-mono text-[9px] tracking-[0.2em] text-neutral-400 uppercase font-semibold px-2 block">
                VOICE CHANNELS
              </span>
              {currentCommunity.channels.filter((c) => c.type === 'voice').map((ch) => {
                const isConnected = activeVoiceChannel?.id === ch.id;
                return (
                  <div key={ch.id} className="space-y-1">
                    <button
                      onClick={() => handleJoinVoiceChannel(ch)}
                      className={`w-full flex items-center justify-between px-2.5 py-2 rounded-xl text-xs transition text-left cursor-pointer ${
                        isConnected 
                          ? 'bg-purple-500/20 border border-purple-500/30 text-purple-200 font-medium' 
                          : 'text-neutral-400 hover:bg-white/[0.03] hover:text-neutral-200'
                      }`}
                    >
                      <div className="flex items-center gap-2 truncate">
                        <Volume2 className={`w-3.5 h-3.5 ${isConnected ? 'text-purple-400 animate-pulse' : 'text-neutral-500'}`} />
                        <span className="truncate">{ch.name}</span>
                      </div>
                      <span className="font-mono text-[9px] px-1.5 py-0.5 rounded bg-white/[0.04] text-neutral-400">
                        {isConnected ? 'LIVE' : 'JOIN'}
                      </span>
                    </button>
                  </div>
                );
              })}
            </div>
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
              title="ZenChat Settings & Profile"
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
                  <Hash className="w-4 h-4 text-neutral-400" />
                </div>
                <div>
                  <h3 className="font-display font-medium text-xs sm:text-sm text-white flex items-center gap-1.5">
                    <span>#{activeChannel?.name || 'general'}</span>
                    <span className="font-mono text-[9px] px-1.5 py-0.5 rounded bg-purple-500/10 border border-purple-500/30 text-purple-300 font-normal">
                      {currentCommunity.badge || 'CHAMBER'}
                    </span>
                  </h3>
                  <span className="font-mono text-[10px] text-neutral-400 block truncate max-w-xs sm:max-w-md">
                    {activeChannel?.description || `${currentCommunity.name} floor wire`}
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

          <div className="flex items-center gap-2">
            <button
              onClick={() => startCall(activeConversationId || 'conv-zen-ai', 'voice')}
              className="p-2 rounded-xl bg-white/[0.03] hover:bg-purple-500/20 text-neutral-300 hover:text-purple-300 transition cursor-pointer"
              title="Start Voice Call"
            >
              <Phone className="w-4 h-4" />
            </button>
            <button
              onClick={() => startCall(activeConversationId || 'conv-zen-ai', 'video')}
              className="p-2 rounded-xl bg-white/[0.03] hover:bg-purple-500/20 text-neutral-300 hover:text-purple-300 transition cursor-pointer"
              title="Start Video Call"
            >
              <Video className="w-4 h-4" />
            </button>
            <button
              onClick={() => setShowMembersDrawer(!showMembersDrawer)}
              className="p-2 rounded-xl bg-white/[0.03] hover:bg-white/[0.08] text-neutral-300 hover:text-white transition cursor-pointer"
              title="Inspect Caucus Delegates"
            >
              <Users className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* ── Messages Feed ── */}
        <div className="flex-1 overflow-y-auto p-4 space-y-4">
          {activeMessages.map((msg) => {
            const isSelf = msg.isSelf;
            const isSnap = Boolean(msg.snap);
            const isSticker = Boolean(msg.stickerUrl);

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
                  {/* Sender Name & Timestamp */}
                  <div className={`flex items-center gap-2 font-mono text-[10px] text-neutral-400 ${
                    isSelf ? 'justify-end' : 'justify-start'
                  }`}>
                    <span>{msg.senderName}</span>
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

        {/* AI Co-Pilot Suggestion Chips (Only in Zen AI Co-Delegate channel) */}
        {selectedCommunityId === 'comm-direct' && activeConversationId === 'conv-zen-ai' && (
          <div className="px-4 py-2 bg-[#06070a] border-t border-white/[0.04] flex items-center gap-2 overflow-x-auto">
            <span className="font-mono text-[9px] text-purple-400 flex items-center gap-1 flex-shrink-0">
              <Sparkles className="w-3 h-3" /> AI CO-PILOT:
            </span>
            {[
              '📜 Draft Treaty Clause on Youth Transit',
              '🎙️ Suggest Point of Information (POI)',
              '💎 Sovereign Take-Rate Breakdown',
              '⚖️ Verify UN Precedents'
            ].map((prompt, idx) => (
              <button
                key={idx}
                onClick={() => handleAiPromptClick(prompt)}
                className="px-3 py-1 rounded-xl bg-white/[0.03] hover:bg-purple-500/10 border border-white/[0.06] hover:border-purple-500/30 text-[11px] text-neutral-300 hover:text-purple-200 transition flex-shrink-0 cursor-pointer"
              >
                {prompt}
              </button>
            ))}
          </div>
        )}

        {/* Rich Input Bar */}
        <div className="p-4 bg-[#070709] border-t border-white/[0.06] z-10 relative">
          
          {/* Stickers Drawer */}
          <StickersDrawer
            isOpen={showStickerDrawer}
            onClose={() => setShowStickerDrawer(false)}
            onSelectSticker={(url, name) => sendSticker(url, name)}
          />

          <form onSubmit={handleSendMessage} className="relative flex items-center gap-2">
            
            {/* Glimpse Snap Camera Trigger */}
            <button
              type="button"
              onClick={() => setShowGlimpseSnapModal(true)}
              className="p-3 rounded-2xl bg-white/[0.03] hover:bg-purple-500/20 border border-white/[0.08] hover:border-purple-500/30 text-neutral-300 hover:text-purple-300 transition flex-shrink-0 cursor-pointer"
              title="Send Glimpse Snap / Instant"
            >
              <Camera className="w-4 h-4" />
            </button>

            {/* Sticker Drawer Trigger */}
            <button
              type="button"
              onClick={() => setShowStickerDrawer(!showStickerDrawer)}
              className="p-3 rounded-2xl bg-white/[0.03] hover:bg-purple-500/20 border border-white/[0.08] hover:border-purple-500/30 text-neutral-300 hover:text-purple-300 transition flex-shrink-0 cursor-pointer"
              title="Stickers Library"
            >
              <Sparkles className="w-4 h-4" />
            </button>

            {/* Main Text Input */}
            <div className="flex-1 relative rounded-2xl bg-white/[0.03] border border-white/[0.08] focus-within:border-purple-500/40 transition">
              <input
                type="text"
                value={messageText}
                onChange={(e) => setMessageText(e.target.value)}
                placeholder="Dispatch treaty clause, resolution amendment, or message..."
                className="w-full pl-4 pr-10 py-3 bg-transparent text-xs sm:text-sm text-white placeholder-neutral-500 focus:outline-none"
              />

              <button
                type="button"
                onClick={() => setShowEmojiPicker(!showEmojiPicker)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-neutral-400 hover:text-white transition"
              >
                <Smile className="w-4 h-4" />
              </button>

              {showEmojiPicker && (
                <div className="absolute bottom-14 right-0 p-3 bg-[#0a0a0f] border border-white/10 rounded-2xl shadow-2xl grid grid-cols-5 gap-2 z-50">
                  {EMOJI_LIST.map((em) => (
                    <button
                      key={em}
                      type="button"
                      onClick={() => {
                        setMessageText((prev) => prev + em);
                        setShowEmojiPicker(false);
                      }}
                      className="text-lg hover:scale-125 transition p-1"
                    >
                      {em}
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Voice Recorder */}
            {isRecordingVoice ? (
              <button
                type="button"
                onClick={stopRecordingAudio}
                className="p-3 rounded-2xl bg-red-600 hover:bg-red-700 text-white font-medium transition shadow-md flex items-center gap-2 flex-shrink-0 animate-pulse"
              >
                <span className="w-2 h-2 rounded-full bg-white animate-ping" />
                <span className="font-mono text-xs">{recordingSeconds}s • SEND</span>
              </button>
            ) : (
              <button
                type="button"
                onClick={startRecordingAudio}
                className="p-3 rounded-2xl bg-white/[0.03] hover:bg-purple-500/20 border border-white/[0.08] hover:border-purple-500/40 text-neutral-300 hover:text-purple-300 transition flex-shrink-0 cursor-pointer"
                title="Record Voice Note"
              >
                <Mic className="w-4 h-4" />
              </button>
            )}

            {/* Send Button */}
            <button
              type="submit"
              disabled={!messageText.trim()}
              className="p-3 rounded-2xl bg-gradient-to-r from-purple-500 to-indigo-600 hover:opacity-90 disabled:opacity-30 text-white font-medium transition shadow-md flex-shrink-0 cursor-pointer"
            >
              <Send className="w-4 h-4" />
            </button>
          </form>
        </div>
      </div>

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
                  Establish Discord-Style Caucus Server
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

      {/* ── ZenChat Settings Modal (WhatsApp Style) ── */}
      <ZenChatSettingsModal
        isOpen={showSettingsModal}
        onClose={() => setShowSettingsModal(false)}
      />
    </div>
  );
}
