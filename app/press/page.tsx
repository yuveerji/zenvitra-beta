'use client';

import React, { Suspense, useEffect, useState } from 'react';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import {
  Rss,
  FileText,
  Bookmark,
  PenLine,
  Sparkles,
  Crown,
  Newspaper,
  ShieldCheck,
  Scale,
  ArrowRight,
  ExternalLink,
  Flame,
  Radio,
  Share2,
  Check
} from 'lucide-react';
import { Navbar } from '@/components/layout/Navbar';
import { Footer } from '@/components/layout/Footer';
import { useZenPress } from '@/context/ZenPressPlatformContext';
import { useAuth } from '@/context/AuthContext';
import { isFounder } from '@/lib/founderControl';
import { PressFeed } from '@/components/press/PressFeed';
import { ArticleReader } from '@/components/press/ArticleReader';
import { ArticleEditor } from '@/components/press/ArticleEditor';
import { FounderPressStudio } from '@/components/founder/FounderPressStudio';
import { BookmarksList } from '@/components/press/BookmarksList';
import { MyArticles } from '@/components/press/MyArticles';
import { PressView } from '@/types/press';

function PressUrlSync() {
  const searchParams = useSearchParams();
  const { setActiveView, setActiveArticleId } = useZenPress();

  useEffect(() => {
    const viewParam = searchParams.get('view') as PressView | null;
    const articleIdParam = searchParams.get('article');

    if (articleIdParam) {
      setActiveArticleId(articleIdParam);
      setActiveView('article');
    } else if (viewParam && ['feed', 'article', 'editor', 'my-articles', 'bookmarks'].includes(viewParam)) {
      setActiveView(viewParam);
    }
  }, [searchParams, setActiveView, setActiveArticleId]);

  return null;
}

function PressContent() {
  const {
    activeView,
    setActiveView,
    setEditingArticleId,
    currentUserUsername,
    articles,
    bookmarkedArticles,
    myDrafts,
    myPublished
  } = useZenPress();

  const { user, profile } = useAuth();
  const effectiveUsername = (currentUserUsername || profile?.username || user?.email?.split('@')[0] || '').toLowerCase().replace(/^@/, '');
  const isFounderUser = isFounder(effectiveUsername, (profile?.role as any) || (profile as any)?.badge);

  const [isCopied, setIsCopied] = useState(false);

  const navItems: { view: PressView; label: string; icon: React.ReactNode; count?: number }[] = [
    { view: 'feed', label: 'Wire Feed', icon: <Rss className="w-4 h-4" />, count: articles.length },
    { view: 'my-articles', label: 'Author Desk', icon: <FileText className="w-4 h-4" />, count: myDrafts.length + myPublished.length },
    { view: 'bookmarks', label: 'Saved Reading', icon: <Bookmark className="w-4 h-4" />, count: bookmarkedArticles.length },
  ];

  const handleShareBureau = () => {
    if (typeof window !== 'undefined') {
      navigator.clipboard.writeText(window.location.href);
      setIsCopied(true);
      setTimeout(() => setIsCopied(false), 2000);
    }
  };

  return (
    <div className="min-h-screen bg-[#030406] text-white font-sans flex flex-col selection:bg-cyan-500 selection:text-black">
      <Navbar />

      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 pt-24 sm:pt-28 pb-20 space-y-8 text-left">
        {/* ─── MASTERPIECE HERO HEADER ─── */}
        <section className="relative rounded-3xl bg-gradient-to-b from-[#0c0f1c]/90 via-[#080a13]/95 to-[#05060b] border border-white/10 p-6 sm:p-10 overflow-hidden shadow-2xl">
          <div className="absolute top-0 right-0 w-full max-w-[500px] h-[300px] bg-cyan-500/10 blur-[130px] pointer-events-none rounded-full" />
          <div className="absolute bottom-0 left-0 w-full max-w-[450px] h-[300px] bg-purple-500/10 blur-[130px] pointer-events-none rounded-full" />

          <div className="relative z-10 space-y-6">
            {/* Top Badges */}
            <div className="flex flex-wrap items-center justify-between gap-3">
              <div className="flex flex-wrap items-center gap-2.5">
                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-cyan-500/10 border border-cyan-500/30 text-cyan-300 font-mono text-[11px] font-bold uppercase tracking-wider">
                  <Newspaper className="w-3.5 h-3.5" />
                  <span>ZEN.PRESS // SOVEREIGN BUREAU</span>
                </span>

                <Link
                  href="/constitution#article-12"
                  className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-500/10 border border-amber-500/25 text-amber-300 hover:text-amber-200 font-mono text-[11px] transition"
                >
                  <Scale className="w-3.5 h-3.5" />
                  <span>Charter Article XII Protected</span>
                </Link>

                <Link
                  href="/news"
                  className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-purple-500/10 border border-purple-500/25 text-purple-300 hover:text-purple-200 font-mono text-[11px] transition"
                >
                  <Radio className="w-3.5 h-3.5 text-rose-400" />
                  <span>ZEN.NEWS Live Wire &rarr;</span>
                </Link>

                <span className="hidden sm:inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-white/5 border border-white/10 text-neutral-400 font-mono text-[11px]">
                  <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
                  <span>Authentic Citations Required</span>
                </span>
              </div>

              <div className="flex items-center gap-2">
                <Link
                  href="/news/submit"
                  className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-white hover:bg-neutral-200 text-black font-mono text-xs font-bold transition shadow-md active:scale-95"
                >
                  <Newspaper className="w-3.5 h-3.5 text-black" />
                  <span>Submit News Wire +</span>
                </Link>

                <button
                  type="button"
                  onClick={handleShareBureau}
                  className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-xs font-mono text-neutral-300 hover:text-white transition cursor-pointer"
                >
                  {isCopied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Share2 className="w-3.5 h-3.5 text-cyan-400" />}
                  <span>{isCopied ? 'Bureau Link Copied!' : 'Share Wire'}</span>
                </button>
              </div>
            </div>

            {/* Title & Editorial Purpose */}
            <div className="space-y-3 max-w-4xl">
              <h1 className="text-3xl sm:text-5xl lg:text-6xl font-black font-display text-white tracking-tight leading-[1.08]">
                Open Publication, Free Discourse &amp; <span className="font-serif italic font-normal text-cyan-200">Media Transparency.</span>
              </h1>
              <p className="text-sm sm:text-base text-neutral-300 leading-relaxed font-sans max-w-3xl">
                ZENVITRA’s independent investigative wire and editorial network. Every youth voice is evaluated on the merit of their ideas and verified evidence—free of institutional barriers, corporate paywalls, or censorship.
              </p>
            </div>

            {/* Constitutional Principles Matrix */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-2 text-xs font-mono border-t border-white/10">
              <div className="p-3 rounded-2xl bg-white/[0.03] border border-white/5 space-y-1">
                <span className="text-[10px] text-neutral-500 uppercase">Clause 1</span>
                <p className="text-white font-semibold">Universal Right to Publish</p>
              </div>
              <div className="p-3 rounded-2xl bg-white/[0.03] border border-white/5 space-y-1">
                <span className="text-[10px] text-neutral-500 uppercase">Clause 2</span>
                <p className="text-emerald-300 font-semibold">100% Free & Accessible</p>
              </div>
              <div className="p-3 rounded-2xl bg-white/[0.03] border border-white/5 space-y-1">
                <span className="text-[10px] text-neutral-500 uppercase">Clause 3</span>
                <p className="text-amber-300 font-semibold">Editorial Independence</p>
              </div>
              <div className="p-3 rounded-2xl bg-white/[0.03] border border-white/5 space-y-1">
                <span className="text-[10px] text-neutral-500 uppercase">Clause 4</span>
                <p className="text-cyan-300 font-semibold">Authentic Traceable Sources</p>
              </div>
            </div>
          </div>
        </section>

        {/* ─── WORKSPACE NAVIGATION TABS & ACTIONS ─── */}
        <section className="flex flex-wrap items-center justify-between gap-3 p-2 rounded-2xl bg-[#080911] border border-white/10 shadow-lg">
          {/* Navigation Items */}
          <div className="flex items-center gap-1.5 overflow-x-auto max-w-full p-1">
            {navItems.map((item) => {
              const isActive =
                activeView === item.view ||
                (item.view === 'feed' && activeView === 'article');

              return (
                <button
                  key={item.view}
                  type="button"
                  onClick={() => setActiveView(item.view)}
                  className={`flex items-center gap-2 px-4 py-2.5 rounded-xl font-mono text-xs font-bold transition cursor-pointer whitespace-nowrap ${
                    isActive
                      ? 'bg-white text-black shadow-lg shadow-white/10 scale-100'
                      : 'text-neutral-400 hover:text-white hover:bg-white/5'
                  }`}
                >
                  {item.icon}
                  <span>{item.label}</span>
                  {typeof item.count === 'number' && item.count > 0 && (
                    <span
                      className={`px-1.5 py-0.5 rounded-md text-[10px] font-bold ${
                        isActive
                          ? 'bg-black/15 text-black'
                          : 'bg-white/10 text-neutral-300'
                      }`}
                    >
                      {item.count}
                    </span>
                  )}
                </button>
              );
            })}
          </div>

          {/* Primary Action Buttons */}
          <div className="flex items-center gap-2 ml-auto pr-1 flex-wrap">
            <Link
              href="/news/submit"
              className="flex items-center gap-1.5 px-4 py-2.5 rounded-xl font-mono text-xs font-bold transition cursor-pointer bg-white/5 hover:bg-white/10 border border-white/15 text-neutral-200 hover:text-white whitespace-nowrap"
            >
              <Newspaper className="w-3.5 h-3.5 text-rose-400" />
              <span>Submit News Wire</span>
            </Link>

            <button
              type="button"
              onClick={() => {
                setEditingArticleId(null);
                setActiveView('editor');
              }}
              className={`flex items-center gap-2 px-5 py-2.5 rounded-xl font-mono text-xs font-bold transition cursor-pointer shadow-lg whitespace-nowrap ${
                activeView === 'editor'
                  ? 'bg-cyan-400 text-black shadow-cyan-400/25 ring-2 ring-cyan-300'
                  : isFounderUser
                  ? 'bg-amber-400 hover:bg-amber-300 text-black shadow-[0_0_20px_rgba(251,191,36,0.3)]'
                  : 'bg-cyan-500 hover:bg-cyan-400 text-black shadow-cyan-500/20'
              }`}
            >
              {isFounderUser ? (
                <>
                  <Crown className="w-4 h-4 fill-black" />
                  <span>Founder Press Studio</span>
                </>
              ) : (
                <>
                  <PenLine className="w-4 h-4" />
                  <span>Draft New Dispatch</span>
                </>
              )}
            </button>
          </div>
        </section>

        {/* ─── ACTIVE VIEW RENDERER ─── */}
        <section className="w-full">
          {activeView === 'feed' && <PressFeed />}
          {activeView === 'article' && <ArticleReader />}
          {activeView === 'editor' && (isFounderUser ? <FounderPressStudio /> : <ArticleEditor />)}
          {activeView === 'bookmarks' && <BookmarksList />}
          {activeView === 'my-articles' && <MyArticles />}
        </section>
      </main>

      <Footer />
    </div>
  );
}

export default function PressPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen bg-[#030406] text-white flex items-center justify-center font-mono text-xs">
          <div className="flex items-center gap-3">
            <div className="w-6 h-6 border-2 border-cyan-400 border-t-transparent rounded-full animate-spin" />
            <span>Loading Sovereign Press Bureau...</span>
          </div>
        </div>
      }
    >
      <PressUrlSync />
      <PressContent />
    </Suspense>
  );
}
