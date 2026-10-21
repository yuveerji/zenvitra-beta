'use client';

import React, { useState } from 'react';
import { 
  Vote, 
  ShieldCheck, 
  Lock, 
  CheckCircle2, 
  AlertCircle, 
  Sparkles, 
  Clock, 
  Users, 
  Building2, 
  FileText, 
  Scale, 
  Layers, 
  ChevronRight,
  ArrowRight,
  Check
} from 'lucide-react';
import { MultiversalElection, UserBallotReceipt } from '@/types/voting';

export interface BallotRoomProps {
  election: MultiversalElection;
  currentUserHandle?: string;
  onBallotSuccess?: (receipt: UserBallotReceipt) => void;
  onBack?: () => void;
}

export function BallotRoom({
  election,
  currentUserHandle = 'delegate.user',
  onBallotSuccess,
  onBack,
}: BallotRoomProps) {
  const [selectedOptionIds, setSelectedOptionIds] = useState<string[]>([]);
  const [rankedOrder, setRankedOrder] = useState<string[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submittedReceipt, setSubmittedReceipt] = useState<UserBallotReceipt | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const isRankedChoice = election.mode === 'MODE_D_RANKED_CHOICE';
  const isMultiSelect = election.mode === 'MODE_F_CONFIGURABLE_POLL' && (election.maxSelectionsAllowed || 1) > 1;

  const handleToggleOption = (optionId: string) => {
    if (isRankedChoice) {
      if (rankedOrder.includes(optionId)) {
        setRankedOrder(prev => prev.filter(id => id !== optionId));
      } else {
        setRankedOrder(prev => [...prev, optionId]);
      }
      return;
    }

    if (isMultiSelect) {
      if (selectedOptionIds.includes(optionId)) {
        setSelectedOptionIds(prev => prev.filter(id => id !== optionId));
      } else {
        if (selectedOptionIds.length < (election.maxSelectionsAllowed || 3)) {
          setSelectedOptionIds(prev => [...prev, optionId]);
        }
      }
    } else {
      setSelectedOptionIds([optionId]);
    }
  };

  const handleCastBallot = async () => {
    const finalSelections = isRankedChoice ? rankedOrder : selectedOptionIds;

    if (finalSelections.length === 0) {
      setErrorMessage('Please select at least one option to cast your official ballot.');
      return;
    }

    setIsSubmitting(true);
    setErrorMessage(null);

    try {
      const res = await fetch('/api/v1/vote/ballots', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          electionId: election.id,
          voterHandle: currentUserHandle,
          selectedOptionIds: finalSelections,
          idempotencyKey: `idemp_${election.id}_${currentUserHandle}_${Date.now()}`,
          isRepresentativeVote: election.mode === 'MODE_B_UNIVERSE',
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || 'Failed to submit ballot');
      }

      setSubmittedReceipt(data.receipt);
      onBallotSuccess?.(data.receipt);
    } catch (err: any) {
      setErrorMessage(err.message || 'An error occurred during ballot submission.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="max-w-3xl mx-auto w-full py-8 px-4 font-sans">
      {/* Back Button */}
      {onBack && !submittedReceipt && (
        <button
          onClick={onBack}
          className="mb-6 text-xs font-mono text-neutral-400 hover:text-white transition flex items-center gap-1.5 cursor-pointer"
        >
          <span>&larr; Back to Multiverse Governance Hub</span>
        </button>
      )}

      {/* CONFIRMED BALLOT RECEIPT VIEW */}
      {submittedReceipt ? (
        <div className="p-8 rounded-3xl bg-[#090d16] border border-emerald-500/40 shadow-[0_0_60px_rgba(16,185,129,0.15)] space-y-6 text-center animate-fade-in font-mono">
          <div className="w-16 h-16 rounded-3xl bg-emerald-500/20 border border-emerald-500/40 text-emerald-400 mx-auto flex items-center justify-center shadow-lg">
            <CheckCircle2 className="w-8 h-8" />
          </div>

          <div className="space-y-1.5">
            <h2 className="text-xl sm:text-2xl font-black text-white font-display">
              Ballot Authenticated &amp; Committed
            </h2>
            <p className="text-xs text-neutral-400 max-w-md mx-auto">
              Your vote has been cryptographically recorded into the ZENVITRA Multiversal Voting Engine.
            </p>
          </div>

          {/* Tamper-Proof Cryptographic Receipt Card */}
          <div className="p-5 rounded-2xl bg-black/60 border border-white/10 text-left space-y-3">
            <div className="flex items-center justify-between border-b border-white/10 pb-2 text-[10px] text-neutral-400 uppercase">
              <span>OFFICIAL BALLOT RECEIPT</span>
              <span className="text-emerald-400 font-bold">1 BALLOT = 1 MANDATE</span>
            </div>

            <div className="space-y-2 text-xs">
              <div className="flex justify-between">
                <span className="text-neutral-400">Receipt Serial:</span>
                <strong className="text-white font-mono">{submittedReceipt.receiptId}</strong>
              </div>
              <div className="flex justify-between">
                <span className="text-neutral-400">Election Code:</span>
                <strong className="text-cyan-300 font-mono">{submittedReceipt.electionCode}</strong>
              </div>
              <div className="flex justify-between">
                <span className="text-neutral-400">Voter Handle:</span>
                <strong className="text-white font-mono">@{submittedReceipt.voterHandle}</strong>
              </div>
              <div className="flex justify-between">
                <span className="text-neutral-400">Committed At:</span>
                <span className="text-neutral-300">{new Date(submittedReceipt.timestamp).toLocaleString()}</span>
              </div>
            </div>

            <div className="pt-2 border-t border-white/10">
              <span className="text-[10px] text-neutral-500 block mb-1">Cryptographic Proof Hash (SHA-256):</span>
              <div className="p-2 rounded-xl bg-neutral-950 border border-white/10 text-[10px] text-cyan-400/90 font-mono break-all select-all">
                {submittedReceipt.cryptographicReceiptHash}
              </div>
            </div>
          </div>

          {election.isSecretBallot && (
            <div className="flex items-center justify-center gap-2 text-xs text-neutral-400">
              <Lock className="w-3.5 h-3.5 text-cyan-400" />
              <span>Privacy Guaranteed: Your specific candidate selection is unlinked from this public receipt.</span>
            </div>
          )}

          <button
            onClick={onBack}
            className="w-full py-3.5 rounded-2xl bg-white hover:bg-neutral-200 text-black font-bold text-xs font-mono uppercase tracking-wider transition cursor-pointer shadow-lg active:scale-95"
          >
            Return to Active Observatory
          </button>
        </div>
      ) : (
        /* ACTIVE BALLOT SUBMISSION FORM */
        <div className="p-6 sm:p-10 rounded-3xl bg-[#080c14] border border-cyan-500/30 shadow-[0_0_60px_rgba(6,182,212,0.1)] space-y-6">
          {/* Header Bar */}
          <div className="flex flex-wrap items-center justify-between gap-3 border-b border-white/10 pb-5">
            <div className="flex items-center gap-2.5">
              <div className="p-2.5 rounded-2xl bg-cyan-500/10 border border-cyan-500/30 text-cyan-400">
                <Vote className="w-5 h-5" />
              </div>
              <div>
                <span className="text-[10px] font-mono uppercase tracking-wider text-cyan-400 font-bold block">
                  {election.governanceLevel.replace('_', ' ')} &bull; {election.electionCode}
                </span>
                <h1 className="text-lg sm:text-xl font-bold text-white font-display">
                  {election.title}
                </h1>
              </div>
            </div>

            {/* Voting Mode Badge */}
            <span className="text-[10px] font-mono px-3 py-1 rounded-full bg-cyan-950/80 border border-cyan-500/30 text-cyan-300 font-bold">
              {election.mode.replace('MODE_', '').replace(/_/g, ' ')}
            </span>
          </div>

          {/* Proposal Summary */}
          <div className="p-4 rounded-2xl bg-black/40 border border-white/10 space-y-2">
            <h4 className="text-xs font-mono uppercase text-neutral-400 font-bold">Proposal Summary &amp; Legal Context</h4>
            <p className="text-xs text-neutral-300 leading-relaxed">
              {election.summary}
            </p>
          </div>

          {/* Hybrid Chamber Mandate Notice (If Mode E) */}
          {election.hybridRule && (
            <div className="p-4 rounded-2xl bg-gradient-to-r from-amber-500/10 via-black/40 to-cyan-500/10 border border-amber-500/30 space-y-1.5 font-mono text-xs">
              <div className="flex items-center gap-2 text-amber-300 font-bold">
                <Scale className="w-4 h-4" />
                <span>Dual-Chamber Constitutional Mandate</span>
              </div>
              <p className="text-[11px] text-neutral-300 leading-relaxed">
                {election.hybridRule.ruleDescription}
              </p>
            </div>
          )}

          {/* Options Selection Area */}
          <div className="space-y-3 pt-2">
            <div className="flex items-center justify-between text-xs font-mono text-neutral-400">
              <span>{isRankedChoice ? 'Rank options by preference (tap to rank)' : 'Select your choice:'}</span>
              {election.isSecretBallot && (
                <span className="flex items-center gap-1 text-[11px] text-cyan-400">
                  <Lock className="w-3 h-3" /> Secret Ballot Active
                </span>
              )}
            </div>

            <div className="space-y-2.5">
              {election.options.map((opt) => {
                const isSelected = isRankedChoice 
                  ? rankedOrder.includes(opt.id) 
                  : selectedOptionIds.includes(opt.id);
                const rankIndex = rankedOrder.indexOf(opt.id);

                return (
                  <div
                    key={opt.id}
                    onClick={() => handleToggleOption(opt.id)}
                    className={`p-4 rounded-2xl border transition-all cursor-pointer flex items-center justify-between gap-4 select-none ${
                      isSelected
                        ? 'bg-cyan-950/30 border-cyan-400 shadow-[0_0_20px_rgba(6,182,212,0.2)]'
                        : 'bg-black/50 border-white/10 hover:border-white/20'
                    }`}
                  >
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <h4 className="text-sm font-bold text-white font-display">
                          {opt.title}
                        </h4>
                        {opt.universeAffiliation && (
                          <span className="text-[9px] font-mono px-2 py-0.5 rounded-full bg-white/10 text-neutral-300">
                            {opt.universeAffiliation}
                          </span>
                        )}
                      </div>
                      {opt.description && (
                        <p className="text-xs text-neutral-400 leading-relaxed max-w-xl">
                          {opt.description}
                        </p>
                      )}
                    </div>

                    {/* Indicator Pill */}
                    <div className="shrink-0">
                      {isRankedChoice ? (
                        <div className={`w-8 h-8 rounded-full border flex items-center justify-center font-mono font-bold text-xs transition ${
                          isSelected 
                            ? 'bg-cyan-400 text-black border-cyan-400 shadow-md' 
                            : 'border-white/20 text-neutral-500'
                        }`}>
                          {isSelected ? `#${rankIndex + 1}` : '—'}
                        </div>
                      ) : (
                        <div className={`w-6 h-6 rounded-full border flex items-center justify-center transition ${
                          isSelected 
                            ? 'bg-cyan-400 text-black border-cyan-400' 
                            : 'border-white/20'
                        }`}>
                          {isSelected && <Check className="w-3.5 h-3.5 stroke-[3]" />}
                        </div>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Error Message Alert */}
          {errorMessage && (
            <div className="p-3.5 rounded-2xl bg-rose-500/10 border border-rose-500/30 text-rose-300 text-xs font-mono flex items-center gap-2">
              <AlertCircle className="w-4 h-4 shrink-0 text-rose-400" />
              <span>{errorMessage}</span>
            </div>
          )}

          {/* Action Footer */}
          <div className="pt-4 border-t border-white/10 flex flex-col sm:flex-row items-center justify-between gap-4 font-mono">
            <div className="text-[11px] text-neutral-400 flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-emerald-400" />
              <span>Authenticated as: <strong className="text-white">@{currentUserHandle}</strong></span>
            </div>

            <button
              type="button"
              disabled={isSubmitting}
              onClick={handleCastBallot}
              className="w-full sm:w-auto px-8 py-3.5 rounded-2xl bg-gradient-to-r from-cyan-400 via-blue-500 to-cyan-500 hover:from-cyan-300 hover:to-blue-400 text-black font-bold text-xs uppercase tracking-wider transition cursor-pointer shadow-[0_0_25px_rgba(6,182,212,0.35)] active:scale-95 disabled:opacity-50"
            >
              {isSubmitting ? 'Encrypting & Committing...' : 'Cast Official Ballot'}
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
