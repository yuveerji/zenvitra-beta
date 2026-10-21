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
    <div className="fixed inset-0 z-100 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 animate-fade-in select-none">
      <div className="w-full max-w-4xl bg-[#FAF9F5] rounded-3xl border border-[#D6D1C4] shadow-2xl overflow-hidden flex flex-col max-h-[92vh]">
        
        {/* ── 1. HEADER (Dark Forest Green with Download record Pill) ── */}
        <div className="px-6 py-4 bg-[#243928] text-white flex items-center justify-between border-b border-[#1c2e20]">
          <div className="flex items-center gap-2.5">
            <span className="w-1.5 h-5 bg-[#E4DB98] rounded-full" />
            <h2 className="text-base font-black tracking-tight text-white uppercase">
              Scoreboard
            </h2>
          </div>

          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={exportCsvScores}
              className="px-4 py-1.5 rounded-full bg-[#E4DB98] hover:bg-[#d8cf89] text-[#243928] font-bold text-xs flex items-center gap-1.5 transition shadow-sm cursor-pointer"
            >
              <FileText className="w-3.5 h-3.5" />
              <span>Download record</span>
            </button>
            <button
              type="button"
              onClick={() => {
                setShowScoreboardModal(false);
                setDrillInDelegate(null);
              }}
              className="text-white/70 hover:text-white p-1 rounded-full cursor-pointer transition"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* ── 2. SUB-BADGES & VIEW SWITCHER (Matching Gavelling.com) ── */}
        <div className="px-6 py-4 bg-[#F2EFE9] border-b border-[#D6D1C4] space-y-4">
          
          {/* Top Stat Pills Row */}
          <div className="flex flex-wrap items-center gap-3">
            <div className="px-4 py-2 rounded-2xl bg-white border border-[#DCD9CE] shadow-2xs flex items-center gap-2 text-xs font-black text-[#1A1D1A]">
              <Users className="w-4 h-4 text-[#7A7870]" />
              <span>{totalDelegations} DELEGATIONS</span>
            </div>

            <div className="px-4 py-2 rounded-2xl bg-white border border-[#DCD9CE] shadow-2xs flex items-center gap-2 text-xs font-black text-[#1A1D1A]">
              <Mic className="w-4 h-4 text-[#7A7870]" />
              <span>{totalSpeeches} SPEECHES</span>
            </div>

            <div className="px-4 py-2 rounded-2xl bg-white border border-[#DCD9CE] shadow-2xs flex items-center gap-2 text-xs font-black text-[#1A1D1A]">
              <Clock className="w-4 h-4 text-[#7A7870]" />
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
                  className={`px-4 py-2 rounded-xl text-xs font-extrabold tracking-wide transition cursor-pointer flex items-center gap-1.5 ${
                    isActive
                      ? 'bg-[#243928] text-white shadow-sm'
                      : 'bg-white hover:bg-[#FAF9F5] text-[#555] border border-[#DCD9CE]'
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
              <div className="flex items-center justify-between border-b pb-4">
                <button
                  type="button"
                  onClick={() => setDrillInDelegate(null)}
                  className="text-xs font-bold text-[#243928] hover:underline flex items-center gap-1 cursor-pointer"
                >
                  <ArrowLeft className="w-3.5 h-3.5" />
                  <span>Back to {activeTab}</span>
                </button>

                <div className="flex items-center gap-3">
                  <img
                    src={`https://flagcdn.com/w80/${drillInDelegate.countryCode.toLowerCase()}.png`}
                    alt=""
                    className="w-7 h-7 rounded-full object-cover border"
                  />
                  <span className="text-base font-black text-[#1A1D1A]">{drillInDelegate.name}</span>
                </div>
              </div>

              {/* Manual Point Award / Deduct Bar */}
              <div className="p-4 rounded-2xl bg-white border border-[#D6D1C4] space-y-3">
                <div className="text-xs font-black uppercase text-[#243928]">Award or Deduct Points</div>
                <div className="flex items-center gap-2 flex-wrap">
                  <input
                    type="number"
                    min={1}
                    max={100}
                    value={manualAmount}
                    onChange={(e) => setManualAmount(parseInt(e.target.value) || 5)}
                    className="w-20 px-3 py-1.5 rounded-xl bg-[#FAF9F5] border border-[#D6D1C4] text-xs font-mono font-bold"
                  />
                  <input
                    type="text"
                    placeholder="Reason (e.g. exemplary framing, POO violation)..."
                    value={manualReason}
                    onChange={(e) => setManualReason(e.target.value)}
                    className="flex-1 min-w-[200px] px-3 py-1.5 rounded-xl bg-[#FAF9F5] border border-[#D6D1C4] text-xs font-medium"
                  />
                  <button
                    type="button"
                    onClick={() => handleApplyManual(false)}
                    className="px-4 py-1.5 rounded-xl bg-emerald-700 hover:bg-emerald-800 text-white font-bold text-xs flex items-center gap-1 cursor-pointer shadow-2xs"
                  >
                    <Plus className="w-3.5 h-3.5" />
                    <span>Award</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => handleApplyManual(true)}
                    className="px-4 py-1.5 rounded-xl bg-rose-700 hover:bg-rose-800 text-white font-bold text-xs flex items-center gap-1 cursor-pointer shadow-2xs"
                  >
                    <Minus className="w-3.5 h-3.5" />
                    <span>Deduct</span>
                  </button>
                </div>
              </div>

              {/* Point Ledger Timeline */}
              <div className="space-y-2">
                <div className="text-xs font-black uppercase text-[#7A7870]">Activity Ledger</div>
                {drillInEntries.length === 0 ? (
                  <div className="p-6 rounded-2xl bg-white border border-[#D6D1C4] text-center text-xs text-[#7A7870]">
                    No activity recorded for this delegation yet.
                  </div>
                ) : (
                  <div className="divide-y divide-[#EFECE4] rounded-2xl bg-white border border-[#D6D1C4] overflow-hidden">
                    {drillInEntries.map((e) => (
                      <div key={e.id} className="p-3.5 flex items-center justify-between text-xs">
                        <div>
                          <div className="font-bold text-[#1A1D1A]">{e.reason}</div>
                          <div className="text-[10px] text-[#7A7870] font-mono">
                            {new Date(e.timestamp).toLocaleTimeString()}
                          </div>
                        </div>
                        <span
                          className={`font-mono font-black ${
                            e.points >= 0 ? 'text-emerald-700' : 'text-rose-700'
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
            /* TAB 1: RANKING VIEW (Matches Screenshot 2026-10-18 030354.png) */
            <div className="overflow-x-auto rounded-2xl border border-[#D6D1C4] bg-white">
              <table className="w-full text-left text-xs">
                <thead className="bg-[#F2EFE9] text-[#7A7870] font-bold uppercase tracking-wider text-[10px] border-b border-[#D6D1C4]">
                  <tr>
                    <th className="py-3 px-4 w-12 text-center">#</th>
                    <th className="py-3 px-4">DELEGATION</th>
                    <th className="py-3 px-4 text-center">SPEECHES</th>
                    <th className="py-3 px-4 text-center">TIME</th>
                    <th className="py-3 px-4 text-right">SCORE</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#EFECE4]">
                  {scoreboardRanking.map((item, idx) => {
                    const rowStats = getMatrixRow(item.delegate);
                    const isAbsent = item.delegate.attendance === 'absent';

                    return (
                      <tr
                        key={item.delegate.id}
                        onClick={() => setDrillInDelegate(item.delegate)}
                        className="hover:bg-[#FAF9F5] transition cursor-pointer group"
                      >
                        <td className="py-3 px-4 text-center font-mono font-bold text-[#7A7870]">
                          {idx + 1}
                        </td>
                        <td className="py-3 px-4">
                          <div className="flex items-center gap-3">
                            <img
                              src={`https://flagcdn.com/w80/${item.delegate.countryCode.toLowerCase()}.png`}
                              alt=""
                              className="w-5 h-5 rounded-full object-cover border border-black/10 shrink-0"
                              onError={(e) => {
                                (e.target as HTMLElement).style.display = 'none';
                              }}
                            />
                            <span className="font-bold text-[#1A1D1A]">{item.delegate.name}</span>
                            <span
                              className={`text-[10px] font-mono px-2 py-0.5 rounded-full ${
                                isAbsent ? 'bg-rose-100 text-rose-800' : 'bg-emerald-100 text-emerald-800'
                              }`}
                            >
                              {isAbsent ? 'Absent' : 'Present'}
                            </span>
                          </div>
                        </td>
                        <td className="py-3 px-4 text-center font-bold text-[#1A1D1A]">
                          {rowStats.gsl + rowStats.cauc}
                        </td>
                        <td className="py-3 px-4 text-center font-mono text-[#7A7870]">
                          {rowStats.timeSec}s
                        </td>
                        <td className="py-3 px-4 text-right">
                          <div className="inline-flex items-center gap-1 font-black text-sm text-[#243928]">
                            <span>{item.blendedScore} pts</span>
                            <ChevronRight className="w-3.5 h-3.5 text-[#7A7870] group-hover:translate-x-0.5 transition" />
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          ) : activeTab === 'matrix' ? (
            /* TAB 2: MATRIX VIEW (Matches Screenshot 2026-10-18 030405.png) */
            <div className="overflow-x-auto rounded-2xl border border-[#D6D1C4] bg-white">
              <table className="w-full text-left text-xs whitespace-nowrap">
                <thead className="bg-[#F2EFE9] text-[#7A7870] font-bold uppercase tracking-wider text-[10px] border-b border-[#D6D1C4]">
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
                <tbody className="divide-y divide-[#EFECE4]">
                  {session.roster.map((del) => {
                    const row = getMatrixRow(del);

                    return (
                      <tr
                        key={del.id}
                        onClick={() => setDrillInDelegate(del)}
                        className="hover:bg-[#FAF9F5] transition cursor-pointer"
                      >
                        <td className="py-2.5 px-4">
                          <div className="flex items-center gap-2">
                            <img
                              src={`https://flagcdn.com/w80/${del.countryCode.toLowerCase()}.png`}
                              alt=""
                              className="w-4 h-4 rounded-full object-cover shrink-0"
                            />
                            <span className="font-bold text-[#1A1D1A] truncate max-w-[140px]">{del.name}</span>
                          </div>
                        </td>
                        <td className="py-2.5 px-2 text-center font-mono text-[#7A7870]">{row.gsl}</td>
                        <td className="py-2.5 px-2 text-center font-mono text-[#7A7870]">{row.cauc}</td>
                        <td className="py-2.5 px-3 text-center font-mono text-[#7A7870]">{row.timeSec}s</td>
                        <td className="py-2.5 px-2 text-center font-mono text-[#7A7870]">{row.mot}</td>
                        <td className="py-2.5 px-2 text-center font-mono text-[#7A7870]">{row.rtr}</td>
                        <td className="py-2.5 px-2 text-center font-mono text-[#7A7870]">{row.wp}</td>
                        <td className="py-2.5 px-2 text-center font-mono text-[#7A7870]">{row.dr}</td>
                        <td className="py-2.5 px-2 text-center font-mono text-[#7A7870]">{row.manual}</td>
                        <td className="py-2.5 px-3 text-center font-bold font-mono text-[#243928]">{row.points}</td>
                        <td className="py-2.5 px-3 text-center font-mono text-[#7A7870]">{row.quality}</td>
                        <td className="py-2.5 px-4 text-center font-black font-mono text-[#1A1D1A]">{row.score}</td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          ) : (
            /* TAB 3: HISTORY VIEW (Matches Screenshot 2026-10-18 030415.png) */
            <div className="space-y-4">
              {speechesLedger.length === 0 ? (
                <div className="py-16 text-center space-y-2">
                  <p className="text-sm font-semibold text-[#7A7870]">
                    Nothing has happened on the floor yet. Speeches appear here as they are given.
                  </p>
                </div>
              ) : (
                <div className="divide-y divide-[#EFECE4] rounded-2xl bg-white border border-[#D6D1C4] overflow-hidden">
                  {speechesLedger.map((s) => (
                    <div key={s.id} className="p-4 flex items-center justify-between text-xs hover:bg-[#FAF9F5]">
                      <div className="flex items-center gap-3">
                        <span className="w-2 h-2 rounded-full bg-[#243928]" />
                        <div>
                          <div className="font-bold text-[#1A1D1A]">{s.delegateName}</div>
                          <div className="text-[10px] text-[#7A7870] font-mono">
                            {s.category === 'gsl_speech' ? 'General Speaker\'s List' : 'Caucus Speech'} &bull;{' '}
                            {s.secondsSpoken ? `${s.secondsSpoken}s spoken` : `${s.points} pts logged`}
                          </div>
                        </div>
                      </div>
                      <span className="font-mono text-[#7A7870] text-[11px]">
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
