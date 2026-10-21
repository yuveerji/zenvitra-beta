'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
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
  Users,
  Layers,
  Zap
} from 'lucide-react';
import { useMun } from '@/context/MunContext';

interface MunNotStartedViewProps {
  onSwitchToActive?: () => void;
  onCreateInstantEvent?: () => void;
  onHostNewEvent?: () => void;
}

export function MunNotStartedView({ onSwitchToActive, onCreateInstantEvent, onHostNewEvent }: MunNotStartedViewProps) {
  const { activeConference, setConferenceStatus, conferences, setActiveConferenceId } = useMun();

  // Target date for countdown (fallback to startDate, then conveningDate, then 7 days)
  const targetTime = activeConference?.startDate
    ? new Date(`${activeConference.startDate}T00:00:00`).getTime()
    : (activeConference?.conveningDate 
        ? new Date(activeConference.conveningDate).getTime() 
        : Date.now() + 7 * 24 * 60 * 60 * 1000);

  const [timeLeft, setTimeLeft] = useState<{ days: number; hours: number; minutes: number; seconds: number }>({
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0
  });

  useEffect(() => {
    if (!activeConference) return;
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
  }, [targetTime, activeConference]);

  const liveConference = conferences.find((c) => c.status !== 'NOT_STARTED' && c.id !== activeConference?.id);

  if (!activeConference) {
    return (
      <div className="w-full max-w-3xl mx-auto py-16 px-4 text-center space-y-8 animate-fade-in">
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-cyan-500/10 border border-cyan-500/30 text-cyan-300 font-mono text-xs font-bold uppercase tracking-wider">
          <Building2 className="w-3.5 h-3.5 text-cyan-400" />
          <span>NO CONFERENCES OR SUMMITS HOSTED YET</span>
        </div>

        <div className="space-y-3">
          <h1 className="text-3xl sm:text-5xl font-black font-display tracking-tight text-white">
            Host Your Summit or Conference
          </h1>
          <p className="text-sm sm:text-base text-neutral-400 max-w-xl mx-auto font-sans leading-relaxed">
            Host a Model UN, Youth Summit, or Parliamentary Chamber. Committees, delegate speaker lists, electronic voting, and live country matrices will activate automatically.
          </p>
        </div>

        <div className="pt-2 flex flex-col sm:flex-row items-center justify-center gap-3">
          <Link
            href="/committee/create"
            className="w-full sm:w-auto px-6 py-3.5 rounded-2xl bg-gradient-to-r from-amber-400 via-amber-300 to-amber-500 hover:brightness-110 text-black font-extrabold text-sm flex items-center justify-center gap-2 cursor-pointer shadow-xl shadow-amber-500/20 transition-transform active:scale-95"
          >
            <Play className="w-4 h-4 fill-black" />
            <span>Start Committee Session (Quick Dais)</span>
          </Link>

          {onCreateInstantEvent && (
            <button
              type="button"
              onClick={onCreateInstantEvent}
              className="w-full sm:w-auto px-6 py-3.5 rounded-2xl bg-gradient-to-r from-amber-500/20 via-cyan-500/20 to-emerald-500/20 hover:from-amber-500/30 hover:via-cyan-500/30 hover:to-emerald-500/30 border border-cyan-400/40 text-cyan-200 font-bold text-sm flex items-center justify-center gap-2 cursor-pointer shadow-lg shadow-cyan-500/10 transition-transform active:scale-95"
            >
              <Zap className="w-4 h-4 text-amber-300 fill-amber-300" />
              <span>Create Instant Event</span>
            </button>
          )}

          {onHostNewEvent && (
            <button
              type="button"
              onClick={onHostNewEvent}
              className="w-full sm:w-auto px-6 py-3.5 rounded-2xl bg-cyan-500 hover:bg-cyan-400 text-black font-bold text-sm flex items-center justify-center gap-2 cursor-pointer shadow-lg shadow-cyan-500/20 transition-transform active:scale-95"
            >
              <Building2 className="w-4 h-4" />
              <span>Host New Event</span>
            </button>
          )}
        </div>
      </div>
    );
  }

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

      {/* Secretariat Quick Launch, Connect Matrix, Instant Event & Switch Button */}
      <div className="pt-4 flex flex-col sm:flex-row items-center justify-center gap-3">
        {/* Quick Committee Session Button */}
        <Link
          href="/committee/create"
          className="w-full sm:w-auto px-6 py-3 rounded-2xl bg-amber-400 hover:bg-amber-300 text-black font-extrabold text-xs sm:text-sm flex items-center justify-center gap-2 cursor-pointer shadow-lg shadow-amber-500/20 transition-transform active:scale-95"
        >
          <Play className="w-4 h-4 fill-black" />
          <span>Start Quick Committee Dais</span>
        </Link>

        {/* Create Instant Event Button */}
        {onCreateInstantEvent && (
          <button
            type="button"
            onClick={onCreateInstantEvent}
            className="w-full sm:w-auto px-6 py-3 rounded-2xl bg-gradient-to-r from-amber-500/20 via-cyan-500/20 to-emerald-500/20 hover:from-amber-500/30 hover:via-cyan-500/30 hover:to-emerald-500/30 border border-cyan-400/40 text-cyan-200 font-bold text-xs sm:text-sm flex items-center justify-center gap-2 cursor-pointer shadow-lg shadow-cyan-500/10 transition-transform active:scale-95 group"
          >
            <Zap className="w-4 h-4 text-amber-300 fill-amber-300 group-hover:scale-110 transition-transform" />
            <span>Create Instant Event</span>
          </button>
        )}

        {/* Connect Matrix Button */}
        <Link
          href={activeConference?.id ? `/${activeConference.id}/matrix` : '/mun/matrix'}
          className="w-full sm:w-auto px-6 py-3 rounded-2xl bg-cyan-500/15 hover:bg-cyan-500/25 border border-cyan-500/30 text-cyan-300 font-bold text-xs sm:text-sm flex items-center justify-center gap-2 cursor-pointer shadow-lg shadow-cyan-500/10 transition-transform active:scale-95 group"
        >
          <Layers className="w-4 h-4 text-cyan-400 group-hover:rotate-12 transition-transform" />
          <span>Connect Matrix &amp; View Portfolios</span>
          <ArrowRight className="w-4 h-4 text-cyan-400/70" />
        </Link>

        {/* Switch to active MUN */}
        {liveConference && (
          <button
            type="button"
            onClick={() => {
              setActiveConferenceId(liveConference.id);
              if (onSwitchToActive) onSwitchToActive();
            }}
            className="w-full sm:w-auto px-6 py-3 rounded-2xl bg-neutral-800 hover:bg-neutral-700 text-neutral-200 border border-neutral-700 font-bold text-xs sm:text-sm flex items-center justify-center gap-2 cursor-pointer transition-transform active:scale-95"
          >
            <Building2 className="w-4 h-4 text-neutral-400" />
            <span>Switch to Active: {liveConference.shortName || liveConference.name}</span>
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
