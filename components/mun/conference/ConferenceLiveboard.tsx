'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import {
  Users,
  Mic,
  Clock,
  Radio,
  FileText,
  Vote,
  AlertTriangle,
  CheckCircle2,
  TrendingUp,
  ArrowUpRight,
  ShieldCheck,
  Search,
  Building,
  Sparkles,
  ExternalLink,
  ChevronDown,
  X,
  Play
} from 'lucide-react';
import {
  ZENMUN_2026_MASTER,
  INITIAL_DELEGATE_SUMMARIES
} from '@/lib/conferenceData';
import {
  ConferenceMaster,
  CommitteeLiveSummary,
  DelegateParticipationSummary
} from '@/types/conference';

interface ConferenceLiveboardProps {
  onOpenCommitteeDais?: (committeeId: string) => void;
}

export function ConferenceLiveboard({ onOpenCommitteeDais }: ConferenceLiveboardProps) {
  const [conference] = useState<ConferenceMaster>(ZENMUN_2026_MASTER);
  const [selectedSort, setSelectedSort] = useState<'speeches' | 'attendance' | 'score'>('score');
  const [selectedDelegate, setSelectedDelegate] = useState<DelegateParticipationSummary | null>(null);
  const [committeeFilter, setCommitteeFilter] = useState<string>('ALL');

  const sortedCommittees = [...conference.committees].sort((a, b) => {
    if (selectedSort === 'speeches') return b.speechesCount - a.speechesCount;
    if (selectedSort === 'attendance') return (b.presentCount / b.totalDelegates) - (a.presentCount / a.totalDelegates);
    return b.activityScore - a.activityScore;
  });

  const filteredCommittees = sortedCommittees.filter((c) => {
    if (committeeFilter === 'ALL') return true;
    return c.type === committeeFilter;
  });

  return (
    <div className="space-y-8 text-left font-sans">
      {/* ─── 1. TOP LIVE STATS RIBBON ─── */}
      <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-6 gap-3">
        <div className="p-4 rounded-2xl bg-black/60 border border-white/10 space-y-1">
          <span className="text-[10px] font-mono text-neutral-400 uppercase block">Registered Delegates</span>
          <div className="flex items-baseline gap-1.5">
            <span className="text-xl sm:text-2xl font-bold font-mono text-white">{conference.stats.totalDelegates}</span>
            <span className="text-[10px] font-mono text-emerald-400">100%</span>
          </div>
          <span className="text-[10px] text-neutral-500 font-mono block">Across 5 Chambers</span>
        </div>

        <div className="p-4 rounded-2xl bg-black/60 border border-emerald-500/25 space-y-1">
          <span className="text-[10px] font-mono text-emerald-400 uppercase block">Present Today</span>
          <div className="flex items-baseline gap-1.5">
            <span className="text-xl sm:text-2xl font-bold font-mono text-emerald-300">{conference.stats.presentToday}</span>
            <span className="text-[10px] font-mono text-emerald-400">92.8%</span>
          </div>
          <span className="text-[10px] text-neutral-400 font-mono block">Late: {conference.stats.lateToday} &bull; Absent: {conference.stats.absentToday}</span>
        </div>

        <div className="p-4 rounded-2xl bg-black/60 border border-white/10 space-y-1">
          <span className="text-[10px] font-mono text-neutral-400 uppercase block">Total Speeches</span>
          <div className="flex items-baseline gap-1.5">
            <span className="text-xl sm:text-2xl font-bold font-mono text-white">{conference.stats.totalSpeeches}</span>
            <span className="text-[10px] font-mono text-cyan-400">4h 37m</span>
          </div>
          <span className="text-[10px] text-neutral-500 font-mono block">Avg 1m 15s per speech</span>
        </div>

        <div className="p-4 rounded-2xl bg-black/60 border border-white/10 space-y-1">
          <span className="text-[10px] font-mono text-neutral-400 uppercase block">Points &amp; POIs</span>
          <div className="flex items-baseline gap-1.5">
            <span className="text-xl sm:text-2xl font-bold font-mono text-white">{conference.stats.totalPOIs}</span>
            <span className="text-[10px] font-mono text-purple-400">Active</span>
          </div>
          <span className="text-[10px] text-neutral-500 font-mono block">51 Orders &bull; 43 Inquiries</span>
        </div>

        <div className="p-4 rounded-2xl bg-black/60 border border-white/10 space-y-1">
          <span className="text-[10px] font-mono text-neutral-400 uppercase block">Formal Motions</span>
          <div className="flex items-baseline gap-1.5">
            <span className="text-xl sm:text-2xl font-bold font-mono text-white">{conference.stats.totalMotions}</span>
            <span className="text-[10px] font-mono text-emerald-400">71 Passed</span>
          </div>
          <span className="text-[10px] text-neutral-500 font-mono block">12 Rejected &bull; 8 Pending</span>
        </div>

        <div className="p-4 rounded-2xl bg-black/60 border border-white/10 space-y-1">
          <span className="text-[10px] font-mono text-neutral-400 uppercase block">Documents Table</span>
          <div className="flex items-baseline gap-1.5">
            <span className="text-xl sm:text-2xl font-bold font-mono text-white">{conference.stats.documentsSubmitted}</span>
            <span className="text-[10px] font-mono text-amber-400">{conference.stats.votesConducted} Votes</span>
          </div>
          <span className="text-[10px] text-neutral-500 font-mono block">Bills &amp; Resolutions</span>
        </div>
      </div>

      {/* ─── 2. ATTENTION REQUIRED ALERTS ─── */}
      {conference.alerts.length > 0 && (
        <div className="p-4 rounded-3xl bg-amber-500/[0.04] border border-amber-500/20 space-y-3">
          <div className="flex items-center gap-2 text-amber-400 font-mono text-xs font-bold uppercase">
            <AlertTriangle className="w-4 h-4" />
            <span>SECRETARIAT ATTENTION REQUIRED ({conference.alerts.length} NOTICES)</span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs font-sans">
            {conference.alerts.map((alt) => (
              <div key={alt.id} className="p-3 rounded-2xl bg-black/70 border border-white/10 space-y-2 text-left">
                <div className="flex items-center justify-between font-mono text-[10px]">
                  <span className="px-2 py-0.5 rounded bg-amber-500/20 text-amber-300 font-bold">{alt.committee}</span>
                  <span className="text-neutral-500">{alt.timestamp}</span>
                </div>
                <p className="text-neutral-300 text-xs leading-snug">{alt.message}</p>
                {alt.actionText && (
                  <button
                    type="button"
                    onClick={() => alert(`Triggered: ${alt.actionText}`)}
                    className="text-[11px] font-mono text-cyan-400 hover:text-cyan-300 underline cursor-pointer"
                  >
                    {alt.actionText} &rarr;
                  </button>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ─── 3. ALL COMMITTEES LIVE TABLE ─── */}
      <div className="space-y-4">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
          <div className="space-y-0.5">
            <h3 className="text-lg font-bold font-display text-white">Live Committee Oversight</h3>
            <p className="text-xs text-neutral-400 font-mono">Real-time dais telemetry, speakers, and procedural activity indices</p>
          </div>

          <div className="flex flex-wrap items-center gap-2 text-xs font-mono">
            {/* Filter */}
            <div className="flex items-center p-1 bg-white/[0.03] border border-white/10 rounded-xl text-[11px]">
              {['ALL', 'UN', 'INDIAN_PARLIAMENT', 'PRESS'].map((mode) => (
                <button
                  key={mode}
                  onClick={() => setCommitteeFilter(mode)}
                  className={`px-2.5 py-1 rounded-lg transition cursor-pointer ${
                    committeeFilter === mode ? 'bg-white/15 text-white font-bold' : 'text-neutral-400'
                  }`}
                >
                  {mode === 'ALL' ? 'All' : mode === 'UN' ? 'UN' : mode === 'INDIAN_PARLIAMENT' ? 'Parliament' : 'Press'}
                </button>
              ))}
            </div>

            {/* Sort */}
            <select
              value={selectedSort}
              onChange={(e) => setSelectedSort(e.target.value as any)}
              className="px-3 py-1.5 rounded-xl bg-black border border-white/15 text-xs text-neutral-300 font-mono cursor-pointer"
            >
              <option value="score">Sort by Activity Score</option>
              <option value="speeches">Sort by Speeches</option>
              <option value="attendance">Sort by Attendance</option>
            </select>
          </div>
        </div>

        <div className="rounded-3xl bg-black/40 border border-white/10 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs font-mono">
              <thead className="bg-white/[0.02] border-b border-white/10 text-neutral-400 uppercase text-[10px]">
                <tr>
                  <th className="p-4">Chamber</th>
                  <th className="p-4">Room</th>
                  <th className="p-4">Attendance</th>
                  <th className="p-4">Current Active Session</th>
                  <th className="p-4 text-center">Speeches</th>
                  <th className="p-4 text-center">Motions</th>
                  <th className="p-4 text-center">POIs</th>
                  <th className="p-4 text-center">Index</th>
                  <th className="p-4 text-right">Dais Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5">
                {filteredCommittees.map((c) => (
                  <tr key={c.id} className="hover:bg-white/[0.02] transition">
                    <td className="p-4 font-sans">
                      <div className="flex items-center gap-2">
                        <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                        <span className="font-bold text-white text-sm">{c.shortName}</span>
                      </div>
                      <span className="text-[11px] text-neutral-400 block font-mono">{c.chairName}</span>
                    </td>
                    <td className="p-4 text-neutral-300">{c.room}</td>
                    <td className="p-4">
                      <span className="font-bold text-white">{c.presentCount}/{c.totalDelegates}</span>
                      <span className="text-[10px] text-neutral-400 block">
                        ({Math.round((c.presentCount / c.totalDelegates) * 100)}%)
                      </span>
                    </td>
                    <td className="p-4 font-sans">
                      <span className="text-cyan-300 block text-xs font-semibold">{c.currentSession}</span>
                      <span className="text-[11px] text-neutral-400 font-mono">Speaker: {c.currentSpeaker}</span>
                    </td>
                    <td className="p-4 text-center font-bold text-white">{c.speechesCount}</td>
                    <td className="p-4 text-center text-neutral-300">{c.motionsCount}</td>
                    <td className="p-4 text-center text-neutral-300">{c.poisCount}</td>
                    <td className="p-4 text-center">
                      <span className="px-2.5 py-1 rounded-full text-[10px] font-bold bg-purple-500/15 text-purple-300 border border-purple-500/30">
                        {c.activityScore}/100
                      </span>
                    </td>
                    <td className="p-4 text-right font-sans">
                      <Link
                        href="/committee"
                        className="inline-flex items-center gap-1 px-3 py-1.5 rounded-xl bg-white/10 hover:bg-white/15 text-white text-xs font-mono transition"
                      >
                        <span>Join Dais</span>
                        <ExternalLink className="w-3 h-3" />
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* ─── 4. ATTENDANCE & SPEECH INTELLIGENCE PANELS ─── */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Attendance Retention Telemetry */}
        <div className="p-6 rounded-3xl bg-black/40 border border-white/10 space-y-4">
          <div className="flex items-center justify-between border-b border-white/10 pb-3">
            <div className="space-y-0.5">
              <span className="text-[10px] font-mono text-neutral-400 uppercase">TELEMETRY &bull; DAY 1 ATTENDANCE</span>
              <h4 className="text-base font-bold font-display text-white">Session Retention Rates</h4>
            </div>
            <span className="px-2.5 py-1 rounded-full text-xs font-mono bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 font-bold">
              92.8% Average
            </span>
          </div>

          <div className="space-y-3 font-mono text-xs">
            <div>
              <div className="flex justify-between text-neutral-400 mb-1">
                <span>Morning Plenary Roll Call (09:00 AM)</span>
                <span className="text-white font-bold">94.2% (458 Present)</span>
              </div>
              <div className="w-full bg-white/10 h-2 rounded-full overflow-hidden">
                <div className="bg-emerald-400 h-full rounded-full" style={{ width: '94.2%' }} />
              </div>
            </div>

            <div>
              <div className="flex justify-between text-neutral-400 mb-1">
                <span>Session II Post-Lunch Return (01:30 PM)</span>
                <span className="text-white font-bold">91.8% (446 Present)</span>
              </div>
              <div className="w-full bg-white/10 h-2 rounded-full overflow-hidden">
                <div className="bg-cyan-400 h-full rounded-full" style={{ width: '91.8%' }} />
              </div>
            </div>

            <div>
              <div className="flex justify-between text-neutral-400 mb-1">
                <span>Session III Evening Formal Voting (05:00 PM)</span>
                <span className="text-white font-bold">88.4% (430 Present)</span>
              </div>
              <div className="w-full bg-white/10 h-2 rounded-full overflow-hidden">
                <div className="bg-purple-400 h-full rounded-full" style={{ width: '88.4%' }} />
              </div>
            </div>
          </div>
        </div>

        {/* Delegate Participation Highlights */}
        <div className="p-6 rounded-3xl bg-black/40 border border-white/10 space-y-4">
          <div className="flex items-center justify-between border-b border-white/10 pb-3">
            <div className="space-y-0.5">
              <span className="text-[10px] font-mono text-neutral-400 uppercase">DELEGATE LEADERBOARD TELEMETRY</span>
              <h4 className="text-base font-bold font-display text-white">Active Floor Contributors</h4>
            </div>
            <span className="text-[11px] font-mono text-neutral-400">Non-Biased Activity Log</span>
          </div>

          <div className="space-y-2.5">
            {INITIAL_DELEGATE_SUMMARIES.map((del) => (
              <div
                key={del.id}
                onClick={() => setSelectedDelegate(del)}
                className="p-3 rounded-2xl bg-white/[0.02] hover:bg-white/[0.05] border border-white/5 transition cursor-pointer flex items-center justify-between gap-3 text-xs"
              >
                <div>
                  <h5 className="font-bold text-white">{del.name}</h5>
                  <span className="text-[11px] text-cyan-300 font-mono">{del.countryOrPortfolio} &bull; {del.committee}</span>
                </div>
                <div className="text-right font-mono">
                  <span className="font-bold text-white block">{del.speechesCount} Speeches</span>
                  <span className="text-[10px] text-neutral-400">{del.speakingTime} &bull; {del.poisRaised} POIs</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ─── MODAL: DELEGATE PROFILE INSPECTOR ─── */}
      {selectedDelegate && (
        <div className="fixed inset-0 z-[140] flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
          <div className="w-full max-w-md rounded-3xl bg-[#090a12] border border-cyan-500/30 p-6 sm:p-8 text-white space-y-5 text-left font-sans shadow-2xl">
            <div className="flex items-center justify-between border-b border-white/10 pb-3">
              <div>
                <span className="text-[10px] font-mono text-cyan-400 uppercase font-bold">DELEGATE PARTICIPATION PROFILE</span>
                <h3 className="text-xl font-bold font-display text-white">{selectedDelegate.name}</h3>
                <span className="text-xs text-neutral-400 font-mono">{selectedDelegate.countryOrPortfolio} &bull; {selectedDelegate.committee}</span>
              </div>
              <button
                onClick={() => setSelectedDelegate(null)}
                className="text-neutral-400 hover:text-white cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="grid grid-cols-2 gap-3 text-xs font-mono">
              <div className="p-3 rounded-xl bg-black border border-white/10">
                <span className="text-neutral-500 text-[10px] block">TOTAL SPEECHES:</span>
                <strong className="text-base text-white">{selectedDelegate.speechesCount}</strong>
              </div>
              <div className="p-3 rounded-xl bg-black border border-white/10">
                <span className="text-neutral-500 text-[10px] block">SPEAKING TIME:</span>
                <strong className="text-base text-cyan-300">{selectedDelegate.speakingTime}</strong>
              </div>
              <div className="p-3 rounded-xl bg-black border border-white/10">
                <span className="text-neutral-500 text-[10px] block">POIS RAISED:</span>
                <strong className="text-base text-purple-300">{selectedDelegate.poisRaised}</strong>
              </div>
              <div className="p-3 rounded-xl bg-black border border-white/10">
                <span className="text-neutral-500 text-[10px] block">MOTIONS PROPOSED:</span>
                <strong className="text-base text-amber-300">{selectedDelegate.motionsProposed}</strong>
              </div>
              <div className="p-3 rounded-xl bg-black border border-white/10">
                <span className="text-neutral-500 text-[10px] block">DOCUMENTS AUTHORED:</span>
                <strong className="text-base text-emerald-300">{selectedDelegate.documentsAuthored}</strong>
              </div>
              <div className="p-3 rounded-xl bg-black border border-white/10">
                <span className="text-neutral-500 text-[10px] block">ATTENDANCE RATE:</span>
                <strong className="text-base text-white">{selectedDelegate.attendanceRate}</strong>
              </div>
            </div>

            <p className="text-[11px] text-neutral-500 font-mono leading-snug">
              Note: This is an unweighted procedural telemetry log. Awards are evaluated solely by the Executive Board and Secretariat without algorithmic prejudice.
            </p>
          </div>
        </div>
      )}
    </div>
  );
}
