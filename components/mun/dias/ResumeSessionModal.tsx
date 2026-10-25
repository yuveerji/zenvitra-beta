'use client';

import React, { useState } from 'react';
import { Copy, Check, X, RotateCcw, ArrowRight, Gavel, Shield } from 'lucide-react';

interface ResumeSessionModalProps {
  isOpen: boolean;
  onClose: () => void;
  onRejoin: () => void;
  onNewSession: () => void;
  session: {
    sessionCode: string;
    committeeName: string;
    committeeAcronym?: string;
    topic: string;
    emblemUrl?: string;
    isIndianCommittee?: boolean;
    rosterCount?: number;
    chairName?: string;
  };
}

export function ResumeSessionModal({
  isOpen,
  onClose,
  onRejoin,
  onNewSession,
  session,
}: ResumeSessionModalProps) {
  const [copied, setCopied] = useState(false);

  if (!isOpen) return null;

  const handleCopy = () => {
    if (session.sessionCode && typeof navigator !== 'undefined') {
      navigator.clipboard.writeText(session.sessionCode);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const isIndian = Boolean(
    session.isIndianCommittee ||
    (session.committeeAcronym && session.committeeAcronym.toLowerCase().includes('lok')) ||
    (session.committeeName && session.committeeName.toLowerCase().includes('lok'))
  );

  const acronym = session.committeeAcronym || session.committeeName?.slice(0, 6) || 'CHAMBER';

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-xl animate-in fade-in duration-200">
      <div className="relative w-full max-w-md bg-[#0D1017] text-[#F4F2ED] rounded-[28px] p-6 sm:p-7 shadow-[0_25px_90px_rgba(0,0,0,0.85)] border border-[#C5A46D]/30 overflow-hidden">
        {/* Subtle gold ambient glow */}
        <div className="absolute top-0 right-0 w-48 h-48 bg-[#C5A46D]/10 rounded-full blur-3xl pointer-events-none" />

        {/* Close X */}
        <button
          type="button"
          onClick={onClose}
          className="absolute top-5 right-5 p-1.5 rounded-full text-neutral-400 hover:text-white hover:bg-white/10 transition cursor-pointer"
          title="Dismiss"
        >
          <X className="w-4 h-4" />
        </button>

        {/* Top Header Pill */}
        <div className="flex items-center gap-3 mb-5">
          <div className="w-11 h-11 rounded-full bg-[#181B21] text-[#E6D1A5] border-2 border-[#C5A46D]/50 flex items-center justify-center font-mono font-bold text-sm shadow-[0_0_15px_rgba(197,164,109,0.2)] shrink-0">
            {acronym.slice(0, 2).toUpperCase()}
          </div>
          <div className="flex flex-col text-left">
            <span className="text-[10px] font-mono font-bold text-[#C5A46D] uppercase tracking-widest">
              YOUR SESSION IS STILL OPEN
            </span>
            <h3 className="text-xl font-bold font-serif text-[#F4F2ED] tracking-tight">
              Pick up where you left off.
            </h3>
          </div>
        </div>

        {/* Committee Badge Card */}
        <div className="p-4 rounded-2xl bg-[#141720] border border-white/10 flex items-center gap-4 mb-4">
          <div className="w-14 h-14 rounded-full bg-[#181B21] border border-white/10 flex items-center justify-center p-2 shrink-0 overflow-hidden">
            {isIndian ? (
              <img
                src="/assets/committees/emblem_of_india.svg"
                alt="Emblem of India"
                className="w-full h-full object-contain"
              />
            ) : session.emblemUrl && (session.emblemUrl.startsWith('/') || session.emblemUrl.startsWith('http')) ? (
              <img
                src={session.emblemUrl}
                alt="Emblem"
                className="w-full h-full object-contain"
              />
            ) : (
              <Gavel className="w-6 h-6 text-[#C5A46D]" />
            )}
          </div>
          <div className="flex-1 min-w-0 text-left">
            <div className="text-xl font-black font-sans text-white tracking-tight truncate leading-tight">
              {acronym}
            </div>
            <div className="text-xs text-neutral-400 font-medium truncate mt-0.5">
              {session.committeeName}
            </div>
            <div className="text-[11px] text-[#C5A46D] font-mono flex items-center gap-1 mt-1 truncate">
              <Gavel className="w-3 h-3 text-[#C5A46D]" />
              <span>Your role: <strong>Chair, as Chair</strong></span>
            </div>
          </div>
        </div>

        {/* Topic Display */}
        <div className="text-left mb-4 px-1">
          <span className="block text-[10px] font-mono font-bold text-[#9A9DA5] uppercase tracking-wider mb-1">
            TOPIC
          </span>
          <p className="text-xs sm:text-sm font-medium text-[#F4F2ED] line-clamp-2 leading-relaxed">
            {session.topic || 'General Parliamentary & Diplomatic Floor Debate'}
          </p>
        </div>

        {/* Session Code Card with Copy */}
        <div className="p-3.5 rounded-2xl bg-[#08090B] border border-white/10 flex items-center justify-between gap-3 mb-6">
          <div className="flex flex-col text-left">
            <span className="text-[9px] font-mono font-bold text-[#9A9DA5] uppercase tracking-widest">
              SESSION CODE
            </span>
            <span className="font-mono text-2xl font-black text-[#E6D1A5] tracking-widest">
              {session.sessionCode}
            </span>
          </div>

          <button
            type="button"
            onClick={handleCopy}
            className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-[#181B21] border border-white/15 hover:border-[#C5A46D]/60 text-xs font-bold font-mono text-[#E6D1A5] transition cursor-pointer shadow-xs"
            title="Copy Session PIN"
          >
            {copied ? (
              <>
                <Check className="w-3.5 h-3.5 text-emerald-400" />
                <span className="text-emerald-400">Copied</span>
              </>
            ) : (
              <>
                <Copy className="w-3.5 h-3.5" />
                <span>Copy</span>
              </>
            )}
          </button>
        </div>

        {/* Action Buttons */}
        <div className="grid grid-cols-2 gap-3">
          <button
            type="button"
            onClick={onRejoin}
            className="w-full py-3 px-4 rounded-xl bg-gradient-to-r from-[#C5A46D] via-[#E6D1A5] to-[#C5A46D] text-black text-sm font-black transition flex items-center justify-center gap-2 cursor-pointer shadow-[0_0_25px_rgba(197,164,109,0.35)] hover:shadow-[0_0_35px_rgba(197,164,109,0.5)] hover:scale-[1.01] active:scale-[0.99]"
          >
            <RotateCcw className="w-4 h-4 text-black" />
            <span>Rejoin</span>
          </button>

          <button
            type="button"
            onClick={onNewSession}
            className="w-full py-3 px-4 rounded-xl bg-[#181B21] hover:bg-[#202530] border border-white/15 text-neutral-300 hover:text-white text-sm font-bold transition flex items-center justify-center gap-1.5 cursor-pointer"
          >
            <span>New Session</span>
          </button>
        </div>
      </div>
    </div>
  );
}
