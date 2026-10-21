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
  ArrowLeft,
  ArrowUpRight,
  Clock,
  Check,
  ExternalLink,
  Filter,
  CheckCircle,
  XCircle,
  CornerDownRight,
  Bookmark,
  Briefcase,
  Share2,
  Crown,
  Zap,
  Volume2,
  VolumeX,
  QrCode,
  GraduationCap,
  Power,
  RotateCw,
  MapPin,
  Trash2,
  Eye,
  Award,
  Building,
  Ticket,
  Link2
} from 'lucide-react';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import { broadcastActivitySync } from '@/lib/reactiveActivityHub';
import { 
  verifyAdminKey, 
  verifyFounderKey, 
  activateAdminSession, 
  activateFounderSession, 
  addAuditLog, 
  saveProtocolControls, 
  useProtocolControls,
  isAdmin,
  isFounder,
  isAdminSessionActive,
  isFounderSessionActive
} from '@/lib/founderControl';
import { useZenPulse } from '@/context/ZenPulsePlatformContext';
import { useMun } from '@/context/MunContext';
import { 
  ADMIN_SECTIONS, 
  STAFF_ROLES, 
  AdminSectionId, 
  StaffRole,
  AdminTaskItem,
  AdminApplicationItem,
  AdminContentReportItem,
  AdminSupportTicketItem,
  AdminEscalationItem,
  AdminRecentAction
} from '@/types/admin';
import { StaffSupportWorkspace } from '@/components/support/StaffSupportWorkspace';

export function ZenAdminControlRoom() {
  const { user, profile, isLoading: authLoading, isAuthenticated: userIsLoggedIn } = useAuth();
  const router = useRouter();
  const searchParams = useSearchParams();
  const { profiles } = useZenPulse();
  const protocols = useProtocolControls();
  const { conferences, createConference } = useMun();
  const currentEventTitle = conferences[0]?.name || 'Active Conference Assembly';

  // Active Section (12 Operations Sections)
  const [activeSection, setActiveSection] = useState<AdminSectionId>('01_dashboard');

  // Sync activeSection with URL search parameter hydration-safely
  useEffect(() => {
    const urlSec = searchParams?.get('section') as AdminSectionId | null;
    if (urlSec && ADMIN_SECTIONS.some((s) => s.id === urlSec)) {
      setActiveSection(urlSec);
    } else {
      try {
        const saved = sessionStorage.getItem('zenvitra_admin_section') as AdminSectionId;
        if (saved && ADMIN_SECTIONS.some((s) => s.id === saved)) {
          setActiveSection(saved);
        }
      } catch (_) {}
    }
  }, [searchParams]);

  const selectSection = (secId: AdminSectionId) => {
    setActiveSection(secId);
    try {
      sessionStorage.setItem('zenvitra_admin_section', secId);
      if (typeof window !== 'undefined') {
        window.history.replaceState(null, '', `?section=${secId}`);
      }
    } catch (_) {}
  };

  // Access Passcode State
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [accessPasscode, setAccessPasscode] = useState('');
  const [authError, setAuthError] = useState<string | null>(null);
  const currentStaffName = useMemo(() => {
    if (profile?.display_name) return profile.display_name;
    if (user?.name) return user.name;
    if (profile?.username) return `@${profile.username}`;
    return 'Staff Administrator';
  }, [profile, user]);

  const [operatorIdentity, setOperatorIdentity] = useState<string>(() => currentStaffName);
  const [activeRole, setActiveRole] = useState<StaffRole>('Super Admin');

  // Sync operator identity when user/profile loads
  useEffect(() => {
    if (currentStaffName && currentStaffName !== 'Staff Administrator') {
      setOperatorIdentity((prev) => (prev !== currentStaffName ? currentStaffName : prev));
    }
  }, [currentStaffName]);



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

  // Auto-unlock if session active
  useEffect(() => {
    if (isAdminSessionActive() || isFounderSessionActive()) {
      setIsAuthenticated(true);
      if (isFounderSessionActive()) {
        const founderLabel = profile?.display_name ? `${profile.display_name} (Founder Mode)` : '@yuveer (Founder Mode)';
        setOperatorIdentity((prev) => (prev !== founderLabel ? founderLabel : prev));
      } else {
        const adminLabel = profile?.display_name ? `${profile.display_name} (Staff Admin)` : currentStaffName;
        setOperatorIdentity((prev) => (prev !== adminLabel ? adminLabel : prev));
      }
    }
  }, [profile?.display_name, currentStaffName]);

  // Feedback Notification Toast
  const [feedback, setFeedback] = useState<string | null>(null);
  const notify = (msg: string) => {
    setFeedback(msg);
    setTimeout(() => setFeedback(null), 3500);
  };

  /* ── 01: DASHBOARD STATE (CLEAN ZERO-SEEDED LIVE PLATFORM) ── */
  const [tasks, setTasks] = useState<AdminTaskItem[]>(() => {
    if (typeof window === 'undefined') return [];
    try {
      const stored = localStorage.getItem('zenvitra_admin_tasks');
      return stored ? JSON.parse(stored) : [];
    } catch {
      return [];
    }
  });

  const [applications, setApplications] = useState<AdminApplicationItem[]>(() => {
    if (typeof window === 'undefined') return [];
    try {
      const stored = localStorage.getItem('zenvitra_admin_applications');
      return stored ? JSON.parse(stored) : [];
    } catch {
      return [];
    }
  });

  const [contentReports, setContentReports] = useState<AdminContentReportItem[]>(() => {
    if (typeof window === 'undefined') return [];
    try {
      const stored = localStorage.getItem('zenvitra_admin_reports');
      return stored ? JSON.parse(stored) : [];
    } catch {
      return [];
    }
  });

  const [supportTickets, setSupportTickets] = useState<AdminSupportTicketItem[]>(() => {
    if (typeof window === 'undefined') return [];
    try {
      const stored = localStorage.getItem('zenvitra_admin_tickets');
      return stored ? JSON.parse(stored) : [];
    } catch {
      return [];
    }
  });

  const [escalations, setEscalations] = useState<AdminEscalationItem[]>(() => {
    if (typeof window === 'undefined') return [];
    try {
      const stored = localStorage.getItem('zenvitra_admin_escalations');
      return stored ? JSON.parse(stored) : [];
    } catch {
      return [];
    }
  });

  const [recentActions, setRecentActions] = useState<AdminRecentAction[]>(() => {
    if (typeof window === 'undefined') return [];
    try {
      const stored = localStorage.getItem('zenvitra_admin_actions');
      return stored ? JSON.parse(stored) : [];
    } catch {
      return [];
    }
  });

  /* Event Operations Timing & Gate Scanner State */
  const [targetEventTime] = useState<Date>(() => {
    const now = new Date();
    now.setHours(9, 0, 0, 0);
    return now;
  });
  const [currentTime, setCurrentTime] = useState<Date>(new Date());
  const [adminManualGateArmed, setAdminManualGateArmed] = useState<boolean>(false);
  const [scannerSoundEnabled, setScannerSoundEnabled] = useState<boolean>(true);
  const [checkedInCount, setCheckedInCount] = useState<number>(0);
  const [checkedInCodes, setCheckedInCodes] = useState<Set<string>>(() => new Set());
  const [scannerTokenInput, setScannerTokenInput] = useState('');
  const [scannerResult, setScannerResult] = useState<{
    status: 'success' | 'warning' | 'error';
    name: string;
    handle: string;
    school: string;
    ageCategory: 'STUDENT' | 'GENERAL';
    gstStatus: string;
    event: string;
    committee: string;
    seat: string;
    gateTerminal: string;
    ticketId: string;
    securityHash: string;
    message: string;
    timestamp: string;
  } | null>(null);

  // Live Clock Tick for Gate Timing
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const isEventStarted = currentTime.getTime() >= targetEventTime.getTime();
  const isGateArmed = isEventStarted || adminManualGateArmed;

  const timeDifferenceMs = targetEventTime.getTime() - currentTime.getTime();
  const adminCountdownFormatted = useMemo(() => {
    if (timeDifferenceMs <= 0) return '00:00:00 (DOORS OFFICIALLY OPEN)';
    const totalSecs = Math.floor(timeDifferenceMs / 1000);
    const hours = Math.floor(totalSecs / 3600);
    const minutes = Math.floor((totalSecs % 3600) / 60);
    const seconds = totalSecs % 60;
    return `${hours.toString().padStart(2, '0')}h : ${minutes.toString().padStart(2, '0')}m : ${seconds.toString().padStart(2, '0')}s`;
  }, [timeDifferenceMs]);

  /* New Escalation Form State */
  const [newEscalationTitle, setNewEscalationTitle] = useState('');
  const [newEscalationDesc, setNewEscalationDesc] = useState('');
  const [newEscalationDept, setNewEscalationDept] = useState('Finance & Payments');
  const [isEscalatingOpen, setIsEscalatingOpen] = useState(false);

  /* Conference & Event Verification Desk State */
  interface ConferenceListingItem {
    id: string;
    slug: string;
    title: string;
    shortName: string;
    category: string;
    format: string;
    venue: string;
    city: string;
    startDate: string;
    endDate: string;
    organizerName: string;
    organizerEmail: string;
    organizerPhone?: string | null;
    organizerHandle?: string | null;
    institution?: string | null;
    description: string;
    coverImage?: string | null;
    ticketPrice: number;
    tierPlansJson?: string | null;
    committeesJson?: string | null;
    status: 'PENDING' | 'VERIFIED' | 'REJECTED';
    verified: boolean;
    verifiedAt?: string | null;
    verifiedBy?: string | null;
    createdAt?: string;
  }

  const [conferenceListings, setConferenceListings] = useState<ConferenceListingItem[]>([]);
  const [isLoadingListings, setIsLoadingListings] = useState(false);
  const [listingsFilter, setListingsFilter] = useState<'ALL' | 'PENDING' | 'VERIFIED' | 'REJECTED'>('ALL');
  const [verifyingId, setVerifyingId] = useState<string | null>(null);

  const fetchConferenceListings = useCallback(async () => {
    setIsLoadingListings(true);
    try {
      const res = await fetch('/api/events/list?status=ALL');
      const data = await res.json();
      if (data.success && Array.isArray(data.listings)) {
        setConferenceListings(data.listings);
      }
    } catch (err) {
      console.error('Failed to fetch conference listings:', err);
    } finally {
      setIsLoadingListings(false);
    }
  }, []);

  useEffect(() => {
    fetchConferenceListings();
  }, [fetchConferenceListings]);

  const pendingListingsCount = useMemo(() => {
    return conferenceListings.filter((l) => l.status === 'PENDING').length;
  }, [conferenceListings]);

  const handleVerifyListing = async (listing: ConferenceListingItem) => {
    setVerifyingId(listing.id);
    try {
      const res = await fetch(`/api/events/list/${listing.id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          status: 'VERIFIED',
          verifiedBy: operatorIdentity || 'Lead Staff Admin',
        }),
      });
      const data = await res.json();
      if (data.success) {
        notify(`Conference "${listing.title}" is verified and now LIVE globally!`);
        setConferenceListings((prev) =>
          prev.map((item) =>
            item.id === listing.id
              ? { ...item, status: 'VERIFIED', verified: true, verifiedAt: new Date().toISOString(), verifiedBy: operatorIdentity }
              : item
          )
        );

        let parsedTiers: any[] = [];
        let parsedCommittees: any[] = [];
        try { if (listing.tierPlansJson) parsedTiers = JSON.parse(listing.tierPlansJson); } catch {}
        try { if (listing.committeesJson) parsedCommittees = JSON.parse(listing.committeesJson); } catch {}

        if (listing.category === 'MUN' || !listing.category) {
          try {
            createConference({
              name: listing.title,
              shortName: listing.shortName || listing.title.slice(0, 14),
              tagline: listing.description,
              startDate: new Date(listing.startDate).toISOString().split('T')[0],
              endDate: new Date(listing.endDate).toISOString().split('T')[0],
              location: `${listing.venue}, ${listing.city}`,
              secretariatChair: listing.organizerName,
              ticketPrice: listing.ticketPrice,
              plans: parsedTiers,
              committees: parsedCommittees.map((c: any) => ({
                name: c.name || c.title || 'General Assembly Plenary',
                shortName: c.shortName || c.code || 'UNGA',
                type: (c.type as any) || 'UNGA',
                agenda: c.agenda || 'Multilateral Sovereign Deliberation',
                totalDelegates: c.totalDelegates || 25,
              })),
            });
          } catch (e) {
            console.warn('Auto-create in MunContext:', e);
          }
        }

        try {
          const storedEvtsRaw = localStorage.getItem('zenvitra_events_v4_clean');
          const existingEvts = storedEvtsRaw ? JSON.parse(storedEvtsRaw) : [];
          const syncedEvent = {
            id: listing.slug || listing.id,
            slug: listing.slug,
            title: listing.title,
            description: listing.description,
            type: listing.format || 'physical',
            location: `${listing.venue}, ${listing.city}`,
            city: listing.city,
            date: new Date(listing.startDate).toISOString().split('T')[0],
            endDate: new Date(listing.endDate).toISOString().split('T')[0],
            time: '09:00 AM',
            category: listing.category || 'MUN',
            ticketPrice: listing.ticketPrice,
            plans: parsedTiers,
            verified: true,
            verificationStatus: 'VERIFIED',
            coverImage: listing.coverImage,
            attendees: [],
            organizerId: listing.organizerEmail,
            organizerName: listing.organizerName,
            organizerUsername: listing.organizerHandle || 'secretariat',
            tags: ['conference', 'event', (listing.category || 'mun').toLowerCase()],
            status: 'upcoming',
            createdAt: new Date().toISOString(),
          };
          const nextEvts = [syncedEvent, ...existingEvts.filter((e: any) => e.id !== syncedEvent.id && e.slug !== syncedEvent.slug)];
          localStorage.setItem('zenvitra_events_v4_clean', JSON.stringify(nextEvts));
          broadcastActivitySync({ source: 'event', action: 'create', timestamp: Date.now() });
        } catch {}

        setRecentActions((prev) => [
          {
            id: `ACT-${Date.now()}`,
            action: 'VERIFIED_CONFERENCE',
            target: listing.title,
            category: 'EVENT_OPERATIONS',
            adminName: operatorIdentity,
            timestamp: 'Just now',
          },
          ...prev,
        ]);
      } else {
        notify(data.error || 'Failed to verify conference listing.');
      }
    } catch (err: any) {
      notify(err.message || 'Network error verifying listing.');
    } finally {
      setVerifyingId(null);
    }
  };

  const handleRejectListing = async (listing: ConferenceListingItem) => {
    if (!confirm(`Are you sure you want to reject the conference "${listing.title}"?`)) return;
    setVerifyingId(listing.id);
    try {
      const res = await fetch(`/api/events/list/${listing.id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          status: 'REJECTED',
          verifiedBy: operatorIdentity || 'Lead Staff Admin',
        }),
      });
      const data = await res.json();
      if (data.success) {
        notify(`Conference "${listing.title}" marked as REJECTED.`);
        setConferenceListings((prev) =>
          prev.map((item) =>
            item.id === listing.id
              ? { ...item, status: 'REJECTED', verified: false, verifiedBy: operatorIdentity }
              : item
          )
        );
      }
    } catch (err: any) {
      notify(err.message || 'Error rejecting listing.');
    } finally {
      setVerifyingId(null);
    }
  };

  const handleDeleteListing = async (listing: ConferenceListingItem) => {
    if (!confirm(`Permanently delete listing record for "${listing.title}"? This cannot be undone.`)) return;
    setVerifyingId(listing.id);
    try {
      const res = await fetch(`/api/events/list/${listing.id}`, {
        method: 'DELETE',
      });
      const data = await res.json();
      if (data.success) {
        notify(`Conference listing for "${listing.title}" deleted.`);
        setConferenceListings((prev) => prev.filter((item) => item.id !== listing.id));
      }
    } catch (err: any) {
      notify(err.message || 'Error deleting listing.');
    } finally {
      setVerifyingId(null);
    }
  };

  /* Passcode Unlock Handler */
  const handlePasscodeUnlock = (e: React.FormEvent) => {
    e.preventDefault();
    const key = accessPasscode.trim();
    if (!key) {
      setAuthError('Please enter your designated staff access code.');
      return;
    }

    if (verifyFounderKey(key)) {
      activateFounderSession(key);
      setIsAuthenticated(true);
      const founderLabel = profile?.display_name ? `${profile.display_name} (Founder Mode)` : '@yuveer (Founder Mode)';
      setOperatorIdentity(founderLabel);
      setAuthError(null);
      notify('👑 Zenith Mission Control unlocked with Level 0 privileges.');
      return;
    }

    if (verifyAdminKey(key)) {
      activateAdminSession(key, 'Staff Operator');
      setIsAuthenticated(true);
      const adminLabel = profile?.display_name ? `${profile.display_name} (Staff Admin)` : currentStaffName;
      setOperatorIdentity(adminLabel);
      setAuthError(null);
      notify('🛡️ Mission Control unlocked. Operational privileges active.');
      return;
    }

    setAuthError('Access Code Denied. Valid keys include: ZEN-ADMIN-PASS-2026 or Founder Key.');
  };

  /* Action Handlers */
  const handleToggleTaskStatus = (id: string) => {
    setTasks((prev) =>
      prev.map((t) => (t.id === id ? { ...t, status: t.status === 'COMPLETED' ? 'PENDING' : 'COMPLETED' } : t))
    );
    notify(`Task status updated.`);
  };

  const handleApproveApplication = (id: string) => {
    setApplications((prev) => prev.filter((a) => a.id !== id));
    notify(`Application ${id} approved & allocation letter dispatched!`);
    setRecentActions((prev) => [
      {
        id: `ACT-${Date.now()}`,
        adminName: operatorIdentity,
        action: 'Approved Application & Issued Seat',
        target: id,
        category: 'REGISTRATIONS',
        timestamp: 'Just now',
      },
      ...prev,
    ]);
  };

  const handleRejectApplication = (id: string) => {
    setApplications((prev) => prev.filter((a) => a.id !== id));
    notify(`Application ${id} rejected.`);
  };

  const handleResolveReport = (id: string, action: 'DISMISSED' | 'PURGED') => {
    setContentReports((prev) => prev.filter((r) => r.id !== id));
    notify(`Content report ${id} marked as ${action}!`);
  };

  const handleResolveTicket = (id: string) => {
    setSupportTickets((prev) => prev.filter((t) => t.id !== id));
    notify(`Support ticket ${id} marked as RESOLVED.`);
  };

  const handleCreateEscalation = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newEscalationTitle.trim() || !newEscalationDesc.trim()) return;

    const newEsc: AdminEscalationItem = {
      id: `ESC-0${escalations.length + 1}`,
      title: newEscalationTitle.trim(),
      description: newEscalationDesc.trim(),
      department: newEscalationDept,
      severity: 'HIGH',
      escalatedBy: operatorIdentity,
      submittedAt: 'Just now',
      status: 'PENDING_FOUNDER_REVIEW',
    };

    setEscalations((prev) => [newEsc, ...prev]);
    setNewEscalationTitle('');
    setNewEscalationDesc('');
    setIsEscalatingOpen(false);
    notify(`Escalated to Founder (@yuveer) for Level 0 clearance review!`);
  };

  const playAdminScanChime = useCallback((type: 'success' | 'error') => {
    if (!scannerSoundEnabled || typeof window === 'undefined') return;
    try {
      const AudioCtx = window.AudioContext || (window as any).webkitAudioContext;
      if (!AudioCtx) return;
      const ctx = new AudioCtx();

      if (type === 'success') {
        const osc1 = ctx.createOscillator();
        const osc2 = ctx.createOscillator();
        const gain = ctx.createGain();

        osc1.type = 'sine';
        osc1.frequency.setValueAtTime(880, ctx.currentTime);
        osc1.frequency.exponentialRampToValueAtTime(1760, ctx.currentTime + 0.12);

        osc2.type = 'triangle';
        osc2.frequency.setValueAtTime(1320, ctx.currentTime);
        osc2.frequency.exponentialRampToValueAtTime(2640, ctx.currentTime + 0.12);

        gain.gain.setValueAtTime(0.12, ctx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.28);

        osc1.connect(gain);
        osc2.connect(gain);
        gain.connect(ctx.destination);

        osc1.start();
        osc2.start();
        osc1.stop(ctx.currentTime + 0.28);
        osc2.stop(ctx.currentTime + 0.28);
      } else {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();

        osc.type = 'square';
        osc.frequency.setValueAtTime(140, ctx.currentTime);
        osc.frequency.setValueAtTime(95, ctx.currentTime + 0.1);

        gain.gain.setValueAtTime(0.18, ctx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.3);

        osc.connect(gain);
        gain.connect(ctx.destination);

        osc.start();
        osc.stop(ctx.currentTime + 0.3);
      }
    } catch (_) {}
  }, [scannerSoundEnabled]);

  const handleSimulateCheckin = (e?: React.FormEvent, directCode?: string) => {
    if (e) e.preventDefault();
    const tokenToScan = (directCode || scannerTokenInput).trim().toUpperCase();
    if (!tokenToScan) return;

    if (!isGateArmed) {
      playAdminScanChime('error');
      setScannerResult({
        status: 'error',
        name: 'ENTRY REJECTED • DOORS CLOSED',
        handle: 'TIMING_RESTRICTION_ACTIVE',
        school: 'Event Gate Schedule Enforced (09:00 AM)',
        ageCategory: 'GENERAL',
        gstStatus: 'GATE CLOSED',
        event: currentEventTitle,
        committee: 'Main Entrance Portico',
        seat: 'GATE ENTRY LOCKED',
        gateTerminal: 'TERMINAL GATE ALPHA-01',
        ticketId: tokenToScan,
        securityHash: 'ERR-SCHEDULED-LOCKED-0900',
        message: 'DOORS NOT OPEN YET: Check-in scanner is locked until the official event start time (09:00 AM). To admit the Executive Secretariat, Dais Chairs, or early VIP delegates, toggle "Force Arm Early / Manual Gate Override" above.',
        timestamp: new Date().toLocaleTimeString(),
      });
      notify('⚠️ Gate scanner locked by schedule. Turn on Manual Gate Override to admit early.');
      return;
    }

    // Check duplicate
    if (checkedInCodes.has(tokenToScan)) {
      playAdminScanChime('error');
      const isDupeStudent = tokenToScan.includes('STU') || !tokenToScan.includes('GEN');
      setScannerResult({
        status: 'warning',
        name: isDupeStudent ? 'Verified Student Delegate' : 'Verified General Delegate',
        handle: isDupeStudent ? '@student_delegate' : '@general_delegate',
        school: isDupeStudent ? 'Academic Delegation' : "University Delegation",
        ageCategory: isDupeStudent ? 'STUDENT' : 'GENERAL',
        gstStatus: isDupeStudent ? '0% GST (STUDENT EXEMPT)' : '6% GST (GENERAL APPLICABLE)',
        event: currentEventTitle,
        committee: 'UN General Assembly Plenary',
        seat: 'UNGA-SEAT-24',
        gateTerminal: 'TERMINAL GATE ALPHA-01',
        ticketId: tokenToScan,
        securityHash: 'ZVN-WARN-DUPLICATE-DETECTED',
        message: 'DUPLICATE BADGE SCANNED: This attendee ticket ID was already registered as checked-in at Terminal Gate Alpha-01. Please verify delegate photo ID.',
        timestamp: new Date().toLocaleTimeString(),
      });
      notify('⚠️ Duplicate ticket scan detected! Flagged for security check.');
      return;
    }

    // Determine category
    const isStudent = tokenToScan.includes('STU') || 
                      tokenToScan.includes('DPS') ||
                      !tokenToScan.includes('GEN');

    const isVipDais = tokenToScan.includes('DAIS') || tokenToScan.includes('VIP') || tokenToScan.includes('CHAIR');

    const attendeeName = isVipDais 
      ? 'Executive Dais Board Official'
      : isStudent 
        ? 'Verified Student Delegate' 
        : 'Verified General Delegate';

    const handle = isVipDais 
      ? '@chair_plenary' 
      : isStudent 
        ? '@student_delegate' 
        : '@general_delegate';

    const school = isVipDais 
      ? 'Executive Dais Secretariat' 
      : isStudent 
        ? 'Academic Delegation' 
        : "University Alumni Delegation";

    const committee = isVipDais 
      ? 'Executive Dais Board / Secretarial Dais' 
      : isStudent 
        ? 'UN General Assembly Plenary' 
        : 'UN Security Council Chamber';

    const seat = isVipDais 
      ? 'DAIS-PRESIDENCY-01' 
      : isStudent 
        ? 'UNGA-SEAT-24 (Delegate of France)' 
        : 'UNSC-SEAT-08 (Delegate of United Kingdom)';

    const securityHash = `ZVN-SHA256-${Math.random().toString(36).substring(2, 8).toUpperCase()}-${Date.now().toString(36).toUpperCase()}`;
    const scanTime = new Date().toLocaleTimeString();

    playAdminScanChime('success');
    setCheckedInCodes((prev) => new Set(prev).add(tokenToScan));
    setCheckedInCount((prev) => prev + 1);

    setScannerResult({
      status: 'success',
      name: attendeeName,
      handle,
      school,
      ageCategory: isStudent ? 'STUDENT' : 'GENERAL',
      gstStatus: isStudent ? '0% GST (STUDENT EXEMPT)' : '6% GST (GENERAL APPLICABLE)',
      event: currentEventTitle,
      committee,
      seat,
      gateTerminal: 'TERMINAL GATE ALPHA-01',
      ticketId: tokenToScan,
      securityHash,
      message: 'PASSPORT & PASS VERIFIED: Authorized entry to conference hall.',
      timestamp: scanTime,
    });

    setRecentActions((prev) => [
      {
        id: `ACT-0${prev.length + 1}`,
        adminName: operatorIdentity,
        action: `Gate Check-in (${isStudent ? 'Student 0% GST' : 'General 6% GST'})`,
        target: `${attendeeName} (${seat})`,
        category: 'EVENT_OPS',
        timestamp: 'Just now',
      },
      ...prev,
    ]);

    setScannerTokenInput('');
    notify(`✅ Checked in ${attendeeName} • ${seat}`);
  };

  // Stealth 404 for unauthorized visitors
  if (!authLoading && !hasStaffClearance) {
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

  // Passcode Gate if not authenticated
  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-[#030405] text-neutral-200 flex flex-col items-center justify-center p-4 sm:p-6 font-mono text-xs select-none">
        <div className="w-full max-w-md p-8 rounded-3xl bg-[#080a12] border border-cyan-500/30 shadow-2xl space-y-6">
          <div className="text-center space-y-2">
            <div className="w-12 h-12 rounded-2xl bg-cyan-500/10 border border-cyan-500/30 text-cyan-400 flex items-center justify-center mx-auto shadow-[0_0_20px_rgba(6,182,212,0.2)]">
              <ShieldCheck className="w-6 h-6" />
            </div>
            <h2 className="text-lg font-bold text-white uppercase tracking-wider">ZEN.ADMIN Operations Desk</h2>
            <p className="text-[11px] text-neutral-400 font-sans">
              Administrative operations portal governed by assigned permissions. Please enter your authorized staff passcode.
            </p>
          </div>

          <form onSubmit={handlePasscodeUnlock} className="space-y-4">
            <div className="space-y-1.5">
              <label className="text-[10px] text-neutral-400 uppercase font-bold">Staff Access Code</label>
              <input
                type="password"
                required
                value={accessPasscode}
                onChange={(e) => setAccessPasscode(e.target.value)}
                placeholder="Enter access passcode..."
                className="w-full px-4 py-3 rounded-xl bg-black border border-white/20 text-cyan-300 font-mono text-xs focus:outline-none focus:border-cyan-400 tracking-wider"
              />
            </div>

            {authError && (
              <div className="p-3 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-300 text-[11px]">
                {authError}
              </div>
            )}

            <button
              type="submit"
              className="w-full py-3 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-black font-bold uppercase transition flex items-center justify-center gap-2 shadow-[0_0_20px_rgba(6,182,212,0.3)] cursor-pointer"
            >
              <Unlock className="w-4 h-4" />
              <span>Unlock Operations Desk</span>
            </button>
          </form>

          <div className="text-center pt-2">
            <Link href="/" className="text-[11px] text-neutral-500 hover:text-white transition">
              &larr; Exit to Public Platform
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#030405] text-neutral-100 flex flex-col font-sans select-none overflow-x-hidden">
      {/* ── TOP OPERATIONAL COMMAND HEADER ── */}
      <header className="border-b border-cyan-500/20 bg-[#060810]/95 backdrop-blur-xl px-4 sm:px-8 py-4 shrink-0 font-mono text-xs">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-2xl bg-cyan-500/10 border border-cyan-500/40 text-cyan-400 flex items-center justify-center shrink-0 shadow-[0_0_20px_rgba(6,182,212,0.2)]">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-white font-extrabold uppercase tracking-wider text-sm">ZEN.ADMIN</span>
                <span className="text-[9px] px-2 py-0.5 rounded bg-cyan-500/20 text-cyan-300 font-bold border border-cyan-500/30">
                  OPERATIONS CENTRE
                </span>
              </div>
              <p className="text-[10px] text-neutral-400 font-sans pt-0.5">
                ZEN.FOUNDER controls the platform. ZEN.ADMIN operates it.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3 flex-wrap">
            {/* Role Indicator & Dropdown */}
            <div className="flex items-center gap-1.5 p-1.5 rounded-xl bg-black/60 border border-white/10">
              <span className="text-[10px] text-neutral-400 px-1">Role:</span>
              <select
                value={activeRole}
                onChange={(e) => {
                  setActiveRole(e.target.value as StaffRole);
                  notify(`Operating as: ${e.target.value}`);
                }}
                className="bg-transparent text-cyan-300 font-bold text-xs focus:outline-none cursor-pointer"
              >
                {STAFF_ROLES.map((r) => (
                  <option key={r} value={r} className="bg-black text-white">
                    {r}
                  </option>
                ))}
              </select>
            </div>

            {/* Operator Badge */}
            <div className="px-3 py-1.5 rounded-xl bg-white/5 border border-white/10 text-neutral-300 text-[11px] flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
              <span>{operatorIdentity}</span>
            </div>

            {/* Switch to Founder Master Control */}
            <Link
              href="/zen-vault-root"
              className="px-3.5 py-1.5 rounded-xl bg-amber-400/15 hover:bg-amber-400/25 border border-amber-400/30 text-amber-300 font-bold transition flex items-center gap-1.5 cursor-pointer text-xs"
            >
              <Crown className="w-3.5 h-3.5 text-amber-400" />
              <span>ZEN.FOUNDER Master Control</span>
              <ArrowUpRight className="w-3 h-3 text-amber-400" />
            </Link>

            {/* Lock Session */}
            <button
              type="button"
              onClick={() => {
                setIsAuthenticated(false);
                setAccessPasscode('');
                notify('Session locked.');
              }}
              className="p-2 rounded-xl bg-white/5 hover:bg-rose-500/20 text-neutral-400 hover:text-rose-300 transition cursor-pointer"
              title="Lock Session"
            >
              <LogOut className="w-4 h-4" />
            </button>
          </div>
        </div>
      </header>

      {/* ── 12 OPERATIONS SECTIONS NAVIGATOR ── */}
      <div className="px-4 sm:px-8 py-2 bg-[#04050a] border-b border-white/10 overflow-x-auto no-scrollbar font-mono text-xs">
        <div className="flex items-center gap-1.5 w-full max-w-full">
          {ADMIN_SECTIONS.map((sec) => {
            const isActive = activeSection === sec.id;
            return (
              <button
                key={sec.id}
                onClick={() => selectSection(sec.id)}
                className={`flex items-center gap-2 px-3.5 py-2.5 rounded-2xl transition font-bold whitespace-nowrap cursor-pointer border shrink-0 ${
                  isActive
                    ? 'bg-cyan-500 text-black border-cyan-400 shadow-[0_0_20px_rgba(6,182,212,0.35)]'
                    : 'bg-[#080a12] border-white/10 text-neutral-400 hover:text-white hover:border-white/20'
                }`}
              >
                <span className={`text-[10px] ${isActive ? 'text-black/70' : 'text-neutral-500'}`}>
                  {sec.num} &bull;
                </span>
                <span>{sec.title}</span>
                {sec.id === '01_dashboard' && (
                  <span className={`text-[9px] px-1.5 py-0.2 rounded-full ${isActive ? 'bg-black/20 text-black' : 'bg-cyan-500/20 text-cyan-300'}`}>
                    {tasks.filter(t => t.status === 'PENDING').length}
                  </span>
                )}
                {sec.id === '03_event_operations' && pendingListingsCount > 0 && (
                  <span className={`text-[9px] px-1.5 py-0.2 rounded-full font-bold ${isActive ? 'bg-black/20 text-black' : 'bg-amber-400/20 text-amber-300'}`}>
                    {pendingListingsCount}
                  </span>
                )}
                {sec.id === '06_registrations' && applications.length > 0 && (
                  <span className={`text-[9px] px-1.5 py-0.2 rounded-full ${isActive ? 'bg-black/20 text-black' : 'bg-amber-400/20 text-amber-300'}`}>
                    {applications.length}
                  </span>
                )}
              </button>
            );
          })}
        </div>
      </div>

      {/* ── NOTIFICATION TOAST ── */}
      {feedback && (
        <div className="mx-4 sm:mx-8 mt-4 p-3.5 rounded-2xl bg-cyan-500/15 border border-cyan-500/30 text-cyan-300 text-xs font-mono flex items-center gap-2.5 shadow-lg">
          <CheckCircle2 className="w-4 h-4 text-cyan-400 shrink-0" />
          <span>{feedback}</span>
        </div>
      )}

      {/* ── MAIN CONTENT VIEWPORT ── */}
      <main className="flex-1 p-4 sm:p-8 space-y-6 w-full max-w-full overflow-y-auto">
        {/* ========================================================================= */}
        {/* ── SECTION 01: DASHBOARD (DAILY OPERATIONAL OVERVIEW) ─────────────────── */}
        {/* ========================================================================= */}
        {activeSection === '01_dashboard' && (
          <div className="space-y-6 w-full font-mono text-xs">
            {/* 5 TOP OPERATIONAL METRICS */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
              <div className="p-5 rounded-3xl bg-[#080a12] border border-white/10 space-y-1">
                <div className="flex items-center justify-between text-neutral-400 text-[10px]">
                  <span>PENDING TASKS</span>
                  <Clock className="w-4 h-4 text-cyan-400" />
                </div>
                <div className="text-2xl font-bold text-white">
                  {tasks.filter((t) => t.status === 'PENDING').length}
                </div>
                <p className="text-[10px] text-neutral-400">Assigned operational workload</p>
              </div>

              <div 
                onClick={() => selectSection('03_event_operations')}
                className="p-5 rounded-3xl bg-[#080a12] border border-cyan-500/30 hover:border-cyan-400/60 transition cursor-pointer space-y-1"
              >
                <div className="flex items-center justify-between text-neutral-400 text-[10px]">
                  <span>CONFERENCE QUEUE</span>
                  <Calendar className="w-4 h-4 text-cyan-400" />
                </div>
                <div className="text-2xl font-bold text-cyan-300">{pendingListingsCount}</div>
                <p className="text-[10px] text-neutral-400">Inbound public listings awaiting verify</p>
              </div>

              <div className="p-5 rounded-3xl bg-[#080a12] border border-white/10 space-y-1">
                <div className="flex items-center justify-between text-neutral-400 text-[10px]">
                  <span>APPLICATIONS</span>
                  <Users className="w-4 h-4 text-amber-400" />
                </div>
                <div className="text-2xl font-bold text-amber-300">{applications.length}</div>
                <p className="text-[10px] text-neutral-400">Inbound delegate applications</p>
              </div>

              <div className="p-5 rounded-3xl bg-[#080a12] border border-white/10 space-y-1">
                <div className="flex items-center justify-between text-neutral-400 text-[10px]">
                  <span>REPORTS &amp; FLAGS</span>
                  <ShieldAlert className="w-4 h-4 text-rose-400" />
                </div>
                <div className="text-2xl font-bold text-rose-300">{contentReports.length}</div>
                <p className="text-[10px] text-neutral-400">Content / Article 12 reviews</p>
              </div>

              <div className="p-5 rounded-3xl bg-[#080a12] border border-white/10 space-y-1">
                <div className="flex items-center justify-between text-neutral-400 text-[10px]">
                  <span>SUPPORT TICKETS</span>
                  <HelpCircle className="w-4 h-4 text-emerald-400" />
                </div>
                <div className="text-2xl font-bold text-emerald-300">{supportTickets.length}</div>
                <p className="text-[10px] text-neutral-400">Open member inquiries</p>
              </div>
            </div>

            {/* LOWER PANELS 1 & 2: MY QUEUE + UPCOMING EVENTS */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
              {/* My Queue Panel */}
              <div className="p-6 rounded-3xl bg-[#080a12] border border-white/10 space-y-4">
                <div className="flex items-center justify-between border-b border-white/10 pb-3">
                  <span className="font-bold text-white flex items-center gap-2">
                    <Clock className="w-4 h-4 text-cyan-400" />
                    <span>My Assigned Workload Queue</span>
                  </span>
                  <span className="text-[10px] text-neutral-500">PRIORITY WORKSPACE</span>
                </div>

                <div className="space-y-2.5">
                  {tasks.map((task) => (
                    <div
                      key={task.id}
                      className={`p-3.5 rounded-2xl border transition flex items-center justify-between gap-3 ${
                        task.status === 'COMPLETED'
                          ? 'bg-black/30 border-white/5 opacity-50'
                          : 'bg-black/60 border-white/10'
                      }`}
                    >
                      <div className="space-y-1 truncate">
                        <div className="flex items-center gap-2">
                          <span className={`text-[9px] px-1.5 py-0.2 rounded font-bold ${
                            task.priority === 'URGENT' ? 'bg-rose-500/20 text-rose-300' :
                            task.priority === 'HIGH' ? 'bg-amber-400/20 text-amber-300' : 'bg-cyan-500/20 text-cyan-300'
                          }`}>
                            {task.priority}
                          </span>
                          <span className="text-white font-bold text-xs truncate">{task.title}</span>
                        </div>
                        <div className="text-[10px] text-neutral-400 font-sans">
                          Due: {task.dueDate} &bull; Type: {task.type}
                        </div>
                      </div>

                      <button
                        type="button"
                        onClick={() => handleToggleTaskStatus(task.id)}
                        className={`p-2 rounded-xl transition cursor-pointer shrink-0 ${
                          task.status === 'COMPLETED'
                            ? 'bg-emerald-500/20 text-emerald-400'
                            : 'bg-white/5 text-neutral-400 hover:text-white'
                        }`}
                        title="Mark Complete"
                      >
                        <Check className="w-4 h-4" />
                      </button>
                    </div>
                  ))}
                </div>
              </div>

              {/* Upcoming Events Panel */}
              <div className="p-6 rounded-3xl bg-[#080a12] border border-white/10 space-y-4">
                <div className="flex items-center justify-between border-b border-white/10 pb-3">
                  <span className="font-bold text-white flex items-center gap-2">
                    <Calendar className="w-4 h-4 text-amber-400" />
                    <span>Supervised MUN Conferences &amp; Assemblies</span>
                  </span>
                  <button
                    onClick={() => selectSection('03_event_operations')}
                    className="text-[10px] text-cyan-400 hover:text-white underline cursor-pointer"
                  >
                    Event Ops &rarr;
                  </button>
                </div>

                <div className="space-y-3">
                  {conferences.length > 0 ? (
                    conferences.map((conf) => {
                      const comm = conf.committees?.[0];
                      const commCode = typeof comm === 'string' ? comm.toLowerCase() : (comm?.shortName || 'matrix').toLowerCase();
                      return (
                      <div key={conf.id} className="p-4 rounded-2xl bg-black/60 border border-white/5 space-y-2">
                        <div className="flex items-center justify-between">
                          <span className="text-white font-bold text-xs">{conf.name}</span>
                          <span className="text-[10px] px-2 py-0.5 rounded font-bold bg-emerald-500/20 text-emerald-300">
                            {conf.status?.toUpperCase() || 'ACTIVE DESK'}
                          </span>
                        </div>
                        <div className="text-[11px] text-neutral-400 font-sans">
                          {conf.tagline || 'Sovereign Assembly Plenary'} &bull; {conf.location || 'Live Matrix'}
                        </div>
                        <div className="flex items-center gap-2 pt-1">
                          <Link
                            href={`/${conf.slug || conf.id}`}
                            className="text-[10px] text-cyan-300 hover:underline flex items-center gap-1"
                          >
                            <span>Showcase Page</span>
                            <ExternalLink className="w-3 h-3" />
                          </Link>
                          <span className="text-neutral-600">&bull;</span>
                          <Link
                            href={`/${conf.slug || conf.id}/${commCode}/matrix`}
                            className="text-[10px] text-amber-300 hover:underline flex items-center gap-1"
                          >
                            <span>Committee Matrix</span>
                            <ExternalLink className="w-3 h-3" />
                          </Link>
                        </div>
                      </div>
                    );
                  })
                  ) : (
                    <div className="p-4 rounded-2xl bg-black/40 border border-white/5 text-center space-y-1">
                      <p className="text-xs text-neutral-400">No active MUN conferences configured yet.</p>
                      <Link href="/mun" className="text-[11px] text-cyan-400 hover:underline inline-block">
                        Launch a conference in MUN Space &rarr;
                      </Link>
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* LOWER PANELS 3, 4, 5: RECENT ACTIONS + ESCALATIONS TO FOUNDER + QUICK ACTIONS */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
              {/* Recent Actions */}
              <div className="p-6 rounded-3xl bg-[#080a12] border border-white/10 space-y-4">
                <div className="border-b border-white/10 pb-3">
                  <span className="font-bold text-white flex items-center gap-2">
                    <Activity className="w-4 h-4 text-cyan-400" />
                    <span>Operations Activity Stream</span>
                  </span>
                </div>

                <div className="space-y-2 max-h-72 overflow-y-auto pr-1">
                  {recentActions.map((act) => (
                    <div key={act.id} className="p-3 rounded-2xl bg-black/60 border border-white/5 space-y-1">
                      <div className="text-white font-bold text-[11px]">{act.action}</div>
                      <div className="text-[10px] text-neutral-400 font-sans truncate">{act.target}</div>
                      <div className="text-[9px] text-neutral-500">{act.timestamp} &bull; {act.adminName}</div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Escalations to Founder */}
              <div className="p-6 rounded-3xl bg-[#080a12] border border-amber-500/30 space-y-4">
                <div className="flex items-center justify-between border-b border-white/10 pb-3">
                  <span className="font-bold text-white flex items-center gap-2">
                    <Crown className="w-4 h-4 text-amber-400" />
                    <span>Escalations to Founder</span>
                  </span>
                  <button
                    type="button"
                    onClick={() => setIsEscalatingOpen(true)}
                    className="text-[10px] text-amber-400 hover:text-white underline cursor-pointer"
                  >
                    + New Escalation
                  </button>
                </div>

                <div className="space-y-2 max-h-72 overflow-y-auto pr-1">
                  {escalations.map((esc) => (
                    <div key={esc.id} className="p-3 rounded-2xl bg-black/60 border border-white/5 space-y-1.5">
                      <div className="flex items-center justify-between">
                        <span className="text-[9px] font-bold px-1.5 py-0.2 rounded bg-amber-400/20 text-amber-300">
                          {esc.department}
                        </span>
                        <span className="text-[9px] text-neutral-500">{esc.submittedAt}</span>
                      </div>
                      <div className="text-white font-bold text-xs">{esc.title}</div>
                      <p className="text-[11px] text-neutral-400 font-sans line-clamp-2">{esc.description}</p>
                      <div className="text-[9px] text-cyan-400 font-bold">STATUS: PENDING LEVEL 0 REVIEW</div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Quick Actions */}
              <div className="p-6 rounded-3xl bg-[#080a12] border border-white/10 space-y-4">
                <div className="border-b border-white/10 pb-3">
                  <span className="font-bold text-white flex items-center gap-2">
                    <Zap className="w-4 h-4 text-emerald-400" />
                    <span>Staff Quick Actions</span>
                  </span>
                </div>

                <div className="space-y-2.5">
                  <button
                    type="button"
                    onClick={() => selectSection('03_event_operations')}
                    className="w-full p-3 rounded-2xl bg-cyan-500/10 hover:bg-cyan-500/20 border border-cyan-500/30 text-cyan-300 font-bold flex items-center justify-between transition cursor-pointer text-left"
                  >
                    <div>
                      <div className="text-xs">Verify Inbound Conferences ({pendingListingsCount})</div>
                      <div className="text-[10px] text-cyan-300/70 font-light font-sans">Audit public conference submissions to make live</div>
                    </div>
                    <ArrowUpRight className="w-3.5 h-3.5 text-cyan-400" />
                  </button>

                  <button
                    type="button"
                    onClick={() => selectSection('06_registrations')}
                    className="w-full p-3 rounded-2xl bg-white/5 hover:bg-white/10 border border-white/10 text-white font-bold flex items-center justify-between transition cursor-pointer text-left"
                  >
                    <div>
                      <div className="text-xs">Process Next Delegate</div>
                      <div className="text-[10px] text-neutral-400 font-light font-sans">{applications.length} applications awaiting approval</div>
                    </div>
                    <ArrowUpRight className="w-3.5 h-3.5 text-neutral-400" />
                  </button>

                  <button
                    type="button"
                    onClick={() => selectSection('08_customer_support')}
                    className="w-full p-3 rounded-2xl bg-white/5 hover:bg-white/10 border border-white/10 text-white font-bold flex items-center justify-between transition cursor-pointer text-left"
                  >
                    <div>
                      <div className="text-xs">Review Open Support Ticket</div>
                      <div className="text-[10px] text-neutral-400 font-light font-sans">{supportTickets.length} tickets waiting response</div>
                    </div>
                    <ArrowUpRight className="w-3.5 h-3.5 text-neutral-400" />
                  </button>

                  <button
                    type="button"
                    onClick={() => selectSection('02_user_management')}
                    className="w-full p-3 rounded-2xl bg-white/5 hover:bg-white/10 border border-white/10 text-white font-bold flex items-center justify-between transition cursor-pointer text-left"
                  >
                    <div>
                      <div className="text-xs">Verify Student Card (0% GST)</div>
                      <div className="text-[10px] text-neutral-400 font-light font-sans">Audit student age credentials</div>
                    </div>
                    <ArrowUpRight className="w-3.5 h-3.5 text-neutral-400" />
                  </button>

                  <button
                    type="button"
                    onClick={() => setIsEscalatingOpen(true)}
                    className="w-full p-3 rounded-2xl bg-amber-400/10 hover:bg-amber-400/20 border border-amber-400/30 text-amber-300 font-bold flex items-center justify-between transition cursor-pointer text-left"
                  >
                    <div>
                      <div className="text-xs">Escalate Issue to Founder</div>
                      <div className="text-[10px] text-amber-300/70 font-light font-sans">Route refund or critical exception to Level 0</div>
                    </div>
                    <Crown className="w-3.5 h-3.5 text-amber-400" />
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* ========================================================================= */}
        {/* ── SECTION 02: USER MANAGEMENT ────────────────────────────────────────── */}
        {/* ========================================================================= */}
        {activeSection === '02_user_management' && (
          <div className="space-y-6 w-full font-mono text-xs">
            <div className="p-6 rounded-3xl bg-[#080a12] border border-cyan-500/30 space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-cyan-300 font-bold uppercase tracking-wider flex items-center gap-2">
                  <Users className="w-4 h-4 text-cyan-400" />
                  <span>USER MANAGEMENT &bull; Member Directory &amp; Verification</span>
                </span>
                <span className="text-[10px] text-neutral-400">OPERATIONAL CLEARANCE</span>
              </div>
              <p className="text-neutral-300 font-sans text-xs">
                Manage platform accounts, audit student cards for 0% GST compliance, and review temporary flags.
              </p>
            </div>

            {/* Student ID & Passport Verification Queue */}
            <div className="p-6 rounded-3xl bg-black/60 border border-white/10 space-y-4">
              <div className="flex items-center justify-between border-b border-white/10 pb-3">
                <span className="text-white font-bold uppercase">Student ID &amp; 0% GST Exemption Queue</span>
                <span className="text-[10px] text-neutral-400">AGE-AWARE TAX AUDIT</span>
              </div>

              <div className="space-y-3">
                <div className="p-8 rounded-2xl bg-[#080a12] border border-white/5 text-center space-y-2">
                  <ShieldCheck className="w-8 h-8 text-emerald-400 mx-auto opacity-70" />
                  <span className="text-white font-bold block text-sm">Student Verification Queue Clear</span>
                  <p className="text-neutral-400 font-sans text-xs max-w-sm mx-auto">
                    All delegate student ID cards have been audited. Inbound student registrations will appear here for age-aware 0% GST exemption verification.
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* ========================================================================= */}
        {/* ── SECTION 03: EVENT OPERATIONS ───────────────────────────────────────── */}
        {/* ========================================================================= */}
        {activeSection === '03_event_operations' && (
          <div className="space-y-6 w-full font-mono text-xs">
            {/* Header & Status Bar */}
            <div className="p-6 rounded-3xl bg-[#080a12] border border-cyan-500/30 space-y-3">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <span className="text-cyan-300 font-bold uppercase tracking-wider flex items-center gap-2">
                  <Calendar className="w-4 h-4 text-cyan-400" />
                  <span>EVENT OPERATIONS &bull; On-Ground Gate Check-In &amp; Telemetry</span>
                </span>
                <div className="flex items-center gap-3">
                  <button
                    type="button"
                    onClick={() => setScannerSoundEnabled((prev) => !prev)}
                    className={`px-3 py-1.5 rounded-xl border text-[11px] font-bold flex items-center gap-1.5 transition cursor-pointer ${
                      scannerSoundEnabled
                        ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-400 hover:bg-emerald-500/20'
                        : 'bg-white/5 border-white/10 text-neutral-400 hover:text-white'
                    }`}
                    title={scannerSoundEnabled ? 'Web Audio Feedback Active' : 'Audio Muted'}
                  >
                    {scannerSoundEnabled ? <Volume2 className="w-3.5 h-3.5" /> : <VolumeX className="w-3.5 h-3.5" />}
                    <span>{scannerSoundEnabled ? 'AUDIO CHIMES ON' : 'MUTED'}</span>
                  </button>
                  <span className={`text-[10px] px-2.5 py-1 rounded-full font-bold border ${
                    isGateArmed
                      ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-300'
                      : 'bg-amber-500/10 border-amber-500/30 text-amber-300'
                  }`}>
                    {isGateArmed ? 'GATE ARMED & ACTIVE' : 'LOCKED BY SCHEDULE'}
                  </span>
                </div>
              </div>
              <p className="text-neutral-300 font-sans text-xs">
                On-ground gate check-in terminal with event timing intelligence, age-aware GST verification (0% Student vs 6% General), duplicate detection, and automated door schedule synchronization.
              </p>
            </div>

            {/* ── INBOUND CONFERENCE & EVENT VERIFICATION QUEUE ── */}
            <div className="p-6 sm:p-8 rounded-3xl bg-[#080a12] border border-cyan-500/30 space-y-6">
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-white/10 pb-4">
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <Building className="w-5 h-5 text-cyan-400" />
                    <h3 className="text-white font-bold text-sm uppercase tracking-wider">
                      Inbound Conference &amp; Event Verification Queue
                    </h3>
                    <span className="text-[10px] px-2 py-0.5 rounded-full bg-cyan-500/20 text-cyan-300 font-bold border border-cyan-500/30">
                      LEVEL 1 STAFF VERIFY
                    </span>
                  </div>
                  <p className="text-neutral-400 font-sans text-xs">
                    Anyone can list conferences from the homepage or events directory. Verified assemblies go live globally with direct vanity routing (/[event]), dais matrices, and live ticketing.
                  </p>
                </div>

                <div className="flex items-center gap-2 flex-wrap">
                  <button
                    type="button"
                    onClick={() => fetchConferenceListings()}
                    disabled={isLoadingListings}
                    className="px-3 py-1.5 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-neutral-300 hover:text-white transition flex items-center gap-1.5 cursor-pointer text-xs"
                  >
                    <RotateCw className={`w-3.5 h-3.5 ${isLoadingListings ? 'animate-spin' : ''}`} />
                    <span>Refresh</span>
                  </button>
                  <div className="flex items-center gap-1 p-1 rounded-xl bg-black/60 border border-white/10">
                    {(['ALL', 'PENDING', 'VERIFIED', 'REJECTED'] as const).map((filter) => {
                      const count = filter === 'ALL' 
                        ? conferenceListings.length 
                        : conferenceListings.filter(l => l.status === filter).length;
                      return (
                        <button
                          key={filter}
                          type="button"
                          onClick={() => setListingsFilter(filter)}
                          className={`px-2.5 py-1 rounded-lg text-[10px] font-bold transition cursor-pointer ${
                            listingsFilter === filter
                              ? 'bg-cyan-500 text-black shadow'
                              : 'text-neutral-400 hover:text-white'
                          }`}
                        >
                          {filter} ({count})
                        </button>
                      );
                    })}
                  </div>
                </div>
              </div>

              {/* LISTINGS DISPLAY */}
              {isLoadingListings && conferenceListings.length === 0 ? (
                <div className="p-12 text-center text-neutral-500 font-mono text-xs flex items-center justify-center gap-3">
                  <RotateCw className="w-4 h-4 animate-spin text-cyan-400" />
                  <span>Loading conference verification queue...</span>
                </div>
              ) : (() => {
                const filteredListings = conferenceListings.filter(l => {
                  if (listingsFilter === 'ALL') return true;
                  return l.status === listingsFilter;
                });

                if (filteredListings.length === 0) {
                  return (
                    <div className="p-10 rounded-2xl bg-black/40 border border-white/5 text-center space-y-2">
                      <CheckCircle2 className="w-8 h-8 text-emerald-400/60 mx-auto" />
                      <div className="text-white font-bold text-xs">No Conference Submissions in this Filter</div>
                      <p className="text-neutral-500 font-sans text-[11px] max-w-sm mx-auto">
                        {listingsFilter === 'PENDING' 
                          ? 'All inbound conference and event applications have been reviewed.' 
                          : 'No submissions found under the selected category.'}
                      </p>
                    </div>
                  );
                }

                return (
                  <div className="grid grid-cols-1 gap-4">
                    {filteredListings.map((listing) => {
                      let parsedTiers: any[] = [];
                      let parsedCommittees: any[] = [];
                      try { if (listing.tierPlansJson) parsedTiers = JSON.parse(listing.tierPlansJson); } catch {}
                      try { if (listing.committeesJson) parsedCommittees = JSON.parse(listing.committeesJson); } catch {}

                      const isPending = listing.status === 'PENDING';
                      const isVerified = listing.status === 'VERIFIED';
                      const isRejected = listing.status === 'REJECTED';
                      const isProcessing = verifyingId === listing.id;

                      return (
                        <div
                          key={listing.id}
                          className={`p-5 sm:p-6 rounded-2xl border transition space-y-4 ${
                            isPending
                              ? 'bg-amber-500/[0.03] border-amber-500/30'
                              : isVerified
                                ? 'bg-emerald-500/[0.03] border-emerald-500/30'
                                : 'bg-rose-500/[0.03] border-rose-500/20 opacity-75'
                          }`}
                        >
                          {/* TOP CARD BAR */}
                          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-white/5 pb-3">
                            <div className="space-y-1">
                              <div className="flex items-center gap-2 flex-wrap">
                                <span className="text-xs px-2 py-0.5 rounded font-bold bg-cyan-500/20 text-cyan-300 border border-cyan-500/30">
                                  {listing.category || 'MUN'}
                                </span>
                                <span className="text-xs px-2 py-0.5 rounded font-bold bg-white/10 text-neutral-300">
                                  {(listing.format || 'physical').toUpperCase()}
                                </span>
                                <h4 className="text-white font-bold text-sm tracking-wide">
                                  {listing.title}
                                </h4>
                                {listing.shortName && (
                                  <span className="text-[10px] text-neutral-400 font-mono">
                                    ({listing.shortName})
                                  </span>
                                )}
                              </div>
                              <div className="flex items-center gap-3 text-[11px] text-neutral-400 flex-wrap">
                                <span className="flex items-center gap-1 text-cyan-400 font-mono">
                                  <Link2 className="w-3 h-3" />
                                  <span>/{listing.slug}</span>
                                </span>
                                <span>&bull;</span>
                                <span className="flex items-center gap-1">
                                  <MapPin className="w-3 h-3 text-neutral-500" />
                                  <span>{listing.venue}, {listing.city}</span>
                                </span>
                                <span>&bull;</span>
                                <span className="flex items-center gap-1">
                                  <Calendar className="w-3 h-3 text-neutral-500" />
                                  <span>
                                    {new Date(listing.startDate).toLocaleDateString()} &rarr; {new Date(listing.endDate).toLocaleDateString()}
                                  </span>
                                </span>
                              </div>
                            </div>

                            {/* STATUS PILL */}
                            <div>
                              {isPending && (
                                <span className="px-3 py-1 rounded-full bg-amber-400/20 text-amber-300 border border-amber-400/40 font-bold text-[10px] flex items-center gap-1.5 animate-pulse">
                                  <span className="w-1.5 h-1.5 rounded-full bg-amber-400"></span>
                                  <span>AWAITING VERIFICATION</span>
                                </span>
                              )}
                              {isVerified && (
                                <span className="px-3 py-1 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 font-bold text-[10px] flex items-center gap-1.5">
                                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                                  <span>VERIFIED &bull; LIVE GLOBALLY</span>
                                </span>
                              )}
                              {isRejected && (
                                <span className="px-3 py-1 rounded-full bg-rose-500/20 text-rose-300 border border-rose-500/40 font-bold text-[10px] flex items-center gap-1.5">
                                  <XCircle className="w-3.5 h-3.5 text-rose-400" />
                                  <span>REJECTED</span>
                                </span>
                              )}
                            </div>
                          </div>

                          {/* DETAILS GRID */}
                          <div className="grid grid-cols-1 md:grid-cols-3 gap-3 text-[11px]">
                            {/* Organizer Dossier */}
                            <div className="p-3.5 rounded-xl bg-black/60 border border-white/5 space-y-1">
                              <span className="text-[9px] text-neutral-500 font-bold uppercase tracking-wider block">
                                ORGANIZER DOSSIER
                              </span>
                              <div className="text-white font-bold">{listing.organizerName}</div>
                              <div className="text-neutral-400 font-sans text-[11px] truncate">{listing.organizerEmail}</div>
                              {listing.organizerPhone && (
                                <div className="text-neutral-500 text-[10px] font-mono">Tel: {listing.organizerPhone}</div>
                              )}
                              {listing.institution && (
                                <div className="text-cyan-300/80 text-[10px] truncate">Inst: {listing.institution}</div>
                              )}
                            </div>

                            {/* Pass Tiers & Ticketing */}
                            <div className="p-3.5 rounded-xl bg-black/60 border border-white/5 space-y-1">
                              <span className="text-[9px] text-neutral-500 font-bold uppercase tracking-wider block">
                                TICKETING &amp; PASS TIERS
                              </span>
                              <div className="text-amber-300 font-bold">
                                {parsedTiers.length > 0 
                                  ? `${parsedTiers.length} Pass Tier(s) Configured` 
                                  : listing.ticketPrice > 0 ? `Base: ₹${listing.ticketPrice}` : 'Free Entry'}
                              </div>
                              <div className="space-y-0.5">
                                {parsedTiers.slice(0, 2).map((t: any, idx: number) => (
                                  <div key={idx} className="text-neutral-400 flex items-center justify-between text-[10px]">
                                    <span className="truncate">{t.name}</span>
                                    <span className="text-white font-mono font-bold">₹{t.price}</span>
                                  </div>
                                ))}
                              </div>
                              <div className="text-[9px] text-emerald-400/90 font-bold pt-0.5">
                                0% GST (Age &le; 18) &bull; 6% GST (Age &gt; 18)
                              </div>
                            </div>

                            {/* Committees or Description */}
                            <div className="p-3.5 rounded-xl bg-black/60 border border-white/5 space-y-1">
                              <span className="text-[9px] text-neutral-500 font-bold uppercase tracking-wider block">
                                COMMITTEES &amp; DESCRIPTION
                              </span>
                              {parsedCommittees.length > 0 ? (
                                <div className="space-y-0.5">
                                  <span className="text-white font-bold">{parsedCommittees.length} Committee Chamber(s)</span>
                                  <div className="text-neutral-400 text-[10px] truncate">
                                    {parsedCommittees.map((c: any) => c.shortName || c.name).join(', ')}
                                  </div>
                                </div>
                              ) : (
                                <p className="text-neutral-400 font-sans text-[11px] line-clamp-2">
                                  {listing.description}
                                </p>
                              )}
                              {listing.verifiedAt && (
                                <div className="text-[9px] text-neutral-500 pt-1">
                                  Verified {new Date(listing.verifiedAt).toLocaleDateString()} by {listing.verifiedBy || 'Secretariat'}
                                </div>
                              )}
                            </div>
                          </div>

                          {/* ACTION BUTTONS */}
                          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pt-1 border-t border-white/5">
                            <div className="flex items-center gap-2">
                              <Link
                                href={`/${listing.slug}`}
                                target="_blank"
                                className="px-3 py-1.5 rounded-xl bg-white/5 hover:bg-white/10 text-neutral-300 hover:text-white transition flex items-center gap-1 text-[11px] font-bold"
                              >
                                <ExternalLink className="w-3 h-3 text-cyan-400" />
                                <span>Preview Direct Showcase Page</span>
                              </Link>
                            </div>

                            <div className="flex items-center gap-2 flex-wrap">
                              {isPending && (
                                <>
                                  <button
                                    type="button"
                                    onClick={() => handleRejectListing(listing)}
                                    disabled={isProcessing}
                                    className="px-4 py-2 rounded-xl bg-rose-500/10 hover:bg-rose-500/20 text-rose-300 border border-rose-500/30 text-[11px] font-bold transition flex items-center gap-1.5 cursor-pointer disabled:opacity-50"
                                  >
                                    <XCircle className="w-3.5 h-3.5" />
                                    <span>Reject Submission</span>
                                  </button>
                                  <button
                                    type="button"
                                    onClick={() => handleVerifyListing(listing)}
                                    disabled={isProcessing}
                                    className="px-5 py-2 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-black text-[11px] font-bold transition flex items-center gap-1.5 cursor-pointer shadow-[0_0_20px_rgba(16,185,129,0.3)] disabled:opacity-50"
                                  >
                                    <CheckCircle className="w-4 h-4" />
                                    <span>{isProcessing ? 'Verifying...' : 'Verify & Publish Live'}</span>
                                  </button>
                                </>
                              )}

                              {isVerified && (
                                <>
                                  <button
                                    type="button"
                                    onClick={() => handleRejectListing(listing)}
                                    disabled={isProcessing}
                                    className="px-3 py-1.5 rounded-xl bg-white/5 hover:bg-rose-500/20 text-neutral-400 hover:text-rose-300 border border-white/10 hover:border-rose-500/30 text-[11px] font-bold transition flex items-center gap-1 cursor-pointer disabled:opacity-50"
                                  >
                                    <span>Revoke Verification</span>
                                  </button>
                                  <Link
                                    href={`/${listing.slug}`}
                                    className="px-4 py-2 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-black text-[11px] font-bold transition flex items-center gap-1 cursor-pointer"
                                  >
                                    <span>Open Live Assembly &rarr;</span>
                                  </Link>
                                </>
                              )}

                              {isRejected && (
                                <button
                                  type="button"
                                  onClick={() => handleVerifyListing(listing)}
                                  disabled={isProcessing}
                                  className="px-4 py-2 rounded-xl bg-emerald-500/20 hover:bg-emerald-500/30 text-emerald-300 border border-emerald-500/40 text-[11px] font-bold transition flex items-center gap-1 cursor-pointer disabled:opacity-50"
                                >
                                  <Check className="w-3.5 h-3.5" />
                                  <span>Re-Verify &amp; Restore</span>
                                </button>
                              )}

                              <button
                                type="button"
                                onClick={() => handleDeleteListing(listing)}
                                disabled={isProcessing}
                                className="p-2 rounded-xl bg-white/5 hover:bg-rose-600/20 text-neutral-500 hover:text-rose-400 transition cursor-pointer"
                                title="Delete Listing Record"
                              >
                                <Trash2 className="w-3.5 h-3.5" />
                              </button>
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                );
              })()}
            </div>

            {/* Timing Intelligence & Organizer Override Panel */}
            <div className="p-6 rounded-3xl bg-black/60 border border-white/10 space-y-4">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-white/10 pb-3">
                <div className="flex items-center gap-2">
                  <Clock className="w-4 h-4 text-amber-400" />
                  <span className="text-white font-bold uppercase">Gate Schedule Synchronization</span>
                </div>
                <div className="text-[11px] text-neutral-400 flex items-center gap-2">
                  <span>DOORS OPEN: <strong className="text-white">09:00 AM IST</strong></span>
                  <span>&bull;</span>
                  <span>CLOCK: <strong className="text-cyan-300">{currentTime.toLocaleTimeString()}</strong></span>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {/* Countdown Display */}
                <div className="p-4 rounded-2xl bg-[#080a12] border border-white/5 space-y-1">
                  <span className="text-[10px] text-neutral-400 font-bold uppercase tracking-wider">DOORS OPEN COUNTDOWN</span>
                  <div className="text-lg font-bold text-amber-300 font-mono tracking-wider">
                    {adminCountdownFormatted}
                  </div>
                  <span className="text-[10px] text-neutral-500">Auto-arms scanner when timer reaches 00:00:00</span>
                </div>

                {/* Status Indicator */}
                <div className="p-4 rounded-2xl bg-[#080a12] border border-white/5 space-y-1">
                  <span className="text-[10px] text-neutral-400 font-bold uppercase tracking-wider">GATE LOCK STATUS</span>
                  <div className="flex items-center gap-2">
                    {isGateArmed ? (
                      <span className="text-emerald-400 font-bold flex items-center gap-1.5 text-xs">
                        <Unlock className="w-3.5 h-3.5" />
                        <span>ARMED &bull; SCANNING OPEN</span>
                      </span>
                    ) : (
                      <span className="text-amber-400 font-bold flex items-center gap-1.5 text-xs">
                        <Lock className="w-3.5 h-3.5" />
                        <span>STANDBY &bull; AWAITING START</span>
                      </span>
                    )}
                  </div>
                  <span className="text-[10px] text-neutral-500">
                    {adminManualGateArmed 
                      ? 'Manual Organizer Override active' 
                      : isEventStarted 
                        ? 'Doors open officially by schedule' 
                        : 'Locked until official 09:00 AM start'}
                  </span>
                </div>

                {/* Organizer Choice Toggle */}
                <div className="p-4 rounded-2xl bg-[#080a12] border border-white/5 flex flex-col justify-between gap-2">
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] text-neutral-400 font-bold uppercase tracking-wider">ORGANIZER CHOICE OVERRIDE</span>
                    <Power className={`w-3.5 h-3.5 ${adminManualGateArmed ? 'text-cyan-400' : 'text-neutral-600'}`} />
                  </div>
                  <button
                    type="button"
                    onClick={() => {
                      const next = !adminManualGateArmed;
                      setAdminManualGateArmed(next);
                      notify(next ? 'Manual Gate Override engaged: Scanner armed early.' : 'Manual Gate Override disengaged: Awaiting schedule.');
                    }}
                    className={`w-full py-2 px-3 rounded-xl font-bold text-xs transition cursor-pointer flex items-center justify-center gap-2 ${
                      adminManualGateArmed
                        ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/40 hover:bg-cyan-500/30'
                        : 'bg-white/5 text-neutral-300 border border-white/10 hover:bg-white/10 hover:text-white'
                    }`}
                  >
                    <span>{adminManualGateArmed ? 'Disengage Manual Override' : 'Force Arm Early (Admit Dais/VIPs)'}</span>
                  </button>
                  <span className="text-[9px] text-neutral-500 leading-tight">
                    Admit Dais, Executive Board, or rehearsal attendees before 09:00 AM.
                  </span>
                </div>
              </div>
            </div>

            {/* Attendance & Turnout Telemetry Bar */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              <div className="p-4 rounded-2xl bg-[#080a12] border border-white/5 space-y-1">
                <span className="text-[10px] text-neutral-400 uppercase font-bold">TOTAL REGISTERED</span>
                <div className="text-xl font-bold text-white">{applications.length}</div>
                <span className="text-[9px] text-neutral-500">Live Delegate Quota</span>
              </div>
              <div className="p-4 rounded-2xl bg-[#080a12] border border-white/5 space-y-1">
                <span className="text-[10px] text-neutral-400 uppercase font-bold">CHECKED IN</span>
                <div className="text-xl font-bold text-emerald-400">{checkedInCount}</div>
                <span className="text-[9px] text-emerald-400/80 font-bold">
                  {applications.length > 0 ? `${Math.round((checkedInCount / applications.length) * 100)}% Turnout` : `${checkedInCount} Admitted`}
                </span>
              </div>
              <div className="p-4 rounded-2xl bg-[#080a12] border border-white/5 space-y-1">
                <span className="text-[10px] text-neutral-400 uppercase font-bold">GATE TERMINAL</span>
                <div className="text-xl font-bold text-cyan-300">ONLINE</div>
                <span className="text-[9px] text-neutral-500">GATE-ALPHA-01</span>
              </div>
              <div className="p-4 rounded-2xl bg-[#080a12] border border-white/5 space-y-1">
                <span className="text-[10px] text-neutral-400 uppercase font-bold">GST POLICY</span>
                <div className="text-xl font-bold text-amber-300">ACTIVE</div>
                <span className="text-[9px] text-neutral-500">0% Student / 6% General</span>
              </div>
            </div>

            {/* Check-in Scanner Terminal Form */}
            <form onSubmit={(e) => handleSimulateCheckin(e)} className="p-6 sm:p-8 rounded-3xl bg-black/60 border border-white/10 space-y-5">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-white/10 pb-3">
                <div className="flex items-center gap-2">
                  <QrCode className="w-4 h-4 text-cyan-400" />
                  <span className="text-white font-bold uppercase">On-Ground Gate Scanner Input</span>
                </div>
                <span className="text-[10px] text-neutral-500">TERMINAL: GATE-ALPHA-01 &bull; PROTOCOL 2026</span>
              </div>

              <div className="flex flex-col sm:flex-row gap-3">
                <input
                  type="text"
                  required
                  value={scannerTokenInput}
                  onChange={(e) => setScannerTokenInput(e.target.value)}
                  placeholder="Scan or enter Attendee Ticket Token / Pass Code..."
                  className="flex-1 px-4 py-3 rounded-xl bg-black border border-white/20 text-white text-xs focus:outline-none focus:border-cyan-400 tracking-wider font-mono"
                />
                <button
                  type="submit"
                  className="px-6 py-3 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-black font-bold uppercase transition cursor-pointer flex items-center justify-center gap-2"
                >
                  <UserCheck className="w-4 h-4" />
                  <span>Verify &amp; Check In</span>
                </button>
              </div>

              {/* Detailed Verified Attendee Holographic Pass Card */}
              {scannerResult && (
                <div className={`p-5 rounded-2xl border space-y-4 transition ${
                  scannerResult.status === 'success'
                    ? 'bg-emerald-500/[0.06] border-emerald-500/40 text-emerald-300'
                    : scannerResult.status === 'warning'
                      ? 'bg-amber-500/[0.06] border-amber-500/40 text-amber-300'
                      : 'bg-rose-500/[0.06] border-rose-500/40 text-rose-300'
                }`}>
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-white/10 pb-3">
                    <div className="flex items-center gap-2">
                      {scannerResult.status === 'success' && <CheckCircle2 className="w-5 h-5 text-emerald-400" />}
                      {scannerResult.status === 'warning' && <AlertTriangle className="w-5 h-5 text-amber-400" />}
                      {scannerResult.status === 'error' && <XCircle className="w-5 h-5 text-rose-400" />}
                      <div>
                        <span className="font-bold text-sm text-white">{scannerResult.name}</span>
                        <div className="text-[10px] text-neutral-400 font-sans">{scannerResult.handle} &bull; {scannerResult.school}</div>
                      </div>
                    </div>
                    <div>
                      {scannerResult.ageCategory === 'STUDENT' ? (
                        <span className="px-3 py-1 rounded-full bg-emerald-500/20 border border-emerald-500/40 text-emerald-300 font-bold text-[10px] flex items-center gap-1.5">
                          <GraduationCap className="w-3.5 h-3.5 text-emerald-400" />
                          <span>STUDENT PASS &bull; AGE &le; 18 &bull; 0% GST EXEMPT</span>
                        </span>
                      ) : (
                        <span className="px-3 py-1 rounded-full bg-cyan-500/20 border border-cyan-500/40 text-cyan-300 font-bold text-[10px] flex items-center gap-1.5">
                          <Users className="w-3.5 h-3.5 text-cyan-400" />
                          <span>GENERAL ATTENDEE &bull; AGE &gt; 18 &bull; 6% GST</span>
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Metadata Grid */}
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-[11px] font-mono">
                    <div className="p-3 rounded-xl bg-black/50 border border-white/5 space-y-0.5">
                      <span className="text-[9px] text-neutral-500 uppercase">COMMITTEE / DESK</span>
                      <div className="text-white font-bold truncate">{scannerResult.committee}</div>
                    </div>
                    <div className="p-3 rounded-xl bg-black/50 border border-white/5 space-y-0.5">
                      <span className="text-[9px] text-neutral-500 uppercase">SEAT NUMBER</span>
                      <div className="text-white font-bold">{scannerResult.seat}</div>
                    </div>
                    <div className="p-3 rounded-xl bg-black/50 border border-white/5 space-y-0.5">
                      <span className="text-[9px] text-neutral-500 uppercase">GATE &bull; TIMESTAMP</span>
                      <div className="text-white font-bold">{scannerResult.gateTerminal} &bull; {scannerResult.timestamp}</div>
                    </div>
                    <div className="p-3 rounded-xl bg-black/50 border border-white/5 space-y-0.5">
                      <span className="text-[9px] text-neutral-500 uppercase">PULSE SECURITY HASH</span>
                      <div className="text-cyan-400 font-bold text-[10px] truncate">{scannerResult.securityHash}</div>
                    </div>
                  </div>

                  <div className="text-[11px] font-sans p-3 rounded-xl bg-black/40 border border-white/5">
                    {scannerResult.message}
                  </div>

                  <div className="flex items-center justify-between pt-1">
                    <span className="text-[10px] text-neutral-400">TICKET TOKEN: <strong className="text-white">{scannerResult.ticketId}</strong></span>
                    <button
                      type="button"
                      onClick={() => setScannerResult(null)}
                      className="text-[10px] text-neutral-400 hover:text-white underline cursor-pointer"
                    >
                      Clear &amp; Scan Next Attendee
                    </button>
                  </div>
                </div>
              )}
            </form>
          </div>
        )}

        {/* ========================================================================= */}
        {/* ── SECTION 04: ZEN.MUN DESK ───────────────────────────────────────────── */}
        {/* ========================================================================= */}
        {activeSection === '04_zen_mun_desk' && (
          <div className="space-y-6 w-full font-mono text-xs">
            <div className="p-6 rounded-3xl bg-[#080a12] border border-cyan-500/30 space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-cyan-300 font-bold uppercase tracking-wider flex items-center gap-2">
                  <Globe className="w-4 h-4 text-cyan-400" />
                  <span>ZEN.MUN DESK &bull; Dais Setup &amp; Committee Matrix</span>
                </span>
                <span className="text-[10px] text-neutral-400">CONFERENCE ASSEMBLY OS</span>
              </div>
              <p className="text-neutral-300 font-sans text-xs">
                Manage dais executive boards, inspect country matrix assignments, and monitor draft resolutions.
              </p>
            </div>

            <div className="p-6 rounded-3xl bg-black/60 border border-white/10 space-y-4">
              <div className="flex items-center justify-between border-b border-white/10 pb-3">
                <span className="text-white font-bold uppercase">Live Conference Dossiers</span>
                {conferences.length > 0 && (() => {
                  const comm = conferences[0].committees?.[0];
                  const commCode = typeof comm === 'string' ? comm.toLowerCase() : (comm?.shortName || 'matrix').toLowerCase();
                  const commTitle = typeof comm === 'string' ? comm.toUpperCase() : (comm?.shortName || 'Committee').toUpperCase();
                  return (
                    <Link
                      href={`/${conferences[0].slug || conferences[0].id}/${commCode}/matrix`}
                      className="text-[11px] text-cyan-400 hover:underline flex items-center gap-1"
                    >
                      <span>Open {commTitle} Matrix</span>
                      <ExternalLink className="w-3 h-3" />
                    </Link>
                  );
                })()}
              </div>

              {conferences.length > 0 ? (
                conferences.map((conf) => (
                  <div key={conf.id} className="p-4 rounded-2xl bg-[#080a12] border border-white/5 space-y-2">
                    <div className="text-white font-bold text-xs">{conf.name}</div>
                    <div className="text-[11px] text-neutral-400 font-sans">
                      {conf.tagline || 'Sovereign Assembly Plenary'} &bull; Secretariat: {conf.secretariatChair || 'Presiding Council'}
                    </div>
                  </div>
                ))
              ) : (
                <div className="p-4 rounded-2xl bg-[#080a12] border border-white/5 text-center text-neutral-400 text-xs">
                  No active conference dossiers found. Create or convene a conference in the MUN Dais portal.
                </div>
              )}
            </div>
          </div>
        )}

        {/* ========================================================================= */}
        {/* ── SECTION 05: CONTENT MODERATION ─────────────────────────────────────── */}
        {/* ========================================================================= */}
        {activeSection === '05_content_moderation' && (
          <div className="space-y-6 w-full font-mono text-xs">
            <div className="p-6 rounded-3xl bg-[#080a12] border border-rose-500/30 space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-rose-300 font-bold uppercase tracking-wider flex items-center gap-2">
                  <ShieldAlert className="w-4 h-4 text-rose-400" />
                  <span>CONTENT MODERATION &bull; Community Safety &amp; Article 12</span>
                </span>
                <span className="text-[10px] text-neutral-400">{contentReports.length} OPEN REPORTS</span>
              </div>
              <p className="text-neutral-300 font-sans text-xs">
                Maintain community safety, verify citations under Article 12, and take down policy violations.
              </p>
            </div>

            <div className="space-y-3">
              {contentReports.map((rep) => (
                <div key={rep.id} className="p-5 rounded-3xl bg-black/60 border border-white/10 space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-white font-bold text-xs">{rep.contentTitle}</span>
                    <span className="text-[10px] text-neutral-400">{rep.reportedAt}</span>
                  </div>
                  <div className="text-[11px] text-neutral-400 font-sans">Author: {rep.author}</div>
                  <div className="p-3 rounded-2xl bg-rose-500/10 border border-rose-500/20 text-rose-300 text-[11px]">
                    Reason: {rep.reason}
                  </div>

                  <div className="flex items-center gap-2 pt-1">
                    <button
                      type="button"
                      onClick={() => handleResolveReport(rep.id, 'DISMISSED')}
                      className="px-4 py-2 rounded-xl bg-white/10 hover:bg-white/20 text-white font-bold transition text-xs cursor-pointer"
                    >
                      Dismiss Report
                    </button>
                    <button
                      type="button"
                      onClick={() => handleResolveReport(rep.id, 'PURGED')}
                      className="px-4 py-2 rounded-xl bg-rose-600 hover:bg-rose-500 text-white font-bold transition text-xs cursor-pointer"
                    >
                      Takedown &amp; Issue Strike
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ========================================================================= */}
        {/* ── SECTION 06: REGISTRATIONS ──────────────────────────────────────────── */}
        {/* ========================================================================= */}
        {activeSection === '06_registrations' && (
          <div className="space-y-6 w-full font-mono text-xs">
            <div className="p-6 rounded-3xl bg-[#080a12] border border-cyan-500/30 space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-cyan-300 font-bold uppercase tracking-wider flex items-center gap-2">
                  <Users className="w-4 h-4 text-cyan-400" />
                  <span>REGISTRATIONS &bull; Application Processing Desk</span>
                </span>
                <span className="text-[10px] text-amber-400 font-bold">{applications.length} PENDING ALLOTMENTS</span>
              </div>
              <p className="text-neutral-300 font-sans text-xs">
                Process delegate applications, approve country portfolio allocations, and dispatch acceptance letters.
              </p>
            </div>

            <div className="space-y-3">
              {applications.length === 0 ? (
                <div className="p-8 rounded-3xl bg-black/40 border border-white/10 text-center space-y-2">
                  <CheckCircle2 className="w-8 h-8 text-emerald-400 mx-auto opacity-70" />
                  <span className="text-white font-bold block text-sm">No Pending Applications</span>
                  <p className="text-neutral-400 font-sans text-xs max-w-sm mx-auto">
                    All delegate applications have been processed. Newly submitted event registrations will appear here for portfolio and seat allocation.
                  </p>
                </div>
              ) : (
                applications.map((app) => (
                  <div key={app.id} className="p-5 rounded-3xl bg-black/60 border border-white/10 space-y-3">
                    <div className="flex items-center justify-between">
                      <div>
                        <span className="text-white font-bold text-xs">{app.applicantName}</span>
                        <span className="text-neutral-400 text-[11px] block">{app.applicantEmail}</span>
                      </div>
                      <span className="text-[10px] px-2 py-0.5 rounded font-bold bg-amber-400/20 text-amber-300">
                        {app.tier}
                      </span>
                    </div>

                    <div className="p-3 rounded-2xl bg-[#080a12] border border-white/5 space-y-1 text-[11px]">
                      <div className="text-neutral-400">Event: <span className="text-white font-bold">{app.eventTitle}</span></div>
                      <div className="text-neutral-400">Institution: <span className="text-cyan-300">{app.institution}</span></div>
                      <div className="text-neutral-400">Preference: <span className="text-amber-300 font-bold">{app.countryPreference}</span></div>
                    </div>

                    <div className="flex items-center gap-2 pt-1">
                      <button
                        type="button"
                        onClick={() => handleApproveApplication(app.id)}
                        className="px-4 py-2 rounded-xl bg-emerald-500/20 hover:bg-emerald-500/30 text-emerald-300 font-bold transition text-xs cursor-pointer"
                      >
                        Approve &amp; Allocate Seat
                      </button>
                      <button
                        type="button"
                        onClick={() => handleRejectApplication(app.id)}
                        className="px-4 py-2 rounded-xl bg-rose-500/20 hover:bg-rose-500/30 text-rose-300 font-bold transition text-xs cursor-pointer"
                      >
                        Reject
                      </button>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        )}

        {/* ========================================================================= */}
        {/* ── SECTION 07: PAYMENTS DESK ──────────────────────────────────────────── */}
        {/* ========================================================================= */}
        {activeSection === '07_payments_desk' && (
          <div className="space-y-6 w-full font-mono text-xs">
            <div className="p-6 rounded-3xl bg-[#080a12] border border-cyan-500/30 space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-cyan-300 font-bold uppercase tracking-wider flex items-center gap-2">
                  <CreditCard className="w-4 h-4 text-cyan-400" />
                  <span>PAYMENTS DESK &bull; Cashfree Ledger &amp; Student GST</span>
                </span>
                <span className="text-[10px] text-emerald-400 font-bold">RECONCILED</span>
              </div>
              <p className="text-neutral-300 font-sans text-xs">
                Transaction monitoring, age-aware GST verification (0% &le;18 / 6% &gt;18), and refund escalation.
              </p>
            </div>

            <div className="p-6 rounded-3xl bg-black/60 border border-white/10 space-y-4">
              <div className="flex items-center justify-between border-b border-white/10 pb-3">
                <span className="text-white font-bold uppercase">Recent Cashfree Transactions</span>
                <button
                  type="button"
                  onClick={() => setIsEscalatingOpen(true)}
                  className="text-[10px] text-amber-400 hover:text-white underline cursor-pointer"
                >
                  Request Refund from Founder &rarr;
                </button>
              </div>

              <div className="space-y-2">
                <div className="p-3.5 rounded-2xl bg-[#080a12] border border-white/5 flex items-center justify-between text-[11px]">
                  <div>
                    <span className="text-white font-bold">TXN-CF-9042 &bull; ₹1,800.00</span>
                    <span className="text-neutral-400 block text-[10px]">Delegate Allotment Pass &bull; Student Age: 17 (0% GST)</span>
                  </div>
                  <span className="text-[10px] font-bold text-emerald-400">SETTLED</span>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* ========================================================================= */}
        {/* ── SECTION 08: CUSTOMER SUPPORT ───────────────────────────────────────── */}
        {/* ========================================================================= */}
        {activeSection === '08_customer_support' && (
          <div className="w-full">
            <StaffSupportWorkspace />
          </div>
        )}

        {/* ========================================================================= */}
        {/* ── SECTION 09: ANNOUNCEMENTS ──────────────────────────────────────────── */}
        {/* ========================================================================= */}
        {activeSection === '09_announcements' && (
          <div className="space-y-6 w-full font-mono text-xs">
            <div className="p-6 rounded-3xl bg-[#080a12] border border-cyan-500/30 space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-cyan-300 font-bold uppercase tracking-wider flex items-center gap-2">
                  <Send className="w-4 h-4 text-cyan-400" />
                  <span>ANNOUNCEMENTS &bull; Permitted Operations Notices</span>
                </span>
                <span className="text-[10px] text-neutral-400">DISPATCH CONSOLE</span>
              </div>
              <p className="text-neutral-300 font-sans text-xs">
                Draft session updates, committee reminders, and broadcast room alerts to attendees.
              </p>
            </div>

            <div className="p-6 rounded-3xl bg-black/60 border border-white/10 space-y-3">
              <span className="text-white font-bold uppercase">Compose Operations Bulletin</span>
              <input
                type="text"
                placeholder="Notice headline..."
                className="w-full px-4 py-3 rounded-xl bg-black border border-white/20 text-white text-xs focus:outline-none focus:border-cyan-400"
              />
              <textarea
                rows={3}
                placeholder="Notice text broadcasted to registered attendees..."
                className="w-full px-4 py-3 rounded-xl bg-black border border-white/20 text-white text-xs focus:outline-none focus:border-cyan-400"
              />
              <button
                type="button"
                onClick={() => notify('Bulletin dispatched to assembly rooms!')}
                className="px-6 py-2.5 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-black font-bold uppercase transition cursor-pointer"
              >
                Dispatch Notice
              </button>
            </div>
          </div>
        )}

        {/* ========================================================================= */}
        {/* ── SECTION 10: REPORTS & ANALYTICS ────────────────────────────────────── */}
        {/* ========================================================================= */}
        {activeSection === '10_reports_analytics' && (
          <div className="space-y-6 w-full font-mono text-xs">
            <div className="p-6 rounded-3xl bg-[#080a12] border border-cyan-500/30 space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-cyan-300 font-bold uppercase tracking-wider flex items-center gap-2">
                  <TrendingUp className="w-4 h-4 text-cyan-400" />
                  <span>REPORTS &amp; ANALYTICS &bull; Turnout &amp; Operational Stats</span>
                </span>
                <span className="text-[10px] text-neutral-400">DAILY SUMMARY</span>
              </div>
              <p className="text-neutral-300 font-sans text-xs">
                Committee turnout velocity, support resolution times, and exportable operational summaries.
              </p>
            </div>

            <div className="p-6 rounded-3xl bg-black/60 border border-white/10 space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-white font-bold uppercase">Operations Daily Summary</span>
                <button
                  type="button"
                  onClick={() => notify('Exporting operational report CSV...')}
                  className="px-4 py-2 rounded-xl bg-white/10 hover:bg-white/20 text-white font-bold transition flex items-center gap-2 text-xs cursor-pointer"
                >
                  <Download className="w-3.5 h-3.5" />
                  <span>Download Report CSV</span>
                </button>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-[11px]">
                <div className="p-3.5 rounded-2xl bg-[#080a12] border border-white/5">
                  <span className="text-neutral-500 text-[10px] block">Avg Ticket Resolution:</span>
                  <span className="text-white font-bold text-sm">18 minutes</span>
                </div>
                <div className="p-3.5 rounded-2xl bg-[#080a12] border border-white/5">
                  <span className="text-neutral-500 text-[10px] block">Check-in Velocity:</span>
                  <span className="text-emerald-400 font-bold text-sm">14 delegates / min</span>
                </div>
                <div className="p-3.5 rounded-2xl bg-[#080a12] border border-white/5">
                  <span className="text-neutral-500 text-[10px] block">Applications Cleared:</span>
                  <span className="text-cyan-300 font-bold text-sm">98.2%</span>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* ========================================================================= */}
        {/* ── SECTION 11: TEAM WORKSPACE ─────────────────────────────────────────── */}
        {/* ========================================================================= */}
        {activeSection === '11_team_workspace' && (
          <div className="space-y-6 w-full font-mono text-xs">
            <div className="p-6 rounded-3xl bg-[#080a12] border border-cyan-500/30 space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-cyan-300 font-bold uppercase tracking-wider flex items-center gap-2">
                  <Briefcase className="w-4 h-4 text-cyan-400" />
                  <span>TEAM WORKSPACE &bull; Staff Duty Shifts &amp; Roster</span>
                </span>
                <span className="text-[10px] text-neutral-400">OPERATIONS TEAM</span>
              </div>
              <p className="text-neutral-300 font-sans text-xs">
                Operations shifts, handover bulletins, and active duty assignments.
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="p-6 rounded-3xl bg-black/60 border border-white/10 space-y-3">
                <span className="text-white font-bold text-sm block">Active Shift Roster</span>
                <div className="space-y-2 text-[11px]">
                  <div className="p-3 rounded-2xl bg-[#080a12] border border-white/5 flex items-center justify-between">
                    <span className="text-white font-bold">{operatorIdentity}</span>
                    <span className="text-emerald-400 font-bold">ACTIVE SHIFT (ON DUTY)</span>
                  </div>
                  <div className="p-3 rounded-2xl bg-[#080a12] border border-white/5 flex items-center justify-between">
                    <span className="text-white font-bold">Duty Operations Console</span>
                    <span className="text-cyan-300 font-bold">STANDBY DISPATCH</span>
                  </div>
                </div>
              </div>

              <div className="p-6 rounded-3xl bg-black/60 border border-white/10 space-y-3">
                <span className="text-white font-bold text-sm block">Shift Handover Notes</span>
                <p className="text-neutral-400 font-sans text-xs leading-relaxed">
                  Morning check-ins completed smoothly. UNGA Plenary requires extra microphones in Room 4. Cashfree PG running without errors.
                </p>
              </div>
            </div>
          </div>
        )}

        {/* ========================================================================= */}
        {/* ── SECTION 12: ADMIN SETTINGS ─────────────────────────────────────────── */}
        {/* ========================================================================= */}
        {activeSection === '12_admin_settings' && (
          <div className="space-y-6 w-full font-mono text-xs">
            <div className="p-6 rounded-3xl bg-[#080a12] border border-cyan-500/30 space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-cyan-300 font-bold uppercase tracking-wider flex items-center gap-2">
                  <Sliders className="w-4 h-4 text-cyan-400" />
                  <span>ADMIN SETTINGS &bull; Personal Workstation Preferences</span>
                </span>
                <span className="text-[10px] text-neutral-400">STAFF PREFERENCES</span>
              </div>
              <p className="text-neutral-300 font-sans text-xs">
                Configure workstation density, notification tones, and saved ticket resolution macros.
              </p>
            </div>

            <div className="p-6 rounded-3xl bg-black/60 border border-white/10 space-y-4">
              <span className="text-white font-bold uppercase">Workstation Configuration</span>
              <div className="space-y-3">
                <label className="flex items-center gap-2.5 cursor-pointer text-neutral-300">
                  <input type="checkbox" defaultChecked className="w-4 h-4 rounded bg-black border-white/20 text-cyan-500 focus:ring-0" />
                  <span>Real-time audio chime on high-priority ticket</span>
                </label>
                <label className="flex items-center gap-2.5 cursor-pointer text-neutral-300">
                  <input type="checkbox" defaultChecked className="w-4 h-4 rounded bg-black border-white/20 text-cyan-500 focus:ring-0" />
                  <span>High-density operations table view</span>
                </label>
              </div>
            </div>
          </div>
        )}
      </main>

      {/* ── NEW ESCALATION TO FOUNDER MODAL ── */}
      {isEscalatingOpen && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="w-full max-w-lg p-6 sm:p-8 rounded-3xl bg-[#080a12] border border-amber-500/40 shadow-2xl space-y-4 font-mono text-xs">
            <div className="flex items-center justify-between border-b border-white/10 pb-3">
              <span className="text-amber-300 font-bold uppercase flex items-center gap-2">
                <Crown className="w-4 h-4 text-amber-400" />
                <span>Submit Escalation to Founder (@yuveer)</span>
              </span>
              <button
                type="button"
                onClick={() => setIsEscalatingOpen(false)}
                className="text-neutral-400 hover:text-white cursor-pointer"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleCreateEscalation} className="space-y-3.5">
              <div className="space-y-1">
                <label className="text-[10px] text-neutral-400 uppercase font-bold">Escalation Subject</label>
                <input
                  type="text"
                  required
                  value={newEscalationTitle}
                  onChange={(e) => setNewEscalationTitle(e.target.value)}
                  placeholder="e.g. Refund Request for Duplicate Delegate Pass..."
                  className="w-full px-4 py-3 rounded-xl bg-black border border-white/20 text-white text-xs focus:outline-none focus:border-amber-400"
                />
              </div>

              <div className="space-y-1">
                <label className="text-[10px] text-neutral-400 uppercase font-bold">Department</label>
                <select
                  value={newEscalationDept}
                  onChange={(e) => setNewEscalationDept(e.target.value)}
                  className="w-full px-4 py-3 rounded-xl bg-black border border-white/20 text-white text-xs focus:outline-none focus:border-amber-400 cursor-pointer"
                >
                  <option value="Finance & Payments">Finance &amp; Payments</option>
                  <option value="Student KYC / Passport">Student KYC / Passport</option>
                  <option value="Account Appeals">Account Appeals</option>
                  <option value="Security Exception">Security Exception</option>
                </select>
              </div>

              <div className="space-y-1">
                <label className="text-[10px] text-neutral-400 uppercase font-bold">Details &amp; Reason for Level 0 Intervention</label>
                <textarea
                  required
                  rows={4}
                  value={newEscalationDesc}
                  onChange={(e) => setNewEscalationDesc(e.target.value)}
                  placeholder="Provide precise details, transaction IDs, or justification..."
                  className="w-full px-4 py-3 rounded-xl bg-black border border-white/20 text-white text-xs focus:outline-none focus:border-amber-400"
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setIsEscalatingOpen(false)}
                  className="px-4 py-2.5 rounded-xl bg-white/10 hover:bg-white/20 text-white font-bold transition cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-6 py-2.5 rounded-xl bg-amber-400 hover:bg-amber-300 text-black font-bold uppercase transition cursor-pointer"
                >
                  Submit to Founder
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
