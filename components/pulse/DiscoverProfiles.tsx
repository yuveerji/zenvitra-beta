'use client';

import React, { useState, useEffect, useMemo } from 'react';
import Link from 'next/link';
import { 
  Users, 
  Search, 
  ShieldCheck, 
  Lock, 
  UserPlus, 
  UserCheck, 
  Clock, 
  Sparkles, 
  MapPin, 
  ArrowRight,
  Globe2,
  MessageSquare,
  Crown,
  Award,
  Radio,
  Check
} from 'lucide-react';
import { useZenPulse } from '@/context/ZenPulsePlatformContext';
import { PulseProfile } from '@/types/pulse';

export function DiscoverProfiles() {
  const { 
    profiles, 
    isFollowing, 
    hasPendingRequest, 
    toggleFollow, 
    openUserProfile,
    setSelectedProfileUsername,
    setActiveView,
    currentUserUsername 
  } = useZenPulse();

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedFilter, setSelectedFilter] = useState<string>('ALL');
  const [sheetUsers, setSheetUsers] = useState<PulseProfile[]>([]);

  // Fetch real registered sheet users on mount
  useEffect(() => {
    async function loadSheetUsers() {
      try {
        const res = await fetch('/api/sheets?action=GET_USERS&tab=Register+Data+Core');
        if (res.ok) {
          const data = await res.json();
          if (data.rows && Array.isArray(data.rows)) {
            const mapped: PulseProfile[] = data.rows.map((row: any, i: number) => {
              const uname = (row.username || row.email?.split('@')[0] || `delegate_${i}`).toLowerCase().replace(/[^a-z0-9_]/g, '');
              return {
                id: row.userId || `sheet_user_${i}`,
                username: uname,
                name: row.fullName || uname,
                bio: row.role ? `${row.role} • Sovereign Delegate` : 'Verified Zenvitra Community Delegate.',
                avatar: row.avatar || '',
                badge: (row.role?.toUpperCase().includes('ADMIN') || row.accessLevel === 'Admin') ? 'FOUNDER' : 'DELEGATE',
                accountType: 'personal',
                isVerified: true,
                isPrivate: false,
                isSubscribedOrganizer: false,
                followers: [],
                following: [],
                pendingFollowRequests: [],
                joinedDate: row.timestamp ? new Date(row.timestamp).toLocaleDateString([], { month: 'short', year: 'numeric' }) : '2026',
                civicClearance: {
                  level: 3,
                  title: 'Committee Chair',
                  reliabilityScore: 92,
                  verifiedCitationsCount: 8,
                  ratifiedTreatiesCount: 3,
                  endorsementsCount: 18,
                  stakedBountiesWon: 1
                }
              };
            });
            setSheetUsers(mapped);
          }
        }
      } catch (err) {
        console.warn('Sheet users fetch offline or local fallback active');
      }
    }
    loadSheetUsers();
  }, []);

  const filterOptions = ['ALL', 'FOUNDER', 'DELEGATE', 'ORGANIZATION', 'WRITER', 'THINKER', 'CREATOR', 'RESEARCHER'];

  // Combined master directory of profiles
  const allKnownProfiles = useMemo(() => {
    const combined = [...profiles];
    for (const su of sheetUsers) {
      if (!combined.some(p => p.username?.toLowerCase() === su.username?.toLowerCase())) {
        combined.push(su);
      }
    }
    return combined;
  }, [profiles, sheetUsers]);

  const cleanQuery = searchQuery.trim().toLowerCase().replace(/^@/, '');

  // Exact & filtered matches
  const filteredProfiles = useMemo(() => {
    return allKnownProfiles.filter((p) => {
      if (p.username?.toLowerCase() === (currentUserUsername || '').toLowerCase()) return false;
      const matchesSearch = 
        !cleanQuery ||
        (p.name && p.name.toLowerCase().includes(cleanQuery)) ||
        (p.username && p.username.toLowerCase().includes(cleanQuery)) ||
        (p.id && p.id.toLowerCase().includes(cleanQuery)) ||
        (p.bio && p.bio.toLowerCase().includes(cleanQuery)) ||
        (p.location && p.location.toLowerCase().includes(cleanQuery));

      const matchesFilter = selectedFilter === 'ALL' || (p.badge && p.badge.toUpperCase().includes(selectedFilter)) || ((p as any).category && (p as any).category.toUpperCase().includes(selectedFilter));
      return matchesSearch && matchesFilter;
    });
  }, [allKnownProfiles, cleanQuery, currentUserUsername, selectedFilter]);

  // Dynamic Real-Time Resolution candidate for ANY query/ID searched
  const dynamicCandidate: PulseProfile | null = useMemo(() => {
    if (!cleanQuery || cleanQuery.length < 2) return null;
    if (cleanQuery === (currentUserUsername || '').toLowerCase()) return null;
    const exists = allKnownProfiles.some(p => p.username?.toLowerCase() === cleanQuery || p.id?.toLowerCase() === cleanQuery);
    if (exists) return null;

    const isFounderQuery = cleanQuery === 'yuveer' || cleanQuery === 'founder' || cleanQuery === 'admin';
    return {
      id: `sovereign_node_${cleanQuery}`,
      username: cleanQuery,
      name: isFounderQuery ? 'Yuveer (Founder & CEO)' : cleanQuery.replace(/_/g, ' ').replace(/\b\w/g, c => c.toUpperCase()),
      bio: isFounderQuery ? 'Founder & Architect of Zenvitra Sovereign Infrastructure.' : `Sovereign delegate node registered on Zenvitra Plenary Grid.`,
      avatar: '',
      badge: isFounderQuery ? 'FOUNDER' : 'DELEGATE',
      accountType: isFounderQuery ? 'professional' : 'personal',
      isSubscribedOrganizer: isFounderQuery,
      isVerified: true,
      isPrivate: false,
      followers: [],
      following: [],
      pendingFollowRequests: [],
      joinedDate: '2026',
      civicClearance: {
        level: isFounderQuery ? 5 : 3,
        title: isFounderQuery ? 'Plenary Fellow' : 'Committee Chair',
        reliabilityScore: isFounderQuery ? 99 : 92,
        verifiedCitationsCount: isFounderQuery ? 24 : 10,
        ratifiedTreatiesCount: isFounderQuery ? 12 : 3,
        endorsementsCount: isFounderQuery ? 140 : 22,
        stakedBountiesWon: isFounderQuery ? 8 : 2
      }
    };
  }, [cleanQuery, allKnownProfiles, currentUserUsername]);

  const handleOpenProfile = (username: string) => {
    setSelectedProfileUsername(username);
    setActiveView('profile');
    openUserProfile(username);
  };

  return (
    <div className="max-w-5xl mx-auto font-sans pb-20 space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-white/10 pb-6">
        <div>
          <h2 className="font-display font-bold text-2xl text-white flex items-center gap-2.5">
            <span>Sovereign Global Directory</span>
            <span className="text-xs font-mono px-2.5 py-0.5 rounded-full bg-cyan-500/10 text-cyan-300 border border-cyan-500/30">
              Live Database
            </span>
          </h2>
          <p className="text-xs font-mono text-neutral-400 mt-1">
            Search any User ID, handle, name, committee node, or diplomat profile worldwide.
          </p>
        </div>

        {/* Search Input */}
        <div className="relative min-w-[280px]">
          <Search className="w-4 h-4 text-neutral-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search ANY @handle, ID, name, role..."
            className="w-full bg-black/60 border border-white/15 rounded-2xl pl-10 pr-4 py-2.5 text-xs text-white placeholder-neutral-500 focus:outline-none focus:border-cyan-400 transition font-mono"
          />
        </div>
      </div>

      {/* Filter Badges */}
      <div className="flex flex-wrap items-center gap-2">
        {filterOptions.map((filter) => (
          <button
            key={filter}
            type="button"
            onClick={() => setSelectedFilter(filter)}
            className={`px-3.5 py-1.5 rounded-xl font-mono text-xs font-semibold transition cursor-pointer border ${
              selectedFilter === filter
                ? 'bg-cyan-500/20 text-cyan-300 border-cyan-500/50 shadow-md font-bold'
                : 'bg-white/[0.03] text-neutral-400 border-white/10 hover:text-white hover:border-white/20'
            }`}
          >
            {filter}
          </button>
        ))}
      </div>

      {/* Dynamic Candidate Live Resolution Banner */}
      {dynamicCandidate && (
        <div className="p-5 rounded-3xl bg-gradient-to-r from-cyan-950/40 via-[#0a0d14] to-indigo-950/40 border border-cyan-500/40 shadow-[0_10px_35px_rgba(6,182,212,0.15)] flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="flex items-center gap-3.5">
            <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-cyan-400 via-indigo-500 to-purple-600 p-[2px] shrink-0">
              <div className="w-full h-full rounded-2xl bg-black flex items-center justify-center font-bold text-base text-cyan-300 uppercase">
                {dynamicCandidate.name[0]}
              </div>
            </div>

            <div>
              <div className="flex items-center gap-2">
                <span className="font-display font-bold text-sm text-white">
                  {dynamicCandidate.name}
                </span>
                <span className="px-2 py-0.5 rounded-full bg-cyan-500/20 text-cyan-300 text-[10px] font-mono font-bold border border-cyan-500/40">
                  {dynamicCandidate.badge}
                </span>
              </div>
              <p className="text-xs text-neutral-400 font-mono">
                @{dynamicCandidate.username} • {dynamicCandidate.civicClearance?.title || 'Delegate Node'}
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={() => handleOpenProfile(dynamicCandidate.username)}
            className="px-5 py-2 rounded-xl bg-cyan-400 hover:bg-cyan-300 text-black font-mono text-xs font-bold transition shadow-lg flex items-center gap-2 cursor-pointer shrink-0"
          >
            <span>Open Sovereign Profile</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>
      )}

      {/* Grid */}
      {filteredProfiles.length === 0 && !dynamicCandidate ? (
        <div className="text-center py-20 rounded-3xl p-8 border border-white/10 bg-black/40 space-y-3">
          <Globe2 className="w-10 h-10 text-neutral-600 mx-auto animate-pulse" />
          <p className="font-display font-bold text-base text-white">No exact directory match</p>
          <p className="text-xs font-mono text-neutral-500">
            Type any handle or user ID in the search box above to dynamically query and inspect their sovereign dossier.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredProfiles.map((p) => {
            const following = isFollowing(p.username);
            const pending = hasPendingRequest(p.username);

            return (
              <div
                key={p.id}
                onClick={() => handleOpenProfile(p.username)}
                className="group relative rounded-3xl p-6 bg-[#090b10] border border-white/[0.08] hover:border-cyan-400/40 transition-all duration-300 flex flex-col justify-between cursor-pointer shadow-lg space-y-5"
              >
                <div>
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex items-center gap-3">
                      <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-amber-400 via-rose-500 to-purple-600 p-[2px] shrink-0 group-hover:scale-105 transition">
                        <div className="w-full h-full rounded-2xl bg-black flex items-center justify-center font-bold text-sm text-white uppercase">
                          {p.name[0] || p.username[0] || 'U'}
                        </div>
                      </div>

                      <div className="overflow-hidden">
                        <div className="flex items-center gap-1.5">
                          <p className="font-bold text-sm text-white truncate group-hover:text-cyan-300 transition">
                            {p.name}
                          </p>
                          {p.badge === 'FOUNDER' && <Crown className="w-3.5 h-3.5 text-rose-400 shrink-0" />}
                          {p.isVerified && <ShieldCheck className="w-3.5 h-3.5 text-cyan-400 shrink-0" />}
                        </div>
                        <p className="text-xs text-neutral-500 font-mono truncate">@{p.username}</p>
                      </div>
                    </div>

                    <span className="px-2 py-0.5 rounded-full bg-white/5 border border-white/10 text-neutral-300 font-mono text-[9px] font-bold uppercase shrink-0">
                      {p.badge || 'DELEGATE'}
                    </span>
                  </div>

                  <p className="text-xs text-neutral-300 leading-relaxed font-sans line-clamp-2 mt-3.5">
                    {p.bio || 'Sovereign diplomatic delegate active on Zenvitra.'}
                  </p>
                </div>

                <div className="pt-3 border-t border-white/5 flex items-center justify-between">
                  <div className="flex items-center gap-1 text-[10px] font-mono text-neutral-400">
                    <Award className="w-3 h-3 text-amber-400" />
                    <span>Level {p.civicClearance?.level || 3} • {p.civicClearance?.reliabilityScore || 90}% Reliability</span>
                  </div>

                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      toggleFollow(p.username);
                    }}
                    className={`px-3 py-1 rounded-xl text-xs font-mono font-bold transition cursor-pointer ${
                      following
                        ? 'bg-white/10 text-white hover:bg-rose-500/20 hover:text-rose-300'
                        : 'bg-cyan-500 text-black hover:bg-cyan-400 shadow'
                    }`}
                  >
                    {following ? 'Following' : 'Connect'}
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
