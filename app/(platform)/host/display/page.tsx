'use client';

import React, { Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import { useZenMun, ZenMunProvider } from '@/context/ZenMunContext';
import { Sparkles, Mic, Clock, QrCode, Lock } from 'lucide-react';
import { HOST_FORMAT_PRESETS, HostSessionFormat } from '@/types/zenHost';

export const dynamic = 'force-dynamic';

function PublicStageDisplayInner() {
  const { session } = useZenMun();
  const searchParams = useSearchParams();

  const formatParam = (searchParams?.get('format') as HostSessionFormat) || 'open_mic';
  const roomParam = searchParams?.get('room') || session.sessionCode || 'ZH-LIVE';
  const formatPreset = HOST_FORMAT_PRESETS[formatParam] || HOST_FORMAT_PRESETS.general;
  const isVotingDisabled = searchParams?.get('voting') === 'false' || searchParams?.get('voting') === 'off' || searchParams?.get('voting') === 'disabled';

  const activeDelegate = session.roster.find((d) => d.id === session.currentSpeakerId) || session.roster[0];

  const formatTime = (totalSec: number) => {
    const mins = Math.floor(Math.max(0, totalSec) / 60);
    const secs = Math.max(0, totalSec) % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const isAmber = session.remainingSeconds <= 30 && session.remainingSeconds > 0;
  const isRed = session.remainingSeconds === 0 && session.isTimerRunning;
  const progressRatio = session.speakingTimeSeconds > 0
    ? Math.max(0, Math.min(1, session.remainingSeconds / session.speakingTimeSeconds))
    : 0;

  const hasCountryCode = Boolean(activeDelegate?.countryCode);

  return (
    <div className="min-h-screen bg-[#020307] text-white flex flex-col justify-between p-8 sm:p-14 select-none relative overflow-hidden font-sans">
      {/* Ambient Laser Halos & Tech Grid (Theatrical Stage Illumination) */}
      <div className="fixed inset-0 pointer-events-none opacity-[0.03] bg-[linear-gradient(to_right,#ffffff_1px,transparent_1px),linear-gradient(to_bottom,#ffffff_1px,transparent_1px)] bg-[size:5rem_5rem]" />
      <div className="fixed -top-40 left-1/2 -translate-x-1/2 w-[900px] h-[500px] pointer-events-none opacity-25 bg-[radial-gradient(ellipse_at_center,rgba(245,158,11,0.35),rgba(6,182,212,0.1),transparent_70%)] blur-[100px]" />
      <div className="fixed -bottom-40 left-1/2 -translate-x-1/2 w-[800px] h-[400px] pointer-events-none opacity-20 bg-[radial-gradient(ellipse_at_center,rgba(6,182,212,0.3),transparent_70%)] blur-[100px]" />

      {/* Top Banner */}
      <header className="flex items-center justify-between border-b border-white/[0.08] pb-6 relative z-10 backdrop-blur-md">
        <div className="space-y-1.5">
          <div className="flex flex-wrap items-center gap-2">
            <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-amber-950/60 border border-amber-500/40 text-amber-300 text-xs font-mono font-bold tracking-[0.2em] uppercase shadow-[0_0_15px_rgba(245,158,11,0.25)]">
              <Sparkles className="w-3.5 h-3.5 text-amber-400" />
              <span>{formatPreset.badge}</span>
            </div>
            {isVotingDisabled && (
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-red-950/80 border border-red-500/40 text-red-300 text-xs font-mono font-bold tracking-[0.2em] uppercase shadow-[0_0_15px_rgba(239,68,68,0.2)]">
                <Lock className="w-3 h-3 text-red-400" />
                <span>Voting Not Allowed</span>
              </div>
            )}
          </div>
          <h1 className="text-xl sm:text-3xl font-black font-space text-white tracking-tight">
            {session.topic || formatPreset.name}
          </h1>
        </div>

        {/* Room Code Badge */}
        <div className="px-6 py-3 rounded-2xl bg-white/[0.04] border border-white/15 text-right font-mono backdrop-blur-xl shadow-[0_0_20px_rgba(245,158,11,0.15)]">
          <div className="text-[10px] text-neutral-400 uppercase tracking-[0.2em] font-bold">JOIN STAGE</div>
          <div className="text-2xl font-black text-amber-300 tracking-widest">
            {roomParam}
          </div>
        </div>
      </header>

      {/* Center Stage: Speaker & Timer */}
      <main className="flex-1 flex flex-col items-center justify-center text-center space-y-8 my-auto relative z-10">
        {/* Active Performer / Speaker */}
        <div className="flex flex-col items-center space-y-4 animate-fade-in">
          <div
            className={`w-40 h-40 sm:w-48 sm:h-48 rounded-full overflow-hidden border-4 transition-all duration-500 shadow-2xl relative flex items-center justify-center ${
              session.isTimerRunning
                ? 'border-amber-400 ring-8 ring-amber-400/25 shadow-[0_0_90px_rgba(245,158,11,0.5)] scale-105 bg-amber-950/40'
                : 'border-white/20 ring-4 ring-white/5 bg-white/5'
            }`}
          >
            {hasCountryCode ? (
              <img
                src={`https://flagcdn.com/w320/${activeDelegate!.countryCode.toLowerCase()}.png`}
                alt={activeDelegate?.name || 'Performer'}
                className="w-full h-full object-cover"
              />
            ) : (
              <Mic className="w-20 h-20 text-amber-300 stroke-[1.5]" />
            )}
            {session.isTimerRunning && (
              <span className="absolute -inset-2 rounded-full border border-amber-400/40 animate-ping pointer-events-none" />
            )}
          </div>

          <div className="space-y-1.5">
            <h2 className="text-3xl sm:text-6xl font-black font-space text-white tracking-tight drop-shadow-xl">
              {activeDelegate?.name || 'Stage Mic Live'}
            </h2>
            <div className="flex items-center justify-center gap-2">
              <span className="text-xs font-mono text-amber-400 uppercase tracking-[0.25em] font-bold">
                {session.isTimerRunning ? 'NOW ON STAGE' : 'STAGE READY'}
              </span>
              {session.isTimerRunning && (
                <div className="flex items-end gap-1 h-3 px-1">
                  <span className="w-0.5 bg-amber-400 rounded-full animate-[pulse_0.6s_ease-in-out_infinite] h-2" />
                  <span className="w-0.5 bg-amber-400 rounded-full animate-[pulse_0.4s_ease-in-out_infinite] h-3" />
                  <span className="w-0.5 bg-amber-300 rounded-full animate-[pulse_0.8s_ease-in-out_infinite] h-2.5" />
                  <span className="w-0.5 bg-amber-400 rounded-full animate-[pulse_0.5s_ease-in-out_infinite] h-1.5" />
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Giant Monospace Timer */}
        <div className="space-y-5 w-full max-w-3xl">
          <div
            className={`font-mono tabular-nums font-black text-8xl sm:text-9xl md:text-[11rem] tracking-tighter transition select-none ${
              isRed
                ? 'text-rose-500 animate-pulse drop-shadow-[0_0_60px_rgba(244,63,94,0.8)]'
                : isAmber
                ? 'text-amber-400 animate-pulse drop-shadow-[0_0_55px_rgba(251,191,36,0.7)]'
                : 'text-white drop-shadow-[0_0_40px_rgba(255,255,255,0.25)]'
            }`}
          >
            {formatTime(session.remainingSeconds)}
          </div>

          {/* Progress Bar */}
          <div className="h-3.5 w-full bg-white/10 rounded-full overflow-hidden p-0.5 border border-white/10 shadow-inner">
            <div
              className={`h-full transition-all duration-300 rounded-full ${
                isRed
                  ? 'bg-rose-500 shadow-[0_0_20px_rgba(244,63,94,0.8)]'
                  : isAmber
                  ? 'bg-gradient-to-r from-amber-500 to-rose-500 shadow-[0_0_20px_rgba(245,158,11,0.6)]'
                  : 'bg-gradient-to-r from-amber-400 via-amber-300 to-teal-400 shadow-[0_0_20px_rgba(6,182,212,0.5)]'
              }`}
              style={{ width: `${progressRatio * 100}%` }}
            />
          </div>
        </div>
      </main>

      {/* Footer / Public Guidance */}
      <footer className="flex items-center justify-between border-t border-white/[0.08] pt-6 text-xs text-neutral-400 font-mono relative z-10">
        <span className="tracking-wider">ZENVITRA UNIVERSAL LIVE STAGE PRESENTATION</span>
        <span className="tracking-wider text-amber-400/80">JOIN SESSION AT ZENVITRA.XYZ/HOST</span>
      </footer>
    </div>
  );
}

export default function PublicStageDisplayPage() {
  return (
    <ZenMunProvider>
      <Suspense fallback={<div className="min-h-screen bg-black text-white flex items-center justify-center font-mono text-xs">Connecting stage display...</div>}>
        <PublicStageDisplayInner />
      </Suspense>
    </ZenMunProvider>
  );
}
