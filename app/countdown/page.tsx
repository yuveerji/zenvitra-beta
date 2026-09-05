'use client';

import React, { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { 
  Volume2, 
  VolumeX, 
  ArrowRight, 
  Lock, 
  Users, 
  Radio
} from 'lucide-react';

export default function CountdownPage() {
  // Target: September 18, 2026, 17:00:00 IST (UTC+05:30)
  const targetDate = new Date('2026-09-18T17:00:00+05:30').getTime();

  const [timeLeft, setTimeLeft] = useState<{
    days: number;
    hours: number;
    minutes: number;
    seconds: number;
  }>({ days: 0, hours: 0, minutes: 0, seconds: 0 });

  const [isAudioMuted, setIsAudioMuted] = useState(false);
  const audioContextRef = useRef<AudioContext | null>(null);
  const isMutedRef = useRef(false);

  const playTickSound = (isTick: boolean) => {
    if (isMutedRef.current) return;
    try {
      const ctx = audioContextRef.current;
      if (!ctx || ctx.state === 'suspended') return;

      const now = ctx.currentTime;
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();

      const freq = isTick ? 1600 : 1100;
      osc.type = 'sine';
      osc.frequency.setValueAtTime(freq, now);
      osc.frequency.exponentialRampToValueAtTime(120, now + 0.04);

      gain.gain.setValueAtTime(0.35, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.05);

      osc.connect(gain);
      gain.connect(ctx.destination);

      osc.start(now);
      osc.stop(now + 0.06);
    } catch {
      // Audio context might not be active yet
    }
  };

  useEffect(() => {
    isMutedRef.current = isAudioMuted;
  }, [isAudioMuted]);

  useEffect(() => {
    const initAudio = () => {
      if (!audioContextRef.current) {
        const AudioCtx = window.AudioContext || (window as any).webkitAudioContext;
        if (AudioCtx) {
          audioContextRef.current = new AudioCtx();
        }
      }
      if (audioContextRef.current && audioContextRef.current.state === 'suspended') {
        audioContextRef.current.resume();
      }
    };

    window.addEventListener('click', initAudio, { once: true });
    window.addEventListener('keydown', initAudio, { once: true });
    window.addEventListener('touchstart', initAudio, { once: true });

    let tickToggle = true;

    const interval = setInterval(() => {
      const now = Date.now();
      const difference = targetDate - now;

      if (difference <= 0) {
        setTimeLeft({ days: 0, hours: 0, minutes: 0, seconds: 0 });
      } else {
        const days = Math.floor(difference / (1000 * 60 * 60 * 24));
        const hours = Math.floor((difference / (1000 * 60 * 60)) % 24);
        const minutes = Math.floor((difference / 1000 / 60) % 60);
        const seconds = Math.floor((difference / 1000) % 60);

        setTimeLeft({ days, hours, minutes, seconds });
        playTickSound(tickToggle);
        tickToggle = !tickToggle;
      }
    }, 1000);

    return () => {
      clearInterval(interval);
      window.removeEventListener('click', initAudio);
      window.removeEventListener('keydown', initAudio);
      window.removeEventListener('touchstart', initAudio);
      if (audioContextRef.current) {
        try {
          audioContextRef.current.close();
        } catch {}
      }
    };
  }, []);

  const toggleSound = () => {
    if (!audioContextRef.current) {
      const AudioCtx = window.AudioContext || (window as any).webkitAudioContext;
      if (AudioCtx) {
        audioContextRef.current = new AudioCtx();
      }
    }
    if (audioContextRef.current && audioContextRef.current.state === 'suspended') {
      audioContextRef.current.resume();
    }
    setIsAudioMuted((prev) => !prev);
  };

  return (
    <div className="min-h-screen bg-[#020305] text-white flex flex-col justify-between selection:bg-amber-400 selection:text-black font-sans relative overflow-x-hidden">
      {/* Background Ambient Glows & Grid */}
      <div className="fixed inset-0 pointer-events-none bg-[radial-gradient(#ffffff0a_1px,transparent_1px)] [background-size:28px_28px] opacity-60 z-0" />
      <div className="fixed top-0 left-1/2 -translate-x-1/2 w-[1000px] h-[450px] bg-gradient-to-b from-amber-500/[0.08] via-rose-500/[0.04] to-transparent blur-[140px] pointer-events-none z-0" />
      <div className="fixed bottom-0 right-0 w-[500px] h-[400px] bg-amber-500/[0.04] blur-[120px] pointer-events-none z-0" />

      {/* Header Bar */}
      <header className="relative z-10 w-full max-w-6xl mx-auto px-6 py-6 flex items-center justify-between border-b border-white/[0.07]">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg bg-amber-500/10 border border-amber-500/30 flex items-center justify-center text-amber-400">
            <Lock className="w-4 h-4" />
          </div>
          <div>
            <div className="font-display font-semibold tracking-wider text-sm text-white">
              ZENVITRA
            </div>
            <div className="font-mono text-[9px] tracking-widest text-amber-400/80 uppercase">
              SYSTEM CONCURRENCY HARDENING
            </div>
          </div>
        </div>

        <div className="flex items-center gap-4">
          <button
            onClick={toggleSound}
            className="flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/[0.05] hover:bg-white/[0.1] border border-white/10 text-xs font-mono text-neutral-300 transition cursor-pointer"
            title={isAudioMuted ? 'Unmute Clock Audio' : 'Mute Clock Audio'}
          >
            {isAudioMuted ? (
              <>
                <VolumeX className="w-3.5 h-3.5 text-neutral-400" />
                <span className="hidden sm:inline text-neutral-400">Audio Muted</span>
              </>
            ) : (
              <>
                <Volume2 className="w-3.5 h-3.5 text-amber-400 animate-pulse" />
                <span className="hidden sm:inline text-amber-300">Ticking Active</span>
              </>
            )}
          </button>
        </div>
      </header>

      {/* Main Center Content */}
      <main className="relative z-10 max-w-4xl mx-auto px-6 py-12 flex-1 flex flex-col items-center justify-center text-center space-y-10">
        {/* Status Badge */}
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-amber-400/[0.07] border border-amber-400/30 text-xs font-mono tracking-widest text-amber-300 uppercase shadow-[0_0_20px_rgba(251,191,36,0.15)]">
          <Radio className="w-3.5 h-3.5 animate-pulse text-amber-400" />
          <span>GLOBAL PLATFORM RE-ARCHITECTING UNDERWAY</span>
        </div>

        {/* Hero Title */}
        <div className="space-y-4 max-w-2xl">
          <h1 className="font-display font-medium text-4xl sm:text-6xl text-white tracking-tight leading-[1.1]">
            Calibrating the <br />
            <span className="font-serif italic font-normal text-amber-200">Sovereign Ecosystem.</span>
          </h1>
          <p className="text-sm sm:text-base text-neutral-400 font-light leading-relaxed">
            Following our initial deployment, our engineering &amp; secretariat council has initiated a temporary systemic freeze to eradicate anomalies, harden protocols, and scale our core infrastructure.
          </p>
        </div>

        {/* Countdown Grid */}
        <div className="w-full max-w-3xl">
          <div className="p-8 sm:p-10 rounded-[2.5rem] bg-[#07090f]/90 border border-white/[0.1] shadow-[0_30px_100px_rgba(0,0,0,0.95)] backdrop-blur-xl space-y-8">
            <div className="flex items-center justify-between border-b border-white/[0.06] pb-4">
              <span className="font-mono text-[10px] sm:text-[11px] tracking-[0.25em] text-neutral-400 uppercase">
                TARGET PROTOCOL UNLOCK
              </span>
              <span className="font-mono text-[10px] sm:text-[11px] text-amber-400 tracking-wider">
                18 SEPT 2026 // 17:00 IST
              </span>
            </div>

            <div className="grid grid-cols-4 gap-3 sm:gap-6">
              {[
                { label: 'DAYS', value: timeLeft.days },
                { label: 'HOURS', value: timeLeft.hours },
                { label: 'MINUTES', value: timeLeft.minutes },
                { label: 'SECONDS', value: timeLeft.seconds },
              ].map((item, index) => (
                <div 
                  key={index}
                  className="flex flex-col items-center justify-center p-4 sm:p-6 rounded-2xl bg-black/60 border border-white/[0.06] shadow-inner"
                >
                  <span className="font-mono text-3xl sm:text-6xl font-bold text-white tracking-tight tabular-nums">
                    {String(item.value).padStart(2, '0')}
                  </span>
                  <span className="font-mono text-[9px] sm:text-[11px] text-neutral-500 tracking-[0.2em] uppercase mt-2">
                    {item.label}
                  </span>
                </div>
              ))}
            </div>

            {/* Sound Indicator Notice */}
            <div className="text-[11px] font-mono text-neutral-500 flex items-center justify-center gap-2">
              <span className="w-2 h-2 rounded-full bg-amber-400/80 animate-ping" />
              <span>Tick-tock telemetry active. Tap anywhere to toggle audio.</span>
            </div>
          </div>
        </div>

        {/* Dedicated Callout: Join Core Team ONLY */}
        <div className="w-full max-w-2xl p-6 sm:p-8 rounded-3xl bg-gradient-to-r from-white/[0.04] via-white/[0.02] to-white/[0.04] border border-white/[0.12] space-y-5 text-center shadow-xl">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-400/[0.08] border border-emerald-400/30 text-[10px] font-mono tracking-widest text-emerald-300 uppercase">
            <Users className="w-3 h-3" />
            <span>EXCLUSIVE CLEARANCE PORTAL</span>
          </div>

          <div className="space-y-1.5">
            <h3 className="font-display font-medium text-xl sm:text-2xl text-white">
              Core Team Ingestion Remains Open
            </h3>
            <p className="text-xs sm:text-sm text-neutral-400 max-w-md mx-auto leading-relaxed">
              We are assembling executive leadership, engineering architects, and secretariat heads. Step forward to take command of the ecosystem.
            </p>
          </div>

          <div className="pt-2">
            <Link
              href="/join-core-team"
              className="inline-flex items-center gap-3 px-8 py-4 rounded-full bg-white text-black font-mono text-xs font-semibold hover:bg-neutral-200 transition shadow-[0_0_30px_rgba(255,255,255,0.25)] group cursor-pointer"
            >
              <span>Apply for Core Team Leadership</span>
              <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
            </Link>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="relative z-10 w-full max-w-6xl mx-auto px-6 py-6 border-t border-white/[0.06] flex flex-col sm:flex-row items-center justify-between gap-4 text-[11px] font-mono text-neutral-500">
        <span>ZENVITRA PROTOCOL &copy; 2026</span>
        <div className="flex items-center gap-6">
          <Link href="/join-core-team" className="hover:text-white transition">
            Join Core Team
          </Link>
          <span className="text-neutral-700">//</span>
          <span className="text-amber-400/90 font-mono text-[10px] tracking-widest uppercase">
            ALL OTHER PATHS RESTRICTED
          </span>
        </div>
      </footer>
    </div>
  );
}

