'use client';

import React, { useState, useRef } from 'react';
import { 
  X, 
  Sparkles, 
  Image as ImageIcon, 
  Link as LinkIcon, 
  Type, 
  Palette, 
  Check, 
  Send, 
  Radio, 
  Upload, 
  Wand2,
  Sticker,
  Layers,
  Music,
  Maximize2,
  Smile,
  Camera,
  Zap,
  Flame,
  ShieldAlert
} from 'lucide-react';
import { useZenPulse } from '@/context/ZenPulsePlatformContext';
import { MediaStudioModal } from '@/components/creator/MediaStudioModal';
import { MusicPickerModal } from './MusicPickerModal';
import { STORY_FONTS, STORY_GRADIENTS, STORY_STICKERS, getStoryFontStyle } from '@/lib/storyFonts';
import { motion, AnimatePresence } from 'framer-motion';

interface StoryComposerModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const ZEN_SNAP_FILTERS = [
  { id: 'none', name: 'Raw Snap', css: 'none', badge: 'RAW' },
  { id: 'vintage_cam', name: 'Retro 35mm', css: 'sepia(30%) contrast(120%) saturate(115%)', badge: '35MM' },
  { id: 'cyber_gold', name: 'Solar Flare', css: 'hue-rotate(20deg) contrast(125%) saturate(130%)', badge: 'SOLAR' },
  { id: 'monochrome', name: 'Sovereign Noir', css: 'grayscale(100%) contrast(140%)', badge: 'NOIR' },
  { id: 'ultra_punch', name: 'Hyper Vivid', css: 'saturate(160%) contrast(120%)', badge: 'HYPER' },
];

export function StoryComposerModal({ isOpen, onClose }: StoryComposerModalProps) {
  const { createStory, currentUserName, currentUserUsername } = useZenPulse();

  const [title, setTitle] = useState('');
  const [customImageUrl, setCustomImageUrl] = useState('');
  const [selectedFontId, setSelectedFontId] = useState('clash');
  const [selectedGradientId, setSelectedGradientId] = useState('nebula');
  const [highlightMode, setHighlightMode] = useState<'none' | 'box' | 'neon' | 'inverted'>('box');
  const [selectedStickers, setSelectedStickers] = useState<string[]>([]);
  const [attachedSong, setAttachedSong] = useState<{ title: string; artist: string; audioUrl: string } | null>(null);
  const [isMusicPickerOpen, setIsMusicPickerOpen] = useState(false);
  const [linkUrl, setLinkUrl] = useState('');
  const [linkText, setLinkText] = useState('');
  const [isStudioOpen, setIsStudioOpen] = useState(false);
  const [showStickerDrawer, setShowStickerDrawer] = useState(false);

  /* ZEN.GLIMPSE SNAP BRANDING */
  const [isSnapMode, setIsSnapMode] = useState(true);
  const [selectedSnapFilter, setSelectedSnapFilter] = useState('vintage_cam');
  const [snapLocation, setSnapLocation] = useState('GENESIS ASSEMBLY // UDAIPUR');

  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (loadEvt) => {
        if (loadEvt.target?.result) {
          setCustomImageUrl(loadEvt.target.result as string);
        }
      };
      reader.readAsDataURL(file);
    }
  };

  if (!isOpen) return null;

  const activeImageUrl = customImageUrl.trim();
  const currentGradient = STORY_GRADIENTS.find((g) => g.id === selectedGradientId) || STORY_GRADIENTS[0];
  const activeFontStyle = getStoryFontStyle(selectedFontId);

  const toggleSticker = (sticker: string) => {
    if (selectedStickers.includes(sticker)) {
      setSelectedStickers(selectedStickers.filter((s) => s !== sticker));
    } else {
      if (selectedStickers.length < 3) {
        setSelectedStickers([...selectedStickers, sticker]);
      }
    }
  };

  const handlePublish = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() && !activeImageUrl) return;

    createStory({
      title: title.trim() || (isSnapMode ? 'Snap Wire' : 'Visual Dispatch'),
      image: activeImageUrl || undefined,
      linkUrl: linkUrl.trim() || undefined,
      linkText: linkText.trim() || undefined,
      color: currentGradient.gradientClass,
      fontStyle: selectedFontId,
      effectStyle: highlightMode,
      textHighlight: highlightMode !== 'none',
      stickers: selectedStickers,
      audioTitle: attachedSong ? `${attachedSong.title} - ${attachedSong.artist}` : 'Sovereign Frequency 432Hz',
      songTitle: attachedSong?.title,
      songArtist: attachedSong?.artist,
      songAudioUrl: attachedSong?.audioUrl,
      isSnap: isSnapMode,
      snapFilter: isSnapMode ? selectedSnapFilter : undefined,
      snapLocation: isSnapMode ? snapLocation : undefined,
    });

    onClose();
  };

  const cycleHighlightMode = () => {
    const modes: ('none' | 'box' | 'neon' | 'inverted')[] = ['none', 'box', 'neon', 'inverted'];
    const nextIdx = (modes.indexOf(highlightMode) + 1) % modes.length;
    setHighlightMode(modes[nextIdx]);
  };

  return (
    <div className="fixed inset-0 overflow-y-auto bg-black/90 backdrop-blur-2xl z-50 flex flex-col justify-center items-center p-3 sm:p-6 select-none animate-in fade-in duration-200">
      <div 
        className="w-full max-w-4xl h-[92vh] max-h-[760px] min-h-[580px] bg-[#090a0f] border border-white/15 rounded-3xl shadow-[0_25px_80px_rgba(0,0,0,0.98)] flex flex-col overflow-hidden text-white my-auto"
        onClick={(e) => e.stopPropagation()}
      >
        {/* ── TOP HEADER ── */}
        <div className="h-14 px-6 border-b border-white/10 flex items-center justify-between bg-black/60 backdrop-blur-md shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-amber-400 via-rose-500 to-fuchsia-600 p-[1.5px]">
              <div className="w-full h-full rounded-[10px] bg-black flex items-center justify-center">
                <Camera className="w-4 h-4 text-amber-400" />
              </div>
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 
                  className="font-bold text-sm text-white uppercase tracking-wider font-sans"
                >
                  ZEN.GLIMPSE // SNAP STUDIO
                </h3>
                <span className="px-2 py-0.2 rounded-full bg-amber-500/20 text-amber-300 text-[9px] font-mono font-bold border border-amber-500/40">
                  SNAP MODE
                </span>
              </div>
              <p className="text-[10px] text-zinc-400 font-mono">24-Hour Ephemeral Visual Snaps with Sovereign Watermark</p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 rounded-xl text-zinc-400 hover:text-white hover:bg-white/10 transition cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* ── MAIN 2-COLUMN STUDIO (Desktop Grid) ── */}
        <div className="grid grid-cols-1 md:grid-cols-12 flex-1 min-h-0 overflow-y-auto md:overflow-hidden h-[calc(100%-3.5rem)]">
          
          {/* ── LEFT: 9:16 LIVE INTERACTIVE STORY CANVAS (5 cols) ── */}
          <div className="md:col-span-5 bg-black/90 border-b md:border-b-0 md:border-r border-white/10 flex items-center justify-center p-4 sm:p-6 relative overflow-hidden h-full">
            <div className="relative w-[270px] sm:w-[280px] h-[480px] sm:h-[500px] rounded-[32px] overflow-hidden bg-black border-2 border-white/20 shadow-[0_20px_60px_rgba(0,0,0,0.9)] flex flex-col justify-between p-4 group shrink-0">
              
              {/* Story Background Layer */}
              {activeImageUrl ? (
                <img 
                  src={activeImageUrl} 
                  alt="Story" 
                  className="absolute inset-0 w-full h-full object-cover transition-all duration-300"
                  style={{
                    filter: isSnapMode ? ZEN_SNAP_FILTERS.find((f) => f.id === selectedSnapFilter)?.css : 'none'
                  }}
                />
              ) : (
                <div className={`absolute inset-0 bg-gradient-to-br ${currentGradient.gradientClass} transition-all duration-500`} />
              )}
              <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-transparent to-black/80 pointer-events-none" />

              {/* SNAP OFFICIAL BRANDING WATERMARK OVERLAY */}
              {isSnapMode && (
                <div className="absolute inset-0 p-3 pointer-events-none z-15 flex flex-col justify-between">
                  {/* Camera Viewfinder Crosshairs */}
                  <div className="flex justify-between items-start">
                    <div className="w-4 h-4 border-t-2 border-l-2 border-amber-400/80 rounded-tl-sm" />
                    <div className="flex items-center gap-1 bg-black/60 backdrop-blur-md px-2 py-0.5 rounded-full border border-amber-400/30">
                      <span className="w-1.5 h-1.5 rounded-full bg-rose-500 animate-pulse" />
                      <span className="text-[9px] font-mono font-bold text-amber-300 tracking-wider">ZEN.SNAP</span>
                    </div>
                    <div className="w-4 h-4 border-t-2 border-r-2 border-amber-400/80 rounded-tr-sm" />
                  </div>

                  {/* Center Viewfinder Target */}
                  <div className="my-auto mx-auto w-8 h-8 border border-white/20 rounded-full flex items-center justify-center opacity-40">
                    <div className="w-1.5 h-1.5 bg-amber-400 rounded-full" />
                  </div>

                  {/* Bottom Official Brand Geotag & Time */}
                  <div className="space-y-1">
                    <div className="flex justify-between items-end">
                      <div className="w-4 h-4 border-b-2 border-l-2 border-amber-400/80 rounded-bl-sm" />
                      <div className="text-right">
                        <span className="text-[8px] font-mono text-white/90 bg-black/70 px-2 py-0.5 rounded-md border border-white/20 block font-bold tracking-widest uppercase">
                          {snapLocation}
                        </span>
                        <span className="text-[7px] font-mono text-amber-300 block mt-0.5">
                          ZENVITRA CIPHER // {new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                        </span>
                      </div>
                      <div className="w-4 h-4 border-b-2 border-r-2 border-amber-400/80 rounded-br-sm" />
                    </div>
                  </div>
                </div>
              )}

              {/* Progress Bar & Author Header */}
              <div className="relative z-20 space-y-2">
                <div className="h-1 w-full bg-white/30 rounded-full overflow-hidden backdrop-blur-sm">
                  <div className="h-full bg-white w-2/3 shadow-[0_0_8px_rgba(255,255,255,0.8)]" />
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className="w-6 h-6 rounded-full bg-gradient-to-tr from-amber-400 to-rose-500 p-[1px]">
                      <div className="w-full h-full rounded-full bg-black flex items-center justify-center text-[9px] font-bold text-white uppercase">
                        {(currentUserName || 'U')[0]?.toUpperCase() || 'U'}
                      </div>
                    </div>
                    <span className="text-[11px] font-bold text-white tracking-tight">Your story</span>
                    <span className="text-[10px] text-zinc-400 font-mono">Just now</span>
                  </div>

                  {/* Highlight Style Toggle Button (Instagram 'A' style) */}
                  <button
                    type="button"
                    onClick={cycleHighlightMode}
                    className="px-2 py-0.5 rounded-lg bg-white/20 hover:bg-white/30 text-[10px] font-mono font-bold text-white border border-white/30 backdrop-blur-md transition cursor-pointer"
                    title="Change Text Highlight Effect"
                  >
                    A ({highlightMode.toUpperCase()})
                  </button>
                </div>
              </div>

              {/* Story Text / Headline Area */}
              <div className="relative z-20 flex-1 flex flex-col items-center justify-center text-center p-2">
                <p 
                  className={`text-xl transition-all duration-300 leading-snug break-words max-w-full ${
                    highlightMode === 'box'
                      ? 'bg-black/70 px-3.5 py-1.5 rounded-2xl backdrop-blur-md border border-white/15 text-white shadow-xl'
                      : highlightMode === 'neon'
                      ? 'text-white drop-shadow-[0_0_20px_rgba(56,189,248,0.9)]'
                      : highlightMode === 'inverted'
                      ? 'bg-white text-black px-3.5 py-1.5 rounded-2xl font-black shadow-xl'
                      : 'text-white drop-shadow-[0_2px_10px_rgba(0,0,0,0.9)]'
                  }`}
                  style={activeFontStyle}
                >
                  {title || 'Tap to type your story message...'}
                </p>

                {/* Attached Interactive Stickers */}
                {selectedStickers.length > 0 && (
                  <div className="flex flex-wrap gap-1.5 justify-center mt-3">
                    {selectedStickers.map((stk) => (
                      <motion.span
                        key={stk}
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        className="px-2.5 py-1 rounded-full bg-white/20 backdrop-blur-md border border-white/30 text-white font-mono text-[10px] font-bold shadow-lg"
                      >
                        {stk}
                      </motion.span>
                    ))}
                  </div>
                )}

                {/* Attached Song Vinyl Pill */}
                {attachedSong && (
                  <motion.div
                    initial={{ scale: 0, y: 8 }}
                    animate={{ scale: 1, y: 0 }}
                    className="px-3 py-1 rounded-full bg-black/75 backdrop-blur-md border border-white/25 text-white font-mono text-[10px] font-bold shadow-xl flex items-center gap-1.5 mt-2"
                  >
                    <Music className="w-3 h-3 text-rose-400 animate-spin" style={{ animationDuration: '4s' }} />
                    <span className="truncate max-w-[170px]">{attachedSong.title}</span>
                  </motion.div>
                )}
              </div>

              {/* Bottom Attached Link Button */}
              {linkUrl && (
                <div className="relative z-20 pt-2">
                  <div className="px-3 py-1.5 rounded-full bg-white text-black text-[10px] font-bold text-center shadow-2xl flex items-center justify-center gap-1.5">
                    <LinkIcon className="w-3 h-3 text-blue-600" />
                    <span>{linkText || 'Visit Link'}</span>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* ── RIGHT: CONTROLS & 10-FONT SELECTOR (7 cols) ── */}
          <div className="md:col-span-7 p-5 sm:p-6 flex flex-col justify-between overflow-y-auto space-y-5 bg-[#0b0c12] h-full">
            
            <form onSubmit={handlePublish} className="space-y-5">
              
              {/* ── SNAP MODE TOGGLE & WATERMARK BAR ── */}
              <div className="p-3.5 rounded-2xl bg-amber-500/10 border border-amber-500/30 flex items-center justify-between">
                <div className="flex items-center gap-2.5">
                  <div className="w-8 h-8 rounded-xl bg-amber-400 text-black flex items-center justify-center font-bold">
                    <Camera className="w-4 h-4" />
                  </div>
                  <div>
                    <span className="text-xs font-bold text-white font-mono flex items-center gap-1.5">
                      <span>ZEN.SNAP Official Watermark</span>
                      <span className="px-1.5 py-0.2 rounded bg-amber-400/20 text-amber-300 text-[8px]">BRANDED</span>
                    </span>
                    <p className="text-[10px] text-zinc-400 font-mono">Burns cryptographic location, time &amp; Zenvitra seal onto snap</p>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={() => setIsSnapMode(!isSnapMode)}
                  className={`px-3 py-1.5 rounded-xl font-mono text-xs font-bold transition cursor-pointer ${
                    isSnapMode 
                      ? 'bg-amber-400 text-black shadow-md' 
                      : 'bg-white/10 text-neutral-400 hover:text-white'
                  }`}
                >
                  {isSnapMode ? 'Snap On' : 'Standard'}
                </button>
              </div>

              {/* Snap Filters & Geotag options if Snap Mode is active */}
              {isSnapMode && (
                <div className="space-y-3 p-3.5 rounded-2xl bg-white/[0.02] border border-white/10">
                  <div className="space-y-1.5">
                    <div className="flex items-center justify-between text-xs font-mono">
                      <span className="text-neutral-400 flex items-center gap-1">
                        <Camera className="w-3.5 h-3.5 text-amber-400" />
                        <span>Snap Shaders:</span>
                      </span>
                      <span className="text-amber-300 font-bold">
                        {ZEN_SNAP_FILTERS.find((f) => f.id === selectedSnapFilter)?.name}
                      </span>
                    </div>

                    <div className="grid grid-cols-5 gap-1.5">
                      {ZEN_SNAP_FILTERS.map((filter) => (
                        <button
                          key={filter.id}
                          type="button"
                          onClick={() => setSelectedSnapFilter(filter.id)}
                          className={`py-1.5 px-2 rounded-xl text-center border font-mono transition cursor-pointer ${
                            selectedSnapFilter === filter.id
                              ? 'bg-amber-400 text-black border-amber-300 font-bold'
                              : 'bg-white/5 border-white/10 text-neutral-400 hover:text-white'
                          }`}
                        >
                          <span className="text-[10px] block font-bold">{filter.badge}</span>
                        </button>
                      ))}
                    </div>
                  </div>

                  <div className="space-y-1">
                    <label className="text-[10px] font-mono text-neutral-400 uppercase block">
                      Sovereign Geotag / Committee Venue
                    </label>
                    <input
                      type="text"
                      value={snapLocation}
                      onChange={(e) => setSnapLocation(e.target.value)}
                      placeholder="e.g. CONSTITUENT ASSEMBLY // UDAIPUR"
                      className="w-full bg-white/[0.04] border border-white/10 rounded-xl px-3 py-1.5 text-xs text-white placeholder-zinc-500 focus:outline-none focus:border-amber-400 font-mono"
                    />
                  </div>
                </div>
              )}

              {/* Text Input */}
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-zinc-300 uppercase tracking-wider font-mono">
                  Snap Caption / Delegation Note
                </label>
                <textarea
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="What is happening right now in your delegation or project?"
                  rows={2}
                  className="w-full bg-white/[0.04] border border-white/10 rounded-2xl p-3 text-xs text-white placeholder-zinc-500 focus:outline-none focus:border-cyan-400 resize-none font-sans leading-relaxed"
                />
              </div>

              {/* ── 10 DIFFERENT GOATED FONTS SELECTOR CAROUSEL ── */}
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-zinc-300 uppercase tracking-wider font-mono flex items-center gap-1.5">
                    <Type className="w-3.5 h-3.5 text-cyan-400" />
                    <span>10 Typography Styles</span>
                  </span>
                  <span className="text-[10px] text-cyan-400 font-mono font-semibold">
                    {STORY_FONTS.find((f) => f.id === selectedFontId)?.name}
                  </span>
                </div>

                <div className="grid grid-cols-5 gap-2 select-none">
                  {STORY_FONTS.map((font) => {
                    const isSelected = selectedFontId === font.id;
                    return (
                      <button
                        key={font.id}
                        type="button"
                        onClick={() => setSelectedFontId(font.id)}
                        className={`h-12 rounded-xl flex flex-col items-center justify-center p-1 transition-all duration-200 cursor-pointer border ${
                          isSelected
                            ? 'bg-white text-black border-white shadow-[0_0_15px_rgba(255,255,255,0.4)] scale-105'
                            : 'bg-white/[0.04] text-zinc-400 hover:text-white hover:bg-white/[0.08] border-white/10'
                        }`}
                        title={font.name}
                      >
                        <span 
                          className="text-xs truncate max-w-full"
                          style={{
                            fontFamily: font.fontFamily,
                            fontWeight: font.fontWeight || 600,
                            fontStyle: font.fontStyle || 'normal',
                          }}
                        >
                          {font.sample}
                        </span>
                        <span className="text-[8px] font-mono opacity-60 truncate max-w-full">
                          {font.category}
                        </span>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* ── BACKGROUND GRADIENT PALETTE PICKER ── */}
              <div className="space-y-2">
                <span className="text-xs font-bold text-zinc-300 uppercase tracking-wider font-mono flex items-center gap-1.5">
                  <Palette className="w-3.5 h-3.5 text-purple-400" />
                  <span>Color &amp; Nebula Atmosphere</span>
                </span>

                <div className="flex items-center gap-2">
                  {STORY_GRADIENTS.map((g) => (
                    <button
                      key={g.id}
                      type="button"
                      onClick={() => {
                        setSelectedGradientId(g.id);
                        setCustomImageUrl('');
                      }}
                      className={`w-8 h-8 rounded-full transition-all duration-200 cursor-pointer p-0.5 border ${
                        selectedGradientId === g.id && !customImageUrl
                          ? 'border-white scale-110 shadow-lg'
                          : 'border-transparent hover:scale-105'
                      }`}
                      title={g.name}
                    >
                      <div 
                        className="w-full h-full rounded-full"
                        style={{ backgroundColor: g.previewColor }}
                      />
                    </button>
                  ))}

                  <button
                    type="button"
                    onClick={() => fileInputRef.current?.click()}
                    className="ml-auto px-3 py-1.5 rounded-xl bg-white/[0.06] hover:bg-white/[0.12] border border-white/15 text-xs font-bold text-white transition flex items-center gap-1.5 cursor-pointer"
                  >
                    <Upload className="w-3.5 h-3.5 text-cyan-400" />
                    <span>Upload Photo</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setIsStudioOpen(true)}
                    className="px-3 py-1.5 rounded-xl bg-purple-500/20 hover:bg-purple-500/30 border border-purple-500/40 text-xs font-bold text-purple-300 transition flex items-center gap-1.5 cursor-pointer"
                  >
                    <Wand2 className="w-3.5 h-3.5" />
                    <span>FX Studio</span>
                  </button>
                </div>

                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={handleFileUpload}
                />
              </div>

              {/* ── STICKERS & INTERACTIVE BADGES ── */}
              <div className="space-y-2">
                <span className="text-xs font-bold text-zinc-300 uppercase tracking-wider font-mono flex items-center gap-1.5">
                  <Smile className="w-3.5 h-3.5 text-amber-400" />
                  <span>Attach Sovereign Stickers</span>
                </span>

                <div className="flex flex-wrap gap-1.5">
                  {STORY_STICKERS.map((stk) => {
                    const isAttached = selectedStickers.includes(stk);
                    return (
                      <button
                        key={stk}
                        type="button"
                        onClick={() => toggleSticker(stk)}
                        className={`px-2.5 py-1 rounded-xl text-xs font-mono font-medium transition cursor-pointer border ${
                          isAttached
                            ? 'bg-amber-500/20 text-amber-300 border-amber-500/50 shadow-md'
                            : 'bg-white/[0.04] text-zinc-400 hover:text-white border-white/10'
                        }`}
                      >
                        {stk} {isAttached && '✓'}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* ── MUSIC & SOUNDTRACK ATTACHMENT ── */}
              <div className="p-3.5 rounded-2xl bg-white/[0.02] border border-white/10 flex items-center justify-between">
                <div className="flex items-center gap-2.5 overflow-hidden">
                  <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-amber-400/20 via-rose-500/20 to-purple-600/20 border border-rose-500/30 flex items-center justify-center text-rose-400 shrink-0">
                    <Music className="w-4 h-4" />
                  </div>
                  <div className="overflow-hidden">
                    <p className="text-xs font-bold text-white font-mono truncate">
                      {attachedSong ? attachedSong.title : 'Soundtrack & Song'}
                    </p>
                    <p className="text-[10px] text-zinc-400 font-mono truncate">
                      {attachedSong ? attachedSong.artist : 'Attach background audio track'}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-1.5 shrink-0">
                  {attachedSong && (
                    <button
                      type="button"
                      onClick={() => setAttachedSong(null)}
                      className="px-2.5 py-1.5 rounded-xl bg-rose-500/10 hover:bg-rose-500/20 text-rose-300 text-[10px] font-mono font-bold transition cursor-pointer"
                    >
                      Remove
                    </button>
                  )}
                  <button
                    type="button"
                    onClick={() => setIsMusicPickerOpen(true)}
                    className="px-3.5 py-1.5 rounded-xl bg-white hover:bg-zinc-200 text-black text-xs font-mono font-bold transition cursor-pointer shadow flex items-center gap-1.5"
                  >
                    <Music className="w-3.5 h-3.5" />
                    <span>{attachedSong ? 'Change Track' : 'Add Song'}</span>
                  </button>
                </div>
              </div>

              {/* ── LINK STICKER ATTACHMENT ── */}
              <div className="p-3.5 rounded-2xl bg-white/[0.02] border border-white/10 space-y-2">
                <div className="flex items-center gap-1.5 text-xs font-bold text-cyan-400 font-mono">
                  <LinkIcon className="w-3.5 h-3.5" />
                  <span>Action Link / Registration</span>
                </div>
                <div className="grid grid-cols-2 gap-2">
                  <input
                    type="url"
                    value={linkUrl}
                    onChange={(e) => setLinkUrl(e.target.value)}
                    placeholder="https://... (URL)"
                    className="bg-white/[0.04] border border-white/10 rounded-xl px-3 py-1.5 text-xs text-white placeholder:text-zinc-600 focus:outline-none font-mono"
                  />
                  <input
                    type="text"
                    value={linkText}
                    onChange={(e) => setLinkText(e.target.value)}
                    placeholder="Button label (e.g. RSVP)"
                    className="bg-white/[0.04] border border-white/10 rounded-xl px-3 py-1.5 text-xs text-white placeholder:text-zinc-600 focus:outline-none font-mono"
                  />
                </div>
              </div>

              {/* Submit Broadcast Button */}
              <button
                type="submit"
                disabled={!title.trim() && !activeImageUrl}
                className="w-full py-3.5 rounded-2xl bg-gradient-to-r from-amber-400 via-rose-500 to-fuchsia-600 hover:opacity-95 disabled:opacity-30 text-black font-bold text-xs uppercase tracking-widest transition shadow-[0_0_25px_rgba(244,63,94,0.4)] cursor-pointer"
                style={{ fontFamily: 'Clash Display, var(--font-space), sans-serif' }}
              >
                Broadcast 24h Relay
              </button>
            </form>
          </div>
        </div>

        {/* ─── CREATOR FX STUDIO MODAL ─── */}
        <MediaStudioModal
          isOpen={isStudioOpen}
          onClose={() => setIsStudioOpen(false)}
          initialImage={activeImageUrl || ''}
          onApply={(processedUrl) => {
            setCustomImageUrl(processedUrl);
          }}
          aspectRatio="9:16"
        />

        {/* ─── MUSIC TRACK PICKER MODAL ─── */}
        <MusicPickerModal
          isOpen={isMusicPickerOpen}
          onClose={() => setIsMusicPickerOpen(false)}
          onSelectTrack={(t) => setAttachedSong(t)}
          selectedTrackTitle={attachedSong?.title}
        />
      </div>
    </div>
  );
}
