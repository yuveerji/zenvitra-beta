'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { 
  Sparkles, 
  ArrowRight, 
  CheckCircle2, 
  AlertCircle, 
  Loader2, 
  ShieldCheck, 
  Users, 
  ArrowLeft,
  Scale
} from 'lucide-react';
import { sheetSync } from '@/lib/googleSheets';

export default function StatusRegisterPage() {
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    phoneNumber: '',
    roleInterest: 'Student Delegate / Youth Leader',
    organization: '',
  });

  const [isLoading, setIsLoading] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const validateEmail = (val: string) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(val.trim());

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.fullName || !formData.email) return;

    if (!validateEmail(formData.email)) {
      setErrorMessage('Please enter a valid email address.');
      return;
    }

    setIsLoading(true);
    setErrorMessage(null);

    try {
      // 1. Dispatch to Google Sheets under 'Register Data Core'
      await sheetSync.register({
        userId: `pre_${Date.now().toString(36)}`,
        fullName: formData.fullName.trim(),
        email: formData.email.trim().toLowerCase(),
        roleDesignation: formData.roleInterest,
        accessLevel: 'Pre-Registered Delegate',
        authProvider: 'DIRECT_ENROLL',
        accountStatus: 'PENDING_VERIFICATION',
      });

      // Save email for instant status check
      if (typeof window !== 'undefined') {
        localStorage.setItem('zenvitra_applicant_email', formData.email.trim().toLowerCase());
      }

      setIsSuccess(true);
    } catch (err: any) {
      setErrorMessage('Failed to submit pre-registration. Please try again.');
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
              LAUNCH DAY WHITELIST
            </div>
          </div>
        </Link>

        <div className="flex items-center gap-3">
          <Link
            href="/statussignin"
            className="flex items-center gap-2 px-4 py-2 rounded-full bg-white/[0.05] hover:bg-white/[0.1] border border-white/10 text-xs font-mono text-neutral-300 transition"
          >
            <span>Sign In</span>
            <ArrowRight className="w-3.5 h-3.5 text-neutral-400" />
          </Link>
        </div>
      </header>

      {/* Main Content */}
      <main className="relative z-10 max-w-md mx-auto w-full px-6 py-12 flex-1 flex flex-col items-center justify-center">
        <div className="w-full rounded-[2.5rem] bg-[#07090e] border border-white/15 p-8 sm:p-10 space-y-7 shadow-[0_30px_90px_rgba(0,0,0,0.95)]">
          {isSuccess ? (
            <div className="text-center space-y-5 animate-in fade-in">
              <div className="w-16 h-16 rounded-2xl bg-emerald-400/10 border border-emerald-400/30 flex items-center justify-center mx-auto text-emerald-400 shadow-[0_0_30px_rgba(52,211,153,0.2)]">
                <CheckCircle2 className="w-8 h-8" />
              </div>

              <div className="space-y-2">
                <h2 
                  className="text-2xl font-bold text-white tracking-tight"
                  style={{ fontFamily: 'Clash Display, sans-serif' }}
                >
                  Whitelist Position Secured
                </h2>
                <p className="text-xs text-neutral-400 leading-relaxed max-w-xs mx-auto">
                  Your registration has been logged into the Sovereign Registry. You will receive priority clearance when the platform opens on September 18 at 5:00 PM IST.
                </p>
              </div>

              <div className="p-4 rounded-xl bg-black/60 border border-white/5 font-mono text-xs text-neutral-400 space-y-1 text-left">
                <div className="flex justify-between">
                  <span className="text-neutral-500">REGISTERED EMAIL:</span>
                  <span className="text-white">{formData.email}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-neutral-500">ROLE TIER:</span>
                  <span className="text-amber-300">{formData.roleInterest}</span>
                </div>
              </div>

              <div className="space-y-2 pt-2">
                <Link
                  href="/countdown"
                  className="w-full inline-flex items-center justify-center py-3.5 rounded-2xl bg-white text-black font-mono text-xs font-bold hover:bg-neutral-200 transition shadow-[0_0_20px_rgba(255,255,255,0.2)]"
                >
                  Return to Countdown
                </Link>

                <Link
                  href="/join-core-team"
                  className="w-full inline-flex items-center justify-center py-3 rounded-2xl border border-white/10 text-neutral-400 hover:text-white font-mono text-xs transition"
                >
                  Apply for Core Team Leadership →
                </Link>
              </div>
            </div>
          ) : (
            <>
              {/* Badge */}
              <div className="space-y-2 text-center">
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-400/[0.08] border border-amber-400/30 text-[10px] font-mono tracking-widest text-amber-300 uppercase">
                  <Users className="w-3 h-3 text-amber-400" />
                  <span>EARLY ACCESS INGESTION</span>
                </div>
                <h1 
                  className="text-2xl sm:text-3xl text-white font-bold tracking-tight"
                  style={{ fontFamily: 'Clash Display, sans-serif' }}
                >
                  Pre-Register for Launch
                </h1>
                <p className="text-xs text-neutral-400 leading-relaxed max-w-xs mx-auto">
                  Reserve your sovereign handle and receive early platform access credentials.
                </p>
              </div>

              {/* Error Box */}
              {errorMessage && (
                <div className="p-4 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-300 text-xs font-mono flex items-center gap-2 animate-in fade-in">
                  <AlertCircle className="w-4 h-4 shrink-0 text-rose-400" />
                  <span>{errorMessage}</span>
                </div>
              )}

              {/* Form */}
              <form onSubmit={handleRegister} className="space-y-4">
                <div className="space-y-1.5">
                  <label className="font-mono text-[11px] tracking-wider text-neutral-300 uppercase block font-medium">
                    Full Legal Name <span className="text-amber-400">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="Your Full Name"
                    value={formData.fullName}
                    onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                    className="w-full px-5 py-3.5 rounded-2xl bg-black/80 border border-white/10 text-white placeholder-neutral-600 text-sm font-mono focus:outline-none focus:border-amber-400/50 transition shadow-inner"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="font-mono text-[11px] tracking-wider text-neutral-300 uppercase block font-medium">
                    Primary Email <span className="text-amber-400">*</span>
                  </label>
                  <input
                    type="email"
                    required
                    placeholder="your.email@domain.com"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    className="w-full px-5 py-3.5 rounded-2xl bg-black/80 border border-white/10 text-white placeholder-neutral-600 text-sm font-mono focus:outline-none focus:border-amber-400/50 transition shadow-inner"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="font-mono text-[11px] tracking-wider text-neutral-300 uppercase block font-medium">
                    Phone Number <span className="text-neutral-500">(Optional)</span>
                  </label>
                  <input
                    type="tel"
                    placeholder="+91 98765 43210"
                    value={formData.phoneNumber}
                    onChange={(e) => setFormData({ ...formData, phoneNumber: e.target.value })}
                    className="w-full px-5 py-3.5 rounded-2xl bg-black/80 border border-white/10 text-white placeholder-neutral-600 text-sm font-mono focus:outline-none focus:border-amber-400/50 transition shadow-inner"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="font-mono text-[11px] tracking-wider text-neutral-300 uppercase block font-medium">
                    Role Interest <span className="text-amber-400">*</span>
                  </label>
                  <select
                    value={formData.roleInterest}
                    onChange={(e) => setFormData({ ...formData, roleInterest: e.target.value })}
                    className="w-full px-5 py-3.5 rounded-2xl bg-black/80 border border-white/10 text-white text-sm font-mono focus:outline-none focus:border-amber-400/50 transition shadow-inner"
                  >
                    <option value="Student Delegate / Youth Leader">Student Delegate / Youth Leader</option>
                    <option value="MUN Secretariat / Dais Member">MUN Secretariat / Dais Member</option>
                    <option value="Press Corps / Journalist">Press Corps / Journalist</option>
                    <option value="Campus Ambassador Candidate">Campus Ambassador Candidate</option>
                    <option value="Software Engineer / Contributor">Software Engineer / Contributor</option>
                  </select>
                </div>

                <button
                  type="submit"
                  disabled={isLoading || !formData.fullName || !formData.email}
                  className="w-full py-4 rounded-2xl bg-white text-black font-mono text-xs font-bold hover:bg-neutral-200 transition disabled:opacity-30 disabled:cursor-not-allowed flex items-center justify-center gap-2 shadow-[0_0_25px_rgba(255,255,255,0.2)] cursor-pointer"
                >
                  {isLoading ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin text-black" />
                      <span>Logging to Sovereign Registry...</span>
                    </>
                  ) : (
                    <>
                      <span>Secure Launch Whitelist</span>
                      <ArrowRight className="w-4 h-4 text-black" />
                    </>
                  )}
                </button>
              </form>

              {/* Sub Navigation */}
              <div className="pt-2 border-t border-white/[0.08] flex flex-col items-center gap-2 text-center text-xs font-mono text-neutral-400">
                <div>
                  Already have clearance?{' '}
                  <Link href="/statussignin" className="text-amber-400 hover:underline">
                    Sign In Here
                  </Link>
                </div>
                <div>
                  Looking for leadership roles?{' '}
                  <Link href="/join-core-team" className="text-white hover:underline">
                    Join Core Team
                  </Link>
                </div>
              </div>
            </>
          )}
        </div>
      </main>

      {/* Footer */}
      <footer className="relative z-10 w-full max-w-6xl mx-auto px-6 py-6 border-t border-white/[0.06] flex flex-col sm:flex-row items-center justify-between gap-4 text-[11px] font-mono text-neutral-500">
        <span>ZENVITRA PRE-LAUNCH WHITELIST &copy; 2026</span>
        <Link href="/countdown" className="hover:text-white transition flex items-center gap-1">
          <ArrowLeft className="w-3 h-3" /> Back to Launch Countdown
        </Link>
      </footer>
    </div>
  );
}
