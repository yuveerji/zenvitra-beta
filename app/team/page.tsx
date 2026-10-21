'use client';

import React, { useState, useEffect, useMemo } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import {
  Crown,
  Sparkles,
  Users,
  Compass,
  ArrowRight,
  Shield,
  Layers,
  Terminal,
  Zap,
  CheckCircle2,
  ExternalLink,
  ChevronRight,
  Newspaper,
  Search,
  BookOpen,
  Filter,
  Flame,
  Award,
  Globe2,
  FileCheck2,
  Calendar,
  Lock,
  Heart
} from 'lucide-react';
import { Navbar } from '@/components/layout/Navbar';
import { Footer } from '@/components/layout/Footer';
import { TeamMemberCard } from '@/components/team/TeamMemberCard';
import { getCoreTeamMembers, CoreTeamMember, TeamDepartment } from '@/lib/coreTeamData';
import { FounderNoteRenderer } from '@/components/pulse/FounderNoteRenderer';
import { getFounderDirective, DEFAULT_FOUNDER_DIRECTIVE, FounderDirective } from '@/lib/founderControl';

export default function TeamPage() {
  const [selectedDept, setSelectedDept] = useState<string>('All');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [founderDirective, setFounderDirective] = useState<FounderDirective>(DEFAULT_FOUNDER_DIRECTIVE);

  useEffect(() => {
    setFounderDirective(getFounderDirective());
  }, []);

  const allMembers = getCoreTeamMembers();

  const founder = allMembers.find((m) => m.category === 'founder');
  const cofounders = allMembers.filter((m) => m.category === 'cofounder');
  const coreMembers = allMembers.filter((m) => m.category === 'core');

  const departments: { id: string; label: string; icon: React.ElementType }[] = [
    { id: 'All', label: 'All Departments', icon: Users },
    { id: 'Executive', label: 'Executive Council', icon: Crown },
    { id: 'Engineering', label: 'Engineering & Protocols', icon: Terminal },
    { id: 'Secretariat', label: 'Secretariat & MUN', icon: Compass },
    { id: 'Design & Media', label: 'Design & Visuals', icon: Layers },
    { id: 'Press', label: 'Press Bureau', icon: Newspaper },
    { id: 'Operations', label: 'Strategic Operations', icon: Zap },
    { id: 'Impact', label: 'Impact & 10% Principle', icon: Shield },
  ];

  // Count by department
  const getDeptCount = (deptId: string) => {
    if (deptId === 'All') return allMembers.length;
    return allMembers.filter((m) => m.department === deptId).length;
  };

  // Filter core members by department & search query
  const filteredCore = useMemo(() => {
    let list = coreMembers;
    if (selectedDept !== 'All') {
      list = list.filter((m) => m.department === selectedDept);
    }
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase().trim();
      list = list.filter(
        (m) =>
          m.name.toLowerCase().includes(q) ||
          m.role.toLowerCase().includes(q) ||
          m.bio.toLowerCase().includes(q) ||
          m.focusAreas.some((fa) => fa.toLowerCase().includes(q))
      );
    }
    return list;
  }, [coreMembers, selectedDept, searchQuery]);

  // Filter co-founders if Executive or All selected
  const showCofounders = selectedDept === 'All' || selectedDept === 'Executive';
  const filteredCofounders = useMemo(() => {
    if (!showCofounders) return [];
    if (!searchQuery.trim()) return cofounders;
    const q = searchQuery.toLowerCase().trim();
    return cofounders.filter(
      (m) =>
        m.name.toLowerCase().includes(q) ||
        m.role.toLowerCase().includes(q) ||
        m.bio.toLowerCase().includes(q) ||
        m.focusAreas.some((fa) => fa.toLowerCase().includes(q))
    );
  }, [cofounders, showCofounders, searchQuery]);

  return (
    <div className="min-h-screen bg-[#05070c] text-white selection:bg-amber-500/30 selection:text-amber-200">
      <Navbar />

      <main className="relative pt-28 pb-24 overflow-hidden">
        {/* Ambient Atmospheric Glows */}
        <div className="absolute top-10 left-1/2 -translate-x-1/2 w-[1100px] h-[550px] bg-gradient-to-b from-amber-500/10 via-purple-600/5 to-transparent blur-3xl pointer-events-none -z-10" />
        <div className="absolute top-[800px] right-0 w-[600px] h-[600px] bg-cyan-500/5 blur-3xl pointer-events-none -z-10" />
        <div className="absolute top-[1600px] left-0 w-[500px] h-[500px] bg-emerald-500/5 blur-3xl pointer-events-none -z-10" />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-20">
          
          {/* ── 1. SECTION HEADER & SOVEREIGN REGISTRY STATS ── */}
          <div className="text-center max-w-4xl mx-auto space-y-6">
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/5 border border-white/10 text-xs font-mono text-amber-300 shadow-[0_0_20px_rgba(245,158,11,0.15)]">
              <Crown className="w-3.5 h-3.5 text-amber-400" />
              <span>SOVEREIGN LEADERSHIP REGISTRY &bull; GOVERNANCE PORTFOLIOS</span>
            </div>

            <h1 
              className="text-4xl sm:text-6xl lg:text-7xl font-extrabold tracking-tight text-white uppercase leading-[0.98]"
              style={{ fontFamily: 'Clash Display, var(--font-space), sans-serif' }}
            >
              Who&apos;s Your <span className="bg-gradient-to-r from-amber-400 via-orange-300 to-amber-500 bg-clip-text text-transparent">Core Team?</span>
            </h1>

            <p className="text-base sm:text-lg text-zinc-400 leading-relaxed max-w-2xl mx-auto font-sans">
              The architects, diplomats, and protocol engineers building ZENVITRA — from distributed WebSockets and real-time matrix simulation engines to global civic chapters.
            </p>

            {/* Registry Quick-Metrics Grid */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-4 max-w-3xl mx-auto text-left font-mono">
              <div className="p-4 rounded-2xl bg-white/[0.03] border border-white/10">
                <div className="text-[10px] text-zinc-500 uppercase">LEADERSHIP SEATS</div>
                <div className="text-xl sm:text-2xl font-bold text-white mt-1">{allMembers.length} Portfolios</div>
                <div className="text-[10px] text-amber-400/90 mt-0.5">Full Ecosystem Map</div>
              </div>

              <div className="p-4 rounded-2xl bg-white/[0.03] border border-white/10">
                <div className="text-[10px] text-zinc-500 uppercase">FOUNDING COUNCIL</div>
                <div className="text-xl sm:text-2xl font-bold text-indigo-300 mt-1">3 Active Leads</div>
                <div className="text-[10px] text-indigo-400/90 mt-0.5">Yuveer, Khushi &amp; Aarush</div>
              </div>

              <div className="p-4 rounded-2xl bg-white/[0.03] border border-white/10">
                <div className="text-[10px] text-zinc-500 uppercase">OPEN VACANCIES</div>
                <div className="text-xl sm:text-2xl font-bold text-emerald-400 mt-1">
                  {allMembers.filter((m) => m.isVacancy).length} Seats Open
                </div>
                <div className="text-[10px] text-emerald-300/90 mt-0.5">Recruiting for 2026</div>
              </div>

              <div className="p-4 rounded-2xl bg-white/[0.03] border border-white/10">
                <div className="text-[10px] text-zinc-500 uppercase">DEPARTMENTS</div>
                <div className="text-xl sm:text-2xl font-bold text-cyan-400 mt-1">7 Working Groups</div>
                <div className="text-[10px] text-cyan-300/90 mt-0.5">Civic, Press, Code &amp; Sec</div>
              </div>
            </div>
          </div>

          {/* ── 1.5 THE OFFICIAL FOUNDER'S NOTE & CORE TEAM MANIFESTO ── */}
          <section className="relative rounded-3xl bg-gradient-to-br from-[#0c0d14] via-[#08090f] to-[#05060a] border border-amber-500/30 p-6 sm:p-10 shadow-[0_20px_60px_rgba(0,0,0,0.8)] overflow-hidden">
            {/* Ambient glowing radial backdrop */}
            <div className="absolute top-0 right-0 w-96 h-96 bg-amber-500/[0.07] rounded-full blur-3xl pointer-events-none" />
            <div className="absolute bottom-0 left-0 w-80 h-80 bg-rose-500/[0.05] rounded-full blur-3xl pointer-events-none" />

            <div className="relative z-10 space-y-6">
              <div className="flex flex-wrap items-center justify-between gap-4 pb-5 border-b border-white/10">
                <div className="flex items-center gap-3.5">
                  <div className="relative w-11 h-11 rounded-2xl overflow-hidden border border-amber-400/30 bg-amber-500/10 shadow-md shrink-0">
                    <Image
                      src="/assets/founder.png"
                      alt="Yuveer Chhatwani — Founder & System Architect"
                      fill
                      className="object-cover"
                    />
                  </div>
                  <div>
                    <span className="font-mono text-[10px] tracking-[0.25em] text-amber-300 uppercase font-semibold block">
                      {founderDirective.tag || 'THE ZENVITRA MANIFESTO • BY YOUTH. FOR YOUTH.'}
                    </span>
                    <h2 className="font-display font-bold text-lg sm:text-xl text-white tracking-tight">
                      {founderDirective.title || 'A Note from the Founder'}
                    </h2>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <span className="px-3 py-1 rounded-full bg-amber-500/10 border border-amber-500/30 text-amber-300 font-mono text-[10px] tracking-wider uppercase font-semibold">
                    CONSTITUTIONAL DIRECTIVE
                  </span>
                </div>
              </div>

              {/* Complete Note Content */}
              <div className="p-5 sm:p-7 rounded-2xl bg-white/[0.02] border border-white/[0.08] text-neutral-200">
                <FounderNoteRenderer
                  body={founderDirective.body}
                  defaultExpanded={true}
                  collapsible={true}
                  hideDuplicateTitle={true}
                  cardTitle={founderDirective.title || 'A Note from the Founder'}
                  size="standard"
                />
              </div>

              {/* Sign-off badge */}
              <div className="pt-4 border-t border-white/10 flex flex-col sm:flex-row sm:items-center justify-between gap-4 font-mono text-xs text-zinc-400">
                <div>
                  <span className="text-white font-bold">{founderDirective.author || 'Yuveer Chhatwani'}</span>
                  <span className="text-zinc-500"> &bull; Founder, ZENVITRA</span>
                </div>
                <div className="text-[11px] text-amber-400/90 font-semibold tracking-wide">
                  BY YOUTH. FOR YOUTH. OWNED BY NO AGENDA.
                </div>
              </div>
            </div>
          </section>

          {/* ── 2. TIER 1: THE FOUNDING ARCHITECT ── */}
          <section className="space-y-4">
            <div className="flex items-center justify-between border-b border-white/10 pb-3">
              <div className="flex items-center gap-2 text-xs font-mono text-amber-400 uppercase tracking-widest font-bold">
                <Crown className="w-4 h-4 text-amber-400" />
                <span>Tier 01 // Founding Council &bull; Master Authority</span>
              </div>
              <span className="text-xs font-mono text-zinc-500 hidden sm:inline">Constitutional Architecture</span>
            </div>

            {founder && <TeamMemberCard member={founder} isHero={true} />}
          </section>

          {/* ── 3. TIER 2: CO-FOUNDERS & EXECUTIVE COUNCIL ── */}
          {showCofounders && filteredCofounders.length > 0 && (
            <section className="space-y-6">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-white/10 pb-3">
                <div className="flex items-center gap-2 text-xs font-mono text-indigo-300 uppercase tracking-widest font-bold">
                  <Sparkles className="w-4 h-4 text-indigo-400" />
                  <span>Tier 02 // Co-Founding Council &bull; Executive Directorate</span>
                </div>
                <p className="text-xs font-mono text-zinc-400">
                  Steering institutional diplomacy, product innovation &amp; global chapter expansion
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredCofounders.map((cofounder) => (
                  <TeamMemberCard key={cofounder.id} member={cofounder} />
                ))}
              </div>
            </section>
          )}

          {/* ── 4. TIER 3: DEPARTMENT WORKING GROUPS & SEARCH ── */}
          <section className="space-y-8">
            <div className="space-y-4 border-b border-white/10 pb-6">
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                  <div className="flex items-center gap-2 text-xs font-mono text-cyan-400 uppercase tracking-widest font-bold">
                    <Terminal className="w-4 h-4 text-cyan-400" />
                    <span>Tier 03 // Core Team Leads &amp; Working Groups</span>
                  </div>
                  <p className="text-xs text-zinc-400 mt-1">
                    Specialized leads directing engineering, simulation diplomacy, investigative media, and community stewardship
                  </p>
                </div>

                {/* Real-time Search Input */}
                <div className="relative min-w-[260px] sm:min-w-[320px]">
                  <Search className="w-4 h-4 text-zinc-500 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Search by role, skill, or keyword..."
                    className="w-full pl-9 pr-4 py-2 rounded-xl bg-white/[0.04] border border-white/10 text-xs font-mono text-white placeholder-zinc-500 focus:outline-none focus:border-cyan-400/50 transition"
                  />
                  {searchQuery && (
                    <button
                      onClick={() => setSearchQuery('')}
                      className="text-[10px] font-mono text-zinc-400 hover:text-white absolute right-3 top-1/2 -translate-y-1/2"
                    >
                      CLEAR
                    </button>
                  )}
                </div>
              </div>

              {/* Department Filter Pills */}
              <div className="flex flex-wrap items-center gap-2 pt-2">
                {departments.map((dept) => {
                  const Icon = dept.icon;
                  const count = getDeptCount(dept.id);
                  const isSelected = selectedDept === dept.id;

                  return (
                    <button
                      key={dept.id}
                      onClick={() => setSelectedDept(dept.id)}
                      className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-xl text-xs font-mono transition cursor-pointer ${
                        isSelected
                          ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-400/40 shadow-[0_0_15px_rgba(6,182,212,0.2)] font-semibold'
                          : 'bg-white/[0.03] text-zinc-400 hover:text-white hover:bg-white/[0.07] border border-white/10'
                      }`}
                    >
                      <Icon className={`w-3.5 h-3.5 ${isSelected ? 'text-cyan-400' : 'text-zinc-500'}`} />
                      <span>{dept.label}</span>
                      <span className={`text-[10px] px-1.5 py-0.2 rounded-full ${isSelected ? 'bg-cyan-400/20 text-cyan-200' : 'bg-white/5 text-zinc-500'}`}>
                        {count}
                      </span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Filtered Members Grid */}
            {filteredCore.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredCore.map((member) => (
                  <TeamMemberCard key={member.id} member={member} className="w-full" />
                ))}
              </div>
            ) : (
              <div className="text-center py-16 px-4 rounded-3xl bg-white/[0.02] border border-white/10 space-y-3">
                <Search className="w-8 h-8 text-zinc-600 mx-auto" />
                <h3 className="text-base font-bold text-white font-mono">No matching leadership portfolios found</h3>
                <p className="text-xs text-zinc-400 max-w-md mx-auto">
                  We couldn&apos;t find any roles matching &ldquo;{searchQuery}&rdquo; in {selectedDept}. Try adjusting your search query or reset filters.
                </p>
                <button
                  onClick={() => {
                    setSearchQuery('');
                    setSelectedDept('All');
                  }}
                  className="px-4 py-2 rounded-xl bg-white/10 hover:bg-white/15 text-xs font-mono text-cyan-300 transition"
                >
                  Reset Filters
                </button>
              </div>
            )}
          </section>

          {/* ── 5. DEPARTMENT WORKING GROUPS ARCHITECTURAL OVERVIEW ── */}
          <section className="space-y-8 pt-4">
            <div className="border-b border-white/10 pb-4 flex flex-col sm:flex-row sm:items-center justify-between gap-2">
              <div>
                <div className="flex items-center gap-2 text-xs font-mono text-amber-400 uppercase tracking-widest font-bold">
                  <Shield className="w-4 h-4 text-amber-400" />
                  <span>Architecture &bull; Functional Working Group Mandates</span>
                </div>
                <h2 className="text-2xl sm:text-3xl font-bold text-white tracking-tight mt-1" style={{ fontFamily: 'Clash Display, sans-serif' }}>
                  How ZENVITRA Operates
                </h2>
              </div>
              <p className="text-xs font-mono text-zinc-400 max-w-sm">
                Each division operates autonomously with sovereign clearance and strict execution mandates.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {/* Working Group 1: Engineering */}
              <div className="p-6 rounded-2xl bg-[#080b14] border border-cyan-500/20 hover:border-cyan-500/40 transition space-y-4 shadow-lg flex flex-col justify-between">
                <div className="space-y-2">
                  <div className="w-10 h-10 rounded-xl bg-cyan-500/10 border border-cyan-500/30 flex items-center justify-center text-cyan-400">
                    <Terminal className="w-5 h-5" />
                  </div>
                  <h3 className="text-lg font-bold text-white font-mono">Engineering &amp; Distributed Protocols</h3>
                  <p className="text-xs text-zinc-400 leading-relaxed font-sans">
                    Constructs low-latency WebSockets, Cashfree payment engines, WebRTC audio/video mesh for ZEN.CALL, and zero-trust cryptographic passports with SHA-256 seals.
                  </p>
                </div>
                <div className="pt-2 border-t border-white/10 flex items-center justify-between text-xs font-mono">
                  <span className="text-zinc-500">Track: engineering</span>
                  <Link href="/join-core-team?track=engineering" className="text-cyan-400 hover:underline flex items-center gap-1 font-semibold">
                    Apply Engine <ArrowRight className="w-3 h-3" />
                  </Link>
                </div>
              </div>

              {/* Working Group 2: Secretariat */}
              <div className="p-6 rounded-2xl bg-[#080b14] border border-purple-500/20 hover:border-purple-500/40 transition space-y-4 shadow-lg flex flex-col justify-between">
                <div className="space-y-2">
                  <div className="w-10 h-10 rounded-xl bg-purple-500/10 border border-purple-500/30 flex items-center justify-center text-purple-400">
                    <Compass className="w-5 h-5" />
                  </div>
                  <h3 className="text-lg font-bold text-white font-mono">Secretariat &amp; Parliamentary MUN</h3>
                  <p className="text-xs text-zinc-400 leading-relaxed font-sans">
                    Governs parliamentary procedure across UN and Indian legislative assemblies, writes study guides, curates dynamic continuous crisis war games, and moderates dais allocations.
                  </p>
                </div>
                <div className="pt-2 border-t border-white/10 flex items-center justify-between text-xs font-mono">
                  <span className="text-zinc-500">Track: secretariat</span>
                  <Link href="/join-core-team?track=secretariat" className="text-purple-400 hover:underline flex items-center gap-1 font-semibold">
                    Apply Secretariat <ArrowRight className="w-3 h-3" />
                  </Link>
                </div>
              </div>

              {/* Working Group 3: Design */}
              <div className="p-6 rounded-2xl bg-[#080b14] border border-pink-500/20 hover:border-pink-500/40 transition space-y-4 shadow-lg flex flex-col justify-between">
                <div className="space-y-2">
                  <div className="w-10 h-10 rounded-xl bg-pink-500/10 border border-pink-500/30 flex items-center justify-center text-pink-400">
                    <Layers className="w-5 h-5" />
                  </div>
                  <h3 className="text-lg font-bold text-white font-mono">Visual &amp; Product Architecture</h3>
                  <p className="text-xs text-zinc-400 leading-relaxed font-sans">
                    Defines the obsidian-dark aesthetic, typographic hierarchy, glassmorphism UI components, spatial design language, and cinematic monolith media trailers.
                  </p>
                </div>
                <div className="pt-2 border-t border-white/10 flex items-center justify-between text-xs font-mono">
                  <span className="text-zinc-500">Track: design</span>
                  <Link href="/join-core-team?track=design" className="text-pink-400 hover:underline flex items-center gap-1 font-semibold">
                    Apply Design <ArrowRight className="w-3 h-3" />
                  </Link>
                </div>
              </div>

              {/* Working Group 4: Press */}
              <div className="p-6 rounded-2xl bg-[#080b14] border border-emerald-500/20 hover:border-emerald-500/40 transition space-y-4 shadow-lg flex flex-col justify-between">
                <div className="space-y-2">
                  <div className="w-10 h-10 rounded-xl bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center text-emerald-400">
                    <Newspaper className="w-5 h-5" />
                  </div>
                  <h3 className="text-lg font-bold text-white font-mono">International Press Bureau</h3>
                  <p className="text-xs text-zinc-400 leading-relaxed font-sans">
                    Oversees student investigative journalism, breaking wire dispatches, authentic press citations, and permanent digital DOI publication records on ZEN.PRESS.
                  </p>
                </div>
                <div className="pt-2 border-t border-white/10 flex items-center justify-between text-xs font-mono">
                  <span className="text-zinc-500">Track: press</span>
                  <Link href="/join-core-team?track=press" className="text-emerald-400 hover:underline flex items-center gap-1 font-semibold">
                    Apply Press <ArrowRight className="w-3 h-3" />
                  </Link>
                </div>
              </div>

              {/* Working Group 5: Operations */}
              <div className="p-6 rounded-2xl bg-[#080b14] border border-amber-500/20 hover:border-amber-500/40 transition space-y-4 shadow-lg flex flex-col justify-between">
                <div className="space-y-2">
                  <div className="w-10 h-10 rounded-xl bg-amber-500/10 border border-amber-500/30 flex items-center justify-center text-amber-400">
                    <Zap className="w-5 h-5" />
                  </div>
                  <h3 className="text-lg font-bold text-white font-mono">Strategic Operations &amp; Fellowships</h3>
                  <p className="text-xs text-zinc-400 leading-relaxed font-sans">
                    Runs international summit logistics, algorithmic country allocations, and 50+ nationwide campus ambassador chapters to empower collegiate youth leaders.
                  </p>
                </div>
                <div className="pt-2 border-t border-white/10 flex items-center justify-between text-xs font-mono">
                  <span className="text-zinc-500">Track: operations</span>
                  <Link href="/join-core-team?track=operations" className="text-amber-400 hover:underline flex items-center gap-1 font-semibold">
                    Apply Operations <ArrowRight className="w-3 h-3" />
                  </Link>
                </div>
              </div>

              {/* Working Group 6: Impact */}
              <div className="p-6 rounded-2xl bg-[#080b14] border border-rose-500/20 hover:border-rose-500/40 transition space-y-4 shadow-lg flex flex-col justify-between">
                <div className="space-y-2">
                  <div className="w-10 h-10 rounded-xl bg-rose-500/10 border border-rose-500/30 flex items-center justify-center text-rose-400">
                    <Heart className="w-5 h-5" />
                  </div>
                  <h3 className="text-lg font-bold text-white font-mono">Impact &amp; The 10% Principle</h3>
                  <p className="text-xs text-zinc-400 leading-relaxed font-sans">
                    Maintains the public school aid treasury ledger, auditing 10% platform net profit escrow distributions, non-profit equipment procurement, and bi-annual video proof.
                  </p>
                </div>
                <div className="pt-2 border-t border-white/10 flex items-center justify-between text-xs font-mono">
                  <span className="text-zinc-500">Track: impact</span>
                  <Link href="/join-core-team?track=impact" className="text-rose-400 hover:underline flex items-center gap-1 font-semibold">
                    Apply Impact <ArrowRight className="w-3 h-3" />
                  </Link>
                </div>
              </div>
            </div>
          </section>

          {/* ── 6. SELECTION PROCESS & TIMELINE ACCORD ── */}
          <section className="p-8 sm:p-12 rounded-3xl bg-white/[0.02] border border-white/10 space-y-8">
            <div className="max-w-3xl space-y-2">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/5 border border-white/10 text-xs font-mono text-zinc-300">
                <FileCheck2 className="w-3.5 h-3.5 text-amber-400" />
                <span>RIGOROUS ACCREDITATION &bull; SELECTION ACCORD</span>
              </div>
              <h2 className="text-2xl sm:text-3xl font-bold text-white font-serif">
                How Leadership Seats Are Awarded
              </h2>
              <p className="text-xs sm:text-sm text-zinc-400 leading-relaxed">
                We believe in proof-of-work, uncompromised craftsmanship, and moral conviction over artificial status.
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 font-mono text-xs">
              <div className="p-5 rounded-2xl bg-black/40 border border-white/10 space-y-2 relative">
                <div className="text-amber-400 font-bold text-sm">STAGE 01</div>
                <div className="text-white font-bold text-sm">Proof-of-Work Dossier</div>
                <p className="text-zinc-400 text-[11px] leading-relaxed">
                  Submit your public GitHub, portfolio, MUN crisis history, or investigative writing via the application form.
                </p>
              </div>

              <div className="p-5 rounded-2xl bg-black/40 border border-white/10 space-y-2 relative">
                <div className="text-indigo-400 font-bold text-sm">STAGE 02</div>
                <div className="text-white font-bold text-sm">Architecture Enclave</div>
                <p className="text-zinc-400 text-[11px] leading-relaxed">
                  30-minute deep dive colloquium with founding council to assess technical intuition, diplomatic poise, and alignment.
                </p>
              </div>

              <div className="p-5 rounded-2xl bg-black/40 border border-white/10 space-y-2 relative">
                <div className="text-cyan-400 font-bold text-sm">STAGE 03</div>
                <div className="text-white font-bold text-sm">48-Hour Trial Sprint</div>
                <p className="text-zinc-400 text-[11px] leading-relaxed">
                  Contribute an actual production directive, committee framework, wire dispatch, or protocol unit to verify speed.
                </p>
              </div>

              <div className="p-5 rounded-2xl bg-black/40 border border-white/10 space-y-2 relative">
                <div className="text-emerald-400 font-bold text-sm">STAGE 04</div>
                <div className="text-white font-bold text-sm">Genesis Induction</div>
                <p className="text-zinc-400 text-[11px] leading-relaxed">
                  Minting of your permanent Sovereign Dual-Key Passport, leadership clearance keys, and public directory entry.
                </p>
              </div>
            </div>
          </section>

          {/* ── 7. INVITATION & APPLICATION CTA BANNER ── */}
          <section className="relative overflow-hidden rounded-3xl border border-white/15 bg-gradient-to-r from-amber-500/10 via-purple-600/10 to-cyan-500/10 p-8 sm:p-12">
            <div className="relative z-10 max-w-3xl space-y-4">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 border border-white/20 text-xs font-mono text-zinc-200">
                <Users className="w-3.5 h-3.5 text-amber-400" />
                <span>OPEN EXECUTIVE SEATS &bull; FORM 2026</span>
              </div>

              <h2 className="text-2xl sm:text-4xl font-extrabold text-white font-serif">
                Ready to Architect ZENVITRA With Us?
              </h2>

              <p className="text-sm sm:text-base text-zinc-300 leading-relaxed font-sans">
                We are actively assembling our founding council, lead engineers, chamber chairs, press bureau directors, and impact stewards. If you have deep craftsmanship and conviction in youth-led civic technology, apply to join our core team.
              </p>

              <div className="pt-2 flex flex-wrap items-center gap-4">
                <Link
                  href="/join-core-team"
                  className="inline-flex items-center gap-2 px-6 py-3.5 rounded-xl bg-gradient-to-r from-amber-400 via-orange-400 to-amber-500 text-black font-bold text-sm hover:opacity-95 shadow-lg shadow-amber-500/20 transition"
                >
                  Apply to Join Core Team
                  <ArrowRight className="w-4 h-4" />
                </Link>

                <Link
                  href="/manifesto"
                  className="inline-flex items-center gap-2 px-6 py-3.5 rounded-xl bg-white/10 hover:bg-white/15 text-white border border-white/15 font-semibold text-sm transition"
                >
                  Read Ecosystem Manifesto
                </Link>
              </div>
            </div>
          </section>

        </div>
      </main>

      <Footer />
    </div>
  );
}
