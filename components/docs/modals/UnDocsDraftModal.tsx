'use client';

import React from 'react';
import {
  ScrollText,
  FileText,
  Newspaper,
  X,
  ArrowRight,
  Sparkles,
  Globe2,
} from 'lucide-react';
import { ZenDocType } from '@/types/docs';

interface UnDocsDraftModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectDraftType: (type: ZenDocType, title: string) => void;
  committeeName?: string;
}

export function UnDocsDraftModal({
  isOpen,
  onClose,
  onSelectDraftType,
  committeeName = 'UN Chamber',
}: UnDocsDraftModalProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-fade-in text-left">
      <div className="w-full max-w-2xl bg-gradient-to-b from-[#0a0f1d] via-[#070b14] to-[#04060b] border border-cyan-500/30 rounded-3xl p-6 sm:p-8 shadow-[0_0_60px_rgba(6,182,212,0.15)] relative overflow-hidden space-y-6">
        
        {/* Ambient Top Glow */}
        <div className="absolute top-0 right-0 w-80 h-80 bg-cyan-500/10 blur-[100px] pointer-events-none rounded-full" />
        <div className="absolute bottom-0 left-0 w-60 h-60 bg-blue-500/10 blur-[90px] pointer-events-none rounded-full" />

        {/* Header */}
        <div className="flex items-start justify-between relative z-10 border-b border-white/10 pb-5">
          <div className="space-y-1.5">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-500/10 border border-cyan-500/30 text-cyan-300 font-mono text-[10px] uppercase font-bold tracking-wider">
              <Globe2 className="w-3.5 h-3.5 text-cyan-400" />
              <span>{committeeName} &bull; MULTILATERAL DIPLOMATIC DRAFTING</span>
            </div>
            <h2 className="text-xl sm:text-2xl font-bold font-display text-white">
              What document are you preparing?
            </h2>
            <p className="text-xs sm:text-sm text-neutral-400 font-sans leading-relaxed">
              Select your official United Nations document format. Your session will initialize with standardized preambulatory phrases, operative clauses, and sponsor rosters.
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
          
          {/* OPTION 1: DRAFT RESOLUTION */}
          <button
            type="button"
            onClick={() => {
              onSelectDraftType('DRAFT_RESOLUTION', `Draft Resolution: Multilateral Framework on Sovereign Digital Resilience`);
              onClose();
            }}
            className="p-5 rounded-2xl bg-gradient-to-b from-cyan-500/10 to-transparent hover:from-cyan-500/20 border border-cyan-500/30 hover:border-cyan-400/60 transition group text-left space-y-3 cursor-pointer shadow-lg hover:shadow-cyan-500/10"
          >
            <div className="flex items-center justify-between">
              <div className="p-2.5 rounded-xl bg-cyan-500/20 text-cyan-300 group-hover:scale-105 transition-transform">
                <ScrollText className="w-5 h-5" />
              </div>
              <span className="text-[9px] font-mono font-bold px-2 py-0.5 rounded-full bg-cyan-500/20 text-cyan-300 uppercase">
                ZEN.DOCS
              </span>
            </div>
            <div>
              <h3 className="font-bold text-white text-sm group-hover:text-cyan-300 transition">
                Draft Resolution
              </h3>
              <p className="text-xs text-neutral-400 mt-1 leading-relaxed">
                Formal multilateral resolution with formal Preambular & Operative clauses, sponsor delegations, and voting signatories.
              </p>
            </div>
            <div className="pt-2 flex items-center gap-1 text-[11px] font-mono text-cyan-400 font-semibold">
              <span>Initialize Draft Res</span>
              <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
            </div>
          </button>

          {/* OPTION 2: WORKING PAPER */}
          <button
            type="button"
            onClick={() => {
              onSelectDraftType('POLICY_WORKING_PAPER', `Working Paper 1.1: Comprehensive Policy Proposals & Bloc Strategy`);
              onClose();
            }}
            className="p-5 rounded-2xl bg-gradient-to-b from-emerald-500/10 to-transparent hover:from-emerald-500/20 border border-emerald-500/30 hover:border-emerald-400/60 transition group text-left space-y-3 cursor-pointer shadow-lg hover:shadow-emerald-500/10"
          >
            <div className="flex items-center justify-between">
              <div className="p-2.5 rounded-xl bg-emerald-500/20 text-emerald-300 group-hover:scale-105 transition-transform">
                <FileText className="w-5 h-5" />
              </div>
              <span className="text-[9px] font-mono font-bold px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 uppercase">
                CONSENSUS
              </span>
            </div>
            <div>
              <h3 className="font-bold text-white text-sm group-hover:text-emerald-300 transition">
                Working Paper (WP)
              </h3>
              <p className="text-xs text-neutral-400 mt-1 leading-relaxed">
                Informal un-moderated caucus working paper to outline bloc proposals, cross-regional frameworks, and preliminary ideas.
              </p>
            </div>
            <div className="pt-2 flex items-center gap-1 text-[11px] font-mono text-emerald-400 font-semibold">
              <span>Draft Working Paper</span>
              <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
            </div>
          </button>

          {/* OPTION 3: PRESS RELEASE / COMMUNIQUÉ */}
          <button
            type="button"
            onClick={() => {
              onSelectDraftType('PRESS_RELEASE', `DIPLOMATIC COMMUNIQUÉ: Joint Declaration of the Delegation`);
              onClose();
            }}
            className="p-5 rounded-2xl bg-gradient-to-b from-violet-500/10 to-transparent hover:from-violet-500/20 border border-violet-500/30 hover:border-violet-400/60 transition group text-left space-y-3 cursor-pointer shadow-lg hover:shadow-violet-500/10"
          >
            <div className="flex items-center justify-between">
              <div className="p-2.5 rounded-xl bg-violet-500/20 text-violet-300 group-hover:scale-105 transition-transform">
                <Newspaper className="w-5 h-5" />
              </div>
              <span className="text-[9px] font-mono font-bold px-2 py-0.5 rounded-full bg-violet-500/20 text-violet-300 uppercase">
                DIPLOMACY
              </span>
            </div>
            <div>
              <h3 className="font-bold text-white text-sm group-hover:text-violet-300 transition">
                Press Communiqué
              </h3>
              <p className="text-xs text-neutral-400 mt-1 leading-relaxed">
                Official statement or communiqué released to the international press corps and chamber audience.
              </p>
            </div>
            <div className="pt-2 flex items-center gap-1 text-[11px] font-mono text-violet-400 font-semibold">
              <span>Issue Communiqué</span>
              <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
            </div>
          </button>

        </div>

        {/* Footer Hint */}
        <div className="p-3.5 rounded-2xl bg-white/[0.02] border border-white/5 flex items-center justify-between text-xs text-neutral-400 font-mono">
          <div className="flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-cyan-400" />
            <span>Passed resolutions auto-archive into Sovereign Solutions and generate delegate sparks.</span>
          </div>
          <span className="text-neutral-500 hidden sm:inline">UN Rules of Procedure (UNA-USA)</span>
        </div>

      </div>
    </div>
  );
}
