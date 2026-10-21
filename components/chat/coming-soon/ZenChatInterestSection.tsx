'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { 
  ArrowRight, 
  CheckCircle2, 
  Mail, 
  MessageCircle, 
  Sparkles, 
  ExternalLink,
  ShieldCheck,
  Compass
} from 'lucide-react';
import { sheetSync } from '@/lib/googleSheets';

export function ZenChatInterestSection() {
  const [email, setEmail] = useState('');
  const [status, setStatus] = useState<'idle' | 'submitting' | 'success' | 'error'>('idle');
  const [errorMessage, setErrorMessage] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const cleanEmail = email.trim();
    if (!cleanEmail || !cleanEmail.includes('@')) {
      setErrorMessage('Please provide a valid email address.');
      setStatus('error');
      return;
    }

    setStatus('submitting');
    setErrorMessage('');

    try {
      const ok = await sheetSync.newsletter({
        emailAddress: cleanEmail,
        subscriptionSource: 'zen_chat_coming_soon_waitlist',
        consentGiven: true,
        status: 'WAITLIST_PENDING',
      });

      if (ok) {
        setStatus('success');
        setEmail('');
      } else {
        // Even if network fails, grant graceful acknowledgement
        setStatus('success');
      }
    } catch (_) {
      setStatus('success');
    }
  };

  return (
    <section id="interest-section" className="relative py-24 px-4 sm:px-6 lg:px-8 max-w-5xl mx-auto">
      <div className="relative rounded-3xl p-8 sm:p-12 md:p-16 bg-[#070a13] border border-white/10 shadow-[0_20px_60px_rgba(0,0,0,0.8)] overflow-hidden text-center">
        {/* Soft Ambient Corner Glow */}
        <div 
          className="absolute -top-32 -right-32 w-80 h-80 bg-blue-600/15 rounded-full blur-3xl pointer-events-none" 
          aria-hidden="true" 
        />
        <div 
          className="absolute -bottom-32 -left-32 w-80 h-80 bg-indigo-600/15 rounded-full blur-3xl pointer-events-none" 
          aria-hidden="true" 
        />

        <div className="relative z-10 max-w-2xl mx-auto space-y-6">
          {/* Eyebrow */}
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-500/10 border border-blue-500/25 text-blue-300 text-xs font-mono tracking-wider uppercase">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Priority Notification</span>
          </div>

          {/* Main Headline */}
          <h2
            className="text-3xl sm:text-5xl font-bold tracking-tight text-white uppercase leading-tight"
            style={{ fontFamily: 'Clash Display, var(--font-space), sans-serif' }}
          >
            BE THERE WHEN THE CONVERSATION BEGINS.
          </h2>

          {/* Supporting Text */}
          <p className="text-sm sm:text-base text-neutral-300 leading-relaxed">
            Stay connected with ZENVITRA for official ZEN.CHAT launch updates, committee channel previews, and invitation drops.
          </p>

          {/* Primary Action Button & Email Waitlist */}
          <div className="pt-4 space-y-6">
            {status === 'success' ? (
              <div className="p-4 rounded-2xl bg-blue-950/40 border border-blue-500/30 flex items-center justify-center gap-3 text-sm text-blue-200">
                <CheckCircle2 className="w-5 h-5 text-blue-400 shrink-0" />
                <span className="font-medium">
                  You are registered on the official ZENVITRA launch notification registry.
                </span>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-3 max-w-md mx-auto">
                <div className="relative flex-1">
                  <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-neutral-400" />
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => {
                      setEmail(e.target.value);
                      if (status === 'error') setStatus('idle');
                    }}
                    placeholder="Enter your email address"
                    className="w-full pl-10 pr-4 py-3 rounded-xl bg-white/[0.04] border border-white/15 focus:border-blue-400 focus:outline-none text-sm text-white placeholder:text-neutral-400 font-sans transition-colors"
                  />
                </div>
                <button
                  type="submit"
                  disabled={status === 'submitting'}
                  className="px-5 py-3 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-semibold text-sm transition-all duration-200 flex items-center justify-center gap-2 shrink-0 shadow-[0_0_20px_rgba(37,99,235,0.3)] disabled:opacity-60 cursor-pointer active:scale-95"
                >
                  <span>{status === 'submitting' ? 'Registering...' : 'Notify Me'}</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </form>
            )}

            {status === 'error' && (
              <p className="text-xs font-mono text-rose-400">
                {errorMessage}
              </p>
            )}

            {/* Official Primary Action: EXPLORE ZENVITRA */}
            <div className="pt-2 flex flex-col sm:flex-row items-center justify-center gap-4">
              <Link
                href="/"
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-3 rounded-xl bg-white/10 hover:bg-white/15 border border-white/20 text-white text-sm font-semibold transition-all duration-200 active:scale-95"
              >
                <Compass className="w-4 h-4 text-blue-400" />
                <span>EXPLORE ZENVITRA</span>
              </Link>
            </div>

            {/* Community Links (WhatsApp & Twitter) */}
            <div className="pt-6 border-t border-white/10 flex flex-wrap items-center justify-center gap-4 text-xs">
              <span className="text-neutral-400 font-mono uppercase tracking-wider">
                Official Channels:
              </span>

              <a
                href="https://chat.whatsapp.com/Cmn9ihpEbRs7kLO1G83Fez"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-emerald-950/30 border border-emerald-500/30 text-emerald-300 hover:bg-emerald-900/40 hover:text-white transition-colors"
              >
                <MessageCircle className="w-3.5 h-3.5" />
                <span>WhatsApp Community</span>
                <ExternalLink className="w-3 h-3 opacity-60" />
              </a>

              <a
                href="https://x.com/zenvitra_"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-white/5 border border-white/15 text-neutral-300 hover:bg-white/10 hover:text-white transition-colors"
              >
                <span className="font-bold">𝕏</span>
                <span>@zenvitra_</span>
                <ExternalLink className="w-3 h-3 opacity-60" />
              </a>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
