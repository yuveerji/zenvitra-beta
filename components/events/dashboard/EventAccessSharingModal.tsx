'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  X, ShieldCheck, Crown, UserPlus, Trash2, CheckCircle2, 
  Copy, AlertTriangle, Users, KeyRound 
} from 'lucide-react';
import { ZenEvent, EventOrganizerRole, EventTeamMember } from '@/types/events';

interface EventAccessSharingModalProps {
  isOpen: boolean;
  onClose: () => void;
  event: ZenEvent;
  onTransferOwnership: (newOwner: { userId: string; name: string; username: string }) => void;
  onAddTeamMember: (member: EventTeamMember) => void;
  onUpdateTeamRole: (userId: string, newRole: EventOrganizerRole) => void;
  onRemoveTeamMember: (userId: string) => void;
  currentUserId: string;
}

const ROLE_DEFINITIONS: Record<EventOrganizerRole, { label: string; desc: string; color: string; bg: string; border: string }> = {
  owner: {
    label: 'Master Owner / Founder',
    desc: 'Unrestricted control over ticketing, escrow disbursements, summit deletion, and master governance.',
    color: 'text-amber-400',
    bg: 'bg-amber-500/10',
    border: 'border-amber-500/30'
  },
  co_host: {
    label: 'Co-Host / Co-Chair',
    desc: 'Full administrative operational access, can manage schedule, roster, and broadcast announcements.',
    color: 'text-cyan-400',
    bg: 'bg-cyan-500/10',
    border: 'border-cyan-500/30'
  },
  secretariat: {
    label: 'Secretariat / Dais Director',
    desc: 'Authorized to chair MUN committee chambers, table draft resolutions, and log roll calls.',
    color: 'text-purple-400',
    bg: 'bg-purple-500/10',
    border: 'border-purple-500/30'
  },
  gate_scanner: {
    label: 'Gate Marshal / Scanner',
    desc: 'Access to ZenPass high-speed QR ticket scanner, attendee check-in logs, and badge validation.',
    color: 'text-emerald-400',
    bg: 'bg-emerald-500/10',
    border: 'border-emerald-500/30'
  },
  auditor: {
    label: 'Civic Auditor / Observer',
    desc: 'Read-only financial audit of ticket receipts, escrow reserve integrity, and verified attendee ledger.',
    color: 'text-neutral-300',
    bg: 'bg-white/5',
    border: 'border-white/20'
  }
};

export const EventAccessSharingModal: React.FC<EventAccessSharingModalProps> = ({
  isOpen,
  onClose,
  event,
  onTransferOwnership,
  onAddTeamMember,
  onUpdateTeamRole,
  onRemoveTeamMember,
  currentUserId,
}) => {
  // Transfer Master Ownership state
  const [founderHandle, setFounderHandle] = useState('');
  const [founderName, setFounderName] = useState('');
  const [confirmTransfer, setConfirmTransfer] = useState(false);
  const [transferSuccess, setTransferSuccess] = useState(false);

  // Add Member state
  const [newMemberUsername, setNewMemberUsername] = useState('');
  const [newMemberName, setNewMemberName] = useState('');
  const [selectedRole, setSelectedRole] = useState<EventOrganizerRole>('secretariat');

  // Copy link feedback
  const [copiedLink, setCopiedLink] = useState(false);

  if (!isOpen) return null;

  const handleExecuteTransfer = () => {
    if (!founderHandle.trim()) return;
    const cleanHandle = founderHandle.replace(/^@/, '').trim();
    const displayName = founderName.trim() || cleanHandle;

    onTransferOwnership({
      userId: `user-${cleanHandle.toLowerCase()}`,
      name: displayName,
      username: cleanHandle,
    });

    setTransferSuccess(true);
    setTimeout(() => {
      setTransferSuccess(false);
      setConfirmTransfer(false);
      setFounderHandle('');
      setFounderName('');
    }, 2200);
  };

  const handleAddMember = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newMemberUsername.trim()) return;
    const cleanHandle = newMemberUsername.replace(/^@/, '').trim();
    const displayName = newMemberName.trim() || cleanHandle;

    onAddTeamMember({
      userId: `user-${cleanHandle.toLowerCase()}`,
      name: displayName,
      username: cleanHandle,
      role: selectedRole,
      grantedAt: new Date().toISOString(),
      grantedBy: currentUserId,
    });

    setNewMemberUsername('');
    setNewMemberName('');
  };

  const handleCopyInviteLink = () => {
    if (typeof window !== 'undefined') {
      const inviteUrl = `${window.location.origin}/events?action=join_team&eventId=${event.id}&role=${selectedRole}`;
      navigator.clipboard.writeText(inviteUrl);
      setCopiedLink(true);
      setTimeout(() => setCopiedLink(false), 2000);
    }
  };

  const teamList = event.teamMembers || [];

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md overflow-y-auto">
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 10 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 10 }}
          transition={{ duration: 0.2 }}
          className="relative w-full max-w-2xl rounded-3xl bg-[#090a0f] border border-cyan-500/20 shadow-2xl p-6 sm:p-8 space-y-7 my-8"
        >
          {/* Header */}
          <div className="flex items-start justify-between border-b border-white/10 pb-5">
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <span className="p-1.5 rounded-lg bg-cyan-500/10 border border-cyan-500/30 text-cyan-400">
                  <ShieldCheck className="w-5 h-5" />
                </span>
                <h3 className="text-xl font-bold text-white tracking-tight">Role Delegation & Sovereign Access</h3>
              </div>
              <p className="text-xs text-neutral-400">
                Manage secretariat credentials, gate scanners, and transfer master ownership for{' '}
                <span className="text-cyan-300 font-semibold">{event.title}</span>
              </p>
            </div>
            <button
              onClick={onClose}
              className="p-2 rounded-xl bg-white/5 hover:bg-white/10 text-neutral-400 hover:text-white transition"
              aria-label="Close"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Current Master Sovereign / Founder Card */}
          <div className="p-4 rounded-2xl bg-gradient-to-r from-amber-500/10 via-amber-500/5 to-transparent border border-amber-500/30 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-amber-500/20 border border-amber-500/40 flex items-center justify-center text-amber-300">
                <Crown className="w-5 h-5" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <span className="text-xs font-mono font-semibold uppercase tracking-wider text-amber-400 bg-amber-500/15 px-2 py-0.5 rounded-full border border-amber-500/30">
                    Master Founder
                  </span>
                  <span className="text-sm font-bold text-white">{event.organizerName}</span>
                </div>
                <p className="text-xs font-mono text-neutral-400">@{event.organizerUsername || 'organizer'}</p>
              </div>
            </div>
            <span className="text-[11px] font-mono text-amber-300/80 bg-amber-500/10 px-2.5 py-1 rounded-lg border border-amber-500/20">
              Supreme Authority
            </span>
          </div>

          {/* Transfer Master Ownership Section */}
          <div className="p-5 rounded-2xl bg-white/[0.02] border border-white/10 space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Crown className="w-4 h-4 text-amber-400" />
                <h4 className="text-sm font-bold text-white">Transfer Master Ownership to Founder</h4>
              </div>
              <span className="text-[10px] font-mono text-neutral-400 uppercase tracking-wider">
                Full Sovereignty Handover
              </span>
            </div>

            <p className="text-xs text-neutral-400 leading-relaxed">
              If your Secretariat or Organizing Committee set up this summit on behalf of the Founder, you can transfer
              supreme ownership to them. Once accepted, they gain unrestricted permissions to administer the event,
              while you retain Co-Host access.
            </p>

            {transferSuccess ? (
              <div className="p-4 rounded-xl bg-emerald-500/10 border border-emerald-500/30 flex items-center gap-3 text-emerald-400">
                <CheckCircle2 className="w-5 h-5 flex-shrink-0" />
                <div className="text-xs font-medium">
                  Master Ownership successfully handed over to Founder. Role updated in decentralized state ledger.
                </div>
              </div>
            ) : (
              <div className="space-y-3 pt-1">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="text-[11px] font-mono text-neutral-400 block mb-1">Founder @handle or Email</label>
                    <input
                      type="text"
                      placeholder="e.g. @founder_zen"
                      value={founderHandle}
                      onChange={(e) => setFounderHandle(e.target.value)}
                      className="w-full bg-[#111422] border border-white/10 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-amber-500/50"
                    />
                  </div>
                  <div>
                    <label className="text-[11px] font-mono text-neutral-400 block mb-1">Full Legal / Display Name</label>
                    <input
                      type="text"
                      placeholder="e.g. Elena Rostova"
                      value={founderName}
                      onChange={(e) => setFounderName(e.target.value)}
                      className="w-full bg-[#111422] border border-white/10 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-amber-500/50"
                    />
                  </div>
                </div>

                {confirmTransfer && (
                  <div className="p-3 rounded-xl bg-amber-500/10 border border-amber-500/30 flex items-start gap-2.5 text-xs text-amber-200">
                    <AlertTriangle className="w-4 h-4 text-amber-400 flex-shrink-0 mt-0.5" />
                    <div>
                      <span className="font-semibold text-amber-300">Irreversible Action:</span> By confirming, you confer
                      the Master Founder role to <span className="text-white font-bold">{founderHandle}</span>. You will remain
                      as a Co-Host.
                    </div>
                  </div>
                )}

                <div className="flex items-center justify-end gap-2 pt-1">
                  {confirmTransfer ? (
                    <>
                      <button
                        type="button"
                        onClick={() => setConfirmTransfer(false)}
                        className="px-3.5 py-1.5 rounded-xl bg-white/5 hover:bg-white/10 text-neutral-300 text-xs font-medium transition"
                      >
                        Cancel
                      </button>
                      <button
                        type="button"
                        onClick={handleExecuteTransfer}
                        className="px-4 py-1.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-neutral-950 font-bold text-xs flex items-center gap-1.5 shadow-lg shadow-amber-500/20 transition"
                      >
                        <Crown className="w-3.5 h-3.5" />
                        Execute Sovereign Handover
                      </button>
                    </>
                  ) : (
                    <button
                      type="button"
                      disabled={!founderHandle.trim()}
                      onClick={() => setConfirmTransfer(true)}
                      className="px-4 py-1.5 rounded-xl bg-amber-500/15 hover:bg-amber-500/25 border border-amber-500/30 text-amber-300 font-semibold text-xs flex items-center gap-1.5 transition disabled:opacity-40 disabled:pointer-events-none"
                    >
                      <KeyRound className="w-3.5 h-3.5" />
                      Grant Master Ownership
                    </button>
                  )}
                </div>
              </div>
            )}
          </div>

          {/* Grant Role Access to Team Members Section */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Users className="w-4 h-4 text-cyan-400" />
                <h4 className="text-sm font-bold text-white">Delegate Operational Roles</h4>
              </div>
              <button
                type="button"
                onClick={handleCopyInviteLink}
                className="text-xs font-mono text-cyan-400 hover:text-cyan-300 flex items-center gap-1 bg-cyan-500/10 px-2.5 py-1 rounded-lg border border-cyan-500/20 transition"
              >
                {copiedLink ? <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                {copiedLink ? 'Invite Link Copied!' : 'Copy Role Token Link'}
              </button>
            </div>

            {/* Role Assignment Form */}
            <form onSubmit={handleAddMember} className="p-4 rounded-2xl bg-white/[0.02] border border-white/10 space-y-3">
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div>
                  <label className="text-[11px] font-mono text-neutral-400 block mb-1">Delegate @handle</label>
                  <input
                    type="text"
                    required
                    placeholder="@sec_officer"
                    value={newMemberUsername}
                    onChange={(e) => setNewMemberUsername(e.target.value)}
                    className="w-full bg-[#111422] border border-white/10 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-cyan-500/50"
                  />
                </div>
                <div>
                  <label className="text-[11px] font-mono text-neutral-400 block mb-1">Full Name</label>
                  <input
                    type="text"
                    placeholder="Marcus Vance"
                    value={newMemberName}
                    onChange={(e) => setNewMemberName(e.target.value)}
                    className="w-full bg-[#111422] border border-white/10 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-cyan-500/50"
                  />
                </div>
                <div>
                  <label className="text-[11px] font-mono text-neutral-400 block mb-1">Operational Role</label>
                  <select
                    value={selectedRole}
                    onChange={(e) => setSelectedRole(e.target.value as EventOrganizerRole)}
                    className="w-full bg-[#111422] border border-white/10 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-cyan-500/50"
                  >
                    <option value="co_host">Co-Host (Full Admin)</option>
                    <option value="secretariat">Secretariat / Dais Director</option>
                    <option value="gate_scanner">Gate Marshal / Scanner</option>
                    <option value="auditor">Civic Auditor (Read-Only)</option>
                  </select>
                </div>
              </div>

              {/* Selected Role Explanation */}
              <div className="p-2.5 rounded-xl bg-white/[0.02] border border-white/5 flex items-center gap-2">
                <span className={`text-[10px] font-mono px-2 py-0.5 rounded-md border ${ROLE_DEFINITIONS[selectedRole].bg} ${ROLE_DEFINITIONS[selectedRole].color} ${ROLE_DEFINITIONS[selectedRole].border}`}>
                  {ROLE_DEFINITIONS[selectedRole].label}
                </span>
                <span className="text-[11px] text-neutral-400 truncate">
                  {ROLE_DEFINITIONS[selectedRole].desc}
                </span>
              </div>

              <div className="flex justify-end">
                <button
                  type="submit"
                  disabled={!newMemberUsername.trim()}
                  className="px-4 py-2 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-neutral-950 font-bold text-xs flex items-center gap-1.5 shadow-lg shadow-cyan-500/20 transition disabled:opacity-40"
                >
                  <UserPlus className="w-3.5 h-3.5" />
                  Grant Role Credentials
                </button>
              </div>
            </form>

            {/* Active Team Roster */}
            <div className="space-y-2">
              <div className="text-[11px] font-mono text-neutral-400 uppercase tracking-wider px-1">
                Active Staff & Delegated Dais ({teamList.length})
              </div>

              {teamList.length === 0 ? (
                <div className="p-6 rounded-2xl bg-white/[0.01] border border-dashed border-white/10 text-center space-y-1">
                  <p className="text-xs text-neutral-400">No additional team members assigned yet.</p>
                  <p className="text-[11px] text-neutral-500">
                    Add Secretariat members, Gate Scanners, or Auditors using the form above.
                  </p>
                </div>
              ) : (
                <div className="space-y-2 max-h-56 overflow-y-auto pr-1">
                  {teamList.map((member) => {
                    const roleInfo = ROLE_DEFINITIONS[member.role] || ROLE_DEFINITIONS.secretariat;
                    return (
                      <div
                        key={member.userId}
                        className="p-3 rounded-xl bg-[#111422] border border-white/5 flex items-center justify-between gap-3 hover:border-white/15 transition"
                      >
                        <div className="flex items-center gap-3 min-w-0">
                          <div className="w-8 h-8 rounded-lg bg-white/5 border border-white/10 flex items-center justify-center text-xs font-mono font-bold text-white flex-shrink-0">
                            {member.name.charAt(0).toUpperCase()}
                          </div>
                          <div className="min-w-0">
                            <div className="text-xs font-bold text-white truncate">{member.name}</div>
                            <div className="text-[11px] font-mono text-neutral-400 truncate">@{member.username}</div>
                          </div>
                        </div>

                        <div className="flex items-center gap-3 flex-shrink-0">
                          <select
                            value={member.role}
                            onChange={(e) => onUpdateTeamRole(member.userId, e.target.value as EventOrganizerRole)}
                            className={`text-xs font-medium rounded-lg px-2.5 py-1 border bg-neutral-900 focus:outline-none ${roleInfo.color} ${roleInfo.border}`}
                          >
                            <option value="co_host">Co-Host</option>
                            <option value="secretariat">Secretariat</option>
                            <option value="gate_scanner">Gate Scanner</option>
                            <option value="auditor">Auditor</option>
                          </select>

                          <button
                            type="button"
                            onClick={() => onRemoveTeamMember(member.userId)}
                            className="p-1.5 rounded-lg text-neutral-400 hover:text-red-400 hover:bg-red-500/10 transition"
                            title="Revoke Role"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          </div>

          {/* Footer */}
          <div className="border-t border-white/10 pt-4 flex items-center justify-between text-xs text-neutral-500 font-mono">
            <span>ZENVITRA Sovereignty Protocol v2.6</span>
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-xl bg-white/5 hover:bg-white/10 text-white font-medium transition"
            >
              Done
            </button>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
