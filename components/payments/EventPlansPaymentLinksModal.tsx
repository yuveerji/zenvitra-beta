'use client';

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import QRCode from 'qrcode';
import {
  X,
  CreditCard,
  Plus,
  Trash2,
  Copy,
  Check,
  ExternalLink,
  Share2,
  Send,
  QrCode,
  Sparkles,
  Ticket,
  CheckCircle2,
  Clock,
  AlertTriangle,
  RefreshCw,
  Users,
  IndianRupee,
  Phone,
  Mail,
  User,
  ShieldCheck,
  Calendar,
  Layers,
  ArrowRight,
  Edit3
} from 'lucide-react';
import { RegistrationPlan, CashfreePaymentLinkRecord } from '@/types/events';

interface EventPlansPaymentLinksModalProps {
  isOpen: boolean;
  onClose: () => void;
  eventId: string;
  eventTitle: string;
  initialPlans?: RegistrationPlan[];
  initialPaymentLinks?: CashfreePaymentLinkRecord[];
  onSavePlans?: (plans: RegistrationPlan[]) => void;
  onSavePaymentLink?: (link: CashfreePaymentLinkRecord) => void;
}

export function EventPlansPaymentLinksModal({
  isOpen,
  onClose,
  eventId,
  eventTitle,
  initialPlans = [],
  initialPaymentLinks = [],
  onSavePlans,
  onSavePaymentLink,
}: EventPlansPaymentLinksModalProps) {
  const [activeTab, setActiveTab] = useState<'plans' | 'give' | 'links'>('plans');

  // Plans state
  const defaultPlans: RegistrationPlan[] = [
    {
      id: 'plan_early_bird',
      name: 'Early Bird Delegate Pass',
      price: 699,
      currency: 'INR',
      description: 'Standard conference entry, committee floor debate rights, and verified credentials.',
      perks: ['Committee Floor Entry', 'Official Delegate Kit', 'Verified Digital Certificate'],
      capacity: 50,
      bookedCount: 0,
      badge: '🔥 POPULAR',
      status: 'active',
    },
    {
      id: 'plan_vip_executive',
      name: 'VIP Executive Dais Pass',
      price: 1499,
      currency: 'INR',
      description: 'Priority dais seating, VIP lounge dinner, crisis room access, and mentor pairing.',
      perks: ['VIP Lounge & Dinner', 'Front Row Dais Seating', 'Crisis Fast-Track', 'Executive Certificate'],
      capacity: 20,
      bookedCount: 0,
      badge: '👑 VIP ALL-ACCESS',
      status: 'active',
    },
    {
      id: 'plan_observer',
      name: 'Observer / Youth Pass',
      price: 399,
      currency: 'INR',
      description: 'Subsidized observer badge for students wanting to witness plenary proceedings.',
      perks: ['Plenary Hall Access', 'Observer Badge', 'Digital Dossier'],
      capacity: 100,
      bookedCount: 0,
      badge: '🎓 STUDENT RATE',
      status: 'active',
    },
  ];

  const [plans, setPlans] = useState<RegistrationPlan[]>(() => {
    if (initialPlans && initialPlans.length > 0) return initialPlans;
    if (typeof window !== 'undefined') {
      const stored = localStorage.getItem(`zenvitra_plans_${eventId}`);
      if (stored) {
        try {
          return JSON.parse(stored);
        } catch {}
      }
    }
    return defaultPlans;
  });

  useEffect(() => {
    if (initialPlans && initialPlans.length > 0) {
      setPlans(initialPlans);
    }
  }, [initialPlans]);

  // Saved Payment Links
  const [paymentLinks, setPaymentLinks] = useState<CashfreePaymentLinkRecord[]>(() => {
    if (initialPaymentLinks && initialPaymentLinks.length > 0) return initialPaymentLinks;
    if (typeof window !== 'undefined') {
      const stored = localStorage.getItem(`zenvitra_links_${eventId}`);
      if (stored) {
        try {
          return JSON.parse(stored);
        } catch {}
      }
    }
    return [];
  });

  // New Plan Creation Form
  const [showNewPlanForm, setShowNewPlanForm] = useState(false);
  const [newPlanName, setNewPlanName] = useState('');
  const [newPlanPrice, setNewPlanPrice] = useState<number>(799);
  const [newPlanDesc, setNewPlanDesc] = useState('');
  const [newPlanPerks, setNewPlanPerks] = useState('');
  const [newPlanCapacity, setNewPlanCapacity] = useState<number>(50);
  const [newPlanBadge, setNewPlanBadge] = useState('');

  // Give Plan to Attendee Form
  const [recipientName, setRecipientName] = useState('');
  const [recipientEmail, setRecipientEmail] = useState('');
  const [recipientPhone, setRecipientPhone] = useState('');
  const [selectedPlanId, setSelectedPlanId] = useState<string>(plans[0]?.id || 'plan_early_bird');
  const [customPriceOverride, setCustomPriceOverride] = useState<string>('');
  const [isGeneratingLink, setIsGeneratingLink] = useState(false);
  const [generatedLinkData, setGeneratedLinkData] = useState<any | null>(null);
  const [qrCodeDataUrl, setQrCodeDataUrl] = useState<string | null>(null);
  const [copiedLink, setCopiedLink] = useState(false);
  const [linkError, setLinkError] = useState<string | null>(null);

  // Inline Tier Edit State
  const [editingPlanId, setEditingPlanId] = useState<string | null>(null);
  const [editPrice, setEditPrice] = useState<number>(0);
  const [editName, setEditName] = useState<string>('');

  // Sync plans and payment links to localStorage and parent callback
  const persistPlans = (updatedPlans: RegistrationPlan[]) => {
    setPlans(updatedPlans);
    if (typeof window !== 'undefined') {
      localStorage.setItem(`zenvitra_plans_${eventId}`, JSON.stringify(updatedPlans));
    }
    if (onSavePlans) onSavePlans(updatedPlans);
  };

  const persistLink = (linkRecord: CashfreePaymentLinkRecord) => {
    const updated = [linkRecord, ...paymentLinks.filter((l) => l.linkId !== linkRecord.linkId)];
    setPaymentLinks(updated);
    if (typeof window !== 'undefined') {
      localStorage.setItem(`zenvitra_links_${eventId}`, JSON.stringify(updated));
    }
    if (onSavePaymentLink) onSavePaymentLink(linkRecord);
  };

  const handleCreatePlan = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newPlanName.trim()) return;

    const newPlan: RegistrationPlan = {
      id: `plan_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`,
      name: newPlanName.trim(),
      price: Math.max(0, Number(newPlanPrice)),
      currency: 'INR',
      description: newPlanDesc.trim() || 'Official conference registration ticket with verified floor access.',
      perks: newPlanPerks
        .split(',')
        .map((p) => p.trim())
        .filter(Boolean),
      capacity: Number(newPlanCapacity) || 50,
      bookedCount: 0,
      badge: newPlanBadge.trim() || undefined,
      status: 'active',
    };

    const next = [...plans, newPlan];
    persistPlans(next);

    // Reset Form
    setNewPlanName('');
    setNewPlanPrice(799);
    setNewPlanDesc('');
    setNewPlanPerks('');
    setNewPlanCapacity(50);
    setNewPlanBadge('');
    setShowNewPlanForm(false);
  };

  const handleDeletePlan = (planId: string) => {
    const next = plans.filter((p) => p.id !== planId);
    persistPlans(next);
  };

  const handleStartEditPlan = (plan: RegistrationPlan) => {
    setEditingPlanId(plan.id);
    setEditPrice(plan.price);
    setEditName(plan.name);
  };

  const handleSaveEditPlan = (planId: string) => {
    const updated = plans.map((p) =>
      p.id === planId
        ? { ...p, name: editName.trim() || p.name, price: Math.max(0, editPrice) }
        : p
    );
    persistPlans(updated);
    setEditingPlanId(null);
  };

  const handleQuickAddTier = (preset: { name: string; price: number; badge?: string; perks: string[] }) => {
    const newPlan: RegistrationPlan = {
      id: `plan_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`,
      name: preset.name,
      price: preset.price,
      currency: 'INR',
      description: `Official registration credentials for ${preset.name}.`,
      perks: preset.perks,
      capacity: 50,
      bookedCount: 0,
      badge: preset.badge,
      status: 'active',
    };
    persistPlans([...plans, newPlan]);
  };

  // Generate Cashfree Link (Either for a plan or for a direct attendee)
  const handleGenerateCashfreeLink = async (
    targetPlan: RegistrationPlan,
    directAttendee?: { name: string; email: string; phone: string; customPrice?: number }
  ) => {
    setIsGeneratingLink(true);
    setLinkError(null);
    setGeneratedLinkData(null);
    setQrCodeDataUrl(null);

    const amount = directAttendee?.customPrice !== undefined && directAttendee.customPrice >= 0
      ? directAttendee.customPrice
      : targetPlan.price;

    const customerName = directAttendee?.name?.trim() || 'Delegate';
    const customerEmail = directAttendee?.email?.trim() || 'delegate@zenvitra.xyz';
    const customerPhone = directAttendee?.phone?.trim() || '9999999999';

    try {
      const response = await fetch('/api/payments/cashfree/links/create', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          amount: Math.max(1, amount), // Cashfree min ₹1
          currency: 'INR',
          purpose: `${eventTitle}: ${targetPlan.name}`,
          customerName,
          customerEmail,
          customerPhone,
          eventId,
          planId: targetPlan.id,
          planName: targetPlan.name,
          autoReminders: true,
          sendEmail: true,
        }),
      });

      const data = await response.json();
      if (!response.ok || !data.linkUrl) {
        throw new Error(data.error || 'Failed to generate link');
      }

      setGeneratedLinkData(data);

      // Generate QR Code data URL
      try {
        const qrUrl = await QRCode.toDataURL(data.linkUrl, {
          width: 320,
          margin: 2,
          color: { dark: '#000000', light: '#ffffff' },
        });
        setQrCodeDataUrl(qrUrl);
      } catch (qrErr) {
        console.warn('QR code generation warning:', qrErr);
      }

      // Record in saved payment links
      const linkRecord: CashfreePaymentLinkRecord = {
        linkId: data.linkId,
        cfLinkId: data.cfLinkId,
        linkUrl: data.linkUrl,
        linkStatus: data.linkStatus || 'ACTIVE',
        amount: data.linkAmount || amount,
        currency: 'INR',
        planId: targetPlan.id,
        planName: targetPlan.name,
        recipientName: directAttendee?.name,
        recipientEmail: directAttendee?.email,
        recipientPhone: directAttendee?.phone,
        createdAt: new Date().toISOString(),
      };

      persistLink(linkRecord);

      // Also attach payment link to plan if it's the general plan link
      if (!directAttendee) {
        const updatedPlans = plans.map((p) =>
          p.id === targetPlan.id
            ? { ...p, paymentLinkId: data.linkId, paymentLinkUrl: data.linkUrl }
            : p
        );
        persistPlans(updatedPlans);
      }
    } catch (err: any) {
      setLinkError(err.message || 'Error communicating with Cashfree');
    } finally {
      setIsGeneratingLink(false);
    }
  };

  const handleCopyLink = (url: string) => {
    navigator.clipboard.writeText(url);
    setCopiedLink(true);
    setTimeout(() => setCopiedLink(false), 2000);
  };

  const handleShareWhatsApp = (url: string, planName: string, amount: number) => {
    const text = encodeURIComponent(
      `Hello! Here is your official registration payment link for *${eventTitle}* (${planName} - ₹${amount}):\n\n${url}\n\nPay securely via UPI (GPay/PhonePe), Credit/Debit Card, or NetBanking.`
    );
    window.open(`https://wa.me/?text=${text}`, '_blank');
  };

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-[250] flex items-center justify-center p-3 sm:p-4 bg-black/85 backdrop-blur-md overflow-y-auto">
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 15 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 15 }}
          className="relative w-full max-w-3xl bg-[#0a0d14] border border-cyan-500/30 rounded-3xl p-5 sm:p-7 text-left shadow-2xl max-h-[92vh] overflow-y-auto no-scrollbar space-y-6 text-white pb-24 sm:pb-8"
        >
          {/* Header */}
          <div className="flex items-start justify-between gap-4 border-b border-white/10 pb-4">
            <div className="space-y-1">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-500/10 border border-cyan-500/30 text-cyan-300 font-mono text-xs font-bold uppercase tracking-wider">
                <CreditCard className="w-3.5 h-3.5 text-cyan-400" />
                <span>Cashfree Payment Gateway &bull; V1</span>
              </div>
              <h2 className="text-xl sm:text-2xl font-black text-white font-display">
                Registration Plans &amp; Payment Links
              </h2>
              <p className="text-xs text-neutral-400">
                Set registration pricing, create tiered delegate plans, and give hosted Cashfree payment links to attendees.
              </p>
            </div>
            <button
              type="button"
              onClick={onClose}
              className="p-2 rounded-xl text-neutral-400 hover:text-white hover:bg-white/10 transition cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Navigation Tabs */}
          <div className="flex items-center gap-2 border-b border-white/10 pb-2">
            <button
              type="button"
              onClick={() => setActiveTab('plans')}
              className={`px-4 py-2 rounded-xl font-mono text-xs font-bold transition flex items-center gap-2 cursor-pointer ${
                activeTab === 'plans'
                  ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/40 shadow-lg'
                  : 'text-neutral-400 hover:text-white hover:bg-white/5'
              }`}
            >
              <Layers className="w-4 h-4" />
              <span>Registration Plans ({plans.length})</span>
            </button>

            <button
              type="button"
              onClick={() => setActiveTab('give')}
              className={`px-4 py-2 rounded-xl font-mono text-xs font-bold transition flex items-center gap-2 cursor-pointer ${
                activeTab === 'give'
                  ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 shadow-lg'
                  : 'text-neutral-400 hover:text-white hover:bg-white/5'
              }`}
            >
              <Send className="w-4 h-4" />
              <span>Give Plan / Direct Link</span>
            </button>

            <button
              type="button"
              onClick={() => setActiveTab('links')}
              className={`px-4 py-2 rounded-xl font-mono text-xs font-bold transition flex items-center gap-2 cursor-pointer ${
                activeTab === 'links'
                  ? 'bg-amber-500/20 text-amber-300 border border-amber-500/40 shadow-lg'
                  : 'text-neutral-400 hover:text-white hover:bg-white/5'
              }`}
            >
              <Ticket className="w-4 h-4" />
              <span>Payment Links Ledger ({paymentLinks.length})</span>
            </button>
          </div>

          {/* TAB 1: REGISTRATION PLANS */}
          {activeTab === 'plans' && (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-sm font-bold text-white font-mono uppercase tracking-wider">
                    Available Delegate Plans
                  </h3>
                  <p className="text-xs text-neutral-400">
                    Attendees can select any of these plans during registration or checkout.
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => setShowNewPlanForm(!showNewPlanForm)}
                  className="px-3.5 py-1.5 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-black font-mono text-xs font-bold transition flex items-center gap-1.5 cursor-pointer shadow-lg"
                >
                  <Plus className="w-4 h-4" />
                  <span>{showNewPlanForm ? 'Close Form' : 'Add New Tier / Plan'}</span>
                </button>
              </div>

              {/* Quick Add Common Tiers Presets */}
              <div className="flex flex-wrap items-center gap-1.5 p-2.5 rounded-2xl bg-white/[0.03] border border-white/10">
                <span className="text-[11px] font-mono text-neutral-400">Add common tier:</span>
                {[
                  { name: 'Early Bird Pass', price: 699, badge: '🔥 EARLY BIRD', perks: ['Floor Entry', 'Official Delegate Kit', 'Verified Certificate'] },
                  { name: 'Regular Delegate', price: 999, badge: 'POPULAR', perks: ['Committee Seat', 'Official Kit', 'Secretariat Certificate'] },
                  { name: 'VIP Executive Dais', price: 1499, badge: '👑 VIP', perks: ['VIP Lounge & Dinner', 'Front Row Dais', 'Executive Certificate'] },
                  { name: 'Delegation Head', price: 1299, badge: 'HEAD', perks: ['Delegation Voting', 'Secretariat Access', 'Executive Certificate'] },
                  { name: 'Observer / Youth', price: 399, badge: 'STUDENT', perks: ['Plenary Floor Entry', 'Digital Observer Dossier'] },
                  { name: 'With Accommodation', price: 2499, badge: 'HOTEL', perks: ['2-Night Hotel Stay', 'Committee Seat', 'Meals Included'] },
                  { name: 'Standard Flat Pass', price: 799, badge: 'STANDARD', perks: ['Floor Entry', 'Delegate Kit', 'Verified Certificate'] },
                ].map((preset) => (
                  <button
                    key={preset.name}
                    type="button"
                    onClick={() => handleQuickAddTier(preset)}
                    className="px-2.5 py-1 rounded-lg bg-white/5 hover:bg-white/10 border border-white/10 text-[10px] font-mono text-neutral-300 hover:text-white transition cursor-pointer"
                  >
                    + {preset.name} (₹{preset.price})
                  </button>
                ))}
              </div>

              {/* New Plan Creator Card */}
              {showNewPlanForm && (
                <form
                  onSubmit={handleCreatePlan}
                  className="p-4 rounded-2xl bg-white/[0.03] border border-cyan-500/30 space-y-4"
                >
                  <div className="font-mono text-xs font-bold text-cyan-300 uppercase tracking-wider flex items-center gap-2">
                    <Sparkles className="w-3.5 h-3.5" />
                    <span>Create Custom Registration Plan</span>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                    <div className="space-y-1">
                      <label className="text-[11px] font-semibold text-neutral-300 uppercase">
                        Plan Name *
                      </label>
                      <input
                        type="text"
                        required
                        value={newPlanName}
                        onChange={(e) => setNewPlanName(e.target.value)}
                        placeholder="e.g. VIP Plenary Pass"
                        className="w-full px-3 py-2 rounded-xl bg-black/60 border border-white/10 text-white placeholder:text-neutral-600 focus:outline-none focus:border-cyan-500/50"
                      />
                    </div>

                    <div className="space-y-1">
                      <label className="text-[11px] font-semibold text-neutral-300 uppercase">
                        Price (INR ₹) *
                      </label>
                      <input
                        type="number"
                        min="0"
                        required
                        value={newPlanPrice}
                        onChange={(e) => setNewPlanPrice(Number(e.target.value))}
                        placeholder="799"
                        className="w-full px-3 py-2 rounded-xl bg-black/60 border border-white/10 text-white placeholder:text-neutral-600 focus:outline-none focus:border-cyan-500/50"
                      />
                    </div>

                    <div className="space-y-1 sm:col-span-2">
                      <label className="text-[11px] font-semibold text-neutral-300 uppercase">
                        Description
                      </label>
                      <input
                        type="text"
                        value={newPlanDesc}
                        onChange={(e) => setNewPlanDesc(e.target.value)}
                        placeholder="Outline what this pass grants..."
                        className="w-full px-3 py-2 rounded-xl bg-black/60 border border-white/10 text-white placeholder:text-neutral-600 focus:outline-none focus:border-cyan-500/50"
                      />
                    </div>

                    <div className="space-y-1 sm:col-span-2">
                      <label className="text-[11px] font-semibold text-neutral-300 uppercase">
                        Perks (Comma Separated)
                      </label>
                      <input
                        type="text"
                        value={newPlanPerks}
                        onChange={(e) => setNewPlanPerks(e.target.value)}
                        placeholder="Floor Entry, Official Delegate Kit, Certificate"
                        className="w-full px-3 py-2 rounded-xl bg-black/60 border border-white/10 text-white placeholder:text-neutral-600 focus:outline-none focus:border-cyan-500/50"
                      />
                    </div>

                    <div className="space-y-1">
                      <label className="text-[11px] font-semibold text-neutral-300 uppercase">
                        Quota / Max Capacity
                      </label>
                      <input
                        type="number"
                        min="1"
                        value={newPlanCapacity}
                        onChange={(e) => setNewPlanCapacity(Number(e.target.value))}
                        placeholder="50"
                        className="w-full px-3 py-2 rounded-xl bg-black/60 border border-white/10 text-white placeholder:text-neutral-600 focus:outline-none focus:border-cyan-500/50"
                      />
                    </div>

                    <div className="space-y-1">
                      <label className="text-[11px] font-semibold text-neutral-300 uppercase">
                        Badge Text (Optional)
                      </label>
                      <input
                        type="text"
                        value={newPlanBadge}
                        onChange={(e) => setNewPlanBadge(e.target.value)}
                        placeholder="🔥 EARLY BIRD"
                        className="w-full px-3 py-2 rounded-xl bg-black/60 border border-white/10 text-white placeholder:text-neutral-600 focus:outline-none focus:border-cyan-500/50"
                      />
                    </div>
                  </div>

                  <div className="flex justify-end gap-2 pt-2">
                    <button
                      type="button"
                      onClick={() => setShowNewPlanForm(false)}
                      className="px-3.5 py-1.5 rounded-xl bg-white/5 text-neutral-400 hover:text-white text-xs"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      className="px-5 py-1.5 rounded-xl bg-cyan-400 text-black font-bold text-xs hover:bg-cyan-300 transition"
                    >
                      Save Plan
                    </button>
                  </div>
                </form>
              )}

              {/* Plans List */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {plans.map((plan) => (
                  <div
                    key={plan.id}
                    className="p-4 rounded-2xl bg-white/[0.02] border border-white/10 hover:border-cyan-500/30 transition flex flex-col justify-between space-y-3"
                  >
                    <div>
                      {editingPlanId === plan.id ? (
                        <div className="space-y-2 p-2.5 rounded-xl bg-purple-500/10 border border-purple-500/30">
                          <div className="space-y-1">
                            <label className="text-[10px] font-mono text-purple-300 uppercase">Tier / Pass Name</label>
                            <input
                              type="text"
                              value={editName}
                              onChange={(e) => setEditName(e.target.value)}
                              className="w-full px-2.5 py-1.5 rounded-lg bg-black border border-white/20 text-white text-xs font-semibold focus:outline-none focus:border-purple-400"
                            />
                          </div>
                          <div className="space-y-1">
                            <label className="text-[10px] font-mono text-purple-300 uppercase">Price (INR ₹)</label>
                            <div className="relative">
                              <span className="absolute left-2.5 top-1.5 text-amber-400 font-mono text-xs">₹</span>
                              <input
                                type="number"
                                min={0}
                                value={editPrice}
                                onChange={(e) => setEditPrice(Number(e.target.value))}
                                className="w-full pl-6 pr-2 py-1.5 rounded-lg bg-black border border-amber-500/30 text-amber-300 text-xs font-mono font-bold focus:outline-none focus:border-amber-400"
                              />
                            </div>
                          </div>
                          <div className="flex justify-end gap-1.5 pt-1">
                            <button
                              type="button"
                              onClick={() => setEditingPlanId(null)}
                              className="px-2.5 py-1 rounded-md bg-white/5 text-neutral-400 hover:text-white text-[11px] font-mono"
                            >
                              Cancel
                            </button>
                            <button
                              type="button"
                              onClick={() => handleSaveEditPlan(plan.id)}
                              className="px-3 py-1 rounded-md bg-purple-500 hover:bg-purple-400 text-black font-bold text-[11px] font-mono"
                            >
                              Save Tier
                            </button>
                          </div>
                        </div>
                      ) : (
                        <div className="flex items-start justify-between gap-2">
                          <div>
                            <div className="flex items-center gap-2">
                              <span className="font-bold text-sm text-white">{plan.name}</span>
                              {plan.badge && (
                                <span className="text-[9px] font-mono font-bold px-2 py-0.5 rounded-full bg-cyan-500/20 text-cyan-300 border border-cyan-500/30">
                                  {plan.badge}
                                </span>
                              )}
                            </div>
                            <p className="text-[11px] text-neutral-400 mt-1 leading-snug">
                              {plan.description}
                            </p>
                          </div>
                          <div className="flex items-center gap-1">
                            <button
                              type="button"
                              onClick={() => handleStartEditPlan(plan)}
                              className="p-1 rounded-lg text-neutral-400 hover:text-purple-300 hover:bg-purple-500/10 transition cursor-pointer"
                              title="Edit Tier Price & Name"
                            >
                              <Edit3 className="w-3.5 h-3.5" />
                            </button>
                            <button
                              type="button"
                              onClick={() => handleDeletePlan(plan.id)}
                              className="p-1 rounded-lg text-neutral-500 hover:text-red-400 hover:bg-red-500/10 transition cursor-pointer"
                              title="Delete Plan"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        </div>
                      )}

                      {/* Price Badge */}
                      {editingPlanId !== plan.id && (
                        <div className="mt-3 flex items-baseline gap-1 font-mono">
                          <span className="text-xl font-black text-amber-400">
                            {plan.price > 0 ? `₹${plan.price}` : 'FREE'}
                          </span>
                          {plan.price > 0 && (
                            <span className="text-[10px] text-neutral-400">INR / attendee</span>
                          )}
                          {plan.capacity && (
                            <span className="ml-auto text-[10px] text-neutral-500">
                              Cap: {plan.capacity} seats
                            </span>
                          )}
                        </div>
                      )}

                      {/* Perks */}
                      {plan.perks && plan.perks.length > 0 && (
                        <div className="mt-2 space-y-1">
                          {plan.perks.map((perk, i) => (
                            <div
                              key={i}
                              className="flex items-center gap-1.5 text-[11px] text-neutral-300"
                            >
                              <Check className="w-3 h-3 text-emerald-400 shrink-0" />
                              <span className="truncate">{perk}</span>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>

                    {/* Actions on Plan */}
                    <div className="pt-2 border-t border-white/5 flex items-center gap-2">
                      <button
                        type="button"
                        onClick={() => handleGenerateCashfreeLink(plan)}
                        disabled={isGeneratingLink}
                        className="flex-1 py-2 px-3 rounded-xl bg-cyan-500/15 hover:bg-cyan-500/25 border border-cyan-500/30 text-cyan-300 font-mono text-xs font-bold transition flex items-center justify-center gap-1.5 cursor-pointer"
                      >
                        <CreditCard className="w-3.5 h-3.5" />
                        <span>Generate Link</span>
                      </button>

                      <button
                        type="button"
                        onClick={() => {
                          setSelectedPlanId(plan.id);
                          setActiveTab('give');
                        }}
                        className="py-2 px-3 rounded-xl bg-white/5 hover:bg-white/10 text-white font-mono text-xs transition flex items-center justify-center gap-1 cursor-pointer"
                        title="Give plan to someone"
                      >
                        <Send className="w-3.5 h-3.5 text-emerald-400" />
                        <span>Give</span>
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* TAB 2: GIVE PLAN TO ATTENDEE / DIRECT LINK */}
          {activeTab === 'give' && (
            <div className="space-y-5">
              <div>
                <h3 className="text-sm font-bold text-white font-mono uppercase tracking-wider">
                  Issue &amp; Give Plan to Specific Attendee
                </h3>
                <p className="text-xs text-neutral-400">
                  Generate a tailored Cashfree payment link with the delegate's details pre-filled. Share via WhatsApp or Email.
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs font-sans">
                {/* Select Plan */}
                <div className="space-y-1 sm:col-span-2">
                  <label className="text-[11px] font-semibold text-neutral-300 uppercase">
                    Select Plan to Grant *
                  </label>
                  <select
                    value={selectedPlanId}
                    onChange={(e) => setSelectedPlanId(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-black/60 border border-white/10 text-white focus:outline-none focus:border-cyan-500/50"
                  >
                    {plans.map((p) => (
                      <option key={p.id} value={p.id}>
                        {p.name} — ₹{p.price} {p.badge ? `(${p.badge})` : ''}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Attendee Name */}
                <div className="space-y-1">
                  <label className="text-[11px] font-semibold text-neutral-300 uppercase flex items-center gap-1">
                    <User className="w-3 h-3 text-cyan-400" />
                    <span>Attendee / Delegate Name</span>
                  </label>
                  <input
                    type="text"
                    value={recipientName}
                    onChange={(e) => setRecipientName(e.target.value)}
                    placeholder="e.g. Advait Sharma"
                    className="w-full px-3 py-2.5 rounded-xl bg-black/60 border border-white/10 text-white placeholder:text-neutral-600 focus:outline-none focus:border-cyan-500/50"
                  />
                </div>

                {/* Attendee Phone */}
                <div className="space-y-1">
                  <label className="text-[11px] font-semibold text-neutral-300 uppercase flex items-center gap-1">
                    <Phone className="w-3 h-3 text-cyan-400" />
                    <span>Phone Number (10 Digits) *</span>
                  </label>
                  <input
                    type="tel"
                    value={recipientPhone}
                    onChange={(e) => setRecipientPhone(e.target.value)}
                    placeholder="9876543210"
                    className="w-full px-3 py-2.5 rounded-xl bg-black/60 border border-white/10 text-white placeholder:text-neutral-600 focus:outline-none focus:border-cyan-500/50"
                  />
                </div>

                {/* Attendee Email */}
                <div className="space-y-1">
                  <label className="text-[11px] font-semibold text-neutral-300 uppercase flex items-center gap-1">
                    <Mail className="w-3 h-3 text-cyan-400" />
                    <span>Email Address</span>
                  </label>
                  <input
                    type="email"
                    value={recipientEmail}
                    onChange={(e) => setRecipientEmail(e.target.value)}
                    placeholder="advait@example.com"
                    className="w-full px-3 py-2.5 rounded-xl bg-black/60 border border-white/10 text-white placeholder:text-neutral-600 focus:outline-none focus:border-cyan-500/50"
                  />
                </div>

                {/* Custom Negotiated Price */}
                <div className="space-y-1">
                  <label className="text-[11px] font-semibold text-neutral-300 uppercase flex items-center gap-1">
                    <IndianRupee className="w-3 h-3 text-amber-400" />
                    <span>Special Price Override (Optional)</span>
                  </label>
                  <input
                    type="number"
                    value={customPriceOverride}
                    onChange={(e) => setCustomPriceOverride(e.target.value)}
                    placeholder="Leave blank to use plan price"
                    className="w-full px-3 py-2.5 rounded-xl bg-black/60 border border-white/10 text-white placeholder:text-neutral-600 focus:outline-none focus:border-cyan-500/50"
                  />
                </div>
              </div>

              {/* Submit Button */}
              <div className="flex justify-end pt-2">
                <button
                  type="button"
                  disabled={isGeneratingLink}
                  onClick={() => {
                    const plan = plans.find((p) => p.id === selectedPlanId) || plans[0];
                    if (!plan) return;
                    handleGenerateCashfreeLink(plan, {
                      name: recipientName,
                      email: recipientEmail,
                      phone: recipientPhone,
                      customPrice: customPriceOverride ? Number(customPriceOverride) : undefined,
                    });
                  }}
                  className="px-6 py-3 rounded-2xl bg-gradient-to-r from-emerald-400 to-cyan-500 hover:from-emerald-300 hover:to-cyan-400 text-black font-display font-bold text-xs uppercase tracking-wider transition flex items-center gap-2 cursor-pointer shadow-lg disabled:opacity-50"
                >
                  {isGeneratingLink ? (
                    <>
                      <RefreshCw className="w-4 h-4 animate-spin" />
                      <span>Generating Cashfree Link...</span>
                    </>
                  ) : (
                    <>
                      <Send className="w-4 h-4" />
                      <span>Generate &amp; Give Payment Link</span>
                    </>
                  )}
                </button>
              </div>

              {/* Error Display */}
              {linkError && (
                <div className="p-3.5 rounded-xl bg-red-500/10 border border-red-500/30 text-red-400 text-xs flex items-center gap-2 font-mono">
                  <AlertTriangle className="w-4 h-4 shrink-0" />
                  <span>{linkError}</span>
                </div>
              )}

              {/* Result Modal / Preview when link is generated */}
              {generatedLinkData && (
                <div className="p-5 rounded-2xl bg-emerald-500/[0.08] border border-emerald-500/40 space-y-4 font-mono">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2 text-emerald-400 font-bold text-xs uppercase">
                      <CheckCircle2 className="w-4 h-4" />
                      <span>Payment Link Generated Successfully</span>
                    </div>
                    <span className="text-[10px] px-2 py-0.5 rounded bg-emerald-400/20 text-emerald-300 font-bold">
                      {generatedLinkData.linkStatus || 'ACTIVE'}
                    </span>
                  </div>

                  {/* Link URL pill */}
                  <div className="p-3 rounded-xl bg-black/60 border border-white/10 flex items-center justify-between gap-3 text-xs">
                    <span className="truncate text-neutral-300 select-all">
                      {generatedLinkData.linkUrl}
                    </span>
                    <button
                      type="button"
                      onClick={() => handleCopyLink(generatedLinkData.linkUrl)}
                      className="px-3 py-1.5 rounded-lg bg-emerald-500/20 hover:bg-emerald-500/30 text-emerald-300 font-bold text-xs transition flex items-center gap-1.5 shrink-0 cursor-pointer"
                    >
                      {copiedLink ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                      <span>{copiedLink ? 'Copied' : 'Copy'}</span>
                    </button>
                  </div>

                  {/* Quick Share buttons */}
                  <div className="flex items-center gap-2 flex-wrap">
                    <button
                      type="button"
                      onClick={() =>
                        handleShareWhatsApp(
                          generatedLinkData.linkUrl,
                          generatedLinkData.linkPurpose || 'Registration Pass',
                          generatedLinkData.linkAmount || 0
                        )
                      }
                      className="px-4 py-2 rounded-xl bg-[#25D366]/20 hover:bg-[#25D366]/30 border border-[#25D366]/40 text-[#25D366] text-xs font-bold transition flex items-center gap-2 cursor-pointer"
                    >
                      <Share2 className="w-3.5 h-3.5" />
                      <span>Share on WhatsApp</span>
                    </button>

                    <a
                      href={generatedLinkData.linkUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="px-4 py-2 rounded-xl bg-white/5 hover:bg-white/10 text-white text-xs font-bold transition flex items-center gap-2"
                    >
                      <ExternalLink className="w-3.5 h-3.5" />
                      <span>Open Checkout Page</span>
                    </a>
                  </div>

                  {/* QR Code Preview */}
                  {qrCodeDataUrl && (
                    <div className="pt-2 border-t border-white/10 flex items-center gap-4">
                      <div className="w-24 h-24 p-1.5 rounded-xl bg-white flex items-center justify-center shrink-0">
                        <img src={qrCodeDataUrl} alt="Payment QR" className="w-full h-full object-contain" />
                      </div>
                      <div className="text-xs space-y-1 font-sans">
                        <span className="font-bold text-white font-mono block">Instant Scan QR</span>
                        <p className="text-neutral-400 text-[11px] leading-relaxed">
                          Attendee can scan this directly using Google Pay, PhonePe, Paytm, or BHIM to complete their payment.
                        </p>
                      </div>
                    </div>
                  )}
                </div>
              )}
            </div>
          )}

          {/* TAB 3: PAYMENT LINKS LEDGER */}
          {activeTab === 'links' && (
            <div className="space-y-4">
              <div>
                <h3 className="text-sm font-bold text-white font-mono uppercase tracking-wider">
                  Issued Payment Links Ledger
                </h3>
                <p className="text-xs text-neutral-400">
                  Track, copy, or monitor all Cashfree payment links generated for {eventTitle}.
                </p>
              </div>

              {paymentLinks.length === 0 ? (
                <div className="p-8 text-center rounded-2xl bg-white/[0.02] border border-white/5 space-y-3 font-mono">
                  <Ticket className="w-8 h-8 text-neutral-500 mx-auto" />
                  <p className="text-xs text-neutral-400">No payment links created yet for this event.</p>
                  <button
                    type="button"
                    onClick={() => setActiveTab('plans')}
                    className="px-4 py-2 rounded-xl bg-cyan-500/20 text-cyan-300 border border-cyan-500/30 text-xs font-bold transition cursor-pointer"
                  >
                    Generate Your First Link
                  </button>
                </div>
              ) : (
                <div className="space-y-2">
                  {paymentLinks.map((item) => (
                    <div
                      key={item.linkId}
                      className="p-3.5 rounded-2xl bg-white/[0.02] border border-white/10 hover:border-cyan-500/30 transition flex items-center justify-between gap-3 flex-wrap"
                    >
                      <div className="space-y-1 min-w-[200px]">
                        <div className="flex items-center gap-2">
                          <span className="font-bold text-xs text-white font-mono">
                            {item.planName}
                          </span>
                          <span
                            className={`text-[9px] font-mono font-bold px-2 py-0.5 rounded-md ${
                              item.linkStatus === 'PAID'
                                ? 'bg-emerald-500/20 text-emerald-300'
                                : 'bg-amber-500/20 text-amber-300'
                            }`}
                          >
                            {item.linkStatus}
                          </span>
                        </div>
                        <div className="text-[11px] text-neutral-400 flex items-center gap-2">
                          <span>₹{item.amount}</span>
                          {item.recipientName && <span>&bull; {item.recipientName}</span>}
                          {item.recipientPhone && <span>({item.recipientPhone})</span>}
                        </div>
                      </div>

                      <div className="flex items-center gap-2">
                        <button
                          type="button"
                          onClick={() => handleCopyLink(item.linkUrl)}
                          className="p-2 rounded-xl bg-white/5 hover:bg-white/10 text-neutral-300 text-xs transition cursor-pointer"
                          title="Copy Link"
                        >
                          <Copy className="w-3.5 h-3.5" />
                        </button>

                        <button
                          type="button"
                          onClick={() =>
                            handleShareWhatsApp(item.linkUrl, item.planName, item.amount)
                          }
                          className="p-2 rounded-xl bg-[#25D366]/15 hover:bg-[#25D366]/25 text-[#25D366] text-xs transition cursor-pointer"
                          title="Share on WhatsApp"
                        >
                          <Share2 className="w-3.5 h-3.5" />
                        </button>

                        <a
                          href={item.linkUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="p-2 rounded-xl bg-cyan-500/15 hover:bg-cyan-500/25 text-cyan-300 text-xs transition"
                          title="Open Link"
                        >
                          <ExternalLink className="w-3.5 h-3.5" />
                        </a>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* Footer */}
          <div className="pt-3 border-t border-white/10 flex items-center justify-between text-xs text-neutral-400 font-mono">
            <div className="flex items-center gap-1.5 text-[11px]">
              <ShieldCheck className="w-3.5 h-3.5 text-cyan-400" />
              <span>Cashfree Payments Secured &bull; PCI-DSS Level 1 &bull; V1</span>
            </div>
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-xl bg-white/10 hover:bg-white/15 text-white transition cursor-pointer"
            >
              Done
            </button>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
