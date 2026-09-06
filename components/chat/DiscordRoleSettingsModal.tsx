'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  ShieldCheck, 
  Plus, 
  Trash2, 
  Check, 
  X, 
  Users, 
  Lock, 
  Sliders, 
  Search
} from 'lucide-react';
import { DiscordRole, DiscordRolePermissions, CommunityMember } from '@/types/chat';

interface DiscordRoleSettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
  communityName: string;
  roles: DiscordRole[];
  members: CommunityMember[];
  canManageRoles: boolean;
  onUpdateRoles: (newRoles: DiscordRole[]) => void;
  onUpdateMembers: (newMembers: CommunityMember[]) => void;
  onToast: (msg: string) => void;
}

const PRESET_COLORS = [
  '#f59e0b',
  '#a855f7',
  '#06b6d4',
  '#ec4899',
  '#10b981',
  '#3b82f6',
  '#ef4444',
  '#94a3b8',
];

export function DiscordRoleSettingsModal({
  isOpen,
  onClose,
  communityName,
  roles,
  members,
  canManageRoles,
  onUpdateRoles,
  onUpdateMembers,
  onToast
}: DiscordRoleSettingsModalProps) {
  const [selectedRoleId, setSelectedRoleId] = useState<string>(roles[0]?.id || '');
  const [activeTab, setActiveTab] = useState<'display' | 'permissions' | 'members'>('display');
  const [memberSearchQuery, setMemberSearchQuery] = useState('');

  if (!isOpen) return null;

  const currentRole = roles.find((r) => r.id === selectedRoleId) || roles[0];

  const handleCreateRole = () => {
    if (!canManageRoles) {
      onToast('Permission denied: Missing Manage Roles permission');
      return;
    }
    const newId = 'role-' + Date.now();
    const newRole: DiscordRole = {
      id: newId,
      name: 'new role',
      color: '#94a3b8',
      hoist: true,
      position: roles.length + 1,
      permissions: {
        manageServer: false,
        manageRoles: false,
        manageChannels: false,
        kickMembers: false,
        banMembers: false,
        sendMessages: true,
        embedLinks: true,
        attachFiles: true,
        connectVoice: true,
        speakVoice: true,
        prioritySpeaker: false
      }
    };
    onUpdateRoles([...roles, newRole]);
    setSelectedRoleId(newId);
    onToast('Created new role');
  };

  const handleDeleteRole = (roleId: string) => {
    if (!canManageRoles) {
      onToast('Permission denied: Missing Manage Roles permission');
      return;
    }
    if (roles.length <= 1) {
      onToast('Cannot delete the last role');
      return;
    }
    const updated = roles.filter((r) => r.id !== roleId);
    onUpdateRoles(updated);
    const updatedMembers = members.map((m) => ({
      ...m,
      roleIds: m.roleIds.filter((id) => id !== roleId)
    }));
    onUpdateMembers(updatedMembers);
    setSelectedRoleId(updated[0]?.id || '');
    onToast('Role deleted');
  };

  const handleUpdateRole = (updatedRole: DiscordRole) => {
    if (!canManageRoles) {
      onToast('Permission denied: Missing Manage Roles permission');
      return;
    }
    const updated = roles.map((r) => (r.id === updatedRole.id ? updatedRole : r));
    onUpdateRoles(updated);
  };

  const handleTogglePermission = (permKey: keyof DiscordRolePermissions) => {
    if (!canManageRoles || !currentRole) return;
    const updated = {
      ...currentRole,
      permissions: {
        ...currentRole.permissions,
        [permKey]: !currentRole.permissions[permKey]
      }
    };
    handleUpdateRole(updated);
  };

  const handleToggleMemberRole = (memberId: string, roleId: string) => {
    if (!canManageRoles) {
      onToast('Permission denied: Missing Manage Roles permission');
      return;
    }
    const updatedMembers = members.map((m) => {
      if (m.id !== memberId) return m;
      const has = m.roleIds.includes(roleId);
      return {
        ...m,
        roleIds: has ? m.roleIds.filter((id) => id !== roleId) : [...m.roleIds, roleId]
      };
    });
    onUpdateMembers(updatedMembers);
  };

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-black/80 backdrop-blur-md">
        <motion.div
          initial={{ opacity: 0, scale: 0.96 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.96 }}
          className="w-full max-w-4xl h-[640px] bg-[#0c0e17] border border-white/10 rounded-3xl shadow-2xl flex flex-col overflow-hidden"
        >
          {/* Header */}
          <div className="h-14 border-b border-white/[0.08] px-6 flex items-center justify-between bg-[#0e111d]">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-xl bg-purple-500/20 border border-purple-500/30 flex items-center justify-center text-purple-300">
                <ShieldCheck className="w-4 h-4" />
              </div>
              <div>
                <h3 className="font-display font-bold text-sm text-white flex items-center gap-2">
                  Roles — {communityName}
                </h3>
                <p className="font-mono text-[10px] text-neutral-400">
                  Use roles to group your members and assign permissions
                </p>
              </div>
            </div>

            <div className="flex items-center gap-3">
              {!canManageRoles && (
                <span className="font-mono text-[10px] px-2.5 py-1 rounded-full bg-amber-500/10 border border-amber-500/30 text-amber-300 flex items-center gap-1.5">
                  <Lock className="w-3 h-3" />
                  <span>View Only</span>
                </span>
              )}
              <button
                onClick={onClose}
                className="p-1.5 rounded-xl text-neutral-400 hover:text-white hover:bg-white/[0.06] transition cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Modal Content: Left List & Right Editor */}
          <div className="flex-1 flex overflow-hidden">
            {/* Left Roles Sidebar */}
            <div className="w-64 border-r border-white/[0.06] bg-[#080a11] flex flex-col p-3 gap-3">
              <div className="flex items-center justify-between px-2 pt-1">
                <span className="font-mono text-[9px] uppercase tracking-wider text-neutral-400 font-bold">
                  ROLES — {roles.length}
                </span>
                {canManageRoles && (
                  <button
                    onClick={handleCreateRole}
                    className="p-1 rounded-lg bg-purple-600 hover:bg-purple-500 text-white transition flex items-center justify-center cursor-pointer"
                    title="Create Role"
                  >
                    <Plus className="w-3.5 h-3.5" />
                  </button>
                )}
              </div>

              <div className="flex-1 overflow-y-auto space-y-1 pr-1">
                {roles.map((role) => {
                  const isSelected = role.id === currentRole?.id;
                  const assignedCount = members.filter((m) => m.roleIds.includes(role.id)).length;
                  return (
                    <button
                      key={role.id}
                      onClick={() => setSelectedRoleId(role.id)}
                      className={`w-full flex items-center justify-between p-2.5 rounded-xl text-xs transition text-left cursor-pointer group ${
                        isSelected 
                          ? 'bg-purple-500/20 border border-purple-500/30 text-white font-medium shadow-sm' 
                          : 'text-neutral-400 hover:bg-white/[0.04] hover:text-neutral-200 border border-transparent'
                      }`}
                    >
                      <div className="flex items-center gap-2.5 truncate">
                        <div
                          className="w-3 h-3 rounded-full shrink-0 shadow-sm"
                          style={{ backgroundColor: role.color }}
                        />
                        <span className="truncate">{role.name}</span>
                      </div>
                      <span className="font-mono text-[10px] text-neutral-500 shrink-0">
                        {assignedCount}
                      </span>
                    </button>
                  );
                })}
              </div>

              {canManageRoles && currentRole && (
                <button
                  onClick={() => handleDeleteRole(currentRole.id)}
                  className="w-full py-2 px-3 rounded-xl border border-red-500/20 bg-red-500/10 hover:bg-red-500/20 text-red-400 text-xs font-semibold flex items-center justify-center gap-2 transition cursor-pointer"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                  <span>Delete Role</span>
                </button>
              )}
            </div>

            {/* Right Role Detail / Editor */}
            {currentRole ? (
              <div className="flex-1 flex flex-col overflow-hidden bg-[#0a0c13]">
                {/* Tabs Bar */}
                <div className="h-12 border-b border-white/[0.06] px-5 flex items-center gap-6 bg-[#080a10]">
                  <button
                    onClick={() => setActiveTab('display')}
                    className={`h-full font-display font-medium text-xs border-b-2 flex items-center gap-1.5 transition cursor-pointer ${
                      activeTab === 'display' 
                        ? 'border-purple-400 text-white' 
                        : 'border-transparent text-neutral-400 hover:text-neutral-200'
                    }`}
                  >
                    <Sliders className="w-3.5 h-3.5" />
                    <span>Display</span>
                  </button>

                  <button
                    onClick={() => setActiveTab('permissions')}
                    className={`h-full font-display font-medium text-xs border-b-2 flex items-center gap-1.5 transition cursor-pointer ${
                      activeTab === 'permissions' 
                        ? 'border-purple-400 text-white' 
                        : 'border-transparent text-neutral-400 hover:text-neutral-200'
                    }`}
                  >
                    <Lock className="w-3.5 h-3.5" />
                    <span>Permissions</span>
                  </button>

                  <button
                    onClick={() => setActiveTab('members')}
                    className={`h-full font-display font-medium text-xs border-b-2 flex items-center gap-1.5 transition cursor-pointer ${
                      activeTab === 'members' 
                        ? 'border-purple-400 text-white' 
                        : 'border-transparent text-neutral-400 hover:text-neutral-200'
                    }`}
                  >
                    <Users className="w-3.5 h-3.5" />
                    <span>Manage Members</span>
                  </button>
                </div>

                {/* Tab Workspace */}
                <div className="flex-1 overflow-y-auto p-6">
                  {activeTab === 'display' && (
                    <div className="space-y-6 max-w-xl">
                      {/* Role Name */}
                      <div className="space-y-2">
                        <label className="font-mono text-[10px] text-neutral-400 uppercase tracking-wider block">
                          Role Name
                        </label>
                        <input
                          type="text"
                          disabled={!canManageRoles}
                          value={currentRole.name}
                          onChange={(e) => handleUpdateRole({ ...currentRole, name: e.target.value })}
                          className="w-full px-3 py-2 rounded-2xl bg-white/[0.04] border border-white/10 text-xs text-white focus:outline-none focus:border-purple-500/50 disabled:opacity-50"
                        />
                      </div>

                      {/* Role Color */}
                      <div className="space-y-2">
                        <label className="font-mono text-[10px] text-neutral-400 uppercase tracking-wider block">
                          Role Color
                        </label>
                        <div className="flex items-center gap-2.5 flex-wrap">
                          {PRESET_COLORS.map((color) => {
                            const isSelected = currentRole.color === color;
                            return (
                              <button
                                key={color}
                                disabled={!canManageRoles}
                                onClick={() => handleUpdateRole({ ...currentRole, color })}
                                className="w-7 h-7 rounded-xl flex items-center justify-center transition shadow-sm cursor-pointer disabled:opacity-50 relative"
                                style={{ backgroundColor: color }}
                              >
                                {isSelected && <Check className="w-3.5 h-3.5 text-white stroke-[3]" />}
                              </button>
                            );
                          })}
                          <input
                            type="color"
                            disabled={!canManageRoles}
                            value={currentRole.color}
                            onChange={(e) => handleUpdateRole({ ...currentRole, color: e.target.value })}
                            className="w-8 h-8 rounded-xl bg-transparent border-0 cursor-pointer disabled:opacity-50"
                          />
                        </div>
                      </div>

                      {/* Hoist Toggle */}
                      <div className="p-4 rounded-2xl bg-white/[0.02] border border-white/[0.06] flex items-center justify-between gap-4">
                        <div className="space-y-1 min-w-0">
                          <h4 className="font-display font-medium text-xs text-white">
                            Display role members separately from online members
                          </h4>
                          <p className="font-sans text-[11px] text-neutral-400 leading-relaxed">
                            Members will appear under their own category in the sovereign member roster (hoisted).
                          </p>
                        </div>
                        <button
                          disabled={!canManageRoles}
                          onClick={() => handleUpdateRole({ ...currentRole, hoist: !currentRole.hoist })}
                          className={`w-11 h-6 rounded-full transition-colors relative cursor-pointer disabled:opacity-50 ${
                            currentRole.hoist ? 'bg-purple-600' : 'bg-white/10'
                          }`}
                        >
                          <span
                            className={`w-4 h-4 rounded-full bg-white absolute top-1 transition-transform ${
                              currentRole.hoist ? 'left-6' : 'left-1'
                            }`}
                          />
                        </button>
                      </div>

                      {/* Discord Live Message Preview */}
                      <div className="p-4 rounded-2xl bg-black/40 border border-white/[0.06] space-y-2">
                        <span className="font-mono text-[9px] uppercase tracking-wider text-neutral-500 block">
                          Preview in Chat
                        </span>
                        <div className="flex items-start gap-3">
                          <div className="w-8 h-8 rounded-full bg-purple-500/20 text-purple-300 font-bold text-xs flex items-center justify-center">
                            D
                          </div>
                          <div className="min-w-0">
                            <div className="flex items-center gap-2">
                              <span
                                className="font-display font-semibold text-xs"
                                style={{ color: currentRole.color }}
                              >
                                Delegate
                              </span>
                              <span className="font-mono text-[9px] text-neutral-500">Today at 12:45 PM</span>
                            </div>
                            <p className="font-sans text-xs text-neutral-300 mt-0.5">
                              Testing sovereign dispatch formatting with dynamic role coloring.
                            </p>
                          </div>
                        </div>
                      </div>
                    </div>
                  )}

                  {activeTab === 'permissions' && (
                    <div className="space-y-4 max-w-xl">
                      <p className="font-sans text-xs text-neutral-400">
                        Configure the permissions granted to any member assigned this role.
                      </p>

                      <div className="space-y-2">
                        {[
                          { key: 'manageServer', label: 'Manage Server', desc: 'Allows editing caucus name, channels, and community configuration' },
                          { key: 'manageRoles', label: 'Manage Roles', desc: 'Allows creating, editing, and assigning roles below this one' },
                          { key: 'manageChannels', label: 'Manage Channels', desc: 'Allows creating and editing text and voice chambers' },
                          { key: 'kickMembers', label: 'Kick Delegates', desc: 'Allows removing non-compliant delegates from the caucus' },
                          { key: 'banMembers', label: 'Ban Delegates', desc: 'Permanently bars bad actors from sovereign chambers' },
                          { key: 'sendMessages', label: 'Send Messages', desc: 'Allows delegates to broadcast text messages in text channels' },
                          { key: 'attachFiles', label: 'Attach Files & Media', desc: 'Allows sharing dispatches, snaps, documents, and recordings' },
                          { key: 'connectVoice', label: 'Connect to Voice', desc: 'Allows joining voice chambers and audio plenaries' },
                          { key: 'speakVoice', label: 'Speak in Voice', desc: 'Allows speaking over microphone in active voice chambers' },
                          { key: 'prioritySpeaker', label: 'Priority Speaker', desc: 'Lowers other delegates volume when this delegate is speaking' },
                        ].map((perm) => {
                          const isEnabled = !!currentRole.permissions[perm.key as keyof DiscordRolePermissions];
                          return (
                            <div
                              key={perm.key}
                              className="p-3 rounded-2xl bg-white/[0.02] border border-white/[0.04] flex items-center justify-between gap-4"
                            >
                              <div>
                                <h5 className="font-display font-medium text-xs text-white">{perm.label}</h5>
                                <p className="font-sans text-[10px] text-neutral-400">{perm.desc}</p>
                              </div>
                              <button
                                disabled={!canManageRoles}
                                onClick={() => handleTogglePermission(perm.key as keyof DiscordRolePermissions)}
                                className={`w-10 h-5 rounded-full transition-colors relative cursor-pointer shrink-0 disabled:opacity-50 ${
                                  isEnabled ? 'bg-purple-600' : 'bg-white/10'
                                }`}
                              >
                                <span
                                  className={`w-3.5 h-3.5 rounded-full bg-white absolute top-0.5 transition-transform ${
                                    isEnabled ? 'left-5' : 'left-1'
                                  }`}
                                />
                              </button>
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  )}

                  {activeTab === 'members' && (
                    <div className="space-y-4 max-w-xl">
                      <div className="relative">
                        <Search className="w-3.5 h-3.5 text-neutral-400 absolute left-3 top-1/2 -translate-y-1/2" />
                        <input
                          type="text"
                          value={memberSearchQuery}
                          onChange={(e) => setMemberSearchQuery(e.target.value)}
                          placeholder="Search members to toggle role..."
                          className="w-full pl-9 pr-3 py-2 rounded-2xl bg-white/[0.04] border border-white/10 text-xs text-white focus:outline-none focus:border-purple-500/40"
                        />
                      </div>

                      <div className="space-y-1 max-h-96 overflow-y-auto">
                        {members
                          .filter((m) => {
                            if (!memberSearchQuery.trim()) return true;
                            const q = memberSearchQuery.toLowerCase();
                            return m.name.toLowerCase().includes(q) || m.username.toLowerCase().includes(q);
                          })
                          .map((member) => {
                            const hasRole = member.roleIds.includes(currentRole.id);
                            return (
                              <div
                                key={member.id}
                                className="flex items-center justify-between p-2.5 rounded-2xl bg-white/[0.02] border border-white/[0.04] hover:bg-white/[0.05] transition"
                              >
                                <div className="flex items-center gap-3">
                                  <div className="w-8 h-8 rounded-full bg-purple-600/20 border border-purple-500/30 text-purple-300 font-bold text-xs flex items-center justify-center">
                                    {member.avatar ? (
                                      <img src={member.avatar} alt={member.name} className="w-full h-full rounded-full object-cover" />
                                    ) : (
                                      member.name.charAt(0)
                                    )}
                                  </div>
                                  <div>
                                    <h5 className="font-display font-semibold text-xs text-white">{member.name}</h5>
                                    <span className="font-mono text-[9px] text-neutral-400">@{member.username}</span>
                                  </div>
                                </div>

                                <button
                                  disabled={!canManageRoles}
                                  onClick={() => handleToggleMemberRole(member.id, currentRole.id)}
                                  className={`px-3 py-1.5 rounded-xl text-xs font-semibold flex items-center gap-1.5 transition cursor-pointer ${
                                    hasRole 
                                      ? 'bg-purple-600 text-white' 
                                      : 'bg-white/[0.06] text-neutral-300 hover:bg-white/10'
                                  }`}
                                >
                                  {hasRole ? (
                                    <>
                                      <Check className="w-3.5 h-3.5" />
                                      <span>Assigned</span>
                                    </>
                                  ) : (
                                    <span>Add Role</span>
                                  )}
                                </button>
                              </div>
                            );
                          })}
                      </div>
                    </div>
                  )}
                </div>
              </div>
            ) : (
              <div className="flex-1 flex items-center justify-center text-neutral-500 text-xs">
                Select or create a role to configure
              </div>
            )}
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
