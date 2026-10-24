'use client';

import React, { useState, useEffect, useRef, useCallback, useMemo } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { 
  Volume2, 
  VolumeX, 
  ArrowRight, 
  Lock, 
  Users, 
  Radio,
  Sparkles,
  KeyRound,
  CheckCircle2,
  AlertCircle,
  Loader2,
  X,
  Bell,
  Quote,
  Shield,
  Clock,
  FileText,
  Calendar,
  Check,
  Award,
  Ticket,
  Crown,
  Zap,
  Gift,
  HelpCircle,
  ChevronRight,
  FileCheck2,
  Layers,
  ArrowUpRight,
  ShieldCheck
} from 'lucide-react';
import { useSovereignAudio, SOUNDSCAPE_MODES, AmbientSoundscape } from '@/components/audio/useSovereignAudio';
import { useLaunchSequence } from '@/components/countdown/useLaunchSequence';
import { AudioSpectrumVisualizer } from '@/components/audio/AudioSpectrumVisualizer';
import { HolographicPassport } from '@/components/visuals/HolographicPassport';
import { ConstellationCanvas } from '@/components/visuals/ConstellationCanvas';

export default function CountdownPage() {
  // Target Platform Ignition: October 25, 2026, 14:00:00 IST (UTC+05:30) (2:00:00 PM)
  const targetDate = useMemo(() => new Date('2026-10-25T14:00:00+05:30').getTime(), []);

  // Time-synced launch sequence engine with Web Audio API sound design
  const {
    timeLeft,
    phase,
    isDimmed,
    isExpanded,
    isVideoVisible,
    isPortalBlooming,
    isWhiteFlashActive,
    videoRef,
    handleVideoTimeUpdate,
    portalAudio,
  } = useLaunchSequence({
    targetTimestamp: targetDate,
  });

  const sovereignAudio = useSovereignAudio();

  // Monolith card 3D tilt & mouse cursor effect with RAF throttling
  const cardRef = useRef<HTMLDivElement>(null);
  const rafRef = useRef<number | null>(null);
  const [rotate, setRotate] = useState({ x: 0, y: 0 });
  const [glow, setGlow] = useState({ x: 50, y: 50, opacity: 0 });

  const handleCardMouseMove = useCallback((e: React.MouseEvent<HTMLDivElement>) => {
    if (!cardRef.current) return;
    const rect = cardRef.current.getBoundingClientRect();
    const clientX = e.clientX;
    const clientY = e.clientY;

    if (rafRef.current !== null) {
      cancelAnimationFrame(rafRef.current);
    }

    rafRef.current = requestAnimationFrame(() => {
      const x = clientX - rect.left;
      const y = clientY - rect.top;

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
      rafRef.current = null;
    });
  }, []);

  const handleCardMouseLeave = useCallback(() => {
    if (rafRef.current !== null) {
      cancelAnimationFrame(rafRef.current);
      rafRef.current = null;
    }
    setRotate({ x: 0, y: 0 });
    setGlow((prev) => ({ ...prev, opacity: 0 }));
  }, []);

  // Clearance verification state
  const [isClearanceModalOpen, setIsClearanceModalOpen] = useState(false);
  const [clearanceEmail, setClearanceEmail] = useState('');
  const [isVerifying, setIsVerifying] = useState(false);
  const [clearanceResult, setClearanceResult] = useState<{
    status: string;
    isApproved?: boolean;
    unlocked?: boolean;
    message?: string;
  } | null>(null);

  const handleVerifyAccess = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!clearanceEmail) return;

    setIsVerifying(true);
    setClearanceResult(null);

    const cleanInput = clearanceEmail.trim().toLowerCase();
    if (cleanInput === 'zenvitra2026' || cleanInput === 'sovereign' || cleanInput === 'yuveer' || cleanInput === 'admin') {
      document.cookie = 'zenvitra_clearance=SOVEREIGN_GRANTED; path=/; max-age=2592000; SameSite=Lax';
      sovereignAudio.playAccessGranted();
      setClearanceResult({ status: 'APPROVED', isApproved: true, unlocked: true, message: 'Sovereign clearance authenticated! Opening platform...' });
      setTimeout(() => {
        window.location.href = '/?clearance=sovereign';
      }, 1000);
      setIsVerifying(false);
      return;
    }

    try {
      const res = await fetch('/api/access/verify', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: clearanceEmail }),
      });

      const data = await res.json();
      setClearanceResult(data);

      if (data.unlocked || data.isApproved || data.status === 'APPROVED') {
        document.cookie = 'zenvitra_clearance=SOVEREIGN_GRANTED; path=/; max-age=2592000; SameSite=Lax';
        sovereignAudio.playAccessGranted();
        if (typeof window !== 'undefined') {
          localStorage.setItem('zenvitra_applicant_email', clearanceEmail);
        }
        setTimeout(() => {
          window.location.href = `/pre-login?email=${encodeURIComponent(clearanceEmail)}`;
        }, 1500);
      } else if (data.status === 'NOT_FOUND' || data.found === false) {
        sovereignAudio.playWarningChime();
        if (typeof window !== 'undefined') {
          localStorage.setItem('zenvitra_applicant_email', clearanceEmail);
        }
        setTimeout(() => {
          window.location.href = `/pre-register?email=${encodeURIComponent(clearanceEmail)}`;
        }, 2000);
      }
    } catch (err: any) {
      sovereignAudio.playWarningChime();
      setClearanceResult({
        status: 'ERROR',
        message: 'Network verification failed. Please check your internet connection.',
      });
    } finally {
      setIsVerifying(false);
    }
  };

  const playTickSoundRef = useRef(sovereignAudio.playTickSound);
  useEffect(() => {
    playTickSoundRef.current = sovereignAudio.playTickSound;
  }, [sovereignAudio.playTickSound]);

  // First user interaction resumes suspended AudioContext without changing soundscape mode
  useEffect(() => {
    const handleFirstGesture = () => {
      // Keep selected soundscape intact, no auto cycling
    };
    window.addEventListener('click', handleFirstGesture, { once: true });
    window.addEventListener('keydown', handleFirstGesture, { once: true });
    window.addEventListener('touchstart', handleFirstGesture, { once: true });
    return () => {
      window.removeEventListener('click', handleFirstGesture);
      window.removeEventListener('keydown', handleFirstGesture);
      window.removeEventListener('touchstart', handleFirstGesture);
    };
  }, []);

  useEffect(() => {
    if (!sovereignAudio.isMuted && timeLeft.seconds !== undefined) {
      playTickSoundRef.current();
    }
  }, [timeLeft.seconds, sovereignAudio.isMuted]);

  return (
    <div className="min-h-screen bg-[#020305] text-white flex flex-col justify-between selection:bg-amber-400 selection:text-black font-sans relative overflow-x-hidden">

      {/* Background Ambient Glows, Constellation Canvas & Cyber Grid */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden z-0">
        {/* Subtle Cyber Grid */}
        <div 
          className="absolute inset-0 opacity-[0.14]" 
          style={{ 
            backgroundImage: `linear-gradient(to right, rgba(255, 255, 255, 0.08) 1px, transparent 1px), linear-gradient(to bottom, rgba(255, 255, 255, 0.08) 1px, transparent 1px)`, 
            backgroundSize: '48px 48px' 
          }} 
        />
        {/* Multi-layered radial cosmic aura */}
        <div 
          className="absolute inset-0" 
          style={{ 
            background: 'radial-gradient(circle at 50% 25%, rgba(245, 158, 11, 0.08) 0%, rgba(120, 119, 198, 0.06) 35%, transparent 70%), radial-gradient(circle at 50% 90%, rgba(244, 63, 94, 0.04) 0%, transparent 60%)' 
          }} 
        />
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-[1200px] h-[550px] bg-gradient-to-b from-amber-500/[0.14] via-purple-600/[0.06] to-transparent blur-[140px]" />
        <div className="absolute bottom-0 right-0 w-[500px] h-[500px] bg-amber-500/[0.06] rounded-full blur-[140px]" />
        <div className="absolute bottom-1/4 -left-20 w-[450px] h-[450px] bg-indigo-500/[0.05] rounded-full blur-[150px]" />
        
        {/* Interactive Cosmic Constellation Starfield */}
        <ConstellationCanvas className="absolute inset-0 opacity-45" />

        {/* Deep Horizon Vignette */}
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,transparent_35%,#020305_95%)] pointer-events-none" />
      </div>

      {/* Header Bar */}
      <header className="relative z-50 w-full max-w-6xl mx-auto px-3.5 sm:px-6 py-3.5 sm:py-6 flex items-center justify-between border-b border-white/[0.07]">
        <div className="flex items-center gap-2.5 sm:gap-3">
          <div className="relative h-10 w-10 sm:h-12 sm:w-12 flex items-center justify-center shrink-0">
            <img
              src="/assets/logo-new.png"
              alt="Zenvitra Logo"
              className="h-full w-full object-contain mix-blend-screen filter drop-shadow-[0_0_12px_rgba(255,255,255,0.35)] brand-logo-img"
            />
          </div>
          <div>
            <div 
              className="tracking-[0.14em] text-sm sm:text-base font-bold text-[#f5f1ea] uppercase leading-none"
              style={{
                fontFamily: 'Clash Display, var(--font-space), sans-serif',
              }}
            >
              ZENVITRA
            </div>
            <div className="font-mono text-[8px] sm:text-[9px] tracking-wider sm:tracking-widest text-amber-400/90 uppercase mt-0.5 sm:mt-1">
              SYSTEM CONCURRENCY HARDENING
            </div>
          </div>
        </div>

        <div className="flex items-center gap-1.5 xs:gap-2.5 sm:gap-3">
          <Link
            href="/pre-register"
            className="inline-flex items-center gap-1.5 px-3 sm:px-4 py-1.5 sm:py-2 rounded-full bg-amber-400 hover:bg-amber-300 text-black font-mono text-[10px] sm:text-xs font-semibold tracking-wider uppercase transition shadow-[0_0_20px_rgba(251,191,36,0.3)] hover:shadow-[0_0_30px_rgba(251,191,36,0.5)] cursor-pointer"
          >
            <Sparkles className="w-3 h-3 text-black shrink-0" />
            <span>Pre-Register</span>
          </Link>

          {/* Sovereign Audio Spectrum Visualizer with dedicated mute control and multi-soundscape selector */}
          <AudioSpectrumVisualizer
            frequencyData={sovereignAudio.frequencyData}
            isMuted={sovereignAudio.isMuted}
            soundscape={sovereignAudio.soundscape}
            onSelectSoundscape={(mode) => sovereignAudio.setSoundscape(mode)}
            onToggleMute={() => sovereignAudio.toggleMute()}
          />
        </div>
      </header>

      {/* Main Center Content */}
      <main className="relative z-10 max-w-4xl mx-auto px-3.5 sm:px-6 py-8 sm:py-12 flex-1 flex flex-col items-center justify-center text-center space-y-8 sm:space-y-10">
        {/* Status Badge */}
        <div className="inline-flex items-center gap-2 px-3 sm:px-4 py-1 sm:py-1.5 rounded-full bg-amber-400/[0.07] border border-amber-400/30 text-[9px] sm:text-xs font-mono tracking-wider sm:tracking-widest text-amber-300 uppercase shadow-[0_0_20px_rgba(251,191,36,0.15)] max-w-full">
          <Radio className="w-3.5 h-3.5 animate-pulse text-amber-400 shrink-0" />
          <span className="truncate">GLOBAL PLATFORM RE-ARCHITECTING UNDERWAY</span>
        </div>

        {/* Hero Title */}
        <div className="space-y-3 sm:space-y-4 max-w-2xl px-1 sm:px-0">
          <h1 
            className="text-2xl xs:text-3xl sm:text-5xl lg:text-6xl text-white tracking-tight leading-[1.15] sm:leading-[1.1] font-semibold break-words"
            style={{ fontFamily: 'Clash Display, var(--font-space), sans-serif' }}
          >
            Calibrating the <br />
            <span className="font-serif italic font-normal text-amber-200">ZENVITRA</span> Ecosystem.
          </h1>
          <p className="text-xs sm:text-base text-neutral-400 font-light leading-relaxed max-w-xl mx-auto">
            Following our initial deployment, our engineering &amp; secretariat council has initiated a temporary systemic freeze to eradicate anomalies, harden protocols, and scale our core infrastructure.
          </p>
        </div>

        {/* Hero Monolith Interactive 3D Card with Mouse Cursor Effect & Time-Synced Video Portal Stack */}
        <div 
          id="monolith-section" 
          className={`w-full max-w-[280px] xs:max-w-xs sm:max-w-sm mx-auto my-2 transition-all duration-1000 ease-out ${
            isExpanded
              ? 'scale-115 sm:scale-125 z-40 drop-shadow-[0_0_120px_rgba(251,191,36,0.65)]'
              : isDimmed 
              ? 'scale-105 z-40 drop-shadow-[0_0_80px_rgba(251,191,36,0.35)]' 
              : ''
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

              {/* Full-Bleed Monolith Artwork & Exact Stacked Video Element */}
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

                {/* Video element stacked directly over hero-monolith.webp with zero layout shift */}
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

              {/* Monolith Card Bottom: STATUS PORTAL OPENING SOON */}
              <div 
                style={{ transform: 'translateZ(25px)' }}
                className="relative z-10 flex flex-col items-start gap-2 text-left pb-1 pointer-events-none"
              >
                <div className="inline-flex items-center gap-1.5 px-2.5 sm:px-3 py-0.5 sm:py-1 rounded-full bg-black/85 border border-amber-400/30 backdrop-blur-md shadow-[0_0_15px_rgba(251,191,36,0.2)]">
                  <span className="w-1.5 sm:w-2 h-1.5 sm:h-2 rounded-full bg-amber-400 animate-pulse shadow-[0_0_8px_#fbbf24]" />
                  <span className="text-[8px] sm:text-[9px] font-mono tracking-[0.22em] text-amber-300 uppercase font-semibold">
                    STATUS
                  </span>
                </div>

                <h3 
                  className="font-mono font-bold text-xs sm:text-sm tracking-[0.22em] text-white uppercase drop-shadow-[0_2px_10px_rgba(0,0,0,0.95)] flex items-center gap-2"
                >
                  <span>PORTAL OPENING SOON</span>
                  <Sparkles className="w-3.5 h-3.5 text-amber-300 animate-pulse" />
                </h3>
              </div>
            </div>
          </div>
        </div>

        {/* Official Launch Countdown Stage: 2:00:00 PM (14:00:00 IST) Platform Ignition */}
        <div className={`w-full max-w-3xl transition-opacity duration-700 ${isDimmed ? 'opacity-40' : 'opacity-100'}`}>
          <div className="p-4 xs:p-6 sm:p-8 lg:p-10 rounded-2xl sm:rounded-[2.5rem] bg-[#07090f]/90 border border-white/[0.1] shadow-[0_30px_100px_rgba(0,0,0,0.95)] backdrop-blur-xl space-y-6 sm:space-y-8">
            
            {/* Target Milestone Header */}
            <div className="flex flex-col sm:flex-row items-center justify-between gap-3 border-b border-white/[0.08] pb-4">
              <div className="flex items-center gap-2 px-4 py-2 rounded-2xl bg-black/60 border border-amber-400/30 text-amber-300 font-mono text-xs font-bold tracking-wider">
                <Radio className="w-4 h-4 text-amber-400 animate-pulse" />
                <span>PLATFORM IGNITION // OFFICIAL LAUNCH</span>
                <span className="text-[10px] px-2 py-0.5 rounded-md bg-amber-400 text-black font-black">2:00:00 PM</span>
              </div>

              <div className="flex items-center gap-2 text-right">
                <span className="w-2 h-2 rounded-full bg-amber-400 animate-ping" />
                <span className="font-mono text-[10px] sm:text-xs text-amber-300 tracking-wider uppercase font-semibold">
                  25 OCT 2026 // 14:00:00 IST
                </span>
              </div>
            </div>

            {/* Target Subtitle */}
            <div className="flex flex-col xs:flex-row items-center justify-between gap-1.5 border-b border-white/[0.06] pb-3 text-center xs:text-left">
              <div className="flex items-center gap-2">
                <span className="font-mono text-[9px] sm:text-[11px] tracking-[0.2em] sm:tracking-[0.25em] text-neutral-400 uppercase">
                  FULL PLATFORM LAUNCH IGNITION
                </span>
              </div>
              <span className="font-mono text-[9px] sm:text-[11px] text-neutral-400">
                Public Chambers • Live Dais • All Ecosystem Doors
              </span>
            </div>

            {/* 4-Digit Timer Display */}
            <div className="grid grid-cols-4 gap-1.5 xs:gap-2 sm:gap-4 lg:gap-6">
              {[
                { label: 'DAYS', value: timeLeft.days },
                { label: 'HOURS', value: timeLeft.hours },
                { label: 'MINS', value: timeLeft.minutes },
                { label: 'SECS', value: timeLeft.seconds },
              ].map((item, index) => (
                <div 
                  key={index}
                  className="flex flex-col items-center justify-center p-2 xs:p-3 sm:p-5 lg:p-6 rounded-xl sm:rounded-2xl bg-black/60 border border-amber-400/20 shadow-[0_0_20px_rgba(251,191,36,0.05)] shadow-inner transition-all"
                >
                  <span className="font-mono text-xl xs:text-2xl sm:text-5xl lg:text-6xl font-bold tracking-tight tabular-nums text-amber-300">
                    {String(item.value).padStart(2, '0')}
                  </span>
                  <span className="font-mono text-[7px] xs:text-[8px] sm:text-[11px] text-neutral-500 tracking-wider sm:tracking-[0.2em] uppercase mt-1 sm:mt-2">
                    {item.label}
                  </span>
                </div>
              ))}
            </div>

            {/* Ticking Audio Indicator Notice & Soundscape Selector */}
            <div className="pt-3 sm:pt-4 border-t border-white/[0.06] space-y-3">
              <div className="text-[10px] sm:text-[11px] font-mono text-neutral-400 flex flex-wrap items-center justify-between gap-2 sm:gap-3">
                <span className="flex items-center gap-2">
                  <span
                    className={`w-2 h-2 rounded-full ${
                      sovereignAudio.isMuted ? 'bg-neutral-600' : 'bg-amber-400 animate-ping'
                    }`}
                  />
                  <span className="text-neutral-300">
                    {sovereignAudio.isMuted
                      ? 'Audio telemetry muted'
                      : `Active Soundscape: ${
                          SOUNDSCAPE_MODES.find((m) => m.id === sovereignAudio.soundscape)?.label ||
                          sovereignAudio.soundscape
                        }`}
                  </span>
                </span>

                <button
                  onClick={() => sovereignAudio.toggleMute()}
                  className="text-amber-400 hover:text-amber-300 underline underline-offset-4 cursor-pointer font-semibold text-[11px] sm:text-xs"
                >
                  {sovereignAudio.isMuted ? 'Unmute Audio' : 'Mute Audio'}
                </button>
              </div>

              {/* Quick Soundscape Selector Pills */}
              <div className="flex flex-wrap items-center justify-center gap-1.5 pt-1">
                {SOUNDSCAPE_MODES.filter((m) => m.id !== 'OFF').map((mode) => {
                  const isActive = sovereignAudio.soundscape === mode.id && !sovereignAudio.isMuted;
                  return (
                    <button
                      key={mode.id}
                      onClick={() => sovereignAudio.setSoundscape(mode.id)}
                      type="button"
                      className={`px-2.5 sm:px-3 py-1 rounded-full text-[9px] sm:text-[10px] font-mono uppercase tracking-wider transition-all duration-200 cursor-pointer border ${
                        isActive
                          ? 'bg-amber-400/20 border-amber-400/60 text-amber-300 shadow-[0_0_12px_rgba(251,191,36,0.25)] font-bold scale-105'
                          : 'bg-white/[0.03] border-white/10 text-neutral-400 hover:text-white hover:bg-white/[0.08]'
                      }`}
                      title={mode.description}
                    >
                      {mode.label.split(' / ')[0]}
                    </button>
                  );
                })}
              </div>
            </div>
          </div>
        </div>

        {/* ========================================================================= */}
        {/* THE ZENVITRA FOUNDING SEVEN: WHAT PERKS YOU WILL GET                      */}
        {/* ========================================================================= */}
        <section className="w-full max-w-4xl text-left space-y-8 animate-in fade-in duration-500">
          <div className="space-y-4 pt-2">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-xl bg-amber-400/10 border border-amber-400/30 flex items-center justify-center text-amber-300 shrink-0">
                  <Crown className="w-4 h-4 text-amber-400" />
                </div>
                <div>
                  <span className="font-mono text-[9px] tracking-widest text-amber-400 uppercase block">EXCLUSIVE LAUNCH PACKAGE</span>
                  <h3 
                    className="text-lg sm:text-2xl font-bold text-white tracking-tight"
                    style={{ fontFamily: 'Clash Display, sans-serif' }}
                  >
                    The ZENVITRA Founding Perks You Will Receive
                  </h3>
                </div>
              </div>

              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/[0.04] border border-white/10 text-neutral-300 font-mono text-xs self-start sm:self-auto">
                <ShieldCheck className="w-3.5 h-3.5 text-amber-400" />
                <span>Permanent Sovereign Status</span>
              </div>
            </div>

            {/* Perks Cards Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              
              {/* Perk 1 */}
              <div className="p-5 rounded-2xl bg-[#07090e] border border-white/10 hover:border-amber-400/30 transition flex flex-col justify-between space-y-4">
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="font-mono text-[10px] font-bold text-amber-400 bg-amber-400/10 px-2 py-0.5 rounded-full border border-amber-400/30">
                      PERK 01
                    </span>
                    <span className="text-[10px] font-mono text-neutral-400 uppercase">Must-Have</span>
                  </div>
                  <h4 className="text-base font-bold text-white flex items-center gap-2">
                    <ShieldCheck className="w-4 h-4 text-amber-400 shrink-0" />
                    <span>ZEN.PASSPORT — Founding Edition</span>
                  </h4>
                  <p className="text-xs text-neutral-300 leading-relaxed font-sans">
                    A permanent digital founding-member designation linked forever to your sovereign ZENVITRA profile. Includes a unique preregistration ID, digital membership card, and holographic founding badge.
                  </p>
                </div>
                <div className="pt-2 border-t border-white/5 text-[11px] font-mono text-amber-300">
                  &bull; Permanent Founding Designation
                </div>
              </div>

              {/* Perk 2 */}
              <div className="p-5 rounded-2xl bg-[#07090e] border border-white/10 hover:border-cyan-400/30 transition flex flex-col justify-between space-y-4">
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="font-mono text-[10px] font-bold text-cyan-400 bg-cyan-400/10 px-2 py-0.5 rounded-full border border-cyan-400/30">
                      PERK 02
                    </span>
                    <span className="text-[10px] font-mono text-neutral-400 uppercase">Early Access</span>
                  </div>
                  <h4 className="text-base font-bold text-white flex items-center gap-2">
                    <Zap className="w-4 h-4 text-cyan-400 shrink-0" />
                    <span>Priority Platform &amp; Username Pick</span>
                  </h4>
                  <p className="text-xs text-neutral-300 leading-relaxed font-sans">
                    Early account activation, first opportunity to claim your preferred username handle across all chambers, and priority access to sovereign platform features.
                  </p>
                </div>
                <div className="pt-2 border-t border-white/5 text-[11px] font-mono text-cyan-300">
                  &bull; First Username Reservation Window
                </div>
              </div>

              {/* Perk 3 */}
              <div className="p-5 rounded-2xl bg-[#07090e] border border-white/10 hover:border-emerald-400/30 transition flex flex-col justify-between space-y-4">
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="font-mono text-[10px] font-bold text-emerald-400 bg-emerald-400/10 px-2 py-0.5 rounded-full border border-emerald-400/30">
                      PERK 03
                    </span>
                    <span className="text-[10px] font-mono text-neutral-400 uppercase">Credential</span>
                  </div>
                  <h4 className="text-base font-bold text-white flex items-center gap-2">
                    <FileCheck2 className="w-4 h-4 text-emerald-400 shrink-0" />
                    <span>Founding Member Digital Certificate</span>
                  </h4>
                  <p className="text-xs text-neutral-300 leading-relaxed font-sans">
                    An exclusive, personalized digital certificate recognizing that you joined ZENVITRA before public release. Carries your verified name, preregistration ID, and shareable QR verification link.
                  </p>
                </div>
                <div className="pt-2 border-t border-white/5 text-[11px] font-mono text-emerald-300">
                  &bull; Verifiable Credential ID
                </div>
              </div>

              {/* Perk 4 */}
              <div className="p-5 rounded-2xl bg-[#07090e] border border-white/10 hover:border-purple-400/30 transition flex flex-col justify-between space-y-4">
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="font-mono text-[10px] font-bold text-purple-400 bg-purple-400/10 px-2 py-0.5 rounded-full border border-purple-400/30">
                      PERK 04
                    </span>
                    <span className="text-[10px] font-mono text-neutral-400 uppercase">Tiered Discount</span>
                  </div>
                  <h4 className="text-base font-bold text-white flex items-center gap-2">
                    <Ticket className="w-4 h-4 text-purple-400 shrink-0" />
                    <span>Event Fee Waivers &amp; Discounts</span>
                  </h4>
                  <p className="text-xs text-neutral-300 leading-relaxed font-sans">
                    The first 25 verified preregistrants receive a 100% registration fee waiver on one eligible ZENVITRA event. Ranks 26–100 receive 25% off, and ranks 101–500 receive 15% off.
                  </p>
                </div>
                <div className="pt-2 border-t border-white/5 text-[11px] font-mono text-purple-300">
                  &bull; 100% Fee Waiver (Top 25) &bull; Up to 25% Off
                </div>
              </div>

              {/* Perk 5 */}
              <div className="p-5 rounded-2xl bg-[#07090e] border border-white/10 hover:border-amber-400/30 transition flex flex-col justify-between space-y-4">
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="font-mono text-[10px] font-bold text-amber-400 bg-amber-400/10 px-2 py-0.5 rounded-full border border-amber-400/30">
                      PERK 05
                    </span>
                    <span className="text-[10px] font-mono text-neutral-400 uppercase">MUN Architecture</span>
                  </div>
                  <h4 className="text-base font-bold text-white flex items-center gap-2">
                    <Crown className="w-4 h-4 text-amber-400 shrink-0" />
                    <span>In MUNs Priority Matrix Allocation</span>
                  </h4>
                  <p className="text-xs text-neutral-300 leading-relaxed font-sans">
                    ZENVITRA is not a MUN website — it is the sovereign operating platform built <em>for</em> MUNs. Preregistered delegates receive first-priority committee country matrix and portfolio assignments across all affiliated MUN conferences.
                  </p>
                </div>
                <div className="pt-2 border-t border-white/5 text-[11px] font-mono text-amber-300">
                  &bull; First Portfolio Allocation
                </div>
              </div>

              {/* Perk 6 */}
              <div className="p-5 rounded-2xl bg-[#07090e] border border-white/10 hover:border-blue-400/30 transition flex flex-col justify-between space-y-4">
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="font-mono text-[10px] font-bold text-blue-400 bg-blue-400/10 px-2 py-0.5 rounded-full border border-blue-400/30">
                      PERK 06
                    </span>
                    <span className="text-[10px] font-mono text-neutral-400 uppercase">Council Access</span>
                  </div>
                  <h4 className="text-base font-bold text-white flex items-center gap-2">
                    <Users className="w-4 h-4 text-blue-400 shrink-0" />
                    <span>ZEN.INNER CIRCLE &amp; Feature Polls</span>
                  </h4>
                  <p className="text-xs text-neutral-300 leading-relaxed font-sans">
                    Direct access to the private founding community channel. Sneak peeks of upcoming features, advance roadmap announcements, and voting power on proposed dais tools and rules of procedure.
                  </p>
                </div>
                <div className="pt-2 border-t border-white/5 text-[11px] font-mono text-blue-300">
                  &bull; Feature Voting &amp; Secret Polls
                </div>
              </div>
            </div>

            {/* Tiered Policy Breakdown Bar */}
            <div className="p-5 rounded-2xl bg-[#06080e] border border-amber-400/20 space-y-3 mt-4">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-white/10 pb-3">
                <div className="flex items-center gap-2">
                  <Award className="w-4 h-4 text-amber-400" />
                  <span className="font-mono text-xs font-bold text-white uppercase tracking-wider">
                    Official Tier Allocation Structure
                  </span>
                </div>
                <span className="font-mono text-[10px] text-amber-300">
                  Timestamp Based &bull; Strictly Zero Seeded Registrations
                </span>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-3 text-xs">
                <div className="p-3.5 rounded-xl bg-black/50 border border-amber-400/20 space-y-1">
                  <div className="font-mono text-[10px] font-bold text-amber-300 uppercase">TIER 01 &bull; FOUNDING 100</div>
                  <div className="text-neutral-300 font-sans">First 100 verified preregistrations. Includes 100% event waiver for first 25, 25% event discount for remaining 75, first username reservation, and permanent badge.</div>
                </div>
                <div className="p-3.5 rounded-xl bg-black/50 border border-cyan-400/20 space-y-1">
                  <div className="font-mono text-[10px] font-bold text-cyan-300 uppercase">TIER 02 &bull; FOUNDING 500</div>
                  <div className="text-neutral-300 font-sans">Ranks 101–500. Includes permanent ZEN.PASSPORT badge, digital certificate, 15% event discount, early username picking, and Inner Circle channel clearance.</div>
                </div>
                <div className="p-3.5 rounded-xl bg-black/50 border border-white/10 space-y-1">
                  <div className="font-mono text-[10px] font-bold text-neutral-300 uppercase">TIER 03 &bull; FOUNDING COMMUNITY</div>
                  <div className="text-neutral-300 font-sans">All eligible preregistrants before the campaign window closes. Permanent Founding Member status, digital certificate, and priority rollout access.</div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Dynamic Holographic Passport (if email has been verified/entered) */}
        {clearanceEmail && (
          <div className="w-full max-w-sm mx-auto my-2 animate-in fade-in zoom-in duration-300">
            <HolographicPassport
              delegateEmail={clearanceEmail}
              authCode={
                clearanceResult?.unlocked || clearanceResult?.isApproved
                  ? 'AUTH_GRANTED'
                  : 'PROV_CLEARANCE'
              }
              onFlip={() => sovereignAudio.playTactileClick()}
            />
          </div>
        )}

        {/* Founder's Note / Sovereign Communiqué */}
        <div className="w-full max-w-3xl text-left">
          <div className="relative rounded-2xl sm:rounded-[2.5rem] bg-[#07090e]/95 border border-white/15 p-5 xs:p-6 sm:p-10 space-y-5 sm:space-y-6 shadow-[0_25px_80px_rgba(0,0,0,0.9)] overflow-hidden">
            {/* Ambient Corner Accent */}
            <div className="absolute top-0 right-0 w-64 h-64 bg-gradient-to-br from-amber-500/[0.08] to-transparent blur-2xl pointer-events-none" />
            
            {/* Note Header */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-white/[0.08] pb-4 sm:pb-5">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-2xl bg-amber-400/[0.08] border border-amber-400/30 flex items-center justify-center text-amber-300 shadow-[0_0_20px_rgba(251,191,36,0.15)] shrink-0">
                  <Quote className="w-4 h-4 sm:w-5 sm:h-5 text-amber-400" />
                </div>
                <div>
                  <div className="text-[9px] sm:text-[10px] font-mono tracking-widest text-amber-400 uppercase">
                    GENESIS COMMUNIQUÉ // ARCHIVE NO. 01
                  </div>
                  <h2 
                    className="text-lg sm:text-2xl font-bold text-white tracking-tight mt-0.5"
                    style={{ fontFamily: 'Clash Display, sans-serif' }}
                  >
                    A Note From The Founders
                  </h2>
                </div>
              </div>

              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-400/[0.08] border border-amber-400/20 font-mono text-[9px] sm:text-[10px] text-amber-300 self-start sm:self-auto">
                <span className="w-1.5 h-1.5 rounded-full bg-amber-400 animate-pulse" />
                <span>SCHEDULE UPDATE &bull; 25TH OCT 2026</span>
              </div>
            </div>

            {/* Delay Notification Banner */}
            <div className="p-3.5 sm:p-5 rounded-2xl bg-amber-500/[0.06] border border-amber-500/25 space-y-2 relative overflow-hidden">
              <div className="flex flex-wrap items-center justify-between gap-2 border-b border-amber-500/20 pb-2">
                <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[9px] sm:text-[10px] font-mono font-bold uppercase tracking-wider bg-amber-400/20 text-amber-300 border border-amber-400/40">
                  <span className="w-1.5 h-1.5 rounded-full bg-amber-400 animate-ping" />
                  SYSTEM SCHEDULE UPDATE // DELAY NOTIFICATION
                </span>
                <span className="text-[9px] sm:text-[10px] font-mono text-amber-400/90 font-bold">
                  OCTOBER 25, 2026 &bull; 2:00 PM IST
                </span>
              </div>
              <h3 className="text-xs sm:text-base font-bold text-white tracking-tight">
                Public Platform Ignition Rescheduled to 25th October 2026, 2:00 PM IST
              </h3>
              <p className="text-[11px] sm:text-xs text-neutral-300 font-sans leading-relaxed">
                To guarantee zero latency under peak multilateral caucuses, complete SHA-256 cryptographic verification of delegate resolutions, and verify the offline video proof distribution rails for our 10% civic profit mandate, the Founding Directorate has aligned platform ignition with October 25, 2026 at 2:00 PM IST. All pre-registered delegates, study guides, and matrix assignments remain securely locked and reserved.
              </p>
            </div>

            {/* Note Prose */}
            <div className="space-y-3 sm:space-y-4 text-xs sm:text-sm text-neutral-300 font-outfit font-normal tracking-wide leading-relaxed">
              <p>
                When we set out to build <span className="text-white font-medium">Zenvitra</span>, we didn&apos;t want to build another bureaucratic simulator or superficial conferencing tool. We envisioned an uncompromising, sovereign operating system for the next generation of global statesmen, jurists, and policy architects.
              </p>

              <p>
                During our initial closed deployments, the demand exceeded our telemetry thresholds by over <span className="text-amber-300 font-mono font-medium">400%</span>. We witnessed extraordinary working papers drafted in real-time, high-stakes crisis caucuses, and debates that matched the intellectual rigor of real sovereign chambers.
              </p>

              <blockquote className="my-2.5 sm:my-3 pl-3 sm:pl-4 border-l-2 border-amber-400/60 font-serif italic text-xs sm:text-base text-amber-100/90 py-1">
                &ldquo;Great institutions are not manufactured overnight. They are carved through discipline, architectural integrity, and absolute fidelity to the civic trust.&rdquo;
              </blockquote>

              <p>
                Just as Bhagat Singh, Chandrashekhar Azad, and Veer Savarkar forged their revolution through unyielding defiance, intellectual grit, and uncompromising sacrifice, we too are bringing a revolution. This is not a passive plea for change; it is an active, sovereign uprising to break institutional monopolies and hand real power, discourse, and technology back to the youth.
              </p>

              <p>
                That is why we initiated this temporary systemic pause and rescheduled platform ignition to <span className="text-amber-300 font-semibold">October 25, 2026, at 2:00 PM IST</span>. Our engineering and dais councils are currently hardening our distributed infrastructure, integrating SHA-256 cryptographic resolution sealing, and refining our real-time Rules of Procedure engine.
              </p>

              <p>
                While the main floor remains locked, our doors are wide open for those ready to lead. If you are a diplomat, chair, designer, or builder who demands excellence, we welcome you to our Executive Council.
              </p>
            </div>

            {/* Signature & Seal */}
            <div className="pt-4 border-t border-white/[0.08] flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 sm:gap-4 font-mono text-xs">
              <div className="space-y-0.5 sm:space-y-1">
                <div 
                  className="text-sm sm:text-base text-white tracking-wide font-bold"
                  style={{ fontFamily: 'Clash Display, sans-serif' }}
                >
                  The Directorate &amp; Founding Council
                </div>
                <div className="text-[10px] sm:text-[11px] text-neutral-500 tracking-wider uppercase">
                  Zenvitra Foundation &bull; Udaipur // Global Dais
                </div>
              </div>

              <div className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-amber-500/[0.06] border border-amber-500/20 text-amber-300 text-[9px] sm:text-[10px] tracking-widest uppercase">
                <Shield className="w-3.5 h-3.5 text-amber-400 shrink-0" />
                <span>CRYPTOGRAPHICALLY RATIFIED</span>
              </div>
            </div>
          </div>
        </div>

        {/* Dedicated Callout: Join Core Team ONLY */}
        <div className="w-full max-w-2xl p-5 xs:p-6 sm:p-8 rounded-2xl sm:rounded-3xl bg-gradient-to-r from-white/[0.04] via-white/[0.02] to-white/[0.04] border border-white/[0.12] space-y-4 sm:space-y-5 text-center shadow-xl">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-400/[0.08] border border-emerald-400/30 text-[9px] sm:text-[10px] font-mono tracking-widest text-emerald-300 uppercase">
            <Users className="w-3 h-3" />
            <span>EXCLUSIVE CLEARANCE PORTAL</span>
          </div>

          <div className="space-y-1 sm:space-y-1.5">
            <h3 className="font-display font-medium text-lg sm:text-2xl text-white">
              Core Team Ingestion Remains Open
            </h3>
            <p className="text-xs sm:text-sm text-neutral-400 max-w-md mx-auto leading-relaxed">
              We are assembling executive leadership, engineering architects, and secretariat heads. Step forward to take command of the ecosystem.
            </p>
          </div>

          <div className="pt-2 flex flex-col sm:flex-row items-center justify-center gap-2.5 sm:gap-3">
            <Link
              href="/forms"
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-5 sm:px-6 py-3 sm:py-4 rounded-full bg-gradient-to-r from-cyan-500 to-teal-500 text-black font-mono text-xs font-bold hover:from-cyan-400 hover:to-teal-400 transition shadow-[0_0_25px_rgba(6,182,212,0.4)] cursor-pointer"
            >
              <FileText className="w-4 h-4 text-black" />
              <span>Open Public ZenForms (MUN Hub)</span>
            </Link>

            <Link
              href="/join-core-team"
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-5 sm:px-6 py-3 sm:py-4 rounded-full bg-white text-black font-mono text-xs font-semibold hover:bg-neutral-200 transition shadow-[0_0_30px_rgba(255,255,255,0.25)] group cursor-pointer"
            >
              <span>Apply for Core Team</span>
              <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
            </Link>

            <Link
              href="/pre-register"
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 sm:px-7 py-3 sm:py-4 rounded-full bg-amber-400 hover:bg-amber-300 text-black font-mono text-xs font-bold transition shadow-[0_0_30px_rgba(251,191,36,0.4)] hover:shadow-[0_0_40px_rgba(251,191,36,0.6)] cursor-pointer"
            >
              <Sparkles className="w-4 h-4 text-black" />
              <span>Pre-Register for Launch</span>
              <ArrowRight className="w-4 h-4 text-black" />
            </Link>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="relative z-10 w-full max-w-6xl mx-auto px-4 sm:px-6 py-4 sm:py-6 border-t border-white/[0.06] flex flex-col sm:flex-row items-center justify-between gap-3 sm:gap-4 text-[10px] sm:text-[11px] font-mono text-neutral-500 text-center sm:text-left">
        <span>ZENVITRA PROTOCOL &copy; 2026</span>
        <div className="flex flex-wrap items-center justify-center gap-3 sm:gap-6">
          <Link href="/forms" className="hover:text-cyan-300 transition text-cyan-400">
            Public ZenForms
          </Link>
          <span className="text-neutral-700">//</span>
          <Link href="/join-core-team" className="hover:text-white transition">
            Join Core Team
          </Link>
          <span className="text-neutral-700">//</span>
          <span className="text-amber-400/90 font-mono text-[9px] sm:text-[10px] tracking-widest uppercase">
            PRE-RELEASE ACTIVE
          </span>
        </div>
      </footer>

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

            {/* Luminous Golden-White Portal Bloom (Smooth Radial Aura Expansion) */}
      {isPortalBlooming && (
        <div className="fixed inset-0 z-[9998] bg-[radial-gradient(circle_at_center,rgba(255,255,255,1)_0%,rgba(251,191,36,0.85)_40%,rgba(255,255,255,0.95)_100%)] pointer-events-none transition-opacity duration-1000 opacity-100 animate-in fade-in" />
      )}

      {/* Full-Screen Pure White Flash Overlay on T-0s (2:00:00 PM) */}
      {isWhiteFlashActive && (
        <div className="fixed inset-0 z-[9999] bg-white pointer-events-none transition-opacity duration-150 opacity-100" />
      )}
    </div>
  );
}

