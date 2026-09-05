'use client';

import React, { useState, useEffect, useRef } from 'react';
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
  Shield
} from 'lucide-react';
import { StatusNotificationModal } from '@/components/navigation/StatusNotificationModal';

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

    try {
      const res = await fetch('/api/access/verify', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: clearanceEmail }),
      });

      const data = await res.json();
      setClearanceResult(data);

      if (data.unlocked || data.isApproved || data.status === 'APPROVED') {
        if (typeof window !== 'undefined') {
          localStorage.setItem('zenvitra_applicant_email', clearanceEmail);
        }
        setTimeout(() => {
          window.location.href = `/statussignin?email=${encodeURIComponent(clearanceEmail)}`;
        }, 1500);
      }
    } catch (err: any) {
      setClearanceResult({
        status: 'ERROR',
        message: 'Network verification failed. Please check your internet connection.',
      });
    } finally {
      setIsVerifying(false);
    }
  };

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
          <div className="relative h-8 w-8 sm:h-9 sm:w-9 flex items-center justify-center shrink-0">
            <img
              src="/assets/logo.png"
              alt="Zenvitra Logo"
              className="h-full w-full object-contain filter drop-shadow-[0_0_10px_rgba(255,255,255,0.3)]"
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
            <div className="font-mono text-[9px] tracking-widest text-amber-400/90 uppercase mt-1">
              SYSTEM CONCURRENCY HARDENING
            </div>
          </div>
        </div>

        <div className="flex items-center gap-2.5 sm:gap-3">
          {/* Sign In & Register Navigation */}
          <Link
            href="/statussignin"
            className="hidden md:inline-flex items-center px-3 py-1.5 rounded-full bg-white/[0.04] hover:bg-white/[0.09] border border-white/10 text-xs font-mono text-neutral-300 hover:text-white transition"
          >
            Sign In
          </Link>

          <Link
            href="/statusregister"
            className="hidden sm:inline-flex items-center px-3 py-1.5 rounded-full bg-amber-500/[0.1] hover:bg-amber-500/[0.2] border border-amber-500/30 text-xs font-mono text-amber-300 hover:text-amber-200 transition"
          >
            Pre-Register
          </Link>

          {/* Real-time Status Notification Bell */}
          <button
            onClick={() => setIsClearanceModalOpen(true)}
            className="relative flex items-center justify-center p-2 rounded-full bg-amber-400/[0.08] hover:bg-amber-400/[0.18] border border-amber-400/30 text-amber-300 transition cursor-pointer group shadow-[0_0_15px_rgba(251,191,36,0.15)]"
            title="Check Your Application Status"
          >
            <Bell className="w-4 h-4 transition-transform duration-300 group-hover:scale-110 group-hover:rotate-12" />
            <span className="absolute -top-0.5 -right-0.5 w-2 h-2 rounded-full bg-amber-400 animate-ping" />
            <span className="absolute -top-0.5 -right-0.5 w-2 h-2 rounded-full bg-amber-400" />
          </button>

          <button
            onClick={() => setIsClearanceModalOpen(true)}
            className="flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-amber-500/[0.08] hover:bg-amber-500/[0.15] border border-amber-500/30 text-xs font-mono text-amber-300 transition cursor-pointer"
          >
            <KeyRound className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Check Clearance</span>
          </button>

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

      {/* Reusable Status Notification Modal */}
      <StatusNotificationModal
        isOpen={isClearanceModalOpen}
        onClose={() => setIsClearanceModalOpen(false)}
      />

      {/* Main Center Content */}
      <main className="relative z-10 max-w-4xl mx-auto px-6 py-12 flex-1 flex flex-col items-center justify-center text-center space-y-10">
        {/* Status Badge */}
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-amber-400/[0.07] border border-amber-400/30 text-xs font-mono tracking-widest text-amber-300 uppercase shadow-[0_0_20px_rgba(251,191,36,0.15)]">
          <Radio className="w-3.5 h-3.5 animate-pulse text-amber-400" />
          <span>GLOBAL PLATFORM RE-ARCHITECTING UNDERWAY</span>
        </div>

        {/* Hero Title */}
        <div className="space-y-4 max-w-2xl">
          <h1 
            className="text-4xl sm:text-6xl text-white tracking-tight leading-[1.1] font-semibold"
            style={{ fontFamily: 'Clash Display, var(--font-space), sans-serif' }}
          >
            Calibrating the <br />
            <span className="font-serif italic font-normal text-amber-200">ZENVITRA</span> Ecosystem.
          </h1>
          <p className="text-sm sm:text-base text-neutral-400 font-light leading-relaxed">
            Following our initial deployment, our engineering &amp; secretariat council has initiated a temporary systemic freeze to eradicate anomalies, harden protocols, and scale our core infrastructure.
          </p>
        </div>

        {/* Hero Monolith Interactive 3D Card with Mouse Cursor Effect */}
        <div className="w-full max-w-xs sm:max-w-sm mx-auto my-2">
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
              className="relative w-full h-full rounded-[2.2rem] bg-[#050608] border border-white/15 p-6 sm:p-7 flex flex-col justify-between overflow-hidden shadow-[0_25px_80px_rgba(0,0,0,0.95)] hover:shadow-[0_0_50px_rgba(251,191,36,0.15)] transition-shadow duration-300 group cursor-pointer"
            >
              {/* Dynamic Cursor Spotlight Radial Glow Sheen */}
              <div
                className="pointer-events-none absolute inset-0 transition-opacity duration-300 z-20"
                style={{
                  opacity: glow.opacity,
                  background: `radial-gradient(380px circle at ${glow.x}% ${glow.y}%, rgba(251, 191, 36, 0.18), transparent 75%)`,
                }}
              />

              {/* Full-Bleed Monolith Artwork */}
              <div className="absolute inset-0 z-0 select-none pointer-events-none">
                <Image
                  src="/assets/hero-monolith.png"
                  alt="Zenvitra Monolith Portal"
                  fill
                  priority
                  className="object-cover object-center brightness-[0.92] contrast-[1.08] group-hover:scale-105 transition-transform duration-700 ease-out"
                />
                {/* Obsidian Gradient Vignettes */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/95 via-black/20 to-black/80" />
                <div className="absolute inset-0 bg-gradient-to-b from-black/80 via-transparent to-black/90" />
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

                <div className="px-3 py-1 rounded-full border border-white/15 bg-black/70 backdrop-blur-md shadow-sm">
                  <span className="text-[8px] font-mono tracking-[0.22em] text-neutral-300 uppercase font-medium">
                    ARCHETYPE 01
                  </span>
                </div>
              </div>

              {/* Monolith Card Bottom: STATUS PORTAL OPENING SOON */}
              <div 
                style={{ transform: 'translateZ(25px)' }}
                className="relative z-10 flex flex-col items-start gap-2 text-left pb-1 pointer-events-none"
              >
                <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-black/85 border border-amber-400/30 backdrop-blur-md shadow-[0_0_15px_rgba(251,191,36,0.2)]">
                  <span className="w-2 h-2 rounded-full bg-amber-400 animate-pulse shadow-[0_0_8px_#fbbf24]" />
                  <span className="text-[9px] font-mono tracking-[0.22em] text-amber-300 uppercase font-semibold">
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

        {/* Founder's Note / Sovereign Communiqué */}
        <div className="w-full max-w-3xl text-left">
          <div className="relative rounded-[2.5rem] bg-[#07090e]/95 border border-white/15 p-8 sm:p-10 space-y-6 shadow-[0_25px_80px_rgba(0,0,0,0.9)] overflow-hidden">
            {/* Ambient Corner Accent */}
            <div className="absolute top-0 right-0 w-64 h-64 bg-gradient-to-br from-amber-500/[0.08] to-transparent blur-2xl pointer-events-none" />
            
            {/* Note Header */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-white/[0.08] pb-5">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-2xl bg-amber-400/[0.08] border border-amber-400/30 flex items-center justify-center text-amber-300 shadow-[0_0_20px_rgba(251,191,36,0.15)]">
                  <Quote className="w-5 h-5 text-amber-400" />
                </div>
                <div>
                  <div className="text-[10px] font-mono tracking-widest text-amber-400 uppercase">
                    GENESIS COMMUNIQUÉ // ARCHIVE NO. 01
                  </div>
                  <h2 
                    className="text-xl sm:text-2xl font-bold text-white tracking-tight mt-0.5"
                    style={{ fontFamily: 'Clash Display, sans-serif' }}
                  >
                    A Note From The Founders
                  </h2>
                </div>
              </div>

              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/[0.03] border border-white/10 font-mono text-[10px] text-neutral-400 self-start sm:self-auto">
                <span className="w-1.5 h-1.5 rounded-full bg-amber-400 animate-pulse" />
                <span>SEPTEMBER INGESTION CYCLE</span>
              </div>
            </div>

            {/* Note Prose */}
            <div className="space-y-4 text-xs sm:text-sm text-neutral-300 font-light leading-relaxed">
              <p>
                When we set out to build <span className="text-white font-medium">Zenvitra</span>, we didn&apos;t want to build another bureaucratic simulator or superficial conferencing tool. We envisioned an uncompromising, sovereign operating system for the next generation of global statesmen, jurists, and policy architects.
              </p>

              <p>
                During our initial closed deployments, the demand exceeded our telemetry thresholds by over <span className="text-amber-300 font-mono font-medium">400%</span>. We witnessed extraordinary working papers drafted in real-time, high-stakes crisis caucuses, and debates that matched the intellectual rigor of real sovereign chambers.
              </p>

              <blockquote className="my-3 pl-4 border-l-2 border-amber-400/60 font-serif italic text-sm sm:text-base text-amber-100/90 py-1">
                &ldquo;Great institutions are not manufactured overnight. They are carved through discipline, architectural integrity, and absolute fidelity to the civic trust.&rdquo;
              </blockquote>

              <p>
                That is why we initiated this temporary systemic pause until <span className="text-white font-medium">September 18, 5:00 PM IST</span>. Our engineering and dais councils are currently hardening our distributed infrastructure, integrating SHA-256 cryptographic resolution sealing, and refining our real-time Rules of Procedure engine.
              </p>

              <p>
                While the main floor remains locked, our doors are wide open for those ready to lead. If you are a diplomat, chair, designer, or builder who demands excellence, we welcome you to our Executive Council.
              </p>
            </div>

            {/* Signature & Seal */}
            <div className="pt-4 border-t border-white/[0.08] flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 font-mono text-xs">
              <div className="space-y-1">
                <div 
                  className="text-base text-white tracking-wide font-bold"
                  style={{ fontFamily: 'Clash Display, sans-serif' }}
                >
                  The Directorate &amp; Founding Council
                </div>
                <div className="text-[11px] text-neutral-500 tracking-wider uppercase">
                  Zenvitra Foundation &bull; New Delhi // Global Dais
                </div>
              </div>

              <div className="flex items-center gap-2 px-3.5 py-1.5 rounded-xl bg-amber-500/[0.06] border border-amber-500/20 text-amber-300 text-[10px] tracking-widest uppercase">
                <Shield className="w-3.5 h-3.5 text-amber-400" />
                <span>CRYPTOGRAPHICALLY RATIFIED</span>
              </div>
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

          <div className="pt-2 flex flex-col sm:flex-row items-center justify-center gap-3">
            <Link
              href="/join-core-team"
              className="w-full sm:w-auto inline-flex items-center justify-center gap-3 px-8 py-4 rounded-full bg-white text-black font-mono text-xs font-semibold hover:bg-neutral-200 transition shadow-[0_0_30px_rgba(255,255,255,0.25)] group cursor-pointer"
            >
              <span>Apply for Core Team Leadership</span>
              <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
            </Link>

            <button
              onClick={() => setIsClearanceModalOpen(true)}
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-4 rounded-full bg-white/[0.04] hover:bg-white/[0.08] border border-white/10 text-neutral-300 font-mono text-xs transition cursor-pointer"
            >
              <KeyRound className="w-3.5 h-3.5 text-amber-400" />
              <span>Verify Status / Enter</span>
            </button>
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

