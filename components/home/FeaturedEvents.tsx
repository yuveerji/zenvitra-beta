'use client';

import React, { useState, useEffect, useMemo } from 'react';
import Link from 'next/link';
import { 
  Calendar, 
  MapPin, 
  ArrowRight, 
  Users, 
  Sparkles, 
  Crown, 
  ShieldCheck, 
  FileSpreadsheet, 
  Clock, 
  ExternalLink,
  Flame,
  ArrowUpRight
} from 'lucide-react';
import { SpotlightCard } from '@/components/ui/SpotlightCard';
import { ZenDiplomacyCover } from '@/components/mun/ZenDiplomacyCover';

export function FeaturedEvents() {
  const targetDate = useMemo(() => new Date('2026-10-24T09:00:00+05:30').getTime(), []);
  const [timeLeft, setTimeLeft] = useState<{ days: number; hours: number; minutes: number; seconds: number }>({
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0
  });

  useEffect(() => {
    const updateCountdown = () => {
      const now = Date.now();
      const diff = Math.max(0, targetDate - now);
      const days = Math.floor(diff / (1000 * 60 * 60 * 24));
      const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
      const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
      const seconds = Math.floor((diff % (1000 * 60)) / 1000);
      setTimeLeft({ days, hours, minutes, seconds });
    };
    updateCountdown();
    const interval = setInterval(updateCountdown, 1000);
    return () => clearInterval(interval);
  }, [targetDate]);

  return (
    <section className="w-full max-w-7xl mx-auto px-4 sm:px-8 py-12 text-left space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 pb-4 border-b border-white/10">
        <div className="space-y-1">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-500/10 border border-cyan-500/25 text-[10px] font-mono font-bold uppercase tracking-widest text-cyan-400">
            <Crown className="w-3.5 h-3.5 text-cyan-400" />
            <span>SOVEREIGN SUMMITS &amp; ASSEMBLIES</span>
          </div>
          <h2 className="text-2xl sm:text-4xl font-display font-black tracking-tight text-white uppercase">
            Active Conferences &amp; MUNs
          </h2>
        </div>

        <Link href="/events">
          <button
            type="button"
            className="px-4 py-2 rounded-full border border-white/15 bg-white/[0.03] hover:bg-white/10 text-neutral-300 text-xs font-mono transition flex items-center gap-1.5 cursor-pointer shadow-sm"
          >
            <span>Browse All Summits</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </Link>
      </div>

      {/* ── FLAGSHIP CARD: ZEN.DIPLOMACY MUN 2026 (100% REAL RAW DATA) ── */}
      <SpotlightCard className="p-0 rounded-3xl border border-cyan-500/30 overflow-hidden shadow-[0_20px_60px_rgba(0,0,0,0.85),0_0_40px_rgba(6,182,212,0.12)] bg-[#070912]">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-0 items-stretch">
          
          {/* Left: Graphic Banner Area (100% Vector Code Recreated) */}
          <div className="lg:col-span-5 relative overflow-hidden bg-black flex items-center justify-center min-h-[260px] sm:min-h-[320px]">
            <ZenDiplomacyCover variant="compact" showBadge={true} interactive={true} className="h-full min-h-[280px]" />
            <div className="absolute inset-0 bg-gradient-to-t lg:bg-gradient-to-r from-black/10 via-transparent to-[#070912] pointer-events-none" />
          </div>

          {/* Right: Event Information & Actions */}
          <div className="lg:col-span-7 p-6 sm:p-8 flex flex-col justify-between space-y-6">
            <div className="space-y-4">
              <div className="flex flex-wrap items-center justify-between gap-3 text-xs font-mono">
                <span className="px-2.5 py-0.5 rounded-full bg-[#e2f952]/15 border border-[#e2f952]/30 text-[#e2f952] font-bold uppercase inline-flex items-center gap-1.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#e2f952] animate-pulse" />
                  DEL REGISTRATIONS GO LIVE: 1ST OCTOBER 2026
                </span>
                <span className="text-neutral-400">
                  Organizer ID: <strong className="text-white">yuveer</strong>
                </span>
              </div>

              <div>
                <h3 className="text-2xl sm:text-3xl font-display font-black text-white tracking-tight leading-tight uppercase">
                  ZEN.DIPLOMACY <span className="text-cyan-400">MUN 2026</span>
                </h3>
                <p className="text-xs sm:text-sm text-neutral-300 font-sans font-light leading-relaxed mt-1">
                  Official Online Model United Nations assembly convening on <strong className="text-white">October 24th &amp; 25th, 2026</strong>. Hosted on sovereign virtual chambers with real-time resolution authoring on ZEN.DOCS.
                </p>
              </div>

              {/* Event Metadata Grid */}
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 font-mono text-xs">
                <div className="p-2.5 rounded-xl bg-white/[0.03] border border-white/10 space-y-0.5">
                  <span className="text-[10px] text-neutral-400 uppercase tracking-wider block">Dates</span>
                  <p className="font-bold text-white truncate">Oct 24-25, 2026</p>
                </div>
                <div className="p-2.5 rounded-xl bg-white/[0.03] border border-white/10 space-y-0.5">
                  <span className="text-[10px] text-neutral-400 uppercase tracking-wider block">Format</span>
                  <p className="font-bold text-white truncate">Online Virtual Assembly</p>
                </div>
                <div className="p-2.5 rounded-xl bg-white/[0.03] border border-white/10 space-y-0.5 col-span-2 sm:col-span-1">
                  <span className="text-[10px] text-neutral-400 uppercase tracking-wider block">Organizer</span>
                  <p className="font-bold text-cyan-300 truncate">Yuveer (@yuveer)</p>
                </div>
              </div>

              {/* Committees Strip */}
              <div className="space-y-1.5">
                <span className="text-[10px] font-mono text-neutral-400 uppercase tracking-wider block">
                  4 Active Chambers (Agendas Revealing Soon):
                </span>
                <div className="flex flex-wrap gap-1.5">
                  <span className="px-2.5 py-1 rounded-lg bg-amber-500/10 border border-amber-500/30 text-amber-300 font-mono text-xs font-semibold">
                    AIPPM
                  </span>
                  <span className="px-2.5 py-1 rounded-lg bg-cyan-500/10 border border-cyan-500/30 text-cyan-300 font-mono text-xs font-semibold">
                    Education Ministry
                  </span>
                  <span className="px-2.5 py-1 rounded-lg bg-purple-500/10 border border-purple-500/30 text-purple-300 font-mono text-xs font-semibold">
                    UNESCO
                  </span>
                  <span className="px-2.5 py-1 rounded-lg bg-rose-500/10 border border-rose-500/30 text-rose-300 font-mono text-xs font-semibold">
                    UNSC
                  </span>
                </div>
              </div>
            </div>

            {/* Actions & Portfolio Matrix Redirection */}
            <div className="pt-4 border-t border-white/10 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div className="flex items-center gap-2 font-mono text-xs text-neutral-400">
                <Clock className="w-3.5 h-3.5 text-cyan-400" />
                <span>Starts in: <strong className="text-white">{timeLeft.days}d {timeLeft.hours}h {timeLeft.minutes}m</strong></span>
              </div>

              <div className="flex flex-wrap items-center gap-2">
                <Link
                  href="/zen-diplomacy/secretariat"
                  className="px-4 py-2.5 rounded-xl bg-purple-500/15 hover:bg-purple-500/25 border border-purple-500/30 text-purple-300 font-mono text-xs font-bold transition flex items-center gap-1.5 cursor-pointer"
                  title="Apply for Secretariat across 10 specialized departments"
                >
                  <Crown className="w-3.5 h-3.5 text-purple-400" />
                  <span>Secretariat</span>
                </Link>

                <a
                  href="https://docs.google.com/spreadsheets/d/1BxiMVs0XRA5nFMdKvBdBZjgmUUqptlbs74OgvE2upms/edit?usp=sharing"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-4 py-2.5 rounded-xl bg-emerald-500/15 hover:bg-emerald-500/25 border border-emerald-500/30 text-emerald-300 font-mono text-xs font-bold transition flex items-center gap-1.5 cursor-pointer"
                  title="Check live Portfolio Matrix on Google Sheets"
                >
                  <FileSpreadsheet className="w-3.5 h-3.5 text-emerald-400" />
                  <span>Portfolio Matrix</span>
                  <ExternalLink className="w-3 h-3" />
                </a>

                <Link href="/zen-diplomacy">
                  <button
                    type="button"
                    className="px-5 py-2.5 rounded-xl bg-white text-black font-display font-bold text-xs uppercase tracking-wider hover:bg-neutral-200 transition flex items-center gap-1.5 cursor-pointer shadow-md"
                  >
                    <span>Open ZEN.DIPLOMACY Portal</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </Link>
              </div>
            </div>
          </div>

        </div>
      </SpotlightCard>
    </section>
  );
}

export default FeaturedEvents;