'use client';

import React, { useState, useEffect } from 'react';
import {
  FileSpreadsheet,
  RefreshCw,
  ExternalLink,
  ShieldCheck,
  AlertTriangle,
  CheckCircle2,
  Clock,
  Layers,
  ArrowRight,
  Code,
  Copy,
  Check,
  HelpCircle,
  AlertCircle,
  Pause,
  Play,
  RotateCcw,
  Sparkles,
  Database,
  Lock,
  ChevronDown,
  ChevronUp,
  Zap
} from 'lucide-react';
import { GoogleAccountGuideModal } from './GoogleAccountGuideModal';
import { ConnectSheetModal } from './ConnectSheetModal';

interface ZenSheetsWorkspaceProps {
  eventId: string;
  eventTitle: string;
}

export function ZenSheetsWorkspace({ eventId, eventTitle }: ZenSheetsWorkspaceProps) {
  const [loading, setLoading] = useState<boolean>(true);
  const [data, setData] = useState<any>(null);
  const [activeSubTab, setActiveSubTab] = useState<'tabs' | 'conflicts' | 'policies' | 'audit'>('tabs');
  const [isSyncing, setIsSyncing] = useState<boolean>(false);
  const [isReconciling, setIsReconciling] = useState<boolean>(false);
  const [syncFeedback, setSyncFeedback] = useState<string | null>(null);

  // Modals & Drawers
  const [showConnectModal, setShowConnectModal] = useState<boolean>(false);
  const [showAppsScriptModal, setShowAppsScriptModal] = useState<boolean>(false);
  const [showGoogleGuideModal, setShowGoogleGuideModal] = useState<boolean>(false);
  const [copiedScript, setCopiedScript] = useState<boolean>(false);
  const [copiedEndpoint, setCopiedEndpoint] = useState<boolean>(false);

  // Conflict Resolution
  const [resolvingId, setResolvingId] = useState<string | null>(null);
  const [selectedTemplate, setSelectedTemplate] = useState<string>('CONFERENCE');

  const fetchConfig = async () => {
    try {
      setLoading(true);
      const res = await fetch(`/api/events/sheets/config?eventId=${encodeURIComponent(eventId)}`);
      const json = await res.json();
      if (json.success) {
        setData(json);
        if (json.workbook?.templateKey) setSelectedTemplate(json.workbook.templateKey);
      }
    } catch (err) {
      console.error('Failed to load sheets config', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (eventId) fetchConfig();
  }, [eventId]);

  const handleOutboundSync = async () => {
    try {
      setIsSyncing(true);
      setSyncFeedback(null);
      const res = await fetch('/api/events/sheets/sync', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ eventId, mode: 'OUTBOUND' }),
      });
      const json = await res.json();
      if (json.success) {
        setSyncFeedback(`Successfully synchronized ${json.result?.syncedRecords || 0} records across 12 tabs.`);
        await fetchConfig();
      } else {
        setSyncFeedback(json.error || 'Failed to sync with Google Sheets.');
      }
    } catch (_) {
      setSyncFeedback('Network error during synchronization.');
    } finally {
      setIsSyncing(false);
    }
  };

  const handleReconcile = async () => {
    try {
      setIsReconciling(true);
      setSyncFeedback(null);
      const res = await fetch('/api/events/sheets/sync', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ eventId, mode: 'RECONCILE' }),
      });
      const json = await res.json();
      if (json.success) {
        setSyncFeedback(`Reconciliation completed: ${json.report?.matchedRecords || 0} matched records verified.`);
        await fetchConfig();
      }
    } catch (_) {
      setSyncFeedback('Reconciliation process encountered an issue.');
    } finally {
      setIsReconciling(false);
    }
  };

  const handleResolveConflict = async (conflictId: string, resolution: 'RESOLVED_WEBSITE' | 'RESOLVED_SHEETS') => {
    try {
      setResolvingId(conflictId);
      const res = await fetch('/api/events/sheets/conflicts', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ conflictId, resolution }),
      });
      const json = await res.json();
      if (json.success) {
        await fetchConfig();
      }
    } catch (err) {
      console.error('Failed to resolve conflict', err);
    } finally {
      setResolvingId(null);
    }
  };

  const handleTogglePause = async () => {
    const isPaused = data?.workbook?.status === 'PAUSED';
    const action = isPaused ? 'RESUME_SYNC' : 'PAUSE_SYNC';
    await fetch('/api/events/sheets/config', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ eventId, action }),
    });
    await fetchConfig();
  };

  if (loading) {
    return (
      <div className="p-8 rounded-3xl bg-[#090b14] border border-white/10 text-center space-y-4">
        <RefreshCw className="w-6 h-6 animate-spin mx-auto text-white" />
        <p className="text-xs font-mono text-neutral-400">Mounting ZEN.SHEETS Two-Way Telemetry Engine...</p>
      </div>
    );
  }

  const workbook = data?.workbook;
  const status = workbook?.status || 'SYNCED';
  const healthScore = data?.healthScore ?? 100;
  const unresolvedCount = data?.unresolvedConflictsCount || 0;
  const pendingJobsCount = data?.pendingJobsCount || 0;
  const tabs = workbook?.tabs || [];
  const conflicts = workbook?.conflicts || [];
  const recentAudits = data?.recentAudits || [];

  return (
    <div className="space-y-6 font-sans text-left">
      {/* ── Top Header Banner ── */}
      <div className="p-6 sm:p-7 rounded-3xl bg-[#090b14] border border-white/10 space-y-5 relative overflow-hidden shadow-2xl">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-white/10 pb-5">
          <div className="space-y-1">
            <div className="flex items-center gap-2 flex-wrap">
              <span className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/10 text-white text-[10px] font-mono font-bold uppercase tracking-wider border border-white/10">
                <FileSpreadsheet className="w-3.5 h-3.5 text-emerald-400" />
                <span>ZEN.SHEETS Universal Operations</span>
              </span>

              {/* Status Badge */}
              <span
                className={`px-2.5 py-0.5 rounded-full text-[10px] font-mono font-bold uppercase tracking-wider border ${
                  status === 'SYNCED'
                    ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30'
                    : status === 'SYNCING'
                    ? 'bg-cyan-500/10 text-cyan-400 border-cyan-500/30 animate-pulse'
                    : status === 'CONFLICT'
                    ? 'bg-rose-500/10 text-rose-400 border-rose-500/30'
                    : status === 'ACTION_REQUIRED'
                    ? 'bg-amber-500/10 text-amber-400 border-amber-500/30'
                    : 'bg-neutral-500/10 text-neutral-400 border-neutral-500/30'
                }`}
              >
                ● {status}
              </span>

              <span className="text-xs font-mono text-neutral-400">
                Health: <strong className="text-white">{healthScore}%</strong>
              </span>
            </div>

            <h2 className="font-sans font-bold text-xl sm:text-2xl text-white">
              Google Sheets Live Operations Workspace
            </h2>
            <p className="text-xs text-neutral-400 max-w-2xl leading-relaxed">
              ZENVITRA remains the authoritative source of truth for identity, permissions, and security. Google Sheets serves as your team&apos;s live operational interface.
            </p>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-wrap items-center gap-2.5">
            {/* Connect Sheets & Apps Script Link Modal Launcher */}
            <button
              type="button"
              onClick={() => setShowConnectModal(true)}
              className="px-4 py-2.5 rounded-xl bg-gradient-to-r from-cyan-500/20 to-blue-600/20 hover:from-cyan-500/30 hover:to-blue-600/30 border border-cyan-400/40 text-cyan-200 hover:text-white font-sans font-bold text-xs transition cursor-pointer flex items-center gap-2 shadow-sm"
              title="Connect via 1-click Google OAuth or custom Apps Script link"
            >
              <Zap className="w-3.5 h-3.5 text-cyan-400" />
              <span>Connect Google OAuth / Sheet</span>
            </button>

            <button
              type="button"
              onClick={handleOutboundSync}
              disabled={isSyncing}
              className="px-4 py-2.5 rounded-xl bg-white hover:bg-neutral-200 text-black font-sans font-bold text-xs transition cursor-pointer flex items-center gap-2 shadow-sm disabled:opacity-50"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${isSyncing ? 'animate-spin' : ''}`} />
              <span>{isSyncing ? 'Pushing Data...' : 'Sync Live Data'}</span>
            </button>

            <button
              type="button"
              onClick={handleReconcile}
              disabled={isReconciling}
              className="px-4 py-2.5 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-white text-xs font-mono transition cursor-pointer flex items-center gap-2 disabled:opacity-50"
              title="Compare all records and resolve drift"
            >
              <RotateCcw className={`w-3.5 h-3.5 ${isReconciling ? 'animate-spin' : ''}`} />
              <span>Reconcile</span>
            </button>

            {workbook?.spreadsheetUrl && (
              <a
                href={workbook.spreadsheetUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="px-4 py-2.5 rounded-xl bg-emerald-500/15 hover:bg-emerald-500/25 border border-emerald-500/30 text-emerald-300 text-xs font-mono transition flex items-center gap-2"
              >
                <span>Open in Sheets</span>
                <ExternalLink className="w-3.5 h-3.5" />
              </a>
            )}
          </div>
        </div>

        {/* Sync Feedback Alert */}
        {syncFeedback && (
          <div className="p-3.5 rounded-2xl bg-white/5 border border-white/10 text-xs font-mono text-neutral-300 flex items-center justify-between gap-2">
            <div className="flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
              <span>{syncFeedback}</span>
            </div>
            <button
              type="button"
              onClick={() => setSyncFeedback(null)}
              className="text-neutral-500 hover:text-white text-xs"
            >
              Dismiss
            </button>
          </div>
        )}

        {/* 4 Metric Stats Cards */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs font-mono">
          <div className="p-4 rounded-2xl bg-white/[0.02] border border-white/10 space-y-1">
            <span className="text-[10px] text-neutral-500 uppercase block font-bold">Managed Tabs</span>
            <span className="text-xl font-bold text-white leading-none block">{tabs.length}</span>
            <span className="text-[10px] text-neutral-400">Universal Scaffolding</span>
          </div>

          <div className="p-4 rounded-2xl bg-white/[0.02] border border-white/10 space-y-1">
            <span className="text-[10px] text-neutral-500 uppercase block font-bold">Unresolved Conflicts</span>
            <span className={`text-xl font-bold leading-none block ${unresolvedCount > 0 ? 'text-rose-400' : 'text-white'}`}>
              {unresolvedCount}
            </span>
            <span className="text-[10px] text-neutral-400">Staged for Review</span>
          </div>

          <div className="p-4 rounded-2xl bg-white/[0.02] border border-white/10 space-y-1">
            <span className="text-[10px] text-neutral-500 uppercase block font-bold">Pending Queue Jobs</span>
            <span className="text-xl font-bold text-white leading-none block">{pendingJobsCount}</span>
            <span className="text-[10px] text-neutral-400">Retry Engine Ready</span>
          </div>

          <div className="p-4 rounded-2xl bg-white/[0.02] border border-white/10 space-y-1">
            <span className="text-[10px] text-neutral-500 uppercase block font-bold">Last Reconciled</span>
            <span className="text-sm font-bold text-white leading-none block truncate">
              {workbook?.lastReconciledAt
                ? new Date(workbook.lastReconciledAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
                : 'Just now'}
            </span>
            <span className="text-[10px] text-neutral-400">Continuous Audit</span>
          </div>
        </div>

        {/* Setup & Helper Links */}
        <div className="flex flex-wrap items-center justify-between gap-3 pt-2 text-xs font-mono border-t border-white/5">
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => setShowAppsScriptModal(true)}
              className="px-3 py-1.5 rounded-lg bg-white/5 hover:bg-white/10 border border-white/10 text-white transition flex items-center gap-1.5 cursor-pointer"
            >
              <Code className="w-3.5 h-3.5 text-neutral-400" />
              <span>Apps Script Inbound Code</span>
            </button>

            <button
              type="button"
              onClick={handleTogglePause}
              className="px-3 py-1.5 rounded-lg bg-white/5 hover:bg-white/10 border border-white/10 text-white transition flex items-center gap-1.5 cursor-pointer"
            >
              {status === 'PAUSED' ? <Play className="w-3.5 h-3.5 text-emerald-400" /> : <Pause className="w-3.5 h-3.5 text-amber-400" />}
              <span>{status === 'PAUSED' ? 'Resume Sync' : 'Pause Sync'}</span>
            </button>
          </div>

          <button
            type="button"
            onClick={() => setShowGoogleGuideModal(true)}
            className="text-neutral-400 hover:text-white transition flex items-center gap-1.5 cursor-pointer"
          >
            <HelpCircle className="w-3.5 h-3.5 text-neutral-300" />
            <span>Don&apos;t have a Gmail / Google account? Click here for guide</span>
          </button>
        </div>
      </div>

      {/* ── Sub Navigation Tabs ── */}
      <div className="flex items-center gap-2 border-b border-white/10 pb-3 overflow-x-auto text-xs font-mono">
        <button
          type="button"
          onClick={() => setActiveSubTab('tabs')}
          className={`px-4 py-2 rounded-xl transition cursor-pointer flex items-center gap-2 ${
            activeSubTab === 'tabs'
              ? 'bg-white text-black font-bold shadow-sm'
              : 'bg-white/5 hover:bg-white/10 text-neutral-400 hover:text-white'
          }`}
        >
          <Layers className="w-3.5 h-3.5" />
          <span>Universal Tabs ({tabs.length})</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveSubTab('conflicts')}
          className={`px-4 py-2 rounded-xl transition cursor-pointer flex items-center gap-2 ${
            activeSubTab === 'conflicts'
              ? 'bg-white text-black font-bold shadow-sm'
              : 'bg-white/5 hover:bg-white/10 text-neutral-400 hover:text-white'
          }`}
        >
          <AlertTriangle className="w-3.5 h-3.5" />
          <span>Active Conflicts ({unresolvedCount})</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveSubTab('policies')}
          className={`px-4 py-2 rounded-xl transition cursor-pointer flex items-center gap-2 ${
            activeSubTab === 'policies'
              ? 'bg-white text-black font-bold shadow-sm'
              : 'bg-white/5 hover:bg-white/10 text-neutral-400 hover:text-white'
          }`}
        >
          <ShieldCheck className="w-3.5 h-3.5" />
          <span>Sync Policies &amp; Permissions</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveSubTab('audit')}
          className={`px-4 py-2 rounded-xl transition cursor-pointer flex items-center gap-2 ${
            activeSubTab === 'audit'
              ? 'bg-white text-black font-bold shadow-sm'
              : 'bg-white/5 hover:bg-white/10 text-neutral-400 hover:text-white'
          }`}
        >
          <Clock className="w-3.5 h-3.5" />
          <span>Audit Log ({recentAudits.length})</span>
        </button>
      </div>

      {/* ── VIEW 1: UNIVERSAL TABS ── */}
      {activeSubTab === 'tabs' && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {tabs.map((tab: any) => {
            const mappingsCount = tab.mappings?.length || 0;
            const recordsCount = tab._count?.records || 0;

            return (
              <div
                key={tab.id}
                className="p-5 rounded-2xl bg-[#090b14] border border-white/10 hover:border-white/20 transition-all space-y-3 shadow-md"
              >
                <div className="flex items-center justify-between gap-2">
                  <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-white/10 text-white font-bold">
                    Tab {tab.sheetId}
                  </span>
                  <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-white/5 text-neutral-400">
                    v{tab.schemaVersion}.0
                  </span>
                </div>

                <div>
                  <h3 className="font-sans font-bold text-base text-white">{tab.tabName}</h3>
                  <p className="text-xs text-neutral-400 pt-0.5">
                    {mappingsCount} mapped fields · {recordsCount} synchronized rows
                  </p>
                </div>

                <div className="pt-2 border-t border-white/5 flex items-center justify-between text-xs font-mono text-neutral-400">
                  <span>Policy: Two-Way Sync</span>
                  <span className="w-2 h-2 rounded-full bg-emerald-400" />
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* ── VIEW 2: ACTIVE CONFLICTS ── */}
      {activeSubTab === 'conflicts' && (
        <div className="space-y-4">
          {conflicts.length === 0 ? (
            <div className="py-16 text-center space-y-3 rounded-3xl bg-[#090b14] border border-white/10 p-8 max-w-xl mx-auto">
              <CheckCircle2 className="w-10 h-10 text-emerald-400 mx-auto" />
              <h3 className="font-sans font-bold text-lg text-white">Zero Sync Conflicts Detected</h3>
              <p className="text-xs text-neutral-400 max-w-sm mx-auto leading-relaxed">
                All edits between ZENVITRA and your Google Sheet are in complete cryptographic parity.
              </p>
            </div>
          ) : (
            conflicts.map((c: any) => (
              <div
                key={c.id}
                className="p-5 sm:p-6 rounded-2xl bg-[#090b14] border border-rose-500/30 space-y-4 shadow-xl"
              >
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                  <div className="space-y-1">
                    <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-rose-500/20 text-rose-300 font-bold uppercase">
                      Collision: {c.entityType} ({c.fieldKey})
                    </span>
                    <h4 className="font-bold text-sm text-white">Record Reference: {c.entityId}</h4>
                    <p className="text-xs text-neutral-400">{c.resolutionNotes}</p>
                  </div>

                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      disabled={resolvingId === c.id}
                      onClick={() => handleResolveConflict(c.id, 'RESOLVED_WEBSITE')}
                      className="px-3.5 py-1.5 rounded-xl bg-white hover:bg-neutral-200 text-black font-bold text-xs transition cursor-pointer"
                    >
                      Accept Website Value
                    </button>

                    <button
                      type="button"
                      disabled={resolvingId === c.id}
                      onClick={() => handleResolveConflict(c.id, 'RESOLVED_SHEETS')}
                      className="px-3.5 py-1.5 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-white text-xs font-mono transition cursor-pointer"
                    >
                      Accept Sheet Value
                    </button>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs font-mono pt-2">
                  <div className="p-3 rounded-xl bg-white/[0.02] border border-white/5 space-y-1">
                    <span className="text-[10px] text-neutral-500 uppercase block font-bold">ZENVITRA Value</span>
                    <span className="text-white block truncate">{c.websiteValue || '—'}</span>
                  </div>

                  <div className="p-3 rounded-xl bg-white/[0.02] border border-white/5 space-y-1">
                    <span className="text-[10px] text-neutral-500 uppercase block font-bold">Google Sheet Value</span>
                    <span className="text-white block truncate">{c.sheetValue || '—'}</span>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      )}

      {/* ── VIEW 3: SYNC POLICIES ── */}
      {activeSubTab === 'policies' && (
        <div className="p-6 rounded-3xl bg-[#090b14] border border-white/10 space-y-5">
          <div>
            <h3 className="font-sans font-bold text-base text-white">Universal Field Sync Policies</h3>
            <p className="text-xs text-neutral-400">
              Granular access and synchronization behavior defined per operational field.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 text-xs font-mono">
            <div className="p-4 rounded-xl bg-white/[0.02] border border-white/5 space-y-1">
              <span className="px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-300 font-bold text-[10px] inline-block">
                TWO_WAY
              </span>
              <h4 className="font-bold text-white text-xs">Website &amp; Sheets Live Sync</h4>
              <p className="text-[11px] text-neutral-400 font-sans">
                Permitted allocations, committee titles, interview dates, and notes synchronize bidirectionally.
              </p>
            </div>

            <div className="p-4 rounded-xl bg-white/[0.02] border border-white/5 space-y-1">
              <span className="px-2 py-0.5 rounded bg-cyan-500/10 text-cyan-300 font-bold text-[10px] inline-block">
                WEBSITE_AUTHORITATIVE
              </span>
              <h4 className="font-bold text-white text-xs">Website Authoritative</h4>
              <p className="text-[11px] text-neutral-400 font-sans">
                Registrations, payment authorizations, and account credentials cannot be overridden via spreadsheet edits.
              </p>
            </div>

            <div className="p-4 rounded-xl bg-white/[0.02] border border-white/5 space-y-1">
              <span className="px-2 py-0.5 rounded bg-amber-500/10 text-amber-300 font-bold text-[10px] inline-block">
                APPROVAL_REQUIRED
              </span>
              <h4 className="font-bold text-white text-xs">Staged for Review</h4>
              <p className="text-[11px] text-neutral-400 font-sans">
                Sensitive changes (e.g. locking committee portfolios or executive offers) stage for organizer sign-off.
              </p>
            </div>

            <div className="p-4 rounded-xl bg-white/[0.02] border border-white/5 space-y-1">
              <span className="px-2 py-0.5 rounded bg-white/10 text-white font-bold text-[10px] inline-block">
                READ_ONLY
              </span>
              <h4 className="font-bold text-white text-xs">Protected Identifiers</h4>
              <p className="text-[11px] text-neutral-400 font-sans">
                Column A stable internal IDs, submission timestamps, and system counters are tamper-proof.
              </p>
            </div>

            <div className="p-4 rounded-xl bg-white/[0.02] border border-white/5 space-y-1">
              <span className="px-2 py-0.5 rounded bg-purple-500/10 text-purple-300 font-bold text-[10px] inline-block">
                DERIVED_FORMULA
              </span>
              <h4 className="font-bold text-white text-xs">Computed Metrics</h4>
              <p className="text-[11px] text-neutral-400 font-sans">
                Capacity tallies and completion percentages recalculate automatically from raw records.
              </p>
            </div>
          </div>
        </div>
      )}

      {/* ── VIEW 4: AUDIT LEDGER ── */}
      {activeSubTab === 'audit' && (
        <div className="p-6 rounded-3xl bg-[#090b14] border border-white/10 space-y-4 text-xs font-mono">
          <div className="flex items-center justify-between">
            <h3 className="font-sans font-bold text-base text-white">Cryptographic Sync Audit Ledger</h3>
            <span className="text-neutral-500 text-[11px]">Last {recentAudits.length} events logged</span>
          </div>

          <div className="divide-y divide-white/5">
            {recentAudits.map((a: any) => (
              <div key={a.id} className="py-3 flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                <div className="space-y-0.5">
                  <div className="flex items-center gap-2">
                    <span className="px-2 py-0.5 rounded bg-white/10 text-white font-bold text-[10px]">
                      {a.action}
                    </span>
                    <span className="text-white font-semibold">{a.entityType || 'SYSTEM'}</span>
                    {a.actorEmail && <span className="text-neutral-500">by {a.actorEmail}</span>}
                  </div>
                  <p className="text-[11px] text-neutral-400 truncate max-w-lg">{a.details || '—'}</p>
                </div>

                <span className="text-neutral-500 text-[11px] shrink-0">
                  {new Date(a.timestamp).toLocaleString()}
                </span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ── APPS SCRIPT CODE MODAL ── */}
      {showAppsScriptModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-in fade-in duration-200">
          <div className="w-full max-w-3xl rounded-3xl bg-[#090b14] border border-white/15 p-6 sm:p-8 space-y-5 text-left shadow-2xl max-h-[90vh] overflow-y-auto">
            <div className="flex items-start justify-between gap-4 border-b border-white/10 pb-4">
              <div className="space-y-1">
                <span className="px-2.5 py-0.5 rounded-full bg-white/10 text-white text-[10px] font-mono font-bold uppercase tracking-wider">
                  Apps Script Edit Trigger
                </span>
                <h3 className="font-sans font-bold text-xl text-white">Google Sheets Inbound Webhook</h3>
                <p className="text-xs text-neutral-400">
                  Paste this code into Extensions → Apps Script to stream spreadsheet cell edits back to ZENVITRA.
                </p>
              </div>

              <button
                type="button"
                onClick={() => setShowAppsScriptModal(false)}
                className="p-2 rounded-xl text-neutral-400 hover:text-white hover:bg-white/10 transition cursor-pointer"
              >
                ✕
              </button>
            </div>

            <div className="relative">
              <pre className="p-4 rounded-2xl bg-black border border-white/10 text-xs font-mono text-neutral-300 overflow-x-auto max-h-96">
                {data?.appsScriptCode || '// Loading Apps Script code...'}
              </pre>

              <button
                type="button"
                onClick={() => {
                  if (data?.appsScriptCode) {
                    navigator.clipboard.writeText(data.appsScriptCode);
                    setCopiedScript(true);
                    setTimeout(() => setCopiedScript(false), 2000);
                  }
                }}
                className="absolute top-3 right-3 px-3 py-1.5 rounded-xl bg-white hover:bg-neutral-200 text-black text-xs font-bold font-mono transition flex items-center gap-1.5 shadow-sm"
              >
                {copiedScript ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                <span>{copiedScript ? 'Copied' : 'Copy Code'}</span>
              </button>
            </div>

            <div className="p-4 rounded-2xl bg-white/[0.02] border border-white/5 space-y-2 text-xs font-sans text-neutral-300">
              <strong className="text-white block font-mono text-[11px] uppercase">Installation Steps:</strong>
              <ol className="list-decimal pl-4 space-y-1">
                <li>Open your event&apos;s Google Sheet and click <strong>Extensions → Apps Script</strong>.</li>
                <li>Delete existing placeholder text and paste the copied snippet.</li>
                <li>Click the <strong>Save</strong> icon (Disk).</li>
                <li>Select the function <strong>setupZenvitraTriggers</strong> in the top dropdown and click <strong>Run</strong> once.</li>
              </ol>
            </div>
          </div>
        </div>
      )}

      {/* ── GOOGLE ACCOUNT CREATION GUIDE MODAL ── */}
      <GoogleAccountGuideModal
        isOpen={showGoogleGuideModal}
        onClose={() => setShowGoogleGuideModal(false)}
      />

      {/* ── CONNECT SHEETS & APPS SCRIPT LINK MODAL ── */}
      <ConnectSheetModal
        isOpen={showConnectModal}
        onClose={() => setShowConnectModal(false)}
        eventId={eventId}
        eventTitle={eventTitle}
        onConnected={() => fetchConfig()}
      />
    </div>
  );
}
