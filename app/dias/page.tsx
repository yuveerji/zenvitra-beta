'use client';

import React, { useState, useEffect, Suspense } from 'react';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import {
  Gavel,
  ShieldCheck,
  Globe2,
  Users,
  Clock,
  Sparkles,
  ArrowRight,
  FileText,
  Vote,
  Radio,
  SlidersHorizontal,
  Layers,
  ChevronRight,
  Compass,
  CheckCircle2,
  Lock,
  Building2,
  Scale,
  Newspaper,
  Flame,
  Volume2,
  KeyRound,
  Tv,
  BookOpen,
  Scroll,
} from 'lucide-react';
import { DiasNav } from '@/components/mun/dias/DiasNav';
import { DiasFooter } from '@/components/mun/dias/DiasFooter';
import { DiasButton } from '@/components/mun/dias/DiasButton';
import { DiasBadge } from '@/components/mun/dias/DiasBadge';
import { DiasCard } from '@/components/mun/dias/DiasCard';
import { DiasLivePreview } from '@/components/mun/dias/DiasLivePreview';
import { CommitteeFleetSection } from '@/components/mun/dias/CommitteeFleetSection';
import ZenMunMasterDais from '@/components/mun/zenmun/ZenMunMasterDais';

function SearchParamsWatcher({ onModeChange }: { onModeChange: (mode: 'dais' | 'setup' | 'normal') => void }) {
  const searchParams = useSearchParams();
  useEffect(() => {
    const isDais =
      searchParams?.get('control') === 'true' ||
      searchParams?.get('dais') === 'true' ||
      Boolean(searchParams?.get('room'));

    const isSetup =
      searchParams?.get('create') === 'true' ||
      searchParams?.get('new') === 'true' ||
      searchParams?.get('setup') === 'true' ||
      (Boolean(searchParams?.get('chamber')) && !isDais);

    if (isDais) {
      onModeChange('dais');
    } else if (isSetup) {
      onModeChange('setup');
    } else {
      onModeChange('normal');
    }
  }, [searchParams, onModeChange]);

  return null;
}

export default function DiasLandingPage() {
  const router = useRouter();
  const [viewMode, setViewMode] = useState<'dais' | 'setup' | 'normal'>('normal');
  const [joinCodeInput, setJoinCodeInput] = useState('');
  const [activeStoredSession, setActiveStoredSession] = useState<{
    sessionCode: string;
    committeeName: string;
    topic: string;
    activeMode?: string;
    rosterCount?: number;
  } | null>(null);

  useEffect(() => {
    if (typeof window === 'undefined') return;
    try {
      const munRaw = localStorage.getItem('zenvitra_zenmun_live_session_v1');
      if (munRaw) {
        const parsed = JSON.parse(munRaw);
        // STRICT DATA INTEGRITY: Only restore if a real user-configured session with real delegates was launched!
        const hasGenuineRoster = Array.isArray(parsed?.roster) && parsed.roster.length > 0;
        const isLegacySeed = parsed?.committeeName === 'Lok Sabha' && !hasGenuineRoster;

        if (parsed?.committeeName && hasGenuineRoster && !isLegacySeed && parsed?.sessionState === 'in-session') {
          setActiveStoredSession({
            sessionCode: parsed.sessionCode || 'ZEN01',
            committeeName: parsed.committeeName,
            topic: parsed.topic || '',
            activeMode: parsed.activeMode || 'GSL',
            rosterCount: parsed.roster.length,
          });
          return;
        } else {
          // Zero seeded data: purge empty or unconfigured sessions immediately
          localStorage.removeItem('zenvitra_zenmun_live_session_v1');
          localStorage.removeItem('zenvitra_dias_active_session');
          setActiveStoredSession(null);
        }
      } else {
        localStorage.removeItem('zenvitra_dias_active_session');
        setActiveStoredSession(null);
      }
    } catch {}
  }, []);

  if (viewMode === 'dais') {
    const hasRoster = Boolean(activeStoredSession && activeStoredSession.rosterCount && activeStoredSession.rosterCount > 0);
    return <ZenMunMasterDais initialView={hasRoster ? 'chair' : 'setup'} onExit={() => setViewMode('normal')} />;
  }

  if (viewMode === 'setup') {
    return <ZenMunMasterDais initialView="setup" onExit={() => setViewMode('normal')} />;
  }

  const handleJoinChamber = (e: React.FormEvent) => {
    e.preventDefault();
    const clean = joinCodeInput.trim().toUpperCase();
    if (clean) {
      router.push(`/dias/${clean}`);
    }
  };

  return (
    <div className="min-h-screen bg-[#08090B] text-[#F4F2ED] selection:bg-[#C5A46D]/30 selection:text-[#E6D1A5] font-sans antialiased overflow-x-hidden">
      <Suspense fallback={null}>
        <SearchParamsWatcher onModeChange={setViewMode} />
      </Suspense>
      {/* Navigation with dynamic auth state */}
      <DiasNav />

      {/* ─── 1. HERO SECTION WITH HOMEPAGE BUTTON GLOW & ANIMATION ─── */}
      <section className="relative pt-32 sm:pt-40 pb-16 sm:pb-24 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto flex flex-col items-center text-center">
        {/* Subtle radial diplomatic glow */}
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-full max-w-[700px] h-[400px] bg-[#C5A46D]/12 rounded-full blur-[140px] pointer-events-none" />

        {/* Top diplomatic status pill */}
        <div className="inline-flex items-center gap-2.5 px-4 py-1.5 rounded-full bg-[#181B21]/90 border border-[#C5A46D]/30 text-[#E6D1A5] text-[11px] font-mono tracking-widest uppercase mb-8 shadow-[0_0_20px_rgba(197,164,109,0.15)]">
          <span className="w-2 h-2 rounded-full bg-[#C5A46D] animate-pulse shadow-[0_0_8px_#C5A46D]" />
          <span>Diplomatic Operating System &bull; Presidium V2.4</span>
        </div>

        {/* Main Editorial Hero Headline */}
        <h1 className="text-4xl sm:text-6xl md:text-7xl lg:text-8xl font-serif font-normal tracking-tight text-[#F4F2ED] max-w-5xl leading-[1.06] mb-6">
          THE WORLD IS <span className="italic text-[#C5A46D]">IN SESSION.</span>
        </h1>

        {/* Supporting Copy */}
        <p className="text-base sm:text-lg md:text-xl text-[#9A9DA5] max-w-2xl font-light leading-relaxed mb-10">
          A new standard for diplomatic discourse. Host, moderate, and experience Model United Nations, Indian Parliamentary chambers, and Crisis war rooms through one seamless digital dias.
        </p>

        {/* Homepage-Style Action CTAs */}
        <div className="flex flex-wrap items-center justify-center gap-3 sm:gap-4 mb-16 w-full sm:w-auto font-display">
          {/* Primary CTA: Enter Dias */}
          <Link href="/dias?dais=true" className="w-full sm:w-auto">
            <DiasButton
              variant="gold"
              size="lg"
              className="w-full sm:w-auto"
              rightIcon={<ArrowRight className="w-4 h-4 ml-1 group-hover:translate-x-1 transition-transform" />}
            >
              Enter the Dias
            </DiasButton>
          </Link>

          {/* Secondary CTA: Setup Studio */}
          <Link href="/dias?create=true" className="w-full sm:w-auto">
            <DiasButton
              variant="white"
              size="lg"
              className="w-full sm:w-auto"
              rightIcon={<Sparkles className="w-4 h-4 ml-1 text-amber-500 group-hover:rotate-12 transition-transform" />}
            >
              Setup Studio
            </DiasButton>
          </Link>

          {/* Tertiary CTA: Gateways */}
          <a href="#gateways" className="w-full sm:w-auto">
            <DiasButton variant="charcoal" size="lg" className="w-full sm:w-auto">
              Presidium Gateways
            </DiasButton>
          </a>
        </div>

        {/* ─── ACTIVE CHAMBER RADAR BANNER (Transferred from /committee) ─── */}
        {activeStoredSession && (
          <div className="w-full max-w-5xl mb-12 p-6 sm:p-7 rounded-3xl bg-[#111318]/90 border border-[#C5A46D]/40 shadow-[0_0_40px_rgba(197,164,109,0.18)] flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6 backdrop-blur-xl relative overflow-hidden text-left animate-in fade-in slide-in-from-top-3">
            <div className="flex items-center gap-4 relative z-10">
              <div className="w-13 h-13 rounded-2xl bg-[#C5A46D]/15 border border-[#C5A46D]/40 flex items-center justify-center text-[#C5A46D] shrink-0 shadow-md">
                <Radio className="w-6 h-6 animate-pulse text-[#C5A46D]" />
              </div>
              <div className="space-y-1">
                <div className="flex items-center gap-2 flex-wrap">
                  <span className="px-2.5 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 font-mono text-[9px] font-bold uppercase tracking-wider border border-emerald-500/40">
                    ACTIVE CHAMBER DETECTED
                  </span>
                  <span className="font-mono text-xs text-neutral-300">
                    PIN: <strong className="text-[#E6D1A5] tracking-widest">{activeStoredSession.sessionCode}</strong>
                  </span>
                  <span className="px-2 py-0.5 rounded-full bg-black/40 text-neutral-300 font-mono text-[9px] font-bold uppercase border border-white/10">
                    MODE: {activeStoredSession.activeMode?.toUpperCase() || 'GSL'}
                  </span>
                  {activeStoredSession.rosterCount !== undefined && activeStoredSession.rosterCount > 0 && (
                    <span className="text-[10px] text-neutral-400 font-mono">
                      ({activeStoredSession.rosterCount} Delegates)
                    </span>
                  )}
                </div>
                <h3 className="text-xl sm:text-2xl font-black font-serif text-[#F4F2ED] tracking-tight">
                  {activeStoredSession.committeeName}
                </h3>
                <p className="text-xs text-[#9A9DA5] italic max-w-xl">
                  &ldquo;{activeStoredSession.topic}&rdquo;
                </p>
              </div>
            </div>

            <div className="flex items-center gap-3 shrink-0 relative z-10 w-full sm:w-auto">
              <Link href="/dias?dais=true" className="w-full sm:w-auto">
                <DiasButton
                  variant="gold"
                  size="md"
                  className="w-full sm:w-auto"
                  rightIcon={<ArrowRight className="w-4 h-4 ml-1 group-hover:translate-x-1 transition-transform" />}
                >
                  Resume Dais Console
                </DiasButton>
              </Link>
            </div>
          </div>
        )}

        {/* ─── THE DIAS EXPERIENCE: LIVE INTERACTIVE PREVIEW ─── */}
        <div className="w-full max-w-5xl mt-2">
          <DiasLivePreview />
        </div>
      </section>

      {/* ─── 2. FOUR DIPLOMATIC CHAMBER GATEWAYS (Transferred from /committee) ─── */}
      <section id="gateways" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 space-y-8">
        <div className="text-center space-y-2 max-w-xl mx-auto">
          <DiasBadge variant="gold" size="sm">
            PRESIDIUM ACCESS
          </DiasBadge>
          <h2 className="text-3xl sm:text-4xl font-serif text-[#F4F2ED]">
            Diplomatic Gateways
          </h2>
          <p className="text-xs sm:text-sm text-[#9A9DA5]">
            Select your entry protocol into the digital parliamentary presidium.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
          {/* Gateway 1: Dais Command */}
          <div className="p-6 rounded-3xl bg-[#111318] border border-[#C5A46D]/30 flex flex-col justify-between space-y-5 hover:border-[#C5A46D]/70 transition-all duration-300 shadow-[0_0_30px_rgba(0,0,0,0.5)] group">
            <div className="space-y-3 text-left">
              <div className="w-12 h-12 rounded-2xl bg-[#C5A46D]/15 text-[#C5A46D] flex items-center justify-center border border-[#C5A46D]/30 shadow-xs">
                <Gavel className="w-5 h-5 text-[#C5A46D]" />
              </div>
              <div>
                <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-[#C5A46D]">
                  PRESIDIUM SUITE
                </span>
                <h3 className="text-lg font-bold font-serif text-white mt-0.5">Executive Dais Console</h3>
              </div>
              <p className="text-xs text-neutral-400 leading-relaxed">
                Full presidential dais: GSL, Moderated Caucuses, Right of Reply, P5 Veto roll-calls, and live delegate scoreboard.
              </p>
            </div>
            <Link href="/dias?dais=true" className="w-full">
              <DiasButton variant="gold" size="sm" className="w-full justify-center">
                Take the Gavel &rarr;
              </DiasButton>
            </Link>
          </div>

          {/* Gateway 2: Setup Studio */}
          <div className="p-6 rounded-3xl bg-[#111318] border border-white/10 flex flex-col justify-between space-y-5 hover:border-white/30 transition-all duration-300 shadow-[0_0_30px_rgba(0,0,0,0.5)] group">
            <div className="space-y-3 text-left">
              <div className="w-12 h-12 rounded-2xl bg-white/[0.06] text-white flex items-center justify-center border border-white/15 shadow-xs">
                <Sparkles className="w-5 h-5 text-amber-300" />
              </div>
              <div>
                <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-emerald-400">
                  CHAMBER ARCHITECT
                </span>
                <h3 className="text-lg font-bold font-serif text-white mt-0.5">Setup Studio &amp; Matrices</h3>
              </div>
              <p className="text-xs text-neutral-400 leading-relaxed">
                Zenvitra-standard setup: P5, G20, EU, NDA, I.N.D.I.A., Union Cabinet &amp; Indian States quick bundles.
              </p>
            </div>
            <Link href="/dias?create=true" className="w-full">
              <DiasButton variant="white" size="sm" className="w-full justify-center">
                Launch Studio &rarr;
              </DiasButton>
            </Link>
          </div>

          {/* Gateway 3: Floor Code Entry */}
          <div className="p-6 rounded-3xl bg-[#111318] border border-cyan-500/25 flex flex-col justify-between space-y-5 hover:border-cyan-400/50 transition-all duration-300 shadow-[0_0_30px_rgba(0,0,0,0.5)] group">
            <div className="space-y-3 text-left">
              <div className="w-12 h-12 rounded-2xl bg-cyan-950/40 text-cyan-300 flex items-center justify-center border border-cyan-500/30 shadow-xs">
                <KeyRound className="w-5 h-5 text-cyan-300" />
              </div>
              <div>
                <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-cyan-400">
                  DELEGATE ENTRY
                </span>
                <h3 className="text-lg font-bold font-serif text-white mt-0.5">Floor Room PIN Join</h3>
              </div>
              <p className="text-xs text-neutral-400 leading-relaxed">
                Enter your committee room PIN to vote on resolutions, cast roll-call ballots, and raise parliamentary motions.
              </p>
            </div>
            <form onSubmit={handleJoinChamber} className="flex items-center gap-1.5">
              <input
                type="text"
                maxLength={8}
                value={joinCodeInput}
                onChange={(e) => setJoinCodeInput(e.target.value.toUpperCase())}
                placeholder="ROOM PIN..."
                className="flex-1 px-3 py-2 rounded-full bg-black/60 border border-white/15 text-xs font-mono font-bold tracking-widest text-[#E6D1A5] placeholder-neutral-500 focus:outline-none focus:border-[#C5A46D]"
              />
              <DiasButton type="submit" variant="amber-glass" size="sm">
                Join
              </DiasButton>
            </form>
          </div>

          {/* Gateway 4: Auditorium Projection */}
          <div className="p-6 rounded-3xl bg-[#111318] border border-purple-500/25 flex flex-col justify-between space-y-5 hover:border-purple-400/50 transition-all duration-300 shadow-[0_0_30px_rgba(0,0,0,0.5)] group">
            <div className="space-y-3 text-left">
              <div className="w-12 h-12 rounded-2xl bg-purple-950/40 text-purple-300 flex items-center justify-center border border-purple-500/30 shadow-xs">
                <Tv className="w-5 h-5 text-purple-300" />
              </div>
              <div>
                <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-purple-400">
                  AUDITORIUM PROJECTION
                </span>
                <h3 className="text-lg font-bold font-serif text-white mt-0.5">Stage Display Wall</h3>
              </div>
              <p className="text-xs text-neutral-400 leading-relaxed">
                Full-screen projection mode for chamber auditoriums: live speaking timer, active country flag, and motion podium.
              </p>
            </div>
            <Link href="/host/display?format=mun" target="_blank" className="w-full">
              <DiasButton variant="charcoal" size="sm" className="w-full justify-center">
                Project Screen &rarr;
              </DiasButton>
            </Link>
          </div>
        </div>
      </section>

      {/* ─── 3. THE PHILOSOPHY ─── */}
      <section className="py-24 border-t border-[#181B21] bg-[#0A0C0F] relative">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            <div className="lg:col-span-5 space-y-5 text-left">
              <DiasBadge variant="gold" size="sm">
                THE PHILOSOPHY
              </DiasBadge>
              <h2 className="text-3xl sm:text-4xl lg:text-5xl font-serif tracking-tight text-[#F4F2ED] leading-tight">
                Diplomacy requires <span className="italic text-[#C5A46D]">precision</span>, not friction.
              </h2>
              <p className="text-sm sm:text-base text-[#9A9DA5] leading-relaxed font-light">
                For decades, parliamentary simulations have struggled with chaotic Google Sheets, miscounted votes, lost chits, desynchronized stopwatches, and fragmented paper resolutions.
              </p>
              <p className="text-sm sm:text-base text-[#9A9DA5] leading-relaxed font-light">
                ZENVITRA MUN DIAS unifies the entire lifecycle of a summit into a sovereign, zero-latency digital chamber. From roll call to the final division vote, every gavel strike is accounted for.
              </p>
              <div className="pt-2 flex items-center gap-6 text-xs font-mono text-[#E6D1A5]">
                <span>✓ 0ms Audio Latency</span>
                <span>✓ Zero Seeded Accounts</span>
                <span>✓ Instant Quorum Math</span>
              </div>
            </div>

            <div className="lg:col-span-7 grid grid-cols-1 sm:grid-cols-2 gap-5">
              <DiasCard variant="elevated" className="p-6 text-left space-y-3">
                <div className="w-10 h-10 rounded-xl bg-[#181B21] border border-[#2A2E39] flex items-center justify-center text-[#C5A46D]">
                  <Clock className="w-5 h-5" />
                </div>
                <h3 className="text-base font-semibold text-[#F4F2ED]">
                  Server-Anchored Precision
                </h3>
                <p className="text-xs text-[#9A9DA5] leading-relaxed">
                  Timers rely on immutable server timestamps rather than browser ticks. Refreshing, switching tabs, or fluctuating WiFi will never drift your debate clock.
                </p>
              </DiasCard>

              <DiasCard variant="elevated" className="p-6 text-left space-y-3">
                <div className="w-10 h-10 rounded-xl bg-[#181B21] border border-[#2A2E39] flex items-center justify-center text-[#C5A46D]">
                  <Gavel className="w-5 h-5" />
                </div>
                <h3 className="text-base font-semibold text-[#F4F2ED]">
                  Acoustic Gavel Synthesis
                </h3>
                <p className="text-xs text-[#9A9DA5] leading-relaxed">
                  Real physical wood-on-wood resonance modeled via Web Audio API. 3400Hz transient crack, 220Hz wood body, and desk punch at key <kbd className="px-1.5 py-0.5 rounded bg-[#181B21] border border-[#2A2E39] text-[#C5A46D] font-mono">[G]</kbd>.
                </p>
              </DiasCard>

              <DiasCard variant="elevated" className="p-6 text-left space-y-3">
                <div className="w-10 h-10 rounded-xl bg-[#181B21] border border-[#2A2E39] flex items-center justify-center text-[#C5A46D]">
                  <Scale className="w-5 h-5" />
                </div>
                <h3 className="text-base font-semibold text-[#F4F2ED]">
                  Multi-Format Procedural Rules
                </h3>
                <p className="text-xs text-[#9A9DA5] leading-relaxed">
                  Native switchable support for UNA-USA, HMUN, THIMUN, and Indian Parliamentary Procedures (Lok Sabha, Rajya Sabha) with clause-by-clause bill voting.
                </p>
              </DiasCard>

              <DiasCard variant="elevated" className="p-6 text-left space-y-3">
                <div className="w-10 h-10 rounded-xl bg-[#181B21] border border-[#2A2E39] flex items-center justify-center text-[#C5A46D]">
                  <ShieldCheck className="w-5 h-5" />
                </div>
                <h3 className="text-base font-semibold text-[#F4F2ED]">
                  Sovereign Data Integrity
                </h3>
                <p className="text-xs text-[#9A9DA5] leading-relaxed">
                  Strictly zero mock accounts, zero artificial attendees, and zero fake conferences. All records derive from real organizers and verified participants.
                </p>
              </DiasCard>
            </div>
          </div>
        </div>
      </section>

      {/* ─── 4. PLATFORM CAPABILITIES ─── */}
      <section id="capabilities" className="py-24 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-16">
        <div className="max-w-2xl mx-auto space-y-3">
          <DiasBadge variant="gold" size="sm">
            CAPABILITIES
          </DiasBadge>
          <h2 className="text-3xl sm:text-5xl font-serif text-[#F4F2ED]">
            Architected for <span className="italic text-[#C5A46D]">Every Committee.</span>
          </h2>
          <p className="text-sm text-[#9A9DA5]">
            Configurable modules tailored to traditional UN bodies, national parliaments, editorial press rooms, and cabinet war rooms.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 text-left">
          {/* Card 1: Indian Parliamentary System */}
          <DiasCard variant="elevated" isHoverable className="p-6 space-y-4 flex flex-col justify-between">
            <div className="space-y-3">
              <div className="w-10 h-10 rounded-xl bg-[#C5A46D]/15 border border-[#C5A46D]/30 flex items-center justify-center text-[#C5A46D]">
                <Building2 className="w-5 h-5" />
              </div>
              <h3 className="text-lg font-semibold text-[#F4F2ED]">
                Indian Parliament Engine
              </h3>
              <p className="text-xs text-[#9A9DA5] leading-relaxed">
                Lok Sabha & Rajya Sabha simulations. Clause-by-clause bill editor, amendment proposals, question hour to ministers, and division voting tallies.
              </p>
            </div>
            <div className="pt-4 border-t border-[#181B21] flex items-center justify-between text-xs font-mono text-[#C5A46D]">
              <span>Bills & Amendments</span>
              <ChevronRight className="w-3.5 h-3.5" />
            </div>
          </DiasCard>

          {/* Card 2: United Nations General Assembly & UNSC */}
          <DiasCard variant="elevated" isHoverable className="p-6 space-y-4 flex flex-col justify-between">
            <div className="space-y-3">
              <div className="w-10 h-10 rounded-xl bg-[#C5A46D]/15 border border-[#C5A46D]/30 flex items-center justify-center text-[#C5A46D]">
                <Globe2 className="w-5 h-5" />
              </div>
              <h3 className="text-lg font-semibold text-[#F4F2ED]">
                UN General Assembly & UNSC
              </h3>
              <p className="text-xs text-[#9A9DA5] leading-relaxed">
                Standard UN Rules of Procedure. General Speakers' List, moderated and unmoderated caucuses, P5 veto mechanisms, and working paper management.
              </p>
            </div>
            <div className="pt-4 border-t border-[#181B21] flex items-center justify-between text-xs font-mono text-[#C5A46D]">
              <span>GSL & Moderated</span>
              <ChevronRight className="w-3.5 h-3.5" />
            </div>
          </DiasCard>

          {/* Card 3: International Press Corps */}
          <DiasCard variant="elevated" isHoverable className="p-6 space-y-4 flex flex-col justify-between">
            <div className="space-y-3">
              <div className="w-10 h-10 rounded-xl bg-[#C5A46D]/15 border border-[#C5A46D]/30 flex items-center justify-center text-[#C5A46D]">
                <Newspaper className="w-5 h-5" />
              </div>
              <h3 className="text-lg font-semibold text-[#F4F2ED]">
                International Press Corps
              </h3>
              <p className="text-xs text-[#9A9DA5] leading-relaxed">
                Dedicated newsroom wire desk. Draft press releases, submit articles for editorial review, manage embargoes, and broadcast breaking news bulletins.
              </p>
            </div>
            <div className="pt-4 border-t border-[#181B21] flex items-center justify-between text-xs font-mono text-[#C5A46D]">
              <span>Editorial Desk</span>
              <ChevronRight className="w-3.5 h-3.5" />
            </div>
          </DiasCard>

          {/* Card 4: Crisis & Cabinet Directives */}
          <DiasCard variant="elevated" isHoverable className="p-6 space-y-4 flex flex-col justify-between">
            <div className="space-y-3">
              <div className="w-10 h-10 rounded-xl bg-[#C5A46D]/15 border border-[#C5A46D]/30 flex items-center justify-center text-[#C5A46D]">
                <Flame className="w-5 h-5" />
              </div>
              <h3 className="text-lg font-semibold text-[#F4F2ED]">
                Cabinet & Crisis Terminal
              </h3>
              <p className="text-xs text-[#9A9DA5] leading-relaxed">
                High-stakes war rooms. Confidential directives, troop deployments, diplomatic sanctions, situation report feeds, and private communications.
              </p>
            </div>
            <div className="pt-4 border-t border-[#181B21] flex items-center justify-between text-xs font-mono text-[#C5A46D]">
              <span>Crisis Directives</span>
              <ChevronRight className="w-3.5 h-3.5" />
            </div>
          </DiasCard>
        </div>
      </section>

      {/* ─── 5. COMMITTEE FLEET & PRESET CHAMBERS ─── */}
      <CommitteeFleetSection />

      {/* ─── 6. DIPLOMATIC CODEX & RULES OF PROCEDURE (Transferred from /committee) ─── */}
      <section id="codex" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 space-y-8">
        <div className="p-7 sm:p-10 rounded-3xl bg-[#111318] border border-[#C5A46D]/30 shadow-2xl space-y-8">
          <div className="space-y-1 border-b border-[#232731] pb-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <div className="flex items-center gap-2">
                <BookOpen className="w-4 h-4 text-[#C5A46D]" />
                <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-[#C5A46D]">
                  PARLIAMENTARY CODEX &bull; RULES OF PROCEDURE
                </span>
              </div>
              <h3 className="text-2xl sm:text-3xl font-black font-serif text-white mt-1">
                Diplomatic Motions, Points &amp; Yields Matrix
              </h3>
            </div>
            <span className="text-xs text-neutral-400 font-mono px-3 py-1 rounded-full bg-white/[0.04] border border-white/10">
              UNA-USA &bull; THIMUN &bull; LOK SABHA PROTOCOLS
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-left">
            {/* Column 1: Parliamentary Motions */}
            <div className="p-5 rounded-2xl bg-[#08090B] border border-[#232731] space-y-3">
              <div className="flex items-center gap-2 text-[#C5A46D]">
                <Gavel className="w-4 h-4" />
                <h4 className="text-xs font-bold uppercase tracking-wider font-mono">Procedural Motions</h4>
              </div>
              <ul className="space-y-2.5 text-xs text-neutral-300 leading-relaxed font-normal">
                <li className="flex items-start gap-2">
                  <span className="text-[#C5A46D] font-bold">&bull;</span>
                  <div>
                    <strong className="text-white">Moderated Caucus:</strong> Topic, total time &amp; individual speaking slot. Simple majority.
                  </div>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-[#C5A46D] font-bold">&bull;</span>
                  <div>
                    <strong className="text-white">Unmoderated Caucus:</strong> Informal floor consultation and resolution drafting. Simple majority.
                  </div>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-[#C5A46D] font-bold">&bull;</span>
                  <div>
                    <strong className="text-white">Closure of Debate:</strong> Moves chamber directly into substantive resolution voting. 2/3 majority.
                  </div>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-[#C5A46D] font-bold">&bull;</span>
                  <div>
                    <strong className="text-white">Division Bell (Lok Sabha):</strong> Electronic division recorded vote for legislative clauses.
                  </div>
                </li>
              </ul>
            </div>

            {/* Column 2: Parliamentary Points */}
            <div className="p-5 rounded-2xl bg-[#08090B] border border-[#232731] space-y-3">
              <div className="flex items-center gap-2 text-cyan-400">
                <Scale className="w-4 h-4" />
                <h4 className="text-xs font-bold uppercase tracking-wider font-mono">Floor Points</h4>
              </div>
              <ul className="space-y-2.5 text-xs text-neutral-300 leading-relaxed font-normal">
                <li className="flex items-start gap-2">
                  <span className="text-cyan-400 font-bold">&bull;</span>
                  <div>
                    <strong className="text-white">Point of Personal Privilege:</strong> Audibility, discomfort, temperature. May interrupt speaker only for inaudibility.
                  </div>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-cyan-400 font-bold">&bull;</span>
                  <div>
                    <strong className="text-white">Point of Order:</strong> Raised when procedural rules or time limits are violated by dais or delegate.
                  </div>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-cyan-400 font-bold">&bull;</span>
                  <div>
                    <strong className="text-white">Point of Parliamentary Inquiry:</strong> Clarification directed to the Chair regarding chamber rules.
                  </div>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-cyan-400 font-bold">&bull;</span>
                  <div>
                    <strong className="text-white">Point of Information:</strong> Substantive inquiry to the speaking delegate if floor time was yielded.
                  </div>
                </li>
              </ul>
            </div>

            {/* Column 3: Yields & Right to Reply */}
            <div className="p-5 rounded-2xl bg-[#08090B] border border-[#232731] space-y-3">
              <div className="flex items-center gap-2 text-emerald-400">
                <Scroll className="w-4 h-4" />
                <h4 className="text-xs font-bold uppercase tracking-wider font-mono">Yields &amp; RTR</h4>
              </div>
              <ul className="space-y-2.5 text-xs text-neutral-300 leading-relaxed font-normal">
                <li className="flex items-start gap-2">
                  <span className="text-emerald-400 font-bold">&bull;</span>
                  <div>
                    <strong className="text-white">Yield to the Chair:</strong> Returns remaining speaking time to the Dais. No questions permitted.
                  </div>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-emerald-400 font-bold">&bull;</span>
                  <div>
                    <strong className="text-white">Yield to Delegate:</strong> Passes remaining time to another delegation. No second yield allowed.
                  </div>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-emerald-400 font-bold">&bull;</span>
                  <div>
                    <strong className="text-white">Yield to Questions:</strong> Opens floor to points of information from the chamber.
                  </div>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-emerald-400 font-bold">&bull;</span>
                  <div>
                    <strong className="text-white">Right of Reply (RTR):</strong> Granted if national sovereignty or integrity was personally insulted.
                  </div>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* ─── 7. BUILT FOR EVERY ROLE ─── */}
      <section className="py-24 border-t border-[#181B21] bg-[#0A0C0F]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-16">
          <div className="text-center space-y-3 max-w-2xl mx-auto">
            <DiasBadge variant="gold" size="sm">
              ROLE-BASED WORKSPACES
            </DiasBadge>
            <h2 className="text-3xl sm:text-5xl font-serif text-[#F4F2ED]">
              Built for <span className="italic text-[#C5A46D]">Every Diplomatic Seat.</span>
            </h2>
            <p className="text-sm text-[#9A9DA5]">
              Chairs, delegates, press correspondents, and secretariats each get dedicated, tailored workflows.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-left">
            {/* Role 1: Chairperson / Presiding Officer */}
            <div className="space-y-4 p-7 rounded-2xl bg-[#111318] border border-[#232731]">
              <div className="text-xs font-mono uppercase tracking-widest text-[#C5A46D]">
                ROLE &bull; CHAIRPERSON / SPEAKER
              </div>
              <h3 className="text-xl font-semibold text-[#F4F2ED]">
                Command the Chamber
              </h3>
              <p className="text-xs text-[#9A9DA5] leading-relaxed">
                Full authority over the speaker queue, timer alerts, caucus transitions, and motions lifecycle. Open substantive voting, review amendments, and strike the gavel with instant audio confirmation.
              </p>
              <ul className="space-y-2 text-xs text-[#E6D1A5] pt-2">
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-[#C5A46D]" /> Realtime Queue Management &amp; Reordering
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-[#C5A46D]" /> Voice &amp; Division Vote Tallying
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-[#C5A46D]" /> Roll Call Attendance &amp; Automatic Quorum
                </li>
              </ul>
            </div>

            {/* Role 2: Delegate / Member of Parliament */}
            <div className="space-y-4 p-7 rounded-2xl bg-[#111318] border border-[#232731]">
              <div className="text-xs font-mono uppercase tracking-widest text-[#C5A46D]">
                ROLE &bull; DELEGATE / MEMBER
              </div>
              <h3 className="text-xl font-semibold text-[#F4F2ED]">
                Articulate Sovereign Positions
              </h3>
              <p className="text-xs text-[#9A9DA5] leading-relaxed">
                Raise points of personal privilege, parliamentary inquiry, or order with one tap. Request recognition, yield remaining time to the chair or other delegates, and review submitted draft resolutions.
              </p>
              <ul className="space-y-2 text-xs text-[#E6D1A5] pt-2">
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-[#C5A46D]" /> Live Speaking Timer Synchronization
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-[#C5A46D]" /> Confidential Secret Ballot Submissions
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-[#C5A46D]" /> Bilateral &amp; Multi-Party Diplomatic Chits
                </li>
              </ul>
            </div>

            {/* Role 3: Secretariat & Administrators */}
            <div className="space-y-4 p-7 rounded-2xl bg-[#111318] border border-[#232731]">
              <div className="text-xs font-mono uppercase tracking-widest text-[#C5A46D]">
                ROLE &bull; SECRETARIAT / ADMIN
              </div>
              <h3 className="text-xl font-semibold text-[#F4F2ED]">
                Omniscient Oversight
              </h3>
              <p className="text-xs text-[#9A9DA5] leading-relaxed">
                Monitor live committee health across all simultaneous chambers. Configure conference dates, assign dais staff, publish conference-wide announcements, and inspect immutable audit logs.
              </p>
              <ul className="space-y-2 text-xs text-[#E6D1A5] pt-2">
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-[#C5A46D]" /> Multi-Committee Control Deck
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-[#C5A46D]" /> Complete Procedural Audit Trails
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-[#C5A46D]" /> Conference Accreditation &amp; Verification
                </li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* ─── 8. SECURITY & CONTROL ─── */}
      <section className="py-24 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-[#111318] border border-[#232731] rounded-3xl p-8 sm:p-14 relative overflow-hidden text-left">
          <div className="max-w-2xl space-y-5">
            <DiasBadge variant="gold" size="sm">
              SOVEREIGN SECURITY
            </DiasBadge>
            <h2 className="text-3xl sm:text-5xl font-serif text-[#F4F2ED]">
              Protection for <span className="italic text-[#C5A46D]">High-Stakes Deliberations.</span>
            </h2>
            <p className="text-xs sm:text-sm text-[#9A9DA5] leading-relaxed">
              Every vote, speech, and document transfer is guarded by server-side authorization. Private and restricted sessions are cryptographically separated from public feeds.
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-4">
              <div className="flex items-start gap-3">
                <Lock className="w-4 h-4 text-[#C5A46D] shrink-0 mt-0.5" />
                <div className="space-y-0.5">
                  <h4 className="text-xs font-semibold text-[#F4F2ED]">Zero Leakage Private Sessions</h4>
                  <p className="text-[11px] text-[#9A9DA5]">Restricted crisis and intelligence briefings are invisible in public APIs.</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <Vote className="w-4 h-4 text-[#C5A46D] shrink-0 mt-0.5" />
                <div className="space-y-0.5">
                  <h4 className="text-xs font-semibold text-[#F4F2ED]">Confidential Division Ballots</h4>
                  <p className="text-[11px] text-[#9A9DA5]">Voter IDs are stripped before tallies are emitted to the chamber.</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ─── 9. FINAL CTA: "THE FLOOR IS YOURS." WITH HOMEPAGE BUTTONS ─── */}
      <section className="py-28 border-t border-[#181B21] bg-gradient-to-b from-[#08090B] to-[#0A0C0F] text-center px-4">
        <div className="max-w-4xl mx-auto space-y-6">
          <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-[#181B21] border border-[#C5A46D]/40 text-[#C5A46D] shadow-[0_0_30px_rgba(197,164,109,0.2)] mb-2">
            <Gavel className="w-7 h-7" />
          </div>
          <h2 className="text-4xl sm:text-6xl md:text-7xl font-serif text-[#F4F2ED] tracking-tight">
            THE FLOOR <span className="italic text-[#C5A46D]">IS YOURS.</span>
          </h2>
          <p className="text-sm sm:text-base text-[#9A9DA5] max-w-xl mx-auto leading-relaxed">
            Experience the future of Model United Nations moderation. Launch a session or enter as a delegate in seconds.
          </p>
          <div className="pt-4 flex flex-col sm:flex-row items-center justify-center gap-4 font-display">
            <Link href="/dias?dais=true">
              <DiasButton
                variant="gold"
                size="lg"
                rightIcon={<ArrowRight className="w-4 h-4 ml-1 group-hover:translate-x-1 transition-transform" />}
              >
                Launch Chair Console
              </DiasButton>
            </Link>
            <Link href="/dias?create=true">
              <DiasButton
                variant="white"
                size="lg"
                rightIcon={<Sparkles className="w-4 h-4 ml-1 text-amber-500 group-hover:rotate-12 transition-transform" />}
              >
                Open Setup Studio
              </DiasButton>
            </Link>
            <a href="#gateways">
              <DiasButton variant="charcoal" size="lg">
                Diplomatic Gateways
              </DiasButton>
            </a>
          </div>
        </div>
      </section>

      {/* ─── 10. PREMIUM FOOTER ─── */}
      <DiasFooter />
    </div>
  );
}
