'use client';

import React from 'react';
import {
  ShieldAlert,
  X,
  FileSpreadsheet,
  CheckCircle2,
  Lock,
  ArrowRight,
  ExternalLink
} from 'lucide-react';
import { signIn as nextAuthSignIn } from 'next-auth/react';

interface ZenFormsGoogleOAuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess?: () => void;
}

export function ZenFormsGoogleOAuthModal({
  isOpen,
  onClose,
  onSuccess
}: ZenFormsGoogleOAuthModalProps) {
  if (!isOpen) return null;

  const handleGoogleSignIn = () => {
    try {
      nextAuthSignIn('google', { callbackUrl: '/forms?action=connect_sheets' });
    } catch {
      window.location.href = '/api/auth/signin/google?callbackUrl=/forms%3Faction%3Dconnect_sheets';
    }
  };

  const handleGitHubSignIn = () => {
    try {
      nextAuthSignIn('github', { callbackUrl: '/forms?action=connect_sheets' });
    } catch {
      window.location.href = '/api/auth/signin/github?callbackUrl=/forms%3Faction%3Dconnect_sheets';
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-black/80 backdrop-blur-md animate-fade-in text-left">
      <div className="w-full max-w-lg bg-gradient-to-b from-[#111622] via-[#0b0e17] to-[#040609] border border-emerald-500/40 rounded-3xl p-6 sm:p-8 shadow-[0_0_80px_rgba(16,185,129,0.18)] flex flex-col relative overflow-hidden space-y-6">
        
        {/* Glow Effects */}
        <div className="absolute top-0 right-0 w-72 h-72 bg-emerald-500/10 blur-[100px] pointer-events-none rounded-full" />
        <div className="absolute bottom-0 left-0 w-60 h-60 bg-amber-500/10 blur-[90px] pointer-events-none rounded-full" />

        {/* Modal Header */}
        <div className="flex items-start justify-between relative z-10 border-b border-white/10 pb-4">
          <div className="space-y-1">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-300 font-mono text-[10px] uppercase font-bold tracking-wider">
              <FileSpreadsheet className="w-3.5 h-3.5 text-emerald-400" />
              <span>GOOGLE SHEETS INTEGRATION &bull; OAUTH VERIFICATION</span>
            </div>
            <h3 className="text-xl sm:text-2xl font-bold font-display text-white">
              Google OAuth Authentication Required
            </h3>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="p-2 rounded-xl bg-white/5 hover:bg-white/10 text-neutral-400 hover:text-white transition cursor-pointer shrink-0"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Informational Body */}
        <div className="space-y-4 relative z-10 text-xs sm:text-sm font-sans text-neutral-300">
          
          {/* Strict Guest Notice */}
          <div className="p-4 rounded-2xl bg-rose-500/10 border border-rose-500/30 space-y-2 text-rose-200">
            <div className="flex items-center gap-2 text-xs font-mono font-bold uppercase text-rose-400">
              <ShieldAlert className="w-4 h-4 shrink-0 text-rose-400" />
              <span>Guest Logins Not Permitted</span>
            </div>
            <p className="text-xs leading-relaxed text-rose-200/90 font-sans">
              To prevent unauthorized external spreadsheet writes and ensure strict Google Drive data governance, <strong>guest accounts and anonymous sessions cannot link Google Sheets</strong>.
            </p>
          </div>

          <div className="space-y-2 text-xs text-neutral-300">
            <p className="font-medium text-white">
              Please authenticate using your verified Google Account (or GitHub OAuth) to activate:
            </p>
            <ul className="space-y-1.5 font-mono text-[11px] text-neutral-400">
              <li className="flex items-center gap-2">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                <span>Real-time webhook ingestion directly into your Google Sheets</span>
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                <span>Instant 1-click &ldquo;Sync to Sheet&rdquo; for delegate entries</span>
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                <span>Dedicated custom tab isolation per form slug</span>
              </li>
            </ul>
          </div>
        </div>

        {/* OAuth Buttons */}
        <div className="space-y-3 relative z-10 pt-2 border-t border-white/10">
          
          {/* Primary: Google OAuth */}
          <button
            type="button"
            onClick={handleGoogleSignIn}
            className="w-full py-3.5 px-4 rounded-2xl bg-white hover:bg-neutral-100 text-neutral-900 font-bold text-xs sm:text-sm flex items-center justify-center gap-3 transition cursor-pointer shadow-lg active:scale-95"
          >
            {/* Google SVG Icon */}
            <svg className="w-4 h-4" viewBox="0 0 24 24">
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
            <span>Continue with Google (Recommended)</span>
          </button>

          {/* Alternative: GitHub OAuth */}
          <button
            type="button"
            onClick={handleGitHubSignIn}
            className="w-full py-3 px-4 rounded-2xl bg-white/5 hover:bg-white/10 border border-white/15 text-white font-mono text-xs flex items-center justify-center gap-2.5 transition cursor-pointer active:scale-95"
          >
            {/* GitHub SVG Icon */}
            <svg className="w-4 h-4 fill-current text-white" viewBox="0 0 24 24">
              <path fillRule="evenodd" clipRule="evenodd" d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.53 1.032 1.53 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z" />
            </svg>
            <span>Continue with GitHub OAuth</span>
          </button>
        </div>

        {/* Footer Note */}
        <div className="text-[10px] text-neutral-500 font-mono text-center flex items-center justify-center gap-1.5 pt-1">
          <Lock className="w-3 h-3 text-neutral-400" />
          <span>Secured via Zenvitra Sovereign Identity Protocol</span>
        </div>

      </div>
    </div>
  );
}
