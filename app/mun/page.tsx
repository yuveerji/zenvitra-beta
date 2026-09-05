'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { 
  Crown, 
  Radio, 
  Users, 
  Scale, 
  Layers, 
  Sparkles, 
  ExternalLink, 
  ArrowRight, 
  ShieldCheck, 
  FileText, 
  CheckCircle2,
  Building,
  Award,
  Search,
  Grid,
  MapPin,
  Calendar,
  Filter,
  DollarSign,
  Briefcase,
  SlidersHorizontal,
  Flame,
  Globe2,
  Zap,
  BookOpen,
  QrCode,
  TrendingUp,
  AlertTriangle,
  Bot,
  Compass,
  Check,
  ChevronRight,
  Gavel,
  History,
  Vote,
  FileCheck2,
  Share2,
  MessageSquare,
  Lock
} from 'lucide-react';
import { Navbar } from '@/components/layout/Navbar';
import { Footer } from '@/components/layout/Footer';
import { ZENMUN_2026_MASTER } from '@/lib/conferenceData';

type MunModuleTab = 
  | 'ALL'
  | 'DISCOVER'
  | 'CONFERENCE'
  | 'REGISTER'
  | 'MATRIX'
  | 'COMMAND'
  | 'LEGISLATE'
  | 'CRISIS'
  | 'SCORE'
  | 'CERTIFY'
  | 'PORTFOLIO'
  | 'ANALYTICS';

export default function ZenMunPortalPage() {
  const [activeModule, setActiveModule] = useState<MunModuleTab>('ALL');
  const [isSearchLayoverOpen, setIsSearchLayoverOpen] = useState<boolean>(false);
  const [layoverSearchInput, setLayoverSearchInput] = useState<string>('');
  const [selectedLayoverCommittee, setSelectedLayoverCommittee] = useState<string>('ALL');
  const [selectedLayoverMode, setSelectedLayoverMode] = useState<string>('ALL');

  return (
    <div className="min-h-screen bg-[#030407] text-neutral-300 flex flex-col justify-between font-sans selection:bg-cyan-500/30 pt-20 sm:pt-24">
      <Navbar />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 w-full space-y-12 text-left">
        
        {/* ─── 1. SOVEREIGN OS HERO SECTION ─── */}
        <div className="p-8 sm:p-12 rounded-3xl bg-gradient-to-r from-[#0a0d18] via-[#05070c] to-black border border-cyan-500/30 relative overflow-hidden shadow-[0_20px_70px_rgba(0,0,0,0.8)] space-y-8">
          <div className="absolute top-0 right-0 w-96 h-96 bg-cyan-500/10 blur-[140px] pointer-events-none rounded-full" />
          <div className="absolute bottom-0 left-1/3 w-80 h-80 bg-purple-500/10 blur-[130px] pointer-events-none rounded-full" />
          
          <div className="space-y-3 relative z-10">
            <div className="flex flex-wrap items-center gap-2">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-500/10 border border-cyan-500/30 text-cyan-400 font-mono text-[10px] uppercase font-bold tracking-wider">
                <Crown className="w-3.5 h-3.5 text-cyan-400" />
                <span>ZEN.MUN OPERATING SYSTEM &bull; 14 INTEGRATED MODULES</span>
              </div>
              <span className="px-2.5 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 text-[10px] font-mono font-bold flex items-center gap-1">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                <span>LIVE SOVEREIGN MESH</span>
              </span>
            </div>

            <h1 className="text-3xl sm:text-5xl lg:text-6xl font-black font-display text-white tracking-tight leading-tight">
              THE COMPLETE OPERATING SYSTEM FOR MODEL UNITED NATIONS &amp; PARLIAMENTARY SIMULATIONS
            </h1>
            
            <p className="text-sm sm:text-base text-neutral-300 max-w-4xl leading-relaxed font-sans">
              From discovery and registrations to automated country matrices, live dais chairing, continuous crisis engines, Westminster bill drafting, private EB scoring rubrics, and QR-verifiable portfolios. Everything happens inside <strong>ZEN.MUN</strong>.
            </p>
          </div>

          {/* Quick Metrics Banner */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-2 relative z-10 border-t border-white/10">
            <div className="p-3.5 rounded-2xl bg-white/[0.02] border border-white/5">
              <span className="text-[10px] font-mono text-neutral-400 uppercase block">Active Delegates</span>
              <span className="text-xl sm:text-2xl font-black text-white font-mono">{ZENMUN_2026_MASTER.stats.totalDelegates}</span>
              <span className="text-[9px] text-emerald-400 font-mono block mt-0.5">93% Checked-In Live</span>
            </div>
            <div className="p-3.5 rounded-2xl bg-white/[0.02] border border-white/5">
              <span className="text-[10px] font-mono text-neutral-400 uppercase block">Live Chambers</span>
              <span className="text-xl sm:text-2xl font-black text-cyan-400 font-mono">5 Committees</span>
              <span className="text-[9px] text-neutral-400 font-mono block mt-0.5">UNSC, UNHRC, Lok Sabha...</span>
            </div>
            <div className="p-3.5 rounded-2xl bg-white/[0.02] border border-white/5">
              <span className="text-[10px] font-mono text-neutral-400 uppercase block">Resolutions &amp; Bills</span>
              <span className="text-xl sm:text-2xl font-black text-amber-400 font-mono">{ZENMUN_2026_MASTER.stats.documentsSubmitted} Drafted</span>
              <span className="text-[9px] text-neutral-400 font-mono block mt-0.5">Cryptographically Sealed</span>
            </div>
            <div className="p-3.5 rounded-2xl bg-white/[0.02] border border-white/5">
              <span className="text-[10px] font-mono text-neutral-400 uppercase block">Chamber Access</span>
              <span className="text-xl sm:text-2xl font-black text-emerald-400 font-mono">100% Free</span>
              <span className="text-[9px] text-neutral-400 font-mono block mt-0.5">For All Students &amp; Dais</span>
            </div>
          </div>

          {/* 3 Primary Action Doorways */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-2 relative z-10">
            <Link
              href="/committee"
              className="p-5 rounded-2xl bg-cyan-500/10 hover:bg-cyan-500/20 border border-cyan-500/40 text-left space-y-2.5 transition group cursor-pointer shadow-[0_0_30px_rgba(6,182,212,0.15)]"
            >
              <div className="flex items-center justify-between">
                <div className="p-2.5 rounded-xl bg-cyan-500 text-black font-bold">
                  <Radio className="w-5 h-5 text-black animate-pulse" />
                </div>
                <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 font-bold">
                  LIVE DAIS FLOOR
                </span>
              </div>
              <div>
                <h3 className="text-base font-bold text-white group-hover:text-cyan-300 transition flex items-center gap-1.5">
                  <span>Enter Chamber Console</span>
                  <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition" />
                </h3>
                <p className="text-xs text-neutral-400 mt-1 font-sans leading-relaxed">
                  Join the live committee floor: GSL queues, speaker timers, caucus proposals, and roll-call voting.
                </p>
              </div>
            </Link>

            <Link
              href="/mun/conference"
              className="p-5 rounded-2xl bg-purple-500/10 hover:bg-purple-500/20 border border-purple-500/30 text-left space-y-2.5 transition group cursor-pointer"
            >
              <div className="flex items-center justify-between">
                <div className="p-2.5 rounded-xl bg-purple-600 text-white font-bold">
                  <Layers className="w-5 h-5 text-white" />
                </div>
                <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-purple-500/20 text-purple-300 font-bold">
                  SECRETARIAT COMMAND
                </span>
              </div>
              <div>
                <h3 className="text-base font-bold text-white group-hover:text-purple-300 transition flex items-center gap-1.5">
                  <span>Secretariat Command Suite</span>
                  <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition" />
                </h3>
                <p className="text-xs text-neutral-400 mt-1 font-sans leading-relaxed">
                  Country matrix allocations, reception QR check-in scanner, financial ledger, and emergency broadcasts.
                </p>
              </div>
            </Link>

            <Link
              href="/docs"
              className="p-5 rounded-2xl bg-amber-500/10 hover:bg-amber-500/20 border border-amber-500/30 text-left space-y-2.5 transition group cursor-pointer"
            >
              <div className="flex items-center justify-between">
                <div className="p-2.5 rounded-xl bg-amber-500 text-black font-bold">
                  <Scale className="w-5 h-5 text-black" />
                </div>
                <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-amber-500/20 text-amber-300 font-bold">
                  ZEN.DOCS &amp; LEGISLATE
                </span>
              </div>
              <div>
                <h3 className="text-base font-bold text-white group-hover:text-amber-300 transition flex items-center gap-1.5">
                  <span>Legislative Drafting Studio</span>
                  <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition" />
                </h3>
                <p className="text-xs text-neutral-400 mt-1 font-sans leading-relaxed">
                  Draft UN Resolutions with structured preambles or craft Indian Parliamentary Bills with auto-numbering.
                </p>
              </div>
            </Link>
          </div>
        </div>

        {/* ─── 2. THE 14-MODULE ARCHITECTURE NAVIGATION PILLS ─── */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-xl font-bold font-display text-white">ZEN.MUN Operating System Modules</h2>
              <p className="text-xs text-neutral-400 font-mono">Select a module below to inspect its live software architecture.</p>
            </div>
            <span className="hidden sm:inline text-xs font-mono text-cyan-400">14 Core Systems Available</span>
          </div>

          <div className="flex flex-wrap gap-2 text-xs font-mono">
            {[
              { id: 'ALL', label: 'All Modules', icon: Sparkles },
              { id: 'DISCOVER', label: '1. Discover 🔍', icon: Search },
              { id: 'CONFERENCE', label: '2. Conference 🏢', icon: Building },
              { id: 'REGISTER', label: '3. Register 📝', icon: FileText },
              { id: 'MATRIX', label: '4. Matrix 🧩', icon: Grid },
              { id: 'COMMAND', label: '5. Command 🏛️', icon: Radio },
              { id: 'LEGISLATE', label: '6. Legislate ⚖️', icon: Gavel },
              { id: 'CRISIS', label: '7. Crisis 🌍', icon: Globe2 },
              { id: 'SCORE', label: '8. Score & Rubric 📊', icon: TrendingUp },
              { id: 'CERTIFY', label: '9. Certify 📜', icon: QrCode },
              { id: 'PORTFOLIO', label: '10. Portfolio 👤', icon: Briefcase },
              { id: 'ANALYTICS', label: '11. Analytics 📈', icon: SlidersHorizontal }
            ].map((tab) => {
              const Icon = tab.icon;
              const isActive = activeModule === tab.id;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveModule(tab.id as MunModuleTab)}
                  className={`px-3.5 py-1.5 rounded-xl border transition cursor-pointer flex items-center gap-1.5 ${
                    isActive 
                      ? 'bg-cyan-500 text-black font-bold border-cyan-400 shadow-[0_0_15px_rgba(6,182,212,0.4)]'
                      : 'bg-white/[0.03] hover:bg-white/[0.08] text-neutral-300 border-white/10'
                  }`}
                >
                  <Icon className="w-3.5 h-3.5" />
                  <span>{tab.label}</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* ─── 3. DYNAMIC MODULE PANELS ─── */}

        {/* MODULE: DISCOVER 🔍 */}
        {(activeModule === 'ALL' || activeModule === 'DISCOVER') && (
          <div className="p-6 sm:p-8 rounded-3xl bg-gradient-to-r from-[#0a0d18] via-[#05070c] to-black border border-cyan-500/30 space-y-6 relative overflow-hidden">
            <div className="absolute top-0 right-0 w-80 h-80 bg-cyan-500/5 blur-[120px] pointer-events-none rounded-full" />
            
            <div className="flex flex-wrap items-center justify-between gap-4 border-b border-white/10 pb-4 relative z-10">
              <div className="space-y-1 max-w-2xl">
                <div className="flex items-center gap-2">
                  <div className="p-1.5 rounded-lg bg-cyan-500/20 text-cyan-300">
                    <Search className="w-4 h-4" />
                  </div>
                  <h3 className="text-xl font-bold font-display text-white">ZEN.MUN DISCOVER — Sovereign Conference Search in Events</h3>
                </div>
                <p className="text-xs text-neutral-400 font-mono">
                  All active student Model UN conferences, regional assemblies, and high-school/collegiate summits are centrally cataloged and registered inside the ZENVITRA Events Hub.
                </p>
              </div>

              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => setIsSearchLayoverOpen(true)}
                  className="px-4 py-2 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-black font-mono text-xs font-bold transition flex items-center gap-2 shadow-[0_0_20px_rgba(6,182,212,0.3)] cursor-pointer"
                >
                  <Search className="w-3.5 h-3.5 text-black" />
                  <span>Search MUNs in Events</span>
                </button>
                <Link
                  href="/events?from=mun"
                  className="px-4 py-2 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-neutral-300 hover:text-white font-mono text-xs font-bold transition flex items-center gap-1.5"
                >
                  <Lock className="w-3 h-3 text-amber-400" />
                  <span>Go to Events Hub</span>
                  <ExternalLink className="w-3.5 h-3.5 text-cyan-400" />
                </Link>
              </div>
            </div>

            {/* Interactive Search Bar Launcher */}
            <div className="p-5 rounded-2xl bg-black/60 border border-white/10 space-y-4 relative z-10">
              <div className="flex flex-col sm:flex-row gap-2">
                <div 
                  onClick={() => setIsSearchLayoverOpen(true)}
                  className="flex-1 flex items-center gap-2.5 px-4 py-3 rounded-xl bg-white/[0.03] border border-white/10 hover:border-cyan-500/40 text-neutral-400 cursor-pointer transition"
                >
                  <Search className="w-4 h-4 text-cyan-400 shrink-0" />
                  <span className="text-xs font-mono truncate">Click to search MUNs by name, council, city, or committee...</span>
                  <span className="ml-auto hidden sm:inline px-1.5 py-0.5 rounded text-[9px] font-mono bg-white/10 text-neutral-400 border border-white/10">Layover Search</span>
                </div>

                <button
                  type="button"
                  onClick={() => setIsSearchLayoverOpen(true)}
                  className="px-5 py-3 rounded-xl bg-cyan-500/10 hover:bg-cyan-500/20 border border-cyan-500/30 text-cyan-300 font-mono text-xs font-bold transition cursor-pointer shrink-0"
                >
                  Open Layover Search
                </button>
              </div>

              {/* Quick Jump Tags */}
              <div className="space-y-1.5">
                <span className="text-[10px] font-mono text-neutral-500 uppercase tracking-wider block">Popular Categories in Events (Login Required):</span>
                <div className="flex flex-wrap gap-1.5 text-xs font-mono">
                  {[
                    { label: 'All MUN Summits', href: '/events?from=mun' },
                    { label: 'UN Security Council (UNSC)', href: '/events?search=UNSC&from=mun' },
                    { label: 'Lok Sabha & Parliamentary', href: '/events?search=Lok%20Sabha&from=mun' },
                    { label: 'All India Political Parties (AIPPM)', href: '/events?search=AIPPM&from=mun' },
                    { label: 'Continuous Crisis (CCC)', href: '/events?search=Crisis&from=mun' },
                    { label: 'Hybrid & Online MUNs', href: '/events?search=Online&from=mun' },
                    { label: 'Free Student Entry', href: '/events?search=Free&from=mun' }
                  ].map((cat) => (
                    <Link
                      key={cat.label}
                      href={cat.href}
                      className="px-2.5 py-1 rounded-lg bg-white/[0.02] hover:bg-cyan-500/10 border border-white/5 hover:border-cyan-500/30 text-neutral-400 hover:text-cyan-300 text-[11px] transition flex items-center gap-1"
                    >
                      <span>{cat.label}</span>
                      <ArrowRight className="w-2.5 h-2.5" />
                    </Link>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* MODULE: LEGISLATE ⚖️ (THE COMPLETE PARLIAMENTARY & BILL DRAFTING POWERHOUSE) */}
        {(activeModule === 'ALL' || activeModule === 'LEGISLATE') && (
          <div className="p-6 sm:p-8 rounded-3xl bg-gradient-to-br from-[#0c0d18] via-[#090b14] to-[#04050a] border border-amber-500/30 space-y-6">
            <div className="flex flex-wrap items-center justify-between gap-3 border-b border-white/10 pb-4">
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <div className="p-1.5 rounded-lg bg-amber-500/20 text-amber-300">
                    <Gavel className="w-4 h-4" />
                  </div>
                  <h3 className="text-xl font-bold font-display text-white">ZEN.LEGISLATE — Parliamentary Bill Drafting &amp; Legislative Engine</h3>
                </div>
                <p className="text-xs text-neutral-400 font-mono">
                  Draft, debate, amend, and enact statutory legislation for Lok Sabha, Rajya Sabha, AIPPM, Westminster Parliament, and Constituent Assemblies.
                </p>
              </div>

              <Link
                href="/docs"
                className="px-4 py-2 rounded-xl bg-amber-500 hover:bg-amber-400 text-black font-mono text-xs font-bold transition flex items-center gap-1.5 shadow-[0_0_20px_rgba(245,158,11,0.3)]"
              >
                <Scale className="w-3.5 h-3.5 text-black" />
                <span>Launch Legislative Studio</span>
                <ArrowRight className="w-3.5 h-3.5 text-black" />
              </Link>
            </div>

            {/* Legislative Workflow Pipeline */}
            <div className="p-4 rounded-2xl bg-black/50 border border-white/5 space-y-2">
              <span className="text-[10px] font-mono text-amber-400 uppercase font-bold tracking-wider block">
                7-Stage Parliamentary Legislative Pipeline:
              </span>
              <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-7 gap-2 text-center text-xs font-mono">
                {[
                  { step: '1. Proposal', desc: 'Member Bill Draft', icon: FileText },
                  { step: '2. 1st Reading', desc: 'Formal Introduction', icon: BookOpen },
                  { step: '3. Committee', desc: 'Detailed Scrutiny', icon: Users },
                  { step: '4. Amendments', desc: 'Friendly / Unfriendly', icon: History },
                  { step: '5. 2nd Reading', desc: 'Clause-by-Clause', icon: MessageSquare },
                  { step: '6. 3rd Reading', desc: 'Final Chamber Vote', icon: Vote },
                  { step: '7. Gazette', desc: 'Enacted Statute', icon: FileCheck2 },
                ].map((s, idx) => {
                  const SIcon = s.icon;
                  return (
                    <div key={s.step} className="p-2.5 rounded-xl bg-white/[0.02] border border-white/5 space-y-1">
                      <div className="w-5 h-5 rounded-full bg-amber-500/20 text-amber-300 flex items-center justify-center mx-auto text-[10px] font-bold">
                        {idx + 1}
                      </div>
                      <span className="font-bold text-white block text-[11px]">{s.step}</span>
                      <span className="text-[9px] text-neutral-400 block">{s.desc}</span>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Legislative Capabilities Showcase */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs font-mono">
              <div className="p-4 rounded-2xl bg-white/[0.02] border border-white/5 space-y-2">
                <span className="text-amber-400 font-bold uppercase text-[11px] block">🔢 Smart Auto-Numbering Engine</span>
                <p className="text-neutral-400 leading-relaxed font-sans text-xs">
                  Never manually renumber clauses again. Chapters, Sections (1, 2, 3), Subsections (1, 2), Clauses (a, b, c), and Subclauses (i, ii) dynamically adjust as amendments pass.
                </p>
              </div>
              <div className="p-4 rounded-2xl bg-white/[0.02] border border-white/5 space-y-2">
                <span className="text-purple-400 font-bold uppercase text-[11px] block">⚖️ Amendment &amp; Redline Docket</span>
                <p className="text-neutral-400 leading-relaxed font-sans text-xs">
                  Propose Modify, Insert, Delete, or Substitute amendments. Visual green/red diff comparison and quorum voting tracking before merging into the main bill.
                </p>
              </div>
              <div className="p-4 rounded-2xl bg-white/[0.02] border border-white/5 space-y-2">
                <span className="text-cyan-400 font-bold uppercase text-[11px] block">📜 Constituent Assembly Mode</span>
                <p className="text-neutral-400 leading-relaxed font-sans text-xs">
                  Draft Articles of the Constitution live during debate. Passed articles automatically assemble into a ratified sovereign document archive.
                </p>
              </div>
            </div>
          </div>
        )}

        {/* MODULE: COMMAND & COMMITTEES 🏛️ */}
        {(activeModule === 'ALL' || activeModule === 'COMMAND') && (
          <div className="p-6 sm:p-8 rounded-3xl bg-[#0b0e17] border border-purple-500/20 space-y-6">
            <div className="flex flex-wrap items-center justify-between gap-3 border-b border-white/10 pb-4">
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <div className="p-1.5 rounded-lg bg-purple-500/20 text-purple-300">
                    <Radio className="w-4 h-4 animate-pulse" />
                  </div>
                  <h3 className="text-xl font-bold font-display text-white">ZEN.MUN COMMAND — Dais Live Chamber Operating System</h3>
                </div>
                <p className="text-xs text-neutral-400 font-mono">
                  The Executive Board's digital command console: session modes, roll calls, GSL queues, speaker timers, and projector feed.
                </p>
              </div>

              <Link
                href="/committee"
                className="px-4 py-2 rounded-xl bg-purple-600 hover:bg-purple-500 text-white font-mono text-xs font-bold transition flex items-center gap-1.5 shadow-lg shadow-purple-600/30"
              >
                <span>Enter Live Dais</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>

            {/* Active Committee Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {ZENMUN_2026_MASTER.committees.map((c) => (
                <div
                  key={c.id}
                  className="p-5 rounded-2xl bg-white/[0.02] border border-white/10 hover:border-purple-500/40 transition space-y-3 text-left group"
                >
                  <div className="flex items-center justify-between">
                    <span className="px-2 py-0.5 rounded-full text-[10px] font-mono font-bold bg-purple-500/15 text-purple-300 border border-purple-500/30">
                      {c.shortName}
                    </span>
                    <span className="px-2 py-0.5 rounded-full text-[9px] font-mono font-bold bg-emerald-500/15 text-emerald-400 flex items-center gap-1">
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-ping" />
                      <span>{c.status}</span>
                    </span>
                  </div>

                  <div>
                    <h4 className="font-bold text-white text-sm group-hover:text-purple-300 transition">{c.name}</h4>
                    <p className="text-[11px] text-neutral-400 font-mono mt-0.5">{c.room} &bull; {c.chairName}</p>
                  </div>

                  <div className="p-2.5 rounded-xl bg-black/60 border border-white/5 space-y-1 text-xs font-mono">
                    <span className="text-[9px] text-neutral-500 uppercase block">Active Debate:</span>
                    <p className="text-neutral-300 text-[11px] truncate font-semibold">{c.currentSession}</p>
                  </div>

                  <div className="pt-2 flex items-center justify-between border-t border-white/5">
                    <span className="text-[11px] text-neutral-400 font-mono">{c.totalDelegates} Delegates</span>
                    <Link
                      href={`/committee?chamber=${c.id}`}
                      className="px-3 py-1 rounded-lg bg-purple-600 hover:bg-purple-500 text-white font-mono text-xs font-bold transition flex items-center gap-1"
                    >
                      <span>Join Chamber</span>
                      <ExternalLink className="w-3 h-3" />
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* MODULE: MATRIX, REGISTER & SCORE (3 KEY ENGINES) */}
        {(activeModule === 'ALL' || activeModule === 'MATRIX' || activeModule === 'SCORE' || activeModule === 'REGISTER') && (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            
            {/* 1. Delegate Matrix */}
            <div className="p-6 rounded-3xl bg-[#0b0e17] border border-cyan-500/20 space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Grid className="w-4 h-4 text-cyan-400" />
                  <h4 className="font-bold text-white text-base">4. Sovereign Matrix</h4>
                </div>
                <span className="px-2 py-0.5 rounded text-[9px] font-mono bg-cyan-500/10 text-cyan-300 font-bold">AUTOMATED</span>
              </div>
              <p className="text-xs text-neutral-400 font-sans leading-relaxed">
                Drag-and-drop allocations with automated conflict detection: duplicate country alerts, committee capacity warnings, and payment state synchronization.
              </p>
              <div className="p-3 rounded-xl bg-black/60 border border-white/5 space-y-1 text-xs font-mono">
                <div className="flex justify-between text-neutral-400">
                  <span>Total Portfolios:</span>
                  <span className="text-white font-bold">486 / 500</span>
                </div>
                <div className="flex justify-between text-neutral-400">
                  <span>Conflict Status:</span>
                  <span className="text-emerald-400 font-bold">0 Conflicts Detected</span>
                </div>
              </div>
              <Link
                href="/mun/conference"
                className="w-full py-2 rounded-xl bg-white/5 hover:bg-white/10 text-neutral-300 hover:text-white font-mono text-xs font-bold transition flex items-center justify-center gap-1"
              >
                <span>Open Matrix Manager</span>
                <ArrowRight className="w-3 h-3" />
              </Link>
            </div>

            {/* 2. Registration Pipeline */}
            <div className="p-6 rounded-3xl bg-[#0b0e17] border border-purple-500/20 space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <FileText className="w-4 h-4 text-purple-400" />
                  <h4 className="font-bold text-white text-base">3. Register Pipeline</h4>
                </div>
                <span className="px-2 py-0.5 rounded text-[9px] font-mono bg-purple-500/10 text-purple-300 font-bold">KANBAN</span>
              </div>
              <p className="text-xs text-neutral-400 font-sans leading-relaxed">
                Replaces messy Google Forms. Multi-tier application pipeline: Pending &rarr; Review &rarr; Accepted &rarr; Waitlisted with conditional questions and ticket categories.
              </p>
              <div className="grid grid-cols-3 gap-1.5 text-center text-[10px] font-mono">
                <div className="p-2 rounded-lg bg-amber-500/10 text-amber-300 font-bold">24 Pending</div>
                <div className="p-2 rounded-lg bg-cyan-500/10 text-cyan-300 font-bold">12 Review</div>
                <div className="p-2 rounded-lg bg-emerald-500/10 text-emerald-300 font-bold">450 Accepted</div>
              </div>
              <Link
                href="/mun/conference"
                className="w-full py-2 rounded-xl bg-white/5 hover:bg-white/10 text-neutral-300 hover:text-white font-mono text-xs font-bold transition flex items-center justify-center gap-1"
              >
                <span>Manage Registrations</span>
                <ArrowRight className="w-3 h-3" />
              </Link>
            </div>

            {/* 3. EB Scoring & Rubric */}
            <div className="p-6 rounded-3xl bg-[#0b0e17] border border-amber-500/20 space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <TrendingUp className="w-4 h-4 text-amber-400" />
                  <h4 className="font-bold text-white text-base">8. ZEN.SCORE Rubrics</h4>
                </div>
                <span className="px-2 py-0.5 rounded text-[9px] font-mono bg-amber-500/10 text-amber-300 font-bold">PRIVATE EB</span>
              </div>
              <p className="text-xs text-neutral-400 font-sans leading-relaxed">
                Standardized 5-pillar rubric (Speaking, Content, Diplomacy, Documentation, Procedure). Executive Board maintains final human judgment override with audit notes.
              </p>
              <div className="p-3 rounded-xl bg-black/60 border border-white/5 space-y-1 text-xs font-mono">
                <div className="flex justify-between text-neutral-400">
                  <span>Scored Delegates:</span>
                  <span className="text-white font-bold">486 / 486 (100%)</span>
                </div>
                <div className="flex justify-between text-neutral-400">
                  <span>Award Locking:</span>
                  <span className="text-purple-400 font-bold">Awaiting Dais Seal</span>
                </div>
              </div>
              <Link
                href="/mun/conference"
                className="w-full py-2 rounded-xl bg-white/5 hover:bg-white/10 text-neutral-300 hover:text-white font-mono text-xs font-bold transition flex items-center justify-center gap-1"
              >
                <span>View Evaluation Suite</span>
                <ArrowRight className="w-3 h-3" />
              </Link>
            </div>
          </div>
        )}

        {/* MODULE: CERTIFY & PORTFOLIO 📜👤 */}
        {(activeModule === 'ALL' || activeModule === 'CERTIFY' || activeModule === 'PORTFOLIO') && (
          <div className="p-6 sm:p-8 rounded-3xl bg-gradient-to-r from-[#0a0d18] via-[#05070c] to-black border border-emerald-500/30 space-y-6">
            <div className="flex flex-wrap items-center justify-between gap-3 border-b border-white/10 pb-4">
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <div className="p-1.5 rounded-lg bg-emerald-500/20 text-emerald-300">
                    <QrCode className="w-4 h-4" />
                  </div>
                  <h3 className="text-xl font-bold font-display text-white">ZEN.CERTIFY &amp; PORTFOLIO — Verified Diplomatic Identity</h3>
                </div>
                <p className="text-xs text-neutral-400 font-mono">
                  Instant QR-code verifiable certificates linking directly to the delegate's permanent Zenvitra career timeline.
                </p>
              </div>

              <span className="px-3 py-1 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/30 text-xs font-mono font-bold">
                🔒 SHA-256 Tamper-Proof
              </span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-center">
              <div className="space-y-3 font-mono text-xs">
                <div className="p-4 rounded-2xl bg-black/60 border border-white/10 space-y-2">
                  <div className="flex items-center justify-between text-neutral-400">
                    <span>Certificate ID:</span>
                    <span className="text-cyan-400 font-bold">CERT-ZEN-2026-0486</span>
                  </div>
                  <div className="flex items-center justify-between text-neutral-400">
                    <span>Award Classification:</span>
                    <span className="text-amber-400 font-bold">Best Delegate (UNSC)</span>
                  </div>
                  <div className="flex items-center justify-between text-neutral-400">
                    <span>Cryptographic Seal:</span>
                    <span className="text-emerald-400 truncate max-w-[200px]">0x8f3c2b1a99d45e0287cb...</span>
                  </div>
                </div>

                <p className="text-neutral-400 text-xs font-sans leading-relaxed">
                  When scanned by universities, employers, or conference secretariats, the certificate independently validates attendance, speeches delivered, and verified awards.
                </p>
              </div>

              <div className="p-6 rounded-2xl bg-gradient-to-b from-cyan-950/40 via-black/60 to-black/80 border border-cyan-500/30 flex flex-col justify-between space-y-4 shadow-xl">
                <div className="flex items-center justify-between pb-3 border-b border-cyan-500/20">
                  <div className="flex items-center gap-2">
                    <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse" />
                    <span className="text-xs font-mono font-bold text-white uppercase tracking-wider">Verified Sovereign Credential</span>
                  </div>
                  <span className="text-[10px] font-mono text-cyan-400 bg-cyan-950/80 px-2 py-0.5 rounded-md border border-cyan-500/30">
                    LIVE REGISTRY
                  </span>
                </div>

                <div className="space-y-2 py-1">
                  <div className="flex items-center justify-between text-xs font-mono">
                    <span className="text-neutral-400">Issuer Authority:</span>
                    <span className="text-white font-bold">UN Secretariat & Zenvitra High Council</span>
                  </div>
                  <div className="flex items-center justify-between text-xs font-mono">
                    <span className="text-neutral-400">Protocol Validation:</span>
                    <span className="text-emerald-400 font-bold flex items-center gap-1">
                      <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                      100% Cryptographically Bound
                    </span>
                  </div>
                  <div className="flex items-center justify-between text-xs font-mono">
                    <span className="text-neutral-400">Merkle Root:</span>
                    <span className="text-neutral-300 font-mono text-[11px]">sha256:7f83b165...49a1</span>
                  </div>
                </div>

                <div className="pt-2 border-t border-white/10 flex items-center justify-between gap-3">
                  <Link
                    href="/cert/verify?id=CERT-ZEN-2026-0486"
                    className="flex-1 py-2 px-3 rounded-xl bg-cyan-500/20 hover:bg-cyan-500/30 border border-cyan-400/40 text-cyan-300 text-xs font-mono font-bold text-center transition flex items-center justify-center gap-1.5 cursor-pointer"
                  >
                    <FileCheck2 className="w-3.5 h-3.5 text-cyan-400" />
                    <span>Verify Live Record</span>
                  </Link>
                  <button
                    type="button"
                    onClick={() => {
                      if (typeof navigator !== 'undefined' && navigator.clipboard) {
                        navigator.clipboard.writeText(`${window.location.origin}/cert/verify?id=CERT-ZEN-2026-0486`);
                        alert('Certificate verification link copied to clipboard!');
                      }
                    }}
                    className="p-2 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-neutral-300 hover:text-white transition cursor-pointer"
                    title="Copy verification link"
                  >
                    <Share2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* ─── LAYOVER SEARCH MODAL FOR MUNs IN EVENTS ─── */}
        {isSearchLayoverOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
            <div className="w-full max-w-2xl rounded-3xl bg-[#0b0e17] border border-cyan-500/30 p-6 sm:p-8 space-y-6 shadow-2xl relative text-left">
              <div className="flex items-center justify-between border-b border-white/10 pb-4">
                <div className="space-y-1">
                  <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-cyan-500/10 text-cyan-300 font-mono text-[10px] uppercase font-bold">
                    <Search className="w-3 h-3 text-cyan-400" />
                    <span>EVENTS HUB LAYOVER SEARCH</span>
                  </div>
                  <h3 className="text-xl font-bold font-display text-white">Search Model UNs in Events</h3>
                </div>
                <button
                  type="button"
                  onClick={() => setIsSearchLayoverOpen(false)}
                  className="p-2 rounded-xl bg-white/5 hover:bg-white/10 text-neutral-400 hover:text-white cursor-pointer transition"
                >
                  ✕
                </button>
              </div>

              {/* Search Input */}
              <div className="space-y-4">
                <div className="flex items-center gap-3 px-4 py-3 rounded-2xl bg-black/70 border border-cyan-500/40 focus-within:border-cyan-400 shadow-inner">
                  <Search className="w-5 h-5 text-cyan-400 shrink-0" />
                  <input
                    type="text"
                    autoFocus
                    value={layoverSearchInput}
                    onChange={(e) => setLayoverSearchInput(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter') {
                        setIsSearchLayoverOpen(false);
                        window.location.href = layoverSearchInput.trim() 
                          ? `/events?search=${encodeURIComponent(layoverSearchInput.trim())}&from=mun` 
                          : '/events?from=mun';
                      } else if (e.key === 'Escape') {
                        setIsSearchLayoverOpen(false);
                      }
                    }}
                    placeholder="Type conference name, city (Delhi, Mumbai, Jaipur), or committee..."
                    className="w-full bg-transparent text-sm text-white placeholder:text-neutral-500 focus:outline-none font-sans"
                  />
                  {layoverSearchInput && (
                    <button
                      type="button"
                      onClick={() => setLayoverSearchInput('')}
                      className="text-xs text-neutral-500 hover:text-white font-mono px-1"
                    >
                      Clear
                    </button>
                  )}
                </div>

                {/* Filters */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs font-mono">
                  <div>
                    <label className="text-[10px] text-neutral-500 uppercase block mb-1">Committee Focus</label>
                    <select
                      value={selectedLayoverCommittee}
                      onChange={(e) => setSelectedLayoverCommittee(e.target.value)}
                      className="w-full px-3 py-2 rounded-xl bg-black/60 border border-white/10 text-neutral-300 focus:outline-none focus:border-cyan-400 cursor-pointer"
                    >
                      <option value="ALL">All Committees</option>
                      <option value="UNSC">UN Security Council (UNSC)</option>
                      <option value="UNHRC">Human Rights Council (UNHRC)</option>
                      <option value="Lok Sabha">Lok Sabha / Parliamentary</option>
                      <option value="AIPPM">All India Political Parties (AIPPM)</option>
                      <option value="Crisis">Continuous Crisis Committee</option>
                    </select>
                  </div>

                  <div>
                    <label className="text-[10px] text-neutral-500 uppercase block mb-1">Format / Delivery</label>
                    <select
                      value={selectedLayoverMode}
                      onChange={(e) => setSelectedLayoverMode(e.target.value)}
                      className="w-full px-3 py-2 rounded-xl bg-black/60 border border-white/10 text-neutral-300 focus:outline-none focus:border-cyan-400 cursor-pointer"
                    >
                      <option value="ALL">All Formats (Offline &amp; Online)</option>
                      <option value="Offline">Offline In-Person</option>
                      <option value="Online">Virtual / Online Plenary</option>
                      <option value="Hybrid">Hybrid Session</option>
                    </select>
                  </div>
                </div>

                {/* Events Link Notice */}
                <div className="p-4 rounded-2xl bg-cyan-500/10 border border-cyan-500/20 text-xs font-mono text-neutral-300 flex items-start gap-2.5">
                  <Sparkles className="w-4 h-4 text-cyan-400 shrink-0 mt-0.5" />
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-white block">ZENVITRA Events Network Integration</span>
                      <span className="px-2 py-0.5 rounded bg-amber-500/20 text-amber-300 text-[10px] font-mono font-bold flex items-center gap-1">
                        <Lock className="w-2.5 h-2.5" />
                        <span>Login Required</span>
                      </span>
                    </div>
                    <p className="text-[11px] text-neutral-400 leading-relaxed font-sans">
                      All verified Model UN summits, student delegate registrations, and pass checkouts live inside the <strong>Events Hub</strong> (requires Sovereign login).
                    </p>
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex items-center justify-end gap-3 pt-2 border-t border-white/10">
                <button
                  type="button"
                  onClick={() => setIsSearchLayoverOpen(false)}
                  className="px-4 py-2 rounded-xl bg-white/10 text-neutral-300 hover:text-white text-xs font-mono transition cursor-pointer"
                >
                  Close
                </button>
                <Link
                  href={layoverSearchInput.trim() ? `/events?search=${encodeURIComponent(layoverSearchInput.trim())}&from=mun` : '/events?from=mun'}
                  onClick={() => setIsSearchLayoverOpen(false)}
                  className="px-5 py-2.5 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-black font-mono text-xs font-bold transition flex items-center gap-1.5 cursor-pointer shadow-lg shadow-cyan-500/20"
                >
                  <span>Search in Events Hub</span>
                  <ArrowRight className="w-3.5 h-3.5 text-black" />
                </Link>
              </div>
            </div>
          </div>
        )}

      </main>

      <Footer />
    </div>
  );
}
