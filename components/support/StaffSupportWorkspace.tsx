'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { 
  LifeBuoy, 
  Search, 
  Filter, 
  RefreshCw, 
  Clock, 
  CheckCircle2, 
  AlertTriangle, 
  ShieldAlert, 
  Send, 
  Lock, 
  UserPlus, 
  ArrowUpRight, 
  FileText, 
  MessageSquare, 
  ChevronRight, 
  ExternalLink, 
  Sparkles,
  RotateCcw,
  ShieldCheck,
  CreditCard,
  Building,
  GraduationCap,
  Users,
  Check,
  X,
  AlertOctagon
} from 'lucide-react';
import { useAuth } from '@/context/AuthContext';
import { 
  SupportTicketItem, 
  SupportMessageItem, 
  SupportInternalNoteItem, 
  CATEGORY_LABELS, 
  STATUS_CONFIG, 
  PRIORITY_CONFIG, 
  TicketCategory, 
  TicketStatus, 
  TicketPriority 
} from '@/types/support';

export function StaffSupportWorkspace() {
  const { user, profile } = useAuth();
  const staffId = profile?.id || user?.id || 'staff_operator';
  const staffName = profile?.display_name || user?.name || 'Operations Officer';

  const [tickets, setTickets] = useState<SupportTicketItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedTicket, setSelectedTicket] = useState<SupportTicketItem | null>(null);
  const [ticketDetailsLoading, setTicketDetailsLoading] = useState(false);

  // Filters
  const [statusFilter, setStatusFilter] = useState<string>('ALL');
  const [categoryFilter, setCategoryFilter] = useState<string>('ALL');
  const [priorityFilter, setPriorityFilter] = useState<string>('ALL');
  const [searchQuery, setSearchQuery] = useState('');
  const [viewQueue, setViewQueue] = useState<'all' | 'unassigned' | 'mine' | 'escalated'>('all');

  // Active Tab in Detail Workspace
  const [activeTab, setActiveTab] = useState<'conversation' | 'internal_notes' | 'audit_timeline'>('conversation');

  // Input states
  const [replyContent, setReplyContent] = useState('');
  const [sendingReply, setSendingReply] = useState(false);
  const [internalNoteText, setInternalNoteText] = useState('');
  const [savingNote, setSavingNote] = useState(false);

  // Resolution modal state
  const [isResolveModalOpen, setIsResolveModalOpen] = useState(false);
  const [resolutionSummary, setResolutionSummary] = useState('');
  const [resolutionCode, setResolutionCode] = useState('RESOLVED_CONFIRMED');

  // Escalation modal state
  const [isEscalateModalOpen, setIsEscalateModalOpen] = useState(false);
  const [escalateTo, setEscalateTo] = useState<'SENIOR_ADMIN' | 'FOUNDER'>('FOUNDER');
  const [escalateReason, setEscalateReason] = useState('');

  const fetchTickets = async () => {
    try {
      setLoading(true);
      const params = new URLSearchParams();
      params.append('isStaff', 'true');
      if (statusFilter !== 'ALL') params.append('status', statusFilter);
      if (categoryFilter !== 'ALL') params.append('category', categoryFilter);
      if (priorityFilter !== 'ALL') params.append('priority', priorityFilter);

      const res = await fetch(`/api/support/tickets?${params.toString()}`);
      const data = await res.json();
      if (data.success && Array.isArray(data.tickets)) {
        setTickets(data.tickets);
        // If selected ticket is present, refresh it
        if (selectedTicket) {
          const found = data.tickets.find((t: SupportTicketItem) => t.id === selectedTicket.id);
          if (found) loadTicketDetail(found.id);
        }
      }
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  const loadTicketDetail = async (id: string) => {
    try {
      setTicketDetailsLoading(true);
      const res = await fetch(`/api/support/tickets/${encodeURIComponent(id)}?isStaff=true`);
      const data = await res.json();
      if (data.success && data.ticket) {
        setSelectedTicket(data.ticket);
      }
    } catch (e) {
      console.error(e);
    } finally {
      setTicketDetailsLoading(false);
    }
  };

  useEffect(() => {
    fetchTickets();
  }, [statusFilter, categoryFilter, priorityFilter]);

  // Send Public Staff Reply
  const handleSendStaffReply = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!replyContent.trim() || !selectedTicket) return;

    try {
      setSendingReply(true);
      const res = await fetch(`/api/support/tickets/${selectedTicket.id}/messages`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          senderId: staffId,
          senderName: staffName,
          senderRole: 'STAFF',
          content: replyContent.trim(),
          isOfficial: true
        })
      });
      const data = await res.json();
      if (data.success) {
        setReplyContent('');
        await loadTicketDetail(selectedTicket.id);
        await fetchTickets();
      }
    } catch (e) {
      console.error(e);
    } finally {
      setSendingReply(false);
    }
  };

  // Add Confidential Internal Note
  const handleAddInternalNote = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!internalNoteText.trim() || !selectedTicket) return;

    try {
      setSavingNote(true);
      const res = await fetch(`/api/support/tickets/${selectedTicket.id}/notes`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          authorId: staffId,
          authorName: staffName,
          authorRole: 'STAFF',
          note: internalNoteText.trim()
        })
      });
      const data = await res.json();
      if (data.success) {
        setInternalNoteText('');
        await loadTicketDetail(selectedTicket.id);
      }
    } catch (e) {
      console.error(e);
    } finally {
      setSavingNote(false);
    }
  };

  // Assign to Self
  const handleAssignToSelf = async () => {
    if (!selectedTicket) return;
    try {
      const res = await fetch(`/api/support/tickets/${selectedTicket.id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          assignedToId: staffId,
          assignedToName: staffName,
          status: selectedTicket.status === 'NEW' ? 'OPEN' : selectedTicket.status,
          actorId: staffId,
          actorName: staffName,
          actorRole: 'STAFF'
        })
      });
      const data = await res.json();
      if (data.success) {
        await loadTicketDetail(selectedTicket.id);
        await fetchTickets();
      }
    } catch (e) {
      console.error(e);
    }
  };

  // Resolve Ticket
  const handleResolveTicket = async () => {
    if (!selectedTicket || !resolutionSummary.trim()) return;
    try {
      const res = await fetch(`/api/support/tickets/${selectedTicket.id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          status: 'RESOLVED',
          resolutionSummary: resolutionSummary.trim(),
          resolutionCode,
          actorId: staffId,
          actorName: staffName,
          actorRole: 'STAFF'
        })
      });
      const data = await res.json();
      if (data.success) {
        setIsResolveModalOpen(false);
        setResolutionSummary('');
        await loadTicketDetail(selectedTicket.id);
        await fetchTickets();
      }
    } catch (e) {
      console.error(e);
    }
  };

  // Escalate to Senior Admin / Founder
  const handleEscalateTicket = async () => {
    if (!selectedTicket || !escalateReason.trim()) return;
    try {
      const res = await fetch(`/api/support/tickets/${selectedTicket.id}/escalate`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          escalatedTo: escalateTo,
          escalationReason: escalateReason.trim(),
          actorId: staffId,
          actorName: staffName,
          actorRole: 'STAFF'
        })
      });
      const data = await res.json();
      if (data.success) {
        setIsEscalateModalOpen(false);
        setEscalateReason('');
        await loadTicketDetail(selectedTicket.id);
        await fetchTickets();
      }
    } catch (e) {
      console.error(e);
    }
  };

  const filteredTickets = tickets.filter(t => {
    if (viewQueue === 'unassigned' && t.assignedToId) return false;
    if (viewQueue === 'mine' && t.assignedToId !== staffId) return false;
    if (viewQueue === 'escalated' && t.status !== 'ESCALATED') return false;

    if (!searchQuery.trim()) return true;
    const q = searchQuery.toLowerCase();
    return (
      t.ticketNumber.toLowerCase().includes(q) ||
      t.subject.toLowerCase().includes(q) ||
      t.userEmail.toLowerCase().includes(q) ||
      t.userName.toLowerCase().includes(q)
    );
  });

  return (
    <div className="space-y-6 font-mono text-xs text-white">
      
      {/* Top Mission Control Bar */}
      <div className="p-5 rounded-3xl bg-gradient-to-r from-[#080d1a] via-[#05070f] to-[#0d1326] border border-cyan-500/30 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-2xl bg-cyan-500/20 border border-cyan-500/40 flex items-center justify-center text-cyan-400">
            <LifeBuoy className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="font-bold text-sm text-white">SUPPORT OPERATIONS COMMAND</span>
              <span className="text-[10px] px-2 py-0.5 rounded bg-cyan-500/20 text-cyan-300 font-bold border border-cyan-500/30">
                STAFF DESK
              </span>
            </div>
            <p className="text-[11px] text-neutral-400 font-sans mt-0.5">
              Live case triage, confidential internal notes, SLA countdowns, and Founder escalation rail.
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <Link
            href="/support"
            target="_blank"
            className="px-3 py-1.5 rounded-xl bg-white/5 hover:bg-white/10 text-neutral-300 hover:text-white border border-white/10 transition flex items-center gap-1.5"
          >
            <span>Public Desk</span>
            <ExternalLink className="w-3.5 h-3.5" />
          </Link>
          <Link
            href="/zen-vault-root/support"
            className="px-3 py-1.5 rounded-xl bg-amber-500/10 hover:bg-amber-500/20 text-amber-300 border border-amber-500/30 transition flex items-center gap-1.5"
          >
            <ShieldAlert className="w-3.5 h-3.5" />
            <span>Founder Oversight &rarr;</span>
          </Link>
        </div>
      </div>

      {/* 4 Interactive Queues */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
        <button
          type="button"
          onClick={() => setViewQueue('all')}
          className={`p-4 rounded-2xl border text-left transition cursor-pointer ${
            viewQueue === 'all'
              ? 'bg-cyan-500/15 border-cyan-500/50 text-white'
              : 'bg-black/40 border-white/10 text-neutral-400 hover:text-white'
          }`}
        >
          <div className="flex items-center justify-between text-[10px] uppercase">
            <span>All Live Cases</span>
            <LifeBuoy className="w-3.5 h-3.5 text-cyan-400" />
          </div>
          <div className="text-2xl font-bold text-white mt-2">{tickets.length}</div>
          <span className="text-[9px] text-neutral-500 block mt-1">Full triage pool</span>
        </button>

        <button
          type="button"
          onClick={() => setViewQueue('unassigned')}
          className={`p-4 rounded-2xl border text-left transition cursor-pointer ${
            viewQueue === 'unassigned'
              ? 'bg-blue-500/20 border-blue-500 text-white'
              : 'bg-black/40 border-white/10 text-neutral-400 hover:text-white'
          }`}
        >
          <div className="flex items-center justify-between text-[10px] uppercase">
            <span>Unassigned Pool</span>
            <UserPlus className="w-3.5 h-3.5 text-blue-400" />
          </div>
          <div className="text-2xl font-bold text-blue-300 mt-2">
            {tickets.filter(t => !t.assignedToId).length}
          </div>
          <span className="text-[9px] text-blue-400/80 block mt-1">Awaiting owner</span>
        </button>

        <button
          type="button"
          onClick={() => setViewQueue('mine')}
          className={`p-4 rounded-2xl border text-left transition cursor-pointer ${
            viewQueue === 'mine'
              ? 'bg-purple-500/20 border-purple-500 text-white'
              : 'bg-black/40 border-white/10 text-neutral-400 hover:text-white'
          }`}
        >
          <div className="flex items-center justify-between text-[10px] uppercase">
            <span>My Active Cases</span>
            <CheckCircle2 className="w-3.5 h-3.5 text-purple-400" />
          </div>
          <div className="text-2xl font-bold text-purple-300 mt-2">
            {tickets.filter(t => t.assignedToId === staffId).length}
          </div>
          <span className="text-[9px] text-purple-400/80 block mt-1">Assigned to you</span>
        </button>

        <button
          type="button"
          onClick={() => setViewQueue('escalated')}
          className={`p-4 rounded-2xl border text-left transition cursor-pointer ${
            viewQueue === 'escalated'
              ? 'bg-rose-500/20 border-rose-500 text-white'
              : 'bg-black/40 border-white/10 text-neutral-400 hover:text-white'
          }`}
        >
          <div className="flex items-center justify-between text-[10px] uppercase">
            <span>Escalations</span>
            <ShieldAlert className="w-3.5 h-3.5 text-rose-400" />
          </div>
          <div className="text-2xl font-bold text-rose-300 mt-2">
            {tickets.filter(t => t.status === 'ESCALATED').length}
          </div>
          <span className="text-[9px] text-rose-400/80 block mt-1">Senior / Founder review</span>
        </button>
      </div>

      {/* Main Two-Column Workspace */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
        
        {/* Left Column: Tickets Queue List (5 cols) */}
        <div className="lg:col-span-5 space-y-3">
          
          {/* Search & Filter Header */}
          <div className="p-3.5 rounded-2xl bg-black/60 border border-white/10 space-y-2">
            <div className="relative">
              <Search className="w-3.5 h-3.5 text-neutral-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search ticket #, subject, user..."
                className="w-full pl-8 pr-3 py-1.5 rounded-xl bg-white/5 border border-white/10 text-xs text-white placeholder-neutral-500 focus:outline-none focus:border-cyan-500 font-mono"
              />
            </div>

            <div className="grid grid-cols-3 gap-1.5 text-[10px]">
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="px-2 py-1.5 rounded-lg bg-neutral-900 border border-white/10 text-neutral-300 font-mono focus:outline-none"
              >
                <option value="ALL">All Status</option>
                <option value="NEW">New</option>
                <option value="OPEN">Open</option>
                <option value="IN_PROGRESS">In Progress</option>
                <option value="WAITING_USER">Waiting User</option>
                <option value="ESCALATED">Escalated</option>
                <option value="RESOLVED">Resolved</option>
                <option value="CLOSED">Closed</option>
              </select>

              <select
                value={categoryFilter}
                onChange={(e) => setCategoryFilter(e.target.value)}
                className="px-2 py-1.5 rounded-lg bg-neutral-900 border border-white/10 text-neutral-300 font-mono focus:outline-none"
              >
                <option value="ALL">All Categories</option>
                <option value="ACCOUNT">Account</option>
                <option value="EVENTS">Events</option>
                <option value="MUN">MUN</option>
                <option value="PAYMENTS">Payments</option>
                <option value="TECHNICAL">Technical</option>
                <option value="SAFETY">Safety</option>
              </select>

              <select
                value={priorityFilter}
                onChange={(e) => setPriorityFilter(e.target.value)}
                className="px-2 py-1.5 rounded-lg bg-neutral-900 border border-white/10 text-neutral-300 font-mono focus:outline-none"
              >
                <option value="ALL">All Priorities</option>
                <option value="P1_CRITICAL">P1 Critical</option>
                <option value="P2_HIGH">P2 High</option>
                <option value="P3_NORMAL">P3 Normal</option>
                <option value="P4_LOW">P4 Low</option>
              </select>
            </div>
          </div>

          {/* List Stream */}
          <div className="space-y-2 max-h-[750px] overflow-y-auto pr-1 custom-scrollbar">
            {loading ? (
              <div className="p-8 text-center text-neutral-500 font-mono flex items-center justify-center gap-2">
                <RefreshCw className="w-4 h-4 animate-spin text-cyan-400" />
                <span>Synchronizing queue...</span>
              </div>
            ) : filteredTickets.length === 0 ? (
              <div className="p-8 text-center rounded-2xl bg-black/40 border border-white/5 text-neutral-500 text-xs">
                No tickets match the current queue criteria.
              </div>
            ) : (
              filteredTickets.map((t) => {
                const isSelected = selectedTicket?.id === t.id;
                const statMeta = STATUS_CONFIG[t.status as TicketStatus] || { label: t.status, badge: 'bg-neutral-800 text-neutral-400' };
                const prioMeta = PRIORITY_CONFIG[t.priority as TicketPriority] || { label: t.priority, badge: 'bg-white/10 text-neutral-300' };

                return (
                  <div
                    key={t.id}
                    onClick={() => loadTicketDetail(t.id)}
                    className={`p-4 rounded-2xl border transition cursor-pointer space-y-2 ${
                      isSelected
                        ? 'bg-cyan-950/40 border-cyan-500/60 shadow-lg shadow-cyan-950/50'
                        : 'bg-black/50 hover:bg-white/[0.03] border-white/10'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-1.5">
                        <span className="font-bold text-cyan-300">{t.ticketNumber}</span>
                        <span className={`text-[9px] px-1.5 py-0.2 rounded border font-bold ${statMeta.badge}`}>
                          {statMeta.label}
                        </span>
                      </div>
                      <span className={`text-[9px] px-1.5 py-0.2 rounded border ${prioMeta.badge}`}>
                        {prioMeta.label.split('—')[0]}
                      </span>
                    </div>

                    <div className="text-xs font-bold text-white line-clamp-1 font-sans">
                      {t.subject}
                    </div>

                    <div className="flex items-center justify-between text-[10px] text-neutral-400 font-mono pt-1">
                      <span>{t.userName || t.userEmail}</span>
                      <span>{t.assignedToName ? `👤 ${t.assignedToName}` : '⚠️ Unassigned'}</span>
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </div>

        {/* Right Column: Case Investigation & Action Desk (7 cols) */}
        <div className="lg:col-span-7">
          {selectedTicket ? (
            <div className="p-6 rounded-3xl bg-black/60 border border-white/10 space-y-5">
              
              {/* Case Header */}
              <div className="border-b border-white/10 pb-4 space-y-3">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-bold text-cyan-300 font-mono">
                      {selectedTicket.ticketNumber}
                    </span>
                    <span className={`text-[10px] font-mono px-2 py-0.5 rounded border font-bold ${STATUS_CONFIG[selectedTicket.status as TicketStatus]?.badge}`}>
                      {STATUS_CONFIG[selectedTicket.status as TicketStatus]?.label}
                    </span>
                    <span className={`text-[10px] font-mono px-2 py-0.5 rounded border ${PRIORITY_CONFIG[selectedTicket.priority as TicketPriority]?.badge}`}>
                      {PRIORITY_CONFIG[selectedTicket.priority as TicketPriority]?.label.split('—')[0]}
                    </span>
                  </div>

                  {/* Top Action Pills */}
                  <div className="flex items-center gap-2">
                    {!selectedTicket.assignedToId || selectedTicket.assignedToId !== staffId ? (
                      <button
                        type="button"
                        onClick={handleAssignToSelf}
                        className="px-3 py-1.5 rounded-xl bg-cyan-500/20 hover:bg-cyan-500/30 text-cyan-300 border border-cyan-500/40 text-[11px] font-bold transition cursor-pointer flex items-center gap-1"
                      >
                        <UserPlus className="w-3.5 h-3.5" />
                        <span>Assign to Me</span>
                      </button>
                    ) : (
                      <span className="text-[10px] text-emerald-400 font-bold px-2 py-1 rounded bg-emerald-500/10 border border-emerald-500/30">
                        Assigned to You
                      </span>
                    )}

                    {selectedTicket.status !== 'RESOLVED' && selectedTicket.status !== 'CLOSED' && (
                      <button
                        type="button"
                        onClick={() => setIsResolveModalOpen(true)}
                        className="px-3 py-1.5 rounded-xl bg-emerald-500/20 hover:bg-emerald-500/30 text-emerald-300 border border-emerald-500/40 text-[11px] font-bold transition cursor-pointer flex items-center gap-1"
                      >
                        <Check className="w-3.5 h-3.5" />
                        <span>Resolve</span>
                      </button>
                    )}

                    <button
                      type="button"
                      onClick={() => setIsEscalateModalOpen(true)}
                      className="px-3 py-1.5 rounded-xl bg-amber-500/20 hover:bg-amber-500/30 text-amber-300 border border-amber-500/40 text-[11px] font-bold transition cursor-pointer flex items-center gap-1"
                    >
                      <ShieldAlert className="w-3.5 h-3.5" />
                      <span>Escalate</span>
                    </button>
                  </div>
                </div>

                <h2 className="text-base font-bold text-white font-sans">
                  {selectedTicket.subject}
                </h2>

                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-[10px] font-mono text-neutral-400 pt-1">
                  <div>Requester: <strong className="text-white block">{selectedTicket.userName} ({selectedTicket.userEmail})</strong></div>
                  <div>Team: <strong className="text-cyan-300 block">{selectedTicket.assignedTeam || 'Triage'}</strong></div>
                  <div>Event: <strong className="text-white block">{selectedTicket.relatedEventId || 'N/A'}</strong></div>
                  <div>Txn: <strong className="text-white block">{selectedTicket.relatedTxnId || 'N/A'}</strong></div>
                </div>
              </div>

              {/* Tab Selector: User Conversation vs Private Internal Notes vs Audit Timeline */}
              <div className="flex items-center gap-2 border-b border-white/10 pb-2 text-xs">
                <button
                  type="button"
                  onClick={() => setActiveTab('conversation')}
                  className={`px-3 py-1.5 rounded-xl transition cursor-pointer flex items-center gap-1.5 ${
                    activeTab === 'conversation'
                      ? 'bg-cyan-500/20 text-cyan-300 font-bold border border-cyan-500/40'
                      : 'text-neutral-400 hover:text-white'
                  }`}
                >
                  <MessageSquare className="w-3.5 h-3.5" />
                  <span>Public Conversation ({selectedTicket.messages?.length || 0})</span>
                </button>

                <button
                  type="button"
                  onClick={() => setActiveTab('internal_notes')}
                  className={`px-3 py-1.5 rounded-xl transition cursor-pointer flex items-center gap-1.5 ${
                    activeTab === 'internal_notes'
                      ? 'bg-amber-500/20 text-amber-300 font-bold border border-amber-500/40'
                      : 'text-neutral-400 hover:text-white'
                  }`}
                >
                  <Lock className="w-3.5 h-3.5 text-amber-400" />
                  <span>Staff Internal Notes ({selectedTicket.internalNotes?.length || 0})</span>
                  <span className="text-[9px] px-1 rounded bg-amber-500/30 text-amber-200">CONFIDENTIAL</span>
                </button>

                <button
                  type="button"
                  onClick={() => setActiveTab('audit_timeline')}
                  className={`px-3 py-1.5 rounded-xl transition cursor-pointer flex items-center gap-1.5 ${
                    activeTab === 'audit_timeline'
                      ? 'bg-purple-500/20 text-purple-300 font-bold border border-purple-500/40'
                      : 'text-neutral-400 hover:text-white'
                  }`}
                >
                  <FileText className="w-3.5 h-3.5" />
                  <span>Audit Trail</span>
                </button>
              </div>

              {/* TAB 1: Public Conversation */}
              {activeTab === 'conversation' && (
                <div className="space-y-4">
                  <div className="space-y-3 max-h-[360px] overflow-y-auto pr-1 custom-scrollbar">
                    {/* Original ticket inquiry */}
                    <div className="p-4 rounded-2xl bg-white/[0.02] border border-white/5 space-y-1">
                      <div className="flex items-center justify-between text-[10px] text-neutral-400">
                        <span className="font-bold text-white font-mono">{selectedTicket.userName} (Initial Ticket Description)</span>
                        <span>{new Date(selectedTicket.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                      </div>
                      <p className="text-xs text-neutral-300 font-sans leading-relaxed whitespace-pre-wrap">
                        {selectedTicket.description}
                      </p>
                    </div>

                    {selectedTicket.messages && selectedTicket.messages.length > 0 && selectedTicket.messages.map((m) => {
                      const isStaff = m.senderRole === 'STAFF' || m.senderRole === 'ADMIN' || m.senderRole === 'FOUNDER';
                      return (
                        <div
                          key={m.id}
                          className={`p-4 rounded-2xl border space-y-1 ${
                            isStaff
                              ? 'bg-cyan-950/30 border-cyan-500/40 ml-6 text-cyan-100'
                              : 'bg-black/40 border-white/10 mr-6 text-neutral-300'
                          }`}
                        >
                          <div className="flex items-center justify-between text-[10px]">
                            <span className="font-bold font-mono">
                              {m.senderName} {isStaff && '(Official Staff Reply)'}
                            </span>
                            <span className="text-neutral-500">
                              {new Date(m.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                            </span>
                          </div>
                          <p className="text-xs font-sans whitespace-pre-wrap leading-relaxed">{m.content}</p>
                        </div>
                      );
                    })}
                  </div>

                  {/* Staff Reply Box */}
                  <form onSubmit={handleSendStaffReply} className="space-y-2 pt-2 border-t border-white/10">
                    <span className="text-[10px] text-neutral-400 uppercase font-bold block">
                      Send Public Response to {selectedTicket.userName}
                    </span>
                    <textarea
                      rows={3}
                      value={replyContent}
                      onChange={(e) => setReplyContent(e.target.value)}
                      placeholder="Type official response sent directly to the requester..."
                      className="w-full p-3 rounded-2xl bg-white/5 border border-white/10 text-xs text-white placeholder-neutral-500 focus:outline-none focus:border-cyan-500 font-sans"
                    />
                    <div className="flex justify-end">
                      <button
                        type="submit"
                        disabled={sendingReply || !replyContent.trim()}
                        className="px-4 py-2 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-neutral-950 font-bold text-xs flex items-center gap-1.5 transition cursor-pointer disabled:opacity-40"
                      >
                        <Send className="w-3.5 h-3.5" />
                        <span>{sendingReply ? 'Transmitting...' : 'Send Public Reply'}</span>
                      </button>
                    </div>
                  </form>
                </div>
              )}

              {/* TAB 2: Confidential Internal Staff Notes */}
              {activeTab === 'internal_notes' && (
                <div className="space-y-4">
                  <div className="p-3 rounded-xl bg-amber-500/10 border border-amber-500/30 text-[11px] text-amber-200 flex items-center gap-2">
                    <Lock className="w-4 h-4 text-amber-400 shrink-0" />
                    <span>These notes are strictly confidential to authorized staff. They are never rendered or visible to the user.</span>
                  </div>

                  <div className="space-y-2 max-h-[320px] overflow-y-auto pr-1 custom-scrollbar">
                    {selectedTicket.internalNotes && selectedTicket.internalNotes.length > 0 ? (
                      selectedTicket.internalNotes.map((n) => (
                        <div key={n.id} className="p-3.5 rounded-2xl bg-amber-950/20 border border-amber-500/30 space-y-1">
                          <div className="flex items-center justify-between text-[10px]">
                            <span className="text-amber-300 font-bold">{n.authorName} ({n.authorRole})</span>
                            <span className="text-neutral-500">{new Date(n.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                          </div>
                          <p className="text-xs text-neutral-200 font-sans leading-relaxed whitespace-pre-wrap">{n.note}</p>
                        </div>
                      ))
                    ) : (
                      <div className="p-6 text-center text-neutral-500 text-xs">
                        No internal investigation notes logged for this case.
                      </div>
                    )}
                  </div>

                  <form onSubmit={handleAddInternalNote} className="space-y-2 pt-2 border-t border-white/10">
                    <span className="text-[10px] text-amber-300 uppercase font-bold block">
                      Add Private Investigation / Handover Note
                    </span>
                    <textarea
                      rows={3}
                      value={internalNoteText}
                      onChange={(e) => setInternalNoteText(e.target.value)}
                      placeholder="e.g. Verified with Cashfree settlement ledger. TXN settled on 10th Oct..."
                      className="w-full p-3 rounded-2xl bg-white/5 border border-amber-500/30 text-xs text-white placeholder-neutral-500 focus:outline-none focus:border-amber-400 font-sans"
                    />
                    <div className="flex justify-end">
                      <button
                        type="submit"
                        disabled={savingNote || !internalNoteText.trim()}
                        className="px-4 py-2 rounded-xl bg-amber-500 hover:bg-amber-400 text-neutral-950 font-bold text-xs flex items-center gap-1.5 transition cursor-pointer disabled:opacity-40"
                      >
                        <Lock className="w-3.5 h-3.5" />
                        <span>{savingNote ? 'Recording...' : 'Save Private Note'}</span>
                      </button>
                    </div>
                  </form>
                </div>
              )}

              {/* TAB 3: Audit Trail */}
              {activeTab === 'audit_timeline' && (
                <div className="space-y-2 max-h-[420px] overflow-y-auto pr-1 custom-scrollbar text-[11px]">
                  {selectedTicket.auditLogs && selectedTicket.auditLogs.length > 0 ? (
                    selectedTicket.auditLogs.map((log) => (
                      <div key={log.id} className="p-3 rounded-xl bg-white/[0.02] border border-white/5 flex items-start justify-between gap-3">
                        <div className="space-y-0.5">
                          <div className="flex items-center gap-2">
                            <span className="font-bold text-purple-300">{log.action}</span>
                            <span className="text-neutral-500">by {log.actorName} ({log.actorRole})</span>
                          </div>
                          {log.details && (
                            <div className="text-neutral-400 text-[10px] font-sans truncate max-w-md">
                              {log.details}
                            </div>
                          )}
                        </div>
                        <span className="text-[10px] text-neutral-500 shrink-0">
                          {new Date(log.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                        </span>
                      </div>
                    ))
                  ) : (
                    <div className="p-6 text-center text-neutral-500 text-xs">
                      No audit events logged yet.
                    </div>
                  )}
                </div>
              )}

            </div>
          ) : (
            <div className="p-16 rounded-3xl bg-black/40 border border-white/10 text-center space-y-3">
              <div className="w-12 h-12 rounded-2xl bg-cyan-500/10 border border-cyan-500/20 text-cyan-400 mx-auto flex items-center justify-center">
                <LifeBuoy className="w-6 h-6" />
              </div>
              <h3 className="text-sm font-bold text-white font-mono">Select a Case from the Queue</h3>
              <p className="text-xs text-neutral-400 max-w-sm mx-auto font-sans">
                Click any ticket on the left queue to open investigation context, public message stream, confidential notes, or Founder escalation.
              </p>
            </div>
          )}
        </div>

      </div>

      {/* Resolve Modal */}
      {isResolveModalOpen && (
        <div className="fixed inset-0 z-[200] flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
          <div className="w-full max-w-md p-6 rounded-3xl bg-[#090d18] border border-emerald-500/40 space-y-4">
            <div className="flex items-center justify-between">
              <span className="font-bold text-sm text-emerald-300 flex items-center gap-2">
                <Check className="w-4 h-4 text-emerald-400" />
                <span>Mark Ticket as Resolved</span>
              </span>
              <button onClick={() => setIsResolveModalOpen(false)} className="text-neutral-400 hover:text-white">
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="space-y-3 font-sans text-xs">
              <div>
                <label className="text-[10px] font-mono uppercase text-neutral-400 block mb-1">Resolution Code</label>
                <select
                  value={resolutionCode}
                  onChange={(e) => setResolutionCode(e.target.value)}
                  className="w-full p-2.5 rounded-xl bg-white/5 border border-white/10 text-white font-mono text-xs focus:outline-none focus:border-emerald-500"
                >
                  <option value="RESOLVED_CONFIRMED" className="bg-neutral-900">Resolved &bull; Issue Confirmed Fixed</option>
                  <option value="POLICY_EXPLANATION" className="bg-neutral-900">Policy Explanation Provided</option>
                  <option value="REFUND_ISSUED" className="bg-neutral-900">Cashfree Refund Issued</option>
                  <option value="DUPLICATE" className="bg-neutral-900">Duplicate Ticket Closed</option>
                  <option value="CANCELLED_BY_USER" className="bg-neutral-900">Cancelled by User Request</option>
                </select>
              </div>

              <div>
                <label className="text-[10px] font-mono uppercase text-neutral-400 block mb-1">Solution Summary (Visible to User)</label>
                <textarea
                  rows={3}
                  value={resolutionSummary}
                  onChange={(e) => setResolutionSummary(e.target.value)}
                  placeholder="Explain the solution provided to the requester..."
                  className="w-full p-3 rounded-xl bg-white/5 border border-white/10 text-white placeholder-neutral-500 text-xs focus:outline-none focus:border-emerald-500"
                />
              </div>
            </div>

            <div className="flex items-center justify-end gap-2 pt-2">
              <button
                type="button"
                onClick={() => setIsResolveModalOpen(false)}
                className="px-4 py-2 rounded-xl bg-white/5 hover:bg-white/10 text-neutral-300 text-xs"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleResolveTicket}
                className="px-4 py-2 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-neutral-950 font-bold text-xs"
              >
                Confirm Resolution
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Escalate Modal */}
      {isEscalateModalOpen && (
        <div className="fixed inset-0 z-[200] flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
          <div className="w-full max-w-md p-6 rounded-3xl bg-[#090d18] border border-amber-500/40 space-y-4">
            <div className="flex items-center justify-between">
              <span className="font-bold text-sm text-amber-300 flex items-center gap-2">
                <ShieldAlert className="w-4 h-4 text-amber-400" />
                <span>Escalate Case Authority</span>
              </span>
              <button onClick={() => setIsEscalateModalOpen(false)} className="text-neutral-400 hover:text-white">
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="space-y-3 font-sans text-xs">
              <div>
                <label className="text-[10px] font-mono uppercase text-neutral-400 block mb-1">Escalation Destination</label>
                <select
                  value={escalateTo}
                  onChange={(e) => setEscalateTo(e.target.value as any)}
                  className="w-full p-2.5 rounded-xl bg-white/5 border border-white/10 text-white font-mono text-xs focus:outline-none focus:border-amber-500"
                >
                  <option value="FOUNDER" className="bg-neutral-900">👑 Founder Executive Desk (/zen-vault-root)</option>
                  <option value="SENIOR_ADMIN" className="bg-neutral-900">⚖️ Senior Operations Chamber</option>
                </select>
              </div>

              <div>
                <label className="text-[10px] font-mono uppercase text-neutral-400 block mb-1">Reason for Escalation</label>
                <textarea
                  rows={3}
                  value={escalateReason}
                  onChange={(e) => setEscalateReason(e.target.value)}
                  placeholder="Specify why higher-level authority is required (e.g. high-value refund, safety complaint, platform bug)..."
                  className="w-full p-3 rounded-xl bg-white/5 border border-white/10 text-white placeholder-neutral-500 text-xs focus:outline-none focus:border-amber-500"
                />
              </div>
            </div>

            <div className="flex items-center justify-end gap-2 pt-2">
              <button
                type="button"
                onClick={() => setIsEscalateModalOpen(false)}
                className="px-4 py-2 rounded-xl bg-white/5 hover:bg-white/10 text-neutral-300 text-xs"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleEscalateTicket}
                className="px-4 py-2 rounded-xl bg-amber-500 hover:bg-amber-400 text-neutral-950 font-bold text-xs"
              >
                Submit Escalation
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
