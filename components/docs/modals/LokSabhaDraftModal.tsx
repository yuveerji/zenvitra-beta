'use client';

import React from 'react';
import {
  Gavel,
  FileText,
  Newspaper,
  Vote,
  X,
  ArrowRight,
  Sparkles,
  Scale,
  Shield,
  BookOpen
} from 'lucide-react';
import { ZenDocType } from '@/types/docs';

interface LokSabhaDraftModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectDraftType: (type: ZenDocType, title: string) => void;
}

export function LokSabhaDraftModal({
  isOpen,
  onClose,
  onSelectDraftType,
}: LokSabhaDraftModalProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-fade-in text-left">
      <div className="w-full max-w-2xl bg-gradient-to-b from-[#0e1017] via-[#080a10] to-[#040507] border border-amber-500/30 rounded-3xl p-6 sm:p-8 shadow-[0_0_60px_rgba(245,158,11,0.15)] relative overflow-hidden space-y-6">
        
        {/* Ambient Top Glow */}
        <div className="absolute top-0 right-0 w-80 h-80 bg-amber-500/10 blur-[100px] pointer-events-none rounded-full" />
        <div className="absolute bottom-0 left-0 w-60 h-60 bg-cyan-500/10 blur-[90px] pointer-events-none rounded-full" />

        {/* Header */}
        <div className="flex items-start justify-between relative z-10 border-b border-white/10 pb-5">
          <div className="space-y-1.5">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-500/10 border border-amber-500/30 text-amber-300 font-mono text-[10px] uppercase font-bold tracking-wider">
              <Scale className="w-3.5 h-3.5 text-amber-400" />
              <span>LOK SABHA &bull; PARLIAMENTARY CHAMBER DRAFTING</span>
            </div>
            <h2 className="text-xl sm:text-2xl font-bold font-display text-white">
              What would you like to draft?
            </h2>
            <p className="text-xs sm:text-sm text-neutral-400 font-sans leading-relaxed">
              As a delegate or Member of Parliament in Lok Sabha, select your official document format below. Your document will initialize with sovereign statutory templates and clause numbering.
            </p>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="p-2 rounded-xl bg-white/5 hover:bg-white/10 text-neutral-400 hover:text-white transition cursor-pointer shrink-0"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* 3 Core Drafting Options */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 relative z-10 font-sans">
          
          {/* OPTION 1: PARLIAMENTARY BILL */}
          <button
            type="button"
            onClick={() => {
              onSelectDraftType('INDIAN_BILL', 'The Digital Sovereignty & Youth AI Empowerment Bill, 2026');
              onClose();
            }}
            className="p-5 rounded-2xl bg-gradient-to-b from-amber-500/10 to-transparent hover:from-amber-500/20 border border-amber-500/30 hover:border-amber-400/60 transition group text-left space-y-3 cursor-pointer shadow-lg hover:shadow-amber-500/10"
          >
            <div className="flex items-center justify-between">
              <div className="p-2.5 rounded-xl bg-amber-500/20 text-amber-300 group-hover:scale-105 transition-transform">
                <Gavel className="w-5 h-5" />
              </div>
              <span className="text-[9px] font-mono font-bold px-2 py-0.5 rounded-full bg-amber-500/20 text-amber-300 uppercase">
                ZEN.LEGISLATE
              </span>
            </div>
            <div>
              <h3 className="font-bold text-white text-sm group-hover:text-amber-300 transition">
                Parliamentary Bill
              </h3>
              <p className="text-xs text-neutral-400 mt-1 leading-relaxed">
                Draft a statutory Private Member or Government Bill with auto-numbered Sections, Clauses, Definitions, and Statement of Objects.
              </p>
            </div>
            <div className="pt-2 flex items-center gap-1 text-[11px] font-mono text-amber-400 font-semibold">
              <span>Start Bill Draft</span>
              <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
            </div>
          </button>

          {/* OPTION 2: OFFICIAL PRESS RELEASE */}
          <button
            type="button"
            onClick={() => {
              onSelectDraftType('PRESS_RELEASE', 'PRESS RELEASE: Lok Sabha Session Declarations & Strategic Briefing');
              onClose();
            }}
            className="p-5 rounded-2xl bg-gradient-to-b from-rose-500/10 to-transparent hover:from-rose-500/20 border border-rose-500/30 hover:border-rose-400/60 transition group text-left space-y-3 cursor-pointer shadow-lg hover:shadow-rose-500/10"
          >
            <div className="flex items-center justify-between">
              <div className="p-2.5 rounded-xl bg-rose-500/20 text-rose-300 group-hover:scale-105 transition-transform">
                <Newspaper className="w-5 h-5" />
              </div>
              <span className="text-[9px] font-mono font-bold px-2 py-0.5 rounded-full bg-rose-500/20 text-rose-300 uppercase">
                PRESS WIRE
              </span>
            </div>
            <div>
              <h3 className="font-bold text-white text-sm group-hover:text-rose-300 transition">
                Press Release
              </h3>
              <p className="text-xs text-neutral-400 mt-1 leading-relaxed">
                Draft an official media briefing, public declaration, or press gallery dispatch with embargo controls and spokesperson attribution.
              </p>
            </div>
            <div className="pt-2 flex items-center gap-1 text-[11px] font-mono text-rose-400 font-semibold">
              <span>Draft Release</span>
              <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
            </div>
          </button>

          {/* OPTION 3: PARLIAMENTARY MOTION / RESOLUTION */}
          <button
            type="button"
            onClick={() => {
              onSelectDraftType('POLICY_WORKING_PAPER', 'PARLIAMENTARY MOTION: Notice for Discussion on Public Infrastructure');
              onClose();
            }}
            className="p-5 rounded-2xl bg-gradient-to-b from-cyan-500/10 to-transparent hover:from-cyan-500/20 border border-cyan-500/30 hover:border-cyan-400/60 transition group text-left space-y-3 cursor-pointer shadow-lg hover:shadow-cyan-500/10"
          >
            <div className="flex items-center justify-between">
              <div className="p-2.5 rounded-xl bg-cyan-500/20 text-cyan-300 group-hover:scale-105 transition-transform">
                <Vote className="w-5 h-5" />
              </div>
              <span className="text-[9px] font-mono font-bold px-2 py-0.5 rounded-full bg-cyan-500/20 text-cyan-300 uppercase">
                MOTION
              </span>
            </div>
            <div>
              <h3 className="font-bold text-white text-sm group-hover:text-cyan-300 transition">
                Chamber Motion
              </h3>
              <p className="text-xs text-neutral-400 mt-1 leading-relaxed">
                Draft a formal parliamentary motion, Calling Attention Notice, or working resolution for chamber debate and Division voting.
              </p>
            </div>
            <div className="pt-2 flex items-center gap-1 text-[11px] font-mono text-cyan-400 font-semibold">
              <span>Draft Motion</span>
              <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
            </div>
          </button>

        </div>

        {/* Footer Hint */}
        <div className="p-3.5 rounded-2xl bg-white/[0.02] border border-white/5 flex items-center justify-between text-xs text-neutral-400 font-mono">
          <div className="flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-amber-400" />
            <span>Smart auto-numbering, clause redlines, and chamber voting sync enabled.</span>
          </div>
          <span className="text-neutral-500 hidden sm:inline">Lok Sabha Rules of Procedure</span>
        </div>

      </div>
    </div>
  );
}
