'use client';

import React, { useState, useEffect, useMemo, useRef } from 'react';
import { 
  ArrowLeft, 
  Video, 
  Music, 
  Hash, 
  Sparkles, 
  Lock, 
  Globe2, 
  Check, 
  ShieldCheck, 
  ShieldAlert, 
  Play, 
  Volume2, 
  AlertTriangle,
  Upload,
  Palette,
  Type,
  Wand2,
  Sliders,
  Search
} from 'lucide-react';
import { useZenPulse } from '@/context/ZenPulsePlatformContext';
import { auditFluxDispatch, IntegrityCheckResult } from '@/lib/fluxIntegrityGuard';
import { FONT_OPTIONS, TEXT_EFFECTS, FILTER_PRESETS } from '@/components/creator/MediaStudioModal';
import { STORY_FONTS, getStoryFontStyle } from '@/lib/storyFonts';
import { MusicPickerModal } from './MusicPickerModal';

const FLUX_AUDIO_TRACKS = [
  '⚡ Ambient Synthwaves (120 BPM)',
  '🏛️ Geneva Assembly Live Audio',
  '🌱 Deep Focus Acoustic Chamber',
  '🔥 Sovereign Bass Drop Matrix',
  '✨ Lo-Fi Youth Summit Chill'
];

export function FluxComposer({ onFinished, onClose }: { onFinished?: () => void; onClose?: () => void }) {
  const { createFlux, setActiveView, currentUserName, currentUserUsername } = useZenPulse();

  const [videoUrl, setVideoUrl] = useState('');
  const [caption, setCaption] = useState('');
  const [sourceName, setSourceName] = useState('');
  const [sourceUrl, setSourceUrl] = useState('');
  const [musicTitle, setMusicTitle] = useState(FLUX_AUDIO_TRACKS[0]);
  const [showMusicPicker, setShowMusicPicker] = useState(false);
  const [tagsInput, setTagsInput] = useState('');
  const [isPrivate, setIsPrivate] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  // Creator FX Studio overlay states for reel
  const [reelFilter, setReelFilter] = useState('normal');
  const [reelOverlayText, setReelOverlayText] = useState('ZEN.FLUX // 2026');
  const [reelFont, setReelFont] = useState('clash');
  const [reelEffect, setReelEffect] = useState('neon');
  const [showFxDrawer, setShowFxDrawer] = useState(false);

  const videoFileInputRef = useRef<HTMLInputElement>(null);

  const handleVideoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const url = URL.createObjectURL(file);
      setVideoUrl(url);
    }
  };

  // Live real-time integrity check
  const auditResult: IntegrityCheckResult = useMemo(() => {
    if (!caption.trim() && !sourceName.trim() && !sourceUrl.trim()) {
      return { passed: true, score: 100, status: 'VERIFIED', reasons: [], auditedAt: '' };
    }
    return auditFluxDispatch({
      caption,
      sourceName,
      sourceUrl,
      tags: tagsInput.split(',').map((t) => t.trim()).filter(Boolean)
    });
  }, [caption, sourceName, sourceUrl, tagsInput]);

  const hasEnteredData = Boolean(videoUrl.trim() && caption.trim() && sourceName.trim() && sourceUrl.trim());
  const isFormValid = hasEnteredData && auditResult.passed;

  const handleClose = () => {
    if (onClose) {
      onClose();
    } else if (onFinished) {
      onFinished();
    } else {
      setActiveView('flux');
    }
  };

  // Close on Escape key
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') handleClose();
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  const handlePublish = (e: React.FormEvent) => {
    e.preventDefault();
    if (!caption.trim() || !videoUrl.trim()) return;
    
    if (!auditResult.passed) {
      setErrorMessage(auditResult.reasons[0] || 'Content violates Zenvitra Civic & Fact-Checking standards.');
      return;
    }
    setErrorMessage(null);

    const tags = tagsInput
      .split(',')
      .map((t: string) => t.trim().replace(/^#/, ''))
      .filter(Boolean);

    try {
      createFlux({
        caption: caption.trim(),
        videoUrl: videoUrl.trim(),
        sourceName: sourceName.trim(),
        sourceUrl: sourceUrl.trim(),
        musicTitle: musicTitle.trim() || 'Original Audio',
        tags: tags.length > 0 ? tags : ['FLUX', 'YouthAction'],
        isPrivate,
        fontStyle: reelFont,
        effectStyle: reelEffect,
      });
      handleClose();
    } catch (err: any) {
      setErrorMessage(err.message || 'Dispatch rejected by Integrity Guard.');
    }
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/85 backdrop-blur-md flex flex-col justify-start sm:justify-center items-center p-3 sm:p-6 select-none animate-in fade-in duration-200">
      {/* Container Dialog */}
      <div 
        className="w-full max-w-4xl my-auto max-h-[92vh] bg-[#0c0d12] border border-white/10 rounded-3xl shadow-2xl flex flex-col overflow-hidden text-white"
        onClick={(e) => e.stopPropagation()}
      >
        {/* ── TOP HEADER (Instagram Style) ── */}
        <div className="h-14 px-5 border-b border-white/10 flex items-center justify-between bg-black/40">
          <button
            type="button"
            onClick={handleClose}
            className="text-xs font-semibold text-zinc-400 hover:text-white transition flex items-center gap-1.5 cursor-pointer"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Cancel</span>
          </button>

          <div className="text-sm font-bold tracking-tight text-white flex items-center gap-2">
            <span>Create New FLUX</span>
            <Video className="w-3.5 h-3.5 text-pink-400" />
          </div>

          <button
            type="button"
            onClick={handlePublish}
            disabled={!isFormValid}
            className={`px-4 py-1.5 rounded-full text-xs font-bold transition-all shadow-sm cursor-pointer ${
              !auditResult.passed && hasEnteredData
                ? 'bg-rose-600/80 text-white cursor-not-allowed opacity-60'
                : 'bg-gradient-to-r from-violet-600 to-pink-600 hover:opacity-90 disabled:opacity-30 text-white'
            }`}
          >
            {!auditResult.passed && hasEnteredData ? 'Blocked' : 'Publish'}
          </button>
        </div>

        {/* Live Integrity Warning Banner */}
        {(!auditResult.passed && hasEnteredData) || errorMessage ? (
          <div className="px-5 py-3 bg-rose-500/15 border-b border-rose-500/30 text-rose-300 text-xs font-mono flex items-start justify-between gap-3 animate-in fade-in duration-200">
            <div className="flex items-start gap-2">
              <ShieldAlert className="w-4 h-4 text-rose-400 shrink-0 mt-0.5" />
              <div>
                <strong className="block text-rose-200 uppercase font-bold text-[11px]">
                  Integrity Guard Violation ({auditResult.violationType || 'REJECTED'}):
                </strong>
                <span>{errorMessage || auditResult.reasons[0]}</span>
              </div>
            </div>
            {errorMessage && (
              <button type="button" onClick={() => setErrorMessage(null)} className="text-rose-400 hover:text-white">✕</button>
            )}
          </div>
        ) : hasEnteredData && auditResult.passed ? (
          <div className="px-5 py-2 bg-emerald-500/10 border-b border-emerald-500/25 text-emerald-300 text-xs font-mono flex items-center gap-2">
            <ShieldCheck className="w-4 h-4 text-emerald-400" />
            <span>Integrity Verified: Sovereign Civic &amp; Fact-Check passed (Score: {auditResult.score}/100)</span>
          </div>
        ) : null}

        {/* ── MAIN BODY (2 Columns on Desktop) ── */}
        <div className="grid grid-cols-1 md:grid-cols-12 flex-1 min-h-0 overflow-y-auto md:overflow-hidden">
          
          {/* ── LEFT: 9:16 VIDEO PREVIEW & SOURCE (6 cols) ── */}
          <div className="md:col-span-6 bg-black/60 border-b md:border-b-0 md:border-r border-white/10 p-5 flex flex-col justify-between overflow-y-auto space-y-4">
            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-bold text-zinc-300 flex items-center gap-1.5">
                  <Video className="w-4 h-4 text-violet-400" />
                  1. Video Media Stream
                </span>
                <span className="text-[10px] font-mono text-zinc-500">9:16 Reel</span>
              </div>

              <div className="flex items-center gap-2 mb-2">
                <button
                  type="button"
                  onClick={() => videoFileInputRef.current?.click()}
                  className="px-3.5 py-2 rounded-xl bg-violet-600/30 hover:bg-violet-600/50 border border-violet-400/50 text-xs font-bold text-violet-200 transition flex items-center gap-2 cursor-pointer shadow-[0_0_15px_rgba(139,92,246,0.25)] shrink-0"
                >
                  <Upload className="w-3.5 h-3.5" />
                  <span>Upload Video (MP4)</span>
                </button>

                <input
                  type="url"
                  value={videoUrl}
                  onChange={(e) => setVideoUrl(e.target.value)}
                  placeholder="Or paste video URL..."
                  className="flex-1 bg-white/[0.04] border border-white/10 rounded-xl px-3 py-2 text-xs text-white placeholder-zinc-500 focus:outline-none focus:border-violet-500"
                />
              </div>

              <input
                ref={videoFileInputRef}
                type="file"
                accept="video/mp4,video/webm,video/quicktime"
                className="hidden"
                onChange={handleVideoUpload}
              />

              {/* Creator FX Studio Toggles for Video */}
              <div className="pt-3 border-t border-white/10 mt-3 space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-mono text-pink-300 flex items-center gap-1.5 font-bold">
                    <Wand2 className="w-3.5 h-3.5" />
                    <span>Reel Visual Filters &amp; Typography</span>
                  </span>
                  <button
                    type="button"
                    onClick={() => setShowFxDrawer(!showFxDrawer)}
                    className="text-[11px] font-mono text-cyan-400 hover:underline cursor-pointer"
                  >
                    {showFxDrawer ? 'Hide Controls' : 'Edit Effects'}
                  </button>
                </div>

                {showFxDrawer && (
                  <div className="p-3 rounded-2xl bg-black/60 border border-white/15 space-y-3 animate-in fade-in duration-150">
                    {/* Filter Presets for Video */}
                    <div className="space-y-1">
                      <span className="text-[10px] font-mono text-neutral-400 uppercase">Color LUT</span>
                      <div className="flex gap-1.5 overflow-x-auto pb-1 no-scrollbar">
                        {FILTER_PRESETS.slice(0, 6).map((f) => (
                          <button
                            key={f.id}
                            type="button"
                            onClick={() => setReelFilter(f.id)}
                            className={`px-2.5 py-1 rounded-lg text-[10px] font-mono whitespace-nowrap cursor-pointer transition ${
                              reelFilter === f.id
                                ? 'bg-pink-500/20 border border-pink-400 text-pink-200 font-bold'
                                : 'bg-white/5 border border-white/10 text-neutral-400 hover:text-white'
                            }`}
                          >
                            {f.name}
                          </button>
                        ))}
                      </div>
                    </div>

                    {/* Headline overlay on video */}
                    <div className="space-y-1">
                      <span className="text-[10px] font-mono text-neutral-400 uppercase">Headline Sticker</span>
                      <input
                        type="text"
                        value={reelOverlayText}
                        onChange={(e) => setReelOverlayText(e.target.value)}
                        placeholder="Type text overlay..."
                        className="w-full px-2.5 py-1.5 rounded-lg bg-white/5 border border-white/10 text-xs text-white placeholder:text-neutral-600 focus:outline-none"
                      />
                    </div>

                    {/* Font & Effect selector */}
                    <div className="grid grid-cols-2 gap-2">
                      <div className="space-y-1">
                        <span className="text-[10px] font-mono text-neutral-400">Font</span>
                        <select
                          value={reelFont}
                          onChange={(e) => setReelFont(e.target.value)}
                          className="w-full px-2 py-1 rounded-lg bg-black border border-white/10 text-xs text-white focus:outline-none"
                        >
                          {FONT_OPTIONS.map((f) => (
                            <option key={f.id} value={f.id}>{f.name}</option>
                          ))}
                        </select>
                      </div>

                      <div className="space-y-1">
                        <span className="text-[10px] font-mono text-neutral-400">Effect</span>
                        <select
                          value={reelEffect}
                          onChange={(e) => setReelEffect(e.target.value)}
                          className="w-full px-2 py-1 rounded-lg bg-black border border-white/10 text-xs text-white focus:outline-none"
                        >
                          {TEXT_EFFECTS.map((eff) => (
                            <option key={eff.id} value={eff.id}>{eff.name}</option>
                          ))}
                        </select>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Live 9:16 Stage Preview */}
            <div className="my-auto flex justify-center py-2">
              <div className="relative w-[210px] h-[340px] sm:w-[230px] sm:h-[370px] rounded-3xl overflow-hidden bg-black border border-white/20 shadow-2xl flex items-center justify-center">
                {videoUrl.trim() ? (
                  <video
                    src={videoUrl.trim()}
                    loop
                    autoPlay
                    muted
                    playsInline
                    style={{
                      filter: FILTER_PRESETS.find((f) => f.id === reelFilter)?.filterCss || 'none'
                    }}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="flex flex-col items-center justify-center p-6 text-center text-zinc-500 space-y-2">
                    <Video className="w-8 h-8 stroke-[1.5] text-zinc-600" />
                    <span className="text-xs">Upload MP4 to preview live vertical reel</span>
                  </div>
                )}
                <div className="absolute inset-0 bg-gradient-to-b from-black/40 via-transparent to-black/90 pointer-events-none" />

                {/* Sticker Headline Overlay on Video */}
                {reelOverlayText.trim() && (
                  <div className="absolute top-10 left-3 right-3 text-center z-20">
                    <div 
                      className={`inline-block px-3 py-1 rounded-xl text-xs font-bold ${
                        reelEffect === 'neon'
                          ? 'text-white shadow-[0_0_15px_#ec4899]'
                          : reelEffect === 'glass'
                          ? 'bg-black/60 backdrop-blur-md border border-white/20 text-white'
                          : reelEffect === 'brutalist'
                          ? 'bg-white text-black font-black uppercase'
                          : 'bg-gradient-to-r from-pink-400 to-amber-300 bg-clip-text text-transparent'
                      }`}
                      style={{
                        fontFamily: FONT_OPTIONS.find((f) => f.id === reelFont)?.style.fontFamily || 'sans-serif'
                      }}
                    >
                      {reelOverlayText}
                    </div>
                  </div>
                )}

                {/* Overlay Preview */}
                <div className="absolute left-3 right-3 bottom-3 z-10 space-y-1 text-white">
                  <div className="font-bold text-xs">@{currentUserUsername}</div>
                  <p className="text-[10px] text-zinc-300 line-clamp-2">
                    {caption || 'Your SPARK caption will appear here...'}
                  </p>
                  <div className="text-[9px] text-violet-300 truncate">
                    🎵 {musicTitle || 'Original Audio'}
                  </div>
                </div>
              </div>
            </div>

            {/* Audio Track Input */}
            <div className="space-y-1.5">
              <div className="flex items-center justify-between">
                <label className="text-[11px] text-zinc-400 font-medium flex items-center gap-1.5">
                  <Music className="w-3.5 h-3.5 text-rose-400" />
                  <span>Soundtrack (YouTube Music)</span>
                </label>
                <button
                  type="button"
                  onClick={() => setShowMusicPicker(true)}
                  className="text-[11px] font-mono text-rose-400 hover:text-rose-300 font-bold transition flex items-center gap-1 cursor-pointer"
                >
                  <Search className="w-3 h-3" />
                  <span>Search YT Music &rarr;</span>
                </button>
              </div>
              <input
                type="text"
                value={musicTitle}
                onChange={(e) => setMusicTitle(e.target.value)}
                placeholder="e.g. Wonderwall — Oasis"
                className="w-full bg-white/[0.04] border border-white/10 rounded-2xl px-4 py-2 text-xs text-white placeholder-zinc-500 focus:outline-none focus:border-rose-400 font-mono"
              />
            </div>
          </div>

          {/* ── RIGHT: VERIFIED SOURCE, CAPTION & TAGS (6 cols) ── */}
          <div className="md:col-span-6 p-5 flex flex-col justify-between overflow-y-auto space-y-5 bg-[#0e0f16]">
            <div className="space-y-4">
              {/* COMPULSORY SOURCE CITATION BOX */}
              <div className="p-4 rounded-2xl bg-cyan-500/[0.04] border border-cyan-500/30 space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-cyan-300 flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-cyan-400 animate-pulse" />
                    2. Verified Source Citation (COMPULSORY)
                  </span>
                  <span className="text-[9px] font-mono text-cyan-400 bg-cyan-500/10 px-2 py-0.5 rounded-full border border-cyan-500/30">
                    Required
                  </span>
                </div>

                <div className="space-y-2">
                  <div>
                    <label className="text-[11px] text-zinc-300 font-medium block mb-1">Source Name / Entity *</label>
                    <input
                      type="text"
                      required
                      value={sourceName}
                      onChange={(e) => setSourceName(e.target.value)}
                      placeholder="e.g. Geneva Climate Report, Youth Assembly Resolution"
                      className="w-full bg-black/60 border border-white/15 rounded-xl px-3.5 py-2 text-xs text-white placeholder-zinc-500 focus:outline-none focus:border-cyan-400"
                    />
                  </div>

                  <div>
                    <label className="text-[11px] text-zinc-300 font-medium block mb-1">Source / Evidence Link *</label>
                    <input
                      type="url"
                      required
                      value={sourceUrl}
                      onChange={(e) => setSourceUrl(e.target.value)}
                      placeholder="https://prsindia.org/... or https://sci.gov.in/..."
                      className="w-full bg-black/60 border border-white/15 rounded-xl px-3.5 py-2 text-xs text-white placeholder-zinc-500 focus:outline-none focus:border-cyan-400"
                    />
                  </div>

                  {/* 1-Click Institutional Sources */}
                  <div className="pt-1 flex flex-wrap gap-1">
                    {[
                      { name: 'PRS India', url: 'https://prsindia.org' },
                      { name: 'UN Digital Library', url: 'https://digitallibrary.un.org' },
                      { name: 'Supreme Court of India', url: 'https://sci.gov.in' },
                      { name: 'IPU Parliament', url: 'https://www.ipu.org' }
                    ].map((s) => (
                      <button
                        key={s.name}
                        type="button"
                        onClick={() => {
                          setSourceName(s.name);
                          setSourceUrl(s.url);
                        }}
                        className="px-2 py-0.5 rounded-lg bg-white/[0.04] hover:bg-cyan-500/15 border border-white/10 hover:border-cyan-400/40 text-[10px] font-mono text-zinc-400 hover:text-cyan-300 transition cursor-pointer"
                      >
                        + {s.name}
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              {/* Caption */}
              <div className="space-y-1.5">
                <div className="flex items-center justify-between text-xs text-zinc-400 font-medium">
                  <span>3. Caption &amp; Key Insight</span>
                  <span className="text-[10px] font-mono">{caption.length} / 280</span>
                </div>
                <textarea
                  required
                  value={caption}
                  onChange={(e) => setCaption(e.target.value.slice(0, 280))}
                  placeholder="Share the core takeaway or deliberation highlight..."
                  rows={3}
                  className="w-full bg-white/[0.04] border border-white/10 rounded-2xl p-3.5 text-xs text-white placeholder-zinc-500 focus:outline-none focus:border-violet-500 leading-relaxed resize-none"
                  style={getStoryFontStyle(reelFont)}
                />

                {/* ── 10 GOATED TYPOGRAPHY STYLES ── */}
                <div className="pt-2 border-t border-white/[0.06] space-y-1.5">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-1.5 text-[11px] text-zinc-400 font-mono">
                      <Type className="w-3.5 h-3.5 text-cyan-400" />
                      <span>10 Typography Styles</span>
                    </div>
                    <span className="text-[10px] text-cyan-400 font-mono font-bold">
                      {STORY_FONTS.find((f) => f.id === reelFont)?.name || 'Clash Display'}
                    </span>
                  </div>

                  <div className="grid grid-cols-5 gap-1.5 select-none">
                    {STORY_FONTS.map((font) => (
                      <button
                        key={font.id}
                        type="button"
                        onClick={() => setReelFont(font.id)}
                        className={`h-8 rounded-xl flex flex-col items-center justify-center p-0.5 transition-all duration-200 cursor-pointer border ${
                          reelFont === font.id
                            ? 'bg-white text-black border-white shadow-[0_0_10px_rgba(255,255,255,0.4)] scale-105 font-bold'
                            : 'bg-white/[0.04] text-zinc-400 hover:text-white border-white/10'
                        }`}
                        title={font.name}
                      >
                        <span
                          className="text-[10px] truncate max-w-full"
                          style={{ fontFamily: font.fontFamily, fontWeight: font.fontWeight || 600 }}
                        >
                          {font.sample}
                        </span>
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              {/* Tags */}
              <div className="space-y-1.5">
                <label className="text-xs text-zinc-400 font-medium flex items-center gap-1.5">
                  <Hash className="w-3.5 h-3.5 text-violet-400" />
                  <span>Tags (comma-separated)</span>
                </label>
                <input
                  type="text"
                  value={tagsInput}
                  onChange={(e) => setTagsInput(e.target.value)}
                  placeholder="Politics, Policy, Parliament, SupremeCourt, Treaty"
                  className="w-full bg-white/[0.04] border border-white/10 rounded-2xl px-3.5 py-2 text-xs text-white placeholder-zinc-500 focus:outline-none focus:border-violet-500"
                />
                <div className="flex flex-wrap gap-1 pt-1">
                  {['Politics', 'Policy', 'Parliament', 'Constitution', 'Treaty', 'Democracy'].map((tag) => (
                    <button
                      key={tag}
                      type="button"
                      onClick={() => {
                        const existing = tagsInput.split(',').map(t => t.trim()).filter(Boolean);
                        if (!existing.includes(tag)) {
                          setTagsInput(existing.concat(tag).join(', '));
                        }
                      }}
                      className="px-2 py-0.5 rounded-full bg-violet-500/10 hover:bg-violet-500/20 border border-violet-500/20 text-violet-300 text-[10px] font-mono transition cursor-pointer"
                    >
                      #{tag}
                    </button>
                  ))}
                </div>
              </div>

              {/* Privacy Toggle */}
              <div className="flex items-center justify-between p-3 rounded-2xl bg-white/[0.02] border border-white/10">
                <div className="flex items-center gap-2">
                  {isPrivate ? <Lock className="w-4 h-4 text-amber-400" /> : <Globe2 className="w-4 h-4 text-emerald-400" />}
                  <span className="text-xs font-semibold text-white">
                    {isPrivate ? 'Followers Only' : 'Public to World'}
                  </span>
                </div>

                <button
                  type="button"
                  onClick={() => setIsPrivate(!isPrivate)}
                  className={`px-3 py-1 rounded-xl text-xs font-semibold transition cursor-pointer ${
                    isPrivate ? 'bg-amber-500/20 text-amber-300 border border-amber-500/30' : 'bg-white/10 text-white'
                  }`}
                >
                  {isPrivate ? 'Private' : 'Public'}
                </button>
              </div>
            </div>

            {/* Bottom Actions Helper */}
            <div className="pt-3 border-t border-white/10 flex items-center justify-between text-[11px] text-zinc-500 font-mono">
              <span>Verified Youth Network SPARK Stream</span>
              <span>ZenPulse Studio</span>
            </div>
          </div>
        </div>
      </div>

      <MusicPickerModal
        isOpen={showMusicPicker}
        onClose={() => setShowMusicPicker(false)}
        selectedTrackTitle={musicTitle}
        onSelectTrack={(track) => {
          setMusicTitle(track.artist ? `${track.title} — ${track.artist}` : track.title);
        }}
      />
    </div>
  );
}

