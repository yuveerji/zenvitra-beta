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
  Youtube
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { POPULAR_MUSIC_TRACKS, MusicTrack } from '@/lib/musicTracks';

export interface SelectedTrackPayload {
  title: string;
  artist: string;
  audioUrl: string;
  thumbnailUrl?: string;
  videoId?: string;
  duration?: string;
  source?: string;
}

interface MusicPickerModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectTrack: (track: SelectedTrackPayload) => void;
  selectedTrackTitle?: string;
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
}: MusicPickerModalProps) {
  const [activeTab, setActiveTab] = useState<'ytmusic' | 'featured' | 'custom'>('ytmusic');
  const [search, setSearch] = useState('Oasis Wonderwall');
  const [ytResults, setYtResults] = useState<YTTrackItem[]>([]);
  const [isLoadingYT, setIsLoadingYT] = useState(false);
  const [playingTrackId, setPlayingTrackId] = useState<string | null>(null);
  const [activeYtEmbedId, setActiveYtEmbedId] = useState<string | null>(null);
  const [playlistStatus, setPlaylistStatus] = useState<string | null>(null);

  const audioRef = useRef<HTMLAudioElement | null>(null);
  const customFileInputRef = useRef<HTMLInputElement>(null);

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

  const toggleYTPreview = (videoId: string, trackId: string) => {
    if (audioRef.current) {
      audioRef.current.pause();
    }
    setPlayingTrackId(null);
    if (activeYtEmbedId === videoId) {
      setActiveYtEmbedId(null);
    } else {
      setActiveYtEmbedId(videoId);
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

  const handleSelectYTTrack = (t: YTTrackItem) => {
    audioRef.current?.pause();
    setPlayingTrackId(null);
    setActiveYtEmbedId(null);
    onSelectTrack({
      title: t.title,
      artist: t.artist,
      audioUrl: t.audioUrl || `https://www.youtube.com/watch?v=${t.videoId || t.id}`,
      thumbnailUrl: t.thumbnail,
      videoId: t.videoId || t.id,
      duration: t.duration,
      source: 'YouTube Music'
    });
    onClose();
  };

  const handleSelectFeatured = (t: MusicTrack) => {
    audioRef.current?.pause();
    setPlayingTrackId(null);
    setActiveYtEmbedId(null);
    onSelectTrack({
      title: t.title,
      artist: t.artist,
      audioUrl: t.audioUrl,
      source: 'Featured Sovereign'
    });
    onClose();
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
                onClose();
              }}
              className="p-2 rounded-xl text-zinc-400 hover:text-white hover:bg-white/10 transition cursor-pointer"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

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
                {/* Active Embed Player */}
                {activeYtEmbedId && (
                  <div className="p-3 rounded-2xl bg-black border border-rose-500/40 space-y-2">
                    <div className="flex items-center justify-between text-[11px] font-mono text-rose-300">
                      <span>YouTube Music Audio Stream</span>
                      <button
                        type="button"
                        onClick={() => setActiveYtEmbedId(null)}
                        className="text-zinc-400 hover:text-white"
                      >
                        Close Preview
                      </button>
                    </div>
                    <div className="w-full h-24 rounded-xl overflow-hidden bg-black">
                      <iframe
                        src={`https://www.youtube.com/embed/${activeYtEmbedId}?autoplay=1&playsinline=1`}
                        title="YouTube Music Player"
                        className="w-full h-full border-0"
                        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                      />
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
                            onClick={() => toggleYTPreview(track.videoId || track.id, track.id)}
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
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
