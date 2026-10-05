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
  Lock
} from 'lucide-react';
import { useAuth } from '@/context/AuthContext';

const TEST_NODE_EXPIRY_DATE = new Date('2026-11-19T23:59:59+05:30');

function TestPilotEnclaveContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { continueAsTestUser } = useAuth();
  const [step, setStep] = useState(0);
  const [ready, setReady] = useState(false);

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
          document.cookie = 'zenvitra_session=active; path=/; max-age=2592000; SameSite=Lax';
          document.cookie = 'zenvitra_clearance=SOVEREIGN_GRANTED; path=/; max-age=2592000; SameSite=Lax';
        }

        if (isCancelled) return;
        setStep(1);

        setTimeout(() => {
          if (isCancelled) return;
          setStep(2);
        }, 200);

        setTimeout(() => {
          if (isCancelled) return;
          setStep(3);
          setReady(true);
        }, 450);

        setTimeout(() => {
          if (isCancelled) return;
          // Guaranteed hard browser redirect ensuring cookies are received by server & middleware
          window.location.href = targetRedirect;
        }, 950);

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

  return (
    <div className="min-h-screen bg-[#030407] text-white flex flex-col justify-between items-center p-6 relative overflow-hidden font-sans selection:bg-cyan-500/30">
      {/* Background ambient lighting glow */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[550px] h-[550px] bg-gradient-to-tr from-cyan-500/20 via-emerald-500/15 to-purple-500/20 blur-[130px] rounded-full pointer-events-none" />

      {/* Top Header */}
      <header className="w-full max-w-xl flex items-center justify-between z-10 pt-4">
        <Link href="/" className="flex items-center gap-2.5">
          <img src="/assets/logo.png" alt="ZENVITRA Logo" className="w-7 h-7 object-contain drop-shadow-[0_0_10px_rgba(255,255,255,0.4)]" />
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
      <main className="w-full max-w-xl my-auto z-10">
        <motion.div 
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.35 }}
          className="rounded-3xl bg-[#07080b]/90 border border-white/10 p-6 sm:p-8 shadow-[0_25px_80px_rgba(0,0,0,0.8)] backdrop-blur-2xl space-y-6 text-left"
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
              <div className="space-y-2 border-b border-white/10 pb-5">
                <div className="flex items-center gap-2">
                  <span className="p-2 rounded-xl bg-cyan-500/15 text-cyan-300 border border-cyan-500/30">
                    <Terminal className="w-4 h-4 text-cyan-400" />
                  </span>
                  <div>
                    <p className="text-[10px] font-sans text-cyan-300 uppercase tracking-widest font-bold">SOVEREIGN TEST LINK ACTIVE</p>
                    <h1 className="text-xl sm:text-2xl font-black font-display text-white tracking-tight">
                      Test Node Initializing
                    </h1>
                  </div>
                </div>
                <p className="text-xs text-neutral-400 leading-relaxed font-sans">
                  Authenticating as verified <strong className="text-white">@test</strong> with all features unlocked. Unlike a guest node, you can author resolutions, create bills on ZEN.SOLUTIONS, participate in debate voting, and inspect credentials.
                </p>
              </div>

              {/* Official Closing Date Notice */}
              <div className="p-3.5 rounded-2xl bg-amber-500/10 border border-amber-500/25 flex items-start gap-2.5 text-xs text-amber-200">
                <Clock className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
                <div>
                  <p className="font-bold text-amber-300">Official Lifecycle Notice</p>
                  <p className="text-neutral-300 mt-0.5 leading-relaxed">
                    The Test Node will officially close on <strong className="text-white">19th November 2026</strong>. Please register a permanent sovereign account to preserve your resolutions and passport records.
                  </p>
                </div>
              </div>

              {/* Checklist of Unlocked Capabilities */}
              <div className="space-y-2.5 font-sans text-xs">
                <div className="p-3 rounded-2xl bg-white/[0.02] border border-white/10 flex items-center justify-between">
                  <div className="flex items-center gap-2.5">
                    <Users className="w-4 h-4 text-cyan-400 shrink-0" />
                    <span className="text-neutral-200 font-medium">Diplomatic Chambers &amp; UNSC Matrix</span>
                  </div>
                  <span className="text-[10px] font-bold text-emerald-400 bg-emerald-500/10 px-2.5 py-0.5 rounded-full border border-emerald-500/20">
                    {step >= 1 ? 'ALLOCATED: GERMANY' : 'SYNCING...'}
                  </span>
                </div>

                <div className="p-3 rounded-2xl bg-white/[0.02] border border-white/10 flex items-center justify-between">
                  <div className="flex items-center gap-2.5">
                    <FileText className="w-4 h-4 text-purple-400 shrink-0" />
                    <span className="text-neutral-200 font-medium">ZEN.SOLUTIONS &amp; Bill Drafting Engine</span>
                  </div>
                  <span className="text-[10px] font-bold text-emerald-400 bg-emerald-500/10 px-2.5 py-0.5 rounded-full border border-emerald-500/20">
                    {step >= 2 ? 'UNLOCKED' : 'VERIFYING...'}
                  </span>
                </div>

                <div className="p-3 rounded-2xl bg-white/[0.02] border border-white/10 flex items-center justify-between">
                  <div className="flex items-center gap-2.5">
                    <Award className="w-4 h-4 text-amber-400 shrink-0" />
                    <span className="text-neutral-200 font-medium">ZEN.PASSPORT (Level 2 Verified Student)</span>
                  </div>
                  <span className="text-[10px] font-bold text-emerald-400 bg-emerald-500/10 px-2.5 py-0.5 rounded-full border border-emerald-500/20">
                    {step >= 3 ? 'VERIFIED' : 'PROVISIONING...'}
                  </span>
                </div>
              </div>

              {/* Action Trigger */}
              <div className="pt-2">
                <button
                  type="button"
                  onClick={() => {
                    window.location.href = targetRedirect;
                  }}
                  className="w-full py-3.5 rounded-2xl bg-white hover:bg-neutral-100 text-black font-sans font-bold text-xs uppercase tracking-wider transition-all flex items-center justify-center gap-2 cursor-pointer shadow-lg shadow-white/15 active:scale-95"
                >
                  {ready ? (
                    <>
                      <span>Enter Platform Now ({targetRedirect})</span>
                      <ArrowRight className="w-4 h-4 text-black" />
                    </>
                  ) : (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin text-black" />
                      <span>Unlocking Sovereign Clearance...</span>
                    </>
                  )}
                </button>
              </div>

              {/* Quick Manual Credentials Info Box */}
              <div className="p-3 rounded-xl bg-white/[0.02] border border-white/10 text-center font-sans text-xs text-neutral-400">
                <span>Manual Login credentials (active until 19th Nov): </span>
                <strong className="text-cyan-300 font-mono">test</strong> / <strong className="text-cyan-300 font-mono">test1234</strong>
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
