'use client';

import React, { useState, useEffect } from 'react';
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
  Crown,
  MessageSquareShare,
  Music,
  Scale,
  Vote,
  FileText,
  ChevronDown,
  ChevronUp,
  Send,
  X
} from 'lucide-react';
import { PulsePost } from '@/types/pulse';
import { useZenPulse } from '@/context/ZenPulsePlatformContext';
import { useGlobalAudio } from '@/components/audio/GlobalAudioContext';
import { ImageGrid } from './ImageGrid';
import { getStoryFontStyle } from '@/lib/storyFonts';
import { ShareToChatModal } from './ShareToChatModal';

interface PostCardProps {
  post: PulsePost;
}

export function PostCard({ post }: PostCardProps) {
  const {
    likePost, repostPost, deletePost,
    setActiveView, setActivePostId,
    currentUserId, currentUserName, currentUserUsername
  } = useZenPulse();

  const { currentTrack, isPlaying: isGlobalAudioPlaying, toggleTrack } = useGlobalAudio();

  const [copied, setCopied] = useState(false);
  const [bookmarked, setBookmarked] = useState(false);
  const [likeBurst, setLikeBurst] = useState(false);
  const [isPlayingAudio, setIsPlayingAudio] = useState(false);
  const [audioProgress, setAudioProgress] = useState(0);
  const [showShareToChat, setShowShareToChat] = useState(false);
  const [showAiSummary, setShowAiSummary] = useState(false);
  const [showInlineReplies, setShowInlineReplies] = useState(false);
  const [replyInput, setReplyInput] = useState('');
  const [localReplies, setLocalReplies] = useState<{ id: string; author: string; text: string; time: string }[]>([]);

  // Interactive Ballot State
  const isDebateOrTreaty = 
    (post.tags && post.tags.some(t => /debate|resolution|treaty|ballot|caucus/i.test(t))) ||
    post.content.toLowerCase().includes('resolution') ||
    post.content.toLowerCase().includes('treaty') ||
    post.content.toLowerCase().includes('debate motion');

  const [userVote, setUserVote] = useState<'aye' | 'nay' | 'abstain' | null>(null);
  const [voteCounts, setVoteCounts] = useState({ aye: 18, nay: 5, abstain: 3 });

  // Load vote from localStorage on mount
  useEffect(() => {
    try {
      const stored = localStorage.getItem(`zenvitra_vote_${post.id}`);
      if (stored === 'aye' || stored === 'nay' || stored === 'abstain') {
        setUserVote(stored);
      }
    } catch {}
  }, [post.id]);

  const handleCastVote = (vote: 'aye' | 'nay' | 'abstain', e: React.MouseEvent) => {
    e.stopPropagation();
    if (userVote === vote) return;
    
    setVoteCounts((prev) => {
      const updated = { ...prev };
      if (userVote) updated[userVote] = Math.max(0, updated[userVote] - 1);
      updated[vote] += 1;
      return updated;
    });

    setUserVote(vote);
    try {
      localStorage.setItem(`zenvitra_vote_${post.id}`, vote);
    } catch {}
  };

  const totalVotes = voteCounts.aye + voteCounts.nay + voteCounts.abstain;
  const ayePercent = Math.round((voteCounts.aye / totalVotes) * 100);
  const nayPercent = Math.round((voteCounts.nay / totalVotes) * 100);
  const abstainPercent = Math.round((voteCounts.abstain / totalVotes) * 100);

  // Audio Playback Timer Simulation
  useEffect(() => {
    let interval: any;
    if (isPlayingAudio) {
      interval = setInterval(() => {
        setAudioProgress((prev) => {
          if (prev >= 100) {
            setIsPlayingAudio(false);
            return 0;
          }
          return prev + 4;
        });
      }, 500);
    }
    return () => clearInterval(interval);
  }, [isPlayingAudio]);

  const isCurrentSongPlaying = isGlobalAudioPlaying && currentTrack?.title === post.songTitle;
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

  const handleAddInlineReply = (e: React.FormEvent) => {
    e.preventDefault();
    if (!replyInput.trim()) return;
    setLocalReplies((prev) => [
      ...prev,
      {
        id: `reply_${Date.now()}`,
        author: currentUserUsername || 'you',
        text: replyInput.trim(),
        time: 'Just now',
      }
    ]);
    setReplyInput('');
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
  const hasVoiceNote = post.content.toLowerCase().includes('voice') || post.content.toLowerCase().includes('audio') || (post.tags && post.tags.includes('#audio'));

  return (
    <article 
      id={`post-${post.id}`}
      className="group relative rounded-[1.75rem] p-5 sm:p-6 mb-4.5 bg-gradient-to-b from-[#0f121a]/90 via-[#080a10]/95 to-[#040507] border border-white/10 hover:border-cyan-500/30 transition-all duration-300 shadow-[0_15px_40px_rgba(0,0,0,0.7)] hover:shadow-[0_20px_60px_rgba(0,0,0,0.95),0_0_35px_rgba(6,182,212,0.08)]"
    >
      {/* Top subtle ambient glow line */}
      <div className="absolute top-0 left-8 right-8 h-[1.5px] bg-gradient-to-r from-transparent via-cyan-400/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none" />

      {/* Repost Indicator */}
      {post.isRepost && (
        <div className="flex items-center gap-2 text-xs font-sans font-semibold text-cyan-300 mb-3.5 pl-12 bg-cyan-950/30 py-1.5 px-4 rounded-xl border border-cyan-500/20 w-fit shadow-sm">
          <Repeat className="w-3.5 h-3.5 text-cyan-400" />
          <span><strong className="text-white">{post.repostedByName}</strong> amplified this dispatch</span>
        </div>
      )}

      <div className="flex gap-3.5 sm:gap-4">
        {/* Avatar */}
        <div className="relative shrink-0">
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-white/10 to-white/5 border border-white/15 flex items-center justify-center font-display font-black text-white text-lg shadow-md group-hover:border-cyan-400/30 transition-all">
            {post.authorName?.[0]?.toUpperCase() || 'U'}
          </div>
          <div className="absolute -bottom-1 -right-1 w-4 h-4 rounded-full bg-emerald-400 border-2 border-[#06080c] flex items-center justify-center shadow-md">
            <div className="w-1.5 h-1.5 rounded-full bg-white animate-ping" />
          </div>
        </div>

        <div className="flex-1 min-w-0">
          {/* Author Header */}
          <div className="flex items-start justify-between gap-2">
            <div className="flex flex-wrap items-center gap-x-2 gap-y-1 min-w-0">
              <span className="font-display font-black text-base text-white hover:text-cyan-200 transition cursor-pointer flex items-center gap-1.5" onClick={openDetail}>
                {post.authorName}
                {(post.authorUsername.toLowerCase() === 'yuveer' || post.authorUsername.toLowerCase() === 'founder' || (post as any).isVerified || (post as any).is_verified) && (
                  <CheckCircle2 className="w-4 h-4 text-cyan-400 drop-shadow-[0_0_6px_rgba(6,182,212,0.8)] inline-block" />
                )}
              </span>
              <div className="flex flex-wrap items-center gap-1.5">
                <span className="font-sans font-medium text-xs text-neutral-400">@{post.authorUsername}</span>
                <span className={`px-2.5 py-0.5 rounded-full border text-[10px] font-sans font-bold tracking-wide ${badge.color}`}>
                  {badge.text}
                </span>
                {(post as any).feedReason === 'following' && (
                  <span className="px-2 py-0.5 rounded-full bg-blue-500/10 border border-blue-500/30 text-[10px] font-sans text-blue-300 font-semibold flex items-center gap-1">
                    👥 Following
                  </span>
                )}
                {(post as any).feedReason === 'fresh' && (
                  <span className="px-2 py-0.5 rounded-full bg-emerald-500/15 border border-emerald-500/30 text-[10px] font-sans text-emerald-300 font-bold flex items-center gap-1 shadow-[0_0_8px_rgba(16,185,129,0.3)]">
                    ⚡ Fresh
                  </span>
                )}
                {(post as any).feedReason === 'trending' && (
                  <span className="px-2 py-0.5 rounded-full bg-amber-500/10 border border-amber-500/30 text-[10px] font-sans text-amber-300 font-semibold flex items-center gap-1">
                    🔥 Trending
                  </span>
                )}
              </div>
            </div>

            <div className="flex items-center gap-1 shrink-0">
              <span className="font-sans text-xs text-neutral-400 font-medium">{formatTime(post.createdAt)}</span>
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
              className="text-[14px] sm:text-[15px] text-neutral-100 leading-relaxed whitespace-pre-wrap break-words selection:bg-cyan-500/30 font-sans"
              style={getStoryFontStyle(post.fontStyle)}
            >
              {post.content}
            </p>

            {/* AI Executive Summary Card */}
            {showAiSummary && (
              <div 
                onClick={(e) => e.stopPropagation()}
                className="mt-3.5 p-4 rounded-2xl bg-gradient-to-r from-cyan-950/30 via-[#0a0d18] to-purple-950/20 border border-cyan-500/30 space-y-2.5 backdrop-blur-xl animate-fade-in"
              >
                <div className="flex items-center justify-between border-b border-white/10 pb-2">
                  <div className="flex items-center gap-2 text-xs font-display font-bold text-cyan-300">
                    <Sparkles className="w-3.5 h-3.5 text-cyan-400" />
                    <span>CHAMBER EXECUTIVE BRIEFING</span>
                  </div>
                  <span className="text-[10px] font-sans text-neutral-400">Synthesized by ZenAI</span>
                </div>
                <div className="space-y-1.5 text-xs text-neutral-300 font-sans leading-relaxed">
                  <p className="flex items-start gap-2">
                    <span className="text-amber-400 font-bold shrink-0">📌 Controversy:</span>
                    <span>Direct youth consensus required on multilateral policy allocations and decentralized treasury oversight.</span>
                  </p>
                  <p className="flex items-start gap-2">
                    <span className="text-emerald-400 font-bold shrink-0">⚖️ Resolution:</span>
                    <span>Formalize 100% open audits and binding delegate voting mechanisms across all regional caucuses.</span>
                  </p>
                  <p className="flex items-start gap-2">
                    <span className="text-cyan-400 font-bold shrink-0">🌐 Civic Impact:</span>
                    <span>High velocity mandate with actionable quorum thresholds.</span>
                  </p>
                </div>
              </div>
            )}

            {/* Interactive Resolution / Debate Ballot */}
            {isDebateOrTreaty && (
              <div 
                onClick={(e) => e.stopPropagation()}
                className="mt-4 p-4 rounded-2xl bg-[#070912]/90 border border-rose-500/25 space-y-3.5 shadow-lg relative overflow-hidden"
              >
                <div className="flex items-center justify-between border-b border-white/10 pb-2.5">
                  <div className="flex items-center gap-2">
                    <Scale className="w-4 h-4 text-rose-400" />
                    <span className="font-display font-bold text-xs uppercase tracking-wider text-white">
                      Official Chamber Ballot
                    </span>
                  </div>
                  <div className="flex items-center gap-1.5 text-[11px] font-sans font-semibold text-rose-300 bg-rose-500/10 border border-rose-500/30 px-2.5 py-0.5 rounded-full">
                    <Vote className="w-3 h-3" />
                    <span>{totalVotes} Votes Cast</span>
                  </div>
                </div>

                {/* Voting Action Buttons */}
                <div className="grid grid-cols-3 gap-2">
                  <button
                    type="button"
                    onClick={(e) => handleCastVote('aye', e)}
                    className={`py-2 px-3 rounded-xl border text-xs font-sans font-bold flex items-center justify-center gap-1.5 transition-all cursor-pointer ${
                      userVote === 'aye'
                        ? 'bg-emerald-500 text-black border-emerald-400 shadow-[0_0_15px_rgba(16,185,129,0.4)] scale-[1.02]'
                        : 'bg-emerald-950/20 hover:bg-emerald-950/40 border-emerald-500/30 text-emerald-300'
                    }`}
                  >
                    <Check className="w-3.5 h-3.5 stroke-[3]" />
                    <span>Aye ({ayePercent}%)</span>
                  </button>

                  <button
                    type="button"
                    onClick={(e) => handleCastVote('nay', e)}
                    className={`py-2 px-3 rounded-xl border text-xs font-sans font-bold flex items-center justify-center gap-1.5 transition-all cursor-pointer ${
                      userVote === 'nay'
                        ? 'bg-rose-500 text-white border-rose-400 shadow-[0_0_15px_rgba(244,63,94,0.4)] scale-[1.02]'
                        : 'bg-rose-950/20 hover:bg-rose-950/40 border-rose-500/30 text-rose-300'
                    }`}
                  >
                    <X className="w-3.5 h-3.5 stroke-[3]" />
                    <span>Nay ({nayPercent}%)</span>
                  </button>

                  <button
                    type="button"
                    onClick={(e) => handleCastVote('abstain', e)}
                    className={`py-2 px-3 rounded-xl border text-xs font-sans font-bold flex items-center justify-center gap-1.5 transition-all cursor-pointer ${
                      userVote === 'abstain'
                        ? 'bg-zinc-300 text-black border-white shadow-md scale-[1.02]'
                        : 'bg-white/[0.04] hover:bg-white/[0.08] border-white/10 text-neutral-300'
                    }`}
                  >
                    <span>Abstain ({abstainPercent}%)</span>
                  </button>
                </div>

                {/* Animated Vote Breakdown Bar */}
                <div className="space-y-1">
                  <div className="w-full h-2 rounded-full bg-white/10 overflow-hidden flex">
                    <div 
                      className="h-full bg-emerald-500 transition-all duration-500" 
                      style={{ width: `${ayePercent}%` }} 
                      title={`Support: ${ayePercent}%`}
                    />
                    <div 
                      className="h-full bg-rose-500 transition-all duration-500" 
                      style={{ width: `${nayPercent}%` }} 
                      title={`Dissent: ${nayPercent}%`}
                    />
                    <div 
                      className="h-full bg-neutral-500 transition-all duration-500" 
                      style={{ width: `${abstainPercent}%` }} 
                      title={`Abstain: ${abstainPercent}%`}
                    />
                  </div>
                  <div className="flex items-center justify-between text-[10px] font-sans text-neutral-400 pt-0.5">
                    <span className="text-emerald-400 font-semibold">{ayePercent}% Support</span>
                    <span className="text-neutral-400">{abstainPercent}% Neutral</span>
                    <span className="text-rose-400 font-semibold">{nayPercent}% Dissent</span>
                  </div>
                </div>
              </div>
            )}

            {/* Voice Floor Speech Waveform Player */}
            {hasVoiceNote && (
              <div
                onClick={(e) => { e.stopPropagation(); setIsPlayingAudio(!isPlayingAudio); }}
                className="mt-3.5 p-3 sm:p-3.5 rounded-2xl bg-white/[0.03] border border-white/10 hover:border-cyan-400/40 flex items-center justify-between gap-3 transition-all cursor-pointer shadow-inner"
              >
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-xl bg-gradient-to-r from-cyan-400 to-blue-500 text-black flex items-center justify-center shadow-[0_0_12px_rgba(6,182,212,0.3)]">
                    {isPlayingAudio ? <Pause className="w-4 h-4 fill-current" /> : <Play className="w-4 h-4 fill-current ml-0.5" />}
                  </div>
                  <div>
                    <span className="font-sans font-bold text-xs text-white block">Floor Voice Dispatch</span>
                    <span className="font-sans text-[11px] text-cyan-300">
                      {isPlayingAudio ? `${Math.round(audioProgress * 0.6)}s / 60s Playing` : '0:24 • Live Audio Relay'}
                    </span>
                  </div>
                </div>

                {/* Animated Waveform Frequency Bars */}
                <div className="flex items-end gap-1 h-6 pr-2">
                  {[25, 60, 40, 90, 70, 100, 45, 80, 50, 95, 30, 85, 65, 40, 75].map((h, i) => (
                    <div
                      key={i}
                      className={`w-1 rounded-full transition-all duration-200 ${
                        isPlayingAudio ? 'bg-gradient-to-t from-cyan-400 to-blue-500 animate-pulse' : 'bg-white/20'
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

            {/* Attached Music Player */}
            {(post.songTitle || post.songAudioUrl) && (
              <div
                onClick={(e) => {
                  e.stopPropagation();
                  toggleTrack({
                    title: post.songTitle || 'Attached Track',
                    artist: post.songArtist || 'Unknown Artist',
                    audioUrl: post.songAudioUrl,
                    videoId: post.songVideoId,
                    startTime: post.songStartTime || 0,
                    endTime: post.songEndTime,
                    frameDuration: post.songFrameDuration || 60,
                    source: 'YouTube Music'
                  });
                }}
                className="mt-3.5 inline-flex items-center gap-2.5 px-3.5 py-1.5 rounded-full bg-black/70 border border-white/15 hover:border-cyan-400/60 transition-all cursor-pointer group shadow-sm"
              >
                <div className={`w-5 h-5 rounded-full bg-gradient-to-tr from-rose-500 to-amber-500 flex items-center justify-center text-white ${isCurrentSongPlaying ? 'animate-spin' : ''}`}>
                  <Music className="w-2.5 h-2.5" />
                </div>
                <span className="text-xs font-bold text-white font-sans group-hover:text-cyan-300 transition-colors">
                  {post.songTitle}
                </span>
                {post.songArtist && (
                  <span className="text-xs text-zinc-400 font-sans">
                    • {post.songArtist}
                  </span>
                )}
                <div className="ml-1 text-cyan-400">
                  {isCurrentSongPlaying ? (
                    <Pause className="w-3.5 h-3.5" />
                  ) : (
                    <Play className="w-3.5 h-3.5 fill-current" />
                  )}
                </div>
              </div>
            )}

            {/* Images Grid */}
            {post.images.length > 0 && (
              <div className="mt-3.5" onClick={(e) => e.stopPropagation()}>
                <ImageGrid images={post.images} />
              </div>
            )}

            {/* Verified Source Citation Pill */}
            {(post.sourceName || (post.citations && post.citations.length > 0)) && (
              <div className="mt-3.5 flex flex-wrap items-center gap-2" onClick={(e) => e.stopPropagation()}>
                {post.sourceName && (
                  <a
                    href={post.sourceUrl || '#'}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-cyan-950/40 hover:bg-cyan-900/50 border border-cyan-500/40 text-cyan-300 text-xs font-sans transition shadow-[0_0_12px_rgba(6,182,212,0.15)] group/source"
                  >
                    <span className="w-2 h-2 rounded-full bg-cyan-400 animate-pulse" />
                    <span className="font-semibold">Source: {post.sourceName}</span>
                    <ExternalLink className="w-3 h-3 text-cyan-400 group-hover/source:translate-x-0.5 group-hover/source:-translate-y-0.5 transition-transform" />
                  </a>
                )}
              </div>
            )}
          </div>

          {/* Action Bar */}
          <div className="flex items-center justify-between mt-4 pt-3.5 border-t border-white/[0.08] -mx-1" onClick={(e) => e.stopPropagation()}>
            <div className="flex items-center gap-1.5 sm:gap-2">
              {/* Reply Button */}
              <button
                onClick={() => setShowInlineReplies(!showInlineReplies)}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-neutral-400 hover:text-cyan-400 hover:bg-cyan-500/10 transition cursor-pointer font-sans font-semibold text-xs group/btn active:scale-95"
              >
                <MessageCircle className="w-4 h-4 group-hover/btn:scale-110 transition-transform" />
                <span>{(post.replyCount || 0) + localReplies.length}</span>
              </button>

              {/* Repost Button */}
              <button
                onClick={() => repostPost(post.isRepost && post.originalPostId ? post.originalPostId : post.id)}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl transition cursor-pointer font-sans font-semibold text-xs group/btn active:scale-95 ${
                  hasReposted ? 'text-emerald-400 bg-emerald-500/10 border border-emerald-500/20' : 'text-neutral-400 hover:text-emerald-400 hover:bg-emerald-500/10'
                }`}
              >
                <Repeat2 className="w-4 h-4 group-hover/btn:rotate-180 transition-transform duration-500" />
                <span>{post.reposts || 0}</span>
              </button>

              {/* Like Button with Burst */}
              <button
                onClick={handleLike}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl transition cursor-pointer font-sans font-semibold text-xs group/btn relative active:scale-95 ${
                  hasLiked ? 'text-rose-400 bg-rose-500/10 border border-rose-500/20' : 'text-neutral-400 hover:text-rose-400 hover:bg-rose-500/10'
                }`}
              >
                <Heart className={`w-4 h-4 group-hover/btn:scale-125 transition-transform ${hasLiked ? 'fill-rose-400' : ''} ${likeBurst ? 'scale-150 animate-bounce' : ''}`} />
                <span>{post.likes || 0}</span>
              </button>

              {/* AI Brief Me Toggle */}
              <button
                type="button"
                onClick={() => setShowAiSummary(!showAiSummary)}
                className={`flex items-center gap-1 px-2.5 py-1.5 rounded-xl text-xs font-sans font-semibold transition cursor-pointer ${
                  showAiSummary
                    ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/30'
                    : 'text-neutral-400 hover:text-cyan-400 hover:bg-white/[0.04]'
                }`}
                title="AI Executive Summary"
              >
                <Sparkles className="w-3.5 h-3.5 text-cyan-400" />
                <span className="hidden sm:inline">Brief</span>
              </button>
            </div>

            <div className="flex items-center gap-1">
              {/* Send to ZEN.CHAT */}
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  setShowShareToChat(true);
                }}
                className="p-2 rounded-xl text-neutral-400 hover:text-cyan-400 hover:bg-cyan-500/10 transition cursor-pointer active:scale-90"
                title="Send to ZEN.CHAT"
              >
                <MessageSquareShare className="w-4 h-4" />
              </button>

              {/* Bookmark */}
              <button
                onClick={() => setBookmarked(!bookmarked)}
                className={`p-2 rounded-xl transition cursor-pointer active:scale-90 ${
                  bookmarked ? 'text-amber-400 bg-amber-500/10' : 'text-neutral-400 hover:text-amber-400 hover:bg-amber-500/10'
                }`}
                title="Save dispatch"
              >
                <Bookmark className={`w-4 h-4 ${bookmarked ? 'fill-amber-400' : ''}`} />
              </button>

              {/* Share */}
              <button
                onClick={handleShare}
                className="p-2 rounded-xl text-neutral-400 hover:text-cyan-400 hover:bg-cyan-500/10 transition cursor-pointer relative active:scale-90"
                title="Copy link"
              >
                {copied ? <Check className="w-4 h-4 text-emerald-400" /> : <Share2 className="w-4 h-4" />}
              </button>
            </div>
          </div>

          {/* Inline Debate Replies & Arguments */}
          {showInlineReplies && (
            <div 
              onClick={(e) => e.stopPropagation()}
              className="mt-3 pt-3 border-t border-white/10 space-y-3 animate-fade-in"
            >
              {localReplies.length > 0 && (
                <div className="space-y-2">
                  {localReplies.map((r) => (
                    <div key={r.id} className="p-2.5 rounded-xl bg-white/[0.03] border border-white/10 text-xs font-sans space-y-0.5">
                      <div className="flex items-center justify-between text-neutral-400 text-[11px]">
                        <span className="font-bold text-white">@{r.author}</span>
                        <span>{r.time}</span>
                      </div>
                      <p className="text-neutral-200">{r.text}</p>
                    </div>
                  ))}
                </div>
              )}

              <form onSubmit={handleAddInlineReply} className="flex items-center gap-2">
                <input
                  type="text"
                  value={replyInput}
                  onChange={(e) => setReplyInput(e.target.value)}
                  placeholder="Post your counter-argument or perspective..."
                  className="flex-1 px-3.5 py-2 rounded-xl bg-white/[0.04] border border-white/10 text-xs text-white font-sans placeholder:text-neutral-500 focus:outline-none focus:border-cyan-400/50"
                />
                <button
                  type="submit"
                  disabled={!replyInput.trim()}
                  className="px-3.5 py-2 rounded-xl bg-white text-black font-sans font-bold text-xs hover:bg-neutral-200 transition disabled:opacity-40 cursor-pointer"
                >
                  <Send className="w-3.5 h-3.5" />
                </button>
              </form>
            </div>
          )}
        </div>
      </div>

      <ShareToChatModal
        isOpen={showShareToChat}
        onClose={() => setShowShareToChat(false)}
        post={post}
      />
    </article>
  );
}
