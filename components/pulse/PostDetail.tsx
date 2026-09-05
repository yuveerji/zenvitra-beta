'use client';

import React, { useState } from 'react';
import { 
  ArrowLeft, 
  Send, 
  Heart, 
  Trash2, 
  Share2, 
  Bookmark, 
  Repeat2, 
  MessageCircle, 
  Check, 
  ShieldCheck, 
  Copy,
  EyeOff,
  Flag,
  MoreHorizontal,
  Sparkles,
  ExternalLink,
  Award
} from 'lucide-react';
import { useZenPulse } from '@/context/ZenPulsePlatformContext';
import { ImageGrid } from './ImageGrid';
import { getStoryFontStyle } from '@/lib/storyFonts';

export function PostDetail() {
  const {
    activePostId, getPostById,
    setActiveView, setActivePostId,
    likePost, repostPost, getReplies, addReply, deleteReply, likeReply,
    deletePost,
    currentUserId, currentUserName, currentUserUsername
  } = useZenPulse();

  const [replyText, setReplyText] = useState('');
  const [copied, setCopied] = useState(false);
  const [bookmarked, setBookmarked] = useState(false);
  const [showSettingsMenu, setShowSettingsMenu] = useState(false);

  const post = activePostId ? getPostById(activePostId) : undefined;

  if (!post) {
    return (
      <div className="flex flex-col items-center justify-center py-20 text-center font-sans">
        <div className="w-16 h-16 rounded-3xl bg-white/[0.04] border border-white/10 flex items-center justify-center mb-4">
          <Sparkles className="w-8 h-8 text-neutral-500" />
        </div>
        <p className="text-base font-display font-bold text-white mb-2">Dispatch not found or has expired</p>
        <p className="text-xs font-mono text-neutral-500 mb-6">The sovereign node may have un-routed this message.</p>
        <button
          onClick={() => { setActivePostId(null); setActiveView('feed'); }}
          className="px-5 py-2.5 rounded-2xl bg-white text-black text-xs font-mono font-bold hover:bg-neutral-200 transition cursor-pointer"
        >
          Return to Matrix Feed
        </button>
      </div>
    );
  }

  const hasLiked = post.likedBy.includes(currentUserId);
  const hasReposted = post.repostedBy.includes(currentUserId);
  const isOwn = post.authorId === currentUserId;
  const replies = getReplies(post.id);

  const handleReply = (e: React.FormEvent) => {
    e.preventDefault();
    if (!replyText.trim()) return;
    addReply(post.id, replyText);
    setReplyText('');
  };

  const handleShare = () => {
    if (typeof navigator !== 'undefined') {
      navigator.clipboard.writeText(window.location.href);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const formatTime = (iso: string) => {
    const d = new Date(iso);
    return d.toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' }) +
      ' at ' + d.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  const formatRelative = (iso: string) => {
    const d = new Date(iso);
    const now = new Date();
    const diffMin = Math.floor((now.getTime() - d.getTime()) / 60000);
    if (diffMin < 1) return 'Just now';
    if (diffMin < 60) return `${diffMin}m ago`;
    const diffHr = Math.floor(diffMin / 60);
    if (diffHr < 24) return `${diffHr}h ago`;
    return d.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
  };

  return (
    <div className="max-w-2xl mx-auto font-sans p-2 sm:p-4">
      {/* Top Navigation Bar */}
      <div className="flex items-center justify-between pb-4 border-b border-white/[0.08] mb-4">
        <button
          onClick={() => { setActivePostId(null); setActiveView('feed'); }}
          className="inline-flex items-center gap-2 px-3 py-1.5 rounded-xl bg-white/[0.04] border border-white/10 text-xs font-mono text-neutral-300 hover:text-white hover:bg-white/10 transition cursor-pointer"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>Feed</span>
        </button>

        <div className="flex items-center gap-1">
          <span className="text-[10px] font-mono uppercase tracking-widest text-cyan-400 bg-cyan-950/30 px-2.5 py-1 rounded-full border border-cyan-500/20">
            DISPATCH THREAD
          </span>
        </div>
      </div>

      {/* Main Post Card */}
      <article className="rounded-3xl p-6 sm:p-8 card-luxury border border-white/15 shadow-[0_0_50px_rgba(0,0,0,0.5)] mb-6">
        {/* Author Details */}
        <div className="flex items-center justify-between gap-4 mb-5">
          <div className="flex items-center gap-3.5">
            <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-cyan-400 via-violet-500 to-rose-500 p-0.5 shadow-md">
              <div className="w-full h-full rounded-[14px] bg-[#06080c] flex items-center justify-center font-display font-bold text-lg text-white">
                {post.authorName?.[0]?.toUpperCase() || 'U'}
              </div>
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="font-display font-bold text-base sm:text-lg text-white">{post.authorName}</h2>
                <ShieldCheck className="w-4 h-4 text-cyan-400" />
              </div>
              <p className="font-mono text-xs text-neutral-400">@{post.authorUsername}</p>
            </div>
          </div>

          <div className="flex items-center gap-2 relative">
            <button
              onClick={() => setBookmarked(!bookmarked)}
              className={`p-2 rounded-xl transition cursor-pointer ${
                bookmarked ? 'text-amber-400 bg-amber-500/10' : 'text-neutral-500 hover:text-amber-400 hover:bg-white/5'
              }`}
              title={bookmarked ? "Saved" : "Save post"}
            >
              <Bookmark className={`w-4 h-4 ${bookmarked ? 'fill-amber-400' : ''}`} />
            </button>
            <button
              onClick={handleShare}
              className="p-2 rounded-xl text-neutral-500 hover:text-cyan-400 hover:bg-white/5 transition cursor-pointer"
              title="Share post"
            >
              {copied ? <Check className="w-4 h-4 text-emerald-400" /> : <Share2 className="w-4 h-4" />}
            </button>

            {/* 3-Dot Post Settings & Management Dropdown */}
            <div className="relative">
              <button
                type="button"
                onClick={() => setShowSettingsMenu(!showSettingsMenu)}
                className={`p-2 rounded-xl transition cursor-pointer ${
                  showSettingsMenu ? 'bg-white/15 text-white' : 'text-neutral-400 hover:text-white hover:bg-white/5'
                }`}
                title="Post Settings & Options"
              >
                <MoreHorizontal className="w-4 h-4" />
              </button>

              {showSettingsMenu && (
                <>
                  <div
                    className="fixed inset-0 z-40"
                    onClick={() => setShowSettingsMenu(false)}
                  />
                  <div
                    onClick={(e) => e.stopPropagation()}
                    className="absolute right-0 top-full mt-1.5 w-56 bg-[#0c0e18] border border-white/15 rounded-2xl shadow-[0_15px_50px_rgba(0,0,0,0.85)] p-1.5 z-50 backdrop-blur-xl font-mono text-xs space-y-0.5"
                  >
                    <div className="px-3 py-1.5 text-[10px] font-bold text-zinc-400 tracking-wider uppercase border-b border-white/5 flex items-center justify-between">
                      <span>Post Options</span>
                      <span className="text-[9px] text-zinc-500">#{post.id.slice(-4)}</span>
                    </div>

                    <button
                      type="button"
                      onClick={() => {
                        handleShare();
                        setShowSettingsMenu(false);
                      }}
                      className="w-full px-3 py-2 rounded-xl text-left flex items-center gap-2.5 text-zinc-200 hover:text-white hover:bg-white/10 transition cursor-pointer"
                    >
                      <Share2 className="w-3.5 h-3.5 text-cyan-400 shrink-0" />
                      <span>Copy Post Link</span>
                    </button>

                    <button
                      type="button"
                      onClick={() => {
                        if (typeof navigator !== 'undefined' && navigator.clipboard && post.content) {
                          navigator.clipboard.writeText(post.content);
                          alert('Post text copied to clipboard!');
                        }
                        setShowSettingsMenu(false);
                      }}
                      className="w-full px-3 py-2 rounded-xl text-left flex items-center gap-2.5 text-zinc-200 hover:text-white hover:bg-white/10 transition cursor-pointer"
                    >
                      <Copy className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                      <span>Copy Text</span>
                    </button>

                    {isOwn ? (
                      <div className="pt-1 border-t border-white/10">
                        <button
                          type="button"
                          onClick={() => {
                            if (confirm('Permanently delete this dispatch from your profile and feed?')) {
                              deletePost(post.id);
                              setShowSettingsMenu(false);
                              setActivePostId(null);
                              setActiveView('feed');
                            }
                          }}
                          className="w-full px-3 py-2 rounded-xl text-left flex items-center gap-2.5 text-rose-400 hover:text-rose-300 hover:bg-rose-500/15 transition cursor-pointer font-bold"
                        >
                          <Trash2 className="w-3.5 h-3.5 text-rose-400 shrink-0" />
                          <span>Delete Post</span>
                        </button>
                      </div>
                    ) : (
                      <>
                        <button
                          type="button"
                          onClick={() => {
                            alert('Dispatch hidden from your personal feed.');
                            setShowSettingsMenu(false);
                            setActivePostId(null);
                            setActiveView('feed');
                          }}
                          className="w-full px-3 py-2 rounded-xl text-left flex items-center gap-2.5 text-zinc-200 hover:text-white hover:bg-white/10 transition cursor-pointer"
                        >
                          <EyeOff className="w-3.5 h-3.5 text-zinc-400 shrink-0" />
                          <span>Hide Post</span>
                        </button>
                        <button
                          type="button"
                          onClick={() => {
                            alert('🚨 Post flagged for Sovereign Council review.');
                            setShowSettingsMenu(false);
                          }}
                          className="w-full px-3 py-2 rounded-xl text-left flex items-center gap-2.5 text-amber-300 hover:text-amber-200 hover:bg-amber-500/10 transition cursor-pointer"
                        >
                          <Flag className="w-3.5 h-3.5 text-amber-400 shrink-0" />
                          <span>Report Post</span>
                        </button>
                      </>
                    )}
                  </div>
                </>
              )}
            </div>
          </div>
        </div>

        {/* Content Body */}
        <p 
          className="text-base sm:text-lg text-neutral-100 leading-relaxed whitespace-pre-wrap break-words selection:bg-cyan-500/30"
          style={getStoryFontStyle(post.fontStyle)}
        >
          {post.content}
        </p>

        {/* Media */}
        {post.images.length > 0 && (
          <div className="mt-5">
            <ImageGrid images={post.images} />
          </div>
        )}

        {/* Verified Political & Institutional Source */}
        {(post.sourceName || (post.citations && post.citations.length > 0)) && (
          <div className="mt-5 flex flex-wrap items-center gap-2 p-3 rounded-2xl bg-white/[0.02] border border-cyan-500/20">
            {post.sourceName && (
              <a
                href={post.sourceUrl || '#'}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-cyan-950/60 hover:bg-cyan-900/70 border border-cyan-500/40 text-cyan-300 text-xs font-mono transition shadow-[0_0_15px_rgba(6,182,212,0.2)] group/source"
              >
                <span className="w-2 h-2 rounded-full bg-cyan-400 animate-pulse" />
                <span className="font-bold">Verified Source: {post.sourceName}</span>
                <ExternalLink className="w-3.5 h-3.5 text-cyan-400 group-hover/source:translate-x-0.5 group-hover/source:-translate-y-0.5 transition-transform" />
              </a>
            )}

            {post.citations && post.citations.map((c) => (
              <a
                key={c.id}
                href={c.archiveUrl || '#'}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-violet-950/50 hover:bg-violet-900/60 border border-violet-500/30 text-violet-300 text-xs font-mono transition"
              >
                <ShieldCheck className="w-3.5 h-3.5 text-violet-400" />
                <span>{c.institution}: {c.symbolOrId}</span>
                <ExternalLink className="w-3 h-3 text-violet-400" />
              </a>
            ))}
          </div>
        )}

        {/* Conditionally render Go to Dossier or Go to SPARK buttons ONLY for authentic dossiers or sparks */}
        {(() => {
          const isDossierItem = Boolean(
            post.isTreaty ||
            post.postType === 'treaty' ||
            post.treatyTitle ||
            (post.citations && post.citations.length > 0)
          );
          const isSparkItem = Boolean(
            post.tags?.some(t => t.toLowerCase().includes('spark') || t.toLowerCase().includes('brief'))
          );

          if (!isDossierItem && !isSparkItem) return null;

          return (
            <div className="mt-4 flex items-center gap-2 flex-wrap">
              {isDossierItem && (
                <button
                  type="button"
                  onClick={() => {
                    setActivePostId(null);
                    setActiveView('passport-dossier');
                  }}
                  className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-amber-500/15 hover:bg-amber-500/25 border border-amber-500/40 text-amber-300 text-xs font-mono font-bold transition cursor-pointer shadow-sm"
                >
                  <Award className="w-4 h-4 text-amber-400" />
                  <span>Go to Dossier</span>
                </button>
              )}
              {isSparkItem && (
                <button
                  type="button"
                  onClick={() => {
                    setActivePostId(null);
                    setActiveView('flux');
                  }}
                  className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-rose-500/15 hover:bg-rose-500/25 border border-rose-500/40 text-rose-300 text-xs font-mono font-bold transition cursor-pointer shadow-sm"
                >
                  <Sparkles className="w-4 h-4 text-rose-400" />
                  <span>Go to SPARK</span>
                </button>
              )}
            </div>
          );
        })()}

        {/* Timestamp */}
        <div className="mt-6 pt-4 border-t border-white/[0.08] flex items-center justify-between text-xs font-mono text-neutral-500">
          <span>{formatTime(post.createdAt)}</span>
          <span className="text-[10px] text-cyan-400/80">AUTHENTICATED LEDGER</span>
        </div>

        {/* Engagement Telemetry Row */}
        <div className="flex items-center gap-6 py-4 my-2 border-y border-white/[0.08] font-mono text-xs">
          <div>
            <strong className="text-white font-bold">{post.reposts}</strong>{' '}
            <span className="text-neutral-400">Amplifications</span>
          </div>
          <div>
            <strong className="text-white font-bold">{post.likes}</strong>{' '}
            <span className="text-neutral-400">Applauds</span>
          </div>
          <div>
            <strong className="text-white font-bold">{replies.length}</strong>{' '}
            <span className="text-neutral-400">Responses</span>
          </div>
        </div>

        {/* Primary Action Buttons */}
        <div className="flex items-center justify-around pt-2">
          <button
            onClick={() => repostPost(post.id)}
            className={`flex items-center gap-2 px-4 py-2 rounded-2xl transition cursor-pointer font-mono text-xs font-semibold ${
              hasReposted ? 'text-emerald-400 bg-emerald-500/10' : 'text-neutral-400 hover:text-emerald-400 hover:bg-emerald-500/10'
            }`}
          >
            <Repeat2 className="w-4 h-4" />
            <span>{hasReposted ? 'Amplified' : 'Amplify'}</span>
          </button>

          <button
            onClick={() => likePost(post.id)}
            className={`flex items-center gap-2 px-4 py-2 rounded-2xl transition cursor-pointer font-mono text-xs font-semibold ${
              hasLiked ? 'text-rose-400 bg-rose-500/10' : 'text-neutral-400 hover:text-rose-400 hover:bg-rose-500/10'
            }`}
          >
            <Heart className={`w-4 h-4 ${hasLiked ? 'fill-rose-400' : ''}`} />
            <span>{hasLiked ? 'Liked' : 'Like'}</span>
          </button>
        </div>
      </article>

      {/* Reply Input Card */}
      <form onSubmit={handleReply} className="rounded-2xl p-4 bg-[#080a10] border border-white/10 mb-6 shadow-md">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-white/10 border border-white/15 flex items-center justify-center font-display font-bold text-xs text-white uppercase shrink-0">
            {(currentUserName || 'U')[0]?.toUpperCase() || 'U'}
          </div>
          <input
            type="text"
            value={replyText}
            onChange={(e) => setReplyText(e.target.value)}
            placeholder={`Reply to @${post.authorUsername}...`}
            className="flex-1 bg-transparent text-sm text-white placeholder:text-neutral-600 focus:outline-none"
          />
          <button
            type="submit"
            disabled={!replyText.trim()}
            className="px-4 py-2 rounded-xl bg-white hover:bg-neutral-200 text-black font-mono text-xs font-bold transition disabled:opacity-30 cursor-pointer flex items-center gap-1.5"
          >
            <span>Send</span>
            <Send className="w-3 h-3 fill-current" />
          </button>
        </div>
      </form>

      {/* Discussion Thread List */}
      <div className="space-y-3">
        <div className="flex items-center justify-between px-2 font-mono text-xs text-neutral-400">
          <span className="uppercase tracking-wider">Responses ({replies.length})</span>
          <span className="text-[10px] text-neutral-500">Live stream</span>
        </div>

        {replies.length === 0 ? (
          <div className="rounded-2xl p-8 border border-white/[0.06] bg-white/[0.01] text-center font-mono text-xs text-neutral-500">
            No responses yet. Be the first to share your thoughts and sources.
          </div>
        ) : (
          replies.map((reply) => {
            const hasLikedReply = reply.likedBy.includes(currentUserId);
            const isOwnReply = reply.authorId === currentUserId;

            return (
              <div
                key={reply.id}
                className="group relative rounded-2xl p-4 sm:p-5 card-luxury border border-white/[0.06] hover:border-white/15 transition-all"
              >
                <div className="flex gap-3">
                  <div className="w-9 h-9 rounded-xl bg-white/[0.08] border border-white/10 flex items-center justify-center font-display font-bold text-xs text-white uppercase shrink-0">
                    {reply.authorName?.[0]?.toUpperCase() || 'U'}
                  </div>

                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-1.5">
                        <span className="font-display font-bold text-sm text-white">{reply.authorName}</span>
                        <span className="font-mono text-xs text-neutral-500">@{reply.authorUsername}</span>
                        <span className="text-neutral-600 text-xs">·</span>
                        <span className="font-mono text-[11px] text-neutral-500">{formatRelative(reply.createdAt)}</span>
                      </div>

                      {isOwnReply && (
                        <button
                          onClick={() => deleteReply(reply.id)}
                          className="p-1 rounded-lg text-neutral-500 hover:text-rose-400 hover:bg-rose-500/10 transition opacity-0 group-hover:opacity-100 cursor-pointer"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      )}
                    </div>

                    <p className="text-sm text-neutral-200 mt-1.5 leading-relaxed font-sans whitespace-pre-wrap">
                      {reply.content}
                    </p>

                    <div className="flex items-center gap-4 mt-3">
                      <button
                        onClick={() => likeReply(reply.id)}
                        className={`flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-mono transition cursor-pointer ${
                          hasLikedReply ? 'text-rose-400 bg-rose-500/10' : 'text-neutral-500 hover:text-rose-400 hover:bg-rose-500/10'
                        }`}
                      >
                        <Heart className={`w-3.5 h-3.5 ${hasLikedReply ? 'fill-rose-400' : ''}`} />
                        <span>{reply.likes || 0}</span>
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}
