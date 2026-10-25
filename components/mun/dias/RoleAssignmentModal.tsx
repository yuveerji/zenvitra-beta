'use client';

import React, { useState, useEffect } from 'react';
import {
  Shield,
  ShieldAlert,
  Users,
  UserCheck,
  Plus,
  Trash2,
  X,
  Check,
  Clock,
  AlertTriangle,
} from 'lucide-react';
import { DiasBadge } from './DiasBadge';
import { DiasButton } from './DiasButton';

export interface RoleAssignmentModalProps {
  isOpen: boolean;
  onClose: () => void;
  committeeId?: string;
  committeeName?: string;
}

export const RoleAssignmentModal: React.FC<RoleAssignmentModalProps> = ({
  isOpen,
  onClose,
  committeeId = 'comm_default',
  committeeName = 'Chamber Floor',
}) => {
  const [assignments, setAssignments] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // New assignment form state
  const [targetUserId, setTargetUserId] = useState('');
  const [selectedRole, setSelectedRole] = useState<'CHAIR' | 'VICE_CHAIR' | 'DELEGATE' | 'PRESS'>('CHAIR');
  const [reason, setReason] = useState('Official Secretariat appointment');
  const [expiresInDays, setExpiresInDays] = useState('30');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [statusMessage, setStatusMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  const fetchAssignments = async () => {
    try {
      setIsLoading(true);
      const res = await fetch(`/api/mun/committees/${committeeId}/roles`);
      if (res.ok) {
        const data = await res.json();
        setAssignments(Array.isArray(data.assignments) ? data.assignments : []);
      }
    } catch (e) {
      console.warn('Failed to fetch assignments:', e);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (isOpen) {
      fetchAssignments();
    }
  }, [isOpen, committeeId]);

  const handleAssignRole = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!targetUserId.trim()) return;

    try {
      setIsSubmitting(true);
      setStatusMessage(null);

      const expiresDate = new Date();
      expiresDate.setDate(expiresDate.getDate() + (parseInt(expiresInDays, 10) || 30));

      const res = await fetch(`/api/mun/committees/${committeeId}/roles`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'ASSIGN',
          targetUserId: targetUserId.trim(),
          role: selectedRole,
          reason: reason.trim(),
          expiresAt: expiresDate.toISOString(),
        }),
      });

      const data = await res.json();
      if (!res.ok) {
        setStatusMessage({ type: 'error', text: data.error || 'Failed to assign role' });
      } else {
        setStatusMessage({ type: 'success', text: `Successfully granted ${selectedRole} clearance to ${targetUserId.trim()}` });
        setTargetUserId('');
        fetchAssignments();
      }
    } catch (err: any) {
      setStatusMessage({ type: 'error', text: err.message || 'Network error' });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleRevokeRole = async (userId: string) => {
    if (!confirm(`Are you sure you want to revoke Chair/Role clearance for user ${userId}? Access will stop immediately.`)) {
      return;
    }

    try {
      const res = await fetch(`/api/mun/committees/${committeeId}/roles`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'REVOKE',
          targetUserId: userId,
          reason: 'Revoked by administrator in Access & Roles panel',
        }),
      });

      if (res.ok) {
        setStatusMessage({ type: 'success', text: `Access revoked for ${userId}` });
        fetchAssignments();
      } else {
        const data = await res.json();
        setStatusMessage({ type: 'error', text: data.error || 'Failed to revoke' });
      }
    } catch (e: any) {
      setStatusMessage({ type: 'error', text: e.message || 'Revocation error' });
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md animate-fadeIn">
      <div className="bg-[#111318] border border-[#232731] rounded-2xl p-6 max-w-2xl w-full text-left space-y-6 shadow-2xl overflow-hidden max-h-[90vh] flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-[#181B21] shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-[#6366F1]/15 border border-[#6366F1]/30 flex items-center justify-center text-[#6366F1]">
              <Shield className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-semibold text-[#F4F2ED]">Access Control & Role Assignments</h3>
              <p className="text-xs text-[#9A9DA5]">{committeeName} • Authorized Secretariat Panel</p>
            </div>
          </div>
          <button onClick={onClose} className="p-1 rounded-lg text-[#9A9DA5] hover:text-white transition-colors">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Status Message */}
        {statusMessage && (
          <div
            className={`p-3 rounded-xl text-xs flex items-center gap-2 ${
              statusMessage.type === 'success'
                ? 'bg-emerald-500/15 border border-emerald-500/30 text-emerald-300'
                : 'bg-rose-500/15 border border-rose-500/30 text-rose-300'
            }`}
          >
            {statusMessage.type === 'success' ? <Check className="w-4 h-4 shrink-0" /> : <AlertTriangle className="w-4 h-4 shrink-0" />}
            <span>{statusMessage.text}</span>
          </div>
        )}

        <div className="space-y-6 overflow-y-auto pr-1 flex-1">
          {/* Section 1: Assign New Role */}
          <form onSubmit={handleAssignRole} className="p-4 rounded-xl bg-[#08090B] border border-[#181B21] space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-xs font-mono uppercase text-[#6366F1] font-bold">
                Assign New Chair / Secretariat Clearance
              </span>
              <span className="text-[10px] text-[#575B66] font-mono">RBAC Law</span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="text-[11px] text-[#9A9DA5] block mb-1">Target User ID or Username</label>
                <input
                  required
                  value={targetUserId}
                  onChange={(e) => setTargetUserId(e.target.value)}
                  placeholder="e.g. user_id, email, or @handle"
                  className="w-full h-9 px-3 bg-[#111318] border border-[#232731] focus:border-[#6366F1] rounded-xl text-xs text-[#F4F2ED] outline-none"
                />
              </div>

              <div>
                <label className="text-[11px] text-[#9A9DA5] block mb-1">Assigned Role</label>
                <select
                  value={selectedRole}
                  onChange={(e) => setSelectedRole(e.target.value as any)}
                  className="w-full h-9 px-3 bg-[#111318] border border-[#232731] focus:border-[#6366F1] rounded-xl text-xs text-[#F4F2ED] outline-none"
                >
                  <option value="CHAIR">CHAIR (Full Dais Controls)</option>
                  <option value="VICE_CHAIR">VICE CHAIR (Queue & Timer Controls)</option>
                  <option value="DELEGATE">DELEGATE (Standard Floor Access)</option>
                  <option value="PRESS">PRESS CORPS (Editorial Desk)</option>
                </select>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div className="sm:col-span-2">
                <label className="text-[11px] text-[#9A9DA5] block mb-1">Appointment Reason (Audit Trail)</label>
                <input
                  value={reason}
                  onChange={(e) => setReason(e.target.value)}
                  placeholder="e.g. Appointed as Co-Chair by Secretariat"
                  className="w-full h-9 px-3 bg-[#111318] border border-[#232731] focus:border-[#6366F1] rounded-xl text-xs text-[#F4F2ED] outline-none"
                />
              </div>
              <div>
                <label className="text-[11px] text-[#9A9DA5] block mb-1">Duration (Days)</label>
                <input
                  type="number"
                  min="1"
                  max="365"
                  value={expiresInDays}
                  onChange={(e) => setExpiresInDays(e.target.value)}
                  className="w-full h-9 px-3 bg-[#111318] border border-[#232731] focus:border-[#6366F1] rounded-xl text-xs text-[#F4F2ED] outline-none"
                />
              </div>
            </div>

            <div className="flex justify-end pt-1">
              <DiasButton
                type="submit"
                variant="indigo"
                size="sm"
                isLoading={isSubmitting}
                leftIcon={<Plus className="w-3.5 h-3.5" />}
              >
                Confirm Role Assignment
              </DiasButton>
            </div>
          </form>

          {/* Section 2: Active Role Registry */}
          <div className="space-y-3">
            <div className="flex items-center justify-between pb-1 border-b border-[#181B21]">
              <span className="text-xs font-semibold text-[#F4F2ED] uppercase tracking-wide flex items-center gap-2">
                <Users className="w-3.5 h-3.5 text-[#6366F1]" />
                Active Chair & Secretariat Assignments ({assignments.length})
              </span>
              <span className="text-[10px] font-mono text-[#575B66]">Immediate Revocation Enabled</span>
            </div>

            {isLoading ? (
              <div className="py-8 text-center text-xs text-[#9A9DA5] font-mono">
                Loading verified role registry...
              </div>
            ) : assignments.length === 0 ? (
              <div className="py-6 text-center text-xs text-[#575B66] border border-dashed border-[#232731] rounded-xl">
                No custom role assignments registered yet. Platform Administrators hold default clearance.
              </div>
            ) : (
              <div className="space-y-2">
                {assignments.map((item) => (
                  <div
                    key={item.id}
                    className="p-3 rounded-xl bg-[#181B21] border border-[#2A2E39] flex items-center justify-between gap-3 text-left"
                  >
                    <div className="space-y-0.5 min-w-0">
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-bold text-[#F4F2ED] font-mono truncate">
                          {item.userId}
                        </span>
                        <DiasBadge variant={['CHAIR', 'SUPER_ADMIN'].includes(item.role) ? 'indigo' : 'charcoal'} size="sm">
                          {item.role}
                        </DiasBadge>
                      </div>
                      <p className="text-[10px] text-[#9A9DA5] line-clamp-1">
                        Reason: {item.reason || 'Official assignment'} • Assigned by: {item.assignedBy || 'Admin'}
                      </p>
                    </div>

                    <div className="flex items-center gap-2 shrink-0">
                      <button
                        onClick={() => handleRevokeRole(item.userId)}
                        className="px-2.5 py-1 rounded-lg bg-rose-500/10 hover:bg-rose-500/20 border border-rose-500/30 text-rose-300 text-xs font-semibold transition-all flex items-center gap-1 active:scale-95"
                        title="Immediately revoke clearance"
                      >
                        <Trash2 className="w-3 h-3" />
                        <span>Revoke</span>
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Footer */}
        <div className="pt-3 border-t border-[#181B21] flex justify-end shrink-0">
          <DiasButton variant="charcoal" size="sm" onClick={onClose}>
            Close Panel
          </DiasButton>
        </div>
      </div>
    </div>
  );
};
