'use client';

import React, { useState, useEffect, Suspense } from 'react';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import { 
  Lock, 
  Sparkles, 
  ArrowRight, 
  CheckCircle2
} from 'lucide-react';
import { useZenEvents } from '@/context/ZenEventsPlatformContext';
import { ZenPassProvider } from '@/context/ZenPassContext';
import { EventsFeed } from '@/components/events/EventsFeed';
import { EventDetail } from '@/components/events/EventDetail';
import { CreateEventModal } from '@/components/events/CreateEventModal';
import { EventManagementDashboard } from '@/components/events/dashboard/EventManagementDashboard';
import { useAccountCapabilities } from '@/hooks/useAccountCapabilities';
import { EventAccessGate } from '@/components/events/EventAccessGate';
import { useAuth } from '@/context/AuthContext';

function EventsViewSwitcher() {
  const { activeView, setActiveView } = useZenEvents();
  const searchParams = useSearchParams();

  useEffect(() => {
    if (searchParams.get('view') === 'dashboard') {
      setActiveView('dashboard');
    }
  }, [searchParams, setActiveView]);

  return (
    <>
      {activeView === 'dashboard' ? (
        <EventManagementDashboard />
      ) : activeView === 'detail' ? (
        <EventDetail />
      ) : (
        <EventsFeed />
      )}
      {activeView === 'create' && <CreateEventModal />}
    </>
  );
}

function EventsContent() {
  const searchParams = useSearchParams();
  const fromMun = searchParams.get('from') === 'mun';
  const searchQuery = searchParams.get('search') || '';

  const { user, profile, isAuthenticated, isLoading, continueAsGuest } = useAuth();
  const { isEventEnabled, isProfessionalEnabled } = useAccountCapabilities();

  const [hasCheckedAuth, setHasCheckedAuth] = useState(false);
  const [localHasSession, setLocalHasSession] = useState(false);

  useEffect(() => {
    try {
      const stored = localStorage.getItem('zenvitra_session_user') || 
                     localStorage.getItem('zenvitra_user_session') || 
                     localStorage.getItem('zenvitra_session');
      setLocalHasSession(Boolean(stored));
    } catch (_) {}
    setHasCheckedAuth(true);
  }, []);

  const hasSession = Boolean(isAuthenticated || user || profile || localHasSession);

  // Authentication barrier: Accessing events (especially through /mun) requires login
  if (!isLoading && hasCheckedAuth && !hasSession) {
    const redirectTarget = fromMun 
      ? (searchQuery ? `/events?search=${encodeURIComponent(searchQuery)}&from=mun` : '/events?from=mun')
      : (searchQuery ? `/events?search=${encodeURIComponent(searchQuery)}` : '/events');

    return (
      <div className="w-full min-h-[75vh] flex items-center justify-center p-4 sm:p-6 font-sans">
        <div className="w-full max-w-xl rounded-3xl bg-[#08090f] border border-cyan-500/30 p-6 sm:p-10 text-center space-y-6 relative overflow-hidden shadow-[0_25px_90px_rgba(0,0,0,0.9)] backdrop-blur-2xl">
          {/* Ambient Lighting */}
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-80 h-40 bg-cyan-500/10 blur-[100px] pointer-events-none rounded-full" />
          <div className="absolute bottom-0 right-0 w-60 h-60 bg-purple-500/10 blur-[100px] pointer-events-none rounded-full" />

          {/* Shield Icon */}
          <div className="w-16 h-16 rounded-2xl bg-cyan-500/10 border border-cyan-500/30 flex items-center justify-center text-cyan-400 mx-auto shadow-[0_0_30px_rgba(6,182,212,0.25)] relative z-10">
            <Lock className="w-8 h-8 animate-pulse text-cyan-400" />
          </div>

          {/* Heading */}
          <div className="space-y-2 relative z-10">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-500/10 border border-cyan-500/30 text-cyan-300 text-[10px] font-mono tracking-wider uppercase font-bold">
              <span>Sovereign Identity Required</span>
            </div>

            <h2 className="text-2xl sm:text-3xl font-display font-bold text-white tracking-tight">
              {fromMun ? 'Sign In to Access MUN Events' : 'Events Hub Login Required'}
            </h2>

            <p className="text-xs sm:text-sm text-neutral-400 max-w-md mx-auto leading-relaxed">
              {fromMun ? (
                <>
                  You are navigating to the Events Hub from <strong className="text-white">ZEN.MUN</strong>. Conference registrations, committee seat allocation, and delegate passes require an active Sovereign account.
                </>
              ) : (
                <>
                  Accessing summits, youth parliaments, and Model UN conferences requires an authenticated session. Sign in to browse agendas and register.
                </>
              )}
            </p>
          </div>

          {/* Info Badge */}
          <div className="p-3.5 rounded-2xl bg-white/[0.02] border border-white/10 text-left flex items-start gap-3 relative z-10">
            <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
            <div className="text-xs text-neutral-300 leading-relaxed font-sans">
              <span className="font-bold text-white">Public MUN Portal is Open</span>
              <p className="text-neutral-400 text-[11px] mt-0.5">
                The general discovery index at <Link href="/mun" className="text-cyan-400 hover:underline font-mono">/mun</Link> does not require login, but registering for specific events and summits does.
              </p>
            </div>
          </div>

          {/* Actions */}
          <div className="space-y-3 pt-2 relative z-10">
            <Link
              href={`/login?redirect=${encodeURIComponent(redirectTarget)}`}
              className="w-full py-3.5 px-6 rounded-2xl bg-gradient-to-r from-cyan-400 to-cyan-500 hover:from-cyan-300 hover:to-cyan-400 text-black font-display font-bold text-xs uppercase tracking-wider transition flex items-center justify-center gap-2 shadow-[0_0_25px_rgba(6,182,212,0.3)] cursor-pointer"
            >
              <Lock className="w-4 h-4 text-black" />
              <span>Sign In to Access Events</span>
            </Link>

            <button
              type="button"
              onClick={async () => {
                await continueAsGuest('delegate_guest', 'Guest Delegate');
                setLocalHasSession(true);
              }}
              className="w-full py-3 px-6 rounded-2xl bg-white/5 hover:bg-white/10 border border-white/15 text-white font-mono text-xs font-semibold transition flex items-center justify-center gap-2 cursor-pointer"
            >
              <Sparkles className="w-4 h-4 text-cyan-400" />
              <span>One-Click Guest Delegate Pass</span>
            </button>

            <Link
              href="/mun"
              className="text-xs font-mono text-neutral-400 hover:text-white transition flex items-center justify-center gap-1.5 pt-2"
            >
              <ArrowRight className="w-3.5 h-3.5 rotate-180" />
              <span>Return to Public ZEN.MUN Discovery</span>
            </Link>
          </div>
        </div>
      </div>
    );
  }

  // If authenticated and came from /mun, allow delegate browsing of events
  const allowAccess = isEventEnabled || isProfessionalEnabled || fromMun;

  return (
    <div className="w-full min-h-[calc(100vh-5.5rem)]">
      {!allowAccess ? (
        <EventAccessGate />
      ) : (
        <EventsViewSwitcher />
      )}
    </div>
  );
}

export default function EventsPage() {
  return (
    <ZenPassProvider>
      <Suspense fallback={<div className="min-h-[75vh] flex items-center justify-center text-xs font-mono text-neutral-400">Loading Events Hub...</div>}>
        <EventsContent />
      </Suspense>
    </ZenPassProvider>
  );
}