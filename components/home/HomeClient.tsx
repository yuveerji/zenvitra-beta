'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import {
  ArrowRight,
  User,
  MessageSquare,
  Calendar,
  Crown,
  Lightbulb,
  Heart,
  Sparkles,
  Newspaper,
  ShieldCheck,
  Lock,
  Terminal,
  Cpu,
  Layers,
  Activity,
  LogOut,
  Menu,
  X,
  Radio,
  FileText,
  Instagram,
  GraduationCap,
  Laptop,
  BookOpen,
  Building,
  CheckCircle2,
  Zap,
  HandHeart,
  TrendingUp,
  Coins,
  ArrowUpRight
} from 'lucide-react';
import MonolithCard from '@/components/home/MonolithCard';
import LiveTelemetryBanner from '@/components/home/LiveTelemetryBanner';
import SocialHoverMenu from '@/components/home/SocialHoverMenu';
import { InteractiveWordModal } from '@/components/home/InteractiveWordModal';
import { InteractiveWordHover, InteractiveWordGroup } from '@/components/home/InteractiveWordHover';
import { EcosystemMindMapModal } from '@/components/home/EcosystemMindMapModal';
import { SpotlightCard } from '@/components/ui/SpotlightCard';
import { AnimatedSection, StaggerChildren, StaggerItem } from '@/components/ui/AnimatedSection';
import { AnimatedCounter } from '@/components/ui/AnimatedCounter';
import { AuroraBackground } from '@/components/ui/AuroraBackground';
import { Navbar } from '@/components/layout/Navbar';
import { Footer } from '@/components/layout/Footer';
import { useAuth } from '@/context/AuthContext';
import { motion } from 'framer-motion';

interface HomeClientProps {
  session: any;
}

export default function HomeClient({ session }: HomeClientProps) {
  const { profile, isAuthenticated, isMockMode } = useAuth();
  const [hasSavedSession, setHasSavedSession] = useState(false);

  useEffect(() => {
    const checkSession = () => {
      try {
        const stored = localStorage.getItem('zenvitra_session_user');
        setHasSavedSession(Boolean(stored));
      } catch (_) {
        setHasSavedSession(false);
      }
    };
    checkSession();
    window.addEventListener('storage', checkSession);
    window.addEventListener('zenvitra_auth_change', checkSession);
    return () => {
      window.removeEventListener('storage', checkSession);
      window.removeEventListener('zenvitra_auth_change', checkSession);
    };
  }, []);

  const isUserLoggedIn = Boolean(profile || session?.user || isAuthenticated || isMockMode || hasSavedSession);
  const platformTargetHref = isUserLoggedIn ? '/pulse' : '/login?redirect=/pulse';

  const getProtocolTargetHref = (href: string) => {
    if (href.startsWith('/pulse') || href.startsWith('/press') || href.startsWith('/events')) {
      return isUserLoggedIn ? href : `/login?redirect=${encodeURIComponent(href)}`;
    }
    return href;
  };
  const ethosCards = [
    {
      icon: User,
      title: 'By Youth, For Youth',
      desc: 'A sovereign space for youth, thinkers, writers, and creators to voice ideas, lead assemblies, and shape policy without institutional gatekeeping.',
    },
    {
      icon: MessageSquare,
      title: 'Sense & Sources',
      desc: 'Built for youth and active minds who value truth, verifiable sources, deep thinking, and open collaboration over algorithmic noise.',
    },
    {
      icon: Sparkles,
      title: 'Real-World Impact',
      desc: 'Creating tangible change through youth-led dialogue, civic innovation, and a guaranteed 25% of profits allocated every 4 months to student scholarships and rural school labs.',
    },
  ];

  const buildingCards = [
    { title: 'Community', desc: 'Connect with thinkers, creators, and ambitious minds worldwide.', icon: User },
    { title: 'Open Forum', desc: 'Write. Speak. Debate. Decide. Drive real change.', icon: MessageSquare },
    { title: 'Events & Summits', desc: 'Assemblies, conferences, summits, and open gatherings.', icon: Calendar },
    { title: 'Leadership', desc: 'Develop skills. Lead initiatives. Inspire others.', icon: Crown },
    { title: 'Innovation', desc: 'Turn ideas into actionable projects and public solutions.', icon: Lightbulb },
    { title: 'Social Good', desc: '25% of all profits directly fund student education & civic kits every 4 months.', icon: Heart },
  ];

  const coreProtocols = [
    {
      title: 'ZEN.PULSE',
      subtitle: 'Sovereign Social Protocol & FLUX',
      description: 'Zero-ad, chronological social engine featuring vertical FLUX reels, Sparks dispatches, multimedia feeds, and instant direct comms.',
      icon: Radio,
      badge: 'SOCIAL PROTOCOL',
      accentColor: 'text-rose-400 bg-rose-500/10 border-rose-500/25 shadow-[0_0_15px_rgba(244,63,94,0.15)]',
      badgeColor: 'text-rose-300 border-rose-500/30 bg-rose-500/10 group-hover:border-rose-400/50',
      arrowColor: 'group-hover:text-rose-300',
      href: '/pulse',
    },
    {
      title: 'ZEN.DISCUSSIONS',
      subtitle: 'Open Civic Debate Trees',
      description: 'Structured argumentation trees, empirical source verification, counter-argument forks, and high-signal youth debates that outlast 24-hour cycles.',
      icon: MessageSquare,
      badge: 'DEBATE PROTOCOL',
      accentColor: 'text-amber-400 bg-amber-500/10 border-amber-500/25 shadow-[0_0_15px_rgba(245,158,11,0.15)]',
      badgeColor: 'text-amber-300 border-amber-500/30 bg-amber-500/10 group-hover:border-amber-400/50',
      arrowColor: 'group-hover:text-amber-300',
      href: '/discussions',
    },
    {
      title: 'ZEN.SOLUTIONS',
      subtitle: 'Open Policy & Whitepaper Vault',
      description: 'Collaborative policy chamber where youth and researchers co-author actionable policy drafts, tabling resolutions, and community solutions.',
      icon: Lightbulb,
      badge: 'POLICY ENGINE',
      accentColor: 'text-cyan-400 bg-cyan-500/10 border-cyan-500/25 shadow-[0_0_15px_rgba(34,211,238,0.15)]',
      badgeColor: 'text-cyan-300 border-cyan-500/30 bg-cyan-500/10 group-hover:border-cyan-400/50',
      arrowColor: 'group-hover:text-cyan-300',
      href: '/solutions',
    },
    {
      title: 'ZEN.PRESS',
      subtitle: 'Independent Investigative Newsroom',
      description: 'Open journalism wire publishing permanent investigative reports, essays, photojournalism, and verified editorial dossiers free of ad incentives.',
      icon: Newspaper,
      badge: 'MEDIA PROTOCOL',
      accentColor: 'text-purple-400 bg-purple-500/10 border-purple-500/25 shadow-[0_0_15px_rgba(168,85,247,0.15)]',
      badgeColor: 'text-purple-300 border-purple-500/30 bg-purple-500/10 group-hover:border-purple-400/50',
      arrowColor: 'group-hover:text-purple-300',
      href: '/press',
    },
    {
      title: 'ZEN.EVENTS & CHAMBERS',
      subtitle: 'Assembly & Summit Operating System',
      description: 'Comprehensive assembly OS with live parliamentary speaker lists, real-time caucus voting, crisis flashes, and permanent participation dossiers.',
      icon: Calendar,
      badge: 'ASSEMBLY OS',
      accentColor: 'text-blue-400 bg-blue-500/10 border-blue-500/25 shadow-[0_0_15px_rgba(59,130,246,0.15)]',
      badgeColor: 'text-blue-300 border-blue-500/30 bg-blue-500/10 group-hover:border-blue-400/50',
      arrowColor: 'group-hover:text-blue-300',
      href: '/events',
    },
    {
      title: 'ZEN.IMPACT',
      subtitle: '25% Profit Endowment & Grants Ledger',
      description: 'Hardcoded constitutional treasury allocating 25% of all profits every 4 months, verified by offline handover videos on ZEN.FLUX and public receipts.',
      icon: Heart,
      badge: '25% PROFIT ESCROW',
      accentColor: 'text-emerald-400 bg-emerald-500/10 border-emerald-500/25 shadow-[0_0_15px_rgba(52,211,153,0.15)]',
      badgeColor: 'text-emerald-300 border-emerald-500/30 bg-emerald-500/10 group-hover:border-emerald-400/50',
      arrowColor: 'group-hover:text-emerald-300',
      href: '/impact',
    },
  ];

  const architecturalTenets = [
    {
      icon: Terminal,
      title: 'Zero Algorithmic Interventions',
      detail: 'Feeds strictly sorted chronologically. Zero behavioral commodification.',
    },
    {
      icon: ShieldCheck,
      title: 'Decentralized Identity Namespace',
      detail: 'Verifiable credentials, pseudonymous handles, and unforgeable identities.',
    },
    {
      icon: Cpu,
      title: 'Deterministic State Verification',
      detail: 'Every resolution, article, and grant transaction is cryptographically logged.',
    },
    {
      icon: Lock,
      title: 'Guaranteed 25% Profit Impact Invariant',
      detail: 'Hardcoded constitutional mandate distributing 25% of profits every 4 months with video proof.',
    },
  ];

  const milestones = [
    { metric: '100%', label: 'Sovereign Codebase' },
    { metric: '25%', label: 'Profits to Youth Grants' },
    { metric: '0', label: 'Algorithmic Feeds' },
    { metric: '0', label: 'Data Brokers / Trackers' },
  ];

  /* Word-by-word hero animation */
  const heroWords = ['Meaningful', 'Change', 'Starts', 'With'];

  return (
    <div className="min-h-screen bg-[#030405] text-white overflow-x-hidden font-sans relative">
      {/* Ambient Aurora Background */}
      <AuroraBackground />

      {/* All content above aurora */}
      <div className="relative z-10">

        {/* 1. Global Luxury Navigation */}
        <Navbar />

        {/* 2. Hero Section (Comfortable spacing & bidirectional entrance) */}
        <section className="max-w-7xl mx-auto px-6 sm:px-12 pt-28 sm:pt-36 lg:pt-40 pb-20 grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-12 items-center">
          <div className="lg:col-span-6 space-y-7 text-left">
            <AnimatedSection delay={0.1}>
              <div className="inline-flex items-center gap-2.5 px-4 py-1.5 rounded-full border border-white/15 bg-white/[0.02] text-[10px] sm:text-[11px] font-mono tracking-widest text-neutral-300 uppercase">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse shadow-[0_0_8px_#34d399]" />
                <span>SOVEREIGN NETWORK FOR YOUTH WITH SENSES &amp; SOURCES</span>
              </div>
            </AnimatedSection>

            <div className="overflow-hidden">
              <h1 className="font-display font-black text-3xl sm:text-5xl lg:text-[4.75rem] text-white tracking-tight leading-[1.08] sm:leading-[1.02]">
                <motion.span
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.7, delay: 0.25, ease: [0.16, 1, 0.3, 1] }}
                  className="block text-white"
                >
                  Meaningful Change
                </motion.span>
                <motion.span
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.7, delay: 0.4, ease: [0.16, 1, 0.3, 1] }}
                  className="block mt-1 sm:mt-1.5"
                >
                  Starts With{' '}
                  <span className="font-serif italic font-light tracking-normal text-neutral-400 inline-block">
                    Truth and Youth.
                  </span>
                </motion.span>
              </h1>
            </div>

            <AnimatedSection delay={0.55} className="relative z-30">
              <InteractiveWordGroup>
                <div className="text-sm sm:text-base text-neutral-400 font-light max-w-lg leading-relaxed">
                  A sovereign platform for{' '}
                  <InteractiveWordHover termKey="youth" side="top" align="left">
                    <span className="text-white font-medium underline decoration-amber-400/70 decoration-2 underline-offset-4 hover:decoration-amber-300 hover:text-amber-200 transition cursor-pointer">
                      Youth
                    </span>
                  </InteractiveWordHover>{' '}
                  —{' '}
                  <InteractiveWordHover termKey="leaders" side="top" align="left">
                    <span className="text-white font-medium underline decoration-amber-400/70 decoration-2 underline-offset-4 hover:decoration-amber-300 hover:text-amber-200 transition cursor-pointer">
                      thinkers
                    </span>
                  </InteractiveWordHover>
                  ,{' '}
                  <InteractiveWordHover termKey="creators" side="top" align="left">
                    <span className="text-white font-medium underline decoration-cyan-400/70 decoration-2 underline-offset-4 hover:decoration-cyan-300 hover:text-cyan-200 transition cursor-pointer">
                      writers
                    </span>
                  </InteractiveWordHover>{' '}
                  &amp;{' '}
                  <InteractiveWordHover termKey="innovators" side="top" align="left">
                    <span className="text-white font-medium underline decoration-emerald-400/70 decoration-2 underline-offset-4 hover:decoration-emerald-300 hover:text-emerald-200 transition cursor-pointer">
                      creators
                    </span>
                  </InteractiveWordHover>{' '}
                  with{' '}
                  <InteractiveWordHover termKey="sources-and-senses" side="top" align="left">
                    <span className="text-white font-medium underline decoration-cyan-400/70 decoration-2 underline-offset-4 hover:decoration-cyan-300 hover:text-cyan-200 transition cursor-pointer">
                      senses and sources
                    </span>
                  </InteractiveWordHover>{' '}
                  to write, speak, connect, and drive{' '}
                  <InteractiveWordHover termKey="escrow" side="top" align="left">
                    <span className="text-white font-medium underline decoration-emerald-400/70 decoration-2 underline-offset-4 hover:decoration-emerald-300 hover:text-emerald-200 transition cursor-pointer">
                      real-world impact
                    </span>
                  </InteractiveWordHover>.
                </div>
              </InteractiveWordGroup>
            </AnimatedSection>

            {/* Bidirectional Animated Action Buttons */}
            <AnimatedSection delay={0.7} direction="auto" className="relative z-10">
              <div className="flex flex-wrap items-center gap-3 sm:gap-4 pt-2 font-mono text-xs">
                {/* 1. Enter Platform Primary CTA */}
                <Link
                  href={platformTargetHref}
                  className="group px-7 sm:px-8 py-3.5 sm:py-4 rounded-full bg-white text-black font-semibold hover:bg-neutral-100 transition-all duration-300 flex items-center gap-2.5 shadow-[0_0_40px_rgba(255,255,255,0.2)] hover:shadow-[0_0_60px_rgba(255,255,255,0.35)] btn-glow cursor-pointer text-xs uppercase tracking-wider font-display font-bold hover:scale-[1.02] active:scale-[0.98]"
                >
                  <span>{isUserLoggedIn ? 'Enter Platform' : 'Enter Zenvitra'}</span>
                  <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </Link>

                {/* 2. Learn More Secondary CTA */}
                <Link
                  href="/about"
                  className="group px-6 sm:px-7 py-3.5 sm:py-4 rounded-full border border-white/20 bg-white/[0.04] text-neutral-200 hover:text-white hover:bg-white/[0.08] hover:border-white/40 transition-all duration-300 flex items-center gap-2 backdrop-blur-md shadow-[0_0_20px_rgba(255,255,255,0.05)] cursor-pointer text-xs hover:scale-[1.02] active:scale-[0.98]"
                >
                  <span>Learn More</span>
                  <ArrowRight className="w-3.5 h-3.5 text-neutral-400 group-hover:text-white group-hover:translate-x-0.5 transition-transform" />
                </Link>

                {/* 3. Join Core Team Tertiary CTA */}
                <Link
                  href="/join-core-team"
                  className="px-6 sm:px-7 py-3.5 sm:py-4 rounded-full border border-amber-400/30 bg-amber-400/[0.04] text-amber-300 hover:bg-amber-400/10 hover:border-amber-400/50 transition-all duration-300 flex items-center gap-2 backdrop-blur-sm btn-glow shadow-[0_0_20px_rgba(251,191,36,0.08)] cursor-pointer text-xs hover:scale-[1.02] active:scale-[0.98]"
                >
                  <Sparkles className="w-3.5 h-3.5 text-amber-300" />
                  <span>Join Core Team</span>
                </Link>
              </div>
            </AnimatedSection>
          </div>

          <AnimatedSection delay={0.4} direction="scale" className="lg:col-span-6 flex justify-center lg:justify-end">
            <MonolithCard />
          </AnimatedSection>
        </section>

        {/* 3. Live Telemetry */}
        <AnimatedSection className="px-6 sm:px-12 py-6">
          <LiveTelemetryBanner />
        </AnimatedSection>

        {/* 4. Milestones — Animated Counters */}
        <AnimatedSection className="max-w-6xl mx-auto px-6 sm:px-12 py-16">
          <SpotlightCard paddingClassName="p-8 sm:p-10" glowColor="rgba(255, 255, 255, 0.08)">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
              {milestones.map((m, idx) => (
                <div key={idx} className="text-center space-y-1.5">
                  <div className="font-display font-medium text-3xl sm:text-4xl text-white tracking-tight">
                    <AnimatedCounter target={m.metric} />
                  </div>
                  <div className="font-mono text-[10px] text-neutral-400 tracking-widest uppercase">
                    {m.label}
                  </div>
                </div>
              ))}
            </div>
          </SpotlightCard>
        </AnimatedSection>

        {/* 4.5 FOUNDER'S NOTE & SOVEREIGN DIRECTIVE */}
        <section className="relative z-10 max-w-5xl mx-auto px-6 sm:px-12 py-8 text-left">
          <AnimatedSection>
            <SpotlightCard 
              className="bg-[#070709] border border-white/[0.08] hover:border-white/20 shadow-2xl"
              paddingClassName="p-8 sm:p-12"
              glowMode="blue-purple"
            >
              <div className="space-y-7">
                {/* Header Tag */}
                <div className="flex flex-wrap items-center justify-between gap-4 pb-5 border-b border-white/[0.06]">
                  <div className="flex items-center gap-3.5">
                    <div className="relative w-10 h-10 rounded-2xl overflow-hidden border border-white/15 bg-white/5 shadow-md flex-shrink-0">
                      <Image
                        src="/assets/founder.png"
                        alt="Yuveer - Founder"
                        fill
                        className="object-cover"
                      />
                    </div>
                    <div>
                      <span className="font-mono text-[10px] tracking-[0.25em] text-neutral-400 uppercase font-semibold block">
                        FOUNDER&apos;S DIRECTIVE &bull; DISPATCH #001
                      </span>
                      <h3 className="font-display font-medium text-base text-white">
                        A Note from the Founder
                      </h3>
                    </div>
                  </div>

                  <span className="px-3 py-1 rounded-full bg-white/[0.04] border border-white/10 text-neutral-400 font-mono text-[10px] tracking-wider uppercase">
                    VERIFIED DIRECTIVE
                  </span>
                </div>

                {/* Body Content */}
                <div className="space-y-4 text-sm sm:text-base text-neutral-300 font-sans leading-relaxed">
                  <p className="font-display font-medium text-lg sm:text-xl text-white leading-snug">
                    &ldquo;The modern internet was supposed to give our generation a voice. Instead, it gave us algorithms engineered for outrage, fleeting attention spans, and ephemeral feeds that erase thought within 24 hours.&rdquo;
                  </p>

                  <p className="font-light text-neutral-300">
                    When we set out to build <strong className="text-white font-medium">ZENVITRA</strong>, the intention was clear: to reclaim digital sovereignty for youth thinkers, writers, delegates, and builders. We did not want another sterile social network where ideas are trapped in echo chambers or monetized by ad surveillance.
                  </p>

                  <p className="font-light text-neutral-300">
                    We built Zenvitra as an interconnected civic mesh: an ecosystem where debates demand <strong className="text-white font-medium">verifiable sources</strong>, where Model UN assemblies and youth councils produce permanent legislative records, and where dialogue directly powers grassroots change.
                  </p>

                  <div className="p-4 sm:p-5 rounded-2xl bg-white/[0.02] border border-white/[0.08] text-neutral-300 font-mono text-xs sm:text-sm leading-relaxed space-y-1.5">
                    <span className="text-neutral-200 font-bold text-xs uppercase tracking-wider block">
                      &bull; Our Constitutional Pledge:
                    </span>
                    <p className="text-neutral-400">
                      Words mean little without structural action. That is why <strong className="text-white">25% of all net platform profits</strong> are constitutionally dedicated <strong className="text-amber-300">every 4 months</strong> to direct student scholarships, classroom kits, and computer labs—proven through offline giveaway videos and public receipts broadcast on <strong className="text-cyan-300">ZEN.FLUX</strong> and social platforms.
                    </p>
                  </div>

                  <p className="font-light text-neutral-300">
                    Zenvitra belongs to every student who refuses to accept that digital discourse has to be shallow. Read deeply, publish fearlessly, debate rigorously, and help us build a lasting public memory.
                  </p>
                </div>

                {/* Footer Signature & Actions */}
                <div className="pt-5 border-t border-white/[0.06] flex flex-col sm:flex-row sm:items-center justify-between gap-5">
                  <div className="space-y-0.5">
                    <h4 className="font-display font-medium text-base text-white">
                      Yuveer Chhatwani
                    </h4>
                    <p className="font-mono text-xs text-neutral-400">
                      Founder &amp; System Architect, Zenvitra &bull; <span className="text-neutral-300">@yuveer</span>
                    </p>
                  </div>

                  <div className="flex items-center gap-3">
                    <Link
                      href="/manifesto"
                      className="px-4 py-2 rounded-xl bg-white/[0.04] hover:bg-white/[0.08] border border-white/10 text-white font-mono text-xs font-medium transition flex items-center gap-2 cursor-pointer"
                    >
                      <span>Read Full Manifesto</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </Link>

                    <Link
                      href={isUserLoggedIn ? '/pulse?user=yuveer' : `/login?redirect=${encodeURIComponent('/pulse?user=yuveer')}`}
                      className="px-4 py-2 rounded-xl bg-white text-black hover:bg-neutral-200 font-mono text-xs font-bold transition shadow-sm flex items-center gap-2 cursor-pointer"
                    >
                      <span>Connect on Pulse</span>
                      <ArrowUpRight className="w-3.5 h-3.5" />
                    </Link>
                  </div>
                </div>
              </div>
            </SpotlightCard>
          </AnimatedSection>
        </section>

        {/* 5. "WHY ZENVITRA?" */}
        <section className="max-w-6xl mx-auto px-6 sm:px-12 py-20 space-y-12 text-center">
          <AnimatedSection>
            <div className="space-y-3">
              <span className="font-mono text-[10px] tracking-[0.3em] text-neutral-400 uppercase">
                WHY ZENVITRA?
              </span>
              <h2 className="font-display font-medium text-3xl sm:text-5xl text-white tracking-tight leading-snug max-w-2xl mx-auto">
                We&apos;re building more than a platform.{' '}
                <span className="text-gradient-shimmer">We&apos;re building a movement.</span>
              </h2>
            </div>
          </AnimatedSection>

          <StaggerChildren className="grid grid-cols-1 md:grid-cols-3 gap-6 text-left" staggerDelay={0.15}>
            {ethosCards.map((card, idx) => {
              const Icon = card.icon;
              return (
                <StaggerItem key={idx}>
                  <SpotlightCard className="h-full">
                    <div className="space-y-6">
                      <div className="w-12 h-12 rounded-2xl bg-white/[0.04] border border-white/10 flex items-center justify-center text-white transition-colors duration-300">
                        <Icon className="w-5 h-5" />
                      </div>
                      <div className="space-y-3">
                        <h3 className="font-display font-medium text-xl text-white">
                          {card.title}
                        </h3>
                        <p className="text-xs sm:text-sm text-neutral-400 leading-relaxed font-light font-sans">
                          {card.desc}
                        </p>
                      </div>
                    </div>
                  </SpotlightCard>
                </StaggerItem>
              );
            })}
          </StaggerChildren>
        </section>

        {/* 5.5 ICONIC MANIFESTO STRIP */}
        <section className="relative overflow-hidden px-6 sm:px-12 py-24 sm:py-32 text-white">
          <div className="relative z-10 max-w-6xl mx-auto space-y-16">
            <div className="flex items-center gap-4">
              <p className="text-xs uppercase font-mono tracking-[0.3em] text-purple-300">
                Zenvitra Manifesto
              </p>
              <div className="h-px w-20 bg-purple-500/30" />
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-end">
              <div className="lg:col-span-8 space-y-4 text-left">
                <h2 className="font-display font-black text-5xl sm:text-7xl lg:text-8xl tracking-tight leading-[0.9] text-white uppercase">
                  WE WERE
                  <br />
                  GIVEN
                  <br />
                  OPINIONS.
                </h2>
                <h3 className="font-serif italic font-light text-4xl sm:text-6xl lg:text-7xl text-[#efe7dc] leading-tight">
                  Not enough platforms.
                </h3>
              </div>

              <div className="lg:col-span-4 space-y-4 text-xs sm:text-sm text-neutral-400 font-mono leading-relaxed border-l border-purple-500/30 pl-6 text-left">
                <p className="text-white font-semibold text-base font-sans leading-snug">
                  &ldquo;You can ignore a generation for only so long before it builds platforms of its own.&rdquo;
                </p>
                <p className="text-neutral-400 font-sans font-light">
                  Most platforms reward outrage, polarization, and algorithmic noise. Nuanced discussions are buried beneath performance and engagement cycles.
                </p>
                <p className="text-emerald-400 font-mono text-xs">
                  Zenvitra was built to preserve meaningful youth participation through open dialogue and documented outcomes.
                </p>
              </div>
            </div>

            {/* 4 Pillars Strip — Luxury Colored Obsidian Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 pt-10 border-t border-white/10 text-xs font-mono text-left w-full">
              {/* Card 1 */}
              <SpotlightCard paddingClassName="p-6">
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-mono text-purple-300 uppercase tracking-widest font-semibold">01 // FORUM</span>
                    <span className="w-1.5 h-1.5 rounded-full bg-purple-400 shadow-[0_0_8px_rgba(168,85,247,0.6)]" />
                  </div>
                  <h4 className="font-display font-medium text-lg text-white group-hover:text-purple-200 transition-colors">
                    Open Discussions
                  </h4>
                  <p className="text-xs sm:text-sm text-neutral-400 leading-relaxed font-light font-sans">
                    Thoughtful youth-led conversations shaping governance & culture.
                  </p>
                </div>
              </SpotlightCard>

              {/* Card 2 */}
              <SpotlightCard paddingClassName="p-6">
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-mono text-cyan-300 uppercase tracking-widest font-semibold">02 // NETWORK</span>
                    <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 shadow-[0_0_8px_rgba(34,211,238,0.6)]" />
                  </div>
                  <h4 className="font-display font-medium text-lg text-white group-hover:text-cyan-200 transition-colors">
                    Diverse Perspectives
                  </h4>
                  <p className="text-xs sm:text-sm text-neutral-400 leading-relaxed font-light font-sans">
                    A unified global network across Model UNs, labs, and campuses.
                  </p>
                </div>
              </SpotlightCard>

              {/* Card 3 */}
              <SpotlightCard paddingClassName="p-6">
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-mono text-amber-300 uppercase tracking-widest font-semibold">03 // ARCHIVE</span>
                    <span className="w-1.5 h-1.5 rounded-full bg-amber-400 shadow-[0_0_8px_rgba(251,191,36,0.6)]" />
                  </div>
                  <h4 className="font-display font-medium text-lg text-white group-hover:text-amber-200 transition-colors">
                    Documented Outcomes
                  </h4>
                  <p className="text-xs sm:text-sm text-neutral-400 leading-relaxed font-light font-sans">
                    Draft resolutions, policy briefs, and verified assembly credentials.
                  </p>
                </div>
              </SpotlightCard>

              {/* Card 4 */}
              <SpotlightCard paddingClassName="p-6">
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-mono text-emerald-300 uppercase tracking-widest font-semibold">04 // SYSTEM</span>
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 shadow-[0_0_8px_rgba(52,211,153,0.6)]" />
                  </div>
                  <h4 className="font-display font-medium text-lg text-white group-hover:text-emerald-200 transition-colors">
                    All In One Place
                  </h4>
                  <p className="text-xs sm:text-sm text-neutral-400 leading-relaxed font-light font-sans">
                    The sovereign digital ecosystem for the next generation.
                  </p>
                </div>
              </SpotlightCard>
            </div>
          </div>
        </section>

        {/* 6. "WHAT WE'RE BUILDING" */}
        <section className="max-w-6xl mx-auto px-6 sm:px-12 py-20 space-y-12 text-center">
          <AnimatedSection>
            <div className="space-y-3">
              <span className="font-mono text-[10px] tracking-[0.3em] text-neutral-400 uppercase">
                WHAT WE&apos;RE BUILDING
              </span>
              <h2 className="font-display font-medium text-3xl sm:text-5xl text-white tracking-tight">
                An ecosystem. <span className="text-gradient-shimmer">Endless possibilities.</span>
              </h2>
            </div>
          </AnimatedSection>

          <StaggerChildren className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 text-left" staggerDelay={0.1}>
            {buildingCards.map((p, idx) => {
              const Icon = p.icon;
              return (
                <StaggerItem key={idx}>
                  <SpotlightCard>
                    <div className="space-y-5">
                      <div className="w-12 h-12 rounded-2xl bg-white/[0.04] border border-white/10 flex items-center justify-center text-neutral-300 group-hover:text-white transition-colors duration-300">
                        <Icon className="w-5 h-5" />
                      </div>
                      <div className="space-y-2">
                        <h4 className="font-display font-medium text-lg text-white">
                          {p.title}
                        </h4>
                        <p className="text-xs sm:text-sm text-neutral-400 leading-relaxed font-light font-sans">
                          {p.desc}
                        </p>
                      </div>
                    </div>
                  </SpotlightCard>
                </StaggerItem>
              );
            })}
          </StaggerChildren>
        </section>

        {/* 7. The Sovereign Subsystems Matrix */}
        <section className="relative z-10 max-w-6xl mx-auto px-6 sm:px-12 py-20 space-y-12">
          <AnimatedSection>
            <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-6 pb-6 border-b border-white/10">
              <div className="space-y-2 text-left">
                <span className="font-mono text-[10px] tracking-[0.3em] text-neutral-400 uppercase">
                  SOVEREIGN NETWORK PROTOCOLS
                </span>
                <h2 className="font-display font-medium text-3xl sm:text-4xl text-white tracking-tight">
                  The Core Subsystems Matrix
                </h2>
              </div>
              <p className="font-mono text-xs text-neutral-400 max-w-sm text-left sm:text-right">
                Six active modular engines powering youth discourse, policy drafting, journalism, assembly governance, and direct impact.
              </p>
            </div>
          </AnimatedSection>

          <StaggerChildren className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 text-left" staggerDelay={0.1}>
            {coreProtocols.map((protocol) => {
              const Icon = protocol.icon;
              return (
                <StaggerItem key={protocol.title}>
                  <Link href={getProtocolTargetHref(protocol.href)} className="block group h-full">
                    <SpotlightCard className="h-full flex flex-col justify-between">
                      <div className="space-y-6">
                        <div className="flex items-center justify-between">
                          <div className={`w-12 h-12 rounded-2xl border flex items-center justify-center transition-transform group-hover:scale-105 duration-300 ${protocol.accentColor}`}>
                            <Icon className="w-5 h-5" />
                          </div>
                          <span className={`font-mono text-[9px] tracking-widest px-3 py-1 rounded-full border uppercase transition ${protocol.badgeColor}`}>
                            {protocol.badge}
                          </span>
                        </div>

                        <div className="space-y-1.5">
                          <h3 className="font-display font-medium text-xl text-white group-hover:text-neutral-100 transition-colors">
                            {protocol.title}
                          </h3>
                          <p className="text-xs font-mono text-neutral-400 font-medium">
                            {protocol.subtitle}
                          </p>
                        </div>

                        <p className="text-xs text-neutral-400 leading-relaxed font-light font-sans">
                          {protocol.description}
                        </p>
                      </div>

                      <div className={`pt-6 border-t border-white/5 flex items-center justify-between font-mono text-xs text-neutral-400 transition mt-6 ${protocol.arrowColor}`}>
                        <span>Initialize Protocol</span>
                        <ArrowRight className="w-4 h-4 transform group-hover:translate-x-2 transition-transform duration-300" />
                      </div>
                    </SpotlightCard>
                  </Link>
                </StaggerItem>
              );
            })}
          </StaggerChildren>
        </section>

        {/* 7.5 DISCUSSIONS THAT DON'T DISAPPEAR */}
        <section className="relative z-10 max-w-6xl mx-auto px-6 sm:px-12 py-20 space-y-12 text-left">
          <AnimatedSection>
            <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-6 pb-6 border-b border-white/10">
              <div className="space-y-2">
                <span className="font-mono text-[10px] tracking-[0.3em] text-neutral-400 uppercase">
                  ACTIVE DEBATES
                </span>
                <h2 className="font-display font-black text-3xl sm:text-5xl text-white tracking-tight uppercase leading-tight">
                  DISCUSSIONS THAT DON&apos;T DISAPPEAR.
                </h2>
              </div>
              <p className="text-xs text-neutral-400 max-w-sm font-light leading-relaxed font-sans">
                Most online conversations disappear within hours. Zenvitra preserves thoughtful youth discussions through public archives, documented participation, and civic dialogue designed to outlast outrage cycles.
              </p>
            </div>
          </AnimatedSection>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            <Link href="/discussions" className="block group">
              <SpotlightCard paddingClassName="p-6">
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="px-2.5 py-0.5 rounded-full bg-amber-500/10 border border-amber-500/30 text-amber-300 font-mono text-[10px] uppercase tracking-wider font-semibold">
                      POLITICS & FREE SPEECH
                    </span>
                    <span className="text-[10px] text-neutral-400 font-mono">148 replies</span>
                  </div>
                  <h3 className="font-display font-medium text-sm text-white group-hover:text-amber-200 transition-colors leading-snug">
                    Samay Raina, Ranveer &amp; Ashish Solanki: Is comedy &amp; podcasting becoming a political crime?
                  </h3>
                  <p className="text-[11px] text-zinc-400 font-sans line-clamp-2 leading-relaxed">
                    FIRs, police notices, and algorithmic mob boycotts: where does satirical free expression end and political intimidation begin?
                  </p>
                  <div className="flex items-center gap-1.5 text-[11px] text-neutral-400 font-mono pt-1">
                    <span className="w-1.5 h-1.5 rounded-full bg-amber-400 shadow-[0_0_6px_rgba(251,191,36,0.6)]" />
                    <span>Free Speech Crisis</span>
                  </div>
                </div>
              </SpotlightCard>
            </Link>

            <Link href="/discussions" className="block group">
              <SpotlightCard paddingClassName="p-6">
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="px-2.5 py-0.5 rounded-full bg-cyan-500/10 border border-cyan-500/30 text-cyan-300 font-mono text-[10px] uppercase tracking-wider font-semibold">
                      EDUCATION & INTEGRITY
                    </span>
                    <span className="text-[10px] text-neutral-400 font-mono">234 replies</span>
                  </div>
                  <h3 className="font-display font-medium text-sm text-white group-hover:text-cyan-200 transition-colors leading-snug">
                    The NEET-UG Paper Leak Scandal: 2.4 Million students betrayed by systemic corruption.
                  </h3>
                  <p className="text-[11px] text-zinc-400 font-sans line-clamp-2 leading-relaxed">
                    From Telegram paper leaks to NTA institutional failures — how do youth dismantle the coaching syndicate and compromised meritocracy?
                  </p>
                  <div className="flex items-center gap-1.5 text-[11px] text-neutral-400 font-mono pt-1">
                    <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 shadow-[0_0_6px_rgba(34,211,238,0.6)]" />
                    <span>National Paper Leak Crisis</span>
                  </div>
                </div>
              </SpotlightCard>
            </Link>

            <Link href="/discussions" className="block group">
              <SpotlightCard paddingClassName="p-6">
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="px-2.5 py-0.5 rounded-full bg-purple-500/10 border border-purple-500/30 text-purple-300 font-mono text-[10px] uppercase tracking-wider font-semibold">
                      MEDIA & DEMOCRACY
                    </span>
                    <span className="text-[10px] text-neutral-400 font-mono">189 replies</span>
                  </div>
                  <h3 className="font-display font-medium text-sm text-white group-hover:text-purple-200 transition-colors leading-snug">
                    The &apos;Godi Media&apos; Surrender: Has Indian prime-time television traded truth for state propaganda?
                  </h3>
                  <p className="text-[11px] text-zinc-400 font-sans line-clamp-2 leading-relaxed">
                    Manufactured communal shouting matches, zero accountability on jobs, and corporate subservience: why youth demand decentralized civic press.
                  </p>
                  <div className="flex items-center gap-1.5 text-[11px] text-neutral-400 font-mono pt-1">
                    <span className="w-1.5 h-1.5 rounded-full bg-purple-400 shadow-[0_0_6px_rgba(168,85,247,0.6)]" />
                    <span>Fourth Pillar Collapse</span>
                  </div>
                </div>
              </SpotlightCard>
            </Link>

            <Link href="/discussions" className="block group">
              <SpotlightCard paddingClassName="p-6">
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="px-2.5 py-0.5 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-300 font-mono text-[10px] uppercase tracking-wider font-semibold">
                      TECHNOLOGY & RIGHTS
                    </span>
                    <span className="text-[10px] text-neutral-400 font-mono">116 replies</span>
                  </div>
                  <h3 className="font-display font-medium text-sm text-white group-hover:text-emerald-200 transition-colors leading-snug">
                    Algorithmic Surveillance, Deepfakes &amp; DPDP: Are youth sleepwalking into a digital panopticon?
                  </h3>
                  <p className="text-[11px] text-zinc-400 font-sans line-clamp-2 leading-relaxed">
                    Unchecked facial recognition, AI-driven content takedowns, and data profiling: reclaiming privacy in the age of authoritarian tech.
                  </p>
                  <div className="flex items-center gap-1.5 text-[11px] text-neutral-400 font-mono pt-1">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 shadow-[0_0_6px_rgba(52,211,153,0.6)]" />
                    <span>Digital Sovereignty</span>
                  </div>
                </div>
              </SpotlightCard>
            </Link>
          </div>
        </section>

        {/* 7.6 DOCUMENTATION ARCHIVE */}
        <section className="relative z-10 max-w-6xl mx-auto px-6 sm:px-12 py-20 space-y-12 text-left">
          <AnimatedSection>
            <div className="p-8 sm:p-12 rounded-3xl bg-gradient-to-b from-[#18132c]/90 to-[#0b0916]/95 border border-white/12 shadow-[0_20px_60px_rgba(0,0,0,0.85),0_0_40px_rgba(168,85,247,0.12)] space-y-8">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-white/10">
                <div className="space-y-1">
                  <span className="font-mono text-[10px] uppercase tracking-[0.3em] text-purple-300 font-bold">
                    Documentation Archive
                  </span>
                  <h3 className="font-display font-black text-2xl sm:text-3xl text-white tracking-tight uppercase">
                    Discussions matter more when they leave behind public records.
                  </h3>
                </div>
                <Link
                  href={isUserLoggedIn ? '/press' : `/login?redirect=${encodeURIComponent('/press')}`}
                  className="px-5 py-2 rounded-full bg-white text-black font-semibold text-xs hover:bg-neutral-200 transition shrink-0"
                >
                  View Full Archive
                </Link>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <SpotlightCard paddingClassName="p-5">
                  <div className="space-y-2.5">
                    <span className="px-2 py-0.5 rounded-md bg-purple-500/10 border border-purple-500/20 text-purple-300 text-[10px] font-mono font-bold uppercase">
                      DRAFT RESOLUTION
                    </span>
                    <h4 className="font-display font-medium text-sm text-white">Addressing Climate Migration and Urban Displacement</h4>
                    <p className="text-[10px] text-neutral-400 font-mono">Archived 2026 • Geneva Caucus</p>
                  </div>
                </SpotlightCard>

                <SpotlightCard paddingClassName="p-5">
                  <div className="space-y-2.5">
                    <span className="px-2 py-0.5 rounded-md bg-cyan-500/10 border border-cyan-500/20 text-cyan-300 text-[10px] font-mono font-bold uppercase">
                      POLICY DRAFT
                    </span>
                    <h4 className="font-display font-medium text-sm text-white">Framework for Youth Representation in Digital Governance</h4>
                    <p className="text-[10px] text-neutral-400 font-mono">Archived 2026 • Vienna Summit</p>
                  </div>
                </SpotlightCard>

                <SpotlightCard paddingClassName="p-5">
                  <div className="space-y-2.5">
                    <span className="px-2 py-0.5 rounded-md bg-amber-500/10 border border-amber-500/20 text-amber-300 text-[10px] font-mono font-bold uppercase">
                      PRESS RELEASE
                    </span>
                    <h4 className="font-display font-medium text-sm text-white">Official Outcomes of the Asia-Pacific Youth Dialogue</h4>
                    <p className="text-[10px] text-neutral-400 font-mono">Archived 2026 • Tokyo Assembly</p>
                  </div>
                </SpotlightCard>
              </div>

              <p className="text-xs text-neutral-400 font-mono pt-4 border-t border-white/5 text-center sm:text-left">
                Public memory through documentation. Transforming temporary conversations into long-term civic memory.
              </p>
            </div>
          </AnimatedSection>
        </section>

        {/* 7.7 DONATION & CIVIC IMPACT GRID — THE ZENVITRA PLEDGE */}
        <section className="relative z-10 max-w-6xl mx-auto px-6 sm:px-12 py-20 space-y-12 text-left">
          <AnimatedSection>
            <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-6 pb-6 border-b border-white/10">
              <div className="space-y-2">
                <span className="font-mono text-[10px] tracking-[0.3em] text-amber-300 uppercase font-bold flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-amber-400 animate-pulse" />
                  CIVIC IMPACT &amp; DONATION GRID
                </span>
                <h2 className="font-display font-black text-3xl sm:text-5xl text-white tracking-tight uppercase leading-tight">
                  FROM DIALOGUE TO DIRECT IMPACT.
                </h2>
              </div>
              <p className="text-xs text-neutral-400 max-w-md font-light leading-relaxed font-sans">
                ZENVITRA doesn&apos;t just host discussions—we bridge youth leadership directly to grassroots action, transparent philanthropy, and public school modernizations.
              </p>
            </div>
          </AnimatedSection>

          {/* Master 25% Sovereign Pledge Bento Hero */}
          <div className="relative rounded-3xl p-8 sm:p-10 bg-gradient-to-br from-[#1a1408] via-[#0d0d14] to-[#120a1c] border border-amber-500/30 shadow-[0_20px_60px_rgba(0,0,0,0.85),0_0_50px_rgba(245,158,11,0.1)] overflow-hidden">
            {/* Ambient Background Glow */}
            <div className="absolute top-0 right-0 w-96 h-96 bg-amber-500/10 rounded-full blur-[100px] pointer-events-none" />
            <div className="absolute bottom-0 left-0 w-80 h-80 bg-purple-500/10 rounded-full blur-[100px] pointer-events-none" />

            <div className="relative z-10 grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
              <div className="lg:col-span-8 space-y-4">
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-400/10 border border-amber-400/30 text-amber-300 font-mono text-[11px] font-bold uppercase tracking-wider">
                  <Coins className="w-3.5 h-3.5 text-amber-400" />
                  <span>The 25% Profit Endowment Pledge</span>
                </div>
                <h3 className="font-display font-black text-2xl sm:text-4xl text-white tracking-tight leading-tight">
                  Every Summit. Every Community Action. Direct Educational Capital.
                </h3>
                <p className="text-xs sm:text-sm text-neutral-300 font-sans font-light leading-relaxed max-w-2xl">
                  A guaranteed 25% of all net platform profits are distributed every 4 months into verified school laboratories, curriculum kits, and delegate grants—verified with unedited offline giveaway videos and public receipts broadcast on ZEN.FLUX and social platforms.
                </p>
                <div className="flex flex-wrap gap-4 pt-2">
                  <div className="flex items-center gap-2 text-xs font-mono text-neutral-400">
                    <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                    <span>Every 4 Months Distribution</span>
                  </div>
                  <div className="flex items-center gap-2 text-xs font-mono text-neutral-400">
                    <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                    <span>Offline Giveaway Videos on ZEN.FLUX</span>
                  </div>
                  <div className="flex items-center gap-2 text-xs font-mono text-neutral-400">
                    <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                    <span>Public Itemized Receipts Ledger</span>
                  </div>
                </div>
              </div>

              {/* Direct CTA Box */}
              <div className="lg:col-span-4 flex flex-col gap-3 justify-center bg-black/60 backdrop-blur-xl p-6 rounded-2xl border border-white/15 text-center">
                <span className="text-[10px] font-mono text-neutral-400 uppercase tracking-widest">
                  Direct Citizen &amp; CSR Giving
                </span>
                <div className="text-xl sm:text-2xl font-display font-bold text-white">
                  Join the Movement
                </div>
                <p className="text-[11px] text-neutral-400 font-mono leading-tight">
                  Transform a government school or back a grassroots civic grant today.
                </p>
                <div className="space-y-2 pt-2">
                  <Link
                    href="/donate/govt-schools"
                    className="w-full py-3 px-4 rounded-xl bg-gradient-to-r from-amber-400 to-amber-500 hover:from-amber-300 hover:to-amber-400 text-black font-display font-bold text-xs uppercase tracking-wider transition shadow-lg flex items-center justify-center gap-2 group cursor-pointer"
                  >
                    <span>Donate to Govt Schools</span>
                    <ArrowRight className="w-3.5 h-3.5 transform group-hover:translate-x-1 transition-transform" />
                  </Link>
                  <Link
                    href="/invest-donate"
                    className="w-full py-2.5 px-4 rounded-xl bg-white/[0.06] hover:bg-white/10 border border-white/15 text-white font-mono text-xs font-semibold transition flex items-center justify-center gap-2 cursor-pointer"
                  >
                    <span>Invest in Youth Grants</span>
                    <ArrowUpRight className="w-3.5 h-3.5 text-neutral-400" />
                  </Link>
                </div>
              </div>
            </div>
          </div>

          {/* 3 Impact Channels Grid */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Card 1: Govt School Kits */}
            <SpotlightCard paddingClassName="p-6">
              <div className="flex flex-col justify-between h-full space-y-6">
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="w-10 h-10 rounded-xl bg-amber-500/10 border border-amber-500/30 flex items-center justify-center text-amber-400">
                      <BookOpen className="w-5 h-5" />
                    </div>
                    <span className="text-[10px] font-mono font-bold text-amber-300 bg-amber-500/10 border border-amber-500/25 px-2 py-0.5 rounded-full uppercase">
                      TIER 1 • ₹3,500
                    </span>
                  </div>

                  <div className="space-y-1.5">
                    <h4 className="font-display font-bold text-lg text-white">
                      Science &amp; Library Kits
                    </h4>
                    <p className="text-xs text-neutral-400 font-light font-sans leading-relaxed">
                      Supplies 25 hands-on science experiment kits, STEM curiosity sets, and foundational literature to rural government school students.
                    </p>
                  </div>
                </div>

                <div className="pt-4 border-t border-white/10 flex items-center justify-between">
                  <span className="text-[11px] font-mono text-neutral-400">Equips 1 Class</span>
                  <Link
                    href="/donate/govt-schools"
                    className="text-xs font-mono text-amber-400 hover:text-amber-300 font-bold flex items-center gap-1 group"
                  >
                    <span>Fund Kits</span>
                    <ArrowRight className="w-3 h-3 transform group-hover:translate-x-1 transition-transform" />
                  </Link>
                </div>
              </div>
            </SpotlightCard>

            {/* Card 2: Digital Smart Labs */}
            <SpotlightCard paddingClassName="p-6">
              <div className="flex flex-col justify-between h-full space-y-6">
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="w-10 h-10 rounded-xl bg-cyan-500/10 border border-cyan-500/30 flex items-center justify-center text-cyan-400">
                      <Laptop className="w-5 h-5" />
                    </div>
                    <span className="text-[10px] font-mono font-bold text-cyan-300 bg-cyan-500/10 border border-cyan-500/25 px-2 py-0.5 rounded-full uppercase">
                      TIER 2 • ₹18,000
                    </span>
                  </div>

                  <div className="space-y-1.5">
                    <h4 className="font-display font-bold text-lg text-white">
                      Digital Smart Lab Setup
                    </h4>
                    <p className="text-xs text-neutral-400 font-light font-sans leading-relaxed">
                      Deploys open-source digital coding stations, multimedia projector setups, and digital literacy tools for underprivileged students.
                    </p>
                  </div>
                </div>

                <div className="pt-4 border-t border-white/10 flex items-center justify-between">
                  <span className="text-[11px] font-mono text-neutral-400">Equips 1 Lab Hub</span>
                  <Link
                    href="/donate/govt-schools"
                    className="text-xs font-mono text-cyan-400 hover:text-cyan-300 font-bold flex items-center gap-1 group"
                  >
                    <span>Deploy Lab</span>
                    <ArrowRight className="w-3 h-3 transform group-hover:translate-x-1 transition-transform" />
                  </Link>
                </div>
              </div>
            </SpotlightCard>

            {/* Card 3: School Sanitation & Infrastructure */}
            <SpotlightCard paddingClassName="p-6">
              <div className="flex flex-col justify-between h-full space-y-6">
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="w-10 h-10 rounded-xl bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center text-emerald-400">
                      <Building className="w-5 h-5" />
                    </div>
                    <span className="text-[10px] font-mono font-bold text-emerald-300 bg-emerald-500/10 border border-emerald-500/25 px-2 py-0.5 rounded-full uppercase">
                      TIER 3 • ₹50,000
                    </span>
                  </div>

                  <div className="space-y-1.5">
                    <h4 className="font-display font-bold text-lg text-white">
                      Infrastructure Overhaul
                    </h4>
                    <p className="text-xs text-neutral-400 font-light font-sans leading-relaxed">
                      Complete classroom study desk repairs, roof weather-proofing, clean drinking water filters, and hygienic sanitation facility restoration.
                    </p>
                  </div>
                </div>

                <div className="pt-4 border-t border-white/10 flex items-center justify-between">
                  <span className="text-[11px] font-mono text-neutral-400">Full School Node</span>
                  <Link
                    href="/donate/govt-schools"
                    className="text-xs font-mono text-emerald-400 hover:text-emerald-300 font-bold flex items-center gap-1 group"
                  >
                    <span>Adopt School</span>
                    <ArrowRight className="w-3 h-3 transform group-hover:translate-x-1 transition-transform" />
                  </Link>
                </div>
              </div>
            </SpotlightCard>
          </div>
        </section>

        {/* 8. Principles */}
        <section className="relative z-10 border-t border-white/10 bg-[#020304] py-24 px-6 sm:px-12">
          <div className="max-w-6xl mx-auto space-y-16">
            <AnimatedSection className="text-center space-y-2 max-w-xl mx-auto">
              <span className="font-mono text-[10px] tracking-[0.3em] text-neutral-400 uppercase">
                SOVEREIGN ARCHITECTURE
              </span>
              <h2 className="font-display font-medium text-3xl sm:text-4xl text-white tracking-tight">
                Constitutional Principles
              </h2>
            </AnimatedSection>

            <StaggerChildren className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6" staggerDelay={0.1}>
              {architecturalTenets.map((tenet) => {
                const Icon = tenet.icon;
                return (
                  <StaggerItem key={tenet.title}>
                    <SpotlightCard className="h-full">
                      <div className="flex flex-col justify-between space-y-6 h-full">
                        <div className="w-10 h-10 rounded-xl bg-white/[0.04] border border-white/10 flex items-center justify-center text-white group-hover:border-zen-violet/30 transition-colors duration-300 shadow-sm">
                          <Icon className="w-5 h-5" />
                        </div>
                        <div className="space-y-2">
                          <h4 className="font-display font-medium text-base text-white">
                            {tenet.title}
                          </h4>
                          <p className="text-xs text-neutral-400 leading-relaxed font-light">
                            {tenet.detail}
                          </p>
                        </div>
                      </div>
                    </SpotlightCard>
                  </StaggerItem>
                );
              })}
            </StaggerChildren>
          </div>
        </section>

        {/* 9. High-Fi Detailed Sovereign Footer */}
        <Footer />
      </div>
    </div>
  );
}
