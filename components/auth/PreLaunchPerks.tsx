'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { 
  Crown, 
  ShieldCheck, 
  Zap, 
  Award, 
  Sparkles, 
  CheckCircle2,
  Ticket,
  FileCheck2,
  Users,
  ArrowUpRight,
  ChevronRight,
  Info
} from 'lucide-react';

interface PreLaunchPerksProps {
  mode?: 'register' | 'login';
  className?: string;
  showProposedBannerOnly?: boolean;
}

export function PreLaunchPerks({ 
  mode = 'register', 
  className = '',
  showProposedBannerOnly = false 
}: PreLaunchPerksProps) {
  const isRegister = mode === 'register';
  const [activeTierTab, setActiveTierTab] = useState<'100' | '500' | 'community'>('100');

  // The 7 Launch Perks — "THE ZENVITRA FOUNDING SEVEN"
  const foundingSevenPerks = [
    {
      id: 'founding-passport',
      icon: ShieldCheck,
      iconColor: 'text-amber-400',
      badgeBg: 'bg-amber-400/10 border-amber-400/30 text-amber-300',
      number: '01',
      title: 'ZEN.PASSPORT — Founding Edition',
      subtitle: 'Permanent Founding Identity',
      desc: 'Exclusive permanent Founding Member designation on your profile, unique preregistration ID, digital membership card, and permanent founding badge on ZEN.PASSPORT.',
      tag: 'Permanent Badge'
    },
    {
      id: 'priority-access',
      icon: Zap,
      iconColor: 'text-cyan-400',
      badgeBg: 'bg-cyan-400/10 border-cyan-400/30 text-cyan-300',
      number: '02',
      title: 'Priority Platform & Username Access',
      subtitle: 'Early Activation Clearance',
      desc: 'Early account activation before the general public, first opportunity to claim your preferred username handle, and priority access to beta feature testing.',
      tag: 'First Handle Pick'
    },
    {
      id: 'founding-certificate',
      icon: FileCheck2,
      iconColor: 'text-emerald-400',
      badgeBg: 'bg-emerald-400/10 border-emerald-400/30 text-emerald-300',
      number: '03',
      title: 'Personalized Founding Member Certificate',
      subtitle: 'Verifiable Digital Credentials',
      desc: 'Personalized digital certificate recognizing your pre-launch contribution, equipped with unique verification ID and shareable credential badge.',
      tag: 'Digital Certificate'
    },
    {
      id: 'event-waivers',
      icon: Ticket,
      iconColor: 'text-purple-400',
      badgeBg: 'bg-purple-400/10 border-purple-400/30 text-purple-300',
      number: '04',
      title: 'Event Fee Waivers & Tiered Discounts',
      subtitle: 'Up to 100% Event Benefit',
      desc: 'First 25 verified preregistrants receive a 100% event fee waiver. Ranks 26–100 receive 25% off, and ranks 101–500 receive 15% off one eligible paid ZENVITRA event registration.',
      tag: 'Up to 100% Waiver'
    },
    {
      id: 'matrix-allocation',
      icon: Crown,
      iconColor: 'text-amber-400',
      badgeBg: 'bg-amber-400/10 border-amber-400/30 text-amber-300',
      number: '05',
      title: 'In MUNs Priority Matrix Allocation',
      subtitle: 'ZENVITRA Infrastructure for MUNs',
      desc: 'ZENVITRA is not a MUN website — it is the digital operating platform for MUNs. Preregistered delegates receive first-priority country matrix and portfolio allocations across partner MUNs.',
      tag: 'In MUNs Priority'
    },
    {
      id: 'inner-circle',
      icon: Users,
      iconColor: 'text-blue-400',
      badgeBg: 'bg-blue-400/10 border-blue-400/30 text-blue-300',
      number: '06',
      title: 'ZEN.INNER CIRCLE Community',
      subtitle: 'Direct Feedback & Feature Voting',
      desc: 'Clearance into the private Founding Members channel. Sneak peeks of upcoming features, launch announcements before public release, and direct feature voting polls.',
      tag: 'Early Community'
    },
    {
      id: 'points-referrals',
      icon: Sparkles,
      iconColor: 'text-rose-400',
      badgeBg: 'bg-rose-400/10 border-rose-400/30 text-rose-300',
      number: '07',
      title: 'ZEN.POINTS Welcome Bonus & Referrals',
      subtitle: 'Civic Rewards & Peer Milestones',
      desc: 'Starting balance of civic reward points upon account activation, personal referral links, and cosmetic badges for bringing verified peers into the ecosystem.',
      tag: 'Welcome Points'
    }
  ];

  return (
    <div className={`w-full max-w-5xl mx-auto space-y-10 ${className}`}>
      
      {/* ─── SECTION 6 BANNER: "PROPOSED WEBSITE SECTION" FROM SPEC ─── */}
      <div className="relative rounded-3xl bg-[#090b10] border border-white/10 p-6 sm:p-10 text-left overflow-hidden shadow-2xl">
        {/* Ambient Top Glow */}
        <div className="absolute -top-24 left-1/2 -translate-x-1/2 w-96 h-48 bg-gradient-to-b from-amber-400/15 via-cyan-400/10 to-transparent blur-3xl pointer-events-none" />

        <div className="relative z-10 space-y-6">
          <div className="space-y-2">
            <span className="text-[10px] font-mono text-neutral-400 uppercase tracking-widest block font-bold">
              ZENVITRA // FOUNDING MEMBERS PROGRAMME
            </span>
            <h2 
              className="text-2xl sm:text-4xl font-extrabold text-white tracking-tight leading-tight uppercase"
              style={{ fontFamily: 'Clash Display, var(--font-space), sans-serif' }}
            >
              Don&apos;t Just Join Later.<br className="hidden sm:inline" /> Be Here From The Beginning.
            </h2>
            <p className="text-sm sm:text-base text-neutral-300 font-sans max-w-2xl">
              Preregister for ZENVITRA and secure your place among our Founding Members.
            </p>
          </div>

          {/* 3 Headline Feature Pillars (Matching User's Screenshot Exactly) */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 pt-4 pb-2 border-t border-b border-white/10">
            {/* Pillar 1 */}
            <div className="space-y-1.5 flex flex-col justify-start">
              <div className="w-8 h-8 rounded-lg bg-white/[0.05] border border-white/10 flex items-center justify-center text-amber-400 mb-1">
                <Award className="w-4 h-4" />
              </div>
              <span className="text-xl sm:text-2xl font-bold text-white tracking-tight">
                Permanent
              </span>
              <span className="text-xs text-neutral-400 font-sans">
                Founding status
              </span>
            </div>

            {/* Pillar 2 */}
            <div className="space-y-1.5 flex flex-col justify-start">
              <div className="w-8 h-8 rounded-lg bg-white/[0.05] border border-white/10 flex items-center justify-center text-purple-400 mb-1">
                <Ticket className="w-4 h-4" />
              </div>
              <span className="text-xl sm:text-2xl font-bold text-white tracking-tight">
                Up to 100%
              </span>
              <span className="text-xs text-neutral-400 font-sans">
                Eligible event fee benefit
              </span>
            </div>

            {/* Pillar 3 */}
            <div className="space-y-1.5 flex flex-col justify-start">
              <div className="w-8 h-8 rounded-lg bg-white/[0.05] border border-white/10 flex items-center justify-center text-cyan-400 mb-1">
                <Zap className="w-4 h-4" />
              </div>
              <span className="text-xl sm:text-2xl font-bold text-white tracking-tight">
                Early
              </span>
              <span className="text-xs text-neutral-400 font-sans">
                Platform access
              </span>
            </div>
          </div>

          {/* Footnote and CTA */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pt-1">
            <p className="text-[11px] text-neutral-400 font-sans max-w-xl leading-relaxed">
              The 100% fee waiver is limited to the first 25 eligible verified preregistrants. Benefits depend on the published terms.
            </p>
            {isRegister ? (
              <a 
                href="#preregister-form"
                className="inline-flex items-center justify-center gap-2 px-6 py-3 rounded-full bg-white text-black font-bold text-xs uppercase tracking-wider hover:bg-neutral-200 transition shadow-lg shrink-0 cursor-pointer"
              >
                <span>Claim Your Place</span>
                <ArrowUpRight className="w-4 h-4" />
              </a>
            ) : (
              <Link 
                href="/pre-register"
                className="inline-flex items-center justify-center gap-2 px-6 py-3 rounded-full bg-white text-black font-bold text-xs uppercase tracking-wider hover:bg-neutral-200 transition shadow-lg shrink-0 cursor-pointer"
              >
                <span>Visit ZENVITRA</span>
                <ArrowUpRight className="w-4 h-4" />
              </Link>
            )}
          </div>
        </div>
      </div>

      {!showProposedBannerOnly && (
        <>
          {/* ─── THE ZENVITRA FOUNDING SEVEN PERKS ─── */}
          <div className="space-y-4">
            <div className="text-center space-y-2 max-w-2xl mx-auto">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/[0.05] border border-white/10 text-[10px] font-mono tracking-widest text-amber-300 uppercase">
                <Sparkles className="w-3 h-3 text-amber-400" />
                <span>THE ZENVITRA FOUNDING SEVEN</span>
              </div>
              <h3 
                className="text-xl sm:text-3xl font-bold text-white tracking-tight"
                style={{ fontFamily: 'Clash Display, var(--font-space), sans-serif' }}
              >
                Your Early Access. Your Permanent Legacy.
              </h3>
              <p className="text-xs sm:text-sm text-neutral-400 leading-relaxed font-sans">
                Built by youth, for youth. Every eligible preregistrant receives permanent founding recognition, priority infrastructure access, and real utility across the network.
              </p>
            </div>

            {/* Perks Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 pt-4">
              {foundingSevenPerks.map((perk, index) => {
                const Icon = perk.icon;
                return (
                  <div
                    key={perk.id}
                    className={`group relative rounded-2xl bg-[#07090e]/80 hover:bg-[#0b0e17] border border-white/10 hover:border-white/20 p-5 transition-all duration-300 flex flex-col justify-between space-y-4 shadow-lg backdrop-blur-xl hover:shadow-[0_10px_30px_rgba(0,0,0,0.5)] ${
                      index === 6 ? 'md:col-span-2 lg:col-span-1' : ''
                    }`}
                  >
                    <div className="space-y-3">
                      <div className="flex items-center justify-between gap-2">
                        <div className="w-9 h-9 rounded-xl bg-white/[0.04] border border-white/10 flex items-center justify-center shrink-0 group-hover:scale-105 transition-transform">
                          <Icon className={`w-4 h-4 ${perk.iconColor}`} />
                        </div>
                        <span className={`px-2.5 py-0.5 rounded-full text-[9px] font-mono font-bold border ${perk.badgeBg}`}>
                          {perk.tag}
                        </span>
                      </div>

                      <div>
                        <div className="text-[10px] font-mono text-neutral-500 uppercase tracking-widest">
                          PERK {perk.number} // {perk.subtitle}
                        </div>
                        <h4 className="text-sm font-bold text-white group-hover:text-amber-200 transition mt-0.5">
                          {perk.title}
                        </h4>
                      </div>

                      <p className="text-xs text-neutral-400 leading-relaxed font-sans">
                        {perk.desc}
                      </p>
                    </div>

                    <div className="pt-2 border-t border-white/[0.06] flex items-center gap-1.5 text-[11px] font-mono text-emerald-400">
                      <CheckCircle2 className="w-3.5 h-3.5 shrink-0" />
                      <span>{isRegister ? 'Guaranteed on Preregistration' : 'Active Founding Privilege'}</span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* ─── TIERED ELIGIBILITY MATRIX: THE EARLIER YOU JOIN, THE MORE YOU UNLOCK ─── */}
          <div className="rounded-3xl bg-[#090b12] border border-white/10 p-6 sm:p-8 space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-white/10 pb-4">
              <div>
                <span className="text-[10px] font-mono text-amber-400 uppercase tracking-widest font-bold block">
                  TIERED BENEFIT STRUCTURE
                </span>
                <h4 className="text-lg sm:text-xl font-bold text-white mt-1">
                  The Earlier You Join, The More You Unlock
                </h4>
              </div>

              {/* Tier Switcher Tabs */}
              <div className="inline-flex rounded-xl bg-black/60 p-1 border border-white/10 text-xs font-mono">
                <button
                  type="button"
                  onClick={() => setActiveTierTab('100')}
                  className={`px-3 py-1.5 rounded-lg transition font-bold cursor-pointer ${
                    activeTierTab === '100' ? 'bg-amber-400 text-black shadow' : 'text-neutral-400 hover:text-white'
                  }`}
                >
                  FOUNDING 100
                </button>
                <button
                  type="button"
                  onClick={() => setActiveTierTab('500')}
                  className={`px-3 py-1.5 rounded-lg transition font-bold cursor-pointer ${
                    activeTierTab === '500' ? 'bg-cyan-400 text-black shadow' : 'text-neutral-400 hover:text-white'
                  }`}
                >
                  FOUNDING 500
                </button>
                <button
                  type="button"
                  onClick={() => setActiveTierTab('community')}
                  className={`px-3 py-1.5 rounded-lg transition font-bold cursor-pointer ${
                    activeTierTab === 'community' ? 'bg-white text-black shadow' : 'text-neutral-400 hover:text-white'
                  }`}
                >
                  COMMUNITY
                </button>
              </div>
            </div>

            {/* Active Tier Card */}
            {activeTierTab === '100' && (
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-center">
                <div className="md:col-span-2 space-y-3">
                  <div className="inline-flex items-center gap-2 px-2.5 py-0.5 rounded-full bg-amber-400/10 border border-amber-400/30 text-[10px] font-mono text-amber-300 font-bold uppercase">
                    Highest Tier // First 100 Verified Preregistrations
                  </div>
                  <h5 className="text-xl font-bold text-white">Tier 01 — FOUNDING 100</h5>
                  <p className="text-xs text-neutral-300 leading-relaxed font-sans">
                    The highest recognition tier. First 25 verified preregistrants receive a <strong className="text-white">100% registration fee waiver</strong> for one eligible ZENVITRA event. Ranks 26–100 receive a <strong className="text-white">25% discount</strong> on their eligible event registration fee.
                  </p>
                  <ul className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs text-neutral-300 font-sans pt-2">
                    <li className="flex items-center gap-2">
                      <CheckCircle2 className="w-3.5 h-3.5 text-amber-400 shrink-0" />
                      <span>Permanent ZEN.PASSPORT Founding Badge</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <CheckCircle2 className="w-3.5 h-3.5 text-amber-400 shrink-0" />
                      <span>Personalized Digital Certificate</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <CheckCircle2 className="w-3.5 h-3.5 text-amber-400 shrink-0" />
                      <span>Priority Early Platform Access Rollout</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <CheckCircle2 className="w-3.5 h-3.5 text-amber-400 shrink-0" />
                      <span>First Opportunity to Claim Username</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <CheckCircle2 className="w-3.5 h-3.5 text-amber-400 shrink-0" />
                      <span>In MUNs Priority Matrix Allocation</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <CheckCircle2 className="w-3.5 h-3.5 text-amber-400 shrink-0" />
                      <span>Founding Members Inner Circle</span>
                    </li>
                  </ul>
                </div>

                <div className="p-5 rounded-2xl bg-black/60 border border-amber-400/20 text-center space-y-3">
                  <span className="text-[10px] font-mono text-neutral-400 uppercase tracking-widest block">
                    EVENT BENEFIT VALUE
                  </span>
                  <div className="text-3xl font-extrabold text-amber-300 font-mono">
                    100% / 25%
                  </div>
                  <p className="text-[11px] text-neutral-400 font-sans">
                    100% waiver for ranks 1–25; 25% discount for ranks 26–100 on one eligible event.
                  </p>
                </div>
              </div>
            )}

            {activeTierTab === '500' && (
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-center">
                <div className="md:col-span-2 space-y-3">
                  <div className="inline-flex items-center gap-2 px-2.5 py-0.5 rounded-full bg-cyan-400/10 border border-cyan-400/30 text-[10px] font-mono text-cyan-300 font-bold uppercase">
                    Early Access Tier // Verified Members Ranked 101–500
                  </div>
                  <h5 className="text-xl font-bold text-white">Tier 02 — FOUNDING 500</h5>
                  <p className="text-xs text-neutral-300 leading-relaxed font-sans">
                    Reserved for members who join before the 500 mark. Enjoy a <strong className="text-white">15% discount</strong> on one eligible paid event, early platform rollout, username reservation windows, and feature polls.
                  </p>
                  <ul className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs text-neutral-300 font-sans pt-2">
                    <li className="flex items-center gap-2">
                      <CheckCircle2 className="w-3.5 h-3.5 text-cyan-400 shrink-0" />
                      <span>Permanent ZEN.PASSPORT Founding Badge</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <CheckCircle2 className="w-3.5 h-3.5 text-cyan-400 shrink-0" />
                      <span>Personalized Digital Certificate</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <CheckCircle2 className="w-3.5 h-3.5 text-cyan-400 shrink-0" />
                      <span>Early Platform Access During Rollout</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <CheckCircle2 className="w-3.5 h-3.5 text-cyan-400 shrink-0" />
                      <span>Early Username Claim Window</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <CheckCircle2 className="w-3.5 h-3.5 text-cyan-400 shrink-0" />
                      <span>In MUNs Priority Matrix Allocation</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <CheckCircle2 className="w-3.5 h-3.5 text-cyan-400 shrink-0" />
                      <span>Feature Polls & Community Access</span>
                    </li>
                  </ul>
                </div>

                <div className="p-5 rounded-2xl bg-black/60 border border-cyan-400/20 text-center space-y-3">
                  <span className="text-[10px] font-mono text-neutral-400 uppercase tracking-widest block">
                    EVENT BENEFIT VALUE
                  </span>
                  <div className="text-3xl font-extrabold text-cyan-300 font-mono">
                    15% OFF
                  </div>
                  <p className="text-[11px] text-neutral-400 font-sans">
                    15% discount on one eligible paid ZENVITRA event registration fee.
                  </p>
                </div>
              </div>
            )}

            {activeTierTab === 'community' && (
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-center">
                <div className="md:col-span-2 space-y-3">
                  <div className="inline-flex items-center gap-2 px-2.5 py-0.5 rounded-full bg-white/10 border border-white/20 text-[10px] font-mono text-white font-bold uppercase">
                    Founding Status // All Eligible Preregistrants
                  </div>
                  <h5 className="text-xl font-bold text-white">Tier 03 — FOUNDING COMMUNITY</h5>
                  <p className="text-xs text-neutral-300 leading-relaxed font-sans">
                    Every supporter who preregisters before the campaign closing date secures <strong className="text-white">permanent Founding Member status</strong> on their profile, digital certificate, and early platform access.
                  </p>
                  <ul className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs text-neutral-300 font-sans pt-2">
                    <li className="flex items-center gap-2">
                      <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                      <span>Permanent ZEN.PASSPORT Founding Badge</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                      <span>Personalized Digital Certificate</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                      <span>Early Platform Access Before Public</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                      <span>In MUNs Priority Matrix Allocation</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                      <span>Launch Updates & Community Polls</span>
                    </li>
                  </ul>
                </div>

                <div className="p-5 rounded-2xl bg-black/60 border border-white/20 text-center space-y-3">
                  <span className="text-[10px] font-mono text-neutral-400 uppercase tracking-widest block">
                    FOUNDING STATUS
                  </span>
                  <div className="text-3xl font-extrabold text-white font-mono">
                    PERMANENT
                  </div>
                  <p className="text-[11px] text-neutral-400 font-sans">
                    Founding Member status remains permanently associated with your ZENVITRA identity.
                  </p>
                </div>
              </div>
            )}

            {/* Policy Safeguard Notice */}
            <div className="flex items-start gap-3 p-4 rounded-2xl bg-white/[0.02] border border-white/5 text-[11px] text-neutral-400 font-sans leading-relaxed">
              <Info className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
              <div>
                <strong className="text-neutral-200">Official Programme Policy:</strong> Tier assignment is determined strictly by the timestamp of verified registration. Founding Member status is permanent. The fee waiver covers one eligible event&apos;s registration fee and cannot be combined with another promotion. ZENVITRA is not a MUN website — it is the sovereign infrastructure platform for MUNs.
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
