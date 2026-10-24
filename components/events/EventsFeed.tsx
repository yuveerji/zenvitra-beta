'use client';

import React, { useState, useRef, useEffect } from 'react';
import { 
  Calendar, 
  Plus, 
  Search, 
  Radio, 
  Users, 
  Compass, 
  Filter, 
  MapPin, 
  Clock, 
  Flame, 
  ShieldCheck,
  ChevronRight,
  ChevronLeft,
  Ticket,
  Camera,
  QrCode,
  Calculator,
  LayoutDashboard,
  Navigation,
  Globe2,
  Check,
  X,
  CreditCard,
  SlidersHorizontal,
  ExternalLink,
  ArrowUpRight,
  Loader2,
  Crosshair,
  Landmark
} from 'lucide-react';
import { useZenEvents, KNOWN_CITIES } from '@/context/ZenEventsPlatformContext';
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
import { EventsFaqSection } from './EventsFaqSection';
import { useAuth } from '@/context/AuthContext';
import { WorldLocationPickerModal, WorldLocation } from '@/components/common/WorldLocationPickerModal';

const NAV_CATEGORIES = [
  { id: 'ALL', label: 'For you' },
  { id: 'SUMMIT', label: 'Diplomatic Summits' },
  { id: 'MUN', label: 'Model UN' },
  { id: 'PARLIAMENT', label: 'Youth Parliament' },
  { id: 'POLICY', label: 'Policy Roundtables' },
  { id: 'WORKSHOP', label: 'Workshops & Academy' },
  { id: 'KEYNOTE', label: 'Plenary & Keynotes' },
];

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
    currentUserId,
    selectedCity,
    setSelectedCity,
    userLocation,
    setUserLocation,
    requestCurrentLocation,
    isLocating
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
  const [showCityDropdown, setShowCityDropdown] = useState(false);

  // Google Maps Places Live Search State
  const [gmapsQuery, setGmapsQuery] = useState('');
  const [gmapsResults, setGmapsResults] = useState<WorldLocation[]>([]);
  const [isSearchingGmaps, setIsSearchingGmaps] = useState(false);
  const [isWorldPickerOpen, setIsWorldPickerOpen] = useState(false);
  const [isGpsLocating, setIsGpsLocating] = useState(false);
  const cityDropdownRef = useRef<HTMLDivElement>(null);

  // Close dropdown on outside click
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (cityDropdownRef.current && !cityDropdownRef.current.contains(event.target as Node)) {
        setShowCityDropdown(false);
      }
    }
    if (showCityDropdown) {
      document.addEventListener('mousedown', handleClickOutside);
    }
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [showCityDropdown]);

  // Debounced Google Maps Places API search
  useEffect(() => {
    if (!gmapsQuery.trim()) {
      setGmapsResults([]);
      setIsSearchingGmaps(false);
      return;
    }

    const timer = setTimeout(async () => {
      setIsSearchingGmaps(true);
      try {
        const res = await fetch(`/api/places?query=${encodeURIComponent(gmapsQuery)}`);
        if (res.ok) {
          const data = await res.json();
          if (Array.isArray(data)) {
            setGmapsResults(data);
          }
        }
      } catch (err) {
        console.error('Failed to search Google Maps Places:', err);
      } finally {
        setIsSearchingGmaps(false);
      }
    }, 280);

    return () => clearTimeout(timer);
  }, [gmapsQuery]);

  const handleSelectPlace = (place: WorldLocation) => {
    const cityName = place.city || place.name;
    setSelectedCity(cityName);
    if (place.lat && place.lng) {
      setUserLocation({
        latitude: place.lat,
        longitude: place.lng,
        city: cityName,
        address: place.address || place.name
      });
    }
    setShowCityDropdown(false);
    setGmapsQuery('');
  };

  const handleDetectGps = () => {
    if (typeof window === 'undefined' || !navigator.geolocation) {
      requestCurrentLocation();
      setShowCityDropdown(false);
      return;
    }

    setIsGpsLocating(true);
    navigator.geolocation.getCurrentPosition(
      async (pos) => {
        const { latitude, longitude } = pos.coords;
        try {
          const res = await fetch(`/api/places?lat=${latitude}&lng=${longitude}`);
          if (res.ok) {
            const places: WorldLocation[] = await res.json();
            if (places && places.length > 0) {
              const best = places[0];
              const cityName = best.city || best.name;
              setSelectedCity(cityName);
              setUserLocation({
                latitude,
                longitude,
                city: cityName,
                address: best.address || best.name
              });
              setIsGpsLocating(false);
              setShowCityDropdown(false);
              return;
            }
          }
        } catch (e) {
          console.error('Reverse geocode error:', e);
        }
        await requestCurrentLocation();
        setIsGpsLocating(false);
        setShowCityDropdown(false);
      },
      () => {
        setIsGpsLocating(false);
        requestCurrentLocation();
        setShowCityDropdown(false);
      },
      { timeout: 10000, enableHighAccuracy: true }
    );
  };

  const handleResetToAll = () => {
    setSelectedCity('ALL');
    setUserLocation(null);
    setShowCityDropdown(false);
    setGmapsQuery('');
  };

  // Horizontal scroll refs for rails
  const summitsRailRef = useRef<HTMLDivElement>(null);
  const munRailRef = useRef<HTMLDivElement>(null);
  const virtualRailRef = useRef<HTMLDivElement>(null);

  const scrollRail = (ref: React.RefObject<HTMLDivElement | null>, direction: 'left' | 'right') => {
    if (ref.current) {
      const scrollAmount = direction === 'left' ? -380 : 380;
      ref.current.scrollBy({ left: scrollAmount, behavior: 'smooth' });
    }
  };

  // Check if current user is an authorized Event Manager / Host
  const isEventManager = Boolean(
    profile?.role === 'admin' ||
    (profile?.role as string) === 'organizer' ||
    (profile?.role as string) === 'secretariat' ||
    profile?.email?.toLowerCase() === 'founder@zenvitra.xyz' ||
    profile?.email?.toLowerCase() === 'founder@zenvitra.org' ||
    (events && events.some((e) => e.organizerUsername === currentUserUsername || e.organizerId === currentUserId))
  );

  // Featured Hero Convening (Hero banner like Screenshot 1)
  const featuredEvent = filteredEvents.find((e) => e.status === 'live' || e.status === 'upcoming') || filteredEvents[0];

  // Curated Rails (like Screenshot 2)
  const summitsRail = events.filter((e) => e.category === 'SUMMIT' || e.category === 'KEYNOTE' || (e.ticketPrice && e.ticketPrice > 400));
  const munAssembliesRail = events.filter((e) => e.category === 'MUN' || e.category === 'PARLIAMENT' || e.category === 'POLICY');
  const virtualChambersRail = events.filter((e) => e.type === 'virtual' || e.type === 'hybrid');

  const currentCityName = userLocation?.city 
    ? userLocation.city
    : selectedCity === 'ALL' 
      ? 'All Locations' 
      : (KNOWN_CITIES.find(c => c.value === selectedCity)?.name || selectedCity);

  return (
    <div className="max-w-7xl mx-auto font-sans pb-20 space-y-10 text-white relative">
      {/* ── THEATRICAL STAGE AMBIENCE & OVERHEAD SPOTLIGHT ── */}
      <div className="absolute -top-12 left-1/2 -translate-x-1/2 w-[1200px] h-[450px] bg-[radial-gradient(ellipse_at_top,rgba(6,182,212,0.18),rgba(167,139,250,0.08),transparent_70%)] blur-3xl pointer-events-none -z-10" />
      <div className="absolute top-0 left-0 right-0 h-[1.5px] bg-gradient-to-r from-transparent via-cyan-400/90 via-teal-300/80 to-transparent shadow-[0_0_20px_rgba(6,182,212,0.8)] -z-10" />

      {/* Pending Secretariat Allotment Notification */}
      <MunInviteBanner />

      {/* ════════════════════════════════════════════════════════════════
          TOP CONTROL BAR (LOCATION + PILLS + SEARCH + ACTIONS)
          Inspired by District's top header
          ════════════════════════════════════════════════════════════════ */}
      <header className="space-y-4 pt-1">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 pb-4 border-b border-white/10">
          
          {/* Left Brand Mark & Google Maps Location Selector */}
          <div className="flex items-center gap-4 flex-wrap">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl bg-black/60 border border-white/10 flex items-center justify-center p-1.5 shadow-[0_0_20px_rgba(6,182,212,0.25)] relative group shrink-0">
                <img
                  src="/assets/logo-new.png"
                  alt="Zenvitra Official Logo"
                  className="w-full h-full object-contain mix-blend-screen filter drop-shadow-[0_0_8px_rgba(255,255,255,0.4)] transition-transform duration-300 brand-logo-img group-hover:scale-105"
                />
              </div>
              <div className="flex flex-col">
                <span className="font-space font-black text-xl tracking-tight uppercase text-white leading-tight">
                  ZENVITRA CONVENING
                </span>
                <span className="text-[10px] font-mono text-cyan-400 font-semibold tracking-widest uppercase">
                  Diplomatic &amp; Executive Summits
                </span>
              </div>
            </div>

            {/* Google Maps Location Selector Pill */}
            <div className="relative" ref={cityDropdownRef}>
              <button
                type="button"
                onClick={() => setShowCityDropdown(!showCityDropdown)}
                className="flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/[0.04] hover:bg-white/[0.08] border border-cyan-500/20 hover:border-cyan-400/40 text-xs font-mono transition cursor-pointer group shadow-sm"
              >
                <MapPin className="w-3.5 h-3.5 text-cyan-400 group-hover:scale-110 transition-transform shrink-0" />
                <span className="font-bold text-white max-w-[160px] truncate">{currentCityName}</span>
                <span className="text-[10px] text-cyan-400/80 font-semibold tracking-wide flex items-center gap-1">
                  &bull; {selectedCity === 'ALL' && !userLocation ? 'Search' : 'Change'}
                </span>
              </button>

              {/* Google Maps Places Autocomplete Dropdown */}
              {showCityDropdown && (
                <div className="absolute left-0 top-full mt-2 w-80 sm:w-96 rounded-2xl bg-[#090d16]/95 backdrop-blur-2xl border border-cyan-500/30 shadow-[0_20px_50px_rgba(0,0,0,0.85)] z-50 p-3 space-y-2.5 animate-in fade-in zoom-in-95 duration-150">
                  {/* Header */}
                  <div className="flex items-center justify-between pb-2 border-b border-white/10">
                    <div className="flex items-center gap-2">
                      <div className="w-2 h-2 rounded-full bg-cyan-400 animate-pulse" />
                      <span className="text-[11px] font-mono uppercase tracking-wider text-neutral-300 font-bold">
                        Google Maps Location Hub
                      </span>
                    </div>
                    <button
                      type="button"
                      onClick={() => setShowCityDropdown(false)}
                      className="text-neutral-400 hover:text-white p-1 rounded-lg hover:bg-white/10 transition"
                    >
                      <X className="w-3.5 h-3.5" />
                    </button>
                  </div>

                  {/* Live Google Maps Search Input */}
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-cyan-400" />
                    <input
                      type="text"
                      value={gmapsQuery}
                      onChange={(e) => setGmapsQuery(e.target.value)}
                      placeholder="Search city, district, venue via Google Maps..."
                      autoFocus
                      className="w-full pl-9 pr-8 py-2 rounded-xl bg-white/[0.06] border border-white/15 focus:border-cyan-400 text-xs text-white placeholder:text-neutral-500 focus:outline-none transition"
                    />
                    {isSearchingGmaps ? (
                      <Loader2 className="absolute right-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-cyan-400 animate-spin" />
                    ) : gmapsQuery ? (
                      <button
                        type="button"
                        onClick={() => setGmapsQuery('')}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-neutral-400 hover:text-white"
                      >
                        <X className="w-3.5 h-3.5" />
                      </button>
                    ) : null}
                  </div>

                  {/* Quick Action: Use GPS via Google Maps */}
                  <button
                    type="button"
                    onClick={handleDetectGps}
                    disabled={isGpsLocating}
                    className="w-full p-2.5 rounded-xl bg-cyan-500/10 hover:bg-cyan-500/20 border border-cyan-500/30 text-left text-xs font-mono text-cyan-300 flex items-center justify-between transition cursor-pointer group"
                  >
                    <div className="flex items-center gap-2.5">
                      <Crosshair className={`w-4 h-4 text-cyan-400 group-hover:rotate-45 transition-transform ${isGpsLocating ? 'animate-spin' : ''}`} />
                      <div>
                        <div className="font-bold">
                          {isGpsLocating ? 'Detecting Google Maps Coordinates...' : 'Auto-Detect Current GPS Location'}
                        </div>
                        <div className="text-[10px] text-cyan-400/70">
                          Reverse-geocodes exact neighborhood &amp; city
                        </div>
                      </div>
                    </div>
                    <ChevronRight className="w-3.5 h-3.5 text-cyan-400 opacity-60 group-hover:opacity-100 group-hover:translate-x-0.5 transition-all" />
                  </button>

                  {/* Live Google Maps Suggestions */}
                  {gmapsResults.length > 0 && (
                    <div className="space-y-1 pt-1 max-h-56 overflow-y-auto">
                      <div className="text-[10px] font-mono uppercase tracking-wider text-cyan-400/80 px-2 font-semibold">
                        Google Places Results ({gmapsResults.length})
                      </div>
                      {gmapsResults.map((place, idx) => (
                        <button
                          key={place.placeId || `${place.name}-${idx}`}
                          type="button"
                          onClick={() => handleSelectPlace(place)}
                          className="w-full p-2 rounded-xl text-left hover:bg-white/10 transition flex items-start gap-2.5 cursor-pointer group"
                        >
                          <MapPin className="w-4 h-4 text-cyan-400 shrink-0 mt-0.5 group-hover:scale-110 transition-transform" />
                          <div className="min-w-0 flex-1">
                            <div className="text-xs font-bold text-white group-hover:text-cyan-300 truncate transition-colors">
                              {place.name}
                            </div>
                            <div className="text-[11px] text-neutral-400 truncate">
                              {place.address || [place.city, place.country].filter(Boolean).join(', ')}
                            </div>
                          </div>
                        </button>
                      ))}
                    </div>
                  )}

                  {/* Interactive World Map & Diplomatic Hubs Picker */}
                  <div className="pt-1 border-t border-white/10 space-y-1">
                    <button
                      type="button"
                      onClick={() => {
                        setShowCityDropdown(false);
                        setIsWorldPickerOpen(true);
                      }}
                      className="w-full px-3 py-2 rounded-xl text-left text-xs font-mono text-neutral-300 hover:text-white hover:bg-white/5 flex items-center justify-between transition cursor-pointer"
                    >
                      <div className="flex items-center gap-2">
                        <Globe2 className="w-3.5 h-3.5 text-indigo-400" />
                        <span>Interactive Global Hubs &amp; Map Modal</span>
                      </div>
                      <ArrowUpRight className="w-3.5 h-3.5 text-neutral-500" />
                    </button>

                    {/* Reset to All Worldwide */}
                    <button
                      type="button"
                      onClick={handleResetToAll}
                      className="w-full px-3 py-1.5 rounded-xl text-left text-xs font-mono text-neutral-400 hover:text-white hover:bg-white/5 flex items-center justify-between transition cursor-pointer"
                    >
                      <span>Show All Global Convenings</span>
                      {selectedCity === 'ALL' && !userLocation && (
                        <Check className="w-3.5 h-3.5 text-cyan-400" />
                      )}
                    </button>
                  </div>

                  {/* Popular Metro Hubs Quick Bar */}
                  <div className="pt-2 border-t border-white/10">
                    <div className="text-[10px] font-mono uppercase tracking-wider text-neutral-400 px-1 mb-1.5">
                      Popular Hubs
                    </div>
                    <div className="flex flex-wrap gap-1.5">
                      {KNOWN_CITIES.slice(1, 8).map((city) => (
                        <button
                          key={city.value}
                          type="button"
                          onClick={() => {
                            setSelectedCity(city.value);
                            if (city.lat && city.lng) {
                              setUserLocation({
                                latitude: city.lat,
                                longitude: city.lng,
                                city: city.name,
                                address: city.name
                              });
                            }
                            setShowCityDropdown(false);
                          }}
                          className={`px-2.5 py-1 rounded-lg text-[11px] font-mono transition cursor-pointer ${
                            selectedCity.toLowerCase() === city.value.toLowerCase()
                              ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/40 font-bold'
                              : 'bg-white/5 text-neutral-300 hover:bg-white/10 hover:text-white border border-white/5'
                          }`}
                        >
                          {city.name.split('&')[0].trim()}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Right Search Bar & CTAs */}
          <div className="flex items-center gap-2.5 flex-wrap w-full lg:w-auto">
            {/* Pill Search Input */}
            <div className="relative flex-1 lg:w-72">
              <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-neutral-400" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search for summits, delegations, passes..."
                className="w-full pl-10 pr-4 py-2 rounded-full bg-white/[0.05] border border-white/15 text-xs text-white placeholder:text-neutral-500 focus:outline-none focus:border-cyan-400 transition"
              />
            </div>

            {/* My Passes Wallet Pill */}
            <button
              type="button"
              onClick={() => setShowPassWalletModal(true)}
              className="flex items-center gap-1.5 px-3.5 py-2 rounded-full bg-amber-500/15 hover:bg-amber-500/25 border border-amber-500/30 text-amber-300 text-xs font-mono font-bold transition shadow-sm cursor-pointer shrink-0"
              title="Open My ZenPass Wallet"
            >
              <Ticket className="w-3.5 h-3.5 text-amber-400" />
              <span>Passes (<span suppressHydrationWarning>{userPasses.length}</span>)</span>
            </button>

            {/* Organizer Gate Scanner */}
            {isEventManager && (
              <button
                type="button"
                onClick={() => setShowScannerModal(true)}
                className="p-2 rounded-full bg-emerald-500/15 hover:bg-emerald-500/25 border border-emerald-500/30 text-emerald-300 transition cursor-pointer shrink-0"
                title="Door Gate Scanner"
              >
                <Camera className="w-4 h-4 text-emerald-400" />
              </button>
            )}

            {/* Organizer Dashboard */}
            {isEventManager && (
              <button
                type="button"
                onClick={() => setActiveView('dashboard')}
                className="p-2 rounded-full bg-cyan-500/15 hover:bg-cyan-500/25 border border-cyan-500/30 text-cyan-300 transition cursor-pointer shrink-0"
                title="Organizer Dashboard"
              >
                <LayoutDashboard className="w-4 h-4 text-cyan-400" />
              </button>
            )}

            {/* List Your Event Button (White High-Contrast) */}
            <button
              type="button"
              onClick={() => setActiveView('create')}
              className="flex items-center gap-1.5 px-4 py-2 rounded-full bg-white hover:bg-neutral-200 text-black text-xs font-bold font-sans transition shadow-md cursor-pointer shrink-0"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>List Your Event</span>
            </button>
          </div>
        </div>

        {/* ── Category Navigation Pills (Smooth Horizontal Rail) ── */}
        <div className="flex items-center gap-2 overflow-x-auto scrollbar-none pb-1">
          {NAV_CATEGORIES.map((cat) => (
            <button
              key={cat.id}
              type="button"
              onClick={() => setActiveCategory(cat.id as any)}
              className={`px-4 py-1.5 rounded-full text-xs font-sans font-semibold transition-all duration-200 cursor-pointer shrink-0 whitespace-nowrap border ${
                activeCategory === cat.id
                  ? 'bg-gradient-to-r from-purple-600/30 to-indigo-600/30 border-purple-400/60 text-white shadow-[0_0_20px_rgba(168,85,247,0.25)] font-bold'
                  : 'bg-white/[0.03] border-white/10 text-neutral-300 hover:text-white hover:bg-white/[0.08]'
              }`}
            >
              {cat.label}
            </button>
          ))}
        </div>
      </header>

      {/* ════════════════════════════════════════════════════════════════
          HERO FEATURE SHOWCASE (Inspired by Screenshot 1 - "Hallowed Halloween")
          Full-width cinematic card with Title & Date on top and 16:9 rounded artwork
          ════════════════════════════════════════════════════════════════ */}
      {featuredEvent && (
        <section className="space-y-3">
          {/* Title & Date Header Above the Banner */}
          <div className="space-y-1">
            <h1 className="text-2xl sm:text-4xl md:text-5xl font-space font-black text-white tracking-tight leading-tight">
              {featuredEvent.title}
            </h1>
            <p className="text-xs sm:text-sm font-mono text-cyan-400 font-semibold flex items-center gap-2">
              <span>{featuredEvent.date}</span>
              <span>&bull;</span>
              <span>{featuredEvent.time}</span>
              <span>&bull;</span>
              <span className="text-neutral-400">{featuredEvent.type === 'virtual' ? 'Virtual Digital Chamber' : featuredEvent.location}</span>
            </p>
          </div>

          {/* Cinematic Rounded Artwork Showcase */}
          <div
            onClick={() => {
              window.location.href = `/events/${featuredEvent.slug || featuredEvent.id}`;
            }}
            className="group relative rounded-[28px] sm:rounded-[32px] overflow-hidden border border-white/15 hover:border-cyan-400/50 transition-all duration-500 cursor-pointer shadow-[0_20px_60px_rgba(0,0,0,0.8)] bg-neutral-950 aspect-[16/9] sm:aspect-[21/9] flex items-center justify-center"
          >
            {/* Ambient Blurred Wing Background for Ultra 3D Depth */}
            {featuredEvent.coverImage && (
              <div 
                className="absolute inset-0 bg-cover bg-center filter blur-2xl opacity-40 scale-110 pointer-events-none"
                style={{ backgroundImage: `url(${featuredEvent.coverImage})` }}
              />
            )}

            {/* Hero Cover Image */}
            {featuredEvent.coverImage ? (
              <img
                src={featuredEvent.coverImage}
                alt={featuredEvent.title}
                className="w-full h-full object-cover relative z-10 group-hover:scale-105 transition-transform duration-700 opacity-95 group-hover:opacity-100"
              />
            ) : (
              <div className="w-full h-full bg-[#0a0d18] flex items-center justify-center p-6 text-center relative z-10">
                <Globe2 className="w-16 h-16 text-cyan-400/30" />
              </div>
            )}

            {/* Gradient Dark Vignette Overlay */}
            <div className="absolute inset-0 z-20 bg-gradient-to-t from-black/90 via-black/30 to-transparent pointer-events-none" />

            {/* Top Badges */}
            <div className="absolute top-4 left-4 sm:top-6 sm:left-6 z-30 flex items-center gap-2">
              <span className="px-3 py-1 rounded-full bg-cyan-500/25 backdrop-blur-md border border-cyan-400/50 text-cyan-200 text-xs font-mono font-bold uppercase tracking-wider shadow-lg">
                ★ FEATURED CONVENING
              </span>
              <span className="px-3 py-1 rounded-full bg-black/60 backdrop-blur-md border border-white/20 text-white text-xs font-mono uppercase">
                {featuredEvent.type}
              </span>
              {(featuredEvent.isComingSoon || featuredEvent.status === 'coming_soon') && (
                <span className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-500/30 backdrop-blur-md border border-amber-400 text-amber-300 text-xs font-mono font-bold shadow-lg">
                  <Clock className="w-3.5 h-3.5 text-amber-400" />
                  COMING SOON
                </span>
              )}
              {featuredEvent.status === 'live' && (
                <span className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-rose-500/30 backdrop-blur-md border border-rose-500 text-rose-300 text-xs font-mono font-bold animate-pulse">
                  <Radio className="w-3.5 h-3.5" />
                  LIVE NOW
                </span>
              )}
            </div>

            {/* Bottom Floating Bar */}
            <div className="absolute bottom-4 left-4 right-4 sm:bottom-6 sm:left-6 sm:right-6 z-30 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div className="space-y-0.5 min-w-0">
                <p className="text-[11px] font-mono text-cyan-400 uppercase tracking-widest font-bold">
                  {featuredEvent.category} &bull; {featuredEvent.attendees.length} DELEGATES REGISTERED
                </p>
                <h3 className="text-lg sm:text-2xl font-display font-extrabold text-white truncate drop-shadow-md">
                  {featuredEvent.title}
                </h3>
              </div>

              <div className="flex items-center gap-2 shrink-0">
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    setBookingEvent(featuredEvent);
                  }}
                  className={`px-5 py-2.5 rounded-full font-sans font-bold text-xs transition shadow-xl cursor-pointer flex items-center gap-1.5 active:scale-95 ${
                    featuredEvent.isComingSoon || featuredEvent.status === 'coming_soon'
                      ? 'bg-gradient-to-r from-amber-400 to-orange-500 text-black hover:scale-105'
                      : 'bg-white hover:bg-neutral-200 text-black'
                  }`}
                >
                  {featuredEvent.isComingSoon || featuredEvent.status === 'coming_soon' ? (
                    <>
                      <Clock className="w-4 h-4 text-black" />
                      <span>Join Priority Waitlist</span>
                    </>
                  ) : (
                    <>
                      <Ticket className="w-4 h-4" />
                      <span>Book Official Pass</span>
                    </>
                  )}
                </button>
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    window.location.href = `/events/${featuredEvent.slug || featuredEvent.id}`;
                  }}
                  className="px-4 py-2.5 rounded-full bg-black/70 hover:bg-black/90 border border-white/20 text-white font-mono text-xs transition backdrop-blur-md cursor-pointer flex items-center gap-1"
                >
                  <span>Chamber Details</span>
                  <ArrowUpRight className="w-3.5 h-3.5 text-cyan-400" />
                </button>
              </div>
            </div>
          </div>
        </section>
      )}

      {/* ════════════════════════════════════════════════════════════════
          RAIL 1: TOP SUMMITS & CONVOCATIONS (Portrait Posters like Screenshot 2)
          ════════════════════════════════════════════════════════════════ */}
      {summitsRail.length > 0 && (
        <section className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-xl sm:text-2xl font-space font-black text-white tracking-tight uppercase">
                Top Summits &amp; Convocations
              </h2>
              <p className="text-xs text-neutral-300 font-outfit leading-relaxed">
                Flagship international diplomatic forums and executive conclaves
              </p>
            </div>

            <div className="flex items-center gap-1.5">
              <button
                type="button"
                onClick={() => scrollRail(summitsRailRef, 'left')}
                className="p-2 rounded-full bg-white/5 hover:bg-white/10 border border-white/10 text-neutral-300 hover:text-white transition cursor-pointer"
                title="Scroll Left"
              >
                <ChevronLeft className="w-4 h-4" />
              </button>
              <button
                type="button"
                onClick={() => scrollRail(summitsRailRef, 'right')}
                className="p-2 rounded-full bg-white/5 hover:bg-white/10 border border-white/10 text-neutral-300 hover:text-white transition cursor-pointer"
                title="Scroll Right"
              >
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Horizontal Portrait Poster Row */}
          <div 
            ref={summitsRailRef}
            className="flex gap-4 overflow-x-auto scrollbar-none pb-2 pt-1 snap-x snap-mandatory"
          >
            {summitsRail.map((event) => (
              <div
                key={event.id}
                onClick={() => {
                  window.location.href = `/events/${event.slug || event.id}`;
                }}
                className="w-44 sm:w-56 shrink-0 snap-start group cursor-pointer space-y-2.5"
              >
                {/* 3:4 Portrait Poster Card */}
                <div className="aspect-[3/4] w-full rounded-2xl overflow-hidden border border-white/10 bg-neutral-900 relative shadow-lg group-hover:border-cyan-400/50 group-hover:-translate-y-1 transition-all duration-300">
                  {event.coverImage ? (
                    <img
                      src={event.coverImage}
                      alt={event.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                  ) : (
                    <div className="w-full h-full bg-gradient-to-br from-neutral-900 to-black flex items-center justify-center p-4 text-center">
                      <Landmark className="w-8 h-8 text-cyan-400/40" />
                    </div>
                  )}

                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent pointer-events-none" />

                  {/* Top Category Badge */}
                  <div className="absolute top-2.5 left-2.5">
                    <span className="px-2 py-0.5 rounded-md bg-black/70 backdrop-blur-md border border-white/15 text-[10px] font-mono font-bold text-cyan-300 uppercase">
                      {event.category}
                    </span>
                  </div>

                  {/* Price Tag Bottom Right */}
                  <div className="absolute bottom-2.5 right-2.5">
                    <span className="px-2 py-0.5 rounded-md bg-amber-500/20 backdrop-blur-md border border-amber-400/40 text-[11px] font-mono font-bold text-amber-300">
                      {event.ticketPrice ? `₹${event.ticketPrice}` : 'Free Pass'}
                    </span>
                  </div>
                </div>

                {/* Text Metadata Underneath */}
                <div className="space-y-0.5">
                  <h3 className="font-sans font-bold text-sm text-white group-hover:text-cyan-300 transition-colors truncate">
                    {event.title}
                  </h3>
                  <p className="text-[11px] font-mono text-neutral-400 truncate">
                    {event.city || 'Global'} &bull; {event.date}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* ════════════════════════════════════════════════════════════════
          RAIL 2: EXPLORE MODEL UN & ASSEMBLIES NEAR YOU (like Screenshot 2 bottom)
          ════════════════════════════════════════════════════════════════ */}
      {munAssembliesRail.length > 0 && (
        <section className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-xl sm:text-2xl font-space font-black text-white tracking-tight uppercase">
                Explore Model UN &amp; Assemblies Near You
              </h2>
              <p className="text-xs text-neutral-300 font-outfit leading-relaxed">
                Simulate multilateral diplomacy, Youth Parliament, and crisis committees
              </p>
            </div>

            <div className="flex items-center gap-1.5">
              <button
                type="button"
                onClick={() => scrollRail(munRailRef, 'left')}
                className="p-2 rounded-full bg-white/5 hover:bg-white/10 border border-white/10 text-neutral-300 hover:text-white transition cursor-pointer"
                title="Scroll Left"
              >
                <ChevronLeft className="w-4 h-4" />
              </button>
              <button
                type="button"
                onClick={() => scrollRail(munRailRef, 'right')}
                className="p-2 rounded-full bg-white/5 hover:bg-white/10 border border-white/10 text-neutral-300 hover:text-white transition cursor-pointer"
                title="Scroll Right"
              >
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Horizontal Card Row */}
          <div 
            ref={munRailRef}
            className="flex gap-4 overflow-x-auto scrollbar-none pb-2 pt-1 snap-x snap-mandatory"
          >
            {munAssembliesRail.map((event) => (
              <div
                key={event.id}
                onClick={() => {
                  window.location.href = `/events/${event.slug || event.id}`;
                }}
                className="w-56 sm:w-64 shrink-0 snap-start group cursor-pointer space-y-2.5"
              >
                {/* 1:1 Rounded Artwork Card */}
                <div className="aspect-[1/1] w-full rounded-2xl overflow-hidden border border-white/10 bg-neutral-900 relative shadow-lg group-hover:border-purple-400/50 group-hover:-translate-y-1 transition-all duration-300">
                  {event.coverImage ? (
                    <img
                      src={event.coverImage}
                      alt={event.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                  ) : (
                    <div className="w-full h-full bg-gradient-to-br from-neutral-900 to-black flex items-center justify-center p-4 text-center">
                      <Radio className="w-8 h-8 text-purple-400/40" />
                    </div>
                  )}

                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent pointer-events-none" />

                  {/* Top Status */}
                  <div className="absolute top-2.5 left-2.5">
                    <span className="px-2 py-0.5 rounded-md bg-black/70 backdrop-blur-md border border-white/15 text-[10px] font-mono font-bold text-purple-300 uppercase">
                      {event.type.toUpperCase()}
                    </span>
                  </div>

                  {/* RuPay / Card Offer Badge if Enabled */}
                  {event.plans?.[0]?.exclusiveOffer?.enabled && (
                    <div className="absolute top-2.5 right-2.5">
                      <span className="px-2 py-0.5 rounded-md bg-purple-500/30 backdrop-blur-md border border-purple-400/50 text-[10px] font-mono font-bold text-purple-200">
                        {event.plans[0].exclusiveOffer.badgeText || 'CARD OFFER'}
                      </span>
                    </div>
                  )}

                  {/* Price Tag Bottom Right */}
                  <div className="absolute bottom-2.5 right-2.5">
                    <span className="px-2 py-0.5 rounded-md bg-white/10 backdrop-blur-md border border-white/20 text-[11px] font-mono font-bold text-white">
                      {event.ticketPrice ? `₹${event.ticketPrice}` : 'Free Entry'}
                    </span>
                  </div>
                </div>

                {/* Metadata Underneath with Venue Pin */}
                <div className="space-y-1">
                  <p className="text-[11px] font-mono text-cyan-400 flex items-center gap-1 truncate">
                    <MapPin className="w-3 h-3 text-cyan-400 shrink-0" />
                    <span className="truncate">{event.type === 'virtual' ? 'Virtual Digital Chamber' : event.location}</span>
                  </p>
                  <h3 className="font-sans font-bold text-sm text-white group-hover:text-purple-300 transition-colors truncate">
                    {event.title}
                  </h3>
                  <p className="text-[11px] font-mono text-neutral-400 truncate">
                    {event.date} &bull; {event.time}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* ════════════════════════════════════════════════════════════════
          RAIL 3: VIRTUAL DIGITAL CHAMBERS (Remote Global Assemblies)
          ════════════════════════════════════════════════════════════════ */}
      {virtualChambersRail.length > 0 && (
        <section className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-xl sm:text-2xl font-space font-black text-white tracking-tight uppercase flex items-center gap-2">
                <Radio className="w-5 h-5 text-cyan-400 animate-pulse" />
                <span>Virtual Chambers &amp; Digital Summits</span>
              </h2>
              <p className="text-xs text-neutral-300 font-outfit leading-relaxed">
                Convene remotely from anywhere in the world with real-time voting and speech timers
              </p>
            </div>

            <div className="flex items-center gap-1.5">
              <button
                type="button"
                onClick={() => scrollRail(virtualRailRef, 'left')}
                className="p-2 rounded-full bg-white/5 hover:bg-white/10 border border-white/10 text-neutral-300 hover:text-white transition cursor-pointer"
                title="Scroll Left"
              >
                <ChevronLeft className="w-4 h-4" />
              </button>
              <button
                type="button"
                onClick={() => scrollRail(virtualRailRef, 'right')}
                className="p-2 rounded-full bg-white/5 hover:bg-white/10 border border-white/10 text-neutral-300 hover:text-white transition cursor-pointer"
                title="Scroll Right"
              >
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>

          <div 
            ref={virtualRailRef}
            className="flex gap-4 overflow-x-auto scrollbar-none pb-2 pt-1 snap-x snap-mandatory"
          >
            {virtualChambersRail.map((event) => (
              <div
                key={event.id}
                onClick={() => {
                  window.location.href = `/events/${event.slug || event.id}`;
                }}
                className="w-60 sm:w-72 shrink-0 snap-start group cursor-pointer p-4 rounded-2xl bg-neutral-900/80 border border-white/10 hover:border-cyan-400/50 space-y-3 transition-all duration-300 shadow-md"
              >
                <div className="flex items-center justify-between">
                  <span className="px-2 py-0.5 rounded-full bg-cyan-500/20 text-cyan-300 border border-cyan-500/30 font-mono text-[10px] font-bold">
                    ONLINE CHAMBER
                  </span>
                  <span className="text-xs font-mono text-amber-300 font-bold">
                    {event.ticketPrice ? `₹${event.ticketPrice}` : 'Free Entry'}
                  </span>
                </div>
                <div>
                  <h3 className="font-display font-bold text-base text-white group-hover:text-cyan-300 transition-colors truncate">
                    {event.title}
                  </h3>
                  <p className="text-xs text-neutral-400 font-mono mt-0.5 truncate">
                    {event.date} &bull; {event.time}
                  </p>
                </div>
                <div className="pt-2 border-t border-white/5 flex items-center justify-between text-[11px] font-mono text-neutral-400">
                  <span>{event.attendees.length} Delegates</span>
                  <span className="text-cyan-400 group-hover:translate-x-1 transition-transform flex items-center gap-1 font-bold">
                    Join Chamber <ChevronRight className="w-3.5 h-3.5" />
                  </span>
                </div>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* ════════════════════════════════════════════════════════════════
          COMPLETE CONVENINGS DIRECTORY & FILTER ENGINE
          ════════════════════════════════════════════════════════════════ */}
      <section className="space-y-6 pt-4 border-t border-white/10">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h2 className="text-xl sm:text-2xl font-space font-black text-white tracking-tight uppercase">
              All Convenings &amp; Delegations
            </h2>
            <p className="text-xs text-neutral-300 font-outfit leading-relaxed">
              Filter by proximity radar, status, or search through all verified summits
            </p>
          </div>

          {/* Filter Tabs */}
          <div className="flex flex-wrap p-1 rounded-full bg-white/[0.04] border border-white/10 w-full md:w-auto">
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
                className={`flex-1 md:flex-none px-4 py-1.5 rounded-full text-xs font-mono font-semibold transition cursor-pointer ${
                  activeFilter === tab.id
                    ? 'bg-white text-black shadow-md font-bold'
                    : 'text-neutral-400 hover:text-white'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>
        </div>

        {/* Location Radar Controls */}
        <LocationRadarBar />

        {/* Events Grid */}
        <div>
          {filteredEvents.length === 0 ? (
            <div className="rounded-3xl p-12 text-center bg-white/[0.02] border border-white/10 my-6 space-y-4">
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
                className="px-5 py-2 rounded-full bg-white/10 border border-white/15 text-xs font-mono text-white hover:bg-white/20 transition cursor-pointer"
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
      </section>

      {/* ── FAQ SECTION ── */}
      <EventsFaqSection />

      {/* ── ZENPASS MODALS ── */}
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

      {/* Interactive World Location Picker Modal via Google Maps */}
      <WorldLocationPickerModal
        isOpen={isWorldPickerOpen}
        onClose={() => setIsWorldPickerOpen(false)}
        initialLocation={userLocation?.city || (selectedCity !== 'ALL' ? selectedCity : undefined)}
        title="Select Assembly Location via Google Maps"
        onSelectLocation={(loc) => {
          const cityName = loc.city || loc.name;
          setSelectedCity(cityName);
          if (loc.lat && loc.lng) {
            setUserLocation({
              latitude: loc.lat,
              longitude: loc.lng,
              city: cityName,
              address: loc.address || loc.name
            });
          }
          setIsWorldPickerOpen(false);
        }}
        onRemoveLocation={() => {
          setSelectedCity('ALL');
          setUserLocation(null);
          setIsWorldPickerOpen(false);
        }}
      />
    </div>
  );
}
