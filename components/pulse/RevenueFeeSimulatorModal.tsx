'use client';

import React, { useState, useEffect, useMemo } from 'react';
import { 
  X, 
  Calculator, 
  Coins, 
  TrendingUp, 
  ShieldCheck, 
  ShieldAlert,
  Zap, 
  DollarSign, 
  ArrowRight, 
  Sparkles,
  Ticket,
  Building2,
  Users,
  Percent,
  Check,
  Copy,
  Download,
  RotateCcw,
  Info,
  Scale,
  CreditCard,
  Building,
  GraduationCap,
  UserCheck,
  Plus,
  Trash2,
  Sliders
} from 'lucide-react';
import { useZenPulse } from '@/context/ZenPulsePlatformContext';
import { useAuth } from '@/context/AuthContext';
import { CustomModelBuilderModal, CustomPresetModel } from './CustomModelBuilderModal';

interface RevenueFeeSimulatorModalProps {
  isOpen: boolean;
  onClose: () => void;
}

interface PresetModel {
  name: string;
  tagline: string;
  students: number;
  studentPrice: number;
  normal: number;
  normalPrice: number;
  attendeeTier: 'standard' | 'pass' | 'elite';
  hostTier: 'standard' | 'pro' | 'institutional';
  escrowPercent: number;
}

const PRESET_MODELS: PresetModel[] = [
  {
    name: 'Premier Youth Summit',
    tagline: 'Premier 500-delegate North Zone Assembly',
    students: 400,
    studentPrice: 1500,
    normal: 100,
    normalPrice: 2200,
    attendeeTier: 'standard',
    hostTier: 'standard',
    escrowPercent: 10,
  },
  {
    name: 'High School Model UN',
    tagline: 'Pure student delegation + faculty advisors',
    students: 320,
    studentPrice: 1000,
    normal: 30,
    normalPrice: 1500,
    attendeeTier: 'pass',
    hostTier: 'pro',
    escrowPercent: 10,
  },
  {
    name: 'Collegiate Assembly',
    tagline: 'University delegates and open public observers',
    students: 150,
    studentPrice: 1200,
    normal: 250,
    normalPrice: 2400,
    attendeeTier: 'standard',
    hostTier: 'standard',
    escrowPercent: 10,
  },
  {
    name: 'All-Youth Parliament',
    tagline: '100% Student plenary with zero tax burden',
    students: 250,
    studentPrice: 850,
    normal: 0,
    normalPrice: 0,
    attendeeTier: 'elite',
    hostTier: 'institutional',
    escrowPercent: 10,
  },
];

export function RevenueFeeSimulatorModal({ isOpen, onClose }: RevenueFeeSimulatorModalProps) {
  const { civicPointsBalance } = useZenPulse();
  const { user, profile } = useAuth();

  /* Simulator States */
  // 1. Students (Age <= 18): 0% GST Exempt
  const [studentCount, setStudentCount] = useState<number>(400);
  const [studentTicketPrice, setStudentTicketPrice] = useState<number>(1500);

  // 2. Normal Attendees / Over 18: 6% Concessional GST
  const [normalCount, setNormalCount] = useState<number>(100);
  const [normalTicketPrice, setNormalTicketPrice] = useState<number>(2200);

  // 3. Platform & Host Fee Tiers
  const [attendeeTier, setAttendeeTier] = useState<'standard' | 'pass' | 'elite'>('standard');
  const [hostTier, setHostTier] = useState<'standard' | 'pro' | 'institutional'>('standard');
  const [includeCashfreeFee, setIncludeCashfreeFee] = useState<boolean>(true);
  const [escrowPercentage, setEscrowPercentage] = useState<number>(10);

  // 4. Custom Model Builder States
  const [isCustomBuilderOpen, setIsCustomBuilderOpen] = useState(false);
  const [customModels, setCustomModels] = useState<CustomPresetModel[]>([]);

  useEffect(() => {
    try {
      const stored = localStorage.getItem('zenvitra_custom_fee_models');
      if (stored) {
        const parsed = JSON.parse(stored);
        if (Array.isArray(parsed)) setCustomModels(parsed);
      }
    } catch (_) {}
  }, []);

  // 5. Copied Toast State
  const [copiedSummary, setCopiedSummary] = useState(false);

  if (!isOpen) return null;

  /* Mathematical Financial Engine */
  const totalAttendees = studentCount + normalCount;

  // Subtotals
  const studentGross = studentCount * studentTicketPrice;
  const normalGross = normalCount * normalTicketPrice;
  const grossGMV = studentGross + normalGross;

  // GST Calculation:
  // - Students <= 18: 0% GST (Student Empowerment Exemption)
  // - Normal > 18: 6% GST
  const studentGstRate = 0;
  const normalGstRate = 0.06;
  const studentGstAmount = studentGross * studentGstRate; // ₹0
  const normalGstAmount = normalGross * normalGstRate;
  const totalGstCollected = studentGstAmount + normalGstAmount;
  const effectiveGstRate = grossGMV > 0 ? (totalGstCollected / grossGMV) * 100 : 0;

  // Attendee Convenience Fees (Flat ₹29 / ₹15 / ₹0)
  const attendeeFixedFee = attendeeTier === 'elite' ? 0 : attendeeTier === 'pass' ? 15 : 29;
  const totalAttendeeConvenienceFees = totalAttendees * attendeeFixedFee;

  // Host Take-Rate Platform Commission (1.5% / 0.75% / 0%)
  const hostCommissionRate = hostTier === 'institutional' ? 0 : hostTier === 'pro' ? 0.0075 : 0.015;
  const hostPlatformCommission = grossGMV * hostCommissionRate;

  // Cashfree Payment Gateway Processing Fee
  // Standard Cashfree PG: 1.95% + 18% GST on PG charge = 2.301% effective
  const pgFeeRate = includeCashfreeFee ? 0.0195 * 1.18 : 0;
  const totalPgFees = (grossGMV + totalAttendeeConvenienceFees + totalGstCollected) * pgFeeRate;

  // Escrow Holdback (Constitutional 10% held during event, disbursed post-conclave)
  const escrowAmount = grossGMV * (escrowPercentage / 100);

  // Net Organizer Settlement
  // Net payout from ticket revenue after platform fee and PG fee
  const netOrganizerTotal = Math.max(0, grossGMV - hostPlatformCommission - (includeCashfreeFee ? totalPgFees : 0));
  const immediateT1Payout = Math.max(0, netOrganizerTotal - escrowAmount);
  const postEventEscrowRelease = Math.min(escrowAmount, netOrganizerTotal);

  // Unit Economics
  const averageTicketPrice = totalAttendees > 0 ? Math.round(grossGMV / totalAttendees) : 0;
  const netTakeHomePerSeat = totalAttendees > 0 ? Math.round(netOrganizerTotal / totalAttendees) : 0;
  const totalAttendeeOutlay = grossGMV + totalAttendeeConvenienceFees + totalGstCollected;

  // Apply Preset
  const handleApplyPreset = (preset: PresetModel | CustomPresetModel) => {
    setStudentCount(preset.students);
    setStudentTicketPrice(preset.studentPrice);
    setNormalCount(preset.normal);
    setNormalTicketPrice(preset.normalPrice);
    setAttendeeTier(preset.attendeeTier);
    setHostTier(preset.hostTier);
    setEscrowPercentage(preset.escrowPercent);
  };

  const handleApplyCustomModel = (model: CustomPresetModel, saveAsPreset: boolean) => {
    handleApplyPreset(model);
    if (saveAsPreset) {
      setCustomModels((prev) => {
        const next = [model, ...prev.filter((m) => m.name !== model.name)];
        try {
          localStorage.setItem('zenvitra_custom_fee_models', JSON.stringify(next));
        } catch (_) {}
        return next;
      });
    }
  };

  const handleDeleteCustomModel = (name: string) => {
    setCustomModels((prev) => {
      const next = prev.filter((m) => m.name !== name);
      try {
        localStorage.setItem('zenvitra_custom_fee_models', JSON.stringify(next));
      } catch (_) {}
      return next;
    });
  };

  // Copy Detailed Summary to Clipboard
  const handleCopySummary = () => {
    const summaryText = `
=== ZENVITRA DUAL-SIDED SETTLEMENT BREAKDOWN ===
Total Registered Seats: ${totalAttendees.toLocaleString()} (${studentCount} Students + ${normalCount} General)
Blended Gross Collections (GMV): ₹${grossGMV.toLocaleString()}

[STUDENTS (Age ≤ 18)]:
- Count: ${studentCount} delegates
- Ticket Price: ₹${studentTicketPrice.toLocaleString()}
- Gross: ₹${studentGross.toLocaleString()}
- GST: 0% (₹0.00) [Student Empowerment Exemption]

[NORMAL ATTENDEES (Age > 18)]:
- Count: ${normalCount} delegates
- Ticket Price: ₹${normalTicketPrice.toLocaleString()}
- Gross: ₹${normalGross.toLocaleString()}
- GST (6%): ₹${Math.round(normalGstAmount).toLocaleString()}

[TAX & DEDUCTIONS]:
- Total GST Remitted: ₹${Math.round(totalGstCollected).toLocaleString()} (Effective: ${effectiveGstRate.toFixed(2)}%)
- Cashfree PG Charges: ₹${Math.round(totalPgFees).toLocaleString()}
- Platform Commission: ₹${Math.round(hostPlatformCommission).toLocaleString()} (${(hostCommissionRate * 100).toFixed(2)}%)
- Constitutional Escrow Reserve (${escrowPercentage}%): ₹${Math.round(escrowAmount).toLocaleString()}

[ORGANIZER BANK SETTLEMENT (UTR)]:
- Immediate T+1 Bank Transfer: ₹${Math.round(immediateT1Payout).toLocaleString()}
- Post-Event Escrow Release: ₹${Math.round(postEventEscrowRelease).toLocaleString()}
- Total Net Organizer Realization: ₹${Math.round(netOrganizerTotal).toLocaleString()}
- Net Take-Home Per Seat: ₹${netTakeHomePerSeat.toLocaleString()}
================================================
Generated via ZENVITRA Protocol Engine
`.trim();

    if (typeof navigator !== 'undefined') {
      navigator.clipboard.writeText(summaryText);
      setCopiedSummary(true);
      setTimeout(() => setCopiedSummary(false), 2500);
    }
  };

  // Export CSV
  const handleDownloadCsv = () => {
    const csvContent = `data:text/csv;charset=utf-8,Category,Count,Unit Price (INR),Gross Revenue (INR),GST Rate,GST Amount (INR),Net Settlement (INR)\n`
      + `Students (≤18 yrs),${studentCount},${studentTicketPrice},${studentGross},0%,0,${studentGross}\n`
      + `General Attendees (>18 yrs),${normalCount},${normalTicketPrice},${normalGross},6%,${Math.round(normalGstAmount)},${normalGross}\n`
      + `Total Gross GMV,${totalAttendees},${averageTicketPrice},${grossGMV},${effectiveGstRate.toFixed(2)}%,${Math.round(totalGstCollected)},${Math.round(netOrganizerTotal)}\n`
      + `Platform Commission,-,-,-,-,-,${Math.round(hostPlatformCommission)}\n`
      + `Cashfree PG Processing,-,-,-,-,-,${Math.round(totalPgFees)}\n`
      + `Net Organizer Bank Payout,-,-,-,-,-,${Math.round(netOrganizerTotal)}\n`;

    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `zenvitra_settlement_model_${Date.now()}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div 
      className="fixed inset-0 z-[150] flex items-center justify-center p-3 sm:p-6 bg-black/90 backdrop-blur-2xl overflow-y-auto select-none"
      onClick={onClose}
    >
      <div 
        className="relative w-full max-w-4xl max-h-[92vh] flex flex-col rounded-3xl bg-[#07090e] border border-emerald-500/40 shadow-[0_25px_90px_rgba(0,0,0,0.95)] overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Modal Header */}
        <div className="flex items-center justify-between p-5 sm:p-6 border-b border-white/10 bg-gradient-to-r from-emerald-950/40 via-neutral-900 to-cyan-950/40 shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-11 h-11 rounded-2xl bg-emerald-500/20 border border-emerald-500/40 flex items-center justify-center text-emerald-400 shrink-0 shadow-[0_0_20px_rgba(16,185,129,0.2)]">
              <Calculator className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="font-display font-bold text-lg text-white">
                  Event Settlement &amp; GST Revenue Simulator
                </h2>
                <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-300 font-bold border border-emerald-500/30">
                  REAL FINANCIAL ENGINE
                </span>
              </div>
              <p className="text-xs font-sans text-neutral-400 pt-0.5">
                Dual-audience seat breakdown: Students ($\le$ 18 &bull; 0% GST) + Normal Attendees (&gt; 18 &bull; 6% GST)
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handleCopySummary}
              className="p-2.5 rounded-xl bg-white/5 hover:bg-white/10 text-neutral-300 hover:text-white transition flex items-center gap-1.5 text-xs font-mono border border-white/10 cursor-pointer"
              title="Copy Summary Table"
            >
              {copiedSummary ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4" />}
              <span className="hidden sm:inline">{copiedSummary ? 'Copied' : 'Copy'}</span>
            </button>
            <button
              onClick={handleDownloadCsv}
              className="p-2.5 rounded-xl bg-white/5 hover:bg-white/10 text-neutral-300 hover:text-white transition flex items-center gap-1.5 text-xs font-mono border border-white/10 cursor-pointer"
              title="Download CSV"
            >
              <Download className="w-4 h-4" />
              <span className="hidden sm:inline">CSV</span>
            </button>
            <button
              onClick={onClose}
              className="p-2 rounded-xl text-neutral-400 hover:text-white hover:bg-white/10 transition cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Modal Scrollable Body */}
        <div className="flex-1 overflow-y-auto p-5 sm:p-6 space-y-6 custom-scrollbar font-sans text-xs">
          
          {/* Quick Real Presets Banner */}
          {/* Quick Real Presets Banner & Custom Model Builder */}
          <div className="space-y-2.5">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
              <span className="text-[11px] font-mono uppercase tracking-wider text-neutral-400 font-bold flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5 text-amber-400" />
                <span>Select Pre-Engineered Model or Build Custom:</span>
              </span>

              <button
                type="button"
                onClick={() => setIsCustomBuilderOpen(true)}
                className="px-3.5 py-1.5 rounded-xl bg-gradient-to-r from-cyan-500 via-teal-500 to-emerald-500 hover:from-cyan-400 hover:to-emerald-400 text-neutral-950 font-bold text-xs flex items-center gap-1.5 shadow-md shadow-cyan-500/20 transition cursor-pointer self-start sm:self-auto"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Custom Model (Set Your Own)</span>
              </button>
            </div>

            <div className="grid grid-cols-2 lg:grid-cols-4 gap-2">
              {/* User-created Custom Models */}
              {customModels.map((custom) => (
                <div
                  key={custom.id || custom.name}
                  onClick={() => handleApplyPreset(custom)}
                  className="relative group/custom p-3 rounded-2xl bg-cyan-950/30 hover:bg-cyan-500/15 border border-cyan-500/40 text-left transition cursor-pointer"
                >
                  <div className="flex items-center justify-between">
                    <div className="text-cyan-300 font-bold text-xs truncate">
                      {custom.name}
                    </div>
                    <div className="flex items-center gap-1">
                      <span className="text-[9px] font-mono px-1.5 py-0.2 rounded bg-cyan-500/20 text-cyan-300 font-bold">
                        CUSTOM
                      </span>
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleDeleteCustomModel(custom.name);
                        }}
                        className="text-neutral-500 hover:text-red-400 p-0.5 rounded opacity-0 group-hover/custom:opacity-100 transition"
                        title="Delete Custom Model"
                      >
                        <X className="w-3 h-3" />
                      </button>
                    </div>
                  </div>
                  <div className="text-[10px] text-cyan-400/80 font-mono truncate pt-0.5">
                    {custom.students} Stu @ ₹{custom.studentPrice} &bull; {custom.normal} Gen @ ₹{custom.normalPrice}
                  </div>
                </div>
              ))}

              {/* Default Presets */}
              {PRESET_MODELS.map((preset) => (
                <button
                  key={preset.name}
                  type="button"
                  onClick={() => handleApplyPreset(preset)}
                  className="p-3 rounded-2xl bg-white/[0.02] hover:bg-emerald-500/10 border border-white/10 hover:border-emerald-500/40 text-left transition group cursor-pointer"
                >
                  <div className="text-white font-bold text-xs truncate group-hover:text-emerald-300">
                    {preset.name}
                  </div>
                  <div className="text-[10px] text-neutral-400 font-sans truncate pt-0.5">
                    {preset.students} Students + {preset.normal} Normal
                  </div>
                </button>
              ))}
            </div>
          </div>

          {/* ── SECTION 1: DUAL-AUDIENCE INPUT ENGINE ── */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
            {/* AUDIENCE 1: STUDENTS (AGE <= 18) */}
            <div className="p-5 rounded-3xl bg-[#090b12] border border-emerald-500/30 space-y-4">
              <div className="flex items-center justify-between border-b border-white/10 pb-3">
                <div className="flex items-center gap-2">
                  <GraduationCap className="w-5 h-5 text-emerald-400" />
                  <div>
                    <span className="font-bold text-white text-sm">Student Delegates</span>
                    <span className="text-[10px] text-neutral-400 block">Age $\le$ 18 Years &bull; High School / Under-18</span>
                  </div>
                </div>
                <span className="text-[10px] font-mono px-2 py-0.5 rounded font-bold bg-emerald-500/20 text-emerald-300 border border-emerald-500/40">
                  0% GST EXEMPT
                </span>
              </div>

              {/* Number of Students */}
              <div className="space-y-2">
                <div className="flex items-center justify-between text-xs font-mono">
                  <span className="text-neutral-400 font-sans">Number of Students:</span>
                  <div className="flex items-center gap-1.5">
                    <input
                      type="number"
                      min={0}
                      max={10000}
                      value={studentCount}
                      onChange={(e) => setStudentCount(Math.max(0, parseInt(e.target.value) || 0))}
                      className="w-20 px-2 py-1 rounded-lg bg-black border border-white/20 text-right text-emerald-400 font-bold focus:outline-none focus:border-emerald-400 text-xs"
                    />
                    <span className="text-neutral-400">seats</span>
                  </div>
                </div>
                <input
                  type="range"
                  min="0"
                  max="2000"
                  step="10"
                  value={studentCount}
                  onChange={(e) => setStudentCount(Number(e.target.value))}
                  className="w-full accent-emerald-400 cursor-pointer"
                />
                <div className="flex items-center gap-1.5 pt-1">
                  {[0, 100, 250, 400, 600, 1000].map((num) => (
                    <button
                      key={num}
                      type="button"
                      onClick={() => setStudentCount(num)}
                      className={`px-2 py-0.5 rounded-lg text-[10px] font-mono transition cursor-pointer ${
                        studentCount === num
                          ? 'bg-emerald-400 text-black font-bold'
                          : 'bg-white/5 text-neutral-400 hover:text-white'
                      }`}
                    >
                      {num}
                    </button>
                  ))}
                </div>
              </div>

              {/* Student Base Fee */}
              <div className="space-y-2 pt-2 border-t border-white/5">
                <div className="flex items-center justify-between text-xs font-mono">
                  <span className="text-neutral-400 font-sans">Student Pass Fee:</span>
                  <div className="flex items-center gap-1">
                    <span className="text-neutral-400">₹</span>
                    <input
                      type="number"
                      min={0}
                      max={50000}
                      step={50}
                      value={studentTicketPrice}
                      onChange={(e) => setStudentTicketPrice(Math.max(0, parseInt(e.target.value) || 0))}
                      className="w-24 px-2 py-1 rounded-lg bg-black border border-white/20 text-right text-white font-bold focus:outline-none focus:border-emerald-400 text-xs"
                    />
                  </div>
                </div>
                <input
                  type="range"
                  min="0"
                  max="5000"
                  step="50"
                  value={studentTicketPrice}
                  onChange={(e) => setStudentTicketPrice(Number(e.target.value))}
                  className="w-full accent-emerald-400 cursor-pointer"
                />
              </div>

              {/* Student Financial Summary Pill */}
              <div className="p-3 rounded-2xl bg-black/60 border border-white/10 flex items-center justify-between text-xs font-mono">
                <div>
                  <span className="text-[10px] text-neutral-500 block">Student Gross:</span>
                  <span className="text-white font-bold text-sm">₹{studentGross.toLocaleString()}</span>
                </div>
                <div className="text-right">
                  <span className="text-[10px] text-neutral-500 block">Student GST (0%):</span>
                  <span className="text-emerald-400 font-bold">₹0 (Exempt)</span>
                </div>
              </div>
            </div>

            {/* AUDIENCE 2: NORMAL PEOPLE / OVER 18 */}
            <div className="p-5 rounded-3xl bg-[#090b12] border border-amber-500/30 space-y-4">
              <div className="flex items-center justify-between border-b border-white/10 pb-3">
                <div className="flex items-center gap-2">
                  <Users className="w-5 h-5 text-amber-400" />
                  <div>
                    <span className="font-bold text-white text-sm">Normal Attendees</span>
                    <span className="text-[10px] text-neutral-400 block">Age &gt; 18 Years &bull; University / Public / Faculty</span>
                  </div>
                </div>
                <span className="text-[10px] font-mono px-2 py-0.5 rounded font-bold bg-amber-500/20 text-amber-300 border border-amber-500/40">
                  6% GST APPLICABLE
                </span>
              </div>

              {/* Number of Normal People */}
              <div className="space-y-2">
                <div className="flex items-center justify-between text-xs font-mono">
                  <span className="text-neutral-400 font-sans">Number of Normal People:</span>
                  <div className="flex items-center gap-1.5">
                    <input
                      type="number"
                      min={0}
                      max={10000}
                      value={normalCount}
                      onChange={(e) => setNormalCount(Math.max(0, parseInt(e.target.value) || 0))}
                      className="w-20 px-2 py-1 rounded-lg bg-black border border-white/20 text-right text-amber-400 font-bold focus:outline-none focus:border-amber-400 text-xs"
                    />
                    <span className="text-neutral-400">seats</span>
                  </div>
                </div>
                <input
                  type="range"
                  min="0"
                  max="2000"
                  step="10"
                  value={normalCount}
                  onChange={(e) => setNormalCount(Number(e.target.value))}
                  className="w-full accent-amber-400 cursor-pointer"
                />
                <div className="flex items-center gap-1.5 pt-1">
                  {[0, 50, 100, 200, 400, 800].map((num) => (
                    <button
                      key={num}
                      type="button"
                      onClick={() => setNormalCount(num)}
                      className={`px-2 py-0.5 rounded-lg text-[10px] font-mono transition cursor-pointer ${
                        normalCount === num
                          ? 'bg-amber-400 text-black font-bold'
                          : 'bg-white/5 text-neutral-400 hover:text-white'
                      }`}
                    >
                      {num}
                    </button>
                  ))}
                </div>
              </div>

              {/* Normal Attendee Base Fee */}
              <div className="space-y-2 pt-2 border-t border-white/5">
                <div className="flex items-center justify-between text-xs font-mono">
                  <span className="text-neutral-400 font-sans">General Pass Fee:</span>
                  <div className="flex items-center gap-1">
                    <span className="text-neutral-400">₹</span>
                    <input
                      type="number"
                      min={0}
                      max={50000}
                      step={50}
                      value={normalTicketPrice}
                      onChange={(e) => setNormalTicketPrice(Math.max(0, parseInt(e.target.value) || 0))}
                      className="w-24 px-2 py-1 rounded-lg bg-black border border-white/20 text-right text-white font-bold focus:outline-none focus:border-amber-400 text-xs"
                    />
                  </div>
                </div>
                <input
                  type="range"
                  min="0"
                  max="10000"
                  step="50"
                  value={normalTicketPrice}
                  onChange={(e) => setNormalTicketPrice(Number(e.target.value))}
                  className="w-full accent-amber-400 cursor-pointer"
                />
              </div>

              {/* Normal Financial Summary Pill */}
              <div className="p-3 rounded-2xl bg-black/60 border border-white/10 flex items-center justify-between text-xs font-mono">
                <div>
                  <span className="text-[10px] text-neutral-500 block">General Gross:</span>
                  <span className="text-white font-bold text-sm">₹{normalGross.toLocaleString()}</span>
                </div>
                <div className="text-right">
                  <span className="text-[10px] text-neutral-500 block">Normal GST (6%):</span>
                  <span className="text-amber-300 font-bold">₹{Math.round(normalGstAmount).toLocaleString()}</span>
                </div>
              </div>
            </div>
          </div>

          {/* ── SECTION 2: PLATFORM PROTOCOLS & ESCROW PARAMS ── */}
          <div className="p-5 rounded-3xl bg-black/60 border border-white/10 space-y-4 font-mono text-xs">
            <div className="flex items-center justify-between border-b border-white/10 pb-3">
              <span className="text-white font-bold uppercase tracking-wider flex items-center gap-2">
                <Scale className="w-4 h-4 text-cyan-400" />
                <span>Protocol Parameters &bull; Fees &amp; Escrow Mandate</span>
              </span>
              <span className="text-[10px] text-neutral-400">INSTANT SETTLEMENT ENGINE</span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              {/* Attendee Convenience Fee Tier */}
              <div className="space-y-1.5">
                <label className="text-[10px] text-neutral-400 uppercase font-bold">Attendee Convenience Tier</label>
                <div className="grid grid-cols-3 gap-1">
                  {[
                    { id: 'standard', label: 'Standard (₹29)' },
                    { id: 'pass', label: 'Pulse (₹15)' },
                    { id: 'elite', label: 'Elite (₹0)' },
                  ].map((t) => (
                    <button
                      key={t.id}
                      type="button"
                      onClick={() => setAttendeeTier(t.id as any)}
                      className={`p-2 rounded-xl text-[10px] font-bold transition text-center cursor-pointer ${
                        attendeeTier === t.id
                          ? 'bg-cyan-500 text-black shadow'
                          : 'bg-white/5 text-neutral-400 hover:text-white'
                      }`}
                    >
                      {t.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Host Commission Tier */}
              <div className="space-y-1.5">
                <label className="text-[10px] text-neutral-400 uppercase font-bold">Host Take-Rate Tier</label>
                <div className="grid grid-cols-3 gap-1">
                  {[
                    { id: 'standard', label: '1.5% Standard' },
                    { id: 'pro', label: '0.75% Pro' },
                    { id: 'institutional', label: '0% Summit' },
                  ].map((t) => (
                    <button
                      key={t.id}
                      type="button"
                      onClick={() => setHostTier(t.id as any)}
                      className={`p-2 rounded-xl text-[10px] font-bold transition text-center cursor-pointer ${
                        hostTier === t.id
                          ? 'bg-emerald-400 text-black shadow'
                          : 'bg-white/5 text-neutral-400 hover:text-white'
                      }`}
                    >
                      {t.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Constitutional Escrow Percentage */}
              <div className="space-y-1.5">
                <div className="flex items-center justify-between text-[10px]">
                  <label className="text-neutral-400 uppercase font-bold">Escrow Holdback</label>
                  <span className="text-amber-400 font-bold">{escrowPercentage}% Reserve</span>
                </div>
                <div className="grid grid-cols-3 gap-1">
                  {[5, 10, 15].map((pct) => (
                    <button
                      key={pct}
                      type="button"
                      onClick={() => setEscrowPercentage(pct)}
                      className={`p-2 rounded-xl text-[10px] font-bold transition text-center cursor-pointer ${
                        escrowPercentage === pct
                          ? 'bg-amber-400 text-black shadow'
                          : 'bg-white/5 text-neutral-400 hover:text-white'
                      }`}
                    >
                      {pct}% {pct === 10 ? '(Const.)' : ''}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Cashfree PG Toggle */}
            <div className="flex items-center justify-between pt-2 border-t border-white/5 text-[11px]">
              <label className="flex items-center gap-2 cursor-pointer text-neutral-300">
                <input
                  type="checkbox"
                  checked={includeCashfreeFee}
                  onChange={(e) => setIncludeCashfreeFee(e.target.checked)}
                  className="w-4 h-4 rounded bg-black border-white/20 text-emerald-500 focus:ring-0 cursor-pointer"
                />
                <span>Include Cashfree Payment Gateway processing fee (1.95% + 18% GST on PG service = 2.301%)</span>
              </label>

              <span className="text-neutral-400 text-[10px]">
                {includeCashfreeFee ? `Est. PG Cost: ₹${Math.round(totalPgFees).toLocaleString()}` : 'Direct UPI Free / Waived'}
              </span>
            </div>
          </div>

          {/* ── SECTION 3: COMPREHENSIVE SETTLEMENT LEDGER CARD ── */}
          <div className="p-6 rounded-3xl bg-gradient-to-br from-[#060a10] via-[#090e17] to-[#040f1a] border border-emerald-500/40 space-y-5 shadow-[0_0_40px_rgba(16,185,129,0.12)]">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-white/10 pb-4">
              <div>
                <span className="font-mono text-[10px] text-emerald-400 font-bold uppercase tracking-widest block">
                  NET DISBURSEMENT LEDGER // UTR BANK SETTLEMENT
                </span>
                <span className="text-xl sm:text-2xl font-display font-extrabold text-white">
                  ₹{Math.round(netOrganizerTotal).toLocaleString()} Net Realized
                </span>
              </div>

              <div className="flex items-center gap-3 font-mono text-xs">
                <div className="text-right">
                  <span className="text-[10px] text-neutral-400 block">Total Collections (GMV)</span>
                  <span className="text-white font-bold">₹{grossGMV.toLocaleString()}</span>
                </div>
                <div className="text-right">
                  <span className="text-[10px] text-neutral-400 block">Total Registered</span>
                  <span className="text-cyan-300 font-bold">{totalAttendees.toLocaleString()} Seats</span>
                </div>
              </div>
            </div>

            {/* 4 Core Financial Pillar Cards */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 font-mono">
              <div className="p-3.5 rounded-2xl bg-black/50 border border-white/10 space-y-1">
                <span className="text-[10px] text-neutral-400 uppercase block">Immediate T+1 Bank Transfer</span>
                <div className="text-lg font-bold text-emerald-400">₹{Math.round(immediateT1Payout).toLocaleString()}</div>
                <span className="text-[9px] text-neutral-500">{100 - escrowPercentage}% initial advance</span>
              </div>

              <div className="p-3.5 rounded-2xl bg-black/50 border border-white/10 space-y-1">
                <span className="text-[10px] text-neutral-400 uppercase block">Post-Event Escrow Release</span>
                <div className="text-lg font-bold text-amber-300">₹{Math.round(postEventEscrowRelease).toLocaleString()}</div>
                <span className="text-[9px] text-neutral-500">{escrowPercentage}% reserve released</span>
              </div>

              <div className="p-3.5 rounded-2xl bg-black/50 border border-white/10 space-y-1">
                <span className="text-[10px] text-neutral-400 uppercase block">Total GST Collected</span>
                <div className="text-lg font-bold text-amber-400">₹{Math.round(totalGstCollected).toLocaleString()}</div>
                <span className="text-[9px] text-neutral-500">Effective: {effectiveGstRate.toFixed(2)}%</span>
              </div>

              <div className="p-3.5 rounded-2xl bg-black/50 border border-white/10 space-y-1">
                <span className="text-[10px] text-neutral-400 uppercase block">Net Take-Home / Seat</span>
                <div className="text-lg font-bold text-cyan-300">₹{netTakeHomePerSeat.toLocaleString()}</div>
                <span className="text-[9px] text-neutral-500">Blended yield per delegate</span>
              </div>
            </div>

            {/* Tabular Line-Item Breakdown */}
            <div className="p-4 rounded-2xl bg-black/70 border border-white/10 space-y-2 font-mono text-xs">
              <span className="text-[10px] uppercase font-bold text-neutral-400 block border-b border-white/10 pb-1.5">
                Detailed Transaction Line-Item Ledger
              </span>

              <div className="space-y-1.5 text-[11px]">
                <div className="flex items-center justify-between text-neutral-300">
                  <span>(+) Student Pass Collections ({studentCount} @ ₹{studentTicketPrice.toLocaleString()} &bull; 0% GST)</span>
                  <span className="font-bold text-white">₹{studentGross.toLocaleString()}</span>
                </div>
                <div className="flex items-center justify-between text-neutral-300">
                  <span>(+) General Attendee Collections ({normalCount} @ ₹{normalTicketPrice.toLocaleString()})</span>
                  <span className="font-bold text-white">₹{normalGross.toLocaleString()}</span>
                </div>
                <div className="flex items-center justify-between text-amber-300">
                  <span>(+) 6% GST Collected on General Attendees</span>
                  <span className="font-bold">₹{Math.round(normalGstAmount).toLocaleString()}</span>
                </div>
                <div className="flex items-center justify-between text-emerald-400">
                  <span>(+) 0% GST Collected on Students (Empowerment Exemption)</span>
                  <span className="font-bold">₹0.00</span>
                </div>

                <div className="border-t border-white/10 pt-1.5 flex items-center justify-between text-white font-bold">
                  <span>Total Gross Attendee Outlay</span>
                  <span>₹{Math.round(totalAttendeeOutlay).toLocaleString()}</span>
                </div>

                <div className="flex items-center justify-between text-rose-400 pt-1">
                  <span>(-) Cashfree Payment Gateway Processing ({includeCashfreeFee ? '2.301%' : '0%'})</span>
                  <span>-₹{Math.round(totalPgFees).toLocaleString()}</span>
                </div>
                <div className="flex items-center justify-between text-cyan-400">
                  <span>(-) Platform Commission Host Take-Rate ({(hostCommissionRate * 100).toFixed(2)}%)</span>
                  <span>-₹{Math.round(hostPlatformCommission).toLocaleString()}</span>
                </div>
                <div className="flex items-center justify-between text-neutral-400">
                  <span>(-) GST Remittance to Authorities (Pass-Through)</span>
                  <span>-₹{Math.round(totalGstCollected).toLocaleString()}</span>
                </div>

                <div className="border-t border-white/20 pt-2 flex items-center justify-between text-emerald-300 text-sm font-bold">
                  <span>(=) Final Net Organizer Bank Payout</span>
                  <span>₹{Math.round(netOrganizerTotal).toLocaleString()}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Micro-Grant Escrow Notice */}
          <div className="p-4 rounded-2xl bg-white/[0.02] border border-white/10 flex items-start gap-3">
            <Sparkles className="w-5 h-5 text-amber-400 shrink-0 mt-0.5" />
            <div className="text-xs text-neutral-300 leading-relaxed font-sans">
              <strong className="text-white font-mono">Constitutional Escrow Mandate:</strong> Student registrations are protected under ZENVITRA Article 12, ensuring all students under 18 pay 0% tax. Payout settlements are executed via Cashfree Payouts directly to verified organizer bank accounts via UTR bank rail with T+1 settlement speed.
            </div>
          </div>

        </div>
      </div>

      {/* Dedicated Custom Model Builder Modal */}
      <CustomModelBuilderModal
        isOpen={isCustomBuilderOpen}
        onClose={() => setIsCustomBuilderOpen(false)}
        onApplyModel={handleApplyCustomModel}
        initialModel={{
          name: 'My Custom Conference Model',
          students: studentCount,
          studentPrice: studentTicketPrice,
          normal: normalCount,
          normalPrice: normalTicketPrice,
          hostTier,
          attendeeTier,
          escrowPercent: escrowPercentage,
        }}
      />
    </div>
  );
}
