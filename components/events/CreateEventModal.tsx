'use client';

import React, { useState, useRef, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { 
  X, 
  Calendar, 
  MapPin, 
  Clock, 
  Image as ImageIcon, 
  Tag, 
  Sparkles, 
  Layers, 
  Users,
  Check,
  Upload,
  Lock,
  Ticket,
  Plus,
  Trash2,
  AlertCircle,
  CreditCard,
  FileText,
  FilePlus,
  ChevronRight,
  ArrowRight,
  CalendarCheck,
  CheckCircle2,
  ShieldCheck,
  Zap,
  Globe
} from 'lucide-react';
import { useZenEvents, KNOWN_CITIES } from '@/context/ZenEventsPlatformContext';
import { useAuth } from '@/context/AuthContext';
import { useZenPass } from '@/context/ZenPassContext';
import { EventCategory, EventType } from '@/types/events';
import { getPublicForms } from '@/lib/formsStorage';
import { ZenForm } from '@/types/forms';

const COVER_PRESETS = [
  'https://images.unsplash.com/photo-1540575467063-178a50c2df87?auto=format&fit=crop&w=1200&q=80',
  'https://images.unsplash.com/photo-1511578314322-379afb476865?auto=format&fit=crop&w=1200&q=80',
  'https://images.unsplash.com/photo-1528605248644-14dd04022da1?auto=format&fit=crop&w=1200&q=80',
  'https://images.unsplash.com/photo-1505373877841-8d25f7d46678?auto=format&fit=crop&w=1200&q=80',
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
  const [type, setType] = useState<EventType>('hybrid');
  const [category, setCategory] = useState<EventCategory>('SUMMIT');
  const [date, setDate] = useState('');
  const [time, setTime] = useState('');
  const [location, setLocation] = useState('');
  const [city, setCity] = useState('');
  
  // ── Pricing & Ticketing Modes ──
  type PricingMode = 'FREE' | 'NORMAL' | 'TIERED';
  const [pricingMode, setPricingMode] = useState<PricingMode>('FREE');
  const [ticketPrice, setTicketPrice] = useState<number | undefined>(undefined);
  const [capacity, setCapacity] = useState<number | undefined>(undefined);
  const [tagInput, setTagInput] = useState('');
  const fileInputRef = useRef<HTMLInputElement>(null);

  // ── 1. REGISTRATION FORM TIMING (CREATE NOW OR AFTER) ──
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
  }, []);

  // ── 2. PAYMENTS TIMING (ACCEPT PAYMENTS NOW OR AFTER / PHASED SALES) ──
  type PaymentTimingOption = 'ACCEPT_NOW' | 'ACCEPT_AFTER';
  const [paymentTiming, setPaymentTiming] = useState<PaymentTimingOption>('ACCEPT_NOW');
  const [paymentGoLiveDate, setPaymentGoLiveDate] = useState('');

  // ── 3. TIER DEFINITION WITH DISTRICT-STYLE CARD OFFERS ──
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
    offerTitle: string;
    discountFlat: number;
    badgeText: string;
  }

  const [eventTiers, setEventTiers] = useState<EventCustomTier[]>([]);

  const handleAddEventTier = (template?: { 
    name: string; 
    price: number; 
    badge?: string;
    exclusiveOfferEnabled?: boolean;
    cardType?: 'RUPAY' | 'VISA' | 'MASTERCARD' | 'STUDENT' | 'EARLY_ACCESS';
    offerTitle?: string;
    discountFlat?: number;
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
      offerTitle: template?.offerTitle || 'RUPAY CARD OFFER • BUY TICKETS NOW',
      discountFlat: template?.discountFlat ?? 150,
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

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 10 * 1024 * 1024) {
        setToastMessage('File size must be under 10MB.');
        return;
      }
      const reader = new FileReader();
      reader.onload = (event) => {
        if (event.target?.result) {
          const resultUrl = event.target.result as string;
          setCustomCover(resultUrl);
          setCoverImage(resultUrl);
        }
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !date.trim() || !location.trim()) return;

    const tags = tagInput.split(',').map((t) => t.trim()).filter(Boolean);
    const finalCover = customCover.trim() || coverImage;

    const matchedCity = KNOWN_CITIES.find(c => c.value.toLowerCase() === city.toLowerCase());
    const lat = matchedCity?.lat || (city === 'New Delhi' ? 28.6139 : undefined);
    const lng = matchedCity?.lng || (city === 'New Delhi' ? 77.2090 : undefined);

    let finalPlans = [];
    let effectivePrice = 0;

    if (pricingMode === 'FREE') {
      finalPlans = [
        {
          id: `plan_free_${Date.now()}`,
          name: 'Complimentary Pass',
          price: 0,
          currency: 'INR',
          description: 'Free attendee registration pass.',
          perks: ['Event Admission', 'Digital Pass'],
          status: 'active' as const,
        },
      ];
      effectivePrice = 0;
    } else if (pricingMode === 'NORMAL') {
      effectivePrice = ticketPrice || 0;
      finalPlans = [
        {
          id: `plan_std_${Date.now()}`,
          name: 'Standard Registration Pass',
          price: effectivePrice,
          currency: 'INR',
          description: 'Official admission pass with verified attendance credentials.',
          perks: ['Event Admission', 'Digital Pass', 'Networking Access'],
          status: 'active' as const,
          badge: 'POPULAR',
          salePhase: paymentTiming === 'ACCEPT_NOW' ? ('NOW' as const) : ('SCHEDULED' as const),
          saleStartDate: paymentGoLiveDate || undefined,
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
          discountFlat: t.discountFlat,
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
      time: time.trim() || '18:00 UTC',
      location: location.trim(),
      city: city.trim() || 'New Delhi',
      latitude: lat,
      longitude: lng,
      ticketPrice: effectivePrice,
      plans: finalPlans,
      capacity: capacity ? Number(capacity) : undefined,
      tags,
      formTiming: formTiming === 'CREATE_AFTER' ? 'CREATE_AFTER' : 'CREATE_NOW',
      formId: formTiming === 'LINK_EXISTING' ? selectedExistingFormId : undefined,
      paymentTiming,
      paymentGoLiveDate: paymentTiming === 'ACCEPT_AFTER' ? paymentGoLiveDate : undefined
    });

    // Also sync to backend conference listings database
    fetch('/api/events/list', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        title: title.trim(),
        category,
        format: type,
        venue: location.trim(),
        city: city.trim() || 'New Delhi',
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
        paymentTiming
      }),
    }).catch(() => {});

    // If organizer chose to create form right now, redirect directly to form builder
    if (formTiming === 'CREATE_NOW_SCRATCH') {
      router.push(`/forms/edit/new?originEventId=${createdId}&eventTitle=${encodeURIComponent(title.trim())}`);
    } else if (formTiming === 'CREATE_NOW_TEMPLATE') {
      router.push(`/forms?originEventId=${createdId}&eventTitle=${encodeURIComponent(title.trim())}`);
    }
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/90 backdrop-blur-2xl p-2 sm:p-6 flex flex-col justify-start sm:justify-center items-center font-sans">
      <div className="relative w-full max-w-2xl my-auto max-h-[94vh] overflow-y-auto rounded-2xl sm:rounded-3xl border border-white/15 bg-gradient-to-b from-[#0e121c] to-[#06080e] p-4 sm:p-8 shadow-[0_0_80px_rgba(0,0,0,0.9)] space-y-6">
        {/* On-screen notification popup */}
        {toastMessage && (
          <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-black/70 backdrop-blur-md">
            <div className="w-full max-w-sm rounded-2xl border border-cyan-500/30 bg-[#0d121f] p-6 shadow-[0_0_50px_rgba(6,182,212,0.25)] text-center space-y-4 animate-in fade-in zoom-in-95 duration-150">
              <div className="mx-auto w-12 h-12 rounded-2xl bg-cyan-500/10 border border-cyan-500/25 flex items-center justify-center text-cyan-400 shadow-[0_0_20px_rgba(6,182,212,0.2)]">
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
                <option value="virtual">Virtual Online Assembly</option>
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

          {/* Date, Time & City */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
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
              <label className="block text-xs font-mono font-semibold text-neutral-300">TIME (UTC)</label>
              <input
                type="text"
                value={time}
                onChange={(e) => setTime(e.target.value)}
                placeholder="e.g. 10:00 - 18:00 IST"
                className="w-full px-4 py-2.5 rounded-2xl bg-white/[0.04] border border-white/10 text-xs font-mono text-white focus:outline-none focus:border-cyan-500/50"
              />
            </div>

            <div className="space-y-1.5">
              <label className="block text-xs font-mono font-semibold text-neutral-300">METRO CITY</label>
              <select
                value={city}
                onChange={(e) => setCity(e.target.value)}
                className="w-full px-4 py-2.5 rounded-2xl bg-neutral-900 border border-white/10 text-xs font-mono text-white focus:outline-none focus:border-cyan-500/50 cursor-pointer"
              >
                <option value="New Delhi">New Delhi &amp; NCR</option>
                <option value="Gurugram">Gurugram</option>
                <option value="Mumbai">Mumbai</option>
                <option value="Bengaluru">Bengaluru</option>
                <option value="Pune">Pune</option>
                <option value="Geneva">Geneva</option>
                <option value="London">London</option>
              </select>
            </div>
          </div>

          {/* Location / Venue */}
          <div className="space-y-1.5">
            <label className="block text-xs font-mono font-semibold text-neutral-300">VENUE / MEETING LINK *</label>
            <input
              type="text"
              required
              value={location}
              onChange={(e) => setLocation(e.target.value)}
              placeholder="e.g. India International Centre, Lodhi Estate / Diplomatic Chamber Room"
              className="w-full px-4 py-3 rounded-2xl bg-white/[0.04] border border-white/10 text-sm text-white placeholder:text-neutral-600 focus:outline-none focus:border-cyan-500/50"
            />
          </div>

          {/* ══════════════════════════════════════════════════════════════
              FEATURE 1: REGISTRATION INTAKE FORM (NOW OR AFTER)
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
                    <Sparkles className="w-3.5 h-3.5 text-amber-400" />
                    <span>Create Using a Template</span>
                  </span>
                  {formTiming === 'CREATE_NOW_TEMPLATE' && <Check className="w-3.5 h-3.5 text-amber-400" />}
                </div>
                <p className="text-[11px] text-neutral-300">
                  Pick from verified templates (MUN, Summit RSVP, Secretariat, Feedback) with 1-click clone.
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
                    <Layers className="w-3.5 h-3.5 text-amber-400" />
                    <span>Link an Existing Form</span>
                  </span>
                  {formTiming === 'LINK_EXISTING' && <Check className="w-3.5 h-3.5 text-amber-400" />}
                </div>
                <p className="text-[11px] text-neutral-300">
                  Attach an already authored ZenForm from your studio ledger.
                </p>
              </div>

              {/* Option D: Make Form After Launch */}
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
                  Publish your event page first; attach or customize your registration form anytime later.
                </p>
              </div>
            </div>

            {/* If Link Existing is selected, show dropdown */}
            {formTiming === 'LINK_EXISTING' && (
              <div className="space-y-1.5 pt-1 border-t border-white/10 animate-fade-in">
                <label className="text-[11px] font-mono text-neutral-400 block">Select Active Form to Link:</label>
                {existingForms.length > 0 ? (
                  <select
                    value={selectedExistingFormId}
                    onChange={(e) => setSelectedExistingFormId(e.target.value)}
                    className="w-full bg-black/60 border border-amber-500/30 rounded-xl px-3 py-2 text-xs text-white focus:outline-none cursor-pointer font-mono"
                  >
                    {existingForms.map((f) => (
                      <option key={f.id} value={f.id}>
                        {f.title} ({f.fields?.length || 0} fields)
                      </option>
                    ))}
                  </select>
                ) : (
                  <p className="text-xs text-amber-300">
                    No custom forms created yet. A fresh intake form will be initialized.
                  </p>
                )}
              </div>
            )}
          </div>

          {/* ══════════════════════════════════════════════════════════════
              FEATURE 2: PAYMENTS TIMING & TICKET SALES SCHEDULE
              ══════════════════════════════════════════════════════════════ */}
          <div className="p-4 sm:p-5 rounded-2xl bg-gradient-to-br from-[#121829] to-[#0a0d16] border border-cyan-500/30 space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
              <div className="flex items-center gap-2">
                <div className="p-1.5 rounded-lg bg-cyan-500/20 text-cyan-400">
                  <CreditCard className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="text-xs font-mono font-bold text-white uppercase tracking-wider">
                    Payment Collection Timing
                  </h3>
                  <p className="text-[11px] text-neutral-400">
                    Take payments now or schedule general sale at a future date (like District).
                  </p>
                </div>
              </div>
              <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-cyan-500/10 text-cyan-300 border border-cyan-500/30 font-bold shrink-0 self-start sm:self-auto">
                CASHFREE PG INTEGRATED
              </span>
            </div>

            {/* Accept Payments Now vs After */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div
                onClick={() => setPaymentTiming('ACCEPT_NOW')}
                className={`p-3.5 rounded-xl border transition-all cursor-pointer flex flex-col justify-between space-y-1.5 ${
                  paymentTiming === 'ACCEPT_NOW'
                    ? 'bg-cyan-500/10 border-cyan-400 text-white shadow-[0_0_20px_rgba(6,182,212,0.15)] ring-1 ring-cyan-400'
                    : 'bg-white/[0.02] border-white/10 text-neutral-400 hover:border-white/20'
                }`}
              >
                <div className="flex items-center justify-between">
                  <span className="font-bold text-xs text-white flex items-center gap-1.5">
                    <Zap className="w-3.5 h-3.5 text-cyan-400" />
                    <span>Accept Payments Now</span>
                  </span>
                  {paymentTiming === 'ACCEPT_NOW' && <Check className="w-3.5 h-3.5 text-cyan-400" />}
                </div>
                <p className="text-[11px] text-neutral-300">
                  Delegates can book and purchase passes via UPI and Cards immediately upon launch.
                </p>
              </div>

              <div
                onClick={() => setPaymentTiming('ACCEPT_AFTER')}
                className={`p-3.5 rounded-xl border transition-all cursor-pointer flex flex-col justify-between space-y-1.5 ${
                  paymentTiming === 'ACCEPT_AFTER'
                    ? 'bg-cyan-500/10 border-cyan-400 text-white shadow-[0_0_20px_rgba(6,182,212,0.15)] ring-1 ring-cyan-400'
                    : 'bg-white/[0.02] border-white/10 text-neutral-400 hover:border-white/20'
                }`}
              >
                <div className="flex items-center justify-between">
                  <span className="font-bold text-xs text-white flex items-center gap-1.5">
                    <CalendarCheck className="w-3.5 h-3.5 text-cyan-400" />
                    <span>Take Payments Later / Scheduled Sale</span>
                  </span>
                  {paymentTiming === 'ACCEPT_AFTER' && <Check className="w-3.5 h-3.5 text-cyan-400" />}
                </div>
                <p className="text-[11px] text-neutral-300">
                  Tickets show as &ldquo;Coming Soon&rdquo; until your scheduled general sale date goes live.
                </p>
              </div>
            </div>

            {/* If Scheduled Date */}
            {paymentTiming === 'ACCEPT_AFTER' && (
              <div className="p-3 rounded-xl bg-black/40 border border-white/10 space-y-2 animate-fade-in">
                <label className="text-xs font-mono font-bold text-cyan-300 flex items-center gap-1.5">
                  <Clock className="w-3.5 h-3.5" />
                  <span>General Ticket Sale Go-Live Date:</span>
                </label>
                <input
                  type="date"
                  value={paymentGoLiveDate}
                  onChange={(e) => setPaymentGoLiveDate(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl bg-neutral-900 border border-white/15 text-white font-mono text-xs focus:outline-none focus:border-cyan-400"
                />
                <p className="text-[10px] font-mono text-neutral-400">
                  Delegates can bookmark or pre-register interest; payments unlock automatically on this date.
                </p>
              </div>
            )}
          </div>

          {/* Pricing Mode Selection (Free vs Flat vs Tiered) */}
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
                      offerTitle: 'RUPAY CARD OFFER • BUY TICKETS NOW',
                      discountFlat: 150,
                      badgeText: 'RUPAY EXCLUSIVE'
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
                    min="1"
                    value={ticketPrice || ''}
                    onChange={(e) => setTicketPrice(e.target.value ? Number(e.target.value) : 0)}
                    placeholder="Ticket price in INR"
                    className="w-full pl-8 pr-4 py-3 rounded-2xl bg-white/[0.04] border border-amber-500/30 text-sm text-white placeholder:text-neutral-600 focus:outline-none focus:border-amber-400/50 font-mono"
                  />
                </div>
              </div>
            )}

            {/* ══════════════════════════════════════════════════════════════
                FEATURE 3: DISTRICT-STYLE BANK OFFERS & MULTI-TIER SALES
                ══════════════════════════════════════════════════════════════ */}
            {pricingMode === 'TIERED' && (
              <div className="space-y-3 pt-1">
                <div className="flex items-center justify-between">
                  <span className="text-[11px] font-mono text-purple-300 font-bold uppercase tracking-wider flex items-center gap-1.5">
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

                {/* Preset District-Style Quick Add Pills */}
                <div className="flex flex-wrap items-center gap-1.5">
                  <span className="text-[10px] font-mono text-neutral-500">District quick add:</span>
                  {[
                    { 
                      name: 'RuPay Early Access Pass', 
                      price: 499, 
                      badge: 'RUPAY SALE',
                      exclusiveOfferEnabled: true,
                      cardType: 'RUPAY' as const,
                      offerTitle: 'RUPAY CARD OFFER • BUY TICKETS NOW',
                      discountFlat: 150,
                      badgeText: 'RUPAY SALE'
                    },
                    { 
                      name: 'Visa Special Presale', 
                      price: 699, 
                      badge: 'VISA EXCLUSIVE',
                      exclusiveOfferEnabled: true,
                      cardType: 'VISA' as const,
                      offerTitle: 'VISA CARD OFFER • PRIORITY ENTRY',
                      discountFlat: 100,
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
                            placeholder="Tier name (e.g. RuPay Early Bird / General Admission)"
                            className="w-full px-2.5 py-1.5 rounded-lg bg-white/[0.04] border border-white/15 text-white placeholder-neutral-500 text-xs font-semibold focus:outline-none focus:border-purple-400"
                          />
                        </div>
                        <div className="w-28 relative">
                          <span className="absolute left-2.5 top-1.5 text-amber-400 font-mono text-xs">₹</span>
                          <input
                            type="number"
                            min={0}
                            value={tier.price}
                            onChange={(e) => handleUpdateEventTier(tier.id, 'price', Number(e.target.value))}
                            placeholder="Price"
                            className="w-full pl-6 pr-2 py-1.5 rounded-lg bg-white/[0.04] border border-amber-500/30 text-amber-300 text-xs font-mono font-bold focus:outline-none focus:border-amber-400 text-right"
                          />
                        </div>
                        {eventTiers.length > 1 && (
                          <button
                            type="button"
                            onClick={() => handleRemoveEventTier(tier.id)}
                            className="p-1.5 rounded-lg text-neutral-500 hover:text-rose-400 hover:bg-rose-500/10 transition cursor-pointer"
                            title="Delete tier"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        )}
                      </div>

                      <div className="grid grid-cols-2 gap-2 text-[11px]">
                        <input
                          type="text"
                          value={tier.badge || ''}
                          onChange={(e) => handleUpdateEventTier(tier.id, 'badge', e.target.value)}
                          placeholder="Badge (e.g. 🔥 RUPAY SALE)"
                          className="px-2 py-1 rounded-md bg-white/[0.03] border border-white/10 text-neutral-300 placeholder-neutral-600 focus:outline-none focus:border-purple-400 font-mono"
                        />
                        <input
                          type="number"
                          min={1}
                          value={tier.capacity || ''}
                          onChange={(e) => handleUpdateEventTier(tier.id, 'capacity', Number(e.target.value))}
                          placeholder="Capacity (e.g. 50)"
                          className="px-2 py-1 rounded-md bg-white/[0.03] border border-white/10 text-neutral-300 placeholder-neutral-600 focus:outline-none focus:border-purple-400 font-mono"
                        />
                      </div>

                      {/* District-Style Bank Card Offer Toggle */}
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
                              <span>District Card Offer (&ldquo;RUPAY SALE&rdquo; / Discount)</span>
                            </span>
                          </label>
                          <span className="text-[9px] font-mono text-neutral-400">
                            {tier.exclusiveOfferEnabled ? 'Active' : 'Off'}
                          </span>
                        </div>

                        {tier.exclusiveOfferEnabled && (
                          <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 pt-1 border-t border-purple-500/20 text-[10px] font-mono">
                            <div>
                              <span className="text-neutral-400 block mb-0.5">Card Scheme:</span>
                              <select
                                value={tier.cardType}
                                onChange={(e) => handleUpdateEventTier(tier.id, 'cardType', e.target.value)}
                                className="w-full bg-neutral-900 border border-white/15 rounded px-2 py-1 text-white cursor-pointer"
                              >
                                <option value="RUPAY">RuPay Exclusive</option>
                                <option value="VISA">Visa Exclusive</option>
                                <option value="MASTERCARD">Mastercard</option>
                                <option value="STUDENT">Student Discount</option>
                              </select>
                            </div>

                            <div>
                              <span className="text-neutral-400 block mb-0.5">Offer Title:</span>
                              <input
                                type="text"
                                value={tier.offerTitle}
                                onChange={(e) => handleUpdateEventTier(tier.id, 'offerTitle', e.target.value)}
                                placeholder="RUPAY CARD OFFER"
                                className="w-full bg-neutral-900 border border-white/15 rounded px-2 py-1 text-white"
                              />
                            </div>

                            <div>
                              <span className="text-neutral-400 block mb-0.5">Discount Amount (₹):</span>
                              <input
                                type="number"
                                min={1}
                                value={tier.discountFlat}
                                onChange={(e) => handleUpdateEventTier(tier.id, 'discountFlat', Number(e.target.value))}
                                className="w-full bg-neutral-900 border border-white/15 rounded px-2 py-1 text-amber-300 font-bold"
                              />
                            </div>
                          </div>
                        )}
                      </div>
                    </div>
                  ))}
                </div>

                <button
                  type="button"
                  onClick={() => handleAddEventTier()}
                  className="w-full py-2.5 rounded-xl bg-white/[0.04] hover:bg-white/[0.08] border border-white/10 text-neutral-300 hover:text-white text-xs font-mono flex items-center justify-center gap-1.5 transition cursor-pointer"
                >
                  <Plus className="w-3.5 h-3.5 text-purple-400" />
                  <span>Add Another Tier</span>
                </button>
              </div>
            )}
          </div>

          {/* Description */}
          <div className="space-y-1.5">
            <label className="block text-xs font-mono font-semibold text-neutral-300">SYNOPSIS &amp; ONE-LINE MANDATE</label>
            <textarea
              rows={3}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Provide a clean, focused description of your summit, rules of procedure, and convening objective..."
              className="w-full px-4 py-3 rounded-2xl bg-white/[0.04] border border-white/10 text-sm text-white placeholder:text-neutral-600 resize-none focus:outline-none focus:border-cyan-500/50 leading-relaxed"
            />
          </div>

          {/* Cover Image Preset Picker */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <label className="block text-xs font-mono font-semibold text-neutral-300">COVER ARTWORK</label>
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

            <div>
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                className="w-full py-2.5 px-4 rounded-xl bg-white/5 hover:bg-white/10 border border-white/15 text-white text-xs font-mono transition cursor-pointer flex items-center justify-center gap-2"
              >
                <Upload className="w-4 h-4 text-cyan-400" />
                <span>{customCover ? 'Custom Image Attached (Click to Change)' : 'Upload Custom Image from Device'}</span>
              </button>
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
      </div>
    </div>
  );
}
