'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { 
  Radio, 
  Sparkles, 
  ArrowUpRight, 
  Clock, 
  Flame, 
  Search, 
  ChevronRight, 
  MessageSquare, 
  Layers, 
  CheckCircle2, 
  HelpCircle, 
  Globe2, 
  Building2, 
  BookOpen, 
  ExternalLink,
  Share2,
  Newspaper
} from 'lucide-react';
import { Navbar } from '@/components/layout/Navbar';
import { Footer } from '@/components/layout/Footer';
import { NewsStory, NewsCategory } from '@/types/news';

/* ─────────── ZERO SEEDED DATA (CLEAN LIVE PLATFORM) ─────────── */

const INITIAL_STORIES: NewsStory[] = [];

const SECTORS: NewsCategory[] = [
  'BREAKING',
  'INDIA',
  'WORLD',
  'YOUTH',
  'AI',
  'TECHNOLOGY',
  'EDUCATION',
  'ENVIRONMENT',
  'ECONOMY',
  'SOCIETY',
  'SCIENCE',
  'INTERNATIONAL_AFFAIRS'
];

const LS_NEWS = 'zenvitra_news_stories_v2_clean';

export default function ZenNewsPage() {
  const [stories, setStories] = useState<NewsStory[]>(() => {
    if (typeof window === 'undefined') return INITIAL_STORIES;
    try {
      const stored = localStorage.getItem(LS_NEWS);
      return stored ? JSON.parse(stored) : INITIAL_STORIES;
    } catch {
      return INITIAL_STORIES;
    }
  });

  // Persist to localStorage
  useEffect(() => {
    try {
      localStorage.setItem(LS_NEWS, JSON.stringify(stories));
    } catch {}
  }, [stories]);

  const [selectedSector, setSelectedSector] = useState<string>('ALL');
  const [searchQuery, setSearchQuery] = useState('');
  const [activeStoryId, setActiveStoryId] = useState<string>('');

  const filteredStories = stories.filter((s) => {
    const matchesSector = selectedSector === 'ALL' || s.category === selectedSector;
    const matchesSearch = s.headline.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          s.summary.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          s.location.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesSector && matchesSearch;
  });

  const activeStory = stories.find((s) => s.id === activeStoryId) || filteredStories[0] || stories[0];

  return (
    <div className="min-h-screen bg-[#030405] text-white flex flex-col font-sans selection:bg-purple-500/30">
      <Navbar />

      <main className="flex-1 pt-28 sm:pt-36 pb-20 max-w-[1800px] mx-auto px-4 sm:px-6 lg:px-10 w-full space-y-8">
        
        {/* HERO TICKER HEADER */}
        <div className="space-y-4 text-left border-b border-white/10 pb-8">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-rose-500/10 border border-rose-500/30 text-rose-300 font-mono text-xs uppercase tracking-wider">
              <span className="w-2 h-2 rounded-full bg-rose-500 animate-ping" />
              <span>ZEN.NEWS LIVE WIRE</span>
            </div>
            <div className="font-mono text-xs text-neutral-400">
              Developing Global Wire &bull; Verified Civic Intelligence
            </div>
          </div>

          <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-6">
            <div className="space-y-2 max-w-3xl">
              <h1 className="font-display font-bold text-3xl sm:text-4xl lg:text-5xl tracking-tight text-white">
                ZEN.NEWS
              </h1>
              <p className="font-sans text-sm sm:text-base text-neutral-400 font-light leading-relaxed">
                What is happening in the world, reported with continuous timeline updates, objective institutional context, and direct links into <Link href="/discussions" className="text-purple-300 underline font-medium">Open Discussions</Link>.
              </p>
            </div>

            <div className="flex items-center gap-3">
              <Link
                href="/press"
                className="px-5 py-2.5 rounded-full bg-white/5 hover:bg-white/10 border border-white/15 text-neutral-200 hover:text-white font-mono text-xs font-bold transition flex items-center gap-2"
              >
                <span>Read International Press &rarr;</span>
              </Link>
            </div>
          </div>
        </div>

        {/* SECTORS BAR & SEARCH */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2 overflow-x-auto w-full sm:w-auto pb-2 sm:pb-0 scrollbar-none">
            <button
              type="button"
              onClick={() => setSelectedSector('ALL')}
              className={`px-3.5 py-1.5 rounded-full font-mono text-xs transition cursor-pointer shrink-0 border ${
                selectedSector === 'ALL'
                  ? 'bg-white text-black border-white font-bold shadow-[0_0_15px_rgba(255,255,255,0.3)]'
                  : 'bg-white/5 border-white/10 text-neutral-400 hover:text-white'
              }`}
            >
              ALL SECTORS
            </button>
            {SECTORS.map((sec) => (
              <button
                key={sec}
                type="button"
                onClick={() => setSelectedSector(sec)}
                className={`px-3 py-1.5 rounded-full font-mono text-xs transition cursor-pointer shrink-0 border ${
                  selectedSector === sec
                    ? 'bg-purple-500/20 text-purple-300 border-purple-400 font-bold shadow-[0_0_15px_rgba(168,85,247,0.3)]'
                    : 'bg-white/5 border-white/10 text-neutral-400 hover:text-white'
                }`}
              >
                {sec.replace('_', ' ')}
              </button>
            ))}
          </div>

          <div className="relative w-full sm:w-72 shrink-0">
            <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-neutral-500" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search news & timeline wire..."
              className="w-full pl-9 pr-4 py-2 rounded-full bg-white/5 border border-white/10 text-xs text-white placeholder-neutral-500 focus:outline-none focus:border-purple-400 transition"
            />
          </div>
        </div>

        {/* 2-COLUMN NEWS STORY & TIMELINE DOSSIER */}
        {filteredStories.length === 0 || !activeStory ? (
          <div className="p-12 sm:p-16 rounded-3xl border border-white/10 bg-white/[0.02] text-center space-y-5 max-w-xl mx-auto">
            <div className="w-14 h-14 rounded-2xl bg-rose-500/10 border border-rose-500/30 flex items-center justify-center mx-auto text-rose-400 shadow-[0_0_20px_rgba(244,63,94,0.2)]">
              <Newspaper className="w-7 h-7" />
            </div>
            <div className="space-y-2">
              <h3 className="font-display font-bold text-xl text-white">No Live Wire Dispatches Yet</h3>
              <p className="text-xs sm:text-sm text-neutral-400 font-light max-w-md mx-auto leading-relaxed font-sans">
                Real journalistic accountability only. Check back for verified press updates, or explore live parliamentary archives in ZEN.PRESS.
              </p>
            </div>
            <Link
              href="/press"
              className="inline-flex items-center justify-center px-6 py-3 rounded-full bg-white text-black font-display font-bold text-xs uppercase tracking-wider hover:bg-neutral-200 transition shadow-[0_0_20px_rgba(255,255,255,0.3)] cursor-pointer"
            >
              Explore ZEN.PRESS Dispatches &rarr;
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 text-left">
            
            {/* LEFT LIST: LIVE STORIES (5 COLS) */}
            <div className="lg:col-span-5 space-y-3.5">
              <div className="flex items-center justify-between px-1">
                <span className="font-mono text-xs text-neutral-400 uppercase tracking-widest font-bold">
                  DEVELOPING STORIES ({filteredStories.length})
                </span>
              </div>

            <div className="space-y-3.5">
              {filteredStories.map((story) => {
                const isSelected = story.id === activeStory.id;
                return (
                  <div
                    key={story.id}
                    onClick={() => setActiveStoryId(story.id)}
                    className={`p-5 rounded-2xl border transition-all duration-300 cursor-pointer space-y-3 ${
                      isSelected
                        ? 'bg-gradient-to-b from-[#18132e] to-[#0c0916] border-purple-500/50 shadow-[0_0_25px_rgba(168,85,247,0.2)]'
                        : 'bg-white/[0.02] border-white/10 hover:border-white/20 hover:bg-white/[0.04]'
                    }`}
                  >
                    <div className="flex items-center justify-between gap-2">
                      <span className="px-2 py-0.5 rounded-full bg-rose-500/10 text-rose-300 border border-rose-500/20 font-mono text-[9px] font-bold uppercase">
                        {story.category}
                      </span>
                      <span className="font-mono text-[10px] text-emerald-400 flex items-center gap-1">
                        <span className="w-1 h-1 rounded-full bg-emerald-400" />
                        {story.timeline.length} TIMELINE UPDATES
                      </span>
                    </div>

                    <h3 className="font-display font-bold text-base text-white leading-snug">
                      {story.headline}
                    </h3>

                    <p className="font-sans text-xs text-neutral-400 line-clamp-2">
                      {story.summary}
                    </p>

                    <div className="flex items-center justify-between text-[10px] font-mono text-neutral-500 border-t border-white/5 pt-2">
                      <span>{story.location}</span>
                      <span className="text-purple-300 font-semibold flex items-center gap-1">
                        Inspect Dossier &rarr;
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* RIGHT VIEW: STORY DOSSIER & TIMELINE & ZEN.CONTEXT (7 COLS) */}
          <div className="lg:col-span-7 space-y-6">
            
            {/* DOSSIER CARD */}
            <div className="p-6 sm:p-8 rounded-3xl bg-gradient-to-b from-[#141026] via-[#0b0816] to-[#05040a] border border-purple-500/30 shadow-[0_20px_50px_rgba(0,0,0,0.8)] space-y-5">
              
              <div className="flex flex-wrap items-center justify-between gap-2">
                <div className="flex items-center gap-2">
                  <span className="px-3 py-1 rounded-full bg-rose-500/20 text-rose-300 border border-rose-500/30 font-mono text-xs font-bold">
                    {activeStory.category}
                  </span>
                  <span className="font-mono text-xs text-neutral-400">
                    📍 {activeStory.location}
                  </span>
                </div>

                {/* DISCUSS THIS STORY ONE-CLICK BRIDGE */}
                {activeStory.linkedDiscussionId && (
                  <Link
                    href={`/discussions?originNews=${activeStory.id}`}
                    className="px-4 py-1.5 rounded-full bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white font-mono text-xs font-bold transition flex items-center gap-1.5 shadow-[0_0_15px_rgba(168,85,247,0.35)]"
                  >
                    <MessageSquare className="w-3.5 h-3.5" />
                    <span>Discuss This Story ↗</span>
                  </Link>
                )}
              </div>

              <h2 className="font-display font-black text-2xl sm:text-3xl text-white tracking-tight leading-tight">
                {activeStory.headline}
              </h2>

              <p className="font-sans text-sm sm:text-base text-neutral-300 font-light leading-relaxed">
                {activeStory.summary}
              </p>

              {/* WHAT HAPPENED SECTION */}
              <div className="p-4 rounded-2xl bg-black/40 border border-white/10 space-y-1.5">
                <span className="text-[10px] font-mono text-purple-300 uppercase tracking-widest font-bold">
                  WHAT HAPPENED (PRIMARY DISPATCH)
                </span>
                <p className="font-sans text-xs sm:text-sm text-neutral-300 font-light leading-relaxed">
                  {activeStory.whatHappened}
                </p>
              </div>

              {/* DEVELOPING STORY TIMELINE */}
              <div className="space-y-3 pt-2">
                <span className="font-mono text-xs text-neutral-300 uppercase tracking-widest font-bold flex items-center gap-2">
                  <Clock className="w-4 h-4 text-purple-400" />
                  <span>DEVELOPING TIMELINE UPDATES</span>
                </span>

                <div className="space-y-2.5">
                  {activeStory.timeline.map((update) => (
                    <div
                      key={update.id}
                      className="p-3.5 rounded-xl bg-white/[0.02] border border-white/10 flex flex-col gap-1"
                    >
                      <div className="flex items-center justify-between text-xs font-mono">
                        <span className="text-amber-300 font-bold">{update.time}</span>
                        <span className="text-[10px] text-neutral-400 bg-white/5 px-2 py-0.5 rounded">
                          Source: {update.sourceName}
                        </span>
                      </div>
                      <h4 className="font-display font-bold text-sm text-white">{update.headline}</h4>
                      <p className="font-sans text-xs text-neutral-300 font-light">{update.content}</p>
                    </div>
                  ))}
                </div>
              </div>

              {/* WHAT WE KNOW VS WHAT REMAINS UNCLEAR */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
                <div className="p-4 rounded-2xl bg-emerald-950/20 border border-emerald-500/25 space-y-2 font-mono text-xs">
                  <div className="flex items-center gap-2 text-emerald-300 font-bold">
                    <CheckCircle2 className="w-4 h-4" />
                    <span>WHAT WE KNOW</span>
                  </div>
                  <ul className="space-y-1 text-neutral-300 font-sans text-xs">
                    {activeStory.whatWeKnow.map((item, idx) => (
                      <li key={idx} className="flex items-start gap-1.5">
                        <span className="text-emerald-400 mt-0.5">&#x2022;</span>
                        <span>{item}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="p-4 rounded-2xl bg-rose-950/20 border border-rose-500/25 space-y-2 font-mono text-xs">
                  <div className="flex items-center gap-2 text-rose-300 font-bold">
                    <HelpCircle className="w-4 h-4" />
                    <span>WHAT REMAINS UNCLEAR</span>
                  </div>
                  <ul className="space-y-1 text-neutral-300 font-sans text-xs">
                    {activeStory.whatRemainsUnclear.map((item, idx) => (
                      <li key={idx} className="flex items-start gap-1.5">
                        <span className="text-rose-400 mt-0.5">&#x2022;</span>
                        <span>{item}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>

              {/* ZEN.CONTEXT EXPLANATION LAYER */}
              <div className="p-5 rounded-2xl bg-purple-950/20 border border-purple-500/30 space-y-3 font-mono text-xs">
                <div className="flex items-center justify-between text-purple-300 font-bold">
                  <div className="flex items-center gap-2">
                    <BookOpen className="w-4 h-4" />
                    <span>ZEN.CONTEXT &mdash; UNDERSTAND THIS STORY</span>
                  </div>
                  <span className="text-[10px] bg-purple-500/20 px-2 py-0.5 rounded text-purple-200">
                    EXPLANATION LAYER
                  </span>
                </div>

                <p className="text-xs text-neutral-300 font-sans leading-relaxed">
                  {activeStory.contextExplanation.background}
                </p>

                <div className="pt-2 border-t border-purple-500/20 space-y-1.5">
                  <span className="text-[10px] uppercase text-neutral-400 font-bold block">
                    KEY DEFINITIONS:
                  </span>
                  {activeStory.contextExplanation.keyTerms.map((kt, i) => (
                    <div key={i} className="text-xs text-neutral-300">
                      <strong className="text-white">{kt.term}:</strong> {kt.definition}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </main>

    <Footer />
    </div>
  );
}
