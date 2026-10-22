'use client';

import React, { useState, useMemo, useEffect } from 'react';
import Link from 'next/link';
import { useParams, useRouter } from 'next/navigation';
import {
  ArrowLeft,
  Calendar,
  Building2,
  Clock,
  Layers,
  Sparkles,
  Search,
  CheckCircle2,
  Plus,
  Share2,
  Download,
  ShieldCheck,
  UserCheck,
  Award,
  Globe2,
  Lock,
  ExternalLink,
  Users,
  Ticket,
  MapPin,
  Check,
  ChevronRight,
  Flame,
  Radio,
  CreditCard,
  AlertCircle
} from 'lucide-react';
import { Navbar } from '@/components/layout/Navbar';
import { Footer } from '@/components/layout/Footer';
import { useMun } from '@/context/MunContext';
import { useZenEvents } from '@/context/ZenEventsPlatformContext';
import { useZenPass } from '@/context/ZenPassContext';
import { useAuth } from '@/context/AuthContext';
import { computeConferenceStatus } from '@/lib/conferenceStatusHelper';
import { ZenPassBookingModal } from '@/components/events/ZenPassBookingModal';
import { EventPlansPaymentLinksModal } from '@/components/payments/EventPlansPaymentLinksModal';
import { MunCommittee, MunConference } from '@/types/mun';
import { ZenEvent } from '@/types/events';

/**
 * Direct Showcase Route: domain/[event-name]
 * e.g. zenvitra.xyz/global-mun-2026
 *      zenvitra.xyz/zen-diplomacy
 */
export default function DirectEventShowcasePage() {
  const params = useParams();
  const router = useRouter();

  const rawSlug = Array.isArray(params?.mun) ? params.mun[0] : (params?.mun as string) || '';
  const eventSlug = decodeURIComponent(rawSlug).toLowerCase().trim();

  const { conferences, committees, activeConference, setActiveConferenceId, updateConference } = useMun();
  const { events, getEventById } = useZenEvents();
  const { getPassesForEvent } = useZenPass();
  const { user, profile } = useAuth();

  const [isBookingModalOpen, setIsBookingModalOpen] = useState(false);
  const [isPlansModalOpen, setIsPlansModalOpen] = useState(false);
  const [isCopied, setIsCopied] = useState(false);
  const [hasMounted, setHasMounted] = useState(false);

  useEffect(() => {
    setHasMounted(true);
  }, []);

  // 1. Check if slug matches a MUN Conference
  const matchedConference: MunConference | undefined = useMemo(() => {
    if (!eventSlug) return undefined;
    return (
      conferences.find((c) => c.slug?.toLowerCase() === eventSlug || c.id.toLowerCase() === eventSlug) ||
      conferences.find((c) => c.name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '') === eventSlug)
    );
  }, [eventSlug, conferences]);

  // 2. Check if slug matches a standard ZenEvent
  const matchedEvent: ZenEvent | undefined = useMemo(() => {
    if (!eventSlug) return undefined;
    return (
      events.find((e) => e.slug?.toLowerCase() === eventSlug || e.id.toLowerCase() === eventSlug) ||
      events.find((e) => e.title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '') === eventSlug) ||
      getEventById(eventSlug)
    );
  }, [eventSlug, events, getEventById]);

  // If user handle matches instead of an event, forward to user space or system routes
  useEffect(() => {
    if (!matchedConference && !matchedEvent && eventSlug) {
      if (['committee', 'host', 'pulse', 'docs', 'legislate', 'chat', 'call', 'stage'].includes(eventSlug)) {
        router.replace(`/${eventSlug}`);
        return;
      }
      const knownUsers = ['yuveer', 'test', 'admin'];
      if (knownUsers.includes(eventSlug)) {
        router.replace(`/space/${eventSlug}`);
      }
    }
  }, [matchedConference, matchedEvent, eventSlug, router]);

  // Compute conference status
  const statusInfo = computeConferenceStatus(matchedConference);

  // Unified event representation for booking modal & showcase
  const unifiedEvent = useMemo(() => {
    if (matchedConference) {
      return {
        id: matchedConference.id,
        slug: matchedConference.slug || matchedConference.id,
        title: matchedConference.name,
        description: matchedConference.tagline || 'Sovereign Youth Diplomacy & Committee Plenary',
        coverImage: 'https://images.unsplash.com/photo-1540575467063-178a50c2df87?auto=format&fit=crop&w=1200&q=80',
        type: 'hybrid' as const,
        category: 'MUN' as const,
        status: 'upcoming' as const,
        date: matchedConference.startDate,
        endDate: matchedConference.endDate,
        time: '09:00 - 18:00 IST',
        location: matchedConference.location || 'Live Matrix',
        city: 'New Delhi',
        organizerId: 'secretariat',
        organizerName: matchedConference.secretariatChair || 'Secretariat Office',
        organizerUsername: 'secretariat',
        createdAt: matchedConference.conveningDate || '2026-10-17T09:00:00.000Z',
        ticketPrice: matchedConference.ticketPrice || 0,
        plans: matchedConference.plans || [],
        attendees: [],
        tags: ['mun', 'diplomacy', 'matrix', 'showcase']
      };
    }
    if (matchedEvent) {
      return matchedEvent;
    }
    return null;
  }, [matchedConference, matchedEvent]);

  // Hosted committees for this event
  const eventCommittees = useMemo<MunCommittee[]>(() => {
    if (matchedConference?.committees && matchedConference.committees.length > 0) {
      return matchedConference.committees.map((comm) => {
        if (typeof comm === 'string') {
          return (
            committees.find((c) => c.id === comm || c.shortName === comm) || {
              id: comm,
              eventId: matchedConference.id,
              name: comm.toUpperCase(),
              shortName: comm.toUpperCase(),
              agenda: 'Plenary Deliberations & Working Papers',
              type: 'UNSC' as const,
              totalDelegates: 15,
              presentCount: 0,
              presentAndVotingCount: 0,
              quorumNeeded: 9,
              dais: { chair: 'Presiding Officer', viceChair: 'Rapporteur' },
            }
          );
        }
        return comm as MunCommittee;
      });
    }
    return committees.slice(0, 4);
  }, [matchedConference, committees]);

  const firstCommitteeCode = (eventCommittees[0]?.shortName || eventCommittees[0]?.id || 'unsc').toLowerCase();

  const handleShareLink = () => {
    if (typeof window !== 'undefined') {
      const url = `${window.location.origin}/${eventSlug}`;
      navigator.clipboard.writeText(url);
      setIsCopied(true);
      setTimeout(() => setIsCopied(false), 2000);
    }
  };

  // 1. Loading skeleton during initial SSR and mount
  if (!hasMounted) {
    return (
      <div className="min-h-screen bg-[#030406] text-white font-sans flex flex-col justify-between selection:bg-cyan-500 selection:text-black">
        <Navbar />
        <main className="max-w-xl mx-auto px-6 py-32 text-center space-y-4 my-auto">
          <div className="w-8 h-8 border-2 border-cyan-400 border-t-transparent rounded-full animate-spin mx-auto" />
          <p className="text-xs font-mono text-neutral-400 uppercase tracking-widest">
            Synchronizing Event Node...
          </p>
        </main>
        <Footer />
      </div>
    );
  }

  // 2. If after mount, no event found
  if (!unifiedEvent) {
    return (
      <div className="min-h-screen bg-[#030406] text-white font-sans flex flex-col justify-between selection:bg-cyan-500 selection:text-black">
        <Navbar />
        <main className="max-w-xl mx-auto px-6 py-24 text-center space-y-6 my-auto">
          <div className="w-16 h-16 rounded-3xl bg-white/5 border border-white/10 flex items-center justify-center mx-auto text-neutral-400">
            <AlertCircle className="w-8 h-8 text-cyan-400" />
          </div>
          <div className="space-y-2">
            <h1 className="text-2xl font-extrabold font-display text-white">Event Showcase Not Found</h1>
            <p className="text-xs text-neutral-400 font-sans leading-relaxed">
              No active subscription event or conference matches <code className="text-cyan-300">/{eventSlug}</code>.
            </p>
          </div>
          <div className="pt-2 flex flex-wrap items-center justify-center gap-3">
            <Link
              href="/events"
              className="px-5 py-2.5 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-black font-mono text-xs font-bold transition shadow-lg shadow-cyan-500/20"
            >
              Browse All Events
            </Link>
            <Link
              href="/mun"
              className="px-5 py-2.5 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-white font-mono text-xs font-semibold transition"
            >
              Go to MUN Dais
            </Link>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  const plans = unifiedEvent.plans || [];

  return (
    <div className="min-h-screen bg-[#030406] text-white font-sans flex flex-col selection:bg-cyan-500 selection:text-black">
      <Navbar />

      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 pt-24 pb-20 space-y-10 text-left">
        {/* Navigation Breadcrumb & Direct Showcase Bar */}
        <div className="flex flex-wrap items-center justify-between gap-4">
          <Link
            href="/events"
            className="inline-flex items-center gap-2 text-xs font-mono text-neutral-400 hover:text-white transition"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>&larr; All Events Directory</span>
          </Link>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={handleShareLink}
              className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-xs font-mono text-neutral-300 hover:text-white transition cursor-pointer"
            >
              {isCopied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Share2 className="w-3.5 h-3.5 text-cyan-400" />}
              <span>{isCopied ? 'Showcase Copied!' : 'Share Showcase'}</span>
            </button>

            <Link
              href={`/${eventSlug}/${firstCommitteeCode}/matrix`}
              className="inline-flex items-center gap-1.5 px-4 py-1.5 rounded-xl bg-cyan-500 text-black hover:bg-cyan-400 text-xs font-mono font-bold transition cursor-pointer shadow-lg shadow-cyan-500/20"
            >
              <Layers className="w-3.5 h-3.5" />
              <span>Seat Matrix &rarr;</span>
            </Link>
          </div>
        </div>

        {/* ─── MASTERPIECE EVENT SHOWCASE HERO ─── */}
        <div className="relative rounded-3xl bg-gradient-to-b from-[#0c0f1c]/90 via-[#080a13]/95 to-[#05060b] border border-white/10 overflow-hidden shadow-2xl p-6 sm:p-10">
          <div className="absolute top-0 right-0 w-[500px] h-[300px] bg-cyan-500/10 blur-[130px] pointer-events-none rounded-full" />
          <div className="absolute bottom-0 left-0 w-[400px] h-[300px] bg-purple-500/10 blur-[130px] pointer-events-none rounded-full" />

          <div className="relative z-10 flex flex-col lg:flex-row lg:items-center justify-between gap-8">
            {/* Left Content */}
            <div className="space-y-4 max-w-3xl">
              <div className="flex flex-wrap items-center gap-2.5">
                <span className={`text-[10px] font-mono font-bold px-3 py-1 rounded-full border ${
                  statusInfo.isLive
                    ? 'bg-emerald-500/15 text-emerald-300 border-emerald-500/30 animate-pulse'
                    : statusInfo.status === 'CONCLUDED'
                    ? 'bg-neutral-500/20 text-neutral-300 border-neutral-500/30'
                    : 'bg-amber-500/15 text-amber-300 border-amber-500/30'
                }`}>
                  {statusInfo.displayText}
                </span>

                <span className="text-[10px] font-mono px-3 py-1 rounded-full bg-cyan-500/10 text-cyan-300 border border-cyan-500/30 font-bold uppercase tracking-wider">
                  DIRECT SHOWCASE
                </span>

                <span className="text-[10px] font-mono px-2.5 py-1 rounded-full bg-white/5 border border-white/10 text-neutral-400 flex items-center gap-1">
                  <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
                  <span>Verified Host</span>
                </span>
              </div>

              <h1 className="text-3xl sm:text-5xl lg:text-6xl font-black font-display text-white tracking-tight leading-[1.05]">
                {unifiedEvent.title}
              </h1>

              <p className="text-sm sm:text-base text-neutral-300 font-sans leading-relaxed">
                {unifiedEvent.description}
              </p>

              {/* Event Timing & Location Badges */}
              <div className="flex flex-wrap items-center gap-4 text-xs font-mono text-neutral-400 pt-2">
                <div className="flex items-center gap-2 bg-white/5 px-3 py-1.5 rounded-xl border border-white/10">
                  <Calendar className="w-4 h-4 text-cyan-400" />
                  <span className="text-white font-bold">{unifiedEvent.date}</span>
                  {unifiedEvent.endDate && unifiedEvent.endDate !== unifiedEvent.date && (
                    <span>&mdash; {unifiedEvent.endDate}</span>
                  )}
                </div>

                <div className="flex items-center gap-2 bg-white/5 px-3 py-1.5 rounded-xl border border-white/10">
                  <Clock className="w-4 h-4 text-amber-400" />
                  <span>{unifiedEvent.time || 'Full Day Plenary'}</span>
                </div>

                <div className="flex items-center gap-2 bg-white/5 px-3 py-1.5 rounded-xl border border-white/10">
                  <MapPin className="w-4 h-4 text-rose-400" />
                  <span className="text-white">{unifiedEvent.location || 'Live Chamber / Matrix'}</span>
                </div>

                <div className="flex items-center gap-2 bg-white/5 px-3 py-1.5 rounded-xl border border-white/10">
                  <Building2 className="w-4 h-4 text-purple-400" />
                  <span>{unifiedEvent.organizerName || 'Secretariat Office'}</span>
                </div>
              </div>
            </div>

            {/* Right Booking & Action Box */}
            <div className="rounded-2xl bg-white/[0.03] border border-white/10 p-6 space-y-4 lg:min-w-[320px] backdrop-blur-xl shrink-0">
              <div className="space-y-1">
                <span className="text-[11px] font-mono text-neutral-400 uppercase tracking-wider block">
                  Delegate Admission
                </span>
                <div className="flex items-baseline gap-2">
                  <span className="text-2xl font-black font-mono text-amber-400">
                    {unifiedEvent.ticketPrice && unifiedEvent.ticketPrice > 0
                      ? `₹${unifiedEvent.ticketPrice}`
                      : 'Free / Tiered'}
                  </span>
                  {unifiedEvent.ticketPrice && unifiedEvent.ticketPrice > 0 && (
                    <span className="text-xs font-mono text-neutral-400">INR</span>
                  )}
                </div>
              </div>

              <div className="space-y-2.5 pt-2">
                <button
                  type="button"
                  onClick={() => setIsBookingModalOpen(true)}
                  className="w-full py-3.5 px-4 rounded-xl bg-gradient-to-r from-amber-400 to-amber-500 hover:brightness-110 text-black font-extrabold text-xs uppercase tracking-wider transition flex items-center justify-center gap-2 cursor-pointer shadow-xl shadow-amber-500/20 active:scale-95"
                >
                  <Ticket className="w-4 h-4" />
                  <span>Register &amp; Get Passes</span>
                </button>

                <Link
                  href={`/${eventSlug}/${firstCommitteeCode}/matrix`}
                  className="w-full py-3 px-4 rounded-xl bg-cyan-500/10 hover:bg-cyan-500/20 border border-cyan-500/30 text-cyan-300 font-semibold text-xs transition flex items-center justify-center gap-2 cursor-pointer"
                >
                  <Layers className="w-4 h-4" />
                  <span>Explore Seat Matrix</span>
                </Link>
              </div>

              <div className="pt-2 border-t border-white/5 flex items-center justify-between text-[11px] font-mono text-neutral-400">
                <span>Direct Access:</span>
                <span className="text-cyan-400 font-bold">/{eventSlug}</span>
              </div>
            </div>
          </div>
        </div>

        {/* ─── SUBSCRIPTION PLANS & REGISTRATION TIERS SHOWCASE ─── */}
        {plans.length > 0 && (
          <div className="rounded-3xl bg-[#080a13] border border-white/10 p-6 sm:p-8 space-y-6">
            <div className="flex flex-wrap items-center justify-between gap-4 border-b border-white/10 pb-4">
              <div>
                <span className="text-[10px] font-mono font-bold text-purple-400 uppercase tracking-widest block">
                  OFFICIAL ADMISSION TIERS
                </span>
                <h2 className="text-xl sm:text-2xl font-bold font-display text-white mt-0.5">
                  Available Registration Plans ({plans.length})
                </h2>
              </div>
              <span className="text-xs font-mono text-neutral-400">
                Select your preferred pass tier for instant verification
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {plans.map((plan) => (
                <div
                  key={plan.id}
                  className="p-5 rounded-2xl bg-white/[0.02] border border-white/10 hover:border-purple-500/40 transition flex flex-col justify-between space-y-4 group"
                >
                  <div className="space-y-3">
                    <div className="flex items-start justify-between gap-2">
                      <h3 className="font-bold text-base text-white group-hover:text-purple-200 transition">
                        {plan.name}
                      </h3>
                      {plan.badge && (
                        <span className="text-[9px] font-mono font-bold px-2 py-0.5 rounded-full bg-purple-500/20 text-purple-300 border border-purple-500/30 shrink-0">
                          {plan.badge}
                        </span>
                      )}
                    </div>

                    <p className="text-xs text-neutral-400 leading-relaxed font-sans">
                      {plan.description}
                    </p>

                    {plan.perks && plan.perks.length > 0 && (
                      <div className="space-y-1.5 pt-1">
                        {plan.perks.map((perk, i) => (
                          <div key={i} className="flex items-center gap-2 text-xs text-neutral-300 font-sans">
                            <span className="text-emerald-400 text-xs font-bold">✓</span>
                            <span>{perk}</span>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>

                  <div className="pt-4 border-t border-white/5 flex items-center justify-between">
                    <div className="flex items-baseline gap-1 font-mono">
                      <span className="text-xl font-black text-amber-400">
                        {plan.price > 0 ? `₹${plan.price}` : 'FREE'}
                      </span>
                      {plan.price > 0 && <span className="text-[10px] text-neutral-400">INR</span>}
                    </div>

                    <button
                      type="button"
                      onClick={() => setIsBookingModalOpen(true)}
                      className="px-4 py-2 rounded-xl bg-purple-500/20 hover:bg-purple-500/30 border border-purple-500/40 text-purple-200 font-sans text-xs font-bold transition cursor-pointer active:scale-95"
                    >
                      Select Tier &rarr;
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ─── COMMITTEES LINEUP & MATRIX ACCESS ─── */}
        {eventCommittees.length > 0 && (
          <div className="rounded-3xl bg-[#080a13] border border-white/10 p-6 sm:p-8 space-y-6">
            <div className="flex flex-wrap items-center justify-between gap-4 border-b border-white/10 pb-4">
              <div>
                <span className="text-[10px] font-mono font-bold text-cyan-400 uppercase tracking-widest block">
                  PARLIAMENTARY CHAMBERS &amp; SIMULATIONS
                </span>
                <h2 className="text-xl sm:text-2xl font-bold font-display text-white mt-0.5">
                  Featured Committees &amp; Agendas ({eventCommittees.length})
                </h2>
              </div>

              <Link
                href={`/${eventSlug}/${firstCommitteeCode}/matrix`}
                className="text-xs font-mono text-cyan-400 hover:underline flex items-center gap-1"
              >
                <span>Full Allocation Matrix</span>
                <ChevronRight className="w-4 h-4" />
              </Link>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {eventCommittees.map((comm) => {
                const code = (comm.shortName || comm.id).toLowerCase();
                return (
                  <div
                    key={comm.id}
                    className="p-5 rounded-2xl bg-white/[0.02] border border-white/10 hover:border-cyan-500/40 transition flex flex-col justify-between space-y-4"
                  >
                    <div className="space-y-2">
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-mono font-bold text-cyan-400 uppercase tracking-wider">
                          {comm.shortName || comm.id}
                        </span>
                        <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-white/5 border border-white/10 text-neutral-300">
                          {String(comm.type || 'CHAMBER').replace(/_/g, ' ')}
                        </span>
                      </div>

                      <h3 className="font-bold text-base text-white">
                        {comm.name}
                      </h3>

                      <p className="text-xs text-neutral-400 leading-relaxed font-sans line-clamp-2">
                        {comm.agenda || 'General parliamentary debates, working papers, and draft resolutions.'}
                      </p>
                    </div>

                    <div className="pt-3 border-t border-white/5 flex items-center justify-between">
                      <span className="text-xs font-mono text-neutral-400">
                        {comm.totalDelegates || 20} Delegates
                      </span>

                      <Link
                        href={`/${eventSlug}/${code}/matrix`}
                        className="px-3.5 py-1.5 rounded-xl bg-cyan-500/10 hover:bg-cyan-500/20 border border-cyan-500/30 text-cyan-300 font-mono text-xs font-semibold transition"
                      >
                        Open Matrix &rarr;
                      </Link>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* ─── LIVE CHAMBER FLOOR & RULES OF PROCEDURE ─── */}
        <div className="p-6 sm:p-8 rounded-3xl bg-gradient-to-r from-cyan-500/5 via-purple-500/5 to-transparent border border-white/10 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
          <div className="space-y-1.5 max-w-2xl">
            <div className="flex items-center gap-2 text-cyan-400 text-xs font-mono font-bold">
              <Radio className="w-4 h-4 animate-pulse" />
              <span>LIVE INTERACTIVE CHAMBER FLOOR</span>
            </div>
            <h3 className="text-lg font-bold text-white font-display">
              Preside as Chair, Roll Call, or Deliver Speeches
            </h3>
            <p className="text-xs text-neutral-400 font-sans leading-relaxed">
              Delegates and executive board members can access real-time timers, speaker queues, and moderated caucuses inside ZENVITRA&apos;s Chamber Dais.
            </p>
          </div>

          <Link
            href={`/committee?room=${eventSlug}`}
            className="px-5 py-3 rounded-2xl bg-white text-black font-mono text-xs font-bold hover:bg-neutral-200 transition shrink-0 cursor-pointer shadow-lg shadow-white/10"
          >
            Enter Live Chamber Floor
          </Link>
        </div>
      </main>

      <Footer />

      {/* Booking Modal */}
      {unifiedEvent && (
        <ZenPassBookingModal
          isOpen={isBookingModalOpen}
          onClose={() => setIsBookingModalOpen(false)}
          event={unifiedEvent as any}
        />
      )}

      {/* Plans Modal */}
      {matchedConference && (
        <EventPlansPaymentLinksModal
          isOpen={isPlansModalOpen}
          onClose={() => setIsPlansModalOpen(false)}
          eventId={matchedConference.id}
          eventTitle={matchedConference.name}
          initialPlans={matchedConference.plans || []}
          onSavePlans={(newPlans) => {
            updateConference(matchedConference.id, { plans: newPlans });
          }}
        />
      )}
    </div>
  );
}
