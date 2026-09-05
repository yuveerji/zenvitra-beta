'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import QRCode from 'qrcode';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Heart, 
  ExternalLink, 
  ShieldCheck, 
  AlertCircle, 
  Globe2, 
  Building2, 
  ArrowLeft,
  CheckCircle2, 
  Lock,
  Copy,
  Check,
  QrCode,
  Calculator,
  Landmark,
  Radio,
  Sparkles,
  ArrowRight,
  TrendingUp,
  Activity,
  Ambulance,
  Tent,
  Utensils,
  HelpCircle,
  FileText,
  BadgeAlert
} from 'lucide-react';
import { Navbar } from '@/components/layout/Navbar';
import { Footer } from '@/components/layout/Footer';

interface BankAccountInfo {
  bankName: string;
  accountName: string;
  accountNumber: string;
  swiftCode: string;
  branch: string;
  currency: string;
  badge: string;
}

const OFFICIAL_BANK_ACCOUNTS: BankAccountInfo[] = [
  {
    bankName: 'Rastriya Banijya Bank Ltd. (RBB)',
    accountName: 'Prime Minister Disaster Relief Fund',
    accountNumber: '1130100003762001',
    swiftCode: 'RBBANPKA',
    branch: 'Singhadurbar Branch, Kathmandu',
    currency: 'NPR / Foreign Rails',
    badge: 'STATE TREASURY MAIN'
  },
  {
    bankName: 'Nepal Bank Limited (NBL)',
    accountName: 'Prime Minister Disaster Relief Fund',
    accountNumber: '00211600510039000003',
    swiftCode: 'NEBLNPKA',
    branch: 'Kathmandu Main Banking Branch',
    currency: 'NPR',
    badge: 'CENTRAL STATE RESERVE'
  },
  {
    bankName: 'Himalayan Bank Ltd. (USD / International)',
    accountName: 'Prime Minister Disaster Relief Fund',
    accountNumber: '01905631210046',
    swiftCode: 'HIMANPKA',
    branch: 'Corporate Branch, Kathmandu',
    currency: 'USD / International Wire',
    badge: 'INTERNATIONAL USD SWIFT'
  }
];

const RELIEF_SECTORS = [
  {
    icon: Ambulance,
    title: 'Emergency Medical & Trauma',
    allocation: '40%',
    color: 'from-red-500 to-rose-600',
    borderColor: 'border-red-500/30',
    textColor: 'text-red-400',
    description: 'Critical surgical kits, field triage medicines, ambulance fuel, and mobile orthopedic units.'
  },
  {
    icon: Tent,
    title: 'Shelter & Winterization',
    allocation: '30%',
    color: 'from-amber-500 to-orange-600',
    borderColor: 'border-amber-500/30',
    textColor: 'text-amber-400',
    description: 'High-altitude all-weather family tents, insulated sleeping mats, waterproof tarpaulins, and stoves.'
  },
  {
    icon: Utensils,
    title: 'Food Security & Potable Water',
    allocation: '20%',
    color: 'from-emerald-500 to-teal-600',
    borderColor: 'border-emerald-500/30',
    textColor: 'text-emerald-400',
    description: 'Nutritional food grain packets, infant formula, chlorine purification units, and clean water tankers.'
  },
  {
    icon: Building2,
    title: 'Civic Reconstruction',
    allocation: '10%',
    color: 'from-cyan-500 to-blue-600',
    borderColor: 'border-cyan-500/30',
    textColor: 'text-cyan-400',
    description: 'Restoring destroyed public school classrooms, rural clinic roofs, and community water pipes.'
  }
];

export default function DonateNepalPage() {
  const OFFICIAL_PORTAL_URL = 'https://pmdrf.nchl.com.np/';

  const [activeTab, setActiveTab] = useState<'portal' | 'bank_wire' | 'qr_scan' | 'calculator'>('portal');
  const [copiedKey, setCopiedKey] = useState<string | null>(null);
  const [qrDataUrl, setQrDataUrl] = useState<string>('');

  // Currency Calculator State
  const [calcCurrency, setCalcCurrency] = useState<'USD' | 'INR' | 'EUR' | 'GBP'>('USD');
  const [calcAmount, setCalcAmount] = useState<number>(50);

  useEffect(() => {
    QRCode.toDataURL(OFFICIAL_PORTAL_URL, {
      width: 480,
      margin: 1,
      color: {
        dark: '#000000',
        light: '#ffffff'
      },
      errorCorrectionLevel: 'H'
    })
      .then((url) => setQrDataUrl(url))
      .catch((err) => console.error('Failed to generate PMDRF QR code', err));
  }, []);

  const FX_RATES: Record<string, number> = {
    USD: 134.8,
    INR: 1.6,
    EUR: 146.2,
    GBP: 172.5
  };

  const convertedNPR = Math.round(calcAmount * (FX_RATES[calcCurrency] || 134.8));

  const handleCopy = (text: string, key: string) => {
    if (typeof navigator !== 'undefined') {
      navigator.clipboard.writeText(text);
      setCopiedKey(key);
      setTimeout(() => setCopiedKey(null), 2500);
    }
  };

  return (
    <div className="min-h-screen bg-[#06070a] text-white selection:bg-red-500/30 relative overflow-hidden font-sans flex flex-col justify-between">
      <Navbar />

      {/* ─── AMBIENT ATMOSPHERIC BACKGROUND ─── */}
      <div className="fixed inset-0 pointer-events-none z-0">
        <div className="absolute -top-40 left-1/2 -translate-x-1/2 w-[850px] h-[550px] bg-red-600/15 blur-[160px] rounded-full animate-pulse" />
        <div className="absolute top-1/3 -right-40 w-[600px] h-[600px] bg-blue-600/10 blur-[160px] rounded-full" />
        <div className="absolute -bottom-40 -left-40 w-[500px] h-[500px] bg-amber-600/10 blur-[160px] rounded-full" />
      </div>

      <main className="relative z-10 max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 pt-32 pb-24 w-full flex-1 space-y-12">
        
        {/* Navigation Breadcrumb & Live Radar */}
        <div className="flex flex-wrap items-center justify-between gap-4">
          <Link
            href="/"
            className="inline-flex items-center gap-2 text-xs font-mono tracking-wider uppercase text-neutral-400 hover:text-white transition-colors group"
          >
            <ArrowLeft className="w-3.5 h-3.5 group-hover:-translate-x-1 transition-transform" />
            <span>Back to Ecosystem</span>
          </Link>

          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-red-500/10 border border-red-500/30 text-red-400 text-xs font-mono">
            <span className="w-2 h-2 rounded-full bg-red-500 animate-ping" />
            <span className="font-bold">LIVE STATE EMERGENCY RELIEF CHANNEL // 0.00% INTERMEDIARY DEDUCTIONS</span>
          </div>
        </div>

        {/* ─── HERO HEADER ─── */}
        <div className="space-y-4 text-left max-w-4xl">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-2xl bg-white/[0.04] border border-white/10 text-xs font-mono text-neutral-300">
            <Landmark className="w-3.5 h-3.5 text-red-400" />
            <span>Government of Nepal • Office of the Prime Minister</span>
          </div>

          <h1 className="text-3xl sm:text-6xl font-black tracking-tight leading-[1.1] font-display">
            Nepal Disaster Relief <br />
            <span className="bg-gradient-to-r from-red-400 via-rose-300 to-amber-200 bg-clip-text text-transparent">
              Direct Aid Protocol (PMDRF)
            </span>
          </h1>

          <p className="text-sm sm:text-lg text-neutral-300 max-w-3xl leading-relaxed font-light">
            Providing urgent medical supplies, winterized shelters, and food relief to flood, landslide, and earthquake-affected communities across Nepal. Contributions route strictly into official state escrow without third-party commission.
          </p>
        </div>

        {/* ─── QUICK METRICS BANNER ─── */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3.5">
          <div className="p-4 rounded-2xl bg-white/[0.02] border border-white/10 text-left space-y-1">
            <p className="text-[10px] font-mono uppercase tracking-widest text-neutral-400 font-semibold">STATE OPERATOR</p>
            <p className="text-sm sm:text-base font-bold text-white">PMDRF Nepal</p>
            <p className="text-[11px] text-emerald-400 font-mono">Direct Gov Escrow</p>
          </div>
          <div className="p-4 rounded-2xl bg-white/[0.02] border border-white/10 text-left space-y-1">
            <p className="text-[10px] font-mono uppercase tracking-widest text-neutral-400 font-semibold">GATEWAY RAIL</p>
            <p className="text-sm sm:text-base font-bold text-white">NCHL connectIPS</p>
            <p className="text-[11px] text-cyan-400 font-mono">Cards & International</p>
          </div>
          <div className="p-4 rounded-2xl bg-white/[0.02] border border-white/10 text-left space-y-1">
            <p className="text-[10px] font-mono uppercase tracking-widest text-neutral-400 font-semibold">ZENVITRA CUT</p>
            <p className="text-sm sm:text-base font-bold text-emerald-400">0.00% ZERO FEE</p>
            <p className="text-[11px] text-neutral-400 font-mono">100% Direct to Victims</p>
          </div>
          <div className="p-4 rounded-2xl bg-white/[0.02] border border-white/10 text-left space-y-1">
            <p className="text-[10px] font-mono uppercase tracking-widest text-neutral-400 font-semibold">RECEIPT STATUS</p>
            <p className="text-sm sm:text-base font-bold text-white">Instant State Tax ID</p>
            <p className="text-[11px] text-amber-400 font-mono">Cryptographically Audited</p>
          </div>
        </div>

        {/* ─── DYNAMIC INTERACTIVE ACTION CONSOLE ─── */}
        <div className="bg-[#090a0f]/90 border border-white/15 rounded-3xl p-6 sm:p-8 shadow-[0_20px_80px_rgba(0,0,0,0.8)] backdrop-blur-2xl space-y-8 relative overflow-hidden text-left">
          
          {/* Top Rainbow Accent Line */}
          <div className="absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-red-500 via-rose-500 to-amber-500" />

          {/* Navigation Mode Tabs */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-1 p-1 bg-black/60 rounded-2xl border border-white/10 text-xs font-mono select-none">
            <button
              type="button"
              onClick={() => setActiveTab('portal')}
              className={`py-3 px-3 rounded-xl font-bold transition flex items-center justify-center gap-2 cursor-pointer ${
                activeTab === 'portal'
                  ? 'bg-red-600 text-white shadow-[0_0_20px_rgba(220,38,38,0.4)]'
                  : 'text-neutral-400 hover:text-white hover:bg-white/5'
              }`}
            >
              <Building2 className="w-3.5 h-3.5" />
              <span>Official Portal</span>
            </button>

            <button
              type="button"
              onClick={() => setActiveTab('bank_wire')}
              className={`py-3 px-3 rounded-xl font-bold transition flex items-center justify-center gap-2 cursor-pointer ${
                activeTab === 'bank_wire'
                  ? 'bg-cyan-500 text-black shadow-[0_0_20px_rgba(6,182,212,0.4)]'
                  : 'text-neutral-400 hover:text-white hover:bg-white/5'
              }`}
            >
              <Landmark className="w-3.5 h-3.5" />
              <span>Bank Wire Details</span>
            </button>

            <button
              type="button"
              onClick={() => setActiveTab('qr_scan')}
              className={`py-3 px-3 rounded-xl font-bold transition flex items-center justify-center gap-2 cursor-pointer ${
                activeTab === 'qr_scan'
                  ? 'bg-amber-400 text-black shadow-[0_0_20px_rgba(251,191,36,0.4)]'
                  : 'text-neutral-400 hover:text-white hover:bg-white/5'
              }`}
            >
              <QrCode className="w-3.5 h-3.5" />
              <span>Instant QR Code</span>
            </button>

            <button
              type="button"
              onClick={() => setActiveTab('calculator')}
              className={`py-3 px-3 rounded-xl font-bold transition flex items-center justify-center gap-2 cursor-pointer ${
                activeTab === 'calculator'
                  ? 'bg-emerald-400 text-black shadow-[0_0_20px_rgba(52,211,153,0.4)]'
                  : 'text-neutral-400 hover:text-white hover:bg-white/5'
              }`}
            >
              <Calculator className="w-3.5 h-3.5" />
              <span>Impact Calculator</span>
            </button>
          </div>

          {/* ── TAB 1: OFFICIAL DIGITAL GATEWAY (NCHL PMDRF) ── */}
          {activeTab === 'portal' && (
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
              <div className="lg:col-span-7 space-y-5">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-2xl bg-red-500/10 border border-red-500/30 flex items-center justify-center text-red-400 shadow-[0_0_20px_rgba(239,68,68,0.2)]">
                    <Building2 className="w-6 h-6" />
                  </div>
                  <div>
                    <h3 className="text-lg font-bold text-white">Government of Nepal PMDRF Digital Portal</h3>
                    <p className="text-xs text-neutral-400 font-mono">Managed by Nepal Clearing House Limited (NCHL)</p>
                  </div>
                </div>

                <p className="text-xs sm:text-sm text-neutral-300 leading-relaxed font-light">
                  The National Payment Gateway allows donors worldwide to contribute securely via International Credit/Debit Cards, connectIPS, eSewa, Khalti, IME Pay, or direct swift banking. 
                </p>

                <div className="p-4 rounded-2xl bg-white/[0.02] border border-white/10 space-y-2.5 font-mono text-xs">
                  <div className="flex justify-between py-1 border-b border-white/5">
                    <span className="text-neutral-400">Official Beneficiary</span>
                    <span className="text-white font-semibold text-right">Prime Minister&apos;s Disaster Relief Fund</span>
                  </div>
                  <div className="flex justify-between py-1 border-b border-white/5">
                    <span className="text-neutral-400">Escrow Security</span>
                    <span className="text-emerald-400 font-semibold">256-Bit Gov TLS Escrow</span>
                  </div>
                  <div className="flex justify-between py-1">
                    <span className="text-neutral-400">Accepted Currencies</span>
                    <span className="text-white">NPR, USD, INR, EUR, GBP, AUD, CAD</span>
                  </div>
                </div>

                <a
                  href={OFFICIAL_PORTAL_URL}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group relative flex items-center justify-center gap-3 w-full py-4 px-6 rounded-2xl bg-gradient-to-r from-red-600 via-rose-600 to-red-500 hover:from-red-500 hover:to-rose-500 text-white font-bold text-sm tracking-wide transition shadow-[0_0_30px_rgba(225,29,72,0.4)] active:scale-[0.98] cursor-pointer"
                >
                  <Heart className="w-4 h-4 fill-white group-hover:scale-125 transition-transform" />
                  <span>Launch Official PMDRF Portal (pmdrf.nchl.com.np)</span>
                  <ExternalLink className="w-4 h-4 text-white/80 group-hover:translate-x-1 transition-transform" />
                </a>
              </div>

              <div className="lg:col-span-5 p-6 rounded-2xl bg-black/40 border border-white/10 space-y-4">
                <h4 className="text-xs font-mono font-bold text-neutral-300 uppercase tracking-wider flex items-center gap-2">
                  <ShieldCheck className="w-4 h-4 text-emerald-400" />
                  <span>Verification & Authenticity Checklist</span>
                </h4>
                <ul className="space-y-3 text-xs text-neutral-300 font-light leading-relaxed">
                  <li className="flex items-start gap-2.5">
                    <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                    <span><strong>100% Direct State Account:</strong> No NGO overheads or administrative cuts.</span>
                  </li>
                  <li className="flex items-start gap-2.5">
                    <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                    <span><strong>Audit Trail:</strong> Audited by the Office of the Auditor General, Nepal.</span>
                  </li>
                  <li className="flex items-start gap-2.5">
                    <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                    <span><strong>Tax Receipt:</strong> Downloadable PDF receipt issued upon successful payment.</span>
                  </li>
                </ul>
              </div>
            </div>
          )}

          {/* ── TAB 2: OFFICIAL DIRECT BANK WIRE DETAILS ── */}
          {activeTab === 'bank_wire' && (
            <div className="space-y-5">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-3 border-b border-white/10">
                <div>
                  <h3 className="text-base font-bold text-white">Direct Government Bank Wire Accounts (OPMCM Gazetted)</h3>
                  <p className="text-xs text-neutral-400 font-mono">Official State accounts for RTGS, NEFT, IMPS & international SWIFT wire transfers directly to Nepal</p>
                </div>
                <span className="text-[11px] font-mono text-cyan-400 bg-cyan-500/10 px-3 py-1 rounded-full border border-cyan-500/30 font-bold flex items-center gap-1">
                  <ShieldCheck className="w-3.5 h-3.5" />
                  GOVT GAZETTE VERIFIED
                </span>
              </div>

              {/* Official Anti-Fraud Security Notice */}
              <div className="p-3.5 rounded-2xl bg-amber-500/10 border border-amber-500/30 flex items-start gap-3 text-xs text-amber-200">
                <AlertCircle className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
                <div className="space-y-0.5">
                  <p className="font-bold text-amber-300">Official Government Advisory on Donor Safety:</p>
                  <p className="text-[11px] text-amber-200/80 leading-relaxed">
                    Always ensure that the recipient account name appears strictly as <strong className="text-white font-mono">&quot;Prime Minister Disaster Relief Fund&quot;</strong> on your banking portal before confirming any transfer. Official notices are cross-verified with <em>opmcm.gov.np</em> and <em>nchl.com.np</em>.
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {OFFICIAL_BANK_ACCOUNTS.map((bank) => (
                  <div
                    key={bank.bankName}
                    className="p-5 rounded-2xl bg-white/[0.02] border border-white/10 hover:border-cyan-500/40 transition-all space-y-3.5 relative group"
                  >
                    <div className="flex items-center justify-between">
                      <span className="text-[9px] font-mono font-bold px-2 py-0.5 rounded bg-cyan-500/10 text-cyan-300 border border-cyan-500/20">
                        {bank.badge}
                      </span>
                      <Building2 className="w-4 h-4 text-neutral-500 group-hover:text-cyan-400 transition-colors" />
                    </div>

                    <div>
                      <h4 className="font-bold text-sm text-white">{bank.bankName}</h4>
                      <p className="text-[11px] text-neutral-400 font-mono">{bank.branch}</p>
                    </div>

                    <div className="space-y-2 pt-2 border-t border-white/5 font-mono text-xs">
                      <div>
                        <span className="text-[10px] text-neutral-500 block">ACCOUNT NUMBER</span>
                        <div className="flex items-center justify-between mt-0.5 bg-black/50 p-2 rounded-xl border border-white/10">
                          <span className="font-bold text-emerald-400 tracking-wider text-xs">{bank.accountNumber}</span>
                          <button
                            type="button"
                            onClick={() => handleCopy(bank.accountNumber, `acc_${bank.bankName}`)}
                            className="p-1 rounded text-neutral-400 hover:text-white cursor-pointer"
                            title="Copy Account Number"
                          >
                            {copiedKey === `acc_${bank.bankName}` ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                          </button>
                        </div>
                      </div>

                      <div>
                        <span className="text-[10px] text-neutral-500 block">SWIFT CODE (INTERNATIONAL)</span>
                        <div className="flex items-center justify-between mt-0.5 bg-black/50 p-2 rounded-xl border border-white/10">
                          <span className="font-bold text-cyan-300 tracking-wider text-xs">{bank.swiftCode}</span>
                          <button
                            type="button"
                            onClick={() => handleCopy(bank.swiftCode, `swift_${bank.bankName}`)}
                            className="p-1 rounded text-neutral-400 hover:text-white cursor-pointer"
                            title="Copy SWIFT Code"
                          >
                            {copiedKey === `swift_${bank.bankName}` ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* ── TAB 3: INSTANT QR CODE SCANNER ── */}
          {activeTab === 'qr_scan' && (
            <div className="flex flex-col md:flex-row items-center justify-center gap-8 py-4">
              <div className="p-5 rounded-3xl bg-white shadow-[0_0_60px_rgba(255,255,255,0.25)] shrink-0 flex flex-col items-center max-w-[270px] border-2 border-white">
                {/* Working High-Res QR Code Image */}
                <div className="w-56 h-56 bg-white rounded-2xl flex items-center justify-center relative overflow-hidden">
                  {qrDataUrl ? (
                    <div className="relative w-full h-full flex items-center justify-center">
                      <img
                        src={qrDataUrl}
                        alt="Government of Nepal Official PMDRF Portal Scannable QR Code"
                        className="w-full h-full object-contain rounded-xl"
                      />
                      {/* Centered Sovereign Emblem Badge */}
                      <div className="absolute inset-0 m-auto w-11 h-11 rounded-xl bg-red-600 border-2 border-white flex items-center justify-center text-white font-bold text-[9px] shadow-xl font-display pointer-events-none">
                        PMDRF
                      </div>
                    </div>
                  ) : (
                    <div className="flex flex-col items-center justify-center text-neutral-400 gap-2">
                      <div className="w-6 h-6 border-2 border-red-500 border-t-transparent rounded-full animate-spin" />
                      <span className="text-[10px] font-mono">Generating Official QR...</span>
                    </div>
                  )}
                </div>
                <div className="text-center mt-3 space-y-0.5">
                  <span className="text-[11px] font-mono font-bold text-black block tracking-tight">
                    PMDRF.NCHL.COM.NP
                  </span>
                  <span className="text-[9px] font-mono text-neutral-500 block uppercase font-semibold">
                    100% Verified State Gateway
                  </span>
                </div>
              </div>

              <div className="space-y-4 max-w-md text-left">
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-400/10 border border-amber-400/30 text-amber-300 text-xs font-mono">
                  <QrCode className="w-3.5 h-3.5" />
                  <span>Instant Mobile Payment • Real Working QR</span>
                </div>
                <h3 className="text-xl font-bold text-white">Scan to Open PMDRF Portal Instantly</h3>
                <p className="text-xs text-neutral-300 leading-relaxed font-light">
                  Point any phone camera, <strong>eSewa, Khalti, connectIPS, Fonepay, IME Pay</strong>, or banking scanner at this QR code. It directly opens the official <strong>pmdrf.nchl.com.np</strong> gateway for instantaneous zero-fee contribution.
                </p>

                <div className="p-3.5 rounded-2xl bg-white/[0.04] border border-white/10 space-y-1 text-xs font-mono">
                  <p className="text-neutral-400 text-[10px]">MERCHANT BENEFICIARY</p>
                  <p className="text-white font-bold">PM DISASTER RELIEF FUND NEPAL</p>
                </div>

                <a
                  href={OFFICIAL_PORTAL_URL}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 text-xs font-bold text-amber-400 hover:text-amber-300 hover:underline font-mono"
                >
                  <span>Open Gateway in Browser</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </a>
              </div>
            </div>
          )}

          {/* ── TAB 4: IMPACT CURRENCY CALCULATOR ── */}
          {activeTab === 'calculator' && (
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
              <div className="lg:col-span-6 space-y-5">
                <div className="space-y-1">
                  <h3 className="text-lg font-bold text-white">Relief Impact Currency Calculator</h3>
                  <p className="text-xs text-neutral-400 font-mono">See the real-world humanitarian value of your contribution in Nepali Rupees</p>
                </div>

                <div className="space-y-3">
                  <label className="text-xs font-mono text-neutral-300 block">SELECT DONATION CURRENCY & AMOUNT</label>
                  
                  {/* Currency Selector */}
                  <div className="flex gap-2">
                    {(['USD', 'INR', 'EUR', 'GBP'] as const).map((curr) => (
                      <button
                        key={curr}
                        type="button"
                        onClick={() => setCalcCurrency(curr)}
                        className={`px-4 py-2 rounded-xl text-xs font-mono font-bold transition cursor-pointer ${
                          calcCurrency === curr
                            ? 'bg-emerald-400 text-black shadow-[0_0_15px_rgba(52,211,153,0.3)]'
                            : 'bg-white/5 border border-white/10 text-neutral-400 hover:text-white'
                        }`}
                      >
                        {curr}
                      </button>
                    ))}
                  </div>

                  {/* Amount Input */}
                  <div className="relative">
                    <input
                      type="number"
                      value={calcAmount}
                      onChange={(e) => setCalcAmount(Math.max(1, Number(e.target.value)))}
                      className="w-full pl-4 pr-16 py-3.5 rounded-2xl bg-white/[0.04] border border-white/10 text-lg font-mono text-white focus:outline-none focus:border-emerald-500/50"
                    />
                    <span className="absolute right-4 top-1/2 -translate-y-1/2 font-mono text-xs font-bold text-neutral-500">
                      {calcCurrency}
                    </span>
                  </div>

                  {/* Preset Amount Pills */}
                  <div className="flex flex-wrap gap-2 pt-1">
                    {[25, 50, 100, 250, 500].map((amt) => (
                      <button
                        key={amt}
                        type="button"
                        onClick={() => setCalcAmount(amt)}
                        className="px-3 py-1 rounded-lg bg-white/5 hover:bg-white/10 border border-white/10 text-xs font-mono text-neutral-300 cursor-pointer"
                      >
                        +{amt} {calcCurrency}
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              {/* Impact Equivalent Card */}
              <div className="lg:col-span-6 p-6 rounded-3xl bg-gradient-to-br from-emerald-500/10 via-teal-500/5 to-cyan-500/10 border border-emerald-500/30 space-y-4 shadow-xl">
                <div className="flex items-center justify-between border-b border-emerald-500/20 pb-3">
                  <span className="text-[10px] font-mono text-emerald-400 font-bold uppercase tracking-wider">ESTIMATED YIELD</span>
                  <span className="text-xs font-mono text-neutral-400">1 {calcCurrency} ≈ {FX_RATES[calcCurrency]} NPR</span>
                </div>

                <div>
                  <span className="text-3xl sm:text-4xl font-black text-white font-mono">
                    रु {convertedNPR.toLocaleString()} <span className="text-lg font-normal text-emerald-400">NPR</span>
                  </span>
                  <p className="text-xs text-neutral-300 mt-1">Directly received by the Government Relief Fund</p>
                </div>

                <div className="space-y-2 pt-2 border-t border-emerald-500/20 text-xs font-mono text-neutral-300">
                  <p className="font-bold text-white flex items-center gap-1.5">
                    <Sparkles className="w-3.5 h-3.5 text-emerald-400" />
                    <span>Your Contribution Provides:</span>
                  </p>
                  <ul className="space-y-1.5 pl-4 list-disc text-neutral-300 text-[11px]">
                    <li>{Math.max(1, Math.floor(convertedNPR / 1500))} Emergency Dry Ration & Clean Water Family Kits</li>
                    <li>{Math.max(1, Math.floor(convertedNPR / 3500))} Trauma & First Aid Medical Supplies for Rural Clinics</li>
                    <li>{Math.max(1, Math.floor(convertedNPR / 6000))} High-Altitude Insulated Tarpaulin & Thermal Blankets</li>
                  </ul>
                </div>

                <a
                  href={OFFICIAL_PORTAL_URL}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full py-3 rounded-xl bg-emerald-400 hover:bg-emerald-300 text-black font-display font-bold text-xs uppercase tracking-wider transition flex items-center justify-center gap-2 cursor-pointer shadow-[0_0_20px_rgba(52,211,153,0.3)]"
                >
                  <span>Donate रु {convertedNPR.toLocaleString()} on Official Portal</span>
                  <ExternalLink className="w-3.5 h-3.5 text-black" />
                </a>
              </div>
            </div>
          )}
        </div>

        {/* ─── 4. RELIEF SECTOR ALLOCATION MATRIX ─── */}
        <div className="space-y-6 text-left">
          <div className="space-y-1">
            <h2 className="text-xl sm:text-2xl font-bold text-white font-display">
              Relief Allocation & Sector Distribution
            </h2>
            <p className="text-xs text-neutral-400 font-mono">
              How state emergency funds are deployed across affected Himalayan & Terai zones
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {RELIEF_SECTORS.map((sector) => {
              const Icon = sector.icon;
              return (
                <div
                  key={sector.title}
                  className={`p-5 rounded-3xl bg-white/[0.02] border ${sector.borderColor} space-y-3 relative overflow-hidden group hover:bg-white/[0.04] transition-all`}
                >
                  <div className="flex items-center justify-between">
                    <div className={`w-10 h-10 rounded-2xl bg-gradient-to-br ${sector.color} flex items-center justify-center text-white shadow-md`}>
                      <Icon className="w-5 h-5" />
                    </div>
                    <span className={`text-lg font-black font-mono ${sector.textColor}`}>
                      {sector.allocation}
                    </span>
                  </div>

                  <div>
                    <h3 className="font-bold text-sm text-white">{sector.title}</h3>
                    <p className="text-xs text-neutral-400 font-light mt-1 leading-relaxed">
                      {sector.description}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* ─── 5. YOUTH STUDENT DISPATCH & DISASTER TAG BANNER ─── */}
        <div className="p-6 sm:p-8 rounded-3xl bg-gradient-to-r from-blue-900/30 via-indigo-900/20 to-purple-900/30 border border-blue-500/30 flex flex-col md:flex-row items-center justify-between gap-6 text-left shadow-2xl">
          <div className="space-y-2 max-w-xl">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-500/10 border border-blue-500/30 text-blue-300 text-[11px] font-mono">
              <Globe2 className="w-3.5 h-3.5 text-blue-400" />
              <span>ZEN.PULSE Humanitarian Grid</span>
            </div>
            <h3 className="text-lg sm:text-xl font-bold text-white">
              Are you an on-ground volunteer or student relief coordinator?
            </h3>
            <p className="text-xs text-neutral-300 font-light leading-relaxed">
              Tag your dispatches with <strong className="text-white font-mono">#NepalRelief</strong> or <strong className="text-white font-mono">#PMDRF</strong> on <strong>ZEN.PULSE</strong> to broadcast emergency blood requirements, supply requests, and volunteer hubs in real-time.
            </p>
          </div>

          <Link
            href="/pulse"
            className="px-6 py-3.5 rounded-2xl bg-white hover:bg-neutral-200 text-black font-display font-bold text-xs uppercase tracking-wider transition shrink-0 flex items-center gap-2 shadow-[0_0_20px_rgba(255,255,255,0.2)] active:scale-95 cursor-pointer"
          >
            <span>Open Crisis Feed</span>
            <ArrowRight className="w-4 h-4 text-black" />
          </Link>
        </div>
      </main>

      <Footer />
    </div>
  );
}
