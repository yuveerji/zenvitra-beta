'use client';

import React, { useState, useEffect } from 'react';
import { 
  Crown, 
  X, 
  Radio, 
  Sparkles, 
  Trash2, 
  Plus, 
  Users, 
  CheckCircle2, 
  Sliders, 
  Activity, 
  Zap, 
  Lock, 
  Save, 
  AlertTriangle, 
  RotateCcw, 
  Newspaper, 
  Check, 
  Send, 
  CreditCard, 
  Settings, 
  Edit3, 
  Award, 
  Globe2, 
  Calendar, 
  Percent, 
  UserCheck, 
  Ban, 
  Coins, 
  ShieldCheck, 
  ShieldAlert, 
  ArrowRight,
  KeyRound,
  Terminal,
  Download,
  Copy,
  Flame,
  Video,
  Music,
  FileCode,
  Layers,
  Database,
  Volume2,
  Unlock
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
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
import { FounderPressStudio } from '@/components/founder/FounderPressStudio';

interface FounderOmniModalProps {
  isOpen: boolean;
  onClose: () => void;
  onOpenAdminMenu?: () => void;
}

export function FounderOmniModal({ isOpen, onClose, onOpenAdminMenu }: FounderOmniModalProps) {
  const { user, profile } = useAuth();
  const { feedPosts, deletePost, currentUserName, currentUserUsername, createPost } = useZenPulse();

  const [activeTab, setActiveTabState] = useState<
    'directive' | 'press' | 'masterkey' | 'users' | 'subscriptions' | 'parliament' | 'media' | 'escrow' | 'sheets' | 'terminal' | 'protocol' | 'audit'
  >(() => {
    if (typeof window !== 'undefined') {
      try {
        const saved = sessionStorage.getItem('zenvitra_omni_tab');
        if (saved) return saved as any;
      } catch (_) {}
    }
    return 'directive';
  });

  const setActiveTab = (tab: any) => {
    setActiveTabState(tab);
    if (typeof window !== 'undefined') {
      try {
        sessionStorage.setItem('zenvitra_omni_tab', tab);
      } catch (_) {}
    }
  };

  // Strict Founder Verification Check
  const effectiveUser = (currentUserUsername || user?.email?.split('@')[0] || profile?.username || '').toLowerCase().trim().replace(/^@/, '');
  const isFounderClearance = isFounder(effectiveUser, (profile?.role as any) || (profile as any)?.badge);

  /* Modal Passkey Unlock State */
  const [modalUnlockKey, setModalUnlockKey] = useState('');
  const [modalUnlockError, setModalUnlockError] = useState<string | null>(null);

  /* Master Key Ring State */
  const [copiedKey, setCopiedKey] = useState<string | null>(null);
  const [customMasterKey, setCustomMasterKey] = useState('');

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

  /* User Override State */
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

  /* Parliamentary / Crisis Flash State */
  const [crisisHeadline, setCrisisHeadline] = useState('🚨 GENEVA CYBER BREACH: Emergency Diplomatic Working Paper Session Initiated');
  const [crisisTimer, setCrisisTimer] = useState('45:00');
  const [activeCrisisFlash, setActiveCrisisFlash] = useState(false);

  /* Terminal State with History Persistence */
  const [terminalInput, setTerminalInput] = useState('');
  const [terminalLogs, setTerminalLogsState] = useState<Array<{ text: string; type: 'info' | 'success' | 'warn' | 'error' | 'cmd' }>>(() => {
    if (typeof window !== 'undefined') {
      try {
        const saved = sessionStorage.getItem('zenvitra_omni_cli_logs');
        if (saved) {
          const parsed = JSON.parse(saved);
          if (Array.isArray(parsed) && parsed.length > 0) return parsed;
        }
      } catch (_) {}
    }
    return [
      { text: 'ZENVITRA SUPREME SOVEREIGN COMMAND CLI v6.8', type: 'info' },
      { text: 'Authenticated Level 0 Root Operator: @yuveer (100% Access)', type: 'success' },
      { text: 'Type "help" for a full list of executive master commands.', type: 'info' },
    ];
  });

  const setTerminalLogs = (updater: Array<{ text: string; type: 'info' | 'success' | 'warn' | 'error' | 'cmd' }> | ((prev: Array<{ text: string; type: 'info' | 'success' | 'warn' | 'error' | 'cmd' }>) => Array<{ text: string; type: 'info' | 'success' | 'warn' | 'error' | 'cmd' }>)) => {
    setTerminalLogsState((prev) => {
      const next = typeof updater === 'function' ? updater(prev) : updater;
      if (typeof window !== 'undefined') {
        try {
          sessionStorage.setItem('zenvitra_omni_cli_logs', JSON.stringify(next.slice(-100)));
        } catch (_) {}
      }
      return next;
    });
  };

  /* Status feedback */
  const [toastMsg, setToastMsg] = useState<string | null>(null);

  useEffect(() => {
    if (isOpen) {
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
    }
  }, [isOpen]);

  const showToast = (msg: string) => {
    setToastMsg(msg);
    setTimeout(() => setToastMsg(null), 3000);
  };

  /* Unlock via Modal Code */
  const handleModalUnlock = (e: React.FormEvent) => {
    e.preventDefault();
    if (!modalUnlockKey.trim()) return;
    const ok = activateFounderSession(modalUnlockKey.trim());
    if (ok) {
      setModalUnlockError(null);
      showToast('👑 Founder Sovereignty Clearance Unlocked!');
    } else {
      setModalUnlockError('Invalid authorization code.');
    }
  };

  const handleCopyKey = (keyText: string) => {
    if (typeof navigator !== 'undefined') {
      navigator.clipboard.writeText(keyText);
      setCopiedKey(keyText);
      showToast('Master key copied to clipboard!');
      setTimeout(() => setCopiedKey(null), 2500);
    }
  };

  const handleSaveCustomKey = (e: React.FormEvent) => {
    e.preventDefault();
    if (!customMasterKey.trim()) return;
    setCustomFounderKey(customMasterKey.trim());
    setCustomMasterKey('');
    showToast('Custom Master Key registered into secure enclave!');
  };

  /* Save Directive */
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
    showToast('👑 Founder Directive synchronized across Home, Pulse & Hubs!');
  };

  /* Save User Node Override */
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
    showToast(`🛡️ Node @${updated.username} updated: Role=${updated.role}, Badge=${updated.verifiedBadge}, +${updated.extraCivicPoints} PTS!`);
  };

  /* Grant VIP Subscription */
  const handleGrantSubscription = (e: React.FormEvent) => {
    e.preventDefault();
    if (!subTargetUser.trim()) return;
    const rec = grantUserSubscription(subTargetUser, subTier, subDuration);
    setSubscriptionsList(getAllSubscriptions());
    setSubTargetUser('');
    showToast(`👑 Granted [${subTier}] (${subDuration}) to @${rec.username}!`);
  };

  const handleRevokeSubscription = (u: string) => {
    revokeUserSubscription(u);
    setSubscriptionsList(getAllSubscriptions());
    showToast(`Revoked VIP pass for @${u}`);
  };

  /* Save Site & Ticker Overrides */
  const handleSaveSiteOverrides = (e: React.FormEvent) => {
    e.preventDefault();
    const updated = saveSiteOverrides({
      tickerText: tickerText.trim(),
      tickerActive,
      bannerNotice: bannerNotice.trim(),
      bannerActive,
      escrowPercentage: Number(escrowPercentage) || 25,
    });
    setSiteOverrides(updated);
    showToast('🌐 Global Ticker, Escrow & Siren parameters deployed!');
  };

  /* Toggle Protocol Switch */
  const handleToggleProtocol = (key: keyof ProtocolControls) => {
    const nextVal = !protocols[key];
    const updated = saveProtocolControls({ [key]: nextVal });
    setProtocols(updated);
    showToast(`Protocol [${String(key)}] set to ${nextVal ? 'ONLINE' : 'MUTED'}`);
  };

  /* Trigger Crisis Flash */
  const handleToggleCrisisFlash = () => {
    setActiveCrisisFlash((prev) => {
      const next = !prev;
      showToast(next ? '🚨 Geopolitical Crisis Flash Deployed to all assemblies!' : 'Crisis Flash Deactivated.');
      return next;
    });
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
        { text: 'SOVEREIGN EXECUTIVE INSTRUCTION SET:', type: 'info' },
        { text: '  status                       - Display core network invariants', type: 'info' },
        { text: '  faucet <user> <amount>       - Mint and inject Civic Points', type: 'info' },
        { text: '  promote <user> <role>        - Elevate role (FOUNDER, ADMIN, MODERATOR, DELEGATE)', type: 'info' },
        { text: '  badge <user> <GOLD|BLUE|NONE> - Grant verified badge to node', type: 'info' },
        { text: '  freeze                       - Protocol Omega: emergency lockdown', type: 'info' },
        { text: '  resume                       - Resume standard live operations', type: 'info' },
        { text: '  crisis_flash <headline>      - Broadcast emergency crisis to assemblies', type: 'info' },
        { text: '  export_json                  - Download complete database snapshot JSON', type: 'info' },
        { text: '  clear                        - Clear terminal buffer', type: 'info' },
      ]);
    } else if (root === 'clear') {
      if (typeof window !== 'undefined') {
        try { sessionStorage.removeItem('zenvitra_omni_cli_logs'); } catch (_) {}
      }
      setTerminalLogs([{ text: 'Terminal output buffer cleared.', type: 'info' }]);
    } else if (root === 'status') {
      setTerminalLogs((prev) => [
        ...prev,
        { text: '[CORE] ED25519 Cipher Socket Relays: OPTIMAL', type: 'success' },
        { text: '[OPERATOR] @yuveer // ROOT LEVEL 0 (100% Access)', type: 'success' },
        { text: `[ESCROW] Constitutional Allocation: ${siteOverrides.escrowPercentage}% Guaranteed`, type: 'info' },
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
      showToast(`+${amt} Civic Points injected into @${u}`);
    } else if (root === 'promote' && parts.length >= 3) {
      const u = parts[1].replace('@', '');
      const role = parts[2].toUpperCase() as any;
      saveUserOverride(u, { role });
      setUserOverridesList(getAllUserOverrides());
      setTerminalLogs((prev) => [
        ...prev,
        { text: `[ROLE] Node @${u} role elevated to ${role}!`, type: 'success' },
      ]);
      showToast(`Node @${u} promoted to ${role}`);
    } else if (root === 'freeze') {
      saveProtocolControls({ maintenanceMode: true, registrationsOpen: false });
      setProtocols(getProtocolControls());
      setTerminalLogs((prev) => [
        ...prev,
        { text: '🚨 [EMERGENCY] NETWORK FREEZE ACTIVATED: Maintenance ON, Registrations OFF', type: 'warn' },
      ]);
      showToast('🚨 Protocol Omega Activated');
    } else if (root === 'resume') {
      saveProtocolControls({ maintenanceMode: false, registrationsOpen: true });
      setProtocols(getProtocolControls());
      setTerminalLogs((prev) => [
        ...prev,
        { text: '✅ [NORMAL] Network restored to standard operations.', type: 'success' },
      ]);
      showToast('Platform resumed to normal');
    } else {
      setTerminalLogs((prev) => [
        ...prev,
        { text: `Command not recognized: "${cmd}". Type "help" for instruction set.`, type: 'error' },
      ]);
    }
  };

  /* Export Database JSON Snapshot */
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
    a.download = `zenvitra_founder_snapshot_${new Date().toISOString().split('T')[0]}.json`;
    a.click();
    URL.revokeObjectURL(url);
    showToast('📦 Complete system snapshot downloaded!');
  };

  if (!isOpen) return null;

  // ── CLEARANCE GATE: IF NON-FOUNDER OR LOCKED ──
  if (!isFounderClearance) {
    return (
      <div 
        className="fixed inset-0 z-[200] flex items-center justify-center p-4 sm:p-6 bg-black/90 backdrop-blur-2xl font-sans"
        onClick={onClose}
      >
        <div 
          className="relative w-full max-w-md p-8 rounded-3xl bg-[#090b10] border border-amber-500/40 shadow-[0_25px_90px_rgba(251,191,36,0.25)] text-center space-y-5"
          onClick={(e) => e.stopPropagation()}
        >
          <div className="w-16 h-16 rounded-3xl bg-amber-500/20 border border-amber-500/40 flex items-center justify-center text-amber-400 mx-auto shadow-[0_0_25px_rgba(251,191,36,0.3)]">
            <Crown className="w-8 h-8 fill-amber-400/30" />
          </div>

          <div className="space-y-1.5">
            <h3 className="font-display font-bold text-lg text-white">
              Founder Sovereignty Clearance
            </h3>
            <p className="text-xs text-neutral-400 leading-relaxed font-mono">
              Enter your Personal Authorization Code below to unlock supreme founder controls.
            </p>
          </div>

          <form onSubmit={handleModalUnlock} className="space-y-3 text-left">
            <input
              type="password"
              value={modalUnlockKey}
              onChange={(e) => setModalUnlockKey(e.target.value)}
              placeholder="Insert your code"
              className="w-full px-4 py-2.5 rounded-xl bg-black border border-white/20 text-amber-300 font-mono text-xs focus:outline-none focus:border-amber-400"
              autoFocus
            />
            {modalUnlockError && (
              <p className="text-[11px] font-mono text-rose-400">{modalUnlockError}</p>
            )}
            <button
              type="submit"
              className="w-full py-2.5 rounded-xl bg-amber-400 hover:bg-amber-300 text-black font-mono text-xs font-bold transition shadow cursor-pointer"
            >
              Unlock Founder Mode
            </button>
          </form>

          <div className="pt-2 flex flex-col gap-2">
            {onOpenAdminMenu && (
              <button
                type="button"
                onClick={() => {
                  onClose();
                  onOpenAdminMenu();
                }}
                className="w-full py-2.5 rounded-2xl bg-cyan-500/15 hover:bg-cyan-500/25 border border-cyan-500/30 text-cyan-300 font-mono text-xs font-bold transition"
              >
                Open Admin &amp; Committee Menu
              </button>
            )}
            <button
              type="button"
              onClick={onClose}
              className="w-full py-2.5 rounded-2xl bg-white/5 hover:bg-white/10 text-neutral-400 hover:text-white font-mono text-xs transition cursor-pointer"
            >
              Close
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div 
      className="fixed inset-0 z-[200] flex items-center justify-center p-4 sm:p-6 bg-black/90 backdrop-blur-2xl overflow-y-auto font-sans text-left"
      onClick={onClose}
    >
      <div 
        className="relative w-full max-w-6xl max-h-[92vh] flex flex-col rounded-3xl bg-[#090a10] border border-amber-500/40 shadow-[0_25px_100px_rgba(251,191,36,0.2)] overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Toast Feedback */}
        <AnimatePresence>
          {toastMsg && (
            <motion.div 
              initial={{ y: -20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: -20, opacity: 0 }}
              className="absolute top-4 left-1/2 -translate-x-1/2 z-50 px-5 py-2 rounded-full bg-amber-400 text-black font-mono text-xs font-bold shadow-[0_0_30px_rgba(251,191,36,0.6)] flex items-center gap-2 pointer-events-none"
            >
              <Crown className="w-3.5 h-3.5 fill-black" />
              <span>{toastMsg}</span>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Top Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-5 sm:p-6 border-b border-white/10 bg-gradient-to-r from-amber-950/40 via-[#0e0c14] to-zinc-950">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-amber-400 via-rose-500 to-yellow-500 p-[2px] shrink-0 shadow-lg">
              <div className="w-full h-full rounded-2xl bg-black flex items-center justify-center text-amber-400">
                <Crown className="w-6 h-6 fill-amber-400/20" />
              </div>
            </div>
            <div>
              <div className="flex flex-wrap items-center gap-2">
                <h2 className="font-display font-black text-lg text-white tracking-wide">
                  Supreme Founder Sovereignty Deck
                </h2>
                <span className="px-2.5 py-0.5 rounded-full bg-amber-400/20 text-amber-300 font-mono text-[10px] font-bold border border-amber-400/40 flex items-center gap-1 shadow-[0_0_10px_rgba(251,191,36,0.3)]">
                  <Crown className="w-3 h-3 text-amber-400 fill-amber-400" />
                  <span>@yuveer</span>
                </span>
                <span className="px-2 py-0.5 rounded-full bg-rose-500/20 text-rose-300 font-mono text-[9px] font-bold border border-rose-500/40">
                  ROOT PRIVILEGE (100%)
                </span>
              </div>
              <p className="text-xs font-mono text-neutral-400 mt-0.5">
                Exclusive Sovereign Governance for <strong className="text-amber-300 font-semibold">@yuveer</strong> &bull; Directives, Faucets, Parliament Overrides &amp; Enclaves
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handleExportDatabaseJSON}
              className="px-3.5 py-1.5 rounded-xl bg-white/10 hover:bg-white/20 border border-white/20 text-white font-mono text-xs font-bold transition flex items-center gap-1.5 cursor-pointer shadow"
              title="Download Full Database Snapshot JSON"
            >
              <Download className="w-3.5 h-3.5" />
              <span>Snapshot</span>
            </button>

            {onOpenAdminMenu && (
              <button
                type="button"
                onClick={() => {
                  onClose();
                  onOpenAdminMenu();
                }}
                className="px-3.5 py-1.5 rounded-xl bg-cyan-500/15 hover:bg-cyan-500/25 border border-cyan-500/40 text-cyan-300 font-mono text-xs font-bold transition flex items-center gap-1.5 cursor-pointer shadow"
                title="Switch to Operational Admin Menu"
              >
                <ShieldCheck className="w-3.5 h-3.5" />
                <span>Admin Menu</span>
              </button>
            )}

            <button
              onClick={onClose}
              className="p-2 rounded-xl text-neutral-400 hover:text-white hover:bg-white/10 transition cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Tab Navigation */}
        <div className="flex items-center gap-1.5 px-6 border-b border-white/10 bg-black/40 overflow-x-auto no-scrollbar font-mono text-xs">
          {[
            { id: 'directive', label: '👑 Founder\'s Note', icon: Radio },
            { id: 'press', label: '📰 Press Studio', icon: Newspaper },
            { id: 'masterkey', label: '🔑 Master Keys', icon: KeyRound },
            { id: 'users', label: '🛡️ Node Clearance & Faucet', icon: Users },
            { id: 'subscriptions', label: '💳 VIP Subscriptions', icon: CreditCard },
            { id: 'parliament', label: '🏛️ Parliament & Crisis', icon: Flame },
            { id: 'media', label: '🎙️ Audio, Songs & FLUX', icon: Music },
            { id: 'escrow', label: '🪙 25% Escrow & Grants', icon: Coins },
            { id: 'terminal', label: '💻 Root CLI (Terminal)', icon: Terminal },
            { id: 'protocol', label: '⚙️ Killswitches & Citadel', icon: Sliders },
            { id: 'audit', label: '📜 Audit Ledger', icon: Activity },
          ].map((tab) => {
            const Icon = tab.icon;
            const active = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`flex items-center gap-2 px-3.5 py-3 border-b-2 font-bold whitespace-nowrap transition cursor-pointer ${
                  active
                    ? 'text-amber-400 border-amber-400 bg-amber-500/10 shadow-[0_-5px_15px_rgba(251,191,36,0.1)]'
                    : 'text-neutral-400 border-transparent hover:text-white hover:bg-white/5'
                }`}
              >
                <Icon className="w-3.5 h-3.5" />
                <span>{tab.label}</span>
              </button>
            );
          })}
        </div>

        {/* Content Body */}
        <div className="p-6 overflow-y-auto max-h-[calc(92vh-150px)] space-y-6 bg-[#08090f]">
          
          {/* ── 1. FOUNDER DIRECTIVE / EXECUTIVE NOTE ── */}
          {activeTab === 'directive' && (
            <div className="space-y-6">
              <div className="p-5 rounded-2xl bg-amber-500/5 border border-amber-500/20 text-xs text-neutral-300 font-mono space-y-1">
                <p className="font-bold text-amber-300">Executive Directive Broadcast Engine</p>
                <p>This note is rendered in real time at the top of the ZenPulse feed and platform hubs for all global delegates.</p>
              </div>

              <form onSubmit={handleSaveDirective} className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <label className="text-[11px] font-mono text-neutral-400 uppercase font-bold">Directive Title</label>
                    <input
                      type="text"
                      value={directiveTitle}
                      onChange={(e) => setDirectiveTitle(e.target.value)}
                      className="w-full px-4 py-2.5 rounded-xl bg-black border border-white/15 text-white font-mono text-xs focus:outline-none focus:border-amber-400"
                    />
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-[11px] font-mono text-neutral-400 uppercase font-bold">Author / Council Tag</label>
                    <input
                      type="text"
                      value={directiveAuthor}
                      onChange={(e) => setDirectiveAuthor(e.target.value)}
                      className="w-full px-4 py-2.5 rounded-xl bg-black border border-white/15 text-white font-mono text-xs focus:outline-none focus:border-amber-400"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <label className="text-[11px] font-mono text-neutral-400 uppercase font-bold">Priority Status</label>
                    <select
                      value={directivePriority}
                      onChange={(e) => setDirectivePriority(e.target.value as any)}
                      className="w-full px-4 py-2.5 rounded-xl bg-black border border-white/15 text-white font-mono text-xs focus:outline-none focus:border-amber-400 cursor-pointer"
                    >
                      <option value="CONSTITUTIONAL">👑 CONSTITUTIONAL (Supreme Gold Frame)</option>
                      <option value="URGENT">🚨 URGENT (Crimson Emergency Siren)</option>
                      <option value="NORMAL">🔵 NORMAL (Standard Executive Dispatch)</option>
                    </select>
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-[11px] font-mono text-neutral-400 uppercase font-bold">Broadcast Status</label>
                    <div className="flex items-center gap-3 pt-2">
                      <label className="flex items-center gap-2 text-xs font-mono cursor-pointer">
                        <input
                          type="checkbox"
                          checked={directiveActive}
                          onChange={(e) => setDirectiveActive(e.target.checked)}
                          className="w-4 h-4 rounded text-amber-500 accent-amber-500 cursor-pointer"
                        />
                        <span className={directiveActive ? 'text-emerald-400 font-bold' : 'text-neutral-500'}>
                          {directiveActive ? 'ACTIVE // BROADCASTING ON WIRE' : 'MUTED // OFF-AIR'}
                        </span>
                      </label>
                    </div>
                  </div>
                </div>

                <div className="space-y-1.5">
                  <label className="text-[11px] font-mono text-neutral-400 uppercase font-bold">Directive Decree Body</label>
                  <textarea
                    rows={4}
                    value={directiveBody}
                    onChange={(e) => setDirectiveBody(e.target.value)}
                    className="w-full px-4 py-3 rounded-xl bg-black border border-white/15 text-white font-mono text-xs focus:outline-none focus:border-amber-400 leading-relaxed"
                  />
                </div>

                <div className="flex items-center justify-between pt-2">
                  <button
                    type="button"
                    onClick={() => {
                      clearFounderDirective();
                      setDirectiveActive(false);
                      showToast('Directive silenced across nodes');
                    }}
                    className="px-4 py-2 rounded-xl bg-rose-500/15 hover:bg-rose-500/25 text-rose-300 border border-rose-500/30 text-xs font-mono font-bold transition"
                  >
                    Clear Active Note
                  </button>

                  <button
                    type="submit"
                    className="px-6 py-2.5 rounded-xl bg-amber-400 hover:bg-amber-300 text-black font-mono text-xs font-bold transition shadow-[0_0_20px_rgba(251,191,36,0.4)] flex items-center gap-2"
                  >
                    <Save className="w-3.5 h-3.5 fill-black" />
                    <span>Synchronize Across Network</span>
                  </button>
                </div>
              </form>
            </div>
          )}

          {/* ── 1.5. PERSONALISED FOUNDER PRESS STUDIO ── */}
          {activeTab === 'press' && (
            <FounderPressStudio notify={(msg) => showToast(msg)} />
          )}

          {/* ── 2. PERSONAL MASTER KEY ENCLAVE ── */}
          {activeTab === 'masterkey' && (
            <div className="space-y-6 font-mono text-xs">
              <div className="p-5 rounded-2xl bg-amber-500/5 border border-amber-500/20 space-y-1">
                <p className="font-bold text-amber-300">Cryptographic Master Key Ring</p>
                <p className="text-neutral-400">Hardcoded passkeys authenticate @yuveer on any device. Raw keys are masked for security.</p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {PERSONAL_FOUNDER_KEYS.map((k, idx) => (
                  <div key={k} className="p-4 rounded-2xl bg-black border border-amber-400/30 flex items-center justify-between">
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <span className="px-2 py-0.5 rounded bg-amber-400/20 text-amber-300 text-[10px] font-bold">
                          KEY #{idx + 1}
                        </span>
                        <span className="text-emerald-400 text-[10px]">ACTIVE // ENCRYPTED</span>
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

              {/* Custom Secret Key */}
              <form onSubmit={handleSaveCustomKey} className="p-5 rounded-2xl bg-black border border-white/10 space-y-3">
                <label className="text-[11px] text-amber-300 font-bold uppercase block">
                  Register Custom Personal Secret Key
                </label>
                <div className="flex gap-3">
                  <input
                    type="password"
                    value={customMasterKey}
                    onChange={(e) => setCustomMasterKey(e.target.value)}
                    placeholder="Insert your code"
                    className="flex-1 px-4 py-2.5 rounded-xl bg-[#090b14] border border-white/20 text-white text-xs focus:outline-none focus:border-amber-400"
                  />
                  <button
                    type="submit"
                    className="px-5 py-2.5 rounded-xl bg-amber-400 hover:bg-amber-300 text-black font-bold transition"
                  >
                    Register Key
                  </button>
                </div>
              </form>
            </div>
          )}

          {/* ── 3. NODE CLEARANCE & FAUCET ── */}
          {activeTab === 'users' && (
            <div className="space-y-6">
              <form onSubmit={handleSaveUserOverride} className="p-5 rounded-2xl bg-black border border-white/10 space-y-4">
                <div className="space-y-1 border-b border-white/10 pb-3">
                  <h3 className="font-mono font-bold text-sm text-white uppercase flex items-center gap-2">
                    <Users className="w-4 h-4 text-cyan-400" />
                    <span>Universal Role Mutator &amp; Civic Points Faucet</span>
                  </h3>
                  <p className="text-xs font-mono text-neutral-400">
                    Target any user handle to promote, bestow verified checkmarks, or mint Civic Points into their passport.
                  </p>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-4 gap-3">
                  <input
                    type="text"
                    required
                    value={userTargetHandle}
                    onChange={(e) => setUserTargetHandle(e.target.value)}
                    placeholder="Target @handle"
                    className="px-3.5 py-2.5 rounded-xl bg-[#090b14] border border-white/20 text-white font-mono text-xs focus:outline-none focus:border-cyan-400"
                  />

                  <select
                    value={userTargetRole}
                    onChange={(e) => setUserTargetRole(e.target.value as any)}
                    className="px-3.5 py-2.5 rounded-xl bg-[#090b14] border border-white/20 text-white font-mono text-xs focus:outline-none focus:border-cyan-400 cursor-pointer"
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
                    className="px-3.5 py-2.5 rounded-xl bg-[#090b14] border border-white/20 text-white font-mono text-xs focus:outline-none focus:border-cyan-400 cursor-pointer"
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
                    className="px-3.5 py-2.5 rounded-xl bg-[#090b14] border border-white/20 text-white font-mono text-xs focus:outline-none focus:border-cyan-400"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-[11px] font-mono text-neutral-400 uppercase">Custom Designation / Title</label>
                  <input
                    type="text"
                    value={userCustomTitle}
                    onChange={(e) => setUserCustomTitle(e.target.value)}
                    placeholder="e.g. Lead Diplomatic Architect"
                    className="w-full px-3.5 py-2.5 rounded-xl bg-[#090b14] border border-white/20 text-white font-mono text-xs focus:outline-none focus:border-cyan-400"
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

              {/* Active Overrides Directory */}
              <div className="p-5 rounded-2xl bg-black border border-white/10 space-y-3">
                <span className="text-xs font-mono font-bold text-neutral-400 uppercase block">
                  Active User Overrides ({Object.keys(userOverridesList).length})
                </span>

                <div className="space-y-2 font-mono text-xs">
                  {Object.keys(userOverridesList).length === 0 ? (
                    <p className="text-neutral-500 py-3 text-center">No node overrides registered.</p>
                  ) : (
                    Object.values(userOverridesList).map((node) => (
                      <div key={node.username} className="p-3.5 rounded-xl bg-[#090b14] border border-white/10 flex items-center justify-between">
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
                            showToast(`Reset override for @${node.username}`);
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

          {/* ── 4. VIP SUBSCRIPTIONS ── */}
          {activeTab === 'subscriptions' && (
            <div className="space-y-6">
              <form onSubmit={handleGrantSubscription} className="p-5 rounded-2xl bg-black border border-white/10 space-y-4">
                <div className="space-y-1 border-b border-white/10 pb-3">
                  <h3 className="font-mono font-bold text-sm text-white uppercase flex items-center gap-2">
                    <CreditCard className="w-4 h-4 text-amber-400" />
                    <span>Bestow VIP Sovereign Tier</span>
                  </h3>
                  <p className="text-xs font-mono text-neutral-400">
                    Grant lifetime or annual subscription passes to any delegate.
                  </p>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <input
                    type="text"
                    required
                    value={subTargetUser}
                    onChange={(e) => setSubTargetUser(e.target.value)}
                    placeholder="Recipient @handle"
                    className="px-3.5 py-2.5 rounded-xl bg-[#090b14] border border-white/20 text-white font-mono text-xs focus:outline-none focus:border-amber-400"
                  />

                  <select
                    value={subTier}
                    onChange={(e) => setSubTier(e.target.value as any)}
                    className="px-3.5 py-2.5 rounded-xl bg-[#090b14] border border-white/20 text-white font-mono text-xs focus:outline-none focus:border-amber-400 cursor-pointer"
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
                    className="px-3.5 py-2.5 rounded-xl bg-[#090b14] border border-white/20 text-white font-mono text-xs focus:outline-none focus:border-amber-400 cursor-pointer"
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

              {/* Active VIP Directory */}
              <div className="p-5 rounded-2xl bg-black border border-white/10 space-y-3 font-mono text-xs">
                <span className="font-bold text-neutral-400 uppercase block">
                  Active Granted VIP Clearances ({Object.keys(subscriptionsList).length})
                </span>

                <div className="space-y-2">
                  {Object.keys(subscriptionsList).length === 0 ? (
                    <p className="text-neutral-500 py-3 text-center">No VIP subscriptions active.</p>
                  ) : (
                    Object.values(subscriptionsList).map((sub) => (
                      <div key={sub.username} className="p-3.5 rounded-xl bg-[#090b14] border border-white/10 flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <span className="px-2 py-0.5 rounded-full bg-amber-400/20 text-amber-300 text-[10px] font-bold">
                            {sub.tier}
                          </span>
                          <span className="text-white font-bold">@{sub.username}</span>
                          <span className="text-neutral-500 text-[11px]">• Expires: {sub.expiresAt || 'LIFETIME'}</span>
                        </div>

                        <button
                          type="button"
                          onClick={() => handleRevokeSubscription(sub.username)}
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

          {/* ── 5. PARLIAMENT & CRISIS FLASH ── */}
          {activeTab === 'parliament' && (
            <div className="space-y-6 font-mono text-xs">
              <div className="p-5 rounded-2xl bg-rose-500/10 border border-rose-500/30 space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2 text-rose-300 font-bold">
                    <Flame className="w-4 h-4 text-rose-400 animate-pulse" />
                    <span>GEOPOLITICAL CRISIS FLASH INJECTOR</span>
                  </div>
                  <span className={activeCrisisFlash ? 'text-rose-400 font-bold' : 'text-neutral-500'}>
                    {activeCrisisFlash ? 'CRISIS BROADCASTING LIVE' : 'STANDBY'}
                  </span>
                </div>

                <div className="space-y-2">
                  <label className="text-[11px] text-neutral-400 uppercase font-bold">Crisis Headline</label>
                  <input
                    type="text"
                    value={crisisHeadline}
                    onChange={(e) => setCrisisHeadline(e.target.value)}
                    className="w-full px-4 py-2.5 rounded-xl bg-black border border-white/20 text-white text-xs focus:outline-none focus:border-rose-400"
                  />
                </div>

                <div className="flex items-center justify-between pt-2">
                  <span className="text-neutral-400 text-[11px]">Emergency Timer: {crisisTimer}</span>
                  <button
                    type="button"
                    onClick={handleToggleCrisisFlash}
                    className={`px-6 py-2.5 rounded-xl font-bold transition cursor-pointer ${
                      activeCrisisFlash
                        ? 'bg-rose-500 hover:bg-rose-400 text-white shadow-[0_0_20px_rgba(244,63,94,0.4)]'
                        : 'bg-white/10 hover:bg-white/20 text-white'
                    }`}
                  >
                    {activeCrisisFlash ? 'Deactivate Crisis Flash' : 'Deploy Crisis Flash to All Assemblies'}
                  </button>
                </div>
              </div>

              {/* Parliamentary Ratification Overrides */}
              <div className="p-5 rounded-2xl bg-black border border-white/10 space-y-3">
                <h4 className="font-bold text-white uppercase flex items-center gap-2">
                  <Award className="w-4 h-4 text-amber-400" />
                  <span>Sovereign Fiat Treaty Ratification</span>
                </h4>
                <p className="text-neutral-400">
                  Instantly ratify or veto any deadlocked committee resolution by Sovereign Decrees.
                </p>
                <div className="flex gap-3 pt-2">
                  <button
                    type="button"
                    onClick={() => showToast('Treaty resolution #418 adopted by Sovereign Decree!')}
                    className="px-4 py-2 rounded-xl bg-emerald-500/20 hover:bg-emerald-500/30 text-emerald-300 border border-emerald-500/40 font-bold transition"
                  >
                    Adopt Active Resolution (Fiat)
                  </button>
                  <button
                    type="button"
                    onClick={() => showToast('Resolution #418 vetoed by Sovereign Decree.')}
                    className="px-4 py-2 rounded-xl bg-rose-500/20 hover:bg-rose-500/30 text-rose-300 border border-rose-500/40 font-bold transition"
                  >
                    Veto Active Resolution
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* ── 6. MEDIA, SONGS & 9:16 FLUX ── */}
          {activeTab === 'media' && (
            <div className="space-y-6 font-mono text-xs">
              <div className="p-5 rounded-2xl bg-black border border-white/10 space-y-4">
                <div className="flex items-center gap-2 text-white font-bold">
                  <Music className="w-4 h-4 text-purple-400" />
                  <span>STORY SOUNDTRACK &amp; SPEECH AUDIO SUITE</span>
                </div>
                <p className="text-neutral-400">
                  Attach sovereign background audio tracks, anthems, or classical symphonies directly to stories and 60-second plenary speeches.
                </p>
                <div className="flex gap-3">
                  <button
                    type="button"
                    onClick={() => showToast('Attached Sovereign Anthem #01 to global stories wire!')}
                    className="px-4 py-2 rounded-xl bg-purple-500/20 hover:bg-purple-500/30 text-purple-300 border border-purple-500/40 font-bold transition"
                  >
                    Sync Global Story Anthem
                  </button>
                  <button
                    type="button"
                    onClick={() => showToast('Guillotine speaker clock reset across live plenary wire.')}
                    className="px-4 py-2 rounded-xl bg-cyan-500/20 hover:bg-cyan-500/30 text-cyan-300 border border-cyan-500/40 font-bold transition"
                  >
                    Reset Floor Relay Timer
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* ── 7. 25% CONSTITUTIONAL ESCROW & GRANTS ── */}
          {activeTab === 'escrow' && (
            <form onSubmit={handleSaveSiteOverrides} className="p-5 rounded-2xl bg-black border border-white/10 space-y-4 font-mono text-xs">
              <div className="flex items-center gap-2 text-emerald-300 font-bold">
                <Coins className="w-4 h-4 text-emerald-400" />
                <span>CONSTITUTIONAL 25% PROFIT ENDOWMENT &amp; RADICAL ACCOUNTABILITY</span>
              </div>
              <p className="text-neutral-400">
                Mandatory 25% allocation of all net platform profits distributed every 4 months directly to student scholarships and rural school labs—verified with offline giveaway videos on ZEN.FLUX and public receipts.
              </p>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
                <div className="space-y-1">
                  <label className="text-[11px] text-neutral-400 uppercase">Escrow Gross Allocation ({escrowPercentage}%)</label>
                  <input
                    type="number"
                    min="1"
                    max="100"
                    value={escrowPercentage}
                    onChange={(e) => setEscrowPercentage(Number(e.target.value))}
                    className="w-full px-4 py-2.5 rounded-xl bg-[#090b14] border border-white/20 text-white focus:outline-none focus:border-emerald-400"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-[11px] text-neutral-400 uppercase">Live Diplomatic Ticker</label>
                  <input
                    type="text"
                    value={tickerText}
                    onChange={(e) => setTickerText(e.target.value)}
                    className="w-full px-4 py-2.5 rounded-xl bg-[#090b14] border border-white/20 text-white focus:outline-none focus:border-emerald-400"
                  />
                </div>
              </div>

              <div className="flex justify-end pt-2">
                <button
                  type="submit"
                  className="px-6 py-2.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-black font-bold transition cursor-pointer"
                >
                  Save Escrow &amp; Ticker
                </button>
              </div>
            </form>
          )}

          {/* ── 8. ROOT CLI TERMINAL ── */}
          {activeTab === 'terminal' && (
            <div className="p-5 rounded-2xl bg-black border border-white/15 space-y-4 font-mono text-xs">
              <div className="flex items-center justify-between border-b border-white/10 pb-3">
                <div className="flex items-center gap-2 text-white font-bold">
                  <Terminal className="w-4 h-4 text-emerald-400" />
                  <span>INTERACTIVE SOVEREIGN ROOT CLI</span>
                </div>
                <button
                  type="button"
                  onClick={() => {
                    if (typeof window !== 'undefined') {
                      try { sessionStorage.removeItem('zenvitra_omni_cli_logs'); } catch (_) {}
                    }
                    setTerminalLogs([{ text: 'Buffer cleared.', type: 'info' }]);
                  }}
                  className="text-neutral-400 hover:text-white transition"
                >
                  Clear Buffer
                </button>
              </div>

              <div className="p-4 rounded-xl bg-[#040508] border border-white/10 h-64 overflow-y-auto space-y-1">
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

              <form onSubmit={handleTerminalSubmit} className="flex gap-2">
                <span className="py-2.5 text-emerald-400 font-bold select-none">root@zenvitra:~$</span>
                <input
                  type="text"
                  value={terminalInput}
                  onChange={(e) => setTerminalInput(e.target.value)}
                  placeholder="Type a command e.g. status, help, freeze, resume, faucet, promote..."
                  className="flex-1 px-4 py-2.5 rounded-xl bg-[#090b14] border border-white/20 text-white focus:outline-none focus:border-emerald-400"
                />
                <button
                  type="submit"
                  className="px-5 py-2.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-black font-bold transition"
                >
                  Execute
                </button>
              </form>
            </div>
          )}

          {/* ── 9. PROTOCOL KILLSWITCHES & CITADEL ── */}
          {activeTab === 'protocol' && (
            <div className="space-y-4 font-mono text-xs">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {[
                  { key: 'chatMeshEnabled', label: 'ZenChat Sovereign Mesh', desc: 'Enable E2EE private & group rooms' },
                  { key: 'fluxReelsEnabled', label: 'ZEN.FLUX Vertical Video Wire', desc: 'Enable 9:16 vertical video feed' },
                  { key: 'registrationsOpen', label: 'Open Public Registrations', desc: 'Allow new accounts on platform' },
                  { key: 'assemblyOsEnabled', label: 'Assembly OS & Live Voting', desc: 'Enable parliamentary caucus engine' },
                  { key: 'escrowMandateActive', label: 'Constitutional 25% Profit Endowment', desc: 'Disburse 25% profits every 4 months with video proof' },
                  { key: 'zeroSurveillanceActive', label: 'Zero Surveillance Enforcement', desc: 'Block tracking scripts & ads' },
                  { key: 'maintenanceMode', label: 'Protocol Omega (Citadel Lockout)', desc: 'Put entire platform into read-only' },
                ].map((item) => {
                  const k = item.key as keyof ProtocolControls;
                  const isOn = protocols[k];
                  return (
                    <div
                      key={item.key}
                      className="p-4 rounded-2xl bg-black border border-white/10 flex items-center justify-between gap-4"
                    >
                      <div className="space-y-0.5">
                        <p className="font-bold text-white">{item.label}</p>
                        <p className="text-[11px] text-neutral-400">{item.desc}</p>
                      </div>
                      <button
                        type="button"
                        onClick={() => handleToggleProtocol(k)}
                        className={`px-4 py-2 rounded-xl font-bold transition cursor-pointer ${
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

          {/* ── 10. AUDIT LEDGER ── */}
          {activeTab === 'audit' && (
            <div className="p-5 rounded-2xl bg-black border border-white/10 space-y-4 font-mono text-xs">
              <div className="flex items-center justify-between border-b border-white/10 pb-3">
                <span className="font-bold text-neutral-400 uppercase">
                  CRYPTOGRAPHIC TRANSACTION &amp; MUTATION LEDGER
                </span>
                <button
                  type="button"
                  onClick={handleExportDatabaseJSON}
                  className="px-3 py-1 rounded-xl bg-white/10 hover:bg-white/20 text-white transition flex items-center gap-1.5"
                >
                  <Download className="w-3.5 h-3.5" />
                  <span>Download Ledger</span>
                </button>
              </div>

              <div className="space-y-2 max-h-72 overflow-y-auto pr-1">
                {getAuditLogs().map((log) => (
                  <div
                    key={log.id}
                    className="p-3 rounded-xl bg-[#090b14] border border-white/10 flex items-center justify-between"
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
      </div>
    </div>
  );
}
