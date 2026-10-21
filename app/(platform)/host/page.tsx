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
import { HOST_FORMAT_PRESETS, HostSessionFormat } from '@/types/zenHost';

export const dynamic = 'force-dynamic';

function HostDashboardInner() {
  const router = useRouter();
  const searchParams = useSearchParams();

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
    <div className="min-h-screen bg-[#030407] text-white font-sans antialiased selection:bg-cyan-500/20 selection:text-cyan-200">
      {/* Ambient Sovereign Background Gradients */}
      <div className="fixed inset-0 pointer-events-none opacity-25 bg-[radial-gradient(ellipse_80%_80%_at_50%_-20%,rgba(6,182,212,0.18),rgba(255,255,255,0))]" />
      <div className="fixed inset-0 pointer-events-none opacity-20 bg-[radial-gradient(ellipse_60%_60%_at_90%_80%,rgba(245,158,11,0.1),rgba(255,255,255,0))]" />

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-12">
        {/* ── 1. HEADER BANNER ── */}
        <header className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6 border-b border-white/10 pb-8">
          <div className="space-y-2">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-950/50 border border-cyan-500/30 text-cyan-300 text-[10px] font-mono font-bold tracking-widest uppercase">
              <Sparkles className="w-3.5 h-3.5 text-amber-400" />
              <span>BY YOUTH. FOR YOUTH. &bull; LIVE SESSION OS</span>
            </div>
            <h1 className="text-3xl sm:text-5xl font-black text-white tracking-tight uppercase">
              ZEN.HOST <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-teal-300">&amp; DAIS</span>
            </h1>
            <p className="text-sm sm:text-base text-neutral-400 max-w-2xl leading-relaxed">
              Universal live-session infrastructure, event command rooms, and diplomatic presidiums. Built for Model UN, debates, open mics, storylines, workshops, and competitions.
            </p>
          </div>

          {/* Quick Engine Telemetry & Instant Actions */}
          <div className="flex flex-wrap items-center gap-3 shrink-0">
            <Link
              href="/host?dais=true&format=open_mic"
              className="px-4 py-2.5 rounded-2xl bg-gradient-to-r from-amber-500 to-amber-400 hover:from-amber-400 hover:to-amber-300 text-black font-black text-xs uppercase tracking-wider transition shadow-lg shadow-amber-500/25 active:scale-95 flex items-center gap-2"
            >
              <Mic className="w-4 h-4" />
              <span>Instant Open Mic</span>
            </Link>
            <Link
              href="/host?dais=true&format=mun"
              className="px-4 py-2.5 rounded-2xl bg-white/[0.05] border border-white/15 hover:border-cyan-400/50 hover:bg-white/[0.08] text-cyan-300 text-xs font-bold uppercase tracking-wider transition flex items-center gap-2"
            >
              <Gavel className="w-4 h-4" />
              <span>MUN Dais</span>
            </Link>
          </div>
        </header>

        {/* ── 2. PRIMARY ACTION TRIAD ── */}
        <section className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Card 1: Instant Session */}
          <div className="p-7 rounded-3xl bg-[#070b16] border border-cyan-500/30 shadow-2xl relative overflow-hidden group hover:border-cyan-400/60 transition duration-300 flex flex-col justify-between">
            <div className="absolute top-0 right-0 w-32 h-32 bg-cyan-500/10 rounded-full blur-2xl group-hover:bg-cyan-500/20 transition" />
            <div className="space-y-4 relative z-10">
              <div className="w-12 h-12 rounded-2xl bg-cyan-500/15 border border-cyan-500/30 flex items-center justify-center text-cyan-300">
                <Play className="w-6 h-6 fill-current" />
              </div>
              <div className="space-y-1">
                <h3 className="text-xl font-black text-white tracking-tight uppercase">Instant Session</h3>
                <p className="text-xs text-neutral-400 leading-relaxed">
                  Generate a room code in seconds. Pick any format and start chairing immediately.
                </p>
              </div>
            </div>

            <button
              type="button"
              onClick={() => setIsInstantModalOpen(true)}
              className="mt-6 w-full py-3 rounded-2xl bg-gradient-to-r from-cyan-500 to-teal-400 hover:from-cyan-400 hover:to-teal-300 text-black font-black text-xs uppercase tracking-wider transition shadow-md shadow-cyan-500/20 active:scale-98 flex items-center justify-center gap-2 cursor-pointer"
            >
              <span>Launch Session &rarr;</span>
            </button>
          </div>

          {/* Card 2: Join Existing Session */}
          <div className="p-7 rounded-3xl bg-[#070b16] border border-white/10 shadow-2xl relative overflow-hidden group hover:border-amber-500/40 transition duration-300 flex flex-col justify-between">
            <div className="absolute top-0 right-0 w-32 h-32 bg-amber-500/10 rounded-full blur-2xl group-hover:bg-amber-500/20 transition" />
            <div className="space-y-4 relative z-10">
              <div className="w-12 h-12 rounded-2xl bg-amber-500/15 border border-amber-500/30 flex items-center justify-center text-amber-300">
                <KeyRound className="w-6 h-6" />
              </div>
              <div className="space-y-1">
                <h3 className="text-xl font-black text-white tracking-tight uppercase">Join Session</h3>
                <p className="text-xs text-neutral-400 leading-relaxed">
                  Enter a 6-digit room code or session PIN to join as a delegate, speaker, or spectator.
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
                className="px-4 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-black font-black text-xs uppercase cursor-pointer transition shadow-md shadow-amber-500/20 active:scale-95 shrink-0"
              >
                Join
              </button>
            </form>
          </div>

          {/* Card 3: Full Event Organizer & MUN */}
          <div className="p-7 rounded-3xl bg-[#070b16] border border-white/10 shadow-2xl relative overflow-hidden group hover:border-purple-500/40 transition duration-300 flex flex-col justify-between">
            <div className="absolute top-0 right-0 w-32 h-32 bg-purple-500/10 rounded-full blur-2xl group-hover:bg-purple-500/20 transition" />
            <div className="space-y-4 relative z-10">
              <div className="w-12 h-12 rounded-2xl bg-purple-500/15 border border-purple-500/30 flex items-center justify-center text-purple-300">
                <Calendar className="w-6 h-6" />
              </div>
              <div className="space-y-1">
                <h3 className="text-xl font-black text-white tracking-tight uppercase">Full Event Mode</h3>
                <p className="text-xs text-neutral-400 leading-relaxed">
                  Multi-session summits, delegate allotments, registration passes, schedules, and staff.
                </p>
              </div>
            </div>

            <Link
              href="/host?setup=true"
              className="mt-6 w-full py-3 rounded-2xl bg-white/10 hover:bg-white/15 text-white font-black text-xs uppercase tracking-wider transition border border-white/15 active:scale-98 flex items-center justify-center gap-2 text-center"
            >
              <span>Create Event Wizard &rarr;</span>
            </Link>
          </div>
        </section>

        {/* ── 3. SESSION FORMAT SELECTOR ── */}
        <section className="space-y-6 pt-4">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-white/10 pb-4">
            <div>
              <h2 className="text-2xl font-black text-white tracking-tight uppercase">
                Supported Formats &amp; Presets
              </h2>
              <p className="text-xs text-neutral-400 mt-0.5">
                Each format loads dedicated procedural timers, queue algorithms, and participant roles.
              </p>
            </div>
            <span className="text-xs font-mono text-cyan-400">8 Configured Engines</span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {(Object.keys(HOST_FORMAT_PRESETS) as HostSessionFormat[]).map((fmtKey) => {
              const item = HOST_FORMAT_PRESETS[fmtKey];

              return (
                <div
                  key={fmtKey}
                  className="p-5 rounded-3xl bg-[#070b16] border border-white/10 hover:border-white/20 transition space-y-4 flex flex-col justify-between group"
                >
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="px-2.5 py-0.5 rounded-full bg-white/5 border border-white/10 text-[9px] font-mono font-bold text-neutral-300 uppercase">
                        {item.badge}
                      </span>
                      <span className="text-[10px] font-mono text-neutral-400">
                        {item.defaultTimer}s default
                      </span>
                    </div>

                    <div>
                      <h4 className="text-base font-black text-white group-hover:text-cyan-300 transition">
                        {item.name}
                      </h4>
                      <p className="text-xs text-neutral-400 mt-1 leading-relaxed line-clamp-3">
                        {item.description}
                      </p>
                    </div>
                  </div>

                  <button
                    type="button"
                    onClick={() => handleLaunchInstantSession(fmtKey)}
                    className="w-full py-2 rounded-xl bg-white/5 hover:bg-cyan-500/20 hover:text-cyan-300 text-neutral-300 text-xs font-bold transition flex items-center justify-center gap-1.5 cursor-pointer border border-white/10"
                  >
                    <span>Launch as {item.badge.split(' ')[0]}</span>
                    <ArrowRight className="w-3 h-3" />
                  </button>
                </div>
              );
            })}
          </div>
        </section>

        {/* ── 4. STAGE DISPLAY & AUDIENCE PORTAL LINKS ── */}
        <section className="p-6 rounded-3xl bg-gradient-to-r from-cyan-950/20 via-black to-neutral-950 border border-white/10 flex flex-col sm:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-2xl bg-cyan-500/10 border border-cyan-500/30 flex items-center justify-center text-cyan-400 shrink-0">
              <Tv className="w-6 h-6" />
            </div>
            <div>
              <h3 className="text-base font-black text-white uppercase">Projector Stage Display</h3>
              <p className="text-xs text-neutral-400 max-w-xl">
                Need a clean audience-facing screen for a projector or auditorium display? Open the public display view with zero private controls.
              </p>
            </div>
          </div>

          <Link
            href="/host/display"
            className="px-5 py-2.5 rounded-xl bg-white/10 hover:bg-white/20 text-white font-bold text-xs uppercase tracking-wider transition border border-white/15 shrink-0"
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
