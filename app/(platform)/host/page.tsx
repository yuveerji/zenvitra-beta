'use client';

import React, { useState, useEffect, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import {
  Radio,
  Mic,
  BookOpen,
  GraduationCap,
  Users,
  Trophy,
  Shield,
  Sliders,
  Play,
  Plus,
  KeyRound,
  Calendar,
  Sparkles,
  ArrowRight,
  Gavel,
  Clock,
  CheckCircle2,
  Share2,
  Tv,
  Layers,
  Volume2,
  Vote,
  Flame,
  Globe2,
  Landmark,
  FileText,
  AlertCircle,
  HelpCircle,
  Zap,
} from 'lucide-react';
import ZenMunMasterDais from '@/components/mun/zenmun/ZenMunMasterDais';
import ZenHostLiveDais from '@/components/host/ZenHostLiveDais';
import CustomEventBuilderModal from '@/components/host/CustomEventBuilderModal';
import StageAmbientBackground from '@/components/host/StageAmbientBackground';
import {
  HOST_FORMAT_PRESETS,
  HostSessionFormat,
  CustomHostEventConfig,
} from '@/types/zenHost';

export const dynamic = 'force-dynamic';

function HostDashboardInner() {
  const router = useRouter();
  const searchParams = useSearchParams();

  // ── 1. ALL HOOKS CALLED UNCONDITIONALLY AT THE TOP LEVEL (REACT RULES OF HOOKS) ──
  const [isCustomModalOpen, setIsCustomModalOpen] = useState(false);
  const [activeCustomConfig, setActiveCustomConfig] = useState<CustomHostEventConfig | undefined>(undefined);
  const [selectedFormat, setSelectedFormat] = useState<HostSessionFormat>('open_mic');
  const [sessionTitle, setSessionTitle] = useState('');
  const [joinCodeInput, setJoinCodeInput] = useState('');
  const [isInstantModalOpen, setIsInstantModalOpen] = useState(false);
  const [storedSession, setStoredSession] = useState<{
    code?: string;
    title?: string;
    type?: string;
  } | null>(null);

  useEffect(() => {
    if (typeof window === 'undefined') return;
    try {
      const rawMun = localStorage.getItem('zenvitra_zenmun_live_session_v1');
      if (rawMun) {
        const parsed = JSON.parse(rawMun);
        if (parsed?.sessionCode && parsed?.committeeName) {
          setStoredSession({
            code: parsed.sessionCode,
            title: parsed.committeeName,
            type: 'MUN Committee Chamber',
          });
        }
      }
    } catch {
      // Ignore
    }
  }, []);

  // ── 2. CONDITIONAL DAIS / SETUP RENDERING AFTER ALL HOOKS ──
  const formatParam = searchParams?.get('format') as HostSessionFormat | null;
  const roomParam = searchParams?.get('room') || searchParams?.get('chamber') || undefined;
  const titleParam = searchParams?.get('title') || undefined;

  const isDaisMode =
    searchParams?.get('control') === 'true' ||
    searchParams?.get('dais') === 'true' ||
    Boolean(searchParams?.get('chamber')) ||
    Boolean(searchParams?.get('room'));

  const isSetupMode =
    searchParams?.get('create') === 'true' ||
    searchParams?.get('new') === 'true' ||
    searchParams?.get('setup') === 'true';

  if (isDaisMode) {
    if (formatParam === 'mun' || Boolean(searchParams?.get('chamber'))) {
      return <ZenMunMasterDais initialView="chair" />;
    }
    // Universal Live Dais for Open Mic, Workshop, Showcase, Competition, etc.
    return (
      <ZenHostLiveDais
        initialFormat={formatParam || 'open_mic'}
        sessionCode={roomParam}
        initialTitle={titleParam}
        customConfig={activeCustomConfig}
        onExit={() => router.push('/host')}
      />
    );
  }

  if (isSetupMode) {
    if (formatParam === 'mun') {
      return <ZenMunMasterDais initialView="setup" />;
    }
    return (
      <ZenHostLiveDais
        initialFormat={formatParam || 'open_mic'}
        sessionCode={roomParam}
        initialTitle={titleParam}
        customConfig={activeCustomConfig}
        onExit={() => router.push('/host')}
      />
    );
  }

  const handleLaunchInstantSession = (formatKey?: HostSessionFormat) => {
    const fmt = formatKey || selectedFormat;
    const title = sessionTitle.trim() || HOST_FORMAT_PRESETS[fmt].name;
    // Route to Dais with query parameters
    router.push(`/host?dais=true&format=${fmt}&title=${encodeURIComponent(title)}`);
  };

  const handleJoinByCode = (e: React.FormEvent) => {
    e.preventDefault();
    const clean = joinCodeInput.trim().toUpperCase();
    if (clean) {
      router.push(`/host?room=${clean}&control=true`);
    }
  };

  const activePreset = HOST_FORMAT_PRESETS[selectedFormat] || HOST_FORMAT_PRESETS.general;

  return (
    <div className="min-h-screen bg-[#020307] text-white font-sans antialiased selection:bg-cyan-500/25 selection:text-cyan-200 relative overflow-hidden">
      {/* ── STAGE AMBIENT THEATRICAL BACKGROUND ── */}
      <StageAmbientBackground theme="host" />

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-12">
        {/* ── 1. HEADER BANNER ── */}
        <header className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6 border-b border-white/[0.08] pb-8">
          <div className="space-y-2.5">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-950/60 border border-cyan-500/40 text-cyan-300 text-[10px] font-mono font-bold tracking-[0.2em] uppercase shadow-[0_0_15px_rgba(6,182,212,0.2)]">
              <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 animate-ping" />
              <Sparkles className="w-3.5 h-3.5 text-amber-400" />
              <span>BY YOUTH. FOR YOUTH. &bull; LIVE SESSION OS</span>
            </div>
            <h1 className="text-3xl sm:text-5xl font-black font-space text-white tracking-tight uppercase">
              ZEN.HOST <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 via-teal-300 to-amber-300">&amp; DAIS</span>
            </h1>
            <p className="text-sm sm:text-base text-neutral-400 max-w-2xl leading-relaxed font-outfit">
              Universal live-session infrastructure, event command rooms, and diplomatic presidiums. Built for Model UN, debates, open mics, workshops, storylines, and competitions.
            </p>
          </div>

          {/* Quick Engine Telemetry & Actions */}
          <div className="flex flex-wrap items-center gap-3 shrink-0">
            <button
              type="button"
              onClick={() => handleLaunchInstantSession('open_mic')}
              className="px-4 py-2.5 rounded-2xl bg-gradient-to-r from-amber-500 via-amber-400 to-amber-300 hover:brightness-110 text-black font-black font-space text-xs uppercase tracking-wider transition shadow-[0_0_25px_rgba(245,158,11,0.35)] active:scale-95 flex items-center gap-2 cursor-pointer"
            >
              <Mic className="w-4 h-4 text-black" />
              <span>Instant Open Mic</span>
            </button>
            <Link
              href="/committee"
              className="px-4 py-2.5 rounded-2xl bg-amber-950/40 hover:bg-amber-900/50 border border-amber-500/40 text-amber-300 text-xs font-black font-space uppercase tracking-wider transition shadow-[0_0_20px_rgba(245,158,11,0.25)] flex items-center gap-2 backdrop-blur-md"
            >
              <Gavel className="w-4 h-4 text-amber-400" />
              <span>Committee Chambers</span>
            </Link>
            <button
              type="button"
              onClick={() => setIsCustomModalOpen(true)}
              className="px-4 py-2.5 rounded-2xl bg-cyan-950/40 hover:bg-cyan-900/50 border border-cyan-400/40 text-cyan-300 text-xs font-black font-space uppercase tracking-wider transition shadow-[0_0_20px_rgba(6,182,212,0.2)] active:scale-95 flex items-center gap-2 cursor-pointer backdrop-blur-md"
            >
              <Sliders className="w-4 h-4 text-cyan-400" />
              <span>Custom Studio</span>
            </button>
            <Link
              href="/host/display"
              className="px-4 py-2.5 rounded-2xl bg-white/[0.04] border border-white/15 hover:border-cyan-400/50 hover:bg-white/[0.08] text-neutral-200 hover:text-white text-xs font-bold font-space uppercase tracking-wider transition flex items-center gap-2 backdrop-blur-md"
            >
              <Tv className="w-4 h-4 text-cyan-400" />
              <span>Display Feed</span>
            </Link>
          </div>
        </header>

        {/* ── 2. ACTIVE SESSION RADAR (IF DETECTED) ── */}
        {storedSession && (
          <section className="p-6 rounded-3xl bg-gradient-to-r from-cyan-950/40 via-[#060a14] to-black border border-cyan-500/30 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 backdrop-blur-xl shadow-[0_10px_35px_rgba(0,0,0,0.5)]">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-2xl bg-cyan-500/20 border border-cyan-500/40 flex items-center justify-center text-cyan-300 shrink-0 shadow-[0_0_15px_rgba(6,182,212,0.25)]">
                <Radio className="w-6 h-6 animate-pulse text-cyan-400" />
              </div>
              <div className="space-y-0.5">
                <div className="flex items-center gap-2">
                  <span className="px-2 py-0.5 rounded-full bg-cyan-500/20 text-cyan-300 font-mono text-[9px] font-bold uppercase tracking-wider border border-cyan-500/40">
                    ACTIVE STAGE DETECTED
                  </span>
                  <span className="font-mono text-xs text-neutral-400">
                    PIN: <strong className="text-white tracking-widest">{storedSession.code}</strong>
                  </span>
                </div>
                <h4 className="text-lg font-black font-space text-white">{storedSession.title}</h4>
                <div className="text-[10px] text-neutral-400 font-outfit">{storedSession.type}</div>
              </div>
            </div>

            <div className="flex items-center gap-2 shrink-0">
              <Link
                href={`/host?room=${storedSession.code}&control=true`}
                className="px-5 py-2.5 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-black font-black font-space text-xs uppercase tracking-wider transition shadow-md shadow-cyan-500/20"
              >
                Resume Dais &rarr;
              </Link>
            </div>
          </section>
        )}

        {/* ── 3. INTERACTIVE STAGE DISPATCHER HERO ── */}
        <section className="p-7 sm:p-8 rounded-3xl bg-gradient-to-br from-[#060a14] via-[#040711] to-[#020409] border border-white/[0.09] shadow-[0_20px_60px_rgba(0,0,0,0.7)] backdrop-blur-2xl relative overflow-hidden">
          <div className="absolute top-0 right-0 w-96 h-96 bg-cyan-500/10 rounded-full blur-[100px] pointer-events-none" />

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center relative z-10">
            {/* Left 7 Cols: Quick Format Switcher & Launch Panel */}
            <div className="lg:col-span-7 space-y-6">
              <div className="space-y-2">
                <div className="text-[10px] font-mono font-bold uppercase tracking-[0.2em] text-cyan-400">
                  RAPID STAGE DISPATCHER
                </div>
                <h2 className="text-2xl sm:text-3xl font-black font-space text-white tracking-tight uppercase">
                  Select Format &amp; Launch in 1 Click
                </h2>
                <p className="text-xs text-neutral-400 font-outfit max-w-xl">
                  Choose your procedural preset below. The engine configures timers, performer queues, sound effects, and voting rules automatically.
                </p>
              </div>

              {/* Format Pill Selector */}
              <div className="flex flex-wrap gap-2">
                {(Object.keys(HOST_FORMAT_PRESETS) as HostSessionFormat[])
                  .filter((fmt) => fmt !== 'mun')
                  .map((fmtKey) => {
                    const preset = HOST_FORMAT_PRESETS[fmtKey];
                    const isSelected = selectedFormat === fmtKey;
                    return (
                      <button
                        key={fmtKey}
                        type="button"
                        onClick={() => setSelectedFormat(fmtKey)}
                        className={`px-3.5 py-2 rounded-xl text-xs font-bold font-space transition flex items-center gap-2 cursor-pointer ${
                          isSelected
                            ? 'bg-gradient-to-r from-cyan-500 to-teal-400 text-black shadow-[0_0_20px_rgba(6,182,212,0.35)] scale-105'
                            : 'bg-white/[0.04] text-neutral-300 hover:text-white hover:bg-white/[0.08] border border-white/10'
                        }`}
                      >
                        <span>{preset.name.split(' ')[0]}</span>
                        <span className={`text-[9px] font-mono ${isSelected ? 'text-black/80 font-black' : 'text-cyan-400'}`}>
                          {preset.defaultTimer}s
                        </span>
                      </button>
                    );
                  })}
              </div>

              {/* Live Preview Card */}
              <div className="p-4 rounded-2xl bg-black/40 border border-white/10 flex items-center justify-between gap-4">
                <div className="space-y-0.5">
                  <div className="flex items-center gap-2">
                    <span className="px-2 py-0.5 rounded-full bg-cyan-500/20 border border-cyan-500/30 text-cyan-300 text-[9px] font-mono font-bold uppercase">
                      {activePreset.badge}
                    </span>
                    <span className="text-xs font-mono text-neutral-400 tabular-nums font-semibold">
                      {activePreset.defaultTimer}s default slot
                    </span>
                  </div>
                  <h4 className="text-base font-black font-space text-white">{activePreset.name}</h4>
                  <p className="text-xs text-neutral-400 font-outfit line-clamp-1">{activePreset.description}</p>
                </div>

                <button
                  type="button"
                  onClick={() => handleLaunchInstantSession(selectedFormat)}
                  className="px-6 py-3 rounded-xl bg-gradient-to-r from-cyan-500 via-teal-400 to-emerald-400 hover:brightness-110 text-black font-black font-space text-xs uppercase tracking-wider transition shadow-[0_0_25px_rgba(6,182,212,0.4)] active:scale-95 shrink-0 flex items-center gap-2 cursor-pointer"
                >
                  <Play className="w-4 h-4 fill-current" />
                  <span>Launch Dais Now &rarr;</span>
                </button>
              </div>
            </div>

            {/* Right 5 Cols: Quick Room PIN Joiner */}
            <div className="lg:col-span-5 p-6 rounded-2xl bg-black/50 border border-white/10 space-y-4 shadow-inner">
              <div className="space-y-1">
                <div className="text-[10px] font-mono font-bold uppercase tracking-[0.2em] text-amber-400">
                  PARTICIPANT GATEWAY
                </div>
                <h3 className="text-lg font-black font-space text-white uppercase tracking-tight">
                  Join Stage by Room PIN
                </h3>
                <p className="text-xs text-neutral-400 font-outfit">
                  Enter an existing 6-character room code to take the floor as a performer, delegate, or spectator.
                </p>
              </div>

              <form onSubmit={handleJoinByCode} className="space-y-3">
                <div className="flex items-center gap-2">
                  <input
                    type="text"
                    maxLength={8}
                    value={joinCodeInput}
                    onChange={(e) => setJoinCodeInput(e.target.value.toUpperCase())}
                    placeholder="ENTER 6-CHAR PIN..."
                    className="flex-1 px-4 py-3 rounded-xl bg-black/70 border border-white/15 text-sm font-mono font-black tracking-widest text-amber-300 placeholder-neutral-600 focus:outline-none focus:border-amber-400"
                  />
                  <button
                    type="submit"
                    className="px-5 py-3 rounded-xl bg-gradient-to-r from-amber-500 to-amber-400 hover:brightness-110 text-black font-black font-space text-xs uppercase cursor-pointer transition shadow-[0_0_20px_rgba(245,158,11,0.3)] active:scale-95 shrink-0"
                  >
                    Join Stage
                  </button>
                </div>
                <div className="text-[10px] font-mono text-neutral-500 flex items-center gap-1.5">
                  <KeyRound className="w-3.5 h-3.5 text-neutral-400" />
                  <span>Room codes are case-insensitive alphanumeric PINs.</span>
                </div>
              </form>
            </div>
          </div>
        </section>

        {/* ── 4. ZEN.COMMITTEE MUN PRESIDIUM SHOWCASE ── */}
        <section className="p-8 sm:p-10 rounded-3xl bg-gradient-to-br from-amber-950/40 via-[#070b16] to-[#03050a] border border-amber-500/30 shadow-[0_20px_60px_rgba(0,0,0,0.6)] backdrop-blur-2xl space-y-8 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-[500px] h-[350px] bg-amber-500/10 rounded-full blur-[100px] pointer-events-none" />

          <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6 border-b border-white/[0.08] pb-6 relative z-10">
            <div className="space-y-2">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-950/60 border border-amber-500/40 text-amber-300 text-[10px] font-mono font-bold tracking-[0.2em] uppercase">
                <Gavel className="w-3.5 h-3.5 text-amber-400" />
                <span>SPECIALIZED DIPLOMATIC PRESIDIUM</span>
              </div>
              <h2 className="text-2xl sm:text-4xl font-black font-space text-white tracking-tight uppercase">
                ZEN.COMMITTEE &bull; MUN Chambers
              </h2>
              <p className="text-xs sm:text-sm text-neutral-400 max-w-2xl font-outfit leading-relaxed">
                Dedicated parliamentary simulations with formal Rules of Procedure, General Speakers&apos; Lists, Right to Reply, Moderated Caucuses, Working Papers, and Substantive Voting.
              </p>
            </div>

            <div className="flex flex-wrap items-center gap-3 shrink-0">
              <Link
                href="/committee"
                className="px-6 py-3 rounded-2xl bg-gradient-to-r from-amber-500 via-amber-400 to-amber-300 hover:brightness-110 text-black font-black font-space text-xs uppercase tracking-wider transition shadow-[0_0_25px_rgba(245,158,11,0.35)] active:scale-95 flex items-center gap-2"
              >
                <span>Enter Committee Suite &rarr;</span>
              </Link>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 relative z-10">
            {/* Chamber Card 1: Lok Sabha */}
            <div className="p-5 rounded-2xl bg-black/40 border border-white/10 hover:border-amber-400/50 transition flex flex-col justify-between space-y-4">
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-mono text-amber-400 font-bold uppercase">INDIAN PARLIAMENT</span>
                  <span className="text-[10px] font-mono text-neutral-400">90s GSL</span>
                </div>
                <h4 className="text-base font-black font-space text-white">Lok Sabha (House of the People)</h4>
                <p className="text-xs text-neutral-400 font-outfit line-clamp-2">
                  Zero Hour debates, Calling Attention motions, Division Bell votes, and Legislative Bills.
                </p>
              </div>
              <Link
                href="/committee?chamber=lok_sabha&dais=true"
                className="w-full py-2 rounded-xl bg-white/[0.04] hover:bg-amber-500 hover:text-black text-neutral-300 text-xs font-bold font-space transition flex items-center justify-center gap-1.5 border border-white/10"
              >
                <span>Launch Lok Sabha &rarr;</span>
              </Link>
            </div>

            {/* Chamber Card 2: UNSC */}
            <div className="p-5 rounded-2xl bg-black/40 border border-white/10 hover:border-red-400/50 transition flex flex-col justify-between space-y-4">
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-mono text-red-400 font-bold uppercase">CRISIS &amp; SECURITY</span>
                  <span className="text-[10px] font-mono text-neutral-400">120s GSL</span>
                </div>
                <h4 className="text-base font-black font-space text-white">UN Security Council (UNSC)</h4>
                <p className="text-xs text-neutral-400 font-outfit line-clamp-2">
                  15 member states, P5 permanent veto powers, and Chapter VII legally binding directives.
                </p>
              </div>
              <Link
                href="/committee?chamber=unsc&dais=true"
                className="w-full py-2 rounded-xl bg-white/[0.04] hover:bg-red-500 hover:text-white text-neutral-300 text-xs font-bold font-space transition flex items-center justify-center gap-1.5 border border-white/10"
              >
                <span>Launch UNSC &rarr;</span>
              </Link>
            </div>

            {/* Chamber Card 3: UNGA DISEC */}
            <div className="p-5 rounded-2xl bg-black/40 border border-white/10 hover:border-cyan-400/50 transition flex flex-col justify-between space-y-4">
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-mono text-cyan-400 font-bold uppercase">GENERAL ASSEMBLY</span>
                  <span className="text-[10px] font-mono text-neutral-400">90s GSL</span>
                </div>
                <h4 className="text-base font-black font-space text-white">UNGA (DISEC - First Committee)</h4>
                <p className="text-xs text-neutral-400 font-outfit line-clamp-2">
                  Universal plenary debate, working papers, draft resolutions, and substantive roll-call voting.
                </p>
              </div>
              <Link
                href="/committee?chamber=unga_disec&dais=true"
                className="w-full py-2 rounded-xl bg-white/[0.04] hover:bg-cyan-500 hover:text-black text-neutral-300 text-xs font-bold font-space transition flex items-center justify-center gap-1.5 border border-white/10"
              >
                <span>Launch UNGA &rarr;</span>
              </Link>
            </div>
          </div>
        </section>

        {/* ── 5. OPERATING SYSTEM CAPABILITIES (THE 6 PILLARS) ── */}
        <section className="space-y-6">
          <div className="border-b border-white/[0.08] pb-4">
            <div className="text-[10px] font-mono font-bold uppercase tracking-[0.2em] text-cyan-400">
              CORE CAPABILITIES
            </div>
            <h2 className="text-2xl font-black font-space text-white tracking-tight uppercase">
              The Universal Live Dais Operating System
            </h2>
            <p className="text-xs text-neutral-400 font-outfit mt-1">
              Modular stage architecture engineered for zero latency, tactile chair feedback, and audience engagement.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <div className="p-6 rounded-3xl bg-[#060a14]/80 border border-white/[0.08] space-y-3 backdrop-blur-md">
              <div className="w-12 h-12 rounded-2xl bg-cyan-500/15 border border-cyan-500/30 flex items-center justify-center text-cyan-300">
                <Clock className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-black font-space text-white">Dual Digital Chronometers</h3>
              <p className="text-xs text-neutral-400 font-outfit leading-relaxed">
                Precision countdowns for individual speaker slots with automatic 30-second warning chimes and overtime sensors, paired with an overall event master clock.
              </p>
            </div>

            <div className="p-6 rounded-3xl bg-[#060a14]/80 border border-white/[0.08] space-y-3 backdrop-blur-md">
              <div className="w-12 h-12 rounded-2xl bg-amber-500/15 border border-amber-500/30 flex items-center justify-center text-amber-300">
                <Gavel className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-black font-space text-white">Synthetic Gavel &amp; Sound FX</h3>
              <p className="text-xs text-neutral-400 font-outfit leading-relaxed">
                Web Audio synthesized procedural wooden double-tap gavel strikes (G), time-warning bells (D), time-up buzzers (B), and stadium crowd cheer bursts (A).
              </p>
            </div>

            <div className="p-6 rounded-3xl bg-[#060a14]/80 border border-white/[0.08] space-y-3 backdrop-blur-md">
              <div className="w-12 h-12 rounded-2xl bg-purple-500/15 border border-purple-500/30 flex items-center justify-center text-purple-300">
                <Sliders className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-black font-space text-white">Modular Feature Switchboard</h3>
              <p className="text-xs text-neutral-400 font-outfit leading-relaxed">
                Toggle any tool on or off in real-time under Settings: Voting Allowed vs Fully Off, Participant Queue, On Deck Banner, Sound Effects, Scoring Rubrics, and Stage Notes.
              </p>
            </div>

            <div className="p-6 rounded-3xl bg-[#060a14]/80 border border-white/[0.08] space-y-3 backdrop-blur-md">
              <div className="w-12 h-12 rounded-2xl bg-emerald-500/15 border border-emerald-500/30 flex items-center justify-center text-emerald-300">
                <Users className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-black font-space text-white">Performer Lineup &amp; &apos;On Deck&apos;</h3>
              <p className="text-xs text-neutral-400 font-outfit leading-relaxed">
                Dynamic speaker queue with drag/reorder, rapid stage dispatch, completed acts logging, and an ambient pulsating &apos;On Deck&apos; banner previewing the next speaker.
              </p>
            </div>

            <div className="p-6 rounded-3xl bg-[#060a14]/80 border border-white/[0.08] space-y-3 backdrop-blur-md">
              <div className="w-12 h-12 rounded-2xl bg-blue-500/15 border border-blue-500/30 flex items-center justify-center text-blue-300">
                <Tv className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-black font-space text-white">Auditorium Projector Stage Feed</h3>
              <p className="text-xs text-neutral-400 font-outfit leading-relaxed">
                Dedicated public display view (`/host/display`) designed for auditorium beamers and television screens, completely stripped of private chair controls.
              </p>
            </div>

            <div className="p-6 rounded-3xl bg-[#060a14]/80 border border-white/[0.08] space-y-3 backdrop-blur-md">
              <div className="w-12 h-12 rounded-2xl bg-rose-500/15 border border-rose-500/30 flex items-center justify-center text-rose-300">
                <Trophy className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-black font-space text-white">Judge Scoring Rubrics</h3>
              <p className="text-xs text-neutral-400 font-outfit leading-relaxed">
                Live multi-criterion rating sliders for pitch competitions, debate judging, talent scoring, and stage presence evaluations with exportable scorecards.
              </p>
            </div>
          </div>
        </section>

        {/* ── 6. ALL SUPPORTED FORMAT PRESETS ── */}
        <section className="space-y-6 pt-4">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-white/[0.08] pb-4">
            <div>
              <h2 className="text-2xl font-black font-space text-white tracking-tight uppercase">
                All 10 Universal Event Formats
              </h2>
              <p className="text-xs text-neutral-400 mt-1 font-outfit">
                Each format loads dedicated procedural timers, queue algorithms, and participant roles.
              </p>
            </div>
            <div className="flex items-center gap-3">
              <button
                type="button"
                onClick={() => setIsCustomModalOpen(true)}
                className="px-3.5 py-1.5 rounded-xl bg-cyan-500/10 hover:bg-cyan-500/20 border border-cyan-400/30 text-cyan-300 text-xs font-bold font-space transition flex items-center gap-1.5 cursor-pointer"
              >
                <Sliders className="w-3.5 h-3.5" />
                <span>Custom Builder</span>
              </button>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {(Object.keys(HOST_FORMAT_PRESETS) as HostSessionFormat[]).map((fmtKey) => {
              const item = HOST_FORMAT_PRESETS[fmtKey];

              return (
                <div
                  key={fmtKey}
                  className="p-5 rounded-3xl bg-[#060a14]/80 border border-white/[0.08] hover:border-cyan-400/40 hover:shadow-[0_0_30px_rgba(6,182,212,0.12)] transition-all duration-300 space-y-4 flex flex-col justify-between group backdrop-blur-md"
                >
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="px-2.5 py-0.5 rounded-full bg-white/[0.06] border border-white/10 text-[9px] font-mono font-bold text-neutral-300 uppercase tracking-wider">
                        {item.badge}
                      </span>
                      <span className="text-[10px] font-mono text-cyan-400/90 font-semibold tabular-nums">
                        {item.defaultTimer}s default
                      </span>
                    </div>

                    <div>
                      <h4 className="text-base font-black font-space text-white group-hover:text-cyan-300 transition">
                        {item.name}
                      </h4>
                      <p className="text-xs text-neutral-400 mt-1 leading-relaxed line-clamp-3 font-outfit">
                        {item.description}
                      </p>
                    </div>
                  </div>

                  <button
                    type="button"
                    onClick={() => {
                      if (fmtKey === 'custom') {
                        setIsCustomModalOpen(true);
                      } else {
                        handleLaunchInstantSession(fmtKey);
                      }
                    }}
                    className="w-full py-2.5 rounded-xl bg-white/[0.04] hover:bg-gradient-to-r hover:from-cyan-500 hover:to-teal-400 hover:text-black text-neutral-300 text-xs font-bold font-space transition flex items-center justify-center gap-1.5 cursor-pointer border border-white/10 hover:border-transparent hover:shadow-[0_0_20px_rgba(6,182,212,0.3)]"
                  >
                    <span>{fmtKey === 'custom' ? 'Open Custom Builder' : `Launch as ${item.badge.split(' ')[0]}`}</span>
                    <ArrowRight className="w-3 h-3" />
                  </button>
                </div>
              );
            })}
          </div>
        </section>

        {/* ── 7. STAGE DISPLAY & AUDIENCE PORTAL LINKS ── */}
        <section className="p-6 sm:p-8 rounded-3xl bg-gradient-to-r from-cyan-950/40 via-[#070d1d] to-neutral-950 border border-cyan-500/20 flex flex-col sm:flex-row items-center justify-between gap-6 relative overflow-hidden backdrop-blur-xl shadow-[0_10px_40px_rgba(0,0,0,0.5)]">
          <div className="absolute top-0 right-0 w-80 h-40 bg-cyan-500/10 rounded-full blur-3xl pointer-events-none" />
          <div className="flex items-center gap-4 relative z-10">
            <div className="w-12 h-12 rounded-2xl bg-cyan-500/15 border border-cyan-500/40 flex items-center justify-center text-cyan-300 shrink-0 shadow-[0_0_15px_rgba(6,182,212,0.25)]">
              <Tv className="w-6 h-6" />
            </div>
            <div>
              <h3 className="text-base font-black font-space text-white uppercase tracking-tight">Projector Stage Display</h3>
              <p className="text-xs text-neutral-400 max-w-xl font-outfit">
                Need a clean audience-facing screen for a projector or auditorium display? Open the public display view with zero private controls.
              </p>
            </div>
          </div>

          <Link
            href="/host/display"
            className="px-6 py-3 rounded-2xl bg-white/[0.08] hover:bg-cyan-500 hover:text-black text-white font-bold font-space text-xs uppercase tracking-wider transition border border-white/15 hover:border-transparent shrink-0 shadow-[0_0_20px_rgba(255,255,255,0.05)] hover:shadow-[0_0_25px_rgba(6,182,212,0.3)] relative z-10"
          >
            Launch Display Screen &rarr;
          </Link>
        </section>
      </div>

      {/* ── CUSTOM EVENT BUILDER WITH MODULAR TOGGLES ── */}
      <CustomEventBuilderModal
        isOpen={isCustomModalOpen}
        onClose={() => setIsCustomModalOpen(false)}
        initialConfig={activeCustomConfig}
        onLaunch={(newConfig) => {
          setActiveCustomConfig(newConfig);
          setIsCustomModalOpen(false);
          router.push(
            `/host?dais=true&format=custom&title=${encodeURIComponent(newConfig.eventName)}`
          );
        }}
      />
    </div>
  );
}

export default function HostIndexPage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-[#030407] text-white flex items-center justify-center font-mono text-xs">Loading ZEN.HOST...</div>}>
      <HostDashboardInner />
    </Suspense>
  );
}
