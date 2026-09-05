'use client';

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  X,
  Heart,
  Bookmark,
  Share2,
  Check,
  Sparkles,
  Zap,
  ShieldCheck,
  MessageCircle,
  Send,
  ArrowRight,
  Clock,
  Layers,
  FileText,
  Copy,
  CornerDownRight,
  Type,
  Scale,
  ScrollText
} from 'lucide-react';
import { useZenPulse } from '@/context/ZenPulsePlatformContext';
import { STORY_FONTS, getStoryFontStyle } from '@/lib/storyFonts';

export interface FlexReaderItem {
  id: string;
  type?: 'pulse_post' | 'spark' | 'article_flex';
  title?: string;
  content: string;
  authorName: string;
  authorUsername: string;
  authorAvatar?: string;
  images?: string[];
  createdAt: string;
  likes: number;
  category?: string;
  readingTimeMinutes?: number;
  keyTakeaways?: string[];
  treatyClauseReference?: string;
  fullDossier?: string;
  threadSegments?: string[];
  tags?: string[];
  replies?: Array<{
    id: string;
    authorName: string;
    authorUsername: string;
    authorAvatar?: string;
    content: string;
    createdAt: string;
    likes?: number;
  }>;
}

interface ZenFlexReaderModalProps {
  isOpen: boolean;
  onClose: () => void;
  item: FlexReaderItem | null;
  onLike?: (id: string) => void;
  onBookmark?: (id: string) => void;
  onAddReply?: (itemId: string, content: string) => void;
  isLiked?: boolean;
  isSaved?: boolean;
}

export function ZenFlexReaderModal({
  isOpen,
  onClose,
  item,
  onLike,
  onBookmark,
  onAddReply,
  isLiked = false,
  isSaved = false,
}: ZenFlexReaderModalProps) {
  const { currentUserName, currentUserUsername } = useZenPulse();
  const [copied, setCopied] = useState(false);
  const [replyText, setReplyText] = useState('');
  const [localReplies, setLocalReplies] = useState<Array<any>>([]);
  const [liked, setLiked] = useState(isLiked);
  const [likesCount, setLikesCount] = useState(item?.likes || 0);
  const [saved, setSaved] = useState(isSaved);
  const [readerFont, setReaderFont] = useState('serif');

  useEffect(() => {
    if (item) {
      setLiked(isLiked);
      setLikesCount(item.likes || 0);
      setSaved(isSaved);
      setLocalReplies([]);
      setReplyText('');
    }
  }, [item, isLiked, isSaved]);

  if (!isOpen || !item) return null;

  // Split content into readable thread segments if not explicitly provided
  const threadSegments: string[] = item.threadSegments && item.threadSegments.length > 0
    ? item.threadSegments
    : item.content.split(/\n\n+/).filter((seg) => seg.trim().length > 0);

  const handleLike = () => {
    if (liked) {
      setLikesCount((prev) => Math.max(0, prev - 1));
      setLiked(false);
    } else {
      setLikesCount((prev) => prev + 1);
      setLiked(true);
    }
    if (onLike) onLike(item.id);
  };

  const handleBookmark = () => {
    setSaved(!saved);
    if (onBookmark) onBookmark(item.id);
  };

  const handleShare = () => {
    if (typeof navigator !== 'undefined') {
      navigator.clipboard.writeText(`${window.location.origin}/pulse?flex=${item.id}`);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const handleSubmitReply = (e: React.FormEvent) => {
    e.preventDefault();
    if (!replyText.trim()) return;

    const newReply = {
      id: `reply_${Date.now()}`,
      authorName: currentUserName || 'Community Member',
      authorUsername: currentUserUsername || 'you',
      content: replyText.trim(),
      createdAt: 'Just now',
      likes: 0
    };

    setLocalReplies((prev) => [...prev, newReply]);
    if (onAddReply) onAddReply(item.id, replyText.trim());
    setReplyText('');
  };

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 overflow-y-auto">
        {/* Backdrop */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          className="fixed inset-0 bg-black/85 backdrop-blur-xl"
        />

        {/* Reader Card Container */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 20 }}
          transition={{ type: 'spring', damping: 25, stiffness: 300 }}
          className="relative w-full max-w-3xl max-h-[90vh] bg-[#07080c] border border-white/15 rounded-3xl shadow-2xl flex flex-col overflow-hidden z-10"
        >
          {/* Header Bar */}
          <div className="p-4 sm:p-5 border-b border-white/10 flex items-center justify-between gap-4 bg-white/[0.02] shrink-0">
            <div className="flex items-center gap-3 min-w-0">
              <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-amber-400 via-rose-500 to-purple-600 p-[2px] shrink-0 shadow-md">
                <div className="w-full h-full rounded-full bg-black flex items-center justify-center font-display font-bold text-xs text-white uppercase">
                  {item.authorName?.[0]?.toUpperCase() || 'U'}
                </div>
              </div>

              <div className="min-w-0">
                <div className="flex items-center gap-2">
                  <span className="font-display font-bold text-sm text-white truncate">{item.authorName}</span>
                  <span className="text-xs text-neutral-400 font-mono">@{item.authorUsername}</span>
                </div>
                <div className="flex items-center gap-2 text-[11px] font-mono text-neutral-500">
                  <span>{item.createdAt}</span>
                  {item.category && (
                    <>
                      <span>&bull;</span>
                      <span className="text-cyan-400 font-semibold">{item.category}</span>
                    </>
                  )}
                  {item.readingTimeMinutes && (
                    <>
                      <span>&bull;</span>
                      <span className="text-amber-400">⚡ {item.readingTimeMinutes} min read</span>
                    </>
                  )}
                </div>
              </div>
            </div>

            <div className="flex items-center gap-2">
              {/* Typography Selector Pill */}
              <div className="flex items-center gap-1 bg-white/[0.04] border border-white/10 rounded-xl p-1 text-xs">
                <Type className="w-3.5 h-3.5 text-cyan-400 ml-1 shrink-0" />
                <select
                  value={readerFont}
                  onChange={(e) => setReaderFont(e.target.value)}
                  className="bg-transparent text-[11px] font-mono text-zinc-300 focus:outline-none cursor-pointer pr-1"
                >
                  {STORY_FONTS.map((font) => (
                    <option key={font.id} value={font.id} className="bg-zinc-950 text-white">
                      {font.name}
                    </option>
                  ))}
                </select>
              </div>

              <button
                onClick={handleShare}
                className="p-2 rounded-xl bg-white/[0.05] hover:bg-white/10 text-neutral-400 hover:text-white border border-white/10 transition cursor-pointer"
                title="Share Flex"
              >
                {copied ? <Check className="w-4 h-4 text-emerald-400" /> : <Share2 className="w-4 h-4" />}
              </button>

              <button
                onClick={onClose}
                className="p-2 rounded-xl bg-white/[0.05] hover:bg-white/10 text-neutral-400 hover:text-white border border-white/10 transition cursor-pointer"
                title="Close Reader"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Scrollable Reader Content */}
          <div className="flex-1 overflow-y-auto p-5 sm:p-8 space-y-6">
            
            {/* Title */}
            {item.title && (
              <h1 
                className="font-bold text-xl sm:text-2xl lg:text-3xl text-white tracking-tight leading-snug"
                style={{ fontFamily: 'Clash Display, var(--font-space), sans-serif' }}
              >
                {item.title}
              </h1>
            )}

            {/* Key Takeaways Box (if available) */}
            {item.keyTakeaways && item.keyTakeaways.length > 0 && (
              <div className="p-4 sm:p-5 rounded-2xl bg-amber-500/[0.06] border border-amber-500/25 space-y-2.5 shadow-inner">
                <div className="flex items-center gap-2 text-xs font-mono font-bold text-amber-300 uppercase tracking-wider">
                  <Sparkles className="w-4 h-4 text-amber-400" />
                  <span>Executive Takeaways</span>
                </div>
                <ul className="space-y-2 text-xs sm:text-sm text-neutral-200">
                  {item.keyTakeaways.map((takeaway, idx) => (
                    <li key={idx} className="flex items-start gap-2.5">
                      <span className="w-1.5 h-1.5 rounded-full bg-amber-400 mt-2 shrink-0" />
                      <span>{takeaway}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {/* Treaty Clause Reference Badge */}
            {item.treatyClauseReference && (
              <div className="p-3 rounded-xl bg-black/60 border border-white/10 flex items-center justify-between text-xs font-mono text-neutral-300">
                <span className="text-neutral-500">Treaty Clause Citation:</span>
                <span className="font-bold text-cyan-400 bg-cyan-500/10 px-2.5 py-0.5 rounded-md border border-cyan-500/30">
                  {item.treatyClauseReference}
                </span>
              </div>
            )}

            {/* High-Resolution Media Gallery */}
            {item.images && item.images.length > 0 && (
              <div className="space-y-3">
                {item.images.map((img, idx) => (
                  <div
                    key={idx}
                    className="relative rounded-2xl overflow-hidden border border-white/10 bg-black aspect-video sm:aspect-[16/9]"
                  >
                    <img src={img} alt="Thread media" className="w-full h-full object-cover" />
                  </div>
                ))}
              </div>
            )}

            {/* ─── Thread Segments / Readable Micro-Flex Stream ─── */}
            <div className="space-y-4 pt-2">
              <div className="flex items-center gap-2 pb-2 border-b border-white/[0.08] text-xs font-mono text-neutral-400">
                <Layers className="w-3.5 h-3.5 text-purple-400" />
                <span>THREAD CLAUSES ({threadSegments.length})</span>
              </div>

              <div className="space-y-4">
                {threadSegments.map((segment, idx) => (
                  <div
                    key={idx}
                    className="relative pl-6 sm:pl-8 before:absolute before:left-2 before:top-3 before:bottom-0 before:w-[2px] before:bg-gradient-to-b before:from-purple-500/60 before:via-cyan-500/40 before:to-transparent last:before:hidden"
                  >
                    {/* Bullet marker */}
                    <div className="absolute left-0 top-1.5 w-4 h-4 rounded-full bg-purple-500/20 border border-purple-400 flex items-center justify-center font-mono text-[9px] font-bold text-purple-300">
                      {idx + 1}
                    </div>

                    <div className="p-4 rounded-2xl bg-white/[0.03] border border-white/[0.08] hover:border-white/20 transition-all space-y-1">
                      <div className="flex items-center justify-between text-[10px] font-mono text-neutral-500 pb-1">
                        <span>Segment [{idx + 1}/{threadSegments.length}]</span>
                      </div>
                      <p 
                        className="text-sm sm:text-base text-neutral-100 leading-relaxed whitespace-pre-wrap"
                        style={getStoryFontStyle(readerFont)}
                      >
                        {segment}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Full Dossier Section (if provided) */}
            {item.fullDossier && (() => {
              const raw = item.fullDossier || '';
              const parts = raw.split(/(?=\n\s*\d+\.\s+[A-Z\s&/—–-]+)/);
              const preamble = parts[0]?.trim() || '';
              const clauses = parts.slice(1).map((chunk) => {
                const trimmed = chunk.trim();
                const firstLineEnd = trimmed.indexOf('\n');
                const headerLine = firstLineEnd !== -1 ? trimmed.substring(0, firstLineEnd).trim() : trimmed;
                const body = firstLineEnd !== -1 ? trimmed.substring(firstLineEnd).trim() : '';

                const match = headerLine.match(/^(\d+)\.\s*(.*)$/);
                return {
                  number: match ? match[1].padStart(2, '0') : '',
                  title: match ? match[2] : headerLine,
                  body: body,
                };
              }).filter((c) => c.title || c.body);

              return (
                <div className="p-5 sm:p-6 rounded-3xl bg-[#090b12] border border-amber-500/25 space-y-4 shadow-xl">
                  <div className="flex flex-wrap items-center justify-between gap-3 pb-3 border-b border-white/10">
                    <div className="flex items-center gap-2">
                      <span className="w-2.5 h-2.5 rounded-full bg-amber-400 shadow-[0_0_8px_#fbbf24] animate-pulse" />
                      <span className="text-xs font-mono uppercase tracking-widest text-amber-300 font-bold">
                        Ratified Comprehensive Dossier
                      </span>
                    </div>

                    {item.treatyClauseReference && (
                      <div className="flex items-center gap-1.5 px-3 py-1 rounded-xl bg-black/60 border border-amber-500/30 text-xs font-mono text-amber-200">
                        <Scale className="w-3.5 h-3.5 text-amber-400" />
                        <span>Treaty: <strong>{item.treatyClauseReference}</strong></span>
                      </div>
                    )}
                  </div>

                  {/* Executive Preamble */}
                  {preamble && (
                    <div className="p-4 rounded-2xl bg-white/[0.02] border-l-2 border-l-amber-400 border-y border-r border-white/5 space-y-2">
                      <div className="flex items-center gap-1.5 text-[11px] font-mono text-zinc-400 uppercase tracking-wider font-semibold">
                        <ScrollText className="w-3.5 h-3.5 text-amber-400" />
                        <span>Executive Preamble &amp; Geopolitical Thesis</span>
                      </div>
                      <p className="text-zinc-200 text-xs sm:text-sm leading-relaxed italic">
                        "{preamble}"
                      </p>
                    </div>
                  )}

                  {/* Structured Clauses */}
                  {clauses.length > 0 ? (
                    <div className="space-y-3">
                      {clauses.map((clause, cIdx) => (
                        <div
                          key={cIdx}
                          className="p-4 rounded-2xl bg-black/50 border border-white/10 hover:border-cyan-500/30 transition-all space-y-2 group"
                        >
                          <div className="flex items-center gap-2.5">
                            <span className="px-2 py-0.5 rounded-md bg-cyan-500/10 text-cyan-300 border border-cyan-500/30 font-mono text-xs font-bold">
                              CLAUSE {clause.number || `0${cIdx + 1}`}
                            </span>
                            <h4 className="font-bold text-xs sm:text-sm text-white tracking-wide group-hover:text-cyan-200 transition-colors font-display">
                              {clause.title}
                            </h4>
                          </div>
                          <p 
                            className="text-zinc-300 text-xs sm:text-sm leading-relaxed whitespace-pre-line"
                            style={getStoryFontStyle(readerFont)}
                          >
                            {clause.body}
                          </p>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div 
                      className="text-xs sm:text-sm text-neutral-200 leading-relaxed whitespace-pre-line"
                      style={getStoryFontStyle(readerFont)}
                    >
                      {item.fullDossier}
                    </div>
                  )}

                  <div className="pt-2 flex items-center justify-between text-[11px] font-mono text-zinc-500 border-t border-white/5">
                    <span className="flex items-center gap-1.5 text-emerald-400">
                      <ShieldCheck className="w-4 h-4 text-emerald-400" />
                      <span>Certified Plenary Non-Paper Document</span>
                    </span>

                    <button
                      type="button"
                      onClick={() => {
                        navigator.clipboard.writeText(item.fullDossier || '');
                        alert('Full dossier copied to clipboard.');
                      }}
                      className="hover:text-white transition flex items-center gap-1.5 text-zinc-400 cursor-pointer"
                    >
                      <Copy className="w-3.5 h-3.5" />
                      <span>Copy Full Text</span>
                    </button>
                  </div>
                </div>
              );
            })()}

            {/* ─── Threaded Discussion / Replies ─── */}
            <div className="space-y-4 pt-6 border-t border-white/10">
              <div className="flex items-center justify-between">
                <h3 className="font-display font-bold text-sm text-white flex items-center gap-2">
                  <MessageCircle className="w-4 h-4 text-cyan-400" />
                  <span>Diplomatic Replies ({localReplies.length})</span>
                </h3>
              </div>

              {/* Reply Form */}
              <form onSubmit={handleSubmitReply} className="flex gap-2">
                <input
                  type="text"
                  placeholder="Contribute to this diplomatic thread..."
                  value={replyText}
                  onChange={(e) => setReplyText(e.target.value)}
                  className="flex-1 px-4 py-2.5 rounded-xl bg-white/[0.05] border border-white/10 text-white placeholder:text-neutral-500 text-xs font-sans focus:outline-none focus:border-cyan-400 transition"
                />
                <button
                  type="submit"
                  disabled={!replyText.trim()}
                  className="px-4 py-2.5 rounded-xl bg-white text-black font-bold text-xs hover:bg-neutral-200 disabled:opacity-40 transition flex items-center gap-1.5 cursor-pointer"
                >
                  <span>Post</span>
                  <Send className="w-3 h-3" />
                </button>
              </form>

              {/* Replies List */}
              <div className="space-y-2.5 max-h-60 overflow-y-auto pt-2">
                {localReplies.length === 0 ? (
                  <p className="text-xs font-mono text-neutral-500 py-3 text-center">
                    No replies yet. Be the first to deliberate on this thread.
                  </p>
                ) : (
                  localReplies.map((rep) => (
                    <div
                      key={rep.id}
                      className="p-3 rounded-xl bg-white/[0.02] border border-white/[0.06] flex items-start gap-3 text-xs"
                    >
                      <CornerDownRight className="w-3.5 h-3.5 text-neutral-500 mt-1 shrink-0" />
                      <div className="space-y-1 min-w-0 flex-1">
                        <div className="flex items-center gap-2">
                          <span className="font-bold text-white text-[11px]">{rep.authorName}</span>
                          <span className="text-[10px] text-neutral-500 font-mono">@{rep.authorUsername}</span>
                          <span className="text-[10px] text-neutral-600 font-mono">&bull; {rep.createdAt}</span>
                        </div>
                        <p className="text-neutral-300 font-sans leading-relaxed">{rep.content}</p>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
          </div>

          {/* Footer Interactive Bar */}
          <div className="p-4 sm:p-5 border-t border-white/10 bg-black/60 flex items-center justify-between shrink-0">
            <div className="flex items-center gap-3">
              <button
                onClick={handleLike}
                className={`flex items-center gap-2 px-3.5 py-2 rounded-xl border text-xs font-mono transition cursor-pointer ${
                  liked
                    ? 'bg-rose-500/10 border-rose-500/30 text-rose-400'
                    : 'bg-white/[0.04] border-white/10 text-neutral-300 hover:text-white'
                }`}
              >
                <Heart className={`w-4 h-4 ${liked ? 'fill-rose-500 text-rose-500' : ''}`} />
                <span>{likesCount} Likes</span>
              </button>

              <button
                onClick={handleBookmark}
                className={`flex items-center gap-2 px-3.5 py-2 rounded-xl border text-xs font-mono transition cursor-pointer ${
                  saved
                    ? 'bg-amber-500/10 border-amber-500/30 text-amber-400'
                    : 'bg-white/[0.04] border-white/10 text-neutral-300 hover:text-white'
                }`}
              >
                <Bookmark className={`w-4 h-4 ${saved ? 'fill-amber-400 text-amber-400' : ''}`} />
                <span>{saved ? 'Saved' : 'Save'}</span>
              </button>
            </div>

            <button
              onClick={onClose}
              className="px-5 py-2 rounded-xl bg-white text-black font-display font-bold text-xs hover:bg-neutral-200 transition cursor-pointer"
            >
              Done Reading
            </button>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
