'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { 
  ArrowLeft, 
  ArrowRight,
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
  Flag,
  Upload,
  LayoutDashboard,
  Globe,
  Ticket,
  Landmark,
  QrCode,
  Briefcase
} from 'lucide-react';
import { useZenPulse } from '@/context/ZenPulsePlatformContext';
import { useAuth } from '@/context/AuthContext';
import { PulseProfile, PulsePost, FluxVideo } from '@/types/pulse';
import { DelegateDossierView } from '@/components/mun/DelegateDossierView';
import { SettingsModal } from '@/components/settings/SettingsModal';
import { VerificationModal } from '@/components/modals/VerificationModal';
import OrganizerKycModal from '@/components/events/OrganizerKycModal';
import { compressAvatarImage } from '@/lib/imageUtils';

export function UserProfileView() {
  const router = useRouter();
  const { profile: authProfile, user: authUser, updateProfile } = useAuth();
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

  const rawEffectiveAvatar = 
    myProfile?.avatar || 
    authProfile?.avatar_url || 
    (authProfile as any)?.avatar || 
    storedUser?.avatar || 
    storedUser?.avatar_url || 
    '';

  const effectiveMyAvatar = rawEffectiveAvatar || '/assets/default-avatar.svg';

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

  const [activeTab, setActiveTab] = useState<'posts' | 'reels' | 'events_showcase' | 'my_tickets' | 'saved' | 'mun_dossier'>('posts');
  const [showEditModal, setShowEditModal] = useState(false);
  const [showSettingsModal, setShowSettingsModal] = useState(false);
  const [showVerificationModal, setShowVerificationModal] = useState(false);
  const [showAddEventModal, setShowAddEventModal] = useState(false);
  const [showOrganizerModal, setShowOrganizerModal] = useState(false);
  const [showFollowersModal, setShowFollowersModal] = useState<'followers' | 'following' | null>(null);
  const [activePostModal, setActivePostModal] = useState<PulsePost | null>(null);
  const [showModalPostSettings, setShowModalPostSettings] = useState(false);
  const [copied, setCopied] = useState(false);

  // Organizer KYC & Tickets ledger state
  const [kycModalOpen, setKycModalOpen] = useState(false);
  const [kycStatus, setKycStatus] = useState<string | null>(null);
  const [userTickets, setUserTickets] = useState<any[]>([]);
  const [loadingTickets, setLoadingTickets] = useState(false);
  const [userApplications, setUserApplications] = useState<any[]>([]);
  const [loadingApplications, setLoadingApplications] = useState(false);
  const [ticketsSubTab, setTicketsSubTab] = useState<'passes' | 'applications'>('passes');
  const [respondingAppId, setRespondingAppId] = useState<string | null>(null);

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

  // Pulse Profile Privacy (Public vs Private)
  const [profilePrivacy, setProfilePrivacy] = useState<boolean>(() => {
    if (typeof window !== 'undefined') {
      const stored = localStorage.getItem(`zenvitra_pulse_privacy_${displayHandle}`);
      if (stored !== null) return stored === 'true';
    }
    return Boolean(profile.isPrivate);
  });
  const [editIsPrivate, setEditIsPrivate] = useState<boolean>(profilePrivacy);

  useEffect(() => {
    if (displayName) setEditName(displayName);
    if (profile.bio) setEditBio(profile.bio);
    if (profile.avatar) setEditAvatar(profile.avatar);
    if (profile.website) setEditWebsite(profile.website);
    if (profile.location) setEditLocation(profile.location);
    if (profile.category) setEditCategory(profile.category);
    if (typeof window !== 'undefined') {
      const stored = localStorage.getItem(`zenvitra_pulse_privacy_${displayHandle}`);
      if (stored !== null) {
        setProfilePrivacy(stored === 'true');
        setEditIsPrivate(stored === 'true');
        return;
      }
    }
    setProfilePrivacy(Boolean(profile.isPrivate));
    setEditIsPrivate(Boolean(profile.isPrivate));
  }, [displayName, profile.bio, profile.avatar, profile.website, profile.location, profile.category, profile.isPrivate, displayHandle]);

  // Fetch verified tickets and organizer KYC status
  useEffect(() => {
    const handleToQuery = effectiveMyUsername || authProfile?.username || (authProfile as any)?.handle || '';
    const emailToQuery = authProfile?.email || authUser?.email || '';

    if (!handleToQuery && !emailToQuery) return;

    const fetchKycAndTickets = async () => {
      try {
        if (handleToQuery) {
          const kycRes = await fetch(`/api/organizer/kyc?userHandle=${encodeURIComponent(handleToQuery)}`);
          const kycData = await kycRes.json();
          if (kycData.success && kycData.kyc) {
            setKycStatus(kycData.kyc.status);
          }
        }
      } catch (_) {}

      try {
        setLoadingTickets(true);
        const queryParams = new URLSearchParams();
        if (handleToQuery) queryParams.set('attendeeHandle', handleToQuery);
        if (emailToQuery) queryParams.set('attendeeEmail', emailToQuery);
        
        const ticketsRes = await fetch(`/api/events/tickets?${queryParams.toString()}`);
        const ticketsData = await ticketsRes.json();
        if (ticketsData.success && Array.isArray(ticketsData.tickets)) {
          setUserTickets(ticketsData.tickets);
        }
      } catch (_) {} finally {
        setLoadingTickets(false);
      }

      try {
        setLoadingApplications(true);
        const appParams = new URLSearchParams();
        if (handleToQuery) appParams.set('applicantHandle', handleToQuery);
        if (emailToQuery) appParams.set('applicantEmail', emailToQuery);

        const appsRes = await fetch(`/api/events/recruit/applications?${appParams.toString()}`);
        const appsData = await appsRes.json();
        if (appsData.success && Array.isArray(appsData.applications)) {
          setUserApplications(appsData.applications);
        }
      } catch (_) {} finally {
        setLoadingApplications(false);
      }
    };

    fetchKycAndTickets();
  }, [effectiveMyUsername, authProfile?.username, (authProfile as any)?.handle, authProfile?.email, authUser?.email]);

  const handleRespondToOffer = async (applicationId: string, action: 'ACCEPT' | 'DECLINE') => {
    try {
      setRespondingAppId(applicationId);
      const res = await fetch('/api/events/recruit/applications', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          applicationId,
          action,
        }),
      });
      const data = await res.json();
      if (data.success && data.application) {
        setUserApplications((prev) =>
          prev.map((a) => (a.id === applicationId ? { ...a, ...data.application } : a))
        );
      }
    } catch (err) {
      console.error('Failed to respond to offer:', err);
    } finally {
      setRespondingAppId(null);
    }
  };

  // Comment input inside post modal
  const [modalComment, setModalComment] = useState('');

  const posts: PulsePost[] = getPostsByUsername(displayHandle);
  const reels: FluxVideo[] = getFluxByUsername(displayHandle);
  const following = isFollowing(displayHandle);
  const isProfileLocked = !isOwnProfile && profilePrivacy && !following;

  const handleAvatarFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      try {
        const compressed = await compressAvatarImage(file, 400, 400, 0.88);
        setEditAvatar(compressed);
      } catch (err) {
        console.warn('Avatar compression fallback to FileReader:', err);
        const reader = new FileReader();
        reader.onloadend = () => {
          setEditAvatar(reader.result as string);
        };
        reader.readAsDataURL(file);
      }
    }
  };

  const handleSaveProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    const cleanAvatar = editAvatar.trim();
    const cleanName = editName.trim();
    const cleanBio = editBio.trim();

    updateMyProfile({
      name: cleanName,
      bio: cleanBio,
      avatar: cleanAvatar,
      website: editWebsite.trim(),
      location: editLocation.trim(),
      isPrivate: editIsPrivate,
    });

    if (updateProfile) {
      try {
        await updateProfile({
          display_name: cleanName,
          avatar_url: cleanAvatar,
          bio: cleanBio,
        });
      } catch (_) {}
    }

    setProfilePrivacy(editIsPrivate);
    if (typeof window !== 'undefined') {
      try {
        localStorage.setItem(`zenvitra_pulse_privacy_${displayHandle}`, String(editIsPrivate));
        
        // Sync passport record so profile photo updates globally
        const passKey = `zenvitra_passport_${displayHandle}`;
        const existingPass = localStorage.getItem(passKey);
        if (existingPass) {
          const parsed = JSON.parse(existingPass);
          parsed.avatarUrl = cleanAvatar;
          parsed.fullName = cleanName;
          localStorage.setItem(passKey, JSON.stringify(parsed));
          window.dispatchEvent(new CustomEvent('zenvitra_passport_updated', { detail: { passport: parsed } }));
        }

        // Sync session user
        const stored = JSON.parse(localStorage.getItem('zenvitra_session_user') || '{}');
        const nextUser = {
          ...stored,
          display_name: cleanName,
          name: cleanName,
          avatar_url: cleanAvatar,
          avatar: cleanAvatar,
          bio: cleanBio,
        };
        localStorage.setItem('zenvitra_session_user', JSON.stringify(nextUser));

        window.dispatchEvent(new Event('storage'));
        window.dispatchEvent(new CustomEvent('zenvitra_auth_change'));
        window.dispatchEvent(new CustomEvent('zenvitra_profile_sync'));
      } catch (_) {}
    }
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
          <div className="w-24 h-24 sm:w-36 sm:h-36 rounded-full p-[2.5px] bg-gradient-to-tr from-cyan-500/40 via-white/20 to-blue-600/40 border border-white/10 shadow-xl">
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
                {!isVerifiedEffective ? (
                  <button
                    type="button"
                    onClick={() => setShowVerificationModal(true)}
                    className="px-3.5 py-2 rounded-xl bg-gradient-to-r from-cyan-500/20 via-teal-500/15 to-blue-600/20 hover:from-cyan-500/30 hover:to-blue-600/30 border border-cyan-400/50 text-cyan-200 hover:text-white text-xs font-mono font-bold transition flex items-center gap-1.5 cursor-pointer shadow-[0_0_18px_rgba(6,182,212,0.3)] active:scale-95"
                    title="Apply for Official National Sovereign Clearance"
                  >
                    <ShieldCheck className="w-3.5 h-3.5 text-cyan-400 animate-pulse" />
                    <span>Verify Account</span>
                  </button>
                ) : (
                  <button
                    type="button"
                    onClick={() => setShowVerificationModal(true)}
                    className="px-3.5 py-2 rounded-xl bg-emerald-500/15 hover:bg-emerald-500/25 border border-emerald-500/40 text-emerald-300 hover:text-emerald-200 text-xs font-mono font-bold transition flex items-center gap-1.5 cursor-pointer shadow-[0_0_15px_rgba(16,185,129,0.2)] active:scale-95"
                    title="Inspect National Sovereign Clearance Certificate & Proof"
                  >
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                    <span>Clearance Active</span>
                  </button>
                )}

                <Link href="/dashboard">
                  <button
                    className="px-4 py-2 rounded-xl bg-cyan-500/10 hover:bg-cyan-500/20 border border-cyan-500/30 text-xs font-bold text-cyan-300 transition cursor-pointer flex items-center gap-1.5 backdrop-blur-md"
                    title="Platform Dashboard & Credentials"
                  >
                    <LayoutDashboard className="w-3.5 h-3.5 text-cyan-400" />
                    <span>Dashboard</span>
                  </button>
                </Link>
                <Link href={`/space/${displayHandle}`}>
                  <button
                    className="px-3.5 py-2 rounded-xl bg-purple-500/10 hover:bg-purple-500/20 border border-purple-500/30 text-purple-300 hover:text-purple-200 text-xs font-bold font-mono transition flex items-center gap-1.5 backdrop-blur-md cursor-pointer"
                    title="Open Your Sovereign ZenSpace (Linktree)"
                  >
                    <ExternalLink className="w-3.5 h-3.5 text-purple-400" />
                    <span>ZenSpace</span>
                  </button>
                </Link>
                <button
                  type="button"
                  onClick={() => {
                    const nextVal = !profilePrivacy;
                    updateMyProfile({ isPrivate: nextVal });
                    setProfilePrivacy(nextVal);
                    setEditIsPrivate(nextVal);
                    if (typeof window !== 'undefined') {
                      try {
                        localStorage.setItem(`zenvitra_pulse_privacy_${displayHandle}`, String(nextVal));
                      } catch (_) {}
                    }
                  }}
                  className={`px-3 py-2 rounded-xl text-xs font-mono font-bold transition border cursor-pointer flex items-center gap-1.5 backdrop-blur-md ${
                    profilePrivacy
                      ? 'bg-amber-500/15 text-amber-300 border-amber-500/30 hover:bg-amber-500/25 shadow-[0_0_12px_rgba(245,158,11,0.2)]'
                      : 'bg-emerald-500/15 text-emerald-300 border-emerald-500/30 hover:bg-emerald-500/25 shadow-[0_0_12px_rgba(16,185,129,0.2)]'
                  }`}
                  title={profilePrivacy ? 'Click to make your profile Public' : 'Click to make your profile Private'}
                >
                  {profilePrivacy ? (
                    <>
                      <Lock className="w-3.5 h-3.5 text-amber-400" />
                      <span className="hidden sm:inline">PRIVATE</span>
                    </>
                  ) : (
                    <>
                      <Globe className="w-3.5 h-3.5 text-emerald-400" />
                      <span className="hidden sm:inline">PUBLIC</span>
                    </>
                  )}
                </button>
                <button
                  type="button"
                  onClick={() => setKycModalOpen(true)}
                  className={`px-3 py-2 rounded-xl text-xs font-mono font-semibold transition border cursor-pointer flex items-center gap-1.5 backdrop-blur-md ${
                    kycStatus === 'VERIFIED'
                      ? 'bg-emerald-500/10 text-emerald-300 border-emerald-500/30 hover:bg-emerald-500/20'
                      : kycStatus === 'UNDER_REVIEW'
                      ? 'bg-amber-500/10 text-amber-300 border-amber-500/30 hover:bg-amber-500/20'
                      : 'bg-white/[0.04] text-neutral-300 border-white/10 hover:bg-white/10 hover:text-white'
                  }`}
                  title="Organizer Payout KYC: Link bank account to receive event payouts"
                >
                  <Landmark className="w-3.5 h-3.5" />
                  <span className="hidden sm:inline">
                    {kycStatus === 'VERIFIED' ? 'Payout KYC Verified' : kycStatus === 'UNDER_REVIEW' ? 'KYC Under Review' : 'Host Payout KYC'}
                  </span>
                  <span className="sm:hidden">KYC</span>
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
                {/* ZenSpace linktree button */}
                <Link href={`/space/${profile.username}`}>
                  <button
                    className="px-3.5 py-2 rounded-xl bg-purple-500/10 hover:bg-purple-500/20 border border-purple-500/30 text-purple-300 hover:text-purple-200 text-xs font-bold font-mono transition flex items-center gap-1.5 backdrop-blur-md cursor-pointer"
                    title="Open Citizen's ZenSpace (Linktree)"
                  >
                    <ExternalLink className="w-3.5 h-3.5 text-purple-400" />
                    <span>ZenSpace</span>
                  </button>
                </Link>

                {/* Privacy Rule: If profile is private, outsiders CANNOT see the dashboard button */}
                {!profile.isPrivate && (
                  <Link href={`/dashboard?user=${profile.username}`}>
                    <button
                      className="px-4 py-2 rounded-xl bg-cyan-500/10 hover:bg-cyan-500/20 border border-cyan-500/30 text-xs font-bold text-cyan-300 transition cursor-pointer flex items-center gap-1.5 backdrop-blur-md"
                      title="View Sovereign Dashboard & Track Record"
                    >
                      <LayoutDashboard className="w-3.5 h-3.5 text-cyan-400" />
                      <span>Dashboard</span>
                    </button>
                  </Link>
                )}
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
        <div className="flex flex-wrap items-center justify-center gap-1.5 p-1.5 rounded-2xl bg-[#080911]/90 backdrop-blur-2xl border border-white/10 shadow-xl">
          <button
            type="button"
            onClick={() => setActiveTab('posts')}
            className={`flex-1 min-w-[90px] py-2 px-2.5 rounded-xl text-xs font-sans font-semibold tracking-normal transition-all flex items-center justify-center gap-1.5 cursor-pointer text-center ${
              activeTab === 'posts'
                ? 'bg-white text-black shadow-sm'
                : 'text-neutral-400 hover:text-white hover:bg-white/[0.04]'
            }`}
          >
            <Grid className="w-3.5 h-3.5 shrink-0" />
            <span className="truncate">Dispatches</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('reels')}
            className={`flex-1 min-w-[90px] py-2 px-2.5 rounded-xl text-xs font-sans font-semibold tracking-normal transition-all flex items-center justify-center gap-1.5 cursor-pointer text-center ${
              activeTab === 'reels'
                ? 'bg-white text-black shadow-sm'
                : 'text-neutral-400 hover:text-white hover:bg-white/[0.04]'
            }`}
          >
            <Sparkles className="w-3.5 h-3.5 shrink-0" />
            <span className="truncate">SPARK</span>
          </button>

          {/* Showcase is visible ONLY for event / professional accounts that choose to host events */}
          {isProfessionalOrEventAccount && (
            <button
              type="button"
              onClick={() => setActiveTab('events_showcase')}
              className={`flex-1 min-w-[90px] py-2 px-2.5 rounded-xl text-xs font-sans font-semibold tracking-normal transition-all flex items-center justify-center gap-1.5 cursor-pointer text-center ${
                activeTab === 'events_showcase'
                  ? 'bg-white text-black shadow-sm'
                  : 'text-neutral-400 hover:text-white hover:bg-white/[0.04]'
              }`}
            >
              <Calendar className="w-3.5 h-3.5 shrink-0" />
              <span className="truncate">Showcase</span>
              {(profile.hostedEvents || []).length > 0 && (
                <span className={`px-1.5 py-0.5 rounded-full text-[10px] font-sans font-bold shrink-0 ${
                  activeTab === 'events_showcase' ? 'bg-black text-white' : 'bg-white/10 text-white'
                }`}>
                  {(profile.hostedEvents || []).length}
                </span>
              )}
            </button>
          )}

          {isOwnProfile && (
            <button
              type="button"
              onClick={() => setActiveTab('my_tickets')}
              className={`flex-1 min-w-[90px] py-2 px-2.5 rounded-xl text-xs font-sans font-semibold tracking-normal transition-all flex items-center justify-center gap-1.5 cursor-pointer text-center ${
                activeTab === 'my_tickets'
                  ? 'bg-white text-black shadow-sm'
                  : 'text-neutral-400 hover:text-white hover:bg-white/[0.04]'
              }`}
            >
              <Ticket className="w-3.5 h-3.5 shrink-0" />
              <span className="truncate">Tickets &amp; Applications</span>
              {(userTickets.length + userApplications.length) > 0 && (
                <span className={`px-1.5 py-0.5 rounded-full text-[10px] font-mono font-bold shrink-0 ${
                  activeTab === 'my_tickets' ? 'bg-black text-white' : 'bg-white/10 text-white'
                }`}>
                  {userTickets.length + userApplications.length}
                </span>
              )}
            </button>
          )}

          {isOwnProfile && (
            <button
              type="button"
              onClick={() => setActiveTab('saved')}
              className={`flex-1 min-w-[90px] py-2 px-2.5 rounded-xl text-xs font-sans font-semibold tracking-normal transition-all flex items-center justify-center gap-1.5 cursor-pointer text-center ${
                activeTab === 'saved'
                  ? 'bg-white text-black shadow-sm'
                  : 'text-neutral-400 hover:text-white hover:bg-white/[0.04]'
              }`}
            >
              <Bookmark className="w-3.5 h-3.5 shrink-0" />
              <span className="truncate">Saved</span>
              <Lock className={`w-2.5 h-2.5 shrink-0 ${activeTab === 'saved' ? 'text-black/75' : 'text-neutral-400'}`} />
            </button>
          )}

          <button
            type="button"
            onClick={() => setActiveTab('mun_dossier')}
            className={`flex-1 min-w-[90px] py-2 px-2.5 rounded-xl text-xs font-sans font-semibold tracking-normal transition-all flex items-center justify-center gap-1.5 cursor-pointer text-center ${
              activeTab === 'mun_dossier'
                ? 'bg-white text-black shadow-sm'
                : 'text-neutral-400 hover:text-white hover:bg-white/[0.04]'
            }`}
          >
            <Award className="w-3.5 h-3.5 shrink-0" />
            <span className="truncate">Track Record</span>
          </button>
        </div>
      </div>

      {/* ─── TAB CONTENT ─── */}
      {isProfileLocked ? (
        <div className="py-20 text-center space-y-5 rounded-3xl bg-black/60 border border-white/10 p-8 max-w-xl mx-auto backdrop-blur-xl animate-fade-in shadow-2xl">
          <div className="w-16 h-16 rounded-2xl bg-amber-500/10 border border-amber-500/30 mx-auto flex items-center justify-center text-amber-400 shadow-inner">
            <Lock className="w-8 h-8" />
          </div>
          <div className="space-y-2">
            <span className="text-[10px] font-mono uppercase tracking-widest text-amber-400 font-bold bg-amber-500/10 px-2.5 py-0.5 rounded-full border border-amber-500/25">
              CONFIDENTIAL PROFILE
            </span>
            <h3 className="font-bold text-xl text-white font-display">This Account is Private</h3>
            <p className="text-xs text-neutral-400 max-w-sm mx-auto leading-relaxed">
              Follow @{displayHandle} to view their dispatches, SPARK reels, and sovereign moments.
            </p>
          </div>
          <button 
            type="button"
            onClick={() => toggleFollow(displayHandle)}
            className="px-6 py-2.5 rounded-xl bg-white hover:bg-neutral-200 text-black font-semibold text-xs transition cursor-pointer active:scale-95 shadow-lg shadow-white/10"
          >
            {following ? 'Following' : 'Follow to View'}
          </button>
        </div>
      ) : (
        <>
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

      {/* 6. YOUR TICKETS & PASSES (CONNECTED TO ZEN.EVENTS) */}
      {activeTab === 'my_tickets' && (
        <div className="py-4 space-y-5">
          {/* Section Header */}
          <div className="p-4 sm:p-5 rounded-2xl bg-[#080911] border border-white/10 backdrop-blur-xl flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <Ticket className="w-4 h-4 text-white" />
                <h3 className="font-sans font-bold text-base text-white">Your Conference Passes &amp; Staff Applications</h3>
              </div>
              <p className="text-xs text-neutral-400">
                Connected to <strong className="text-white">ZEN.EVENTS</strong>. Access your cryptographic delegate passes and track your Organising Committee &amp; Secretariat appointment applications.
              </p>
            </div>

            <div className="flex items-center gap-2.5">
              <button
                type="button"
                onClick={() => router.push('/events')}
                className="px-4 py-2 rounded-xl bg-white hover:bg-neutral-200 text-black text-xs font-sans font-semibold transition cursor-pointer flex items-center gap-1.5 shadow-sm"
              >
                <span>Browse ZEN.EVENTS</span>
                <ExternalLink className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>

          {/* Organizer Payout KYC Notice Banner */}
          <div className="p-4 rounded-2xl bg-white/[0.02] border border-white/10 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
            <div className="flex items-start sm:items-center gap-3">
              <div className="p-2 rounded-xl bg-white/5 border border-white/10 text-white shrink-0">
                <Landmark className="w-4 h-4" />
              </div>
              <div>
                <p className="font-semibold text-white">
                  Hosting an event or Model UN?
                </p>
                <p className="text-neutral-400 text-[11px]">
                  {kycStatus === 'VERIFIED'
                    ? 'Your Organizer KYC is verified. Ticket sales payouts will settle directly to your verified bank account.'
                    : kycStatus === 'UNDER_REVIEW'
                    ? 'Your KYC documents are under review. Payouts will unlock upon verification.'
                    : 'Complete Organizer Payout KYC to receive payouts when attendees purchase passes for your event.'}
                </p>
              </div>
            </div>

            <button
              type="button"
              onClick={() => setKycModalOpen(true)}
              className="px-3.5 py-2 rounded-xl bg-white/10 hover:bg-white/15 border border-white/15 text-white font-mono text-xs transition cursor-pointer shrink-0"
            >
              {kycStatus === 'VERIFIED' ? 'View KYC Status' : 'Set Up Payout KYC'}
            </button>
          </div>

          {/* Sub-Tab Switcher: Passes & Tickets vs Staff & Secretariat Applications */}
          <div className="flex items-center gap-2 border-b border-white/10 pb-3">
            <button
              type="button"
              onClick={() => setTicketsSubTab('passes')}
              className={`px-4 py-2 rounded-xl text-xs font-semibold font-sans transition flex items-center gap-2 cursor-pointer ${
                ticketsSubTab === 'passes'
                  ? 'bg-white text-black shadow-sm'
                  : 'text-neutral-400 hover:text-white bg-white/5'
              }`}
            >
              <Ticket className="w-3.5 h-3.5" />
              <span>Conference Passes ({userTickets.length})</span>
            </button>

            <button
              type="button"
              onClick={() => setTicketsSubTab('applications')}
              className={`px-4 py-2 rounded-xl text-xs font-semibold font-sans transition flex items-center gap-2 cursor-pointer ${
                ticketsSubTab === 'applications'
                  ? 'bg-white text-black shadow-sm'
                  : 'text-neutral-400 hover:text-white bg-white/5'
              }`}
            >
              <Briefcase className="w-3.5 h-3.5" />
              <span>Staff &amp; Secretariat Applications ({userApplications.length})</span>
            </button>
          </div>

          {/* ── PASSES SUB-TAB ── */}
          {ticketsSubTab === 'passes' && (
            <div className="space-y-4">
              {/* Loading Skeleton */}
              {loadingTickets && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {[1, 2].map((i) => (
                    <div key={i} className="p-5 rounded-2xl bg-[#090a12] border border-white/5 animate-pulse space-y-3">
                      <div className="h-4 bg-white/10 rounded w-1/3" />
                      <div className="h-6 bg-white/10 rounded w-2/3" />
                      <div className="h-20 bg-white/5 rounded" />
                    </div>
                  ))}
                </div>
              )}

              {/* Empty State */}
              {!loadingTickets && userTickets.length === 0 && (
                <div className="py-16 text-center space-y-4 rounded-3xl bg-[#080911] border border-white/10 p-8 max-w-xl mx-auto">
                  <div className="w-14 h-14 rounded-2xl bg-white/5 border border-white/10 mx-auto flex items-center justify-center text-white">
                    <Ticket className="w-7 h-7" />
                  </div>
                  <div className="space-y-1">
                    <h4 className="font-sans font-bold text-lg text-white">No Conference Passes Found</h4>
                    <p className="text-xs text-neutral-400 max-w-sm mx-auto leading-relaxed">
                      You don't have any registered conference tickets yet. When you register or purchase delegate passes on ZEN.EVENTS, your QR entry tokens and committee passes will appear here.
                    </p>
                  </div>
                  <div className="pt-2">
                    <button
                      type="button"
                      onClick={() => router.push('/events')}
                      className="px-5 py-2.5 rounded-xl bg-white hover:bg-neutral-200 text-black font-sans font-semibold text-xs transition cursor-pointer shadow-sm"
                    >
                      Explore Upcoming Conferences
                    </button>
                  </div>
                </div>
              )}

              {/* Tickets List */}
              {!loadingTickets && userTickets.length > 0 && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {userTickets.map((ticket) => {
                    const isValid = ticket.status === 'VALID';
                    const isCheckedIn = ticket.status === 'CHECKED_IN';
                    
                    return (
                      <div
                        key={ticket.id || ticket.ticketNumber}
                        className="p-5 rounded-2xl bg-[#090a12] border border-white/10 hover:border-white/20 transition-all flex flex-col justify-between space-y-4 shadow-lg"
                      >
                        {/* Top Row: Tier and Status */}
                        <div className="flex items-center justify-between">
                          <span className="text-[11px] font-mono font-bold px-2.5 py-1 rounded-lg bg-white/10 text-white border border-white/10">
                            {ticket.tierName || 'Delegate Pass'}
                          </span>
                          <span className={`text-[10px] font-mono font-bold px-2.5 py-0.5 rounded-full border ${
                            isCheckedIn
                              ? 'bg-blue-500/10 text-blue-300 border-blue-500/20'
                              : isValid
                              ? 'bg-emerald-500/10 text-emerald-300 border-emerald-500/20'
                              : 'bg-white/5 text-neutral-400 border-white/10'
                          }`}>
                            {ticket.status || 'VALID'}
                          </span>
                        </div>

                        {/* Conference Title and Details */}
                        <div className="space-y-1.5">
                          <h4 className="font-sans font-bold text-base text-white leading-snug">
                            {ticket.eventTitle || 'Conference Pass'}
                          </h4>
                          <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-neutral-400 font-mono">
                            <span>Attendee: <strong className="text-white">{ticket.attendeeName}</strong></span>
                            {ticket.price !== undefined && (
                              <span>Paid: <strong className="text-white">{ticket.price > 0 ? `₹${ticket.price}` : 'Free Entry'}</strong></span>
                            )}
                          </div>
                        </div>

                        {/* QR Code / Pass Token Chamber Badge */}
                        <div className="p-3.5 rounded-xl bg-black/60 border border-white/5 space-y-2">
                          <div className="flex items-center justify-between text-[11px] font-mono text-neutral-400">
                            <span className="flex items-center gap-1.5">
                              <QrCode className="w-3.5 h-3.5 text-white" />
                              <span>PASS TOKEN</span>
                            </span>
                            <span className="text-white font-bold">{ticket.ticketNumber}</span>
                          </div>
                          <div className="font-mono text-[10px] text-neutral-300 bg-white/5 p-2 rounded-lg break-all select-all border border-white/5">
                            {ticket.qrCodeToken || ticket.securityHash || 'ZEN-TICKET-AUTHENTICATED'}
                          </div>
                        </div>

                        {/* Actions */}
                        <div className="flex items-center gap-2 pt-1 border-t border-white/5">
                          <button
                            type="button"
                            onClick={() => router.push('/events')}
                            className="flex-1 py-2 px-3 rounded-xl bg-white hover:bg-neutral-200 text-black text-xs font-sans font-semibold transition cursor-pointer flex items-center justify-center gap-1.5"
                          >
                            <span>View on ZEN.EVENTS</span>
                            <ExternalLink className="w-3.5 h-3.5" />
                          </button>
                          <button
                            type="button"
                            onClick={() => {
                              if (typeof navigator !== 'undefined') {
                                navigator.clipboard.writeText(ticket.ticketNumber || ticket.qrCodeToken);
                              }
                            }}
                            className="py-2 px-3 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-white text-xs font-mono transition cursor-pointer"
                            title="Copy Ticket ID"
                          >
                            <Copy className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          )}

          {/* ── APPLICATIONS SUB-TAB ── */}
          {ticketsSubTab === 'applications' && (
            <div className="space-y-4">
              {/* Loading Skeleton */}
              {loadingApplications && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {[1, 2].map((i) => (
                    <div key={i} className="p-5 rounded-2xl bg-[#090a12] border border-white/5 animate-pulse space-y-3">
                      <div className="h-4 bg-white/10 rounded w-1/3" />
                      <div className="h-6 bg-white/10 rounded w-2/3" />
                      <div className="h-20 bg-white/5 rounded" />
                    </div>
                  ))}
                </div>
              )}

              {/* Empty State */}
              {!loadingApplications && userApplications.length === 0 && (
                <div className="py-16 text-center space-y-4 rounded-3xl bg-[#080911] border border-white/10 p-8 max-w-xl mx-auto">
                  <div className="w-14 h-14 rounded-2xl bg-white/5 border border-white/10 mx-auto flex items-center justify-center text-white">
                    <Briefcase className="w-7 h-7" />
                  </div>
                  <div className="space-y-1">
                    <h4 className="font-sans font-bold text-lg text-white">No Staff Applications Found</h4>
                    <p className="text-xs text-neutral-400 max-w-sm mx-auto leading-relaxed">
                      You haven't applied for any Organising Committee, Executive Board, or Secretariat posts yet. Browse open recruitments on ZEN.EVENTS to discover leadership opportunities.
                    </p>
                  </div>
                  <div className="pt-2">
                    <button
                      type="button"
                      onClick={() => router.push('/events')}
                      className="px-5 py-2.5 rounded-xl bg-white hover:bg-neutral-200 text-black font-sans font-semibold text-xs transition cursor-pointer shadow-sm"
                    >
                      Explore Open Staff Positions
                    </button>
                  </div>
                </div>
              )}

              {/* Applications List */}
              {!loadingApplications && userApplications.length > 0 && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {userApplications.map((app) => {
                    const status = app.status;
                    const isOffer = status === 'OFFER_SENT';
                    const isAccepted = status === 'ACCEPTED';
                    const isInterview = status === 'INTERVIEW';
                    const isDeclined = status === 'DECLINED';
                    const isShortlisted = status === 'SHORTLISTED';

                    return (
                      <div
                        key={app.id || app.applicationNumber}
                        className={`p-5 rounded-2xl bg-[#090a12] border transition-all flex flex-col justify-between space-y-4 shadow-lg ${
                          isOffer
                            ? 'border-white/40 ring-1 ring-white/20'
                            : isAccepted
                            ? 'border-emerald-500/40 bg-emerald-950/[0.05]'
                            : 'border-white/10 hover:border-white/20'
                        }`}
                      >
                        {/* Top Row: Department and Status Pill */}
                        <div className="flex items-center justify-between gap-2">
                          <span className="text-[11px] font-mono font-bold px-2.5 py-1 rounded-lg bg-white/10 text-white border border-white/10 truncate">
                            {app.post?.department || 'Executive Team'}
                          </span>
                          <span
                            className={`text-[10px] font-mono font-bold px-2.5 py-0.5 rounded-full border shrink-0 ${
                              isOffer
                                ? 'bg-white text-black border-white animate-pulse'
                                : isAccepted
                                ? 'bg-emerald-500/15 text-emerald-300 border-emerald-500/30'
                                : isInterview
                                ? 'bg-blue-500/15 text-blue-300 border-blue-500/30'
                                : isShortlisted
                                ? 'bg-purple-500/15 text-purple-300 border-purple-500/30'
                                : isDeclined
                                ? 'bg-red-500/15 text-red-300 border-red-500/30'
                                : 'bg-white/5 text-neutral-400 border-white/10'
                            }`}
                          >
                            {isOffer
                              ? '● Offer Received'
                              : isAccepted
                              ? '● Confirmed Appointed'
                              : isInterview
                              ? '● Interview Scheduled'
                              : isShortlisted
                              ? '● Shortlisted'
                              : status}
                          </span>
                        </div>

                        {/* Post Title & Conference */}
                        <div className="space-y-1.5">
                          <h4 className="font-sans font-bold text-base text-white leading-snug">
                            {app.post?.title || app.offerRole || 'Event Post'}
                          </h4>
                          <p className="text-xs text-neutral-300 font-sans">
                            {app.event?.title || 'Conference Convening'}
                          </p>
                          <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-neutral-400 font-mono pt-1">
                            <span>Ref: <strong className="text-white">{app.applicationNumber}</strong></span>
                            <span>Applied: {new Date(app.submittedAt).toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' })}</span>
                          </div>
                        </div>

                        {/* Interview Details if Scheduled */}
                        {isInterview && app.interviewDate && (
                          <div className="p-3.5 rounded-xl bg-blue-500/10 border border-blue-500/20 space-y-2">
                            <div className="flex items-center justify-between text-xs text-blue-300 font-mono">
                              <span className="flex items-center gap-1.5">
                                <Calendar className="w-3.5 h-3.5 text-blue-400" />
                                <span>Interview Scheduled</span>
                              </span>
                              <span className="font-bold">
                                {new Date(app.interviewDate).toLocaleString(undefined, {
                                  month: 'short',
                                  day: 'numeric',
                                  hour: '2-digit',
                                  minute: '2-digit',
                                })}
                              </span>
                            </div>
                            {app.interviewMeetingUrl && (
                              <a
                                href={app.interviewMeetingUrl}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="inline-flex items-center gap-1.5 text-xs text-white bg-blue-600 hover:bg-blue-500 font-bold px-3 py-1.5 rounded-lg transition"
                              >
                                <span>Join Interview Meeting</span>
                                <ExternalLink className="w-3 h-3" />
                              </a>
                            )}
                          </div>
                        )}

                        {/* Appointment Offer Callout Banner */}
                        {isOffer && (
                          <div className="p-3.5 rounded-xl bg-white/[0.04] border border-white/20 space-y-3">
                            <div className="space-y-1">
                              <p className="text-xs text-white font-bold">
                                Formal Appointment Offer Extended
                              </p>
                              <p className="text-[11px] text-neutral-300">
                                The event leadership has officially selected you for the role of{' '}
                                <strong className="text-white">{app.offerRole || app.post?.title}</strong>.
                              </p>
                            </div>
                            <div className="flex items-center gap-2 pt-1">
                              <button
                                type="button"
                                disabled={respondingAppId === app.id}
                                onClick={() => handleRespondToOffer(app.id, 'ACCEPT')}
                                className="flex-1 py-2 px-3 rounded-xl bg-white hover:bg-neutral-200 text-black text-xs font-bold transition cursor-pointer flex items-center justify-center gap-1.5 shadow-sm disabled:opacity-50"
                              >
                                <Check className="w-3.5 h-3.5 text-black" />
                                <span>{respondingAppId === app.id ? 'Confirming...' : 'Accept Appointment'}</span>
                              </button>
                              <button
                                type="button"
                                disabled={respondingAppId === app.id}
                                onClick={() => handleRespondToOffer(app.id, 'DECLINE')}
                                className="py-2 px-3 rounded-xl bg-white/5 hover:bg-white/10 border border-white/15 text-neutral-300 hover:text-white text-xs font-medium transition cursor-pointer disabled:opacity-50"
                              >
                                Decline
                              </button>
                            </div>
                          </div>
                        )}

                        {/* Footer Actions */}
                        <div className="flex items-center gap-2 pt-1 border-t border-white/5">
                          <button
                            type="button"
                            onClick={() => router.push(`/events/${app.eventId}/recruit`)}
                            className="flex-1 py-2 px-3 rounded-xl bg-white/10 hover:bg-white/15 text-white text-xs font-sans font-semibold transition cursor-pointer flex items-center justify-center gap-1.5"
                          >
                            <span>View Recruitment Portal</span>
                            <ExternalLink className="w-3.5 h-3.5" />
                          </button>
                          <button
                            type="button"
                            onClick={() => {
                              if (typeof navigator !== 'undefined') {
                                navigator.clipboard.writeText(app.applicationNumber);
                              }
                            }}
                            className="py-2 px-3 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-white text-xs font-mono transition cursor-pointer"
                            title="Copy Application Number"
                          >
                            <Copy className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          )}
        </div>
      )}
      </>
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
                  <div className="w-9 h-9 rounded-full bg-gradient-to-tr from-cyan-400 via-teal-400 to-blue-500 p-[1.5px] shrink-0">
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
                    <label className="px-3.5 py-1.5 rounded-lg bg-white text-black text-xs font-semibold hover:bg-zinc-200 transition cursor-pointer flex items-center gap-1.5">
                      <Upload className="w-3.5 h-3.5" />
                      <span>Upload Image</span>
                      <input type="file" accept="image/*" onChange={handleAvatarFileUpload} className="hidden" />
                    </label>
                    {editAvatar && (
                      <button
                        type="button"
                        onClick={() => setEditAvatar('')}
                        className="text-xs text-rose-400 hover:underline cursor-pointer"
                      >
                        Remove
                      </button>
                    )}
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

              {/* Account Privacy Setting */}
              <div className="p-4 rounded-2xl bg-zinc-950 border border-zinc-800 flex items-center justify-between gap-3">
                <div className="space-y-0.5">
                  <div className="flex items-center gap-2">
                    {editIsPrivate ? <Lock className="w-4 h-4 text-amber-400" /> : <Globe className="w-4 h-4 text-emerald-400" />}
                    <span className="text-xs font-bold text-white">
                      {editIsPrivate ? 'Private Sovereign Account' : 'Public Sovereign Account'}
                    </span>
                  </div>
                  <p className="text-[11px] text-zinc-400 leading-relaxed">
                    {editIsPrivate
                      ? 'Only approved followers can view your dispatches, SPARK reels, and profile content.'
                      : 'Anyone on ZENVITRA can view your dispatches, SPARK reels, and sovereign profile.'}
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => setEditIsPrivate(!editIsPrivate)}
                  className={`px-3 py-1.5 rounded-xl text-xs font-mono font-bold transition border cursor-pointer shrink-0 ${
                    editIsPrivate
                      ? 'bg-amber-500/15 text-amber-300 border-amber-500/30 hover:bg-amber-500/25'
                      : 'bg-emerald-500/15 text-emerald-300 border-emerald-500/30 hover:bg-emerald-500/25'
                  }`}
                >
                  {editIsPrivate ? 'Make Public' : 'Make Private'}
                </button>
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
                <div className="mt-2">
                  <label className="w-full py-2.5 px-3 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-white text-xs font-mono transition cursor-pointer flex items-center justify-center gap-2">
                    <Upload className="w-3.5 h-3.5 text-cyan-400" />
                    <span>Upload Image from Device</span>
                    <input
                      type="file"
                      accept="image/*"
                      onChange={(e) => {
                        const file = e.target.files?.[0];
                        if (file) {
                          const reader = new FileReader();
                          reader.onload = (evt) => {
                            if (evt.target?.result) {
                              setNewEventCoverImage(evt.target.result as string);
                            }
                          };
                          reader.readAsDataURL(file);
                        }
                      }}
                      className="hidden"
                    />
                  </label>
                </div>
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
                  <span className="text-zinc-400 text-[11px] block">Subscription Status</span>
                  <strong className="text-white text-sm font-bold">
                    {profile.isSubscribedOrganizer ? 'Active (Cashfree Verified)' : 'Upgrade via /pricing'}
                  </strong>
                </div>
                {profile.isSubscribedOrganizer ? (
                  <div className="px-4 py-2 rounded-xl bg-emerald-500/20 border border-emerald-500/50 text-emerald-300 font-bold text-xs flex items-center gap-1.5">
                    <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                    <span>Unlocked</span>
                  </div>
                ) : (
                  <Link
                    href="/pricing"
                    onClick={() => setShowOrganizerModal(false)}
                    className="px-6 py-2.5 rounded-xl bg-white hover:bg-neutral-200 text-black font-bold text-xs transition flex items-center gap-1.5 shadow-sm"
                  >
                    <span>Upgrade on /pricing</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </Link>
                )}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ─── ORGANIZER KYC MODAL ─── */}
      <OrganizerKycModal
        isOpen={kycModalOpen}
        onClose={() => setKycModalOpen(false)}
        userId={authUser?.id || effectiveMyUsername}
        userEmail={authProfile?.email || authUser?.email || ''}
        userHandle={effectiveMyUsername}
        onSuccess={() => {
          setKycStatus('VERIFIED');
        }}
      />

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


    </div>
  );
}

