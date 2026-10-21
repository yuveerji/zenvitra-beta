'use client';

import React, { createContext, useContext, useState, useRef, useEffect, useCallback } from 'react';
import { 
  Play, 
  Pause, 
  X, 
  Music, 
  Volume2, 
  Sliders, 
  ChevronUp, 
  ChevronDown, 
  ExternalLink, 
  RotateCcw,
  Sparkles,
  FastForward,
  Rewind
} from 'lucide-react';

declare global {
  interface Window {
    YT: any;
    onYouTubeIframeAPIReady: (() => void) | undefined;
  }
}

export interface GlobalAudioTrack {
  id?: string;
  title: string;
  artist: string;
  audioUrl?: string;
  videoId?: string;
  thumbnailUrl?: string;
  startTime?: number; // seconds
  endTime?: number; // seconds
  frameDuration?: number; // seconds
  source?: string;
}

interface GlobalAudioContextType {
  currentTrack: GlobalAudioTrack | null;
  isPlaying: boolean;
  isAdjusterOpen: boolean;
  setIsAdjusterOpen: (open: boolean) => void;
  openAdjuster: () => void;
  playTrack: (track: GlobalAudioTrack) => void;
  pauseTrack: () => void;
  toggleTrack: (track: GlobalAudioTrack) => void;
  stopTrack: () => void;
  updateTimestamp: (newStart: number, newDuration?: number) => void;
}

const GlobalAudioContext = createContext<GlobalAudioContextType | undefined>(undefined);

const formatSeconds = (sec: number): string => {
  const m = Math.floor(sec / 60);
  const s = Math.floor(sec % 60);
  return `${m}:${s < 10 ? '0' : ''}${s}`;
};

export function GlobalAudioProvider({ children }: { children: React.ReactNode }) {
  const [currentTrack, setCurrentTrack] = useState<GlobalAudioTrack | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [trackProgress, setTrackProgress] = useState(0);
  const [isAdjusterOpen, setIsAdjusterOpen] = useState(false);

  const htmlAudioRef = useRef<HTMLAudioElement | null>(null);
  const loopTimerRef = useRef<NodeJS.Timeout | null>(null);

  // YouTube Player API references & DOM host
  const ytHostRef = useRef<HTMLDivElement | null>(null);
  const ytPlayerRef = useRef<any>(null);
  const isYtReadyRef = useRef<boolean>(false);
  const pendingTrackRef = useRef<GlobalAudioTrack | null>(null);
  const activeStartRef = useRef<number>(0);
  const activeEndRef = useRef<number>(60);

  // Extract YouTube videoId from URL if not already explicitly provided
  const resolveVideoId = (track: GlobalAudioTrack): string | undefined => {
    if (track.videoId) return track.videoId;
    if (track.audioUrl) {
      const match = track.audioUrl.match(/(?:youtu\.be\/|youtube\.com\/(?:embed\/|v\/|watch\?v=|watch\?.+&v=))([\w-]{11})/);
      if (match && match[1]) return match[1];
    }
    return undefined;
  };

  // ── Initialize Official YouTube Iframe Player API ──
  useEffect(() => {
    if (typeof window === 'undefined') return;

    const initPlayer = () => {
      if (!window.YT || !window.YT.Player) return;
      if (ytPlayerRef.current) return;
      if (!ytHostRef.current) return;

      // Create an unmanaged child node that YouTube can replace safely without breaking React VDOM
      ytHostRef.current.innerHTML = '';
      const mountNode = document.createElement('div');
      ytHostRef.current.appendChild(mountNode);

      try {
        ytPlayerRef.current = new window.YT.Player(mountNode, {
          height: '1',
          width: '1',
          playerVars: {
            autoplay: 0,
            controls: 0,
            disablekb: 1,
            fs: 0,
            modestbranding: 1,
            rel: 0,
            playsinline: 1,
          },
          events: {
            onReady: (event: any) => {
              isYtReadyRef.current = true;
              try {
                event.target.unMute();
                event.target.setVolume(100);
              } catch (_) {}
              if (pendingTrackRef.current) {
                const pending = pendingTrackRef.current;
                pendingTrackRef.current = null;
                playYtVideo(pending);
              }
            },
            onStateChange: (event: any) => {
              // 1: PLAYING, 2: PAUSED, 0: ENDED
              if (event.data === 1) {
                setIsPlaying(true);
              } else if (event.data === 2) {
                setIsPlaying(false);
              } else if (event.data === 0) {
                // Loop within configured timestamp frame
                if (ytPlayerRef.current && activeStartRef.current !== undefined) {
                  try {
                    ytPlayerRef.current.seekTo(activeStartRef.current, true);
                    ytPlayerRef.current.playVideo();
                  } catch (_) {}
                }
              }
            },
            onError: (err: any) => {
              console.warn('YouTube Player API warning:', err);
            }
          },
        });
      } catch (err) {
        console.warn('Failed to initialize YouTube IFrame audio engine:', err);
      }
    };

    if (!window.YT) {
      const existing = document.getElementById('yt-api-script');
      if (!existing) {
        const script = document.createElement('script');
        script.id = 'yt-api-script';
        script.src = 'https://www.youtube.com/iframe_api';
        document.head.appendChild(script);
      }
      const prev = window.onYouTubeIframeAPIReady;
      window.onYouTubeIframeAPIReady = () => {
        if (prev) prev();
        initPlayer();
      };
    } else if (window.YT && window.YT.Player) {
      initPlayer();
    }

    return () => {
      if (ytPlayerRef.current) {
        try {
          ytPlayerRef.current.destroy();
        } catch (_) {}
        ytPlayerRef.current = null;
        isYtReadyRef.current = false;
      }
      if (ytHostRef.current) {
        ytHostRef.current.innerHTML = '';
      }
    };
  }, []);

  const playYtVideo = (track: GlobalAudioTrack) => {
    const videoId = track.videoId;
    if (!videoId) return;

    const start = track.startTime || 0;
    const dur = track.frameDuration || 60;
    const end = track.endTime || (start + dur);

    activeStartRef.current = start;
    activeEndRef.current = end;

    if (ytPlayerRef.current && isYtReadyRef.current) {
      try {
        ytPlayerRef.current.unMute();
        ytPlayerRef.current.setVolume(100);
        ytPlayerRef.current.loadVideoById({
          videoId,
          startSeconds: start,
          endSeconds: end,
        });
        ytPlayerRef.current.playVideo();
        setIsPlaying(true);
      } catch (e) {
        console.warn('YT playVideo error:', e);
      }
    } else {
      pendingTrackRef.current = track;
    }
  };

  const playTrack = (track: GlobalAudioTrack) => {
    const videoId = resolveVideoId(track);
    const start = track.startTime || 0;
    const dur = track.frameDuration || (track.endTime ? track.endTime - start : 60);
    const end = track.endTime || (start + dur);

    const fullTrack: GlobalAudioTrack = {
      ...track,
      videoId,
      startTime: start,
      endTime: end,
      frameDuration: dur,
    };

    // Pause any HTML audio
    if (htmlAudioRef.current) {
      htmlAudioRef.current.pause();
    }

    setCurrentTrack(fullTrack);
    setIsPlaying(true);
    setTrackProgress(0);

    if (videoId) {
      playYtVideo(fullTrack);
    } else if (fullTrack.audioUrl && !fullTrack.audioUrl.includes('youtube')) {
      if (!htmlAudioRef.current) {
        htmlAudioRef.current = new Audio(fullTrack.audioUrl);
      } else {
        htmlAudioRef.current.src = fullTrack.audioUrl;
      }
      htmlAudioRef.current.currentTime = start;
      htmlAudioRef.current.play().catch((e) => console.warn('Audio play error:', e));

      htmlAudioRef.current.ontimeupdate = () => {
        if (htmlAudioRef.current && htmlAudioRef.current.currentTime >= end) {
          htmlAudioRef.current.currentTime = start;
        }
      };
    }
  };

  const pauseTrack = () => {
    setIsPlaying(false);
    if (htmlAudioRef.current) {
      htmlAudioRef.current.pause();
    }
    if (ytPlayerRef.current && isYtReadyRef.current) {
      try {
        ytPlayerRef.current.pauseVideo();
      } catch (_) {}
    }
  };

  const stopTrack = () => {
    setIsPlaying(false);
    setCurrentTrack(null);
    setIsAdjusterOpen(false);
    if (htmlAudioRef.current) {
      htmlAudioRef.current.pause();
    }
    if (ytPlayerRef.current && isYtReadyRef.current) {
      try {
        ytPlayerRef.current.stopVideo();
      } catch (_) {}
    }
  };

  const toggleTrack = (track: GlobalAudioTrack) => {
    const targetId = track.videoId || track.id || track.title;
    const currentId = currentTrack ? (currentTrack.videoId || currentTrack.id || currentTrack.title) : null;

    if (currentId === targetId && isPlaying) {
      pauseTrack();
    } else {
      playTrack(track);
    }
  };

  const updateTimestamp = (newStart: number, newDuration?: number) => {
    if (!currentTrack) return;
    const safeStart = Math.max(0, newStart);
    const dur = newDuration !== undefined ? newDuration : (currentTrack.frameDuration || 60);
    const updated: GlobalAudioTrack = {
      ...currentTrack,
      startTime: safeStart,
      frameDuration: dur,
      endTime: safeStart + dur,
    };

    activeStartRef.current = safeStart;
    activeEndRef.current = safeStart + dur;

    setCurrentTrack(updated);
    setIsPlaying(true);
    setTrackProgress(0);

    if (updated.videoId) {
      if (ytPlayerRef.current && isYtReadyRef.current) {
        try {
          ytPlayerRef.current.seekTo(safeStart, true);
          ytPlayerRef.current.playVideo();
          setIsPlaying(true);
        } catch (_) {}
      }
    } else if (htmlAudioRef.current) {
      htmlAudioRef.current.currentTime = safeStart;
      htmlAudioRef.current.play().catch(() => {});
    }
  };

  // ── Progress Polling & Loop Enforcement ──
  useEffect(() => {
    if (!isPlaying) {
      if (loopTimerRef.current) clearInterval(loopTimerRef.current);
      return;
    }

    const interval = setInterval(() => {
      if (currentTrack?.videoId && ytPlayerRef.current && isYtReadyRef.current) {
        try {
          const curr = ytPlayerRef.current.getCurrentTime();
          const start = activeStartRef.current;
          const end = activeEndRef.current;
          const dur = end - start;

          if (dur > 0 && curr >= end) {
            ytPlayerRef.current.seekTo(start, true);
          } else if (dur > 0) {
            const pct = Math.min(100, Math.max(0, ((curr - start) / dur) * 100));
            setTrackProgress(pct);
          }
        } catch (_) {}
      }
    }, 250);

    loopTimerRef.current = interval;
    return () => clearInterval(interval);
  }, [isPlaying, currentTrack]);

  const activeVideoId = currentTrack ? resolveVideoId(currentTrack) : undefined;
  const activeStart = currentTrack?.startTime || 0;
  const activeEnd = currentTrack?.endTime || (activeStart + (currentTrack?.frameDuration || 60));
  const activeDuration = currentTrack?.frameDuration || 60;
  const totalTrackSeconds = 240; // Default span for scrubber

  return (
    <GlobalAudioContext.Provider
      value={{
        currentTrack,
        isPlaying,
        isAdjusterOpen,
        setIsAdjusterOpen,
        openAdjuster: () => setIsAdjusterOpen(true),
        playTrack,
        pauseTrack,
        toggleTrack,
        stopTrack,
        updateTimestamp,
      }}
    >
      {children}

      {/* ── UNMANAGED HOST CONTAINER (PROTECTED FROM REACT RECONCILIATION) ── */}
      <div 
        ref={ytHostRef} 
        className="fixed -bottom-10 -left-10 w-1 h-1 pointer-events-none opacity-[0.01] overflow-hidden" 
      />

      {/* ══════════════════════════════════════════════════════════════
          INSTAGRAM-STYLE GLOBAL AUDIO DOCK & TIMESTAMP ADJUSTER
          ══════════════════════════════════════════════════════════════ */}
      {currentTrack && (
        <div className="fixed bottom-5 right-5 z-[9999] flex flex-col items-end gap-2 max-w-sm w-full sm:w-auto font-sans select-none">
          
          {/* ── EXPANDABLE INSTAGRAM TIMESTAMP ADJUSTER DRAWER ── */}
          {isAdjusterOpen && (
            <div className="w-full sm:w-96 rounded-3xl bg-[#090b14]/98 border border-cyan-500/40 p-4 shadow-[0_20px_60px_rgba(0,0,0,0.9),0_0_30px_rgba(6,182,212,0.2)] backdrop-blur-2xl space-y-3.5 animate-in fade-in slide-in-from-bottom-4 duration-200">
              {/* Header */}
              <div className="flex items-center justify-between pb-2 border-b border-white/10">
                <div className="flex items-center gap-2">
                  <div className="w-6 h-6 rounded-lg bg-rose-500/20 border border-rose-500/40 flex items-center justify-center text-rose-400">
                    <Sliders className="w-3.5 h-3.5" />
                  </div>
                  <div>
                    <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-cyan-300 block">
                      Instagram Music Trimmer
                    </span>
                    <span className="text-xs font-bold text-white truncate block max-w-[200px]">
                      {currentTrack.title}
                    </span>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={() => setIsAdjusterOpen(false)}
                  className="p-1 rounded-lg text-zinc-400 hover:text-white hover:bg-white/10 transition cursor-pointer"
                  title="Collapse Trimmer"
                >
                  <ChevronDown className="w-4 h-4" />
                </button>
              </div>

              {/* Track Info Card */}
              <div className="flex items-center gap-3 p-2.5 rounded-2xl bg-black/60 border border-white/10">
                <div className="relative w-14 h-14 rounded-xl overflow-hidden bg-zinc-900 border border-white/20 shrink-0 shadow-md flex items-center justify-center">
                  {currentTrack.thumbnailUrl ? (
                    <img 
                      src={currentTrack.thumbnailUrl} 
                      alt={currentTrack.title} 
                      className={`w-full h-full object-cover ${isPlaying ? 'animate-spin' : ''}`}
                      style={{ animationDuration: '8s' }}
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center bg-zinc-900 text-rose-400">
                      <Music className="w-6 h-6" />
                    </div>
                  )}
                  <div className="absolute inset-0 bg-black/10 pointer-events-none" />
                  <div className="absolute w-2.5 h-2.5 rounded-full bg-white border border-black shadow" />
                </div>

                <div className="min-w-0 flex-1 space-y-1">
                  <p className="text-xs font-bold text-white truncate font-display">{currentTrack.title}</p>
                  <p className="text-[11px] font-mono text-zinc-400 truncate">{currentTrack.artist}</p>
                  <div className="flex items-center gap-1.5 text-[10px] font-mono text-cyan-300 font-bold">
                    <span>{formatSeconds(activeStart)}</span>
                    <span className="text-zinc-500">→</span>
                    <span>{formatSeconds(activeEnd)}</span>
                    <span className="px-1.5 py-0.2 rounded bg-cyan-500/20 text-cyan-300 border border-cyan-500/30 ml-auto">
                      {activeDuration}s clip
                    </span>
                  </div>

                  {activeVideoId && (
                    <a
                      href={`https://music.youtube.com/watch?v=${activeVideoId}&t=${activeStart}s`}
                      target="_blank"
                      rel="noreferrer"
                      className="inline-flex items-center gap-1 text-[9px] font-mono text-rose-400 hover:text-rose-300 underline pt-0.5"
                    >
                      <span>Open on YouTube Music</span>
                      <ExternalLink className="w-2.5 h-2.5" />
                    </a>
                  )}
                </div>
              </div>

              {/* Clip Duration Selector Chips (15s, 30s, 45s, 60s, 90s) */}
              <div className="space-y-1.5">
                <div className="flex items-center justify-between text-[10px] font-mono uppercase tracking-wider text-zinc-400">
                  <span>Clip Duration:</span>
                  <span className="text-cyan-400 font-bold">{activeDuration} seconds</span>
                </div>
                <div className="flex items-center gap-1.5">
                  {[15, 30, 45, 60, 90].map((dur) => (
                    <button
                      key={dur}
                      type="button"
                      onClick={() => updateTimestamp(activeStart, dur)}
                      className={`flex-1 py-1 rounded-xl text-[10px] font-mono font-bold transition cursor-pointer border ${
                        activeDuration === dur
                          ? 'bg-cyan-500 text-black border-cyan-400 shadow-[0_0_12px_rgba(6,182,212,0.4)]'
                          : 'bg-white/5 border-white/10 text-zinc-400 hover:text-white hover:bg-white/10'
                      }`}
                    >
                      {dur}s
                    </button>
                  ))}
                </div>
              </div>

              {/* Instagram Waveform Visualizer Bar */}
              <div className="space-y-1.5">
                <div className="flex items-center justify-between text-[10px] font-mono text-zinc-400">
                  <span>Timeline Scrubber</span>
                  <span className="text-rose-400 font-bold">
                    Window: {formatSeconds(activeStart)} - {formatSeconds(activeEnd)}
                  </span>
                </div>

                <div className="relative h-12 bg-black/80 rounded-2xl border border-white/10 flex items-center justify-between px-3 overflow-hidden">
                  {/* Equalizer Frequency Bars */}
                  <div className="absolute inset-0 flex items-center justify-between px-3 pointer-events-none opacity-40">
                    {[20, 50, 85, 60, 30, 95, 75, 40, 85, 100, 55, 75, 30, 65, 90, 45, 80, 60, 30, 90, 70, 40, 85, 95, 50, 75, 30, 65, 85, 40, 60, 90].map((h, i) => (
                      <div
                        key={i}
                        className={`w-1 rounded-full transition-all duration-150 ${
                          isPlaying ? 'bg-gradient-to-t from-cyan-400 to-rose-400' : 'bg-zinc-600'
                        }`}
                        style={{ height: `${h}%` }}
                      />
                    ))}
                  </div>

                  {/* Active Highlighted Audio Window */}
                  <div
                    className="absolute top-1 bottom-1 rounded-xl bg-gradient-to-r from-cyan-500/25 via-rose-500/30 to-amber-500/25 border-2 border-cyan-400 shadow-[0_0_20px_rgba(6,182,212,0.4)] pointer-events-none transition-all duration-75 flex items-center justify-between px-1"
                    style={{
                      left: `${(activeStart / totalTrackSeconds) * 100}%`,
                      width: `${Math.min(100 - (activeStart / totalTrackSeconds) * 100, (activeDuration / totalTrackSeconds) * 100)}%`,
                    }}
                  >
                    <div className="w-1 h-3 rounded-full bg-white/80" />
                    <div className="w-1 h-3 rounded-full bg-white/80" />
                  </div>
                </div>

                {/* Range Slider for Start Time */}
                <input
                  type="range"
                  min={0}
                  max={Math.max(0, totalTrackSeconds - activeDuration)}
                  value={activeStart}
                  onChange={(e) => updateTimestamp(Number(e.target.value), activeDuration)}
                  className="w-full h-2 bg-zinc-800 rounded-lg appearance-none cursor-pointer accent-cyan-400"
                />

                {/* Micro Nudges & Presets */}
                <div className="flex items-center justify-between pt-1">
                  <div className="flex items-center gap-1.5 text-[10px] font-mono">
                    <button
                      type="button"
                      onClick={() => updateTimestamp(Math.max(0, activeStart - 5), activeDuration)}
                      className="px-2 py-0.5 rounded-lg bg-white/5 hover:bg-white/10 border border-white/10 text-zinc-300 flex items-center gap-1 cursor-pointer"
                      title="Nudge back 5 seconds"
                    >
                      <Rewind className="w-2.5 h-2.5" />
                      <span>-5s</span>
                    </button>
                    <button
                      type="button"
                      onClick={() => updateTimestamp(Math.min(totalTrackSeconds - activeDuration, activeStart + 5), activeDuration)}
                      className="px-2 py-0.5 rounded-lg bg-white/5 hover:bg-white/10 border border-white/10 text-zinc-300 flex items-center gap-1 cursor-pointer"
                      title="Nudge forward 5 seconds"
                    >
                      <span>+5s</span>
                      <FastForward className="w-2.5 h-2.5" />
                    </button>
                  </div>

                  <div className="flex items-center gap-1">
                    <button
                      type="button"
                      onClick={() => updateTimestamp(0, activeDuration)}
                      className="px-1.5 py-0.5 rounded text-[9px] bg-white/5 hover:bg-white/10 text-zinc-400 hover:text-white cursor-pointer"
                    >
                      Intro
                    </button>
                    <button
                      type="button"
                      onClick={() => updateTimestamp(30, activeDuration)}
                      className="px-1.5 py-0.5 rounded text-[9px] bg-white/5 hover:bg-white/10 text-zinc-400 hover:text-white cursor-pointer"
                    >
                      Verse
                    </button>
                    <button
                      type="button"
                      onClick={() => updateTimestamp(60, activeDuration)}
                      className="px-1.5 py-0.5 rounded text-[9px] bg-cyan-500/20 text-cyan-300 border border-cyan-500/30 cursor-pointer"
                    >
                      Chorus
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* ── COMPACT FLOATING AUDIO PILL ── */}
          <div className="flex items-center gap-3 bg-[#0d1017]/95 border border-cyan-500/40 backdrop-blur-2xl px-3.5 py-2.5 rounded-2xl shadow-[0_10px_35px_rgba(0,0,0,0.8),0_0_20px_rgba(6,182,212,0.15)] animate-in fade-in slide-in-from-bottom-5 duration-300 max-w-sm w-full">
            
            {/* Cover Art / Spinning Vinyl */}
            <div className="relative w-11 h-11 rounded-xl overflow-hidden bg-black border border-white/15 shrink-0 flex items-center justify-center shadow-inner">
              {currentTrack.thumbnailUrl ? (
                <img
                  src={currentTrack.thumbnailUrl}
                  alt={currentTrack.title}
                  className={`w-full h-full object-cover ${isPlaying ? 'animate-spin' : ''}`}
                  style={{ animationDuration: '6s' }}
                />
              ) : (
                <div className={`w-full h-full bg-gradient-to-tr from-rose-500 to-amber-500 flex items-center justify-center text-white ${isPlaying ? 'animate-spin' : ''}`} style={{ animationDuration: '6s' }}>
                  <Music className="w-5 h-5" />
                </div>
              )}
              <div className="absolute inset-0 bg-black/15 pointer-events-none" />
              <div className="absolute w-2 h-2 rounded-full bg-white border border-black shadow" />
            </div>

            {/* Track Info & Animated Waveform */}
            <div className="min-w-0 flex-1">
              <div className="flex items-center gap-1.5">
                <span className="font-bold text-xs text-white truncate font-display">{currentTrack.title}</span>
                <span className="text-[9px] font-mono px-1 py-0.2 rounded bg-cyan-500/20 text-cyan-300 border border-cyan-500/40 shrink-0">
                  {formatSeconds(activeStart)}
                </span>
              </div>
              <p className="text-[10px] text-zinc-400 font-mono truncate">{currentTrack.artist}</p>

              {/* Progress Line */}
              <div className="w-full bg-zinc-800 rounded-full h-1 mt-1.5 overflow-hidden">
                <div
                  className="bg-gradient-to-r from-cyan-400 to-rose-400 h-full transition-all duration-200"
                  style={{ width: `${trackProgress}%` }}
                />
              </div>
            </div>

            {/* Controls */}
            <div className="flex items-center gap-1 shrink-0">
              {/* Instagram Timestamp Adjuster Toggle */}
              <button
                type="button"
                onClick={() => setIsAdjusterOpen(!isAdjusterOpen)}
                className={`p-1.5 rounded-xl transition cursor-pointer border ${
                  isAdjusterOpen
                    ? 'bg-cyan-500 text-black border-cyan-400 shadow-[0_0_10px_rgba(6,182,212,0.4)]'
                    : 'bg-white/5 border-white/10 text-zinc-400 hover:text-white hover:bg-white/10'
                }`}
                title="Adjust Music Timestamp (Instagram-style)"
              >
                <Sliders className="w-3.5 h-3.5" />
              </button>

              {/* Play / Pause Toggle */}
              <button
                type="button"
                onClick={() => {
                  if (isPlaying) pauseTrack();
                  else playTrack(currentTrack);
                }}
                className="p-2 rounded-xl bg-white text-black hover:bg-zinc-200 transition cursor-pointer shadow"
                title={isPlaying ? 'Pause' : 'Play'}
              >
                {isPlaying ? <Pause className="w-3.5 h-3.5 fill-black" /> : <Play className="w-3.5 h-3.5 fill-black ml-0.5" />}
              </button>

              {/* Close Button */}
              <button
                type="button"
                onClick={stopTrack}
                className="p-1.5 rounded-xl text-zinc-400 hover:text-white hover:bg-white/10 transition cursor-pointer"
                title="Stop & Close"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        </div>
      )}
    </GlobalAudioContext.Provider>
  );
}

export function useGlobalAudio() {
  const context = useContext(GlobalAudioContext);
  if (!context) {
    throw new Error('useGlobalAudio must be used within a GlobalAudioProvider');
  }
  return context;
}
