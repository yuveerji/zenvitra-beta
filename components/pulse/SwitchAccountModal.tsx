'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  X, 
  Check, 
  Plus, 
  LogOut, 
  UserPlus, 
  KeyRound,
  Crown
} from 'lucide-react';
import { useAuth, recordSavedSession } from '@/context/AuthContext';

interface SwitchAccountModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentUsername: string;
  currentDisplayName: string;
  currentAvatar?: string;
}

export function SwitchAccountModal({
  isOpen,
  onClose,
  currentUsername,
  currentDisplayName,
  currentAvatar,
}: SwitchAccountModalProps) {
  const { signOut } = useAuth();
  const [switching, setSwitching] = useState<string | null>(null);

  const [savedAccounts, setSavedAccounts] = useState<Array<{ id: string; name: string; username: string; avatar?: string; role?: string; isFounder?: boolean }>>([]);

  React.useEffect(() => {
    try {
      const storedList = JSON.parse(localStorage.getItem('zenvitra_saved_sessions') || '[]');
      if (Array.isArray(storedList)) {
        setSavedAccounts(storedList);
      }
    } catch (_) {}
  }, [isOpen]);

  if (!isOpen) return null;

  const cleanCurrentHandle = (currentUsername || '').replace(/^@/, '').toLowerCase();
  const initial = (currentDisplayName || currentUsername || 'U')[0]?.toUpperCase() || 'U';

  const accounts = [
    {
      id: 'current',
      name: currentDisplayName || 'Active Node',
      username: currentUsername ? (currentUsername.startsWith('@') ? currentUsername : `@${currentUsername}`) : '@user',
      avatar: currentAvatar,
      initial,
      isActive: true,
      role: 'Active Session',
      isFounder: cleanCurrentHandle === 'yuveer' || cleanCurrentHandle === 'founder',
    },
    ...savedAccounts
      .filter((acc) => {
        const accHandle = (acc.username || '').replace(/^@/, '').toLowerCase();
        return accHandle && accHandle !== cleanCurrentHandle;
      })
      .map((acc) => {
        const accHandle = (acc.username || '').replace(/^@/, '').toLowerCase();
        const accName = acc.name || (acc as any).display_name || accHandle;
        return {
          id: acc.id || accHandle,
          name: accName,
          username: `@${accHandle}`,
          avatar: acc.avatar || (acc as any).avatar_url,
          initial: (accName || 'U')[0]?.toUpperCase() || 'U',
          isActive: false,
          role: acc.role || 'Saved Identity',
          isFounder: acc.isFounder || accHandle === 'yuveer' || accHandle === 'founder',
        };
      }),
  ];

  const handleSwitchAccount = async (accId: string) => {
    setSwitching(accId);
    try {
      const cleanTarget = accId.replace(/^@/, '').toLowerCase();
      const target = savedAccounts.find(
        (a) => a.id === accId || (a.username || '').replace(/^@/, '').toLowerCase() === cleanTarget
      );
      if (target) {
        localStorage.setItem('zenvitra_session_user', JSON.stringify(target));
        recordSavedSession(target);
        window.location.reload();
      }
    } catch (_) {}
  };

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
        {/* Backdrop */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          className="fixed inset-0 bg-black/80 backdrop-blur-md"
        />

        {/* Modal Window */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 15 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 15 }}
          transition={{ type: 'spring', damping: 25, stiffness: 350 }}
          className="relative w-full max-w-sm bg-neutral-950 border border-white/15 rounded-3xl p-6 shadow-[0_0_50px_rgba(0,0,0,0.9)] z-10 space-y-6 text-white select-none"
        >
          {/* Header */}
          <div className="flex items-center justify-between border-b border-white/10 pb-3.5">
            <div className="flex items-center gap-2.5">
              <KeyRound className="w-4 h-4 text-cyan-400" />
              <h3 className="font-display font-bold text-sm text-white tracking-tight">Switch Account</h3>
            </div>
            <button
              type="button"
              onClick={onClose}
              className="p-1 rounded-full text-neutral-400 hover:text-white hover:bg-white/10 transition cursor-pointer"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          {/* Account List */}
          <div className="space-y-2.5 max-h-[260px] overflow-y-auto pr-1 no-scrollbar">
            {accounts.map((acc) => (
              <div
                key={acc.id}
                onClick={() => {
                  if (!acc.isActive) {
                    handleSwitchAccount(acc.id);
                  }
                }}
                className={`p-3 rounded-2xl border flex items-center justify-between transition-all ${
                  acc.isActive
                    ? 'bg-white/10 border-white/25 shadow-sm'
                    : 'bg-white/[0.03] border-white/10 hover:bg-white/[0.08] hover:border-white/20 cursor-pointer active:scale-[0.98]'
                }`}
              >
                <div className="flex items-center gap-3 min-w-0">
                  <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-amber-400 via-rose-500 to-fuchsia-600 p-[2px] shrink-0">
                    {acc.avatar ? (
                      <img src={acc.avatar} alt={acc.name} className="w-full h-full rounded-full object-cover" />
                    ) : (
                      <div className="w-full h-full rounded-full bg-black flex items-center justify-center font-bold text-xs text-white uppercase">
                        {acc.initial}
                      </div>
                    )}
                  </div>
                  <div className="min-w-0">
                    <div className="flex items-center gap-1.5">
                      <p className="text-xs font-bold text-white truncate">{acc.name}</p>
                      {acc.isFounder && (
                        <Crown className="w-3 h-3 text-amber-400 shrink-0" />
                      )}
                    </div>
                    <p className="text-[11px] text-neutral-400 truncate">{acc.username}</p>
                    <p className="text-[9px] font-mono text-neutral-500 truncate">{acc.role}</p>
                  </div>
                </div>

                <div>
                  {acc.isActive ? (
                    <div className="w-6 h-6 rounded-full bg-white text-black flex items-center justify-center shadow-md">
                      <Check className="w-3.5 h-3.5 stroke-[3]" />
                    </div>
                  ) : switching === acc.id ? (
                    <div className="w-5 h-5 border-2 border-white/20 border-t-white rounded-full animate-spin" />
                  ) : (
                    <span className="text-[10px] font-mono font-semibold text-cyan-400">
                      Switch
                    </span>
                  )}
                </div>
              </div>
            ))}
          </div>

          {/* Action Links */}
          <div className="pt-2 border-t border-white/10 space-y-2">
            <Link
              href="/login"
              onClick={onClose}
              className="w-full flex items-center justify-center gap-2 py-2.5 rounded-xl bg-white/[0.05] hover:bg-white/10 border border-white/10 text-white text-xs font-semibold transition active:scale-[0.98] cursor-pointer"
            >
              <UserPlus className="w-4 h-4 text-neutral-300" />
              <span>Log Into An Existing Account</span>
            </Link>

            <Link
              href="/register"
              onClick={onClose}
              className="w-full flex items-center justify-center gap-2 py-2.5 rounded-xl bg-white/[0.05] hover:bg-white/10 border border-white/10 text-white text-xs font-semibold transition active:scale-[0.98] cursor-pointer"
            >
              <Plus className="w-4 h-4 text-neutral-300" />
              <span>Create New Sovereign Account</span>
            </Link>

            <button
              type="button"
              onClick={async () => {
                onClose();
                await signOut();
                window.location.href = '/login';
              }}
              className="w-full flex items-center justify-center gap-2 py-2 rounded-xl text-neutral-400 hover:text-rose-400 hover:bg-rose-500/10 transition text-xs font-medium cursor-pointer"
            >
              <LogOut className="w-3.5 h-3.5" />
              <span>Sign Out of Current Account</span>
            </button>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
