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
    id: 'directive-418',
    tag: 'PLENARY RESOLUTION',
    badgeColor: 'text-rose-400 bg-rose-500/10 border-rose-500/30',
    title: 'Geneva Accord on Open Civic Corridors & Youth Sovereignty',
    chamber: 'General Assembly Plenary #418',
    location: 'Palais des Nations, Geneva • Wire Node #418',
    timestamp: 'Today at 14:30 UTC • Live Plenary',
    summary: 'Resolution mandating unrestricted access to decentralized civic channels, peer-audited open policy draft repositories, and constitutional youth delegation seats.',
    fullDossier: `The General Assembly Plenary, convened at the Palais des Nations, hereby adopts Resolution #418 on the Establishment of Open Civic Corridors.\n\nRecognizing the fundamental sovereignty of youth researchers, thinkers, and civil delegates across all global jurisdictions, this Accord creates an immutable public protocol for open peer-review, cryptographic citation validation, and unhindered civic debate.`,
    clauses: [
      {
        number: 'Clause 1.1',
        title: 'Open Civic Transit Rights',
        text: 'Every accredited youth delegate and civic node retains permanent sovereignty to publish and verify policy dossiers without algorithmic shadowbanning or central intermediaries.'
      },
      {
        number: 'Clause 1.2',
        title: '25% Profit Civic Impact Allocation Invariant',
        text: 'All ecosystem earnings and summit registrations must hardcode a constitutional 25% profit allocation directed every 4 months to student scholarships, classroom supplies, and computer labs—verified with offline handover videos on ZEN.FLUX and public receipts.'
      },
      {
        number: 'Clause 1.3',
        title: 'Cryptographic Audit & Source Enforcement',
        text: 'Resolutions and amendments submitted to plenary vote require a minimum 90% Proof-of-Citation reliability index before entering supermajority deliberation.'
      }
    ],
    signatoriesCount: 384,
    supermajorityPercent: 94,
    authorName: 'Secretariat General',
    authorUsername: 'un_plenary',
    authorRole: 'Chamber Secretariat'
  },
  {
    id: 'directive-summit-2026',
    tag: 'SUMMIT DISPATCH',
    badgeColor: 'text-cyan-400 bg-cyan-500/10 border-cyan-500/30',
    title: 'Youth Diplomatic Summit 2026: 1,420 Checked-in Delegates',
    chamber: 'Global Assembly Coordination Desk',
    location: 'Zurich Plenary Hall & Distributed Wire',
    timestamp: 'Today at 12:15 UTC • Active Roll-Call',
    summary: 'Global diplomatic summit kickoff recording 1,420 accredited delegates across 48 nations participating in live legislative drafts and take-rate fee simulations.',
    fullDossier: `The Youth Diplomatic Summit 2026 has commenced with unprecedented distributed participation. Delegates have checked into the Sovereign Grid across 48 national nodes, activating live caucus rooms and peer-to-peer floor speech relays.\n\nThe plenary committee has finalized the dual-sided take-rate settlement fee schedule (0.5% + ₹19 attendee rate) ensuring equitable access for all student delegations.`,
    clauses: [
      {
        number: 'Section A',
        title: 'Quorum Verification',
        text: 'Quorum established with 1,420 verified node signatures across 48 participating delegations.'
      },
      {
        number: 'Section B',
        title: 'Floor Relays & Guillotine Clock',
        text: 'Floor speech transceivers active with 60-second hard guillotine timer and instant Points of Information logging.'
      }
    ],
    signatoriesCount: 1420,
    supermajorityPercent: 98,
    authorName: 'Council Presidium',
    authorUsername: 'summit_chair',
    authorRole: 'Summit Organizing Secretariat'
  },
  {
    id: 'directive-unsc-bio',
    tag: 'SECURITY COUNCIL DIRECTIVE',
    badgeColor: 'text-amber-400 bg-amber-500/10 border-amber-500/30',
    title: 'High-Seas Biosphere Protection Treaty Redline Finalized',
    chamber: 'UN Security Council Crisis Chamber',
    location: 'Security Council Chamber Node #92',
    timestamp: 'Today at 10:45 UTC • Treaty Draft',
    summary: 'Legislative redline comparison finalized with +28 proposed clauses and -11 redactions safeguarding international maritime zones from unregulated commercial exploitation.',
    fullDossier: `Following extensive multi-caucus negotiations, the UN Security Council delegation has reached redline consensus on the High-Seas Biosphere Treaty. The amended draft establishes strict ecological preservation zones with real-time satellite telemetry verification.`,
    clauses: [
      {
        number: 'Article 4',
        title: 'Demarcation of International Sanctuary Corridors',
        text: 'All maritime territories outside standard 200nm Exclusive Economic Zones are classified as sovereign commons subject to international ecological monitoring.'
      },
      {
        number: 'Article 7',
        title: 'Enforcement & Telemetry Verification',
        text: 'Violations will be recorded directly on the public Civic Ledger with automatic referral to the International Maritime Tribunal.'
      }
    ],
    signatoriesCount: 124,
    supermajorityPercent: 88,
    authorName: 'Crisis Secretariat',
    authorUsername: 'unsc_wire',
    authorRole: 'Security Council Chair'
  },
  {
    id: 'directive-floor-relay',
    tag: '60S FLOOR RELAY',
    badgeColor: 'text-purple-400 bg-purple-500/10 border-purple-500/30',
    title: 'Plenary Consensus Floor Relay by Delegate @yuveer',
    chamber: 'Youth Plenary Floor Speech Node',
    location: 'Palais des Nations Wire Node #108',
    timestamp: 'Today at 09:20 UTC • Audio Broadcast',
    summary: '60-second floor speech delivered by delegate @yuveer emphasizing grassroots governance, decentralized knowledge nodes, and transparent treasury allocations.',
    fullDossier: `Floor Speech Transcript (60s Guillotine Clock):\n\n"Fellow delegates, the future of civic dialogue cannot exist on ad-funded, attention-harvesting platforms that commodify youth outrage. We are building the sovereign alternative — where citations are mathematically verifiable, where every voice is heard in transparent assembly chambers, and where 25% of all profits directly build rural computer labs and fund student scholarships every 4 months with offline video proof. The era of passive observation is over; the era of sovereign youth governance has begun."`,
    clauses: [
      {
        number: 'Floor Action',
        title: 'Yield of Time',
        text: 'Delegate yielded remainder of time (8 seconds) to the Chair with zero Points of Order raised.'
      }
    ],
    signatoriesCount: 290,
    supermajorityPercent: 96,
    authorName: 'Yuveer',
    authorUsername: 'yuveer',
    authorRole: 'Founding Delegate'
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

            {/* Supermajority Consensus Status Bar */}
            <div className="p-4 rounded-2xl bg-cyan-950/20 border border-cyan-500/30 space-y-3">
              <div className="flex items-center justify-between text-xs font-mono">
                <span className="text-zinc-300 flex items-center gap-1.5">
                  <Vote className="w-4 h-4 text-cyan-400" />
                  <span>Plenary Consensus Roll-Call</span>
                </span>
                <span className="font-bold text-white">
                  {directive.supermajorityPercent}% Supermajority ({directive.signatoriesCount} Delegates)
                </span>
              </div>

              {/* Progress Gauge */}
              <div className="w-full h-2 rounded-full bg-white/10 overflow-hidden flex">
                <div 
                  className="h-full bg-gradient-to-r from-cyan-400 to-emerald-400 transition-all duration-700" 
                  style={{ width: `${directive.supermajorityPercent}%` }} 
                />
                <div 
                  className="h-full bg-rose-500/80" 
                  style={{ width: `${100 - directive.supermajorityPercent}%` }} 
                />
              </div>

              {/* Instant Voting Action */}
              <div className="flex items-center justify-between pt-1 text-xs font-mono">
                <span className="text-[11px] text-zinc-400">
                  {userVote ? `Your vote (${userVote.toUpperCase()}) recorded` : 'Cast your sovereign vote:'}
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
                    ✓ Vote Aye
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
                    ✕ Vote Nay
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
