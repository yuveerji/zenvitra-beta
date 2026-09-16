'use client';

import React, { createContext, useContext, useState, useRef, useEffect } from 'react';
import { Play, Pause, X, Music, Volume2 } from 'lucide-react';

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
  playTrack: (track: GlobalAudioTrack) => void;
  pauseTrack: () => void;
  toggleTrack: (track: GlobalAudioTrack) => void;
  stopTrack: () => void;
}

const GlobalAudioContext = createContext<GlobalAudioContextType | undefined>(undefined);

export function GlobalAudioProvider({ children }: { children: React.ReactNode }) {
  const [currentTrack, setCurrentTrack] = useState<GlobalAudioTrack | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [trackProgress, setTrackProgress] = useState(0);

  const htmlAudioRef = useRef<HTMLAudioElement | null>(null);
  const loopTimerRef = useRef<NodeJS.Timeout | null>(null);

  // Extract YouTube videoId from URL if not already explicitly provided
  const resolveVideoId = (track: GlobalAudioTrack): string | undefined => {
    if (track.videoId) return track.videoId;
    if (track.audioUrl) {
      const match = track.audioUrl.match(/(?:youtu\.be\/|youtube\.com\/(?:embed\/|v\/|watch\?v=|watch\?.+&v=))([\w-]{11})/);
      if (match && match[1]) return match[1];
    }
    return undefined;
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

    // If it's a direct audio file (mp3, wav, blob, data URL)
    if (!videoId && fullTrack.audioUrl && !fullTrack.audioUrl.includes('youtube')) {
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
  };

  const stopTrack = () => {
    setIsPlaying(false);
    setCurrentTrack(null);
    if (htmlAudioRef.current) {
      htmlAudioRef.current.pause();
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

  // Enforce looping duration for YouTube IFrame
  useEffect(() => {
    if (!isPlaying || !currentTrack?.videoId) {
      if (loopTimerRef.current) clearInterval(loopTimerRef.current);
      return;
    }

    const durationMs = (currentTrack.frameDuration || 60) * 1000;
    const startTime = Date.now();

    loopTimerRef.current = setInterval(() => {
      const elapsed = (Date.now() - startTime) % durationMs;
      setTrackProgress((elapsed / durationMs) * 100);
    }, 250);

    return () => {
      if (loopTimerRef.current) clearInterval(loopTimerRef.current);
    };
  }, [isPlaying, currentTrack]);

  const activeVideoId = currentTrack ? resolveVideoId(currentTrack) : undefined;
  const activeStart = currentTrack?.startTime || 0;
  const activeEnd = currentTrack?.endTime || (activeStart + (currentTrack?.frameDuration || 60));

  return (
    <GlobalAudioContext.Provider
      value={{
        currentTrack,
        isPlaying,
        playTrack,
        pauseTrack,
        toggleTrack,
        stopTrack,
      }}
    >
      {children}

      {/* Hidden YouTube IFrame Audio Engine */}
      {currentTrack && activeVideoId && isPlaying && (
        <div className="fixed -bottom-[9999px] -left-[9999px] opacity-0 pointer-events-none w-1 h-1 overflow-hidden">
          <iframe
            key={`${activeVideoId}-${activeStart}-${activeEnd}`}
            src={`https://www.youtube-nocookie.com/embed/${activeVideoId}?autoplay=1&enablejsapi=1&start=${activeStart}&end=${activeEnd}&loop=1&playsinline=1`}
            title="Global YouTube Audio Engine"
            allow="autoplay; encrypted-media"
            className="w-full h-full"
          />
        </div>
      )}

      {/* Instagram-Style Floating Audio Pill */}
      {currentTrack && (
        <div className="fixed bottom-5 right-5 z-[90] flex items-center gap-3 bg-[#0d1017]/95 border border-cyan-500/30 backdrop-blur-xl px-4 py-2.5 rounded-2xl shadow-[0_10px_35px_rgba(0,0,0,0.7)] animate-in fade-in slide-in-from-bottom-5 duration-300 max-w-sm">
          {/* Cover Art / Spinning Vinyl */}
          <div className="relative w-10 h-10 rounded-xl overflow-hidden bg-black border border-white/10 shrink-0 flex items-center justify-center">
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
            <div className="absolute inset-0 bg-black/20" />
            <div className="absolute w-2 h-2 rounded-full bg-white border border-black shadow" />
          </div>

          {/* Track Info & Animated Waveform */}
          <div className="min-w-0 flex-1">
            <div className="flex items-center gap-1.5">
              <span className="font-bold text-xs text-white truncate font-display">{currentTrack.title}</span>
              <span className="text-[9px] font-mono px-1 py-0.2 rounded bg-cyan-500/20 text-cyan-300 border border-cyan-500/40">
                {currentTrack.frameDuration ? `${currentTrack.frameDuration}s` : 'YT'}
              </span>
            </div>
            <p className="text-[10px] text-zinc-400 font-mono truncate">{currentTrack.artist}</p>

            {/* Micro Waveform / Progress */}
            <div className="flex items-end gap-0.5 h-2.5 mt-1">
              {[40, 80, 50, 100, 60, 90, 30, 75, 95, 45, 85].map((barHeight, i) => (
                <div
                  key={i}
                  className={`w-1 rounded-full transition-all duration-150 ${
                    isPlaying ? 'bg-cyan-400' : 'bg-zinc-600'
                  }`}
                  style={{
                    height: isPlaying ? `${barHeight}%` : '30%',
                    opacity: isPlaying ? 0.9 : 0.4,
                  }}
                />
              ))}
            </div>
          </div>

          {/* Play/Pause & Close Controls */}
          <div className="flex items-center gap-1 shrink-0">
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

            <button
              type="button"
              onClick={stopTrack}
              className="p-1.5 rounded-xl text-zinc-400 hover:text-white hover:bg-white/10 transition cursor-pointer"
              title="Close Player"
            >
              <X className="w-3.5 h-3.5" />
            </button>
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
