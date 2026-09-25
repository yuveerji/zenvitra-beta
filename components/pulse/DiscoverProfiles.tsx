'use client';

import React, { useState, useEffect, useMemo, useRef } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
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
  Check,
  Film,
  Play,
  Volume2,
  VolumeX,
  Heart,
  Eye,
  TrendingUp,
  Hash,
  Tag,
  X,
  ChevronRight,
  Share2
} from 'lucide-react';
import { useZenPulse } from '@/context/ZenPulsePlatformContext';
import { PulseProfile, FluxVideo } from '@/types/pulse';

export function DiscoverProfiles() {
  const router = useRouter();
  const { 
    profiles, 
    fluxVideos,
    isFollowing, 
    hasPendingRequest, 
    toggleFollow, 
    openUserProfile,
    setSelectedProfileUsername,
    setActiveView,
    currentUserUsername 
  } = useZenPulse();

  const [searchQuery, setSearchQuery] = useState('');
  const [isSearchFocused, setIsSearchFocused] = useState(false);
  const [selectedFilter, setSelectedFilter] = useState<string>('ALL');
  const [activeTab, setActiveTab] = useState<'explore_grid' | 'directory'>('explore_grid');
  const [sheetUsers, setSheetUsers] = useState<PulseProfile[]>([]);
  const [activeModalFlux, setActiveModalFlux] = useState<FluxVideo | null>(null);
  const [modalMuted, setModalMuted] = useState(false);

  // Rotating Search Bar Placeholders (Flux Flood & Trending topics like Instagram)
  const rotatingPlaceholders = useMemo(() => [
    "Search dispatches, fluxes: #AIPPM, @yuveer...",
    "🔥 Trending Flux: UNSC Emergency Plenary Session...",
    "⚡ Flux Flood: 12.4k young delegates live...",
    "Search any @handle, sovereign ID, or topic...",
    "🎬 Discover Reels: #YouthSummit, #Diplomacy...",
  ], []);
  const [placeholderIndex, setPlaceholderIndex] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setPlaceholderIndex((prev) => (prev + 1) % rotatingPlaceholders.length);
    }, 3800);
    return () => clearInterval(timer);
  }, [rotatingPlaceholders.length]);

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

  const filterOptions = ['ALL', 'FLUX REELS', 'FOUNDER', 'DELEGATE', 'ORGANIZATION', 'WRITER', 'THINKER', 'CREATOR', 'RESEARCHER'];

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

  // Trending Suggestions
  const trendingSuggestions = useMemo(() => [
    { type: 'handle', label: '@yuveer', desc: 'Founder & Architect' },
    { type: 'handle', label: '@founder', desc: 'Core Secretariat' },
    { type: 'hashtag', label: '#AIPPM', desc: 'All India Political Parties Meet' },
    { type: 'hashtag', label: '#UNSC', desc: 'United Nations Security Council' },
    { type: 'hashtag', label: '#ClimateAccord', desc: 'COP30 Environmental Covenant' },
    { type: 'hashtag', label: '#Diplomacy', desc: 'Model UN & Foreign Policy' },
    { type: 'hashtag', label: '#SovereignID', desc: 'Zero Surveillance Identity' },
  ], []);

  // Filtered profiles for search
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

      const matchesFilter = selectedFilter === 'ALL' || selectedFilter === 'FLUX REELS' || (p.badge && p.badge.toUpperCase().includes(selectedFilter)) || ((p as any).category && (p as any).category.toUpperCase().includes(selectedFilter));
      return matchesSearch && matchesFilter;
    });
  }, [allKnownProfiles, cleanQuery, currentUserUsername, selectedFilter]);

  // Filtered flux videos for Instagram Explore Grid
  const filteredFluxVideos = useMemo(() => {
    return fluxVideos.filter((v) => {
      if (!cleanQuery) return true;
      return (
        v.caption.toLowerCase().includes(cleanQuery) ||
        v.authorUsername.toLowerCase().includes(cleanQuery) ||
        v.authorName.toLowerCase().includes(cleanQuery) ||
        v.tags?.some((t) => t.toLowerCase().includes(cleanQuery))
      );
    });
  }, [fluxVideos, cleanQuery]);

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
      name: isFounderQuery ? 'Founder & CEO' : cleanQuery.replace(/_/g, ' ').replace(/\b\w/g, c => c.toUpperCase()),
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

  const handleSuggestionClick = (item: { type: string; label: string }) => {
    if (item.type === 'handle') {
      const clean = item.label.replace(/^@/, '');
      handleOpenProfile(clean);
    } else {
      setSearchQuery(item.label);
    }
    setIsSearchFocused(false);
  };

  return (
    <div className="max-w-5xl mx-auto font-sans pb-20 space-y-6">
      {/* ── TOP HEADER & DYNAMIC SEARCH BAR WITH INSTAGRAM AUTOCOMPLETE ── */}
      <div className="space-y-4 border-b border-white/10 pb-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h2 className="font-display font-bold text-2xl text-white flex items-center gap-2.5">
              <span>Explore &amp; Directory</span>
              <span className="text-xs font-mono px-2.5 py-0.5 rounded-full bg-cyan-500/10 text-cyan-300 border border-cyan-500/30">
                Live Flux Grid
              </span>
            </h2>
            <p className="text-xs font-mono text-neutral-400 mt-1">
              Search any User ID, handle, topic, or browse Instagram-style Flux videos flooding the network.
            </p>
          </div>

          {/* View Mode Toggle: Instagram Explore Grid vs Directory */}
          <div className="flex items-center gap-1.5 p-1 rounded-2xl bg-white/5 border border-white/10 self-start sm:self-auto">
            <button
              onClick={() => setActiveTab('explore_grid')}
              className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl text-xs font-mono font-bold transition-all cursor-pointer ${
                activeTab === 'explore_grid'
                  ? 'bg-gradient-to-r from-fuchsia-600 to-rose-600 text-white shadow-lg shadow-fuchsia-600/30'
                  : 'text-neutral-400 hover:text-white'
              }`}
            >
              <Film className="w-3.5 h-3.5" />
              <span>Explore Grid</span>
            </button>
            <button
              onClick={() => setActiveTab('directory')}
              className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl text-xs font-mono font-bold transition-all cursor-pointer ${
                activeTab === 'directory'
                  ? 'bg-white text-black shadow-md'
                  : 'text-neutral-400 hover:text-white'
              }`}
            >
              <Users className="w-3.5 h-3.5" />
              <span>Directory</span>
            </button>
          </div>
        </div>

        {/* Dynamic Search Bar with Rotating Placeholder & Autocomplete Dropdown */}
        <div className="relative w-full">
          <div className="relative flex items-center">
            <Search className="w-4 h-4 text-cyan-400 absolute left-4 pointer-events-none" />
            <input
              type="text"
              value={searchQuery}
              onFocus={() => setIsSearchFocused(true)}
              onBlur={() => setTimeout(() => setIsSearchFocused(false), 250)}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder={rotatingPlaceholders[placeholderIndex]}
              className="w-full bg-[#090b12] border border-white/15 focus:border-cyan-400 rounded-2xl pl-11 pr-10 py-3 text-xs sm:text-sm text-white placeholder-neutral-500 focus:outline-none transition-all font-mono shadow-inner"
            />
            {searchQuery && (
              <button
                type="button"
                onClick={() => setSearchQuery('')}
                className="absolute right-3.5 p-1 text-neutral-400 hover:text-white cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            )}
          </div>

          {/* Autocomplete Suggestions Dropdown (Instagram Style) */}
          {isSearchFocused && (
            <div className="absolute top-full left-0 right-0 mt-2 z-50 rounded-2xl bg-[#090a10]/98 border border-white/15 shadow-[0_25px_60px_rgba(0,0,0,0.95)] backdrop-blur-2xl p-3 space-y-3 animate-fade-in">
              {/* Trending Topics & Handles Section */}
              <div>
                <div className="text-[10px] font-mono uppercase tracking-wider text-cyan-400 flex items-center gap-1.5 px-2 mb-2 font-bold">
                  <TrendingUp className="w-3 h-3 text-cyan-400" />
                  <span>Trending on Zenvitra &bull; Flux Floods</span>
                </div>
                <div className="flex flex-wrap gap-1.5 px-1">
                  {trendingSuggestions.map((item, idx) => (
                    <button
                      key={idx}
                      type="button"
                      onMouseDown={() => handleSuggestionClick(item)}
                      className="px-2.5 py-1.5 rounded-xl bg-white/5 hover:bg-white/15 border border-white/10 text-xs font-mono flex items-center gap-1.5 text-zinc-300 hover:text-white transition cursor-pointer"
                    >
                      {item.type === 'hashtag' ? <Hash className="w-3 h-3 text-fuchsia-400" /> : <Crown className="w-3 h-3 text-amber-400" />}
                      <span className="font-semibold">{item.label}</span>
                      <span className="text-[10px] text-neutral-500 hidden sm:inline">&bull; {item.desc}</span>
                    </button>
                  ))}
                </div>
              </div>

              {/* Feed Fluxes Quick Strip */}
              {fluxVideos.length > 0 && (
                <div className="pt-2 border-t border-white/10">
                  <div className="text-[10px] font-mono uppercase tracking-wider text-fuchsia-400 flex items-center justify-between px-2 mb-2 font-bold">
                    <span className="flex items-center gap-1.5">
                      <Film className="w-3 h-3 text-fuchsia-400" />
                      <span>Trending Flux Reels</span>
                    </span>
                    <button
                      onMouseDown={() => {
                        setActiveTab('explore_grid');
                        setIsSearchFocused(false);
                      }}
                      className="hover:underline text-[10px] text-zinc-400 hover:text-white cursor-pointer"
                    >
                      View All Grid →
                    </button>
                  </div>
                  <div className="grid grid-cols-3 sm:grid-cols-4 gap-2 px-1">
                    {fluxVideos.slice(0, 4).map((fv) => (
                      <div
                        key={fv.id}
                        onMouseDown={() => setActiveModalFlux(fv)}
                        className="relative aspect-[3/4] rounded-xl overflow-hidden bg-black/60 border border-white/10 cursor-pointer group hover:scale-[1.03] transition-all"
                      >
                        <video src={fv.videoUrl} className="w-full h-full object-cover" muted />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent pointer-events-none" />
                        <div className="absolute bottom-1 left-1 right-1 flex items-center justify-between text-[9px] font-mono text-white">
                          <span className="truncate">@{fv.authorUsername}</span>
                          <span className="flex items-center gap-0.5 text-rose-400">
                            <Heart className="w-2.5 h-2.5 fill-rose-500" />
                            <span>{fv.likes}</span>
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Filter Badges */}
        <div className="flex flex-wrap items-center gap-2">
          {filterOptions.map((filter) => (
            <button
              key={filter}
              type="button"
              onClick={() => {
                setSelectedFilter(filter);
                if (filter === 'FLUX REELS') setActiveTab('explore_grid');
              }}
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
      </div>

      {/* ── DYNAMIC CANDIDATE BANNER ── */}
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

      {/* ── 1. INSTAGRAM-STYLE EXPLORE FLUX GRID ── */}
      {activeTab === 'explore_grid' && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 text-xs font-mono text-neutral-400">
              <Film className="w-4 h-4 text-fuchsia-400" />
              <span>FLUX EXPLORE GRID &bull; Vertical Short-Form Video Stream</span>
            </div>
            <Link
              href="/pulse?tab=flux"
              className="text-xs font-mono text-cyan-400 hover:underline flex items-center gap-1"
            >
              <span>Full-Screen Reels</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          {filteredFluxVideos.length === 0 ? (
            <div className="text-center py-16 rounded-3xl p-8 border border-white/10 bg-black/40 space-y-3">
              <Film className="w-10 h-10 text-neutral-600 mx-auto animate-pulse" />
              <p className="font-display font-bold text-base text-white">No Flux reels match your search</p>
              <p className="text-xs font-mono text-neutral-500">
                Create a new flux dispatch or browse the full community directory.
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3 sm:gap-4">
              {filteredFluxVideos.map((flux, index) => {
                const isFeatured = index % 5 === 0;
                return (
                  <div
                    key={flux.id}
                    onClick={() => setActiveModalFlux(flux)}
                    className={`group relative rounded-2xl sm:rounded-3xl overflow-hidden bg-slate-950 border border-white/10 hover:border-fuchsia-500/60 shadow-xl cursor-pointer transition-all duration-300 hover:scale-[1.02] ${
                      isFeatured ? 'aspect-[9/16] row-span-2 sm:col-span-2 sm:aspect-auto sm:h-full' : 'aspect-[9/16]'
                    }`}
                  >
                    {/* Video / Poster */}
                    <video
                      src={flux.videoUrl}
                      poster={flux.thumbnailUrl}
                      muted
                      playsInline
                      loop
                      className="absolute inset-0 w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                      onMouseEnter={(e) => {
                        try {
                          e.currentTarget.play().catch(() => {});
                        } catch {}
                      }}
                      onMouseLeave={(e) => {
                        try {
                          e.currentTarget.pause();
                        } catch {}
                      }}
                    />

                    {/* Gradient Overlay */}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/20 to-black/30 pointer-events-none" />

                    {/* Top Badges: Reel Play Count & Audio */}
                    <div className="absolute top-2.5 left-2.5 right-2.5 flex items-center justify-between z-10">
                      <div className="flex items-center gap-1.5 px-2 py-0.5 rounded-full bg-black/60 backdrop-blur-md border border-white/15 text-[10px] font-mono text-white">
                        <Play className="w-2.5 h-2.5 fill-white text-white" />
                        <span>{flux.likes * 18 + 142}</span>
                      </div>

                      <div className="p-1 rounded-full bg-black/60 backdrop-blur-md border border-white/15 text-white opacity-0 group-hover:opacity-100 transition-opacity">
                        <Volume2 className="w-3 h-3 text-cyan-400" />
                      </div>
                    </div>

                    {/* Bottom Metadata: Creator & Caption */}
                    <div className="absolute bottom-3 left-3 right-3 z-10 space-y-1">
                      <div className="flex items-center gap-1.5">
                        <div className="w-5 h-5 rounded-full bg-fuchsia-500/30 border border-fuchsia-400/50 flex items-center justify-center text-[9px] font-bold text-white">
                          {flux.authorName[0]?.toUpperCase() || 'U'}
                        </div>
                        <span className="text-[11px] font-bold text-white truncate drop-shadow">
                          @{flux.authorUsername}
                        </span>
                      </div>

                      <p className="text-[10px] text-zinc-300 font-sans line-clamp-2 leading-snug drop-shadow">
                        {flux.caption}
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      )}

      {/* ── 2. SOVEREIGN CITIZENS DIRECTORY ── */}
      {activeTab === 'directory' && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 text-xs font-mono text-neutral-400">
              <Users className="w-4 h-4 text-cyan-400" />
              <span>SOVEREIGN DIRECTORY &bull; {filteredProfiles.length} Delegates &amp; Founders Active</span>
            </div>
          </div>

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
      )}

      {/* ── MODAL: FLUX VIDEO PLAYBACK MODAL (INSTAGRAM REEL STYLE) ── */}
      {activeModalFlux && (
        <div 
          className="fixed inset-0 z-50 bg-black/85 backdrop-blur-xl flex items-center justify-center p-4"
          onClick={() => setActiveModalFlux(null)}
        >
          <div 
            onClick={(e) => e.stopPropagation()}
            className="relative w-full max-w-sm sm:max-w-md h-[80vh] rounded-3xl overflow-hidden bg-black border border-white/20 shadow-2xl flex flex-col justify-between"
          >
            {/* Video element */}
            <video
              src={activeModalFlux.videoUrl}
              autoPlay
              playsInline
              loop
              muted={modalMuted}
              className="absolute inset-0 w-full h-full object-cover"
            />

            {/* Gradient Overlay */}
            <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-transparent to-black/85 pointer-events-none" />

            {/* Top Modal Controls */}
            <div className="relative z-20 p-4 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-rose-500 animate-pulse" />
                <span className="font-mono text-xs font-bold text-white uppercase">FLUX REEL</span>
              </div>

              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => setModalMuted(!modalMuted)}
                  className="p-2 rounded-full bg-black/60 border border-white/15 text-white hover:bg-white/10 cursor-pointer"
                >
                  {modalMuted ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4 text-cyan-400" />}
                </button>
                <button
                  type="button"
                  onClick={() => setActiveModalFlux(null)}
                  className="p-2 rounded-full bg-black/60 border border-white/15 text-white hover:bg-white/10 cursor-pointer"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Bottom Modal Metadata */}
            <div className="relative z-20 p-5 space-y-3">
              <div className="flex items-center justify-between">
                <div 
                  onClick={() => {
                    handleOpenProfile(activeModalFlux.authorUsername);
                    setActiveModalFlux(null);
                  }}
                  className="flex items-center gap-2.5 cursor-pointer"
                >
                  <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-fuchsia-500 to-rose-500 p-[2px]">
                    <div className="w-full h-full rounded-full bg-black flex items-center justify-center font-bold text-xs text-white">
                      {activeModalFlux.authorName[0]?.toUpperCase() || 'U'}
                    </div>
                  </div>
                  <div>
                    <div className="font-bold text-sm text-white">@{activeModalFlux.authorUsername}</div>
                    <div className="text-[10px] text-zinc-400 font-mono">{activeModalFlux.authorName}</div>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={() => router.push('/pulse?tab=flux')}
                  className="px-3.5 py-1.5 rounded-xl bg-white text-black font-mono text-xs font-bold hover:bg-zinc-200 transition"
                >
                  Open in Reels Feed →
                </button>
              </div>

              <p className="text-xs text-zinc-200 leading-relaxed font-sans line-clamp-3">
                {activeModalFlux.caption}
              </p>

              <div className="flex items-center gap-4 text-xs font-mono text-zinc-400 pt-1">
                <span className="flex items-center gap-1">
                  <Heart className="w-3.5 h-3.5 text-rose-500 fill-rose-500" />
                  <span>{activeModalFlux.likes} likes</span>
                </span>
                <span className="flex items-center gap-1">
                  <Eye className="w-3.5 h-3.5 text-cyan-400" />
                  <span>{activeModalFlux.likes * 18 + 142} views</span>
                </span>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
