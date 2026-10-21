'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { 
  Users, 
  ShieldCheck, 
  ExternalLink, 
  User, 
  Sparkles, 
  CheckCircle2, 
  Clock, 
  Lock 
} from 'lucide-react';

export interface TeamMemberItem {
  id: string;
  eventId: string;
  teamName: string;
  role: string;
  name: string;
  handle?: string | null;
  profileUrl?: string | null;
  avatarUrl?: string | null;
  description?: string | null;
  displayOrder: number;
  visibility: string;
  status: string;
}

interface EventTeamShowcaseProps {
  eventId: string;
  eventTitle?: string;
  headline?: string;
  description?: string;
}

export function EventTeamShowcase({
  eventId,
  eventTitle,
  headline = 'Our Team & Leadership',
  description = 'Meet the Secretariat, Executive Board, and Organising Committee behind this convening.'
}: EventTeamShowcaseProps) {
  const [members, setMembers] = useState<TeamMemberItem[]>([]);
  const [grouped, setGrouped] = useState<Record<string, TeamMemberItem[]>>({});
  const [teams, setTeams] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeFilter, setActiveFilter] = useState<string>('All');

  useEffect(() => {
    let isMounted = true;
    const fetchTeam = async () => {
      try {
        setLoading(true);
        const res = await fetch(`/api/events/team?eventId=${encodeURIComponent(eventId)}`);
        const data = await res.json();
        if (isMounted && data.success) {
          setMembers(data.members || []);
          setGrouped(data.grouped || {});
          setTeams(data.teams || []);
        }
      } catch (err) {
        console.error('Failed to load event team:', err);
      } finally {
        if (isMounted) setLoading(false);
      }
    };

    fetchTeam();
    return () => {
      isMounted = false;
    };
  }, [eventId]);

  const displayedGroups = activeFilter === 'All'
    ? grouped
    : { [activeFilter]: grouped[activeFilter] || [] };

  return (
    <div className="space-y-8 text-left">
      {/* Header Section */}
      <div className="p-6 sm:p-8 rounded-3xl bg-[#090c16] border border-white/10 space-y-3">
        <div className="flex items-center gap-2">
          <span className="px-2.5 py-0.5 rounded-full bg-white/10 border border-white/15 text-white font-mono text-[10px] uppercase font-bold tracking-wider flex items-center gap-1.5">
            <Users className="w-3 h-3 text-white" />
            <span>Official Event Directory</span>
          </span>
          <span className="text-[11px] font-mono text-neutral-400">
            {members.length} Confirmed Team Members
          </span>
        </div>
        <h2 className="text-2xl sm:text-3xl font-black font-display text-white tracking-tight">
          {headline}
        </h2>
        <p className="text-xs sm:text-sm text-neutral-300 max-w-2xl font-light leading-relaxed">
          {description}
        </p>

        {/* Filter Pills */}
        {teams.length > 1 && (
          <div className="flex items-center gap-1.5 pt-3 overflow-x-auto pb-1">
            <button
              type="button"
              onClick={() => setActiveFilter('All')}
              className={`px-3 py-1.5 rounded-xl text-xs font-mono transition cursor-pointer shrink-0 ${
                activeFilter === 'All'
                  ? 'bg-white text-black font-bold'
                  : 'bg-white/5 hover:bg-white/10 text-neutral-400 hover:text-white border border-white/5'
              }`}
            >
              All Departments ({members.length})
            </button>
            {teams.map((t) => (
              <button
                key={t}
                type="button"
                onClick={() => setActiveFilter(t)}
                className={`px-3 py-1.5 rounded-xl text-xs font-mono transition cursor-pointer shrink-0 ${
                  activeFilter === t
                    ? 'bg-white text-black font-bold'
                    : 'bg-white/5 hover:bg-white/10 text-neutral-400 hover:text-white border border-white/5'
                }`}
              >
                {t} ({grouped[t]?.length || 0})
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Loading Skeleton */}
      {loading && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {[1, 2, 3].map((i) => (
            <div key={i} className="p-5 rounded-2xl bg-[#090a12] border border-white/5 animate-pulse space-y-3">
              <div className="w-12 h-12 rounded-full bg-white/10" />
              <div className="h-4 bg-white/10 rounded w-1/2" />
              <div className="h-3 bg-white/5 rounded w-3/4" />
            </div>
          ))}
        </div>
      )}

      {/* Empty State */}
      {!loading && members.length === 0 && (
        <div className="py-16 text-center space-y-4 rounded-3xl bg-[#090c16] border border-white/10 p-8 max-w-xl mx-auto">
          <div className="w-14 h-14 rounded-2xl bg-white/5 border border-white/10 mx-auto flex items-center justify-center text-white">
            <Users className="w-7 h-7" />
          </div>
          <div className="space-y-1">
            <h3 className="font-sans font-bold text-lg text-white">Team Directory In Assembly</h3>
            <p className="text-xs text-neutral-400 max-w-sm mx-auto leading-relaxed">
              The organisers have not finalized the public dais roster yet. Check back closer to the conference date or apply to join the team below.
            </p>
          </div>
        </div>
      )}

      {/* Team Roster Grouped by Department */}
      {!loading && members.length > 0 && (
        <div className="space-y-10">
          {Object.entries(displayedGroups).map(([dept, deptMembers]) => {
            if (!deptMembers || deptMembers.length === 0) return null;

            return (
              <div key={dept} className="space-y-4">
                {/* Department Header */}
                <div className="flex items-center justify-between border-b border-white/10 pb-2">
                  <div className="flex items-center gap-2">
                    <h3 className="text-lg font-bold text-white font-sans tracking-tight">
                      {dept}
                    </h3>
                    <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-white/10 text-neutral-300">
                      {deptMembers.length}
                    </span>
                  </div>
                </div>

                {/* Member Cards Grid */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                  {deptMembers.map((member) => {
                    const profileHref = member.handle
                      ? `/profile/${member.handle}`
                      : member.profileUrl || null;

                    return (
                      <div
                        key={member.id}
                        className="p-5 rounded-2xl bg-[#090a12] border border-white/10 hover:border-white/25 transition-all flex flex-col justify-between space-y-4 shadow-lg group text-left"
                      >
                        {/* Member Identity Header */}
                        <div className="flex items-start gap-3.5">
                          {/* Avatar or Initial Badge */}
                          {member.avatarUrl ? (
                            <img
                              src={member.avatarUrl}
                              alt={member.name}
                              className="w-12 h-12 rounded-2xl object-cover border border-white/15 shrink-0"
                            />
                          ) : (
                            <div className="w-12 h-12 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center text-white text-base font-bold font-mono shrink-0">
                              {member.name.charAt(0).toUpperCase()}
                            </div>
                          )}

                          <div className="space-y-1 min-w-0 flex-1">
                            {/* Role / Designation Pill */}
                            <span className="inline-block text-[10px] font-mono font-bold uppercase tracking-wider px-2 py-0.5 rounded-md bg-white/10 text-white border border-white/10 truncate max-w-full">
                              {member.role}
                            </span>

                            {/* Person Name */}
                            <h4 className="font-sans font-bold text-base text-white truncate group-hover:text-neutral-200 transition">
                              {member.name}
                            </h4>

                            {/* Handle / Profile Link */}
                            {member.handle && (
                              <p className="text-xs text-neutral-400 font-mono truncate">
                                @{member.handle}
                              </p>
                            )}
                          </div>
                        </div>

                        {/* Description / Bio */}
                        {member.description && (
                          <p className="text-xs text-neutral-300 font-sans leading-relaxed line-clamp-3">
                            {member.description}
                          </p>
                        )}

                        {/* Card Footer: Status & Profile Button */}
                        <div className="flex items-center justify-between pt-3 border-t border-white/5 text-xs font-mono">
                          <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full border flex items-center gap-1 ${
                            member.status === 'CONFIRMED'
                              ? 'bg-emerald-500/10 text-emerald-300 border-emerald-500/20'
                              : 'bg-white/5 text-neutral-400 border-white/10'
                          }`}>
                            <CheckCircle2 className="w-3 h-3 text-emerald-400" />
                            <span>{member.status === 'CONFIRMED' ? 'Confirmed Member' : member.status}</span>
                          </span>

                          {profileHref && (
                            <Link
                              href={profileHref}
                              className="text-neutral-400 hover:text-white inline-flex items-center gap-1 transition"
                            >
                              <span>Profile</span>
                              <ExternalLink className="w-3 h-3" />
                            </Link>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
