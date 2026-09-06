'use client';

import React, { useState } from 'react';
import { 
  X, 
  User, 
  AtSign, 
  ShieldCheck, 
  Bell, 
  Lock, 
  Check, 
  Camera, 
  Smartphone,
  Info
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '@/context/AuthContext';
import { useZenChat } from '@/context/ZenChatPlatformContext';

interface ZenChatSettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const PRESET_ABOUT_TAGS = [
  'Available for Diplomatic Caucus',
  'In Plenary Chamber • Do Not Disturb',
  'Drafting Treaty Resolutions',
  'Point of Information Accepted',
  'Veto In Session ⚡',
  'Sovereign Citizen of Zenvitra',
  'Traveling to Geneva Summit'
];

export function ZenChatSettingsModal({ isOpen, onClose }: ZenChatSettingsModalProps) {
  const { profile, updateProfile } = useAuth();
  const { currentUserName, currentUserUsername } = useZenChat();

  const [activeTab, setActiveTab] = useState<'profile' | 'privacy' | 'notifications'>('profile');

  // Form states
  const [displayName, setDisplayName] = useState(profile?.display_name || currentUserName || '');
  const [username, setUsername] = useState((profile?.username || currentUserUsername || '').replace(/^@/, ''));
  const [bio, setBio] = useState(profile?.bio || 'Available for Diplomatic Caucus');
  const [avatarUrl, setAvatarUrl] = useState(profile?.avatar_url || '');

  // Privacy toggles
  const [readReceipts, setReadReceipts] = useState(true);
  const [lastSeenPrivacy, setLastSeenPrivacy] = useState<'everyone' | 'contacts' | 'nobody'>('everyone');
  const [onlineIndicator, setOnlineIndicator] = useState(true);

  // Notification toggles
  const [messageSounds, setMessageSounds] = useState(true);
  const [callRingtone, setCallRingtone] = useState(true);

  // Save Feedback
  const [isSaving, setIsSaving] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);
  const [saveError, setSaveError] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleSaveProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    setSaveError(null);

    const cleanUser = username.trim().replace(/^@/, '').toLowerCase();
    if (!cleanUser) {
      setSaveError('Username cannot be empty');
      setIsSaving(false);
      return;
    }

    try {
      const res = await updateProfile({
        display_name: displayName.trim() || cleanUser,
        username: cleanUser,
        bio: bio.trim(),
        avatar_url: avatarUrl.trim() || undefined,
      });

      if (res.success) {
        setSaveSuccess(true);
        setTimeout(() => setSaveSuccess(false), 2500);
      } else {
        setSaveError(res.error || 'Failed to update profile');
      }
    } catch (err: any) {
      setSaveError(err.message || 'Error updating settings');
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-[100] bg-black/80 backdrop-blur-md flex items-center justify-center p-3 sm:p-4"
      >
        <motion.div
          initial={{ scale: 0.95, opacity: 0, y: 12 }}
          animate={{ scale: 1, opacity: 1, y: 0 }}
          exit={{ scale: 0.95, opacity: 0, y: 12 }}
          className="w-full max-w-xl bg-[#0b0c10] border border-white/10 rounded-3xl sm:rounded-[2.2rem] shadow-2xl overflow-hidden flex flex-col max-h-[90vh]"
        >
          {/* Header */}
          <div className="px-6 py-4 border-b border-white/[0.08] flex items-center justify-between bg-[#08090d]">
            <div className="flex items-center gap-2.5">
              <div className="w-9 h-9 rounded-2xl bg-purple-600/20 border border-purple-500/30 flex items-center justify-center text-purple-300">
                <Smartphone className="w-5 h-5" />
              </div>
              <div>
                <h2 className="font-display font-bold text-sm sm:text-base text-white">
                  ZenChat Settings
                </h2>
                <p className="font-mono text-[10px] text-neutral-400">
                  Manage your sovereign profile & communication preferences
                </p>
              </div>
            </div>

            <button
              onClick={onClose}
              className="p-2 rounded-xl bg-white/[0.04] hover:bg-white/[0.08] text-neutral-400 hover:text-white transition cursor-pointer"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          {/* WhatsApp-Style Navigation Tabs */}
          <div className="px-6 pt-2 border-b border-white/[0.06] flex items-center gap-4 bg-[#090a0e] overflow-x-auto scrollbar-none">
            {[
              { id: 'profile', label: 'Profile', icon: User },
              { id: 'privacy', label: 'Privacy', icon: Lock },
              { id: 'notifications', label: 'Notifications', icon: Bell },
            ].map((tab) => {
              const Icon = tab.icon;
              const isActive = activeTab === tab.id;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id as any)}
                  className={`flex items-center gap-1.5 py-3 border-b-2 font-mono text-xs transition cursor-pointer whitespace-nowrap ${
                    isActive
                      ? 'border-purple-500 text-purple-300 font-bold'
                      : 'border-transparent text-neutral-400 hover:text-neutral-200'
                  }`}
                >
                  <Icon className="w-3.5 h-3.5" />
                  <span>{tab.label}</span>
                </button>
              );
            })}
          </div>

          {/* Modal Body */}
          <div className="flex-1 overflow-y-auto p-6 space-y-6">
            {/* 1. PROFILE TAB */}
            {activeTab === 'profile' && (
              <form onSubmit={handleSaveProfile} className="space-y-5">
                {/* Profile Avatar Card */}
                <div className="flex flex-col sm:flex-row items-center gap-5 p-4 rounded-2xl bg-white/[0.02] border border-white/[0.06]">
                  <div className="relative group cursor-pointer">
                    <div className="w-20 h-20 rounded-full bg-gradient-to-tr from-purple-600 to-indigo-600 p-0.5 shadow-lg flex items-center justify-center overflow-hidden">
                      {avatarUrl ? (
                        <img src={avatarUrl} alt="Avatar" className="w-full h-full object-cover rounded-full" />
                      ) : (
                        <span className="text-2xl font-bold font-display text-white">
                          {displayName.charAt(0) || 'U'}
                        </span>
                      )}
                    </div>
                    <div className="absolute inset-0 bg-black/60 rounded-full flex flex-col items-center justify-center opacity-0 group-hover:opacity-100 transition duration-200 text-white text-[10px] font-mono">
                      <Camera className="w-4 h-4 mb-0.5" />
                      <span>Change</span>
                    </div>
                  </div>

                  <div className="flex-1 space-y-1 text-center sm:text-left min-w-0">
                    <h3 className="font-display font-bold text-white text-base truncate">
                      {displayName || 'Anonymous Delegate'}
                    </h3>
                    <p className="font-mono text-xs text-purple-400 truncate">
                      @{username || 'handle'}
                    </p>
                    <p className="font-sans text-xs text-neutral-400 line-clamp-1 italic">
                      &quot;{bio}&quot;
                    </p>
                  </div>
                </div>

                {/* Display Name Input */}
                <div className="space-y-1.5">
                  <label className="block font-mono text-[10px] tracking-wider text-neutral-400 uppercase font-semibold">
                    Display Name
                  </label>
                  <div className="relative">
                    <User className="w-4 h-4 text-neutral-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
                    <input
                      type="text"
                      value={displayName}
                      onChange={(e) => setDisplayName(e.target.value)}
                      placeholder="e.g. Yuveer Chhatwani"
                      className="w-full pl-10 pr-4 py-2.5 rounded-2xl bg-white/[0.04] border border-white/10 focus:border-purple-500/50 text-xs sm:text-sm text-white focus:outline-none transition"
                      required
                    />
                  </div>
                  <span className="font-mono text-[9px] text-neutral-500 block">
                    This is not your handle. This name is visible to your delegates and caucus members.
                  </span>
                </div>

                {/* Username (@handle) Input */}
                <div className="space-y-1.5">
                  <label className="block font-mono text-[10px] tracking-wider text-neutral-400 uppercase font-semibold">
                    Username / Handle
                  </label>
                  <div className="relative">
                    <AtSign className="w-4 h-4 text-neutral-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
                    <input
                      type="text"
                      value={username}
                      onChange={(e) => setUsername(e.target.value.replace(/[^a-zA-Z0-9_]/g, '').toLowerCase())}
                      placeholder="e.g. yuveer"
                      className="w-full pl-10 pr-4 py-2.5 rounded-2xl bg-white/[0.04] border border-white/10 focus:border-purple-500/50 text-xs sm:text-sm text-white focus:outline-none font-mono transition"
                      required
                    />
                  </div>
                  <span className="font-mono text-[9px] text-neutral-500 block">
                    Your unique sovereign ID for direct dials, mentions, and P2P encryption.
                  </span>
                </div>

                {/* About / Status Tagline */}
                <div className="space-y-1.5">
                  <label className="block font-mono text-[10px] tracking-wider text-neutral-400 uppercase font-semibold">
                    About / Sovereign Status
                  </label>
                  <textarea
                    rows={2}
                    value={bio}
                    onChange={(e) => setBio(e.target.value)}
                    placeholder="Tell other delegates what you are working on..."
                    className="w-full p-3 rounded-2xl bg-white/[0.04] border border-white/10 focus:border-purple-500/50 text-xs sm:text-sm text-white focus:outline-none transition resize-none"
                    maxLength={140}
                  />

                  {/* Quick Select Presets */}
                  <div className="pt-1">
                    <span className="font-mono text-[9px] text-neutral-400 block mb-1.5">
                      Or select quick status:
                    </span>
                    <div className="flex flex-wrap gap-1.5">
                      {PRESET_ABOUT_TAGS.map((tag) => (
                        <button
                          key={tag}
                          type="button"
                          onClick={() => setBio(tag)}
                          className={`px-2.5 py-1 rounded-full text-[10px] font-mono transition cursor-pointer ${
                            bio === tag
                              ? 'bg-purple-600 text-white font-semibold'
                              : 'bg-white/[0.03] hover:bg-white/[0.08] text-neutral-300 border border-white/[0.06]'
                          }`}
                        >
                          {tag}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Avatar Image Selection & Upload */}
                <div className="space-y-2">
                  <label className="block font-mono text-[10px] tracking-wider text-neutral-400 uppercase font-semibold">
                    Profile Avatar
                  </label>
                  <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
                    <label className="flex items-center justify-center gap-2 px-4 py-2.5 rounded-2xl bg-white/[0.06] hover:bg-white/10 border border-white/15 text-xs text-neutral-200 cursor-pointer transition font-medium hover:text-white">
                      <Camera className="w-4 h-4 text-purple-400" />
                      <span>Upload Avatar Image</span>
                      <input
                        type="file"
                        accept="image/*"
                        className="hidden"
                        onChange={(e) => {
                          const file = e.target.files?.[0];
                          if (file) {
                            const reader = new FileReader();
                            reader.onloadend = () => {
                              setAvatarUrl(reader.result as string);
                            };
                            reader.readAsDataURL(file);
                          }
                        }}
                      />
                    </label>

                    {avatarUrl && (
                      <button
                        type="button"
                        onClick={() => setAvatarUrl('')}
                        className="px-3 py-2 rounded-2xl bg-rose-500/10 hover:bg-rose-500/20 border border-rose-500/30 text-rose-300 text-xs font-mono transition flex items-center justify-center gap-1.5"
                      >
                        <X className="w-3.5 h-3.5" />
                        <span>Remove Photo</span>
                      </button>
                    )}
                  </div>
                  {avatarUrl && (
                    <p className="font-mono text-[9px] text-emerald-400 flex items-center gap-1">
                      <Check className="w-3 h-3" />
                      <span>Custom avatar image loaded</span>
                    </p>
                  )}
                </div>

                {saveError && (
                  <div className="p-3 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-300 text-xs font-mono">
                    {saveError}
                  </div>
                )}

                {saveSuccess && (
                  <div className="p-3 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-300 text-xs font-mono flex items-center gap-2">
                    <Check className="w-4 h-4" />
                    <span>Settings & Profile updated successfully!</span>
                  </div>
                )}

                {/* Save Button */}
                <button
                  type="submit"
                  disabled={isSaving}
                  className="w-full py-3 rounded-2xl bg-gradient-to-r from-purple-600 to-indigo-600 hover:opacity-95 text-white font-display font-semibold text-xs sm:text-sm shadow-lg shadow-purple-900/30 transition flex items-center justify-center gap-2 cursor-pointer"
                >
                  {isSaving ? (
                    <div className="w-4 h-4 rounded-full border-2 border-white/30 border-t-white animate-spin" />
                  ) : (
                    <>
                      <Check className="w-4 h-4" />
                      <span>Save Changes</span>
                    </>
                  )}
                </button>
              </form>
            )}

            {/* 2. PRIVACY TAB */}
            {activeTab === 'privacy' && (
              <div className="space-y-6">
                <div className="p-4 rounded-2xl bg-purple-500/10 border border-purple-500/20 flex items-start gap-3">
                  <ShieldCheck className="w-5 h-5 text-purple-400 flex-shrink-0 mt-0.5" />
                  <div className="space-y-1">
                    <h4 className="font-display font-bold text-xs text-white">
                      End-to-End Sovereign Encryption
                    </h4>
                    <p className="font-sans text-[11px] text-neutral-300 leading-relaxed">
                      Your messages and Glimpse Snaps are secured with client-side hashing. No central ad-brokers or unencrypted relays can access your conversations.
                    </p>
                  </div>
                </div>

                <div className="divide-y divide-white/[0.06] space-y-4">
                  {/* Read Receipts */}
                  <div className="flex items-center justify-between pt-2">
                    <div>
                      <h4 className="font-display font-medium text-xs sm:text-sm text-white">
                        Read Receipts
                      </h4>
                      <p className="font-mono text-[10px] text-neutral-400">
                        If turned off, you won&apos;t send or receive double blue checks.
                      </p>
                    </div>
                    <button
                      type="button"
                      onClick={() => setReadReceipts(!readReceipts)}
                      className={`w-11 h-6 rounded-full transition-colors relative cursor-pointer ${
                        readReceipts ? 'bg-purple-600' : 'bg-white/10'
                      }`}
                    >
                      <span
                        className={`w-4 h-4 rounded-full bg-white absolute top-1 transition-transform ${
                          readReceipts ? 'left-6' : 'left-1'
                        }`}
                      />
                    </button>
                  </div>

                  {/* Online Status */}
                  <div className="flex items-center justify-between pt-4">
                    <div>
                      <h4 className="font-display font-medium text-xs sm:text-sm text-white">
                        Online Activity Indicator
                      </h4>
                      <p className="font-mono text-[10px] text-neutral-400">
                        Display the green glowing dot when actively in caucuses.
                      </p>
                    </div>
                    <button
                      type="button"
                      onClick={() => setOnlineIndicator(!onlineIndicator)}
                      className={`w-11 h-6 rounded-full transition-colors relative cursor-pointer ${
                        onlineIndicator ? 'bg-purple-600' : 'bg-white/10'
                      }`}
                    >
                      <span
                        className={`w-4 h-4 rounded-full bg-white absolute top-1 transition-transform ${
                          onlineIndicator ? 'left-6' : 'left-1'
                        }`}
                      />
                    </button>
                  </div>

                  {/* Last Seen Privacy */}
                  <div className="pt-4 space-y-2">
                    <h4 className="font-display font-medium text-xs sm:text-sm text-white">
                      Who can see when I was Last Active
                    </h4>
                    <div className="grid grid-cols-3 gap-2">
                      {(['everyone', 'contacts', 'nobody'] as const).map((opt) => (
                        <button
                          key={opt}
                          onClick={() => setLastSeenPrivacy(opt)}
                          className={`p-2.5 rounded-xl border font-mono text-xs capitalize text-center transition cursor-pointer ${
                            lastSeenPrivacy === opt
                              ? 'bg-white text-black font-bold border-white'
                              : 'bg-white/[0.03] text-neutral-400 border-white/[0.08] hover:text-white'
                          }`}
                        >
                          {opt}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* 3. NOTIFICATIONS TAB */}
            {activeTab === 'notifications' && (
              <div className="space-y-5">
                <div className="divide-y divide-white/[0.06] space-y-4">
                  {/* Message Tones */}
                  <div className="flex items-center justify-between pt-2">
                    <div>
                      <h4 className="font-display font-medium text-xs sm:text-sm text-white">
                        Message Sounds
                      </h4>
                      <p className="font-mono text-[10px] text-neutral-400">
                        Play auditory chime on incoming sovereign dispatches.
                      </p>
                    </div>
                    <button
                      type="button"
                      onClick={() => setMessageSounds(!messageSounds)}
                      className={`w-11 h-6 rounded-full transition-colors relative cursor-pointer ${
                        messageSounds ? 'bg-purple-600' : 'bg-white/10'
                      }`}
                    >
                      <span
                        className={`w-4 h-4 rounded-full bg-white absolute top-1 transition-transform ${
                          messageSounds ? 'left-6' : 'left-1'
                        }`}
                      />
                    </button>
                  </div>

                  {/* Call Ringtone */}
                  <div className="flex items-center justify-between pt-4">
                    <div>
                      <h4 className="font-display font-medium text-xs sm:text-sm text-white">
                        Direct Call Ringtone
                      </h4>
                      <p className="font-mono text-[10px] text-neutral-400">
                        Audible alert for incoming WebRTC chamber voice/video calls.
                      </p>
                    </div>
                    <button
                      type="button"
                      onClick={() => setCallRingtone(!callRingtone)}
                      className={`w-11 h-6 rounded-full transition-colors relative cursor-pointer ${
                        callRingtone ? 'bg-purple-600' : 'bg-white/10'
                      }`}
                    >
                      <span
                        className={`w-4 h-4 rounded-full bg-white absolute top-1 transition-transform ${
                          callRingtone ? 'left-6' : 'left-1'
                        }`}
                      />
                    </button>
                  </div>
                </div>

                <div className="p-4 rounded-2xl bg-white/[0.02] border border-white/[0.06] text-neutral-400 text-xs font-mono space-y-1">
                  <div className="flex items-center gap-1.5 text-neutral-300">
                    <Info className="w-4 h-4 text-purple-400" />
                    <span>Notification Relay Status: ACTIVE</span>
                  </div>
                  <p className="text-[10px]">
                    Push credentials synchronized with WebPush service worker.
                  </p>
                </div>
              </div>
            )}
          </div>

          {/* Footer */}
          <div className="p-4 border-t border-white/[0.08] bg-[#08090d] flex items-center justify-between">
            <span className="font-mono text-[10px] text-neutral-500">
              Zenvitra OS • ZenChat v8.0 Secure
            </span>

            <button
              onClick={onClose}
              className="px-4 py-2 rounded-xl bg-white/[0.06] hover:bg-white/[0.12] text-xs font-medium text-white transition cursor-pointer"
            >
              Done
            </button>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}
