'use client';

import React from 'react';
import { TrendingUp, ArrowUp, ArrowDown, Activity } from 'lucide-react';

interface SignalItem {
  tag: string;
  count: string;
  change: string;
  direction: 'up' | 'down';
}

const LIVE_SIGNALS: SignalItem[] = [
  { tag: 'Education Reform', count: '1.2k dispatches', change: '+24%', direction: 'up' },
  { tag: 'Student Dais Elections', count: '890 votes', change: '+18%', direction: 'up' },
  { tag: 'Climate & Water Rights', count: '640 papers', change: '+12%', direction: 'up' },
  { tag: 'Exam Stress Relief', count: '420 notes', change: '-8%', direction: 'down' },
  { tag: 'Youth Employment Bill', count: '310 signatures', change: '+32%', direction: 'up' },
];

export function WhatsMovingTicker() {
  return (
    <div className="rounded-3xl bg-[#07090e]/90 border border-white/[0.08] p-5 space-y-4 backdrop-blur-xl shadow-xl">
      <div className="flex items-center justify-between border-b border-white/[0.06] pb-3">
        <div className="flex items-center gap-2">
          <Activity className="w-4 h-4 text-cyan-400 animate-pulse" />
          <span className="font-mono text-xs font-bold uppercase tracking-widest text-white">
            WHAT&apos;S MOVING? // LIVE VELOCITY
          </span>
        </div>
        <span className="text-[10px] font-mono text-neutral-500 uppercase">REAL-TIME</span>
      </div>

      <div className="space-y-2.5">
        {LIVE_SIGNALS.map((sig) => (
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

            <div
              className={`flex items-center gap-1 font-mono text-[11px] font-bold ${
                sig.direction === 'up' ? 'text-emerald-400' : 'text-neutral-500'
              }`}
            >
              {sig.direction === 'up' ? <ArrowUp className="w-3 h-3" /> : <ArrowDown className="w-3 h-3" />}
              <span>{sig.change}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
