'use client';

import React, { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { 
  ArrowLeft, 
  Calendar, 
  MapPin, 
  Users, 
  Ticket, 
  ShieldCheck, 
  Sparkles, 
  AlertCircle, 
  Share2, 
  Check, 
  Clock,
  Briefcase,
  LifeBuoy
} from 'lucide-react';
import { Navbar } from '@/components/layout/Navbar';
import { Footer } from '@/components/layout/Footer';
import { useZenEvents } from '@/context/ZenEventsPlatformContext';
import { useZenPass } from '@/context/ZenPassContext';
import { ZenPassBookingModal } from '@/components/events/ZenPassBookingModal';
import { RecruitmentOpenBanner } from '@/components/events/RecruitmentOpenBanner';
import { EventTeamShowcase } from '@/components/events/EventTeamShowcase';
import { EventRecruitmentShowcase } from '@/components/events/EventRecruitmentShowcase';
import { EventSupportDesk } from '@/components/events/EventSupportDesk';

export default function DynamicEventPublicPage() {
  const params = useParams();
  const router = useRouter();
  const idOrSlug = (params?.id as string) || '';

  const { getEventById, events } = useZenEvents();
  const { getPassesForEvent, setActivePassForModal } = useZenPass();

  const [showBookingModal, setShowBookingModal] = useState(false);
  const [copiedLink, setCopiedLink] = useState(false);
  const [config, setConfig] = useState<any>(null);
  const [activeTab, setActiveTab] = useState<'overview' | 'team' | 'recruit' | 'support'>('overview');

  // If this is our official MUN event, immediately redirect to /zen-diplomacy
  useEffect(() => {
    if (
      idOrSlug === 'zen-diplomacy' ||
      idOrSlug === 'zen-diplomacy-mun-2026' ||
      idOrSlug.toLowerCase().includes('diplomacy')
    ) {
      router.replace('/zen-diplomacy');
    }
  }, [idOrSlug, router]);

  // Find the event by ID or slug
  const event = events.find((e) => e.id === idOrSlug || e.slug === idOrSlug) || getEventById(idOrSlug);

  if (idOrSlug === 'zen-diplomacy' || idOrSlug === 'zen-diplomacy-mun-2026' || idOrSlug.toLowerCase().includes('diplomacy')) {
    return (
      <div className="min-h-screen bg-[#06080e] flex items-center justify-center p-4 text-white font-mono text-xs">
        <div className="flex items-center gap-2">
          <span className="w-2.5 h-2.5 rounded-full bg-cyan-400 animate-ping" />
          <span>Redirecting to ZEN.DIPLOMACY Assembly Hub...</span>
        </div>
      </div>
    );
  }

  if (!event) {
    return (
      <div className="min-h-screen bg-[#06080e] text-white flex flex-col justify-between font-sans">
        <Navbar />
        <div className="max-w-md mx-auto text-center p-8 space-y-4 my-auto">
          <div className="w-12 h-12 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center mx-auto text-neutral-400">
            <AlertCircle className="w-6 h-6" />
          </div>
          <h2 className="text-xl font-bold font-display text-white">Event Not Found</h2>
          <p className="text-xs text-neutral-400">
            The event &quot;{idOrSlug}&quot; could not be located on the platform. It may have concluded or the URL is invalid.
          </p>
          <div className="pt-2">
            <Link
              href="/events"
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-cyan-400 hover:bg-cyan-300 text-black font-mono text-xs font-bold transition"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>Browse All Events</span>
            </Link>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  const eventDate = new Date(event.date);
  const myPasses = getPassesForEvent(event.id);
  const myPass = myPasses[0];

  useEffect(() => {
    if (!event?.id) return;
    let isMounted = true;
    fetch(`/api/events/recruit/config?eventId=${encodeURIComponent(event.id)}`)
      .then((res) => res.json())
      .then((data) => {
        if (isMounted && data.success && data.config) {
          setConfig(data.config);
        }
      })
      .catch(() => {});
    return () => {
      isMounted = false;
    };
  }, [event?.id]);

  const showTeam = (config?.showTeam ?? true) && config?.layoutMode !== 'RECRUIT_ONLY' && config?.layoutMode !== 'NEITHER';
  const showRecruit = (config?.showRecruitment ?? true) && config?.layoutMode !== 'SHOWCASE_ONLY' && config?.layoutMode !== 'NEITHER';

  return (
    <div className="min-h-screen bg-[#06080e] text-white flex flex-col justify-between font-sans text-left selection:bg-cyan-500/20">
      <Navbar />

      <main className="max-w-5xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-10 space-y-8">
        <div className="flex items-center justify-between gap-4">
          <Link
            href="/events"
            className="inline-flex items-center gap-2 text-xs font-mono text-neutral-400 hover:text-white transition"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>All Gatherings &amp; Summits</span>
          </Link>

          <div className="flex items-center gap-2">
            <Link
              href={`/events/${event.id}/manage`}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-cyan-500/15 hover:bg-cyan-500/25 border border-cyan-500/30 text-xs font-mono text-cyan-300 transition"
            >
              <Sparkles className="w-3.5 h-3.5" />
              <span>Host Command Center</span>
            </Link>

            <button
              type="button"
              onClick={() => {
                if (typeof window !== 'undefined') {
                  navigator.clipboard.writeText(window.location.href);
                  setCopiedLink(true);
                  setTimeout(() => setCopiedLink(false), 2000);
                }
              }}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-xs font-mono text-neutral-300 transition"
            >
              {copiedLink ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Share2 className="w-3.5 h-3.5" />}
              <span>{copiedLink ? 'Link Copied' : 'Share'}</span>
            </button>
          </div>
        </div>

        {/* Section Navigation Tabs: Overview | Our Team | Join the Team | Direct Host Support */}
        <div className="flex items-center gap-2 border-b border-white/10 pb-3 overflow-x-auto scrollbar-none">
          <button
            type="button"
            onClick={() => setActiveTab('overview')}
            className={`px-4 py-2 rounded-xl text-xs font-semibold font-sans transition flex items-center gap-2 cursor-pointer shrink-0 ${
              activeTab === 'overview'
                ? 'bg-white text-black shadow-sm'
                : 'text-neutral-400 hover:text-white bg-white/5'
            }`}
          >
            <span>Overview</span>
          </button>

          {showTeam && (
            <button
              type="button"
              onClick={() => setActiveTab('team')}
              className={`px-4 py-2 rounded-xl text-xs font-semibold font-sans transition flex items-center gap-2 cursor-pointer shrink-0 ${
                activeTab === 'team'
                  ? 'bg-white text-black shadow-sm'
                  : 'text-neutral-400 hover:text-white bg-white/5'
              }`}
            >
              <Users className="w-3.5 h-3.5" />
              <span>Our Team</span>
            </button>
          )}

          {showRecruit && (
            <button
              type="button"
              onClick={() => setActiveTab('recruit')}
              className={`px-4 py-2 rounded-xl text-xs font-semibold font-sans transition flex items-center gap-2 cursor-pointer shrink-0 ${
                activeTab === 'recruit'
                  ? 'bg-white text-black shadow-sm'
                  : 'text-neutral-400 hover:text-white bg-white/5'
              }`}
            >
              <Briefcase className="w-3.5 h-3.5" />
              <span>Join the Team</span>
            </button>
          )}

          <button
            type="button"
            onClick={() => setActiveTab('support')}
            className={`px-4 py-2 rounded-xl text-xs font-semibold font-sans transition flex items-center gap-2 cursor-pointer shrink-0 ${
              activeTab === 'support'
                ? 'bg-white text-black shadow-sm'
                : 'text-neutral-400 hover:text-white bg-white/5'
            }`}
          >
            <LifeBuoy className="w-3.5 h-3.5 text-cyan-400" />
            <span>Host Support &amp; Desk</span>
          </button>
        </div>

        {/* ── TAB 1: OVERVIEW ── */}
        {activeTab === 'overview' && (
          <div className="space-y-8">
            {/* Event Header Banner */}
            <div className="rounded-3xl bg-[#090c16] border border-white/10 overflow-hidden shadow-2xl space-y-6">
              {event.coverImage && (
                <div className="w-full h-64 sm:h-80 overflow-hidden relative">
                  <img src={event.coverImage} alt={event.title} className="w-full h-full object-cover" />
                  <div className="absolute inset-0 bg-gradient-to-t from-[#090c16] via-transparent to-transparent" />
                </div>
              )}

              <div className="p-6 sm:p-10 space-y-6">
                <div className="flex flex-wrap items-center gap-2.5">
                  <span className="px-3 py-1 rounded-full bg-cyan-500/10 border border-cyan-500/30 text-cyan-300 font-mono text-[10px] uppercase font-bold tracking-wider">
                    {event.category}
                  </span>
                  <span className="px-3 py-1 rounded-full bg-white/5 border border-white/10 text-neutral-300 font-mono text-[10px] uppercase">
                    {event.type.toUpperCase()}
                  </span>
                </div>

                <h1 className="text-3xl sm:text-5xl font-black font-display text-white tracking-tight leading-tight">
                  {event.title}
                </h1>

                <p className="text-sm sm:text-base text-neutral-300 leading-relaxed font-light max-w-3xl">
                  {event.description}
                </p>

                {/* Event Key Stats Grid */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-4 border-t border-white/10 font-mono text-xs">
                  <div className="p-4 rounded-2xl bg-white/[0.02] border border-white/5 space-y-1">
                    <span className="text-[10px] text-neutral-500 uppercase tracking-widest block flex items-center gap-1.5">
                      <Calendar className="w-3 h-3 text-cyan-400" />
                      Date &amp; Time
                    </span>
                    <p className="text-white font-bold text-sm">{eventDate.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}</p>
                    <p className="text-neutral-400 text-[11px] flex items-center gap-1">
                      <Clock className="w-3 h-3 text-neutral-500" />
                      <span>{event.time}</span>
                    </p>
                  </div>

                  <div className="p-4 rounded-2xl bg-white/[0.02] border border-white/5 space-y-1">
                    <span className="text-[10px] text-neutral-500 uppercase tracking-widest block flex items-center gap-1.5">
                      <MapPin className="w-3 h-3 text-emerald-400" />
                      Location / Host
                    </span>
                    <p className="text-white font-bold text-sm truncate">{event.location}</p>
                    <p className="text-neutral-400 text-[11px]">{event.city}</p>
                  </div>

                  <div className="p-4 rounded-2xl bg-white/[0.02] border border-white/5 space-y-1">
                    <span className="text-[10px] text-neutral-500 uppercase tracking-widest block flex items-center gap-1.5">
                      <Users className="w-3 h-3 text-purple-400" />
                      Accreditation
                    </span>
                    <p className="text-white font-bold text-sm">{event.capacity} Capacity</p>
                    <p className="text-cyan-400 text-[11px]">{event.attendees?.length || 0} Registered</p>
                  </div>
                </div>

                {/* Booking Action */}
                <div className="pt-4 flex flex-wrap items-center gap-3">
                  <button
                    type="button"
                    onClick={() => {
                      if (myPass) {
                        setActivePassForModal(myPass);
                      } else {
                        setShowBookingModal(true);
                      }
                    }}
                    className="px-8 py-3.5 rounded-2xl bg-white hover:bg-neutral-200 text-black font-display font-bold text-xs uppercase tracking-wider transition shadow-sm flex items-center gap-2 cursor-pointer"
                  >
                    <Ticket className="w-4 h-4 text-black" />
                    <span>{myPass ? 'View My Event Pass' : 'Book Event Pass'}</span>
                  </button>

                  {showTeam && (
                    <button
                      type="button"
                      onClick={() => setActiveTab('team')}
                      className="px-5 py-3.5 rounded-2xl bg-white/5 hover:bg-white/10 text-white border border-white/10 font-sans text-xs font-semibold transition cursor-pointer flex items-center gap-2"
                    >
                      <Users className="w-4 h-4 text-neutral-400" />
                      <span>Meet Our Team</span>
                    </button>
                  )}

                  {showRecruit && (
                    <button
                      type="button"
                      onClick={() => setActiveTab('recruit')}
                      className="px-5 py-3.5 rounded-2xl bg-white/5 hover:bg-white/10 text-white border border-white/10 font-sans text-xs font-semibold transition cursor-pointer flex items-center gap-2"
                    >
                      <Briefcase className="w-4 h-4 text-neutral-400" />
                      <span>Join the Team</span>
                    </button>
                  )}
                </div>
              </div>
            </div>

            {/* Teaser Recruitment Banner if recruit is enabled */}
            {showRecruit && (
              <RecruitmentOpenBanner
                eventId={event.id}
                eventTitle={event.title}
              />
            )}

            {/* Direct Host & Audience Communications Desk */}
            <EventSupportDesk event={event} />
          </div>
        )}

        {/* ── TAB 2: OUR TEAM (SHOWCASE) ── */}
        {activeTab === 'team' && showTeam && (
          <EventTeamShowcase
            eventId={event.id}
            eventTitle={event.title}
            headline={config?.teamHeadline}
            description={config?.teamDescription}
          />
        )}

        {/* ── TAB 3: JOIN THE TEAM (RECRUITMENT) ── */}
        {activeTab === 'recruit' && showRecruit && (
          <EventRecruitmentShowcase
            eventId={event.id}
            eventTitle={event.title}
            headline={config?.headline}
            description={config?.description}
          />
        )}

        {/* ── TAB 4: DIRECT HOST SUPPORT & AUDIENCE DESK ── */}
        {activeTab === 'support' && (
          <EventSupportDesk event={event} />
        )}
      </main>

      <Footer />

      {showBookingModal && (
        <ZenPassBookingModal
          isOpen={showBookingModal}
          event={event}
          onClose={() => setShowBookingModal(false)}
        />
      )}
    </div>
  );
}
