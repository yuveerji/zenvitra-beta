'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { 
  ArrowLeft, 
  ArrowRight, 
  Shield, 
  Heart, 
  Sparkles, 
  UploadCloud, 
  CheckCircle2,
  Unlock,
  Award,
  Vote,
  Bell,
  FileText,
  UserPlus,
  ArrowUpRight
} from 'lucide-react';
import { Navbar } from '@/components/layout/Navbar';
import { useAuth } from '@/context/AuthContext';
import { sheetSync } from '@/lib/googleSheets';

export default function InvestDonatePage() {
  const { isAuthenticated } = useAuth();
  const [activeTab, setActiveTab] = useState<'invest' | 'donate'>('invest');
  const [submitted, setSubmitted] = useState(false);

  // Investment State
  const [investData, setInvestData] = useState({
    name: '',
    email: '',
    amount: '',
    tier: 'Seed Allocation',
    intent: '',
  });

  // Donation State
  const [donateData, setDonateData] = useState({
    name: '',
    email: '',
    foundation: 'Youth Literacy & Education Trust',
    amount: '',
    screenshot: null as File | null,
  });

  const handleInvestSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    sheetSync.collab({
      organizationName: investData.name || 'Private Investor',
      representativeName: investData.name,
      officialEmail: investData.email,
      collabType: `Investment: ${investData.tier}`,
      proposalSummary: investData.intent || `Target Investment: ${investData.amount}`,
      budgetResourceScope: investData.amount,
      stage: 'INQUIRY_RECEIVED',
    });
    setSubmitted(true);
  };

  const handleDonateSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    sheetSync.impactLedger({
      donorName: donateData.name,
      donorEmail: donateData.email,
      voluntaryAmountInr: donateData.amount,
      utrTransactionId: `DON-${Date.now().toString().slice(-6)}`,
      targetProjectStream: donateData.foundation,
      auditStatus: 'QUEUED_FOR_AUDIT',
      verificationDetails: '25% Profit Civic Endowment Allocation',
    });
    setSubmitted(true);
  };

  return (
    <div className="min-h-screen bg-[#030405] text-white selection:bg-white selection:text-black font-sans relative overflow-x-hidden pt-16 sm:pt-20">
      <Navbar />

      {/* Background Grid */}
      <div className="fixed inset-0 pointer-events-none bg-[radial-gradient(#ffffff08_1px,transparent_1px)] [background-size:32px_32px] opacity-40 z-0" />

      <div className="relative z-10 max-w-4xl mx-auto px-6 sm:px-12 py-8 min-h-screen flex flex-col justify-between">

        {/* Main Content Area */}
        <main className="py-12 flex-1">
          {submitted ? (
            <div className="rounded-[2.8rem] bg-[#07080b] border border-white/[0.1] p-10 sm:p-14 text-center space-y-6 shadow-[0_30px_90px_rgba(0,0,0,0.95)] max-w-xl mx-auto">
              <div className="w-16 h-16 rounded-2xl bg-emerald-400/10 border border-emerald-400/35 mx-auto flex items-center justify-center text-emerald-400">
                <CheckCircle2 className="w-8 h-8" />
              </div>
              <h2 className="font-display font-medium text-3xl text-white">
                {activeTab === 'invest' ? 'Investment Dossier Logged' : 'Donation Screenshot Received'}
              </h2>
              <p className="text-sm text-neutral-400 font-light leading-relaxed">
                {activeTab === 'invest'
                  ? 'Our capital deployment committee will review your inquiry and reach out securely.'
                  : 'Thank you for supporting verified charity foundations. Your payment screenshot is queued for audit under the 25% Impact Principle.'}
              </p>
              <button
                onClick={() => {
                  setSubmitted(false);
                  setInvestData({ name: '', email: '', amount: '', tier: 'Seed Allocation', intent: '' });
                  setDonateData({ name: '', email: '', foundation: 'Youth Literacy & Education Trust', amount: '', screenshot: null });
                }}
                className="px-8 py-3.5 rounded-full bg-white text-black font-mono text-xs font-semibold hover:bg-neutral-200 transition"
              >
                Submit Another Record
              </button>
            </div>
          ) : (
            <div className="space-y-8">
              {/* Heading */}
              <div className="text-center space-y-3 max-w-xl mx-auto">
                <h1 className="font-display font-medium text-3xl sm:text-5xl text-white tracking-tight">
                  Capital & Charitable Impact
                </h1>
                <p className="text-xs sm:text-sm text-neutral-400 font-light leading-relaxed">
                  Choose between direct investment into Zenvitra’s sovereign infrastructure or contributing to verified partner charities via payment screenshot verification.
                </p>

                {/* No Registration Required Banner */}
                <div className="flex flex-col sm:flex-row items-center justify-between gap-3 p-3.5 rounded-2xl bg-emerald-500/10 border border-emerald-500/25 text-left mt-2">
                  <div className="flex items-center gap-2.5">
                    <Unlock className="w-4 h-4 text-emerald-400 shrink-0" />
                    <div>
                      <p className="text-xs font-mono text-white font-bold">Donate &amp; Go — No Registration Required</p>
                      <p className="text-[10px] text-neutral-400 font-sans">Anyone can contribute directly and anonymously without making an account.</p>
                    </div>
                  </div>
                  <span className="text-[9px] font-mono px-2.5 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 uppercase tracking-wider font-semibold shrink-0">
                    Open To All
                  </span>
                </div>

                {/* Subpage Tabs Switcher */}
                <div className="flex items-center justify-center gap-2 pt-4">
                  <button
                    onClick={() => setActiveTab('invest')}
                    className={`px-6 py-3 rounded-full font-mono text-xs tracking-wider transition-all flex items-center gap-2 ${
                      activeTab === 'invest'
                        ? 'bg-white text-black font-semibold shadow-[0_0_20px_rgba(255,255,255,0.2)]'
                        : 'bg-black/60 text-neutral-400 border border-white/10 hover:border-white/30'
                    }`}
                  >
                    <Shield className="w-3.5 h-3.5" />
                    <span>Invest in Zenvitra</span>
                  </button>

                  <button
                    onClick={() => setActiveTab('donate')}
                    className={`px-6 py-3 rounded-full font-mono text-xs tracking-wider transition-all flex items-center gap-2 ${
                      activeTab === 'donate'
                        ? 'bg-white text-black font-semibold shadow-[0_0_20px_rgba(255,255,255,0.2)]'
                        : 'bg-black/60 text-neutral-400 border border-white/10 hover:border-white/30'
                    }`}
                  >
                    <Heart className="w-3.5 h-3.5" />
                    <span>Donate to Charities</span>
                  </button>
                </div>
              </div>

              {/* Suggestion Card for Registration (Only for non-logged-in visitors) */}
              {!isAuthenticated && (
                <div className="max-w-xl mx-auto rounded-2xl p-5 bg-gradient-to-r from-purple-500/10 via-[#07080b] to-cyan-500/10 border border-purple-500/25 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                  <div className="space-y-1">
                    <div className="flex items-center gap-2 text-purple-300 font-mono text-[10px] font-bold uppercase">
                      <Sparkles className="w-3 h-3" />
                      <span>Optional Patron Perks</span>
                    </div>
                    <p className="text-xs text-white font-medium">Want to link contributions to your profile &amp; vote on future grants?</p>
                    <p className="text-[10px] text-neutral-400 font-mono">Get Patron badges, live impact milestones, and 80G tax receipts.</p>
                  </div>
                  <Link
                    href="/login?redirect=/invest-donate"
                    className="px-4 py-2 rounded-xl bg-white hover:bg-neutral-200 text-black font-display font-bold text-[11px] uppercase tracking-wider transition shrink-0 flex items-center gap-1.5"
                  >
                    <UserPlus className="w-3 h-3" />
                    <span>Register Free</span>
                  </Link>
                </div>
              )}

              {/* Form Container */}
              <div className="max-w-xl mx-auto rounded-[2.8rem] bg-[#07080b] border border-white/[0.09] p-8 sm:p-12 shadow-[0_25px_80px_rgba(0,0,0,0.95)]">
                {activeTab === 'invest' ? (
                  /* --- INVEST FORM --- */
                  <form onSubmit={handleInvestSubmit} className="space-y-6">
                    <div className="space-y-1.5">
                      <span className="font-mono text-[10px] text-amber-300 uppercase tracking-widest">INFRASTRUCTURE ALLOCATION</span>
                      <h3 className="font-display font-medium text-xl text-white">Zenvitra Capital Syndicate</h3>
                    </div>

                    <div className="space-y-4">
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div className="space-y-1.5">
                          <label className="font-mono text-[11px] text-neutral-300 uppercase">Full Name / Entity *</label>
                          <input
                            type="text"
                            required
                            placeholder="e.g. Vertex Ventures"
                            value={investData.name}
                            onChange={(e) => setInvestData({ ...investData, name: e.target.value })}
                            className="w-full px-4 py-3.5 rounded-xl bg-black/80 border border-white/10 text-white text-xs font-mono focus:outline-none focus:border-white/30"
                          />
                        </div>
                        <div className="space-y-1.5">
                          <label className="font-mono text-[11px] text-neutral-300 uppercase">Secure Email *</label>
                          <input
                            type="email"
                            required
                            placeholder="investor@domain.com"
                            value={investData.email}
                            onChange={(e) => setInvestData({ ...investData, email: e.target.value })}
                            className="w-full px-4 py-3.5 rounded-xl bg-black/80 border border-white/10 text-white text-xs font-mono focus:outline-none focus:border-white/30"
                          />
                        </div>
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div className="space-y-1.5">
                          <label className="font-mono text-[11px] text-neutral-300 uppercase">Investment Tier *</label>
                          <select
                            value={investData.tier}
                            onChange={(e) => setInvestData({ ...investData, tier: e.target.value })}
                            className="w-full px-4 py-3.5 rounded-xl bg-black border border-white/10 text-white text-xs font-mono focus:outline-none"
                          >
                            <option>Seed Allocation</option>
                            <option>Strategic Syndicate</option>
                            <option>Institutional Anchor</option>
                          </select>
                        </div>
                        <div className="space-y-1.5">
                          <label className="font-mono text-[11px] text-neutral-300 uppercase">Committed Amount ($USD) *</label>
                          <input
                            type="text"
                            required
                            placeholder="e.g. $25,000"
                            value={investData.amount}
                            onChange={(e) => setInvestData({ ...investData, amount: e.target.value })}
                            className="w-full px-4 py-3.5 rounded-xl bg-black/80 border border-white/10 text-white text-xs font-mono focus:outline-none focus:border-white/30"
                          />
                        </div>
                      </div>

                      <div className="space-y-1.5">
                        <label className="font-mono text-[11px] text-neutral-300 uppercase">Strategic Intent & Value Add *</label>
                        <textarea
                          rows={3}
                          required
                          placeholder="How can your capital or network accelerate Zenvitra's sovereign ecosystem?"
                          value={investData.intent}
                          onChange={(e) => setInvestData({ ...investData, intent: e.target.value })}
                          className="w-full px-4 py-3.5 rounded-xl bg-black/80 border border-white/10 text-white text-xs font-mono focus:outline-none focus:border-white/30 resize-none"
                        />
                      </div>
                    </div>

                    <button
                      type="submit"
                      className="w-full py-4 rounded-full bg-white text-black font-mono text-xs font-semibold hover:bg-neutral-200 transition flex items-center justify-center gap-2 shadow-[0_0_25px_rgba(255,255,255,0.18)]"
                    >
                      <span>Submit Investment Inquiry</span>
                      <ArrowRight className="w-4 h-4" />
                    </button>
                  </form>
                ) : (
                  /* --- DONATE FORM WITH SS UPLOAD --- */
                  <form onSubmit={handleDonateSubmit} className="space-y-6">
                    <div className="space-y-1.5">
                      <span className="font-mono text-[10px] text-rose-400 uppercase tracking-widest">VERIFIED CHARITY NETWORK</span>
                      <h3 className="font-display font-medium text-xl text-white">Foundation Donation & SS Audit</h3>
                    </div>

                    <div className="space-y-4">
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div className="space-y-1.5">
                          <label className="font-mono text-[11px] text-neutral-300 uppercase">Donor Full Name *</label>
                          <input
                            type="text"
                            required
                            placeholder="e.g. Full Name"
                            value={donateData.name}
                            onChange={(e) => setDonateData({ ...donateData, name: e.target.value })}
                            className="w-full px-4 py-3.5 rounded-xl bg-black/80 border border-white/10 text-white text-xs font-mono focus:outline-none focus:border-white/30"
                          />
                        </div>
                        <div className="space-y-1.5">
                          <label className="font-mono text-[11px] text-neutral-300 uppercase">Email for Receipt *</label>
                          <input
                            type="email"
                            required
                            placeholder="your.email@domain.com"
                            value={donateData.email}
                            onChange={(e) => setDonateData({ ...donateData, email: e.target.value })}
                            className="w-full px-4 py-3.5 rounded-xl bg-black/80 border border-white/10 text-white text-xs font-mono focus:outline-none focus:border-white/30"
                          />
                        </div>
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div className="space-y-1.5">
                          <label className="font-mono text-[11px] text-neutral-300 uppercase">Select Foundation *</label>
                          <select
                            value={donateData.foundation}
                            onChange={(e) => setDonateData({ ...donateData, foundation: e.target.value })}
                            className="w-full px-4 py-3.5 rounded-xl bg-black border border-white/10 text-white text-xs font-mono focus:outline-none"
                          >
                            <option>Youth Literacy & Education Trust</option>
                            <option>Global Youth Climate Action Fund</option>
                            <option>Underprivileged Tech Access Initiative</option>
                          </select>
                        </div>
                        <div className="space-y-1.5">
                          <label className="font-mono text-[11px] text-neutral-300 uppercase">Donation Amount *</label>
                          <input
                            type="text"
                            required
                            placeholder="e.g. $100 / ₹5,000"
                            value={donateData.amount}
                            onChange={(e) => setDonateData({ ...donateData, amount: e.target.value })}
                            className="w-full px-4 py-3.5 rounded-xl bg-black/80 border border-white/10 text-white text-xs font-mono focus:outline-none focus:border-white/30"
                          />
                        </div>
                      </div>

                      {/* Payment Screenshot Upload Box */}
                      <div className="space-y-1.5">
                        <label className="font-mono text-[11px] text-neutral-300 uppercase">Upload Payment Screenshot (SS) *</label>
                        <div className="relative border-2 border-dashed border-white/15 rounded-2xl p-6 text-center bg-black/40 hover:border-white/30 transition">
                          <input
                            type="file"
                            accept="image/*"
                            required
                            onChange={(e) => setDonateData({ ...donateData, screenshot: e.target.files?.[0] || null })}
                            className="absolute inset-0 opacity-0 cursor-pointer w-full h-full"
                          />
                          <div className="flex flex-col items-center space-y-2 pointer-events-none">
                            <UploadCloud className="w-8 h-8 text-neutral-400" />
                            <span className="font-mono text-xs text-white">
                              {donateData.screenshot ? donateData.screenshot.name : 'Click to upload or drag & drop payment SS'}
                            </span>
                            <span className="font-mono text-[10px] text-neutral-500">PNG, JPG, WEBP up to 10MB</span>
                          </div>
                        </div>
                      </div>
                    </div>

                    <button
                      type="submit"
                      className="w-full py-4 rounded-full bg-white text-black font-mono text-xs font-semibold hover:bg-neutral-200 transition flex items-center justify-center gap-2 shadow-[0_0_25px_rgba(255,255,255,0.18)]"
                    >
                      <span>Submit Donation Proof (SS)</span>
                      <ArrowRight className="w-4 h-4" />
                    </button>
                  </form>
                )}
              </div>
            </div>
          )}
        </main>

        {/* Footer */}
        <footer className="pt-8 border-t border-white/[0.06] flex items-center justify-between text-[11px] font-mono text-neutral-500">
          <span>ZENVITRA &copy; 2026 // CAPITAL & CHARITY LEDGER</span>
          <span className="uppercase tracking-widest text-neutral-400">VERIFIED COMPLIANCE</span>
        </footer>
      </div>
    </div>
  );
}