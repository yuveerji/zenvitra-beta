'use client';

import React, { useState, useMemo } from 'react';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  BarChart3, Users, IndianRupee, ShieldCheck, QrCode, 
  Settings, KeyRound, Plus, Calendar, Clock, MapPin, 
  CheckCircle2, AlertTriangle, ArrowLeft, ExternalLink, 
  Radio, Edit3, Trash2, ShieldAlert, Sparkles, Filter, Search
} from 'lucide-react';
import { useZenEvents } from '@/context/ZenEventsPlatformContext';
import { ZenEvent, EventOrganizerRole, EventTeamMember, EventStatus } from '@/types/events';
import { EventAccessSharingModal } from './EventAccessSharingModal';
import { AttendeeRosterModal } from './AttendeeRosterModal';
import { EditEventModal } from './EditEventModal';
import { ZenPassScannerModal } from '../ZenPassScannerModal';

export const EventManagementDashboard: React.FC = () => {
  const {
    getOrganizerEvents,
    updateEvent,
    cancelEvent,
    deleteEvent,
    updateEventStatus,
    checkInAttendee,
    transferEventOwnership,
    addEventTeamMember,
    updateEventTeamRole,
    removeEventTeamMember,
    setActiveView,
    currentUserId,
    currentUserName,
    currentUserUsername,
  } = useZenEvents();

  const organizerEvents = getOrganizerEvents();

  // Search & Status filter inside dashboard
  const [dashboardFilter, setDashboardFilter] = useState<'all' | 'upcoming' | 'live' | 'past' | 'cancelled'>('all');
  const [searchQuery, setSearchQuery] = useState('');

  // Active Modals
  const [selectedEventForAccess, setSelectedEventForAccess] = useState<ZenEvent | null>(null);
  const [selectedEventForRoster, setSelectedEventForRoster] = useState<ZenEvent | null>(null);
  const [selectedEventForEdit, setSelectedEventForEdit] = useState<ZenEvent | null>(null);
  const [isScannerOpen, setIsScannerOpen] = useState(false);

  // Cancellation prompt
  const [eventToCancel, setEventToCancel] = useState<ZenEvent | null>(null);
  const [cancelReason, setCancelReason] = useState('');
  const [cancelFeedback, setCancelFeedback] = useState<string | null>(null);

  // Filtered summits
  const displayedEvents = useMemo(() => {
    return organizerEvents.filter((e) => {
      if (dashboardFilter !== 'all' && e.status !== dashboardFilter) return false;
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        return (
          e.title.toLowerCase().includes(q) ||
          (e.location && e.location.toLowerCase().includes(q)) ||
          e.category.toLowerCase().includes(q)
        );
      }
      return true;
    });
  }, [organizerEvents, dashboardFilter, searchQuery]);

  // Executive Metric Rail Calculations
  const metrics = useMemo(() => {
    let totalDelegates = 0;
    let checkedInCount = 0;
    let grossRevenue = 0;

    organizerEvents.forEach((ev) => {
      const attendees = ev.attendees || [];
      totalDelegates += attendees.length;
      checkedInCount += attendees.filter((a) => a.status === 'checked_in').length;
      grossRevenue += attendees.length * (ev.ticketPrice || 0);
    });

    const civicEscrow = Math.round(grossRevenue * 0.25);
    const netPayout = grossRevenue - civicEscrow;
    const checkInRate = totalDelegates > 0 ? Math.round((checkedInCount / totalDelegates) * 100) : 0;

    return {
      totalSummits: organizerEvents.length,
      totalDelegates,
      checkedInCount,
      checkInRate,
      grossRevenue,
      civicEscrow,
      netPayout,
    };
  }, [organizerEvents]);

  const handleConfirmCancel = () => {
    if (!eventToCancel) return;
    const res = cancelEvent(eventToCancel.id, cancelReason || 'Cancelled by summit secretariat');
    setCancelFeedback(
      `Concluded & Cancelled: ${res.refundedCount} tickets auto-refunded (Total: ₹${res.totalRefundAmount.toLocaleString('en-IN')})`
    );
    setTimeout(() => {
      setCancelFeedback(null);
      setEventToCancel(null);
      setCancelReason('');
    }, 2800);
  };

  return (
    <div className="space-y-8 pb-16">
      {/* Top Banner Navigation */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-white/10 pb-6">
        <div className="space-y-1">
          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={() => setActiveView('list')}
              className="p-2 rounded-xl bg-white/5 hover:bg-white/10 text-neutral-400 hover:text-white transition flex items-center gap-1.5 text-xs font-mono"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>Back to Directory</span>
            </button>
            <span className="text-xs font-mono text-cyan-400 bg-cyan-500/10 border border-cyan-500/30 px-2.5 py-0.5 rounded-full flex items-center gap-1">
              <Sparkles className="w-3 h-3" />
              Organizer Command Hub
            </span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-black text-white tracking-tight flex items-center gap-2">
            Summit Operations & Role Delegation
          </h1>
          <p className="text-xs sm:text-sm text-neutral-400">
            Real-time delegate accreditation, 25% civic escrow reserve ledger, gate security, and dais access handover.
          </p>
        </div>

        <div className="flex items-center gap-2.5 flex-wrap">
          <button
            type="button"
            onClick={() => setIsScannerOpen(true)}
            className="px-4 py-2 rounded-xl bg-white/5 hover:bg-white/10 text-white border border-white/15 text-xs font-semibold flex items-center gap-2 shadow-sm transition"
          >
            <QrCode className="w-4 h-4 text-cyan-400" />
            <span>Launch Gate Scanner</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveView('create')}
            className="px-4 py-2 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-neutral-950 text-xs font-bold flex items-center gap-1.5 shadow-lg shadow-cyan-500/20 transition"
          >
            <Plus className="w-4 h-4" />
            <span>Convene New Summit</span>
          </button>
        </div>
      </div>

      {/* Cancellation Notice Alert */}
      {cancelFeedback && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="p-4 rounded-2xl bg-amber-500/10 border border-amber-500/30 text-amber-200 text-xs flex items-center gap-3"
        >
          <AlertTriangle className="w-5 h-5 text-amber-400 flex-shrink-0" />
          <span>{cancelFeedback}</span>
        </motion.div>
      )}

      {/* Executive Financial & Operations Metric Rail */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {/* Total Summits */}
        <div className="p-4 rounded-2xl bg-[#0e111d] border border-white/5 space-y-2">
          <div className="flex items-center justify-between text-neutral-400 text-xs font-mono uppercase">
            <span>Hosted Summits</span>
            <Calendar className="w-4 h-4 text-cyan-400" />
          </div>
          <div className="text-2xl sm:text-3xl font-black text-white font-mono">{metrics.totalSummits}</div>
          <div className="text-[11px] text-neutral-500">Active or past convenings</div>
        </div>

        {/* Accredited Delegates */}
        <div className="p-4 rounded-2xl bg-[#0e111d] border border-white/5 space-y-2">
          <div className="flex items-center justify-between text-neutral-400 text-xs font-mono uppercase">
            <span>Delegates Registered</span>
            <Users className="w-4 h-4 text-purple-400" />
          </div>
          <div className="text-2xl sm:text-3xl font-black text-white font-mono">{metrics.totalDelegates}</div>
          <div className="text-[11px] text-emerald-400 flex items-center gap-1">
            <CheckCircle2 className="w-3 h-3" />
            {metrics.checkedInCount} checked in ({metrics.checkInRate}%)
          </div>
        </div>

        {/* Gross Revenue */}
        <div className="p-4 rounded-2xl bg-[#0e111d] border border-white/5 space-y-2">
          <div className="flex items-center justify-between text-neutral-400 text-xs font-mono uppercase">
            <span>Gross Ticket Volume</span>
            <IndianRupee className="w-4 h-4 text-emerald-400" />
          </div>
          <div className="text-2xl sm:text-3xl font-black text-emerald-400 font-mono">
            ₹{metrics.grossRevenue.toLocaleString('en-IN')}
          </div>
          <div className="text-[11px] text-neutral-400">Net payout: ₹{metrics.netPayout.toLocaleString('en-IN')}</div>
        </div>

        {/* 25% Civic Escrow Reserve */}
        <div className="p-4 rounded-2xl bg-gradient-to-br from-cyan-950/40 via-[#0e111d] to-[#0e111d] border border-cyan-500/30 space-y-2">
          <div className="flex items-center justify-between text-cyan-300 text-xs font-mono uppercase">
            <span>25% Civic Escrow</span>
            <ShieldCheck className="w-4 h-4 text-cyan-400" />
          </div>
          <div className="text-2xl sm:text-3xl font-black text-cyan-300 font-mono">
            ₹{metrics.civicEscrow.toLocaleString('en-IN')}
          </div>
          <div className="text-[11px] text-cyan-400/80">Guaranteed refund & civic reserve</div>
        </div>
      </div>

      {/* Directory Filter / Search Bar */}
      <div className="flex flex-col sm:flex-row gap-3 items-center justify-between">
        <div className="relative w-full sm:w-80">
          <Search className="w-4 h-4 text-neutral-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search your convenings..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-[#111422] border border-white/10 rounded-xl pl-9 pr-3 py-2 text-xs text-white focus:outline-none focus:border-cyan-500/50"
          />
        </div>

        <div className="flex items-center bg-[#111422] border border-white/10 rounded-xl p-1 gap-1 text-xs w-full sm:w-auto overflow-x-auto">
          {(['all', 'upcoming', 'live', 'past', 'cancelled'] as const).map((tab) => (
            <button
              key={tab}
              type="button"
              onClick={() => setDashboardFilter(tab)}
              className={`px-3 py-1.5 rounded-lg capitalize font-medium transition ${
                dashboardFilter === tab
                  ? 'bg-cyan-500 text-neutral-950 font-bold'
                  : 'text-neutral-400 hover:text-white'
              }`}
            >
              {tab}
            </button>
          ))}
        </div>
      </div>

      {/* Summits List */}
      <div className="space-y-4">
        {displayedEvents.length === 0 ? (
          <div className="p-12 rounded-3xl bg-[#0b0e17] border border-white/5 text-center space-y-3">
            <Calendar className="w-10 h-10 text-neutral-600 mx-auto" />
            <h3 className="text-base font-bold text-white">No convenings match your criteria</h3>
            <p className="text-xs text-neutral-400 max-w-sm mx-auto">
              Create a new summit or switch status filters to view your existing conference portfolio.
            </p>
            <button
              type="button"
              onClick={() => setActiveView('create')}
              className="px-4 py-2 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-neutral-950 text-xs font-bold transition inline-flex items-center gap-1.5"
            >
              <Plus className="w-4 h-4" />
              Convene Summit
            </button>
          </div>
        ) : (
          displayedEvents.map((ev) => {
            const attendees = ev.attendees || [];
            const checkedIn = attendees.filter((a) => a.status === 'checked_in').length;
            const revenue = attendees.length * (ev.ticketPrice || 0);
            const isFounder = ev.organizerId === currentUserId || ev.organizerUsername?.toLowerCase() === currentUserUsername?.toLowerCase();
            const team = ev.teamMembers || [];

            return (
              <motion.div
                key={ev.id}
                layout
                className="p-5 sm:p-6 rounded-3xl bg-[#0c0f1b] border border-white/10 hover:border-cyan-500/30 transition shadow-xl space-y-5"
              >
                {/* Header row */}
                <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 border-b border-white/5 pb-4">
                  <div className="space-y-1.5">
                    <div className="flex items-center gap-2.5 flex-wrap">
                      <span className="text-[10px] font-mono font-bold uppercase tracking-wider px-2 py-0.5 rounded-full bg-cyan-500/10 border border-cyan-500/30 text-cyan-300">
                        {ev.category}
                      </span>

                      {/* Status indicator */}
                      <span className={`text-[10px] font-mono font-bold uppercase tracking-wider px-2.5 py-0.5 rounded-full border ${
                        ev.status === 'live'
                          ? 'bg-emerald-500/20 border-emerald-500/40 text-emerald-400 animate-pulse'
                          : ev.status === 'upcoming'
                          ? 'bg-blue-500/15 border-blue-500/30 text-blue-300'
                          : ev.status === 'cancelled'
                          ? 'bg-red-500/15 border-red-500/30 text-red-400'
                          : 'bg-neutral-800 border-neutral-700 text-neutral-400'
                      }`}>
                        {ev.status === 'live' ? '● Live Chamber' : ev.status}
                      </span>

                      {isFounder ? (
                        <span className="text-[10px] font-mono text-amber-400 bg-amber-500/10 border border-amber-500/30 px-2 py-0.5 rounded-full flex items-center gap-1">
                          <ShieldCheck className="w-3 h-3" />
                          Master Founder
                        </span>
                      ) : (
                        <span className="text-[10px] font-mono text-cyan-400 bg-cyan-500/10 border border-cyan-500/30 px-2 py-0.5 rounded-full">
                          Delegated Secretariat
                        </span>
                      )}
                    </div>

                    <h3 className="text-lg sm:text-xl font-bold text-white tracking-tight">{ev.title}</h3>

                    <div className="flex items-center gap-4 text-xs font-mono text-neutral-400 flex-wrap">
                      <span className="flex items-center gap-1.5">
                        <Calendar className="w-3.5 h-3.5 text-cyan-400" />
                        {new Date(ev.date).toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' })}
                      </span>
                      <span className="flex items-center gap-1.5">
                        <Clock className="w-3.5 h-3.5 text-cyan-400" />
                        {ev.time || 'Full Day'}
                      </span>
                      <span className="flex items-center gap-1.5">
                        <MapPin className="w-3.5 h-3.5 text-cyan-400" />
                        {ev.location || ev.city || 'Virtual Chamber'}
                      </span>
                    </div>
                  </div>

                  {/* Quick Status Setter Dropdown */}
                  <div className="flex items-center gap-2">
                    <select
                      value={ev.status}
                      onChange={(e) => updateEventStatus(ev.id, e.target.value as EventStatus)}
                      className="bg-[#111422] border border-white/10 rounded-xl px-3 py-1.5 text-xs text-neutral-200 font-mono focus:outline-none focus:border-cyan-500/50"
                    >
                      <option value="upcoming">Status: Upcoming</option>
                      <option value="live">Status: Live In Session</option>
                      <option value="past">Status: Concluded</option>
                      <option value="cancelled">Status: Cancelled</option>
                    </select>

                    {/* Virtual Chamber / Dais Launch */}
                    <Link
                      href={ev.category === 'MUN' || ev.title.toLowerCase().includes('mun') ? `/committee?room=${ev.id}` : `/pulse?tab=events`}
                      className="p-2 rounded-xl bg-cyan-500/10 hover:bg-cyan-500/20 text-cyan-400 border border-cyan-500/30 text-xs font-semibold flex items-center gap-1 transition"
                      title="Launch Dais Chamber"
                    >
                      <Radio className="w-4 h-4" />
                      <span className="hidden sm:inline">Launch Dais</span>
                    </Link>
                  </div>
                </div>

                {/* Sub-Metrics & Roster Stats */}
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs font-mono">
                  <div className="p-3 rounded-2xl bg-white/[0.02] border border-white/5">
                    <div className="text-neutral-400 text-[10px] uppercase">Roster Volume</div>
                    <div className="text-base font-bold text-white mt-0.5">
                      {attendees.length} / {ev.capacity}
                    </div>
                  </div>

                  <div className="p-3 rounded-2xl bg-white/[0.02] border border-white/5">
                    <div className="text-neutral-400 text-[10px] uppercase">Arrivals Checked In</div>
                    <div className="text-base font-bold text-emerald-400 mt-0.5">
                      {checkedIn} ({attendees.length > 0 ? Math.round((checkedIn / attendees.length) * 100) : 0}%)
                    </div>
                  </div>

                  <div className="p-3 rounded-2xl bg-white/[0.02] border border-white/5">
                    <div className="text-neutral-400 text-[10px] uppercase">Delegate Fee</div>
                    <div className="text-base font-bold text-white mt-0.5">
                      {ev.ticketPrice ? `₹${ev.ticketPrice.toLocaleString('en-IN')}` : 'Gratis'}
                    </div>
                  </div>

                  <div className="p-3 rounded-2xl bg-white/[0.02] border border-white/5">
                    <div className="text-neutral-400 text-[10px] uppercase">Delegated Team</div>
                    <div className="text-base font-bold text-cyan-300 mt-0.5">
                      {team.length + 1} Authorized
                    </div>
                  </div>
                </div>

                {/* Action Buttons Hub */}
                <div className="flex items-center justify-between gap-2 pt-1 border-t border-white/5 flex-wrap">
                  <div className="flex items-center gap-2 flex-wrap">
                    {/* Delegate Roster & Check-In */}
                    <button
                      type="button"
                      onClick={() => setSelectedEventForRoster(ev)}
                      className="px-3.5 py-1.5 rounded-xl bg-cyan-500/10 hover:bg-cyan-500/20 text-cyan-300 border border-cyan-500/30 text-xs font-semibold flex items-center gap-1.5 transition"
                    >
                      <Users className="w-3.5 h-3.5" />
                      <span>Roster & Check-In ({attendees.length})</span>
                    </button>

                    {/* Share Access & Handover Roles */}
                    <button
                      type="button"
                      onClick={() => setSelectedEventForAccess(ev)}
                      className="px-3.5 py-1.5 rounded-xl bg-amber-500/10 hover:bg-amber-500/20 text-amber-300 border border-amber-500/30 text-xs font-semibold flex items-center gap-1.5 transition"
                    >
                      <KeyRound className="w-3.5 h-3.5" />
                      <span>Share Access & Roles ({team.length})</span>
                    </button>

                    {/* Edit Specifications */}
                    <button
                      type="button"
                      onClick={() => setSelectedEventForEdit(ev)}
                      className="px-3 py-1.5 rounded-xl bg-white/5 hover:bg-white/10 text-neutral-300 text-xs font-medium flex items-center gap-1.5 transition"
                    >
                      <Edit3 className="w-3.5 h-3.5" />
                      <span>Edit</span>
                    </button>
                  </div>

                  <div className="flex items-center gap-2">
                    {/* Cancel Summit */}
                    {ev.status !== 'cancelled' && (
                      <button
                        type="button"
                        onClick={() => setEventToCancel(ev)}
                        className="px-3 py-1.5 rounded-xl bg-red-500/10 hover:bg-red-500/20 text-red-400 border border-red-500/30 text-xs font-semibold flex items-center gap-1.5 transition"
                      >
                        <ShieldAlert className="w-3.5 h-3.5" />
                        <span>Cancel & Auto-Refund</span>
                      </button>
                    )}

                    {/* Delete Summit permanently */}
                    <button
                      type="button"
                      onClick={() => {
                        if (confirm(`Permanently remove "${ev.title}"? Any ticket holders will be credited.`)) {
                          deleteEvent(ev.id);
                        }
                      }}
                      className="p-1.5 rounded-lg text-neutral-500 hover:text-red-400 hover:bg-red-500/10 transition"
                      title="Delete Convening"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </motion.div>
            );
          })
        )}
      </div>

      {/* Role Delegation Modal */}
      {selectedEventForAccess && (
        <EventAccessSharingModal
          isOpen={!!selectedEventForAccess}
          onClose={() => setSelectedEventForAccess(null)}
          event={selectedEventForAccess}
          onTransferOwnership={(newOwner) => transferEventOwnership(selectedEventForAccess.id, newOwner)}
          onAddTeamMember={(member) => addEventTeamMember(selectedEventForAccess.id, member)}
          onUpdateTeamRole={(userId, role) => updateEventTeamRole(selectedEventForAccess.id, userId, role)}
          onRemoveTeamMember={(userId) => removeEventTeamMember(selectedEventForAccess.id, userId)}
          currentUserId={currentUserId}
        />
      )}

      {/* Attendee Roster Modal */}
      {selectedEventForRoster && (
        <AttendeeRosterModal
          isOpen={!!selectedEventForRoster}
          onClose={() => setSelectedEventForRoster(null)}
          event={selectedEventForRoster}
          onCheckInAttendee={(attendeeId) => checkInAttendee(selectedEventForRoster.id, attendeeId)}
          onOpenScannerModal={() => setIsScannerOpen(true)}
        />
      )}

      {/* Edit Event Modal */}
      {selectedEventForEdit && (
        <EditEventModal
          isOpen={!!selectedEventForEdit}
          onClose={() => setSelectedEventForEdit(null)}
          event={selectedEventForEdit}
          onSave={(id, updates) => updateEvent(id, updates)}
        />
      )}

      {/* High-speed ZenPass QR Gate Scanner */}
      <ZenPassScannerModal
        isOpen={isScannerOpen}
        onClose={() => setIsScannerOpen(false)}
      />

      {/* Cancel Summit Confirmation Dialog */}
      {eventToCancel && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="w-full max-w-md rounded-3xl bg-[#090a0f] border border-red-500/30 shadow-2xl p-6 sm:p-7 space-y-5"
          >
            <div className="flex items-center gap-3 text-red-400">
              <div className="w-10 h-10 rounded-2xl bg-red-500/10 border border-red-500/30 flex items-center justify-center">
                <AlertTriangle className="w-5 h-5" />
              </div>
              <div>
                <h4 className="text-base font-bold text-white">Cancel Summit & Issue Refunds</h4>
                <p className="text-xs text-neutral-400">Civic Escrow Protocol</p>
              </div>
            </div>

            <p className="text-xs text-neutral-300 leading-relaxed">
              Cancelling <span className="text-white font-bold">{eventToCancel.title}</span> will immediately notify all{' '}
              <span className="text-cyan-300 font-bold">{eventToCancel.attendees.length} accredited delegates</span> and
              refund 100% of collected fees from the civic escrow reserve.
            </p>

            <div>
              <label className="text-xs font-mono text-neutral-400 block mb-1">Reason for cancellation</label>
              <input
                type="text"
                placeholder="e.g. Dais scheduling conflict / emergency venue closure"
                value={cancelReason}
                onChange={(e) => setCancelReason(e.target.value)}
                className="w-full bg-[#111422] border border-white/10 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-red-500/50"
              />
            </div>

            <div className="flex items-center justify-end gap-2 pt-2">
              <button
                type="button"
                onClick={() => setEventToCancel(null)}
                className="px-4 py-2 rounded-xl bg-white/5 hover:bg-white/10 text-neutral-300 text-xs font-medium transition"
              >
                Abort
              </button>
              <button
                type="button"
                onClick={handleConfirmCancel}
                className="px-4 py-2 rounded-xl bg-red-600 hover:bg-red-500 text-white text-xs font-bold shadow-lg shadow-red-600/20 transition"
              >
                Execute Cancellation & Refunds
              </button>
            </div>
          </motion.div>
        </div>
      )}
    </div>
  );
};
