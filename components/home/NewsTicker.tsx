'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { ArrowRight, Newspaper, CheckCircle, ShieldCheck, PenLine, Sparkles } from 'lucide-react';
import { SpotlightCard } from '@/components/ui/SpotlightCard';

interface ArticleItem {
  id: string;
  title: string;
  authorName: string;
  category: string;
  createdAt: string;
  slug: string;
}

export function NewsTicker() {
  const [articles, setArticles] = useState<ArticleItem[]>([]);

  useEffect(() => {
    try {
      const raw = localStorage.getItem('zenvitra_press_articles');
      if (raw) {
        const parsed = JSON.parse(raw);
        if (Array.isArray(parsed) && parsed.length > 0) {
          const published = parsed.filter((a: any) => a.status === 'published');
          setArticles(published.slice(0, 3));
        }
      }
    } catch {
      // ignore
    }
  }, []);

  return (
    <section className="w-full max-w-7xl mx-auto px-6 sm:px-8 py-6 text-left">
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 mb-6">
        <div className="space-y-1">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-violet-500/20 bg-violet-500/10 text-xs font-semibold text-violet-300">
            <ShieldCheck className="w-3.5 h-3.5" />
            <span>Community Press & Wire</span>
          </div>
          <h2 className="text-xl sm:text-2xl font-bold tracking-tight text-white font-display">
            Dispatches & Open Publications
          </h2>
        </div>

        <Link href="/press">
          <button
            type="button"
            className="px-4 py-2 rounded-2xl border border-white/10 bg-[#090a0f] text-zinc-300 text-xs font-medium hover:bg-white/10 hover:text-white transition flex items-center gap-1.5 cursor-pointer shadow-sm"
          >
            <span>Open Press Desk</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </Link>
      </div>

      {articles.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {articles.map((article) => (
            <SpotlightCard
              key={article.id}
              className="p-5 flex flex-col justify-between min-h-[160px] text-left rounded-2xl bg-[#090a0f] border border-white/[0.08]"
            >
              <div className="space-y-2">
                <div className="flex items-center justify-between text-xs text-zinc-400">
                  <span className="px-2 py-0.5 rounded-lg bg-white/[0.05] border border-white/10 text-zinc-300">
                    {article.category}
                  </span>
                  <span>{new Date(article.createdAt).toLocaleDateString()}</span>
                </div>
                <h3 className="text-sm font-bold text-white tracking-tight line-clamp-2 hover:text-violet-300 transition">
                  <Link href={`/press`}>{article.title}</Link>
                </h3>
              </div>

              <div className="pt-3 border-t border-white/[0.08] flex items-center justify-between text-xs text-zinc-400">
                <span className="flex items-center gap-1 text-white font-medium">
                  {article.authorName}
                </span>
                <Link href={`/press`} className="hover:text-white text-violet-400 font-medium transition">
                  Read →
                </Link>
              </div>
            </SpotlightCard>
          ))}
        </div>
      ) : (
        <div className="rounded-3xl p-6 sm:p-8 bg-[#090a0f] border border-white/[0.08] flex flex-col sm:flex-row items-center justify-between gap-4 text-left">
          <div className="space-y-1">
            <h3 className="text-base font-bold text-white font-display">No publications submitted yet</h3>
            <p className="text-xs text-zinc-400">
              Be the first writer or community author to transmit an editorial piece, research essay, or draft solution.
            </p>
          </div>
          <Link href="/press">
            <button
              type="button"
              className="px-5 py-2.5 rounded-2xl bg-white text-black text-xs font-semibold hover:bg-zinc-200 transition cursor-pointer flex items-center gap-1.5 shadow-sm shrink-0"
            >
              <PenLine className="w-3.5 h-3.5" />
              <span>Write First Dispatch</span>
            </button>
          </Link>
        </div>
      )}
    </section>
  );
}

export default NewsTicker;