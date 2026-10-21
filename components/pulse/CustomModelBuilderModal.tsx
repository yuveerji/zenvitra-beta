'use client';

import React, { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  X,
  Sliders,
  Sparkles,
  GraduationCap,
  Building,
  Check,
  ShieldCheck,
  IndianRupee,
  Users,
  Percent,
  RotateCcw,
  Plus,
  Coins,
  ArrowRight
} from 'lucide-react';

export interface CustomPresetModel {
  id?: string;
  name: string;
  tagline: string;
  students: number;
  studentPrice: number;
  normal: number;
  normalPrice: number;
  attendeeTier: 'standard' | 'pass' | 'elite';
  hostTier: 'standard' | 'pro' | 'institutional';
  escrowPercent: number;
  isCustom?: boolean;
}

interface CustomModelBuilderModalProps {
  isOpen: boolean;
  onClose: () => void;
  onApplyModel: (model: CustomPresetModel, saveAsPreset: boolean) => void;
  initialModel?: Partial<CustomPresetModel>;
}

export function CustomModelBuilderModal({
  isOpen,
  onClose,
  onApplyModel,
  initialModel,
}: CustomModelBuilderModalProps) {
  // Model Name & Tagline
  const [modelName, setModelName] = useState(initialModel?.name || 'My Custom Conference Model');
  const [modelTagline, setModelTagline] = useState(initialModel?.tagline || 'Custom audience ratio & ticket pricing');

  // Student Delegations (0% GST Exempt)
  const [students, setStudents] = useState<number>(initialModel?.students ?? 350);
  const [studentPrice, setStudentPrice] = useState<number>(initialModel?.studentPrice ?? 1400);

  // Normal / Adult Delegations (6% GST)
  const [normal, setNormal] = useState<number>(initialModel?.normal ?? 120);
  const [normalPrice, setNormalPrice] = useState<number>(initialModel?.normalPrice ?? 2200);

  // Tiers and Escrow
  const [hostTier, setHostTier] = useState<'standard' | 'pro' | 'institutional'>(initialModel?.hostTier ?? 'standard');
  const [attendeeTier, setAttendeeTier] = useState<'standard' | 'pass' | 'elite'>(initialModel?.attendeeTier ?? 'standard');
  const [escrowPercent, setEscrowPercent] = useState<number>(initialModel?.escrowPercent ?? 10);
  const [saveAsPreset, setSaveAsPreset] = useState<boolean>(true);

  // Quick chips for prices
  const STUDENT_PRICE_CHIPS = [600, 1000, 1200, 1500, 1800, 2500];
  const NORMAL_PRICE_CHIPS = [1200, 1800, 2200, 2800, 3500, 5000];
  const STUDENT_COUNT_CHIPS = [50, 150, 300, 500, 1000];
  const NORMAL_COUNT_CHIPS = [20, 50, 100, 200, 500];

  // Mathematical Calculations
  const totalAttendees = students + normal;
  const studentGross = students * studentPrice;
  const normalGross = normal * normalPrice;
  const grossVolume = studentGross + normalGross;

  // GST
  const studentGst = 0; // 0%
  const normalGst = normalGross * 0.06;
  const totalGst = studentGst + normalGst;

  // Platform Commission
  const hostCommissionRate = hostTier === 'institutional' ? 0.015 : hostTier === 'pro' ? 0.025 : 0.035;
  const hostPlatformCommission = grossVolume * hostCommissionRate;

  // Cashfree PG (1.9% + GST)
  const pgFee = grossVolume * 0.019;

  // Escrow
  const escrowAmount = grossVolume * (escrowPercent / 100);

  // Net Organizer Payout
  const netOrganizerTotal = Math.max(0, grossVolume - hostPlatformCommission - pgFee);
  const immediateT1Payout = Math.max(0, netOrganizerTotal - escrowAmount);
  const postEventEscrowRelease = Math.min(escrowAmount, netOrganizerTotal);
  const netPerSeat = totalAttendees > 0 ? Math.round(netOrganizerTotal / totalAttendees) : 0;

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const customModel: CustomPresetModel = {
      id: `custom_${Date.now()}`,
      name: modelName.trim() || 'Custom Conference Model',
      tagline: modelTagline.trim() || `${students} Students + ${normal} General`,
      students,
      studentPrice,
      normal,
      normalPrice,
      attendeeTier,
      hostTier,
      escrowPercent,
      isCustom: true,
    };
    onApplyModel(customModel, saveAsPreset);
    onClose();
  };

  return (
    <AnimatePresence>
      <div
        className="fixed inset-0 z-[180] flex items-center justify-center p-3 sm:p-6 bg-black/90 backdrop-blur-2xl overflow-y-auto select-none"
        onClick={onClose}
      >
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 15 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 15 }}
          className="relative w-full max-w-3xl max-h-[92vh] flex flex-col rounded-3xl bg-[#07090e] border border-cyan-500/40 shadow-[0_25px_90px_rgba(0,0,0,0.95)] overflow-hidden text-white font-sans text-xs"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Header */}
          <div className="flex items-center justify-between p-5 sm:p-6 border-b border-white/10 bg-gradient-to-r from-cyan-950/40 via-neutral-900 to-emerald-950/40 shrink-0">
            <div className="flex items-center gap-3">
              <div className="w-11 h-11 rounded-2xl bg-cyan-500/20 border border-cyan-500/40 flex items-center justify-center text-cyan-400 shrink-0 shadow-[0_0_20px_rgba(6,182,212,0.2)]">
                <Sliders className="w-6 h-6" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h2 className="font-display font-bold text-lg text-white">
                    Custom Conference Model Builder
                  </h2>
                  <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-cyan-500/20 text-cyan-300 font-bold border border-cyan-500/30">
                    YOUR OWN CHOICE
                  </span>
                </div>
                <p className="text-xs text-neutral-400 font-sans pt-0.5">
                  Configure your exact delegate ticket prices, student quotas, and see live bank payout figures.
                </p>
              </div>
            </div>

            <button
              type="button"
              onClick={onClose}
              className="p-2 rounded-xl text-neutral-400 hover:text-white hover:bg-white/10 transition cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Form Body */}
          <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto p-5 sm:p-7 space-y-6 custom-scrollbar">
            
            {/* Model Identity */}
            <div className="p-4 rounded-2xl bg-[#0b0e18] border border-white/10 space-y-3">
              <div className="text-[11px] font-mono uppercase tracking-wider text-neutral-400 font-bold flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5 text-cyan-400" />
                <span>Model Identification</span>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="text-[11px] text-neutral-400 block mb-1 font-mono">Preset Name</label>
                  <input
                    type="text"
                    value={modelName}
                    onChange={(e) => setModelName(e.target.value)}
                    placeholder="e.g. My North Zone Assembly"
                    className="w-full bg-[#111422] border border-white/10 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-cyan-500/50"
                  />
                </div>
                <div>
                  <label className="text-[11px] text-neutral-400 block mb-1 font-mono">Tagline / Notes</label>
                  <input
                    type="text"
                    value={modelTagline}
                    onChange={(e) => setModelTagline(e.target.value)}
                    placeholder="e.g. 70% Student, subsidized pass"
                    className="w-full bg-[#111422] border border-white/10 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-cyan-500/50"
                  />
                </div>
              </div>
            </div>

            {/* ── DUAL DELEGATION INPUTS ── */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              
              {/* 1. STUDENT DELEGATES (0% GST) */}
              <div className="p-5 rounded-2xl bg-cyan-950/20 border border-cyan-500/30 space-y-4">
                <div className="flex items-center justify-between border-b border-white/10 pb-2.5">
                  <div className="flex items-center gap-2">
                    <GraduationCap className="w-5 h-5 text-cyan-400" />
                    <div>
                      <span className="font-bold text-white text-sm">Student Delegates</span>
                      <span className="text-[10px] text-neutral-400 block">Age $\le$ 18 &bull; School &amp; College Youth</span>
                    </div>
                  </div>
                  <span className="text-[9px] font-mono px-2 py-0.5 rounded font-bold bg-cyan-500/20 text-cyan-300 border border-cyan-500/40">
                    0% GST EXEMPT
                  </span>
                </div>

                {/* Student Count */}
                <div className="space-y-1.5">
                  <div className="flex items-center justify-between font-mono">
                    <span className="text-neutral-400">Student Headcount:</span>
                    <input
                      type="number"
                      min={0}
                      max={10000}
                      value={students}
                      onChange={(e) => setStudents(Math.max(0, parseInt(e.target.value) || 0))}
                      className="w-24 px-2.5 py-1 rounded-lg bg-black border border-cyan-500/30 text-right text-cyan-400 font-bold focus:outline-none text-xs"
                    />
                  </div>
                  <div className="flex gap-1.5 flex-wrap">
                    {STUDENT_COUNT_CHIPS.map((chip) => (
                      <button
                        key={chip}
                        type="button"
                        onClick={() => setStudents(chip)}
                        className={`px-2 py-0.5 rounded text-[10px] font-mono transition cursor-pointer ${
                          students === chip
                            ? 'bg-cyan-500 text-neutral-950 font-bold'
                            : 'bg-white/5 hover:bg-white/10 text-neutral-400'
                        }`}
                      >
                        {chip}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Student Ticket Price */}
                <div className="space-y-1.5 pt-1">
                  <div className="flex items-center justify-between font-mono">
                    <span className="text-neutral-400">Student Ticket Fee (₹):</span>
                    <input
                      type="number"
                      min={0}
                      step={50}
                      value={studentPrice}
                      onChange={(e) => setStudentPrice(Math.max(0, parseInt(e.target.value) || 0))}
                      className="w-28 px-2.5 py-1 rounded-lg bg-black border border-cyan-500/30 text-right text-cyan-300 font-bold focus:outline-none text-xs"
                    />
                  </div>
                  <div className="flex gap-1.5 flex-wrap">
                    {STUDENT_PRICE_CHIPS.map((chip) => (
                      <button
                        key={chip}
                        type="button"
                        onClick={() => setStudentPrice(chip)}
                        className={`px-2 py-0.5 rounded text-[10px] font-mono transition cursor-pointer ${
                          studentPrice === chip
                            ? 'bg-cyan-500 text-neutral-950 font-bold'
                            : 'bg-white/5 hover:bg-white/10 text-neutral-400'
                        }`}
                      >
                        ₹{chip}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="text-[10px] text-neutral-400 border-t border-white/5 pt-2 font-mono flex items-center justify-between">
                  <span>Student Subtotal:</span>
                  <span className="text-cyan-300 font-bold text-xs">₹{studentGross.toLocaleString('en-IN')} (0% GST)</span>
                </div>
              </div>

              {/* 2. GENERAL DELEGATES (6% GST) */}
              <div className="p-5 rounded-2xl bg-purple-950/20 border border-purple-500/30 space-y-4">
                <div className="flex items-center justify-between border-b border-white/10 pb-2.5">
                  <div className="flex items-center gap-2">
                    <Building className="w-5 h-5 text-purple-400" />
                    <div>
                      <span className="font-bold text-white text-sm">General Attendees</span>
                      <span className="text-[10px] text-neutral-400 block">Age &gt; 18 &bull; Adults / Observers</span>
                    </div>
                  </div>
                  <span className="text-[9px] font-mono px-2 py-0.5 rounded font-bold bg-purple-500/20 text-purple-300 border border-purple-500/40">
                    6% GST APPLIED
                  </span>
                </div>

                {/* Normal Count */}
                <div className="space-y-1.5">
                  <div className="flex items-center justify-between font-mono">
                    <span className="text-neutral-400">Normal Headcount:</span>
                    <input
                      type="number"
                      min={0}
                      max={10000}
                      value={normal}
                      onChange={(e) => setNormal(Math.max(0, parseInt(e.target.value) || 0))}
                      className="w-24 px-2.5 py-1 rounded-lg bg-black border border-purple-500/30 text-right text-purple-400 font-bold focus:outline-none text-xs"
                    />
                  </div>
                  <div className="flex gap-1.5 flex-wrap">
                    {NORMAL_COUNT_CHIPS.map((chip) => (
                      <button
                        key={chip}
                        type="button"
                        onClick={() => setNormal(chip)}
                        className={`px-2 py-0.5 rounded text-[10px] font-mono transition cursor-pointer ${
                          normal === chip
                            ? 'bg-purple-500 text-white font-bold'
                            : 'bg-white/5 hover:bg-white/10 text-neutral-400'
                        }`}
                      >
                        {chip}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Normal Ticket Price */}
                <div className="space-y-1.5 pt-1">
                  <div className="flex items-center justify-between font-mono">
                    <span className="text-neutral-400">Normal Ticket Fee (₹):</span>
                    <input
                      type="number"
                      min={0}
                      step={50}
                      value={normalPrice}
                      onChange={(e) => setNormalPrice(Math.max(0, parseInt(e.target.value) || 0))}
                      className="w-28 px-2.5 py-1 rounded-lg bg-black border border-purple-500/30 text-right text-purple-300 font-bold focus:outline-none text-xs"
                    />
                  </div>
                  <div className="flex gap-1.5 flex-wrap">
                    {NORMAL_PRICE_CHIPS.map((chip) => (
                      <button
                        key={chip}
                        type="button"
                        onClick={() => setNormalPrice(chip)}
                        className={`px-2 py-0.5 rounded text-[10px] font-mono transition cursor-pointer ${
                          normalPrice === chip
                            ? 'bg-purple-500 text-white font-bold'
                            : 'bg-white/5 hover:bg-white/10 text-neutral-400'
                        }`}
                      >
                        ₹{chip}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="text-[10px] text-neutral-400 border-t border-white/5 pt-2 font-mono flex items-center justify-between">
                  <span>General Subtotal:</span>
                  <span className="text-purple-300 font-bold text-xs">₹{normalGross.toLocaleString('en-IN')} (+₹{Math.round(normalGst)} GST)</span>
                </div>
              </div>
            </div>

            {/* ── ESCROW & PLATFORM POLICY SETTINGS ── */}
            <div className="p-4 rounded-2xl bg-[#0b0e18] border border-white/10 space-y-3 font-mono">
              <div className="text-[11px] uppercase tracking-wider text-neutral-400 font-bold flex items-center gap-1.5">
                <Percent className="w-3.5 h-3.5 text-emerald-400" />
                <span>Escrow Reserve &amp; Host Commission Tier</span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {/* Escrow Percentage */}
                <div className="space-y-1.5">
                  <div className="flex items-center justify-between">
                    <span className="text-neutral-400">Civic Escrow Holdback:</span>
                    <span className="text-amber-400 font-bold">{escrowPercent}%</span>
                  </div>
                  <div className="flex gap-2">
                    {[0, 5, 10, 15, 20].map((pct) => (
                      <button
                        key={pct}
                        type="button"
                        onClick={() => setEscrowPercent(pct)}
                        className={`flex-1 py-1 rounded-lg text-xs font-bold transition cursor-pointer ${
                          escrowPercent === pct
                            ? 'bg-amber-500 text-neutral-950'
                            : 'bg-white/5 hover:bg-white/10 text-neutral-400'
                        }`}
                      >
                        {pct}%
                      </button>
                    ))}
                  </div>
                </div>

                {/* Host Tier */}
                <div className="space-y-1.5">
                  <div className="flex items-center justify-between">
                    <span className="text-neutral-400">Host Take-Rate Tier:</span>
                    <span className="text-emerald-400 font-bold">
                      {hostTier === 'institutional' ? '1.5%' : hostTier === 'pro' ? '2.5%' : '3.5%'}
                    </span>
                  </div>
                  <div className="flex gap-2">
                    {(['standard', 'pro', 'institutional'] as const).map((tier) => (
                      <button
                        key={tier}
                        type="button"
                        onClick={() => setHostTier(tier)}
                        className={`flex-1 py-1 rounded-lg text-xs capitalize font-bold transition cursor-pointer ${
                          hostTier === tier
                            ? 'bg-emerald-500 text-neutral-950'
                            : 'bg-white/5 hover:bg-white/10 text-neutral-400'
                        }`}
                      >
                        {tier === 'institutional' ? 'Inst (1.5%)' : tier === 'pro' ? 'Pro (2.5%)' : 'Std (3.5%)'}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            {/* ── LIVE SETTLEMENT MATH PREVIEW CARD ── */}
            <div className="p-5 rounded-2xl bg-[#0e111d] border border-cyan-500/30 space-y-3 font-mono text-xs shadow-xl">
              <div className="flex items-center justify-between border-b border-white/10 pb-2">
                <span className="text-white font-bold flex items-center gap-1.5">
                  <ShieldCheck className="w-4 h-4 text-emerald-400" />
                  <span>Real-Time Bank Settlement Forecast</span>
                </span>
                <span className="text-neutral-400 text-[10px]">
                  {totalAttendees} Seats Total ({students} Stu + {normal} Gen)
                </span>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 pt-1">
                <div className="p-2.5 rounded-xl bg-white/[0.02] border border-white/5">
                  <div className="text-[10px] text-neutral-400">Gross GMV Volume</div>
                  <div className="text-base font-black text-white mt-0.5">₹{grossVolume.toLocaleString('en-IN')}</div>
                </div>
                <div className="p-2.5 rounded-xl bg-white/[0.02] border border-white/5">
                  <div className="text-[10px] text-neutral-400">Platform &amp; PG Fee</div>
                  <div className="text-base font-black text-red-400 mt-0.5">
                    -₹{Math.round(hostPlatformCommission + pgFee).toLocaleString('en-IN')}
                  </div>
                </div>
                <div className="p-2.5 rounded-xl bg-white/[0.02] border border-white/5">
                  <div className="text-[10px] text-neutral-400">10% Escrow Reserve</div>
                  <div className="text-base font-black text-amber-300 mt-0.5">
                    ₹{Math.round(escrowAmount).toLocaleString('en-IN')}
                  </div>
                </div>
                <div className="p-2.5 rounded-xl bg-emerald-500/10 border border-emerald-500/30">
                  <div className="text-[10px] text-emerald-400">Net Host Payout</div>
                  <div className="text-base font-black text-emerald-300 mt-0.5">
                    ₹{Math.round(netOrganizerTotal).toLocaleString('en-IN')}
                  </div>
                </div>
              </div>

              <div className="flex items-center justify-between text-[11px] text-neutral-400 pt-1">
                <span>Immediate T+1 Bank Transfer: <strong className="text-emerald-400">₹{Math.round(immediateT1Payout).toLocaleString('en-IN')}</strong></span>
                <span>Net Per Seat: <strong className="text-cyan-300">₹{netPerSeat.toLocaleString('en-IN')}</strong></span>
              </div>
            </div>

            {/* Save as Preset Toggle */}
            <label className="flex items-center gap-2 cursor-pointer text-xs font-mono text-neutral-300">
              <input
                type="checkbox"
                checked={saveAsPreset}
                onChange={(e) => setSaveAsPreset(e.target.checked)}
                className="rounded accent-cyan-400 w-4 h-4"
              />
              <span>Save this configuration as a custom preset in my model selector</span>
            </label>

            {/* Modal Actions */}
            <div className="flex items-center justify-end gap-3 pt-2 border-t border-white/10">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2.5 rounded-xl bg-white/5 hover:bg-white/10 text-neutral-300 text-xs font-medium transition cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-cyan-500 to-emerald-500 hover:from-cyan-400 hover:to-emerald-400 text-neutral-950 font-bold text-xs flex items-center gap-2 shadow-lg shadow-cyan-500/20 transition cursor-pointer"
              >
                <span>Apply to Live Simulator</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </form>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
