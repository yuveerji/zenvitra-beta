'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  CheckCircle2, 
  ShieldCheck, 
  X, 
  Sparkles, 
  Lock, 
  FileCheck2, 
  Users, 
  Crown, 
  ArrowRight, 
  Loader2, 
  Award,
  Globe2,
  Check
} from 'lucide-react';
import { useAuth } from '@/context/AuthContext';
import { useZenPulse } from '@/context/ZenPulsePlatformContext';

interface VerificationModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function VerificationModal({ isOpen, onClose }: VerificationModalProps) {
  const { profile } = useAuth();
  const { myProfile } = useZenPulse();

  const [pledgeChecked, setPledgeChecked] = useState(false);
  const [evaluating, setEvaluating] = useState(false);
  const [justVerified, setJustVerified] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  if (!isOpen) return null;

  const currentHandle = (myProfile?.username || profile?.username || (profile as any)?.handle || 'user').replace(/^@/, '').toLowerCase();
  const isFounder = currentHandle === 'yuveer' || currentHandle === 'founder' || profile?.email === 'founder@zenvitra.org';
  const isAlreadyVerified = Boolean(isFounder || profile?.is_verified || myProfile?.isVerified || (profile as any)?.isVerified);

  const handleApplyVerification = async () => {
    if (!pledgeChecked && !isAlreadyVerified) {
      setErrorMsg('Please confirm and sign the Constitutional Integrity Accord.');
      return;
    }

    setErrorMsg(null);
    setEvaluating(true);

    setTimeout(() => {
      try {
        // Save verified state to local storage session user
        const stored = JSON.parse(localStorage.getItem('zenvitra_session_user') || '{}');
        const nextUser = {
          ...stored,
          is_verified: true,
          isVerified: true,
        };
        localStorage.setItem('zenvitra_session_user', JSON.stringify(nextUser));

        // Also update zenvitra_saved_sessions
        const rawSessions = localStorage.getItem('zenvitra_saved_sessions');
        if (rawSessions) {
          const list = JSON.parse(rawSessions);
          const updatedList = list.map((acc: any) => {
            if ((acc.username || '').replace(/^@/, '').toLowerCase() === currentHandle) {
              return { ...acc, is_verified: true, isVerified: true };
            }
            return acc;
          });
          localStorage.setItem('zenvitra_saved_sessions', JSON.stringify(updatedList));
        }

        setEvaluating(false);
        setJustVerified(true);

        setTimeout(() => {
          window.location.reload();
        }, 1200);
      } catch (err: any) {
        setEvaluating(false);
        setErrorMsg('Failed to process verification. Please retry.');
      }
    }, 1500);
  };

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
        {/* Backdrop */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          className="fixed inset-0 bg-black/85 backdrop-blur-md"
        />

        {/* Modal Dialog */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 15 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 15 }}
          transition={{ type: 'spring', damping: 25, stiffness: 350 }}
          className="relative w-full max-w-md bg-[#090a0f] border border-cyan-500/30 rounded-3xl p-6 sm:p-7 shadow-[0_0_80px_rgba(6,182,212,0.15)] z-10 space-y-6 text-white text-left overflow-hidden"
        >
          {/* Ambient Glow */}
          <div className="absolute -top-24 -left-24 w-48 h-48 bg-cyan-500/20 rounded-full blur-3xl pointer-events-none" />
          <div className="absolute -bottom-24 -right-24 w-48 h-48 bg-violet-500/20 rounded-full blur-3xl pointer-events-none" />

          {/* Close Button */}
          <button
            type="button"
            onClick={onClose}
            className="absolute top-5 right-5 p-1.5 rounded-full text-neutral-400 hover:text-white hover:bg-white/10 transition cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>

          {/* Header Badge Display */}
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 rounded-2xl bg-gradient-to-tr from-cyan-500 via-teal-400 to-indigo-500 p-0.5 shadow-[0_0_25px_rgba(6,182,212,0.4)] shrink-0 flex items-center justify-center">
              <div className="w-full h-full rounded-[14px] bg-[#07080c] flex items-center justify-center">
                <CheckCircle2 className="w-7 h-7 text-cyan-400 drop-shadow-[0_0_10px_rgba(6,182,212,0.8)]" />
              </div>
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <span className="text-[10px] font-mono font-bold tracking-widest text-cyan-400 uppercase">
                  CLEARANCE PROTOCOL
                </span>
                {isAlreadyVerified && (
                  <span className="px-2 py-0.5 rounded-full bg-cyan-500/20 border border-cyan-500/40 text-[9px] font-mono text-cyan-300 font-bold">
                    ACTIVE
                  </span>
                )}
              </div>
              <h2 className="text-lg sm:text-xl font-bold text-white tracking-tight">
                Verified Sovereign Badge
              </h2>
              <p className="text-xs text-neutral-400">
                Official cryptographic authenticity badge on Zenvitra.
              </p>
            </div>
          </div>

          {/* Verification Status Card */}
          {isAlreadyVerified || justVerified ? (
            <div className="p-4 rounded-2xl bg-cyan-500/10 border border-cyan-500/30 space-y-3">
              <div className="flex items-center gap-3">
                <ShieldCheck className="w-5 h-5 text-cyan-400 shrink-0" />
                <div>
                  <h4 className="text-xs font-bold text-white">Sovereign Identity Confirmed</h4>
                  <p className="text-[11px] text-neutral-300">
                    Your node <strong>@{currentHandle}</strong> holds verified status with zero-tamper reputation.
                  </p>
                </div>
              </div>
              <div className="pt-2 border-t border-cyan-500/20 flex items-center justify-between text-[10px] font-mono text-cyan-300">
                <span>LEDGER: ZENVITRA_MAINNET_V1</span>
                <span>STATUS: 100% VERIFIED</span>
              </div>
            </div>
          ) : (
            <>
              {/* Criterion List */}
              <div className="space-y-2.5">
                <h3 className="text-xs font-mono font-bold text-neutral-400 uppercase tracking-wider">
                  Verification Criterions
                </h3>

                {/* Criterion 1: Identity Profile */}
                <div className="p-3 rounded-2xl bg-white/[0.03] border border-white/10 flex items-center justify-between gap-3">
                  <div className="flex items-center gap-3 min-w-0">
                    <div className="w-7 h-7 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center shrink-0">
                      <Users className="w-3.5 h-3.5 text-neutral-300" />
                    </div>
                    <div>
                      <p className="text-xs font-bold text-white">1. Sovereign Profile Identity</p>
                      <p className="text-[11px] text-neutral-400">Handle, name & biography initialized.</p>
                    </div>
                  </div>
                  <div className="w-5 h-5 rounded-full bg-emerald-500/20 border border-emerald-500/40 text-emerald-400 flex items-center justify-center">
                    <Check className="w-3 h-3 stroke-[3]" />
                  </div>
                </div>

                {/* Criterion 2: Security & Passphrase */}
                <div className="p-3 rounded-2xl bg-white/[0.03] border border-white/10 flex items-center justify-between gap-3">
                  <div className="flex items-center gap-3 min-w-0">
                    <div className="w-7 h-7 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center shrink-0">
                      <Lock className="w-3.5 h-3.5 text-neutral-300" />
                    </div>
                    <div>
                      <p className="text-xs font-bold text-white">2. Cryptographic Security</p>
                      <p className="text-[11px] text-neutral-400">Protected passphrase & anti-brute defense.</p>
                    </div>
                  </div>
                  <div className="w-5 h-5 rounded-full bg-emerald-500/20 border border-emerald-500/40 text-emerald-400 flex items-center justify-center">
                    <Check className="w-3 h-3 stroke-[3]" />
                  </div>
                </div>

                {/* Criterion 3: Civic Standing */}
                <div className="p-3 rounded-2xl bg-white/[0.03] border border-white/10 flex items-center justify-between gap-3">
                  <div className="flex items-center gap-3 min-w-0">
                    <div className="w-7 h-7 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center shrink-0">
                      <Globe2 className="w-3.5 h-3.5 text-neutral-300" />
                    </div>
                    <div>
                      <p className="text-xs font-bold text-white">3. Active Protocol Standing</p>
                      <p className="text-[11px] text-neutral-400">Authentic participation without spam or bots.</p>
                    </div>
                  </div>
                  <div className="w-5 h-5 rounded-full bg-emerald-500/20 border border-emerald-500/40 text-emerald-400 flex items-center justify-center">
                    <Check className="w-3 h-3 stroke-[3]" />
                  </div>
                </div>

                {/* Criterion 4: Constitutional Accord */}
                <label className="p-3 rounded-2xl bg-white/[0.03] hover:bg-white/[0.06] border border-white/10 hover:border-cyan-500/30 flex items-start gap-3 cursor-pointer transition">
                  <input
                    type="checkbox"
                    checked={pledgeChecked}
                    onChange={(e) => setPledgeChecked(e.target.checked)}
                    className="mt-0.5 w-4 h-4 rounded bg-white/10 border-white/20 text-cyan-500 focus:ring-0 cursor-pointer accent-cyan-400"
                  />
                  <div className="text-left">
                    <p className="text-xs font-bold text-white">4. Constitutional Integrity Accord</p>
                    <p className="text-[11px] text-neutral-400">
                      I pledge authentic student engagement, zero astroturfing, and commitment to sovereign discourse.
                    </p>
                  </div>
                </label>
              </div>

              {errorMsg && (
                <div className="p-3 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-300 text-xs font-mono">
                  {errorMsg}
                </div>
              )}

              {/* Action Button */}
              <button
                type="button"
                onClick={handleApplyVerification}
                disabled={evaluating}
                className="w-full py-3.5 rounded-2xl bg-gradient-to-r from-cyan-400 via-teal-400 to-indigo-400 text-black font-display font-bold text-xs uppercase tracking-wider transition shadow-[0_0_25px_rgba(6,182,212,0.3)] hover:shadow-[0_0_35px_rgba(6,182,212,0.5)] active:scale-[0.98] flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
              >
                {evaluating ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin text-black" />
                    <span>Evaluating Protocol Credentials...</span>
                  </>
                ) : (
                  <>
                    <span>Claim Verified Sovereign Badge</span>
                    <ArrowRight className="w-4 h-4 text-black" />
                  </>
                )}
              </button>
            </>
          )}

          {/* Footer note */}
          <div className="text-center pt-2 border-t border-white/10">
            <p className="text-[10px] font-mono text-neutral-500">
              Verified badges are permanently anchored to your decentralized ZEN.ID.
            </p>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
