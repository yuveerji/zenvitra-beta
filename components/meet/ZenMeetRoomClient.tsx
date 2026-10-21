'use client';

import React, { useState, useEffect, useRef, useMemo } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
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
  Settings, 
  PhoneOff, 
  Pin, 
  PinOff, 
  Maximize2, 
  Minimize2, 
  Copy, 
  Check, 
  ShieldCheck, 
  Sparkles, 
  ChevronDown, 
  Send, 
  Plus, 
  Grid, 
  Sidebar as SidebarIcon,
  Wifi, 
  Volume2, 
  VolumeX, 
  Lock, 
  Unlock, 
  UserCheck, 
  UserX, 
  AlertCircle, 
  Gavel, 
  Clock, 
  RotateCcw, 
  Play, 
  Pause, 
  Tv, 
  FileText, 
  ExternalLink,
  ChevronRight,
  MoreVertical,
  Radio,
  Eye,
  EyeOff
} from 'lucide-react';
import { 
  ZenMeetRoom, 
  MeetParticipant, 
  InMeetingMessage, 
  SpeakerQueueItem 
} from '@/types/meet';
import { useAuth } from '@/context/AuthContext';
import { getRoomByIdOrCode } from '@/lib/meetStorage';

interface ZenMeetRoomClientProps {
  roomCodeOrId: string;
  initialMic?: boolean;
  initialCam?: boolean;
}

interface FloatingReaction {
  id: string;
  emoji: string;
  x: number; // percentage from left
}

export function ZenMeetRoomClient({
  roomCodeOrId,
  initialMic = true,
  initialCam = true
}: ZenMeetRoomClientProps) {
  const router = useRouter();
  const { user, profile } = useAuth();

  const currentUserId = profile?.id || user?.id || 'local-user';
  const currentUserName = profile?.display_name || user?.name || 'Verified Delegate';
  const currentUserAvatar = profile?.avatar_url || user?.avatar_url;

  // Stored Room Config
  const [room, setRoom] = useState<ZenMeetRoom | null>(null);

  // Hardware states
  const [isMicOn, setIsMicOn] = useState(initialMic);
  const [isCamOn, setIsCamOn] = useState(initialCam);
  const [isScreenSharing, setIsScreenSharing] = useState(false);
  const [isHandRaised, setIsHandRaised] = useState(false);
  const [isCaptionsOn, setIsCaptionsOn] = useState(false);
  const [captionText, setCaptionText] = useState('Speaking: "The delegation requests floor under Rule 28 for moderated caucus on agenda topic..."');

  // Stream Refs
  const localVideoRef = useRef<HTMLVideoElement | null>(null);
  const screenShareVideoRef = useRef<HTMLVideoElement | null>(null);
  const localStreamRef = useRef<MediaStream | null>(null);
  const screenStreamRef = useRef<MediaStream | null>(null);

  // Layout View: Gallery vs Spotlight/Speaker View
  const [viewMode, setViewMode] = useState<'gallery' | 'speaker'>('gallery');
  const [pinnedId, setPinnedId] = useState<string | null>(null);
  const [isFullscreen, setIsFullscreen] = useState(false);

  // Panels: Chat, Participants/WaitingRoom, Settings, HostSecurity, MUNConsole
  const [activeDrawer, setActiveDrawer] = useState<'none' | 'chat' | 'participants' | 'security' | 'settings' | 'mun'>('none');
  const [chatTab, setChatTab] = useState<'everyone' | 'direct'>('everyone');

  // Floating Reactions
  const [reactions, setReactions] = useState<FloatingReaction[]>([]);

  // Host Moderation Security States
  const [isRoomLocked, setIsRoomLocked] = useState(false);
  const [participantsMutedByHost, setParticipantsMutedByHost] = useState(false);
  const [allowParticipantShare, setAllowParticipantShare] = useState(true);
  const [allowParticipantChat, setAllowParticipantChat] = useState(true);

  // In-Meeting Chat
  const [messages, setMessages] = useState<InMeetingMessage[]>([]);
  const [chatInput, setChatInput] = useState('');
  const [unreadChatCount, setUnreadChatCount] = useState(0);

  // Hardware Device Selection State
  const [audioInputDevices, setAudioInputDevices] = useState<MediaDeviceInfo[]>([]);
  const [videoInputDevices, setVideoInputDevices] = useState<MediaDeviceInfo[]>([]);
  const [selectedAudioInput, setSelectedAudioInput] = useState('');
  const [selectedVideoInput, setSelectedVideoInput] = useState('');
  const [isSpeakerTesting, setIsSpeakerTesting] = useState(false);

  // Waiting Room Queue
  const [waitingRoomList, setWaitingRoomList] = useState<MeetParticipant[]>([]);

  // Participants in Room
  const [participants, setParticipants] = useState<MeetParticipant[]>([]);

  // Copy status
  const [copiedLink, setCopiedLink] = useState(false);

  // --- MUN MODE EB CONSOLE STATE ---
  const isMunMode = room?.roomType === 'mun' || roomCodeOrId.toLowerCase().includes('mun');
  const [speakerQueue, setSpeakerQueue] = useState<SpeakerQueueItem[]>([]);
  const [gslTimerSeconds, setGslTimerSeconds] = useState(room?.munConfig?.speakingTimeSecs || 90);
  const [isTimerRunning, setIsTimerRunning] = useState(false);
  const timerIntervalRef = useRef<NodeJS.Timeout | null>(null);

  // Load Room Metadata
  useEffect(() => {
    const existing = getRoomByIdOrCode(roomCodeOrId);
    if (existing) {
      setRoom(existing);
      setIsRoomLocked(!!existing.lockRoom);
      setAllowParticipantShare(existing.defaults?.allowShare ?? true);
      setAllowParticipantChat(existing.defaults?.allowChat ?? true);
      if (existing.munConfig?.speakingTimeSecs) {
        setGslTimerSeconds(existing.munConfig.speakingTimeSecs);
      }
    } else {
      // Fallback virtual room container
      const fallbackRoom: ZenMeetRoom = {
        id: roomCodeOrId,
        roomCode: roomCodeOrId.toUpperCase(),
        name: isMunMode ? 'MUN Committee Chamber' : 'ZEN Conference Chamber',
        roomType: isMunMode ? 'mun' : 'standard',
        persistence: 'persistent',
        access: 'link',
        hostId: currentUserId,
        hostName: currentUserName,
        waitingRoom: true,
        capacity: 25,
        durationMinutes: 60,
        defaults: {
          camOn: true,
          micOn: true,
          allowShare: true,
          allowChat: true,
          allowReactions: true,
          allowCaptions: true
        },
        munConfig: isMunMode ? {
          speakingTimeSecs: 90,
          chitsEnabled: true
        } : undefined,
        createdAt: new Date().toISOString(),
        status: 'LIVE'
      };
      setRoom(fallbackRoom);
    }
  }, [roomCodeOrId, isMunMode, currentUserId, currentUserName]);

  // Determine Host Status
  const isHost = room ? (room.hostId === currentUserId || room.coHosts?.includes(currentUserName)) : true;

  // Initialize Local Media Stream
  useEffect(() => {
    if (typeof navigator !== 'undefined' && navigator.mediaDevices) {
      navigator.mediaDevices.enumerateDevices().then((devices) => {
        setAudioInputDevices(devices.filter(d => d.kind === 'audioinput'));
        setVideoInputDevices(devices.filter(d => d.kind === 'videoinput'));
      }).catch(() => {});

      if (isCamOn) {
        navigator.mediaDevices.getUserMedia({ 
          video: true, 
          audio: isMicOn 
        })
        .then((stream) => {
          localStreamRef.current = stream;
          if (localVideoRef.current) {
            localVideoRef.current.srcObject = stream;
          }
        })
        .catch((err) => {
          console.warn('Webcam permission access note:', err);
          setIsCamOn(false);
        });
      }
    }

    return () => {
      if (localStreamRef.current) {
        localStreamRef.current.getTracks().forEach(t => t.stop());
      }
      if (screenStreamRef.current) {
        screenStreamRef.current.getTracks().forEach(t => t.stop());
      }
    };
  }, []);

  // Update Media Tracks when mic/cam toggled
  useEffect(() => {
    if (localStreamRef.current) {
      localStreamRef.current.getAudioTracks().forEach(track => {
        track.enabled = isMicOn && !participantsMutedByHost;
      });
      localStreamRef.current.getVideoTracks().forEach(track => {
        track.enabled = isCamOn;
      });
    }
  }, [isMicOn, isCamOn, participantsMutedByHost]);

  // Fullscreen Handler
  const toggleFullscreen = () => {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen().catch(() => {});
      setIsFullscreen(true);
    } else {
      document.exitFullscreen().catch(() => {});
      setIsFullscreen(false);
    }
  };

  // Screen Share API
  const handleToggleScreenShare = async () => {
    if (isScreenSharing) {
      if (screenStreamRef.current) {
        screenStreamRef.current.getTracks().forEach(t => t.stop());
        screenStreamRef.current = null;
      }
      setIsScreenSharing(false);
    } else {
      if (!isHost && !allowParticipantShare) {
        alert('The host has disabled participant screen sharing in this session.');
        return;
      }

      try {
        const stream = await navigator.mediaDevices.getDisplayMedia({
          video: true,
          audio: true
        });
        screenStreamRef.current = stream;
        setIsScreenSharing(true);
        if (screenShareVideoRef.current) {
          screenShareVideoRef.current.srcObject = stream;
        }

        stream.getVideoTracks()[0].onended = () => {
          setIsScreenSharing(false);
          screenStreamRef.current = null;
        };
      } catch (err) {
        console.warn('Screen share cancelled or not permitted', err);
      }
    }
  };

  // Floating Reaction Generator
  const triggerReaction = (emoji: string) => {
    const id = `rx-${Date.now()}-${Math.random()}`;
    const x = Math.floor(Math.random() * 80) + 10; // 10% to 90%
    setReactions(prev => [...prev, { id, emoji, x }]);

    setTimeout(() => {
      setReactions(prev => prev.filter(r => r.id !== id));
    }, 2800);
  };

  // MUN GSL Timer Effect
  useEffect(() => {
    if (isTimerRunning) {
      timerIntervalRef.current = setInterval(() => {
        setGslTimerSeconds(prev => {
          if (prev <= 1) {
            clearInterval(timerIntervalRef.current!);
            setIsTimerRunning(false);
            // Audio alert notification
            try {
              const ctx = new (window.AudioContext || (window as any).webkitAudioContext)();
              const osc = ctx.createOscillator();
              const gain = ctx.createGain();
              osc.connect(gain);
              gain.connect(ctx.destination);
              osc.frequency.setValueAtTime(587.33, ctx.currentTime); // D5
              gain.gain.setValueAtTime(0.2, ctx.currentTime);
              osc.start();
              osc.stop(ctx.currentTime + 0.6);
            } catch (e) {}
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    } else if (timerIntervalRef.current) {
      clearInterval(timerIntervalRef.current);
    }
    return () => {
      if (timerIntervalRef.current) clearInterval(timerIntervalRef.current);
    };
  }, [isTimerRunning]);

  // Test Speaker Sound
  const handleTestSpeaker = () => {
    try {
      setIsSpeakerTesting(true);
      const ctx = new (window.AudioContext || (window as any).webkitAudioContext)();
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.frequency.setValueAtTime(440, ctx.currentTime);
      gain.gain.setValueAtTime(0.2, ctx.currentTime);
      osc.start();
      osc.stop(ctx.currentTime + 0.4);
      setTimeout(() => setIsSpeakerTesting(false), 500);
    } catch (e) {
      setIsSpeakerTesting(false);
    }
  };

  // Send In-Meeting Message
  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!chatInput.trim()) return;
    if (!isHost && !allowParticipantChat) {
      alert('The host has disabled meeting chat in this chamber.');
      return;
    }

    const newMsg: InMeetingMessage = {
      id: `msg-${Date.now()}`,
      senderId: currentUserId,
      senderName: currentUserName,
      senderPlacard: isMunMode ? (isHost ? (room?.munConfig?.ebRole || 'Executive Board') : 'Delegate') : undefined,
      content: chatInput.trim(),
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      isDirect: chatTab === 'direct'
    };

    setMessages(prev => [...prev, newMsg]);
    setChatInput('');
  };

  // Waiting Room Actions
  const handleAdmitParticipant = (p: MeetParticipant) => {
    setWaitingRoomList(prev => prev.filter(item => item.id !== p.id));
    setParticipants(prev => [...prev, { ...p, inWaitingRoom: false }]);
  };

  const handleDenyParticipant = (pId: string) => {
    setWaitingRoomList(prev => prev.filter(item => item.id !== pId));
  };

  const handleAdmitAll = () => {
    setParticipants(prev => [...prev, ...waitingRoomList.map(p => ({ ...p, inWaitingRoom: false }))]);
    setWaitingRoomList([]);
  };

  // Host Control: Mute All
  const handleMuteAll = () => {
    setParticipantsMutedByHost(true);
    setIsMicOn(false);
    setParticipants(prev => prev.map(p => ({ ...p, isMicOn: false })));
  };

  // Copy Link
  const handleCopyInvite = () => {
    const inviteUrl = `${window.location.origin}/meet/${room?.roomCode || roomCodeOrId}`;
    navigator.clipboard.writeText(inviteUrl);
    setCopiedLink(true);
    setTimeout(() => setCopiedLink(false), 2500);
  };

  // Leave Chamber
  const handleLeaveChamber = () => {
    if (localStreamRef.current) {
      localStreamRef.current.getTracks().forEach(t => t.stop());
    }
    if (screenStreamRef.current) {
      screenStreamRef.current.getTracks().forEach(t => t.stop());
    }
    router.push('/meet');
  };

  // End for Everyone
  const handleEndMeetingForEveryone = () => {
    if (!confirm('Are you sure you want to terminate this meeting chamber for all participants?')) return;
    handleLeaveChamber();
  };

  // Recognize Next MUN Speaker
  const handleRecognizeNextSpeaker = () => {
    if (speakerQueue.length === 0) return;
    const [current, ...remaining] = speakerQueue;
    setSpeakerQueue(remaining);
    setGslTimerSeconds(room?.munConfig?.speakingTimeSecs || 90);
    setIsTimerRunning(true);
  };

  // Format Timer
  const formatTimer = (secs: number) => {
    const m = Math.floor(secs / 60);
    const s = secs % 60;
    return `${m}:${s < 10 ? '0' : ''}${s}`;
  };

  return (
    <div className="relative w-full h-screen bg-[#07090e] text-white flex flex-col overflow-hidden font-sans select-none">
      
      {/* --- TOP HUD BAR --- */}
      <header className="h-14 bg-black/60 backdrop-blur-xl border-b border-white/10 px-4 sm:px-6 flex items-center justify-between z-30 shrink-0">
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse" />
            <span className="font-display font-bold text-sm text-white tracking-wide truncate max-w-[200px] sm:max-w-md">
              {room?.name || 'ZEN Conference Chamber'}
            </span>
          </div>

          <span className="text-neutral-600 hidden sm:inline">&bull;</span>

          <div className="hidden sm:flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-white/5 border border-white/10 text-[11px] font-mono text-neutral-300">
            <span>Code:</span>
            <strong className="text-cyan-400">{room?.roomCode || roomCodeOrId}</strong>
            <button
              type="button"
              onClick={handleCopyInvite}
              className="ml-1 hover:text-white transition cursor-pointer"
              title="Copy Invite Link"
            >
              {copiedLink ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
            </button>
          </div>

          {isRoomLocked && (
            <span className="flex items-center gap-1 px-2 py-0.5 rounded-md bg-amber-500/10 border border-amber-500/20 text-amber-400 text-[10px] font-mono">
              <Lock className="w-3 h-3" />
              <span>Locked</span>
            </span>
          )}

          {isMunMode && (
            <span className="hidden md:flex items-center gap-1 px-2 py-0.5 rounded-md bg-amber-500/10 border border-amber-500/20 text-amber-300 text-[10px] font-mono font-bold">
              <Gavel className="w-3 h-3" />
              <span>MUN CHAMBER</span>
            </span>
          )}
        </div>

        {/* Top Right Quick Toggles */}
        <div className="flex items-center gap-2 font-mono text-xs">
          {/* Connection Quality */}
          <div className="hidden md:flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-[11px]">
            <Wifi className="w-3.5 h-3.5" />
            <span>HD &bull; Stable</span>
          </div>

          {/* View Mode Toggle */}
          <div className="flex items-center p-0.5 rounded-lg bg-white/5 border border-white/10 text-neutral-400">
            <button
              type="button"
              onClick={() => setViewMode('gallery')}
              className={`p-1.5 rounded-md transition cursor-pointer ${
                viewMode === 'gallery' ? 'bg-white/15 text-white' : 'hover:text-white'
              }`}
              title="Gallery View"
            >
              <Grid className="w-3.5 h-3.5" />
            </button>
            <button
              type="button"
              onClick={() => setViewMode('speaker')}
              className={`p-1.5 rounded-md transition cursor-pointer ${
                viewMode === 'speaker' ? 'bg-white/15 text-white' : 'hover:text-white'
              }`}
              title="Speaker Spotlight View"
            >
              <SidebarIcon className="w-3.5 h-3.5" />
            </button>
          </div>

          {/* Fullscreen Button */}
          <button
            type="button"
            onClick={toggleFullscreen}
            className="p-2 rounded-lg bg-white/5 hover:bg-white/10 text-neutral-400 hover:text-white transition cursor-pointer"
            title="Toggle Fullscreen"
          >
            {isFullscreen ? <Minimize2 className="w-3.5 h-3.5" /> : <Maximize2 className="w-3.5 h-3.5" />}
          </button>
        </div>
      </header>

      {/* --- MUN MODE EB DAIS BANNER (IF ACTIVE) --- */}
      {isMunMode && (
        <div className="h-10 bg-amber-950/40 border-b border-amber-500/30 px-4 sm:px-6 flex items-center justify-between text-xs font-mono text-amber-200 z-20 shrink-0">
          <div className="flex items-center gap-2 sm:gap-4 truncate">
            <span className="font-bold text-amber-400 uppercase tracking-wider flex items-center gap-1">
              <Gavel className="w-3.5 h-3.5" />
              <span>DAIS CONSOLE:</span>
            </span>
            <span className="truncate text-amber-100 font-sans text-[11px]">
              {room?.munConfig?.agendaTopic || 'Deliberation on Agenda & Working Paper Consensus'}
            </span>
          </div>

          <div className="flex items-center gap-3 shrink-0">
            <div className="flex items-center gap-1.5 px-2.5 py-0.5 rounded-md bg-black/50 border border-amber-500/30 text-amber-300 font-bold">
              <Clock className="w-3.5 h-3.5" />
              <span>{formatTimer(gslTimerSeconds)}</span>
            </div>

            {isHost && (
              <div className="flex items-center gap-1">
                <button
                  type="button"
                  onClick={() => setIsTimerRunning(!isTimerRunning)}
                  className="p-1 rounded bg-amber-500/20 hover:bg-amber-500/30 text-amber-300 cursor-pointer"
                  title={isTimerRunning ? 'Pause Clock' : 'Start Clock'}
                >
                  {isTimerRunning ? <Pause className="w-3 h-3" /> : <Play className="w-3 h-3" />}
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setIsTimerRunning(false);
                    setGslTimerSeconds(room?.munConfig?.speakingTimeSecs || 90);
                  }}
                  className="p-1 rounded bg-amber-500/20 hover:bg-amber-500/30 text-amber-300 cursor-pointer"
                  title="Reset Timer"
                >
                  <RotateCcw className="w-3 h-3" />
                </button>
              </div>
            )}

            <button
              type="button"
              onClick={() => setActiveDrawer(activeDrawer === 'mun' ? 'none' : 'mun')}
              className="px-2.5 py-0.5 rounded-md bg-amber-500 hover:bg-amber-400 text-neutral-950 font-bold text-[11px] transition cursor-pointer"
            >
              EB Console
            </button>
          </div>
        </div>
      )}

      {/* --- MAIN STAGE & RESPONSIVE VIDEO GRID --- */}
      <div className="flex-1 relative flex overflow-hidden">
        
        {/* Left/Center Workspace: Video Grid & Screen Share */}
        <div className="flex-1 p-3 sm:p-4 flex flex-col justify-center items-center overflow-y-auto relative">
          
          {/* Floating Reactions Overlay */}
          <div className="absolute inset-0 pointer-events-none z-40 overflow-hidden">
            {reactions.map((r) => (
              <div
                key={r.id}
                style={{ left: `${r.x}%` }}
                className="absolute bottom-16 text-3xl sm:text-4xl animate-in fade-in slide-in-from-bottom duration-300 -translate-x-1/2"
              >
                {r.emoji}
              </div>
            ))}
          </div>

          {/* Screen Share Stage View */}
          {isScreenSharing ? (
            <div className="w-full h-full flex flex-col gap-3">
              <div className="flex-1 relative rounded-2xl bg-black border border-cyan-500/30 overflow-hidden flex items-center justify-center">
                <video
                  ref={screenShareVideoRef}
                  autoPlay
                  playsInline
                  className="w-full h-full object-contain"
                />
                <div className="absolute top-3 left-3 px-3 py-1 rounded-lg bg-black/80 backdrop-blur border border-cyan-500/30 text-xs font-mono text-cyan-300 flex items-center gap-2">
                  <MonitorUp className="w-3.5 h-3.5 text-cyan-400" />
                  <span>You are presenting your screen</span>
                  <button
                    type="button"
                    onClick={handleToggleScreenShare}
                    className="ml-2 px-2 py-0.5 rounded bg-rose-500 hover:bg-rose-600 text-white font-bold cursor-pointer"
                  >
                    Stop Share
                  </button>
                </div>
              </div>

              {/* Strip of Video Tiles under Screen Share */}
              <div className="h-28 flex items-center gap-3 overflow-x-auto pb-1">
                {/* Local Video Tile Thumbnail */}
                <div className="h-full aspect-video rounded-xl bg-neutral-900 border border-white/10 relative overflow-hidden shrink-0">
                  <video
                    ref={localVideoRef}
                    autoPlay
                    playsInline
                    muted
                    className={`w-full h-full object-cover -scale-x-100 ${isCamOn ? 'block' : 'hidden'}`}
                  />
                  {!isCamOn && (
                    <div className="w-full h-full flex items-center justify-center bg-neutral-900 text-neutral-400 text-xs font-mono">
                      <span>{currentUserName.charAt(0)}</span>
                    </div>
                  )}
                  <span className="absolute bottom-1 left-1 px-1.5 py-0.5 rounded bg-black/70 text-[9px] font-mono text-white">
                    You
                  </span>
                </div>

                {participants.map((p) => (
                  <div key={p.id} className="h-full aspect-video rounded-xl bg-neutral-900 border border-white/10 relative overflow-hidden shrink-0">
                    <div className="w-full h-full flex items-center justify-center bg-neutral-900 text-neutral-400 text-xs font-mono">
                      <span>{p.name.charAt(0)}</span>
                    </div>
                    <span className="absolute bottom-1 left-1 px-1.5 py-0.5 rounded bg-black/70 text-[9px] font-mono text-white">
                      {p.name}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          ) : (
            /* Standard Video Grid (Gallery or Spotlight View) */
            <div className={`w-full h-full grid gap-3 max-w-6xl mx-auto ${
              participants.length === 0 ? 'grid-cols-1' :
              participants.length === 1 ? 'grid-cols-1 md:grid-cols-2' :
              participants.length === 2 ? 'grid-cols-1 sm:grid-cols-2 md:grid-cols-3' :
              'grid-cols-2 md:grid-cols-3 lg:grid-cols-4'
            }`}>
              
              {/* --- LOCAL PARTICIPANT TILE (YOU) --- */}
              <div className={`relative rounded-2xl bg-neutral-900/90 border border-white/10 overflow-hidden flex items-center justify-center shadow-xl group transition ${
                isMicOn ? 'ring-1 ring-emerald-500/40' : ''
              }`}>
                <video
                  ref={localVideoRef}
                  autoPlay
                  playsInline
                  muted
                  className={`w-full h-full object-cover -scale-x-100 ${isCamOn ? 'block' : 'hidden'}`}
                />

                {!isCamOn && (
                  <div className="text-center space-y-2 p-4">
                    <div className="w-16 h-16 rounded-2xl bg-gradient-to-tr from-cyan-600 to-indigo-600 flex items-center justify-center text-white mx-auto text-xl font-bold font-mono shadow-lg">
                      {currentUserName.charAt(0)}
                    </div>
                    <div className="text-xs font-mono text-neutral-300">
                      <span className="block font-bold">{currentUserName}</span>
                      <span className="text-[10px] text-neutral-500 font-sans">Camera disabled</span>
                    </div>
                  </div>
                )}

                {/* Placard / Identity Tag */}
                <div className="absolute bottom-3 left-3 flex items-center gap-2">
                  <div className="px-2.5 py-1 rounded-xl bg-black/75 backdrop-blur-md border border-white/10 text-xs font-mono text-white flex items-center gap-1.5 shadow">
                    <span className="font-bold">{currentUserName} (You)</span>
                    {isMunMode && (
                      <span className="px-1.5 py-0.2 rounded bg-amber-500/20 text-amber-300 text-[10px] border border-amber-500/30">
                        {isHost ? (room?.munConfig?.ebRole || 'Executive Board') : 'Delegate'}
                      </span>
                    )}
                  </div>
                </div>

                {/* Status Badges: Mic, Hand Raised */}
                <div className="absolute top-3 right-3 flex items-center gap-1.5">
                  {isHandRaised && (
                    <div className="p-1.5 rounded-lg bg-amber-500 text-neutral-950 shadow animate-bounce" title="Hand Raised">
                      <Hand className="w-3.5 h-3.5" />
                    </div>
                  )}
                  <div className={`p-1.5 rounded-lg backdrop-blur-md ${
                    isMicOn ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30' : 'bg-rose-500/20 text-rose-400 border border-rose-500/30'
                  }`}>
                    {isMicOn ? <Mic className="w-3.5 h-3.5" /> : <MicOff className="w-3.5 h-3.5" />}
                  </div>
                </div>
              </div>

              {/* --- REMOTE PARTICIPANTS TILES --- */}
              {participants.map((p) => (
                <div 
                  key={p.id}
                  className="relative rounded-2xl bg-neutral-900/90 border border-white/10 overflow-hidden flex items-center justify-center shadow-xl group transition"
                >
                  <div className="text-center space-y-2 p-4">
                    <div className="w-16 h-16 rounded-2xl bg-neutral-800 flex items-center justify-center text-white mx-auto text-xl font-bold font-mono border border-white/10">
                      {p.name.charAt(0)}
                    </div>
                    <span className="text-xs font-mono text-neutral-300 block font-bold">{p.name}</span>
                  </div>

                  <div className="absolute bottom-3 left-3 flex items-center gap-2">
                    <div className="px-2.5 py-1 rounded-xl bg-black/75 backdrop-blur-md border border-white/10 text-xs font-mono text-white flex items-center gap-1.5">
                      <span>{p.name}</span>
                      {p.placard && (
                        <span className="px-1.5 py-0.2 rounded bg-cyan-500/20 text-cyan-300 text-[10px] border border-cyan-500/30">
                          {p.placard}
                        </span>
                      )}
                    </div>
                  </div>

                  <div className="absolute top-3 right-3 flex items-center gap-1.5">
                    {p.isHandRaised && (
                      <div className="p-1.5 rounded-lg bg-amber-500 text-neutral-950 shadow">
                        <Hand className="w-3.5 h-3.5" />
                      </div>
                    )}
                    <div className={`p-1.5 rounded-lg backdrop-blur-md ${
                      p.isMicOn ? 'bg-emerald-500/20 text-emerald-400' : 'bg-rose-500/20 text-rose-400'
                    }`}>
                      {p.isMicOn ? <Mic className="w-3.5 h-3.5" /> : <MicOff className="w-3.5 h-3.5" />}
                    </div>
                  </div>
                </div>
              ))}

              {/* Clean Empty Chamber State if alone */}
              {participants.length === 0 && (
                <div className="rounded-2xl border border-dashed border-white/15 bg-white/[0.01] flex flex-col items-center justify-center p-6 text-center space-y-3">
                  <div className="w-12 h-12 rounded-2xl bg-white/5 border border-white/10 text-neutral-400 flex items-center justify-center">
                    <Users className="w-6 h-6 text-neutral-500" />
                  </div>
                  <div className="space-y-1">
                    <span className="text-xs font-mono text-neutral-300 font-bold block">
                      Waiting for delegates to join chamber
                    </span>
                    <p className="text-[11px] text-neutral-500 font-sans max-w-xs">
                      Share the invite token or link with participants. Admitted delegates will render in the responsive video grid.
                    </p>
                  </div>
                  <button
                    type="button"
                    onClick={handleCopyInvite}
                    className="px-3.5 py-1.5 rounded-xl bg-white/10 hover:bg-white/20 text-xs font-mono text-white transition flex items-center gap-1.5 cursor-pointer"
                  >
                    {copiedLink ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                    <span>{copiedLink ? 'Link Copied!' : 'Copy Chamber Invite'}</span>
                  </button>
                </div>
              )}

            </div>
          )}

          {/* Live Captions Bar (if enabled) */}
          {isCaptionsOn && (
            <div className="absolute bottom-4 left-1/2 -translate-x-1/2 max-w-xl w-[90%] px-4 py-2 rounded-2xl bg-black/85 backdrop-blur-xl border border-white/15 text-center text-xs font-mono text-white shadow-2xl z-20">
              <span className="text-cyan-400 font-bold mr-2">[CAPTIONS]</span>
              <span>{captionText}</span>
            </div>
          )}

        </div>

        {/* --- RIGHT SLIDE-OUT DRAWERS (Chat / Participants / MUN Dais / Security / Settings) --- */}
        {activeDrawer !== 'none' && (
          <aside className="w-80 sm:w-96 bg-[#0a0d14] border-l border-white/10 flex flex-col h-full z-30 shrink-0 animate-in slide-in-from-right duration-200">
            
            {/* Drawer Header */}
            <div className="h-14 border-b border-white/10 px-4 flex items-center justify-between">
              <span className="text-xs font-mono font-bold uppercase tracking-wider text-white">
                {activeDrawer === 'chat' && 'Live In-Meeting Chat'}
                {activeDrawer === 'participants' && `Participants (${participants.length + 1})`}
                {activeDrawer === 'security' && 'Host Moderation Shield'}
                {activeDrawer === 'mun' && 'Executive Board Console'}
                {activeDrawer === 'settings' && 'Hardware & Device Settings'}
              </span>
              <button
                type="button"
                onClick={() => setActiveDrawer('none')}
                className="p-1.5 rounded-lg bg-white/5 hover:bg-white/10 text-neutral-400 hover:text-white transition cursor-pointer"
              >
                &times;
              </button>
            </div>

            {/* --- DRAWER 1: CHAT PANEL --- */}
            {activeDrawer === 'chat' && (
              <div className="flex-1 flex flex-col h-[calc(100%-3.5rem)]">
                {/* Tabs: Everyone vs Direct */}
                <div className="p-2 border-b border-white/10 flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => setChatTab('everyone')}
                    className={`flex-1 py-1.5 rounded-lg text-xs font-mono transition cursor-pointer ${
                      chatTab === 'everyone' ? 'bg-white/15 text-white font-bold' : 'text-neutral-400 hover:text-white'
                    }`}
                  >
                    Everyone
                  </button>
                  <button
                    type="button"
                    onClick={() => setChatTab('direct')}
                    className={`flex-1 py-1.5 rounded-lg text-xs font-mono transition cursor-pointer ${
                      chatTab === 'direct' ? 'bg-white/15 text-white font-bold' : 'text-neutral-400 hover:text-white'
                    }`}
                  >
                    Direct DMs
                  </button>
                </div>

                {/* Pinned Announcement */}
                <div className="p-3 bg-cyan-950/30 border-b border-cyan-500/20 text-[11px] font-sans text-cyan-200 flex items-start gap-2">
                  <Sparkles className="w-3.5 h-3.5 text-cyan-400 shrink-0 mt-0.5" />
                  <p>
                    <strong>Host Notice:</strong> All formal procedural motions must be submitted via the speaker list or via substantive chits.
                  </p>
                </div>

                {/* Messages Feed */}
                <div className="flex-1 p-4 overflow-y-auto space-y-3 font-sans text-xs">
                  {messages.length === 0 ? (
                    <div className="h-full flex flex-col items-center justify-center text-center text-neutral-500 font-mono text-xs">
                      <MessageSquare className="w-8 h-8 mb-2 opacity-40" />
                      <span>No messages yet. Send a greeting to the chamber.</span>
                    </div>
                  ) : (
                    messages.map((m) => (
                      <div key={m.id} className="space-y-1">
                        <div className="flex items-center justify-between text-[10px] font-mono">
                          <span className="font-bold text-neutral-300">
                            {m.senderName} {m.senderPlacard && <span className="text-cyan-400">({m.senderPlacard})</span>}
                          </span>
                          <span className="text-neutral-500">{m.timestamp}</span>
                        </div>
                        <p className="p-2.5 rounded-xl bg-white/5 border border-white/5 text-neutral-200 leading-relaxed">
                          {m.content}
                        </p>
                      </div>
                    ))
                  )}
                </div>

                {/* Chat Input */}
                <form onSubmit={handleSendMessage} className="p-3 border-t border-white/10 flex items-center gap-2">
                  <input
                    type="text"
                    value={chatInput}
                    onChange={(e) => setChatInput(e.target.value)}
                    placeholder={allowParticipantChat || isHost ? 'Type a message...' : 'Chat disabled by host'}
                    disabled={!allowParticipantChat && !isHost}
                    className="flex-1 px-3 py-2 rounded-xl bg-white/5 border border-white/10 text-xs text-white focus:outline-none focus:border-cyan-500 font-sans disabled:opacity-50"
                  />
                  <button
                    type="submit"
                    disabled={(!allowParticipantChat && !isHost) || !chatInput.trim()}
                    className="p-2 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-neutral-950 transition cursor-pointer disabled:opacity-50"
                  >
                    <Send className="w-4 h-4" />
                  </button>
                </form>
              </div>
            )}

            {/* --- DRAWER 2: PARTICIPANTS & WAITING ROOM --- */}
            {activeDrawer === 'participants' && (
              <div className="flex-1 p-4 overflow-y-auto space-y-5 font-mono text-xs">
                
                {/* Waiting Room Section (Host Only) */}
                {isHost && (
                  <div className="space-y-3 pb-4 border-b border-white/10">
                    <div className="flex items-center justify-between">
                      <span className="text-amber-400 font-bold uppercase tracking-wider text-[11px] flex items-center gap-1.5">
                        <Lock className="w-3.5 h-3.5" />
                        <span>Waiting Room ({waitingRoomList.length})</span>
                      </span>
                      {waitingRoomList.length > 0 && (
                        <button
                          type="button"
                          onClick={handleAdmitAll}
                          className="px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 hover:bg-emerald-500/30 transition text-[10px] cursor-pointer"
                        >
                          Admit All
                        </button>
                      )}
                    </div>

                    {waitingRoomList.length === 0 ? (
                      <span className="text-neutral-500 text-[11px] block">Waiting room is currently clear.</span>
                    ) : (
                      <div className="space-y-2">
                        {waitingRoomList.map((p) => (
                          <div key={p.id} className="p-2.5 rounded-xl bg-white/[0.03] border border-white/10 flex items-center justify-between">
                            <span className="text-white font-bold">{p.name}</span>
                            <div className="flex items-center gap-1">
                              <button
                                type="button"
                                onClick={() => handleAdmitParticipant(p)}
                                className="p-1 rounded bg-emerald-500/20 text-emerald-400 hover:bg-emerald-500/30 cursor-pointer"
                                title="Admit"
                              >
                                <UserCheck className="w-3.5 h-3.5" />
                              </button>
                              <button
                                type="button"
                                onClick={() => handleDenyParticipant(p.id)}
                                className="p-1 rounded bg-rose-500/20 text-rose-400 hover:bg-rose-500/30 cursor-pointer"
                                title="Deny"
                              >
                                <UserX className="w-3.5 h-3.5" />
                              </button>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                )}

                {/* Admitted Participants List */}
                <div className="space-y-3">
                  <span className="text-neutral-400 font-bold uppercase tracking-wider text-[11px] block">
                    In Chamber ({participants.length + 1})
                  </span>

                  {/* You */}
                  <div className="p-2.5 rounded-xl bg-cyan-950/20 border border-cyan-500/20 flex items-center justify-between">
                    <div>
                      <span className="text-white font-bold block">{currentUserName} (You)</span>
                      <span className="text-[10px] text-cyan-400">{isHost ? 'Host • Moderator' : 'Participant'}</span>
                    </div>
                    <div className="flex items-center gap-1 text-neutral-400">
                      {isMicOn ? <Mic className="w-3.5 h-3.5 text-emerald-400" /> : <MicOff className="w-3.5 h-3.5 text-rose-400" />}
                      {isCamOn ? <Video className="w-3.5 h-3.5 text-cyan-400" /> : <VideoOff className="w-3.5 h-3.5 text-neutral-500" />}
                    </div>
                  </div>

                  {participants.map((p) => (
                    <div key={p.id} className="p-2.5 rounded-xl bg-white/[0.03] border border-white/10 flex items-center justify-between">
                      <div>
                        <span className="text-white font-bold block">{p.name}</span>
                        <span className="text-[10px] text-neutral-500">{p.placard || 'Delegate'}</span>
                      </div>
                      <div className="flex items-center gap-1 text-neutral-400">
                        {p.isMicOn ? <Mic className="w-3.5 h-3.5 text-emerald-400" /> : <MicOff className="w-3.5 h-3.5 text-rose-400" />}
                      </div>
                    </div>
                  ))}
                </div>

              </div>
            )}

            {/* --- DRAWER 3: HOST MODERATION SHIELD --- */}
            {activeDrawer === 'security' && (
              <div className="flex-1 p-4 overflow-y-auto space-y-4 font-mono text-xs">
                <div className="p-3 rounded-xl bg-cyan-950/30 border border-cyan-500/20 text-[11px] text-cyan-200">
                  <ShieldCheck className="w-4 h-4 text-cyan-400 inline mr-1.5" />
                  <span>Host permissions and session moderation controls.</span>
                </div>

                <div className="space-y-3 p-3 rounded-2xl bg-white/[0.03] border border-white/10">
                  <div className="flex items-center justify-between">
                    <div>
                      <span className="text-white font-bold block">Lock Meeting</span>
                      <span className="text-[10px] text-neutral-500 font-sans">No new participants can join.</span>
                    </div>
                    <button
                      type="button"
                      onClick={() => setIsRoomLocked(!isRoomLocked)}
                      className={`px-3 py-1 rounded-lg text-xs font-bold transition cursor-pointer ${
                        isRoomLocked ? 'bg-amber-500 text-neutral-950' : 'bg-white/10 text-white'
                      }`}
                    >
                      {isRoomLocked ? 'Locked' : 'Unlocked'}
                    </button>
                  </div>

                  <div className="pt-2 border-t border-white/5 flex items-center justify-between">
                    <div>
                      <span className="text-white font-bold block">Mute All Participants</span>
                      <span className="text-[10px] text-neutral-500 font-sans">Silence all connected audio.</span>
                    </div>
                    <button
                      type="button"
                      onClick={handleMuteAll}
                      className="px-3 py-1 rounded-lg bg-rose-500/20 text-rose-300 border border-rose-500/30 hover:bg-rose-500/30 transition text-xs font-bold cursor-pointer"
                    >
                      Mute All
                    </button>
                  </div>

                  <div className="pt-2 border-t border-white/5 flex items-center justify-between">
                    <div>
                      <span className="text-white font-bold block">Allow Screen Sharing</span>
                      <span className="text-[10px] text-neutral-500 font-sans">Delegates can share screens.</span>
                    </div>
                    <input
                      type="checkbox"
                      checked={allowParticipantShare}
                      onChange={(e) => setAllowParticipantShare(e.target.checked)}
                      className="accent-cyan-500 w-4 h-4 cursor-pointer"
                    />
                  </div>

                  <div className="pt-2 border-t border-white/5 flex items-center justify-between">
                    <div>
                      <span className="text-white font-bold block">Allow Meeting Chat</span>
                      <span className="text-[10px] text-neutral-500 font-sans">Public &amp; direct messages.</span>
                    </div>
                    <input
                      type="checkbox"
                      checked={allowParticipantChat}
                      onChange={(e) => setAllowParticipantChat(e.target.checked)}
                      className="accent-cyan-500 w-4 h-4 cursor-pointer"
                    />
                  </div>
                </div>

                <div className="pt-2">
                  <button
                    type="button"
                    onClick={handleEndMeetingForEveryone}
                    className="w-full py-2.5 rounded-xl bg-rose-500/20 border border-rose-500/30 text-rose-400 hover:bg-rose-500 hover:text-white transition font-bold text-xs flex items-center justify-center gap-1.5 cursor-pointer"
                  >
                    <PhoneOff className="w-3.5 h-3.5" />
                    <span>End Meeting for Everyone</span>
                  </button>
                </div>
              </div>
            )}

            {/* --- DRAWER 4: MUN EXECUTIVE BOARD CONSOLE --- */}
            {activeDrawer === 'mun' && (
              <div className="flex-1 p-4 overflow-y-auto space-y-4 font-mono text-xs">
                <div className="p-3 rounded-xl bg-amber-950/30 border border-amber-500/30 text-amber-200 text-[11px] space-y-1">
                  <div className="flex items-center gap-1.5 font-bold text-amber-400 uppercase">
                    <Gavel className="w-3.5 h-3.5" />
                    <span>{room?.munConfig?.committeeName || 'Committee Executive Board'}</span>
                  </div>
                  <p className="font-sans text-[11px] text-neutral-300">
                    Recognize speakers, enforce GSL time limits, and communicate via ZEN.CHITS.
                  </p>
                </div>

                {/* Speaker Queue Controls */}
                <div className="space-y-3 p-3 rounded-2xl bg-white/[0.03] border border-white/10">
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-white uppercase text-[11px]">Speaker Queue ({speakerQueue.length})</span>
                    <button
                      type="button"
                      onClick={handleRecognizeNextSpeaker}
                      disabled={speakerQueue.length === 0}
                      className="px-2.5 py-1 rounded bg-amber-500 hover:bg-amber-400 text-neutral-950 font-bold text-[10px] transition cursor-pointer disabled:opacity-40"
                    >
                      Recognize Next
                    </button>
                  </div>

                  {speakerQueue.length === 0 ? (
                    <span className="text-neutral-500 text-[11px] block">No delegates currently on the speaker list.</span>
                  ) : (
                    <div className="space-y-2">
                      {speakerQueue.map((s, idx) => (
                        <div key={s.id} className="p-2 rounded-xl bg-black/40 border border-white/10 flex items-center justify-between">
                          <span className="text-white font-bold">{idx + 1}. {s.placard || s.name}</span>
                          <span className="text-neutral-400 text-[10px]">{s.durationSecs}s</span>
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                {/* 1-Click Launch ZEN.CHITS Integration */}
                <div className="p-4 rounded-2xl bg-gradient-to-br from-neutral-900 to-black border border-white/10 space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-white flex items-center gap-1.5">
                      <FileText className="w-4 h-4 text-cyan-400" />
                      <span>ZEN.CHITS Dispatch</span>
                    </span>
                    <span className="text-[10px] px-2 py-0.5 rounded bg-cyan-500/10 text-cyan-400 border border-cyan-500/20">
                      Active Chamber
                    </span>
                  </div>
                  <p className="text-[11px] text-neutral-400 font-sans leading-relaxed">
                    Access direct delegate-to-delegate chits, substantive queries to the EB, and confidential report chits.
                  </p>
                  <Link
                    href="/mun/chits"
                    target="_blank"
                    className="w-full py-2 rounded-xl bg-cyan-500/20 hover:bg-cyan-500/30 border border-cyan-500/30 text-cyan-300 font-bold text-xs flex items-center justify-center gap-1.5 transition"
                  >
                    <span>Open ZEN.CHITS Chamber Console</span>
                    <ExternalLink className="w-3.5 h-3.5" />
                  </Link>
                </div>
              </div>
            )}

            {/* --- DRAWER 5: SETTINGS & HARDWARE TEST --- */}
            {activeDrawer === 'settings' && (
              <div className="flex-1 p-4 overflow-y-auto space-y-4 font-mono text-xs">
                <div className="space-y-1.5">
                  <label className="text-neutral-400 block font-bold">Microphone Device</label>
                  <select 
                    value={selectedAudioInput}
                    onChange={(e) => setSelectedAudioInput(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl bg-white/5 border border-white/10 text-xs text-white focus:outline-none focus:border-cyan-500"
                  >
                    {audioInputDevices.length > 0 ? (
                      audioInputDevices.map(d => (
                        <option key={d.deviceId} value={d.deviceId} className="bg-neutral-900">
                          {d.label || `Microphone ${d.deviceId.slice(0, 4)}`}
                        </option>
                      ))
                    ) : (
                      <option className="bg-neutral-900">Default System Microphone</option>
                    )}
                  </select>
                </div>

                <div className="space-y-1.5">
                  <label className="text-neutral-400 block font-bold">Camera Device</label>
                  <select
                    value={selectedVideoInput}
                    onChange={(e) => setSelectedVideoInput(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl bg-white/5 border border-white/10 text-xs text-white focus:outline-none focus:border-cyan-500"
                  >
                    {videoInputDevices.length > 0 ? (
                      videoInputDevices.map(d => (
                        <option key={d.deviceId} value={d.deviceId} className="bg-neutral-900">
                          {d.label || `Camera ${d.deviceId.slice(0, 4)}`}
                        </option>
                      ))
                    ) : (
                      <option className="bg-neutral-900">Default FaceTime / Webcam</option>
                    )}
                  </select>
                </div>

                <div className="pt-2 border-t border-white/10 space-y-2">
                  <label className="text-neutral-400 block font-bold">Audio Output (Speaker)</label>
                  <button
                    type="button"
                    onClick={handleTestSpeaker}
                    className="w-full py-2 rounded-xl bg-white/10 hover:bg-white/15 text-white transition font-mono text-xs flex items-center justify-center gap-1.5 cursor-pointer"
                  >
                    <Volume2 className="w-3.5 h-3.5 text-cyan-400" />
                    <span>{isSpeakerTesting ? 'Chiming...' : 'Test Speaker Audio'}</span>
                  </button>
                </div>
              </div>
            )}

          </aside>
        )}

      </div>

      {/* --- BOTTOM FLOATING CONTROL DOCK --- */}
      <footer className="h-18 bg-[#04060a]/95 backdrop-blur-2xl border-t border-white/10 px-4 sm:px-6 flex items-center justify-between z-30 shrink-0">
        
        {/* Left Section: Mic & Camera Buttons */}
        <div className="flex items-center gap-2 sm:gap-3">
          {/* Mic Button */}
          <div className="flex items-center">
            <button
              type="button"
              onClick={() => setIsMicOn(!isMicOn)}
              className={`p-3 rounded-xl transition cursor-pointer flex items-center gap-2 ${
                isMicOn 
                  ? 'bg-white/10 hover:bg-white/15 text-white' 
                  : 'bg-rose-500 hover:bg-rose-600 text-white shadow-lg shadow-rose-500/20'
              }`}
              title={isMicOn ? 'Mute Microphone' : 'Unmute Microphone'}
            >
              {isMicOn ? <Mic className="w-4 h-4 text-emerald-400" /> : <MicOff className="w-4 h-4" />}
              <span className="hidden md:inline font-mono text-xs font-bold">{isMicOn ? 'Mute' : 'Unmute'}</span>
            </button>
          </div>

          {/* Camera Button */}
          <div className="flex items-center">
            <button
              type="button"
              onClick={() => setIsCamOn(!isCamOn)}
              className={`p-3 rounded-xl transition cursor-pointer flex items-center gap-2 ${
                isCamOn 
                  ? 'bg-white/10 hover:bg-white/15 text-white' 
                  : 'bg-rose-500 hover:bg-rose-600 text-white shadow-lg shadow-rose-500/20'
              }`}
              title={isCamOn ? 'Stop Camera' : 'Start Camera'}
            >
              {isCamOn ? <Video className="w-4 h-4 text-cyan-400" /> : <VideoOff className="w-4 h-4" />}
              <span className="hidden md:inline font-mono text-xs font-bold">{isCamOn ? 'Stop Video' : 'Start Video'}</span>
            </button>
          </div>
        </div>

        {/* Center Section: Core Collaboration Tools */}
        <div className="flex items-center gap-1.5 sm:gap-2">
          
          {/* Host Security Shield */}
          {isHost && (
            <button
              type="button"
              onClick={() => setActiveDrawer(activeDrawer === 'security' ? 'none' : 'security')}
              className={`p-2.5 sm:px-3 sm:py-2 rounded-xl transition cursor-pointer flex items-center gap-1.5 ${
                activeDrawer === 'security' ? 'bg-cyan-500 text-neutral-950 font-bold' : 'bg-white/5 hover:bg-white/10 text-neutral-300'
              }`}
              title="Host Moderation Controls"
            >
              <ShieldCheck className="w-4 h-4" />
              <span className="hidden lg:inline font-mono text-xs">Security</span>
            </button>
          )}

          {/* Participants */}
          <button
            type="button"
            onClick={() => setActiveDrawer(activeDrawer === 'participants' ? 'none' : 'participants')}
            className={`p-2.5 sm:px-3 sm:py-2 rounded-xl transition cursor-pointer flex items-center gap-1.5 relative ${
              activeDrawer === 'participants' ? 'bg-cyan-500 text-neutral-950 font-bold' : 'bg-white/5 hover:bg-white/10 text-neutral-300'
            }`}
            title="Participants List"
          >
            <Users className="w-4 h-4" />
            <span className="hidden lg:inline font-mono text-xs">Participants</span>
            {waitingRoomList.length > 0 && isHost && (
              <span className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-amber-500 text-neutral-950 font-mono text-[9px] font-bold flex items-center justify-center">
                {waitingRoomList.length}
              </span>
            )}
          </button>

          {/* In-Meeting Chat */}
          <button
            type="button"
            onClick={() => setActiveDrawer(activeDrawer === 'chat' ? 'none' : 'chat')}
            className={`p-2.5 sm:px-3 sm:py-2 rounded-xl transition cursor-pointer flex items-center gap-1.5 ${
              activeDrawer === 'chat' ? 'bg-cyan-500 text-neutral-950 font-bold' : 'bg-white/5 hover:bg-white/10 text-neutral-300'
            }`}
            title="Meeting Chat"
          >
            <MessageSquare className="w-4 h-4" />
            <span className="hidden lg:inline font-mono text-xs">Chat</span>
          </button>

          {/* Screen Share (ZEN.SHARE) */}
          <button
            type="button"
            onClick={handleToggleScreenShare}
            className={`p-2.5 sm:px-3 sm:py-2 rounded-xl transition cursor-pointer flex items-center gap-1.5 ${
              isScreenSharing 
                ? 'bg-emerald-500 text-neutral-950 font-bold shadow-lg shadow-emerald-500/20' 
                : 'bg-white/5 hover:bg-white/10 text-neutral-300'
            }`}
            title="Share Screen"
          >
            <MonitorUp className="w-4 h-4" />
            <span className="hidden lg:inline font-mono text-xs">Share</span>
          </button>

          {/* Raise Hand */}
          <button
            type="button"
            onClick={() => setIsHandRaised(!isHandRaised)}
            className={`p-2.5 sm:px-3 sm:py-2 rounded-xl transition cursor-pointer flex items-center gap-1.5 ${
              isHandRaised 
                ? 'bg-amber-500 text-neutral-950 font-bold shadow-lg shadow-amber-500/20 animate-pulse' 
                : 'bg-white/5 hover:bg-white/10 text-neutral-300'
            }`}
            title={isHandRaised ? 'Lower Hand' : 'Raise Hand'}
          >
            <Hand className="w-4 h-4" />
            <span className="hidden lg:inline font-mono text-xs">{isHandRaised ? 'Hand Raised' : 'Raise'}</span>
          </button>

          {/* Reactions Dropup */}
          <div className="relative group">
            <button
              type="button"
              className="p-2.5 sm:px-3 sm:py-2 rounded-xl bg-white/5 hover:bg-white/10 text-neutral-300 transition cursor-pointer flex items-center gap-1"
              title="Send Reaction"
            >
              <Smile className="w-4 h-4" />
              <span className="hidden lg:inline font-mono text-xs">React</span>
            </button>
            <div className="absolute bottom-full mb-2 left-1/2 -translate-x-1/2 p-2 rounded-2xl bg-neutral-900 border border-white/15 flex items-center gap-1.5 shadow-2xl opacity-0 pointer-events-none group-hover:opacity-100 group-hover:pointer-events-auto transition duration-150">
              {['👏', '❤️', '👍', '🎉', '😂', '😮'].map((emoji) => (
                <button
                  key={emoji}
                  type="button"
                  onClick={() => triggerReaction(emoji)}
                  className="p-1.5 hover:bg-white/10 rounded-xl text-lg hover:scale-125 transition cursor-pointer"
                >
                  {emoji}
                </button>
              ))}
            </div>
          </div>

          {/* Captions Toggle */}
          <button
            type="button"
            onClick={() => setIsCaptionsOn(!isCaptionsOn)}
            className={`p-2.5 sm:px-3 sm:py-2 rounded-xl transition cursor-pointer flex items-center gap-1.5 ${
              isCaptionsOn ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/30' : 'bg-white/5 hover:bg-white/10 text-neutral-300'
            }`}
            title="Live Captions"
          >
            <Tv className="w-4 h-4" />
            <span className="hidden xl:inline font-mono text-xs">Captions</span>
          </button>

          {/* Settings */}
          <button
            type="button"
            onClick={() => setActiveDrawer(activeDrawer === 'settings' ? 'none' : 'settings')}
            className={`p-2.5 sm:px-3 sm:py-2 rounded-xl transition cursor-pointer flex items-center gap-1.5 ${
              activeDrawer === 'settings' ? 'bg-white/20 text-white' : 'bg-white/5 hover:bg-white/10 text-neutral-400 hover:text-white'
            }`}
            title="Device Settings"
          >
            <Settings className="w-4 h-4" />
          </button>

        </div>

        {/* Right Section: Leave Chamber Button */}
        <div>
          <button
            type="button"
            onClick={handleLeaveChamber}
            className="px-4 sm:px-5 py-2.5 rounded-xl bg-rose-500/20 hover:bg-rose-500 text-rose-400 hover:text-white border border-rose-500/30 transition font-bold font-mono text-xs flex items-center gap-1.5 cursor-pointer shadow-lg shadow-rose-500/10"
          >
            <PhoneOff className="w-3.5 h-3.5" />
            <span>Leave</span>
          </button>
        </div>

      </footer>

    </div>
  );
}
