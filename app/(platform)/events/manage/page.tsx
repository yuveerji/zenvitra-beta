'use client';

import React, { Suspense } from 'react';
import { ZenPassProvider } from '@/context/ZenPassContext';
import { EventManagementDashboard } from '@/components/events/dashboard/EventManagementDashboard';
import { useAuth } from '@/context/AuthContext';
import Link from 'next/link';
import { Lock, Sparkles, ArrowLeft } from 'lucide-react';

function EventManageContent() {
  const { isAuthenticated, user, profile, isLoading, continueAsGuest } = useAuth();

  if (!isLoading && !isAuthenticated && !user && !profile) {
    return (
      <div className="w-full min-h-[75vh] flex items-center justify-center p-4 sm:p-6 font-sans">
        <div className="w-full max-w-md rounded-3xl bg-[#08090f] border border-cyan-500/30 p-6 sm:p-8 text-center space-y-5 shadow-2xl">
          <div className="w-14 h-14 rounded-2xl bg-cyan-500/10 border border-cyan-500/30 flex items-center justify-center text-cyan-400 mx-auto">
            <Lock className="w-6 h-6" />
          </div>

          <div className="space-y-1">
            <h2 className="text-xl font-bold text-white">Organizer Dashboard Authentication</h2>
            <p className="text-xs text-neutral-400">
              Access to sovereign role delegation, delegate check-in, and financial metrics requires an organizer login.
            </p>
          </div>

          <div className="space-y-2.5 pt-2">
            <Link
              href="/login?redirect=/events/manage"
              className="w-full py-3 px-4 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-neutral-950 font-bold text-xs uppercase tracking-wider transition flex items-center justify-center gap-2"
            >
              Sign In as Organizer
            </Link>

            <button
              type="button"
              onClick={() => continueAsGuest('organizer_demo', 'Demo Organizer')}
              className="w-full py-2.5 px-4 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-white text-xs font-semibold flex items-center justify-center gap-2 transition"
            >
              <Sparkles className="w-3.5 h-3.5 text-cyan-400" />
              <span>Continue with Evaluator / Demo Pass</span>
            </button>

            <Link
              href="/events"
              className="text-xs text-neutral-400 hover:text-white flex items-center justify-center gap-1 pt-1"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>Return to Events Directory</span>
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 py-6">
      <EventManagementDashboard />
    </div>
  );
}

export default function EventManagePage() {
  return (
    <ZenPassProvider>
      <Suspense fallback={<div className="min-h-[75vh] flex items-center justify-center text-xs font-mono text-neutral-400">Loading Organizer Command Hub...</div>}>
        <EventManageContent />
      </Suspense>
    </ZenPassProvider>
  );
}
