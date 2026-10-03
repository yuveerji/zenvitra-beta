'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { LeaderboardEntry } from '@/lib/leaderboard';
import { getPassport, fetchServerPassport, ZenPassport, AchievementRecord, JourneyMilestone } from '@/lib/passport';
import { ShieldCheck, Trophy, ArrowRight, Award, Clock, Sparkles } from 'lucide-react';

interface LeaderboardUserProfileModalProps {
  entry: LeaderboardEntry | null;
  isOpen: boolean;
  onClose: () => void;
}

export default function LeaderboardUserProfileModal({
  entry,
  isOpen,
  onClose
}: LeaderboardUserProfileModalProps) {
  const [passport, setPassport] = useState<ZenPassport | null>(null);

  useEffect(() => {
    if (!isOpen || !entry) return;
    const local = getPassport(entry.username);
    if (local) setPassport(local);

    fetchServerPassport(entry.username).then((srv) => {
      if (srv) setPassport(srv);
    });
  }, [isOpen, entry]);

  if (!isOpen || !entry) return null;

  const topAchievements: AchievementRecord[] = passport?.achievements?.slice(0, 3) || [];
  const recentTimeline: JourneyMilestone[] = passport?.timeline?.slice(0, 3) || [];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-in fade-in duration-200">
      <div className="w-full max-w-md p-6 rounded-3xl bg-[#090c14] border border-white/15 shadow-2xl space-y-6 relative overflow-hidden">
        {/* Glow */}
        <div className="absolute top-0 right-0 w-40 h-40 bg-cyan-500/10 rounded-full blur-3xl pointer-events-none" />

        {/* Header */}
        <div className="flex items-center justify-between pb-3 border-b border-white/10">
          <div className="flex items-center gap-2">
            <span className="text-xs font-mono uppercase tracking-widest text-cyan-400">
              CITIZEN SPOTLIGHT
            </span>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="text-neutral-400 hover:text-white text-base px-2 py-1 cursor-pointer"
          >
            ✕
          </button>
        </div>

        {/* User Card Top */}
        <div className="flex items-start gap-4">
          <div className="w-14 h-14 rounded-2xl bg-gradient-to-tr from-cyan-500/20 to-purple-500/20 border border-white/20 flex items-center justify-center text-xl font-bold font-display text-white shadow-inner shrink-0">
            {entry.avatarUrl ? (
              <img src={entry.avatarUrl} alt={entry.fullName} className="w-full h-full object-cover rounded-2xl" />
            ) : (
              entry.fullName.charAt(0)
            )}
          </div>

          <div className="space-y-1 min-w-0 flex-1">
            <div className="flex items-center gap-1.5 flex-wrap">
              <h3 className="text-base font-bold text-white truncate">{entry.fullName}</h3>
              <ShieldCheck className="w-4 h-4 text-emerald-400 shrink-0" />
            </div>
            <p className="text-xs font-mono text-cyan-300">@{entry.username}</p>
            <p className="text-xs font-mono font-bold text-amber-300 tracking-wider">
              {entry.passportId}
            </p>
          </div>

          <div className="text-right shrink-0">
            <span className="text-[10px] font-mono text-neutral-400 block">ZEN.POINTS</span>
            <span className="text-lg font-bold font-mono text-cyan-300">{entry.points}</span>
          </div>
        </div>

        {/* Recognition Pillar */}
        <div className="p-3 rounded-2xl bg-white/[0.03] border border-white/10 flex items-center justify-between text-xs">
          <span className="font-mono text-neutral-400 uppercase text-[10px]">PILLAR RECOGNITION</span>
          <span className="px-2.5 py-0.5 rounded-full bg-cyan-500/10 border border-cyan-500/30 text-cyan-300 font-mono text-[11px] font-bold">
            {entry.primaryPillar}
          </span>
        </div>

        {/* Badges */}
        {entry.badges.length > 0 && (
          <div className="space-y-1.5">
            <span className="text-[10px] font-mono uppercase text-neutral-400">VERIFIED BADGES</span>
            <div className="flex flex-wrap gap-1.5">
              {entry.badges.map((b, i) => (
                <span
                  key={i}
                  className="px-2.5 py-1 rounded-xl bg-white/[0.04] border border-white/10 text-xs font-mono text-white"
                >
                  {b}
                </span>
              ))}
            </div>
          </div>
        )}

        {/* Top Achievements */}
        {topAchievements.length > 0 && (
          <div className="space-y-2">
            <span className="text-[10px] font-mono uppercase text-neutral-400 flex items-center gap-1">
              <Award className="w-3 h-3 text-amber-400" />
              <span>TOP ACCOLADES</span>
            </span>
            <div className="space-y-1.5">
              {topAchievements.map((ach) => (
                <div
                  key={ach.id}
                  className="p-2.5 rounded-xl bg-white/[0.02] border border-white/5 text-xs flex items-center justify-between"
                >
                  <span className="font-semibold text-white truncate">{ach.title}</span>
                  <span className="text-[10px] font-mono text-neutral-400 shrink-0 ml-2">{ach.issuer}</span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Recent Timeline Milestone */}
        {recentTimeline.length > 0 && (
          <div className="space-y-2">
            <span className="text-[10px] font-mono uppercase text-neutral-400 flex items-center gap-1">
              <Clock className="w-3 h-3 text-emerald-400" />
              <span>RECENT RECORDED MILESTONE</span>
            </span>
            <div className="p-2.5 rounded-xl bg-white/[0.02] border border-white/5 text-xs">
              <p className="font-semibold text-white">{recentTimeline[0].title}</p>
              <p className="text-[10px] text-neutral-400 font-mono mt-0.5">
                {recentTimeline[0].month} {recentTimeline[0].year} • {recentTimeline[0].category}
              </p>
            </div>
          </div>
        )}

        {/* Actions */}
        <div className="pt-2 flex items-center gap-3">
          <Link
            href={`/passport/${entry.username}`}
            className="flex-1 py-3 px-4 rounded-xl bg-white text-black font-semibold text-xs tracking-wider uppercase text-center hover:bg-neutral-200 transition-all flex items-center justify-center gap-2 cursor-pointer shadow-md"
          >
            <span>VIEW ZEN.PASSPORT</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>
      </div>
    </div>
  );
}
