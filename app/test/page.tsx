'use client';

import React, { useEffect, useState, Suspense } from 'react';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import { motion } from 'framer-motion';
import { 
  Sparkles, 
  ShieldCheck, 
  ArrowRight, 
  CheckCircle2, 
  Loader2, 
  Users, 
  FileText, 
  Award, 
  Vote,
  Terminal,
  Clock,
  AlertTriangle,
  Lock,
  BookOpen,
  Feather,
  Newspaper,
  Table,
  ExternalLink,
  Globe
} from 'lucide-react';
import { useAuth } from '@/context/AuthContext';

const TEST_NODE_EXPIRY_DATE = new Date('2026-11-19T23:59:59+05:30');

function TestPilotEnclaveContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { continueAsTestUser, switchRole, profile } = useAuth();
  const [step, setStep] = useState(0);
  const [ready, setReady] = useState(false);
  const [countdown, setCountdown] = useState(5);
  const [isPaused, setIsPaused] = useState(false);
  const [activePersona, setActivePersona] = useState<string>('delegate');

  const isExpired = new Date() > TEST_NODE_EXPIRY_DATE;

  const rawRedirect = searchParams.get('redirect');
  const targetRedirect = rawRedirect && rawRedirect.trim() && rawRedirect.startsWith('/') && !rawRedirect.startsWith('/test')
    ? rawRedirect.trim()
    : '/pulse';

  useEffect(() => {
    if (isExpired) return;

    let isCancelled = false;

    async function initTestSession() {
      try {
        await continueAsTestUser();
        if (typeof document !== 'undefined') {
          document.cookie = 'zenvitra_session=active; path=/; SameSite=Lax';
          document.cookie = 'zenvitra_clearance=SOVEREIGN_GRANTED; path=/; SameSite=Lax';
        }

        if (isCancelled) return;
        setStep(1);

        setTimeout(() => { if (!isCancelled) setStep(2); }, 120);
        setTimeout(() => { if (!isCancelled) setStep(3); }, 240);
        setTimeout(() => { if (!isCancelled) setStep(4); }, 360);
        setTimeout(() => { if (!isCancelled) setStep(5); }, 480);
        setTimeout(() => { if (!isCancelled) setStep(6); }, 600);
        setTimeout(() => { if (!isCancelled) setStep(7); }, 720);
        setTimeout(() => {
          if (!isCancelled) {
            setStep(8);
            setReady(true);
          }
        }, 840);

      } catch (err) {
        console.error('Failed to initialize test pilot node:', err);
        setReady(true);
      }
    }

    initTestSession();

    return () => {
      isCancelled = true;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isExpired]);

  // Countdown timer for auto-redirect
  useEffect(() => {
    if (!ready || isPaused || isExpired) return;

    if (countdown <= 0) {
      window.location.href = targetRedirect;
      return;
    }

    const timer = setInterval(() => {
      setCountdown((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          window.location.href = targetRedirect;
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [ready, isPaused, countdown, isExpired, targetRedirect]);

  const handleSelectPersona = (roleKey: string) => {
    setIsPaused(true);
    setActivePersona(roleKey);
    switchRole(roleKey as any);
  };

  return (
    <div className="min-h-screen bg-[#030407] text-white flex flex-col justify-between items-center p-6 relative overflow-hidden font-sans selection:bg-cyan-500/30">
      {/* Background ambient lighting glow */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-[550px] h-[550px] bg-gradient-to-tr from-cyan-500/20 via-emerald-500/15 to-purple-500/20 blur-[130px] rounded-full pointer-events-none" />

      {/* Top Header */}
      <header className="w-full max-w-xl flex items-center justify-between z-10 pt-4">
        <Link href="/" className="flex items-center gap-2.5">
          <img src="/assets/logo-new.png" alt="ZENVITRA Logo" className="w-9 h-9 object-contain mix-blend-screen drop-shadow-[0_0_12px_rgba(255,255,255,0.4)] brand-logo-img" />
          <span className="font-display font-black text-sm tracking-wider uppercase text-white">ZENVITRA</span>
        </Link>
        <span className={`px-2.5 py-1 rounded-full border text-[10px] font-sans font-bold uppercase tracking-wider flex items-center gap-1.5 ${
          isExpired
            ? 'bg-rose-500/10 border-rose-500/30 text-rose-300'
            : 'bg-cyan-500/10 border border-cyan-500/30 text-cyan-300'
        }`}>
          {!isExpired && <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 animate-ping" />}
          {isExpired ? 'Test Node Closed' : 'QA Test Enclave'}
        </span>
      </header>

      {/* Main Terminal Card */}
      <main className="w-full max-w-xl my-auto z-10 py-6">
        <motion.div 
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.35 }}
          className="rounded-3xl bg-[#07080b]/90 border border-white/10 p-6 sm:p-8 shadow-[0_25px_80px_rgba(0,0,0,0.8)] backdrop-blur-2xl space-y-5 text-left"
        >
          {isExpired ? (
            /* Expired / Closed State */
            <div className="space-y-6 text-center py-4">
              <div className="w-16 h-16 rounded-2xl bg-rose-500/10 border border-rose-500/25 flex items-center justify-center mx-auto text-rose-400 shadow-inner">
                <Lock className="w-8 h-8" />
              </div>

              <div className="space-y-2">
                <h1 className="text-2xl font-display font-extrabold text-white">
                  Test Node Officially Closed
                </h1>
                <p className="text-sm text-neutral-400 max-w-md mx-auto leading-relaxed">
                  The public Test Node officially closed on <strong className="text-white">19th November 2026</strong>. Public preview testing has completed. Please authenticate with your personal sovereign account or register to continue.
                </p>
              </div>

              <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2">
                <Link
                  href="/login"
                  className="w-full sm:w-auto px-6 py-3 rounded-2xl bg-white text-black font-sans font-bold text-xs uppercase tracking-wider hover:bg-neutral-200 transition shadow-lg"
                >
                  Sign In to Account
                </Link>
                <Link
                  href="/register"
                  className="w-full sm:w-auto px-6 py-3 rounded-2xl bg-white/[0.08] hover:bg-white/15 text-white border border-white/15 font-sans font-bold text-xs uppercase tracking-wider transition"
                >
                  Create Sovereign Profile
                </Link>
              </div>
            </div>
          ) : (
            /* Active Test Node Initializing State */
            <>
              {/* Badge & Title */}
              <div className="space-y-2 border-b border-white/10 pb-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="p-2 rounded-xl bg-cyan-500/15 text-cyan-300 border border-cyan-500/30">
                      <Terminal className="w-4 h-4 text-cyan-400" />
                    </span>
                    <div>
                      <p className="text-[10px] font-sans text-cyan-300 uppercase tracking-widest font-bold">SOVEREIGN TEST ENCLAVE ACTIVE</p>
                      <h1 className="text-xl sm:text-2xl font-black font-display text-white tracking-tight">
                        Test Node Initialized
                      </h1>
                    </div>
                  </div>

                  {ready && !isPaused && (
                    <span className="hidden sm:inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-cyan-500/10 border border-cyan-500/30 text-cyan-300 text-[11px] font-mono">
                      <span>Auto-launch in</span>
                      <strong className="text-white font-bold">{countdown}s</strong>
                    </span>
                  )}
                </div>

                <p className="text-xs text-neutral-400 leading-relaxed font-sans">
                  Operating as verified <strong className="text-white">@test</strong> with complete platform clearance across all 8 core feature modules.
                </p>
              </div>

              {/* PRIMARY STANDALONE TEST NODE SANDBOX CALLOUT */}
              <div className="p-4 rounded-2xl bg-gradient-to-r from-cyan-950/70 to-purple-950/70 border border-cyan-400/50 flex flex-col sm:flex-row items-center justify-between gap-4">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-cyan-500/20 border border-cyan-400 flex items-center justify-center text-cyan-300 font-bold shrink-0">
                    <Sparkles className="w-5 h-5 text-cyan-300" />
                  </div>
                  <div>
                    <h3 className="text-sm font-bold text-white uppercase tracking-tight font-display">
                      Enter Complete Sandbox Environment
                    </h3>
                    <p className="text-xs text-neutral-300 font-sans">
                      Explore the fully seeded parallel universe with demo MUN conferences, mock Cashfree payments, and simulated chat.
                    </p>
                  </div>
                </div>

                <Link
                  href="/test-node"
                  className="px-5 py-2.5 rounded-xl bg-cyan-400 hover:bg-cyan-300 text-black font-display font-bold text-xs uppercase tracking-wider transition shrink-0 flex items-center gap-1.5 shadow-[0_0_20px_rgba(6,182,212,0.4)]"
                >
                  <span>Launch Test Node &rarr;</span>
                </Link>
              </div>

              {/* 1-Click Role / Persona Selector */}
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-mono uppercase tracking-wider text-neutral-400">
                    Switch Test Persona:
                  </span>
                  {isPaused && (
                    <span className="text-[10px] text-amber-300 font-mono">
                      &bull; Auto-launch paused
                    </span>
                  )}
                </div>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-1.5">
                  {[
                    { id: 'delegate', label: 'Delegate', icon: '🏛️', desc: 'Debates & UNSC' },
                    { id: 'journalist', label: 'Journalist', icon: '📰', desc: 'News Wire' },
                    { id: 'organizer', label: 'Organizer', icon: '⚡', desc: 'Sheets Sync' },
                    { id: 'architect', label: 'Architect', icon: '👑', desc: 'Full Access' },
                  ].map((p) => {
                    const isSelected = activePersona === p.id;
                    return (
                      <button
                        key={p.id}
                        type="button"
                        onClick={() => handleSelectPersona(p.id)}
                        className={`p-2 rounded-xl border text-left transition cursor-pointer flex flex-col justify-between ${
                          isSelected
                            ? 'bg-cyan-500/15 border-cyan-400/50 text-white shadow-sm ring-1 ring-cyan-400/30'
                            : 'bg-white/[0.03] border-white/10 text-neutral-400 hover:text-white hover:bg-white/[0.06]'
                        }`}
                      >
                        <div className="flex items-center gap-1.5">
                          <span className="text-xs">{p.icon}</span>
                          <span className="text-[11px] font-bold text-white">{p.label}</span>
                        </div>
                        <span className="text-[9px] text-neutral-400 mt-0.5">{p.desc}</span>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Checklist of Unlocked Capabilities (8 Core Feature Sets) */}
              <div className="space-y-1.5 font-sans text-xs max-h-56 overflow-y-auto pr-1">
                <div className="p-2 rounded-xl bg-white/[0.02] border border-white/10 flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Users className="w-3.5 h-3.5 text-cyan-400 shrink-0" />
                    <span className="text-neutral-200 font-medium text-[11px]">Diplomatic Chambers &amp; UNSC Matrix</span>
                  </div>
                  <span className="text-[9px] font-bold text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded-full border border-emerald-500/20">
                    {step >= 1 ? 'ALLOCATED: GERMANY' : 'SYNCING...'}
                  </span>
                </div>

                <div className="p-2 rounded-xl bg-white/[0.02] border border-white/10 flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Feather className="w-3.5 h-3.5 text-purple-400 shrink-0" />
                    <span className="text-neutral-200 font-medium text-[11px]">ZEN.PULSE: Blogs, Poetry &amp; Multi-Sources</span>
                  </div>
                  <span className="text-[9px] font-bold text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded-full border border-emerald-500/20">
                    {step >= 2 ? 'CREATIVE SUITE ACTIVE' : 'VERIFYING...'}
                  </span>
                </div>

                <div className="p-2 rounded-xl bg-white/[0.02] border border-white/10 flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Table className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                    <span className="text-neutral-200 font-medium text-[11px]">ZEN.EVENTS: Google Sheets 2-Way Sync</span>
                  </div>
                  <span className="text-[9px] font-bold text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded-full border border-emerald-500/20">
                    {step >= 3 ? 'SHEETS WORKBOOK SYNCED' : 'CONNECTING...'}
                  </span>
                </div>

                <div className="p-2 rounded-xl bg-white/[0.02] border border-white/10 flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <BookOpen className="w-3.5 h-3.5 text-amber-400 shrink-0" />
                    <span className="text-neutral-200 font-medium text-[11px]">Diplomatic Model UN CV &amp; Dual PDF</span>
                  </div>
                  <span className="text-[9px] font-bold text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded-full border border-emerald-500/20">
                    {step >= 4 ? 'DUAL TEMPLATES READY' : 'RENDERING...'}
                  </span>
                </div>

                <div className="p-2 rounded-xl bg-white/[0.02] border border-white/10 flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Newspaper className="w-3.5 h-3.5 text-rose-400 shrink-0" />
                    <span className="text-neutral-200 font-medium text-[11px]">ZEN.PRESS Newsroom: Multi-Citation Wire</span>
                  </div>
                  <span className="text-[9px] font-bold text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded-full border border-emerald-500/20">
                    {step >= 5 ? 'PRESS WIRE UNLOCKED' : 'AUTHORIZING...'}
                  </span>
                </div>

                <div className="p-2 rounded-xl bg-white/[0.02] border border-white/10 flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Award className="w-3.5 h-3.5 text-cyan-400 shrink-0" />
                    <span className="text-neutral-200 font-medium text-[11px]">ZEN.PASSPORT: Level 2 Student Verification</span>
                  </div>
                  <span className="text-[9px] font-bold text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded-full border border-emerald-500/20">
                    {step >= 6 ? 'VERIFIED PASSPORT' : 'PROVISIONING...'}
                  </span>
                </div>

                <div className="p-2 rounded-xl bg-white/[0.02] border border-white/10 flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <FileText className="w-3.5 h-3.5 text-indigo-400 shrink-0" />
                    <span className="text-neutral-200 font-medium text-[11px]">ZEN.DOCS: Sovereign Rich Document Editor</span>
                  </div>
                  <span className="text-[9px] font-bold text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded-full border border-emerald-500/20">
                    {step >= 7 ? 'DOCUMENT STUDIO ACTIVE' : 'INITIALIZING...'}
                  </span>
                </div>

                <div className="p-2 rounded-xl bg-white/[0.02] border border-white/10 flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Globe className="w-3.5 h-3.5 text-teal-400 shrink-0" />
                    <span className="text-neutral-200 font-medium text-[11px]">ZEN.SOLUTIONS: Policy Solvers &amp; Whitepapers</span>
                  </div>
                  <span className="text-[9px] font-bold text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded-full border border-emerald-500/20">
                    {step >= 8 ? 'POLICY ENGINE GRANTED' : 'ACTIVATING...'}
                  </span>
                </div>
              </div>

              {/* Interactive Direct Feature Shortcuts (8 Launchpad Cards) */}
              <div className="space-y-2 pt-2 border-t border-white/10">
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-mono uppercase tracking-wider text-neutral-400 block">
                    Quick Feature Launchpad:
                  </span>
                  <span className="text-[10px] text-cyan-300 font-mono">
                    1-Click Navigation
                  </span>
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                  <Link
                    href="/pulse"
                    onClick={() => setIsPaused(true)}
                    className="p-2.5 rounded-xl bg-white/[0.03] hover:bg-white/[0.08] border border-white/10 text-left transition group"
                  >
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold text-white group-hover:text-cyan-300">ZEN.PULSE</span>
                      <ExternalLink className="w-3 h-3 text-neutral-500 group-hover:text-cyan-400" />
                    </div>
                    <span className="text-[9px] text-neutral-400 block mt-0.5">Blogs, Poetry, Sources</span>
                  </Link>

                  <Link
                    href="/cv"
                    onClick={() => setIsPaused(true)}
                    className="p-2.5 rounded-xl bg-white/[0.03] hover:bg-white/[0.08] border border-white/10 text-left transition group"
                  >
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold text-white group-hover:text-purple-300">Model UN CV</span>
                      <ExternalLink className="w-3 h-3 text-neutral-500 group-hover:text-purple-400" />
                    </div>
                    <span className="text-[9px] text-neutral-400 block mt-0.5">Dual PDF Templates</span>
                  </Link>

                  <Link
                    href="/events"
                    onClick={() => setIsPaused(true)}
                    className="p-2.5 rounded-xl bg-white/[0.03] hover:bg-white/[0.08] border border-white/10 text-left transition group"
                  >
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold text-white group-hover:text-emerald-300">ZEN.EVENTS</span>
                      <ExternalLink className="w-3 h-3 text-neutral-500 group-hover:text-emerald-400" />
                    </div>
                    <span className="text-[9px] text-neutral-400 block mt-0.5">Sheets 2-Way Sync</span>
                  </Link>

                  <Link
                    href="/press"
                    onClick={() => setIsPaused(true)}
                    className="p-2.5 rounded-xl bg-white/[0.03] hover:bg-white/[0.08] border border-white/10 text-left transition group"
                  >
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold text-white group-hover:text-rose-300">ZEN.PRESS</span>
                      <ExternalLink className="w-3 h-3 text-neutral-500 group-hover:text-rose-400" />
                    </div>
                    <span className="text-[9px] text-neutral-400 block mt-0.5">Multi-Citation Wire</span>
                  </Link>

                  <Link
                    href="/mun"
                    onClick={() => setIsPaused(true)}
                    className="p-2.5 rounded-xl bg-white/[0.03] hover:bg-white/[0.08] border border-white/10 text-left transition group"
                  >
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold text-white group-hover:text-blue-300">UN Matrix</span>
                      <ExternalLink className="w-3 h-3 text-neutral-500 group-hover:text-blue-400" />
                    </div>
                    <span className="text-[9px] text-neutral-400 block mt-0.5">Chambers &amp; Germany</span>
                  </Link>

                  <Link
                    href="/passport"
                    onClick={() => setIsPaused(true)}
                    className="p-2.5 rounded-xl bg-white/[0.03] hover:bg-white/[0.08] border border-white/10 text-left transition group"
                  >
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold text-white group-hover:text-amber-300">ZEN.PASSPORT</span>
                      <ExternalLink className="w-3 h-3 text-neutral-500 group-hover:text-amber-400" />
                    </div>
                    <span className="text-[9px] text-neutral-400 block mt-0.5">Level 2 Student ID</span>
                  </Link>

                  <Link
                    href="/docs"
                    onClick={() => setIsPaused(true)}
                    className="p-2.5 rounded-xl bg-white/[0.03] hover:bg-white/[0.08] border border-white/10 text-left transition group"
                  >
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold text-white group-hover:text-indigo-300">ZEN.DOCS</span>
                      <ExternalLink className="w-3 h-3 text-neutral-500 group-hover:text-indigo-400" />
                    </div>
                    <span className="text-[9px] text-neutral-400 block mt-0.5">Sovereign Editor</span>
                  </Link>

                  <Link
                    href="/solutions"
                    onClick={() => setIsPaused(true)}
                    className="p-2.5 rounded-xl bg-white/[0.03] hover:bg-white/[0.08] border border-white/10 text-left transition group"
                  >
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold text-white group-hover:text-teal-300">SOLUTIONS</span>
                      <ExternalLink className="w-3 h-3 text-neutral-500 group-hover:text-teal-400" />
                    </div>
                    <span className="text-[9px] text-neutral-400 block mt-0.5">Policy Whitepapers</span>
                  </Link>
                </div>
              </div>

              {/* Action Trigger Buttons */}
              <div className="pt-2 flex flex-col sm:flex-row gap-2">
                <button
                  type="button"
                  onClick={() => {
                    window.location.href = targetRedirect;
                  }}
                  className="flex-1 py-3 rounded-2xl bg-white hover:bg-neutral-100 text-black font-sans font-bold text-xs uppercase tracking-wider transition-all flex items-center justify-center gap-2 cursor-pointer shadow-lg shadow-white/15 active:scale-95"
                >
                  {ready ? (
                    <>
                      <span>Enter Platform ({targetRedirect})</span>
                      <ArrowRight className="w-4 h-4 text-black" />
                    </>
                  ) : (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin text-black" />
                      <span>Unlocking Sovereign Clearance...</span>
                    </>
                  )}
                </button>

                {!isPaused ? (
                  <button
                    type="button"
                    onClick={() => setIsPaused(true)}
                    className="px-4 py-3 rounded-2xl bg-white/[0.06] hover:bg-white/10 text-neutral-300 hover:text-white border border-white/15 font-sans font-bold text-xs uppercase tracking-wider transition cursor-pointer"
                  >
                    Stay on Launchpad
                  </button>
                ) : (
                  <button
                    type="button"
                    onClick={() => setIsPaused(false)}
                    className="px-4 py-3 rounded-2xl bg-cyan-500/15 hover:bg-cyan-500/25 text-cyan-300 border border-cyan-500/30 font-sans font-bold text-xs uppercase tracking-wider transition cursor-pointer"
                  >
                    Resume Launch
                  </button>
                )}
              </div>

              {/* Official Closing Date Notice & Manual Credentials Info Box */}
              <div className="p-3 rounded-2xl bg-amber-500/10 border border-amber-500/25 flex items-start gap-2.5 text-xs text-amber-200">
                <Clock className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
                <div className="text-[11px] leading-relaxed">
                  <p className="font-bold text-amber-300">Official Lifecycle: Closes 19th November 2026</p>
                  <p className="text-neutral-300 mt-0.5">
                    Credentials: <strong className="text-white font-mono">test</strong> / <strong className="text-white font-mono">test1234</strong>. All records are active in browser sandbox.
                  </p>
                </div>
              </div>
            </>
          )}
        </motion.div>
      </main>

      {/* Footer */}
      <footer className="w-full max-w-xl text-center z-10 py-2">
        <p className="text-xs font-sans text-neutral-500">
          ZENVITRA Quality Assurance Enclave &bull; Encrypted Session Layer
        </p>
      </footer>
    </div>
  );
}

export default function TestPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-[#030407] text-white flex items-center justify-center font-sans text-xs text-neutral-400">
        <Loader2 className="w-5 h-5 animate-spin text-cyan-400" />
      </div>
    }>
      <TestPilotEnclaveContent />
    </Suspense>
  );
}
