'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { ArrowLeft, Sparkles, RefreshCw } from 'lucide-react';
import { 
  activateFounderSession, 
  isFounderSessionActive, 
  verifyFounderKey,
  isYuveer
} from '@/lib/founderControl';
import { useAuth } from '@/context/AuthContext';
import { useZenPulse } from '@/context/ZenPulsePlatformContext';

export function FounderClearanceGate({ children }: { children: React.ReactNode }) {
  const { user, profile } = useAuth();
  const { currentUserUsername } = useZenPulse();
  const [isAuthorized, setIsAuthorized] = useState<boolean>(false);
  const [isChecking, setIsChecking] = useState<boolean>(true);

  useEffect(() => {
    // 1. Check URL parameters for secret one-click founder master key authentication ONLY
    if (typeof window !== 'undefined') {
      try {
        const urlParams = new URLSearchParams(window.location.search);
        const secretKey = urlParams.get('auth') || urlParams.get('key') || urlParams.get('access_key') || urlParams.get('token');
        if (secretKey) {
          const isF = verifyFounderKey(secretKey);
          if (isF) {
            activateFounderSession(secretKey);
            setIsAuthorized(true);
            setIsChecking(false);
            const cleanUrl = window.location.pathname + window.location.hash;
            window.history.replaceState(null, '', cleanUrl);
            return;
          }
          // Note: Admin keys are strictly rejected here. /zen-vault-root is exclusively for @yuveer.
        }
      } catch (_) {}
    }

    // 2. Strict ID verification: Only @yuveer is authorized for zen-vault-root (no one else)
    const usernameCandidates = [
      currentUserUsername,
      profile?.username,
      (profile as any)?.handle,
      user?.user_metadata?.username,
      user?.user_metadata?.user_name,
      user?.email?.split('@')[0],
      (user as any)?.preferred_username,
      typeof window !== 'undefined' ? localStorage.getItem('zenvitra_session_user') : null,
    ].filter(Boolean) as string[];

    const isAuthorizedYuveer = usernameCandidates.some((cand) => isYuveer(cand));
    const hasFounderMasterSession = isFounderSessionActive();

    if (isAuthorizedYuveer || hasFounderMasterSession) {
      setIsAuthorized(true);
    } else {
      setIsAuthorized(false);
    }

    setIsChecking(false);
  }, [user, profile, currentUserUsername]);

  if (isChecking) {
    return (
      <div className="min-h-screen bg-[#030405] text-neutral-500 font-mono text-xs flex items-center justify-center">
        <RefreshCw className="w-4 h-4 animate-spin mr-2" />
        <span>AUTHENTICATING LEVEL 0 ROOT CLEARANCE...</span>
      </div>
    );
  }

  // If authenticated strictly as @yuveer or with Founder Master Key, grant access to the vault
  if (isAuthorized) {
    return <div className="min-h-screen w-full">{children}</div>;
  }

  // For any normal person / unauthorized visitor / admin: RENDER 404 NOT FOUND ERROR
  return (
    <div className="min-h-screen bg-[#030405] text-white flex flex-col items-center justify-center p-6 text-center select-none font-sans">
      <div className="w-16 h-16 rounded-3xl bg-white/[0.04] border border-white/10 flex items-center justify-center mb-6 shadow-2xl">
        <Sparkles className="w-8 h-8 text-neutral-400" />
      </div>
      <span className="font-mono text-xs text-neutral-500 tracking-widest uppercase mb-2">
        Error 404 // Dimension Not Found
      </span>
      <h1 className="font-display font-medium text-4xl sm:text-5xl text-white mb-4">
        Transmission Severed
      </h1>
      <p className="max-w-md text-sm text-neutral-400 font-sans mb-8">
        The requested coordinate does not exist or has been relocated within the Zenvitra protocol mesh.
      </p>
      <Link
        href="/"
        className="px-6 py-3 rounded-2xl bg-white text-black font-mono text-xs font-bold hover:bg-neutral-200 transition flex items-center gap-2 shadow-lg cursor-pointer"
      >
        <ArrowLeft className="w-4 h-4" />
        <span>Return to Platform Genesis</span>
      </Link>
    </div>
  );
}
