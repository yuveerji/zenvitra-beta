'use client';

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Ticket,
  X,
  Sparkles,
  Check,
  Crown,
  Users,
  ShieldCheck,
  Calendar,
  MapPin,
  Clock,
  ArrowRight,
  Plus,
  Minus,
  GraduationCap,
  CreditCard
} from 'lucide-react';
import { useZenPass } from '@/context/ZenPassContext';
import { useAuth } from '@/context/AuthContext';
import { ZenPassTier } from '@/types/zenpass';
import { ZenEvent } from '@/types/events';
import { ZenCheckoutModal } from '@/components/payments/ZenCheckoutModal';

interface ZenPassBookingModalProps {
  isOpen: boolean;
  onClose: () => void;
  event: ZenEvent;
  onSuccess?: () => void;
}

export function ZenPassBookingModal({ isOpen, onClose, event, onSuccess }: ZenPassBookingModalProps) {
  const { bookPass } = useZenPass();
  const [showCashfreeModal, setShowCashfreeModal] = useState(false);

  const fallbackTier: ZenPassTier = {
    id: `tier_general_${event.id}`,
    name: 'General Admission / Delegate Pass',
    type: 'early_bird',
    price: event.ticketPrice || 0,
    currency: 'INR',
    description: event.description || 'Full conference floor entry, voting rights, and official digital credentials.',
    perks: ['Floor debate access', 'Official Delegate Kit', 'Verified Certificate'],
    availableCount: event.capacity || 50,
    maxCapacity: event.capacity || 50,
    badgeText: event.ticketPrice && event.ticketPrice > 0 ? `₹${event.ticketPrice}` : 'FREE PASS',
    isPopular: true
  };

  const effectiveTiers: ZenPassTier[] = (event.plans && event.plans.length > 0)
    ? event.plans.map((p, idx) => ({
        id: p.id,
        name: p.name,
        type: (idx === 0 ? 'early_bird' : idx === 1 ? 'vip_all_access' : 'student_discount') as any,
        price: p.price,
        currency: 'INR',
        description: p.description || 'Full conference floor entry, voting rights, and official digital credentials.',
        perks: p.perks || ['Floor debate access', 'Official Delegate Kit', 'Verified Certificate'],
        availableCount: p.capacity || 50,
        maxCapacity: p.capacity || 50,
        badgeText: p.badge || (p.price > 0 ? `₹${p.price}` : 'FREE PASS'),
        isPopular: p.isPopular,
      }))
    : [fallbackTier];

  const [selectedTier, setSelectedTier] = useState<ZenPassTier>(effectiveTiers[0]);
  const [quantity, setQuantity] = useState<number>(1);
  const [portfolioPreference, setPortfolioPreference] = useState<string>('Delegate of France');
  const [customPortfolio, setCustomPortfolio] = useState<string>('');
  const [attendeeName, setAttendeeName] = useState<string>('');
  const [attendeeEmail, setAttendeeEmail] = useState<string>('');
  const [attendeePhone, setAttendeePhone] = useState<string>('');
  const [collegeOrSchool, setCollegeOrSchool] = useState<string>('');
  const [isStudentIdChecked, setIsStudentIdChecked] = useState<boolean>(true);
  const [attendeeAge, setAttendeeAge] = useState<number>(17);
  const [isCollegeStudent, setIsCollegeStudent] = useState<boolean>(false);
  const [hasLocalPulsePass, setHasLocalPulsePass] = useState(false);
  const [isRupayCardApplied, setIsRupayCardApplied] = useState(false);
  const [selectedOfferCard, setSelectedOfferCard] = useState<'RUPAY' | 'VISA' | 'MASTERCARD' | 'STUDENT' | 'EARLY_ACCESS' | 'NONE'>('NONE');

  useEffect(() => {
    try {
      if (typeof window !== 'undefined' && localStorage.getItem('zenvitra_pulse_pass') === 'active') {
        setHasLocalPulsePass(true);
      }
    } catch {}
  }, []);

  const { user, profile } = useAuth();

  if (!isOpen) return null;

  const isPulseElite = (profile as any)?.isElite || profile?.role === 'admin' || (profile as any)?.membershipTier === 'elite';
  const isPulsePass = !isPulseElite && ((profile as any)?.hasPulsePass || (profile as any)?.membershipTier === 'pass' || hasLocalPulsePass);

  const finalPortfolio = portfolioPreference === 'CUSTOM'
    ? (customPortfolio.trim() || 'General Delegate')
    : portfolioPreference;

  // Check if active tier has a District-style exclusive offer
  const activeOffer = (event.plans || []).find((p) => p.id === selectedTier.id)?.exclusiveOffer;
  const isOfferAvailable = Boolean(activeOffer && activeOffer.enabled);

  const offerDiscountPerPass = isOfferAvailable && selectedOfferCard === (activeOffer?.cardType || 'RUPAY')
    ? (activeOffer?.discountFlat || (activeOffer?.discountPercent ? Math.round((selectedTier.price * activeOffer.discountPercent) / 100) : 0))
    : 0;

  const totalDiscount = offerDiscountPerPass * quantity;
  const rawBase = selectedTier.price * quantity;
  const totalBasePrice = Math.max(0, rawBase - totalDiscount);
  
  // Platform Fee formula:
  // - Standard: ₹29 flat
  // - Pulse Pass: ₹15 flat
  // - Pulse Elite: ₹0 (Waived)
  // GST rules:
  // - Student Age <= 18: 0% GST (Exempt)
  // - Student Age > 18: 6% GST
  const isGstExempt = attendeeAge <= 18;
  const gstRate = isGstExempt ? 0 : 0.06;
  const gstLabel = isGstExempt ? '0% Student Exemption (Age ≤ 18)' : '6% Student GST (Age > 18)';

  const platformFee = totalBasePrice > 0 ? (isPulseElite ? 0 : isPulsePass ? 15 : 29) : 0;
  const gstAmount = totalBasePrice > 0 ? Math.round((totalBasePrice * gstRate) * 100) / 100 : 0;
  const finalPayable = Math.round((totalBasePrice + platformFee + gstAmount) * 100) / 100;

  const handleBooking = (e: React.FormEvent) => {
    e.preventDefault();

    bookPass({
      eventId: event.id,
      eventTitle: event.title,
      eventCategory: event.category,
      eventBannerUrl: event.coverImage,
      venue: event.location,
      venueCity: event.location.split(',')[1]?.trim() || 'New Delhi',
      eventDate: event.date,
      eventTime: event.time || '10:00 AM',
      tier: selectedTier,
      quantity,
      allocatedPortfolio: finalPortfolio,
      committeeName: event.title,
      attendeeName: attendeeName.trim() || undefined,
      attendeeEmail: attendeeEmail.trim() || undefined,
      attendeePhone: attendeePhone.trim() || undefined,
      collegeOrSchool: collegeOrSchool.trim() || undefined,
      chamberRoomId: event.id || 'unsc-chamber'
    });

    // Persist ticket in strong Prisma database with cryptographic seal
    try {
      fetch('/api/events/tickets', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          eventId: event.id,
          eventTitle: event.title,
          attendeeName: attendeeName.trim() || 'Attendee',
          attendeeEmail: attendeeEmail.trim() || '',
          attendeePhone: attendeePhone.trim() || '',
          tierName: selectedTier.name,
          isStudent: selectedTier.type === 'student_discount' || isGstExempt || selectedTier.name.toLowerCase().includes('student'),
          price: finalPayable,
          currency: 'INR',
        })
      }).catch((err) => console.warn('[DB-TICKET-CREATE-WARN]', err));
    } catch (_) {}

    // Stream booking directly to Google Sheets Event Registrations ledger
    try {
      fetch('/api/sheets', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          targetTab: 'Event Registrations',
          action: 'EVENTS',
          data: {
            eventId: event.id,
            eventTitle: event.title,
            eventName: event.title,
            participantName: attendeeName.trim() || 'Attendee',
            participantEmail: attendeeEmail.trim() || '',
            contactNumber: attendeePhone.trim() || '',
            institution: collegeOrSchool.trim() || '',
            ticketPassType: selectedTier.name,
            quantity,
            allocatedSeat: finalPortfolio,
            totalPrice: `₹${finalPayable}`,
            paymentStatus: 'CONFIRMED'
          }
        })
      }).catch((err) => console.warn('[SHEETS-EVENT-SYNC-WARN]', err));
    } catch (_) {}

    onClose();
    if (onSuccess) onSuccess();
  };

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-6 overflow-y-auto select-none">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          className="fixed inset-0 bg-black/85 backdrop-blur-xl"
        />

        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 20 }}
          className="relative w-full max-w-2xl max-h-[94vh] bg-[#090a0f] border border-white/10 rounded-2xl sm:rounded-3xl shadow-2xl flex flex-col overflow-hidden z-10 text-white"
        >
          {/* Header */}
          <div className="p-5 sm:p-6 border-b border-white/10 flex items-center justify-between bg-white/[0.02]">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center text-white">
                <Ticket className="w-5 h-5" />
              </div>
              <div>
                <h2 className="font-display font-bold text-lg text-white flex items-center gap-2">
                  <span>ZenPass District Booking</span>
                  <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-white/10 text-white font-bold">
                    Official Pass
                  </span>
                </h2>
                <p className="text-xs text-neutral-400">
                  {event.title} &bull; {event.location}
                </p>
              </div>
            </div>

            <button
              type="button"
              onClick={onClose}
              className="p-2 rounded-xl bg-white/5 hover:bg-white/10 text-neutral-400 hover:text-white transition cursor-pointer"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          <form onSubmit={handleBooking} className="p-5 sm:p-7 space-y-6 overflow-y-auto max-h-[75vh]">
            
            {/* 1. SELECT TICKET TIER */}
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <label className="text-xs font-mono font-bold text-neutral-300 uppercase tracking-wider block">
                  1. Select Pass Tier
                </label>
                {activeOffer && activeOffer.enabled && (
                  <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-cyan-500/15 border border-cyan-500/30 text-cyan-300 font-bold flex items-center gap-1">
                    <Sparkles className="w-3 h-3 text-cyan-400" />
                    <span>{activeOffer.badgeText || 'SPECIAL BANK SALE LIVE'}</span>
                  </span>
                )}
              </div>

              {/* District-Style Exclusive Bank & Card Offer Switcher */}
              {isOfferAvailable && activeOffer && (
                <div className="p-3.5 rounded-2xl bg-gradient-to-r from-cyan-950/40 via-purple-950/30 to-black border border-cyan-500/30 space-y-2">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <CreditCard className="w-4 h-4 text-cyan-400" />
                      <span className="font-bold text-xs text-white uppercase tracking-wide">
                        {activeOffer.title || 'RUPAY CARD OFFER • BUY TICKETS NOW'}
                      </span>
                    </div>
                    <span className="text-[9px] font-mono px-2 py-0.5 rounded bg-cyan-400 text-black font-extrabold uppercase">
                      Live Offer
                    </span>
                  </div>
                  <p className="text-[11px] text-neutral-300">
                    Pay using an eligible card to unlock instant ₹{activeOffer.discountFlat || 'special'} discount on each pass before general sale.
                  </p>
                  <div className="flex items-center gap-2 pt-1">
                    <button
                      type="button"
                      onClick={() => setSelectedOfferCard(selectedOfferCard === (activeOffer.cardType || 'RUPAY') ? 'NONE' : (activeOffer.cardType || 'RUPAY'))}
                      className={`px-3 py-1.5 rounded-xl text-xs font-mono font-bold transition flex items-center gap-1.5 cursor-pointer ${
                        selectedOfferCard === (activeOffer.cardType || 'RUPAY')
                          ? 'bg-gradient-to-r from-cyan-400 to-emerald-400 text-black shadow-md'
                          : 'bg-white/10 hover:bg-white/15 text-white border border-white/10'
                      }`}
                    >
                      <Check className="w-3 h-3" />
                      <span>{selectedOfferCard === (activeOffer.cardType || 'RUPAY') ? '✓ Card Offer Applied' : `Apply ${activeOffer.cardType || 'RuPay'} Offer (-₹${activeOffer.discountFlat || 150})`}</span>
                    </button>
                    {selectedOfferCard === (activeOffer.cardType || 'RUPAY') && (
                      <span className="text-[10px] font-mono text-emerald-400 font-bold">
                        Saved ₹{totalDiscount} on {quantity} pass{quantity > 1 ? 'es' : ''}!
                      </span>
                    )}
                  </div>
                </div>
              )}

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {effectiveTiers.map((tier) => {
                  const isSelected = selectedTier.id === tier.id;
                  return (
                    <div
                      key={tier.id}
                      onClick={() => setSelectedTier(tier)}
                      className={`p-4 rounded-2xl border transition-all cursor-pointer relative flex flex-col justify-between space-y-3 ${
                        isSelected
                          ? 'bg-white/5 border-white shadow-sm'
                          : 'bg-white/[0.02] border-white/10 hover:border-white/20 hover:bg-white/[0.04]'
                      }`}
                    >
                      {tier.badgeText && (
                        <span className={`absolute top-3 right-3 text-[9px] font-mono font-bold px-2 py-0.5 rounded-full ${
                          tier.isPopular ? 'bg-white text-black' : 'bg-white/10 text-neutral-300'
                        }`}>
                          {tier.badgeText}
                        </span>
                      )}

                      <div>
                        <h4 className="font-display font-bold text-sm text-white">{tier.name}</h4>
                        <p className="text-[11px] text-neutral-400 font-sans mt-0.5 line-clamp-2">
                          {tier.description}
                        </p>
                      </div>

                      <div className="flex items-center justify-between pt-2 border-t border-white/5">
                        <span className="font-mono font-bold text-base text-white">
                          ₹{tier.price}
                        </span>
                        <div className={`w-5 h-5 rounded-full border flex items-center justify-center ${
                          isSelected ? 'bg-white border-white text-black' : 'border-white/20'
                        }`}>
                          {isSelected && <Check className="w-3 h-3 stroke-[3]" />}
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* 2. ALLOCATED PORTFOLIO / DELEGATION PREFERENCE */}
            <div className="space-y-3 p-4 rounded-2xl bg-black/40 border border-white/10">
              <label className="text-xs font-mono font-bold text-white uppercase tracking-wider flex items-center gap-1.5">
                <Crown className="w-3.5 h-3.5" />
                <span>2. Delegation Portfolio / Role Preference</span>
              </label>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="text-[11px] font-mono text-neutral-400 block">Select Role</label>
                  <select
                    value={portfolioPreference}
                    onChange={(e) => setPortfolioPreference(e.target.value)}
                    className="w-full bg-neutral-900 border border-white/15 rounded-xl px-3 py-2.5 text-xs text-white focus:outline-none cursor-pointer"
                  >
                    <option value="Delegate of France">🇫🇷 Delegate of France</option>
                    <option value="Delegate of United States">🇺🇸 Delegate of United States</option>
                    <option value="Delegate of India">🇮🇳 Delegate of India</option>
                    <option value="Delegate of United Kingdom">🇬🇧 Delegate of United Kingdom</option>
                    <option value="Delegate of Germany">🇩🇪 Delegate of Germany</option>
                    <option value="Delegate of Japan">🇯🇵 Delegate of Japan</option>
                    <option value="Delegate of South Africa">🇿🇦 Delegate of South Africa</option>
                    <option value="Stage Performer / Artist">🎤 Stage Performer / Artist</option>
                    <option value="VIP General Observer">🌐 VIP General Observer</option>
                    <option value="CUSTOM">✨ Type Custom Portfolio...</option>
                  </select>
                </div>

                {portfolioPreference === 'CUSTOM' && (
                  <div className="space-y-1">
                    <label className="text-[11px] font-mono text-neutral-400 block">Custom Portfolio Name *</label>
                    <input
                      type="text"
                      required
                      value={customPortfolio}
                      onChange={(e) => setCustomPortfolio(e.target.value)}
                      placeholder="e.g. Minister of Finance, Lead Defense..."
                      className="w-full bg-neutral-900 border border-white/15 rounded-xl px-3 py-2.5 text-xs text-white placeholder-neutral-500 focus:outline-none focus:border-white/40 font-mono"
                    />
                  </div>
                )}
              </div>
            </div>

            {/* 3. ATTENDEE CONTACT & COLLEGE DETAILS */}
            <div className="space-y-3">
              <label className="text-xs font-mono font-bold text-neutral-300 uppercase tracking-wider block">
                3. Attendee Credentials
              </label>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <input
                  type="text"
                  placeholder="Full Name (for certificate)"
                  value={attendeeName}
                  onChange={(e) => setAttendeeName(e.target.value)}
                  className="bg-black/60 border border-white/15 rounded-xl px-3.5 py-2.5 text-xs text-white placeholder-neutral-500 focus:outline-none focus:border-amber-400"
                />
                <input
                  type="email"
                  placeholder="Email Address (for pass PDF)"
                  value={attendeeEmail}
                  onChange={(e) => setAttendeeEmail(e.target.value)}
                  className="bg-black/60 border border-white/15 rounded-xl px-3.5 py-2.5 text-xs text-white placeholder-neutral-500 focus:outline-none focus:border-amber-400"
                />
                <input
                  type="tel"
                  placeholder="Phone Number (SMS alerts)"
                  value={attendeePhone}
                  onChange={(e) => setAttendeePhone(e.target.value)}
                  className="bg-black/60 border border-white/15 rounded-xl px-3.5 py-2.5 text-xs text-white placeholder-neutral-500 focus:outline-none focus:border-amber-400"
                />
                <input
                  type="text"
                  placeholder="School / University / Org"
                  value={collegeOrSchool}
                  onChange={(e) => setCollegeOrSchool(e.target.value)}
                  className="bg-black/60 border border-white/15 rounded-xl px-3.5 py-2.5 text-xs text-white placeholder-neutral-500 focus:outline-none focus:border-amber-400"
                />

                {/* Age & Student Verification */}
                <div className="sm:col-span-2 p-3.5 rounded-xl bg-white/[0.02] border border-white/10 space-y-2 text-xs font-mono">
                  <div className="flex flex-wrap items-center justify-between gap-3">
                    <div className="flex items-center gap-2">
                      <span className="text-neutral-400">Delegate Age:</span>
                      <input
                        type="number"
                        min={10}
                        max={99}
                        value={attendeeAge}
                        onChange={(e) => setAttendeeAge(parseInt(e.target.value) || 18)}
                        className="w-12 px-2 py-0.5 rounded bg-black border border-white/20 text-white font-mono text-center focus:outline-none focus:border-amber-400"
                      />
                      <span className="text-neutral-500 text-[11px]">years</span>
                    </div>

                    <div className="flex items-center gap-2">
                      <span className={`text-[10px] px-2 py-0.5 rounded-full border ${
                        attendeeAge <= 18
                          ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/30'
                          : ((attendeeAge >= 19 && attendeeAge <= 21) || isCollegeStudent)
                          ? 'bg-cyan-500/20 text-cyan-300 border-cyan-500/30'
                          : 'bg-purple-500/20 text-purple-300 border-purple-500/30'
                      }`}>
                        {attendeeAge <= 18
                          ? '0% GST (School/Minor Exempt)'
                          : ((attendeeAge >= 19 && attendeeAge <= 21) || isCollegeStudent)
                          ? '5% GST (Youth/College Rate)'
                          : '12% GST (Adult Rate)'}
                      </span>
                    </div>
                  </div>

                  <div className="flex flex-wrap items-center gap-4 pt-1 border-t border-white/5">
                    <label className="flex items-center gap-2 text-neutral-300 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={isCollegeStudent}
                        onChange={(e) => setIsCollegeStudent(e.target.checked)}
                        className="accent-cyan-400 cursor-pointer"
                      />
                      <span className="text-[11px]">Enrolled College / University Student (5% GST for age &gt; 18)</span>
                    </label>
                  </div>
                </div>
              </div>
            </div>

            {/* 4. QUANTITY & SUMMARY */}
            <div className="p-4 rounded-2xl bg-black/60 border border-white/10 flex items-center justify-between">
              <div className="space-y-0.5">
                <span className="text-xs font-mono font-bold text-white block">Quantity</span>
                <span className="text-[10px] text-neutral-400">Passes for your party</span>
              </div>

              <div className="flex items-center gap-3">
                <button
                  type="button"
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  className="p-1.5 rounded-lg bg-white/10 hover:bg-white/20 text-white transition cursor-pointer"
                >
                  <Minus className="w-3.5 h-3.5" />
                </button>
                <span className="font-mono font-bold text-sm text-white w-6 text-center">
                  {quantity}
                </span>
                <button
                  type="button"
                  onClick={() => setQuantity(Math.min(10, quantity + 1))}
                  className="p-1.5 rounded-lg bg-white/10 hover:bg-white/20 text-white transition cursor-pointer"
                >
                  <Plus className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>

            {/* Price Breakdown */}
            <div className="p-4 rounded-2xl bg-white/[0.02] border border-white/5 space-y-2 text-xs font-mono">
              <div className="flex items-center justify-between text-neutral-400">
                <span>{selectedTier.name} x {quantity}</span>
                <span>₹{rawBase.toFixed(2)}</span>
              </div>
              {totalDiscount > 0 && (
                <div className="flex items-center justify-between text-emerald-400 font-bold">
                  <span>Card Offer Discount ({activeOffer?.title || 'RuPay Offer'})</span>
                  <span>-₹{totalDiscount.toFixed(2)}</span>
                </div>
              )}
              <div className="flex items-center justify-between text-neutral-400">
                <span>Platform Fee {isPulseElite ? '(Pulse Elite: ₹0)' : isPulsePass ? '(Pulse Pass: ₹15)' : '(Flat ₹29)'}</span>
                <span className="text-white font-semibold">{platformFee === 0 ? '₹0.00 (Waived)' : `+₹${platformFee.toFixed(2)}`}</span>
              </div>
              <div className="flex items-center justify-between text-neutral-400">
                <span>
                  Goods &amp; Services Tax (GST) ({gstLabel})
                </span>
                <span className="font-semibold text-white">
                  {isGstExempt ? '₹0.00 (Exempt)' : `+₹${gstAmount.toFixed(2)}`}
                </span>
              </div>
              <div className="pt-2 border-t border-white/10 flex items-center justify-between text-sm font-bold text-white">
                <span>Total Payable</span>
                <span className="text-white font-mono text-base font-bold">₹{finalPayable.toFixed(2)}</span>
              </div>
            </div>

            {/* Footer Submit */}
            <div className="pt-2 border-t border-white/10 flex flex-wrap items-center justify-end gap-3">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2.5 rounded-xl bg-white/5 text-neutral-400 hover:text-white text-xs transition"
              >
                Cancel
              </button>

              {finalPayable > 0 && (
                <button
                  type="button"
                  onClick={() => setShowCashfreeModal(true)}
                  className="px-4 py-2.5 rounded-xl bg-white/10 hover:bg-white/15 border border-white/15 text-white font-mono font-semibold text-xs transition cursor-pointer flex items-center gap-2"
                >
                  <CreditCard className="w-4 h-4" />
                  <span>Pay ₹{finalPayable.toFixed(2)} via Cashfree</span>
                </button>
              )}

              <button
                type="submit"
                className="px-6 py-2.5 rounded-xl bg-white hover:bg-neutral-200 text-black font-sans font-bold text-xs shadow-sm transition cursor-pointer flex items-center gap-2"
              >
                <Sparkles className="w-4 h-4 fill-black text-black" />
                <span>Confirm &amp; Generate ZenPass</span>
              </button>
            </div>
          </form>
        </motion.div>
      </div>

      {/* Cashfree PG Direct Modal */}
      {showCashfreeModal && (
        <ZenCheckoutModal
          isOpen={showCashfreeModal}
          onClose={() => setShowCashfreeModal(false)}
          product="ZEN.EVENTS"
          title={`${event.title} - ${selectedTier.name}`}
          baseAmount={finalPayable}
          currency="INR"
          merchantName="ZENVITRA Operating Entity"
          onSuccess={() => {
            setShowCashfreeModal(false);
            const fakeEvent = { preventDefault: () => {} } as React.FormEvent;
            handleBooking(fakeEvent);
          }}
        />
      )}
    </AnimatePresence>
  );
}
