'use client';

import React, { useState, useRef, useEffect } from 'react';
import { 
  Heart, 
  MessageCircle, 
  Share2, 
  Volume2, 
  VolumeX, 
  Play, 
  Pause, 
  ChevronUp, 
  ChevronDown, 
  Music, 
  Plus, 
  Check, 
  Sparkles, 
  X, 
  Send,
  Disc3,
  Bookmark,
  ExternalLink,
  ShieldAlert,
  Flag,
  Trash2,
  Zap,
  BookOpen,
  Film,
  Landmark
} from 'lucide-react';
import { useZenPulse } from '@/context/ZenPulsePlatformContext';
import { FluxVideo } from '@/types/pulse';
import { getStoryFontStyle } from '@/lib/storyFonts';
import { motion, AnimatePresence } from 'framer-motion';
import { INITIAL_SPARKS, ZenSpark } from '@/types/sparks';
import { ZenSparkCard } from './ZenSparkCard';
import { ZenFlexReaderModal, FlexReaderItem } from './ZenFlexReaderModal';

export function FluxReelsFeed() {
  const { 
    fluxVideos, 
    likeFlux, 
    deleteFlux,
    purgeFakeFlux,
    getFluxComments, 
    addFluxComment, 
    currentUserId,
    isFollowing,
    toggleFollow,
    openUserProfile
  } = useZenPulse();

  const [currentIndex, setCurrentIndex] = useState(0);
  const [direction, setDirection] = useState<1 | -1>(1);
  const [isPlaying, setIsPlaying] = useState(true);
  const [isMuted, setIsMuted] = useState(true);
  const [doubleTapHeart, setDoubleTapHeart] = useState(false);
  const [showCommentsDrawer, setShowCommentsDrawer] = useState(false);
  const [showReportModal, setShowReportModal] = useState(false);
  const [reportReason, setReportReason] = useState('Religious Forward / Devotional Clickbait');
  const [reelCategory, setReelCategory] = useState<'all' | 'politics'>('all');
  const [commentInput, setCommentInput] = useState('');
  const [copiedToast, setCopiedToast] = useState(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const [showSparksDrawer, setShowSparksDrawer] = useState(false);
  const [activeFlexItem, setActiveFlexItem] = useState<FlexReaderItem | null>(null);

  const politicalTags = new Set([
    'politics', 'policy', 'parliament', 'youthquota', 'democracy', 'constitution', 
    'treaty', 'climatediplomacy', 'un', 'cop30', 'lossanddamage', 'governance'
  ]);

  const filteredFluxVideos = React.useMemo(() => {
    if (reelCategory === 'politics') {
      return fluxVideos.filter((v) => {
        const matchesTag = (v.tags || []).some((t) => politicalTags.has(t.toLowerCase()));
        const matchesCaption = /\b(parliament|policy|politics|treaty|diplomacy|un|constitution|quota|resolution|act|bill)\b/i.test(v.caption);
        const matchesSource = Boolean(v.sourceName && /ipu|un|parliament|court|gov|research/i.test(v.sourceName));
        return matchesTag || matchesCaption || matchesSource;
      });
    }
    return fluxVideos;
  }, [fluxVideos, reelCategory]);

  const videoRef = useRef<HTMLVideoElement | null>(null);
  const isScrollingRef = useRef(false);
  const touchStartY = useRef<number | null>(null);
  const currentFlux: FluxVideo | undefined = filteredFluxVideos[currentIndex] || filteredFluxVideos[0];

  useEffect(() => {
    if (videoRef.current) {
      videoRef.current.currentTime = 0;
      videoRef.current.play().catch(() => {
        setIsPlaying(false);
      });
      setIsPlaying(true);
    }
  }, [currentIndex]);

  const handleNext = () => {
    setShowCommentsDrawer(false);
    setDirection(1);
    if (filteredFluxVideos.length === 0) return;
    if (currentIndex < filteredFluxVideos.length - 1) {
      setCurrentIndex(currentIndex + 1);
    } else {
      setCurrentIndex(0);
    }
  };

  const handlePrev = () => {
    setShowCommentsDrawer(false);
    setDirection(-1);
    if (filteredFluxVideos.length === 0) return;
    if (currentIndex > 0) {
      setCurrentIndex(currentIndex - 1);
    } else {
      setCurrentIndex(filteredFluxVideos.length - 1);
    }
  };

  // Keyboard navigation (Arrow keys + Space)
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'ArrowDown') {
        e.preventDefault();
        handleNext();
      } else if (e.key === 'ArrowUp') {
        e.preventDefault();
        handlePrev();
      } else if (e.key === ' ' && !showCommentsDrawer) {
        e.preventDefault();
        togglePlayPause();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [currentIndex, isPlaying, showCommentsDrawer, filteredFluxVideos.length]);

  // Mouse Wheel / Trackpad Scroll (Natural Reel Scrolling)
  const handleWheel = (e: React.WheelEvent) => {
    // If inside comments or report modal, allow native internal scrolling
    if (showCommentsDrawer || showReportModal) return;

    if (isScrollingRef.current) return;

    if (Math.abs(e.deltaY) > 20) {
      isScrollingRef.current = true;
      if (e.deltaY > 0) {
        handleNext();
      } else {
        handlePrev();
      }
      setTimeout(() => {
        isScrollingRef.current = false;
      }, 420);
    }
  };

  // Touch Swipe Navigation for Mobile
  const handleTouchStart = (e: React.TouchEvent) => {
    if (showCommentsDrawer || showReportModal) return;
    touchStartY.current = e.touches[0].clientY;
  };

  const handleTouchEnd = (e: React.TouchEvent) => {
    if (showCommentsDrawer || showReportModal || touchStartY.current === null) return;
    const touchEndY = e.changedTouches[0].clientY;
    const deltaY = touchStartY.current - touchEndY;
    touchStartY.current = null;

    if (Math.abs(deltaY) > 40) {
      if (deltaY > 0) {
        handleNext();
      } else {
        handlePrev();
      }
    }
  };

  const togglePlayPause = () => {
    if (!videoRef.current) return;
    if (isPlaying) {
      videoRef.current.pause();
      setIsPlaying(false);
    } else {
      videoRef.current.play();
      setIsPlaying(true);
    }
  };

  const handleDoubleTap = () => {
    if (!currentFlux) return;
    setDoubleTapHeart(true);
    setTimeout(() => setDoubleTapHeart(false), 700);
    if (!currentFlux.likedBy.includes(currentUserId)) {
      likeFlux(currentFlux.id);
    }
  };

  const handleShare = () => {
    if (typeof navigator !== 'undefined') {
      navigator.clipboard.writeText(`${window.location.origin}/pulse?flux=${currentFlux?.id}`);
      setCopiedToast(true);
      setTimeout(() => setCopiedToast(false), 2000);
    }
  };

  const handleAddComment = (e: React.FormEvent) => {
    e.preventDefault();
    if (!commentInput.trim() || !currentFlux) return;
    addFluxComment(currentFlux.id, commentInput.trim());
    setCommentInput('');
  };

  if (!currentFlux) {
    return (
      <div className="h-[75vh] flex flex-col items-center justify-center text-center p-6 space-y-4">
        <Film className="w-12 h-12 text-rose-400 animate-pulse" />
        <h3 className="font-display font-bold text-xl text-white">No FLUX Reels Yet</h3>
        <p className="text-xs text-neutral-400 max-w-xs">Be the first youth creator to transmit a vertical FLUX video reel!</p>
      </div>
    );
  }

  const hasLiked = currentFlux.likedBy.includes(currentUserId);
  const followingAuthor = isFollowing(currentFlux.authorUsername);
  const comments = getFluxComments(currentFlux.id);

  return (
    <div 
      onWheel={handleWheel}
      onTouchStart={handleTouchStart}
      onTouchEnd={handleTouchEnd}
      className="relative w-full max-w-sm sm:max-w-md mx-auto h-[78vh] sm:h-[82vh] flex items-center justify-center select-none touch-none sm:touch-auto"
    >
      {/* Desktop Up/Down Switcher Buttons */}
      <div className="hidden sm:flex flex-col gap-2 absolute -right-16 top-1/2 -translate-y-1/2 z-30">
        <button
          onClick={handlePrev}
          className="p-3 rounded-full bg-zinc-900/90 hover:bg-zinc-800 text-white border border-white/15 transition hover:scale-110 shadow-xl cursor-pointer"
          title="Previous FLUX (Scroll Up / ↑)"
        >
          <ChevronUp className="w-5 h-5" />
        </button>
        <button
          onClick={handleNext}
          className="p-3 rounded-full bg-zinc-900/90 hover:bg-zinc-800 text-white border border-white/15 transition hover:scale-110 shadow-xl cursor-pointer"
          title="Next FLUX (Scroll Down / ↓)"
        >
          <ChevronDown className="w-5 h-5" />
        </button>
      </div>

      {/* Floating Scroll Gesture Hint */}
      <div className="absolute -top-7 left-1/2 -translate-x-1/2 z-20 flex items-center gap-2 px-3 py-1 rounded-full bg-black/70 backdrop-blur-md border border-white/10 text-[10px] font-mono text-zinc-400">
        <span className="text-cyan-400 font-bold">{currentIndex + 1} / {fluxVideos.length}</span>
        <span className="text-zinc-600">•</span>
        <span>Scroll or swipe to flip reel</span>
      </div>

      {/* Toast Notification */}
      <AnimatePresence>
        {copiedToast && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="absolute top-4 z-50 px-4 py-2 rounded-full bg-white text-black font-mono text-xs font-bold shadow-2xl flex items-center gap-1.5"
          >
            <Check className="w-3.5 h-3.5 text-emerald-600" />
            <span>FLUX Transmission Link Copied!</span>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ── VERTICAL 9:16 VIDEO STAGE ── */}
      <div className="relative w-full h-full rounded-[36px] overflow-hidden bg-black border border-white/10 shadow-[0_20px_80px_rgba(0,0,0,0.9)] flex flex-col justify-between">
        {/* Video element */}
        <video
          ref={videoRef}
          key={currentFlux.id}
          src={currentFlux.videoUrl}
          poster={currentFlux.thumbnailUrl}
          playsInline
          loop
          muted={isMuted}
          onClick={togglePlayPause}
          onDoubleClick={handleDoubleTap}
          className="absolute inset-0 w-full h-full object-cover cursor-pointer transition-all duration-300"
        />

        {/* Ambient Dark Gradient Overlays */}
        <div className="pointer-events-none absolute inset-0 bg-gradient-to-b from-black/60 via-transparent to-black/90 z-10" />

        {/* Double Tap Big Heart Animation */}
        {doubleTapHeart && (
          <div className="absolute inset-0 z-30 flex items-center justify-center pointer-events-none animate-in zoom-in-50 fade-in duration-300">
            <Heart className="w-28 h-28 text-white fill-rose-500 drop-shadow-[0_0_40px_rgba(244,63,94,0.9)] animate-bounce" />
          </div>
        )}

        {/* Play/Pause Center Indicator on Click */}
        {!isPlaying && (
          <div
            onClick={togglePlayPause}
            className="absolute inset-0 z-20 flex items-center justify-center bg-black/30 cursor-pointer"
          >
            <div className="w-16 h-16 rounded-full bg-black/60 backdrop-blur-md border border-white/20 flex items-center justify-center text-white">
              <Play className="w-8 h-8 ml-1 fill-white" />
            </div>
          </div>
        )}

        {/* ── TOP BAR: SOUND & STREAM BADGE & SPARKS LAUNCHER ── */}
        <div className="relative z-20 p-4 sm:p-5 flex items-center justify-between gap-2">
          <div className="flex items-center gap-2">
            <div className="flex items-center gap-2 px-3 py-1 rounded-full bg-black/50 backdrop-blur-md border border-white/10 text-white font-mono text-[10px]">
              <span className="w-2 h-2 rounded-full bg-rose-500 animate-pulse" />
              <span className="font-bold">FLUX STREAM</span>
            </div>

            {/* Politics & Policy Wire Filter Pill */}
            <button
              onClick={() => {
                setCurrentIndex(0);
                setReelCategory(reelCategory === 'politics' ? 'all' : 'politics');
              }}
              className={`flex items-center gap-1.5 px-3 py-1 rounded-full font-mono text-[10px] font-bold transition shadow-sm cursor-pointer backdrop-blur-md border ${
                reelCategory === 'politics'
                  ? 'bg-cyan-500/30 border-cyan-400 text-cyan-300 shadow-[0_0_12px_rgba(6,182,212,0.4)]'
                  : 'bg-black/50 border-white/10 text-zinc-300 hover:text-white'
              }`}
              title="Filter Political & Policy Reels"
            >
              <Landmark className="w-3 h-3 text-cyan-400" />
              <span>{reelCategory === 'politics' ? '🏛️ Politics: Active' : '🏛️ Politics'}</span>
            </button>

            {/* Quick-Access 5-Minute Sparks Drawer Toggle */}
            <button
              onClick={() => setShowSparksDrawer(true)}
              className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-400/20 hover:bg-amber-400/30 border border-amber-400/40 text-amber-300 font-mono text-[10px] font-bold transition shadow-sm cursor-pointer backdrop-blur-md"
              title="Open 5-Minute Fast Diplomatic Sparks & Briefs"
            >
              <Zap className="w-3 h-3 text-amber-400" />
              <span>⚡ 5-Min Sparks</span>
            </button>
          </div>

          <button
            onClick={() => setIsMuted(!isMuted)}
            className="p-2.5 rounded-full bg-black/50 backdrop-blur-md border border-white/10 text-white hover:bg-black/80 transition cursor-pointer"
          >
            {isMuted ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4 text-cyan-400" />}
          </button>
        </div>

        {/* ── RIGHT FLOATING ACTION BAR ── */}
        <div className="absolute right-3.5 bottom-20 z-20 flex flex-col items-center gap-5">
          {/* Creator Avatar with Follow (+) */}
          <div className="relative">
            <div
              onClick={() => openUserProfile(currentFlux.authorUsername)}
              className="w-12 h-12 rounded-full bg-gradient-to-tr from-zen-violet via-zen-rose to-zen-gold p-[2px] cursor-pointer hover:scale-105 transition-transform shadow-lg"
            >
              <div className="w-full h-full rounded-full bg-black flex items-center justify-center font-display font-bold text-xs text-white uppercase">
                {currentFlux.authorName?.[0]?.toUpperCase() || 'U'}
              </div>
            </div>
            {!followingAuthor && (
              <button
                onClick={() => toggleFollow(currentFlux.authorUsername)}
                className="absolute -bottom-1.5 left-1/2 -translate-x-1/2 w-5 h-5 rounded-full bg-rose-500 text-white flex items-center justify-center shadow-md hover:scale-110 transition cursor-pointer"
                title="Follow Creator"
              >
                <Plus className="w-3.5 h-3.5 stroke-[3]" />
              </button>
            )}
          </div>

          {/* Like Action */}
          <button
            onClick={() => likeFlux(currentFlux.id)}
            className="flex flex-col items-center gap-1 group cursor-pointer"
          >
            <div className={`w-11 h-11 rounded-full flex items-center justify-center transition-all duration-250 ${
              hasLiked
                ? 'bg-rose-500/20 text-rose-500 border border-rose-500/40 shadow-[0_0_20px_rgba(244,63,94,0.4)]'
                : 'bg-black/50 backdrop-blur-md text-white border border-white/15 hover:bg-white/10'
            }`}>
              <Heart className={`w-5 h-5 transition-transform group-hover:scale-125 ${hasLiked ? 'fill-rose-500' : ''}`} />
            </div>
            <span className="font-mono text-[10px] font-bold text-white drop-shadow">
              {currentFlux.likes}
            </span>
          </button>

          {/* Comments Action */}
          <button
            onClick={() => setShowCommentsDrawer(true)}
            className="flex flex-col items-center gap-1 group cursor-pointer"
          >
            <div className="w-11 h-11 rounded-full bg-black/50 backdrop-blur-md text-white border border-white/15 hover:bg-white/10 flex items-center justify-center transition-all duration-250">
              <MessageCircle className="w-5 h-5 group-hover:scale-125 transition-transform" />
            </div>
            <span className="font-mono text-[10px] font-bold text-white drop-shadow">
              {currentFlux.commentsCount || comments.length}
            </span>
          </button>

          {/* Share Action */}
          <button
            onClick={handleShare}
            className="flex flex-col items-center gap-1 group cursor-pointer"
          >
            <div className="w-11 h-11 rounded-full bg-black/50 backdrop-blur-md text-white border border-white/15 hover:bg-white/10 flex items-center justify-center transition-all duration-250">
              <Share2 className="w-5 h-5 group-hover:scale-125 transition-transform" />
            </div>
            <span className="font-mono text-[10px] font-bold text-white drop-shadow">
              {currentFlux.sharesCount || 12}
            </span>
          </button>

          {/* Report / Integrity Fact-Check Action */}
          <button
            onClick={() => setShowReportModal(true)}
            className="flex flex-col items-center gap-1 group cursor-pointer"
            title="Flag / Report Fake or Devotional Forward"
          >
            <div className="w-11 h-11 rounded-full bg-black/50 backdrop-blur-md text-amber-400 border border-amber-500/20 hover:bg-rose-500/20 hover:text-rose-300 hover:border-rose-500/40 flex items-center justify-center transition-all duration-250">
              <ShieldAlert className="w-5 h-5 group-hover:scale-125 transition-transform" />
            </div>
            <span className="font-mono text-[9px] font-bold text-zinc-400 drop-shadow">
              Audit
            </span>
          </button>

          {/* Spinning Vinyl Audio Disc */}
          <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-zinc-800 to-black p-1 border border-white/20 flex items-center justify-center animate-spin" style={{ animationDuration: '4s' }}>
            <Disc3 className="w-6 h-6 text-zen-violet" />
          </div>
        </div>

        {/* ── BOTTOM CAPTION & AUDIO TRACK MARQUEE ── */}
        <div className="relative z-20 p-5 space-y-2.5 max-w-[78%]">
          {/* Author info */}
          <div
            onClick={() => openUserProfile(currentFlux.authorUsername)}
            className="flex items-center gap-2 cursor-pointer group"
          >
            <span className="font-display font-bold text-sm text-white group-hover:text-zen-violet transition drop-shadow">
              @{currentFlux.authorUsername}
            </span>
            <span className="text-[10px] font-mono px-2 py-0.5 rounded-md bg-white/10 backdrop-blur-sm border border-white/10 text-neutral-300">
              MEMBER
            </span>
          </div>

          {/* Caption */}
          <p 
            className="text-xs text-white/95 leading-relaxed drop-shadow line-clamp-3"
            style={getStoryFontStyle(currentFlux.fontStyle)}
          >
            {currentFlux.caption}
          </p>

          {/* Compulsory Verified Source Citation */}
          {currentFlux.sourceName && (
            <div className="flex items-center gap-1.5 pt-0.5">
              <a
                href={currentFlux.sourceUrl || '#'}
                target="_blank"
                rel="noopener noreferrer"
                onClick={(e) => e.stopPropagation()}
                className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-black/60 backdrop-blur-md border border-cyan-500/40 text-cyan-300 text-[10px] font-mono hover:bg-cyan-500/10 hover:text-white transition"
              >
                <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 animate-pulse" />
                <span className="truncate max-w-[200px]">Source: {currentFlux.sourceName}</span>
                <ExternalLink className="w-2.5 h-2.5 shrink-0" />
              </a>
            </div>
          )}

          {/* Music Track Marquee */}
          <div className="flex items-center gap-2 text-[10px] font-mono text-zinc-300 bg-black/40 backdrop-blur-md px-3 py-1 rounded-full border border-white/10 w-fit">
            <Music className="w-3 h-3 text-zen-violet animate-pulse" />
            <span className="truncate max-w-[180px]">{currentFlux.musicTitle}</span>
          </div>
        </div>

        {/* ── COMMENTS DRAWER ── */}
        <AnimatePresence>
          {showCommentsDrawer && (
            <motion.div
              initial={{ opacity: 0, y: 150 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 150 }}
              className="absolute inset-x-0 bottom-0 h-[65%] bg-[#090a0f]/95 backdrop-blur-2xl border-t border-white/15 rounded-t-[32px] z-40 p-4 flex flex-col justify-between"
            >
              {/* Header */}
              <div className="flex items-center justify-between pb-3 border-b border-white/10">
                <h4 className="font-display font-bold text-xs text-white flex items-center gap-1.5">
                  <MessageCircle className="w-4 h-4 text-zen-violet" />
                  <span>Comments ({comments.length})</span>
                </h4>
                <button
                  onClick={() => setShowCommentsDrawer(false)}
                  className="p-1 rounded-full text-neutral-400 hover:text-white"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              {/* Comment list */}
              <div className="flex-1 overflow-y-auto py-3 space-y-3">
                {comments.length === 0 ? (
                  <div className="text-center py-8 text-xs text-neutral-500 font-mono">
                    No comments yet. Start the discourse!
                  </div>
                ) : (
                  comments.map((c) => (
                    <div key={c.id} className="flex items-start gap-2.5">
                      <div className="w-7 h-7 rounded-full bg-white/10 border border-white/10 flex items-center justify-center text-[10px] font-bold text-white uppercase shrink-0">
                        {c.authorName?.[0]?.toUpperCase() || 'U'}
                      </div>
                      <div className="flex-1 text-xs">
                        <span className="font-bold text-white mr-1.5">@{c.authorUsername}</span>
                        <span className="text-neutral-300">{c.content}</span>
                      </div>
                    </div>
                  ))
                )}
              </div>

              {/* Add comment input */}
              <form onSubmit={handleAddComment} className="pt-2 border-t border-white/10 flex items-center gap-2">
                <input
                  type="text"
                  value={commentInput}
                  onChange={(e) => setCommentInput(e.target.value)}
                  placeholder="Add a sovereign comment..."
                  className="flex-1 bg-white/5 border border-white/15 rounded-2xl px-3.5 py-2 text-xs text-white placeholder-neutral-400 focus:outline-none focus:border-white/30"
                />
                <button
                  type="submit"
                  className="p-2 rounded-2xl bg-white text-black hover:bg-neutral-200 transition cursor-pointer"
                >
                  <Send className="w-3.5 h-3.5" />
                </button>
              </form>
            </motion.div>
          )}
        </AnimatePresence>

        {/* ── FACT-CHECK AUDIT & PURGE MODAL ── */}
        <AnimatePresence>
          {showReportModal && currentFlux && (
            <div 
              className="fixed inset-0 z-50 bg-black/85 backdrop-blur-md flex items-center justify-center p-4"
              onClick={() => setShowReportModal(false)}
            >
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                onClick={(e) => e.stopPropagation()}
                className="w-full max-w-md bg-[#0c0d12] border border-white/15 rounded-3xl p-6 space-y-4 shadow-2xl text-white"
              >
                <div className="flex items-center justify-between pb-3 border-b border-white/10">
                  <div className="flex items-center gap-2">
                    <ShieldAlert className="w-5 h-5 text-amber-400" />
                    <h3 className="font-bold text-sm">Integrity Audit &amp; Fact-Check</h3>
                  </div>
                  <button
                    onClick={() => setShowReportModal(false)}
                    className="text-zinc-400 hover:text-white p-1 cursor-pointer"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>

                <div className="p-3 rounded-2xl bg-white/[0.03] border border-white/10 space-y-1 text-xs">
                  <p className="text-zinc-400">Dispatch Author: <strong className="text-white">@{currentFlux.authorUsername}</strong></p>
                  <p className="text-zinc-400">Verified Source: <strong className="text-cyan-300">{currentFlux.sourceName || 'Unspecified'}</strong></p>
                </div>

                <div className="space-y-2">
                  <label className="text-xs font-semibold text-zinc-300 block">Select Violation Category:</label>
                  {[
                    'Religious Forward / Devotional Clickbait (Prohibited)',
                    'Fake Political Propaganda / Unverified Claim',
                    'Sensationalist Conspiracy / Fake News',
                    'Broken / Fake Citation Link'
                  ].map((reason) => (
                    <button
                      key={reason}
                      type="button"
                      onClick={() => setReportReason(reason)}
                      className={`w-full text-left px-3.5 py-2.5 rounded-xl text-xs font-medium border transition cursor-pointer flex items-center justify-between ${
                        reportReason === reason
                          ? 'bg-rose-500/15 border-rose-500/40 text-rose-200'
                          : 'bg-white/[0.03] border-white/10 text-zinc-400 hover:text-white hover:bg-white/5'
                      }`}
                    >
                      <span>{reason}</span>
                      {reportReason === reason && <Check className="w-3.5 h-3.5 text-rose-400" />}
                    </button>
                  ))}
                </div>

                <div className="pt-2 flex items-center gap-3">
                  <button
                    type="button"
                    onClick={() => setShowReportModal(false)}
                    className="flex-1 py-2.5 rounded-xl bg-white/10 hover:bg-white/15 text-xs font-semibold text-zinc-300 transition cursor-pointer"
                  >
                    Cancel
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      purgeFakeFlux(currentFlux.id, reportReason);
                      setShowReportModal(false);
                      setToastMessage('⚠️ Dispatch purged from feed for Integrity Violation');
                      setTimeout(() => setToastMessage(null), 3000);
                    }}
                    className="flex-1 py-2.5 rounded-xl bg-rose-600 hover:bg-rose-500 text-xs font-bold text-white transition flex items-center justify-center gap-1.5 shadow-lg cursor-pointer"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                    <span>Purge Dispatch</span>
                  </button>
                </div>
              </motion.div>
            </div>
          )}
        </AnimatePresence>

        {/* ── 5-MINUTE DIPLOMATIC SPARKS DRAWER (DIRECTLY ON FLUX FEED) ── */}
        <AnimatePresence>
          {showSparksDrawer && (
            <div 
              onClick={() => setShowSparksDrawer(false)}
              className="absolute inset-0 z-40 bg-black/85 backdrop-blur-xl flex flex-col justify-end overflow-hidden"
            >
              <motion.div
                initial={{ y: '100%' }}
                animate={{ y: 0 }}
                exit={{ y: '100%' }}
                transition={{ type: 'spring', damping: 26, stiffness: 280 }}
                onClick={(e) => e.stopPropagation()}
                className="w-full max-h-[85%] bg-[#0c0e14] border-t border-amber-400/30 rounded-t-3xl flex flex-col overflow-hidden shadow-2xl"
              >
                {/* Drawer Header */}
                <div className="p-4 border-b border-white/10 flex items-center justify-between bg-black/40">
                  <div className="flex items-center gap-2">
                    <div className="p-1.5 rounded-xl bg-amber-400/20 text-amber-300">
                      <Zap className="w-4 h-4 fill-amber-400" />
                    </div>
                    <div>
                      <h4 className="font-display font-bold text-sm text-white flex items-center gap-1.5">
                        <span>ZEN.SPARKS</span>
                        <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-amber-400/20 text-amber-300 border border-amber-400/40">
                          5-MIN READS
                        </span>
                      </h4>
                      <p className="text-[11px] font-mono text-neutral-400">
                        Fast sovereign dossiers &amp; policy briefs on the FLUX feed
                      </p>
                    </div>
                  </div>

                  <button
                    onClick={() => setShowSparksDrawer(false)}
                    className="p-1.5 rounded-full bg-white/5 hover:bg-white/10 text-neutral-400 hover:text-white transition cursor-pointer"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>

                {/* Sparks List */}
                <div className="p-4 overflow-y-auto space-y-4 max-h-[calc(85vh-80px)]">
                  {INITIAL_SPARKS.map((spark) => (
                    <ZenSparkCard
                      key={spark.id}
                      spark={spark}
                      onBookmark={() => {
                        setToastMessage('Saved to Treaty Ledger');
                        setTimeout(() => setToastMessage(null), 2500);
                      }}
                      onOpenFlex={(sp) => {
                        setActiveFlexItem({
                          id: sp.id,
                          type: 'spark',
                          title: sp.title,
                          content: sp.summary,
                          authorName: sp.authorName,
                          authorUsername: sp.authorUsername,
                          authorAvatar: sp.authorAvatar,
                          createdAt: sp.createdAt,
                          likes: sp.likes,
                          category: sp.category,
                          readingTimeMinutes: sp.readingTimeMinutes,
                          keyTakeaways: sp.keyTakeaways,
                          fullDossier: sp.fullDossier,
                          treatyClauseReference: sp.treatyClauseReference,
                          threadSegments: sp.fullDossier.split(/\n\n+/).filter((s) => s.trim().length > 0),
                        });
                      }}
                    />
                  ))}
                </div>
              </motion.div>
            </div>
          )}
        </AnimatePresence>
      </div>

      {/* ── Immersive Flex Reader for Sparks on FLUX ── */}
      <ZenFlexReaderModal
        isOpen={Boolean(activeFlexItem)}
        onClose={() => setActiveFlexItem(null)}
        item={activeFlexItem}
        onLike={() => {
          setToastMessage('Spark endorsed on diplomatic wire');
          setTimeout(() => setToastMessage(null), 2500);
        }}
        onBookmark={() => {
          setToastMessage('Spark bookmarked');
          setTimeout(() => setToastMessage(null), 2500);
        }}
        isLiked={false}
        isSaved={false}
      />

      {/* Toast Notification */}
      <AnimatePresence>
        {toastMessage && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="fixed top-16 left-1/2 -translate-x-1/2 z-50 px-4 py-2 rounded-full bg-rose-600 text-white font-mono text-xs font-bold shadow-2xl flex items-center gap-2"
          >
            <ShieldAlert className="w-4 h-4 text-white" />
            <span>{toastMessage}</span>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ── EXTERNAL DESKTOP UP/DOWN NAVIGATION CONTROLS ── */}
      <div className="hidden lg:flex flex-col gap-3 absolute -right-14 top-1/2 -translate-y-1/2">
        <button
          onClick={handlePrev}
          className="w-10 h-10 rounded-full bg-white/5 border border-white/10 hover:bg-white/15 text-white flex items-center justify-center transition cursor-pointer"
          title="Previous FLUX (Up Arrow)"
        >
          <ChevronUp className="w-5 h-5" />
        </button>
        <button
          onClick={handleNext}
          className="w-10 h-10 rounded-full bg-white/5 border border-white/10 hover:bg-white/15 text-white flex items-center justify-center transition cursor-pointer"
          title="Next FLUX (Down Arrow)"
        >
          <ChevronDown className="w-5 h-5" />
        </button>
      </div>
    </div>
  );
}
