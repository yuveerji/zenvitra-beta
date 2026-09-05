'use client';

import React, { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  X, Users, Search, Download, CheckCircle2, 
  Clock, ShieldAlert, FileSpreadsheet, QrCode, ArrowUpDown 
} from 'lucide-react';
import { ZenEvent, EventAttendee } from '@/types/events';

interface AttendeeRosterModalProps {
  isOpen: boolean;
  onClose: () => void;
  event: ZenEvent;
  onCheckInAttendee: (attendeeUserId: string) => void;
  onOpenScannerModal: () => void;
}

export const AttendeeRosterModal: React.FC<AttendeeRosterModalProps> = ({
  isOpen,
  onClose,
  event,
  onCheckInAttendee,
  onOpenScannerModal,
}) => {
  const [filterStatus, setFilterStatus] = useState<'all' | 'checked_in' | 'going' | 'interested'>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [copiedNotification, setCopiedNotification] = useState(false);

  const attendees = useMemo(() => event.attendees || [], [event.attendees]);

  const filteredAttendees = useMemo(() => {
    return attendees.filter((att) => {
      if (filterStatus === 'checked_in' && att.status !== 'checked_in') return false;
      if (filterStatus === 'going' && att.status !== 'going') return false;
      if (filterStatus === 'interested' && att.status !== 'interested') return false;

      if (searchQuery.trim()) {
        const query = searchQuery.toLowerCase();
        const matchesName = att.name.toLowerCase().includes(query);
        const matchesHandle = att.username.toLowerCase().includes(query);
        const matchesTicket = att.ticketId?.toLowerCase().includes(query) || false;
        return matchesName || matchesHandle || matchesTicket;
      }
      return true;
    });
  }, [attendees, filterStatus, searchQuery]);

  const checkedInCount = useMemo(() => attendees.filter((a) => a.status === 'checked_in').length, [attendees]);
  const totalCount = attendees.length;
  const attendanceRate = totalCount > 0 ? Math.round((checkedInCount / totalCount) * 100) : 0;

  if (!isOpen) return null;

  const exportRosterCsv = () => {
    const headers = ['User ID', 'Name', 'Username', 'Status', 'Ticket ID', 'RSVP Timestamp', 'Checked-In Timestamp'];
    const rows = attendees.map((a) => [
      a.userId,
      `"${a.name.replace(/"/g, '""')}"`,
      `"@${a.username}"`,
      a.status,
      a.ticketId || 'N/A',
      a.rsvpAt || '',
      a.checkedInAt || ''
    ]);

    const csvContent = 'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows.map(e => e.join(','))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `${event.title.replace(/[^a-z0-9]/gi, '_').toLowerCase()}_roster.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    setCopiedNotification(true);
    setTimeout(() => setCopiedNotification(false), 2000);
  };

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md overflow-y-auto">
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 10 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 10 }}
          transition={{ duration: 0.2 }}
          className="relative w-full max-w-3xl rounded-3xl bg-[#090a0f] border border-cyan-500/20 shadow-2xl p-6 sm:p-8 space-y-6 my-8"
        >
          {/* Header */}
          <div className="flex items-start justify-between border-b border-white/10 pb-5">
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <span className="p-1.5 rounded-lg bg-cyan-500/10 border border-cyan-500/30 text-cyan-400">
                  <Users className="w-5 h-5" />
                </span>
                <h3 className="text-xl font-bold text-white tracking-tight">Delegate Roster & Gate Check-In</h3>
              </div>
              <p className="text-xs text-neutral-400">
                Official accreditation registry for <span className="text-cyan-300 font-semibold">{event.title}</span>
              </p>
            </div>
            <button
              onClick={onClose}
              className="p-2 rounded-xl bg-white/5 hover:bg-white/10 text-neutral-400 hover:text-white transition"
              aria-label="Close"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Quick Metrics Rail */}
          <div className="grid grid-cols-3 gap-3">
            <div className="p-3.5 rounded-2xl bg-white/[0.02] border border-white/5 space-y-1">
              <div className="text-[11px] font-mono text-neutral-400 uppercase">Accredited</div>
              <div className="text-xl font-black text-white font-mono">{totalCount}</div>
            </div>
            <div className="p-3.5 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 space-y-1">
              <div className="text-[11px] font-mono text-emerald-400 uppercase">Checked In</div>
              <div className="text-xl font-black text-emerald-400 font-mono">{checkedInCount}</div>
            </div>
            <div className="p-3.5 rounded-2xl bg-cyan-500/10 border border-cyan-500/20 space-y-1">
              <div className="text-[11px] font-mono text-cyan-400 uppercase">Arrival Rate</div>
              <div className="text-xl font-black text-cyan-400 font-mono">{attendanceRate}%</div>
            </div>
          </div>

          {/* Controls Bar: Search, Filters, Export & Scanner Launch */}
          <div className="flex flex-col sm:flex-row gap-3 items-center justify-between">
            <div className="relative w-full sm:w-64">
              <Search className="w-4 h-4 text-neutral-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                placeholder="Search delegate or ticket #..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full bg-[#111422] border border-white/10 rounded-xl pl-9 pr-3 py-2 text-xs text-white focus:outline-none focus:border-cyan-500/50"
              />
            </div>

            <div className="flex items-center gap-2 w-full sm:w-auto justify-between sm:justify-end flex-wrap">
              <div className="flex items-center bg-[#111422] border border-white/10 rounded-xl p-1 gap-1 text-xs">
                <button
                  type="button"
                  onClick={() => setFilterStatus('all')}
                  className={`px-2.5 py-1 rounded-lg font-medium transition ${
                    filterStatus === 'all' ? 'bg-cyan-500 text-neutral-950 font-bold' : 'text-neutral-400 hover:text-white'
                  }`}
                >
                  All
                </button>
                <button
                  type="button"
                  onClick={() => setFilterStatus('checked_in')}
                  className={`px-2.5 py-1 rounded-lg font-medium transition ${
                    filterStatus === 'checked_in' ? 'bg-emerald-500 text-neutral-950 font-bold' : 'text-neutral-400 hover:text-white'
                  }`}
                >
                  Present ({checkedInCount})
                </button>
                <button
                  type="button"
                  onClick={() => setFilterStatus('going')}
                  className={`px-2.5 py-1 rounded-lg font-medium transition ${
                    filterStatus === 'going' ? 'bg-cyan-500 text-neutral-950 font-bold' : 'text-neutral-400 hover:text-white'
                  }`}
                >
                  Registered
                </button>
              </div>

              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={exportRosterCsv}
                  className="px-3 py-2 rounded-xl bg-white/5 hover:bg-white/10 text-neutral-300 hover:text-white border border-white/10 text-xs font-semibold flex items-center gap-1.5 transition"
                  title="Export Roster CSV"
                >
                  <FileSpreadsheet className="w-3.5 h-3.5 text-cyan-400" />
                  <span className="hidden sm:inline">CSV</span>
                </button>

                <button
                  type="button"
                  onClick={() => {
                    onClose();
                    onOpenScannerModal();
                  }}
                  className="px-3 py-2 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-neutral-950 text-xs font-bold flex items-center gap-1.5 shadow-lg shadow-cyan-500/20 transition"
                >
                  <QrCode className="w-3.5 h-3.5" />
                  Scanner
                </button>
              </div>
            </div>
          </div>

          {copiedNotification && (
            <div className="p-2.5 rounded-xl bg-emerald-500/15 border border-emerald-500/30 text-emerald-300 text-xs flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-400" />
              <span>Delegate roster exported successfully as CSV.</span>
            </div>
          )}

          {/* Roster Table */}
          <div className="rounded-2xl border border-white/10 overflow-hidden bg-white/[0.01]">
            <div className="max-h-72 overflow-y-auto divide-y divide-white/5">
              {filteredAttendees.length === 0 ? (
                <div className="p-10 text-center space-y-2">
                  <Users className="w-8 h-8 text-neutral-600 mx-auto" />
                  <p className="text-xs text-neutral-400">No attendees match your search or filter criteria.</p>
                </div>
              ) : (
                filteredAttendees.map((attendee) => {
                  const isCheckedIn = attendee.status === 'checked_in';
                  return (
                    <div
                      key={attendee.userId}
                      className="p-3.5 flex items-center justify-between gap-3 hover:bg-white/[0.02] transition"
                    >
                      <div className="flex items-center gap-3 min-w-0">
                        <div className={`w-9 h-9 rounded-xl flex items-center justify-center font-mono font-bold text-xs flex-shrink-0 ${
                          isCheckedIn
                            ? 'bg-emerald-500/15 border border-emerald-500/30 text-emerald-400'
                            : 'bg-white/5 border border-white/10 text-neutral-300'
                        }`}>
                          {attendee.name.charAt(0).toUpperCase()}
                        </div>
                        <div className="min-w-0">
                          <div className="flex items-center gap-2">
                            <span className="text-xs font-bold text-white truncate">{attendee.name}</span>
                            <span className="text-[11px] font-mono text-neutral-400 truncate">@{attendee.username}</span>
                          </div>
                          <div className="flex items-center gap-2 text-[10px] font-mono text-neutral-500">
                            {attendee.ticketId && <span>Ref: {attendee.ticketId}</span>}
                            {attendee.checkedInAt ? (
                              <span className="text-emerald-400/90 flex items-center gap-1">
                                <Clock className="w-3 h-3" />
                                Checked in at {new Date(attendee.checkedInAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                              </span>
                            ) : (
                              <span>RSVP: {new Date(attendee.rsvpAt).toLocaleDateString()}</span>
                            )}
                          </div>
                        </div>
                      </div>

                      <div className="flex items-center gap-2 flex-shrink-0">
                        {isCheckedIn ? (
                          <span className="px-3 py-1 rounded-lg bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs font-mono font-semibold flex items-center gap-1">
                            <CheckCircle2 className="w-3.5 h-3.5" />
                            Admitted
                          </span>
                        ) : (
                          <button
                            type="button"
                            onClick={() => onCheckInAttendee(attendee.userId)}
                            className="px-3 py-1 rounded-lg bg-cyan-500/15 hover:bg-cyan-500/25 border border-cyan-500/30 text-cyan-300 hover:text-cyan-200 text-xs font-semibold flex items-center gap-1.5 transition"
                          >
                            <CheckCircle2 className="w-3.5 h-3.5" />
                            Check In
                          </button>
                        )}
                      </div>
                    </div>
                  );
                })
              )}
            </div>
          </div>

          {/* Footer */}
          <div className="border-t border-white/10 pt-4 flex items-center justify-between text-xs text-neutral-500 font-mono">
            <span>Synchronized with ZenPass Ledger</span>
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-xl bg-white/5 hover:bg-white/10 text-white font-medium transition"
            >
              Close Roster
            </button>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
