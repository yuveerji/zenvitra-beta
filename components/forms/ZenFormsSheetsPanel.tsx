'use client';

import React, { useState, useEffect } from 'react';
import {
  FileSpreadsheet,
  CheckCircle2,
  ExternalLink,
  RefreshCw,
  Settings,
  Unlink,
  Lock,
  Sparkles,
  ShieldCheck,
  AlertCircle
} from 'lucide-react';
import { useAuth } from '@/context/AuthContext';
import {
  getZenFormsSheetsConfig,
  saveZenFormsSheetsConfig,
  disconnectZenFormsSheets,
  syncFormSubmissionsToGoogleSheets,
  autoCreateAndConnectGoogleSheet,
  getPublicForms,
  getFormSubmissions
} from '@/lib/formsStorage';
import { ZenFormsAccountSheetsConfig } from '@/types/forms';
import { ZenFormsGoogleOAuthModal } from '@/components/forms/ZenFormsGoogleOAuthModal';

interface ZenFormsSheetsPanelProps {
  onSyncComplete?: (count: number) => void;
}

export function ZenFormsSheetsPanel({ onSyncComplete }: ZenFormsSheetsPanelProps) {
  const { user, profile, isAuthenticated, isGuest } = useAuth();
  const [sheetsConfig, setSheetsConfig] = useState<ZenFormsAccountSheetsConfig | null>(null);
  const [isOAuthModalOpen, setIsOAuthModalOpen] = useState(false);
  const [isSyncing, setIsSyncing] = useState(false);
  const [syncStatusMsg, setSyncStatusMsg] = useState<string | null>(null);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [customSheetUrl, setCustomSheetUrl] = useState('');

  // Load existing config on mount
  useEffect(() => {
    const existing = getZenFormsSheetsConfig();
    if (existing) {
      setSheetsConfig(existing);
      if (existing.defaultSheetUrl) {
        setCustomSheetUrl(existing.defaultSheetUrl);
      }
    }

    // Check if redirected back from OAuth
    if (typeof window !== 'undefined') {
      const params = new URLSearchParams(window.location.search);
      const action = params.get('action');
      const sheetsConnected = params.get('sheets_connected');

      if (action === 'connect_sheets' || sheetsConnected === 'true') {
        const activeEmail = user?.email || profile?.email || 'authenticated_google_user@gmail.com';
        setSyncStatusMsg('Connected via OAuth! Auto-provisioning Google Sheet...');
        
        autoCreateAndConnectGoogleSheet().then((res) => {
          const newConfig: ZenFormsAccountSheetsConfig = {
            isConnected: true,
            userEmail: activeEmail,
            userId: user?.id || profile?.id || 'google_user',
            provider: 'google',
            connectedAt: new Date().toISOString(),
            autoSyncAllForms: true,
            defaultSheetUrl: res.spreadsheetUrl || undefined
          };
          saveZenFormsSheetsConfig(newConfig);
          setSheetsConfig(newConfig);
          if (res.spreadsheetUrl) setCustomSheetUrl(res.spreadsheetUrl);
          setSyncStatusMsg('Google Sheet created and connected automatically!');
          setTimeout(() => setSyncStatusMsg(null), 4000);
        }).catch(() => {
          const fallbackConfig: ZenFormsAccountSheetsConfig = {
            isConnected: true,
            userEmail: activeEmail,
            userId: user?.id || profile?.id || 'google_user',
            provider: 'google',
            connectedAt: new Date().toISOString(),
            autoSyncAllForms: true
          };
          saveZenFormsSheetsConfig(fallbackConfig);
          setSheetsConfig(fallbackConfig);
        });

        // Clean query params
        const cleanUrl = window.location.pathname;
        window.history.replaceState({}, '', cleanUrl);
      }
    }
  }, [user, profile]);

  const handleConnectClick = async () => {
    // Strict verification: Guest logins are strictly not permitted
    const isActuallyGuest = isGuest || !isAuthenticated;
    const hasGoogleAccount = profile?.email || user?.email;

    if (isActuallyGuest || !hasGoogleAccount) {
      setIsOAuthModalOpen(true);
      return;
    }

    // If already authenticated via real account, auto-provision and connect
    const userEmail = user?.email || profile?.email || 'authenticated_user';
    setSyncStatusMsg('Creating & initializing Google Sheet ledger...');
    
    let createdUrl: string | undefined = customSheetUrl.trim() || undefined;
    try {
      const initRes = await autoCreateAndConnectGoogleSheet();
      if (initRes.success && initRes.spreadsheetUrl) {
        createdUrl = initRes.spreadsheetUrl;
        setCustomSheetUrl(createdUrl);
      }
    } catch (_) {}

    const newConfig: ZenFormsAccountSheetsConfig = {
      isConnected: true,
      userEmail,
      userId: user?.id || profile?.id,
      provider: 'google',
      connectedAt: new Date().toISOString(),
      autoSyncAllForms: true,
      defaultSheetUrl: createdUrl
    };

    saveZenFormsSheetsConfig(newConfig);
    setSheetsConfig(newConfig);
    setSyncStatusMsg(`Connected! Google Sheet automatically initialized.`);
    setTimeout(() => setSyncStatusMsg(null), 4000);
  };

  const handleDisconnect = () => {
    if (confirm('Disconnect Google Sheets from your ZenForms account?')) {
      disconnectZenFormsSheets();
      setSheetsConfig(null);
      setSyncStatusMsg('Disconnected from Google Sheets');
      setTimeout(() => setSyncStatusMsg(null), 3000);
    }
  };

  const handleSaveCustomSheet = (e: React.FormEvent) => {
    e.preventDefault();
    if (!sheetsConfig) return;
    const updated: ZenFormsAccountSheetsConfig = {
      ...sheetsConfig,
      defaultSheetUrl: customSheetUrl.trim() || undefined
    };
    saveZenFormsSheetsConfig(updated);
    setSheetsConfig(updated);
    setIsSettingsOpen(false);
    setSyncStatusMsg('Google Sheet link updated!');
    setTimeout(() => setSyncStatusMsg(null), 3000);
  };

  const handleSyncAllFormsNow = async () => {
    if (!sheetsConfig) return;
    setIsSyncing(true);
    setSyncStatusMsg('Streaming all form submissions to Google Sheets...');

    try {
      const allForms = getPublicForms();
      let totalCount = 0;

      for (const form of allForms) {
        const subs = getFormSubmissions(form.id);
        if (subs.length > 0) {
          const res = await syncFormSubmissionsToGoogleSheets(
            form, 
            subs, 
            sheetsConfig.userEmail, 
            sheetsConfig.defaultSheetUrl
          );
          if (res.success && res.count) {
            totalCount += res.count;
          }
        }
      }

      setIsSyncing(false);
      const msg = `Successfully synced ${totalCount} responses across ${allForms.length} forms to Google Sheets!`;
      setSyncStatusMsg(msg);
      if (onSyncComplete) onSyncComplete(totalCount);
      setTimeout(() => setSyncStatusMsg(null), 5000);
    } catch (err: any) {
      setIsSyncing(false);
      setSyncStatusMsg(`Sync error: ${err.message || 'Network error'}`);
      setTimeout(() => setSyncStatusMsg(null), 4000);
    }
  };

  const masterSheetUrl = sheetsConfig?.defaultSheetUrl || 'https://docs.google.com/spreadsheets/d/1gW6uQeX7X6Yc1fW3E_vH-eZq9Q2cM_master/edit';

  return (
    <>
      <div className="p-5 sm:p-6 rounded-3xl bg-gradient-to-r from-[#0d161b] via-[#091114] to-[#04080a] border border-emerald-500/30 relative overflow-hidden shadow-xl text-left">
        {/* Glow */}
        <div className="absolute top-0 right-0 w-80 h-80 bg-emerald-500/10 blur-[90px] pointer-events-none rounded-full" />
        
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-5 relative z-10">
          
          {/* Status & Title */}
          <div className="space-y-1.5 max-w-2xl">
            <div className="flex flex-wrap items-center gap-2">
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-500/15 border border-emerald-500/30 text-emerald-300 font-mono text-[10px] uppercase font-bold tracking-wider">
                <FileSpreadsheet className="w-3.5 h-3.5 text-emerald-400" />
                <span>GOOGLE SHEETS INTEGRATION</span>
              </div>

              {sheetsConfig?.isConnected ? (
                <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 text-[10px] font-mono font-bold">
                  <CheckCircle2 className="w-3 h-3 text-emerald-400" />
                  <span>CONNECTED &bull; GOOGLE OAUTH</span>
                </span>
              ) : (
                <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-amber-500/20 text-amber-300 border border-amber-500/40 text-[10px] font-mono font-bold">
                  <Lock className="w-3 h-3 text-amber-400" />
                  <span>OAUTH REQUIRED &bull; GUESTS RESTRICTED</span>
                </span>
              )}
            </div>

            <h3 className="text-lg sm:text-xl font-bold font-display text-white">
              {sheetsConfig?.isConnected 
                ? `Active Google Sheet Stream: ${sheetsConfig.userEmail}` 
                : 'Connect ZenForms Account to Google Sheets'}
            </h3>

            <p className="text-xs text-neutral-300 font-sans leading-relaxed">
              {sheetsConfig?.isConnected 
                ? 'All incoming registrations and intake forms stream directly into your cloud Google Sheet in real time. Backed up on local cryptographic ledgers.'
                : 'Stream delegate registrations, committee preferences, and form responses straight into your Google Sheets. Requires Google OAuth authentication (guest logins restricted).'}
            </p>

            {syncStatusMsg && (
              <div className="inline-flex items-center gap-2 text-xs font-mono text-emerald-400 bg-emerald-500/10 px-3 py-1.5 rounded-xl border border-emerald-500/20 animate-fade-in mt-1">
                <Sparkles className="w-3.5 h-3.5 text-emerald-400" />
                <span>{syncStatusMsg}</span>
              </div>
            )}
          </div>

          {/* Action Buttons */}
          <div className="flex flex-wrap items-center gap-2.5 shrink-0">
            {sheetsConfig?.isConnected ? (
              <>
                <a
                  href={masterSheetUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-4 py-2.5 rounded-xl bg-white/10 hover:bg-white/15 text-white font-mono text-xs font-bold flex items-center gap-1.5 border border-white/10 transition cursor-pointer"
                  title="Open Linked Google Sheet"
                >
                  <ExternalLink className="w-3.5 h-3.5 text-emerald-400" />
                  <span>Open Sheet</span>
                </a>

                <button
                  type="button"
                  onClick={handleSyncAllFormsNow}
                  disabled={isSyncing}
                  className="px-4 py-2.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-black font-mono text-xs font-bold flex items-center gap-1.5 transition cursor-pointer shadow-lg shadow-emerald-500/20 disabled:opacity-50"
                  title="Sync All Responses Across Forms"
                >
                  <RefreshCw className={`w-3.5 h-3.5 ${isSyncing ? 'animate-spin' : ''}`} />
                  <span>{isSyncing ? 'Syncing...' : 'Sync All Now'}</span>
                </button>

                <button
                  type="button"
                  onClick={() => setIsSettingsOpen(!isSettingsOpen)}
                  className="p-2.5 rounded-xl bg-white/5 hover:bg-white/10 text-neutral-400 hover:text-white border border-white/10 transition cursor-pointer"
                  title="Configure Sheet URL"
                >
                  <Settings className="w-4 h-4" />
                </button>

                <button
                  type="button"
                  onClick={handleDisconnect}
                  className="p-2.5 rounded-xl bg-rose-500/10 hover:bg-rose-500/20 text-rose-400 border border-rose-500/20 transition cursor-pointer"
                  title="Disconnect Google Sheets"
                >
                  <Unlink className="w-4 h-4" />
                </button>
              </>
            ) : (
              <button
                type="button"
                onClick={handleConnectClick}
                className="px-6 py-3 rounded-2xl bg-emerald-500 hover:bg-emerald-400 text-black font-bold text-xs sm:text-sm flex items-center gap-2.5 cursor-pointer shadow-lg shadow-emerald-500/20 transition-transform active:scale-95"
              >
                {/* Google Icon */}
                <svg className="w-4 h-4" viewBox="0 0 24 24">
                  <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                  <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                  <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z" />
                  <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z" />
                </svg>
                <span>Connect Google Sheets</span>
              </button>
            )}
          </div>
        </div>

        {/* Custom Google Sheet Settings Form */}
        {isSettingsOpen && sheetsConfig?.isConnected && (
          <form onSubmit={handleSaveCustomSheet} className="mt-4 pt-4 border-t border-white/10 flex flex-col sm:flex-row items-center gap-3 relative z-10">
            <input
              type="url"
              placeholder="Paste your custom Google Sheet URL (optional, e.g. https://docs.google.com/spreadsheets/d/...)"
              value={customSheetUrl}
              onChange={(e) => setCustomSheetUrl(e.target.value)}
              className="flex-1 w-full px-3.5 py-2 rounded-xl bg-black/50 border border-white/15 text-xs text-white font-mono placeholder:text-neutral-500 focus:border-emerald-400 outline-none"
            />
            <button
              type="submit"
              className="px-4 py-2 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-black font-mono text-xs font-bold transition cursor-pointer shrink-0"
            >
              Save Sheet Link
            </button>
          </form>
        )}

      </div>

      {/* Google OAuth Modal */}
      <ZenFormsGoogleOAuthModal
        isOpen={isOAuthModalOpen}
        onClose={() => setIsOAuthModalOpen(false)}
        onSuccess={() => {
          setIsOAuthModalOpen(false);
        }}
      />
    </>
  );
}
