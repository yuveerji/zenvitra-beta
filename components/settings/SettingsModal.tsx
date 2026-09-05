'use client';

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  X,
  User,
  Shield,
  Lock,
  Bell,
  Palette,
  Database,
  Check,
  Smartphone,
  Eye,
  EyeOff,
  LogOut,
  RefreshCw,
  Sparkles,
  ExternalLink,
  ChevronRight,
  ShieldCheck,
  Key,
  Globe,
  Sliders,
  Camera,
  Layers,
  HelpCircle,
  AlertTriangle,
  Bookmark,
  Heart,
  MessageCircle
} from 'lucide-react';
import { useAuth } from '@/context/AuthContext';
import { useZenPulse } from '@/context/ZenPulsePlatformContext';
import { getSecurityProfile, regenerateSovereignCode } from '@/lib/securityShield';
import { UsernameAvailabilityButton } from '@/components/auth/UsernameAvailabilityButton';
import { DATA_LIFECYCLE_EXPLAINERS, DataLifecycleExplainer } from '@/lib/legalData';
import {
  Bot,
  Gavel,
  FileText,
  Newspaper,
  CreditCard,
  Film,
  Clock,
  Scale,
  CheckCircle2,
  Info
} from 'lucide-react';

interface SettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
  onOpenSecurityShield?: () => void;
}

type SettingsTab = 'account' | 'privacy' | 'security' | 'notifications' | 'appearance' | 'data' | 'saved';

export function SettingsModal({
  isOpen,
  onClose,
  onOpenSecurityShield,
}: SettingsModalProps) {
  const { profile, user, updateProfile, signOut } = useAuth();
  const { myProfile, updateMyProfile, currentUserUsername, currentUserName, savedPosts, toggleSavePost } = useZenPulse();

  const [activeTab, setActiveTab] = useState<SettingsTab>('account');
  const [saveStatus, setSaveStatus] = useState<'idle' | 'saving' | 'saved' | 'error'>('idle');
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  // Form Fields
  const [displayName, setDisplayName] = useState('');
  const [username, setUsername] = useState('');
  const [bio, setBio] = useState('');
  const [website, setWebsite] = useState('');
  const [location, setLocation] = useState('');
  const [avatar, setAvatar] = useState('');

  // Preference Toggles
  const [isPrivate, setIsPrivate] = useState(false);
  const [showActiveStatus, setShowActiveStatus] = useState(true);
  const [readReceipts, setReadReceipts] = useState(true);
  const [dmPermission, setDmPermission] = useState<'everyone' | 'followers' | 'verified'>('everyone');
  const [searchVisibility, setSearchVisibility] = useState(true);
  const [mentionControl, setMentionControl] = useState<'everyone' | 'followers' | 'none'>('followers');
  const [tagControl, setTagControl] = useState<'everyone' | 'followers' | 'none'>('followers');
  const [aiPersonalization, setAiPersonalization] = useState(true);
  const [aiDocumentAccess, setAiDocumentAccess] = useState(true);
  const [munVisibility, setMunVisibility] = useState<'secretariat_only' | 'committee' | 'public'>('secretariat_only');
  const [munAwardsPublic, setMunAwardsPublic] = useState(true);
  const [certifyPublic, setCertifyPublic] = useState(true);
  const [selectedExplainerId, setSelectedExplainerId] = useState<string>('mun-attendance-scoring');

  // Notifications
  const [notifyMentions, setNotifyMentions] = useState(true);
  const [notifyDirectMessages, setNotifyDirectMessages] = useState(true);
  const [notifySummits, setNotifySummits] = useState(true);
  const [notifyPressWires, setNotifyPressWires] = useState(true);
  const [soundEffects, setSoundEffects] = useState(true);

  // Appearance
  const [themeMode, setThemeMode] = useState<'obsidian' | 'matrix' | 'cyan'>('obsidian');
  const [compactMode, setCompactMode] = useState(false);
  const [highContrast, setHighContrast] = useState(false);

  // Sovereign Code state
  const [sovereignCode, setSovereignCode] = useState('');
  const [copiedCode, setCopiedCode] = useState(false);

  // Hydrate local state from profile / session
  useEffect(() => {
    if (isOpen) {
      const stored = typeof window !== 'undefined' ? (() => {
        try { return JSON.parse(localStorage.getItem('zenvitra_session_user') || '{}'); } catch (_) { return {}; }
      })() : {};

      const effName = profile?.display_name || (profile as any)?.name || stored?.display_name || stored?.name || currentUserName || myProfile?.name || '';
      const effUser = profile?.username || (profile as any)?.handle || stored?.username || stored?.handle || currentUserUsername || myProfile?.username || '';
      const effBio = profile?.bio || stored?.bio || myProfile?.bio || '';
      const effAvatar = profile?.avatar_url || (profile as any)?.avatar || stored?.avatar_url || stored?.avatar || myProfile?.avatar || '';

      const uId = profile?.id || user?.id || stored?.id || effUser || 'active_session';
      const sec = getSecurityProfile(uId);
      setSovereignCode(sec.twoFactorSecret || '');

      setDisplayName(effName);
      setUsername(effUser);
      setBio(effBio);
      setAvatar(effAvatar);
      setIsPrivate(Boolean(myProfile?.isPrivate));
      setSaveStatus('idle');
      setErrorMessage(null);
    }
  }, [isOpen, profile, user, myProfile, currentUserName, currentUserUsername]);

  const handleAvatarUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setAvatar(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSaveAccountSettings = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaveStatus('saving');
    setErrorMessage(null);

    try {
      const cleanName = displayName.trim();
      const cleanUser = username.trim().toLowerCase().replace(/[^a-z0-9_.]/g, '');

      // 1. Update Pulse Profile State
      updateMyProfile({
        name: cleanName,
        bio: bio.trim(),
        avatar: avatar.trim(),
        website: website.trim(),
        location: location.trim(),
        isPrivate,
      });

      // 2. Update Auth Context Profile State
      await updateProfile({
        display_name: cleanName,
        username: cleanUser,
        bio: bio.trim(),
        avatar_url: avatar.trim(),
      });

      // 3. Update localStorage session
      try {
        const stored = JSON.parse(localStorage.getItem('zenvitra_session_user') || '{}');
        const nextUser = {
          ...stored,
          display_name: cleanName,
          name: cleanName,
          username: cleanUser,
          bio: bio.trim(),
          avatar_url: avatar.trim(),
        };
        localStorage.setItem('zenvitra_session_user', JSON.stringify(nextUser));
      } catch (_) {}

      setSaveStatus('saved');
      setTimeout(() => {
        setSaveStatus('idle');
      }, 2500);
    } catch (err: any) {
      setSaveStatus('error');
      setErrorMessage(err.message || 'Failed to save settings.');
    }
  };

  const handleExportData = () => {
    try {
      const exportObject = {
        exportedAt: new Date().toISOString(),
        user: {
          id: profile?.id || user?.id,
          username,
          displayName,
          bio,
          email: profile?.email || user?.email,
          role: profile?.role || 'delegate',
        },
        platform: 'Zenvitra Sovereign Network State',
      };

      const dataStr = 'data:text/json;charset=utf-8,' + encodeURIComponent(JSON.stringify(exportObject, null, 2));
      const downloadAnchor = document.createElement('a');
      downloadAnchor.setAttribute('href', dataStr);
      downloadAnchor.setAttribute('download', `zenvitra_archive_${username || 'user'}.json`);
      document.body.appendChild(downloadAnchor);
      downloadAnchor.click();
      downloadAnchor.remove();
    } catch (err) {
      alert('Error exporting data.');
    }
  };

  if (!isOpen) return null;

  const navTabs: { id: SettingsTab; label: string; icon: React.ComponentType<{ className?: string }> }[] = [
    { id: 'account', label: 'Account & Identity', icon: User },
    { id: 'privacy', label: 'Privacy Center', icon: Lock },
    { id: 'security', label: 'Security Shield & 2FA', icon: ShieldCheck },
    { id: 'notifications', label: 'Notifications', icon: Bell },
    { id: 'appearance', label: 'Theme & Display', icon: Palette },
    { id: 'data', label: 'Data & Sovereignty', icon: Database },
    { id: 'saved', label: 'Saved', icon: Bookmark },
  ];

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-[100] overflow-y-auto flex flex-col justify-start sm:justify-center items-center p-3 sm:p-6">
        {/* Backdrop */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          className="absolute inset-0 bg-black/80 backdrop-blur-md"
        />

        {/* Modal Container */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 10 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 10 }}
          transition={{ duration: 0.2, ease: [0.16, 1, 0.3, 1] }}
          className="relative w-full max-w-4xl h-[90vh] max-h-[720px] rounded-3xl bg-[#090a0d] border border-white/10 shadow-2xl flex flex-col md:flex-row overflow-hidden text-white font-sans z-10"
        >
          {/* Left Navigation Sidebar */}
          <div className="w-full md:w-64 border-b md:border-b-0 md:border-r border-white/10 p-5 flex flex-col justify-between bg-black/40">
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2.5">
                  <div className="w-8 h-8 rounded-xl bg-purple-500/10 border border-purple-500/30 flex items-center justify-center text-purple-400">
                    <Sliders className="w-4 h-4" />
                  </div>
                  <div>
                    <h2 className="font-bold text-sm text-white">Settings</h2>
                    <p className="text-[10px] text-zinc-400 font-mono">Platform Preferences</p>
                  </div>
                </div>
                <button
                  onClick={onClose}
                  className="md:hidden p-1.5 rounded-lg text-zinc-400 hover:text-white hover:bg-white/5"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Navigation Links */}
              <nav className="space-y-1">
                {navTabs.map((t) => {
                  const Icon = t.icon;
                  const isActive = activeTab === t.id;
                  return (
                    <button
                      key={t.id}
                      onClick={() => setActiveTab(t.id)}
                      className={`w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs font-semibold transition cursor-pointer text-left ${
                        isActive
                          ? 'bg-purple-500/15 text-purple-300 border border-purple-500/30 shadow-[0_0_15px_rgba(168,85,247,0.1)]'
                          : 'text-zinc-400 hover:text-white hover:bg-white/5 border border-transparent'
                      }`}
                    >
                      <Icon className={`w-4 h-4 ${isActive ? 'text-purple-400' : 'text-zinc-500'}`} />
                      <span>{t.label}</span>
                    </button>
                  );
                })}
              </nav>
            </div>

            {/* Bottom Actions */}
            <div className="pt-4 border-t border-white/10 space-y-2">
              <button
                onClick={() => {
                  signOut();
                  onClose();
                }}
                className="w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs font-semibold text-rose-400 hover:bg-rose-500/10 transition cursor-pointer"
              >
                <LogOut className="w-4 h-4" />
                <span>Sign Out</span>
              </button>
            </div>
          </div>

          {/* Right Content Area */}
          <div className="flex-1 flex flex-col h-full overflow-hidden bg-[#060709]">
            {/* Header with Close button */}
            <div className="px-6 py-4 border-b border-white/10 flex items-center justify-between">
              <div className="space-y-0.5">
                <h3 className="font-bold text-base text-white">
                  {navTabs.find((t) => t.id === activeTab)?.label}
                </h3>
                <p className="text-xs text-zinc-400 font-sans">
                  {activeTab === 'saved'
                    ? 'Review and manage your bookmarked dispatches and directives.'
                    : activeTab === 'data'
                    ? 'Manage your personal archive, cryptographic keys, and sovereign data export.'
                    : 'Manage your sovereign preferences, identity, and security parameters.'}
                </p>
              </div>
              <button
                onClick={onClose}
                className="hidden md:flex p-1.5 rounded-lg text-zinc-400 hover:text-white hover:bg-white/10 transition cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Scrollable Form Body */}
            <div className="flex-1 p-6 overflow-y-auto space-y-6 text-left">
              {/* TAB 1: ACCOUNT & IDENTITY */}
              {activeTab === 'account' && (
                <form onSubmit={handleSaveAccountSettings} className="space-y-6">
                  {/* Avatar Upload */}
                  <div className="flex items-center gap-5 p-4 rounded-2xl bg-white/[0.02] border border-white/5">
                    <div className="relative w-16 h-16 rounded-full p-[2px] bg-gradient-to-tr from-amber-400 via-rose-500 to-fuchsia-600 shrink-0">
                      <div className="w-full h-full rounded-full bg-black overflow-hidden flex items-center justify-center font-bold text-xl uppercase">
                        {avatar ? (
                          <img src={avatar} alt={displayName} className="w-full h-full object-cover" />
                        ) : (
                          (displayName || username || 'U').charAt(0).toUpperCase()
                        )}
                      </div>
                    </div>
                    <div className="space-y-1.5 flex-1">
                      <label className="text-xs font-bold text-white block">Profile Avatar</label>
                      <div className="flex items-center gap-3">
                        <label className="px-3.5 py-1.5 rounded-lg bg-zinc-800 hover:bg-zinc-700 border border-zinc-700 text-xs font-semibold text-white transition cursor-pointer flex items-center gap-2">
                          <Camera className="w-3.5 h-3.5" />
                          <span>Upload Image</span>
                          <input type="file" accept="image/*" onChange={handleAvatarUpload} className="hidden" />
                        </label>
                        {avatar && (
                          <button
                            type="button"
                            onClick={() => setAvatar('')}
                            className="text-xs text-rose-400 hover:underline cursor-pointer"
                          >
                            Remove
                          </button>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Form Inputs Grid */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="space-y-1.5">
                      <label className="text-xs font-semibold text-zinc-300">Display Name</label>
                      <input
                        type="text"
                        value={displayName}
                        onChange={(e) => setDisplayName(e.target.value)}
                        placeholder="e.g. Alex Vance"
                        className="w-full px-3.5 py-2.5 rounded-xl bg-zinc-900 border border-white/10 text-white text-xs focus:outline-none focus:border-purple-500 transition"
                        required
                      />
                    </div>

                    <div className="space-y-1.5">
                      <div className="flex items-center justify-between">
                        <label className="text-xs font-semibold text-zinc-300">Username Handle</label>
                      </div>
                      <div className="relative flex items-center">
                        <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-zinc-500 text-xs font-mono pointer-events-none">@</span>
                        <input
                          type="text"
                          value={username}
                          onChange={(e) => setUsername(e.target.value.toLowerCase().replace(/[^a-z0-9_.]/g, ''))}
                          placeholder="username"
                          className="w-full pl-8 pr-28 py-2.5 rounded-xl bg-zinc-900 border border-white/10 text-white text-xs font-mono focus:outline-none focus:border-purple-500 transition"
                          required
                        />
                        <div className="absolute right-1.5 top-1/2 -translate-y-1/2">
                          <UsernameAvailabilityButton 
                            username={username} 
                            currentUsername={profile?.username || currentUserUsername || 'yuveer'} 
                          />
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-xs font-semibold text-zinc-300">Bio / Statement of Intent</label>
                    <textarea
                      value={bio}
                      onChange={(e) => setBio(e.target.value)}
                      rows={3}
                      placeholder="Share your background, research initiatives, or areas of interest..."
                      className="w-full px-3.5 py-2.5 rounded-xl bg-zinc-900 border border-white/10 text-white text-xs focus:outline-none focus:border-purple-500 transition resize-none"
                    />
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="space-y-1.5">
                      <label className="text-xs font-semibold text-zinc-300">Website / Portfolio</label>
                      <input
                        type="text"
                        value={website}
                        onChange={(e) => setWebsite(e.target.value)}
                        placeholder="https://..."
                        className="w-full px-3.5 py-2.5 rounded-xl bg-zinc-900 border border-white/10 text-white text-xs focus:outline-none focus:border-purple-500 transition"
                      />
                    </div>
                    <div className="space-y-1.5">
                      <label className="text-xs font-semibold text-zinc-300">Location / Delegation Matrix</label>
                      <input
                        type="text"
                        value={location}
                        onChange={(e) => setLocation(e.target.value)}
                        placeholder="e.g. New Delhi, India"
                        className="w-full px-3.5 py-2.5 rounded-xl bg-zinc-900 border border-white/10 text-white text-xs focus:outline-none focus:border-purple-500 transition"
                      />
                    </div>
                  </div>

                  {errorMessage && (
                    <div className="p-3 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-400 text-xs flex items-center gap-2">
                      <AlertTriangle className="w-4 h-4 shrink-0" />
                      <span>{errorMessage}</span>
                    </div>
                  )}

                  <div className="pt-2 flex items-center justify-between border-t border-white/5">
                    <span className="text-xs text-zinc-500 font-mono">Changes update instantly across all subsystems</span>
                    <button
                      type="submit"
                      disabled={saveStatus === 'saving'}
                      className="px-6 py-2.5 rounded-xl bg-purple-600 hover:bg-purple-500 text-white text-xs font-bold transition flex items-center gap-2 shadow-[0_0_20px_rgba(168,85,247,0.3)] cursor-pointer disabled:opacity-50"
                    >
                      {saveStatus === 'saving' ? (
                        <>
                          <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                          <span>Saving...</span>
                        </>
                      ) : saveStatus === 'saved' ? (
                        <>
                          <Check className="w-3.5 h-3.5 text-emerald-300" />
                          <span>Saved Successfully!</span>
                        </>
                      ) : (
                        <span>Save Changes</span>
                      )}
                    </button>
                  </div>
                </form>
              )}

              {/* TAB 2: PRIVACY & DATA GOVERNANCE CENTER */}
              {activeTab === 'privacy' && (
                <div className="space-y-6">
                  {/* Privacy Center Header */}
                  <div className="p-4 rounded-2xl bg-gradient-to-r from-emerald-500/10 via-cyan-500/5 to-transparent border border-emerald-500/20 flex flex-wrap items-center justify-between gap-3">
                    <div className="space-y-1">
                      <div className="inline-flex items-center gap-2 text-emerald-400 font-mono text-[10px] font-bold uppercase">
                        <ShieldCheck className="w-3.5 h-3.5" />
                        <span>SOVEREIGN PRIVACY CENTER // DPDP 2025 &amp; IT RULES 2026</span>
                      </div>
                      <h3 className="font-bold text-sm text-white">Your Privacy Controls &amp; Data Rights</h3>
                      <p className="text-[11px] text-neutral-400">
                        Manage visibility, AI boundaries, MUN disclosures, and inspect live data lifecycles.
                      </p>
                    </div>
                    <a
                      href="/privacy"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white/10 hover:bg-white/15 border border-white/20 text-white text-xs font-mono transition"
                    >
                      <span>Full 73 Clauses</span>
                      <ExternalLink className="w-3 h-3" />
                    </a>
                  </div>

                  {/* 1. ACCOUNT & VISIBILITY PRIVACY */}
                  <div className="space-y-3">
                    <h4 className="font-mono text-xs font-bold text-neutral-300 uppercase tracking-wider flex items-center gap-2">
                      <User className="w-3.5 h-3.5 text-purple-400" />
                      <span>Account &amp; Discovery Privacy</span>
                    </h4>

                    <div className="p-4 rounded-2xl bg-white/[0.02] border border-white/5 flex items-center justify-between gap-4">
                      <div className="space-y-0.5">
                        <h5 className="font-bold text-xs text-white">Private Profile</h5>
                        <p className="text-[11px] text-zinc-400">Only approved delegates can view your full portfolio and dispatches.</p>
                      </div>
                      <button
                        type="button"
                        onClick={() => setIsPrivate(!isPrivate)}
                        className={`relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none ${
                          isPrivate ? 'bg-purple-600' : 'bg-zinc-800'
                        }`}
                      >
                        <span className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out ${isPrivate ? 'translate-x-5' : 'translate-x-0'}`} />
                      </button>
                    </div>

                    <div className="p-4 rounded-2xl bg-white/[0.02] border border-white/5 flex items-center justify-between gap-4">
                      <div className="space-y-0.5">
                        <h5 className="font-bold text-xs text-white">Search Engine Indexing</h5>
                        <p className="text-[11px] text-zinc-400">Permit external search engines (Google, Bing) to index your public ZEN.PROFILE.</p>
                      </div>
                      <button
                        type="button"
                        onClick={() => setSearchVisibility(!searchVisibility)}
                        className={`relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none ${
                          searchVisibility ? 'bg-purple-600' : 'bg-zinc-800'
                        }`}
                      >
                        <span className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out ${searchVisibility ? 'translate-x-5' : 'translate-x-0'}`} />
                      </button>
                    </div>

                    <div className="p-4 rounded-2xl bg-white/[0.02] border border-white/5 flex items-center justify-between gap-4">
                      <div className="space-y-0.5">
                        <h5 className="font-bold text-xs text-white">ZEN.CHAT Active Status &amp; Encrypted Receipts</h5>
                        <p className="text-[11px] text-zinc-400">Broadcast online pulse dot and return cryptographic read receipts.</p>
                      </div>
                      <div className="flex items-center gap-2">
                        <button
                          type="button"
                          onClick={() => setShowActiveStatus(!showActiveStatus)}
                          className={`px-3 py-1.5 rounded-xl border text-xs font-mono transition cursor-pointer ${
                            showActiveStatus ? 'bg-purple-600/20 border-purple-500/40 text-purple-300' : 'bg-zinc-900 border-white/10 text-zinc-500'
                          }`}
                        >
                          {showActiveStatus ? 'Status: Active' : 'Status: Stealth'}
                        </button>
                        <button
                          type="button"
                          onClick={() => setReadReceipts(!readReceipts)}
                          className={`px-3 py-1.5 rounded-xl border text-xs font-mono transition cursor-pointer ${
                            readReceipts ? 'bg-purple-600/20 border-purple-500/40 text-purple-300' : 'bg-zinc-900 border-white/10 text-zinc-500'
                          }`}
                        >
                          {readReceipts ? 'Receipts: On' : 'Receipts: Off'}
                        </button>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      <div className="p-4 rounded-2xl bg-white/[0.02] border border-white/5 space-y-2">
                        <h5 className="font-bold text-xs text-white">Mention Permissions</h5>
                        <p className="text-[10px] text-zinc-400">Who can @mention you in dispatches &amp; sparks.</p>
                        <select
                          value={mentionControl}
                          onChange={(e) => setMentionControl(e.target.value as any)}
                          className="w-full px-3 py-2 rounded-xl bg-zinc-900 border border-white/10 text-white text-xs font-mono focus:outline-none focus:border-purple-500 cursor-pointer"
                        >
                          <option value="everyone">Everyone on ZENVITRA</option>
                          <option value="followers">Followers &amp; Delegates</option>
                          <option value="none">Nobody</option>
                        </select>
                      </div>

                      <div className="p-4 rounded-2xl bg-white/[0.02] border border-white/5 space-y-2">
                        <h5 className="font-bold text-xs text-white">Tag Permissions</h5>
                        <p className="text-[10px] text-zinc-400">Who can tag you in FLUX reels &amp; press articles.</p>
                        <select
                          value={tagControl}
                          onChange={(e) => setTagControl(e.target.value as any)}
                          className="w-full px-3 py-2 rounded-xl bg-zinc-900 border border-white/10 text-white text-xs font-mono focus:outline-none focus:border-purple-500 cursor-pointer"
                        >
                          <option value="everyone">Everyone on ZENVITRA</option>
                          <option value="followers">Followers &amp; Delegates</option>
                          <option value="none">Nobody</option>
                        </select>
                      </div>
                    </div>
                  </div>

                  {/* 2. ZEN AI PRIVACY & BOUNDARIES */}
                  <div className="space-y-3">
                    <h4 className="font-mono text-xs font-bold text-neutral-300 uppercase tracking-wider flex items-center gap-2">
                      <Bot className="w-3.5 h-3.5 text-cyan-400" />
                      <span>ZEN AI Context &amp; Permission Boundaries</span>
                    </h4>

                    <div className="p-4 rounded-2xl bg-white/[0.02] border border-white/5 space-y-3">
                      <div className="flex items-center justify-between gap-4">
                        <div className="space-y-0.5">
                          <h5 className="font-bold text-xs text-white">AI Personalization &amp; Workspace Context</h5>
                          <p className="text-[11px] text-zinc-400">Allow ZEN AI to tailor research suggestions based on your active document drafts.</p>
                        </div>
                        <button
                          type="button"
                          onClick={() => setAiPersonalization(!aiPersonalization)}
                          className={`relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none ${
                            aiPersonalization ? 'bg-cyan-600' : 'bg-zinc-800'
                          }`}
                        >
                          <span className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out ${aiPersonalization ? 'translate-x-5' : 'translate-x-0'}`} />
                        </button>
                      </div>

                      <div className="flex items-center justify-between gap-4 pt-3 border-t border-white/5">
                        <div className="space-y-0.5">
                          <h5 className="font-bold text-xs text-white">AI Document Assistant Access</h5>
                          <p className="text-[11px] text-zinc-400">Grant AI summarization and bill proofreading privileges in ZEN.DOCS and LEGISLATE.</p>
                        </div>
                        <button
                          type="button"
                          onClick={() => setAiDocumentAccess(!aiDocumentAccess)}
                          className={`relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none ${
                            aiDocumentAccess ? 'bg-cyan-600' : 'bg-zinc-800'
                          }`}
                        >
                          <span className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out ${aiDocumentAccess ? 'translate-x-5' : 'translate-x-0'}`} />
                        </button>
                      </div>

                      <div className="p-3 rounded-xl bg-cyan-500/10 border border-cyan-500/20 flex items-center justify-between text-[11px] font-mono text-cyan-300">
                        <div className="flex items-center gap-2">
                          <ShieldCheck className="w-4 h-4 text-cyan-400" />
                          <span>Strict Boundary: Private user documents are never used to train public foundation models.</span>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* 3. ZEN.MUN & EVENTS PRIVACY */}
                  <div className="space-y-3">
                    <h4 className="font-mono text-xs font-bold text-neutral-300 uppercase tracking-wider flex items-center gap-2">
                      <Gavel className="w-3.5 h-3.5 text-amber-400" />
                      <span>ZEN.MUN &amp; Event Disclosures</span>
                    </h4>

                    <div className="p-4 rounded-2xl bg-white/[0.02] border border-white/5 space-y-3">
                      <div className="space-y-1">
                        <h5 className="font-bold text-xs text-white">Committee Participation Records Visibility</h5>
                        <p className="text-[11px] text-zinc-400">Controls who can inspect your procedural speeches, motions, and voting stats.</p>
                        <select
                          value={munVisibility}
                          onChange={(e) => setMunVisibility(e.target.value as any)}
                          className="w-full px-3 py-2 rounded-xl bg-zinc-900 border border-white/10 text-white text-xs font-mono focus:outline-none focus:border-amber-500 cursor-pointer"
                        >
                          <option value="secretariat_only">Executive Board &amp; Secretariat Only (Private)</option>
                          <option value="committee">Assigned Committee Delegates</option>
                          <option value="public">Public Conference Archive</option>
                        </select>
                      </div>

                      <div className="flex items-center justify-between gap-4 pt-3 border-t border-white/5">
                        <div className="space-y-0.5">
                          <h5 className="font-bold text-xs text-white">Public Certificate Verification</h5>
                          <p className="text-[11px] text-zinc-400">Allow universities and employers to confirm certificates via public QR code verification.</p>
                        </div>
                        <button
                          type="button"
                          onClick={() => setCertifyPublic(!certifyPublic)}
                          className={`relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none ${
                            certifyPublic ? 'bg-amber-500' : 'bg-zinc-800'
                          }`}
                        >
                          <span className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out ${certifyPublic ? 'translate-x-5' : 'translate-x-0'}`} />
                        </button>
                      </div>
                    </div>
                  </div>

                  {/* 4. INTERACTIVE: "WHY AM I SEEING THIS?" DATA LIFECYCLE EXPLORER */}
                  <div className="p-5 rounded-2xl bg-black/60 border border-white/10 space-y-4 text-left">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <Info className="w-4 h-4 text-cyan-400" />
                        <h4 className="font-bold text-xs text-white uppercase font-mono tracking-wider">
                          Interactive Data Explainer: &ldquo;Why Am I Seeing This?&rdquo;
                        </h4>
                      </div>
                      <span className="text-[10px] font-mono text-neutral-400">Lifecycle Transparency</span>
                    </div>

                    <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                      {DATA_LIFECYCLE_EXPLAINERS.slice(0, 6).map((ex) => (
                        <button
                          key={ex.id}
                          type="button"
                          onClick={() => setSelectedExplainerId(ex.id)}
                          className={`p-2.5 rounded-xl border text-left text-xs font-mono transition cursor-pointer truncate ${
                            selectedExplainerId === ex.id
                              ? 'bg-cyan-500/15 border-cyan-500/40 text-cyan-200 font-bold'
                              : 'bg-zinc-900/80 border-white/5 text-zinc-400 hover:text-white'
                          }`}
                        >
                          <span className="block text-[9px] text-cyan-400 uppercase">{ex.product}</span>
                          <span className="block truncate">{ex.title}</span>
                        </button>
                      ))}
                    </div>

                    {/* Selected Explainer Preview */}
                    {(() => {
                      const activeEx = DATA_LIFECYCLE_EXPLAINERS.find((e) => e.id === selectedExplainerId) || DATA_LIFECYCLE_EXPLAINERS[0];
                      return (
                        <div className="p-4 rounded-xl bg-white/[0.02] border border-white/10 space-y-3 font-sans text-xs">
                          <div className="flex items-center justify-between border-b border-white/5 pb-2">
                            <span className="font-bold text-white text-xs">{activeEx.title}</span>
                            <span className="text-[10px] font-mono text-cyan-400">{activeEx.legalBasis}</span>
                          </div>
                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-neutral-300">
                            <div>
                              <strong className="text-white block text-[11px]">&bull; Why ZENVITRA uses this:</strong>
                              <p className="text-neutral-400 text-[11px] mt-0.5">{activeEx.purpose}</p>
                            </div>
                            <div>
                              <strong className="text-white block text-[11px]">&bull; Who can see this:</strong>
                              <p className="text-neutral-400 text-[11px] mt-0.5">{activeEx.access}</p>
                            </div>
                          </div>
                          <div className="pt-2 border-t border-white/5 flex items-center justify-between text-[10px] font-mono text-neutral-400">
                            <span>Retention: {activeEx.retention}</span>
                            <span>Security: AES-256 + RBAC</span>
                          </div>
                        </div>
                      );
                    })()}
                  </div>

                  {/* 5. STATUTORY DATA RIGHTS & GRIEVANCE */}
                  <div className="p-4 rounded-2xl bg-emerald-500/[0.04] border border-emerald-500/20 space-y-3 font-mono text-xs">
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-emerald-300 uppercase">DPDP 2025 Statutory Rights Channel</span>
                      <a href="mailto:grievance@zenvitra.xyz" className="text-emerald-400 hover:underline">
                        grievance@zenvitra.xyz
                      </a>
                    </div>
                    <p className="text-neutral-400 text-[11px] font-sans">
                      Under the Digital Personal Data Protection Act, 2023 and Rules 2025, you retain rights to request summaries of processed data, correction of inaccuracies, consent withdrawal, and statutory grievance redressal.
                    </p>
                    <div className="flex flex-wrap gap-2 pt-1">
                      <button
                        type="button"
                        onClick={handleExportData}
                        className="px-3 py-1.5 rounded-xl bg-white/10 hover:bg-white/15 border border-white/15 text-white text-xs font-mono transition cursor-pointer flex items-center gap-1.5"
                      >
                        <Database className="w-3.5 h-3.5 text-purple-400" />
                        <span>Download My Archive (.json)</span>
                      </button>
                      <a
                        href="mailto:privacy@zenvitra.xyz?subject=Data%20Correction%20Request"
                        className="px-3 py-1.5 rounded-xl bg-white/10 hover:bg-white/15 border border-white/15 text-white text-xs font-mono transition flex items-center gap-1.5"
                      >
                        <span>Request Correction</span>
                      </a>
                      <a
                        href="mailto:privacy@zenvitra.xyz?subject=Account%20Erasure%20Request"
                        className="px-3 py-1.5 rounded-xl bg-rose-500/10 hover:bg-rose-500/20 border border-rose-500/30 text-rose-300 text-xs font-mono transition flex items-center gap-1.5"
                      >
                        <span>Request Erasure</span>
                      </a>
                    </div>
                  </div>
                </div>
              )}

              {/* TAB 3: SECURITY SHIELD & 2FA */}
              {activeTab === 'security' && (
                <div className="space-y-5">
                  {/* 10-Digit Sovereign Code Passkey Card */}
                  <div className="p-5 rounded-2xl bg-black/60 border border-cyan-500/30 space-y-4">
                    <div className="flex flex-wrap items-center justify-between gap-2">
                      <div className="flex items-center gap-2">
                        <Key className="w-4 h-4 text-cyan-400" />
                        <h4 className="font-mono text-xs text-cyan-300 font-bold uppercase tracking-wider">
                          YOUR UNIQUE 10-DIGIT SOVEREIGN CODE
                        </h4>
                      </div>
                      <div className="flex items-center gap-3">
                        <button
                          type="button"
                          onClick={() => {
                            const uId = profile?.id || user?.id || username || 'active_session';
                            const nextCode = regenerateSovereignCode(uId);
                            setSovereignCode(nextCode);
                          }}
                          className="text-xs font-mono text-cyan-400 hover:text-cyan-300 flex items-center gap-1.5 cursor-pointer transition"
                        >
                          <RefreshCw className="w-3.5 h-3.5" />
                          <span>Randomize Code</span>
                        </button>
                        <button
                          type="button"
                          onClick={() => {
                            if (navigator.clipboard) {
                              navigator.clipboard.writeText(sovereignCode);
                              setCopiedCode(true);
                              setTimeout(() => setCopiedCode(false), 2000);
                            }
                          }}
                          className="text-xs font-mono text-zinc-400 hover:text-white flex items-center gap-1.5 cursor-pointer transition"
                        >
                          {copiedCode ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <ShieldCheck className="w-3.5 h-3.5" />}
                          <span>{copiedCode ? 'Copied' : 'Copy Code'}</span>
                        </button>
                      </div>
                    </div>

                    <div className="flex items-center justify-center p-4 rounded-xl bg-cyan-950/30 border border-cyan-500/20 shadow-inner">
                      <span className="font-mono text-2xl sm:text-3xl font-black text-cyan-200 tracking-[0.25em] select-all">
                        {sovereignCode ? `${sovereignCode.slice(0, 5)} ${sovereignCode.slice(5)}` : 'Generating...'}
                      </span>
                    </div>

                    <p className="text-[11px] font-mono text-zinc-400 text-center">
                      Every user has a completely random and unique 10-digit Sovereign Code. Use this code for 2FA logins & high-clearance actions.
                    </p>
                  </div>

                  <div className="p-5 rounded-2xl bg-gradient-to-r from-cyan-500/10 via-blue-500/10 to-transparent border border-cyan-500/20 space-y-3">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-xl bg-cyan-500/20 border border-cyan-500/40 flex items-center justify-center text-cyan-300">
                        <ShieldCheck className="w-5 h-5" />
                      </div>
                      <div>
                        <h4 className="font-bold text-sm text-white">Sovereign Anti-Theft & Security Shield</h4>
                        <p className="text-xs text-cyan-300/80 font-mono">Hardware-level protection & anti-brute-force lockouts</p>
                      </div>
                    </div>
                    <p className="text-xs text-zinc-300 leading-relaxed font-light">
                      Your sovereign identity is fortified with anti-hijack timeouts, automated emergency PIN challenges, and cryptographic passkey authorization.
                    </p>
                    {onOpenSecurityShield && (
                      <button
                        onClick={() => {
                          onClose();
                          onOpenSecurityShield();
                        }}
                        className="px-4 py-2 rounded-xl bg-cyan-500/20 hover:bg-cyan-500/30 border border-cyan-500/40 text-cyan-300 text-xs font-bold transition flex items-center gap-2 cursor-pointer shadow-[0_0_15px_rgba(6,182,212,0.15)]"
                      >
                        <Key className="w-3.5 h-3.5" />
                        <span>Launch Security Shield Console</span>
                        <ChevronRight className="w-3.5 h-3.5" />
                      </button>
                    )}
                  </div>
                </div>
              )}

              {/* TAB 4: NOTIFICATIONS */}
              {activeTab === 'notifications' && (
                <div className="space-y-4">
                  {[
                    { label: 'Summit & Assembly Crisis Alerts', desc: 'Real-time parliamentary flash notices and resolution voting windows.', state: notifySummits, toggle: () => setNotifySummits(!notifySummits) },
                    { label: 'Direct Encrypted Messages', desc: 'Instant push alerts when receiving messages in ZEN.CHAT.', state: notifyDirectMessages, toggle: () => setNotifyDirectMessages(!notifyDirectMessages) },
                    { label: 'ZEN.PRESS Investigative Wires', desc: 'Alerts when major verified investigative reports are released.', state: notifyPressWires, toggle: () => setNotifyPressWires(!notifyPressWires) },
                    { label: 'Audio & Haptic Effects', desc: 'Play subtle obsidian chimes on interactive reactions and messages.', state: soundEffects, toggle: () => setSoundEffects(!soundEffects) },
                  ].map((item, idx) => (
                    <div key={idx} className="p-4 rounded-2xl bg-white/[0.02] border border-white/5 flex items-center justify-between gap-4">
                      <div className="space-y-0.5">
                        <h4 className="font-bold text-xs text-white">{item.label}</h4>
                        <p className="text-[11px] text-zinc-400">{item.desc}</p>
                      </div>
                      <button
                        type="button"
                        onClick={item.toggle}
                        className={`relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none ${
                          item.state ? 'bg-purple-600' : 'bg-zinc-800'
                        }`}
                      >
                        <span
                          className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out ${
                            item.state ? 'translate-x-5' : 'translate-x-0'
                          }`}
                        />
                      </button>
                    </div>
                  ))}
                </div>
              )}

              {/* TAB 5: APPEARANCE */}
              {activeTab === 'appearance' && (
                <div className="space-y-5">
                  <div className="space-y-3">
                    <label className="text-xs font-bold text-white block">Theme & Atmosphere</label>
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                      {[
                        { id: 'obsidian', title: 'Obsidian Velvet', desc: 'Deep cosmic obsidian with purple accents', border: 'border-purple-500/40', bg: 'bg-[#030405]' },
                        { id: 'matrix', title: 'Emerald Grid', desc: 'Cybernetic emerald terminal styling', border: 'border-emerald-500/40', bg: 'bg-[#030805]' },
                        { id: 'cyan', title: 'Sovereign Cyan', desc: 'High-signal arctic blue & cyan', border: 'border-cyan-500/40', bg: 'bg-[#03060a]' },
                      ].map((t) => (
                        <button
                          key={t.id}
                          type="button"
                          onClick={() => setThemeMode(t.id as any)}
                          className={`p-4 rounded-2xl border text-left transition cursor-pointer ${
                            themeMode === t.id ? `${t.border} bg-white/5 ring-1 ring-white/20` : 'border-white/5 hover:border-white/15 bg-white/[0.01]'
                          }`}
                        >
                          <div className={`w-full h-8 rounded-lg ${t.bg} border border-white/10 mb-3`} />
                          <h5 className="font-bold text-xs text-white">{t.title}</h5>
                          <p className="text-[10px] text-zinc-400 mt-1">{t.desc}</p>
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              )}

              {/* TAB 6: DATA & SOVEREIGNTY */}
              {activeTab === 'data' && (
                <div className="space-y-5">
                  <div className="p-4 rounded-2xl bg-white/[0.02] border border-white/5 space-y-3">
                    <div className="space-y-1">
                      <h4 className="font-bold text-xs text-white">Export Personal Sovereign Archive</h4>
                      <p className="text-[11px] text-zinc-400">
                        Download your complete profile data, post indexes, and constitutional governance keys in verified JSON format.
                      </p>
                    </div>
                    <button
                      type="button"
                      onClick={handleExportData}
                      className="px-4 py-2 rounded-xl bg-zinc-800 hover:bg-zinc-700 border border-zinc-700 text-xs font-semibold text-white transition flex items-center gap-2 cursor-pointer"
                    >
                      <Database className="w-3.5 h-3.5 text-purple-400" />
                      <span>Download Archive (.json)</span>
                    </button>
                  </div>

                  <div className="p-4 rounded-2xl bg-white/[0.02] border border-white/5 space-y-3">
                    <div className="space-y-1">
                      <h4 className="font-bold text-xs text-white">25% Constitutional Profit Endowment Ledger</h4>
                      <p className="text-[11px] text-zinc-400">
                        Review cryptographic records for the 25% profit endowment distributed every 4 months, verified with offline giveaway videos on ZEN.FLUX.
                      </p>
                    </div>
                    <a
                      href="/impact"
                      className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-emerald-500/10 hover:bg-emerald-500/20 border border-emerald-500/30 text-emerald-300 text-xs font-bold transition"
                    >
                      <span>Inspect 25% Impact Vault</span>
                      <ExternalLink className="w-3.5 h-3.5" />
                    </a>
                  </div>
                </div>
              )}

              {/* TAB 7: SAVED DISPATCHES & BOOKMARKS */}
              {activeTab === 'saved' && (
                <div className="space-y-4">
                  <div className="flex items-center justify-between pb-2 border-b border-white/5">
                    <div className="flex items-center gap-2">
                      <Bookmark className="w-4 h-4 text-purple-400 fill-purple-400/20" />
                      <h4 className="font-bold text-xs text-white uppercase tracking-wider font-mono">
                        Saved Dispatches & Directives
                      </h4>
                    </div>
                    <span className="text-[11px] font-mono text-zinc-400 bg-white/5 px-2.5 py-0.5 rounded-full border border-white/10">
                      {savedPosts.length} {savedPosts.length === 1 ? 'item' : 'items'}
                    </span>
                  </div>

                  {savedPosts.length === 0 ? (
                    <div className="py-14 text-center space-y-3 p-6 rounded-2xl bg-white/[0.01] border border-dashed border-white/10">
                      <div className="w-12 h-12 rounded-2xl bg-purple-500/10 border border-purple-500/20 mx-auto flex items-center justify-center text-purple-400">
                        <Bookmark className="w-6 h-6" />
                      </div>
                      <div className="space-y-1">
                        <h4 className="font-bold text-sm text-white">No Saved Dispatches Yet</h4>
                        <p className="text-xs text-zinc-400 max-w-sm mx-auto leading-relaxed">
                          Save dispatches, resolutions, and civic briefs from Pulse by clicking the three dots <span className="font-mono text-white">[...]</span> &rarr; <span className="text-purple-300">Save Dispatch</span>.
                        </p>
                      </div>
                      <a
                        href="/pulse"
                        onClick={onClose}
                        className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-purple-600 hover:bg-purple-500 text-white text-xs font-bold transition shadow-md cursor-pointer"
                      >
                        <span>Explore Pulse Wire</span>
                        <ExternalLink className="w-3 h-3" />
                      </a>
                    </div>
                  ) : (
                    <div className="space-y-3">
                      {savedPosts.map((post) => {
                        const authorInitial = (post.authorName || post.authorUsername || 'U').charAt(0).toUpperCase();
                        return (
                          <div
                            key={post.id}
                            className="p-4 rounded-2xl bg-white/[0.02] hover:bg-white/[0.04] border border-white/5 hover:border-purple-500/30 transition space-y-3 group"
                          >
                            {/* Header: Author Info & Remove Action */}
                            <div className="flex items-center justify-between">
                              <div className="flex items-center gap-2.5 min-w-0">
                                <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-purple-500 to-indigo-600 p-[1.5px] shrink-0">
                                  {post.authorAvatar ? (
                                    <img src={post.authorAvatar} alt={post.authorName} className="w-full h-full rounded-full object-cover" />
                                  ) : (
                                    <div className="w-full h-full rounded-full bg-zinc-950 flex items-center justify-center text-[11px] font-bold text-white">
                                      {authorInitial}
                                    </div>
                                  )}
                                </div>
                                <div className="min-w-0">
                                  <div className="flex items-center gap-1.5">
                                    <span className="font-bold text-xs text-white truncate">{post.authorName}</span>
                                    {post.authorRole && (
                                      <span className="text-[10px] text-purple-400 font-mono">({post.authorRole})</span>
                                    )}
                                  </div>
                                  <p className="text-[10px] text-zinc-400 font-mono truncate">
                                    @{post.authorUsername} &bull; {post.createdAt}
                                  </p>
                                </div>
                              </div>

                              <div className="flex items-center gap-1">
                                <button
                                  type="button"
                                  onClick={() => toggleSavePost(post.id)}
                                  className="p-1.5 rounded-lg text-purple-400 hover:text-rose-400 hover:bg-rose-500/10 transition cursor-pointer flex items-center gap-1 text-[11px] font-mono"
                                  title="Remove from Saved"
                                >
                                  <Bookmark className="w-3.5 h-3.5 fill-current" />
                                  <span className="hidden sm:inline">Unsave</span>
                                </button>
                              </div>
                            </div>

                            {/* Content */}
                            <p className="text-xs text-zinc-200 leading-relaxed font-sans line-clamp-3">
                              {post.content}
                            </p>

                            {/* Image if attached */}
                            {post.images && post.images.length > 0 && post.images[0] && (
                              <div className="rounded-xl overflow-hidden max-h-48 border border-white/10">
                                <img
                                  src={post.images[0]}
                                  alt="Dispatch media"
                                  className="w-full h-full object-cover"
                                />
                              </div>
                            )}

                            {/* Footer: Stats & Link to Pulse */}
                            <div className="flex items-center justify-between pt-2 border-t border-white/5 text-[11px] text-zinc-400">
                              <div className="flex items-center gap-4">
                                <span className="flex items-center gap-1">
                                  <Heart className="w-3.5 h-3.5 text-zinc-500" />
                                  <span>{post.likes}</span>
                                </span>
                                <span className="flex items-center gap-1">
                                  <MessageCircle className="w-3.5 h-3.5 text-zinc-500" />
                                  <span>{post.replyCount || 0}</span>
                                </span>
                              </div>

                              <a
                                href="/pulse"
                                onClick={onClose}
                                className="text-purple-400 hover:text-purple-300 font-mono text-[10px] flex items-center gap-1 hover:underline"
                              >
                                <span>View in Pulse</span>
                                <ExternalLink className="w-3 h-3" />
                              </a>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
