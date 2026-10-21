'use client';

import React, { Suspense } from 'react';
import { useParams } from 'next/navigation';
import { Navbar } from '@/components/layout/Navbar';
import { Footer } from '@/components/layout/Footer';
import { ZenPassProvider } from '@/context/ZenPassContext';
import { useZenEvents } from '@/context/ZenEventsPlatformContext';
import { DistrictHostCommandCenter } from '@/components/events/dashboard/DistrictHostCommandCenter';
import { useAuth } from '@/context/AuthContext';
import Link from 'next/link';
import { ArrowLeft, Lock, Sparkles, AlertCircle } from 'lucide-react';

function EventHostCommandCenterContent() {
  const params = useParams();
  const idOrSlug = (params?.id as string) || '';
  const { getEventById, events, updateEvent, checkInAttendee } = useZenEvents();
  const { isAuthenticated, user, profile, isLoading, continueAsGuest } = useAuth();

  const event = events.find((e) => e.id === idOrSlug || e.slug === idOrSlug) || getEventById(idOrSlug);

  if (!isLoading && !isAuthenticated && !user && !profile) {
    return (
      <div className="w-full min-h-[70vh] flex items-center justify-center p-4 sm:p-6 font-sans">
        <div className="w-full max-w-md rounded-3xl bg-[#08090f] border border-cyan-500/30 p-6 sm:p-8 text-center space-y-5 shadow-2xl">
          <div className="w-14 h-14 rounded-2xl bg-cyan-500/10 border border-cyan-500/30 flex items-center justify-center text-cyan-400 mx-auto">
            <Lock className="w-6 h-6" />
          </div>

          <div className="space-y-1">
            <h2 className="text-xl font-bold text-white">Organizer Authentication Required</h2>
            <p className="text-xs text-neutral-400">
              You must be signed in to access the District Host Command Center for this event.
            </p>
          </div>

          <div className="space-y-2.5 pt-2">
            <Link
              href={`/login?redirect=/events/${idOrSlug}/manage`}
              className="w-full py-3 px-4 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-neutral-950 font-bold text-xs uppercase tracking-wider transition flex items-center justify-center gap-2"
            >
              Sign In as Organizer
            </Link>

            <button
              type="button"
              onClick={() => continueAsGuest('organizer_demo', 'Demo Organizer')}
              className="w-full py-2.5 px-4 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-white text-xs font-semibold flex items-center justify-center gap-2 transition cursor-pointer"
            >
              <Sparkles className="w-3.5 h-3.5 text-cyan-400" />
              <span>Continue with Evaluator / Demo Pass</span>
            </button>

            <Link
              href={`/events/${idOrSlug}`}
              className="text-xs text-neutral-400 hover:text-white flex items-center justify-center gap-1 pt-1"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>Return to Public Event Page</span>
            </Link>
          </div>
        </div>
      </div>
    );
  }

  if (!event) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center p-4">
        <div className="max-w-md w-full text-center p-8 space-y-4 rounded-3xl bg-[#080a12] border border-white/10">
          <AlertCircle className="w-10 h-10 text-neutral-400 mx-auto" />
          <h2 className="text-xl font-bold text-white">Event Not Found</h2>
          <p className="text-xs text-neutral-400">
            The event &quot;{idOrSlug}&quot; could not be located in your organizer registry.
          </p>
          <Link
            href="/events/manage"
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-neutral-950 text-xs font-bold transition"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Go to All Events Command Hub</span>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 py-6 space-y-6">
      <div className="flex items-center justify-between gap-4">
        <Link
          href="/events/manage"
          className="inline-flex items-center gap-2 text-xs font-mono text-neutral-400 hover:text-white transition"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>All Hosted Summits Portfolio</span>
        </Link>

        <Link
          href={`/events/${event.id}`}
          className="text-xs font-mono text-cyan-400 hover:text-cyan-300 transition"
        >
          View Public Page &rarr;
        </Link>
      </div>

      <DistrictHostCommandCenter
        event={event}
        allEvents={events}
        onUpdateEvent={(id, updates) => updateEvent(id, updates)}
        onCheckInAttendee={(attendeeId) => checkInAttendee(event.id, attendeeId)}
      />
    </div>
  );
}

export default function EventHostManagePage() {
  return (
    <div className="min-h-screen bg-[#06080e] text-white flex flex-col justify-between font-sans selection:bg-cyan-500/20">
      <Navbar />
      <main className="flex-1 w-full">
        <ZenPassProvider>
          <Suspense fallback={<div className="min-h-[70vh] flex items-center justify-center text-xs font-mono text-neutral-400">Loading District Command Center...</div>}>
            <EventHostCommandCenterContent />
          </Suspense>
        </ZenPassProvider>
      </main>
      <Footer />
    </div>
  );
}
