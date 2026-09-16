'use client';

import React, { useState, useRef, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { 
  Video, 
  VideoOff, 
  Mic, 
  MicOff, 
  PhoneCall, 
  Users, 
  Globe2, 
  Radio, 
  Gavel, 
  Sparkles, 
  ArrowRight, 
  ShieldCheck, 
  Copy, 
  Check, 
  Volume2, 
  Sliders, 
  Tv, 
  Layers
} from 'lucide-react';
import { CallMode } from '@/types/call';

export function ZenCallLobby() {
  const router = useRouter();

  // Mode selection
  const [selectedMode, setSelectedMode] = useState<CallMode>('GROUP');
  const [joinCode, setJoinCode] = useState('');
  const [isCopied, setIsCopied] = useState(false);

  // Device states (Green room)
  const [isMicOn, setIsMicOn] = useState(true);
  const [isCamOn, setIsCamOn] = useState(true);
  const [micLevel, setMicLevel] = useState(35);
  const [selectedBg, setSelectedBg] = useState<'none' | 'blur' | 'geneva' | 'stage'>('none');

  const videoRef = useRef<HTMLVideoElement | null>(null);
  const mediaStreamRef = useRef<MediaStream | null>(null);

  // Initialize camera preview
  useEffect(() => {
    let stream: MediaStream | null = null;

    const startPreview = async () => {
      try {
        if (navigator?.mediaDevices?.getUserMedia) {
          stream = await navigator.mediaDevices.getUserMedia({
            video: true,
            audio: true,
          });
          mediaStreamRef.current = stream;
          if (videoRef.current) {
            videoRef.current.srcObject = stream;
          }
        }
      } catch (err) {
        console.warn('Camera/Mic permission denied or not available:', err);
      }
    };

    if (isCamOn) {
      startPreview();
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

  // Mic VU meter simulation if stream active
  useEffect(() => {
    if (!isMicOn) {
      setMicLevel(0);
      return;
    }
    const interval = setInterval(() => {
      setMicLevel(Math.floor(25 + Math.random() * 55));
    }, 180);
    return () => clearInterval(interval);
  }, [isMicOn]);

  const handleStartCall = () => {
    const randomCode = `zen-${Math.floor(100 + Math.random() * 900)}-${Math.floor(100 + Math.random() * 900)}`;
    router.push(`/call/${randomCode}?mode=${selectedMode}&mic=${isMicOn}&cam=${isCamOn}&bg=${selectedBg}`);
  };

  const handleJoinCall = (e: React.FormEvent) => {
    e.preventDefault();
    if (!joinCode.trim()) return;
    const cleanCode = joinCode.trim().replace(/^https?:\/\/[^\/]+\/call\//, '');
    router.push(`/call/${cleanCode}?mode=${selectedMode}&mic=${isMicOn}&cam=${isCamOn}&bg=${selectedBg}`);
  };

  const modesConfig: { id: CallMode; label: string; desc: string; icon: any; color: string }[] = [
    {
      id: 'CALL',
      label: '1:1 Direct Call',
      desc: 'Crystal-clear peer conversation with zero latency',
      icon: PhoneCall,
      color: 'from-cyan-500 to-blue-600',
    },
    {
      id: 'GROUP',
      label: 'Group Meeting',
      desc: 'Team caucus, working group, and seminar rooms',
      icon: Users,
      color: 'from-purple-500 to-indigo-600',
    },
    {
      id: 'ROOM',
      label: 'Persistent Room',
      desc: 'Always-on project huddle & community lounge',
      icon: Layers,
      color: 'from-emerald-500 to-teal-600',
    },
    {
      id: 'EVENT',
      label: 'Keynote & Stage',
      desc: 'Keynotes, panels, backstage and audience passes',
      icon: Tv,
      color: 'from-rose-500 to-pink-600',
    },
    {
      id: 'LIVE',
      label: 'Open Broadcast',
      desc: 'Live townhall, open webinar with real-time Q&A',
      icon: Radio,
      color: 'from-amber-500 to-orange-600',
    },
    {
      id: 'COMMITTEE',
      label: 'MUN Chamber',
      desc: 'Diplomatic caucus, speaker list, motions & voting',
      icon: Gavel,
      color: 'from-amber-400 to-yellow-600',
    },
  ];

  return (
    <div className="min-h-screen bg-[#040508] text-white font-sans flex flex-col selection:bg-cyan-500/30">
      {/* ── TOP NAV HEADER ── */}
      <header className="h-16 border-b border-white/10 px-6 flex items-center justify-between bg-black/40 backdrop-blur-xl">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-cyan-500 to-blue-600 p-[1px] shadow-lg">
            <div className="w-full h-full bg-black rounded-xl flex items-center justify-center text-cyan-400">
              <PhoneCall className="w-4 h-4" />
            </div>
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-sm font-bold tracking-widest font-mono uppercase text-white">
                ZEN.CALL
              </h1>
              <span className="px-1.5 py-0.2 rounded text-[9px] font-mono font-bold bg-cyan-500/20 text-cyan-300 border border-cyan-500/30">
                v1.0 Bible Parity
              </span>
            </div>
            <p className="text-[10px] text-zinc-400 font-mono">Real-time communication, reimagined</p>
          </div>
        </div>

        <div className="flex items-center gap-3 font-mono text-xs text-zinc-400">
          <div className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/5 border border-white/10">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            <span>Sovereign WebRTC Mesh: Active</span>
          </div>
        </div>
      </header>

      {/* ── MAIN CONTENT ── */}
      <main className="flex-1 max-w-7xl w-full mx-auto p-4 sm:p-8 grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
        {/* Left Col: Green Room & Devices (5 cols) */}
        <div className="lg:col-span-6 space-y-4">
          <div className="relative aspect-video rounded-3xl overflow-hidden bg-zinc-950 border border-white/15 shadow-[0_20px_60px_rgba(0,0,0,0.8)] flex items-center justify-center group">
            {isCamOn ? (
              <video
                ref={videoRef}
                autoPlay
                playsInline
                muted
                className={`w-full h-full object-cover transform -scale-x-100 ${
                  selectedBg === 'blur' ? 'blur-sm' : ''
                }`}
              />
            ) : (
              <div className="flex flex-col items-center gap-2 text-zinc-500">
                <div className="w-16 h-16 rounded-full bg-white/5 border border-white/10 flex items-center justify-center text-zinc-400">
                  <VideoOff className="w-8 h-8" />
                </div>
                <span className="text-xs font-mono">Camera is switched off</span>
              </div>
            )}

            {/* Virtual Background Overlay Indicator */}
            {selectedBg !== 'none' && (
              <div className="absolute top-4 left-4 px-2.5 py-1 rounded-full bg-black/60 backdrop-blur-md border border-white/15 text-[10px] font-mono text-cyan-300 flex items-center gap-1">
                <Sparkles className="w-3 h-3" />
                <span>Shader: {selectedBg}</span>
              </div>
            )}

            {/* Green Room Controls Bar */}
            <div className="absolute bottom-4 inset-x-4 flex items-center justify-between bg-black/70 backdrop-blur-md p-2 rounded-2xl border border-white/15">
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => setIsMicOn(!isMicOn)}
                  className={`p-2.5 rounded-xl transition cursor-pointer ${
                    isMicOn ? 'bg-white/15 text-white hover:bg-white/25' : 'bg-rose-600 text-white'
                  }`}
                  title={isMicOn ? 'Mute Mic' : 'Unmute Mic'}
                >
                  {isMicOn ? <Mic className="w-4 h-4" /> : <MicOff className="w-4 h-4" />}
                </button>

                <button
                  type="button"
                  onClick={() => setIsCamOn(!isCamOn)}
                  className={`p-2.5 rounded-xl transition cursor-pointer ${
                    isCamOn ? 'bg-white/15 text-white hover:bg-white/25' : 'bg-rose-600 text-white'
                  }`}
                  title={isCamOn ? 'Turn Camera Off' : 'Turn Camera On'}
                >
                  {isCamOn ? <Video className="w-4 h-4" /> : <VideoOff className="w-4 h-4" />}
                </button>
              </div>

              {/* Mic VU Meter Bar */}
              <div className="flex items-center gap-2 px-2">
                <Volume2 className="w-3.5 h-3.5 text-zinc-400" />
                <div className="w-20 h-2 bg-zinc-800 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-emerald-400 transition-all duration-100"
                    style={{ width: `${isMicOn ? micLevel : 0}%` }}
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Virtual Shaders & Backgrounds */}
          <div className="p-3.5 rounded-2xl bg-white/[0.03] border border-white/10 flex items-center justify-between">
            <span className="text-xs font-mono text-zinc-300 flex items-center gap-1.5">
              <Sliders className="w-3.5 h-3.5 text-cyan-400" />
              <span>Virtual Background:</span>
            </span>

            <div className="flex items-center gap-1.5 font-mono text-xs">
              {(['none', 'blur', 'geneva', 'stage'] as const).map((bg) => (
                <button
                  key={bg}
                  type="button"
                  onClick={() => setSelectedBg(bg)}
                  className={`px-2.5 py-1 rounded-xl capitalize transition cursor-pointer border ${
                    selectedBg === bg
                      ? 'bg-cyan-500 text-black border-cyan-400 font-bold shadow'
                      : 'bg-white/5 border-white/10 text-zinc-400 hover:text-white'
                  }`}
                >
                  {bg}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Right Col: Mode Selector & Join Engine (7 cols) */}
        <div className="lg:col-span-6 space-y-6">
          <div className="space-y-1">
            <span className="text-xs font-mono uppercase tracking-widest text-cyan-400 font-bold">
              01 — ADAPTIVE CONVERSATION LAYER
            </span>
            <h2 className="text-2xl sm:text-3xl font-bold font-display text-white">
              Choose your conversation format
            </h2>
            <p className="text-xs text-zinc-400 font-sans">
              ZEN.CALL adapts the UI, audio mix, and protocols to your specific meeting context.
            </p>
          </div>

          {/* 6 Modes Grid */}
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5">
            {modesConfig.map((mode) => {
              const Icon = mode.icon;
              const isSelected = selectedMode === mode.id;
              return (
                <button
                  key={mode.id}
                  type="button"
                  onClick={() => setSelectedMode(mode.id)}
                  className={`p-3.5 rounded-2xl border text-left transition-all duration-200 cursor-pointer flex flex-col justify-between h-28 ${
                    isSelected
                      ? 'bg-gradient-to-tr ' + mode.color + ' border-white text-white shadow-xl scale-[1.02]'
                      : 'bg-white/[0.03] border-white/10 hover:border-white/20 text-zinc-300'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <Icon className="w-5 h-5" />
                    {isSelected && <Check className="w-4 h-4" />}
                  </div>
                  <div>
                    <h4 className="text-xs font-bold font-mono uppercase">{mode.label}</h4>
                    <p className="text-[9px] opacity-80 line-clamp-2 leading-tight mt-0.5 font-sans">
                      {mode.desc}
                    </p>
                  </div>
                </button>
              );
            })}
          </div>

          {/* Action Hub */}
          <div className="p-5 rounded-3xl bg-black/60 border border-white/15 space-y-4 shadow-xl">
            {/* Start Button */}
            <button
              type="button"
              onClick={handleStartCall}
              className="w-full py-4 rounded-2xl bg-gradient-to-r from-cyan-500 via-blue-600 to-indigo-600 hover:opacity-95 text-black font-bold text-xs uppercase tracking-widest transition shadow-[0_0_30px_rgba(6,182,212,0.4)] cursor-pointer flex items-center justify-center gap-2"
              style={{ fontFamily: 'Clash Display, var(--font-space), sans-serif' }}
            >
              <span>Launch {selectedMode} Room Now</span>
              <ArrowRight className="w-4 h-4" />
            </button>

            <div className="relative flex items-center justify-center">
              <div className="w-full border-t border-white/10" />
              <span className="absolute bg-[#080912] px-3 text-[10px] font-mono text-zinc-500 uppercase">
                Or join existing
              </span>
            </div>

            {/* Join with Code */}
            <form onSubmit={handleJoinCall} className="flex gap-2">
              <input
                type="text"
                value={joinCode}
                onChange={(e) => setJoinCode(e.target.value)}
                placeholder="Enter room code or link (e.g. zen-123-456)..."
                className="flex-1 px-4 py-2.5 rounded-xl bg-black border border-white/15 text-white font-mono text-xs placeholder:text-zinc-600 focus:outline-none focus:border-cyan-400 transition"
              />
              <button
                type="submit"
                disabled={!joinCode.trim()}
                className="px-5 py-2.5 rounded-xl bg-white hover:bg-zinc-200 disabled:opacity-30 text-black font-mono font-bold text-xs transition cursor-pointer shadow"
              >
                Join
              </button>
            </form>
          </div>
        </div>
      </main>
    </div>
  );
}

