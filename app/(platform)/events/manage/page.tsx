'use client';

import React, { Suspense } from 'react';
import { ZenPassProvider } from '@/context/ZenPassContext';
import { EventManagementDashboard } from '@/components/events/dashboard/EventManagementDashboard';
import { useAuth } from '@/context/AuthContext';
import Link from 'next/link';
import { Lock, Sparkles, ArrowLeft } from 'lucide-react';
import { checkFeatureAccess } from '@/lib/subscriptionTiers';
import { isFounder, isAdmin } from '@/lib/founderControl';

import { useSearchParams } from 'next/navigation';

function EventManageContent() {
  const { isAuthenticated, user, profile, isLoading, continueAsGuest } = useAuth();
  const searchParams = useSearchParams();
  const eventIdParam = searchParams.get('eventId') || searchParams.get('id') || undefined;

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

  const isPrivileged = Boolean(
    isFounder(profile?.username || profile?.email || '', profile?.role) ||
    isAdmin(profile?.username || profile?.email || '', profile?.role)
  );

  const { hasAccess: canManageEvents, requiredTierLabel } = checkFeatureAccess(
    'EVENT_MANAGEMENT_CONSOLE',
    profile || user,
    isPrivileged
  );

  if (!canManageEvents) {
    return (
      <div className="w-full min-h-[75vh] flex items-center justify-center p-4 sm:p-6 font-sans">
        <div className="w-full max-w-md rounded-3xl bg-[#08090f] border border-amber-500/30 p-6 sm:p-8 text-center space-y-5 shadow-2xl">
          <div className="w-14 h-14 rounded-2xl bg-amber-500/10 border border-amber-500/30 flex items-center justify-center text-amber-400 mx-auto">
            <Lock className="w-6 h-6" />
          </div>

          <div className="space-y-1">
            <h2 className="text-xl font-bold text-white">Event Organizer Suite Locked</h2>
            <p className="text-xs text-neutral-400">
              Access to full delegation CRM, automated attendee confirmation, and registration financial telemetry requires an active <span className="text-amber-300 font-semibold">{requiredTierLabel}</span> subscription verified via Cashfree PG.
            </p>
          </div>

          <div className="space-y-2.5 pt-2">
            <Link
              href="/pricing"
              className="w-full py-3 px-4 rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-neutral-950 font-bold text-xs uppercase tracking-wider transition flex items-center justify-center gap-2 shadow-[0_0_20px_rgba(245,158,11,0.4)]"
            >
              <span>Unlock on /pricing</span>
              <Sparkles className="w-4 h-4" />
            </Link>

            <Link
              href="/plan"
              className="w-full py-2.5 px-4 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-white text-xs font-semibold flex items-center justify-center gap-2 transition"
            >
              <span>View Entitlements Matrix (/plan)</span>
            </Link>

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
      <EventManagementDashboard defaultEventId={eventIdParam} />
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
