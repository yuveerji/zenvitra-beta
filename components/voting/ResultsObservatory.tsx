'use client';

import React from 'react';
import { 
  BarChart3, 
  CheckCircle2, 
  AlertCircle, 
  ShieldCheck, 
  Scale, 
  Layers, 
  Clock, 
  Lock, 
  FileCheck 
} from 'lucide-react';
import { MultiversalElection } from '@/types/voting';

export interface ResultsObservatoryProps {
  election: MultiversalElection;
  onRunTally?: () => void;
  isOfficer?: boolean;
}

export function ResultsObservatory({
  election,
  onRunTally,
  isOfficer = false,
}: ResultsObservatoryProps) {
  const isHybrid = election.mode === 'MODE_E_HYBRID_CHAMBER';
  const isRanked = election.mode === 'MODE_D_RANKED_CHOICE';
  const turnoutPercent = election.eligibleVoterCount > 0 
    ? Math.round((election.votesCastCount / election.eligibleVoterCount) * 1000) / 10 
    : 0;

  return (
    <div className="space-y-6 font-sans max-w-4xl mx-auto w-full">
      {/* Top Observatory Card */}
      <div className="p-6 sm:p-8 rounded-3xl bg-[#080d18] border border-cyan-500/30 shadow-[0_0_50px_rgba(6,182,212,0.12)] space-y-6">
        {/* Header */}
        <div className="flex flex-wrap items-center justify-between gap-3 border-b border-white/10 pb-4">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <span className="text-[10px] font-mono px-2.5 py-0.5 rounded-full bg-cyan-950 border border-cyan-500/40 text-cyan-300 font-bold uppercase">
                {election.state}
              </span>
              <span className="text-xs font-mono text-neutral-400">
                {election.electionCode}
              </span>
            </div>
            <h2 className="text-lg sm:text-xl font-bold text-white font-display">
              {election.title}
            </h2>
          </div>

          {/* Quorum Badge */}
          <div className="p-2.5 rounded-2xl bg-black/50 border border-white/10 font-mono text-right text-xs">
            <span className="text-[10px] text-neutral-400 block uppercase">Turnout / Quorum</span>
            <div className="flex items-center gap-1.5 font-bold">
              <span className={election.isQuorumMet ? 'text-emerald-400' : 'text-amber-400'}>
                {turnoutPercent}%
              </span>
              <span className="text-neutral-500">/ req {election.quorumNeededPercent}%</span>
            </div>
          </div>
        </div>

        {/* Outcome Banner (if certified) */}
        {election.isCertified && (
          <div className={`p-4 rounded-2xl border font-mono text-xs space-y-1.5 ${
            election.outcomeStatus === 'PASSED'
              ? 'bg-emerald-950/30 border-emerald-500/40 text-emerald-300'
              : 'bg-rose-950/30 border-rose-500/40 text-rose-300'
          }`}>
            <div className="flex items-center justify-between font-bold text-sm">
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4" />
                <span>OFFICIALLY CERTIFIED: {election.outcomeStatus}</span>
              </div>
              <span className="text-[10px] text-neutral-400">
                Hash: {election.certificationSignoffHash?.slice(0, 16)}...
              </span>
            </div>
            <p className="text-[11px] text-neutral-300 leading-relaxed font-sans">
              {election.outcomeSummary}
            </p>
          </div>
        )}

        {/* HYBRID MANDATE BREAKDOWN (If Mode E) */}
        {isHybrid && election.hybridRule && (
          <div className="p-5 rounded-2xl bg-black/60 border border-amber-500/30 space-y-4 font-mono">
            <div className="flex items-center justify-between border-b border-white/10 pb-2">
              <span className="text-xs text-amber-300 font-bold uppercase flex items-center gap-1.5">
                <Scale className="w-4 h-4" />
                <span>Dual-Chamber Mandate Audit</span>
              </span>
              <span className="text-[10px] text-neutral-400">Rule: Double-Majority Required</span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {/* Chamber 1: Popular Mandate */}
              <div className="p-4 rounded-xl bg-neutral-950/80 border border-white/10 space-y-2">
                <span className="text-[10px] text-neutral-400 uppercase font-bold block">
                  Chamber 1: Individual Mandate
                </span>
                <div className="flex items-baseline justify-between">
                  <span className="text-2xl font-black text-white font-display">
                    {election.individualMandateResult?.percentYes || 0}%
                  </span>
                  <span className="text-xs text-neutral-400">
                    req {election.hybridRule.individualPopularThresholdPercent}% Yes
                  </span>
                </div>
                <div className="w-full bg-white/10 h-1.5 rounded-full overflow-hidden">
                  <div
                    className="bg-cyan-400 h-full rounded-full"
                    style={{ width: `${Math.min(100, election.individualMandateResult?.percentYes || 0)}%` }}
                  />
                </div>
                <div className="flex items-center gap-1.5 text-[10px]">
                  {election.individualMandateResult?.isSatisfied ? (
                    <span className="text-emerald-400 font-bold">✓ Popular Threshold Satisfied</span>
                  ) : (
                    <span className="text-rose-400 font-bold">✗ Below 60% Threshold</span>
                  )}
                </div>
              </div>

              {/* Chamber 2: Universe Council Mandate */}
              <div className="p-4 rounded-xl bg-neutral-950/80 border border-white/10 space-y-2">
                <span className="text-[10px] text-neutral-400 uppercase font-bold block">
                  Chamber 2: Universe Council Mandate
                </span>
                <div className="flex items-baseline justify-between">
                  <span className="text-2xl font-black text-white font-display">
                    {election.universeCouncilMandateResult?.yesUniverses || 0} / {election.hybridRule.universeCouncilThresholdDenominator}
                  </span>
                  <span className="text-xs text-neutral-400">
                    req {election.hybridRule.universeCouncilThresholdNumerator} Universes
                  </span>
                </div>
                <div className="w-full bg-white/10 h-1.5 rounded-full overflow-hidden">
                  <div
                    className="bg-amber-400 h-full rounded-full"
                    style={{
                      width: `${((election.universeCouncilMandateResult?.yesUniverses || 0) / election.hybridRule.universeCouncilThresholdDenominator) * 100}%`
                    }}
                  />
                </div>
                <div className="flex items-center gap-1.5 text-[10px]">
                  {election.universeCouncilMandateResult?.isSatisfied ? (
                    <span className="text-emerald-400 font-bold">✓ Council Threshold Satisfied</span>
                  ) : (
                    <span className="text-rose-400 font-bold">✗ Below Council Threshold</span>
                  )}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* STANDARD BALLOT OPTIONS RESULTS TALLY */}
        <div className="space-y-3">
          <h4 className="text-xs font-mono uppercase text-neutral-400 font-bold">
            Certified Vote Tallies per Option
          </h4>

          <div className="space-y-3">
            {election.options.map((opt) => {
              const pct = opt.percentage || 0;

              return (
                <div
                  key={opt.id}
                  className="p-4 rounded-2xl bg-black/40 border border-white/10 space-y-2 font-mono"
                >
                  <div className="flex items-center justify-between text-xs">
                    <span className="font-bold text-white font-sans">{opt.title}</span>
                    <span className="text-cyan-400 font-bold">
                      {opt.votesCount?.toLocaleString() || 0} votes ({pct}%)
                    </span>
                  </div>

                  {/* Progress Bar */}
                  <div className="w-full bg-white/10 h-2 rounded-full overflow-hidden">
                    <div
                      className="bg-gradient-to-r from-cyan-400 to-blue-500 h-full rounded-full transition-all duration-500"
                      style={{ width: `${Math.min(100, pct)}%` }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* RANKED CHOICE TRANSFER ROUNDS (If Mode D) */}
        {isRanked && election.transferRoundsSummary && election.transferRoundsSummary.length > 0 && (
          <div className="p-4 rounded-2xl bg-black/50 border border-purple-500/30 space-y-2 font-mono text-xs">
            <span className="text-[10px] text-purple-300 uppercase font-bold block">
              Instant-Runoff Elimination Rounds
            </span>
            <div className="space-y-1 text-[11px] text-neutral-300">
              {election.transferRoundsSummary.map((round, idx) => (
                <div key={idx} className="p-2 rounded bg-neutral-950 border border-white/5">
                  {round}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Officer Action Bar (Run / Recount Tally) */}
        {isOfficer && !election.isCertified && onRunTally && (
          <div className="pt-4 border-t border-white/10 flex justify-end">
            <button
              onClick={onRunTally}
              className="px-6 py-2.5 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-black font-bold text-xs font-mono transition cursor-pointer shadow-lg active:scale-95 flex items-center gap-2"
            >
              <FileCheck className="w-4 h-4" />
              <span>Execute Official Tally &amp; Certify Outcome</span>
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
