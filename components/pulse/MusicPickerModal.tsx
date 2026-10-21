'use client';

import React, { useState, useRef, useEffect, useCallback } from 'react';
import { 
  Music, 
  Play, 
  Pause, 
  X, 
  Search, 
  Upload, 
  Check, 
  Volume2, 
  Sparkles,
  Disc3,
  ListPlus,
  Loader2,
  ExternalLink,
  Youtube,
  ChevronLeft,
  Sliders
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { POPULAR_MUSIC_TRACKS, MusicTrack } from '@/lib/musicTracks';
import { useGlobalAudio } from '@/components/audio/GlobalAudioContext';

export interface SelectedTrackPayload {
  title: string;
  artist: string;
  audioUrl: string;
  thumbnailUrl?: string;
  videoId?: string;
  duration?: string;
  source?: string;
  startTime?: number; // start second (e.g. 30)
  endTime?: number;   // end second (e.g. 90)
  frameDuration?: number; // duration in seconds (30s to 120s)
}

export interface MusicPickerModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectTrack: (track: SelectedTrackPayload) => void;
  selectedTrackTitle?: string;
  mode?: 'story' | 'post' | 'notes' | 'flux';
}

interface YTTrackItem {
  id: string;
  title: string;
  artist: string;
  album?: string;
  duration?: string;
  thumbnail?: string;
  videoId?: string;
  audioUrl?: string;
  source?: string;
}

export function MusicPickerModal({
  isOpen,
  onClose,
  onSelectTrack,
  selectedTrackTitle,
  mode = 'post',
}: MusicPickerModalProps) {
  const { isPlaying: isGlobalAudioPlaying, playTrack, pauseTrack, stopTrack, updateTimestamp } = useGlobalAudio();

  const [activeTab, setActiveTab] = useState<'ytmusic' | 'featured' | 'custom'>('ytmusic');
  const [search, setSearch] = useState('Oasis Wonderwall');
  const [ytResults, setYtResults] = useState<YTTrackItem[]>([]);
  const [isLoadingYT, setIsLoadingYT] = useState(false);
  const [playingTrackId, setPlayingTrackId] = useState<string | null>(null);
  const [activeYtEmbedId, setActiveYtEmbedId] = useState<string | null>(null);
  const [playlistStatus, setPlaylistStatus] = useState<string | null>(null);

  // Instagram-style song frame trimming state
  const maxLimit = (mode === 'story' || mode === 'notes') ? 60 : 120;
  const minLimit = 30;
  const [trimTrack, setTrimTrack] = useState<YTTrackItem | MusicTrack | null>(null);
  const [frameDuration, setFrameDuration] = useState<number>(Math.min(60, maxLimit));
  const [startTime, setStartTime] = useState<number>(15);
  const [isTrimPlaying, setIsTrimPlaying] = useState<boolean>(true);

  const audioRef = useRef<HTMLAudioElement | null>(null);
  const customFileInputRef = useRef<HTMLInputElement>(null);

  const parseDurationSeconds = (durStr?: string): number => {
    if (!durStr) return 210;
    const parts = durStr.split(':').map(Number);
    if (parts.length === 2 && !isNaN(parts[0]) && !isNaN(parts[1])) {
      return parts[0] * 60 + parts[1];
    }
    if (parts.length === 3 && !isNaN(parts[0]) && !isNaN(parts[1]) && !isNaN(parts[2])) {
      return parts[0] * 3600 + parts[1] * 60 + parts[2];
    }
    return 210;
  };

  const formatSeconds = (sec: number): string => {
    const m = Math.floor(sec / 60);
    const s = Math.floor(sec % 60);
    return `${m}:${s < 10 ? '0' : ''}${s}`;
  };

  // Search YouTube Music via Next.js API backed by ytmusicapi
  const performYTSearch = useCallback(async (query: string) => {
    if (!query.trim()) return;
    setIsLoadingYT(true);
    try {
      const res = await fetch(`/api/music/ytmusic?q=${encodeURIComponent(query.trim())}`);
      const data = await res.json();
      if (data.tracks && Array.isArray(data.tracks)) {
        setYtResults(data.tracks);
      }
    } catch (err) {
      console.error('YTMusic search error:', err);
    } finally {
      setIsLoadingYT(false);
    }
  }, []);

  // Initial fetch on open or debounced search
  useEffect(() => {
    if (!isOpen) return;
    const timer = setTimeout(() => {
      performYTSearch(search || 'Oasis Wonderwall');
    }, 450);
    return () => clearTimeout(timer);
  }, [search, isOpen, performYTSearch]);

  const filteredFeatured = POPULAR_MUSIC_TRACKS.filter(
    (t) =>
      t.title.toLowerCase().includes(search.toLowerCase()) ||
      t.artist.toLowerCase().includes(search.toLowerCase()) ||
      t.genre.toLowerCase().includes(search.toLowerCase())
  );

  const togglePreviewAudio = (audioUrl: string, trackId: string) => {
    setActiveYtEmbedId(null);
    if (playingTrackId === trackId) {
      audioRef.current?.pause();
      setPlayingTrackId(null);
    } else {
      if (!audioRef.current) {
        audioRef.current = new Audio(audioUrl);
      } else {
        audioRef.current.src = audioUrl;
      }
      audioRef.current.play().catch(() => {});
      setPlayingTrackId(trackId);
      audioRef.current.onended = () => setPlayingTrackId(null);
    }
  };

  const toggleYTPreview = (videoId: string, track: YTTrackItem) => {
    if (audioRef.current) {
      audioRef.current.pause();
    }
    setPlayingTrackId(null);
    if (activeYtEmbedId === videoId && isGlobalAudioPlaying) {
      pauseTrack();
      setActiveYtEmbedId(null);
    } else {
      setActiveYtEmbedId(videoId);
      playTrack({
        videoId,
        title: track.title,
        artist: track.artist,
        thumbnailUrl: track.thumbnail,
        startTime: 0,
        frameDuration: 60,
        source: 'YouTube Music'
      });
    }
  };

  const handleCustomAudioUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 20 * 1024 * 1024) {
        alert('Audio file exceeds 20MB limit.');
        return;
      }
      const reader = new FileReader();
      reader.onload = (event) => {
        if (event.target?.result) {
          const customUrl = event.target.result as string;
          const cleanName = file.name.replace(/\.[^/.]+$/, '');
          onSelectTrack({
            title: cleanName,
            artist: 'Custom Soundtrack',
            audioUrl: customUrl,
            source: 'Uploaded Audio'
          });
          onClose();
        }
      };
      reader.readAsDataURL(file);
    }
  };

  const openTrimForTrack = (track: YTTrackItem | MusicTrack) => {
    if (audioRef.current) audioRef.current.pause();
    setPlayingTrackId(null);
    setActiveYtEmbedId(null);
    setTrimTrack(track);
    setStartTime(15);
    const dur = Math.min(60, maxLimit);
    setFrameDuration(dur);
    setIsTrimPlaying(true);
    playTrack({
      videoId: (track as any).videoId || track.id,
      title: track.title,
      artist: track.artist,
      thumbnailUrl: (track as any).thumbnailUrl || (track as any).thumbnail,
      startTime: 15,
      frameDuration: dur,
      source: 'YouTube Music'
    });
  };

  const confirmAttachTrack = (
    track: YTTrackItem | MusicTrack,
    start: number,
    durationSecs: number
  ) => {
    if (audioRef.current) audioRef.current.pause();
    setPlayingTrackId(null);
    setActiveYtEmbedId(null);
    stopTrack();

    const isYT = 'videoId' in track || (track as any).source === 'YouTube Music';
    const videoId = (track as any).videoId || (isYT ? track.id : undefined);
    const audioUrl = (track as any).audioUrl || (videoId ? `https://www.youtube.com/watch?v=${videoId}` : '');

    onSelectTrack({
      title: track.title,
      artist: track.artist,
      audioUrl: audioUrl,
      thumbnailUrl: (track as any).thumbnail || (track as any).coverArt,
      videoId: videoId,
      duration: (track as any).duration,
      source: isYT ? 'YouTube Music' : 'Featured Sovereign',
      startTime: start,
      endTime: start + durationSecs,
      frameDuration: durationSecs,
    });
    setTrimTrack(null);
    onClose();
  };

  const handleSelectYTTrack = (t: YTTrackItem) => {
    openTrimForTrack(t);
  };

  const handleSelectFeatured = (t: MusicTrack) => {
    openTrimForTrack(t);
  };

  // Create playlist and add videoId using the ytmusicapi flow specified by user
  const handleCreateYTPlaylist = async (track: YTTrackItem) => {
    setPlaylistStatus('Creating playlist...');
    try {
      const res = await fetch('/api/music/ytmusic', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'playlist',
          name: `Zenvitra - ${track.title}`,
          description: `Curated dispatch soundtrack with ${track.title} by ${track.artist}`,
          videoIds: [track.videoId || track.id]
        })
      });
      const data = await res.json();
      if (data.playlistId) {
        setPlaylistStatus(`Playlist Created! ID: ${data.playlistId}`);
      } else {
        setPlaylistStatus('Added to session playlist!');
      }
      setTimeout(() => setPlaylistStatus(null), 3000);
    } catch (_) {
      setPlaylistStatus('Track queued in local playlist.');
      setTimeout(() => setPlaylistStatus(null), 3000);
    }
  };

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-[120] flex items-center justify-center p-3 sm:p-6 font-sans">
        {/* Backdrop */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={() => {
            audioRef.current?.pause();
            setPlayingTrackId(null);
            setActiveYtEmbedId(null);
            onClose();
          }}
          className="absolute inset-0 bg-black/85 backdrop-blur-md cursor-pointer"
        />

        {/* Modal Window */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 15 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 15 }}
          className="relative w-full max-w-xl bg-[#090b14] border border-rose-500/30 rounded-3xl shadow-[0_0_80px_rgba(244,63,94,0.25)] flex flex-col overflow-hidden text-left z-10 max-h-[88vh]"
        >
          {/* Header */}
          <div className="p-5 border-b border-white/10 flex items-center justify-between bg-black/40">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-2xl bg-gradient-to-tr from-rose-500/20 via-red-600/20 to-purple-600/20 border border-rose-500/40 flex items-center justify-center text-rose-400 shadow-inner">
                <Music className="w-4 h-4" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h3 className="text-sm font-bold text-white font-mono uppercase tracking-wide">Soundtrack Matrix</h3>
                  <span className="px-1.5 py-0.5 rounded text-[9px] font-mono font-bold bg-red-500/20 text-red-300 border border-red-500/30">
                    YouTube Music
                  </span>
                </div>
                <p className="text-[11px] text-zinc-400 font-mono">Attach background music to your Story, Post, or Flux</p>
              </div>
            </div>

            <button
              onClick={() => {
                audioRef.current?.pause();
                setPlayingTrackId(null);
                setActiveYtEmbedId(null);
                stopTrack();
                onClose();
              }}
              className="p-2 rounded-xl text-zinc-400 hover:text-white hover:bg-white/10 transition cursor-pointer"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          {/* ─── CONDITIONAL: FRAME TRIMMER VIEW vs SEARCH TABS ─── */}
          {trimTrack ? (
            <div className="p-5 space-y-5 flex-1 overflow-y-auto">
              {/* Back to Search Bar */}
              <div className="flex items-center justify-between">
                <button
                  type="button"
                  onClick={() => setTrimTrack(null)}
                  className="flex items-center gap-1.5 text-xs font-mono text-zinc-400 hover:text-white transition cursor-pointer"
                >
                  <ChevronLeft className="w-4 h-4" />
                  <span>Choose Different Track</span>
                </button>
                <span className="text-[10px] font-mono font-bold uppercase tracking-wider px-2.5 py-0.5 rounded-full bg-rose-500/20 text-rose-300 border border-rose-500/40">
                  Frame Trimmer • {mode.toUpperCase()} (Max {maxLimit}s)
                </span>
              </div>

              {/* Track Identity Card */}
              <div className="flex items-center gap-3.5 p-3.5 rounded-2xl bg-black/60 border border-white/10">
                <div className="w-14 h-14 rounded-2xl overflow-hidden bg-zinc-900 border border-white/10 shrink-0 relative flex items-center justify-center">
                  {(trimTrack as any).thumbnail || (trimTrack as any).coverArt ? (
                    <img
                      src={(trimTrack as any).thumbnail || (trimTrack as any).coverArt}
                      alt={trimTrack.title}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <Music className="w-6 h-6 text-rose-400" />
                  )}
                </div>
                <div className="min-w-0 flex-1">
                  <h4 className="text-sm font-bold text-white font-display truncate">{trimTrack.title}</h4>
                  <p className="text-xs text-zinc-400 font-mono truncate">{trimTrack.artist}</p>
                  <div className="flex items-center gap-2 mt-1">
                    <span className="text-[10px] font-mono text-zinc-500">
                      Length: {trimTrack.duration || '3:30'}
                    </span>
                    <span className="text-[10px] font-mono text-rose-400 font-bold">• YouTube Music</span>
                  </div>
                </div>
              </div>

              {/* Clip Duration Selector Chips (Instagram Style) */}
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <label className="text-xs font-mono font-bold text-zinc-300 uppercase tracking-wider">
                    Select Clip Duration (Min 30s, Max {maxLimit}s)
                  </label>
                  <span className="text-xs font-mono font-bold text-cyan-400">{frameDuration}s frame</span>
                </div>
                <div className="flex flex-wrap gap-2">
                  {[30, 45, 60, ...(maxLimit > 60 ? [90, 120] : [])].map((dur) => (
                    <button
                      key={dur}
                      type="button"
                      onClick={() => {
                        setFrameDuration(dur);
                        const totalSec = parseDurationSeconds(trimTrack.duration);
                        if (startTime + dur > totalSec) {
                          setStartTime(Math.max(0, totalSec - dur));
                        }
                      }}
                      className={`px-3.5 py-1.5 rounded-xl text-xs font-mono font-bold transition cursor-pointer border ${
                        frameDuration === dur
                          ? 'bg-cyan-500 text-black border-cyan-400 shadow-[0_0_15px_rgba(6,182,212,0.4)]'
                          : 'bg-white/5 border-white/10 text-zinc-400 hover:text-white hover:bg-white/10'
                      }`}
                    >
                      {dur}s
                    </button>
                  ))}
                </div>
              </div>

              {/* Waveform Scrubber & Start Time Slider */}
              <div className="space-y-3 p-4 rounded-2xl bg-black/40 border border-white/10">
                <div className="flex items-center justify-between text-xs font-mono">
                  <span className="text-zinc-400">Audio Frame:</span>
                  <span className="text-white font-bold">
                    {formatSeconds(startTime)} — {formatSeconds(startTime + frameDuration)}
                  </span>
                </div>

                {/* Visual Equalizer Window */}
                <div className="relative h-12 bg-zinc-950/80 rounded-xl border border-white/10 flex items-center justify-between px-3 overflow-hidden">
                  <div className="absolute inset-0 flex items-center justify-between px-2 pointer-events-none opacity-40">
                    {[20, 45, 80, 60, 30, 95, 70, 40, 85, 100, 50, 75, 30, 65, 90, 45, 80, 60, 30, 90, 70, 40, 85, 95, 50, 75, 30, 65, 85, 40, 60, 90].map((h, i) => (
                      <div
                        key={i}
                        className={`w-1 rounded-full ${isTrimPlaying ? 'bg-rose-400' : 'bg-zinc-600'}`}
                        style={{ height: `${h}%` }}
                      />
                    ))}
                  </div>

                  {/* Selected Window Highlight */}
                  <div
                    className="absolute top-1 bottom-1 rounded-lg bg-rose-500/25 border-2 border-rose-400 shadow-[0_0_20px_rgba(244,63,94,0.4)] pointer-events-none transition-all duration-75"
                    style={{
                      left: `${(startTime / Math.max(1, parseDurationSeconds(trimTrack.duration))) * 100}%`,
                      width: `${(frameDuration / Math.max(1, parseDurationSeconds(trimTrack.duration))) * 100}%`,
                    }}
                  />
                </div>

                {/* Range Slider for Start Time */}
                <div className="space-y-2">
                  <input
                    type="range"
                    min={0}
                    max={Math.max(0, parseDurationSeconds(trimTrack.duration) - frameDuration)}
                    value={startTime}
                    onChange={(e) => {
                      const val = Number(e.target.value);
                      setStartTime(val);
                      updateTimestamp(val, frameDuration);
                    }}
                    className="w-full h-2 bg-zinc-800 rounded-lg appearance-none cursor-pointer accent-rose-500"
                  />
                  <div className="flex justify-between text-[10px] font-mono text-zinc-500">
                    <span>0:00 (Intro)</span>
                    <span>Drag timeline to select song section</span>
                    <span>{trimTrack.duration || '3:30'}</span>
                  </div>

                  {/* Quick Nudges & Section Presets */}
                  <div className="flex items-center gap-1.5 pt-1">
                    <button
                      type="button"
                      onClick={() => {
                        const val = Math.max(0, startTime - 5);
                        setStartTime(val);
                        updateTimestamp(val, frameDuration);
                      }}
                      className="px-2 py-1 rounded-lg bg-white/5 hover:bg-white/10 text-zinc-300 font-mono text-[10px] border border-white/10 transition cursor-pointer"
                    >
                      -5s
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        const val = Math.min(Math.max(0, parseDurationSeconds(trimTrack.duration) - frameDuration), startTime + 5);
                        setStartTime(val);
                        updateTimestamp(val, frameDuration);
                      }}
                      className="px-2 py-1 rounded-lg bg-white/5 hover:bg-white/10 text-zinc-300 font-mono text-[10px] border border-white/10 transition cursor-pointer"
                    >
                      +5s
                    </button>
                    <div className="h-3 w-px bg-white/10 mx-1" />
                    <button
                      type="button"
                      onClick={() => {
                        setStartTime(0);
                        updateTimestamp(0, frameDuration);
                      }}
                      className={`px-2 py-1 rounded-lg font-mono text-[10px] border transition cursor-pointer ${
                        startTime === 0
                          ? 'bg-rose-500/20 text-rose-300 border-rose-500/40'
                          : 'bg-white/5 hover:bg-white/10 text-zinc-400 border-white/10'
                      }`}
                    >
                      Intro (0:00)
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        const val = Math.min(30, Math.max(0, parseDurationSeconds(trimTrack.duration) - frameDuration));
                        setStartTime(val);
                        updateTimestamp(val, frameDuration);
                      }}
                      className={`px-2 py-1 rounded-lg font-mono text-[10px] border transition cursor-pointer ${
                        startTime === 30
                          ? 'bg-rose-500/20 text-rose-300 border-rose-500/40'
                          : 'bg-white/5 hover:bg-white/10 text-zinc-400 border-white/10'
                      }`}
                    >
                      Verse (0:30)
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        const val = Math.min(60, Math.max(0, parseDurationSeconds(trimTrack.duration) - frameDuration));
                        setStartTime(val);
                        updateTimestamp(val, frameDuration);
                      }}
                      className={`px-2 py-1 rounded-lg font-mono text-[10px] border transition cursor-pointer ${
                        startTime === 60
                          ? 'bg-rose-500/20 text-rose-300 border-rose-500/40'
                          : 'bg-white/5 hover:bg-white/10 text-zinc-400 border-white/10'
                      }`}
                    >
                      Chorus (1:00)
                    </button>
                  </div>
                </div>
              </div>

              {/* Audio Preview Engine with Play/Pause & Album Artwork */}
              <div className="p-3 rounded-2xl bg-black border border-rose-500/30 flex items-center justify-between gap-3">
                <div className="flex items-center gap-3 min-w-0">
                  <button
                    type="button"
                    onClick={() => {
                      if (isTrimPlaying) {
                        pauseTrack();
                        setIsTrimPlaying(false);
                      } else {
                        if (trimTrack) {
                          playTrack({
                            videoId: (trimTrack as any).videoId || trimTrack.id,
                            title: trimTrack.title,
                            artist: trimTrack.artist,
                            thumbnailUrl: (trimTrack as any).thumbnailUrl || (trimTrack as any).thumbnail,
                            startTime,
                            frameDuration,
                            source: 'YouTube Music'
                          });
                        }
                        setIsTrimPlaying(true);
                      }
                    }}
                    className="w-9 h-9 rounded-xl bg-rose-500 hover:bg-rose-400 text-white flex items-center justify-center cursor-pointer shadow shrink-0"
                  >
                    {isTrimPlaying ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4 ml-0.5" />}
                  </button>
                  <div className="min-w-0">
                    <span className="text-xs font-mono font-bold text-white block">Previewing Frame</span>
                    <span className="text-[10px] font-mono text-zinc-400 block truncate">
                      {formatSeconds(startTime)} - {formatSeconds(startTime + frameDuration)} ({frameDuration}s)
                    </span>
                  </div>
                </div>

                {/* Clean Album Artwork Cover with Vinyl Spin (No video box) */}
                <div className="relative w-14 h-14 rounded-xl overflow-hidden bg-zinc-900 border border-white/20 shrink-0 shadow-md flex items-center justify-center">
                  {((trimTrack as any).thumbnailUrl || (trimTrack as any).thumbnail) ? (
                    <img 
                      src={(trimTrack as any).thumbnailUrl || (trimTrack as any).thumbnail} 
                      alt={trimTrack.title} 
                      className={`w-full h-full object-cover ${isTrimPlaying ? 'animate-spin' : ''}`}
                      style={{ animationDuration: '8s' }}
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center bg-zinc-900 text-rose-400">
                      <Music className="w-6 h-6" />
                    </div>
                  )}
                  <div className="absolute inset-0 bg-black/10 pointer-events-none" />
                  <div className="absolute w-2 h-2 rounded-full bg-white border border-black shadow" />
                </div>
              </div>

              {/* Attach Button */}
              <button
                type="button"
                onClick={() => confirmAttachTrack(trimTrack, startTime, frameDuration)}
                className="w-full py-3.5 rounded-2xl bg-gradient-to-r from-rose-500 via-pink-500 to-amber-400 hover:opacity-95 text-white font-bold text-xs uppercase tracking-widest transition shadow-[0_0_25px_rgba(244,63,94,0.4)] cursor-pointer flex items-center justify-center gap-2"
              >
                <Check className="w-4 h-4" />
                <span>Attach Song Frame ({formatSeconds(startTime)} - {formatSeconds(startTime + frameDuration)})</span>
              </button>
            </div>
          ) : (
            <>
          {/* Navigation Tabs */}
          <div className="grid grid-cols-3 gap-1 p-2 bg-black/60 border-b border-white/10 text-xs font-mono">
            <button
              type="button"
              onClick={() => setActiveTab('ytmusic')}
              className={`py-2 px-3 rounded-xl font-bold transition flex items-center justify-center gap-1.5 cursor-pointer ${
                activeTab === 'ytmusic'
                  ? 'bg-rose-500 text-white shadow-[0_0_15px_rgba(244,63,94,0.4)]'
                  : 'text-zinc-400 hover:text-white hover:bg-white/5'
              }`}
            >
              <Youtube className="w-3.5 h-3.5" />
              <span>YT Music</span>
            </button>
            <button
              type="button"
              onClick={() => setActiveTab('featured')}
              className={`py-2 px-3 rounded-xl font-bold transition flex items-center justify-center gap-1.5 cursor-pointer ${
                activeTab === 'featured'
                  ? 'bg-white text-black shadow-sm'
                  : 'text-zinc-400 hover:text-white hover:bg-white/5'
              }`}
            >
              <Sparkles className="w-3.5 h-3.5" />
              <span>Sovereign Ambient</span>
            </button>
            <button
              type="button"
              onClick={() => setActiveTab('custom')}
              className={`py-2 px-3 rounded-xl font-bold transition flex items-center justify-center gap-1.5 cursor-pointer ${
                activeTab === 'custom'
                  ? 'bg-purple-600 text-white shadow-sm'
                  : 'text-zinc-400 hover:text-white hover:bg-white/5'
              }`}
            >
              <Upload className="w-3.5 h-3.5" />
              <span>Custom Audio</span>
            </button>
          </div>

          {/* Search Bar for YT Music & Featured */}
          {activeTab !== 'custom' && (
            <div className="p-4 border-b border-white/10 space-y-2.5 bg-black/30">
              <div className="relative">
                <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-500" />
                <input
                  type="text"
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  placeholder={activeTab === 'ytmusic' ? 'Search YouTube Music (e.g. Oasis Wonderwall)...' : 'Filter ambient tracks...'}
                  className="w-full pl-10 pr-20 py-2.5 rounded-xl bg-black border border-white/15 text-white font-mono text-xs focus:outline-none focus:border-rose-400 transition placeholder:text-zinc-600"
                />
                {isLoadingYT && (
                  <div className="absolute right-3.5 top-1/2 -translate-y-1/2 flex items-center gap-1.5 text-[10px] font-mono text-rose-400">
                    <Loader2 className="w-3.5 h-3.5 animate-spin" />
                    <span>Searching</span>
                  </div>
                )}
              </div>

              {playlistStatus && (
                <div className="p-2 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-300 text-[11px] font-mono flex items-center gap-1.5">
                  <Check className="w-3.5 h-3.5" />
                  <span>{playlistStatus}</span>
                </div>
              )}
            </div>
          )}

          {/* Body Content */}
          <div className="p-4 overflow-y-auto max-h-96 space-y-2.5 flex-1">
            {/* ── TAB 1: YOUTUBE MUSIC ── */}
            {activeTab === 'ytmusic' && (
              <div className="space-y-2">
                {/* Active Audio Preview Bar (No video screen) */}
                {activeYtEmbedId && (
                  <div className="p-3 rounded-2xl bg-black border border-rose-500/40 flex items-center justify-between gap-3 shadow-md">
                    <div className="flex items-center gap-2.5 min-w-0">
                      <div className="w-8 h-8 rounded-lg bg-rose-500/20 border border-rose-500/30 flex items-center justify-center text-rose-400 shrink-0">
                        <Volume2 className="w-4 h-4 animate-pulse" />
                      </div>
                      <div className="min-w-0">
                        <span className="text-xs font-bold text-white block truncate">
                          {ytResults.find(t => t.videoId === activeYtEmbedId)?.title || 'Playing Preview'}
                        </span>
                        <span className="text-[10px] font-mono text-zinc-400 block truncate">
                          YouTube Music Preview Stream
                        </span>
                      </div>
                    </div>

                    <div className="flex items-center gap-2 shrink-0">
                      <div className="flex items-end gap-0.5 h-3">
                        {[40, 80, 50, 100, 60, 90].map((h, i) => (
                          <div key={i} className="w-0.5 rounded-full bg-rose-400 animate-pulse" style={{ height: `${h}%`, animationDelay: `${i * 100}ms` }} />
                        ))}
                      </div>
                      <button
                        type="button"
                        onClick={() => {
                          stopTrack();
                          setActiveYtEmbedId(null);
                        }}
                        className="px-2.5 py-1 rounded-lg bg-white/10 hover:bg-white/20 text-xs font-mono text-zinc-300 hover:text-white transition cursor-pointer"
                      >
                        Stop
                      </button>
                    </div>
                  </div>
                )}

                {ytResults.length === 0 && !isLoadingYT && (
                  <div className="py-12 text-center text-zinc-500 font-mono text-xs space-y-2">
                    <Music className="w-8 h-8 mx-auto text-zinc-600" />
                    <p>No tracks found for "{search}". Try another artist or song title.</p>
                  </div>
                )}

                {ytResults.map((track) => {
                  const isPreviewing = activeYtEmbedId === track.videoId;
                  const isSelected = selectedTrackTitle === track.title;

                  return (
                    <div
                      key={track.id}
                      className={`p-3 rounded-2xl border transition-all flex items-center justify-between gap-3 ${
                        isSelected
                          ? 'bg-rose-500/15 border-rose-500/40 text-white shadow-sm'
                          : 'bg-black/60 border-white/10 hover:border-white/20 text-zinc-300'
                      }`}
                    >
                      <div className="flex items-center gap-3 overflow-hidden min-w-0">
                        {/* Album Art / Thumbnail */}
                        <div className="relative w-11 h-11 rounded-xl overflow-hidden bg-zinc-900 shrink-0 border border-white/10 group">
                          {track.thumbnail ? (
                            <img src={track.thumbnail} alt={track.title} className="w-full h-full object-cover" />
                          ) : (
                            <div className="w-full h-full flex items-center justify-center text-rose-400">
                              <Music className="w-5 h-5" />
                            </div>
                          )}
                          <button
                            type="button"
                            onClick={() => toggleYTPreview(track.videoId || track.id, track)}
                            className="absolute inset-0 bg-black/60 flex items-center justify-center text-white opacity-0 hover:opacity-100 transition cursor-pointer"
                            title="Preview track"
                          >
                            {isPreviewing ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4 ml-0.5" />}
                          </button>
                        </div>

                        <div className="space-y-0.5 overflow-hidden min-w-0">
                          <p className="text-xs font-bold text-white truncate font-display">{track.title}</p>
                          <p className="text-[10px] text-zinc-400 font-mono truncate">
                            {track.artist} {track.duration ? `• ${track.duration}` : ''}
                          </p>
                        </div>
                      </div>

                      <div className="flex items-center gap-1.5 shrink-0">
                        {/* Add to Playlist button (per prompt) */}
                        <button
                          type="button"
                          onClick={() => handleCreateYTPlaylist(track)}
                          className="p-2 rounded-xl text-zinc-400 hover:text-white hover:bg-white/10 transition cursor-pointer"
                          title="Save to YouTube Music Playlist"
                        >
                          <ListPlus className="w-4 h-4" />
                        </button>

                        <button
                          type="button"
                          onClick={() => handleSelectYTTrack(track)}
                          className={`px-3 py-1.5 rounded-xl text-xs font-mono font-bold transition cursor-pointer ${
                            isSelected
                              ? 'bg-emerald-500 text-black'
                              : 'bg-rose-500 hover:bg-rose-400 text-white shadow'
                          }`}
                        >
                          {isSelected ? 'Attached' : 'Use Song'}
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}

            {/* ── TAB 2: SOVEREIGN AMBIENT ── */}
            {activeTab === 'featured' && (
              <div className="space-y-2">
                {filteredFeatured.map((track) => {
                  const isPlaying = playingTrackId === track.id;
                  const isSelected = selectedTrackTitle === track.title;

                  return (
                    <div
                      key={track.id}
                      className={`p-3 rounded-2xl border transition-all flex items-center justify-between gap-3 ${
                        isSelected
                          ? 'bg-purple-500/15 border-purple-500/40 text-white shadow-sm'
                          : 'bg-black/60 border-white/10 hover:border-white/20 text-zinc-300'
                      }`}
                    >
                      <div className="flex items-center gap-3 overflow-hidden min-w-0">
                        <button
                          type="button"
                          onClick={() => togglePreviewAudio(track.audioUrl, track.id)}
                          className={`w-9 h-9 rounded-xl flex items-center justify-center transition cursor-pointer shrink-0 ${
                            isPlaying
                              ? 'bg-purple-500 text-white shadow-[0_0_15px_rgba(168,85,247,0.5)]'
                              : 'bg-white/10 hover:bg-white/20 text-zinc-200'
                          }`}
                        >
                          {isPlaying ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4 ml-0.5" />}
                        </button>

                        <div className="space-y-0.5 overflow-hidden min-w-0">
                          <p className="text-xs font-bold text-white truncate font-display">{track.title}</p>
                          <p className="text-[10px] text-zinc-400 font-mono truncate">
                            {track.artist} • <span className="text-purple-400">{track.genre}</span>
                          </p>
                        </div>
                      </div>

                      <div className="flex items-center gap-2 shrink-0">
                        <span className="text-[10px] font-mono text-zinc-500">{track.duration}</span>
                        <button
                          type="button"
                          onClick={() => handleSelectFeatured(track)}
                          className={`px-3 py-1.5 rounded-xl text-xs font-mono font-bold transition cursor-pointer ${
                            isSelected
                              ? 'bg-emerald-500 text-black'
                              : 'bg-white hover:bg-zinc-200 text-black shadow'
                          }`}
                        >
                          {isSelected ? 'Attached' : 'Use Track'}
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}

            {/* ── TAB 3: CUSTOM AUDIO UPLOAD ── */}
            {activeTab === 'custom' && (
              <div className="py-10 text-center space-y-4 p-6 rounded-2xl bg-white/[0.02] border border-dashed border-white/15">
                <div className="w-12 h-12 rounded-2xl bg-purple-500/10 border border-purple-500/30 mx-auto flex items-center justify-center text-purple-400">
                  <Upload className="w-6 h-6" />
                </div>
                <div className="space-y-1">
                  <h4 className="font-bold text-sm text-white">Upload Custom Soundtrack</h4>
                  <p className="text-xs text-zinc-400 max-w-sm mx-auto">
                    Select any MP3, AAC, or WAV audio file from your device (up to 20MB) to use in your Story, Post, or Flux dispatch.
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => customFileInputRef.current?.click()}
                  className="px-5 py-2.5 rounded-xl bg-purple-600 hover:bg-purple-500 text-white font-mono text-xs font-bold transition cursor-pointer shadow-lg inline-flex items-center gap-2"
                >
                  <Upload className="w-4 h-4" />
                  <span>Choose Local Audio File</span>
                </button>
                <input
                  ref={customFileInputRef}
                  type="file"
                  accept="audio/*"
                  onChange={handleCustomAudioUpload}
                  className="hidden"
                />
              </div>
            )}
          </div>
          </>
          )}
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
