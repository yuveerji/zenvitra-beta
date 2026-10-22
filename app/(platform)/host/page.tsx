'use client';

import React, { useState, Suspense } from 'react';
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
} from 'lucide-react';
import ZenMunMasterDais from '@/components/mun/zenmun/ZenMunMasterDais';
import ZenHostLiveDais from '@/components/host/ZenHostLiveDais';
import CustomEventBuilderModal from '@/components/host/CustomEventBuilderModal';
import {
  HOST_FORMAT_PRESETS,
  HostSessionFormat,
  CustomHostEventConfig,
} from '@/types/zenHost';

export const dynamic = 'force-dynamic';

function HostDashboardInner() {
  const router = useRouter();
  const searchParams = useSearchParams();

  // Custom Event Builder Modal State
  const [isCustomModalOpen, setIsCustomModalOpen] = useState(false);
  const [activeCustomConfig, setActiveCustomConfig] = useState<CustomHostEventConfig | undefined>(undefined);

  const formatParam = searchParams?.get('format') as HostSessionFormat | null;
  const roomParam = searchParams?.get('room') || searchParams?.get('chamber') || undefined;
  const titleParam = searchParams?.get('title') || undefined;

  // If URL flags indicate dais/control or setup mode, load the Dais directly
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

  // State for Instant Session Modal / Join Input
  const [selectedFormat, setSelectedFormat] = useState<HostSessionFormat>('general');
  const [sessionTitle, setSessionTitle] = useState('');
  const [joinCodeInput, setJoinCodeInput] = useState('');
  const [isInstantModalOpen, setIsInstantModalOpen] = useState(false);

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

  return (
    <div className="min-h-screen bg-[#03050a] text-white font-sans antialiased selection:bg-cyan-500/25 selection:text-cyan-200 relative overflow-hidden">
      {/* ── AMBIENT LASER & GRID VISUALS (GAVELLING-TIER ILLUMINATION) ── */}
      <div className="fixed inset-0 pointer-events-none opacity-[0.035] bg-[linear-gradient(to_right,#ffffff_1px,transparent_1px),linear-gradient(to_bottom,#ffffff_1px,transparent_1px)] bg-[size:4rem_4rem]" />
      <div className="fixed -top-40 left-1/2 -translate-x-1/2 w-[800px] h-[500px] pointer-events-none opacity-30 bg-[radial-gradient(ellipse_at_center,rgba(6,182,212,0.35),rgba(20,184,166,0.12),transparent_70%)] blur-[90px]" />
      <div className="fixed bottom-0 right-0 w-[600px] h-[450px] pointer-events-none opacity-20 bg-[radial-gradient(ellipse_at_center,rgba(245,158,11,0.25),transparent_70%)] blur-[100px]" />

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
              Universal live-session infrastructure, event command rooms, and diplomatic presidiums. Built for Model UN, debates, open mics, storylines, workshops, and competitions.
            </p>
          </div>

          {/* Quick Engine Telemetry & Instant Actions */}
          <div className="flex flex-wrap items-center gap-3 shrink-0">
            <Link
              href="/host?dais=true&format=open_mic"
              className="px-4 py-2.5 rounded-2xl bg-gradient-to-r from-amber-500 via-amber-400 to-amber-300 hover:brightness-110 text-black font-black font-space text-xs uppercase tracking-wider transition shadow-[0_0_25px_rgba(245,158,11,0.35)] active:scale-95 flex items-center gap-2"
            >
              <Mic className="w-4 h-4 text-black" />
              <span>Instant Open Mic</span>
            </Link>
            <button
              type="button"
              onClick={() => setIsCustomModalOpen(true)}
              className="px-4 py-2.5 rounded-2xl bg-cyan-950/40 hover:bg-cyan-900/50 border border-cyan-400/40 text-cyan-300 text-xs font-black font-space uppercase tracking-wider transition shadow-[0_0_20px_rgba(6,182,212,0.2)] active:scale-95 flex items-center gap-2 cursor-pointer backdrop-blur-md"
            >
              <Sliders className="w-4 h-4 text-cyan-400" />
              <span>Custom Event (Toggles)</span>
            </button>
            <Link
              href="/host?dais=true&format=mun"
              className="px-4 py-2.5 rounded-2xl bg-white/[0.04] border border-white/15 hover:border-cyan-400/50 hover:bg-white/[0.08] text-neutral-200 hover:text-white text-xs font-bold font-space uppercase tracking-wider transition flex items-center gap-2 backdrop-blur-md"
            >
              <Gavel className="w-4 h-4 text-amber-400" />
              <span>MUN Dais</span>
            </Link>
          </div>
        </header>

        {/* ── 2. PRIMARY ACTION TRIAD ── */}
        <section className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Card 1: Instant Session */}
          <div className="p-7 rounded-3xl bg-[#060a14]/90 border border-cyan-500/30 shadow-[0_10px_40px_rgba(0,0,0,0.6)] relative overflow-hidden group hover:border-cyan-400/70 transition-all duration-300 flex flex-col justify-between backdrop-blur-xl">
            <div className="absolute top-0 right-0 w-36 h-36 bg-cyan-500/15 rounded-full blur-3xl group-hover:bg-cyan-500/25 transition duration-500" />
            <div className="space-y-4 relative z-10">
              <div className="w-12 h-12 rounded-2xl bg-cyan-500/15 border border-cyan-500/40 flex items-center justify-center text-cyan-300 shadow-[0_0_15px_rgba(6,182,212,0.2)]">
                <Play className="w-5 h-5 fill-current" />
              </div>
              <div className="space-y-1.5">
                <div className="text-[10px] font-mono font-bold uppercase tracking-[0.2em] text-cyan-400">RAPID DEPLOY</div>
                <h3 className="text-xl font-black font-space text-white tracking-tight uppercase">Instant Session</h3>
                <p className="text-xs text-neutral-400 leading-relaxed font-outfit">
                  Generate a room code in seconds. Pick any format and start chairing immediately.
                </p>
              </div>
            </div>

            <button
              type="button"
              onClick={() => setIsInstantModalOpen(true)}
              className="mt-6 w-full py-3 rounded-2xl bg-gradient-to-r from-cyan-500 to-teal-400 hover:from-cyan-400 hover:to-teal-300 text-black font-black font-space text-xs uppercase tracking-wider transition shadow-[0_0_25px_rgba(6,182,212,0.35)] active:scale-98 flex items-center justify-center gap-2 cursor-pointer"
            >
              <span>Launch Session &rarr;</span>
            </button>
          </div>

          {/* Card 2: Join Existing Session */}
          <div className="p-7 rounded-3xl bg-[#060a14]/90 border border-white/10 shadow-[0_10px_40px_rgba(0,0,0,0.6)] relative overflow-hidden group hover:border-amber-500/50 transition-all duration-300 flex flex-col justify-between backdrop-blur-xl">
            <div className="absolute top-0 right-0 w-36 h-36 bg-amber-500/15 rounded-full blur-3xl group-hover:bg-amber-500/25 transition duration-500" />
            <div className="space-y-4 relative z-10">
              <div className="w-12 h-12 rounded-2xl bg-amber-500/15 border border-amber-500/40 flex items-center justify-center text-amber-300 shadow-[0_0_15px_rgba(245,158,11,0.2)]">
                <KeyRound className="w-5 h-5" />
              </div>
              <div className="space-y-1.5">
                <div className="text-[10px] font-mono font-bold uppercase tracking-[0.2em] text-amber-400">PARTICIPANT GATEWAY</div>
                <h3 className="text-xl font-black font-space text-white tracking-tight uppercase">Join Session</h3>
                <p className="text-xs text-neutral-400 leading-relaxed font-outfit">
                  Enter a room code or session PIN to join as a delegate, speaker, or spectator.
                </p>
              </div>
            </div>

            <form onSubmit={handleJoinByCode} className="mt-6 flex items-center gap-2 relative z-10">
              <input
                type="text"
                maxLength={8}
                value={joinCodeInput}
                onChange={(e) => setJoinCodeInput(e.target.value.toUpperCase())}
                placeholder="ROOM CODE..."
                className="flex-1 px-3.5 py-2.5 rounded-xl bg-black/60 border border-white/15 text-xs font-mono font-bold tracking-widest text-amber-300 placeholder-neutral-600 focus:outline-none focus:border-amber-400"
              />
              <button
                type="submit"
                className="px-4 py-2.5 rounded-xl bg-gradient-to-r from-amber-500 to-amber-400 hover:brightness-110 text-black font-black font-space text-xs uppercase cursor-pointer transition shadow-[0_0_20px_rgba(245,158,11,0.3)] active:scale-95 shrink-0"
              >
                Join
              </button>
            </form>
          </div>

          {/* Card 3: Full Event Organizer & MUN */}
          <div className="p-7 rounded-3xl bg-[#060a14]/90 border border-white/10 shadow-[0_10px_40px_rgba(0,0,0,0.6)] relative overflow-hidden group hover:border-purple-500/50 transition-all duration-300 flex flex-col justify-between backdrop-blur-xl">
            <div className="absolute top-0 right-0 w-36 h-36 bg-purple-500/15 rounded-full blur-3xl group-hover:bg-purple-500/25 transition duration-500" />
            <div className="space-y-4 relative z-10">
              <div className="w-12 h-12 rounded-2xl bg-purple-500/15 border border-purple-500/40 flex items-center justify-center text-purple-300 shadow-[0_0_15px_rgba(168,85,247,0.2)]">
                <Calendar className="w-5 h-5" />
              </div>
              <div className="space-y-1.5">
                <div className="text-[10px] font-mono font-bold uppercase tracking-[0.2em] text-purple-400">ENTERPRISE SUMMITS</div>
                <h3 className="text-xl font-black font-space text-white tracking-tight uppercase">Full Event Mode</h3>
                <p className="text-xs text-neutral-400 leading-relaxed font-outfit">
                  Multi-session summits, delegate allotments, registration passes, schedules, and staff.
                </p>
              </div>
            </div>

            <Link
              href="/host?setup=true"
              className="mt-6 w-full py-3 rounded-2xl bg-white/[0.06] hover:bg-white/[0.12] text-white font-black font-space text-xs uppercase tracking-wider transition border border-white/15 active:scale-98 flex items-center justify-center gap-2 text-center"
            >
              <span>Create Event Wizard &rarr;</span>
            </Link>
          </div>
        </section>

        {/* ── 3. SESSION FORMAT SELECTOR ── */}
        <section className="space-y-6 pt-4">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-white/[0.08] pb-4">
            <div>
              <h2 className="text-2xl font-black font-space text-white tracking-tight uppercase">
                Supported Formats &amp; Presets
              </h2>
              <p className="text-xs text-neutral-400 mt-1 font-outfit">
                Each format loads dedicated procedural timers, queue algorithms, and participant roles.
              </p>
            </div>
            <div className="flex items-center gap-3">
              <span className="text-xs font-mono font-bold text-cyan-400 px-3 py-1 rounded-full bg-cyan-950/50 border border-cyan-500/30">
                {Object.keys(HOST_FORMAT_PRESETS).length} Configured Engines
              </span>
              <button
                type="button"
                onClick={() => setIsCustomModalOpen(true)}
                className="px-3 py-1.5 rounded-xl bg-cyan-500/10 hover:bg-cyan-500/20 border border-cyan-400/30 text-cyan-300 text-xs font-bold font-space transition flex items-center gap-1.5"
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

        {/* ── 4. STAGE DISPLAY & AUDIENCE PORTAL LINKS ── */}
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

      {/* ── INSTANT LAUNCH MODAL ── */}
      {isInstantModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-4 animate-fade-in">
          <div className="w-full max-w-md rounded-3xl bg-[#080d1a] border border-cyan-500/30 p-6 space-y-5 text-white shadow-2xl">
            <div className="flex items-center justify-between border-b border-white/10 pb-3">
              <h3 className="text-lg font-black uppercase tracking-tight">Configure Instant Session</h3>
              <button
                type="button"
                onClick={() => setIsInstantModalOpen(false)}
                className="text-neutral-400 hover:text-white p-1 cursor-pointer"
              >
                &times;
              </button>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-[10px] font-bold uppercase tracking-wider text-neutral-400 mb-1">
                  Session Title
                </label>
                <input
                  type="text"
                  value={sessionTitle}
                  onChange={(e) => setSessionTitle(e.target.value)}
                  placeholder="e.g. Lok Sabha Winter Session, Open Mic Night #4..."
                  className="w-full px-3.5 py-2 rounded-xl bg-black/50 border border-white/15 text-xs text-white focus:outline-none focus:border-cyan-400"
                />
              </div>

              <div>
                <label className="block text-[10px] font-bold uppercase tracking-wider text-neutral-400 mb-1">
                  Format
                </label>
                <select
                  value={selectedFormat}
                  onChange={(e) => setSelectedFormat(e.target.value as HostSessionFormat)}
                  className="w-full px-3.5 py-2 rounded-xl bg-black/50 border border-white/15 text-xs text-white focus:outline-none focus:border-cyan-400"
                >
                  {(Object.keys(HOST_FORMAT_PRESETS) as HostSessionFormat[]).map((k) => (
                    <option key={k} value={k} className="bg-[#080d1a] text-white">
                      {HOST_FORMAT_PRESETS[k].name} ({HOST_FORMAT_PRESETS[k].badge})
                    </option>
                  ))}
                </select>
              </div>

              <div className="pt-2">
                <button
                  type="button"
                  onClick={() => handleLaunchInstantSession()}
                  className="w-full py-3 rounded-2xl bg-gradient-to-r from-cyan-500 to-teal-400 hover:from-cyan-400 hover:to-teal-300 text-black font-black text-xs uppercase tracking-wider transition shadow-lg shadow-cyan-500/25 active:scale-95 cursor-pointer"
                >
                  START SESSION NOW &rarr;
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
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
