'use client';

import React, { useState } from 'react';
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
  GraduationCap
} from 'lucide-react';
import { useZenPass } from '@/context/ZenPassContext';
import { ZenPassTier } from '@/types/zenpass';
import { ZenEvent } from '@/types/events';

interface ZenPassBookingModalProps {
  isOpen: boolean;
  onClose: () => void;
  event: ZenEvent;
  onSuccess?: () => void;
}

export function ZenPassBookingModal({ isOpen, onClose, event, onSuccess }: ZenPassBookingModalProps) {
  const { bookPass } = useZenPass();

  const DEFAULT_TIERS: ZenPassTier[] = [
    {
      id: 'tier_early',
      name: 'Early Bird Delegate Pass',
      type: 'early_bird',
      price: event.ticketPrice ? Math.floor(event.ticketPrice * 0.8) : 799,
      currency: 'INR',
      description: 'Full conference floor entry, voting rights, and official digital credentials.',
      perks: ['Floor debate access', 'Official Delegate Kit', 'Verified Certificate'],
      availableCount: 14,
      maxCapacity: 50,
      badgeText: '🔥 14 TICKETS LEFT',
      isPopular: true
    },
    {
      id: 'tier_vip',
      name: 'VIP Executive All-Access Pass',
      type: 'vip_all_access',
      price: event.ticketPrice ? Math.floor(event.ticketPrice * 1.5) : 1799,
      currency: 'INR',
      description: 'Priority speaker dais seating, VIP delegate lounge, gala dinner & crisis room access.',
      perks: ['VIP Lounge & Dinner', 'Front Row Dais seating', 'Crisis room fast-track', 'Priority Speaking slot'],
      availableCount: 8,
      maxCapacity: 25,
      badgeText: '👑 VIP ALL-ACCESS'
    },
    {
      id: 'tier_student',
      name: 'Verified Student / Youth Pass',
      type: 'student_discount',
      price: event.ticketPrice ? Math.floor(event.ticketPrice * 0.5) : 499,
      currency: 'INR',
      description: 'Special subsidized delegate rate for verified school and university students.',
      perks: ['Full plenary floor access', 'Student mentor pairing', 'Digital Dossier'],
      availableCount: 35,
      maxCapacity: 100,
      badgeText: '🎓 50% STUDENT RATE'
    },
    {
      id: 'tier_delegation',
      name: 'Head of Delegation Group Pass',
      type: 'group_delegation',
      price: event.ticketPrice ? Math.floor(event.ticketPrice * 2.2) : 2499,
      currency: 'INR',
      description: 'Bundle pass for institution delegations (3 delegates included).',
      perks: ['3 Allotted country seats', 'Dedicated liaison officer', 'Institutional award tally'],
      availableCount: 6,
      maxCapacity: 15,
      badgeText: '👥 3 DELEGATES BUNDLE'
    }
  ];

  const [selectedTier, setSelectedTier] = useState<ZenPassTier>(DEFAULT_TIERS[0]);
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

  if (!isOpen) return null;

  const finalPortfolio = portfolioPreference === 'CUSTOM'
    ? (customPortfolio.trim() || 'General Delegate')
    : portfolioPreference;

  const totalBasePrice = selectedTier.price * quantity;
  
  // Tax formula:
  // - 0.5% + 19rs protocol gateway tax
  // - Age <= 18: 0% GST (Exempt)
  // - Age 19 to 21 OR College Student (> 18): 5% GST (Concessional)
  // - Age > 21 Non-College Adult: 12% GST (Statutory)
  let gstRate = 0.12;
  let gstLabel = '12% Statutory GST';
  let isGstExempt = false;

  if (attendeeAge <= 18) {
    gstRate = 0;
    gstLabel = '0% Student Exemption (Age ≤ 18)';
    isGstExempt = true;
  } else if ((attendeeAge >= 19 && attendeeAge <= 21) || isCollegeStudent) {
    gstRate = 0.05;
    gstLabel = isCollegeStudent && attendeeAge > 21 
      ? '5% College Student Concession' 
      : '5% Concessional GST (Ages 19-21 / College)';
  }

  const transactionTax = totalBasePrice > 0 ? Math.round(((totalBasePrice * 0.005) + 19) * 100) / 100 : 0;
  const gstAmount = totalBasePrice > 0 ? Math.round((totalBasePrice * gstRate) * 100) / 100 : 0;
  const finalPayable = Math.round((totalBasePrice + transactionTax + gstAmount) * 100) / 100;

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
      chamberRoomId: 'unsc-2026'
    });

    onClose();
    if (onSuccess) onSuccess();
  };

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 overflow-y-auto select-none">
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
          className="relative w-full max-w-2xl max-h-[92vh] bg-[#090a0f] border border-amber-500/30 rounded-3xl shadow-2xl flex flex-col overflow-hidden z-10 text-white"
        >
          {/* Header */}
          <div className="p-5 sm:p-6 border-b border-white/10 flex items-center justify-between bg-white/[0.02]">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-amber-500/20 to-purple-500/20 border border-amber-500/30 flex items-center justify-center text-amber-400">
                <Ticket className="w-5 h-5" />
              </div>
              <div>
                <h2 className="font-display font-bold text-lg text-white flex items-center gap-2">
                  <span>ZenPass District Booking</span>
                  <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-amber-500/20 text-amber-300 font-bold">
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
              <label className="text-xs font-mono font-bold text-neutral-300 uppercase tracking-wider block">
                1. Select Pass Tier
              </label>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {DEFAULT_TIERS.map((tier) => {
                  const isSelected = selectedTier.id === tier.id;
                  return (
                    <div
                      key={tier.id}
                      onClick={() => setSelectedTier(tier)}
                      className={`p-4 rounded-2xl border transition-all cursor-pointer relative flex flex-col justify-between space-y-3 ${
                        isSelected
                          ? 'bg-amber-500/10 border-amber-400 shadow-[0_0_25px_rgba(245,158,11,0.2)]'
                          : 'bg-white/[0.02] border-white/10 hover:border-white/20 hover:bg-white/[0.04]'
                      }`}
                    >
                      {tier.badgeText && (
                        <span className={`absolute top-3 right-3 text-[9px] font-mono font-bold px-2 py-0.5 rounded-full ${
                          tier.isPopular ? 'bg-amber-400 text-black' : 'bg-white/10 text-neutral-300'
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
                        <span className="font-mono font-bold text-base text-amber-300">
                          ₹{tier.price}
                        </span>
                        <div className={`w-5 h-5 rounded-full border flex items-center justify-center ${
                          isSelected ? 'bg-amber-400 border-amber-400 text-black' : 'border-white/20'
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
              <label className="text-xs font-mono font-bold text-amber-300 uppercase tracking-wider flex items-center gap-1.5">
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
                      className="w-full bg-neutral-900 border border-white/15 rounded-xl px-3 py-2.5 text-xs text-white placeholder-neutral-500 focus:outline-none focus:border-amber-400 font-mono"
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
                <span>₹{totalBasePrice.toFixed(2)}</span>
              </div>
              <div className="flex items-center justify-between text-neutral-400">
                <span>Protocol &amp; Gateway Tax (0.5% + ₹19)</span>
                <span className="text-amber-300 font-semibold">+₹{transactionTax.toFixed(2)}</span>
              </div>
              <div className="flex items-center justify-between text-neutral-400">
                <span>
                  Goods &amp; Services Tax (GST) ({gstLabel})
                </span>
                <span className={`font-semibold ${
                  isGstExempt 
                    ? 'text-emerald-400' 
                    : gstRate === 0.05 
                    ? 'text-cyan-300' 
                    : 'text-purple-300'
                }`}>
                  {isGstExempt ? '₹0.00 (Exempt)' : `+₹${gstAmount.toFixed(2)}`}
                </span>
              </div>
              <div className="pt-2 border-t border-white/10 flex items-center justify-between text-sm font-bold text-white">
                <span>Total Payable</span>
                <span className="text-amber-300 font-mono text-base">₹{finalPayable.toFixed(2)}</span>
              </div>
            </div>

            {/* Footer Submit */}
            <div className="pt-2 border-t border-white/10 flex items-center justify-end gap-3">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2.5 rounded-xl bg-white/5 text-neutral-400 hover:text-white text-xs transition"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-7 py-3 rounded-2xl bg-gradient-to-r from-amber-400 via-rose-500 to-purple-600 text-white font-display font-bold text-xs shadow-lg hover:scale-105 transition cursor-pointer flex items-center gap-2"
              >
                <Sparkles className="w-4 h-4 text-amber-200" />
                <span>Confirm &amp; Generate Holographic ZenPass</span>
              </button>
            </div>
          </form>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
