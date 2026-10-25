'use client';

import React from 'react';
import Link from 'next/link';
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
} from 'lucide-react';
import { DiasNav } from '@/components/mun/dias/DiasNav';
import { DiasFooter } from '@/components/mun/dias/DiasFooter';
import { DiasButton } from '@/components/mun/dias/DiasButton';
import { DiasBadge } from '@/components/mun/dias/DiasBadge';
import { DiasCard } from '@/components/mun/dias/DiasCard';
import { DiasLivePreview } from '@/components/mun/dias/DiasLivePreview';
import { CommitteeFleetSection } from '@/components/mun/dias/CommitteeFleetSection';

export default function DiasLandingPage() {
  return (
    <div className="min-h-screen bg-[#08090B] text-[#F4F2ED] selection:bg-[#C5A46D]/30 selection:text-[#E6D1A5] font-sans antialiased overflow-x-hidden">
      {/* Navigation */}
      <DiasNav />

      {/* ─── 1. HERO SECTION ─── */}
      <section className="relative pt-32 sm:pt-40 pb-20 sm:pb-28 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto flex flex-col items-center text-center">
        {/* Subtle radial glow */}
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[600px] h-[350px] bg-[#C5A46D]/10 rounded-full blur-[120px] pointer-events-none" />

        {/* Top diplomatic status pill */}
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#181B21] border border-[#C5A46D]/30 text-[#E6D1A5] text-xs font-mono tracking-wider uppercase mb-8 shadow-sm">
          <span className="w-2 h-2 rounded-full bg-[#C5A46D] animate-pulse" />
          <span>Diplomatic Operating System • V2.4</span>
        </div>

        {/* Main Editorial Hero Headline */}
        <h1 className="text-4xl sm:text-6xl md:text-7xl lg:text-8xl font-serif font-normal tracking-tight text-[#F4F2ED] max-w-5xl leading-[1.08] mb-6">
          THE WORLD IS <span className="italic text-[#C5A46D]">IN SESSION.</span>
        </h1>

        {/* Supporting Copy */}
        <p className="text-base sm:text-lg md:text-xl text-[#9A9DA5] max-w-2xl font-light leading-relaxed mb-10">
          A new standard for diplomatic discourse. Host, moderate, and experience Model United Nations through one seamless digital dias.
        </p>

        {/* Action CTAs */}
        <div className="flex flex-col sm:flex-row items-center gap-4 mb-16 w-full sm:w-auto">
          <Link href="/host?dais=true" className="w-full sm:w-auto">
            <DiasButton
              variant="gold"
              size="lg"
              className="w-full sm:w-auto"
              rightIcon={<ArrowRight className="w-4 h-4 ml-1" />}
            >
              Enter the Dias
            </DiasButton>
          </Link>
          <a href="#capabilities" className="w-full sm:w-auto">
            <DiasButton variant="charcoal" size="lg" className="w-full sm:w-auto">
              Explore the Platform
            </DiasButton>
          </a>
        </div>

        {/* ─── 4. THE DIAS EXPERIENCE: LIVE INTERACTIVE PREVIEW ─── */}
        <div className="w-full max-w-5xl mt-2">
          <DiasLivePreview />
        </div>
      </section>

      {/* ─── 2. THE PHILOSOPHY ─── */}
      <section className="py-24 border-t border-[#181B21] bg-[#0A0C0F] relative">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            <div className="lg:col-span-5 space-y-5 text-left">
              <DiasBadge variant="gold" size="sm">
                THE PHILOSOPHY
              </DiasBadge>
              <h2 className="text-3xl sm:text-4xl lg:text-5xl font-serif tracking-tight text-[#F4F2ED] leading-tight">
                Diplomacy requires <span className="italic text-[#C5A46D]">precision</span>, not friction.
              </h2>
              <p className="text-sm sm:text-base text-[#9A9DA5] leading-relaxed font-light">
                For decades, parliamentary simulations have struggled with chaotic Google Sheets, miscounted votes, lost chits, desynchronized stopwatches, and fragmented paper resolutions.
              </p>
              <p className="text-sm sm:text-base text-[#9A9DA5] leading-relaxed font-light">
                ZENVITRA MUN DIAS unifies the entire lifecycle of a summit into a sovereign, zero-latency digital chamber. From roll call to the final division vote, every gavel strike is accounted for.
              </p>
              <div className="pt-2 flex items-center gap-6 text-xs font-mono text-[#E6D1A5]">
                <span>✓ 0ms Audio Latency</span>
                <span>✓ Zero Seeded Accounts</span>
                <span>✓ Instant Quorum Math</span>
              </div>
            </div>

            <div className="lg:col-span-7 grid grid-cols-1 sm:grid-cols-2 gap-5">
              <DiasCard variant="elevated" className="p-6 text-left space-y-3">
                <div className="w-10 h-10 rounded-xl bg-[#181B21] border border-[#2A2E39] flex items-center justify-center text-[#C5A46D]">
                  <Clock className="w-5 h-5" />
                </div>
                <h3 className="text-base font-semibold text-[#F4F2ED]">
                  Server-Anchored Precision
                </h3>
                <p className="text-xs text-[#9A9DA5] leading-relaxed">
                  Timers rely on immutable server timestamps rather than browser ticks. Refreshing, switching tabs, or fluctuating WiFi will never drift your debate clock.
                </p>
              </DiasCard>

              <DiasCard variant="elevated" className="p-6 text-left space-y-3">
                <div className="w-10 h-10 rounded-xl bg-[#181B21] border border-[#2A2E39] flex items-center justify-center text-[#C5A46D]">
                  <Gavel className="w-5 h-5" />
                </div>
                <h3 className="text-base font-semibold text-[#F4F2ED]">
                  Acoustic Gavel Synthesis
                </h3>
                <p className="text-xs text-[#9A9DA5] leading-relaxed">
                  Real physical wood-on-wood resonance modeled via Web Audio API. 3400Hz transient crack, 220Hz wood body, and desk punch at key <kbd className="px-1.5 py-0.5 rounded bg-[#181B21] border border-[#2A2E39] text-[#C5A46D] font-mono">[G]</kbd>.
                </p>
              </DiasCard>

              <DiasCard variant="elevated" className="p-6 text-left space-y-3">
                <div className="w-10 h-10 rounded-xl bg-[#181B21] border border-[#2A2E39] flex items-center justify-center text-[#C5A46D]">
                  <Scale className="w-5 h-5" />
                </div>
                <h3 className="text-base font-semibold text-[#F4F2ED]">
                  Multi-Format Procedural Rules
                </h3>
                <p className="text-xs text-[#9A9DA5] leading-relaxed">
                  Native switchable support for UNA-USA, HMUN, THIMUN, and Indian Parliamentary Procedures (Lok Sabha, Rajya Sabha) with clause-by-clause bill voting.
                </p>
              </DiasCard>

              <DiasCard variant="elevated" className="p-6 text-left space-y-3">
                <div className="w-10 h-10 rounded-xl bg-[#181B21] border border-[#2A2E39] flex items-center justify-center text-[#C5A46D]">
                  <ShieldCheck className="w-5 h-5" />
                </div>
                <h3 className="text-base font-semibold text-[#F4F2ED]">
                  Sovereign Data Integrity
                </h3>
                <p className="text-xs text-[#9A9DA5] leading-relaxed">
                  Strictly zero mock accounts, zero artificial attendees, and zero fake conferences. All records derive from real organizers and verified participants.
                </p>
              </DiasCard>
            </div>
          </div>
        </div>
      </section>

      {/* ─── 3. PLATFORM CAPABILITIES ─── */}
      <section id="capabilities" className="py-24 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-16">
        <div className="max-w-2xl mx-auto space-y-3">
          <DiasBadge variant="gold" size="sm">
            CAPABILITIES
          </DiasBadge>
          <h2 className="text-3xl sm:text-5xl font-serif text-[#F4F2ED]">
            Architected for <span className="italic text-[#C5A46D]">Every Committee.</span>
          </h2>
          <p className="text-sm text-[#9A9DA5]">
            Configurable modules tailored to traditional UN bodies, national parliaments, editorial press rooms, and cabinet war rooms.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 text-left">
          {/* Card 1: Indian Parliamentary System */}
          <DiasCard variant="elevated" isHoverable className="p-6 space-y-4 flex flex-col justify-between">
            <div className="space-y-3">
              <div className="w-10 h-10 rounded-xl bg-[#C5A46D]/15 border border-[#C5A46D]/30 flex items-center justify-center text-[#C5A46D]">
                <Building2 className="w-5 h-5" />
              </div>
              <h3 className="text-lg font-semibold text-[#F4F2ED]">
                Indian Parliament Engine
              </h3>
              <p className="text-xs text-[#9A9DA5] leading-relaxed">
                Lok Sabha & Rajya Sabha simulations. Clause-by-clause bill editor, amendment proposals, question hour to ministers, and division voting tallies.
              </p>
            </div>
            <div className="pt-4 border-t border-[#181B21] flex items-center justify-between text-xs font-mono text-[#C5A46D]">
              <span>Bills & Amendments</span>
              <ChevronRight className="w-3.5 h-3.5" />
            </div>
          </DiasCard>

          {/* Card 2: United Nations General Assembly & UNSC */}
          <DiasCard variant="elevated" isHoverable className="p-6 space-y-4 flex flex-col justify-between">
            <div className="space-y-3">
              <div className="w-10 h-10 rounded-xl bg-[#C5A46D]/15 border border-[#C5A46D]/30 flex items-center justify-center text-[#C5A46D]">
                <Globe2 className="w-5 h-5" />
              </div>
              <h3 className="text-lg font-semibold text-[#F4F2ED]">
                UN General Assembly & UNSC
              </h3>
              <p className="text-xs text-[#9A9DA5] leading-relaxed">
                Standard UN Rules of Procedure. General Speakers' List, moderated and unmoderated caucuses, P5 veto mechanisms, and working paper management.
              </p>
            </div>
            <div className="pt-4 border-t border-[#181B21] flex items-center justify-between text-xs font-mono text-[#C5A46D]">
              <span>GSL & Moderated</span>
              <ChevronRight className="w-3.5 h-3.5" />
            </div>
          </DiasCard>

          {/* Card 3: International Press Corps */}
          <DiasCard variant="elevated" isHoverable className="p-6 space-y-4 flex flex-col justify-between">
            <div className="space-y-3">
              <div className="w-10 h-10 rounded-xl bg-[#C5A46D]/15 border border-[#C5A46D]/30 flex items-center justify-center text-[#C5A46D]">
                <Newspaper className="w-5 h-5" />
              </div>
              <h3 className="text-lg font-semibold text-[#F4F2ED]">
                International Press Corps
              </h3>
              <p className="text-xs text-[#9A9DA5] leading-relaxed">
                Dedicated newsroom wire desk. Draft press releases, submit articles for editorial review, manage embargoes, and broadcast breaking news bulletins.
              </p>
            </div>
            <div className="pt-4 border-t border-[#181B21] flex items-center justify-between text-xs font-mono text-[#C5A46D]">
              <span>Editorial Desk</span>
              <ChevronRight className="w-3.5 h-3.5" />
            </div>
          </DiasCard>

          {/* Card 4: Crisis & Cabinet Directives */}
          <DiasCard variant="elevated" isHoverable className="p-6 space-y-4 flex flex-col justify-between">
            <div className="space-y-3">
              <div className="w-10 h-10 rounded-xl bg-[#C5A46D]/15 border border-[#C5A46D]/30 flex items-center justify-center text-[#C5A46D]">
                <Flame className="w-5 h-5" />
              </div>
              <h3 className="text-lg font-semibold text-[#F4F2ED]">
                Cabinet & Crisis Terminal
              </h3>
              <p className="text-xs text-[#9A9DA5] leading-relaxed">
                High-stakes war rooms. Confidential directives, troop deployments, diplomatic sanctions, situation report feeds, and private communications.
              </p>
            </div>
            <div className="pt-4 border-t border-[#181B21] flex items-center justify-between text-xs font-mono text-[#C5A46D]">
              <span>Crisis Directives</span>
              <ChevronRight className="w-3.5 h-3.5" />
            </div>
          </DiasCard>
        </div>
      </section>

      {/* ─── 4. COMMITTEE FLEET & PRESET CHAMBERS ─── */}
      <CommitteeFleetSection />

      {/* ─── 5. BUILT FOR EVERY ROLE ─── */}
      <section className="py-24 border-t border-[#181B21] bg-[#0A0C0F]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-16">
          <div className="text-center space-y-3 max-w-2xl mx-auto">
            <DiasBadge variant="gold" size="sm">
              ROLE-BASED WORKSPACES
            </DiasBadge>
            <h2 className="text-3xl sm:text-5xl font-serif text-[#F4F2ED]">
              Built for <span className="italic text-[#C5A46D]">Every Diplomatic Seat.</span>
            </h2>
            <p className="text-sm text-[#9A9DA5]">
              Chairs, delegates, press correspondents, and secretariats each get dedicated, tailored workflows.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-left">
            {/* Role 1: Chairperson / Presiding Officer */}
            <div className="space-y-4 p-7 rounded-2xl bg-[#111318] border border-[#232731]">
              <div className="text-xs font-mono uppercase tracking-widest text-[#C5A46D]">
                ROLE • CHAIRPERSON / SPEAKER
              </div>
              <h3 className="text-xl font-semibold text-[#F4F2ED]">
                Command the Chamber
              </h3>
              <p className="text-xs text-[#9A9DA5] leading-relaxed">
                Full authority over the speaker queue, timer alerts, caucus transitions, and motions lifecycle. Open substantive voting, review amendments, and strike the gavel with instant audio confirmation.
              </p>
              <ul className="space-y-2 text-xs text-[#E6D1A5] pt-2">
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-[#C5A46D]" /> Realtime Queue Management & Reordering
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-[#C5A46D]" /> Voice & Division Vote Tallying
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-[#C5A46D]" /> Roll Call Attendance & Automatic Quorum
                </li>
              </ul>
            </div>

            {/* Role 2: Delegate / Member of Parliament */}
            <div className="space-y-4 p-7 rounded-2xl bg-[#111318] border border-[#232731]">
              <div className="text-xs font-mono uppercase tracking-widest text-[#C5A46D]">
                ROLE • DELEGATE / MEMBER
              </div>
              <h3 className="text-xl font-semibold text-[#F4F2ED]">
                Articulate Sovereign Positions
              </h3>
              <p className="text-xs text-[#9A9DA5] leading-relaxed">
                Raise points of personal privilege, parliamentary inquiry, or order with one tap. Request recognition, yield remaining time to the chair or other delegates, and review submitted draft resolutions.
              </p>
              <ul className="space-y-2 text-xs text-[#E6D1A5] pt-2">
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-[#C5A46D]" /> Live Speaking Timer Synchronization
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-[#C5A46D]" /> Confidential Secret Ballot Submissions
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-[#C5A46D]" /> Bilateral & Multi-Party Diplomatic Chits
                </li>
              </ul>
            </div>

            {/* Role 3: Secretariat & Administrators */}
            <div className="space-y-4 p-7 rounded-2xl bg-[#111318] border border-[#232731]">
              <div className="text-xs font-mono uppercase tracking-widest text-[#C5A46D]">
                ROLE • SECRETARIAT / ADMIN
              </div>
              <h3 className="text-xl font-semibold text-[#F4F2ED]">
                Omniscient Oversight
              </h3>
              <p className="text-xs text-[#9A9DA5] leading-relaxed">
                Monitor live committee health across all simultaneous chambers. Configure conference dates, assign dais staff, publish conference-wide announcements, and inspect immutable audit logs.
              </p>
              <ul className="space-y-2 text-xs text-[#E6D1A5] pt-2">
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-[#C5A46D]" /> Multi-Committee Control Deck
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-[#C5A46D]" /> Complete Procedural Audit Trails
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-[#C5A46D]" /> Conference Accreditation & Verification
                </li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* ─── 7. SECURITY & CONTROL ─── */}
      <section className="py-24 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-[#111318] border border-[#232731] rounded-3xl p-8 sm:p-14 relative overflow-hidden text-left">
          <div className="max-w-2xl space-y-5">
            <DiasBadge variant="gold" size="sm">
              SOVEREIGN SECURITY
            </DiasBadge>
            <h2 className="text-3xl sm:text-5xl font-serif text-[#F4F2ED]">
              Protection for <span className="italic text-[#C5A46D]">High-Stakes Deliberations.</span>
            </h2>
            <p className="text-xs sm:text-sm text-[#9A9DA5] leading-relaxed">
              Every vote, speech, and document transfer is guarded by server-side authorization. Private and restricted sessions are cryptographically separated from public feeds.
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-4">
              <div className="flex items-start gap-3">
                <Lock className="w-4 h-4 text-[#C5A46D] shrink-0 mt-0.5" />
                <div className="space-y-0.5">
                  <h4 className="text-xs font-semibold text-[#F4F2ED]">Zero Leakage Private Sessions</h4>
                  <p className="text-[11px] text-[#9A9DA5]">Restricted crisis and intelligence briefings are invisible in public APIs.</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <Vote className="w-4 h-4 text-[#C5A46D] shrink-0 mt-0.5" />
                <div className="space-y-0.5">
                  <h4 className="text-xs font-semibold text-[#F4F2ED]">Confidential Division Ballots</h4>
                  <p className="text-[11px] text-[#9A9DA5]">Voter IDs are stripped before tallies are emitted to the chamber.</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ─── 8. FINAL CTA: "THE FLOOR IS YOURS." ─── */}
      <section className="py-28 border-t border-[#181B21] bg-gradient-to-b from-[#08090B] to-[#0A0C0F] text-center px-4">
        <div className="max-w-4xl mx-auto space-y-6">
          <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-[#181B21] border border-[#C5A46D]/40 text-[#C5A46D] shadow-[0_0_30px_rgba(197,164,109,0.2)] mb-2">
            <Gavel className="w-7 h-7" />
          </div>
          <h2 className="text-4xl sm:text-6xl md:text-7xl font-serif text-[#F4F2ED] tracking-tight">
            THE FLOOR <span className="italic text-[#C5A46D]">IS YOURS.</span>
          </h2>
          <p className="text-sm sm:text-base text-[#9A9DA5] max-w-xl mx-auto leading-relaxed">
            Experience the future of Model United Nations moderation. Launch a session or enter as a delegate in seconds.
          </p>
          <div className="pt-4 flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link href="/host?dais=true">
              <DiasButton
                variant="gold"
                size="lg"
                rightIcon={<ArrowRight className="w-4 h-4 ml-1" />}
              >
                Launch Chair Console
              </DiasButton>
            </Link>
            <Link href="/chamber">
              <DiasButton variant="charcoal" size="lg">
                Enter Delegate Chamber
              </DiasButton>
            </Link>
          </div>
        </div>
      </section>

      {/* ─── 9. PREMIUM FOOTER ─── */}
      <DiasFooter />
    </div>
  );
}
