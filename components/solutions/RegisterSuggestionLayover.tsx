'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Sparkles,
  X,
  FileCheck,
  Award,
  Vote,
  ShieldCheck,
  UserPlus,
  LogIn
} from 'lucide-react';
import { useAuth } from '@/context/AuthContext';

interface RegisterSuggestionLayoverProps {
  forceOpenModal?: boolean;
  onCloseForceModal?: () => void;
}

export function RegisterSuggestionLayover({
  forceOpenModal = false,
  onCloseForceModal,
}: RegisterSuggestionLayoverProps) {
  const { isAuthenticated, isGuest } = useAuth();
  const [isDismissed, setIsDismissed] = useState(false);

  // If already authenticated and not a guest, don't show the suggestion layover
  const shouldShow = (!isAuthenticated || isGuest);

  if (!shouldShow && !forceOpenModal) return null;

  return (
    <>
      {/* 1. Modal Mode (Triggered when clicking "Upload" or "Vote" without account) */}
      <AnimatePresence>
        {forceOpenModal && (
          <div className="fixed inset-0 z-[120] flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 15 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 15 }}
              className="relative w-full max-w-lg rounded-3xl bg-[#090b10] border border-cyan-500/30 p-6 sm:p-8 shadow-[0_25px_70px_rgba(0,0,0,0.9)] text-left text-white space-y-6 overflow-hidden"
            >
              {/* Background ambient glow */}
              <div className="absolute -top-24 -right-24 w-48 h-48 rounded-full bg-cyan-500/15 blur-3xl pointer-events-none" />
              <div className="absolute -bottom-24 -left-24 w-48 h-48 rounded-full bg-purple-500/15 blur-3xl pointer-events-none" />

              <div className="flex items-start justify-between">
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-500/10 border border-cyan-500/30 text-cyan-300 font-mono text-[10px] uppercase font-bold tracking-wider">
                  <ShieldCheck className="w-3.5 h-3.5 text-cyan-400" />
                  <span>REGISTRATION REQUIRED FOR RECORDS</span>
                </div>
                {onCloseForceModal && (
                  <button
                    onClick={onCloseForceModal}
                    className="p-1.5 rounded-full text-neutral-400 hover:text-white hover:bg-white/10 transition cursor-pointer"
                  >
                    <X className="w-5 h-5" />
                  </button>
                )}
              </div>

              <div className="space-y-2">
                <h3 className="text-xl sm:text-2xl font-bold font-display text-white leading-tight">
                  Add This Solution Into Your Permanent Records
                </h3>
                <p className="text-xs sm:text-sm text-neutral-300 font-sans leading-relaxed">
                  You are exploring solutions as an unauthenticated guest. To deposit research blueprints, co-sponsor resolutions, and record verified votes on policy drafts, please create your sovereign account.
                </p>
              </div>

              {/* Record Perks */}
              <div className="space-y-2.5 pt-1">
                <div className="p-3 rounded-2xl bg-white/[0.03] border border-white/10 flex items-start gap-3">
                  <FileCheck className="w-4 h-4 text-cyan-400 shrink-0 mt-0.5" />
                  <div className="text-xs">
                    <strong className="text-white font-semibold block">Permanent Portfolio Attribution</strong>
                    <span className="text-neutral-400 text-[11px]">Solutions you sponsor are cryptographically tied to your public ZEN.PROFILE.</span>
                  </div>
                </div>

                <div className="p-3 rounded-2xl bg-white/[0.03] border border-white/10 flex items-start gap-3">
                  <Vote className="w-4 h-4 text-purple-400 shrink-0 mt-0.5" />
                  <div className="text-xs">
                    <strong className="text-white font-semibold block">Civic Voting Weight</strong>
                    <span className="text-neutral-400 text-[11px]">Cast binding parliamentary votes on resolutions that shape simulated and grassroots agendas.</span>
                  </div>
                </div>

                <div className="p-3 rounded-2xl bg-white/[0.03] border border-white/10 flex items-start gap-3">
                  <Award className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
                  <div className="text-xs">
                    <strong className="text-white font-semibold block">Verifiable Civic Credentials</strong>
                    <span className="text-neutral-400 text-[11px]">Earn verifiable contribution records on ZEN.CERTIFY for academic or career portfolios.</span>
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex flex-col sm:flex-row items-center gap-3 pt-2">
                <Link
                  href="/login"
                  className="w-full sm:flex-1 py-3 px-5 rounded-2xl bg-white text-black font-display font-bold text-xs uppercase tracking-wider text-center hover:bg-neutral-200 transition shadow-[0_0_20px_rgba(255,255,255,0.2)] flex items-center justify-center gap-2 cursor-pointer"
                >
                  <UserPlus className="w-4 h-4 text-black" />
                  <span>Create Free Account</span>
                </Link>

                <Link
                  href="/login"
                  className="w-full sm:w-auto py-3 px-5 rounded-2xl bg-white/10 hover:bg-white/15 border border-white/15 text-white font-mono text-xs text-center transition flex items-center justify-center gap-2 cursor-pointer"
                >
                  <LogIn className="w-3.5 h-3.5" />
                  <span>Sign In</span>
                </Link>
              </div>

              {onCloseForceModal && (
                <div className="text-center">
                  <button
                    type="button"
                    onClick={onCloseForceModal}
                    className="text-[11px] font-mono text-neutral-500 hover:text-neutral-300 transition cursor-pointer underline underline-offset-4"
                  >
                    Continue Reading as Guest
                  </button>
                </div>
              )}
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* 2. Floating Bottom Dock Layover (Non-intrusive suggestion while browsing) */}
      {!forceOpenModal && !isDismissed && (
        <AnimatePresence>
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 40 }}
            transition={{ duration: 0.3, ease: 'easeOut' }}
            className="fixed bottom-5 right-4 sm:right-8 z-50 max-w-md w-[calc(100vw-2rem)]"
          >
            <div className="rounded-3xl bg-[#090b10]/95 backdrop-blur-2xl border border-cyan-500/30 p-5 shadow-[0_20px_60px_rgba(0,0,0,0.85)] text-left text-white space-y-3.5 relative overflow-hidden">
              {/* Radial edge glow */}
              <div className="absolute top-0 right-0 w-32 h-32 bg-cyan-500/10 rounded-full blur-2xl pointer-events-none" />

              <div className="flex items-center justify-between">
                <div className="inline-flex items-center gap-2 px-2.5 py-0.5 rounded-full bg-cyan-500/10 border border-cyan-500/25 text-cyan-300 font-mono text-[10px] font-bold uppercase">
                  <Sparkles className="w-3 h-3 text-cyan-400" />
                  <span>SUGGESTION FOR GUESTS</span>
                </div>

                <div className="flex items-center gap-1">
                  <button
                    onClick={() => setIsDismissed(true)}
                    className="p-1 rounded-full text-neutral-400 hover:text-white hover:bg-white/10 transition cursor-pointer"
                    title="Dismiss"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>
              </div>

              <div className="space-y-1">
                <h4 className="font-bold text-sm font-display text-white">
                  Want to add this into your official records?
                </h4>
                <p className="text-[11px] sm:text-xs text-neutral-300 font-sans leading-relaxed">
                  You can explore and read all community solutions freely without registering. To co-sponsor bills, cast verified votes, or add research blueprints to your public records, register a free account.
                </p>
              </div>

              <div className="flex items-center gap-2.5 pt-1">
                <Link
                  href="/login"
                  className="flex-1 py-2 px-4 rounded-xl bg-white text-black font-display font-bold text-xs uppercase tracking-wider text-center hover:bg-neutral-200 transition flex items-center justify-center gap-1.5 shadow-sm cursor-pointer"
                >
                  <UserPlus className="w-3.5 h-3.5 text-black" />
                  <span>Register Free</span>
                </Link>

                <Link
                  href="/login"
                  className="py-2 px-3 rounded-xl bg-white/10 hover:bg-white/15 border border-white/15 text-white font-mono text-xs text-center transition flex items-center justify-center gap-1 cursor-pointer"
                >
                  <LogIn className="w-3.5 h-3.5" />
                  <span>Sign In</span>
                </Link>

                <button
                  type="button"
                  onClick={() => setIsDismissed(true)}
                  className="py-2 px-2.5 text-[11px] font-mono text-neutral-400 hover:text-neutral-200 transition cursor-pointer"
                >
                  Dismiss
                </button>
              </div>
            </div>
          </motion.div>
        </AnimatePresence>
      )}

      {/* 3. Minimized Re-open Pill (If user dismissed the bottom dock, let them re-open anytime) */}
      {!forceOpenModal && isDismissed && (
        <motion.button
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          onClick={() => setIsDismissed(false)}
          className="fixed bottom-5 right-4 sm:right-8 z-50 inline-flex items-center gap-2 px-3.5 py-2 rounded-full bg-[#090b10]/95 backdrop-blur-xl border border-cyan-500/40 text-cyan-300 font-mono text-xs font-bold shadow-2xl hover:scale-105 active:scale-95 transition cursor-pointer"
        >
          <Sparkles className="w-3.5 h-3.5 text-cyan-400" />
          <span>Add To Records?</span>
        </motion.button>
      )}
    </>
  );
}
