'use client';

import React, { useState, useEffect } from 'react';
import {
  X,
  LifeBuoy,
  Zap,
  Radio,
  Send,
  CheckCircle2,
  AlertTriangle,
  Clock,
  ShieldCheck,
  RefreshCw,
  Users,
  Mic,
  Gavel,
  ScrollText,
  FileSpreadsheet
} from 'lucide-react';
import { useAuth } from '@/context/AuthContext';
import { useMun } from '@/context/MunContext';
import { SupportTicketItem, SupportMessageItem } from '@/types/support';

interface DaisSupportHotlineModalProps {
  isOpen: boolean;
  onClose: () => void;
  committeeName?: string;
  committeeId?: string;
}

const QUICK_SUMMONS = [
  {
    title: '🏃 Dispatch Page Messenger',
    desc: 'Floor runner needed urgently for chits & papers in chamber',
    category: 'Page Messenger & Chits',
    priority: 'P2_HIGH' as const,
  },
  {
    title: '🚨 Summon Executive Sec-Gen',
    desc: 'Formal Sec-Gen intervention requested on contentious motion or dispute',
    category: 'Dais Floor Emergency',
    priority: 'P1_CRITICAL' as const,
  },
  {
    title: '🎤 Audio / AV Malfunction',
    desc: 'Delegate microphone, podium sound, or screen projector issue',
    category: 'Audio/Visual & Tech',
    priority: 'P2_HIGH' as const,
  },
  {
    title: '📜 ROP / Dais Ruling Dispute',
    desc: 'Delegate appeals Chair ruling; Secretariat interpretation required',
    category: 'Rules of Procedure (ROP)',
    priority: 'P2_HIGH' as const,
  },
  {
    title: '🧮 Quorum Discrepancy',
    desc: 'Roll call tally mismatch or unlisted delegate on matrix',
    category: 'Matrix & Quorum',
    priority: 'P3_NORMAL' as const,
  },
];

export function DaisSupportHotlineModal({
  isOpen,
  onClose,
  committeeName,
  committeeId,
}: DaisSupportHotlineModalProps) {
  const { user, profile } = useAuth();
  const { activeConference, activeCommitteeId, getCommitteeById } = useMun();

  const currentUserId = profile?.id || user?.id || '';
  const currentUserEmail = profile?.email || user?.email || 'dais@zenvitra.gov';
  const currentUserName = (profile as any)?.display_name || user?.name || 'Dais Executive';

  const comm = getCommitteeById(committeeId || activeCommitteeId || '') || null;
  const chamberTitle = committeeName || comm?.name || 'Active Committee Chamber';
  const confId = activeConference?.id || 'GLOBAL_MUN_SESSION';

  const [activeTab, setActiveTab] = useState<'DISPATCH' | 'HISTORY'>('DISPATCH');
  const [chamberTickets, setChamberTickets] = useState<SupportTicketItem[]>([]);
  const [loading, setLoading] = useState(false);
  const [customSubject, setCustomSubject] = useState('');
  const [customDetail, setCustomDetail] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [feedback, setFeedback] = useState<{ type: 'success' | 'error'; message: string } | null>(null);

  // Fetch Tickets for this Chamber
  const fetchChamberTickets = async () => {
    setLoading(true);
    try {
      const url = new URL('/api/support/tickets', window.location.origin);
      url.searchParams.set('category', 'MUN');
      url.searchParams.set('relatedEventId', confId);
      url.searchParams.set('isHost', 'true');

      const res = await fetch(url.toString());
      if (res.ok) {
        const data = await res.json();
        if (data.success && Array.isArray(data.tickets)) {
          // Filter tickets tagged for this chamber
          const matched = data.tickets.filter((t: SupportTicketItem) =>
            t.subject.includes(chamberTitle) || t.description.includes(chamberTitle)
          );
          setChamberTickets(matched.length > 0 ? matched : data.tickets.slice(0, 5));
        }
      }
    } catch (err) {
      console.error('[DAIS_HOTLINE_FETCH_ERROR]', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (isOpen) {
      fetchChamberTickets();
      setFeedback(null);
    }
  }, [isOpen, chamberTitle, confId]);

  // Transmit Quick Summon
  const handleQuickSummon = async (summon: typeof QUICK_SUMMONS[0]) => {
    setIsSubmitting(true);
    setFeedback(null);

    try {
      const payload = {
        subject: `[${chamberTitle}] ${summon.title}`,
        category: 'MUN',
        subcategory: summon.category,
        description: `Chamber: ${chamberTitle}\nRaised by Dais Chair: ${currentUserName}\n\nNotice: ${summon.desc}`,
        priority: summon.priority,
        userId: currentUserId,
        userEmail: currentUserEmail,
        userName: `${currentUserName} (Dais Chair)`,
        relatedEventId: confId,
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
          message: `🚨 Transmitted: ${summon.title} dispatched to central Secretariat!`,
        });
        fetchChamberTickets();
        setActiveTab('HISTORY');
      } else {
        setFeedback({ type: 'error', message: data.error || 'Failed to dispatch summon.' });
      }
    } catch (err: any) {
      setFeedback({ type: 'error', message: err.message || 'Dispatch connection error.' });
    } finally {
      setIsSubmitting(false);
    }
  };

  // Transmit Custom Dispatch
  const handleCustomDispatch = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!customSubject.trim() || !customDetail.trim()) {
      setFeedback({ type: 'error', message: 'Subject and details are required.' });
      return;
    }

    setIsSubmitting(true);
    setFeedback(null);

    try {
      const payload = {
        subject: `[${chamberTitle}] ${customSubject.trim()}`,
        category: 'MUN',
        subcategory: 'Dais Floor Emergency',
        description: `Chamber: ${chamberTitle}\nRaised by Dais Chair: ${currentUserName}\n\n${customDetail.trim()}`,
        priority: 'P2_HIGH',
        userId: currentUserId,
        userEmail: currentUserEmail,
        userName: `${currentUserName} (Dais Chair)`,
        relatedEventId: confId,
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
          message: 'Dais dispatch dispatched to central Secretariat.',
        });
        setCustomSubject('');
        setCustomDetail('');
        fetchChamberTickets();
        setActiveTab('HISTORY');
      } else {
        setFeedback({ type: 'error', message: data.error || 'Failed to dispatch inquiry.' });
      }
    } catch (err: any) {
      setFeedback({ type: 'error', message: err.message || 'Dispatch error.' });
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-in fade-in duration-200">
      <div className="w-full max-w-2xl bg-[#0a0d18] border border-cyan-500/40 rounded-3xl shadow-[0_20px_70px_rgba(0,0,0,0.95)] overflow-hidden flex flex-col max-h-[90vh]">
        {/* Modal Header */}
        <div className="p-5 sm:p-6 bg-gradient-to-r from-[#0d1222] via-[#090b14] to-black border-b border-white/10 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-cyan-500/20 border border-cyan-500/40 flex items-center justify-center text-cyan-300">
              <LifeBuoy className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xs font-black uppercase text-cyan-400 font-mono tracking-wider">
                  DAIS // SECRETARIAT HOTLINE
                </span>
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
              </div>
              <h2 className="text-base sm:text-lg font-black text-white uppercase font-display">
                {chamberTitle}
              </h2>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="p-2 rounded-xl bg-white/5 hover:bg-white/10 text-neutral-400 hover:text-white transition cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tab Switcher */}
        <div className="flex items-center border-b border-white/10 bg-black/40 px-6 pt-2 font-mono text-xs">
          <button
            type="button"
            onClick={() => setActiveTab('DISPATCH')}
            className={`py-3 px-4 font-bold border-b-2 transition cursor-pointer flex items-center gap-2 ${
              activeTab === 'DISPATCH'
                ? 'border-cyan-400 text-cyan-300'
                : 'border-transparent text-neutral-400 hover:text-white'
            }`}
          >
            <Zap className="w-3.5 h-3.5" />
            <span>Instant Floor Summons</span>
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('HISTORY')}
            className={`py-3 px-4 font-bold border-b-2 transition cursor-pointer flex items-center gap-2 ${
              activeTab === 'HISTORY'
                ? 'border-cyan-400 text-cyan-300'
                : 'border-transparent text-neutral-400 hover:text-white'
            }`}
          >
            <Clock className="w-3.5 h-3.5" />
            <span>Active Chamber Dispatches ({chamberTickets.length})</span>
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-6 overflow-y-auto space-y-5 flex-1 text-left">
          {feedback && (
            <div
              className={`p-3.5 rounded-2xl text-xs font-mono flex items-center gap-2 ${
                feedback.type === 'success'
                  ? 'bg-emerald-500/15 border border-emerald-500/30 text-emerald-300'
                  : 'bg-rose-500/15 border border-rose-500/30 text-rose-300'
              }`}
            >
              {feedback.type === 'success' ? <CheckCircle2 className="w-4 h-4" /> : <AlertTriangle className="w-4 h-4" />}
              <span>{feedback.message}</span>
            </div>
          )}

          {activeTab === 'DISPATCH' ? (
            <div className="space-y-6">
              {/* One-Tap Presets */}
              <div className="space-y-2">
                <div className="text-[11px] font-mono text-neutral-400 uppercase tracking-wider font-bold">
                  ONE-TAP EMERGENCY DISPATCHES
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                  {QUICK_SUMMONS.map((summon, idx) => (
                    <button
                      key={idx}
                      type="button"
                      disabled={isSubmitting}
                      onClick={() => handleQuickSummon(summon)}
                      className="p-3.5 rounded-2xl bg-white/[0.03] hover:bg-cyan-500/10 border border-white/10 hover:border-cyan-500/40 text-left transition cursor-pointer group space-y-1 active:scale-95 disabled:opacity-50"
                    >
                      <div className="text-xs font-bold text-white group-hover:text-cyan-300 transition">
                        {summon.title}
                      </div>
                      <div className="text-[11px] text-neutral-400 leading-snug">
                        {summon.desc}
                      </div>
                    </button>
                  ))}
                </div>
              </div>

              {/* Custom Dispatch Form */}
              <form onSubmit={handleCustomDispatch} className="space-y-3 pt-4 border-t border-white/10">
                <div className="text-[11px] font-mono text-neutral-400 uppercase tracking-wider font-bold">
                  CUSTOM INQUIRY OR DISPATCH
                </div>
                <div>
                  <input
                    type="text"
                    value={customSubject}
                    onChange={(e) => setCustomSubject(e.target.value)}
                    placeholder="Brief headline (e.g. Need 20 copies of Resolution 1.1 printed)..."
                    className="w-full bg-[#111422] border border-white/15 rounded-xl px-3.5 py-2 text-xs text-white placeholder-neutral-500 focus:border-cyan-500 focus:outline-none"
                  />
                </div>
                <div>
                  <textarea
                    rows={2}
                    value={customDetail}
                    onChange={(e) => setCustomDetail(e.target.value)}
                    placeholder="Describe specific details for the Secretariat..."
                    className="w-full bg-[#111422] border border-white/15 rounded-xl px-3.5 py-2 text-xs text-white placeholder-neutral-500 focus:border-cyan-500 focus:outline-none resize-none"
                  />
                </div>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full py-2.5 rounded-xl bg-cyan-400 hover:bg-cyan-300 text-black font-display font-bold text-xs uppercase tracking-wider transition cursor-pointer flex items-center justify-center gap-2 disabled:opacity-50"
                >
                  <Send className="w-3.5 h-3.5" />
                  <span>Transmit Custom Dispatch</span>
                </button>
              </form>
            </div>
          ) : (
            <div className="space-y-3">
              {loading ? (
                <div className="p-8 text-center font-mono text-xs text-neutral-400 flex items-center justify-center gap-2">
                  <RefreshCw className="w-4 h-4 animate-spin text-cyan-400" />
                  <span>Loading dispatches for this chamber...</span>
                </div>
              ) : chamberTickets.length === 0 ? (
                <div className="p-8 text-center rounded-2xl bg-white/[0.02] border border-white/10 space-y-2">
                  <CheckCircle2 className="w-8 h-8 text-emerald-400 mx-auto" />
                  <div className="text-xs font-mono text-neutral-300 font-bold uppercase">
                    No active dispatches
                  </div>
                  <p className="text-[11px] text-neutral-400">
                    Use the Instant Floor Summons tab to call for Secretariat or Page support.
                  </p>
                </div>
              ) : (
                chamberTickets.map((t) => (
                  <div
                    key={t.id}
                    className="p-3.5 rounded-2xl bg-white/[0.03] border border-white/10 space-y-2 text-xs font-sans"
                  >
                    <div className="flex items-center justify-between font-mono text-[10px]">
                      <span className="text-cyan-400 font-bold">#{t.ticketNumber}</span>
                      <span
                        className={`px-2 py-0.5 rounded uppercase font-bold text-[9px] ${
                          t.status === 'RESOLVED'
                            ? 'bg-emerald-500/20 text-emerald-300'
                            : 'bg-amber-500/20 text-amber-300'
                        }`}
                      >
                        {t.status}
                      </span>
                    </div>
                    <div className="font-bold text-white text-xs">{t.subject}</div>
                    <p className="text-neutral-400 text-xs leading-relaxed">{t.description}</p>
                    <div className="text-[10px] font-mono text-neutral-500 pt-1 border-t border-white/5 flex items-center justify-between">
                      <span>By: {t.userName}</span>
                      <span>{new Date(t.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                    </div>
                  </div>
                ))
              )}
            </div>
          )}
        </div>

        {/* Modal Footer */}
        <div className="p-4 bg-black/60 border-t border-white/10 flex items-center justify-between font-mono text-[10px] text-neutral-500">
          <span className="flex items-center gap-1.5">
            <ShieldCheck className="w-3.5 h-3.5 text-cyan-400" />
            <span>Direct Secretariat Priority Dispatch Conduit</span>
          </span>
          <button
            type="button"
            onClick={fetchChamberTickets}
            className="text-cyan-400 hover:text-cyan-300 flex items-center gap-1 cursor-pointer"
          >
            <RefreshCw className="w-3 h-3" />
            <span>Refresh</span>
          </button>
        </div>
      </div>
    </div>
  );
}

export default DaisSupportHotlineModal;
