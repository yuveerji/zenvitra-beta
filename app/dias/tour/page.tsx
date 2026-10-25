'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import {
  Gavel,
  ShieldCheck,
  Globe2,
  Users,
  Clock,
  Sparkles,
  ArrowRight,
  FileText,
  Vote,
  Radio,
  SlidersHorizontal,
  Layers,
  ChevronRight,
  Compass,
  CheckCircle2,
  Lock,
  Building2,
  Scale,
  Newspaper,
  Flame,
  Volume2,
  Smartphone,
  Tv,
  Check,
  HelpCircle,
  QrCode,
  Zap,
} from 'lucide-react';
import { DiasNav } from '@/components/mun/dias/DiasNav';
import { DiasFooter } from '@/components/mun/dias/DiasFooter';
import { DiasButton } from '@/components/mun/dias/DiasButton';
import { DiasBadge } from '@/components/mun/dias/DiasBadge';
import { DiasCard } from '@/components/mun/dias/DiasCard';
import { DiasInteractiveTourSimulator } from '@/components/mun/dias/DiasInteractiveTourSimulator';

export default function DiasTourPage() {
  const router = useRouter();
  const [joinCodeInput, setJoinCodeInput] = useState('');
  const [openFaq, setOpenFaq] = useState<number | null>(0);

  const handleJoinChamber = (e: React.FormEvent) => {
    e.preventDefault();
    const clean = joinCodeInput.trim().toUpperCase();
    if (clean) {
      router.push(`/dias/${clean}`);
    }
  };

  const faqItems = [
    {
      q: 'Do delegates need to download an app or create an account to join a session?',
      a: 'Zero app downloads are required. Delegates simply scan the podium QR code or enter the 6-character session code on any mobile browser (Safari, Chrome, Firefox). Within 3 seconds, their phone synchronizes with the Dais in real time.',
    },
    {
      q: 'How does the Quorum and Voting mathematics engine work?',
      a: 'ZENVITRA DIAS dynamically calculates quorum at every roll call. It distinguishes between "Present" (eligible to abstain) and "Present & Voting" (mandatory vote). Majorities are recalculated instantly: Simple Majority (50% + 1), Two-Thirds Supermajority (66.7%), and P5 veto consensus tracking for UNSC.',
    },
    {
      q: 'Can we run non-UN committees like Lok Sabha, Rajya Sabha, or Crisis War Rooms?',
      a: 'Yes. ZENVITRA DIAS includes a dedicated Indian Parliamentary Engine featuring Question Hour, Zero Hour, and Clause-by-Clause Bill amendment ledgers, as well as a Crisis War Room mode with real-time communiques, breaking news flashes, and IPC Press Wire.',
    },
    {
      q: 'How does Dual-Screen Auditorium Projection mode work?',
      a: 'Chairs can open the Stage Projection screen on a second monitor or projector. It delivers a high-contrast, distraction-free stage display with the active speaker flag, countdown clock, upcoming order, and agenda topic while keeping chair scoring and private notes visible only on the chair laptop.',
    },
    {
      q: 'What happens if venue Wi-Fi becomes unstable during committee?',
      a: 'ZENVITRA DIAS is engineered with PWA capabilities and an offline local buffer. If internet connection drops, the procedural timer, speakers queue, and gavel sounds continue running smoothly without interruption and sync back to the cloud as soon as connection is restored.',
    },
    {
      q: 'Can we pre-load our country allocations without manual typing?',
      a: 'Yes. We provide 1-click Country Bundles for the UN Security Council (P5 + E10), UN General Assembly (193 states), UN Human Rights Council (47 states), Lok Sabha (543 constituencies), AIPPM, and historic crisis cabinets.',
    },
  ];

  return (
    <div className="min-h-screen bg-[#08090B] text-[#F4F2ED] selection:bg-[#6366F1]/30 selection:text-[#C7D2FE] font-sans antialiased overflow-x-hidden">
      {/* Top Header Navigation */}
      <DiasNav />

      {/* ─── 1. HERO SECTION: TOUR PROCLAMATION ─── */}
      <section className="relative pt-32 sm:pt-40 pb-16 sm:pb-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto flex flex-col items-center text-center">
        {/* Subtle radial diplomatic glow */}
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-full max-w-[800px] h-[400px] bg-[#6366F1]/12 rounded-full blur-[140px] pointer-events-none" />

        {/* Top Diplomatic Status Pill */}
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[#181B21]/90 border border-[#6366F1]/30 text-[#C7D2FE] text-[11px] font-mono tracking-widest uppercase mb-8 shadow-[0_0_20px_rgba(99,102,241,0.15)]">
          <Compass className="w-3.5 h-3.5 text-[#6366F1] animate-spin" style={{ animationDuration: '12s' }} />
          <span>EXPLORE DIAS TOUR &bull; SESSION ARCHITECTURE</span>
        </div>

        {/* Hero Headline */}
        <h1 className="text-4xl sm:text-6xl md:text-7xl lg:text-8xl font-serif font-normal tracking-tight text-[#F4F2ED] max-w-5xl leading-[1.05] mb-6">
          THE COMPLETE COMMITTEE FLOOR. <span className="italic text-[#6366F1]">EXPERIENCED IN REAL-TIME.</span>
        </h1>

        {/* Subtitle */}
        <p className="text-base sm:text-lg md:text-xl text-[#9A9DA5] max-w-3xl font-light leading-relaxed mb-10">
          Inspired by gavelling.com/sessions, elevated for ZENVITRA. Explore every procedural dimension before your conference gavels in: Chair Dais Cockpit, Delegate Mobile Floor, Auditorium Stage Projection, Indian Parliamentary Bill Engine, and Crisis War Room.
        </p>

        {/* Interactive CTA Bar */}
        <div className="flex flex-wrap items-center justify-center gap-3 sm:gap-4 mb-14 w-full sm:w-auto font-display">
          <a
            href="#simulator"
            className="w-full sm:w-auto px-7 py-3.5 rounded-2xl bg-[#6366F1] hover:bg-[#818CF8] text-black font-mono font-bold text-xs uppercase tracking-wider transition-all duration-200 hover:scale-[1.02] shadow-[0_0_25px_rgba(99,102,241,0.3)] flex items-center justify-center gap-2"
          >
            <Sparkles className="w-4 h-4 fill-black" />
            <span>Try Interactive Simulator</span>
          </a>

          <Link
            href="/dias?create=true"
            className="w-full sm:w-auto px-7 py-3.5 rounded-2xl bg-[#181B21] hover:bg-[#20242C] border border-[#232731] hover:border-[#6366F1]/40 text-[#F4F2ED] font-mono font-bold text-xs uppercase tracking-wider transition-all duration-200 flex items-center justify-center gap-2"
          >
            <SlidersHorizontal className="w-4 h-4 text-[#6366F1]" />
            <span>Configure Committee Room</span>
          </Link>
        </div>

        {/* Quick Join Bar */}
        <form onSubmit={handleJoinChamber} className="flex flex-col sm:flex-row items-center gap-2 max-w-md w-full">
          <input
            type="text"
            value={joinCodeInput}
            onChange={(e) => setJoinCodeInput(e.target.value)}
            placeholder="Enter 6-char Session Code (e.g. UNSC01)"
            className="w-full px-4 py-3 rounded-2xl bg-[#111318] border border-[#232731] focus:border-[#6366F1] text-xs font-mono text-[#F4F2ED] placeholder:text-[#575B66] outline-none text-center sm:text-left transition"
          />
          <DiasButton type="submit" variant="indigo" size="md" className="w-full sm:w-auto shrink-0">
            Join Chamber
          </DiasButton>
        </form>
      </section>

      {/* ─── 2. LIVE INTERACTIVE SIMULATOR (HANDS-ON PLAYGROUND) ─── */}
      <section id="simulator" className="py-12 sm:py-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto scroll-mt-24 space-y-8">
        <div className="text-center space-y-3 max-w-3xl mx-auto">
          <DiasBadge variant="indigo" size="sm">
            INTERACTIVE SANDBOX &bull; TRY IT LIVE
          </DiasBadge>
          <h2 className="text-3xl sm:text-5xl font-serif text-[#F4F2ED]">
            Experience the <span className="italic text-[#6366F1]">Floor Controls.</span>
          </h2>
          <p className="text-sm sm:text-base text-[#9A9DA5]">
            Click below to test the Web Audio acoustic gavel, countdown timer with warning bells, roll call quorum calculator, division voting tally, and delegate smartphone experience.
          </p>
        </div>

        {/* Embedded Interactive Simulator Component */}
        <DiasInteractiveTourSimulator />
      </section>

      {/* ─── 3. THE 6 PROCEDURAL PILLARS (DEEP DIVE WALKTHROUGH) ─── */}
      <section className="py-16 sm:py-24 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto space-y-16">
        <div className="text-center space-y-3 max-w-3xl mx-auto">
          <DiasBadge variant="charcoal" size="sm">
            SIX DIPLOMATIC PILLARS
          </DiasBadge>
          <h2 className="text-3xl sm:text-5xl font-serif text-[#F4F2ED]">
            Built for Authentic <span className="italic text-[#6366F1]">Parliamentary Procedure.</span>
          </h2>
          <p className="text-sm sm:text-base text-[#9A9DA5]">
            Everything required to run international summits, national forums, and legislative chambers without paper chaos or disconnected stopwatches.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {/* Pillar 1 */}
          <DiasCard className="p-7 space-y-4 text-left border-[#232731] hover:border-[#6366F1]/40 transition group">
            <div className="w-12 h-12 rounded-2xl bg-[#181B21] border border-[#6366F1]/30 flex items-center justify-center text-[#6366F1] group-hover:scale-105 transition-transform">
              <Layers className="w-6 h-6" />
            </div>
            <span className="text-[10px] font-mono text-[#6366F1] font-bold uppercase tracking-wider block">
              PILLAR 01 &bull; ROSTERS &amp; BUNDLES
            </span>
            <h3 className="text-xl font-bold text-white tracking-tight">1-Click Country Allocations</h3>
            <p className="text-xs text-[#9A9DA5] leading-relaxed">
              Pre-populated, verified country matrices for UNSC, UNGA, UNHRC, Lok Sabha (543 seats), and AIPPM. Zero manual typing — select a bundle and launch in 30 seconds.
            </p>
          </DiasCard>

          {/* Pillar 2 */}
          <DiasCard className="p-7 space-y-4 text-left border-[#232731] hover:border-[#6366F1]/40 transition group">
            <div className="w-12 h-12 rounded-2xl bg-[#181B21] border border-[#6366F1]/30 flex items-center justify-center text-[#6366F1] group-hover:scale-105 transition-transform">
              <ShieldCheck className="w-6 h-6" />
            </div>
            <span className="text-[10px] font-mono text-[#6366F1] font-bold uppercase tracking-wider block">
              PILLAR 02 &bull; QUORUM &amp; ATTENDANCE
            </span>
            <h3 className="text-xl font-bold text-white tracking-tight">Real-Time Quorum Engine</h3>
            <p className="text-xs text-[#9A9DA5] leading-relaxed">
              One-tap roll call tracking Present, Present &amp; Voting, and Absent. Automatically computes Simple Majority (50%+1) and 2/3rds Supermajority thresholds on the fly.
            </p>
          </DiasCard>

          {/* Pillar 3 */}
          <DiasCard className="p-7 space-y-4 text-left border-[#232731] hover:border-[#6366F1]/40 transition group">
            <div className="w-12 h-12 rounded-2xl bg-[#181B21] border border-[#6366F1]/30 flex items-center justify-center text-[#6366F1] group-hover:scale-105 transition-transform">
              <Clock className="w-6 h-6" />
            </div>
            <span className="text-[10px] font-mono text-[#6366F1] font-bold uppercase tracking-wider block">
              PILLAR 03 &bull; PRECISION DEBATE TIMERS
            </span>
            <h3 className="text-xl font-bold text-white tracking-tight">Dual-Clock Debating Engine</h3>
            <p className="text-xs text-[#9A9DA5] leading-relaxed">
              Dual countdown timers track individual speech duration and overall caucus limits. Acoustic physical warning chimes trigger at 10 seconds and time expiration.
            </p>
          </DiasCard>

          {/* Pillar 4 */}
          <DiasCard className="p-7 space-y-4 text-left border-[#232731] hover:border-[#6366F1]/40 transition group">
            <div className="w-12 h-12 rounded-2xl bg-[#181B21] border border-[#6366F1]/30 flex items-center justify-center text-[#6366F1] group-hover:scale-105 transition-transform">
              <SlidersHorizontal className="w-6 h-6" />
            </div>
            <span className="text-[10px] font-mono text-[#6366F1] font-bold uppercase tracking-wider block">
              PILLAR 04 &bull; MOTIONS &amp; CAUCUSES
            </span>
            <h3 className="text-xl font-bold text-white tracking-tight">Parliamentary Precedence</h3>
            <p className="text-xs text-[#9A9DA5] leading-relaxed">
              Supports Moderated Caucuses, Unmoderated Caucuses, Right of Reply, Points of Order, and Parliamentary Inquiries with automatic procedural precedence hierarchy.
            </p>
          </DiasCard>

          {/* Pillar 5 */}
          <DiasCard className="p-7 space-y-4 text-left border-[#232731] hover:border-[#6366F1]/40 transition group">
            <div className="w-12 h-12 rounded-2xl bg-[#181B21] border border-[#6366F1]/30 flex items-center justify-center text-[#6366F1] group-hover:scale-105 transition-transform">
              <Vote className="w-6 h-6" />
            </div>
            <span className="text-[10px] font-mono text-[#6366F1] font-bold uppercase tracking-wider block">
              PILLAR 05 &bull; RESOLUTIONS &amp; DIVISION
            </span>
            <h3 className="text-xl font-bold text-white tracking-tight">Certified Substantive Voting</h3>
            <p className="text-xs text-[#9A9DA5] leading-relaxed">
              Division on working papers and draft resolutions. Delegates vote in real time from their mobile devices with instant visual percentage reconciliation and exportable tally seals.
            </p>
          </DiasCard>

          {/* Pillar 6 */}
          <DiasCard className="p-7 space-y-4 text-left border-[#232731] hover:border-[#6366F1]/40 transition group">
            <div className="w-12 h-12 rounded-2xl bg-[#181B21] border border-[#6366F1]/30 flex items-center justify-center text-[#6366F1] group-hover:scale-105 transition-transform">
              <Smartphone className="w-6 h-6" />
            </div>
            <span className="text-[10px] font-mono text-[#6366F1] font-bold uppercase tracking-wider block">
              PILLAR 06 &bull; ZERO-APP DELEGATE FLOOR
            </span>
            <h3 className="text-xl font-bold text-white tracking-tight">Zero-Friction Mobile Web</h3>
            <p className="text-xs text-[#9A9DA5] leading-relaxed">
              No mandatory app store download or forced sign-ups. Delegates scan the QR code to follow debate order, raise placards, propose caucuses, and vote securely.
            </p>
          </DiasCard>
        </div>
      </section>

      {/* ─── 4. THREE-WAY COMPARISON (ZENVITRA DIAS VS GAVELLING VS LEGACY MUN TOOLS) ─── */}
      <section className="py-16 sm:py-24 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto space-y-12">
        <div className="text-center space-y-3 max-w-3xl mx-auto">
          <DiasBadge variant="indigo" size="sm">
            THE DIGITAL UPGRADE
          </DiasBadge>
          <h2 className="text-3xl sm:text-5xl font-serif text-[#F4F2ED]">
            How ZENVITRA DIAS <span className="italic text-[#6366F1]">Compares.</span>
          </h2>
          <p className="text-sm sm:text-base text-[#9A9DA5]">
            Designed to match and surpass legacy software and digital gavel platforms with complete parliamentary flexibility.
          </p>
        </div>

        {/* Comparison Matrix Table */}
        <div className="rounded-3xl bg-[#0B0D12] border border-[#232731] overflow-hidden shadow-2xl">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse text-xs sm:text-sm">
              <thead>
                <tr className="border-b border-[#232731] bg-[#111318]">
                  <th className="p-4 sm:p-5 font-mono text-xs uppercase text-[#9A9DA5]">Feature Architecture</th>
                  <th className="p-4 sm:p-5 font-bold text-[#C7D2FE] bg-[#6366F1]/10 border-x border-[#6366F1]/20">
                    <div className="flex items-center gap-1.5 font-sans">
                      <Sparkles className="w-4 h-4 text-[#6366F1]" />
                      <span>ZENVITRA MUN DIAS</span>
                    </div>
                  </th>
                  <th className="p-4 sm:p-5 font-mono text-xs text-[#9A9DA5]">Gavelling.com</th>
                  <th className="p-4 sm:p-5 font-mono text-xs text-[#9A9DA5]">Legacy MUN Spreadsheets</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#181B21]">
                <tr>
                  <td className="p-4 sm:p-5 font-medium text-white">Real-Time Multi-Device Sync (Chairs + Delegates)</td>
                  <td className="p-4 sm:p-5 text-emerald-400 font-bold bg-[#6366F1]/5 border-x border-[#6366F1]/20 flex items-center gap-1.5">
                    <Check className="w-4 h-4 text-emerald-400" /> WebSocket Cloud Engine
                  </td>
                  <td className="p-4 sm:p-5 text-[#F4F2ED]">Yes (Session Code)</td>
                  <td className="p-4 sm:p-5 text-red-400">Manual Refresh / None</td>
                </tr>

                <tr>
                  <td className="p-4 sm:p-5 font-medium text-white">Physical Web Audio Synthesizer (Acoustic Gavel &amp; Bells)</td>
                  <td className="p-4 sm:p-5 text-emerald-400 font-bold bg-[#6366F1]/5 border-x border-[#6366F1]/20 flex items-center gap-1.5">
                    <Check className="w-4 h-4 text-emerald-400" /> Multi-Layer Walnut Impulse
                  </td>
                  <td className="p-4 sm:p-5 text-[#9A9DA5]">Basic Beeps</td>
                  <td className="p-4 sm:p-5 text-red-400">Physical Wooden Gavel Only</td>
                </tr>

                <tr>
                  <td className="p-4 sm:p-5 font-medium text-white">Indian Parliamentary Engine (Lok Sabha, Question Hour, Bills)</td>
                  <td className="p-4 sm:p-5 text-emerald-400 font-bold bg-[#6366F1]/5 border-x border-[#6366F1]/20 flex items-center gap-1.5">
                    <Check className="w-4 h-4 text-emerald-400" /> Dedicated 543-Seat LS Engine
                  </td>
                  <td className="p-4 sm:p-5 text-red-400">UN Rules Only</td>
                  <td className="p-4 sm:p-5 text-red-400">None</td>
                </tr>

                <tr>
                  <td className="p-4 sm:p-5 font-medium text-white">Auditorium Dual-Monitor Stage Projection View</td>
                  <td className="p-4 sm:p-5 text-emerald-400 font-bold bg-[#6366F1]/5 border-x border-[#6366F1]/20 flex items-center gap-1.5">
                    <Check className="w-4 h-4 text-emerald-400" /> Native High-Contrast Mode
                  </td>
                  <td className="p-4 sm:p-5 text-[#F4F2ED]">Basic Projector View</td>
                  <td className="p-4 sm:p-5 text-red-400">Awkward Screen Mirroring</td>
                </tr>

                <tr>
                  <td className="p-4 sm:p-5 font-medium text-white">Crisis War Room &amp; International Press Corps (IPC) Wire</td>
                  <td className="p-4 sm:p-5 text-emerald-400 font-bold bg-[#6366F1]/5 border-x border-[#6366F1]/20 flex items-center gap-1.5">
                    <Check className="w-4 h-4 text-emerald-400" /> Breaking Wire + Directives
                  </td>
                  <td className="p-4 sm:p-5 text-red-400">Standard Rules Only</td>
                  <td className="p-4 sm:p-5 text-red-400">None</td>
                </tr>

                <tr>
                  <td className="p-4 sm:p-5 font-medium text-white">Digital Diplomatic Dossier &amp; Verified MUN CV Integration</td>
                  <td className="p-4 sm:p-5 text-emerald-400 font-bold bg-[#6366F1]/5 border-x border-[#6366F1]/20 flex items-center gap-1.5">
                    <Check className="w-4 h-4 text-emerald-400" /> Automatic Credential Issuance
                  </td>
                  <td className="p-4 sm:p-5 text-[#9A9DA5]">Profile Only</td>
                  <td className="p-4 sm:p-5 text-red-400">Paper Certificates</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </section>

      {/* ─── 5. FREQUENTLY ASKED QUESTIONS (ACCORDION) ─── */}
      <section className="py-16 sm:py-24 px-4 sm:px-6 lg:px-8 max-w-4xl mx-auto space-y-12">
        <div className="text-center space-y-3">
          <DiasBadge variant="charcoal" size="sm">
            PROCEDURAL INTELLIGENCE
          </DiasBadge>
          <h2 className="text-3xl sm:text-5xl font-serif text-[#F4F2ED]">
            Frequently Asked <span className="italic text-[#6366F1]">Questions.</span>
          </h2>
          <p className="text-sm text-[#9A9DA5]">
            Everything you need to know about setting up and operating ZENVITRA DIAS during a live conference.
          </p>
        </div>

        <div className="space-y-3">
          {faqItems.map((item, index) => {
            const isOpen = openFaq === index;
            return (
              <div
                key={item.q}
                className="rounded-2xl bg-[#0B0D12] border border-[#232731] overflow-hidden transition"
              >
                <button
                  type="button"
                  onClick={() => setOpenFaq(isOpen ? null : index)}
                  className="w-full p-5 text-left flex items-center justify-between gap-4 cursor-pointer hover:bg-white/[0.02] transition"
                >
                  <span className="text-sm sm:text-base font-semibold text-white font-serif">{item.q}</span>
                  <ChevronRight
                    className={`w-4 h-4 text-[#6366F1] shrink-0 transition-transform duration-200 ${
                      isOpen ? 'rotate-90' : ''
                    }`}
                  />
                </button>
                {isOpen && (
                  <div className="px-5 pb-5 pt-1 text-xs sm:text-sm text-[#9A9DA5] leading-relaxed border-t border-[#181B21]">
                    {item.a}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </section>

      {/* ─── 6. BOTTOM CONVERSION CTA BAR ─── */}
      <section className="py-16 sm:py-24 px-4 sm:px-6 lg:px-8 max-w-5xl mx-auto text-center relative">
        <div className="p-8 sm:p-14 rounded-3xl bg-gradient-to-b from-[#111318] to-[#0A0C0F] border border-[#6366F1]/30 shadow-[0_0_50px_rgba(99,102,241,0.15)] space-y-8 relative overflow-hidden">
          {/* Subtle Ambient Radial */}
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-[600px] h-[300px] bg-[#6366F1]/10 rounded-full blur-[120px] pointer-events-none" />

          <div className="relative z-10 space-y-4 max-w-2xl mx-auto">
            <span className="text-xs font-mono text-[#6366F1] uppercase font-bold tracking-widest">
              SOVEREIGN DIPLOMATIC HARDWARE
            </span>
            <h2 className="text-3xl sm:text-5xl font-serif text-white tracking-tight">
              Ready to Gavel In Your <span className="italic text-[#6366F1]">Next Conference?</span>
            </h2>
            <p className="text-sm text-[#9A9DA5] leading-relaxed">
              Launch your chamber session in 30 seconds. Configurable for international UN bodies, Lok Sabha, and crisis war rooms with 1-click roster setups.
            </p>
          </div>

          <div className="relative z-10 flex flex-wrap items-center justify-center gap-4">
            <Link
              href="/dias?create=true"
              className="px-8 py-4 rounded-2xl bg-[#6366F1] hover:bg-[#818CF8] text-black font-mono font-bold text-xs uppercase tracking-wider transition-all duration-200 hover:scale-[1.02] shadow-[0_0_25px_rgba(99,102,241,0.3)] flex items-center gap-2"
            >
              <Gavel className="w-4 h-4 fill-black" />
              <span>Launch Live Chamber</span>
            </Link>

            <Link
              href="/dias#fleet"
              className="px-8 py-4 rounded-2xl bg-[#181B21] hover:bg-[#20242C] border border-[#232731] text-white font-mono font-bold text-xs uppercase tracking-wider transition-all duration-200"
            >
              Browse Chamber Fleet &rarr;
            </Link>
          </div>
        </div>
      </section>

      {/* Footer */}
      <DiasFooter />
    </div>
  );
}
