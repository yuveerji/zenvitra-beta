'use client';

import React, { useState } from 'react';
import { X, Trophy, FileText, Download, Users, Mic, Clock, ChevronRight, Plus, Minus, ArrowLeft } from 'lucide-react';
import { useZenMun } from '@/context/ZenMunContext';
import { ZenDelegate } from '@/types/zenMun';

export function ScoreboardModal() {
  const {
    session,
    showScoreboardModal,
    setShowScoreboardModal,
    scoreboardRanking,
    awardManualPoints,
    exportCsvScores,
  } = useZenMun();

  const [activeTab, setActiveTab] = useState<'ranking' | 'matrix' | 'history'>('ranking');
  const [drillInDelegate, setDrillInDelegate] = useState<ZenDelegate | null>(null);

  // Manual point award/deduct form in drill-in
  const [manualAmount, setManualAmount] = useState<number>(5);
  const [manualReason, setManualReason] = useState<string>('');

  if (!showScoreboardModal) return null;

  // Aggregate metrics
  const totalDelegations = session.roster.length;
  const speechesLedger = session.pointsLedger.filter(
    (p) => p.category === 'gsl_speech' || p.category === 'caucus_speech'
  );
  const totalSpeeches = speechesLedger.length;
  const totalSpeakingSeconds = session.pointsLedger.reduce(
    (acc, p) => (p.secondsSpoken ? acc + p.secondsSpoken : acc),
    0
  );

  const drillInEntries = drillInDelegate
    ? session.pointsLedger.filter((p) => p.delegateId === drillInDelegate.id)
    : [];
  const drillInFeedbacks = drillInDelegate
    ? session.commenterFeedbacks.filter((f) => f.delegateId === drillInDelegate.id)
    : [];

  const handleApplyManual = (isDeduct = false) => {
    if (!drillInDelegate || manualAmount <= 0) return;
    const pts = isDeduct ? -Math.abs(manualAmount) : Math.abs(manualAmount);
    awardManualPoints(
      drillInDelegate.id,
      pts,
      manualReason.trim() || (isDeduct ? 'Manual deduction' : 'Manual award')
    );
    setManualReason('');
  };

  // Helper to calculate matrix stats for each delegate
  const getMatrixRow = (del: ZenDelegate) => {
    const entries = session.pointsLedger.filter((p) => p.delegateId === del.id);
    const gsl = entries.filter((e) => e.category === 'gsl_speech').length;
    const cauc = entries.filter((e) => e.category === 'caucus_speech').length;
    const timeSec = entries.reduce((acc, e) => acc + (e.secondsSpoken || 0), 0);
    const mot = entries.filter((e) => e.category === 'motion_raised' || e.category === 'motion_passed').length;
    const rtr = entries.filter((e) => e.category === 'right_of_reply').length;
    const wp = entries.filter((e) => e.category === 'working_paper').length;
    const dr = entries.filter((e) => e.category === 'draft_resolution' || e.category === 'dr_passed').length;
    const manual = entries
      .filter((e) => e.category === 'manual_adjustment')
      .reduce((acc, e) => acc + e.points, 0);
    const points = entries.reduce((acc, e) => acc + e.points, 0);

    const rankItem = scoreboardRanking.find((r) => r.delegate.id === del.id);
    const quality = rankItem && rankItem.avgQuality > 0 ? `${rankItem.avgQuality}/10` : 'None';
    const score = rankItem ? rankItem.blendedScore : points;

    return { gsl, cauc, timeSec, mot, rtr, wp, dr, manual, points, quality, score };
  };

  return (
    <div className="fixed inset-0 z-[9999] bg-black/80 backdrop-blur-md flex items-center justify-center p-4 animate-fade-in select-none">
      <div className="w-full max-w-4xl bg-[#090d16] rounded-3xl border border-white/15 shadow-2xl overflow-hidden flex flex-col max-h-[92vh]">
        
        {/* ── 1. HEADER ── */}
        <div className="px-6 py-4 bg-[#0c1220] text-white flex items-center justify-between border-b border-white/10">
          <div className="flex items-center gap-2.5">
            <span className="w-1.5 h-5 bg-amber-400 rounded-full" />
            <h2 className="text-base font-black tracking-tight text-white uppercase flex items-center gap-2">
              <Trophy className="w-4 h-4 text-amber-400" />
              <span>Scoreboard &amp; Ledger</span>
            </h2>
          </div>

          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={exportCsvScores}
              className="px-4 py-1.5 rounded-full bg-cyan-500 hover:bg-cyan-400 text-black font-black text-xs flex items-center gap-1.5 transition shadow-sm cursor-pointer active:scale-95"
            >
              <FileText className="w-3.5 h-3.5" />
              <span>Download CSV</span>
            </button>
            <button
              type="button"
              onClick={() => {
                setShowScoreboardModal(false);
                setDrillInDelegate(null);
              }}
              className="text-white/60 hover:text-white p-1 rounded-full cursor-pointer transition"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* ── 2. SUB-BADGES & VIEW SWITCHER ── */}
        <div className="px-6 py-4 bg-[#0a0f1d] border-b border-white/10 space-y-4">
          
          {/* Top Stat Pills Row */}
          <div className="flex flex-wrap items-center gap-3">
            <div className="px-4 py-2 rounded-2xl bg-white/5 border border-white/10 shadow-xs flex items-center gap-2 text-xs font-black text-white">
              <Users className="w-4 h-4 text-cyan-400" />
              <span>{totalDelegations} DELEGATIONS</span>
            </div>

            <div className="px-4 py-2 rounded-2xl bg-white/5 border border-white/10 shadow-xs flex items-center gap-2 text-xs font-black text-white">
              <Mic className="w-4 h-4 text-amber-400" />
              <span>{totalSpeeches} SPEECHES</span>
            </div>

            <div className="px-4 py-2 rounded-2xl bg-white/5 border border-white/10 shadow-xs flex items-center gap-2 text-xs font-black text-white">
              <Clock className="w-4 h-4 text-emerald-400" />
              <span>{totalSpeakingSeconds}s SPEAKING TIME</span>
            </div>
          </div>

          {/* View Switcher Tabs: Ranking / Matrix / History */}
          <div className="flex items-center gap-2">
            {(['ranking', 'matrix', 'history'] as const).map((tab) => {
              const label = tab === 'ranking' ? 'Ranking' : tab === 'matrix' ? 'Matrix' : 'History';
              const isActive = activeTab === tab;

              return (
                <button
                  key={tab}
                  type="button"
                  onClick={() => {
                    setActiveTab(tab);
                    setDrillInDelegate(null);
                  }}
                  className={`px-4 py-2 rounded-xl text-xs font-black tracking-wide transition cursor-pointer flex items-center gap-1.5 ${
                    isActive
                      ? 'bg-cyan-500 text-black shadow-md'
                      : 'bg-white/5 hover:bg-white/10 text-white border border-white/10'
                  }`}
                >
                  <span>{label}</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* ── 3. MAIN TABLE BODY ── */}
        <div className="p-6 overflow-y-auto flex-1">
          {drillInDelegate ? (
            /* DELEGATION DRILL-IN DETAIL VIEW */
            <div className="space-y-6 animate-fade-in">
              <div className="flex items-center justify-between border-b border-white/10 pb-4">
                <button
                  type="button"
                  onClick={() => setDrillInDelegate(null)}
                  className="text-xs font-bold text-cyan-400 hover:underline flex items-center gap-1 cursor-pointer"
                >
                  <ArrowLeft className="w-3.5 h-3.5" />
                  <span>Back to {activeTab}</span>
                </button>

                <div className="flex items-center gap-3">
                  <img
                    src={`https://flagcdn.com/w80/${drillInDelegate.countryCode.toLowerCase()}.png`}
                    alt=""
                    className="w-7 h-7 rounded-full object-cover border border-white/20"
                  />
                  <span className="text-base font-black text-white">{drillInDelegate.name}</span>
                </div>
              </div>

              {/* Manual Point Award / Deduct Bar */}
              <div className="p-4 rounded-2xl bg-white/5 border border-white/10 space-y-3">
                <div className="text-xs font-black uppercase text-cyan-400">Award or Deduct Points</div>
                <div className="flex items-center gap-2 flex-wrap">
                  <input
                    type="number"
                    min={1}
                    max={100}
                    value={manualAmount}
                    onChange={(e) => setManualAmount(parseInt(e.target.value) || 5)}
                    className="w-20 px-3 py-1.5 rounded-xl bg-black/40 border border-white/10 text-xs font-mono font-bold text-white focus:outline-none focus:border-cyan-400"
                  />
                  <input
                    type="text"
                    placeholder="Reason (e.g. exemplary framing, POO violation)..."
                    value={manualReason}
                    onChange={(e) => setManualReason(e.target.value)}
                    className="flex-1 min-w-[200px] px-3 py-1.5 rounded-xl bg-black/40 border border-white/10 text-xs font-medium text-white focus:outline-none focus:border-cyan-400 placeholder-white/30"
                  />
                  <button
                    type="button"
                    onClick={() => handleApplyManual(false)}
                    className="px-4 py-1.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-black font-black text-xs flex items-center gap-1 cursor-pointer shadow-md transition"
                  >
                    <Plus className="w-3.5 h-3.5" />
                    <span>Award</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => handleApplyManual(true)}
                    className="px-4 py-1.5 rounded-xl bg-rose-500/20 hover:bg-rose-500/30 text-rose-300 border border-rose-500/30 font-bold text-xs flex items-center gap-1 cursor-pointer shadow-xs transition"
                  >
                    <Minus className="w-3.5 h-3.5" />
                    <span>Deduct</span>
                  </button>
                </div>
              </div>

              {/* Point Ledger Timeline */}
              <div className="space-y-2">
                <div className="text-xs font-black uppercase text-neutral-400">Activity Ledger</div>
                {drillInEntries.length === 0 ? (
                  <div className="p-6 rounded-2xl bg-white/5 border border-white/10 text-center text-xs text-neutral-400">
                    No activity recorded for this delegation yet.
                  </div>
                ) : (
                  <div className="divide-y divide-white/10 rounded-2xl bg-white/5 border border-white/10 overflow-hidden">
                    {drillInEntries.map((e) => (
                      <div key={e.id} className="p-3.5 flex items-center justify-between text-xs">
                        <div>
                          <div className="font-bold text-white">{e.reason}</div>
                          <div className="text-[10px] text-neutral-400 font-mono">
                            {new Date(e.timestamp).toLocaleTimeString()}
                          </div>
                        </div>
                        <span
                          className={`font-mono font-black ${
                            e.points >= 0 ? 'text-emerald-400' : 'text-rose-400'
                          }`}
                        >
                          {e.points > 0 ? `+${e.points}` : e.points} pts
                        </span>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          ) : activeTab === 'ranking' ? (
            /* TAB 1: RANKING VIEW */
            <div className="overflow-x-auto rounded-2xl border border-white/10 bg-[#0d1424]">
              <table className="w-full text-left text-xs">
                <thead className="bg-[#0a0f1d] text-neutral-400 font-bold uppercase tracking-wider text-[10px] border-b border-white/10">
                  <tr>
                    <th className="py-3 px-4 w-12 text-center">#</th>
                    <th className="py-3 px-4">DELEGATION</th>
                    <th className="py-3 px-4 text-center">SPEECHES</th>
                    <th className="py-3 px-4 text-center">TIME</th>
                    <th className="py-3 px-4 text-right">SCORE</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/5">
                  {scoreboardRanking.map((item, idx) => {
                    const rowStats = getMatrixRow(item.delegate);
                    const isAbsent = item.delegate.attendance === 'absent';

                    return (
                      <tr
                        key={item.delegate.id}
                        onClick={() => setDrillInDelegate(item.delegate)}
                        className="hover:bg-white/5 transition cursor-pointer group"
                      >
                        <td className="py-3 px-4 text-center font-mono font-bold text-neutral-400">
                          {idx + 1}
                        </td>
                        <td className="py-3 px-4">
                          <div className="flex items-center gap-3">
                            <img
                              src={`https://flagcdn.com/w80/${item.delegate.countryCode.toLowerCase()}.png`}
                              alt=""
                              className="w-5 h-5 rounded-full object-cover border border-white/20 shrink-0"
                              onError={(e) => {
                                (e.target as HTMLElement).style.display = 'none';
                              }}
                            />
                            <span className="font-bold text-white">{item.delegate.name}</span>
                            <span
                              className={`text-[10px] font-mono px-2 py-0.5 rounded-full border ${
                                isAbsent ? 'bg-rose-500/20 text-rose-300 border-rose-500/30' : 'bg-emerald-500/20 text-emerald-300 border-emerald-500/30'
                              }`}
                            >
                              {isAbsent ? 'Absent' : 'Present'}
                            </span>
                          </div>
                        </td>
                        <td className="py-3 px-4 text-center font-bold text-white">
                          {rowStats.gsl + rowStats.cauc}
                        </td>
                        <td className="py-3 px-4 text-center font-mono text-neutral-400">
                          {rowStats.timeSec}s
                        </td>
                        <td className="py-3 px-4 text-right">
                          <div className="inline-flex items-center gap-1 font-black text-sm text-cyan-400">
                            <span>{item.blendedScore} pts</span>
                            <ChevronRight className="w-3.5 h-3.5 text-neutral-400 group-hover:translate-x-0.5 transition" />
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          ) : activeTab === 'matrix' ? (
            /* TAB 2: MATRIX VIEW */
            <div className="overflow-x-auto rounded-2xl border border-white/10 bg-[#0d1424]">
              <table className="w-full text-left text-xs whitespace-nowrap">
                <thead className="bg-[#0a0f1d] text-neutral-400 font-bold uppercase tracking-wider text-[10px] border-b border-white/10">
                  <tr>
                    <th className="py-3 px-4">DELEGATION</th>
                    <th className="py-3 px-2 text-center">GSL</th>
                    <th className="py-3 px-2 text-center">CAUC</th>
                    <th className="py-3 px-3 text-center">TIME</th>
                    <th className="py-3 px-2 text-center">MOT</th>
                    <th className="py-3 px-2 text-center">RTR</th>
                    <th className="py-3 px-2 text-center">WP</th>
                    <th className="py-3 px-2 text-center">DR</th>
                    <th className="py-3 px-2 text-center">&plusmn;</th>
                    <th className="py-3 px-3 text-center">POINTS</th>
                    <th className="py-3 px-3 text-center">QUALITY</th>
                    <th className="py-3 px-4 text-center">SCORE</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/5">
                  {session.roster.map((del) => {
                    const row = getMatrixRow(del);

                    return (
                      <tr
                        key={del.id}
                        onClick={() => setDrillInDelegate(del)}
                        className="hover:bg-white/5 transition cursor-pointer"
                      >
                        <td className="py-2.5 px-4">
                          <div className="flex items-center gap-2">
                            <img
                              src={`https://flagcdn.com/w80/${del.countryCode.toLowerCase()}.png`}
                              alt=""
                              className="w-4 h-4 rounded-full object-cover shrink-0 border border-white/20"
                            />
                            <span className="font-bold text-white truncate max-w-[140px]">{del.name}</span>
                          </div>
                        </td>
                        <td className="py-2.5 px-2 text-center font-mono text-neutral-400">{row.gsl}</td>
                        <td className="py-2.5 px-2 text-center font-mono text-neutral-400">{row.cauc}</td>
                        <td className="py-2.5 px-3 text-center font-mono text-neutral-400">{row.timeSec}s</td>
                        <td className="py-2.5 px-2 text-center font-mono text-neutral-400">{row.mot}</td>
                        <td className="py-2.5 px-2 text-center font-mono text-neutral-400">{row.rtr}</td>
                        <td className="py-2.5 px-2 text-center font-mono text-neutral-400">{row.wp}</td>
                        <td className="py-2.5 px-2 text-center font-mono text-neutral-400">{row.dr}</td>
                        <td className="py-2.5 px-2 text-center font-mono text-neutral-400">{row.manual}</td>
                        <td className="py-2.5 px-3 text-center font-bold font-mono text-cyan-400">{row.points}</td>
                        <td className="py-2.5 px-3 text-center font-mono text-neutral-400">{row.quality}</td>
                        <td className="py-2.5 px-4 text-center font-black font-mono text-white">{row.score}</td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          ) : (
            /* TAB 3: HISTORY VIEW */
            <div className="space-y-4">
              {speechesLedger.length === 0 ? (
                <div className="py-16 text-center space-y-2">
                  <p className="text-sm font-semibold text-neutral-400">
                    Nothing has happened on the floor yet. Speeches appear here as they are given.
                  </p>
                </div>
              ) : (
                <div className="divide-y divide-white/5 rounded-2xl bg-[#0d1424] border border-white/10 overflow-hidden">
                  {speechesLedger.map((s) => (
                    <div key={s.id} className="p-4 flex items-center justify-between text-xs hover:bg-white/5 transition">
                      <div className="flex items-center gap-3">
                        <span className="w-2 h-2 rounded-full bg-cyan-400" />
                        <div>
                          <div className="font-bold text-white">{s.delegateName}</div>
                          <div className="text-[10px] text-neutral-400 font-mono">
                            {s.category === 'gsl_speech' ? 'General Speaker\'s List' : 'Caucus Speech'} &bull;{' '}
                            {s.secondsSpoken ? `${s.secondsSpoken}s spoken` : `${s.points} pts logged`}
                          </div>
                        </div>
                      </div>
                      <span className="font-mono text-neutral-400 text-[11px]">
                        {new Date(s.timestamp).toLocaleTimeString()}
                      </span>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default ScoreboardModal;
