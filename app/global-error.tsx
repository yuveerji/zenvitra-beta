'use client';

import React, { useEffect, useState } from 'react';
import { AlertTriangle, RotateCcw, Home, Terminal, ShieldAlert } from 'lucide-react';

export default function RootGlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  const [isReloading, setIsReloading] = useState(false);

  useEffect(() => {
    console.error('[ZENVITRA GLOBAL ROOT ERROR]', error);
  }, [error]);

  const handleReload = () => {
    setIsReloading(true);
    try {
      reset();
    } catch {
      window.location.reload();
    }
    setTimeout(() => {
      window.location.reload();
    }, 400);
  };

  return (
    <html lang="en" className="dark">
      <head>
        <title>ZENVITRA — Transmission Interrupted</title>
        <meta name="viewport" content="width=device-width, initial-scale=1" />
      </head>
      <body className="min-h-screen bg-[#030405] text-white flex flex-col justify-between selection:bg-cyan-500 selection:text-black font-sans antialiased m-0 p-0">
        <main className="max-w-xl w-full mx-auto px-6 py-20 flex flex-col items-center text-center my-auto">
          <div className="w-20 h-20 rounded-3xl bg-white/[0.04] border border-white/15 flex items-center justify-center mb-6 shadow-2xl">
            <AlertTriangle className="w-9 h-9 text-rose-400 stroke-[1.75]" />
          </div>

          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-rose-500/10 border border-rose-500/20 text-rose-300 font-mono text-[11px] uppercase tracking-wider mb-4">
            <ShieldAlert className="w-3.5 h-3.5" />
            <span>Root Boundary Intercept</span>
          </div>

          <h1 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight mb-3">
            This page couldn&apos;t load
          </h1>

          <p className="text-sm text-neutral-400 max-w-md leading-relaxed mb-8">
            An unforeseen anomaly occurred at the system root. Reload to re-initialize the node, or return to the main nexus.
          </p>

          <div className="flex flex-wrap items-center justify-center gap-3">
            <button
              type="button"
              onClick={handleReload}
              disabled={isReloading}
              className="px-6 py-3 rounded-2xl bg-white text-black hover:bg-neutral-200 font-mono text-xs font-bold transition flex items-center gap-2 cursor-pointer disabled:opacity-60"
            >
              <RotateCcw className={`w-4 h-4 ${isReloading ? 'animate-spin' : ''}`} />
              <span>{isReloading ? 'Reloading...' : 'Reload Page'}</span>
            </button>

            <button
              type="button"
              onClick={() => {
                window.location.href = '/';
              }}
              className="px-6 py-3 rounded-2xl bg-white/5 hover:bg-white/10 border border-white/15 text-white font-mono text-xs font-semibold transition flex items-center gap-2 cursor-pointer"
            >
              <Home className="w-4 h-4" />
              <span>Return Home</span>
            </button>
          </div>

          {error?.digest && (
            <p className="mt-8 font-mono text-[11px] text-neutral-500">
              Digest #{error.digest}
            </p>
          )}
        </main>
      </body>
    </html>
  );
}
