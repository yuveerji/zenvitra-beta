'use client';

import React, { useState, useEffect, Suspense } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { 
  ShieldAlert, 
  ShieldCheck, 
  Crown, 
  KeyRound, 
  Lock, 
  Unlock, 
  ArrowRight, 
  CheckCircle2, 
  Activity, 
  Cpu, 
  Zap, 
  RefreshCw,
  AlertTriangle
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { activateAdminSession, activateFounderSession, verifyFounderKey } from '@/lib/founderControl';

function getOrCreateDeviceId(): string {
  if (typeof window === 'undefined') return 'server_device';
  let devId = localStorage.getItem('zenvitra_enclave_device_id');
  if (!devId) {
    devId = 'dev_' + Math.random().toString(36).slice(2) + '_' + Date.now();
    localStorage.setItem('zenvitra_enclave_device_id', devId);
  }
  return devId;
}

function EnclaveAccessContent() {
  const searchParams = useSearchParams();
  const router = useRouter();

  const urlInvite = searchParams.get('invite') || searchParams.get('token') || searchParams.get('access_key') || searchParams.get('auth') || '';
  
  const [inviteToken, setInviteToken] = useState(urlInvite);
  const [passcode, setPasscode] = useState('');
  
  const [inviteMeta, setInviteMeta] = useState<{
    valid: boolean;
    adminName?: string;
    role?: string;
    singleUse?: boolean;
    isClaimed?: boolean;
    error?: string;
  } | null>(null);

  const [isLoading, setIsLoading] = useState(false);
  const [isVerifyingLink, setIsVerifyingLink] = useState(Boolean(urlInvite));
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);

  // Auto-verify invite token on mount
  useEffect(() => {
    if (!urlInvite) {
      setIsVerifyingLink(false);
      return;
    }

    const checkLink = async () => {
      setIsVerifyingLink(true);
      setErrorMsg(null);
      try {
        const res = await fetch(`/api/admin-enclave?invite=${encodeURIComponent(urlInvite)}`, {
          cache: 'no-store'
        });
        const data = await res.json();
        if (res.ok && data.valid) {
          setInviteMeta(data);
          // If founder key was passed directly
          if (verifyFounderKey(urlInvite)) {
            activateFounderSession(urlInvite);
            setSuccessMsg('👑 Sovereign Founder Clearance verified! Redirecting to Command Vault...');
            setTimeout(() => router.push('/zen-vault-root'), 1200);
          }
        } else {
          setInviteMeta({ valid: false, error: data.error || 'Access token is invalid or expired.' });
          setErrorMsg(data.error || 'Access token is invalid or expired.');
        }
      } catch (err: any) {
        setInviteMeta({ valid: false, error: 'Could not connect to security enclave.' });
      } finally {
        setIsVerifyingLink(false);
      }
    };

    checkLink();
  }, [urlInvite, router]);

  const handleClaimSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!inviteToken.trim()) {
      setErrorMsg('Please provide your designated Access Token.');
      return;
    }
    if (!passcode.trim()) {
      setErrorMsg('Please enter your secret authorization code.');
      return;
    }

    setIsLoading(true);
    setErrorMsg(null);

    const deviceId = getOrCreateDeviceId();

    // Check if it's a direct founder key
    if (verifyFounderKey(passcode.trim()) || verifyFounderKey(inviteToken.trim())) {
      activateFounderSession(passcode.trim() || inviteToken.trim());
      setSuccessMsg('👑 Sovereign Founder Clearance verified! Redirecting to Sovereign Vault...');
      setTimeout(() => router.push('/zen-vault-root'), 1200);
      return;
    }

    try {
      const res = await fetch('/api/admin-enclave', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'CLAIM',
          inviteId: inviteToken.trim(),
          passcode: passcode.trim(),
          deviceId
        })
      });

      const data = await res.json();

      if (res.ok && data.success) {
        activateAdminSession(passcode.trim(), data.adminName);
        setSuccessMsg(`🛡️ Verified as ${data.adminName || 'Staff Admin'}! Single-use token bound to this device.`);
        setTimeout(() => {
          router.push('/dashboard');
        }, 1500);
      } else {
        setErrorMsg(data.error || 'Verification failed. Please check your authorization code.');
      }
    } catch (err: any) {
      setErrorMsg('Enclave connection error. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#020204] text-white font-mono flex flex-col items-center justify-center p-4 sm:p-6 selection:bg-cyan-500 selection:text-black relative overflow-hidden text-left">
      {/* Background Matrix Grid */}
      <div 
        className="fixed inset-0 pointer-events-none opacity-20"
        style={{
          backgroundImage: 'radial-gradient(circle at 50% 30%, rgba(6, 182, 212, 0.15) 0%, transparent 60%), linear-gradient(rgba(255, 255, 255, 0.05) 1px, transparent 1px), linear-gradient(90deg, rgba(255, 255, 255, 0.05) 1px, transparent 1px)',
          backgroundSize: '100% 100%, 32px 32px, 32px 32px'
        }}
      />

      <motion.div
        initial={{ opacity: 0, scale: 0.96 }}
        animate={{ opacity: 1, scale: 1 }}
        className="relative z-10 w-full max-w-lg bg-[#07080d] border border-cyan-500/40 rounded-3xl p-8 sm:p-10 shadow-[0_0_100px_rgba(6,182,212,0.15)] space-y-6"
      >
        {/* Header Badge */}
        <div className="text-center space-y-3">
          <div className="w-16 h-16 rounded-3xl bg-cyan-500/10 border border-cyan-500/30 mx-auto flex items-center justify-center text-cyan-400 shadow-[0_0_30px_rgba(6,182,212,0.25)]">
            <ShieldCheck className="w-8 h-8" />
          </div>

          <div>
            <span className="text-[10px] text-cyan-400 font-bold uppercase tracking-widest block">
              HARDWARE ENCLAVE &bull; SINGLE-USE ACCESS PORTAL
            </span>
            <h1 className="font-display font-black text-2xl sm:text-3xl text-white tracking-wide uppercase pt-1">
              Admin Access Enclave
            </h1>
          </div>

          <p className="text-xs text-neutral-400 leading-relaxed font-sans max-w-md mx-auto">
            This private portal authorizes staff members and administrators to enter the website with maintenance bypass clearance.
          </p>
        </div>

        {/* Loading Spinner for Token Check */}
        {isVerifyingLink && (
          <div className="p-4 rounded-2xl bg-cyan-500/10 border border-cyan-500/20 text-cyan-300 text-xs flex items-center justify-center gap-2">
            <RefreshCw className="w-4 h-4 animate-spin text-cyan-400" />
            <span>Validating Access Link with Sovereign Enclave...</span>
          </div>
        )}

        {/* Invite Slot Assigned Banner */}
        {inviteMeta?.valid && (
          <div className="p-4 rounded-2xl bg-gradient-to-r from-cyan-950/60 via-black to-black border border-cyan-500/30 text-xs space-y-1">
            <div className="flex items-center justify-between">
              <span className="text-[10px] text-cyan-400 uppercase font-bold">Designated Identity Slot</span>
              <span className="text-[10px] px-2 py-0.5 rounded bg-cyan-500/20 text-cyan-300 font-bold">
                {inviteMeta.role || 'ADMIN'}
              </span>
            </div>
            <p className="text-white font-bold text-sm tracking-wide">{inviteMeta.adminName || 'Staff Member'}</p>
            {inviteMeta.singleUse && (
              <p className="text-[10px] text-neutral-400 pt-0.5 flex items-center gap-1">
                <Lock className="w-3 h-3 text-amber-400" />
                <span>Single-Use Token: Will lock permanently to your device upon authentication.</span>
              </p>
            )}
          </div>
        )}

        {/* Error Alert */}
        {errorMsg && (
          <div className="p-4 rounded-2xl bg-rose-500/15 border border-rose-500/40 text-rose-300 text-xs flex items-start gap-2.5">
            <AlertTriangle className="w-4 h-4 shrink-0 text-rose-400 mt-0.5" />
            <div className="space-y-0.5">
              <p className="font-bold">Access Verification Error</p>
              <p className="text-rose-300/90 text-[11px] font-sans">{errorMsg}</p>
            </div>
          </div>
        )}

        {/* Success Alert */}
        {successMsg && (
          <div className="p-4 rounded-2xl bg-emerald-500/20 border border-emerald-500/40 text-emerald-300 text-xs flex items-center gap-2.5 shadow-[0_0_30px_rgba(52,211,153,0.3)]">
            <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0" />
            <span className="font-bold">{successMsg}</span>
          </div>
        )}

        {/* Form */}
        <form onSubmit={handleClaimSubmit} className="space-y-4">
          {!urlInvite && (
            <div className="space-y-1.5">
              <label className="text-[11px] font-mono text-neutral-400 uppercase font-bold">
                Designated Access Link Token (Invite ID)
              </label>
              <input
                type="text"
                required
                value={inviteToken}
                onChange={(e) => setInviteToken(e.target.value)}
                placeholder="e.g. INV-8492-AX91"
                autoComplete="off"
                className="w-full px-4 py-3 rounded-2xl bg-black border border-white/20 text-cyan-300 font-mono text-xs focus:outline-none focus:border-cyan-400"
              />
            </div>
          )}

          <div className="space-y-1.5">
            <label className="text-[11px] font-mono text-neutral-300 uppercase font-bold flex items-center gap-1.5">
              <KeyRound className="w-3.5 h-3.5 text-cyan-400" />
              <span>Enter Secret Authorization Code</span>
            </label>
            <input
              type="password"
              required
              autoFocus
              value={passcode}
              onChange={(e) => setPasscode(e.target.value)}
              placeholder="Insert your code"
              autoComplete="off"
              className="w-full px-4 py-3.5 rounded-2xl bg-black border border-cyan-500/40 text-white font-mono text-xs text-center tracking-[0.2em] focus:outline-none focus:border-cyan-400 focus:shadow-[0_0_20px_rgba(6,182,212,0.3)]"
            />
          </div>

          <button
            type="submit"
            disabled={isLoading || Boolean(successMsg)}
            className="w-full py-4 rounded-2xl bg-cyan-500 hover:bg-cyan-400 disabled:opacity-40 text-black font-mono text-xs font-black transition cursor-pointer shadow-[0_0_30px_rgba(6,182,212,0.4)] flex items-center justify-center gap-2 uppercase tracking-wider"
          >
            {isLoading ? (
              <>
                <RefreshCw className="w-4 h-4 animate-spin text-black" />
                <span>Authenticating Enclave...</span>
              </>
            ) : (
              <>
                <Unlock className="w-4 h-4 fill-black" />
                <span>Authenticate &amp; Enter Platform</span>
              </>
            )}
          </button>
        </form>

        <div className="pt-2 border-t border-white/10 flex items-center justify-between text-[11px] text-neutral-500">
          <span>Security Protocol: ED25519</span>
          <span>Zero External Exfiltration</span>
        </div>
      </motion.div>
    </div>
  );
}

export default function EnclaveAccessPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-[#020204] text-cyan-400 font-mono text-xs flex items-center justify-center">
        <RefreshCw className="w-5 h-5 animate-spin mr-2" />
        <span>INITIALIZING ENCLAVE SECURITY ENVIRONMENT...</span>
      </div>
    }>
      <EnclaveAccessContent />
    </Suspense>
  );
}
