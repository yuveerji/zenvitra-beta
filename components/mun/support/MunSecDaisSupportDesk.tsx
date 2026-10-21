'use client';

import React, { useState, useEffect, useMemo } from 'react';
import {
  LifeBuoy,
  MessageSquare,
  Send,
  CheckCircle2,
  Clock,
  AlertTriangle,
  User,
  ShieldCheck,
  Sparkles,
  Ticket,
  MapPin,
  Calendar,
  HelpCircle,
  RefreshCw,
  ChevronDown,
  ChevronUp,
  ExternalLink,
  Shield,
  Zap,
  Mail,
  Users,
  Search,
  Filter,
  CheckSquare,
  Radio,
  Gavel,
  Mic,
  Maximize2,
  FileText
} from 'lucide-react';
import { useAuth } from '@/context/AuthContext';
import { useMun } from '@/context/MunContext';
import { SupportTicketItem, SupportMessageItem, PRIORITY_CONFIG, STATUS_CONFIG } from '@/types/support';

interface MunSecDaisSupportDeskProps {
  conferenceId?: string;
  conferenceTitle?: string;
  committeeId?: string;
  committeeName?: string;
  isDaisView?: boolean;
}

const MUN_SUPPORT_CATEGORIES = [
  { label: 'All Inquiries', value: 'ALL' },
  { label: '🚨 Dais Floor Emergency', value: 'Dais Floor Emergency' },
  { label: '📜 Rules of Procedure (ROP)', value: 'Rules of Procedure (ROP)' },
  { label: '🏃 Page Messenger & Chits', value: 'Page Messenger & Chits' },
  { label: '🎤 Audio/Visual & Tech Breakdown', value: 'Audio/Visual & Tech' },
  { label: '🧮 Matrix & Quorum Discrepancy', value: 'Matrix & Quorum' },
  { label: '🎫 Delegate Pass & Registration', value: 'Delegate Pass & Registration' },
  { label: '💬 General Committee Inquiry', value: 'General Committee Inquiry' },
];

export function MunSecDaisSupportDesk({
  conferenceId,
  conferenceTitle,
  committeeId,
  committeeName,
  isDaisView = false,
}: MunSecDaisSupportDeskProps) {
  const { user, profile } = useAuth();
  const { activeConference, committees } = useMun();

  const currentUserId = profile?.id || user?.id || '';
  const currentUserEmail = profile?.email || user?.email || '';
  const currentUserName = (profile as any)?.display_name || user?.name || 'Secretariat Officer';

  const effectiveConfId = conferenceId || activeConference?.id || 'GLOBAL_MUN_SESSION';
  const effectiveConfTitle = conferenceTitle || activeConference?.name || 'Model United Nations Conference';

  // State Management
  const [tickets, setTickets] = useState<SupportTicketItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [filterCategory, setFilterCategory] = useState('ALL');
  const [filterStatus, setFilterStatus] = useState('ALL');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedTicketId, setSelectedTicketId] = useState<string | null>(null);

  // New Hotline Ticket Form
  const [isCreatingInquiry, setIsCreatingInquiry] = useState(false);
  const [subject, setSubject] = useState('');
  const [subcategory, setSubcategory] = useState(MUN_SUPPORT_CATEGORIES[1].value);
  const [description, setDescription] = useState('');
  const [priority, setPriority] = useState<'P1_CRITICAL' | 'P2_HIGH' | 'P3_NORMAL'>('P2_HIGH');
  const [selectedChamber, setSelectedChamber] = useState(committeeName || (committees[0]?.name ?? 'General Assembly'));
  const [submittingInquiry, setSubmittingInquiry] = useState(false);
  const [feedback, setFeedback] = useState<{ type: 'success' | 'error'; message: string } | null>(null);

  // Thread detail state
  const [activeThreadMessages, setActiveThreadMessages] = useState<SupportMessageItem[]>([]);
  const [loadingThread, setLoadingThread] = useState(false);
  const [replyText, setReplyText] = useState('');
  const [sendingReply, setSendingReply] = useState(false);
  const [updatingStatus, setUpdatingStatus] = useState(false);

  // Fetch Tickets
  const fetchTickets = async () => {
    setLoading(true);
    try {
      const url = new URL('/api/support/tickets', window.location.origin);
      url.searchParams.set('category', 'MUN');
      url.searchParams.set('relatedEventId', effectiveConfId);
      url.searchParams.set('isHost', 'true'); // Secretariat & Dais act with full host oversight

      const res = await fetch(url.toString());
      if (res.ok) {
        const data = await res.json();
        if (data.success && Array.isArray(data.tickets)) {
          setTickets(data.tickets);
        }
      }
    } catch (err) {
      console.error('[MUN_SUPPORT_DESK_FETCH_ERROR]', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTickets();
  }, [effectiveConfId]);

  // Load Thread Messages
  const loadThread = async (ticketId: string) => {
    setSelectedTicketId(ticketId);
    setLoadingThread(true);
    try {
      const res = await fetch(`/api/support/tickets/${ticketId}/messages`);
      if (res.ok) {
        const data = await res.json();
        if (data.success) {
          setActiveThreadMessages(data.messages || []);
        }
      }
    } catch (err) {
      console.error('[THREAD_LOAD_ERROR]', err);
    } finally {
      setLoadingThread(false);
    }
  };

  // Submit New Hotline Ticket
  const handleSubmitInquiry = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!subject.trim() || !description.trim()) {
      setFeedback({ type: 'error', message: 'Subject and description are required.' });
      return;
    }

    setSubmittingInquiry(true);
    setFeedback(null);

    try {
      const payload = {
        subject: `[${selectedChamber}] ${subject.trim()}`,
        category: 'MUN',
        subcategory,
        description: `Chamber: ${selectedChamber}\nReporter: ${currentUserName} (${currentUserEmail})\n\n${description.trim()}`,
        priority,
        userId: currentUserId,
        userEmail: currentUserEmail || 'secretariat@zenvitra.gov',
        userName: currentUserName,
        userHandle: (profile as any)?.username || user?.handle || 'dais_secretariat',
        relatedEventId: effectiveConfId,
      };

      const res = await fetch('/api/support/tickets', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      const data = await res.json();
      if (res.ok && data.success) {
        setFeedback({
          type: 'success',
          message: `Dais dispatch #${data.ticket?.ticketNumber || 'TRANSMITTED'} has been dispatched to Secretariat Support!`,
        });
        setSubject('');
        setDescription('');
        setIsCreatingInquiry(false);
        fetchTickets();
        if (data.ticket?.id) {
          loadThread(data.ticket.id);
        }
      } else {
        setFeedback({ type: 'error', message: data.error || 'Failed to submit inquiry.' });
      }
    } catch (err: any) {
      setFeedback({ type: 'error', message: err.message || 'Network error transmitting dispatch.' });
    } finally {
      setSubmittingInquiry(false);
    }
  };

  // Post Reply
  const handleSendReply = async () => {
    if (!selectedTicketId || !replyText.trim()) return;
    setSendingReply(true);

    try {
      const res = await fetch(`/api/support/tickets/${selectedTicketId}/messages`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          senderId: currentUserId || 'secretariat_member',
          senderName: `${currentUserName} (Secretariat & Dais)`,
          senderRole: 'HOST',
          content: replyText.trim(),
          isOfficial: true,
        }),
      });

      if (res.ok) {
        setReplyText('');
        await loadThread(selectedTicketId);
        fetchTickets();
      }
    } catch (err) {
      console.error('[SEND_REPLY_ERROR]', err);
    } finally {
      setSendingReply(false);
    }
  };

  // Fast Update Status
  const handleUpdateStatus = async (newStatus: 'RESOLVED' | 'CLOSED' | 'IN_PROGRESS') => {
    if (!selectedTicketId) return;
    setUpdatingStatus(true);

    try {
      const res = await fetch(`/api/support/tickets/${selectedTicketId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          status: newStatus,
          resolutionSummary: newStatus === 'RESOLVED' ? `Action completed by Secretariat: ${currentUserName}` : undefined,
          actorId: currentUserId,
          actorName: currentUserName,
          actorRole: 'SECRETARIAT',
        }),
      });

      if (res.ok) {
        fetchTickets();
        // Add note in thread
        await loadThread(selectedTicketId);
      }
    } catch (err) {
      console.error('[UPDATE_STATUS_ERROR]', err);
    } finally {
      setUpdatingStatus(false);
    }
  };

  // Metrics
  const metrics = useMemo(() => {
    const total = tickets.length;
    const critical = tickets.filter((t) => t.priority === 'P1_CRITICAL' || t.priority === 'P2_HIGH').length;
    const open = tickets.filter((t) => t.status === 'NEW' || t.status === 'OPEN' || t.status === 'IN_PROGRESS').length;
    const resolved = tickets.filter((t) => t.status === 'RESOLVED' || t.status === 'CLOSED').length;
    return { total, critical, open, resolved };
  }, [tickets]);

  // Filtered Tickets
  const filteredTickets = useMemo(() => {
    return tickets.filter((t) => {
      const matchCat = filterCategory === 'ALL' || t.subcategory?.includes(filterCategory) || t.subject.includes(filterCategory);
      const matchStatus =
        filterStatus === 'ALL' ||
        (filterStatus === 'ACTIVE' && (t.status === 'NEW' || t.status === 'OPEN' || t.status === 'IN_PROGRESS')) ||
        (filterStatus === 'RESOLVED' && (t.status === 'RESOLVED' || t.status === 'CLOSED'));
      const matchQuery =
        !searchQuery.trim() ||
        t.subject.toLowerCase().includes(searchQuery.toLowerCase()) ||
        t.ticketNumber.toLowerCase().includes(searchQuery.toLowerCase()) ||
        t.userName.toLowerCase().includes(searchQuery.toLowerCase());

      return matchCat && matchStatus && matchQuery;
    });
  }, [tickets, filterCategory, filterStatus, searchQuery]);

  const activeTicket = useMemo(() => {
    return tickets.find((t) => t.id === selectedTicketId) || null;
  }, [tickets, selectedTicketId]);

  return (
    <div className="w-full space-y-6 text-left">
      {/* ── 1. Top Header Banner ── */}
      <div className="p-6 sm:p-8 rounded-3xl bg-gradient-to-br from-[#0c101a] via-[#07090f] to-[#040508] border border-cyan-500/30 relative overflow-hidden shadow-[0_20px_60px_rgba(0,0,0,0.85)]">
        <div className="absolute top-0 right-0 w-80 h-80 bg-cyan-500/10 blur-[130px] rounded-full pointer-events-none" />
        <div className="absolute bottom-0 left-1/4 w-72 h-72 bg-purple-500/10 blur-[140px] rounded-full pointer-events-none" />

        <div className="relative z-10 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
          <div className="space-y-2 max-w-2xl">
            <div className="flex items-center gap-2">
              <span className="px-3 py-1 rounded-full bg-cyan-500/10 border border-cyan-500/30 text-cyan-300 font-mono text-[10px] tracking-wider uppercase font-bold flex items-center gap-1.5">
                <LifeBuoy className="w-3.5 h-3.5 text-cyan-400" />
                <span>SECRETARIAT &amp; DAIS SUPPORT DESK</span>
              </span>
              <span className="px-2.5 py-0.5 rounded-full bg-emerald-500/15 border border-emerald-500/30 text-emerald-300 text-[10px] font-mono font-bold flex items-center gap-1">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                <span>LIVE DIRECT HOTLINE</span>
              </span>
            </div>

            <h2 className="text-2xl sm:text-3xl font-black text-white tracking-tight uppercase font-display">
              {effectiveConfTitle} // SUPPORT CONTROL
            </h2>

            <p className="text-xs sm:text-sm text-neutral-400 leading-relaxed">
              Real-time communication conduit between the Executive Secretariat, Dais Chairs, Committee Directors, and Delegates. Dispatch floor runners, report ROP disputes, and resolve delegate issues instantly.
            </p>
          </div>

          {/* Quick Trigger Button */}
          <div className="flex items-center gap-3 shrink-0 flex-wrap">
            <button
              type="button"
              onClick={() => setIsCreatingInquiry(!isCreatingInquiry)}
              className="px-5 py-3 rounded-2xl bg-gradient-to-r from-cyan-400 to-teal-400 hover:from-cyan-300 hover:to-teal-300 text-black font-display font-bold text-xs uppercase tracking-wider transition-all shadow-[0_0_25px_rgba(6,182,212,0.3)] flex items-center gap-2 cursor-pointer active:scale-95"
            >
              <Zap className="w-4 h-4 fill-black text-black" />
              <span>{isCreatingInquiry ? 'Close Dispatch Form' : '+ New Dais Dispatch'}</span>
            </button>

            <button
              type="button"
              onClick={fetchTickets}
              disabled={loading}
              className="p-3 rounded-2xl bg-white/5 hover:bg-white/10 text-cyan-300 border border-cyan-500/30 transition cursor-pointer"
              title="Refresh Hotline Stream"
            >
              <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
            </button>
          </div>
        </div>

        {/* Live Metrics Rail */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-6 border-t border-white/10 mt-6 font-mono text-xs">
          <div className="p-3.5 rounded-2xl bg-white/[0.03] border border-white/10">
            <div className="text-[10px] text-neutral-400 uppercase tracking-wider">Total Dispatches</div>
            <div className="text-xl font-black text-white mt-1">{metrics.total}</div>
          </div>
          <div className="p-3.5 rounded-2xl bg-rose-500/10 border border-rose-500/30">
            <div className="text-[10px] text-rose-300 uppercase tracking-wider">Critical Floor Alerts</div>
            <div className="text-xl font-black text-rose-400 mt-1">{metrics.critical}</div>
          </div>
          <div className="p-3.5 rounded-2xl bg-amber-500/10 border border-amber-500/30">
            <div className="text-[10px] text-amber-300 uppercase tracking-wider">Pending Action</div>
            <div className="text-xl font-black text-amber-400 mt-1">{metrics.open}</div>
          </div>
          <div className="p-3.5 rounded-2xl bg-emerald-500/10 border border-emerald-500/30">
            <div className="text-[10px] text-emerald-300 uppercase tracking-wider">Resolved Dispatches</div>
            <div className="text-xl font-black text-emerald-400 mt-1">{metrics.resolved}</div>
          </div>
        </div>
      </div>

      {/* ── 2. Create Inquiry Drawer ── */}
      {isCreatingInquiry && (
        <form
          onSubmit={handleSubmitInquiry}
          className="p-6 rounded-3xl bg-[#0a0d18] border border-cyan-500/40 shadow-2xl space-y-5 animate-in fade-in duration-200"
        >
          <div className="flex items-center justify-between border-b border-white/10 pb-4">
            <div className="flex items-center gap-2 text-cyan-300 font-bold text-sm">
              <Zap className="w-4 h-4 text-cyan-400" />
              <span>DISPATCH NEW DAIS / SECRETARIAT INQUIRY</span>
            </div>
            <span className="text-xs text-neutral-500 font-mono">Dispatches will be routed immediately</span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {/* Target Chamber */}
            <div>
              <label className="block text-[11px] font-mono text-neutral-400 uppercase tracking-wider mb-1.5">
                Chamber / Committee
              </label>
              <select
                value={selectedChamber}
                onChange={(e) => setSelectedChamber(e.target.value)}
                className="w-full bg-[#111422] border border-white/15 rounded-xl px-3 py-2 text-xs text-white font-mono focus:border-cyan-500 focus:outline-none"
              >
                {committees.map((c) => (
                  <option key={c.id} value={c.name}>
                    {c.shortName ? `${c.shortName} - ${c.name}` : c.name}
                  </option>
                ))}
                <option value="Executive Secretariat Core">Executive Secretariat Core</option>
                <option value="Crisis Command Room">Crisis Command Room</option>
                <option value="Conference Logistics Desk">Conference Logistics Desk</option>
              </select>
            </div>

            {/* Subcategory */}
            <div>
              <label className="block text-[11px] font-mono text-neutral-400 uppercase tracking-wider mb-1.5">
                Inquiry Type
              </label>
              <select
                value={subcategory}
                onChange={(e) => setSubcategory(e.target.value)}
                className="w-full bg-[#111422] border border-white/15 rounded-xl px-3 py-2 text-xs text-white font-mono focus:border-cyan-500 focus:outline-none"
              >
                {MUN_SUPPORT_CATEGORIES.slice(1).map((cat) => (
                  <option key={cat.value} value={cat.value}>
                    {cat.label}
                  </option>
                ))}
              </select>
            </div>

            {/* Priority */}
            <div>
              <label className="block text-[11px] font-mono text-neutral-400 uppercase tracking-wider mb-1.5">
                Urgency Level
              </label>
              <div className="grid grid-cols-3 gap-2">
                {(['P1_CRITICAL', 'P2_HIGH', 'P3_NORMAL'] as const).map((lvl) => (
                  <button
                    key={lvl}
                    type="button"
                    onClick={() => setPriority(lvl)}
                    className={`py-2 rounded-xl text-[10px] font-mono font-bold uppercase transition cursor-pointer border ${
                      priority === lvl
                        ? lvl === 'P1_CRITICAL'
                          ? 'bg-rose-500/20 text-rose-300 border-rose-500/50'
                          : lvl === 'P2_HIGH'
                          ? 'bg-amber-500/20 text-amber-300 border-amber-500/50'
                          : 'bg-cyan-500/20 text-cyan-300 border-cyan-500/50'
                        : 'bg-white/5 text-neutral-400 border-white/10 hover:text-white'
                    }`}
                  >
                    {lvl.replace('P1_', '').replace('P2_', '').replace('P3_', '')}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Subject */}
          <div>
            <label className="block text-[11px] font-mono text-neutral-400 uppercase tracking-wider mb-1.5">
              Subject Headline
            </label>
            <input
              type="text"
              value={subject}
              onChange={(e) => setSubject(e.target.value)}
              placeholder="e.g. Need Page Runner in Room 302 / Quorum dispute on Motion 4"
              className="w-full bg-[#111422] border border-white/15 rounded-xl px-3.5 py-2.5 text-xs text-white placeholder-neutral-500 focus:border-cyan-500 focus:outline-none"
            />
          </div>

          {/* Description */}
          <div>
            <label className="block text-[11px] font-mono text-neutral-400 uppercase tracking-wider mb-1.5">
              Inquiry Details &amp; Operational Impact
            </label>
            <textarea
              rows={3}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Provide exact committee details, delegate country/portfolio, motion number, or specific assistance requested..."
              className="w-full bg-[#111422] border border-white/15 rounded-xl px-3.5 py-2.5 text-xs text-white placeholder-neutral-500 focus:border-cyan-500 focus:outline-none resize-none"
            />
          </div>

          {/* Feedback */}
          {feedback && (
            <div
              className={`p-3 rounded-xl text-xs font-mono flex items-center gap-2 ${
                feedback.type === 'success'
                  ? 'bg-emerald-500/15 border border-emerald-500/30 text-emerald-300'
                  : 'bg-rose-500/15 border border-rose-500/30 text-rose-300'
              }`}
            >
              {feedback.type === 'success' ? <CheckCircle2 className="w-4 h-4" /> : <AlertTriangle className="w-4 h-4" />}
              <span>{feedback.message}</span>
            </div>
          )}

          {/* Action Row */}
          <div className="flex items-center justify-end gap-3 pt-2">
            <button
              type="button"
              onClick={() => setIsCreatingInquiry(false)}
              className="px-4 py-2.5 rounded-xl bg-white/5 hover:bg-white/10 text-neutral-400 hover:text-white text-xs font-mono transition cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={submittingInquiry}
              className="px-6 py-2.5 rounded-xl bg-cyan-400 hover:bg-cyan-300 text-black font-display font-bold text-xs uppercase tracking-wider transition cursor-pointer flex items-center gap-2 disabled:opacity-50"
            >
              <Send className="w-3.5 h-3.5" />
              <span>{submittingInquiry ? 'Transmitting...' : 'Dispatch to Secretariat'}</span>
            </button>
          </div>
        </form>
      )}

      {/* ── 3. Filters & Search Bar ── */}
      <div className="p-4 rounded-2xl bg-black/40 border border-white/10 flex flex-wrap items-center justify-between gap-3 font-mono text-xs">
        <div className="flex items-center gap-2 flex-1 min-w-[240px]">
          <Search className="w-4 h-4 text-neutral-500 shrink-0" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search inquiries, tickets, chamber or delegate..."
            className="w-full bg-transparent text-white placeholder-neutral-500 text-xs focus:outline-none"
          />
        </div>

        <div className="flex items-center gap-2 flex-wrap">
          {/* Category Filter */}
          <select
            value={filterCategory}
            onChange={(e) => setFilterCategory(e.target.value)}
            className="bg-[#111422] border border-white/15 text-neutral-300 text-xs rounded-xl px-2.5 py-1.5 focus:outline-none"
          >
            {MUN_SUPPORT_CATEGORIES.map((cat) => (
              <option key={cat.value} value={cat.value}>
                {cat.label}
              </option>
            ))}
          </select>

          {/* Status Filter */}
          <select
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
            className="bg-[#111422] border border-white/15 text-neutral-300 text-xs rounded-xl px-2.5 py-1.5 focus:outline-none"
          >
            <option value="ALL">All Statuses</option>
            <option value="ACTIVE">Active / Pending Only</option>
            <option value="RESOLVED">Resolved Only</option>
          </select>
        </div>
      </div>

      {/* ── 4. Main Two-Column View: Inquiries List + Active Thread ── */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Left List (7 Cols) */}
        <div className="lg:col-span-7 space-y-3">
          {loading ? (
            <div className="p-12 text-center rounded-3xl bg-black/30 border border-white/10 text-neutral-400 font-mono text-xs flex items-center justify-center gap-2">
              <RefreshCw className="w-4 h-4 animate-spin text-cyan-400" />
              <span>Querying Secretariat &amp; Dais Hotline Stream...</span>
            </div>
          ) : filteredTickets.length === 0 ? (
            <div className="p-12 text-center rounded-3xl bg-black/30 border border-white/10 space-y-3">
              <CheckCircle2 className="w-8 h-8 text-emerald-400 mx-auto" />
              <div className="text-sm font-bold text-white uppercase tracking-wider font-mono">
                No Inquiries Found
              </div>
              <p className="text-xs text-neutral-400 max-w-sm mx-auto">
                No active support tickets match your filter criteria. All chambers and delegates are currently operating smoothly.
              </p>
            </div>
          ) : (
            filteredTickets.map((t) => {
              const isSelected = t.id === selectedTicketId;
              const isP1 = t.priority === 'P1_CRITICAL';
              const isResolved = t.status === 'RESOLVED' || t.status === 'CLOSED';

              return (
                <div
                  key={t.id}
                  onClick={() => loadThread(t.id)}
                  className={`p-4 rounded-2xl border transition cursor-pointer text-left space-y-2.5 relative ${
                    isSelected
                      ? 'bg-cyan-500/10 border-cyan-500/50 shadow-[0_0_20px_rgba(6,182,212,0.15)]'
                      : 'bg-white/[0.02] hover:bg-white/[0.05] border-white/10'
                  }`}
                >
                  <div className="flex items-center justify-between gap-2 text-[10px] font-mono">
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-cyan-300 bg-cyan-500/10 px-2 py-0.5 rounded">
                        #{t.ticketNumber}
                      </span>
                      <span className="text-neutral-400">{t.subcategory || 'General MUN'}</span>
                    </div>

                    <div className="flex items-center gap-2">
                      <span
                        className={`px-2 py-0.5 rounded uppercase font-bold text-[9px] ${
                          isP1
                            ? 'bg-rose-500/20 text-rose-300 border border-rose-500/30'
                            : t.priority === 'P2_HIGH'
                            ? 'bg-amber-500/20 text-amber-300'
                            : 'bg-cyan-500/20 text-cyan-300'
                        }`}
                      >
                        {t.priority.replace('P1_', '').replace('P2_', '').replace('P3_', '')}
                      </span>

                      <span
                        className={`px-2 py-0.5 rounded uppercase font-bold text-[9px] ${
                          isResolved
                            ? 'bg-emerald-500/20 text-emerald-300'
                            : 'bg-blue-500/20 text-blue-300'
                        }`}
                      >
                        {t.status}
                      </span>
                    </div>
                  </div>

                  <h3 className="text-xs sm:text-sm font-bold text-white leading-snug">
                    {t.subject}
                  </h3>

                  <p className="text-xs text-neutral-400 line-clamp-2 leading-relaxed">
                    {t.description}
                  </p>

                  <div className="flex items-center justify-between pt-2 border-t border-white/5 text-[10px] font-mono text-neutral-500">
                    <span className="flex items-center gap-1.5">
                      <User className="w-3 h-3 text-neutral-400" />
                      <span className="text-neutral-300 font-semibold">{t.userName}</span>
                    </span>

                    <span className="flex items-center gap-1.5">
                      <Clock className="w-3 h-3 text-neutral-400" />
                      <span>{new Date(t.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                      {t._count && t._count.messages > 0 && (
                        <span className="ml-2 px-1.5 py-0.2 rounded bg-white/10 text-neutral-300">
                          {t._count.messages} msg{t._count.messages > 1 ? 's' : ''}
                        </span>
                      )}
                    </span>
                  </div>
                </div>
              );
            })
          )}
        </div>

        {/* Right Active Thread & Secretariat Console (5 Cols) */}
        <div className="lg:col-span-5 p-5 rounded-3xl bg-[#0a0d18] border border-white/15 sticky top-24 space-y-4">
          {activeTicket ? (
            <>
              {/* Active Ticket Banner */}
              <div className="space-y-2 border-b border-white/10 pb-4">
                <div className="flex items-center justify-between text-xs font-mono">
                  <span className="px-2 py-0.5 rounded bg-cyan-500/15 text-cyan-300 font-bold">
                    #{activeTicket.ticketNumber}
                  </span>
                  <div className="flex items-center gap-1.5">
                    {activeTicket.status !== 'RESOLVED' && (
                      <button
                        type="button"
                        onClick={() => handleUpdateStatus('RESOLVED')}
                        disabled={updatingStatus}
                        className="px-2.5 py-1 rounded-lg bg-emerald-500/20 hover:bg-emerald-500/30 text-emerald-300 text-[10px] font-mono font-bold flex items-center gap-1 transition cursor-pointer"
                      >
                        <CheckCircle2 className="w-3 h-3" />
                        <span>Resolve</span>
                      </button>
                    )}
                    {activeTicket.status === 'RESOLVED' && (
                      <span className="px-2.5 py-1 rounded-lg bg-emerald-500/20 text-emerald-300 text-[10px] font-mono font-bold flex items-center gap-1">
                        <CheckCircle2 className="w-3 h-3" />
                        <span>Resolved</span>
                      </span>
                    )}
                  </div>
                </div>

                <h3 className="text-sm font-bold text-white leading-snug">
                  {activeTicket.subject}
                </h3>

                <div className="text-[11px] font-mono text-neutral-400 flex items-center gap-2">
                  <span>Chamber: {activeTicket.subcategory || 'General'}</span>
                  <span>&bull;</span>
                  <span>From: {activeTicket.userName}</span>
                </div>
              </div>

              {/* Messages Stream */}
              <div className="space-y-3 max-h-80 overflow-y-auto p-1 text-xs">
                {/* Initial Description */}
                <div className="p-3.5 rounded-2xl bg-cyan-950/20 border border-cyan-500/30 mr-3 space-y-1">
                  <div className="flex items-center justify-between text-[10px] font-mono text-cyan-300">
                    <span className="font-bold flex items-center gap-1">
                      <User className="w-3 h-3" />
                      <span>{activeTicket.userName}</span>
                    </span>
                    <span className="text-neutral-500">
                      {new Date(activeTicket.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </span>
                  </div>
                  <p className="text-neutral-200 leading-relaxed font-sans whitespace-pre-line text-xs">
                    {activeTicket.description}
                  </p>
                </div>

                {/* Additional Thread Messages */}
                {loadingThread ? (
                  <div className="p-4 text-center text-xs font-mono text-neutral-500">
                    Loading conversation stream...
                  </div>
                ) : (
                  activeThreadMessages.map((msg) => {
                    const isSecretariat = msg.senderRole === 'HOST' || msg.senderRole === 'STAFF' || msg.isOfficial;
                    return (
                      <div
                        key={msg.id}
                        className={`p-3.5 rounded-2xl text-xs space-y-1 ${
                          isSecretariat
                            ? 'bg-purple-950/25 border border-purple-500/30 ml-3'
                            : 'bg-cyan-950/20 border border-cyan-500/30 mr-3'
                        }`}
                      >
                        <div className="flex items-center justify-between text-[10px] font-mono">
                          <span className={`font-bold flex items-center gap-1.5 ${isSecretariat ? 'text-purple-300' : 'text-cyan-300'}`}>
                            {isSecretariat ? <ShieldCheck className="w-3.5 h-3.5 text-purple-400" /> : <User className="w-3.5 h-3.5 text-cyan-400" />}
                            <span>{msg.senderName}</span>
                            {isSecretariat && (
                              <span className="px-1.5 py-0.2 rounded bg-purple-500/20 text-[9px] uppercase font-bold">
                                Secretariat
                              </span>
                            )}
                          </span>
                          <span className="text-neutral-500">
                            {new Date(msg.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                          </span>
                        </div>
                        <p className="text-neutral-200 leading-relaxed font-sans text-xs">
                          {msg.content}
                        </p>
                      </div>
                    );
                  })
                )}
              </div>

              {/* Secretariat Reply Input Box */}
              <div className="pt-2 border-t border-white/10 space-y-2">
                <div className="flex items-center justify-between text-[10px] font-mono text-neutral-400">
                  <span>Transmit Official Secretariat Message:</span>
                  <span className="text-purple-300 font-bold">Verified Shield</span>
                </div>
                <div className="relative">
                  <textarea
                    rows={2}
                    value={replyText}
                    onChange={(e) => setReplyText(e.target.value)}
                    placeholder="Enter official Secretariat / Dais directive, floor guidance, or resolution update..."
                    className="w-full bg-[#111422] border border-white/15 rounded-xl p-2.5 text-xs text-white placeholder-neutral-500 focus:border-cyan-500 focus:outline-none resize-none pr-10"
                    onKeyDown={(e) => {
                      if (e.key === 'Enter' && (e.metaKey || e.ctrlKey)) {
                        handleSendReply();
                      }
                    }}
                  />
                  <button
                    type="button"
                    onClick={handleSendReply}
                    disabled={sendingReply || !replyText.trim()}
                    className="absolute bottom-2.5 right-2 p-1.5 rounded-lg bg-cyan-400 hover:bg-cyan-300 text-black transition cursor-pointer disabled:opacity-40"
                    title="Send Reply (Ctrl+Enter)"
                  >
                    <Send className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            </>
          ) : (
            <div className="p-8 text-center text-neutral-500 font-mono text-xs space-y-2">
              <MessageSquare className="w-8 h-8 mx-auto text-neutral-600" />
              <p>Select an inquiry from the stream to view full conversation history and dispatch Secretariat directives.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default MunSecDaisSupportDesk;
