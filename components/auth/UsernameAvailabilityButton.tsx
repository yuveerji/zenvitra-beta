'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { Check, X, Loader2, RefreshCw } from 'lucide-react';
import { sanitizeHandle } from '@/lib/utils';

export type AvailabilityStatus = 'idle' | 'checking' | 'available' | 'unavailable';

interface UsernameAvailabilityButtonProps {
  username: string;
  currentUsername?: string;
  onStatusChange?: (status: AvailabilityStatus, reason?: string) => void;
  className?: string;
  showText?: boolean;
}

export function UsernameAvailabilityButton({
  username,
  currentUsername,
  onStatusChange,
  className = '',
  showText = true,
}: UsernameAvailabilityButtonProps) {
  const [status, setStatus] = useState<AvailabilityStatus>('idle');
  const [reason, setReason] = useState<string | null>(null);
  const [lastCheckedUser, setLastCheckedUser] = useState<string>('');

  const checkAvailability = useCallback(
    async (targetUser: string) => {
      const clean = sanitizeHandle(targetUser);
      const cleanCurrent = sanitizeHandle(currentUsername || '');

      if (!clean || clean.length < 3) {
        setStatus('idle');
        setReason(clean.length > 0 ? 'Minimum 3 characters' : null);
        onStatusChange?.('idle', 'Minimum 3 characters');
        return;
      }

      // If user is editing their profile and hasn't changed their handle
      if (cleanCurrent && clean === cleanCurrent) {
        setStatus('available');
        setReason('Your current handle');
        onStatusChange?.('available', 'Your current handle');
        setLastCheckedUser(clean);
        return;
      }

      setStatus('checking');
      setReason(null);
      onStatusChange?.('checking');

      try {
        const res = await fetch(
          `/api/auth/check-username?username=${encodeURIComponent(clean)}&current=${encodeURIComponent(cleanCurrent)}`,
          { cache: 'no-store' }
        );
        const data = await res.json();

        setLastCheckedUser(clean);
        if (data.available) {
          setStatus('available');
          setReason(data.reason || 'Handle is available!');
          onStatusChange?.('available', data.reason);
        } else {
          setStatus('unavailable');
          setReason(data.reason || 'Handle is taken or reserved.');
          onStatusChange?.('unavailable', data.reason);
        }
      } catch (err: any) {
        // Fallback check against reserved handles
        const RESERVED = ['yuveer', 'founder', 'zenvitra', 'admin', 'system', 'root'];
        if (RESERVED.includes(clean)) {
          setStatus('unavailable');
          setReason('Namespace is reserved by protocols.');
          onStatusChange?.('unavailable', 'Namespace is reserved');
        } else {
          setStatus('available');
          setReason('Handle is available!');
          onStatusChange?.('available');
        }
      }
    },
    [onStatusChange]
  );

  // Debounced auto-check when username changes
  useEffect(() => {
    const clean = sanitizeHandle(username);
    if (!clean) {
      setStatus('idle');
      setReason(null);
      onStatusChange?.('idle');
      return;
    }

    if (clean === lastCheckedUser && status !== 'idle') {
      return;
    }

    const timer = setTimeout(() => {
      checkAvailability(clean);
    }, 450);

    return () => clearTimeout(timer);
  }, [username, checkAvailability, lastCheckedUser, status, onStatusChange]);

  const handleManualClick = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    checkAvailability(username);
  };

  return (
    <div className={`inline-flex items-center gap-1.5 ${className}`}>
      <button
        type="button"
        onClick={handleManualClick}
        disabled={status === 'checking' || !username.trim()}
        title={
          status === 'available'
            ? 'Username handle is available! (Click to re-check)'
            : status === 'unavailable'
            ? reason || 'Username handle is taken (Click to re-check)'
            : 'Check if this @handle is available'
        }
        className={`relative flex items-center justify-center gap-1.5 px-2.5 py-1.5 rounded-xl font-mono text-xs transition-all cursor-pointer select-none border ${
          status === 'checking'
            ? 'bg-amber-500/10 border-amber-500/30 text-amber-300'
            : status === 'available'
            ? 'bg-emerald-500/15 border-emerald-500/40 text-emerald-400 shadow-[0_0_12px_rgba(16,185,129,0.25)] hover:bg-emerald-500/25'
            : status === 'unavailable'
            ? 'bg-rose-500/15 border-rose-500/40 text-rose-400 shadow-[0_0_12px_rgba(244,63,94,0.25)] hover:bg-rose-500/25'
            : 'bg-white/5 border-white/10 text-neutral-400 hover:text-white hover:bg-white/10 hover:border-white/20'
        } ${!username.trim() ? 'opacity-40 cursor-not-allowed' : ''}`}
      >
        {status === 'checking' && (
          <>
            <Loader2 className="w-3.5 h-3.5 animate-spin text-amber-400" />
            {showText && <span className="text-[10px] uppercase tracking-wider">Checking</span>}
          </>
        )}

        {status === 'available' && (
          <>
            <Check className="w-4 h-4 text-emerald-400 stroke-[3]" />
            {showText && (
              <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-300">
                Available
              </span>
            )}
          </>
        )}

        {status === 'unavailable' && (
          <>
            <X className="w-4 h-4 text-rose-400 stroke-[3]" />
            {showText && (
              <span className="text-[10px] font-bold uppercase tracking-wider text-rose-300">
                Taken
              </span>
            )}
          </>
        )}

        {status === 'idle' && (
          <>
            <RefreshCw className="w-3 h-3 text-neutral-400" />
            {showText && <span className="text-[10px] uppercase tracking-wider">Check</span>}
          </>
        )}
      </button>

      {/* Floating explanatory caption if taken */}
      {status === 'unavailable' && reason && (
        <span className="text-[10px] font-mono text-rose-400 animate-fadeIn hidden sm:inline">
          {reason}
        </span>
      )}
    </div>
  );
}

export default UsernameAvailabilityButton;
