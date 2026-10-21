'use client';

import React from 'react';
import Link from 'next/link';
import {
  ArrowLeft,
  ArrowRight,
  Shield,
  Sparkles,
  MessageSquare,
  FileText,
  ScrollText,
  Newspaper,
  Compass,
  Cpu,
  Globe2,
  HeartHandshake,
  Flame,
  CheckCircle2,
  Layers,
  Award,
  Radio,
  Lock,
  Building,
  GraduationCap,
  Users,
  Target,
  Clock,
  BookOpen,
  CircleDot,
  Activity,
  Rocket
} from 'lucide-react';
import { SpotlightCard } from '@/components/ui/SpotlightCard';
import { EnterZenvitraButton } from '@/components/ui/EnterZenvitraButton';
import { Navbar } from '@/components/layout/Navbar';
import { InteractiveWordHover } from '@/components/home/InteractiveWordHover';

export default function AboutUsPage() {
  const pillars = [
    {
      icon: Globe2,
      num: '01',
      title: 'Open Assembly & Chamber Matrix',
      desc: 'Real-time discussion chambers, moderated caucuses, resolution tabling, and accredited assembly passports for youth, thinkers, and delegates worldwide.',
      color: 'bg-amber-500/10 border-amber-500/25 text-amber-300',
      hoverColor: 'hover:text-amber-300 hover:decoration-amber-300',
      tag: 'ASSEMBLY GRID',
      termKey: 'assembly-os',
      href: '/events',
      ctaText: 'Explore Assembly Grid',
    },
    {
      icon: FileText,
      num: '02',
      title: 'Solutions Policy Chamber',
      desc: 'Open-source civic policy repository where anyone can co-author, sponsor, and ratify real-world solutions to global challenges with verified sources.',
      color: 'bg-cyan-500/10 border-cyan-500/25 text-cyan-300',
      hoverColor: 'hover:text-cyan-300 hover:decoration-cyan-300',
      tag: 'CIVIC DRAFTING',
      termKey: 'solutions-chamber',
      href: '/solutions',
      ctaText: 'Open Policy Chamber',
    },
    {
      icon: Newspaper,
      num: '03',
      title: 'Independent Press Bureau',
      desc: 'ZEN.FLUX vertical video dispatches and long-form investigative journalism with verifiable citation auditing and open peer review.',
      color: 'bg-purple-500/10 border-purple-500/25 text-purple-300',
      hoverColor: 'hover:text-purple-300 hover:decoration-purple-300',
      tag: 'OPEN JOURNALISM',
      termKey: 'sources-and-senses',
      href: '/press',
      ctaText: 'Read Press Bureau',
    },
    {
      icon: HeartHandshake,
      num: '04',
      title: '10% Profit Civic Endowment',
      desc: 'A permanent constitutional covenant: 10% of all net profits are directly disbursed every 6 months to student scholarships and study kits, verified with offline handover videos and public receipts.',
      color: 'bg-emerald-500/10 border-emerald-500/25 text-emerald-300',
      hoverColor: 'hover:text-emerald-300 hover:decoration-emerald-300',
      tag: 'CONSTITUTIONAL PROFIT ENDOWMENT',
      termKey: 'escrow',
      href: '/impact',
      ctaText: 'Inspect 10% Escrow',
    },
  ];

  const corePrinciples = [
    {
      title: 'Built by Youth for Sovereign Minds',
      desc: 'Engineered by youth, empowering thinkers, writers, creators, and active minds with senses and verifiable sources without gatekeeping.',
      icon: Users,
    },
    {
      title: 'Zero Surveillance Advertising',
      desc: 'We reject ad-tech surveillance, data brokerage, and rage-bait engagement algorithms. Your attention and intellect are never auctioned.',
      icon: Lock,
    },
    {
      title: 'Constitutional 10% Profit Endowment',
      desc: 'Executed every 6 months: 10% of profits fund student supplies, Model UN scholarships, and computer labs with offline video proof on ZEN.FLUX and socials.',
      icon: HeartHandshake,
    },
    {
      title: 'Cryptographic Sovereign Identity',
      desc: 'Zero-knowledge credentials and dual-key security guarantee your contributions, resolutions, and articles remain permanently immutable.',
      icon: Shield,
    },
  ];

  const roadmapPhases = [
    {
      phase: 'PHASE 01',
      period: 'Q1–Q2 2026',
      title: 'Genesis Core & Sovereign Matrix',
      status: '85% COMPLETED',
      badgeClass: 'bg-emerald-500/20 border-emerald-400/40 text-emerald-300',
      progressPercent: 85,
      color: 'border-emerald-500/30 bg-gradient-to-b from-emerald-950/20 to-zinc-950/80 text-emerald-300',
      completedItems: [
        'Model UN Live Committee Chamber with real-time speaker queue & GSL timer',
        'Dual-Key Sovereign Passport & cryptographic QR verification engine',
        'ZEN.PULSE civic feed with YouTube Music integration & custom waveform trimmer',
        'Cashfree PG production payment matrix & instant pass ticketing with dynamic seats',
        'Sovereign Executive Council (Founder Yuveer & Co-Founders Khushi R B & Aarush Vijayivargiya) verified roster',
        'International Press Bureau (ZEN.FLUX video dispatch & article reader)',
      ],
      inProgressItems: [
        'WebRTC real-time Mesh Video Call rooms with speaker spotlights & roll-call HUD',
        'Dynamic Google Sheets & webhook bidirectional sync for real-time delegate check-in',
      ],
    },
    {
      phase: 'PHASE 02',
      period: 'Q3–Q4 2026',
      title: 'Inter-Varsity Assembly & Policy Engine',
      status: 'IN PROGRESS · 30%',
      badgeClass: 'bg-amber-500/20 border-amber-400/40 text-amber-300',
      progressPercent: 30,
      color: 'border-amber-500/30 bg-gradient-to-b from-amber-950/15 to-zinc-950/80 text-amber-300',
      completedItems: [
        'ZEN.DOCS structured document studio & draft resolution formatter architecture',
        'Constitutional 10% Profit Endowment escrow calculation ledger model',
      ],
      inProgressItems: [
        'Multi-chamber crisis matrix simulations with live presidential directives',
        'Peer-reviewed citation checking algorithm & academic bibliography verification',
        'Diplomatic Dossier export (PDF/DOCX) for college applications & fellowships',
      ],
    },
    {
      phase: 'PHASE 03',
      period: '2027–2028',
      title: 'Global Multilateral Youth Accord',
      status: 'EXPANSION ROADMAP',
      badgeClass: 'bg-cyan-500/20 border-cyan-400/40 text-cyan-300',
      progressPercent: 5,
      color: 'border-cyan-500/20 bg-gradient-to-b from-cyan-950/10 to-zinc-950/80 text-cyan-300',
      completedItems: [
        'Decentralized governance manifesto & open assembly constitution codified',
      ],
      inProgressItems: [
        'First ₹50,000 public school distribution threshold target (Rajasthan & Odisha)',
        'Pan-Global Youth Policy Treaty presented to international multilateral summits',
        'Autonomous Civic Escrow smart contracts on decentralized public ledger',
        'Global Press Syndicate & collegiate investigative bureaus across 100+ nations',
        '100 Rural Public School Labs fully equipped, solar-powered & permanently online',
      ],
    },
  ];

  return (
    <div className="min-h-screen bg-[#030405] text-white selection:bg-white selection:text-black font-sans relative overflow-x-hidden flex flex-col justify-between pt-16 sm:pt-20">
      <Navbar />

      {/* Ambient background glows */}
      <div className="fixed inset-0 pointer-events-none bg-[radial-gradient(#ffffff07_1px,transparent_1px)] [background-size:32px_32px] opacity-40 z-0" />
      <div className="fixed top-0 left-1/2 -translate-x-1/2 w-[900px] h-[500px] bg-gradient-to-b from-amber-500/[0.04] via-purple-500/[0.03] to-transparent blur-[140px] pointer-events-none z-0" />

      {/* Main Content */}
      <main className="relative z-10 max-w-6xl mx-auto px-6 sm:px-12 py-16 space-y-24 flex-1 text-left">
        
        {/* ── 1. HERO INTRODUCTION ── */}
        <div className="space-y-6 max-w-4xl">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-white/15 bg-white/[0.02] font-mono text-[10px] text-amber-300 uppercase tracking-widest">
            <Sparkles className="w-3 h-3" />
            <span>FOUNDATIONAL ARCHITECTURE &bull; GENESIS 2026</span>
          </div>

          <h1 className="font-display font-black text-5xl sm:text-7xl lg:text-8xl text-white tracking-tight leading-[0.92] uppercase">
            WE WERE NEVER <br />
            <span className="font-serif italic font-light text-[#efe7dc]">WAITING FOR PERMISSION.</span>
          </h1>

          <div className="text-sm sm:text-lg text-neutral-300 font-light leading-relaxed max-w-3xl">
            Zenvitra was built on a fundamental conviction: <strong className="text-white font-medium">the future belongs to those who will inhabit it.</strong> We are a{' '}
            <InteractiveWordHover termKey="youth">
              <span className="text-white font-medium underline decoration-amber-400/50 underline-offset-4 hover:decoration-amber-300 cursor-pointer transition">
                youth-engineered sovereign ecosystem
              </span>
            </InteractiveWordHover>{' '}
            documenting debates,{' '}
            <InteractiveWordHover termKey="proof-of-citation">
              <span className="text-white font-medium underline decoration-cyan-400/50 underline-offset-4 hover:decoration-cyan-300 cursor-pointer transition">
                open-source policy drafts
              </span>
            </InteractiveWordHover>
            , independent journalism, and{' '}
            <InteractiveWordHover termKey="escrow">
              <span className="text-white font-medium underline decoration-emerald-400/50 underline-offset-4 hover:decoration-emerald-300 cursor-pointer transition">
                direct civic impact
              </span>
            </InteractiveWordHover>{' '}
            without corporate gatekeepers.
          </div>
        </div>

        {/* ── 2. THE 4 PILLARS MATRIX ── */}
        <section className="space-y-8">
          <div className="space-y-2 border-b border-white/10 pb-4">
            <span className="font-mono text-[10px] uppercase tracking-[0.3em] text-amber-400 font-bold">
              THE QUADRANT ARCHITECTURE
            </span>
            <h2 className="font-display font-bold text-2xl sm:text-4xl text-white uppercase tracking-tight">
              4 Chambers of{' '}
              <InteractiveWordHover termKey="sovereignty">
                <span className="underline decoration-purple-400/60 underline-offset-8 hover:decoration-purple-300 cursor-pointer transition">
                  Sovereign Youth Agency
                </span>
              </InteractiveWordHover>
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {pillars.map((pillar) => {
              const Icon = pillar.icon;
              return (
                <SpotlightCard key={pillar.num} className="p-8 rounded-3xl bg-zinc-950/80 border border-white/10 space-y-4 flex flex-col justify-between">
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <div className={`p-3 rounded-2xl border flex items-center justify-center ${pillar.color}`}>
                        <Icon className="w-5 h-5" />
                      </div>
                      <span className="font-mono text-xs text-neutral-400 font-bold tracking-widest">
                        {pillar.tag} &bull; {pillar.num}
                      </span>
                    </div>

                    <h3 className="font-display font-bold text-xl text-white">
                      <InteractiveWordHover termKey={pillar.termKey} side="top">
                        <span className={`cursor-pointer underline decoration-white/20 underline-offset-4 transition ${pillar.hoverColor}`}>
                          {pillar.title}
                        </span>
                      </InteractiveWordHover>
                    </h3>

                    <p className="text-xs sm:text-sm text-neutral-400 font-light leading-relaxed">
                      {pillar.desc}
                    </p>
                  </div>

                  <div className="pt-3 border-t border-white/[0.08] flex items-center justify-between">
                    <Link
                      href={pillar.href}
                      className="inline-flex items-center gap-1.5 text-xs font-mono font-medium text-neutral-400 hover:text-white transition group cursor-pointer"
                    >
                      <span>{pillar.ctaText}</span>
                      <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
                    </Link>
                    <span className="font-mono text-[10px] text-neutral-600 uppercase tracking-wider">
                      CHAMBER {pillar.num}
                    </span>
                  </div>
                </SpotlightCard>
              );
            })}
          </div>
        </section>

        {/* ── 3. THE CONSTITUTIONAL 10% ESCROW CHARTER ── */}
        <section className="p-8 sm:p-12 rounded-[2.8rem] bg-gradient-to-b from-[#0c0e14] to-[#06070a] border border-emerald-500/25 shadow-2xl relative overflow-hidden space-y-6">
          <div className="absolute top-0 right-0 w-96 h-96 bg-emerald-500/[0.06] rounded-full blur-3xl pointer-events-none" />

          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-300 font-mono text-[10px] font-bold uppercase">
            <HeartHandshake className="w-3.5 h-3.5" />
            <span>CONSTITUTIONAL MANDATE &bull; 10% PROFIT COVENANT</span>
          </div>

          <h2 className="font-display font-black text-3xl sm:text-5xl text-white uppercase tracking-tight leading-tight">
            10% of All Profits <br />
            <InteractiveWordHover termKey="escrow">
              <span className="font-serif italic font-normal text-emerald-300 underline decoration-emerald-400/50 underline-offset-8 hover:decoration-emerald-300 cursor-pointer transition">
                Directly Funds Public Education.
              </span>
            </InteractiveWordHover>
          </h2>

          <div className="text-xs sm:text-base text-neutral-300 font-light leading-relaxed max-w-3xl">
            We reject traditional non-profit opacity where overhead consumes 80% of resources. Under the{' '}
            <Link
              href="/constitution"
              className="text-white font-medium underline decoration-emerald-400/50 underline-offset-4 hover:decoration-emerald-300 hover:text-emerald-300 transition"
            >
              Zenvitra Constitutional Charter
            </Link>
            , an immutable <strong className="text-white font-semibold">10% of all net platform profits</strong> is distributed <strong className="text-amber-300 font-semibold">every 6 months</strong> directly to student scholarships, school study kits, and rural computer labs. Every single distribution is held to radical accountability through itemized purchase receipts and offline on-the-ground giveaway videos broadcast publicly on <strong className="text-cyan-300 font-semibold">ZEN.FLUX</strong> and official social channels.
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-4 border-t border-white/10 font-mono text-xs">
            <div className="p-4 rounded-2xl bg-black/60 border border-white/10 space-y-1">
              <span className="text-neutral-500 text-[10px] uppercase">PROFIT ENDOWMENT RATIO</span>
              <p className="text-lg font-bold text-emerald-400">10.0% Net Profit</p>
            </div>
            <div className="p-4 rounded-2xl bg-black/60 border border-white/10 space-y-1">
              <span className="text-neutral-500 text-[10px] uppercase">TARGET INFRASTRUCTURE</span>
              <InteractiveWordHover termKey="smart-labs">
                <p className="text-lg font-bold text-white underline decoration-white/30 underline-offset-4 hover:decoration-white cursor-pointer transition">Smart Labs &amp; Solar</p>
              </InteractiveWordHover>
            </div>
            <div className="p-4 rounded-2xl bg-black/60 border border-white/10 space-y-1">
              <span className="text-neutral-500 text-[10px] uppercase">AUDIT VERIFIABILITY</span>
              <InteractiveWordHover termKey="proof-of-citation">
                <p className="text-lg font-bold text-white underline decoration-white/30 underline-offset-4 hover:decoration-white cursor-pointer transition">100% Public Ledger</p>
              </InteractiveWordHover>
            </div>
          </div>
        </section>

        {/* ── 4. FOUR NON-NEGOTIABLE PRINCIPLES ── */}
        <section className="space-y-8">
          <div className="space-y-2 border-b border-white/10 pb-4">
            <span className="font-mono text-[10px] uppercase tracking-[0.3em] text-neutral-400 font-bold">
              THE SOVEREIGN STANDARD
            </span>
            <h2 className="font-display font-bold text-2xl sm:text-4xl text-white uppercase tracking-tight">
              Our Non-Negotiable Tenets
            </h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {corePrinciples.map((principle, i) => {
              const Icon = principle.icon;
              const termKeyMapping = i === 0 ? 'truth-and-youth' : i === 1 ? 'zero-surveillance' : i === 2 ? 'escrow' : 'sovereignty';
              return (
                <SpotlightCard key={i} className="p-6 rounded-2xl bg-zinc-950/80 border border-white/10 space-y-3">
                  <div className="w-10 h-10 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center text-white">
                    <Icon className="w-5 h-5" />
                  </div>
                  <h3 className="font-display font-bold text-sm text-white">
                    <InteractiveWordHover termKey={termKeyMapping} side="top">
                      <span className="cursor-pointer hover:text-amber-300 underline decoration-white/20 underline-offset-4 hover:decoration-amber-300 transition">
                        {principle.title}
                      </span>
                    </InteractiveWordHover>
                  </h3>
                  <p className="text-xs text-neutral-400 font-light leading-relaxed">{principle.desc}</p>
                </SpotlightCard>
              );
            })}
          </div>
        </section>

        {/* ── 5. STRATEGIC ROADMAP ── */}
        <section className="space-y-8">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 border-b border-white/10 pb-4">
            <div className="space-y-1">
              <span className="font-mono text-[10px] uppercase tracking-[0.3em] text-amber-400 font-bold">
                EXECUTION TRAJECTORY · LIVE PROGRESS TRACKER
              </span>
              <h2 className="font-display font-bold text-2xl sm:text-4xl text-white uppercase tracking-tight">
                The Genesis 2026–2028 Roadmap
              </h2>
            </div>
            <div className="flex items-center gap-4 text-xs font-mono text-neutral-400">
              <span className="flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-emerald-400" />
                Done &amp; Deployed
              </span>
              <span className="flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-amber-400 animate-pulse" />
                In Active Pipeline
              </span>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {roadmapPhases.map((r, i) => (
              <div
                key={i}
                className={`p-7 rounded-3xl border ${r.color} flex flex-col justify-between space-y-6 relative overflow-hidden backdrop-blur-md shadow-2xl`}
              >
                <div className="space-y-4">
                  {/* Phase & Period Header */}
                  <div className="flex items-center justify-between font-mono text-[10px] tracking-widest uppercase font-bold">
                    <span>{r.phase} &bull; {r.period}</span>
                    <span className={`px-2.5 py-0.5 rounded-full border text-[9px] font-mono font-bold tracking-wider ${r.badgeClass}`}>
                      {r.status}
                    </span>
                  </div>

                  {/* Title & Progress Bar */}
                  <div className="space-y-2">
                    <h3 className="font-display font-bold text-lg sm:text-xl text-white">
                      {r.title}
                    </h3>
                    
                    {/* Visual Progress Bar */}
                    <div className="space-y-1">
                      <div className="flex items-center justify-between text-[10px] font-mono text-neutral-400">
                        <span>Milestone Completion</span>
                        <span className="font-bold text-white">{r.progressPercent}%</span>
                      </div>
                      <div className="w-full h-1.5 rounded-full bg-white/10 overflow-hidden">
                        <div
                          className={`h-full rounded-full transition-all duration-500 ${
                            i === 0
                              ? 'bg-gradient-to-r from-emerald-500 to-emerald-400'
                              : i === 1
                              ? 'bg-gradient-to-r from-amber-500 to-orange-400'
                              : 'bg-gradient-to-r from-cyan-500 to-blue-400'
                          }`}
                          style={{ width: `${r.progressPercent}%` }}
                        />
                      </div>
                    </div>
                  </div>

                  {/* Completed Accomplishments */}
                  {r.completedItems.length > 0 && (
                    <div className="space-y-2 pt-2 border-t border-white/10">
                      <div className="flex items-center gap-1.5 text-[10px] font-mono uppercase tracking-wider text-emerald-400 font-semibold">
                        <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                        <span>Completed &amp; Live ({r.completedItems.length})</span>
                      </div>
                      <ul className="space-y-2 text-xs text-neutral-300 font-light">
                        {r.completedItems.map((item, idx) => (
                          <li key={idx} className="flex items-start gap-2">
                            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 shrink-0 mt-1.5" />
                            <span className="leading-relaxed">{item}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}

                  {/* Active / In-Progress Pipelines */}
                  {r.inProgressItems.length > 0 && (
                    <div className="space-y-2 pt-2 border-t border-white/10">
                      <div className="flex items-center gap-1.5 text-[10px] font-mono uppercase tracking-wider text-amber-300 font-semibold">
                        <Activity className="w-3.5 h-3.5 text-amber-400 shrink-0 animate-pulse" />
                        <span>{i === 0 ? 'Active Pipelines' : 'Upcoming Horizons'}</span>
                      </div>
                      <ul className="space-y-2 text-xs text-neutral-400 font-light">
                        {r.inProgressItems.map((item, idx) => (
                          <li key={idx} className="flex items-start gap-2">
                            <CircleDot className="w-3 h-3 text-amber-400/80 shrink-0 mt-0.5" />
                            <span className="leading-relaxed">{item}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                </div>

                {/* Footer Tag */}
                <div className="pt-3 border-t border-white/[0.08] flex items-center justify-between text-[10px] font-mono text-neutral-500">
                  <span>SOVEREIGN ARCHITECTURE</span>
                  <span className="uppercase text-neutral-400 font-bold">{r.phase}</span>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* ── 6. CALL TO ACTION ── */}
        <section className="text-center p-12 sm:p-16 rounded-[2.8rem] bg-zinc-950 border border-white/15 space-y-6">
          <h2 className="font-display font-black text-3xl sm:text-5xl text-white uppercase tracking-tight">
            Claim Your Place in the Assembly.
          </h2>
          <p className="text-xs sm:text-sm text-neutral-400 max-w-xl mx-auto font-light leading-relaxed">
            Whether you are a Model UN delegate, an investigative student reporter, or a campus leader—Zenvitra is your sovereign home.
          </p>

          <div className="flex flex-wrap items-center justify-center gap-4 pt-2">
            <Link
              href="/register"
              className="px-8 py-3.5 rounded-full bg-white text-black font-display font-bold text-xs uppercase tracking-wider hover:bg-neutral-200 transition shadow-[0_0_25px_rgba(255,255,255,0.2)]"
            >
              Initialize Free Account &rarr;
            </Link>
            <Link
              href="/campus-ambassador"
              className="px-8 py-3.5 rounded-full bg-white/5 hover:bg-white/10 text-white border border-white/15 font-mono text-xs tracking-wider transition"
            >
              Apply as Campus Ambassador
            </Link>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="relative z-10 w-full max-w-7xl mx-auto px-6 sm:px-12 py-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs font-mono text-neutral-500 border-t border-white/[0.08]">
        <div className="flex items-center gap-2">
          <span className="w-1.5 h-1.5 rounded-full bg-white" />
          <span>&copy; 2026 ZENVITRA FOUNDATION &bull; 100% BY YOUTH. FOR YOUTH.</span>
        </div>
        <div className="flex items-center gap-5 text-neutral-400 font-medium">
          <Link href="/manifesto" className="hover:text-white transition">Manifesto</Link>
          <Link href="/impact" className="hover:text-white transition">10% Escrow</Link>
          <Link href="/campus-ambassador" className="hover:text-white transition">Ambassadors</Link>
          <Link href="/privacy" className="hover:text-white transition">Privacy</Link>
        </div>
      </footer>
    </div>
  );
}