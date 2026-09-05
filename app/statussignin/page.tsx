'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { 
  KeyRound, 
  ArrowRight, 
  CheckCircle2, 
  AlertCircle, 
  Loader2, 
  ShieldCheck, 
  Lock, 
  Sparkles, 
  ArrowLeft, 
  Eye, 
  EyeOff 
} from 'lucide-react';
import { StatusNotificationModal } from '@/components/navigation/StatusNotificationModal';
import { sheetSync } from '@/lib/googleSheets';
import { recordSavedSession } from '@/context/AuthContext';
import { signIn as nextAuthSignIn } from 'next-auth/react';

export default function StatusSignInPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [isSuccess, setIsSuccess] = useState(false);
  const [grantedRole, setGrantedRole] = useState<string>('');
  const [isNotificationModalOpen, setIsNotificationModalOpen] = useState(false);

  // Auto-populate email from URL parameter or localStorage on mount
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const urlParams = new URLSearchParams(window.location.search);
      const emailParam = urlParams.get('email');
      if (emailParam) {
        setEmail(emailParam);
      } else {
        const savedEmail = localStorage.getItem('zenvitra_applicant_email');
        if (savedEmail) setEmail(savedEmail);
      }
    }
  }, []);

  const handleSignIn = async (e: React.FormEvent) => {
    e.preventDefault();
    const cleanEmail = email.trim().toLowerCase();
    const cleanPassword = password.trim();

    if (!cleanEmail) {
      setErrorMessage('Please provide your registered email address.');
      return;
    }
    if (!cleanPassword) {
      setErrorMessage('Security Passphrase / Master PIN is required.');
      return;
    }

    setIsLoading(true);
    setErrorMessage(null);

    try {
      // 1. Check live clearance & approval in Google Sheets and Database with credentials
      const verifyRes = await fetch('/api/access/verify', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: cleanEmail, password: cleanPassword }),
      });

      const verifyData = await verifyRes.json();

      if (verifyRes.status === 401 || verifyData.status === 'INVALID_CREDENTIALS') {
        setErrorMessage(verifyData.message || 'Invalid Access Key or Master PIN. Please verify your credentials.');
        sheetSync.login({
          userId: `fail_${Date.now().toString(36)}`,
          fullName: cleanEmail.split('@')[0],
          email: cleanEmail,
          authProvider: 'STATUS_CLEARANCE_PASSWORD_FAILED',
          loginStatus: 'FAILED',
        }).catch(() => {});
        return;
      }

      if (verifyData.unlocked || verifyData.isApproved || verifyData.status === 'APPROVED') {
        setIsSuccess(true);
        const approvedRole = verifyData.clearanceRole || verifyData.role || 'Executive Member';
        setGrantedRole(approvedRole);

        // Telemetry: Log successful pre-login clearance to Google Sheets 'Login Data Core'
        sheetSync.login({
          userId: verifyData.user?.id || `usr_${Date.now().toString(36)}`,
          fullName: verifyData.user?.name || verifyData.fullName || cleanEmail.split('@')[0],
          email: cleanEmail,
          authProvider: 'PRE_LAUNCH_CLEARANCE',
          loginStatus: 'SUCCESS',
        }).catch(() => {});

        // 2. Establish genuine sovereign session across the entire app
        if (typeof window !== 'undefined') {
          const userSession = {
            id: verifyData.user?.id || `zen_user_${cleanEmail.split('@')[0].replace(/[^a-z0-9_]/g, '')}`,
            username: verifyData.user?.username || cleanEmail.split('@')[0].replace(/[^a-z0-9_]/g, ''),
            display_name: verifyData.user?.name || verifyData.fullName || cleanEmail.split('@')[0],
            name: verifyData.user?.name || verifyData.fullName || cleanEmail.split('@')[0],
            email: cleanEmail,
            role: (verifyData.role || 'delegate').toLowerCase(),
            roleBadge: verifyData.roleBadge || 'DELEGATE',
            impact_score: 500,
            followers_count: 0,
            following_count: 0,
            is_verified: true,
            is_onboarded: true,
            created_at: new Date().toISOString(),
          };

          localStorage.setItem('zenvitra_session_user', JSON.stringify(userSession));
          localStorage.setItem('zenvitra_applicant_email', cleanEmail);
          recordSavedSession(userSession);
          window.dispatchEvent(new CustomEvent('zenvitra_auth_change'));
        }

        // 3. Establish NextAuth session simultaneously so server components & middleware recognize login
        try {
          await nextAuthSignIn('credentials', {
            redirect: false,
            identifier: cleanEmail,
            password: cleanPassword,
          });
        } catch (nextAuthErr) {
          console.warn('[NEXTAUTH-SIGNIN-FALLBACK]', nextAuthErr);
        }

        setTimeout(() => {
          window.location.href = '/';
        }, 1600);
      } else if (verifyData.status === 'PENDING' || verifyData.status === 'QUEUED' || verifyData.status === 'PENDING_REVIEW') {
        // Telemetry: Log challenged attempt to 'Login Data Core'
        sheetSync.login({
          userId: `att_${Date.now().toString(36)}`,
          fullName: cleanEmail.split('@')[0],
          email: cleanEmail,
          authProvider: 'PRE_LAUNCH_CHALLENGE',
          loginStatus: '2FA_CHALLENGE',
        }).catch(() => {});

        setErrorMessage(
          'Your application is still PENDING review in the Sovereign Ledger. An administrator must set your status to CONFIRM before clearance unlocks.'
        );
      } else if (verifyData.status === 'DENIED') {
        // Telemetry: Log failed attempt to 'Login Data Core'
        sheetSync.login({
          userId: `fail_${Date.now().toString(36)}`,
          fullName: cleanEmail.split('@')[0],
          email: cleanEmail,
          authProvider: 'PRE_LAUNCH_DENIED',
          loginStatus: 'FAILED',
        }).catch(() => {});

        setErrorMessage('Security clearance was not approved for this dossier.');
      } else {
        // Telemetry: Log unknown attempt
        sheetSync.login({
          userId: `unrec_${Date.now().toString(36)}`,
          fullName: cleanEmail.split('@')[0],
          email: cleanEmail,
          authProvider: 'PRE_LAUNCH_UNREGISTERED',
          loginStatus: 'FAILED',
        }).catch(() => {});

        setErrorMessage(verifyData.message || 'No approved application or clearance credentials found for this email address.');
      }
    } catch (err: any) {
      setErrorMessage('Ledger connectivity error. Please check your network and try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#020305] text-white flex flex-col justify-between selection:bg-amber-400 selection:text-black font-sans relative overflow-x-hidden">
      {/* Background Radiance & Grid */}
      <div className="fixed inset-0 pointer-events-none bg-[radial-gradient(#ffffff0a_1px,transparent_1px)] [background-size:28px_28px] opacity-60 z-0" />
      <div className="fixed top-0 left-1/2 -translate-x-1/2 w-[900px] h-[400px] bg-gradient-to-b from-amber-500/[0.08] via-rose-500/[0.03] to-transparent blur-[140px] pointer-events-none z-0" />

      {/* Header */}
      <header className="relative z-10 w-full max-w-6xl mx-auto px-6 py-6 flex items-center justify-between border-b border-white/[0.07]">
        <Link href="/countdown" className="flex items-center gap-3 group">
          <div className="relative h-8 w-8 sm:h-9 sm:w-9 flex items-center justify-center shrink-0 transition-transform duration-300 group-hover:scale-105">
            <img
              src="/assets/logo.png"
              alt="Zenvitra Logo"
              className="h-full w-full object-contain filter drop-shadow-[0_0_10px_rgba(255,255,255,0.3)]"
            />
          </div>
          <div>
            <div 
              className="tracking-[0.14em] text-sm sm:text-base font-bold text-[#f5f1ea] uppercase leading-none"
              style={{ fontFamily: 'Clash Display, var(--font-space), sans-serif' }}
            >
              ZENVITRA
            </div>
            <div className="font-mono text-[9px] tracking-widest text-amber-400/90 uppercase mt-1">
              STATUS ACCESS GATEWAY
            </div>
          </div>
        </Link>

        <div className="flex items-center gap-3">
          <Link
            href="/statusregister"
            className="flex items-center gap-2 px-4 py-2 rounded-full bg-white/[0.05] hover:bg-white/[0.1] border border-white/10 text-xs font-mono text-neutral-300 transition"
          >
            <span>Pre-Register</span>
            <ArrowRight className="w-3.5 h-3.5 text-neutral-400" />
          </Link>
        </div>
      </header>

      {/* Main Form Container */}
      <main className="relative z-10 max-w-md mx-auto w-full px-6 py-12 flex-1 flex flex-col items-center justify-center">
        <div className="w-full rounded-[2.5rem] bg-[#07090e] border border-white/15 p-8 sm:p-10 space-y-7 shadow-[0_30px_90px_rgba(0,0,0,0.95)]">
          {/* Badge */}
          <div className="space-y-2 text-center">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-400/[0.08] border border-amber-400/30 text-[10px] font-mono tracking-widest text-amber-300 uppercase">
              <KeyRound className="w-3 h-3 text-amber-400" />
              <span>SOVEREIGN CLEARANCE LOGIN</span>
            </div>
            <h1 
              className="text-2xl sm:text-3xl text-white font-bold tracking-tight"
              style={{ fontFamily: 'Clash Display, sans-serif' }}
            >
              Claim Your Clearance
            </h1>
            <p className="text-xs text-neutral-400 leading-relaxed max-w-xs mx-auto">
              Sign in with your approved credentials to unlock early sovereign platform access.
            </p>
          </div>

          {/* Success Box */}
          {isSuccess && (
            <div className="p-5 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-300 space-y-2 font-mono text-xs text-center animate-in fade-in">
              <div className="w-10 h-10 rounded-xl bg-emerald-400/20 border border-emerald-400/40 flex items-center justify-center mx-auto text-emerald-400">
                <CheckCircle2 className="w-5 h-5" />
              </div>
              <p className="font-bold text-white text-sm">Clearance Granted!</p>
              <p className="text-neutral-300 text-[11px]">Role: <span className="text-emerald-300">{grantedRole}</span></p>
              <p className="text-emerald-400 font-bold animate-pulse text-[11px]">Redirecting to Ecosystem...</p>
            </div>
          )}

          {/* Error Box */}
          {errorMessage && (
            <div className="p-4 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-300 space-y-2 text-xs font-mono animate-in fade-in">
              <div className="flex items-center gap-2 font-bold uppercase text-rose-400">
                <AlertCircle className="w-4 h-4 shrink-0" />
                <span>Clearance Alert</span>
              </div>
              <p className="text-[11px] leading-relaxed text-neutral-300">{errorMessage}</p>
              <button
                type="button"
                onClick={() => setIsNotificationModalOpen(true)}
                className="text-[11px] text-amber-300 hover:text-amber-200 underline pt-1 block"
              >
                Check live status in Sovereign Ledger →
              </button>
            </div>
          )}

          {/* Form */}
          <form onSubmit={handleSignIn} className="space-y-4">
            <div className="space-y-1.5">
              <label className="font-mono text-[11px] tracking-wider text-neutral-300 uppercase block font-medium">
                Registered Email Address <span className="text-amber-400">*</span>
              </label>
              <input
                type="email"
                required
                placeholder="delegate@domain.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-5 py-4 rounded-2xl bg-black/80 border border-white/10 text-white placeholder-neutral-600 text-sm font-mono focus:outline-none focus:border-amber-400/50 transition shadow-inner"
              />
            </div>

            <div className="space-y-1.5">
              <div className="flex items-center justify-between">
                <label className="font-mono text-[11px] tracking-wider text-neutral-300 uppercase block font-medium">
                  Access Key / Master PIN <span className="text-amber-400">*</span>
                </label>
              </div>
              <div className="relative">
                <input
                  type={showPassword ? 'text' : 'password'}
                  required
                  minLength={4}
                  placeholder="Master PIN or Password (Required)"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full px-5 py-4 rounded-2xl bg-black/80 border border-white/10 text-white placeholder-neutral-600 text-sm font-mono focus:outline-none focus:border-amber-400/50 transition shadow-inner pr-12"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 top-4 text-neutral-500 hover:text-white transition"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
              <span className="text-[10px] font-mono text-neutral-500">Security PIN created during pre-registration or Founder PIN.</span>
            </div>

            <button
              type="submit"
              disabled={isLoading || !email || !password}
              className="w-full py-4 rounded-2xl bg-white text-black font-mono text-xs font-bold hover:bg-neutral-200 transition disabled:opacity-30 disabled:cursor-not-allowed flex items-center justify-center gap-2 shadow-[0_0_25px_rgba(255,255,255,0.2)] cursor-pointer"
            >
              {isLoading ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin text-black" />
                  <span>Verifying Clearance Ledger...</span>
                </>
              ) : (
                <>
                  <span>Authenticate &amp; Enter</span>
                  <ArrowRight className="w-4 h-4 text-black" />
                </>
              )}
            </button>
          </form>

          {/* Sub Navigation */}
          <div className="pt-2 border-t border-white/[0.08] flex flex-col items-center gap-2 text-center text-xs font-mono text-neutral-400">
            <div>
              Don't have clearance yet?{' '}
              <Link href="/join-core-team" className="text-amber-400 hover:underline">
                Apply for Core Team
              </Link>
            </div>
            <div>
              Want launch updates?{' '}
              <Link href="/statusregister" className="text-white hover:underline">
                Pre-Register Here
              </Link>
            </div>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="relative z-10 w-full max-w-6xl mx-auto px-6 py-6 border-t border-white/[0.06] flex flex-col sm:flex-row items-center justify-between gap-4 text-[11px] font-mono text-neutral-500">
        <span>ZENVITRA SOVEREIGN GATEWAY &copy; 2026</span>
        <Link href="/countdown" className="hover:text-white transition flex items-center gap-1">
          <ArrowLeft className="w-3 h-3" /> Back to Launch Countdown
        </Link>
      </footer>

      {/* Status Modal */}
      <StatusNotificationModal
        isOpen={isNotificationModalOpen}
        onClose={() => setIsNotificationModalOpen(false)}
        initialEmail={email}
      />
    </div>
  );
}
