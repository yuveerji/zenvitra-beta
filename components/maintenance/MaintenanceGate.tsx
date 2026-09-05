'use client';

import React, { useState, useEffect } from 'react';
import { 
  ShieldAlert, 
  ShieldCheck,
  Crown, 
  KeyRound, 
  Lock, 
  Unlock, 
  RefreshCw, 
  Cpu, 
  Activity, 
  Zap, 
  CheckCircle2, 
  Radio,
  Sliders,
  AlertTriangle,
  X
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  getProtocolControls, 
  saveProtocolControls, 
  isFounder, 
  isAdmin, 
  activateFounderSession, 
  isFounderSessionActive,
  activateAdminSession,
  isAdminSessionActive
} from '@/lib/founderControl';
import { useAuth } from '@/context/AuthContext';

interface MaintenanceGateProps {
  children: React.ReactNode;
}

export function MaintenanceGate({ children }: MaintenanceGateProps) {
  const { user, profile } = useAuth();
  const [maintenanceActive, setMaintenanceActive] = useState<boolean>(false);
  const [isPrivileged, setIsPrivileged] = useState<boolean>(false);
  const [mounted, setMounted] = useState<boolean>(false);

  /* Inline Unlock Form for Founder / Admin */
  const [showUnlockModal, setShowUnlockModal] = useState<boolean>(false);
  const [passkeyInput, setPasskeyInput] = useState<string>('');
  const [passkeyError, setPasskeyError] = useState<string | null>(null);
  const [unlockSuccess, setUnlockSuccess] = useState<string | null>(null);

  const checkPrivilege = () => {
    if (typeof window !== 'undefined') {
      if (
        localStorage.getItem('zenvitra_founder_active_session') === 'true' ||
        localStorage.getItem('zenvitra_admin_active_session') === 'true' ||
        sessionStorage.getItem('zenvitra_vault_authenticated') === 'true'
      ) {
        return true;
      }
    }
    const effectiveUser = (user?.email?.split('@')[0] || profile?.username || '').toLowerCase().trim().replace(/^@/, '');
    const userRole = (profile?.role as any) || (profile as any)?.badge;
    const isF = isFounder(effectiveUser, userRole) || isFounderSessionActive();
    const isA = isAdmin(effectiveUser, userRole) || isAdminSessionActive();
    return isF || isA;
  };

  useEffect(() => {
    setMounted(true);

    // Auto-detect and authenticate shared Admin / Founder Bypass Links (?access_key=... or ?bypass_key=...)
    if (typeof window !== 'undefined') {
      try {
        const urlParams = new URLSearchParams(window.location.search);
        const accessKey = urlParams.get('access_key') || urlParams.get('bypass_key') || urlParams.get('admin_key') || urlParams.get('auth') || urlParams.get('key');
        if (accessKey) {
          const activated = activateAdminSession(accessKey) || activateFounderSession(accessKey);
          if (activated) {
            setIsPrivileged(true);
            // Clean URL query without page reload
            const cleanUrl = window.location.pathname + window.location.hash;
            window.history.replaceState(null, '', cleanUrl);
          }
        }
      } catch (_) {}
    }

    const syncServerProtocols = async () => {
      try {
        const res = await fetch('/api/protocols', { 
          cache: 'no-store',
          headers: { 'Accept': 'application/json' }
        });
        if (res.ok) {
          const data = await res.json();
          setMaintenanceActive(Boolean(data.maintenanceMode));
          // Update local mirror as well
          if (typeof window !== 'undefined' && data) {
            const currentLocal = getProtocolControls();
            localStorage.setItem('zenvitra_protocol_controls_v1', JSON.stringify({ ...currentLocal, ...data }));
          }
        } else {
          const p = getProtocolControls();
          setMaintenanceActive(Boolean(p.maintenanceMode));
        }
      } catch (_) {
        const p = getProtocolControls();
        setMaintenanceActive(Boolean(p.maintenanceMode));
      }
      setIsPrivileged(checkPrivilege());
    };

    syncServerProtocols();

    // Relaxed 60s heartbeat only when tab is visible
    const interval = setInterval(() => {
      if (typeof document !== 'undefined' && document.visibilityState === 'visible') {
        syncServerProtocols().catch(() => {});
      }
    }, 60000);

    let syncTimeout: any = null;
    const debouncedSync = () => {
      if (syncTimeout) clearTimeout(syncTimeout);
      syncTimeout = setTimeout(() => {
        syncServerProtocols().catch(() => {});
      }, 500);
    };

    const onStorage = (e: StorageEvent) => {
      // Only sync if related to protocol or founder credentials
      if (!e.key || e.key.includes('protocol') || e.key.includes('founder') || e.key.includes('vault')) {
        debouncedSync();
      }
    };

    window.addEventListener('storage', onStorage);
    window.addEventListener('zenvitra_protocol_update', debouncedSync);

    return () => {
      clearInterval(interval);
      if (syncTimeout) clearTimeout(syncTimeout);
      window.removeEventListener('storage', onStorage);
      window.removeEventListener('zenvitra_protocol_update', debouncedSync);
    };
  }, [user, profile]);

  const handleUnlockSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!passkeyInput.trim()) return;

    const success = activateFounderSession(passkeyInput.trim());
    if (success) {
      setPasskeyError(null);
      setUnlockSuccess('👑 Sovereign clearance unlocked! Access granted.');
      setIsPrivileged(true);
      setTimeout(() => {
        setShowUnlockModal(false);
        setUnlockSuccess(null);
        setPasskeyInput('');
      }, 1200);
    } else {
      setPasskeyError('Invalid authorization code.');
    }
  };

  const handleTurnOffMaintenance = () => {
    saveProtocolControls({ maintenanceMode: false });
    setMaintenanceActive(false);
  };

  if (!mounted) {
    return <>{children}</>;
  }

  const pathname = typeof window !== 'undefined' ? window.location.pathname : '';
  const isExemptPath = Boolean(
    pathname.startsWith('/zen-vault-root') ||
    pathname.startsWith('/admin-access') ||
    pathname.startsWith('/enclave') ||
    pathname.startsWith('/api')
  );

  // If maintenance is ON AND user is NOT Founder/Admin and NOT on an exempt path -> FULL SCREEN MAINTENANCE SCREEN
  if (maintenanceActive && !isPrivileged && !isExemptPath) {
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

        {/* Ambient Top Emergency Pulse */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-96 h-32 bg-amber-500/10 blur-[100px] pointer-events-none rounded-full" />

        <div className="relative z-10 max-w-lg w-full bg-[#080a10] border border-amber-500/30 rounded-3xl p-8 sm:p-10 shadow-2xl space-y-6">
          <div className="flex items-center justify-between pb-4 border-b border-white/10">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-2xl bg-amber-500/20 border border-amber-500/40 flex items-center justify-center text-amber-400 shadow-[0_0_20px_rgba(251,191,36,0.3)]">
                <AlertTriangle className="w-5 h-5 animate-pulse" />
              </div>
              <div>
                <h1 className="font-display font-black text-lg text-white tracking-wider uppercase">
                  Protocol Omega Active
                </h1>
                <p className="text-[10px] text-amber-400/80 font-mono tracking-widest">
                  PLATFORM CORE UNDER SOVEREIGN UPGRADE
                </p>
              </div>
            </div>
            <span className="px-2.5 py-1 rounded-full bg-amber-500/10 border border-amber-500/30 text-amber-300 text-[10px] font-bold">
              FREEZE ENGAGED
            </span>
          </div>

          <div className="space-y-3 text-xs text-neutral-300 leading-relaxed font-mono">
            <p>
              The Zenvitra platform has been temporarily placed under maintenance mode by executive directive.
            </p>
            <p className="text-[11px] text-neutral-400">
              During this lockdown window, database state updates, registrations, and transactions are paused to ensure zero data corruption during critical core deployment.
            </p>
          </div>

          {/* Status Matrix */}
          <div className="p-4 rounded-2xl bg-black/60 border border-white/10 space-y-2 text-[11px] font-mono">
            <div className="flex items-center justify-between">
              <span className="text-neutral-500">SYSTEM STATUS:</span>
              <span className="text-amber-400 font-bold">MUTED / READ-ONLY</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-neutral-500">INTEGRITY AUDIT:</span>
              <span className="text-emerald-400 font-bold">100% UNCOMPROMISED</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-neutral-500">DIRECTIVE AUTHORITY:</span>
              <span className="text-neutral-300">FOUNDER OFFICE (@yuveer)</span>
            </div>
          </div>

          {/* Action Footer */}
          <div className="pt-2 flex flex-col gap-2.5">
            <button
              type="button"
              onClick={() => setShowUnlockModal(true)}
              className="w-full py-3 rounded-xl bg-amber-500 hover:bg-amber-400 text-black font-display font-bold text-xs uppercase tracking-wider transition flex items-center justify-center gap-2 cursor-pointer shadow-[0_0_20px_rgba(251,191,36,0.3)]"
            >
              <KeyRound className="w-3.5 h-3.5" />
              <span>Founder / Staff Bypass Authentication</span>
            </button>

            <button
              type="button"
              onClick={() => window.location.reload()}
              className="w-full py-2.5 rounded-xl bg-white/[0.04] hover:bg-white/[0.08] border border-white/10 text-neutral-400 hover:text-white font-mono text-xs transition cursor-pointer text-center"
            >
              Check System Status
            </button>
          </div>
        </div>

        {/* Inline Unlock Modal */}
        {showUnlockModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
            <form onSubmit={handleUnlockSubmit} className="max-w-md w-full bg-[#0d0f18] border border-amber-500/40 rounded-3xl p-6 space-y-4 shadow-2xl relative">
              <div className="flex items-center justify-between">
                <span className="font-display font-bold text-sm text-amber-400 uppercase tracking-widest flex items-center gap-2">
                  <ShieldCheck className="w-4 h-4" />
                  <span>Sovereign Bypass Authorization</span>
                </span>
                <button
                  type="button"
                  onClick={() => setShowUnlockModal(false)}
                  className="text-neutral-400 hover:text-white transition"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              <p className="text-xs text-neutral-400">
                Enter your Founder Master Key PIN or Administrative Passkey to bypass maintenance mode.
              </p>

              <input
                type="password"
                value={passkeyInput}
                onChange={(e) => setPasskeyInput(e.target.value)}
                placeholder="Enter Passkey / Founder Key"
                autoFocus
                className="w-full px-4 py-3 rounded-xl bg-black border border-white/20 text-center font-mono text-sm text-amber-300 focus:outline-none focus:border-amber-400/60"
              />

              {passkeyError && (
                <p className="text-xs text-rose-400 font-mono text-center">{passkeyError}</p>
              )}
              {unlockSuccess && (
                <p className="text-xs text-emerald-400 font-mono text-center">{unlockSuccess}</p>
              )}

              <button
                type="submit"
                className="w-full py-3 rounded-xl bg-amber-400 hover:bg-amber-300 text-black font-display font-bold text-xs uppercase tracking-wider transition"
              >
                Authenticate &amp; Bypass
              </button>
            </form>
          </div>
        )}
      </div>
    );
  }

  // Normal render or Privileged Immunity render: ALWAYS keep the Fragment structure so children NEVER unmounts!
  return (
    <>
      {maintenanceActive && (isPrivileged || isExemptPath) && (
        <div className="sticky top-0 z-[9999] bg-gradient-to-r from-rose-950 via-amber-950 to-rose-950 border-b border-amber-500/40 text-white font-mono text-[11px] font-bold py-2 px-4 shadow-[0_4px_30px_rgba(251,191,36,0.25)] flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-2.5">
            <span className="flex h-2.5 w-2.5 relative">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-amber-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-amber-500"></span>
            </span>
            <ShieldAlert className="w-4 h-4 text-amber-400 shrink-0" />
            <span className="text-amber-200">
              PROTOCOL OMEGA ACTIVE (PLATFORM IN LOCKDOWN) &bull; You are browsing with Founder/Admin Immunity
            </span>
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={handleTurnOffMaintenance}
              className="px-3.5 py-1 rounded-lg bg-emerald-500/20 hover:bg-emerald-500/30 border border-emerald-500/40 text-emerald-300 transition text-[10px] font-bold cursor-pointer"
            >
              Turn Off Maintenance Mode
            </button>
          </div>
        </div>
      )}
      {children}
    </>
  );
}
