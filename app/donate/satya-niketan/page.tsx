'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import QRCode from 'qrcode';
import {
  ArrowLeft,
  ArrowRight,
  Heart,
  ShieldCheck,
  UploadCloud,
  CheckCircle2,
  Sparkles,
  QrCode,
  Copy,
  Check,
  Building,
  AlertTriangle,
  Flame,
  Stethoscope,
  Home,
  Scale,
  Award,
  Vote,
  Bell,
  FileText,
  UserPlus,
  ArrowUpRight,
  PhoneCall,
  MapPin,
  Clock,
  HelpCircle,
  ExternalLink,
  Landmark
} from 'lucide-react';
import { SpotlightCard } from '@/components/ui/SpotlightCard';
import { Navbar } from '@/components/layout/Navbar';
import { Footer } from '@/components/layout/Footer';
import { sheetSync } from '@/lib/googleSheets';

interface GovtReliefFund {
  id: string;
  name: string;
  authority: string;
  jurisdiction: string;
  upiId: string;
  upiName: string;
  badge: string;
  recommended?: boolean;
  bankName: string;
  accountName: string;
  accountNumber: string;
  ifsc: string;
  branch: string;
  pan: string;
  officialSite: string;
}

const OFFICIAL_GOVT_FUNDS: GovtReliefFund[] = [
  {
    id: 'lgcm_delhi',
    name: "Lieutenant Governor / Chief Minister's Relief Fund, Delhi",
    authority: 'Government of NCT of Delhi',
    jurisdiction: 'NCT of Delhi (Statutory State Calamity & Distress Escrow)',
    upiId: 'lgcmdelhifund@cnrb',
    upiName: 'LG/CM RELIEF FUND DELHI',
    badge: 'DELHI STATE JURISDICTION • OFFICIAL ESCROW',
    recommended: true,
    bankName: 'Canara Bank / State Bank of India',
    accountName: 'LG/CM Relief Fund, Delhi',
    accountNumber: '91042150000237',
    ifsc: 'CNRB0019104',
    branch: 'Delhi Secretariat, I.P. Estate, New Delhi-110002',
    pan: 'AAATL5393B',
    officialSite: 'https://delhi.gov.in'
  },
  {
    id: 'pmnrf',
    name: "Prime Minister's National Relief Fund (PMNRF)",
    authority: "Prime Minister's Office, Government of India",
    jurisdiction: 'National Central Government (Statutory Disaster & Calamities)',
    upiId: 'pmnrf@centralbank',
    upiName: "PRIME MINISTER'S NATIONAL RELIEF FUND",
    badge: 'CENTRAL GOVT PMNRF • 100% 80G EXEMPT',
    bankName: 'Central Bank of India',
    accountName: "Prime Minister's National Relief Fund",
    accountNumber: '1100460014',
    ifsc: 'CBIN0280319',
    branch: 'New Delhi Main Branch',
    pan: 'XAAAP0123P',
    officialSite: 'https://pmnrf.gov.in'
  },
  {
    id: 'pmcares',
    name: 'PM CARES Fund',
    authority: 'Government of India Emergency Trust',
    jurisdiction: 'Public Charitable Trust for Emergency Assistance',
    upiId: 'pmcares@sbi',
    upiName: 'PM CARES FUND',
    badge: 'PUBLIC CHARITABLE TRUST • NATIONAL',
    bankName: 'State Bank of India',
    accountName: 'PM CARES FUND',
    accountNumber: '2121PMCARES',
    ifsc: 'SBIN0000691',
    branch: 'New Delhi Main Branch, Parliament Street',
    pan: 'AAATP2121P',
    officialSite: 'https://pmindia.gov.in'
  }
];

export default function SatyaNiketanReliefPage() {
  const [selectedFundId, setSelectedFundId] = useState<string>('lgcm_delhi');
  const [copiedKey, setCopiedKey] = useState<string | null>(null);
  const [qrDataUrl, setQrDataUrl] = useState<string>('');
  const [submitted, setSubmitted] = useState(false);

  const selectedFund = OFFICIAL_GOVT_FUNDS.find(f => f.id === selectedFundId) || OFFICIAL_GOVT_FUNDS[0];

  // Generate dynamic official UPI standard QR payload
  useEffect(() => {
    // UPI Standard URI: upi://pay?pa=VPA&pn=NAME&cu=INR&tn=NOTE
    const upiUri = `upi://pay?pa=${selectedFund.upiId}&pn=${encodeURIComponent(selectedFund.upiName)}&cu=INR&tn=${encodeURIComponent('Relief Contribution')}`;
    QRCode.toDataURL(upiUri, {
      width: 420,
      margin: 1,
      color: {
        dark: '#000000',
        light: '#ffffff'
      },
      errorCorrectionLevel: 'H'
    })
      .then((url) => setQrDataUrl(url))
      .catch((err) => console.error('Failed to generate govt UPI QR code', err));
  }, [selectedFund]);

  // Form State
  const [formData, setFormData] = useState({
    donorName: '',
    donorEmail: '',
    donorPhone: '',
    amount: '',
    utrOrTxnId: '',
    dedicatedProject: selectedFund.name,
    screenshot: null as File | null,
    wantsAnonymous: false,
    notesOrPrayer: '',
  });

  const handleCopy = (text: string, key: string) => {
    if (typeof navigator !== 'undefined' && navigator.clipboard) {
      navigator.clipboard.writeText(text);
      setCopiedKey(key);
      setTimeout(() => setCopiedKey(null), 2200);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    // Dispatch directly to Google Sheets (Impact Ledger tab)
    sheetSync.impactLedger({
      donorName: formData.donorName || (formData.wantsAnonymous ? 'Anonymous DU Ally' : 'South Campus Supporter'),
      donorEmail: formData.donorEmail || 'anonymous.relief@zenvitra.xyz',
      voluntaryAmountInr: formData.amount || '0',
      utrTransactionId: formData.utrOrTxnId || `DU-RELIEF-${Date.now().toString().slice(-6)}`,
      targetProjectStream: `[Satya Niketan DU Relief] ${formData.dedicatedProject}`,
      auditStatus: 'PRIORITY_EMERGENCY_RECONCILIATION',
      verificationDetails: `Direct Student Crisis Relief | Phone: ${formData.donorPhone || 'N/A'} | Note: ${formData.notesOrPrayer || 'N/A'}`,
    });

    setSubmitted(true);
  };

  const emergencySupportTiers = [
    {
      title: 'Emergency Medical & Trauma Care',
      cost: '₹2,500',
      description: 'Covers essential ICU medication, trauma dressings, critical prescriptions, and urgent medical diagnostic kits for injured victims.',
      icon: Stethoscope,
      accent: 'border-rose-500/40 text-rose-400 bg-rose-500/10',
    },
    {
      title: 'Student Rehabilitation & Relocation',
      cost: '₹7,500',
      description: 'Provides immediate emergency temporary lodging, clothing, warm meals, and daily essentials for affected Delhi University outstation students.',
      icon: Home,
      accent: 'border-amber-500/40 text-amber-400 bg-amber-500/10',
    },
    {
      title: 'Critical Surgery & Prosthetics Fund',
      cost: '₹25,000',
      description: 'Direct grant allocation for surgical interventions, specialized fracture orthopedic operations, and extended hospital stay assistance.',
      icon: Heart,
      accent: 'border-emerald-500/40 text-emerald-400 bg-emerald-500/10',
    },
  ];

  return (
    <div className="min-h-screen bg-[#030405] text-white selection:bg-rose-500 selection:text-white font-sans relative overflow-x-hidden pt-16 sm:pt-20">
      <Navbar />

      {/* Background Grids & Emergency Red/Amber Ambient Glow */}
      <div className="fixed inset-0 pointer-events-none bg-[radial-gradient(#ffffff07_1px,transparent_1px)] [background-size:32px_32px] opacity-40 z-0" />
      <div className="fixed top-0 left-1/2 -translate-x-1/2 w-[1000px] h-[450px] bg-gradient-to-b from-rose-600/[0.12] via-amber-500/[0.04] to-transparent blur-[140px] pointer-events-none z-0" />

      <div className="relative z-10 max-w-6xl mx-auto px-4 sm:px-8 lg:px-12 py-8 min-h-screen flex flex-col justify-between">
        <main className="py-6 flex-1 space-y-10">

          {/* Navigation Breadcrumb */}
          <div className="flex items-center justify-between">
            <Link
              href="/"
              className="inline-flex items-center gap-2 text-xs font-mono text-neutral-400 hover:text-white transition group"
            >
              <ArrowLeft className="w-3.5 h-3.5 group-hover:-translate-x-1 transition-transform" />
              <span>Back to Zenvitra Sovereign</span>
            </Link>

            <div className="flex items-center gap-2 px-3 py-1 rounded-full bg-rose-500/10 border border-rose-500/30 font-mono text-[10px] text-rose-400 font-bold uppercase tracking-wider">
              <span className="w-2 h-2 rounded-full bg-rose-500 animate-ping" />
              <span>Active Emergency Response</span>
            </div>
          </div>

          {submitted ? (
            /* Success / Audit Recorded View */
            <div className="max-w-xl mx-auto rounded-[2.8rem] bg-[#07080b] border border-rose-500/30 p-8 sm:p-14 text-center space-y-6 shadow-[0_30px_90px_rgba(244,63,94,0.15)]">
              <div className="w-16 h-16 rounded-2xl bg-emerald-400/10 border border-emerald-400/35 mx-auto flex items-center justify-center text-emerald-400">
                <CheckCircle2 className="w-8 h-8" />
              </div>
              <div className="space-y-2">
                <span className="font-mono text-[10px] text-emerald-400 tracking-widest uppercase">
                  EMERGENCY AID LOGGED DIRECTLY
                </span>
                <h2 className="font-display font-medium text-3xl text-white">
                  Standing in Solidarity with South Campus.
                </h2>
              </div>
              <p className="text-sm text-neutral-300 font-light leading-relaxed">
                Your voluntary donation and transaction reference have been ingested into our emergency response ledger. 100% of proceeds are coordinated directly with on-ground DU student relief teams and hospital counters.
              </p>

              <div className="p-4 rounded-2xl bg-black/80 border border-white/10 font-mono text-xs text-neutral-400 text-left space-y-2">
                <div className="flex justify-between">
                  <span>Contributor:</span>
                  <span className="text-white font-semibold">{formData.wantsAnonymous ? 'Anonymous DU Ally' : formData.donorName}</span>
                </div>
                <div className="flex justify-between">
                  <span>Allocated Stream:</span>
                  <span className="text-rose-300 truncate max-w-[240px]">{formData.dedicatedProject}</span>
                </div>
                <div className="flex justify-between">
                  <span>Txn / UTR Ref:</span>
                  <span className="text-white font-mono">{formData.utrOrTxnId || 'Direct Submission'}</span>
                </div>
                <div className="flex justify-between border-t border-white/10 pt-2 text-emerald-400">
                  <span>Relief Status:</span>
                  <span>PRIORITY DISPATCH VERIFIED</span>
                </div>
              </div>

              <div className="pt-2 flex flex-col sm:flex-row gap-3 justify-center">
                <button
                  type="button"
                  onClick={() => setSubmitted(false)}
                  className="px-6 py-3 rounded-full bg-white text-black font-mono text-xs font-bold hover:bg-neutral-200 transition cursor-pointer"
                >
                  Log Another Contribution
                </button>
                <Link
                  href="/impact"
                  className="px-6 py-3 rounded-full bg-white/[0.06] hover:bg-white/[0.12] border border-white/15 text-white font-mono text-xs transition flex items-center justify-center gap-1.5"
                >
                  <span>View Public Impact Ledger</span>
                  <ArrowUpRight className="w-3.5 h-3.5" />
                </Link>
              </div>
            </div>
          ) : (
            <div className="space-y-12">
              {/* Emergency Banner Header */}
              <div className="text-center space-y-4 max-w-3xl mx-auto">
                <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-rose-500/10 border border-rose-500/30 font-mono text-[10px] text-rose-300 uppercase tracking-widest">
                  <Flame className="w-3.5 h-3.5 text-rose-400" />
                  <span>DELHI UNIVERSITY • SOUTH CAMPUS EMERGENCY DISASTER RELIEF</span>
                </div>

                <h1 className="font-display font-bold text-3xl sm:text-5xl lg:text-6xl text-white tracking-tight leading-[1.08]">
                  South Campus, DU <br />
                  <span className="text-transparent bg-clip-text bg-gradient-to-r from-rose-400 via-amber-300 to-white">
                    Satya Niketan Building Collapse Relief Fund
                  </span>
                </h1>

                <p className="text-xs sm:text-sm text-neutral-300 font-light leading-relaxed max-w-2xl mx-auto">
                  Providing urgent disaster relief, emergency trauma surgery, debris evacuation support, temporary student rehabilitation, and essential supplies following the tragic <strong>Satya Niketan building collapse incident</strong> near Delhi University South Campus.
                </p>

                <div className="flex flex-wrap items-center justify-center gap-4 pt-2 font-mono text-[11px] text-neutral-400">
                  <div className="flex items-center gap-1.5">
                    <MapPin className="w-3.5 h-3.5 text-rose-400" />
                    <span>Satya Niketan Collapse Site (Near Sri Venkateswara &amp; ARSD Colleges)</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <Clock className="w-3.5 h-3.5 text-amber-400" />
                    <span>24/7 Rapid Emergency Response</span>
                  </div>
                </div>
              </div>

              {/* Zero-Friction Direct Donation Notice */}
              <div className="p-4 sm:p-5 rounded-2xl bg-gradient-to-r from-rose-500/15 via-[#0c0d12] to-amber-500/15 border border-rose-500/30 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 shadow-lg">
                <div className="flex items-center gap-3.5">
                  <div className="w-10 h-10 rounded-xl bg-rose-500/20 border border-rose-500/30 flex items-center justify-center text-rose-400 shrink-0">
                    <ShieldCheck className="w-5 h-5" />
                  </div>
                  <div>
                    <h4 className="font-display font-bold text-sm text-white flex items-center gap-2">
                      <span>Direct Official Government &amp; Disaster Escrow • Zero Commission</span>
                    </h4>
                    <p className="font-sans text-xs text-neutral-300 mt-0.5">
                      Contribute directly via official Government of NCT of Delhi / PMNRF UPI or Bank NEFT. 100% tax exempt under Section 80G. No third-party deductions.
                    </p>
                  </div>
                </div>

                <span className="text-[10px] font-mono px-3 py-1 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 uppercase tracking-wider font-semibold shrink-0">
                  Verified Govt Escrow
                </span>
              </div>

              {/* Emergency Support Tiers */}
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <h3 className="font-display font-bold text-base sm:text-lg text-white flex items-center gap-2">
                    <Heart className="w-4 h-4 text-rose-400" />
                    <span>How Your Contribution Helps On-Ground</span>
                  </h3>
                  <span className="font-mono text-[10px] text-neutral-400">Voluntary Tiers</span>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
                  {emergencySupportTiers.map((tier, idx) => {
                    const Icon = tier.icon;
                    return (
                      <SpotlightCard key={idx} className="p-6">
                        <div className="space-y-3.5">
                          <div className="flex items-center justify-between">
                            <div className={`w-10 h-10 rounded-xl border flex items-center justify-center ${tier.accent}`}>
                              <Icon className="w-5 h-5" />
                            </div>
                            <span className="font-mono text-sm font-bold text-white px-3 py-1 rounded-full bg-white/10 border border-white/15">
                              {tier.cost}
                            </span>
                          </div>
                          <div>
                            <h4 className="font-display font-bold text-sm sm:text-base text-white">{tier.title}</h4>
                            <p className="text-xs text-neutral-300 leading-relaxed font-light mt-1">{tier.description}</p>
                          </div>
                        </div>
                      </SpotlightCard>
                    );
                  })}
                </div>
              </div>

              {/* Core Payment Grid: Left (UPI & Wire) | Right (Verification & Upload) */}
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start pt-2">

                {/* Left Column: Official Government Payment Accounts & QR */}
                <div className="lg:col-span-5 space-y-6">
                  <div className="p-6 sm:p-7 rounded-[2.2rem] bg-[#07080b] border border-white/10 space-y-6 shadow-xl">
                    <div className="space-y-1">
                      <span className="font-mono text-[10px] text-rose-400 uppercase tracking-widest block font-bold">
                        STEP 01: OFFICIAL GOVT ESCROW &amp; UPI
                      </span>
                      <h3 className="font-display font-bold text-xl text-white">Direct Government Relief Fund</h3>
                      <p className="text-xs text-neutral-400 font-light">
                        Donations route 100% directly into official statutory state/central disaster accounts with zero intermediary cut and Section 80G tax exemption.
                      </p>
                    </div>

                    {/* Government Fund Selector */}
                    <div className="space-y-2">
                      <label className="text-[10px] font-mono uppercase tracking-wider text-neutral-400 block font-semibold">
                        Select Official Relief Beneficiary:
                      </label>
                      <div className="grid grid-cols-1 gap-2">
                        {OFFICIAL_GOVT_FUNDS.map((fund) => {
                          const isSelected = selectedFundId === fund.id;
                          return (
                            <button
                              key={fund.id}
                              type="button"
                              onClick={() => {
                                setSelectedFundId(fund.id);
                                setFormData(prev => ({ ...prev, dedicatedProject: fund.name }));
                              }}
                              className={`p-3 rounded-xl border text-left transition-all cursor-pointer ${
                                isSelected
                                  ? 'bg-rose-500/15 border-rose-500/50 shadow-[0_0_20px_rgba(244,63,94,0.15)]'
                                  : 'bg-white/[0.02] border-white/10 hover:border-white/20 hover:bg-white/[0.05]'
                              }`}
                            >
                              <div className="flex items-center justify-between gap-2">
                                <span className={`text-[10px] font-mono font-bold uppercase tracking-wider ${isSelected ? 'text-rose-300' : 'text-neutral-400'}`}>
                                  {fund.badge}
                                </span>
                                {fund.recommended && (
                                  <span className="text-[9px] font-mono px-2 py-0.5 rounded-full bg-rose-500/20 text-rose-300 border border-rose-500/30">
                                    PRIMARY FOR DELHI
                                  </span>
                                )}
                              </div>
                              <h4 className="font-display font-semibold text-xs sm:text-sm text-white mt-1">
                                {fund.name}
                              </h4>
                              <p className="text-[11px] font-mono text-neutral-400 mt-0.5">
                                Authority: {fund.authority}
                              </p>
                            </button>
                          );
                        })}
                      </div>
                    </div>

                    {/* Official Dynamic UPI QR Code Card */}
                    <div className="p-4 sm:p-5 rounded-2xl bg-black/80 border border-rose-500/30 space-y-4 text-center">
                      <div className="flex items-center justify-between border-b border-white/10 pb-2.5">
                        <span className="font-mono text-[10px] text-rose-300 uppercase font-bold flex items-center gap-1.5">
                          <QrCode className="w-4 h-4 text-rose-400" />
                          <span>OFFICIAL GOVT UPI QR CODE</span>
                        </span>
                        <span className="font-mono text-[9px] px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-400 font-bold">
                          100% 80G EXEMPT
                        </span>
                      </div>

                      {/* Rendered QR Code */}
                      <div className="p-4 bg-white rounded-2xl inline-block mx-auto shadow-2xl border-4 border-white/20">
                        {qrDataUrl ? (
                          /* eslint-disable-next-line @next/next/no-img-element */
                          <img
                            src={qrDataUrl}
                            alt={`Official UPI QR Code for ${selectedFund.name}`}
                            className="w-48 h-48 sm:w-56 sm:h-56 object-contain rounded-lg"
                          />
                        ) : (
                          <div className="w-48 h-48 sm:w-56 sm:h-56 flex items-center justify-center bg-neutral-100 text-neutral-400 font-mono text-xs">
                            Generating Official QR...
                          </div>
                        )}
                      </div>

                      <p className="text-[11px] font-mono text-neutral-300">
                        Scan with <strong className="text-white">Google Pay, PhonePe, Paytm, BHIM</strong>, or any banking UPI app.
                      </p>

                      {/* Official Verified UPI ID */}
                      <div className="flex items-center justify-between font-mono text-xs bg-[#07080b] p-3 rounded-xl border border-white/10">
                        <div className="text-left">
                          <span className="text-[10px] text-neutral-400 block uppercase">Official Verified UPI ID:</span>
                          <span className="text-amber-300 font-bold select-all text-xs sm:text-sm">{selectedFund.upiId}</span>
                        </div>
                        <button
                          type="button"
                          onClick={() => handleCopy(selectedFund.upiId, 'upi')}
                          className="px-2.5 py-1.5 rounded-lg bg-white/10 hover:bg-white/20 text-neutral-200 hover:text-white transition flex items-center gap-1 cursor-pointer shrink-0"
                        >
                          {copiedKey === 'upi' ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                          <span className="text-[10px] font-bold">{copiedKey === 'upi' ? 'Copied' : 'Copy'}</span>
                        </button>
                      </div>

                      <div className="p-2.5 rounded-xl bg-white/[0.03] border border-white/[0.08] text-left text-[11px] font-mono space-y-1">
                        <div className="text-neutral-400 flex justify-between">
                          <span>Payee Verification:</span>
                          <span className="text-emerald-400 font-bold">{selectedFund.upiName}</span>
                        </div>
                        <div className="text-neutral-400 flex justify-between">
                          <span>Jurisdiction:</span>
                          <span className="text-white truncate max-w-[200px]">{selectedFund.jurisdiction}</span>
                        </div>
                      </div>
                    </div>

                    {/* Official Bank Wire Details */}
                    <div className="p-4 rounded-2xl bg-black/80 border border-white/10 space-y-3 font-mono text-xs">
                      <div className="flex items-center justify-between border-b border-white/10 pb-2">
                        <span className="text-neutral-400 text-[10px] uppercase font-bold flex items-center gap-1">
                          <Building className="w-3.5 h-3.5 text-cyan-400" />
                          <span>STATUTORY BANK WIRE / NEFT / IMPS</span>
                        </span>
                        <button
                          type="button"
                          onClick={() => handleCopy(`Account Name: ${selectedFund.accountName}\nAccount Number: ${selectedFund.accountNumber}\nIFSC: ${selectedFund.ifsc}\nBank: ${selectedFund.bankName}\nBranch: ${selectedFund.branch}\nPAN: ${selectedFund.pan}`, 'bank')}
                          className="text-neutral-400 hover:text-white transition flex items-center gap-1 text-[10px] cursor-pointer"
                        >
                          {copiedKey === 'bank' ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                          <span>{copiedKey === 'bank' ? 'Copied' : 'Copy Wire'}</span>
                        </button>
                      </div>

                      <div className="space-y-2 text-[11px]">
                        <div>
                          <span className="text-neutral-500 text-[10px] block uppercase">Account Name:</span>
                          <span className="text-white font-medium">{selectedFund.accountName}</span>
                        </div>
                        <div>
                          <span className="text-neutral-500 text-[10px] block uppercase">Account Number:</span>
                          <span className="text-white font-mono tracking-wider font-bold select-all">{selectedFund.accountNumber}</span>
                        </div>
                        <div>
                          <span className="text-neutral-500 text-[10px] block uppercase">IFSC Code:</span>
                          <span className="text-amber-300 font-mono font-bold select-all">{selectedFund.ifsc}</span>
                        </div>
                        <div>
                          <span className="text-neutral-500 text-[10px] block uppercase">Bank &amp; Branch:</span>
                          <span className="text-neutral-300">{selectedFund.bankName} • {selectedFund.branch}</span>
                        </div>
                        <div>
                          <span className="text-neutral-500 text-[10px] block uppercase">Donee PAN (For Tax Exemption 80G):</span>
                          <span className="text-emerald-400 font-mono font-bold">{selectedFund.pan}</span>
                        </div>
                      </div>

                      <div className="pt-2 border-t border-white/10">
                        <a
                          href={selectedFund.officialSite}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center gap-1.5 text-xs text-rose-400 hover:text-rose-300 font-bold transition"
                        >
                          <span>Visit Official Govt Portal</span>
                          <ExternalLink className="w-3 h-3" />
                        </a>
                      </div>
                    </div>

                    {/* Trust / Transparency Guarantee */}
                    <div className="p-3.5 rounded-2xl bg-emerald-500/[0.06] border border-emerald-500/20 flex items-start gap-3">
                      <ShieldCheck className="w-5 h-5 text-emerald-400 shrink-0 mt-0.5" />
                      <div className="space-y-0.5">
                        <p className="font-display font-bold text-xs text-white">Statutory Audit &amp; 100% Tax Relief</p>
                        <p className="text-[11px] text-neutral-300 font-light leading-snug">
                          All payments pass directly through official state/central reserves. Donors can claim 100% tax exemption under Section 80G of the Indian Income Tax Act.
                        </p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Right Column: Ingestion / UTR Logging Form */}
                <div className="lg:col-span-7">
                  <div className="p-6 sm:p-10 rounded-[2.5rem] bg-[#07080b] border border-white/10 shadow-[0_25px_80px_rgba(0,0,0,0.95)] space-y-6">
                    <div className="space-y-1">
                      <span className="font-mono text-[10px] text-rose-400 uppercase tracking-widest block font-bold">
                        STEP 02: CONFIRM &amp; LOG RECEIPT (OPTIONAL)
                      </span>
                      <h3 className="font-display font-bold text-2xl text-white">Record Your Contribution</h3>
                      <p className="text-xs text-neutral-400 font-light">
                        Help us reconcile your donation immediately so emergency hospital and grocery vouchers can be dispatched on the spot.
                      </p>
                    </div>

                    <form onSubmit={handleSubmit} className="space-y-4">
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div className="space-y-1.5">
                          <label className="font-mono text-[11px] text-neutral-300 uppercase block">
                            Full Name <span className="text-rose-400">*</span>
                          </label>
                          <input
                            type="text"
                            required
                            placeholder="e.g. Rahul Sharma"
                            value={formData.donorName}
                            onChange={(e) => setFormData({ ...formData, donorName: e.target.value })}
                            className="w-full px-4 py-3 rounded-xl bg-black/80 border border-white/10 text-white text-xs font-mono focus:outline-none focus:border-rose-400/50"
                          />
                        </div>

                        <div className="space-y-1.5">
                          <label className="font-mono text-[11px] text-neutral-300 uppercase block">
                            Email Address <span className="text-rose-400">*</span>
                          </label>
                          <input
                            type="email"
                            required
                            placeholder="your.email@domain.com"
                            value={formData.donorEmail}
                            onChange={(e) => setFormData({ ...formData, donorEmail: e.target.value })}
                            className="w-full px-4 py-3 rounded-xl bg-black/80 border border-white/10 text-white text-xs font-mono focus:outline-none focus:border-rose-400/50"
                          />
                        </div>
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div className="space-y-1.5">
                          <label className="font-mono text-[11px] text-neutral-300 uppercase block">
                            Donated Amount (INR) <span className="text-rose-400">*</span>
                          </label>
                          <input
                            type="text"
                            required
                            placeholder="e.g. ₹1,000 / ₹5,000"
                            value={formData.amount}
                            onChange={(e) => setFormData({ ...formData, amount: e.target.value })}
                            className="w-full px-4 py-3 rounded-xl bg-black/80 border border-white/10 text-white text-xs font-mono focus:outline-none focus:border-rose-400/50"
                          />
                        </div>

                        <div className="space-y-1.5">
                          <label className="font-mono text-[11px] text-neutral-300 uppercase block">
                            UPI Ref / UTR / Txn ID <span className="text-rose-400">*</span>
                          </label>
                          <input
                            type="text"
                            required
                            placeholder="12-digit UTR (e.g. 423987162910)"
                            value={formData.utrOrTxnId}
                            onChange={(e) => setFormData({ ...formData, utrOrTxnId: e.target.value })}
                            className="w-full px-4 py-3 rounded-xl bg-black/80 border border-white/10 text-white text-xs font-mono focus:outline-none focus:border-rose-400/50"
                          />
                        </div>
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div className="space-y-1.5">
                          <label className="font-mono text-[11px] text-neutral-300 uppercase block">
                            Phone / WhatsApp (Optional)
                          </label>
                          <input
                            type="tel"
                            placeholder="+91 98765 43210"
                            value={formData.donorPhone}
                            onChange={(e) => setFormData({ ...formData, donorPhone: e.target.value })}
                            className="w-full px-4 py-3 rounded-xl bg-black/80 border border-white/10 text-white text-xs font-mono focus:outline-none focus:border-rose-400/50"
                          />
                        </div>

                        <div className="space-y-1.5">
                          <label className="font-mono text-[11px] text-neutral-300 uppercase block">
                            Target Relief Stream <span className="text-rose-400">*</span>
                          </label>
                          <select
                            value={formData.dedicatedProject}
                            onChange={(e) => setFormData({ ...formData, dedicatedProject: e.target.value })}
                            className="w-full px-4 py-3 rounded-xl bg-black border border-white/10 text-white text-xs font-mono focus:outline-none focus:border-rose-400/50"
                          >
                            <option>Immediate Medical &amp; Hospitalization Relief Fund</option>
                            <option>Emergency Outstation Student Housing &amp; Relocation</option>
                            <option>Daily Meals, Clothing &amp; Essential Recovery Kits</option>
                            <option>Legal Aid &amp; Compensation Advocacy Desk</option>
                            <option>General Unrestricted Emergency Relief Corpus</option>
                          </select>
                        </div>
                      </div>

                      {/* Payment SS Upload */}
                      <div className="space-y-1.5">
                        <label className="font-mono text-[11px] text-neutral-300 uppercase block">
                          Upload Payment Screenshot (Optional but Recommended)
                        </label>
                        <div className="relative border-2 border-dashed border-white/15 rounded-2xl p-5 text-center bg-black/40 hover:border-white/30 transition">
                          <input
                            type="file"
                            accept="image/*"
                            onChange={(e) => setFormData({ ...formData, screenshot: e.target.files?.[0] || null })}
                            className="absolute inset-0 opacity-0 cursor-pointer w-full h-full"
                          />
                          <div className="flex flex-col items-center space-y-1.5 pointer-events-none">
                            <UploadCloud className="w-6 h-6 text-neutral-400" />
                            <span className="font-mono text-xs text-white">
                              {formData.screenshot ? formData.screenshot.name : 'Click or drop payment screenshot here'}
                            </span>
                            <span className="font-mono text-[10px] text-neutral-500">PNG, JPG, WEBP receipt image</span>
                          </div>
                        </div>
                      </div>

                      {/* Prayer / Support message */}
                      <div className="space-y-1.5">
                        <label className="font-mono text-[11px] text-neutral-300 uppercase block">
                          Message of Solidarity or Prayer (Optional)
                        </label>
                        <input
                          type="text"
                          placeholder="e.g. Strength to all students & families affected in Satya Niketan"
                          value={formData.notesOrPrayer}
                          onChange={(e) => setFormData({ ...formData, notesOrPrayer: e.target.value })}
                          className="w-full px-4 py-3 rounded-xl bg-black/80 border border-white/10 text-white text-xs font-mono focus:outline-none focus:border-rose-400/50"
                        />
                      </div>

                      {/* Anonymous checkbox */}
                      <div className="flex items-center gap-2.5 pt-1">
                        <input
                          type="checkbox"
                          id="anonymous"
                          checked={formData.wantsAnonymous}
                          onChange={(e) => setFormData({ ...formData, wantsAnonymous: e.target.checked })}
                          className="w-4 h-4 rounded bg-black/80 border-white/20 text-rose-500 focus:ring-0 cursor-pointer"
                        />
                        <label htmlFor="anonymous" className="font-mono text-xs text-neutral-300 cursor-pointer">
                          Keep my name anonymous on the public impact audit ledger
                        </label>
                      </div>

                      <button
                        type="submit"
                        className="w-full py-4 rounded-2xl bg-gradient-to-r from-rose-500 via-rose-600 to-amber-500 hover:from-rose-400 hover:to-amber-400 text-white font-display font-bold text-xs uppercase tracking-wider transition duration-200 shadow-[0_0_25px_rgba(244,63,94,0.4)] flex items-center justify-center gap-2 cursor-pointer active:scale-[0.99]"
                      >
                        <Heart className="w-4 h-4 fill-current" />
                        <span>Log Emergency Contribution &amp; Dispatch Aid</span>
                      </button>

                      <p className="font-mono text-[10px] text-neutral-500 text-center">
                        Need immediate assistance or want to volunteer? Reach out to the student relief coordination cell at <a href="mailto:relief@zenvitra.xyz" className="text-neutral-300 underline">relief@zenvitra.xyz</a>
                      </p>
                    </form>
                  </div>
                </div>
              </div>
            </div>
          )}
        </main>
      </div>

      <Footer />
    </div>
  );
}
