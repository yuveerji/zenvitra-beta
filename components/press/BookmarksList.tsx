'use client';

import React from 'react';
import { Bookmark as BookmarkIcon, BookmarkX, Sparkles } from 'lucide-react';
import { useZenPress } from '@/context/ZenPressPlatformContext';
import { ArticleCard } from './ArticleCard';

export function BookmarksList() {
  const { bookmarkedArticles, setActiveView } = useZenPress();

  return (
    <div className="max-w-4xl mx-auto space-y-6 font-sans pb-16">
      {/* Header */}
      <div className="flex items-center justify-between pb-4 border-b border-white/[0.08]">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-2xl bg-amber-500/10 border border-amber-500/30 flex items-center justify-center shadow-md">
            <BookmarkIcon className="w-5 h-5 text-amber-400 fill-amber-400" />
          </div>
          <div>
            <h2 className="font-display font-bold text-xl text-white">Saved Dispatches</h2>
            <p className="font-mono text-xs text-neutral-400">
              {bookmarkedArticles.length} saved article{bookmarkedArticles.length !== 1 ? 's' : ''} in your private library
            </p>
          </div>
        </div>

        <button
          onClick={() => setActiveView('feed')}
          className="px-4 py-2 rounded-xl bg-white/[0.04] border border-white/10 text-xs font-mono text-neutral-300 hover:text-white hover:bg-white/10 transition cursor-pointer"
        >
          Explore Wire
        </button>
      </div>

      {/* List */}
      {bookmarkedArticles.length === 0 ? (
        <div className="rounded-3xl p-16 text-center card-luxury border border-white/[0.08] space-y-4">
          <div className="w-16 h-16 rounded-3xl bg-white/[0.04] border border-white/10 flex items-center justify-center mx-auto shadow-inner">
            <BookmarkX className="w-8 h-8 text-neutral-500" />
          </div>
          <div>
            <h3 className="font-display font-bold text-lg text-white">No Bookmarks Saved</h3>
            <p className="text-xs font-mono text-neutral-400 max-w-xs mx-auto mt-1">
              Tap the bookmark icon on any dispatch to save it to your private reading queue.
            </p>
          </div>
          <button
            onClick={() => setActiveView('feed')}
            className="px-5 py-2.5 rounded-2xl bg-white hover:bg-neutral-200 text-black font-display font-bold text-xs uppercase tracking-wider transition shadow-lg cursor-pointer"
          >
            Discover Dispatches
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {bookmarkedArticles.map((article) => (
            <ArticleCard key={article.id} article={article} />
          ))}
        </div>
      )}
    </div>
  );
}
