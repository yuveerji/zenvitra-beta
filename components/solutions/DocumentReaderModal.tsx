'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  X, 
  Download, 
  Share2, 
  Check, 
  ThumbsUp, 
  ThumbsDown, 
  MinusCircle, 
  ScrollText, 
  Shield, 
  Building2, 
  Users, 
  Calendar, 
  Sparkles,
  FileCheck,
  Newspaper,
  FileText,
  Bookmark,
  Printer
} from 'lucide-react';
import { SolutionDocument } from '@/types/solutions';

interface DocumentReaderModalProps {
  isOpen: boolean;
  onClose: () => void;
  document: SolutionDocument | null;
  onVote?: (docId: string, voteType: 'IN_FAVOR' | 'AGAINST' | 'ABSTAIN') => void;
}

export function DocumentReaderModal({ isOpen, onClose, document: doc, onVote }: DocumentReaderModalProps) {
  const [copied, setCopied] = useState(false);
  const [userVote, setUserVote] = useState<'IN_FAVOR' | 'AGAINST' | 'ABSTAIN' | null>(null);
  const [isSigned, setIsSigned] = useState(false);

  if (!isOpen || !doc) return null;

  const handleShare = () => {
    navigator.clipboard?.writeText(window.location.href);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleCastVote = (type: 'IN_FAVOR' | 'AGAINST' | 'ABSTAIN') => {
    setUserVote(type);
    if (onVote) onVote(doc.id, type);
  };

  const totalVotes = doc.votes.inFavor + doc.votes.against + doc.votes.abstain;
  const inFavorPercent = totalVotes > 0 ? Math.round((doc.votes.inFavor / totalVotes) * 100) : 100;
  const againstPercent = totalVotes > 0 ? Math.round((doc.votes.against / totalVotes) * 100) : 0;
  const abstainPercent = totalVotes > 0 ? Math.round((doc.votes.abstain / totalVotes) * 100) : 0;

  const preambularClauses = doc.clauses.filter(c => c.type === 'PREAMBULARY');
  const operativeClauses = doc.clauses.filter(c => c.type === 'OPERATIVE' || c.type === 'ARTICLE');

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 overflow-y-auto flex flex-col justify-start sm:justify-center items-center p-2 sm:p-4 md:p-6">
        {/* Backdrop */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          className="fixed inset-0 bg-black/90 backdrop-blur-md cursor-pointer"
        />

        {/* Modal Window — Authentic Parliamentary Parchment/Ledger UI */}
        <motion.div
          initial={{ opacity: 0, scale: 0.96, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.96, y: 20 }}
          className="relative w-full max-w-4xl rounded-3xl bg-[#090a0f] border border-white/20 p-5 sm:p-8 md:p-10 shadow-[0_30px_100px_rgba(0,0,0,0.95)] z-10 text-left space-y-6 my-auto max-h-[92vh] overflow-y-auto no-scrollbar"
        >
          {/* Top Bar Controls */}
          <div className="flex items-center justify-between border-b border-white/10 pb-4">
            <div className="flex items-center gap-2">
              <span className="px-3 py-1 rounded-full bg-cyan-500/15 border border-cyan-500/30 text-cyan-300 font-mono text-xs font-bold uppercase tracking-wider">
                {doc.documentType.replace('_', ' ')}
              </span>
              <span className="font-mono text-xs text-neutral-400">
                Ref: <strong className="text-white">{doc.documentCode}</strong>
              </span>
            </div>

            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={handleShare}
                className="p-2 rounded-xl bg-white/5 border border-white/10 text-neutral-300 hover:text-cyan-300 transition cursor-pointer text-xs font-mono flex items-center gap-1.5"
                title="Share reference link"
              >
                {copied ? <Check className="w-4 h-4 text-emerald-400" /> : <Share2 className="w-4 h-4" />}
                <span className="hidden sm:inline">{copied ? 'Copied' : 'Share'}</span>
              </button>

              <button
                type="button"
                onClick={() => alert(`Simulating Official PDF Export of ${doc.documentCode}...`)}
                className="p-2 rounded-xl bg-white/5 border border-white/10 text-neutral-300 hover:text-white transition cursor-pointer text-xs font-mono flex items-center gap-1.5"
                title="Download Official PDF"
              >
                <Download className="w-4 h-4" />
                <span className="hidden sm:inline">Export PDF</span>
              </button>

              <button
                type="button"
                onClick={onClose}
                className="p-2 rounded-full bg-white/5 border border-white/10 text-neutral-400 hover:text-white transition cursor-pointer"
                title="Close"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Official Document Seal & Header */}
          <div className="text-center space-y-3 py-4 border-b border-white/10 relative">
            <div className="inline-flex items-center justify-center w-12 h-12 rounded-2xl bg-white/[0.05] border border-white/20 p-2 shadow-inner">
              <ScrollText className="w-6 h-6 text-cyan-300" />
            </div>

            <div className="space-y-1">
              <span className="text-[11px] font-mono uppercase tracking-[0.25em] text-neutral-400 font-bold block">
                {doc.committee}
              </span>
              <h1 className="text-2xl sm:text-3xl lg:text-4xl font-display font-black text-white tracking-tight leading-tight max-w-2xl mx-auto">
                {doc.title}
              </h1>
            </div>

            {/* Metadata Pills */}
            <div className="flex flex-wrap items-center justify-center gap-4 text-xs font-mono text-neutral-400 pt-2">
              <span className="flex items-center gap-1.5">
                <Users className="w-3.5 h-3.5 text-cyan-400" />
                <span>Authors / Leads: <strong>{doc.leadSponsors.join(', ')}</strong></span>
              </span>
              <span suppressHydrationWarning className="flex items-center gap-1.5">
                <Calendar className="w-3.5 h-3.5 text-neutral-500" />
                <span>Deposited: {new Date(doc.createdAt).toLocaleDateString()}</span>
              </span>
            </div>
          </div>

          {/* Abstract / Preamble Overview */}
          <div className="p-5 rounded-2xl bg-white/[0.03] border border-white/10 space-y-2">
            <span className="text-[10px] font-mono uppercase tracking-widest text-cyan-400 font-bold block">
              EXECUTIVE ABSTRACT &amp; STATEMENT OF PURPOSE
            </span>
            <p className="text-sm text-neutral-200 leading-relaxed font-sans font-light">
              {doc.abstract}
            </p>
          </div>

          {/* Voting & Sentiment Bar */}
          <div className="p-4 rounded-2xl bg-[#0d0f18] border border-white/15 space-y-3">
            <div className="flex items-center justify-between text-xs font-mono">
              <span className="text-neutral-300 font-bold uppercase tracking-wider">
                COMMUNITY CONSENSUS TALLY ({totalVotes} Registered Endorsements)
              </span>
              <div className="flex items-center gap-3">
                <span className="text-emerald-400 font-bold">{inFavorPercent}% In Favor</span>
                <span className="text-rose-400 font-bold">{againstPercent}% Against</span>
                <span className="text-neutral-400">{abstainPercent}% Abstain</span>
              </div>
            </div>

            {/* Progress Segment Bar */}
            <div className="h-2 w-full rounded-full bg-white/10 overflow-hidden flex">
              <div style={{ width: `${inFavorPercent}%` }} className="bg-emerald-400 h-full transition-all" />
              <div style={{ width: `${againstPercent}%` }} className="bg-rose-500 h-full transition-all" />
              <div style={{ width: `${abstainPercent}%` }} className="bg-neutral-500 h-full transition-all" />
            </div>

            {/* Cast Vote Action */}
            <div className="flex items-center justify-between pt-1">
              <span className="text-[11px] font-mono text-neutral-400">Cast your community endorsement:</span>
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => handleCastVote('IN_FAVOR')}
                  className={`px-3 py-1.5 rounded-xl border text-xs font-mono font-bold transition flex items-center gap-1.5 cursor-pointer ${
                    userVote === 'IN_FAVOR'
                      ? 'bg-emerald-500/20 border-emerald-500 text-emerald-300'
                      : 'bg-white/5 border-white/10 text-neutral-300 hover:text-emerald-300 hover:bg-emerald-500/10'
                  }`}
                >
                  <ThumbsUp className="w-3.5 h-3.5" />
                  <span>In Favor</span>
                </button>

                <button
                  type="button"
                  onClick={() => handleCastVote('AGAINST')}
                  className={`px-3 py-1.5 rounded-xl border text-xs font-mono font-bold transition flex items-center gap-1.5 cursor-pointer ${
                    userVote === 'AGAINST'
                      ? 'bg-rose-500/20 border-rose-500 text-rose-300'
                      : 'bg-white/5 border-white/10 text-neutral-300 hover:text-rose-300 hover:bg-rose-500/10'
                  }`}
                >
                  <ThumbsDown className="w-3.5 h-3.5" />
                  <span>Against</span>
                </button>

                <button
                  type="button"
                  onClick={() => handleCastVote('ABSTAIN')}
                  className={`px-3 py-1.5 rounded-xl border text-xs font-mono font-bold transition flex items-center gap-1.5 cursor-pointer ${
                    userVote === 'ABSTAIN'
                      ? 'bg-neutral-500/20 border-neutral-400 text-white'
                      : 'bg-white/5 border-white/10 text-neutral-400 hover:text-white'
                  }`}
                >
                  <MinusCircle className="w-3.5 h-3.5" />
                  <span>Abstain</span>
                </button>
              </div>
            </div>
          </div>

          {/* Preambular Clauses Section */}
          {preambularClauses.length > 0 && (
            <div className="space-y-3 pt-2">
              <span className="text-xs font-mono uppercase tracking-widest text-purple-400 font-bold block pb-1 border-b border-white/10">
                I. CONTEXT &amp; PROBLEM FRAMEWORK
              </span>
              <div className="space-y-3 pl-3 sm:pl-6 border-l-2 border-purple-500/40">
                {preambularClauses.map((clause, idx) => (
                  <p key={idx} className="font-serif italic text-sm sm:text-base text-neutral-200 leading-relaxed">
                    {clause.text}
                  </p>
                ))}
              </div>
            </div>
          )}

          {/* Operative Clauses Section */}
          {operativeClauses.length > 0 && (
            <div className="space-y-4 pt-2">
              <span className="text-xs font-mono uppercase tracking-widest text-cyan-400 font-bold block pb-1 border-b border-white/10">
                II. OPERATIVE CLAUSES &amp; ENACTMENTS
              </span>
              <div className="space-y-3.5">
                {operativeClauses.map((clause, idx) => (
                  <div key={idx} className="flex items-start gap-3 p-4 rounded-2xl bg-white/[0.02] border border-white/[0.08] hover:border-white/20 transition-all">
                    <span className="px-2.5 py-1 rounded-lg bg-cyan-500/10 border border-cyan-500/30 font-mono text-xs font-bold text-cyan-300 shrink-0 mt-0.5">
                      {idx + 1}.
                    </span>
                    <div className="space-y-1">
                      <p className="text-sm sm:text-base text-white leading-relaxed font-sans font-light">
                        {clause.text}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Signatories Ledger */}
          <div className="p-5 rounded-2xl bg-white/[0.02] border border-white/10 space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-mono uppercase tracking-wider text-neutral-400 font-bold">
                RATIFYING SIGNATORIES ({doc.signatories.length})
              </span>
              <button
                type="button"
                onClick={() => setIsSigned(!isSigned)}
                className={`px-3 py-1 rounded-full border text-xs font-mono font-bold transition cursor-pointer ${
                  isSigned
                    ? 'bg-purple-500/20 border-purple-400 text-purple-300'
                    : 'bg-white/5 border-white/10 text-neutral-300 hover:text-white'
                }`}
              >
                {isSigned ? '✓ Co-Signature / Endorsement Added' : '+ Add Co-Signature / Endorsement'}
              </button>
            </div>

            <div className="flex flex-wrap gap-2 pt-1">
              {doc.signatories.map((sig, idx) => (
                <span
                  key={idx}
                  className="px-3 py-1 rounded-xl bg-white/[0.04] border border-white/10 text-xs font-mono text-neutral-300"
                >
                  {sig}
                </span>
              ))}
              {isSigned && (
                <span className="px-3 py-1 rounded-xl bg-purple-500/20 border border-purple-400 text-xs font-mono text-purple-300 font-bold animate-pulse">
                  Your Delegation Signature
                </span>
              )}
            </div>
          </div>

          {/* Footer Actions */}
          <div className="flex items-center justify-between pt-4 border-t border-white/10">
            <div className="flex items-center gap-2 text-xs font-mono text-neutral-400">
              <Shield className="w-4 h-4 text-emerald-400" />
              <span>Immutable Public Archive</span>
            </div>

            <button
              type="button"
              onClick={onClose}
              className="px-6 py-2.5 rounded-full bg-white text-black font-display font-bold text-xs uppercase tracking-wider hover:bg-neutral-200 transition"
            >
              Close Ledger
            </button>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
