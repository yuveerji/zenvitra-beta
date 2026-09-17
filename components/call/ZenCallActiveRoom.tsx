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
  Share2,
  Smartphone,
  LayoutDashboard,
  Wifi,
  Zap,
  RotateCcw,
  Compass,
  ExternalLink,
  QrCode
} from 'lucide-react';

const WhatsAppIcon = ({ className = "w-4 h-4" }: { className?: string }) => (
  <svg viewBox="0 0 24 24" fill="currentColor" className={className}>
    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z" />
  </svg>
);
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
  CALL: [],
  GROUP: [],
  ROOM: [],
  EVENT: [],
  LIVE: [],
  COMMITTEE: [],
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
  const [callDuration, setCallDuration] = useState(0); // seconds
  const [isCopied, setIsCopied] = useState(false);
  const [layoutMode, setLayoutMode] = useState<'grid' | 'spotlight' | 'sidebar' | 'whatsapp'>('grid');
  const [pinnedId, setPinnedId] = useState<string | null>(null);
  const [isPipFloating, setIsPipFloating] = useState(false);
  const [pipCorner, setPipCorner] = useState<'top-right' | 'bottom-right' | 'bottom-left' | 'top-left'>('bottom-right');
  const [showLayoutSelector, setShowLayoutSelector] = useState(false);
  const [showSpeedDialModal, setShowSpeedDialModal] = useState(false);
  const [showShareModal, setShowShareModal] = useState(false);

  // Drawers and Modals
  const [activeDrawer, setActiveDrawer] = useState<'chat' | 'participants' | 'polls' | 'breakout' | 'mun' | null>(
    paramMode === 'COMMITTEE' ? 'mun' : null
  );
  const [isWhiteboardOpen, setIsWhiteboardOpen] = useState(false);
  const [showReactionPicker, setShowReactionPicker] = useState(false);
  const [showSettingsModal, setShowSettingsModal] = useState(false);

  // Participants
  const [participants, setParticipants] = useState<CallParticipant[]>([]);

  // Floating Reactions
  const [floatingReactions, setFloatingReactions] = useState<{ id: string; emoji: string; x: number }[]>([]);

  // In-Call Chat
  const [chatMessages, setChatMessages] = useState<CallMessage[]>([]);
  const [chatInput, setChatInput] = useState('');
  const [chatTarget, setChatTarget] = useState<'everyone' | 'host'>('everyone');

  // Polls
  const [polls, setPolls] = useState<CallPoll[]>([]);
  const [newPollQuestion, setNewPollQuestion] = useState('');
  const [newPollOpts, setNewPollOpts] = useState(['', '']);

  // Q&A
  const [questions, setQuestions] = useState<CallQuestion[]>([]);
  const [newQuestionText, setNewQuestionText] = useState('');
  const [qaActiveTab, setQaActiveTab] = useState<'polls' | 'qa'>('polls');

  // Breakout Rooms
  const [breakoutRooms, setBreakoutRooms] = useState<BreakoutRoom[]>([]);
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

  const getPipClasses = () => {
    switch (pipCorner) {
      case 'top-right':
        return 'top-20 right-6';
      case 'top-left':
        return 'top-20 left-6';
      case 'bottom-left':
        return 'bottom-28 left-6';
      case 'bottom-right':
      default:
        return 'bottom-28 right-6';
    }
  };

  const cyclePipCorner = () => {
    const corners: ('top-right' | 'bottom-right' | 'bottom-left' | 'top-left')[] = [
      'bottom-right', 'bottom-left', 'top-left', 'top-right'
    ];
    const currentIndex = corners.indexOf(pipCorner);
    setPipCorner(corners[(currentIndex + 1) % corners.length]);
  };

  const handleShareToWhatsApp = () => {
    const inviteUrl = typeof window !== 'undefined' ? `${window.location.origin}/call/${roomId}` : `https://zenvitra.xyz/call/${roomId}`;
    const text = encodeURIComponent(`Join my live encrypted ZEN.CALL room on Zenvitra:\n${inviteUrl}\nRoom: ${roomId}`);
    window.open(`https://api.whatsapp.com/send?text=${text}`, '_blank');
  };

  return (
    <div className="relative w-full h-[calc(100vh-4rem)] bg-black text-white flex flex-col overflow-hidden select-none">
      {/* 1. TOP BAR */}
      <header className="h-14 border-b border-white/10 bg-slate-950/85 backdrop-blur-2xl px-3 sm:px-4 flex items-center justify-between z-30 shrink-0">
        {/* Left: Mode badge, Room Code & Speed-Dial */}
        <div className="flex items-center gap-2 sm:gap-3">
          <div className="flex items-center gap-2 px-2.5 py-1 rounded-full bg-cyan-500/10 border border-cyan-500/30 text-cyan-400 text-xs font-semibold tracking-wider uppercase">
            <Radio className="w-3.5 h-3.5 animate-pulse text-cyan-400" />
            <span className="hidden sm:inline">{mode}</span>
          </div>

          <div className="flex items-center gap-2 bg-white/5 hover:bg-white/10 border border-white/10 rounded-lg px-2.5 py-1 text-xs text-slate-300 font-mono transition-colors">
            <span>{roomId}</span>
            <button
              onClick={handleCopyLink}
              title="Copy room invite link"
              className="text-slate-400 hover:text-white transition-colors"
            >
              {isCopied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
            </button>
          </div>

          {/* Speed-Dial Button */}
          <button
            onClick={() => setShowSpeedDialModal(true)}
            className="hidden md:flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-white/5 hover:bg-white/10 border border-white/10 text-xs font-medium text-slate-300 hover:text-white transition-colors"
            title="Speed-Dial to another chamber or lounge"
          >
            <Compass className="w-3.5 h-3.5 text-cyan-400" />
            <span>Chambers</span>
          </button>

          {/* E2E Security Badge */}
          <div className="hidden lg:flex items-center gap-1.5 text-xs text-emerald-400 bg-emerald-500/10 px-2.5 py-1 rounded-md border border-emerald-500/20">
            <ShieldCheck className="w-3.5 h-3.5" />
            <span className="font-medium font-mono text-[11px]">E2EE 256-Bit Quantum-Safe</span>
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

        {/* Center: Call Timer, Network Quality & Recording Status */}
        <div className="flex items-center gap-2 sm:gap-3">
          <div className="text-xs sm:text-sm font-mono text-slate-200 bg-white/5 border border-white/10 px-3 py-1 rounded-full flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            <span>{formatDuration(callDuration)}</span>
          </div>

          <div className="hidden md:flex items-center gap-1.5 px-2 py-0.5 rounded-full bg-white/5 border border-white/10 text-[11px] font-mono text-slate-400">
            <Wifi className="w-3 h-3 text-emerald-400" />
            <span>18ms</span>
          </div>

          {isRecording && (
            <div className="flex items-center gap-1.5 bg-rose-500/20 text-rose-400 border border-rose-500/30 px-2.5 py-1 rounded-full text-xs font-semibold animate-pulse">
              <Circle className="w-2.5 h-2.5 fill-rose-500" />
              <span>REC</span>
            </div>
          )}
        </div>

        {/* Right: Layout Switcher, WhatsApp Share, PiP, Whiteboard */}
        <div className="flex items-center gap-1.5 sm:gap-2">
          {handsRaisedCount > 0 && (
            <div className="flex items-center gap-1.5 bg-amber-500/20 text-amber-300 border border-amber-500/30 px-2.5 py-1 rounded-lg text-xs font-medium animate-bounce">
              <Hand className="w-3.5 h-3.5" />
              <span>{handsRaisedCount} Raised</span>
            </div>
          )}

          {/* WhatsApp 1-Click Invite */}
          <button
            onClick={() => setShowShareModal(true)}
            className="flex items-center gap-1 px-2.5 py-1.5 rounded-lg text-xs font-semibold bg-emerald-500/15 text-emerald-400 border border-emerald-500/30 hover:bg-emerald-500 hover:text-slate-950 transition-all shadow-sm"
            title="Invite via WhatsApp or Copy Link"
          >
            <WhatsAppIcon className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Invite</span>
          </button>

          {/* Whiteboard Button */}
          <button
            onClick={() => setIsWhiteboardOpen(!isWhiteboardOpen)}
            className={`hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
              isWhiteboardOpen
                ? 'bg-cyan-500 text-slate-950 font-bold shadow-lg shadow-cyan-500/20'
                : 'bg-white/10 text-slate-300 hover:bg-white/15'
            }`}
          >
            <PenTool className="w-3.5 h-3.5" />
            <span>Whiteboard</span>
          </button>

          {/* Floating PiP Toggle */}
          <button
            onClick={() => setIsPipFloating(!isPipFloating)}
            className={`p-1.5 rounded-lg transition-colors ${
              isPipFloating
                ? 'bg-cyan-500 text-slate-950 font-bold'
                : 'text-slate-400 hover:text-white hover:bg-white/10'
            }`}
            title={isPipFloating ? 'Dock self-view back to grid' : 'Pop out self-view as Floating PiP'}
          >
            <Smartphone className="w-4 h-4" />
          </button>

          {/* Google Meet Layout Mode Dropdown */}
          <div className="relative">
            <button
              onClick={() => setShowLayoutSelector(!showLayoutSelector)}
              className="flex items-center gap-1 p-1.5 text-slate-300 hover:text-white hover:bg-white/10 rounded-lg transition-colors border border-white/10"
              title="Change Layout Mode"
            >
              {layoutMode === 'grid' && <Grid className="w-4 h-4 text-cyan-400" />}
              {layoutMode === 'spotlight' && <SidebarIcon className="w-4 h-4 text-cyan-400" />}
              {layoutMode === 'sidebar' && <LayoutDashboard className="w-4 h-4 text-cyan-400" />}
              {layoutMode === 'whatsapp' && <Smartphone className="w-4 h-4 text-emerald-400" />}
              <ChevronDown className="w-3 h-3 text-slate-400" />
            </button>

            {showLayoutSelector && (
              <div className="absolute right-0 top-11 w-52 bg-slate-950 border border-white/15 rounded-2xl p-2 shadow-2xl z-50 backdrop-blur-2xl space-y-1">
                <div className="text-[10px] font-mono uppercase tracking-wider text-slate-400 px-2 py-1">Layout Views</div>
                {[
                  { id: 'grid', label: 'Tiled Grid (Auto)', desc: 'Balanced equal tiles', icon: Grid },
                  { id: 'spotlight', label: 'Speaker Spotlight', desc: 'Focus active presenter', icon: SidebarIcon },
                  { id: 'sidebar', label: 'Sidebar Filmstrip', desc: 'Stage + right queue', icon: LayoutDashboard },
                  { id: 'whatsapp', label: 'WhatsApp 1:1 View', desc: 'Immersive peer phone view', icon: Smartphone }
                ].map((item) => {
                  const Icon = item.icon;
                  const active = layoutMode === item.id;
                  return (
                    <button
                      key={item.id}
                      onClick={() => {
                        setLayoutMode(item.id as any);
                        setShowLayoutSelector(false);
                      }}
                      className={`w-full p-2 rounded-xl flex items-center gap-2.5 text-left transition-colors ${
                        active ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/30' : 'hover:bg-white/10 text-slate-300'
                      }`}
                    >
                      <Icon className={`w-4 h-4 ${active ? 'text-cyan-400' : 'text-slate-400'}`} />
                      <div>
                        <div className="text-xs font-semibold">{item.label}</div>
                        <div className="text-[10px] text-slate-400">{item.desc}</div>
                      </div>
                    </button>
                  );
                })}
              </div>
            )}
          </div>
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

          {/* VIDEO TILES VIEWPORT WITH GOOGLE MEET & WHATSAPP LAYOUT MODES */}
          {layoutMode === 'whatsapp' ? (
            /* WHATSAPP 1:1 IMMERSIVE MOBILE / CINEMATIC VIEW */
            <div className="flex-1 w-full relative flex items-center justify-center overflow-hidden rounded-3xl border border-white/15 bg-slate-950 shadow-2xl">
              {!participants[0] ? (
                <div className="flex flex-col items-center justify-center p-8 text-center max-w-md">
                  <div className="w-16 h-16 rounded-full bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400 mb-4">
                    <WhatsAppIcon className="w-8 h-8" />
                  </div>
                  <h3 className="text-xl font-bold text-white">You&apos;re the only one here</h3>
                  <p className="text-xs text-slate-400 mt-2 leading-relaxed">
                    Share this meeting link with others to start your 1:1 WhatsApp or Sovereign session.
                  </p>
                  <div className="mt-5 w-full flex items-center gap-2 p-1.5 rounded-2xl bg-black/70 border border-white/15">
                    <div className="flex-1 px-3 py-1 text-xs font-mono text-emerald-400 truncate text-left">
                      {typeof window !== 'undefined' ? `${window.location.origin}/call/${roomId}` : `https://zenvitra.xyz/call/${roomId}`}
                    </div>
                    <button
                      onClick={handleCopyLink}
                      className="px-3.5 py-1.5 rounded-xl bg-white/10 hover:bg-white/20 text-white font-mono text-xs font-semibold flex items-center gap-1.5 transition-colors"
                    >
                      {isCopied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                      <span>{isCopied ? 'Copied' : 'Copy'}</span>
                    </button>
                  </div>
                  <button
                    onClick={() => setShowShareModal(true)}
                    className="mt-3 w-full py-2.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 text-xs font-bold flex items-center justify-center gap-2 transition-colors shadow-lg shadow-emerald-500/20"
                  >
                    <WhatsAppIcon className="w-4 h-4" />
                    <span>Invite via WhatsApp</span>
                  </button>
                </div>
              ) : (
                <div className="relative w-full h-full flex items-center justify-center">
                  {participants[0].isCameraOff ? (
                    <div className="flex flex-col items-center gap-4 text-center z-10">
                      {participants[0].avatar ? (
                        <img
                          src={participants[0].avatar}
                          alt={participants[0].name}
                          className="w-28 h-28 sm:w-36 sm:h-36 rounded-full object-cover border-4 border-emerald-500/50 shadow-[0_0_50px_rgba(16,185,129,0.3)]"
                        />
                      ) : (
                        <div className="w-28 h-28 sm:w-36 sm:h-36 rounded-full bg-slate-800 border-4 border-emerald-500/50 flex items-center justify-center text-4xl font-bold text-white shadow-2xl">
                          {participants[0].name.slice(0, 2).toUpperCase()}
                        </div>
                      )}
                      <div className="space-y-1">
                        <h3 className="text-xl sm:text-2xl font-bold text-white tracking-tight">{participants[0].name}</h3>
                        <p className="text-xs font-mono text-emerald-400 flex items-center justify-center gap-1.5">
                          <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                          <span>WhatsApp Direct Channel &bull; Connected</span>
                        </p>
                      </div>
                    </div>
                  ) : (
                    <div className="w-full h-full relative">
                      <img
                        src={participants[0].avatar}
                        alt={participants[0].name}
                        className="w-full h-full object-cover"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-black/40 pointer-events-none" />
                    </div>
                  )}

                  {/* WhatsApp Top Overlay */}
                  <div className="absolute top-4 left-4 right-4 flex items-center justify-between z-20 pointer-events-none">
                    <div className="flex items-center gap-2.5 bg-black/60 backdrop-blur-md px-3.5 py-1.5 rounded-full border border-white/10">
                      <div className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                      <span className="text-xs font-bold text-white">{participants[0].name}</span>
                      <span className="text-[11px] font-mono text-slate-300">&bull; {formatDuration(callDuration)}</span>
                    </div>
                    <div className="flex items-center gap-1.5 bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 px-3 py-1 rounded-full text-xs font-mono">
                      <WhatsAppIcon className="w-3.5 h-3.5" />
                      <span className="hidden sm:inline">End-to-End Encrypted</span>
                    </div>
                  </div>

                  {/* WhatsApp Soundwave if speaking */}
                  {participants[0].isSpeaking && (
                    <div className="absolute bottom-24 left-6 z-20 flex items-center gap-2 bg-black/70 backdrop-blur-md px-3.5 py-1.5 rounded-full border border-emerald-500/40 shadow-lg">
                      <div className="flex items-end gap-1 h-3.5">
                        <span className="w-1 h-3.5 bg-emerald-400 rounded-full animate-bounce" />
                        <span className="w-1 h-2 bg-emerald-400 rounded-full animate-bounce delay-100" />
                        <span className="w-1 h-3.5 bg-emerald-400 rounded-full animate-bounce delay-200" />
                        <span className="w-1 h-2 bg-emerald-400 rounded-full animate-bounce delay-300" />
                      </div>
                      <span className="text-xs text-emerald-300 font-semibold">Speaking</span>
                    </div>
                  )}
                </div>
              )}
            </div>
          ) : layoutMode === 'sidebar' ? (
            /* GOOGLE MEET SIDEBAR MODE: STAGE + RIGHT FILMSTRIP */
            <div className="flex-1 w-full flex flex-col md:flex-row gap-3 overflow-hidden">
              {/* Main Stage (70-75% width) */}
              <div className="flex-1 h-full min-h-[350px] relative rounded-3xl overflow-hidden border border-white/15 bg-slate-950 flex items-center justify-center shadow-xl">
                {(() => {
                  const mainPeer = participants.find((p) => (pinnedId ? p.id === pinnedId : p.isSpeaking)) || participants[0];
                  if (!mainPeer) {
                    return (
                      <div className="flex flex-col items-center justify-center p-8 text-center max-w-md">
                        <div className="w-14 h-14 rounded-full bg-cyan-500/10 border border-cyan-500/20 flex items-center justify-center text-cyan-400 mb-3">
                          <Users className="w-7 h-7" />
                        </div>
                        <h3 className="text-lg font-bold text-white">You&apos;re the only one here</h3>
                        <p className="text-xs text-slate-400 mt-1.5 leading-relaxed">
                          Share this meeting link with others you want in the meeting.
                        </p>
                        <div className="mt-4 w-full flex items-center gap-2 p-1.5 rounded-2xl bg-black/70 border border-white/15">
                          <div className="flex-1 px-3 py-1 text-xs font-mono text-cyan-300 truncate text-left">
                            {typeof window !== 'undefined' ? `${window.location.origin}/call/${roomId}` : `https://zenvitra.xyz/call/${roomId}`}
                          </div>
                          <button
                            onClick={handleCopyLink}
                            className="px-3 py-1.5 rounded-xl bg-white/10 hover:bg-white/20 text-white font-mono text-xs font-semibold flex items-center gap-1 transition-colors"
                          >
                            {isCopied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                            <span>{isCopied ? 'Copied' : 'Copy'}</span>
                          </button>
                        </div>
                      </div>
                    );
                  }
                  return (
                    <div className="w-full h-full relative flex items-center justify-center">
                      {mainPeer.isCameraOff ? (
                        <div className="flex flex-col items-center gap-3">
                          <img src={mainPeer.avatar} alt={mainPeer.name} className="w-24 h-24 rounded-full object-cover border-2 border-white/20 shadow-xl" />
                          <div className="text-lg font-bold text-white">{mainPeer.name}</div>
                          <span className="text-xs text-slate-400">Camera Off</span>
                        </div>
                      ) : (
                        <div className="w-full h-full relative">
                          <img src={mainPeer.avatar} alt={mainPeer.name} className="w-full h-full object-cover" />
                          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-black/30 pointer-events-none" />
                        </div>
                      )}

                      {/* Main Stage Badge */}
                      <div className="absolute top-3 left-3 flex items-center gap-2 z-10">
                        <span className="px-2.5 py-1 rounded-md bg-black/70 backdrop-blur-md text-xs font-semibold text-white border border-white/10">
                          {mainPeer.name}
                        </span>
                        {mainPeer.countryFlag && (
                          <span className="px-2 py-0.5 rounded-md bg-black/70 backdrop-blur-md text-xs text-slate-200 border border-white/10">
                            {mainPeer.countryFlag}
                          </span>
                        )}
                      </div>

                      {/* Active Soundwave */}
                      {mainPeer.isSpeaking && (
                        <div className="absolute bottom-3 left-3 z-10 flex items-center gap-2 bg-black/70 backdrop-blur-md px-3 py-1.5 rounded-full border border-emerald-500/40">
                          <div className="flex items-end gap-0.5 h-3">
                            <span className="w-0.5 h-2 bg-emerald-400 rounded-full animate-bounce" />
                            <span className="w-0.5 h-3 bg-emerald-400 rounded-full animate-bounce delay-100" />
                            <span className="w-0.5 h-1.5 bg-emerald-400 rounded-full animate-bounce delay-200" />
                          </div>
                          <span className="text-xs text-emerald-300 font-medium">Active Speaker</span>
                        </div>
                      )}
                    </div>
                  );
                })()}
              </div>

              {/* Right Filmstrip (Vertical Queue) */}
              <div className="w-full md:w-72 flex md:flex-col gap-2.5 overflow-y-auto shrink-0 pb-16 md:pb-0">
                {/* Local user tile in filmstrip if not floating */}
                {!isPipFloating && (
                  <div className={`relative h-36 rounded-2xl overflow-hidden border border-white/10 bg-slate-900/90 flex flex-col items-center justify-center shrink-0 ${getBgClass()}`}>
                    {isCamOn ? (
                      <video ref={localVideoRef} autoPlay playsInline muted className="w-full h-full object-cover -scale-x-100" />
                    ) : (
                      <div className="w-10 h-10 rounded-full bg-cyan-500/20 text-cyan-300 font-bold flex items-center justify-center text-xs">YOU</div>
                    )}
                    <span className="absolute bottom-2 left-2 px-2 py-0.5 rounded bg-black/70 text-[10px] text-white">You</span>
                  </div>
                )}

                {/* Other Peers in Filmstrip */}
                {participants.map((peer) => (
                  <div
                    key={peer.id}
                    onClick={() => setPinnedId(peer.id)}
                    className={`relative h-36 rounded-2xl overflow-hidden border transition-all cursor-pointer shrink-0 flex flex-col items-center justify-center ${
                      peer.isSpeaking ? 'border-emerald-400 ring-2 ring-emerald-400/50 shadow-md' : 'border-white/10 bg-slate-900/90'
                    }`}
                  >
                    <img src={peer.avatar} alt={peer.name} className="w-full h-full object-cover" />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent pointer-events-none" />
                    <div className="absolute bottom-2 left-2 right-2 flex items-center justify-between z-10">
                      <span className="text-[11px] font-medium text-white truncate max-w-[120px]">{peer.name}</span>
                      {peer.isSpeaking && (
                        <div className="flex items-end gap-0.5 h-2.5">
                          <span className="w-0.5 h-2 bg-emerald-400 rounded-full animate-bounce" />
                          <span className="w-0.5 h-2.5 bg-emerald-400 rounded-full animate-bounce delay-100" />
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ) : (
            /* TILED GRID & SPOTLIGHT MODES */
            <div
              className={`flex-1 w-full grid gap-3 pb-20 md:pb-0 ${
                layoutMode === 'spotlight' || pinnedId
                  ? 'grid-cols-1 md:grid-cols-4 md:grid-rows-4'
                  : participants.length <= 1
                  ? 'grid-cols-1 md:grid-cols-2'
                  : participants.length <= 3
                  ? 'grid-cols-1 md:grid-cols-2'
                  : 'grid-cols-2 md:grid-cols-3'
              }`}
            >
              {/* LOCAL USER TILE (Only rendered in grid if not in PiP mode) */}
              {!isPipFloating && (
                <div
                  className={`relative rounded-2xl overflow-hidden border transition-all duration-300 flex flex-col items-center justify-center ${
                    layoutMode === 'spotlight' && !pinnedId
                      ? 'md:col-span-3 md:row-span-4'
                      : 'min-h-[160px] md:min-h-[220px]'
                  } ${
                    isMicOn && micLevel > 30
                      ? 'border-emerald-400 shadow-[0_0_30px_rgba(52,211,153,0.35)] ring-2 ring-emerald-400/80'
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
                          {/* 4-bar equalizer */}
                          <div className="flex items-end gap-0.5 h-3 w-4">
                            <div
                              className="w-1 bg-emerald-400 rounded-xs transition-all duration-75"
                              style={{ height: `${Math.min(100, micLevel * 1.1)}%` }}
                            />
                            <div
                              className="w-1 bg-emerald-400 rounded-xs transition-all duration-75"
                              style={{ height: `${Math.min(100, micLevel * 0.7)}%` }}
                            />
                            <div
                              className="w-1 bg-emerald-400 rounded-xs transition-all duration-75"
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
              )}

              {/* WHEN ALONE: GOOGLE MEET WAITING & SHARE CARD */}
              {participants.length === 0 && (
                <div className="relative rounded-2xl overflow-hidden border border-white/10 bg-gradient-to-br from-white/[0.04] to-black/70 backdrop-blur-xl p-6 sm:p-8 flex flex-col items-center justify-center text-center shadow-2xl min-h-[220px]">
                  <div className="w-14 h-14 rounded-full bg-blue-500/10 border border-blue-500/20 flex items-center justify-center text-blue-400 mb-3 shadow-lg">
                    <Users className="w-7 h-7" />
                  </div>
                  <h3 className="text-lg font-bold text-white tracking-tight">You&apos;re the only one here</h3>
                  <p className="text-xs text-slate-400 mt-1 max-w-sm leading-relaxed">
                    Share this meeting link with others you want in the meeting.
                  </p>

                  <div className="mt-4 w-full max-w-md flex items-center gap-2 p-1.5 rounded-2xl bg-black/70 border border-white/15">
                    <div className="flex-1 px-3 py-1 text-xs font-mono text-cyan-300 truncate text-left">
                      {typeof window !== 'undefined' ? `${window.location.origin}/call/${roomId}` : `https://zenvitra.xyz/call/${roomId}`}
                    </div>
                    <button
                      onClick={handleCopyLink}
                      className="px-3 py-1.5 rounded-xl bg-white/10 hover:bg-white/20 text-white font-mono text-xs font-semibold flex items-center gap-1.5 transition-colors"
                    >
                      {isCopied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                      <span>{isCopied ? 'Copied' : 'Copy'}</span>
                    </button>
                  </div>

                  <div className="mt-3 flex items-center gap-2">
                    <button
                      onClick={() => setShowShareModal(true)}
                      className="px-4 py-2 rounded-xl bg-emerald-500/15 hover:bg-emerald-500/25 text-emerald-400 border border-emerald-500/30 text-xs font-semibold flex items-center gap-2 transition-all cursor-pointer"
                    >
                      <WhatsAppIcon className="w-4 h-4" />
                      <span>Invite via WhatsApp</span>
                    </button>
                  </div>

                  <div className="mt-3.5 flex items-center gap-1.5 text-[11px] font-mono text-slate-500">
                    <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
                    <span>Your meeting is safe &bull; Only people invited or admitted can join</span>
                  </div>
                </div>
              )}

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
                        ? 'border-emerald-400 shadow-[0_0_35px_rgba(52,211,153,0.45)] ring-2 ring-emerald-400/80'
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

                    {/* Bottom bar inside tile with soundwave */}
                    <div className="absolute bottom-2.5 left-2.5 right-2.5 flex items-center justify-between z-10">
                      <div className="flex items-center gap-1.5 px-2 py-1 rounded-md bg-black/60 backdrop-blur-md border border-white/10">
                        {peer.isMuted ? (
                          <MicOff className="w-3.5 h-3.5 text-rose-400" />
                        ) : (
                          <div className="flex items-center gap-1">
                            <Mic className="w-3.5 h-3.5 text-emerald-400" />
                            {peer.isSpeaking && (
                              <div className="flex items-end gap-0.5 h-3 w-4">
                                <div className="w-0.5 h-2 bg-emerald-400 rounded-full animate-bounce" />
                                <div className="w-0.5 h-3 bg-emerald-400 rounded-full animate-bounce delay-75" />
                                <div className="w-0.5 h-1.5 bg-emerald-400 rounded-full animate-bounce delay-150" />
                                <div className="w-0.5 h-2.5 bg-emerald-400 rounded-full animate-bounce delay-100" />
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
          )}

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
                  {chatMessages.length === 0 ? (
                    <div className="h-full flex flex-col items-center justify-center text-center p-6 text-slate-500">
                      <div className="w-12 h-12 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center mb-3 text-cyan-400">
                        <MessageSquare className="w-6 h-6" />
                      </div>
                      <h4 className="text-xs font-semibold text-slate-300">No messages yet</h4>
                      <p className="text-[11px] text-slate-500 mt-1 max-w-[200px]">
                        Messages sent will be visible to delegates and participants in this room.
                      </p>
                    </div>
                  ) : chatMessages.map((msg) => (
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

      {/* 4. FLOATING CYBER-GLASS CONTROL DOCK */}
      <footer className="fixed bottom-4 sm:bottom-6 left-1/2 -translate-x-1/2 z-40 max-w-[96vw] px-3 sm:px-5 py-2 sm:py-2.5 rounded-full bg-slate-950/85 backdrop-blur-3xl border border-white/20 shadow-[0_25px_60px_rgba(0,0,0,0.9),0_0_30px_rgba(6,182,212,0.18)] flex items-center gap-1.5 sm:gap-2.5 transition-all">
        {/* Device Toggles (Mic & Camera) */}
        <button
          onClick={() => setIsMicOn(!isMicOn)}
          className={`p-2.5 sm:p-3 rounded-full flex items-center justify-center transition-all ${
            isMicOn
              ? 'bg-white/10 hover:bg-white/20 text-white ring-1 ring-emerald-400/40 shadow-sm'
              : 'bg-rose-500 hover:bg-rose-600 text-white shadow-lg shadow-rose-500/40'
          }`}
          title={isMicOn ? 'Mute Microphone' : 'Unmute Microphone'}
        >
          {isMicOn ? <Mic className="w-4 h-4 sm:w-5 sm:h-5 text-emerald-400" /> : <MicOff className="w-4 h-4 sm:w-5 sm:h-5" />}
        </button>

        <button
          onClick={() => setIsCamOn(!isCamOn)}
          className={`p-2.5 sm:p-3 rounded-full flex items-center justify-center transition-all ${
            isCamOn
              ? 'bg-white/10 hover:bg-white/20 text-white'
              : 'bg-rose-500 hover:bg-rose-600 text-white shadow-lg shadow-rose-500/40'
          }`}
          title={isCamOn ? 'Turn Camera Off' : 'Turn Camera On'}
        >
          {isCamOn ? <Video className="w-4 h-4 sm:w-5 sm:h-5" /> : <VideoOff className="w-4 h-4 sm:w-5 sm:h-5" />}
        </button>

        <button
          onClick={handleToggleScreenShare}
          className={`hidden sm:flex p-3 rounded-full items-center justify-center transition-all ${
            isScreenSharing
              ? 'bg-cyan-500 text-slate-950 font-bold shadow-lg shadow-cyan-500/30'
              : 'bg-white/10 hover:bg-white/20 text-white'
          }`}
          title="Share Screen"
        >
          <MonitorUp className="w-4 h-4 sm:w-5 sm:h-5" />
        </button>

        <div className="h-6 w-px bg-white/15 mx-0.5 sm:mx-1" />

        {/* Hand Raise */}
        <button
          onClick={() => setIsHandRaised(!isHandRaised)}
          className={`p-2.5 sm:px-3.5 sm:py-2.5 rounded-full flex items-center gap-1.5 text-xs font-semibold transition-all ${
            isHandRaised
              ? 'bg-amber-500 text-slate-950 shadow-lg shadow-amber-500/30 ring-2 ring-amber-400'
              : 'bg-white/10 hover:bg-white/20 text-white'
          }`}
          title="Raise / Lower Hand"
        >
          <Hand className="w-4 h-4" />
          <span className="hidden md:inline">{isHandRaised ? 'Lower' : 'Raise'}</span>
        </button>

        {/* Emoji Reactions */}
        <div className="relative">
          <button
            onClick={() => setShowReactionPicker(!showReactionPicker)}
            className="p-2.5 sm:p-3 rounded-full bg-white/10 hover:bg-white/20 text-white transition-all flex items-center justify-center"
            title="Reactions"
          >
            <Smile className="w-4 h-4 sm:w-5 sm:h-5" />
          </button>
          {showReactionPicker && (
            <div className="absolute bottom-16 left-1/2 -translate-x-1/2 p-2 bg-slate-900 border border-white/20 rounded-2xl shadow-2xl flex items-center gap-2 z-50 backdrop-blur-2xl">
              {['👍', '❤️', '👏', '🔥', '⚡', '🎉', '🚀', '💯'].map((emoji) => (
                <button
                  key={emoji}
                  onClick={() => triggerReaction(emoji)}
                  className="text-2xl hover:scale-125 transition-transform p-1 rounded hover:bg-white/10"
                >
                  {emoji}
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Polls & Q&A */}
        <button
          onClick={() => setActiveDrawer(activeDrawer === 'polls' ? null : 'polls')}
          className={`p-2.5 sm:p-3 rounded-full transition-all flex items-center justify-center ${
            activeDrawer === 'polls'
              ? 'bg-cyan-500 text-slate-950 font-bold'
              : 'bg-white/10 hover:bg-white/20 text-white'
          }`}
          title="Polls & Q&A"
        >
          <Vote className="w-4 h-4 sm:w-5 sm:h-5" />
        </button>

        {/* MUN Chamber Toggle */}
        <button
          onClick={() => setActiveDrawer(activeDrawer === 'mun' ? null : 'mun')}
          className={`p-2.5 sm:p-3 rounded-full transition-all flex items-center justify-center ${
            activeDrawer === 'mun'
              ? 'bg-cyan-500 text-slate-950 font-bold'
              : mode === 'COMMITTEE'
              ? 'bg-cyan-500/20 text-cyan-400 border border-cyan-500/40'
              : 'bg-white/10 hover:bg-white/20 text-white'
          }`}
          title="MUN Rules of Procedure"
        >
          <Gavel className="w-4 h-4 sm:w-5 sm:h-5" />
        </button>

        {/* WhatsApp 1-Click Invite */}
        <button
          onClick={() => setShowShareModal(true)}
          className="p-2.5 sm:p-3 rounded-full bg-emerald-500/15 hover:bg-emerald-500 text-emerald-400 hover:text-slate-950 border border-emerald-500/30 transition-all flex items-center justify-center shadow-sm"
          title="Invite via WhatsApp"
        >
          <WhatsAppIcon className="w-4 h-4 sm:w-5 sm:h-5" />
        </button>

        <div className="h-6 w-px bg-white/15 mx-0.5 sm:mx-1" />

        {/* In-Call Chat */}
        <button
          onClick={() => setActiveDrawer(activeDrawer === 'chat' ? null : 'chat')}
          className={`p-2.5 sm:p-3 rounded-full transition-all flex items-center justify-center relative ${
            activeDrawer === 'chat'
              ? 'bg-cyan-500 text-slate-950 font-bold'
              : 'bg-white/10 hover:bg-white/20 text-white'
          }`}
          title="In-Call Chat"
        >
          <MessageSquare className="w-4 h-4 sm:w-5 sm:h-5" />
          <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-cyan-400" />
        </button>

        {/* Participants */}
        <button
          onClick={() => setActiveDrawer(activeDrawer === 'participants' ? null : 'participants')}
          className={`p-2.5 sm:p-3 rounded-full transition-all flex items-center justify-center relative ${
            activeDrawer === 'participants'
              ? 'bg-cyan-500 text-slate-950 font-bold'
              : 'bg-white/10 hover:bg-white/20 text-white'
          }`}
          title={`Participants (${participants.length + 1})`}
        >
          <Users className="w-4 h-4 sm:w-5 sm:h-5" />
        </button>

        {/* End Call */}
        <button
          onClick={handleLeaveCall}
          className="px-3.5 sm:px-5 py-2.5 rounded-full bg-rose-600 hover:bg-rose-500 text-white font-bold text-xs flex items-center gap-1.5 shadow-lg shadow-rose-600/40 transition-all hover:scale-105 ml-1"
          title="Leave Call"
        >
          <PhoneOff className="w-4 h-4" />
          <span className="hidden sm:inline">End</span>
        </button>
      </footer>

      {/* FLOATING PICTURE-IN-PICTURE (PiP) SELF-VIEW */}
      {(isPipFloating || layoutMode === 'whatsapp') && (
        <div className={`fixed z-40 ${getPipClasses()} w-40 h-56 sm:w-52 sm:h-64 rounded-3xl overflow-hidden border-2 border-cyan-400/60 shadow-[0_20px_50px_rgba(0,0,0,0.85)] bg-slate-950 transition-all duration-300 group`}>
          {isCamOn ? (
            <video
              ref={localVideoRef}
              autoPlay
              playsInline
              muted
              className="w-full h-full object-cover -scale-x-100"
            />
          ) : (
            <div className="w-full h-full flex flex-col items-center justify-center bg-slate-900 text-cyan-300 font-bold">
              <div className="w-12 h-12 rounded-full bg-cyan-500/20 border border-cyan-500/40 flex items-center justify-center text-lg">
                YOU
              </div>
              <span className="text-[10px] text-slate-400 mt-2">Camera Off</span>
            </div>
          )}

          {/* PiP Overlay Controls */}
          <div className="absolute top-2 left-2 right-2 flex items-center justify-between opacity-0 group-hover:opacity-100 transition-opacity bg-black/60 backdrop-blur-md p-1 rounded-xl">
            <button
              onClick={cyclePipCorner}
              className="p-1 text-slate-300 hover:text-white rounded-lg hover:bg-white/10"
              title="Move PiP corner"
            >
              <RotateCcw className="w-3.5 h-3.5" />
            </button>
            <span className="text-[10px] font-mono text-cyan-400">PiP Self-View</span>
            {layoutMode !== 'whatsapp' && (
              <button
                onClick={() => setIsPipFloating(false)}
                className="p-1 text-slate-300 hover:text-white rounded-lg hover:bg-white/10"
                title="Dock back to grid"
              >
                <Minimize2 className="w-3.5 h-3.5" />
              </button>
            )}
          </div>

          {/* PiP Status Bottom */}
          <div className="absolute bottom-2 left-2 right-2 flex items-center justify-between pointer-events-none">
            <div className="px-2 py-0.5 rounded-md bg-black/70 backdrop-blur-md text-[10px] font-semibold text-white border border-white/10 flex items-center gap-1">
              {isMicOn ? <Mic className="w-2.5 h-2.5 text-emerald-400" /> : <MicOff className="w-2.5 h-2.5 text-rose-400" />}
              <span>You</span>
            </div>
          </div>
        </div>
      )}

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

      {/* 6. SPEED-DIAL ROOM SWITCHER MODAL */}
      {showSpeedDialModal && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-xl flex items-center justify-center p-4">
          <div className="w-full max-w-md bg-slate-950 border border-white/15 rounded-3xl p-6 shadow-2xl space-y-4">
            <div className="flex items-center justify-between border-b border-white/10 pb-3">
              <div className="flex items-center gap-2 text-cyan-400">
                <Compass className="w-5 h-5" />
                <h3 className="font-bold text-white text-base">Speed-Dial Room Switcher</h3>
              </div>
              <button onClick={() => setShowSpeedDialModal(false)} className="text-slate-400 hover:text-white p-1">✕</button>
            </div>
            <p className="text-xs text-slate-400">Jump between parliamentary simulations, diplomatic bilateral suites, and plenary stages instantaneously.</p>
            <div className="space-y-2">
              {[
                { id: 'zen-unsc-chamber', name: 'UN Security Council (UNSC) Plenary', mode: 'COMMITTEE', icon: '🇺🇳' },
                { id: 'zen-diplomacy-lounge', name: 'High-Level Bilateral Lounge', mode: 'CALL', icon: '🤝' },
                { id: 'zen-press-briefing', name: 'International Press Briefing Studio', mode: 'EVENT', icon: '🎙️' },
                { id: 'zen-climate-working-group', name: 'Youth Climate Action Taskforce', mode: 'GROUP', icon: '🌱' },
                { id: 'zen-ai-governance', name: 'Global AI Ethics Assembly', mode: 'ROOM', icon: '🤖' }
              ].map((room) => (
                <button
                  key={room.id}
                  onClick={() => {
                    setShowSpeedDialModal(false);
                    router.push(`/call/${room.id}?mode=${room.mode}`);
                  }}
                  className="w-full p-3 rounded-2xl bg-white/5 hover:bg-white/10 border border-white/10 flex items-center justify-between text-left transition-all hover:scale-[1.01]"
                >
                  <div className="flex items-center gap-3">
                    <span className="text-xl">{room.icon}</span>
                    <div>
                      <div className="text-xs font-semibold text-white">{room.name}</div>
                      <div className="text-[10px] text-cyan-400 font-mono">Room: {room.id} &bull; {room.mode}</div>
                    </div>
                  </div>
                  <Zap className="w-4 h-4 text-cyan-400" />
                </button>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* 7. WHATSAPP & DIRECT SHARE MODAL */}
      {showShareModal && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-xl flex items-center justify-center p-4">
          <div className="w-full max-w-md bg-slate-950 border border-white/15 rounded-3xl p-6 shadow-2xl space-y-4">
            <div className="flex items-center justify-between border-b border-white/10 pb-3">
              <div className="flex items-center gap-2 text-emerald-400">
                <WhatsAppIcon className="w-5 h-5 text-emerald-400" />
                <h3 className="font-bold text-white text-base">Share &amp; Invite</h3>
              </div>
              <button onClick={() => setShowShareModal(false)} className="text-slate-400 hover:text-white p-1">✕</button>
            </div>
            <p className="text-xs text-slate-400">Invite colleagues, delegates, or press members to this encrypted chamber with 1 click.</p>
            <div className="p-4 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-between">
              <div>
                <div className="text-xs font-bold text-emerald-300">Invite via WhatsApp</div>
                <div className="text-[11px] text-slate-400">Pre-formatted direct invite message</div>
              </div>
              <button
                onClick={handleShareToWhatsApp}
                className="px-4 py-2.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-xs flex items-center gap-1.5 transition-colors shadow-lg shadow-emerald-500/30"
              >
                <WhatsAppIcon className="w-4 h-4" />
                <span>Send WhatsApp</span>
              </button>
            </div>
            <div className="space-y-1.5">
              <label className="text-[11px] font-mono text-slate-400">Direct Room URL</label>
              <div className="flex items-center gap-2">
                <input
                  type="text"
                  readOnly
                  value={typeof window !== 'undefined' ? `${window.location.origin}/call/${roomId}` : `https://zenvitra.xyz/call/${roomId}`}
                  className="flex-1 bg-white/5 border border-white/10 rounded-xl px-3 py-2 text-xs font-mono text-slate-200 outline-none"
                />
                <button
                  onClick={handleCopyLink}
                  className="p-2.5 bg-white/10 hover:bg-white/15 text-white rounded-xl transition-colors shrink-0"
                  title="Copy Link"
                >
                  {isCopied ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4" />}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
