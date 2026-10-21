'use client';

import React, { useState, useEffect, use } from 'react';
import Link from 'next/link';
import { 
  ArrowLeft, 
  Send, 
  Clock, 
  CheckCircle2, 
  AlertCircle, 
  ShieldCheck, 
  MessageSquare, 
  Paperclip, 
  RefreshCw, 
  Sparkles, 
  Star,
  RotateCcw,
  ExternalLink,
  LifeBuoy
} from 'lucide-react';
import { Navbar } from '@/components/layout/Navbar';
import { Footer } from '@/components/layout/Footer';
import { useAuth } from '@/context/AuthContext';
import { 
  SupportTicketItem, 
  CATEGORY_LABELS, 
  STATUS_CONFIG, 
  PRIORITY_CONFIG, 
  TicketCategory, 
  TicketStatus, 
  TicketPriority 
} from '@/types/support';

export default function TicketConversationPage({
  params
}: {
  params: Promise<{ ticketId: string }>;
}) {
  const resolvedParams = use(params);
  const ticketId = resolvedParams.ticketId;
  const { user, profile } = useAuth();

  const [ticket, setTicket] = useState<SupportTicketItem | null>(null);
  const [loading, setLoading] = useState(true);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  // Reply Composer State
  const [replyText, setReplyText] = useState('');
  const [submittingReply, setSubmittingReply] = useState(false);

  // Rating State
  const [rating, setRating] = useState<number>(5);
  const [feedbackComment, setFeedbackComment] = useState('');
  const [ratingSubmitted, setRatingSubmitted] = useState(false);

  const userEmail = profile?.email || user?.email || '';
  const userName = profile?.display_name || user?.name || '';
  const userId = profile?.id || user?.id || '';

  const fetchTicket = async () => {
    try {
      setLoading(true);
      setErrorMsg(null);
      const res = await fetch(`/api/support/tickets/${encodeURIComponent(ticketId)}`);
      const data = await res.json();
      if (data.success && data.ticket) {
        setTicket(data.ticket);
        if (data.ticket.rating) {
          setRating(data.ticket.rating);
          setRatingSubmitted(true);
        }
      } else {
        setErrorMsg(data.error || 'Ticket not found.');
      }
    } catch (e: any) {
      setErrorMsg(e.message || 'Failed to connect to support server.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTicket();
  }, [ticketId]);

  const handleSendReply = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!replyText.trim() || !ticket) return;

    try {
      setSubmittingReply(true);
      const res = await fetch(`/api/support/tickets/${ticket.id}/messages`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          senderId: userId || 'user',
          senderName: userName || userEmail || 'Requester',
          senderRole: 'USER',
          content: replyText.trim(),
          isOfficial: false
        })
      });

      const data = await res.json();
      if (data.success) {
        setReplyText('');
        await fetchTicket();
      }
    } catch (err) {
      console.error(err);
    } finally {
      setSubmittingReply(false);
    }
  };

  const handleReopenTicket = async () => {
    if (!ticket) return;
    try {
      const res = await fetch(`/api/support/tickets/${ticket.id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          status: 'OPEN',
          actorId: userId || 'user',
          actorName: userName || 'Requester',
          actorRole: 'USER'
        })
      });
      const data = await res.json();
      if (data.success) {
        await fetchTicket();
      }
    } catch (e) {
      console.error(e);
    }
  };

  const handleSubmitRating = async () => {
    if (!ticket) return;
    try {
      const res = await fetch(`/api/support/tickets/${ticket.id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          rating,
          feedbackComment: feedbackComment.trim() || null,
          actorId: userId || 'user',
          actorName: userName || 'Requester',
          actorRole: 'USER'
        })
      });
      const data = await res.json();
      if (data.success) {
        setRatingSubmitted(true);
      }
    } catch (e) {
      console.error(e);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#030407] text-white flex flex-col font-mono text-xs items-center justify-center">
        <Navbar />
        <div className="flex flex-col items-center gap-3">
          <RefreshCw className="w-6 h-6 animate-spin text-cyan-400" />
          <span>Decrypting case record {ticketId}...</span>
        </div>
      </div>
    );
  }

  if (errorMsg || !ticket) {
    return (
      <div className="min-h-screen bg-[#030407] text-white flex flex-col font-sans">
        <Navbar />
        <main className="flex-1 max-w-2xl mx-auto px-4 pt-32 pb-16 text-center space-y-4">
          <AlertCircle className="w-12 h-12 text-rose-400 mx-auto" />
          <h1 className="text-xl font-bold font-mono">Case Record Not Found</h1>
          <p className="text-sm text-neutral-400">{errorMsg || 'The requested ticket does not exist or has been archived.'}</p>
          <Link
            href="/support"
            className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-white/10 hover:bg-white/15 text-white font-mono text-xs"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Return to Support Queue</span>
          </Link>
        </main>
        <Footer />
      </div>
    );
  }

  const catMeta = CATEGORY_LABELS[ticket.category as TicketCategory] || { label: ticket.category, team: 'Helpdesk' };
  const statMeta = STATUS_CONFIG[ticket.status as TicketStatus] || { label: ticket.status, badge: 'bg-neutral-800 text-neutral-400' };
  const prioMeta = PRIORITY_CONFIG[ticket.priority as TicketPriority] || { label: ticket.priority, badge: 'bg-white/10 text-neutral-300' };

  let attachments: string[] = [];
  try {
    if (ticket.attachmentUrls) attachments = JSON.parse(ticket.attachmentUrls);
  } catch {}

  return (
    <div className="min-h-screen bg-[#030407] text-white flex flex-col font-sans selection:bg-cyan-500/30">
      <Navbar />

      <main className="flex-1 max-w-5xl w-full mx-auto px-4 sm:px-6 lg:px-8 pt-24 pb-16 space-y-6">
        
        {/* Navigation Breadcrumb */}
        <div className="flex items-center justify-between text-xs font-mono text-neutral-400">
          <Link href="/support" className="hover:text-cyan-400 transition flex items-center gap-1">
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>All Support Tickets</span>
          </Link>
          <div className="flex items-center gap-2">
            <span className="text-neutral-500">Case ID:</span>
            <span className="text-cyan-300 font-bold">{ticket.ticketNumber}</span>
          </div>
        </div>

        {/* Ticket Header & Status Banner */}
        <div className="p-6 rounded-3xl bg-black/60 border border-white/10 space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-white/10 pb-4">
            <div className="space-y-1">
              <div className="flex flex-wrap items-center gap-2">
                <span className="text-xs font-mono font-bold text-cyan-400 px-2.5 py-0.5 rounded bg-cyan-500/10 border border-cyan-500/20">
                  {ticket.ticketNumber}
                </span>
                <span className={`text-[10px] font-mono px-2.5 py-0.5 rounded border font-bold ${statMeta.badge}`}>
                  {statMeta.label}
                </span>
                <span className={`text-[10px] font-mono px-2 py-0.5 rounded border ${prioMeta.badge}`}>
                  {prioMeta.label.split('—')[0]}
                </span>
                <span className="text-xs font-mono text-neutral-400">
                  &bull; {catMeta.label}
                </span>
              </div>
              <h1 className="text-xl sm:text-2xl font-bold font-display text-white mt-1">
                {ticket.subject}
              </h1>
            </div>

            <div className="text-right sm:self-center font-mono text-xs">
              <span className="text-[10px] text-neutral-500 block uppercase">Assigned Team</span>
              <span className="text-cyan-300 font-bold">{ticket.assignedTeam || catMeta.team}</span>
            </div>
          </div>

          {/* Context Details Grid */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-[11px] font-mono">
            <div className="p-3 rounded-xl bg-white/[0.02] border border-white/5 space-y-0.5">
              <span className="text-[9px] text-neutral-500 uppercase">SUBMITTED ON</span>
              <div className="text-white font-bold">{new Date(ticket.createdAt).toLocaleDateString([], { month: 'short', day: 'numeric', year: 'numeric' })}</div>
            </div>
            <div className="p-3 rounded-xl bg-white/[0.02] border border-white/5 space-y-0.5">
              <span className="text-[9px] text-neutral-500 uppercase">STATUS UPDATED</span>
              <div className="text-white font-bold">{new Date(ticket.updatedAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</div>
            </div>
            <div className="p-3 rounded-xl bg-white/[0.02] border border-white/5 space-y-0.5">
              <span className="text-[9px] text-neutral-500 uppercase">EVENT REFERENCE</span>
              <div className="text-cyan-400 font-bold truncate">{ticket.relatedEventId || 'None'}</div>
            </div>
            <div className="p-3 rounded-xl bg-white/[0.02] border border-white/5 space-y-0.5">
              <span className="text-[9px] text-neutral-500 uppercase">PAYMENT TXN</span>
              <div className="text-emerald-400 font-bold truncate">{ticket.relatedTxnId || 'None'}</div>
            </div>
          </div>

          {/* Original Issue Description */}
          <div className="p-4 rounded-2xl bg-white/[0.02] border border-white/5 space-y-1.5 text-xs">
            <span className="text-[10px] font-mono uppercase text-neutral-400 font-bold block">
              Case Inquiry Scope
            </span>
            <p className="text-neutral-300 font-sans leading-relaxed whitespace-pre-wrap">
              {ticket.description}
            </p>
          </div>

          {/* Attachments */}
          {attachments.length > 0 && (
            <div className="space-y-1.5 pt-1">
              <span className="text-[10px] font-mono uppercase text-neutral-400 block">
                Evidence Attachments ({attachments.length})
              </span>
              <div className="flex flex-wrap gap-2">
                {attachments.map((url, i) => (
                  <a
                    key={i}
                    href={url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="px-3 py-1.5 rounded-xl bg-cyan-950/40 border border-cyan-500/30 text-cyan-300 text-xs font-mono flex items-center gap-1.5 hover:bg-cyan-900/40 transition"
                  >
                    <Paperclip className="w-3.5 h-3.5" />
                    <span className="truncate max-w-xs">{url}</span>
                    <ExternalLink className="w-3 h-3 ml-1 text-cyan-400" />
                  </a>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Dynamic Action Callout */}
        {ticket.status === 'WAITING_USER' && (
          <div className="p-4 rounded-2xl bg-purple-500/10 border border-purple-500/30 flex items-start gap-3 text-xs text-purple-200">
            <Clock className="w-5 h-5 text-purple-400 shrink-0 mt-0.5" />
            <div className="space-y-0.5">
              <strong className="text-white font-mono font-bold block">Action Required from You</strong>
              <p className="text-neutral-300 font-sans">
                A support specialist has reviewed your case and requested additional confirmation or details. Please reply below to proceed.
              </p>
            </div>
          </div>
        )}

        {ticket.status === 'RESOLVED' && (
          <div className="p-4 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs text-emerald-200">
            <div className="flex items-start gap-3">
              <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0 mt-0.5" />
              <div>
                <strong className="text-white font-mono font-bold block">Case Solution Provided</strong>
                <p className="text-neutral-300 font-sans">
                  {ticket.resolutionSummary || 'This ticket has been marked as resolved by our operations desk.'}
                </p>
              </div>
            </div>

            <button
              onClick={handleReopenTicket}
              className="px-3.5 py-1.5 rounded-xl bg-white/10 hover:bg-white/15 text-white font-mono text-xs flex items-center gap-1.5 cursor-pointer shrink-0"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>Reopen Ticket</span>
            </button>
          </div>
        )}

        {/* Conversation Message Stream */}
        <div className="space-y-3">
          <div className="flex items-center justify-between text-xs text-neutral-400 font-mono px-1">
            <span>OFFICIAL TRANSCRIPT ({ticket.messages?.length || 0})</span>
            <span>END-TO-END TIMESTAMPS</span>
          </div>

          <div className="space-y-4">
            {ticket.messages && ticket.messages.length > 0 ? (
              ticket.messages.map((msg) => {
                const isStaff = msg.senderRole === 'STAFF' || msg.senderRole === 'ADMIN' || msg.senderRole === 'FOUNDER';
                return (
                  <div
                    key={msg.id}
                    className={`p-5 rounded-3xl border space-y-2 transition ${
                      isStaff
                        ? 'bg-[#070b14] border-cyan-500/30 ml-4 sm:ml-12'
                        : 'bg-black/50 border-white/10 mr-4 sm:mr-12'
                    }`}
                  >
                    <div className="flex items-center justify-between text-xs">
                      <div className="flex items-center gap-2">
                        {isStaff ? (
                          <span className="w-2 h-2 rounded-full bg-cyan-400" />
                        ) : (
                          <span className="w-2 h-2 rounded-full bg-neutral-400" />
                        )}
                        <span className="font-bold font-mono text-white">
                          {msg.senderName}
                        </span>
                        {isStaff && (
                          <span className="text-[10px] font-mono px-2 py-0.2 rounded bg-cyan-500/20 text-cyan-300 font-bold border border-cyan-500/30">
                            OFFICIAL STAFF
                          </span>
                        )}
                      </div>
                      <span className="text-[10px] font-mono text-neutral-500">
                        {new Date(msg.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })} &bull; {new Date(msg.createdAt).toLocaleDateString([], { month: 'short', day: 'numeric' })}
                      </span>
                    </div>

                    <p className="text-xs text-neutral-200 font-sans leading-relaxed whitespace-pre-wrap">
                      {msg.content}
                    </p>
                  </div>
                );
              })
            ) : (
              <div className="p-8 text-center rounded-2xl bg-black/40 border border-white/5 text-neutral-500 text-xs font-mono">
                No follow-up messages recorded yet.
              </div>
            )}
          </div>
        </div>

        {/* Reply Box (If not closed) */}
        {ticket.status !== 'CLOSED' && (
          <form onSubmit={handleSendReply} className="p-5 rounded-3xl bg-black/60 border border-white/10 space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-mono uppercase text-neutral-300 font-bold flex items-center gap-2">
                <MessageSquare className="w-4 h-4 text-cyan-400" />
                <span>Post Reply to Support Desk</span>
              </span>
              <span className="text-[10px] font-mono text-neutral-500">Encrypted in Transit</span>
            </div>

            <textarea
              rows={3}
              value={replyText}
              onChange={(e) => setReplyText(e.target.value)}
              placeholder="Type your response to the support specialist..."
              className="w-full p-4 rounded-2xl bg-white/5 border border-white/10 text-xs text-white placeholder-neutral-500 focus:outline-none focus:border-cyan-500 font-sans leading-relaxed"
            />

            <div className="flex items-center justify-end">
              <button
                type="submit"
                disabled={submittingReply || !replyText.trim()}
                className="px-5 py-2.5 rounded-2xl bg-gradient-to-r from-cyan-500 to-teal-500 hover:from-cyan-400 hover:to-teal-400 text-neutral-950 font-bold font-mono text-xs shadow-md shadow-cyan-500/20 transition flex items-center gap-2 cursor-pointer disabled:opacity-40"
              >
                <Send className="w-3.5 h-3.5" />
                <span>{submittingReply ? 'Transmitting...' : 'Send Message'}</span>
              </button>
            </div>
          </form>
        )}

        {/* Resolution Rating Box (if resolved) */}
        {ticket.status === 'RESOLVED' && (
          <div className="p-6 rounded-3xl bg-gradient-to-r from-emerald-950/30 to-black border border-emerald-500/30 space-y-4">
            <div className="flex items-center gap-2 text-emerald-300 font-mono text-xs font-bold">
              <Sparkles className="w-4 h-4 text-emerald-400" />
              <span>How was your support experience?</span>
            </div>

            {ratingSubmitted ? (
              <div className="text-xs text-neutral-300 font-sans flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                <span>Thank you! Your feedback has been recorded into our service quality logs.</span>
              </div>
            ) : (
              <div className="space-y-3 font-sans text-xs">
                <div className="flex items-center gap-2">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <button
                      key={star}
                      type="button"
                      onClick={() => setRating(star)}
                      className={`p-2 rounded-xl transition ${
                        rating >= star ? 'text-amber-400 bg-amber-400/10' : 'text-neutral-600 hover:text-neutral-400'
                      }`}
                    >
                      <Star className="w-5 h-5 fill-current" />
                    </button>
                  ))}
                  <span className="text-neutral-400 font-mono text-xs ml-2">({rating}/5 stars)</span>
                </div>

                <input
                  type="text"
                  value={feedbackComment}
                  onChange={(e) => setFeedbackComment(e.target.value)}
                  placeholder="Optional feedback comment on response speed or helpfulness..."
                  className="w-full px-4 py-2 rounded-xl bg-white/5 border border-white/10 text-xs text-white placeholder-neutral-500 focus:outline-none focus:border-emerald-500"
                />

                <button
                  type="button"
                  onClick={handleSubmitRating}
                  className="px-4 py-2 rounded-xl bg-emerald-500/20 hover:bg-emerald-500/30 text-emerald-300 font-mono text-xs font-bold transition cursor-pointer"
                >
                  Submit Review
                </button>
              </div>
            )}
          </div>
        )}

      </main>

      <Footer />
    </div>
  );
}
