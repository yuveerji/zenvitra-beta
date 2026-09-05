'use client';

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Vote,
  Sparkles,
  CheckCircle2,
  XCircle,
  AlertTriangle,
  Clock,
  Users,
  ShieldCheck,
  Award,
  Zap,
  Mic,
  Star,
  ChevronRight,
  Plus,
  Play,
  RotateCcw,
  Share2,
  Check,
  Flame,
  Globe2,
  FileText,
  HelpCircle
} from 'lucide-react';
import { useMun } from '@/context/MunContext';
import { ChamberVotingSession, ChamberVoteOption } from '@/types/mun';

export function LiveVotingCenter({ onOpenNewVoteModal }: { onOpenNewVoteModal: () => void }) {
  const {
    activeVotingSession,
    votingSessions,
    castChamberVote,
    castRollCallVote,
    ratePerformer,
    closeVotingSession,
    userInvites,
    activeCommitteeId
  } = useMun();

  const [copied, setCopied] = useState(false);
  const [selectedScore, setSelectedScore] = useState<number>(8);
  const [scoreFeedback, setScoreFeedback] = useState<string>('');
  const [timerSeconds, setTimerSeconds] = useState(activeVotingSession?.remainingSeconds || 60);

  const userAcceptedInvite = userInvites.find(
    (i) => i.committeeId === activeCommitteeId && i.status === 'accepted'
  );

  const myCountry = userAcceptedInvite?.portfolio || 'Delegation of France';
  const myFlag = userAcceptedInvite?.flagEmoji || '🇫🇷';

  // Live Timer Countdown for active session
  useEffect(() => {
    if (!activeVotingSession || activeVotingSession.status !== 'active') return;

    setTimerSeconds(activeVotingSession.remainingSeconds);
    const interval = setInterval(() => {
      setTimerSeconds((prev) => {
        if (prev <= 1) {
          clearInterval(interval);
          closeVotingSession(activeVotingSession.id);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [activeVotingSession?.id, activeVotingSession?.status, closeVotingSession]);

  const handleShareResults = (session: ChamberVotingSession) => {
    if (typeof navigator !== 'undefined') {
      const summary = `🗳️ Zenvitra Chamber Vote Result: [${session.title}]\nStatus: ${session.passed ? 'PASSED ✅' : 'FAILED ❌'}\nTotal Ballots: ${session.totalBallots}\nSummary: ${session.resultSummary || 'Recorded on Global Youth Grid'}`;
      navigator.clipboard.writeText(summary);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  return (
    <div className="w-full space-y-6">
      
      {/* ─────────────────────────────────────────────────────────────
          1. ACTIVE LIVE VOTING FLOOR CARD
      ───────────────────────────────────────────────────────────── */}
      {activeVotingSession && activeVotingSession.status === 'active' ? (
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          className="p-6 sm:p-8 rounded-3xl bg-gradient-to-b from-[#11131c] to-[#07080b] border-2 border-amber-500/40 shadow-[0_0_50px_rgba(245,158,11,0.15)] relative overflow-hidden"
        >
          {/* Glowing Ambient Top Bar */}
          <div className="absolute top-0 left-0 right-0 h-1.5 bg-gradient-to-r from-amber-400 via-rose-500 to-purple-600 animate-pulse" />

          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 pb-6 border-b border-white/10">
            <div className="space-y-2">
              <div className="flex items-center gap-2.5">
                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-rose-500/20 border border-rose-500/40 text-rose-300 font-mono text-xs font-bold animate-pulse">
                  <span className="w-2 h-2 rounded-full bg-rose-400" />
                  LIVE BALLOT IN PROGRESS
                </span>
                <span className="text-xs font-mono text-neutral-400 uppercase">
                  {activeVotingSession.category.replace(/_/g, ' ')}
                </span>
              </div>

              <h2 className="font-display font-bold text-xl sm:text-2xl text-white tracking-tight">
                {activeVotingSession.title}
              </h2>

              {activeVotingSession.description && (
                <p className="text-xs text-neutral-300 font-mono max-w-2xl">
                  {activeVotingSession.description}
                </p>
              )}
            </div>

            {/* Countdown Clock & Dais Controls */}
            <div className="flex items-center gap-4 shrink-0">
              <div className="p-3.5 px-5 rounded-2xl bg-black/60 border border-amber-500/30 text-center space-y-0.5">
                <span className="text-[10px] font-mono text-amber-400/80 uppercase tracking-widest font-bold block">
                  CLOSES IN
                </span>
                <span className="font-mono font-bold text-2xl sm:text-3xl text-amber-300">
                  {timerSeconds}s
                </span>
              </div>

              <button
                type="button"
                onClick={() => closeVotingSession(activeVotingSession.id)}
                className="px-4 py-3 rounded-2xl bg-white/10 hover:bg-rose-500/20 text-neutral-300 hover:text-rose-300 border border-white/10 hover:border-rose-500/30 font-display font-bold text-xs transition cursor-pointer"
              >
                Close Floor
              </button>
            </div>
          </div>

          {/* ── 2. BALLOT CASTING STATION ── */}
          <div className="py-6 space-y-6">
            
            {/* Format A: Roll Call Voting for Resolutions */}
            {activeVotingSession.category === 'mun_resolution_rollcall' && (
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2 text-xs font-mono font-bold text-neutral-300 uppercase">
                    <Globe2 className="w-4 h-4 text-cyan-400" />
                    <span>Cast Country Roll Call Ballot: {myFlag} {myCountry}</span>
                  </div>
                  <span className="text-[11px] font-mono text-neutral-400">
                    Total Cast: <strong>{activeVotingSession.totalBallots}</strong>
                  </span>
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                  {[
                    { vote: 'yes' as const, label: '🟢 IN FAVOR (YES)', bg: 'hover:bg-emerald-500/20 hover:border-emerald-400 text-emerald-300 border-emerald-500/30' },
                    { vote: 'no' as const, label: '🔴 AGAINST (NO / VETO)', bg: 'hover:bg-rose-500/20 hover:border-rose-400 text-rose-300 border-rose-500/30' },
                    { vote: 'abstain' as const, label: '⚪ ABSTAIN', bg: 'hover:bg-neutral-500/20 hover:border-neutral-400 text-neutral-300 border-white/15' },
                    { vote: 'pass' as const, label: '🟡 PASS (CALL AGAIN)', bg: 'hover:bg-amber-500/20 hover:border-amber-400 text-amber-300 border-amber-500/30' },
                  ].map((btn) => (
                    <button
                      key={btn.vote}
                      type="button"
                      onClick={() => castRollCallVote(activeVotingSession.id, btn.vote, myCountry)}
                      className={`p-4 rounded-2xl bg-black/50 border font-display font-bold text-xs tracking-wide transition-all duration-200 cursor-pointer shadow-md hover:scale-102 flex flex-col items-center justify-center gap-1.5 ${btn.bg}`}
                    >
                      <span>{btn.label}</span>
                      <span className="text-[10px] font-mono opacity-60">Record Official Vote</span>
                    </button>
                  ))}
                </div>

                {/* Veto Alert Notice */}
                {activeVotingSession.vetoTriggered && (
                  <div className="p-3.5 rounded-2xl bg-rose-500/15 border border-rose-500/40 text-rose-200 text-xs font-mono flex items-center gap-2.5">
                    <AlertTriangle className="w-4 h-4 text-rose-400 shrink-0" />
                    <span><strong>P5 VETO TRIGGERED:</strong> One or more permanent members have voted Against. Under UN Charter rules, resolution fails.</span>
                  </div>
                )}
              </div>
            )}

            {/* Format B: Performer / Pitch Star Rating Scorecard */}
            {activeVotingSession.category === 'performer_rating' && (
              <div className="space-y-4 p-5 rounded-2xl bg-black/60 border border-white/10">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2 text-xs font-mono font-bold text-amber-300 uppercase">
                    <Mic className="w-4 h-4 text-amber-400" />
                    <span>Live Performer Scorecard: 1 to 10 Scale</span>
                  </div>
                  <span className="text-xs font-mono text-neutral-400">
                    Your Rating: <strong className="text-white text-sm">{selectedScore}/10</strong>
                  </span>
                </div>

                {/* Star / Score Chips */}
                <div className="flex items-center justify-between gap-1.5 overflow-x-auto py-2">
                  {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((score) => (
                    <button
                      key={score}
                      type="button"
                      onClick={() => setSelectedScore(score)}
                      className={`w-10 h-10 rounded-xl font-mono font-bold text-xs flex items-center justify-center transition cursor-pointer border ${
                        selectedScore === score
                          ? 'bg-amber-400 text-black border-amber-300 shadow-[0_0_15px_rgba(245,158,11,0.5)] scale-110'
                          : 'bg-white/5 text-neutral-400 hover:text-white border-white/10 hover:border-white/20'
                      }`}
                    >
                      {score}
                    </button>
                  ))}
                </div>

                <div className="flex items-center gap-2 pt-2">
                  <input
                    type="text"
                    value={scoreFeedback}
                    onChange={(e) => setScoreFeedback(e.target.value)}
                    placeholder="Short feedback (e.g. 'Electrifying rhythm & cadence!')"
                    className="flex-1 bg-neutral-900 border border-white/10 rounded-xl px-3.5 py-2 text-xs text-white placeholder-neutral-500 focus:outline-none focus:border-amber-400"
                  />
                  <button
                    type="button"
                    onClick={() => {
                      ratePerformer(activeVotingSession.id, selectedScore, scoreFeedback);
                      setScoreFeedback('');
                    }}
                    className="px-5 py-2 rounded-xl bg-amber-400 hover:bg-amber-300 text-black font-display font-bold text-xs transition cursor-pointer"
                  >
                    Submit Score
                  </button>
                </div>
              </div>
            )}

            {/* Format C: General Multi-Choice Options */}
            {activeVotingSession.category !== 'mun_resolution_rollcall' && activeVotingSession.category !== 'performer_rating' && (
              <div className="space-y-3">
                <div className="flex items-center justify-between text-xs font-mono font-bold text-neutral-300 uppercase">
                  <span>Select Ballot Option</span>
                  <span>Total Votes: <strong>{activeVotingSession.totalBallots}</strong></span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                  {activeVotingSession.options.map((opt) => {
                    const percentage = activeVotingSession.totalBallots > 0
                      ? Math.round((opt.votes / activeVotingSession.totalBallots) * 100)
                      : 0;

                    return (
                      <button
                        key={opt.id}
                        type="button"
                        onClick={() => castChamberVote(activeVotingSession.id, opt.id)}
                        className="p-4 rounded-2xl bg-black/60 border border-white/15 hover:border-amber-400 text-left transition-all duration-200 cursor-pointer shadow-md group relative overflow-hidden"
                      >
                        {/* Fill percentage background */}
                        <div
                          className="absolute inset-y-0 left-0 bg-amber-500/10 pointer-events-none transition-all duration-500"
                          style={{ width: `${percentage}%` }}
                        />

                        <div className="relative flex items-center justify-between gap-3">
                          <div>
                            <span className="font-bold text-sm text-white block group-hover:text-amber-300 transition">
                              {opt.label}
                            </span>
                            {opt.sublabel && (
                              <span className="text-[11px] font-mono text-neutral-400 block mt-0.5">
                                {opt.sublabel}
                              </span>
                            )}
                          </div>

                          <div className="text-right shrink-0">
                            <span className="font-mono font-bold text-base text-amber-300 block">
                              {percentage}%
                            </span>
                            <span className="text-[10px] font-mono text-neutral-500">
                              {opt.votes} votes
                            </span>
                          </div>
                        </div>
                      </button>
                    );
                  })}
                </div>
              </div>
            )}
          </div>

          {/* ── 3. REAL-TIME TALLY BREAKDOWN ── */}
          <div className="pt-5 border-t border-white/10 flex flex-wrap items-center justify-between gap-4 text-xs font-mono text-neutral-400">
            <div className="flex items-center gap-4">
              <span>Rule: <strong>{activeVotingSession.ruleMode.replace('_', ' ').toUpperCase()}</strong></span>
              <span>&bull;</span>
              <span>Quorum Met: <strong className="text-emerald-400">YES</strong></span>
            </div>

            {activeVotingSession.resultSummary && (
              <span className="text-amber-300 font-bold">
                {activeVotingSession.resultSummary}
              </span>
            )}
          </div>
        </motion.div>
      ) : (
        /* Empty State / Prompt to launch a vote */
        <div className="p-8 sm:p-12 rounded-3xl bg-[#07080b]/90 border border-white/15 text-center space-y-4 shadow-xl">
          <div className="w-16 h-16 rounded-3xl bg-amber-500/10 border border-amber-500/20 text-amber-400 mx-auto flex items-center justify-center">
            <Vote className="w-8 h-8" />
          </div>

          <div className="space-y-1 max-w-md mx-auto">
            <h3 className="font-display font-bold text-lg sm:text-xl text-white">
              No Active Live Vote on Floor
            </h3>
            <p className="text-xs sm:text-sm text-neutral-400">
              The Dais or Host can open a live voting session for MUN motions, resolution roll calls, open mic awards, or audience referendums.
            </p>
          </div>

          <button
            type="button"
            onClick={onOpenNewVoteModal}
            className="px-6 py-3 rounded-2xl bg-gradient-to-r from-amber-400 via-rose-500 to-purple-600 text-white font-display font-bold text-xs shadow-lg hover:scale-105 transition cursor-pointer inline-flex items-center gap-2"
          >
            <Plus className="w-4 h-4" />
            <span>+ OPEN NEW LIVE VOTE</span>
          </button>
        </div>
      )}

      {/* ─────────────────────────────────────────────────────────────
          2. CHAMBER VOTING HISTORY & PASSED RESOLUTIONS
      ───────────────────────────────────────────────────────────── */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2 text-sm font-display font-bold text-white uppercase tracking-wide">
            <CheckCircle2 className="w-4 h-4 text-emerald-400" />
            <span>Deliberation Ballots &amp; Voting History ({votingSessions.length})</span>
          </div>

          <button
            type="button"
            onClick={onOpenNewVoteModal}
            className="text-xs font-mono text-amber-400 hover:underline flex items-center gap-1 cursor-pointer"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>New Ballot</span>
          </button>
        </div>

        {votingSessions.length > 0 ? (
          <div className="space-y-3">
            {votingSessions.map((session) => (
              <div
                key={session.id}
                className="p-4 sm:p-5 rounded-2xl bg-white/[0.02] border border-white/10 hover:border-white/20 transition flex flex-col sm:flex-row sm:items-center justify-between gap-4"
              >
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className={`text-[10px] font-mono font-bold px-2 py-0.5 rounded-full border ${
                      session.passed
                        ? 'bg-emerald-500/15 text-emerald-300 border-emerald-500/30'
                        : 'bg-rose-500/15 text-rose-300 border-rose-500/30'
                    }`}>
                      {session.passed ? 'PASSED' : 'REJECTED / CONCLUDED'}
                    </span>
                    <span className="text-[11px] font-mono text-neutral-500">
                      {new Date(session.startedAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </span>
                  </div>

                  <h4 className="font-bold text-sm text-white">
                    {session.title}
                  </h4>

                  {session.resultSummary && (
                    <p className="text-xs font-mono text-neutral-300">
                      {session.resultSummary}
                    </p>
                  )}
                </div>

                <div className="flex items-center gap-3 self-end sm:self-center shrink-0">
                  <div className="text-right font-mono text-xs">
                    <span className="text-white font-bold block">{session.totalBallots} Ballots</span>
                    <span className="text-neutral-500 text-[10px] uppercase">{session.ruleMode.replace('_', ' ')}</span>
                  </div>

                  <button
                    type="button"
                    onClick={() => handleShareResults(session)}
                    className="p-2 rounded-xl bg-white/5 hover:bg-white/10 text-neutral-400 hover:text-white border border-white/10 transition cursor-pointer"
                    title="Copy Ballot Summary"
                  >
                    {copied ? <Check className="w-4 h-4 text-emerald-400" /> : <Share2 className="w-4 h-4" />}
                  </button>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="p-6 rounded-2xl bg-white/[0.01] border border-white/5 text-center text-xs font-mono text-neutral-500">
            No previous voting sessions recorded in this chamber yet.
          </div>
        )}
      </div>
    </div>
  );
}
