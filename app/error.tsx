'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import {
  AlertTriangle,
  RotateCcw,
  ArrowLeft,
  Home,
  ShieldAlert
} from 'lucide-react';

interface ErrorProps {
  error: Error & { digest?: string };
  reset: () => void;
}

export default function GlobalErrorPage({ error, reset }: ErrorProps) {
  const [isReloading, setIsReloading] = useState(false);

  useEffect(() => {
    // Log telemetry to console for debugging
    console.error('[ZENVITRA PROTOCOL ERROR]', error);
  }, [error]);

  const handleReload = () => {
    setIsReloading(true);
    try {
      // First attempt Next.js error boundary reset
      reset();
    } catch {
      // Fallback to hard window reload
      window.location.reload();
    }
    setTimeout(() => {
      window.location.reload();
    }, 400);
  };

  const handleBack = () => {
    if (typeof window !== 'undefined' && window.history.length > 1) {
      window.history.back();
    } else {
      window.location.href = '/';
    }
  };

  return (
    <div className="min-h-screen bg-[#030405] text-white flex flex-col justify-between selection:bg-cyan-500 selection:text-black font-sans relative overflow-hidden">
      {/* Ambient background glows */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-[600px] h-[350px] bg-rose-500/10 blur-[150px] pointer-events-none rounded-full" />
      <div className="absolute bottom-10 right-1/4 w-full max-w-[400px] h-[250px] bg-cyan-500/10 blur-[140px] pointer-events-none rounded-full" />

      {/* Top Protocol Header */}
      <header className="relative z-10 w-full max-w-6xl mx-auto px-6 py-6 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-2.5 group">
          <div className="w-8 h-8 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center transition group-hover:border-white/30">
            <img src="/assets/logo.png" alt="Zenvitra" className="w-5 h-5 object-contain" />
          </div>
          <span className="font-display font-bold tracking-[0.18em] text-sm text-neutral-300 group-hover:text-white transition uppercase">
            ZENVITRA
          </span>
        </Link>

        <div className="flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-rose-500 animate-pulse" />
          <span className="font-mono text-[11px] text-neutral-400 tracking-wider uppercase">
            Fault Isolation Active
          </span>
        </div>
      </header>

      {/* Main Error Centerpiece */}
      <main className="relative z-10 max-w-xl w-full mx-auto px-6 py-12 flex flex-col items-center text-center my-auto">
        {/* Warning Icon Badge */}
        <div className="relative mb-6">
          <div className="w-20 h-20 rounded-3xl bg-white/[0.04] border border-white/15 flex items-center justify-center shadow-[0_0_50px_rgba(244,63,94,0.18)]">
            <AlertTriangle className="w-9 h-9 text-rose-400 stroke-[1.75]" />
          </div>
          <span className="absolute -bottom-1 -right-1 p-1 rounded-full bg-[#030405] border border-white/15 text-rose-400">
            <ShieldAlert className="w-3.5 h-3.5" />
          </span>
        </div>

        {/* Monospace Code Pill */}
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-rose-500/10 border border-rose-500/20 text-rose-300 font-mono text-[11px] uppercase tracking-wider mb-4">
          <span>Telemetry Variance Detected</span>
          {error.digest && (
            <>
              <span className="opacity-40">•</span>
              <span className="text-neutral-400 font-mono">#{error.digest.slice(0, 8)}</span>
            </>
          )}
        </div>

        {/* Headings */}
        <h1 className="text-3xl sm:text-4xl font-black font-display text-white tracking-tight leading-tight mb-3">
          This page couldn&apos;t load
        </h1>

        <p className="text-sm text-neutral-400 font-sans max-w-md leading-relaxed mb-8">
          A runtime interruption occurred within this sector. Your session, security state, and credentials remain safe.
        </p>

        {/* Action Controls */}
        <div className="w-full flex flex-wrap items-center justify-center gap-3">
          <button
            type="button"
            onClick={handleReload}
            disabled={isReloading}
            className="px-6 py-3 rounded-2xl bg-white text-black hover:bg-neutral-200 font-mono text-xs font-bold transition flex items-center justify-center gap-2 shadow-lg shadow-white/10 cursor-pointer disabled:opacity-60"
          >
            <RotateCcw className={`w-4 h-4 ${isReloading ? 'animate-spin' : ''}`} />
            <span>{isReloading ? 'Reloading...' : 'Reload Page'}</span>
          </button>

          <button
            type="button"
            onClick={handleBack}
            className="px-6 py-3 rounded-2xl bg-white/5 hover:bg-white/10 border border-white/15 text-white font-mono text-xs font-semibold transition flex items-center justify-center gap-2 cursor-pointer"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Go Back</span>
          </button>

          <Link
            href="/"
            className="px-5 py-3 rounded-2xl bg-white/5 hover:bg-white/10 border border-white/10 text-neutral-300 hover:text-white font-mono text-xs transition flex items-center justify-center gap-2"
          >
            <Home className="w-4 h-4" />
            <span>Nexus Home</span>
          </Link>
        </div>
      </main>

      {/* Footer */}
      <footer className="relative z-10 w-full max-w-6xl mx-auto px-6 py-6 flex flex-wrap items-center justify-between gap-4 border-t border-white/5 text-xs font-mono text-neutral-500">
        <div className="flex items-center gap-2">
          <span>ZENVITRA PROTOCOL</span>
          <span>•</span>
          <span>SOVEREIGN ARCHITECTURE</span>
        </div>
        <div className="flex items-center gap-4">
          <Link href="/contact" className="hover:text-neutral-300 transition">
            Support Node
          </Link>
          <Link href="/guidelines" className="hover:text-neutral-300 transition">
            Guidelines
          </Link>
        </div>
      </footer>
    </div>
  );
}
