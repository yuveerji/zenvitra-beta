'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { 
  ShieldAlert, 
  Crown, 
  KeyRound, 
  Unlock, 
  CheckCircle2, 
  ArrowRight,
  ShieldCheck,
  Radio,
  Lock
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  activateAdminSession, 
  activateFounderSession, 
  verifyAdminKey, 
  verifyFounderKey 
} from '@/lib/founderControl';

export default function AdminAccessPortalPage() {
  const router = useRouter();
  const [passkeyInput, setPasskeyInput] = useState('');
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!passkeyInput.trim()) return;

    setIsLoading(true);
    setErrorMessage(null);

    const clean = passkeyInput.trim();
    const isFounder = verifyFounderKey(clean);
    const isAdmin = verifyAdminKey(clean);

    if (isFounder) {
      activateFounderSession(clean);
      setSuccessMessage('👑 Founder Level 0 Authorization Verified! Unlocking Platform...');
      setTimeout(() => {
        router.push('/zen-vault-root');
      }, 1200);
    } else if (isAdmin) {
      activateAdminSession(clean);
      setSuccessMessage('🛡️ Admin Operational Clearance Verified! Entering Platform...');
      setTimeout(() => {
        router.push('/pulse');
      }, 1200);
    } else {
      setIsLoading(false);
      setErrorMessage('Invalid Authorization Code. Please check your assigned passkey.');
    }
  };

  return (
    <div className="min-h-screen bg-[#020204] text-white font-mono flex flex-col items-center justify-center p-6 selection:bg-amber-500 selection:text-black relative overflow-hidden text-left">
      {/* Background Matrix Grid */}
      <div 
        className="fixed inset-0 pointer-events-none opacity-20"
        style={{
          backgroundImage: 'radial-gradient(circle at 50% 30%, rgba(251, 191, 36, 0.15) 0%, transparent 60%), linear-gradient(rgba(255, 255, 255, 0.05) 1px, transparent 1px), linear-gradient(90deg, rgba(255, 255, 255, 0.05) 1px, transparent 1px)',
          backgroundSize: '100% 100%, 32px 32px, 32px 32px'
        }}
      />

      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="relative z-10 w-full max-w-md bg-[#08090f] border border-cyan-500/30 rounded-3xl p-8 sm:p-10 shadow-[0_0_100px_rgba(6,182,212,0.15)] space-y-6"
      >
        {/* Enclave Header Icon */}
        <div className="text-center space-y-3">
          <div className="w-16 h-16 rounded-3xl bg-cyan-500/10 border border-cyan-500/30 mx-auto flex items-center justify-center text-cyan-400 shadow-[0_0_30px_rgba(6,182,212,0.25)]">
            <ShieldCheck className="w-8 h-8" />
          </div>

          <div>
            <div className="inline-flex items-center gap-1.5 px-3 py-0.5 rounded-full bg-cyan-500/10 border border-cyan-500/30 text-cyan-300 text-[10px] font-bold uppercase tracking-widest">
              <Radio className="w-3 h-3 text-cyan-400 animate-pulse" />
              <span>PRIVATE ENCLAVE &bull; AUTHORIZED PERSONNEL ONLY</span>
            </div>
            <h1 className="font-display font-black text-2xl text-white tracking-tight uppercase pt-2">
              Staff &amp; Admin Portal
            </h1>
          </div>

          <p className="text-xs text-neutral-400 leading-relaxed font-sans">
            Enter your assigned Authorization Code to bypass maintenance lockdown and access platform tools.
          </p>
        </div>

        {/* Error Notification */}
        {errorMessage && (
          <div className="p-3.5 rounded-2xl bg-rose-500/15 border border-rose-500/40 text-rose-300 text-xs flex items-center gap-2.5">
            <ShieldAlert className="w-4 h-4 text-rose-400 shrink-0" />
            <span>{errorMessage}</span>
          </div>
        )}

        {/* Success Notification */}
        {successMessage && (
          <div className="p-3.5 rounded-2xl bg-emerald-500/15 border border-emerald-500/40 text-emerald-300 text-xs flex items-center gap-2.5">
            <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
            <span>{successMessage}</span>
          </div>
        )}

        {/* Authorization Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-1.5">
            <label className="text-[11px] uppercase tracking-wider text-neutral-300 font-bold block flex items-center gap-1.5">
              <KeyRound className="w-3.5 h-3.5 text-cyan-400" />
              <span>ENTER AUTHORIZATION CODE</span>
            </label>
            <input
              type="password"
              required
              autoFocus
              autoComplete="off"
              disabled={isLoading}
              value={passkeyInput}
              onChange={(e) => setPasskeyInput(e.target.value)}
              placeholder="Insert your code"
              className="w-full px-4 py-3 rounded-xl bg-black border border-white/20 text-cyan-300 text-sm focus:outline-none focus:border-cyan-400 font-mono tracking-wider shadow-inner disabled:opacity-50"
            />
          </div>

          <button
            type="submit"
            disabled={isLoading || !passkeyInput.trim()}
            className="w-full py-3.5 rounded-xl bg-cyan-500 hover:bg-cyan-400 disabled:opacity-40 text-black font-bold text-xs transition flex items-center justify-center gap-2 cursor-pointer shadow-[0_0_30px_rgba(6,182,212,0.4)]"
          >
            <span>{isLoading ? 'Verifying Authorization...' : 'Authorize & Enter Platform'}</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </form>

        <div className="pt-2 border-t border-white/10 text-center text-[10px] text-neutral-500 font-mono">
          Cryptographic Hardware Verification &bull; ED25519 Enclave
        </div>
      </motion.div>
    </div>
  );
}
