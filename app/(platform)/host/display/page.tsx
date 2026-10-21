'use client';

import React, { Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import { useZenMun, ZenMunProvider } from '@/context/ZenMunContext';
import { Sparkles, Mic, Clock, QrCode } from 'lucide-react';
import { HOST_FORMAT_PRESETS, HostSessionFormat } from '@/types/zenHost';

export const dynamic = 'force-dynamic';

function PublicStageDisplayInner() {
  const { session } = useZenMun();
  const searchParams = useSearchParams();

  const formatParam = (searchParams?.get('format') as HostSessionFormat) || 'open_mic';
  const roomParam = searchParams?.get('room') || session.sessionCode || 'ZH-LIVE';
  const formatPreset = HOST_FORMAT_PRESETS[formatParam] || HOST_FORMAT_PRESETS.general;

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
    <div className="min-h-screen bg-[#020306] text-white flex flex-col justify-between p-8 sm:p-14 select-none relative overflow-hidden font-sans">
      {/* Ambient Laser Halo */}
      <div className="fixed inset-0 pointer-events-none opacity-20 bg-[radial-gradient(ellipse_80%_80%_at_50%_-10%,rgba(245,158,11,0.25),rgba(255,255,255,0))]" />

      {/* Top Banner */}
      <header className="flex items-center justify-between border-b border-white/10 pb-6 relative z-10">
        <div className="space-y-1">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-950/60 border border-amber-500/30 text-amber-300 text-xs font-mono font-bold tracking-widest uppercase">
            <Sparkles className="w-3.5 h-3.5 text-amber-400" />
            <span>{formatPreset.badge}</span>
          </div>
          <h1 className="text-xl sm:text-2xl font-black text-white tracking-tight">
            {session.topic || formatPreset.name}
          </h1>
        </div>

        {/* Room Code Badge */}
        <div className="px-5 py-2.5 rounded-2xl bg-white/[0.04] border border-white/15 text-right font-mono">
          <div className="text-[10px] text-neutral-400 uppercase tracking-widest">JOIN STAGE</div>
          <div className="text-xl font-black text-amber-300 tracking-wider">
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
                ? 'border-amber-400 ring-12 ring-amber-400/20 shadow-[0_0_80px_rgba(245,158,11,0.4)] scale-105 bg-amber-950/40'
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
          </div>

          <div className="space-y-1">
            <h2 className="text-3xl sm:text-5xl font-black text-white tracking-tight drop-shadow-lg">
              {activeDelegate?.name || 'Stage Mic Live'}
            </h2>
            <div className="text-sm font-mono text-amber-400 uppercase tracking-wider font-bold">
              {session.isTimerRunning ? 'NOW ON STAGE' : 'STAGE READY'}
            </div>
          </div>
        </div>

        {/* Giant Monospace Timer */}
        <div className="space-y-4 w-full max-w-2xl">
          <div
            className={`font-mono font-black text-8xl sm:text-9xl tracking-tight transition drop-shadow-[0_0_40px_rgba(255,255,255,0.1)] ${
              isRed
                ? 'text-rose-500 animate-pulse drop-shadow-[0_0_50px_rgba(244,63,94,0.7)]'
                : isAmber
                ? 'text-amber-400 animate-pulse drop-shadow-[0_0_40px_rgba(251,191,36,0.6)]'
                : 'text-white'
            }`}
          >
            {formatTime(session.remainingSeconds)}
          </div>

          {/* Progress Bar */}
          <div className="h-3 w-full bg-white/10 rounded-full overflow-hidden p-0.5 border border-white/10">
            <div
              className={`h-full transition-all duration-300 rounded-full ${
                isRed
                  ? 'bg-rose-500 shadow-[0_0_15px_rgba(244,63,94,0.6)]'
                  : isAmber
                  ? 'bg-gradient-to-r from-amber-500 to-rose-500'
                  : 'bg-gradient-to-r from-amber-400 via-amber-300 to-teal-400'
              }`}
              style={{ width: `${progressRatio * 100}%` }}
            />
          </div>
        </div>
      </main>

      {/* Footer / Public Guidance */}
      <footer className="flex items-center justify-between border-t border-white/10 pt-6 text-xs text-neutral-400 font-mono relative z-10">
        <span>ZENVITRA UNIVERSAL LIVE STAGE PRESENTATION</span>
        <span>SCAN ROOM QR OR JOIN AT ZENVITRA.XYZ/HOST/JOIN</span>
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
