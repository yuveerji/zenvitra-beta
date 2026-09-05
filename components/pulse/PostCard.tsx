'use client';

import React, { useState } from 'react';
import { 
  Heart, 
  MessageCircle, 
  Repeat2, 
  Share2, 
  Trash2, 
  Repeat, 
  ShieldCheck, 
  Bookmark, 
  Sparkles,
  Check,
  Flame,
  Globe2,
  ExternalLink,
  Volume2,
  Play,
  Pause,
  Radio,
  Zap,
  CheckCircle2,
  Crown
} from 'lucide-react';
import { PulsePost } from '@/types/pulse';
import { useZenPulse } from '@/context/ZenPulsePlatformContext';
import { ImageGrid } from './ImageGrid';
import { getStoryFontStyle } from '@/lib/storyFonts';

interface PostCardProps {
  post: PulsePost;
}

export function PostCard({ post }: PostCardProps) {
  const {
    likePost, repostPost, deletePost,
    setActiveView, setActivePostId,
    currentUserId,
  } = useZenPulse();

  const [copied, setCopied] = useState(false);
  const [bookmarked, setBookmarked] = useState(false);
  const [likeBurst, setLikeBurst] = useState(false);
  const [isPlayingAudio, setIsPlayingAudio] = useState(false);

  const hasLiked = post.likedBy.includes(currentUserId);
  const hasReposted = post.repostedBy.includes(currentUserId);
  const isOwn = post.authorId === currentUserId;

  const openDetail = () => {
    const targetId = post.isRepost && post.originalPostId ? post.originalPostId : post.id;
    setActivePostId(targetId);
    setActiveView('post-detail');
  };

  const handleLike = (e: React.MouseEvent) => {
    e.stopPropagation();
    setLikeBurst(true);
    setTimeout(() => setLikeBurst(false), 500);
    likePost(post.isRepost && post.originalPostId ? post.originalPostId : post.id);
  };

  const handleShare = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (typeof navigator !== 'undefined') {
      navigator.clipboard.writeText(`${window.location.origin}/pulse?id=${post.id}`);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const formatTime = (iso: string) => {
    const d = new Date(iso);
    const now = new Date();
    const diffMs = now.getTime() - d.getTime();
    const diffMin = Math.floor(diffMs / 60000);
    if (diffMin < 1) return 'Just now';
    if (diffMin < 60) return `${diffMin}m ago`;
    const diffHr = Math.floor(diffMin / 60);
    if (diffHr < 24) return `${diffHr}h ago`;
    const diffDay = Math.floor(diffHr / 24);
    if (diffDay < 7) return `${diffDay}d ago`;
    return d.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
  };

  // Determine author badge color
  const getBadge = () => {
    if (post.authorUsername.includes('zen') || post.authorUsername.includes('admin')) {
      return { text: 'SOVEREIGN CORE', color: 'bg-cyan-500/10 text-cyan-300 border-cyan-500/30' };
    }
    if (post.authorUsername.includes('mun') || post.authorUsername.includes('writer') || post.authorUsername.includes('press')) {
      return { text: 'VERIFIED WRITER', color: 'bg-violet-500/10 text-violet-300 border-violet-500/30' };
    }
    return { text: 'VERIFIED NODE', color: 'bg-emerald-500/10 text-emerald-300 border-emerald-500/30' };
  };

  const badge = getBadge();
  const hasVoiceNote = post.content.toLowerCase().includes('voice') || post.content.toLowerCase().includes('audio') || post.content.length > 220;

  return (
    <article className="group relative rounded-3xl p-5 sm:p-6 mb-4 card-luxury border border-white/[0.09] hover:border-white/30 transition-all duration-500 shadow-[0_10px_35px_rgba(0,0,0,0.6),0_0_25px_rgba(255,255,255,0.02)] hover:shadow-[0_20px_60px_rgba(0,0,0,0.95),0_0_45px_rgba(255,255,255,0.08)]">
      {/* Top subtle ambient glow line */}
      <div className="absolute top-0 left-8 right-8 h-[1.5px] bg-gradient-to-r from-transparent via-cyan-400/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

      {/* Repost Indicator */}
      {post.isRepost && (
        <div className="flex items-center gap-2 text-[11px] font-mono text-cyan-300 mb-3 pl-12 bg-cyan-950/30 py-1 px-3.5 rounded-xl border border-cyan-500/20 w-fit shadow-sm">
          <Repeat className="w-3.5 h-3.5 text-cyan-400" />
          <span><strong className="text-white">{post.repostedByName}</strong> amplified this dispatch</span>
        </div>
      )}

      <div className="flex gap-3.5 sm:gap-4">
        {/* Avatar */}
        <div className="relative shrink-0">
          <div className="w-12 h-12 rounded-2xl bg-white/[0.05] border border-white/15 flex items-center justify-center font-display font-bold text-white text-lg transition-all">
            {post.authorName?.[0]?.toUpperCase() || 'U'}
          </div>
          <div className="absolute -bottom-1 -right-1 w-4 h-4 rounded-full bg-emerald-400 border-2 border-[#06080c] flex items-center justify-center">
            <div className="w-1.5 h-1.5 rounded-full bg-white animate-ping" />
          </div>
        </div>

        <div className="flex-1 min-w-0">
          {/* Author Header */}
          <div className="flex items-start justify-between gap-2">
            <div className="flex flex-wrap items-center gap-x-2 gap-y-1 min-w-0">
              <span className="font-display font-bold text-base text-white hover:text-white transition cursor-pointer flex items-center gap-1.5" onClick={openDetail}>
                {post.authorName}
                {(post.authorUsername.toLowerCase() === 'yuveer' || post.authorUsername.toLowerCase() === 'founder' || (post as any).isVerified || (post as any).is_verified) && (
                  <CheckCircle2 className="w-4 h-4 text-cyan-400 drop-shadow-[0_0_6px_rgba(6,182,212,0.8)] inline-block" />
                )}
              </span>
              <div className="flex flex-wrap items-center gap-1.5">
                <span className="font-mono text-xs text-neutral-400">@{post.authorUsername}</span>
                <span className={`px-2.5 py-0.5 rounded-full border text-[9px] font-mono font-bold tracking-wider ${badge.color}`}>
                  {badge.text}
                </span>
                {(post as any).feedReason === 'following' && (
                  <span className="px-2 py-0.5 rounded-full bg-blue-500/10 border border-blue-500/30 text-[9px] font-mono text-blue-300 font-semibold flex items-center gap-1">
                    👥 Following
                  </span>
                )}
                {(post as any).feedReason === 'fresh' && (
                  <span className="px-2 py-0.5 rounded-full bg-emerald-500/15 border border-emerald-500/30 text-[9px] font-mono text-emerald-300 font-bold flex items-center gap-1 shadow-[0_0_8px_rgba(16,185,129,0.3)]">
                    ⚡ Fresh Item
                  </span>
                )}
                {(post as any).feedReason === 'trending' && (
                  <span className="px-2 py-0.5 rounded-full bg-amber-500/10 border border-amber-500/30 text-[9px] font-mono text-amber-300 font-semibold flex items-center gap-1">
                    🔥 Trending
                  </span>
                )}
              </div>
            </div>

            <div className="flex items-center gap-1 shrink-0">
              <span className="font-mono text-[11px] text-neutral-500">{formatTime(post.createdAt)}</span>
              {isOwn && !post.isRepost && (
                <button
                  onClick={(e) => { e.stopPropagation(); deletePost(post.id); }}
                  className="p-1.5 rounded-xl text-neutral-500 hover:text-rose-400 hover:bg-rose-500/10 transition opacity-0 group-hover:opacity-100 cursor-pointer ml-1"
                  title="Delete post"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              )}
            </div>
          </div>

          {/* Post Content */}
          <div className="cursor-pointer mt-3" onClick={openDetail}>
            <p 
              className="text-[14px] sm:text-[15px] text-neutral-100 leading-relaxed whitespace-pre-wrap break-words selection:bg-cyan-500/30"
              style={getStoryFontStyle(post.fontStyle)}
            >
              {post.content}
            </p>

            {/* Optional Voice Note Audio Waveform Player */}
            {hasVoiceNote && (
              <div
                onClick={(e) => { e.stopPropagation(); setIsPlayingAudio(!isPlayingAudio); }}
                className="mt-3.5 p-3 sm:p-3.5 rounded-2xl bg-white/[0.03] border border-white/10 hover:border-white/20 flex items-center justify-between gap-3 transition-all cursor-pointer shadow-inner"
              >
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-xl bg-white text-black flex items-center justify-center">
                    {isPlayingAudio ? <Pause className="w-4 h-4 fill-current" /> : <Play className="w-4 h-4 fill-current ml-0.5" />}
                  </div>
                  <div>
                    <span className="font-mono text-xs font-bold text-white block">AUDIO DISPATCH NOTE</span>
                    <span className="font-mono text-[10px] text-neutral-400">0:24 • 320kbps High Fidelity</span>
                  </div>
                </div>

                {/* Animated Waveform Bars */}
                <div className="flex items-end gap-1 h-6 pr-2">
                  {[25, 60, 40, 90, 70, 100, 45, 80, 50, 95, 30, 85, 65, 40, 75].map((h, i) => (
                    <div
                      key={i}
                      className={`w-1 rounded-full transition-all duration-200 ${
                        isPlayingAudio ? 'bg-cyan-400 animate-pulse' : 'bg-white/20'
                      }`}
                      style={{
                        height: isPlayingAudio ? `${h}%` : '25%',
                        animationDelay: `${i * 80}ms`
                      }}
                    />
                  ))}
                </div>
              </div>
            )}

            {/* Images Grid */}
            {post.images.length > 0 && (
              <div className="mt-3.5" onClick={(e) => e.stopPropagation()}>
                <ImageGrid images={post.images} />
              </div>
            )}

            {/* Verified Source & Political Citation Pill */}
            {(post.sourceName || (post.citations && post.citations.length > 0)) && (
              <div className="mt-3.5 flex flex-wrap items-center gap-2" onClick={(e) => e.stopPropagation()}>
                {post.sourceName && (
                  <a
                    href={post.sourceUrl || '#'}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-cyan-950/40 hover:bg-cyan-900/50 border border-cyan-500/40 text-cyan-300 text-[11px] font-mono transition shadow-[0_0_12px_rgba(6,182,212,0.15)] group/source"
                  >
                    <span className="w-2 h-2 rounded-full bg-cyan-400 animate-pulse" />
                    <span className="font-semibold">Source: {post.sourceName}</span>
                    <ExternalLink className="w-3 h-3 text-cyan-400 group-hover/source:translate-x-0.5 group-hover/source:-translate-y-0.5 transition-transform" />
                  </a>
                )}

                {post.citations && post.citations.map((c) => (
                  <a
                    key={c.id}
                    href={c.archiveUrl || '#'}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-violet-950/40 hover:bg-violet-900/50 border border-violet-500/30 text-violet-300 text-[10px] font-mono transition"
                  >
                    <ShieldCheck className="w-3 h-3 text-violet-400" />
                    <span>{c.institution}: {c.symbolOrId}</span>
                    <ExternalLink className="w-2.5 h-2.5 text-violet-400" />
                  </a>
                ))}
              </div>
            )}
          </div>

          {/* Action Bar */}
          <div className="flex items-center justify-between mt-4 pt-3.5 border-t border-white/[0.06] -mx-1" onClick={(e) => e.stopPropagation()}>
            <div className="flex items-center gap-2 sm:gap-4">
              {/* Reply Button */}
              <button
                onClick={openDetail}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-neutral-400 hover:text-cyan-400 hover:bg-cyan-500/10 transition cursor-pointer font-mono text-xs group/btn"
              >
                <MessageCircle className="w-4 h-4 group-hover/btn:scale-110 transition-transform" />
                <span>{post.replyCount || 0}</span>
              </button>

              {/* Repost Button */}
              <button
                onClick={() => repostPost(post.isRepost && post.originalPostId ? post.originalPostId : post.id)}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl transition cursor-pointer font-mono text-xs group/btn ${
                  hasReposted ? 'text-emerald-400 bg-emerald-500/10 border border-emerald-500/20' : 'text-neutral-400 hover:text-emerald-400 hover:bg-emerald-500/10'
                }`}
              >
                <Repeat2 className="w-4 h-4 group-hover/btn:rotate-180 transition-transform duration-500" />
                <span>{post.reposts || 0}</span>
              </button>

              {/* Like Button with Burst */}
              <button
                onClick={handleLike}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl transition cursor-pointer font-mono text-xs group/btn relative ${
                  hasLiked ? 'text-rose-400 bg-rose-500/10 border border-rose-500/20' : 'text-neutral-400 hover:text-rose-400 hover:bg-rose-500/10'
                }`}
              >
                <Heart className={`w-4 h-4 group-hover/btn:scale-125 transition-transform ${hasLiked ? 'fill-rose-400' : ''} ${likeBurst ? 'scale-150 animate-bounce' : ''}`} />
                <span>{post.likes || 0}</span>
              </button>
            </div>

            <div className="flex items-center gap-1.5">
              {/* Bookmark */}
              <button
                onClick={() => setBookmarked(!bookmarked)}
                className={`p-2 rounded-xl transition cursor-pointer ${
                  bookmarked ? 'text-amber-400 bg-amber-500/10' : 'text-neutral-500 hover:text-amber-400 hover:bg-amber-500/10'
                }`}
                title="Save dispatch"
              >
                <Bookmark className={`w-3.5 h-3.5 ${bookmarked ? 'fill-amber-400' : ''}`} />
              </button>

              {/* Share */}
              <button
                onClick={handleShare}
                className="p-2 rounded-xl text-neutral-500 hover:text-cyan-400 hover:bg-cyan-500/10 transition cursor-pointer relative"
                title="Copy link"
              >
                {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Share2 className="w-3.5 h-3.5" />}
              </button>
            </div>
          </div>
        </div>
      </div>
    </article>
  );
}
