'use client';

import React, { useState } from 'react';
import { 
  Calendar, 
  Plus, 
  Search, 
  Sparkles, 
  Radio, 
  Users, 
  Compass, 
  Filter, 
  MapPin, 
  Clock, 
  Flame, 
  ShieldCheck,
  ChevronRight,
  Ticket,
  Camera,
  QrCode,
  Calculator,
  LayoutDashboard
} from 'lucide-react';
import { useZenEvents } from '@/context/ZenEventsPlatformContext';
import { useZenPass } from '@/context/ZenPassContext';
import { EventCard } from './EventCard';
import { EventCategory, EventFilter, ZenEvent } from '@/types/events';
import { ZenPassTicket } from '@/types/zenpass';
import { MunInviteBanner } from '@/components/mun/MunInviteBanner';
import { LocationRadarBar } from './LocationRadarBar';
import { ZenPassBookingModal } from './ZenPassBookingModal';
import { ZenPassHolographicTicket } from './ZenPassHolographicTicket';
import { ZenPassScannerModal } from './ZenPassScannerModal';
import { ZenPassUserPassesModal } from './ZenPassUserPassesModal';
import { RevenueFeeSimulatorModal } from '@/components/pulse/RevenueFeeSimulatorModal';
import { useAuth } from '@/context/AuthContext';

const CATEGORIES: (EventCategory | 'ALL')[] = ['ALL', 'SUMMIT', 'WORKSHOP', 'KEYNOTE', 'MEETUP', 'HACKATHON'];

export function EventsFeed() {
  const { profile } = useAuth();
  const {
    events,
    filteredEvents,
    activeFilter,
    setActiveFilter,
    activeCategory,
    setActiveCategory,
    searchQuery,
    setSearchQuery,
    setActiveView,
    setActiveEventId,
    currentUserUsername,
    currentUserId
  } = useZenEvents();

  const {
    userPasses,
    activePassForModal,
    setActivePassForModal,
    showPassWalletModal,
    setShowPassWalletModal,
    showScannerModal,
    setShowScannerModal
  } = useZenPass();

  const [bookingEvent, setBookingEvent] = useState<ZenEvent | null>(null);
  const [showRevenueSimulatorModal, setShowRevenueSimulatorModal] = useState(false);

  // Check if current user is an authorized Event Manager / Host
  const isEventManager = Boolean(
    profile?.role === 'admin' ||
    (profile?.role as string) === 'organizer' ||
    (profile?.role as string) === 'secretariat' ||
    profile?.email?.toLowerCase() === 'founder@zenvitra.org' ||
    (events && events.some((e) => e.organizerUsername === currentUserUsername || e.organizerId === currentUserId))
  );

  // Find a featured event (e.g. first upcoming/live or first event)
  const featuredEvent = filteredEvents.find((e) => e.status === 'live' || e.status === 'upcoming') || filteredEvents[0];
  const remainingEvents = filteredEvents.filter((e) => e.id !== featuredEvent?.id);

  return (
    <div className="max-w-6xl mx-auto font-sans pb-16 space-y-8">
      {/* Pending Secretariat Allotment Notification */}
      <MunInviteBanner />

      {/* Top Header with ZenPass Suite */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-6 border-b border-zinc-800">
        <div>
          <div className="flex items-center gap-2 font-mono text-[10px] text-cyan-400 uppercase tracking-widest mb-1">
            <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 animate-pulse" />
            <span>GLOBAL GATHERINGS &amp; SUMMITS</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-display font-bold text-white tracking-tight">
            ZEN.EVENTS &amp; PASS
          </h1>
          <p className="text-xs text-zinc-400">
            Discover conferences, book official ZenPasses, and step into live chambers worldwide.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2 sm:gap-2.5 w-full sm:w-auto">
          {/* Dual-Sided Take-Rate Settlement Simulator Button (Events exclusive) */}
          <button
            type="button"
            onClick={() => setShowRevenueSimulatorModal(true)}
            className="flex items-center justify-center gap-2 px-3.5 py-2.5 rounded-2xl bg-emerald-500/15 hover:bg-emerald-500/25 border border-emerald-500/30 text-emerald-300 text-xs font-mono font-bold transition shadow-sm cursor-pointer"
            title="Open Dual-Sided Take-Rate Settlement Simulator (0.5% + ₹19 Take-Rate)"
          >
            <Calculator className="w-4 h-4 text-emerald-400 shrink-0" />
            <span className="truncate">Settlement Sim</span>
          </button>

          {/* My ZenPass Wallet Button */}
          <button
            type="button"
            onClick={() => setShowPassWalletModal(true)}
            className="flex items-center justify-center gap-2 px-3.5 py-2.5 rounded-2xl bg-amber-500/15 hover:bg-amber-500/25 border border-amber-500/30 text-amber-300 text-xs font-mono font-bold transition shadow-sm cursor-pointer"
            title="Open My ZenPass Wallet"
          >
            <Ticket className="w-4 h-4 text-amber-400 shrink-0" />
            <span className="truncate">My Passes (<span suppressHydrationWarning>{userPasses.length}</span>)</span>
          </button>

          {/* Door QR Scanner Button — STRICTLY VISIBLE ONLY TO AUTHORIZED EVENT MANAGERS */}
          {isEventManager && (
            <button
              type="button"
              onClick={() => setShowScannerModal(true)}
              className="flex items-center justify-center gap-2 px-3.5 py-2.5 rounded-2xl bg-emerald-500/15 hover:bg-emerald-500/25 border border-emerald-500/30 text-emerald-300 text-xs font-mono font-bold transition shadow-sm cursor-pointer"
              title="Open Organizer Door Scanner (Event Manager Clearance)"
            >
              <Camera className="w-4 h-4 text-emerald-400 shrink-0" />
              <span className="truncate">Gate Scanner</span>
            </button>
          )}

          {/* Organizer Dashboard Button */}
          <button
            type="button"
            onClick={() => setActiveView('dashboard')}
            className="flex items-center justify-center gap-2 px-3.5 py-2.5 rounded-2xl bg-cyan-500/15 hover:bg-cyan-500/25 border border-cyan-500/30 text-cyan-300 text-xs font-mono font-bold transition shadow-sm cursor-pointer"
            title="Open Organizer Event Management & Role Delegation Dashboard"
          >
            <LayoutDashboard className="w-4 h-4 text-cyan-400 shrink-0" />
            <span className="truncate">Dashboard</span>
          </button>

          <button
            onClick={() => setActiveView('create')}
            className="flex items-center justify-center gap-2 px-5 py-2.5 rounded-2xl bg-white hover:bg-zinc-200 text-black text-xs font-semibold transition shadow-sm cursor-pointer"
          >
            <Plus className="w-4 h-4 shrink-0" />
            <span>Create Event</span>
          </button>
        </div>
      </div>


      {/* Geolocation & Nearby Events Radar Bar */}
      <LocationRadarBar />

      {/* Hero Featured Summit Card */}
      {featuredEvent && (
        <div
          onClick={() => { setActiveEventId(featuredEvent.id); setActiveView('detail'); }}
          className="group relative rounded-3xl overflow-hidden card-luxury border border-cyan-500/30 hover:border-cyan-400/60 transition-all duration-500 cursor-pointer shadow-[0_0_40px_rgba(0,242,254,0.15)]"
        >
          <div className="grid grid-cols-1 lg:grid-cols-2">
            {/* Image */}
            <div className="relative h-64 sm:h-80 lg:h-auto overflow-hidden bg-neutral-900">
              {featuredEvent.coverImage ? (
                <img
                  src={featuredEvent.coverImage}
                  alt={featuredEvent.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 opacity-90 group-hover:opacity-100"
                />
              ) : (
                <div className="w-full h-full bg-[#0d0a1a] flex items-center justify-center p-6 text-center">
                  <Sparkles className="w-16 h-16 text-cyan-400/30" />
                </div>
              )}
              <div className="absolute inset-0 bg-gradient-to-t from-[#090810] via-transparent to-transparent lg:bg-gradient-to-r pointer-events-none" />

              {/* Status Badge */}
              <div className="absolute top-5 left-5 flex items-center gap-2">
                <span className="px-3 py-1 rounded-full bg-cyan-500/20 backdrop-blur-md border border-cyan-500/40 text-cyan-300 font-mono text-xs font-bold uppercase tracking-wider shadow-[0_0_15px_rgba(0,242,254,0.2)]">
                  ★ FEATURED CONVENING
                </span>
                {featuredEvent.status === 'live' && (
                  <span className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-rose-500/25 backdrop-blur-md border border-rose-500 text-rose-300 font-mono text-xs font-bold animate-pulse shadow-[0_0_20px_rgba(244,63,94,0.4)]">
                    <Radio className="w-3.5 h-3.5" />
                    LIVE
                  </span>
                )}
              </div>
            </div>

            {/* Info */}
            <div className="p-6 sm:p-8 flex flex-col justify-between space-y-6">
              <div className="space-y-3">
                <div className="flex items-center gap-2 text-xs font-mono text-cyan-400">
                  <span>{featuredEvent.category}</span>
                  <span>&bull;</span>
                  <span className="text-neutral-400 flex items-center gap-1">
                    <Clock className="w-3.5 h-3.5" />
                    {featuredEvent.time}
                  </span>
                </div>

                <h2 className="font-display font-bold text-2xl sm:text-3xl text-white group-hover:text-cyan-200 transition-colors leading-tight">
                  {featuredEvent.title}
                </h2>

                <p className="text-xs sm:text-sm text-neutral-400 leading-relaxed font-sans line-clamp-3 font-light">
                  {featuredEvent.description}
                </p>
              </div>

              <div className="space-y-4 pt-4 border-t border-white/10">
                <div className="flex items-center gap-2 text-xs font-mono text-neutral-300">
                  <MapPin className="w-4 h-4 text-emerald-400 shrink-0" />
                  <span className="truncate">{featuredEvent.location}</span>
                </div>

                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2 font-mono text-xs text-neutral-400">
                    <Users className="w-4 h-4 text-cyan-400" />
                    <span>{featuredEvent.attendees.length} Registered Delegates</span>
                  </div>

                  <div className="inline-flex items-center gap-1 text-xs font-mono font-bold text-white group-hover:text-cyan-300 transition">
                    <span>Inspect Pass Matrix</span>
                    <ChevronRight className="w-4 h-4" />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Filter and Search Bar */}
      <div className="space-y-4">
        <div className="flex flex-col md:flex-row items-center justify-between gap-4">
          {/* Tab Filters */}
          <div className="flex flex-wrap p-1 rounded-2xl bg-white/[0.04] border border-white/10 w-full md:w-auto">
            {[
              { id: 'all', label: 'All Assemblies' },
              { id: 'nearby', label: '📍 Nearby Radar' },
              { id: 'upcoming', label: 'Upcoming' },
              { id: 'past', label: 'Past Summits' },
              { id: 'my-events', label: 'My Registrations' },
              { id: 'cancelled', label: '🚫 Cancelled' },
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveFilter(tab.id as EventFilter)}
                className={`flex-1 md:flex-none px-4 py-2 rounded-xl text-xs font-mono font-semibold transition cursor-pointer ${
                  activeFilter === tab.id
                    ? 'bg-white text-black shadow-md'
                    : 'text-neutral-400 hover:text-white'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>

          {/* Search Input */}
          <div className="relative w-full md:w-72">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-neutral-500" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search by city, title, or topic..."
              className="w-full pl-10 pr-4 py-2.5 rounded-2xl bg-white/[0.04] border border-white/10 text-xs font-mono text-white placeholder:text-neutral-600 focus:outline-none focus:border-cyan-500/50"
            />
          </div>
        </div>

        {/* Category Pills */}
        <div className="flex gap-2 overflow-x-auto scrollbar-none pb-2">
          {CATEGORIES.map((cat) => (
            <button
              key={cat}
              onClick={() => setActiveCategory(cat)}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-mono font-semibold transition cursor-pointer shrink-0 border ${
                activeCategory === cat
                  ? 'bg-cyan-500/15 border-cyan-500/40 text-cyan-300 shadow-[0_0_15px_rgba(0,242,254,0.2)]'
                  : 'bg-white/[0.02] border-white/[0.08] text-neutral-400 hover:text-white hover:bg-white/[0.05]'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* Events Grid */}
      <div>
        {filteredEvents.length === 0 ? (
          <div className="rounded-3xl p-12 text-center card-luxury border border-white/[0.08] my-8 space-y-4">
            <div className="w-16 h-16 rounded-3xl bg-white/[0.04] border border-white/10 flex items-center justify-center mx-auto">
              <Calendar className="w-8 h-8 text-neutral-500" />
            </div>
            <div>
              <h3 className="font-display font-bold text-lg text-white">No Assemblies Found</h3>
              <p className="text-xs font-mono text-neutral-400 max-w-sm mx-auto mt-1">
                There are no events matching your selected filters or search query.
              </p>
            </div>
            <button
              onClick={() => { setActiveFilter('all'); setActiveCategory('ALL'); setSearchQuery(''); }}
              className="px-5 py-2 rounded-2xl bg-white/10 border border-white/15 text-xs font-mono text-white hover:bg-white/20 transition cursor-pointer"
            >
              Clear Filters
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredEvents.map((event) => (
              <EventCard key={event.id} event={event} />
            ))}
          </div>
        )}
      </div>

      {/* ── ZENPASS DISTRICT MODALS ── */}
      {bookingEvent && (
        <ZenPassBookingModal
          isOpen={Boolean(bookingEvent)}
          onClose={() => setBookingEvent(null)}
          event={bookingEvent}
        />
      )}

      {activePassForModal && (
        <ZenPassHolographicTicket
          ticket={activePassForModal}
          onClose={() => setActivePassForModal(null)}
        />
      )}

      <ZenPassScannerModal
        isOpen={showScannerModal}
        onClose={() => setShowScannerModal(false)}
      />

      <ZenPassUserPassesModal
        isOpen={showPassWalletModal}
        onClose={() => setShowPassWalletModal(false)}
        onSelectPass={(pass) => setActivePassForModal(pass)}
      />

      {/* Dual-Sided Take-Rate Settlement Simulator Modal (Exclusive to Events) */}
      <RevenueFeeSimulatorModal
        isOpen={showRevenueSimulatorModal}
        onClose={() => setShowRevenueSimulatorModal(false)}
      />
    </div>
  );
}

