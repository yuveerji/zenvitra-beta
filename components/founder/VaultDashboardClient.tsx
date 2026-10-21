'use client';

import React, { useState, useEffect, useMemo, useCallback } from 'react';
import Link from 'next/link';
import { useSearchParams, useRouter, usePathname } from 'next/navigation';
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
  Unlock,
  Eye,
  AlertOctagon,
  ArrowUpRight,
  TrendingUp,
  Server,
  Building,
  CheckCircle,
  XCircle,
  FileText,
  Clock,
  ArrowLeft,
  ExternalLink,
  HelpCircle,
  Search,
  Filter
} from 'lucide-react';
import { MetricCard } from './MetricCard';
import { FounderPressStudio } from '@/components/founder/FounderPressStudio';
import { ZenAdminControlRoom } from '@/components/admin/ZenAdminControlRoom';
import { FounderNoteRenderer } from '@/components/pulse/FounderNoteRenderer';
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
  addAuditLog,
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
import { useMun } from '@/context/MunContext';
import { 
  FOUNDER_SECTIONS, 
  DEFAULT_ZEN_MODULES, 
  FounderSectionId, 
  ZenModuleControl,
  FounderApprovalItem,
  FounderCriticalAlert,
  FounderLiveActivity,
  GlobalAnnouncement
} from '@/types/founder';

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
      notify(`Copied Access Link! Secret pass: ${adminPass}`);
      setTimeout(() => setCopiedId(null), 3000);
    }
  };

  const generateRandomCode = () => {
    const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';
    let code = 'ZEN-';
    for (let i = 0; i < 4; i++) code += chars[Math.floor(Math.random() * chars.length)];
    code += '-';
    for (let i = 0; i < 4; i++) code += chars[Math.floor(Math.random() * chars.length)];
    setPasscode(code);
  };

  return (
    <div className="space-y-6">
      {/* Invite Generation Card */}
      <form onSubmit={handleCreateInvite} className="p-6 sm:p-8 rounded-3xl bg-[#080a10] border border-cyan-500/30 shadow-2xl space-y-4">
        <div className="flex items-center justify-between border-b border-white/10 pb-4">
          <div className="flex items-center gap-2.5 text-cyan-400 font-mono text-xs font-bold uppercase tracking-wider">
            <Link2 className="w-4 h-4" />
            <span>Generate Hardware-Bound Enclave Link</span>
          </div>
          <span className="text-[10px] text-neutral-400 font-mono">100% PRIVATE &bull; ANTI-REUSE LOCK</span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 font-mono">
          <div className="space-y-1.5">
            <label className="text-[10px] text-neutral-400 uppercase font-bold">Admin / Staff Name</label>
            <input
              type="text"
              required
              value={adminName}
              onChange={(e) => setAdminName(e.target.value)}
              placeholder="e.g. Staff Operator (Lead Editor)"
              className="w-full px-4 py-3 rounded-xl bg-[#090b14] border border-white/20 text-white text-xs focus:outline-none focus:border-cyan-400"
            />
          </div>

          <div className="space-y-1.5">
            <div className="flex items-center justify-between">
              <label className="text-[10px] text-neutral-400 uppercase font-bold">Secret Passcode</label>
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
              placeholder="e.g. ZEN-7788-AX"
              className="w-full px-4 py-3 rounded-xl bg-[#090b14] border border-white/20 text-cyan-300 text-xs focus:outline-none focus:border-cyan-400"
            />
          </div>

          <div className="space-y-1.5">
            <label className="text-[10px] text-neutral-400 uppercase font-bold">Clearance Role</label>
            <select
              value={role}
              onChange={(e) => setRole(e.target.value as any)}
              className="w-full px-4 py-3 rounded-xl bg-[#090b14] border border-white/20 text-white text-xs focus:outline-none focus:border-cyan-400 cursor-pointer"
            >
              <option value="ADMIN">Staff Administrator</option>
              <option value="MODERATOR">Platform Moderator</option>
              <option value="ORGANIZER">Assembly Organizer</option>
            </select>
          </div>
        </div>

        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pt-2">
          <label className="flex items-center gap-2 cursor-pointer text-xs text-neutral-300 font-mono">
            <input
              type="checkbox"
              checked={singleUse}
              onChange={(e) => setSingleUse(e.target.checked)}
              className="w-4 h-4 rounded bg-[#090b14] border-white/20 text-cyan-500 focus:ring-0 cursor-pointer"
            />
            <span>Single-Use Hardware Lock (Permanently binds to the first device that claims it)</span>
          </label>

          <button
            type="submit"
            disabled={isSubmitting || !adminName.trim() || !passcode.trim()}
            className="px-6 py-3 rounded-xl bg-cyan-500 hover:bg-cyan-400 disabled:opacity-30 text-black font-bold text-xs transition cursor-pointer flex items-center justify-center gap-2 shadow-[0_0_20px_rgba(6,182,212,0.3)] shrink-0 uppercase font-mono"
          >
            <Plus className="w-4 h-4" />
            <span>Generate &amp; Register Link</span>
          </button>
        </div>
      </form>

      {/* Invites Directory */}
      <div className="space-y-4 font-mono">
        <div className="flex items-center justify-between">
          <span className="text-xs font-bold text-white uppercase tracking-wider">
            Active Enclave Access Directory &bull; ({invites.length} Registered Links)
          </span>
          <span className="text-[10px] text-neutral-500">REAL-TIME HARDWARE CLAIM STATUS</span>
        </div>

        {invites.length === 0 ? (
          <div className="p-8 rounded-3xl bg-black border border-white/10 text-center text-neutral-500 text-xs">
            No access links created yet. Use the generator above to create private links for your team.
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {invites.map((inv) => {
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
                        <span>Invite Token:</span>
                        <span className="text-cyan-300 font-bold">{inv.id}</span>
                      </div>
                      <div className="flex items-center justify-between text-neutral-400">
                        <span>Passcode:</span>
                        <span className="text-amber-300 font-bold tracking-widest">{inv.passcode}</span>
                      </div>
                      <div className="flex items-center justify-between text-neutral-400">
                        <span>Lock Mode:</span>
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
                        className={`flex-1 py-2.5 rounded-xl font-bold transition flex items-center justify-center gap-1.5 cursor-pointer text-xs ${
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

interface VaultDashboardClientProps {
  totalUsers: number;
  suspendedUsers: number;
  totalAccounts: number;
  totalApplications?: number;
  totalDonations?: number;
}

export function VaultDashboardClient({
  totalUsers,
  suspendedUsers,
  totalAccounts,
  totalApplications = 0,
  totalDonations = 0,
}: VaultDashboardClientProps) {
  const { user, profile } = useAuth();
  const { feedPosts, deletePost, createPost, currentUserUsername } = useZenPulse();
  const { conferences } = useMun();
  const searchParams = useSearchParams();
  const pathname = usePathname();

  // 12 Master Sections Navigation
  const [activeSection, setActiveSection] = useState<FounderSectionId>('01_command');

  // Sync activeSection with URL search parameter hydration-safely
  useEffect(() => {
    const urlSec = searchParams?.get('section') as FounderSectionId | null;
    if (urlSec && FOUNDER_SECTIONS.some((s) => s.id === urlSec)) {
      setActiveSection(urlSec);
    } else {
      try {
        const saved = sessionStorage.getItem('zenvitra_vault_section') as FounderSectionId;
        if (saved && FOUNDER_SECTIONS.some((s) => s.id === saved)) {
          setActiveSection(saved);
        }
      } catch (_) {}
    }
  }, [searchParams]);

  const selectSection = (secId: FounderSectionId) => {
    setActiveSection(secId);
    try {
      sessionStorage.setItem('zenvitra_vault_section', secId);
      if (typeof window !== 'undefined') {
        window.history.replaceState(null, '', `?section=${secId}`);
      }
    } catch (_) {}
  };

  const effectiveUser = (currentUserUsername || user?.email?.split('@')[0] || profile?.username || '').toLowerCase().trim().replace(/^@/, '');
  const [isFounderClearance, setIsFounderClearance] = useState(isFounder(effectiveUser, profile?.role || (profile as any)?.badge));

  /* Passkey Unlock Gate State */
  const [passkeyInput, setPasskeyInput] = useState('');
  const [passkeyError, setPasskeyError] = useState<string | null>(null);

  /* Feedback Toast */
  const [feedback, setFeedback] = useState<string | null>(null);
  const notify = (msg: string) => {
    setFeedback(msg);
    setTimeout(() => setFeedback(null), 3500);
  };

  /* Directive State */
  const [directive, setDirective] = useState<FounderDirective>(getFounderDirective());
  const [directiveTitle, setDirectiveTitle] = useState(directive.title);
  const [directiveBody, setDirectiveBody] = useState(directive.body);
  const [directiveAuthor, setDirectiveAuthor] = useState(directive.author);
  const [directivePriority, setDirectivePriority] = useState<FounderDirective['priority']>(directive.priority);
  const [directiveActive, setDirectiveActive] = useState(directive.isActive);

  /* Protocol State */
  const [protocols, setProtocols] = useState<ProtocolControls>(getProtocolControls());
  const [serverProtocols, setServerProtocols] = useState<{
    maintenanceMode: boolean;
    registrationControl: 'OPEN' | 'PAUSED' | 'CLOSED';
    emergencyLockdown: boolean;
    modules: Record<string, boolean>;
    announcements: GlobalAnnouncement[];
  }>({
    maintenanceMode: false,
    registrationControl: 'OPEN',
    emergencyLockdown: false,
    modules: {
      pulse: true,
      mun: true,
      forms: true,
      press: true,
      passport: true,
      call: true,
      legislate: true,
      docs: true,
      chat: true,
      payments: true,
    },
    announcements: [],
  });

  /* Fetch and Sync Server Protocols */
  const fetchProtocols = useCallback(async () => {
    try {
      const res = await fetch('/api/protocols', { cache: 'no-store' });
      if (res.ok) {
        const data = await res.json();
        setServerProtocols({
          maintenanceMode: !!data.maintenanceMode,
          registrationControl: data.registrationControl || 'OPEN',
          emergencyLockdown: !!data.emergencyLockdown,
          modules: {
            pulse: data.modulePulseEnabled !== false,
            mun: data.moduleMunEnabled !== false,
            forms: data.moduleFormsEnabled !== false,
            press: data.modulePressEnabled !== false,
            passport: data.modulePassportEnabled !== false,
            call: data.moduleCallEnabled !== false,
            legislate: data.moduleLegislateEnabled !== false,
            docs: data.moduleDocsEnabled !== false,
            chat: data.moduleChatEnabled !== false,
            payments: data.modulePaymentsEnabled !== false,
          },
          announcements: data.announcements || [],
        });
      }
    } catch (_) {}
  }, []);

  useEffect(() => {
    fetchProtocols();
  }, [fetchProtocols]);

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

  /* Terminal State */
  const [terminalInput, setTerminalInput] = useState('');
  const [terminalLogs, setTerminalLogs] = useState<Array<{ text: string; type: 'info' | 'success' | 'warn' | 'error' | 'cmd' }>>([
    { text: 'ZENVITRA SOVEREIGN ROOT TERMINAL V4-PROD', type: 'info' },
    { text: 'Level 0 Root Clearance Authenticated for Operator @yuveer', type: 'success' },
    { text: 'Type "help" to list all available master commands.', type: 'info' },
  ]);

  /* 10 Zen Modules State */
  const [zenModules, setZenModules] = useState<ZenModuleControl[]>(DEFAULT_ZEN_MODULES);

  /* Pending Approvals State */
  const [approvalsQueue, setApprovalsQueue] = useState<FounderApprovalItem[]>(() => {
    if (typeof window === 'undefined') return [];
    try {
      const stored = localStorage.getItem('zenvitra_founder_approvals');
      return stored ? JSON.parse(stored) : [];
    } catch {
      return [];
    }
  });

  /* Critical Alerts State */
  const [criticalAlerts, setCriticalAlerts] = useState<FounderCriticalAlert[]>([]);

  /* Live Activity Stream */
  const [liveActivities, setLiveActivities] = useState<FounderLiveActivity[]>([]);

  /* Global Announcement Form State */
  const [announcementTitle, setAnnouncementTitle] = useState('');
  const [announcementBody, setAnnouncementBody] = useState('');
  const [announcementPriority, setAnnouncementPriority] = useState<'NORMAL' | 'URGENT' | 'CRITICAL'>('NORMAL');
  const [announcementAudience, setAnnouncementAudience] = useState<'ALL' | 'STUDENTS' | 'ORGANIZERS' | 'DELEGATES'>('ALL');

  /* Personal Founder Key State */
  const [copiedKey, setCopiedKey] = useState<string | null>(null);
  const [customKeyInput, setCustomKeyInput] = useState('');

  const getBaseOrigin = () => {
    if (typeof window !== 'undefined') return window.location.origin;
    return 'https://zenvitra.xyz';
  };

  const handleCopyKey = (keyText: string) => {
    if (typeof navigator !== 'undefined') {
      navigator.clipboard.writeText(keyText);
      setCopiedKey(keyText);
      notify(`Copied Key: ${keyText}`);
      setTimeout(() => setCopiedKey(null), 2500);
    }
  };

  // Hydrate client-only data once mounted
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
  }, []);

  // Update clearance when user or role changes
  useEffect(() => {
    const roleOrBadge = profile?.role || (profile as any)?.badge;
    setIsFounderClearance((prev) => {
      const next = isFounder(effectiveUser, roleOrBadge);
      return prev !== next ? next : prev;
    });
  }, [effectiveUser, profile?.role, (profile as any)?.badge]);

  /* Mutation: Update Global Protocols */
  const updateProtocolsServer = async (partial: Record<string, any>) => {
    try {
      const res = await fetch('/api/protocols', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(partial),
      });
      if (res.ok) {
        fetchProtocols();
        return true;
      }
    } catch (_) {}
    return false;
  };

  /* Toggle Module */
  const handleToggleModule = async (modKey: string) => {
    const current = serverProtocols.modules[modKey] !== false;
    const nextVal = !current;
    
    // Map to protocol field
    const fieldMap: Record<string, string> = {
      pulse: 'modulePulseEnabled',
      mun: 'moduleMunEnabled',
      forms: 'moduleFormsEnabled',
      press: 'modulePressEnabled',
      passport: 'modulePassportEnabled',
      call: 'moduleCallEnabled',
      legislate: 'moduleLegislateEnabled',
      docs: 'moduleDocsEnabled',
      chat: 'moduleChatEnabled',
      payments: 'modulePaymentsEnabled',
    };
    
    const field = fieldMap[modKey];
    if (field) {
      await updateProtocolsServer({ [field]: nextVal });
      setZenModules((prev) =>
        prev.map((m) => (m.key === modKey ? { ...m, enabled: nextVal } : m))
      );
      notify(`ZEN.${modKey.toUpperCase()} is now ${nextVal ? 'ENABLED' : 'DISABLED'}`);
      addAuditLog(`Founder toggled ZEN.${modKey.toUpperCase()} to ${nextVal ? 'ONLINE' : 'OFFLINE'}`, 'PROTOCOL');
    }
  };

  /* Toggle Maintenance Mode */
  const handleToggleMaintenance = async () => {
    const nextVal = !serverProtocols.maintenanceMode;
    await updateProtocolsServer({ maintenanceMode: nextVal });
    saveProtocolControls({ maintenanceMode: nextVal });
    setProtocols(getProtocolControls());
    notify(nextVal ? '🚨 Global Maintenance Mode ACTIVATED (Public website gated)' : '✅ Maintenance Mode DISENGAGED (Platform live)');
    addAuditLog(`Founder set Maintenance Mode to ${nextVal}`, 'PROTOCOL');
  };

  /* Emergency Lockdown */
  const handleEmergencyLockdown = async () => {
    const nextVal = !serverProtocols.emergencyLockdown;
    await updateProtocolsServer({ emergencyLockdown: nextVal, readOnlyMode: nextVal });
    saveProtocolControls({ readOnlyMode: nextVal });
    setProtocols(getProtocolControls());
    notify(nextVal ? '🚨 EMERGENCY LOCKDOWN ENGAGED: All user mutations frozen!' : '✅ Emergency Lockdown DISENGAGED: Normal operations resumed.');
    addAuditLog(`Founder executed Emergency Lockdown: ${nextVal}`, 'PROTOCOL');
  };

  /* Change Registration Gate */
  const handleChangeRegistrationControl = async (gate: 'OPEN' | 'PAUSED' | 'CLOSED') => {
    await updateProtocolsServer({ 
      registrationControl: gate,
      registrationsOpen: gate === 'OPEN'
    });
    saveProtocolControls({ registrationsOpen: gate === 'OPEN' });
    setProtocols(getProtocolControls());
    notify(`Registration Gate set to: ${gate}`);
    addAuditLog(`Founder set Registration Gate to ${gate}`, 'PROTOCOL');
  };

  /* Publish Announcement Broadcast */
  const handleBroadcastAnnouncement = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!announcementTitle.trim() || !announcementBody.trim()) return;

    const newAnnouncement: GlobalAnnouncement = {
      id: `ann-${Date.now().toString(36)}`,
      title: announcementTitle.trim(),
      body: announcementBody.trim(),
      priority: announcementPriority,
      active: true,
      timestamp: new Date().toISOString(),
      targetAudience: announcementAudience,
    };

    const updated = [newAnnouncement, ...(serverProtocols.announcements || [])];
    await updateProtocolsServer({ announcements: updated });
    setAnnouncementTitle('');
    setAnnouncementBody('');
    notify(`📢 Global Announcement broadcasted to ${announcementAudience}!`);
    addAuditLog(`Founder broadcasted Announcement: "${newAnnouncement.title}"`, 'DIRECTIVE');
  };

  /* Approvals Actions */
  const handleResolveApproval = (id: string, status: 'APPROVED' | 'REJECTED') => {
    setApprovalsQueue((prev) =>
      prev.map((item) => (item.id === id ? { ...item, status } : item))
    );
    notify(`Approval item ${id} ${status.toLowerCase()}!`);
    addAuditLog(`Founder ${status} item ${id}`, 'DIRECTIVE');
  };

  /* Directive Save */
  const handleSaveDirective = (e: React.FormEvent) => {
    e.preventDefault();
    const updated = saveFounderDirective({
      title: directiveTitle,
      body: directiveBody,
      author: directiveAuthor,
      priority: directivePriority,
      isActive: directiveActive,
    });
    setDirective(updated);
    notify('🏛️ Founder\'s Sovereign Directive broadcast saved!');
    addAuditLog(`Updated Founder Directive: "${directiveTitle}"`, 'DIRECTIVE');
  };

  /* Site Overrides Save */
  const handleSaveSiteOverrides = (e: React.FormEvent) => {
    e.preventDefault();
    const updated = saveSiteOverrides({
      tickerText,
      tickerActive,
      bannerNotice,
      bannerActive,
      escrowPercentage: Number(escrowPercentage) || 10,
      targetLaunchDate,
    });
    setSiteOverrides(updated);
    notify('🌐 Global site parameters, ticker, and escrow saved!');
    addAuditLog('Updated Global Site Parameters & Ticker', 'PROTOCOL');
  };

  /* Terminal Execution */
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
        { text: 'ZEN.FOUNDER ROOT COMMANDS:', type: 'info' },
        { text: '  status                        - Display live core network status', type: 'info' },
        { text: '  faucet <user> <amount>        - Mint and inject Civic Points', type: 'info' },
        { text: '  promote <user> <role>         - Elevate role (FOUNDER, ADMIN, MODERATOR, DELEGATE)', type: 'info' },
        { text: '  lockdown                      - Engage emergency platform mutation freeze', type: 'info' },
        { text: '  resume                        - Resume full normal platform operations', type: 'info' },
        { text: '  clear                         - Clear terminal buffer', type: 'info' },
      ]);
    } else if (root === 'clear') {
      setTerminalLogs([{ text: 'Terminal output buffer cleared.', type: 'info' }]);
    } else if (root === 'status') {
      setTerminalLogs((prev) => [
        ...prev,
        { text: `[CORE] Platform Status: ${serverProtocols.maintenanceMode ? 'MAINTENANCE' : 'OPERATIONAL'}`, type: 'success' },
        { text: `[FOUNDER] Operator: @yuveer // LEVEL 0 CLEARANCE`, type: 'success' },
        { text: `[DATABASE] Total Registered Nodes: ${totalUsers} | Accounts: ${totalAccounts}`, type: 'info' },
        { text: `[REGISTRATION] Status: ${serverProtocols.registrationControl}`, type: 'info' },
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
    } else if (root === 'lockdown') {
      handleEmergencyLockdown();
      setTerminalLogs((prev) => [
        ...prev,
        { text: `🚨 [EMERGENCY] Platform Mutation Lockdown Executed!`, type: 'warn' },
      ]);
    } else if (root === 'resume') {
      updateProtocolsServer({ emergencyLockdown: false, maintenanceMode: false, readOnlyMode: false });
      setTerminalLogs((prev) => [
        ...prev,
        { text: `✅ [NORMAL] Standard platform operations resumed.`, type: 'success' },
      ]);
    } else {
      setTerminalLogs((prev) => [
        ...prev,
        { text: `Command not recognized: "${cmd}". Type "help" for available commands.`, type: 'error' },
      ]);
    }
  };

  return (
    <div className="space-y-6 w-full max-w-full pb-16 font-sans select-none">
      {/* ── TOP EXECUTIVE BANNER & BREADCRUMB ── */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 p-5 sm:p-6 rounded-3xl bg-[#080a12] border border-amber-500/30 shadow-[0_0_35px_rgba(251,191,36,0.08)]">
        <div className="space-y-1">
          <div className="flex items-center gap-2 text-[10px] font-mono text-amber-400 font-bold uppercase tracking-widest">
            <Crown className="w-3.5 h-3.5 text-amber-400 fill-amber-400/20" />
            <span>ZEN.FOUNDER // THE SUPREME CONTROL CENTRE</span>
            <span className="text-neutral-600">&bull;</span>
            <span className="text-emerald-400 font-black">LEVEL 0 OMNIPOTENCE</span>
          </div>
          <h1 className="text-xl sm:text-2xl font-bold text-white tracking-tight flex items-center gap-2">
            <span>ZENVITRA Master Control</span>
            <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded bg-amber-400/20 text-amber-300 border border-amber-400/30">
              @yuveer
            </span>
          </h1>
          <p className="text-xs text-neutral-400 font-sans font-light">
            One dashboard. Complete visibility. Granular control. Zero unauthorized access.
          </p>
        </div>

        {/* Global Emergency Status Actions */}
        <div className="flex items-center gap-2.5 font-mono text-xs shrink-0 flex-wrap">
          {/* Maintenance Mode Toggle Button */}
          <button
            type="button"
            onClick={handleToggleMaintenance}
            className={`px-3.5 py-2 rounded-xl font-bold transition flex items-center gap-2 cursor-pointer border ${
              serverProtocols.maintenanceMode
                ? 'bg-amber-500 text-black border-amber-300 shadow-[0_0_20px_rgba(251,191,36,0.4)]'
                : 'bg-white/5 text-neutral-300 border-white/10 hover:border-amber-400/40 hover:text-white'
            }`}
          >
            <Power className="w-3.5 h-3.5" />
            <span>Maintenance: {serverProtocols.maintenanceMode ? 'ACTIVE' : 'OFF'}</span>
          </button>

          {/* Emergency Lockdown Button */}
          <button
            type="button"
            onClick={handleEmergencyLockdown}
            className={`px-3.5 py-2 rounded-xl font-bold transition flex items-center gap-2 cursor-pointer border ${
              serverProtocols.emergencyLockdown
                ? 'bg-rose-600 text-white border-rose-400 animate-pulse shadow-[0_0_20px_rgba(239,68,68,0.6)]'
                : 'bg-rose-500/15 text-rose-300 border-rose-500/30 hover:bg-rose-500/25'
            }`}
          >
            <AlertOctagon className="w-3.5 h-3.5" />
            <span>Lockdown: {serverProtocols.emergencyLockdown ? 'ENGAGED' : 'DISARMED'}</span>
          </button>

          {/* Switch to Admin Center */}
          <Link
            href="/core-team-panel"
            className="px-3.5 py-2 rounded-xl bg-cyan-950/60 hover:bg-cyan-900 border border-cyan-500/30 text-cyan-300 font-bold transition flex items-center gap-1.5 cursor-pointer"
          >
            <ShieldCheck className="w-3.5 h-3.5 text-cyan-400" />
            <span>Staff Admin Console</span>
            <ArrowUpRight className="w-3 h-3 text-cyan-400" />
          </Link>
        </div>
      </div>

      {/* ── 12 MASTER SECTIONS SELECTOR RIBBON ── */}
      <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar pb-1 border-b border-white/10 font-mono text-xs w-full max-w-full">
        {FOUNDER_SECTIONS.map((sec) => {
          const isActive = activeSection === sec.id;
          return (
            <button
              key={sec.id}
              onClick={() => selectSection(sec.id)}
              className={`flex items-center gap-2 px-3.5 py-2.5 rounded-2xl transition font-bold whitespace-nowrap cursor-pointer border shrink-0 ${
                isActive
                  ? 'bg-amber-400 text-black border-amber-300 shadow-[0_0_20px_rgba(251,191,36,0.35)]'
                  : 'bg-[#090b14] border-white/10 text-neutral-400 hover:text-white hover:border-white/20'
              }`}
            >
              <span className={`text-[10px] ${isActive ? 'text-black/70' : 'text-neutral-500'}`}>
                {sec.num} &bull;
              </span>
              <span>{sec.title}</span>
              <span className={`text-[9px] px-1.5 py-0.2 rounded-full ${
                isActive ? 'bg-black/20 text-black' : 'bg-white/5 text-neutral-400'
              }`}>
                {sec.controlsCount}
              </span>
            </button>
          );
        })}
      </div>

      {/* ── FEEDBACK NOTIFICATION TOAST ── */}
      {feedback && (
        <div className="p-3.5 rounded-2xl bg-amber-500/15 border border-amber-500/30 text-amber-300 text-xs font-mono flex items-center gap-2.5 shadow-lg animate-in fade-in">
          <CheckCircle2 className="w-4 h-4 text-amber-400 shrink-0" />
          <span>{feedback}</span>
        </div>
      )}

      {/* ========================================================================= */}
      {/* ── SECTION 01: COMMAND (FOUNDER SUPREME DASHBOARD) ─────────────────────── */}
      {/* ========================================================================= */}
      {activeSection === '01_command' && (
        <div className="space-y-6 w-full">
          {/* THE 5 QUESTIONS ANSWERED IMMEDIATELY */}
          <div className="space-y-2">
            <div className="flex items-center justify-between font-mono text-xs text-neutral-400">
              <span className="uppercase tracking-wider font-bold text-white flex items-center gap-2">
                <Radio className="w-3.5 h-3.5 text-amber-400 animate-pulse" />
                <span>Executive Platform Telemetry &bull; 5 Live Core Answers</span>
              </span>
              <span className="text-[10px] text-amber-400">REAL-TIME DB + GATEWAY FEED</span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3.5 w-full">
              {/* Question 1: Total Users */}
              <div className="p-4 rounded-2xl bg-[#090b14] border border-white/10 space-y-1 font-mono">
                <div className="flex items-center justify-between text-neutral-400 text-[10px]">
                  <span>TOTAL USERS</span>
                  <Users className="w-3.5 h-3.5 text-cyan-400" />
                </div>
                <p className="text-2xl font-bold text-white">{totalUsers}</p>
                <p className="text-[10px] text-neutral-400">{totalAccounts} Registered accounts</p>
              </div>

              {/* Question 2: Events */}
              <div className="p-4 rounded-2xl bg-[#090b14] border border-white/10 space-y-1 font-mono">
                <div className="flex items-center justify-between text-neutral-400 text-[10px]">
                  <span>EVENTS & MUNS</span>
                  <Calendar className="w-3.5 h-3.5 text-amber-400" />
                </div>
                <p className="text-2xl font-bold text-amber-300">12</p>
                <p className="text-[10px] text-neutral-400">Upcoming &amp; active assemblies</p>
              </div>

              {/* Question 3: Transactions */}
              <div className="p-4 rounded-2xl bg-[#090b14] border border-white/10 space-y-1 font-mono">
                <div className="flex items-center justify-between text-neutral-400 text-[10px]">
                  <span>TRANSACTIONS</span>
                  <CreditCard className="w-3.5 h-3.5 text-emerald-400" />
                </div>
                <p className="text-2xl font-bold text-emerald-300">₹2,84,500</p>
                <p className="text-[10px] text-neutral-400">Reconciled payment data</p>
              </div>

              {/* Question 4: Open Alerts */}
              <div className="p-4 rounded-2xl bg-[#090b14] border border-white/10 space-y-1 font-mono">
                <div className="flex items-center justify-between text-neutral-400 text-[10px]">
                  <span>OPEN ALERTS</span>
                  <ShieldAlert className="w-3.5 h-3.5 text-rose-400" />
                </div>
                <p className="text-2xl font-bold text-rose-300">{criticalAlerts.length}</p>
                <p className="text-[10px] text-neutral-400">Security &amp; system health</p>
              </div>

              {/* Question 5: Platform Status */}
              <div className="p-4 rounded-2xl bg-[#090b14] border border-amber-500/30 space-y-1 font-mono shadow-[0_0_15px_rgba(251,191,36,0.06)]">
                <div className="flex items-center justify-between text-neutral-400 text-[10px]">
                  <span>PLATFORM STATUS</span>
                  <Sparkles className="w-3.5 h-3.5 text-amber-400" />
                </div>
                <p className="text-lg font-bold text-emerald-400 flex items-center gap-1.5 pt-0.5">
                  <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                  <span>OPERATIONAL</span>
                </p>
                <p className="text-[10px] text-neutral-400">System overview: Optimal</p>
              </div>
            </div>
          </div>

          {/* LOWER PANELS 1 & 2: LIVE ACTIVITY + MODULE HEALTH */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-5 w-full">
            {/* Live Activity Stream */}
            <div className="p-5 rounded-3xl bg-[#080a12] border border-white/10 space-y-3 font-mono text-xs">
              <div className="flex items-center justify-between border-b border-white/10 pb-3">
                <span className="font-bold text-white flex items-center gap-2">
                  <Activity className="w-4 h-4 text-cyan-400" />
                  <span>Live Activity Stream</span>
                </span>
                <span className="text-[10px] text-neutral-500">LIVE WEBSOCKET BUS</span>
              </div>

              <div className="space-y-2 max-h-72 overflow-y-auto pr-1">
                {liveActivities.map((act) => (
                  <div key={act.id} className="p-3 rounded-2xl bg-black/60 border border-white/5 flex items-center justify-between gap-3 text-[11px]">
                    <div className="flex items-center gap-2.5 truncate">
                      <span className={`w-1.5 h-1.5 rounded-full shrink-0 ${
                        act.type === 'PAYMENT' ? 'bg-emerald-400' :
                        act.type === 'SECURITY' ? 'bg-rose-400' :
                        act.type === 'ADMIN' ? 'bg-amber-400' : 'bg-cyan-400'
                      }`} />
                      <div className="truncate">
                        <span className="text-white font-bold">{act.actor}</span>{' '}
                        <span className="text-neutral-400">{act.action}</span>{' '}
                        <span className="text-amber-300 font-medium">{act.target}</span>
                      </div>
                    </div>
                    <span className="text-[10px] text-neutral-500 shrink-0">{act.timestamp}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Module Health Overview */}
            <div className="p-5 rounded-3xl bg-[#080a12] border border-white/10 space-y-3 font-mono text-xs">
              <div className="flex items-center justify-between border-b border-white/10 pb-3">
                <span className="font-bold text-white flex items-center gap-2">
                  <Layers className="w-4 h-4 text-amber-400" />
                  <span>Module Health (All 10 Core Modules)</span>
                </span>
                <button
                  onClick={() => selectSection('03_zen_modules')}
                  className="text-[10px] text-amber-400 hover:text-white underline cursor-pointer"
                >
                  Manage All 10 &rarr;
                </button>
              </div>

              <div className="grid grid-cols-2 gap-2 max-h-72 overflow-y-auto pr-1">
                {zenModules.map((m) => {
                  const isOnline = serverProtocols.modules[m.key] !== false;
                  return (
                    <div key={m.key} className="p-2.5 rounded-2xl bg-black/60 border border-white/5 space-y-1">
                      <div className="flex items-center justify-between">
                        <span className="text-white font-bold text-[11px] truncate">{m.name}</span>
                        <span className={`w-2 h-2 rounded-full ${isOnline ? 'bg-emerald-400' : 'bg-rose-500'}`} />
                      </div>
                      <div className="flex items-center justify-between text-[10px] text-neutral-400">
                        <span>{m.latencyMs}ms</span>
                        <span>{isOnline ? 'ONLINE' : 'MUTED'}</span>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>

          {/* LOWER PANELS 3, 4, 5: PENDING APPROVALS + QUICK ACTIONS + CRITICAL ALERTS */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-5 w-full font-mono text-xs">
            {/* Pending Approvals */}
            <div className="p-5 rounded-3xl bg-[#080a12] border border-white/10 space-y-3">
              <div className="flex items-center justify-between border-b border-white/10 pb-3">
                <span className="font-bold text-white flex items-center gap-2">
                  <Clock className="w-4 h-4 text-amber-400" />
                  <span>Pending Approvals ({approvalsQueue.filter(a => a.status === 'PENDING').length})</span>
                </span>
                <span className="text-[10px] text-neutral-500">LEVEL 0 GATE</span>
              </div>

              <div className="space-y-2 max-h-80 overflow-y-auto pr-1">
                {approvalsQueue.map((item) => (
                  <div key={item.id} className="p-3 rounded-2xl bg-black/60 border border-white/5 space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-[10px] font-bold text-amber-300">{item.type}</span>
                      <span className="text-[10px] text-neutral-500">{item.timestamp}</span>
                    </div>
                    <div className="text-white font-bold text-xs truncate">{item.title}</div>
                    <p className="text-[11px] text-neutral-400 font-sans line-clamp-2">{item.details}</p>
                    {item.amount && (
                      <div className="text-emerald-400 font-bold text-[11px]">Amount: {item.amount}</div>
                    )}

                    {item.status === 'PENDING' ? (
                      <div className="flex items-center gap-2 pt-1">
                        <button
                          type="button"
                          onClick={() => handleResolveApproval(item.id, 'APPROVED')}
                          className="flex-1 py-1.5 rounded-xl bg-emerald-500/20 hover:bg-emerald-500/30 text-emerald-300 font-bold transition text-[10px] cursor-pointer"
                        >
                          Approve
                        </button>
                        <button
                          type="button"
                          onClick={() => handleResolveApproval(item.id, 'REJECTED')}
                          className="flex-1 py-1.5 rounded-xl bg-rose-500/20 hover:bg-rose-500/30 text-rose-300 font-bold transition text-[10px] cursor-pointer"
                        >
                          Reject
                        </button>
                      </div>
                    ) : (
                      <span className={`text-[10px] font-bold ${item.status === 'APPROVED' ? 'text-emerald-400' : 'text-rose-400'}`}>
                        {item.status}
                      </span>
                    )}
                  </div>
                ))}
              </div>
            </div>

            {/* Quick Actions */}
            <div className="p-5 rounded-3xl bg-[#080a12] border border-white/10 space-y-3">
              <div className="border-b border-white/10 pb-3">
                <span className="font-bold text-white flex items-center gap-2">
                  <Zap className="w-4 h-4 text-cyan-400" />
                  <span>Founder Quick Actions</span>
                </span>
              </div>

              <div className="space-y-2.5">
                <button
                  type="button"
                  onClick={() => selectSection('05_events_mun')}
                  className="w-full p-3 rounded-2xl bg-white/5 hover:bg-white/10 border border-white/10 text-white font-bold flex items-center justify-between transition cursor-pointer text-left"
                >
                  <div className="flex items-center gap-2.5">
                    <Calendar className="w-4 h-4 text-amber-400" />
                    <div>
                      <div className="text-xs">Create New MUN / Assembly</div>
                      <div className="text-[10px] text-neutral-400 font-light font-sans">Launch vanity route &amp; committee matrix</div>
                    </div>
                  </div>
                  <ArrowUpRight className="w-3.5 h-3.5 text-neutral-400" />
                </button>

                <button
                  type="button"
                  onClick={() => selectSection('02_platform_control')}
                  className="w-full p-3 rounded-2xl bg-white/5 hover:bg-white/10 border border-white/10 text-white font-bold flex items-center justify-between transition cursor-pointer text-left"
                >
                  <div className="flex items-center gap-2.5">
                    <Send className="w-4 h-4 text-cyan-400" />
                    <div>
                      <div className="text-xs">Broadcast Global Announcement</div>
                      <div className="text-[10px] text-neutral-400 font-light font-sans">Display high-priority alert across site</div>
                    </div>
                  </div>
                  <ArrowUpRight className="w-3.5 h-3.5 text-neutral-400" />
                </button>

                <button
                  type="button"
                  onClick={handleToggleMaintenance}
                  className="w-full p-3 rounded-2xl bg-white/5 hover:bg-white/10 border border-white/10 text-white font-bold flex items-center justify-between transition cursor-pointer text-left"
                >
                  <div className="flex items-center gap-2.5">
                    <Power className="w-4 h-4 text-rose-400" />
                    <div>
                      <div className="text-xs">Toggle Maintenance Curtain</div>
                      <div className="text-[10px] text-neutral-400 font-light font-sans">Gate public site while preserving admin</div>
                    </div>
                  </div>
                  <span className={`text-[10px] font-mono px-2 py-0.5 rounded ${serverProtocols.maintenanceMode ? 'bg-rose-500/30 text-rose-300' : 'bg-emerald-500/20 text-emerald-300'}`}>
                    {serverProtocols.maintenanceMode ? 'ACTIVE' : 'OFF'}
                  </span>
                </button>

                <button
                  type="button"
                  onClick={() => selectSection('04_people_access')}
                  className="w-full p-3 rounded-2xl bg-white/5 hover:bg-white/10 border border-white/10 text-white font-bold flex items-center justify-between transition cursor-pointer text-left"
                >
                  <div className="flex items-center gap-2.5">
                    <Link2 className="w-4 h-4 text-emerald-400" />
                    <div>
                      <div className="text-xs">Issue Enclave Access Passkey</div>
                      <div className="text-[10px] text-neutral-400 font-light font-sans">Hardware-locked bypass links for staff</div>
                    </div>
                  </div>
                  <ArrowUpRight className="w-3.5 h-3.5 text-neutral-400" />
                </button>
              </div>
            </div>

            {/* Critical Alerts */}
            <div className="p-5 rounded-3xl bg-[#080a12] border border-white/10 space-y-3">
              <div className="flex items-center justify-between border-b border-white/10 pb-3">
                <span className="font-bold text-white flex items-center gap-2">
                  <ShieldAlert className="w-4 h-4 text-rose-400" />
                  <span>Critical Alerts Radar</span>
                </span>
                <span className="text-[10px] text-emerald-400 font-bold">ALL SHIELDS UP</span>
              </div>

              <div className="space-y-2.5">
                {criticalAlerts.map((alt) => (
                  <div key={alt.id} className="p-3.5 rounded-2xl bg-black/60 border border-white/10 space-y-1.5">
                    <div className="flex items-center justify-between">
                      <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-rose-500/20 text-rose-300">
                        {alt.severity}
                      </span>
                      <span className="text-[10px] text-neutral-500">{alt.source}</span>
                    </div>
                    <div className="text-white font-bold text-xs">{alt.title}</div>
                    <p className="text-[11px] text-neutral-400 font-sans leading-relaxed">{alt.description}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* ── SECTION 02: PLATFORM CONTROL (GLOBAL CONTROLS CONFIGURATION LAYER) ── */}
      {/* ========================================================================= */}
      {activeSection === '02_platform_control' && (
        <div className="space-y-6 w-full font-mono text-xs">
          <div className="p-6 rounded-3xl bg-[#080a12] border border-amber-500/30 space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-amber-400 font-bold uppercase tracking-wider flex items-center gap-2">
                <Sliders className="w-4 h-4 text-amber-400" />
                <span>Single Configuration Layer &bull; Master Protocol Controls</span>
              </span>
              <span className="text-[10px] text-neutral-400">ZERO RE-DEPLOY CONFIGURATION</span>
            </div>
            <p className="text-neutral-300 font-sans text-xs">
              Govern platform availability, registration curtains, feature toggles, and emergency overrides instantly.
            </p>
          </div>

          {/* Control Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {/* Control 1: Global Maintenance */}
            <div className="p-5 rounded-3xl bg-black/60 border border-white/10 space-y-3 flex flex-col justify-between">
              <div className="space-y-1.5">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-white">01 &bull; Global Maintenance</span>
                  <span className={`text-[10px] px-2 py-0.5 rounded font-bold ${serverProtocols.maintenanceMode ? 'bg-rose-500/30 text-rose-300' : 'bg-emerald-500/20 text-emerald-300'}`}>
                    {serverProtocols.maintenanceMode ? 'ENGAGED' : 'OFF'}
                  </span>
                </div>
                <p className="text-neutral-400 font-sans text-xs">
                  Puts public website into maintenance mode while preserving authorized Founder and Admin access.
                </p>
              </div>
              <button
                type="button"
                onClick={handleToggleMaintenance}
                className="w-full py-2.5 rounded-xl bg-white/10 hover:bg-white/20 text-white font-bold transition cursor-pointer"
              >
                {serverProtocols.maintenanceMode ? 'Disengage Maintenance' : 'Activate Maintenance Mode'}
              </button>
            </div>

            {/* Control 2: Emergency Lockdown */}
            <div className="p-5 rounded-3xl bg-black/60 border border-rose-500/30 space-y-3 flex flex-col justify-between">
              <div className="space-y-1.5">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-rose-300">02 &bull; Emergency Lockdown</span>
                  <span className={`text-[10px] px-2 py-0.5 rounded font-bold ${serverProtocols.emergencyLockdown ? 'bg-rose-500 text-white animate-pulse' : 'bg-white/5 text-neutral-400'}`}>
                    {serverProtocols.emergencyLockdown ? 'LOCKED' : 'READY'}
                  </span>
                </div>
                <p className="text-neutral-400 font-sans text-xs">
                  Freeze all user database mutations and form submissions instantly in an urgent security crisis.
                </p>
              </div>
              <button
                type="button"
                onClick={handleEmergencyLockdown}
                className="w-full py-2.5 rounded-xl bg-rose-600 hover:bg-rose-500 text-white font-bold transition cursor-pointer uppercase shadow-[0_0_15px_rgba(244,63,94,0.3)]"
              >
                {serverProtocols.emergencyLockdown ? 'Lift Lockdown' : 'Execute Emergency Lockdown'}
              </button>
            </div>

            {/* Control 3: Registration Gate */}
            <div className="p-5 rounded-3xl bg-black/60 border border-white/10 space-y-3 flex flex-col justify-between">
              <div className="space-y-1.5">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-white">03 &bull; Registration Control</span>
                  <span className="text-[10px] px-2 py-0.5 rounded font-bold bg-cyan-500/20 text-cyan-300">
                    {serverProtocols.registrationControl}
                  </span>
                </div>
                <p className="text-neutral-400 font-sans text-xs">
                  Control new identity onboarding across ZENVITRA: Open to all, Invite-only passkeys, or completely Paused.
                </p>
              </div>
              <div className="grid grid-cols-3 gap-1.5 pt-1">
                {(['OPEN', 'PAUSED', 'CLOSED'] as const).map((gate) => (
                  <button
                    key={gate}
                    type="button"
                    onClick={() => handleChangeRegistrationControl(gate)}
                    className={`py-1.5 rounded-xl text-[10px] font-bold transition cursor-pointer ${
                      serverProtocols.registrationControl === gate
                        ? 'bg-amber-400 text-black shadow'
                        : 'bg-white/5 text-neutral-400 hover:text-white'
                    }`}
                  >
                    {gate}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Global Announcement Broadcaster Form */}
          <form onSubmit={handleBroadcastAnnouncement} className="p-6 sm:p-8 rounded-3xl bg-[#080a12] border border-cyan-500/30 space-y-4">
            <div className="flex items-center justify-between border-b border-white/10 pb-4">
              <div className="flex items-center gap-2 text-cyan-300 font-bold uppercase tracking-wider">
                <Send className="w-4 h-4 text-cyan-400" />
                <span>Global Emergency Announcement Broadcaster</span>
              </div>
              <span className="text-[10px] text-neutral-400">INSTANT SITE-WIDE BANNER</span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div className="sm:col-span-2 space-y-1.5">
                <label className="text-[10px] text-neutral-400 uppercase font-bold">Broadcast Headline</label>
                <input
                  type="text"
                  required
                  value={announcementTitle}
                  onChange={(e) => setAnnouncementTitle(e.target.value)}
                  placeholder="e.g. SCHEDULE UPDATE: Committee Room 4 moved to Main Auditorium"
                  className="w-full px-4 py-3 rounded-xl bg-black border border-white/20 text-white text-xs focus:outline-none focus:border-cyan-400"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-[10px] text-neutral-400 uppercase font-bold">Urgency Priority</label>
                <select
                  value={announcementPriority}
                  onChange={(e) => setAnnouncementPriority(e.target.value as any)}
                  className="w-full px-4 py-3 rounded-xl bg-black border border-white/20 text-white text-xs focus:outline-none focus:border-cyan-400 cursor-pointer"
                >
                  <option value="NORMAL">Normal Notice</option>
                  <option value="URGENT">Urgent Advisory</option>
                  <option value="CRITICAL">Critical Emergency</option>
                </select>
              </div>
            </div>

            <div className="space-y-1.5">
              <label className="text-[10px] text-neutral-400 uppercase font-bold">Announcement Body Details</label>
              <textarea
                required
                rows={3}
                value={announcementBody}
                onChange={(e) => setAnnouncementBody(e.target.value)}
                placeholder="Detailed communiqué broadcasted to all active participants..."
                className="w-full px-4 py-3 rounded-xl bg-black border border-white/20 text-white text-xs focus:outline-none focus:border-cyan-400"
              />
            </div>

            <div className="flex items-center justify-between pt-2">
              <div className="flex items-center gap-2">
                <span className="text-[10px] text-neutral-400 uppercase font-bold">Target Audience:</span>
                <select
                  value={announcementAudience}
                  onChange={(e) => setAnnouncementAudience(e.target.value as any)}
                  className="px-3 py-1.5 rounded-xl bg-black border border-white/20 text-cyan-300 text-xs focus:outline-none cursor-pointer"
                >
                  <option value="ALL">All Platform Visitors</option>
                  <option value="STUDENTS">Verified Students Only</option>
                  <option value="ORGANIZERS">Assembly Organizers</option>
                  <option value="DELEGATES">Allocated Delegates</option>
                </select>
              </div>

              <button
                type="submit"
                className="px-6 py-3 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-black font-bold text-xs transition cursor-pointer flex items-center gap-2 uppercase shadow-[0_0_20px_rgba(6,182,212,0.3)]"
              >
                <Send className="w-3.5 h-3.5" />
                <span>Broadcast Announcement Now</span>
              </button>
            </div>
          </form>
        </div>
      )}

      {/* ========================================================================= */}
      {/* ── SECTION 03: ZEN MODULES (10 CORE ECOSYSTEM APPS) ───────────────────── */}
      {/* ========================================================================= */}
      {activeSection === '03_zen_modules' && (
        <div className="space-y-6 w-full font-mono text-xs">
          <div className="p-6 rounded-3xl bg-[#080a12] border border-amber-500/30 space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-amber-400 font-bold uppercase tracking-wider flex items-center gap-2">
                <Layers className="w-4 h-4 text-amber-400" />
                <span>ZEN MODULES &bull; Full Lifecycle Management (10 Modules)</span>
              </span>
              <span className="text-[10px] text-neutral-400">REAL-TIME DAU + LATENCY TELEMETRY</span>
            </div>
            <p className="text-neutral-300 font-sans text-xs">
              Toggle any module on/off in real-time, configure Coming Soon curtains, and monitor edge latency.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {zenModules.map((m) => {
              const isEnabled = serverProtocols.modules[m.key] !== false;
              return (
                <div
                  key={m.key}
                  className={`p-5 rounded-3xl border transition space-y-4 flex flex-col justify-between ${
                    isEnabled
                      ? 'bg-[#080a12] border-white/10 shadow-lg'
                      : 'bg-black/40 border-rose-500/20 opacity-60'
                  }`}
                >
                  <div className="space-y-2.5">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2.5">
                        <span className="text-white font-bold text-sm tracking-wide">{m.name}</span>
                        <span className="text-[9px] px-2 py-0.5 rounded bg-white/5 text-neutral-400">
                          {m.code}
                        </span>
                        {m.beta && (
                          <span className="text-[9px] px-1.5 py-0.2 rounded bg-amber-400/20 text-amber-300 font-bold">
                            BETA
                          </span>
                        )}
                      </div>

                      <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                        isEnabled
                          ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'
                          : 'bg-rose-500/20 text-rose-300 border border-rose-500/30'
                      }`}>
                        {isEnabled ? 'OPERATIONAL' : 'MUTED / DISABLED'}
                      </span>
                    </div>

                    <p className="text-neutral-400 font-sans text-xs leading-relaxed">{m.tagline}</p>

                    <div className="p-3 rounded-2xl bg-black/60 border border-white/5 grid grid-cols-3 gap-2 text-[11px]">
                      <div>
                        <span className="text-[10px] text-neutral-500 block">Version:</span>
                        <span className="text-white font-bold">{m.version}</span>
                      </div>
                      <div>
                        <span className="text-[10px] text-neutral-500 block">Edge Latency:</span>
                        <span className="text-cyan-300 font-bold">{m.latencyMs}ms</span>
                      </div>
                      <div>
                        <span className="text-[10px] text-neutral-500 block">24h Active:</span>
                        <span className="text-amber-300 font-bold">{m.activeUsers24h}</span>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 pt-2 border-t border-white/5">
                    <button
                      type="button"
                      onClick={() => handleToggleModule(m.key)}
                      className={`flex-1 py-2 rounded-xl font-bold transition text-xs cursor-pointer ${
                        isEnabled
                          ? 'bg-rose-500/20 hover:bg-rose-500/30 text-rose-300 border border-rose-500/30'
                          : 'bg-emerald-500/20 hover:bg-emerald-500/30 text-emerald-300 border border-emerald-500/30'
                      }`}
                    >
                      {isEnabled ? 'Disable Module' : 'Enable Module'}
                    </button>

                    <Link
                      href={`/${m.key}`}
                      className="px-4 py-2 rounded-xl bg-white/5 hover:bg-white/10 text-white font-bold transition text-xs flex items-center gap-1.5 cursor-pointer"
                    >
                      <span>Open</span>
                      <ArrowUpRight className="w-3.5 h-3.5 text-neutral-400" />
                    </Link>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* ── SECTION 04: PEOPLE & ACCESS ────────────────────────────────────────── */}
      {/* ========================================================================= */}
      {activeSection === '04_people_access' && (
        <div className="space-y-6 w-full font-mono text-xs">
          <div className="p-6 rounded-3xl bg-[#080a12] border border-amber-500/30 space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-amber-400 font-bold uppercase tracking-wider flex items-center gap-2">
                <Users className="w-4 h-4 text-amber-400" />
                <span>PEOPLE &amp; ACCESS &bull; Universal Identities &amp; Enclave Gate</span>
              </span>
              <span className="text-[10px] text-cyan-400">{totalUsers} REGISTERED IDENTITIES</span>
            </div>
            <p className="text-neutral-300 font-sans text-xs">
              Manage platform members, grant Enclave hardware passkeys, configure roles, and dispense civic points.
            </p>
          </div>

          {/* Enclave Access Link Generator */}
          <AdminEnclaveManager notify={notify} getBaseOrigin={getBaseOrigin} />

          {/* Node Clearance & Civic Points Faucet */}
          <div className="p-6 sm:p-8 rounded-3xl bg-[#080a12] border border-white/10 space-y-4">
            <div className="flex items-center justify-between border-b border-white/10 pb-4">
              <span className="text-white font-bold uppercase tracking-wider flex items-center gap-2">
                <Coins className="w-4 h-4 text-amber-400" />
                <span>Member Privilege Override &amp; Points Faucet</span>
              </span>
              <span className="text-[10px] text-neutral-400">INSTANT LEVEL 0 MUTATION</span>
            </div>

            <form
              onSubmit={(e) => {
                e.preventDefault();
                if (!userTargetHandle.trim()) return;
                const clean = userTargetHandle.trim().replace(/^@/, '');
                saveUserOverride(clean, {
                  role: userTargetRole,
                  verifiedBadge: userTargetBadge,
                  extraCivicPoints: Number(userPointsAmount) || 0,
                  customTitle: userCustomTitle.trim() || undefined,
                });
                setUserOverridesList(getAllUserOverrides());
                notify(`Updated clearance parameters for @${clean}!`);
              }}
              className="grid grid-cols-1 sm:grid-cols-4 gap-4"
            >
              <div className="space-y-1.5">
                <label className="text-[10px] text-neutral-400 uppercase font-bold">Target Username / Handle</label>
                <input
                  type="text"
                  required
                  value={userTargetHandle}
                  onChange={(e) => setUserTargetHandle(e.target.value)}
                  placeholder="e.g. aanya_delegate"
                  className="w-full px-4 py-3 rounded-xl bg-black border border-white/20 text-white text-xs focus:outline-none focus:border-amber-400"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-[10px] text-neutral-400 uppercase font-bold">Assigned Role</label>
                <select
                  value={userTargetRole}
                  onChange={(e) => setUserTargetRole(e.target.value as any)}
                  className="w-full px-4 py-3 rounded-xl bg-black border border-white/20 text-white text-xs focus:outline-none focus:border-amber-400 cursor-pointer"
                >
                  <option value="DELEGATE">Delegate / Student</option>
                  <option value="ORGANIZER">Assembly Organizer</option>
                  <option value="MODERATOR">Platform Moderator</option>
                  <option value="ADMIN">Staff Administrator</option>
                  <option value="FOUNDER">Founder Clearance</option>
                  <option value="SUSPENDED">Suspended / Restrict</option>
                </select>
              </div>

              <div className="space-y-1.5">
                <label className="text-[10px] text-neutral-400 uppercase font-bold">Civic Points Injection</label>
                <input
                  type="number"
                  value={userPointsAmount}
                  onChange={(e) => setUserPointsAmount(e.target.value)}
                  placeholder="5000"
                  className="w-full px-4 py-3 rounded-xl bg-black border border-white/20 text-amber-300 text-xs focus:outline-none focus:border-amber-400"
                />
              </div>

              <div className="flex items-end">
                <button
                  type="submit"
                  className="w-full py-3 rounded-xl bg-amber-400 hover:bg-amber-300 text-black font-bold text-xs transition cursor-pointer flex items-center justify-center gap-2 uppercase shadow-[0_0_20px_rgba(251,191,36,0.3)]"
                >
                  <Save className="w-4 h-4" />
                  <span>Execute Override</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* ── SECTION 05: EVENTS & MUN ───────────────────────────────────────────── */}
      {/* ========================================================================= */}
      {activeSection === '05_events_mun' && (
        <div className="space-y-6 w-full font-mono text-xs">
          <div className="p-6 rounded-3xl bg-[#080a12] border border-amber-500/30 space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-amber-400 font-bold uppercase tracking-wider flex items-center gap-2">
                <Calendar className="w-4 h-4 text-amber-400" />
                <span>EVENTS &amp; MUN &bull; Assembly OS &amp; Direct Vanity Routing</span>
              </span>
              <span className="text-[10px] text-neutral-400">{conferences.length} ACTIVE CONFERENCES</span>
            </div>
            <p className="text-neutral-300 font-sans text-xs">
              Direct showcase vanity URLs (/[event-name]), committee matrix engine (/[event]/[committee]/matrix), and live dais operations.
            </p>
          </div>

          {/* Conference Verification Queue Link Banner */}
          <div className="p-5 rounded-3xl bg-[#080a12] border border-amber-500/30 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div>
              <span className="text-white font-bold text-xs uppercase flex items-center gap-2">
                <ShieldCheck className="w-4 h-4 text-amber-400" />
                <span>Conference &amp; Event Verification Desk</span>
              </span>
              <p className="text-[11px] text-neutral-400 font-sans pt-1">
                Audit inbound public conference submissions, verify organizer credentials, and authorize them for global publication.
              </p>
            </div>
            <Link
              href="/core-team-panel?section=03_event_operations"
              className="px-4 py-2.5 rounded-xl bg-amber-400 hover:bg-amber-300 text-black font-bold text-xs transition cursor-pointer flex items-center justify-center gap-1.5 shrink-0 shadow-[0_0_15px_rgba(251,191,36,0.2)]"
            >
              <span>Open Verification Queue</span>
              <ArrowUpRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {conferences.map((conf) => {
              const comm = conf.committees?.[0];
              const commCode = typeof comm === 'string' ? comm.toLowerCase() : (comm?.shortName || 'unga').toLowerCase();
              return (
              <div key={conf.id} className="p-6 rounded-3xl bg-black/60 border border-white/10 space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <span className="text-white font-bold text-sm">{conf.name}</span>
                    <span className="text-[10px] text-neutral-400 block pt-0.5">
                      {conf.tagline || 'Sovereign Assembly Plenary'} &bull; {conf.location || 'Live Matrix'}
                    </span>
                  </div>
                  <span className="text-[10px] px-2 py-0.5 rounded font-bold bg-emerald-500/20 text-emerald-300">
                    {conf.status?.toUpperCase() || 'ACTIVE'}
                  </span>
                </div>

                <div className="p-3.5 rounded-2xl bg-[#080a12] border border-white/5 space-y-2 text-[11px]">
                  <div className="flex items-center justify-between text-neutral-400">
                    <span>Direct Showcase Route:</span>
                    <Link href={`/${conf.slug || conf.id}`} className="text-cyan-300 font-bold hover:underline flex items-center gap-1">
                      <span>/{conf.slug || conf.id}</span>
                      <ExternalLink className="w-3 h-3" />
                    </Link>
                  </div>
                  <div className="flex items-center justify-between text-neutral-400">
                    <span>Committee Matrix URL:</span>
                    <Link href={`/${conf.slug || conf.id}/${commCode}/matrix`} className="text-amber-300 font-bold hover:underline flex items-center gap-1">
                      <span>/{conf.slug || conf.id}/${commCode}/matrix</span>
                      <ExternalLink className="w-3 h-3" />
                    </Link>
                  </div>
                  <div className="flex items-center justify-between text-neutral-400">
                    <span>Student GST Policy:</span>
                    <span className="text-emerald-400 font-bold">&le;18: 0% GST | &gt;18: 6% GST</span>
                  </div>
                </div>

                <div className="flex items-center gap-2 pt-1">
                  <Link
                    href={`/${conf.slug || conf.id}`}
                    className="flex-1 py-2.5 rounded-xl bg-white/10 hover:bg-white/20 text-white font-bold text-center transition cursor-pointer"
                  >
                    View Showcase Page
                  </Link>
                  <Link
                    href="/mun"
                    className="flex-1 py-2.5 rounded-xl bg-amber-400 hover:bg-amber-300 text-black font-bold text-center transition cursor-pointer"
                  >
                    Dais Console
                  </Link>
                </div>
              </div>
            );
          })}

            {conferences.length === 0 && (
              <div className="p-6 rounded-3xl bg-black/40 border border-white/5 space-y-3 flex flex-col justify-center text-center">
                <p className="text-xs text-neutral-300 font-bold">No Active MUN Conferences</p>
                <p className="text-[11px] text-neutral-500 font-sans">
                  Deploy a new conference assembly to generate direct vanity showcase URLs and live dais matrices.
                </p>
                <div className="pt-1">
                  <Link
                    href="/mun"
                    className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-cyan-300 font-bold text-[11px] transition"
                  >
                    <span>Launch MUN Conference</span>
                    <ArrowUpRight className="w-3.5 h-3.5" />
                  </Link>
                </div>
              </div>
            )}

            {/* Launch Instant Event Card */}
            <div className="p-6 rounded-3xl bg-[#080a12] border border-cyan-500/30 space-y-4 flex flex-col justify-between">
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-cyan-300 font-bold text-sm">Launch New Assembly / MUN Space</span>
                  <span className="text-[10px] text-cyan-400 font-bold">SOVEREIGN PROVISION</span>
                </div>
                <p className="text-neutral-400 font-sans text-xs leading-relaxed">
                  Automatically spins up a vanity showcase route (/[event-name]), live country matrix, Cashfree PG ticketing, and digital student pass issuing.
                </p>
              </div>

              <Link
                href="/mun"
                className="w-full py-3 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-black font-bold text-xs transition flex items-center justify-center gap-2 uppercase shadow-[0_0_20px_rgba(6,182,212,0.3)] cursor-pointer"
              >
                <Plus className="w-4 h-4" />
                <span>Launch New MUN Space</span>
              </Link>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* ── SECTION 06: FINANCE ────────────────────────────────────────────────── */}
      {/* ========================================================================= */}
      {activeSection === '06_finance' && (
        <div className="space-y-6 w-full font-mono text-xs">
          <div className="p-6 rounded-3xl bg-[#080a12] border border-amber-500/30 space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-amber-400 font-bold uppercase tracking-wider flex items-center gap-2">
                <CreditCard className="w-4 h-4 text-amber-400" />
                <span>FINANCE &bull; Cashfree PG, Dynamic Student GST &amp; Escrow</span>
              </span>
              <span className="text-[10px] text-emerald-400">SETTLEMENTS RECONCILED</span>
            </div>
            <p className="text-neutral-300 font-sans text-xs">
              Real-time payment gateway feeds, student GST exemption verification, and founder refund approvals.
            </p>
          </div>

          {/* GST Exemption Protocol Highlight */}
          <div className="p-6 rounded-3xl bg-black/60 border border-emerald-500/30 grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-1">
              <span className="text-[10px] text-emerald-400 font-bold uppercase">STUDENT UNDER OR EQUAL TO AGE 18</span>
              <div className="text-2xl font-bold text-white">0% GST Mandate</div>
              <p className="text-neutral-400 font-sans text-xs">
                Zero tax applied for student empowerment. Verified via Student ID or Passport card.
              </p>
            </div>

            <div className="space-y-1">
              <span className="text-[10px] text-amber-400 font-bold uppercase">ATTENDEE OVER AGE 18</span>
              <div className="text-2xl font-bold text-white">6% GST Standard</div>
              <p className="text-neutral-400 font-sans text-xs">
                Standard concessional educational tax rate applied on attendee passes.
              </p>
            </div>
          </div>

          {/* Pending Refund Approvals */}
          <div className="p-6 rounded-3xl bg-[#080a12] border border-white/10 space-y-4">
            <div className="flex items-center justify-between border-b border-white/10 pb-3">
              <span className="text-white font-bold uppercase tracking-wider">
                Founder Refund Approvals &bull; Cashfree Reversals
              </span>
              <span className="text-[10px] text-neutral-400">LEVEL 0 SIGNATURE REQUIRED</span>
            </div>

            {approvalsQueue.filter(a => a.type === 'REFUND').map((item) => (
              <div key={item.id} className="p-4 rounded-2xl bg-black/60 border border-white/5 flex items-center justify-between gap-4">
                <div className="space-y-1">
                  <div className="text-white font-bold text-xs">{item.title}</div>
                  <div className="text-[11px] text-neutral-400 font-sans">{item.details}</div>
                  <div className="text-emerald-400 font-bold text-xs">Amount: {item.amount} &bull; Requested by {item.requester}</div>
                </div>

                <div className="flex items-center gap-2 shrink-0">
                  <button
                    type="button"
                    onClick={() => handleResolveApproval(item.id, 'APPROVED')}
                    className="px-4 py-2 rounded-xl bg-emerald-500/20 hover:bg-emerald-500/30 text-emerald-300 font-bold transition text-xs cursor-pointer"
                  >
                    Approve Refund
                  </button>
                  <button
                    type="button"
                    onClick={() => handleResolveApproval(item.id, 'REJECTED')}
                    className="px-4 py-2 rounded-xl bg-rose-500/20 hover:bg-rose-500/30 text-rose-300 font-bold transition text-xs cursor-pointer"
                  >
                    Reject
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* ── SECTION 07: CONTENT & COMMUNITY ────────────────────────────────────── */}
      {/* ========================================================================= */}
      {activeSection === '07_content_community' && (
        <div className="space-y-6 w-full font-mono text-xs">
          <div className="p-6 rounded-3xl bg-[#080a12] border border-amber-500/30 space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-amber-400 font-bold uppercase tracking-wider flex items-center gap-2">
                <Newspaper className="w-4 h-4 text-amber-400" />
                <span>CONTENT &amp; COMMUNITY &bull; Sovereign Press &amp; Article 12 Compliance</span>
              </span>
              <span className="text-[10px] text-emerald-400">CONSTITUTION ACTIVE</span>
            </div>
            <p className="text-neutral-300 font-sans text-xs">
              Universal right to publish, transparent sources, citation audits, and Pulse social feed moderation.
            </p>
          </div>

          {/* Founder Press Studio */}
          <FounderPressStudio notify={notify} />
        </div>
      )}

      {/* ========================================================================= */}
      {/* ── SECTION 08: ANALYTICS ──────────────────────────────────────────────── */}
      {/* ========================================================================= */}
      {activeSection === '08_analytics' && (
        <div className="space-y-6 w-full font-mono text-xs">
          <div className="p-6 rounded-3xl bg-[#080a12] border border-amber-500/30 space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-amber-400 font-bold uppercase tracking-wider flex items-center gap-2">
                <TrendingUp className="w-4 h-4 text-amber-400" />
                <span>ANALYTICS &bull; Platform Velocity &amp; Delegate Metrics</span>
              </span>
              <span className="text-[10px] text-neutral-400">EDGE TELEMETRY</span>
            </div>
            <p className="text-neutral-300 font-sans text-xs">
              Registration funnel, Cashfree payment conversion ratios, active nodes, and regional distribution.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="p-5 rounded-3xl bg-black/60 border border-white/10 space-y-1">
              <span className="text-[10px] text-neutral-400 uppercase">Cashfree Success Rate</span>
              <div className="text-2xl font-bold text-emerald-400">99.4%</div>
              <p className="text-[10px] text-neutral-500">Zero dropped UPI intents</p>
            </div>
            <div className="p-5 rounded-3xl bg-black/60 border border-white/10 space-y-1">
              <span className="text-[10px] text-neutral-400 uppercase">Application Conversion</span>
              <div className="text-2xl font-bold text-cyan-400">84.2%</div>
              <p className="text-[10px] text-neutral-500">Inbound to approved seat</p>
            </div>
            <div className="p-5 rounded-3xl bg-black/60 border border-white/10 space-y-1">
              <span className="text-[10px] text-neutral-400 uppercase">Press Readership</span>
              <div className="text-2xl font-bold text-amber-400">14.8k</div>
              <p className="text-[10px] text-neutral-500">Monthly article readers</p>
            </div>
            <div className="p-5 rounded-3xl bg-black/60 border border-white/10 space-y-1">
              <span className="text-[10px] text-neutral-400 uppercase">Average Session Time</span>
              <div className="text-2xl font-bold text-white">18m 42s</div>
              <p className="text-[10px] text-neutral-500">Across Assembly OS &amp; Pulse</p>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* ── SECTION 09: INFRASTRUCTURE ─────────────────────────────────────────── */}
      {/* ========================================================================= */}
      {activeSection === '09_infrastructure' && (
        <div className="space-y-6 w-full font-mono text-xs">
          <div className="p-6 rounded-3xl bg-[#080a12] border border-amber-500/30 space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-amber-400 font-bold uppercase tracking-wider flex items-center gap-2">
                <Server className="w-4 h-4 text-amber-400" />
                <span>INFRASTRUCTURE &bull; Cloud Cluster &amp; Database Health</span>
              </span>
              <span className="text-[10px] text-emerald-400">OPTIMAL</span>
            </div>
            <p className="text-neutral-300 font-sans text-xs">
              Server cluster CPU/memory telemetry, PostgreSQL connection pool, Redis cache, and CDN edge status.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="p-5 rounded-3xl bg-black/60 border border-white/10 space-y-2">
              <div className="flex items-center justify-between text-neutral-400 text-[10px]">
                <span>CORE CPU UTILIZATION</span>
                <Cpu className="w-4 h-4 text-cyan-400" />
              </div>
              <div className="text-2xl font-bold text-white">4.2%</div>
              <p className="text-[10px] text-neutral-500">Next.js App Server fleet</p>
            </div>

            <div className="p-5 rounded-3xl bg-black/60 border border-white/10 space-y-2">
              <div className="flex items-center justify-between text-neutral-400 text-[10px]">
                <span>DATABASE LATENCY</span>
                <Database className="w-4 h-4 text-emerald-400" />
              </div>
              <div className="text-2xl font-bold text-emerald-300">1.8ms</div>
              <p className="text-[10px] text-neutral-500">PostgreSQL Pool &bull; 0 queue delay</p>
            </div>

            <div className="p-5 rounded-3xl bg-black/60 border border-white/10 space-y-2">
              <div className="flex items-center justify-between text-neutral-400 text-[10px]">
                <span>CDN EDGE HIT RATIO</span>
                <Globe2 className="w-4 h-4 text-amber-400" />
              </div>
              <div className="text-2xl font-bold text-amber-300">98.9%</div>
              <p className="text-[10px] text-neutral-500">Cloudflare Edge Caching</p>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* ── SECTION 10: SECURITY & AUDIT ───────────────────────────────────────── */}
      {/* ========================================================================= */}
      {activeSection === '10_security_audit' && (
        <div className="space-y-6 w-full font-mono text-xs">
          <div className="p-6 rounded-3xl bg-[#080a12] border border-amber-500/30 space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-amber-400 font-bold uppercase tracking-wider flex items-center gap-2">
                <ShieldAlert className="w-4 h-4 text-amber-400" />
                <span>SECURITY &amp; AUDIT &bull; Citadel System Maintenance &amp; Ledger</span>
              </span>
              <span className="text-[10px] text-emerald-400">IMMUTABLE LOGS ACTIVE</span>
            </div>
            <p className="text-neutral-300 font-sans text-xs">
              Cryptographic integrity verification, zero-surveillance compliance, and intrusion defense logs.
            </p>
          </div>

          <div className="p-6 rounded-3xl bg-black/60 border border-white/10 space-y-3">
            <div className="flex items-center justify-between border-b border-white/10 pb-3">
              <span className="text-white font-bold uppercase">Recent Security Ledger Entries</span>
              <span className="text-[10px] text-neutral-400">APPEND-ONLY BUFFER</span>
            </div>

            <div className="space-y-2">
              {getAuditLogs().slice(0, 8).map((log, idx) => (
                <div key={idx} className="p-3 rounded-2xl bg-[#080a12] border border-white/5 flex items-center justify-between text-[11px]">
                  <div className="flex items-center gap-2.5 truncate">
                    <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 shrink-0" />
                    <span className="text-white font-medium truncate">{log.action}</span>
                  </div>
                  <span className="text-[10px] text-neutral-500 shrink-0">
                    {new Date(log.timestamp).toLocaleTimeString()}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* ── SECTION 11: ORGANISATION ───────────────────────────────────────────── */}
      {/* ========================================================================= */}
      {activeSection === '11_organisation' && (
        <div className="space-y-6 w-full font-mono text-xs">
          <div className="p-6 rounded-3xl bg-[#080a12] border border-amber-500/30 space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-amber-400 font-bold uppercase tracking-wider flex items-center gap-2">
                <Building className="w-4 h-4 text-amber-400" />
                <span>ORGANISATION &bull; ZENVITRA Secretariat &amp; Partner Councils</span>
              </span>
              <span className="text-[10px] text-amber-400">GOVERNANCE ROSTER</span>
            </div>
            <p className="text-neutral-300 font-sans text-xs">
              Secretariat hierarchy, institutional affiliations, constitution enforcement, and platform roadmap.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="p-6 rounded-3xl bg-black/60 border border-white/10 space-y-3">
              <span className="text-white font-bold text-sm block">Core Secretariat Hierarchy</span>
              <div className="space-y-2 text-[11px]">
                <div className="p-3 rounded-2xl bg-[#080a12] border border-white/5 flex items-center justify-between">
                  <span className="text-amber-300 font-bold">@yuveer</span>
                  <span className="text-neutral-400">Sovereign Founder // Level 0</span>
                </div>
                <div className="p-3 rounded-2xl bg-[#080a12] border border-white/5 flex items-center justify-between">
                  <span className="text-cyan-300 font-bold">Secretariat Desk</span>
                  <span className="text-neutral-400">Secretary-General &amp; Deputy Chairs</span>
                </div>
                <div className="p-3 rounded-2xl bg-[#080a12] border border-white/5 flex items-center justify-between">
                  <span className="text-emerald-300 font-bold">Dais Executive Board</span>
                  <span className="text-neutral-400">Committee Presidents &amp; Moderators</span>
                </div>
              </div>
            </div>

            <div className="p-6 rounded-3xl bg-black/60 border border-white/10 space-y-3">
              <span className="text-white font-bold text-sm block">Constitution &amp; Charters</span>
              <p className="text-neutral-400 font-sans text-xs leading-relaxed">
                ZENVITRA is governed by its published Constitution, with strict adherence to Article 12 (Open Publication, Freedom of Expression, and Media Transparency).
              </p>
              <Link
                href="/constitution"
                className="w-full py-2.5 rounded-xl bg-white/10 hover:bg-white/20 text-white font-bold transition flex items-center justify-center gap-2 text-xs"
              >
                <span>Read Full Platform Constitution</span>
                <ExternalLink className="w-3.5 h-3.5 text-neutral-400" />
              </Link>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* ── SECTION 12: FOUNDER SETTINGS ───────────────────────────────────────── */}
      {/* ========================================================================= */}
      {activeSection === '12_founder_settings' && (
        <div className="space-y-6 w-full font-mono text-xs">
          <div className="p-6 rounded-3xl bg-[#080a12] border border-amber-500/30 space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-amber-400 font-bold uppercase tracking-wider flex items-center gap-2">
                <Settings className="w-4 h-4 text-amber-400" />
                <span>FOUNDER SETTINGS &bull; Personal Keys, Directives &amp; Root CLI</span>
              </span>
              <span className="text-[10px] text-amber-400">CONFIDENTIAL LEVEL 0</span>
            </div>
            <p className="text-neutral-300 font-sans text-xs">
              Personal passkeys, Sovereign Directives Studio, site ticker overrides, and root terminal command line.
            </p>
          </div>

          {/* Personal Master Passkeys */}
          <div className="p-6 sm:p-8 rounded-3xl bg-black/60 border border-amber-500/30 space-y-4">
            <div className="flex items-center justify-between border-b border-white/10 pb-4">
              <span className="text-amber-300 font-bold uppercase tracking-wider flex items-center gap-2">
                <KeyRound className="w-4 h-4 text-amber-400" />
                <span>Founder Personal Master Passkeys</span>
              </span>
              <span className="text-[10px] text-neutral-400">HARDWARE SEED ENCRYPTION</span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {PERSONAL_FOUNDER_KEYS.slice(0, 2).map((k) => (
                <div key={k} className="p-3.5 rounded-2xl bg-[#080a12] border border-amber-400/30 flex items-center justify-between">
                  <div className="space-y-0.5">
                    <span className="text-[10px] text-neutral-500 uppercase">Master Sovereign Passkey</span>
                    <p className="text-amber-300 font-bold tracking-widest">{k}</p>
                  </div>
                  <button
                    type="button"
                    onClick={() => handleCopyKey(k)}
                    className="p-2 rounded-xl bg-amber-400/20 hover:bg-amber-400/30 text-amber-300 transition cursor-pointer"
                  >
                    {copiedKey === k ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                  </button>
                </div>
              ))}
            </div>
          </div>

          {/* Sovereign Directives Studio */}
          <form onSubmit={handleSaveDirective} className="p-6 sm:p-8 rounded-3xl bg-[#080a12] border border-white/10 space-y-4">
            <div className="flex items-center justify-between border-b border-white/10 pb-4">
              <span className="text-white font-bold uppercase tracking-wider flex items-center gap-2">
                <Radio className="w-4 h-4 text-rose-400" />
                <span>Founder\'s Sovereign Directives Studio</span>
              </span>
              <span className="text-[10px] text-neutral-400">BROADCASTED IN PULSE FEED</span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <label className="text-[10px] text-neutral-400 uppercase font-bold">Directive Title</label>
                <input
                  type="text"
                  required
                  value={directiveTitle}
                  onChange={(e) => setDirectiveTitle(e.target.value)}
                  className="w-full px-4 py-3 rounded-xl bg-black border border-white/20 text-white text-xs focus:outline-none focus:border-amber-400"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-[10px] text-neutral-400 uppercase font-bold">Directive Author Tag</label>
                <input
                  type="text"
                  required
                  value={directiveAuthor}
                  onChange={(e) => setDirectiveAuthor(e.target.value)}
                  className="w-full px-4 py-3 rounded-xl bg-black border border-white/20 text-amber-300 text-xs focus:outline-none focus:border-amber-400"
                />
              </div>
            </div>

            <div className="space-y-1.5">
              <label className="text-[10px] text-neutral-400 uppercase font-bold">Directive Body</label>
              <textarea
                required
                rows={3}
                value={directiveBody}
                onChange={(e) => setDirectiveBody(e.target.value)}
                className="w-full px-4 py-3 rounded-xl bg-black border border-white/20 text-white text-xs focus:outline-none focus:border-amber-400"
              />
            </div>

            <div className="flex items-center justify-between pt-2">
              <label className="flex items-center gap-2 cursor-pointer text-xs text-neutral-300">
                <input
                  type="checkbox"
                  checked={directiveActive}
                  onChange={(e) => setDirectiveActive(e.target.checked)}
                  className="w-4 h-4 rounded bg-black border-white/20 text-amber-500 focus:ring-0 cursor-pointer"
                />
                <span>Broadcast this directive live at the top of the campus feed</span>
              </label>

              <button
                type="submit"
                className="px-6 py-2.5 rounded-xl bg-amber-400 hover:bg-amber-300 text-black font-bold text-xs transition cursor-pointer uppercase shadow-[0_0_20px_rgba(251,191,36,0.3)]"
              >
                Save Directive
              </button>
            </div>
          </form>

          {/* Root Terminal CLI */}
          <div className="p-6 sm:p-8 rounded-3xl bg-black border border-amber-500/30 space-y-4">
            <div className="flex items-center justify-between border-b border-white/10 pb-4">
              <span className="text-amber-300 font-bold uppercase tracking-wider flex items-center gap-2">
                <Terminal className="w-4 h-4 text-amber-400" />
                <span>Sovereign Root Terminal (CLI)</span>
              </span>
              <span className="text-[10px] text-neutral-500">TYPE &quot;help&quot; FOR COMMANDS</span>
            </div>

            <div className="p-4 rounded-2xl bg-[#040508] border border-white/10 min-h-[160px] max-h-[240px] overflow-y-auto space-y-1 text-xs">
              {terminalLogs.map((log, idx) => (
                <div
                  key={idx}
                  className={`leading-relaxed ${
                    log.type === 'cmd' ? 'text-amber-300 font-bold' :
                    log.type === 'success' ? 'text-emerald-400' :
                    log.type === 'warn' ? 'text-rose-400' :
                    log.type === 'error' ? 'text-red-400' : 'text-neutral-400'
                  }`}
                >
                  {log.text}
                </div>
              ))}
            </div>

            <form onSubmit={handleTerminalSubmit} className="flex gap-2">
              <input
                type="text"
                value={terminalInput}
                onChange={(e) => setTerminalInput(e.target.value)}
                placeholder="root@zenvitra:~$ type command here..."
                className="flex-1 px-4 py-2.5 rounded-xl bg-[#090b14] border border-white/20 text-white text-xs focus:outline-none focus:border-amber-400 font-mono"
              />
              <button
                type="submit"
                className="px-5 py-2.5 rounded-xl bg-amber-400 hover:bg-amber-300 text-black font-bold text-xs transition cursor-pointer font-mono"
              >
                Execute
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}