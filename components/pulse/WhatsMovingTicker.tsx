'use client';

import React, { useMemo } from 'react';
import { Activity, Radio, ArrowUp } from 'lucide-react';

interface SignalItem {
  tag: string;
  count: string;
  change: string;
  direction: 'up' | 'down';
}

interface WhatsMovingTickerProps {
  feedPosts?: any[];
}

export function WhatsMovingTicker({ feedPosts = [] }: WhatsMovingTickerProps) {
  const signalItems: SignalItem[] = useMemo(() => {
    if (!feedPosts || feedPosts.length === 0) return [];

    const counts = new Map<string, number>();

    feedPosts.forEach((p) => {
      if (Array.isArray(p.tags)) {
        p.tags.forEach((tag: string) => {
          const clean = tag.replace(/^#/, '').trim();
          if (clean) counts.set(clean, (counts.get(clean) || 0) + 1);
        });
      }
      if (p.category) {
        const cleanCat = p.category.trim();
        if (cleanCat) counts.set(cleanCat, (counts.get(cleanCat) || 0) + 1);
      }
    });

    return Array.from(counts.entries())
      .sort((a, b) => b[1] - a[1])
      .slice(0, 5)
      .map(([tag, count]) => ({
        tag: `#${tag}`,
        count: `${count} ${count === 1 ? 'dispatch' : 'dispatches'}`,
        change: 'Active',
        direction: 'up' as const,
      }));
  }, [feedPosts]);

  return (
    <div className="rounded-3xl bg-[#07090e]/90 border border-white/[0.08] p-5 space-y-4 backdrop-blur-xl shadow-xl">
      <div className="flex items-center justify-between border-b border-white/[0.06] pb-3">
        <div className="flex items-center gap-2">
          <Activity className="w-4 h-4 text-cyan-400 animate-pulse" />
          <span className="font-mono text-xs font-bold uppercase tracking-widest text-white">
            WHAT&apos;S MOVING? // LIVE VELOCITY
          </span>
        </div>
        <div className="flex items-center gap-1.5 px-2 py-0.5 rounded-full bg-white/[0.04] border border-white/[0.08] text-[9px] font-mono text-neutral-400">
          <Radio className="w-2.5 h-2.5 text-cyan-400 animate-pulse" />
          <span>REAL-TIME WIRE</span>
        </div>
      </div>

      {signalItems.length > 0 ? (
        <div className="space-y-2.5">
          {signalItems.map((sig) => (
            <div
              key={sig.tag}
              className="flex items-center justify-between p-2.5 rounded-2xl bg-white/[0.02] border border-white/[0.04] hover:border-white/15 transition-all text-xs"
            >
              <div className="space-y-0.5">
                <span className="font-outfit font-medium text-white block">
                  {sig.tag}
                </span>
                <span className="font-mono text-[10px] text-neutral-500">
                  {sig.count}
                </span>
              </div>

              <div className="flex items-center gap-1 font-mono text-[11px] font-bold text-emerald-400">
                <ArrowUp className="w-3 h-3" />
                <span>{sig.change}</span>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="p-4 rounded-2xl bg-white/[0.02] border border-white/[0.04] text-center space-y-1">
          <p className="font-mono text-[11px] text-neutral-300 font-medium">Listening for Dispatch Signals</p>
          <p className="font-sans text-[10px] text-neutral-500 leading-relaxed">
            Publish dispatches or treaties on the wire to activate live velocity trackers.
          </p>
        </div>
      )}
    </div>
  );
}
