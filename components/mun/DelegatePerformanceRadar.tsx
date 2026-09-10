'use client';

import React from 'react';
import { Activity, Award, FileText, MessageSquare, Flame, CheckCircle } from 'lucide-react';

interface DelegateMetric {
  label: string;
  count: number;
  percentage: number;
  color: string;
}

const METRICS: DelegateMetric[] = [
  { label: 'Speeches Delivered', count: 14, percentage: 85, color: 'bg-amber-400' },
  { label: 'Working Papers Co-Authored', count: 3, percentage: 92, color: 'bg-cyan-400' },
  { label: 'Motions Raised', count: 8, percentage: 70, color: 'bg-purple-400' },
  { label: 'Points of Information (POIs)', count: 21, percentage: 65, color: 'bg-rose-400' },
  { label: 'Roll Call Attendance', count: 100, percentage: 100, color: 'bg-emerald-400' },
];

export function DelegatePerformanceRadar() {
  return (
    <div className="rounded-3xl bg-[#06070a]/95 border border-white/[0.08] p-6 space-y-6 backdrop-blur-2xl shadow-2xl">
      <div className="flex items-center justify-between border-b border-white/[0.06] pb-3">
        <div className="flex items-center gap-2">
          <Award className="w-4 h-4 text-amber-400" />
          <span className="font-mono text-xs font-bold uppercase tracking-widest text-white">
            DELEGATE ACTIVITY VECTOR // PERFORMANCE RECORD
          </span>
        </div>
        <span className="text-[10px] font-mono text-neutral-400">FACTUAL CITATION</span>
      </div>

      <div className="space-y-4">
        {METRICS.map((m) => (
          <div key={m.label} className="space-y-1.5">
            <div className="flex items-center justify-between text-xs font-outfit">
              <span className="text-neutral-300 font-medium">{m.label}</span>
              <span className="font-mono text-white font-bold">{m.count}</span>
            </div>
            <div className="h-2 w-full bg-white/[0.04] rounded-full overflow-hidden">
              <div
                className={`h-full rounded-full ${m.color}`}
                style={{ width: `${m.percentage}%` }}
              />
            </div>
          </div>
        ))}
      </div>

      <p className="text-[10px] font-mono text-neutral-500 pt-2 border-t border-white/[0.06] leading-relaxed">
        Activity records are derived directly from verified Dais roll-calls, speech timers, and ratified resolution amendments. No opaque AI scoring.
      </p>
    </div>
  );
}
