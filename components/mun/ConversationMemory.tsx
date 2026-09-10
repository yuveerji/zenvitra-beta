'use client';

import React from 'react';
import { CheckCircle2, AlertCircle, ListTodo, Vote, ShieldCheck } from 'lucide-react';

interface ChamberSummaryData {
  chamberName: string;
  agreements: string[];
  openQuestions: string[];
  actionItems: { task: string; assignee: string }[];
  votes: { motion: string; result: 'PASSED' | 'FAILED'; count: string }[];
}

interface ConversationMemoryProps {
  data?: ChamberSummaryData;
}

const DEFAULT_CHAMBER_DATA: ChamberSummaryData = {
  chamberName: 'CHAMBER 07 // FUTURE OF YOUTH DIPLOMACY',
  agreements: [
    '25% civic profit mandate must remain permanently constitutionally bound in all future iterations.',
    'Diplomatic resolutions drafted in ZEN.DOCS require dual-signatory cryptographic hash verification.',
    'Chamber discussion archives will publish quarterly public digests with verified receipts.',
  ],
  openQuestions: [
    'Should committee chairs rotate bi-monthly or remain elected per multilateral assembly cycle?',
    'What latency threshold is considered acceptable for offline asynchronous resolution voting?',
  ],
  actionItems: [
    { task: 'Draft Section 4 amendments on student scholarship allocation criteria', assignee: '@yuveer' },
    { task: 'Benchmark distributed audio mesh performance under 500 simultaneous speakers', assignee: '@directorate' },
  ],
  votes: [
    { motion: 'Motion to ratify Udaipur Declaration on Digital Sovereignty', result: 'PASSED', count: '42 FOR / 3 AGAINST' },
    { motion: 'Motion to extend moderated caucus on AI algorithmic moderation', result: 'PASSED', count: '38 FOR / 7 AGAINST' },
  ],
};

export function ConversationMemory({ data = DEFAULT_CHAMBER_DATA }: ConversationMemoryProps) {
  return (
    <div className="rounded-3xl bg-[#080a12]/95 border border-white/[0.08] p-6 sm:p-8 space-y-6 backdrop-blur-2xl shadow-2xl">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-white/[0.08] pb-4">
        <div>
          <span className="font-mono text-[10px] tracking-[0.25em] text-purple-400 uppercase font-bold block">
            CHAMBER MEMORY ENGINE // REAL-TIME SYNTHESIS
          </span>
          <h3 className="font-display font-bold text-lg sm:text-xl text-white mt-0.5">
            {data.chamberName}
          </h3>
        </div>
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-purple-500/10 border border-purple-500/25 text-purple-300 font-mono text-[10px] self-start sm:self-auto">
          <ShieldCheck className="w-3 h-3" />
          <span>SYNTHESIZED FROM VERIFIED DIALOGUE</span>
        </div>
      </div>

      {/* 1. What We Agreed On */}
      <div className="space-y-3">
        <span className="flex items-center gap-2 text-xs font-mono font-bold tracking-wider text-emerald-400 uppercase">
          <CheckCircle2 className="w-3.5 h-3.5" />
          <span>WHAT WE AGREED ON</span>
        </span>
        <div className="space-y-2">
          {data.agreements.map((item, idx) => (
            <div
              key={idx}
              className="p-3 rounded-xl bg-white/[0.02] border border-white/[0.04] text-xs sm:text-sm font-outfit text-neutral-200 leading-relaxed"
            >
              {idx + 1}. {item}
            </div>
          ))}
        </div>
      </div>

      {/* 2. Open Questions & Points of Contention */}
      <div className="space-y-3">
        <span className="flex items-center gap-2 text-xs font-mono font-bold tracking-wider text-amber-400 uppercase">
          <AlertCircle className="w-3.5 h-3.5" />
          <span>OPEN QUESTIONS &amp; POINTS OF CONTENTION</span>
        </span>
        <div className="space-y-2">
          {data.openQuestions.map((item, idx) => (
            <div
              key={idx}
              className="p-3 rounded-xl bg-white/[0.02] border border-white/[0.04] text-xs sm:text-sm font-outfit text-neutral-300 leading-relaxed"
            >
              • {item}
            </div>
          ))}
        </div>
      </div>

      {/* 3. Proposed Actions & Rapporteur Tasks */}
      <div className="space-y-3">
        <span className="flex items-center gap-2 text-xs font-mono font-bold tracking-wider text-cyan-400 uppercase">
          <ListTodo className="w-3.5 h-3.5" />
          <span>PROPOSED ACTIONS &amp; RAPPORTEUR TASKS</span>
        </span>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
          {data.actionItems.map((act, idx) => (
            <div
              key={idx}
              className="p-3 rounded-xl bg-white/[0.02] border border-white/[0.04] space-y-1"
            >
              <div className="text-xs font-outfit text-white font-medium">{act.task}</div>
              <div className="font-mono text-[10px] text-cyan-400 font-bold">{act.assignee}</div>
            </div>
          ))}
        </div>
      </div>

      {/* 4. Chamber Votes */}
      <div className="space-y-3">
        <span className="flex items-center gap-2 text-xs font-mono font-bold tracking-wider text-purple-400 uppercase">
          <Vote className="w-3.5 h-3.5" />
          <span>RATIFIED CHAMBER VOTES</span>
        </span>
        <div className="space-y-2">
          {data.votes.map((v, idx) => (
            <div
              key={idx}
              className="flex items-center justify-between p-3 rounded-xl bg-white/[0.02] border border-white/[0.04] text-xs"
            >
              <span className="font-outfit text-neutral-200">{v.motion}</span>
              <div className="flex items-center gap-2 shrink-0 font-mono">
                <span className="px-2 py-0.5 rounded-md bg-emerald-500/10 border border-emerald-500/25 text-emerald-400 text-[10px] font-bold">
                  {v.result}
                </span>
                <span className="text-neutral-500 text-[10px]">{v.count}</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
