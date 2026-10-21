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
import { useMun } from '@/context/MunContext';

interface ConferenceLiveboardProps {
  onOpenCommitteeDais?: (committeeId: string) => void;
}

export function ConferenceLiveboard({ onOpenCommitteeDais }: ConferenceLiveboardProps) {
  const { activeConference, committees, registrations, sessionState } = useMun();
  const [selectedSort, setSelectedSort] = useState<'speeches' | 'attendance' | 'quorum'>('attendance');
  const [selectedDelegate, setSelectedDelegate] = useState<any | null>(null);
  const [committeeFilter, setCommitteeFilter] = useState<string>('ALL');

  // Dynamic Telemetry Computed from Real Chambers
  const totalDelegates = committees.reduce((sum, c) => sum + (c.totalDelegates || 0), 0) || registrations.length;
  const presentDelegates = committees.reduce((sum, c) => sum + (c.presentCount || 0), 0);
  const presentAndVoting = committees.reduce((sum, c) => sum + (c.presentAndVotingCount || 0), 0);
  const attendanceRate = totalDelegates > 0 ? Math.round((presentDelegates / totalDelegates) * 100) : 0;

  const totalSpeeches = sessionState?.speakersList?.length || 0;
  const totalMotions = (sessionState?.motionsQueue?.length || 0) + (sessionState?.motionHistory?.length || 0);
  const totalPOIs = sessionState?.parliamentaryPoints?.length || 0;
  const documentsSubmitted = sessionState?.resolutions?.length || 0;
  const passedMotions = sessionState?.motionHistory?.filter((m: any) => m.status === 'passed')?.length || 0;

  const filteredCommittees = committees.filter((c) => {
    if (committeeFilter === 'ALL') return true;
    if (committeeFilter === 'UN') return ['UNSC', 'UNHRC', 'UNODC', 'UNEP', 'ECOSOC', 'DISEC'].includes(c.type);
    if (committeeFilter === 'INDIAN_PARLIAMENT') return ['LOK_SABHA', 'AIPPM', 'PARLIAMENTARY'].includes(c.type) || Boolean(c.isIndianCommittee);
    if (committeeFilter === 'PRESS') return c.name.toLowerCase().includes('press') || c.type === 'OTHER';
    return true;
  });

  const alerts = committees
    .filter((c) => !c.agenda || c.totalDelegates === 0)
    .map((c) => ({
      id: c.id,
      committee: c.shortName || c.name,
      message: !c.agenda ? 'Agenda mandate is unset. Presiding chair should define floor agenda.' : 'Quorum delegates unassigned.',
      actionLink: `/committee?chamber=${c.id}`,
    }));

  return (
    <div className="space-y-8 text-left font-sans">
      {/* ─── 1. TOP LIVE STATS RIBBON ─── */}
      <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-6 gap-3">
        <div className="p-4 rounded-2xl bg-black/60 border border-white/10 space-y-1">
          <span className="text-[10px] font-mono text-neutral-400 uppercase block">Registered Delegates</span>
          <div className="flex items-baseline gap-1.5">
            <span className="text-xl sm:text-2xl font-bold font-mono text-white">{totalDelegates}</span>
            <span className="text-[10px] font-mono text-emerald-400">Target</span>
          </div>
          <span className="text-[10px] text-neutral-500 font-mono block">Across {committees.length} Chambers</span>
        </div>

        <div className="p-4 rounded-2xl bg-black/60 border border-emerald-500/25 space-y-1">
          <span className="text-[10px] font-mono text-emerald-400 uppercase block">Present in Chamber</span>
          <div className="flex items-baseline gap-1.5">
            <span className="text-xl sm:text-2xl font-bold font-mono text-emerald-300">{presentDelegates}</span>
            <span className="text-[10px] font-mono text-emerald-400">{attendanceRate}%</span>
          </div>
          <span className="text-[10px] text-neutral-400 font-mono block">
            {presentAndVoting} Present &amp; Voting
          </span>
        </div>

        <div className="p-4 rounded-2xl bg-black/60 border border-white/10 space-y-1">
          <span className="text-[10px] font-mono text-neutral-400 uppercase block">Total Speeches</span>
          <div className="flex items-baseline gap-1.5">
            <span className="text-xl sm:text-2xl font-bold font-mono text-white">{totalSpeeches}</span>
            <span className="text-[10px] font-mono text-cyan-400">GSL</span>
          </div>
          <span className="text-[10px] text-neutral-500 font-mono block">Across Live Queues</span>
        </div>

        <div className="p-4 rounded-2xl bg-black/60 border border-white/10 space-y-1">
          <span className="text-[10px] font-mono text-neutral-400 uppercase block">Points &amp; POIs</span>
          <div className="flex items-baseline gap-1.5">
            <span className="text-xl sm:text-2xl font-bold font-mono text-white">{totalPOIs}</span>
            <span className="text-[10px] font-mono text-purple-400">Floor</span>
          </div>
          <span className="text-[10px] text-neutral-500 font-mono block">Orders &amp; Inquiries</span>
        </div>

        <div className="p-4 rounded-2xl bg-black/60 border border-white/10 space-y-1">
          <span className="text-[10px] font-mono text-neutral-400 uppercase block">Formal Motions</span>
          <div className="flex items-baseline gap-1.5">
            <span className="text-xl sm:text-2xl font-bold font-mono text-white">{totalMotions}</span>
            <span className="text-[10px] font-mono text-emerald-400">{passedMotions} Passed</span>
          </div>
          <span className="text-[10px] text-neutral-500 font-mono block">Floor Deliberations</span>
        </div>

        <div className="p-4 rounded-2xl bg-black/60 border border-white/10 space-y-1">
          <span className="text-[10px] font-mono text-neutral-400 uppercase block">Documents Table</span>
          <div className="flex items-baseline gap-1.5">
            <span className="text-xl sm:text-2xl font-bold font-mono text-white">{documentsSubmitted}</span>
            <span className="text-[10px] font-mono text-amber-400">Drafted</span>
          </div>
          <span className="text-[10px] text-neutral-500 font-mono block">Bills &amp; Resolutions</span>
        </div>
      </div>

      {/* ─── 2. ATTENTION REQUIRED ALERTS ─── */}
      {alerts.length > 0 && (
        <div className="p-4 rounded-3xl bg-amber-500/[0.04] border border-amber-500/20 space-y-3">
          <div className="flex items-center gap-2 text-amber-400 font-mono text-xs font-bold uppercase">
            <AlertTriangle className="w-4 h-4" />
            <span>SECRETARIAT ATTENTION REQUIRED ({alerts.length} NOTICES)</span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs font-sans">
            {alerts.map((alt) => (
              <div key={alt.id} className="p-3 rounded-2xl bg-black/70 border border-white/10 space-y-2 text-left">
                <div className="flex items-center justify-between font-mono text-[10px]">
                  <span className="px-2 py-0.5 rounded bg-amber-500/20 text-amber-300 font-bold">{alt.committee}</span>
                  <span className="text-neutral-500">Dais notice</span>
                </div>
                <p className="text-neutral-300 text-xs leading-snug">{alt.message}</p>
                <Link
                  href={alt.actionLink}
                  className="text-[11px] font-mono text-cyan-400 hover:text-cyan-300 underline inline-block"
                >
                  Configure Chamber &rarr;
                </Link>
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
            <p className="text-xs text-neutral-400 font-mono">Real-time dais telemetry, speakers, and procedural activity</p>
          </div>

          <div className="flex flex-wrap items-center gap-2 text-xs font-mono">
            {/* Filter */}
            <div className="flex items-center p-1 bg-white/[0.03] border border-white/10 rounded-xl text-[11px]">
              {['ALL', 'UN', 'INDIAN_PARLIAMENT', 'PRESS'].map((mode) => (
                <button
                  key={mode}
                  type="button"
                  onClick={() => setCommitteeFilter(mode)}
                  className={`px-2.5 py-1 rounded-lg transition cursor-pointer ${
                    committeeFilter === mode ? 'bg-white/15 text-white font-bold' : 'text-neutral-400'
                  }`}
                >
                  {mode === 'ALL' ? 'All' : mode === 'UN' ? 'UN' : mode === 'INDIAN_PARLIAMENT' ? 'Parliament' : 'Press/Other'}
                </button>
              ))}
            </div>

            {/* Sort */}
            <select
              value={selectedSort}
              onChange={(e) => setSelectedSort(e.target.value as any)}
              className="px-3 py-1.5 rounded-xl bg-black border border-white/15 text-xs text-neutral-300 font-mono cursor-pointer"
            >
              <option value="attendance">Sort by Attendance</option>
              <option value="quorum">Sort by Quorum</option>
            </select>
          </div>
        </div>

        <div className="rounded-3xl bg-black/40 border border-white/10 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs font-mono">
              <thead className="bg-white/[0.02] border-b border-white/10 text-neutral-400 uppercase text-[10px]">
                <tr>
                  <th className="p-4">Chamber</th>
                  <th className="p-4">Type</th>
                  <th className="p-4">Attendance</th>
                  <th className="p-4">Current Active Session</th>
                  <th className="p-4 text-center">GSL Speeches</th>
                  <th className="p-4 text-center">Motions</th>
                  <th className="p-4 text-center">POIs</th>
                  <th className="p-4 text-center">Status</th>
                  <th className="p-4 text-right">Dais Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5">
                {filteredCommittees.map((c) => {
                  const isActiveComm = c.id === sessionState?.committeeId;
                  const activeSpk = (isActiveComm && sessionState?.currentSpeaker?.portfolio) || 'Floor open';
                  const activeMot = (isActiveComm && sessionState?.currentMotion?.topic) || c.agenda || 'General Deliberations';
                  const spkCount = (isActiveComm && sessionState?.speakersList?.length) || 0;
                  const motCount = (isActiveComm && ((sessionState?.motionsQueue?.length || 0) + (sessionState?.motionHistory?.length || 0))) || 0;
                  const poiCount = (isActiveComm && sessionState?.parliamentaryPoints?.length) || 0;

                  return (
                    <tr key={c.id} className="hover:bg-white/[0.02] transition">
                      <td className="p-4 font-sans">
                        <div className="flex items-center gap-2">
                          <span className={`w-2 h-2 rounded-full ${c.presentCount > 0 ? 'bg-emerald-400 animate-pulse' : 'bg-neutral-600'}`} />
                          <span className="font-bold text-white text-sm">{c.shortName || c.name}</span>
                        </div>
                        <span className="text-[11px] text-neutral-400 block font-mono">{c.dais?.chair || 'Presiding Officer'}</span>
                      </td>
                      <td className="p-4 text-neutral-300">{c.type}</td>
                      <td className="p-4">
                        <span className="font-bold text-white">{c.presentCount}/{c.totalDelegates}</span>
                        <span className="text-[10px] text-neutral-400 block">
                          ({c.totalDelegates > 0 ? Math.round((c.presentCount / c.totalDelegates) * 100) : 0}%)
                        </span>
                      </td>
                      <td className="p-4 font-sans">
                        <span className="text-cyan-300 block text-xs font-semibold line-clamp-1">{activeMot}</span>
                        <span className="text-[11px] text-neutral-400 font-mono">Speaker: {activeSpk}</span>
                      </td>
                      <td className="p-4 text-center font-bold text-white">{spkCount}</td>
                      <td className="p-4 text-center text-neutral-300">{motCount}</td>
                      <td className="p-4 text-center text-neutral-300">{poiCount}</td>
                      <td className="p-4 text-center">
                        <span className={`px-2.5 py-1 rounded-full text-[10px] font-bold ${
                          c.presentCount > 0 ? 'bg-emerald-500/15 text-emerald-300 border border-emerald-500/30' : 'bg-white/5 text-neutral-400'
                        }`}>
                          {c.presentCount > 0 ? 'IN SESSION' : 'READY'}
                        </span>
                      </td>
                      <td className="p-4 text-right font-sans">
                        <Link
                          href={`/committee?chamber=${c.id}`}
                          className="inline-flex items-center gap-1 px-3 py-1.5 rounded-xl bg-white/10 hover:bg-white/15 text-white text-xs font-mono transition"
                        >
                          <span>Join Dais</span>
                          <ExternalLink className="w-3 h-3" />
                        </Link>
                      </td>
                    </tr>
                  );
                })}
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
              <span className="text-[10px] font-mono text-neutral-400 uppercase">CHAMBER QUORUM RETENTION</span>
              <h4 className="text-base font-bold font-display text-white">Live Attendance Telemetry</h4>
            </div>
            <span className="px-2.5 py-1 rounded-full text-xs font-mono bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 font-bold">
              {attendanceRate}% Total Quorum
            </span>
          </div>

          <div className="space-y-3 font-mono text-xs">
            <div>
              <div className="flex justify-between text-neutral-400 mb-1">
                <span>Active Floor Quorum</span>
                <span className="text-white font-bold">{attendanceRate}% ({presentDelegates}/{totalDelegates} Present)</span>
              </div>
              <div className="w-full bg-white/10 h-2 rounded-full overflow-hidden">
                <div className="bg-emerald-400 h-full rounded-full transition-all duration-500" style={{ width: `${attendanceRate}%` }} />
              </div>
            </div>

            <div>
              <div className="flex justify-between text-neutral-400 mb-1">
                <span>Present &amp; Voting Ratio</span>
                <span className="text-white font-bold">
                  {presentDelegates > 0 ? Math.round((presentAndVoting / presentDelegates) * 100) : 0}% ({presentAndVoting} Delegations)
                </span>
              </div>
              <div className="w-full bg-white/10 h-2 rounded-full overflow-hidden">
                <div className="bg-cyan-400 h-full rounded-full transition-all duration-500" style={{ width: `${presentDelegates > 0 ? (presentAndVoting / presentDelegates) * 100 : 0}%` }} />
              </div>
            </div>
          </div>
        </div>

        {/* Delegate Participation Highlights */}
        <div className="p-6 rounded-3xl bg-black/40 border border-white/10 space-y-4">
          <div className="flex items-center justify-between border-b border-white/10 pb-3">
            <div className="space-y-0.5">
              <span className="text-[10px] font-mono text-neutral-400 uppercase">DELEGATE ROSTER ENTRIES</span>
              <h4 className="text-base font-bold font-display text-white">Registered Participants</h4>
            </div>
            <span className="text-[11px] font-mono text-neutral-400">{registrations.length} Entries</span>
          </div>

          <div className="space-y-2.5">
            {registrations.length === 0 ? (
              <div className="py-8 text-center space-y-2 text-neutral-500 font-mono text-xs">
                <Users className="w-8 h-8 text-neutral-600 mx-auto" />
                <p>No registered delegates yet for this conference.</p>
                <p className="text-[11px] text-neutral-600">Share your conference link to accept delegate entries.</p>
              </div>
            ) : (
              registrations.slice(0, 8).map((del) => (
                <div
                  key={del.id}
                  onClick={() => setSelectedDelegate(del)}
                  className="p-3 rounded-2xl bg-white/[0.02] hover:bg-white/[0.05] border border-white/5 transition cursor-pointer flex items-center justify-between gap-3 text-xs"
                >
                  <div>
                    <h5 className="font-bold text-white">{del.userName}</h5>
                    <span className="text-[11px] text-cyan-300 font-mono">
                      {del.portfolioPreferences?.[0] || 'Delegation'} &bull; {del.committeePreference}
                    </span>
                  </div>
                  <div className="text-right font-mono">
                    <span className="font-bold text-white block capitalize">{del.status.replace('_', ' ')}</span>
                    <span className="text-[10px] text-neutral-400 capitalize">{del.experienceLevel}</span>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>

      {/* ─── MODAL: DELEGATE PROFILE INSPECTOR ─── */}
      {selectedDelegate && (
        <div className="fixed inset-0 z-[140] flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
          <div className="w-full max-w-md rounded-3xl bg-[#090a12] border border-cyan-500/30 p-6 sm:p-8 text-white space-y-5 text-left font-sans shadow-2xl">
            <div className="flex items-center justify-between border-b border-white/10 pb-3">
              <div>
                <span className="text-[10px] font-mono text-cyan-400 uppercase font-bold">DELEGATE PROFILE</span>
                <h3 className="text-xl font-bold font-display text-white">{selectedDelegate.userName}</h3>
                <span className="text-xs text-neutral-400 font-mono">
                  {selectedDelegate.portfolioPreferences?.[0] || 'Delegation'} &bull; {selectedDelegate.committeePreference}
                </span>
              </div>
              <button
                type="button"
                onClick={() => setSelectedDelegate(null)}
                className="text-neutral-400 hover:text-white cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="grid grid-cols-2 gap-3 text-xs font-mono">
              <div className="p-3 rounded-xl bg-black border border-white/10">
                <span className="text-neutral-500 text-[10px] block">STATUS:</span>
                <strong className="text-base text-white capitalize">{selectedDelegate.status.replace('_', ' ')}</strong>
              </div>
              <div className="p-3 rounded-xl bg-black border border-white/10">
                <span className="text-neutral-500 text-[10px] block">EXPERIENCE:</span>
                <strong className="text-base text-cyan-300 capitalize">{selectedDelegate.experienceLevel}</strong>
              </div>
              <div className="p-3 rounded-xl bg-black border border-white/10">
                <span className="text-neutral-500 text-[10px] block">EVENT ID:</span>
                <strong className="text-base text-purple-300">{selectedDelegate.eventId}</strong>
              </div>
              <div className="p-3 rounded-xl bg-black border border-white/10">
                <span className="text-neutral-500 text-[10px] block">REGISTERED:</span>
                <strong className="text-xs text-amber-300">{selectedDelegate.registeredAt ? new Date(selectedDelegate.registeredAt).toLocaleDateString() : 'Active'}</strong>
              </div>
            </div>

            <p className="text-[11px] text-neutral-500 font-mono leading-snug">
              Delegate registration verified on the ZENVITRA Secretariat Ledger.
            </p>
          </div>
        </div>
      )}
    </div>
  );
}
