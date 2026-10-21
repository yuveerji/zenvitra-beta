'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  X,
  Sparkles,
  Calendar,
  IndianRupee,
  ArrowRight,
  Layers,
  Check,
  Plus,
  Trash2,
  Ticket,
  Globe2,
  CheckCircle2,
  Users
} from 'lucide-react';
import { useMun } from '@/context/MunContext';
import { RegistrationPlan } from '@/types/events';
import { useRouter } from 'next/navigation';

interface CreateMunConferenceModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConferenceCreated?: (confId: string) => void;
}

export function CreateMunConferenceModal({
  isOpen,
  onClose,
  onConferenceCreated,
}: CreateMunConferenceModalProps) {
  const router = useRouter();
  const { createConference } = useMun();

  const [name, setName] = useState('');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [initialCommittee, setInitialCommittee] = useState('');
  
  // Registration & Access Mode: 'FREE' | 'NORMAL' | 'TIERED'
  type PricingMode = 'FREE' | 'NORMAL' | 'TIERED';
  const [pricingMode, setPricingMode] = useState<PricingMode>('NORMAL');
  const [normalPrice, setNormalPrice] = useState<number>(799);

  interface CustomTierItem {
    id: string;
    name: string;
    price: number;
    description: string;
    perks: string;
    capacity: number;
    badge?: string;
  }

  const [tiers, setTiers] = useState<CustomTierItem[]>([
    {
      id: 'tier_early_bird',
      name: 'Early Bird Delegate Pass',
      price: 699,
      description: 'Standard conference admission and committee floor debate rights.',
      perks: 'Floor Debate Entry, Official Delegate Kit, Verified Certificate',
      capacity: 50,
      badge: '🔥 EARLY BIRD',
    },
    {
      id: 'tier_regular',
      name: 'Regular Delegate Pass',
      price: 999,
      description: 'Standard conference delegate registration with verified credentials.',
      perks: 'Committee Seat, Official Kit, Secretariat Certificate',
      capacity: 100,
      badge: 'POPULAR',
    },
  ]);

  const handleAddTier = (template?: { name: string; price: number; badge?: string }) => {
    const newTier: CustomTierItem = {
      id: `tier_${Date.now()}_${Math.random().toString(36).substring(2, 5)}`,
      name: template?.name || 'New Delegate Tier',
      price: template?.price ?? 899,
      description: 'Conference admission and floor participation credentials.',
      perks: 'Floor Access, Delegate Kit, Verified Certificate',
      capacity: 50,
      badge: template?.badge,
    };
    setTiers((prev) => [...prev, newTier]);
  };

  const handleRemoveTier = (id: string) => {
    setTiers((prev) => prev.filter((t) => t.id !== id));
  };

  const handleUpdateTier = (id: string, field: keyof CustomTierItem, value: any) => {
    setTiers((prev) => prev.map((t) => (t.id === id ? { ...t, [field]: value } : t)));
  };

  // Auto-slug generation for live matrix URL
  const slug = name
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)/g, '') || 'my-mun';

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;

    const effectiveStartDate = startDate || new Date().toISOString().split('T')[0];
    const effectiveEndDate = endDate || effectiveStartDate;

    let plans: RegistrationPlan[] = [];
    let effectiveTicketPrice = 0;

    if (pricingMode === 'FREE') {
      plans = [
        {
          id: `plan_free_${Date.now()}`,
          name: 'Delegate Pass',
          price: 0,
          currency: 'INR',
          description: 'Complimentary delegate floor entry.',
          perks: ['Floor Debate Entry', 'Digital Certificate'],
          status: 'active',
        },
      ];
      effectiveTicketPrice = 0;
    } else if (pricingMode === 'NORMAL') {
      plans = [
        {
          id: `plan_std_${Date.now()}`,
          name: 'Standard Delegate Pass',
          price: Math.max(0, Number(normalPrice)),
          currency: 'INR',
          description: 'Official delegate admission and committee floor participation credentials.',
          perks: ['Committee Floor Entry', 'Official Delegate Kit', 'Verified Digital Certificate'],
          status: 'active',
          badge: 'POPULAR',
        },
      ];
      effectiveTicketPrice = Math.max(0, Number(normalPrice));
    } else {
      // TIERED
      plans = tiers.map((t) => ({
        id: t.id,
        name: t.name.trim() || 'Delegate Pass',
        price: Math.max(0, Number(t.price)),
        currency: 'INR',
        description: t.description.trim() || 'Official delegate admission credentials.',
        perks: t.perks
          .split(',')
          .map((p) => p.trim())
          .filter(Boolean),
        capacity: Number(t.capacity) || 50,
        bookedCount: 0,
        badge: t.badge?.trim() || undefined,
        status: 'active',
      }));
      effectiveTicketPrice = tiers[0] ? Math.max(0, Number(tiers[0].price)) : 0;
    }

    const committees = initialCommittee.trim()
      ? [
          {
            name: initialCommittee.trim(),
            shortName: initialCommittee.trim().split(/\s+/).map((w) => w[0]).join('').toUpperCase().slice(0, 8) || 'COMM',
            type: 'UNSC' as const,
            agenda: 'Floor Deliberations & Working Papers',
            totalDelegates: 20,
          },
        ]
      : [];

    const conf = createConference({
      name: name.trim(),
      shortName: name.trim().split(/\s+/).map((w) => w[0]).join('').toUpperCase().slice(0, 10) || 'MUN',
      tagline: 'Sovereign Youth Diplomacy & Parliamentary Chambers',
      startDate: effectiveStartDate,
      endDate: effectiveEndDate,
      location: 'Live Matrix',
      secretariatChair: 'Executive Secretariat',
      ticketPrice: effectiveTicketPrice,
      plans,
      committees,
    });

    onClose();
    const targetCommCode = initialCommittee.trim()
      ? initialCommittee.trim().split(/\s+/).map((w) => w[0]).join('').toLowerCase().slice(0, 8) || 'unsc'
      : 'unsc';

    if (onConferenceCreated) {
      onConferenceCreated(conf.id);
    } else {
      router.push(`/${conf.slug || conf.id}/${targetCommCode}/matrix`);
    }
  };

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-[200] flex items-center justify-center p-3 sm:p-6 bg-black/80 backdrop-blur-2xl">
        <motion.div
          initial={{ opacity: 0, scale: 0.96, y: 16 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.96, y: 16 }}
          transition={{ duration: 0.2, ease: [0.16, 1, 0.3, 1] }}
          className="relative w-full max-w-xl max-h-[92vh] overflow-y-auto bg-[#07090e] border border-white/10 rounded-3xl p-6 sm:p-8 text-left shadow-[0_25px_80px_rgba(0,0,0,0.9)] space-y-6 font-sans text-white"
        >
          {/* Subtle Ambient Radial Highlight */}
          <div className="absolute top-0 right-0 w-80 h-80 bg-cyan-500/10 rounded-full blur-[100px] pointer-events-none" />

          {/* Header */}
          <div className="flex items-center justify-between gap-4 relative z-10 border-b border-white/10 pb-5">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-cyan-400 to-teal-500 flex items-center justify-center text-black font-bold shadow-lg shadow-cyan-500/20">
                <Globe2 className="w-5 h-5 text-black" />
              </div>
              <div>
                <h2 className="text-xl font-extrabold text-white font-display tracking-tight">
                  Launch MUN Space
                </h2>
                <span className="text-xs text-neutral-400 block mt-0.5">
                  Live country matrix &bull; Dais chamber &bull; Instant workspace
                </span>
              </div>
            </div>
            <button
              type="button"
              onClick={onClose}
              className="p-2 rounded-xl text-neutral-400 hover:text-white hover:bg-white/10 transition cursor-pointer"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5 relative z-10 font-sans">
            {/* Conference Name Field */}
            <div className="space-y-1.5">
              <label className="text-xs font-sans font-bold text-neutral-300 uppercase tracking-wider block">
                Conference or Summit Name *
              </label>
              <input
                type="text"
                required
                autoFocus
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="e.g. Geneva International Youth Model UN 2026"
                className="w-full px-4 py-3 rounded-2xl bg-white/[0.04] border border-white/10 text-white placeholder-neutral-500 focus:outline-none focus:border-cyan-400 focus:bg-white/[0.06] text-sm font-semibold transition"
              />
              <div className="pt-1 flex items-center justify-between text-xs text-neutral-400">
                <span className="text-neutral-500 font-medium">Access Route:</span>
                <span className="text-neutral-300 font-mono">
                  zenvitra.xyz/<strong className="text-cyan-400 font-bold">{slug}</strong>/<span className="text-amber-400">{initialCommittee.trim() ? initialCommittee.trim().toLowerCase().split(/\s+/)[0] : 'unsc'}</span>/matrix
                </span>
              </div>
            </div>

            {/* Dates (Start & End) */}
            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1.5">
                <label className="text-xs font-sans font-bold text-neutral-300 uppercase tracking-wider flex items-center gap-1.5">
                  <Calendar className="w-3.5 h-3.5 text-cyan-400" />
                  <span>Start Date</span>
                </label>
                <input
                  type="date"
                  value={startDate}
                  onChange={(e) => {
                    setStartDate(e.target.value);
                    if (!endDate || endDate < e.target.value) setEndDate(e.target.value);
                  }}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-white/[0.04] border border-white/10 text-white focus:outline-none focus:border-cyan-400 text-xs font-sans transition"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-sans font-bold text-neutral-300 uppercase tracking-wider flex items-center gap-1.5">
                  <Calendar className="w-3.5 h-3.5 text-cyan-400" />
                  <span>End Date</span>
                </label>
                <input
                  type="date"
                  min={startDate}
                  value={endDate}
                  onChange={(e) => setEndDate(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-white/[0.04] border border-white/10 text-white focus:outline-none focus:border-cyan-400 text-xs font-sans transition"
                />
              </div>
            </div>

            {/* Optional First Committee */}
            <div className="space-y-1.5">
              <label className="text-xs font-sans font-bold text-neutral-300 uppercase tracking-wider flex items-center justify-between">
                <span className="flex items-center gap-1.5">
                  <Layers className="w-3.5 h-3.5 text-cyan-400" />
                  <span>Initial Committee Chamber</span>
                </span>
                <span className="text-neutral-500 normal-case font-normal">Optional &bull; add more anytime</span>
              </label>
              <input
                type="text"
                value={initialCommittee}
                onChange={(e) => setInitialCommittee(e.target.value)}
                placeholder="e.g. UN Security Council (UNSC) or DISEC"
                className="w-full px-4 py-2.5 rounded-xl bg-white/[0.04] border border-white/10 text-white placeholder-neutral-500 focus:outline-none focus:border-cyan-400 text-xs transition"
              />
            </div>

            {/* Registration Mode: Free vs Normal vs Tiered */}
            <div className="space-y-3 pt-1">
              <div className="flex items-center justify-between">
                <span className="text-xs font-sans font-bold text-neutral-300 uppercase tracking-wider">
                  Registration &amp; Delegate Passes
                </span>
                <span className="text-[11px] font-sans font-semibold text-cyan-300">
                  Cashfree PG Enabled
                </span>
              </div>

              {/* 3-Way Mode Selector */}
              <div className="grid grid-cols-3 gap-1.5 p-1 rounded-2xl bg-white/[0.03] border border-white/10">
                <button
                  type="button"
                  onClick={() => setPricingMode('FREE')}
                  className={`py-2 px-2 rounded-xl text-xs font-semibold transition cursor-pointer flex items-center justify-center gap-1.5 ${
                    pricingMode === 'FREE'
                      ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/40 font-bold shadow-sm'
                      : 'text-neutral-400 hover:text-white'
                  }`}
                >
                  {pricingMode === 'FREE' && <Check className="w-3.5 h-3.5 text-cyan-400" />}
                  <span>Free Pass</span>
                </button>

                <button
                  type="button"
                  onClick={() => setPricingMode('NORMAL')}
                  className={`py-2 px-2 rounded-xl text-xs font-semibold transition cursor-pointer flex items-center justify-center gap-1.5 ${
                    pricingMode === 'NORMAL'
                      ? 'bg-amber-500/20 text-amber-300 border border-amber-500/40 font-bold shadow-sm'
                      : 'text-neutral-400 hover:text-white'
                  }`}
                >
                  {pricingMode === 'NORMAL' && <Check className="w-3.5 h-3.5 text-amber-400" />}
                  <span>Standard Fee (₹)</span>
                </button>

                <button
                  type="button"
                  onClick={() => setPricingMode('TIERED')}
                  className={`py-2 px-2 rounded-xl text-xs font-semibold transition cursor-pointer flex items-center justify-center gap-1.5 ${
                    pricingMode === 'TIERED'
                      ? 'bg-purple-500/20 text-purple-300 border border-purple-500/40 font-bold shadow-sm'
                      : 'text-neutral-400 hover:text-white'
                  }`}
                >
                  {pricingMode === 'TIERED' && <Check className="w-3.5 h-3.5 text-purple-400" />}
                  <span>Tiered Passes</span>
                </button>
              </div>

              {/* Normal Fee Input */}
              {pricingMode === 'NORMAL' && (
                <div className="p-3.5 rounded-2xl bg-amber-500/5 border border-amber-500/20 flex items-center justify-between gap-3 animate-fadeIn">
                  <div className="space-y-0.5">
                    <span className="text-xs font-bold text-white block">Standard Delegate Fee</span>
                    <span className="text-[11px] text-neutral-400">Single universal fee for all applicants</span>
                  </div>
                  <div className="flex items-center gap-1.5 bg-neutral-900 border border-white/20 rounded-xl px-3 py-1.5">
                    <IndianRupee className="w-3.5 h-3.5 text-amber-400" />
                    <input
                      type="number"
                      min={0}
                      step={50}
                      value={normalPrice}
                      onChange={(e) => setNormalPrice(Number(e.target.value))}
                      className="w-20 bg-transparent text-white font-bold text-xs focus:outline-none text-right"
                    />
                  </div>
                </div>
              )}

              {/* Tiered Passes List */}
              {pricingMode === 'TIERED' && (
                <div className="space-y-3 p-4 rounded-2xl bg-purple-950/10 border border-purple-500/20 animate-fadeIn">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-white">Configured Delegate Tiers</span>
                    <button
                      type="button"
                      onClick={() => handleAddTier()}
                      className="text-xs text-purple-400 hover:text-purple-300 font-bold flex items-center gap-1 cursor-pointer"
                    >
                      <Plus className="w-3.5 h-3.5" />
                      <span>Add Tier</span>
                    </button>
                  </div>

                  <div className="space-y-2.5 max-h-48 overflow-y-auto pr-1">
                    {tiers.map((tier) => (
                      <div
                        key={tier.id}
                        className="p-3 rounded-xl bg-white/[0.03] border border-white/10 flex items-center justify-between gap-3 text-xs"
                      >
                        <div className="space-y-0.5 flex-1 min-w-0">
                          <input
                            type="text"
                            value={tier.name}
                            onChange={(e) => handleUpdateTier(tier.id, 'name', e.target.value)}
                            className="bg-transparent font-bold text-white w-full focus:outline-none focus:border-b border-cyan-400 text-xs"
                          />
                          <p className="text-[11px] text-neutral-400 truncate">{tier.perks}</p>
                        </div>

                        <div className="flex items-center gap-2 shrink-0">
                          <div className="flex items-center gap-1 bg-neutral-900 px-2 py-1 rounded-lg border border-white/10">
                            <span className="text-neutral-400 text-[11px]">₹</span>
                            <input
                              type="number"
                              min={0}
                              value={tier.price}
                              onChange={(e) => handleUpdateTier(tier.id, 'price', Number(e.target.value))}
                              className="w-14 bg-transparent text-white font-bold text-xs text-right focus:outline-none"
                            />
                          </div>

                          {tiers.length > 1 && (
                            <button
                              type="button"
                              onClick={() => handleRemoveTier(tier.id)}
                              className="p-1 rounded text-neutral-500 hover:text-rose-400 transition cursor-pointer"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Action Buttons */}
            <div className="pt-3 border-t border-white/10 flex items-center justify-end gap-3">
              <button
                type="button"
                onClick={onClose}
                className="px-5 py-2.5 rounded-xl bg-white/5 hover:bg-white/10 text-neutral-300 hover:text-white font-semibold text-xs transition cursor-pointer"
              >
                Cancel
              </button>

              <button
                type="submit"
                className="px-7 py-3 rounded-2xl bg-gradient-to-r from-cyan-400 via-teal-400 to-emerald-500 hover:brightness-110 text-black font-extrabold text-xs shadow-xl shadow-cyan-500/20 hover:scale-[1.02] active:scale-95 transition cursor-pointer flex items-center gap-2"
              >
                <span>Launch MUN Space</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </form>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
