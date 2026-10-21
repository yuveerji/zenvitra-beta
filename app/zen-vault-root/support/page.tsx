'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { 
  Crown, 
  ShieldAlert, 
  Sliders, 
  Activity, 
  Clock, 
  CheckCircle2, 
  AlertTriangle, 
  FileText, 
  RefreshCw, 
  Check, 
  X, 
  ArrowLeft, 
  Lock,
  Send,
  Eye,
  Sparkles,
  LifeBuoy,
  CreditCard
} from 'lucide-react';
import { useAuth } from '@/context/AuthContext';
import { 
  SupportTicketItem, 
  SupportPolicyData, 
  STATUS_CONFIG, 
  PRIORITY_CONFIG, 
  TicketStatus, 
  TicketPriority 
} from '@/types/support';

export default function FounderSupportOversightPage() {
  const { user, profile } = useAuth();
  const founderName = profile?.display_name || user?.name || '@yuveer (Founder)';

  const [tickets, setTickets] = useState<SupportTicketItem[]>([]);
  const [policy, setPolicy] = useState<SupportPolicyData | null>(null);
  const [loading, setLoading] = useState(true);
  const [savingPolicy, setSavingPolicy] = useState(false);
  const [policySuccess, setPolicySuccess] = useState(false);

  // Policy Form State
  const [p1Hours, setP1Hours] = useState(2);
  const [p2Hours, setP2Hours] = useState(8);
  const [p3Hours, setP3Hours] = useState(24);
  const [p4Hours, setP4Hours] = useState(72);
  const [autoCloseDays, setAutoCloseDays] = useState(5);
  const [maintenanceNotice, setMaintenanceNotice] = useState('');

  // Founder Ruling Modal
  const [rulingTicket, setRulingTicket] = useState<SupportTicketItem | null>(null);
  const [rulingNote, setRulingNote] = useState('');
  const [rulingAction, setRulingAction] = useState<'RESOLVE' | 'REJECT' | 'REASSIGN'>('RESOLVE');
  const [submittingRuling, setSubmittingRuling] = useState(false);

  const fetchData = async () => {
    try {
      setLoading(true);
      const [tRes, pRes] = await Promise.all([
        fetch('/api/support/tickets?isStaff=true'),
        fetch('/api/support/policy')
      ]);

      const tData = await tRes.json();
      const pData = await pRes.json();

      if (tData.success && Array.isArray(tData.tickets)) {
        setTickets(tData.tickets);
      }

      if (pData.success && pData.policy) {
        setPolicy(pData.policy);
        setP1Hours(pData.policy.p1SlaHours);
        setP2Hours(pData.policy.p2SlaHours);
        setP3Hours(pData.policy.p3SlaHours);
        setP4Hours(pData.policy.p4SlaHours);
        setAutoCloseDays(pData.policy.autoCloseDays);
        setMaintenanceNotice(pData.policy.maintenanceNotice || '');
      }
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleSavePolicy = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      setSavingPolicy(true);
      const res = await fetch('/api/support/policy', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          p1SlaHours: p1Hours,
          p2SlaHours: p2Hours,
          p3SlaHours: p3Hours,
          p4SlaHours: p4Hours,
          autoCloseDays,
          maintenanceNotice: maintenanceNotice.trim() || null
        })
      });
      const data = await res.json();
      if (data.success) {
        setPolicySuccess(true);
        setTimeout(() => setPolicySuccess(false), 3000);
      }
    } catch (e) {
      console.error(e);
    } finally {
      setSavingPolicy(false);
    }
  };

  const handleFounderRuling = async () => {
    if (!rulingTicket) return;
    try {
      setSubmittingRuling(true);

      // Add Founder note
      if (rulingNote.trim()) {
        await fetch(`/api/support/tickets/${rulingTicket.id}/notes`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            authorId: 'founder_root',
            authorName: founderName,
            authorRole: 'FOUNDER',
            note: `👑 FOUNDER EXECUTIVE DIRECTIVE: ${rulingNote.trim()}`
          })
        });
      }

      // Update status
      let nextStatus = rulingTicket.status;
      let resolutionSummary = null;
      let resolutionCode = null;

      if (rulingAction === 'RESOLVE') {
        nextStatus = 'RESOLVED';
        resolutionSummary = `Approved under Founder Executive Authority: ${rulingNote || 'Directive issued.'}`;
        resolutionCode = 'RESOLVED_CONFIRMED';
      } else if (rulingAction === 'REJECT') {
        nextStatus = 'CLOSED';
        resolutionSummary = `Dismissed upon Founder Level-0 review: ${rulingNote || 'Appeal rejected.'}`;
        resolutionCode = 'CANCELLED_BY_USER';
      } else if (rulingAction === 'REASSIGN') {
        nextStatus = 'IN_PROGRESS';
      }

      await fetch(`/api/support/tickets/${rulingTicket.id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          status: nextStatus,
          resolutionSummary,
          resolutionCode,
          actorId: 'founder_root',
          actorName: founderName,
          actorRole: 'FOUNDER'
        })
      });

      setRulingTicket(null);
      setRulingNote('');
      await fetchData();
    } catch (e) {
      console.error(e);
    } finally {
      setSubmittingRuling(false);
    }
  };

  // Metrics
  const escalatedTickets = tickets.filter(t => t.status === 'ESCALATED' || t.escalatedTo === 'FOUNDER');
  const openCount = tickets.filter(t => t.status === 'NEW' || t.status === 'OPEN' || t.status === 'IN_PROGRESS' || t.status === 'ESCALATED').length;
  const resolvedCount = tickets.filter(t => t.status === 'RESOLVED' || t.status === 'CLOSED').length;
  const totalCount = tickets.length;
  const slaRate = totalCount > 0 ? Math.round((resolvedCount / totalCount) * 100) : 100;

  return (
    <div className="space-y-8 font-mono text-xs text-white max-w-7xl mx-auto">
      
      {/* Top Banner */}
      <div className="p-5 sm:p-6 rounded-3xl bg-gradient-to-r from-amber-950/40 via-neutral-900 to-rose-950/40 border border-amber-500/30 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="w-11 h-11 rounded-2xl bg-amber-500/20 border border-amber-500/40 flex items-center justify-center text-amber-400 shrink-0">
            <Crown className="w-6 h-6" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="font-bold text-base text-white">ZEN.FOUNDER &bull; SERVICE OVERSIGHT</h1>
              <span className="text-[10px] px-2 py-0.5 rounded bg-amber-500/20 text-amber-300 font-bold border border-amber-500/30">
                LEVEL 0 AUTHORITY
              </span>
            </div>
            <p className="text-[11px] text-neutral-400 font-sans mt-0.5">
              Platform-wide SLA compliance, Level-0 escalation rulings, global policy governance, and full service audit logs.
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <Link
            href="/core-team-panel/support"
            className="px-3.5 py-2 rounded-xl bg-white/5 hover:bg-white/10 text-neutral-300 hover:text-white border border-white/10 transition text-xs"
          >
            &larr; Staff Operations Desk
          </Link>
          <button
            type="button"
            onClick={fetchData}
            className="p-2 rounded-xl bg-white/5 hover:bg-white/10 text-neutral-400 hover:text-white border border-white/10 transition"
            title="Refresh"
          >
            <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
          </button>
        </div>
      </div>

      {/* 4 Core Platform Metrics */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="p-4 rounded-2xl bg-black/60 border border-amber-500/30 space-y-1">
          <div className="flex items-center justify-between text-[10px] text-neutral-400 uppercase">
            <span>Critical Escalations</span>
            <ShieldAlert className="w-4 h-4 text-rose-400" />
          </div>
          <div className="text-3xl font-black text-rose-400">{escalatedTickets.length}</div>
          <span className="text-[10px] text-neutral-500 block">Pending Founder ruling</span>
        </div>

        <div className="p-4 rounded-2xl bg-black/60 border border-white/10 space-y-1">
          <div className="flex items-center justify-between text-[10px] text-neutral-400 uppercase">
            <span>Active Case Backlog</span>
            <Activity className="w-4 h-4 text-cyan-400" />
          </div>
          <div className="text-3xl font-black text-cyan-300">{openCount}</div>
          <span className="text-[10px] text-neutral-500 block">Open across all queues</span>
        </div>

        <div className="p-4 rounded-2xl bg-black/60 border border-white/10 space-y-1">
          <div className="flex items-center justify-between text-[10px] text-neutral-400 uppercase">
            <span>SLA Compliance Rate</span>
            <CheckCircle2 className="w-4 h-4 text-emerald-400" />
          </div>
          <div className="text-3xl font-black text-emerald-400">{slaRate}%</div>
          <span className="text-[10px] text-neutral-500 block">Resolved within target</span>
        </div>

        <div className="p-4 rounded-2xl bg-black/60 border border-white/10 space-y-1">
          <div className="flex items-center justify-between text-[10px] text-neutral-400 uppercase">
            <span>Lifetime Case Intake</span>
            <FileText className="w-4 h-4 text-neutral-400" />
          </div>
          <div className="text-3xl font-black text-white">{totalCount}</div>
          <span className="text-[10px] text-neutral-500 block">Audited tickets</span>
        </div>
      </div>

      {/* Critical Escalations Desk */}
      <div className="p-6 rounded-3xl bg-black/60 border border-rose-500/30 space-y-4">
        <div className="flex items-center justify-between border-b border-white/10 pb-3">
          <div className="flex items-center gap-2 text-rose-400 font-bold">
            <ShieldAlert className="w-5 h-5" />
            <span className="text-sm">LEVEL 0 FOUNDER ESCALATION QUEUE</span>
          </div>
          <span className="text-[10px] px-2 py-0.5 rounded bg-rose-500/20 text-rose-300 font-bold">
            {escalatedTickets.length} REQUIRES EXECUTIVE DECISION
          </span>
        </div>

        {escalatedTickets.length === 0 ? (
          <div className="p-8 text-center text-neutral-500 text-xs font-sans">
            No escalated cases currently awaiting Founder-level review. All staff queues operating within delegated limits.
          </div>
        ) : (
          <div className="space-y-3">
            {escalatedTickets.map((t) => (
              <div
                key={t.id}
                className="p-5 rounded-2xl bg-rose-950/20 border border-rose-500/30 flex flex-col md:flex-row md:items-center justify-between gap-4"
              >
                <div className="space-y-1.5 max-w-2xl">
                  <div className="flex items-center gap-2">
                    <span className="text-rose-400 font-bold">{t.ticketNumber}</span>
                    <span className="text-[10px] px-2 py-0.2 rounded bg-rose-500/20 text-rose-300 font-bold border border-rose-500/30">
                      ESCALATED TO FOUNDER
                    </span>
                    <span className="text-neutral-400 text-[10px]">
                      &bull; Category: {t.category}
                    </span>
                  </div>

                  <h3 className="text-sm font-bold text-white font-sans">{t.subject}</h3>
                  
                  {t.escalationReason && (
                    <div className="p-3 rounded-xl bg-black/60 border border-rose-500/20 text-rose-200 text-xs font-sans">
                      <strong className="font-mono text-rose-400 block text-[10px]">STAFF ESCALATION REASON:</strong>
                      {t.escalationReason}
                    </div>
                  )}

                  <div className="text-[10px] text-neutral-400">
                    Requester: {t.userName} ({t.userEmail}) &bull; Submitted {new Date(t.createdAt).toLocaleDateString()}
                  </div>
                </div>

                <div className="flex items-center gap-2 shrink-0">
                  <button
                    type="button"
                    onClick={() => {
                      setRulingTicket(t);
                      setRulingAction('RESOLVE');
                    }}
                    className="px-4 py-2 rounded-xl bg-amber-500 hover:bg-amber-400 text-neutral-950 font-bold text-xs flex items-center gap-1.5 cursor-pointer shadow-md shadow-amber-500/20"
                  >
                    <Crown className="w-3.5 h-3.5" />
                    <span>Issue Founder Ruling</span>
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Global Support Policy & SLA Configuration Form */}
      <div className="p-6 rounded-3xl bg-black/60 border border-amber-500/30 space-y-6">
        <div className="flex items-center justify-between border-b border-white/10 pb-3">
          <div className="flex items-center gap-2 text-amber-300 font-bold">
            <Sliders className="w-5 h-5 text-amber-400" />
            <span className="text-sm">GLOBAL SUPPORT POLICY &amp; SLA TARGETS</span>
          </div>
          <span className="text-[10px] text-neutral-500">MASTER CONFIGURATION</span>
        </div>

        <form onSubmit={handleSavePolicy} className="space-y-5 font-sans text-xs">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="space-y-1.5 p-3.5 rounded-2xl bg-white/[0.02] border border-white/5">
              <label className="text-[10px] font-mono uppercase text-neutral-400 font-bold block">
                P1 Critical SLA (Hours)
              </label>
              <input
                type="number"
                min="1"
                max="24"
                value={p1Hours}
                onChange={(e) => setP1Hours(Number(e.target.value))}
                className="w-full px-3 py-2 rounded-xl bg-black/60 border border-white/10 text-white font-mono text-xs focus:outline-none focus:border-amber-400"
              />
              <span className="text-[9px] text-neutral-500 block">Outage or safety hazard target</span>
            </div>

            <div className="space-y-1.5 p-3.5 rounded-2xl bg-white/[0.02] border border-white/5">
              <label className="text-[10px] font-mono uppercase text-neutral-400 font-bold block">
                P2 High SLA (Hours)
              </label>
              <input
                type="number"
                min="2"
                max="48"
                value={p2Hours}
                onChange={(e) => setP2Hours(Number(e.target.value))}
                className="w-full px-3 py-2 rounded-xl bg-black/60 border border-white/10 text-white font-mono text-xs focus:outline-none focus:border-amber-400"
              />
              <span className="text-[9px] text-neutral-500 block">Major payment or event failure</span>
            </div>

            <div className="space-y-1.5 p-3.5 rounded-2xl bg-white/[0.02] border border-white/5">
              <label className="text-[10px] font-mono uppercase text-neutral-400 font-bold block">
                P3 Normal SLA (Hours)
              </label>
              <input
                type="number"
                min="4"
                max="96"
                value={p3Hours}
                onChange={(e) => setP3Hours(Number(e.target.value))}
                className="w-full px-3 py-2 rounded-xl bg-black/60 border border-white/10 text-white font-mono text-xs focus:outline-none focus:border-amber-400"
              />
              <span className="text-[9px] text-neutral-500 block">Standard delegate inquiry target</span>
            </div>

            <div className="space-y-1.5 p-3.5 rounded-2xl bg-white/[0.02] border border-white/5">
              <label className="text-[10px] font-mono uppercase text-neutral-400 font-bold block">
                Auto-Close Inactivity (Days)
              </label>
              <input
                type="number"
                min="1"
                max="30"
                value={autoCloseDays}
                onChange={(e) => setAutoCloseDays(Number(e.target.value))}
                className="w-full px-3 py-2 rounded-xl bg-black/60 border border-white/10 text-white font-mono text-xs focus:outline-none focus:border-amber-400"
              />
              <span className="text-[9px] text-neutral-500 block">Waiting on user before archive</span>
            </div>
          </div>

          <div className="space-y-1.5">
            <label className="text-[10px] font-mono uppercase text-neutral-400 font-bold block">
              Platform-Wide Emergency Support Notice / Planned Maintenance Banner
            </label>
            <input
              type="text"
              value={maintenanceNotice}
              onChange={(e) => setMaintenanceNotice(e.target.value)}
              placeholder="e.g. Scheduled gateway maintenance on Sunday 02:00-04:00 AM IST. Pass bookings remain queued."
              className="w-full px-4 py-2.5 rounded-xl bg-white/5 border border-white/10 text-white placeholder-neutral-500 text-xs focus:outline-none focus:border-amber-400 font-sans"
            />
          </div>

          <div className="flex items-center justify-between pt-2">
            {policySuccess ? (
              <span className="text-emerald-400 font-mono text-xs flex items-center gap-1.5">
                <Check className="w-4 h-4" />
                <span>Global support policies updated and synchronized!</span>
              </span>
            ) : (
              <span className="text-neutral-500 font-mono text-[11px]">
                Enforced server-side across all support routes.
              </span>
            )}

            <button
              type="submit"
              disabled={savingPolicy}
              className="px-5 py-2.5 rounded-2xl bg-amber-500 hover:bg-amber-400 text-neutral-950 font-bold font-mono text-xs flex items-center gap-2 cursor-pointer shadow-lg shadow-amber-500/20"
            >
              <Sliders className="w-4 h-4" />
              <span>{savingPolicy ? 'Committing...' : 'Save Global Policy'}</span>
            </button>
          </div>
        </form>
      </div>

      {/* Founder Ruling Modal */}
      {rulingTicket && (
        <div className="fixed inset-0 z-[200] flex items-center justify-center p-4 bg-black/85 backdrop-blur-md">
          <div className="w-full max-w-lg p-6 rounded-3xl bg-[#090b14] border border-amber-500/50 space-y-4 font-sans text-xs">
            <div className="flex items-center justify-between border-b border-white/10 pb-3">
              <span className="font-bold text-sm text-amber-300 font-mono flex items-center gap-2">
                <Crown className="w-4 h-4 text-amber-400" />
                <span>Founder Level-0 Executive Ruling &bull; {rulingTicket.ticketNumber}</span>
              </span>
              <button onClick={() => setRulingTicket(null)} className="text-neutral-400 hover:text-white">
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="p-3 rounded-2xl bg-black/50 border border-white/10 space-y-1">
              <span className="text-neutral-400 text-[10px] font-mono block">SUBJECT</span>
              <div className="font-bold text-white">{rulingTicket.subject}</div>
              <p className="text-neutral-300 text-[11px] pt-1">{rulingTicket.description}</p>
            </div>

            <div className="space-y-3">
              <div>
                <label className="text-[10px] font-mono uppercase text-neutral-400 block mb-1">
                  Founder Decision Action
                </label>
                <select
                  value={rulingAction}
                  onChange={(e) => setRulingAction(e.target.value as any)}
                  className="w-full p-2.5 rounded-xl bg-white/5 border border-white/10 text-white font-mono text-xs focus:outline-none focus:border-amber-400"
                >
                  <option value="RESOLVE" className="bg-neutral-900">👑 Grant Special Authority &amp; Mark Resolved</option>
                  <option value="REJECT" className="bg-neutral-900">⛔ Dismiss Appeal &amp; Close Case Permanently</option>
                  <option value="REASSIGN" className="bg-neutral-900">↩️ Remand Case to Senior Staff with Directives</option>
                </select>
              </div>

              <div>
                <label className="text-[10px] font-mono uppercase text-neutral-400 block mb-1">
                  Executive Directive / Ruling Notes
                </label>
                <textarea
                  rows={4}
                  value={rulingNote}
                  onChange={(e) => setRulingNote(e.target.value)}
                  placeholder="State the founder directive (e.g. Authorized 100% refund on txn CF-9042; delegate reinstated to UNSC chamber)..."
                  className="w-full p-3 rounded-xl bg-white/5 border border-white/10 text-white placeholder-neutral-500 text-xs focus:outline-none focus:border-amber-400 leading-relaxed"
                />
              </div>
            </div>

            <div className="flex items-center justify-end gap-2 pt-2 border-t border-white/10">
              <button
                type="button"
                onClick={() => setRulingTicket(null)}
                className="px-4 py-2 rounded-xl bg-white/5 hover:bg-white/10 text-neutral-300 text-xs"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleFounderRuling}
                disabled={submittingRuling}
                className="px-5 py-2 rounded-xl bg-amber-500 hover:bg-amber-400 text-neutral-950 font-bold text-xs flex items-center gap-1.5"
              >
                <Crown className="w-3.5 h-3.5" />
                <span>{submittingRuling ? 'Enforcing...' : 'Enforce Ruling'}</span>
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
