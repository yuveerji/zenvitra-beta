'use client';

import React, { useState } from 'react';
import {
  PenLine,
  Search,
  SlidersHorizontal,
  Flame,
  Clock,
  Sparkles,
  Newspaper,
  BookOpen,
  ArrowUpRight,
  Radio,
  ArrowUp,
  ArrowRight,
  Zap
} from 'lucide-react';
import { useZenPress } from '@/context/ZenPressPlatformContext';
import { ArticleCard } from './ArticleCard';
import { PressArticle, PressCategory, PressSortBy } from '@/types/press';
import { ZenFlexReaderModal, FlexReaderItem } from '@/components/pulse/ZenFlexReaderModal';
import { INITIAL_SPARKS, ZenSpark } from '@/types/sparks';
import { ZenSparkCard } from '@/components/pulse/ZenSparkCard';

const CATEGORIES: (PressCategory | 'ALL')[] = [
  'ALL',
  'MANIFESTO',
  'ARCHITECTURE',
  'UPDATES',
  'EDITORIAL',
  'COMMUNITY',
];

export function PressFeed() {
  const {
    filteredArticles,
    activeCategory,
    setActiveCategory,
    sortBy,
    setSortBy,
    searchQuery,
    setSearchQuery,
    setActiveView,
    setActiveArticleId,
    upvoteArticle,
    toggleBookmark,
    bookmarkedArticles
  } = useZenPress();

  const [activeFlexItem, setActiveFlexItem] = useState<FlexReaderItem | null>(null);

  const handleOpenFlexArticle = (article: PressArticle) => {
    setActiveFlexItem({
      id: article.id,
      type: 'article_flex',
      title: article.title,
      content: article.content,
      authorName: article.authorName,
      authorUsername: article.authorUsername,
      createdAt: article.publishedAt ? new Date(article.publishedAt).toLocaleDateString() : 'Recent',
      likes: article.upvotes,
      category: article.category,
      readingTimeMinutes: article.readingTimeMinutes,
      images: article.coverImage ? [article.coverImage] : undefined,
      keyTakeaways: [
        article.excerpt,
        `Category: ${article.category} • Certified Editorial`,
        `Official Diplomatic Wire Reference: DOI #${article.id.slice(0, 8).toUpperCase()}`
      ],
      threadSegments: article.content.split(/\n\n+/).filter((s) => s.trim().length > 0),
    });
  };

  const handleOpenSpark = (spark: ZenSpark) => {
    setActiveFlexItem({
      id: spark.id,
      type: 'spark',
      title: spark.title,
      content: spark.summary,
      authorName: spark.authorName,
      authorUsername: spark.authorUsername,
      authorAvatar: spark.authorAvatar,
      createdAt: spark.createdAt,
      likes: spark.likes,
      category: spark.category,
      readingTimeMinutes: spark.readingTimeMinutes,
      keyTakeaways: spark.keyTakeaways,
      fullDossier: spark.fullDossier,
      treatyClauseReference: spark.treatyClauseReference,
      threadSegments: spark.fullDossier.split(/\n\n+/).filter((s) => s.trim().length > 0),
    });
  };

  // Find a hero featured article (e.g. first official or highest upvoted)
  const heroArticle = filteredArticles.find((a) => a.isOfficial) || filteredArticles[0];
  const gridArticles = filteredArticles.filter((a) => a.id !== heroArticle?.id);

  return (
    <div className="max-w-6xl mx-auto font-sans pb-16 space-y-8">
      {/* Header Telemetry */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-white/[0.08]">
        <div className="space-y-1">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-500/10 border border-cyan-500/30 text-cyan-400 font-mono text-[10px] font-bold tracking-wider">
            <Radio className="w-3 h-3 animate-pulse" />
            <span>AUTONOMOUS PRESS WIRE</span>
          </div>
          <h1 className="font-display font-bold text-2xl sm:text-4xl text-white tracking-wide">
            ZEN.PRESS
          </h1>
          <p className="text-xs font-mono text-neutral-400">
            Student dispatches, architectural manifestos, and verified youth investigations.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={() => setActiveView('editor')}
            className="flex items-center gap-2 px-5 py-2.5 rounded-2xl bg-white hover:bg-neutral-200 text-black font-display font-bold text-xs uppercase tracking-wider transition cursor-pointer"
          >
            <PenLine className="w-4 h-4" />
            <span>Draft Dispatch</span>
          </button>
        </div>
      </div>

      {/* Breaking Wire Ticker */}
      <div className="p-3 sm:p-3.5 rounded-2xl bg-[#090b12] border border-white/10 flex items-center gap-3 overflow-hidden shadow-lg relative group">
        <div className="flex items-center gap-1.5 px-3 py-1 rounded-xl bg-cyan-500/15 border border-cyan-500/30 text-cyan-300 font-mono text-[10px] font-bold shrink-0 z-10 shadow-sm backdrop-blur-md">
          <Flame className="w-3.5 h-3.5 text-cyan-400 animate-pulse" />
          <span className="tracking-wider">BREAKING WIRE</span>
        </div>
        <div className="relative flex-1 overflow-hidden font-mono text-xs text-neutral-200 mask-radial">
          <div className="animate-marquee-wire flex items-center gap-8 text-xs text-neutral-300">
            <span>★ [DISPATCH] Global Youth Assembly adopts Zero-Knowledge governance model for student councils</span>
            <span className="text-cyan-400 font-bold">•</span>
            <span>★ [EDITORIAL] Why decentralized youth diplomacy outperforms legacy multilateral institutions</span>
            <span className="text-amber-400 font-bold">•</span>
            <span>★ [ARCHIVE] DOI #10.8492/zenvitra.2026.01 verified on ledger</span>
            <span className="text-pink-400 font-bold">•</span>
            <span>★ [SUMMIT WIRE] 40+ Member Chambers Ratify Open Civic Consensus Protocol</span>
            <span className="text-emerald-400 font-bold">•</span>
            {/* Duplicate track for seamless infinite marquee loop */}
            <span>★ [DISPATCH] Global Youth Assembly adopts Zero-Knowledge governance model for student councils</span>
            <span className="text-cyan-400 font-bold">•</span>
            <span>★ [EDITORIAL] Why decentralized youth diplomacy outperforms legacy multilateral institutions</span>
            <span className="text-amber-400 font-bold">•</span>
            <span>★ [ARCHIVE] DOI #10.8492/zenvitra.2026.01 verified on ledger</span>
            <span className="text-pink-400 font-bold">•</span>
            <span>★ [SUMMIT WIRE] 40+ Member Chambers Ratify Open Civic Consensus Protocol</span>
          </div>
        </div>
      </div>

      {/* ── ⚡ 5-MINUTE SPARKS & POLICY BRIEFS RAIL ON ZEN.PRESS ── */}
      {INITIAL_SPARKS.length > 0 && (
        <div className="space-y-3 pt-1">
          <div className="flex items-center justify-between px-1">
            <div className="flex items-center gap-2">
              <div className="p-1 rounded-lg bg-amber-400/15 border border-amber-400/30">
                <Zap className="w-4 h-4 text-amber-400" />
              </div>
              <div className="flex items-center gap-2">
                <span className="font-display font-bold text-sm text-white uppercase tracking-wider">
                  ⚡ 5-Minute Sparks &amp; Policy Briefs
                </span>
                <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-amber-400/20 text-amber-300 border border-amber-400/40 font-bold">
                  FAST READS
                </span>
              </div>
            </div>
            <span className="text-[11px] font-mono text-neutral-400 hidden sm:inline">
              Concise sovereign dossiers • 5 min read time
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {INITIAL_SPARKS.map((spark) => (
              <ZenSparkCard
                key={spark.id}
                spark={spark}
                onBookmark={() => {}}
                onOpenFlex={handleOpenSpark}
              />
            ))}
          </div>
        </div>
      )}

      {/* Hero Featured Article Card */}
      {heroArticle && (
        <div
          onClick={() => { setActiveArticleId(heroArticle.id); setActiveView('article'); }}
          className="group relative rounded-3xl overflow-hidden bg-[#07080c] border border-white/10 hover:border-white/25 transition-all duration-300 cursor-pointer shadow-xl"
        >
          <div className="grid grid-cols-1 lg:grid-cols-2">
            {/* Cover Image */}
            <div className="relative h-64 lg:h-auto min-h-[280px] overflow-hidden bg-neutral-900">
              {heroArticle.coverImage ? (
                <img
                  src={heroArticle.coverImage}
                  alt={heroArticle.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 opacity-90"
                />
              ) : (
                <div className="w-full h-full bg-gradient-to-tr from-indigo-950 via-[#060810] to-black flex items-center justify-center p-8">
                  <Sparkles className="w-16 h-16 text-white/20" />
                </div>
              )}
              <div className="absolute inset-0 bg-gradient-to-t lg:bg-gradient-to-r from-black/80 via-transparent to-transparent pointer-events-none" />

              <div className="absolute top-4 left-4 inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-black/70 backdrop-blur-md border border-amber-500/40 text-amber-400 font-mono text-[10px] font-bold">
                <Flame className="w-3 h-3 text-amber-400" />
                <span>EDITOR&apos;S CHOICE WIRE</span>
              </div>
            </div>

            {/* Details */}
            <div className="p-6 sm:p-8 flex flex-col justify-between space-y-6">
              <div className="space-y-3">
                <div className="flex items-center gap-2">
                  <span className="px-2.5 py-0.5 rounded-full bg-cyan-500/15 border border-cyan-500/30 text-cyan-300 font-mono text-[10px] font-bold uppercase tracking-wider">
                    {heroArticle.category}
                  </span>
                  <span className="flex items-center gap-1 text-[10px] font-mono text-neutral-400">
                    <Clock className="w-3 h-3 text-neutral-500" />
                    {heroArticle.readingTimeMinutes} min read
                  </span>
                </div>

                <h2 className="font-display font-bold text-xl sm:text-2xl text-white group-hover:text-cyan-300 transition leading-snug">
                  {heroArticle.title}
                </h2>

                <p className="text-xs sm:text-sm text-neutral-300 line-clamp-3 leading-relaxed font-sans">
                  {heroArticle.excerpt}
                </p>
              </div>

              {/* Author & Footer */}
              <div className="pt-4 border-t border-white/[0.08] flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-cyan-400 to-violet-500 p-0.5 shadow-md">
                    <div className="w-full h-full rounded-[10px] bg-[#06080c] flex items-center justify-center font-display font-bold text-xs text-white uppercase">
                      {heroArticle.authorName[0]}
                    </div>
                  </div>
                  <div>
                    <span className="font-display font-bold text-xs text-white block">{heroArticle.authorName}</span>
                    <span className="font-mono text-[10px] text-neutral-500">@{heroArticle.authorUsername}</span>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleOpenFlexArticle(heroArticle);
                    }}
                    className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-purple-500/20 hover:bg-purple-500/30 border border-purple-500/40 text-purple-300 font-mono text-xs font-bold transition shadow-sm cursor-pointer"
                  >
                    <span>Read Flex</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>

                  <div className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 font-mono text-xs font-bold">
                    <ArrowUp className="w-3.5 h-3.5 fill-emerald-400" />
                    <span>{heroArticle.upvotes} Upvotes</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Filter and Search Bar */}
      <div className="space-y-4">
        <div className="flex flex-col md:flex-row items-center justify-between gap-4">
          {/* Category Filter Pills */}
          <div className="flex gap-2 overflow-x-auto scrollbar-none pb-2 w-full md:w-auto">
            {CATEGORIES.map((cat) => (
              <button
                key={cat}
                onClick={() => setActiveCategory(cat)}
                className={`px-3.5 py-1.5 rounded-xl text-xs font-mono font-semibold transition cursor-pointer shrink-0 border ${
                  activeCategory === cat
                    ? 'bg-cyan-500/15 border-cyan-500/40 text-cyan-300'
                    : 'bg-white/[0.02] border-white/[0.08] text-neutral-400 hover:text-white hover:bg-white/[0.05]'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>

          {/* Sort & Search Controls */}
          <div className="flex items-center gap-3 w-full md:w-auto">
            {/* Sort Toggle */}
            <div className="flex p-1 rounded-xl bg-white/[0.04] border border-white/10 font-mono text-xs">
              {[
                { id: 'latest', label: 'Latest' },
                { id: 'popular', label: 'Popular' },
              ].map((s) => (
                <button
                  key={s.id}
                  onClick={() => setSortBy(s.id as PressSortBy)}
                  className={`px-3 py-1 rounded-lg font-semibold transition cursor-pointer ${
                    sortBy === s.id
                      ? 'bg-white text-black shadow-sm'
                      : 'text-neutral-400 hover:text-white'
                  }`}
                >
                  {s.label}
                </button>
              ))}
            </div>

            {/* Search Input */}
            <div className="relative flex-1 md:w-60">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-neutral-500" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search articles, tags..."
                className="w-full pl-9 pr-3 py-2 rounded-xl bg-white/[0.04] border border-white/10 text-xs font-mono text-white placeholder:text-neutral-600 focus:outline-none focus:border-cyan-500/50"
              />
            </div>
          </div>
        </div>
      </div>

      {/* Articles Grid */}
      <div>
        {filteredArticles.length === 0 ? (
          <div className="rounded-3xl p-12 text-center card-luxury border border-white/[0.08] my-8 space-y-4">
            <div className="w-16 h-16 rounded-3xl bg-white/[0.04] border border-white/10 flex items-center justify-center mx-auto">
              <Newspaper className="w-8 h-8 text-neutral-500" />
            </div>
            <div>
              <h3 className="font-display font-bold text-lg text-white">No Dispatches Found</h3>
              <p className="text-xs font-mono text-neutral-400 max-w-sm mx-auto mt-1">
                No published articles match your active filter criteria.
              </p>
            </div>
            <button
              onClick={() => setActiveView('editor')}
              className="px-5 py-2.5 rounded-2xl bg-white text-black font-mono text-xs font-bold hover:bg-neutral-200 transition cursor-pointer shadow-lg"
            >
              Draft the First Column
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {gridArticles.map((article) => (
              <ArticleCard key={article.id} article={article} onOpenFlex={handleOpenFlexArticle} />
            ))}
          </div>
        )}
      </div>

      {/* ── Immersive Flex Reader Modal ── */}
      <ZenFlexReaderModal
        isOpen={Boolean(activeFlexItem)}
        onClose={() => setActiveFlexItem(null)}
        item={activeFlexItem}
        onLike={(id) => upvoteArticle(id)}
        onBookmark={(id) => toggleBookmark(id)}
        isLiked={activeFlexItem ? activeFlexItem.likes > 0 : false}
        isSaved={activeFlexItem ? bookmarkedArticles.some((a) => a.id === activeFlexItem.id) : false}
      />
    </div>
  );
}
