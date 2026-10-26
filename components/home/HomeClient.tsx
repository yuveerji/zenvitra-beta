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
  ArrowUpRight,
  Flame,
  Stethoscope,
  AlertTriangle,
  Gavel,
  Award
} from 'lucide-react';
import MonolithCard from '@/components/home/MonolithCard';
import LiveTelemetryBanner from '@/components/home/LiveTelemetryBanner';
import SocialHoverMenu from '@/components/home/SocialHoverMenu';
import { InteractiveWordModal } from '@/components/home/InteractiveWordModal';
import { InteractiveWordHover, InteractiveWordGroup } from '@/components/home/InteractiveWordHover';
import { EcosystemMindMapModal } from '@/components/home/EcosystemMindMapModal';
import { ListConferenceModal } from '@/components/events/ListConferenceModal';
import { CreateEventModal } from '@/components/events/CreateEventModal';
import { FeaturedEvents } from '@/components/home/FeaturedEvents';
import { SpotlightCard } from '@/components/ui/SpotlightCard';
import { AnimatedSection, StaggerChildren, StaggerItem } from '@/components/ui/AnimatedSection';
import { AnimatedCounter } from '@/components/ui/AnimatedCounter';
import { AuroraBackground } from '@/components/ui/AuroraBackground';
import { Navbar } from '@/components/layout/Navbar';
import { Footer } from '@/components/layout/Footer';
import { useAuth } from '@/context/AuthContext';
import { motion } from 'framer-motion';
import { getFounderDirective, FounderDirective, useProtocolControls } from '@/lib/founderControl';
import { FounderNoteRenderer } from '@/components/pulse/FounderNoteRenderer';
import { DiplomaticGlobe } from '@/components/visuals/DiplomaticGlobe';
import { ConstellationCanvas } from '@/components/visuals/ConstellationCanvas';
import { ZenSpatialCard } from '@/components/experience/ZenSpatialCard';

interface HomeClientProps {
  session: any;
}

export default function HomeClient({ session }: HomeClientProps) {
  const { profile, isAuthenticated, isMockMode } = useAuth();
  const [hasSavedSession, setHasSavedSession] = useState(false);
  const { escrowMandateActive } = useProtocolControls();
  const [isListConferenceOpen, setIsListConferenceOpen] = useState(false);
  const [isEventSetupOpen, setIsEventSetupOpen] = useState(false);

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

  const [founderDirective, setFounderDirective] = useState<FounderDirective>(() => getFounderDirective());

  useEffect(() => {
    const handleUpdate = (e: any) => {
      if (e?.detail) {
        setFounderDirective(e.detail);
      } else {
        setFounderDirective(getFounderDirective());
      }
    };
    window.addEventListener('zenvitra_founder_update', handleUpdate);
    window.addEventListener('storage', handleUpdate);
    return () => {
      window.removeEventListener('zenvitra_founder_update', handleUpdate);
      window.removeEventListener('storage', handleUpdate);
    };
  }, []);

  const isUserLoggedIn = Boolean(profile || session?.user || isAuthenticated || isMockMode || hasSavedSession);
  const platformTargetHref = isUserLoggedIn ? '/pulse' : '/login?redirect=/pulse';

  const getProtocolTargetHref = (href: string) => {
    if (
      href.startsWith('/pulse') ||
      href.startsWith('/press') ||
      href.startsWith('/events') ||
      href.startsWith('/host') ||
      href.startsWith('/committee') ||
      href.startsWith('/mun') ||
      href.startsWith('/chat') ||
      href.startsWith('/docs') ||
      href.startsWith('/solutions')
    ) {
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
      desc: 'Creating tangible change through youth-led dialogue, civic innovation, and a guaranteed 10% of profits allocated every 6 months to student scholarships and rural school labs.',
    },
  ];

  const buildingCards = [
    { title: 'Community', desc: 'Connect with thinkers, creators, and ambitious minds worldwide.', icon: User },
    { title: 'Open Forum', desc: 'Write. Speak. Debate. Decide. Drive real change.', icon: MessageSquare },
    { title: 'Events & Summits', desc: 'Assemblies, conferences, summits, and open gatherings.', icon: Calendar },
    { title: 'Leadership', desc: 'Develop skills. Lead initiatives. Inspire others.', icon: Crown },
    { title: 'Innovation', desc: 'Turn ideas into actionable projects and public solutions.', icon: Lightbulb },
    { title: 'Social Good', desc: '10% of all profits directly fund student education & civic kits every 6 months.', icon: Heart },
  ];

  const sovereignWorlds = [
    {
      title: 'ZEN.PULSE',
      subtitle: 'The Living World & Social Nerve',
      worldNumber: 'WORLD 01',
      category: 'LIVING SOCIAL CANVAS',
      description: 'Zero-ad chronological discourse, real-time pulse map, vertical FLUX media reels, and decentralized spark dispatches.',
      icon: Radio,
      badge: 'LIVE FREQUENCY',
      accentColor: 'text-rose-400 bg-rose-500/10 border-rose-500/30 shadow-[0_0_20px_rgba(244,63,94,0.15)]',
      glowColor: 'rgba(244, 63, 94, 0.2)',
      tagColor: 'text-rose-300/80 bg-rose-500/10 border-rose-500/20',
      actionText: 'Enter Pulse World',
      href: '/pulse',
      tags: ['Pulse Map', 'FLUX Reels', 'Zero Algorithms', 'Direct Comms'],
    },
    {
      title: 'ZEN.HOST',
      subtitle: 'The Deliberation Sanctuary',
      worldNumber: 'WORLD 02',
      category: 'PARLIAMENTARY ORDER',
      description: 'Procedural rules of order, live General Speakers List clock, unmoderated caucus collaboration, and auditable roll calls.',
      icon: Gavel,
      badge: 'QUORUM READY',
      accentColor: 'text-amber-400 bg-amber-500/10 border-amber-500/30 shadow-[0_0_20px_rgba(245,158,11,0.15)]',
      glowColor: 'rgba(245, 158, 11, 0.2)',
      tagColor: 'text-amber-300/80 bg-amber-500/10 border-amber-500/20',
      actionText: 'Enter Chamber',
      href: '/host',
      tags: ['GSL Timers', 'Motion Queue', 'Caucus Engine', 'Roll Calls'],
    },
    {
      title: 'ZEN.MUN',
      subtitle: 'Global Model UN Arena',
      worldNumber: 'WORLD 03',
      category: 'MULTILATERAL DIPLOMACY',
      description: 'Conference command center, dynamic country portfolio matrices, live delegate performance radar, and resolution voting.',
      icon: Crown,
      badge: 'GENERAL ASSEMBLY',
      accentColor: 'text-cyan-400 bg-cyan-500/10 border-cyan-500/30 shadow-[0_0_20px_rgba(6,182,212,0.15)]',
      glowColor: 'rgba(6, 182, 212, 0.2)',
      tagColor: 'text-cyan-300/80 bg-cyan-500/10 border-cyan-500/20',
      actionText: 'Enter MUN Arena',
      href: '/mun',
      tags: ['Performance Radar', 'Country Matrix', 'Resolution Dais', 'Crisis Flow'],
    },
  ];

  const platformEngines = [
    {
      title: 'ZEN.CHAT',
      subtitle: 'Diplomatic Comms & Channels',
      description: 'Real-time encrypted messaging, bilateral caucus sidebars, and rapid committee correspondence.',
      icon: MessageSquare,
      badge: 'COMMS',
      accentColor: 'text-emerald-400 bg-emerald-500/10 border-emerald-500/25',
      badgeColor: 'text-emerald-300 border-emerald-500/30 bg-emerald-500/10',
      arrowColor: 'group-hover:text-emerald-300',
      href: '/chat',
    },
    {
      title: 'ZEN.EVENTS',
      subtitle: 'Assembly & Summit Registry',
      description: 'Digital conference passes, country matrix allocation, QR check-in terminal, and live schedules.',
      icon: Calendar,
      badge: 'SUMMITS',
      accentColor: 'text-blue-400 bg-blue-500/10 border-blue-500/25',
      badgeColor: 'text-blue-300 border-blue-500/30 bg-blue-500/10',
      arrowColor: 'group-hover:text-blue-300',
      href: '/events',
    },
    {
      title: 'ZEN.PRESS',
      subtitle: 'Independent Youth Newsroom',
      description: 'Open journalism wire publishing investigative reports, photojournalism, and verified editorial dossiers.',
      icon: Newspaper,
      badge: 'MEDIA WIRE',
      accentColor: 'text-purple-400 bg-purple-500/10 border-purple-500/25',
      badgeColor: 'text-purple-300 border-purple-500/30 bg-purple-500/10',
      arrowColor: 'group-hover:text-purple-300',
      href: '/press',
    },
    {
      title: 'ZEN.DOCS',
      subtitle: 'Diplomatic Treaty Studio',
      description: 'Collaborative resolution drafting studio with UN operative clause templates, bilateral treaty stamps, and dais export.',
      icon: FileText,
      badge: 'DRAFTING',
      accentColor: 'text-indigo-400 bg-indigo-500/10 border-indigo-500/25',
      badgeColor: 'text-indigo-300 border-indigo-500/30 bg-indigo-500/10',
      arrowColor: 'group-hover:text-indigo-300',
      href: '/docs',
    },
    {
      title: 'ZEN.SOLUTIONS',
      subtitle: 'Open Policy & Whitepaper Vault',
      description: 'Collaborative policy chamber where youth and researchers co-author actionable policy drafts, tabling resolutions, and community solutions.',
      icon: Lightbulb,
      badge: 'POLICY ENGINE',
      accentColor: 'text-cyan-400 bg-cyan-500/10 border-cyan-500/25',
      badgeColor: 'text-cyan-300 border-cyan-500/30 bg-cyan-500/10',
      arrowColor: 'group-hover:text-cyan-300',
      href: '/solutions',
    },
    ...(escrowMandateActive ? [{
      title: 'ZEN.IMPACT',
      subtitle: '10% Profit Escrow & Ledger',
      description: 'Hardcoded constitutional treasury allocating 10% of all profits every 6 months with public video proof.',
      icon: Heart,
      badge: '10% ESCROW',
      accentColor: 'text-teal-400 bg-teal-500/10 border-teal-500/25',
      badgeColor: 'text-teal-300 border-teal-500/30 bg-teal-500/10',
      arrowColor: 'group-hover:text-teal-300',
      href: '/impact',
    }] : [{
      title: 'ZEN.IMPACT',
      subtitle: 'Civic Grants & Ledger',
      description: 'Transparent community treasury empowering youth initiatives and educational modernizations.',
      icon: Heart,
      badge: 'CIVIC IMPACT',
      accentColor: 'text-teal-400 bg-teal-500/10 border-teal-500/25',
      badgeColor: 'text-teal-300 border-teal-500/30 bg-teal-500/10',
      arrowColor: 'group-hover:text-teal-300',
      href: '/impact',
    }]),
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
    ...(escrowMandateActive ? [{
      icon: Lock,
      title: 'Guaranteed 10% Profit Impact Invariant',
      detail: 'Hardcoded constitutional mandate distributing 10% of profits every 6 months with video proof.',
    }] : []),
  ];

  const milestones = [
    { metric: '100%', label: 'Sovereign Codebase' },
    ...(escrowMandateActive ? [{ metric: '10%', label: 'Profits to Youth Grants' }] : []),
    { metric: '0', label: 'Algorithmic Feeds' },
    { metric: '0', label: 'Data Brokers / Trackers' },
  ];

  /* Word-by-word hero animation */
  const heroWords = ['Meaningful', 'Change', 'Starts', 'With'];

  // 4. Portal Flash Dissolve from Countdown sequence
  const [showFlashDissolve, setShowFlashDissolve] = useState(false);
  const [flashOpacity, setFlashOpacity] = useState(1);

  useEffect(() => {
    if (typeof window === 'undefined') return;
    try {
      const fromFlash = sessionStorage.getItem('from_portal_flash');
      if (fromFlash === 'true') {
        sessionStorage.removeItem('from_portal_flash');
        document.cookie = 'from_portal_flash=; path=/; max-age=0';
        setShowFlashDissolve(true);
        // Start fading from 1 to 0 over 800ms
        const timer = setTimeout(() => {
          setFlashOpacity(0);
        }, 50);
        const cleanup = setTimeout(() => {
          setShowFlashDissolve(false);
        }, 850);
        return () => {
          clearTimeout(timer);
          clearTimeout(cleanup);
        };
      }
    } catch {}
  }, []);

  return (
    <div className="min-h-screen bg-[#030405] text-white overflow-x-hidden font-sans relative">
      {/* Portal Flash Dissolve Overlay */}
      {showFlashDissolve && (
        <div 
          className="fixed inset-0 z-[9999] bg-white pointer-events-none transition-opacity duration-800 ease-out"
          style={{ opacity: flashOpacity }}
        />
      )}

      {/* Ambient Aurora Background */}
      <AuroraBackground />

      {/* Interactive Constellation Network Canvas */}
      <ConstellationCanvas enableMouseInteraction={true} />

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
                <span>OFFICIAL NETWORK FOR YOUTH CIVIC LEADERSHIP</span>
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
                  <InteractiveWordHover termKey="youth" side="bottom" align="left">
                    <span className="text-white font-medium underline decoration-amber-400/70 decoration-2 underline-offset-4 hover:decoration-amber-300 hover:text-amber-200 transition cursor-pointer">
                      Youth
                    </span>
                  </InteractiveWordHover>{' '}
                  —{' '}
                  <InteractiveWordHover termKey="leaders" side="bottom" align="left">
                    <span className="text-white font-medium underline decoration-amber-400/70 decoration-2 underline-offset-4 hover:decoration-amber-300 hover:text-amber-200 transition cursor-pointer">
                      thinkers
                    </span>
                  </InteractiveWordHover>
                  ,{' '}
                  <InteractiveWordHover termKey="creators" side="bottom" align="left">
                    <span className="text-white font-medium underline decoration-cyan-400/70 decoration-2 underline-offset-4 hover:decoration-cyan-300 hover:text-cyan-200 transition cursor-pointer">
                      writers
                    </span>
                  </InteractiveWordHover>{' '}
                  &amp;{' '}
                  <InteractiveWordHover termKey="innovators" side="bottom" align="left">
                    <span className="text-white font-medium underline decoration-emerald-400/70 decoration-2 underline-offset-4 hover:decoration-emerald-300 hover:text-emerald-200 transition cursor-pointer">
                      creators
                    </span>
                  </InteractiveWordHover>{' '}
                  with{' '}
                  <InteractiveWordHover termKey="sources-and-senses" side="bottom" align="left">
                    <span className="text-white font-medium underline decoration-cyan-400/70 decoration-2 underline-offset-4 hover:decoration-cyan-300 hover:text-cyan-200 transition cursor-pointer">
                      senses and sources
                    </span>
                  </InteractiveWordHover>{' '}
                  to write, speak, connect, and drive{' '}
                  <InteractiveWordHover termKey="escrow" side="bottom" align="left">
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

                {/* 4. Event Setup Studio CTA */}
                <button
                  type="button"
                  onClick={() => setIsEventSetupOpen(true)}
                  className="px-6 sm:px-7 py-3.5 sm:py-4 rounded-full border border-cyan-400/40 bg-gradient-to-r from-cyan-500/10 to-blue-500/10 text-cyan-300 hover:bg-cyan-500/20 hover:border-cyan-400/70 transition-all duration-300 flex items-center gap-2 backdrop-blur-md btn-glow shadow-[0_0_25px_rgba(6,182,212,0.18)] cursor-pointer text-xs font-bold hover:scale-[1.02] active:scale-[0.98]"
                >
                  <Calendar className="w-3.5 h-3.5 text-cyan-400" />
                  <span>Event Setup</span>
                </button>
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
        {founderDirective.isActive && (
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
                          alt="Founder & System Architect"
                          fill
                          className="object-cover"
                        />
                      </div>
                      <div>
                        <span className="font-mono text-[10px] tracking-[0.25em] text-cyan-400 uppercase font-semibold block">
                          {founderDirective.tag || 'FOUNDER\'S DIRECTIVE'} &bull; {founderDirective.priority}
                        </span>
                        <h3 className="font-display font-medium text-base text-white">
                          {founderDirective.title || 'A Note from the Founder'}
                        </h3>
                      </div>
                    </div>

                    <span className="px-3 py-1 rounded-full bg-cyan-500/10 border border-cyan-500/30 text-cyan-300 font-mono text-[10px] tracking-wider uppercase">
                      VERIFIED DIRECTIVE
                    </span>
                  </div>

                  {/* Body Content */}
                  <div className="space-y-4 text-sm sm:text-base text-neutral-300 font-outfit leading-relaxed">
                    <div className="p-4 sm:p-5 rounded-2xl bg-white/[0.02] border border-white/[0.08] text-neutral-200">
                      <FounderNoteRenderer
                        body={founderDirective.body}
                        defaultExpanded={true}
                        collapsible={true}
                        hideDuplicateTitle={true}
                        cardTitle={founderDirective.title || 'A Note from the Founder'}
                      />
                    </div>

                    {escrowMandateActive && (
                      <div className="p-4 sm:p-5 rounded-2xl bg-cyan-950/20 border border-cyan-500/20 text-neutral-300 font-mono text-xs sm:text-sm leading-relaxed space-y-1.5">
                        <span className="text-cyan-300 font-bold text-xs uppercase tracking-wider block">
                          &bull; Our Constitutional Pledge:
                        </span>
                        <p className="text-neutral-400">
                          Words mean little without structural action. That is why <strong className="text-white">10% of all net platform profits</strong> are constitutionally dedicated <strong className="text-amber-300">every 6 months</strong> to direct student scholarships, classroom kits, and computer labs—proven through offline giveaway videos and public receipts broadcast on <strong className="text-cyan-300">ZEN.FLUX</strong> and social platforms.
                        </p>
                      </div>
                    )}
                  </div>

                  {/* Footer Signature & Actions */}
                  <div className="pt-5 border-t border-white/[0.06] flex flex-col sm:flex-row sm:items-center justify-between gap-5">
                    <div className="space-y-0.5">
                      <h4 className="font-display font-medium text-base text-white">
                        {founderDirective.author || 'Yuveer Chhatwani'}
                      </h4>
                      <p className="font-mono text-xs text-neutral-400">
                        Founder, ZENVITRA &bull; <span className="text-neutral-300">@founder</span>
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
        )}

        {/* 5. "WHY ZENVITRA?" */}
        <section className="max-w-6xl mx-auto px-6 sm:px-12 py-20 space-y-12 text-center">
          <AnimatedSection>
            <div className="space-y-3">
              <span className="font-mono text-[10px] tracking-[0.3em] text-neutral-400 uppercase">
                WHY ZENVITRA?
              </span>
              <h2 className="font-display font-medium text-3xl sm:text-5xl text-white tracking-tight leading-snug max-w-2xl mx-auto">
                We&apos;re building more than a platform.{' '}
                <span className="font-serif italic font-normal text-cyan-200">We&apos;re building a movement.</span>
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
                <p className="text-white font-serif italic font-normal text-lg sm:text-xl leading-relaxed">
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

        {/* 5.6 LIST YOUR CONFERENCE OR EVENT — 3RD PLACE SPOTLIGHT ABOVE ECOSYSTEM */}
        <section className="relative z-10 max-w-6xl mx-auto px-6 sm:px-12 py-20 space-y-10 text-left">
          <AnimatedSection>
            <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-6 pb-6 border-b border-white/10">
              <div className="space-y-2">
                <span className="font-mono text-[10px] tracking-[0.3em] text-cyan-300 uppercase font-bold flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-cyan-400 animate-pulse" />
                  EVENT SETUP &amp; HOSTING STUDIO &bull; OPEN TO EVERYONE
                </span>
                <h2 className="font-display font-black text-3xl sm:text-5xl text-white tracking-tight uppercase leading-tight">
                  EVENT SETUP STUDIO <span className="font-serif italic font-normal text-cyan-300 text-3xl sm:text-5xl tracking-normal">Or Conference.</span>
                </h2>
              </div>
              <p className="text-xs text-neutral-400 max-w-md font-light leading-relaxed font-sans">
                Host your Model UN, youth parliament, academic summit, or civic conclave on ZENVITRA. Free for all organizers—every event gets verified by our Secretariat so it goes live securely.
              </p>
            </div>
          </AnimatedSection>

          {/* Master Hero Listing Card */}
          <div className="relative rounded-3xl p-8 sm:p-10 bg-[#08090f] border border-white/10 shadow-2xl overflow-hidden">
            <div className="relative z-10 grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
              <div className="lg:col-span-8 space-y-5">
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/5 border border-white/10 text-neutral-300 font-mono text-[11px] font-bold uppercase tracking-wider">
                  <Sparkles className="w-3.5 h-3.5 text-neutral-400" />
                  <span>Modern Event & MUN Setup Engine • Open Access</span>
                </div>

                <h3 className="font-display font-black text-2xl sm:text-4xl text-white tracking-tight leading-tight">
                  Organizing an Event, Summit, or Model UN? <span className="font-serif italic font-normal text-cyan-200">Launch Event Setup in Seconds.</span>
                </h3>

                <p className="text-xs sm:text-sm text-neutral-400 font-sans font-light leading-relaxed max-w-2xl">
                  Anyone can submit an event or MUN. You get automated Cashfree pass checkout, real-time country matrix allocations, verifiable anti-fraud QR gate passes, and virtual dais chambers. Once verified by our Core Team, your conference goes live globally.
                </p>

                <div className="flex flex-wrap gap-4 pt-1">
                  <div className="flex items-center gap-2 text-xs font-mono text-neutral-400">
                    <CheckCircle2 className="w-4 h-4 text-white shrink-0" />
                    <span>Open to Every School, College &amp; Club</span>
                  </div>
                  <div className="flex items-center gap-2 text-xs font-mono text-neutral-400">
                    <CheckCircle2 className="w-4 h-4 text-white shrink-0" />
                    <span>Fast Core Secretariat Verification</span>
                  </div>
                  <div className="flex items-center gap-2 text-xs font-mono text-neutral-400">
                    <CheckCircle2 className="w-4 h-4 text-white shrink-0" />
                    <span>Anti-Counterfeit QR Tickets</span>
                  </div>
                </div>
              </div>

              {/* Direct CTA Box */}
              <div className="lg:col-span-4 flex flex-col gap-3 justify-center bg-white/[0.03] backdrop-blur-xl p-6 sm:p-7 rounded-2xl border border-white/10 text-center">
                <span className="text-[10px] font-mono text-neutral-400 uppercase tracking-widest font-bold">
                  100% Free Hosting for Free Events
                </span>
                <div className="text-xl sm:text-2xl font-display font-bold text-white">
                  Event Setup Studio
                </div>
                <p className="text-[11px] text-neutral-400 font-mono leading-tight">
                  Reach delegates, sell passes, and run smooth on-ground check-ins.
                </p>
                <div className="pt-2 space-y-2">
                  <button
                    type="button"
                    onClick={() => setIsEventSetupOpen(true)}
                    className="w-full py-3.5 px-5 rounded-xl bg-white hover:bg-neutral-200 text-black font-mono text-xs font-extrabold uppercase tracking-wider transition flex items-center justify-center gap-2 cursor-pointer shadow-md active:scale-95"
                  >
                    <Sparkles className="w-4 h-4 fill-black" />
                    <span>Launch Event Setup Now</span>
                    <ArrowRight className="w-4 h-4" />
                  </button>

                  <Link
                    href="/events"
                    className="w-full py-2.5 px-4 rounded-xl bg-white/5 hover:bg-white/10 text-neutral-300 hover:text-white font-mono text-xs font-semibold transition flex items-center justify-center gap-1.5 border border-white/10"
                  >
                    <span>Explore Live Assemblies</span>
                    <ArrowUpRight className="w-3.5 h-3.5" />
                  </Link>
                </div>
              </div>
            </div>
          </div>

          {/* 3 Pillars of ZENVITRA Event Infrastructure */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Card 1: Country Matrix & Portfolios */}
            <SpotlightCard paddingClassName="p-6">
              <div className="flex flex-col justify-between h-full space-y-6">
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="w-10 h-10 rounded-xl bg-cyan-500/10 border border-cyan-500/30 flex items-center justify-center text-cyan-400">
                      <Layers className="w-5 h-5" />
                    </div>
                    <span className="text-[10px] font-mono font-bold text-cyan-300 bg-cyan-500/10 border border-cyan-500/25 px-2 py-0.5 rounded-full uppercase">
                      ALLOTMENT ENGINE
                    </span>
                  </div>

                  <div className="space-y-1.5">
                    <h4 className="font-display font-bold text-lg text-white">
                      Country Matrix &amp; Portfolios
                    </h4>
                    <p className="text-xs text-neutral-400 font-light font-sans leading-relaxed">
                      Instant interactive country matrix with dynamic portfolio allocations, committee quotas, and delegate dossier tracking.
                    </p>
                  </div>
                </div>

                <div className="pt-4 border-t border-white/10 flex items-center justify-between">
                  <span className="text-[11px] font-mono text-neutral-400">Automated Allotments</span>
                  <button
                    type="button"
                    onClick={() => setIsEventSetupOpen(true)}
                    className="text-xs font-mono text-cyan-400 hover:text-cyan-300 font-bold flex items-center gap-1 group cursor-pointer"
                  >
                    <span>Setup MUN / Summit</span>
                    <ArrowRight className="w-3 h-3 transform group-hover:translate-x-1 transition-transform" />
                  </button>
                </div>
              </div>
            </SpotlightCard>

            {/* Card 2: Zero-Counterfeit QR Scanner */}
            <SpotlightCard paddingClassName="p-6">
              <div className="flex flex-col justify-between h-full space-y-6">
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="w-10 h-10 rounded-xl bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center text-emerald-400">
                      <ShieldCheck className="w-5 h-5" />
                    </div>
                    <span className="text-[10px] font-mono font-bold text-emerald-300 bg-emerald-500/10 border border-emerald-500/25 px-2 py-0.5 rounded-full uppercase">
                      DOOR ENTRY OS
                    </span>
                  </div>

                  <div className="space-y-1.5">
                    <h4 className="font-display font-bold text-lg text-white">
                      Anti-Fraud Gate Scanner
                    </h4>
                    <p className="text-xs text-neutral-400 font-light font-sans leading-relaxed">
                      Cryptographically signed QR gate passes. Armed on-ground scanners automatically open when event timings begin with audio chimes.
                    </p>
                  </div>
                </div>

                <div className="pt-4 border-t border-white/10 flex items-center justify-between">
                  <span className="text-[11px] font-mono text-neutral-400">Real-Time Turnout</span>
                  <button
                    type="button"
                    onClick={() => setIsEventSetupOpen(true)}
                    className="text-xs font-mono text-emerald-400 hover:text-emerald-300 font-bold flex items-center gap-1 group cursor-pointer"
                  >
                    <span>Setup Gate Entry</span>
                    <ArrowRight className="w-3 h-3 transform group-hover:translate-x-1 transition-transform" />
                  </button>
                </div>
              </div>
            </SpotlightCard>

            {/* Card 3: Cashfree Pass Escrow & GST */}
            <SpotlightCard paddingClassName="p-6">
              <div className="flex flex-col justify-between h-full space-y-6">
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="w-10 h-10 rounded-xl bg-amber-500/10 border border-amber-500/30 flex items-center justify-center text-amber-400">
                      <Coins className="w-5 h-5" />
                    </div>
                    <span className="text-[10px] font-mono font-bold text-amber-300 bg-amber-500/10 border border-amber-500/25 px-2 py-0.5 rounded-full uppercase">
                      FINANCE &amp; GST
                    </span>
                  </div>

                  <div className="space-y-1.5">
                    <h4 className="font-display font-bold text-lg text-white">
                      Cashfree Passes &amp; 0% Student GST
                    </h4>
                    <p className="text-xs text-neutral-400 font-light font-sans leading-relaxed">
                      Direct UPI, card, and netbanking pass checkout with automated age-aware GST exemption (0% GST for students &le;18) and organizer payouts.
                    </p>
                  </div>
                </div>

                <div className="pt-4 border-t border-white/10 flex items-center justify-between">
                  <span className="text-[11px] font-mono text-neutral-400">Direct Payouts</span>
                  <button
                    type="button"
                    onClick={() => setIsEventSetupOpen(true)}
                    className="text-xs font-mono text-amber-400 hover:text-amber-300 font-bold flex items-center gap-1 group cursor-pointer"
                  >
                    <span>Setup Event Passes</span>
                    <ArrowRight className="w-3 h-3 transform group-hover:translate-x-1 transition-transform" />
                  </button>
                </div>
              </div>
            </SpotlightCard>
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
                An ecosystem. <span className="font-serif italic font-normal text-cyan-200">Endless possibilities.</span>
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


        {/* 7. The Sovereign Universe Matrix: Three Worlds & Platform Ecosystem */}
        <section className="relative z-10 max-w-6xl mx-auto px-6 sm:px-12 py-24 space-y-16">
          <AnimatedSection>
            <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-6 pb-6 border-b border-white/10">
              <div className="space-y-2 text-left">
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/[0.04] border border-white/10">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse shadow-[0_0_8px_#34d399]" />
                  <span className="font-mono text-[10px] tracking-[0.25em] text-neutral-400 uppercase">
                    ZENVITRA ARCHITECTURAL TOPOLOGY
                  </span>
                </div>
                <h2 className="font-display font-medium text-3xl sm:text-4xl text-white tracking-tight">
                  One Universe. <span className="font-serif italic font-normal text-cyan-200">Three Dedicated Arenas.</span>
                </h2>
              </div>
              <p className="font-mono text-xs text-neutral-400 max-w-md text-left lg:text-right leading-relaxed">
                One coherent visual universe branching into three immersive spatial experiences, anchored by a sovereign platform foundation.
              </p>
            </div>
          </AnimatedSection>

          {/* Tier 1: The Three Flagship Worlds */}
          <div className="space-y-6">
            <div className="flex items-center gap-3">
              <span className="font-mono text-[11px] tracking-[0.2em] text-neutral-400 uppercase font-semibold">
                THE EXPERIENCES // FLAGSHIP SPATIAL WORLDS
              </span>
              <div className="h-px flex-1 bg-gradient-to-r from-white/15 via-white/5 to-transparent" />
            </div>

            <StaggerChildren className="grid grid-cols-1 md:grid-cols-3 gap-6 text-left" staggerDelay={0.12}>
              {sovereignWorlds.map((world) => {
                const Icon = world.icon;
                return (
                  <StaggerItem key={world.title}>
                    <Link href={getProtocolTargetHref(world.href)} className="block group h-full">
                      <ZenSpatialCard
                        glowColor={world.glowColor}
                        className="h-full transform transition duration-300 group-hover:-translate-y-1"
                      >
                        <div className="p-6 sm:p-7 flex flex-col justify-between h-full space-y-6">
                          <div className="space-y-5">
                            {/* Card Top Header */}
                            <div className="flex items-center justify-between">
                              <span className="font-mono text-[10px] tracking-widest text-neutral-400 uppercase font-semibold">
                                {world.worldNumber}
                              </span>
                              <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full border border-white/10 bg-white/[0.03] text-[9px] font-mono tracking-wider text-neutral-300 uppercase">
                                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                                {world.badge}
                              </span>
                            </div>

                            {/* Icon & Title */}
                            <div className="flex items-start gap-4">
                              <div className={`w-12 h-12 rounded-2xl border flex items-center justify-center shrink-0 transition-transform group-hover:scale-105 duration-300 ${world.accentColor}`}>
                                <Icon className="w-5 h-5" />
                              </div>
                              <div className="space-y-1">
                                <h3 className="font-display font-medium text-2xl text-white tracking-tight group-hover:text-white transition-colors">
                                  {world.title}
                                </h3>
                                <p className="text-xs font-mono text-neutral-400">
                                  {world.subtitle}
                                </p>
                              </div>
                            </div>

                            {/* Description */}
                            <p className="text-xs sm:text-sm text-neutral-400 leading-relaxed font-sans font-light">
                              {world.description}
                            </p>

                            {/* Feature Chips */}
                            <div className="flex flex-wrap gap-1.5 pt-2">
                              {world.tags.map((tag) => (
                                <span
                                  key={tag}
                                  className={`font-mono text-[10px] px-2.5 py-1 rounded-lg border ${world.tagColor}`}
                                >
                                  {tag}
                                </span>
                              ))}
                            </div>
                          </div>

                          {/* Action Footer */}
                          <div className="pt-5 border-t border-white/[0.08] flex items-center justify-between font-mono text-xs text-neutral-300 group-hover:text-white transition">
                            <span className="font-medium tracking-wide">{world.actionText}</span>
                            <ArrowRight className="w-4 h-4 transform group-hover:translate-x-2 transition-transform duration-300" />
                          </div>
                        </div>
                      </ZenSpatialCard>
                    </Link>
                  </StaggerItem>
                );
              })}
            </StaggerChildren>
          </div>

          {/* Tier 2: The Supporting Platform Ecosystem */}
          <div className="space-y-6 pt-4">
            <div className="flex items-center gap-3">
              <span className="font-mono text-[11px] tracking-[0.2em] text-neutral-400 uppercase font-semibold">
                THE PLATFORM // INTEGRATED PROTOCOLS
              </span>
              <div className="h-px flex-1 bg-gradient-to-r from-white/15 via-white/5 to-transparent" />
            </div>

            <StaggerChildren className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 text-left" staggerDelay={0.08}>
              {platformEngines.map((engine) => {
                const Icon = engine.icon;
                return (
                  <StaggerItem key={engine.title}>
                    <Link href={getProtocolTargetHref(engine.href)} className="block group h-full">
                      <SpotlightCard className="h-full flex flex-col justify-between p-6 sm:p-7 rounded-2xl border border-white/[0.08] hover:border-white/20 transition-all duration-300">
                        <div className="space-y-5">
                          <div className="flex items-center justify-between">
                            <div className={`w-11 h-11 rounded-xl border flex items-center justify-center transition-transform group-hover:scale-105 duration-300 ${engine.accentColor}`}>
                              <Icon className="w-5 h-5" />
                            </div>
                            <span className={`font-mono text-[9px] tracking-widest px-3 py-1 rounded-full border uppercase transition ${engine.badgeColor}`}>
                              {engine.badge}
                            </span>
                          </div>

                          <div className="space-y-1.5">
                            <h4 className="font-display font-medium text-xl text-white group-hover:text-neutral-100 transition-colors">
                              {engine.title}
                            </h4>
                            <p className="text-xs font-mono text-neutral-400 font-normal">
                              {engine.subtitle}
                            </p>
                          </div>

                          <p className="text-xs sm:text-sm text-neutral-400 leading-relaxed font-light font-sans">
                            {engine.description}
                          </p>
                        </div>

                        <div className={`pt-5 border-t border-white/5 flex items-center justify-between font-mono text-xs text-neutral-400 transition mt-6 ${engine.arrowColor}`}>
                          <span>Launch Protocol</span>
                          <ArrowRight className="w-4 h-4 transform group-hover:translate-x-1.5 transition-transform duration-300" />
                        </div>
                      </SpotlightCard>
                    </Link>
                  </StaggerItem>
                );
              })}
            </StaggerChildren>
          </div>
        </section>

        {/* Interactive Global Diplomatic Network Globe Showcase */}
        <section className="relative z-10 max-w-6xl mx-auto px-6 sm:px-12 py-16">
          <AnimatedSection>
            <DiplomaticGlobe />
          </AnimatedSection>
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
                  DISCUSSIONS THAT <span className="font-serif italic font-normal text-cyan-200 tracking-normal">Don&apos;t Disappear.</span>
                </h2>
              </div>
              <p className="text-xs text-neutral-400 max-w-sm font-light leading-relaxed font-sans">
                Most online conversations disappear within hours. Zenvitra preserves thoughtful youth discussions through public archives, documented participation, and civic dialogue designed to outlast outrage cycles.
              </p>
            </div>
          </AnimatedSection>

          {/* Clean Desktop-Style Discussion Wall Rows */}
          <div className="border-y border-white/10 divide-y divide-white/10">
            {[
              {
                id: 'disc-marvel-doctor-doom-geopolitics',
                category: 'MARVEL & GEOPOLITICS',
                badgeColor: 'text-amber-400 border-amber-400/30 bg-amber-400/10',
                title: 'Doctor Doom, Latverian Sovereignty & Multiverse Incursions: Is authoritarian order justified when global systems fail?',
                status: 'Be The First To Deliberate',
                author: '@yuveer',
                tag: 'Marvel & Theory'
              },
              {
                id: 'disc-standup-free-speech',
                category: 'POLITICS & FREE SPEECH',
                badgeColor: 'text-amber-400 border-amber-400/30 bg-amber-400/10',
                title: 'Samay Raina, Ranveer & Ashish Solanki: Is comedy & podcasting becoming a political crime?',
                status: 'Open Debate',
                author: '@yuveer',
                tag: 'Free Speech'
              },
              {
                id: 'disc-neet-paper-leaks',
                category: 'EDUCATION & INTEGRITY',
                badgeColor: 'text-cyan-400 border-cyan-400/30 bg-cyan-400/10',
                title: 'The NEET-UG Paper Leak Scandal: 2.4 Million students betrayed by systemic corruption.',
                status: 'Academic Justice',
                author: '@yuveer',
                tag: 'Paper Leak'
              },
              {
                id: 'disc-godi-media-collapse',
                category: 'MEDIA & DEMOCRACY',
                badgeColor: 'text-purple-400 border-purple-400/30 bg-purple-400/10',
                title: 'The \'Godi Media\' Surrender: Has Indian prime-time television traded truth for state theatrics?',
                status: 'Fourth Pillar',
                author: '@yuveer',
                tag: 'Press Freedom'
              },
              {
                id: 'disc-algorithmic-surveillance-dpdp',
                category: 'TECHNOLOGY & RIGHTS',
                badgeColor: 'text-emerald-400 border-emerald-400/30 bg-emerald-400/10',
                title: 'Algorithmic Surveillance, Deepfakes & DPDP: Are youth sleepwalking into a digital panopticon?',
                status: 'Digital Privacy',
                author: '@yuveer',
                tag: 'Digital Rights'
              }
            ].map((d) => (
              <Link
                key={d.title}
                href={`/discussions?id=${d.id}`}
                className="group relative grid grid-cols-1 lg:grid-cols-[0.25fr_1fr_auto] gap-4 sm:gap-6 items-center p-6 sm:p-8 transition-all duration-300 hover:bg-white/[0.025]"
              >
                {/* Category badge */}
                <div>
                  <span className={`inline-block font-mono text-[10px] tracking-widest uppercase px-3 py-1 rounded-full border ${d.badgeColor}`}>
                    {d.category}
                  </span>
                </div>

                {/* Title and meta */}
                <div className="space-y-2">
                  <h3 className="font-display font-medium text-lg sm:text-xl text-white group-hover:text-cyan-200 transition-colors leading-snug">
                    {d.title}
                  </h3>
                  <div className="flex flex-wrap items-center gap-2 sm:gap-3 font-mono text-xs text-neutral-400">
                    <span className="text-purple-400 font-semibold flex items-center gap-1">
                      <span className="text-neutral-500 font-normal">By</span>
                      <span className="underline decoration-purple-500/40">{d.author}</span>
                    </span>
                    <span className="text-neutral-600">•</span>
                    <span className="text-emerald-400 font-semibold">{d.status}</span>
                    <span className="text-neutral-600">•</span>
                    <span className="text-neutral-500">{d.tag}</span>
                  </div>
                </div>

                {/* Arrow */}
                <div className="flex items-center justify-end">
                  <div className="w-10 h-10 rounded-2xl bg-white/[0.03] group-hover:bg-white/10 border border-white/10 flex items-center justify-center transition-all duration-300 group-hover:scale-110">
                    <ArrowUpRight className="w-4 h-4 text-neutral-400 group-hover:text-white transition-colors" />
                  </div>
                </div>
              </Link>
            ))}
          </div>

          <div className="flex items-center justify-between pt-2">
            <span className="font-mono text-xs text-neutral-500 uppercase tracking-wider">
              0 Mock Counts • Verified Grassroots Dialogue
            </span>
            <Link
              href="/discussions"
              className="inline-flex items-center gap-2 font-mono text-xs uppercase tracking-wider text-white hover:text-cyan-300 transition-colors"
            >
              <span>Explore All Discussions</span>
              <ArrowUpRight className="w-4 h-4" />
            </Link>
          </div>
        </section>

        {/* 7.6 DOCUMENTATION ARCHIVE */}
        <section className="relative z-10 max-w-6xl mx-auto px-6 sm:px-12 py-20 space-y-12 text-left">
          <AnimatedSection>
            <div className="p-8 sm:p-12 rounded-3xl bg-[#08090f] border border-white/10 shadow-2xl space-y-8">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-white/10">
                <div className="space-y-1">
                  <span className="font-mono text-[10px] uppercase tracking-[0.3em] text-neutral-400 font-bold">
                    Documentation Archive
                  </span>
                  <h3 className="font-display font-black text-2xl sm:text-3xl text-white tracking-tight uppercase">
                    Sovereign archives preserve what transitory words forget.
                  </h3>
                </div>
                <Link
                  href={isUserLoggedIn ? '/solutions' : `/login?redirect=${encodeURIComponent('/solutions')}`}
                  className="px-5 py-2 rounded-full bg-white text-black font-semibold text-xs hover:bg-neutral-200 transition shrink-0"
                >
                  View Full Archive
                </Link>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <Link href={isUserLoggedIn ? '/solutions' : `/login?redirect=${encodeURIComponent('/solutions')}`} className="block">
                  <SpotlightCard paddingClassName="p-5" className="h-full hover:border-purple-400/50 transition">
                    <div className="space-y-2.5">
                      <span className="px-2 py-0.5 rounded-md bg-purple-500/10 border border-purple-500/20 text-purple-300 text-[10px] font-mono font-bold uppercase">
                        DRAFT RESOLUTION
                      </span>
                      <h4 className="font-display font-medium text-sm text-white">Addressing Climate Migration and Urban Displacement</h4>
                      <p className="text-[10px] text-neutral-400 font-mono">Archived 2026 • Geneva Caucus</p>
                    </div>
                  </SpotlightCard>
                </Link>

                <Link href={isUserLoggedIn ? '/solutions' : `/login?redirect=${encodeURIComponent('/solutions')}`} className="block">
                  <SpotlightCard paddingClassName="p-5" className="h-full hover:border-cyan-400/50 transition">
                    <div className="space-y-2.5">
                      <span className="px-2 py-0.5 rounded-md bg-cyan-500/10 border border-cyan-500/20 text-cyan-300 text-[10px] font-mono font-bold uppercase">
                        POLICY DRAFT
                      </span>
                      <h4 className="font-display font-medium text-sm text-white">Framework for Youth Representation in Digital Governance</h4>
                      <p className="text-[10px] text-neutral-400 font-mono">Archived 2026 • Vienna Summit</p>
                    </div>
                  </SpotlightCard>
                </Link>

                <Link href={isUserLoggedIn ? '/solutions' : `/login?redirect=${encodeURIComponent('/solutions')}`} className="block">
                  <SpotlightCard paddingClassName="p-5" className="h-full hover:border-amber-400/50 transition">
                    <div className="space-y-2.5">
                      <span className="px-2 py-0.5 rounded-md bg-amber-500/10 border border-amber-500/20 text-amber-300 text-[10px] font-mono font-bold uppercase">
                        PRESS RELEASE
                      </span>
                      <h4 className="font-display font-medium text-sm text-white">Official Outcomes of the Asia-Pacific Youth Dialogue</h4>
                      <p className="text-[10px] text-neutral-400 font-mono">Archived 2026 • Tokyo Assembly</p>
                    </div>
                  </SpotlightCard>
                </Link>
              </div>

              <p className="text-xs text-neutral-400 font-mono pt-4 border-t border-white/5 text-center sm:text-left">
                Public memory through documentation. Transforming temporary conversations into long-term civic memory.
              </p>
            </div>
          </AnimatedSection>
        </section>



        {/* 8. Principles */}
        <section className="relative z-10 border-t border-white/10 bg-[#020304] py-24 px-6 sm:px-12">
          <div className="max-w-6xl mx-auto space-y-16">
            <AnimatedSection className="text-center space-y-2 max-w-xl mx-auto">
              <span className="font-mono text-[10px] tracking-[0.3em] text-neutral-400 uppercase">
                CORE ARCHITECTURE
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

        {/* Event Setup Studio Modal */}
        <CreateEventModal
          isOpen={isEventSetupOpen}
          onClose={() => setIsEventSetupOpen(false)}
        />

        {/* List Your Conference / Event Modal */}
        <ListConferenceModal
          isOpen={isListConferenceOpen}
          onClose={() => setIsListConferenceOpen(false)}
        />
      </div>
    </div>
  );
}
