'use client';

import React, { useState, useEffect } from 'react';
import {
  ArrowLeft,
  ArrowUp,
  Bookmark,
  Share2,
  Clock,
  Sparkles,
  Check,
  Award,
  Radio,
  Eye,
  Type,
  Zap,
  Layers,
  ArrowRight
} from 'lucide-react';
import { useZenPress } from '@/context/ZenPressPlatformContext';
import { CommentSection } from './CommentSection';

export function ArticleReader() {
  const {
    activeArticleId,
    getArticleById,
    setActiveView,
    setActiveArticleId,
    upvoteArticle,
    toggleBookmark,
    currentUserId,
  } = useZenPress();

  const [copied, setCopied] = useState(false);
  const [scrollProgress, setScrollProgress] = useState(0);
  const [fontSize, setFontSize] = useState<'sm' | 'base' | 'lg'>('base');
  const [isFlexMode, setIsFlexMode] = useState(false);

  const article = activeArticleId ? getArticleById(activeArticleId) : undefined;

  // Scroll Progress Listener
  useEffect(() => {
    const handleScroll = () => {
      const totalHeight = document.documentElement.scrollHeight - window.innerHeight;
      if (totalHeight > 0) {
        setScrollProgress((window.scrollY / totalHeight) * 100);
      }
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  if (!article) {
    return (
      <div className="flex flex-col items-center justify-center py-20 text-center font-sans">
        <p className="text-sm font-mono text-neutral-500">Dispatch not found.</p>
        <button
          onClick={() => { setActiveArticleId(null); setActiveView('feed'); }}
          className="mt-4 px-5 py-2.5 rounded-2xl bg-white text-black font-mono text-xs font-bold hover:bg-neutral-200 transition cursor-pointer"
        >
          Return to Feed
        </button>
      </div>
    );
  }

  const hasUpvoted = article.upvotedBy.includes(currentUserId);
  const hasBookmarked = article.bookmarkedBy.includes(currentUserId);

  const handleShare = () => {
    if (typeof navigator !== 'undefined') {
      navigator.clipboard.writeText(window.location.href);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const publishDate = article.publishedAt
    ? new Date(article.publishedAt).toLocaleDateString('en-US', {
        month: 'long',
        day: 'numeric',
        year: 'numeric',
      })
    : '';

  const getFontSizeClass = () => {
    switch (fontSize) {
      case 'sm':
        return 'text-sm';
      case 'lg':
        return 'text-lg';
      case 'base':
      default:
        return 'text-base';
    }
  };

  return (
    <div className="max-w-3xl mx-auto font-sans pb-24">
      {/* Top Sticky Reading Progress Bar */}
      <div className="fixed top-0 left-0 right-0 h-1 bg-white/5 z-50">
        <div
          className="h-full bg-white transition-all duration-150"
          style={{ width: `${scrollProgress}%` }}
        />
      </div>

      {/* Top Navigation & Controls Bar */}
      <div className="flex items-center justify-between pb-6 border-b border-white/[0.08] mb-8">
        <button
          onClick={() => { setActiveArticleId(null); setActiveView('feed'); }}
          className="inline-flex items-center gap-2 px-3.5 py-2 rounded-xl bg-white/[0.04] border border-white/10 text-xs font-mono text-neutral-300 hover:text-white hover:bg-white/10 transition cursor-pointer"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>Press Wire</span>
        </button>

        {/* Font Size, Flex Mode & Share Controls */}
        <div className="flex items-center gap-2">
          {/* Interactive Flex Mode Switch */}
          <button
            onClick={() => setIsFlexMode(!isFlexMode)}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl border text-xs font-mono font-bold transition cursor-pointer ${
              isFlexMode
                ? 'bg-purple-500/20 border-purple-500/40 text-purple-300'
                : 'bg-white/[0.04] border-white/10 text-neutral-400 hover:text-white'
            }`}
          >
            <Zap className={`w-3.5 h-3.5 ${isFlexMode ? 'text-purple-400 animate-pulse' : 'text-neutral-500'}`} />
            <span>{isFlexMode ? 'Flex Mode: ON' : 'Read as Flex'}</span>
          </button>

          {/* Font Resizer */}
          <div className="flex items-center p-1 rounded-xl bg-white/[0.04] border border-white/10 text-[11px] font-mono">
            <button
              onClick={() => setFontSize('sm')}
              className={`px-2 py-1 rounded-lg transition ${fontSize === 'sm' ? 'bg-white text-black font-bold' : 'text-neutral-400 hover:text-white'}`}
            >
              A-
            </button>
            <button
              onClick={() => setFontSize('base')}
              className={`px-2 py-1 rounded-lg transition ${fontSize === 'base' ? 'bg-white text-black font-bold' : 'text-neutral-400 hover:text-white'}`}
            >
              A
            </button>
            <button
              onClick={() => setFontSize('lg')}
              className={`px-2 py-1 rounded-lg transition ${fontSize === 'lg' ? 'bg-white text-black font-bold' : 'text-neutral-400 hover:text-white'}`}
            >
              A+
            </button>
          </div>

          <button
            onClick={handleShare}
            className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-white/[0.04] border border-white/10 text-xs font-mono text-neutral-300 hover:text-cyan-300 hover:bg-cyan-500/10 transition cursor-pointer"
          >
            {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Share2 className="w-3.5 h-3.5" />}
            <span className="hidden sm:inline">{copied ? 'Link Copied' : 'Share'}</span>
          </button>
        </div>
      </div>

      {/* Article Header & Byline */}
      <div className="space-y-6 mb-8">
        {/* Meta Bar */}
        <div className="flex flex-wrap items-center gap-2.5">
          <span className="px-3 py-1 rounded-full bg-cyan-500/15 border border-cyan-500/30 text-cyan-300 font-mono text-xs font-bold uppercase tracking-wider">
            {article.category}
          </span>
          {article.isOfficial && (
            <span className="flex items-center gap-1 px-3 py-1 rounded-full bg-amber-500/15 border border-amber-500/30 text-amber-400 font-mono text-xs font-bold">
              <Sparkles className="w-3 h-3" />
              OFFICIAL BUREAU DISPATCH
            </span>
          )}
          <span className="flex items-center gap-1 text-xs font-mono text-neutral-400 ml-auto">
            <Clock className="w-3.5 h-3.5 text-neutral-500" />
            {article.readingTimeMinutes} min read
          </span>
        </div>

        {/* Title */}
        <h1 className="font-display font-bold text-2xl sm:text-4xl lg:text-5xl text-white tracking-tight leading-tight">
          {article.title}
        </h1>

        {/* Excerpt Lead */}
        {article.excerpt && (
          <p className="font-serif italic text-lg sm:text-xl text-neutral-300 leading-relaxed border-l-2 border-cyan-400 pl-4">
            {article.excerpt}
          </p>
        )}

        {/* Compulsory Verified Source Citation Box */}
        {article.sourceName && (
          <div className="p-3.5 sm:p-4 rounded-2xl bg-cyan-500/[0.06] border border-cyan-500/25 flex flex-col sm:flex-row sm:items-center justify-between gap-2">
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-cyan-400 animate-pulse shrink-0" />
              <span className="text-xs font-mono font-bold text-cyan-300">VERIFIED SOURCE / CITATION:</span>
              <span className="text-xs font-mono text-white font-medium">{article.sourceName}</span>
            </div>
            {article.sourceUrl && (
              <a
                href={article.sourceUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 px-3 py-1 rounded-xl bg-cyan-500/15 hover:bg-cyan-500/25 border border-cyan-500/30 text-cyan-200 text-xs font-mono transition self-start sm:self-auto"
              >
                <span>View Evidence / Document</span>
                <ArrowRight className="w-3 h-3" />
              </a>
            )}
          </div>
        )}

        {/* Author Byline Box */}
        <div className="flex items-center justify-between py-4 border-y border-white/[0.08]">
          <div className="flex items-center gap-3.5">
            <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-cyan-400 to-violet-500 p-0.5 shadow-md">
              <div className="w-full h-full rounded-[14px] bg-[#06080c] flex items-center justify-center font-display font-bold text-base text-white">
                {article.authorName[0]}
              </div>
            </div>
            <div>
              <span className="font-display font-bold text-sm text-white block">{article.authorName}</span>
              <span className="font-mono text-xs text-neutral-400">@{article.authorUsername} &bull; {publishDate}</span>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {/* Upvote */}
            <button
              onClick={() => upvoteArticle(article.id)}
              className={`flex items-center gap-2 px-4 py-2 rounded-2xl font-mono text-xs font-bold transition cursor-pointer border ${
                hasUpvoted
                  ? 'bg-emerald-500/15 border-emerald-500/30 text-emerald-300'
                  : 'bg-white/5 border border-white/10 text-neutral-300 hover:text-emerald-400 hover:bg-emerald-500/10'
              }`}
            >
              <ArrowUp className={`w-4 h-4 ${hasUpvoted ? 'fill-emerald-400' : ''}`} />
              <span>{article.upvotes}</span>
            </button>

            {/* Bookmark */}
            <button
              onClick={() => toggleBookmark(article.id)}
              className={`p-2.5 rounded-2xl border transition cursor-pointer ${
                hasBookmarked
                  ? 'bg-amber-500/15 border-amber-500/30 text-amber-400'
                  : 'bg-white/5 border-white/10 text-neutral-400 hover:text-amber-400'
              }`}
            >
              <Bookmark className={`w-4 h-4 ${hasBookmarked ? 'fill-amber-400' : ''}`} />
            </button>
          </div>
        </div>
      </div>

      {/* Hero Cover Image */}
      {article.coverImage && (
        <div className="mb-8 rounded-3xl overflow-hidden border border-white/10 shadow-[0_0_50px_rgba(0,0,0,0.6)]">
          <img
            src={article.coverImage}
            alt={article.title}
            className="w-full max-h-[480px] object-cover"
          />
        </div>
      )}

      {/* DUAL MODE BODY: Interactive Flex vs Full Article */}
      {isFlexMode ? (
        <div className="space-y-6 mb-12 animate-in fade-in duration-300">
          {/* Key Highlights Card */}
          <div className="p-5 sm:p-6 rounded-3xl bg-purple-500/[0.08] border border-purple-500/30 space-y-3">
            <div className="flex items-center gap-2 text-xs font-mono font-bold text-purple-300 uppercase tracking-wider">
              <Zap className="w-4 h-4 text-purple-400" />
              <span>⚡ Micro-Flex Digest &amp; Core Arguments</span>
            </div>
            <p className="text-sm text-neutral-200 leading-relaxed font-sans">
              {article.excerpt}
            </p>
          </div>

          {/* Sequential Thread Segments */}
          <div className="space-y-4 pt-2">
            <div className="flex items-center gap-2 text-xs font-mono text-neutral-400 pb-2 border-b border-white/[0.08]">
              <Layers className="w-3.5 h-3.5 text-cyan-400" />
              <span>EDITORIAL THREAD CLAUSES</span>
            </div>

            {article.content
              .replace(/<[^>]*>/g, '\n\n')
              .split(/\n\n+/)
              .filter((seg) => seg.trim().length > 20)
              .map((seg, idx, arr) => (
                <div
                  key={idx}
                  className="relative pl-6 sm:pl-8 before:absolute before:left-2 before:top-3 before:bottom-0 before:w-[2px] before:bg-gradient-to-b before:from-cyan-500/60 before:via-purple-500/40 before:to-transparent last:before:hidden"
                >
                  <div className="absolute left-0 top-1.5 w-4 h-4 rounded-full bg-cyan-500/20 border border-cyan-400 flex items-center justify-center font-mono text-[9px] font-bold text-cyan-300">
                    {idx + 1}
                  </div>

                  <div className="p-5 rounded-2xl bg-white/[0.03] border border-white/[0.08] hover:border-white/20 transition-all space-y-1.5 shadow-sm">
                    <span className="text-[10px] font-mono text-neutral-500">Segment [{idx + 1}/{arr.length}]</span>
                    <p className="text-sm sm:text-base text-neutral-100 leading-relaxed font-sans">
                      {seg.trim()}
                    </p>
                  </div>
                </div>
              ))}
          </div>
        </div>
      ) : (
        /* Rendered Standard HTML Article Body */
        <div
          className={`zen-article-content ${getFontSizeClass()} font-sans leading-relaxed text-neutral-200 selection:bg-cyan-500/30 mb-12`}
          dangerouslySetInnerHTML={{ __html: article.content }}
        />
      )}

      {/* Tags */}
      {article.tags.length > 0 && (
        <div className="pt-6 border-t border-white/[0.08] flex flex-wrap gap-2 mb-12">
          {article.tags.map((tag) => (
            <span
              key={tag}
              className="px-3 py-1 rounded-xl bg-white/[0.04] border border-white/10 text-xs font-mono text-neutral-400"
            >
              #{tag}
            </span>
          ))}
        </div>
      )}

      {/* Bottom Appreciation Card */}
      <div className="rounded-3xl p-6 sm:p-8 card-luxury border border-white/15 text-center space-y-4 mb-16">
        <h3 className="font-display font-bold text-xl text-white">Applaud this Dispatch</h3>
        <p className="text-xs font-mono text-neutral-400 max-w-md mx-auto">
          Help elevate verified youth journalism and impactful manifestos across the sovereign network.
        </p>

        <div className="flex items-center justify-center gap-3 pt-2">
          <button
            onClick={() => upvoteArticle(article.id)}
            className={`flex items-center gap-2 px-6 py-3 rounded-2xl font-mono text-xs font-bold transition cursor-pointer ${
              hasUpvoted
                ? 'bg-emerald-500 text-black'
                : 'bg-white hover:bg-neutral-200 text-black'
            }`}
          >
            <ArrowUp className="w-4 h-4" />
            <span>{hasUpvoted ? 'Upvoted (' + article.upvotes + ')' : 'Upvote Article (' + article.upvotes + ')'}</span>
          </button>
        </div>
      </div>

      {/* Comments Thread Section */}
      <div className="pt-8 border-t border-white/[0.08]">
        <CommentSection articleId={article.id} />
      </div>
    </div>
  );
}
