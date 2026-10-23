'use client';

import React, { useState, useRef, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { 
  X, 
  Sparkles, 
  Calendar, 
  MapPin, 
  Clock, 
  Tag, 
  DollarSign, 
  Users, 
  Check, 
  Upload, 
  Lock, 
  Ticket, 
  Plus, 
  Trash2, 
  AlertCircle,
  FileText,
  CreditCard,
  Zap,
  FilePlus,
  Layers,
  Search,
  Globe2,
  Sliders,
  Maximize2,
  Radio,
  Image as ImageIcon,
  CheckCircle2,
  Video
} from 'lucide-react';
import { useAuth } from '@/context/AuthContext';
import { useZenEvents } from '@/context/ZenEventsPlatformContext';
import { useZenPass } from '@/context/ZenPassContext';
import { EventCategory, EventType } from '@/types/events';
import { getPublicForms } from '@/lib/formsStorage';
import { ZenForm } from '@/types/forms';
import { WorldLocationPickerModal, WorldLocation } from '@/components/common/WorldLocationPickerModal';

const COVER_PRESETS = [
  'https://images.unsplash.com/photo-1540575467063-178a50c2df87?auto=format&fit=crop&w=1200&q=80',
  'https://images.unsplash.com/photo-1511578314322-379afb476865?auto=format&fit=crop&w=1200&q=80',
  'https://images.unsplash.com/photo-1528605248644-14dd04022da1?auto=format&fit=crop&w=1200&q=80',
  'https://images.unsplash.com/photo-1505373877841-8d25f7d46678?auto=format&fit=crop&w=1200&q=80',
];

const KNOWN_CITIES = [
  { name: 'New Delhi & NCR', value: 'New Delhi', lat: 28.6139, lng: 77.2090 },
  { name: 'Gurugram', value: 'Gurugram', lat: 28.4595, lng: 77.0266 },
  { name: 'Mumbai', value: 'Mumbai', lat: 19.0760, lng: 72.8777 },
  { name: 'Bengaluru', value: 'Bengaluru', lat: 12.9716, lng: 77.5946 },
  { name: 'Pune', value: 'Pune', lat: 18.5204, lng: 73.8567 },
  { name: 'Hyderabad', value: 'Hyderabad', lat: 17.3850, lng: 78.4867 },
  { name: 'Kolkata', value: 'Kolkata', lat: 22.5726, lng: 88.3639 },
  { name: 'Chennai', value: 'Chennai', lat: 13.0827, lng: 80.2707 },
  { name: 'Geneva', value: 'Geneva', lat: 46.2044, lng: 6.1432 },
  { name: 'London', value: 'London', lat: 51.5074, lng: -0.1278 },
  { name: 'New York', value: 'New York', lat: 40.7128, lng: -74.0060 },
];

export function CreateEventModal() {
  const router = useRouter();
  const { profile } = useAuth();
  const { createEvent, setActiveView, events, currentUserUsername, currentUserId } = useZenEvents();
  const { setShowPassWalletModal } = useZenPass();

  const isEventManager = Boolean(
    profile?.role === 'admin' ||
    (profile?.role as string) === 'organizer' ||
    (profile?.role as string) === 'secretariat' ||
    profile?.email?.toLowerCase() === 'founder@zenvitra.xyz' ||
    profile?.email?.toLowerCase() === 'founder@zenvitra.org' ||
    (events && events.some((e) => e.organizerUsername === currentUserUsername || e.organizerId === currentUserId))
  );

  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [coverImage, setCoverImage] = useState(COVER_PRESETS[0]);
  const [customCover, setCustomCover] = useState('');
  const [type, setType] = useState<EventType>('physical');
  const [category, setCategory] = useState<EventCategory>('SUMMIT');
  const [date, setDate] = useState('');
  const [time, setTime] = useState('');
  const [location, setLocation] = useState('');
  const [city, setCity] = useState('New Delhi');
  const [meetingUrl, setMeetingUrl] = useState('');
  const [selectedCoordinates, setSelectedCoordinates] = useState<{ lat?: number; lng?: number }>({});
  
  // Google Places API Location Search
  const [isLocationPickerOpen, setIsLocationPickerOpen] = useState(false);
  const [placesQuery, setPlacesQuery] = useState('');
  const [placesSuggestions, setPlacesSuggestions] = useState<any[]>([]);
  const [isSearchingPlaces, setIsSearchingPlaces] = useState(false);
  const [showPlacesDropdown, setShowPlacesDropdown] = useState(false);

  // Cover Artwork "Set the Artwork" Modal State
  const [isArtworkModalOpen, setIsArtworkModalOpen] = useState(false);
  const [pendingArtwork, setPendingArtwork] = useState<string>('');
  const [artworkPosition, setArtworkPosition] = useState<'top' | 'center' | 'bottom'>('center');
  const [artworkFit, setArtworkFit] = useState<'cover' | 'contain'>('cover');
  const [artworkZoom, setArtworkZoom] = useState<number>(100);

  // ── Pricing & Ticketing Modes ──
  type PricingMode = 'FREE' | 'NORMAL' | 'TIERED';
  const [pricingMode, setPricingMode] = useState<PricingMode>('FREE');
  const [ticketPrice, setTicketPrice] = useState<number | string>(499);
  const [capacity, setCapacity] = useState<number | string>('150');
  const [tagInput, setTagInput] = useState('');
  const fileInputRef = useRef<HTMLInputElement>(null);

  // ── REGISTRATION FORM TIMING (CREATE NOW OR AFTER) ──
  type FormTimingOption = 'CREATE_NOW_SCRATCH' | 'CREATE_NOW_TEMPLATE' | 'LINK_EXISTING' | 'CREATE_AFTER';
  const [formTiming, setFormTiming] = useState<FormTimingOption>('CREATE_AFTER');
  const [selectedExistingFormId, setSelectedExistingFormId] = useState<string>('');
  const [existingForms, setExistingForms] = useState<ZenForm[]>([]);

  useEffect(() => {
    try {
      const forms = getPublicForms();
      setExistingForms(forms);
      if (forms.length > 0 && !selectedExistingFormId) {
        setSelectedExistingFormId(forms[0].id);
      }
    } catch {}
  }, [selectedExistingFormId]);

  // Google Places API Search Debounce
  useEffect(() => {
    if (!placesQuery.trim() || placesQuery.length < 2) {
      setPlacesSuggestions([]);
      setShowPlacesDropdown(false);
      return;
    }
    const timer = setTimeout(async () => {
      try {
        setIsSearchingPlaces(true);
        const res = await fetch(`/api/places?query=${encodeURIComponent(placesQuery.trim())}`);
        if (res.ok) {
          const data = await res.json();
          if (data.success && Array.isArray(data.places)) {
            setPlacesSuggestions(data.places.slice(0, 6));
            setShowPlacesDropdown(true);
          }
        }
      } catch (err) {
        console.warn('Google Places API search error', err);
      } finally {
        setIsSearchingPlaces(false);
      }
    }, 300);
    return () => clearTimeout(timer);
  }, [placesQuery]);

  // ── TIER DEFINITION WITH EXCLUSIVE BANK & CARD OFFERS ──
  interface EventCustomTier {
    id: string;
    name: string;
    price: number;
    description: string;
    perks: string;
    capacity?: number;
    badge?: string;
    salePhase: 'NOW' | 'SCHEDULED';
    saleStartDate?: string;
    exclusiveOfferEnabled: boolean;
    cardType: 'RUPAY' | 'VISA' | 'MASTERCARD' | 'STUDENT' | 'EARLY_ACCESS';
    discountMode?: 'FLAT' | 'PERCENT';
    offerTitle: string;
    discountFlat: number;
    discountPercent?: number;
    badgeText: string;
  }

  const [eventTiers, setEventTiers] = useState<EventCustomTier[]>([]);

  const handleAddEventTier = (template?: { 
    name: string; 
    price: number; 
    badge?: string;
    exclusiveOfferEnabled?: boolean;
    cardType?: 'RUPAY' | 'VISA' | 'MASTERCARD' | 'STUDENT' | 'EARLY_ACCESS';
    discountMode?: 'FLAT' | 'PERCENT';
    offerTitle?: string;
    discountFlat?: number;
    discountPercent?: number;
    badgeText?: string;
  }) => {
    const newTier: EventCustomTier = {
      id: `tier_${Date.now()}_${Math.random().toString(36).substring(2, 5)}`,
      name: template?.name || 'New Attendee Pass',
      price: template?.price ?? 599,
      description: 'Official event admission pass.',
      perks: 'Event Admission, Digital Certificate',
      capacity: 50,
      badge: template?.badge,
      salePhase: 'NOW',
      saleStartDate: '',
      exclusiveOfferEnabled: template?.exclusiveOfferEnabled ?? false,
      cardType: template?.cardType || 'RUPAY',
      discountMode: template?.discountMode || 'FLAT',
      offerTitle: template?.offerTitle || 'RUPAY CARD OFFER • BUY TICKETS NOW',
      discountFlat: template?.discountFlat ?? 150,
      discountPercent: template?.discountPercent ?? 20,
      badgeText: template?.badgeText || 'RUPAY SALE'
    };
    setEventTiers((prev) => [...prev, newTier]);
  };

  const handleRemoveEventTier = (id: string) => {
    setEventTiers((prev) => prev.filter((t) => t.id !== id));
  };

  const handleUpdateEventTier = (id: string, field: keyof EventCustomTier, value: any) => {
    setEventTiers((prev) => prev.map((t) => (t.id === id ? { ...t, [field]: value } : t)));
  };

  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // File Upload Handler that opens the "Set the Artwork" modal
  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 12 * 1024 * 1024) {
        setToastMessage('File size must be under 12MB.');
        return;
      }
      const reader = new FileReader();
      reader.onload = (event) => {
        if (event.target?.result) {
          const resultUrl = event.target.result as string;
          setPendingArtwork(resultUrl);
          setIsArtworkModalOpen(true);
        }
      };
      reader.readAsDataURL(file);
    }
  };

  const handleApplyArtwork = () => {
    if (pendingArtwork) {
      setCustomCover(pendingArtwork);
      setCoverImage(pendingArtwork);
    }
    setIsArtworkModalOpen(false);
  };

  const handleSelectPlaceSuggestion = (place: any) => {
    const placeName = place.name || place.address || '';
    setLocation(placeName);
    setPlacesQuery(placeName);
    if (place.city) {
      setCity(place.city);
    }
    if (place.lat && place.lng) {
      setSelectedCoordinates({ lat: place.lat, lng: place.lng });
    }
    setShowPlacesDropdown(false);
  };

  const isVirtual = type === 'virtual';

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!title.trim() || !date.trim()) {
      setToastMessage('Convening Title and Date are required.');
      return;
    }

    const finalLocation = isVirtual
      ? (meetingUrl.trim() || 'Virtual Online Assembly Chamber')
      : location.trim();

    if (!isVirtual && !finalLocation) {
      setToastMessage('Venue / Location is required for physical and hybrid events.');
      return;
    }

    const finalCity = isVirtual ? 'Online' : (city || 'New Delhi');
    const tags = tagInput.split(',').map((t) => t.trim()).filter(Boolean);
    const finalCover = customCover.trim() || coverImage;

    const matchedCity = KNOWN_CITIES.find(c => c.value.toLowerCase() === finalCity.toLowerCase());
    const lat = selectedCoordinates.lat || matchedCity?.lat || (finalCity === 'New Delhi' ? 28.6139 : undefined);
    const lng = selectedCoordinates.lng || matchedCity?.lng || (finalCity === 'New Delhi' ? 77.2090 : undefined);

    let finalPlans = [];
    let effectivePrice = 0;

    if (pricingMode === 'FREE') {
      finalPlans = [
        {
          id: `plan_free_${Date.now()}`,
          name: 'Complimentary Delegate Access',
          price: 0,
          currency: 'INR',
          description: 'Full diplomatic floor access and participation credential.',
          perks: ['Floor debate access', 'Official Delegate Kit', 'Verified Certificate'],
          status: 'active' as const,
          badge: 'FREE ENTRY',
          salePhase: 'NOW' as const,
        },
      ];
      effectivePrice = 0;
    } else if (pricingMode === 'NORMAL') {
      effectivePrice = Math.max(0, Number(ticketPrice));
      finalPlans = [
        {
          id: `plan_std_${Date.now()}`,
          name: 'General Admission / Delegate Pass',
          price: effectivePrice,
          currency: 'INR',
          description: 'Official admission pass with verified attendance credentials.',
          perks: ['Event Admission', 'Digital Pass', 'Networking Access'],
          status: 'active' as const,
          badge: 'STANDARD',
          salePhase: 'NOW' as const,
        },
      ];
    } else {
      finalPlans = eventTiers.map((t) => ({
        id: t.id,
        name: t.name.trim() || 'Attendee Pass',
        price: Math.max(0, Number(t.price)),
        currency: 'INR',
        description: t.description.trim() || 'Official admission pass.',
        perks: t.perks
          .split(',')
          .map((p) => p.trim())
          .filter(Boolean),
        capacity: t.capacity,
        bookedCount: 0,
        badge: t.badge?.trim() || undefined,
        status: 'active' as const,
        salePhase: t.salePhase,
        saleStartDate: t.saleStartDate || undefined,
        exclusiveOffer: t.exclusiveOfferEnabled ? {
          enabled: true,
          cardType: t.cardType,
          title: t.offerTitle,
          discountFlat: t.discountMode === 'PERCENT' ? undefined : t.discountFlat,
          discountPercent: t.discountMode === 'PERCENT' ? t.discountPercent : undefined,
          badgeText: t.badgeText
        } : undefined
      }));
      effectivePrice = eventTiers[0] ? Math.max(0, Number(eventTiers[0].price)) : 0;
    }

    const createdId = createEvent({
      title: title.trim(),
      description: description.trim(),
      coverImage: finalCover,
      type,
      category,
      date,
      time: time.trim() || '10:00 - 18:00 IST',
      location: finalLocation,
      city: finalCity,
      meetingUrl: isVirtual && meetingUrl ? meetingUrl.trim() : undefined,
      latitude: lat,
      longitude: lng,
      ticketPrice: effectivePrice,
      plans: finalPlans,
      capacity: capacity ? Number(capacity) : undefined,
      tags,
      formTiming: formTiming === 'CREATE_AFTER' ? 'CREATE_AFTER' : 'CREATE_NOW',
      formId: formTiming === 'LINK_EXISTING' ? selectedExistingFormId : undefined,
      paymentTiming: 'ACCEPT_NOW'
    });

    // Also sync to backend conference listings database
    fetch('/api/events/list', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        title: title.trim(),
        category,
        format: type,
        venue: finalLocation,
        city: finalCity,
        startDate: date,
        endDate: date,
        organizerName: profile?.display_name || 'Event Organizer',
        organizerEmail: profile?.email || 'organizer@zenvitra.xyz',
        description: description.trim() || `${title} — Convening on ZENVITRA`,
        coverImage: finalCover,
        ticketPrice: effectivePrice,
        tierPlans: finalPlans,
        userId: profile?.id || null,
        formTiming,
        paymentTiming: 'ACCEPT_NOW'
      }),
    }).catch(() => {});

    // If organizer chose to create form right now, redirect directly to form builder
    if (formTiming === 'CREATE_NOW_SCRATCH') {
      router.push(`/forms/edit/new?originEventId=${createdId}&eventTitle=${encodeURIComponent(title.trim())}`);
    } else if (formTiming === 'CREATE_NOW_TEMPLATE') {
      router.push(`/forms?originEventId=${createdId}&eventTitle=${encodeURIComponent(title.trim())}`);
    } else {
      setActiveView('list');
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/80 backdrop-blur-md overflow-y-auto">
      <div className="relative w-full max-w-3xl rounded-3xl bg-[#080b11] border border-cyan-500/20 shadow-2xl p-5 sm:p-7 space-y-6 my-6 max-h-[90vh] overflow-y-auto font-sans">
        
        {/* Toast Warning */}
        {toastMessage && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/75 backdrop-blur-sm animate-fade-in">
            <div className="relative w-full max-w-sm rounded-2xl bg-neutral-900 border border-amber-500/40 p-5 space-y-4 shadow-2xl">
              <div className="w-12 h-12 rounded-xl bg-amber-500/20 border border-amber-500/30 flex items-center justify-center text-amber-300">
                <AlertCircle className="w-6 h-6" />
              </div>
              <div className="space-y-1.5">
                <h4 className="text-sm font-bold text-white tracking-wide font-mono uppercase">
                  Action Required
                </h4>
                <p className="text-xs text-neutral-300 font-sans leading-relaxed">
                  {toastMessage}
                </p>
              </div>
              <button
                type="button"
                autoFocus
                onClick={() => setToastMessage(null)}
                className="w-full py-2.5 px-4 rounded-xl bg-gradient-to-r from-cyan-400 to-emerald-400 hover:from-cyan-300 hover:to-emerald-300 text-black font-mono text-xs font-bold transition shadow-lg cursor-pointer"
              >
                Got it
              </button>
            </div>
          </div>
        )}

        {/* ── SET THE ARTWORK MODAL ── */}
        {isArtworkModalOpen && (
          <div className="fixed inset-0 z-[110] flex items-center justify-center p-4 bg-black/85 backdrop-blur-md animate-fade-in">
            <div className="relative w-full max-w-2xl rounded-3xl bg-[#0a0e17] border border-cyan-500/40 p-5 sm:p-7 space-y-5 shadow-[0_0_50px_rgba(0,242,254,0.15)] font-sans">
              
              <div className="flex items-start justify-between border-b border-white/10 pb-3">
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="p-1.5 rounded-lg bg-cyan-500/10 border border-cyan-500/30 text-cyan-400">
                      <ImageIcon className="w-4 h-4" />
                    </span>
                    <h3 className="text-base font-bold text-white font-display">Set &amp; Frame Cover Artwork</h3>
                  </div>
                  <p className="text-xs text-neutral-400">
                    Preview and adjust how your summit artwork displays on delegate cards and event passes.
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => setIsArtworkModalOpen(false)}
                  className="p-1.5 rounded-xl bg-white/5 hover:bg-white/10 text-neutral-400 hover:text-white transition cursor-pointer"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              {/* 16:9 Live Widescreen Canvas Preview */}
              <div className="relative aspect-[16/9] w-full rounded-2xl overflow-hidden border border-white/20 bg-black shadow-2xl flex items-center justify-center group">
                {/* Ambient Blurred Background if Contain */}
                {artworkFit === 'contain' && pendingArtwork && (
                  <div 
                    className="absolute inset-0 bg-cover bg-center filter blur-xl opacity-40 scale-110"
                    style={{ backgroundImage: `url(${pendingArtwork})` }}
                  />
                )}

                {/* Actual Image with position and scale */}
                {pendingArtwork && (
                  <img
                    src={pendingArtwork}
                    alt="Event Artwork Preview"
                    className="w-full h-full relative z-10 transition-all duration-200"
                    style={{
                      objectFit: artworkFit,
                      objectPosition: artworkPosition,
                      transform: `scale(${artworkZoom / 100})`,
                    }}
                  />
                )}

                {/* Live Summit Overlay Preview */}
                <div className="absolute inset-0 z-20 bg-gradient-to-t from-black/85 via-black/20 to-transparent p-4 sm:p-6 flex flex-col justify-between pointer-events-none">
                  <div className="flex items-center gap-2">
                    <span className="px-2.5 py-0.5 rounded-full bg-cyan-500/30 backdrop-blur-md border border-cyan-400/40 text-cyan-200 text-[10px] font-mono font-bold uppercase tracking-wider">
                      {category}
                    </span>
                    <span className="px-2.5 py-0.5 rounded-full bg-black/50 backdrop-blur-md border border-white/20 text-white text-[10px] font-mono">
                      {type.toUpperCase()}
                    </span>
                  </div>

                  <div className="space-y-1">
                    <p className="text-[10px] font-mono text-cyan-400 uppercase tracking-widest font-bold">
                      ZENVITRA OFFICIAL CONVENING
                    </p>
                    <h4 className="text-base sm:text-xl font-display font-extrabold text-white tracking-tight drop-shadow-md truncate">
                      {title.trim() || 'Convening Title Preview'}
                    </h4>
                    <p className="text-xs text-neutral-300 font-mono">
                      {date || 'Date Pending'} &bull; {isVirtual ? 'Virtual Online' : (location || city || 'Venue')}
                    </p>
                  </div>
                </div>
              </div>

              {/* Artwork Adjustment Controls */}
              <div className="p-3.5 rounded-2xl bg-white/[0.03] border border-white/10 space-y-3 text-xs font-mono">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {/* Focal Alignment */}
                  <div className="space-y-1">
                    <span className="text-[11px] text-neutral-400 block font-semibold">Focal Alignment:</span>
                    <div className="grid grid-cols-3 gap-1.5">
                      {(['top', 'center', 'bottom'] as const).map((pos) => (
                        <button
                          key={pos}
                          type="button"
                          onClick={() => setArtworkPosition(pos)}
                          className={`py-1.5 px-2 rounded-xl text-center capitalize transition cursor-pointer text-[10px] ${
                            artworkPosition === pos
                              ? 'bg-cyan-500 text-black font-bold shadow'
                              : 'bg-white/5 text-neutral-300 hover:bg-white/10'
                          }`}
                        >
                          {pos}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Framing Fit Mode */}
                  <div className="space-y-1">
                    <span className="text-[11px] text-neutral-400 block font-semibold">Framing Mode:</span>
                    <div className="grid grid-cols-2 gap-1.5">
                      <button
                        type="button"
                        onClick={() => setArtworkFit('cover')}
                        className={`py-1.5 px-2 rounded-xl text-center transition cursor-pointer text-[10px] ${
                          artworkFit === 'cover'
                            ? 'bg-cyan-500 text-black font-bold shadow'
                            : 'bg-white/5 text-neutral-300 hover:bg-white/10'
                        }`}
                      >
                        Fill Widescreen (Cover)
                      </button>
                      <button
                        type="button"
                        onClick={() => setArtworkFit('contain')}
                        className={`py-1.5 px-2 rounded-xl text-center transition cursor-pointer text-[10px] ${
                          artworkFit === 'contain'
                            ? 'bg-cyan-500 text-black font-bold shadow'
                            : 'bg-white/5 text-neutral-300 hover:bg-white/10'
                        }`}
                      >
                        Full Image (Contain)
                      </button>
                    </div>
                  </div>
                </div>

                {/* Zoom / Scale Slider */}
                <div className="space-y-1 pt-1 border-t border-white/10">
                  <div className="flex items-center justify-between text-[11px] text-neutral-400">
                    <span>Artwork Scale / Zoom:</span>
                    <span className="text-white font-bold">{artworkZoom}%</span>
                  </div>
                  <input
                    type="range"
                    min="100"
                    max="140"
                    value={artworkZoom}
                    onChange={(e) => setArtworkZoom(Number(e.target.value))}
                    className="w-full accent-cyan-400 cursor-pointer"
                  />
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex items-center justify-between pt-2 border-t border-white/10">
                <button
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  className="px-3 py-2 rounded-xl bg-white/5 hover:bg-white/10 text-neutral-300 hover:text-white text-xs font-mono transition cursor-pointer flex items-center gap-1.5"
                >
                  <Upload className="w-3.5 h-3.5 text-neutral-400" />
                  <span>Choose Another Image</span>
                </button>

                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => setIsArtworkModalOpen(false)}
                    className="px-4 py-2 rounded-xl bg-white/5 hover:bg-white/10 text-neutral-400 hover:text-white text-xs font-mono transition cursor-pointer"
                  >
                    Cancel
                  </button>
                  <button
                    type="button"
                    onClick={handleApplyArtwork}
                    className="px-5 py-2 rounded-xl bg-gradient-to-r from-cyan-400 to-emerald-400 hover:from-cyan-300 hover:to-emerald-300 text-black font-mono font-bold text-xs transition shadow-lg shadow-cyan-500/20 cursor-pointer flex items-center gap-1.5"
                  >
                    <Check className="w-4 h-4" />
                    <span>Apply &amp; Set Artwork</span>
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-white/10">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-cyan-400 to-blue-600 flex items-center justify-center text-black font-black text-xs shadow-md">
                <Sparkles className="w-4 h-4" />
              </div>
              <h2 className="text-lg sm:text-xl font-bold font-display tracking-tight text-white">
                Launch New Convening &bull; Event Studio
              </h2>
            </div>
            <p className="text-xs text-neutral-400 font-sans">
              Deploy your conference, summit, or delegation assembly with complete ticketing, bank sales, and form intake control.
            </p>
          </div>
          <button
            type="button"
            onClick={() => setActiveView('list')}
            className="p-2 rounded-xl text-neutral-400 hover:text-white hover:bg-white/10 transition cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Title */}
          <div className="space-y-1.5">
            <label className="block text-xs font-mono font-semibold text-neutral-300">CONVENING TITLE *</label>
            <input
              type="text"
              required
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="e.g. Geneva Global Summit 2026 / National Lok Sabha Simulation"
              className="w-full px-4 py-3 rounded-2xl bg-white/[0.04] border border-white/10 text-sm text-white placeholder:text-neutral-600 focus:outline-none focus:border-cyan-500/50"
            />
          </div>

          {/* Type & Category */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <label className="block text-xs font-mono font-semibold text-neutral-300">FORMAT TYPE</label>
              <select
                value={type}
                onChange={(e) => setType(e.target.value as EventType)}
                className="w-full px-4 py-3 rounded-2xl bg-neutral-900 border border-white/10 text-xs font-mono text-white focus:outline-none focus:border-cyan-500/50 cursor-pointer"
              >
                <option value="physical">Physical In-Person Venue</option>
                <option value="virtual">Virtual Online Assembly (Remote)</option>
                <option value="hybrid">Hybrid (Physical &amp; Virtual)</option>
              </select>
            </div>

            <div className="space-y-1.5">
              <label className="block text-xs font-mono font-semibold text-neutral-300">CATEGORY</label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value as EventCategory)}
                className="w-full px-4 py-3 rounded-2xl bg-neutral-900 border border-white/10 text-xs font-mono text-white focus:outline-none focus:border-cyan-500/50 cursor-pointer"
              >
                <option value="SUMMIT">Diplomatic Summit</option>
                <option value="MUN">Model United Nations (MUN)</option>
                <option value="PARLIAMENT">Parliamentary / Youth Sabha</option>
                <option value="POLICY">Policy Roundtable</option>
                <option value="WORKSHOP">Academy &amp; Workshop</option>
                <option value="KEYNOTE">Keynote &amp; Plenary</option>
                <option value="HACKATHON">Civic Hackathon</option>
                <option value="OTHER">Other Assembly</option>
              </select>
            </div>
          </div>

          {/* Date & Time */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <label className="block text-xs font-mono font-semibold text-neutral-300">DATE *</label>
              <input
                type="date"
                required
                value={date}
                onChange={(e) => setDate(e.target.value)}
                className="w-full px-4 py-2.5 rounded-2xl bg-white/[0.04] border border-white/10 text-xs font-mono text-white focus:outline-none focus:border-cyan-500/50"
              />
            </div>

            <div className="space-y-1.5">
              <label className="block text-xs font-mono font-semibold text-neutral-300">TIME WINDOW</label>
              <input
                type="text"
                value={time}
                onChange={(e) => setTime(e.target.value)}
                placeholder="e.g. 10:00 - 18:00 IST"
                className="w-full px-4 py-2.5 rounded-2xl bg-white/[0.04] border border-white/10 text-xs font-mono text-white focus:outline-none focus:border-cyan-500/50"
              />
            </div>
          </div>

          {/* ══════════════════════════════════════════════════════════════
              LOCATION SECTION: ONLINE VS PHYSICAL WITH GMAPS API
              ══════════════════════════════════════════════════════════════ */}
          {isVirtual ? (
            /* ONLINE EVENT: NO PHYSICAL VENUE REQUIRED */
            <div className="p-4 sm:p-5 rounded-2xl bg-cyan-950/20 border border-cyan-500/30 space-y-3 animate-fade-in">
              <div className="flex items-center gap-2.5 text-cyan-300 font-mono text-xs font-bold">
                <Radio className="w-4 h-4 text-cyan-400 animate-pulse" />
                <span>VIRTUAL ONLINE CONVENING &bull; NO PHYSICAL LOCATION NEEDED</span>
              </div>
              <p className="text-[11px] text-neutral-300 font-sans leading-relaxed">
                Delegates will join this convening remotely from anywhere in the world through the digital chamber.
              </p>
              <div className="space-y-1.5 pt-1">
                <label className="block text-xs font-mono font-semibold text-cyan-200">
                  ONLINE MEETING / STREAM LINK (OPTIONAL)
                </label>
                <div className="relative">
                  <Video className="w-4 h-4 absolute left-3.5 top-3 text-cyan-400" />
                  <input
                    type="url"
                    value={meetingUrl}
                    onChange={(e) => setMeetingUrl(e.target.value)}
                    placeholder="https://meet.google.com/xyz or Zoom / live link (optional)"
                    className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-neutral-900 border border-white/15 text-xs font-mono text-white placeholder:text-neutral-600 focus:outline-none focus:border-cyan-400"
                  />
                </div>
                <span className="text-[10px] font-mono text-neutral-400">
                  If left empty, delegates will automatically convene in the embedded Zenvitra Digital Chamber.
                </span>
              </div>
            </div>
          ) : (
            /* PHYSICAL OR HYBRID: GOOGLE MAPS API POWERED LOCATION */
            <div className="space-y-4 animate-fade-in">
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div className="sm:col-span-2 space-y-1.5">
                  <div className="flex items-center justify-between">
                    <label className="block text-xs font-mono font-semibold text-neutral-300">
                      VENUE / LOCATION (GOOGLE MAPS API) *
                    </label>
                    <button
                      type="button"
                      onClick={() => setIsLocationPickerOpen(true)}
                      className="text-[10px] font-mono text-cyan-400 hover:text-cyan-300 flex items-center gap-1 transition cursor-pointer"
                    >
                      <Globe2 className="w-3 h-3" />
                      <span>Map &amp; GPS Search</span>
                    </button>
                  </div>

                  {/* Autocomplete Input with Google Places API */}
                  <div className="relative">
                    <div className="relative">
                      <MapPin className="w-4 h-4 absolute left-3.5 top-3.5 text-cyan-400" />
                      <input
                        type="text"
                        required={!isVirtual}
                        value={location}
                        onChange={(e) => {
                          setLocation(e.target.value);
                          setPlacesQuery(e.target.value);
                        }}
                        onFocus={() => {
                          if (placesSuggestions.length > 0) setShowPlacesDropdown(true);
                        }}
                        placeholder="Search venue or address (e.g. India International Centre, Vigyan Bhawan)..."
                        className="w-full pl-10 pr-24 py-3 rounded-2xl bg-white/[0.04] border border-white/10 text-sm text-white placeholder:text-neutral-600 focus:outline-none focus:border-cyan-500/50"
                      />
                      {isSearchingPlaces && (
                        <div className="absolute right-3.5 top-3.5 text-cyan-400 text-[10px] font-mono animate-pulse">
                          Searching...
                        </div>
                      )}
                    </div>

                    {/* Google Places Live Suggestions Dropdown */}
                    {showPlacesDropdown && placesSuggestions.length > 0 && (
                      <div className="absolute left-0 right-0 top-full mt-1.5 z-40 rounded-2xl bg-[#0d121f] border border-cyan-500/30 shadow-2xl p-1.5 space-y-1 max-h-60 overflow-y-auto">
                        <div className="px-3 py-1 text-[9px] font-mono text-neutral-400 uppercase tracking-widest border-b border-white/5 flex items-center justify-between">
                          <span>Google Maps Places Results</span>
                          <span className="text-cyan-400">Live API</span>
                        </div>
                        {placesSuggestions.map((place, idx) => (
                          <div
                            key={idx}
                            onClick={() => handleSelectPlaceSuggestion(place)}
                            className="p-2.5 rounded-xl hover:bg-cyan-500/10 border border-transparent hover:border-cyan-500/20 text-xs cursor-pointer transition flex items-start gap-2.5"
                          >
                            <MapPin className="w-3.5 h-3.5 text-cyan-400 mt-0.5 shrink-0" />
                            <div className="space-y-0.5 min-w-0">
                              <p className="font-bold text-white truncate">{place.name}</p>
                              {place.address && (
                                <p className="text-[10px] text-neutral-400 truncate">{place.address}</p>
                              )}
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </div>

                {/* Metro City / Region */}
                <div className="space-y-1.5">
                  <label className="block text-xs font-mono font-semibold text-neutral-300">METRO CITY</label>
                  <select
                    value={city}
                    onChange={(e) => setCity(e.target.value)}
                    className="w-full px-4 py-3 rounded-2xl bg-neutral-900 border border-white/10 text-xs font-mono text-white focus:outline-none focus:border-cyan-500/50 cursor-pointer"
                  >
                    {KNOWN_CITIES.map((c) => (
                      <option key={c.value} value={c.value}>
                        {c.name}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
            </div>
          )}

          {/* ══════════════════════════════════════════════════════════════
              REGISTRATION INTAKE FORM (NOW OR AFTER)
              ══════════════════════════════════════════════════════════════ */}
          <div className="p-4 sm:p-5 rounded-2xl bg-gradient-to-br from-[#121829] to-[#0a0d16] border border-amber-500/30 space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
              <div className="flex items-center gap-2">
                <div className="p-1.5 rounded-lg bg-amber-500/20 text-amber-400">
                  <FileText className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="text-xs font-mono font-bold text-white uppercase tracking-wider">
                    Registration &amp; Delegate Intake Form
                  </h3>
                  <p className="text-[11px] text-neutral-400">
                    Choose whether to configure your form now or complete it after launching your event.
                  </p>
                </div>
              </div>
              <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-amber-500/10 text-amber-300 border border-amber-500/30 font-bold shrink-0 self-start sm:self-auto">
                ZEN.FORMS STUDIO
              </span>
            </div>

            {/* 4 Choices */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
              {/* Option A: Create Form Now (Blank / Scratch) */}
              <div
                onClick={() => setFormTiming('CREATE_NOW_SCRATCH')}
                className={`p-3.5 rounded-xl border transition-all cursor-pointer flex flex-col justify-between space-y-1.5 relative ${
                  formTiming === 'CREATE_NOW_SCRATCH'
                    ? 'bg-amber-500/10 border-amber-400 text-white shadow-[0_0_20px_rgba(245,158,11,0.15)] ring-1 ring-amber-400'
                    : 'bg-white/[0.02] border-white/10 text-neutral-400 hover:border-white/20'
                }`}
              >
                <div className="flex items-center justify-between">
                  <span className="font-bold text-xs text-white flex items-center gap-1.5">
                    <FilePlus className="w-3.5 h-3.5 text-amber-400" />
                    <span>Create Now From Scratch</span>
                  </span>
                  {formTiming === 'CREATE_NOW_SCRATCH' && <Check className="w-3.5 h-3.5 text-amber-400" />}
                </div>
                <p className="text-[11px] text-neutral-300">
                  Opens a fresh, customizable blank form canvas immediately upon launching.
                </p>
              </div>

              {/* Option B: Create Now Using Template */}
              <div
                onClick={() => setFormTiming('CREATE_NOW_TEMPLATE')}
                className={`p-3.5 rounded-xl border transition-all cursor-pointer flex flex-col justify-between space-y-1.5 relative ${
                  formTiming === 'CREATE_NOW_TEMPLATE'
                    ? 'bg-amber-500/10 border-amber-400 text-white shadow-[0_0_20px_rgba(245,158,11,0.15)] ring-1 ring-amber-400'
                    : 'bg-white/[0.02] border-white/10 text-neutral-400 hover:border-white/20'
                }`}
              >
                <div className="flex items-center justify-between">
                  <span className="font-bold text-xs text-white flex items-center gap-1.5">
                    <Layers className="w-3.5 h-3.5 text-amber-400" />
                    <span>Create Using a Template</span>
                  </span>
                  {formTiming === 'CREATE_NOW_TEMPLATE' && <Check className="w-3.5 h-3.5 text-amber-400" />}
                </div>
                <p className="text-[11px] text-neutral-300">
                  Pre-populates with standard 1-line agendas, committee choices, and portfolio preferences.
                </p>
              </div>

              {/* Option C: Link Existing Form */}
              <div
                onClick={() => setFormTiming('LINK_EXISTING')}
                className={`p-3.5 rounded-xl border transition-all cursor-pointer flex flex-col justify-between space-y-1.5 relative ${
                  formTiming === 'LINK_EXISTING'
                    ? 'bg-amber-500/10 border-amber-400 text-white shadow-[0_0_20px_rgba(245,158,11,0.15)] ring-1 ring-amber-400'
                    : 'bg-white/[0.02] border-white/10 text-neutral-400 hover:border-white/20'
                }`}
              >
                <div className="flex items-center justify-between">
                  <span className="font-bold text-xs text-white flex items-center gap-1.5">
                    <FileText className="w-3.5 h-3.5 text-amber-400" />
                    <span>Link an Existing Form</span>
                  </span>
                  {formTiming === 'LINK_EXISTING' && <Check className="w-3.5 h-3.5 text-amber-400" />}
                </div>
                <p className="text-[11px] text-neutral-300">
                  Attach an already drafted form or custom application from your workspace.
                </p>
              </div>

              {/* Option D: Create Form Later */}
              <div
                onClick={() => setFormTiming('CREATE_AFTER')}
                className={`p-3.5 rounded-xl border transition-all cursor-pointer flex flex-col justify-between space-y-1.5 relative ${
                  formTiming === 'CREATE_AFTER'
                    ? 'bg-amber-500/10 border-amber-400 text-white shadow-[0_0_20px_rgba(245,158,11,0.15)] ring-1 ring-amber-400'
                    : 'bg-white/[0.02] border-white/10 text-neutral-400 hover:border-white/20'
                }`}
              >
                <div className="flex items-center justify-between">
                  <span className="font-bold text-xs text-white flex items-center gap-1.5">
                    <Clock className="w-3.5 h-3.5 text-amber-400" />
                    <span>Make Form After Launch</span>
                  </span>
                  {formTiming === 'CREATE_AFTER' && <Check className="w-3.5 h-3.5 text-amber-400" />}
                </div>
                <p className="text-[11px] text-neutral-300">
                  Launch the convening now and create or attach the intake form anytime later.
                </p>
              </div>
            </div>

            {/* Dropdown for Existing Form */}
            {formTiming === 'LINK_EXISTING' && (
              <div className="p-3 rounded-xl bg-black/40 border border-white/10 space-y-2 animate-fade-in">
                <label className="text-xs font-mono font-bold text-amber-300 block">
                  Select Form from Workspace:
                </label>
                <select
                  value={selectedExistingFormId}
                  onChange={(e) => setSelectedExistingFormId(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl bg-neutral-900 border border-white/15 text-white font-mono text-xs focus:outline-none focus:border-amber-400"
                >
                  {existingForms.map((form) => (
                    <option key={form.id} value={form.id}>
                      {form.title} ({form.fields?.length || 0} fields)
                    </option>
                  ))}
                </select>
              </div>
            )}
          </div>

          {/* ══════════════════════════════════════════════════════════════
              TICKET PASS STRUCTURE & BANK OFFERS
              ══════════════════════════════════════════════════════════════ */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <label className="text-xs font-mono font-semibold text-neutral-300 uppercase tracking-wider">
                Ticket Pass Structure &amp; Bank Offers
              </label>
              <span className="text-[10px] font-mono text-cyan-400">Cashfree PG Enabled</span>
            </div>

            {/* 3-Way Mode Switcher */}
            <div className="grid grid-cols-3 gap-2 p-1 rounded-2xl bg-white/[0.03] border border-white/10">
              <button
                type="button"
                onClick={() => setPricingMode('FREE')}
                className={`py-2 px-2 rounded-xl text-xs font-semibold font-mono transition cursor-pointer flex items-center justify-center gap-1 ${
                  pricingMode === 'FREE'
                    ? 'bg-white text-black shadow-sm font-bold'
                    : 'text-neutral-400 hover:text-white'
                }`}
              >
                {pricingMode === 'FREE' && <Check className="w-3 h-3 text-black stroke-[3]" />}
                <span>Free Entry</span>
              </button>

              <button
                type="button"
                onClick={() => setPricingMode('NORMAL')}
                className={`py-2 px-2 rounded-xl text-xs font-semibold font-mono transition cursor-pointer flex items-center justify-center gap-1 ${
                  pricingMode === 'NORMAL'
                    ? 'bg-white text-black shadow-sm font-bold'
                    : 'text-neutral-400 hover:text-white'
                }`}
              >
                {pricingMode === 'NORMAL' && <Check className="w-3 h-3 text-black stroke-[3]" />}
                <span>Normal Fee (₹)</span>
              </button>

              <button
                type="button"
                onClick={() => {
                  setPricingMode('TIERED');
                  if (eventTiers.length === 0) {
                    handleAddEventTier({
                      name: 'RuPay Early Access Pass',
                      price: 499,
                      badge: 'RUPAY SALE',
                      exclusiveOfferEnabled: true,
                      cardType: 'RUPAY',
                      discountMode: 'FLAT',
                      offerTitle: 'RUPAY CARD OFFER • BUY TICKETS NOW',
                      discountFlat: 150,
                      discountPercent: 0,
                      badgeText: 'RUPAY SALE'
                    });
                    handleAddEventTier({
                      name: 'General Admission',
                      price: 649,
                      badge: 'GENERAL SALE'
                    });
                  }
                }}
                className={`py-2 px-2 rounded-xl text-xs font-semibold font-mono transition cursor-pointer flex items-center justify-center gap-1 ${
                  pricingMode === 'TIERED'
                    ? 'bg-white text-black shadow-sm font-bold'
                    : 'text-neutral-400 hover:text-white'
                }`}
              >
                {pricingMode === 'TIERED' && <Check className="w-3 h-3 text-black stroke-[3]" />}
                <span>Tiers &amp; Bank Offers ({eventTiers.length})</span>
              </button>
            </div>

            {/* Normal Single Ticket Price */}
            {pricingMode === 'NORMAL' && (
              <div className="space-y-1.5 pt-1">
                <label className="block text-xs font-mono font-semibold text-neutral-300">FLAT TICKET PRICE (INR ₹)</label>
                <div className="relative">
                  <span className="absolute left-4 top-3 text-neutral-400 font-mono text-sm">₹</span>
                  <input
                    type="number"
                    min="0"
                    value={ticketPrice}
                    onChange={(e) => setTicketPrice(e.target.value)}
                    className="w-full pl-9 pr-4 py-2.5 rounded-2xl bg-white/[0.04] border border-white/10 text-xs font-mono text-white focus:outline-none focus:border-cyan-500/50"
                  />
                </div>
              </div>
            )}

            {/* Configured Tiers List & Bank Offers */}
            {pricingMode === 'TIERED' && (
              <div className="space-y-3 pt-2">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-mono font-bold text-white flex items-center gap-1.5">
                    <Ticket className="w-3.5 h-3.5 text-purple-400" />
                    <span>Configured Pass Tiers &amp; Offers ({eventTiers.length})</span>
                  </span>
                  <button
                    type="button"
                    onClick={() => handleAddEventTier()}
                    className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-purple-500/20 hover:bg-purple-500/30 border border-purple-500/40 text-purple-200 text-[11px] font-mono font-semibold transition cursor-pointer"
                  >
                    <Plus className="w-3 h-3" />
                    <span>Add Tier</span>
                  </button>
                </div>

                {/* Preset 1-Click Starter Examples */}
                <div className="flex flex-wrap items-center gap-1.5">
                  <span className="text-[10px] font-mono text-purple-300 font-semibold">1-Click Presets:</span>
                  {[
                    { 
                      name: 'RuPay Early Access Pass', 
                      price: 499, 
                      badge: 'RUPAY SALE',
                      exclusiveOfferEnabled: true,
                      cardType: 'RUPAY' as const,
                      discountMode: 'FLAT' as const,
                      offerTitle: 'RUPAY CARD OFFER • BUY TICKETS NOW',
                      discountFlat: 150,
                      discountPercent: 0,
                      badgeText: 'RUPAY SALE'
                    },
                    { 
                      name: 'Visa Special Presale', 
                      price: 699, 
                      badge: 'VISA EXCLUSIVE',
                      exclusiveOfferEnabled: true,
                      cardType: 'VISA' as const,
                      discountMode: 'FLAT' as const,
                      offerTitle: 'VISA CARD OFFER • PRIORITY ENTRY',
                      discountFlat: 100,
                      discountPercent: 0,
                      badgeText: 'VISA SALE'
                    },
                    { name: 'General Admission', price: 799, badge: 'GENERAL SALE' },
                    { name: 'VIP All-Access', price: 1499, badge: '👑 VIP' },
                    { name: 'Student Pass', price: 299, badge: '🎓 STUDENT' },
                  ].map((preset) => (
                    <button
                      key={preset.name}
                      type="button"
                      onClick={() => handleAddEventTier(preset)}
                      className="px-2 py-0.5 rounded-md bg-white/[0.05] hover:bg-white/10 border border-white/10 text-[10px] font-mono text-neutral-300 hover:text-white transition cursor-pointer"
                    >
                      + {preset.name} (₹{preset.price})
                    </button>
                  ))}
                </div>

                {/* Tier Cards List */}
                <div className="space-y-3 max-h-72 overflow-y-auto pr-1 scrollbar-thin">
                  {eventTiers.map((tier) => (
                    <div
                      key={tier.id}
                      className="p-3.5 rounded-xl bg-black/70 border border-white/15 space-y-2.5 text-xs shadow-md"
                    >
                      <div className="flex items-center justify-between gap-2">
                        <div className="flex-1">
                          <input
                            type="text"
                            value={tier.name}
                            onChange={(e) => handleUpdateEventTier(tier.id, 'name', e.target.value)}
                            placeholder="Pass Name (e.g. RuPay Early Bird / Executive)"
                            className="w-full bg-neutral-900 border border-white/15 rounded-lg px-2.5 py-1.5 text-white font-bold text-xs"
                          />
                        </div>
                        <div className="w-28 relative">
                          <span className="absolute left-2.5 top-1.5 text-neutral-400 font-mono text-xs">₹</span>
                          <input
                            type="number"
                            min={0}
                            value={tier.price}
                            onChange={(e) => handleUpdateEventTier(tier.id, 'price', Number(e.target.value))}
                            className="w-full pl-6 pr-2 py-1.5 bg-neutral-900 border border-white/15 rounded-lg text-amber-300 font-bold text-xs font-mono"
                          />
                        </div>
                        {eventTiers.length > 1 && (
                          <button
                            type="button"
                            onClick={() => handleRemoveEventTier(tier.id)}
                            className="p-1.5 text-neutral-500 hover:text-rose-400 transition"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        )}
                      </div>

                      <div className="grid grid-cols-2 gap-2 text-[11px] font-mono">
                        <div>
                          <input
                            type="text"
                            value={tier.badge || ''}
                            onChange={(e) => handleUpdateEventTier(tier.id, 'badge', e.target.value)}
                            placeholder="Badge (e.g. RUPAY SALE / LIMITED)"
                            className="w-full bg-neutral-900 border border-white/15 rounded px-2 py-1 text-white"
                          />
                        </div>
                        <div>
                          <input
                            type="number"
                            value={tier.capacity || ''}
                            onChange={(e) => handleUpdateEventTier(tier.id, 'capacity', Number(e.target.value))}
                            placeholder="Tier Capacity"
                            className="w-full bg-neutral-900 border border-white/15 rounded px-2 py-1 text-white"
                          />
                        </div>
                      </div>

                      {/* Exclusive Bank Card Offer Toggle */}
                      <div className="p-2.5 rounded-lg bg-purple-950/20 border border-purple-500/20 space-y-2">
                        <div className="flex items-center justify-between">
                          <label className="flex items-center gap-2 cursor-pointer">
                            <input
                              type="checkbox"
                              checked={tier.exclusiveOfferEnabled}
                              onChange={(e) => handleUpdateEventTier(tier.id, 'exclusiveOfferEnabled', e.target.checked)}
                              className="accent-purple-400 cursor-pointer"
                            />
                            <span className="text-[11px] font-mono text-purple-300 font-bold flex items-center gap-1">
                              <Sparkles className="w-3 h-3 text-purple-400" />
                              <span>Exclusive Card Offer (&ldquo;RUPAY SALE&rdquo; / Discount)</span>
                            </span>
                          </label>
                          <span className="text-[9px] font-mono text-neutral-400">
                            {tier.exclusiveOfferEnabled ? 'Active' : 'Off'}
                          </span>
                        </div>

                        {tier.exclusiveOfferEnabled && (
                          <div className="space-y-2 pt-1 border-t border-purple-500/20 text-[10px] font-mono">
                            <div className="flex items-center justify-between text-neutral-300">
                              <span className="font-semibold text-purple-200">Discount Mode:</span>
                              <div className="flex items-center gap-1 bg-black/50 p-0.5 rounded-lg border border-white/10">
                                <button
                                  type="button"
                                  onClick={() => handleUpdateEventTier(tier.id, 'discountMode', 'FLAT')}
                                  className={`px-2 py-0.5 rounded text-[9px] font-bold transition cursor-pointer ${
                                    tier.discountMode !== 'PERCENT'
                                      ? 'bg-purple-500 text-white shadow'
                                      : 'text-neutral-400 hover:text-white'
                                  }`}
                                >
                                  Flat ₹
                                </button>
                                <button
                                  type="button"
                                  onClick={() => handleUpdateEventTier(tier.id, 'discountMode', 'PERCENT')}
                                  className={`px-2 py-0.5 rounded text-[9px] font-bold transition cursor-pointer ${
                                    tier.discountMode === 'PERCENT'
                                      ? 'bg-purple-500 text-white shadow'
                                      : 'text-neutral-400 hover:text-white'
                                  }`}
                                >
                                  % Off
                                </button>
                              </div>
                            </div>

                            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                              <div>
                                <span className="text-neutral-400 block mb-0.5">Card Scheme / Bank:</span>
                                <select
                                  value={tier.cardType}
                                  onChange={(e) => handleUpdateEventTier(tier.id, 'cardType', e.target.value)}
                                  className="w-full bg-neutral-900 border border-white/15 rounded px-2 py-1 text-white cursor-pointer"
                                >
                                  <option value="RUPAY">RuPay Card</option>
                                  <option value="VISA">Visa Card</option>
                                  <option value="MASTERCARD">Mastercard</option>
                                  <option value="STUDENT">Student Card</option>
                                  <option value="EARLY_ACCESS">Early Access</option>
                                </select>
                              </div>

                              <div>
                                <span className="text-neutral-400 block mb-0.5">Offer Title (Customizable):</span>
                                <input
                                  type="text"
                                  value={tier.offerTitle}
                                  onChange={(e) => handleUpdateEventTier(tier.id, 'offerTitle', e.target.value)}
                                  placeholder="RUPAY CARD OFFER"
                                  className="w-full bg-neutral-900 border border-white/15 rounded px-2 py-1 text-white"
                                />
                              </div>

                              <div>
                                <span className="text-neutral-400 block mb-0.5">
                                  {tier.discountMode === 'PERCENT' ? 'Discount Percentage (%):' : 'Discount Amount (₹):'}
                                </span>
                                <input
                                  type="number"
                                  min={0}
                                  max={tier.discountMode === 'PERCENT' ? 100 : tier.price}
                                  value={tier.discountMode === 'PERCENT' ? (tier.discountPercent ?? 20) : tier.discountFlat}
                                  onChange={(e) =>
                                    handleUpdateEventTier(
                                      tier.id,
                                      tier.discountMode === 'PERCENT' ? 'discountPercent' : 'discountFlat',
                                      Number(e.target.value) || 0
                                    )
                                  }
                                  className="w-full bg-neutral-900 border border-white/15 rounded px-2 py-1 text-amber-300 font-bold"
                                />
                              </div>
                            </div>
                            <p className="text-[9px] text-neutral-400">
                              💡 Example template: All card brands, discount amounts, and titles are 100% configurable.
                            </p>
                          </div>
                        )}
                      </div>
                    </div>
                  ))}
                </div>

                <button
                  type="button"
                  onClick={() => handleAddEventTier()}
                  className="w-full py-2 rounded-xl bg-purple-500/10 hover:bg-purple-500/20 border border-purple-500/25 text-purple-200 text-xs font-mono font-semibold transition cursor-pointer flex items-center justify-center gap-1.5"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>Add Another Pass Tier</span>
                </button>
              </div>
            )}
          </div>

          {/* Seating Capacity */}
          <div className="space-y-1.5">
            <label className="block text-xs font-mono font-semibold text-neutral-300">TOTAL ASSEMBLY CAPACITY</label>
            <input
              type="number"
              min="1"
              value={capacity}
              onChange={(e) => setCapacity(e.target.value)}
              className="w-full px-4 py-2.5 rounded-2xl bg-white/[0.04] border border-white/10 text-xs font-mono text-white focus:outline-none focus:border-cyan-500/50"
            />
          </div>

          {/* Description */}
          <div className="space-y-1.5">
            <label className="block text-xs font-mono font-semibold text-neutral-300">MANDATE &amp; PROTOCOL</label>
            <textarea
              rows={3}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Provide context, committee agendas, rules of procedure, and dress code..."
              className="w-full px-4 py-3 rounded-2xl bg-white/[0.04] border border-white/10 text-xs text-white placeholder:text-neutral-600 focus:outline-none focus:border-cyan-500/50 resize-none font-sans"
            />
          </div>

          {/* ══════════════════════════════════════════════════════════════
              COVER ARTWORK WITH "SET THE ARTWORK" MODAL
              ══════════════════════════════════════════════════════════════ */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <label className="block text-xs font-mono font-semibold text-neutral-300">
                COVER ARTWORK BANNER (16:9)
              </label>
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                className="px-2.5 py-1 rounded-lg bg-cyan-500/15 hover:bg-cyan-500/25 border border-cyan-500/30 text-cyan-300 text-[11px] font-mono flex items-center gap-1.5 transition cursor-pointer"
              >
                <Upload className="w-3 h-3" />
                <span>Upload From Device</span>
              </button>
            </div>

            <input
              type="file"
              ref={fileInputRef}
              accept="image/*"
              onChange={handleFileUpload}
              className="hidden"
            />

            <div className="grid grid-cols-4 gap-2">
              {COVER_PRESETS.map((preset, i) => (
                <div
                  key={i}
                  onClick={() => { setCoverImage(preset); setCustomCover(''); }}
                  className={`relative h-16 rounded-xl overflow-hidden cursor-pointer border-2 transition ${
                    coverImage === preset && !customCover ? 'border-cyan-400 scale-95 shadow-[0_0_15px_rgba(0,242,254,0.4)]' : 'border-transparent opacity-60 hover:opacity-100'
                  }`}
                >
                  <img src={preset} alt="" className="w-full h-full object-cover" />
                </div>
              ))}
            </div>

            {/* Custom Artwork Preview & Re-Adjust Trigger */}
            <div>
              {customCover ? (
                <div className="p-3 rounded-xl bg-cyan-950/20 border border-cyan-500/30 flex items-center justify-between gap-3">
                  <div className="flex items-center gap-3 min-w-0">
                    <div className="w-16 h-10 rounded-lg overflow-hidden border border-white/20 shrink-0 bg-black">
                      <img
                        src={customCover}
                        alt="Current Cover"
                        className="w-full h-full"
                        style={{ objectFit: artworkFit, objectPosition: artworkPosition }}
                      />
                    </div>
                    <div className="space-y-0.5 min-w-0">
                      <p className="text-xs font-bold text-white flex items-center gap-1">
                        <CheckCircle2 className="w-3.5 h-3.5 text-cyan-400" />
                        <span>Custom Artwork Set</span>
                      </p>
                      <p className="text-[10px] font-mono text-neutral-400 truncate">
                        Position: {artworkPosition} &bull; Mode: {artworkFit}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-1.5 shrink-0">
                    <button
                      type="button"
                      onClick={() => {
                        setPendingArtwork(customCover);
                        setIsArtworkModalOpen(true);
                      }}
                      className="px-2.5 py-1 rounded-lg bg-cyan-500/20 hover:bg-cyan-500/30 border border-cyan-500/40 text-cyan-300 text-[10px] font-mono transition cursor-pointer flex items-center gap-1"
                    >
                      <Sliders className="w-3 h-3" />
                      <span>Adjust Artwork</span>
                    </button>
                    <button
                      type="button"
                      onClick={() => fileInputRef.current?.click()}
                      className="px-2.5 py-1 rounded-lg bg-white/5 hover:bg-white/10 text-neutral-300 text-[10px] font-mono transition cursor-pointer"
                    >
                      Change
                    </button>
                  </div>
                </div>
              ) : (
                <button
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  className="w-full py-2.5 px-4 rounded-xl bg-white/5 hover:bg-white/10 border border-white/15 text-white text-xs font-mono transition cursor-pointer flex items-center justify-center gap-2"
                >
                  <Upload className="w-4 h-4 text-cyan-400" />
                  <span>Upload Custom Image from Device</span>
                </button>
              )}
            </div>
          </div>

          {/* Tags */}
          <div className="space-y-1.5">
            <label className="block text-xs font-mono font-semibold text-neutral-300">TAGS (COMMA SEPARATED)</label>
            <input
              type="text"
              value={tagInput}
              onChange={(e) => setTagInput(e.target.value)}
              placeholder="e.g. summit, mun, diplomacy, leadership"
              className="w-full px-4 py-2.5 rounded-xl bg-white/[0.04] border border-white/10 text-xs font-mono text-white placeholder:text-neutral-600 focus:outline-none focus:border-cyan-500/50"
            />
          </div>

          {/* Actions */}
          <div className="pt-4 border-t border-white/10 flex items-center justify-end gap-3">
            <button
              type="button"
              onClick={() => setActiveView('list')}
              className="px-5 py-2.5 rounded-2xl border border-white/10 font-mono text-xs text-neutral-400 hover:text-white hover:bg-white/5 transition cursor-pointer"
            >
              Cancel
            </button>

            <button
              type="submit"
              className="px-6 py-2.5 rounded-2xl bg-gradient-to-r from-cyan-400 via-emerald-400 to-amber-300 hover:from-cyan-300 hover:to-amber-200 text-black font-display font-black text-xs uppercase tracking-wider transition shadow-[0_0_30px_rgba(6,182,212,0.35)] cursor-pointer flex items-center gap-2 active:scale-98"
            >
              <Sparkles className="w-4 h-4 fill-black" />
              <span>Launch Convening</span>
            </button>
          </div>
        </form>

        {/* Google Maps API World Location Picker Modal */}
        <WorldLocationPickerModal
          isOpen={isLocationPickerOpen}
          onClose={() => setIsLocationPickerOpen(false)}
          title="Select Physical Convening Venue (Google Maps API)"
          initialLocation={location}
          onSelectLocation={(loc: WorldLocation) => {
            const locName = loc.name + (loc.address ? `, ${loc.address}` : '');
            setLocation(locName);
            setPlacesQuery(loc.name);
            if (loc.city) setCity(loc.city);
            if (loc.lat && loc.lng) {
              setSelectedCoordinates({ lat: loc.lat, lng: loc.lng });
            }
            setIsLocationPickerOpen(false);
          }}
        />
      </div>
    </div>
  );
}
