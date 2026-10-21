'use client';

import React, { useEffect, useRef, useState } from 'react';
import { 
  AlertTriangle, 
  X, 
  Volume2, 
  VolumeX, 
  Radio, 
  ShieldAlert, 
  Clock, 
  Flame, 
  BellRing,
  ChevronDown,
  ChevronUp
} from 'lucide-react';
import { useMun } from '@/context/MunContext';
import { useAuth } from '@/context/AuthContext';
import { EmergencyBroadcast } from '@/types/mun';

interface ActiveEmergencyBroadcastBannerProps {
  currentCommitteeId?: string;
  allowDismiss?: boolean;
}

export function ActiveEmergencyBroadcastBanner({
  currentCommitteeId,
  allowDismiss = true,
}: ActiveEmergencyBroadcastBannerProps) {
  const { activeBroadcast, dismissBroadcast } = useMun();
  const { user, profile } = useAuth();
  const [isAudioMuted, setIsAudioMuted] = useState(false);
  const [isExpanded, setIsExpanded] = useState(false);
  const hasPlayedAudioRef = useRef<string | null>(null);

  // Play Web Audio synthesizer chime on incoming broadcast if audioAlert is enabled
  useEffect(() => {
    if (!activeBroadcast || !activeBroadcast.audioAlert || isAudioMuted) return;
    if (hasPlayedAudioRef.current === activeBroadcast.id) return;

    try {
      const AudioCtx = window.AudioContext || (window as any).webkitAudioContext;
      if (!AudioCtx) return;
      const ctx = new AudioCtx();

      // Double-beep emergency alert chime (880Hz -> 1046Hz)
      const now = ctx.currentTime;

      // Beep 1
      const osc1 = ctx.createOscillator();
      const gain1 = ctx.createGain();
      osc1.type = 'sine';
      osc1.frequency.setValueAtTime(880, now);
      gain1.gain.setValueAtTime(0.18, now);
      gain1.gain.exponentialRampToValueAtTime(0.001, now + 0.28);
      osc1.connect(gain1);
      gain1.connect(ctx.destination);
      osc1.start(now);
      osc1.stop(now + 0.3);

      // Beep 2
      const osc2 = ctx.createOscillator();
      const gain2 = ctx.createGain();
      osc2.type = 'triangle';
      osc2.frequency.setValueAtTime(1174.66, now + 0.35); // D6
      gain2.gain.setValueAtTime(0.22, now + 0.35);
      gain2.gain.exponentialRampToValueAtTime(0.001, now + 0.7);
      osc2.connect(gain2);
      gain2.connect(ctx.destination);
      osc2.start(now + 0.35);
      osc2.stop(now + 0.72);

      hasPlayedAudioRef.current = activeBroadcast.id;
    } catch (_) {
      // Audio autoplay policy fallback
    }
  }, [activeBroadcast, isAudioMuted]);

  if (!activeBroadcast || !activeBroadcast.isActive) return null;

  // Filter if broadcast targets specific chambers and current committee does not match
  if (
    currentCommitteeId &&
    activeBroadcast.targetScope === 'SPECIFIC_CHAMBERS' &&
    activeBroadcast.targetChambers &&
    !activeBroadcast.targetChambers.includes(currentCommitteeId)
  ) {
    return null;
  }

  const getSeverityTheme = (sev: EmergencyBroadcast['severity']) => {
    switch (sev) {
      case 'CRITICAL':
        return {
          bg: 'bg-red-950/90 border-red-500/70 text-red-200',
          badge: 'bg-red-500 text-white',
          accent: 'text-red-400',
          shadow: 'shadow-[0_10px_35px_rgba(239,68,68,0.25)]',
        };
      case 'CRISIS_INJECTION':
        return {
          bg: 'bg-purple-950/90 border-purple-500/70 text-purple-200',
          badge: 'bg-purple-500 text-white',
          accent: 'text-purple-400',
          shadow: 'shadow-[0_10px_35px_rgba(168,85,247,0.25)]',
        };
      case 'URGENT':
        return {
          bg: 'bg-rose-950/90 border-rose-500/70 text-rose-200',
          badge: 'bg-rose-500 text-white',
          accent: 'text-rose-400',
          shadow: 'shadow-[0_10px_35px_rgba(244,63,94,0.25)]',
        };
      case 'ADVISORY':
      default:
        return {
          bg: 'bg-amber-950/90 border-amber-500/70 text-amber-200',
          badge: 'bg-amber-500 text-black',
          accent: 'text-amber-400',
          shadow: 'shadow-[0_10px_35px_rgba(245,158,11,0.2)]',
        };
    }
  };

  const theme = getSeverityTheme(activeBroadcast.severity);

  return (
    <div className={`w-full border-y sm:border sm:rounded-2xl backdrop-blur-md transition-all duration-300 relative z-50 ${theme.bg} ${theme.shadow} overflow-hidden`}>
      <div className="px-4 py-3 sm:px-6 sm:py-3.5 flex flex-col gap-2">
        <div className="flex items-center justify-between gap-3">
          {/* Severity & Category Badges */}
          <div className="flex items-center gap-2 flex-wrap">
            <span className={`px-2.5 py-0.5 rounded-full font-mono text-[10px] font-extrabold uppercase tracking-wider flex items-center gap-1.5 shadow-sm ${theme.badge}`}>
              <Radio className="w-3 h-3 animate-pulse" />
              <span>{activeBroadcast.severity}</span>
            </span>

            <span className="px-2 py-0.5 rounded-md bg-white/10 border border-white/15 text-[10px] font-mono font-semibold tracking-wider uppercase text-white/90">
              {activeBroadcast.category}
            </span>

            <span className="text-[11px] font-mono text-white/70 hidden sm:inline">
              Scope: {activeBroadcast.targetScope.replace(/_/g, ' ')}
            </span>
          </div>

          {/* Controls */}
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => setIsAudioMuted(!isAudioMuted)}
              className="p-1.5 rounded-lg text-white/70 hover:text-white hover:bg-white/10 transition cursor-pointer"
              title={isAudioMuted ? 'Unmute alert tone' : 'Mute alert tone'}
            >
              {isAudioMuted ? <VolumeX className="w-3.5 h-3.5" /> : <Volume2 className="w-3.5 h-3.5" />}
            </button>

            <button
              type="button"
              onClick={() => setIsExpanded(!isExpanded)}
              className="p-1.5 rounded-lg text-white/70 hover:text-white hover:bg-white/10 transition cursor-pointer text-xs flex items-center gap-1 font-mono"
            >
              <span className="hidden sm:inline">{isExpanded ? 'Collapse' : 'Details'}</span>
              {isExpanded ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
            </button>

            {allowDismiss && (
              <button
                type="button"
                onClick={() => dismissBroadcast(activeBroadcast.id)}
                className="p-1.5 rounded-lg text-white/70 hover:text-white hover:bg-white/10 transition cursor-pointer"
                title="Dismiss Broadcast"
              >
                <X className="w-4 h-4" />
              </button>
            )}
          </div>
        </div>

        {/* Broadcast Title and Directive */}
        <div className="space-y-1">
          <h4 className="text-sm sm:text-base font-bold font-display text-white tracking-wide flex items-center gap-2">
            <AlertTriangle className={`w-4 h-4 shrink-0 ${theme.accent}`} />
            <span>{activeBroadcast.title}</span>
          </h4>

          <p className="text-xs sm:text-sm font-mono leading-relaxed text-white/90">
            {activeBroadcast.message}
          </p>
        </div>

        {/* Detailed Dispatcher Signature (Visible when expanded or on larger screens) */}
        {isExpanded && (
          <div className="pt-2 border-t border-white/10 flex flex-wrap items-center justify-between gap-2 text-[10px] font-mono text-white/60">
            <div className="flex items-center gap-2">
              <span>Authority: <strong>{activeBroadcast.transmitterRole}</strong> ({activeBroadcast.transmitterName})</span>
              {activeBroadcast.transmitterHandle && <span>• @{activeBroadcast.transmitterHandle}</span>}
            </div>
            <div className="flex items-center gap-1.5">
              <Clock className="w-3 h-3" />
              <span>Transmitted {new Date(activeBroadcast.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' })}</span>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
