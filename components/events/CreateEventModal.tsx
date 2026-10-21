'use client';

import React, { useState, useRef } from 'react';
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
  AlertCircle
} from 'lucide-react';
import { useZenEvents, KNOWN_CITIES } from '@/context/ZenEventsPlatformContext';
import { useAuth } from '@/context/AuthContext';
import { useZenPass } from '@/context/ZenPassContext';
import { EventCategory, EventType } from '@/types/events';

const COVER_PRESETS = [
  'https://images.unsplash.com/photo-1540575467063-178a50c2df87?auto=format&fit=crop&w=1200&q=80',
  'https://images.unsplash.com/photo-1511578314322-379afb476865?auto=format&fit=crop&w=1200&q=80',
  'https://images.unsplash.com/photo-1528605248644-14dd04022da1?auto=format&fit=crop&w=1200&q=80',
  'https://images.unsplash.com/photo-1505373877841-8d25f7d46678?auto=format&fit=crop&w=1200&q=80',
];

export function CreateEventModal() {
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
  type PricingMode = 'FREE' | 'NORMAL' | 'TIERED';
  const [pricingMode, setPricingMode] = useState<PricingMode>('FREE');
  const [ticketPrice, setTicketPrice] = useState<number | undefined>(undefined);
  const [capacity, setCapacity] = useState<number | undefined>(undefined);
  const [tagInput, setTagInput] = useState('');
  const fileInputRef = useRef<HTMLInputElement>(null);

  interface EventCustomTier {
    id: string;
    name: string;
    price: number;
    description: string;
    perks: string;
    capacity?: number;
    badge?: string;
  }

  const [eventTiers, setEventTiers] = useState<EventCustomTier[]>([]);

  const handleAddEventTier = (template?: { name: string; price: number; badge?: string }) => {
    const newTier: EventCustomTier = {
      id: `tier_${Date.now()}_${Math.random().toString(36).substring(2, 5)}`,
      name: template?.name || 'New Attendee Pass',
      price: template?.price ?? 599,
      description: 'Official event admission pass.',
      perks: 'Event Admission, Digital Certificate',
      capacity: 50,
      badge: template?.badge,
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
      }));
      effectivePrice = eventTiers[0] ? Math.max(0, Number(eventTiers[0].price)) : 0;
    }

    createEvent({
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
      }),
    }).catch(() => {});
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/90 backdrop-blur-2xl p-2 sm:p-6 flex flex-col justify-start sm:justify-center items-center font-sans">
      <div className="relative w-full max-w-2xl my-auto max-h-[94vh] overflow-y-auto rounded-2xl sm:rounded-3xl border border-white/15 bg-gradient-to-b from-[#0e121c] to-[#06080e] p-4 sm:p-8 shadow-[0_0_80px_rgba(0,0,0,0.9)] space-y-5">
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
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-cyan-400 to-violet-500 p-0.5 shadow-md">
              <div className="w-full h-full rounded-[14px] bg-[#06080c] flex items-center justify-center">
                <Sparkles className="w-5 h-5 text-cyan-400" />
              </div>
            </div>
            <div>
              <h2 className="font-display font-bold text-lg text-white">Convene a Sovereign Event</h2>
              <p className="text-xs font-mono text-neutral-400">Launch a summit, workshop, or youth forum assembly.</p>
            </div>
          </div>

          <button
            onClick={() => setActiveView('list')}
            className="p-2 rounded-2xl bg-white/[0.04] border border-white/10 text-neutral-400 hover:text-white hover:bg-white/10 transition cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-5">
          {/* Title */}
          <div className="space-y-1.5">
            <label className="block text-xs font-mono font-semibold text-neutral-300">CONVENING TITLE *</label>
            <input
              type="text"
              required
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="e.g. Zenvitra Global Diplomacy Summit 2026"
              className="w-full px-4 py-3 rounded-2xl bg-white/[0.04] border border-white/10 text-sm text-white placeholder:text-neutral-600 focus:outline-none focus:border-cyan-500/50"
            />
          </div>

          {/* Type & Category */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <label className="block text-xs font-mono font-semibold text-neutral-300">CONVENING TYPE</label>
              <select
                value={type}
                onChange={(e) => setType(e.target.value as EventType)}
                className="w-full px-4 py-3 rounded-2xl bg-[#080a10] border border-white/10 text-sm text-white focus:outline-none focus:border-cyan-500/50"
              >
                <option value="hybrid">Hybrid Matrix (Physical + Virtual)</option>
                <option value="physical">In-Person Physical Summit</option>
                <option value="virtual">Virtual Mesh Stream</option>
              </select>
            </div>

            <div className="space-y-1.5">
              <label className="block text-xs font-mono font-semibold text-neutral-300">CATEGORY</label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value as EventCategory)}
                className="w-full px-4 py-3 rounded-2xl bg-[#080a10] border border-white/10 text-sm text-white focus:outline-none focus:border-cyan-500/50"
              >
                <option value="SUMMIT">SUMMIT (MUNs, G20, UN)</option>
                <option value="WORKSHOP">WORKSHOP</option>
                <option value="KEYNOTE">KEYNOTE</option>
                <option value="MEETUP">MEETUP (Open Mics &amp; Slams)</option>
                <option value="HACKATHON">HACKATHON</option>
              </select>
            </div>
          </div>

          {/* City & Ticket Price */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <label className="block text-xs font-mono font-semibold text-neutral-300">CITY / METROPOLE *</label>
              <select
                value={city}
                onChange={(e) => setCity(e.target.value)}
                className="w-full px-4 py-3 rounded-2xl bg-[#080a10] border border-white/10 text-sm text-white focus:outline-none focus:border-cyan-500/50"
              >
                {KNOWN_CITIES.filter(c => c.value !== 'ALL').map((c) => (
                  <option key={c.value} value={c.value}>{c.name}</option>
                ))}
                <option value="Other">Other / Custom Global</option>
              </select>
            </div>

            <div className="space-y-1.5">
              <label className="block text-xs font-mono font-semibold text-neutral-300">ZENPASS BASE PRICE (₹)</label>
              <input
                type="number"
                value={ticketPrice || ''}
                onChange={(e) => setTicketPrice(e.target.value ? Number(e.target.value) : 0)}
                placeholder="e.g. 499 (0 for Free)"
                className="w-full px-4 py-3 rounded-2xl bg-white/[0.04] border border-white/10 text-sm text-white placeholder:text-neutral-600 focus:outline-none focus:border-cyan-500/50"
              />
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
                className="w-full px-4 py-3 rounded-2xl bg-[#080a10] border border-white/10 text-sm text-white focus:outline-none focus:border-cyan-500/50"
              />
            </div>

            <div className="space-y-1.5">
              <label className="block text-xs font-mono font-semibold text-neutral-300">TIME SCHEDULE</label>
              <input
                type="text"
                value={time}
                onChange={(e) => setTime(e.target.value)}
                placeholder="e.g. 18:00 - 21:00 UTC"
                className="w-full px-4 py-3 rounded-2xl bg-white/[0.04] border border-white/10 text-sm text-white placeholder:text-neutral-600 focus:outline-none focus:border-cyan-500/50"
              />
            </div>
          </div>

          {/* Location, Capacity & Registration Fee */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="space-y-1.5 sm:col-span-1">
              <label className="block text-xs font-mono font-semibold text-neutral-300">LOCATION / VENUE *</label>
              <input
                type="text"
                required
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                placeholder="e.g. India Habitat Centre, Lodhi Road"
                className="w-full px-4 py-3 rounded-2xl bg-white/[0.04] border border-white/10 text-sm text-white placeholder:text-neutral-600 focus:outline-none focus:border-cyan-500/50"
              />
            </div>

            <div className="space-y-1.5 sm:col-span-1">
              <label className="block text-xs font-mono font-semibold text-neutral-300">CAPACITY QUOTA</label>
              <input
                type="number"
                value={capacity || ''}
                onChange={(e) => setCapacity(e.target.value ? Number(e.target.value) : undefined)}
                placeholder="Unlimited if blank"
                className="w-full px-4 py-3 rounded-2xl bg-white/[0.04] border border-white/10 text-sm text-white placeholder:text-neutral-600 focus:outline-none focus:border-cyan-500/50"
              />
            </div>

          </div>

          {/* Registration Mode: Free vs Normal Fee vs Tiered Passes */}
          <div className="space-y-3 p-4 rounded-2xl bg-white/[0.02] border border-white/10">
            <div className="flex items-center justify-between">
              <label className="text-xs font-mono font-semibold text-neutral-300 uppercase tracking-wider">
                Registration &amp; Ticket Passes
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
                    ? 'bg-white text-black shadow-sm'
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
                    ? 'bg-white text-black shadow-sm'
                    : 'text-neutral-400 hover:text-white'
                }`}
              >
                {pricingMode === 'NORMAL' && <Check className="w-3 h-3 text-black stroke-[3]" />}
                <span>Normal Fee (₹)</span>
              </button>

              <button
                type="button"
                onClick={() => setPricingMode('TIERED')}
                className={`py-2 px-2 rounded-xl text-xs font-semibold font-mono transition cursor-pointer flex items-center justify-center gap-1 ${
                  pricingMode === 'TIERED'
                    ? 'bg-white text-black shadow-sm'
                    : 'text-neutral-400 hover:text-white'
                }`}
              >
                {pricingMode === 'TIERED' && <Check className="w-3 h-3 text-black stroke-[3]" />}
                <span>Add Tiers ({eventTiers.length})</span>
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

            {/* Multi-Tier Plans */}
            {pricingMode === 'TIERED' && (
              <div className="space-y-3 pt-1">
                <div className="flex items-center justify-between">
                  <span className="text-[11px] font-mono text-purple-300 font-bold uppercase tracking-wider flex items-center gap-1.5">
                    <Ticket className="w-3.5 h-3.5 text-purple-400" />
                    <span>Custom Event Tiers ({eventTiers.length})</span>
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

                {/* Preset Pills */}
                <div className="flex flex-wrap items-center gap-1.5">
                  <span className="text-[10px] font-mono text-neutral-500">Quick add:</span>
                  {[
                    { name: 'Early Bird Pass', price: 399, badge: '🔥 EARLY BIRD' },
                    { name: 'General Admission', price: 699, badge: 'POPULAR' },
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
                <div className="space-y-2.5 max-h-56 overflow-y-auto pr-1 scrollbar-thin">
                  {eventTiers.map((tier) => (
                    <div
                      key={tier.id}
                      className="p-3 rounded-xl bg-black/60 border border-white/10 space-y-2 text-xs"
                    >
                      <div className="flex items-center justify-between gap-2">
                        <div className="flex-1">
                          <input
                            type="text"
                            value={tier.name}
                            onChange={(e) => handleUpdateEventTier(tier.id, 'name', e.target.value)}
                            placeholder="Tier name (e.g. VIP All-Access)"
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
                          placeholder="Badge (e.g. 🔥 EARLY BIRD)"
                          className="px-2 py-1 rounded-md bg-white/[0.03] border border-white/10 text-neutral-300 placeholder-neutral-600 focus:outline-none focus:border-purple-400"
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
                    </div>
                  ))}
                </div>

                <button
                  type="button"
                  onClick={() => handleAddEventTier()}
                  className="w-full py-2 rounded-xl bg-white/[0.04] hover:bg-white/[0.08] border border-white/10 text-neutral-300 hover:text-white text-xs font-mono flex items-center justify-center gap-1.5 transition cursor-pointer"
                >
                  <Plus className="w-3.5 h-3.5 text-purple-400" />
                  <span>Add Another Tier</span>
                </button>
              </div>
            )}
          </div>

          {/* Description */}
          <div className="space-y-1.5">
            <label className="block text-xs font-mono font-semibold text-neutral-300">SYNOPSIS & AGENDA</label>
            <textarea
              rows={4}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Outline the assembly objective, key delegates, resolution voting procedures..."
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
              className="px-6 py-2.5 rounded-2xl bg-white hover:bg-neutral-200 text-black font-display font-bold text-xs uppercase tracking-wider transition shadow-[0_0_30px_rgba(255,255,255,0.25)] cursor-pointer flex items-center gap-2"
            >
              <Sparkles className="w-4 h-4 fill-current" />
              <span>Launch Convening</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
