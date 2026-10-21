'use client';

import React, { useState, useEffect } from 'react';
import {
  FileSpreadsheet,
  Code,
  CheckCircle2,
  AlertTriangle,
  RefreshCw,
  Copy,
  Check,
  Download,
  ExternalLink,
  Sparkles,
  Link as LinkIcon,
  X,
  Play,
  ArrowRight,
  ShieldCheck,
  Zap,
  Globe,
  HelpCircle,
  ChevronRight,
  CheckCheck,
  BookOpen,
  Info
} from 'lucide-react';
import { useAuth } from '@/context/AuthContext';

interface ConnectSheetModalProps {
  isOpen: boolean;
  onClose: () => void;
  eventId?: string;
  eventTitle?: string;
  onConnected?: (integration: any) => void;
}

export function ConnectSheetModal({
  isOpen,
  onClose,
  eventId,
  eventTitle,
  onConnected,
}: ConnectSheetModalProps) {
  const { user, profile } = useAuth();

  // Mode Selection: 'OAUTH' vs 'MANUAL_SCRIPT'
  const [activeMode, setActiveMode] = useState<'OAUTH' | 'MANUAL_SCRIPT'>('OAUTH');

  // OAuth States
  const [googleEmail, setGoogleEmail] = useState('');
  const [googleName, setGoogleName] = useState('');
  const [oauthOptionalSheetUrl, setOauthOptionalSheetUrl] = useState('');
  const [oauthLoading, setOauthLoading] = useState(false);
  const [oauthConfigStatus, setOAuthConfigStatus] = useState<{
    isConfigured: boolean;
    isGoogleConnected: boolean;
    activeIntegration: any | null;
  } | null>(null);

  // Manual Apps Script States
  const [sheetUrl, setSheetUrl] = useState('');
  const [scriptUrl, setScriptUrl] = useState('');
  const [integrationName, setIntegrationName] = useState(
    eventTitle ? `${eventTitle} Master Sheet` : 'ZENVITRA Operational Sheet'
  );
  const [syncMode, setSyncMode] = useState<'BI_DIRECTIONAL' | 'OUTBOUND_ONLY' | 'INBOUND_ONLY'>('BI_DIRECTIONAL');
  const [autoInitTabs, setAutoInitTabs] = useState(true);
  const [connecting, setConnecting] = useState(false);
  const [feedback, setFeedback] = useState<{ type: 'success' | 'error' | 'warning'; message: string } | null>(null);
  const [integratedResult, setIntegratedResult] = useState<{
    integration: any;
    integratedCode: string;
    handshake: any;
  } | null>(null);
  const [copiedCode, setCopiedCode] = useState(false);

  // Manual Stepper State
  const [activeStep, setActiveStep] = useState<number>(1);

  // Initialize emails & load active integration
  useEffect(() => {
    if (isOpen) {
      if (profile?.email || user?.email) {
        setGoogleEmail(profile?.email || user?.email || '');
      }
      if ((profile as any)?.display_name || user?.name) {
        setGoogleName((profile as any)?.display_name || user?.name || '');
      }

      const fetchStatus = async () => {
        try {
          const res = await fetch(`/api/sheets/oauth/status?${eventId ? `eventId=${encodeURIComponent(eventId)}` : ''}`);
          const json = await res.json();
          if (json.success) {
            setOAuthConfigStatus({
              isConfigured: json.isConfigured,
              isGoogleConnected: json.isGoogleConnected,
              activeIntegration: json.activeIntegration,
            });
            if (json.activeIntegration) {
              setSheetUrl(json.activeIntegration.sheetUrl || '');
              setScriptUrl(json.activeIntegration.webhookExecUrl || json.activeIntegration.scriptUrl || '');
              if (json.activeIntegration.name) setIntegrationName(json.activeIntegration.name);
            }
          }
        } catch (_) {}
      };
      fetchStatus();
    }
  }, [isOpen, eventId, profile, user]);

  if (!isOpen) return null;

  // Handle 1-Click Google OAuth Connection
  const handleGoogleOAuthConnect = async () => {
    setOauthLoading(true);
    setFeedback(null);

    try {
      // 1. Check if real Google OAuth 2.0 endpoint is configured
      const authRes = await fetch(
        `/api/sheets/oauth/authorize?${eventId ? `eventId=${encodeURIComponent(eventId)}` : ''}&returnUrl=${encodeURIComponent(window.location.pathname)}`
      );
      const authData = await authRes.json();

      if (authData.success && authData.isConfigured && authData.consentUrl) {
        // Redirect directly to official Google OAuth consent screen
        window.location.href = authData.consentUrl;
        return;
      }

      // 2. Fallback to instant zero-friction account connection & auto-provisioning
      const emailToUse = (googleEmail || profile?.email || user?.email || 'organizer@zenvitra.org').trim().toLowerCase();
      const nameToUse = (googleName || (profile as any)?.display_name || user?.name || emailToUse.split('@')[0]).trim();

      const instantRes = await fetch('/api/sheets/oauth/connect-instant', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          accountEmail: emailToUse,
          accountName: nameToUse,
          eventId: eventId || 'ZEN_MASTER',
          eventTitle: eventTitle || 'ZENVITRA Central Command',
          spreadsheetUrl: oauthOptionalSheetUrl.trim() || undefined,
        }),
      });

      const instantData = await instantRes.json();
      if (instantData.success) {
        setFeedback({
          type: 'success',
          message: `Connected Google Account (${instantData.accountEmail})! Master operational spreadsheet configured with live 2-way sync.`,
        });

        setOAuthConfigStatus({
          isConfigured: false,
          isGoogleConnected: true,
          activeIntegration: instantData.integration,
        });

        if (onConnected) onConnected(instantData.integration);
      } else {
        setFeedback({
          type: 'error',
          message: instantData.error || 'Failed to auto-setup Google Sheets connection.',
        });
      }
    } catch (err: any) {
      setFeedback({
        type: 'error',
        message: err?.message || 'Error initializing Google OAuth connection.',
      });
    } finally {
      setOauthLoading(false);
    }
  };

  // Handle Manual Apps Script Link Verification
  const handleManualConnectAndIntegrate = async (e: React.FormEvent) => {
    e.preventDefault();
    setConnecting(true);
    setFeedback(null);

    try {
      const res = await fetch('/api/sheets/connect', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          sheetUrl: sheetUrl.trim(),
          scriptUrl: scriptUrl.trim(),
          name: integrationName.trim(),
          eventId: eventId || 'ZEN_MASTER',
          scope: eventId ? 'EVENT' : 'GLOBAL',
          syncMode,
          autoInitTabs,
        }),
      });

      const data = await res.json();
      if (data.success) {
        setIntegratedResult({
          integration: data.integration,
          integratedCode: data.integratedCode,
          handshake: data.handshake,
        });

        if (data.handshake?.reachable) {
          setFeedback({
            type: 'success',
            message: `Handshake Verified! Apps Script responded in ${data.handshake.latencyMs}ms. Live 2-way sync is active.`,
          });
        } else {
          setFeedback({
            type: 'warning',
            message: 'Connected locally, but could not reach the Apps Script Web App yet. Make sure to deploy as Web App (Access: Anyone) and paste the code below.',
          });
        }

        if (onConnected) onConnected(data.integration);
      } else {
        setFeedback({
          type: 'error',
          message: data.error || 'Failed to connect Google Sheets and Apps Script.',
        });
      }
    } catch (err: any) {
      setFeedback({
        type: 'error',
        message: err?.message || 'Network error connecting sheets.',
      });
    } finally {
      setConnecting(false);
    }
  };

  const handleCopyCode = () => {
    if (integratedResult?.integratedCode) {
      navigator.clipboard.writeText(integratedResult.integratedCode);
      setCopiedCode(true);
      setTimeout(() => setCopiedCode(false), 2000);
    }
  };

  const handleDownloadCode = () => {
    if (!integratedResult?.integratedCode) return;
    const blob = new Blob([integratedResult.integratedCode], { type: 'application/javascript;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `zenvitra_sheet_sync_${integratedResult.integration.spreadsheetId.slice(0, 8)}.js`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-5 bg-black/85 backdrop-blur-md overflow-y-auto">
      <div className="relative w-full max-w-3xl rounded-3xl bg-[#090b14] border border-cyan-500/30 p-6 sm:p-8 space-y-6 text-left shadow-[0_0_80px_rgba(6,182,212,0.15)] max-h-[92vh] overflow-y-auto my-auto text-white font-sans">
        
        {/* Top Header */}
        <div className="flex items-start justify-between border-b border-white/10 pb-4">
          <div className="space-y-1">
            <div className="flex items-center gap-2 flex-wrap">
              <span className="px-2.5 py-0.5 rounded-full bg-cyan-500/10 border border-cyan-500/30 text-cyan-300 font-mono text-[10px] font-bold uppercase tracking-wider flex items-center gap-1.5">
                <FileSpreadsheet className="w-3.5 h-3.5 text-cyan-400" />
                <span>ZEN.SHEETS INTEGRATION SYSTEM</span>
              </span>
              <span className="px-2 py-0.5 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 font-mono text-[9px] font-bold uppercase">
                TWO-WAY ENGINE
              </span>
            </div>
            <h3 className="text-lg sm:text-xl font-bold text-white tracking-tight flex items-center gap-2">
              <span>Google Sheets &amp; Apps Script Connection</span>
            </h3>
            <p className="text-xs text-neutral-400">
              Connect via 1-click Google OAuth to auto-provision everything, or follow the step-by-step Apps Script guide to connect manually.
            </p>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="p-2 rounded-xl text-neutral-400 hover:text-white hover:bg-white/10 transition cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Dual Mode Switcher Tabs */}
        <div className="grid grid-cols-2 gap-2 p-1.5 rounded-2xl bg-black/60 border border-white/10 text-xs font-mono">
          <button
            type="button"
            onClick={() => setActiveMode('OAUTH')}
            className={`py-2.5 px-3 rounded-xl font-bold transition flex items-center justify-center gap-2 cursor-pointer ${
              activeMode === 'OAUTH'
                ? 'bg-gradient-to-r from-cyan-500/20 to-teal-500/20 text-cyan-300 border border-cyan-500/40 shadow-sm'
                : 'text-neutral-400 hover:text-white hover:bg-white/5'
            }`}
          >
            <Zap className="w-3.5 h-3.5 text-cyan-400" />
            <span>⚡ 1-Click Google OAuth (Auto-Setup)</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveMode('MANUAL_SCRIPT')}
            className={`py-2.5 px-3 rounded-xl font-bold transition flex items-center justify-center gap-2 cursor-pointer ${
              activeMode === 'MANUAL_SCRIPT'
                ? 'bg-gradient-to-r from-blue-500/20 to-indigo-500/20 text-blue-300 border border-blue-500/40 shadow-sm'
                : 'text-neutral-400 hover:text-white hover:bg-white/5'
            }`}
          >
            <Code className="w-3.5 h-3.5 text-blue-400" />
            <span>🛠️ Manual Apps Script (Step-by-Step)</span>
          </button>
        </div>

        {/* Feedback Alert */}
        {feedback && (
          <div
            className={`p-3.5 rounded-2xl text-xs font-mono flex items-center gap-2 border ${
              feedback.type === 'success'
                ? 'bg-emerald-500/15 border-emerald-500/30 text-emerald-300'
                : feedback.type === 'warning'
                ? 'bg-amber-500/15 border-amber-500/30 text-amber-300'
                : 'bg-rose-500/15 border-rose-500/30 text-rose-300'
            }`}
          >
            {feedback.type === 'success' ? (
              <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
            ) : (
              <AlertTriangle className="w-4 h-4 text-amber-400 shrink-0" />
            )}
            <span>{feedback.message}</span>
          </div>
        )}

        {/* ═══════════════════════════════════════════════════════════════════ */}
        {/* MODE 1: 1-CLICK GOOGLE OAUTH AUTO-SETUP                           */}
        {/* ═══════════════════════════════════════════════════════════════════ */}
        {activeMode === 'OAUTH' && (
          <div className="space-y-5">
            {/* Value Proposition Box */}
            <div className="p-5 rounded-2xl bg-cyan-950/20 border border-cyan-500/25 space-y-3">
              <div className="flex items-center gap-2 text-cyan-300 font-bold text-xs uppercase font-mono tracking-wider">
                <Sparkles className="w-4 h-4 text-cyan-400" />
                <span>Zero-Code Instant Google Provisioning</span>
              </div>
              <p className="text-xs text-neutral-300 leading-relaxed font-sans">
                Authenticate with your Google Account once. ZENVITRA automatically provisions your master operational spreadsheet in Google Drive, builds all core operational registers (Registrations, Rollcall, Secretariat, Payments, etc.), formats column headers, and locks in live two-way synchronization.
              </p>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5 pt-1 text-[11px] font-mono text-neutral-300">
                <div className="p-2.5 rounded-xl bg-black/40 border border-white/10 flex items-center gap-2">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                  <span>Auto-Creates Drive Sheet</span>
                </div>
                <div className="p-2.5 rounded-xl bg-black/40 border border-white/10 flex items-center gap-2">
                  <CheckCircle2 className="w-3.5 h-3.5 text-cyan-400 shrink-0" />
                  <span>Core Formatted Registers</span>
                </div>
                <div className="p-2.5 rounded-xl bg-black/40 border border-white/10 flex items-center gap-2">
                  <CheckCircle2 className="w-3.5 h-3.5 text-blue-400 shrink-0" />
                  <span>Two-Way Streaming</span>
                </div>
              </div>
            </div>

            {/* Existing Active OAuth Status Card */}
            {oauthConfigStatus?.activeIntegration && (
              <div className="p-4 rounded-2xl bg-emerald-950/20 border border-emerald-500/30 flex items-center justify-between gap-4">
                <div className="space-y-0.5">
                  <div className="flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                    <span className="text-[10px] font-mono text-emerald-400 font-bold uppercase tracking-wider">
                      ACTIVE GOOGLE SHEETS CONNECTION
                    </span>
                  </div>
                  <div className="font-bold text-sm text-white truncate">
                    {oauthConfigStatus.activeIntegration.name || 'Master Google Sheet'}
                  </div>
                  <div className="text-[11px] font-mono text-neutral-400 truncate">
                    ID: {oauthConfigStatus.activeIntegration.spreadsheetId}
                  </div>
                </div>

                <a
                  href={oauthConfigStatus.activeIntegration.sheetUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-3.5 py-2 rounded-xl bg-emerald-500/20 hover:bg-emerald-500/30 border border-emerald-500/40 text-emerald-300 text-xs font-mono font-bold flex items-center gap-1.5 transition shrink-0"
                >
                  <span>Open Sheet</span>
                  <ExternalLink className="w-3.5 h-3.5" />
                </a>
              </div>
            )}

            {/* Account Info Form & Trigger */}
            <div className="space-y-4 p-5 rounded-2xl bg-black/40 border border-white/10">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                <div className="space-y-1.5">
                  <label className="text-[11px] font-mono text-neutral-300 font-bold flex items-center gap-1.5">
                    <span>GOOGLE ACCOUNT / ORGANIZER EMAIL</span>
                    <span className="text-rose-400">*</span>
                  </label>
                  <input
                    type="email"
                    required
                    value={googleEmail}
                    onChange={(e) => setGoogleEmail(e.target.value)}
                    placeholder="organizer@gmail.com"
                    className="w-full px-3.5 py-2.5 rounded-xl bg-black/60 border border-white/15 text-white font-mono text-xs focus:border-cyan-400 focus:outline-none transition"
                  />
                  <span className="text-[10px] text-neutral-500 font-mono block">
                    The Google account that will own and manage the operational spreadsheet.
                  </span>
                </div>

                <div className="space-y-1.5">
                  <label className="text-[11px] font-mono text-neutral-300 font-bold block">
                    ORGANIZER DISPLAY NAME
                  </label>
                  <input
                    type="text"
                    value={googleName}
                    onChange={(e) => setGoogleName(e.target.value)}
                    placeholder="e.g. Secretariat Lead"
                    className="w-full px-3.5 py-2.5 rounded-xl bg-black/60 border border-white/15 text-white text-xs focus:border-cyan-400 focus:outline-none transition"
                  />
                  <span className="text-[10px] text-neutral-500 font-mono block">
                    Associated organizer name for audit logs and permissions.
                  </span>
                </div>

                <div className="sm:col-span-2 space-y-1.5">
                  <label className="text-[11px] font-mono text-neutral-300 font-bold flex items-center gap-1.5">
                    <span>EXISTING GOOGLE SHEET LINK (OPTIONAL)</span>
                    <span className="text-neutral-500 font-normal">(Leave empty to auto-create new sheet)</span>
                  </label>
                  <input
                    type="text"
                    value={oauthOptionalSheetUrl}
                    onChange={(e) => setOauthOptionalSheetUrl(e.target.value)}
                    placeholder="https://docs.google.com/spreadsheets/d/1BxiMVs0XRA5nFMdKvBdBZjgmUUqptlbs74OgvE2upms/edit"
                    className="w-full px-3.5 py-2.5 rounded-xl bg-black/60 border border-white/15 text-white font-mono text-xs focus:border-cyan-400 focus:outline-none transition"
                  />
                  <span className="text-[10px] text-neutral-500 font-mono block">
                    If you already have a sheet you want to attach, paste it here. Otherwise, ZENVITRA will automatically create a new one.
                  </span>
                </div>
              </div>

              {/* Big Google Connect Button */}
              <div className="pt-2 flex flex-col sm:flex-row items-center justify-between gap-3 border-t border-white/10">
                <div className="flex items-center gap-2 text-[11px] text-neutral-400 font-mono">
                  <ShieldCheck className="w-4 h-4 text-emerald-400 shrink-0" />
                  <span>Google Workspace &amp; Personal @gmail.com fully supported</span>
                </div>

                <button
                  type="button"
                  onClick={handleGoogleOAuthConnect}
                  disabled={oauthLoading || !googleEmail}
                  className="w-full sm:w-auto px-6 py-3 rounded-xl bg-white hover:bg-neutral-100 text-black font-bold text-xs uppercase tracking-wider transition shadow-[0_0_25px_rgba(255,255,255,0.2)] active:scale-[0.98] flex items-center justify-center gap-2.5 cursor-pointer disabled:opacity-50"
                >
                  {oauthLoading ? (
                    <>
                      <RefreshCw className="w-4 h-4 animate-spin text-black" />
                      <span>Connecting &amp; Provisioning...</span>
                    </>
                  ) : (
                    <>
                      {/* Google G Logo SVG */}
                      <svg className="w-4 h-4 shrink-0" viewBox="0 0 24 24">
                        <path
                          fill="#4285F4"
                          d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                        />
                        <path
                          fill="#34A853"
                          d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                        />
                        <path
                          fill="#FBBC05"
                          d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
                        />
                        <path
                          fill="#EA4335"
                          d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
                        />
                      </svg>
                      <span>Connect Google Account &amp; Setup</span>
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>
        )}

        {/* ═══════════════════════════════════════════════════════════════════ */}
        {/* MODE 2: MANUAL APPS SCRIPT STEP-BY-STEP GUIDE & HANDSHAKE ENGINE   */}
        {/* ═══════════════════════════════════════════════════════════════════ */}
        {activeMode === 'MANUAL_SCRIPT' && (
          <div className="space-y-6">
            
            {/* Step-by-Step Interactive Guide Stepper */}
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-[11px] font-mono text-cyan-400 font-bold uppercase tracking-wider flex items-center gap-1.5">
                  <BookOpen className="w-3.5 h-3.5" />
                  <span>MANUAL APPS SCRIPT SETUP WORKFLOW (8 STEPS)</span>
                </span>
                <span className="text-[10px] font-mono text-neutral-400">
                  Takes ~60 seconds to configure
                </span>
              </div>

              {/* Step Navigation Pills */}
              <div className="flex items-center gap-1.5 overflow-x-auto pb-2 scrollbar-none text-[11px] font-mono">
                {[1, 2, 3, 4, 5, 6, 7, 8].map((s) => (
                  <button
                    key={s}
                    type="button"
                    onClick={() => setActiveStep(s)}
                    className={`px-3 py-1.5 rounded-lg border transition shrink-0 cursor-pointer flex items-center gap-1.5 ${
                      activeStep === s
                        ? 'bg-cyan-500/20 border-cyan-400 text-cyan-200 font-bold shadow-sm'
                        : 'bg-white/[0.03] border-white/10 text-neutral-400 hover:text-white'
                    }`}
                  >
                    <span>Step {s}</span>
                    {activeStep > s && <Check className="w-3 h-3 text-emerald-400" />}
                  </button>
                ))}
              </div>

              {/* Step Content Card */}
              <div className="p-4 rounded-2xl bg-black/50 border border-white/10 text-xs font-sans space-y-3">
                {activeStep === 1 && (
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <strong className="text-white font-mono text-[11px] uppercase flex items-center gap-1.5">
                        <span className="w-5 h-5 rounded-full bg-cyan-500/20 text-cyan-300 flex items-center justify-center font-bold">1</span>
                        <span>Open Your Google Spreadsheet</span>
                      </strong>
                      <a
                        href="https://docs.google.com/spreadsheets/u/0/create"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="px-2.5 py-1 rounded-lg bg-emerald-500/15 border border-emerald-500/30 text-emerald-300 font-mono text-[10px] font-bold flex items-center gap-1 hover:bg-emerald-500/25 transition"
                      >
                        <span>Create Blank Sheet</span>
                        <ExternalLink className="w-3 h-3" />
                      </a>
                    </div>
                    <p className="text-neutral-300 text-xs leading-relaxed">
                      Open an existing Google Sheet or create a new blank one. Give it a title such as <strong className="text-white">&quot;{eventTitle || 'Conference'} Master Command Sheet&quot;</strong>. Copy its URL from your browser address bar.
                    </p>
                  </div>
                )}

                {activeStep === 2 && (
                  <div className="space-y-2">
                    <strong className="text-white font-mono text-[11px] uppercase flex items-center gap-1.5">
                      <span className="w-5 h-5 rounded-full bg-cyan-500/20 text-cyan-300 flex items-center justify-center font-bold">2</span>
                      <span>Launch Google Apps Script Editor</span>
                    </strong>
                    <p className="text-neutral-300 text-xs leading-relaxed">
                      In the top menu bar of your Google Sheet, click <strong className="text-white">Extensions</strong> &gt; <strong className="text-white">Apps Script</strong>. A new browser tab will open showing the Google Apps Script project editor (<code className="text-cyan-300 font-mono">Code.gs</code>).
                    </p>
                  </div>
                )}

                {activeStep === 3 && (
                  <div className="space-y-2">
                    <strong className="text-white font-mono text-[11px] uppercase flex items-center gap-1.5">
                      <span className="w-5 h-5 rounded-full bg-cyan-500/20 text-cyan-300 flex items-center justify-center font-bold">3</span>
                      <span>Paste the ZENVITRA Integrated Code</span>
                    </strong>
                    <p className="text-neutral-300 text-xs leading-relaxed">
                      Delete any placeholder text in <code className="text-cyan-300 font-mono">Code.gs</code> (like <code className="text-neutral-400 font-mono">function myFunction() {}</code>), then copy and paste the customized ZENVITRA script provided below into the editor.
                    </p>
                  </div>
                )}

                {activeStep === 4 && (
                  <div className="space-y-2">
                    <strong className="text-white font-mono text-[11px] uppercase flex items-center gap-1.5">
                      <span className="w-5 h-5 rounded-full bg-cyan-500/20 text-cyan-300 flex items-center justify-center font-bold">4</span>
                      <span>Save &amp; Rename Project</span>
                    </strong>
                    <p className="text-neutral-300 text-xs leading-relaxed">
                      Click the floppy disk icon (💾) or press <kbd className="px-1.5 py-0.5 rounded bg-white/10 text-white font-mono">Ctrl+S</kbd> / <kbd className="px-1.5 py-0.5 rounded bg-white/10 text-white font-mono">Cmd+S</kbd> to save. Click <strong className="text-white">&quot;Untitled project&quot;</strong> at the top left and rename it to <strong className="text-white">&quot;ZENVITRA Two-Way Sync&quot;</strong>.
                    </p>
                  </div>
                )}

                {activeStep === 5 && (
                  <div className="space-y-2">
                    <strong className="text-white font-mono text-[11px] uppercase flex items-center gap-1.5">
                      <span className="w-5 h-5 rounded-full bg-cyan-500/20 text-cyan-300 flex items-center justify-center font-bold">5</span>
                      <span>Run One-Time Setup Trigger (Important)</span>
                    </strong>
                    <p className="text-neutral-300 text-xs leading-relaxed">
                      In the toolbar dropdown (next to &quot;Debug&quot;), select the function <strong className="text-cyan-300 font-mono">setupZenvitraTriggers</strong> and click <strong className="text-white">Run</strong>.
                    </p>
                    <div className="p-2.5 rounded-xl bg-amber-500/10 border border-amber-500/20 text-[11px] text-amber-300 leading-relaxed space-y-1">
                      <strong>Permission Prompt:</strong> Google will ask to review permissions. Click <strong className="text-white">Review permissions</strong> &gt; select your account &gt; click <strong className="text-white">Advanced</strong> &gt; click <strong className="text-white">Go to ZENVITRA Two-Way Sync (unsafe)</strong> &gt; click <strong className="text-white">Allow</strong>.
                    </div>
                  </div>
                )}

                {activeStep === 6 && (
                  <div className="space-y-2">
                    <strong className="text-white font-mono text-[11px] uppercase flex items-center gap-1.5">
                      <span className="w-5 h-5 rounded-full bg-cyan-500/20 text-cyan-300 flex items-center justify-center font-bold">6</span>
                      <span>(Optional) Auto-Initialize Core Registers</span>
                    </strong>
                    <p className="text-neutral-300 text-xs leading-relaxed">
                      In the toolbar dropdown, select the function <strong className="text-cyan-300 font-mono">initAllTabs</strong> and click <strong className="text-white">Run</strong>. Your Google Sheet will automatically generate formatted tabs with headers for Core Registrations, Attendance, Secretariat, Payments, and more!
                    </p>
                  </div>
                )}

                {activeStep === 7 && (
                  <div className="space-y-2">
                    <strong className="text-white font-mono text-[11px] uppercase flex items-center gap-1.5">
                      <span className="w-5 h-5 rounded-full bg-cyan-500/20 text-cyan-300 flex items-center justify-center font-bold">7</span>
                      <span>Deploy as Web App</span>
                    </strong>
                    <ol className="list-decimal pl-4 space-y-1 text-neutral-300 text-[11px] leading-relaxed">
                      <li>Click the blue <strong className="text-white">Deploy</strong> button at top right &gt; <strong className="text-white">New deployment</strong>.</li>
                      <li>Click the gear icon (⚙️) next to &quot;Select type&quot; and choose <strong className="text-cyan-300">Web app</strong>.</li>
                      <li>Set Description: <code className="text-neutral-300 font-mono">ZENVITRA Live Telemetry Webhook</code>.</li>
                      <li>Set <strong>Execute as</strong>: <strong className="text-white">Me (your email)</strong>.</li>
                      <li>Set <strong>Who has access</strong>: <strong className="text-emerald-400">Anyone</strong> (Essential for server dispatch).</li>
                      <li>Click <strong className="text-white">Deploy</strong> and copy the generated <strong className="text-cyan-300">Web app URL</strong> (ending in <code className="text-cyan-200">/exec</code>).</li>
                    </ol>
                  </div>
                )}

                {activeStep === 8 && (
                  <div className="space-y-2">
                    <strong className="text-white font-mono text-[11px] uppercase flex items-center gap-1.5">
                      <span className="w-5 h-5 rounded-full bg-cyan-500/20 text-cyan-300 flex items-center justify-center font-bold">8</span>
                      <span>Paste Links in ZENVITRA &amp; Handshake</span>
                    </strong>
                    <p className="text-neutral-300 text-xs leading-relaxed">
                      Paste both your Google Sheet Link and your Apps Script Web App URL into the form below and click <strong className="text-white">&quot;Connect &amp; Verify Handshake&quot;</strong>. ZENVITRA will ping the script and establish two-way sync!
                    </p>
                  </div>
                )}

                {/* Step Navigation Buttons */}
                <div className="flex items-center justify-between pt-2 border-t border-white/10 text-xs font-mono">
                  <button
                    type="button"
                    disabled={activeStep === 1}
                    onClick={() => setActiveStep((prev) => Math.max(1, prev - 1))}
                    className="px-3 py-1.5 rounded-lg bg-white/5 hover:bg-white/10 text-neutral-400 disabled:opacity-30 cursor-pointer"
                  >
                    ← Previous Step
                  </button>

                  <button
                    type="button"
                    disabled={activeStep === 8}
                    onClick={() => setActiveStep((prev) => Math.min(8, prev + 1))}
                    className="px-3 py-1.5 rounded-lg bg-cyan-500/20 hover:bg-cyan-500/30 text-cyan-300 border border-cyan-500/30 disabled:opacity-30 cursor-pointer flex items-center gap-1 font-bold"
                  >
                    <span>Next Step</span>
                    <ChevronRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            </div>

            {/* Connection Form */}
            <form onSubmit={handleManualConnectAndIntegrate} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                <div className="sm:col-span-2 space-y-1">
                  <label className="text-[11px] font-mono text-neutral-300 flex items-center gap-1.5 font-bold">
                    <FileSpreadsheet className="w-3.5 h-3.5 text-emerald-400" />
                    <span>GOOGLE SHEETS LINK OR SPREADSHEET ID</span>
                    <span className="text-rose-400">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    value={sheetUrl}
                    onChange={(e) => setSheetUrl(e.target.value)}
                    placeholder="https://docs.google.com/spreadsheets/d/1BxiMVs0XRA5nFMdKvBdBZjgmUUqptlbs74OgvE2upms/edit"
                    className="w-full px-3.5 py-2.5 rounded-xl bg-black/60 border border-white/15 text-white font-mono text-xs focus:border-cyan-400 focus:outline-none transition"
                  />
                  <span className="text-[10px] text-neutral-500 font-mono block">
                    Direct link to your Google Spreadsheet. The Spreadsheet ID will be automatically parsed.
                  </span>
                </div>

                <div className="sm:col-span-2 space-y-1">
                  <label className="text-[11px] font-mono text-neutral-300 flex items-center gap-1.5 font-bold">
                    <Code className="w-3.5 h-3.5 text-cyan-400" />
                    <span>GOOGLE APPS SCRIPT WEB APP LINK OR PROJECT URL</span>
                    <span className="text-rose-400">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    value={scriptUrl}
                    onChange={(e) => setScriptUrl(e.target.value)}
                    placeholder="https://script.google.com/macros/s/AKfycbxRZ_ZUCZmxgTiZ2zHc9GaPWvioPyST9iLUBLdeqI7UM--3MWSiXyUcnh1vFW1d6exH/exec"
                    className="w-full px-3.5 py-2.5 rounded-xl bg-black/60 border border-white/15 text-white font-mono text-xs focus:border-cyan-400 focus:outline-none transition"
                  />
                  <span className="text-[10px] text-neutral-500 font-mono block">
                    Web App execution URL (/exec) generated from &quot;New deployment&quot; in Apps Script.
                  </span>
                </div>

                <div className="space-y-1">
                  <label className="text-[11px] font-mono text-neutral-300 font-bold block">
                    INTEGRATION LABEL / NAME
                  </label>
                  <input
                    type="text"
                    value={integrationName}
                    onChange={(e) => setIntegrationName(e.target.value)}
                    placeholder="e.g. Master Summit Operational Sheet"
                    className="w-full px-3.5 py-2.5 rounded-xl bg-black/60 border border-white/15 text-white text-xs focus:border-cyan-400 focus:outline-none transition"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-[11px] font-mono text-neutral-300 font-bold block">
                    SYNCHRONIZATION MODE
                  </label>
                  <select
                    value={syncMode}
                    onChange={(e) => setSyncMode(e.target.value as any)}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-black/60 border border-white/15 text-white text-xs focus:border-cyan-400 focus:outline-none transition"
                  >
                    <option value="BI_DIRECTIONAL">Bidirectional (Two-Way Live Sync)</option>
                    <option value="OUTBOUND_ONLY">Outbound Only (Zenvitra to Sheets)</option>
                    <option value="INBOUND_ONLY">Inbound Only (Sheets to Zenvitra)</option>
                  </select>
                </div>
              </div>

              <div className="flex items-center gap-2 pt-1 text-xs">
                <input
                  type="checkbox"
                  id="autoInitCheckManual"
                  checked={autoInitTabs}
                  onChange={(e) => setAutoInitTabs(e.target.checked)}
                  className="w-4 h-4 rounded bg-black border-white/20 text-cyan-500 focus:ring-0 cursor-pointer accent-cyan-400"
                />
                <label htmlFor="autoInitCheckManual" className="text-neutral-300 font-mono text-[11px] cursor-pointer">
                  Auto-create &amp; format operational registers in sheet upon connection
                </label>
              </div>

              <div className="flex items-center justify-between pt-2">
                <button
                  type="button"
                  onClick={onClose}
                  className="px-4 py-2 rounded-xl bg-white/5 hover:bg-white/10 text-neutral-400 text-xs font-semibold cursor-pointer"
                >
                  Cancel
                </button>

                <button
                  type="submit"
                  disabled={connecting}
                  className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-cyan-400 via-teal-400 to-indigo-400 text-black font-bold text-xs uppercase tracking-wider transition shadow-[0_0_20px_rgba(6,182,212,0.3)] hover:shadow-[0_0_30px_rgba(6,182,212,0.5)] active:scale-[0.98] flex items-center gap-2 cursor-pointer disabled:opacity-50"
                >
                  {connecting ? (
                    <>
                      <RefreshCw className="w-3.5 h-3.5 animate-spin text-black" />
                      <span>Verifying &amp; Handshaking...</span>
                    </>
                  ) : (
                    <>
                      <Zap className="w-3.5 h-3.5 text-black" />
                      <span>Verify &amp; Connect Handshake</span>
                    </>
                  )}
                </button>
              </div>
            </form>

            {/* Integrated Code Section (Displays immediately when connected or generated) */}
            {integratedResult && (
              <div className="p-5 rounded-2xl bg-black border border-cyan-500/40 space-y-4 pt-4">
                <div className="flex items-center justify-between">
                  <div>
                    <span className="text-[10px] font-mono font-bold text-cyan-400 uppercase block tracking-wider">
                      TAILORED INTEGRATED GOOGLE APPS SCRIPT CODE
                    </span>
                    <p className="text-xs text-neutral-400">
                      Pre-configured with Spreadsheet ID <strong>{integratedResult.integration.spreadsheetId}</strong> and live webhook endpoints.
                    </p>
                  </div>

                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={handleCopyCode}
                      className="px-3 py-1.5 rounded-xl bg-white hover:bg-neutral-200 text-black text-xs font-bold font-mono transition flex items-center gap-1.5 shadow-sm cursor-pointer"
                    >
                      {copiedCode ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                      <span>{copiedCode ? 'Copied' : 'Copy Code'}</span>
                    </button>

                    <button
                      type="button"
                      onClick={handleDownloadCode}
                      className="px-3 py-1.5 rounded-xl bg-cyan-500/20 hover:bg-cyan-500/30 border border-cyan-500/40 text-cyan-300 text-xs font-bold font-mono transition flex items-center gap-1.5 cursor-pointer"
                      title="Download .js file"
                    >
                      <Download className="w-3.5 h-3.5" />
                      <span>Download .js</span>
                    </button>
                  </div>
                </div>

                <pre className="p-4 rounded-xl bg-[#07090e] border border-white/10 text-[11px] font-mono text-cyan-200 overflow-x-auto max-h-60 overflow-y-auto">
                  {integratedResult.integratedCode}
                </pre>
              </div>
            )}
          </div>
        )}

      </div>
    </div>
  );
}
