'use client';

import React, { useState, useRef, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { Plus, Sparkles, MapPin, X, Trash2, Music, Play, Pause, Volume2, Search, Check } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useZenChat } from '@/context/ZenChatPlatformContext';
import { ZenNote, ZenNoteColor, ZenNoteSong } from '@/types/chat';

const MOOD_EMOJIS = ['✨', '✈️', '🏛️', '⚡', '☕', '🔥', '🎯', '📜', '💎', '💡', '🌍', '🚀'];
const LOCATION_TAGS = ['Location off', 'Palais des Nations', 'Chamber Plenary', 'War Room Caucus', 'Geneva Base', 'Sovereign Lab'];

/* ── Color Palette Definitions (Instagram style) ── */
export const NOTE_COLOR_THEMES: {
  id: ZenNoteColor;
  label: string;
  swatchClass: string;
  bubbleClass: string;
  textClass: string;
  subTextClass: string;
  tailClass: string;
  borderColor: string;
}[] = [
  {
    id: 'yellow',
    label: 'Sun Gold',
    swatchClass: 'bg-amber-400 text-black',
    bubbleClass: 'bg-[#ffde59] text-zinc-950 font-semibold shadow-[0_4px_20px_rgba(251,191,36,0.35)]',
    textClass: 'text-zinc-950',
    subTextClass: 'text-zinc-800',
    tailClass: 'bg-[#ffde59] border-zinc-950/10',
    borderColor: 'border-amber-400',
  },
  {
    id: 'dark',
    label: 'Obsidian',
    swatchClass: 'bg-[#181920] border border-white/20 text-white',
    bubbleClass: 'bg-[#14161f]/95 border border-white/15 text-zinc-100 shadow-[0_4px_20px_rgba(0,0,0,0.5)]',
    textClass: 'text-zinc-100',
    subTextClass: 'text-zinc-400',
    tailClass: 'bg-[#14161f] border-white/15',
    borderColor: 'border-white/20',
  },
  {
    id: 'sunset',
    label: 'Sunset Rose',
    swatchClass: 'bg-gradient-to-tr from-rose-500 to-amber-500 text-white',
    bubbleClass: 'bg-gradient-to-r from-rose-950/90 via-pink-950/80 to-purple-950/90 border border-rose-500/40 text-rose-100 shadow-[0_4px_20px_rgba(244,63,94,0.3)]',
    textClass: 'text-rose-100',
    subTextClass: 'text-rose-300',
    tailClass: 'bg-pink-950 border-rose-500/40',
    borderColor: 'border-rose-500/50',
  },
  {
    id: 'cyan',
    label: 'Neon Cyan',
    swatchClass: 'bg-cyan-400 text-black',
    bubbleClass: 'bg-[#082f49]/90 border border-cyan-400/50 text-cyan-100 shadow-[0_4px_20px_rgba(6,182,212,0.3)]',
    textClass: 'text-cyan-100',
    subTextClass: 'text-cyan-300',
    tailClass: 'bg-[#082f49] border-cyan-400/50',
    borderColor: 'border-cyan-400/50',
  },
  {
    id: 'emerald',
    label: 'Mint Emerald',
    swatchClass: 'bg-emerald-400 text-black',
    bubbleClass: 'bg-[#064e3b]/90 border border-emerald-400/50 text-emerald-100 shadow-[0_4px_20px_rgba(16,185,129,0.3)]',
    textClass: 'text-emerald-100',
    subTextClass: 'text-emerald-300',
    tailClass: 'bg-[#064e3b] border-emerald-400/50',
    borderColor: 'border-emerald-400/50',
  },
  {
    id: 'lavender',
    label: 'Lavender',
    swatchClass: 'bg-purple-500 text-white',
    bubbleClass: 'bg-gradient-to-r from-purple-900/80 to-indigo-900/80 border border-purple-500/40 text-purple-100 shadow-[0_4px_20px_rgba(168,85,247,0.3)]',
    textClass: 'text-purple-100',
    subTextClass: 'text-purple-300',
    tailClass: 'bg-indigo-900 border-purple-500/40',
    borderColor: 'border-purple-500/50',
  },
];

/* ── Curated Song Catalog (Instagram-style Music Picker) ── */
export const POPULAR_SONGS: ZenNoteSong[] = [
  { id: 'song-1', title: 'SugarCrash!', artist: 'ElyOtto', audioUrl: 'https://cdn.pixabay.com/download/audio/2022/03/15/audio_c8c8a73467.mp3?filename=lofi-study-112191.mp3' },
  { id: 'song-2', title: 'Na Ho Tum', artist: 'Kalp, Harshh', audioUrl: 'https://cdn.pixabay.com/download/audio/2022/05/27/audio_1808fbf07a.mp3?filename=chill-abstract-intention-12099.mp3' },
  { id: 'song-3', title: 'Starboy', artist: 'The Weeknd, Daft Punk', audioUrl: 'https://cdn.pixabay.com/download/audio/2022/11/06/audio_97eb9da58f.mp3?filename=electronic-future-beats-117997.mp3' },
  { id: 'song-4', title: 'Midnight City', artist: 'M83', audioUrl: 'https://cdn.pixabay.com/download/audio/2022/01/18/audio_d0a13f69d2.mp3?filename=ambient-piano-amp-strings-10711.mp3' },
  { id: 'song-5', title: 'After Dark', artist: 'Mr.Kitty', audioUrl: 'https://cdn.pixabay.com/download/audio/2022/10/14/audio_9939f792cb.mp3?filename=synthwave-80s-110045.mp3' },
  { id: 'song-6', title: 'Golden Hour', artist: 'JVKE', audioUrl: 'https://cdn.pixabay.com/download/audio/2022/03/15/audio_c8c8a73467.mp3?filename=lofi-study-112191.mp3' },
  { id: 'song-7', title: 'Sweater Weather', artist: 'The Neighbourhood', audioUrl: 'https://cdn.pixabay.com/download/audio/2022/05/27/audio_1808fbf07a.mp3?filename=chill-abstract-intention-12099.mp3' },
  { id: 'song-8', title: 'Die For You', artist: 'Joji', audioUrl: 'https://cdn.pixabay.com/download/audio/2022/11/06/audio_97eb9da58f.mp3?filename=electronic-future-beats-117997.mp3' },
];

export function ZenNotesRow() {
  const { zenNotes, postZenNote, deleteZenNote, currentUser, createDirectChat } = useZenChat();
  const [mounted, setMounted] = useState(false);
  const [isComposerOpen, setIsComposerOpen] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);
  const [noteText, setNoteText] = useState('');
  const [selectedMood, setSelectedMood] = useState('✨');
  const [selectedLocation, setSelectedLocation] = useState('Location off');
  const [selectedColor, setSelectedColor] = useState<ZenNoteColor>('cyan');
  const [selectedSong, setSelectedSong] = useState<ZenNoteSong | null>(null);
  const [isSongPickerOpen, setIsSongPickerOpen] = useState(false);
  const [songSearchQuery, setSongSearchQuery] = useState('');
  const [activeNoteInspect, setActiveNoteInspect] = useState<ZenNote | null>(null);

  // Audio preview playing state
  const [playingSongId, setPlayingSongId] = useState<string | null>(null);
  const audioPlayerRef = useRef<HTMLAudioElement | null>(null);

  const toggleAudioPlay = (song: ZenNoteSong, e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    const sid = song.id || song.title;
    if (playingSongId === sid) {
      audioPlayerRef.current?.pause();
      setPlayingSongId(null);
    } else {
      if (audioPlayerRef.current) {
        audioPlayerRef.current.pause();
      }
      const audio = new Audio(song.audioUrl || 'https://cdn.pixabay.com/download/audio/2022/03/15/audio_c8c8a73467.mp3?filename=lofi-study-112191.mp3');
      audioPlayerRef.current = audio;
      audio.play().catch(() => {});
      audio.onended = () => setPlayingSongId(null);
      setPlayingSongId(sid);
    }
  };

  // Find user's active note
  const myNote = zenNotes.find((n) => n.authorUsername === currentUser.username);
  const otherNotes = zenNotes.filter((n) => n.authorUsername !== currentUser.username);

  const handleOpenComposer = () => {
    if (myNote) {
      setNoteText(myNote.text);
      setSelectedMood(myNote.moodEmoji || '✨');
      setSelectedLocation(myNote.locationBadge || 'Location off');
      setSelectedColor(myNote.colorTheme || 'yellow');
      setSelectedSong(myNote.song || null);
    } else {
      setNoteText('');
      setSelectedMood('✨');
      setSelectedLocation('Location off');
      setSelectedColor('yellow');
      setSelectedSong(null);
    }
    setIsComposerOpen(true);
  };

  const handlePublishNote = (e: React.FormEvent) => {
    e.preventDefault();
    if (!noteText.trim() && !selectedSong) return;
    postZenNote(
      noteText.trim() || '🎶',
      selectedMood,
      selectedLocation,
      selectedSong || undefined,
      selectedColor
    );
    setNoteText('');
    setSelectedSong(null);
    setIsComposerOpen(false);
    if (audioPlayerRef.current) {
      audioPlayerRef.current.pause();
    }
    setPlayingSongId(null);
  };

  const getColorConfig = (theme?: ZenNoteColor) => {
    return NOTE_COLOR_THEMES.find((t) => t.id === theme) || NOTE_COLOR_THEMES[0];
  };

  const filteredSongs = POPULAR_SONGS.filter((s) => 
    s.title.toLowerCase().includes(songSearchQuery.toLowerCase()) ||
    s.artist.toLowerCase().includes(songSearchQuery.toLowerCase())
  );

  return (
    <div className="w-full px-3 py-3 border-b border-white/[0.06] bg-[#06070a]/90 backdrop-blur-md">
      <div className="flex items-center gap-4 overflow-x-auto scrollbar-none py-1">
        
        {/* 1. My Note Button (Single Unified Clickable Component) */}
        <button
          type="button"
          onClick={handleOpenComposer}
          className="group relative flex items-center gap-2.5 px-3 py-2 rounded-2xl bg-cyan-950/40 hover:bg-cyan-900/50 border border-cyan-500/50 hover:border-cyan-400 text-left transition-all duration-200 cursor-pointer shadow-[0_0_15px_rgba(6,182,212,0.15)] hover:shadow-[0_0_20px_rgba(6,182,212,0.3)] flex-shrink-0"
          title={myNote ? myNote.text : 'Write a sovereign note'}
        >
          {/* Avatar with status indicator */}
          <div className="relative w-10 h-10 rounded-full p-[2px] bg-gradient-to-tr from-cyan-500 via-sky-400 to-blue-600 flex-shrink-0 flex items-center justify-center">
            <div className="w-full h-full rounded-full bg-[#06070a] flex items-center justify-center font-bold text-xs text-cyan-200 uppercase overflow-hidden">
              {currentUser.name.charAt(0)}
            </div>
            <div className="absolute -bottom-0.5 -right-0.5 w-3.5 h-3.5 rounded-full bg-cyan-500 border-2 border-black flex items-center justify-center text-black text-[9px] font-black">
              +
            </div>
          </div>

          {/* Note Details inside the unified button */}
          <div className="flex flex-col min-w-0 max-w-[130px]">
            <div className="flex items-center gap-1">
              <span className="text-[10px] font-mono text-cyan-400 uppercase tracking-wider font-semibold">
                {myNote ? 'Your Note' : 'Add Note'}
              </span>
              {myNote && <span className="text-xs">{myNote.moodEmoji || '✨'}</span>}
            </div>
            <p className="text-xs text-neutral-200 font-sans truncate font-medium group-hover:text-cyan-100 transition">
              {myNote ? myNote.text : 'Share a thought...'}
            </p>
            {myNote?.song && (
              <div 
                onClick={(e) => {
                  e.stopPropagation();
                  toggleAudioPlay(myNote.song!, e);
                }}
                className="mt-0.5 flex items-center gap-1 px-1.5 py-0.5 rounded-full bg-cyan-900/60 hover:bg-cyan-800 text-[9px] text-cyan-200 truncate cursor-pointer transition"
              >
                <Music className="w-2.5 h-2.5 shrink-0 animate-pulse text-cyan-400" />
                <span className="truncate">{myNote.song.title}</span>
                {playingSongId === (myNote.song.id || myNote.song.title) ? (
                  <Pause className="w-2.5 h-2.5 shrink-0" />
                ) : (
                  <Play className="w-2.5 h-2.5 shrink-0 fill-current" />
                )}
              </div>
            )}
          </div>
        </button>

        {/* 2. Other Delegates' Active Notes */}
        {otherNotes.map((note) => {
          const config = getColorConfig(note.colorTheme);
          const isPlayingThis = playingSongId === (note.song?.id || note.song?.title);
          return (
            <div
              key={note.id}
              onClick={() => setActiveNoteInspect(note)}
              className="flex flex-col items-center gap-1.5 flex-shrink-0 cursor-pointer group"
            >
              {/* Thought Bubble with Color Theme */}
              <div 
                className={`relative px-2.5 py-1.5 rounded-2xl text-[11px] font-sans max-w-[125px] text-center group-hover:scale-105 transition-all flex flex-col items-center justify-center ${config.bubbleClass}`}
                title={note.text}
              >
                <div className="flex items-center gap-1 truncate max-w-full">
                  <span>{note.moodEmoji || '✨'}</span>
                  <span className="truncate">{note.text}</span>
                </div>
                {/* Song Attachment on Bubble */}
                {note.song && (
                  <div 
                    onClick={(e) => toggleAudioPlay(note.song!, e)}
                    className="mt-0.5 flex items-center gap-1 px-1.5 py-0.5 rounded-full bg-black/20 hover:bg-black/40 text-[9px] truncate max-w-full cursor-pointer transition"
                  >
                    <Music className="w-2.5 h-2.5 shrink-0" />
                    <span className="truncate">{note.song.title}</span>
                    {isPlayingThis ? (
                      <Pause className="w-2.5 h-2.5 shrink-0" />
                    ) : (
                      <Play className="w-2.5 h-2.5 shrink-0 fill-current" />
                    )}
                  </div>
                )}
                <div className={`absolute -bottom-1 left-1/2 -translate-x-1/2 w-2 h-2 rotate-45 border-r border-b ${config.tailClass}`} />
              </div>

              {/* Avatar with Story / Active Gradient */}
              <div className="relative w-14 h-14 rounded-full p-[2px] bg-gradient-to-tr from-amber-400 via-rose-500 to-purple-600 flex items-center justify-center shadow-md group-hover:scale-105 transition-transform">
                <div className="w-full h-full rounded-full bg-black flex items-center justify-center font-bold text-sm text-white uppercase overflow-hidden">
                  {note.authorAvatar ? (
                    <img src={note.authorAvatar} alt={note.authorName} className="w-full h-full object-cover" />
                  ) : (
                    note.authorName.charAt(0)
                  )}
                </div>
              </div>

              <span className="font-display font-medium text-[11px] text-neutral-300 truncate max-w-[75px]">
                {note.authorUsername}
              </span>
            </div>
          );
        })}
      </div>

      {/* ══════════════════════════════════════════════════════════════
          MODAL 1: WRITE / EDIT SOVEREIGN NOTE (Portaled to Body, Solid Opaque)
          ══════════════════════════════════════════════════════════════ */}
      {mounted && typeof document !== 'undefined' && createPortal(
        <AnimatePresence>
          {isComposerOpen && (
            <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4 sm:p-6 select-none">
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                onClick={() => setIsComposerOpen(false)}
                className="fixed inset-0 bg-black/85 backdrop-blur-md"
              />

              <motion.div
                initial={{ scale: 0.95, opacity: 0, y: 12 }}
                animate={{ scale: 1, opacity: 1, y: 0 }}
                exit={{ scale: 0.95, opacity: 0, y: 12 }}
                transition={{ duration: 0.2 }}
                style={{ backgroundColor: '#0c0e17' }}
                className="relative w-full max-w-md sm:max-w-lg rounded-3xl bg-[#0c0e17] border border-white/15 p-6 shadow-[0_25px_70px_rgba(0,0,0,0.95)] space-y-5 text-white z-10 max-h-[92vh] overflow-y-auto"
              >
                {/* Ambient glow */}
                <div className="absolute top-0 left-0 right-0 h-28 rounded-t-3xl bg-gradient-to-b from-cyan-500/10 via-transparent to-transparent pointer-events-none" />

                {/* Header */}
                <div className="flex items-center justify-between border-b border-white/[0.08] pb-3.5 relative z-10">
                  <div className="flex items-center gap-2.5">
                    <div className="w-8 h-8 rounded-xl bg-cyan-500/15 border border-cyan-500/30 flex items-center justify-center text-cyan-400 shadow-[0_0_12px_rgba(6,182,212,0.25)]">
                      <Sparkles className="w-4 h-4" />
                    </div>
                    <div>
                      <h3 className="font-display font-semibold text-sm text-white flex items-center gap-1.5">
                        <span>Sovereign Note Studio</span>
                        <span className="text-[9px] font-mono font-bold px-1.5 py-0.5 rounded bg-cyan-500/20 text-cyan-300 border border-cyan-500/30">
                          24H
                        </span>
                      </h3>
                      <p className="font-mono text-[10px] text-neutral-400">Broadcast temporary status to all caucus peers</p>
                    </div>
                  </div>
                  <button
                    onClick={() => setIsComposerOpen(false)}
                    className="p-1.5 rounded-xl bg-white/[0.05] hover:bg-white/10 text-neutral-400 hover:text-white transition cursor-pointer"
                    title="Close"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>

                {/* Dynamic Live Preview Visual */}
                <div 
                  style={{ backgroundColor: '#07080f' }}
                  className="flex flex-col items-center justify-center gap-3 py-6 bg-[#07080f] rounded-2xl border border-white/10 shadow-inner relative z-10"
                >
                  {(() => {
                    const previewConfig = getColorConfig(selectedColor);
                    return (
                      <div className="relative">
                        <div className={`px-4 py-2.5 rounded-2xl text-xs max-w-[260px] text-center transition-all duration-200 shadow-lg ${previewConfig.bubbleClass}`}>
                          <div className="flex items-center justify-center gap-1.5">
                            <span className="text-sm">{selectedMood}</span>
                            <span className="font-medium truncate">
                              {noteText || 'Share what is on your mind...'}
                            </span>
                          </div>

                          {/* Selected Song Preview Pill */}
                          {selectedSong && (
                            <div 
                              onClick={(e) => toggleAudioPlay(selectedSong, e)}
                              className="mt-2 flex items-center justify-center gap-1.5 px-2.5 py-1 rounded-full bg-black/40 text-[10px] font-sans hover:bg-black/60 cursor-pointer transition border border-white/10"
                            >
                              <Music className="w-3 h-3 text-cyan-400 animate-pulse shrink-0" />
                              <span className="truncate font-semibold text-white">{selectedSong.title}</span>
                              <span className="opacity-75 truncate text-neutral-300">· {selectedSong.artist}</span>
                              {playingSongId === (selectedSong.id || selectedSong.title) ? (
                                <Pause className="w-3 h-3 shrink-0 ml-0.5 text-cyan-300" />
                              ) : (
                                <Play className="w-3 h-3 shrink-0 ml-0.5 fill-current text-cyan-300" />
                              )}
                            </div>
                          )}
                        </div>
                        <div className={`absolute -bottom-1.5 left-1/2 -translate-x-1/2 w-3 h-3 rotate-45 border-r border-b ${previewConfig.tailClass}`} />
                      </div>
                    );
                  })()}

                  {/* Avatar Preview */}
                  <div className="w-11 h-11 rounded-full bg-gradient-to-tr from-cyan-500 via-sky-400 to-blue-600 p-[2px] mt-1 shadow-md">
                    <div className="w-full h-full rounded-full bg-black flex items-center justify-center text-white font-bold text-xs uppercase">
                      {currentUser.name.charAt(0)}
                    </div>
                  </div>
                </div>

                <form onSubmit={handlePublishNote} className="space-y-4 relative z-10">
                  {/* 1. Text Input with clean counter */}
                  <div className="space-y-1.5">
                    <div className="relative">
                      <input
                        type="text"
                        maxLength={60}
                        value={noteText}
                        onChange={(e) => setNoteText(e.target.value)}
                        placeholder="Share a thought (up to 60 characters)..."
                        style={{ backgroundColor: '#07080f' }}
                        className="w-full px-4 py-3 rounded-2xl bg-[#07080f] border border-white/15 text-xs text-white placeholder-neutral-500 focus:outline-none focus:border-cyan-400 focus:ring-1 focus:ring-cyan-400/40 transition-all font-sans"
                        autoFocus
                      />
                      <span className="absolute right-3 top-1/2 -translate-y-1/2 font-mono text-[10px] text-neutral-500">
                        {noteText.length}/60
                      </span>
                    </div>
                    <div className="flex justify-between items-center px-1 font-mono text-[10px] text-neutral-500">
                      <span>Auto-expires after 24 hours</span>
                      <span>Visible to delegate network</span>
                    </div>
                  </div>

                  {/* 2. Choose Note Color Palette */}
                  <div className="space-y-1.5">
                    <label className="font-mono text-[10px] text-neutral-400 uppercase tracking-wider block">
                      Choose Aura Palette:
                    </label>
                    <div className="grid grid-cols-3 sm:grid-cols-6 gap-1.5 pb-1">
                      {NOTE_COLOR_THEMES.map((theme) => {
                        const isSelected = selectedColor === theme.id;
                        return (
                          <button
                            key={theme.id}
                            type="button"
                            onClick={() => setSelectedColor(theme.id)}
                            className={`relative flex items-center justify-center gap-1 py-2 px-2 rounded-xl text-[11px] transition cursor-pointer ${theme.swatchClass} ${
                              isSelected ? 'ring-2 ring-white ring-offset-2 ring-offset-[#0c0e17] font-bold shadow-md scale-105' : 'opacity-70 hover:opacity-100'
                            }`}
                          >
                            {isSelected && <Check className="w-3 h-3" />}
                            <span className="truncate">{theme.label}</span>
                          </button>
                        );
                      })}
                    </div>
                  </div>

                  {/* 3. Add Song Feature */}
                  <div className="space-y-1.5">
                    <label className="font-mono text-[10px] text-neutral-400 uppercase tracking-wider block">
                      Attach Background Audio:
                    </label>

                    {selectedSong ? (
                      <div 
                        style={{ backgroundColor: '#07080f' }}
                        className="flex items-center justify-between p-2.5 rounded-2xl bg-[#07080f] border border-white/15 shadow-sm"
                      >
                        <div 
                          onClick={() => toggleAudioPlay(selectedSong)}
                          className="flex items-center gap-2.5 min-w-0 flex-1 cursor-pointer"
                        >
                          <div className="w-8 h-8 rounded-xl bg-cyan-400/20 text-cyan-300 flex items-center justify-center shrink-0">
                            {playingSongId === (selectedSong.id || selectedSong.title) ? (
                              <Pause className="w-4 h-4 text-cyan-300" />
                            ) : (
                              <Play className="w-4 h-4 text-cyan-300 fill-cyan-300" />
                            )}
                          </div>
                          <div className="min-w-0">
                            <p className="text-xs font-semibold text-white truncate">{selectedSong.title}</p>
                            <p className="text-[10px] text-neutral-400 truncate">{selectedSong.artist}</p>
                          </div>
                        </div>

                        <div className="flex items-center gap-1 shrink-0">
                          <button
                            type="button"
                            onClick={() => setIsSongPickerOpen(true)}
                            className="px-2 py-1 rounded-lg bg-white/10 hover:bg-white/15 text-[10px] text-neutral-300 transition cursor-pointer"
                          >
                            Change
                          </button>
                          <button
                            type="button"
                            onClick={() => setSelectedSong(null)}
                            className="p-1 rounded-lg hover:bg-white/10 text-neutral-400 hover:text-red-400 transition cursor-pointer"
                            title="Remove Song"
                          >
                            <X className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </div>
                    ) : (
                      <button
                        type="button"
                        onClick={() => setIsSongPickerOpen(true)}
                        style={{ backgroundColor: '#07080f' }}
                        className="w-full py-3 px-3 rounded-2xl bg-[#07080f] hover:bg-[#121522] border border-white/15 hover:border-cyan-400/40 text-neutral-300 hover:text-cyan-200 text-xs flex items-center justify-center gap-2 transition cursor-pointer shadow-sm"
                      >
                        <Music className="w-3.5 h-3.5 text-cyan-400" />
                        <span>Attach Audio Track (SugarCrash, Na Ho Tum...)</span>
                      </button>
                    )}
                  </div>

                  {/* 4. Mood & Signal */}
                  <div className="space-y-1.5">
                    <label className="font-mono text-[10px] text-neutral-400 uppercase tracking-wider block">
                      Pick Mood / Signal:
                    </label>
                    <div className="flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-none">
                      {MOOD_EMOJIS.map((emoji) => (
                        <button
                          key={emoji}
                          type="button"
                          onClick={() => setSelectedMood(emoji)}
                          className={`p-2 rounded-xl text-base transition cursor-pointer shrink-0 ${
                            selectedMood === emoji 
                              ? 'bg-white/20 border border-white/40 scale-110 shadow-sm' 
                              : 'bg-[#07080f] hover:bg-[#121522] border border-white/10'
                          }`}
                        >
                          {emoji}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* 5. Location Status */}
                  <div className="space-y-1.5">
                    <label className="font-mono text-[10px] text-neutral-400 uppercase tracking-wider block">
                      Location Status:
                    </label>
                    <div className="flex flex-wrap gap-1.5">
                      {LOCATION_TAGS.map((loc) => (
                        <button
                          key={loc}
                          type="button"
                          onClick={() => setSelectedLocation(loc)}
                          className={`px-2.5 py-1 rounded-xl font-mono text-[10px] transition cursor-pointer ${
                            selectedLocation === loc
                              ? 'bg-cyan-500/25 border border-cyan-400 text-cyan-200'
                              : 'bg-[#07080f] text-neutral-400 hover:bg-[#121522] border border-white/10'
                          }`}
                        >
                          {loc}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Action Row */}
                  <div className="flex items-center justify-between pt-3 border-t border-white/[0.08]">
                    {myNote && (
                      <button
                        type="button"
                        onClick={() => {
                          deleteZenNote(myNote.id);
                          setIsComposerOpen(false);
                        }}
                        className="px-3.5 py-2 rounded-xl bg-red-500/15 hover:bg-red-500/25 border border-red-500/30 text-red-300 text-xs font-mono flex items-center gap-1.5 transition cursor-pointer"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                        <span>Delete Note</span>
                      </button>
                    )}

                    <button
                      type="submit"
                      disabled={!noteText.trim() && !selectedSong}
                      className="ml-auto px-6 py-2.5 rounded-2xl bg-gradient-to-r from-cyan-400 via-sky-500 to-blue-600 hover:opacity-95 disabled:opacity-30 disabled:cursor-not-allowed text-black font-bold text-xs uppercase tracking-wider shadow-[0_0_20px_rgba(6,182,212,0.3)] transition cursor-pointer"
                    >
                      Broadcast Note
                    </button>
                  </div>
                </form>
              </motion.div>
            </div>
          )}
        </AnimatePresence>,
        document.body
      )}

      {/* ══════════════════════════════════════════════════════════════
          MODAL 2: SONG PICKER MODAL (Portaled to Body, Solid Opaque)
          ══════════════════════════════════════════════════════════════ */}
      {mounted && typeof document !== 'undefined' && createPortal(
        <AnimatePresence>
          {isSongPickerOpen && (
            <div className="fixed inset-0 z-[10000] flex items-center justify-center p-4 select-none">
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                onClick={() => setIsSongPickerOpen(false)}
                className="fixed inset-0 bg-black/90 backdrop-blur-md"
              />

              <motion.div
                initial={{ scale: 0.95, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.95, opacity: 0 }}
                style={{ backgroundColor: '#0c0e17' }}
                className="relative w-full max-w-sm sm:max-w-md rounded-3xl bg-[#0c0e17] border border-white/15 p-5 shadow-[0_25px_70px_rgba(0,0,0,0.95)] space-y-4 text-white z-10"
              >
                <div className="flex items-center justify-between border-b border-white/10 pb-3">
                  <div className="flex items-center gap-2">
                    <Music className="w-4 h-4 text-amber-400" />
                    <h3 className="font-display font-medium text-sm text-white">
                      Select Music Track
                    </h3>
                  </div>
                  <button
                    onClick={() => setIsSongPickerOpen(false)}
                    className="p-1 rounded-lg bg-white/[0.06] text-neutral-400 hover:text-white transition cursor-pointer"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>

                {/* Search Box */}
                <div className="relative">
                  <Search className="w-3.5 h-3.5 text-neutral-400 absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    value={songSearchQuery}
                    onChange={(e) => setSongSearchQuery(e.target.value)}
                    placeholder="Search songs or artists..."
                    style={{ backgroundColor: '#07080f' }}
                    className="w-full pl-9 pr-3 py-2.5 rounded-xl bg-[#07080f] border border-white/15 text-xs text-white placeholder-neutral-500 focus:outline-none focus:border-amber-400/60"
                    autoFocus
                  />
                </div>

                {/* Track List */}
                <div className="max-h-64 overflow-y-auto space-y-1 scrollbar-none pr-1">
                  {filteredSongs.map((song) => {
                    const isPlaying = playingSongId === (song.id || song.title);
                    const isCurrentChosen = selectedSong?.title === song.title;
                    return (
                      <div
                        key={song.id || song.title}
                        onClick={() => {
                          setSelectedSong(song);
                          setIsSongPickerOpen(false);
                        }}
                        className={`flex items-center justify-between p-2.5 rounded-2xl cursor-pointer transition ${
                          isCurrentChosen 
                            ? 'bg-amber-400/20 border border-amber-400/40' 
                            : 'hover:bg-white/[0.05] border border-transparent'
                        }`}
                      >
                        <div className="flex items-center gap-3 min-w-0 flex-1">
                          <button
                            type="button"
                            onClick={(e) => toggleAudioPlay(song, e)}
                            className="w-8 h-8 rounded-xl bg-white/10 hover:bg-amber-400 hover:text-black flex items-center justify-center transition shrink-0"
                          >
                            {isPlaying ? (
                              <Pause className="w-4 h-4" />
                            ) : (
                              <Play className="w-4 h-4 fill-current" />
                            )}
                          </button>
                          <div className="min-w-0">
                            <p className="font-sans font-semibold text-xs text-white truncate">
                              {song.title}
                            </p>
                            <p className="font-mono text-[10px] text-neutral-400 truncate">
                              {song.artist}
                            </p>
                          </div>
                        </div>

                        {isCurrentChosen && (
                          <Check className="w-4 h-4 text-amber-400 shrink-0 ml-2" />
                        )}
                      </div>
                    );
                  })}
                </div>
              </motion.div>
            </div>
          )}
        </AnimatePresence>,
        document.body
      )}

      {/* ══════════════════════════════════════════════════════════════
          MODAL 3: INSPECT OTHER DELEGATE'S NOTE (Portaled to Body)
          ══════════════════════════════════════════════════════════════ */}
      {mounted && typeof document !== 'undefined' && createPortal(
        <AnimatePresence>
          {activeNoteInspect && (
            <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4 select-none">
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                onClick={() => setActiveNoteInspect(null)}
                className="fixed inset-0 bg-black/85 backdrop-blur-md"
              />

              <motion.div
                initial={{ scale: 0.95, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.95, opacity: 0 }}
                style={{ backgroundColor: '#0c0e17' }}
                className="relative w-full max-w-xs sm:max-w-sm rounded-3xl bg-[#0c0e17] border border-white/15 p-6 shadow-[0_25px_70px_rgba(0,0,0,0.95)] space-y-4 text-center z-10"
              >
                <div className="flex justify-end">
                  <button
                    onClick={() => setActiveNoteInspect(null)}
                    className="p-1 rounded-lg bg-white/[0.04] text-neutral-400 hover:text-white transition cursor-pointer"
                  >
                    <X className="w-3.5 h-3.5" />
                  </button>
                </div>

                {/* Note Bubble with Color Theme */}
                {(() => {
                  const inspectConfig = getColorConfig(activeNoteInspect.colorTheme);
                  const isPlaying = playingSongId === (activeNoteInspect.song?.id || activeNoteInspect.song?.title);
                  return (
                    <div className={`px-4 py-3 rounded-2xl text-sm font-sans shadow-lg ${inspectConfig.bubbleClass}`}>
                      <span className="text-base mr-1.5">{activeNoteInspect.moodEmoji}</span>
                      <span>{activeNoteInspect.text}</span>

                      {/* Song Attached */}
                      {activeNoteInspect.song && (
                        <div 
                          onClick={() => toggleAudioPlay(activeNoteInspect.song!)}
                          className="mt-2 flex items-center justify-center gap-1.5 px-3 py-1 rounded-full bg-black/25 text-xs cursor-pointer hover:bg-black/35 transition"
                        >
                          <Music className="w-3.5 h-3.5 animate-pulse shrink-0" />
                          <span className="font-semibold truncate">{activeNoteInspect.song.title}</span>
                          <span className="opacity-75 truncate">· {activeNoteInspect.song.artist}</span>
                          {isPlaying ? (
                            <Pause className="w-3.5 h-3.5 shrink-0 ml-1" />
                          ) : (
                            <Play className="w-3.5 h-3.5 shrink-0 ml-1 fill-current" />
                          )}
                        </div>
                      )}
                    </div>
                  );
                })()}

                {/* Author Info */}
                <div className="flex flex-col items-center gap-1">
                  <div className="w-14 h-14 rounded-full bg-gradient-to-tr from-cyan-400 to-blue-600 p-[2px]">
                    <div className="w-full h-full rounded-full bg-black flex items-center justify-center text-white font-bold text-sm">
                      {activeNoteInspect.authorName.charAt(0)}
                    </div>
                  </div>
                  <h4 className="font-display font-medium text-sm text-white">
                    {activeNoteInspect.authorName}
                  </h4>
                  <span className="font-mono text-[10px] text-neutral-400">
                    @{activeNoteInspect.authorUsername} • {activeNoteInspect.locationBadge}
                  </span>
                </div>

                {/* Reply / Chat Action */}
                <button
                  onClick={() => {
                    createDirectChat(activeNoteInspect.authorUsername, activeNoteInspect.authorName);
                    setActiveNoteInspect(null);
                  }}
                  className="w-full py-2.5 rounded-2xl bg-cyan-500/20 border border-cyan-500/40 text-cyan-300 font-mono text-xs font-semibold hover:bg-cyan-500/30 transition cursor-pointer"
                >
                  Send Direct Message →
                </button>
              </motion.div>
            </div>
          )}
        </AnimatePresence>,
        document.body
      )}
    </div>
  );
}

