'use client';

import React, { useState, useMemo, useEffect } from 'react';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Users,
  IndianRupee,
  ShieldCheck,
  QrCode,
  Calendar,
  Clock,
  MapPin,
  CheckCircle2,
  AlertTriangle,
  FileSpreadsheet,
  RefreshCw,
  ExternalLink,
  Radio,
  Search,
  Filter,
  CreditCard,
  Building,
  GraduationCap,
  Sparkles,
  Lock,
  Unlock,
  Check,
  Copy,
  ChevronDown,
  ArrowRight,
  ShieldAlert,
  Send,
  Download,
  Percent,
  Sliders,
  Camera,
  Layers,
  Share2,
  Briefcase,
  LifeBuoy
} from 'lucide-react';
import { ZenEvent, EventAttendee } from '@/types/events';
import { RevenueFeeSimulatorModal } from '@/components/pulse/RevenueFeeSimulatorModal';
import { ZenPassScannerModal } from '../ZenPassScannerModal';
import { EventPlansPaymentLinksModal } from '@/components/payments/EventPlansPaymentLinksModal';
import { EventRecruitmentWorkspace } from './EventRecruitmentWorkspace';
import { ZenSheetsWorkspace } from '../sheets/ZenSheetsWorkspace';
import OrganizerKycModal from '../OrganizerKycModal';
import { useAuth } from '@/context/AuthContext';

interface DistrictHostCommandCenterProps {
  event: ZenEvent;
  allEvents?: ZenEvent[];
  initialTab?: 'roster' | 'sheets' | 'simulator' | 'scanner' | 'recruitment';
  onSelectEvent?: (event: ZenEvent) => void;
  onUpdateEvent?: (id: string, updates: Partial<ZenEvent>) => void;
  onCheckInAttendee?: (attendeeUserId: string) => void;
  onOpenAccessModal?: () => void;
  onOpenEditModal?: () => void;
}

export const DistrictHostCommandCenter: React.FC<DistrictHostCommandCenterProps> = ({
  event,
  allEvents = [],
  initialTab,
  onSelectEvent,
  onUpdateEvent,
  onCheckInAttendee,
  onOpenAccessModal,
  onOpenEditModal,
}) => {
  // Navigation sub-tabs inside Host Command Center
  const [activeTab, setActiveTab] = useState<'roster' | 'sheets' | 'simulator' | 'scanner' | 'recruitment'>(
    initialTab || 'roster'
  );

  useEffect(() => {
    if (initialTab) setActiveTab(initialTab);
  }, [initialTab]);

  const { user, profile } = useAuth();

  // Modals
  const [isSimulatorOpen, setIsSimulatorOpen] = useState(false);
  const [isScannerOpen, setIsScannerOpen] = useState(false);
  const [isPlansModalOpen, setIsPlansModalOpen] = useState(false);
  const [isKycModalOpen, setIsKycModalOpen] = useState(false);

  // Search & Filter for Attendees
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<'all' | 'checked_in' | 'going' | 'student' | 'general'>('all');

  // Google Sheets Sync State
  const [isSyncingSheets, setIsSyncingSheets] = useState(false);
  const [sheetsSyncFeedback, setSheetsSyncFeedback] = useState<{
    success: boolean;
    message: string;
    syncedCount?: number;
    timestamp?: string;
  } | null>(null);
  const [copiedWebhook, setCopiedWebhook] = useState(false);

  // Manual Quick Verification Terminal State
  const [quickScanInput, setQuickScanInput] = useState('');
  const [isVerifyingQuickCode, setIsVerifyingQuickCode] = useState(false);
  const [quickVerificationResult, setQuickVerificationResult] = useState<{
    type: 'idle' | 'success' | 'warning' | 'error';
    message: string;
    ticket?: any;
    timestamp?: string;
  }>({
    type: 'idle',
    message: '',
  });

  // Door timing calculations
  const [currentTime, setCurrentTime] = useState(new Date());
  const [manualGateOverride, setManualGateOverride] = useState(false);

  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  const eventStartDate = useMemo(() => {
    const d = new Date(event.date);
    if (!isNaN(d.getTime())) return d;
    return new Date();
  }, [event.date]);

  const isEventDoorsOpen = currentTime.getTime() >= eventStartDate.getTime() || manualGateOverride;
  const timeUntilStartMs = eventStartDate.getTime() - currentTime.getTime();

  const doorCountdownFormatted = useMemo(() => {
    if (timeUntilStartMs <= 0 || manualGateOverride) return 'DOORS ACTIVE (ADMITTING)';
    const totalSecs = Math.floor(timeUntilStartMs / 1000);
    const hours = Math.floor(totalSecs / 3600);
    const minutes = Math.floor((totalSecs % 3600) / 60);
    const seconds = totalSecs % 60;
    return `${hours.toString().padStart(2, '0')}h : ${minutes.toString().padStart(2, '0')}m : ${seconds.toString().padStart(2, '0')}s`;
  }, [timeUntilStartMs, manualGateOverride]);

  // Attendees Ledger Computations
  const attendees = useMemo(() => event.attendees || [], [event.attendees]);
  const checkedInAttendees = useMemo(() => attendees.filter((a) => a.status === 'checked_in'), [attendees]);
  const studentAttendees = useMemo(() => attendees.filter((a) => a.isStudent || a.ticketType?.toLowerCase().includes('stud')), [attendees]);
  const generalAttendees = useMemo(() => attendees.filter((a) => !a.isStudent && !a.ticketType?.toLowerCase().includes('stud')), [attendees]);

  const studentCount = studentAttendees.length;
  const generalCount = generalAttendees.length;
  const totalCount = attendees.length;
  const checkedInCount = checkedInAttendees.length;
  const checkInRate = totalCount > 0 ? Math.round((checkedInCount / totalCount) * 100) : 0;

  // Financial calculations
  const studentTicketPrice = event.ticketPrice ? Math.floor(event.ticketPrice * 0.75) : 1000;
  const generalTicketPrice = event.ticketPrice || 1500;
  const calculatedGrossVolume = studentCount * studentTicketPrice + generalCount * generalTicketPrice;
  const grossVolume = calculatedGrossVolume > 0 ? calculatedGrossVolume : totalCount * (event.ticketPrice || 0);

  // Escrow & Settlement: 10% Escrow Holdback, 3.5% Platform + 1.9% Gateway
  const civicEscrowReserve = Math.round(grossVolume * 0.10);
  const platformProcessingFee = Math.round(grossVolume * 0.054);
  const estimatedNetPayout = grossVolume - civicEscrowReserve - platformProcessingFee;

  // Filtered Attendees list
  const filteredAttendees = useMemo(() => {
    return attendees.filter((att) => {
      if (statusFilter === 'checked_in' && att.status !== 'checked_in') return false;
      if (statusFilter === 'going' && att.status === 'checked_in') return false;
      if (statusFilter === 'student' && !(att.isStudent || att.ticketType?.toLowerCase().includes('stud'))) return false;
      if (statusFilter === 'general' && (att.isStudent || att.ticketType?.toLowerCase().includes('stud'))) return false;

      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const matchesName = att.name.toLowerCase().includes(q);
        const matchesHandle = att.username.toLowerCase().includes(q);
        const matchesEmail = att.email?.toLowerCase().includes(q) || false;
        const matchesTicket = att.ticketId?.toLowerCase().includes(q) || false;
        return matchesName || matchesHandle || matchesEmail || matchesTicket;
      }
      return true;
    });
  }, [attendees, statusFilter, searchQuery]);

  // Export Attendees as CSV
  const handleExportCsv = () => {
    const headers = ['User ID', 'Name', 'Username', 'Email', 'Phone', 'Tier', 'Is Student', 'Price', 'Status', 'Ticket ID', 'RSVP Timestamp', 'Checked-In Timestamp'];
    const rows = attendees.map((a) => [
      a.userId,
      `"${a.name.replace(/"/g, '""')}"`,
      `"@${a.username}"`,
      a.email || '',
      a.phone || '',
      a.ticketType || 'Standard Delegate',
      a.isStudent ? 'YES (0% GST)' : 'NO (6% GST)',
      a.price || event.ticketPrice || 0,
      a.status,
      a.ticketId || 'N/A',
      a.rsvpAt || '',
      a.checkedInAt || ''
    ]);

    const csvContent = 'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows.map((e) => e.join(','))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `${event.title.replace(/[^a-z0-9]/gi, '_').toLowerCase()}_delegates.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // Sync Attendees Roster to Google Sheets
  const handleSyncToGoogleSheets = async () => {
    setIsSyncingSheets(true);
    setSheetsSyncFeedback(null);

    try {
      // Dispatch payload to Google Sheets Apps Script via /api/sheets
      const response = await fetch('/api/sheets', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          targetTab: 'Event Registrations',
          action: 'BATCH_SYNC_ROSTER',
          data: {
            eventId: event.id,
            eventTitle: event.title,
            syncedAt: new Date().toISOString(),
            totalAttendees: attendees.length,
            checkedInCount,
            attendeeRoster: attendees.map((a) => ({
              participantName: a.name,
              participantEmail: a.email || `${a.username}@zenvitra.xyz`,
              contactNumber: a.phone || '',
              ticketPassType: a.ticketType || (a.isStudent ? 'Student Pass (0% GST)' : 'General Pass'),
              attendanceMarked: a.status === 'checked_in' ? 'PRESENT' : 'REGISTERED',
              checkedInAt: a.checkedInAt || '',
              ticketId: a.ticketId || '',
            })),
          },
        }),
      });

      const data = await response.json();

      if (data.success) {
        setSheetsSyncFeedback({
          success: true,
          message: `Roster successfully pushed to Google Sheet (Tab: Event Registrations)`,
          syncedCount: attendees.length,
          timestamp: new Date().toLocaleTimeString(),
        });
      } else {
        setSheetsSyncFeedback({
          success: false,
          message: data.error || 'Google Sheets sync failed. Local ledger backup saved.',
          timestamp: new Date().toLocaleTimeString(),
        });
      }
    } catch (err: any) {
      setSheetsSyncFeedback({
        success: false,
        message: 'Could not connect to Google Sheets webhook endpoint.',
        timestamp: new Date().toLocaleTimeString(),
      });
    } finally {
      setIsSyncingSheets(false);
    }
  };

  // Quick Terminal Ticket Verification
  const handleQuickVerify = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!quickScanInput.trim()) return;

    setIsVerifyingQuickCode(true);
    setQuickVerificationResult({ type: 'idle', message: '' });

    try {
      const response = await fetch('/api/events/verify-ticket', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          tokenOrCode: quickScanInput.trim(),
          eventId: event.id,
          operatorName: 'Organizer Host Terminal',
          markCheckIn: true,
        }),
      });

      const data = await response.json();

      if (data.valid && data.success) {
        setQuickVerificationResult({
          type: 'success',
          message: data.message || `Authentic Credential: ${data.ticket.attendeeName} (${data.ticket.tierName})`,
          ticket: data.ticket,
          timestamp: new Date().toLocaleTimeString(),
        });
        if (onCheckInAttendee && data.ticket?.id) {
          onCheckInAttendee(data.ticket.id);
        }
      } else if (data.error === 'DUPLICATE_ENTRY') {
        setQuickVerificationResult({
          type: 'warning',
          message: data.message || 'Duplicate Pass: Already checked in earlier!',
          ticket: data.ticket,
          timestamp: new Date().toLocaleTimeString(),
        });
      } else {
        setQuickVerificationResult({
          type: 'error',
          message: data.message || 'Counterfeit or Unregistered Ticket! Not found in database vault.',
          timestamp: new Date().toLocaleTimeString(),
        });
      }
    } catch (err) {
      setQuickVerificationResult({
        type: 'error',
        message: 'Database verification vault unreachable.',
        timestamp: new Date().toLocaleTimeString(),
      });
    } finally {
      setIsVerifyingQuickCode(false);
      setQuickScanInput('');
    }
  };

  return (
    <div className="space-y-6">
      {/* ── TOP HERO HEADER & EVENT SELECTOR ── */}
      <div className="p-6 sm:p-7 rounded-3xl bg-gradient-to-br from-[#0c0f1b] via-[#090b14] to-[#08090f] border border-cyan-500/30 shadow-2xl space-y-6">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-5 border-b border-white/10 pb-6">
          <div className="space-y-2">
            <div className="flex items-center gap-2.5 flex-wrap">
              <span className="text-[10px] font-mono font-bold uppercase tracking-widest px-2.5 py-0.5 rounded-full bg-cyan-500/15 border border-cyan-500/40 text-cyan-300">
                SUMMIT HOST COMMAND CENTER
              </span>

              {/* Status pill */}
              <span
                className={`text-[10px] font-mono font-bold uppercase tracking-wider px-2.5 py-0.5 rounded-full border ${
                  event.status === 'live'
                    ? 'bg-emerald-500/20 border-emerald-500/40 text-emerald-400 animate-pulse'
                    : event.status === 'upcoming'
                    ? 'bg-blue-500/15 border-blue-500/30 text-blue-300'
                    : event.status === 'cancelled'
                    ? 'bg-red-500/15 border-red-500/30 text-red-400'
                    : 'bg-neutral-800 border-neutral-700 text-neutral-400'
                }`}
              >
                {event.status === 'live' ? '● Chamber Live' : event.status}
              </span>

              {/* Gate Admittance Status */}
              <span
                className={`text-[10px] font-mono font-semibold px-2.5 py-0.5 rounded-full border flex items-center gap-1.5 ${
                  isEventDoorsOpen
                    ? 'bg-emerald-500/15 border-emerald-500/30 text-emerald-300'
                    : 'bg-amber-500/15 border-amber-500/30 text-amber-300'
                }`}
              >
                {isEventDoorsOpen ? <Unlock className="w-3 h-3" /> : <Lock className="w-3 h-3" />}
                <span>{isEventDoorsOpen ? 'Gate Doors Open' : 'Doors Standby'}</span>
              </span>
            </div>

            <div className="flex items-center gap-3">
              <h1 className="text-2xl sm:text-3xl font-black text-white tracking-tight">{event.title}</h1>
              {allEvents.length > 1 && onSelectEvent && (
                <div className="relative inline-block">
                  <select
                    value={event.id}
                    onChange={(e) => {
                      const selected = allEvents.find((ev) => ev.id === e.target.value);
                      if (selected) onSelectEvent(selected);
                    }}
                    className="bg-[#111422] border border-cyan-500/30 text-cyan-300 text-xs rounded-xl px-2.5 py-1 font-mono focus:outline-none"
                  >
                    {allEvents.map((ev) => (
                      <option key={ev.id} value={ev.id}>
                        Switch: {ev.title.substring(0, 24)}...
                      </option>
                    ))}
                  </select>
                </div>
              )}
            </div>

            <div className="flex items-center gap-4 text-xs font-mono text-neutral-400 flex-wrap">
              <span className="flex items-center gap-1.5 text-neutral-300">
                <Calendar className="w-3.5 h-3.5 text-cyan-400" />
                {new Date(event.date).toLocaleDateString(undefined, {
                  weekday: 'short',
                  month: 'short',
                  day: 'numeric',
                  year: 'numeric',
                })}
              </span>
              <span className="flex items-center gap-1.5 text-neutral-300">
                <Clock className="w-3.5 h-3.5 text-cyan-400" />
                {event.time || '09:00 AM IST'}
              </span>
              <span className="flex items-center gap-1.5 text-neutral-300">
                <MapPin className="w-3.5 h-3.5 text-cyan-400" />
                {event.location || event.city || 'Conference Chamber'}
              </span>
            </div>
          </div>

          {/* Action Launchers Rail */}
          <div className="flex items-center gap-2.5 flex-wrap">
            {/* Launch Gate Scanner Modal */}
            <button
              type="button"
              onClick={() => setIsScannerOpen(true)}
              className="px-4 py-2.5 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-400 hover:to-teal-500 text-neutral-950 font-bold text-xs flex items-center gap-2 shadow-lg shadow-emerald-500/20 transition cursor-pointer"
            >
              <QrCode className="w-4 h-4" />
              <span>Launch Ticket Scanner</span>
            </button>

            {/* Launch Fee Simulator Modal */}
            <button
              type="button"
              onClick={() => setIsSimulatorOpen(true)}
              className="px-3.5 py-2.5 rounded-xl bg-white/5 hover:bg-white/10 text-cyan-300 border border-cyan-500/30 text-xs font-semibold flex items-center gap-2 transition cursor-pointer"
            >
              <Percent className="w-3.5 h-3.5 text-cyan-400" />
              <span>Revenue Simulator</span>
            </button>

            {/* Registration Plans & Cashfree Modal */}
            <button
              type="button"
              onClick={() => setIsPlansModalOpen(true)}
              className="px-3.5 py-2.5 rounded-xl bg-white/5 hover:bg-white/10 text-amber-300 border border-amber-500/30 text-xs font-semibold flex items-center gap-2 transition cursor-pointer"
            >
              <CreditCard className="w-3.5 h-3.5 text-amber-400" />
              <span>Plans &amp; Payment Links</span>
            </button>

            {/* Cashfree Secure ID KYC & Bank Settlement Modal */}
            <button
              type="button"
              onClick={() => setIsKycModalOpen(true)}
              className="px-3.5 py-2.5 rounded-xl bg-purple-500/10 hover:bg-purple-500/20 text-purple-300 border border-purple-500/30 text-xs font-semibold flex items-center gap-2 transition cursor-pointer"
            >
              <ShieldCheck className="w-3.5 h-3.5 text-purple-400" />
              <span>Host Payout KYC</span>
            </button>

            {/* Staff Recruitment & Posts */}
            <button
              type="button"
              onClick={() => setActiveTab('recruitment')}
              className="px-3.5 py-2.5 rounded-xl bg-white hover:bg-neutral-200 text-black text-xs font-bold flex items-center gap-2 transition cursor-pointer shadow-sm"
            >
              <Briefcase className="w-3.5 h-3.5 text-black" />
              <span>Recruit Staff</span>
            </button>

            {/* Attendee Support Desk */}
            <Link
              href={`/events/${event.id}?tab=support`}
              className="px-3.5 py-2.5 rounded-xl bg-cyan-500/10 hover:bg-cyan-500/20 text-cyan-300 border border-cyan-500/30 text-xs font-semibold flex items-center gap-2 transition cursor-pointer"
              title="Open Attendee Inquiries Desk"
            >
              <LifeBuoy className="w-3.5 h-3.5 text-cyan-400" />
              <span>Attendee Inquiries</span>
            </Link>

            {/* Public Page Link */}
            <Link
              href={`/events/${event.id}`}
              className="p-2.5 rounded-xl bg-white/5 hover:bg-white/10 text-neutral-300 hover:text-white border border-white/10 transition"
              title="View Public Event Page"
            >
              <ExternalLink className="w-4 h-4" />
            </Link>

            {/* Dais Chamber Link */}
            <Link
              href={
                event.category === 'MUN' || event.title.toLowerCase().includes('mun')
                  ? `/committee?room=${event.id}`
                  : `/pulse?tab=events`
              }
              className="p-2.5 rounded-xl bg-cyan-500/10 hover:bg-cyan-500/20 text-cyan-400 border border-cyan-500/30 transition"
              title="Enter Dais Chamber"
            >
              <Radio className="w-4 h-4" />
            </Link>
          </div>
        </div>

        {/* ── 4 EXECUTIVE METRIC CARDS ── */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3.5">
          {/* 1. People Joining / Roster Volume */}
          <div className="p-4 rounded-2xl bg-[#101322] border border-white/5 space-y-2">
            <div className="flex items-center justify-between text-neutral-400 text-xs font-mono uppercase">
              <span>People Joining</span>
              <Users className="w-4 h-4 text-cyan-400" />
            </div>
            <div className="text-2xl sm:text-3xl font-black text-white font-mono">
              {totalCount}{' '}
              <span className="text-xs text-neutral-500 font-normal">/ {event.capacity || 100}</span>
            </div>
            <div className="w-full bg-white/5 h-1.5 rounded-full overflow-hidden">
              <div
                className="bg-cyan-400 h-full rounded-full transition-all"
                style={{ width: `${Math.min(100, Math.round((totalCount / (event.capacity || 100)) * 100))}%` }}
              />
            </div>
            <div className="text-[11px] text-neutral-400">
              {studentCount} Students &bull; {generalCount} Normal
            </div>
          </div>

          {/* 2. Gate Admittance / Arrivals */}
          <div className="p-4 rounded-2xl bg-[#101322] border border-white/5 space-y-2">
            <div className="flex items-center justify-between text-neutral-400 text-xs font-mono uppercase">
              <span>Gate Admittance</span>
              <CheckCircle2 className="w-4 h-4 text-emerald-400" />
            </div>
            <div className="text-2xl sm:text-3xl font-black text-emerald-400 font-mono">
              {checkedInCount}{' '}
              <span className="text-xs text-emerald-500/80 font-normal">({checkInRate}%)</span>
            </div>
            <div className="w-full bg-white/5 h-1.5 rounded-full overflow-hidden">
              <div
                className="bg-emerald-400 h-full rounded-full transition-all"
                style={{ width: `${checkInRate}%` }}
              />
            </div>
            <div className="text-[11px] text-emerald-300/80 flex items-center gap-1 font-mono">
              <span>✓ Cryptographically Admitted</span>
            </div>
          </div>

          {/* 3. Gross Revenue Volume */}
          <div className="p-4 rounded-2xl bg-[#101322] border border-white/5 space-y-2">
            <div className="flex items-center justify-between text-neutral-400 text-xs font-mono uppercase">
              <span>Gross Ticket Volume</span>
              <IndianRupee className="w-4 h-4 text-purple-400" />
            </div>
            <div className="text-2xl sm:text-3xl font-black text-purple-300 font-mono">
              ₹{grossVolume.toLocaleString('en-IN')}
            </div>
            <div className="text-[11px] text-neutral-400">
              Net Host Payout: <span className="text-emerald-400 font-bold">₹{estimatedNetPayout.toLocaleString('en-IN')}</span>
            </div>
            <div className="text-[10px] text-neutral-500 font-mono">
              Cashfree PG + 3.5% take rate applied
            </div>
          </div>

          {/* 4. Civic Escrow & Door Intelligence */}
          <div className="p-4 rounded-2xl bg-[#101322] border border-white/5 space-y-2">
            <div className="flex items-center justify-between text-neutral-400 text-xs font-mono uppercase">
              <span>10% Civic Escrow</span>
              <ShieldCheck className="w-4 h-4 text-amber-400" />
            </div>
            <div className="text-2xl sm:text-3xl font-black text-amber-300 font-mono">
              ₹{civicEscrowReserve.toLocaleString('en-IN')}
            </div>
            <div className="text-[11px] text-neutral-300 font-mono flex items-center justify-between">
              <span>Door Countdown:</span>
              <span className="text-cyan-400 font-bold">{doorCountdownFormatted}</span>
            </div>
            <div className="text-[10px] text-neutral-500 font-mono">
              Zero-loss delegate protection guarantee
            </div>
          </div>
        </div>
      </div>

      {/* ── 4 NAVIGATION TABS ── */}
      <div className="flex items-center gap-2 border-b border-white/10 pb-2 overflow-x-auto">
        <button
          type="button"
          onClick={() => setActiveTab('roster')}
          className={`px-4 py-2 rounded-xl text-xs font-bold font-mono transition flex items-center gap-2 ${
            activeTab === 'roster'
              ? 'bg-cyan-500 text-neutral-950 shadow-lg shadow-cyan-500/20'
              : 'text-neutral-400 hover:text-white bg-white/5'
          }`}
        >
          <Users className="w-3.5 h-3.5" />
          <span>People Joining ({totalCount})</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveTab('sheets')}
          className={`px-4 py-2 rounded-xl text-xs font-bold font-mono transition flex items-center gap-2 ${
            activeTab === 'sheets'
              ? 'bg-emerald-500 text-neutral-950 shadow-lg shadow-emerald-500/20'
              : 'text-neutral-400 hover:text-white bg-white/5'
          }`}
        >
          <FileSpreadsheet className="w-3.5 h-3.5" />
          <span>Google Sheets Connection</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveTab('simulator')}
          className={`px-4 py-2 rounded-xl text-xs font-bold font-mono transition flex items-center gap-2 ${
            activeTab === 'simulator'
              ? 'bg-purple-500 text-neutral-950 shadow-lg shadow-purple-500/20'
              : 'text-neutral-400 hover:text-white bg-white/5'
          }`}
        >
          <Percent className="w-3.5 h-3.5" />
          <span>Settlement &amp; Fee Simulator</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveTab('scanner')}
          className={`px-4 py-2 rounded-xl text-xs font-bold font-mono transition flex items-center gap-2 ${
            activeTab === 'scanner'
              ? 'bg-amber-500 text-neutral-950 shadow-lg shadow-amber-500/20'
              : 'text-neutral-400 hover:text-white bg-white/5'
          }`}
        >
          <QrCode className="w-3.5 h-3.5" />
          <span>Anti-Fake Gate Scanner</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveTab('recruitment')}
          className={`px-4 py-2 rounded-xl text-xs font-bold font-mono transition flex items-center gap-2 ${
            activeTab === 'recruitment'
              ? 'bg-white text-neutral-950 shadow-lg shadow-white/20'
              : 'text-neutral-400 hover:text-white bg-white/5'
          }`}
        >
          <Briefcase className="w-3.5 h-3.5" />
          <span>Staff Recruitment &amp; Posts</span>
        </button>
      </div>

      {/* ── TAB 1: PEOPLE JOINING (ATTENDEE & DELEGATE LEDGER) ── */}
      {activeTab === 'roster' && (
        <div className="space-y-4">
          {/* Controls Bar: Search, Filters, Export */}
          <div className="flex flex-col sm:flex-row gap-3 items-center justify-between">
            <div className="relative w-full sm:w-80">
              <Search className="w-4 h-4 text-neutral-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                placeholder="Search attendee by name, handle, email..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full bg-[#101322] border border-white/10 rounded-xl pl-9 pr-3 py-2 text-xs text-white focus:outline-none focus:border-cyan-500/50"
              />
            </div>

            <div className="flex items-center gap-2 w-full sm:w-auto justify-between sm:justify-end flex-wrap">
              <div className="flex items-center bg-[#101322] border border-white/10 rounded-xl p-1 gap-1 text-xs">
                <button
                  type="button"
                  onClick={() => setStatusFilter('all')}
                  className={`px-2.5 py-1 rounded-lg font-medium transition ${
                    statusFilter === 'all' ? 'bg-cyan-500 text-neutral-950 font-bold' : 'text-neutral-400 hover:text-white'
                  }`}
                >
                  All ({totalCount})
                </button>
                <button
                  type="button"
                  onClick={() => setStatusFilter('checked_in')}
                  className={`px-2.5 py-1 rounded-lg font-medium transition ${
                    statusFilter === 'checked_in' ? 'bg-emerald-500 text-neutral-950 font-bold' : 'text-neutral-400 hover:text-white'
                  }`}
                >
                  Admitted ({checkedInCount})
                </button>
                <button
                  type="button"
                  onClick={() => setStatusFilter('student')}
                  className={`px-2.5 py-1 rounded-lg font-medium transition ${
                    statusFilter === 'student' ? 'bg-cyan-500 text-neutral-950 font-bold' : 'text-neutral-400 hover:text-white'
                  }`}
                >
                  Students ({studentCount})
                </button>
                <button
                  type="button"
                  onClick={() => setStatusFilter('general')}
                  className={`px-2.5 py-1 rounded-lg font-medium transition ${
                    statusFilter === 'general' ? 'bg-purple-500 text-white font-bold' : 'text-neutral-400 hover:text-white'
                  }`}
                >
                  General ({generalCount})
                </button>
              </div>

              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={handleExportCsv}
                  className="px-3.5 py-2 rounded-xl bg-white/5 hover:bg-white/10 text-neutral-300 hover:text-white border border-white/10 text-xs font-semibold flex items-center gap-1.5 transition cursor-pointer"
                  title="Export Delegate Ledger as CSV"
                >
                  <Download className="w-3.5 h-3.5 text-cyan-400" />
                  <span>Export CSV</span>
                </button>

                <button
                  type="button"
                  onClick={handleSyncToGoogleSheets}
                  disabled={isSyncingSheets}
                  className="px-3.5 py-2 rounded-xl bg-emerald-500/15 hover:bg-emerald-500/25 border border-emerald-500/40 text-emerald-300 text-xs font-semibold flex items-center gap-1.5 transition cursor-pointer"
                  title="Push Roster to Google Sheet"
                >
                  <FileSpreadsheet className="w-3.5 h-3.5" />
                  <span>{isSyncingSheets ? 'Syncing...' : 'Push to Sheets'}</span>
                </button>
              </div>
            </div>
          </div>

          {/* Attendee Roster Table */}
          <div className="rounded-3xl border border-white/10 overflow-hidden bg-[#0a0d18] shadow-xl">
            <div className="p-4 border-b border-white/5 bg-white/[0.02] flex items-center justify-between text-xs font-mono text-neutral-400">
              <span className="flex items-center gap-2">
                <Users className="w-4 h-4 text-cyan-400" />
                <span>Showing {filteredAttendees.length} Registered Delegates</span>
              </span>
              <span className="text-emerald-400 font-semibold">
                HMAC-SHA256 Cryptographic Verification Active
              </span>
            </div>

            <div className="divide-y divide-white/5 max-h-[520px] overflow-y-auto custom-scrollbar">
              {filteredAttendees.length === 0 ? (
                <div className="p-12 text-center space-y-3">
                  <Users className="w-10 h-10 text-neutral-600 mx-auto" />
                  <h4 className="text-base font-bold text-white">No delegates found</h4>
                  <p className="text-xs text-neutral-400 max-w-sm mx-auto">
                    {searchQuery
                      ? 'No registrations match your search query.'
                      : 'Share your event link to start receiving delegate registrations.'}
                  </p>
                </div>
              ) : (
                filteredAttendees.map((attendee) => {
                  const isCheckedIn = attendee.status === 'checked_in';
                  const isStudent = attendee.isStudent || attendee.ticketType?.toLowerCase().includes('stud');

                  return (
                    <div
                      key={attendee.userId}
                      className="p-4 sm:p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4 hover:bg-white/[0.02] transition"
                    >
                      <div className="flex items-center gap-3.5 min-w-0">
                        <div
                          className={`w-11 h-11 rounded-2xl flex items-center justify-center font-mono font-bold text-sm flex-shrink-0 border ${
                            isCheckedIn
                              ? 'bg-emerald-500/20 border-emerald-500/40 text-emerald-300'
                              : 'bg-white/5 border-white/10 text-neutral-300'
                          }`}
                        >
                          {attendee.name.charAt(0).toUpperCase()}
                        </div>

                        <div className="min-w-0 space-y-1">
                          <div className="flex items-center gap-2 flex-wrap">
                            <span className="text-sm font-bold text-white truncate">{attendee.name}</span>
                            <span className="text-xs font-mono text-neutral-400">@{attendee.username}</span>

                            {/* Student vs Normal badge */}
                            {isStudent ? (
                              <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-cyan-500/10 border border-cyan-500/30 text-cyan-300 flex items-center gap-1">
                                <GraduationCap className="w-3 h-3" />
                                Student (0% GST)
                              </span>
                            ) : (
                              <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-purple-500/10 border border-purple-500/30 text-purple-300">
                                General (6% GST)
                              </span>
                            )}

                            {/* Cryptographic Security Seal */}
                            <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 flex items-center gap-1">
                              <ShieldCheck className="w-3 h-3" />
                              Authentic Seal
                            </span>
                          </div>

                          <div className="flex items-center gap-3 text-xs font-mono text-neutral-500 flex-wrap">
                            {attendee.email && <span>{attendee.email}</span>}
                            {attendee.ticketId && <span>Ref: {attendee.ticketId}</span>}
                            <span>RSVP: {new Date(attendee.rsvpAt).toLocaleDateString()}</span>
                            {attendee.checkedInAt && (
                              <span className="text-emerald-400 font-semibold flex items-center gap-1">
                                <Clock className="w-3 h-3" />
                                Admitted at {new Date(attendee.checkedInAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                              </span>
                            )}
                          </div>
                        </div>
                      </div>

                      {/* Right Action: Admitted or Manual Check-in */}
                      <div className="flex items-center gap-2.5 flex-shrink-0 self-end sm:self-center">
                        {isCheckedIn ? (
                          <span className="px-3.5 py-1.5 rounded-xl bg-emerald-500/15 border border-emerald-500/30 text-emerald-300 text-xs font-mono font-semibold flex items-center gap-1.5">
                            <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                            <span>Admitted</span>
                          </span>
                        ) : (
                          <button
                            type="button"
                            onClick={() => onCheckInAttendee && onCheckInAttendee(attendee.userId)}
                            className="px-4 py-1.5 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-neutral-950 text-xs font-bold flex items-center gap-1.5 shadow-sm transition cursor-pointer"
                          >
                            <CheckCircle2 className="w-3.5 h-3.5" />
                            <span>Check In</span>
                          </button>
                        )}
                      </div>
                    </div>
                  );
                })
              )}
            </div>
          </div>
        </div>
      )}

      {/* ── TAB 2: GOOGLE SHEETS UNIVERSAL OPERATIONS ── */}
      {activeTab === 'sheets' && (
        <ZenSheetsWorkspace
          eventId={event.id}
          eventTitle={event.title}
        />
      )}

      {/* ── TAB 3: REVENUE & SETTLEMENT FEE SIMULATOR ── */}
      {activeTab === 'simulator' && (
        <div className="p-6 sm:p-8 rounded-3xl bg-[#0a0d18] border border-purple-500/30 shadow-2xl space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-white/10 pb-5">
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <span className="p-1.5 rounded-lg bg-purple-500/10 border border-purple-500/30 text-purple-400">
                  <Percent className="w-5 h-5" />
                </span>
                <h3 className="text-lg font-bold text-white">
                  Event Settlement &amp; Platform Fee Simulator
                </h3>
              </div>
              <p className="text-xs text-neutral-400">
                Detailed financial modeling with dual student (0% GST) vs general delegate (6% GST) revenue splits.
              </p>
            </div>

            <button
              type="button"
              onClick={() => setIsSimulatorOpen(true)}
              className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-purple-500 to-indigo-600 hover:from-purple-400 hover:to-indigo-500 text-white font-bold text-xs flex items-center gap-2 shadow-lg shadow-purple-500/20 transition cursor-pointer"
            >
              <Sliders className="w-4 h-4" />
              <span>Launch Full Interactive Simulator</span>
            </button>
          </div>

          {/* Dual Demographics Breakdown Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Student Tier Card */}
            <div className="p-5 rounded-2xl bg-cyan-950/20 border border-cyan-500/30 space-y-3 font-mono">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2 text-cyan-300 font-bold text-sm">
                  <GraduationCap className="w-4 h-4" />
                  <span>Student Delegations</span>
                </div>
                <span className="text-[10px] px-2 py-0.5 rounded bg-cyan-500/20 text-cyan-300 font-bold">
                  0% GST EXEMPT
                </span>
              </div>
              <div className="grid grid-cols-2 gap-2 text-xs pt-1">
                <div>
                  <div className="text-neutral-400 text-[10px]">Headcount</div>
                  <div className="text-xl font-black text-white">{studentCount} delegates</div>
                </div>
                <div>
                  <div className="text-neutral-400 text-[10px]">Delegate Fee</div>
                  <div className="text-xl font-black text-cyan-300">₹{studentTicketPrice.toLocaleString('en-IN')}</div>
                </div>
              </div>
              <div className="text-[11px] text-neutral-400 border-t border-white/5 pt-2">
                Subtotal Volume: ₹{(studentCount * studentTicketPrice).toLocaleString('en-IN')} (Zero GST under National Youth Exemption)
              </div>
            </div>

            {/* General Delegate Tier Card */}
            <div className="p-5 rounded-2xl bg-purple-950/20 border border-purple-500/30 space-y-3 font-mono">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2 text-purple-300 font-bold text-sm">
                  <Building className="w-4 h-4" />
                  <span>General Attendees</span>
                </div>
                <span className="text-[10px] px-2 py-0.5 rounded bg-purple-500/20 text-purple-300 font-bold">
                  6% GST APPLIED
                </span>
              </div>
              <div className="grid grid-cols-2 gap-2 text-xs pt-1">
                <div>
                  <div className="text-neutral-400 text-[10px]">Headcount</div>
                  <div className="text-xl font-black text-white">{generalCount} attendees</div>
                </div>
                <div>
                  <div className="text-neutral-400 text-[10px]">Pass Fee</div>
                  <div className="text-xl font-black text-purple-300">₹{generalTicketPrice.toLocaleString('en-IN')}</div>
                </div>
              </div>
              <div className="text-[11px] text-neutral-400 border-t border-white/5 pt-2">
                Subtotal Volume: ₹{(generalCount * generalTicketPrice).toLocaleString('en-IN')} + 6% GST
              </div>
            </div>
          </div>

          {/* Financial Settlement Breakdown Ledger */}
          <div className="p-5 rounded-2xl bg-[#0e111d] border border-white/10 space-y-3 font-mono text-xs">
            <h4 className="font-bold text-white uppercase text-[11px] tracking-wider text-neutral-300">
              Host Settlement Waterfall Ledger
            </h4>
            <div className="space-y-2 divide-y divide-white/5 pt-1">
              <div className="flex items-center justify-between pt-1">
                <span className="text-neutral-400">Total Gross Ticket Sales</span>
                <span className="text-white font-bold">₹{grossVolume.toLocaleString('en-IN')}</span>
              </div>
              <div className="flex items-center justify-between pt-2">
                <span className="text-neutral-400">Cashfree PG Processing Fee (1.9% + ₹3)</span>
                <span className="text-red-400">-₹{Math.round(grossVolume * 0.019 + totalCount * 3).toLocaleString('en-IN')}</span>
              </div>
              <div className="flex items-center justify-between pt-2">
                <span className="text-neutral-400">ZENVITRA Platform Take-Rate (3.5%)</span>
                <span className="text-red-400">-₹{Math.round(grossVolume * 0.035).toLocaleString('en-IN')}</span>
              </div>
              <div className="flex items-center justify-between pt-2">
                <span className="text-amber-300">Civic Escrow Holdback (10% Security Reserve)</span>
                <span className="text-amber-300 font-bold">-₹{civicEscrowReserve.toLocaleString('en-IN')}</span>
              </div>
              <div className="flex items-center justify-between pt-3 border-t border-cyan-500/30 text-sm">
                <span className="text-emerald-400 font-bold">Net Host Payout (T+1 Settlement)</span>
                <span className="text-emerald-400 font-black text-base">₹{estimatedNetPayout.toLocaleString('en-IN')}</span>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ── TAB 4: EVENT TICKET SCANNER & ANTI-FAKE SECURITY ── */}
      {activeTab === 'scanner' && (
        <div className="p-6 sm:p-8 rounded-3xl bg-[#0a0d18] border border-amber-500/30 shadow-2xl space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-white/10 pb-5">
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <span className="p-1.5 rounded-lg bg-amber-500/10 border border-amber-500/30 text-amber-400">
                  <QrCode className="w-5 h-5" />
                </span>
                <h3 className="text-lg font-bold text-white">
                  Gate Pass Admission &amp; Cryptographic Anti-Fake Scanner
                </h3>
              </div>
              <p className="text-xs text-neutral-400">
                Backed by real-time HMAC-SHA256 digital seals and persistent Prisma SQLite database.
              </p>
            </div>

            <button
              type="button"
              onClick={() => setIsScannerOpen(true)}
              className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-400 hover:to-teal-500 text-neutral-950 font-bold text-xs flex items-center gap-2 shadow-lg shadow-emerald-500/20 transition cursor-pointer"
            >
              <Camera className="w-4 h-4" />
              <span>Launch Live Camera Scanner</span>
            </button>
          </div>

          {/* Door Timing Intelligence Banner */}
          <div className={`p-5 rounded-2xl border transition space-y-3 font-mono ${
            isEventDoorsOpen ? 'bg-emerald-950/20 border-emerald-500/40' : 'bg-amber-950/20 border-amber-500/30'
          }`}>
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div className="flex items-center gap-3">
                <div className={`w-10 h-10 rounded-xl border flex items-center justify-center ${
                  isEventDoorsOpen
                    ? 'bg-emerald-500/20 border-emerald-500/40 text-emerald-400'
                    : 'bg-amber-500/20 border-amber-500/40 text-amber-400'
                }`}>
                  <Clock className="w-5 h-5" />
                </div>
                <div>
                  <div className="text-xs font-bold text-white flex items-center gap-2">
                    <span>Door Opening Countdown</span>
                    <span className={`text-[10px] px-2 py-0.5 rounded ${
                      isEventDoorsOpen ? 'bg-emerald-500/20 text-emerald-300' : 'bg-amber-500/20 text-amber-300'
                    }`}>
                      {isEventDoorsOpen ? 'ACTIVE' : 'LOCKED BY SCHEDULE'}
                    </span>
                  </div>
                  <div className="text-[11px] text-neutral-400">
                    Event Timing: {event.time || '09:00 AM'} &bull; System Clock: {currentTime.toLocaleTimeString()}
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <span className={`text-base font-black ${isEventDoorsOpen ? 'text-emerald-300' : 'text-amber-300'}`}>
                  {doorCountdownFormatted}
                </span>

                <button
                  type="button"
                  onClick={() => setManualGateOverride((prev) => !prev)}
                  className={`px-3 py-1.5 rounded-xl text-xs font-semibold border transition cursor-pointer ${
                    manualGateOverride
                      ? 'bg-amber-500/20 border-amber-500/40 text-amber-300'
                      : 'bg-white/5 border-white/10 text-neutral-300 hover:text-white'
                  }`}
                >
                  {manualGateOverride ? 'Override Enabled' : 'Manual Gate Override'}
                </button>
              </div>
            </div>
          </div>

          {/* Quick Manual Verification Terminal */}
          <div className="p-5 rounded-2xl bg-[#0e111d] border border-white/10 space-y-4 font-mono">
            <div>
              <h4 className="text-xs font-bold text-white uppercase tracking-wider">
                Direct Ticket Token / QR Code Verification
              </h4>
              <p className="text-[11px] text-neutral-400">
                Type or paste a ticket token (e.g. <span className="text-cyan-300">ZEN-PASS-88492</span> or <span className="text-cyan-300">ZVN-TKT-...</span>) to test server verification.
              </p>
            </div>

            <form onSubmit={handleQuickVerify} className="flex gap-2">
              <input
                type="text"
                placeholder="Paste QR token string or ticket number..."
                value={quickScanInput}
                onChange={(e) => setQuickScanInput(e.target.value)}
                className="flex-1 bg-[#101322] border border-white/10 rounded-xl px-4 py-2.5 text-xs text-white focus:outline-none focus:border-cyan-500/50"
              />
              <button
                type="submit"
                disabled={isVerifyingQuickCode}
                className="px-5 py-2.5 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-neutral-950 font-bold text-xs transition cursor-pointer disabled:opacity-50"
              >
                {isVerifyingQuickCode ? 'Verifying...' : 'Verify Pass'}
              </button>
            </form>

            {/* Quick Verification Result */}
            {quickVerificationResult.type !== 'idle' && (
              <motion.div
                initial={{ opacity: 0, y: -5 }}
                animate={{ opacity: 1, y: 0 }}
                className={`p-4 rounded-xl border text-xs space-y-1 ${
                  quickVerificationResult.type === 'success'
                    ? 'bg-emerald-500/15 border-emerald-500/40 text-emerald-200'
                    : quickVerificationResult.type === 'warning'
                    ? 'bg-amber-500/15 border-amber-500/40 text-amber-200'
                    : 'bg-red-500/15 border-red-500/40 text-red-200'
                }`}
              >
                <div className="flex items-center gap-2 font-bold">
                  {quickVerificationResult.type === 'success' && <CheckCircle2 className="w-4 h-4 text-emerald-400" />}
                  {quickVerificationResult.type === 'warning' && <AlertTriangle className="w-4 h-4 text-amber-400" />}
                  {quickVerificationResult.type === 'error' && <ShieldAlert className="w-4 h-4 text-red-400" />}
                  <span>{quickVerificationResult.message}</span>
                </div>
                {quickVerificationResult.ticket && (
                  <div className="text-[10px] text-neutral-400">
                    Delegate: {quickVerificationResult.ticket.attendeeName} &bull; Tier: {quickVerificationResult.ticket.tierName} &bull; Ref: {quickVerificationResult.ticket.ticketNumber}
                  </div>
                )}
              </motion.div>
            )}
          </div>

          {/* Cryptographic Security Details Explainer */}
          <div className="p-4 rounded-2xl bg-white/[0.02] border border-white/5 space-y-2 text-xs font-mono text-neutral-400">
            <div className="flex items-center gap-2 text-cyan-300 font-bold">
              <ShieldCheck className="w-4 h-4" />
              <span>How ZENVITRA Prevents Fake QR Tickets:</span>
            </div>
            <ul className="list-disc list-inside space-y-1 text-[11px] text-neutral-400">
              <li>Every authentic pass carries an HMAC-SHA256 signature calculated from the delegate email, event ID, and server secret salt.</li>
              <li>Fake QR generators cannot fabricate this hash; any mismatched signature is immediately rejected as Counterfeit.</li>
              <li>Every pass record must exist in the persistent Prisma database; fabricated codes return 404 Not Found.</li>
              <li>Scanned tickets are marked CHECKED_IN; duplicate presentations trigger an instant Duplicate Warning with the original check-in timestamp.</li>
            </ul>
          </div>
        </div>
      )}

      {/* ── TAB 5: STAFF RECRUITMENT & APPLICANT PIPELINE ── */}
      {activeTab === 'recruitment' && (
        <EventRecruitmentWorkspace eventId={event.id} eventTitle={event.title} />
      )}

      {/* ── MODALS INTEGRATED ── */}

      {/* Full Revenue Fee Simulator Modal */}
      <RevenueFeeSimulatorModal
        isOpen={isSimulatorOpen}
        onClose={() => setIsSimulatorOpen(false)}
      />

      {/* High-speed Optical ZenPass QR Gate Scanner Modal */}
      <ZenPassScannerModal
        isOpen={isScannerOpen}
        onClose={() => setIsScannerOpen(false)}
        eventId={event.id}
        eventTitle={event.title}
        venueName={event.location || event.city}
        eventStartTime={event.date}
        onTicketScanned={(scannedTicket) => {
          if (onCheckInAttendee && scannedTicket?.id) {
            onCheckInAttendee(scannedTicket.id);
          }
        }}
      />

      {/* Registration Plans & Cashfree Payment Links Modal */}
      {isPlansModalOpen && (
        <EventPlansPaymentLinksModal
          isOpen={isPlansModalOpen}
          onClose={() => setIsPlansModalOpen(false)}
          eventId={event.id}
          eventTitle={event.title}
          initialPlans={event.plans}
          initialPaymentLinks={event.paymentLinks}
          onSavePlans={(plans) => {
            if (onUpdateEvent) onUpdateEvent(event.id, { plans });
          }}
          onSavePaymentLink={(link) => {
            const existing = event.paymentLinks || [];
            if (onUpdateEvent) {
              onUpdateEvent(event.id, {
                paymentLinks: [link, ...existing.filter((l) => l.linkId !== link.linkId)],
              });
            }
          }}
        />
      )}

      {/* Cashfree Secure ID Organizer KYC & Bank Verification Modal */}
      {isKycModalOpen && (
        <OrganizerKycModal
          isOpen={isKycModalOpen}
          onClose={() => setIsKycModalOpen(false)}
          userId={user?.id || profile?.id || event.organizerId || 'organizer'}
          userEmail={user?.email || profile?.email || 'organizer@zenvitra.com'}
          userHandle={profile?.username || (event.organizerName ? `@${event.organizerName.toLowerCase().replace(/\s+/g, '')}` : undefined)}
        />
      )}
    </div>
  );
};
