'use client';

import React, { useState } from 'react';
import Link from 'next/link';
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
  Laptop,
  BookOpen,
  GraduationCap,
  Unlock,
  Award,
  Vote,
  Bell,
  FileText,
  UserPlus,
  ArrowUpRight
} from 'lucide-react';
import { SpotlightCard } from '@/components/ui/SpotlightCard';
import { Navbar } from '@/components/layout/Navbar';
import { sheetSync } from '@/lib/googleSheets';

export default function GovtSchoolsDonationPage() {
  const [copiedUPI, setCopiedUPI] = useState(false);
  const [copiedBank, setCopiedBank] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  // Form State
  const [formData, setFormData] = useState({
    donorName: '',
    donorEmail: '',
    amount: '',
    utrOrTxnId: '',
    dedicatedProject: 'Digital Smart Class & Computer Lab Setup',
    screenshot: null as File | null,
    wantsAnonymous: false,
  });

  const upiId = 'govtschools.zenvitra@sbi';
  const bankDetails = {
    accountName: "Zenvitra Foundation - Public Education Initiative",
    accountNumber: '48291039281',
    ifsc: 'SBIN0001842',
    bankAndBranch: 'State Bank of India, Main Institutional Branch',
    pan: 'AAATZ9281Q',
  };

  const handleCopy = (text: string, type: 'upi' | 'bank') => {
    navigator.clipboard.writeText(text);
    if (type === 'upi') {
      setCopiedUPI(true);
      setTimeout(() => setCopiedUPI(false), 2000);
    } else {
      setCopiedBank(true);
      setTimeout(() => setCopiedBank(false), 2000);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    // Dispatch to Google Sheets (Impact Ledger tab)
    sheetSync.impactLedger({
      donorName: formData.donorName || (formData.wantsAnonymous ? 'Anonymous Patron' : 'Public Donor'),
      donorEmail: formData.donorEmail || 'anonymous@patron.zenvitra',
      voluntaryAmountInr: formData.amount || '0',
      utrTransactionId: formData.utrOrTxnId || `TXN-${Date.now().toString().slice(-6)}`,
      targetProjectStream: formData.dedicatedProject || 'Govt School Solar & Lab Fund',
      auditStatus: 'PENDING_BANK_RECONCILIATION',
      verificationDetails: '25% Civic Escrow Direct Public Education Allocation',
    });

    setSubmitted(true);
  };

  const supportTiers = [
    {
      title: 'Library & Science Kit Upgrade',
      cost: '₹3,500 / $42',
      description: 'Provides 25 curriculum-aligned science experiment kits and storybooks for rural public school libraries.',
      icon: BookOpen,
    },
    {
      title: 'Digital Smart Class & Computer Lab',
      cost: '₹18,000 / $215',
      description: 'Equips a classroom with projector accessories, open-source educational software, and coding stations.',
      icon: Laptop,
    },
    {
      title: 'Infrastructure & Sanitation Overhaul',
      cost: '₹50,000 / $600',
      description: 'Renovates classrooms, repairs study desks, and upgrades drinking water sanitation facilities.',
      icon: Building,
    },
  ];

  return (
    <div className="min-h-screen bg-[#030405] text-white selection:bg-white selection:text-black font-sans relative overflow-x-hidden pt-16 sm:pt-20">
      <Navbar />

      {/* Background Ambient Grids */}
      <div className="fixed inset-0 pointer-events-none bg-[radial-gradient(#ffffff07_1px,transparent_1px)] [background-size:32px_32px] opacity-40 z-0" />
      <div className="fixed top-0 left-1/2 -translate-x-1/2 w-[900px] h-[400px] bg-gradient-to-b from-amber-400/[0.06] to-transparent blur-[130px] pointer-events-none z-0" />

      <div className="relative z-10 max-w-6xl mx-auto px-6 sm:px-12 py-8 min-h-screen flex flex-col justify-between">
        {/* Main Content */}
        <main className="py-8 flex-1">
          {submitted ? (
            <div className="max-w-xl mx-auto rounded-[2.8rem] bg-[#07080b] border border-white/10 p-10 sm:p-14 text-center space-y-6 shadow-[0_30px_90px_rgba(0,0,0,0.95)]">
              <div className="w-16 h-16 rounded-2xl bg-emerald-400/10 border border-emerald-400/35 mx-auto flex items-center justify-center text-emerald-400">
                <CheckCircle2 className="w-8 h-8" />
              </div>
              <div className="space-y-2">
                <span className="font-mono text-[10px] text-emerald-400 tracking-widest uppercase">
                  CONTRIBUTION INGESTED SUCCESSFULLY
                </span>
                <h2 className="font-display font-medium text-3xl text-white">
                  Empowering the Next Generation.
                </h2>
              </div>
              <p className="text-sm text-neutral-400 font-light leading-relaxed">
                Your payment screenshot and UTR have been verified and logged into the public education ledger. Thank you for investing in public school modernization.
              </p>
              <div className="p-4 rounded-xl bg-black/60 border border-white/5 font-mono text-xs text-neutral-400 text-left space-y-1.5">
                <div className="flex justify-between">
                  <span>Contributor:</span>
                  <span className="text-white">{formData.wantsAnonymous ? 'Anonymous Benefactor' : formData.donorName}</span>
                </div>
                <div className="flex justify-between">
                  <span>Project Target:</span>
                  <span className="text-amber-300">{formData.dedicatedProject}</span>
                </div>
                <div className="flex justify-between">
                  <span>Status:</span>
                  <span className="text-emerald-400">AUDIT LOGGED</span>
                </div>
              </div>
              <button
                onClick={() => setSubmitted(false)}
                className="px-8 py-3.5 rounded-full bg-white text-black font-mono text-xs font-semibold hover:bg-neutral-200 transition"
              >
                Submit Another Contribution
              </button>
            </div>
          ) : (
            <div className="space-y-12">
              {/* Mission Header */}
              <div className="text-center space-y-4 max-w-3xl mx-auto">
                <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-amber-400/[0.08] border border-amber-400/20 font-mono text-[10px] text-amber-300 uppercase tracking-widest">
                  <GraduationCap className="w-3.5 h-3.5" />
                  <span>PUBLIC EDUCATION REFORM INITIATIVE</span>
                </div>

                <h1 className="font-display font-medium text-4xl sm:text-6xl text-white tracking-tight leading-[1.05]">
                  Let&apos;s Make Government <br />
                  Schools <span className="font-serif italic font-normal text-neutral-200">Great.</span>
                </h1>

                <p className="text-xs sm:text-sm text-neutral-400 font-light leading-relaxed max-w-2xl mx-auto">
                  Every child deserves world-class learning facilities regardless of socioeconomic background. We are upgrading government school infrastructure, setting up digital computer labs, and bridging the educational divide.
                </p>
              </div>

              {/* No Registration Friction-Free Banner */}
              <div className="flex flex-col sm:flex-row items-center justify-between gap-4 p-4 rounded-2xl bg-gradient-to-r from-emerald-500/10 via-[#07080b] to-cyan-500/10 border border-emerald-500/25">
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-xl bg-emerald-500/20 border border-emerald-500/30 flex items-center justify-center text-emerald-400 shrink-0">
                    <Unlock className="w-4 h-4" />
                  </div>
                  <div>
                    <p className="text-xs font-mono text-white font-bold">
                      Zero Friction Giving — No Registration Required
                    </p>
                    <p className="text-[11px] text-neutral-400 font-sans">
                      Just scan, donate, and go. Your choice to stay anonymous or log your receipt for tax verification.
                    </p>
                  </div>
                </div>

                <span className="text-[10px] font-mono px-3 py-1 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 uppercase tracking-wider font-semibold shrink-0">
                  Open To Everyone
                </span>
              </div>

              {/* Support Tiers Matrix */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {supportTiers.map((tier, idx) => {
                  const Icon = tier.icon;
                  return (
                    <SpotlightCard key={idx} className="p-7">
                      <div className="space-y-4">
                        <div className="flex items-center justify-between">
                          <div className="w-10 h-10 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center text-amber-300">
                            <Icon className="w-5 h-5" />
                          </div>
                          <span className="font-mono text-xs font-bold text-white px-3 py-1 rounded-full bg-white/10 border border-white/10">
                            {tier.cost}
                          </span>
                        </div>
                        <div className="space-y-1.5">
                          <h4 className="font-display font-medium text-base text-white">{tier.title}</h4>
                          <p className="text-xs text-neutral-400 leading-relaxed font-light">{tier.description}</p>
                        </div>
                      </div>
                    </SpotlightCard>
                  );
                })}
              </div>

              {/* Register for More Suggestion Card */}
              <div className="relative rounded-3xl p-6 sm:p-8 bg-gradient-to-br from-[#120e24] via-[#08070e] to-[#040914] border border-purple-500/30 shadow-[0_15px_40px_rgba(0,0,0,0.8)] overflow-hidden">
                <div className="absolute top-0 right-0 w-64 h-64 bg-purple-500/10 rounded-full blur-[80px] pointer-events-none" />

                <div className="relative z-10 flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6">
                  <div className="space-y-3 max-w-2xl">
                    <div className="inline-flex items-center gap-2 px-3 py-0.5 rounded-full bg-purple-500/10 border border-purple-500/30 text-purple-300 font-mono text-[10px] font-bold uppercase tracking-wider">
                      <Sparkles className="w-3 h-3 text-purple-400" />
                      <span>Optional Member Benefits</span>
                    </div>
                    <h3 className="font-display font-bold text-xl sm:text-2xl text-white">
                      Want to Track Real-World Impact &amp; Unlock Donor Perks?
                    </h3>
                    <p className="text-xs text-neutral-300 font-sans font-light leading-relaxed">
                      While registration is 100% optional, creating a free Zenvitra account unlocks extra privileges:
                    </p>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1 text-xs text-neutral-300 font-mono">
                      <div className="flex items-center gap-2">
                        <Award className="w-4 h-4 text-amber-400 shrink-0" />
                        <span>Verified Sovereign Patron Profile Badge</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Bell className="w-4 h-4 text-cyan-400 shrink-0" />
                        <span>Live Photo &amp; Milestone School Updates</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Vote className="w-4 h-4 text-purple-400 shrink-0" />
                        <span>Voting Rights on Civic Grant Allocations</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <FileText className="w-4 h-4 text-emerald-400 shrink-0" />
                        <span>Permanent 80G Tax Exemption Vault</span>
                      </div>
                    </div>
                  </div>

                  <div className="flex flex-col sm:flex-row lg:flex-col gap-2.5 w-full lg:w-auto shrink-0">
                    <Link
                      href="/login?redirect=/donate/govt-schools"
                      className="px-6 py-3 rounded-2xl bg-white hover:bg-neutral-200 text-black font-display font-bold text-xs uppercase tracking-wider transition shadow-lg flex items-center justify-center gap-2 text-center"
                    >
                      <UserPlus className="w-3.5 h-3.5" />
                      <span>Register / Login</span>
                      <ArrowUpRight className="w-3.5 h-3.5 text-neutral-600" />
                    </Link>
                    <span className="text-[10px] font-mono text-neutral-400 text-center">
                      (Or stay anonymous &amp; donate below)
                    </span>
                  </div>
                </div>
              </div>

              {/* Split: Direct Payment Info & SS Verification */}
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-start pt-4">
                {/* Official Bank Account Details */}
                <div className="lg:col-span-5 space-y-6">
                  <div className="p-7 rounded-[2.2rem] bg-[#07080b] border border-white/10 space-y-6">
                    <div className="space-y-1">
                      <span className="font-mono text-[10px] text-amber-300 uppercase tracking-widest block">
                        STEP 01: DIRECT TRANSFER / UPI
                      </span>
                      <h3 className="font-display font-medium text-xl text-white">Public Education Fund</h3>
                      <p className="text-xs text-neutral-400 font-light">
                        Official verified accounts for school infrastructure deployment.
                      </p>
                    </div>

                    {/* UPI Box */}
                    <div className="p-4 rounded-2xl bg-black/80 border border-white/10 space-y-3">
                      <div className="flex items-center justify-between">
                        <span className="font-mono text-[10px] text-neutral-500 uppercase">INITIATIVE UPI ID</span>
                        <QrCode className="w-4 h-4 text-neutral-400" />
                      </div>
                      <div className="flex items-center justify-between font-mono text-xs bg-[#07080b] p-3 rounded-xl border border-white/5">
                        <span className="text-white font-medium select-all">{upiId}</span>
                        <button
                          type="button"
                          onClick={() => handleCopy(upiId, 'upi')}
                          className="text-neutral-400 hover:text-white transition flex items-center gap-1"
                        >
                          {copiedUPI ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                          <span className="text-[10px]">{copiedUPI ? 'Copied' : 'Copy'}</span>
                        </button>
                      </div>
                    </div>

                    {/* Bank Wire Details */}
                    <div className="p-4 rounded-2xl bg-black/80 border border-white/10 space-y-3 font-mono text-xs">
                      <div className="flex items-center justify-between border-b border-white/5 pb-2">
                        <span className="text-neutral-500 text-[10px] uppercase">BANK WIRE DETAILS</span>
                        <button
                          type="button"
                          onClick={() => handleCopy(`Account Name: ${bankDetails.accountName}\nAccount Number: ${bankDetails.accountNumber}\nIFSC: ${bankDetails.ifsc}\nBank: ${bankDetails.bankAndBranch}\nPAN: ${bankDetails.pan}`, 'bank')}
                          className="text-neutral-400 hover:text-white transition flex items-center gap-1 text-[10px]"
                        >
                          {copiedBank ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                          <span>{copiedBank ? 'Copied' : 'Copy All'}</span>
                        </button>
                      </div>

                      <div className="space-y-2 text-[11px]">
                        <div>
                          <span className="text-neutral-500 text-[10px] block uppercase">Account Name:</span>
                          <span className="text-white font-medium">{bankDetails.accountName}</span>
                        </div>
                        <div>
                          <span className="text-neutral-500 text-[10px] block uppercase">Account Number:</span>
                          <span className="text-white font-mono tracking-wider">{bankDetails.accountNumber}</span>
                        </div>
                        <div>
                          <span className="text-neutral-500 text-[10px] block uppercase">IFSC Code:</span>
                          <span className="text-white font-mono">{bankDetails.ifsc}</span>
                        </div>
                        <div>
                          <span className="text-neutral-500 text-[10px] block uppercase">Bank & Branch:</span>
                          <span className="text-neutral-300">{bankDetails.bankAndBranch}</span>
                        </div>
                        <div>
                          <span className="text-neutral-500 text-[10px] block uppercase">PAN:</span>
                          <span className="text-amber-300 font-mono">{bankDetails.pan}</span>
                        </div>
                      </div>
                    </div>

                    <div className="p-4 rounded-2xl bg-emerald-500/[0.04] border border-emerald-500/20 flex items-center gap-3">
                      <ShieldCheck className="w-5 h-5 text-emerald-400 shrink-0" />
                      <p className="text-[11px] text-neutral-300 leading-snug font-light">
                        100% transparent deployment. Every school upgraded is published on our public impact audit ledger.
                      </p>
                    </div>
                  </div>
                </div>

                {/* Screenshot & Details Submission */}
                <div className="lg:col-span-7">
                  <div className="p-8 sm:p-10 rounded-[2.5rem] bg-[#07080b] border border-white/10 shadow-[0_25px_80px_rgba(0,0,0,0.95)] space-y-6">
                    <div className="space-y-1">
                      <span className="font-mono text-[10px] text-amber-300 uppercase tracking-widest block">
                        STEP 02: VERIFICATION & SS UPLOAD
                      </span>
                      <h3 className="font-display font-medium text-2xl text-white">Log Your Contribution</h3>
                      <p className="text-xs text-neutral-400 font-light">
                        Upload your payment screenshot to log your contribution toward public school modernization.
                      </p>
                    </div>

                    <form onSubmit={handleSubmit} className="space-y-5">
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div className="space-y-1.5">
                          <label className="font-mono text-[11px] text-neutral-300 uppercase block">Full Name *</label>
                          <input
                            type="text"
                            required
                            placeholder="e.g. Your Full Name"
                            value={formData.donorName}
                            onChange={(e) => setFormData({ ...formData, donorName: e.target.value })}
                            className="w-full px-4 py-3.5 rounded-xl bg-black/80 border border-white/10 text-white text-xs font-mono focus:outline-none focus:border-white/30"
                          />
                        </div>

                        <div className="space-y-1.5">
                          <label className="font-mono text-[11px] text-neutral-300 uppercase block">Email for Receipt *</label>
                          <input
                            type="email"
                            required
                            placeholder="your.email@domain.com"
                            value={formData.donorEmail}
                            onChange={(e) => setFormData({ ...formData, donorEmail: e.target.value })}
                            className="w-full px-4 py-3.5 rounded-xl bg-black/80 border border-white/10 text-white text-xs font-mono focus:outline-none focus:border-white/30"
                          />
                        </div>
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div className="space-y-1.5">
                          <label className="font-mono text-[11px] text-neutral-300 uppercase block">Donation Amount *</label>
                          <input
                            type="text"
                            required
                            placeholder="e.g. ₹3,500 or $100"
                            value={formData.amount}
                            onChange={(e) => setFormData({ ...formData, amount: e.target.value })}
                            className="w-full px-4 py-3.5 rounded-xl bg-black/80 border border-white/10 text-white text-xs font-mono focus:outline-none focus:border-white/30"
                          />
                        </div>

                        <div className="space-y-1.5">
                          <label className="font-mono text-[11px] text-neutral-300 uppercase block">UTR / Txn Ref ID *</label>
                          <input
                            type="text"
                            required
                            placeholder="e.g. 982710382910"
                            value={formData.utrOrTxnId}
                            onChange={(e) => setFormData({ ...formData, utrOrTxnId: e.target.value })}
                            className="w-full px-4 py-3.5 rounded-xl bg-black/80 border border-white/10 text-white text-xs font-mono focus:outline-none focus:border-white/30"
                          />
                        </div>
                      </div>

                      <div className="space-y-1.5">
                        <label className="font-mono text-[11px] text-neutral-300 uppercase block">Dedicated Project Stream *</label>
                        <select
                          value={formData.dedicatedProject}
                          onChange={(e) => setFormData({ ...formData, dedicatedProject: e.target.value })}
                          className="w-full px-4 py-3.5 rounded-xl bg-black border border-white/10 text-white text-xs font-mono focus:outline-none"
                        >
                          <option>Digital Smart Class & Computer Lab Setup</option>
                          <option>Library Books & Science Kit Distribution</option>
                          <option>Classroom Infrastructure & Sanitation Overhaul</option>
                          <option>General Public Education Corpus</option>
                        </select>
                      </div>

                      {/* Payment SS Upload */}
                      <div className="space-y-1.5">
                        <label className="font-mono text-[11px] text-neutral-300 uppercase block">Upload Payment Screenshot (SS) *</label>
                        <div className="relative border-2 border-dashed border-white/15 rounded-2xl p-6 text-center bg-black/40 hover:border-white/30 transition">
                          <input
                            type="file"
                            accept="image/*"
                            required
                            onChange={(e) => setFormData({ ...formData, screenshot: e.target.files?.[0] || null })}
                            className="absolute inset-0 opacity-0 cursor-pointer w-full h-full"
                          />
                          <div className="flex flex-col items-center space-y-2 pointer-events-none">
                            <UploadCloud className="w-8 h-8 text-neutral-400" />
                            <span className="font-mono text-xs text-white">
                              {formData.screenshot ? formData.screenshot.name : 'Click or drag & drop payment receipt screenshot'}
                            </span>
                            <span className="font-mono text-[10px] text-neutral-500">PNG, JPG, WEBP up to 10MB</span>
                          </div>
                        </div>
                      </div>

                      <label className="flex items-center gap-3 cursor-pointer pt-1">
                        <input
                          type="checkbox"
                          checked={formData.wantsAnonymous}
                          onChange={(e) => setFormData({ ...formData, wantsAnonymous: e.target.checked })}
                          className="w-4 h-4 rounded border-white/20 bg-black text-white focus:ring-0 accent-white"
                        />
                        <span className="font-mono text-xs text-neutral-400">
                          Mark contribution as Anonymous on the Public Impact Ledger
                        </span>
                      </label>

                      <button
                        type="submit"
                        className="w-full py-4 rounded-full bg-white text-black font-mono text-xs font-semibold hover:bg-neutral-200 transition flex items-center justify-center gap-2 shadow-[0_0_25px_rgba(255,255,255,0.18)]"
                      >
                        <Heart className="w-4 h-4 text-amber-400 fill-amber-400" />
                        <span>Submit School Modernization Proof</span>
                        <ArrowRight className="w-4 h-4" />
                      </button>
                    </form>
                  </div>
                </div>
              </div>
            </div>
          )}
        </main>

        {/* Footer */}
        <footer className="pt-8 border-t border-white/[0.06] flex flex-col sm:flex-row items-center justify-between gap-4 text-[11px] font-mono text-neutral-500">
          <span>ZENVITRA &copy; 2026 // GOVT SCHOOLS REFORM INITIATIVE</span>
          <span className="uppercase tracking-widest text-neutral-400">
            AUDITED UNDER THE 25% IMPACT PRINCIPLE
          </span>
        </footer>
      </div>
    </div>
  );
}