'use client';

import React, { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { useSearchParams, useRouter } from 'next/navigation';
import {
  Home,
  Compass,
  Film,
  Bookmark,
  User,
  Heart,
  MessageCircle,
  MessageSquare,
  Share2,
  Image as ImageIcon,
  Send,
  Sparkles,
  Plus,
  TrendingUp,
  Check,
  Search,
  MoreHorizontal,
  Video,
  X,
  Upload,
  Copy,
  Trash2,
  EyeOff,
  Flag,
  UserPlus,
  UserCheck,
  ExternalLink,
  Lock
} from 'lucide-react';
import { useZenPulse } from '@/context/ZenPulsePlatformContext';
import { useAuth } from '@/context/AuthContext';
import { StoriesTray } from './StoriesTray';
import { FluxReelsFeed } from './FluxReelsFeed';
import { StoryComposerModal } from './StoryComposerModal';
import { UserProfileView } from './UserProfileView';
import { DiscoverProfiles } from './DiscoverProfiles';
import { PostComposer } from './PostComposer';
import { FluxComposer } from './FluxComposer';
import { ZenSparkCard } from './ZenSparkCard';
import { INITIAL_SPARKS, ZenSpark } from '@/types/sparks';
import { ZenFlexReaderModal, FlexReaderItem } from './ZenFlexReaderModal';
import { SwitchAccountModal } from './SwitchAccountModal';
import { RollCallRadar } from './RollCallRadar';
import { RedlineDiffStudioModal } from './RedlineDiffStudioModal';
import { CitationInspectorModal } from './CitationInspectorModal';
import { FloorSpeechTransceiverModal } from './FloorSpeechTransceiverModal';
import { DelegatePassportModal } from './DelegatePassportModal';
import { RevenueFeeSimulatorModal } from './RevenueFeeSimulatorModal';
import { ChamberDirectiveModal, DIRECTIVE_DOSSIERS } from './ChamberDirectiveModal';
import { PulsePost } from '@/types/pulse';
import { getStoryFontStyle } from '@/lib/storyFonts';
import { motion, AnimatePresence } from 'framer-motion';
import { getFounderDirective, FounderDirective, isFounder, isAdmin } from '@/lib/founderControl';
import { AdminOmniModal } from '@/components/founder/AdminOmniModal';
import { FounderOmniModal } from '@/components/founder/FounderOmniModal';
import { 
  ArrowRight, 
  Zap,
  Radio,
  ShieldCheck,
  Award,
  Calculator,
  GitMerge,
  SplitSquareVertical,
  Volume2,
  Play,
  Pause,
  Coins,
  FileCheck2,
  Vote,
  Crown,
  Edit3,
  Music
} from 'lucide-react';

export function ZenPulseCore() {
  const { profile, user } = useAuth();
  const [showSwitchModal, setShowSwitchModal] = useState(false);
  
  /* 5-Pillar Modals State */
  const [activeRedlinePost, setActiveRedlinePost] = useState<PulsePost | null>(null);
  const [activeCitationPost, setActiveCitationPost] = useState<PulsePost | null>(null);
  const [showFloorSpeechModal, setShowFloorSpeechModal] = useState(false);
  const [showPassportModal, setShowPassportModal] = useState(false);
  const [showRevenueSimulatorModal, setShowRevenueSimulatorModal] = useState(false);
  const [playingAudioId, setPlayingAudioId] = useState<string | null>(null);

  const {
    feedPosts,
    savedPosts,
    profiles,
    likePost,
    toggleSavePost,
    isSaved,
    deletePost,
    isFollowing,
    toggleFollow,
    openUserProfile,
    setSelectedProfileUsername,
    activeView,
    setActiveView,
    getReplies,
    addReply,
    createPost,
    sendCivicTip,
    civicPointsBalance,
    currentUserName,
    currentUserUsername,
    currentUserId,
    myProfile,
  } = useZenPulse();

  const pAny = profile as any;
  const activeDisplayName = 
    profile?.display_name || 
    pAny?.name || 
    pAny?.full_name || 
    user?.user_metadata?.full_name || 
    user?.user_metadata?.name || 
    user?.name || 
    currentUserName || 
    myProfile?.name || 
    (user?.email ? user.email.split('@')[0] : '');

  const activeUsername = 
    profile?.username || 
    pAny?.handle || 
    user?.user_metadata?.user_name || 
    user?.user_metadata?.username || 
    currentUserUsername || 
    myProfile?.username || 
    (user?.email ? user.email.split('@')[0].replace(/[^a-zA-Z0-9_]/g, '').toLowerCase() : '');
  const activeAvatar = profile?.avatar_url || myProfile?.avatar;
  const activeInitial = (activeDisplayName || activeUsername || 'U').charAt(0).toUpperCase() || 'U';

  const router = useRouter();
  const searchParams = useSearchParams();
  const tabParam = searchParams.get('tab');
  const directiveParam = searchParams.get('directive');
  const flexParam = searchParams.get('flex') || searchParams.get('spark');
  const postParam = searchParams.get('id') || searchParams.get('post');

  /* Main Navigation: 'feed' | 'explore' | 'flux' | 'saved' | 'profile' */
  const [navTab, setNavTab] = useState<'feed' | 'explore' | 'flux' | 'saved' | 'profile'>(
    tabParam === 'flux' || tabParam === 'reels'
      ? 'flux'
      : tabParam === 'explore'
      ? 'explore'
      : tabParam === 'saved'
      ? 'saved'
      : tabParam === 'profile'
      ? 'profile'
      : 'feed'
  );

  useEffect(() => {
    if (tabParam === 'flux' || tabParam === 'reels') {
      setNavTab('flux');
      setActiveView('flux');
    } else if (tabParam === 'explore') {
      setNavTab('explore');
      setActiveView('discover');
    } else if (tabParam === 'saved') {
      setNavTab('saved');
    } else if (tabParam === 'profile') {
      setNavTab('profile');
      setActiveView('profile');
    } else if (tabParam === 'feed') {
      setNavTab('feed');
      setActiveView('feed');
    }
  }, [tabParam, setActiveView]);

  useEffect(() => {
    if (activeView === 'profile') {
      setNavTab('profile');
    } else if (activeView === 'discover' || (activeView as any) === 'explore') {
      setNavTab('explore');
    } else if (activeView === 'flux') {
      setNavTab('flux');
    } else if (activeView === 'feed' && (!tabParam || tabParam === 'feed')) {
      setNavTab('feed');
    }
  }, [activeView, tabParam]);

  useEffect(() => {
    const handleNavFeedEvent = () => {
      setSelectedProfileUsername(null);
      setActiveView('feed');
      setNavTab('feed');
      if (typeof window !== 'undefined') {
        const url = new URL(window.location.href);
        url.searchParams.delete('tab');
        window.history.replaceState({}, '', url.toString());
      }
    };
    window.addEventListener('zenvitra-nav-feed', handleNavFeedEvent);
    return () => window.removeEventListener('zenvitra-nav-feed', handleNavFeedEvent);
  }, [setActiveView, setSelectedProfileUsername]);

  const handleTabChange = (tab: 'feed' | 'explore' | 'flux' | 'saved' | 'profile') => {
    setNavTab(tab);
    if (tab === 'profile') {
      setActiveView('profile');
    } else if (tab === 'explore') {
      setActiveView('discover');
    } else if (tab === 'flux') {
      setActiveView('flux');
    } else {
      setActiveView('feed');
    }
    if (typeof window !== 'undefined') {
      const url = new URL(window.location.href);
      if (tab === 'feed') {
        url.searchParams.delete('tab');
      } else {
        url.searchParams.set('tab', tab);
      }
      window.history.replaceState({}, '', url.toString());
    }
  };
  const [feedFilter, setFeedFilter] = useState<'for_you' | 'following'>('for_you');
  
  const [showStoryModal, setShowStoryModal] = useState(false);
  const [showPostComposerModal, setShowPostComposerModal] = useState(false);
  const [showFluxComposerModal, setShowFluxComposerModal] = useState(false);
  const [showDirectiveModal, setShowDirectiveModal] = useState(false);
  const [showAdminModal, setShowAdminModal] = useState(false);
  const [showFounderModal, setShowFounderModal] = useState(false);

  const cleanUserCheck = (activeUsername || currentUserUsername || '').toLowerCase().trim().replace(/^@/, '');
  const isFounderUser = isFounder(cleanUserCheck, (profile?.role as any) || (profile as any)?.badge);
  const isAdminUser = isAdmin(cleanUserCheck, (profile?.role as any) || (profile as any)?.badge);

  const [founderDirective, setFounderDirective] = useState<FounderDirective>(getFounderDirective());
  const [activeDirectiveIndex, setActiveDirectiveIndex] = useState(0);
  const [activeFlexItem, setActiveFlexItem] = useState<FlexReaderItem | null>(null);
  const [activeMenuPostId, setActiveMenuPostId] = useState<string | null>(null);
  const [hiddenPostIds, setHiddenPostIds] = useState<string[]>([]);

  useEffect(() => {
    setFounderDirective(getFounderDirective());
    const handleDirectiveUpdate = (e: any) => {
      if (e.detail) setFounderDirective(e.detail);
      else setFounderDirective(getFounderDirective());
    };
    window.addEventListener('zenvitra_founder_update', handleDirectiveUpdate);
    return () => window.removeEventListener('zenvitra_founder_update', handleDirectiveUpdate);
  }, []);

  /* ── SHARED DIRECTIVE AUTHENTICATION GUARD & AUTO-OPENER ── */
  useEffect(() => {
    if (!directiveParam) return;

    // Check if citizen is authenticated (in context or local storage)
    const storedSession = typeof window !== 'undefined' ? localStorage.getItem('zenvitra_session_user') : null;
    const isCitizenLoggedIn = Boolean(user || profile || storedSession);

    if (!isCitizenLoggedIn) {
      // User is not logged in: redirect to login with callback URL & classified notice
      const returnUrl = `/pulse?directive=${encodeURIComponent(directiveParam)}`;
      router.push(`/login?redirect=${encodeURIComponent(returnUrl)}&notice=directive_auth_required`);
      return;
    }

    // Citizen is authenticated: find directive dossier and launch modal
    const foundIdx = DIRECTIVE_DOSSIERS.findIndex((d) => d.id === directiveParam);
    if (foundIdx !== -1) {
      setActiveDirectiveIndex(foundIdx);
      setShowDirectiveModal(true);
    } else {
      const numIdx = parseInt(directiveParam, 10);
      if (!isNaN(numIdx) && numIdx >= 0 && numIdx < DIRECTIVE_DOSSIERS.length) {
        setActiveDirectiveIndex(numIdx);
        setShowDirectiveModal(true);
      }
    }
  }, [directiveParam, user, profile, router]);

  /* ── SHARED FLEX / SPARK DIRECT ROUTING & AUTO-OPENER ── */
  useEffect(() => {
    if (!flexParam) return;

    // Check if citizen is authenticated (in context or local storage)
    const storedSession = typeof window !== 'undefined' ? localStorage.getItem('zenvitra_session_user') : null;
    const isCitizenLoggedIn = Boolean(user || profile || storedSession);

    if (!isCitizenLoggedIn) {
      const returnUrl = `/pulse?flex=${encodeURIComponent(flexParam)}`;
      router.push(`/login?redirect=${encodeURIComponent(returnUrl)}&notice=flex_auth_required`);
      return;
    }

    const cleanId = flexParam.trim().toLowerCase();

    // 1. Search in INITIAL_SPARKS
    const foundSpark = INITIAL_SPARKS.find((sp) => 
      sp.id.toLowerCase() === cleanId ||
      sp.id.toLowerCase().replace(/^spark_/, '') === cleanId.replace(/^spark_/, '')
    );

    if (foundSpark) {
      setActiveFlexItem({
        id: foundSpark.id,
        type: 'spark',
        title: foundSpark.title,
        content: foundSpark.summary,
        authorName: foundSpark.authorName,
        authorUsername: foundSpark.authorUsername,
        authorAvatar: foundSpark.authorAvatar,
        createdAt: foundSpark.createdAt,
        likes: foundSpark.likes,
        category: foundSpark.category,
        readingTimeMinutes: foundSpark.readingTimeMinutes,
        keyTakeaways: foundSpark.keyTakeaways,
        fullDossier: foundSpark.fullDossier,
        treatyClauseReference: foundSpark.treatyClauseReference,
        threadSegments: foundSpark.fullDossier.split(/\n\n+/).filter((s) => s.trim().length > 0),
      });
      return;
    }

    // 2. Search in all feed posts
    const foundPost = feedPosts.find((p) => p.id === flexParam);
    if (foundPost) {
      setActiveFlexItem({
        id: foundPost.id,
        type: 'pulse_post',
        title: foundPost.authorName ? `${foundPost.authorName}'s Dispatch` : 'Sovereign Dispatch',
        content: foundPost.content,
        authorName: foundPost.authorName,
        authorUsername: foundPost.authorUsername,
        authorAvatar: foundPost.authorAvatar,
        images: foundPost.images,
        createdAt: foundPost.createdAt,
        likes: foundPost.likes,
        category: (foundPost as any).category || 'Dispatch',
        tags: foundPost.tags,
        threadSegments: [foundPost.content],
      });
    }
  }, [flexParam, user, profile, router, feedPosts]);

  /* ── SHARED POST / DISPATCH DIRECT NAVIGATOR ── */
  useEffect(() => {
    if (!postParam) return;

    const storedSession = typeof window !== 'undefined' ? localStorage.getItem('zenvitra_session_user') : null;
    const isCitizenLoggedIn = Boolean(user || profile || storedSession);

    if (!isCitizenLoggedIn) {
      const returnUrl = `/pulse?id=${encodeURIComponent(postParam)}`;
      router.push(`/login?redirect=${encodeURIComponent(returnUrl)}&notice=dispatch_auth_required`);
      return;
    }

    const timer = setTimeout(() => {
      const el = document.getElementById(`post-${postParam}`);
      if (el) {
        el.scrollIntoView({ behavior: 'smooth', block: 'center' });
        el.classList.add('ring-2', 'ring-purple-500', 'shadow-[0_0_40px_rgba(168,85,247,0.5)]');
        setTimeout(() => {
          el.classList.remove('ring-2', 'ring-purple-500', 'shadow-[0_0_40px_rgba(168,85,247,0.5)]');
        }, 4000);
      } else {
        const found = feedPosts.find((p) => p.id === postParam);
        if (found) {
          setActiveFlexItem({
            id: found.id,
            type: 'pulse_post',
            title: `${found.authorName}'s Dispatch`,
            content: found.content,
            authorName: found.authorName,
            authorUsername: found.authorUsername,
            authorAvatar: found.authorAvatar,
            images: found.images,
            createdAt: found.createdAt,
            likes: found.likes,
            category: (found as any).category || 'Dispatch',
            tags: found.tags,
            threadSegments: [found.content],
          });
        }
      }
    }, 350);

    return () => clearTimeout(timer);
  }, [postParam, user, profile, router, feedPosts]);

  /* Quick dispatch composer */
  const [inlineContent, setInlineContent] = useState('');
  const [inlineMediaUrls, setInlineMediaUrls] = useState<string[]>([]);
  const inlineFileInputRef = useRef<HTMLInputElement>(null);
  const [activeSlideByPostId, setActiveSlideByPostId] = useState<Record<string, number>>({});

  const handleInlineFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    if (files.length > 0) {
      files.forEach((file) => {
        if (file.size > 25 * 1024 * 1024) {
          showToast('Media size exceeds 25MB limit.');
          return;
        }
        const reader = new FileReader();
        reader.onload = (event) => {
          if (event.target?.result) {
            setInlineMediaUrls((prev) => [...prev, event.target!.result as string]);
          }
        };
        reader.readAsDataURL(file);
      });
      e.target.value = '';
    }
  };

  /* Interactions */
  const [commentInputs, setCommentInputs] = useState<Record<string, string>>({});
  const [expandedComments, setExpandedComments] = useState<Record<string, boolean>>({});
  const [doubleTapHearts, setDoubleTapHearts] = useState<Record<string, boolean>>({});
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 2500);
  };

  const handleDoubleTapLike = (postId: string) => {
    setDoubleTapHearts((prev) => ({ ...prev, [postId]: true }));
    setTimeout(() => {
      setDoubleTapHearts((prev) => ({ ...prev, [postId]: false }));
    }, 700);
    likePost(postId);
  };

  const handleSharePost = (postId: string) => {
    if (typeof navigator !== 'undefined') {
      navigator.clipboard.writeText(`${window.location.origin}/pulse?id=${postId}`);
      showToast('Post link copied to clipboard!');
    }
  };

  const handleAddComment = (postId: string) => {
    const text = commentInputs[postId];
    if (!text || !text.trim()) return;
    addReply(postId, text.trim());
    setCommentInputs((prev) => ({ ...prev, [postId]: '' }));
    setExpandedComments((prev) => ({ ...prev, [postId]: true }));
    showToast('Comment posted');
  };

  const toggleCommentsExpansion = (postId: string) => {
    setExpandedComments((prev) => ({ ...prev, [postId]: !prev[postId] }));
  };

  /* Live Breaking Diplomatic Ticker */
  const [tickerIndex, setTickerIndex] = useState(0);
  const TICKER_DIRECTIVES = [
    '🔴 LIVE WIRE • UN Plenary Session #418: Geneva Accord on Open Civic Corridors passed with 94% Supermajority',
    '⚡ BREAKING • Youth Diplomatic Summit 2026: 1,420 Delegates Checked-in Across 48 Nations',
    '🏛️ SECURITY COUNCIL WIRE • High-Seas Biosphere Protection Treaty Redline diff finalized by delegations',
    '🎙️ 60S RELAY • Delegate @yuveer broadcasted floor speech on Youth Plenary Consensus Node',
  ];

  useEffect(() => {
    const timer = setInterval(() => {
      setTickerIndex((prev) => (prev + 1) % TICKER_DIRECTIVES.length);
    }, 4500);
    return () => clearInterval(timer);
  }, []);

  /* Chamber & Post Category Filter */
  const [chamberFilter, setChamberFilter] = useState<'all' | 'plenary' | 'treaties' | 'audio' | 'summits' | 'delegates'>('all');
  const [composerMode, setComposerMode] = useState<'dispatch' | 'treaty' | 'audio' | 'media'>('dispatch');

  /* Interactive Consensus Ballots */
  const [votesByPostId, setVotesByPostId] = useState<Record<string, { ayes: number; nays: number; userVote?: 'aye' | 'nay' }>>({
    'post-1': { ayes: 184, nays: 22, userVote: 'aye' },
    'post-2': { ayes: 96, nays: 8 },
  });

  const handleVote = (postId: string, vote: 'aye' | 'nay') => {
    setVotesByPostId((prev) => {
      const current = prev[postId] || { ayes: 50, nays: 5 };
      if (current.userVote === vote) return prev;
      const prevVote = current.userVote;
      const newAyes = vote === 'aye' ? current.ayes + 1 : prevVote === 'aye' ? current.ayes - 1 : current.ayes;
      const newNays = vote === 'nay' ? current.nays + 1 : prevVote === 'nay' ? current.nays - 1 : current.nays;
      showToast(`Ballot recorded: ${vote.toUpperCase()} cast on Civic Ledger`);
      return {
        ...prev,
        [postId]: { ayes: newAyes, nays: newNays, userVote: vote },
      };
    });
  };

  /* Quick Tip Handler */
  const handleTipPost = (postId: string, authorUsername: string, amount: number = 50) => {
    if (civicPointsBalance < amount) {
      showToast('Insufficient Civic Points balance');
      return;
    }
    sendCivicTip(postId, authorUsername, amount);
    showToast(`💎 Sent ${amount} Civic Points to @${authorUsername}!`);
  };

  const handlePublishInlinePost = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inlineContent.trim() && inlineMediaUrls.length === 0) return;

    createPost(
      inlineContent.trim(),
      inlineMediaUrls.length > 0 ? inlineMediaUrls : undefined,
      composerMode === 'treaty' ? 'Geneva Plenary Accord' : 'Global Youth Grid',
      [composerMode === 'treaty' ? 'TreatyDraft' : 'ZenPulse']
    );

    setInlineContent('');
    setInlineMediaUrls([]);
    showToast('Dispatch broadcasted to Sovereign Wire!');
  };

  // Determine active posts
  const basePosts = navTab === 'saved' ? savedPosts : feedPosts;

  const filteredPosts = basePosts.filter((p) => {
    if (hiddenPostIds.includes(p.id)) return false;
    if (navTab === 'feed' && feedFilter === 'following') {
      const matchesFollowing = isFollowing(p.authorUsername) || p.authorUsername === currentUserUsername;
      if (!matchesFollowing) return false;
    }

    if (chamberFilter !== 'all') {
      const cLower = p.content.toLowerCase();
      if (chamberFilter === 'treaties' && !cLower.includes('treaty') && !cLower.includes('accord') && !p.tags?.some((t) => t.toLowerCase().includes('treaty'))) return false;
      if (chamberFilter === 'plenary' && !cLower.includes('plenary') && !cLower.includes('un') && !cLower.includes('resolution')) return false;
      if (chamberFilter === 'audio' && !(p as any).audioUrl && p.postType !== 'floor_speech' && !cLower.includes('speech') && !cLower.includes('floor')) return false;
      if (chamberFilter === 'summits' && !cLower.includes('summit') && !cLower.includes('workshop') && !cLower.includes('event')) return false;
    }

    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      return (
        p.content.toLowerCase().includes(q) ||
        p.authorName.toLowerCase().includes(q) ||
        p.authorUsername.toLowerCase().includes(q) ||
        p.tags?.some((t) => t.toLowerCase().includes(q))
      );
    }
    return true;
  });

  const suggestedProfiles = profiles
    .filter((p) => p.username !== currentUserUsername && !isFollowing(p.username))
    .slice(0, 5);


  return (
    <div className="w-full min-h-screen text-white font-sans select-none relative pb-16 md:pb-6">
      {/* Toast Notification */}
      <AnimatePresence>
        {toastMessage && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="fixed top-6 left-1/2 -translate-x-1/2 z-50 px-4 py-2 rounded-full bg-white text-black font-semibold text-xs shadow-2xl flex items-center gap-2"
          >
            <Check className="w-3.5 h-3.5 text-emerald-600" />
            <span>{toastMessage}</span>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ── Main Layout Container (Full Width Responsive 3-Column Grid) ── */}
      <div className="max-w-7xl mx-auto w-full px-2 sm:px-4 space-y-6">
        
        {/* ── Breaking Directive Live Ticker (Clean Minimalist Glass) ── */}
        {navTab !== 'profile' && activeView !== 'profile' && (
          <div 
            onClick={() => {
              setActiveDirectiveIndex(tickerIndex);
              setShowDirectiveModal(true);
            }}
            className="p-3 rounded-2xl bg-[#090a0f] border border-white/10 hover:border-white/20 hover:bg-[#0c0d14] backdrop-blur-xl flex items-center justify-between gap-3 overflow-hidden cursor-pointer transition-all group select-none shadow-sm"
            title="Click to inspect full chamber directive & legislative dossier"
          >
            <div className="flex items-center gap-2.5 shrink-0">
              <span className="flex h-2 w-2 relative">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-rose-400 opacity-75" />
                <span className="relative inline-flex rounded-full h-2 w-2 bg-rose-500" />
              </span>
              <span className="px-2 py-0.5 rounded-md bg-white/5 border border-white/10 text-neutral-300 font-mono text-[9px] font-bold uppercase tracking-wider group-hover:bg-white/10 transition">
                CHAMBER DIRECTIVE
              </span>
            </div>

            <div className="flex-1 overflow-hidden">
              <AnimatePresence mode="wait">
                <motion.p
                  key={tickerIndex}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  transition={{ duration: 0.3 }}
                  className="text-xs font-mono text-zinc-300 group-hover:text-white truncate tracking-tight"
                >
                  {TICKER_DIRECTIVES[tickerIndex]}
                </motion.p>
              </AnimatePresence>
            </div>

            <div className="flex items-center gap-2 font-mono text-[10px] text-zinc-400 font-medium shrink-0">
              <span className="hidden sm:inline group-hover:underline">Read Details →</span>
              <span className="sm:hidden text-zinc-300 text-xs">Details →</span>
            </div>
          </div>
        )}

        {/* ── Pulse Command & Navigation Deck (Minimalist Monochrome) ── */}
        {navTab !== 'profile' && activeView !== 'profile' && (
          <div className="flex items-center justify-between pb-4 border-b border-white/10 flex-wrap gap-4 select-none">
            {/* Nav Pills */}
            <div className="flex items-center gap-1.5 p-1 rounded-2xl bg-[#090a0f] border border-white/10 backdrop-blur-xl">
              {[
                { id: 'feed', label: 'Wire', icon: Home },
                { id: 'explore', label: 'Explore', icon: Compass },
                { id: 'flux', label: 'FLUX', icon: Film },
                { id: 'saved', label: 'Saved', icon: Bookmark },
              ].map((tab) => {
                const Icon = tab.icon;
                const active = navTab === tab.id;
                return (
                  <button
                    key={tab.id}
                    onClick={() => handleTabChange(tab.id as any)}
                    className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all duration-200 cursor-pointer ${
                      active
                        ? 'bg-white text-black shadow-md'
                        : 'text-zinc-400 hover:text-white hover:bg-white/[0.06]'
                    }`}
                  >
                    <Icon className={`w-3.5 h-3.5 ${active ? 'text-black stroke-[2.5]' : 'text-zinc-400'}`} />
                    <span className="tracking-tight">{tab.label}</span>
                  </button>
                );
              })}
            </div>

            {/* Quick Action Triggers (Scrollable on Mobile) */}
            <div className="flex items-center gap-2 overflow-x-auto scrollbar-none py-0.5 max-w-full">
              <button
                onClick={() => setShowFloorSpeechModal(true)}
                className="px-3.5 py-1.5 rounded-2xl bg-white/[0.03] hover:bg-white/[0.08] border border-white/10 text-xs font-semibold text-zinc-300 hover:text-white transition-all flex items-center gap-1.5 cursor-pointer backdrop-blur-md shadow-sm whitespace-nowrap shrink-0"
                title="60s Guillotine Clock Floor Audio Relays"
              >
                <Radio className="w-3.5 h-3.5 text-rose-400 animate-pulse" />
                <span>Floor Relay</span>
              </button>

              <button
                onClick={() => setShowPassportModal(true)}
                className="px-3.5 py-1.5 rounded-2xl bg-white/[0.03] hover:bg-white/[0.08] border border-white/10 text-xs font-semibold text-zinc-300 hover:text-white transition-all flex items-center gap-1.5 cursor-pointer backdrop-blur-md shadow-sm whitespace-nowrap shrink-0"
                title="Sovereign Civic Passport & Clearance"
              >
                <Award className="w-3.5 h-3.5 text-amber-400" />
                <span>Passport ({civicPointsBalance} PTS)</span>
              </button>

              <button
                onClick={() => setShowStoryModal(true)}
                className="px-3.5 py-1.5 rounded-2xl bg-gradient-to-r from-amber-400/20 via-rose-500/20 to-fuchsia-600/20 hover:from-amber-400/30 hover:via-rose-500/30 hover:to-fuchsia-600/30 border border-rose-500/30 text-rose-300 text-xs font-bold transition flex items-center gap-1.5 cursor-pointer backdrop-blur-md shadow-sm whitespace-nowrap shrink-0"
              >
                <Sparkles className="w-3.5 h-3.5 text-amber-400" />
                <span>New Story</span>
              </button>

              <button
                onClick={() => setShowFluxComposerModal(true)}
                className="px-3.5 py-1.5 rounded-2xl bg-rose-500/10 hover:bg-rose-500/20 border border-rose-500/30 hover:border-rose-500/50 text-xs font-bold text-rose-300 transition-all flex items-center gap-1.5 cursor-pointer backdrop-blur-md shadow-sm whitespace-nowrap shrink-0"
                title="Create FLUX Video Reel"
              >
                <Film className="w-3.5 h-3.5 text-rose-400" />
                <span>FLUX</span>
              </button>

              {isFounderUser && (
                <button
                  onClick={() => setShowFounderModal(true)}
                  className="px-3.5 py-1.5 rounded-2xl bg-amber-400/20 hover:bg-amber-400/30 border border-amber-400/40 text-xs font-bold text-amber-300 transition-all flex items-center gap-1.5 cursor-pointer backdrop-blur-md shadow-[0_0_15px_rgba(251,191,36,0.3)] whitespace-nowrap shrink-0"
                  title="Open Supreme Founder Sovereignty Suite"
                >
                  <Crown className="w-3.5 h-3.5 text-amber-400" />
                  <span>👑 Founder Menu</span>
                </button>
              )}

              {isAdminUser && (
                <button
                  onClick={() => setShowAdminModal(true)}
                  className="px-3.5 py-1.5 rounded-2xl bg-cyan-500/15 hover:bg-cyan-500/25 border border-cyan-500/30 text-xs font-bold text-cyan-300 transition-all flex items-center gap-1.5 cursor-pointer backdrop-blur-md shadow-sm whitespace-nowrap shrink-0"
                  title="Open Admin & Committee Operational Console"
                >
                  <ShieldCheck className="w-3.5 h-3.5 text-cyan-400" />
                  <span>🛡️ Admin Menu</span>
                </button>
              )}

              <button
                onClick={() => setShowPostComposerModal(true)}
                className="px-4 py-1.5 rounded-2xl bg-white hover:bg-zinc-200 text-black text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer shadow-md whitespace-nowrap shrink-0"
              >
                <Plus className="w-4 h-4 stroke-[2.5]" />
                <span>New Dispatch</span>
              </button>
            </div>
          </div>
        )}

        {/* ── Clean Centered Workspace (No Sidebars) ── */}
        <div className="max-w-2xl sm:max-w-3xl mx-auto w-full space-y-6">
          <main className="w-full space-y-6">
            {/* Subview: FLUX Reels */}
            {navTab === 'flux' && (
              <div className="max-w-md mx-auto py-2">
                <FluxReelsFeed />
              </div>
            )}

            {/* Subview: Discover / Explore */}
            {navTab === 'explore' && (
              <div className="space-y-6">
                <DiscoverProfiles />
              </div>
            )}

            {/* Subview: Profile */}
            {navTab === 'profile' && (
              <div className="max-w-3xl mx-auto py-2">
                <UserProfileView />
              </div>
            )}

            {/* Subview: Feed & Saved */}
            {(navTab === 'feed' || navTab === 'saved') && (
              <div className="space-y-6 w-full">
              
                {/* ── Orbital Wire Capsules (Stories Tray) ── */}
                {navTab === 'feed' && (
                  <div className="p-4 sm:p-5 rounded-3xl bg-[#090b12]/90 border border-white/10 backdrop-blur-2xl shadow-[0_15px_40px_rgba(0,0,0,0.7)]">
                    <StoriesTray />
                  </div>
                )}

                {/* ── Private Saved Vault Banner ── */}
                {navTab === 'saved' && (
                  <div className="p-4 sm:p-5 rounded-3xl bg-[#090b12]/90 border border-purple-500/25 backdrop-blur-2xl shadow-[0_15px_40px_rgba(0,0,0,0.7)] flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-2xl bg-purple-500/10 border border-purple-500/25 flex items-center justify-center text-purple-400 shrink-0">
                        <Lock className="w-5 h-5" />
                      </div>
                      <div>
                        <div className="flex items-center gap-2">
                          <h3 className="font-bold text-sm text-white">Private Saved Dispatches</h3>
                          <span className="px-2 py-0.5 rounded-full bg-purple-500/20 text-purple-300 font-mono text-[9px] font-bold uppercase tracking-wider border border-purple-500/30">
                            Private Vault
                          </span>
                        </div>
                        <p className="text-xs text-neutral-400">
                          Encrypted to your sovereign account. Only you can view or manage your saved items.
                        </p>
                      </div>
                    </div>
                    <span className="text-xs font-mono font-bold text-purple-300 px-3 py-1.5 rounded-full bg-purple-500/15 border border-purple-500/30 shrink-0">
                      {savedPosts.length} Private Items
                    </span>
                  </div>
                )}

                {/* ── Live Founder Directive / Executive Note Banner ── */}
                {founderDirective.isActive && navTab === 'feed' && (
                  <div className="p-5 rounded-3xl bg-gradient-to-r from-rose-950/40 via-[#0d0914] to-zinc-950 border border-rose-500/30 shadow-[0_10px_35px_rgba(244,63,94,0.15)] relative overflow-hidden space-y-3">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <span className="w-2 h-2 rounded-full bg-rose-500 animate-pulse" />
                        <span className="px-2.5 py-0.5 rounded-full bg-rose-500/20 text-rose-300 font-mono text-[9px] font-bold uppercase tracking-wider border border-rose-500/30">
                          {founderDirective.tag || 'EXECUTIVE DIRECTIVE'} • {founderDirective.priority}
                        </span>
                      </div>

                      {isFounderUser && (
                        <button
                          type="button"
                          onClick={() => setShowFounderModal(true)}
                          className="px-2.5 py-1 rounded-xl bg-amber-400/10 hover:bg-amber-400/20 text-amber-300 hover:text-amber-200 border border-amber-400/30 text-[10px] font-mono font-bold transition flex items-center gap-1 cursor-pointer"
                          title="Edit Founder Note (Founder Clearance)"
                        >
                          <Edit3 className="w-3 h-3 text-amber-400" />
                          <span>Edit Directive</span>
                        </button>
                      )}
                    </div>

                    <h3 className="font-display font-bold text-sm sm:text-base text-white tracking-wide">
                      {founderDirective.title}
                    </h3>

                    <p className="text-xs text-zinc-300 leading-relaxed font-sans font-light">
                      {founderDirective.body}
                    </p>

                    <div className="pt-2 border-t border-white/10 flex items-center justify-between text-[10px] font-mono text-zinc-500">
                      <span>SIGNATURE: <strong className="text-zinc-300">{founderDirective.author}</strong></span>
                      <span>BROADCAST ACTIVE</span>
                    </div>
                  </div>
                )}

                {/* ── Global Chamber Filter Bar ── */}
                {navTab === 'feed' && (
                  <div className="flex items-center gap-2 overflow-x-auto scrollbar-none py-1 select-none">
                    {[
                      { id: 'all', label: '🌐 All Wire' },
                      { id: 'plenary', label: '🏛️ Plenary UN' },
                      { id: 'treaties', label: '⚡ Treaties' },
                      { id: 'audio', label: '🎙️ Floor Audio' },
                      { id: 'summits', label: '🚀 Summits & Hacks' },
                    ].map((tab) => {
                      const active = chamberFilter === tab.id;
                      return (
                        <button
                          key={tab.id}
                          onClick={() => setChamberFilter(tab.id as any)}
                          className={`px-3.5 py-1.5 rounded-full text-xs font-mono font-bold transition whitespace-nowrap cursor-pointer border ${
                            active
                              ? 'bg-white text-black border-white shadow-[0_0_15px_rgba(255,255,255,0.4)]'
                              : 'bg-[#090b12] border-white/10 text-zinc-400 hover:text-white hover:border-white/20'
                          }`}
                        >
                          {tab.label}
                        </button>
                      );
                    })}
                  </div>
                )}

                {/* ── Sovereign Dispatch Terminal (Quick Share Composer) ── */}
                {navTab === 'feed' && (
                  <div className="p-5 rounded-3xl bg-[#090b12] border border-white/10 shadow-[0_15px_40px_rgba(0,0,0,0.7)] space-y-4 backdrop-blur-xl">
                    {/* Mode Switcher */}
                    <div className="flex items-center justify-between border-b border-white/10 pb-2.5">
                      <div className="flex items-center gap-2">
                        {[
                          { id: 'dispatch', label: 'Dispatch', icon: Zap },
                          { id: 'treaty', label: 'Treaty Draft', icon: Vote },
                        ].map((m) => {
                          const Icon = m.icon;
                          const active = composerMode === m.id;
                          return (
                            <button
                              key={m.id}
                              type="button"
                              onClick={() => setComposerMode(m.id as any)}
                              className={`flex items-center gap-1.5 px-3 py-1 rounded-xl text-xs font-mono font-bold transition cursor-pointer ${
                                active
                                  ? 'bg-cyan-500/20 border border-cyan-500/40 text-cyan-300'
                                  : 'text-zinc-400 hover:text-white'
                              }`}
                            >
                              <Icon className="w-3.5 h-3.5" />
                              <span>{m.label}</span>
                            </button>
                          );
                        })}
                      </div>
                      <span className="text-[10px] font-mono text-zinc-500">
                        Node @{activeUsername}
                      </span>
                    </div>

                    <div className="flex items-start gap-3.5">
                      <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-cyan-500 to-blue-600 p-[1.5px] shrink-0 shadow-md">
                        <div className="w-full h-full rounded-[14px] bg-black flex items-center justify-center font-bold text-sm text-white uppercase">
                          {(currentUserName || 'U')[0]?.toUpperCase() || 'U'}
                        </div>
                      </div>
                      <textarea
                        rows={2}
                        value={inlineContent}
                        onChange={(e) => setInlineContent(e.target.value)}
                        placeholder={
                          composerMode === 'treaty'
                            ? 'Draft a treaty clause or redline resolution for the Plenary Assembly...'
                            : 'Broadcast a sovereign thought, research finding, or chamber dispatch...'
                        }
                        className="flex-1 bg-transparent border-none text-sm text-white placeholder:text-zinc-500 focus:outline-none font-normal resize-none leading-relaxed"
                      />
                    </div>

                    <input
                      type="file"
                      ref={inlineFileInputRef}
                      accept="image/*,video/*"
                      multiple
                      onChange={handleInlineFileUpload}
                      className="hidden"
                    />

                    {inlineMediaUrls.length > 0 && (
                      <div className="pt-2 flex items-center gap-2 overflow-x-auto no-scrollbar">
                        {inlineMediaUrls.map((mediaUrl, idx) => {
                          const isItemVideo = mediaUrl.startsWith('data:video') || mediaUrl.includes('.mp4') || mediaUrl.includes('.webm') || mediaUrl.includes('.mov');
                          return (
                            <div key={idx} className="relative w-20 h-20 rounded-2xl overflow-hidden border border-white/20 shadow-md shrink-0 bg-zinc-900">
                              {isItemVideo ? (
                                <div className="w-full h-full flex items-center justify-center text-[10px] font-mono text-zinc-300">▶ VID</div>
                              ) : (
                                <img src={mediaUrl} alt="Preview" className="w-full h-full object-cover" />
                              )}
                              <span className="absolute bottom-1 left-1 px-1 text-[8px] bg-black/80 font-mono text-white rounded">{idx + 1}</span>
                              <button
                                type="button"
                                onClick={() => setInlineMediaUrls((prev) => prev.filter((_, i) => i !== idx))}
                                className="absolute top-1 right-1 p-1 rounded-full bg-black/80 text-white hover:bg-rose-600 transition cursor-pointer shadow"
                                title="Remove media"
                              >
                                <X className="w-3 h-3" />
                              </button>
                            </div>
                          );
                        })}
                        <button
                          type="button"
                          onClick={() => inlineFileInputRef.current?.click()}
                          className="w-20 h-20 rounded-2xl border-2 border-dashed border-white/20 hover:border-white text-zinc-400 hover:text-white flex flex-col items-center justify-center gap-1 transition shrink-0 cursor-pointer bg-white/5"
                          title="Attach another photo/video"
                        >
                          <Plus className="w-4 h-4" />
                          <span className="text-[9px] font-mono">Add Slide</span>
                        </button>
                      </div>
                    )}

                    <div className="flex items-center justify-between pt-2 border-t border-white/10 text-xs">
                      <div className="flex items-center gap-2">
                        <button
                          type="button"
                          onClick={() => inlineFileInputRef.current?.click()}
                          className="flex items-center gap-1.5 text-zinc-300 hover:text-white transition cursor-pointer px-3 py-1.5 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10"
                        >
                          <ImageIcon className="w-4 h-4 text-emerald-400" />
                          <span>Attach Media</span>
                        </button>
                      </div>

                      <button
                        onClick={handlePublishInlinePost}
                        disabled={!inlineContent.trim() && inlineMediaUrls.length === 0}
                        className="px-5 py-2 rounded-xl bg-white hover:bg-zinc-200 disabled:opacity-30 disabled:cursor-not-allowed text-black text-xs font-bold transition cursor-pointer shadow-md"
                      >
                        Broadcast Wire
                      </button>
                    </div>
                  </div>
                )}

                {/* ── Featured Micro-Flex & Sparks Dossiers Rail ── */}
                {INITIAL_SPARKS.length > 0 && (
                  <div className="space-y-3 pb-2">
                    <div className="flex items-center justify-between px-1">
                      <div className="flex items-center gap-2">
                        <Zap className="w-4 h-4 text-amber-400" />
                        <span className="font-display font-bold text-xs text-white uppercase tracking-wider">
                          ⚡ Micro-Flex &amp; Treaty Charters
                        </span>
                      </div>
                      <span className="text-[10px] font-mono text-neutral-500">Fast Diplomatic Reads</span>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      {INITIAL_SPARKS.map((spark) => (
                        <ZenSparkCard
                          key={spark.id}
                          spark={spark}
                          onBookmark={() => showToast('Saved to Treaty Ledger')}
                          onOpenFlex={(sp) => {
                            setActiveFlexItem({
                              id: sp.id,
                              type: 'spark',
                              title: sp.title,
                              content: sp.summary,
                              authorName: sp.authorName,
                              authorUsername: sp.authorUsername,
                              authorAvatar: sp.authorAvatar,
                              createdAt: sp.createdAt,
                              likes: sp.likes,
                              category: sp.category,
                              readingTimeMinutes: sp.readingTimeMinutes,
                              keyTakeaways: sp.keyTakeaways,
                              fullDossier: sp.fullDossier,
                              treatyClauseReference: sp.treatyClauseReference,
                              threadSegments: sp.fullDossier.split(/\n\n+/).filter((s) => s.trim().length > 0),
                            });
                          }}
                        />
                      ))}
                    </div>
                  </div>
                )}

                {/* ── Sovereign Monolith Posts Feed ── */}
                <div className="space-y-6">
                  {filteredPosts.length === 0 ? (
                    <div className="p-10 rounded-3xl bg-[#090a0f] border border-white/10 text-center space-y-4 shadow-xl flex flex-col items-center justify-center">
                      <div className="w-14 h-14 rounded-2xl bg-cyan-500/10 border border-cyan-500/20 flex items-center justify-center text-cyan-400 shadow-inner">
                        <Radio className="w-7 h-7 animate-pulse" />
                      </div>
                      <div className="space-y-1.5 max-w-md">
                        <h3 className="font-display font-bold text-lg text-white tracking-wide">
                          No Dispatches on Wire Yet
                        </h3>
                        <p className="text-xs text-neutral-400 leading-relaxed font-sans">
                          Be the first delegate to broadcast a sovereign policy dispatch, research brief, or floor deliberation to the chamber.
                        </p>
                      </div>
                      <button
                        type="button"
                        onClick={() => setShowPostComposerModal(true)}
                        className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-white text-xs font-bold font-mono tracking-wider shadow-lg shadow-cyan-500/20 transition-all hover:scale-105 cursor-pointer flex items-center gap-2"
                      >
                        <Plus className="w-4 h-4" />
                        <span>TRANSMIT FIRST DISPATCH</span>
                      </button>
                    </div>
                  ) : (
                    filteredPosts.map((post) => {
                    const hasLiked = post.likedBy.includes(currentUserId);
                    const isHeartBursting = doubleTapHearts[post.id];
                    const hasSaved = isSaved(post.id);
                    const hasImage = post.images && post.images.length > 0;
                    const replies = getReplies(post.id);
                    const isExpanded = expandedComments[post.id];
                    const isFollowingAuthor = isFollowing(post.authorUsername);
                    const isSelf = post.authorUsername === currentUserUsername;
                    const voteData = votesByPostId[post.id] || { ayes: 42, nays: 6 };
                    const totalVotes = voteData.ayes + voteData.nays;
                    const ayePercent = Math.round((voteData.ayes / totalVotes) * 100);

                    const isMenuOpen = activeMenuPostId === post.id;

                    return (
                      <article
                        key={post.id}
                        id={`post-${post.id}`}
                        className={`rounded-3xl bg-[#090a0f] border border-white/10 space-y-4 pb-5 shadow-xl hover:border-white/20 transition-all duration-300 relative ${
                          isMenuOpen ? 'z-40 overflow-visible' : 'z-10'
                        }`}
                      >
                        {/* Monolith Card Category Ribbon */}
                        <div className="px-5 pt-4 flex items-center justify-between border-b border-white/5 pb-2.5">
                          <div className="flex items-center gap-2">
                            <span className="w-1.5 h-1.5 rounded-full bg-white animate-pulse" />
                            <span className="font-mono text-[10px] font-bold text-neutral-300 uppercase tracking-wider">
                              {post.postType === 'treaty' ? '📜 PLENARY RESOLUTION' : post.postType === 'floor_speech' ? '🎙️ 60S FLOOR AUDIO' : '⚡ CIVIC DISPATCH'}
                            </span>
                          </div>
                          <span className="text-[10px] font-mono text-zinc-500">
                            Palais des Nations • Wire #{post.id.slice(-3) || '108'}
                          </span>
                        </div>

                        {/* Post Header */}
                        <div className="flex items-center justify-between px-5">
                          <div className="flex items-center gap-3.5 min-w-0">
                            {/* Avatar with Sunset Story Ring */}
                            <div
                              onClick={() => {
                                setSelectedProfileUsername(post.authorUsername);
                                setNavTab('profile');
                                openUserProfile(post.authorUsername);
                              }}
                              className="w-11 h-11 rounded-full bg-gradient-to-tr from-amber-400 via-rose-500 to-fuchsia-600 p-[2px] shrink-0 cursor-pointer shadow-md group hover:scale-105 transition-transform"
                            >
                              <div className="w-full h-full rounded-full bg-black flex items-center justify-center font-bold text-sm text-white uppercase overflow-hidden">
                                {post.authorName?.[0]?.toUpperCase() || 'U'}
                              </div>
                            </div>

                            <div className="min-w-0">
                              <div className="flex items-center gap-2">
                                <span
                                  onClick={() => {
                                    setSelectedProfileUsername(post.authorUsername);
                                    setNavTab('profile');
                                    openUserProfile(post.authorUsername);
                                  }}
                                  className="font-bold text-sm text-white hover:underline transition cursor-pointer truncate tracking-tight"
                                >
                                  {post.authorName || post.authorUsername}
                                </span>
                                <span className="text-zinc-500 text-xs">@{post.authorUsername}</span>
                                
                                {!isSelf && !isFollowingAuthor && (
                                  <button
                                    onClick={() => toggleFollow(post.authorUsername)}
                                    className="text-xs font-bold text-white hover:underline transition cursor-pointer ml-1"
                                  >
                                    · Follow
                                  </button>
                                )}
                              </div>
                              <p className="text-[10px] font-mono text-zinc-500">
                                {post.location || 'Geneva Global Assembly'} · {post.createdAt || 'Just now'}
                              </p>
                            </div>
                          </div>

                          <div className="relative">
                            <button
                              type="button"
                              onClick={(e) => {
                                e.stopPropagation();
                                setActiveMenuPostId(activeMenuPostId === post.id ? null : post.id);
                              }}
                              className={`p-2 rounded-xl transition cursor-pointer ${
                                activeMenuPostId === post.id
                                  ? 'bg-white/15 text-white'
                                  : 'text-zinc-400 hover:text-white hover:bg-white/5'
                              }`}
                              title="Dispatch Settings & Options"
                            >
                              <MoreHorizontal className="w-5 h-5" />
                            </button>

                            {/* Dispatch Settings / Options Dropdown Menu */}
                            <AnimatePresence>
                              {activeMenuPostId === post.id && (
                                <>
                                  {/* Invisible Click-Outside Backdrop */}
                                  <div
                                    className="fixed inset-0 z-40"
                                    onClick={(e) => {
                                      e.stopPropagation();
                                      setActiveMenuPostId(null);
                                    }}
                                  />

                                  <motion.div
                                    initial={{ opacity: 0, scale: 0.95, y: -4 }}
                                    animate={{ opacity: 1, scale: 1, y: 0 }}
                                    exit={{ opacity: 0, scale: 0.95, y: -4 }}
                                    transition={{ duration: 0.15 }}
                                    onClick={(e) => e.stopPropagation()}
                                    className="absolute right-0 top-full mt-1.5 w-60 bg-[#0c0e18] border border-white/15 rounded-2xl shadow-[0_15px_50px_rgba(0,0,0,0.85)] p-1.5 z-50 backdrop-blur-xl font-mono text-xs space-y-0.5"
                                  >
                                    {/* Header Label */}
                                    <div className="px-3 py-1.5 text-[10px] font-bold text-zinc-400 tracking-wider uppercase border-b border-white/5 flex items-center justify-between">
                                      <span>Dispatch Settings</span>
                                      <span className="text-[9px] text-zinc-500">#{post.id.slice(-4)}</span>
                                    </div>

                                    {/* Option 1: Save / Bookmark */}
                                    <button
                                      type="button"
                                      onClick={() => {
                                        toggleSavePost(post.id);
                                        showToast(hasSaved ? 'Removed from Saved dispatches' : 'Dispatch saved to private vault');
                                        setActiveMenuPostId(null);
                                      }}
                                      className="w-full px-3 py-2 rounded-xl text-left flex items-center gap-2.5 text-zinc-200 hover:text-white hover:bg-white/10 transition cursor-pointer"
                                    >
                                      <Bookmark className={`w-4 h-4 shrink-0 ${hasSaved ? 'text-amber-400 fill-amber-400' : 'text-zinc-400'}`} />
                                      <span>{hasSaved ? 'Remove from Saved' : 'Save Dispatch to Vault'}</span>
                                    </button>

                                    {/* Option 2: Copy Link */}
                                    <button
                                      type="button"
                                      onClick={() => {
                                        if (typeof navigator !== 'undefined' && navigator.clipboard) {
                                          navigator.clipboard.writeText(`${window.location.origin}/pulse?post=${post.id}`);
                                          showToast('Dispatch link copied to clipboard!');
                                        }
                                        setActiveMenuPostId(null);
                                      }}
                                      className="w-full px-3 py-2 rounded-xl text-left flex items-center gap-2.5 text-zinc-200 hover:text-white hover:bg-white/10 transition cursor-pointer"
                                    >
                                      <Share2 className="w-4 h-4 text-cyan-400 shrink-0" />
                                      <span>Copy Dispatch Link</span>
                                    </button>

                                    {/* Option 3: Copy Text */}
                                    <button
                                      type="button"
                                      onClick={() => {
                                        if (typeof navigator !== 'undefined' && navigator.clipboard && post.content) {
                                          navigator.clipboard.writeText(post.content);
                                          showToast('Dispatch text copied!');
                                        }
                                        setActiveMenuPostId(null);
                                      }}
                                      className="w-full px-3 py-2 rounded-xl text-left flex items-center gap-2.5 text-zinc-200 hover:text-white hover:bg-white/10 transition cursor-pointer"
                                    >
                                      <Copy className="w-4 h-4 text-emerald-400 shrink-0" />
                                      <span>Copy Dispatch Text</span>
                                    </button>

                                    {/* Option 4: Follow / Unfollow */}
                                    {!isSelf && (
                                      <button
                                        type="button"
                                        onClick={() => {
                                          toggleFollow(post.authorUsername);
                                          showToast(isFollowingAuthor ? `Unfollowed @${post.authorUsername}` : `Following @${post.authorUsername}`);
                                          setActiveMenuPostId(null);
                                        }}
                                        className="w-full px-3 py-2 rounded-xl text-left flex items-center gap-2.5 text-zinc-200 hover:text-white hover:bg-white/10 transition cursor-pointer"
                                      >
                                        {isFollowingAuthor ? (
                                          <>
                                            <UserCheck className="w-4 h-4 text-purple-400 shrink-0" />
                                            <span>Unfollow @{post.authorUsername}</span>
                                          </>
                                        ) : (
                                          <>
                                            <UserPlus className="w-4 h-4 text-purple-400 shrink-0" />
                                            <span>Follow @{post.authorUsername}</span>
                                          </>
                                        )}
                                      </button>
                                    )}

                                    {/* Option 5: View Author Profile */}
                                    <button
                                      type="button"
                                      onClick={() => {
                                        setSelectedProfileUsername(post.authorUsername);
                                        setNavTab('profile');
                                        openUserProfile(post.authorUsername);
                                        setActiveMenuPostId(null);
                                      }}
                                      className="w-full px-3 py-2 rounded-xl text-left flex items-center gap-2.5 text-zinc-200 hover:text-white hover:bg-white/10 transition cursor-pointer"
                                    >
                                      <User className="w-4 h-4 text-blue-400 shrink-0" />
                                      <span>View @{post.authorUsername} Profile</span>
                                    </button>

                                    {/* Option 6: Hide Dispatch */}
                                    <button
                                      type="button"
                                      onClick={() => {
                                        setHiddenPostIds((prev) => [...prev, post.id]);
                                        showToast('Dispatch hidden from your feed');
                                        setActiveMenuPostId(null);
                                      }}
                                      className="w-full px-3 py-2 rounded-xl text-left flex items-center gap-2.5 text-zinc-200 hover:text-white hover:bg-white/10 transition cursor-pointer"
                                    >
                                      <EyeOff className="w-4 h-4 text-zinc-400 shrink-0" />
                                      <span>Hide Dispatch from Feed</span>
                                    </button>

                                    {/* Option 7: Report Dispatch */}
                                    <button
                                      type="button"
                                      onClick={() => {
                                        showToast('🚨 Dispatch flagged for Sovereign Council review.');
                                        setActiveMenuPostId(null);
                                      }}
                                      className="w-full px-3 py-2 rounded-xl text-left flex items-center gap-2.5 text-amber-300 hover:text-amber-200 hover:bg-amber-500/10 transition cursor-pointer"
                                    >
                                      <Flag className="w-4 h-4 text-amber-400 shrink-0" />
                                      <span>Report Inaccuracy / Misconduct</span>
                                    </button>

                                    {/* Option 8: Delete Dispatch (Author / Founder / Admin Only) */}
                                    {(isSelf || isFounderUser || isAdminUser) && (
                                      <div className="pt-1 border-t border-white/10">
                                        <button
                                          type="button"
                                          onClick={() => {
                                            deletePost(post.id);
                                            showToast('Dispatch purged from public feed');
                                            setActiveMenuPostId(null);
                                          }}
                                          className="w-full px-3 py-2 rounded-xl text-left flex items-center gap-2.5 text-rose-400 hover:text-rose-300 hover:bg-rose-500/15 transition cursor-pointer font-bold"
                                        >
                                          <Trash2 className="w-4 h-4 text-rose-400 shrink-0" />
                                          <span>Delete Dispatch</span>
                                        </button>
                                      </div>
                                    )}
                                  </motion.div>
                                </>
                              )}
                            </AnimatePresence>
                          </div>
                        </div>

                        {/* Post Media (Multi-Page / Carousel Image & Video) */}
                        {hasImage && post.images && post.images.length > 0 && (() => {
                          const currentSlide = activeSlideByPostId[post.id] || 0;
                          const mediaCount = post.images.length;
                          const currentMedia = post.images[currentSlide] || post.images[0];
                          const isVideo = currentMedia.startsWith('data:video') || currentMedia.includes('.mp4') || currentMedia.includes('.webm') || currentMedia.includes('.mov');

                          return (
                            <div
                              onDoubleClick={() => handleDoubleTapLike(post.id)}
                              className="relative w-full aspect-video sm:aspect-[16/9] bg-zinc-950 flex items-center justify-center overflow-hidden cursor-pointer select-none border-y border-white/5 group/carousel"
                            >
                              {/* Multi-Page Slide Counter */}
                              {mediaCount > 1 && (
                                <div className="absolute top-3 right-3 px-2.5 py-1 rounded-full bg-black/75 backdrop-blur-md text-[10px] font-mono font-bold text-white border border-white/20 z-20 shadow-md">
                                  {currentSlide + 1} / {mediaCount}
                                </div>
                              )}

                              {/* Carousel Left / Right Navigation Controls */}
                              {currentSlide > 0 && (
                                <button
                                  type="button"
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    setActiveSlideByPostId((prev) => ({ ...prev, [post.id]: Math.max(0, currentSlide - 1) }));
                                  }}
                                  className="absolute left-3 top-1/2 -translate-y-1/2 w-8 h-8 rounded-full bg-black/80 hover:bg-black text-white flex items-center justify-center z-20 shadow-xl cursor-pointer border border-white/20 text-sm font-bold opacity-0 group-hover/carousel:opacity-100 transition-opacity hover:scale-105"
                                  title="Previous slide"
                                >
                                  ‹
                                </button>
                              )}

                              {currentSlide < mediaCount - 1 && (
                                <button
                                  type="button"
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    setActiveSlideByPostId((prev) => ({ ...prev, [post.id]: Math.min(mediaCount - 1, currentSlide + 1) }));
                                  }}
                                  className="absolute right-3 top-1/2 -translate-y-1/2 w-8 h-8 rounded-full bg-black/80 hover:bg-black text-white flex items-center justify-center z-20 shadow-xl cursor-pointer border border-white/20 text-sm font-bold opacity-0 group-hover/carousel:opacity-100 transition-opacity hover:scale-105"
                                  title="Next slide"
                                >
                                  ›
                                </button>
                              )}

                              {/* Slide Media Content */}
                              {isVideo ? (
                                <video
                                  src={currentMedia}
                                  controls
                                  className="w-full h-full object-cover"
                                />
                              ) : (
                                <img
                                  src={currentMedia}
                                  alt="Post photo"
                                  className="w-full h-full object-cover hover:scale-[1.01] transition-transform duration-500"
                                />
                              )}

                              {/* Bottom Pagination Dots */}
                              {mediaCount > 1 && (
                                <div className="absolute bottom-3 left-1/2 -translate-x-1/2 flex items-center gap-1.5 z-20 bg-black/60 backdrop-blur-md px-3 py-1 rounded-full border border-white/10">
                                  {post.images.map((_, i) => (
                                    <button
                                      key={i}
                                      type="button"
                                      onClick={(e) => {
                                        e.stopPropagation();
                                        setActiveSlideByPostId((prev) => ({ ...prev, [post.id]: i }));
                                      }}
                                      className={`rounded-full transition-all cursor-pointer ${
                                        i === currentSlide ? 'w-2 h-2 bg-white' : 'w-1.5 h-1.5 bg-white/40 hover:bg-white/70'
                                      }`}
                                    />
                                  ))}
                                </div>
                              )}

                              <AnimatePresence>
                                {isHeartBursting && (
                                  <motion.div
                                    initial={{ scale: 0, opacity: 0 }}
                                    animate={{ scale: [0, 1.3, 1], opacity: [0, 1, 0] }}
                                    exit={{ opacity: 0 }}
                                    transition={{ duration: 0.7 }}
                                    className="absolute inset-0 flex items-center justify-center pointer-events-none z-30"
                                  >
                                    <Heart className="w-24 h-24 text-rose-500 fill-rose-500 drop-shadow-[0_0_35px_rgba(244,63,94,1)]" />
                                  </motion.div>
                                )}
                              </AnimatePresence>
                            </div>
                          );
                        })()}

                        {/* Caption & Body */}
                        <div className="px-5 text-sm leading-relaxed space-y-3">
                          <p 
                            className="whitespace-pre-wrap text-sm text-zinc-200 leading-relaxed font-sans"
                            style={getStoryFontStyle(post.fontStyle)}
                          >
                            {post.content}
                          </p>

                          {/* ── Attached Music Soundtrack Player ── */}
                          {(post.songTitle || post.songAudioUrl) && (
                            <div className="p-3.5 rounded-2xl bg-gradient-to-r from-rose-950/40 via-black to-purple-950/30 border border-rose-500/30 flex items-center justify-between shadow-lg">
                              <div className="flex items-center gap-3 overflow-hidden">
                                <button
                                  type="button"
                                  onClick={() => {
                                    if (playingAudioId === `music_${post.id}`) {
                                      setPlayingAudioId(null);
                                    } else {
                                      setPlayingAudioId(`music_${post.id}`);
                                      showToast(`Playing soundtrack: ${post.songTitle || 'Attached Audio'}`);
                                    }
                                  }}
                                  className="w-9 h-9 rounded-xl bg-gradient-to-tr from-rose-500 via-amber-500 to-rose-600 text-white flex items-center justify-center font-bold hover:scale-105 transition cursor-pointer shrink-0 shadow-lg"
                                >
                                  {playingAudioId === `music_${post.id}` ? (
                                    <Pause className="w-4 h-4 fill-white" />
                                  ) : (
                                    <Play className="w-4 h-4 fill-white ml-0.5" />
                                  )}
                                </button>

                                <div className="overflow-hidden">
                                  <div className="flex items-center gap-1.5">
                                    <Music className={`w-3.5 h-3.5 text-rose-400 shrink-0 ${playingAudioId === `music_${post.id}` ? 'animate-spin' : ''}`} style={{ animationDuration: '4s' }} />
                                    <p className="text-xs font-bold text-white font-mono truncate">
                                      {post.songTitle || 'Original Soundtrack'}
                                    </p>
                                  </div>
                                  <p className="text-[10px] text-zinc-400 font-mono truncate">
                                    {post.songArtist || 'Zenvitra Soundscape'}
                                  </p>
                                </div>
                              </div>

                              {/* Equalizer Visualizer Bars */}
                              <div className="flex items-center gap-1 h-5 px-2 shrink-0">
                                {[40, 75, 55, 90, 60, 85, 45].map((bar, bIdx) => (
                                  <div
                                    key={bIdx}
                                    className={`w-1 rounded-full transition-all duration-200 ${
                                      playingAudioId === `music_${post.id}` ? 'bg-gradient-to-t from-rose-500 to-amber-400 animate-pulse' : 'bg-neutral-700'
                                    }`}
                                    style={{ height: `${playingAudioId === `music_${post.id}` ? bar : 20}%` }}
                                  />
                                ))}
                              </div>
                            </div>
                          )}

                          {/* ── Floor Speech: Video Address Player ── */}
                          {(post.speechFormat === 'video' || post.speechVideoUrl || post.audioDispatch?.videoUrl) && (
                            <div className="p-4 rounded-3xl bg-[#08090f] border border-cyan-500/30 space-y-3 shadow-2xl">
                              <div className="flex items-center justify-between">
                                <div className="flex items-center gap-2">
                                  <span className="w-2 h-2 rounded-full bg-rose-500 animate-pulse" />
                                  <span className="font-mono text-[11px] text-rose-300 font-bold uppercase tracking-wider">
                                    📹 Chamber Video Address • {post.speechDelegation || post.audioDispatch?.delegationName || post.authorName}
                                  </span>
                                </div>
                                <span className="px-2 py-0.5 rounded-full bg-cyan-500/20 border border-cyan-500/30 text-cyan-300 font-mono text-[10px]">
                                  {post.speechDuration || post.audioDispatch?.durationSeconds || 60}s Guillotine Clock
                                </span>
                              </div>

                              <div className="relative w-full aspect-video rounded-2xl bg-black border border-white/10 overflow-hidden shadow-inner">
                                <video
                                  src={post.speechVideoUrl || post.audioDispatch?.videoUrl || 'https://assets.mixkit.co/videos/preview/mixkit-hands-of-a-man-typing-on-a-laptop-43187-large.mp4'}
                                  controls
                                  playsInline
                                  className="w-full h-full object-contain"
                                />
                              </div>

                              {post.speechTranscript && (
                                <div className="p-3 rounded-xl bg-white/[0.03] border border-white/5 text-xs text-zinc-300 font-sans leading-relaxed">
                                  <p className="text-[10px] font-mono font-bold text-cyan-400 uppercase mb-1">Prepared Remarks Transcript</p>
                                  <p>{post.speechTranscript}</p>
                                </div>
                              )}
                            </div>
                          )}

                          {/* ── Floor Speech: Audio Transceiver Player ── */}
                          {(post.speechFormat === 'audio' || (post.postType === 'floor_speech' && !post.speechVideoUrl) || (post as any).audioUrl || post.audioDispatch?.audioUrl) && (
                            <div className="p-4 rounded-2xl bg-cyan-950/20 border border-cyan-500/30 space-y-3 shadow-inner">
                              <div className="flex items-center justify-between">
                                <div className="flex items-center gap-2">
                                  <span className="w-2 h-2 rounded-full bg-cyan-400 animate-ping" />
                                  <span className="font-mono text-[11px] text-cyan-300 font-bold uppercase tracking-wider">
                                    🎙️ Floor Speech Relay • {post.speechDelegation || post.audioDispatch?.delegationName || post.authorName}
                                  </span>
                                </div>
                                <span className="px-2 py-0.5 rounded-full bg-cyan-500/20 border border-cyan-500/30 text-cyan-300 font-mono text-[10px]">
                                  {post.speechDuration || post.audioDispatch?.durationSeconds || 60}s Guillotine Clock
                                </span>
                              </div>

                              <div className="flex items-center gap-3">
                                <button
                                  type="button"
                                  onClick={() => {
                                    if (playingAudioId === post.id) {
                                      setPlayingAudioId(null);
                                    } else {
                                      setPlayingAudioId(post.id);
                                      showToast('Playing sovereign floor audio relay...');
                                    }
                                  }}
                                  className="w-10 h-10 rounded-xl bg-cyan-400 text-black flex items-center justify-center font-bold hover:bg-cyan-300 transition cursor-pointer shrink-0 shadow-lg"
                                >
                                  {playingAudioId === post.id ? (
                                    <Pause className="w-5 h-5 fill-black" />
                                  ) : (
                                    <Play className="w-5 h-5 fill-black ml-0.5" />
                                  )}
                                </button>

                                <div className="flex-1 flex items-center gap-1 h-8 bg-black/40 px-3 rounded-xl border border-white/5 overflow-hidden">
                                  {[35, 60, 20, 85, 45, 95, 30, 70, 50, 80, 40, 65, 90, 30, 55, 75, 40, 85, 25, 60, 90, 45].map((h, idx) => (
                                    <div
                                      key={idx}
                                      className={`flex-1 rounded-full transition-all duration-300 ${
                                        playingAudioId === post.id ? 'bg-cyan-400 animate-pulse' : 'bg-neutral-600'
                                      }`}
                                      style={{ height: `${playingAudioId === post.id ? Math.min(100, h + (idx % 3) * 10) : h * 0.5}%` }}
                                    />
                                  ))}
                                </div>
                              </div>

                              {post.speechTranscript && (
                                <div className="p-2.5 rounded-xl bg-black/30 border border-white/5 text-[11px] text-zinc-300 font-sans leading-relaxed">
                                  <p className="text-[9px] font-mono font-bold text-cyan-400 uppercase mb-0.5">Remarks Summary</p>
                                  <p>{post.speechTranscript}</p>
                                </div>
                              )}
                            </div>
                          )}

                          {/* Interactive Consensus & Supermajority Voting Bar */}
                          {(post.postType === 'treaty' || post.tags?.some(t => t.toLowerCase().includes('treaty'))) && (
                            <div className="p-4 rounded-2xl bg-white/[0.02] border border-white/10 space-y-2.5">
                              <div className="flex items-center justify-between text-xs font-mono">
                                <span className="text-zinc-400 flex items-center gap-1.5">
                                  <Vote className="w-3.5 h-3.5 text-cyan-400" />
                                  <span>Supermajority Consensus Gauge</span>
                                </span>
                                <span className="font-bold text-white">
                                  {ayePercent}% AYES ({voteData.ayes} / {totalVotes})
                                </span>
                              </div>

                              {/* Progress bar */}
                              <div className="w-full h-2 rounded-full bg-white/10 overflow-hidden flex">
                                <div className="h-full bg-gradient-to-r from-cyan-400 to-emerald-400" style={{ width: `${ayePercent}%` }} />
                                <div className="h-full bg-rose-500/80" style={{ width: `${100 - ayePercent}%` }} />
                              </div>

                              {/* Voting Buttons */}
                              <div className="flex items-center justify-end gap-2 pt-1">
                                <button
                                  type="button"
                                  onClick={() => handleVote(post.id, 'aye')}
                                  className={`px-3 py-1 rounded-lg font-mono text-xs font-bold transition cursor-pointer ${
                                    voteData.userVote === 'aye'
                                      ? 'bg-emerald-500 text-black shadow-md'
                                      : 'bg-emerald-500/15 border border-emerald-500/30 text-emerald-300 hover:bg-emerald-500/25'
                                  }`}
                                >
                                  ✓ Vote Aye ({voteData.ayes})
                                </button>
                                <button
                                  type="button"
                                  onClick={() => handleVote(post.id, 'nay')}
                                  className={`px-3 py-1 rounded-lg font-mono text-xs font-bold transition cursor-pointer ${
                                    voteData.userVote === 'nay'
                                      ? 'bg-rose-500 text-white shadow-md'
                                      : 'bg-rose-500/15 border border-rose-500/30 text-rose-300 hover:bg-rose-500/25'
                                  }`}
                                >
                                  ✕ Vote Nay ({voteData.nays})
                                </button>
                              </div>
                            </div>
                          )}

                          {/* Legislative Redline Studio Trigger */}
                          {post.redlineDiffs && post.redlineDiffs.length > 0 && (
                            <button
                              type="button"
                              onClick={() => setActiveRedlinePost(post)}
                              className="w-full py-2.5 px-4 rounded-2xl bg-gradient-to-r from-cyan-950/40 via-indigo-950/40 to-neutral-900 border border-cyan-500/40 hover:border-cyan-400 text-cyan-300 text-xs font-mono font-bold flex items-center justify-between transition cursor-pointer shadow-sm group/redline"
                            >
                              <div className="flex items-center gap-2">
                                <SplitSquareVertical className="w-4 h-4 text-cyan-400" />
                                <span>Inspect Redline Diff Studio ({post.redlineDiffs.length} Clauses)</span>
                              </div>
                              <span className="px-2 py-0.5 rounded-full bg-cyan-400/20 text-cyan-300 text-[10px] group-hover/redline:bg-cyan-400 group-hover/redline:text-black transition">
                                Compare &amp; Sponsor →
                              </span>
                            </button>
                          )}

                          {/* Proof of Citation Badge & Micro-Grant Tips */}
                          <div className="pt-2 border-t border-white/5 flex items-center justify-between flex-wrap gap-2">
                            {post.citations && post.citations.length > 0 ? (
                              <button
                                type="button"
                                onClick={() => setActiveCitationPost(post)}
                                className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-xl bg-emerald-500/10 hover:bg-emerald-500/20 border border-emerald-500/30 text-emerald-300 text-[11px] font-mono transition cursor-pointer"
                              >
                                <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
                                <span>{post.citations.length} Audited Sources</span>
                                <span className="text-emerald-400 font-bold">· {post.civicReliabilityScore || 98}% Verified</span>
                              </button>
                            ) : (
                              <div className="text-[11px] font-mono text-zinc-500 flex items-center gap-1">
                                <ShieldCheck className="w-3.5 h-3.5 text-zinc-600" />
                                <span>Community Dispatch</span>
                              </div>
                            )}

                            <button
                              type="button"
                              onClick={() => handleTipPost(post.id, post.authorUsername, 50)}
                              className="px-2.5 py-1 rounded-xl bg-amber-400/10 hover:bg-amber-400/20 border border-amber-400/30 text-amber-300 font-mono text-[11px] font-bold transition flex items-center gap-1 cursor-pointer"
                              title="Tip 50 Civic Points to research author"
                            >
                              <Coins className="w-3.5 h-3.5 text-amber-400" />
                              <span>Tip 50 PTS</span>
                            </button>
                          </div>
                        </div>

                        {/* Monolith Action Bar */}
                        <div className="px-5 pt-2 flex items-center justify-between border-t border-white/10">
                          <div className="flex items-center gap-4">
                            {/* Endorse Button */}
                            <button
                              onClick={() => likePost(post.id)}
                              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl border text-xs font-mono font-bold transition cursor-pointer ${
                                hasLiked
                                  ? 'bg-rose-500/20 border-rose-500/50 text-rose-300 shadow-sm'
                                  : 'bg-white/[0.04] border-white/10 text-zinc-300 hover:text-white hover:bg-white/[0.08]'
                              }`}
                            >
                              <Heart className={`w-4 h-4 ${hasLiked ? 'fill-rose-500 text-rose-500' : 'text-zinc-300'}`} />
                              <span>{post.likes}</span>
                            </button>

                            {/* Deliberate / Comments Button */}
                            <button
                              onClick={() => toggleCommentsExpansion(post.id)}
                              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white/[0.04] border border-white/10 text-zinc-300 hover:text-white hover:bg-white/[0.08] text-xs font-mono font-bold transition cursor-pointer"
                            >
                              <MessageCircle className="w-4 h-4" />
                              <span>{replies.length}</span>
                            </button>

                            {/* Share */}
                            <button
                              onClick={() => handleSharePost(post.id)}
                              className="p-1.5 rounded-xl bg-white/[0.04] border border-white/10 text-zinc-300 hover:text-white transition cursor-pointer"
                            >
                              <Share2 className="w-4 h-4" />
                            </button>
                          </div>

                          <div className="flex items-center gap-3">
                            <button
                              type="button"
                              onClick={() => {
                                setActiveFlexItem({
                                  id: post.id,
                                  type: 'pulse_post',
                                  content: post.content,
                                  authorName: post.authorName,
                                  authorUsername: post.authorUsername,
                                  authorAvatar: post.authorAvatar,
                                  images: post.images,
                                  createdAt: post.createdAt,
                                  likes: post.likes,
                                  category: post.tags?.[0] || 'Youth Pulse',
                                  readingTimeMinutes: Math.max(1, Math.ceil(post.content.split(' ').length / 150)),
                                  replies: replies.map((r) => ({
                                    id: r.id,
                                    authorName: r.authorUsername,
                                    authorUsername: r.authorUsername,
                                    content: r.content,
                                    createdAt: r.createdAt,
                                  })),
                                });
                              }}
                              className="text-xs font-mono font-bold text-cyan-400 hover:text-cyan-300 transition flex items-center gap-1 cursor-pointer"
                            >
                              <span>Read Flex</span>
                              <ArrowRight className="w-3.5 h-3.5" />
                            </button>

                            <button
                              onClick={() => {
                                toggleSavePost(post.id);
                                showToast(hasSaved ? 'Removed from saved' : 'Saved to dossier');
                              }}
                              className="p-1.5 rounded-xl bg-white/[0.04] border border-white/10 text-zinc-300 hover:text-white transition cursor-pointer"
                            >
                              <Bookmark className={`w-4 h-4 ${hasSaved ? 'fill-white text-white' : ''}`} />
                            </button>
                          </div>
                        </div>

                        {/* Expandable Comments Drawer */}
                        {isExpanded && (
                          <div className="px-5 space-y-2 pt-3 border-t border-white/5">
                            <div className="space-y-1.5 max-h-48 overflow-y-auto pr-1">
                              {replies.map((reply) => (
                                <div key={reply.id} className="text-xs flex items-baseline gap-2 bg-white/[0.02] p-2.5 rounded-xl border border-white/5">
                                  <strong className="text-white text-[11px] shrink-0 font-semibold">
                                    @{reply.authorUsername}
                                  </strong>
                                  <span className="text-zinc-300 text-[11px]">{reply.content}</span>
                                </div>
                              ))}
                            </div>
                          </div>
                        )}

                        {/* Inline Add Comment Input */}
                        <div className="px-5 pt-2 border-t border-white/5 flex items-center justify-between gap-3">
                          <input
                            type="text"
                            placeholder="Add your deliberation / feedback..."
                            value={commentInputs[post.id] || ''}
                            onChange={(e) =>
                              setCommentInputs((prev) => ({
                                ...prev,
                                [post.id]: e.target.value,
                              }))
                            }
                            onKeyDown={(e) => {
                              if (e.key === 'Enter') handleAddComment(post.id);
                            }}
                            className="flex-1 bg-transparent border-none text-xs text-white placeholder:text-zinc-500 focus:outline-none"
                          />
                          {commentInputs[post.id]?.trim() && (
                            <button
                              onClick={() => handleAddComment(post.id)}
                              className="text-xs font-bold text-cyan-400 hover:text-cyan-300 transition cursor-pointer"
                            >
                              Post
                            </button>
                          )}
                        </div>
                      </article>
                    );
                  })
                )}
                </div>
              </div>
            )}
          </main>
        </div>
      </div>

      {/* ── MOBILE BOTTOM NAVIGATION BAR (md:hidden) ── */}
      <div className="md:hidden fixed bottom-0 inset-x-0 z-40 bg-[#040507]/95 border-t border-white/10 backdrop-blur-xl px-4 py-2.5 flex items-center justify-around">
        {[
          { id: 'feed', icon: Home, label: 'Home', onClick: () => handleTabChange('feed') },
          { id: 'explore', icon: Compass, label: 'Explore', onClick: () => handleTabChange('explore') },
          { id: 'create', icon: Plus, label: 'Create', onClick: () => setShowPostComposerModal(true), highlight: true },
          { id: 'flux', icon: Film, label: 'FLUX', onClick: () => handleTabChange('flux') },
          { id: 'profile', icon: User, label: 'Profile', onClick: () => handleTabChange('profile') },
        ].map((item) => {
          const Icon = item.icon;
          const active = navTab === item.id || (item.id === 'profile' && (activeView === 'profile' || navTab === 'profile'));
          if (item.highlight) {
            return (
              <button
                key={item.id}
                onClick={item.onClick}
                className="w-10 h-10 rounded-2xl bg-white text-black flex items-center justify-center shadow-lg active:scale-95 transition cursor-pointer"
              >
                <Plus className="w-5 h-5 stroke-[2.5]" />
              </button>
            );
          }
          return (
            <button
              key={item.id}
              onClick={item.onClick}
              className={`p-2 transition cursor-pointer ${active ? 'text-white' : 'text-zinc-500'}`}
            >
              <Icon className={`w-6 h-6 ${active ? 'text-white stroke-[2.5]' : 'text-zinc-500'}`} />
            </button>
          );
        })}
      </div>

      {/* Modals */}
      {showPostComposerModal && (
        <PostComposer
          onFinished={() => setShowPostComposerModal(false)}
          onClose={() => setShowPostComposerModal(false)}
        />
      )}

      {showFluxComposerModal && (
        <FluxComposer
          onFinished={() => setShowFluxComposerModal(false)}
          onClose={() => setShowFluxComposerModal(false)}
        />
      )}

      {showStoryModal && (
        <StoryComposerModal isOpen={showStoryModal} onClose={() => setShowStoryModal(false)} />
      )}

      {/* ── Immersive Full Flex Reader Modal ── */}
      <ZenFlexReaderModal
        isOpen={Boolean(activeFlexItem)}
        onClose={() => {
          setActiveFlexItem(null);
          if (typeof window !== 'undefined') {
            const url = new URL(window.location.href);
            if (url.searchParams.has('flex') || url.searchParams.has('spark')) {
              url.searchParams.delete('flex');
              url.searchParams.delete('spark');
              window.history.replaceState({}, '', url.toString());
            }
          }
        }}
        item={activeFlexItem}
        onLike={(id) => likePost(id)}
        onBookmark={(id) => toggleSavePost(id)}
        onAddReply={(id, content) => addReply(id, content)}
        isLiked={activeFlexItem ? activeFlexItem.likes > 0 : false}
        isSaved={activeFlexItem ? isSaved(activeFlexItem.id) : false}
      />

      {/* ── Switch Account Modal ── */}
      <SwitchAccountModal
        isOpen={showSwitchModal}
        onClose={() => setShowSwitchModal(false)}
        currentUsername={activeUsername}
        currentDisplayName={activeDisplayName}
        currentAvatar={activeAvatar}
      />

      {/* ── 5-Pillar Sovereign Civic Modals ── */}
      {activeRedlinePost && (
        <RedlineDiffStudioModal
          isOpen={Boolean(activeRedlinePost)}
          onClose={() => setActiveRedlinePost(null)}
          post={activeRedlinePost}
        />
      )}

      {activeCitationPost && (
        <CitationInspectorModal
          isOpen={Boolean(activeCitationPost)}
          onClose={() => setActiveCitationPost(null)}
          post={activeCitationPost}
        />
      )}

      <FloorSpeechTransceiverModal
        isOpen={showFloorSpeechModal}
        onClose={() => setShowFloorSpeechModal(false)}
      />

      <DelegatePassportModal
        isOpen={showPassportModal}
        onClose={() => setShowPassportModal(false)}
      />

      <ChamberDirectiveModal
        isOpen={showDirectiveModal}
        onClose={() => {
          setShowDirectiveModal(false);
          if (typeof window !== 'undefined') {
            const url = new URL(window.location.href);
            if (url.searchParams.has('directive')) {
              url.searchParams.delete('directive');
              window.history.replaceState({}, '', url.toString());
            }
          }
        }}
        directiveIndex={activeDirectiveIndex}
      />

      {/* ── Operational Admin & Committee Console ── */}
      <AdminOmniModal
        isOpen={showAdminModal}
        onClose={() => setShowAdminModal(false)}
        onOpenFounderMenu={() => setShowFounderModal(true)}
      />

      {/* ── Supreme Founder Sovereignty Suite ── */}
      <FounderOmniModal
        isOpen={showFounderModal}
        onClose={() => setShowFounderModal(false)}
        onOpenAdminMenu={() => setShowAdminModal(true)}
      />
    </div>
  );
}
