'use client';

import React, { useState } from 'react';
import { 
  Hash, 
  Volume2, 
  Bell, 
  Pin, 
  Search, 
  MoreVertical, 
  Paperclip, 
  Send, 
  Sparkles, 
  ShieldCheck, 
  Lock, 
  Users, 
  Smile, 
  Mic, 
  FileText, 
  ChevronRight, 
  Globe2, 
  Layers, 
  CheckCheck,
  AlertCircle,
  Clock,
  Compass
} from 'lucide-react';

export function ZenChatInterfaceMockup() {
  const [activeChannel, setActiveChannel] = useState<'unsc' | 'announcements' | 'lounge'>('unsc');

  return (
    <section className="relative py-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
      {/* Section Header */}
      <div className="text-center max-w-3xl mx-auto mb-12 sm:mb-16">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-500/10 border border-blue-500/25 text-blue-300 text-xs font-mono tracking-wider uppercase mb-4">
          <Layers className="w-3.5 h-3.5" />
          <span>Product Preview</span>
        </div>
        <h2
          className="text-3xl sm:text-4xl md:text-5xl font-bold tracking-tight text-white uppercase mb-4"
          style={{ fontFamily: 'Clash Display, var(--font-space), sans-serif' }}
        >
          A Glimpse of What's Coming
        </h2>
        <p className="text-neutral-300 text-sm sm:text-base leading-relaxed">
          Designed specifically for Model UN summits, youth delegations, and global communities. 
          Structured channels, verified committee rosters, and distraction-free diplomacy.
        </p>
      </div>

      {/* Preview Frame Wrapper */}
      <div className="relative rounded-2xl sm:rounded-3xl border border-white/15 bg-[#05070d]/95 shadow-[0_25px_80px_rgba(0,0,0,0.85)] overflow-hidden">
        {/* Soft Ambient Glows Behind Frame */}
        <div 
          className="absolute -top-32 -left-32 w-80 h-80 bg-blue-600/15 rounded-full blur-3xl pointer-events-none" 
          aria-hidden="true" 
        />
        <div 
          className="absolute -bottom-32 -right-32 w-80 h-80 bg-indigo-600/15 rounded-full blur-3xl pointer-events-none" 
          aria-hidden="true" 
        />

        {/* ─── MAC-STYLE WINDOW TITLE BAR ─── */}
        <div className="px-4 py-3 bg-[#0a0d16] border-b border-white/10 flex items-center justify-between gap-4 select-none">
          {/* Traffic Lights */}
          <div className="flex items-center gap-2">
            <span className="w-3 h-3 rounded-full bg-zinc-700/80" />
            <span className="w-3 h-3 rounded-full bg-zinc-700/80" />
            <span className="w-3 h-3 rounded-full bg-zinc-700/80" />
            <span className="ml-3 text-[11px] font-mono text-neutral-400 hidden sm:inline">
              ZEN.CHAT Studio Preview — Geneva Diplomatic Summit 2026
            </span>
          </div>

          {/* Watermark Tag: Illustrative Preview */}
          <div className="flex items-center gap-2">
            <span className="px-2.5 py-0.5 rounded text-[10px] font-mono tracking-wider uppercase bg-blue-500/10 text-blue-300 border border-blue-500/30">
              ILLUSTRATIVE ARCHITECTURE PREVIEW
            </span>
          </div>
        </div>

        {/* ─── DESKTOP THREE-COLUMN WORKSPACE PREVIEW ─── */}
        <div className="flex flex-col lg:flex-row min-h-[580px] text-left">
          
          {/* 1. WORKSPACE RAIL (Far Left) */}
          <div className="w-full lg:w-16 bg-[#03050a] border-b lg:border-b-0 lg:border-r border-white/10 p-2 sm:p-2.5 flex lg:flex-col items-center justify-between lg:justify-start gap-2.5 shrink-0 select-none">
            {/* Top Workspace Icons */}
            <div className="flex lg:flex-col items-center gap-2.5">
              {/* ZENVITRA Hub */}
              <div 
                className="relative group p-0.5 rounded-xl bg-blue-600/20 border border-blue-400/40 cursor-default"
                title="ZENVITRA Central Hub"
              >
                <div className="w-9 h-9 rounded-lg bg-blue-600/30 flex items-center justify-center text-white">
                  <img src="/assets/logo-new.png" alt="Zenvitra Hub" className="w-6 h-6 object-contain mix-blend-screen" />
                </div>
                <div className="absolute -left-1 top-2 bottom-2 w-1 bg-blue-500 rounded-r hidden lg:block" />
              </div>

              {/* Event 1: Geneva Diplomatic Summit (Active) */}
              <div 
                className="relative group p-0.5 rounded-xl bg-white/10 border border-white/20 cursor-default"
                title="Geneva Diplomatic Summit 2026"
              >
                <div className="w-9 h-9 rounded-lg bg-gradient-to-br from-blue-900/60 to-slate-900/80 flex items-center justify-center text-xs font-mono font-bold text-blue-200">
                  GDS
                </div>
              </div>

              {/* Event 2: Harvard Model UN */}
              <div 
                className="relative group p-0.5 rounded-xl bg-white/5 hover:bg-white/10 border border-transparent hover:border-white/15 cursor-default transition-all"
                title="Harvard Model United Nations"
              >
                <div className="w-9 h-9 rounded-lg bg-slate-900 flex items-center justify-center text-xs font-mono font-semibold text-neutral-400">
                  HMUN
                </div>
              </div>

              {/* Event 3: Youth Conclave */}
              <div 
                className="relative group p-0.5 rounded-xl bg-white/5 hover:bg-white/10 border border-transparent hover:border-white/15 cursor-default transition-all hidden sm:block"
                title="Youth Leadership Conclave"
              >
                <div className="w-9 h-9 rounded-lg bg-slate-900 flex items-center justify-center text-xs font-mono font-semibold text-neutral-400">
                  YLC
                </div>
              </div>
            </div>

            {/* Bottom Status / Add Placeholder */}
            <div className="hidden lg:flex flex-col items-center gap-2 mt-auto pt-4 border-t border-white/5">
              <div className="w-8 h-8 rounded-lg bg-white/5 flex items-center justify-center text-neutral-400 text-xs font-mono">
                +
              </div>
            </div>
          </div>

          {/* 2. CHANNELS SIDEBAR (Middle Rail) */}
          <div className="w-full lg:w-64 bg-[#070a13] border-b lg:border-b-0 lg:border-r border-white/10 p-3 sm:p-4 shrink-0 flex flex-col justify-between">
            <div className="space-y-4">
              {/* Workspace Header */}
              <div className="flex items-center justify-between pb-3 border-b border-white/10">
                <div className="min-w-0">
                  <div className="flex items-center gap-1.5">
                    <h3 className="text-xs sm:text-sm font-bold text-white tracking-wide truncate">
                      Geneva Summit 2026
                    </h3>
                    <ShieldCheck className="w-3.5 h-3.5 text-blue-400 shrink-0" />
                  </div>
                  <p className="text-[10px] font-mono text-neutral-400 uppercase tracking-wider">
                    Official Workspace
                  </p>
                </div>
              </div>

              {/* Channel Group: OFFICIAL ANNOUNCEMENTS */}
              <div className="space-y-1">
                <div className="px-2 py-1 text-[10px] font-mono uppercase tracking-widest text-neutral-400 flex items-center justify-between">
                  <span>Official Notices</span>
                  <span className="text-[9px] text-blue-400">EB Auth</span>
                </div>

                <button
                  type="button"
                  onClick={() => setActiveChannel('announcements')}
                  className={`w-full flex items-center justify-between px-2.5 py-1.5 rounded-lg text-xs font-medium transition-colors ${
                    activeChannel === 'announcements'
                      ? 'bg-blue-600/20 text-blue-200 border border-blue-500/30'
                      : 'text-neutral-400 hover:text-neutral-200 hover:bg-white/5'
                  }`}
                >
                  <div className="flex items-center gap-2 min-w-0">
                    <Bell className="w-3.5 h-3.5 text-blue-400 shrink-0" />
                    <span className="truncate">announcements</span>
                  </div>
                  <span className="w-2 h-2 rounded-full bg-blue-500 shrink-0" />
                </button>

                <div className="flex items-center gap-2 px-2.5 py-1.5 text-xs text-neutral-400 opacity-75">
                  <FileText className="w-3.5 h-3.5 shrink-0" />
                  <span className="truncate">procedural-rules</span>
                </div>
              </div>

              {/* Channel Group: COMMITTEES */}
              <div className="space-y-1">
                <div className="px-2 py-1 text-[10px] font-mono uppercase tracking-widest text-neutral-400 flex items-center justify-between">
                  <span>Committees</span>
                  <Lock className="w-2.5 h-2.5 text-neutral-400" />
                </div>

                <button
                  type="button"
                  onClick={() => setActiveChannel('unsc')}
                  className={`w-full flex items-center justify-between px-2.5 py-1.5 rounded-lg text-xs font-medium transition-colors ${
                    activeChannel === 'unsc'
                      ? 'bg-blue-600/25 text-white border border-blue-500/40 shadow-sm'
                      : 'text-neutral-400 hover:text-neutral-200 hover:bg-white/5'
                  }`}
                >
                  <div className="flex items-center gap-2 min-w-0">
                    <Hash className="w-3.5 h-3.5 text-blue-400 shrink-0" />
                    <span className="font-semibold truncate">unsc-security-council</span>
                  </div>
                  <span className="text-[9px] font-mono text-blue-300 bg-blue-500/20 px-1 rounded">
                    EB
                  </span>
                </button>

                <div className="flex items-center gap-2 px-2.5 py-1.5 text-xs text-neutral-400 opacity-75">
                  <Hash className="w-3.5 h-3.5 shrink-0" />
                  <span className="truncate">unhrc-human-rights</span>
                </div>

                <div className="flex items-center gap-2 px-2.5 py-1.5 text-xs text-neutral-400 opacity-75">
                  <Hash className="w-3.5 h-3.5 shrink-0" />
                  <span className="truncate">disec-disarmament</span>
                </div>
              </div>

              {/* Channel Group: COMMUNITY & INFORMAL */}
              <div className="space-y-1">
                <div className="px-2 py-1 text-[10px] font-mono uppercase tracking-widest text-neutral-400">
                  <span>Community</span>
                </div>

                <button
                  type="button"
                  onClick={() => setActiveChannel('lounge')}
                  className={`w-full flex items-center gap-2 px-2.5 py-1.5 rounded-lg text-xs font-medium transition-colors ${
                    activeChannel === 'lounge'
                      ? 'bg-blue-600/20 text-blue-200 border border-blue-500/30'
                      : 'text-neutral-400 hover:text-neutral-200 hover:bg-white/5'
                  }`}
                >
                  <Users className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                  <span className="truncate">delegates-lounge</span>
                </button>
              </div>
            </div>

            {/* Bottom Delegation Credential Indicator */}
            <div className="pt-3 border-t border-white/10 flex items-center gap-2.5 select-none">
              <div className="w-7 h-7 rounded-full bg-gradient-to-tr from-blue-600 to-indigo-500 flex items-center justify-center text-[11px] font-bold text-white">
                FR
              </div>
              <div className="min-w-0 text-left">
                <p className="text-xs font-medium text-white truncate leading-tight">
                  Delegate of France
                </p>
                <p className="text-[10px] font-mono text-blue-300/80 leading-tight">
                  Verified MUN Credential
                </p>
              </div>
            </div>
          </div>

          {/* 3. MAIN CONVERSATION PANEL (Right Viewport) */}
          <div className="flex-1 bg-[#05070d] flex flex-col justify-between min-h-[420px]">
            {/* Conversation Header */}
            <div className="px-4 py-3 bg-[#080b15] border-b border-white/10 flex items-center justify-between gap-4">
              <div className="flex items-center gap-2.5 min-w-0">
                <div className="w-6 h-6 rounded-md bg-blue-500/10 border border-blue-500/30 flex items-center justify-center text-blue-400 shrink-0">
                  <Hash className="w-3.5 h-3.5" />
                </div>
                <div className="min-w-0">
                  <div className="flex items-center gap-2">
                    <h4 className="text-xs sm:text-sm font-bold text-white truncate">
                      {activeChannel === 'unsc' && 'unsc-security-council'}
                      {activeChannel === 'announcements' && 'announcements'}
                      {activeChannel === 'lounge' && 'delegates-lounge'}
                    </h4>
                    <span className="hidden sm:inline-flex items-center px-1.5 py-0.2 rounded text-[9px] font-mono text-blue-300 bg-blue-500/10 border border-blue-500/20">
                      SESSION III
                    </span>
                  </div>
                  <p className="text-[11px] text-neutral-400 truncate">
                    Agenda: Maritime Sovereignty in Strategic Corridors • Formal Debate
                  </p>
                </div>
              </div>

              {/* Decorative Control Icons */}
              <div className="flex items-center gap-2 text-neutral-400">
                <div className="p-1 rounded hover:bg-white/5 cursor-default hidden sm:block">
                  <Pin className="w-3.5 h-3.5" />
                </div>
                <div className="p-1 rounded hover:bg-white/5 cursor-default">
                  <Search className="w-3.5 h-3.5" />
                </div>
                <div className="p-1 rounded hover:bg-white/5 cursor-default">
                  <MoreVertical className="w-3.5 h-3.5" />
                </div>
              </div>
            </div>

            {/* Conversation Stream */}
            <div className="p-4 sm:p-5 space-y-4 overflow-y-auto max-h-[360px] no-scrollbar">
              {/* Pinned Executive Board Dispatch */}
              <div className="p-3 sm:p-3.5 rounded-xl bg-blue-950/30 border border-blue-500/30 space-y-1.5">
                <div className="flex items-center justify-between gap-2">
                  <div className="flex items-center gap-1.5 text-xs font-semibold text-blue-300">
                    <ShieldCheck className="w-3.5 h-3.5 text-blue-400" />
                    <span>Executive Board Moderator (Dias)</span>
                    <span className="text-[9px] font-mono uppercase px-1.5 py-0.5 rounded bg-blue-500/20 text-blue-200">
                      Official Dispatch
                    </span>
                  </div>
                  <span className="text-[10px] font-mono text-neutral-400">13:42 CET</span>
                </div>
                <p className="text-xs sm:text-sm text-neutral-200 leading-relaxed">
                  Working Paper 1.4 has been formally tabled for introduction. Draft resolutions open for signatory submission at 14:00 CET. All sponsors please align amendments in the working caucus thread.
                </p>
              </div>

              {/* Delegate Message 1: France */}
              <div className="flex items-start gap-3">
                <div className="w-7 h-7 rounded-full bg-blue-700/80 flex items-center justify-center text-[10px] font-bold text-white shrink-0 mt-0.5">
                  FR
                </div>
                <div className="space-y-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-bold text-white">Delegate of France</span>
                    <span className="text-[9px] font-mono text-neutral-400">13:45</span>
                  </div>
                  <p className="text-xs sm:text-sm text-neutral-300 leading-relaxed">
                    The Delegation of France moves for a 15-minute moderated caucus on clause 4b regarding guaranteed humanitarian passage corridors.
                  </p>
                </div>
              </div>

              {/* Delegate Message 2: Japan */}
              <div className="flex items-start gap-3">
                <div className="w-7 h-7 rounded-full bg-rose-700/80 flex items-center justify-center text-[10px] font-bold text-white shrink-0 mt-0.5">
                  JP
                </div>
                <div className="space-y-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-bold text-white">Delegate of Japan</span>
                    <span className="text-[9px] font-mono text-neutral-400">13:47</span>
                  </div>
                  <p className="text-xs sm:text-sm text-neutral-300 leading-relaxed">
                    Japan seconds the motion. Co-sponsors are gathering at caucus table 2 to align on the technical annex language.
                  </p>
                </div>
              </div>

              {/* Status Pill: Draft Resolution Status */}
              <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-lg bg-white/[0.04] border border-white/10 text-xs text-neutral-300">
                <FileText className="w-3.5 h-3.5 text-blue-400" />
                <span className="font-mono text-white">Draft Resolution 1.4</span>
                <span className="text-neutral-400">•</span>
                <span className="text-neutral-400">12 Signatories Verified</span>
                <span className="text-neutral-400">•</span>
                <span className="text-blue-300 font-mono text-[11px]">In Deliberation</span>
              </div>
            </div>

            {/* Input Bar Preview (Disabled / Mockup) */}
            <div className="p-3 sm:p-4 bg-[#080b15] border-t border-white/10 select-none">
              <div className="p-2 sm:p-2.5 rounded-xl bg-white/[0.03] border border-white/10 flex items-center justify-between gap-3 text-neutral-400">
                <div className="flex items-center gap-2 text-xs truncate">
                  <span className="text-neutral-500">Message #unsc-security-council...</span>
                </div>
                <div className="flex items-center gap-2 shrink-0">
                  <Paperclip className="w-4 h-4 text-neutral-400" />
                  <Smile className="w-4 h-4 text-neutral-400 hidden sm:block" />
                  <div className="w-6 h-6 rounded-lg bg-blue-600/30 text-blue-400 flex items-center justify-center">
                    <Send className="w-3 h-3" />
                  </div>
                </div>
              </div>
              <div className="mt-2 flex items-center justify-between text-[10px] font-mono text-neutral-400">
                <span>PREVIEW ONLY • REAL-TIME MESH UNDER ACTIVE DEVELOPMENT</span>
                <span className="hidden sm:inline">END-TO-END VERIFIED COMMITTEE CHANNELS</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
