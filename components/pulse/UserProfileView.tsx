'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { 
  ArrowLeft, 
  Grid, 
  Film, 
  Bookmark, 
  Settings, 
  Check, 
  Share2, 
  X, 
  Plus, 
  ExternalLink, 
  Users, 
  Heart, 
  MessageCircle, 
  Camera, 
  CheckCircle2, 
  Lock, 
  MapPin, 
  Calendar,
  Send,
  MoreHorizontal,
  Sparkles,
  Radio,
  Image as ImageIcon,
  Award,
  ShieldCheck,
  Crown,
  Trash2,
  Copy,
  EyeOff,
  Flag
} from 'lucide-react';
import { useZenPulse } from '@/context/ZenPulsePlatformContext';
import { useAuth } from '@/context/AuthContext';
import { PulseProfile, PulsePost, FluxVideo } from '@/types/pulse';
import { DelegateDossierView } from '@/components/mun/DelegateDossierView';
import { SettingsModal } from '@/components/settings/SettingsModal';
import { VerificationModal } from '@/components/modals/VerificationModal';
import { StoryComposerModal } from './StoryComposerModal';

export function UserProfileView() {
  const router = useRouter();
  const { profile: authProfile, user: authUser } = useAuth();
  const {
    selectedProfileUsername,
    getProfileByUsername,
    myProfile,
    updateMyProfile,
    toggleFollow,
    isFollowing,
    getPostsByUsername,
    getFluxByUsername,
    savedPosts,
    likePost,
    toggleSavePost,
    isSaved,
    deletePost,
    addReply,
    getReplies,
    currentUserUsername,
    currentUserName,
    setActiveView,
    setSelectedProfileUsername,
    openUserProfile,
    addProfileHostedEvent,
    deleteProfileHostedEvent,
    rsvpProfileHostedEvent,
    subscribeToOrganizerPro,
  } = useZenPulse();

  // Retrieve stored session user if available
  const [storedUser, setStoredUser] = useState<any>(null);

  useEffect(() => {
    try {
      const stored = JSON.parse(localStorage.getItem('zenvitra_session_user') || '{}');
      if (stored && (stored.username || stored.id || stored.display_name || stored.email)) {
        setStoredUser(stored);
      }
    } catch (_) {}
  }, []);

  const effectiveMyUsername = 
    currentUserUsername || 
    myProfile?.username || 
    authProfile?.username || 
    (authProfile as any)?.handle || 
    storedUser?.username || 
    storedUser?.handle || 
    '';

  const effectiveMyName = 
    currentUserName || 
    myProfile?.name || 
    authProfile?.display_name || 
    (authProfile as any)?.name || 
    storedUser?.display_name || 
    storedUser?.name || 
    effectiveMyUsername || 
    '';

  const effectiveMyAvatar = 
    myProfile?.avatar || 
    authProfile?.avatar_url || 
    (authProfile as any)?.avatar || 
    storedUser?.avatar || 
    storedUser?.avatar_url || 
    '';

  const effectiveMyBio = 
    myProfile?.bio || 
    authProfile?.bio || 
    storedUser?.bio || 
    '';

  const targetUsername = selectedProfileUsername || effectiveMyUsername;
  const isOwnProfile = 
    !selectedProfileUsername || 
    selectedProfileUsername === 'you' || 
    selectedProfileUsername === 'member' || 
    selectedProfileUsername === 'user' || 
    (effectiveMyUsername && targetUsername.toLowerCase() === effectiveMyUsername.toLowerCase()) || 
    (currentUserUsername && targetUsername.toLowerCase() === currentUserUsername.toLowerCase()) || 
    (myProfile?.username && targetUsername.toLowerCase() === myProfile.username.toLowerCase());

  const baseResolved: PulseProfile = (isOwnProfile ? myProfile : getProfileByUsername(targetUsername)) || myProfile;

  const profile: PulseProfile = {
    ...baseResolved,
    username: isOwnProfile ? (effectiveMyUsername || baseResolved?.username || '') : (baseResolved?.username || targetUsername),
    name: isOwnProfile ? (effectiveMyName || baseResolved?.name || '') : (baseResolved?.name || targetUsername),
    avatar: isOwnProfile ? (effectiveMyAvatar || baseResolved?.avatar || '') : (baseResolved?.avatar || ''),
    bio: isOwnProfile ? (effectiveMyBio || baseResolved?.bio || '') : (baseResolved?.bio || ''),
  };

  const displayHandle = profile.username || effectiveMyUsername || (isOwnProfile ? 'user' : targetUsername);
  const displayName = profile.name || effectiveMyName || displayHandle;
  const displayInitial = (displayName || displayHandle || 'U').charAt(0).toUpperCase();

  const [activeTab, setActiveTab] = useState<'posts' | 'reels' | 'events_showcase' | 'saved' | 'mun_dossier'>('posts');
  const [showEditModal, setShowEditModal] = useState(false);
  const [showSettingsModal, setShowSettingsModal] = useState(false);
  const [showVerificationModal, setShowVerificationModal] = useState(false);
  const [showAddEventModal, setShowAddEventModal] = useState(false);
  const [showOrganizerModal, setShowOrganizerModal] = useState(false);
  const [showStoryComposerModal, setShowStoryComposerModal] = useState(false);
  const [showFollowersModal, setShowFollowersModal] = useState<'followers' | 'following' | null>(null);
  const [activePostModal, setActivePostModal] = useState<PulsePost | null>(null);
  const [showModalPostSettings, setShowModalPostSettings] = useState(false);
  const [copied, setCopied] = useState(false);

  // Add event form state
  const [newEventTitle, setNewEventTitle] = useState('');
  const [newEventCategory, setNewEventCategory] = useState<'SUMMIT' | 'WORKSHOP' | 'KEYNOTE' | 'MEETUP' | 'HACKATHON'>('SUMMIT');
  const [newEventDate, setNewEventDate] = useState('Oct 15, 2026');
  const [newEventTime, setNewEventTime] = useState('10:00 AM CET');
  const [newEventLocation, setNewEventLocation] = useState('Palais des Nations, Geneva');
  const [newEventRsvpUrl, setNewEventRsvpUrl] = useState('/events');
  const [newEventMaxCapacity, setNewEventMaxCapacity] = useState(200);
  const [newEventCoverImage, setNewEventCoverImage] = useState('https://images.unsplash.com/photo-1540575467063-178a50c2df87?auto=format&fit=crop&w=1200&q=80');
  const [newEventDescription, setNewEventDescription] = useState('');
  const [rsvpdEventIds, setRsvpdEventIds] = useState<Record<string, boolean>>({});


  // Edit profile state
  const [editName, setEditName] = useState(displayName);
  const [editBio, setEditBio] = useState(profile.bio);
  const [editAvatar, setEditAvatar] = useState(profile.avatar || '');
  const [editWebsite, setEditWebsite] = useState(profile.website || '');
  const [editLocation, setEditLocation] = useState(profile.location || '');
  const [editCategory, setEditCategory] = useState(profile.category || 'Writer & Thinker');

  useEffect(() => {
    if (displayName) setEditName(displayName);
    if (profile.bio) setEditBio(profile.bio);
    if (profile.avatar) setEditAvatar(profile.avatar);
    if (profile.website) setEditWebsite(profile.website);
    if (profile.location) setEditLocation(profile.location);
    if (profile.category) setEditCategory(profile.category);
  }, [displayName, profile.bio, profile.avatar, profile.website, profile.location, profile.category]);

  // Comment input inside post modal
  const [modalComment, setModalComment] = useState('');

  const posts: PulsePost[] = getPostsByUsername(displayHandle);
  const reels: FluxVideo[] = getFluxByUsername(displayHandle);
  const following = isFollowing(displayHandle);

  const handleAvatarFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setEditAvatar(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSaveProfile = (e: React.FormEvent) => {
    e.preventDefault();
    updateMyProfile({
      name: editName.trim(),
      bio: editBio.trim(),
      avatar: editAvatar.trim(),
      website: editWebsite.trim(),
      location: editLocation.trim(),
    });
    setShowEditModal(false);
  };

  const handleShareProfile = () => {
    if (typeof navigator !== 'undefined') {
      navigator.clipboard.writeText(`${window.location.origin}/profile/${displayHandle}`);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const handleAddModalComment = (postId: string) => {
    if (!modalComment.trim()) return;
    addReply(postId, modalComment.trim());
    setModalComment('');
  };

  const handleBackToFeed = () => {
    setSelectedProfileUsername(null);
    setActiveView('feed');
    if (typeof window !== 'undefined') {
      window.dispatchEvent(new CustomEvent('zenvitra-nav-feed'));
      if (window.location.pathname.startsWith('/profile')) {
        router.push('/pulse');
      } else {
        const url = new URL(window.location.href);
        url.searchParams.delete('tab');
        window.history.replaceState({}, '', url.toString());
      }
    }
  };

  const isFounderProfile = (displayHandle || '').toLowerCase().replace(/^@/, '') === 'yuveer' || (displayHandle || '').toLowerCase().replace(/^@/, '') === 'founder';
  const isVerifiedEffective = Boolean(profile.isVerified || (profile as any)?.is_verified || isFounderProfile);

  const isProfessionalOrEventAccount = Boolean(
    profile.accountType === 'professional' ||
    profile.isSubscribedOrganizer ||
    profile.badge === 'ORGANIZATION' ||
    (profile.hostedEvents && profile.hostedEvents.length > 0)
  );

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-8 py-6 font-sans text-white space-y-8">
      
      {/* ─── TOP BACK BUTTON (IF VIEWING ANOTHER USER OR FROM FEED) ─── */}
      <div className="flex items-center justify-between pb-2 border-b border-zinc-800/60">
        <button
          type="button"
          onClick={handleBackToFeed}
          className="flex items-center gap-2 text-xs font-semibold text-zinc-400 hover:text-white transition cursor-pointer group"
        >
          <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
          <span>Back to Feed</span>
        </button>
        <div className="text-xs text-zinc-500 font-medium">
          @{displayHandle}
        </div>
      </div>

      {/* ─── INSTAGRAM PROFILE HEADER ─── */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center gap-6 sm:gap-12 pb-6 border-b border-zinc-800">
        
        {/* Profile Avatar with Story Ring */}
        <div className="relative group shrink-0 mx-auto sm:mx-0">
          <div className="w-24 h-24 sm:w-36 sm:h-36 rounded-full p-[2.5px] bg-gradient-to-tr from-amber-400 via-rose-500 to-fuchsia-600 shadow-xl">
            <div className="w-full h-full rounded-full bg-black overflow-hidden relative">
              {profile.avatar ? (
                <img src={profile.avatar} alt={displayName} className="w-full h-full object-cover" />
              ) : (
                <div className="w-full h-full flex items-center justify-center font-bold text-3xl sm:text-4xl text-white bg-zinc-900 uppercase">
                  {displayInitial}
                </div>
              )}

              {/* Hover overlay to change avatar if own profile */}
              {isOwnProfile && (
                <button
                  onClick={() => setShowEditModal(true)}
                  className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition flex flex-col items-center justify-center text-white text-[10px] font-semibold cursor-pointer"
                >
                  <Camera className="w-6 h-6 mb-1 text-white" />
                  <span>Change Photo</span>
                </button>
              )}
            </div>
          </div>
        </div>

        {/* Profile Details Column */}
        <div className="flex-1 space-y-4 text-left w-full">
          
          {/* Top Row: Username + Action Buttons */}
          <div className="flex flex-wrap items-center gap-3 sm:gap-4">
            <h1 
              className="font-bold text-xl sm:text-2xl text-white tracking-tight flex items-center gap-2"
              style={{ fontFamily: 'Clash Display, var(--font-space), sans-serif' }}
            >
              {displayHandle}
              {isVerifiedEffective && (
                <button
                  type="button"
                  onClick={() => setShowVerificationModal(true)}
                  className="inline-flex items-center gap-1.5 group cursor-pointer"
                  title={isFounderProfile ? "Founder & Sovereign Core • 100% Verified" : "Verified Sovereign Node • Cryptographic Clearance Active"}
                >
                  <CheckCircle2 className="w-5 h-5 text-cyan-400 inline-block drop-shadow-[0_0_8px_rgba(6,182,212,0.8)] group-hover:scale-110 transition-transform" />
                  {isFounderProfile && (
                    <span className="px-2 py-0.5 rounded-md bg-amber-400/15 border border-amber-400/30 text-amber-300 text-[10px] font-mono font-bold tracking-wider flex items-center gap-1">
                      <Crown className="w-3 h-3 text-amber-400" />
                      FOUNDER
                    </span>
                  )}
                </button>
              )}
            </h1>

            {isOwnProfile ? (
              <div className="flex flex-wrap items-center gap-2.5">
                {!isVerifiedEffective && (
                  <button
                    type="button"
                    onClick={() => setShowVerificationModal(true)}
                    className="px-3.5 py-2 rounded-xl bg-gradient-to-r from-cyan-500/15 to-teal-500/15 hover:from-cyan-500/25 hover:to-teal-500/25 border border-cyan-500/40 text-cyan-300 hover:text-cyan-200 text-xs font-mono font-bold transition flex items-center gap-1.5 cursor-pointer shadow-[0_0_15px_rgba(6,182,212,0.2)] active:scale-95"
                    title="Apply for Sovereign Verified Badge"
                  >
                    <Sparkles className="w-3.5 h-3.5 text-cyan-400 animate-pulse" />
                    <span>Get Verified</span>
                  </button>
                )}
                <button
                  type="button"
                  onClick={() => router.push('/pulse/create-story')}
                  className="px-3.5 py-2 rounded-xl bg-gradient-to-r from-amber-400/20 via-rose-500/20 to-fuchsia-600/20 hover:from-amber-400/30 hover:via-rose-500/30 hover:to-fuchsia-600/30 border border-rose-500/40 text-rose-300 text-xs font-bold transition flex items-center gap-1.5 cursor-pointer backdrop-blur-md active:scale-95 shadow-sm"
                  title="Broadcast 24-Hour Sovereign Relay"
                >
                  <Plus className="w-3.5 h-3.5 text-rose-400" />
                  <span>Add Relay</span>
                </button>
                <button
                  onClick={() => setShowEditModal(true)}
                  className="px-4 py-2 rounded-xl bg-white/[0.06] hover:bg-white/[0.12] border border-white/15 text-xs font-bold text-white transition cursor-pointer backdrop-blur-md"
                >
                  Edit profile
                </button>
                <button
                  onClick={handleShareProfile}
                  className="px-4 py-2 rounded-xl bg-white/[0.06] hover:bg-white/[0.12] border border-white/15 text-xs font-bold text-white transition cursor-pointer flex items-center gap-2 backdrop-blur-md"
                >
                  {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Share2 className="w-3.5 h-3.5" />}
                  <span>{copied ? 'Copied' : 'Share'}</span>
                </button>
                <button
                  onClick={() => setShowSettingsModal(true)}

                  className="p-2 rounded-xl text-zinc-400 hover:text-white bg-white/[0.04] hover:bg-white/10 border border-white/10 transition cursor-pointer"
                  title="Settings & Preferences"
                >
                  <Settings className="w-4 h-4" />
                </button>
              </div>
            ) : (
              <div className="flex items-center gap-2.5">
                <button
                  onClick={() => toggleFollow(profile.username)}
                  className={`px-5 py-2 rounded-xl font-bold text-xs transition cursor-pointer ${
                    following
                      ? 'bg-white/[0.06] hover:bg-white/[0.12] border border-white/15 text-white'
                      : 'bg-white hover:bg-zinc-200 text-black shadow-[0_0_15px_rgba(255,255,255,0.3)]'
                  }`}
                >
                  {following ? 'Following' : 'Follow'}
                </button>
                <Link href={`/chat?user=${profile.username}`}>
                  <button className="px-4 py-2 rounded-xl bg-white/[0.06] hover:bg-white/[0.12] border border-white/15 text-xs font-bold text-white transition cursor-pointer">
                    Message
                  </button>
                </Link>
                <button className="p-2 rounded-xl text-zinc-400 hover:text-white bg-white/[0.04] hover:bg-white/10 border border-white/10 transition cursor-pointer">
                  <MoreHorizontal className="w-4 h-4" />
                </button>
              </div>
            )}
          </div>

          {/* Stats Row */}
          <div className="flex items-center gap-6 sm:gap-8 text-sm">
            <div>
              <strong className="text-white font-bold">{posts.length}</strong>{' '}
              <span className="text-zinc-400 font-light">dispatches</span>
            </div>
            <button
              onClick={() => setShowFollowersModal('followers')}
              className="hover:text-zinc-300 transition cursor-pointer"
            >
              <strong className="text-white font-bold">
                {Array.from(new Set((profile.followers || []).map((f) => (typeof f === 'string' ? f.toLowerCase().trim().replace(/^@/, '') : '')).filter(Boolean))).length}
              </strong>{' '}
              <span className="text-zinc-400 font-light">followers</span>
            </button>
            <button
              onClick={() => setShowFollowersModal('following')}
              className="hover:text-zinc-300 transition cursor-pointer"
            >
              <strong className="text-white font-bold">
                {Array.from(new Set((profile.following || []).map((f) => (typeof f === 'string' ? f.toLowerCase().trim().replace(/^@/, '') : '')).filter(Boolean))).length}
              </strong>{' '}
              <span className="text-zinc-400 font-light">following</span>
            </button>
          </div>

          {/* Bio & Details */}
          <div className="space-y-1.5 text-xs text-left">
            <p 
              className="font-bold text-white text-sm"
              style={{ fontFamily: 'Clash Display, var(--font-space), sans-serif' }}
            >
              {displayName}
            </p>
            {profile.category && (
              <p className="text-cyan-400 font-mono text-[11px] uppercase tracking-wider">{profile.category}</p>
            )}
            {profile.bio && (
              <p className="text-zinc-300 whitespace-pre-line leading-relaxed pt-0.5">
                {profile.bio}
              </p>
            )}
            {profile.location && (
              <div className="flex items-center gap-1.5 text-zinc-400 pt-1 font-mono text-[11px]">
                <MapPin className="w-3.5 h-3.5 text-rose-400" />
                <span>{profile.location}</span>
              </div>
            )}
            {profile.website && (
              <div className="flex items-center gap-1.5 text-white font-semibold pt-0.5 font-mono text-[11px]">
                <ExternalLink className="w-3.5 h-3.5 text-cyan-400" />
                <a
                  href={profile.website.startsWith('http') ? profile.website : `https://${profile.website}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:underline text-cyan-300"
                >
                  {profile.website.replace(/^https?:\/\//, '')}
                </a>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* ─── PROFILE NAVIGATION TABS ─── */}
      <div className="w-full max-w-3xl mx-auto pt-2 pb-4">
        <div className={`flex flex-wrap items-center justify-center gap-1.5 p-1.5 rounded-2xl bg-[#080911]/90 backdrop-blur-2xl border border-white/10 shadow-xl`}>
          <button
            type="button"
            onClick={() => setActiveTab('posts')}
            className={`flex-1 min-w-[90px] py-2 px-2.5 rounded-xl text-xs font-mono font-bold transition-all flex items-center justify-center gap-1.5 cursor-pointer text-center ${
              activeTab === 'posts'
                ? 'bg-white text-black shadow-[0_0_15px_rgba(255,255,255,0.25)]'
                : 'text-neutral-400 hover:text-white hover:bg-white/[0.04]'
            }`}
          >
            <Grid className="w-3.5 h-3.5 shrink-0" />
            <span className="truncate">Dispatches</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('reels')}
            className={`flex-1 min-w-[90px] py-2 px-2.5 rounded-xl text-xs font-mono font-bold transition-all flex items-center justify-center gap-1.5 cursor-pointer text-center ${
              activeTab === 'reels'
                ? 'bg-rose-500/20 text-rose-300 border border-rose-500/40 shadow-[0_0_15px_rgba(244,63,94,0.25)]'
                : 'text-neutral-400 hover:text-white hover:bg-white/[0.04]'
            }`}
          >
            <Sparkles className="w-3.5 h-3.5 shrink-0 text-rose-400" />
            <span className="truncate">SPARK</span>
          </button>

          {/* Showcase is visible ONLY for event / professional accounts that choose to host events */}
          {isProfessionalOrEventAccount && (
            <button
              type="button"
              onClick={() => setActiveTab('events_showcase')}
              className={`flex-1 min-w-[90px] py-2 px-2.5 rounded-xl text-xs font-mono font-bold transition-all flex items-center justify-center gap-1.5 cursor-pointer text-center ${
                activeTab === 'events_showcase'
                  ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/40 shadow-[0_0_15px_rgba(6,182,212,0.25)]'
                  : 'text-neutral-400 hover:text-cyan-300 hover:bg-white/[0.04]'
              }`}
            >
              <Calendar className="w-3.5 h-3.5 shrink-0 text-cyan-400" />
              <span className="truncate">Showcase</span>
              {(profile.hostedEvents || []).length > 0 && (
                <span className="px-1.5 py-0.5 rounded-full text-[10px] font-mono font-bold bg-cyan-500/30 text-cyan-200 border border-cyan-500/40 shrink-0">
                  {(profile.hostedEvents || []).length}
                </span>
              )}
            </button>
          )}

          {isOwnProfile && (
            <button
              type="button"
              onClick={() => setActiveTab('saved')}
              className={`flex-1 min-w-[90px] py-2 px-2.5 rounded-xl text-xs font-mono font-bold transition-all flex items-center justify-center gap-1.5 cursor-pointer text-center ${
                activeTab === 'saved'
                  ? 'bg-purple-500/20 text-purple-300 border border-purple-500/40 shadow-[0_0_15px_rgba(168,85,247,0.25)]'
                  : 'text-neutral-400 hover:text-white hover:bg-white/[0.04]'
              }`}
            >
              <Bookmark className="w-3.5 h-3.5 shrink-0" />
              <span className="truncate">Saved</span>
              <Lock className="w-2.5 h-2.5 text-purple-300 shrink-0 opacity-75" />
            </button>
          )}

          <button
            type="button"
            onClick={() => setActiveTab('mun_dossier')}
            className={`flex-1 min-w-[90px] py-2 px-2.5 rounded-xl text-xs font-mono font-bold transition-all flex items-center justify-center gap-1.5 cursor-pointer text-center ${
              activeTab === 'mun_dossier'
                ? 'bg-amber-500/20 text-amber-300 border border-amber-500/40 shadow-[0_0_15px_rgba(245,158,11,0.25)]'
                : 'text-neutral-400 hover:text-amber-300 hover:bg-white/[0.04]'
            }`}
          >
            <Award className="w-3.5 h-3.5 shrink-0 text-amber-400" />
            <span className="truncate">Track Record</span>
          </button>
        </div>
      </div>

      {/* ─── TAB CONTENT ─── */}
      {/* 1. POSTS GRID */}
      {activeTab === 'posts' && (
        <div>
          {posts.length === 0 ? (
            <div className="py-20 text-center space-y-4 rounded-3xl bg-black/40 border border-white/5 p-8 max-w-xl mx-auto">
              <div className="w-16 h-16 rounded-2xl bg-white/[0.03] border border-white/10 mx-auto flex items-center justify-center text-neutral-400 shadow-inner">
                <Camera className="w-8 h-8" />
              </div>
              <div className="space-y-1">
                <h3 className="font-bold text-lg text-white font-display">No Dispatches Yet</h3>
                <p className="text-xs text-neutral-400 max-w-xs mx-auto leading-relaxed">
                  {isOwnProfile ? 'Broadcast your first photo or dispatch to your sovereign profile.' : `@${profile.username} hasn't broadcasted any dispatches yet.`}
                </p>
              </div>
            </div>
          ) : (
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 sm:gap-4">
              {posts.map((post) => {
                const img = post.images?.[0];
                return (
                  <div
                    key={post.id}
                    onClick={() => setActivePostModal(post)}
                    className="relative aspect-square bg-gradient-to-br from-zinc-900 via-[#07090e] to-black border border-white/10 rounded-md sm:rounded-xl overflow-hidden cursor-pointer group p-3 flex flex-col justify-between"
                  >
                    {img ? (
                      <img src={img} alt="Post" className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition duration-300" />
                    ) : (
                      <div className="w-full h-full flex flex-col justify-between select-none">
                        <div className="flex items-center gap-1 text-[9px] font-mono text-zinc-500 uppercase">
                          <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
                          <span>Dispatch</span>
                        </div>
                        <p className="text-xs text-zinc-200 font-sans line-clamp-3 leading-snug">
                          {post.content}
                        </p>
                        <span className="text-[10px] font-mono text-zinc-500">
                          #{post.id.slice(-4)}
                        </span>
                      </div>
                    )}
                    
                    {/* Hover Overlay with Likes & Comments Count */}
                    <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition flex items-center justify-center gap-6 text-white font-bold text-sm">
                      <div className="flex items-center gap-1.5">
                        <Heart className="w-5 h-5 fill-white text-white" />
                        <span>{post.likes}</span>
                      </div>
                      <div className="flex items-center gap-1.5">
                        <MessageCircle className="w-5 h-5 fill-white text-white" />
                        <span>{post.replyCount || 0}</span>
                      </div>
                    </div>

                    {/* Multi-image icon badge */}
                    {post.images && post.images.length > 1 && (
                      <div className="absolute top-2 right-2 p-1 rounded-md bg-black/60 text-white">
                        <ImageIcon className="w-3.5 h-3.5" />
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          )}
        </div>
      )}

      {/* 2. REELS / SPARK GRID */}
      {activeTab === 'reels' && (
        <div>
          {reels.length === 0 ? (
            <div className="py-16 text-center space-y-3">
              <div className="w-16 h-16 rounded-full border border-zinc-800 mx-auto flex items-center justify-center text-rose-400 bg-rose-500/10">
                <Sparkles className="w-8 h-8" />
              </div>
              <h3 className="font-bold text-lg text-white">No SPARK Reels Yet</h3>
              <p className="text-xs text-zinc-500 max-w-xs mx-auto">
                Capture and broadcast short-form vertical video dispatches.
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-3 gap-1 sm:gap-4">
              {reels.map((reel) => (
                <div
                  key={reel.id}
                  className="relative aspect-[9/16] bg-zinc-950 rounded-md sm:rounded-xl overflow-hidden cursor-pointer group"
                >
                  <img
                    src={reel.thumbnailUrl || 'https://images.unsplash.com/photo-1526778548025-fa2f459cd5c1?auto=format&fit=crop&w=600&q=80'}
                    alt="Reel"
                    className="w-full h-full object-cover group-hover:scale-105 transition duration-300"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent flex flex-col justify-end p-3 text-white">
                    <div className="flex items-center gap-1.5 text-xs font-bold">
                      <Film className="w-3.5 h-3.5" />
                      <span>{reel.likes}</span>
                    </div>
                    <p className="text-[11px] text-zinc-300 truncate mt-1">{reel.caption}</p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* 3. EVENTS & BUSINESS SHOWCASE TAB */}
      {activeTab === 'events_showcase' && (
        <div className="space-y-6">
          {/* Organizer Pro / Business Header Banner */}
          <div className="p-5 sm:p-6 rounded-3xl bg-gradient-to-r from-zinc-950 via-cyan-950/30 to-zinc-950 border border-cyan-500/30 shadow-[0_10px_35px_rgba(0,0,0,0.8)] flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div className="space-y-1.5">
              <div className="flex items-center gap-2">
                <span className="px-2.5 py-0.5 rounded-full bg-cyan-500/20 border border-cyan-500/40 text-cyan-300 text-[11px] font-mono font-bold uppercase tracking-wider flex items-center gap-1">
                  <Sparkles className="w-3 h-3 text-cyan-400" />
                  {profile.isSubscribedOrganizer ? 'Verified Organizer Showcase' : 'Events & Business Showcase'}
                </span>
                {profile.isSubscribedOrganizer && (
                  <span className="px-2 py-0.5 rounded-full bg-amber-400/20 border border-amber-400/40 text-amber-300 text-[10px] font-mono font-bold">
                    PRO TIER ACTIVE
                  </span>
                )}
              </div>
              <h3 className="font-bold text-base sm:text-lg text-white">
                {isOwnProfile ? 'Your Hosted Summits & Featured Events' : `Featured Events Hosted by @${displayHandle}`}
              </h3>
              <p className="text-xs text-zinc-400 max-w-xl leading-relaxed">
                Showcasing official conventions, diplomatic plenaries, and partner summits. Direct registration links connect participants to the registration ledger.
              </p>
            </div>

            {isOwnProfile && (
              <div className="flex items-center gap-2.5 shrink-0 w-full sm:w-auto">
                <button
                  type="button"
                  onClick={() => setShowAddEventModal(true)}
                  className="flex-1 sm:flex-initial px-4 py-2.5 rounded-xl bg-gradient-to-r from-cyan-500 to-teal-500 hover:from-cyan-400 hover:to-teal-400 text-black font-bold text-xs flex items-center justify-center gap-2 transition cursor-pointer shadow-[0_0_20px_rgba(6,182,212,0.4)]"
                >
                  <Plus className="w-4 h-4 text-black" />
                  <span>Add Showcase Event</span>
                </button>
                {!profile.isSubscribedOrganizer && (
                  <button
                    type="button"
                    onClick={() => setShowOrganizerModal(true)}
                    className="px-3.5 py-2.5 rounded-xl bg-amber-400/15 hover:bg-amber-400/25 border border-amber-400/40 text-amber-300 font-bold text-xs flex items-center gap-1.5 transition cursor-pointer"
                  >
                    <Crown className="w-4 h-4 text-amber-400" />
                    <span>Organizer Pro</span>
                  </button>
                )}
              </div>
            )}
          </div>

          {/* Events Showcase List / Grid */}
          {(!profile.hostedEvents || profile.hostedEvents.length === 0) ? (
            <div className="py-16 text-center space-y-4 rounded-3xl border border-zinc-800 bg-zinc-950/50 p-8">
              <div className="w-16 h-16 rounded-full border border-zinc-800 mx-auto flex items-center justify-center text-cyan-400 bg-cyan-950/20">
                <Calendar className="w-8 h-8" />
              </div>
              <div className="space-y-1">
                <h3 className="font-bold text-base text-white">No Events Showcased Yet</h3>
                <p className="text-xs text-zinc-400 max-w-sm mx-auto">
                  {isOwnProfile
                    ? 'Publish your upcoming summit, Model UN conference, or workshop to feature it directly on your profile.'
                    : `@${displayHandle} has not published any public showcase events yet.`}
                </p>
              </div>
              {isOwnProfile && (
                <button
                  type="button"
                  onClick={() => setShowAddEventModal(true)}
                  className="px-5 py-2.5 rounded-xl bg-white text-black font-bold text-xs hover:bg-zinc-200 transition cursor-pointer shadow"
                >
                  Create First Event
                </button>
              )}
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              {profile.hostedEvents.map((evt) => {
                const isRsvpd = rsvpdEventIds[evt.id];
                const capacityRatio = Math.min(100, Math.round((evt.registeredCount / (evt.maxCapacity || 200)) * 100));

                const handleRegisterRedirect = () => {
                  const targetUrl = evt.rsvpUrl || '/events';
                  if (targetUrl.startsWith('http')) {
                    window.open(targetUrl, '_blank', 'noopener,noreferrer');
                  } else {
                    router.push(targetUrl);
                  }
                };

                return (
                  <div
                    key={evt.id}
                    className="group rounded-3xl bg-zinc-950 border border-white/10 hover:border-cyan-500/40 transition-all duration-300 overflow-hidden flex flex-col justify-between shadow-xl"
                  >
                    {/* Event Banner */}
                    <div className="relative aspect-[16/9] w-full overflow-hidden bg-zinc-900">
                      <img
                        src={evt.coverImage || 'https://images.unsplash.com/photo-1540575467063-178a50c2df87?auto=format&fit=crop&w=1200&q=80'}
                        alt={evt.title}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-zinc-950 via-zinc-950/30 to-transparent" />
                      
                      {/* Category Badge */}
                      <div className="absolute top-3 left-3">
                        <span className="px-3 py-1 rounded-full bg-black/80 backdrop-blur-md border border-white/15 text-cyan-300 font-mono text-[10px] font-bold tracking-wider uppercase shadow-md">
                          {evt.category}
                        </span>
                      </div>

                      {/* Delete button for profile owner */}
                      {isOwnProfile && (
                        <button
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation();
                            if (confirm('Remove this showcase event from your profile?')) {
                              deleteProfileHostedEvent(evt.id);
                            }
                          }}
                          className="absolute top-3 right-3 p-1.5 rounded-full bg-black/70 hover:bg-rose-600 text-zinc-400 hover:text-white transition cursor-pointer"
                          title="Remove event"
                        >
                          <X className="w-4 h-4" />
                        </button>
                      )}

                      {/* Date Pill at bottom left of banner */}
                      <div className="absolute bottom-3 left-3 flex items-center gap-2">
                        <span className="px-2.5 py-1 rounded-xl bg-zinc-900/90 border border-white/10 text-white font-mono text-[11px] font-bold flex items-center gap-1.5">
                          <Calendar className="w-3.5 h-3.5 text-cyan-400" />
                          <span>{evt.date}</span>
                        </span>
                        {evt.time && (
                          <span className="px-2.5 py-1 rounded-xl bg-zinc-900/90 border border-white/10 text-zinc-300 font-mono text-[11px]">
                            {evt.time}
                          </span>
                        )}
                      </div>
                    </div>

                    {/* Event Body */}
                    <div className="p-5 space-y-4 flex-1 flex flex-col justify-between">
                      <div className="space-y-2">
                        <h4 className="font-bold text-base text-white group-hover:text-cyan-300 transition line-clamp-2">
                          {evt.title}
                        </h4>
                        
                        {evt.location && (
                          <div className="flex items-center gap-1.5 text-xs text-zinc-400 font-mono">
                            <MapPin className="w-3.5 h-3.5 text-rose-400 shrink-0" />
                            <span className="truncate">{evt.location}</span>
                          </div>
                        )}

                        {evt.description && (
                          <p className="text-xs text-zinc-400 line-clamp-2 leading-relaxed pt-1">
                            {evt.description}
                          </p>
                        )}
                      </div>

                      {/* Registration & Capacity Progress */}
                      <div className="space-y-3 pt-3 border-t border-zinc-800/80">
                        <div className="flex items-center justify-between text-xs font-mono">
                          <span className="text-zinc-400 flex items-center gap-1">
                            <Users className="w-3.5 h-3.5 text-cyan-400" />
                            <span>Capacity:</span>
                            <strong className="text-white ml-1">{evt.registeredCount} / {evt.maxCapacity}</strong>
                          </span>
                          <span className="text-cyan-400 font-bold">{capacityRatio}% Filled</span>
                        </div>

                        {/* Progress bar */}
                        <div className="h-2 w-full bg-zinc-900 rounded-full overflow-hidden border border-white/5">
                          <div
                            className="h-full bg-gradient-to-r from-cyan-500 to-teal-400 rounded-full transition-all duration-500"
                            style={{ width: `${capacityRatio}%` }}
                          />
                        </div>

                        {/* Action Buttons with Registration Link */}
                        <div className="flex items-center gap-2 pt-1">
                          <button
                            type="button"
                            onClick={handleRegisterRedirect}
                            className="flex-1 py-2.5 px-4 rounded-xl bg-gradient-to-r from-cyan-500 to-teal-500 hover:from-cyan-400 hover:to-teal-400 text-black font-bold text-xs flex items-center justify-center gap-2 transition cursor-pointer shadow-[0_0_15px_rgba(6,182,212,0.3)] active:scale-95"
                          >
                            <span>Register / Get Passes</span>
                            <ExternalLink className="w-3.5 h-3.5 text-black" />
                          </button>

                          <button
                            type="button"
                            onClick={() => {
                              if (!isRsvpd) {
                                rsvpProfileHostedEvent(displayHandle, evt.id);
                                setRsvpdEventIds({ ...rsvpdEventIds, [evt.id]: true });
                              }
                            }}
                            className={`px-3.5 py-2.5 rounded-xl border text-xs font-bold font-mono transition cursor-pointer flex items-center gap-1.5 ${
                              isRsvpd
                                ? 'bg-emerald-500/20 border-emerald-500/40 text-emerald-300'
                                : 'bg-white/[0.04] hover:bg-white/10 border-white/10 text-white'
                            }`}
                          >
                            {isRsvpd ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Plus className="w-3.5 h-3.5" />}
                            <span>{isRsvpd ? 'RSVP Confirmed' : 'RSVP'}</span>
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      )}

      {/* 4. SAVED GRID (OWN PROFILE ONLY - STRICTLY PRIVATE) */}
      {activeTab === 'saved' && (
        <div>
          {!isOwnProfile ? (
            <div className="py-20 text-center space-y-4 rounded-3xl bg-black/40 border border-white/5 p-8 max-w-xl mx-auto">
              <div className="w-16 h-16 rounded-2xl bg-purple-500/10 border border-purple-500/20 mx-auto flex items-center justify-center text-purple-400 shadow-inner">
                <Lock className="w-8 h-8" />
              </div>
              <div className="space-y-1">
                <h3 className="font-bold text-lg text-white font-display">Private Sovereign Vault</h3>
                <p className="text-xs text-neutral-400 max-w-xs mx-auto leading-relaxed">
                  Saved dispatches and bookmarks are strictly private and accessible only to the account owner.
                </p>
              </div>
            </div>
          ) : savedPosts.length === 0 ? (
            <div className="py-16 text-center space-y-3 rounded-3xl bg-black/40 border border-white/5 p-8 max-w-xl mx-auto">
              <div className="w-16 h-16 rounded-full border border-purple-500/20 bg-purple-500/10 mx-auto flex items-center justify-center text-purple-300">
                <Bookmark className="w-8 h-8" />
              </div>
              <h3 className="font-bold text-lg text-white">Private Saved Dispatches</h3>
              <p className="text-xs text-zinc-400 max-w-xs mx-auto">
                Save photos and posts that you want to see again. No one is notified, and only you can see what you have saved in your private vault.
              </p>
            </div>
          ) : (
            <div className="space-y-4">
              {/* Privacy Assurance Banner */}
              <div className="p-3 sm:p-3.5 rounded-2xl bg-purple-950/30 border border-purple-500/20 backdrop-blur-xl flex items-center justify-between">
                <div className="flex items-center gap-2.5 text-xs text-purple-200">
                  <div className="p-1.5 rounded-lg bg-purple-500/20 border border-purple-500/30">
                    <Lock className="w-3.5 h-3.5 text-purple-300" />
                  </div>
                  <span><strong className="text-white">Private Vault</strong> · Only you can see your saved dispatches</span>
                </div>
                <span className="text-[10px] font-mono px-2.5 py-1 rounded-full bg-purple-500/20 border border-purple-500/30 text-purple-300 font-bold">
                  {savedPosts.length} Private
                </span>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 sm:gap-4">
                {savedPosts.map((post) => {
                  const img = post.images?.[0];
                  return (
                    <div
                      key={post.id}
                      onClick={() => setActivePostModal(post)}
                      className="relative aspect-square bg-gradient-to-br from-zinc-900 via-[#07090e] to-black border border-white/10 hover:border-purple-500/40 rounded-xl sm:rounded-2xl overflow-hidden cursor-pointer group p-3 flex flex-col justify-between transition-all duration-200"
                    >
                      {img ? (
                        <img src={img} alt="Post" className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition duration-300" />
                      ) : (
                        <div className="w-full h-full flex flex-col justify-between select-none">
                          <div className="flex items-center justify-between text-[9px] font-mono text-zinc-500 uppercase">
                            <span className="flex items-center gap-1">
                              <span className="w-1.5 h-1.5 rounded-full bg-purple-400" />
                              <span>Saved</span>
                            </span>
                            <Lock className="w-2.5 h-2.5 text-zinc-600" />
                          </div>
                          <p className="text-xs text-zinc-200 font-sans line-clamp-3 leading-snug">
                            {post.content}
                          </p>
                          <span className="text-[10px] font-mono text-zinc-500">
                            #{post.id.slice(-4)}
                          </span>
                        </div>
                      )}
                      <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition flex items-center justify-center gap-6 text-white font-bold text-sm">
                        <div className="flex items-center gap-1.5">
                          <Heart className="w-5 h-5 fill-white text-white" />
                          <span>{post.likes}</span>
                        </div>
                        <div className="flex items-center gap-1.5">
                          <MessageCircle className="w-5 h-5 fill-white text-white" />
                          <span>{post.replyCount || 0}</span>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}
        </div>
      )}

      {/* 5. VERIFIED MUN DOSSIER & DELEGATE EXPERIENCE */}
      {activeTab === 'mun_dossier' && (
        <div className="py-4">
          <DelegateDossierView userHandle={profile.username} isOwner={isOwnProfile} />
        </div>
      )}


      {/* ─── INSTAGRAM POST DETAIL MODAL ─── */}
      {activePostModal && (
        <div 
          className="fixed inset-0 z-50 bg-black/85 backdrop-blur-md flex items-center justify-center p-4 sm:p-6"
          onClick={() => setActivePostModal(null)}
        >
          <div 
            className="relative w-full max-w-4xl bg-black border border-zinc-800 rounded-2xl overflow-hidden shadow-2xl flex flex-col md:flex-row max-h-[85vh]"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Left Column: Full Media Image or Typographic Dispatch */}
            <div className="flex-1 bg-[#06080d] flex items-center justify-center overflow-hidden min-h-[320px] md:min-h-[500px] p-6">
              {activePostModal.images?.[0] ? (
                <div className="w-full h-full flex flex-col items-center justify-center relative">
                  <img
                    src={activePostModal.images[0]}
                    alt="Post media"
                    className="w-full h-full object-contain max-h-[65vh]"
                  />
                </div>
              ) : (
                <div className="max-w-md w-full space-y-4 p-6 rounded-2xl bg-white/[0.03] border border-white/10">
                  <div className="flex items-center justify-between border-b border-white/5 pb-2.5">
                    <span className="text-[10px] font-mono uppercase text-emerald-400 font-bold flex items-center gap-1.5">
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                      <span>Civic Dispatch</span>
                    </span>
                    <span className="text-[10px] font-mono text-zinc-500">#{activePostModal.id.slice(-4)}</span>
                  </div>
                  <p className="text-base sm:text-lg text-white font-sans font-medium leading-relaxed">
                    "{activePostModal.content}"
                  </p>
                  <p className="text-[11px] font-mono text-zinc-500">
                    {activePostModal.location || 'Palais des Nations'} · {activePostModal.createdAt}
                  </p>
                </div>
              )}
            </div>

            {/* Right Column: Comments & Details */}
            <div className="w-full md:w-[380px] flex flex-col justify-between border-t md:border-t-0 md:border-l border-zinc-800 bg-zinc-950">
              
              {/* Header: Author Info + Actions */}
              <div className="p-3.5 sm:p-4 border-b border-zinc-800 flex items-center justify-between gap-3">
                <div
                  onClick={() => {
                    openUserProfile(activePostModal.authorUsername);
                    setActivePostModal(null);
                  }}
                  className="flex items-center gap-3 cursor-pointer group min-w-0"
                >
                  <div className="w-9 h-9 rounded-full bg-gradient-to-tr from-amber-400 via-rose-500 to-fuchsia-600 p-[1.5px] shrink-0">
                    <div className="w-full h-full rounded-full bg-black flex items-center justify-center font-bold text-xs text-white">
                      {activePostModal.authorName?.[0] || 'U'}
                    </div>
                  </div>
                  <div className="min-w-0">
                    <span className="font-bold text-xs text-white group-hover:underline block truncate">
                      {activePostModal.authorUsername}
                    </span>
                    <span className="text-[11px] text-zinc-500 block truncate">
                      {activePostModal.location || 'Global Assembly'}
                    </span>
                  </div>
                </div>
                
                {/* Header Right Actions: Follow, 3-Dot Options & Close Button */}
                <div className="flex items-center gap-1.5 shrink-0 relative">
                  {activePostModal.authorUsername !== currentUserUsername && (
                    <button
                      type="button"
                      onClick={() => toggleFollow(activePostModal.authorUsername)}
                      className={`px-3 py-1 rounded-full text-xs font-bold transition-all cursor-pointer ${
                        isFollowing(activePostModal.authorUsername)
                          ? 'bg-white/10 text-zinc-300 hover:bg-white/15'
                          : 'bg-white text-black hover:bg-neutral-200 shadow-sm'
                      }`}
                    >
                      {isFollowing(activePostModal.authorUsername) ? 'Following' : 'Follow'}
                    </button>
                  )}

                  {/* 3-Dot Post Options Dropdown */}
                  <div className="relative">
                    <button
                      type="button"
                      onClick={() => setShowModalPostSettings(!showModalPostSettings)}
                      className={`p-1.5 rounded-full transition cursor-pointer ${
                        showModalPostSettings ? 'bg-white/20 text-white' : 'hover:bg-white/10 text-zinc-400 hover:text-white'
                      }`}
                      title="Post Options"
                    >
                      <MoreHorizontal className="w-4 h-4" />
                    </button>

                    {showModalPostSettings && (
                      <>
                        <div
                          className="fixed inset-0 z-40"
                          onClick={() => setShowModalPostSettings(false)}
                        />
                        <div
                          onClick={(e) => e.stopPropagation()}
                          className="absolute right-0 top-full mt-1.5 w-56 bg-[#0c0e18] border border-white/15 rounded-2xl shadow-[0_15px_50px_rgba(0,0,0,0.85)] p-1.5 z-50 backdrop-blur-xl font-mono text-xs space-y-0.5 text-left"
                        >
                          <div className="px-3 py-1.5 text-[10px] font-bold text-zinc-400 tracking-wider uppercase border-b border-white/5 flex items-center justify-between">
                            <span>Post Options</span>
                            <span className="text-[9px] text-zinc-500">#{activePostModal.id.slice(-4)}</span>
                          </div>

                          <button
                            type="button"
                            onClick={() => {
                              if (typeof navigator !== 'undefined' && navigator.clipboard) {
                                navigator.clipboard.writeText(`${window.location.origin}/pulse?post=${activePostModal.id}`);
                                alert('Post link copied to clipboard!');
                              }
                              setShowModalPostSettings(false);
                            }}
                            className="w-full px-3 py-2 rounded-xl text-left flex items-center gap-2.5 text-zinc-200 hover:text-white hover:bg-white/10 transition cursor-pointer"
                          >
                            <Share2 className="w-3.5 h-3.5 text-cyan-400 shrink-0" />
                            <span>Copy Post Link</span>
                          </button>

                          <button
                            type="button"
                            onClick={() => {
                              if (typeof navigator !== 'undefined' && navigator.clipboard && activePostModal.content) {
                                navigator.clipboard.writeText(activePostModal.content);
                                alert('Post text copied to clipboard!');
                              }
                              setShowModalPostSettings(false);
                            }}
                            className="w-full px-3 py-2 rounded-xl text-left flex items-center gap-2.5 text-zinc-200 hover:text-white hover:bg-white/10 transition cursor-pointer"
                          >
                            <Copy className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                            <span>Copy Text</span>
                          </button>

                          {(activePostModal.authorUsername === currentUserUsername || isOwnProfile) ? (
                            <div className="pt-1 border-t border-white/10">
                              <button
                                type="button"
                                onClick={() => {
                                  if (confirm('Permanently delete this dispatch from your profile and feed?')) {
                                    deletePost(activePostModal.id);
                                    setShowModalPostSettings(false);
                                    setActivePostModal(null);
                                  }
                                }}
                                className="w-full px-3 py-2 rounded-xl text-left flex items-center gap-2.5 text-rose-400 hover:text-rose-300 hover:bg-rose-500/15 transition cursor-pointer font-bold"
                              >
                                <Trash2 className="w-3.5 h-3.5 text-rose-400 shrink-0" />
                                <span>Delete Post</span>
                              </button>
                            </div>
                          ) : (
                            <>
                              <button
                                type="button"
                                onClick={() => {
                                  alert('Dispatch hidden from your feed.');
                                  setShowModalPostSettings(false);
                                  setActivePostModal(null);
                                }}
                                className="w-full px-3 py-2 rounded-xl text-left flex items-center gap-2.5 text-zinc-200 hover:text-white hover:bg-white/10 transition cursor-pointer"
                              >
                                <EyeOff className="w-3.5 h-3.5 text-zinc-400 shrink-0" />
                                <span>Hide Post</span>
                              </button>
                              <button
                                type="button"
                                onClick={() => {
                                  alert('🚨 Post flagged for Sovereign Council review.');
                                  setShowModalPostSettings(false);
                                }}
                                className="w-full px-3 py-2 rounded-xl text-left flex items-center gap-2.5 text-amber-300 hover:text-amber-200 hover:bg-amber-500/10 transition cursor-pointer"
                              >
                                <Flag className="w-3.5 h-3.5 text-amber-400 shrink-0" />
                                <span>Report Post</span>
                              </button>
                            </>
                          )}
                        </div>
                      </>
                    )}
                  </div>

                  <button
                    type="button"
                    onClick={() => {
                      setShowModalPostSettings(false);
                      setActivePostModal(null);
                    }}
                    className="p-1.5 rounded-full hover:bg-white/10 text-zinc-400 hover:text-white transition cursor-pointer"
                    title="Close"
                  >
                    <X className="w-4 h-4 sm:w-5 sm:h-5" />
                  </button>
                </div>
              </div>

              {/* Comments Scrollable Area */}
              <div className="p-4 flex-1 overflow-y-auto space-y-4 text-xs">
                
                {/* Original Post Caption */}
                <div className="flex items-start gap-3">
                  <div className="w-7 h-7 rounded-full bg-zinc-800 shrink-0 flex items-center justify-center font-bold text-[10px] text-white uppercase">
                    {activePostModal.authorName?.[0] || 'U'}
                  </div>
                  <div className="space-y-1">
                    <p className="text-zinc-200">
                      <strong className="text-white mr-1.5 font-bold">{activePostModal.authorUsername}</strong>
                      {activePostModal.content}
                    </p>
                    <span className="text-[10px] text-zinc-500">{activePostModal.createdAt}</span>
                    
                    {/* Conditionally render Go to Dossier or Go to SPARK only if post is a dossier or spark */}
                    {(() => {
                      const isDossierItem = Boolean(
                        activePostModal.isTreaty ||
                        activePostModal.postType === 'treaty' ||
                        activePostModal.treatyTitle ||
                        (activePostModal.citations && activePostModal.citations.length > 0)
                      );
                      const isSparkItem = Boolean(
                        activePostModal.tags?.some(t => t.toLowerCase().includes('spark') || t.toLowerCase().includes('brief'))
                      );

                      if (!isDossierItem && !isSparkItem) return null;

                      return (
                        <div className="pt-2 flex items-center gap-2 flex-wrap">
                          {isDossierItem && (
                            <button
                              type="button"
                              onClick={() => {
                                setActivePostModal(null);
                                setActiveTab('mun_dossier');
                              }}
                              className="inline-flex items-center gap-1.5 px-3 py-1 rounded-xl bg-amber-500/15 hover:bg-amber-500/25 border border-amber-500/40 text-amber-300 text-[11px] font-mono font-bold transition cursor-pointer shadow-sm"
                            >
                              <Award className="w-3.5 h-3.5 text-amber-400" />
                              <span>Go to Dossier</span>
                            </button>
                          )}
                          {isSparkItem && (
                            <button
                              type="button"
                              onClick={() => {
                                setActivePostModal(null);
                                setActiveTab('reels');
                              }}
                              className="inline-flex items-center gap-1.5 px-3 py-1 rounded-xl bg-rose-500/15 hover:bg-rose-500/25 border border-rose-500/40 text-rose-300 text-[11px] font-mono font-bold transition cursor-pointer shadow-sm"
                            >
                              <Sparkles className="w-3.5 h-3.5 text-rose-400" />
                              <span>Go to SPARK</span>
                            </button>
                          )}
                        </div>
                      );
                    })()}
                  </div>
                </div>

                {/* Replies / Comments */}
                {getReplies(activePostModal.id).map((reply) => (
                  <div key={reply.id} className="flex items-start gap-3">
                    <div className="w-7 h-7 rounded-full bg-zinc-800 shrink-0 flex items-center justify-center font-bold text-[10px] text-white uppercase">
                      {reply.authorName?.[0] || 'U'}
                    </div>
                    <div className="space-y-1">
                      <p className="text-zinc-200">
                        <strong className="text-white mr-1.5 font-bold">{reply.authorUsername}</strong>
                        {reply.content}
                      </p>
                      <span className="text-[10px] text-zinc-500">{reply.createdAt}</span>
                    </div>
                  </div>
                ))}
              </div>

              {/* Action Bar & Add Comment */}
              <div className="p-4 border-t border-zinc-800 space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <button
                      onClick={() => likePost(activePostModal.id)}
                      className="text-white hover:text-zinc-300 transition cursor-pointer"
                    >
                      <Heart
                        className={`w-6 h-6 ${
                          activePostModal.likedBy?.includes(currentUserUsername)
                            ? 'fill-red-500 text-red-500'
                            : 'text-white'
                        }`}
                      />
                    </button>
                    <button className="text-white hover:text-zinc-300 transition cursor-pointer">
                      <MessageCircle className="w-6 h-6" />
                    </button>
                    <button className="text-white hover:text-zinc-300 transition cursor-pointer">
                      <Send className="w-6 h-6" />
                    </button>
                  </div>

                  <button
                    onClick={() => toggleSavePost(activePostModal.id)}
                    className="text-white hover:text-zinc-300 transition cursor-pointer"
                  >
                    <Bookmark
                      className={`w-6 h-6 ${
                        isSaved(activePostModal.id) ? 'fill-white text-white' : 'text-white'
                      }`}
                    />
                  </button>
                </div>

                <div className="text-xs font-bold text-white">
                  {activePostModal.likes} likes
                </div>

                {/* Inline Comment Input */}
                <div className="flex items-center gap-2 pt-1 border-t border-zinc-800">
                  <input
                    type="text"
                    placeholder="Add a comment..."
                    value={modalComment}
                    onChange={(e) => setModalComment(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter') handleAddModalComment(activePostModal.id);
                    }}
                    className="flex-1 bg-transparent text-white text-xs placeholder-zinc-500 focus:outline-none"
                  />
                  <button
                    type="button"
                    disabled={!modalComment.trim()}
                    onClick={() => handleAddModalComment(activePostModal.id)}
                    className="text-xs font-bold text-white hover:text-zinc-300 disabled:opacity-40 transition cursor-pointer"
                  >
                    Post
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ─── EDIT PROFILE MODAL ─── */}
      {showEditModal && (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-black/85 backdrop-blur-sm p-3 sm:p-6 flex flex-col justify-start sm:justify-center items-center">
          <div className="relative w-full max-w-lg bg-black border border-zinc-800 rounded-3xl p-6 sm:p-8 space-y-6 shadow-2xl my-auto max-h-[92vh] overflow-y-auto">
            
            <div className="flex items-center justify-between pb-4 border-b border-zinc-800">
              <h3 className="font-bold text-lg text-white">Edit Profile</h3>
              <button
                onClick={() => setShowEditModal(false)}
                className="text-zinc-400 hover:text-white cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveProfile} className="space-y-4 text-left">
              {/* Avatar upload / link */}
              <div className="flex items-center gap-4 p-3 rounded-2xl bg-zinc-950 border border-zinc-800">
                <div className="w-16 h-16 rounded-full overflow-hidden bg-zinc-900 border border-zinc-700 shrink-0">
                  {editAvatar ? (
                    <img src={editAvatar} alt="Preview" className="w-full h-full object-cover" />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center font-bold text-white text-xl">
                      {editName?.[0] || 'U'}
                    </div>
                  )}
                </div>
                <div className="space-y-1.5 flex-1">
                  <label className="text-xs font-semibold text-white block">
                    Profile Photo / Logo
                  </label>
                  <div className="flex items-center gap-2">
                    <label className="px-3 py-1.5 rounded-lg bg-white text-black text-xs font-semibold hover:bg-zinc-200 transition cursor-pointer">
                      <span>Upload</span>
                      <input type="file" accept="image/*" onChange={handleAvatarFileUpload} className="hidden" />
                    </label>
                    <input
                      type="text"
                      placeholder="Or paste image URL"
                      value={editAvatar}
                      onChange={(e) => setEditAvatar(e.target.value)}
                      className="flex-1 px-3 py-1.5 rounded-lg bg-black border border-zinc-800 text-white text-xs placeholder-zinc-500 focus:outline-none focus:border-white"
                    />
                  </div>
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-xs font-medium text-zinc-300 block">Full Name</label>
                <input
                  type="text"
                  required
                  value={editName}
                  onChange={(e) => setEditName(e.target.value)}
                  className="w-full px-4 py-2.5 rounded-xl bg-zinc-950 border border-zinc-800 text-white text-xs placeholder-zinc-500 focus:outline-none focus:border-white"
                />
              </div>

              <div className="space-y-1">
                <label className="text-xs font-medium text-zinc-300 block">Role / Focus</label>
                <input
                  type="text"
                  placeholder="e.g. Writer, Researcher, Thinker, Creator, Delegate, Innovator"
                  value={editCategory}
                  onChange={(e) => setEditCategory(e.target.value)}
                  className="w-full px-4 py-2.5 rounded-xl bg-zinc-950 border border-zinc-800 text-white text-xs placeholder-zinc-500 focus:outline-none focus:border-white"
                />
              </div>

              <div className="space-y-1">
                <div className="flex items-center justify-between">
                  <label className="text-xs font-medium text-zinc-300">Bio</label>
                  <span className="text-[10px] text-zinc-500">{editBio.length}/150</span>
                </div>
                <textarea
                  rows={3}
                  maxLength={150}
                  placeholder="Write a brief bio about yourself..."
                  value={editBio}
                  onChange={(e) => setEditBio(e.target.value)}
                  className="w-full px-4 py-2.5 rounded-xl bg-zinc-950 border border-zinc-800 text-white text-xs placeholder-zinc-500 focus:outline-none focus:border-white resize-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="text-xs font-medium text-zinc-300 block">Location</label>
                  <input
                    type="text"
                    placeholder="City, Country"
                    value={editLocation}
                    onChange={(e) => setEditLocation(e.target.value)}
                    className="w-full px-4 py-2.5 rounded-xl bg-zinc-950 border border-zinc-800 text-white text-xs placeholder-zinc-500 focus:outline-none focus:border-white"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-medium text-zinc-300 block">Website</label>
                  <input
                    type="text"
                    placeholder="yourwebsite.org"
                    value={editWebsite}
                    onChange={(e) => setEditWebsite(e.target.value)}
                    className="w-full px-4 py-2.5 rounded-xl bg-zinc-950 border border-zinc-800 text-white text-xs placeholder-zinc-500 focus:outline-none focus:border-white"
                  />
                </div>
              </div>

              <div className="flex items-center justify-end gap-3 pt-3 border-t border-zinc-800">
                <button
                  type="button"
                  onClick={() => setShowEditModal(false)}
                  className="px-4 py-2.5 rounded-xl border border-zinc-800 text-xs font-semibold text-zinc-400 hover:text-white transition cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-6 py-2.5 rounded-xl bg-white text-black text-xs font-semibold hover:bg-zinc-200 transition cursor-pointer shadow-sm"
                >
                  Done
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ─── FOLLOWERS / FOLLOWING LIST MODAL ─── */}
      {showFollowersModal && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="w-full max-w-sm bg-black border border-zinc-800 rounded-3xl p-5 space-y-4 shadow-2xl">
            <div className="flex items-center justify-between pb-3 border-b border-zinc-800">
              <h3 className="font-bold text-sm text-white capitalize">{showFollowersModal}</h3>
              <button
                onClick={() => setShowFollowersModal(null)}
                className="text-zinc-400 hover:text-white cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="max-h-72 overflow-y-auto space-y-3">
              {Array.from(new Set((showFollowersModal === 'followers' ? profile.followers : profile.following) || [])).length === 0 ? (
                <p className="text-xs text-zinc-500 text-center py-6">No users to show.</p>
              ) : (
                Array.from(new Set((showFollowersModal === 'followers' ? profile.followers : profile.following) || [])).map((uname, idx) => (
                  <div
                    key={`${uname}_${idx}`}
                    onClick={() => {
                      openUserProfile(uname);
                      setShowFollowersModal(null);
                    }}
                    className="flex items-center justify-between p-2 rounded-xl hover:bg-zinc-900 transition cursor-pointer"
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-full bg-zinc-800 flex items-center justify-center font-bold text-xs text-white">
                        {uname?.[0]?.toUpperCase() || 'U'}
                      </div>
                      <span className="font-bold text-xs text-white">@{uname}</span>
                    </div>
                    <span className="text-[11px] text-zinc-500 font-semibold">View</span>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      )}

      {/* ─── ADD SHOWCASE EVENT MODAL ─── */}
      {showAddEventModal && (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-black/85 backdrop-blur-sm p-3 sm:p-6 flex flex-col justify-start sm:justify-center items-center">
          <div className="relative w-full max-w-lg bg-black border border-zinc-800 rounded-3xl p-6 sm:p-8 space-y-6 shadow-2xl my-auto max-h-[92vh] overflow-y-auto">
            <div className="flex items-center justify-between pb-4 border-b border-zinc-800">
              <div className="flex items-center gap-2">
                <Calendar className="w-5 h-5 text-cyan-400" />
                <h3 className="font-bold text-lg text-white">Add Showcase Event</h3>
              </div>
              <button
                onClick={() => setShowAddEventModal(false)}
                className="text-zinc-400 hover:text-white cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form
              onSubmit={(e) => {
                e.preventDefault();
                if (!newEventTitle.trim()) return;
                addProfileHostedEvent({
                  title: newEventTitle.trim(),
                  category: newEventCategory,
                  date: newEventDate.trim(),
                  time: newEventTime.trim(),
                  location: newEventLocation.trim(),
                  rsvpUrl: newEventRsvpUrl.trim() || '/events',
                  maxCapacity: Number(newEventMaxCapacity) || 200,
                  coverImage: newEventCoverImage.trim(),
                  description: newEventDescription.trim(),
                });
                setShowAddEventModal(false);
                setNewEventTitle('');
                setNewEventDescription('');
              }}
              className="space-y-4 text-left"
            >
              {/* Event Title */}
              <div className="space-y-1">
                <label className="text-xs font-semibold text-zinc-300 block">Event Title</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Zenvitra Youth Diplomatic Summit 2026"
                  value={newEventTitle}
                  onChange={(e) => setNewEventTitle(e.target.value)}
                  className="w-full px-4 py-2.5 rounded-xl bg-zinc-950 border border-zinc-800 text-white text-xs placeholder-zinc-500 focus:outline-none focus:border-cyan-400"
                />
              </div>

              {/* Category & Capacity */}
              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="text-xs font-medium text-zinc-300 block">Category</label>
                  <select
                    value={newEventCategory}
                    onChange={(e) => setNewEventCategory(e.target.value as any)}
                    className="w-full px-3 py-2.5 rounded-xl bg-zinc-950 border border-zinc-800 text-white text-xs focus:outline-none focus:border-cyan-400"
                  >
                    <option value="SUMMIT">Summit / Conference</option>
                    <option value="WORKSHOP">Masterclass / Workshop</option>
                    <option value="KEYNOTE">Keynote / Plenary</option>
                    <option value="MEETUP">Civic Meetup</option>
                    <option value="HACKATHON">Civic Hackathon</option>
                  </select>
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-medium text-zinc-300 block">Max Capacity</label>
                  <input
                    type="number"
                    min={10}
                    max={5000}
                    value={newEventMaxCapacity}
                    onChange={(e) => setNewEventMaxCapacity(Number(e.target.value))}
                    className="w-full px-4 py-2.5 rounded-xl bg-zinc-950 border border-zinc-800 text-white text-xs focus:outline-none focus:border-cyan-400"
                  />
                </div>
              </div>

              {/* Date & Time */}
              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="text-xs font-medium text-zinc-300 block">Date</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Oct 15-17, 2026"
                    value={newEventDate}
                    onChange={(e) => setNewEventDate(e.target.value)}
                    className="w-full px-4 py-2.5 rounded-xl bg-zinc-950 border border-zinc-800 text-white text-xs placeholder-zinc-500 focus:outline-none focus:border-cyan-400"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-medium text-zinc-300 block">Time</label>
                  <input
                    type="text"
                    placeholder="e.g. 10:00 AM CET"
                    value={newEventTime}
                    onChange={(e) => setNewEventTime(e.target.value)}
                    className="w-full px-4 py-2.5 rounded-xl bg-zinc-950 border border-zinc-800 text-white text-xs placeholder-zinc-500 focus:outline-none focus:border-cyan-400"
                  />
                </div>
              </div>

              {/* Location */}
              <div className="space-y-1">
                <label className="text-xs font-medium text-zinc-300 block">Location / Venue</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Palais des Nations, Geneva & Virtual Wire"
                  value={newEventLocation}
                  onChange={(e) => setNewEventLocation(e.target.value)}
                  className="w-full px-4 py-2.5 rounded-xl bg-zinc-950 border border-zinc-800 text-white text-xs placeholder-zinc-500 focus:outline-none focus:border-cyan-400"
                />
              </div>

              {/* Embedded Registration URL */}
              <div className="space-y-1">
                <label className="text-xs font-semibold text-cyan-300 flex items-center justify-between">
                  <span>Embedded Registration URL</span>
                  <span className="text-[10px] text-zinc-400 font-normal">Redirects attendees on click</span>
                </label>
                <input
                  type="text"
                  placeholder="e.g. /events or https://forms.gle/... or https://luma.com/..."
                  value={newEventRsvpUrl}
                  onChange={(e) => setNewEventRsvpUrl(e.target.value)}
                  className="w-full px-4 py-2.5 rounded-xl bg-zinc-950 border border-cyan-500/40 text-white text-xs placeholder-zinc-500 focus:outline-none focus:border-cyan-400"
                />
              </div>

              {/* Cover Image Preset Picker */}
              <div className="space-y-1.5">
                <label className="text-xs font-medium text-zinc-300 block">Cover Image</label>
                <div className="grid grid-cols-3 gap-2">
                  {[
                    { label: 'Geneva Assembly', url: 'https://images.unsplash.com/photo-1540575467063-178a50c2df87?auto=format&fit=crop&w=1200&q=80' },
                    { label: 'Plenary Summit', url: 'https://images.unsplash.com/photo-1511578314322-379afb476865?auto=format&fit=crop&w=1200&q=80' },
                    { label: 'Civic Forum', url: 'https://images.unsplash.com/photo-1577495508048-b635879837f1?auto=format&fit=crop&w=1200&q=80' },
                  ].map((preset, idx) => (
                    <button
                      key={idx}
                      type="button"
                      onClick={() => setNewEventCoverImage(preset.url)}
                      className={`relative aspect-[16/9] rounded-xl overflow-hidden border transition cursor-pointer ${
                        newEventCoverImage === preset.url ? 'border-cyan-400 ring-2 ring-cyan-400/40' : 'border-zinc-800 opacity-70 hover:opacity-100'
                      }`}
                    >
                      <img src={preset.url} alt={preset.label} className="w-full h-full object-cover" />
                      <span className="absolute inset-0 bg-black/40 flex items-center justify-center text-[9px] font-bold text-white p-1 text-center">
                        {preset.label}
                      </span>
                    </button>
                  ))}
                </div>
                <input
                  type="text"
                  placeholder="Or paste custom image URL"
                  value={newEventCoverImage}
                  onChange={(e) => setNewEventCoverImage(e.target.value)}
                  className="w-full px-4 py-2 rounded-xl bg-zinc-950 border border-zinc-800 text-white text-xs placeholder-zinc-500 focus:outline-none focus:border-cyan-400 mt-1"
                />
              </div>

              {/* Description */}
              <div className="space-y-1">
                <label className="text-xs font-medium text-zinc-300 block">Description / Agenda</label>
                <textarea
                  rows={2}
                  placeholder="Brief overview of key themes, agenda, or guest speakers..."
                  value={newEventDescription}
                  onChange={(e) => setNewEventDescription(e.target.value)}
                  className="w-full px-4 py-2.5 rounded-xl bg-zinc-950 border border-zinc-800 text-white text-xs placeholder-zinc-500 focus:outline-none focus:border-cyan-400 resize-none"
                />
              </div>

              <div className="flex items-center justify-end gap-3 pt-3 border-t border-zinc-800">
                <button
                  type="button"
                  onClick={() => setShowAddEventModal(false)}
                  className="px-4 py-2.5 rounded-xl border border-zinc-800 text-xs font-semibold text-zinc-400 hover:text-white transition cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-cyan-500 to-teal-400 text-black font-bold text-xs hover:from-cyan-400 hover:to-teal-300 transition cursor-pointer shadow-md"
                >
                  Publish to Showcase
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ─── ORGANIZER PRO SUBSCRIPTION MODAL ─── */}
      {showOrganizerModal && (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-black/85 backdrop-blur-sm p-3 sm:p-6 flex flex-col justify-start sm:justify-center items-center">
          <div className="relative w-full max-w-lg bg-black border border-amber-400/40 rounded-3xl p-6 sm:p-8 space-y-6 shadow-[0_0_50px_rgba(245,158,11,0.2)] my-auto max-h-[92vh] overflow-y-auto">
            <div className="flex items-center justify-between pb-4 border-b border-zinc-800">
              <div className="flex items-center gap-2">
                <Crown className="w-5 h-5 text-amber-400" />
                <h3 className="font-bold text-lg text-white">Organizer Pro Subscription</h3>
              </div>
              <button
                onClick={() => setShowOrganizerModal(false)}
                className="text-zinc-400 hover:text-white cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-4 text-left text-xs">
              <div className="p-4 rounded-2xl bg-amber-400/10 border border-amber-400/30 text-amber-200 leading-relaxed">
                Supercharge your profile as an authorized Event Organizer or Business Node on Zenvitra.
              </div>

              <div className="space-y-3">
                {[
                  { title: 'Featured Events & Showcase Section', desc: 'Display all your summits, hackathons, and Model UN conferences directly on your profile.' },
                  { title: 'Embedded Registration Redirects', desc: 'Embed direct ticket and registration links with instant attendee redirection.' },
                  { title: 'Verified Organizer Badge', desc: 'Distinguished gold and cyan crown badge displayed across dispatches and chamber wire.' },
                  { title: 'Live Guest List & Analytics', desc: 'Real-time RSVPs and capacity tracking for all your hosted sessions.' },
                ].map((perk, i) => (
                  <div key={i} className="flex items-start gap-3 p-3 rounded-xl bg-zinc-950 border border-zinc-800">
                    <CheckCircle2 className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
                    <div>
                      <strong className="text-white block font-bold text-xs">{perk.title}</strong>
                      <span className="text-zinc-400 text-[11px]">{perk.desc}</span>
                    </div>
                  </div>
                ))}
              </div>

              <div className="pt-4 border-t border-zinc-800 flex items-center justify-between">
                <div>
                  <span className="text-zinc-400 text-[11px] block">Civic Tier Plan</span>
                  <strong className="text-white text-sm font-bold">100% Free for Youth Organizers</strong>
                </div>
                <button
                  type="button"
                  onClick={() => {
                    subscribeToOrganizerPro();
                    setShowOrganizerModal(false);
                  }}
                  className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-amber-400 to-amber-500 hover:from-amber-300 hover:to-amber-400 text-black font-bold text-xs transition cursor-pointer shadow-[0_0_20px_rgba(245,158,11,0.4)]"
                >
                  {profile.isSubscribedOrganizer ? 'Active' : 'Activate Organizer Pro'}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ─── SETTINGS MODAL ─── */}
      <SettingsModal
        isOpen={showSettingsModal}
        onClose={() => setShowSettingsModal(false)}
      />

      {/* ─── SOVEREIGN VERIFICATION MODAL ─── */}
      <VerificationModal
        isOpen={showVerificationModal}
        onClose={() => setShowVerificationModal(false)}
      />

      {/* ─── STORY COMPOSER MODAL ─── */}
      {showStoryComposerModal && (
        <StoryComposerModal
          isOpen={showStoryComposerModal}
          onClose={() => setShowStoryComposerModal(false)}
        />
      )}
    </div>
  );
}

