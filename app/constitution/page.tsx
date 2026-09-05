'use client';

import React, { useState, useMemo, useEffect, useRef } from 'react';
import Link from 'next/link';
import { 
  Shield, 
  Sparkles, 
  BookOpen, 
  Scale, 
  HeartHandshake, 
  CheckCircle2, 
  Flame, 
  Search, 
  Check, 
  FileText, 
  Globe2, 
  Lock, 
  Users, 
  Zap, 
  Award,
  ArrowRight,
  ExternalLink,
  Crown,
  Share2,
  FileEdit,
  X,
  AlertTriangle,
  Send,
  Copy
} from 'lucide-react';
import { Navbar } from '@/components/layout/Navbar';
import { InteractiveWordHover } from '@/components/home/InteractiveWordHover';
import { EnterZenvitraButton } from '@/components/ui/EnterZenvitraButton';
import { AmendmentModal } from '@/components/constitution/AmendmentModal';
import { useReaderTheme } from '@/hooks/useReaderTheme';
import { ReaderThemeToggle } from '@/components/ui/ReaderThemeToggle';

import { 
  CONSTITUTION_ARTICLES, 
  type ArticleSection, 
  type ConstitutionalClause 
} from '@/lib/constitutionData';

export default function ConstitutionPage() {
  const { isLight, toggleTheme } = useReaderTheme();
  const [searchQuery, setSearchQuery] = useState('');
  const [activeArticleId, setActiveArticleId] = useState<string>('article-1');
  const [copiedSection, setCopiedSection] = useState<string | null>(null);
  const [amendmentModalOpen, setAmendmentModalOpen] = useState(false);

  const filteredArticles = useMemo(() => {
    if (!searchQuery.trim()) return CONSTITUTION_ARTICLES;
    const q = searchQuery.toLowerCase();
    return CONSTITUTION_ARTICLES.map((article) => {
      const matchTitle = article.title.toLowerCase().includes(q);
      const matchSummary = article.summary.toLowerCase().includes(q);
      const matchingSections = article.sections.filter(
        (s) =>
          s.heading.toLowerCase().includes(q) ||
          s.content.some((c) => c.toLowerCase().includes(q)) ||
          (s.callout && s.callout.toLowerCase().includes(q))
      );
      if (matchTitle || matchSummary || matchingSections.length > 0) {
        return {
          ...article,
          sections: matchingSections.length > 0 ? matchingSections : article.sections
        };
      }
      return null;
    }).filter(Boolean) as ArticleSection[];
  }, [searchQuery]);

  // Ref to the sidebar navigation container to auto-scroll active items into view
  const sidebarNavRef = useRef<HTMLElement | null>(null);
  const isClickScrollingRef = useRef(false);

  // Sync active article on scroll using IntersectionObserver
  useEffect(() => {
    if (typeof window === 'undefined') return;

    const observer = new IntersectionObserver(
      (entries) => {
        if (isClickScrollingRef.current) return;

        // Find intersecting entries
        const visibleEntries = entries.filter((e) => e.isIntersecting);
        if (visibleEntries.length > 0) {
          // Sort by their position on screen
          visibleEntries.sort((a, b) => {
            return Math.abs(a.boundingClientRect.top - 120) - Math.abs(b.boundingClientRect.top - 120);
          });
          const currentId = visibleEntries[0].target.id;
          if (currentId) {
            setActiveArticleId(currentId);
          }
        }
      },
      {
        rootMargin: '-10% 0px -70% 0px',
        threshold: [0, 0.1, 0.25, 0.5]
      }
    );

    CONSTITUTION_ARTICLES.forEach((art) => {
      const el = document.getElementById(art.id);
      if (el) observer.observe(el);
    });

    return () => observer.disconnect();
  }, [filteredArticles]);

  // Auto-scroll the sidebar item into view inside the sticky container when activeArticleId changes
  useEffect(() => {
    if (!sidebarNavRef.current) return;
    const activeItem = sidebarNavRef.current.querySelector(`[data-article-id="${activeArticleId}"]`) as HTMLElement | null;
    if (activeItem) {
      activeItem.scrollIntoView({
        behavior: 'smooth',
        block: 'nearest',
        inline: 'nearest'
      });
    }
  }, [activeArticleId]);

  const handleCopyLink = (id: string) => {
    if (typeof window !== 'undefined') {
      const url = `${window.location.origin}/constitution#${id}`;
      navigator.clipboard.writeText(url);
      setCopiedSection(id);
      setTimeout(() => setCopiedSection(null), 2000);
    }
  };

  return (
    <div className={`min-h-screen font-sans relative pt-16 sm:pt-20 transition-colors duration-200 ${
      isLight 
        ? 'bg-[#fcfaf7] text-stone-900 selection:bg-amber-200 selection:text-amber-950' 
        : 'bg-[#030405] text-white selection:bg-amber-400 selection:text-black'
    }`}>
      <Navbar />

      {/* Ambient background glows */}
      {!isLight && (
        <>
          <div className="fixed top-0 left-1/2 -translate-x-1/2 w-[1000px] h-[600px] bg-gradient-to-b from-amber-500/[0.04] via-rose-500/[0.02] to-transparent blur-[160px] pointer-events-none z-0" />
          <div className="fixed bottom-0 right-0 w-[700px] h-[700px] bg-cyan-500/[0.02] rounded-full blur-[180px] pointer-events-none z-0" />
          <div className="fixed inset-0 pointer-events-none bg-[radial-gradient(#ffffff08_1px,transparent_1px)] [background-size:36px_36px] opacity-40 z-0" />
        </>
      )}

      {/* Main Container */}
      <main className="relative z-10 max-w-7xl mx-auto px-6 sm:px-10 lg:px-12 py-12 sm:py-20 space-y-16">
        
        {/* ── 1. CONSTITUTIONAL BANNER & HERO ── */}
        <section className="text-left space-y-8 max-w-5xl">
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div className={`inline-flex items-center gap-2.5 px-4 py-1.5 rounded-full border font-mono text-[10px] sm:text-xs font-bold uppercase tracking-widest ${
              isLight
                ? 'bg-amber-100/80 text-amber-900 border-amber-300'
                : 'border-amber-500/30 bg-amber-500/10 text-amber-300 shadow-[0_0_20px_rgba(245,158,11,0.15)]'
            }`}>
              <Crown className="w-3.5 h-3.5 text-amber-500" />
              <span>FOUNDATIONAL CHARTER &bull; RATIFIED GENESIS 2026 &bull; IMMUTABLE LAW</span>
            </div>

            <ReaderThemeToggle isLight={isLight} onToggle={toggleTheme} />
          </div>

          <div className="space-y-4">
            <h1 className={`font-display font-black text-5xl sm:text-7xl lg:text-8xl tracking-tight uppercase leading-[0.92] ${
              isLight ? 'text-stone-950' : 'text-white'
            }`}>
              THE CONSTITUTION <br />
              <span className={`font-serif italic font-light ${isLight ? 'text-amber-800' : 'text-[#efe7dc]'}`}>OF ZENVITRA.</span>
            </h1>
            <div className={`text-sm sm:text-lg font-light leading-relaxed max-w-3xl font-sans ${
              isLight ? 'text-stone-700' : 'text-neutral-300'
            }`}>
              The supreme legal, ethical, and organizational charter of Zenvitra. Establishing{' '}
              <InteractiveWordHover termKey="sovereign-youth-agency" side="bottom">
                <span className={`font-medium underline decoration-amber-400/60 underline-offset-4 hover:decoration-amber-300 cursor-pointer ${
                  isLight ? 'text-stone-900' : 'text-white'
                }`}>
                  sovereign youth agency
                </span>
              </InteractiveWordHover>
              , a categorical prohibition against{' '}
              <InteractiveWordHover termKey="zero-surveillance" side="bottom">
                <span className={`font-medium underline decoration-purple-400/60 underline-offset-4 hover:decoration-purple-300 cursor-pointer ${
                  isLight ? 'text-stone-900' : 'text-white'
                }`}>
                  commercial ad surveillance
                </span>
              </InteractiveWordHover>
              , the supremacy of{' '}
              <InteractiveWordHover termKey="empirical-truth" side="bottom">
                <span className={`font-medium underline decoration-cyan-400/60 underline-offset-4 hover:decoration-cyan-300 cursor-pointer ${
                  isLight ? 'text-stone-900' : 'text-white'
                }`}>
                  empirical truth
                </span>
              </InteractiveWordHover>
              , and an unbreachable{' '}
              <InteractiveWordHover termKey="educational-endowment" side="bottom">
                <span className="text-emerald-500 font-medium underline decoration-emerald-400/60 underline-offset-4 hover:decoration-emerald-300 cursor-pointer">
                  25% profit educational endowment
                </span>
              </InteractiveWordHover>{' '}
              distributed every 4 months with offline video proof and public receipts.
            </div>
          </div>

          {/* Quick Metrics & Badges */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-2">
            <div className={`p-4 rounded-2xl border space-y-1 ${
              isLight ? 'bg-white border-stone-200 shadow-xs' : 'bg-white/[0.03] border-white/10'
            }`}>
              <span className={`text-[10px] font-mono uppercase tracking-widest ${isLight ? 'text-stone-500' : 'text-neutral-400'}`}>ARTICLES</span>
              <p className={`text-xl font-bold font-display ${isLight ? 'text-stone-950' : 'text-white'}`}>XI Articles</p>
              <p className={`text-[11px] font-mono ${isLight ? 'text-stone-500' : 'text-neutral-500'}`}>48 Operational Clauses</p>
            </div>
            <div className={`p-4 rounded-2xl border space-y-1 ${
              isLight ? 'bg-emerald-50 border-emerald-200' : 'bg-emerald-500/[0.05] border-emerald-500/20'
            }`}>
              <span className={`text-[10px] font-mono uppercase tracking-widest ${isLight ? 'text-emerald-700' : 'text-emerald-400'}`}>PROFIT ESCROW</span>
              <p className={`text-xl font-bold font-display ${isLight ? 'text-emerald-900' : 'text-emerald-300'}`}>25.0% Profit</p>
              <p className={`text-[11px] font-mono ${isLight ? 'text-emerald-600' : 'text-emerald-500/80'}`}>Every 4 Mos + Video Proof</p>
            </div>
            <div className={`p-4 rounded-2xl border space-y-1 ${
              isLight ? 'bg-cyan-50 border-cyan-200' : 'bg-cyan-500/[0.05] border-cyan-500/20'
            }`}>
              <span className={`text-[10px] font-mono uppercase tracking-widest ${isLight ? 'text-cyan-700' : 'text-cyan-400'}`}>SURVEILLANCE</span>
              <p className={`text-xl font-bold font-display ${isLight ? 'text-cyan-900' : 'text-cyan-300'}`}>Zero (0.0%)</p>
              <p className={`text-[11px] font-mono ${isLight ? 'text-cyan-600' : 'text-cyan-500/80'}`}>No Behavioral Ads</p>
            </div>
            <div className={`p-4 rounded-2xl border space-y-1 ${
              isLight ? 'bg-purple-50 border-purple-200' : 'bg-purple-500/[0.05] border-purple-500/20'
            }`}>
              <span className={`text-[10px] font-mono uppercase tracking-widest ${isLight ? 'text-purple-700' : 'text-purple-400'}`}>AUTHORITY</span>
              <p className={`text-xl font-bold font-display ${isLight ? 'text-purple-900' : 'text-purple-300'}`}>Plenary Youth</p>
              <p className={`text-[11px] font-mono ${isLight ? 'text-purple-600' : 'text-purple-500/80'}`}>Universal Assembly</p>
            </div>
          </div>
        </section>

        {/* ── 2. PREAMBLE CARD ── */}
        <section className={`p-8 sm:p-12 rounded-3xl border shadow-xl relative overflow-hidden space-y-6 text-left ${
          isLight 
            ? 'bg-white border-amber-300/80 shadow-sm' 
            : 'bg-gradient-to-br from-[#0c0d14] via-[#07080d] to-[#0a0709] border-amber-500/30 shadow-[0_20px_60px_rgba(0,0,0,0.8)]'
        }`}>
          <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-amber-500 via-rose-500 to-cyan-500" />
          
          <div className={`flex flex-wrap items-center justify-between gap-4 border-b pb-4 ${
            isLight ? 'border-stone-200' : 'border-white/10'
          }`}>
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-amber-500 shadow-[0_0_10px_#f59e0b] animate-pulse" />
              <span className={`font-mono text-xs font-bold uppercase tracking-[0.3em] ${
                isLight ? 'text-amber-900' : 'text-amber-300'
              }`}>
                THE SOLEMN PREAMBLE
              </span>
            </div>
            <span className={`font-mono text-[11px] ${isLight ? 'text-stone-500' : 'text-neutral-400'}`}>
              EST. OCTOBER 2026 &bull; UDAIPUR ASSEMBLY
            </span>
          </div>

          <div className={`space-y-4 font-serif italic text-base sm:text-xl leading-relaxed tracking-wide font-normal ${
            isLight ? 'text-stone-800' : 'text-[#f3ede3]'
          }`}>
            <p>
              &ldquo;We, the youth, delegates, writers, thinkers, and sovereign nodes of the digital commons, refusing to remain passive inheritors of broken media monopolies and gatekept institutions;
            </p>
            <p>
              Convinced that democratic discourse must be rescued from engagement algorithms, viral rage-bait, and commercial surveillance;
            </p>
            <p>
              Firmly resolved that genuine civic progress demands verified citations, empirical truth, fearless intellectual debate, and unbreachable material investment in underprivileged public education;
            </p>
            <p className={`font-medium ${isLight ? 'text-stone-950' : 'text-white'}`}>
              Do hereby establish, ordain, and ratify this <strong className="text-amber-600 not-italic font-display font-black uppercase">Constitution of Zenvitra</strong> as the perpetual and supreme civic framework for our sovereign digital assembly.&rdquo;
            </p>
          </div>

          <div className={`pt-4 border-t flex flex-wrap items-center justify-between gap-4 text-xs font-mono ${
            isLight ? 'border-stone-200 text-stone-600' : 'border-white/10 text-neutral-400'
          }`}>
            <span className={isLight ? 'text-stone-700' : 'text-neutral-300'}>
              SIGNATORY SECRETARIAT: <strong className={isLight ? 'text-stone-950' : 'text-white'}>@yuveer (Founder &amp; CEO)</strong> &bull; Plenary Assembly
            </span>
            <span className="text-emerald-600 font-bold">
              STATUS: ENFORCED GLOBALLY
            </span>
          </div>
        </section>

        {/* ── 3. SEARCH & TABLE OF CONTENTS TOOLBAR ── */}
        <section className="space-y-6">
          <div className={`flex flex-col sm:flex-row items-center justify-between gap-4 p-4 rounded-2xl border backdrop-blur-xl ${
            isLight ? 'bg-white/95 border-stone-200 shadow-sm' : 'bg-zinc-950/80 border-white/10'
          }`}>
            {/* Search Input */}
            <div className="relative w-full sm:w-96">
              <Search className={`w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 ${isLight ? 'text-stone-400' : 'text-neutral-400'}`} />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search articles (e.g. escrow, surveillance, citation)..."
                className={`w-full pl-10 pr-4 py-2 rounded-xl text-xs font-mono transition focus:outline-none ${
                  isLight 
                    ? 'bg-stone-50 border border-stone-300 text-stone-900 placeholder:text-stone-400 focus:border-amber-600' 
                    : 'bg-white/[0.04] border border-white/10 text-white placeholder:text-neutral-500 focus:border-amber-400/50'
                }`}
              />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery('')}
                  className={`absolute right-3 top-1/2 -translate-y-1/2 text-xs font-mono ${
                    isLight ? 'text-stone-400 hover:text-stone-800' : 'text-neutral-400 hover:text-white'
                  }`}
                >
                  ✕
                </button>
              )}
            </div>

            {/* Jump links */}
            <div className="flex items-center gap-1.5 overflow-x-auto w-full sm:w-auto scrollbar-none pb-1 sm:pb-0 text-[11px] font-mono">
              <span className={`uppercase shrink-0 mr-1 ${isLight ? 'text-stone-400' : 'text-neutral-500'}`}>JUMP:</span>
              {CONSTITUTION_ARTICLES.map((art) => (
                <a
                  key={art.id}
                  href={`#${art.id}`}
                  onClick={() => {
                    isClickScrollingRef.current = true;
                    setActiveArticleId(art.id);
                    setTimeout(() => {
                      isClickScrollingRef.current = false;
                    }, 1000);
                  }}
                  className={`px-2.5 py-1 rounded-lg border whitespace-nowrap transition cursor-pointer ${
                    activeArticleId === art.id
                      ? isLight
                        ? 'bg-amber-100 text-amber-900 border-amber-400 font-bold shadow-xs'
                        : 'bg-amber-400/20 text-amber-300 border-amber-400/40 font-bold shadow-xs'
                      : isLight
                        ? 'bg-stone-100/70 text-stone-600 border-stone-200 hover:text-stone-900 hover:bg-stone-200'
                        : 'bg-white/[0.03] text-neutral-400 border-white/5 hover:text-white hover:bg-white/10'
                  }`}
                >
                  {art.articleNumber}
                </a>
              ))}
              <button
                type="button"
                onClick={() => setAmendmentModalOpen(true)}
                className={`lg:hidden ml-2 px-3 py-1 rounded-lg border font-bold text-[10px] uppercase tracking-wider whitespace-nowrap flex items-center gap-1 shrink-0 transition cursor-pointer ${
                  isLight
                    ? 'bg-amber-100 border-amber-300 text-amber-900 hover:bg-amber-200'
                    : 'bg-amber-500/20 border-amber-500/40 text-amber-300 hover:bg-amber-500/30'
                }`}
              >
                <FileEdit className="w-3 h-3" />
                <span>Amend</span>
              </button>
            </div>
          </div>
        </section>

        {/* ── 4. ARTICLES DIRECTORY & BODY ── */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 text-left">
          
          {/* Sticky Sidebar Navigation (Desktop) */}
          <aside className="hidden lg:block lg:col-span-4 self-start sticky top-24 z-20">
            <div className={`p-5 rounded-3xl border space-y-4 backdrop-blur-xl shadow-xl ${
              isLight ? 'bg-white border-stone-200 shadow-sm' : 'bg-[#07080d]/90 border-white/10 shadow-2xl'
            }`}>
              <div className={`flex items-center gap-2 pb-3 border-b text-xs font-mono font-bold uppercase ${
                isLight ? 'border-stone-100 text-stone-800' : 'border-white/10 text-neutral-300'
              }`}>
                <BookOpen className="w-4 h-4 text-amber-500" />
                <span>Articles of Governance</span>
              </div>

              <nav 
                ref={sidebarNavRef}
                className="space-y-1.5 max-h-[calc(100vh-320px)] overflow-y-auto pr-1 custom-scrollbar"
              >
                {CONSTITUTION_ARTICLES.map((art) => (
                  <a
                    key={art.id}
                    href={`#${art.id}`}
                    data-article-id={art.id}
                    onClick={() => {
                      isClickScrollingRef.current = true;
                      setActiveArticleId(art.id);
                      setTimeout(() => {
                        isClickScrollingRef.current = false;
                      }, 1000);
                    }}
                    className={`block p-3 rounded-2xl border transition-all text-left group ${
                      activeArticleId === art.id
                        ? isLight
                          ? 'bg-amber-50 border-amber-300 text-amber-950 shadow-xs ring-1 ring-amber-400/40'
                          : 'bg-amber-500/15 border-amber-400/50 text-white shadow-lg ring-1 ring-amber-400/40'
                        : isLight
                          ? 'bg-stone-50/60 border-stone-200 text-stone-600 hover:text-stone-900 hover:bg-stone-100'
                          : 'bg-white/[0.02] border-white/5 text-neutral-400 hover:text-white hover:bg-white/[0.05]'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <span className={`text-[10px] font-mono font-bold ${isLight ? 'text-amber-700' : 'text-amber-400'}`}>
                        {art.articleNumber}
                      </span>
                      <span className={`text-[8px] font-mono px-2 py-0.5 rounded-full border ${
                        isLight
                          ? 'bg-stone-100 text-stone-800 border-stone-300'
                          : art.badgeColor
                      }`}>
                        {art.badge}
                      </span>
                    </div>
                    <p className={`font-display font-bold text-xs mt-1 transition ${
                      isLight ? 'text-stone-900 group-hover:text-amber-800' : 'text-white group-hover:text-amber-300'
                    }`}>
                      {art.title}
                    </p>
                  </a>
                ))}
              </nav>

              <div className={`pt-3 border-t text-[10px] font-mono space-y-2 ${
                isLight ? 'border-stone-100 text-stone-500' : 'border-white/10 text-neutral-500'
              }`}>
                <p>⚡ All articles are legally binding upon all nodes operating on the Zenvitra mesh.</p>
                <div className={`flex items-center gap-2 ${isLight ? 'text-stone-600' : 'text-neutral-400'}`}>
                  <Lock className="w-3 h-3 text-amber-500" />
                  <span>SHA-256 Digest Verified</span>
                </div>
              </div>

              {/* Request Amendment CTA Section */}
              <div className={`pt-3 border-t space-y-2 ${isLight ? 'border-stone-100' : 'border-white/10'}`}>
                <button
                  type="button"
                  onClick={() => setAmendmentModalOpen(true)}
                  className={`w-full py-2.5 px-3.5 rounded-xl border font-display font-bold text-xs uppercase tracking-wider flex items-center justify-center gap-2 transition-all cursor-pointer group ${
                    isLight
                      ? 'bg-amber-100 hover:bg-amber-200 border-amber-300 text-amber-950 shadow-xs'
                      : 'bg-gradient-to-r from-amber-500/20 via-rose-500/20 to-amber-500/20 hover:from-amber-500/30 hover:via-rose-500/30 hover:to-amber-500/30 border-amber-500/40 hover:border-amber-400 text-amber-200 hover:text-white shadow-lg'
                  }`}
                >
                  <FileEdit className="w-3.5 h-3.5 text-amber-500 group-hover:scale-110 transition-transform" />
                  <span>Request Amendment</span>
                  <ArrowRight className="w-3 h-3 text-amber-500 group-hover:translate-x-0.5 transition-transform" />
                </button>
                <div className={`flex items-center justify-between text-[9px] font-mono px-1 ${
                  isLight ? 'text-stone-400' : 'text-neutral-500'
                }`}>
                  <span>Article VII Docket</span>
                  <span className={isLight ? 'text-amber-700 font-semibold' : 'text-amber-400/80'}>Plenary Caucus</span>
                </div>
              </div>
            </div>
          </aside>

          {/* Main Articles Content */}
          <div className="lg:col-span-8 space-y-16">
            {filteredArticles.length === 0 ? (
              <div className={`p-12 text-center rounded-3xl border space-y-3 font-mono ${
                isLight ? 'bg-white border-stone-200 text-stone-600' : 'bg-zinc-950 border-white/10 text-neutral-400'
              }`}>
                <Search className="w-8 h-8 text-neutral-400 mx-auto" />
                <h3 className={`font-bold text-sm ${isLight ? 'text-stone-900' : 'text-white'}`}>No Constitutional Articles Found</h3>
                <p className="text-xs max-w-sm mx-auto">
                  No matches for &ldquo;{searchQuery}&rdquo;. Try keywords like &ldquo;escrow&rdquo;, &ldquo;surveillance&rdquo;, &ldquo;cockroach&rdquo;, or &ldquo;citation&rdquo;.
                </p>
                <button
                  onClick={() => setSearchQuery('')}
                  className={`px-4 py-2 rounded-xl text-xs transition ${
                    isLight ? 'bg-stone-100 hover:bg-stone-200 text-stone-800' : 'bg-white/10 text-white hover:bg-white/20'
                  }`}
                >
                  Clear Search Filter
                </button>
              </div>
            ) : (
              filteredArticles.map((article) => (
                <section
                  key={article.id}
                  id={article.id}
                  className={`p-8 sm:p-10 rounded-3xl border space-y-8 relative overflow-hidden transition scroll-mt-28 ${
                    isLight 
                      ? 'bg-white border-stone-200 shadow-sm hover:border-stone-300' 
                      : 'bg-[#080910] border-white/10 shadow-2xl hover:border-white/20'
                  }`}
                >
                  {/* Accent Header Rail */}
                  <div className={`flex flex-wrap items-center justify-between gap-3 border-b pb-5 ${
                    isLight ? 'border-stone-100' : 'border-white/10'
                  }`}>
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <span className="font-mono text-xs font-bold text-amber-500 tracking-wider">
                          {article.articleNumber}
                        </span>
                        <span className={isLight ? 'text-stone-400' : 'text-neutral-500'}>&bull;</span>
                        <span className={`px-2.5 py-0.5 rounded-full border text-[9px] font-mono font-bold uppercase tracking-wider ${
                          isLight ? 'bg-amber-50 text-amber-900 border-amber-300' : article.badgeColor
                        }`}>
                          {article.badge}
                        </span>
                      </div>
                      <h2 className={`font-display font-black text-2xl sm:text-3xl tracking-tight uppercase ${
                        isLight ? 'text-stone-950' : 'text-white'
                      }`}>
                        {article.title}
                      </h2>
                    </div>

                    <button
                      onClick={() => handleCopyLink(article.id)}
                      className={`p-2.5 rounded-xl border transition flex items-center gap-1.5 text-xs font-mono cursor-pointer ${
                        isLight 
                          ? 'bg-stone-50 border-stone-200 text-stone-600 hover:text-stone-900 hover:bg-stone-100' 
                          : 'bg-white/[0.04] border-white/10 text-neutral-400 hover:text-white hover:bg-white/10'
                      }`}
                      title="Copy link to this Article"
                    >
                      {copiedSection === article.id ? (
                        <>
                          <Check className="w-3.5 h-3.5 text-emerald-500" />
                          <span className="text-emerald-500">Copied</span>
                        </>
                      ) : (
                        <>
                          <Share2 className="w-3.5 h-3.5" />
                          <span>Share</span>
                        </>
                      )}
                    </button>
                  </div>

                  {/* Summary paragraph */}
                  <p className={`text-xs sm:text-sm font-sans font-light leading-relaxed border-l-2 border-amber-500/50 pl-4 italic ${
                    isLight ? 'text-stone-700' : 'text-neutral-300'
                  }`}>
                    {article.summary}
                  </p>

                  {/* Sections List */}
                  <div className="space-y-8 pt-2">
                    {article.sections.map((sec, idx) => (
                      <div key={idx} className="space-y-3">
                        <div className="flex flex-wrap items-center justify-between gap-2">
                          <div className="flex items-baseline gap-2">
                            <span className={`font-mono text-[11px] font-bold ${isLight ? 'text-amber-700' : 'text-amber-400/90'}`}>
                              {sec.sectionNumber}
                            </span>
                            <h3 className={`font-display font-bold text-base sm:text-lg ${isLight ? 'text-stone-950' : 'text-white'}`}>
                              {sec.heading}
                            </h3>
                          </div>
                          {sec.operationalTag && (
                            <span className={`px-2.5 py-0.5 rounded-full border text-[9px] font-mono uppercase tracking-widest font-semibold ${
                              isLight
                                ? 'bg-stone-100 border-stone-300 text-stone-700'
                                : 'bg-white/[0.04] border-white/10 text-amber-300/90'
                            }`}>
                              {sec.operationalTag}
                            </span>
                          )}
                        </div>

                        <div className={`space-y-2.5 text-xs sm:text-sm font-light font-sans leading-relaxed pl-6 border-l ${
                          isLight ? 'text-stone-700 border-stone-200' : 'text-neutral-300 border-white/[0.06]'
                        }`}>
                          {sec.content.map((p, pIdx) => (
                            <p key={pIdx}>{p}</p>
                          ))}
                        </div>

                        {sec.callout && (
                          <div className={`ml-6 p-4 rounded-2xl border text-xs font-mono flex items-start gap-2.5 ${
                            isLight
                              ? 'bg-amber-50 border-amber-200 text-amber-950'
                              : 'bg-gradient-to-r from-amber-500/10 via-white/[0.02] to-transparent border-amber-500/20 text-amber-200/90'
                          }`}>
                            <Sparkles className="w-4 h-4 text-amber-500 shrink-0 mt-0.5" />
                            <span>{sec.callout}</span>
                          </div>
                        )}

                        {sec.howToUseProperly && (
                          <div className={`ml-6 mt-3 p-5 rounded-2xl border space-y-3.5 ${
                            isLight
                              ? 'bg-stone-50 border-stone-200 shadow-xs'
                              : 'bg-gradient-to-br from-amber-500/[0.06] via-[#090b10] to-[#06070b] border-amber-500/25 shadow-lg'
                          }`}>
                            <div className={`flex items-center gap-2 font-mono text-[10px] sm:text-[11px] font-bold uppercase tracking-wider ${
                              isLight ? 'text-amber-800' : 'text-amber-300'
                            }`}>
                              <BookOpen className="w-3.5 h-3.5 text-amber-500" />
                              <span>{sec.howToUseProperly.title}</span>
                            </div>
                            <div className="space-y-2">
                              {sec.howToUseProperly.steps.map((step, sIdx) => (
                                <div key={sIdx} className="flex items-start gap-3 text-xs font-sans leading-relaxed">
                                  <span className={`w-4.5 h-4.5 rounded-full border font-mono font-bold text-[9px] flex items-center justify-center shrink-0 mt-0.5 ${
                                    isLight
                                      ? 'bg-amber-100 border-amber-300 text-amber-900'
                                      : 'bg-amber-400/15 border-amber-400/40 text-amber-300'
                                  }`}>
                                    {sIdx + 1}
                                  </span>
                                  <p className={`font-light ${isLight ? 'text-stone-700' : 'text-neutral-300'}`}>{step}</p>
                                </div>
                              ))}
                            </div>
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                </section>
              ))
            )}
          </div>
        </div>

        {/* ── 5. RATIFICATION SEAL & SIGNATURES ── */}
        <section className={`p-8 sm:p-12 rounded-[2.5rem] border shadow-xl space-y-8 text-left relative overflow-hidden ${
          isLight
            ? 'bg-white border-stone-200 shadow-sm'
            : 'bg-gradient-to-b from-[#0e1018] to-[#07080c] border-white/15 shadow-2xl'
        }`}>
          <div className="space-y-2">
            <span className="font-mono text-[10px] uppercase tracking-[0.3em] text-amber-500 font-bold">
              ATTESTATION &bull; SUPREME LEGALITY
            </span>
            <h2 className={`font-display font-black text-3xl sm:text-5xl uppercase tracking-tight ${
              isLight ? 'text-stone-950' : 'text-white'
            }`}>
              Ratified by Sovereign Consensus.
            </h2>
            <p className={`text-xs sm:text-sm max-w-2xl font-light font-sans ${
              isLight ? 'text-stone-600' : 'text-neutral-400'
            }`}>
              This document is the supreme law of Zenvitra. Every feature, policy deliberation, financial transaction, and code dispatch must strictly comply with its provisions.
            </p>
          </div>

          <div className={`grid grid-cols-1 md:grid-cols-3 gap-6 pt-4 border-t ${
            isLight ? 'border-stone-200' : 'border-white/10'
          }`}>
            {/* Signature 1 */}
            <div className={`p-6 rounded-2xl border space-y-3 font-mono ${
              isLight ? 'bg-stone-50 border-stone-200' : 'bg-black/60 border-white/10'
            }`}>
              <div className={`flex items-center justify-between text-xs ${isLight ? 'text-stone-500' : 'text-neutral-400'}`}>
                <span>FOUNDER &amp; CEO</span>
                <span className="text-emerald-500 font-bold">SIGNED</span>
              </div>
              <p className={`text-lg font-serif italic font-bold ${isLight ? 'text-amber-800' : 'text-amber-300'}`}>
                @yuveer
              </p>
              <p className={`text-[10px] ${isLight ? 'text-stone-500' : 'text-neutral-500'}`}>
                Genesis Custodian &bull; Digital Rights Mandate
              </p>
            </div>

            {/* Signature 2 */}
            <div className={`p-6 rounded-2xl border space-y-3 font-mono ${
              isLight ? 'bg-stone-50 border-stone-200' : 'bg-black/60 border-white/10'
            }`}>
              <div className={`flex items-center justify-between text-xs ${isLight ? 'text-stone-500' : 'text-neutral-400'}`}>
                <span>SECRETARIAT PLENARY</span>
                <span className="text-emerald-500 font-bold">RATIFIED</span>
              </div>
              <p className={`text-lg font-serif italic font-bold ${isLight ? 'text-cyan-800' : 'text-cyan-300'}`}>
                Assembly General Secretariat
              </p>
              <p className={`text-[10px] ${isLight ? 'text-stone-500' : 'text-neutral-500'}`}>
                Representing Accredited Youth Delegations
              </p>
            </div>

            {/* Signature 3 */}
            <div className={`p-6 rounded-2xl border space-y-3 font-mono ${
              isLight ? 'bg-stone-50 border-stone-200' : 'bg-black/60 border-white/10'
            }`}>
              <div className={`flex items-center justify-between text-xs ${isLight ? 'text-stone-500' : 'text-neutral-400'}`}>
                <span>CIVIC ESCROW CHARTER</span>
                <span className="text-emerald-500 font-bold">IMMUTABLE</span>
              </div>
              <p className={`text-lg font-serif italic font-bold ${isLight ? 'text-emerald-800' : 'text-emerald-300'}`}>
                25.0% Guaranteed
              </p>
              <p className={`text-[10px] ${isLight ? 'text-stone-500' : 'text-neutral-500'}`}>
                Zero Surveillance &bull; Rural School Labs
              </p>
            </div>
          </div>

          {/* Action Row */}
          <div className="pt-4 flex flex-wrap items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <EnterZenvitraButton className={`px-8 py-3.5 rounded-full font-semibold text-xs transition cursor-pointer shadow-lg ${
                isLight ? 'bg-stone-900 text-white hover:bg-stone-800' : 'bg-white text-black hover:bg-neutral-200'
              }`} />
              <Link
                href="/manifesto"
                className={`px-6 py-3.5 rounded-full border font-mono text-xs transition ${
                  isLight ? 'bg-stone-100 hover:bg-stone-200 text-stone-800 border-stone-300' : 'bg-white/5 hover:bg-white/10 text-neutral-300 border-white/10'
                }`}
              >
                Read Manifesto &rarr;
              </Link>
            </div>

            <div className={`flex items-center gap-2 text-xs font-mono ${isLight ? 'text-stone-500' : 'text-neutral-500'}`}>
              <Shield className="w-4 h-4 text-amber-500" />
              <span>Cryptographically Enforced Protocol</span>
            </div>
          </div>
        </section>

      </main>

      {/* ── Footer ── */}
      <footer className={`relative z-10 w-full max-w-7xl mx-auto px-6 sm:px-12 py-10 border-t flex flex-col sm:flex-row items-center justify-between gap-6 text-xs font-mono mt-20 ${
        isLight ? 'border-stone-200 text-stone-500' : 'border-white/10 text-neutral-500'
      }`}>
        <div className="flex items-center gap-3">
          <span className={`font-bold ${isLight ? 'text-stone-900' : 'text-white'}`}>CONSTITUTION OF ZENVITRA</span>
          <span>&bull;</span>
          <span>GENESIS 2026</span>
        </div>

        <div className={`flex items-center gap-6 ${isLight ? 'text-stone-600' : 'text-neutral-400'}`}>
          <Link href="/manifesto" className="hover:text-amber-600 transition">Manifesto</Link>
          <Link href="/about" className="hover:text-amber-600 transition">About</Link>
          <Link href="/pulse" className="hover:text-amber-600 transition">Pulse Feed</Link>
          <Link href="/donate/govt-schools" className="hover:text-amber-600 transition">25% Escrow</Link>
          <Link href="/privacy" className="hover:text-amber-600 transition">Privacy</Link>
        </div>
      </footer>

      {/* Constitutional Amendment Petition Modal */}
      <AmendmentModal
        isOpen={amendmentModalOpen}
        onClose={() => setAmendmentModalOpen(false)}
      />
    </div>
  );
}
