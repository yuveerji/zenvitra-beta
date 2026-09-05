'use client';

import React, { useState } from 'react';
import { 
  CheckCircle2, 
  XCircle, 
  MinusCircle, 
  ShieldCheck, 
  ScrollText, 
  Award, 
  Users, 
  Sparkles,
  ChevronRight,
  Stamp,
  Lock,
  Radio
} from 'lucide-react';
import { PulsePost, TreatyCoSignature } from '@/types/pulse';
import { useZenPulse } from '@/context/ZenPulsePlatformContext';

interface RollCallRadarProps {
  post: PulsePost;
  onOpenRedlineStudio?: () => void;
}

export function RollCallRadar({ post, onOpenRedlineStudio }: RollCallRadarProps) {
  const { castRollCallVote, coSignTreaty, currentUserUsername, myProfile } = useZenPulse();
  const [showCoSignModal, setShowCoSignModal] = useState(false);
  const [selectedCaucus, setSelectedCaucus] = useState('General Plenary Delegate');

  if (!post.isTreaty) return null;

  const votes = post.rollCallVotes || { ayes: [], nays: [], abstains: [] };
  const ayesCount = votes.ayes.length;
  const naysCount = votes.nays.length;
  const abstainsCount = votes.abstains.length;
  const decisiveVotes = ayesCount + naysCount;
  
  const consensusPercentage = decisiveVotes > 0 ? (ayesCount / decisiveVotes) * 100 : 0;
  const isSupermajority = decisiveVotes >= 3 && consensusPercentage >= 66.7;
  const cleanCurrent = (currentUserUsername || 'you').toLowerCase().trim().replace(/^@/, '');

  const myVote = votes.ayes.includes(cleanCurrent) 
    ? 'aye' 
    : votes.nays.includes(cleanCurrent) 
    ? 'nay' 
    : votes.abstains.includes(cleanCurrent) 
    ? 'abstain' 
    : null;

  const hasCoSigned = (post.coSignatures || []).some(
    (s) => s.username.toLowerCase().trim().replace(/^@/, '') === cleanCurrent
  );

  const CAUCUS_OPTIONS = [
    'General Plenary Delegate',
    'G-77 & Non-Aligned Coalition',
    'Security Council Permanent Secretariat',
    'Youth Assembly Climate Caucus',
    'Human Rights & Civic Ethics Working Group',
    'Digital Sovereignty & AI Governance Bloc'
  ];

  return (
    <div className={`mt-4 p-4 sm:p-5 rounded-3xl transition-all duration-500 border ${
      isSupermajority 
        ? 'bg-gradient-to-br from-amber-950/40 via-neutral-950 to-emerald-950/30 border-amber-400/40 shadow-[0_0_35px_rgba(245,158,11,0.15)]' 
        : 'bg-white/[0.02] border-white/10 hover:border-white/20'
    }`}>
      {/* Header Banner */}
      <div className="flex flex-wrap items-center justify-between gap-3 pb-3.5 border-b border-white/[0.08]">
        <div className="flex items-center gap-2.5">
          <div className={`w-9 h-9 rounded-2xl flex items-center justify-center border ${
            isSupermajority 
              ? 'bg-amber-400/20 border-amber-400/60 text-amber-300 shadow-[0_0_15px_rgba(245,158,11,0.4)]' 
              : 'bg-cyan-500/10 border-cyan-500/30 text-cyan-400'
          }`}>
            {isSupermajority ? <Stamp className="w-5 h-5 animate-pulse" /> : <ScrollText className="w-5 h-5" />}
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="font-sans font-bold text-sm text-white tracking-tight">
                {post.treatyTitle || 'Sovereign Diplomatic Treaty'}
              </span>
              <span className="px-2 py-0.5 rounded-full text-[10px] font-mono font-bold bg-white/10 text-cyan-300 border border-white/10">
                {post.treatyVersion || 'v1.0'}
              </span>
            </div>
            <p className="text-[11px] text-zinc-400 font-medium">
              {post.caucusTag ? `Caucus: ${post.caucusTag}` : 'Plenary Treaty Matrix'} • Quorum Consensus Engine
            </p>
          </div>
        </div>

        {/* Status Badge */}
        <div className="flex items-center gap-2">
          {isSupermajority ? (
            <span className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-400/20 border border-amber-400/60 text-amber-300 font-mono text-xs font-bold shadow-[0_0_20px_rgba(245,158,11,0.3)]">
              <Sparkles className="w-3.5 h-3.5 text-amber-400" />
              RATIFIED SOVEREIGN TREATY
            </span>
          ) : (
            <span className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-cyan-500/10 border border-cyan-500/30 text-cyan-300 font-mono text-xs font-bold">
              <Radio className="w-3 h-3 animate-pulse text-cyan-400" />
              DEBATE IN PROGRESS
            </span>
          )}
        </div>
      </div>

      {/* 2/3rd Consensus Radar Progress Bar */}
      <div className="mt-4 space-y-2">
        <div className="flex items-center justify-between text-xs font-mono">
          <span className="text-neutral-400 flex items-center gap-1.5">
            <Users className="w-3.5 h-3.5 text-cyan-400" />
            Quorum Affirmative: 
            <strong className="text-white ml-1">{consensusPercentage.toFixed(1)}%</strong>
          </span>
          <span className={`font-bold ${consensusPercentage >= 66.7 ? 'text-amber-300' : 'text-neutral-500'}`}>
            Threshold: 66.7% Supermajority {consensusPercentage >= 66.7 ? '✓ PASSED' : `(${Math.max(0, 66.7 - consensusPercentage).toFixed(1)}% needed)`}
          </span>
        </div>

        {/* Progress Tracker */}
        <div className="relative h-3 w-full bg-white/[0.06] rounded-full overflow-hidden border border-white/10 p-[1px]">
          {/* 66.7% Target Marker Line */}
          <div 
            className="absolute top-0 bottom-0 w-[2px] bg-amber-400 z-10 shadow-[0_0_8px_rgba(245,158,11,1)]" 
            style={{ left: '66.7%' }} 
            title="2/3rd Supermajority Line"
          />
          <div 
            className={`h-full rounded-full transition-all duration-700 ${
              isSupermajority 
                ? 'bg-gradient-to-r from-amber-500 via-emerald-400 to-teal-300 shadow-[0_0_20px_rgba(52,211,153,0.6)]' 
                : 'bg-gradient-to-r from-cyan-500 to-emerald-400'
            }`}
            style={{ width: `${Math.min(100, consensusPercentage)}%` }}
          />
        </div>
      </div>

      {/* Three-State Roll Call Voting Actions */}
      <div className="mt-4 grid grid-cols-3 gap-2 sm:gap-3">
        {/* AYE */}
        <button
          type="button"
          onClick={() => castRollCallVote(post.id, 'aye')}
          className={`py-2.5 px-3 rounded-2xl border font-mono text-xs font-bold flex items-center justify-center gap-2 transition-all cursor-pointer ${
            myVote === 'aye'
              ? 'bg-emerald-500/25 border-emerald-400 text-emerald-300 shadow-[0_0_15px_rgba(16,185,129,0.3)] scale-[1.02]'
              : 'bg-white/[0.03] border-white/10 text-neutral-300 hover:bg-emerald-500/10 hover:border-emerald-500/40 hover:text-emerald-300'
          }`}
        >
          <CheckCircle2 className={`w-4 h-4 ${myVote === 'aye' ? 'text-emerald-400' : 'text-neutral-400'}`} />
          <span>Aye ({ayesCount})</span>
        </button>

        {/* NAY */}
        <button
          type="button"
          onClick={() => castRollCallVote(post.id, 'nay')}
          className={`py-2.5 px-3 rounded-2xl border font-mono text-xs font-bold flex items-center justify-center gap-2 transition-all cursor-pointer ${
            myVote === 'nay'
              ? 'bg-rose-500/25 border-rose-400 text-rose-300 shadow-[0_0_15px_rgba(244,63,94,0.3)] scale-[1.02]'
              : 'bg-white/[0.03] border-white/10 text-neutral-300 hover:bg-rose-500/10 hover:border-rose-500/40 hover:text-rose-300'
          }`}
        >
          <XCircle className={`w-4 h-4 ${myVote === 'nay' ? 'text-rose-400' : 'text-neutral-400'}`} />
          <span>Nay ({naysCount})</span>
        </button>

        {/* ABSTAIN WITH RIGHTS */}
        <button
          type="button"
          onClick={() => castRollCallVote(post.id, 'abstain')}
          className={`py-2.5 px-3 rounded-2xl border font-mono text-xs font-bold flex items-center justify-center gap-2 transition-all cursor-pointer ${
            myVote === 'abstain'
              ? 'bg-amber-500/25 border-amber-400 text-amber-300 shadow-[0_0_15px_rgba(245,158,11,0.3)] scale-[1.02]'
              : 'bg-white/[0.03] border-white/10 text-neutral-300 hover:bg-amber-500/10 hover:border-amber-500/40 hover:text-amber-300'
          }`}
        >
          <MinusCircle className={`w-4 h-4 ${myVote === 'abstain' ? 'text-amber-400' : 'text-neutral-400'}`} />
          <span>Abstain ({abstainsCount})</span>
        </button>
      </div>

      {/* Footer: Co-Signatures & Redline Studio Link */}
      <div className="mt-4 pt-3 border-t border-white/[0.06] flex flex-wrap items-center justify-between gap-2">
        <div className="flex items-center gap-2">
          <div className="flex -space-x-2 overflow-hidden">
            {(post.coSignatures || []).slice(0, 4).map((sig, idx) => (
              <div
                key={idx}
                className="inline-block h-6 w-6 rounded-full ring-2 ring-neutral-950 bg-gradient-to-tr from-cyan-500 to-indigo-600 text-white font-mono text-[9px] font-bold flex items-center justify-center uppercase shadow-sm"
                title={`${sig.name} (@${sig.username}) - ${sig.caucus}`}
              >
                {sig.name[0] || 'D'}
              </div>
            ))}
          </div>
          <span className="font-mono text-[11px] text-neutral-400">
            {(post.coSignatures || []).length} Co-Signatory Node{(post.coSignatures || []).length === 1 ? '' : 's'}
          </span>
        </div>

        <div className="flex items-center gap-2">
          {/* Co-Sign Button */}
          {!hasCoSigned ? (
            <button
              type="button"
              onClick={() => setShowCoSignModal(true)}
              className="px-3 py-1.5 rounded-xl bg-cyan-500/15 hover:bg-cyan-500/25 border border-cyan-500/40 text-cyan-300 font-mono text-xs font-bold flex items-center gap-1.5 transition cursor-pointer"
            >
              <Stamp className="w-3.5 h-3.5" />
              <span>Co-Sign Treaty</span>
            </button>
          ) : (
            <span className="px-3 py-1 rounded-xl bg-emerald-500/15 border border-emerald-500/30 text-emerald-300 font-mono text-xs font-bold flex items-center gap-1.5">
              <CheckCircle2 className="w-3.5 h-3.5" />
              <span>Signed</span>
            </span>
          )}

          {/* Redline Studio Trigger */}
          {onOpenRedlineStudio && (
            <button
              type="button"
              onClick={onOpenRedlineStudio}
              className="px-3 py-1.5 rounded-xl bg-white/[0.05] hover:bg-white/10 border border-white/10 text-white font-mono text-xs font-semibold flex items-center gap-1.5 transition cursor-pointer"
            >
              <span>Redline Diff Studio</span>
              <ChevronRight className="w-3.5 h-3.5 text-neutral-400" />
            </button>
          )}
        </div>
      </div>

      {/* Co-Signing Modal */}
      {showCoSignModal && (
        <div 
          className="fixed inset-0 z-[120] flex items-center justify-center p-4 bg-black/80 backdrop-blur-xl"
          onClick={() => setShowCoSignModal(false)}
        >
          <div 
            className="relative w-full max-w-md rounded-3xl bg-neutral-950 border border-cyan-500/30 p-6 space-y-5 shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-2xl bg-cyan-500/20 border border-cyan-500/40 flex items-center justify-center text-cyan-400">
                <Stamp className="w-5 h-5" />
              </div>
              <div>
                <h3 className="font-display font-bold text-base text-white">Immutable Co-Signature</h3>
                <p className="text-xs font-mono text-neutral-400">Diplomatic Treaty Ratification</p>
              </div>
            </div>

            <div className="p-3.5 rounded-2xl bg-white/[0.03] border border-white/10 space-y-2 text-xs">
              <p className="text-neutral-300">
                You are depositing your digital co-signature for <strong>{post.treatyTitle}</strong> ({post.treatyVersion || 'v1.0'}).
              </p>
              <p className="font-mono text-[11px] text-cyan-400">
                Node ID: @{currentUserUsername} • Clearance Level {myProfile.civicClearance?.level || 3} ({myProfile.civicClearance?.title || 'Delegate'})
              </p>
            </div>

            <div className="space-y-2">
              <label className="text-xs font-mono text-neutral-400 block">Select Caucus Alliance:</label>
              <select
                value={selectedCaucus}
                onChange={(e) => setSelectedCaucus(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl bg-neutral-900 border border-white/15 text-xs text-white focus:outline-none focus:border-cyan-400"
              >
                {CAUCUS_OPTIONS.map((c, i) => (
                  <option key={i} value={c} className="bg-neutral-950 text-white">{c}</option>
                ))}
              </select>
            </div>

            <div className="flex items-center gap-3 pt-2">
              <button
                type="button"
                onClick={() => setShowCoSignModal(false)}
                className="flex-1 py-2.5 rounded-xl bg-white/[0.04] border border-white/10 text-xs font-mono text-neutral-300 hover:bg-white/10 transition"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={() => {
                  coSignTreaty(post.id, selectedCaucus);
                  setShowCoSignModal(false);
                }}
                className="flex-1 py-2.5 rounded-xl bg-gradient-to-r from-cyan-500 to-indigo-600 hover:from-cyan-400 hover:to-indigo-500 text-white font-display font-bold text-xs transition shadow-lg"
              >
                Ratify &amp; Co-Sign
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
