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
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-md animate-in fade-in duration-200">
      <div className="relative w-full max-w-md bg-[#FAF8F5] text-[#1E232A] rounded-[28px] p-6 sm:p-7 shadow-[0_25px_70px_rgba(0,0,0,0.35)] border border-[#E5E0D8] overflow-hidden">
        {/* Close X */}
        <button
          type="button"
          onClick={onClose}
          className="absolute top-5 right-5 p-1.5 rounded-full text-[#8C8273] hover:text-[#1E232A] hover:bg-black/5 transition cursor-pointer"
          title="Dismiss"
        >
          <X className="w-4 h-4" />
        </button>

        {/* Top Header Pill */}
        <div className="flex items-center gap-3 mb-5">
          <div className="w-11 h-11 rounded-full bg-[#1B3D29] text-[#E6D1A5] border-2 border-[#C5A46D]/60 flex items-center justify-center font-mono font-bold text-sm shadow-sm shrink-0">
            {acronym.slice(0, 2).toUpperCase()}
          </div>
          <div className="flex flex-col text-left">
            <span className="text-[10px] font-mono font-bold text-[#8C7860] uppercase tracking-widest">
              YOUR SESSION IS STILL OPEN
            </span>
            <h3 className="text-xl font-bold font-serif text-[#1F2421] tracking-tight">
              Pick up where you left off.
            </h3>
          </div>
        </div>

        {/* Committee Badge Card */}
        <div className="p-4 rounded-2xl bg-white border border-[#E8E2D8] shadow-xs flex items-center gap-4 mb-4">
          <div className="w-14 h-14 rounded-full bg-[#FAF8F5] border border-[#E2DCD0] flex items-center justify-center p-2 shrink-0 overflow-hidden">
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
              <Gavel className="w-6 h-6 text-[#1B3D29]" />
            )}
          </div>
          <div className="flex-1 min-w-0 text-left">
            <div className="text-xl font-black font-sans text-[#1B3D29] tracking-tight truncate leading-tight">
              {acronym}
            </div>
            <div className="text-xs text-[#5C554B] font-medium truncate mt-0.5">
              {session.committeeName}
            </div>
            <div className="text-[11px] text-[#8C7860] font-mono flex items-center gap-1 mt-1 truncate">
              <Gavel className="w-3 h-3 text-[#C5A46D]" />
              <span>Your role: <strong>Chair, as Chair</strong></span>
            </div>
          </div>
        </div>

        {/* Topic Display */}
        <div className="text-left mb-4 px-1">
          <span className="block text-[10px] font-mono font-bold text-[#8C8273] uppercase tracking-wider mb-1">
            TOPIC
          </span>
          <p className="text-xs sm:text-sm font-medium text-[#2D2822] line-clamp-2 leading-relaxed">
            {session.topic || 'General Parliamentary & Diplomatic Floor Debate'}
          </p>
        </div>

        {/* Session Code Card with Copy */}
        <div className="p-3.5 rounded-2xl bg-[#EDE8DF] border border-[#DDD5C7] flex items-center justify-between gap-3 mb-6">
          <div className="flex flex-col text-left">
            <span className="text-[9px] font-mono font-bold text-[#786E5F] uppercase tracking-widest">
              SESSION CODE
            </span>
            <span className="font-mono text-2xl font-black text-[#1E232A] tracking-widest">
              {session.sessionCode}
            </span>
          </div>

          <button
            type="button"
            onClick={handleCopy}
            className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-white border border-[#DDD5C7] hover:border-[#1B3D29] text-xs font-bold font-mono text-[#1B3D29] transition cursor-pointer shadow-2xs hover:shadow-xs"
            title="Copy Session PIN"
          >
            {copied ? (
              <>
                <Check className="w-3.5 h-3.5 text-emerald-600" />
                <span className="text-emerald-700">Copied</span>
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
            className="w-full py-3 px-4 rounded-xl bg-[#1B3D29] hover:bg-[#142D1F] text-white text-sm font-bold transition flex items-center justify-center gap-2 cursor-pointer shadow-md hover:scale-[1.01] active:scale-[0.99]"
          >
            <RotateCcw className="w-4 h-4" />
            <span>Rejoin</span>
          </button>

          <button
            type="button"
            onClick={onNewSession}
            className="w-full py-3 px-4 rounded-xl bg-white hover:bg-[#FAF8F5] border border-[#DDD5C7] text-[#4A453E] hover:text-[#1E232A] text-sm font-bold transition flex items-center justify-center gap-1.5 cursor-pointer shadow-2xs"
          >
            <span>New Session</span>
          </button>
        </div>
      </div>
    </div>
  );
}
