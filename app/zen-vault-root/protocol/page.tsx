'use client';

import React, { useState, useEffect } from 'react';
import { 
  Sliders, 
  ShieldAlert, 
  Radio, 
  Power, 
  Activity, 
  Save, 
  RefreshCw, 
  CheckCircle2, 
  AlertTriangle,
  Lock,
  Crown
} from 'lucide-react';
import { 
  getProtocolControls, 
  saveProtocolControls, 
  ProtocolControls,
  DEFAULT_PROTOCOL_CONTROLS,
  isFounder,
  isFounderSessionActive
} from '@/lib/founderControl';
import { useAuth } from '@/context/AuthContext';
import { useZenPulse } from '@/context/ZenPulsePlatformContext';
import Link from 'next/link';

export default function ProtocolMatrixPage() {
  const { user, profile } = useAuth();
  const { currentUserUsername } = useZenPulse();
  const [controls, setControls] = useState<ProtocolControls>(DEFAULT_PROTOCOL_CONTROLS);
  const [feedback, setFeedback] = useState<string | null>(null);

  const effectiveUser = (currentUserUsername || user?.email?.split('@')[0] || profile?.username || '').toLowerCase().trim().replace(/^@/, '');
  const userRole = (profile?.role as any) || (profile as any)?.badge;
  const isFounderUser = isFounder(effectiveUser, userRole) || isFounderSessionActive();

  useEffect(() => {
    setControls(getProtocolControls());
  }, []);

  const handleToggle = (key: keyof ProtocolControls) => {
    if (!isFounderUser) return;
    const updated = { ...controls, [key]: !controls[key] };
    setControls(updated);
    saveProtocolControls(updated);
    setFeedback(`Protocol circuit "${key}" toggled to ${updated[key] ? 'ENABLED' : 'OFF'}`);
    setTimeout(() => setFeedback(null), 3500);
  };

  const handleEmergencyProtocolOmega = () => {
    if (!isFounderUser) return;
    const updated = { ...controls, maintenanceMode: !controls.maintenanceMode };
    setControls(updated);
    saveProtocolControls(updated);
    setFeedback(`🚨 PROTOCOL OMEGA ${updated.maintenanceMode ? 'ENGAGED &bull; PLATFORM IN LOCKDOWN' : 'DISENGAGED &bull; PLATFORM ONLINE'}`);
    setTimeout(() => setFeedback(null), 4000);
  };

  // If a non-founder accesses this page, render restricted banner
  if (!isFounderUser) {
    return (
      <div className="p-8 sm:p-12 rounded-3xl bg-[#080a10] border border-rose-500/40 text-center space-y-5 font-mono">
        <div className="w-16 h-16 rounded-3xl bg-rose-500/10 border border-rose-500/30 text-rose-400 mx-auto flex items-center justify-center shadow-[0_0_30px_rgba(244,63,94,0.3)]">
          <Lock className="w-8 h-8" />
        </div>
        <div className="space-y-1">
          <span className="text-[10px] text-rose-400 uppercase font-bold tracking-widest block">
            LEVEL 0 FOUNDER SOVEREIGN CLEARANCE REQUIRED
          </span>
          <h2 className="text-2xl font-bold text-white uppercase tracking-wide">
            Protocol Omega &amp; Killswitches Restricted
          </h2>
        </div>
        <p className="text-xs text-neutral-400 max-w-md mx-auto font-sans leading-relaxed">
          Staff Administrators have operational permissions across users, content, and logs. Protocol Omega (Platform Maintenance Lockout) and core cryptographic killswitches can only be operated by Founder @yuveer.
        </p>
        <Link
          href="/zen-vault-root"
          className="inline-flex items-center gap-2 px-6 py-3 rounded-2xl bg-cyan-500/20 hover:bg-cyan-500/30 border border-cyan-500/40 text-cyan-300 font-bold text-xs transition"
        >
          Return to Operations Console
        </Link>
      </div>
    );
  }

  return (
    <div className="space-y-8 font-mono text-left">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-rose-500/30">
        <div className="space-y-1">
          <div className="inline-flex items-center gap-2 px-3 py-0.5 rounded-full bg-rose-500/10 border border-rose-500/30 text-rose-300 text-[10px] font-bold">
            <Crown className="w-3.5 h-3.5 text-amber-400 fill-amber-400" />
            <span>EXECUTIVE CITADEL MATRIX // FOUNDER LEVEL 0</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-bold text-white uppercase tracking-wide">
            Protocol Omega &amp; Citadel Controls
          </h1>
          <p className="text-xs text-neutral-400">
            Real-time platform emergency lockouts, network killswitches, and zero-trust protocol toggles.
          </p>
        </div>

        <div className="flex items-center gap-2 text-xs">
          <span className="px-3 py-1.5 rounded-xl bg-rose-500/20 text-rose-300 border border-rose-500/40 font-bold">
            CITADEL ENGINE: LIVE
          </span>
        </div>
      </div>

      {feedback && (
        <div className="p-4 rounded-2xl bg-amber-500/15 border border-amber-500/30 text-amber-300 text-xs flex items-center gap-2.5 shadow-lg">
          <CheckCircle2 className="w-4 h-4 text-amber-400 shrink-0" />
          <span>{feedback}</span>
        </div>
      )}

      {/* Protocol Omega Hero Lockout Banner */}
      <div className={`p-6 sm:p-8 rounded-3xl border transition shadow-2xl space-y-5 ${
        controls.maintenanceMode
          ? 'bg-gradient-to-r from-rose-950/80 via-black to-red-950/80 border-rose-500 shadow-[0_0_50px_rgba(244,63,94,0.3)] animate-pulse'
          : 'bg-black border-white/10'
      }`}>
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <span className={`w-3 h-3 rounded-full ${controls.maintenanceMode ? 'bg-rose-500 animate-ping' : 'bg-emerald-400'}`} />
              <span className="text-xs font-bold uppercase tracking-wider text-white">
                🚨 PROTOCOL OMEGA &bull; CITADEL MAINTENANCE LOCKOUT
              </span>
            </div>
            <p className="text-xs text-neutral-300 max-w-xl font-sans leading-relaxed">
              When engaged, public delegates and regular users across all browsers and devices are immediately locked out and redirected to the Maintenance On screen. Only Founder (@yuveer) and authorized Admins retain immunity.
            </p>
          </div>

          <button
            type="button"
            onClick={handleEmergencyProtocolOmega}
            className={`px-8 py-4 rounded-2xl font-black text-xs transition uppercase tracking-widest cursor-pointer shadow-xl flex items-center gap-2 shrink-0 ${
              controls.maintenanceMode
                ? 'bg-emerald-500 hover:bg-emerald-400 text-black shadow-[0_0_30px_rgba(52,211,153,0.5)]'
                : 'bg-rose-600 hover:bg-rose-500 text-white shadow-[0_0_30px_rgba(244,63,94,0.5)]'
            }`}
          >
            <Power className="w-4 h-4" />
            <span>{controls.maintenanceMode ? 'DISENGAGE PROTOCOL OMEGA' : 'ENGAGE PROTOCOL OMEGA'}</span>
          </button>
        </div>
      </div>

      {/* Circuit Switches */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {[
          { key: 'registrationsOpen', label: 'Delegate Identity Registration', desc: 'Permit new node and delegate creations' },
          { key: 'chatMeshEnabled', label: 'Real-Time Chat & Plenary Relays', desc: 'Enable socket streaming and active chambers' },
          { key: 'fluxReelsEnabled', label: 'Flux Reels & Multimedia Engine', desc: 'Enable video feeds, reels, and stories' },
          { key: 'assemblyOsEnabled', label: 'Assembly OS Voting & Resolutions', desc: 'Allow binding constitutional voting rounds' },
          { key: 'escrowMandateActive', label: '25% Constitutional Escrow Enforcement', desc: 'Enforce non-custodial treasury locking' },
          { key: 'zeroSurveillanceActive', label: 'Zero-Surveillance Cryptographic Shredder', desc: 'Enable automatic log burning post-session' },
        ].map((circuit) => {
          const isEnabled = controls[circuit.key as keyof ProtocolControls];
          return (
            <div key={circuit.key} className="p-5 rounded-2xl bg-black border border-white/10 space-y-3 flex flex-col justify-between">
              <div className="space-y-1">
                <div className="flex items-center justify-between">
                  <span className="text-white font-bold text-xs">{circuit.label}</span>
                  <span className={`text-[10px] font-bold px-2 py-0.5 rounded ${
                    isEnabled ? 'bg-emerald-500/20 text-emerald-300' : 'bg-rose-500/20 text-rose-300'
                  }`}>
                    {isEnabled ? 'ACTIVE' : 'DISABLED'}
                  </span>
                </div>
                <p className="text-[11px] text-neutral-400 font-sans">{circuit.desc}</p>
              </div>

              <button
                type="button"
                onClick={() => handleToggle(circuit.key as keyof ProtocolControls)}
                className={`w-full py-2.5 rounded-xl font-bold transition text-xs cursor-pointer flex items-center justify-center gap-2 ${
                  isEnabled
                    ? 'bg-rose-500/10 hover:bg-rose-500/20 text-rose-300 border border-rose-500/30'
                    : 'bg-emerald-500/20 hover:bg-emerald-500/30 text-emerald-300 border border-emerald-500/40'
                }`}
              >
                <Power className="w-3.5 h-3.5" />
                <span>{isEnabled ? 'Shut Down Circuit' : 'Activate Circuit'}</span>
              </button>
            </div>
          );
        })}
      </div>
    </div>
  );
}
