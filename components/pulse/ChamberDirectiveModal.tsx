'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  X, 
  ShieldCheck, 
  Vote, 
  Radio, 
  Share2, 
  Check, 
  Bookmark, 
  FileText, 
  Sparkles,
  ExternalLink,
  Award,
  ChevronRight,
  Lock
} from 'lucide-react';

export interface DirectiveDossier {
  id: string;
  tag: string;
  badgeColor: string;
  title: string;
  chamber: string;
  location: string;
  timestamp: string;
  summary: string;
  fullDossier: string;
  clauses: { number: string; title: string; text: string }[];
  signatoriesCount: number;
  supermajorityPercent: number;
  authorName: string;
  authorUsername: string;
  authorRole: string;
}

export const DIRECTIVE_DOSSIERS: DirectiveDossier[] = [
  {
    id: 'directive-mesh',
    tag: 'CHAMBER DIRECTIVE',
    badgeColor: 'text-rose-400 bg-rose-500/10 border-rose-500/30',
    title: 'ZENVITRA MESH: Live Decentralized Diplomatic Network Active',
    chamber: 'Global Assembly Coordination Desk',
    location: 'Distributed Sovereign Mesh Node',
    timestamp: 'Protocol Genesis • Verified Active',
    summary: 'Decentralized diplomatic matrix enabling student caucuses, verifiable citations, peer-reviewed draft resolutions, and sovereign identity clearance without algorithmic tracking.',
    fullDossier: `ZENVITRA MESH operates as an uncompromised civic protocol for youth diplomacy and transparent assembly governance.\n\nAll participating delegates communicate across zero-knowledge encrypted channels, draft binding multilateral resolutions with line-by-line redline auditing, and cast roll-call votes directly on the Sovereign Civic Ledger.\n\nCentralized advertising, biometric harvesting, and shadowbanning are constitutionally barred by protocol design.`,
    clauses: [
      {
        number: 'Clause 1.1',
        title: 'Open Diplomatic Corridors',
        text: 'Every youth delegate retains sovereign access to publish and debate policy dossiers without algorithmic suppression or central intermediaries.'
      },
      {
        number: 'Clause 1.2',
        title: 'Verifiable Citation Proof',
        text: 'All policy declarations and amendments require Proof-of-Citation references to ensure transparent sourcing and eliminate misinformation.'
      },
      {
        number: 'Clause 1.3',
        title: 'Decentralized Assembly Wire',
        text: 'Floor speeches and procedural motions operate under a strict 60-second guillotine clock with instant Points of Information logging.'
      }
    ],
    signatoriesCount: 1,
    supermajorityPercent: 100,
    authorName: 'Zenvitra Protocol Working Group',
    authorUsername: 'founder',
    authorRole: 'Platform Architecture Directorate'
  },
  {
    id: 'directive-civic',
    tag: 'CIVIC COVENANT',
    badgeColor: 'text-emerald-400 bg-emerald-500/10 border-emerald-500/30',
    title: 'Constitutional 10% Profit Civic Treasury Allocation Invariant',
    chamber: 'Public School Treasury & Scholarship Desk',
    location: 'Immutable Governance Ledger',
    timestamp: 'Quadrennial Distribution Invariant',
    summary: 'Hardcoded constitutional rule allocating 10% of all platform revenues and summit fees every 4 months to student scholarships, classroom computer labs, and supplies—verified with offline video proof and public receipts.',
    fullDossier: `Under the Zenvitra Constitutional Covenant, 10% of all net platform surplus is permanently ring-fenced for public education development and student opportunity grants.\n\nEvery four months, disbursements are made directly to underfunded government schools for computer lab hardware, textbooks, and full merit scholarships.\n\nEvery handover is recorded on video, published transparently on ZEN.FLUX, and cross-verified with bank transaction hashes accessible to all delegates.`,
    clauses: [
      {
        number: 'Clause 2.1',
        title: '10% Surplus Ring-Fence',
        text: '10% of net proceeds from subscriptions, summit fees, and sponsorships are locked into the public civic pool.'
      },
      {
        number: 'Clause 2.2',
        title: 'Quadrennial Handover Mandate',
        text: 'Distributions occur strictly every 4 months, accompanied by full transparent audit logs and recipient video receipts.'
      },
      {
        number: 'Clause 2.3',
        title: 'Zero Overhead Deduction',
        text: 'No administrative or marketing fees may be subtracted from the 10% civic pool.'
      }
    ],
    signatoriesCount: 1,
    supermajorityPercent: 100,
    authorName: 'Secretariat General',
    authorUsername: 'founder',
    authorRole: 'Founding Secretariat'
  },
  {
    id: 'directive-sovereign',
    tag: 'SECURITY CHARTER',
    badgeColor: 'text-cyan-400 bg-cyan-500/10 border-cyan-500/30',
    title: 'Sovereign Identity Shield & Anti-Theft Account Protection Protocol',
    chamber: 'Cryptographic Security Directorate',
    location: 'Hardware-Backed Security Matrix',
    timestamp: 'Active Defense Matrix',
    summary: 'Cryptographic account protection featuring 10-digit Sovereign Codes, TOTP 2FA, anti-brute force rate limiting, and real-time remote session kill switch.',
    fullDossier: `The Sovereign Account Shield enforces cryptographic security protocols to prevent account hijacking, credential stuffing, and session theft.\n\nKey pillars include:\n1. 10-Digit Unique Sovereign Codes for high-clearance actions.\n2. TOTP 2FA authenticator app compatibility (Google Authenticator, Authy).\n3. Real-time active session hardware detection with remote revocation.\n4. Emergency lockdown to immediately freeze compromised accounts.`,
    clauses: [
      {
        number: 'Clause 3.1',
        title: 'Hardware-Level Fingerprinting',
        text: 'Each client session receives a cryptographically unique node token with real-time revocation watchdog.'
      },
      {
        number: 'Clause 3.2',
        title: 'Remote Kill Switch',
        text: 'Delegates can terminate all remote and unauthorized sessions in a single click.'
      },
      {
        number: 'Clause 3.3',
        title: 'Zero-Knowledge Passkeys',
        text: 'Master passkeys are never transmitted in cleartext or logged in plaintext.'
      }
    ],
    signatoriesCount: 1,
    supermajorityPercent: 100,
    authorName: 'Sovereign Security Matrix',
    authorUsername: 'founder',
    authorRole: 'Security Working Group'
  }
];

interface ChamberDirectiveModalProps {
  isOpen: boolean;
  onClose: () => void;
  directiveIndex?: number;
}

export function ChamberDirectiveModal({
  isOpen,
  onClose,
  directiveIndex = 0,
}: ChamberDirectiveModalProps) {
  const [currentIndex, setCurrentIndex] = useState(directiveIndex);
  const [copied, setCopied] = useState(false);
  const [shareNotice, setShareNotice] = useState<string | null>(null);
  const [userVote, setUserVote] = useState<'aye' | 'nay' | null>(null);

  React.useEffect(() => {
    setCurrentIndex(directiveIndex);
  }, [directiveIndex]);

  if (!isOpen) return null;

  const directive = DIRECTIVE_DOSSIERS[currentIndex] || DIRECTIVE_DOSSIERS[0];

  const handleCopyLink = async () => {
    if (typeof window === 'undefined') return;
    const shareUrl = `${window.location.origin}/pulse?directive=${directive.id}`;

    let shared = false;
    if (typeof navigator !== 'undefined' && navigator.share && window.innerWidth < 768) {
      try {
        await navigator.share({
          title: `Zenvitra Directive: ${directive.title}`,
          text: `[ZENVITRA PROTOCOL] ${directive.title} • Login required to inspect full dossier.`,
          url: shareUrl,
        });
        shared = true;
      } catch (_) {}
    }

    if (!shared && typeof navigator !== 'undefined' && navigator.clipboard) {
      try {
        await navigator.clipboard.writeText(shareUrl);
      } catch (_) {}
    }

    setCopied(true);
    setShareNotice('Directive Link Copied! Recipients must login to view this classified resolution.');
    setTimeout(() => {
      setCopied(false);
      setShareNotice(null);
    }, 4000);
  };

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 select-none">
        {/* Backdrop */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          className="absolute inset-0 bg-black/85 backdrop-blur-xl"
        />

        {/* Modal Window */}
        <motion.div
          initial={{ opacity: 0, scale: 0.94, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.94, y: 20 }}
          transition={{ type: 'spring', damping: 25, stiffness: 350 }}
          className="relative w-full max-w-2xl bg-[#080a12] border border-cyan-500/30 rounded-3xl shadow-[0_25px_80px_rgba(0,0,0,0.95)] overflow-hidden z-10 flex flex-col max-h-[90vh]"
        >
          {/* Header Beacon Bar */}
          <div className="p-4 sm:p-5 border-b border-white/10 bg-gradient-to-r from-cyan-950/40 via-indigo-950/30 to-black flex items-center justify-between gap-3">
            <div className="flex items-center gap-2.5 min-w-0">
              <span className="flex h-2 w-2 relative shrink-0">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-rose-400 opacity-75" />
                <span className="relative inline-flex rounded-full h-2 w-2 bg-rose-500" />
              </span>
              <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-mono font-bold uppercase tracking-wider border ${directive.badgeColor}`}>
                {directive.tag}
              </span>
              <span className="text-zinc-400 text-xs truncate hidden sm:inline font-mono">
                {directive.chamber}
              </span>
            </div>

            <div className="flex items-center gap-2 shrink-0">
              <button
                type="button"
                onClick={handleCopyLink}
                className="p-2 rounded-xl text-zinc-400 hover:text-white hover:bg-white/10 transition cursor-pointer"
                title="Copy Directive Link"
              >
                {copied ? <Check className="w-4 h-4 text-emerald-400" /> : <Share2 className="w-4 h-4" />}
              </button>
              <button
                type="button"
                onClick={onClose}
                className="p-2 rounded-xl text-zinc-400 hover:text-white hover:bg-white/10 transition cursor-pointer"
                title="Close"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
          </div>

          {/* Directive Content Scrollable Body */}
          <div className="flex-1 overflow-y-auto p-5 sm:p-7 space-y-6 text-left">
            {/* Directive Index Switcher Tabs */}
            <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none">
              {DIRECTIVE_DOSSIERS.map((d, idx) => (
                <button
                  key={d.id}
                  onClick={() => {
                    setCurrentIndex(idx);
                    setUserVote(null);
                  }}
                  className={`px-3 py-1.5 rounded-xl font-mono text-xs font-bold transition whitespace-nowrap cursor-pointer border ${
                    currentIndex === idx
                      ? 'bg-cyan-500/20 border-cyan-400 text-cyan-300 shadow-sm'
                      : 'bg-white/[0.03] border-white/5 text-zinc-400 hover:text-white hover:bg-white/5'
                  }`}
                >
                  Wire #{idx + 1} • {d.tag.split(' ')[0]}
                </button>
              ))}
            </div>

            {/* Title & Metadata */}
            <div className="space-y-2">
              <h2 className="text-xl sm:text-2xl font-bold font-display text-white tracking-tight leading-snug">
                {directive.title}
              </h2>
              <div className="flex items-center gap-3 text-xs font-mono text-zinc-400 flex-wrap">
                <span className="text-cyan-400 font-semibold">{directive.location}</span>
                <span>•</span>
                <span>{directive.timestamp}</span>
              </div>
            </div>

            {/* Proposer & Clearance Card */}
            <div className="p-4 rounded-2xl bg-white/[0.02] border border-white/10 flex items-center justify-between flex-wrap gap-3">
              <div className="flex items-center gap-3 min-w-0">
                <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-cyan-500 to-blue-600 p-0.5 shrink-0">
                  <div className="w-full h-full rounded-[10px] bg-black flex items-center justify-center font-bold text-xs text-white uppercase">
                    {directive.authorName[0]}
                  </div>
                </div>
                <div className="min-w-0">
                  <strong className="text-xs text-white block font-semibold truncate">
                    {directive.authorName} (@{directive.authorUsername})
                  </strong>
                  <span className="text-[10px] font-mono text-zinc-400">{directive.authorRole}</span>
                </div>
              </div>

              <div className="flex items-center gap-2 font-mono text-[10px] text-emerald-400 bg-emerald-500/10 px-2.5 py-1 rounded-xl border border-emerald-500/20">
                <ShieldCheck className="w-3.5 h-3.5" />
                <span>SEALED &amp; VERIFIED</span>
              </div>
            </div>

            {/* Constitutional Status & Endorsement Bar */}
            <div className="p-4 rounded-2xl bg-cyan-950/20 border border-cyan-500/30 space-y-3">
              <div className="flex items-center justify-between text-xs font-mono">
                <span className="text-zinc-300 flex items-center gap-1.5">
                  <Vote className="w-4 h-4 text-cyan-400" />
                  <span>Constitutional Status</span>
                </span>
                <span className="font-bold text-emerald-300">
                  RATIFIED PLATFORM INVARIANT
                </span>
              </div>

              {/* Status Bar */}
              <div className="w-full h-1.5 rounded-full bg-white/10 overflow-hidden flex">
                <div 
                  className="h-full bg-gradient-to-r from-cyan-400 to-emerald-400 w-full" 
                />
              </div>

              {/* Instant Endorsement Action */}
              <div className="flex items-center justify-between pt-1 text-xs font-mono">
                <span className="text-[11px] text-zinc-400">
                  {userVote ? `Your ballot (${userVote.toUpperCase()}) recorded on civic ledger` : 'Delegate position:'}
                </span>
                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => setUserVote('aye')}
                    className={`px-3 py-1 rounded-lg font-mono text-xs font-bold transition cursor-pointer ${
                      userVote === 'aye'
                        ? 'bg-emerald-500 text-black shadow-md'
                        : 'bg-emerald-500/15 border border-emerald-500/30 text-emerald-300 hover:bg-emerald-500/25'
                    }`}
                  >
                    ✓ Endorse
                  </button>
                  <button
                    type="button"
                    onClick={() => setUserVote('nay')}
                    className={`px-3 py-1 rounded-lg font-mono text-xs font-bold transition cursor-pointer ${
                      userVote === 'nay'
                        ? 'bg-rose-500 text-white shadow-md'
                        : 'bg-rose-500/15 border border-rose-500/30 text-rose-300 hover:bg-rose-500/25'
                    }`}
                  >
                    ✕ Challenge
                  </button>
                </div>
              </div>
            </div>

            {/* Full Directive Dossier Summary */}
            <div className="space-y-3">
              <h3 className="font-mono text-xs font-bold text-zinc-300 uppercase tracking-wider">
                Executive Dossier Brief
              </h3>
              <p className="text-sm text-zinc-200 leading-relaxed font-sans whitespace-pre-wrap bg-white/[0.02] p-4 rounded-2xl border border-white/5">
                {directive.fullDossier}
              </p>
            </div>

            {/* Legislative Clauses Stack */}
            {directive.clauses && directive.clauses.length > 0 && (
              <div className="space-y-3">
                <h3 className="font-mono text-xs font-bold text-zinc-300 uppercase tracking-wider">
                  Adopted Articles &amp; Clauses
                </h3>
                <div className="space-y-2.5">
                  {directive.clauses.map((c, idx) => (
                    <div key={idx} className="p-4 rounded-2xl bg-white/[0.02] border border-white/10 space-y-1">
                      <div className="flex items-center gap-2">
                        <span className="px-2 py-0.5 rounded-md bg-cyan-500/15 text-cyan-300 text-[10px] font-mono font-bold">
                          {c.number}
                        </span>
                        <strong className="text-xs text-white font-semibold">{c.title}</strong>
                      </div>
                      <p className="text-xs text-zinc-300 leading-relaxed pt-1 pl-1">
                        {c.text}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Share Feedback Toast */}
          {shareNotice && (
            <div className="px-5 py-2.5 bg-cyan-950/90 border-t border-cyan-500/40 flex items-center justify-between gap-2 text-xs font-mono text-cyan-300 animate-in fade-in">
              <div className="flex items-center gap-2">
                <Lock className="w-3.5 h-3.5 text-cyan-400 shrink-0" />
                <span>{shareNotice}</span>
              </div>
              <button
                type="button"
                onClick={() => setShareNotice(null)}
                className="text-cyan-400 hover:text-white p-0.5 transition cursor-pointer"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            </div>
          )}

          {/* Footer Action Deck */}
          <div className="p-4 sm:p-5 border-t border-white/10 bg-[#06080e] flex items-center justify-between gap-3">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-xs font-mono text-zinc-300 transition cursor-pointer"
            >
              Dismiss
            </button>

            <div className="flex items-center gap-2.5">
              <button
                type="button"
                onClick={handleCopyLink}
                className="px-4 py-2 rounded-xl bg-cyan-500/10 hover:bg-cyan-500/20 border border-cyan-500/30 text-cyan-300 font-mono text-xs font-bold transition flex items-center gap-1.5 cursor-pointer"
              >
                {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Share2 className="w-3.5 h-3.5" />}
                <span>{copied ? 'Link Copied (Auth Protected)!' : 'Share Directive'}</span>
              </button>

              <button
                type="button"
                onClick={() => {
                  onClose();
                }}
                className="px-5 py-2 rounded-xl bg-gradient-to-r from-cyan-400 to-blue-500 hover:from-cyan-300 hover:to-blue-400 text-black font-mono text-xs font-bold transition cursor-pointer shadow-md"
              >
                Enter Chamber Wire →
              </button>
            </div>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
