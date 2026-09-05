'use client';

interface EnclaveInviteItem {
  id: string;
  adminName: string;
  passcode: string;
  role: 'ADMIN' | 'MODERATOR' | 'ORGANIZER';
  singleUse: boolean;
  isClaimed: boolean;
  claimedAt?: string;
  claimedByDevice?: string;
  createdAt: string;
  active: boolean;
}

function AdminEnclaveManager({
  notify,
  getBaseOrigin,
}: {
  notify: (msg: string) => void;
  getBaseOrigin: () => string;
}) {
  const [invites, setInvites] = useState<EnclaveInviteItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [copiedId, setCopiedId] = useState<string | null>(null);

  // Form State
  const [adminName, setAdminName] = useState('');
  const [passcode, setPasscode] = useState('');
  const [role, setRole] = useState<'ADMIN' | 'MODERATOR' | 'ORGANIZER'>('ADMIN');
  const [singleUse, setSingleUse] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const fetchInvites = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/admin-enclave?action=ALL', { cache: 'no-store' });
      const data = await res.json();
      if (res.ok && data.invites) {
        setInvites(data.invites);
      }
    } catch (_) {}
    setLoading(false);
  };

  useEffect(() => {
    fetchInvites();
  }, []);

  const handleCreateInvite = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!adminName.trim() || !passcode.trim()) return;

    setIsSubmitting(true);
    try {
      const res = await fetch('/api/admin-enclave', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'CREATE',
          adminName: adminName.trim(),
          passcode: passcode.trim(),
          role,
          singleUse,
        }),
      });

      const data = await res.json();
      if (res.ok && data.invite) {
        notify(`Created secure Enclave Invite for ${adminName.trim()}!`);
        setAdminName('');
        setPasscode('');
        fetchInvites();
      } else {
        notify('Failed to generate invite.');
      }
    } catch (_) {
      notify('Connection error generating invite.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleRevoke = async (inviteId: string) => {
    try {
      const res = await fetch('/api/admin-enclave', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'REVOKE', inviteId }),
      });
      if (res.ok) {
        notify(`Revoked access for invite ${inviteId}`);
        fetchInvites();
      }
    } catch (_) {}
  };

  const handleCopyLink = (inviteId: string, adminPass: string) => {
    const origin = getBaseOrigin();
    const url = `${origin}/enclave-access?invite=${encodeURIComponent(inviteId)}`;
    if (typeof navigator !== 'undefined') {
      navigator.clipboard.writeText(url);
      setCopiedId(inviteId);
      notify(`Copied Enclave Access Link for ${inviteId}!\nShare this link and tell them their code is: ${adminPass}`);
      setTimeout(() => setCopiedId(null), 3000);
    }
  };

  const generateRandomCode = () => {
    const words = ['SECURE', 'SOVEREIGN', 'CITADEL', 'ROOT', 'OPERATOR', 'OMEGA'];
    const randomWord = words[Math.floor(Math.random() * words.length)];
    const num = Math.floor(1000 + Math.random() * 9000);
    setPasscode(`${randomWord}-${num}`);
  };

  return (
    <div className="p-6 sm:p-8 rounded-3xl bg-[#080a10] border border-cyan-500/30 shadow-2xl space-y-8 font-mono text-xs text-left">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-white/10 pb-5">
        <div className="space-y-1">
          <div className="inline-flex items-center gap-2 px-3 py-0.5 rounded-full bg-cyan-500/10 border border-cyan-500/30 text-cyan-300 font-bold text-[10px]">
            <ShieldCheck className="w-3.5 h-3.5 text-cyan-400" />
            <span>SINGLE-USE DEVICE BOUND ADMIN DISPATCHER</span>
          </div>
          <h2 className="font-bold text-xl text-white uppercase tracking-wide">
            Admin Enclave &amp; Access Link Framework
          </h2>
          <p className="text-neutral-400 font-sans text-xs">
            Generate private, device-locked access links for your team. Each admin must open their link and enter their private code to enter the website.
          </p>
        </div>

        <button
          type="button"
          onClick={fetchInvites}
          className="px-4 py-2 rounded-xl bg-white/10 hover:bg-white/20 text-white font-bold transition flex items-center gap-2 cursor-pointer self-start sm:self-auto shrink-0"
        >
          <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin' : ''}`} />
          <span>Refresh Ledger</span>
        </button>
      </div>

      {/* Generator Form */}
      <form onSubmit={handleCreateInvite} className="p-6 rounded-3xl bg-black border border-cyan-500/30 space-y-5">
        <div className="flex items-center justify-between border-b border-white/10 pb-3">
          <span className="text-cyan-300 font-bold uppercase text-xs flex items-center gap-2">
            <KeyRound className="w-4 h-4 text-cyan-400" />
            <span>Generate New Bound Admin Access Link</span>
          </span>
          <span className="text-[10px] text-neutral-400">100% PRIVATE &bull; ANTI-REUSE LOCK</span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="space-y-1.5">
            <label className="text-[10px] text-neutral-400 uppercase font-bold">Admin / Staff Name</label>
            <input
              type="text"
              required
              value={adminName}
              onChange={(e) => setAdminName(e.target.value)}
              placeholder="e.g. Rahul (Lead Editor)"
              className="w-full px-4 py-3 rounded-xl bg-[#090b14] border border-white/20 text-white font-mono text-xs focus:outline-none focus:border-cyan-400"
            />
          </div>

          <div className="space-y-1.5">
            <div className="flex items-center justify-between">
              <label className="text-[10px] text-neutral-400 uppercase font-bold">Secret Code for Them</label>
              <button
                type="button"
                onClick={generateRandomCode}
                className="text-[10px] text-cyan-400 hover:text-white underline cursor-pointer"
              >
                Auto-Generate
              </button>
            </div>
            <input
              type="text"
              required
              value={passcode}
              onChange={(e) => setPasscode(e.target.value)}
              placeholder="e.g. RAHUL-7788"
              className="w-full px-4 py-3 rounded-xl bg-[#090b14] border border-white/20 text-cyan-300 font-mono text-xs focus:outline-none focus:border-cyan-400"
            />
          </div>

          <div className="space-y-1.5">
            <label className="text-[10px] text-neutral-400 uppercase font-bold">Clearance Role</label>
            <select
              value={role}
              onChange={(e) => setRole(e.target.value as any)}
              className="w-full px-4 py-3 rounded-xl bg-[#090b14] border border-white/20 text-white font-mono text-xs focus:outline-none focus:border-cyan-400 cursor-pointer"
            >
              <option value="ADMIN">Staff Administrator</option>
              <option value="MODERATOR">Platform Moderator</option>
              <option value="ORGANIZER">Assembly Organizer</option>
            </select>
          </div>
        </div>

        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pt-2">
          <label className="flex items-center gap-2 cursor-pointer text-xs text-neutral-300">
            <input
              type="checkbox"
              checked={singleUse}
              onChange={(e) => setSingleUse(e.target.checked)}
              className="w-4 h-4 rounded bg-[#090b14] border-white/20 text-cyan-500 focus:ring-0 cursor-pointer"
            />
            <span>Single-Use Hardware Lock (Once opened &amp; entered on their device, nobody else can use this link)</span>
          </label>

          <button
            type="submit"
            disabled={isSubmitting || !adminName.trim() || !passcode.trim()}
            className="px-6 py-3 rounded-xl bg-cyan-500 hover:bg-cyan-400 disabled:opacity-30 text-black font-bold text-xs transition cursor-pointer flex items-center justify-center gap-2 shadow-[0_0_20px_rgba(6,182,212,0.3)] shrink-0 uppercase"
          >
            <Plus className="w-4 h-4" />
            <span>Generate &amp; Register Link</span>
          </button>
        </div>
      </form>

      {/* Invites Directory */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <span className="text-xs font-bold text-white uppercase tracking-wider">
            Active Enclave Access Directory &bull; ({invites.length} Registered Links)
          </span>
          <span className="text-[10px] text-neutral-500">REAL-TIME HARDWARE CLAIM STATUS</span>
        </div>

        {invites.length === 0 ? (
          <div className="p-8 rounded-3xl bg-black border border-white/10 text-center text-neutral-500">
            No access links created yet. Use the generator above to create private links for your admins.
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {invites.map((inv) => {
              const origin = getBaseOrigin();
              const shareUrl = `${origin}/enclave-access?invite=${encodeURIComponent(inv.id)}`;
              const isCopied = copiedId === inv.id;

              return (
                <div
                  key={inv.id}
                  className={`p-5 rounded-3xl border transition space-y-3.5 flex flex-col justify-between ${
                    !inv.active
                      ? 'bg-black/50 border-white/5 opacity-40'
                      : inv.isClaimed
                      ? 'bg-[#090b14] border-cyan-500/30 shadow-[0_0_20px_rgba(6,182,212,0.1)]'
                      : 'bg-black border-amber-500/30'
                  }`}
                >
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-white font-bold text-sm truncate">{inv.adminName}</span>
                      <span
                        className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                          !inv.active
                            ? 'bg-rose-500/20 text-rose-300'
                            : inv.isClaimed
                            ? 'bg-cyan-500/20 text-cyan-300'
                            : 'bg-amber-500/20 text-amber-300 animate-pulse'
                        }`}
                      >
                        {!inv.active
                          ? 'REVOKED'
                          : inv.isClaimed
                          ? '🟢 CLAIMED & LOCKED TO DEVICE'
                          : '🟡 UNCLAIMED (READY TO SHARE)'}
                      </span>
                    </div>

                    <div className="p-3 rounded-2xl bg-[#040508] border border-white/10 space-y-1.5 text-[11px]">
                      <div className="flex items-center justify-between text-neutral-400">
                        <span>Invite ID Token:</span>
                        <span className="text-cyan-300 font-bold">{inv.id}</span>
                      </div>
                      <div className="flex items-center justify-between text-neutral-400">
                        <span>Assigned Passcode:</span>
                        <span className="text-amber-300 font-bold tracking-widest">{inv.passcode}</span>
                      </div>
                      <div className="flex items-center justify-between text-neutral-400">
                        <span>Security Mode:</span>
                        <span className="text-white font-bold">{inv.singleUse ? 'Single-Use Lock' : 'Multi-Use'}</span>
                      </div>
                      {inv.isClaimed && inv.claimedAt && (
                        <div className="flex items-center justify-between text-[10px] text-neutral-500 pt-1 border-t border-white/5">
                          <span>Claimed At:</span>
                          <span>{new Date(inv.claimedAt).toLocaleString()}</span>
                        </div>
                      )}
                    </div>
                  </div>

                  {inv.active ? (
                    <div className="flex items-center gap-2 pt-1">
                      <button
                        type="button"
                        onClick={() => handleCopyLink(inv.id, inv.passcode)}
                        className={`flex-1 py-2.5 rounded-xl font-bold transition flex items-center justify-center gap-1.5 cursor-pointer ${
                          isCopied
                            ? 'bg-emerald-500 text-black shadow-[0_0_15px_rgba(52,211,153,0.4)]'
                            : 'bg-cyan-500/20 hover:bg-cyan-500/30 text-cyan-300 border border-cyan-500/40'
                        }`}
                      >
                        {isCopied ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                        <span>{isCopied ? 'Link Copied!' : 'Copy Enclave Link'}</span>
                      </button>

                      <button
                        type="button"
                        onClick={() => handleRevoke(inv.id)}
                        className="p-2.5 rounded-xl bg-rose-500/10 hover:bg-rose-500/20 border border-rose-500/30 text-rose-400 transition cursor-pointer"
                        title="Revoke this invite immediately"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  ) : (
                    <div className="py-2 text-center text-[10px] text-rose-400 font-bold">
                      ACCESS TERMINATED BY FOUNDER
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}

import React, { useState, useEffect } from 'react';
import { 
  ShieldAlert,
  ShieldCheck,
  Link2,
  Share2, 
  Crown, 
  Plus,
  Radio, 
  Sparkles, 
  Trash2, 
  Users, 
  CheckCircle2, 
  Sliders, 
  Activity, 
  Zap, 
  Save, 
  Newspaper, 
  Send, 
  Lock, 
  Power, 
  AlertTriangle,
  Flame,
  Globe2,
  Cpu,
  RefreshCw,
  CreditCard,
  Settings,
  Coins,
  Award,
  Calendar,
  Percent,
  KeyRound,
  Terminal,
  Download,
  Copy,
  Check,
  FileCode,
  Layers,
  Database,
  Unlock
} from 'lucide-react';
import { 
  ADMIN_BYPASS_KEYS,
  generateCustomAdminKey,
  getCustomAdminKeys,
  getFounderDirective, 
  saveFounderDirective, 
  clearFounderDirective, 
  getProtocolControls, 
  saveProtocolControls, 
  getAuditLogs,
  getAllSubscriptions,
  grantUserSubscription,
  revokeUserSubscription,
  getAllUserOverrides,
  getUserOverride,
  saveUserOverride,
  getSiteOverrides,
  saveSiteOverrides,
  FounderDirective,
  ProtocolControls,
  SubscriptionTier,
  GlobalSiteOverrides,
  UserSubscriptionRecord,
  UserNodeOverride,
  PERSONAL_FOUNDER_KEYS,
  verifyFounderKey,
  activateFounderSession,
  isFounderSessionActive,
  setCustomFounderKey,
  isFounder
} from '@/lib/founderControl';
import { useZenPulse } from '@/context/ZenPulsePlatformContext';
import { useAuth } from '@/context/AuthContext';
import Link from 'next/link';
import { MetricCard } from './MetricCard';
import { FounderPressStudio } from '@/components/founder/FounderPressStudio';

interface VaultDashboardClientProps {
  totalUsers: number;
  suspendedUsers: number;
  totalAccounts: number;
}

export function VaultDashboardClient({
  totalUsers,
  suspendedUsers,
  totalAccounts,
}: VaultDashboardClientProps) {
  const { user, profile } = useAuth();
  const { feedPosts, deletePost, createPost, currentUserUsername } = useZenPulse();
  const [activeTab, setActiveTabState] = useState<'overview' | 'masterkey' | 'adminlinks' | 'terminal' | 'directive' | 'press' | 'subscriptions' | 'users' | 'sheets' | 'content' | 'site' | 'protocol' | 'audit'>(() => {
    if (typeof window !== 'undefined') {
      try {
        const saved = sessionStorage.getItem('zenvitra_vault_tab');
        if (saved) return saved as any;
      } catch (_) {}
    }
    return 'overview';
  });

  const setActiveTab = (tab: any) => {
    setActiveTabState(tab);
    if (typeof window !== 'undefined') {
      try {
        sessionStorage.setItem('zenvitra_vault_tab', tab);
      } catch (_) {}
    }
  };

  const effectiveUser = (currentUserUsername || user?.email?.split('@')[0] || profile?.username || '').toLowerCase().trim().replace(/^@/, '');
  const [isFounderClearance, setIsFounderClearance] = useState(isFounder(effectiveUser, profile?.role || (profile as any)?.badge));

  /* Passkey Unlock Gate State */
  const [passkeyInput, setPasskeyInput] = useState('');
  const [passkeyError, setPasskeyError] = useState<string | null>(null);

  /* Admin Bypass Links State */
  const [customAdminName, setCustomAdminName] = useState('');
  const [copiedLink, setCopiedLink] = useState<string | null>(null);
  const [adminKeysList, setAdminKeysList] = useState<string[]>(ADMIN_BYPASS_KEYS);

  const getBaseOrigin = () => {
    if (typeof window !== 'undefined') {
      return window.location.origin;
    }
    return 'https://zenvitra.org';
  };

  const handleCopyBypassLink = (key: string) => {
    const origin = getBaseOrigin();
    const url = `${origin}/?access_key=${encodeURIComponent(key)}`;
    if (typeof navigator !== 'undefined') {
      navigator.clipboard.writeText(url);
      setCopiedLink(key);
      notify(`Copied Admin Magic Link: ${url}`);
      setTimeout(() => setCopiedLink(null), 3000);
    }
  };

  const handleGenerateCustomAdmin = (e: React.FormEvent) => {
    e.preventDefault();
    if (!customAdminName.trim()) return;
    const newKey = generateCustomAdminKey(customAdminName.trim());
    setAdminKeysList((prev) => [...prev, newKey]);
    setCustomAdminName('');
    notify(`Generated new Admin Access Link for ${customAdminName.trim()}!`);
  };

  /* Personal Founder Key State */
  const [copiedKey, setCopiedKey] = useState<string | null>(null);
  const [customKeyInput, setCustomKeyInput] = useState('');

  /* Directive State */
  const [directive, setDirective] = useState<FounderDirective>(getFounderDirective());
  const [directiveTitle, setDirectiveTitle] = useState(directive.title);
  const [directiveBody, setDirectiveBody] = useState(directive.body);
  const [directiveAuthor, setDirectiveAuthor] = useState(directive.author);
  const [directivePriority, setDirectivePriority] = useState<FounderDirective['priority']>(directive.priority);
  const [directiveActive, setDirectiveActive] = useState(directive.isActive);

  /* Protocol State */
  const [protocols, setProtocols] = useState<ProtocolControls>(getProtocolControls());

  /* Subscriptions State */
  const [subscriptionsList, setSubscriptionsList] = useState<Record<string, UserSubscriptionRecord>>({});
  const [subTargetUser, setSubTargetUser] = useState('');
  const [subTier, setSubTier] = useState<SubscriptionTier>('FOUNDER_PATRON');
  const [subDuration, setSubDuration] = useState('LIFETIME');

  /* User State */
  const [userOverridesList, setUserOverridesList] = useState<Record<string, UserNodeOverride>>({});
  const [userTargetHandle, setUserTargetHandle] = useState('');
  const [userTargetRole, setUserTargetRole] = useState<'FOUNDER' | 'ADMIN' | 'MODERATOR' | 'ORGANIZER' | 'DELEGATE' | 'SUSPENDED'>('ADMIN');
  const [userTargetBadge, setUserTargetBadge] = useState<'GOLD' | 'BLUE' | 'NONE'>('GOLD');
  const [userPointsAmount, setUserPointsAmount] = useState('5000');
  const [userCustomTitle, setUserCustomTitle] = useState('');

  /* Site Overrides State */
  const [siteOverrides, setSiteOverrides] = useState<GlobalSiteOverrides>(getSiteOverrides());
  const [tickerText, setTickerText] = useState(siteOverrides.tickerText);
  const [tickerActive, setTickerActive] = useState(siteOverrides.tickerActive);
  const [bannerNotice, setBannerNotice] = useState(siteOverrides.bannerNotice);
  const [bannerActive, setBannerActive] = useState(siteOverrides.bannerActive);
  const [escrowPercentage, setEscrowPercentage] = useState(siteOverrides.escrowPercentage);
  const [targetLaunchDate, setTargetLaunchDate] = useState(siteOverrides.targetLaunchDate);

  /* Quick Post Dispatch */
  const [quickPostContent, setQuickPostContent] = useState('');
  const [feedback, setFeedback] = useState<string | null>(null);

  /* Terminal State with History Persistence */
  const [terminalInput, setTerminalInput] = useState('');
  const [terminalLogs, setTerminalLogsState] = useState<Array<{ text: string; type: 'info' | 'success' | 'warn' | 'error' | 'cmd' }>>(() => {
    if (typeof window !== 'undefined') {
      try {
        const saved = sessionStorage.getItem('zenvitra_root_cli_logs');
        if (saved) {
          const parsed = JSON.parse(saved);
          if (Array.isArray(parsed) && parsed.length > 0) return parsed;
        }
      } catch (_) {}
    }
    return [
      { text: 'ZENVITRA SOVEREIGN ROOT TERMINAL v6.8.0-PROD', type: 'info' },
      { text: 'Level 0 Root Access Authenticated for Operator @yuveer', type: 'success' },
      { text: 'Type "help" to list all available master commands.', type: 'info' },
    ];
  });

  const setTerminalLogs = (updater: Array<{ text: string; type: 'info' | 'success' | 'warn' | 'error' | 'cmd' }> | ((prev: Array<{ text: string; type: 'info' | 'success' | 'warn' | 'error' | 'cmd' }>) => Array<{ text: string; type: 'info' | 'success' | 'warn' | 'error' | 'cmd' }>)) => {
    setTerminalLogsState((prev) => {
      const next = typeof updater === 'function' ? updater(prev) : updater;
      if (typeof window !== 'undefined') {
        try {
          sessionStorage.setItem('zenvitra_root_cli_logs', JSON.stringify(next.slice(-100)));
        } catch (_) {}
      }
      return next;
    });
  };

  /* Google Sheets Sync Diagnostic State */
  const [sheetSyncStatus, setSheetSyncStatus] = useState<'IDLE' | 'SYNCING' | 'SUCCESS' | 'ERROR'>('IDLE');
  const [sheetSyncLog, setSheetSyncLog] = useState<string>('Google Sheets Web App connected. Ready for bi-directional synchronization.');

  useEffect(() => {
    setDirective(getFounderDirective());
    setProtocols(getProtocolControls());
    setSubscriptionsList(getAllSubscriptions());
    setUserOverridesList(getAllUserOverrides());
    const s = getSiteOverrides();
    setSiteOverrides(s);
    setTickerText(s.tickerText);
    setTickerActive(s.tickerActive);
    setBannerNotice(s.bannerNotice);
    setBannerActive(s.bannerActive);
    setEscrowPercentage(s.escrowPercentage);
    setTargetLaunchDate(s.targetLaunchDate);

    // Refresh clearance
    setIsFounderClearance(isFounder(effectiveUser, profile?.role || (profile as any)?.badge));
  }, [effectiveUser, profile]);

  const notify = (msg: string) => {
    setFeedback(msg);
    setTimeout(() => setFeedback(null), 3500);
  };

  /* Unlock Gate with Passkey */
  const handlePasskeyUnlock = (e: React.FormEvent) => {
    e.preventDefault();
    if (!passkeyInput.trim()) return;
    const success = activateFounderSession(passkeyInput.trim());
    if (success) {
      setIsFounderClearance(true);
      setPasskeyError(null);
      notify('👑 Sovereign Founder Clearance successfully unlocked with Personal Key!');
    } else {
      setPasskeyError('Invalid Personal Founder Key. Try: YUV-ROOT-MASTER-777 or YUVEER-FOUNDER-2026');
    }
  };

  const handleCopyKey = (keyText: string) => {
    if (typeof navigator !== 'undefined') {
      navigator.clipboard.writeText(keyText);
      setCopiedKey(keyText);
      notify(`Copied Personal Key [${keyText}] to clipboard!`);
      setTimeout(() => setCopiedKey(null), 2500);
    }
  };

  const handleSetCustomKey = (e: React.FormEvent) => {
    e.preventDefault();
    if (!customKeyInput.trim()) return;
    setCustomFounderKey(customKeyInput.trim());
    notify(`🔑 Custom Personal Master Key saved: ${customKeyInput.trim().toUpperCase()}`);
    setCustomKeyInput('');
  };

  const handleSaveDirective = (e: React.FormEvent) => {
    e.preventDefault();
    const updated = saveFounderDirective({
      title: directiveTitle.trim(),
      body: directiveBody.trim(),
      author: directiveAuthor.trim(),
      priority: directivePriority,
      isActive: directiveActive,
    });
    setDirective(updated);
    notify('⚡ Founder Directive & Note updated across all network nodes!');
  };

  const handleGrantSubscription = (e: React.FormEvent) => {
    e.preventDefault();
    if (!subTargetUser.trim()) return;
    const rec = grantUserSubscription(subTargetUser, subTier, subDuration);
    setSubscriptionsList(getAllSubscriptions());
    setSubTargetUser('');
    notify(`👑 Granted [${subTier}] (${subDuration}) subscription to @${rec.username}!`);
  };

  const handleRevokeSub = (u: string) => {
    revokeUserSubscription(u);
    setSubscriptionsList(getAllSubscriptions());
    notify(`Revoked subscription for @${u}`);
  };

  const handleSaveUserOverride = (e: React.FormEvent) => {
    e.preventDefault();
    if (!userTargetHandle.trim()) return;
    const pts = parseInt(userPointsAmount, 10) || 0;
    const updated = saveUserOverride(userTargetHandle, {
      role: userTargetRole,
      verifiedBadge: userTargetBadge,
      extraCivicPoints: pts,
      customTitle: userCustomTitle.trim() || undefined,
      banned: userTargetRole === 'SUSPENDED',
    });
    setUserOverridesList(getAllUserOverrides());
    notify(`🛡️ User @${updated.username} updated: Role=${updated.role}, Verified=${updated.verifiedBadge}, +${updated.extraCivicPoints} Civic Points!`);
  };

  const handleSaveSiteOverrides = (e: React.FormEvent) => {
    e.preventDefault();
    const updated = saveSiteOverrides({
      tickerText: tickerText.trim(),
      tickerActive,
      bannerNotice: bannerNotice.trim(),
      bannerActive,
      escrowPercentage: Number(escrowPercentage) || 25,
      targetLaunchDate: targetLaunchDate.trim(),
    });
    setSiteOverrides(updated);
    notify('🌐 Global site parameters, ticker, and escrow saved!');
  };

  const handleToggleProtocol = (key: keyof ProtocolControls) => {
    const nextVal = !protocols[key];
    const updated = saveProtocolControls({ [key]: nextVal });
    setProtocols(updated);
    notify(`Protocol [${String(key)}] set to ${nextVal ? 'ONLINE' : 'MUTED'}`);
  };

  const handlePublishDecree = (e: React.FormEvent) => {
    e.preventDefault();
    if (!quickPostContent.trim()) return;
    createPost(
      `[ROOT FOUNDER BROADCAST] ${quickPostContent.trim()}`,
      undefined,
      'Executive Sovereign Assembly',
      ['ExecutiveDecree', 'FounderNote', 'ZenPulse']
    );
    setQuickPostContent('');
    notify('🏛️ Executive decree published to the live wire!');
  };

  /* Terminal Execution Engine */
  const handleTerminalSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const cmd = terminalInput.trim();
    if (!cmd) return;

    setTerminalLogs((prev) => [...prev, { text: `root@zenvitra:~$ ${cmd}`, type: 'cmd' }]);
    setTerminalInput('');

    const parts = cmd.split(' ');
    const root = parts[0].toLowerCase();

    if (root === 'help') {
      setTerminalLogs((prev) => [
        ...prev,
        { text: 'AVAILABLE COMMANDS:', type: 'info' },
        { text: '  status                       - Display live core network status', type: 'info' },
        { text: '  faucet <user> <amount>       - Mint and inject Civic Points', type: 'info' },
        { text: '  promote <user> <role>        - Elevate role (FOUNDER, ADMIN, MODERATOR, DELEGATE)', type: 'info' },
        { text: '  badge <user> <GOLD|BLUE|NONE> - Grant verified badge to node', type: 'info' },
        { text: '  vip <user> <tier>            - Bestow VIP subscription (FOUNDER_PATRON, PULSE_PRO)', type: 'info' },
        { text: '  freeze                       - Emergency freeze all registrations and posts', type: 'info' },
        { text: '  resume                       - Resume full normal platform operations', type: 'info' },
        { text: '  sync_sheets                  - Trigger live Google Apps Script sync', type: 'info' },
        { text: '  export_json                  - Download complete database snapshot JSON', type: 'info' },
        { text: '  clear                        - Clear terminal output buffer', type: 'info' },
      ]);
    } else if (root === 'clear') {
      if (typeof window !== 'undefined') {
        try { sessionStorage.removeItem('zenvitra_root_cli_logs'); } catch (_) {}
      }
      setTerminalLogs([{ text: 'Terminal output buffer cleared.', type: 'info' }]);
    } else if (root === 'status') {
      setTerminalLogs((prev) => [
        ...prev,
        { text: `[CORE TELEMETRY] Active Protocol Engine: ONLINE`, type: 'success' },
        { text: `[FOUNDER] Operator: @yuveer // ROOT LEVEL 0 (100%)`, type: 'success' },
        { text: `[DATABASE] Total Registered Nodes: ${totalUsers} | Suspended: ${suspendedUsers}`, type: 'info' },
        { text: `[ESCROW] Constitutional Allocation: ${siteOverrides.escrowPercentage}% hardcoded`, type: 'info' },
      ]);
    } else if (root === 'faucet' && parts.length >= 3) {
      const u = parts[1].replace('@', '');
      const amt = parseInt(parts[2], 10) || 1000;
      saveUserOverride(u, { extraCivicPoints: amt });
      setUserOverridesList(getAllUserOverrides());
      setTerminalLogs((prev) => [
        ...prev,
        { text: `[FAUCET] Injected +${amt} Civic Points into wallet of @${u}!`, type: 'success' },
      ]);
      notify(`+${amt} Civic Points injected into @${u}`);
    } else if (root === 'promote' && parts.length >= 3) {
      const u = parts[1].replace('@', '');
      const role = parts[2].toUpperCase() as any;
      saveUserOverride(u, { role });
      setUserOverridesList(getAllUserOverrides());
      setTerminalLogs((prev) => [
        ...prev,
        { text: `[ROLE] Node @${u} role elevated to ${role}!`, type: 'success' },
      ]);
      notify(`Node @${u} promoted to ${role}`);
    } else if (root === 'freeze') {
      saveProtocolControls({ maintenanceMode: true, registrationsOpen: false });
      setProtocols(getProtocolControls());
      setTerminalLogs((prev) => [
        ...prev,
        { text: `🚨 [EMERGENCY] NETWORK FREEZE ACTIVATED: Maintenance ON, Registrations OFF`, type: 'warn' },
      ]);
      notify('🚨 Emergency Platform Freeze Activated');
    } else if (root === 'resume') {
      saveProtocolControls({ maintenanceMode: false, registrationsOpen: true });
      setProtocols(getProtocolControls());
      setTerminalLogs((prev) => [
        ...prev,
        { text: `✅ [NORMAL] Network resumed to standard operations.`, type: 'success' },
      ]);
      notify('Platform operations resumed to normal');
    } else if (root === 'export_json') {
      handleExportDatabaseJSON();
      setTerminalLogs((prev) => [
        ...prev,
        { text: `[EXPORT] Complete database snapshot compiled and downloaded.`, type: 'success' },
      ]);
    } else if (root === 'sync_sheets') {
      handleTriggerSheetSync();
      setTerminalLogs((prev) => [
        ...prev,
        { text: `[SHEETS] Google Apps Script live sync triggered.`, type: 'info' },
      ]);
    } else {
      setTerminalLogs((prev) => [
        ...prev,
        { text: `Command not recognized: "${cmd}". Type "help" for command list.`, type: 'error' },
      ]);
    }
  };

  /* Export Full JSON Backup */
  const handleExportDatabaseJSON = () => {
    const data = {
      timestamp: new Date().toISOString(),
      founder: '@yuveer',
      directive: getFounderDirective(),
      protocols: getProtocolControls(),
      subscriptions: getAllSubscriptions(),
      userOverrides: getAllUserOverrides(),
      siteOverrides: getSiteOverrides(),
      auditLogs: getAuditLogs(),
    };
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `zenvitra_sovereign_backup_${new Date().toISOString().split('T')[0]}.json`;
    a.click();
    URL.revokeObjectURL(url);
    notify('📦 Complete system database JSON backup downloaded!');
  };

  /* Google Sheets Live Sync Diagnostic */
  const handleTriggerSheetSync = async () => {
    setSheetSyncStatus('SYNCING');
    setSheetSyncLog('Pinging Google Apps Script endpoint via Next.js API route...');
    try {
      const res = await fetch('/api/sheets?action=GET_USERS');
      if (res.ok) {
        const data = await res.json();
        setSheetSyncStatus('SUCCESS');
        setSheetSyncLog(`✅ Sync Successful: ${data.users?.length || 0} registered identities retrieved from Google Sheet.`);
        notify('Google Sheets bi-directional sync completed!');
      } else {
        setSheetSyncStatus('ERROR');
        setSheetSyncLog(`⚠️ Sheet Endpoint responded with status: ${res.status}`);
      }
    } catch (err: any) {
      setSheetSyncStatus('ERROR');
      setSheetSyncLog(`❌ Sync error: ${err.message || 'Network timeout'}`);
    }
  };

  // ── CLEARANCE GATE: IF NON-FOUNDER OR LOCKED ──
  if (!isFounderClearance) {
    return (
      <div className="max-w-xl mx-auto py-16 px-4 text-center space-y-6 font-sans">
        <div className="w-20 h-20 rounded-3xl bg-amber-500/20 border border-amber-500/40 flex items-center justify-center text-amber-400 mx-auto shadow-[0_0_30px_rgba(251,191,36,0.3)]">
          <Crown className="w-10 h-10" />
        </div>
        
        <div className="space-y-2">
          <span className="px-3 py-1 rounded-full bg-amber-400/10 border border-amber-400/30 text-amber-300 font-mono text-xs font-bold uppercase tracking-wider">
            FOUNDER SOVEREIGNTY CLEARANCE
          </span>
          <h2 className="text-2xl font-bold font-mono text-white">Supreme Founder Vault Locked</h2>
          <p className="text-xs text-neutral-400 font-mono leading-relaxed max-w-md mx-auto">
            Admins have operational permissions, but Supreme Level 0 is exclusively reserved for <strong className="text-amber-300">@yuveer</strong>. Enter your Personal Founder Key below to activate root session.
          </p>
        </div>

        {/* Passkey Unlock Form */}
        <form onSubmit={handlePasskeyUnlock} className="p-6 rounded-3xl bg-[#090b14] border border-white/10 shadow-2xl space-y-4 max-w-md mx-auto text-left">
          <div className="space-y-1.5">
            <label className="text-[11px] font-mono text-neutral-300 uppercase font-bold flex items-center gap-1.5">
              <KeyRound className="w-3.5 h-3.5 text-amber-400" />
              <span>Enter Personal Founder Master Key</span>
            </label>
            <input
              type="password"
              value={passkeyInput}
              onChange={(e) => setPasskeyInput(e.target.value)}
              placeholder="Insert your code"
              autoComplete="off"
              className="w-full px-4 py-3 rounded-xl bg-black border border-white/20 text-amber-300 font-mono text-xs focus:outline-none focus:border-amber-400"
              autoFocus
            />
            {passkeyError && (
              <p className="text-[11px] font-mono text-rose-400">{passkeyError}</p>
            )}
          </div>

          <button
            type="submit"
            className="w-full py-3 rounded-xl bg-amber-400 hover:bg-amber-300 text-black font-mono text-xs font-bold transition shadow-[0_0_20px_rgba(251,191,36,0.4)] cursor-pointer flex items-center justify-center gap-2"
          >
            <Unlock className="w-4 h-4 fill-black" />
            <span>Unlock Founder Sovereign Vault</span>
          </button>
        </form>

        <div className="pt-2 flex justify-center items-center">
          <Link
            href="/pulse"
            className="px-5 py-2.5 rounded-xl bg-cyan-500/20 hover:bg-cyan-500/30 border border-cyan-500/40 text-cyan-300 font-mono text-xs font-bold transition cursor-pointer"
          >
            Return to Platform Feed
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full max-w-full space-y-6 font-sans text-left overflow-x-hidden min-w-0">
      {/* Top Header: Founder Sovereign vs Staff Admin */}
      <div className={`flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b ${
        isFounderClearance ? 'border-amber-500/30' : 'border-cyan-500/30'
      }`}>
        <div className="space-y-1">
          <div className={`inline-flex items-center gap-2 px-3 py-0.5 rounded-full font-mono text-[10px] font-bold ${
            isFounderClearance
              ? 'bg-amber-500/10 border border-amber-500/30 text-amber-300'
              : 'bg-cyan-500/10 border border-cyan-500/30 text-cyan-300'
          }`}>
            {isFounderClearance ? (
              <>
                <Crown className="w-3.5 h-3.5 text-amber-400 fill-amber-400" />
                <span>EXECUTIVE NETWORK STATE OVERSIGHT // SOVEREIGN CLEARANCE (@yuveer)</span>
              </>
            ) : (
              <>
                <ShieldCheck className="w-3.5 h-3.5 text-cyan-400" />
                <span>STAFF OPERATIONAL CLEARANCE // LEVEL 2 ADMINISTRATION</span>
              </>
            )}
          </div>
          <h1 className="text-2xl sm:text-4xl font-bold font-mono text-white tracking-wide uppercase">
            {isFounderClearance ? 'Supreme Founder Sovereign Vault' : 'Staff Administrator Operations Console'}
          </h1>
          <p className="text-xs text-neutral-400 font-mono">
            {isFounderClearance
              ? '100% omnipotent control: Personal Founder Keys, Directives, VIP Allocations, SQL CLI, User Faucet & Killswitches.'
              : 'Operations, Member Moderation, Feed & Community Management Enclave. Protocol and Escrow modifications are restricted to Level 0.'}
          </p>
        </div>

        <div className="flex items-center gap-2 font-mono text-xs">
          <button
            onClick={handleExportDatabaseJSON}
            className="px-3.5 py-1.5 rounded-xl bg-white/10 hover:bg-white/20 border border-white/20 text-white font-bold transition flex items-center gap-1.5 cursor-pointer shadow"
            title="Download Full Database Snapshot JSON"
          >
            <Download className="w-3.5 h-3.5" />
            <span>Export JSON</span>
          </button>

          <span className={`px-3.5 py-1.5 rounded-xl font-bold shadow ${
            isFounderClearance
              ? 'bg-amber-400/20 border border-amber-400/40 text-amber-300 shadow-[0_0_15px_rgba(251,191,36,0.3)]'
              : 'bg-cyan-400/20 border border-cyan-400/40 text-cyan-300 shadow-[0_0_15px_rgba(6,182,212,0.3)]'
          }`}>
            {isFounderClearance ? '👑 ROOT MASTER (100%)' : '🛡️ STAFF ADMIN (LEVEL 2)'}
          </span>
        </div>
      </div>

      {/* Global Tab Navigation */}
      <div className="flex items-center gap-2 overflow-x-auto no-scrollbar pb-2 border-b border-white/10 font-mono text-xs w-full max-w-full">
        {[
          { id: 'overview', label: '📊 System Telemetry', icon: Cpu },
          { id: 'masterkey', label: '🔑 Personal Master Key', icon: KeyRound },
          { id: 'adminlinks', label: '🔗 Admin Bypass Links', icon: ShieldCheck },
          { id: 'terminal', label: '💻 Root Terminal (CLI)', icon: Terminal },
          { id: 'directive', label: '👑 Founder\'s Note', icon: Radio },
          { id: 'press', label: '📰 Founder Press Studio', icon: Newspaper },
          { id: 'subscriptions', label: '💳 VIP Subscriptions', icon: CreditCard },
          { id: 'users', label: '🛡️ Node Clearance & Faucet', icon: Users },
          { id: 'sheets', label: '📊 Google Sheets Hub', icon: Database },
          { id: 'site', label: '🌐 Site Overrides & Ticker', icon: Globe2 },
          { id: 'protocol', label: '⚙️ Protocol & Killswitches', icon: Sliders },
          { id: 'audit', label: '📜 Audit Ledger', icon: Activity },
        ].map((tab) => {
          const Icon = tab.icon;
          const active = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`flex items-center gap-2 px-4 py-3 rounded-2xl transition font-bold whitespace-nowrap cursor-pointer border shrink-0 ${
                active
                  ? 'bg-amber-400 text-black border-amber-300 shadow-[0_0_20px_rgba(251,191,36,0.4)]'
                  : 'bg-[#090b14] border-white/10 text-neutral-400 hover:text-white hover:border-white/20'
              }`}
            >
              <Icon className="w-4 h-4" />
              <span>{tab.label}</span>
            </button>
          );
        })}
      </div>

      {/* Feedback Banner */}
      {feedback && (
        <div className="p-4 rounded-2xl bg-amber-500/15 border border-amber-500/30 text-amber-300 text-xs font-mono flex items-center gap-2.5 shadow-lg">
          <CheckCircle2 className="w-4 h-4 text-amber-400 shrink-0" />
          <span>{feedback}</span>
        </div>
      )}

      {/* ── TAB 1: OVERVIEW & TELEMETRY ── */}
      {activeTab === 'overview' && (
        <div className="space-y-6 w-full max-w-full">
          <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4 w-full">
            <MetricCard
              label="REGISTERED IDENTITIES"
              value={totalUsers}
              subtext={`${totalAccounts} Linked OAuth accounts`}
              icon={Users}
              status="normal"
            />
            <MetricCard
              label="FOUNDER CLEARANCE"
              value="@yuveer"
              subtext="100% Omnipotent Root Level 0"
              icon={Crown}
              status="success"
            />
            <MetricCard
              label="PROTOCOL CIPHER SUITE"
              value="ED25519"
              subtext="Volatile socket encryption active"
              icon={Zap}
              status="success"
            />
            <MetricCard
              label="CONSTITUTIONAL ESCROW"
              value={`${siteOverrides.escrowPercentage}%`}
              subtext="Hardcoded gross allocation"
              icon={Coins}
              status="normal"
            />
          </div>

          {/* Master Key Quick Status */}
          <div className="p-6 rounded-3xl border border-amber-500/30 bg-gradient-to-r from-amber-950/30 via-[#0a0c14] to-zinc-950 space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2 font-mono text-xs text-amber-300 font-bold">
                <KeyRound className="w-4 h-4 text-amber-400" />
                <span>ACTIVE PERSONAL FOUNDER MASTER KEYS</span>
              </div>
              <button
                onClick={() => setActiveTab('masterkey')}
                className="px-3 py-1 rounded-xl bg-white/10 hover:bg-white/20 text-white font-mono text-xs transition cursor-pointer"
              >
                Key Manager →
              </button>
            </div>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 font-mono text-xs">
              {PERSONAL_FOUNDER_KEYS.slice(0, 2).map((k) => (
                <div key={k} className="p-3 rounded-2xl bg-black/60 border border-amber-400/30 flex items-center justify-between">
                  <div className="space-y-0.5">
                    <span className="text-[10px] text-neutral-400 uppercase">Master Sovereign Passkey</span>
                    <p className="text-amber-300 font-bold tracking-widest">••••••••••••••••</p>
                  </div>
                  <button
                    type="button"
                    onClick={() => handleCopyKey(k)}
                    className="p-2 rounded-xl bg-amber-400/20 hover:bg-amber-400/30 text-amber-300 transition cursor-pointer"
                    title="Copy Key"
                  >
                    {copiedKey === k ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                  </button>
                </div>
              ))}
            </div>
          </div>

          {/* Quick Directive Preview */}
          <div className="p-6 rounded-3xl border border-white/10 bg-[#080a10] space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2 font-mono text-xs text-rose-300 font-bold">
                <Radio className="w-4 h-4 text-rose-400 animate-pulse" />
                <span>ACTIVE FOUNDER DIRECTIVE IN NETWORK FEED</span>
              </div>
              <button
                onClick={() => setActiveTab('directive')}
                className="px-3 py-1 rounded-xl bg-white/10 hover:bg-white/20 text-white font-mono text-xs transition cursor-pointer"
              >
                Edit Directive →
              </button>
            </div>
            <div className="p-4 rounded-2xl bg-black/60 border border-white/10 space-y-2">
              <span className="text-[10px] font-mono text-amber-400 font-bold uppercase tracking-widest">
                {directive.tag} • {directive.priority} • {directive.isActive ? 'BROADCASTING' : 'OFFLINE'}
              </span>
              <h3 className="font-display font-bold text-white text-base">{directive.title}</h3>
              <p className="text-xs text-neutral-300 leading-relaxed font-sans font-light">{directive.body}</p>
              <p className="text-[10px] font-mono text-neutral-500 pt-1">Author: {directive.author}</p>
            </div>
          </div>
        </div>
      )}

      {/* ── TAB 2: PERSONAL MASTER KEY MANAGER ── */}
      {activeTab === 'masterkey' && (
        <div className="p-6 sm:p-8 rounded-3xl bg-[#080a10] border border-amber-500/30 shadow-2xl space-y-6">
          <div className="flex items-center justify-between border-b border-white/10 pb-4">
            <div className="space-y-1">
              <h2 className="font-mono font-bold text-lg text-white uppercase flex items-center gap-2">
                <KeyRound className="w-5 h-5 text-amber-400" />
                <span>Founder Personal Sovereign Master Keys</span>
              </h2>
              <p className="text-xs text-neutral-400 font-mono">
                Hardcoded and custom cryptographic keys for @yuveer to authenticate root access on any browser without passwords.
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 font-mono text-xs">
            {PERSONAL_FOUNDER_KEYS.map((k, idx) => (
              <div key={k} className="p-4 rounded-2xl bg-black/80 border border-amber-400/30 flex items-center justify-between">
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="px-2 py-0.5 rounded bg-amber-400/20 text-amber-300 text-[10px] font-bold">
                      KEY #{idx + 1}
                    </span>
                    <span className="text-emerald-400 text-[10px]">ACTIVE // PERMANENT</span>
                  </div>
                  <p className="text-white font-bold text-sm tracking-widest">••••••••••••••••</p>
                </div>

                <button
                  type="button"
                  onClick={() => handleCopyKey(k)}
                  className="px-3 py-1.5 rounded-xl bg-amber-400/20 hover:bg-amber-400/30 text-amber-300 font-bold transition flex items-center gap-1.5 cursor-pointer"
                >
                  {copiedKey === k ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                  <span>{copiedKey === k ? 'Copied' : 'Copy'}</span>
                </button>
              </div>
            ))}
          </div>

          {/* Custom Master Key Setter */}
          <form onSubmit={handleSetCustomKey} className="p-5 rounded-2xl bg-amber-500/5 border border-amber-500/20 space-y-4">
            <div className="space-y-1">
              <label className="text-[11px] font-mono text-amber-300 uppercase font-bold">
                Set Custom Personal Master Key
              </label>
              <p className="text-[11px] font-mono text-neutral-400">
                Create your own custom secret key string that will immediately grant 100% root access on any machine.
              </p>
            </div>

            <div className="flex gap-3">
              <input
                type="text"
                value={customKeyInput}
                onChange={(e) => setCustomKeyInput(e.target.value)}
                placeholder="Insert your code"
                className="flex-1 px-4 py-2.5 rounded-xl bg-black border border-white/20 text-white font-mono text-xs focus:outline-none focus:border-amber-400"
              />
              <button
                type="submit"
                className="px-5 py-2.5 rounded-xl bg-amber-400 hover:bg-amber-300 text-black font-mono text-xs font-bold transition cursor-pointer shadow"
              >
                Save Custom Key
              </button>
            </div>
          </form>
        </div>
      )}

      {/* ── TAB 2.5: ADMIN BYPASS LINKS (ENCLAVE MAGIC ACCESS) ── */}
      {activeTab === 'adminlinks' && (
        <AdminEnclaveManager
          notify={notify}
          getBaseOrigin={getBaseOrigin}
        />
      )}

      {/* ── TAB 3: ROOT TERMINAL (CLI) ── */}
      {activeTab === 'terminal' && (
        <div className="p-6 rounded-3xl bg-[#040508] border border-white/15 shadow-2xl font-mono space-y-4">
          <div className="flex items-center justify-between border-b border-white/10 pb-3">
            <div className="flex items-center gap-2 text-xs text-neutral-300">
              <Terminal className="w-4 h-4 text-emerald-400" />
              <span className="font-bold text-white">INTERACTIVE ROOT COMMAND CLI</span>
              <span className="text-neutral-500">|</span>
              <span className="text-emerald-400 text-[11px]">ACTIVE SESSION: @yuveer (ROOT)</span>
            </div>
            <button
              type="button"
              onClick={() => {
                if (typeof window !== 'undefined') {
                  try { sessionStorage.removeItem('zenvitra_root_cli_logs'); } catch (_) {}
                }
                setTerminalLogs([{ text: 'Terminal output buffer cleared.', type: 'info' }]);
              }}
              className="px-3 py-1 rounded-lg bg-white/5 hover:bg-white/10 text-neutral-400 text-[10px] transition cursor-pointer"
            >
              Clear Buffer
            </button>
          </div>

          {/* Terminal Console Output */}
          <div className="p-4 rounded-2xl bg-black/90 border border-white/10 h-72 overflow-y-auto space-y-1.5 text-xs">
            {terminalLogs.map((log, idx) => (
              <div 
                key={idx} 
                className={`${
                  log.type === 'cmd' 
                    ? 'text-cyan-300 font-bold' 
                    : log.type === 'success' 
                    ? 'text-emerald-400' 
                    : log.type === 'warn' 
                    ? 'text-amber-400' 
                    : log.type === 'error' 
                    ? 'text-rose-400' 
                    : 'text-neutral-300'
                }`}
              >
                {log.text}
              </div>
            ))}
          </div>

          {/* Terminal Input */}
          <form onSubmit={handleTerminalSubmit} className="flex gap-2">
            <span className="py-2.5 text-emerald-400 font-bold text-xs select-none">root@zenvitra:~$</span>
            <input
              type="text"
              value={terminalInput}
              onChange={(e) => setTerminalInput(e.target.value)}
              placeholder="Type a command e.g. status, help, freeze, resume, faucet, promote..."
              className="flex-1 px-4 py-2.5 rounded-xl bg-black border border-white/20 text-white font-mono text-xs focus:outline-none focus:border-emerald-400"
              autoFocus
            />
            <button
              type="submit"
              className="px-5 py-2.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-black font-mono text-xs font-bold transition cursor-pointer"
            >
              Execute
            </button>
          </form>
        </div>
      )}

      {/* ── TAB 4: FOUNDER'S NOTE & DIRECTIVE EDITOR ── */}
      {activeTab === 'directive' && (
        <form onSubmit={handleSaveDirective} className="p-6 sm:p-8 rounded-3xl bg-[#080a10] border border-amber-500/30 shadow-2xl space-y-6">
          <div className="flex items-center justify-between border-b border-white/10 pb-4">
            <div className="space-y-1">
              <h2 className="font-mono font-bold text-lg text-white uppercase">
                Founder Note &amp; Live Directive Studio
              </h2>
              <p className="text-xs text-neutral-400 font-mono">
                Mutate the global statement rendered across the home page and feed in real time.
              </p>
            </div>

            <label className="flex items-center gap-2 text-xs font-mono cursor-pointer bg-black/60 px-4 py-2 rounded-2xl border border-white/10">
              <input
                type="checkbox"
                checked={directiveActive}
                onChange={(e) => setDirectiveActive(e.target.checked)}
                className="w-4 h-4 rounded text-amber-500 accent-amber-500 cursor-pointer"
              />
              <span className={directiveActive ? 'text-amber-400 font-bold' : 'text-zinc-500'}>
                {directiveActive ? 'BROADCAST ACTIVE' : 'BROADCAST MUTED'}
              </span>
            </label>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <label className="text-[11px] font-mono text-neutral-400 uppercase">Priority Level</label>
              <div className="flex items-center gap-2">
                {(['NORMAL', 'URGENT', 'CONSTITUTIONAL'] as const).map((p) => (
                  <button
                    key={p}
                    type="button"
                    onClick={() => setDirectivePriority(p)}
                    className={`flex-1 py-2 rounded-xl text-xs font-mono font-bold transition cursor-pointer border ${
                      directivePriority === p
                        ? p === 'CONSTITUTIONAL'
                          ? 'bg-amber-500/20 border-amber-500 text-amber-300 shadow'
                          : p === 'URGENT'
                          ? 'bg-rose-500/20 border-rose-500 text-rose-300 shadow'
                          : 'bg-cyan-500/20 border-cyan-500 text-cyan-300 shadow'
                        : 'bg-black border-white/10 text-neutral-400'
                    }`}
                  >
                    {p}
                  </button>
                ))}
              </div>
            </div>

            <div className="space-y-1.5">
              <label className="text-[11px] font-mono text-neutral-400 uppercase">Sign-off Signature</label>
              <input
                type="text"
                value={directiveAuthor}
                onChange={(e) => setDirectiveAuthor(e.target.value)}
                placeholder="Enter author signature"
                className="w-full px-4 py-2.5 rounded-xl bg-black border border-white/20 text-white font-mono text-xs focus:outline-none focus:border-amber-400"
              />
            </div>
          </div>

          <div className="space-y-1.5">
            <label className="text-[11px] font-mono text-neutral-400 uppercase">Directive / Note Headline</label>
            <input
              type="text"
              required
              value={directiveTitle}
              onChange={(e) => setDirectiveTitle(e.target.value)}
              placeholder="e.g. CONSTITUTIONAL MANDATE: REJECTION OF AD-SURVEILLANCE"
              className="w-full px-4 py-3 rounded-xl bg-black border border-white/20 text-white font-mono text-xs focus:outline-none focus:border-amber-400 font-bold"
            />
          </div>

          <div className="space-y-1.5">
            <label className="text-[11px] font-mono text-neutral-400 uppercase">Directive Full Body &amp; Decrees</label>
            <textarea
              rows={5}
              required
              value={directiveBody}
              onChange={(e) => setDirectiveBody(e.target.value)}
              placeholder="Write the executive announcement or founder message..."
              className="w-full px-4 py-3 rounded-xl bg-black border border-white/20 text-white font-mono text-xs focus:outline-none focus:border-amber-400 leading-relaxed"
            />
          </div>

          <div className="flex items-center justify-between pt-4 border-t border-white/10">
            <button
              type="button"
              onClick={() => {
                clearFounderDirective();
                setDirectiveActive(false);
                notify('Founder directive cleared.');
              }}
              className="px-4 py-2.5 rounded-xl bg-rose-500/10 hover:bg-rose-500/25 text-rose-300 border border-rose-500/30 text-xs font-mono font-bold transition cursor-pointer"
            >
              Clear Active Note
            </button>

            <button
              type="submit"
              className="px-8 py-3 rounded-xl bg-amber-400 hover:bg-amber-300 text-black font-mono text-xs font-bold transition cursor-pointer shadow-[0_0_20px_rgba(251,191,36,0.4)] flex items-center gap-2"
            >
              <Save className="w-4 h-4 fill-black" />
              <span>Broadcast Live Directive</span>
            </button>
          </div>
        </form>
      )}

      {/* ── TAB 4.5: FOUNDER PRESS STUDIO & BUREAU ── */}
      {activeTab === 'press' && (
        <FounderPressStudio notify={(msg) => notify(msg)} />
      )}

      {/* ── TAB 5: VIP SUBSCRIPTIONS & CLEARANCE ── */}
      {activeTab === 'subscriptions' && (
        <div className="space-y-6">
          <form onSubmit={handleGrantSubscription} className="p-6 sm:p-8 rounded-3xl bg-[#080a10] border border-white/10 space-y-4">
            <div className="space-y-1 border-b border-white/10 pb-3">
              <h3 className="font-mono font-bold text-base text-white uppercase flex items-center gap-2">
                <CreditCard className="w-4 h-4 text-amber-400" />
                <span>Bestow VIP Sovereign Tier</span>
              </h3>
              <p className="text-xs font-mono text-neutral-400">
                Grant lifetime subscription passes to any delegate or node handle.
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <input
                type="text"
                required
                value={subTargetUser}
                onChange={(e) => setSubTargetUser(e.target.value)}
                placeholder="Recipient @handle"
                className="px-3.5 py-2.5 rounded-xl bg-black border border-white/20 text-white font-mono text-xs focus:outline-none focus:border-amber-400"
              />

              <select
                value={subTier}
                onChange={(e) => setSubTier(e.target.value as any)}
                className="px-3.5 py-2.5 rounded-xl bg-black border border-white/20 text-white font-mono text-xs focus:outline-none focus:border-amber-400 cursor-pointer"
              >
                <option value="FOUNDER_PATRON">👑 FOUNDER_PATRON (VIP Supreme)</option>
                <option value="SECRETARIAT_CHAIR">🏛️ SECRETARIAT_CHAIR (Council Chair)</option>
                <option value="DIPLOMAT_LIFETIME">🛡️ DIPLOMAT_LIFETIME (Permanent)</option>
                <option value="PULSE_PRO">⚡ PULSE_PRO (Verified Creator)</option>
                <option value="PULSE_PASS">🎫 PULSE_PASS (Season Pass)</option>
              </select>

              <select
                value={subDuration}
                onChange={(e) => setSubDuration(e.target.value)}
                className="px-3.5 py-2.5 rounded-xl bg-black border border-white/20 text-white font-mono text-xs focus:outline-none focus:border-amber-400 cursor-pointer"
              >
                <option value="LIFETIME">LIFETIME (Never Expires)</option>
                <option value="1_YEAR">1 Year (365 Days)</option>
                <option value="1_MONTH">1 Month (30 Days)</option>
              </select>
            </div>

            <div className="flex justify-end pt-2">
              <button
                type="submit"
                className="px-6 py-2.5 rounded-xl bg-amber-400 hover:bg-amber-300 text-black font-mono text-xs font-bold transition shadow cursor-pointer flex items-center gap-2"
              >
                <Sparkles className="w-3.5 h-3.5 fill-black" />
                <span>Grant VIP Clearance</span>
              </button>
            </div>
          </form>

          {/* Active Subscriptions List */}
          <div className="p-6 rounded-3xl bg-[#080a10] border border-white/10 space-y-4">
            <span className="font-mono text-xs font-bold text-neutral-400 uppercase block">
              Active Granted VIP Clearances ({Object.keys(subscriptionsList).length})
            </span>

            <div className="space-y-2">
              {Object.keys(subscriptionsList).length === 0 ? (
                <p className="text-neutral-500 font-mono text-xs py-4 text-center">No manual VIP subscriptions granted yet.</p>
              ) : (
                Object.values(subscriptionsList).map((sub) => (
                  <div key={sub.username} className="p-3.5 rounded-2xl bg-black border border-white/10 flex items-center justify-between font-mono text-xs">
                    <div className="flex items-center gap-3">
                      <span className="px-2 py-0.5 rounded-full bg-amber-400/20 text-amber-300 text-[10px] font-bold">
                        {sub.tier}
                      </span>
                      <span className="text-white font-bold">@{sub.username}</span>
                      <span className="text-neutral-500 text-[11px]">• Duration: {sub.expiresAt || 'LIFETIME'}</span>
                    </div>

                    <button
                      type="button"
                      onClick={() => handleRevokeSub(sub.username)}
                      className="text-rose-400 hover:text-rose-300 transition text-xs font-bold cursor-pointer"
                    >
                      Revoke
                    </button>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      )}

      {/* ── TAB 6: NODE CLEARANCE & FAUCET ── */}
      {activeTab === 'users' && (
        <div className="space-y-6">
          <form onSubmit={handleSaveUserOverride} className="p-6 sm:p-8 rounded-3xl bg-[#080a10] border border-white/10 space-y-4">
            <div className="space-y-1 border-b border-white/10 pb-3">
              <h3 className="font-mono font-bold text-base text-white uppercase flex items-center gap-2">
                <Users className="w-4 h-4 text-cyan-400" />
                <span>Node Role Elevation &amp; Civic Points Faucet</span>
              </h3>
              <p className="text-xs font-mono text-neutral-400">
                Instantly elevate any user handle to Founder, Admin, Moderator, or inject Civic Points into their wallet.
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-4 gap-3">
              <input
                type="text"
                required
                value={userTargetHandle}
                onChange={(e) => setUserTargetHandle(e.target.value)}
                placeholder="Target @handle"
                className="px-3.5 py-2.5 rounded-xl bg-black border border-white/20 text-white font-mono text-xs focus:outline-none focus:border-cyan-400"
              />

              <select
                value={userTargetRole}
                onChange={(e) => setUserTargetRole(e.target.value as any)}
                className="px-3.5 py-2.5 rounded-xl bg-black border border-white/20 text-white font-mono text-xs focus:outline-none focus:border-cyan-400 cursor-pointer"
              >
                <option value="FOUNDER">👑 FOUNDER (Supreme Root)</option>
                <option value="ADMIN">🛡️ ADMIN (Operational Console)</option>
                <option value="MODERATOR">⚖️ MODERATOR (Disputes &amp; Feed)</option>
                <option value="ORGANIZER">🏛️ ORGANIZER (Chamber Lead)</option>
                <option value="DELEGATE">📜 DELEGATE (Standard Node)</option>
                <option value="SUSPENDED">🚫 SUSPENDED (Ban from Mesh)</option>
              </select>

              <select
                value={userTargetBadge}
                onChange={(e) => setUserTargetBadge(e.target.value as any)}
                className="px-3.5 py-2.5 rounded-xl bg-black border border-white/20 text-white font-mono text-xs focus:outline-none focus:border-cyan-400 cursor-pointer"
              >
                <option value="GOLD">🏅 GOLD Checkmark (Founder/Royal)</option>
                <option value="BLUE">🔹 BLUE Checkmark (Diplomat)</option>
                <option value="NONE">❌ No Badge</option>
              </select>

              <input
                type="number"
                value={userPointsAmount}
                onChange={(e) => setUserPointsAmount(e.target.value)}
                placeholder="Inject Points (e.g. 5000)"
                className="px-3.5 py-2.5 rounded-xl bg-black border border-white/20 text-white font-mono text-xs focus:outline-none focus:border-cyan-400"
              />
            </div>

            <div className="space-y-1">
              <label className="text-[11px] font-mono text-neutral-400 uppercase">Custom Title / Designation</label>
              <input
                type="text"
                value={userCustomTitle}
                onChange={(e) => setUserCustomTitle(e.target.value)}
                placeholder="e.g. Lead Diplomatic Architect / Secretariat General"
                className="w-full px-3.5 py-2.5 rounded-xl bg-black border border-white/20 text-white font-mono text-xs focus:outline-none focus:border-cyan-400"
              />
            </div>

            <div className="flex justify-end pt-2">
              <button
                type="submit"
                className="px-6 py-2.5 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-black font-mono text-xs font-bold transition shadow cursor-pointer flex items-center gap-2"
              >
                <Save className="w-3.5 h-3.5 fill-black" />
                <span>Apply Node Clearance &amp; Points</span>
              </button>
            </div>
          </form>

          {/* User Overrides Directory */}
          <div className="p-6 rounded-3xl bg-[#080a10] border border-white/10 space-y-4">
            <span className="font-mono text-xs font-bold text-neutral-400 uppercase block">
              Active Sovereign User Overrides ({Object.keys(userOverridesList).length})
            </span>

            <div className="space-y-2">
              {Object.keys(userOverridesList).length === 0 ? (
                <p className="text-neutral-500 font-mono text-xs py-4 text-center">No user nodes mutated yet.</p>
              ) : (
                Object.values(userOverridesList).map((node) => (
                  <div key={node.username} className="p-3.5 rounded-2xl bg-black border border-white/10 flex items-center justify-between font-mono text-xs">
                    <div className="flex items-center gap-3">
                      <span className="px-2 py-0.5 rounded-full bg-cyan-500/20 text-cyan-300 text-[10px] font-bold">
                        {node.role}
                      </span>
                      <span className="text-white font-bold">@{node.username}</span>
                      {node.verifiedBadge !== 'NONE' && (
                        <span className={`text-[10px] ${node.verifiedBadge === 'GOLD' ? 'text-amber-400' : 'text-blue-400'}`}>
                          [{node.verifiedBadge} BADGE]
                        </span>
                      )}
                      {node.extraCivicPoints ? (
                        <span className="text-emerald-400 text-[11px] font-bold">+{node.extraCivicPoints} PTS</span>
                      ) : null}
                    </div>

                    <button
                      type="button"
                      onClick={() => {
                        saveUserOverride(node.username, { role: 'DELEGATE', verifiedBadge: 'NONE', extraCivicPoints: 0 });
                        setUserOverridesList(getAllUserOverrides());
                        notify(`Reset override for @${node.username}`);
                      }}
                      className="text-neutral-400 hover:text-white transition text-xs cursor-pointer"
                    >
                      Reset
                    </button>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      )}

      {/* ── TAB 7: GOOGLE SHEETS BI-DIRECTIONAL HUB ── */}
      {activeTab === 'sheets' && (
        <div className="p-6 sm:p-8 rounded-3xl bg-[#080a10] border border-white/10 space-y-6">
          <div className="flex items-center justify-between border-b border-white/10 pb-4">
            <div className="space-y-1">
              <h2 className="font-mono font-bold text-lg text-white uppercase flex items-center gap-2">
                <Database className="w-5 h-5 text-emerald-400" />
                <span>Google Sheets Bi-directional Sync Diagnostics</span>
              </h2>
              <p className="text-xs text-neutral-400 font-mono">
                Inspect Google Apps Script Web App sync status, test data roundtrips, and verify delegate registration feeds.
              </p>
            </div>

            <button
              type="button"
              onClick={handleTriggerSheetSync}
              className="px-5 py-2.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-black font-mono text-xs font-bold transition cursor-pointer shadow flex items-center gap-2"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${sheetSyncStatus === 'SYNCING' ? 'animate-spin' : ''}`} />
              <span>Trigger Sync Test</span>
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 font-mono text-xs">
            <div className="p-4 rounded-2xl bg-black border border-white/10 space-y-2">
              <span className="text-neutral-400 text-[11px] uppercase block">Web App Endpoint Route</span>
              <p className="text-cyan-300 font-bold break-all">/api/sheets (Proxies to Google Apps Script Web App)</p>
              <span className="text-[10px] text-neutral-500 block">Bi-directional GET (Search &amp; Users) &amp; POST (Event, Login, Speech, Post sync)</span>
            </div>

            <div className="p-4 rounded-2xl bg-black border border-white/10 space-y-2">
              <span className="text-neutral-400 text-[11px] uppercase block">Latest Diagnostic Result</span>
              <p className={`${sheetSyncStatus === 'SUCCESS' ? 'text-emerald-400 font-bold' : sheetSyncStatus === 'ERROR' ? 'text-rose-400 font-bold' : 'text-neutral-300'}`}>
                {sheetSyncLog}
              </p>
            </div>
          </div>
        </div>
      )}

      {/* ── TAB 8: GLOBAL SITE OVERRIDES & TICKER ── */}
      {activeTab === 'site' && (
        <form onSubmit={handleSaveSiteOverrides} className="p-6 sm:p-8 rounded-3xl bg-[#080a10] border border-white/10 space-y-6">
          <div className="space-y-1 border-b border-white/10 pb-4">
            <h2 className="font-mono font-bold text-lg text-white uppercase flex items-center gap-2">
              <Globe2 className="w-5 h-5 text-purple-400" />
              <span>Global Site Parameters &amp; Diplomatic Ticker</span>
            </h2>
            <p className="text-xs text-neutral-400 font-mono">
              Control the live ticker text, emergency banner broadcast, and constitutional escrow percentages.
            </p>
          </div>

          <div className="space-y-4">
            <div className="space-y-1.5">
              <div className="flex items-center justify-between">
                <label className="text-[11px] font-mono text-neutral-400 uppercase">Live Diplomatic Wire Ticker</label>
                <label className="flex items-center gap-2 text-xs font-mono cursor-pointer">
                  <input
                    type="checkbox"
                    checked={tickerActive}
                    onChange={(e) => setTickerActive(e.target.checked)}
                    className="w-4 h-4 rounded text-amber-400 accent-amber-400"
                  />
                  <span className={tickerActive ? 'text-emerald-400 font-bold' : 'text-neutral-500'}>
                    {tickerActive ? 'TICKER ONLINE' : 'MUTED'}
                  </span>
                </label>
              </div>
              <input
                type="text"
                value={tickerText}
                onChange={(e) => setTickerText(e.target.value)}
                placeholder="e.g. 🔴 LIVE WIRE • UN Plenary Session #418: Accord passed with 94% Supermajority"
                className="w-full px-4 py-2.5 rounded-xl bg-black border border-white/20 text-white font-mono text-xs focus:outline-none focus:border-amber-400"
              />
            </div>

            <div className="space-y-1.5">
              <div className="flex items-center justify-between">
                <label className="text-[11px] font-mono text-neutral-400 uppercase">Top Global Emergency Notice</label>
                <label className="flex items-center gap-2 text-xs font-mono cursor-pointer">
                  <input
                    type="checkbox"
                    checked={bannerActive}
                    onChange={(e) => setBannerActive(e.target.checked)}
                    className="w-4 h-4 rounded text-rose-500 accent-rose-500"
                  />
                  <span className={bannerActive ? 'text-rose-400 font-bold' : 'text-neutral-500'}>
                    {bannerActive ? 'BANNER DISPLAYING' : 'OFFLINE'}
                  </span>
                </label>
              </div>
              <input
                type="text"
                value={bannerNotice}
                onChange={(e) => setBannerNotice(e.target.value)}
                placeholder="e.g. ⚠️ PLENARY SUMMIT COMMENCING IN GENEVA CHAMBER"
                className="w-full px-4 py-2.5 rounded-xl bg-black border border-white/20 text-white font-mono text-xs focus:outline-none focus:border-rose-400"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
              <div className="space-y-1">
                <label className="text-[11px] font-mono text-neutral-400 uppercase">
                  Constitutional Escrow Mandate ({escrowPercentage}%)
                </label>
                <input
                  type="number"
                  min="1"
                  max="100"
                  value={escrowPercentage}
                  onChange={(e) => setEscrowPercentage(Number(e.target.value))}
                  className="w-full px-4 py-2.5 rounded-xl bg-black border border-white/20 text-white font-mono text-xs focus:outline-none focus:border-amber-400"
                />
              </div>

              <div className="space-y-1">
                <label className="text-[11px] font-mono text-neutral-400 uppercase">Target Launch Countdown Date (ISO)</label>
                <input
                  type="text"
                  value={targetLaunchDate}
                  onChange={(e) => setTargetLaunchDate(e.target.value)}
                  className="w-full px-4 py-2.5 rounded-xl bg-black border border-white/20 text-white font-mono text-xs focus:outline-none focus:border-amber-400"
                />
              </div>
            </div>
          </div>

          <div className="flex justify-end pt-2">
            <button
              type="submit"
              className="px-6 py-2.5 rounded-xl bg-amber-400 hover:bg-amber-300 text-black font-mono text-xs font-bold transition cursor-pointer shadow flex items-center gap-2"
            >
              <Save className="w-3.5 h-3.5 fill-black" />
              <span>Apply Global Site Parameters</span>
            </button>
          </div>
        </form>
      )}

      {/* ── TAB 9: PROTOCOL & KILL SWITCHES ── */}
      {activeTab === 'protocol' && (
        <div className="space-y-6 font-mono text-xs">
          {/* 🚨 SPECIAL HIGHLIGHT: PROTOCOL OMEGA (CITADEL MAINTENANCE LOCKOUT) */}
          <div className={`p-6 sm:p-8 rounded-3xl border transition shadow-2xl space-y-4 ${
            protocols.maintenanceMode
              ? 'bg-gradient-to-r from-rose-950/60 via-red-950/40 to-black border-rose-500/60 shadow-[0_0_60px_rgba(244,63,94,0.3)]'
              : 'bg-gradient-to-r from-amber-950/30 via-zinc-950 to-black border-amber-500/30'
          }`}>
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div className="space-y-1.5">
                <div className="flex items-center gap-2">
                  <span className="flex h-3 w-3 relative">
                    <span className={`animate-ping absolute inline-flex h-full w-full rounded-full opacity-75 ${
                      protocols.maintenanceMode ? 'bg-rose-400' : 'bg-emerald-400'
                    }`}></span>
                    <span className={`relative inline-flex rounded-full h-3 w-3 ${
                      protocols.maintenanceMode ? 'bg-rose-500' : 'bg-emerald-500'
                    }`}></span>
                  </span>
                  <span className={`text-sm font-black tracking-wider uppercase flex items-center gap-1.5 ${
                    protocols.maintenanceMode ? 'text-rose-300' : 'text-amber-300'
                  }`}>
                    <ShieldAlert className="w-5 h-5" />
                    <span>PROTOCOL OMEGA &bull; CITADEL MAINTENANCE LOCKOUT</span>
                  </span>
                </div>
                <p className="text-xs text-neutral-300 leading-relaxed font-sans max-w-2xl">
                  When enabled, the entire website displays the high-security <strong>Citadel Calibration Screen</strong> to public delegates. You (<strong className="text-amber-300">@yuveer</strong>) and Admins retain <strong>100% browsing immunity &amp; operational control</strong>.
                </p>
              </div>

              <button
                type="button"
                onClick={() => handleToggleProtocol('maintenanceMode')}
                className={`px-6 py-3.5 rounded-2xl text-xs font-bold transition cursor-pointer shadow-lg whitespace-nowrap ${
                  protocols.maintenanceMode
                    ? 'bg-rose-500 hover:bg-rose-400 text-white shadow-[0_0_30px_rgba(244,63,94,0.6)] animate-pulse'
                    : 'bg-emerald-500/20 hover:bg-emerald-500/30 text-emerald-300 border border-emerald-500/40'
                }`}
              >
                {protocols.maintenanceMode ? '🚨 PROTOCOL OMEGA ACTIVE (DISENGAGE)' : 'ENGAGE PROTOCOL OMEGA'}
              </button>
            </div>

            <div className="pt-2 border-t border-white/10 flex flex-wrap items-center gap-3 text-[11px] text-neutral-400">
              <span>Current Status: <strong className={protocols.maintenanceMode ? 'text-rose-400' : 'text-emerald-400'}>{protocols.maintenanceMode ? 'CITADEL LOCKOUT ENGAGED' : 'PUBLIC MESH ACCESSIBLE'}</strong></span>
              <span>&bull;</span>
              <span>Immunity: <strong className="text-amber-300">@yuveer &amp; Admins Unrestricted</strong></span>
            </div>
          </div>

          {/* Standard Circuit Matrix Toggles */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {[
              { key: 'chatMeshEnabled', label: 'ZenChat Sovereign Mesh', desc: 'Enable E2EE private & group rooms' },
              { key: 'fluxReelsEnabled', label: 'ZEN.FLUX Vertical Video Wire', desc: 'Enable 9:16 vertical video feed' },
              { key: 'registrationsOpen', label: 'Open Public Registrations', desc: 'Allow new accounts on platform' },
              { key: 'assemblyOsEnabled', label: 'Assembly OS & Live Voting', desc: 'Enable parliamentary caucus engine' },
              { key: 'escrowMandateActive', label: 'Constitutional 25% Profit Endowment', desc: 'Disburse 25% profits every 4 months with video proof' },
              { key: 'zeroSurveillanceActive', label: 'Zero Surveillance Enforcement', desc: 'Block tracking scripts & ads' },
            ].map((item) => {
              const k = item.key as keyof ProtocolControls;
              const isOn = protocols[k];
              return (
                <div
                  key={item.key}
                  className="p-5 rounded-3xl bg-[#080a10] border border-white/10 flex items-center justify-between gap-4 shadow"
                >
                  <div className="space-y-1">
                    <p className="font-mono text-xs font-bold text-white">{item.label}</p>
                    <p className="text-[11px] text-neutral-400 font-mono">{item.desc}</p>
                  </div>
                  <button
                    type="button"
                    onClick={() => handleToggleProtocol(k)}
                    className={`px-4 py-2 rounded-xl text-xs font-mono font-bold transition cursor-pointer ${
                      isOn
                        ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 shadow-[0_0_15px_rgba(52,211,153,0.2)]'
                        : 'bg-rose-500/20 text-rose-300 border border-rose-500/40'
                    }`}
                  >
                    {isOn ? 'ONLINE' : 'MUTED'}
                  </button>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* ── TAB 10: AUDIT TRAIL ── */}
      {activeTab === 'audit' && (
        <div className="p-6 rounded-3xl bg-[#080a10] border border-white/10 space-y-4">
          <div className="flex items-center justify-between border-b border-white/10 pb-3">
            <span className="font-mono text-xs font-bold text-neutral-400 uppercase block">
              IMMUTABLE TRANSACTION &amp; MUTATION LEDGER
            </span>
            <button
              type="button"
              onClick={handleExportDatabaseJSON}
              className="px-3 py-1 rounded-xl bg-white/10 hover:bg-white/20 text-white font-mono text-xs transition cursor-pointer flex items-center gap-1.5"
            >
              <Download className="w-3.5 h-3.5" />
              <span>Download Ledger</span>
            </button>
          </div>

          <div className="space-y-2 max-h-80 overflow-y-auto pr-1 font-mono text-xs">
            {getAuditLogs().map((log) => (
              <div
                key={log.id}
                className="p-3.5 rounded-xl bg-black border border-white/10 flex items-center justify-between"
              >
                <div className="flex items-center gap-2.5">
                  <span className="px-2 py-0.5 rounded bg-amber-400/20 text-amber-300 text-[10px] font-bold">
                    {log.type}
                  </span>
                  <span className="text-neutral-200">{log.action}</span>
                </div>
                <span className="text-neutral-500 text-[10px]">
                  {new Date(log.timestamp).toLocaleTimeString()}
                </span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}