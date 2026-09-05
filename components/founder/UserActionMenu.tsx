'use client';

import React, { useState } from 'react';
import { Button } from '@/components/ui/Button';
import { UserX, Shield, Trash2, MoreVertical, Loader2 } from 'lucide-react';

interface UserActionMenuProps {
  userId: string;
  currentRole: string;
  onUpdateRole: (userId: string, newRole: string) => Promise<void>;
  onPurgeUser: (userId: string) => Promise<void>;
}

export const UserActionMenu: React.FC<UserActionMenuProps> = ({
  userId,
  currentRole,
  onUpdateRole,
  onPurgeUser,
}) => {
  const [loading, setLoading] = useState(false);

  const handleRoleChange = async (role: string) => {
    setLoading(true);
    try {
      await onUpdateRole(userId, role);
    } finally {
      setLoading(false);
    }
  };

  const handlePurge = async () => {
    if (!confirm('Hard purge this node ledger entry? This cannot be undone.')) return;
    setLoading(true);
    try {
      await onPurgeUser(userId);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex items-center gap-2 font-mono text-[11px]">
      {currentRole !== 'FOUNDER' && (
        <>
          <button
            onClick={() => handleRoleChange(currentRole === 'SUSPENDED' ? 'USER' : 'SUSPENDED')}
            disabled={loading}
            className="p-2 rounded-lg bg-white/[0.03] hover:bg-white/10 text-neutral-400 hover:text-white transition cursor-pointer"
            title={currentRole === 'SUSPENDED' ? 'Unsuspend' : 'Suspend Node'}
          >
            <UserX className="w-3.5 h-3.5" />
          </button>
          <button
            onClick={handlePurge}
            disabled={loading}
            className="p-2 rounded-lg bg-rose-500/10 hover:bg-rose-500/20 text-rose-400 transition cursor-pointer"
            title="Hard Purge"
          >
            <Trash2 className="w-3.5 h-3.5" />
          </button>
        </>
      )}
    </div>
  );
};