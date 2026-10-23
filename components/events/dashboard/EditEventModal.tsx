'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import {
  X,
  Edit3,
  Calendar,
  Clock,
  MapPin,
  DollarSign,
  Users,
  Tag,
  CheckCircle2,
  FileText,
  CreditCard,
  Sparkles,
  Plus,
  Trash2,
  ArrowRight,
  ExternalLink,
  ShieldCheck,
  Check,
  Layers,
  Settings,
  HelpCircle
} from 'lucide-react';
import { ZenEvent, EventCategory, EventStatus, RegistrationPlan } from '@/types/events';
import { getPublicForms } from '@/lib/formsStorage';
import { ZenForm } from '@/types/forms';

interface EditEventModalProps {
  isOpen: boolean;
  onClose: () => void;
  event: ZenEvent;
  onSave: (eventId: string, updates: Partial<ZenEvent>) => void;
}

type TabType = 'general' | 'forms' | 'payments' | 'tiers';

interface LocalTier {
  id: string;
  name: string;
  price: number;
  badge?: string;
  description?: string;
  salePhase: 'NOW' | 'SCHEDULED';
  saleStartDate?: string;
  exclusiveOfferEnabled: boolean;
  cardType: 'RUPAY' | 'VISA' | 'MASTERCARD' | 'STUDENT' | 'EARLY_ACCESS';
  offerTitle: string;
  discountFlat: number;
  badgeText: string;
}

export const EditEventModal: React.FC<EditEventModalProps> = ({
  isOpen,
  onClose,
  event,
  onSave,
}) => {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<TabType>('general');

  // Core General State
  const [title, setTitle] = useState(event.title || '');
  const [description, setDescription] = useState(event.description || '');
  const [category, setCategory] = useState<EventCategory>(event.category || 'MUN');
  const [status, setStatus] = useState<EventStatus>(event.status || 'upcoming');
  const [date, setDate] = useState(event.date ? event.date.split('T')[0] : '');
  const [endDate, setEndDate] = useState(event.endDate ? event.endDate.split('T')[0] : '');
  const [time, setTime] = useState(event.time || '');
  const [location, setLocation] = useState(event.location || '');
  const [city, setCity] = useState(event.city || '');
  const [capacity, setCapacity] = useState<number>(event.capacity ?? 100);
  const [ticketPrice, setTicketPrice] = useState<number>(event.ticketPrice ?? 0);
  const [savedSuccess, setSavedSuccess] = useState(false);

  // Form Timing & Linked Form State
  const [formTiming, setFormTiming] = useState<'CREATE_NOW' | 'CREATE_AFTER'>(
    event.formTiming || (event.formId ? 'CREATE_NOW' : 'CREATE_AFTER')
  );
  const [formId, setFormId] = useState<string>(event.formId || '');
  const [availableForms, setAvailableForms] = useState<ZenForm[]>([]);

  // Payment Timing & Phased Sales State
  const [paymentTiming, setPaymentTiming] = useState<'ACCEPT_NOW' | 'ACCEPT_AFTER'>(
    event.paymentTiming || 'ACCEPT_NOW'
  );
  const [paymentGoLiveDate, setPaymentGoLiveDate] = useState<string>(event.paymentGoLiveDate || '');

  // Tiers with District-style Card Offers State
  const [localTiers, setLocalTiers] = useState<LocalTier[]>(() => {
    if (event.plans && event.plans.length > 0) {
      return event.plans.map((p, idx) => ({
        id: p.id || `tier_${idx}_${Date.now()}`,
        name: p.name || 'Delegate Pass',
        price: p.price ?? 0,
        badge: p.badge || (p.price > 0 ? `₹${p.price}` : 'FREE'),
        description: p.description || '',
        salePhase: p.salePhase || 'NOW',
        saleStartDate: p.saleStartDate || '',
        exclusiveOfferEnabled: Boolean(p.exclusiveOffer?.enabled),
        cardType: p.exclusiveOffer?.cardType || 'RUPAY',
        offerTitle: p.exclusiveOffer?.title || 'RUPAY CARD OFFER • ₹150 OFF',
        discountFlat: p.exclusiveOffer?.discountFlat ?? 150,
        badgeText: p.exclusiveOffer?.badgeText || 'RUPAY SALE'
      }));
    }
    return [
      {
        id: `tier_general_${event.id}`,
        name: 'General Admission / Delegate Pass',
        price: event.ticketPrice || 499,
        badge: 'RUPAY SALE',
        description: 'Full conference floor entry, voting rights, and verified credentials.',
        salePhase: 'NOW',
        saleStartDate: '',
        exclusiveOfferEnabled: true,
        cardType: 'RUPAY',
        offerTitle: 'RUPAY CARD OFFER • BUY TICKETS NOW',
        discountFlat: 150,
        badgeText: 'RUPAY SALE'
      }
    ];
  });

  // Load public forms on mount or open
  useEffect(() => {
    try {
      const forms = getPublicForms();
      setAvailableForms(forms);
      if (event.formId && !formId) {
        setFormId(event.formId);
      }
    } catch {}
  }, [event.formId, formId]);

  if (!isOpen) return null;

  const handleAddTier = (template?: {
    name: string;
    price: number;
    badge?: string;
    exclusiveOfferEnabled?: boolean;
    cardType?: 'RUPAY' | 'VISA' | 'MASTERCARD' | 'STUDENT' | 'EARLY_ACCESS';
    offerTitle?: string;
    discountFlat?: number;
    badgeText?: string;
  }) => {
    const newTier: LocalTier = {
      id: `tier_${Date.now()}_${Math.random().toString(36).slice(2, 6)}`,
      name: template?.name || 'Delegate Pass Tier',
      price: template?.price ?? 499,
      badge: template?.badge || 'POPULAR',
      description: 'Official committee floor access and accredited certificate.',
      salePhase: 'NOW',
      saleStartDate: '',
      exclusiveOfferEnabled: template?.exclusiveOfferEnabled ?? false,
      cardType: template?.cardType || 'RUPAY',
      offerTitle: template?.offerTitle || 'RUPAY CARD OFFER • BUY TICKETS NOW',
      discountFlat: template?.discountFlat ?? 150,
      badgeText: template?.badgeText || 'RUPAY SALE'
    };
    setLocalTiers((prev) => [...prev, newTier]);
  };

  const handleUpdateTier = (id: string, key: keyof LocalTier, value: any) => {
    setLocalTiers((prev) =>
      prev.map((t) => (t.id === id ? { ...t, [key]: value } : t))
    );
  };

  const handleRemoveTier = (id: string) => {
    if (localTiers.length <= 1) return;
    setLocalTiers((prev) => prev.filter((t) => t.id !== id));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    // Map local tiers back to RegistrationPlan[]
    const finalPlans: RegistrationPlan[] = localTiers.map((t) => ({
      id: t.id,
      name: t.name,
      price: Math.max(0, Number(t.price) || 0),
      currency: 'INR',
      description: t.description || 'Full floor entry and verified credentials.',
      perks: ['Floor debate access', 'Official Delegate Kit', 'Verified Certificate'],
      capacity: capacity ? Math.max(1, capacity) : 100,
      badge: t.badge || (t.price > 0 ? `₹${t.price}` : 'FREE PASS'),
      isPopular: t.badge === 'POPULAR' || t.badge === 'RUPAY SALE',
      status: 'active' as const,
      salePhase: t.salePhase,
      saleStartDate: t.saleStartDate || undefined,
      exclusiveOffer: t.exclusiveOfferEnabled ? {
        enabled: true,
        cardType: t.cardType,
        title: t.offerTitle,
        discountFlat: Number(t.discountFlat) || 0,
        badgeText: t.badgeText
      } : undefined
    }));

    const updates: Partial<ZenEvent> = {
      title: title.trim(),
      description: description.trim(),
      category,
      status,
      date,
      endDate: endDate || undefined,
      time: time.trim(),
      location: location.trim(),
      city: city.trim(),
      capacity: Math.max(1, capacity),
      ticketPrice: localTiers[0]?.price ?? ticketPrice,
      plans: finalPlans,
      formTiming: formTiming,
      formId: formTiming === 'CREATE_NOW' && formId ? formId : undefined,
      paymentTiming,
      paymentGoLiveDate: paymentTiming === 'ACCEPT_AFTER' ? paymentGoLiveDate : undefined,
    };

    onSave(event.id, updates);

    setSavedSuccess(true);
    setTimeout(() => {
      setSavedSuccess(false);
      onClose();
    }, 1000);
  };

  const linkedForm = availableForms.find((f) => f.id === formId || f.slug === formId);

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/90 backdrop-blur-md overflow-y-auto">
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 10 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 10 }}
          transition={{ duration: 0.2 }}
          className="relative w-full max-w-3xl rounded-3xl bg-[#090a0f] border border-cyan-500/25 shadow-2xl p-5 sm:p-7 space-y-6 my-6 max-h-[90vh] flex flex-col"
        >
          {/* Header */}
          <div className="flex items-start justify-between border-b border-white/10 pb-4 shrink-0">
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <span className="p-1.5 rounded-lg bg-cyan-500/10 border border-cyan-500/30 text-cyan-400">
                  <Settings className="w-5 h-5" />
                </span>
                <h3 className="text-xl font-bold text-white tracking-tight">Configure Convening &amp; Sales</h3>
                <span className="text-[10px] font-mono px-2 py-0.5 rounded-md bg-white/5 border border-white/10 text-cyan-300">
                  ID: {event.id.slice(0, 8)}
                </span>
              </div>
              <p className="text-xs text-neutral-400">
                100% configurable: Update core logistics, intake forms, payment go-live, and District card offers.
              </p>
            </div>
            <button
              onClick={onClose}
              className="p-2 rounded-xl bg-white/5 hover:bg-white/10 text-neutral-400 hover:text-white transition cursor-pointer"
              aria-label="Close"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Navigation Tabs */}
          <div className="flex items-center gap-1.5 border-b border-white/10 pb-2 overflow-x-auto shrink-0">
            <button
              type="button"
              onClick={() => setActiveTab('general')}
              className={`px-3.5 py-1.5 rounded-xl font-mono text-xs font-medium transition flex items-center gap-2 cursor-pointer whitespace-nowrap ${
                activeTab === 'general'
                  ? 'bg-cyan-500/15 border border-cyan-500/40 text-cyan-300 font-bold'
                  : 'text-neutral-400 hover:text-white hover:bg-white/5 border border-transparent'
              }`}
            >
              <Edit3 className="w-3.5 h-3.5" />
              <span>Core Logistics</span>
            </button>

            <button
              type="button"
              onClick={() => setActiveTab('forms')}
              className={`px-3.5 py-1.5 rounded-xl font-mono text-xs font-medium transition flex items-center gap-2 cursor-pointer whitespace-nowrap ${
                activeTab === 'forms'
                  ? 'bg-amber-500/15 border border-amber-500/40 text-amber-300 font-bold'
                  : 'text-neutral-400 hover:text-white hover:bg-white/5 border border-transparent'
              }`}
            >
              <FileText className="w-3.5 h-3.5" />
              <span>Intake Form</span>
              {formTiming === 'CREATE_NOW' && formId && (
                <span className="w-1.5 h-1.5 rounded-full bg-amber-400 animate-pulse" />
              )}
            </button>

            <button
              type="button"
              onClick={() => setActiveTab('payments')}
              className={`px-3.5 py-1.5 rounded-xl font-mono text-xs font-medium transition flex items-center gap-2 cursor-pointer whitespace-nowrap ${
                activeTab === 'payments'
                  ? 'bg-blue-500/15 border border-blue-500/40 text-blue-300 font-bold'
                  : 'text-neutral-400 hover:text-white hover:bg-white/5 border border-transparent'
              }`}
            >
              <Clock className="w-3.5 h-3.5" />
              <span>Payment Timing</span>
              {paymentTiming === 'ACCEPT_AFTER' && (
                <span className="px-1.5 py-0.2 rounded bg-blue-500/30 text-[9px] text-blue-300">Phase</span>
              )}
            </button>

            <button
              type="button"
              onClick={() => setActiveTab('tiers')}
              className={`px-3.5 py-1.5 rounded-xl font-mono text-xs font-medium transition flex items-center gap-2 cursor-pointer whitespace-nowrap ${
                activeTab === 'tiers'
                  ? 'bg-purple-500/15 border border-purple-500/40 text-purple-300 font-bold'
                  : 'text-neutral-400 hover:text-white hover:bg-white/5 border border-transparent'
              }`}
            >
              <Sparkles className="w-3.5 h-3.5" />
              <span>Tiers &amp; RuPay Offers</span>
              <span className="px-1.5 py-0.2 rounded bg-purple-500/20 text-[9px] text-purple-300">
                {localTiers.length}
              </span>
            </button>
          </div>

          {savedSuccess && (
            <div className="p-3 rounded-xl bg-emerald-500/15 border border-emerald-500/30 text-emerald-300 text-xs flex items-center gap-2 animate-fade-in shrink-0">
              <CheckCircle2 className="w-4 h-4 text-emerald-400" />
              <span>All summit specifications and sales parameters saved successfully!</span>
            </div>
          )}

          {/* Form Body - Scrollable */}
          <form onSubmit={handleSubmit} className="space-y-5 overflow-y-auto pr-1 flex-1">
            {/* ── TAB 1: CORE LOGISTICS ── */}
            {activeTab === 'general' && (
              <div className="space-y-4 animate-fade-in">
                {/* Title */}
                <div>
                  <label className="text-xs font-mono text-neutral-300 block mb-1">
                    Convening / Summit Title <span className="text-cyan-400">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    className="w-full bg-[#111422] border border-white/10 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-cyan-500/50"
                  />
                </div>

                {/* Description */}
                <div>
                  <label className="text-xs font-mono text-neutral-300 block mb-1">Description &amp; Mandate</label>
                  <textarea
                    rows={3}
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    className="w-full bg-[#111422] border border-white/10 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-cyan-500/50"
                  />
                </div>

                {/* Category & Status */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="text-xs font-mono text-neutral-300 block mb-1">Summit Category</label>
                    <select
                      value={category}
                      onChange={(e) => setCategory(e.target.value as EventCategory)}
                      className="w-full bg-[#111422] border border-white/10 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-cyan-500/50"
                    >
                      <option value="MUN">MUN Conference</option>
                      <option value="DEBATE">Debate Tournament</option>
                      <option value="PARLIAMENT">Youth Parliament</option>
                      <option value="POLICY">Policy Round-Table</option>
                      <option value="WORKSHOP">Diplomatic Workshop</option>
                      <option value="NETWORKING">Diplomatic Reception</option>
                      <option value="OTHER">Other Summit</option>
                    </select>
                  </div>

                  <div>
                    <label className="text-xs font-mono text-neutral-300 block mb-1">Convening Status</label>
                    <select
                      value={status}
                      onChange={(e) => setStatus(e.target.value as EventStatus)}
                      className="w-full bg-[#111422] border border-white/10 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-cyan-500/50"
                    >
                      <option value="upcoming">Upcoming</option>
                      <option value="live">Live in Session</option>
                      <option value="past">Concluded / Past</option>
                      <option value="cancelled">Cancelled</option>
                    </select>
                  </div>
                </div>

                {/* Dates & Times */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <div>
                    <label className="text-xs font-mono text-neutral-300 block mb-1">Start Date</label>
                    <input
                      type="date"
                      required
                      value={date}
                      onChange={(e) => setDate(e.target.value)}
                      className="w-full bg-[#111422] border border-white/10 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-cyan-500/50"
                    />
                  </div>

                  <div>
                    <label className="text-xs font-mono text-neutral-300 block mb-1">End Date</label>
                    <input
                      type="date"
                      value={endDate}
                      onChange={(e) => setEndDate(e.target.value)}
                      className="w-full bg-[#111422] border border-white/10 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-cyan-500/50"
                    />
                  </div>

                  <div>
                    <label className="text-xs font-mono text-neutral-300 block mb-1">Time Window</label>
                    <input
                      type="text"
                      placeholder="e.g. 09:30 AM IST"
                      value={time}
                      onChange={(e) => setTime(e.target.value)}
                      className="w-full bg-[#111422] border border-white/10 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-cyan-500/50"
                    />
                  </div>
                </div>

                {/* Venue / Location Details */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="text-xs font-mono text-neutral-300 block mb-1">Venue / Physical Location</label>
                    <input
                      type="text"
                      required
                      value={location}
                      onChange={(e) => setLocation(e.target.value)}
                      className="w-full bg-[#111422] border border-white/10 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-cyan-500/50"
                    />
                  </div>

                  <div>
                    <label className="text-xs font-mono text-neutral-300 block mb-1">City / Region</label>
                    <input
                      type="text"
                      value={city}
                      onChange={(e) => setCity(e.target.value)}
                      className="w-full bg-[#111422] border border-white/10 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-cyan-500/50"
                    />
                  </div>
                </div>

                {/* Capacity & Price */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="text-xs font-mono text-neutral-300 block mb-1">Total Capacity</label>
                    <input
                      type="number"
                      min="1"
                      value={capacity}
                      onChange={(e) => setCapacity(parseInt(e.target.value) || 1)}
                      className="w-full bg-[#111422] border border-white/10 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-cyan-500/50"
                    />
                  </div>

                  <div>
                    <label className="text-xs font-mono text-neutral-300 block mb-1">Default Base Ticket Fee (₹ INR)</label>
                    <input
                      type="number"
                      min="0"
                      value={ticketPrice}
                      onChange={(e) => setTicketPrice(parseFloat(e.target.value) || 0)}
                      className="w-full bg-[#111422] border border-white/10 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-cyan-500/50"
                    />
                  </div>
                </div>
              </div>
            )}

            {/* ── TAB 2: INTAKE FORM SETTINGS ── */}
            {activeTab === 'forms' && (
              <div className="space-y-4 animate-fade-in font-sans">
                <div className="p-3.5 rounded-2xl bg-amber-500/10 border border-amber-500/30 text-xs text-neutral-300 flex items-start gap-3">
                  <FileText className="w-5 h-5 text-amber-400 shrink-0 mt-0.5" />
                  <div className="space-y-1">
                    <p className="font-bold text-amber-300">Registration Intake Form Configuration</p>
                    <p className="text-[11px] text-neutral-400 leading-relaxed">
                      Choose whether delegates must complete a registration intake form. You can link an existing form anytime, create a new one from scratch, or detach it completely.
                    </p>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {/* Option 1: Attach Form */}
                  <div
                    onClick={() => setFormTiming('CREATE_NOW')}
                    className={`p-3.5 rounded-xl border transition-all cursor-pointer flex flex-col justify-between space-y-1.5 ${
                      formTiming === 'CREATE_NOW'
                        ? 'bg-amber-500/10 border-amber-400 text-white shadow-[0_0_20px_rgba(245,158,11,0.15)] ring-1 ring-amber-400'
                        : 'bg-white/[0.02] border-white/10 text-neutral-400 hover:border-white/20'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-xs flex items-center gap-2">
                        <FileText className="w-3.5 h-3.5 text-amber-400" />
                        <span>Link Active Intake Form</span>
                      </span>
                      {formTiming === 'CREATE_NOW' && <Check className="w-3.5 h-3.5 text-amber-400" />}
                    </div>
                    <p className="text-[11px] text-neutral-400">
                      Delegates fill out portfolios, agendas, and contact details upon booking.
                    </p>
                  </div>

                  {/* Option 2: No Form / Create After */}
                  <div
                    onClick={() => {
                      setFormTiming('CREATE_AFTER');
                      setFormId('');
                    }}
                    className={`p-3.5 rounded-xl border transition-all cursor-pointer flex flex-col justify-between space-y-1.5 ${
                      formTiming === 'CREATE_AFTER'
                        ? 'bg-amber-500/10 border-amber-400 text-white shadow-[0_0_20px_rgba(245,158,11,0.15)] ring-1 ring-amber-400'
                        : 'bg-white/[0.02] border-white/10 text-neutral-400 hover:border-white/20'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-xs flex items-center gap-2">
                        <Clock className="w-3.5 h-3.5 text-amber-400" />
                        <span>No Form / Attach Form Later</span>
                      </span>
                      {formTiming === 'CREATE_AFTER' && <Check className="w-3.5 h-3.5 text-amber-400" />}
                    </div>
                    <p className="text-[11px] text-neutral-400">
                      Direct ticket purchasing with zero intake requirements. Attach a form anytime later.
                    </p>
                  </div>
                </div>

                {/* Form Selection Dropdown */}
                {formTiming === 'CREATE_NOW' && (
                  <div className="p-4 rounded-2xl bg-black/40 border border-white/10 space-y-3 animate-fade-in">
                    <label className="text-xs font-mono font-bold text-amber-300 block">
                      Select Form from Workspace:
                    </label>

                    <select
                      value={formId}
                      onChange={(e) => setFormId(e.target.value)}
                      className="w-full bg-[#111422] border border-white/10 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-amber-500/50"
                    >
                      <option value="">-- Choose an Intake Form --</option>
                      {availableForms.map((f) => (
                        <option key={f.id} value={f.id}>
                          {f.title} ({f.fields?.length || 0} fields)
                        </option>
                      ))}
                    </select>

                    {linkedForm && (
                      <div className="p-3 rounded-xl bg-white/[0.03] border border-amber-500/30 flex items-center justify-between gap-3 text-xs">
                        <div className="space-y-0.5">
                          <p className="font-bold text-white">{linkedForm.title}</p>
                          <p className="text-[11px] text-neutral-400">
                            {linkedForm.description || 'Custom intake questionnaire'} • {linkedForm.fields?.length || 0} questions
                          </p>
                        </div>
                        <div className="flex items-center gap-2 shrink-0">
                          <button
                            type="button"
                            onClick={() => window.open(`/forms/${linkedForm.id}`, '_blank')}
                            className="px-2.5 py-1 rounded-lg bg-white/5 hover:bg-white/10 text-neutral-300 hover:text-white font-mono text-[10px] transition flex items-center gap-1 cursor-pointer"
                          >
                            <ExternalLink className="w-3 h-3" />
                            <span>Preview</span>
                          </button>
                          <button
                            type="button"
                            onClick={() => router.push(`/forms/edit/${linkedForm.id}`)}
                            className="px-2.5 py-1 rounded-lg bg-amber-500/20 hover:bg-amber-500/30 text-amber-300 font-mono text-[10px] transition flex items-center gap-1 cursor-pointer"
                          >
                            <Edit3 className="w-3 h-3" />
                            <span>Edit in Builder</span>
                          </button>
                        </div>
                      </div>
                    )}

                    {/* Quick creation shortcuts */}
                    <div className="pt-2 border-t border-white/10 flex flex-wrap items-center gap-2">
                      <button
                        type="button"
                        onClick={() => {
                          onClose();
                          router.push(`/forms/edit/new?originEventId=${event.id}&eventTitle=${encodeURIComponent(title || event.title)}`);
                        }}
                        className="px-3 py-1.5 rounded-xl bg-amber-500/10 hover:bg-amber-500/20 border border-amber-500/30 text-amber-300 text-xs font-mono transition flex items-center gap-1.5 cursor-pointer"
                      >
                        <Plus className="w-3.5 h-3.5" />
                        <span>Build Brand New Form for this Summit</span>
                      </button>

                      <button
                        type="button"
                        onClick={() => {
                          onClose();
                          router.push(`/forms?originEventId=${event.id}&eventTitle=${encodeURIComponent(title || event.title)}`);
                        }}
                        className="px-3 py-1.5 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-neutral-300 hover:text-white text-xs font-mono transition flex items-center gap-1.5 cursor-pointer"
                      >
                        <Layers className="w-3.5 h-3.5" />
                        <span>Browse 1-Line Agenda Templates</span>
                      </button>
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* ── TAB 3: PAYMENT TIMING & PHASED SALES ── */}
            {activeTab === 'payments' && (
              <div className="space-y-4 animate-fade-in font-sans">
                <div className="p-3.5 rounded-2xl bg-cyan-500/10 border border-cyan-500/30 text-xs text-neutral-300 flex items-start gap-3">
                  <CreditCard className="w-5 h-5 text-cyan-400 shrink-0 mt-0.5" />
                  <div className="space-y-1">
                    <p className="font-bold text-cyan-300">Ticketing &amp; Phased Go-Live Timing</p>
                    <p className="text-[11px] text-neutral-400 leading-relaxed">
                      Configure when pass bookings go live. District-style apps allow you to run exclusive pre-sales (e.g. RuPay card offers) before general admission sale begins.
                    </p>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {/* Option 1: Accept Now */}
                  <div
                    onClick={() => setPaymentTiming('ACCEPT_NOW')}
                    className={`p-3.5 rounded-xl border transition-all cursor-pointer flex flex-col justify-between space-y-1.5 ${
                      paymentTiming === 'ACCEPT_NOW'
                        ? 'bg-cyan-500/10 border-cyan-400 text-white shadow-[0_0_20px_rgba(6,182,212,0.15)] ring-1 ring-cyan-400'
                        : 'bg-white/[0.02] border-white/10 text-neutral-400 hover:border-white/20'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-xs flex items-center gap-2">
                        <CreditCard className="w-3.5 h-3.5 text-cyan-400" />
                        <span>Accept Payments Immediately</span>
                      </span>
                      {paymentTiming === 'ACCEPT_NOW' && <Check className="w-3.5 h-3.5 text-cyan-400" />}
                    </div>
                    <p className="text-[11px] text-neutral-400">
                      Pass booking and UPI / Card checkout are active right now.
                    </p>
                  </div>

                  {/* Option 2: Take Payments Later / Scheduled Sale */}
                  <div
                    onClick={() => setPaymentTiming('ACCEPT_AFTER')}
                    className={`p-3.5 rounded-xl border transition-all cursor-pointer flex flex-col justify-between space-y-1.5 ${
                      paymentTiming === 'ACCEPT_AFTER'
                        ? 'bg-cyan-500/10 border-cyan-400 text-white shadow-[0_0_20px_rgba(6,182,212,0.15)] ring-1 ring-cyan-400'
                        : 'bg-white/[0.02] border-white/10 text-neutral-400 hover:border-white/20'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-xs flex items-center gap-2">
                        <Clock className="w-3.5 h-3.5 text-cyan-400" />
                        <span>Schedule General Sale for Later</span>
                      </span>
                      {paymentTiming === 'ACCEPT_AFTER' && <Check className="w-3.5 h-3.5 text-cyan-400" />}
                    </div>
                    <p className="text-[11px] text-neutral-400">
                      Passes show as &ldquo;Coming Soon&rdquo; until your general sale go-live date.
                    </p>
                  </div>
                </div>

                {/* Scheduled Go-Live Date Picker */}
                {paymentTiming === 'ACCEPT_AFTER' && (
                  <div className="p-4 rounded-2xl bg-black/40 border border-white/10 space-y-2 animate-fade-in">
                    <label className="text-xs font-mono font-bold text-cyan-300 flex items-center gap-1.5">
                      <Clock className="w-3.5 h-3.5" />
                      <span>General Ticket Sale Go-Live Date:</span>
                    </label>
                    <input
                      type="date"
                      value={paymentGoLiveDate}
                      onChange={(e) => setPaymentGoLiveDate(e.target.value)}
                      className="w-full bg-[#111422] border border-cyan-500/30 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-cyan-400"
                    />
                    <p className="text-[10px] font-mono text-neutral-400">
                      Delegates will see a live countdown clock until ticketing unlock on this date.
                    </p>
                  </div>
                )}
              </div>
            )}

            {/* ── TAB 4: PASS TIERS & DISTRICT CARD OFFERS ── */}
            {activeTab === 'tiers' && (
              <div className="space-y-4 animate-fade-in font-sans">
                <div className="p-3.5 rounded-2xl bg-purple-500/10 border border-purple-500/30 text-xs text-neutral-300 flex items-start justify-between gap-3">
                  <div className="flex items-start gap-2.5">
                    <Sparkles className="w-5 h-5 text-purple-400 shrink-0 mt-0.5" />
                    <div className="space-y-0.5">
                      <p className="font-bold text-purple-300">District-Style Bank &amp; Card Presale Offers</p>
                      <p className="text-[11px] text-neutral-400 leading-relaxed">
                        Customize each pass tier, offer exclusive RuPay / Visa discounts, and configure scheduled early bird access.
                      </p>
                    </div>
                  </div>

                  {/* Preset Quick Add Buttons */}
                  <div className="flex flex-wrap items-center gap-1.5 shrink-0">
                    <button
                      type="button"
                      onClick={() =>
                        handleAddTier({
                          name: 'RuPay Exclusive Early Bird',
                          price: 499,
                          badge: 'RUPAY SALE',
                          exclusiveOfferEnabled: true,
                          cardType: 'RUPAY',
                          offerTitle: 'RUPAY CARD OFFER • BUY TICKETS NOW',
                          discountFlat: 150,
                          badgeText: 'RUPAY SALE'
                        })
                      }
                      className="px-2.5 py-1 rounded-lg bg-purple-500/20 hover:bg-purple-500/30 text-purple-200 border border-purple-500/40 text-[10px] font-mono transition cursor-pointer"
                    >
                      + RuPay Presale Tier (₹499)
                    </button>
                    <button
                      type="button"
                      onClick={() =>
                        handleAddTier({
                          name: 'Visa Priority Pass',
                          price: 699,
                          badge: 'VISA EXCLUSIVE',
                          exclusiveOfferEnabled: true,
                          cardType: 'VISA',
                          offerTitle: 'VISA CARD OFFER • PRIORITY ENTRY',
                          discountFlat: 100,
                          badgeText: 'VISA SALE'
                        })
                      }
                      className="px-2.5 py-1 rounded-lg bg-blue-500/20 hover:bg-blue-500/30 text-blue-200 border border-blue-500/40 text-[10px] font-mono transition cursor-pointer"
                    >
                      + Visa Tier (₹699)
                    </button>
                    <button
                      type="button"
                      onClick={() =>
                        handleAddTier({
                          name: 'Standard Delegate Pass',
                          price: 999,
                          badge: 'POPULAR'
                        })
                      }
                      className="px-2.5 py-1 rounded-lg bg-white/10 hover:bg-white/20 text-neutral-200 border border-white/20 text-[10px] font-mono transition cursor-pointer"
                    >
                      + Standard Tier
                    </button>
                  </div>
                </div>

                {/* Tiers List */}
                <div className="space-y-3">
                  {localTiers.map((tier, idx) => (
                    <div
                      key={tier.id}
                      className="p-4 rounded-2xl bg-white/[0.03] border border-white/10 hover:border-white/20 transition space-y-3 text-xs"
                    >
                      <div className="flex items-center justify-between">
                        <span className="font-mono text-xs font-bold text-white flex items-center gap-2">
                          <span className="w-5 h-5 rounded-full bg-white/10 flex items-center justify-center text-[10px] text-cyan-300">
                            {idx + 1}
                          </span>
                          <span>Tier Specification</span>
                        </span>

                        {localTiers.length > 1 && (
                          <button
                            type="button"
                            onClick={() => handleRemoveTier(tier.id)}
                            className="p-1 rounded-lg bg-rose-500/10 hover:bg-rose-500/20 text-rose-400 transition cursor-pointer"
                            title="Remove tier"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        )}
                      </div>

                      {/* Tier Name, Price, Badge */}
                      <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                        <div>
                          <label className="text-[10px] font-mono text-neutral-400 block mb-1">Tier Name</label>
                          <input
                            type="text"
                            value={tier.name}
                            onChange={(e) => handleUpdateTier(tier.id, 'name', e.target.value)}
                            className="w-full bg-[#111422] border border-white/10 rounded-xl px-2.5 py-1.5 text-xs text-white focus:outline-none focus:border-purple-400"
                            placeholder="e.g. RuPay Early Bird"
                          />
                        </div>

                        <div>
                          <label className="text-[10px] font-mono text-neutral-400 block mb-1">Price (₹ INR)</label>
                          <input
                            type="number"
                            min="0"
                            value={tier.price}
                            onChange={(e) => handleUpdateTier(tier.id, 'price', parseFloat(e.target.value) || 0)}
                            className="w-full bg-[#111422] border border-white/10 rounded-xl px-2.5 py-1.5 text-xs text-white focus:outline-none focus:border-purple-400"
                          />
                        </div>

                        <div>
                          <label className="text-[10px] font-mono text-neutral-400 block mb-1">Badge Text</label>
                          <input
                            type="text"
                            value={tier.badge || ''}
                            onChange={(e) => handleUpdateTier(tier.id, 'badge', e.target.value)}
                            className="w-full bg-[#111422] border border-white/10 rounded-xl px-2.5 py-1.5 text-xs text-white focus:outline-none focus:border-purple-400"
                            placeholder="e.g. RUPAY SALE"
                          />
                        </div>
                      </div>

                      {/* Sale Phase: Now vs Scheduled */}
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 pt-1 border-t border-white/[0.06]">
                        <div>
                          <label className="text-[10px] font-mono text-neutral-400 block mb-1">Sale Phase</label>
                          <select
                            value={tier.salePhase}
                            onChange={(e) => handleUpdateTier(tier.id, 'salePhase', e.target.value as 'NOW' | 'SCHEDULED')}
                            className="w-full bg-[#111422] border border-white/10 rounded-xl px-2.5 py-1.5 text-xs text-white focus:outline-none focus:border-purple-400"
                          >
                            <option value="NOW">Active / Live Now</option>
                            <option value="SCHEDULED">Scheduled Release</option>
                          </select>
                        </div>

                        {tier.salePhase === 'SCHEDULED' && (
                          <div>
                            <label className="text-[10px] font-mono text-neutral-400 block mb-1">Release Date</label>
                            <input
                              type="date"
                              value={tier.saleStartDate || ''}
                              onChange={(e) => handleUpdateTier(tier.id, 'saleStartDate', e.target.value)}
                              className="w-full bg-[#111422] border border-white/10 rounded-xl px-2.5 py-1.5 text-xs text-white focus:outline-none focus:border-purple-400"
                            />
                          </div>
                        )}
                      </div>

                      {/* District Exclusive Card Offer Box */}
                      <div className="p-3 rounded-xl bg-purple-950/20 border border-purple-500/30 space-y-2">
                        <div className="flex items-center justify-between">
                          <label className="flex items-center gap-2 cursor-pointer">
                            <input
                              type="checkbox"
                              checked={tier.exclusiveOfferEnabled}
                              onChange={(e) => handleUpdateTier(tier.id, 'exclusiveOfferEnabled', e.target.checked)}
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
                                onChange={(e) => handleUpdateTier(tier.id, 'cardType', e.target.value)}
                                className="w-full bg-[#111422] border border-white/10 rounded-lg px-2 py-1 text-white focus:outline-none focus:border-purple-400 text-xs"
                              >
                                <option value="RUPAY">RuPay (RUPAY SALE)</option>
                                <option value="VISA">Visa (VISA EXCLUSIVE)</option>
                                <option value="MASTERCARD">Mastercard</option>
                                <option value="STUDENT">Student Card Discount</option>
                                <option value="EARLY_ACCESS">Early Access Pass</option>
                              </select>
                            </div>

                            <div>
                              <span className="text-neutral-400 block mb-0.5">Offer Title:</span>
                              <input
                                type="text"
                                value={tier.offerTitle}
                                onChange={(e) => handleUpdateTier(tier.id, 'offerTitle', e.target.value)}
                                placeholder="RUPAY CARD OFFER • ₹150 OFF"
                                className="w-full bg-[#111422] border border-white/10 rounded-lg px-2 py-1 text-white focus:outline-none focus:border-purple-400 text-xs"
                              />
                            </div>

                            <div>
                              <span className="text-neutral-400 block mb-0.5">Flat Discount (₹ INR):</span>
                              <input
                                type="number"
                                min="0"
                                value={tier.discountFlat}
                                onChange={(e) => handleUpdateTier(tier.id, 'discountFlat', parseFloat(e.target.value) || 0)}
                                className="w-full bg-[#111422] border border-white/10 rounded-lg px-2 py-1 text-white focus:outline-none focus:border-purple-400 text-xs"
                              />
                            </div>
                          </div>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Actions Bar */}
            <div className="border-t border-white/10 pt-4 flex items-center justify-between shrink-0">
              <span className="text-[11px] font-mono text-neutral-400">
                All parameters remain 100% editable anytime.
              </span>

              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={onClose}
                  className="px-4 py-2 rounded-xl bg-white/5 hover:bg-white/10 text-neutral-300 text-xs font-medium transition cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-500 hover:from-cyan-400 hover:to-blue-400 text-neutral-950 text-xs font-bold shadow-lg shadow-cyan-500/20 transition cursor-pointer flex items-center gap-1.5"
                >
                  <Check className="w-4 h-4" />
                  <span>Save Specifications</span>
                </button>
              </div>
            </div>
          </form>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
