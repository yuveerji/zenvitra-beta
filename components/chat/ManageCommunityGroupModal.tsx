'use client';

import React, { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Users,
  Settings,
  Shield,
  Trash2,
  Check,
  X,
  Search,
  Lock,
  MessageSquare,
  Image as ImageIcon,
  BarChart2,
  Sparkles,
  AlertCircle
} from 'lucide-react';
import { ChatCommunityGroup, ChatCommunity, CommunityMember } from '@/types/chat';

interface ManageCommunityGroupModalProps {
  isOpen: boolean;
  onClose: () => void;
  group: ChatCommunityGroup | null;
  community: ChatCommunity;
  onSaveGroup: (updatedGroup: ChatCommunityGroup) => void;
  onDeleteGroup?: (groupId: string) => void;
  onToast: (msg: string) => void;
}

const EMOJI_OPTIONS = ['🏛️', '🇮🇳', '💬', '⚖️', '📢', '🛡️', '🤝', '⚡', '📜', '🌍', '🔥', '🎯', '💡', '✨'];

export function ManageCommunityGroupModal({
  isOpen,
  onClose,
  group,
  community,
  onSaveGroup,
  onDeleteGroup,
  onToast,
}: ManageCommunityGroupModalProps) {
  if (!isOpen || !group) return null;

  const [activeTab, setActiveTab] = useState<'general' | 'members' | 'permissions' | 'danger'>('general');

  // General Settings State
  const [name, setName] = useState(group.name);
  const [icon, setIcon] = useState(group.icon || '💬');
  const [description, setDescription] = useState(group.description || '');

  // Members Management State
  const communityMembers: CommunityMember[] = useMemo(() => {
    if (community.members && community.members.length > 0) {
      return community.members;
    }
    return [
      {
        id: 'u_self',
        name: 'You (Founding Architect)',
        username: 'you',
        status: 'online',
        roleIds: ['role-owner'],
        customStatus: 'Community Admin'
      },
      {
        id: 'u_rajesh_mp',
        name: 'Hon. Rajesh Kumar',
        username: 'rajesh_loksabha',
        status: 'online',
        roleIds: ['role-delegate'],
        customStatus: 'Member of Parliament'
      },
      {
        id: 'u_priya_mp',
        name: 'Priya Sharma (MP)',
        username: 'priya_mp',
        status: 'online',
        roleIds: ['role-delegate'],
        customStatus: 'Constituency Delegate'
      },
      {
        id: 'u_elena_press',
        name: 'Elena Rostova',
        username: 'elena_press',
        status: 'idle',
        roleIds: ['role-delegate'],
        customStatus: 'Parliamentary Press Attaché'
      },
      {
        id: 'u_secretariat',
        name: 'Secretariat General',
        username: 'sec_gen',
        status: 'online',
        roleIds: ['role-owner'],
        customStatus: 'Assembly Speaker Secretariat'
      }
    ];
  }, [community.members]);

  const [memberSearch, setMemberSearch] = useState('');
  const [selectedRoleFilter, setSelectedRoleFilter] = useState<string>('all');

  // Assigned members in this subgroup
  const [assignedMemberIds, setAssignedMemberIds] = useState<string[]>(() => {
    if (group.members && group.members.length > 0) {
      return group.members.map((m) => m.id);
    }
    return communityMembers.slice(0, 3).map((m) => m.id);
  });

  // Permissions Settings State
  const [postingMode, setPostingMode] = useState<'all' | 'admins' | 'roles'>(() => {
    if (group.onlyAdminsCanPost) return 'admins';
    if (group.allowedRoleIds && group.allowedRoleIds.length > 0) return 'roles';
    return 'all';
  });
  const [allowedRoleIds, setAllowedRoleIds] = useState<string[]>(group.allowedRoleIds || []);
  const [allowMediaUploads, setAllowMediaUploads] = useState<boolean>(group.allowMediaUploads !== false);
  const [allowPolls, setAllowPolls] = useState<boolean>(group.allowPolls !== false);
  const [isLocked, setIsLocked] = useState<boolean>(!!group.isLocked);

  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

  // Filtered members list
  const filteredMembers = useMemo(() => {
    return communityMembers.filter((m) => {
      const matchesSearch =
        m.name.toLowerCase().includes(memberSearch.toLowerCase()) ||
        m.username.toLowerCase().includes(memberSearch.toLowerCase());
      const matchesRole =
        selectedRoleFilter === 'all' || m.roleIds.includes(selectedRoleFilter);
      return matchesSearch && matchesRole;
    });
  }, [communityMembers, memberSearch, selectedRoleFilter]);

  const toggleMember = (memberId: string) => {
    setAssignedMemberIds((prev) =>
      prev.includes(memberId) ? prev.filter((id) => id !== memberId) : [...prev, memberId]
    );
  };

  const handleSelectAllFiltered = () => {
    const allFilteredIds = filteredMembers.map((m) => m.id);
    setAssignedMemberIds((prev) => Array.from(new Set([...prev, ...allFilteredIds])));
    onToast(`Added all ${allFilteredIds.length} delegates to group`);
  };

  const handleDeselectAll = () => {
    setAssignedMemberIds([]);
    onToast('Removed all members from group');
  };

  const toggleRolePermission = (roleId: string) => {
    setAllowedRoleIds((prev) =>
      prev.includes(roleId) ? prev.filter((id) => id !== roleId) : [...prev, roleId]
    );
  };

  const handleSave = () => {
    if (!name.trim()) {
      onToast('Group name cannot be empty');
      return;
    }

    const assignedMembers = communityMembers.filter((m) => assignedMemberIds.includes(m.id));

    const updated: ChatCommunityGroup = {
      ...group,
      name: name.trim(),
      icon,
      description: description.trim(),
      membersCount: assignedMembers.length,
      members: assignedMembers,
      onlyAdminsCanPost: postingMode === 'admins',
      allowedRoleIds: postingMode === 'roles' ? allowedRoleIds : undefined,
      allowMediaUploads,
      allowPolls,
      isLocked,
    };

    onSaveGroup(updated);
    onToast(`Subgroup "${updated.name}" settings saved`);
    onClose();
  };

  const handleDelete = () => {
    if (onDeleteGroup) {
      onDeleteGroup(group.id);
      onToast(`Subgroup "${group.name}" deleted`);
      onClose();
    }
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
          {/* ── Modal Header ── */}
          <div className="p-4 sm:p-5 border-b border-white/[0.06] flex items-center justify-between bg-[#0a0b10]">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-2xl bg-purple-600/20 border border-purple-500/30 flex items-center justify-center text-xl shadow-inner">
                {icon}
              </div>
              <div>
                <h3 className="font-display font-semibold text-base sm:text-lg text-white flex items-center gap-2">
                  <span>{name || 'Configure Subgroup'}</span>
                  {isLocked && <Lock className="w-3.5 h-3.5 text-amber-400" />}
                </h3>
                <p className="font-mono text-[10px] text-neutral-400">
                  {community.name} • WhatsApp Communities Model
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

          {/* ── Tab Navigation ── */}
          <div className="flex items-center gap-1 px-4 sm:px-5 pt-3 border-b border-white/[0.06] bg-[#0c0d13] overflow-x-auto scrollbar-none">
            <button
              onClick={() => setActiveTab('general')}
              className={`flex items-center gap-2 px-3.5 py-2.5 rounded-t-xl text-xs font-medium transition cursor-pointer border-b-2 ${
                activeTab === 'general'
                  ? 'border-purple-500 text-purple-300 bg-purple-500/10'
                  : 'border-transparent text-neutral-400 hover:text-neutral-200'
              }`}
            >
              <Settings className="w-3.5 h-3.5" />
              <span>General Details</span>
            </button>

            <button
              onClick={() => setActiveTab('members')}
              className={`flex items-center gap-2 px-3.5 py-2.5 rounded-t-xl text-xs font-medium transition cursor-pointer border-b-2 ${
                activeTab === 'members'
                  ? 'border-purple-500 text-purple-300 bg-purple-500/10'
                  : 'border-transparent text-neutral-400 hover:text-neutral-200'
              }`}
            >
              <Users className="w-3.5 h-3.5" />
              <span>
                Assigned Members ({assignedMemberIds.length})
              </span>
            </button>

            <button
              onClick={() => setActiveTab('permissions')}
              className={`flex items-center gap-2 px-3.5 py-2.5 rounded-t-xl text-xs font-medium transition cursor-pointer border-b-2 ${
                activeTab === 'permissions'
                  ? 'border-purple-500 text-purple-300 bg-purple-500/10'
                  : 'border-transparent text-neutral-400 hover:text-neutral-200'
              }`}
            >
              <Shield className="w-3.5 h-3.5" />
              <span>Posting & Permissions</span>
            </button>

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
          </div>

          {/* ── Tab Contents (Scrollable Body) ── */}
          <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-5">
            {/* 1. GENERAL DETAILS */}
            {activeTab === 'general' && (
              <div className="space-y-4">
                <div className="space-y-1.5">
                  <label className="font-mono text-[10px] text-neutral-400 uppercase tracking-wider block">
                    Subgroup Name (e.g. Lok Sabha, Standing Committee)
                  </label>
                  <input
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="e.g. Lok Sabha - Floor Deliberations"
                    className="w-full px-3.5 py-2.5 rounded-xl bg-white/[0.04] border border-white/10 text-white text-sm focus:outline-none focus:border-purple-500/50"
                  />
                </div>

                <div className="space-y-2">
                  <label className="font-mono text-[10px] text-neutral-400 uppercase tracking-wider block">
                    Subgroup Icon / Emoji
                  </label>
                  <div className="flex flex-wrap items-center gap-2">
                    {EMOJI_OPTIONS.map((e) => (
                      <button
                        key={e}
                        type="button"
                        onClick={() => setIcon(e)}
                        className={`w-9 h-9 rounded-xl flex items-center justify-center text-base transition cursor-pointer ${
                          icon === e
                            ? 'bg-purple-600/30 border-2 border-purple-500 shadow-md scale-105'
                            : 'bg-white/[0.04] border border-white/10 hover:bg-white/[0.08]'
                        }`}
                      >
                        {e}
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

                <div className="space-y-1.5">
                  <label className="font-mono text-[10px] text-neutral-400 uppercase tracking-wider block">
                    Description & Mandate
                  </label>
                  <textarea
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    rows={3}
                    placeholder="Describe the mandate, jurisdiction, or purpose of this subgroup..."
                    className="w-full px-3.5 py-2.5 rounded-xl bg-white/[0.04] border border-white/10 text-white text-xs focus:outline-none focus:border-purple-500/50 resize-none leading-relaxed"
                  />
                </div>

                <div className="p-3.5 rounded-2xl bg-purple-500/5 border border-purple-500/20 flex items-start gap-3 text-xs text-purple-200">
                  <Sparkles className="w-4 h-4 text-purple-400 shrink-0 mt-0.5" />
                  <span>
                    Subgroups in Zenvitra function just like WhatsApp Communities — you can organize specialized working groups, parliamentary bodies, or secretariats within a parent community.
                  </span>
                </div>
              </div>
            )}

            {/* 2. ASSIGNED MEMBERS ("people of Lok Sabha will be added") */}
            {activeTab === 'members' && (
              <div className="space-y-4">
                <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-2.5">
                  <div className="relative flex-1">
                    <Search className="w-4 h-4 text-neutral-400 absolute left-3 top-1/2 -translate-y-1/2" />
                    <input
                      type="text"
                      value={memberSearch}
                      onChange={(e) => setMemberSearch(e.target.value)}
                      placeholder="Search community delegates..."
                      className="w-full pl-9 pr-3.5 py-2 rounded-xl bg-white/[0.04] border border-white/10 text-white text-xs focus:outline-none focus:border-purple-500/50"
                    />
                  </div>

                  {community.roles && community.roles.length > 0 && (
                    <select
                      value={selectedRoleFilter}
                      onChange={(e) => setSelectedRoleFilter(e.target.value)}
                      aria-label="Filter by community role"
                      className="px-3 py-2 rounded-xl bg-[#13151f] border border-white/10 text-xs text-neutral-200 focus:outline-none cursor-pointer"
                    >
                      <option value="all">Filter: All Roles</option>
                      {community.roles.map((r) => (
                        <option key={r.id} value={r.id}>
                          Role: {r.name}
                        </option>
                      ))}
                    </select>
                  )}
                </div>

                <div className="flex items-center justify-between text-xs text-neutral-400 px-1">
                  <span>
                    {assignedMemberIds.length} of {communityMembers.length} delegates added to this subgroup
                  </span>
                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={handleSelectAllFiltered}
                      className="text-purple-400 hover:text-purple-300 transition cursor-pointer font-medium"
                    >
                      Add All Filtered
                    </button>
                    <span>•</span>
                    <button
                      type="button"
                      onClick={handleDeselectAll}
                      className="text-neutral-500 hover:text-neutral-300 transition cursor-pointer"
                    >
                      Deselect All
                    </button>
                  </div>
                </div>

                {/* Member Roster List */}
                <div className="space-y-1.5 max-h-64 overflow-y-auto pr-1">
                  {filteredMembers.length === 0 ? (
                    <div className="text-center py-8 text-neutral-500 text-xs">
                      No delegates found matching search or role filter.
                    </div>
                  ) : (
                    filteredMembers.map((member) => {
                      const isAssigned = assignedMemberIds.includes(member.id);
                      return (
                        <div
                          key={member.id}
                          onClick={() => toggleMember(member.id)}
                          className={`flex items-center justify-between p-2.5 rounded-xl border transition cursor-pointer ${
                            isAssigned
                              ? 'bg-purple-600/10 border-purple-500/30 text-white'
                              : 'bg-white/[0.02] border-white/[0.04] text-neutral-300 hover:bg-white/[0.05]'
                          }`}
                        >
                          <div className="flex items-center gap-3 min-w-0">
                            <div className="relative">
                              <div className="w-8 h-8 rounded-full bg-purple-500/20 border border-purple-500/30 flex items-center justify-center font-bold text-xs text-purple-300">
                                {member.name.charAt(0)}
                              </div>
                              <span
                                className={`absolute bottom-0 right-0 w-2 h-2 rounded-full ring-2 ring-[#0d0f15] ${
                                  member.status === 'online'
                                    ? 'bg-emerald-400'
                                    : member.status === 'idle'
                                    ? 'bg-amber-400'
                                    : 'bg-neutral-500'
                                }`}
                              />
                            </div>
                            <div className="min-w-0">
                              <div className="flex items-center gap-2">
                                <span className="font-medium text-xs truncate">{member.name}</span>
                                <span className="font-mono text-[9px] text-neutral-400">
                                  @{member.username}
                                </span>
                              </div>
                              {member.customStatus && (
                                <span className="font-mono text-[9px] text-purple-300/80 truncate block">
                                  {member.customStatus}
                                </span>
                              )}
                            </div>
                          </div>

                          <div
                            className={`w-5 h-5 rounded-lg border flex items-center justify-center transition ${
                              isAssigned
                                ? 'bg-purple-600 border-purple-500 text-white'
                                : 'border-white/20 bg-white/[0.04]'
                            }`}
                          >
                            {isAssigned && <Check className="w-3.5 h-3.5 stroke-[3]" />}
                          </div>
                        </div>
                      );
                    })
                  )}
                </div>
              </div>
            )}

            {/* 3. PERMISSIONS ("and they can talk in it or whatelse admin allows") */}
            {activeTab === 'permissions' && (
              <div className="space-y-4">
                {/* Posting Control */}
                <div className="p-4 rounded-2xl bg-white/[0.02] border border-white/[0.06] space-y-3">
                  <div className="flex items-center gap-2">
                    <MessageSquare className="w-4 h-4 text-purple-400" />
                    <h4 className="font-display font-medium text-xs text-white">
                      Who Can Send Messages in this Subgroup?
                    </h4>
                  </div>

                  <div className="space-y-2">
                    <label className="flex items-center gap-3 p-2.5 rounded-xl bg-white/[0.02] hover:bg-white/[0.04] border border-white/[0.04] cursor-pointer transition">
                      <input
                        type="radio"
                        name="postingMode"
                        checked={postingMode === 'all'}
                        onChange={() => setPostingMode('all')}
                        className="accent-purple-500"
                      />
                      <div>
                        <span className="font-medium text-xs text-white block">
                          All Subgroup Members
                        </span>
                        <span className="font-mono text-[10px] text-neutral-400">
                          Any delegate added to this subgroup can send messages freely.
                        </span>
                      </div>
                    </label>

                    <label className="flex items-center gap-3 p-2.5 rounded-xl bg-white/[0.02] hover:bg-white/[0.04] border border-white/[0.04] cursor-pointer transition">
                      <input
                        type="radio"
                        name="postingMode"
                        checked={postingMode === 'admins'}
                        onChange={() => setPostingMode('admins')}
                        className="accent-purple-500"
                      />
                      <div>
                        <span className="font-medium text-xs text-white block">
                          Only Administrators (Broadcast Subgroup)
                        </span>
                        <span className="font-mono text-[10px] text-neutral-400">
                          Delegates have read-only access; only server owners and chairs can broadcast.
                        </span>
                      </div>
                    </label>

                    <label className="flex items-center gap-3 p-2.5 rounded-xl bg-white/[0.02] hover:bg-white/[0.04] border border-white/[0.04] cursor-pointer transition">
                      <input
                        type="radio"
                        name="postingMode"
                        checked={postingMode === 'roles'}
                        onChange={() => setPostingMode('roles')}
                        className="accent-purple-500"
                      />
                      <div>
                        <span className="font-medium text-xs text-white block">
                          Specific Authorized Roles
                        </span>
                        <span className="font-mono text-[10px] text-neutral-400">
                          Only members holding designated roles can post messages here.
                        </span>
                      </div>
                    </label>
                  </div>

                  {postingMode === 'roles' && (
                    <div className="pl-6 pt-2 space-y-2 border-t border-white/[0.04]">
                      <span className="font-mono text-[10px] text-neutral-400 uppercase tracking-wider block">
                        Select Roles Allowed to Talk:
                      </span>
                      <div className="flex flex-wrap gap-2">
                        {community.roles && community.roles.length > 0 ? (
                          community.roles.map((role) => {
                            const isSelected = allowedRoleIds.includes(role.id);
                            return (
                              <button
                                key={role.id}
                                type="button"
                                onClick={() => toggleRolePermission(role.id)}
                                className={`px-2.5 py-1 rounded-lg text-xs font-mono transition cursor-pointer flex items-center gap-1.5 border ${
                                  isSelected
                                    ? 'bg-purple-500/20 border-purple-500/40 text-purple-300'
                                    : 'bg-white/[0.04] border-white/10 text-neutral-400 hover:text-white'
                                }`}
                              >
                                <span>{role.name}</span>
                                {isSelected && <Check className="w-3.5 h-3.5 text-purple-400" />}
                              </button>
                            );
                          })
                        ) : (
                          <span className="text-neutral-500 text-xs font-mono">No custom roles defined yet.</span>
                        )}
                      </div>
                    </div>
                  )}
                </div>

                {/* Additional Admin Permissions */}
                <div className="space-y-2">
                  <div className="p-3.5 rounded-2xl bg-white/[0.02] border border-white/[0.06] flex items-center justify-between">
                    <div className="flex items-center gap-2.5">
                      <ImageIcon className="w-4 h-4 text-emerald-400" />
                      <div>
                        <span className="text-xs font-medium text-white block">Allow Media & File Uploads</span>
                        <span className="font-mono text-[10px] text-neutral-400">
                          Members can attach documents, resolutions, images, and voice notes.
                        </span>
                      </div>
                    </div>
                    <input
                      type="checkbox"
                      checked={allowMediaUploads}
                      onChange={(e) => setAllowMediaUploads(e.target.checked)}
                      aria-label="Allow media and file uploads"
                      className="w-4 h-4 accent-purple-500 cursor-pointer"
                    />
                  </div>

                  <div className="p-3.5 rounded-2xl bg-white/[0.02] border border-white/[0.06] flex items-center justify-between">
                    <div className="flex items-center gap-2.5">
                      <BarChart2 className="w-4 h-4 text-cyan-400" />
                      <div>
                        <span className="text-xs font-medium text-white block">Allow Polls & Quorum Voting</span>
                        <span className="font-mono text-[10px] text-neutral-400">
                          Members can create interactive votes and straw polls in this subgroup.
                        </span>
                      </div>
                    </div>
                    <input
                      type="checkbox"
                      checked={allowPolls}
                      onChange={(e) => setAllowPolls(e.target.checked)}
                      aria-label="Allow polls and quorum voting"
                      className="w-4 h-4 accent-purple-500 cursor-pointer"
                    />
                  </div>

                  <div className="p-3.5 rounded-2xl bg-amber-500/5 border border-amber-500/20 flex items-center justify-between">
                    <div className="flex items-center gap-2.5">
                      <Lock className="w-4 h-4 text-amber-400" />
                      <div>
                        <span className="text-xs font-medium text-amber-300 block">Lock / Freeze Subgroup</span>
                        <span className="font-mono text-[10px] text-amber-400/80">
                          Temporarily freeze all conversations; members can only view past archive.
                        </span>
                      </div>
                    </div>
                    <input
                      type="checkbox"
                      checked={isLocked}
                      onChange={(e) => setIsLocked(e.target.checked)}
                      aria-label="Lock or freeze subgroup"
                      className="w-4 h-4 accent-amber-500 cursor-pointer"
                    />
                  </div>
                </div>
              </div>
            )}

            {/* 4. DANGER ZONE */}
            {activeTab === 'danger' && (
              <div className="space-y-4">
                <div className="p-4 rounded-2xl bg-red-500/5 border border-red-500/20 space-y-3">
                  <div className="flex items-center gap-2 text-red-400">
                    <AlertCircle className="w-4 h-4" />
                    <h4 className="font-display font-semibold text-xs uppercase tracking-wider">
                      Delete Subgroup Caucus
                    </h4>
                  </div>
                  <p className="text-xs text-neutral-300 leading-relaxed">
                    Deleting this subgroup will permanently remove it from <strong className="text-white">{community.name}</strong> and purge all subgroup messages. This action cannot be undone.
                  </p>

                  {!showDeleteConfirm ? (
                    <button
                      type="button"
                      onClick={() => setShowDeleteConfirm(true)}
                      className="px-4 py-2 rounded-xl bg-red-500/20 hover:bg-red-500/30 border border-red-500/40 text-red-300 font-medium text-xs transition cursor-pointer flex items-center gap-2"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                      <span>Delete Subgroup...</span>
                    </button>
                  ) : (
                    <div className="flex items-center gap-3 p-3 rounded-xl bg-red-950/40 border border-red-500/40">
                      <span className="text-xs text-red-200 font-medium">Are you sure?</span>
                      <button
                        type="button"
                        onClick={handleDelete}
                        className="px-3 py-1.5 rounded-lg bg-red-600 hover:bg-red-500 text-white font-bold text-xs transition cursor-pointer"
                      >
                        Yes, Delete Permanently
                      </button>
                      <button
                        type="button"
                        onClick={() => setShowDeleteConfirm(false)}
                        className="px-3 py-1.5 rounded-lg bg-white/10 hover:bg-white/20 text-neutral-300 text-xs transition cursor-pointer"
                      >
                        Cancel
                      </button>
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>

          {/* ── Modal Footer ── */}
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
              onClick={handleSave}
              className="px-5 py-2 rounded-xl bg-purple-600 hover:bg-purple-500 text-white font-bold text-xs transition shadow-[0_0_15px_rgba(168,85,247,0.3)] cursor-pointer flex items-center gap-2"
            >
              <Check className="w-4 h-4" />
              <span>Save Subgroup Configuration</span>
            </button>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}
