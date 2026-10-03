'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { 
  LeaderboardCategory, 
  LeaderboardPeriod, 
  LeaderboardEntry, 
  InstitutionEntry, 
  TeamEntry, 
  getRealLeaderboard,
  fetchServerLeaderboard,
  ZEN_POINT_RULES
} from '@/lib/leaderboard';
import LeaderboardUserProfileModal from '@/components/leaderboard/LeaderboardUserProfileModal';
import { 
  Trophy, 
  ShieldCheck, 
  Sparkles, 
  Globe, 
  FileText, 
  Mic, 
  HeartHandshake, 
  Wrench, 
  Calendar, 
  School, 
  Users, 
  Flame, 
  TrendingUp, 
  Award, 
  CheckCircle2, 
  ArrowUpRight,
  Info
} from 'lucide-react';

export default function LeaderboardPage() {
  const [category, setCategory] = useState<LeaderboardCategory>('global');
  const [period, setPeriod] = useState<LeaderboardPeriod>('season');
  const [viewType, setViewType] = useState<'CITIZENS' | 'INSTITUTIONS' | 'TEAMS'>('CITIZENS');
  const [entries, setEntries] = useState<LeaderboardEntry[]>([]);
  const [institutions, setInstitutions] = useState<InstitutionEntry[]>([]);
  const [teams, setTeams] = useState<TeamEntry[]>([]);
  const [selectedUser, setSelectedUser] = useState<LeaderboardEntry | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    // 1. Instant render from local cache
    const localData = getRealLeaderboard(category, period);
    if (localData && localData.length > 0) {
      setEntries(localData);
    }

    // 2. Query server for network-wide aggregated leaderboard
    setIsLoading(true);
    fetchServerLeaderboard(category, period)
      .then((res) => {
        if (res.entries && res.entries.length > 0) {
          setEntries(res.entries);
        }
        if (res.institutions) setInstitutions(res.institutions);
        if (res.teams) setTeams(res.teams);
      })
      .catch((err) => {
        console.warn('Server leaderboard fetch error:', err);
      })
      .finally(() => {
        setIsLoading(false);
      });
  }, [category, period]);

  const categories = [
    { id: 'global' as LeaderboardCategory, label: 'Global', icon: Globe },
    { id: 'diplomacy' as LeaderboardCategory, label: 'ZEN.DIPLOMACY', icon: Trophy },
    { id: 'press' as LeaderboardCategory, label: 'ZEN.PRESS', icon: FileText },
    { id: 'speaking' as LeaderboardCategory, label: 'Speakers', icon: Mic },
    { id: 'community' as LeaderboardCategory, label: 'Community', icon: HeartHandshake },
    { id: 'contributors' as LeaderboardCategory, label: 'Contributors', icon: Wrench },
  ];

  const periods = [
    { id: 'today' as LeaderboardPeriod, label: 'Today' },
    { id: 'week' as LeaderboardPeriod, label: 'This Week' },
    { id: 'month' as LeaderboardPeriod, label: 'This Month' },
    { id: 'season' as LeaderboardPeriod, label: 'ZEN.SEASON 01 (1 Oct – 31 Dec)' },
    { id: 'year' as LeaderboardPeriod, label: '2026' },
    { id: 'all_time' as LeaderboardPeriod, label: 'All Time' },
  ];

  // Recognition pillars breakdown based on active entries
  const topPillars = {
    rising: entries.find((e) => e.primaryPillar === 'RISING') || entries[1] || null,
    newAndNoticed: entries.find((e) => e.primaryPillar === 'NEW & NOTICED') || null,
    topContributor: entries[0] || null,
    mostActive: entries.find((e) => e.primaryPillar === 'MOST ACTIVE') || null,
  };

  return (
    <div className="min-h-screen bg-[#030407] text-white pt-24 pb-20 px-3 sm:px-6 lg:px-8 selection:bg-cyan-500/30 selection:text-cyan-200">
      {/* Background Lighting */}
      <div className="fixed inset-0 pointer-events-none z-0">
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[800px] h-[450px] bg-gradient-to-b from-amber-600/10 via-cyan-600/5 to-transparent blur-3xl rounded-full" />
      </div>

      <div className="relative z-10 max-w-6xl mx-auto space-y-8">
        {/* Top Hero Section */}
        <div className="p-6 sm:p-8 rounded-3xl bg-[#080a10]/80 backdrop-blur-xl border border-white/10 shadow-2xl space-y-4">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div className="space-y-1.5">
              <div className="flex items-center gap-2">
                <span className="text-2xl">🏆</span>
                <h1 className="text-xl sm:text-3xl font-bold tracking-tight text-white flex items-center gap-2.5">
                  <span>ZEN.LEADERBOARD</span>
                  <span className="text-[10px] sm:text-xs font-mono font-bold px-2.5 py-1 rounded-full bg-amber-500/10 border border-amber-500/30 text-amber-300">
                    SEASON 01 ACTIVE
                  </span>
                </h1>
              </div>
              <p className="text-xs sm:text-sm text-neutral-400 font-sans">
                Recognise the work. Discover the people.
              </p>
            </div>

            {/* Passport Link CTA */}
            <div className="flex items-center gap-3">
              <Link
                href="/passport"
                className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-white text-black font-semibold text-xs tracking-wider uppercase hover:bg-neutral-200 transition-all hover:scale-[1.02] shadow-md cursor-pointer"
              >
                <span>My ZEN.PASSPORT</span>
                <ArrowUpRight className="w-4 h-4 text-black" />
              </Link>
            </div>
          </div>

          {/* Strict Anti-Gaming / Provenance Banner */}
          <div className="p-3.5 rounded-2xl bg-cyan-950/20 border border-cyan-500/20 text-xs text-neutral-300 flex items-start sm:items-center justify-between gap-3">
            <div className="flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-cyan-400 shrink-0" />
              <p className="text-[11px] leading-relaxed">
                <span className="font-bold text-white">Genuine Merits Only:</span> Points are derived exclusively from verified conferences (+75 MUN, +100 Award), approved articles (+40), and community organising (+100). No points for followers, money, or likes.
              </p>
            </div>
            <span className="text-[10px] font-mono text-cyan-400 font-bold shrink-0 hidden md:block">
              NO-SEED VERIFIED
            </span>
          </div>
        </div>

        {/* View Switcher: CITIZENS | INSTITUTIONS | TEAMS */}
        <div className="flex items-center justify-between gap-4 border-b border-white/10 pb-3">
          <div className="flex items-center gap-1.5 p-1 rounded-2xl bg-white/[0.03] border border-white/10">
            <button
              type="button"
              onClick={() => setViewType('CITIZENS')}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-mono font-semibold transition-all cursor-pointer ${
                viewType === 'CITIZENS'
                  ? 'bg-white text-black shadow-md'
                  : 'text-neutral-400 hover:text-white'
              }`}
            >
              👥 CITIZENS
            </button>
            <button
              type="button"
              onClick={() => setViewType('INSTITUTIONS')}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-mono font-semibold transition-all cursor-pointer flex items-center gap-1.5 ${
                viewType === 'INSTITUTIONS'
                  ? 'bg-white text-black shadow-md'
                  : 'text-neutral-400 hover:text-white'
              }`}
            >
              <School className="w-3.5 h-3.5" />
              <span>INSTITUTIONS</span>
            </button>
            <button
              type="button"
              onClick={() => setViewType('TEAMS')}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-mono font-semibold transition-all cursor-pointer flex items-center gap-1.5 ${
                viewType === 'TEAMS'
                  ? 'bg-white text-black shadow-md'
                  : 'text-neutral-400 hover:text-white'
              }`}
            >
              <Users className="w-3.5 h-3.5" />
              <span>TEAMS &amp; DAIS</span>
            </button>
          </div>

          <span className="text-[11px] font-mono text-neutral-500 hidden sm:block">
            AUTHENTIC COMMUNITY REGISTRY
          </span>
        </div>

        {/* Categories Pills */}
        <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none">
          {categories.map((c) => {
            const Icon = c.icon;
            const isSel = category === c.id;
            return (
              <button
                key={c.id}
                type="button"
                onClick={() => setCategory(c.id)}
                className={`px-3.5 py-2 rounded-xl text-xs font-mono tracking-wider transition-all whitespace-nowrap cursor-pointer flex items-center gap-2 border ${
                  isSel
                    ? 'bg-cyan-500/20 text-cyan-200 border-cyan-500/40 shadow-md font-bold'
                    : 'bg-white/[0.02] text-neutral-400 border-white/10 hover:bg-white/[0.06] hover:text-white'
                }`}
              >
                <Icon className="w-3.5 h-3.5" />
                <span>{c.label}</span>
              </button>
            );
          })}
        </div>

        {/* Time Periods Bar */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-none text-xs font-mono">
          <span className="text-[10px] uppercase text-neutral-500 mr-1 shrink-0">WINDOW:</span>
          {periods.map((p) => (
            <button
              key={p.id}
              type="button"
              onClick={() => setPeriod(p.id)}
              className={`px-3 py-1 rounded-lg transition-all whitespace-nowrap cursor-pointer ${
                period === p.id
                  ? 'bg-white text-black font-bold shadow-sm'
                  : 'text-neutral-400 hover:text-white bg-white/[0.02] hover:bg-white/[0.06]'
              }`}
            >
              {p.label}
            </button>
          ))}
        </div>

        {/* Recognition Spotlight Cards (Pillars instead of toxic ranking) */}
        {entries.length > 0 && viewType === 'CITIZENS' && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
            {topPillars.topContributor && (
              <div 
                onClick={() => setSelectedUser(topPillars.topContributor)}
                className="p-4 rounded-2xl bg-gradient-to-br from-amber-500/10 to-transparent border border-amber-500/30 space-y-2 cursor-pointer hover:border-amber-500/60 transition"
              >
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-mono font-bold text-amber-300 uppercase tracking-widest flex items-center gap-1">
                    <Award className="w-3 h-3 text-amber-400" />
                    <span>TOP CONTRIBUTOR</span>
                  </span>
                  <span className="text-[10px] font-mono text-amber-400">RANK #1</span>
                </div>
                <p className="text-sm font-bold text-white truncate">{topPillars.topContributor.fullName}</p>
                <p className="text-xs font-mono text-cyan-300 font-bold">{topPillars.topContributor.points} PTS</p>
              </div>
            )}

            {topPillars.rising && (
              <div 
                onClick={() => setSelectedUser(topPillars.rising)}
                className="p-4 rounded-2xl bg-gradient-to-br from-emerald-500/10 to-transparent border border-emerald-500/30 space-y-2 cursor-pointer hover:border-emerald-500/60 transition"
              >
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-mono font-bold text-emerald-300 uppercase tracking-widest flex items-center gap-1">
                    <TrendingUp className="w-3 h-3 text-emerald-400" />
                    <span>RISING CITIZEN</span>
                  </span>
                  <span className="text-[10px] font-mono text-emerald-400">+{topPillars.rising.recentGain || 50} PTS</span>
                </div>
                <p className="text-sm font-bold text-white truncate">{topPillars.rising.fullName}</p>
                <p className="text-xs font-mono text-neutral-400">@{topPillars.rising.username}</p>
              </div>
            )}

            {topPillars.mostActive && (
              <div 
                onClick={() => setSelectedUser(topPillars.mostActive)}
                className="p-4 rounded-2xl bg-gradient-to-br from-cyan-500/10 to-transparent border border-cyan-500/30 space-y-2 cursor-pointer hover:border-cyan-500/60 transition"
              >
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-mono font-bold text-cyan-300 uppercase tracking-widest flex items-center gap-1">
                    <Flame className="w-3 h-3 text-cyan-400" />
                    <span>MOST ACTIVE</span>
                  </span>
                  <span className="text-[10px] font-mono text-cyan-400">{topPillars.mostActive.verifiedActivitiesCount} EVENTS</span>
                </div>
                <p className="text-sm font-bold text-white truncate">{topPillars.mostActive.fullName}</p>
                <p className="text-xs font-mono text-neutral-400">@{topPillars.mostActive.username}</p>
              </div>
            )}

            {topPillars.newAndNoticed && (
              <div 
                onClick={() => setSelectedUser(topPillars.newAndNoticed)}
                className="p-4 rounded-2xl bg-gradient-to-br from-purple-500/10 to-transparent border border-purple-500/30 space-y-2 cursor-pointer hover:border-purple-500/60 transition"
              >
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-mono font-bold text-purple-300 uppercase tracking-widest flex items-center gap-1">
                    <Sparkles className="w-3 h-3 text-purple-400" />
                    <span>NEW &amp; NOTICED</span>
                  </span>
                  <span className="text-[10px] font-mono text-purple-400">AUTHENTICATED</span>
                </div>
                <p className="text-sm font-bold text-white truncate">{topPillars.newAndNoticed.fullName}</p>
                <p className="text-xs font-mono text-neutral-400">@{topPillars.newAndNoticed.username}</p>
              </div>
            )}
          </div>
        )}

        {/* Main Content Area */}
        {viewType === 'CITIZENS' && (
          <div className="space-y-4">
            {/* If empty, render authentic empty state compliant with NO-SEED.md */}
            {entries.length === 0 ? (
              <div className="text-center py-20 px-4 rounded-3xl border border-dashed border-white/10 bg-[#080a10]/50 space-y-4">
                <div className="w-16 h-16 mx-auto rounded-2xl bg-white/[0.04] border border-white/10 flex items-center justify-center text-3xl">
                  🏆
                </div>
                <div className="space-y-1.5 max-w-md mx-auto">
                  <h3 className="text-base font-bold text-white">
                    No verified rankings in this category for {period}
                  </h3>
                  <p className="text-xs text-neutral-400 leading-relaxed">
                    In compliance with our sovereign protocol, zero fake or dummy rows are injected. Rankings will update automatically as verified conference attendance and publications are sealed into user passports.
                  </p>
                </div>
                <div className="pt-2 flex justify-center gap-3">
                  <Link
                    href="/passport"
                    className="px-4 py-2 rounded-xl bg-white text-black font-semibold text-xs hover:bg-neutral-200 transition cursor-pointer"
                  >
                    + Record Activity on Your Passport
                  </Link>
                </div>
              </div>
            ) : (
              <div className="rounded-3xl border border-white/10 bg-[#080a10] overflow-hidden shadow-2xl">
                {/* Table Header */}
                <div className="grid grid-cols-12 gap-3 p-4 border-b border-white/10 text-[10px] font-mono text-neutral-400 uppercase tracking-widest bg-white/[0.01]">
                  <div className="col-span-1 text-center">RANK</div>
                  <div className="col-span-6 sm:col-span-5">CITIZEN &amp; PASSPORT</div>
                  <div className="col-span-3 hidden sm:block">PILLAR &amp; BADGES</div>
                  <div className="col-span-5 sm:col-span-3 text-right">ZEN.POINTS</div>
                </div>

                {/* Rows */}
                <div className="divide-y divide-white/5">
                  {entries.map((entry) => {
                    const isTop3 = entry.rank <= 3;
                    const rankBadgeClass =
                      entry.rank === 1
                        ? 'bg-amber-400/20 text-amber-300 border-amber-400/40'
                        : entry.rank === 2
                        ? 'bg-neutral-300/20 text-neutral-200 border-neutral-300/40'
                        : entry.rank === 3
                        ? 'bg-amber-700/20 text-amber-500 border-amber-700/40'
                        : 'bg-white/[0.04] text-neutral-400 border-white/10';

                    return (
                      <div
                        key={entry.username}
                        onClick={() => setSelectedUser(entry)}
                        className="grid grid-cols-12 gap-3 p-4 items-center hover:bg-white/[0.03] transition-colors cursor-pointer group"
                      >
                        {/* Rank */}
                        <div className="col-span-1 flex justify-center">
                          <span
                            className={`w-7 h-7 rounded-xl flex items-center justify-center font-mono font-bold text-xs border ${rankBadgeClass}`}
                          >
                            {entry.rank}
                          </span>
                        </div>

                        {/* User Details */}
                        <div className="col-span-6 sm:col-span-5 flex items-center gap-3 min-w-0">
                          <div className="w-10 h-10 rounded-xl bg-white/[0.06] border border-white/10 flex items-center justify-center font-bold text-white text-sm shrink-0">
                            {entry.avatarUrl ? (
                              <img src={entry.avatarUrl} alt={entry.fullName} className="w-full h-full object-cover rounded-xl" />
                            ) : (
                              entry.fullName.charAt(0)
                            )}
                          </div>
                          <div className="min-w-0 space-y-0.5">
                            <div className="flex items-center gap-1.5">
                              <span className="text-xs sm:text-sm font-bold text-white group-hover:text-cyan-200 transition-colors truncate">
                                {entry.fullName}
                              </span>
                              <ShieldCheck className="w-3.5 h-3.5 text-cyan-400 shrink-0" />
                            </div>
                            <div className="flex items-center gap-2 text-[10px] font-mono">
                              <span className="text-neutral-400">@{entry.username}</span>
                              <span className="text-amber-300 font-semibold">{entry.passportId}</span>
                            </div>
                          </div>
                        </div>

                        {/* Pillar & Badges */}
                        <div className="col-span-3 hidden sm:flex flex-col gap-1">
                          <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-white/[0.04] border border-white/10 text-cyan-300 w-fit">
                            {entry.primaryPillar}
                          </span>
                          {entry.badges.length > 0 && (
                            <span className="text-[9px] font-mono text-neutral-400 truncate">
                              {entry.badges.join(' • ')}
                            </span>
                          )}
                        </div>

                        {/* Points */}
                        <div className="col-span-5 sm:col-span-3 text-right space-y-0.5">
                          <span className="text-sm sm:text-base font-bold font-mono text-cyan-300">
                            {entry.points}
                          </span>
                          <span className="text-[10px] font-mono text-neutral-500 block">
                            ZEN.POINTS
                          </span>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}
          </div>
        )}

        {/* Institutions View */}
        {viewType === 'INSTITUTIONS' && (
          <div className="text-center py-16 px-4 rounded-3xl border border-dashed border-white/10 bg-[#080a10]/50 space-y-4">
            <School className="w-12 h-12 text-cyan-400 mx-auto" />
            <div className="space-y-1.5 max-w-md mx-auto">
              <h3 className="text-base font-bold text-white">Institutions &amp; Academic Leagues</h3>
              <p className="text-xs text-neutral-400 leading-relaxed">
                Ranked purely by verified points earned by authenticated students (Level 2). School leaderboards refresh every semester.
              </p>
            </div>
            <div className="p-4 rounded-2xl bg-cyan-950/20 border border-cyan-500/20 max-w-md mx-auto text-xs text-neutral-300">
              Students can attach and authenticate their school/university credentials on their <Link href="/passport" className="text-cyan-300 underline">ZEN.PASSPORT</Link>.
            </div>
          </div>
        )}

        {/* Teams & Dais View */}
        {viewType === 'TEAMS' && (
          <div className="text-center py-16 px-4 rounded-3xl border border-dashed border-white/10 bg-[#080a10]/50 space-y-4">
            <Users className="w-12 h-12 text-purple-400 mx-auto" />
            <div className="space-y-1.5 max-w-md mx-auto">
              <h3 className="text-base font-bold text-white">Delegations &amp; Dais Societies</h3>
              <p className="text-xs text-neutral-400 leading-relaxed">
                Debate clubs, MUN secretariats, and collegiate societies competing through verified collective conference performance.
              </p>
            </div>
          </div>
        )}
      </div>

      {/* Quick Profile Card Modal */}
      <LeaderboardUserProfileModal
        entry={selectedUser}
        isOpen={!!selectedUser}
        onClose={() => setSelectedUser(null)}
      />
    </div>
  );
}
