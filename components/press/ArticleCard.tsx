'use client';

import React, { useState } from 'react';
import {
  ArrowUp,
  Bookmark,
  MessageCircle,
  Clock,
  Sparkles,
  Award,
  ArrowUpRight
} from 'lucide-react';
import { PressArticle } from '@/types/press';
import { useZenPress } from '@/context/ZenPressPlatformContext';

import { ArrowRight } from 'lucide-react';

interface ArticleCardProps {
  article: PressArticle;
  onOpenFlex?: (article: PressArticle) => void;
}

export function ArticleCard({ article, onOpenFlex }: ArticleCardProps) {
  const {
    setActiveView,
    setActiveArticleId,
    upvoteArticle,
    toggleBookmark,
    currentUserId,
  } = useZenPress();

  const [coords, setCoords] = useState({ x: 0, y: 0 });
  const [isHovered, setIsHovered] = useState(false);

  const handleMouseMove = (e: React.MouseEvent<HTMLElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    setCoords({ x: e.clientX - rect.left, y: e.clientY - rect.top });
  };

  const hasUpvoted = article.upvotedBy.includes(currentUserId);
  const hasBookmarked = article.bookmarkedBy.includes(currentUserId);

  const openArticle = () => {
    setActiveArticleId(article.id);
    setActiveView('article');
  };

  const publishDate = article.publishedAt
    ? new Date(article.publishedAt).toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric',
        year: 'numeric',
      })
    : '';

  return (
    <article
      onClick={openArticle}
      onMouseMove={handleMouseMove}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      className="group relative rounded-3xl overflow-hidden transition-all duration-500 cursor-pointer flex flex-col justify-between"
      style={{
        background: 'linear-gradient(180deg, rgba(20, 16, 36, 0.90) 0%, rgba(9, 8, 16, 0.98) 100%)',
        border: '1px solid rgba(255, 255, 255, 0.12)',
        boxShadow: isHovered
          ? '0 25px 60px rgba(0,0,0,0.95), 0 0 45px rgba(168,85,247,0.22)'
          : '0 10px 30px rgba(0,0,0,0.6), 0 0 25px rgba(168,85,247,0.05)',
        transform: isHovered ? 'translateY(-3px)' : 'translateY(0)',
      }}
    >
      {/* Dynamic Cursor Spotlight Radial */}
      <div
        className="pointer-events-none absolute -inset-px transition-opacity duration-300 z-[2]"
        style={{
          opacity: isHovered ? 1 : 0,
          background: `radial-gradient(500px circle at ${coords.x}px ${coords.y}px, rgba(168, 85, 247, 0.22), transparent 70%)`,
        }}
      />

      {/* Cover Image */}
      {article.coverImage && (
        <div className="relative h-44 sm:h-48 w-full overflow-hidden bg-neutral-900 z-[1]">
          <img
            src={article.coverImage}
            alt=""
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 opacity-90 group-hover:opacity-100"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-[#090810] via-transparent to-transparent pointer-events-none" />
        </div>
      )}

      <div className="p-5 sm:p-6 space-y-4 flex-1 flex flex-col justify-between relative z-[3]">
        <div className="space-y-2.5">
          {/* Top Row: Category + Official Badge + Time */}
          <div className="flex items-center justify-between gap-2">
            <div className="flex items-center gap-2">
              <span className="px-2.5 py-0.5 rounded-full bg-cyan-500/10 border border-cyan-500/25 text-[10px] font-mono text-cyan-300 font-semibold uppercase tracking-wider">
                {article.category}
              </span>
              {article.isOfficial && (
                <span className="flex items-center gap-1 px-2 py-0.5 rounded-full bg-amber-500/15 border border-amber-500/30 text-[10px] font-mono font-bold text-amber-300">
                  <Sparkles className="w-2.5 h-2.5" />
                  OFFICIAL WIRE
                </span>
              )}
            </div>

            <div className="flex items-center gap-2 text-[10px] font-mono text-neutral-400">
              <span className="flex items-center gap-1">
                <Clock className="w-3 h-3 text-neutral-500" />
                {article.readingTimeMinutes} min
              </span>
            </div>
          </div>

          {/* Title */}
          <h3 className="text-base sm:text-lg font-display font-medium text-white leading-snug group-hover:text-cyan-200 transition">
            {article.title}
          </h3>

          {/* Excerpt */}
          <p className="text-xs text-neutral-400 leading-relaxed line-clamp-2 font-sans font-light">
            {article.excerpt}
          </p>
        </div>

        {/* Bottom Author & Engagement Bar */}
        <div className="pt-3 border-t border-white/[0.06] space-y-3">
          <div className="flex items-center justify-between">
            {/* Author */}
            <div className="flex items-center gap-2.5 min-w-0">
              <div className="w-7 h-7 rounded-xl bg-gradient-to-tr from-cyan-400 to-violet-500 p-0.5 shrink-0 shadow-sm">
                <div className="w-full h-full rounded-[8px] bg-[#06080c] flex items-center justify-center font-display font-bold text-[10px] text-white uppercase">
                  {article.authorName[0]}
                </div>
              </div>
              <div className="font-mono text-[11px] truncate">
                <span className="text-neutral-200 font-semibold truncate block">{article.authorName}</span>
                <span className="text-neutral-500 text-[10px]">{publishDate}</span>
              </div>
            </div>

            {/* Action Buttons */}
            <div
              className="flex items-center gap-1.5 shrink-0"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Read Flex Micro-Thread */}
              {onOpenFlex && (
                <button
                  type="button"
                  onClick={() => onOpenFlex(article)}
                  className="flex items-center gap-1 px-2.5 py-1 rounded-xl bg-purple-500/15 hover:bg-purple-500/25 border border-purple-500/30 text-purple-300 text-[10px] font-mono font-bold transition cursor-pointer shadow-sm group/flx"
                  title="Read as structured Flex thread"
                >
                  <span>Flex</span>
                  <ArrowRight className="w-3 h-3 group-hover/flx:translate-x-0.5 transition-transform" />
                </button>
              )}

              {/* Upvote */}
              <button
                onClick={() => upvoteArticle(article.id)}
                className={`flex items-center gap-1 px-2.5 py-1.5 rounded-xl text-[11px] font-mono transition cursor-pointer ${
                  hasUpvoted
                    ? 'bg-emerald-500/15 text-emerald-300 border border-emerald-500/30'
                    : 'text-neutral-400 hover:text-emerald-300 hover:bg-emerald-500/10'
                }`}
                title="Upvote dispatch"
              >
                <ArrowUp className={`w-3.5 h-3.5 ${hasUpvoted ? 'fill-emerald-300' : ''}`} />
                <span className="font-bold">{article.upvotes}</span>
              </button>

              {/* Comments */}
              <button
                onClick={openArticle}
                className="flex items-center gap-1 px-2 py-1.5 rounded-xl text-[11px] font-mono text-neutral-400 hover:text-cyan-300 hover:bg-cyan-500/10 transition cursor-pointer"
                title="Discussion"
              >
                <MessageCircle className="w-3.5 h-3.5" />
                <span>{article.commentCount}</span>
              </button>

              {/* Bookmark */}
              <button
                onClick={() => toggleBookmark(article.id)}
                className={`p-1.5 rounded-xl transition cursor-pointer ${
                  hasBookmarked
                    ? 'text-amber-300 bg-amber-500/15'
                    : 'text-neutral-500 hover:text-amber-300 hover:bg-amber-500/10'
                }`}
                title="Save story"
              >
                <Bookmark className={`w-3.5 h-3.5 ${hasBookmarked ? 'fill-amber-300' : ''}`} />
              </button>
            </div>
          </div>

          {/* Verified Source & Tags */}
          <div className="space-y-2">
            {article.sourceName && (
              <div className="flex items-center gap-1.5 text-[10px] font-mono text-cyan-300/90 truncate">
                <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 shrink-0" />
                <span className="text-neutral-500">Source:</span>
                <a
                  href={article.sourceUrl || '#'}
                  target="_blank"
                  rel="noopener noreferrer"
                  onClick={(e) => e.stopPropagation()}
                  className="hover:underline text-cyan-300 truncate inline-flex items-center gap-1"
                >
                  <span className="truncate">{article.sourceName}</span>
                  <ArrowUpRight className="w-2.5 h-2.5 shrink-0" />
                </a>
              </div>
            )}

            {article.tags.length > 0 && (
              <div className="flex flex-wrap gap-1">
                {article.tags.slice(0, 3).map((tag) => (
                  <span
                    key={tag}
                    className="px-2 py-0.5 rounded-md bg-white/[0.03] text-[9px] font-mono text-neutral-400"
                  >
                    #{tag}
                  </span>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </article>
  );
}

export default ArticleCard;
