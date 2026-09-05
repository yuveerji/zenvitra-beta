'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { 
  Lock, 
  Calendar, 
  ShieldAlert, 
  Sparkles, 
  ArrowRight, 
  Crown, 
  Users, 
  Check, 
  CheckCircle2, 
  Radio, 
  Layers,
  Building
} from 'lucide-react';
import { useAccountCapabilities } from '@/hooks/useAccountCapabilities';
import { useAuth } from '@/context/AuthContext';
import { isFounder, isAdmin } from '@/lib/founderControl';

interface EventAccessGateProps {
  onUnlock?: () => void;
}

export function EventAccessGate({ onUnlock }: EventAccessGateProps) {
  const { profile } = useAuth();
  const isPrivilegedTester = React.useMemo(() => {
    const userIdentifier = profile?.username || profile?.email || '';
    return isFounder(userIdentifier, profile?.role) || isAdmin(userIdentifier, profile?.role);
  }, [profile]);
  const { enableEventAccount, enableProfessionalAccount } = useAccountCapabilities();
  const [activating, setActivating] = useState(false);
  const [justActivated, setJustActivated] = useState(false);

  const handleActivate = (type: 'event' | 'pro') => {
    setActivating(true);
    setTimeout(() => {
      if (type === 'event') {
        enableEventAccount();
      } else {
        enableProfessionalAccount();
      }
      setJustActivated(true);
      setActivating(false);
      if (onUnlock) onUnlock();
    }, 600);
  };

  return (
    <div className="min-h-[75vh] flex items-center justify-center p-4 sm:p-6 font-sans">
      <div className="w-full max-w-2xl rounded-3xl bg-[#08090f] border border-rose-500/30 p-6 sm:p-10 text-center space-y-8 relative overflow-hidden shadow-[0_25px_90px_rgba(0,0,0,0.9)] backdrop-blur-2xl">
        
        {/* Background glow effects */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-96 h-48 bg-rose-500/10 blur-[100px] pointer-events-none rounded-full" />
        <div className="absolute bottom-0 right-0 w-64 h-64 bg-cyan-500/10 blur-[100px] pointer-events-none rounded-full" />

        {/* Top Header Badge */}
        <div className="space-y-4 relative z-10">
          <div className="w-16 h-16 rounded-2xl bg-rose-500/10 border border-rose-500/30 flex items-center justify-center text-rose-400 mx-auto shadow-[0_0_30px_rgba(244,63,94,0.25)]">
            <Lock className="w-8 h-8 animate-pulse" />
          </div>

          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-rose-500/10 border border-rose-500/25 text-rose-300 text-[11px] font-mono tracking-wider uppercase">
            <ShieldAlert className="w-3.5 h-3.5 text-rose-400" />
            <span>ACCREDITED EVENT ORGANIZERS ONLY</span>
          </div>

          <h2 className="text-2xl sm:text-4xl font-display font-bold text-white tracking-tight">
            Event Chamber Access Restricted
          </h2>

          <p className="text-xs sm:text-sm text-neutral-400 max-w-lg mx-auto leading-relaxed">
            The <span className="text-white font-semibold">ZEN.EVENTS</span> dais, summit coordination tools, and the <span className="text-white font-semibold text-cyan-300">100% FREE ZEN.MUN Operating System</span> are accessible to verified Event Organizers, MUN Secretariats, and student delegations with zero software fees.
          </p>
        </div>

        {/* Capability Preview Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-left relative z-10">
          <div className="p-3.5 rounded-2xl bg-white/[0.02] border border-white/10 space-y-1.5">
            <div className="w-7 h-7 rounded-lg bg-cyan-500/20 text-cyan-300 flex items-center justify-center">
              <Crown className="w-4 h-4" />
            </div>
            <h4 className="text-xs font-mono font-bold text-white">ZEN.MUN Matrix</h4>
            <p className="text-[11px] text-neutral-400 leading-snug">
              Country allocation, Executive Board GSL clock &amp; digital chits.
            </p>
          </div>

          <div className="p-3.5 rounded-2xl bg-white/[0.02] border border-white/10 space-y-1.5">
            <div className="w-7 h-7 rounded-lg bg-purple-500/20 text-purple-300 flex items-center justify-center">
              <Users className="w-4 h-4" />
            </div>
            <h4 className="text-xs font-mono font-bold text-white">Delegate Suite</h4>
            <p className="text-[11px] text-neutral-400 leading-snug">
              Multi-council roster, QR check-in &amp; holographic ZenPass.
            </p>
          </div>

          <div className="p-3.5 rounded-2xl bg-white/[0.02] border border-white/10 space-y-1.5">
            <div className="w-7 h-7 rounded-lg bg-amber-500/20 text-amber-300 flex items-center justify-center">
              <Calendar className="w-4 h-4" />
            </div>
            <h4 className="text-xs font-mono font-bold text-white">Summit Agendas</h4>
            <p className="text-[11px] text-neutral-400 leading-snug">
              Live broadcast alerts, attendance telemetry &amp; automated awards.
            </p>
          </div>
        </div>

        {/* Action Controls */}
        <div className="pt-2 border-t border-white/10 space-y-3 relative z-10">
          <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
            {isPrivilegedTester ? (
              <>
                <button
                  type="button"
                  disabled={activating}
                  onClick={() => handleActivate('event')}
                  className="w-full sm:w-auto px-7 py-3 rounded-2xl bg-rose-500 hover:bg-rose-400 text-white font-mono text-xs font-bold transition flex items-center justify-center gap-2 cursor-pointer shadow-[0_0_25px_rgba(244,63,94,0.4)] disabled:opacity-50"
                >
                  <Sparkles className="w-4 h-4" />
                  <span>{activating ? 'Unlocking...' : '⚡ Founder Override: Unlock Chamber (Test)'}</span>
                </button>

                <button
                  type="button"
                  disabled={activating}
                  onClick={() => handleActivate('pro')}
                  className="w-full sm:w-auto px-5 py-3 rounded-2xl bg-purple-500/20 hover:bg-purple-500/30 text-purple-300 border border-purple-500/40 font-mono text-xs font-semibold transition flex items-center justify-center gap-2 cursor-pointer"
                >
                  <Building className="w-4 h-4" />
                  <span>⚡ Enable as Org (Test)</span>
                </button>
              </>
            ) : (
              <a
                href="mailto:secretariat@zenvitra.xyz?subject=Event%20Secretariat%20Access%20Request"
                className="w-full sm:w-auto px-8 py-3.5 rounded-2xl bg-rose-500 hover:bg-rose-400 text-white font-mono text-xs font-bold transition flex items-center justify-center gap-2 cursor-pointer shadow-[0_0_25px_rgba(244,63,94,0.4)]"
              >
                <span>✉️ Request Event Secretariat Accreditation</span>
              </a>
            )}
          </div>

          <div className="flex items-center justify-center gap-4 text-xs font-mono text-neutral-500 pt-2">
            <Link href="/pricing?tab=events" className="hover:text-cyan-400 transition flex items-center gap-1">
              <span>View Event Pro Pricing</span>
              <ArrowRight className="w-3 h-3" />
            </Link>
            <span>•</span>
            <Link href="/pulse" className="hover:text-white transition">
              Return to Pulse
            </Link>
          </div>
        </div>

        {justActivated && (
          <div className="p-3 rounded-xl bg-emerald-500/20 border border-emerald-500/30 text-emerald-300 text-xs font-mono flex items-center justify-center gap-2 animate-in fade-in">
            <CheckCircle2 className="w-4 h-4 text-emerald-400" />
            <span>Event Account successfully enabled! Unlocking chamber...</span>
          </div>
        )}
      </div>
    </div>
  );
}
