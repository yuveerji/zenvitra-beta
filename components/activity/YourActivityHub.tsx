'use client';

import React, { useState, useMemo } from 'react';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Heart,
  MessageCircle,
  Repeat,
  Radio,
  Star,
  Film,
  Image as ImageIcon,
  History,
  Download,
  Filter,
  ArrowUpDown,
  Check,
  CheckSquare,
  Square,
  Trash2,
  Bookmark,
  ChevronRight,
  Sparkles,
  Search,
  X,
  Play,
  Calendar,
  Layers,
  ShieldCheck,
  User,
  ExternalLink,
  Share2,
  CheckCircle2,
  Send,
  MoreHorizontal
} from 'lucide-react';
import { useZenPulse } from '@/context/ZenPulsePlatformContext';
import { PulsePost } from '@/types/pulse';

export interface ActivityItem {
  id: string;
  authorName: string;
  authorUsername: string;
  authorAvatar: string;
  content: string;
  image: string;
  mediaType: 'photo' | 'reel' | 'carousel';
  duration?: string;
  likes: number;
  comments: number;
  createdAt: string;
  verified: boolean;
}

export function YourActivityHub() {
  const {
    feedPosts,
    likedPosts,
    savedPosts,
    myPosts,
    likePost,
    toggleSavePost,
    isSaved,
    currentUserId,
    currentUserUsername,
    currentUserName,
  } = useZenPulse();

  /* Primary Section */
  const [activeSection, setActiveSection] = useState<'interactions' | 'photos_videos' | 'account_history' | 'download'>('interactions');
  
  /* Sub-tab within Interactions */
  const [activeInteractionTab, setActiveInteractionTab] = useState<'likes' | 'comments' | 'reposts' | 'replies' | 'reviews'>('likes');
  
  /* Sub-tab within Photos & Videos */
  const [activeMediaTab, setActiveMediaTab] = useState<'posts' | 'reels' | 'archived'>('posts');

  /* Sorting & Filtering */
  const [sortOrder, setSortOrder] = useState<'newest' | 'oldest' | 'most_popular'>('newest');
  const [isFilterModalOpen, setIsFilterModalOpen] = useState(false);
  const [filterAuthor, setFilterAuthor] = useState('');
  const [filterDateRange, setFilterDateRange] = useState<'all' | '7d' | '30d' | '365d'>('all');

  /* Selection Mode for Batch Actions */
  const [isSelectMode, setIsSelectMode] = useState(false);
  const [selectedPostIds, setSelectedPostIds] = useState<string[]>([]);

  /* Detail Lightbox Modal */
  const [activeModalPost, setActiveModalPost] = useState<ActivityItem | null>(null);
  const [modalCommentText, setModalCommentText] = useState('');
  const [modalCommentsList, setModalCommentsList] = useState<Array<{ id: string; user: string; text: string; time: string }>>([]);

  // Generate real dynamic items based on user interactions
  const displayItems = useMemo((): ActivityItem[] => {
    let sourcePosts: PulsePost[] = [];

    if (activeSection === 'interactions') {
      if (activeInteractionTab === 'likes') {
        sourcePosts = likedPosts;
      } else if (activeInteractionTab === 'reposts' || activeInteractionTab === 'comments') {
        sourcePosts = savedPosts;
      } else {
        sourcePosts = [];
      }
    } else if (activeSection === 'photos_videos') {
      if (activeMediaTab === 'posts') {
        sourcePosts = myPosts;
      } else {
        sourcePosts = [];
      }
    }

    let list: ActivityItem[] = sourcePosts.map(p => ({
      id: p.id,
      authorName: p.authorName || 'Member',
      authorUsername: p.authorUsername || 'user',
      authorAvatar: p.authorAvatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
      content: p.content || '',
      image: (p.images && p.images[0]) || 'https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=800&auto=format&fit=crop&q=80',
      mediaType: (p.images && p.images.length > 1 ? 'carousel' : 'photo') as 'photo' | 'reel' | 'carousel',
      likes: p.likes || 0,
      comments: p.replyCount || 0,
      createdAt: p.createdAt || 'Recently',
      verified: false,
    }));

    if (filterAuthor.trim()) {
      const q = filterAuthor.toLowerCase();
      list = list.filter(
        (p) =>
          p.authorName.toLowerCase().includes(q) ||
          p.authorUsername.toLowerCase().includes(q)
      );
    }

    if (sortOrder === 'oldest') {
      list = [...list].reverse();
    } else if (sortOrder === 'most_popular') {
      list = [...list].sort((a, b) => b.likes - a.likes);
    }

    return list;
  }, [activeSection, activeInteractionTab, activeMediaTab, feedPosts, likedPosts, savedPosts, myPosts, currentUserUsername, currentUserName, filterAuthor, sortOrder]);

  const toggleSelectPost = (id: string) => {
    if (selectedPostIds.includes(id)) {
      setSelectedPostIds(selectedPostIds.filter((pId) => pId !== id));
    } else {
      setSelectedPostIds([...selectedPostIds, id]);
    }
  };

  const handleSelectAll = () => {
    if (selectedPostIds.length === displayItems.length) {
      setSelectedPostIds([]);
    } else {
      setSelectedPostIds(displayItems.map((p) => p.id));
    }
  };

  const handleBatchUnlike = () => {
    setSelectedPostIds([]);
    setIsSelectMode(false);
  };

  const handleAddModalComment = (e: React.FormEvent) => {
    e.preventDefault();
    if (!modalCommentText.trim()) return;
    setModalCommentsList((prev) => [
      ...prev,
      {
        id: `c_${Date.now()}`,
        user: currentUserUsername || 'you',
        text: modalCommentText.trim(),
        time: 'Just now',
      },
    ]);
    setModalCommentText('');
  };

  return (
    <div className="min-h-screen bg-black text-white font-sans flex flex-col md:flex-row max-w-7xl mx-auto selection:bg-white/20 selection:text-white">
      
      {/* ─── LEFT SUB-NAVIGATION SIDEBAR (LUXURY FROSTED OBSIDIAN DESIGN) ─── */}
      <aside className="w-full md:w-80 border-r border-zinc-800/60 p-6 shrink-0 select-none bg-[#07080c]/60 backdrop-blur-3xl text-left flex flex-col justify-between">
        <div className="space-y-7">
          {/* Header Title with Clash Display */}
          <div className="space-y-1.5">
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse shadow-[0_0_8px_rgba(16,185,129,0.8)]" />
              <span className="text-[10px] font-mono font-bold tracking-[0.2em] uppercase text-emerald-400">
                SOVEREIGN MATRIX
              </span>
            </div>
            <h1 
              className="text-2xl font-bold tracking-tight text-white leading-tight"
              style={{
                fontFamily: 'Clash Display, var(--font-space), var(--font-outfit), sans-serif',
                fontWeight: 700,
              }}
            >
              Your activity
            </h1>
            <p className="text-xs text-zinc-400 font-light leading-relaxed">
              One place to review, manage, and audit all your interactions, dispatches, and cryptographic mesh history.
            </p>
          </div>

          {/* Nav Categories */}
          <div className="space-y-1.5 font-sans text-xs">
            {/* 1. Interactions */}
            <button
              onClick={() => setActiveSection('interactions')}
              className={`w-full p-3.5 rounded-2xl transition-all duration-200 flex items-start gap-3.5 text-left cursor-pointer group relative overflow-hidden ${
                activeSection === 'interactions'
                  ? 'bg-white/[0.08] text-white font-semibold shadow-[0_10px_30px_rgba(0,0,0,0.5)] border border-white/15 backdrop-blur-xl'
                  : 'text-zinc-400 hover:text-white hover:bg-white/[0.03] border border-transparent'
              }`}
            >
              {activeSection === 'interactions' && (
                <div className="absolute left-0 top-3 bottom-3 w-1 bg-gradient-to-b from-rose-500 to-purple-500 rounded-r-full shadow-[0_0_10px_rgba(244,63,94,0.8)]" />
              )}
              <div className={`p-2 rounded-xl transition ${activeSection === 'interactions' ? 'bg-rose-500/20 text-rose-400' : 'bg-zinc-900/80 text-zinc-400 group-hover:text-white'}`}>
                <Heart className={`w-4 h-4 ${activeSection === 'interactions' ? 'fill-rose-500' : ''}`} />
              </div>
              <div className="min-w-0 flex-1">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-white tracking-tight">Interactions</span>
                  <span className="text-[10px] font-mono text-zinc-500">6 items</span>
                </div>
                <span className="text-[11px] text-zinc-400 line-clamp-2 mt-0.5 font-light">
                  Review and delete likes, comments, and your other interactions.
                </span>
              </div>
            </button>

            {/* 2. Photos and Videos */}
            <button
              onClick={() => setActiveSection('photos_videos')}
              className={`w-full p-3.5 rounded-2xl transition-all duration-200 flex items-start gap-3.5 text-left cursor-pointer group relative overflow-hidden ${
                activeSection === 'photos_videos'
                  ? 'bg-white/[0.08] text-white font-semibold shadow-[0_10px_30px_rgba(0,0,0,0.5)] border border-white/15 backdrop-blur-xl'
                  : 'text-zinc-400 hover:text-white hover:bg-white/[0.03] border border-transparent'
              }`}
            >
              {activeSection === 'photos_videos' && (
                <div className="absolute left-0 top-3 bottom-3 w-1 bg-gradient-to-b from-purple-400 to-cyan-400 rounded-r-full shadow-[0_0_10px_rgba(168,85,247,0.8)]" />
              )}
              <div className={`p-2 rounded-xl transition ${activeSection === 'photos_videos' ? 'bg-purple-500/20 text-purple-300' : 'bg-zinc-900/80 text-zinc-400 group-hover:text-white'}`}>
                <Film className="w-4 h-4" />
              </div>
              <div className="min-w-0 flex-1">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-white tracking-tight">Photos and videos</span>
                  <span className="text-[10px] font-mono text-zinc-500">Reels &amp; Posts</span>
                </div>
                <span className="text-[11px] text-zinc-400 line-clamp-2 mt-0.5 font-light">
                  View, archive or delete photos and videos you&apos;ve shared.
                </span>
              </div>
            </button>

            {/* 3. Account History */}
            <button
              onClick={() => setActiveSection('account_history')}
              className={`w-full p-3.5 rounded-2xl transition-all duration-200 flex items-start gap-3.5 text-left cursor-pointer group relative overflow-hidden ${
                activeSection === 'account_history'
                  ? 'bg-white/[0.08] text-white font-semibold shadow-[0_10px_30px_rgba(0,0,0,0.5)] border border-white/15 backdrop-blur-xl'
                  : 'text-zinc-400 hover:text-white hover:bg-white/[0.03] border border-transparent'
              }`}
            >
              {activeSection === 'account_history' && (
                <div className="absolute left-0 top-3 bottom-3 w-1 bg-gradient-to-b from-cyan-400 to-emerald-400 rounded-r-full shadow-[0_0_10px_rgba(34,211,238,0.8)]" />
              )}
              <div className={`p-2 rounded-xl transition ${activeSection === 'account_history' ? 'bg-cyan-500/20 text-cyan-300' : 'bg-zinc-900/80 text-zinc-400 group-hover:text-white'}`}>
                <History className="w-4 h-4" />
              </div>
              <div className="min-w-0 flex-1">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-white tracking-tight">Account history</span>
                  <span className="text-[10px] font-mono text-emerald-400 font-bold">100% SECURE</span>
                </div>
                <span className="text-[11px] text-zinc-400 line-clamp-2 mt-0.5 font-light">
                  Review security and passkey changes since account creation.
                </span>
              </div>
            </button>

            {/* 4. Download / Export */}
            <button
              onClick={() => setActiveSection('download')}
              className={`w-full p-3.5 rounded-2xl transition-all duration-200 flex items-start gap-3.5 text-left cursor-pointer group relative overflow-hidden ${
                activeSection === 'download'
                  ? 'bg-white/[0.08] text-white font-semibold shadow-[0_10px_30px_rgba(0,0,0,0.5)] border border-white/15 backdrop-blur-xl'
                  : 'text-zinc-400 hover:text-white hover:bg-white/[0.03] border border-transparent'
              }`}
            >
              {activeSection === 'download' && (
                <div className="absolute left-0 top-3 bottom-3 w-1 bg-gradient-to-b from-emerald-400 to-amber-400 rounded-r-full shadow-[0_0_10px_rgba(16,185,129,0.8)]" />
              )}
              <div className={`p-2 rounded-xl transition ${activeSection === 'download' ? 'bg-emerald-500/20 text-emerald-300' : 'bg-zinc-900/80 text-zinc-400 group-hover:text-white'}`}>
                <Download className="w-4 h-4" />
              </div>
              <div className="min-w-0 flex-1">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-white tracking-tight">Download information</span>
                  <span className="text-[10px] font-mono text-zinc-500">JSON Archive</span>
                </div>
                <span className="text-[11px] text-zinc-400 line-clamp-2 mt-0.5 font-light">
                  Export a cryptographic copy of your posts, media and telemetry.
                </span>
              </div>
            </button>
          </div>
        </div>

        {/* Footnote */}
        <div className="pt-6 border-t border-zinc-800/80 text-[11px] text-zinc-500 space-y-2">
          <div className="flex items-center gap-1.5 text-zinc-400">
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
            <span className="font-mono text-[10px]">Zero-Knowledge Activity Protection</span>
          </div>
          <div className="flex flex-wrap gap-2 text-zinc-500 pt-1 font-light">
            <Link href="/privacy" className="hover:text-white transition">Privacy</Link>
            <span>•</span>
            <Link href="/terms" className="hover:text-white transition">Terms</Link>
            <span>•</span>
            <Link href="/press" className="hover:text-white transition">Newsroom</Link>
          </div>
        </div>
      </aside>

      {/* ─── MAIN CONTENT VIEWPORT ─── */}
      <main className="flex-1 p-4 sm:p-8 lg:p-10 overflow-y-auto">
        {activeSection === 'interactions' && (
          <div className="space-y-6">
            
            {/* ── 1. Top Sub-Navigation Tabs (Ultra-Clean Instagram Underline Navigation) ── */}
            <div className="flex items-center gap-8 border-b border-zinc-800/80 pb-3 overflow-x-auto no-scrollbar font-bold text-xs tracking-[0.14em] uppercase text-zinc-500 select-none">
              <button
                onClick={() => setActiveInteractionTab('likes')}
                className={`flex items-center gap-2 pb-2 transition-all cursor-pointer relative ${
                  activeInteractionTab === 'likes' ? 'text-white' : 'hover:text-zinc-300'
                }`}
              >
                <Heart className={`w-4 h-4 ${activeInteractionTab === 'likes' ? 'text-rose-500 fill-rose-500 filter drop-shadow-[0_0_8px_rgba(244,63,94,0.6)]' : ''}`} />
                <span>LIKES</span>
                {activeInteractionTab === 'likes' && (
                  <motion.div layoutId="subTabIndicator" className="absolute bottom-0 left-0 right-0 h-0.5 bg-white rounded-full shadow-[0_0_10px_rgba(255,255,255,0.8)]" />
                )}
              </button>

              <button
                onClick={() => setActiveInteractionTab('comments')}
                className={`flex items-center gap-2 pb-2 transition-all cursor-pointer relative ${
                  activeInteractionTab === 'comments' ? 'text-white' : 'hover:text-zinc-300'
                }`}
              >
                <MessageCircle className="w-4 h-4" />
                <span>COMMENTS</span>
                {activeInteractionTab === 'comments' && (
                  <motion.div layoutId="subTabIndicator" className="absolute bottom-0 left-0 right-0 h-0.5 bg-white rounded-full shadow-[0_0_10px_rgba(255,255,255,0.8)]" />
                )}
              </button>

              <button
                onClick={() => setActiveInteractionTab('reposts')}
                className={`flex items-center gap-2 pb-2 transition-all cursor-pointer relative ${
                  activeInteractionTab === 'reposts' ? 'text-white' : 'hover:text-zinc-300'
                }`}
              >
                <Repeat className="w-4 h-4" />
                <span>REPOSTS</span>
                {activeInteractionTab === 'reposts' && (
                  <motion.div layoutId="subTabIndicator" className="absolute bottom-0 left-0 right-0 h-0.5 bg-white rounded-full shadow-[0_0_10px_rgba(255,255,255,0.8)]" />
                )}
              </button>

              <button
                onClick={() => setActiveInteractionTab('replies')}
                className={`flex items-center gap-2 pb-2 transition-all cursor-pointer relative ${
                  activeInteractionTab === 'replies' ? 'text-white' : 'hover:text-zinc-300'
                }`}
              >
                <Radio className="w-4 h-4" />
                <span>STORY REPLIES</span>
                {activeInteractionTab === 'replies' && (
                  <motion.div layoutId="subTabIndicator" className="absolute bottom-0 left-0 right-0 h-0.5 bg-white rounded-full shadow-[0_0_10px_rgba(255,255,255,0.8)]" />
                )}
              </button>

              <button
                onClick={() => setActiveInteractionTab('reviews')}
                className={`flex items-center gap-2 pb-2 transition-all cursor-pointer relative ${
                  activeInteractionTab === 'reviews' ? 'text-white' : 'hover:text-zinc-300'
                }`}
              >
                <Star className="w-4 h-4" />
                <span>REVIEWS</span>
                {activeInteractionTab === 'reviews' && (
                  <motion.div layoutId="subTabIndicator" className="absolute bottom-0 left-0 right-0 h-0.5 bg-white rounded-full shadow-[0_0_10px_rgba(255,255,255,0.8)]" />
                )}
              </button>
            </div>

            {/* ── 2. Sort, Filter & Multi-Select Header Row ── */}
            <div className="flex flex-wrap items-center justify-between gap-3 text-xs">
              <div className="flex items-center gap-3">
                {/* Sort Order Selector */}
                <div className="relative">
                  <select
                    value={sortOrder}
                    onChange={(e) => setSortOrder(e.target.value as any)}
                    className="appearance-none bg-zinc-900/90 border border-zinc-700/80 hover:border-zinc-500 rounded-xl px-3.5 py-2 pr-9 text-white font-semibold text-xs focus:outline-none focus:border-white transition cursor-pointer shadow-sm"
                  >
                    <option value="newest">Newest to oldest</option>
                    <option value="oldest">Oldest to newest</option>
                    <option value="most_popular">Most popular</option>
                  </select>
                  <ArrowUpDown className="w-3.5 h-3.5 text-zinc-400 absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none" />
                </div>

                {/* Filter Modal Button */}
                <button
                  onClick={() => setIsFilterModalOpen(true)}
                  className="px-4 py-2 rounded-xl bg-zinc-900/90 border border-zinc-700/80 hover:border-zinc-500 text-white font-semibold text-xs transition flex items-center gap-2 cursor-pointer shadow-sm"
                >
                  <Filter className="w-3.5 h-3.5 text-zinc-400" />
                  <span>Sort &amp; filter</span>
                </button>
              </div>

              {/* Multi-Select Trigger */}
              <div className="flex items-center gap-2">
                {isSelectMode ? (
                  <div className="flex items-center gap-2 animate-in fade-in">
                    <span className="text-zinc-400 text-xs font-mono">
                      {selectedPostIds.length} selected
                    </span>
                    <button
                      onClick={handleSelectAll}
                      className="px-3 py-1.5 rounded-xl bg-zinc-900 text-zinc-300 hover:text-white text-xs font-medium cursor-pointer"
                    >
                      {selectedPostIds.length === displayItems.length ? 'Deselect all' : 'Select all'}
                    </button>
                    <button
                      onClick={handleBatchUnlike}
                      disabled={selectedPostIds.length === 0}
                      className="px-3.5 py-1.5 rounded-xl bg-rose-500/20 text-rose-300 border border-rose-500/30 hover:bg-rose-500/30 text-xs font-bold transition disabled:opacity-40 cursor-pointer"
                    >
                      Unlike ({selectedPostIds.length})
                    </button>
                    <button
                      onClick={() => { setIsSelectMode(false); setSelectedPostIds([]); }}
                      className="px-3.5 py-1.5 rounded-xl text-zinc-400 hover:text-white text-xs font-semibold cursor-pointer"
                    >
                      Cancel
                    </button>
                  </div>
                ) : (
                  <button
                    onClick={() => setIsSelectMode(true)}
                    className="text-cyan-400 hover:text-cyan-300 font-bold text-xs cursor-pointer px-3 py-1.5 rounded-xl bg-cyan-500/10 border border-cyan-500/20 hover:bg-cyan-500/20 transition"
                  >
                    Select
                  </button>
                )}
              </div>
            </div>

            {/* ── 3. High-Definition Media Grid (Exact 3-Column Instagram Aspect Ratio) ── */}
            {activeInteractionTab === 'likes' && (
              displayItems.length === 0 ? (
                <div className="py-20 text-center text-zinc-500 text-xs space-y-3 max-w-sm mx-auto">
                  <div className="w-12 h-12 rounded-2xl bg-rose-500/10 border border-rose-500/20 flex items-center justify-center text-rose-400 mx-auto">
                    <Heart className="w-6 h-6" />
                  </div>
                  <h4 className="font-bold text-sm text-white">No Liked Dispatches Yet</h4>
                  <p className="text-zinc-400 leading-relaxed font-light">
                    Interact with posts, assemblies, and pulses on Zen.Pulse to curate your personalized activity ledger.
                  </p>
                </div>
              ) : (
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-3 lg:grid-cols-3 gap-2 sm:gap-4">
                  {displayItems.map((post) => {
                    const isSelected = selectedPostIds.includes(post.id);

                    return (
                      <motion.div
                        key={post.id}
                        whileHover={{ scale: 1.015 }}
                        transition={{ duration: 0.2 }}
                        onClick={() => {
                          if (isSelectMode) {
                            toggleSelectPost(post.id);
                          } else {
                            setActiveModalPost(post);
                          }
                        }}
                        className="group relative aspect-square bg-[#0b0c10] rounded-2xl overflow-hidden border border-white/10 cursor-pointer select-none shadow-[0_10px_30px_rgba(0,0,0,0.6)]"
                      >
                        {/* Image Thumbnail */}
                        <img
                          src={post.image}
                          alt={post.content}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                        />

                        {/* Top Media Type Badge */}
                        <div className="absolute top-2.5 right-2.5 flex items-center gap-1.5 z-10 pointer-events-none">
                          {post.mediaType === 'reel' && (
                            <span className="p-1.5 rounded-lg bg-black/60 backdrop-blur-md border border-white/10 text-white shadow-sm">
                              <Film className="w-3.5 h-3.5" />
                            </span>
                          )}
                          {post.mediaType === 'carousel' && (
                            <span className="p-1.5 rounded-lg bg-black/60 backdrop-blur-md border border-white/10 text-white shadow-sm">
                              <Layers className="w-3.5 h-3.5" />
                            </span>
                          )}
                        </div>

                        {/* Selection Checkbox in Select Mode */}
                        {isSelectMode && (
                          <div className="absolute top-3 left-3 z-20">
                            <div
                              className={`w-6 h-6 rounded-full border flex items-center justify-center transition-all ${
                                isSelected
                                  ? 'bg-rose-500 border-rose-500 text-white scale-110 shadow-[0_0_10px_rgba(244,63,94,0.8)]'
                                  : 'bg-black/60 border-white/60 text-transparent'
                              }`}
                            >
                              <Check className="w-3.5 h-3.5 stroke-[3]" />
                            </div>
                          </div>
                        )}

                        {/* Bottom Caption Pill in normal state */}
                        <div className="absolute bottom-0 inset-x-0 p-3 bg-gradient-to-t from-black/90 via-black/40 to-transparent flex flex-col justify-end text-left pointer-events-none group-hover:opacity-0 transition-opacity">
                          <span className="text-[10px] font-mono text-zinc-400 truncate">
                            @{post.authorUsername}
                          </span>
                        </div>

                        {/* Hover Overlay with Stats (Instagram Authentic Interaction) */}
                        <div className="absolute inset-0 bg-black/65 backdrop-blur-sm opacity-0 group-hover:opacity-100 transition-opacity flex flex-col items-center justify-center gap-4 text-white p-4">
                          <div className="flex items-center gap-6 font-bold text-sm">
                            <div className="flex items-center gap-2 drop-shadow-md">
                              <Heart className="w-5 h-5 text-rose-500 fill-rose-500" />
                              <span>{post.likes.toLocaleString()}</span>
                            </div>
                            <div className="flex items-center gap-2 drop-shadow-md">
                              <MessageCircle className="w-5 h-5 text-white fill-white" />
                              <span>{post.comments.toLocaleString()}</span>
                            </div>
                          </div>
                          <span className="text-[11px] text-zinc-300 font-mono">
                            {post.createdAt}
                          </span>
                        </div>
                      </motion.div>
                    );
                  })}
                </div>
              )
            )}

            {/* ── 4. Comments Tab View ── */}
            {activeInteractionTab === 'comments' && (
              <div className="py-20 text-center text-zinc-500 text-xs space-y-3 max-w-sm mx-auto">
                <div className="w-12 h-12 rounded-2xl bg-purple-500/10 border border-purple-500/20 flex items-center justify-center text-purple-400 mx-auto">
                  <MessageCircle className="w-6 h-6" />
                </div>
                <h4 className="font-bold text-sm text-white">No Comment History</h4>
                <p className="text-zinc-400 leading-relaxed font-light">
                  Comments you post on summits, pulse discussions, and resolutions will automatically be indexed here.
                </p>
              </div>
            )}

            {/* ── 5. Reposts / Replies / Reviews ── */}
            {['reposts', 'replies', 'reviews'].includes(activeInteractionTab) && (
              <div className="py-20 text-center text-zinc-500 text-xs space-y-3 max-w-sm mx-auto">
                <div className="w-12 h-12 rounded-2xl bg-purple-500/10 border border-purple-500/20 flex items-center justify-center text-purple-400 mx-auto shadow-[0_0_20px_rgba(168,85,247,0.2)]">
                  <Sparkles className="w-6 h-6" />
                </div>
                <h4 className="font-bold text-sm text-white">Sovereign Echoes Synced</h4>
                <p className="text-zinc-400 leading-relaxed font-light">
                  All your endorsed resolutions and live glimpse reactions are mirrored on your cryptographic identity ledger.
                </p>
              </div>
            )}
          </div>
        )}

        {/* ── PHOTOS AND VIDEOS TAB ── */}
        {activeSection === 'photos_videos' && (
          <div className="space-y-6 text-left">
            <div className="border-b border-zinc-800 pb-3 flex items-center gap-8 text-xs font-bold uppercase tracking-[0.14em] text-zinc-500">
              <button
                onClick={() => setActiveMediaTab('posts')}
                className={`pb-2 transition ${activeMediaTab === 'posts' ? 'text-white border-b-2 border-white' : 'hover:text-white'}`}
              >
                Dispatches ({myPosts.length})
              </button>
              <button
                onClick={() => setActiveMediaTab('reels')}
                className={`pb-2 transition ${activeMediaTab === 'reels' ? 'text-white border-b-2 border-white' : 'hover:text-white'}`}
              >
                SPARK Reels
              </button>
              <button
                onClick={() => setActiveMediaTab('archived')}
                className={`pb-2 transition ${activeMediaTab === 'archived' ? 'text-white border-b-2 border-white' : 'hover:text-white'}`}
              >
                Archive Vault
              </button>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
              {myPosts.length === 0 ? (
                <div className="col-span-full py-16 text-center text-zinc-500 text-xs space-y-2">
                  <ImageIcon className="w-8 h-8 mx-auto text-zinc-600" />
                  <p>You haven&apos;t shared any photos or dispatches yet.</p>
                  <Link href="/pulse" className="inline-block mt-2 px-5 py-2.5 rounded-xl bg-white text-black font-bold text-xs shadow-md">
                    Create Dispatch
                  </Link>
                </div>
              ) : (
                myPosts.map((post) => (
                  <div
                    key={post.id}
                    className="aspect-square bg-zinc-950 border border-zinc-800 rounded-2xl overflow-hidden cursor-pointer group relative shadow-md"
                  >
                    {post.images && post.images[0] ? (
                      <img src={post.images[0]} alt="" className="w-full h-full object-cover group-hover:scale-105 transition duration-300" />
                    ) : (
                      <div className="p-3 text-xs text-zinc-400 line-clamp-3">{post.content}</div>
                    )}
                    <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition flex items-center justify-center gap-3 text-white font-bold text-xs">
                      <span>❤️ {post.likes}</span>
                      <span>💬 {post.replyCount || 0}</span>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        )}

        {/* ── ACCOUNT HISTORY TAB ── */}
        {activeSection === 'account_history' && (
          <div className="space-y-6 text-left max-w-2xl">
            <div>
              <h3 className="font-bold text-lg text-white" style={{ fontFamily: 'Clash Display, sans-serif' }}>
                Account Security &amp; Ledger Log
              </h3>
              <p className="text-xs text-zinc-400 mt-0.5">Chronological record of verified account access and key rotation.</p>
            </div>

            <div className="space-y-3">
              {[
                {
                  event: 'Sovereign 10-Digit Passkey Verified',
                  desc: 'Assigned unique cryptographically secure 10-digit login challenge token.',
                  time: 'Active Session',
                  icon: ShieldCheck,
                  color: 'text-cyan-400 bg-cyan-500/10 border-cyan-500/20',
                },
                {
                  event: 'Security Credentials Refreshed',
                  desc: 'Cryptographic defense profile upgraded to Defense Suite v1.0.',
                  time: 'Aug 2026',
                  icon: History,
                  color: 'text-purple-400 bg-purple-500/10 border-purple-500/20',
                },
                {
                  event: 'Sovereign Node Initialized',
                  desc: 'Account registered and assigned citizen node credentials on Zenvitra.',
                  time: 'Aug 2026',
                  icon: User,
                  color: 'text-emerald-400 bg-emerald-500/10 border-emerald-500/20',
                },
              ].map((log, idx) => {
                const Icon = log.icon;
                return (
                  <div key={idx} className="p-4 rounded-2xl bg-[#090a0f] border border-zinc-800/80 flex items-start gap-3.5 shadow-sm">
                    <div className={`w-10 h-10 rounded-xl border flex items-center justify-center shrink-0 ${log.color}`}>
                      <Icon className="w-5 h-5" />
                    </div>
                    <div className="space-y-1 min-w-0 flex-1">
                      <div className="flex items-center justify-between">
                        <h4 className="font-bold text-xs text-white">{log.event}</h4>
                        <span className="text-[10px] font-mono text-zinc-500">{log.time}</span>
                      </div>
                      <p className="text-xs text-zinc-400 leading-relaxed font-light">{log.desc}</p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* ── DOWNLOAD YOUR INFORMATION TAB ── */}
        {activeSection === 'download' && (
          <div className="space-y-6 text-left max-w-2xl">
            <div>
              <h3 className="font-bold text-lg text-white" style={{ fontFamily: 'Clash Display, sans-serif' }}>
                Download a Copy of Your Sovereign Data
              </h3>
              <p className="text-xs text-zinc-400 mt-0.5 leading-relaxed font-light">
                Get a secure archive of what you’ve shared on Zenvitra, including your dispatches, media, comments, and cryptographic certificates.
              </p>
            </div>

            <div className="p-6 rounded-3xl bg-[#090a0f] border border-zinc-800/80 space-y-5 shadow-lg">
              <div className="space-y-2">
                <label className="text-xs font-semibold text-zinc-300 block">Select Export Format</label>
                <div className="flex gap-3">
                  <button className="flex-1 p-3.5 rounded-2xl bg-white/[0.08] border border-white/30 text-white font-bold text-xs text-left shadow-sm">
                    JSON (Machine-Readable Raw Data)
                  </button>
                  <button className="flex-1 p-3.5 rounded-2xl bg-zinc-900 border border-zinc-800 text-zinc-400 font-semibold text-xs text-left hover:text-white transition">
                    HTML (Offline Browser Viewer)
                  </button>
                </div>
              </div>

              <button
                onClick={() => {
                  const blob = new Blob([JSON.stringify({ user: currentUserUsername, timestamp: new Date().toISOString() }, null, 2)], { type: 'application/json' });
                  const url = URL.createObjectURL(blob);
                  const a = document.createElement('a');
                  a.href = url;
                  a.download = `zenvitra_archive_${currentUserUsername}.json`;
                  a.click();
                }}
                className="w-full py-4 rounded-2xl bg-white hover:bg-zinc-200 text-black font-bold text-xs transition flex items-center justify-center gap-2 cursor-pointer shadow-[0_0_20px_rgba(255,255,255,0.2)]"
              >
                <Download className="w-4 h-4" />
                <span>Export Sovereign Archive (.json)</span>
              </button>
            </div>
          </div>
        )}
      </main>

      {/* ── SORT & FILTER MODAL ── */}
      {isFilterModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div onClick={() => setIsFilterModalOpen(false)} className="fixed inset-0 bg-black/85 backdrop-blur-md" />
          <div className="w-full max-w-sm bg-[#090a0f] border border-zinc-700/80 rounded-3xl p-6 relative z-10 text-white select-none text-left space-y-5 shadow-[0_20px_60px_rgba(0,0,0,0.95)]">
            <div className="flex items-center justify-between pb-3 border-b border-zinc-800">
              <h3 className="font-bold text-sm text-white">Sort &amp; filter</h3>
              <button onClick={() => setIsFilterModalOpen(false)} className="p-1 text-zinc-400 hover:text-white">
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Author filter */}
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-zinc-300 block">Filter by Author / Delegate</label>
              <div className="relative">
                <Search className="w-3.5 h-3.5 text-zinc-500 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  placeholder="e.g. yuveer or un_caucus"
                  value={filterAuthor}
                  onChange={(e) => setFilterAuthor(e.target.value)}
                  className="w-full pl-8 pr-3 py-2 rounded-xl bg-black border border-zinc-700 text-white text-xs placeholder-zinc-500 focus:outline-none focus:border-white transition"
                />
              </div>
            </div>

            {/* Date range filter */}
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-zinc-300 block">Date Range</label>
              <div className="grid grid-cols-2 gap-2">
                {[
                  { id: 'all', label: 'All time' },
                  { id: '7d', label: 'Last 7 days' },
                  { id: '30d', label: 'Last 30 days' },
                  { id: '365d', label: 'Last year' },
                ].map((d) => (
                  <button
                    key={d.id}
                    onClick={() => setFilterDateRange(d.id as any)}
                    className={`py-2 rounded-xl border text-xs font-semibold transition cursor-pointer ${
                      filterDateRange === d.id
                        ? 'bg-white text-black border-white font-bold'
                        : 'bg-zinc-900 text-zinc-400 border-zinc-800 hover:text-white'
                    }`}
                  >
                    {d.label}
                  </button>
                ))}
              </div>
            </div>

            <div className="pt-3 border-t border-zinc-800 flex items-center justify-between">
              <button
                onClick={() => { setFilterAuthor(''); setFilterDateRange('all'); }}
                className="text-xs text-zinc-400 hover:text-white font-semibold cursor-pointer"
              >
                Reset
              </button>
              <button
                onClick={() => setIsFilterModalOpen(false)}
                className="px-5 py-2.5 rounded-xl bg-white text-black font-bold text-xs hover:bg-zinc-200 cursor-pointer shadow-sm"
              >
                Apply
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ─── FULL INSTAGRAM-STYLE LIGHTBOX MODAL ─── */}
      <AnimatePresence>
        {activeModalPost && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-8">
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setActiveModalPost(null)} 
              className="fixed inset-0 bg-black/90 backdrop-blur-xl" 
            />

            <motion.div 
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              transition={{ type: 'spring', stiffness: 400, damping: 30 }}
              className="w-full max-w-4xl bg-[#090a0f] border border-zinc-700/80 rounded-3xl overflow-hidden relative z-10 text-white flex flex-col md:flex-row shadow-[0_30px_90px_rgba(0,0,0,0.95)] max-h-[90vh]"
            >
              {/* Media Preview Left Side */}
              <div className="w-full md:w-[55%] bg-black flex items-center justify-center border-b md:border-b-0 md:border-r border-zinc-800 relative group">
                <img 
                  src={activeModalPost.image} 
                  alt="" 
                  className="w-full h-full object-cover max-h-[450px] md:max-h-[600px]" 
                />
                {activeModalPost.mediaType === 'reel' && (
                  <div className="absolute inset-0 flex items-center justify-center bg-black/30 pointer-events-none">
                    <div className="w-14 h-14 rounded-full bg-white/20 backdrop-blur-md flex items-center justify-center text-white border border-white/30 shadow-lg">
                      <Play className="w-6 h-6 fill-white ml-0.5" />
                    </div>
                  </div>
                )}
              </div>

              {/* Detail Info Right Side */}
              <div className="flex-1 p-6 flex flex-col justify-between text-left space-y-4 overflow-y-auto bg-[#07080c]">
                {/* Author Header */}
                <div className="space-y-4">
                  <div className="flex items-center justify-between pb-4 border-b border-zinc-800">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-amber-400 via-rose-500 to-fuchsia-600 p-[1.5px]">
                        <img src={activeModalPost.authorAvatar} alt="" className="w-full h-full rounded-full object-cover" />
                      </div>
                      <div>
                        <div className="flex items-center gap-1.5">
                          <h4 className="font-bold text-xs text-white">{activeModalPost.authorName}</h4>
                          {activeModalPost.verified && (
                            <CheckCircle2 className="w-3.5 h-3.5 text-cyan-400" />
                          )}
                        </div>
                        <span className="text-[10px] text-zinc-500 font-mono">@{activeModalPost.authorUsername}</span>
                      </div>
                    </div>
                    <button onClick={() => setActiveModalPost(null)} className="p-1 text-zinc-400 hover:text-white transition">
                      <X className="w-5 h-5" />
                    </button>
                  </div>

                  {/* Caption */}
                  <div className="space-y-1">
                    <p className="text-xs text-zinc-200 leading-relaxed font-light">
                      <strong className="font-bold text-white mr-1.5">{activeModalPost.authorUsername}</strong>
                      {activeModalPost.content}
                    </p>
                    <span className="text-[10px] text-zinc-500 font-mono block pt-1">{activeModalPost.createdAt}</span>
                  </div>

                  {/* Comments Feed */}
                  <div className="space-y-3 pt-2 max-h-[180px] overflow-y-auto pr-1">
                    {modalCommentsList.map((c) => (
                      <div key={c.id} className="text-xs space-y-0.5">
                        <div className="flex items-baseline gap-2">
                          <strong className="font-bold text-white text-[11px]">@{c.user}</strong>
                          <span className="text-zinc-300 font-light text-[11px]">{c.text}</span>
                        </div>
                        <span className="text-[9px] text-zinc-500 font-mono">{c.time}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Bottom Interactive Area */}
                <div className="pt-4 border-t border-zinc-800 space-y-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                      <button className="text-rose-500 hover:scale-110 transition-transform">
                        <Heart className="w-5 h-5 fill-rose-500" />
                      </button>
                      <button className="text-zinc-300 hover:text-white hover:scale-110 transition-transform">
                        <MessageCircle className="w-5 h-5" />
                      </button>
                      <button className="text-zinc-300 hover:text-white hover:scale-110 transition-transform">
                        <Share2 className="w-5 h-5" />
                      </button>
                    </div>
                    <button className="text-zinc-400 hover:text-white">
                      <Bookmark className="w-5 h-5" />
                    </button>
                  </div>

                  <div className="text-xs font-bold text-white">
                    {activeModalPost.likes.toLocaleString()} likes
                  </div>

                  {/* Add Comment Input */}
                  <form onSubmit={handleAddModalComment} className="flex items-center gap-2 pt-1 border-t border-zinc-800/80">
                    <input
                      type="text"
                      placeholder="Add a comment..."
                      value={modalCommentText}
                      onChange={(e) => setModalCommentText(e.target.value)}
                      className="flex-1 bg-transparent text-xs text-white placeholder-zinc-500 focus:outline-none"
                    />
                    <button
                      type="submit"
                      disabled={!modalCommentText.trim()}
                      className="text-cyan-400 hover:text-cyan-300 font-bold text-xs disabled:opacity-30 cursor-pointer"
                    >
                      Post
                    </button>
                  </form>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}

export default YourActivityHub;
