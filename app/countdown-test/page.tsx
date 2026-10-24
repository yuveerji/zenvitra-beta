'use client';

import React, { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { notFound, useRouter } from 'next/navigation';
import { 
  Volume2, 
  VolumeX, 
  Radio, 
  Sparkles, 
  FastForward, 
  RotateCcw, 
  ShieldAlert, 
  Activity,
  ArrowRight,
  Maximize2
} from 'lucide-react';
import { useLaunchSequence } from '@/components/countdown/useLaunchSequence';
import { ConstellationCanvas } from '@/components/visuals/ConstellationCanvas';

export default function CountdownTestPage() {
  const router = useRouter();
  const [isAuthorizedHost, setIsAuthorizedHost] = useState<boolean | null>(null);

  // Strict Localhost / Dev Guard:
  // If running in production build or accessed on any external host/IP, reject immediately with 404
  useEffect(() => {
    if (typeof window === 'undefined') return;
    const host = window.location.hostname;
    const isLocal = host === 'localhost' || host === '127.0.0.1';
    
    // In production or on remote VPS IP, immediately trigger notFound (404)
    if (!isLocal && process.env.NODE_ENV === 'production') {
      setIsAuthorizedHost(false);
      notFound();
    } else {
      setIsAuthorizedHost(true);
    }
  }, []);

  // Compute a target time corresponding to 2:00:00 PM (14:00:00) today
  const targetDate = React.useMemo(() => {
    const d = new Date();
    d.setHours(14, 0, 0, 0);
    // If 14:00 today has already passed, use next day 14:00 for the base clock
    if (d.getTime() < Date.now()) {
      d.setDate(d.getDate() + 1);
    }
    return d.getTime();
  }, []);

  const handleLocalRedirect = () => {
    // Strictly stay on the current origin (http://localhost:3000/)
    window.location.href = window.location.origin + '/';
  };

  const {
    timeLeft,
    totalRemainingMs,
    phase,
    isDimmed,
    isVideoVisible,
    isWhiteFlashActive,
    videoRef,
    handleVideoTimeUpdate,
    portalAudio,
    jumpToRemainingMs,
    resetSequence,
  } = useLaunchSequence({
    targetTimestamp: targetDate,
    isSimulated: true,
    onRedirect: handleLocalRedirect,
  });

  // Monolith card 3D tilt & mouse cursor effect
  const cardRef = useRef<HTMLDivElement>(null);
  const [rotate, setRotate] = useState({ x: 0, y: 0 });
  const [glow, setGlow] = useState({ x: 50, y: 50, opacity: 0 });

  const handleCardMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!cardRef.current) return;
    const rect = cardRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    const centerX = rect.width / 2;
    const centerY = rect.height / 2;

    const rotateX = ((y - centerY) / centerY) * -9;
    const rotateY = ((x - centerX) / centerX) * 9;

    setRotate({ x: rotateX, y: rotateY });
    setGlow({
      x: (x / rect.width) * 100,
      y: (y / rect.height) * 100,
      opacity: 1,
    });
  };

  const handleCardMouseLeave = () => {
    setRotate({ x: 0, y: 0 });
    setGlow((prev) => ({ ...prev, opacity: 0 }));
  };

  if (isAuthorizedHost === false) {
    return null;
  }

  return (
    <div className="min-h-screen bg-[#020305] text-white flex flex-col justify-between selection:bg-amber-400 selection:text-black font-sans relative overflow-x-hidden">
      
      {/* Background Cyber Grid & Constellation Starfield */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden z-0">
        <div 
          className="absolute inset-0 opacity-[0.14]" 
          style={{ 
            backgroundImage: `linear-gradient(to right, rgba(255, 255, 255, 0.08) 1px, transparent 1px), linear-gradient(to bottom, rgba(255, 255, 255, 0.08) 1px, transparent 1px)`, 
            backgroundSize: '48px 48px' 
          }} 
        />
        <div 
          className="absolute inset-0" 
          style={{ 
            background: 'radial-gradient(circle at 50% 25%, rgba(245, 158, 11, 0.08) 0%, rgba(120, 119, 198, 0.06) 35%, transparent 70%), radial-gradient(circle at 50% 90%, rgba(244, 63, 94, 0.04) 0%, transparent 60%)' 
          }} 
        />
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-[1200px] h-[550px] bg-gradient-to-b from-amber-500/[0.14] via-purple-600/[0.06] to-transparent blur-[140px]" />
        <ConstellationCanvas className="absolute inset-0 opacity-45" />
      </div>

      {/* Top Banner Notice */}
      <header className="relative z-20 w-full max-w-6xl mx-auto px-4 pt-6 flex items-center justify-between">
        <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-amber-500/10 border border-amber-500/30 text-amber-300 font-mono text-[11px]">
          <ShieldAlert className="w-3.5 h-3.5" />
          <span>ISOLATED LOCALHOST TESTING SANDBOX</span>
        </div>
        <Link 
          href="/"
          className="font-mono text-xs text-neutral-400 hover:text-white transition flex items-center gap-1"
        >
          <span>Return Home</span>
          <ArrowRight className="w-3.5 h-3.5" />
        </Link>
      </header>

      {/* Main Content */}
      <main className="relative z-10 flex-1 flex flex-col items-center justify-center text-center px-4 py-8 sm:py-12 space-y-6 sm:space-y-8 max-w-5xl mx-auto w-full">
        <div className={`space-y-3 max-w-2xl transition-opacity duration-700 ${isDimmed ? 'opacity-30' : 'opacity-100'}`}>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-black/60 border border-cyan-400/30 text-cyan-300 font-mono text-xs">
            <Activity className="w-3.5 h-3.5 animate-pulse" />
            <span>TIME-SYNCED LAUNCH ENGINE // 2:00:00 PM TARGET</span>
          </div>
          <h1 
            className="text-2xl xs:text-3xl sm:text-5xl text-white tracking-tight leading-[1.15] font-semibold"
            style={{ fontFamily: 'Clash Display, var(--font-space), sans-serif' }}
          >
            Calibrating the <br />
            <span className="font-serif italic font-normal text-amber-200">ZENVITRA</span> Portal Sequence.
          </h1>
          <p className="text-xs sm:text-sm text-neutral-400 font-light max-w-lg mx-auto">
            Interactive simulation of the 2:00:00 PM launch sequence. Use the test control bar at bottom-right to jump directly to any milestone.
          </p>
        </div>

        {/* Hero Monolith Interactive 3D Card (#monolith-section) */}
        <div 
          id="monolith-section" 
          className={`w-full max-w-[280px] xs:max-w-xs sm:max-w-sm mx-auto my-2 transition-all duration-700 ${
            isDimmed ? 'scale-105 z-40 drop-shadow-[0_0_80px_rgba(251,191,36,0.4)]' : ''
          }`}
        >
          <div
            style={{ perspective: 1200 }}
            className="relative w-full aspect-[4/5.2] select-none py-2"
          >
            <div
              ref={cardRef}
              onMouseMove={handleCardMouseMove}
              onMouseLeave={handleCardMouseLeave}
              style={{
                transform: `rotateX(${rotate.x}deg) rotateY(${rotate.y}deg)`,
                transition: 'transform 0.15s cubic-bezier(0.2, 0, 0, 1)',
                transformStyle: 'preserve-3d',
              }}
              className="relative w-full h-full rounded-[2rem] sm:rounded-[2.2rem] bg-[#050608] border border-white/15 p-5 sm:p-7 flex flex-col justify-between overflow-hidden shadow-[0_25px_80px_rgba(0,0,0,0.95)] hover:shadow-[0_0_50px_rgba(251,191,36,0.15)] transition-shadow duration-300 group cursor-pointer"
            >
              {/* Dynamic Cursor Spotlight Radial Glow Sheen */}
              <div
                className="pointer-events-none absolute inset-0 transition-opacity duration-300 z-20"
                style={{
                  opacity: glow.opacity,
                  background: `radial-gradient(380px circle at ${glow.x}% ${glow.y}%, rgba(251, 191, 36, 0.18), transparent 75%)`,
                }}
              />

              {/* Monolith Image & Preloaded Video Stack with Zero Layout Shift */}
              <div className="absolute inset-0 z-0 select-none pointer-events-none overflow-hidden">
                <Image
                  src="/hero-monolith.webp"
                  alt="Zenvitra Monolith Portal"
                  fill
                  priority
                  sizes="(max-width: 640px) 320px, (max-width: 1024px) 440px, 480px"
                  style={{ objectPosition: 'center 65%' }}
                  className="object-cover brightness-[0.92] contrast-[1.08] group-hover:scale-105 transition-transform duration-700 ease-out"
                />

                <video
                  ref={videoRef}
                  src="/portal-opening.mp4"
                  playsInline
                  muted
                  preload="auto"
                  onTimeUpdate={handleVideoTimeUpdate}
                  style={{ objectPosition: 'center 65%' }}
                  className={`absolute inset-0 w-full h-full object-cover pointer-events-none transition-opacity duration-150 z-10 ${
                    isVideoVisible ? 'opacity-100' : 'opacity-0'
                  }`}
                />

                {/* Obsidian Gradient Vignettes */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/95 via-black/20 to-black/80 z-20 pointer-events-none" />
                <div className="absolute inset-0 bg-gradient-to-b from-black/80 via-transparent to-black/90 z-20 pointer-events-none" />
              </div>

              {/* Monolith Card Header */}
              <div 
                style={{ transform: 'translateZ(25px)' }}
                className="relative z-10 flex items-start justify-between pointer-events-none"
              >
                <div className="space-y-1 text-left">
                  <div className="flex items-center gap-2">
                    <span 
                      className="font-bold text-xs tracking-[0.2em] text-white uppercase"
                      style={{ fontFamily: 'Clash Display, sans-serif' }}
                    >
                      ZENVITRA
                    </span>
                  </div>
                  <div className="font-mono text-[8px] sm:text-[9px] tracking-[0.25em] text-amber-200/80 uppercase">
                    SOVEREIGN INVARIANT
                  </div>
                </div>

                <div className="px-2.5 sm:px-3 py-1 rounded-full border border-white/15 bg-black/70 backdrop-blur-md shadow-sm">
                  <span className="text-[7px] sm:text-[8px] font-mono tracking-[0.22em] text-neutral-300 uppercase font-medium">
                    ARCHETYPE 01
                  </span>
                </div>
              </div>

              {/* Monolith Card Bottom: Phase Status */}
              <div 
                style={{ transform: 'translateZ(25px)' }}
                className="relative z-10 flex flex-col items-start gap-2 text-left pb-1 pointer-events-none"
              >
                <div className="inline-flex items-center gap-1.5 px-2.5 sm:px-3 py-0.5 sm:py-1 rounded-full bg-black/85 border border-amber-400/30 backdrop-blur-md shadow-[0_0_15px_rgba(251,191,36,0.2)]">
                  <span className="w-1.5 sm:w-2 h-1.5 sm:h-2 rounded-full bg-amber-400 animate-pulse shadow-[0_0_8px_#fbbf24]" />
                  <span className="text-[8px] sm:text-[9px] font-mono tracking-[0.22em] text-amber-300 uppercase font-semibold">
                    PHASE: {phase.toUpperCase()}
                  </span>
                </div>

                <h3 className="font-mono font-bold text-xs sm:text-sm tracking-[0.22em] text-white uppercase drop-shadow-[0_2px_10px_rgba(0,0,0,0.95)] flex items-center gap-2">
                  <span>{phase === 'portal_video' ? 'PORTAL ACTIVE' : 'PORTAL OPENING SOON'}</span>
                  <Sparkles className="w-3.5 h-3.5 text-amber-300 animate-pulse" />
                </h3>
              </div>
            </div>
          </div>
        </div>

        {/* 4-Digit Timer Display */}
        <div className={`w-full max-w-2xl transition-opacity duration-700 ${isDimmed ? 'opacity-30' : 'opacity-100'}`}>
          <div className="p-4 sm:p-6 rounded-2xl bg-[#07090f]/90 border border-white/[0.1] shadow-2xl backdrop-blur-xl space-y-4">
            <div className="flex items-center justify-between border-b border-white/[0.08] pb-3">
              <div className="flex items-center gap-2 text-amber-300 font-mono text-xs">
                <Radio className="w-3.5 h-3.5 animate-pulse text-amber-400" />
                <span>OFFICIAL LAUNCH // 2:00:00 PM</span>
              </div>
              <span className="font-mono text-xs text-neutral-400 tabular-nums">
                {(totalRemainingMs / 1000).toFixed(1)}s REMAINING
              </span>
            </div>

            <div className="grid grid-cols-4 gap-2 sm:gap-4">
              {[
                { label: 'DAYS', value: timeLeft.days },
                { label: 'HOURS', value: timeLeft.hours },
                { label: 'MINS', value: timeLeft.minutes },
                { label: 'SECS', value: timeLeft.seconds },
              ].map((item, index) => (
                <div 
                  key={index}
                  className="flex flex-col items-center justify-center p-3 sm:p-5 rounded-xl bg-black/60 border border-amber-400/20 shadow-inner"
                >
                  <span className="font-mono text-2xl sm:text-5xl font-bold tracking-tight tabular-nums text-amber-300">
                    {String(item.value).padStart(2, '0')}
                  </span>
                  <span className="font-mono text-[8px] sm:text-[10px] text-neutral-500 tracking-[0.2em] uppercase mt-1">
                    {item.label}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </main>

      {/* Floating Audio Control Pill */}
      <button
        type="button"
        onClick={portalAudio.toggleSound}
        className="fixed bottom-6 left-6 z-50 flex items-center gap-2.5 px-4 py-2.5 rounded-full bg-black/85 border border-amber-400/40 text-white font-mono text-xs backdrop-blur-md shadow-[0_0_20px_rgba(251,191,36,0.25)] hover:border-amber-300 transition-all cursor-pointer group"
      >
        {portalAudio.isMuted ? (
          <VolumeX className="w-4 h-4 text-neutral-400 group-hover:text-white" />
        ) : (
          <Volume2 className="w-4 h-4 text-amber-400 animate-pulse" />
        )}
        <span className="tracking-wider">
          SOUND: <span className={portalAudio.isMuted ? 'text-neutral-400' : 'text-amber-300 font-bold'}>{portalAudio.isMuted ? 'OFF' : 'ARMED'}</span>
        </span>
      </button>

      {/* Interactive Local Debug Bar (Bottom-Right) */}
      <aside className="fixed bottom-6 right-6 z-50 flex flex-col items-end gap-2">
        <div className="p-3.5 rounded-2xl bg-[#090b12]/95 border border-amber-400/30 backdrop-blur-xl shadow-[0_10px_40px_rgba(0,0,0,0.9)] max-w-sm w-full space-y-2.5">
          <div className="flex items-center justify-between gap-2 border-b border-white/10 pb-2">
            <span className="font-mono text-[10px] uppercase tracking-wider text-amber-300 font-bold flex items-center gap-1.5">
              <span className="w-1.5 h-1.5 rounded-full bg-amber-400 animate-ping" />
              LOCAL DEV TEST BAR
            </span>
            <span className="text-[9px] font-mono px-1.5 py-0.5 rounded bg-black/60 border border-white/10 text-neutral-400">
              SANDBOX
            </span>
          </div>

          <div className="grid grid-cols-1 gap-1.5">
            <button
              type="button"
              onClick={() => jumpToRemainingMs(64000)}
              className="w-full flex items-center justify-between px-3 py-2 rounded-xl bg-amber-500/10 hover:bg-amber-500/20 border border-amber-500/30 text-amber-200 text-xs font-mono transition text-left cursor-pointer"
            >
              <span className="flex items-center gap-1.5">
                <FastForward className="w-3.5 h-3.5 text-amber-400" />
                <span>Jump to 1:58:56 PM (T-64s)</span>
              </span>
              <span className="text-[9px] text-amber-400/70 font-semibold">Auto-Scroll &amp; Rumble</span>
            </button>

            <button
              type="button"
              onClick={() => jumpToRemainingMs(9000)}
              className="w-full flex items-center justify-between px-3 py-2 rounded-xl bg-cyan-500/10 hover:bg-cyan-500/20 border border-cyan-500/30 text-cyan-200 text-xs font-mono transition text-left cursor-pointer"
            >
              <span className="flex items-center gap-1.5">
                <FastForward className="w-3.5 h-3.5 text-cyan-400" />
                <span>Jump to 1:59:51 PM (T-9s)</span>
              </span>
              <span className="text-[9px] text-cyan-400/70 font-semibold">Video &amp; Flash Riser</span>
            </button>

            <button
              type="button"
              onClick={resetSequence}
              className="w-full flex items-center justify-center gap-2 px-3 py-1.5 rounded-xl bg-white/[0.05] hover:bg-white/[0.1] border border-white/10 text-neutral-300 text-xs font-mono transition cursor-pointer"
            >
              <RotateCcw className="w-3 h-3 text-neutral-400" />
              <span>Reset Local Test</span>
            </button>
          </div>
        </div>
      </aside>

      {/* Full-Screen Pure White Flash Overlay on T-0s (2:00:00 PM) */}
      {isWhiteFlashActive && (
        <div className="fixed inset-0 z-[9999] bg-white pointer-events-none transition-opacity duration-150 opacity-100" />
      )}
    </div>
  );
}
