'use client';

import React, { useState, useEffect } from 'react';
import { 
  Bell, 
  X, 
  CheckCircle2, 
  Clock, 
  ShieldAlert, 
  Sparkles, 
  Loader2, 
  ArrowRight,
  Search
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

interface StatusNotificationModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialEmail?: string;
}

export function StatusNotificationModal({ isOpen, onClose, initialEmail = '' }: StatusNotificationModalProps) {
  const [email, setEmail] = useState(initialEmail);
  const [isChecking, setIsChecking] = useState(false);
  const [result, setResult] = useState<{
    found?: boolean;
    status?: string;
    isApproved?: boolean;
    role?: string;
    message?: string;
    email?: string;
    checkedAt?: string;
  } | null>(null);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const stored = localStorage.getItem('zenvitra_applicant_email');
      if (stored && !email) {
        setEmail(stored);
      }
    }
  }, []);

  const handleCheckStatus = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    const cleanEmail = email.trim().toLowerCase();
    if (!cleanEmail) return;

    setIsChecking(true);
    setResult(null);

    // Persist email for convenience
    if (typeof window !== 'undefined') {
      localStorage.setItem('zenvitra_applicant_email', cleanEmail);
    }

    try {
      const res = await fetch('/api/access/verify', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: cleanEmail }),
      });

      const data = await res.json();
      setResult({
        found: data.status !== 'NOT_FOUND',
        status: data.status,
        isApproved: data.unlocked || data.isApproved || data.status === 'APPROVED',
        role: data.clearanceRole || data.role || 'Core Team Candidate',
        message: data.message,
        email: cleanEmail,
        checkedAt: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      });

      if (data.unlocked || data.isApproved || data.status === 'APPROVED') {
        if (typeof window !== 'undefined') {
          localStorage.setItem('zenvitra_applicant_email', cleanEmail);
        }
        setTimeout(() => {
          window.location.href = `/statussignin?email=${encodeURIComponent(cleanEmail)}`;
        }, 1600);
      }
    } catch (err: any) {
      setResult({
        found: false,
        status: 'ERROR',
        message: 'Could not connect to the verification ledger. Please try again.',
      });
    } finally {
      setIsChecking(false);
    }
  };

  if (!isOpen) return null;

  const isApproved = result?.isApproved || result?.status === 'APPROVED';
  const isPending = result && !isApproved && result.status !== 'ERROR' && result.status !== 'DENIED' && result.status !== 'NOT_FOUND';
  const isDenied = result?.status === 'DENIED';
  const isNotFound = result?.status === 'NOT_FOUND' || (result && !result.found && result.status !== 'ERROR');

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 10 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 10 }}
          className="relative w-full max-w-md rounded-3xl bg-[#080a0f] border border-white/10 p-6 sm:p-8 space-y-6 shadow-[0_20px_70px_rgba(0,0,0,0.95)]"
        >
          {/* Header */}
          <div className="flex items-center justify-between pb-2 border-b border-white/[0.08]">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-2xl bg-amber-400/10 border border-amber-400/20 flex items-center justify-center text-amber-400 shadow-[0_0_20px_rgba(251,191,36,0.15)]">
                <Bell className="w-5 h-5 animate-pulse" />
              </div>
              <div>
                <h3 className="font-display font-medium text-lg text-white">Application Status</h3>
                <p className="font-mono text-[10px] text-neutral-400 uppercase tracking-wider">
                  Live Ledger Telemetry
                </p>
              </div>
            </div>

            <button
              onClick={onClose}
              className="p-2 rounded-xl bg-white/5 hover:bg-white/10 text-neutral-400 hover:text-white transition cursor-pointer"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          {/* Inquiry Form */}
          <form onSubmit={handleCheckStatus} className="space-y-4">
            <div className="space-y-2">
              <label className="font-mono text-[11px] text-neutral-300 uppercase tracking-wider block">
                Enter Registered Email
              </label>
              <div className="relative">
                <input
                  type="email"
                  required
                  placeholder="delegate@domain.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full pl-4 pr-10 py-3.5 rounded-2xl bg-black/90 border border-white/10 text-white placeholder-neutral-600 text-sm font-mono focus:outline-none focus:border-amber-400/50 transition shadow-inner"
                />
                <button
                  type="submit"
                  disabled={isChecking || !email}
                  className="absolute right-2.5 top-2.5 p-2 rounded-xl bg-white/10 hover:bg-white/20 text-neutral-300 hover:text-white transition disabled:opacity-40"
                  title="Search Status"
                >
                  {isChecking ? <Loader2 className="w-4 h-4 animate-spin" /> : <Search className="w-4 h-4" />}
                </button>
              </div>
            </div>

            <button
              type="submit"
              disabled={isChecking || !email}
              className="w-full py-3.5 rounded-2xl bg-gradient-to-r from-amber-400 to-amber-500 hover:from-amber-300 hover:to-amber-400 text-black font-mono text-xs font-bold transition flex items-center justify-center gap-2 shadow-[0_0_20px_rgba(251,191,36,0.2)] cursor-pointer disabled:opacity-40"
            >
              {isChecking ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin text-black" />
                  <span>Checking Google Sheets Ledger...</span>
                </>
              ) : (
                <>
                  <span>Check Live Status</span>
                  <ArrowRight className="w-4 h-4 text-black" />
                </>
              )}
            </button>
          </form>

          {/* Result Card */}
          {result && (
            <div className="animate-in fade-in slide-in-from-bottom-2 duration-300">
              {isApproved && (
                <div className="p-5 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-300 space-y-3 shadow-[0_0_30px_rgba(16,185,129,0.15)]">
                  <div className="flex items-center gap-2.5">
                    <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0" />
                    <span className="font-display font-medium text-sm text-white">
                      Clearance Granted / Approved!
                    </span>
                  </div>
                  <div className="font-mono text-xs text-neutral-300 space-y-1 bg-black/40 p-3 rounded-xl border border-emerald-500/20">
                    <div className="flex justify-between">
                      <span className="text-neutral-400">ASSIGNED ROLE:</span>
                      <span className="text-emerald-300 font-bold">{result.role}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-neutral-400">STATUS:</span>
                      <span className="text-emerald-400 font-bold uppercase">{result.status}</span>
                    </div>
                  </div>
                  <p className="text-xs text-emerald-400 font-mono animate-pulse">
                    Clearance verified. Redirecting to Status Sign-In...
                  </p>
                </div>
              )}

              {isPending && (
                <div className="p-5 rounded-2xl bg-amber-500/10 border border-amber-500/30 text-amber-300 space-y-3">
                  <div className="flex items-center gap-2.5">
                    <Clock className="w-5 h-5 text-amber-400 shrink-0" />
                    <span className="font-display font-medium text-sm text-white">
                      Dossier Under Executive Review
                    </span>
                  </div>
                  <div className="font-mono text-xs text-neutral-300 space-y-1 bg-black/40 p-3 rounded-xl border border-amber-500/20">
                    <div className="flex justify-between">
                      <span className="text-neutral-400">ROLE REQUESTED:</span>
                      <span className="text-white">{result.role}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-neutral-400">STATUS:</span>
                      <span className="text-amber-400 font-bold">PENDING APPROVAL</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-neutral-400">CHECKED AT:</span>
                      <span className="text-neutral-400">{result.checkedAt}</span>
                    </div>
                  </div>
                  <p className="text-xs text-neutral-400 font-light leading-relaxed">
                    Your application is queued in the Sovereign Review ledger. As soon as the Directorate affirms your clearance, this notification will grant your instant platform entry.
                  </p>
                </div>
              )}

              {isDenied && (
                <div className="p-5 rounded-2xl bg-rose-500/10 border border-rose-500/30 text-rose-300 space-y-2">
                  <div className="flex items-center gap-2.5">
                    <ShieldAlert className="w-5 h-5 text-rose-400 shrink-0" />
                    <span className="font-display font-medium text-sm text-white">
                      Application Status: Denied
                    </span>
                  </div>
                  <p className="text-xs text-neutral-400 font-light leading-relaxed">
                    This dossier was not approved for the current intake cycle. You may submit an updated dossier for general delegate credentials.
                  </p>
                </div>
              )}

              {isNotFound && (
                <div className="p-5 rounded-2xl bg-neutral-900 border border-white/10 text-neutral-300 space-y-2">
                  <div className="flex items-center gap-2.5 text-neutral-400">
                    <ShieldAlert className="w-5 h-5 shrink-0" />
                    <span className="font-display font-medium text-sm text-white">
                      No Application Found
                    </span>
                  </div>
                  <p className="text-xs text-neutral-400 font-light leading-relaxed">
                    We could not find an application for <span className="text-white font-mono">{result.email}</span> in the Core Team ledger. Please make sure you used the same email address.
                  </p>
                </div>
              )}
            </div>
          )}

          {/* Quick Notice */}
          <div className="p-3 rounded-2xl bg-white/[0.02] border border-white/5 flex items-center gap-3 text-[11px] font-mono text-neutral-500">
            <Sparkles className="w-4 h-4 text-amber-400/80 shrink-0" />
            <span>Updates in real-time once administrators approve your clearance.</span>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
