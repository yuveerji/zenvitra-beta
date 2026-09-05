'use client';

import React, { useState } from 'react';
import { 
  MessageSquare, 
  Users, 
  RadioTower, 
  Camera, 
  Plus, 
  X, 
  Globe, 
  Search, 
  Check, 
  Sparkles,
  ShieldCheck
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useZenChat } from '@/context/ZenChatPlatformContext';
import { useZenPulse } from '@/context/ZenPulsePlatformContext';

interface NewChatActionModalProps {
  isOpen: boolean;
  onClose: () => void;
  onOpenGlimpseCamera: () => void;
  onOpenCreateCaucus: () => void;
}

export function NewChatActionModal({
  isOpen,
  onClose,
  onOpenGlimpseCamera,
  onOpenCreateCaucus
}: NewChatActionModalProps) {
  const { createDirectChat, createGroupChat, createBroadcastList, currentUser } = useZenChat();
  const { profiles } = useZenPulse();

  const [activeTab, setActiveTab] = useState<'menu' | 'new_dm' | 'new_group' | 'new_broadcast'>('menu');
  const [targetHandle, setTargetHandle] = useState('');
  const [groupName, setGroupName] = useState('');
  const [broadcastName, setBroadcastName] = useState('');
  const [selectedMembers, setSelectedMembers] = useState<string[]>([]);
  const [searchQuery, setSearchQuery] = useState('');

  const toggleMemberSelection = (username: string) => {
    setSelectedMembers((prev) =>
      prev.includes(username) ? prev.filter((u) => u !== username) : [...prev, username]
    );
  };

  const handleStartDm = (e: React.FormEvent) => {
    e.preventDefault();
    if (!targetHandle.trim()) return;
    createDirectChat(targetHandle.trim());
    handleReset();
    onClose();
  };

  const handleCreateGroup = (e: React.FormEvent) => {
    e.preventDefault();
    if (!groupName.trim() || selectedMembers.length === 0) return;
    const membersList = selectedMembers.map((u) => ({
      id: 'u_' + u,
      name: u,
      username: u,
      role: 'delegate'
    }));
    createGroupChat(groupName.trim(), membersList);
    handleReset();
    onClose();
  };

  const handleCreateBroadcast = (e: React.FormEvent) => {
    e.preventDefault();
    if (!broadcastName.trim() || selectedMembers.length === 0) return;
    createBroadcastList(broadcastName.trim(), selectedMembers);
    handleReset();
    onClose();
  };

  const handleReset = () => {
    setActiveTab('menu');
    setTargetHandle('');
    setGroupName('');
    setBroadcastName('');
    setSelectedMembers([]);
    setSearchQuery('');
  };

  const filteredContacts = profiles.filter((p) => {
    if (p.username === currentUser.username) return false;
    if (!searchQuery.trim()) return true;
    const q = searchQuery.toLowerCase();
    return p.name.toLowerCase().includes(q) || p.username.toLowerCase().includes(q);
  });

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 bg-black/80 backdrop-blur-md z-50 flex items-center justify-center p-4 select-none">
        <motion.div
          initial={{ scale: 0.95, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.95, opacity: 0 }}
          className="w-full max-w-md rounded-[2.5rem] bg-[#090a0f] border border-purple-500/30 p-6 shadow-2xl space-y-5"
        >
          {/* Header */}
          <div className="flex items-center justify-between border-b border-white/[0.06] pb-3">
            <h3 className="font-display font-medium text-base text-white">
              {activeTab === 'menu' && 'New Sovereign Connection'}
              {activeTab === 'new_dm' && 'New Direct Message (1-on-1)'}
              {activeTab === 'new_group' && 'New Group Caucus'}
              {activeTab === 'new_broadcast' && 'New Broadcast Announcement List'}
            </h3>
            <button
              onClick={() => {
                handleReset();
                onClose();
              }}
              className="p-1.5 rounded-xl bg-white/[0.04] hover:bg-white/[0.08] text-neutral-400 hover:text-white"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          {/* ── VIEW 1: ACTION MENU ── */}
          {activeTab === 'menu' && (
            <div className="space-y-2.5">
              {/* Option 1: Direct Message */}
              <button
                type="button"
                onClick={() => setActiveTab('new_dm')}
                className="w-full p-3.5 rounded-2xl bg-white/[0.03] hover:bg-purple-500/15 border border-white/[0.06] hover:border-purple-500/30 flex items-center gap-3.5 text-left transition group cursor-pointer"
              >
                <div className="w-10 h-10 rounded-xl bg-purple-500/20 border border-purple-500/30 flex items-center justify-center text-purple-300 group-hover:scale-105 transition">
                  <MessageSquare className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="font-display font-medium text-xs text-white">
                    Direct Message (1-on-1)
                  </h4>
                  <p className="text-[11px] text-neutral-400 font-light">
                    Encrypted direct link with any registered delegate
                  </p>
                </div>
              </button>

              {/* Option 2: Group Caucus */}
              <button
                type="button"
                onClick={() => setActiveTab('new_group')}
                className="w-full p-3.5 rounded-2xl bg-white/[0.03] hover:bg-cyan-500/15 border border-white/[0.06] hover:border-cyan-500/30 flex items-center gap-3.5 text-left transition group cursor-pointer"
              >
                <div className="w-10 h-10 rounded-xl bg-cyan-500/20 border border-cyan-500/30 flex items-center justify-center text-cyan-300 group-hover:scale-105 transition">
                  <Users className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="font-display font-medium text-xs text-white">
                    New Group Caucus
                  </h4>
                  <p className="text-[11px] text-neutral-400 font-light">
                    Collaborative multi-delegate discussion chamber
                  </p>
                </div>
              </button>

              {/* Option 3: Broadcast List */}
              <button
                type="button"
                onClick={() => setActiveTab('new_broadcast')}
                className="w-full p-3.5 rounded-2xl bg-white/[0.03] hover:bg-emerald-500/15 border border-white/[0.06] hover:border-emerald-500/30 flex items-center gap-3.5 text-left transition group cursor-pointer"
              >
                <div className="w-10 h-10 rounded-xl bg-emerald-500/20 border border-emerald-500/30 flex items-center justify-center text-emerald-300 group-hover:scale-105 transition">
                  <RadioTower className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="font-display font-medium text-xs text-white">
                    New Broadcast List (1-to-Many)
                  </h4>
                  <p className="text-[11px] text-neutral-400 font-light">
                    WhatsApp-style announcement channel to multiple delegates
                  </p>
                </div>
              </button>

              {/* Option 4: Send Glimpse Snap */}
              <button
                type="button"
                onClick={() => {
                  onClose();
                  onOpenGlimpseCamera();
                }}
                className="w-full p-3.5 rounded-2xl bg-white/[0.03] hover:bg-amber-500/15 border border-white/[0.06] hover:border-amber-500/30 flex items-center gap-3.5 text-left transition group cursor-pointer"
              >
                <div className="w-10 h-10 rounded-xl bg-amber-500/20 border border-amber-500/30 flex items-center justify-center text-amber-300 group-hover:scale-105 transition">
                  <Camera className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="font-display font-medium text-xs text-white">
                    Send Glimpse Snap / Instant
                  </h4>
                  <p className="text-[11px] text-neutral-400 font-light">
                    Capture 1-view media with custom stickers &amp; text overlay
                  </p>
                </div>
              </button>
            </div>
          )}

          {/* ── VIEW 2: NEW DM ── */}
          {activeTab === 'new_dm' && (
            <form onSubmit={handleStartDm} className="space-y-4">
              <div className="space-y-2">
                <label className="font-mono text-[10px] text-neutral-400 uppercase tracking-wider block">
                  ENTER DELEGATE HANDLE OR PHONE:
                </label>
                <input
                  type="text"
                  value={targetHandle}
                  onChange={(e) => setTargetHandle(e.target.value)}
                  placeholder="e.g. @yuveerji or 9876543210"
                  className="w-full px-4 py-3 rounded-2xl bg-white/[0.04] border border-white/10 text-xs text-white placeholder-neutral-500 focus:outline-none focus:border-purple-500/50"
                  autoFocus
                />
              </div>

              {/* Quick Contacts Pick */}
              <div className="space-y-1.5 max-h-48 overflow-y-auto">
                <span className="font-mono text-[9px] text-neutral-500 uppercase tracking-widest block">
                  OR CHOOSE ACTIVE DELEGATES:
                </span>
                {profiles.slice(0, 5).map((p) => (
                  <div
                    key={p.id}
                    onClick={() => {
                      createDirectChat(p.username, p.name);
                      handleReset();
                      onClose();
                    }}
                    className="flex items-center justify-between p-2 rounded-xl hover:bg-white/[0.04] cursor-pointer transition"
                  >
                    <div className="flex items-center gap-2.5">
                      <div className="w-8 h-8 rounded-xl bg-purple-500/20 text-purple-300 flex items-center justify-center text-xs font-bold">
                        {p.name.charAt(0)}
                      </div>
                      <div>
                        <h5 className="font-display text-xs text-white">{p.name}</h5>
                        <p className="font-mono text-[9px] text-neutral-400">@{p.username}</p>
                      </div>
                    </div>
                    <span className="text-xs text-purple-400 font-mono">Chat →</span>
                  </div>
                ))}
              </div>

              <div className="flex items-center justify-between pt-2">
                <button
                  type="button"
                  onClick={() => setActiveTab('menu')}
                  className="px-3 py-2 text-xs font-mono text-neutral-400 hover:text-white"
                >
                  ← Back
                </button>
                <button
                  type="submit"
                  disabled={!targetHandle.trim()}
                  className="px-5 py-2.5 rounded-2xl bg-gradient-to-r from-purple-500 to-indigo-600 hover:opacity-90 disabled:opacity-30 text-white font-medium text-xs shadow-md transition"
                >
                  Open Chat
                </button>
              </div>
            </form>
          )}

          {/* ── VIEW 3: NEW GROUP CAUCUS ── */}
          {activeTab === 'new_group' && (
            <form onSubmit={handleCreateGroup} className="space-y-4">
              <div className="space-y-2">
                <label className="font-mono text-[10px] text-neutral-400 uppercase tracking-wider block">
                  GROUP CAUCUS NAME:
                </label>
                <input
                  type="text"
                  value={groupName}
                  onChange={(e) => setGroupName(e.target.value)}
                  placeholder="e.g. Model UN Secretariat 2026"
                  className="w-full px-4 py-3 rounded-2xl bg-white/[0.04] border border-white/10 text-xs text-white placeholder-neutral-500 focus:outline-none focus:border-cyan-500/50"
                  autoFocus
                />
              </div>

              {/* Members Selection */}
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="font-mono text-[10px] text-neutral-400 uppercase tracking-wider">
                    SELECT PARTICIPATING DELEGATES ({selectedMembers.length}):
                  </span>
                </div>

                <div className="max-h-44 overflow-y-auto space-y-1 divide-y divide-white/[0.02]">
                  {filteredContacts.map((p) => {
                    const isSelected = selectedMembers.includes(p.username);
                    return (
                      <div
                        key={p.id}
                        onClick={() => toggleMemberSelection(p.username)}
                        className={`flex items-center justify-between p-2 rounded-xl cursor-pointer transition ${
                          isSelected ? 'bg-cyan-500/15 border border-cyan-500/30' : 'hover:bg-white/[0.03]'
                        }`}
                      >
                        <div className="flex items-center gap-2.5">
                          <div className="w-8 h-8 rounded-xl bg-neutral-800 text-neutral-300 flex items-center justify-center text-xs font-bold">
                            {p.name.charAt(0)}
                          </div>
                          <div>
                            <h5 className="font-display text-xs text-white">{p.name}</h5>
                            <p className="font-mono text-[9px] text-neutral-400">@{p.username}</p>
                          </div>
                        </div>
                        <div className={`w-5 h-5 rounded-lg border flex items-center justify-center ${
                          isSelected ? 'bg-cyan-500 border-cyan-400 text-black' : 'border-white/20'
                        }`}>
                          {isSelected && <Check className="w-3.5 h-3.5 stroke-[3]" />}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              <div className="flex items-center justify-between pt-2">
                <button
                  type="button"
                  onClick={() => setActiveTab('menu')}
                  className="px-3 py-2 text-xs font-mono text-neutral-400 hover:text-white"
                >
                  ← Back
                </button>
                <button
                  type="submit"
                  disabled={!groupName.trim() || selectedMembers.length === 0}
                  className="px-5 py-2.5 rounded-2xl bg-cyan-500 hover:bg-cyan-400 disabled:opacity-30 text-black font-bold text-xs shadow-md transition"
                >
                  Create Group Caucus
                </button>
              </div>
            </form>
          )}

          {/* ── VIEW 4: NEW BROADCAST LIST ── */}
          {activeTab === 'new_broadcast' && (
            <form onSubmit={handleCreateBroadcast} className="space-y-4">
              <div className="space-y-2">
                <label className="font-mono text-[10px] text-neutral-400 uppercase tracking-wider block">
                  BROADCAST LIST TITLE:
                </label>
                <input
                  type="text"
                  value={broadcastName}
                  onChange={(e) => setBroadcastName(e.target.value)}
                  placeholder="e.g. Plenary Briefing Wire"
                  className="w-full px-4 py-3 rounded-2xl bg-white/[0.04] border border-white/10 text-xs text-white placeholder-neutral-500 focus:outline-none focus:border-emerald-500/50"
                  autoFocus
                />
              </div>

              {/* Members Selection */}
              <div className="space-y-2">
                <span className="font-mono text-[10px] text-neutral-400 uppercase tracking-wider block">
                  SELECT SUBSCRIBER RECIPIENTS ({selectedMembers.length}):
                </span>

                <div className="max-h-44 overflow-y-auto space-y-1 divide-y divide-white/[0.02]">
                  {filteredContacts.map((p) => {
                    const isSelected = selectedMembers.includes(p.username);
                    return (
                      <div
                        key={p.id}
                        onClick={() => toggleMemberSelection(p.username)}
                        className={`flex items-center justify-between p-2 rounded-xl cursor-pointer transition ${
                          isSelected ? 'bg-emerald-500/15 border border-emerald-500/30' : 'hover:bg-white/[0.03]'
                        }`}
                      >
                        <div className="flex items-center gap-2.5">
                          <div className="w-8 h-8 rounded-xl bg-neutral-800 text-neutral-300 flex items-center justify-center text-xs font-bold">
                            {p.name.charAt(0)}
                          </div>
                          <div>
                            <h5 className="font-display text-xs text-white">{p.name}</h5>
                            <p className="font-mono text-[9px] text-neutral-400">@{p.username}</p>
                          </div>
                        </div>
                        <div className={`w-5 h-5 rounded-lg border flex items-center justify-center ${
                          isSelected ? 'bg-emerald-500 border-emerald-400 text-black' : 'border-white/20'
                        }`}>
                          {isSelected && <Check className="w-3.5 h-3.5 stroke-[3]" />}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              <div className="flex items-center justify-between pt-2">
                <button
                  type="button"
                  onClick={() => setActiveTab('menu')}
                  className="px-3 py-2 text-xs font-mono text-neutral-400 hover:text-white"
                >
                  ← Back
                </button>
                <button
                  type="submit"
                  disabled={!broadcastName.trim() || selectedMembers.length === 0}
                  className="px-5 py-2.5 rounded-2xl bg-emerald-500 hover:bg-emerald-400 disabled:opacity-30 text-black font-bold text-xs shadow-md transition"
                >
                  Launch Broadcast List
                </button>
              </div>
            </form>
          )}
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
