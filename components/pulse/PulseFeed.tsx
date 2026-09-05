'use client';

import React, { useState, useMemo, useEffect } from 'react';
import { 
  Feather, 
  Heart, 
  RefreshCw, 
  Rss, 
  Sparkles, 
  Flame, 
  TrendingUp, 
  Globe, 
  Activity, 
  Layers, 
  Filter, 
  Compass, 
  Image as ImageIcon,
  Send,
  Users,
  UserCheck,
  ShieldCheck,
  Clock,
  Zap,
  ArrowUp,
  Landmark
} from 'lucide-react';
import { useZenPulse } from '@/context/ZenPulsePlatformContext';
import { PostCard } from './PostCard';
import { StoriesTray } from './StoriesTray';
import { PulseNavBar } from './PulseNavBar';
import { rankPulseFeed, FeedAlgorithmTab, RankedPulsePost } from '@/lib/pulseAlgorithm';

export function PulseFeed() {
  const {
    feedPosts, 
    likedPosts,
    myPosts,
    profiles,
    isFollowing,
    toggleFollow,
    openUserProfile,
    activeView, 
    setActiveView,
    currentUserName,
    currentUserUsername,
    currentUserId,
  } = useZenPulse();

  type FeedTab = 'foryou' | 'following' | 'latest' | 'trending' | 'politics' | 'media' | 'liked' | 'myposts';
  const [tab, setTab] = useState<FeedTab>('foryou');
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [prevPostCount, setPrevPostCount] = useState(feedPosts.length);
  const [hasNewPostsNotification, setHasNewPostsNotification] = useState(false);

  useEffect(() => {
    if (feedPosts.length > prevPostCount) {
      setHasNewPostsNotification(true);
    }
    setPrevPostCount(feedPosts.length);
  }, [feedPosts.length, prevPostCount]);

  const handleRefresh = () => {
    setIsRefreshing(true);
    setHasNewPostsNotification(false);
    setTimeout(() => setIsRefreshing(false), 600);
  };

  // ─── INSTAGRAM-STYLE SMART FEED RANKING ───
  const displayPosts = useMemo((): RankedPulsePost[] => {
    let rawPosts = feedPosts;
    if (tab === 'liked') rawPosts = likedPosts;
    else if (tab === 'myposts') rawPosts = myPosts;
    else if (tab === 'media') rawPosts = feedPosts.filter((p) => p.images && p.images.length > 0);

    return rankPulseFeed({
      posts: rawPosts,
      currentUserId,
      currentUserUsername,
      isFollowing,
      tab: tab as FeedAlgorithmTab,
    });
  }, [tab, feedPosts, likedPosts, myPosts, currentUserId, currentUserUsername, isFollowing]);

  // Suggested profiles to follow
  const suggestedProfiles = profiles
    .filter((p) => p.username !== currentUserUsername && !isFollowing(p.username))
    .slice(0, 4);

  return (
    <div className="max-w-6xl mx-auto font-sans pb-20">
      {/* Top Nav Switcher */}
      <PulseNavBar />

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Main Feed Column */}
        <div className="lg:col-span-8 space-y-6">
          {/* Header & Stories */}
          <div className="rounded-3xl bg-[#060810]/85 backdrop-blur-2xl border border-white/[0.08] overflow-hidden shadow-2xl">
            {/* Header Telemetry */}
            <div className="flex items-center justify-between px-5 py-4 border-b border-white/[0.06]">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-2xl bg-gradient-to-tr from-cyan-400 via-violet-500 to-rose-500 p-0.5 shadow-md">
                  <div className="w-full h-full rounded-[14px] bg-[#06080c] flex items-center justify-center">
                    <Activity className="w-4 h-4 text-cyan-400 animate-pulse" />
                  </div>
                </div>
                <div>
                  <h1 className="font-display font-bold text-base sm:text-lg text-white tracking-wide flex items-center gap-2">
                    ZEN.PULSE
                    <span className="text-[9px] font-mono font-semibold px-2.5 py-0.5 rounded-full bg-cyan-500/10 text-cyan-400 border border-cyan-500/30">
                      YOUTH FEED
                    </span>
                  </h1>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={handleRefresh}
                  className={`p-2 rounded-xl text-neutral-400 hover:text-white hover:bg-white/[0.05] transition cursor-pointer ${
                    isRefreshing ? 'animate-spin text-cyan-400' : ''
                  }`}
                  title="Refresh matrix"
                >
                  <RefreshCw className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Stories Tray */}
            <StoriesTray />

            {/* Filter Tabs with Sliding Indicator */}
            <div className="flex px-2 border-t border-white/[0.06] bg-white/[0.01] overflow-x-auto scrollbar-none">
              {[
                { id: 'foryou', label: 'For You', icon: Sparkles },
                { id: 'following', label: 'Following', icon: Users },
                { id: 'latest', label: 'Latest', icon: Clock },
                { id: 'trending', label: 'Trending', icon: Flame },
                { id: 'politics', label: 'Politics & Policy', icon: Landmark },
                { id: 'media', label: 'Media Wire', icon: ImageIcon },
                { id: 'liked', label: 'Applauded', icon: Heart },
                { id: 'myposts', label: 'My Dispatches', icon: Compass },
              ].map((item) => {
                const Icon = item.icon;
                const isActive = tab === item.id;
                return (
                  <button
                    key={item.id}
                    onClick={() => setTab(item.id as FeedTab)}
                    className={`flex-1 py-3 px-3 text-xs font-mono font-semibold flex items-center justify-center gap-1.5 transition cursor-pointer relative whitespace-nowrap shrink-0 ${
                      isActive ? 'text-white' : 'text-neutral-500 hover:text-neutral-300'
                    }`}
                  >
                    <Icon className={`w-3.5 h-3.5 ${isActive ? 'text-cyan-400' : 'text-neutral-500'}`} />
                    <span>{item.label}</span>
                    {isActive && (
                      <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-12 h-0.5 bg-gradient-to-r from-cyan-400 to-violet-500 rounded-full shadow-[0_0_10px_rgba(0,242,254,0.8)]" />
                    )}
                  </button>
                );
              })}
            </div>

            {/* Smart Algorithm Telemetry Strip */}
            {tab === 'foryou' && (
              <div className="px-4 py-2 bg-gradient-to-r from-cyan-950/40 via-purple-950/30 to-black border-t border-white/[0.06] flex items-center justify-between text-[11px] font-mono text-cyan-300/90">
                <div className="flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-cyan-400 animate-pulse shadow-[0_0_8px_#06b6d4]" />
                  <span>
                    <strong>Smart Matrix:</strong> Followings prioritized &bull; Fresh items dynamically interleaved
                  </span>
                </div>
                <span className="hidden sm:inline-block text-neutral-400 text-[10px]">
                  Instagram-Style Engine
                </span>
              </div>
            )}

            {tab === 'following' && (
              <div className="px-4 py-2 bg-gradient-to-r from-blue-950/40 to-black border-t border-white/[0.06] flex items-center justify-between text-[11px] font-mono text-blue-300">
                <div className="flex items-center gap-2">
                  <Users className="w-3.5 h-3.5 text-blue-400" />
                  <span>Exclusive dispatches from sovereign nodes you follow</span>
                </div>
                <span className="text-neutral-400 text-[10px]">{displayPosts.length} posts</span>
              </div>
            )}

            {tab === 'latest' && (
              <div className="px-4 py-2 bg-gradient-to-r from-emerald-950/40 to-black border-t border-white/[0.06] flex items-center justify-between text-[11px] font-mono text-emerald-300">
                <div className="flex items-center gap-2">
                  <Clock className="w-3.5 h-3.5 text-emerald-400" />
                  <span>Real-time chronological timeline &bull; Clean newest-first</span>
                </div>
              </div>
            )}
          </div>

          {/* New Posts Floating Pill (Instagram-style) */}
          {hasNewPostsNotification && (
            <div className="flex justify-center -my-2 sticky top-20 z-20">
              <button
                onClick={() => {
                  window.scrollTo({ top: 0, behavior: 'smooth' });
                  handleRefresh();
                }}
                className="px-4 py-2 rounded-full bg-gradient-to-r from-cyan-500 via-indigo-500 to-purple-600 text-white font-mono text-xs font-bold shadow-[0_0_20px_rgba(6,182,212,0.6)] flex items-center gap-2 cursor-pointer hover:scale-105 transition-all"
              >
                <ArrowUp className="w-3.5 h-3.5" />
                <span>⚡ Fresh Dispatches Available &bull; View Now</span>
              </button>
            </div>
          )}

          {/* Quick Compose Input Box */}
          <div
            onClick={() => setActiveView('compose')}
            className="group rounded-3xl p-4 sm:p-5 card-luxury border border-white/[0.08] hover:border-cyan-500/30 transition-all duration-300 cursor-pointer flex items-center gap-3.5 shadow-lg"
          >
            <div className="w-11 h-11 rounded-2xl bg-gradient-to-tr from-cyan-400/20 via-violet-500/20 to-transparent border border-white/15 flex items-center justify-center font-display font-bold text-sm text-white shrink-0 group-hover:scale-105 transition-transform">
              {(currentUserName || 'U')[0]?.toUpperCase() || 'U'}
            </div>

            <div className="flex-1 min-w-0">
              <p className="text-sm font-sans text-neutral-400 group-hover:text-neutral-200 transition truncate">
                Broadcast a thought, resolution, or photo dispatch...
              </p>
            </div>

            <div className="flex items-center gap-2">
              <div className="p-2 rounded-xl bg-white/[0.04] text-cyan-400 group-hover:bg-cyan-500/10 transition">
                <ImageIcon className="w-4 h-4" />
              </div>
              <div className="p-2 rounded-xl bg-white text-black group-hover:bg-neutral-200 transition shadow-sm">
                <Send className="w-3.5 h-3.5 fill-current" />
              </div>
            </div>
          </div>

          {/* Posts Stream */}
          <div className="space-y-4">
            {displayPosts.length === 0 ? (
              <div className="rounded-3xl p-12 text-center card-luxury border border-white/[0.08] my-4 space-y-4">
                <div className="w-16 h-16 rounded-3xl bg-white/[0.04] border border-white/10 flex items-center justify-center mx-auto shadow-inner">
                  <Rss className="w-8 h-8 text-neutral-500" />
                </div>
                <div>
                  <h3 className="font-display font-bold text-lg text-white">
                    {tab === 'following'
                      ? 'No posts from followed members yet'
                      : tab === 'liked'
                      ? 'No applauded dispatches'
                      : tab === 'media'
                      ? 'No media dispatches found'
                      : tab === 'myposts'
                      ? 'You have not dispatched yet'
                      : 'The feed is quiet'}
                  </h3>
                  <p className="text-xs font-mono text-neutral-400 max-w-sm mx-auto mt-1">
                    {tab === 'following'
                      ? 'Follow more creators, thinkers, and innovators from the Discover directory to see their updates.'
                      : 'Start the conversation and broadcast your thoughts.'}
                  </p>
                </div>

                <button
                  onClick={() => setActiveView(tab === 'following' ? 'discover' : 'compose')}
                  className="px-6 py-2.5 rounded-2xl bg-white hover:bg-neutral-200 text-black font-display font-bold text-xs uppercase tracking-wider transition shadow-lg cursor-pointer"
                >
                  {tab === 'following' ? 'Discover People & Creators' : 'Compose Dispatch'}
                </button>
              </div>
            ) : (
              displayPosts.map((post) => (
                <PostCard key={post.id} post={post} />
              ))
            )}
          </div>
        </div>

        {/* Right Sidebar: Suggested Youth + Safe Space Statement */}
        <div className="hidden lg:block lg:col-span-4 space-y-6">
          {/* Safe Space Mission Card */}
          <div className="rounded-3xl p-6 bg-gradient-to-br from-cyan-950/30 via-[#070a14] to-violet-950/30 border border-cyan-500/20 shadow-xl space-y-3">
            <div className="flex items-center gap-2 text-cyan-300 font-mono text-xs font-bold">
              <ShieldCheck className="w-4 h-4 text-cyan-400" />
              <span>YOUTH SAFE SPACE</span>
            </div>
            <p className="text-xs font-sans text-neutral-300 leading-relaxed">
              Zenvitra is strictly ad-free and surveillance-free. Built for meaningful dialogue, diplomatic summits, and youth empowerment.
            </p>
          </div>

          {/* Suggested Youth to Follow */}
          {suggestedProfiles.length > 0 && (
            <div className="rounded-3xl p-6 card-luxury border border-white/10 space-y-4 shadow-xl">
              <div className="flex items-center justify-between pb-2 border-b border-white/[0.06]">
                <h3 className="font-display font-bold text-sm text-white flex items-center gap-2">
                  <Users className="w-4 h-4 text-cyan-400" />
                  Youth to Follow
                </h3>
                <button
                  onClick={() => setActiveView('discover')}
                  className="text-[10px] font-mono text-cyan-400 hover:underline cursor-pointer"
                >
                  View All
                </button>
              </div>

              <div className="space-y-3.5">
                {suggestedProfiles.map((p) => {
                  const following = isFollowing(p.username);
                  return (
                    <div key={p.id} className="flex items-center justify-between gap-3">
                      <div
                        onClick={() => openUserProfile(p.username)}
                        className="flex items-center gap-2.5 min-w-0 cursor-pointer group"
                      >
                        <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-cyan-400 to-violet-500 p-0.5 shrink-0 group-hover:scale-105 transition-transform">
                          <div className="w-full h-full rounded-[10px] bg-black flex items-center justify-center font-display font-bold text-xs text-white">
                            {p.name?.[0]?.toUpperCase() || 'U'}
                          </div>
                        </div>
                        <div className="min-w-0">
                          <p className="text-xs font-semibold text-white group-hover:text-cyan-300 transition truncate">{p.name}</p>
                          <p className="text-[10px] font-mono text-neutral-500 truncate">@{p.username}</p>
                        </div>
                      </div>

                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          toggleFollow(p.username);
                        }}
                        className={`px-3 py-1 rounded-xl font-mono text-xs font-bold transition cursor-pointer shrink-0 shadow-sm ${
                          following
                            ? 'bg-emerald-500/15 border border-emerald-500/30 text-emerald-300'
                            : 'bg-white/[0.08] hover:bg-white text-white hover:text-black'
                        }`}
                      >
                        {following ? 'Following' : '+ Follow'}
                      </button>
                    </div>
                  );
                })}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
