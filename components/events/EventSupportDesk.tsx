'use client';

import React, { useState, useEffect } from 'react';
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
  Users
} from 'lucide-react';
import { useAuth } from '@/context/AuthContext';
import { ZenEvent } from '@/types/events';
import { SupportTicketItem, SupportMessageItem, PRIORITY_CONFIG, STATUS_CONFIG } from '@/types/support';

interface EventSupportDeskProps {
  event: ZenEvent;
}

export function EventSupportDesk({ event }: EventSupportDeskProps) {
  const { user, profile } = useAuth();
  const currentUserId = profile?.id || user?.id || '';
  const currentUserEmail = profile?.email || user?.email || '';
  const currentUserName = (profile as any)?.display_name || user?.name || 'Attendee';

  // Check if current user is the host/organizer
  const isActualHost = Boolean(
    (event.organizerId && (currentUserId === event.organizerId)) ||
    (event.organizerUsername && (profile?.username === event.organizerUsername || user?.handle === event.organizerUsername))
  );

  // Active view: 'AUDIENCE' (ask host) vs 'HOST' (secretariat management)
  const [activePersona, setActivePersona] = useState<'AUDIENCE' | 'HOST'>(
    isActualHost ? 'HOST' : 'AUDIENCE'
  );

  // Audience Form States
  const [subject, setSubject] = useState('');
  const [description, setDescription] = useState('');
  const [subcategory, setSubcategory] = useState('Pass & Ticketing Support');
  const [priority, setPriority] = useState<'P3_NORMAL' | 'P2_HIGH'>('P3_NORMAL');
  const [attendeeName, setAttendeeName] = useState(currentUserName);
  const [attendeeEmail, setAttendeeEmail] = useState(currentUserEmail);
  const [submittingInquiry, setSubmittingInquiry] = useState(false);
  const [feedback, setFeedback] = useState<{ type: 'success' | 'error'; message: string } | null>(null);

  // Tickets List & Active Thread
  const [tickets, setTickets] = useState<SupportTicketItem[]>([]);
  const [loadingTickets, setLoadingTickets] = useState(false);
  const [selectedTicket, setSelectedTicket] = useState<SupportTicketItem | null>(null);
  const [activeThreadMessages, setActiveThreadMessages] = useState<SupportMessageItem[]>([]);
  const [loadingThread, setLoadingThread] = useState(false);
  const [replyText, setReplyText] = useState('');
  const [sendingReply, setSendingReply] = useState(false);

  // Filter for host view
  const [hostStatusFilter, setHostStatusFilter] = useState<'ALL' | 'OPEN' | 'RESOLVED'>('ALL');

  // Quick Inquiries Presets
  const TOPIC_PRESETS = [
    { label: 'Pass & Ticketing', subcategory: 'Pass & Ticketing Support', icon: Ticket },
    { label: 'Venue & Access', subcategory: 'Venue, Entry & Campus Access', icon: MapPin },
    { label: 'Committee Allotments', subcategory: 'Committee & Portfolio Allotments', icon: Users },
    { label: 'Schedule & Timing', subcategory: 'Schedule & Check-in Timing', icon: Clock },
    { label: 'General Question', subcategory: 'General Host Inquiry', icon: HelpCircle },
  ];

  // Sync attendee info from profile
  useEffect(() => {
    if (currentUserEmail && !attendeeEmail) setAttendeeEmail(currentUserEmail);
    if (currentUserName && attendeeName === 'Attendee') setAttendeeName(currentUserName);
  }, [currentUserEmail, currentUserName]);

  // Load tickets for this event
  const fetchEventTickets = async () => {
    try {
      setLoadingTickets(true);
      const params = new URLSearchParams();
      params.append('relatedEventId', event.id);

      if (activePersona === 'HOST') {
        params.append('isHost', 'true');
      } else {
        if (currentUserEmail) params.append('userEmail', currentUserEmail);
        if (currentUserId) params.append('userId', currentUserId);
      }

      const res = await fetch(`/api/support/tickets?${params.toString()}`);
      const data = await res.json();
      if (data.success && Array.isArray(data.tickets)) {
        setTickets(data.tickets);
      }
    } catch (err) {
      console.error('[EVENT_SUPPORT_FETCH_ERROR]', err);
    } finally {
      setLoadingTickets(false);
    }
  };

  useEffect(() => {
    fetchEventTickets();
  }, [event.id, activePersona, currentUserEmail, currentUserId]);

  // Load detailed messages for a selected ticket
  const loadTicketThread = async (ticketId: string) => {
    try {
      setLoadingThread(true);
      const res = await fetch(`/api/support/tickets/${ticketId}`);
      const data = await res.json();
      if (data.success && data.ticket) {
        setSelectedTicket(data.ticket);
        setActiveThreadMessages(data.ticket.messages || []);
      }
    } catch (err) {
      console.error('[EVENT_SUPPORT_THREAD_ERROR]', err);
    } finally {
      setLoadingThread(false);
    }
  };

  // Submit new audience inquiry to host
  const handleSubmitInquiry = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!subject.trim() || !description.trim() || !attendeeEmail.trim()) {
      setFeedback({ type: 'error', message: 'Please fill in all required fields.' });
      return;
    }

    setSubmittingInquiry(true);
    setFeedback(null);

    try {
      const res = await fetch('/api/support/tickets', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          subject: subject.trim(),
          category: 'EVENTS',
          subcategory,
          description: description.trim(),
          priority,
          userId: currentUserId || undefined,
          userEmail: attendeeEmail.trim().toLowerCase(),
          userName: attendeeName.trim() || 'Attendee',
          userHandle: profile?.username || undefined,
          relatedEventId: event.id,
        }),
      });

      const data = await res.json();
      if (data.success && data.ticket) {
        setFeedback({
          type: 'success',
          message: `Inquiry sent directly to ${event.organizerName}! Ticket #${data.ticket.ticketNumber} created.`,
        });
        setSubject('');
        setDescription('');
        fetchEventTickets();
        setSelectedTicket(data.ticket);
      } else {
        setFeedback({ type: 'error', message: data.error || 'Failed to submit inquiry to host.' });
      }
    } catch (err: any) {
      setFeedback({ type: 'error', message: err?.message || 'Network error sending inquiry.' });
    } finally {
      setSubmittingInquiry(false);
    }
  };

  // Send message in existing thread
  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedTicket || !replyText.trim()) return;

    setSendingReply(true);
    try {
      const isSendingAsHost = activePersona === 'HOST';
      const senderRole = isSendingAsHost ? 'HOST' : 'USER';
      const senderName = isSendingAsHost
        ? `${event.organizerName} (Host)`
        : currentUserName;

      const res = await fetch(`/api/support/tickets/${selectedTicket.id}/messages`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          senderId: currentUserId || 'anonymous',
          senderName,
          senderRole,
          content: replyText.trim(),
          isOfficial: isSendingAsHost,
        }),
      });

      const data = await res.json();
      if (data.success) {
        setReplyText('');
        loadTicketThread(selectedTicket.id);
        fetchEventTickets();
      }
    } catch (err) {
      console.error('[EVENT_SUPPORT_REPLY_ERROR]', err);
    } finally {
      setSendingReply(false);
    }
  };

  // Filtered tickets for host view
  const filteredHostTickets = tickets.filter((t) => {
    if (hostStatusFilter === 'OPEN') {
      return t.status !== 'RESOLVED' && t.status !== 'CLOSED';
    }
    if (hostStatusFilter === 'RESOLVED') {
      return t.status === 'RESOLVED' || t.status === 'CLOSED';
    }
    return true;
  });

  return (
    <div className="rounded-3xl bg-[#090c16] border border-white/10 p-6 sm:p-8 space-y-6 text-left shadow-2xl relative overflow-hidden font-sans">
      
      {/* Header Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-white/10 pb-5">
        <div className="space-y-1">
          <div className="flex items-center gap-2 flex-wrap">
            <span className="px-2.5 py-0.5 rounded-full bg-cyan-500/10 border border-cyan-500/30 text-cyan-300 font-mono text-[10px] font-bold uppercase tracking-wider flex items-center gap-1.5">
              <LifeBuoy className="w-3.5 h-3.5 text-cyan-400" />
              <span>DIRECT EVENT COMMUNICATIONS</span>
            </span>
            <span className="px-2 py-0.5 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 font-mono text-[9px] font-bold uppercase">
              HOST &amp; AUDIENCE DESK
            </span>
          </div>

          <h3 className="text-xl sm:text-2xl font-bold font-display text-white tracking-tight">
            Contact Host &amp; Secretariat
          </h3>
          <p className="text-xs text-neutral-400 max-w-2xl leading-relaxed">
            Directly communicate with <strong className="text-white">{event.organizerName}</strong> and the organizing team for inquiries regarding passes, agenda, dais allotments, or venue assistance.
          </p>
        </div>

        {/* View Switcher Pills */}
        <div className="flex items-center gap-1.5 p-1 rounded-xl bg-black/60 border border-white/10 text-xs font-mono self-start sm:self-center">
          <button
            type="button"
            onClick={() => {
              setActivePersona('AUDIENCE');
              setSelectedTicket(null);
            }}
            className={`px-3 py-1.5 rounded-lg transition cursor-pointer flex items-center gap-1.5 ${
              activePersona === 'AUDIENCE'
                ? 'bg-cyan-500/20 text-cyan-300 font-bold border border-cyan-500/30 shadow-sm'
                : 'text-neutral-400 hover:text-white'
            }`}
          >
            <User className="w-3.5 h-3.5" />
            <span>Audience View</span>
          </button>

          <button
            type="button"
            onClick={() => {
              setActivePersona('HOST');
              setSelectedTicket(null);
            }}
            className={`px-3 py-1.5 rounded-lg transition cursor-pointer flex items-center gap-1.5 ${
              activePersona === 'HOST'
                ? 'bg-purple-500/20 text-purple-300 font-bold border border-purple-500/30 shadow-sm'
                : 'text-neutral-400 hover:text-white'
            }`}
          >
            <Shield className="w-3.5 h-3.5" />
            <span>Host Desk {isActualHost && <span className="text-[10px] text-emerald-400 font-bold">(You)</span>}</span>
          </button>
        </div>
      </div>

      {/* Host Credentials & SLA Info Strip */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs font-mono">
        <div className="p-3.5 rounded-2xl bg-white/[0.02] border border-white/10 flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-cyan-500/10 border border-cyan-500/30 flex items-center justify-center text-cyan-300 shrink-0 font-bold">
            {event.organizerName ? event.organizerName.slice(0, 2).toUpperCase() : 'HO'}
          </div>
          <div className="overflow-hidden">
            <span className="text-[10px] text-neutral-500 uppercase block font-bold">Convening Host</span>
            <span className="text-white font-bold block truncate">{event.organizerName}</span>
            <span className="text-cyan-400 text-[10px] truncate block">@{event.organizerUsername || 'organizer'}</span>
          </div>
        </div>

        <div className="p-3.5 rounded-2xl bg-white/[0.02] border border-white/10 flex items-center gap-3">
          <Clock className="w-5 h-5 text-emerald-400 shrink-0" />
          <div>
            <span className="text-[10px] text-neutral-500 uppercase block font-bold">Host Response SLA</span>
            <span className="text-white font-bold block">Active Host Helpdesk</span>
            <span className="text-emerald-400 text-[10px]">Usually replies within 2–4 hrs</span>
          </div>
        </div>

        <div className="p-3.5 rounded-2xl bg-white/[0.02] border border-white/10 flex items-center gap-3">
          <ShieldCheck className="w-5 h-5 text-purple-400 shrink-0" />
          <div>
            <span className="text-[10px] text-neutral-500 uppercase block font-bold">Direct Verification</span>
            <span className="text-white font-bold block">Encrypted Ticket Thread</span>
            <span className="text-purple-300 text-[10px]">Audit logged under ZEN.SUPPORT</span>
          </div>
        </div>
      </div>

      {/* Feedback Alert */}
      {feedback && (
        <div
          className={`p-3.5 rounded-2xl text-xs font-mono flex items-center gap-2 border ${
            feedback.type === 'success'
              ? 'bg-emerald-500/15 border-emerald-500/30 text-emerald-300'
              : 'bg-rose-500/15 border-rose-500/30 text-rose-300'
          }`}
        >
          {feedback.type === 'success' ? (
            <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
          ) : (
            <AlertTriangle className="w-4 h-4 text-rose-400 shrink-0" />
          )}
          <span>{feedback.message}</span>
        </div>
      )}

      {/* ═══════════════════════════════════════════════════════════════════ */}
      {/* 1. AUDIENCE VIEW: ASK HOST & VIEW PAST INQUIRIES                   */}
      {/* ═══════════════════════════════════════════════════════════════════ */}
      {activePersona === 'AUDIENCE' && (
        <div className="space-y-6">
          
          {/* Quick Topic Chips */}
          <div className="space-y-2">
            <span className="text-[11px] font-mono text-neutral-400 font-bold uppercase tracking-wider block">
              Select Inquiry Category:
            </span>
            <div className="flex flex-wrap gap-2 text-xs">
              {TOPIC_PRESETS.map((preset) => {
                const Icon = preset.icon;
                const isSelected = subcategory === preset.subcategory;
                return (
                  <button
                    key={preset.subcategory}
                    type="button"
                    onClick={() => {
                      setSubcategory(preset.subcategory);
                      if (!subject) setSubject(`Inquiry regarding ${preset.label}`);
                    }}
                    className={`px-3 py-1.5 rounded-xl border transition flex items-center gap-1.5 cursor-pointer ${
                      isSelected
                        ? 'bg-cyan-500/20 border-cyan-400 text-cyan-200 font-bold shadow-sm'
                        : 'bg-white/[0.03] border-white/10 text-neutral-400 hover:text-white hover:bg-white/5'
                    }`}
                  >
                    <Icon className="w-3.5 h-3.5" />
                    <span>{preset.label}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Inquiry Form */}
          <form onSubmit={handleSubmitInquiry} className="p-5 rounded-2xl bg-black/40 border border-white/10 space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
              <div className="space-y-1 sm:col-span-2">
                <label className="text-[11px] font-mono text-neutral-300 font-bold block">
                  SUBJECT / QUESTION TITLE <span className="text-rose-400">*</span>
                </label>
                <input
                  type="text"
                  required
                  value={subject}
                  onChange={(e) => setSubject(e.target.value)}
                  placeholder="e.g. Question regarding physical registration desk timing or delegate attire"
                  className="w-full px-3.5 py-2.5 rounded-xl bg-black/60 border border-white/15 text-white text-xs focus:border-cyan-400 focus:outline-none transition"
                />
              </div>

              <div className="space-y-1 sm:col-span-2">
                <label className="text-[11px] font-mono text-neutral-300 font-bold block">
                  DETAILED MESSAGE FOR THE HOST <span className="text-rose-400">*</span>
                </label>
                <textarea
                  required
                  rows={3}
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Provide your specific query so the host and secretariat can respond accurately..."
                  className="w-full px-3.5 py-2.5 rounded-xl bg-black/60 border border-white/15 text-white text-xs focus:border-cyan-400 focus:outline-none transition resize-none"
                />
              </div>

              <div className="space-y-1">
                <label className="text-[11px] font-mono text-neutral-300 font-bold block">
                  YOUR FULL NAME
                </label>
                <input
                  type="text"
                  value={attendeeName}
                  onChange={(e) => setAttendeeName(e.target.value)}
                  className="w-full px-3.5 py-2 rounded-xl bg-black/60 border border-white/15 text-white text-xs focus:border-cyan-400 focus:outline-none transition"
                />
              </div>

              <div className="space-y-1">
                <label className="text-[11px] font-mono text-neutral-300 font-bold block">
                  YOUR CONTACT EMAIL <span className="text-rose-400">*</span>
                </label>
                <input
                  type="email"
                  required
                  value={attendeeEmail}
                  onChange={(e) => setAttendeeEmail(e.target.value)}
                  placeholder="delegate@gmail.com"
                  className="w-full px-3.5 py-2 rounded-xl bg-black/60 border border-white/15 text-white text-xs focus:border-cyan-400 focus:outline-none transition"
                />
              </div>

              <div className="space-y-1">
                <label className="text-[11px] font-mono text-neutral-300 font-bold block">
                  URGENCY LEVEL
                </label>
                <select
                  value={priority}
                  onChange={(e) => setPriority(e.target.value as any)}
                  className="w-full px-3.5 py-2 rounded-xl bg-black/60 border border-white/15 text-white text-xs focus:border-cyan-400 focus:outline-none transition"
                >
                  <option value="P3_NORMAL">Normal (Standard inquiry — within 24h)</option>
                  <option value="P2_HIGH">Urgent (Event tomorrow or payment concern — within 8h)</option>
                </select>
              </div>
            </div>

            <div className="flex items-center justify-between pt-2 border-t border-white/10">
              <span className="text-[11px] text-neutral-500 font-mono">
                Your message is routed directly to {event.organizerName}
              </span>

              <button
                type="submit"
                disabled={submittingInquiry}
                className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-cyan-400 via-teal-400 to-indigo-400 text-black font-bold text-xs uppercase tracking-wider transition shadow-[0_0_20px_rgba(6,182,212,0.3)] hover:shadow-[0_0_30px_rgba(6,182,212,0.5)] active:scale-[0.98] flex items-center gap-2 cursor-pointer disabled:opacity-50"
              >
                {submittingInquiry ? (
                  <>
                    <RefreshCw className="w-3.5 h-3.5 animate-spin text-black" />
                    <span>Sending to Host...</span>
                  </>
                ) : (
                  <>
                    <Send className="w-3.5 h-3.5 text-black" />
                    <span>Send Inquiry to Host</span>
                  </>
                )}
              </button>
            </div>
          </form>

          {/* Attendee Past Inquiries List */}
          <div className="space-y-3 pt-2">
            <div className="flex items-center justify-between">
              <span className="text-xs font-mono font-bold text-neutral-300 uppercase tracking-wider flex items-center gap-2">
                <MessageSquare className="w-4 h-4 text-cyan-400" />
                <span>Your Inquiries with this Host ({tickets.length})</span>
              </span>

              <button
                type="button"
                onClick={fetchEventTickets}
                className="text-[11px] font-mono text-neutral-400 hover:text-white flex items-center gap-1 transition"
              >
                <RefreshCw className={`w-3 h-3 ${loadingTickets ? 'animate-spin' : ''}`} />
                <span>Refresh</span>
              </button>
            </div>

            {tickets.length === 0 ? (
              <div className="p-6 rounded-2xl bg-white/[0.02] border border-white/5 text-center text-xs text-neutral-500 font-mono">
                You haven&apos;t sent any direct inquiries to this host yet. Submit the form above to reach them directly!
              </div>
            ) : (
              <div className="space-y-2">
                {tickets.map((t) => (
                  <div
                    key={t.id}
                    onClick={() => loadTicketThread(t.id)}
                    className={`p-4 rounded-2xl border transition cursor-pointer space-y-2 text-xs ${
                      selectedTicket?.id === t.id
                        ? 'bg-cyan-500/10 border-cyan-400/50 text-white'
                        : 'bg-white/[0.02] border-white/10 hover:border-white/20 text-neutral-300'
                    }`}
                  >
                    <div className="flex items-center justify-between gap-2">
                      <div className="flex items-center gap-2">
                        <span className="font-mono text-[10px] text-cyan-300 font-bold">
                          #{t.ticketNumber}
                        </span>
                        <span className="font-bold text-sm text-white truncate">
                          {t.subject}
                        </span>
                      </div>
                      <span className={`px-2 py-0.5 rounded-full font-mono text-[10px] uppercase font-bold border ${STATUS_CONFIG[t.status]?.badge || 'bg-white/10'}`}>
                        {STATUS_CONFIG[t.status]?.label || t.status}
                      </span>
                    </div>

                    <p className="text-xs text-neutral-400 line-clamp-2">
                      {t.description}
                    </p>

                    <div className="flex items-center justify-between text-[10px] font-mono text-neutral-500 pt-1 border-t border-white/5">
                      <span>{t.subcategory || 'General Inquiry'}</span>
                      <span>{new Date(t.createdAt).toLocaleDateString()}</span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      )}

      {/* ═══════════════════════════════════════════════════════════════════ */}
      {/* 2. HOST / SECRETARIAT DESK VIEW: MANAGE AUDIENCE INQUIRIES         */}
      {/* ═══════════════════════════════════════════════════════════════════ */}
      {activePersona === 'HOST' && (
        <div className="space-y-5">
          {/* Host Desk Summary Card */}
          <div className="p-4 rounded-2xl bg-purple-950/20 border border-purple-500/30 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="space-y-1">
              <span className="text-[10px] font-mono text-purple-300 font-bold uppercase tracking-wider block">
                ORGANIZER COMMUNICATIONS DESK
              </span>
              <p className="text-xs text-neutral-300">
                Direct audience inbox for <strong className="text-white">{event.title}</strong>. Respond to attendee inquiries with verified Host authority.
              </p>
            </div>

            <div className="flex items-center gap-2 text-xs font-mono">
              <button
                type="button"
                onClick={() => setHostStatusFilter('ALL')}
                className={`px-2.5 py-1 rounded-lg border transition ${
                  hostStatusFilter === 'ALL'
                    ? 'bg-purple-500/20 border-purple-400 text-purple-200 font-bold'
                    : 'bg-white/5 border-white/10 text-neutral-400'
                }`}
              >
                All ({tickets.length})
              </button>
              <button
                type="button"
                onClick={() => setHostStatusFilter('OPEN')}
                className={`px-2.5 py-1 rounded-lg border transition ${
                  hostStatusFilter === 'OPEN'
                    ? 'bg-amber-500/20 border-amber-400 text-amber-200 font-bold'
                    : 'bg-white/5 border-white/10 text-neutral-400'
                }`}
              >
                Needs Reply ({tickets.filter((t) => t.status !== 'RESOLVED' && t.status !== 'CLOSED').length})
              </button>
              <button
                type="button"
                onClick={() => setHostStatusFilter('RESOLVED')}
                className={`px-2.5 py-1 rounded-lg border transition ${
                  hostStatusFilter === 'RESOLVED'
                    ? 'bg-emerald-500/20 border-emerald-400 text-emerald-200 font-bold'
                    : 'bg-white/5 border-white/10 text-neutral-400'
                }`}
              >
                Resolved ({tickets.filter((t) => t.status === 'RESOLVED' || t.status === 'CLOSED').length})
              </button>
            </div>
          </div>

          {/* Host Inquiries List */}
          <div className="space-y-3">
            {filteredHostTickets.length === 0 ? (
              <div className="p-8 rounded-2xl bg-white/[0.02] border border-white/5 text-center text-xs text-neutral-500 font-mono">
                No audience inquiries matching this filter.
              </div>
            ) : (
              <div className="space-y-2">
                {filteredHostTickets.map((t) => (
                  <div
                    key={t.id}
                    onClick={() => loadTicketThread(t.id)}
                    className={`p-4 rounded-2xl border transition cursor-pointer space-y-2.5 text-xs ${
                      selectedTicket?.id === t.id
                        ? 'bg-purple-500/10 border-purple-400/50 text-white'
                        : 'bg-white/[0.02] border-white/10 hover:border-white/20 text-neutral-300'
                    }`}
                  >
                    <div className="flex items-center justify-between gap-2">
                      <div className="flex items-center gap-2">
                        <span className="font-mono text-[10px] text-purple-300 font-bold">
                          #{t.ticketNumber}
                        </span>
                        <span className="font-bold text-sm text-white truncate">
                          {t.subject}
                        </span>
                      </div>
                      <span className={`px-2 py-0.5 rounded-full font-mono text-[10px] uppercase font-bold border ${STATUS_CONFIG[t.status]?.badge || 'bg-white/10'}`}>
                        {STATUS_CONFIG[t.status]?.label || t.status}
                      </span>
                    </div>

                    <p className="text-xs text-neutral-300 line-clamp-2">
                      {t.description}
                    </p>

                    <div className="flex items-center justify-between text-[11px] font-mono text-neutral-400 pt-1 border-t border-white/5">
                      <span>From: <strong className="text-white">{t.userName}</strong> ({t.userEmail})</span>
                      <span>{new Date(t.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      )}

      {/* ═══════════════════════════════════════════════════════════════════ */}
      {/* 3. ACTIVE THREAD CONVERSATION MODAL / DRAWER                        */}
      {/* ═══════════════════════════════════════════════════════════════════ */}
      {selectedTicket && (
        <div className="p-5 rounded-2xl bg-black border border-cyan-500/40 space-y-4 pt-4">
          <div className="flex items-start justify-between border-b border-white/10 pb-3">
            <div className="space-y-0.5">
              <div className="flex items-center gap-2">
                <span className="text-[10px] font-mono text-cyan-300 font-bold uppercase">
                  CONVERSATION #{selectedTicket.ticketNumber}
                </span>
                <span className={`px-2 py-0.2 rounded-full font-mono text-[9px] uppercase font-bold border ${STATUS_CONFIG[selectedTicket.status]?.badge || 'bg-white/10'}`}>
                  {STATUS_CONFIG[selectedTicket.status]?.label || selectedTicket.status}
                </span>
              </div>
              <h4 className="text-base font-bold text-white">
                {selectedTicket.subject}
              </h4>
            </div>

            <button
              type="button"
              onClick={() => setSelectedTicket(null)}
              className="text-neutral-400 hover:text-white text-xs font-mono p-1"
            >
              Close Thread
            </button>
          </div>

          {/* Original Question Card */}
          <div className="p-3.5 rounded-xl bg-white/[0.03] border border-white/10 text-xs space-y-1">
            <span className="text-[10px] font-mono text-neutral-400 font-bold block">
              INITIAL INQUIRY FROM {selectedTicket.userName} ({selectedTicket.userEmail}):
            </span>
            <p className="text-neutral-200 leading-relaxed font-sans">
              {selectedTicket.description}
            </p>
          </div>

          {/* Message Stream */}
          <div className="space-y-3 max-h-72 overflow-y-auto p-2">
            {loadingThread ? (
              <div className="text-center p-4 text-xs font-mono text-neutral-400">Loading conversation...</div>
            ) : activeThreadMessages.length === 0 ? (
              <div className="text-center p-4 text-xs font-mono text-neutral-500">
                No replies yet. Use the reply box below to communicate directly!
              </div>
            ) : (
              activeThreadMessages.map((msg) => {
                const isHostMsg = msg.senderRole === 'HOST' || msg.senderRole === 'STAFF' || msg.isOfficial;
                return (
                  <div
                    key={msg.id}
                    className={`p-3.5 rounded-xl text-xs space-y-1 ${
                      isHostMsg
                        ? 'bg-purple-950/20 border border-purple-500/30 ml-4'
                        : 'bg-cyan-950/20 border border-cyan-500/30 mr-4'
                    }`}
                  >
                    <div className="flex items-center justify-between text-[10px] font-mono">
                      <span className={`font-bold flex items-center gap-1.5 ${isHostMsg ? 'text-purple-300' : 'text-cyan-300'}`}>
                        {isHostMsg ? <ShieldCheck className="w-3 h-3 text-purple-400" /> : <User className="w-3 h-3 text-cyan-400" />}
                        <span>{msg.senderName}</span>
                        {isHostMsg && <span className="px-1.5 py-0.2 rounded bg-purple-500/20 text-[9px] uppercase font-bold">Host</span>}
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

          {/* Reply Box */}
          <form onSubmit={handleSendMessage} className="flex items-center gap-2 pt-2 border-t border-white/10">
            <input
              type="text"
              required
              value={replyText}
              onChange={(e) => setReplyText(e.target.value)}
              placeholder={activePersona === 'HOST' ? 'Reply as Event Host / Secretariat...' : 'Reply to the host...'}
              className="flex-1 px-3.5 py-2.5 rounded-xl bg-black/60 border border-white/15 text-white text-xs focus:border-cyan-400 focus:outline-none transition"
            />

            <button
              type="submit"
              disabled={sendingReply || !replyText.trim()}
              className="px-4 py-2.5 rounded-xl bg-white hover:bg-neutral-200 text-black font-bold text-xs font-mono transition flex items-center gap-1.5 cursor-pointer disabled:opacity-50"
            >
              {sendingReply ? <RefreshCw className="w-3.5 h-3.5 animate-spin" /> : <Send className="w-3.5 h-3.5" />}
              <span>Send</span>
            </button>
          </form>
        </div>
      )}
    </div>
  );
}
