'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Settings,
  Hash,
  Volume2,
  Bell,
  Shield,
  Trash2,
  Check,
  X,
  Plus,
  Lock,
  Edit2,
  FolderPlus
} from 'lucide-react';
import { ChatCommunity, ChannelCategory, ChatChannel } from '@/types/chat';

interface ManageCommunityModalProps {
  isOpen: boolean;
  onClose: () => void;
  community: ChatCommunity;
  onUpdateCommunity: (updated: ChatCommunity) => void;
  onOpenRoles: () => void;
  onDeleteCommunity?: (commId: string) => void;
  onToast: (msg: string) => void;
}

const BADGE_PRESETS = ['COUNCIL', 'COMMUNITY', 'PARLIAMENT', 'MUN', 'SUMMIT', 'SECRETARIAT', 'SERVER', 'VIP'];
const ICON_PRESETS = ['🏛️', '🌐', '🛡️', '⚖️', '💬', '🚀', '🔥', '⚡', '✨'];

export function ManageCommunityModal({
  isOpen,
  onClose,
  community,
  onUpdateCommunity,
  onOpenRoles,
  onDeleteCommunity,
  onToast,
}: ManageCommunityModalProps) {
  if (!isOpen) return null;

  const [activeTab, setActiveTab] = useState<'overview' | 'channels' | 'danger'>('overview');

  // Overview state
  const [name, setName] = useState(community.name);
  const [icon, setIcon] = useState(community.icon || '🏛️');
  const [badge, setBadge] = useState(community.badge || 'COUNCIL');
  const [description, setDescription] = useState(community.description || '');

  // Categories and channels state
  const [categories, setCategories] = useState<ChannelCategory[]>(community.categories || []);
  const [channels, setChannels] = useState<ChatChannel[]>(community.channels || []);

  // Quick Channel Edit / Add state
  const [newCatName, setNewCatName] = useState('');
  const [showAddCat, setShowAddCat] = useState(false);

  // Channel edit modal / popover
  const [editingChannel, setEditingChannel] = useState<ChatChannel | null>(null);

  const handleSaveOverview = () => {
    if (!name.trim()) {
      onToast('Server name cannot be empty');
      return;
    }

    const updated: ChatCommunity = {
      ...community,
      name: name.trim(),
      icon,
      badge: badge.trim(),
      description: description.trim(),
      categories,
      channels,
    };

    onUpdateCommunity(updated);
    onToast(`Server "${updated.name}" settings updated`);
    onClose();
  };

  const handleAddCategory = () => {
    if (!newCatName.trim()) return;
    const newCat: ChannelCategory = {
      id: `cat-${Date.now()}`,
      name: newCatName.trim().toUpperCase(),
    };
    setCategories([...categories, newCat]);
    setNewCatName('');
    setShowAddCat(false);
    onToast(`Category [${newCat.name}] added`);
  };

  const handleDeleteCategory = (catId: string) => {
    setCategories(categories.filter((c) => c.id !== catId));
    // Move channels to uncategorized
    setChannels(
      channels.map((ch) => (ch.categoryId === catId ? { ...ch, categoryId: undefined } : ch))
    );
    onToast('Category removed');
  };

  const handleSaveChannelEdit = (updatedChan: ChatChannel) => {
    setChannels(channels.map((ch) => (ch.id === updatedChan.id ? updatedChan : ch)));
    setEditingChannel(null);
    onToast(`Channel #${updatedChan.name} updated`);
  };

  const handleDeleteChannel = (chanId: string) => {
    if (channels.length <= 1) {
      onToast('Cannot delete the last remaining channel');
      return;
    }
    setChannels(channels.filter((c) => c.id !== chanId));
    setEditingChannel(null);
    onToast('Channel deleted');
  };

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 bg-black/80 backdrop-blur-md z-50 flex items-center justify-center p-3 sm:p-4"
      >
        <motion.div
          initial={{ scale: 0.95, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.95, opacity: 0 }}
          className="w-full max-w-2xl max-h-[90vh] rounded-3xl bg-[#0d0f15] border border-white/10 shadow-2xl flex flex-col overflow-hidden text-white"
        >
          {/* Header */}
          <div className="p-4 sm:p-5 border-b border-white/[0.06] flex items-center justify-between bg-[#0a0b10]">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-2xl bg-purple-600/20 border border-purple-500/30 flex items-center justify-center text-xl">
                {icon}
              </div>
              <div>
                <h3 className="font-display font-semibold text-base sm:text-lg text-white">
                  {name || 'Server Settings'}
                </h3>
                <p className="font-mono text-[10px] text-neutral-400">
                  Custom Diplomatic Community Configuration
                </p>
              </div>
            </div>
            <button
              onClick={onClose}
              className="p-2 rounded-xl text-neutral-400 hover:text-white hover:bg-white/[0.06] transition cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Navigation */}
          <div className="flex items-center gap-1 px-4 sm:px-5 pt-3 border-b border-white/[0.06] bg-[#0c0d13] overflow-x-auto scrollbar-none">
            <button
              onClick={() => setActiveTab('overview')}
              className={`flex items-center gap-2 px-3.5 py-2.5 rounded-t-xl text-xs font-medium transition cursor-pointer border-b-2 ${
                activeTab === 'overview'
                  ? 'border-purple-500 text-purple-300 bg-purple-500/10'
                  : 'border-transparent text-neutral-400 hover:text-neutral-200'
              }`}
            >
              <Settings className="w-3.5 h-3.5" />
              <span>Overview</span>
            </button>

            <button
              onClick={() => setActiveTab('channels')}
              className={`flex items-center gap-2 px-3.5 py-2.5 rounded-t-xl text-xs font-medium transition cursor-pointer border-b-2 ${
                activeTab === 'channels'
                  ? 'border-purple-500 text-purple-300 bg-purple-500/10'
                  : 'border-transparent text-neutral-400 hover:text-neutral-200'
              }`}
            >
              <Hash className="w-3.5 h-3.5" />
              <span>Categories & Channels ({channels.length})</span>
            </button>

            <button
              onClick={() => {
                onClose();
                onOpenRoles();
              }}
              className="flex items-center gap-2 px-3.5 py-2.5 rounded-t-xl text-xs font-medium text-neutral-400 hover:text-purple-300 transition cursor-pointer border-b-2 border-transparent"
            >
              <Shield className="w-3.5 h-3.5 text-purple-400" />
              <span>Roles & Permissions ↗</span>
            </button>

            {onDeleteCommunity && community.id !== 'comm-direct' && (
              <button
                onClick={() => setActiveTab('danger')}
                className={`flex items-center gap-2 px-3.5 py-2.5 rounded-t-xl text-xs font-medium transition cursor-pointer border-b-2 ${
                  activeTab === 'danger'
                    ? 'border-red-500 text-red-300 bg-red-500/10'
                    : 'border-transparent text-neutral-400 hover:text-neutral-200'
                }`}
              >
                <Trash2 className="w-3.5 h-3.5" />
                <span>Danger Zone</span>
              </button>
            )}
          </div>

          {/* Body */}
          <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-5">
            {activeTab === 'overview' && (
              <div className="space-y-4">
                <div className="space-y-1.5">
                  <label className="font-mono text-[10px] text-neutral-400 uppercase tracking-wider block">
                    Server / Community Name
                  </label>
                  <input
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="Enter server or community name..."
                    className="w-full px-3.5 py-2.5 rounded-xl bg-white/[0.04] border border-white/10 text-white text-sm focus:outline-none focus:border-purple-500/50"
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label className="font-mono text-[10px] text-neutral-400 uppercase tracking-wider block">
                      Server Icon / Emblem
                    </label>
                    <div className="flex flex-wrap items-center gap-2">
                      {ICON_PRESETS.map((ic) => (
                        <button
                          key={ic}
                          type="button"
                          onClick={() => setIcon(ic)}
                          className={`w-9 h-9 rounded-xl flex items-center justify-center text-base transition cursor-pointer ${
                            icon === ic
                              ? 'bg-purple-600/30 border-2 border-purple-500 scale-105'
                              : 'bg-white/[0.04] border border-white/10 hover:bg-white/[0.08]'
                          }`}
                        >
                          {ic}
                        </button>
                      ))}
                      <input
                        type="text"
                        maxLength={4}
                        value={icon}
                        onChange={(e) => setIcon(e.target.value)}
                        className="w-12 h-9 text-center rounded-xl bg-white/[0.04] border border-white/10 text-sm focus:outline-none focus:border-purple-500/50"
                        title="Custom emoji"
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <label className="font-mono text-[10px] text-neutral-400 uppercase tracking-wider block">
                      Status Badge
                    </label>
                    <div className="flex flex-wrap items-center gap-1.5">
                      {BADGE_PRESETS.map((bp) => (
                        <button
                          key={bp}
                          type="button"
                          onClick={() => setBadge(bp)}
                          className={`px-2 py-1 rounded-lg text-[10px] font-mono transition cursor-pointer border ${
                            badge === bp
                              ? 'bg-purple-500/20 border-purple-500/40 text-purple-300 font-bold'
                              : 'bg-white/[0.04] border-white/10 text-neutral-400 hover:text-white'
                          }`}
                        >
                          {bp}
                        </button>
                      ))}
                    </div>
                    <input
                      type="text"
                      value={badge}
                      onChange={(e) => setBadge(e.target.value.toUpperCase())}
                      placeholder="Custom Badge (e.g. VIP)"
                      className="w-full px-3 py-1.5 rounded-xl bg-white/[0.04] border border-white/10 text-xs text-white font-mono focus:outline-none"
                    />
                  </div>
                </div>

                <div className="space-y-1.5">
                  <label className="font-mono text-[10px] text-neutral-400 uppercase tracking-wider block">
                    Server Description
                  </label>
                  <textarea
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    rows={3}
                    placeholder="Official diplomatic server, chamber floor and committee caucus dispatches..."
                    className="w-full px-3.5 py-2.5 rounded-xl bg-white/[0.04] border border-white/10 text-white text-xs focus:outline-none focus:border-purple-500/50 resize-none"
                  />
                </div>
              </div>
            )}

            {activeTab === 'channels' && (
              <div className="space-y-5">
                {/* Category Creation */}
                <div className="flex items-center justify-between">
                  <span className="font-mono text-xs text-neutral-400">
                    Organize channels into structured categories
                  </span>
                  {!showAddCat ? (
                    <button
                      type="button"
                      onClick={() => setShowAddCat(true)}
                      className="px-3 py-1.5 rounded-xl bg-white/[0.06] hover:bg-white/[0.1] text-purple-300 font-medium text-xs transition cursor-pointer flex items-center gap-1.5"
                    >
                      <FolderPlus className="w-3.5 h-3.5" />
                      <span>New Category</span>
                    </button>
                  ) : (
                    <div className="flex items-center gap-2">
                      <input
                        type="text"
                        value={newCatName}
                        onChange={(e) => setNewCatName(e.target.value)}
                        placeholder="Category Name"
                        className="px-2.5 py-1 rounded-lg bg-white/[0.06] border border-white/10 text-xs text-white focus:outline-none"
                      />
                      <button
                        type="button"
                        onClick={handleAddCategory}
                        className="px-2.5 py-1 rounded-lg bg-purple-600 hover:bg-purple-500 text-white text-xs font-bold transition cursor-pointer"
                      >
                        Add
                      </button>
                      <button
                        type="button"
                        onClick={() => setShowAddCat(false)}
                        className="p-1 rounded-lg text-neutral-400 hover:text-white transition cursor-pointer"
                      >
                        <X className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  )}
                </div>

                {/* Channel List per Category */}
                <div className="space-y-4">
                  {categories.map((cat) => {
                    const catChans = channels.filter((ch) => ch.categoryId === cat.id);
                    return (
                      <div key={cat.id} className="p-3 rounded-2xl bg-white/[0.02] border border-white/[0.06] space-y-2">
                        <div className="flex items-center justify-between pb-1 border-b border-white/[0.04]">
                          <span className="font-mono text-[10px] text-purple-400 font-bold uppercase tracking-wider">
                            {cat.name}
                          </span>
                          <button
                            type="button"
                            onClick={() => handleDeleteCategory(cat.id)}
                            className="p-1 rounded text-neutral-500 hover:text-red-400 transition cursor-pointer"
                            title="Delete category"
                          >
                            <Trash2 className="w-3 h-3" />
                          </button>
                        </div>

                        <div className="space-y-1">
                          {catChans.map((ch) => (
                            <div
                              key={ch.id}
                              className="flex items-center justify-between p-2 rounded-xl bg-white/[0.02] hover:bg-white/[0.04] transition"
                            >
                              <div className="flex items-center gap-2">
                                {ch.type === 'voice' ? (
                                  <Volume2 className="w-3.5 h-3.5 text-purple-400" />
                                ) : ch.type === 'announcement' ? (
                                  <Bell className="w-3.5 h-3.5 text-amber-400" />
                                ) : (
                                  <Hash className="w-3.5 h-3.5 text-neutral-400" />
                                )}
                                <span className="font-medium text-xs text-white">{ch.name}</span>
                                {ch.isLocked && <Lock className="w-3 h-3 text-amber-400" />}
                              </div>

                              <div className="flex items-center gap-2">
                                <button
                                  type="button"
                                  onClick={() => setEditingChannel(ch)}
                                  className="p-1 text-neutral-400 hover:text-white transition cursor-pointer"
                                  title="Edit channel"
                                >
                                  <Edit2 className="w-3 h-3" />
                                </button>
                                <button
                                  type="button"
                                  onClick={() => handleDeleteChannel(ch.id)}
                                  className="p-1 text-neutral-500 hover:text-red-400 transition cursor-pointer"
                                  title="Delete channel"
                                >
                                  <Trash2 className="w-3 h-3" />
                                </button>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}

            {/* Danger Zone */}
            {activeTab === 'danger' && onDeleteCommunity && (
              <div className="p-4 rounded-2xl bg-red-500/5 border border-red-500/20 space-y-3">
                <h4 className="font-display font-semibold text-xs text-red-400 uppercase tracking-wider">
                  Delete Community Server
                </h4>
                <p className="text-xs text-neutral-300">
                  Permanently erase this community, its categories, channels, subgroups, and chat messages.
                </p>
                <button
                  type="button"
                  onClick={() => {
                    onDeleteCommunity(community.id);
                    onClose();
                  }}
                  className="px-4 py-2 rounded-xl bg-red-600 hover:bg-red-500 text-white font-bold text-xs transition cursor-pointer"
                >
                  Delete Server Permanently
                </button>
              </div>
            )}
          </div>

          {/* Footer */}
          <div className="p-4 sm:p-5 border-t border-white/[0.06] bg-[#0a0b10] flex items-center justify-end gap-3">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-xl bg-white/[0.06] hover:bg-white/[0.1] text-neutral-300 font-medium text-xs transition cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="button"
              onClick={handleSaveOverview}
              className="px-5 py-2 rounded-xl bg-purple-600 hover:bg-purple-500 text-white font-bold text-xs transition shadow-[0_0_15px_rgba(168,85,247,0.3)] cursor-pointer flex items-center gap-2"
            >
              <Check className="w-4 h-4" />
              <span>Save Server Changes</span>
            </button>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}
