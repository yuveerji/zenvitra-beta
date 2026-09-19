'use client';

import React, { useState, useEffect, useMemo, useRef } from 'react';
import Link from 'next/link';
import { motion, useMotionValue, useSpring, useTransform } from 'framer-motion';
import { 
  Crown, 
  Calendar, 
  MapPin, 
  ArrowRight, 
  Sparkles, 
  FileSpreadsheet, 
  ExternalLink, 
  Check, 
  X,
  Send,
  Building2,
  Clock,
  ArrowUpRight,
  Video
} from 'lucide-react';
import { ZenDiplomacyCover } from '@/components/mun/ZenDiplomacyCover';
import { broadcastActivitySync } from '@/lib/reactiveActivityHub';

const LS_MATRIX_URL = 'zenvitra_zendiplomacy_matrix_url';
const DEFAULT_MATRIX_URL = 'https://docs.google.com/spreadsheets/d/1BxiMVs0XRA5nFMdKvBdBZjgmUUqptlbs74OgvE2upms/edit?usp=sharing';
const LS_REGISTRATIONS = 'zenvitra_zendiplomacy_registrations_v1';

export function JoinZenDiplomacyCard() {
  const [matrixUrl, setMatrixUrl] = useState(DEFAULT_MATRIX_URL);
  const [isRegisterOpen, setIsRegisterOpen] = useState(false);

  // 3D Tilt & Mouse Cursor Spotlight Tracking
  const cardRef = useRef<HTMLDivElement>(null);
  const [isHovered, setIsHovered] = useState(false);

  const x = useMotionValue<number>(0);
  const y = useMotionValue<number>(0);
  const mouseX = useMotionValue<number>(0);
  const mouseY = useMotionValue<number>(0);

  // Smooth spring physics for 3D card tilt & movement
  const springConfig = { damping: 26, stiffness: 220, mass: 0.5 };
  const rotateX = useSpring(useTransform(y, [-0.5, 0.5], [4.5, -4.5]), springConfig);
  const rotateY = useSpring(useTransform(x, [-0.5, 0.5], [-4.5, 4.5]), springConfig);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!cardRef.current) return;
    const rect = cardRef.current.getBoundingClientRect();
    const currentX = e.clientX - rect.left;
    const currentY = e.clientY - rect.top;

    mouseX.set(currentX);
    mouseY.set(currentY);

    const normX = currentX / rect.width - 0.5;
    const normY = currentY / rect.height - 0.5;
    x.set(normX);
    y.set(normY);
  };

  const handleMouseEnter = () => {
    setIsHovered(true);
  };

  const handleMouseLeave = () => {
    setIsHovered(false);
    x.set(0);
    y.set(0);
  };

  const cursorSpotlightBg = useTransform(
    [mouseX, mouseY],
    ([latestX, latestY]) =>
      `radial-gradient(650px circle at ${latestX}px ${latestY}px, rgba(34, 211, 238, 0.16) 0%, rgba(99, 102, 241, 0.10) 30%, rgba(255, 255, 255, 0.04) 55%, transparent 75%)`
  );

  const borderMask = useTransform(
    [mouseX, mouseY],
    ([latestX, latestY]) =>
      `radial-gradient(420px circle at ${latestX}px ${latestY}px, black 25%, transparent 80%)`
  );

  // Registration modal states
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [institution, setInstitution] = useState('');
  const [firstChoice, setFirstChoice] = useState('AIPPM');
  const [secondChoice, setSecondChoice] = useState('UNSC');
  const [portfolios, setPortfolios] = useState('');
  const [submitted, setSubmitted] = useState(false);

  // Live countdown to Oct 24, 2026 09:00 IST
  const targetDate = useMemo(() => new Date('2026-10-24T09:00:00+05:30').getTime(), []);
  const [timeLeft, setTimeLeft] = useState<{ days: number; hours: number; minutes: number; seconds: number }>({
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0
  });

  useEffect(() => {
    try {
      const saved = localStorage.getItem(LS_MATRIX_URL);
      if (saved && saved.trim().startsWith('http')) {
        setMatrixUrl(saved.trim());
      }
    } catch {}

    const tick = () => {
      const diff = Math.max(0, targetDate - Date.now());
      setTimeLeft({
        days: Math.floor(diff / (1000 * 60 * 60 * 24)),
        hours: Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)),
        minutes: Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60)),
        seconds: Math.floor((diff % (1000 * 60)) / 1000)
      });
    };
    tick();
    const timer = setInterval(tick, 1000);
    return () => clearInterval(timer);
  }, [targetDate]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !email.trim()) return;

    const payload = {
      id: `reg_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`,
      name: name.trim(),
      email: email.trim(),
      phone: phone.trim(),
      institution: institution.trim(),
      firstCommitteeChoice: firstChoice,
      secondCommitteeChoice: secondChoice,
      portfolioPreferences: portfolios.trim(),
      registeredAt: new Date().toISOString(),
      status: 'UNDER_REVIEW'
    };

    try {
      const current = JSON.parse(localStorage.getItem(LS_REGISTRATIONS) || '[]');
      current.unshift(payload);
      localStorage.setItem(LS_REGISTRATIONS, JSON.stringify(current));
      broadcastActivitySync({ source: 'event', action: 'rsvp', timestamp: Date.now() });
    } catch {}

    setSubmitted(true);
  };

  return (
    <div 
      style={{ perspective: 1400 }}
      className="w-full max-w-6xl mx-auto px-4 sm:px-8 py-10 text-left"
    >
      <motion.div
        ref={cardRef}
        onMouseMove={handleMouseMove}
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
        style={{
          rotateX,
          rotateY,
          transformStyle: 'preserve-3d',
        }}
        className="group relative rounded-3xl border border-cyan-500/35 overflow-hidden shadow-[0_25px_70px_rgba(0,0,0,0.85),0_0_50px_rgba(6,182,212,0.15)] hover:shadow-[0_35px_90px_rgba(0,0,0,0.95),0_0_75px_rgba(6,182,212,0.25)] bg-[#050711] transition-shadow duration-300"
      >
        {/* ── DYNAMIC CURSOR LIGHT SPOTLIGHT SHEEN ── */}
        <motion.div
          className="pointer-events-none absolute -inset-px transition-opacity duration-300 z-10"
          style={{
            opacity: isHovered ? 1 : 0,
            background: cursorSpotlightBg,
          }}
        />

        {/* ── DYNAMIC BORDER HIGHLIGHT FLARE ── */}
        <motion.div
          className="pointer-events-none absolute inset-0 rounded-3xl z-10 transition-opacity duration-300"
          style={{
            opacity: isHovered ? 0.9 : 0,
            border: '1.5px solid rgba(34, 211, 238, 0.75)',
            maskImage: borderMask,
            WebkitMaskImage: borderMask,
          }}
        />
        
        {/* ── TOP: ULTRA-CRISP RECREATED CODE COVER BANNER ── */}
        <div className="relative group overflow-hidden border-b border-white/10">
          <ZenDiplomacyCover variant="compact" showBadge={true} interactive={true} />

          {/* Overlay Tag and Quick Link */}
          <div className="absolute bottom-3 sm:bottom-4 right-3 sm:right-4 z-20 flex items-center gap-2">
            <Link
              href="/zen-diplomacy"
              className="px-3 py-1.5 rounded-full bg-black/80 hover:bg-black text-white border border-white/20 hover:border-white/40 text-[11px] font-mono tracking-wider transition backdrop-blur-md flex items-center gap-1.5 shadow-lg"
            >
              <span>Explore Portal</span>
              <ArrowUpRight className="w-3.5 h-3.5 text-cyan-400" />
            </Link>
          </div>
        </div>

        {/* ── BOTTOM: CONTEXT, COMMITTEES & ACTION HUB ── */}
        <div className="p-6 sm:p-10 space-y-8">
          
          {/* Header & Organizer Verification */}
          <div className="flex flex-col lg:flex-row lg:items-start justify-between gap-6 pb-6 border-b border-white/10">
            <div className="space-y-3 max-w-2xl">
              <div className="flex flex-wrap items-center gap-2.5">
                <span className="px-3 py-1 rounded-full bg-cyan-500/15 border border-cyan-500/30 text-cyan-300 font-mono text-xs font-bold uppercase tracking-wider inline-flex items-center gap-1.5">
                  <Crown className="w-3.5 h-3.5 text-cyan-400" />
                  FLAGSHIP ONLINE ASSEMBLY
                </span>
                <span className="px-3 py-1 rounded-full bg-purple-500/15 border border-purple-500/30 text-purple-300 font-mono text-xs font-bold uppercase tracking-wider inline-flex items-center gap-1.5">
                  <Video className="w-3.5 h-3.5 text-purple-400" />
                  HOSTED ON ZEN.CALL
                </span>
                <span className="px-3 py-1 rounded-full bg-emerald-500/15 border border-emerald-500/30 text-emerald-400 font-mono text-xs font-bold uppercase tracking-wider inline-flex items-center gap-1.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                  APPLICATIONS OPEN
                </span>
              </div>

              <h2 className="text-3xl sm:text-4xl font-display font-black text-white tracking-tight uppercase leading-tight">
                Join ZEN.DIPLOMACY <span className="text-cyan-400">MUN 2026</span>
              </h2>

              <p className="font-sans text-sm sm:text-base text-neutral-300 font-light leading-relaxed">
                Step into sovereign multilateral diplomacy on <strong className="text-white">October 24th &amp; 25th, 2026</strong>, hosted live on <strong className="text-cyan-300">ZEN.CALL Virtual Chambers</strong>. Convening delegates, policy researchers, and student parliamentarians worldwide for zero-scripted debate, real-world draft resolutions, and verifiable credentials.
              </p>
            </div>

            {/* Live Countdown Clock */}
            <div className="p-4 rounded-2xl bg-white/[0.03] border border-white/10 flex flex-col items-start sm:items-end justify-center space-y-2 shrink-0">
              <span className="text-[10px] font-mono text-neutral-400 uppercase tracking-widest flex items-center gap-1.5">
                <Clock className="w-3 h-3 text-cyan-400" />
                CONFERENCE COMMENCES IN
              </span>
              <div className="flex items-center gap-2 font-mono text-base sm:text-lg font-bold text-white">
                <div className="px-2.5 py-1 rounded-lg bg-black/60 border border-white/10 text-center">
                  <span>{String(timeLeft.days).padStart(2, '0')}</span>
                  <span className="text-[9px] block text-neutral-400 font-normal">DAYS</span>
                </div>
                <span>:</span>
                <div className="px-2.5 py-1 rounded-lg bg-black/60 border border-white/10 text-center">
                  <span>{String(timeLeft.hours).padStart(2, '0')}</span>
                  <span className="text-[9px] block text-neutral-400 font-normal">HRS</span>
                </div>
                <span>:</span>
                <div className="px-2.5 py-1 rounded-lg bg-black/60 border border-white/10 text-center">
                  <span>{String(timeLeft.minutes).padStart(2, '0')}</span>
                  <span className="text-[9px] block text-neutral-400 font-normal">MIN</span>
                </div>
                <span>:</span>
                <div className="px-2.5 py-1 rounded-lg bg-black/60 border border-white/10 text-center text-cyan-400">
                  <span>{String(timeLeft.seconds).padStart(2, '0')}</span>
                  <span className="text-[9px] block text-neutral-400 font-normal">SEC</span>
                </div>
              </div>
            </div>
          </div>

          {/* Committees Grid Preview */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-mono uppercase tracking-widest text-neutral-400 font-semibold">
                4 CONVENED COMMITTEES &bull; AGENDAS REVEALING SOON
              </span>
              <span className="text-[11px] font-mono text-cyan-400">
                Organizer: <strong className="text-white">yuveer (@yuveer)</strong>
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
              <div className="p-3.5 rounded-2xl bg-amber-500/[0.04] border border-amber-500/20 space-y-1 hover:border-amber-500/40 transition">
                <span className="text-[10px] font-mono font-bold text-amber-400 uppercase tracking-wider block">
                  AIPPM
                </span>
                <h4 className="font-display font-bold text-sm text-white">
                  All India Political Parties Meet
                </h4>
                <p className="text-[11px] text-neutral-400 font-sans leading-relaxed">
                  National parliamentary council &bull; Agenda revealing soon
                </p>
              </div>

              <div className="p-3.5 rounded-2xl bg-cyan-500/[0.04] border border-cyan-500/20 space-y-1 hover:border-cyan-500/40 transition">
                <span className="text-[10px] font-mono font-bold text-cyan-400 uppercase tracking-wider block">
                  EDU.MINISTRY
                </span>
                <h4 className="font-display font-bold text-sm text-white">
                  Education Ministry of India
                </h4>
                <p className="text-[11px] text-neutral-400 font-sans leading-relaxed">
                  National pedagogical overhaul &bull; Agenda revealing soon
                </p>
              </div>

              <div className="p-3.5 rounded-2xl bg-purple-500/[0.04] border border-purple-500/20 space-y-1 hover:border-purple-500/40 transition">
                <span className="text-[10px] font-mono font-bold text-purple-400 uppercase tracking-wider block">
                  UNESCO
                </span>
                <h4 className="font-display font-bold text-sm text-white">
                  UN Educational, Scientific &amp; Cultural
                </h4>
                <p className="text-[11px] text-neutral-400 font-sans leading-relaxed">
                  Heritage, science ethics &amp; AI &bull; Agenda revealing soon
                </p>
              </div>

              <div className="p-3.5 rounded-2xl bg-rose-500/[0.04] border border-rose-500/20 space-y-1 hover:border-rose-500/40 transition">
                <span className="text-[10px] font-mono font-bold text-rose-400 uppercase tracking-wider block">
                  UNSC
                </span>
                <h4 className="font-display font-bold text-sm text-white">
                  UN Security Council
                </h4>
                <p className="text-[11px] text-neutral-400 font-sans leading-relaxed">
                  International crisis &amp; security &bull; Agenda revealing soon
                </p>
              </div>
            </div>
          </div>

          {/* Action Row */}
          <div className="flex flex-wrap items-center justify-between gap-4 pt-4 border-t border-white/10">
            <div className="flex flex-wrap items-center gap-3">
              <button
                type="button"
                onClick={() => setIsRegisterOpen(true)}
                className="px-6 py-3 rounded-2xl bg-white hover:bg-neutral-200 text-black font-display font-bold text-xs uppercase tracking-wider transition shadow-[0_0_25px_rgba(255,255,255,0.25)] flex items-center gap-2 cursor-pointer hover:scale-105 active:scale-95"
              >
                <Sparkles className="w-4 h-4 text-black" />
                <span>Join as Delegate</span>
              </button>

              <a
                href={matrixUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="px-5 py-3 rounded-2xl bg-gradient-to-r from-emerald-500/15 to-cyan-500/15 hover:from-emerald-500/25 hover:to-cyan-500/25 border border-emerald-500/40 text-emerald-300 font-mono text-xs font-bold transition flex items-center gap-2 cursor-pointer hover:scale-105"
                title="View live country portfolio matrix"
              >
                <FileSpreadsheet className="w-4 h-4 text-emerald-400" />
                <span>Portfolio Matrix Sheet</span>
                <ExternalLink className="w-3.5 h-3.5 ml-0.5" />
              </a>
            </div>

            <Link
              href="/zen-diplomacy"
              className="font-mono text-xs text-neutral-300 hover:text-white flex items-center gap-1.5 transition underline decoration-white/20 underline-offset-4"
            >
              <span>View Full Dossier, Schedule &amp; Guidelines</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>
        </div>
      </motion.div>

      {/* ── QUICK REGISTRATION MODAL ── */}
      {isRegisterOpen && (
        <div className="fixed inset-0 z-[150] flex items-center justify-center p-4 bg-black/85 backdrop-blur-xl animate-fadeIn">
          <div className="relative w-full max-w-lg rounded-3xl bg-[#090b14] border border-white/20 shadow-[0_25px_80px_rgba(0,0,0,0.9)] p-6 sm:p-8 space-y-6 text-left">
            <button
              type="button"
              onClick={() => { setIsRegisterOpen(false); setSubmitted(false); }}
              className="absolute top-5 right-5 p-2 rounded-full bg-white/5 hover:bg-white/10 text-neutral-400 hover:text-white transition cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="space-y-1">
              <span className="text-[10px] font-mono text-cyan-400 tracking-widest uppercase block">
                OFFICIAL DELEGATE REGISTRATION
              </span>
              <h3 className="font-display font-black text-2xl text-white uppercase">
                ZEN.DIPLOMACY MUN 2026
              </h3>
              <p className="text-xs text-neutral-400 font-sans">
                October 24th &amp; 25th, 2026 &bull; Online on ZEN.CALL Virtual Chambers &bull; Organizer: Yuveer
              </p>
            </div>

            {submitted ? (
              <div className="p-6 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 text-center space-y-4">
                <div className="w-12 h-12 rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center mx-auto">
                  <Check className="w-6 h-6" />
                </div>
                <div className="space-y-1">
                  <h4 className="font-display font-bold text-lg text-white">Application Recorded</h4>
                  <p className="text-xs text-neutral-300 font-sans leading-relaxed">
                    Your delegate application has been submitted to the Executive Secretariat. You will receive portfolio allocation and conference directives at <strong className="text-white">{email}</strong>.
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => { setIsRegisterOpen(false); setSubmitted(false); }}
                  className="px-6 py-2.5 rounded-full bg-white text-black text-xs font-mono font-bold hover:bg-neutral-200 transition cursor-pointer"
                >
                  Close Confirmation
                </button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-4 font-mono text-xs">
                <div>
                  <label className="text-[11px] text-neutral-300 block mb-1">Full Legal Name *</label>
                  <input
                    type="text"
                    required
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="e.g. Maya Chen"
                    className="w-full px-3.5 py-2.5 rounded-xl bg-white/[0.04] border border-white/10 text-white placeholder:text-neutral-500 focus:border-cyan-400 focus:outline-none"
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="text-[11px] text-neutral-300 block mb-1">Email Address *</label>
                    <input
                      type="email"
                      required
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="delegate@institution.edu"
                      className="w-full px-3.5 py-2.5 rounded-xl bg-white/[0.04] border border-white/10 text-white placeholder:text-neutral-500 focus:border-cyan-400 focus:outline-none"
                    />
                  </div>
                  <div>
                    <label className="text-[11px] text-neutral-300 block mb-1">WhatsApp / Phone</label>
                    <input
                      type="tel"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      placeholder="+91 98765 43210"
                      className="w-full px-3.5 py-2.5 rounded-xl bg-white/[0.04] border border-white/10 text-white placeholder:text-neutral-500 focus:border-cyan-400 focus:outline-none"
                    />
                  </div>
                </div>

                <div>
                  <label className="text-[11px] text-neutral-300 block mb-1">School / University / Institution</label>
                  <input
                    type="text"
                    value={institution}
                    onChange={(e) => setInstitution(e.target.value)}
                    placeholder="e.g. Delhi Public School / Ashoka University"
                    className="w-full px-3.5 py-2.5 rounded-xl bg-white/[0.04] border border-white/10 text-white placeholder:text-neutral-500 focus:border-cyan-400 focus:outline-none"
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="text-[11px] text-neutral-300 block mb-1">First Committee Choice *</label>
                    <select
                      value={firstChoice}
                      onChange={(e) => setFirstChoice(e.target.value)}
                      className="w-full px-3 py-2.5 rounded-xl bg-[#111322] border border-white/15 text-white focus:border-cyan-400 focus:outline-none cursor-pointer"
                    >
                      <option value="AIPPM">AIPPM (Political Parties)</option>
                      <option value="EDU.MINISTRY">Education Ministry of India</option>
                      <option value="UNESCO">UNESCO</option>
                      <option value="UNSC">UNSC (Security Council)</option>
                    </select>
                  </div>

                  <div>
                    <label className="text-[11px] text-neutral-300 block mb-1">Second Committee Choice *</label>
                    <select
                      value={secondChoice}
                      onChange={(e) => setSecondChoice(e.target.value)}
                      className="w-full px-3 py-2.5 rounded-xl bg-[#111322] border border-white/15 text-white focus:border-cyan-400 focus:outline-none cursor-pointer"
                    >
                      <option value="UNSC">UNSC (Security Council)</option>
                      <option value="AIPPM">AIPPM (Political Parties)</option>
                      <option value="EDU.MINISTRY">Education Ministry of India</option>
                      <option value="UNESCO">UNESCO</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="text-[11px] text-neutral-300 block mb-1">
                    Preferred Portfolios (from Matrix Sheet)
                  </label>
                  <input
                    type="text"
                    value={portfolios}
                    onChange={(e) => setPortfolios(e.target.value)}
                    placeholder="e.g. France, China, Ministry of Home Affairs"
                    className="w-full px-3.5 py-2.5 rounded-xl bg-white/[0.04] border border-white/10 text-white placeholder:text-neutral-500 focus:border-cyan-400 focus:outline-none"
                  />
                </div>

                <div className="pt-2">
                  <button
                    type="submit"
                    className="w-full py-3 rounded-2xl bg-white text-black font-display font-bold text-xs uppercase tracking-wider hover:bg-neutral-200 transition cursor-pointer flex items-center justify-center gap-2 shadow-lg"
                  >
                    <Send className="w-3.5 h-3.5" />
                    <span>Submit Official Application</span>
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
