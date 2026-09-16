'use client';

import React, { useState, useRef, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { 
  Mic, 
  MicOff, 
  Video, 
  VideoOff, 
  MonitorUp, 
  Hand, 
  Smile, 
  MessageSquare, 
  Users, 
  PenTool, 
  Vote, 
  Layers, 
  Gavel, 
  Settings, 
  PhoneOff, 
  Pin, 
  PinOff, 
  Maximize2, 
  Minimize2, 
  Copy, 
  Check, 
  ShieldCheck, 
  Radio, 
  Volume2, 
  VolumeX, 
  Sparkles, 
  ChevronDown, 
  Send, 
  Plus, 
  ThumbsUp, 
  HelpCircle, 
  Grid, 
  Sidebar as SidebarIcon,
  Circle,
  MoreVertical,
  Share2
} from 'lucide-react';
import { 
  CallMode, 
  CallRole, 
  CallParticipant, 
  CallMessage, 
  CallPoll, 
  CallQuestion, 
  BreakoutRoom 
} from '@/types/call';
import { ZenWhiteboard } from './ZenWhiteboard';
import { MunCommitteeChamber } from './MunCommitteeChamber';

interface ZenCallActiveRoomProps {
  roomId: string;
}

const DEFAULT_PEERS: Record<CallMode, CallParticipant[]> = {
  CALL: [
    {
      id: 'peer-1',
      name: 'Dr. Sarah Lin',
      handle: 'sarahlin',
      role: 'PARTICIPANT',
      avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=200&auto=format&fit=crop&q=80',
      isMuted: false,
      isCameraOff: false,
      isHandRaised: false,
      isSpeaking: true,
      isPinned: false,
      isScreenSharing: false,
      joinedAt: Date.now() - 450000,
    }
  ],
  GROUP: [
    {
      id: 'peer-1',
      name: 'Elena Rostova',
      handle: 'elena',
      role: 'HOST',
      avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=200&auto=format&fit=crop&q=80',
      isMuted: false,
      isCameraOff: false,
      isHandRaised: false,
      isSpeaking: true,
      isPinned: false,
      isScreenSharing: false,
      joinedAt: Date.now() - 600000,
    },
    {
      id: 'peer-2',
      name: 'Marcus Vance',
      handle: 'marcus_v',
      role: 'SPEAKER',
      avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=200&auto=format&fit=crop&q=80',
      isMuted: true,
      isCameraOff: false,
      isHandRaised: true,
      handRaisedAt: Date.now() - 60000,
      isSpeaking: false,
      isPinned: false,
      isScreenSharing: false,
      joinedAt: Date.now() - 500000,
    },
    {
      id: 'peer-3',
      name: 'Aoi Takahashi',
      handle: 'aoi_t',
      role: 'PARTICIPANT',
      avatar: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=200&auto=format&fit=crop&q=80',
      isMuted: true,
      isCameraOff: true,
      isHandRaised: false,
      isSpeaking: false,
      isPinned: false,
      isScreenSharing: false,
      joinedAt: Date.now() - 300000,
    },
    {
      id: 'peer-4',
      name: 'Kofi Mensah',
      handle: 'kmensah',
      role: 'PARTICIPANT',
      avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=200&auto=format&fit=crop&q=80',
      isMuted: false,
      isCameraOff: false,
      isHandRaised: false,
      isSpeaking: false,
      isPinned: false,
      isScreenSharing: false,
      joinedAt: Date.now() - 200000,
    }
  ],
  ROOM: [
    {
      id: 'peer-1',
      name: 'Alex Rivera',
      handle: 'arivera',
      role: 'MODERATOR',
      avatar: 'https://images.unsplash.com/photo-1492562080023-ab3db95bfbce?w=200&auto=format&fit=crop&q=80',
      isMuted: false,
      isCameraOff: false,
      isHandRaised: false,
      isSpeaking: true,
      isPinned: false,
      isScreenSharing: false,
      joinedAt: Date.now() - 1200000,
    },
    {
      id: 'peer-2',
      name: 'Maya Patel',
      handle: 'maya_p',
      role: 'PARTICIPANT',
      avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=200&auto=format&fit=crop&q=80',
      isMuted: true,
      isCameraOff: false,
      isHandRaised: false,
      isSpeaking: false,
      isPinned: false,
      isScreenSharing: false,
      joinedAt: Date.now() - 900000,
    }
  ],
  EVENT: [
    {
      id: 'peer-stage-1',
      name: 'Keynote: Prof. David Thorne',
      handle: 'davidthorne',
      role: 'SPEAKER',
      avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=200&auto=format&fit=crop&q=80',
      isMuted: false,
      isCameraOff: false,
      isHandRaised: false,
      isSpeaking: true,
      isPinned: true,
      isScreenSharing: true,
      joinedAt: Date.now() - 1800000,
    }
  ],
  LIVE: [
    {
      id: 'peer-broadcast-1',
      name: 'Host: Zenvitra Studio Live',
      handle: 'zenvitra_live',
      role: 'HOST',
      avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=200&auto=format&fit=crop&q=80',
      isMuted: false,
      isCameraOff: false,
      isHandRaised: false,
      isSpeaking: true,
      isPinned: true,
      isScreenSharing: false,
      joinedAt: Date.now() - 3600000,
    }
  ],
  COMMITTEE: [
    {
      id: 'mun-1',
      name: 'Ambassador Laurent',
      handle: 'france_delegate',
      countryFlag: '🇫🇷 France',
      role: 'SPEAKER',
      avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=200&auto=format&fit=crop&q=80',
      isMuted: false,
      isCameraOff: false,
      isHandRaised: false,
      isSpeaking: true,
      isPinned: true,
      isScreenSharing: false,
      joinedAt: Date.now() - 2400000,
    },
    {
      id: 'mun-2',
      name: 'Lord Sterling',
      handle: 'uk_delegate',
      countryFlag: '🇬🇧 United Kingdom',
      role: 'SPEAKER',
      avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=200&auto=format&fit=crop&q=80',
      isMuted: true,
      isCameraOff: false,
      isHandRaised: true,
      handRaisedAt: Date.now() - 45000,
      isSpeaking: false,
      isPinned: false,
      isScreenSharing: false,
      joinedAt: Date.now() - 2300000,
    },
    {
      id: 'mun-3',
      name: 'Delegate Tanaka',
      handle: 'japan_delegate',
      countryFlag: '🇯🇵 Japan',
      role: 'SPEAKER',
      avatar: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=200&auto=format&fit=crop&q=80',
      isMuted: true,
      isCameraOff: false,
      isHandRaised: true,
      handRaisedAt: Date.now() - 30000,
      isSpeaking: false,
      isPinned: false,
      isScreenSharing: false,
      joinedAt: Date.now() - 2100000,
    },
    {
      id: 'mun-4',
      name: 'Delegate Silva',
      handle: 'brazil_delegate',
      countryFlag: '🇧🇷 Brazil',
      role: 'SPEAKER',
      avatar: 'https://images.unsplash.com/photo-1492562080023-ab3db95bfbce?w=200&auto=format&fit=crop&q=80',
      isMuted: true,
      isCameraOff: true,
      isHandRaised: false,
      isSpeaking: false,
      isPinned: false,
      isScreenSharing: false,
      joinedAt: Date.now() - 1900000,
    }
  ]
};

export function ZenCallActiveRoom({ roomId }: ZenCallActiveRoomProps) {
  const router = useRouter();
  const searchParams = useSearchParams();

  // Mode and initial params
  const paramMode = (searchParams.get('mode') as CallMode) || 'GROUP';
  const [mode, setMode] = useState<CallMode>(paramMode);

  // Local user states
  const [isMicOn, setIsMicOn] = useState(searchParams.get('mic') !== 'false');
  const [isCamOn, setIsCamOn] = useState(searchParams.get('cam') !== 'false');
  const [virtualBg, setVirtualBg] = useState<string>(searchParams.get('bg') || 'none');
  const [isScreenSharing, setIsScreenSharing] = useState(false);
  const [isHandRaised, setIsHandRaised] = useState(false);
  const [isRecording, setIsRecording] = useState(false);
  const [micLevel, setMicLevel] = useState(40);
  const [callDuration, setCallDuration] = useState(128); // seconds
  const [isCopied, setIsCopied] = useState(false);
  const [layoutMode, setLayoutMode] = useState<'grid' | 'spotlight'>('grid');
  const [pinnedId, setPinnedId] = useState<string | null>(null);

  // Drawers and Modals
  const [activeDrawer, setActiveDrawer] = useState<'chat' | 'participants' | 'polls' | 'breakout' | 'mun' | null>(
    paramMode === 'COMMITTEE' ? 'mun' : null
  );
  const [isWhiteboardOpen, setIsWhiteboardOpen] = useState(false);
  const [showReactionPicker, setShowReactionPicker] = useState(false);
  const [showSettingsModal, setShowSettingsModal] = useState(false);

  // Participants
  const [participants, setParticipants] = useState<CallParticipant[]>(() => {
    return DEFAULT_PEERS[paramMode] || DEFAULT_PEERS.GROUP;
  });

  // Floating Reactions
  const [floatingReactions, setFloatingReactions] = useState<{ id: string; emoji: string; x: number }[]>([]);

  // In-Call Chat
  const [chatMessages, setChatMessages] = useState<CallMessage[]>([
    {
      id: 'msg-1',
      senderId: 'peer-1',
      senderName: 'Elena Rostova',
      senderRole: 'HOST',
      text: 'Welcome everyone! Audio check passed. Docs and slides are ready.',
      timestamp: '10:42 AM',
      target: 'everyone',
    },
    {
      id: 'msg-2',
      senderId: 'peer-2',
      senderName: 'Marcus Vance',
      senderRole: 'SPEAKER',
      text: 'Good morning! Excited to kick off.',
      timestamp: '10:43 AM',
      target: 'everyone',
    }
  ]);
  const [chatInput, setChatInput] = useState('');
  const [chatTarget, setChatTarget] = useState<'everyone' | 'host'>('everyone');

  // Polls
  const [polls, setPolls] = useState<CallPoll[]>([
    {
      id: 'poll-1',
      question: 'Should we adopt the Proposed Clause 4.2 in the draft resolution?',
      options: [
        { id: 'opt-1', text: 'In Favor (Aye)', votes: 8 },
        { id: 'opt-2', text: 'Opposed (Nay)', votes: 2 },
        { id: 'opt-3', text: 'Abstain', votes: 1 },
      ],
      createdBy: 'Elena Rostova',
      isClosed: false,
      totalVotes: 11,
      userVotedOptionId: undefined,
    }
  ]);
  const [newPollQuestion, setNewPollQuestion] = useState('');
  const [newPollOpts, setNewPollOpts] = useState(['', '']);

  // Q&A
  const [questions, setQuestions] = useState<CallQuestion[]>([
    {
      id: 'q-1',
      authorName: 'Marcus Vance',
      authorRole: 'SPEAKER',
      question: 'How does the protocol handle failover if the primary node disconnects?',
      upvotes: 6,
      isAnswered: false,
      timestamp: '10:45 AM',
    },
    {
      id: 'q-2',
      authorName: 'Aoi Takahashi',
      authorRole: 'PARTICIPANT',
      question: 'Will the whiteboard session notes automatically sync to Zen.Docs?',
      upvotes: 12,
      isAnswered: true,
      timestamp: '10:48 AM',
    }
  ]);
  const [newQuestionText, setNewQuestionText] = useState('');
  const [qaActiveTab, setQaActiveTab] = useState<'polls' | 'qa'>('polls');

  // Breakout Rooms
  const [breakoutRooms, setBreakoutRooms] = useState<BreakoutRoom[]>([
    { id: 'br-1', name: 'Drafting Sub-Group Alpha', participantIds: ['peer-1', 'peer-2'] },
    { id: 'br-2', name: 'Technical Architecture Review', participantIds: ['peer-3', 'peer-4'] },
  ]);
  const [currentBreakoutRoom, setCurrentBreakoutRoom] = useState<string | null>(null);

  // Video Refs
  const localVideoRef = useRef<HTMLVideoElement | null>(null);
  const mediaStreamRef = useRef<MediaStream | null>(null);

  // Timer counter
  useEffect(() => {
    const timer = setInterval(() => {
      setCallDuration((prev) => prev + 1);
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  // Format call duration
  const formatDuration = (sec: number) => {
    const hrs = Math.floor(sec / 3600);
    const mins = Math.floor((sec % 3600) / 60);
    const secs = sec % 60;
    if (hrs > 0) {
      return `${hrs.toString().padStart(2, '0')}:${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
    }
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  // Setup Local Webcam
  useEffect(() => {
    let stream: MediaStream | null = null;
    const initWebcam = async () => {
      try {
        if (navigator?.mediaDevices?.getUserMedia) {
          stream = await navigator.mediaDevices.getUserMedia({
            video: true,
            audio: true,
          });
          mediaStreamRef.current = stream;
          if (localVideoRef.current) {
            localVideoRef.current.srcObject = stream;
          }
        }
      } catch (err) {
        console.warn('Webcam/Mic not accessible or denied:', err);
      }
    };

    if (isCamOn) {
      initWebcam();
    } else {
      if (mediaStreamRef.current) {
        mediaStreamRef.current.getVideoTracks().forEach((track) => track.stop());
      }
    }

    return () => {
      if (stream) {
        stream.getTracks().forEach((track) => track.stop());
      }
    };
  }, [isCamOn]);

  // VU meter animation
  useEffect(() => {
    if (!isMicOn) {
      setMicLevel(0);
      return;
    }
    const interval = setInterval(() => {
      setMicLevel(Math.floor(20 + Math.random() * 65));
    }, 200);
    return () => clearInterval(interval);
  }, [isMicOn]);

  // Handle Screen Share
  const handleToggleScreenShare = async () => {
    if (isScreenSharing) {
      setIsScreenSharing(false);
      return;
    }
    try {
      if (navigator?.mediaDevices?.getDisplayMedia) {
        const displayStream = await navigator.mediaDevices.getDisplayMedia({ video: true });
        setIsScreenSharing(true);
        displayStream.getVideoTracks()[0].onended = () => {
          setIsScreenSharing(false);
        };
      } else {
        setIsScreenSharing(true);
      }
    } catch {
      setIsScreenSharing(false);
    }
  };

  // Add floating reaction
  const triggerReaction = (emoji: string) => {
    const id = `${Date.now()}-${Math.random()}`;
    const x = 30 + Math.random() * 40; // 30% to 70% width
    setFloatingReactions((prev) => [...prev, { id, emoji, x }]);
    setShowReactionPicker(false);

    // Auto cleanup
    setTimeout(() => {
      setFloatingReactions((prev) => prev.filter((r) => r.id !== id));
    }, 2800);
  };

  // Copy Room Link
  const handleCopyLink = () => {
    const url = typeof window !== 'undefined' ? window.location.href : '';
    navigator.clipboard.writeText(url);
    setIsCopied(true);
    setTimeout(() => setIsCopied(false), 2000);
  };

  // Send in-call chat message
  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!chatInput.trim()) return;

    const newMsg: CallMessage = {
      id: `msg-${Date.now()}`,
      senderId: 'local-user',
      senderName: 'You',
      senderRole: 'HOST',
      text: chatInput.trim(),
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      target: chatTarget,
    };

    setChatMessages((prev) => [...prev, newMsg]);
    setChatInput('');
  };

  // Cast vote on poll
  const handleVotePoll = (pollId: string, optionId: string) => {
    setPolls((prev) =>
      prev.map((poll) => {
        if (poll.id !== pollId || poll.userVotedOptionId) return poll;
        return {
          ...poll,
          userVotedOptionId: optionId,
          totalVotes: poll.totalVotes + 1,
          options: poll.options.map((opt) =>
            opt.id === optionId ? { ...opt, votes: opt.votes + 1 } : opt
          ),
        };
      })
    );
  };

  // Create new poll
  const handleCreatePoll = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newPollQuestion.trim()) return;
    const validOpts = newPollOpts.filter((o) => o.trim().length > 0);
    if (validOpts.length < 2) return;

    const newPoll: CallPoll = {
      id: `poll-${Date.now()}`,
      question: newPollQuestion.trim(),
      options: validOpts.map((txt, idx) => ({ id: `opt-${idx}`, text: txt.trim(), votes: 0 })),
      createdBy: 'You',
      isClosed: false,
      totalVotes: 0,
    };

    setPolls((prev) => [newPoll, ...prev]);
    setNewPollQuestion('');
    setNewPollOpts(['', '']);
  };

  // Submit Q&A question
  const handleSubmitQuestion = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newQuestionText.trim()) return;

    const newQ: CallQuestion = {
      id: `q-${Date.now()}`,
      authorName: 'You',
      authorRole: 'PARTICIPANT',
      question: newQuestionText.trim(),
      upvotes: 1,
      isAnswered: false,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };

    setQuestions((prev) => [newQ, ...prev]);
    setNewQuestionText('');
  };

  // Upvote Question
  const handleUpvoteQuestion = (qId: string) => {
    setQuestions((prev) =>
      prev.map((q) => (q.id === qId ? { ...q, upvotes: q.upvotes + 1 } : q))
    );
  };

  // Mute All (Host Control)
  const handleMuteAll = () => {
    setParticipants((prev) => prev.map((p) => ({ ...p, isMuted: true })));
  };

  // Lower All Hands
  const handleLowerAllHands = () => {
    setIsHandRaised(false);
    setParticipants((prev) => prev.map((p) => ({ ...p, isHandRaised: false })));
  };

  // Leave Call
  const handleLeaveCall = () => {
    if (mediaStreamRef.current) {
      mediaStreamRef.current.getTracks().forEach((t) => t.stop());
    }
    router.push('/call');
  };

  // Hand raise queue count
  const handsRaisedCount = (isHandRaised ? 1 : 0) + participants.filter((p) => p.isHandRaised).length;

  // Render Virtual Background Class
  const getBgClass = () => {
    switch (virtualBg) {
      case 'blur':
        return 'backdrop-blur-2xl bg-black/70';
      case 'geneva':
        return 'bg-gradient-to-tr from-slate-900 via-blue-950 to-indigo-950';
      case 'stage':
        return 'bg-gradient-to-b from-purple-950 via-slate-950 to-black';
      case 'cyberpunk':
        return 'bg-gradient-to-tr from-rose-950 via-purple-950 to-cyan-950';
      default:
        return 'bg-slate-900';
    }
  };

  return (
    <div className="relative w-full h-[calc(100vh-4rem)] bg-black text-white flex flex-col overflow-hidden select-none">
      {/* 1. TOP BAR */}
      <header className="h-14 border-b border-white/10 bg-slate-950/80 backdrop-blur-xl px-4 flex items-center justify-between z-30 shrink-0">
        {/* Left: Mode badge & Room Code */}
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2 px-2.5 py-1 rounded-full bg-cyan-500/10 border border-cyan-500/30 text-cyan-400 text-xs font-semibold tracking-wider uppercase">
            <Radio className="w-3.5 h-3.5 animate-pulse text-cyan-400" />
            <span>{mode}</span>
          </div>

          <div className="flex items-center gap-2 bg-white/5 hover:bg-white/10 border border-white/10 rounded-lg px-3 py-1 text-xs text-slate-300 font-mono transition-colors">
            <span>{roomId}</span>
            <button
              onClick={handleCopyLink}
              title="Copy room invite link"
              className="text-slate-400 hover:text-white transition-colors"
            >
              {isCopied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
            </button>
          </div>

          {/* E2E Security Badge */}
          <div className="hidden md:flex items-center gap-1.5 text-xs text-emerald-400 bg-emerald-500/10 px-2.5 py-1 rounded-md border border-emerald-500/20">
            <ShieldCheck className="w-3.5 h-3.5" />
            <span className="font-medium">E2E Encrypted</span>
          </div>

          {/* Breakout Notice if Active */}
          {currentBreakoutRoom && (
            <div className="flex items-center gap-2 bg-purple-500/20 text-purple-300 border border-purple-500/30 px-2.5 py-1 rounded-md text-xs">
              <Layers className="w-3.5 h-3.5" />
              <span>In Breakout: {breakoutRooms.find((b) => b.id === currentBreakoutRoom)?.name}</span>
              <button
                onClick={() => setCurrentBreakoutRoom(null)}
                className="underline hover:text-white text-[11px] font-semibold"
              >
                Return to Main
              </button>
            </div>
          )}
        </div>

        {/* Center: Call Timer & Recording Status */}
        <div className="flex items-center gap-3">
          <div className="text-sm font-mono text-slate-300 bg-white/5 border border-white/10 px-3 py-1 rounded-full">
            {formatDuration(callDuration)}
          </div>

          {isRecording && (
            <div className="flex items-center gap-1.5 bg-rose-500/20 text-rose-400 border border-rose-500/30 px-2.5 py-1 rounded-full text-xs font-semibold animate-pulse">
              <Circle className="w-2.5 h-2.5 fill-rose-500" />
              <span>REC</span>
            </div>
          )}
        </div>

        {/* Right: Layout mode, Hand count & Whiteboard toggle */}
        <div className="flex items-center gap-2">
          {handsRaisedCount > 0 && (
            <div className="flex items-center gap-1.5 bg-amber-500/20 text-amber-300 border border-amber-500/30 px-2.5 py-1 rounded-lg text-xs font-medium animate-bounce">
              <Hand className="w-3.5 h-3.5" />
              <span>{handsRaisedCount} Raised</span>
            </div>
          )}

          <button
            onClick={() => setIsWhiteboardOpen(!isWhiteboardOpen)}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
              isWhiteboardOpen
                ? 'bg-cyan-500 text-slate-950 font-bold shadow-lg shadow-cyan-500/20'
                : 'bg-white/10 text-slate-300 hover:bg-white/15'
            }`}
          >
            <PenTool className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Whiteboard</span>
          </button>

          <button
            onClick={() => setLayoutMode(layoutMode === 'grid' ? 'spotlight' : 'grid')}
            className="p-1.5 text-slate-400 hover:text-white hover:bg-white/10 rounded-lg transition-colors"
            title={layoutMode === 'grid' ? 'Switch to Spotlight View' : 'Switch to Grid View'}
          >
            {layoutMode === 'grid' ? <SidebarIcon className="w-4 h-4" /> : <Grid className="w-4 h-4" />}
          </button>
        </div>
      </header>

      {/* 2. MAIN CALL STAGE & DRAWER CONTAINER */}
      <div className="relative flex-1 flex overflow-hidden">
        {/* VIDEO VIEWPORT */}
        <main className="flex-1 relative flex flex-col p-3 md:p-4 overflow-y-auto">
          {/* SCREEN SHARE PRESENTATION OVERLAY (If active) */}
          {isScreenSharing && (
            <div className="relative w-full h-80 md:h-[65%] bg-slate-900 rounded-2xl border-2 border-cyan-500/50 shadow-2xl overflow-hidden mb-3 flex flex-col">
              <div className="h-9 bg-slate-950/80 px-3 flex items-center justify-between text-xs text-slate-300 border-b border-white/10">
                <div className="flex items-center gap-2">
                  <MonitorUp className="w-4 h-4 text-cyan-400" />
                  <span className="font-semibold text-white">Presenting Screen: You</span>
                </div>
                <button
                  onClick={() => setIsScreenSharing(false)}
                  className="px-2 py-0.5 bg-rose-500/20 text-rose-300 hover:bg-rose-500 hover:text-white rounded transition-colors text-[11px]"
                >
                  Stop Presenting
                </button>
              </div>
              <div className="flex-1 flex flex-col items-center justify-center bg-gradient-to-br from-slate-950 to-slate-900 p-6 text-center">
                <div className="w-16 h-16 rounded-2xl bg-cyan-500/10 border border-cyan-500/30 flex items-center justify-center mb-3">
                  <MonitorUp className="w-8 h-8 text-cyan-400" />
                </div>
                <h4 className="text-base font-semibold text-white">Live Screen Broadcast Active</h4>
                <p className="text-xs text-slate-400 mt-1 max-w-md">
                  All participants in room <span className="font-mono text-cyan-400">{roomId}</span> are viewing your shared window.
                </p>
              </div>
            </div>
          )}

          {/* VIDEO TILES GRID / SPOTLIGHT */}
          <div
            className={`flex-1 w-full grid gap-3 ${
              layoutMode === 'spotlight' || pinnedId
                ? 'grid-cols-1 md:grid-cols-4 md:grid-rows-4'
                : participants.length <= 1
                ? 'grid-cols-1 md:grid-cols-2'
                : participants.length <= 3
                ? 'grid-cols-1 md:grid-cols-2'
                : 'grid-cols-2 md:grid-cols-3'
            }`}
          >
            {/* LOCAL USER TILE */}
            <div
              className={`relative rounded-2xl overflow-hidden border transition-all duration-300 flex flex-col items-center justify-center ${
                layoutMode === 'spotlight' && !pinnedId
                  ? 'md:col-span-3 md:row-span-4'
                  : 'min-h-[160px] md:min-h-[220px]'
              } ${
                isMicOn && micLevel > 30
                  ? 'border-cyan-400 shadow-lg shadow-cyan-500/20 ring-2 ring-cyan-400/40'
                  : 'border-white/10 bg-slate-900/90'
              } ${getBgClass()}`}
            >
              {isCamOn ? (
                <video
                  ref={localVideoRef}
                  autoPlay
                  playsInline
                  muted
                  className="w-full h-full object-cover -scale-x-100"
                />
              ) : (
                <div className="flex flex-col items-center gap-2">
                  <div className="w-16 h-16 md:w-20 md:h-20 rounded-full bg-cyan-500/20 border border-cyan-500/40 flex items-center justify-center text-cyan-300 font-bold text-xl md:text-2xl shadow-inner">
                    YOU
                  </div>
                  <span className="text-xs text-slate-400">Camera Off</span>
                </div>
              )}

              {/* Top status badges */}
              <div className="absolute top-2.5 left-2.5 flex items-center gap-1.5 z-10">
                <span className="px-2 py-0.5 rounded-md bg-black/60 backdrop-blur-md text-[11px] font-semibold text-white border border-white/10">
                  You (Host)
                </span>
                {mode === 'COMMITTEE' && (
                  <span className="px-2 py-0.5 rounded-md bg-blue-500/30 text-blue-200 border border-blue-500/40 text-[11px]">
                    🇺🇳 Chair
                  </span>
                )}
              </div>

              {/* Hand raised badge */}
              {isHandRaised && (
                <div className="absolute top-2.5 right-2.5 bg-amber-500 text-slate-950 p-1.5 rounded-full shadow-lg animate-bounce z-10">
                  <Hand className="w-4 h-4" />
                </div>
              )}

              {/* Bottom bar inside tile */}
              <div className="absolute bottom-2.5 left-2.5 right-2.5 flex items-center justify-between z-10">
                <div className="flex items-center gap-1.5 px-2 py-1 rounded-md bg-black/60 backdrop-blur-md border border-white/10">
                  {isMicOn ? (
                    <div className="flex items-center gap-1">
                      <Mic className="w-3.5 h-3.5 text-emerald-400" />
                      {/* VU Meter visualizer */}
                      <div className="flex items-end gap-0.5 h-3 w-4">
                        <div
                          className="w-1 bg-emerald-400 rounded-sm transition-all duration-75"
                          style={{ height: `${Math.min(100, micLevel * 1.1)}%` }}
                        />
                        <div
                          className="w-1 bg-emerald-400 rounded-sm transition-all duration-75"
                          style={{ height: `${Math.min(100, micLevel * 0.7)}%` }}
                        />
                        <div
                          className="w-1 bg-emerald-400 rounded-sm transition-all duration-75"
                          style={{ height: `${Math.min(100, micLevel * 1.3)}%` }}
                        />
                      </div>
                    </div>
                  ) : (
                    <MicOff className="w-3.5 h-3.5 text-rose-400" />
                  )}
                  <span className="text-[11px] text-slate-200 font-medium">You</span>
                </div>

                <div className="flex items-center gap-1">
                  {pinnedId === 'local' ? (
                    <button
                      onClick={() => setPinnedId(null)}
                      className="p-1 rounded bg-black/60 hover:bg-black/80 text-cyan-400 transition-colors"
                      title="Unpin"
                    >
                      <PinOff className="w-3.5 h-3.5" />
                    </button>
                  ) : (
                    <button
                      onClick={() => setPinnedId('local')}
                      className="p-1 rounded bg-black/60 hover:bg-black/80 text-slate-300 hover:text-white transition-colors"
                      title="Pin video"
                    >
                      <Pin className="w-3.5 h-3.5" />
                    </button>
                  )}
                </div>
              </div>
            </div>

            {/* REMOTE PARTICIPANT TILES */}
            {participants.map((peer) => {
              const isPinned = pinnedId === peer.id;
              const isSpotlighted = layoutMode === 'spotlight' && (pinnedId ? isPinned : peer.isSpeaking);

              return (
                <div
                  key={peer.id}
                  className={`relative rounded-2xl overflow-hidden border transition-all duration-300 flex flex-col items-center justify-center ${
                    isSpotlighted
                      ? 'md:col-span-3 md:row-span-4'
                      : 'min-h-[160px] md:min-h-[220px]'
                  } ${
                    peer.isSpeaking
                      ? 'border-emerald-400 shadow-lg shadow-emerald-500/20 ring-2 ring-emerald-400/40'
                      : 'border-white/10 bg-slate-900/80'
                  }`}
                >
                  {peer.isCameraOff ? (
                    <div className="flex flex-col items-center gap-2">
                      {peer.avatar ? (
                        <img
                          src={peer.avatar}
                          alt={peer.name}
                          className="w-16 h-16 md:w-20 md:h-20 rounded-full object-cover border-2 border-white/20 shadow-lg"
                        />
                      ) : (
                        <div className="w-16 h-16 md:w-20 md:h-20 rounded-full bg-slate-800 border border-white/20 flex items-center justify-center text-slate-300 font-bold text-xl">
                          {peer.name.slice(0, 2).toUpperCase()}
                        </div>
                      )}
                      <span className="text-xs text-slate-400">Camera Off</span>
                    </div>
                  ) : (
                    <div className="w-full h-full relative">
                      <img
                        src={peer.avatar}
                        alt={peer.name}
                        className="w-full h-full object-cover"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-black/30 pointer-events-none" />
                    </div>
                  )}

                  {/* Top status badges */}
                  <div className="absolute top-2.5 left-2.5 flex items-center gap-1.5 z-10">
                    <span className="px-2 py-0.5 rounded-md bg-black/60 backdrop-blur-md text-[11px] font-semibold text-white border border-white/10">
                      {peer.name}
                    </span>
                    {peer.countryFlag && (
                      <span className="px-2 py-0.5 rounded-md bg-black/60 backdrop-blur-md text-[11px] text-slate-200 border border-white/10">
                        {peer.countryFlag}
                      </span>
                    )}
                    <span className="px-1.5 py-0.5 rounded bg-white/10 text-[10px] text-slate-300 font-medium">
                      {peer.role}
                    </span>
                  </div>

                  {/* Hand raise badge */}
                  {peer.isHandRaised && (
                    <div className="absolute top-2.5 right-2.5 bg-amber-500 text-slate-950 p-1.5 rounded-full shadow-lg animate-bounce z-10">
                      <Hand className="w-4 h-4" />
                    </div>
                  )}

                  {/* Bottom bar inside tile */}
                  <div className="absolute bottom-2.5 left-2.5 right-2.5 flex items-center justify-between z-10">
                    <div className="flex items-center gap-1.5 px-2 py-1 rounded-md bg-black/60 backdrop-blur-md border border-white/10">
                      {peer.isMuted ? (
                        <MicOff className="w-3.5 h-3.5 text-rose-400" />
                      ) : (
                        <div className="flex items-center gap-1">
                          <Mic className="w-3.5 h-3.5 text-emerald-400" />
                          {peer.isSpeaking && (
                            <div className="flex items-end gap-0.5 h-3 w-4">
                              <div className="w-1 h-3 bg-emerald-400 rounded-sm animate-pulse" />
                              <div className="w-1 h-2 bg-emerald-400 rounded-sm animate-pulse delay-75" />
                              <div className="w-1 h-3 bg-emerald-400 rounded-sm animate-pulse delay-150" />
                            </div>
                          )}
                        </div>
                      )}
                      <span className="text-[11px] text-slate-200 font-medium">@{peer.handle}</span>
                    </div>

                    <div className="flex items-center gap-1">
                      {isPinned ? (
                        <button
                          onClick={() => setPinnedId(null)}
                          className="p-1 rounded bg-black/60 hover:bg-black/80 text-cyan-400 transition-colors"
                          title="Unpin"
                        >
                          <PinOff className="w-3.5 h-3.5" />
                        </button>
                      ) : (
                        <button
                          onClick={() => setPinnedId(peer.id)}
                          className="p-1 rounded bg-black/60 hover:bg-black/80 text-slate-300 hover:text-white transition-colors"
                          title="Pin video"
                        >
                          <Pin className="w-3.5 h-3.5" />
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          {/* FLOATING PARTICLES (REACTIONS) */}
          <div className="absolute inset-0 pointer-events-none overflow-hidden z-20">
            {floatingReactions.map((reaction) => (
              <div
                key={reaction.id}
                style={{ left: `${reaction.x}%` }}
                className="absolute bottom-16 text-3xl md:text-4xl animate-float-reaction"
              >
                {reaction.emoji}
              </div>
            ))}
          </div>
        </main>

        {/* 3. SIDE DRAWERS (CHAT, PARTICIPANTS, POLLS/QA, MUN) */}
        {activeDrawer && (
          <aside className="w-full md:w-80 lg:w-96 border-l border-white/10 bg-slate-950/95 backdrop-blur-xl flex flex-col z-30 shrink-0">
            {/* IN-CALL CHAT DRAWER */}
            {activeDrawer === 'chat' && (
              <div className="flex-1 flex flex-col h-full">
                <div className="p-3 border-b border-white/10 flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <MessageSquare className="w-4 h-4 text-cyan-400" />
                    <h3 className="text-sm font-semibold text-white">In-Call Messages</h3>
                  </div>
                  <button
                    onClick={() => setActiveDrawer(null)}
                    className="p-1 text-slate-400 hover:text-white rounded-md hover:bg-white/10"
                  >
                    ✕
                  </button>
                </div>

                {/* Target selector */}
                <div className="px-3 py-2 border-b border-white/10 bg-white/5 flex items-center justify-between text-xs text-slate-300">
                  <span>Send to:</span>
                  <select
                    value={chatTarget}
                    onChange={(e) => setChatTarget(e.target.value as 'everyone' | 'host')}
                    aria-label="Send message target"
                    className="bg-slate-900 border border-white/20 rounded px-2 py-1 text-xs text-white outline-none focus:border-cyan-400"
                  >
                    <option value="everyone">Everyone</option>
                    <option value="host">Host Only (Private)</option>
                  </select>
                </div>

                {/* Messages feed */}
                <div className="flex-1 p-3 overflow-y-auto space-y-3">
                  {chatMessages.map((msg) => (
                    <div key={msg.id} className="flex flex-col gap-0.5">
                      <div className="flex items-center justify-between text-[11px] text-slate-400">
                        <span className="font-semibold text-slate-300">
                          {msg.senderName}
                          {msg.target === 'host' && (
                            <span className="ml-1 text-amber-400 font-normal">(Private)</span>
                          )}
                        </span>
                        <span>{msg.timestamp}</span>
                      </div>
                      <div className="p-2.5 rounded-xl bg-white/5 border border-white/10 text-xs text-slate-200">
                        {msg.text}
                      </div>
                    </div>
                  ))}
                </div>

                {/* Input box */}
                <form onSubmit={handleSendMessage} className="p-3 border-t border-white/10 flex items-center gap-2">
                  <input
                    type="text"
                    value={chatInput}
                    onChange={(e) => setChatInput(e.target.value)}
                    placeholder={chatTarget === 'host' ? 'Message host privately...' : 'Message everyone...'}
                    className="flex-1 bg-white/5 border border-white/10 rounded-xl px-3 py-2 text-xs text-white placeholder-slate-500 outline-none focus:border-cyan-400"
                  />
                  <button
                    type="submit"
                    className="p-2 bg-cyan-500 hover:bg-cyan-400 text-slate-950 rounded-xl transition-colors shrink-0"
                  >
                    <Send className="w-3.5 h-3.5" />
                  </button>
                </form>
              </div>
            )}

            {/* PARTICIPANTS DRAWER */}
            {activeDrawer === 'participants' && (
              <div className="flex-1 flex flex-col h-full">
                <div className="p-3 border-b border-white/10 flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Users className="w-4 h-4 text-cyan-400" />
                    <h3 className="text-sm font-semibold text-white">
                      Participants ({participants.length + 1})
                    </h3>
                  </div>
                  <button
                    onClick={() => setActiveDrawer(null)}
                    className="p-1 text-slate-400 hover:text-white rounded-md hover:bg-white/10"
                  >
                    ✕
                  </button>
                </div>

                {/* Host actions */}
                <div className="p-3 border-b border-white/10 grid grid-cols-2 gap-2 bg-white/5">
                  <button
                    onClick={handleMuteAll}
                    className="px-2.5 py-1.5 bg-rose-500/20 hover:bg-rose-500/30 text-rose-300 border border-rose-500/30 rounded-lg text-xs font-medium transition-colors"
                  >
                    Mute All
                  </button>
                  <button
                    onClick={handleLowerAllHands}
                    className="px-2.5 py-1.5 bg-amber-500/20 hover:bg-amber-500/30 text-amber-300 border border-amber-500/30 rounded-lg text-xs font-medium transition-colors"
                  >
                    Lower All Hands
                  </button>
                </div>

                {/* Participant list */}
                <div className="flex-1 p-3 overflow-y-auto space-y-2">
                  {/* You */}
                  <div className="p-2 rounded-xl bg-cyan-500/10 border border-cyan-500/20 flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <div className="w-7 h-7 rounded-full bg-cyan-500/30 flex items-center justify-center text-cyan-300 text-xs font-bold">
                        Y
                      </div>
                      <div>
                        <div className="text-xs font-semibold text-white">You (Host)</div>
                        <div className="text-[10px] text-cyan-400">Local Stream</div>
                      </div>
                    </div>
                    <div className="flex items-center gap-1.5">
                      {isMicOn ? <Mic className="w-3.5 h-3.5 text-emerald-400" /> : <MicOff className="w-3.5 h-3.5 text-rose-400" />}
                      {isCamOn ? <Video className="w-3.5 h-3.5 text-emerald-400" /> : <VideoOff className="w-3.5 h-3.5 text-rose-400" />}
                    </div>
                  </div>

                  {/* Remote peers */}
                  {participants.map((peer) => (
                    <div
                      key={peer.id}
                      className="p-2 rounded-xl bg-white/5 border border-white/10 flex items-center justify-between hover:bg-white/10 transition-colors"
                    >
                      <div className="flex items-center gap-2">
                        {peer.avatar ? (
                          <img src={peer.avatar} alt={peer.name} className="w-7 h-7 rounded-full object-cover" />
                        ) : (
                          <div className="w-7 h-7 rounded-full bg-slate-800 flex items-center justify-center text-xs font-bold text-slate-300">
                            {peer.name.slice(0, 1)}
                          </div>
                        )}
                        <div>
                          <div className="text-xs font-medium text-white flex items-center gap-1">
                            <span>{peer.name}</span>
                            {peer.countryFlag && <span className="text-[10px]">{peer.countryFlag}</span>}
                          </div>
                          <div className="text-[10px] text-slate-400">{peer.role}</div>
                        </div>
                      </div>

                      <div className="flex items-center gap-1.5">
                        {peer.isHandRaised && (
                          <Hand className="w-3.5 h-3.5 text-amber-400 animate-bounce" />
                        )}
                        {peer.isMuted ? (
                          <MicOff className="w-3.5 h-3.5 text-rose-400" />
                        ) : (
                          <Mic className="w-3.5 h-3.5 text-emerald-400" />
                        )}
                        {peer.isCameraOff ? (
                          <VideoOff className="w-3.5 h-3.5 text-rose-400" />
                        ) : (
                          <Video className="w-3.5 h-3.5 text-emerald-400" />
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* POLLS & Q&A DRAWER */}
            {activeDrawer === 'polls' && (
              <div className="flex-1 flex flex-col h-full">
                <div className="p-3 border-b border-white/10 flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Vote className="w-4 h-4 text-cyan-400" />
                    <h3 className="text-sm font-semibold text-white">Live Polls & Q&A</h3>
                  </div>
                  <button
                    onClick={() => setActiveDrawer(null)}
                    className="p-1 text-slate-400 hover:text-white rounded-md hover:bg-white/10"
                  >
                    ✕
                  </button>
                </div>

                {/* Sub tabs */}
                <div className="flex border-b border-white/10 bg-white/5 text-xs">
                  <button
                    onClick={() => setQaActiveTab('polls')}
                    className={`flex-1 py-2 font-medium border-b-2 transition-colors ${
                      qaActiveTab === 'polls'
                        ? 'border-cyan-400 text-cyan-400'
                        : 'border-transparent text-slate-400 hover:text-white'
                    }`}
                  >
                    Polls ({polls.length})
                  </button>
                  <button
                    onClick={() => setQaActiveTab('qa')}
                    className={`flex-1 py-2 font-medium border-b-2 transition-colors ${
                      qaActiveTab === 'qa'
                        ? 'border-cyan-400 text-cyan-400'
                        : 'border-transparent text-slate-400 hover:text-white'
                    }`}
                  >
                    Q&A ({questions.length})
                  </button>
                </div>

                {/* Content */}
                <div className="flex-1 p-3 overflow-y-auto space-y-4">
                  {qaActiveTab === 'polls' ? (
                    <>
                      {/* Create Poll Form */}
                      <form onSubmit={handleCreatePoll} className="p-3 rounded-xl bg-white/5 border border-white/10 space-y-2">
                        <div className="text-xs font-semibold text-slate-200">Launch New Poll</div>
                        <input
                          type="text"
                          value={newPollQuestion}
                          onChange={(e) => setNewPollQuestion(e.target.value)}
                          placeholder="Ask a question..."
                          className="w-full bg-slate-900 border border-white/10 rounded-lg px-2.5 py-1.5 text-xs text-white placeholder-slate-500 outline-none focus:border-cyan-400"
                        />
                        {newPollOpts.map((opt, i) => (
                          <input
                            key={i}
                            type="text"
                            value={opt}
                            onChange={(e) => {
                              const copy = [...newPollOpts];
                              copy[i] = e.target.value;
                              setNewPollOpts(copy);
                            }}
                            placeholder={`Option ${i + 1}`}
                            className="w-full bg-slate-900 border border-white/10 rounded-lg px-2.5 py-1 text-xs text-white placeholder-slate-500 outline-none focus:border-cyan-400"
                          />
                        ))}
                        <div className="flex justify-between pt-1">
                          <button
                            type="button"
                            onClick={() => setNewPollOpts([...newPollOpts, ''])}
                            className="text-[11px] text-cyan-400 hover:underline flex items-center gap-1"
                          >
                            <Plus className="w-3 h-3" /> Add Option
                          </button>
                          <button
                            type="submit"
                            className="px-3 py-1 bg-cyan-500 hover:bg-cyan-400 text-slate-950 rounded-lg text-xs font-semibold transition-colors"
                          >
                            Launch Poll
                          </button>
                        </div>
                      </form>

                      {/* Active Polls */}
                      {polls.map((poll) => (
                        <div key={poll.id} className="p-3 rounded-xl bg-white/5 border border-white/10 space-y-2.5">
                          <div className="text-xs font-semibold text-white leading-snug">{poll.question}</div>
                          <div className="space-y-1.5">
                            {poll.options.map((opt) => {
                              const pct = poll.totalVotes > 0 ? Math.round((opt.votes / poll.totalVotes) * 100) : 0;
                              const isSelected = poll.userVotedOptionId === opt.id;
                              return (
                                <button
                                  key={opt.id}
                                  disabled={!!poll.userVotedOptionId}
                                  onClick={() => handleVotePoll(poll.id, opt.id)}
                                  className={`w-full text-left p-2 rounded-lg text-xs relative overflow-hidden transition-all ${
                                    isSelected
                                      ? 'bg-cyan-500/20 border border-cyan-500/40 text-cyan-200'
                                      : 'bg-white/5 border border-white/10 text-slate-200 hover:bg-white/10'
                                  }`}
                                >
                                  {/* Progress fill */}
                                  <div
                                    className="absolute inset-y-0 left-0 bg-cyan-500/20 rounded-lg pointer-events-none transition-all duration-500"
                                    style={{ width: `${pct}%` }}
                                  />
                                  <div className="relative flex items-center justify-between z-10">
                                    <span className="font-medium">{opt.text}</span>
                                    <span className="font-mono text-[11px] text-slate-400">
                                      {pct}% ({opt.votes})
                                    </span>
                                  </div>
                                </button>
                              );
                            })}
                          </div>
                          <div className="text-[10px] text-slate-400 flex items-center justify-between pt-1">
                            <span>Created by {poll.createdBy}</span>
                            <span>{poll.totalVotes} total votes</span>
                          </div>
                        </div>
                      ))}
                    </>
                  ) : (
                    <>
                      {/* Submit Question */}
                      <form onSubmit={handleSubmitQuestion} className="flex gap-2">
                        <input
                          type="text"
                          value={newQuestionText}
                          onChange={(e) => setNewQuestionText(e.target.value)}
                          placeholder="Ask a question to presenters..."
                          className="flex-1 bg-white/5 border border-white/10 rounded-xl px-3 py-1.5 text-xs text-white placeholder-slate-500 outline-none focus:border-cyan-400"
                        />
                        <button
                          type="submit"
                          className="px-3 py-1.5 bg-cyan-500 hover:bg-cyan-400 text-slate-950 rounded-xl text-xs font-semibold"
                        >
                          Ask
                        </button>
                      </form>

                      {/* Question feed */}
                      {questions.map((q) => (
                        <div key={q.id} className="p-3 rounded-xl bg-white/5 border border-white/10 space-y-1.5">
                          <div className="flex items-center justify-between text-[11px] text-slate-400">
                            <span className="font-medium text-slate-300">{q.authorName}</span>
                            <span>{q.timestamp}</span>
                          </div>
                          <div className="text-xs text-white leading-relaxed">{q.question}</div>
                          <div className="flex items-center justify-between pt-1">
                            {q.isAnswered ? (
                              <span className="text-[10px] font-semibold text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded border border-emerald-500/20">
                                Answered Live
                              </span>
                            ) : (
                              <span className="text-[10px] text-slate-400">Open Question</span>
                            )}
                            <button
                              onClick={() => handleUpvoteQuestion(q.id)}
                              className="flex items-center gap-1 text-xs text-cyan-400 hover:text-cyan-300 bg-cyan-500/10 px-2 py-0.5 rounded-lg border border-cyan-500/20 transition-colors"
                            >
                              <ThumbsUp className="w-3 h-3" />
                              <span>{q.upvotes}</span>
                            </button>
                          </div>
                        </div>
                      ))}
                    </>
                  )}
                </div>
              </div>
            )}

            {/* MUN COMMITTEE CHAMBER DRAWER */}
            {activeDrawer === 'mun' && (
              <div className="flex-1 flex flex-col h-full overflow-hidden">
                <div className="p-3 border-b border-white/10 flex items-center justify-between bg-slate-950">
                  <div className="flex items-center gap-2">
                    <Gavel className="w-4 h-4 text-cyan-400" />
                    <h3 className="text-sm font-semibold text-white">MUN Rules of Procedure</h3>
                  </div>
                  <button
                    onClick={() => setActiveDrawer(null)}
                    className="p-1 text-slate-400 hover:text-white rounded-md hover:bg-white/10"
                  >
                    ✕
                  </button>
                </div>
                <div className="flex-1 overflow-y-auto">
                  <MunCommitteeChamber committeeName="UN Security Council (UNSC)" isChair={true} />
                </div>
              </div>
            )}
          </aside>
        )}
      </div>

      {/* 4. BOTTOM CONTROL DOCK */}
      <footer className="h-18 md:h-20 border-t border-white/10 bg-slate-950/95 backdrop-blur-2xl px-4 flex items-center justify-between z-30 shrink-0">
        {/* Left: Device Toggles (Mic & Camera) */}
        <div className="flex items-center gap-2">
          {/* Mic Button */}
          <button
            onClick={() => setIsMicOn(!isMicOn)}
            className={`p-3 rounded-2xl flex items-center justify-center transition-all ${
              isMicOn
                ? 'bg-white/10 hover:bg-white/15 text-white'
                : 'bg-rose-500 hover:bg-rose-600 text-white shadow-lg shadow-rose-500/30'
            }`}
            title={isMicOn ? 'Mute Microphone' : 'Unmute Microphone'}
          >
            {isMicOn ? <Mic className="w-5 h-5" /> : <MicOff className="w-5 h-5" />}
          </button>

          {/* Camera Button */}
          <button
            onClick={() => setIsCamOn(!isCamOn)}
            className={`p-3 rounded-2xl flex items-center justify-center transition-all ${
              isCamOn
                ? 'bg-white/10 hover:bg-white/15 text-white'
                : 'bg-rose-500 hover:bg-rose-600 text-white shadow-lg shadow-rose-500/30'
            }`}
            title={isCamOn ? 'Turn Camera Off' : 'Turn Camera On'}
          >
            {isCamOn ? <Video className="w-5 h-5" /> : <VideoOff className="w-5 h-5" />}
          </button>

          {/* Screen Share */}
          <button
            onClick={handleToggleScreenShare}
            className={`p-3 rounded-2xl flex items-center justify-center transition-all ${
              isScreenSharing
                ? 'bg-cyan-500 text-slate-950 font-bold shadow-lg shadow-cyan-500/30'
                : 'bg-white/10 hover:bg-white/15 text-white'
            }`}
            title="Share Screen"
          >
            <MonitorUp className="w-5 h-5" />
          </button>
        </div>

        {/* Center: Collaboration Tools & Reactions */}
        <div className="flex items-center gap-1.5 md:gap-2">
          {/* Hand Raise */}
          <button
            onClick={() => setIsHandRaised(!isHandRaised)}
            className={`px-3 md:px-4 py-2.5 rounded-2xl flex items-center gap-2 text-xs font-semibold transition-all ${
              isHandRaised
                ? 'bg-amber-500 text-slate-950 shadow-lg shadow-amber-500/30 ring-2 ring-amber-400'
                : 'bg-white/10 hover:bg-white/15 text-white'
            }`}
          >
            <Hand className="w-4 h-4" />
            <span className="hidden sm:inline">{isHandRaised ? 'Hand Raised' : 'Raise Hand'}</span>
          </button>

          {/* Emoji Reactions Popover */}
          <div className="relative">
            <button
              onClick={() => setShowReactionPicker(!showReactionPicker)}
              className="p-3 rounded-2xl bg-white/10 hover:bg-white/15 text-white transition-all flex items-center justify-center"
              title="Reactions"
            >
              <Smile className="w-5 h-5" />
            </button>

            {showReactionPicker && (
              <div className="absolute bottom-16 left-1/2 -translate-x-1/2 p-2 bg-slate-900 border border-white/20 rounded-2xl shadow-2xl flex items-center gap-2 z-50 backdrop-blur-2xl">
                {['👍', '❤️', '👏', '🔥', '⚡', '🎉', '🚀', '💯'].map((emoji) => (
                  <button
                    key={emoji}
                    onClick={() => triggerReaction(emoji)}
                    className="text-2xl hover:scale-130 transition-transform p-1 rounded hover:bg-white/10"
                  >
                    {emoji}
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Polls & Q&A Toggle */}
          <button
            onClick={() => setActiveDrawer(activeDrawer === 'polls' ? null : 'polls')}
            className={`p-3 rounded-2xl transition-all flex items-center justify-center ${
              activeDrawer === 'polls'
                ? 'bg-cyan-500 text-slate-950 font-bold'
                : 'bg-white/10 hover:bg-white/15 text-white'
            }`}
            title="Polls & Q&A"
          >
            <Vote className="w-5 h-5" />
          </button>

          {/* MUN Chamber Toggle (Always available or highlighted if mode === COMMITTEE) */}
          <button
            onClick={() => setActiveDrawer(activeDrawer === 'mun' ? null : 'mun')}
            className={`p-3 rounded-2xl transition-all flex items-center justify-center ${
              activeDrawer === 'mun'
                ? 'bg-cyan-500 text-slate-950 font-bold'
                : mode === 'COMMITTEE'
                ? 'bg-cyan-500/20 text-cyan-400 border border-cyan-500/30'
                : 'bg-white/10 hover:bg-white/15 text-white'
            }`}
            title="MUN Committee Rules"
          >
            <Gavel className="w-5 h-5" />
          </button>
        </div>

        {/* Right: Chat, Participants & End Call */}
        <div className="flex items-center gap-2">
          {/* Chat drawer button */}
          <button
            onClick={() => setActiveDrawer(activeDrawer === 'chat' ? null : 'chat')}
            className={`p-3 rounded-2xl transition-all flex items-center justify-center relative ${
              activeDrawer === 'chat'
                ? 'bg-cyan-500 text-slate-950 font-bold'
                : 'bg-white/10 hover:bg-white/15 text-white'
            }`}
            title="In-Call Chat"
          >
            <MessageSquare className="w-5 h-5" />
            <span className="absolute top-2 right-2 w-2 h-2 rounded-full bg-cyan-400" />
          </button>

          {/* Participants drawer button */}
          <button
            onClick={() => setActiveDrawer(activeDrawer === 'participants' ? null : 'participants')}
            className={`p-3 rounded-2xl transition-all flex items-center justify-center ${
              activeDrawer === 'participants'
                ? 'bg-cyan-500 text-slate-950 font-bold'
                : 'bg-white/10 hover:bg-white/15 text-white'
            }`}
            title="Participants"
          >
            <Users className="w-5 h-5" />
          </button>

          {/* Leave / End Call */}
          <button
            onClick={handleLeaveCall}
            className="px-4 py-3 rounded-2xl bg-rose-600 hover:bg-rose-700 text-white font-semibold text-xs flex items-center gap-1.5 shadow-lg shadow-rose-600/30 transition-all hover:scale-105"
            title="Leave Call"
          >
            <PhoneOff className="w-4 h-4" />
            <span className="hidden md:inline">Leave</span>
          </button>
        </div>
      </footer>

      {/* 5. WHITEBOARD MODAL / OVERLAY */}
      <ZenWhiteboard
        isOpen={isWhiteboardOpen}
        onClose={() => setIsWhiteboardOpen(false)}
        onExportToDocs={(canvasDataUrl) => {
          if (typeof window !== 'undefined') {
            localStorage.setItem('zen_whiteboard_export_last', canvasDataUrl);
          }
        }}
      />
    </div>
  );
}
