'use client';

import React, { useState, useEffect, useCallback } from 'react';
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
  isPrivilegedAccount,
  activateFounderSession, 
  isFounderSessionActive,
  activateAdminSession,
  isAdminSessionActive,
  verifyFounderKey,
  verifyAdminKey,
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
  const [bypassWarning, setBypassWarning] = useState<string | null>(null);

  /* Inline Unlock Form for Founder / Admin */
  const [showUnlockModal, setShowUnlockModal] = useState<boolean>(false);
  const [passkeyInput, setPasskeyInput] = useState<string>('');
  const [passkeyError, setPasskeyError] = useState<string | null>(null);
  const [unlockSuccess, setUnlockSuccess] = useState<string | null>(null);

  /**
   * Helper: Determines if the currently active/authenticated account identity
   * belongs to the verified Founder, Co-Founder, Admin, or Core Team roster.
   * Normal user IDs (e.g. delegates, students, guests) evaluate strictly to false.
   */
  const checkPrivilegedIdentity = useCallback((): boolean => {
    const effectiveUsername = (profile?.username || user?.email?.split('@')[0] || '').toLowerCase().trim().replace(/^@/, '');
    const effectiveEmail = (user?.email || profile?.email || '').toLowerCase().trim();
    const effectiveRole = ((profile?.role as any) || (profile as any)?.badge || '').toString().toUpperCase().trim();
    const effectiveId = (user?.id || profile?.id || '').toString();

    if (effectiveUsername || effectiveEmail || effectiveRole) {
      return (
        isPrivilegedAccount(effectiveUsername, effectiveRole, effectiveId) ||
        isPrivilegedAccount(effectiveEmail, effectiveRole, effectiveId)
      );
    }

    if (typeof window !== 'undefined') {
      try {
        const stored = localStorage.getItem('zenvitra_session_user') || localStorage.getItem('zenvitra_pulse_user_v6');
        if (stored) {
          const parsed = JSON.parse(stored);
          const handle = (parsed?.username || parsed?.handle || '').toLowerCase().trim().replace(/^@/, '');
          const email = (parsed?.email || '').toLowerCase().trim();
          const r = (parsed?.role || '').toUpperCase().trim();
          const id = (parsed?.id || '').toString();

          return (
            isPrivilegedAccount(handle, r, id) ||
            isPrivilegedAccount(email, r, id)
          );
        }
      } catch (_) {}
    }

    return false;
  }, [user?.email, user?.id, profile?.username, profile?.email, profile?.role, profile?.id]);

  /**
   * Double-Lock Verification:
   * To bypass maintenance mode, BOTH conditions must be satisfied:
   * 1. Identity Lock: Must be an authenticated Founder, Co-Founder, or Admin/Core Team account.
   * 2. Key Lock: Must have an active founder/admin session or valid clearance passkey.
   *
   * A normal ID person CANNOT bypass maintenance even if given an access link.
   */
  const checkPrivilege = useCallback((): boolean => {
    const isIdentityPrivileged = checkPrivilegedIdentity();

    if (!isIdentityPrivileged) {
      // Normal ID or unauthenticated account: purge any rogue bypass tokens
      if (typeof window !== 'undefined') {
        localStorage.removeItem('zenvitra_founder_active_session');
        localStorage.removeItem('zenvitra_admin_active_session');
        localStorage.removeItem('zenvitra_admin_override_token');
        localStorage.removeItem('zenvitra_founder_master_key');
        localStorage.removeItem('zenvitra_founder_override');
        localStorage.removeItem('zenvitra_vault_authenticated');
        sessionStorage.removeItem('zenvitra_vault_authenticated');
      }
      return false;
    }

    const effectiveUser = (user?.email?.split('@')[0] || profile?.username || '').toLowerCase().trim().replace(/^@/, '');
    const userRole = (profile?.role as any) || (profile as any)?.badge;
    const isF = isFounder(effectiveUser, userRole) || isFounderSessionActive();
    const isA = isAdmin(effectiveUser, userRole) || isAdminSessionActive();
    return isF || isA;
  }, [checkPrivilegedIdentity, user?.email, profile?.username, profile?.role]);

  useEffect(() => {
    setMounted(true);

    // Auto-detect and authenticate shared Admin / Founder Bypass Links (?access_key=... or ?bypass_key=...)
    if (typeof window !== 'undefined') {
      try {
        const urlParams = new URLSearchParams(window.location.search);
        const accessKey = urlParams.get('access_key') || urlParams.get('bypass_key') || urlParams.get('admin_key') || urlParams.get('auth') || urlParams.get('key');
        if (accessKey) {
          const isIdentityPrivileged = checkPrivilegedIdentity();

          if (!isIdentityPrivileged) {
            // STRICT SECURITY LAW: A normal ID person who gets an access link STILL gets the maintenance gate page!
            setIsPrivileged(false);
            setBypassWarning('Bypass link rejected: This access link is restricted strictly to verified Admin & Founder personnel. Your account does not have maintenance immunity.');

            // Strip the access key from URL so it does not linger
            const cleanUrl = window.location.pathname + window.location.hash;
            window.history.replaceState(null, '', cleanUrl);
          } else {
            // An Admin or Founder got the access ID link!
            const activated = activateAdminSession(accessKey) || activateFounderSession(accessKey);
            if (activated) {
              setIsPrivileged(true);
              setBypassWarning(null);
              // Clean URL query without page reload
              const cleanUrl = window.location.pathname + window.location.hash;
              window.history.replaceState(null, '', cleanUrl);
            }
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
          // Update local mirror only if value changed to avoid redundant event loops
          if (typeof window !== 'undefined' && data) {
            const currentLocal = getProtocolControls();
            if (JSON.stringify(currentLocal) !== JSON.stringify({ ...currentLocal, ...data })) {
              localStorage.setItem('zenvitra_protocol_controls_v1', JSON.stringify({ ...currentLocal, ...data }));
            }
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

    // Relaxed 5-minute heartbeat only when tab is visible
    const interval = setInterval(() => {
      if (typeof document !== 'undefined' && document.visibilityState === 'visible') {
        syncServerProtocols().catch(() => {});
      }
    }, 5 * 60 * 1000);

    let syncTimeout: any = null;
    const debouncedSync = () => {
      if (syncTimeout) clearTimeout(syncTimeout);
      syncTimeout = setTimeout(() => {
        syncServerProtocols().catch(() => {});
      }, 1000);
    };

    const onStorage = (e: StorageEvent) => {
      // Only sync if related to protocol or founder credentials changed from another window
      if (e.key && (e.key === 'zenvitra_protocol_controls_v1' || e.key.includes('founder') || e.key.includes('vault'))) {
        debouncedSync();
      }
    };

    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.shiftKey && (e.key === 'F' || e.key === 'A' || e.key === 'M')) {
        e.preventDefault();
        setShowUnlockModal((prev) => !prev);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('storage', onStorage);
    window.addEventListener('zenvitra_protocol_update', debouncedSync);

    return () => {
      clearInterval(interval);
      if (syncTimeout) clearTimeout(syncTimeout);
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('storage', onStorage);
      window.removeEventListener('zenvitra_protocol_update', debouncedSync);
    };
  }, [user?.id, profile?.username, profile?.role, checkPrivilegedIdentity, checkPrivilege]);

  const handleUnlockSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!passkeyInput.trim()) return;

    const cleanKey = passkeyInput.trim().toUpperCase();
    const isFKey = verifyFounderKey(cleanKey);
    const isAKey = verifyAdminKey(cleanKey);

    if (!isFKey && !isAKey) {
      setPasskeyError('Invalid authorization code.');
      return;
    }

    const isIdentityPrivileged = checkPrivilegedIdentity();
    const hasNormalLoggedInAccount = Boolean(
      (profile?.username || user?.email) && !isIdentityPrivileged
    );

    // If an active session belongs to a normal user, block bypass attempt:
    if (hasNormalLoggedInAccount) {
      setPasskeyError('Access Denied: Logged-in account does not have Admin or Founder clearance. Normal user accounts cannot bypass maintenance mode.');
      return;
    }

    // If not logged in as admin/founder, general admin bypass keys cannot be used anonymously
    if (!isIdentityPrivileged && !isFKey) {
      setPasskeyError('Access Denied: Admin bypass keys require an authorized Admin or Core Team account identity.');
      return;
    }

    const success = activateFounderSession(cleanKey) || activateAdminSession(cleanKey);
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
      setPasskeyError('Unable to activate bypass clearance for this account.');
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
    pathname.startsWith('/login') ||
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
                  System Maintenance Active
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

          {bypassWarning && (
            <div className="p-4 rounded-2xl bg-rose-500/10 border border-rose-500/30 text-rose-300 text-xs font-mono space-y-1.5 animate-in fade-in slide-in-from-top-2 duration-300">
              <div className="flex items-center gap-2 font-bold text-rose-400">
                <AlertTriangle className="w-4 h-4 shrink-0" />
                <span>ACCESS LINK RESTRICTED</span>
              </div>
              <p className="text-[11px] leading-relaxed text-rose-300/90">
                {bypassWarning}
              </p>
            </div>
          )}

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
              <span className="text-neutral-300">FOUNDER OFFICE (@founder)</span>
            </div>
          </div>

          {/* Action Footer */}
          <div className="pt-2 flex flex-col gap-2.5">
            

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
              SYSTEM MAINTENANCE ACTIVE (PLATFORM IN LOCKDOWN) &bull; You are browsing with Founder/Admin Immunity
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
