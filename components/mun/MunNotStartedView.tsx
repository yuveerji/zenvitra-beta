'use client';

import React, { useState, useEffect } from 'react';
import {
  Clock,
  Calendar,
  Shield,
  Building2,
  Play,
  ArrowRight,
  AlertCircle,
  FileCheck2,
  Sparkles,
  Users
} from 'lucide-react';
import { useMun } from '@/context/MunContext';

interface MunNotStartedViewProps {
  onSwitchToActive?: () => void;
}

export function MunNotStartedView({ onSwitchToActive }: MunNotStartedViewProps) {
  const { activeConference, setConferenceStatus, conferences, setActiveConferenceId } = useMun();

  // Target date for countdown (fallback to 7 days from now if not specified)
  const targetTime = activeConference?.conveningDate 
    ? new Date(activeConference.conveningDate).getTime() 
    : Date.now() + 7 * 24 * 60 * 60 * 1000;

  const [timeLeft, setTimeLeft] = useState<{ days: number; hours: number; minutes: number; seconds: number }>({
    days: 6,
    hours: 14,
    minutes: 32,
    seconds: 45
  });

  useEffect(() => {
    const updateCountdown = () => {
      const diff = Math.max(0, targetTime - Date.now());
      const days = Math.floor(diff / (1000 * 60 * 60 * 24));
      const hours = Math.floor((diff / (1000 * 60 * 60)) % 24);
      const minutes = Math.floor((diff / (1000 * 60)) % 60);
      const seconds = Math.floor((diff / 1000) % 60);
      setTimeLeft({ days, hours, minutes, seconds });
    };
    updateCountdown();
    const timer = setInterval(updateCountdown, 1000);
    return () => clearInterval(timer);
  }, [targetTime]);

  const liveConference = conferences.find((c) => c.status !== 'NOT_STARTED' && c.id !== activeConference?.id);

  return (
    <div className="w-full max-w-4xl mx-auto py-12 px-4 text-center space-y-8 animate-fade-in">
      
      {/* Top Banner */}
      <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-amber-500/10 border border-amber-500/30 text-amber-300 font-mono text-xs font-bold uppercase tracking-wider">
        <Clock className="w-3.5 h-3.5 text-amber-400 animate-pulse" />
        <span>CONVENING IN PRE-SESSION STAGE</span>
      </div>

      {/* Main Headline */}
      <div className="space-y-3">
        <h1 className="text-3xl sm:text-5xl font-black font-display tracking-tight text-white">
          MUN Has Not Started Yet!
        </h1>
        <p className="text-sm sm:text-lg text-neutral-400 max-w-2xl mx-auto font-sans leading-relaxed">
          <span className="text-white font-semibold">{activeConference?.name || 'This Conference'}</span> is scheduled for next week.
          Chambers remain sealed until the Secretariat officially turns on Day 1.
        </p>
      </div>

      {/* Real-time Countdown Timer Tiles */}
      <div className="grid grid-cols-4 gap-3 sm:gap-4 max-w-xl mx-auto font-mono">
        {[
          { label: 'Days', value: timeLeft.days },
          { label: 'Hours', value: timeLeft.hours },
          { label: 'Minutes', value: timeLeft.minutes },
          { label: 'Seconds', value: timeLeft.seconds },
        ].map((item) => (
          <div
            key={item.label}
            className="p-4 sm:p-6 rounded-2xl bg-gradient-to-b from-[#131826] to-[#0a0d14] border border-amber-500/30 shadow-[0_0_30px_rgba(245,158,11,0.08)] flex flex-col items-center justify-center space-y-1"
          >
            <span className="text-2xl sm:text-4xl font-black text-amber-300">
              {String(item.value).padStart(2, '0')}
            </span>
            <span className="text-[10px] sm:text-xs text-neutral-400 uppercase tracking-wider">
              {item.label}
            </span>
          </div>
        ))}
      </div>

      {/* Conference Secretariat & Delegate Brief */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 max-w-2xl mx-auto text-left font-sans">
        <div className="p-4 rounded-2xl bg-white/5 border border-white/10 space-y-1">
          <div className="text-[10px] font-mono text-neutral-400 uppercase">Convening Dates</div>
          <div className="text-xs font-bold text-white flex items-center gap-1.5">
            <Calendar className="w-3.5 h-3.5 text-cyan-400" />
            <span>{activeConference?.startDate || 'TBA'} &ndash; {activeConference?.endDate || 'TBA'}</span>
          </div>
        </div>

        <div className="p-4 rounded-2xl bg-white/5 border border-white/10 space-y-1">
          <div className="text-[10px] font-mono text-neutral-400 uppercase">Secretariat Chair</div>
          <div className="text-xs font-bold text-white flex items-center gap-1.5">
            <Shield className="w-3.5 h-3.5 text-amber-400" />
            <span className="truncate">{activeConference?.secretariatChair || 'Executive Secretariat'}</span>
          </div>
        </div>

        <div className="p-4 rounded-2xl bg-white/5 border border-white/10 space-y-1">
          <div className="text-[10px] font-mono text-neutral-400 uppercase">Chamber Venue</div>
          <div className="text-xs font-bold text-white flex items-center gap-1.5">
            <Building2 className="w-3.5 h-3.5 text-emerald-400" />
            <span className="truncate">{activeConference?.location || 'Digital Sovereignty Chamber'}</span>
          </div>
        </div>
      </div>

      {/* Secretariat Quick Launch & Switch Button */}
      <div className="pt-4 flex flex-col sm:flex-row items-center justify-center gap-3">
        {/* Switch to active MUN */}
        {liveConference && (
          <button
            type="button"
            onClick={() => {
              setActiveConferenceId(liveConference.id);
              if (onSwitchToActive) onSwitchToActive();
            }}
            className="w-full sm:w-auto px-6 py-3 rounded-2xl bg-cyan-500 hover:bg-cyan-400 text-black font-bold text-xs sm:text-sm flex items-center justify-center gap-2 cursor-pointer shadow-lg shadow-cyan-500/20 transition-transform active:scale-95"
          >
            <Building2 className="w-4 h-4" />
            <span>Switch to Active MUN: {liveConference.shortName || liveConference.name} (Live)</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        )}

        {/* Secretariat Override */}
        {activeConference && (
          <button
            type="button"
            onClick={() => setConferenceStatus(activeConference.id, 'DAY_1')}
            className="w-full sm:w-auto px-5 py-3 rounded-2xl bg-white/10 hover:bg-white/15 border border-white/15 text-white font-mono text-xs flex items-center justify-center gap-2 cursor-pointer transition"
          >
            <Play className="w-3.5 h-3.5 text-emerald-400 fill-emerald-400" />
            <span>Secretariat Override: Start Day 1 Now</span>
          </button>
        )}
      </div>

      {/* Rules Notice */}
      <div className="p-4 rounded-2xl bg-amber-500/5 border border-amber-500/20 text-xs text-amber-200/80 font-sans max-w-xl mx-auto flex items-center gap-3">
        <AlertCircle className="w-5 h-5 text-amber-400 shrink-0" />
        <span className="text-left">
          Delegates can view agendas, prepare draft working papers, or complete public form registrations via <strong>ZenForms</strong> in the interim.
        </span>
      </div>

    </div>
  );
}
