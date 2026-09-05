'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { 
  Plus, 
  X, 
  ChevronRight, 
  ChevronLeft, 
  Heart, 
  Trash2, 
  Send, 
  Sparkles,
  Camera,
  Music
} from 'lucide-react';
import { useZenPulse } from '@/context/ZenPulsePlatformContext';
import { StoryComposerModal } from './StoryComposerModal';
import { PulseStory } from '@/types/pulse';
import { motion, AnimatePresence } from 'framer-motion';

export function StoriesTray() {
  const router = useRouter();
  const { 
    stories, 
    recordStoryView, 
    likeStory, 
    deleteStory, 
    currentUserId, 
    currentUserUsername,
    currentUserName,
    myProfile
  } = useZenPulse();

  const userAvatar = 
    myProfile?.avatar || 
    (typeof window !== 'undefined' && (() => {
      try {
        const pulseProfile = JSON.parse(localStorage.getItem('zenvitra_pulse_my_profile_v1') || '{}');
        if (pulseProfile?.avatar) return pulseProfile.avatar;
        const stored = JSON.parse(localStorage.getItem('zenvitra_session_user') || '{}');
        return stored?.avatar || stored?.avatar_url || '';
      } catch (_) {
        return '';
      }
    })()) || 
    '';

  const [activeStoryIdx, setActiveStoryIdx] = useState<number | null>(null);
  const [showComposer, setShowComposer] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [storyProgress, setStoryProgress] = useState(0);
  const [replyText, setReplyText] = useState('');

  const currentStory: PulseStory | undefined = activeStoryIdx !== null ? stories[activeStoryIdx] : undefined;
  const isOwnStory = currentStory?.authorUsername === currentUserUsername;

  // Auto record view when a story opens
  useEffect(() => {
    if (currentStory && !isOwnStory) {
      recordStoryView(currentStory.id);
    }
  }, [currentStory, isOwnStory, recordStoryView]);

  // Story playback timer (5 seconds)
  useEffect(() => {
    if (activeStoryIdx === null || isPaused) return;

    setStoryProgress(0);
    const intervalTime = 50;
    const totalDuration = 5000;
    const step = (intervalTime / totalDuration) * 100;

    const timer = setInterval(() => {
      setStoryProgress((prev) => {
        if (prev >= 100) {
          clearInterval(timer);
          nextStory();
          return 0;
        }
        return prev + step;
      });
    }, intervalTime);

    return () => clearInterval(timer);
  }, [activeStoryIdx, isPaused]);

  const openStory = (idx: number) => {
    setStoryProgress(0);
    setActiveStoryIdx(idx);
  };

  const closeStory = () => {
    setActiveStoryIdx(null);
    setStoryProgress(0);
  };

  const nextStory = () => {
    setStoryProgress(0);
    if (activeStoryIdx !== null && activeStoryIdx < stories.length - 1) {
      setActiveStoryIdx(activeStoryIdx + 1);
    } else {
      closeStory();
    }
  };

  const prevStory = () => {
    setStoryProgress(0);
    if (activeStoryIdx !== null && activeStoryIdx > 0) {
      setActiveStoryIdx(activeStoryIdx - 1);
    }
  };

  const userHasLiked = currentStory?.viewers.some((v) => v.username === currentUserUsername && v.liked);

  return (
    <>
      {/* ── Orbital Wire Capsules (Futuristic Dispatch Rail) ── */}
      <div className="w-full overflow-x-auto scrollbar-none select-none py-1 px-1">
        <div className="flex items-center gap-3.5 min-w-max">
          {/* Master Node: Create Dispatch */}
          <button
            onClick={() => router.push('/pulse/create-story')}
            className="group relative w-[114px] h-[148px] rounded-2xl p-[1.5px] bg-gradient-to-b from-cyan-400/40 via-blue-500/20 to-transparent hover:from-cyan-400 hover:via-blue-500 hover:to-fuchsia-500 transition-all duration-300 cursor-pointer shadow-[0_4px_20px_rgba(0,0,0,0.5)] shrink-0"
          >
            <div className="w-full h-full rounded-2xl bg-[#090b12] p-3 flex flex-col justify-between items-center text-center relative overflow-hidden group-hover:bg-[#0d101a] transition">
              {/* Top status indicator */}
              <div className="flex items-center gap-1 font-mono text-[9px] text-cyan-300 font-bold uppercase tracking-wider">
                <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 animate-ping" />
                <span>RELAY</span>
              </div>

              {/* Center Avatar with Pulsing Halo */}
              <div className="relative my-auto">
                <div className="w-11 h-11 rounded-xl bg-gradient-to-tr from-cyan-500 to-blue-600 p-[1.5px] shadow-[0_0_15px_rgba(6,182,212,0.4)] group-hover:scale-105 transition-transform">
                  <div className="w-full h-full rounded-[10px] bg-black flex items-center justify-center font-bold text-sm text-white overflow-hidden">
                    {userAvatar ? (
                      <img src={userAvatar} alt="Profile" className="w-full h-full object-cover rounded-[9px]" />
                    ) : (
                      (currentUserName || currentUserUsername || 'U')[0]?.toUpperCase() || 'U'
                    )}
                  </div>
                </div>
                <div className="absolute -bottom-1.5 -right-1.5 w-5 h-5 rounded-full bg-white text-black flex items-center justify-center font-bold shadow-md">
                  <Plus className="w-3 h-3 stroke-[3]" />
                </div>
              </div>

              {/* Bottom Label */}
              <div>
                <span className="text-[11px] font-bold text-white block group-hover:text-cyan-300 transition tracking-tight">
                  New Relay
                </span>
                <span className="text-[9px] font-mono text-zinc-500 block">24h Wire</span>
              </div>
            </div>
          </button>

          {/* Active Story Orbital Capsules */}
          {stories.map((story, i) => {
            const hasViewed = story.viewers.some((v) => v.username === currentUserUsername);
            return (
              <button
                key={story.id}
                onClick={() => openStory(i)}
                className={`group relative w-[114px] h-[148px] rounded-2xl p-[1.5px] transition-all duration-300 cursor-pointer shadow-[0_4px_20px_rgba(0,0,0,0.5)] shrink-0 hover:scale-[1.03] ${
                  hasViewed
                    ? 'bg-white/10 hover:bg-white/20'
                    : 'bg-gradient-to-b from-amber-400 via-rose-500 to-fuchsia-600 shadow-[0_0_20px_rgba(244,63,94,0.25)]'
                }`}
              >
                <div className="w-full h-full rounded-2xl bg-[#090b12] overflow-hidden relative flex flex-col justify-between p-2.5">
                  {/* Background Layer */}
                  {story.image ? (
                    <img
                      src={story.image}
                      alt={story.authorName}
                      className="absolute inset-0 w-full h-full object-cover opacity-60 group-hover:opacity-85 group-hover:scale-110 transition duration-700"
                    />
                  ) : (
                    <div className={`absolute inset-0 bg-gradient-to-br ${story.color || 'from-indigo-900/60 to-purple-900/60'} opacity-75 group-hover:opacity-95 transition`} />
                  )}
                  <div className="absolute inset-0 bg-gradient-to-b from-black/70 via-transparent to-black/90 pointer-events-none" />

                    {/* Top: Wire Channel Tag */}
                    <div className="relative z-10 flex items-center justify-between w-full">
                      <span className="px-1.5 py-0.5 rounded-md bg-black/70 backdrop-blur-md border border-white/15 text-[8px] font-mono font-bold text-amber-300 uppercase tracking-wider flex items-center gap-1">
                        <span className="w-1 h-1 rounded-full bg-amber-400 animate-pulse" />
                        <span>{(story as any).location || 'WIRE'}</span>
                      </span>
                    </div>

                  {/* Center Text Snippet if text story */}
                  {!story.image && story.title && (
                    <div className="relative z-10 my-auto text-center px-1">
                      <p className="text-[10px] font-bold text-white line-clamp-2 leading-tight drop-shadow-md">
                        {story.title}
                      </p>
                    </div>
                  )}

                  {/* Bottom: Author Avatar & Handle */}
                  <div className="relative z-10 flex items-center gap-1.5 pt-1">
                    <div className="w-6 h-6 rounded-full bg-gradient-to-tr from-cyan-400 to-blue-500 p-[1px] shrink-0">
                      <div className="w-full h-full rounded-full bg-black flex items-center justify-center text-[9px] font-bold text-white uppercase">
                        {story.avatarLetter || story.authorName?.[0]?.toUpperCase() || 'U'}
                      </div>
                    </div>
                    <span className="text-[10px] font-bold text-white group-hover:text-cyan-300 transition truncate max-w-[65px] tracking-tight">
                      @{story.authorUsername}
                    </span>
                  </div>
                </div>
              </button>
            );
          })}
        </div>
      </div>


      {/* Story Viewer Modal */}
      <AnimatePresence>
        {currentStory && activeStoryIdx !== null && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-black/95 backdrop-blur-2xl flex items-center justify-center p-4 select-none"
          >
            {/* Close Button */}
            <button
              onClick={closeStory}
              className="absolute top-6 right-6 p-2 text-zinc-400 hover:text-white rounded-full bg-white/10 hover:bg-white/20 backdrop-blur-md transition cursor-pointer z-50 border border-white/15"
            >
              <X className="w-5 h-5" />
            </button>

            {/* Story Card */}
            <div className="relative w-full max-w-[420px] h-[720px] max-h-[90vh] bg-[#090a0f] rounded-3xl overflow-hidden shadow-[0_25px_80px_rgba(0,0,0,0.98)] flex flex-col justify-between border border-white/15">
              
              {/* Progress Bars */}
              <div className="absolute top-3.5 inset-x-3.5 z-30 flex items-center gap-1.5">
                {stories.map((s, idx) => (
                  <div key={s.id} className="flex-1 h-1 bg-white/30 rounded-full overflow-hidden backdrop-blur-sm">
                    <div
                      className="h-full bg-white transition-all duration-75 ease-linear shadow-[0_0_8px_rgba(255,255,255,0.8)]"
                      style={{
                        width:
                          idx < activeStoryIdx
                            ? '100%'
                            : idx === activeStoryIdx
                            ? `${storyProgress}%`
                            : '0%',
                      }}
                    />
                  </div>
                ))}
              </div>

              {/* Story Header */}
              <div className="relative z-30 pt-7 px-4 flex items-center justify-between bg-gradient-to-b from-black/90 to-transparent">
                <div className="flex items-center gap-2.5">
                  <div className="w-9 h-9 rounded-full bg-gradient-to-tr from-amber-400 via-rose-500 to-fuchsia-600 p-[1.5px] shadow-md">
                    <div className="w-full h-full rounded-full bg-black flex items-center justify-center font-bold text-xs text-white">
                      {currentStory.avatarLetter || currentStory.authorName?.[0]?.toUpperCase() || 'U'}
                    </div>
                  </div>
                  <div>
                    <p className="text-xs font-bold text-white tracking-tight">{currentStory.authorUsername}</p>
                    <p className="text-[10px] text-zinc-400 font-mono">{currentStory.time || 'Just now'}</p>
                  </div>
                </div>

                {/* Attached Soundtrack Vinyl Pill */}
                {(currentStory.songTitle || currentStory.audioTitle) && (
                  <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-black/60 border border-white/20 text-white font-mono text-[10px] shadow-lg max-w-[150px] truncate">
                    <Music className="w-3 h-3 text-rose-400 shrink-0 animate-spin" style={{ animationDuration: '4s' }} />
                    <span className="truncate">{currentStory.songTitle || currentStory.audioTitle}</span>
                  </div>
                )}

                {isOwnStory && (
                  <button
                    onClick={() => {
                      deleteStory(currentStory.id);
                      closeStory();
                    }}
                    className="p-1.5 text-zinc-400 hover:text-rose-400 transition"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                )}
              </div>

              {/* Story Content Viewport */}
              <div
                className="absolute inset-0 flex items-center justify-center bg-black cursor-pointer"
                onMouseDown={() => setIsPaused(true)}
                onMouseUp={() => setIsPaused(false)}
                onTouchStart={() => setIsPaused(true)}
                onTouchEnd={() => setIsPaused(false)}
              >
                {currentStory.image ? (
                  <div className="relative w-full h-full">
                    <img
                      src={currentStory.image}
                      alt={currentStory.title}
                      className="w-full h-full object-cover"
                    />

                    {/* ZEN.SNAP OFFICIAL BRANDING WATERMARK ON VIEWER */}
                    {currentStory.isSnap && (
                      <div className="absolute inset-0 p-5 pointer-events-none z-15 flex flex-col justify-between">
                        {/* Branded Header Brackets */}
                        <div className="flex justify-between items-start pt-6">
                          <div className="w-5 h-5 border-t-2 border-l-2 border-amber-400 rounded-tl-md shadow-[0_0_10px_rgba(245,158,11,0.5)]" />
                          <div className="flex items-center gap-1.5 bg-black/75 backdrop-blur-md px-3 py-1 rounded-full border border-amber-400/40 shadow-xl">
                            <span className="w-2 h-2 rounded-full bg-rose-500 animate-ping" />
                            <span className="text-[10px] font-mono font-bold text-amber-300 tracking-wider">ZEN.SNAP // OFFICIAL</span>
                          </div>
                          <div className="w-5 h-5 border-t-2 border-r-2 border-amber-400 rounded-tr-md shadow-[0_0_10px_rgba(245,158,11,0.5)]" />
                        </div>

                        {/* Center Viewfinder Reticle */}
                        <div className="my-auto mx-auto w-12 h-12 border border-white/25 rounded-full flex items-center justify-center opacity-30">
                          <div className="w-2 h-2 bg-amber-400 rounded-full" />
                        </div>

                        {/* Bottom Branded Geotag & Cryptographic Signature */}
                        <div className="space-y-1.5 pb-20">
                          <div className="flex justify-between items-end">
                            <div className="w-5 h-5 border-b-2 border-l-2 border-amber-400 rounded-bl-md shadow-[0_0_10px_rgba(245,158,11,0.5)]" />
                            <div className="text-right">
                              <span className="text-[10px] font-mono text-white bg-black/80 px-2.5 py-1 rounded-lg border border-white/20 block font-bold tracking-widest uppercase shadow-lg">
                                {currentStory.snapLocation || 'ZENVITRA // SOVEREIGN MESH'}
                              </span>
                              <span className="text-[8px] font-mono text-amber-300 block mt-1">
                                AUTHENTICATED // {currentStory.snapTimestamp || 'VERIFIED TIMESTAMP'}
                              </span>
                            </div>
                            <div className="w-5 h-5 border-b-2 border-r-2 border-amber-400 rounded-br-md shadow-[0_0_10px_rgba(245,158,11,0.5)]" />
                          </div>
                        </div>
                      </div>
                    )}

                    {currentStory.title && (
                      <div className="absolute inset-x-4 bottom-24 z-20 text-center">
                        <p
                          className={`text-xl leading-snug break-words ${
                            currentStory.effectStyle === 'box'
                              ? 'bg-black/75 px-4 py-2 rounded-2xl backdrop-blur-md border border-white/20 text-white shadow-2xl inline-block'
                              : currentStory.effectStyle === 'neon'
                              ? 'text-white drop-shadow-[0_0_25px_rgba(56,189,248,1)]'
                              : currentStory.effectStyle === 'inverted'
                              ? 'bg-white text-black px-4 py-2 rounded-2xl font-black shadow-2xl inline-block'
                              : 'text-white drop-shadow-[0_2px_12px_rgba(0,0,0,0.95)]'
                          }`}
                          style={{
                            fontFamily: 
                              currentStory.fontStyle === 'syne' ? "'Syne', sans-serif" :
                              currentStory.fontStyle === 'marker' ? "'Permanent Marker', cursive" :
                              currentStory.fontStyle === 'bebas' ? "'Bebas Neue', sans-serif" :
                              currentStory.fontStyle === 'script' ? "'Dancing Script', cursive" :
                              currentStory.fontStyle === 'orbitron' ? "'Orbitron', sans-serif" :
                              currentStory.fontStyle === 'serif' ? "var(--font-playfair), 'Playfair Display', Georgia, serif" :
                              currentStory.fontStyle === 'mono' ? "var(--font-mono), 'JetBrains Mono', monospace" :
                              currentStory.fontStyle === 'typewriter' ? "'Special Elite', cursive" :
                              currentStory.fontStyle === 'prata' ? "'Prata', 'Cinzel Decorative', serif" :
                              "'Clash Display', var(--font-space), sans-serif",
                            fontWeight: currentStory.fontStyle === 'syne' ? 800 : currentStory.fontStyle === 'orbitron' ? 900 : currentStory.fontStyle === 'serif' ? 600 : 700,
                            fontStyle: currentStory.fontStyle === 'serif' ? 'italic' : 'normal',
                          }}
                        >
                          {currentStory.title}
                        </p>
                      </div>
                    )}
                  </div>
                ) : (
                  <div
                    className={`w-full h-full bg-gradient-to-br ${
                      currentStory.color || 'from-purple-950 via-zinc-950 to-black'
                    } flex flex-col items-center justify-center p-8 text-center relative`}
                  >
                    <p 
                      className={`text-2xl transition-all duration-300 leading-relaxed max-w-full break-words ${
                        currentStory.effectStyle === 'box'
                          ? 'bg-black/75 px-5 py-2.5 rounded-3xl backdrop-blur-xl border border-white/20 text-white shadow-2xl'
                          : currentStory.effectStyle === 'neon'
                          ? 'text-white drop-shadow-[0_0_30px_rgba(56,189,248,1)]'
                          : currentStory.effectStyle === 'inverted'
                          ? 'bg-white text-black px-5 py-2.5 rounded-3xl font-black shadow-2xl'
                          : 'text-white drop-shadow-2xl'
                      }`}
                      style={{
                        fontFamily: 
                          currentStory.fontStyle === 'syne' ? "'Syne', sans-serif" :
                          currentStory.fontStyle === 'marker' ? "'Permanent Marker', cursive" :
                          currentStory.fontStyle === 'bebas' ? "'Bebas Neue', sans-serif" :
                          currentStory.fontStyle === 'script' ? "'Dancing Script', cursive" :
                          currentStory.fontStyle === 'orbitron' ? "'Orbitron', sans-serif" :
                          currentStory.fontStyle === 'serif' ? "var(--font-playfair), 'Playfair Display', Georgia, serif" :
                          currentStory.fontStyle === 'mono' ? "var(--font-mono), 'JetBrains Mono', monospace" :
                          currentStory.fontStyle === 'typewriter' ? "'Special Elite', cursive" :
                          currentStory.fontStyle === 'prata' ? "'Prata', 'Cinzel Decorative', serif" :
                          "'Clash Display', var(--font-space), sans-serif",
                        fontWeight: currentStory.fontStyle === 'syne' ? 800 : currentStory.fontStyle === 'orbitron' ? 900 : currentStory.fontStyle === 'serif' ? 600 : 700,
                        fontStyle: currentStory.fontStyle === 'serif' ? 'italic' : 'normal',
                      }}
                    >
                      {currentStory.title}
                    </p>

                    {/* Attached Stickers */}
                    {currentStory.stickers && currentStory.stickers.length > 0 && (
                      <div className="flex flex-wrap gap-2 justify-center mt-6 z-20">
                        {currentStory.stickers.map((stk) => (
                          <span
                            key={stk}
                            className="px-3 py-1.5 rounded-full bg-white/20 backdrop-blur-xl border border-white/30 text-white font-mono text-xs font-bold shadow-2xl"
                          >
                            {stk}
                          </span>
                        ))}
                      </div>
                    )}
                  </div>
                )}

                {/* Bottom Action Link Button */}
                {currentStory.linkUrl && (
                  <div className="absolute bottom-20 inset-x-6 z-30">
                    <a
                      href={currentStory.linkUrl.startsWith('http') ? currentStory.linkUrl : `https://${currentStory.linkUrl}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      onClick={(e) => e.stopPropagation()}
                      className="w-full py-2.5 px-4 rounded-full bg-white text-black text-xs font-bold text-center shadow-2xl flex items-center justify-center gap-2 hover:bg-zinc-200 transition"
                    >
                      <span>🔗 {currentStory.linkText || 'Visit Link'}</span>
                    </a>
                  </div>
                )}

                {/* Left/Right Click Navigators */}
                <div
                  className="absolute left-0 inset-y-0 w-1/3 z-20"
                  onClick={(e) => {
                    e.stopPropagation();
                    prevStory();
                  }}
                />
                <div
                  className="absolute right-0 inset-y-0 w-1/3 z-20"
                  onClick={(e) => {
                    e.stopPropagation();
                    nextStory();
                  }}
                />
              </div>

              {/* Story Footer / Reply */}
              <div className="relative z-30 p-4 bg-gradient-to-t from-black/95 to-transparent flex items-center gap-3">
                <input
                  type="text"
                  placeholder={`Transmit deliberation to @${currentStory.authorUsername}...`}
                  value={replyText}
                  onChange={(e) => setReplyText(e.target.value)}
                  className="flex-1 px-4 py-2.5 rounded-full bg-white/10 border border-white/20 text-xs text-white placeholder:text-zinc-400 focus:outline-none focus:border-white transition backdrop-blur-md font-sans"
                />

                <button
                  onClick={() => {
                    if (currentStory) likeStory(currentStory.id);
                  }}
                  className="p-2 text-white hover:scale-125 transition cursor-pointer active:scale-95"
                >
                  <Heart
                    className={`w-6 h-6 transition ${
                      userHasLiked 
                        ? 'fill-rose-500 text-rose-500 drop-shadow-[0_0_12px_rgba(244,63,94,0.9)] scale-110' 
                        : 'text-white hover:text-rose-400'
                    }`}
                  />
                </button>
              </div>
            </div>

            {/* Navigation Arrows for Desktop */}
            {activeStoryIdx > 0 && (
              <button
                onClick={prevStory}
                className="hidden md:flex absolute left-8 p-3.5 rounded-full bg-white/10 hover:bg-white/20 text-white transition cursor-pointer backdrop-blur-md border border-white/15"
              >
                <ChevronLeft className="w-6 h-6" />
              </button>
            )}

            {activeStoryIdx < stories.length - 1 && (
              <button
                onClick={nextStory}
                className="hidden md:flex absolute right-8 p-3.5 rounded-full bg-white/10 hover:bg-white/20 text-white transition cursor-pointer backdrop-blur-md border border-white/15"
              >
                <ChevronRight className="w-6 h-6" />
              </button>
            )}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Story Composer Modal */}
      {showComposer && (
        <StoryComposerModal isOpen={showComposer} onClose={() => setShowComposer(false)} />
      )}
    </>
  );
}
