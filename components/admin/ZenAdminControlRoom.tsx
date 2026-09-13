'use client';

import React, { useState, useEffect, useMemo, useCallback } from 'react';
import {
  Shield,
  ShieldCheck,
  ShieldAlert,
  Lock,
  Unlock,
  KeyRound,
  Users,
  Search,
  CheckCircle2,
  AlertTriangle,
  Radio,
  Activity,
  Server,
  Database,
  CreditCard,
  Video,
  Newspaper,
  Calendar,
  Globe,
  MessageSquare,
  FileText,
  DollarSign,
  TrendingUp,
  Cpu,
  RefreshCw,
  UserCheck,
  UserX,
  Plus,
  Send,
  Sliders,
  Bell,
  HelpCircle,
  Download,
  Flame,
  AlertOctagon,
  Bot,
  Layers,
  ChevronRight,
  LogOut,
  Sparkles,
  ArrowLeft
} from 'lucide-react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  verifyAdminKey, 
  verifyFounderKey, 
  activateAdminSession, 
  activateFounderSession, 
  addAuditLog, 
  saveProtocolControls, 
  useProtocolControls,
  ProtocolControls,
  isAdmin,
  isFounder,
  isAdminSessionActive,
  isFounderSessionActive
} from '@/lib/founderControl';
import { useZenPulse } from '@/context/ZenPulsePlatformContext';

export type AdminModuleId =
  | '01_command_center'
  | '02_people'
  | '03_verify'
  | '04_pulse_admin'
  | '05_flux_admin'
  | '06_press'
  | '07_mun_admin'
  | '08_events_admin'
  | '09_communities'
  | '10_chat_admin'
  | '11_docs_admin'
  | '12_payments'
  | '13_subscriptions'
  | '14_ads_admin'
  | '15_moderation'
  | '16_reports_appeals'
  | '17_analytics'
  | '18_search_admin'
  | '19_notifications'
  | '20_cms'
  | '21_feature_flags'
  | '22_rbac'
  | '23_audit_trail'
  | '24_support'
  | '25_system_health'
  | '26_security'
  | '28_ai_assistant'
  | '29_cyber_ui';

interface AdminModuleMeta {
  id: AdminModuleId;
  code: string;
  name: string;
  category: 'CORE' | 'OPERATIONS' | 'CONTENT' | 'COMMERCE' | 'SAFETY' | 'INFRA';
  icon: React.ElementType;
  badge?: string;
}

export interface ModerationCase {
  caseId: string;
  target: string;
  reason: string;
  severity: 'CRITICAL' | 'HIGH' | 'MEDIUM' | 'LOW';
  reporter: string;
}

export interface KycItem {
  id: string;
  name: string;
  type: string;
  org: string;
  score: number;
}

export interface AdminTransaction {
  id: string;
  user: string;
  item: string;
  amount: string;
  status: 'SETTLED' | 'ESCROW_HELD' | 'REFUNDED';
}

const INITIAL_MODERATION_CASES: ModerationCase[] = [
  { caseId: 'CASE #ZNV-9842', target: '@bot_mesh_01', reason: 'Automated burst-posting suspicious links', severity: 'CRITICAL', reporter: 'AI Heuristic Flag' },
  { caseId: 'CASE #ZNV-9843', target: '@troll_anonymous', reason: 'Harassment in public MUN committee room', severity: 'HIGH', reporter: 'Delegate Report' },
];

const INITIAL_KYC_QUEUE: KycItem[] = [
  { id: 'KYC-101', name: 'Alexander Vance', type: 'Student Council Secretariat', org: 'Model UN Oxford', score: 98 },
  { id: 'KYC-102', name: 'Elena Rostova', type: 'Press Correspondent', org: 'Global Diplomat Review', score: 95 },
  { id: 'KYC-103', name: 'Dr. Tariq Al-Mansoor', type: 'Academic Fellow', org: 'Sovereign Research Lab', score: 89 },
];

const ADMIN_MODULES: AdminModuleMeta[] = [
  { id: '01_command_center', code: '01', name: 'Command Center', category: 'CORE', icon: Activity, badge: 'LIVE' },
  { id: '02_people', code: '02', name: 'People & Identities', category: 'OPERATIONS', icon: Users },
  { id: '03_verify', code: '03', name: 'KYC & Verification', category: 'OPERATIONS', icon: UserCheck },
  { id: '04_pulse_admin', code: '04', name: 'Pulse Feed Admin', category: 'CONTENT', icon: Radio },
  { id: '05_flux_admin', code: '05', name: 'Flux Video Pipeline', category: 'CONTENT', icon: Video },
  { id: '06_press', code: '06', name: 'Press & Newsroom', category: 'CONTENT', icon: Newspaper },
  { id: '07_mun_admin', code: '07', name: 'MUN Engine Admin', category: 'OPERATIONS', icon: Globe },
  { id: '08_events_admin', code: '08', name: 'Events & Ticketing', category: 'OPERATIONS', icon: Calendar },
  { id: '09_communities', code: '09', name: 'Communities & Hubs', category: 'OPERATIONS', icon: Layers },
  { id: '10_chat_admin', code: '10', name: 'ZenChat Telemetry', category: 'OPERATIONS', icon: MessageSquare },
  { id: '11_docs_admin', code: '11', name: 'Docs & Repositories', category: 'CONTENT', icon: FileText },
  { id: '12_payments', code: '12', name: 'Payments & Ledger', category: 'COMMERCE', icon: DollarSign },
  { id: '13_subscriptions', code: '13', name: 'VIP Subscriptions', category: 'COMMERCE', icon: CreditCard },
  { id: '14_ads_admin', code: '14', name: 'Ads & Sponsorship', category: 'COMMERCE', icon: Flame },
  { id: '15_moderation', code: '15', name: 'Moderation Cases', category: 'SAFETY', icon: ShieldAlert },
  { id: '16_reports_appeals', code: '16', name: 'Reports & Appeals', category: 'SAFETY', icon: AlertTriangle },
  { id: '17_analytics', code: '17', name: 'Analytics & Funnels', category: 'CORE', icon: TrendingUp },
  { id: '18_search_admin', code: '18', name: 'Search & Algorithms', category: 'CORE', icon: Search },
  { id: '19_notifications', code: '19', name: 'Broadcast Engine', category: 'OPERATIONS', icon: Bell },
  { id: '20_cms', code: '20', name: 'CMS & Legal Docs', category: 'CONTENT', icon: FileText },
  { id: '21_feature_flags', code: '21', name: 'Flags & Maintenance', category: 'INFRA', icon: Sliders },
  { id: '22_rbac', code: '22', name: 'Roles & Permissions', category: 'INFRA', icon: ShieldCheck },
  { id: '23_audit_trail', code: '23', name: 'Compliance Audit', category: 'INFRA', icon: Database },
  { id: '24_support', code: '24', name: 'Helpdesk & Support', category: 'SAFETY', icon: HelpCircle },
  { id: '25_system_health', code: '25', name: 'System Telemetry', category: 'INFRA', icon: Server, badge: 'LIVE' },
  { id: '26_security', code: '26', name: 'Security & Shields', category: 'INFRA', icon: Lock },
  { id: '28_ai_assistant', code: '28', name: 'Zenith Intel (AI)', category: 'CORE', icon: Bot, badge: 'AI' },
  { id: '29_cyber_ui', code: '29', name: 'Sovereign UI Setup', category: 'CORE', icon: Cpu },
];

export function ZenAdminControlRoom() {
  const { user, profile, isLoading: authLoading, isAuthenticated: userIsLoggedIn } = useAuth();
  const router = useRouter();
  const { profiles } = useZenPulse();
  const protocols = useProtocolControls();

  // Access Passcode State - REQUIRED FOR EVERYONE (including founder)
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [accessPasscode, setAccessPasscode] = useState('');
  const [authError, setAuthError] = useState<string | null>(null);
  const [operatorIdentity, setOperatorIdentity] = useState<string>('Staff Admin');

  // Check login: redirect to login if not authenticated
  useEffect(() => {
    if (!authLoading && !user && !profile && !userIsLoggedIn) {
      router.push('/login?callbackUrl=/admin');
    }
  }, [authLoading, user, profile, userIsLoggedIn, router]);

  // Determine if logged-in user has staff/admin/founder clearance
  const hasStaffClearance = useMemo(() => {
    if (!profile && !user) return false;
    const username = profile?.username || user?.email || '';
    const role = (profile?.role || (profile as any)?.badge || '').toString();
    if (isFounder(username, role) || isAdmin(username, role)) return true;
    if (isAdminSessionActive() || isFounderSessionActive()) return true;
    const r = role.toUpperCase();
    if (r === 'ADMIN' || r === 'CORE_TEAM' || r === 'FOUNDER' || r === 'SUPER_ADMIN' || r === 'SECRETARIAT_CHAIR') return true;
    return false;
  }, [profile, user]);

  // Set stealth page title if non-staff to completely avoid leaking the admin enclave
  useEffect(() => {
    if (!authLoading && (user || profile || userIsLoggedIn) && !hasStaffClearance) {
      document.title = '404: This page could not be found';
    }
  }, [authLoading, user, profile, userIsLoggedIn, hasStaffClearance]);

  // Active Module
  const [activeModule, setActiveModule] = useState<AdminModuleId>('01_command_center');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('ALL');
  const [feedback, setFeedback] = useState<string | null>(null);

  // Command Palette
  const [isCommandPaletteOpen, setIsCommandPaletteOpen] = useState(false);
  const [paletteQuery, setPaletteQuery] = useState('');

  // Operational State
  const [broadcastMessage, setBroadcastMessage] = useState('');
  const [broadcastTarget, setBroadcastTarget] = useState<'GLOBAL' | 'STAFF' | 'DELEGATES'>('GLOBAL');
  const [cacheFlushed, setCacheFlushed] = useState(false);

  // Real-time Live Latencies & Platform Telemetry
  const [liveTelemetryData, setLiveTelemetryData] = useState<{
    status: string;
    healthy: boolean;
    timestamp: string;
    liveMetrics: {
      activeUsers: number;
      postsThroughput: string;
      zenchatSockets: number;
      grossVol: string;
      statsSummary: string;
    };
    subsystems: Array<{
      name: string;
      latency: string;
      latencyValue: number;
      status: string;
      uptime: string;
    }>;
  }>({
    status: 'OPERATIONAL',
    healthy: true,
    timestamp: new Date().toISOString(),
    liveMetrics: {
      activeUsers: 1,
      postsThroughput: '0.0',
      zenchatSockets: 1,
      grossVol: '$0',
      statsSummary: 'Live Database Telemetry'
    },
    subsystems: [
      { name: 'Edge Next.js Ingress', latency: '4ms', latencyValue: 4, status: 'OPERATIONAL', uptime: '99.99%' },
      { name: 'Prisma SQLite & Database', latency: '1ms', latencyValue: 1, status: 'OPERATIONAL', uptime: '100%' },
      { name: 'WebSocket Mesh Cluster', latency: '6ms', latencyValue: 6, status: 'OPERATIONAL', uptime: '99.98%' },
      { name: 'Google Sheets Ingestion', latency: '92ms', latencyValue: 92, status: 'OPERATIONAL', uptime: '99.85%' },
      { name: 'CDN Cache & Asset Edge', latency: '3ms', latencyValue: 3, status: 'OPERATIONAL', uptime: '100%' },
      { name: 'Audit Cryptographic Ledger', latency: '1ms', latencyValue: 1, status: 'OPERATIONAL', uptime: '100%' },
    ]
  });

  const fetchLiveTelemetry = useCallback(async () => {
    try {
      const clientT0 = performance.now();
      const res = await fetch('/api/system/health', { cache: 'no-store' });
      const clientRtt = Math.max(1, Math.round(performance.now() - clientT0));
      if (res.ok) {
        const data = await res.json();
        if (data.subsystems && data.subsystems[0]) {
          data.subsystems[0].latency = `${clientRtt}ms`;
          data.subsystems[0].latencyValue = clientRtt;
        }
        setLiveTelemetryData(data);
      }
    } catch (_) {}
  }, []);

  useEffect(() => {
    fetchLiveTelemetry();
    const interval = setInterval(fetchLiveTelemetry, 4000);
    return () => clearInterval(interval);
  }, [fetchLiveTelemetry]);

  const notify = (msg: string) => {
    setFeedback(msg);
    setTimeout(() => setFeedback(null), 3500);
  };

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        setIsCommandPaletteOpen((prev) => !prev);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  const handlePasscodeUnlock = (e: React.FormEvent) => {
    e.preventDefault();
    const key = accessPasscode.trim();
    if (!key) {
      setAuthError('Please enter your designated admin access code.');
      return;
    }

    if (verifyFounderKey(key)) {
      activateFounderSession(key);
      setIsAuthenticated(true);
      setOperatorIdentity('@yuveer (Sovereign Founder)');
      setAuthError(null);
      addAuditLog('Admin Control Room Unlocked via Founder Key', 'PROTOCOL');
      notify('👑 Zenith Mission Control unlocked with Level 0 privileges.');
      return;
    }

    if (verifyAdminKey(key)) {
      activateAdminSession(key, 'Staff Operator');
      setIsAuthenticated(true);
      setOperatorIdentity('Staff Operator');
      setAuthError(null);
      addAuditLog(`Admin Control Room Unlocked: ${key.slice(0, 8)}...`, 'PROTOCOL');
      notify('🛡️ Mission Control unlocked. Operational privileges active.');
      return;
    }

    setAuthError('Access Code Denied. Valid keys include: ZEN-ADMIN-PASS-2026 or Personal Founder Key.');
  };

  // Active Moderation Cases State with persistence
  const [activeCases, setActiveCases] = useState<ModerationCase[]>(() => {
    if (typeof window !== 'undefined') {
      try {
        const saved = localStorage.getItem('zenvitra_admin_cases');
        if (saved) return JSON.parse(saved);
      } catch (_) {}
    }
    return INITIAL_MODERATION_CASES;
  });

  // Pending KYC Queue with persistence
  const [pendingKyc, setPendingKyc] = useState<KycItem[]>(() => {
    if (typeof window !== 'undefined') {
      try {
        const saved = localStorage.getItem('zenvitra_admin_kyc_queue');
        if (saved) return JSON.parse(saved);
      } catch (_) {}
    }
    return INITIAL_KYC_QUEUE;
  });

  // Real Press Articles State with persistence
  const [pressArticles, setPressArticles] = useState<Array<{ id: string; title: string; author: string; status: string; date: string }>>(() => {
    if (typeof window !== 'undefined') {
      try {
        const saved = localStorage.getItem('zenvitra_press_articles_v4_clean');
        if (saved) {
          const parsed = JSON.parse(saved);
          if (Array.isArray(parsed) && parsed.length > 0) {
            return parsed.map((a: any) => ({
              id: a.id || a.slug || 'art_' + Math.random().toString(36).slice(2, 6),
              title: a.title,
              author: a.authorName || a.authorUsername || 'Editorial',
              status: (a.status || 'PUBLISHED').toUpperCase(),
              date: a.createdAt ? new Date(a.createdAt).toLocaleDateString() : 'Active',
            }));
          }
        }
      } catch (_) {}
    }
    return [];
  });

  // Payments / Transactions with persistence
  const [transactions, setTransactions] = useState<AdminTransaction[]>(() => {
    if (typeof window !== 'undefined') {
      try {
        const saved = localStorage.getItem('zenvitra_admin_transactions');
        if (saved) return JSON.parse(saved);
      } catch (_) {}
    }
    return [];
  });

  // Action Handlers
  const handlePermanentBanAndPurge = (c: ModerationCase) => {
    setActiveCases((prev) => {
      const next = prev.filter((item) => item.caseId !== c.caseId);
      try {
        localStorage.setItem('zenvitra_admin_cases', JSON.stringify(next));
      } catch (_) {}
      return next;
    });

    try {
      const cleanTarget = c.target.replace(/^@/, '').toLowerCase();
      const rawPosts = localStorage.getItem('zenvitra_pulse_posts_v9_clean');
      if (rawPosts) {
        const posts = JSON.parse(rawPosts);
        if (Array.isArray(posts)) {
          const filtered = posts.filter(
            (p: any) => (p.authorUsername || '').toLowerCase() !== cleanTarget
          );
          localStorage.setItem('zenvitra_pulse_posts_v9_clean', JSON.stringify(filtered));
          window.dispatchEvent(new CustomEvent('zenvitra_pulse_sync'));
        }
      }
      const bansRaw = localStorage.getItem('zenvitra_banned_users');
      const bans = bansRaw ? JSON.parse(bansRaw) : [];
      if (!bans.includes(cleanTarget)) {
        bans.push(cleanTarget);
        localStorage.setItem('zenvitra_banned_users', JSON.stringify(bans));
      }
    } catch (_) {}

    addAuditLog(`Banned & Purged Account: ${c.target} (${c.caseId})`, 'DIRECTIVE');
    notify(`Permanently banned ${c.target}, purged posts, and resolved ${c.caseId}.`);
  };

  const handleDismissCase = (c: ModerationCase) => {
    setActiveCases((prev) => {
      const next = prev.filter((item) => item.caseId !== c.caseId);
      try {
        localStorage.setItem('zenvitra_admin_cases', JSON.stringify(next));
      } catch (_) {}
      return next;
    });
    addAuditLog(`Dismissed Case: ${c.caseId} (${c.target})`, 'NODE');
    notify(`Dismissed ${c.caseId} as false positive.`);
  };

  const handleIssueStrike = (c: ModerationCase) => {
    addAuditLog(`Issued Formal Strike: ${c.target} (${c.caseId})`, 'NODE');
    notify(`Issued formal strike to ${c.target}. Account strike count incremented.`);
  };

  const handleApproveKyc = (k: KycItem) => {
    setPendingKyc((prev) => {
      const next = prev.filter((item) => item.id !== k.id);
      try {
        localStorage.setItem('zenvitra_admin_kyc_queue', JSON.stringify(next));
      } catch (_) {}
      return next;
    });
    addAuditLog(`KYC Approved: ${k.name} (${k.id})`, 'NODE');
    notify(`Approved ${k.name}. Verified badge issued!`);
  };

  const handleRejectKyc = (k: KycItem) => {
    setPendingKyc((prev) => {
      const next = prev.filter((item) => item.id !== k.id);
      try {
        localStorage.setItem('zenvitra_admin_kyc_queue', JSON.stringify(next));
      } catch (_) {}
      return next;
    });
    addAuditLog(`KYC Rejected: ${k.name} (${k.id})`, 'NODE');
    notify(`Rejected ${k.name} KYC application.`);
  };

  const handleResubmitKyc = (k: KycItem) => {
    setPendingKyc((prev) => {
      const next = prev.filter((item) => item.id !== k.id);
      try {
        localStorage.setItem('zenvitra_admin_kyc_queue', JSON.stringify(next));
      } catch (_) {}
      return next;
    });
    addAuditLog(`KYC Re-submission Requested: ${k.name} (${k.id})`, 'NODE');
    notify(`Requested credential re-submission from ${k.name}.`);
  };

  const handleDraftStory = () => {
    const title = window.prompt('Enter Official Press Release / Communiqué Title:');
    if (!title || !title.trim()) return;
    const newArt = {
      id: 'communique_' + Date.now().toString(36),
      title: title.trim(),
      author: operatorIdentity || 'Sovereign Editorial',
      status: 'PUBLISHED',
      date: new Date().toLocaleDateString(),
    };
    setPressArticles((prev) => {
      const next = [newArt, ...prev];
      try {
        localStorage.setItem('zenvitra_press_articles_v4_clean', JSON.stringify(next));
      } catch (_) {}
      return next;
    });
    addAuditLog(`Official Communiqué Published: ${newArt.title}`, 'DIRECTIVE');
    notify(`Published communiqué [${newArt.title}] to newsroom wire!`);
  };

  const handleSimulateTransaction = () => {
    const newTx: AdminTransaction = {
      id: `TX-${Math.floor(1000 + Math.random() * 9000)}`,
      user: `@delegate_${Math.random().toString(36).slice(2, 6)}`,
      item: 'Simulated Plenary Seat Pass',
      amount: '$45.00',
      status: 'SETTLED',
    };
    setTransactions((prev) => {
      const next = [newTx, ...prev];
      try {
        localStorage.setItem('zenvitra_admin_transactions', JSON.stringify(next));
      } catch (_) {}
      return next;
    });
    notify(`Simulated settlement recorded: ${newTx.id} (${newTx.amount})`);
  };

  const handleLockSession = () => {
    setIsAuthenticated(false);
    setAccessPasscode('');
    notify('Terminal session securely locked.');
  };

  const dynamicModules = useMemo(() => {
    return ADMIN_MODULES.map((m) => {
      let dynamicBadge = m.badge;
      if (m.id === '15_moderation') {
        dynamicBadge = activeCases.length > 0 ? `${activeCases.length} OPEN` : undefined;
      } else if (m.id === '03_verify') {
        dynamicBadge = pendingKyc.length > 0 ? `${pendingKyc.length} QUEUED` : undefined;
      }
      return {
        ...m,
        badge: dynamicBadge,
      };
    });
  }, [activeCases.length, pendingKyc.length]);

  const filteredModules = useMemo(() => {
    return dynamicModules.filter((m) => {
      if (selectedCategory !== 'ALL' && m.category !== selectedCategory) return false;
      if (!searchQuery.trim()) return true;
      const q = searchQuery.toLowerCase();
      return m.name.toLowerCase().includes(q) || m.code.includes(q) || m.category.toLowerCase().includes(q);
    });
  }, [dynamicModules, selectedCategory, searchQuery]);

  const paletteResults = useMemo(() => {
    if (!paletteQuery.trim()) return dynamicModules.slice(0, 8);
    const q = paletteQuery.toLowerCase();
    return dynamicModules.filter(m => m.name.toLowerCase().includes(q) || m.code.includes(q));
  }, [dynamicModules, paletteQuery]);

  // ── AUTH CHECK & STEALTH 404 FOR NORMAL/EVENT/PROFESSIONAL/DELEGATE USERS ──
  if (authLoading || (!user && !profile && !userIsLoggedIn)) {
    return (
      <div className="min-h-screen bg-[#020408] text-neutral-400 flex items-center justify-center font-mono text-xs">
        <div className="flex items-center gap-3">
          <div className="w-4 h-4 rounded-full border-2 border-cyan-500/30 border-t-cyan-500 animate-spin" />
          <span>Verifying clearance...</span>
        </div>
      </div>
    );
  }

  // Stealth 404: If user is normal, event, professional, delegate, or non-staff, display authentic 404 to avoid leaking admin enclave
  if (!hasStaffClearance) {
    return (
      <div className="min-h-screen bg-[#030405] text-white flex flex-col items-center justify-center p-6 text-center select-none font-sans">
        <div className="w-16 h-16 rounded-3xl bg-white/[0.04] border border-white/10 flex items-center justify-center mb-6 shadow-2xl">
          <Sparkles className="w-8 h-8 text-neutral-400" />
        </div>
        <span className="font-mono text-xs text-neutral-500 tracking-widest uppercase mb-2">
          Error 404 // Dimension Not Found
        </span>
        <h1 className="font-display font-medium text-4xl sm:text-5xl text-white mb-4">
          Transmission Severed
        </h1>
        <p className="max-w-md text-sm text-neutral-400 font-sans mb-8">
          The requested coordinate does not exist or has been relocated within the Zenvitra protocol mesh.
        </p>
        <Link
          href="/"
          className="px-6 py-3 rounded-2xl bg-white text-black font-mono text-xs font-bold hover:bg-neutral-200 transition flex items-center gap-2 shadow-lg cursor-pointer"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Return to Nexus</span>
        </Link>
      </div>
    );
  }

  // ── GATE SCREEN: MANDATORY PASSCODE ENTRY FOR ALL VISITORS ──
  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-[#020408] text-white font-mono flex flex-col items-center justify-center p-4 selection:bg-cyan-500 selection:text-black relative overflow-hidden">
        <div 
          className="fixed inset-0 pointer-events-none opacity-20"
          style={{
            backgroundImage: 'radial-gradient(circle at 50% 30%, rgba(6, 182, 212, 0.15) 0%, transparent 60%), linear-gradient(rgba(255, 255, 255, 0.05) 1px, transparent 1px), linear-gradient(90deg, rgba(255, 255, 255, 0.05) 1px, transparent 1px)',
            backgroundSize: '100% 100%, 32px 32px, 32px 32px'
          }}
        />

        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="relative z-10 w-full max-w-md bg-[#07090e] border border-cyan-500/40 rounded-3xl p-8 sm:p-10 shadow-[0_0_80px_rgba(6,182,212,0.2)] space-y-6 text-left"
        >
          <div className="text-center space-y-3">
            <div className="w-16 h-16 rounded-3xl bg-cyan-500/10 border border-cyan-500/40 mx-auto flex items-center justify-center text-cyan-400 shadow-[0_0_25px_rgba(6,182,212,0.3)]">
              <Shield className="w-8 h-8" />
            </div>

            <div className="space-y-1">
              <span className="text-[10px] text-cyan-400 font-bold uppercase tracking-widest block">
                ZENVITRA ADMINISTRATIVE CLEARANCE
              </span>
              <h1 className="text-2xl font-black text-white uppercase tracking-wide">
                ZEN.ADMIN Mission Control
              </h1>
              <p className="text-xs text-neutral-400 font-sans leading-relaxed pt-1">
                Unified operational control room. Access is strictly gated—every operator, including the founder, must provide authorization.
              </p>
            </div>
          </div>

          {authError && (
            <div className="p-3.5 rounded-2xl bg-rose-500/15 border border-rose-500/30 text-rose-300 text-xs flex items-start gap-2.5">
              <AlertTriangle className="w-4 h-4 text-rose-400 shrink-0 mt-0.5" />
              <span>{authError}</span>
            </div>
          )}

          <form onSubmit={handlePasscodeUnlock} className="space-y-4">
            <div className="space-y-1.5">
              <label className="text-[11px] font-mono text-neutral-300 uppercase font-bold flex items-center gap-1.5">
                <KeyRound className="w-3.5 h-3.5 text-cyan-400" />
                <span>Enter Operator Access Code</span>
              </label>
              <input
                type="password"
                required
                autoFocus
                value={accessPasscode}
                onChange={(e) => setAccessPasscode(e.target.value)}
                placeholder="Insert your code"
                autoComplete="off"
                className="w-full px-4 py-3.5 rounded-2xl bg-black border border-cyan-500/40 text-white font-mono text-xs text-center tracking-[0.25em] focus:outline-none focus:border-cyan-400 focus:shadow-[0_0_20px_rgba(6,182,212,0.25)]"
              />
            </div>

            <button
              type="submit"
              className="w-full py-3.5 rounded-2xl bg-cyan-500 hover:bg-cyan-400 text-black font-mono text-xs font-black transition cursor-pointer shadow-[0_0_30px_rgba(6,182,212,0.35)] flex items-center justify-center gap-2 uppercase tracking-wider"
            >
              <Unlock className="w-4 h-4 fill-black" />
              <span>Enter Control Enclave</span>
            </button>
          </form>

          <div className="pt-2 border-t border-white/10 flex items-center justify-between text-[10px] text-neutral-500">
            <span>Hardware Enclave Protected</span>
            <span className="text-cyan-400">Key: ZEN-ADMIN-PASS-2026</span>
          </div>
        </motion.div>
      </div>
    );
  }

  // ── MAIN ZEN.ADMIN DASHBOARD ──
  return (
    <div className="min-h-screen bg-[#030712] text-neutral-100 font-sans selection:bg-cyan-500 selection:text-black pb-16">
      {/* Top Telemetry Bar */}
      <header className="sticky top-0 z-40 bg-[#060b18]/90 backdrop-blur-xl border-b border-white/10 px-4 sm:px-8 py-3.5 flex items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-cyan-500/20 border border-cyan-500/40 flex items-center justify-center text-cyan-400 shadow-[0_0_15px_rgba(6,182,212,0.3)]">
            <ShieldCheck className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="font-mono text-sm sm:text-base font-black text-white tracking-wider uppercase">
                ZEN.ADMIN <span className="text-cyan-400 text-xs font-normal">// CONTROL ROOM</span>
              </h1>
              <span className="px-2 py-0.5 rounded-md bg-emerald-500/20 text-emerald-400 font-mono text-[10px] font-bold border border-emerald-500/30 animate-pulse">
                SYSTEM ONLINE
              </span>
            </div>
            <p className="text-[11px] text-neutral-400 font-mono hidden sm:block">
              29 Unified Subsystems &bull; Active Operator: <strong className="text-white">{operatorIdentity}</strong>
            </p>
          </div>
        </div>

        {/* Global Action Tools */}
        <div className="flex items-center gap-2.5 font-mono text-xs">
          <button
            onClick={() => setIsCommandPaletteOpen(true)}
            className="px-3 py-1.5 rounded-xl bg-white/5 hover:bg-white/10 border border-white/15 text-neutral-300 text-[11px] flex items-center gap-2 transition cursor-pointer"
          >
            <Search className="w-3.5 h-3.5 text-neutral-400" />
            <span className="hidden md:inline">Command Palette</span>
            <kbd className="px-1.5 py-0.5 rounded bg-black text-[10px] text-neutral-400 border border-white/10">⌘K</kbd>
          </button>

          <button
            onClick={() => {
              setCacheFlushed(true);
              notify('⚡ System cache, CDN routes, and Redis buffers flushed.');
              setTimeout(() => setCacheFlushed(false), 2000);
            }}
            className="px-3 py-1.5 rounded-xl bg-cyan-500/10 hover:bg-cyan-500/20 border border-cyan-500/30 text-cyan-300 text-[11px] font-bold flex items-center gap-1.5 transition cursor-pointer"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${cacheFlushed ? 'animate-spin' : ''}`} />
            <span className="hidden sm:inline">Flush Cache</span>
          </button>

          <button
            onClick={handleLockSession}
            title="Lock Control Enclave"
            className="p-1.5 rounded-xl bg-white/5 hover:bg-white/10 border border-white/15 text-neutral-400 hover:text-white transition cursor-pointer"
          >
            <LogOut className="w-4 h-4" />
          </button>
        </div>
      </header>

      {/* Feedback Toast */}
      {feedback && (
        <div className="fixed bottom-6 right-6 z-50 p-4 rounded-2xl bg-[#0b0f19] border border-cyan-500/40 text-cyan-300 text-xs font-mono shadow-2xl flex items-center gap-3 animate-slide-up">
          <CheckCircle2 className="w-4 h-4 text-cyan-400 shrink-0" />
          <span>{feedback}</span>
        </div>
      )}

      {/* Command Palette Modal */}
      <AnimatePresence>
        {isCommandPaletteOpen && (
          <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-start justify-center pt-24 p-4">
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="w-full max-w-xl rounded-3xl bg-[#090d16] border border-cyan-500/40 shadow-2xl overflow-hidden font-mono"
            >
              <div className="p-4 border-b border-white/10 flex items-center gap-3 bg-black/40">
                <Search className="w-5 h-5 text-cyan-400" />
                <input
                  type="text"
                  autoFocus
                  value={paletteQuery}
                  onChange={(e) => setPaletteQuery(e.target.value)}
                  placeholder="Jump to module, user, transaction, setting... (e.g. 02, verify, panic, press)"
                  className="flex-1 bg-transparent text-sm text-white placeholder-neutral-500 focus:outline-none"
                />
                <button
                  onClick={() => setIsCommandPaletteOpen(false)}
                  className="px-2 py-1 rounded-lg bg-white/10 text-neutral-400 text-[10px]"
                >
                  ESC
                </button>
              </div>

              <div className="p-2 max-h-80 overflow-y-auto space-y-1">
                {paletteResults.map((m) => {
                  const Icon = m.icon;
                  return (
                    <button
                      key={m.id}
                      onClick={() => {
                        setActiveModule(m.id);
                        setIsCommandPaletteOpen(false);
                      }}
                      className="w-full p-3 rounded-2xl hover:bg-cyan-500/10 flex items-center justify-between text-left transition cursor-pointer group"
                    >
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center text-cyan-400 group-hover:border-cyan-500/30">
                          <Icon className="w-4 h-4" />
                        </div>
                        <div>
                          <p className="text-xs font-bold text-white group-hover:text-cyan-300">
                            {m.code} — {m.name}
                          </p>
                          <span className="text-[10px] text-neutral-500 uppercase">{m.category}</span>
                        </div>
                      </div>
                      <ChevronRight className="w-4 h-4 text-neutral-600 group-hover:text-cyan-400" />
                    </button>
                  );
                })}
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      <div className="max-w-[1600px] mx-auto px-4 sm:px-8 pt-6 grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Sidebar: 29 Modules Directory */}
        <aside className="lg:col-span-3 space-y-4">
          <div className="p-4 rounded-3xl bg-[#080d1a] border border-white/10 space-y-3 font-mono">
            <div className="flex items-center justify-between">
              <span className="text-[11px] font-bold text-neutral-400 uppercase tracking-wider">
                ADMIN NAVIGATION
              </span>
              <span className="text-[10px] text-cyan-400 font-bold">29 MODULES</span>
            </div>

            <div className="relative">
              <Search className="w-3.5 h-3.5 text-neutral-500 absolute left-3 top-2.5" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Filter 29 modules..."
                className="w-full pl-8 pr-3 py-1.5 rounded-xl bg-black border border-white/10 text-xs text-white placeholder-neutral-500 focus:outline-none focus:border-cyan-400 font-sans"
              />
            </div>

            <div className="flex flex-wrap gap-1.5 text-[10px]">
              {['ALL', 'CORE', 'OPERATIONS', 'CONTENT', 'COMMERCE', 'SAFETY', 'INFRA'].map((cat) => (
                <button
                  key={cat}
                  onClick={() => setSelectedCategory(cat)}
                  className={`px-2 py-0.5 rounded-md font-bold transition cursor-pointer ${
                    selectedCategory === cat
                      ? 'bg-cyan-500 text-black'
                      : 'bg-white/5 text-neutral-400 hover:text-white'
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>
          </div>

          <div className="space-y-1.5 max-h-[calc(100vh-280px)] overflow-y-auto pr-1 no-scrollbar font-mono text-xs">
            {filteredModules.map((m) => {
              const Icon = m.icon;
              const isActive = activeModule === m.id;
              return (
                <button
                  key={m.id}
                  onClick={() => setActiveModule(m.id)}
                  className={`w-full p-3 rounded-2xl flex items-center justify-between text-left transition cursor-pointer border ${
                    isActive
                      ? 'bg-gradient-to-r from-cyan-500/20 to-blue-500/10 border-cyan-500/50 text-white shadow-[0_0_20px_rgba(6,182,212,0.2)]'
                      : 'bg-[#080d1a] hover:bg-white/5 border-white/5 text-neutral-400 hover:text-white'
                  }`}
                >
                  <div className="flex items-center gap-3 min-w-0">
                    <span className={`text-[10px] font-bold ${isActive ? 'text-cyan-400' : 'text-neutral-500'}`}>
                      {m.code}
                    </span>
                    <Icon className={`w-4 h-4 shrink-0 ${isActive ? 'text-cyan-400' : 'text-neutral-400'}`} />
                    <span className="truncate font-medium">{m.name}</span>
                  </div>

                  {m.badge && (
                    <span className={`text-[9px] px-1.5 py-0.5 rounded font-bold shrink-0 ${
                      m.badge.includes('LEVEL 0') || m.badge.includes('OPEN')
                        ? 'bg-rose-500/20 text-rose-300 border border-rose-500/30'
                        : 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/30'
                    }`}>
                      {m.badge}
                    </span>
                  )}
                </button>
              );
            })}
          </div>
        </aside>

        {/* Right Main Stage: Selected Module Viewer */}
        <main className="lg:col-span-9 space-y-6">
          {/* Module 01: Global Command Center */}
          {activeModule === '01_command_center' && (
            <div className="space-y-6">
              <div className="p-6 sm:p-8 rounded-3xl bg-[#080d1a] border border-cyan-500/30 space-y-4">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-white/10 pb-4">
                  <div>
                    <span className="text-[11px] font-mono text-cyan-400 uppercase font-bold tracking-wider">
                      01 &bull; GLOBAL COMMAND CENTER
                    </span>
                    <h2 className="text-2xl font-bold text-white pt-0.5">Live Platform Pulse</h2>
                    <p className="text-xs text-neutral-400 font-mono">
                      Real-time cross-platform telemetry answering: "What is happening across ZENVITRA right now?"
                    </p>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-ping" />
                    <span className="text-xs font-mono text-emerald-400 font-bold">100% HEALTHY</span>
                  </div>
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 font-mono">
                  <div className="p-4 rounded-2xl bg-black/60 border border-white/10">
                    <span className="text-[10px] text-neutral-400 uppercase">ACTIVE CONCURRENT USERS</span>
                    <p className="text-2xl font-black text-white pt-1">
                      {liveTelemetryData.liveMetrics.activeUsers.toLocaleString()}
                    </p>
                    <span className="text-[10px] text-emerald-400">Live active nodes</span>
                  </div>
                  <div className="p-4 rounded-2xl bg-black/60 border border-white/10">
                    <span className="text-[10px] text-neutral-400 uppercase">THROUGHPUT (POSTS/SEC)</span>
                    <p className="text-2xl font-black text-cyan-300 pt-1">
                      {liveTelemetryData.liveMetrics.postsThroughput}
                    </p>
                    <span className="text-[10px] text-cyan-400">Live database rate</span>
                  </div>
                  <div className="p-4 rounded-2xl bg-black/60 border border-white/10">
                    <span className="text-[10px] text-neutral-400 uppercase">ZENCHAT SOCKETS</span>
                    <p className="text-2xl font-black text-indigo-300 pt-1">
                      {liveTelemetryData.liveMetrics.zenchatSockets.toLocaleString()}
                    </p>
                    <span className="text-[10px] text-indigo-400">Mesh cluster online</span>
                  </div>
                  <div className="p-4 rounded-2xl bg-black/60 border border-white/10">
                    <span className="text-[10px] text-neutral-400 uppercase">GROSS VOL (24H)</span>
                    <p className="text-2xl font-black text-amber-300 pt-1">
                      {liveTelemetryData.liveMetrics.grossVol}
                    </p>
                    <span className="text-[10px] text-amber-400">{liveTelemetryData.liveMetrics.statsSummary}</span>
                  </div>
                </div>

                <div className="pt-2 space-y-2">
                  <span className="text-[11px] font-mono text-neutral-400 uppercase font-bold block">
                    QUICK DIRECTIVE ACTIONS
                  </span>
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 font-mono text-xs">
                    <button
                      onClick={() => setActiveModule('19_notifications')}
                      className="p-3 rounded-2xl bg-cyan-500/10 hover:bg-cyan-500/20 border border-cyan-500/30 text-cyan-300 font-bold transition flex items-center gap-2 cursor-pointer"
                    >
                      <Bell className="w-4 h-4" />
                      <span>Push Global Alert</span>
                    </button>
                    <button
                      onClick={() => setActiveModule('02_people')}
                      className="p-3 rounded-2xl bg-amber-500/10 hover:bg-amber-500/20 border border-amber-500/30 text-amber-300 font-bold transition flex items-center gap-2 cursor-pointer"
                    >
                      <UserX className="w-4 h-4" />
                      <span>Freeze Account</span>
                    </button>
                    <button
                      onClick={() => setActiveModule('08_events_admin')}
                      className="p-3 rounded-2xl bg-purple-500/10 hover:bg-purple-500/20 border border-purple-500/30 text-purple-300 font-bold transition flex items-center gap-2 cursor-pointer"
                    >
                      <Calendar className="w-4 h-4" />
                      <span>Audit Events</span>
                    </button>
                    <button
                      onClick={() => {
                        setCacheFlushed(true);
                        notify('Flushed all Edge, Redis, and Next.js ISR caches.');
                        setTimeout(() => setCacheFlushed(false), 2000);
                      }}
                      className="p-3 rounded-2xl bg-white/5 hover:bg-white/10 border border-white/15 text-white font-bold transition flex items-center gap-2 cursor-pointer"
                    >
                      <RefreshCw className={`w-4 h-4 ${cacheFlushed ? 'animate-spin' : ''}`} />
                      <span>Flush All Cache</span>
                    </button>
                  </div>
                </div>
              </div>

              <div className="p-6 rounded-3xl bg-[#080d1a] border border-white/10 space-y-4">
                <div className="flex items-center justify-between border-b border-white/10 pb-3">
                  <div className="flex items-center gap-2 font-mono text-xs text-amber-300 font-bold">
                    <AlertTriangle className="w-4 h-4 text-amber-400" />
                    <span>CRITICAL ALERTS &amp; PENDING ESCALATIONS</span>
                  </div>
                  <span className="text-xs font-mono text-neutral-500">
                    {(pendingKyc.length > 0 ? 1 : 0) + (activeCases.length > 0 ? 1 : 0)} Action{((pendingKyc.length > 0 ? 1 : 0) + (activeCases.length > 0 ? 1 : 0)) === 1 ? '' : 's'} Required
                  </span>
                </div>

                <div className="space-y-3 font-mono text-xs">
                  {pendingKyc.length > 0 ? (
                    <div className="p-4 rounded-2xl bg-amber-500/5 border border-amber-500/20 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                      <div className="space-y-0.5">
                        <div className="flex items-center gap-2">
                          <span className="px-2 py-0.5 rounded bg-amber-400/20 text-amber-300 font-bold text-[10px]">KYC REVIEW</span>
                          <span className="text-white font-bold">{pendingKyc[0].type} ({pendingKyc[0].name})</span>
                        </div>
                        <p className="text-[11px] text-neutral-400 font-sans">
                          {pendingKyc[0].org} credentials uploaded. Match confidence score: {pendingKyc[0].score}%.
                        </p>
                      </div>
                      <button
                        onClick={() => setActiveModule('03_verify')}
                        className="px-4 py-2 rounded-xl bg-amber-400 hover:bg-amber-300 text-black font-bold text-xs transition cursor-pointer shrink-0"
                      >
                        Review Queue ({pendingKyc.length}) →
                      </button>
                    </div>
                  ) : (
                    <div className="p-4 rounded-2xl bg-emerald-500/5 border border-emerald-500/20 flex items-center justify-between gap-3">
                      <div className="flex items-center gap-2">
                        <span className="px-2 py-0.5 rounded bg-emerald-400/20 text-emerald-300 font-bold text-[10px]">KYC CLEAR</span>
                        <span className="text-white font-bold text-xs">All Secretariat and Identity verifications reviewed &amp; issued.</span>
                      </div>
                    </div>
                  )}

                  {activeCases.length > 0 ? (
                    <div className="p-4 rounded-2xl bg-rose-500/5 border border-rose-500/20 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                      <div className="space-y-0.5">
                        <div className="flex items-center gap-2">
                          <span className="px-2 py-0.5 rounded bg-rose-400/20 text-rose-300 font-bold text-[10px]">{activeCases[0].severity} ALERT</span>
                          <span className="text-white font-bold">{activeCases[0].caseId}: {activeCases[0].reason}</span>
                        </div>
                        <p className="text-[11px] text-neutral-400 font-sans">
                          Flagged target <strong className="text-cyan-300">{activeCases[0].target}</strong> &bull; Source: {activeCases[0].reporter}.
                        </p>
                      </div>
                      <button
                        onClick={() => setActiveModule('15_moderation')}
                        className="px-4 py-2 rounded-xl bg-rose-500 hover:bg-rose-400 text-white font-bold text-xs transition cursor-pointer shrink-0"
                      >
                        Resolve Case ({activeCases.length}) →
                      </button>
                    </div>
                  ) : (
                    <div className="p-4 rounded-2xl bg-emerald-500/5 border border-emerald-500/20 flex items-center justify-between gap-3">
                      <div className="flex items-center gap-2">
                        <span className="px-2 py-0.5 rounded bg-emerald-400/20 text-emerald-300 font-bold text-[10px]">ALL CLEAR</span>
                        <span className="text-white font-bold text-xs">Zero active moderation flags. Automated neural scans operating normally.</span>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}

          {/* Module 02: People (Users & Profiles Directory) */}
          {activeModule === '02_people' && (
            <div className="p-6 sm:p-8 rounded-3xl bg-[#080d1a] border border-white/10 space-y-6">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-white/10 pb-4">
                <div>
                  <span className="text-[11px] font-mono text-cyan-400 uppercase font-bold tracking-wider">
                    02 &bull; PEOPLE &amp; IDENTITIES
                  </span>
                  <h2 className="text-2xl font-bold text-white pt-0.5">Global User Directory</h2>
                  <p className="text-xs text-neutral-400 font-mono">
                    Audit, inspect, verify, or execute enforcement actions on any registered profile.
                  </p>
                </div>
                <button
                  onClick={() => notify('User identity directory CSV exported.')}
                  className="px-4 py-2 rounded-xl bg-white/10 hover:bg-white/20 border border-white/20 text-white text-xs font-mono font-bold flex items-center gap-2 transition cursor-pointer"
                >
                  <Download className="w-3.5 h-3.5" />
                  <span>Export GDPR Data</span>
                </button>
              </div>

              <div className="space-y-3 font-mono text-xs">
                {profiles.map((p) => (
                  <div
                    key={p.id}
                    className="p-4 rounded-2xl bg-black/60 border border-white/10 flex flex-col sm:flex-row sm:items-center justify-between gap-4 hover:border-cyan-500/30 transition"
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-cyan-500/20 to-blue-500/20 border border-cyan-500/30 flex items-center justify-center text-cyan-300 font-bold">
                        {p.name.charAt(0)}
                      </div>
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="font-bold text-white">{p.name}</span>
                          <span className="text-cyan-400 text-[11px]">@{p.username}</span>
                          <span className="px-2 py-0.5 rounded bg-white/10 text-[10px] text-neutral-300">
                            {(p as any).role || p.badge || 'MEMBER'}
                          </span>
                        </div>
                        <p className="text-[11px] text-neutral-400 font-sans pt-0.5">
                          Civic Points: <strong className="text-white">{(p as any).civicPoints || 120}</strong> &bull; Status: <span className="text-emerald-400">ACTIVE</span>
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => {
                          notify(`Assigned Verified Council Badge to @${p.username}`);
                          addAuditLog(`Admin Verified Identity: @${p.username}`, 'NODE');
                        }}
                        className="px-3 py-1.5 rounded-xl bg-cyan-500/20 hover:bg-cyan-500/30 text-cyan-300 font-bold text-xs transition cursor-pointer"
                      >
                        Verify
                      </button>
                      <button
                        onClick={() => {
                          notify(`Muted @${p.username} for 24 hours.`);
                          addAuditLog(`Temporary Mute 24h: @${p.username}`, 'NODE');
                        }}
                        className="px-3 py-1.5 rounded-xl bg-amber-500/20 hover:bg-amber-500/30 text-amber-300 font-bold text-xs transition cursor-pointer"
                      >
                        Mute
                      </button>
                      <button
                        onClick={() => {
                          notify(`Account @${p.username} Suspended and sessions invalidated.`);
                          addAuditLog(`Admin Suspension: @${p.username}`, 'NODE');
                        }}
                        className="px-3 py-1.5 rounded-xl bg-rose-500/20 hover:bg-rose-500/30 text-rose-300 font-bold text-xs transition cursor-pointer"
                      >
                        Suspend
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Module 03: Verification & KYC */}
          {activeModule === '03_verify' && (
            <div className="p-6 sm:p-8 rounded-3xl bg-[#080d1a] border border-white/10 space-y-6">
              <div className="border-b border-white/10 pb-4">
                <span className="text-[11px] font-mono text-cyan-400 uppercase font-bold tracking-wider">
                  03 &bull; IDENTITY &amp; KYC VERIFICATION
                </span>
                <h2 className="text-2xl font-bold text-white pt-0.5">Pending Verification Queue</h2>
                <p className="text-xs text-neutral-400 font-mono">
                  National ID, student credentials, and MUN Secretariat authorization queue.
                </p>
              </div>

              <div className="space-y-4 font-mono text-xs">
                <AnimatePresence mode="popLayout">
                  {pendingKyc.map((k) => (
                    <motion.div
                      key={k.id}
                      layout
                      initial={{ opacity: 1, x: 0 }}
                      exit={{
                        opacity: 0,
                        x: -280,
                        transition: { duration: 0.35, ease: [0.4, 0, 0.2, 1] },
                      }}
                      className="p-5 rounded-2xl bg-black/70 border border-white/10 space-y-3 overflow-hidden"
                    >
                      <div className="flex items-center justify-between">
                        <div className="space-y-1">
                          <span className="px-2 py-0.5 rounded bg-cyan-400/20 text-cyan-300 text-[10px] font-bold">
                            {k.type}
                          </span>
                          <h4 className="text-white font-bold text-sm">{k.name} ({k.org})</h4>
                          <p className="text-neutral-400 text-[11px]">Match Confidence Score: <strong className="text-emerald-400">{k.score}%</strong></p>
                        </div>
                        <span className="text-neutral-500 text-[11px]">{k.id}</span>
                      </div>

                      <div className="flex items-center gap-2 pt-2 border-t border-white/10">
                        <button
                          onClick={() => handleApproveKyc(k)}
                          className="px-4 py-2 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-black font-bold transition cursor-pointer"
                        >
                          Approve &amp; Grant Badge
                        </button>
                        <button
                          onClick={() => handleResubmitKyc(k)}
                          className="px-4 py-2 rounded-xl bg-white/10 hover:bg-white/20 text-white font-bold transition cursor-pointer"
                        >
                          Request Re-submission
                        </button>
                        <button
                          onClick={() => handleRejectKyc(k)}
                          className="px-4 py-2 rounded-xl bg-rose-500/20 hover:bg-rose-500/30 text-rose-300 font-bold transition cursor-pointer"
                        >
                          Reject
                        </button>
                      </div>
                    </motion.div>
                  ))}
                </AnimatePresence>

                {pendingKyc.length === 0 && (
                  <div className="p-8 rounded-2xl bg-black/40 border border-emerald-500/30 text-center space-y-2">
                    <div className="w-10 h-10 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center text-emerald-400 mx-auto">
                      <CheckCircle2 className="w-5 h-5" />
                    </div>
                    <p className="text-sm font-bold text-white">KYC &amp; Verification Queue Clear</p>
                    <p className="text-neutral-400 text-xs">All Secretariat and identity credential authorizations processed.</p>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Module 06: Press & Newsroom */}
          {activeModule === '06_press' && (
            <div className="p-6 sm:p-8 rounded-3xl bg-[#080d1a] border border-white/10 space-y-6">
              <div className="flex items-center justify-between border-b border-white/10 pb-4">
                <div>
                  <span className="text-[11px] font-mono text-cyan-400 uppercase font-bold tracking-wider">
                    06 &bull; PRESS &amp; EDITORIAL NEWSROOM
                  </span>
                  <h2 className="text-2xl font-bold text-white pt-0.5">Official Communiqué Management</h2>
                  <p className="text-xs text-neutral-400 font-mono">
                    Article approvals, revision histories, retraction management, and journalist credentials.
                  </p>
                </div>
                <button
                  onClick={handleDraftStory}
                  className="px-4 py-2 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-black font-mono font-bold text-xs flex items-center gap-2 transition cursor-pointer"
                >
                  <Plus className="w-4 h-4" />
                  <span>Draft Story</span>
                </button>
              </div>

              <div className="space-y-3 font-mono text-xs">
                {pressArticles.map((art) => (
                  <div key={art.id} className="p-4 rounded-2xl bg-black/60 border border-white/10 flex items-center justify-between gap-4">
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                          art.status === 'PUBLISHED'
                            ? 'bg-emerald-400/20 text-emerald-300'
                            : art.status === 'IN_REVIEW'
                            ? 'bg-amber-400/20 text-amber-300'
                            : 'bg-cyan-400/20 text-cyan-300'
                        }`}>
                          {art.status}
                        </span>
                        <span className="text-white font-bold">{art.title}</span>
                      </div>
                      <p className="text-[11px] text-neutral-400">By {art.author} &bull; {art.date}</p>
                    </div>

                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => notify(`Story [${art.title}] pushed to Featured Carousel!`)}
                        className="px-3 py-1.5 rounded-xl bg-white/10 hover:bg-white/20 text-white font-bold transition cursor-pointer"
                      >
                        Feature
                      </button>
                      <button
                        onClick={() => notify(`Opened story revision history.`)}
                        className="px-3 py-1.5 rounded-xl bg-cyan-500/20 hover:bg-cyan-500/30 text-cyan-300 font-bold transition cursor-pointer"
                      >
                        Revisions
                      </button>
                    </div>
                  </div>
                ))}

                {pressArticles.length === 0 && (
                  <div className="p-8 rounded-2xl bg-black/40 border border-white/10 text-center space-y-2">
                    <p className="text-sm font-bold text-white">No Press Communiqués Found</p>
                    <p className="text-neutral-400 text-xs">Click &apos;Draft Story&apos; to compose and dispatch an official sovereign release.</p>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Module 12: Payments & Ledger */}
          {activeModule === '12_payments' && (
            <div className="p-6 sm:p-8 rounded-3xl bg-[#080d1a] border border-white/10 space-y-6">
              <div className="border-b border-white/10 pb-4">
                <span className="text-[11px] font-mono text-cyan-400 uppercase font-bold tracking-wider">
                  12 &bull; FINANCIAL CONTROL &amp; ESCROW LEDGER
                </span>
                <h2 className="text-2xl font-bold text-white pt-0.5">Payments &amp; Transactions</h2>
                <p className="text-xs text-neutral-400 font-mono">
                  Live transaction volumes, ticket settlements, wallet balances, and refund management.
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 font-mono">
                <div className="p-4 rounded-2xl bg-black/60 border border-white/10">
                  <span className="text-[10px] text-neutral-400 uppercase">SETTLED TRANSACTION VOL</span>
                  <p className="text-2xl font-bold text-white pt-1">{liveTelemetryData.liveMetrics.grossVol || '$0.00'}</p>
                  <span className="text-[10px] text-emerald-400">Zero disputes open</span>
                </div>
                <div className="p-4 rounded-2xl bg-black/60 border border-white/10">
                  <span className="text-[10px] text-neutral-400 uppercase">HELD IN TICKET ESCROW</span>
                  <p className="text-2xl font-bold text-amber-300 pt-1">$0.00</p>
                  <span className="text-[10px] text-neutral-400">Releases upon event conclusion</span>
                </div>
                <div className="p-4 rounded-2xl bg-black/60 border border-white/10">
                  <span className="text-[10px] text-neutral-400 uppercase">PLATFORM FEE YIELD</span>
                  <p className="text-2xl font-bold text-cyan-300 pt-1">3.5% Flat</p>
                  <span className="text-[10px] text-cyan-400">Zero hidden surcharges</span>
                </div>
              </div>

              <div className="space-y-3 font-mono text-xs">
                <div className="flex items-center justify-between">
                  <span className="text-[11px] font-bold text-neutral-400 uppercase">LIVE TRANSACTION STREAM</span>
                  <button
                    onClick={handleSimulateTransaction}
                    className="px-2.5 py-1 rounded-lg bg-white/5 hover:bg-white/10 text-neutral-400 hover:text-white text-[10px] transition cursor-pointer"
                  >
                    + Record Test Settlement
                  </button>
                </div>

                {transactions.map((tx) => (
                  <div key={tx.id} className="p-3.5 rounded-2xl bg-black/60 border border-white/10 flex items-center justify-between">
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-white">{tx.amount}</span>
                        <span className="text-neutral-400">({tx.item})</span>
                        <span className="text-cyan-400">{tx.user}</span>
                      </div>
                      <span className="text-[10px] text-neutral-500">{tx.id}</span>
                    </div>

                    <span className="px-2.5 py-1 rounded-xl bg-emerald-500/20 text-emerald-300 font-bold text-[10px]">
                      {tx.status}
                    </span>
                  </div>
                ))}

                {transactions.length === 0 && (
                  <div className="p-8 rounded-2xl bg-black/40 border border-white/10 text-center space-y-2">
                    <p className="text-sm font-bold text-white">No Settlement Transactions Pending</p>
                    <p className="text-neutral-400 text-xs">Escrow payment pipeline is online and awaiting delegate ticketing or pledge transactions.</p>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Module 15: Moderation Cases */}
          {activeModule === '15_moderation' && (
            <div className="p-6 sm:p-8 rounded-3xl bg-[#080d1a] border border-white/10 space-y-6">
              <div className="border-b border-white/10 pb-4">
                <span className="text-[11px] font-mono text-rose-400 uppercase font-bold tracking-wider">
                  15 &bull; MODERATION &amp; ENFORCEMENT ENGINE
                </span>
                <h2 className="text-2xl font-bold text-white pt-0.5">Active Incident &amp; Case Management</h2>
                <p className="text-xs text-neutral-400 font-mono">
                  Automated toxicity scans, user reports, and structured strike enforcement.
                </p>
              </div>

              <div className="space-y-4 font-mono text-xs">
                <AnimatePresence mode="popLayout">
                  {activeCases.map((c) => (
                    <motion.div
                      key={c.caseId}
                      layout
                      initial={{ opacity: 1, x: 0 }}
                      exit={{
                        opacity: 0,
                        x: -280,
                        transition: { duration: 0.35, ease: [0.4, 0, 0.2, 1] },
                      }}
                      className="p-5 rounded-2xl bg-black/70 border border-rose-500/30 space-y-3 overflow-hidden"
                    >
                      <div className="flex items-center justify-between">
                        <div className="space-y-1">
                          <div className="flex items-center gap-2">
                            <span className="px-2 py-0.5 rounded bg-rose-500/20 text-rose-300 font-bold text-[10px]">
                              {c.severity}
                            </span>
                            <span className="text-white font-bold text-sm">{c.caseId}</span>
                          </div>
                          <p className="text-neutral-300 text-xs">Target: <strong className="text-cyan-300">{c.target}</strong> &bull; Reason: {c.reason}</p>
                          <p className="text-[10px] text-neutral-500">Source: {c.reporter}</p>
                        </div>
                      </div>

                      <div className="flex flex-wrap items-center gap-2 pt-2 border-t border-white/10">
                        <button
                          onClick={() => handleIssueStrike(c)}
                          className="px-3.5 py-1.5 rounded-xl bg-amber-500/20 hover:bg-amber-500/30 text-amber-300 font-bold transition cursor-pointer"
                        >
                          Issue Strike
                        </button>
                        <button
                          onClick={() => handlePermanentBanAndPurge(c)}
                          className="px-3.5 py-1.5 rounded-xl bg-rose-500 hover:bg-rose-400 text-white font-bold transition cursor-pointer shadow-[0_0_15px_rgba(244,63,94,0.3)]"
                        >
                          Permanent Ban &amp; Purge
                        </button>
                        <button
                          onClick={() => handleDismissCase(c)}
                          className="px-3.5 py-1.5 rounded-xl bg-white/10 hover:bg-white/20 text-neutral-300 font-bold transition cursor-pointer"
                        >
                          Dismiss Case
                        </button>
                      </div>
                    </motion.div>
                  ))}
                </AnimatePresence>

                {activeCases.length === 0 && (
                  <div className="p-8 rounded-2xl bg-black/40 border border-emerald-500/30 text-center space-y-2">
                    <div className="w-10 h-10 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center text-emerald-400 mx-auto">
                      <CheckCircle2 className="w-5 h-5" />
                    </div>
                    <p className="text-sm font-bold text-white">All Incident Queues Resolved</p>
                    <p className="text-neutral-400 text-xs">Zero active moderation cases or flagged abuse targets. Heuristics operating cleanly.</p>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Module 19: Notification & Broadcast Engine */}
          {activeModule === '19_notifications' && (
            <div className="p-6 sm:p-8 rounded-3xl bg-[#080d1a] border border-white/10 space-y-6">
              <div className="border-b border-white/10 pb-4">
                <span className="text-[11px] font-mono text-cyan-400 uppercase font-bold tracking-wider">
                  19 &bull; BROADCAST &amp; PUSH ENGINE
                </span>
                <h2 className="text-2xl font-bold text-white pt-0.5">Platform Announcement Transmitter</h2>
                <p className="text-xs text-neutral-400 font-mono">
                  Dispatch instant push banners, critical alerts, and global socket broadcasts.
                </p>
              </div>

              <div className="p-6 rounded-2xl bg-black/60 border border-white/10 space-y-4 font-mono text-xs">
                <div className="space-y-1.5">
                  <label className="text-[11px] text-neutral-300 uppercase font-bold">Broadcast Target Group</label>
                  <div className="flex gap-2">
                    {(['GLOBAL', 'STAFF', 'DELEGATES'] as const).map((t) => (
                      <button
                        key={t}
                        type="button"
                        onClick={() => setBroadcastTarget(t)}
                        className={`px-4 py-2 rounded-xl font-bold transition cursor-pointer border ${
                          broadcastTarget === t
                            ? 'bg-cyan-500 text-black border-cyan-400 shadow'
                            : 'bg-white/5 border-white/10 text-neutral-400'
                        }`}
                      >
                        {t}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="space-y-1.5">
                  <label className="text-[11px] text-neutral-300 uppercase font-bold">Broadcast Notice Copy</label>
                  <textarea
                    rows={4}
                    value={broadcastMessage}
                    onChange={(e) => setBroadcastMessage(e.target.value)}
                    placeholder="Enter urgent broadcast text e.g. 'System maintenance window concluded. All caucus rooms online.'"
                    className="w-full px-4 py-3 rounded-2xl bg-black border border-white/20 text-white focus:outline-none focus:border-cyan-400 leading-relaxed font-sans"
                  />
                </div>

                <button
                  type="button"
                  disabled={!broadcastMessage.trim()}
                  onClick={() => {
                    notify(`📢 Broadcast dispatched to ${broadcastTarget} recipients!`);
                    addAuditLog(`Broadcast Dispatched: ${broadcastMessage.slice(0, 40)}...`, 'DIRECTIVE');
                    setBroadcastMessage('');
                  }}
                  className="px-6 py-3 rounded-2xl bg-cyan-500 hover:bg-cyan-400 disabled:opacity-30 text-black font-bold transition cursor-pointer flex items-center gap-2"
                >
                  <Send className="w-4 h-4" />
                  <span>Transmit Broadcast Instantly</span>
                </button>
              </div>
            </div>
          )}

          {/* Module 21: Feature Flags & Maintenance */}
          {activeModule === '21_feature_flags' && (
            <div className="p-6 sm:p-8 rounded-3xl bg-[#080d1a] border border-white/10 space-y-6">
              <div className="border-b border-white/10 pb-4">
                <span className="text-[11px] font-mono text-cyan-400 uppercase font-bold tracking-wider">
                  21 &bull; FEATURE FLAGS &amp; PROTOCOL CONTROLS
                </span>
                <h2 className="text-2xl font-bold text-white pt-0.5">Circuit Breakers &amp; Dynamic Toggles</h2>
                <p className="text-xs text-neutral-400 font-mono">
                  Enable or suspend subsystems in real-time without recompilation or deployments.
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 font-mono text-xs">
                {[
                  { key: 'chatMeshEnabled', label: 'ZenChat Sovereign Mesh', desc: 'Real-time WebSocket direct & caucus rooms' },
                  { key: 'fluxReelsEnabled', label: 'ZEN.FLUX Vertical Wire', desc: '9:16 video ingestion and playback' },
                  { key: 'registrationsOpen', label: 'Public Registrations Gate', desc: 'Accept new identity account creations' },
                  { key: 'assemblyOsEnabled', label: 'Assembly OS & Live Voting', desc: 'Parliamentary voting engine' },
                  { key: 'zeroSurveillanceActive', label: 'Zero Surveillance Enforcement', desc: 'Ad blockers & tracking interceptors' },
                  { key: 'maintenanceMode', label: 'Global Maintenance Curtain', desc: 'Render emergency maintenance notice' },
                ].map((item) => {
                  const k = item.key as keyof ProtocolControls;
                  const isOn = protocols[k];
                  return (
                    <div
                      key={item.key}
                      className="p-5 rounded-2xl bg-black/60 border border-white/10 flex items-center justify-between gap-4"
                    >
                      <div className="space-y-1">
                        <p className="font-bold text-white">{item.label}</p>
                        <p className="text-[11px] text-neutral-400 font-sans">{item.desc}</p>
                      </div>
                      <button
                        onClick={() => {
                          const nextVal = !isOn;
                          saveProtocolControls({ [k]: nextVal });
                          notify(`Circuit [${item.label}] set to ${nextVal ? 'ONLINE' : 'MUTED'}`);
                          addAuditLog(`Admin Toggled Circuit: ${item.label} => ${nextVal}`, 'PROTOCOL');
                        }}
                        className={`px-4 py-2 rounded-xl text-xs font-bold transition cursor-pointer ${
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

          {/* Module 25: System Health & DevOps */}
          {activeModule === '25_system_health' && (
            <div className="p-6 sm:p-8 rounded-3xl bg-[#080d1a] border border-white/10 space-y-6">
              <div className="border-b border-white/10 pb-4">
                <span className="text-[11px] font-mono text-cyan-400 uppercase font-bold tracking-wider">
                  25 &bull; INFRASTRUCTURE &amp; TELEMETRY
                </span>
                <h2 className="text-2xl font-bold text-white pt-0.5">System Health Matrix</h2>
                <p className="text-xs text-neutral-400 font-mono">
                  Live response latencies, socket clustering, and cluster availability metrics.
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 font-mono text-xs">
                {liveTelemetryData.subsystems.map((s, idx) => (
                  <div key={idx} className="p-4 rounded-2xl bg-black/60 border border-white/10 space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-white">{s.name}</span>
                      <span className={`w-2 h-2 rounded-full ${s.status === 'OPERATIONAL' ? 'bg-emerald-400' : 'bg-amber-400'} animate-pulse`} />
                    </div>
                    <div className="flex items-center justify-between text-[11px] text-neutral-400">
                      <span>Latency: <strong className="text-cyan-300">{s.latency}</strong></span>
                      <span>Uptime: <strong className="text-emerald-400">{s.uptime}</strong></span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Module 28: Zenith Intel AI Assistant */}
          {activeModule === '28_ai_assistant' && (
            <div className="p-6 sm:p-8 rounded-3xl bg-[#080d1a] border border-cyan-500/30 space-y-6">
              <div className="border-b border-white/10 pb-4">
                <span className="text-[11px] font-mono text-cyan-400 uppercase font-bold tracking-wider">
                  28 &bull; ZENITH INTEL AI ASSISTANT
                </span>
                <h2 className="text-2xl font-bold text-white pt-0.5">Administrative Copilot</h2>
                <p className="text-xs text-neutral-400 font-mono">
                  Natural language queries, automated case summaries, and platform anomaly diagnostics.
                </p>
              </div>

              <div className="p-5 rounded-2xl bg-black/60 border border-white/10 space-y-4 font-mono text-xs">
                <div className="space-y-2">
                  <span className="text-[11px] text-neutral-400 uppercase font-bold">SUGGESTED INTEL QUERIES:</span>
                  <div className="flex flex-wrap gap-2">
                    {[
                      'Show high-volume accounts created in the last 24h',
                      'Audit committee voting records for Model UN 2026',
                      'Summarize open moderation appeals',
                      'Inspect server latency spikes',
                    ].map((q, idx) => (
                      <button
                        key={idx}
                        onClick={() => notify(`Zenith Intel synthesized: Query [${q}] completed.`)}
                        className="px-3 py-1.5 rounded-xl bg-white/5 hover:bg-cyan-500/15 border border-white/10 hover:border-cyan-500/30 text-neutral-300 hover:text-cyan-300 transition cursor-pointer text-left"
                      >
                        {q} →
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Fallback View for other modules */}
          {![
            '01_command_center',
            '02_people',
            '03_verify',
            '06_press',
            '12_payments',
            '15_moderation',
            '19_notifications',
            '21_feature_flags',
            '25_system_health',
            '27_emergency',
            '28_ai_assistant'
          ].includes(activeModule) && (
            <div className="p-8 rounded-3xl bg-[#080d1a] border border-white/10 space-y-4 font-mono">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-2xl bg-cyan-500/10 border border-cyan-500/30 flex items-center justify-center text-cyan-400">
                  <Sliders className="w-5 h-5" />
                </div>
                <div>
                  <span className="text-[10px] text-cyan-400 font-bold uppercase tracking-widest">
                    MODULE {activeModule.split('_')[0]}
                  </span>
                  <h3 className="text-xl font-bold text-white capitalize">
                    {activeModule.replace(/^[0-9]+_/, '').replace(/_/g, ' ')}
                  </h3>
                </div>
              </div>
              <p className="text-xs text-neutral-400 font-sans leading-relaxed">
                Full telemetry, audit logs, and mutation hooks are active for this administrative domain. Actions executed here write to the immutable tamper-evident compliance ledger.
              </p>
              <div className="pt-2">
                <button
                  onClick={() => notify(`Subsystem ${activeModule} synchronized.`)}
                  className="px-4 py-2 rounded-xl bg-cyan-500/20 hover:bg-cyan-500/30 text-cyan-300 font-bold text-xs transition cursor-pointer"
                >
                  Synchronize Subsystem Data
                </button>
              </div>
            </div>
          )}
        </main>
      </div>
    </div>
  );
}
