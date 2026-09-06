'use client';

import React, { createContext, useContext, useState, useEffect, useMemo, useCallback } from 'react';
import { useAuth } from '@/context/AuthContext';
import { 
  ChatConversation, 
  ChatMessage, 
  ChatMember, 
  ActiveCallState, 
  ChatCall, 
  ChatStatus,
  ZenNote,
  ZenNoteSong,
  ZenNoteColor,
  GlimpseSnap,
  GlimpseScore,
  CustomSticker
} from '@/types/chat';

interface ZenChatContextType {
  conversations: ChatConversation[];
  activeConversationId: string | null;
  activeConversation: ChatConversation | undefined;
  activeMessages: ChatMessage[];
  messages: ChatMessage[];
  activeCall: ActiveCallState;
  calls: ChatCall[];
  statuses: ChatStatus[];

  /* Selection */
  setActiveConversationId: (id: string | null) => void;

  /* Messages */
  messagesMap: Record<string, ChatMessage[]>;
  sendMessage: (content: string, attachments?: any[], replyTo?: any, targetConvId?: string, senderRole?: string) => void;
  sendVoiceNote: (durationOrUrl: number | string, durationSeconds?: number, targetConvId?: string) => void;
  sendSnap: (snapData: { mediaUrl: string; caption?: string; stickers?: string[]; isOneView?: boolean; audience?: 'all' | 'followers' | 'close_friends' }, targetConvId?: string) => void;
  openSnap: (messageId: string, targetConvId?: string) => void;
  sendSticker: (stickerUrl: string, name?: string, targetConvId?: string) => void;
  editMessage: (messageId: string, newContent: string, targetConvId?: string) => void;
  deleteMessage: (messageId: string, targetConvId?: string) => void;
  reactToMessage: (messageId: string, emoji: string, targetConvId?: string) => void;
  addReaction: (messageId: string, emoji: string, targetConvId?: string) => void;
  pinMessage: (messageId: string, targetConvId?: string) => void;

  /* Conversations & Groups & Broadcasts */
  createDirectChat: (memberOrHandle: ChatMember | string, contactName?: string) => string;
  createDirectMessage: (memberOrHandle: ChatMember | string, contactName?: string) => string;
  createGroupChat: (name: string, members: ChatMember[], description?: string) => string;
  createGroup: (name: string, description?: string, memberUsernames?: string[]) => string;
  createBroadcastList: (name: string, memberUsernames: string[]) => string;
  startChatWithNumber: (phoneNumber: string, contactName?: string) => string;
  togglePinConversation: (conversationId: string) => void;
  toggleMuteConversation: (conversationId: string) => void;
  deleteConversation: (conversationId: string) => void;

  /* Zen Notes (Instagram-style Thought Bubbles) */
  zenNotes: ZenNote[];
  postZenNote: (text: string, moodEmoji?: string, locationBadge?: string, song?: ZenNoteSong, colorTheme?: ZenNoteColor) => void;
  deleteZenNote: (id: string) => void;

  /* Glimpses & GlimpseScore */
  glimpseScore: GlimpseScore;

  /* Stickers */
  customStickers: CustomSticker[];
  createCustomSticker: (name: string, url: string) => void;

  /* Calls & Dialer */
  startCall: (conversationId: string, callType?: 'voice' | 'video') => void;
  startDirectNumberCall: (phoneNumberOrHandle: string, name: string, callType: 'voice' | 'video') => void;
  endCall: () => void;
  toggleMuteCall: () => void;
  toggleCallMute: () => void;
  toggleDeafenCall: () => void;
  toggleCallDeafen: () => void;
  toggleScreenShare: () => void;
  toggleCallScreenShare: () => void;
  clearCallHistory: () => void;

  /* Statuses (WhatsApp style) */
  postStatus: (text: string, mediaUrl?: string) => void;

  /* UI Filters & Modals */
  activeFilter: string;
  setActiveFilter: (filter: string) => void;
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  isCreateModalOpen: boolean;
  setIsCreateModalOpen: (open: boolean) => void;

  /* User Info */
  currentUser: { id: string; name: string; username: string };
  currentUserId: string;
  currentUserName: string;
  currentUserUsername: string;
}

const ZenChatContext = createContext<ZenChatContextType | undefined>(undefined);

const LS_CONVERSATIONS = 'zenvitra_chat_conversations_v10_noai';
const LS_MESSAGES = 'zenvitra_chat_messages_v10_noai';
const LS_CALLS = 'zenvitra_chat_calls_v10_noai';
const LS_STATUSES = 'zenvitra_chat_statuses_v10_noai';
const LS_NOTES = 'zenvitra_chat_zen_notes_v10_noai';
const LS_GLIMPSE_SCORE = 'zenvitra_glimpse_score_v10_noai';
const LS_STICKERS = 'zenvitra_custom_stickers_v10_noai';

/* Default system sticker library */
const DEFAULT_STICKERS: CustomSticker[] = [
  { id: 'stk-1', name: 'Sovereign Ratified', url: '📜', category: 'treaty' },
  { id: 'stk-2', name: 'Veto Strike', url: '⚡', category: 'parliament' },
  { id: 'stk-3', name: 'Quorum Reached', url: '🏛️', category: 'assembly' },
  { id: 'stk-4', name: 'Direct Grant', url: '💎', category: 'impact' },
  { id: 'stk-5', name: 'Zero Noise', url: '🛡️', category: 'privacy' },
  { id: 'stk-6', name: 'Based Speech', url: '🔥', category: 'reactions' },
  { id: 'stk-7', name: 'Point of Info', url: '🎙️', category: 'speech' },
  { id: 'stk-8', name: 'Consensus Check', url: '🤝', category: 'diplomacy' },
];

export function ZenChatPlatformProvider({ children }: { children: React.ReactNode }) {
  const { user, profile, isMockMode } = useAuth();

  const currentUserId = profile?.id || user?.id || profile?.email || 'local_user';
  const currentUserName = profile?.display_name || user?.name || 'You';
  const currentUserUsername = (profile?.username || 'you').replace(/^@/, '').toLowerCase();

  const [conversations, setConversations] = useState<ChatConversation[]>([]);
  const [messagesMap, setMessagesMap] = useState<Record<string, ChatMessage[]>>({});
  const [activeConversationId, setActiveConversationId] = useState<string | null>('conv-zenvitra-hq');
  const [calls, setCalls] = useState<ChatCall[]>([]);
  const [statuses, setStatuses] = useState<ChatStatus[]>([]);
  const [zenNotes, setZenNotes] = useState<ZenNote[]>([]);
  const [glimpseScore, setGlimpseScore] = useState<GlimpseScore>({ sent: 48, received: 64, streak: 7 });
  const [customStickers, setCustomStickers] = useState<CustomSticker[]>(DEFAULT_STICKERS);

  /* UI state */
  const [activeFilter, setActiveFilter] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);

  const [activeCall, setActiveCall] = useState<ActiveCallState>({
    isActive: false,
    conversationId: '',
    conversationName: '',
    callType: 'voice',
    isMuted: false,
    isDeafened: false,
    isScreenSharing: false,
    durationSeconds: 0,
  });

  // Local storage persistence with safe parse and strict zero fake data rule
  useEffect(() => {
    try {
      const safeParse = (val: string | null, fallback: any) => {
        if (!val || !val.trim() || val === 'undefined' || val === 'null') return fallback;
        try { return JSON.parse(val); } catch (_) { return fallback; }
      };

      const defaultHumanConversation: ChatConversation[] = [
        {
          id: 'conv-zenvitra-hq',
          type: 'group',
          name: '🏛️ Zenvitra Sovereign Assembly',
          handle: 'zenvitra_hq',
          avatar: '',
          isAi: false,
          unreadCount: 0,
          isPinned: true,
          lastMessage: {
            text: 'Welcome to Zenvitra Chat. Connect with peer delegates, caucus, and dispatch secure communications.',
            timestamp: 'Just now',
            senderName: 'Zenvitra Secretariat',
          },
          members: [
            { id: 'sec-1', name: 'Zenvitra Secretariat', username: 'zenvitra_sec', role: 'Plenary Lead', isAi: false, status: 'online' }
          ],
          createdAt: new Date().toISOString(),
          description: 'Official delegate dispatch network. Sovereign encrypted peer messaging.'
        }
      ];

      const sc = localStorage.getItem(LS_CONVERSATIONS);
      const parsedConvs: ChatConversation[] = safeParse(sc, null);
      if (parsedConvs && Array.isArray(parsedConvs) && parsedConvs.length > 0) {
        setConversations(parsedConvs);
      } else {
        setConversations(defaultHumanConversation);
        localStorage.setItem(LS_CONVERSATIONS, JSON.stringify(defaultHumanConversation));
      }

      const sm = localStorage.getItem(LS_MESSAGES);
      const parsedMsgs = safeParse(sm, null);
      if (parsedMsgs && typeof parsedMsgs === 'object' && Object.keys(parsedMsgs).length > 0) {
        // Ensure channels also have default messages if missing
        const merged = { ...parsedMsgs };
        if (!merged['chan_ch-general']) {
          merged['chan_ch-general'] = [
            {
              id: 'msg-gen-1',
              conversationId: 'chan_ch-general',
              senderId: 'sec-1',
              senderName: 'Zenvitra Secretariat',
              senderUsername: 'zenvitra_sec',
              senderRole: '👑 FOUNDER',
              content: 'The Plenary Assembly is formally in session. Delegates may now request the floor or table draft working papers.',
              timestamp: '10:00 AM',
              isSelf: false,
              reactions: [{ emoji: '🏛️', count: 3, users: ['sec-1'] }]
            }
          ];
        }
        if (!merged['chan_ch-briefs']) {
          merged['chan_ch-briefs'] = [
            {
              id: 'msg-brf-1',
              conversationId: 'chan_ch-briefs',
              senderId: 'sec-press',
              senderName: 'Elena Rostova (Reuters)',
              senderUsername: 'elena_press',
              senderRole: '📰 PRESS',
              content: 'Breaking diplomatic wire: Sovereign delegations agree on preliminary draft terms for multilateral digital identity standards.',
              timestamp: '10:15 AM',
              isSelf: false,
              reactions: [{ emoji: '⚡', count: 2, users: ['sec-press'] }]
            }
          ];
        }
        setMessagesMap(merged);
      } else {
        const initialMsgs = {
          'conv-zenvitra-hq': [
            {
              id: 'msg-sec-welcome',
              conversationId: 'conv-zenvitra-hq',
              senderId: 'sec-1',
              senderName: 'Zenvitra Secretariat',
              senderUsername: 'zenvitra_sec',
              senderRole: '🏛️ SECRETARIAT',
              content: 'Welcome to your sovereign diplomatic channel. You can caucus with delegates, share real-time notes, exchange high-priority dispatches, and coordinate committee resolutions.',
              timestamp: 'Just now',
              isSelf: false,
              reactions: []
            }
          ],
          'chan_ch-general': [
            {
              id: 'msg-gen-1',
              conversationId: 'chan_ch-general',
              senderId: 'sec-1',
              senderName: 'Zenvitra Secretariat',
              senderUsername: 'zenvitra_sec',
              senderRole: '👑 FOUNDER',
              content: 'The Plenary Assembly is formally in session. Delegates may now request the floor or table draft working papers.',
              timestamp: '10:00 AM',
              isSelf: false,
              reactions: [{ emoji: '🏛️', count: 3, users: ['sec-1'] }]
            }
          ],
          'chan_ch-briefs': [
            {
              id: 'msg-brf-1',
              conversationId: 'chan_ch-briefs',
              senderId: 'sec-press',
              senderName: 'Elena Rostova (Reuters)',
              senderUsername: 'elena_press',
              senderRole: '📰 PRESS',
              content: 'Breaking diplomatic wire: Sovereign delegations agree on preliminary draft terms for multilateral digital identity standards.',
              timestamp: '10:15 AM',
              isSelf: false,
              reactions: [{ emoji: '⚡', count: 2, users: ['sec-press'] }]
            }
          ]
        };
        setMessagesMap(initialMsgs);
        localStorage.setItem(LS_MESSAGES, JSON.stringify(initialMsgs));
      }

      const scl = localStorage.getItem(LS_CALLS);
      setCalls(safeParse(scl, []));

      const sst = localStorage.getItem(LS_STATUSES);
      setStatuses(safeParse(sst, []));

      const snt = localStorage.getItem(LS_NOTES);
      const parsedNotes: ZenNote[] = safeParse(snt, []);
      // Filter expired notes (older than 24h)
      const validNotes = parsedNotes.filter((n) => new Date(n.expiresAt).getTime() > Date.now());
      setZenNotes(validNotes);

      const sgs = localStorage.getItem(LS_GLIMPSE_SCORE);
      setGlimpseScore(safeParse(sgs, { sent: 48, received: 64, streak: 7 }));

      const sstk = localStorage.getItem(LS_STICKERS);
      setCustomStickers(safeParse(sstk, DEFAULT_STICKERS));
    } catch (_) {}
  }, []);

  const saveConversations = useCallback((next: ChatConversation[]) => {
    setConversations(next);
    try { localStorage.setItem(LS_CONVERSATIONS, JSON.stringify(next)); } catch (_) {}
  }, []);

  const saveMessages = useCallback((next: Record<string, ChatMessage[]>) => {
    setMessagesMap(next);
    try { localStorage.setItem(LS_MESSAGES, JSON.stringify(next)); } catch (_) {}
  }, []);

  const saveCalls = useCallback((next: ChatCall[]) => {
    setCalls(next);
    try { localStorage.setItem(LS_CALLS, JSON.stringify(next)); } catch (_) {}
  }, []);

  const saveStatuses = useCallback((next: ChatStatus[]) => {
    setStatuses(next);
    try { localStorage.setItem(LS_STATUSES, JSON.stringify(next)); } catch (_) {}
  }, []);

  const saveZenNotes = useCallback((next: ZenNote[]) => {
    setZenNotes(next);
    try { localStorage.setItem(LS_NOTES, JSON.stringify(next)); } catch (_) {}
  }, []);

  const saveGlimpseScore = useCallback((next: GlimpseScore) => {
    setGlimpseScore(next);
    try { localStorage.setItem(LS_GLIMPSE_SCORE, JSON.stringify(next)); } catch (_) {}
  }, []);

  const saveCustomStickers = useCallback((next: CustomSticker[]) => {
    setCustomStickers(next);
    try { localStorage.setItem(LS_STICKERS, JSON.stringify(next)); } catch (_) {}
  }, []);

  // Call timer effect
  useEffect(() => {
    let timer: any;
    if (activeCall.isActive) {
      timer = setInterval(() => {
        setActiveCall((prev) => ({ ...prev, durationSeconds: prev.durationSeconds + 1 }));
      }, 1000);
    }
    return () => clearInterval(timer);
  }, [activeCall.isActive]);

  const activeConversation = useMemo(
    () => conversations.find((c) => c.id === activeConversationId),
    [conversations, activeConversationId]
  );

  const activeMessages = useMemo(
    () => (activeConversationId ? messagesMap[activeConversationId] || [] : []),
    [messagesMap, activeConversationId]
  );

  /* Send Message */
  const sendMessage = useCallback((content: string, attachments?: any[], replyTo?: any, targetConvId?: string, senderRole?: string) => {
    const convId = targetConvId || activeConversationId;
    if (!convId || (!content.trim() && (!attachments || attachments.length === 0))) return;

    const timeStr = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    const newMsg: ChatMessage = {
      id: 'msg_' + Date.now(),
      conversationId: convId,
      senderId: currentUserId,
      senderName: currentUserName,
      senderUsername: currentUserUsername,
      senderRole: senderRole || 'DELEGATE',
      isSelf: true,
      content: content.trim(),
      timestamp: timeStr,
      reactions: [],
      attachments,
      replyTo,
      status: 'delivered',
    };

    const currentList = messagesMap[convId] || [];
    const nextList = [...currentList, newMsg];
    saveMessages({ ...messagesMap, [convId]: nextList });

    // Update conversation last message if it's a conversation
    const updatedConvs = conversations.map((c) => {
      if (c.id === convId) {
        return {
          ...c,
          lastMessage: {
            text: content.trim() || '📎 Media attachment',
            timestamp: timeStr,
            senderName: currentUserName,
          }
        };
      }
      return c;
    });
    saveConversations(updatedConvs);

    // Call Backend API for database sync
    fetch('/api/chat', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        conversationId: convId,
        senderId: currentUserId,
        senderName: currentUserName,
        senderUsername: currentUserUsername,
        content: content.trim(),
        attachments,
        replyTo,
      })
    }).catch(() => {});
  }, [activeConversationId, currentUserId, currentUserName, currentUserUsername, messagesMap, conversations, saveMessages, saveConversations]);

  /* Send Snap (Glimpses in ZenChat) */
  const sendSnap = useCallback((snapData: { mediaUrl: string; caption?: string; stickers?: string[]; isOneView?: boolean; audience?: 'all' | 'followers' | 'close_friends' }, targetConvId?: string) => {
    const convId = targetConvId || activeConversationId;
    if (!convId) return;

    const timeStr = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    const snap: GlimpseSnap = {
      id: 'snap_' + Date.now(),
      senderId: currentUserId,
      senderUsername: currentUserUsername,
      senderName: currentUserName,
      mediaUrl: snapData.mediaUrl,
      caption: snapData.caption,
      stickers: snapData.stickers,
      isOneView: snapData.isOneView ?? false,
      isOpened: false,
      audience: snapData.audience || 'all',
      createdAt: new Date().toISOString()
    };

    const newMsg: ChatMessage = {
      id: 'msg_snap_' + Date.now(),
      conversationId: convId,
      senderId: currentUserId,
      senderName: currentUserName,
      senderUsername: currentUserUsername,
      isSelf: true,
      content: snap.isOneView ? '📸 1-View Instant' : '🔥 Glimpse Snap',
      snap,
      timestamp: timeStr,
      reactions: [],
      status: 'delivered'
    };

    const currentList = messagesMap[convId] || [];
    saveMessages({ ...messagesMap, [convId]: [...currentList, newMsg] });

    // Update GlimpseScore
    setGlimpseScore((prev) => {
      const next = { ...prev, sent: prev.sent + 1, streak: prev.streak + 1 };
      try { localStorage.setItem(LS_GLIMPSE_SCORE, JSON.stringify(next)); } catch (_) {}
      return next;
    });

    // Update conversation snippet
    saveConversations(
      conversations.map((c) =>
        c.id === convId
          ? {
              ...c,
              lastMessage: {
                text: snap.isOneView ? '📸 1-View Instant' : '🔥 Glimpse Snap',
                timestamp: timeStr,
                senderName: currentUserName
              }
            }
          : c
      )
    );
  }, [activeConversationId, currentUserId, currentUserName, currentUserUsername, messagesMap, conversations, saveMessages, saveConversations]);

  /* Open Snap (Tap to View) */
  const openSnap = useCallback((messageId: string) => {
    if (!activeConversationId) return;
    const currentList = messagesMap[activeConversationId] || [];
    const nextList = currentList.map((m) => {
      if (m.id === messageId && m.snap) {
        return {
          ...m,
          snap: {
            ...m.snap,
            isOpened: true,
            openedAt: new Date().toISOString()
          }
        };
      }
      return m;
    });
    saveMessages({ ...messagesMap, [activeConversationId]: nextList });

    // Increment received score
    setGlimpseScore((prev) => {
      const next = { ...prev, received: prev.received + 1 };
      try { localStorage.setItem(LS_GLIMPSE_SCORE, JSON.stringify(next)); } catch (_) {}
      return next;
    });
  }, [activeConversationId, messagesMap, saveMessages]);

  /* Send Sticker */
  const sendSticker = useCallback((stickerUrl: string, name?: string) => {
    if (!activeConversationId) return;
    const timeStr = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    const newMsg: ChatMessage = {
      id: 'stk_msg_' + Date.now(),
      conversationId: activeConversationId,
      senderId: currentUserId,
      senderName: currentUserName,
      senderUsername: currentUserUsername,
      isSelf: true,
      content: name ? `[Sticker: ${name}]` : '✨ Sticker',
      stickerUrl,
      timestamp: timeStr,
      reactions: [],
      status: 'delivered'
    };

    const currentList = messagesMap[activeConversationId] || [];
    saveMessages({ ...messagesMap, [activeConversationId]: [...currentList, newMsg] });
  }, [activeConversationId, currentUserId, currentUserName, currentUserUsername, messagesMap, saveMessages]);

  /* Create Custom Sticker */
  const createCustomSticker = useCallback((name: string, url: string) => {
    const newStk: CustomSticker = {
      id: 'stk_' + Date.now(),
      name,
      url,
      category: 'custom'
    };
    saveCustomStickers([newStk, ...customStickers]);
  }, [customStickers, saveCustomStickers]);

  /* Post Zen Note (Instagram-style Thought Bubble) */
  const postZenNote = useCallback((text: string, moodEmoji?: string, locationBadge?: string, song?: ZenNoteSong, colorTheme?: ZenNoteColor) => {
    const newNote: ZenNote = {
      id: 'note_' + Date.now(),
      authorId: currentUserId,
      authorName: currentUserName,
      authorUsername: currentUserUsername,
      text: text.slice(0, 60),
      moodEmoji: moodEmoji || '✨',
      locationBadge: locationBadge || 'Location off',
      song: song || undefined,
      colorTheme: colorTheme || 'dark',
      createdAt: new Date().toISOString(),
      expiresAt: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString()
    };

    // Replace previous note by this user
    const filtered = zenNotes.filter((n) => n.authorUsername !== currentUserUsername);
    saveZenNotes([newNote, ...filtered]);
  }, [currentUserId, currentUserName, currentUserUsername, zenNotes, saveZenNotes]);

  /* Delete Zen Note */
  const deleteZenNote = useCallback((id: string) => {
    saveZenNotes(zenNotes.filter((n) => n.id !== id));
  }, [zenNotes, saveZenNotes]);

  /* Send Voice Note */
  const sendVoiceNote = useCallback((durationOrUrl: number | string, dur?: number) => {
    if (!activeConversationId) return;
    const timeStr = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    const duration = typeof durationOrUrl === 'number' ? durationOrUrl : (dur || 5);
    const voiceUrl = typeof durationOrUrl === 'string' ? durationOrUrl : 'simulated_audio';

    const newMsg: ChatMessage = {
      id: 'vn_' + Date.now(),
      conversationId: activeConversationId,
      senderId: currentUserId,
      senderName: currentUserName,
      senderUsername: currentUserUsername,
      isSelf: true,
      content: `🎤 Voice note (${Math.floor(duration / 60)}:${(duration % 60).toString().padStart(2, '0')})`,
      voiceDurationSeconds: duration,
      voiceNoteUrl: voiceUrl,
      timestamp: timeStr,
      reactions: [],
      status: 'read',
    };

    const currentList = messagesMap[activeConversationId] || [];
    saveMessages({ ...messagesMap, [activeConversationId]: [...currentList, newMsg] });
  }, [activeConversationId, currentUserId, currentUserName, currentUserUsername, messagesMap, saveMessages]);

  const editMessage = useCallback((messageId: string, newContent: string) => {
    if (!activeConversationId || !newContent.trim()) return;
    const currentList = messagesMap[activeConversationId] || [];
    const nextList = currentList.map((m) => {
      if (m.id === messageId && m.isSelf) {
        return { ...m, content: newContent.trim(), isEdited: true };
      }
      return m;
    });
    saveMessages({ ...messagesMap, [activeConversationId]: nextList });
  }, [activeConversationId, messagesMap, saveMessages]);

  const deleteMessage = useCallback((messageId: string) => {
    if (!activeConversationId) return;
    const currentList = messagesMap[activeConversationId] || [];
    const nextList = currentList.filter((m) => m.id !== messageId);
    saveMessages({ ...messagesMap, [activeConversationId]: nextList });
  }, [activeConversationId, messagesMap, saveMessages]);

  const reactToMessage = useCallback((messageId: string, emoji: string) => {
    if (!activeConversationId) return;
    const currentList = messagesMap[activeConversationId] || [];
    const nextList = currentList.map((m) => {
      if (m.id === messageId) {
        const existingReactionIndex = m.reactions.findIndex((r) => r.emoji === emoji);
        let updatedReactions = [...m.reactions];

        if (existingReactionIndex >= 0) {
          const reaction = updatedReactions[existingReactionIndex];
          const hasUserReacted = reaction.users.includes(currentUserId);

          if (hasUserReacted) {
            const nextUsers = reaction.users.filter((u) => u !== currentUserId);
            if (nextUsers.length === 0) {
              updatedReactions.splice(existingReactionIndex, 1);
            } else {
              updatedReactions[existingReactionIndex] = { ...reaction, count: reaction.count - 1, users: nextUsers };
            }
          } else {
            updatedReactions[existingReactionIndex] = {
              ...reaction,
              count: reaction.count + 1,
              users: [...reaction.users, currentUserId],
            };
          }
        } else {
          updatedReactions.push({ emoji, count: 1, users: [currentUserId] });
        }
        return { ...m, reactions: updatedReactions };
      }
      return m;
    });
    saveMessages({ ...messagesMap, [activeConversationId]: nextList });
  }, [activeConversationId, currentUserId, messagesMap, saveMessages]);

  const addReaction = reactToMessage;

  const pinMessage = useCallback((messageId: string) => {
    if (!activeConversationId) return;
    const currentList = messagesMap[activeConversationId] || [];
    const nextList = currentList.map((m) => {
      if (m.id === messageId) {
        return { ...m, isPinned: !m.isPinned };
      }
      return m;
    });
    saveMessages({ ...messagesMap, [activeConversationId]: nextList });
  }, [activeConversationId, messagesMap, saveMessages]);

  /* Direct Chat Creation */
  const createDirectChat = useCallback((memberOrHandle: ChatMember | string, contactName?: string): string => {
    const handle = typeof memberOrHandle === 'string' ? memberOrHandle.replace(/^@/, '') : memberOrHandle.username.replace(/^@/, '');
    const name = typeof memberOrHandle === 'string' ? contactName || handle : memberOrHandle.name;

    const existing = conversations.find(
      (c) => c.type === 'dm' && c.handle?.toLowerCase() === handle.toLowerCase()
    );
    if (existing) {
      setActiveConversationId(existing.id);
      return existing.id;
    }

    const newId = 'dm_' + Date.now() + '_' + handle;
    const newConv: ChatConversation = {
      id: newId,
      type: 'dm',
      name: name,
      handle: handle,
      category: 'primary',
      unreadCount: 0,
      createdAt: new Date().toISOString(),
      members: [
        { id: currentUserId, name: currentUserName, username: currentUserUsername, role: 'delegate', status: 'online' },
        typeof memberOrHandle === 'string'
          ? { id: 'u_' + handle, name: name, username: handle, role: 'delegate', status: 'online' }
          : memberOrHandle,
      ],
      lastMessage: {
        text: 'Direct encrypted sovereign link initialized.',
        timestamp: 'Now',
        senderName: 'System',
      }
    };

    saveConversations([newConv, ...conversations]);
    setActiveConversationId(newId);
    return newId;
  }, [conversations, currentUserId, currentUserName, currentUserUsername, saveConversations]);

  const createDirectMessage = createDirectChat;

  /* Group Chat Creation */
  const createGroupChat = useCallback((name: string, members: ChatMember[], description?: string): string => {
    const newId = 'grp_' + Date.now();
    const newConv: ChatConversation = {
      id: newId,
      type: 'group',
      name: name.trim(),
      category: 'primary',
      description,
      unreadCount: 0,
      createdAt: new Date().toISOString(),
      members: [
        { id: currentUserId, name: currentUserName, username: currentUserUsername, role: 'owner', status: 'online' },
        ...members.filter((m) => m.username !== currentUserUsername),
      ],
      lastMessage: {
        text: `Group caucus "${name}" created.`,
        timestamp: 'Now',
        senderName: currentUserName,
      }
    };

    saveConversations([newConv, ...conversations]);
    setActiveConversationId(newId);
    return newId;
  }, [conversations, currentUserId, currentUserName, currentUserUsername, saveConversations]);

  const createGroup = useCallback((name: string, description?: string, memberUsernames?: string[]): string => {
    const membersList: ChatMember[] = (memberUsernames || []).map((u) => ({
      id: 'u_' + u,
      name: u,
      username: u,
      role: 'delegate',
      status: 'online',
    }));
    return createGroupChat(name, membersList, description);
  }, [createGroupChat]);

  /* Broadcast List Creation (1-to-many WhatsApp style) */
  const createBroadcastList = useCallback((name: string, memberUsernames: string[]): string => {
    const newId = 'bc_' + Date.now();
    const membersList: ChatMember[] = (memberUsernames || []).map((u) => ({
      id: 'u_' + u,
      name: u,
      username: u,
      role: 'subscriber',
      status: 'online',
    }));

    const newConv: ChatConversation = {
      id: newId,
      type: 'broadcast',
      name: `📢 ${name.trim()}`,
      category: 'primary',
      description: `Broadcast List with ${memberUsernames.length} recipients`,
      unreadCount: 0,
      createdAt: new Date().toISOString(),
      members: [
        { id: currentUserId, name: currentUserName, username: currentUserUsername, role: 'broadcaster', status: 'online' },
        ...membersList,
      ],
      lastMessage: {
        text: `Broadcast channel initialized with ${memberUsernames.length} delegates.`,
        timestamp: 'Now',
        senderName: currentUserName,
      }
    };

    saveConversations([newConv, ...conversations]);
    setActiveConversationId(newId);
    return newId;
  }, [conversations, currentUserId, currentUserName, currentUserUsername, saveConversations]);

  const startChatWithNumber = useCallback((phoneNumber: string, contactName?: string): string => {
    const cleanNum = phoneNumber.replace(/[^0-9+]/g, '');
    return createDirectChat({
      id: 'phone_' + cleanNum,
      name: contactName || cleanNum,
      username: cleanNum,
      phoneNumber: cleanNum,
      status: 'online',
    });
  }, [createDirectChat]);

  const togglePinConversation = useCallback((convId: string) => {
    saveConversations(
      conversations.map((c) => (c.id === convId ? { ...c, isPinned: !c.isPinned } : c))
    );
  }, [conversations, saveConversations]);

  const toggleMuteConversation = useCallback((convId: string) => {
    saveConversations(
      conversations.map((c) => (c.id === convId ? { ...c, isMuted: !c.isMuted } : c))
    );
  }, [conversations, saveConversations]);

  const deleteConversation = useCallback((convId: string) => {
    saveConversations(conversations.filter((c) => c.id !== convId));
    if (activeConversationId === convId) {
      const remaining = conversations.filter((c) => c.id !== convId);
      setActiveConversationId(remaining.length > 0 ? remaining[0].id : null);
    }
  }, [conversations, activeConversationId, saveConversations]);

  /* Calls & Calling */
  const startCall = useCallback((convId: string, callType: 'voice' | 'video' = 'voice') => {
    const conv = conversations.find((c) => c.id === convId);
    const targetName = conv ? conv.name : 'Sovereign Delegate';

    setActiveCall({
      isActive: true,
      conversationId: convId,
      conversationName: targetName,
      phoneNumberOrHandle: conv?.handle || conv?.phoneNumber,
      callType,
      isMuted: false,
      isDeafened: false,
      isScreenSharing: false,
      durationSeconds: 0,
    });

    const newCall: ChatCall = {
      id: 'call_' + Date.now(),
      contactName: targetName,
      contactNumberOrUsername: conv?.handle || conv?.phoneNumber || 'delegate',
      type: callType,
      direction: 'outgoing',
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      duration: 'Ongoing',
    };
    saveCalls([newCall, ...calls]);
  }, [conversations, calls, saveCalls]);

  const startDirectNumberCall = useCallback((phoneNumberOrHandle: string, name: string, callType: 'voice' | 'video') => {
    const clean = phoneNumberOrHandle.replace(/^@/, '');
    setActiveCall({
      isActive: true,
      conversationId: 'direct_' + clean,
      conversationName: name || clean,
      phoneNumberOrHandle: clean,
      callType,
      isMuted: false,
      isDeafened: false,
      isScreenSharing: false,
      durationSeconds: 0,
    });

    const newCall: ChatCall = {
      id: 'call_' + Date.now(),
      contactName: name || clean,
      contactNumberOrUsername: clean,
      type: callType,
      direction: 'outgoing',
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      duration: 'Ongoing',
    };
    saveCalls([newCall, ...calls]);
  }, [calls, saveCalls]);

  const endCall = useCallback(() => {
    setActiveCall({
      isActive: false,
      conversationId: '',
      conversationName: '',
      callType: 'voice',
      isMuted: false,
      isDeafened: false,
      isScreenSharing: false,
      durationSeconds: 0,
    });
  }, []);

  const toggleMuteCall = useCallback(() => {
    setActiveCall((prev) => ({ ...prev, isMuted: !prev.isMuted }));
  }, []);

  const toggleCallMute = toggleMuteCall;

  const toggleDeafenCall = useCallback(() => {
    setActiveCall((prev) => ({ ...prev, isDeafened: !prev.isDeafened }));
  }, []);

  const toggleCallDeafen = toggleDeafenCall;

  const toggleScreenShare = useCallback(() => {
    setActiveCall((prev) => ({ ...prev, isScreenSharing: !prev.isScreenSharing }));
  }, []);

  const toggleCallScreenShare = toggleScreenShare;

  const clearCallHistory = useCallback(() => {
    saveCalls([]);
  }, [saveCalls]);

  /* Statuses */
  const postStatus = useCallback((text: string, mediaUrl?: string) => {
    const newStatus: ChatStatus = {
      id: 'stat_' + Date.now(),
      authorName: currentUserName,
      authorUsername: currentUserUsername,
      text,
      mediaUrl,
      timestamp: 'Just now',
      viewed: false,
    };
    saveStatuses([newStatus, ...statuses]);
  }, [currentUserName, currentUserUsername, statuses, saveStatuses]);

  const value = useMemo(
    () => ({
      conversations,
      activeConversationId,
      activeConversation,
      messagesMap,
      activeMessages,
      messages: activeMessages,
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
      addReaction,
      pinMessage,
      createDirectChat,
      createDirectMessage,
      createGroupChat,
      createGroup,
      createBroadcastList,
      startChatWithNumber,
      togglePinConversation,
      toggleMuteConversation,
      deleteConversation,
      zenNotes,
      postZenNote,
      deleteZenNote,
      glimpseScore,
      customStickers,
      createCustomSticker,
      startCall,
      startDirectNumberCall,
      endCall,
      toggleMuteCall,
      toggleCallMute,
      toggleDeafenCall,
      toggleCallDeafen,
      toggleScreenShare,
      toggleCallScreenShare,
      clearCallHistory,
      postStatus,
      activeFilter,
      setActiveFilter,
      searchQuery,
      setSearchQuery,
      isCreateModalOpen,
      setIsCreateModalOpen,
      currentUser: { id: currentUserId, name: currentUserName, username: currentUserUsername },
      currentUserId,
      currentUserName,
      currentUserUsername,
    }),
    [
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
      addReaction,
      pinMessage,
      createDirectChat,
      createDirectMessage,
      createGroupChat,
      createGroup,
      createBroadcastList,
      startChatWithNumber,
      togglePinConversation,
      toggleMuteConversation,
      deleteConversation,
      zenNotes,
      postZenNote,
      deleteZenNote,
      glimpseScore,
      customStickers,
      createCustomSticker,
      startCall,
      startDirectNumberCall,
      endCall,
      toggleMuteCall,
      toggleCallMute,
      toggleDeafenCall,
      toggleCallDeafen,
      toggleScreenShare,
      toggleCallScreenShare,
      clearCallHistory,
      postStatus,
      activeFilter,
      searchQuery,
      isCreateModalOpen,
      currentUserId,
      currentUserName,
      currentUserUsername,
    ]
  );

  return <ZenChatContext.Provider value={value}>{children}</ZenChatContext.Provider>;
}

export function useZenChat() {
  const context = useContext(ZenChatContext);
  if (!context) {
    throw new Error('useZenChat must be used within a ZenChatPlatformProvider');
  }
  return context;
}
