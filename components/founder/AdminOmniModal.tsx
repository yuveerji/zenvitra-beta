'use client';

import React, { useState, useEffect } from 'react';
import { 
  ShieldCheck, 
  X, 
  Radio, 
  Trash2, 
  Users, 
  CheckCircle2, 
  Activity, 
  AlertTriangle,
  Newspaper,
  Check,
  Award,
  Crown,
  Lock,
  MessageSquare,
  FileCheck2,
  HandMetal,
  Clock,
  ArrowRight,
  Search
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useZenPulse } from '@/context/ZenPulsePlatformContext';
import { useAuth } from '@/context/AuthContext';
import { getAuditLogs, isFounder, isAdmin } from '@/lib/founderControl';

interface AdminOmniModalProps {
  isOpen: boolean;
  onClose: () => void;
  onOpenFounderMenu?: () => void;
}

export function AdminOmniModal({ isOpen, onClose, onOpenFounderMenu }: AdminOmniModalProps) {
  const { user, profile } = useAuth();
  const { 
    feedPosts, 
    deletePost, 
    speakerQueue, 
    leaveSpeakerQueue, 
    currentUserName, 
    currentUserUsername,
    profiles 
  } = useZenPulse();

  const [adminTab, setAdminTab] = useState<'moderation' | 'subscriptions' | 'verification' | 'disputes' | 'audit'>('moderation');
  const [searchQuery, setSearchQuery] = useState('');
  const [toastMsg, setToastMsg] = useState<string | null>(null);

  // Founder and Admin Access Checking
  const effectiveUser = (currentUserUsername || user?.email?.split('@')[0] || profile?.username || '').toLowerCase().trim().replace(/^@/, '');
  const userIsFounder = isFounder(effectiveUser, (profile?.role as any) || (profile as any)?.badge);
  const userIsAdmin = isAdmin(effectiveUser, (profile?.role as any) || (profile as any)?.badge);

  const showToast = (msg: string) => {
    setToastMsg(msg);
    setTimeout(() => setToastMsg(null), 3000);
  };

  if (!isOpen) return null;

  return (
    <div 
      className="fixed inset-0 z-[190] flex items-center justify-center p-4 sm:p-6 bg-black/90 backdrop-blur-2xl overflow-y-auto font-sans text-left"
      onClick={onClose}
    >
      <div 
        className="relative w-full max-w-4xl max-h-[90vh] flex flex-col rounded-3xl bg-[#090b10] border border-cyan-500/40 shadow-[0_25px_90px_rgba(6,182,212,0.2)] overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Toast Feedback */}
        <AnimatePresence>
          {toastMsg && (
            <motion.div 
              initial={{ y: -20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: -20, opacity: 0 }}
              className="absolute top-4 left-1/2 -translate-x-1/2 z-50 px-5 py-2 rounded-full bg-cyan-400 text-black font-mono text-xs font-bold shadow-lg flex items-center gap-2 pointer-events-none"
            >
              <ShieldCheck className="w-3.5 h-3.5 fill-black" />
              <span>{toastMsg}</span>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Top Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-5 sm:p-6 border-b border-white/10 bg-gradient-to-r from-cyan-950/40 via-[#0a0d14] to-indigo-950/40">
          <div className="flex items-center gap-3">
            <div className="w-11 h-11 rounded-2xl bg-cyan-500/20 border border-cyan-500/40 flex items-center justify-center text-cyan-400 shrink-0">
              <ShieldCheck className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="font-display font-bold text-lg text-white">
                  Admin &amp; Operational Committee Console
                </h2>
                <span className="px-2 py-0.5 rounded-full bg-cyan-500/20 text-cyan-300 font-mono text-[9px] font-bold border border-cyan-500/40">
                  ADMIN CLEARANCE
                </span>
              </div>
              <p className="text-xs font-mono text-neutral-400">
                Platform Content Moderation • User Verification • Member Status &amp; Dispute Resolution
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {/* If Founder is in Admin menu, provide button to enter Founder menu */}
            {userIsFounder && onOpenFounderMenu && (
              <button
                type="button"
                onClick={() => {
                  onClose();
                  onOpenFounderMenu();
                }}
                className="px-3.5 py-1.5 rounded-xl bg-amber-400/20 hover:bg-amber-400/30 border border-amber-400/40 text-amber-300 font-mono text-xs font-bold transition flex items-center gap-1.5 cursor-pointer shadow"
                title="Founder has unrestricted access to Founder Mode"
              >
                <Crown className="w-3.5 h-3.5 text-amber-400" />
                <span>👑 Enter Founder Mode</span>
              </button>
            )}

            {/* Non-Founder Admins see a locked badge indicating Founder Mode is restricted */}
            {!userIsFounder && (
              <span className="px-3 py-1 rounded-xl bg-white/5 border border-white/10 text-neutral-400 font-mono text-[10px] flex items-center gap-1.5">
                <Lock className="w-3 h-3 text-neutral-500" />
                <span>Founder Mode Locked</span>
              </span>
            )}

            <button
              onClick={onClose}
              className="p-2 rounded-xl text-neutral-400 hover:text-white hover:bg-white/10 transition cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Tab Strip */}
        <div className="flex items-center gap-1 px-6 pt-3 border-b border-white/10 bg-black/40 overflow-x-auto scrollbar-none select-none text-xs font-mono">
          {[
            { id: 'moderation', label: '📰 Feed Moderation', icon: Newspaper },
            { id: 'verification', label: '👥 Verification Review', icon: Users },
            { id: 'subscriptions', label: '💳 Member Subscriptions', icon: Award },
            { id: 'disputes', label: '⚖️ Policy & Disputes', icon: AlertTriangle },
            { id: 'audit', label: '📜 Action Logs', icon: Activity },
          ].map((tab) => {
            const Icon = tab.icon;
            const active = adminTab === tab.id;
            return (
              <button
                key={tab.id}
                type="button"
                onClick={() => setAdminTab(tab.id as any)}
                className={`px-4 py-2.5 rounded-t-xl font-bold transition flex items-center gap-2 whitespace-nowrap cursor-pointer border-b-2 ${
                  active
                    ? 'text-cyan-400 border-cyan-400 bg-cyan-500/10'
                    : 'text-neutral-400 border-transparent hover:text-white hover:bg-white/5'
                }`}
              >
                <Icon className="w-3.5 h-3.5" />
                <span>{tab.label}</span>
              </button>
            );
          })}
        </div>

        {/* Tab Body */}
        <div className="p-6 overflow-y-auto max-h-[calc(90vh-150px)] space-y-6 bg-[#08090f]">
          
          {/* ── 1. FEED CONTENT MODERATION ── */}
          {adminTab === 'moderation' && (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-xs font-mono font-bold text-neutral-400 uppercase">
                  Live Dispatch Feed ({feedPosts.length})
                </span>
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Filter by author or text..."
                  className="px-3 py-1.5 rounded-xl bg-black border border-white/15 text-xs text-white font-mono focus:outline-none focus:border-cyan-400"
                />
              </div>

              <div className="space-y-2">
                {feedPosts
                  .filter(p => !searchQuery || p.authorUsername.toLowerCase().includes(searchQuery.toLowerCase()) || p.content.toLowerCase().includes(searchQuery.toLowerCase()))
                  .map((p) => (
                    <div
                      key={p.id}
                      className="p-4 rounded-xl bg-black border border-white/10 flex items-center justify-between gap-4 text-xs font-mono"
                    >
                      <div className="overflow-hidden space-y-1">
                        <div className="flex items-center gap-2">
                          <span className="font-bold text-white">{p.authorName}</span>
                          <span className="text-neutral-500">@{p.authorUsername}</span>
                          <span className="text-[10px] px-1.5 py-0.5 rounded bg-white/10 text-neutral-400">
                            {(p as any).category || p.postType || 'dispatch'}
                          </span>
                        </div>
                        <p className="text-neutral-300 font-sans text-xs line-clamp-2">{p.content}</p>
                      </div>

                      <div className="shrink-0 flex items-center gap-2">
                        <button
                          type="button"
                          onClick={() => {
                            deletePost(p.id);
                            showToast(`Post #${p.id.slice(-4)} purged by Admin.`);
                          }}
                          className="px-3 py-1.5 rounded-xl bg-rose-500/15 hover:bg-rose-500/30 text-rose-300 text-xs font-bold transition flex items-center gap-1.5 cursor-pointer"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                          <span>Remove</span>
                        </button>
                      </div>
                    </div>
                  ))}
              </div>
            </div>
          )}

          {/* ── 2. MEMBER SUBSCRIPTIONS & STATUS ── */}
          {adminTab === 'subscriptions' && (
            <div className="space-y-4">
              <span className="text-xs font-mono font-bold text-neutral-400 uppercase block">
                Member Subscription &amp; Tier Status
              </span>
              <div className="p-4 rounded-2xl bg-black border border-white/10 space-y-3 font-mono text-xs">
                <div className="flex items-center justify-between">
                  <span className="text-neutral-400">Registered Delegates:</span>
                  <span className="text-white font-bold">{Object.keys(profiles).length || 1}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-neutral-400">VIP Pro Memberships:</span>
                  <span className="text-cyan-400 font-bold">Active</span>
                </div>
                <p className="text-[11px] text-neutral-400 font-sans pt-2 border-t border-white/5">
                  Admins can view member tier privileges and review verification badges. Full VIP Sovereign Grants are managed through the Sovereign Vault.
                </p>
              </div>
            </div>
          )}

          {/* ── 3. VERIFICATION REVIEW ── */}
          {adminTab === 'verification' && (
            <div className="space-y-4">
              <span className="text-xs font-mono font-bold text-neutral-400 uppercase block">
                Delegate Credential Review
              </span>

              <div className="p-4 rounded-2xl bg-black/60 border border-white/10 space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2.5">
                    <div className="w-8 h-8 rounded-full bg-cyan-500/20 text-cyan-400 flex items-center justify-center font-bold text-xs">
                      UN
                    </div>
                    <div>
                      <p className="text-xs font-bold text-white font-mono">Diplomatic Youth Ambassador Queue</p>
                      <p className="text-[10px] text-neutral-400 font-mono">Academic &amp; Institutional Credentials</p>
                    </div>
                  </div>
                  <span className="px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 font-mono text-[10px] font-bold">
                    ACTIVE AUDIT
                  </span>
                </div>

                <p className="text-xs text-neutral-300 leading-relaxed font-sans">
                  Delegate credential applications submitted through Campus Ambassador and Core Team forms sync directly with your Google Sheets master database.
                </p>
              </div>
            </div>
          )}

          {/* ── 4. POLICY & DISPUTES ── */}
          {adminTab === 'disputes' && (
            <div className="space-y-4">
              <div className="p-5 rounded-2xl bg-white/[0.02] border border-white/10 space-y-2 text-xs font-mono">
                <p className="font-bold text-cyan-400">Zenvitra Secular Integrity Guard Status</p>
                <p className="text-neutral-300">
                  Dispatches are checked in real-time against secular neutrality and civility policies. Reported items will appear here for committee review.
                </p>
              </div>
            </div>
          )}

          {/* ── 5. ACTION LOGS ── */}
          {adminTab === 'audit' && (
            <div className="space-y-3">
              <span className="text-xs font-mono font-bold text-neutral-400 uppercase block">
                Recent Admin Actions
              </span>

              <div className="space-y-2">
                {getAuditLogs().slice(0, 30).map((log) => (
                  <div
                    key={log.id}
                    className="p-3 rounded-xl bg-black border border-white/10 flex items-center justify-between text-xs font-mono"
                  >
                    <div className="flex items-center gap-2">
                      <span className="px-1.5 py-0.5 rounded bg-white/10 text-[9px] text-cyan-300">{log.type}</span>
                      <span className="text-neutral-300">{log.action}</span>
                    </div>
                    <span className="text-[10px] text-neutral-500">{new Date(log.timestamp).toLocaleTimeString()}</span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
