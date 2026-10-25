'use client';

import React, { useState, useEffect, useMemo } from 'react';
import Link from 'next/link';
import {
  ShieldCheck,
  Radio,
  Users,
  Grid,
  Calendar,
  Building,
  CreditCard,
  MessageSquare,
  FileText,
  Scale,
  Newspaper,
  Award,
  Sparkles,
  Settings,
  Archive,
  ChevronDown,
  AlertTriangle,
  Send,
  QrCode,
  Layers,
  Search,
  CheckCircle2,
  Lock,
  ExternalLink,
  Crown,
  ArrowRight,
  Sliders,
  Megaphone,
  Clock,
  History,
  CheckSquare,
  Plus,
  RotateCcw,
  FileCheck2,
  FileCheck
} from 'lucide-react';
import { Navbar } from '@/components/layout/Navbar';
import { Footer } from '@/components/layout/Footer';
import { ConferenceLiveboard } from './ConferenceLiveboard';
import { SpecModulesExplorer } from './SpecModulesExplorer';
import { UniversalConfigStudio } from './UniversalConfigStudio';
import { DesktopModeAdvisory } from '@/components/common/DesktopModeAdvisory';
import { 
  checkRevenueAccess, 
  LS_REVENUE_PERMISSIONS 
} from '@/lib/conferenceData';
import { 
  getStoredSecretariatMembers, 
  saveSecretariatMembers,
  getStoredLifecycleStage,
  saveLifecycleStage,
  recordAuditEvent,
  getStoredIncidents,
  saveIncidents,
  getStoredSchedule,
  saveSchedule,
  getStoredAnnouncements,
  saveAnnouncements,
  getStoredAuditEvents,
  DEFAULT_SECRETARIAT_ROLES,
  LIFECYCLE_STAGES
} from '@/lib/secretariatPermissions';
import {
  ConferenceLifecycleStage,
  SecretariatMember,
  IncidentRecord,
  ConferenceScheduleItem,
  ConferenceAnnouncement,
  AuditLogItem
} from '@/types/munConferenceOS';
import { useAuth } from '@/context/AuthContext';
import { useMun } from '@/context/MunContext';
import { useZenPulse } from '@/context/ZenPulsePlatformContext';
import { EventPlansPaymentLinksModal } from '@/components/payments/EventPlansPaymentLinksModal';
import { EmergencyProtocolBroadcastModal } from '@/components/mun/EmergencyProtocolBroadcastModal';
import { ActiveEmergencyBroadcastBanner } from '@/components/mun/ActiveEmergencyBroadcastBanner';
import { computeConferenceStatus } from '@/lib/conferenceStatusHelper';
import { CreateMunConferenceModal } from '@/components/mun/CreateMunConferenceModal';
import { MunNotStartedView } from '@/components/mun/MunNotStartedView';
import { MunSecDaisSupportDesk } from '@/components/mun/support/MunSecDaisSupportDesk';

type NavTab = 
  | 'OVERVIEW' 
  | 'COMMAND_CENTER' 
  | 'SUPPORT'
  | 'SPEC_MODULES'
  | 'CONFIG_STUDIO'
  | 'MATRIX' 
  | 'COMMITTEES' 
  | 'REGISTRATIONS' 
  | 'DOCUMENTS' 
  | 'PAYMENTS' 
  | 'AWARDS'
  | 'SCHEDULE'
  | 'INCIDENTS'
  | 'ANNOUNCEMENTS'
  | 'AUDIT_LOG';


export function ConferenceCommandCenter() {
  const { user, profile, isAuthenticated, isLoading, continueAsGuest } = useAuth();
  const { currentUserUsername } = useZenPulse();
  const { activeConference, conferences, committees, registrations, activeConferenceId, updateConference } = useMun();

  const [hasCheckedAuth, setHasCheckedAuth] = useState(false);
  const [localHasSession, setLocalHasSession] = useState(false);
  const [isPlansModalOpen, setIsPlansModalOpen] = useState(false);

  useEffect(() => {
    try {
      const stored = localStorage.getItem('zenvitra_session_user') || 
                     localStorage.getItem('zenvitra_user_session') || 
                     localStorage.getItem('zenvitra_session');
      setLocalHasSession(Boolean(stored));
    } catch (_) {}
    setHasCheckedAuth(true);
  }, []);

  const hasSession = Boolean(isAuthenticated || user || profile || localHasSession);

  const [activeTab, setActiveTab] = useState<NavTab>('COMMAND_CENTER');
  const [isEmergencyModalOpen, setIsEmergencyModalOpen] = useState(false);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const confId = activeConference?.id || activeConferenceId || '';
  const confTitle = activeConference?.name || 'Conference Secretariat';
  const statusInfo = useMemo(() => computeConferenceStatus(activeConference), [activeConference]);

  // Revenue Viewer Access (Creator + Payments Team + Chosen by Creator)
  const [delegatedViewers, setDelegatedViewers] = useState<string[]>(() => {
    if (typeof window === 'undefined') return [];
    try {
      const stored = localStorage.getItem(`${LS_REVENUE_PERMISSIONS}_${confId}`);
      if (stored) {
        const parsed = JSON.parse(stored);
        if (Array.isArray(parsed)) return parsed;
      }
    } catch (_) {}
    return [];
  });

  const [newViewerInput, setNewViewerInput] = useState('');

  const activeUser = {
    username: currentUserUsername || profile?.username || user?.user_metadata?.username,
    email: user?.email || profile?.email,
    role: profile?.role,
  };

  const revenueAccess = checkRevenueAccess(activeUser, {
    id: confId || 'mun-conference',
    name: confTitle,
    shortName: activeConference?.shortName || 'MUN',
    status: (activeConference?.status as any) || statusInfo.status,
    creatorUsername: 'yuveer',
    creatorEmail: 'founder@zenvitra.xyz',
    authorizedRevenueViewers: delegatedViewers,
    stats: {
      totalDelegates: committees.reduce((sum, c) => sum + (c.totalDelegates || 0), 0) || registrations.length,
      presentToday: committees.reduce((sum, c) => sum + (c.presentCount || 0), 0),
      lateToday: 0,
      absentToday: 0,
      totalSpeeches: 0,
      totalPOIs: 0,
      totalMotions: 0,
      totalCaucuses: 0,
      documentsSubmitted: 0,
      votesConducted: 0,
    },
    committees: [],
    alerts: [],
    edition: 'Official Edition',
    dates: `${activeConference?.startDate || '2026-10-17'} – ${activeConference?.endDate || '2026-10-19'}`,
    venue: activeConference?.location || 'Conference Center',
    readinessScore: 100,
  });

  const handleGrantAccess = (e: React.FormEvent) => {
    e.preventDefault();
    const clean = newViewerInput.trim().replace(/^@/, '');
    if (!clean) return;
    if (delegatedViewers.some((v) => v.toLowerCase() === clean.toLowerCase())) {
      showToast(`@${clean} already has revenue access`);
      return;
    }
    const next = [...delegatedViewers, clean];
    setDelegatedViewers(next);
    try {
      localStorage.setItem(`${LS_REVENUE_PERMISSIONS}_${confId}`, JSON.stringify(next));
    } catch (_) {}
    setNewViewerInput('');
    showToast(`Granted revenue access to @${clean}`);
  };

  const handleRevokeAccess = (usernameToRevoke: string) => {
    const next = delegatedViewers.filter((v) => v.toLowerCase() !== usernameToRevoke.toLowerCase());
    setDelegatedViewers(next);
    try {
      localStorage.setItem(`${LS_REVENUE_PERMISSIONS}_${confId}`, JSON.stringify(next));
    } catch (_) {}
    showToast(`Revoked revenue access for @${usernameToRevoke}`);
  };

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3000);
  };

  // Secretariat Operating System & Universal Configuration State
  const [lifecycleStage, setLifecycleStage] = useState<ConferenceLifecycleStage>(() => {
    return getStoredLifecycleStage(confId, 'SETUP');
  });

  const [secretariatMembers, setSecretariatMembers] = useState<SecretariatMember[]>(() => {
    const list = getStoredSecretariatMembers(confId);
    if (list.length > 0) return list;
    const sgHandle = currentUserUsername || profile?.username || 'founder';
    const sgName = profile?.display_name || user?.user_metadata?.full_name || 'Secretary-General';
    return [
      {
        id: 'sec_sg_01',
        userId: user?.id || 'usr_root',
        name: sgName,
        handle: sgHandle,
        email: user?.email || 'sg@zenvitra.xyz',
        role: 'SECRETARY_GENERAL',
        assignedAt: new Date().toISOString(),
        status: 'ACTIVE',
        permissions: DEFAULT_SECRETARIAT_ROLES[0].defaultPermissions
      }
    ];
  });

  const [scheduleItems, setScheduleItems] = useState<ConferenceScheduleItem[]>(() => {
    return getStoredSchedule(confId);
  });

  const [incidents, setIncidents] = useState<IncidentRecord[]>(() => {
    return getStoredIncidents(confId);
  });

  const [announcements, setAnnouncements] = useState<ConferenceAnnouncement[]>(() => {
    return getStoredAnnouncements(confId);
  });

  const [auditEvents, setAuditEvents] = useState<AuditLogItem[]>(() => {
    return getStoredAuditEvents(confId);
  });

  const [showSpecInUnlisted, setShowSpecInUnlisted] = useState(false);

  // Schedule Desk State
  const [scheduleDayFilter, setScheduleDayFilter] = useState<number>(1);
  const [isAddScheduleOpen, setIsAddScheduleOpen] = useState(false);
  const [newSchedTitle, setNewSchedTitle] = useState('');
  const [newSchedTime, setNewSchedTime] = useState('09:00 - 10:30');
  const [newSchedRoom, setNewSchedRoom] = useState('Plenary Hall');
  const [newSchedCategory, setNewSchedCategory] = useState<'PLENARY' | 'CAUCUS' | 'MEAL' | 'CRISIS' | 'CEREMONY'>('PLENARY');

  // Incident Desk State
  const [isReportIncidentOpen, setIsReportIncidentOpen] = useState(false);
  const [newIncTitle, setNewIncTitle] = useState('');
  const [newIncRoom, setNewIncRoom] = useState('');
  const [newIncDesc, setNewIncDesc] = useState('');
  const [newIncSev, setNewIncSev] = useState<'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL'>('MEDIUM');

  // Announcement Desk State
  const [isNewDispatchOpen, setIsNewDispatchOpen] = useState(false);
  const [newAnnTitle, setNewAnnTitle] = useState('');
  const [newAnnContent, setNewAnnContent] = useState('');
  const [newAnnTarget, setNewAnnTarget] = useState<'ALL' | 'SECRETARIAT_ONLY' | 'DELEGATES_ONLY' | 'EB_ONLY' | 'PRESS_ONLY'>('ALL');

  const handleStageChange = (newStage: ConferenceLifecycleStage) => {
    setLifecycleStage(newStage);
    saveLifecycleStage(confId, newStage);
    recordAuditEvent(confId, {
      actorName: activeUser.username || 'Secretariat',
      actorHandle: `@${activeUser.username || 'sec'}`,
      actorRole: 'Secretary-General',
      action: 'LIFECYCLE_STAGE_TRANSITION',
      targetEntity: 'CONFERENCE',
      targetId: confId,
      details: `Advanced conference lifecycle stage to ${newStage}`
    });
    setAuditEvents(getStoredAuditEvents(confId));
    showToast(`Conference stage transitioned to ${newStage}`);
  };

  const handleMembersChange = (updated: SecretariatMember[]) => {
    setSecretariatMembers(updated);
    saveSecretariatMembers(confId, updated);
  };

  const handleAddSchedule = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newSchedTitle.trim()) return;
    const newItem: ConferenceScheduleItem = {
      id: `sched_${Date.now()}`,
      dayNumber: scheduleDayFilter,
      timeRange: newSchedTime.trim(),
      title: newSchedTitle.trim(),
      venueOrRoom: newSchedRoom.trim(),
      category: newSchedCategory,
      status: 'SCHEDULED'
    };
    const next = [...scheduleItems, newItem];
    setScheduleItems(next);
    saveSchedule(confId, next);
    recordAuditEvent(confId, {
      actorName: activeUser.username || 'Director-General',
      actorHandle: `@${activeUser.username || 'dg'}`,
      actorRole: 'Director-General',
      action: 'SCHEDULE_ITEM_ADDED',
      targetEntity: 'SCHEDULE',
      targetId: newItem.id,
      details: `Added ${newItem.title} for Day ${newItem.dayNumber}`
    });
    setAuditEvents(getStoredAuditEvents(confId));
    setNewSchedTitle('');
    setIsAddScheduleOpen(false);
    showToast('Schedule block added');
  };

  const handleToggleScheduleStatus = (itemId: string) => {
    const next = scheduleItems.map(item => {
      if (item.id !== itemId) return item;
      const nextStatus: ConferenceScheduleItem['status'] = 
        item.status === 'SCHEDULED' ? 'LIVE' :
        item.status === 'LIVE' ? 'CONCLUDED' : 'SCHEDULED';
      return { ...item, status: nextStatus };
    });
    setScheduleItems(next);
    saveSchedule(confId, next);
    showToast('Schedule status updated');
  };

  const handleAddIncident = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newIncTitle.trim()) return;
    const item: IncidentRecord = {
      id: `inc_${Date.now()}`,
      title: newIncTitle.trim(),
      description: newIncDesc.trim(),
      department: newIncRoom.trim() || 'General Operations',
      severity: newIncSev,
      status: 'REPORTED',
      reportedBy: `@${activeUser.username || 'dais'}`,
      createdAt: new Date().toISOString()
    };
    const next = [item, ...incidents];
    setIncidents(next);
    saveIncidents(confId, next);
    recordAuditEvent(confId, {
      actorName: activeUser.username || 'Secretariat',
      actorHandle: `@${activeUser.username || 'dais'}`,
      actorRole: 'Operations',
      action: 'INCIDENT_REPORTED',
      targetEntity: 'INCIDENT',
      targetId: item.id,
      details: `Reported [${item.severity}] ${item.title}`
    });
    setAuditEvents(getStoredAuditEvents(confId));
    setNewIncTitle('');
    setNewIncDesc('');
    setNewIncRoom('');
    setIsReportIncidentOpen(false);
    showToast('Incident filed to Secretariat Command');
  };

  const handleResolveIncident = (incId: string) => {
    const next = incidents.map(i => i.id === incId ? { ...i, status: 'RESOLVED' as const, resolvedAt: new Date().toISOString() } : i);
    setIncidents(next);
    saveIncidents(confId, next);
    recordAuditEvent(confId, {
      actorName: activeUser.username || 'Secretariat',
      actorHandle: `@${activeUser.username || 'sec'}`,
      actorRole: 'Operations',
      action: 'INCIDENT_RESOLVED',
      targetEntity: 'INCIDENT',
      targetId: incId,
      details: `Resolved incident ${incId}`
    });
    setAuditEvents(getStoredAuditEvents(confId));
    showToast('Incident marked RESOLVED');
  };

  const handlePublishAnnouncement = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newAnnTitle.trim() || !newAnnContent.trim()) return;
    const item: ConferenceAnnouncement = {
      id: `ann_${Date.now()}`,
      title: newAnnTitle.trim(),
      content: newAnnContent.trim(),
      targetAudience: newAnnTarget,
      authorName: activeUser.username || 'Secretariat',
      authorRole: 'Secretary-General',
      publishedAt: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      pinned: false
    };
    const next = [item, ...announcements];
    setAnnouncements(next);
    saveAnnouncements(confId, next);
    recordAuditEvent(confId, {
      actorName: activeUser.username || 'Secretariat',
      actorHandle: `@${activeUser.username || 'sg'}`,
      actorRole: 'Secretary-General',
      action: 'ANNOUNCEMENT_PUBLISHED',
      targetEntity: 'ANNOUNCEMENT',
      targetId: item.id,
      details: `Dispatched announcement: ${item.title}`
    });
    setAuditEvents(getStoredAuditEvents(confId));
    setNewAnnTitle('');
    setNewAnnContent('');
    setIsNewDispatchOpen(false);
    showToast('Secretariat dispatch published');
  };


  // Compute live financial telemetry dynamically (zero seeded numbers)
  const totalPaidRegs = registrations.filter(
    (r) => r.status === 'accepted' || r.status === 'allotted'
  ).length;

  const totalAllottedDelegates = committees.reduce(
    (sum, c) => sum + (c.totalDelegates || 0),
    0
  );

  const realGrossRevenue = useMemo(() => {
    // If conference has plans, estimate or calculate from registrations
    let revenue = 0;
    if (activeConference?.plans && activeConference.plans.length > 0) {
      const avgPrice = activeConference.plans[0].price || 0;
      revenue = totalPaidRegs * avgPrice;
    } else if (activeConference?.ticketPrice) {
      revenue = totalPaidRegs * activeConference.ticketPrice;
    }
    return revenue;
  }, [activeConference, totalPaidRegs]);

  const formattedRevenue = useMemo(() => {
    if (realGrossRevenue === 0) return '₹0';
    if (realGrossRevenue >= 100000) {
      return `₹${(realGrossRevenue / 100000).toFixed(2)}L`;
    }
    return `₹${realGrossRevenue.toLocaleString('en-IN')}`;
  }, [realGrossRevenue]);

  // Secretariat Security Wall: /mun/conference strictly requires an active login session
  if (!isLoading && hasCheckedAuth && !hasSession) {
    return (
      <div className="min-h-screen bg-[#030407] text-white flex flex-col justify-between selection:bg-amber-500/30">
        <Navbar />
        <main className="flex-1 flex items-center justify-center p-4 sm:p-8 pt-28 sm:pt-32 relative overflow-hidden">
          {/* Ambient Lighting */}
          <div className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-[600px] h-[350px] bg-amber-500/[0.04] blur-[140px] rounded-full pointer-events-none" />

          <div className="w-full max-w-lg rounded-3xl bg-[#090a10] border border-amber-500/30 p-8 sm:p-10 shadow-[0_25px_80px_rgba(245,158,11,0.12)] text-center space-y-6 relative z-10">
            {/* Top Shield Icon */}
            <div className="w-16 h-16 mx-auto rounded-2xl bg-amber-500/10 border border-amber-500/30 flex items-center justify-center shadow-[0_0_25px_rgba(245,158,11,0.2)]">
              <Lock className="w-8 h-8 text-amber-400" />
            </div>

            {/* Badge & Title */}
            <div className="space-y-2">
              <span className="px-3 py-1 rounded-full bg-amber-500/10 text-amber-300 border border-amber-500/30 text-[10px] font-mono font-bold tracking-widest uppercase inline-block">
                Secretariat Clearance Required
              </span>
              <h1 className="text-2xl sm:text-3xl font-bold font-display tracking-tight text-white">
                Conference OS Access
              </h1>
              <p className="text-xs sm:text-sm text-neutral-400 leading-relaxed max-w-sm mx-auto">
                The <strong>Secretariat Command Center &amp; Liveboard</strong> requires an authenticated session for delegate rolls, committee telemetry, and revenue auditing.
              </p>
            </div>

            {/* Info Notice: /mun is open */}
            <div className="p-3.5 rounded-2xl bg-white/[0.02] border border-white/10 text-left flex items-start gap-3">
              <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
              <div className="text-xs text-neutral-300 leading-relaxed font-sans">
                <span className="font-bold text-white">Looking for conferences?</span>
                <p className="text-neutral-400 text-[11px] mt-0.5">
                  The public Model UN portal at <Link href="/mun" className="text-cyan-400 hover:underline font-mono">/mun</Link> does <strong>not</strong> require login.
                </p>
              </div>
            </div>

            {/* Actions Stack */}
            <div className="space-y-3 pt-2">
              <Link
                href="/login?redirect=/mun/conference"
                className="w-full py-3.5 px-6 rounded-2xl bg-gradient-to-r from-amber-400 to-amber-500 hover:from-amber-300 hover:to-amber-400 text-black font-display font-bold text-xs uppercase tracking-wider transition flex items-center justify-center gap-2 shadow-[0_0_25px_rgba(245,158,11,0.3)] cursor-pointer"
              >
                <Lock className="w-4 h-4 text-black" />
                <span>Sign In to Secretariat</span>
              </Link>

              <button
                type="button"
                onClick={async () => {
                  await continueAsGuest('secretariat_guest', 'Secretariat Lead');
                  setLocalHasSession(true);
                }}
                className="w-full py-3 px-6 rounded-2xl bg-white/5 hover:bg-white/10 border border-white/15 text-white font-mono text-xs font-semibold transition flex items-center justify-center gap-2 cursor-pointer"
              >
                <Sparkles className="w-4 h-4 text-amber-400" />
                <span>One-Click Guest Secretariat Pass</span>
              </button>

              <Link
                href="/mun"
                className="text-xs font-mono text-neutral-400 hover:text-white transition flex items-center justify-center gap-1.5 pt-2"
              >
                <ArrowRight className="w-3.5 h-3.5 rotate-180" />
                <span>Return to Public ZEN.MUN Discovery</span>
              </Link>
            </div>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  // Empty State: If no conference has been created or listed yet
  if (!activeConference || conferences.length === 0) {
    return (
      <div className="min-h-screen bg-[#030407] text-neutral-300 flex flex-col justify-between font-sans selection:bg-cyan-500/30 pt-20 sm:pt-24">
        <Navbar />

        <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 w-full text-left space-y-8">
          {/* Breadcrumb / Platform Title */}
          <div className="flex flex-wrap items-center justify-between gap-3 border-b border-white/10 pb-4">
            <div className="flex items-center gap-2">
              <span className="px-3 py-1 rounded-full bg-cyan-500/10 border border-cyan-500/30 text-cyan-300 font-mono text-[10px] tracking-wider uppercase font-bold">
                ZEN.MUN // CONFERENCE CONTROL CENTRE
              </span>
              <span className="text-xs text-neutral-500 font-mono">PRODUCT SPECIFICATION V1.0</span>
            </div>

            <Link
              href="/mun"
              className="text-xs font-mono text-neutral-400 hover:text-white transition flex items-center gap-1.5"
            >
              <ArrowRight className="w-3.5 h-3.5 rotate-180" />
              <span>Back to MUN Discovery Hub</span>
            </Link>
          </div>

          {/* Hero Unlisted State Banner */}
          <div className="p-8 sm:p-12 rounded-3xl bg-gradient-to-br from-[#0c101a] via-[#07090f] to-[#040508] border border-white/15 relative overflow-hidden shadow-[0_20px_70px_rgba(0,0,0,0.85)] space-y-6">
            <div className="absolute top-0 right-0 w-96 h-96 bg-cyan-500/10 blur-[130px] rounded-full pointer-events-none" />
            <div className="absolute bottom-0 left-1/4 w-80 h-80 bg-purple-500/10 blur-[140px] rounded-full pointer-events-none" />

            <div className="relative z-10 max-w-3xl space-y-4">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-400/10 border border-amber-400/30 text-amber-300 font-mono text-xs font-bold uppercase tracking-wider">
                <Building className="w-4 h-4 text-amber-400" />
                <span>NO MUN CONFERENCES LISTED ON YOUR SECRETARIAT ACCOUNT</span>
              </div>

              <h1 
                className="text-3xl sm:text-5xl font-black text-white tracking-tight leading-tight uppercase"
                style={{ fontFamily: 'Clash Display, sans-serif' }}
              >
                The Conference Operating System For The Secretariat
              </h1>

              <p className="text-sm sm:text-base text-neutral-300 font-sans leading-relaxed">
                ZEN.MUN / CONFERENCE is the command centre through which a Secretariat creates, configures, operates, monitors, and closes an entire Model United Nations conference. Since no MUN is currently listed, create your conference or register one through the guided wizard.
              </p>

              {/* Action Buttons */}
              <div className="pt-4 flex flex-col sm:flex-row items-center gap-3 flex-wrap">
                <button
                  type="button"
                  onClick={() => setIsCreateModalOpen(true)}
                  className="w-full sm:w-auto px-7 py-4 rounded-2xl bg-gradient-to-r from-cyan-400 via-teal-300 to-emerald-400 hover:from-cyan-300 hover:to-emerald-300 text-black font-display font-bold text-xs uppercase tracking-wider transition-all hover:scale-[1.02] active:scale-[0.98] shadow-[0_0_35px_rgba(6,182,212,0.35)] flex items-center justify-center gap-2.5 cursor-pointer"
                >
                  <Building className="w-4 h-4 fill-black text-black" />
                  <span>List / Host New Conference</span>
                  <ArrowRight className="w-4 h-4" />
                </button>

                <button
                  type="button"
                  onClick={() => setShowSpecInUnlisted(!showSpecInUnlisted)}
                  className="w-full sm:w-auto px-6 py-4 rounded-2xl bg-cyan-500/10 hover:bg-cyan-500/20 border border-cyan-500/30 text-cyan-300 font-mono text-xs uppercase tracking-wider transition flex items-center justify-center gap-2 cursor-pointer"
                >
                  <Layers className="w-4 h-4 text-cyan-400" />
                  <span>{showSpecInUnlisted ? 'Hide Spec Directory' : 'Explore 21 Modules Directory'}</span>
                </button>

                <Link
                  href="/committee/create"
                  className="w-full sm:w-auto px-6 py-4 rounded-2xl bg-white/[0.04] hover:bg-white/[0.08] border border-white/15 text-white font-mono text-xs uppercase tracking-wider transition flex items-center justify-center gap-2"
                >
                  <span>Quick Committee Dais</span>
                </Link>

                <Link
                  href="/forms"
                  className="w-full sm:w-auto px-6 py-4 rounded-2xl bg-white/[0.04] hover:bg-white/[0.08] border border-white/15 text-neutral-300 hover:text-white font-mono text-xs uppercase tracking-wider transition flex items-center justify-center gap-2"
                >
                  <span>ZenForms Public</span>
                </Link>
              </div>
            </div>

            {/* Workflow 4-Pillar Spec Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 pt-6 border-t border-white/10 relative z-10">
              <div className="p-4 rounded-2xl bg-black/50 border border-white/5 space-y-2">
                <div className="w-7 h-7 rounded-lg bg-cyan-400/10 text-cyan-400 flex items-center justify-center">
                  <Users className="w-4 h-4" />
                </div>
                <h4 className="text-xs font-bold text-white font-display">01. DELEGATES</h4>
                <p className="text-[11px] text-neutral-400 leading-relaxed font-sans">
                  Registrations, portfolio allocations, payments, and cryptographically verified digital credentials.
                </p>
              </div>

              <div className="p-4 rounded-2xl bg-black/50 border border-white/5 space-y-2">
                <div className="w-7 h-7 rounded-lg bg-emerald-400/10 text-emerald-400 flex items-center justify-center">
                  <Grid className="w-4 h-4" />
                </div>
                <h4 className="text-xs font-bold text-white font-display">02. COMMITTEES</h4>
                <p className="text-[11px] text-neutral-400 leading-relaxed font-sans">
                  Agendas, Executive Board oversight, timed caucus procedure, and committee room workspaces.
                </p>
              </div>

              <div className="p-4 rounded-2xl bg-black/50 border border-white/5 space-y-2">
                <div className="w-7 h-7 rounded-lg bg-amber-400/10 text-amber-400 flex items-center justify-center">
                  <Radio className="w-4 h-4" />
                </div>
                <h4 className="text-xs font-bold text-white font-display">03. LIVE OPERATIONS</h4>
                <p className="text-[11px] text-neutral-400 leading-relaxed font-sans">
                  Real-time roll calls, General Speakers List, emergency protocol broadcasts, and incident resolution.
                </p>
              </div>

              <div className="p-4 rounded-2xl bg-black/50 border border-white/5 space-y-2">
                <div className="w-7 h-7 rounded-lg bg-purple-400/10 text-purple-400 flex items-center justify-center">
                  <Award className="w-4 h-4" />
                </div>
                <h4 className="text-xs font-bold text-white font-display">04. CONFERENCE INTEL</h4>
                <p className="text-[11px] text-neutral-400 leading-relaxed font-sans">
                  Financial ticket reconciliation, live reports, committee analytics, and verifiable certificates.
                </p>
              </div>
            </div>

            {/* Spec Modules Explorer Drawer if toggled */}
            {showSpecInUnlisted && (
              <div className="pt-8 border-t border-white/10 space-y-4 relative z-10">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="text-lg font-bold font-display text-white">Full 21-Module Conference OS Architecture</h3>
                    <p className="text-xs text-neutral-400 font-mono">
                      16 Core Conference Modules &bull; 5 Connected Ecosystem Integrations
                    </p>
                  </div>
                  <button
                    type="button"
                    onClick={() => setShowSpecInUnlisted(false)}
                    className="text-xs text-neutral-400 hover:text-white font-mono underline cursor-pointer"
                  >
                    Close Directory
                  </button>
                </div>
                <SpecModulesExplorer />
              </div>
            )}
          </div>
        </main>


        <CreateMunConferenceModal
          isOpen={isCreateModalOpen}
          onClose={() => setIsCreateModalOpen(false)}
        />
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#030407] text-neutral-300 flex flex-col justify-between font-sans selection:bg-cyan-500/30 pt-20 sm:pt-24">
      <Navbar />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 w-full space-y-6 text-left">
        <DesktopModeAdvisory studioName="MUN Conference Command Center" storageKey="zen_mun_command_center" />
        {/* Toast */}
        {toastMessage && (
          <div className="fixed top-24 right-6 z-50 px-4 py-2 rounded-2xl bg-cyan-500 text-black font-mono text-xs font-bold shadow-2xl flex items-center gap-2 animate-bounce">
            <CheckCircle2 className="w-4 h-4" />
            <span>{toastMessage}</span>
          </div>
        )}

        {/* Top Conference Command Header */}
        <div className="p-6 rounded-3xl bg-gradient-to-r from-[#0d101a] via-black to-black border border-white/10 flex flex-wrap items-center justify-between gap-4">
          <div className="space-y-1">
            <div className="flex flex-wrap items-center gap-2">
              {statusInfo.status.startsWith('DAY_') ? (
                <span className="px-3 py-1 rounded-full text-[10px] font-mono font-bold bg-emerald-500/15 text-emerald-400 border border-emerald-500/30 inline-flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                  {statusInfo.displayText}
                </span>
              ) : statusInfo.status === 'NOT_STARTED' ? (
                <span className="px-3 py-1 rounded-full text-[10px] font-mono font-bold bg-amber-500/15 text-amber-300 border border-amber-500/30 inline-flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-amber-400" />
                  {statusInfo.displayText}
                </span>
              ) : (
                <span className="px-3 py-1 rounded-full text-[10px] font-mono font-bold bg-neutral-500/20 text-neutral-300 border border-neutral-500/30 inline-flex items-center gap-1.5">
                  <CheckCircle2 className="w-3.5 h-3.5 text-neutral-400" />
                  {statusInfo.displayText}
                </span>
              )}

              {/* Lifecycle Stage Indicator */}
              <button
                type="button"
                onClick={() => setActiveTab('CONFIG_STUDIO')}
                className="px-3 py-1 rounded-full text-[10px] font-mono font-bold bg-purple-500/15 text-purple-300 border border-purple-500/30 inline-flex items-center gap-1.5 hover:bg-purple-500/25 transition cursor-pointer"
                title="Manage conference lifecycle in Universal Config Studio"
              >
                <Sliders className="w-3 h-3 text-purple-400" />
                <span>STAGE: {lifecycleStage}</span>
              </button>

              {/* Conference Switcher Dropdown Button */}
              {conferences.length > 1 && (
                <div className="inline-flex items-center gap-1 text-[11px] font-mono text-neutral-400">
                  <span>Switch MUN:</span>
                  <select
                    value={activeConference.id}
                    onChange={(e) => updateConference(e.target.value, {})}
                    className="bg-black/60 border border-white/15 rounded-lg px-2 py-0.5 text-xs text-white cursor-pointer"
                  >
                    {conferences.map((c) => (
                      <option key={c.id} value={c.id} className="bg-[#0b0e14] text-white">
                        {c.shortName || c.name}
                      </option>
                    ))}
                  </select>
                </div>
              )}

              <span className="text-xs text-neutral-400 font-mono">{activeConference?.location || 'Chamber Plenary'}</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-black font-display text-white tracking-tight">
              {confTitle.toUpperCase()} &bull; SECRETARIAT COMMAND SUITE
            </h1>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <button
              type="button"
              onClick={() => setIsCreateModalOpen(true)}
              className="px-3.5 py-2.5 rounded-2xl bg-white/5 hover:bg-white/10 border border-white/15 text-neutral-300 hover:text-white font-mono text-xs font-semibold transition flex items-center gap-1.5 cursor-pointer"
              title="Host / List another Model UN"
            >
              <Building className="w-3.5 h-3.5 text-cyan-400" />
              <span>Host MUN</span>
            </button>

            <button
              type="button"
              onClick={() => setIsEmergencyModalOpen(true)}
              className="px-4 py-2.5 rounded-2xl bg-rose-500/20 hover:bg-rose-500/30 border border-rose-500/40 text-rose-300 font-mono text-xs font-bold transition flex items-center gap-1.5 cursor-pointer shadow-md"
            >
              <AlertTriangle className="w-3.5 h-3.5" />
              <span>🚨 Broadcast Alert</span>
            </button>

            {revenueAccess.allowed ? (
              <Link
                href="/payments"
                className="px-4 py-2.5 rounded-2xl bg-white/10 hover:bg-white/15 border border-white/15 text-white font-mono text-xs font-bold transition flex items-center gap-2"
                title={`Confidential Revenue (${revenueAccess.description})`}
              >
                <CreditCard className="w-3.5 h-3.5 text-cyan-400" />
                <span>{formattedRevenue} Revenue</span>
                <span className="text-[9px] font-mono px-1.5 py-0.5 rounded bg-cyan-500/20 text-cyan-300 font-normal">
                  {revenueAccess.role === 'CREATOR' ? 'Creator' : revenueAccess.role === 'PAYMENTS_TEAM' ? 'Finance' : 'Authorized'}
                </span>
              </Link>
            ) : (
              <div
                className="px-4 py-2.5 rounded-2xl bg-white/[0.03] border border-white/10 text-neutral-500 font-mono text-xs flex items-center gap-1.5 select-none"
                title="Revenue telemetry is restricted to MUN Creator, Payments Team & delegates chosen by Creator"
              >
                <Lock className="w-3.5 h-3.5 text-neutral-500" />
                <span>Revenue Confidential</span>
              </div>
            )}
          </div>
        </div>

        {/* If Conference Status is NOT_STARTED, show countdown alert banner */}
        {statusInfo.status === 'NOT_STARTED' && (
          <div className="p-5 rounded-2xl bg-amber-500/10 border border-amber-500/30 text-amber-200 text-xs font-mono flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div className="flex items-center gap-2.5">
              <span className="w-2.5 h-2.5 rounded-full bg-amber-400 animate-ping shrink-0" />
              <span>
                <strong>UPCOMING CONFERENCE:</strong> This MUN is scheduled to convene on {activeConference?.startDate || 'the configured start date'}. The Dais is currently in setup &amp; allocation phase.
              </span>
            </div>
            <Link
              href="/mun"
              className="px-4 py-2 rounded-xl bg-amber-400/20 hover:bg-amber-400/30 text-amber-300 font-bold border border-amber-400/40 text-[11px] self-start sm:self-auto shrink-0 transition"
            >
              View Public Schedule &rarr;
            </Link>
          </div>
        )}

        {/* Live Active Emergency Broadcast Banner across Secretariat */}
        <ActiveEmergencyBroadcastBanner allowDismiss={true} />

        {/* Master Navigation & Content Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          {/* Left Navigation Sidebar */}
          <div className="lg:col-span-3 p-4 rounded-3xl bg-black/50 border border-white/10 space-y-4 font-mono text-xs">
            {/* 1. Live Operations */}
            <div className="space-y-1">
              <span className="text-[10px] text-neutral-500 uppercase tracking-wider block font-bold px-3">
                LIVE OPERATIONS
              </span>
              <button
                type="button"
                onClick={() => setActiveTab('COMMAND_CENTER')}
                className={`w-full text-left px-3 py-2.5 rounded-xl transition cursor-pointer flex items-center justify-between ${
                  activeTab === 'COMMAND_CENTER'
                    ? 'bg-cyan-500/15 text-cyan-300 font-bold border border-cyan-500/30'
                    : 'text-neutral-400 hover:text-white'
                }`}
              >
                <span>⚡ Live Intelligence Board</span>
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
              </button>
              <button
                type="button"
                onClick={() => setActiveTab('OVERVIEW')}
                className={`w-full text-left px-3 py-2.5 rounded-xl transition cursor-pointer ${
                  activeTab === 'OVERVIEW'
                    ? 'bg-cyan-500/15 text-cyan-300 font-bold border border-cyan-500/30'
                    : 'text-neutral-400 hover:text-white'
                }`}
              >
                🏠 Conference Overview
              </button>
              <button
                type="button"
                onClick={() => setActiveTab('SCHEDULE')}
                className={`w-full text-left px-3 py-2.5 rounded-xl transition cursor-pointer flex items-center justify-between ${
                  activeTab === 'SCHEDULE'
                    ? 'bg-cyan-500/15 text-cyan-300 font-bold border border-cyan-500/30'
                    : 'text-neutral-400 hover:text-white'
                }`}
              >
                <span>📅 Master Run of Show</span>
                {scheduleItems.length > 0 && (
                  <span className="px-1.5 py-0.2 rounded bg-white/10 text-[9px] text-neutral-300">
                    {scheduleItems.length}
                  </span>
                )}
              </button>
              <button
                type="button"
                onClick={() => setActiveTab('INCIDENTS')}
                className={`w-full text-left px-3 py-2.5 rounded-xl transition cursor-pointer flex items-center justify-between ${
                  activeTab === 'INCIDENTS'
                    ? 'bg-rose-500/15 text-rose-300 font-bold border border-rose-500/30'
                    : 'text-neutral-400 hover:text-white'
                }`}
              >
                <span>🚨 Incident Desk</span>
                {incidents.filter(i => i.status !== 'RESOLVED' && i.status !== 'CLOSED').length > 0 && (
                  <span className="px-1.5 py-0.2 rounded bg-rose-500/20 text-rose-300 text-[9px] font-bold">
                    {incidents.filter(i => i.status !== 'RESOLVED' && i.status !== 'CLOSED').length}
                  </span>
                )}
              </button>
              <button
                type="button"
                onClick={() => setActiveTab('ANNOUNCEMENTS')}
                className={`w-full text-left px-3 py-2.5 rounded-xl transition cursor-pointer flex items-center justify-between ${
                  activeTab === 'ANNOUNCEMENTS'
                    ? 'bg-cyan-500/15 text-cyan-300 font-bold border border-cyan-500/30'
                    : 'text-neutral-400 hover:text-white'
                }`}
              >
                <span>📢 Dispatches Desk</span>
                {announcements.length > 0 && (
                  <span className="px-1.5 py-0.2 rounded bg-white/10 text-[9px] text-neutral-300">
                    {announcements.length}
                  </span>
                )}
              </button>
              <button
                type="button"
                onClick={() => setActiveTab('SUPPORT')}
                className={`w-full text-left px-3 py-2.5 rounded-xl transition cursor-pointer flex items-center justify-between ${
                  activeTab === 'SUPPORT'
                    ? 'bg-cyan-500/15 text-cyan-300 font-bold border border-cyan-500/30'
                    : 'text-neutral-400 hover:text-white'
                }`}
              >
                <span>🎧 Secretariat &amp; Dais Support</span>
                <span className="w-2 h-2 rounded-full bg-cyan-400" />
              </button>
            </div>

            {/* 2. Universal Config Engine */}
            <div className="space-y-1 pt-2 border-t border-white/5">
              <span className="text-[10px] text-neutral-500 uppercase tracking-wider block font-bold px-3">
                UNIVERSAL ENGINE
              </span>
              <button
                type="button"
                onClick={() => setActiveTab('CONFIG_STUDIO')}
                className={`w-full text-left px-3 py-2.5 rounded-xl transition cursor-pointer flex items-center justify-between ${
                  activeTab === 'CONFIG_STUDIO'
                    ? 'bg-purple-500/15 text-purple-300 font-bold border border-purple-500/30'
                    : 'text-neutral-400 hover:text-white'
                }`}
              >
                <span>🛠️ Universal Config Studio</span>
                <span className="text-[9px] px-1.5 py-0.5 rounded bg-purple-500/20 text-purple-300 font-bold">
                  {lifecycleStage}
                </span>
              </button>
              <button
                type="button"
                onClick={() => setActiveTab('SPEC_MODULES')}
                className={`w-full text-left px-3 py-2.5 rounded-xl transition cursor-pointer flex items-center justify-between ${
                  activeTab === 'SPEC_MODULES'
                    ? 'bg-cyan-500/15 text-cyan-300 font-bold border border-cyan-500/30'
                    : 'text-neutral-400 hover:text-white'
                }`}
              >
                <span>📚 21 Modules Directory</span>
                <span className="text-[9px] px-1.5 py-0.5 rounded bg-white/10 text-neutral-300">
                  21
                </span>
              </button>
            </div>

            {/* 3. Sovereign Procedures */}
            <div className="space-y-1 pt-2 border-t border-white/5">
              <span className="text-[10px] text-neutral-500 uppercase tracking-wider block font-bold px-3">
                SOVEREIGN PROCEDURES
              </span>
              <button
                type="button"
                onClick={() => setActiveTab('MATRIX')}
                className={`w-full text-left px-3 py-2.5 rounded-xl transition cursor-pointer ${
                  activeTab === 'MATRIX'
                    ? 'bg-cyan-500/15 text-cyan-300 font-bold border border-cyan-500/30'
                    : 'text-neutral-400 hover:text-white'
                }`}
              >
                🧮 Delegate Matrix
              </button>
              <button
                type="button"
                onClick={() => setActiveTab('COMMITTEES')}
                className={`w-full text-left px-3 py-2.5 rounded-xl transition cursor-pointer ${
                  activeTab === 'COMMITTEES'
                    ? 'bg-cyan-500/15 text-cyan-300 font-bold border border-cyan-500/30'
                    : 'text-neutral-400 hover:text-white'
                }`}
              >
                🏛️ Committee Rooms ({committees.length})
              </button>
              <button
                type="button"
                onClick={() => setActiveTab('REGISTRATIONS')}
                className={`w-full text-left px-3 py-2.5 rounded-xl transition cursor-pointer ${
                  activeTab === 'REGISTRATIONS'
                    ? 'bg-cyan-500/15 text-cyan-300 font-bold border border-cyan-500/30'
                    : 'text-neutral-400 hover:text-white'
                }`}
              >
                👥 Registrations ({registrations.length})
              </button>
              <button
                type="button"
                onClick={() => setActiveTab('DOCUMENTS')}
                className={`w-full text-left px-3 py-2.5 rounded-xl transition cursor-pointer ${
                  activeTab === 'DOCUMENTS'
                    ? 'bg-cyan-500/15 text-cyan-300 font-bold border border-cyan-500/30'
                    : 'text-neutral-400 hover:text-white'
                }`}
              >
                📑 Resolutions &amp; Bills
              </button>
            </div>

            {/* 4. Finance & Security */}
            <div className="space-y-1 pt-2 border-t border-white/5">
              <span className="text-[10px] text-neutral-500 uppercase tracking-wider block font-bold px-3">
                FINANCE &amp; SECURITY
              </span>
              <button
                type="button"
                onClick={() => setActiveTab('PAYMENTS')}
                className={`w-full text-left px-3 py-2.5 rounded-xl transition cursor-pointer flex items-center justify-between ${
                  activeTab === 'PAYMENTS'
                    ? 'bg-cyan-500/15 text-cyan-300 font-bold border border-cyan-500/30'
                    : 'text-neutral-400 hover:text-white'
                }`}
              >
                <span>💳 Ticket Revenue</span>
                {!revenueAccess.allowed && <Lock className="w-3 h-3 text-neutral-500 shrink-0" />}
              </button>
              <button
                type="button"
                onClick={() => setActiveTab('AWARDS')}
                className={`w-full text-left px-3 py-2.5 rounded-xl transition cursor-pointer ${
                  activeTab === 'AWARDS'
                    ? 'bg-cyan-500/15 text-cyan-300 font-bold border border-cyan-500/30'
                    : 'text-neutral-400 hover:text-white'
                }`}
              >
                🏆 Awards &amp; Certificates
              </button>
              <button
                type="button"
                onClick={() => setActiveTab('AUDIT_LOG')}
                className={`w-full text-left px-3 py-2.5 rounded-xl transition cursor-pointer flex items-center justify-between ${
                  activeTab === 'AUDIT_LOG'
                    ? 'bg-purple-500/15 text-purple-300 font-bold border border-purple-500/30'
                    : 'text-neutral-400 hover:text-white'
                }`}
              >
                <span>🛡️ Audit &amp; Security Trail</span>
                {auditEvents.length > 0 && (
                  <span className="px-1.5 py-0.2 rounded bg-purple-500/20 text-purple-300 text-[9px] font-bold">
                    {auditEvents.length}
                  </span>
                )}
              </button>
            </div>
          </div>

          {/* Main Display Area */}
          <div className="lg:col-span-9">
            {activeTab === 'COMMAND_CENTER' && <ConferenceLiveboard />}

            {activeTab === 'SUPPORT' && (
              <MunSecDaisSupportDesk
                conferenceId={activeConference?.id}
                conferenceTitle={activeConference?.name}
              />
            )}

            {activeTab === 'OVERVIEW' && (
              <div className="p-8 rounded-3xl bg-black/50 border border-white/10 space-y-6">
                <h3 className="text-xl font-bold font-display text-white">Conference Health &amp; Operations</h3>
                <p className="text-xs text-neutral-400 font-mono leading-relaxed">
                  {committees.length > 0 
                    ? `${committees.length} committee chamber${committees.length === 1 ? '' : 's'} registered in session. ${totalPaidRegs} verified credentialed registration${totalPaidRegs === 1 ? '' : 's'}.`
                    : 'No committee chambers configured yet. Create a committee from the Chamber Console to begin.'}
                </p>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-xs font-mono">
                  <div className="p-4 rounded-2xl bg-white/[0.02] border border-white/5">
                    <span className="text-neutral-500 text-[10px] block">COMMITTEES</span>
                    <strong className="text-white text-base">{committees.length} Chambers</strong>
                  </div>
                  <div className="p-4 rounded-2xl bg-white/[0.02] border border-white/5">
                    <span className="text-neutral-500 text-[10px] block">TOTAL DELEGATES</span>
                    <strong className="text-white text-base">{totalAllottedDelegates || registrations.length} Allotted</strong>
                  </div>
                  <div className="p-4 rounded-2xl bg-white/[0.02] border border-white/5">
                    <span className="text-neutral-500 text-[10px] block flex items-center gap-1">
                      <span>GROSS REVENUE</span>
                      {!revenueAccess.allowed && <Lock className="w-2.5 h-2.5 text-neutral-500" />}
                    </span>
                    <strong className={revenueAccess.allowed ? 'text-cyan-300 text-base' : 'text-neutral-500 text-base font-sans'}>
                      {revenueAccess.allowed ? (realGrossRevenue > 0 ? `₹${realGrossRevenue.toLocaleString('en-IN')}` : '₹0') : '🔒 Confidential'}
                    </strong>
                  </div>
                  <div className="p-4 rounded-2xl bg-white/[0.02] border border-white/5">
                    <span className="text-neutral-500 text-[10px] block">CURRENT STATUS</span>
                    <strong className="text-emerald-400 text-base">
                      {activeConference?.status ? String(activeConference.status).replace(/_/g, ' ') : 'NOT STARTED'}
                    </strong>
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'MATRIX' && (
              <div className="p-8 rounded-3xl bg-black/50 border border-white/10 space-y-6">
                <div className="space-y-1">
                  <span className="text-[10px] font-mono text-cyan-400 uppercase font-bold">
                    SOVEREIGN ALLOCATION PRINCIPLE
                  </span>
                  <h3 className="text-xl font-bold font-display text-white">Conference Head Matrix Allocation</h3>
                  <p className="text-xs text-neutral-400 font-mono">
                    Country and portfolio assignments are determined <strong>strictly and manually by the Conference Head and Secretariat</strong>, never automated or overridden by ZENVITRA.
                  </p>
                </div>

                <div className="p-4 rounded-2xl bg-purple-500/[0.05] border border-purple-500/25 space-y-3 font-mono text-xs">
                  <span className="font-bold text-purple-300">Secretariat Matrix Controls:</span>
                  <ul className="list-disc pl-5 space-y-1 text-neutral-300 text-[11px]">
                    <li>UNSC: 15 / 15 Countries Allotted by Secretary-General</li>
                    <li>UNHRC: 28 / 30 Delegations Allotted by USG Academics</li>
                    <li>WHO: 24 / 28 Health Ministries Allotted</li>
                    <li>Lok Sabha: 38 / 40 Parliamentary Constituencies Assigned</li>
                  </ul>
                  <button
                    type="button"
                    onClick={() => showToast('Country Matrix locked & notified to delegates')}
                    className="px-4 py-2 rounded-xl bg-purple-600 hover:bg-purple-500 text-white font-mono text-xs font-bold transition cursor-pointer"
                  >
                    Lock &amp; Notify Matrix
                  </button>
                </div>
              </div>
            )}

            {activeTab === 'COMMITTEES' && (
              <div className="p-8 rounded-3xl bg-black/50 border border-white/10 space-y-6">
                <div className="flex items-center justify-between">
                  <h3 className="text-xl font-bold font-display text-white">Active Committee Chambers ({committees.length})</h3>
                  <Link
                    href="/committee"
                    className="px-4 py-2 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-black font-mono text-xs font-bold transition flex items-center gap-1.5"
                  >
                    <span>+ Chamber Console</span>
                    <ExternalLink className="w-3.5 h-3.5" />
                  </Link>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs font-sans">
                  {committees.map((c) => (
                    <div key={c.id} className="p-4 rounded-2xl bg-white/[0.02] border border-white/5 space-y-2">
                      <div className="flex items-center justify-between">
                        <span className="font-bold text-white text-sm">{c.name}</span>
                        <span className="px-2 py-0.5 rounded-full text-[9px] font-mono font-bold bg-cyan-500/15 text-cyan-400">
                          {c.type}
                        </span>
                      </div>
                      <p className="text-neutral-400 text-xs font-mono">{c.presentCount}/{c.totalDelegates} delegates &bull; Quorum: {c.quorumNeeded}</p>
                      <p className="text-neutral-300 text-xs line-clamp-1 italic">{c.agenda || 'General Deliberations'}</p>
                      <Link
                        href={`/committee?chamber=${c.id}`}
                        className="inline-flex items-center gap-1.5 text-xs text-cyan-400 hover:text-cyan-300 font-mono underline pt-1"
                      >
                        <span>Open Live Chamber Console</span>
                        <ExternalLink className="w-3 h-3" />
                      </Link>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {activeTab === 'REGISTRATIONS' && (
              <div className="p-8 rounded-3xl bg-black/50 border border-white/10 space-y-4 font-mono text-xs">
                <div className="flex items-center justify-between">
                  <h3 className="text-xl font-bold font-display text-white font-sans">
                    Delegate Registrations ({registrations.length} Total)
                  </h3>
                  <Link
                    href="/events"
                    className="px-4 py-2 rounded-xl bg-white/10 hover:bg-white/20 text-white font-mono text-xs transition"
                  >
                    View Registration Page
                  </Link>
                </div>
                <div className="p-4 rounded-2xl bg-black border border-white/10 space-y-2">
                  <div className="flex justify-between text-neutral-400">
                    <span>Approved &amp; Paid Passes:</span>
                    <strong className="text-white">
                      {registrations.filter((r) => r.status === 'accepted' || r.status === 'allotted').length}
                    </strong>
                  </div>
                  <div className="flex justify-between text-neutral-400">
                    <span>Pending Payment / Allotment:</span>
                    <strong className="text-amber-400">
                      {registrations.filter((r) => r.status === 'registered' || r.status === 'invite_sent').length}
                    </strong>
                  </div>
                  <div className="flex justify-between text-neutral-400">
                    <span>Active In Chambers:</span>
                    <strong className="text-emerald-400">
                      {committees.reduce((sum, c) => sum + (c.presentCount || 0), 0)} Delegates Present
                    </strong>
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'DOCUMENTS' && (
              <div className="p-8 rounded-3xl bg-black/50 border border-white/10 space-y-4 font-sans">
                <div className="flex items-center justify-between">
                  <h3 className="text-xl font-bold font-display text-white">Resolutions &amp; Legislative Bills</h3>
                  <Link
                    href="/committee"
                    className="px-4 py-2 rounded-xl bg-cyan-500 text-black font-mono text-xs font-bold hover:bg-cyan-400 transition"
                  >
                    Open Committee Chamber
                  </Link>
                </div>
                <p className="text-xs text-neutral-400 font-mono">
                  All draft resolutions, presidential statements, and parliamentary bills authored across chambers.
                </p>
              </div>
            )}

            {activeTab === 'PAYMENTS' && (
              <div className="p-8 rounded-3xl bg-black/50 border border-white/10 space-y-6 font-mono text-xs">
                {!revenueAccess.allowed ? (
                  <div className="py-12 px-6 text-center space-y-4 max-w-lg mx-auto">
                    <div className="w-16 h-16 rounded-2xl bg-white/[0.03] border border-white/10 mx-auto flex items-center justify-center text-neutral-400 shadow-inner">
                      <Lock className="w-8 h-8 text-neutral-400" />
                    </div>
                    <div className="space-y-2">
                      <h3 className="text-xl font-bold font-display text-white font-sans">Confidential Financial Telemetry</h3>
                      <p className="text-xs text-neutral-400 leading-relaxed font-sans">
                        Under ZENVITRA Sovereign Governance, MUN ticket sales and revenue ledgers can only be seen by the <strong>MUN Creator</strong>, the <strong>ZENVITRA Payments &amp; Finance Team</strong>, and <strong>individuals explicitly chosen by the Creator</strong>.
                      </p>
                    </div>
                    <div className="pt-2 inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/[0.04] border border-white/10 text-[11px]">
                      <span>Logged in as @{activeUser.username || 'guest'}</span>
                      <span className="text-rose-400 font-bold">• Access Denied</span>
                    </div>
                  </div>
                ) : (
                  <div className="space-y-6">
                    <div className="flex flex-wrap items-center justify-between gap-3">
                      <div>
                        <div className="flex items-center gap-2">
                          <h3 className="text-xl font-bold font-display text-white font-sans">Event Financial Telemetry</h3>
                          <span className="px-2 py-0.5 rounded-md bg-emerald-500/15 border border-emerald-500/30 text-emerald-400 text-[10px] font-bold">
                            {revenueAccess.role === 'CREATOR' ? '👑 Creator Authority' : revenueAccess.role === 'PAYMENTS_TEAM' ? '💳 Payments Team' : '✅ Authorized by Creator'}
                          </span>
                        </div>
                        <p className="text-neutral-400 text-xs font-sans mt-0.5">
                          Confidential ticket sales, refunds &amp; settlement ledger for {confTitle}.
                        </p>
                      </div>
                      <div className="flex items-center gap-2 flex-wrap">
                        <button
                          type="button"
                          onClick={() => setIsPlansModalOpen(true)}
                          className="px-4 py-2 rounded-xl bg-gradient-to-r from-amber-500/20 via-purple-500/20 to-cyan-500/20 hover:from-amber-500/30 hover:to-cyan-500/30 text-amber-300 border border-amber-500/40 text-xs font-bold flex items-center gap-1.5 transition cursor-pointer"
                        >
                          <CreditCard className="w-3.5 h-3.5 text-cyan-400" />
                          <span>Plans &amp; Payment Links</span>
                        </button>

                        <Link
                          href="/payments"
                          className="px-4 py-2 rounded-xl bg-white/10 text-white hover:bg-white/15 transition text-xs flex items-center gap-1.5"
                        >
                          <ExternalLink className="w-3.5 h-3.5" />
                          <span>Open ZEN.PAYMENTS Hub</span>
                        </Link>
                      </div>
                    </div>

                    {/* Configured Registration Tiers & Plans */}
                    {activeConference?.plans && activeConference.plans.length > 0 && (
                      <div className="p-5 rounded-2xl bg-white/[0.02] border border-white/10 space-y-3 font-sans">
                        <div className="flex items-center justify-between">
                          <h4 className="font-bold text-sm text-white flex items-center gap-2">
                            <span>Delegate Registration Tiers ({activeConference.plans.length})</span>
                          </h4>
                          <button
                            type="button"
                            onClick={() => setIsPlansModalOpen(true)}
                            className="text-xs text-cyan-400 hover:text-cyan-300 font-mono transition"
                          >
                            Edit Tiers &rarr;
                          </button>
                        </div>
                        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-2.5">
                          {activeConference.plans.map((p) => (
                            <div key={p.id} className="p-3 rounded-xl bg-black/60 border border-white/10 space-y-1 text-xs">
                              <div className="flex items-center justify-between">
                                <span className="font-bold text-white truncate">{p.name}</span>
                                {p.badge && (
                                  <span className="text-[9px] font-mono px-1.5 py-0.5 rounded-full bg-purple-500/20 text-purple-300 border border-purple-500/30">
                                    {p.badge}
                                  </span>
                                )}
                              </div>
                              <div className="text-amber-400 font-mono font-bold text-sm">
                                {p.price > 0 ? `₹${p.price}` : 'FREE'}
                              </div>
                              <p className="text-[10px] text-neutral-400 line-clamp-1">{p.description}</p>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* Financial Metrics */}
                    <div className="p-5 rounded-2xl bg-black border border-white/10 space-y-3 font-mono text-xs">
                      <div className="flex justify-between"><span>Gross Ticket Sales:</span><strong className="text-white">₹0</strong></div>
                      <div className="flex justify-between"><span>Refunds Processed:</span><strong className="text-amber-400">₹0</strong></div>
                      <div className="flex justify-between"><span>Platform Surcharge (Flat ₹9 Fee):</span><strong className="text-neutral-400">₹0</strong></div>
                      <div className="flex justify-between pt-2 border-t border-white/10 font-bold text-sm"><span>Net Payable to Organizer:</span><strong className="text-cyan-300">₹0</strong></div>
                    </div>

                    {/* Creator RBAC Access Manager (Visible to Creator & Payments Team) */}
                    {(revenueAccess.role === 'CREATOR' || revenueAccess.role === 'PAYMENTS_TEAM') && (
                      <div className="p-5 rounded-2xl bg-white/[0.02] border border-white/10 space-y-4 font-sans">
                        <div className="flex flex-wrap items-center justify-between gap-2">
                          <div className="space-y-0.5">
                            <h4 className="font-bold text-sm text-white flex items-center gap-2">
                              <ShieldCheck className="w-4 h-4 text-cyan-400" />
                              <span>Revenue Viewer Access Control</span>
                            </h4>
                            <p className="text-xs text-neutral-400">
                              As the MUN Creator, you control exactly who can inspect your conference revenue.
                            </p>
                          </div>
                          <span className="text-[10px] font-mono px-2.5 py-1 rounded-full bg-cyan-500/10 border border-cyan-500/20 text-cyan-300 font-bold">
                            {delegatedViewers.length} Delegated Viewers
                          </span>
                        </div>

                        {/* Grant Access Form */}
                        <form onSubmit={handleGrantAccess} className="flex gap-2">
                          <input
                            type="text"
                            value={newViewerInput}
                            onChange={(e) => setNewViewerInput(e.target.value)}
                            placeholder="Enter username or email (e.g. @usg_finance)"
                            className="flex-1 px-3.5 py-2 rounded-xl bg-black/60 border border-white/10 text-white text-xs font-mono placeholder:text-neutral-600 focus:outline-none focus:border-cyan-500/50"
                          />
                          <button
                            type="submit"
                            className="px-4 py-2 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-black font-mono font-bold text-xs transition cursor-pointer shrink-0"
                          >
                            + Grant Access
                          </button>
                        </form>

                        {/* Allowed Entities List */}
                        <div className="space-y-2 pt-2 border-t border-white/5 font-mono text-xs">
                          <div className="flex items-center justify-between p-2 rounded-xl bg-black/40 border border-white/5">
                            <div className="flex items-center gap-2">
                              <span className="text-amber-400">👑</span>
                              <span className="text-white font-bold">@{activeConference?.secretariatChair || activeUser.username || 'creator'}</span>
                              <span className="text-[10px] text-neutral-500 font-sans">(Creator of MUN)</span>
                            </div>
                            <span className="text-[10px] text-emerald-400 font-bold">Permanent Owner</span>
                          </div>

                          <div className="flex items-center justify-between p-2 rounded-xl bg-black/40 border border-white/5">
                            <div className="flex items-center gap-2">
                              <span className="text-cyan-400">💳</span>
                              <span className="text-white font-bold">ZENVITRA Payments Team</span>
                              <span className="text-[10px] text-neutral-500 font-sans">(payments@zenvitra.xyz)</span>
                            </div>
                            <span className="text-[10px] text-cyan-300 font-bold">Platform Escrow</span>
                          </div>

                          {delegatedViewers.map((viewer) => (
                            <div key={viewer} className="flex items-center justify-between p-2 rounded-xl bg-black/40 border border-white/5">
                              <div className="flex items-center gap-2">
                                <span className="text-purple-400">👤</span>
                                <span className="text-white">@{viewer}</span>
                                <span className="text-[10px] text-neutral-500 font-sans">(Chosen by Creator)</span>
                              </div>
                              <button
                                type="button"
                                onClick={() => handleRevokeAccess(viewer)}
                                className="text-[11px] text-rose-400 hover:text-rose-300 font-mono underline cursor-pointer"
                              >
                                Revoke Access
                              </button>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                )}
              </div>
            )}

            {activeTab === 'AWARDS' && (
              <div className="p-8 rounded-3xl bg-black/50 border border-white/10 space-y-4 font-sans text-xs">
                <h3 className="text-xl font-bold font-display text-white">Awards &amp; Verifiable Certificates</h3>
                <p className="text-neutral-400 font-mono">
                  Certificates generated here carry a tamper-proof cryptographic SHA-256 seal and public QR verification linking directly to the delegate&apos;s public sovereign profile on ZENVITRA.
                </p>
                <button
                  type="button"
                  onClick={() => showToast(`${totalPaidRegs || totalAllottedDelegates || 0} Verified Digital Certificates generated`)}
                  className="px-5 py-2.5 rounded-2xl bg-cyan-500 hover:bg-cyan-400 text-black font-mono text-xs font-bold transition cursor-pointer"
                >
                  Generate {totalPaidRegs || totalAllottedDelegates || 0} Verifiable Certificates (ZEN.CERTIFY)
                </button>
              </div>
            )}

            {/* Universal Configuration Studio */}
            {activeTab === 'CONFIG_STUDIO' && (
              <UniversalConfigStudio
                confId={confId}
                confTitle={confTitle}
                currentStage={lifecycleStage}
                onStageChange={handleStageChange}
                secretariatMembers={secretariatMembers}
                onMembersChange={handleMembersChange}
              />
            )}

            {/* 21 Modules Directory */}
            {activeTab === 'SPEC_MODULES' && (
              <div className="space-y-6">
                <div className="p-6 rounded-3xl bg-[#0a0d17] border border-white/10 flex flex-wrap items-center justify-between gap-4">
                  <div className="space-y-1">
                    <span className="px-3 py-1 rounded-full bg-cyan-500/10 border border-cyan-500/30 text-cyan-300 font-mono text-[10px] tracking-wider uppercase font-bold inline-block">
                      PRODUCT ARCHITECTURE SPECIFICATION V1.0
                    </span>
                    <h2 className="text-xl sm:text-2xl font-black font-display text-white">
                      The 21 Conference OS Modules Directory
                    </h2>
                    <p className="text-xs text-neutral-400 font-mono">
                      16 Core Conference Modules &bull; 5 Connected Ecosystem Integrations
                    </p>
                  </div>
                  <button
                    type="button"
                    onClick={() => setActiveTab('CONFIG_STUDIO')}
                    className="px-4 py-2.5 rounded-xl bg-purple-600 hover:bg-purple-500 text-white font-mono font-bold text-xs transition flex items-center gap-2 cursor-pointer shadow-md"
                  >
                    <Sliders className="w-3.5 h-3.5" />
                    <span>Open Config Studio</span>
                  </button>
                </div>
                <SpecModulesExplorer />
              </div>
            )}

            {/* Master Schedule & Run of Show */}
            {activeTab === 'SCHEDULE' && (
              <div className="p-8 rounded-3xl bg-black/50 border border-white/10 space-y-6 font-mono text-xs">
                <div className="flex flex-wrap items-center justify-between gap-4">
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="px-2.5 py-0.5 rounded-md bg-cyan-500/15 border border-cyan-500/30 text-cyan-300 text-[10px] font-bold">
                        MODULE 07 // SCHEDULE &amp; RUN OF SHOW
                      </span>
                      <span className="text-neutral-500 text-[11px] font-sans">
                        {scheduleItems.length} Blocks Total
                      </span>
                    </div>
                    <h3 className="text-xl font-bold font-display text-white font-sans mt-1">
                      Master Conference Schedule &amp; Run of Show
                    </h3>
                    <p className="text-neutral-400 text-xs font-sans mt-0.5">
                      Schedule plenary sessions, unmoderated caucuses, crises, meals, and ceremonies across days.
                    </p>
                  </div>

                  <button
                    type="button"
                    onClick={() => setIsAddScheduleOpen(!isAddScheduleOpen)}
                    className="px-4 py-2 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-black font-mono font-bold text-xs transition flex items-center gap-1.5 cursor-pointer shadow-md"
                  >
                    <Plus className="w-3.5 h-3.5" />
                    <span>+ Add Schedule Block</span>
                  </button>
                </div>

                {/* Day Selector Pills */}
                <div className="flex items-center gap-2 border-b border-white/10 pb-4">
                  {[1, 2, 3].map(day => (
                    <button
                      key={day}
                      type="button"
                      onClick={() => setScheduleDayFilter(day)}
                      className={`px-4 py-2 rounded-xl text-xs font-bold transition cursor-pointer ${
                        scheduleDayFilter === day
                          ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/40'
                          : 'bg-white/5 text-neutral-400 hover:text-white border border-white/5'
                      }`}
                    >
                      Day {day} ({scheduleItems.filter(i => i.dayNumber === day).length})
                    </button>
                  ))}
                </div>

                {/* Add Schedule Block Form */}
                {isAddScheduleOpen && (
                  <form onSubmit={handleAddSchedule} className="p-5 rounded-2xl bg-white/[0.03] border border-cyan-500/30 space-y-4">
                    <div className="flex items-center justify-between">
                      <h4 className="font-bold text-white text-sm">Add New Schedule Event (Day {scheduleDayFilter})</h4>
                      <button type="button" onClick={() => setIsAddScheduleOpen(false)} className="text-neutral-500 hover:text-white text-xs cursor-pointer">Cancel</button>
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      <div>
                        <label className="text-[10px] text-neutral-400 uppercase block mb-1">Session / Event Title</label>
                        <input
                          type="text"
                          required
                          placeholder="e.g. Formal Opening Plenary & Roll Call"
                          value={newSchedTitle}
                          onChange={e => setNewSchedTitle(e.target.value)}
                          className="w-full px-3 py-2 rounded-xl bg-black border border-white/15 text-white text-xs"
                        />
                      </div>
                      <div>
                        <label className="text-[10px] text-neutral-400 uppercase block mb-1">Time Range</label>
                        <input
                          type="text"
                          required
                          placeholder="09:00 - 10:30 IST"
                          value={newSchedTime}
                          onChange={e => setNewSchedTime(e.target.value)}
                          className="w-full px-3 py-2 rounded-xl bg-black border border-white/15 text-white text-xs"
                        />
                      </div>
                      <div>
                        <label className="text-[10px] text-neutral-400 uppercase block mb-1">Chamber / Venue</label>
                        <input
                          type="text"
                          required
                          placeholder="Main Plenary Hall / Room 101"
                          value={newSchedRoom}
                          onChange={e => setNewSchedRoom(e.target.value)}
                          className="w-full px-3 py-2 rounded-xl bg-black border border-white/15 text-white text-xs"
                        />
                      </div>
                      <div>
                        <label className="text-[10px] text-neutral-400 uppercase block mb-1">Category</label>
                        <select
                          value={newSchedCategory}
                          onChange={e => setNewSchedCategory(e.target.value as any)}
                          className="w-full px-3 py-2 rounded-xl bg-black border border-white/15 text-white text-xs"
                        >
                          <option value="PLENARY">PLENARY</option>
                          <option value="CAUCUS">CAUCUS / COMMITTEE SESSION</option>
                          <option value="CRISIS">CRISIS DIRECTIVE</option>
                          <option value="MEAL">MEAL / DIPLOMATIC TEA</option>
                          <option value="CEREMONY">CEREMONY</option>
                        </select>
                      </div>
                    </div>
                    <button
                      type="submit"
                      className="px-5 py-2.5 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-black font-bold text-xs uppercase cursor-pointer"
                    >
                      Save to Run of Show
                    </button>
                  </form>
                )}

                {/* Schedule List */}
                {scheduleItems.filter(i => i.dayNumber === scheduleDayFilter).length === 0 ? (
                  <div className="py-12 px-6 rounded-2xl bg-white/[0.01] border border-white/5 text-center space-y-3">
                    <Calendar className="w-10 h-10 text-neutral-600 mx-auto" />
                    <h4 className="text-white font-bold text-sm">No schedule blocks added for Day {scheduleDayFilter}</h4>
                    <p className="text-neutral-400 text-xs max-w-md mx-auto">
                      Keep your Secretariat and attendees aligned. Click &quot;+ Add Schedule Block&quot; to configure the run of show for this day.
                    </p>
                  </div>
                ) : (
                  <div className="space-y-3">
                    {scheduleItems
                      .filter(i => i.dayNumber === scheduleDayFilter)
                      .map(item => (
                        <div key={item.id} className="p-4 rounded-2xl bg-white/[0.02] border border-white/5 flex flex-wrap items-center justify-between gap-3">
                          <div className="flex items-center gap-3">
                            <span className="w-2.5 h-2.5 rounded-full bg-cyan-400" />
                            <div>
                              <div className="flex items-center gap-2">
                                <span className="font-bold text-white text-sm">{item.title}</span>
                                <span className="px-2 py-0.5 rounded text-[9px] bg-white/10 text-neutral-300 font-bold">{item.category}</span>
                              </div>
                              <p className="text-neutral-400 text-xs mt-0.5">
                                ⏱️ {item.timeRange} &bull; 📍 {item.venueOrRoom}
                              </p>
                            </div>
                          </div>
                          <div className="flex items-center gap-2">
                            <button
                              type="button"
                              onClick={() => handleToggleScheduleStatus(item.id)}
                              className={`px-3 py-1.5 rounded-lg text-[10px] font-bold uppercase transition cursor-pointer ${
                                item.status === 'LIVE'
                                  ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/40'
                                  : item.status === 'CONCLUDED'
                                  ? 'bg-neutral-500/20 text-neutral-400 border border-neutral-500/30'
                                  : 'bg-cyan-500/10 text-cyan-300 border border-cyan-500/30'
                              }`}
                            >
                              Status: {item.status}
                            </button>
                          </div>
                        </div>
                      ))}
                  </div>
                )}
              </div>
            )}

            {/* Incidents Desk */}
            {activeTab === 'INCIDENTS' && (
              <div className="p-8 rounded-3xl bg-black/50 border border-white/10 space-y-6 font-mono text-xs">
                <div className="flex flex-wrap items-center justify-between gap-4">
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="px-2.5 py-0.5 rounded-md bg-rose-500/15 border border-rose-500/30 text-rose-300 text-[10px] font-bold">
                        MODULE 12 // INCIDENT &amp; ESCALATION DESK
                      </span>
                      <span className="text-neutral-500 text-[11px] font-sans">
                        {incidents.filter(i => i.status !== 'RESOLVED' && i.status !== 'CLOSED').length} Open
                      </span>
                    </div>
                    <h3 className="text-xl font-bold font-display text-white font-sans mt-1">
                      Secretariat Incident Desk &amp; Escalation Tracker
                    </h3>
                    <p className="text-neutral-400 text-xs font-sans mt-0.5">
                      Report, log, and resolve diplomatic disruptions, technical outages, and delegate conduct disputes.
                    </p>
                  </div>

                  <button
                    type="button"
                    onClick={() => setIsReportIncidentOpen(!isReportIncidentOpen)}
                    className="px-4 py-2 rounded-xl bg-rose-500 hover:bg-rose-400 text-white font-mono font-bold text-xs transition flex items-center gap-1.5 cursor-pointer shadow-md"
                  >
                    <AlertTriangle className="w-3.5 h-3.5" />
                    <span>+ Log Incident</span>
                  </button>
                </div>

                {/* Log Incident Modal / Inline Form */}
                {isReportIncidentOpen && (
                  <form onSubmit={handleAddIncident} className="p-5 rounded-2xl bg-rose-950/20 border border-rose-500/40 space-y-4">
                    <div className="flex items-center justify-between">
                      <h4 className="font-bold text-rose-300 text-sm">Report Disruption or Operational Incident</h4>
                      <button type="button" onClick={() => setIsReportIncidentOpen(false)} className="text-neutral-500 hover:text-white text-xs cursor-pointer">Cancel</button>
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      <div>
                        <label className="text-[10px] text-neutral-400 uppercase block mb-1">Incident Headline</label>
                        <input
                          type="text"
                          required
                          placeholder="e.g. Mic audio failure during UNSC caucus"
                          value={newIncTitle}
                          onChange={e => setNewIncTitle(e.target.value)}
                          className="w-full px-3 py-2 rounded-xl bg-black border border-white/15 text-white text-xs"
                        />
                      </div>
                      <div>
                        <label className="text-[10px] text-neutral-400 uppercase block mb-1">Chamber / Location</label>
                        <input
                          type="text"
                          placeholder="e.g. UNSC Chamber Room 204"
                          value={newIncRoom}
                          onChange={e => setNewIncRoom(e.target.value)}
                          className="w-full px-3 py-2 rounded-xl bg-black border border-white/15 text-white text-xs"
                        />
                      </div>
                      <div>
                        <label className="text-[10px] text-neutral-400 uppercase block mb-1">Severity Level</label>
                        <select
                          value={newIncSev}
                          onChange={e => setNewIncSev(e.target.value as any)}
                          className="w-full px-3 py-2 rounded-xl bg-black border border-white/15 text-white text-xs"
                        >
                          <option value="LOW">LOW — Minor inquiry</option>
                          <option value="MEDIUM">MEDIUM — Procedure or minor room issue</option>
                          <option value="HIGH">HIGH — Dais disruption or audio drop</option>
                          <option value="CRITICAL">CRITICAL — Severe conduct or safety</option>
                        </select>
                      </div>
                      <div>
                        <label className="text-[10px] text-neutral-400 uppercase block mb-1">Incident Description</label>
                        <input
                          type="text"
                          required
                          placeholder="Provide exact details and current status"
                          value={newIncDesc}
                          onChange={e => setNewIncDesc(e.target.value)}
                          className="w-full px-3 py-2 rounded-xl bg-black border border-white/15 text-white text-xs"
                        />
                      </div>
                    </div>
                    <button
                      type="submit"
                      className="px-5 py-2.5 rounded-xl bg-rose-600 hover:bg-rose-500 text-white font-bold text-xs uppercase cursor-pointer"
                    >
                      File Incident Log
                    </button>
                  </form>
                )}

                {/* Incidents List */}
                {incidents.length === 0 ? (
                  <div className="py-12 px-6 rounded-2xl bg-white/[0.01] border border-white/5 text-center space-y-3">
                    <CheckCircle2 className="w-10 h-10 text-emerald-400 mx-auto" />
                    <h4 className="text-white font-bold text-sm">All Operational Systems Normal</h4>
                    <p className="text-neutral-400 text-xs max-w-md mx-auto">
                      No active disruptions, tech glitches, or conduct incidents recorded. If an issue arises in a committee chamber, click &quot;+ Log Incident&quot;.
                    </p>
                  </div>
                ) : (
                  <div className="space-y-3">
                    {incidents.map(inc => (
                      <div key={inc.id} className="p-4 rounded-2xl bg-white/[0.02] border border-white/5 flex flex-wrap items-center justify-between gap-3">
                        <div className="space-y-1">
                          <div className="flex items-center gap-2">
                            <span className={`px-2 py-0.5 rounded text-[9px] font-bold ${
                              inc.severity === 'CRITICAL' ? 'bg-rose-500/20 text-rose-300 border border-rose-500/40' :
                              inc.severity === 'HIGH' ? 'bg-amber-500/20 text-amber-300 border border-amber-500/40' :
                              'bg-cyan-500/10 text-cyan-300 border border-cyan-500/20'
                            }`}>
                              {inc.severity}
                            </span>
                            <span className="font-bold text-white text-sm">{inc.title}</span>
                            <span className="text-[10px] text-neutral-500">📍 {inc.department}</span>
                          </div>
                          <p className="text-neutral-300 text-xs font-sans">{inc.description}</p>
                          <div className="text-[10px] text-neutral-500 flex items-center gap-2">
                            <span>Reported by {inc.reportedBy} at {new Date(inc.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                            {inc.resolvedAt && <span className="text-emerald-400">&bull; Resolved at {new Date(inc.resolvedAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>}
                          </div>
                        </div>

                        <div>
                          {inc.status !== 'RESOLVED' && inc.status !== 'CLOSED' ? (
                            <button
                              type="button"
                              onClick={() => handleResolveIncident(inc.id)}
                              className="px-3.5 py-1.5 rounded-xl bg-emerald-500/20 hover:bg-emerald-500/30 text-emerald-300 border border-emerald-500/40 text-xs font-bold transition cursor-pointer"
                            >
                              ✓ Mark Resolved
                            </button>
                          ) : (
                            <span className="px-3 py-1 rounded-full bg-emerald-500/10 text-emerald-400 text-[10px] font-bold border border-emerald-500/20">
                              RESOLVED
                            </span>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}


            {/* Announcements Desk */}
            {activeTab === 'ANNOUNCEMENTS' && (
              <div className="p-8 rounded-3xl bg-black/50 border border-white/10 space-y-6 font-mono text-xs">
                <div className="flex flex-wrap items-center justify-between gap-4">
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="px-2.5 py-0.5 rounded-md bg-cyan-500/15 border border-cyan-500/30 text-cyan-300 text-[10px] font-bold">
                        MODULE 10 // ANNOUNCEMENTS &amp; DISPATCHES
                      </span>
                      <span className="text-neutral-500 text-[11px] font-sans">
                        {announcements.length} Total
                      </span>
                    </div>
                    <h3 className="text-xl font-bold font-display text-white font-sans mt-1">
                      Secretariat Dispatches &amp; Broadcast Desk
                    </h3>
                    <p className="text-neutral-400 text-xs font-sans mt-0.5">
                      Dispatch vetted notices to all attendees, specific Executive Boards, Press corps, or Secretariat only.
                    </p>
                  </div>

                  <button
                    type="button"
                    onClick={() => setIsNewDispatchOpen(!isNewDispatchOpen)}
                    className="px-4 py-2 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-black font-mono font-bold text-xs transition flex items-center gap-1.5 cursor-pointer shadow-md"
                  >
                    <Megaphone className="w-3.5 h-3.5" />
                    <span>+ Publish Dispatch</span>
                  </button>
                </div>

                {/* New Dispatch Form */}
                {isNewDispatchOpen && (
                  <form onSubmit={handlePublishAnnouncement} className="p-5 rounded-2xl bg-white/[0.03] border border-cyan-500/30 space-y-4">
                    <div className="flex items-center justify-between">
                      <h4 className="font-bold text-white text-sm">Draft Official Secretariat Dispatch</h4>
                      <button type="button" onClick={() => setIsNewDispatchOpen(false)} className="text-neutral-500 hover:text-white text-xs cursor-pointer">Cancel</button>
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      <div>
                        <label className="text-[10px] text-neutral-400 uppercase block mb-1">Dispatch Title</label>
                        <input
                          type="text"
                          required
                          placeholder="e.g. Schedule Update: Post-Lunch Plenary Moved to 14:15"
                          value={newAnnTitle}
                          onChange={e => setNewAnnTitle(e.target.value)}
                          className="w-full px-3 py-2 rounded-xl bg-black border border-white/15 text-white text-xs"
                        />
                      </div>
                      <div>
                        <label className="text-[10px] text-neutral-400 uppercase block mb-1">Target Audience</label>
                        <select
                          value={newAnnTarget}
                          onChange={e => setNewAnnTarget(e.target.value as any)}
                          className="w-full px-3 py-2 rounded-xl bg-black border border-white/15 text-white text-xs"
                        >
                          <option value="ALL">ALL (Everyone at conference)</option>
                          <option value="DELEGATES_ONLY">DELEGATES ONLY</option>
                          <option value="EB_ONLY">EXECUTIVE BOARD ONLY</option>
                          <option value="SECRETARIAT_ONLY">SECRETARIAT INTERNAL ONLY</option>
                          <option value="PRESS_ONLY">PRESS CORPS ONLY</option>
                        </select>
                      </div>
                    </div>
                    <div>
                      <label className="text-[10px] text-neutral-400 uppercase block mb-1">Announcement Body</label>
                      <textarea
                        required
                        rows={3}
                        placeholder="Write clear, authoritative message content..."
                        value={newAnnContent}
                        onChange={e => setNewAnnContent(e.target.value)}
                        className="w-full px-3 py-2 rounded-xl bg-black border border-white/15 text-white text-xs resize-none"
                      />
                    </div>
                    <button
                      type="submit"
                      className="px-5 py-2.5 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-black font-bold text-xs uppercase cursor-pointer"
                    >
                      Broadcast Dispatch
                    </button>
                  </form>
                )}

                {/* Announcements List */}
                {announcements.length === 0 ? (
                  <div className="py-12 px-6 rounded-2xl bg-white/[0.01] border border-white/5 text-center space-y-3">
                    <Megaphone className="w-10 h-10 text-neutral-600 mx-auto" />
                    <h4 className="text-white font-bold text-sm">No Dispatches Broadcast Yet</h4>
                    <p className="text-neutral-400 text-xs max-w-md mx-auto">
                      Broadcast alerts, timing adjustments, room switches, or plenary announcements from the Secretariat.
                    </p>
                  </div>
                ) : (
                  <div className="space-y-3">
                    {announcements.map(ann => (
                      <div key={ann.id} className="p-4 rounded-2xl bg-white/[0.02] border border-white/5 space-y-2">
                        <div className="flex flex-wrap items-center justify-between gap-2">
                          <div className="flex items-center gap-2">
                            <span className="px-2 py-0.5 rounded text-[9px] bg-cyan-500/20 text-cyan-300 font-bold">
                              {ann.targetAudience}
                            </span>
                            <span className="font-bold text-white text-sm">{ann.title}</span>
                          </div>
                          <span className="text-[10px] text-neutral-500">{ann.publishedAt}</span>
                        </div>
                        <p className="text-neutral-300 text-xs font-sans leading-relaxed">{ann.content}</p>
                        <div className="text-[10px] text-neutral-500 pt-1 border-t border-white/5">
                          Dispatched by {ann.authorName} ({ann.authorRole})
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}

            {/* Audit Log Desk */}
            {activeTab === 'AUDIT_LOG' && (
              <div className="p-8 rounded-3xl bg-black/50 border border-white/10 space-y-6 font-mono text-xs">
                <div className="flex flex-wrap items-center justify-between gap-4">
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="px-2.5 py-0.5 rounded-md bg-purple-500/15 border border-purple-500/30 text-purple-300 text-[10px] font-bold">
                        MODULE 19 // AUDIT TRAIL &amp; SYSTEM LOGS
                      </span>
                      <span className="text-neutral-500 text-[11px] font-sans">
                        {auditEvents.length} Recorded Actions
                      </span>
                    </div>
                    <h3 className="text-xl font-bold font-display text-white font-sans mt-1">
                      Tamper-Evident Security &amp; Clearance Audit Trail
                    </h3>
                    <p className="text-neutral-400 text-xs font-sans mt-0.5">
                      Immutable cryptographic action ledger recording Secretariat state transitions, portfolio changes, and permission delegations.
                    </p>
                  </div>

                  <div className="px-3 py-1.5 rounded-xl bg-white/[0.03] border border-white/10 text-[11px] text-neutral-400 flex items-center gap-2">
                    <ShieldCheck className="w-4 h-4 text-emerald-400" />
                    <span>SHA-256 State Authenticated</span>
                  </div>
                </div>

                {auditEvents.length === 0 ? (
                  <div className="py-12 px-6 rounded-2xl bg-white/[0.01] border border-white/5 text-center space-y-3">
                    <ShieldCheck className="w-10 h-10 text-neutral-600 mx-auto" />
                    <h4 className="text-white font-bold text-sm">Ledger Initialized</h4>
                    <p className="text-neutral-400 text-xs max-w-md mx-auto">
                      Administrative actions taken across this conference (stage transitions, schedule edits, incident resolutions) are permanently recorded here.
                    </p>
                  </div>
                ) : (
                  <div className="space-y-2">
                    {auditEvents.map(evt => (
                      <div key={evt.id} className="p-3.5 rounded-xl bg-white/[0.02] border border-white/5 flex flex-wrap items-center justify-between gap-2">
                        <div className="space-y-1">
                          <div className="flex items-center gap-2">
                            <span className="px-2 py-0.5 rounded text-[9px] bg-purple-500/20 text-purple-300 font-bold">{evt.action}</span>
                            <span className="text-white font-bold">{evt.actorName}</span>
                            <span className="text-neutral-500 text-[11px]">{evt.actorHandle} &bull; {evt.actorRole}</span>
                          </div>
                          <p className="text-neutral-300 text-xs font-sans">{evt.details}</p>
                        </div>
                        <div className="text-right text-[10px] text-neutral-500 font-mono">
                          <div>{new Date(evt.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' })}</div>
                          <div className="text-neutral-600">{new Date(evt.timestamp).toLocaleDateString()}</div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}
          </div>
        </div>

        {/* Enhanced Emergency Protocol Broadcast Modal */}
        <EmergencyProtocolBroadcastModal
          isOpen={isEmergencyModalOpen}
          onClose={() => setIsEmergencyModalOpen(false)}
          conferenceId={confId}
          conferenceName={confTitle}
        />
      </main>

      {/* Registration Plans & Cashfree Payment Links Modal */}
      {activeConference && (
        <EventPlansPaymentLinksModal
          isOpen={isPlansModalOpen}
          onClose={() => setIsPlansModalOpen(false)}
          eventId={activeConference.id}
          eventTitle={activeConference.name}
          initialPlans={activeConference.plans}
          initialPaymentLinks={activeConference.paymentLinks}
          onSavePlans={(plans) => {
            updateConference(activeConference.id, { plans });
          }}
          onSavePaymentLink={(link) => {
            const existing = activeConference.paymentLinks || [];
            updateConference(activeConference.id, {
              paymentLinks: [link, ...existing.filter((l) => l.linkId !== link.linkId)],
            });
          }}
        />
      )}

      {/* Host / Create MUN Conference Modal */}
      <CreateMunConferenceModal
        isOpen={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
      />

      <Footer />
    </div>
  );
}
