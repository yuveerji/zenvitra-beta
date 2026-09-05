'use client';

import React, { useState, useRef } from 'react';
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
  const [isComposerOpen, setIsComposerOpen] = useState(false);
  const [noteText, setNoteText] = useState('');
  const [selectedMood, setSelectedMood] = useState('✨');
  const [selectedLocation, setSelectedLocation] = useState('Location off');
  const [selectedColor, setSelectedColor] = useState<ZenNoteColor>('yellow');
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
        
        {/* 1. My Note Bubble */}
        <div className="flex flex-col items-center gap-1.5 flex-shrink-0 cursor-pointer group relative">
          {/* Floating Thought Bubble */}
          {(() => {
            const config = getColorConfig(myNote?.colorTheme);
            return (
              <div 
                onClick={handleOpenComposer}
                className={`relative px-2.5 py-1.5 rounded-2xl text-[11px] font-sans max-w-[125px] text-center cursor-pointer hover:scale-105 transition-all flex flex-col items-center justify-center ${
                  myNote ? config.bubbleClass : 'bg-gradient-to-r from-purple-900/60 to-indigo-900/60 border border-purple-500/40 text-purple-200'
                }`}
                title={myNote ? myNote.text : 'Share a Sovereign Note'}
              >
                {myNote ? (
                  <>
                    <div className="flex items-center gap-1 truncate max-w-full">
                      <span>{myNote.moodEmoji}</span>
                      <span className="truncate">{myNote.text}</span>
                    </div>
                    {/* Song Pill */}
                    {myNote.song && (
                      <div 
                        onClick={(e) => toggleAudioPlay(myNote.song!, e)}
                        className="mt-0.5 flex items-center gap-1 px-1.5 py-0.5 rounded-full bg-black/20 hover:bg-black/40 text-[9px] truncate max-w-full font-sans cursor-pointer transition"
                      >
                        <Music className="w-2.5 h-2.5 shrink-0 animate-pulse" />
                        <span className="truncate">{myNote.song.title}</span>
                        {playingSongId === (myNote.song.id || myNote.song.title) ? (
                          <Pause className="w-2.5 h-2.5 shrink-0" />
                        ) : (
                          <Play className="w-2.5 h-2.5 shrink-0 fill-current" />
                        )}
                      </div>
                    )}
                  </>
                ) : (
                  <span className="text-neutral-400 flex items-center gap-1 font-mono text-[10px]">
                    <Plus className="w-3 h-3 text-purple-400" />
                    <span>Your note</span>
                  </span>
                )}
                {/* Speech bubble tail pointer */}
                <div className={`absolute -bottom-1 left-1/2 -translate-x-1/2 w-2 h-2 rotate-45 border-r border-b ${
                  myNote ? config.tailClass : 'bg-indigo-900 border-purple-500/40'
                }`} />
              </div>
            );
          })()}

          {/* Avatar with Plus Badge */}
          <div 
            onClick={handleOpenComposer}
            className="relative w-14 h-14 rounded-full p-[2px] bg-gradient-to-tr from-purple-500 via-pink-500 to-amber-400 flex items-center justify-center cursor-pointer shadow-md group-hover:scale-105 transition-transform"
          >
            <div className="w-full h-full rounded-full bg-black flex items-center justify-center font-bold text-sm text-white uppercase overflow-hidden">
              {currentUser.name.charAt(0)}
            </div>
            
            <div className="absolute -bottom-0.5 -right-0.5 w-4 h-4 rounded-full bg-purple-600 border-2 border-black flex items-center justify-center text-white text-[10px] font-bold">
              +
            </div>
          </div>

          <span className="font-mono text-[10px] text-neutral-400 truncate max-w-[75px]">
            {myNote?.locationBadge || 'Your note'}
          </span>
        </div>

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
          MODAL 1: ZEN NOTE COMPOSER MODAL (z-[100] high isolation)
          ══════════════════════════════════════════════════════════════ */}
      <AnimatePresence>
        {isComposerOpen && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
            {/* Backdrop: deep solid opacity with blur to block background bleed */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsComposerOpen(false)}
              className="absolute inset-0 bg-black/90 backdrop-blur-xl"
            />

            <motion.div
              initial={{ scale: 0.95, opacity: 0, y: 10 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.95, opacity: 0, y: 10 }}
              className="relative w-full max-w-sm rounded-[2.5rem] bg-[#0c0d14] border border-white/15 p-6 shadow-2xl space-y-4 text-white z-10 max-h-[92vh] overflow-y-auto scrollbar-none"
            >
              {/* Header */}
              <div className="flex items-center justify-between border-b border-white/10 pb-3">
                <div className="flex items-center gap-2">
                  <Sparkles className="w-4 h-4 text-amber-400" />
                  <h3 className="font-display font-medium text-sm text-white">
                    Share a Thought Note
                  </h3>
                </div>
                <button
                  onClick={() => setIsComposerOpen(false)}
                  className="p-1.5 rounded-xl bg-white/[0.06] text-neutral-400 hover:text-white hover:bg-white/10 transition"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              {/* Dynamic Note Preview Visual */}
              <div className="flex flex-col items-center justify-center gap-2 py-3 bg-[#050608]/80 rounded-2xl border border-white/5">
                {(() => {
                  const previewConfig = getColorConfig(selectedColor);
                  return (
                    <div className="relative">
                      <div className={`px-4 py-2.5 rounded-2xl text-xs max-w-[220px] text-center transition-all ${previewConfig.bubbleClass}`}>
                        <div className="flex items-center justify-center gap-1.5">
                          <span>{selectedMood}</span>
                          <span className="font-medium truncate">
                            {noteText || 'Share what is on your mind...'}
                          </span>
                        </div>

                        {/* Selected Song Preview Pill */}
                        {selectedSong && (
                          <div 
                            onClick={(e) => toggleAudioPlay(selectedSong, e)}
                            className="mt-1.5 flex items-center justify-center gap-1.5 px-2.5 py-1 rounded-full bg-black/25 text-[10px] font-sans hover:bg-black/35 cursor-pointer transition"
                          >
                            <Music className="w-3 h-3 text-current animate-pulse shrink-0" />
                            <span className="truncate font-semibold">{selectedSong.title}</span>
                            <span className="opacity-75 truncate">· {selectedSong.artist}</span>
                            {playingSongId === (selectedSong.id || selectedSong.title) ? (
                              <Pause className="w-3 h-3 shrink-0 ml-0.5" />
                            ) : (
                              <Play className="w-3 h-3 shrink-0 ml-0.5 fill-current" />
                            )}
                          </div>
                        )}
                      </div>
                      <div className={`absolute -bottom-1 left-1/2 -translate-x-1/2 w-2.5 h-2.5 rotate-45 border-r border-b ${previewConfig.tailClass}`} />
                    </div>
                  );
                })()}

                {/* Avatar Preview */}
                <div className="w-12 h-12 rounded-full bg-gradient-to-tr from-amber-400 via-pink-500 to-purple-600 p-[2px] mt-1 shadow-md">
                  <div className="w-full h-full rounded-full bg-black flex items-center justify-center text-white font-bold text-sm">
                    {currentUser.name.charAt(0)}
                  </div>
                </div>
              </div>

              <form onSubmit={handlePublishNote} className="space-y-4">
                {/* 1. Text Input */}
                <div>
                  <input
                    type="text"
                    maxLength={60}
                    value={noteText}
                    onChange={(e) => setNoteText(e.target.value)}
                    placeholder="Share a thought (up to 60 characters)..."
                    className="w-full px-4 py-3 rounded-2xl bg-white/[0.04] border border-white/10 text-xs text-white placeholder-neutral-500 focus:outline-none focus:border-amber-400/60"
                  />
                  <div className="flex justify-between items-center px-1 pt-1 font-mono text-[10px] text-neutral-500">
                    <span>Visible to friends for 24 hours</span>
                    <span>{noteText.length}/60</span>
                  </div>
                </div>

                {/* 2. Choose Note Color Palette */}
                <div className="space-y-1.5">
                  <label className="font-mono text-[10px] text-neutral-400 uppercase tracking-wider block">
                    Choose Note Color:
                  </label>
                  <div className="flex items-center gap-2 overflow-x-auto pb-1">
                    {NOTE_COLOR_THEMES.map((theme) => {
                      const isSelected = selectedColor === theme.id;
                      return (
                        <button
                          key={theme.id}
                          type="button"
                          onClick={() => setSelectedColor(theme.id)}
                          className={`relative flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs transition cursor-pointer shrink-0 ${theme.swatchClass} ${
                            isSelected ? 'ring-2 ring-white ring-offset-2 ring-offset-[#0c0d14] scale-105 font-bold shadow-md' : 'opacity-80 hover:opacity-100'
                          }`}
                        >
                          {isSelected && <Check className="w-3 h-3" />}
                          <span>{theme.label}</span>
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* 3. Add Song Feature (Instagram style) */}
                <div className="space-y-2">
                  <label className="font-mono text-[10px] text-neutral-400 uppercase tracking-wider block">
                    Attach Music / Song:
                  </label>

                  {selectedSong ? (
                    <div className="flex items-center justify-between p-2.5 rounded-2xl bg-white/[0.05] border border-white/15">
                      <div 
                        onClick={() => toggleAudioPlay(selectedSong)}
                        className="flex items-center gap-2.5 min-w-0 flex-1 cursor-pointer"
                      >
                        <div className="w-8 h-8 rounded-xl bg-amber-400/20 text-amber-300 flex items-center justify-center shrink-0">
                          {playingSongId === (selectedSong.id || selectedSong.title) ? (
                            <Pause className="w-4 h-4 text-amber-300" />
                          ) : (
                            <Play className="w-4 h-4 text-amber-300 fill-amber-300" />
                          )}
                        </div>
                        <div className="min-w-0">
                          <p className="font-sans font-semibold text-xs text-white truncate">
                            {selectedSong.title}
                          </p>
                          <p className="font-mono text-[10px] text-neutral-400 truncate">
                            {selectedSong.artist}
                          </p>
                        </div>
                      </div>

                      <div className="flex items-center gap-1 shrink-0 ml-2">
                        <button
                          type="button"
                          onClick={() => setIsSongPickerOpen(true)}
                          className="px-2 py-1 rounded-lg bg-white/10 hover:bg-white/20 text-[10px] font-mono text-white transition"
                        >
                          Change
                        </button>
                        <button
                          type="button"
                          onClick={() => {
                            if (playingSongId === (selectedSong.id || selectedSong.title)) {
                              audioPlayerRef.current?.pause();
                              setPlayingSongId(null);
                            }
                            setSelectedSong(null);
                          }}
                          className="p-1 rounded-lg hover:bg-white/10 text-neutral-400 hover:text-white transition"
                        >
                          <X className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>
                  ) : (
                    <button
                      type="button"
                      onClick={() => setIsSongPickerOpen(true)}
                      className="w-full py-2.5 px-3 rounded-2xl bg-white/[0.04] hover:bg-white/[0.08] border border-dashed border-white/20 text-neutral-300 hover:text-white flex items-center justify-center gap-2 text-xs transition cursor-pointer"
                    >
                      <Music className="w-4 h-4 text-amber-400" />
                      <span>Select a Song (SugarCrash, Na Ho Tum...)</span>
                    </button>
                  )}
                </div>

                {/* 4. Mood & Signal */}
                <div className="space-y-1.5">
                  <label className="font-mono text-[10px] text-neutral-400 uppercase tracking-wider block">
                    Pick Mood / Signal:
                  </label>
                  <div className="flex items-center gap-1.5 overflow-x-auto pb-1">
                    {MOOD_EMOJIS.map((emoji) => (
                      <button
                        key={emoji}
                        type="button"
                        onClick={() => setSelectedMood(emoji)}
                        className={`p-2 rounded-xl text-base transition ${
                          selectedMood === emoji 
                            ? 'bg-white/20 border border-white/40 scale-110 shadow-sm' 
                            : 'bg-white/[0.03] hover:bg-white/[0.08]'
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
                        className={`px-2.5 py-1 rounded-xl font-mono text-[10px] transition ${
                          selectedLocation === loc
                            ? 'bg-amber-400/25 border border-amber-400 text-amber-200'
                            : 'bg-white/[0.03] text-neutral-400 hover:bg-white/[0.06]'
                        }`}
                      >
                        {loc}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Action Row */}
                <div className="flex items-center justify-between pt-2">
                  {myNote && (
                    <button
                      type="button"
                      onClick={() => {
                        deleteZenNote(myNote.id);
                        setIsComposerOpen(false);
                      }}
                      className="px-3 py-2 rounded-xl bg-red-500/15 border border-red-500/30 text-red-300 text-xs font-mono flex items-center gap-1 hover:bg-red-500/25 transition"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                      <span>Delete</span>
                    </button>
                  )}

                  <button
                    type="submit"
                    disabled={!noteText.trim() && !selectedSong}
                    className="ml-auto px-6 py-2.5 rounded-2xl bg-gradient-to-r from-amber-400 via-rose-500 to-purple-600 hover:opacity-90 disabled:opacity-30 text-white font-semibold text-xs shadow-lg transition cursor-pointer"
                  >
                    Share Note
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* ══════════════════════════════════════════════════════════════
          MODAL 2: SONG PICKER MODAL (Instagram Style, z-[110])
          ══════════════════════════════════════════════════════════════ */}
      <AnimatePresence>
        {isSongPickerOpen && (
          <div className="fixed inset-0 z-[110] flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsSongPickerOpen(false)}
              className="absolute inset-0 bg-black/90 backdrop-blur-xl"
            />

            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="relative w-full max-w-sm rounded-[2.5rem] bg-[#0c0d14] border border-white/15 p-5 shadow-2xl space-y-4 text-white z-10"
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
                  className="p-1 rounded-lg bg-white/[0.06] text-neutral-400 hover:text-white"
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
                  className="w-full pl-9 pr-3 py-2 rounded-xl bg-white/[0.05] border border-white/10 text-xs text-white placeholder-neutral-500 focus:outline-none focus:border-amber-400/50"
                  autoFocus
                />
              </div>

              {/* Track List */}
              <div className="max-h-60 overflow-y-auto space-y-1 scrollbar-none pr-1">
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
      </AnimatePresence>

      {/* ══════════════════════════════════════════════════════════════
          MODAL 3: INSPECT OTHER DELEGATE'S NOTE (z-[100])
          ══════════════════════════════════════════════════════════════ */}
      <AnimatePresence>
        {activeNoteInspect && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setActiveNoteInspect(null)}
              className="absolute inset-0 bg-black/90 backdrop-blur-xl"
            />

            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="relative w-full max-w-xs rounded-[2.5rem] bg-[#0c0d14] border border-white/15 p-6 shadow-2xl space-y-4 text-center z-10"
            >
              <div className="flex justify-end">
                <button
                  onClick={() => setActiveNoteInspect(null)}
                  className="p-1 rounded-lg bg-white/[0.04] text-neutral-400 hover:text-white"
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
      </AnimatePresence>
    </div>
  );
}

