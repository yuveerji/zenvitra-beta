'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import {
  Sparkles,
  ArrowRight,
  ArrowLeft,
  Compass,
  MessageSquare,
  Radio,
  Landmark,
  FileText,
  UserCheck,
  CreditCard,
  HeartHandshake,
  Scale,
  Calendar,
  Layers,
  Users,
  Target,
  Globe2,
  CheckCircle2,
  ChevronRight,
  BookOpen,
  Share2,
  Bookmark,
  Gavel,
} from 'lucide-react';
import { Navbar } from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';

const CHAPTERS = [
  { id: 'vision', number: '01', title: 'The Vision Behind ZENVITRA' },
  { id: 'ecosystem', number: '02', title: 'A Digital Ecosystem' },
  { id: 'foundation', number: '03', title: 'A Youth Foundation' },
  { id: 'debate', number: '04', title: 'The Culture of Debate' },
  { id: 'events', number: '05', title: 'Event & Experience Platform' },
  { id: 'social-impact', number: '06', title: 'Social Impact (50% Charity)' },
  { id: 'different', number: '07', title: 'What Makes ZENVITRA Different?' },
  { id: 'who-is-it-for', number: '08', title: 'Who is ZENVITRA For?' },
  { id: 'by-youth-for-youth', number: '09', title: 'Meaning of “By Youth. For Youth.”' },
  { id: 'long-term-vision', number: '10', title: 'The Long-Term Vision' },
  { id: 'one-sentence', number: '11', title: 'ZENVITRA in One Sentence' },
];

export function WhatIsZenvitraClient() {
  const [activeChapter, setActiveChapter] = useState('vision');
  const [scrollProgress, setScrollProgress] = useState(0);
  const [copiedLink, setCopiedLink] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      const totalHeight = document.documentElement.scrollHeight - window.innerHeight;
      if (totalHeight > 0) {
        setScrollProgress((window.scrollY / totalHeight) * 100);
      }

      // Scroll spy for chapters
      for (const chapter of CHAPTERS) {
        const el = document.getElementById(chapter.id);
        if (el) {
          const rect = el.getBoundingClientRect();
          if (rect.top <= 200 && rect.bottom >= 200) {
            setActiveChapter(chapter.id);
            break;
          }
        }
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleShare = async () => {
    if (typeof window !== 'undefined') {
      try {
        await navigator.clipboard.writeText(window.location.href);
        setCopiedLink(true);
        setTimeout(() => setCopiedLink(false), 2000);
      } catch {}
    }
  };

  return (
    <div className="min-h-screen bg-[#08090C] text-[#F8FAFC] selection:bg-[#C5A46D] selection:text-black font-sans relative overflow-x-hidden pt-20 sm:pt-24 antialiased">
      <Navbar />

      {/* Reading Progress Indicator */}
      <div className="fixed top-0 left-0 right-0 h-1 bg-white/5 z-50">
        <div
          className="h-full bg-gradient-to-r from-[#C5A46D] via-[#DFBA73] to-[#C5A46D] transition-all duration-150"
          style={{ width: `${scrollProgress}%` }}
        />
      </div>

      {/* Ambient Atmospheric Glows */}
      <div className="fixed top-20 left-1/2 -translate-x-1/2 w-full max-w-[1000px] h-[550px] bg-gradient-to-b from-[#C5A46D]/10 via-[#0A0D14]/0 to-transparent rounded-full blur-[160px] pointer-events-none -z-10" />
      <div className="fixed bottom-0 right-0 w-[500px] h-[500px] bg-cyan-500/5 rounded-full blur-[180px] pointer-events-none -z-10" />

      {/* ── TOP BREADCRUMB / TOUR ANCHOR ── */}
      <section className="max-w-6xl mx-auto px-6 pt-6 sm:pt-10">
        <div className="flex flex-wrap items-center justify-between gap-4 pb-6 border-b border-white/[0.08]">
          <Link
            href="/onboarding"
            className="inline-flex items-center gap-2 text-xs font-mono uppercase tracking-wider text-neutral-400 hover:text-white transition group"
          >
            <ArrowLeft className="w-3.5 h-3.5 text-[#C5A46D] group-hover:-translate-x-1 transition-transform" />
            <span>Explore ZENVITRA Tour</span>
            <span className="text-white/30">•</span>
            <span className="text-[#C5A46D] font-bold">Chapter II: The Foundation &amp; Charter</span>
          </Link>

          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={handleShare}
              className="px-3 py-1.5 rounded-lg bg-white/[0.04] hover:bg-white/[0.08] border border-white/10 text-xs font-mono text-neutral-300 flex items-center gap-1.5 transition cursor-pointer"
              title="Copy Charter Link"
            >
              <Share2 className="w-3.5 h-3.5 text-[#C5A46D]" />
              <span>{copiedLink ? 'Link Copied!' : 'Share Charter'}</span>
            </button>
            <Link
              href="/dias/tour"
              className="px-3.5 py-1.5 rounded-lg bg-[#C5A46D]/15 hover:bg-[#C5A46D]/25 border border-[#C5A46D]/30 text-xs font-mono font-bold text-[#C5A46D] flex items-center gap-1.5 transition"
            >
              <Compass className="w-3.5 h-3.5" />
              <span>Chamber Tour</span>
            </Link>
          </div>
        </div>
      </section>

      {/* ── HERO BANNER: WHAT IS ZENVITRA? ── */}
      <header className="max-w-6xl mx-auto px-6 py-12 sm:py-16 text-left relative">
        <div className="space-y-6 max-w-4xl">
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-[#C5A46D]/10 border border-[#C5A46D]/30 text-[#C5A46D] text-xs font-mono uppercase tracking-[0.25em] font-bold shadow-[0_0_20px_rgba(197,164,109,0.15)]">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Official Youth Charter &amp; Manifesto</span>
          </div>

          <h1 className="text-4xl sm:text-6xl md:text-7xl font-black font-display tracking-tight text-white uppercase leading-[1.05]">
            WHAT IS <span className="bg-gradient-to-r from-[#DFBA73] via-white to-[#C5A46D] bg-clip-text text-transparent">ZENVITRA?</span>
          </h1>

          <p className="text-lg sm:text-2xl font-serif italic text-[#C5A46D] tracking-wide">
            BY YOUTH. FOR YOUTH.
          </p>

          <p className="text-lg sm:text-xl font-medium text-white/90 leading-relaxed font-sans border-l-2 border-[#C5A46D] pl-5 py-1">
            <strong>ZENVITRA is a youth-led digital platform and foundation built to bring young people together through technology, dialogue, diplomacy, creativity, collaboration, and real-world impact.</strong>
          </p>

          <div className="space-y-4 text-neutral-300 text-sm sm:text-base leading-relaxed font-light pt-2">
            <p>
              But defining ZENVITRA as just another youth platform would be an understatement of what it is intended to become.
            </p>
            <p>
              ZENVITRA is built around a simple idea: young people should not have to wait until they are older, more established, or more influential to participate in meaningful conversations, build communities, express their ideas, develop leadership, organise initiatives, and create change.
            </p>
            <p>
              The youth of today are not merely the leaders of tomorrow. They are individuals with ideas, opinions, ambitions, concerns, talents, and the ability to contribute to the world around them right now. Yet, opportunities to bring all these abilities together are often fragmented across different platforms, organisations, communities, and events.
            </p>
            <p className="text-white font-medium">
              ZENVITRA aims to bridge that gap.
            </p>
            <p>
              It brings together a digital ecosystem, a youth-oriented foundation, community-driven initiatives, events, and collaborative tools under one identity — creating an environment where young people can connect, communicate, debate, organise, create, and turn ideas into action.
            </p>
          </div>
        </div>
      </header>

      {/* ── TWO-COLUMN CHARTER LAYOUT (Sticky TOC + Main Manifesto) ── */}
      <div className="max-w-6xl mx-auto px-6 pb-28 grid grid-cols-1 lg:grid-cols-12 gap-12 text-left relative">
        {/* Sticky Table of Contents (Desktop) */}
        <aside className="hidden lg:block lg:col-span-4 relative">
          <div className="sticky top-28 space-y-4 p-6 rounded-2xl bg-[#0D111A]/90 border border-white/[0.08] backdrop-blur-md shadow-2xl">
            <div className="flex items-center gap-2 pb-3 border-b border-white/[0.08]">
              <BookOpen className="w-4 h-4 text-[#C5A46D]" />
              <span className="text-xs font-mono font-bold uppercase tracking-wider text-white">Charter Index</span>
            </div>

            <nav className="space-y-1.5 max-h-[calc(100vh-220px)] overflow-y-auto pr-1">
              {CHAPTERS.map((ch) => {
                const isActive = activeChapter === ch.id;
                return (
                  <a
                    key={ch.id}
                    href={`#${ch.id}`}
                    className={`group flex items-center justify-between px-3 py-2 rounded-xl text-xs font-medium transition cursor-pointer ${
                      isActive
                        ? 'bg-[#C5A46D]/15 text-[#C5A46D] font-bold border border-[#C5A46D]/30'
                        : 'text-neutral-400 hover:text-white hover:bg-white/[0.03]'
                    }`}
                  >
                    <span className="truncate pr-2">{ch.title}</span>
                    <span className={`font-mono text-[10px] ${isActive ? 'text-[#C5A46D]' : 'text-neutral-500'}`}>
                      {ch.number}
                    </span>
                  </a>
                );
              })}
            </nav>

            <div className="pt-3 border-t border-white/[0.08] flex items-center justify-between text-[11px] font-mono text-neutral-400">
              <span>Read Time: ~7 mins</span>
              <span className="text-[#C5A46D]">11 Chapters</span>
            </div>
          </div>
        </aside>

        {/* Main Editorial Articles */}
        <main className="lg:col-span-8 space-y-16">
          {/* 1. THE VISION BEHIND ZENVITRA */}
          <section id="vision" className="space-y-5 pt-4 scroll-mt-28">
            <div className="flex items-center gap-3">
              <span className="font-mono text-xs font-black text-[#C5A46D] px-2 py-0.5 rounded-md bg-[#C5A46D]/10 border border-[#C5A46D]/20">
                01
              </span>
              <h2 className="text-2xl sm:text-3xl font-black font-display uppercase tracking-tight text-white">
                THE VISION BEHIND ZENVITRA
              </h2>
            </div>

            <div className="space-y-4 text-neutral-300 text-sm sm:text-base leading-relaxed font-light">
              <p className="text-white font-medium text-base">
                At its core, ZENVITRA is about participation.
              </p>
              <p>
                It is about creating a space where a young person with an idea can find a community, where someone interested in public policy can engage in meaningful debate, where an aspiring organiser can learn to coordinate initiatives, where creators can express themselves, and where individuals from different backgrounds can collaborate beyond the limitations of their immediate surroundings.
              </p>
              <p>
                The vision is not restricted to academic achievement, competitive examinations, or conventional extracurricular activities. ZENVITRA is designed around the broader experiences of youth — their interests, perspectives, ambitions, creativity, social lives, and desire to contribute to something larger than themselves.
              </p>
              <p className="p-4 rounded-xl bg-white/[0.02] border-l-2 border-[#C5A46D] text-white/95">
                It seeks to create a culture in which <strong>participation matters more than prestige</strong>, ideas matter more than appearances, and collaboration creates opportunities that individuals might struggle to build alone.
              </p>
              <p>
                The ultimate ambition is to develop an interconnected youth ecosystem where digital participation can lead to real relationships, where discussions can develop into initiatives, where events can become starting points for long-term collaboration, and where young people can move from being passive consumers of opportunities to active creators of them.
              </p>
            </div>
          </section>

          {/* 2. ZENVITRA AS A DIGITAL ECOSYSTEM */}
          <section id="ecosystem" className="space-y-6 scroll-mt-28">
            <div className="flex items-center gap-3">
              <span className="font-mono text-xs font-black text-[#C5A46D] px-2 py-0.5 rounded-md bg-[#C5A46D]/10 border border-[#C5A46D]/20">
                02
              </span>
              <h2 className="text-2xl sm:text-3xl font-black font-display uppercase tracking-tight text-white">
                ZENVITRA AS A DIGITAL ECOSYSTEM
              </h2>
            </div>

            <p className="text-neutral-300 text-sm sm:text-base leading-relaxed font-light">
              ZENVITRA is not intended to be limited to a conventional website that publishes announcements or collects registrations. Its digital platform is being developed as an interconnected environment for communication, expression, collaboration, participation, and organisation.
            </p>
            <p className="text-neutral-300 text-sm sm:text-base leading-relaxed font-light">
              The idea is to bring different aspects of youth engagement into a unified experience rather than requiring users to depend on disconnected tools for every activity.
            </p>

            {/* Ecosystem Modules Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
              {/* ZEN.CHAT */}
              <div className="p-5 rounded-2xl bg-[#0D111A]/80 border border-white/[0.08] hover:border-[#C5A46D]/40 transition space-y-2.5">
                <div className="flex items-center gap-2.5">
                  <div className="w-8 h-8 rounded-lg bg-cyan-500/10 border border-cyan-500/20 flex items-center justify-center text-cyan-300">
                    <MessageSquare className="w-4 h-4" />
                  </div>
                  <div>
                    <h3 className="font-display font-black text-sm text-white">ZEN.CHAT</h3>
                    <p className="text-[10px] font-mono text-cyan-400 uppercase">Communication &amp; Community</p>
                  </div>
                </div>
                <p className="text-xs text-neutral-400 leading-relaxed font-light">
                  Dedicated communication environment where users interact, participate in groups, follow announcements, and coordinate activities in one verified space.
                </p>
              </div>

              {/* ZEN.PULSE */}
              <div className="p-5 rounded-2xl bg-[#0D111A]/80 border border-white/[0.08] hover:border-[#C5A46D]/40 transition space-y-2.5">
                <div className="flex items-center gap-2.5">
                  <div className="w-8 h-8 rounded-lg bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-300">
                    <Radio className="w-4 h-4" />
                  </div>
                  <div>
                    <h3 className="font-display font-black text-sm text-white">ZEN.PULSE</h3>
                    <p className="text-[10px] font-mono text-emerald-400 uppercase">Expression &amp; Discussion</p>
                  </div>
                </div>
                <p className="text-xs text-neutral-400 leading-relaxed font-light">
                  A culture of expression through posts, profiles, and community debates. Not merely a social feed, but a venue to discover perspectives and build substantive connections.
                </p>
              </div>

              {/* ZEN.MUN */}
              <div className="p-5 rounded-2xl bg-[#0D111A]/80 border border-white/[0.08] hover:border-[#C5A46D]/40 transition space-y-2.5">
                <div className="flex items-center gap-2.5">
                  <div className="w-8 h-8 rounded-lg bg-[#C5A46D]/15 border border-[#C5A46D]/30 flex items-center justify-center text-[#C5A46D]">
                    <Landmark className="w-4 h-4" />
                  </div>
                  <div>
                    <h3 className="font-display font-black text-sm text-white">ZEN.MUN / DIAS</h3>
                    <p className="text-[10px] font-mono text-[#C5A46D] uppercase">Diplomacy &amp; Debate</p>
                  </div>
                </div>
                <p className="text-xs text-neutral-400 leading-relaxed font-light">
                  Platform-oriented environment for diplomatic engagement, committee participation, parliamentary simulation, and organised debate initiatives across India and the world.
                </p>
              </div>

              {/* ZEN.SOLUTIONS */}
              <div className="p-5 rounded-2xl bg-[#0D111A]/80 border border-white/[0.08] hover:border-[#C5A46D]/40 transition space-y-2.5">
                <div className="flex items-center gap-2.5">
                  <div className="w-8 h-8 rounded-lg bg-purple-500/10 border border-purple-500/20 flex items-center justify-center text-purple-300">
                    <FileText className="w-4 h-4" />
                  </div>
                  <div>
                    <h3 className="font-display font-black text-sm text-white">ZEN.SOLUTIONS</h3>
                    <p className="text-[10px] font-mono text-purple-400 uppercase">Ideas into Action</p>
                  </div>
                </div>
                <p className="text-xs text-neutral-400 leading-relaxed font-light">
                  Workspace for developing structured documents such as bills, resolutions, policy drafts, and amendments. Transitioning from identifying problems to formulating real solutions.
                </p>
              </div>

              {/* ZEN.SPACE */}
              <div className="p-5 rounded-2xl bg-[#0D111A]/80 border border-white/[0.08] hover:border-[#C5A46D]/40 transition space-y-2.5">
                <div className="flex items-center gap-2.5">
                  <div className="w-8 h-8 rounded-lg bg-amber-500/10 border border-amber-500/20 flex items-center justify-center text-amber-300">
                    <UserCheck className="w-4 h-4" />
                  </div>
                  <div>
                    <h3 className="font-display font-black text-sm text-white">ZEN.SPACE</h3>
                    <p className="text-[10px] font-mono text-amber-400 uppercase">Personal Identity</p>
                  </div>
                </div>
                <p className="text-xs text-neutral-400 leading-relaxed font-light">
                  Personal expression and identity within the larger ecosystem, connecting each individual's verified presence with the communities and activities they spearhead.
                </p>
              </div>

              {/* ZEN.PAYMENTS & PLATFORM TOOLS */}
              <div className="p-5 rounded-2xl bg-[#0D111A]/80 border border-white/[0.08] hover:border-[#C5A46D]/40 transition space-y-2.5">
                <div className="flex items-center gap-2.5">
                  <div className="w-8 h-8 rounded-lg bg-rose-500/10 border border-rose-500/20 flex items-center justify-center text-rose-300">
                    <CreditCard className="w-4 h-4" />
                  </div>
                  <div>
                    <h3 className="font-display font-black text-sm text-white">ZEN.PAYMENTS &amp; TOOLS</h3>
                    <p className="text-[10px] font-mono text-rose-400 uppercase">Practical Infrastructure</p>
                  </div>
                </div>
                <p className="text-xs text-neutral-400 leading-relaxed font-light">
                  Payment routing via Cashfree, ticketing support, administrative controls, event coordination, and utilities designed to make participation and operations seamless.
                </p>
              </div>
            </div>

            <p className="text-[11px] font-mono text-neutral-500 italic pt-2">
              *The platform is an evolving product, and individual modules may differ in their current availability, functionality, and development status.*
            </p>
          </section>

          {/* 3. ZENVITRA AS A YOUTH FOUNDATION */}
          <section id="foundation" className="space-y-5 scroll-mt-28">
            <div className="flex items-center gap-3">
              <span className="font-mono text-xs font-black text-[#C5A46D] px-2 py-0.5 rounded-md bg-[#C5A46D]/10 border border-[#C5A46D]/20">
                03
              </span>
              <h2 className="text-2xl sm:text-3xl font-black font-display uppercase tracking-tight text-white">
                ZENVITRA AS A YOUTH FOUNDATION
              </h2>
            </div>

            <div className="space-y-4 text-neutral-300 text-sm sm:text-base leading-relaxed font-light">
              <p className="text-white font-medium">
                Technology alone cannot create meaningful impact. Platforms can connect people, but communities need purpose, trust, responsibility, and opportunities to work together.
              </p>
              <p>
                This is where ZENVITRA&apos;s foundation identity becomes important.
              </p>
              <p>
                ZENVITRA Foundation represents the wider mission behind the platform: creating opportunities for young people to participate in discussions, organise initiatives, engage with social questions, develop leadership, and contribute to their communities.
              </p>
              <p>
                Its scope extends beyond students alone. The broader focus is youth — people with different educational backgrounds, interests, ambitions, and experiences who want to participate in something meaningful.
              </p>
              <p>
                The foundation&apos;s approach is built around the belief that young people should have access not only to opportunities for personal development but also to spaces where they can listen to others, understand different viewpoints, collaborate across differences, and contribute to collective efforts.
              </p>
              <p className="text-neutral-400 text-xs sm:text-sm">
                This can take the form of community initiatives, public discussions, youth forums, educational and cultural activities, media projects, diplomacy-related events, and other programmes that encourage participation and collaboration.
              </p>
              <div className="p-4 rounded-xl bg-[#0D111A] border border-[#C5A46D]/30 text-xs sm:text-sm text-neutral-200">
                <strong>Complementary Mission:</strong> The digital platform and the foundation serve complementary purposes: one provides tools and connectivity, while the other provides a broader mission and framework for action.
              </div>
            </div>
          </section>

          {/* 4. ZENVITRA AND THE CULTURE OF DEBATE */}
          <section id="debate" className="space-y-5 scroll-mt-28">
            <div className="flex items-center gap-3">
              <span className="font-mono text-xs font-black text-[#C5A46D] px-2 py-0.5 rounded-md bg-[#C5A46D]/10 border border-[#C5A46D]/20">
                04
              </span>
              <h2 className="text-2xl sm:text-3xl font-black font-display uppercase tracking-tight text-white">
                ZENVITRA AND THE CULTURE OF DEBATE
              </h2>
            </div>

            <div className="space-y-4 text-neutral-300 text-sm sm:text-base leading-relaxed font-light">
              <p>
                One of the important dimensions of ZENVITRA is its emphasis on discussion, diplomacy, public speaking, and the exchange of ideas.
              </p>
              <p className="text-white font-medium">
                Debate is not simply about winning an argument. At its best, it teaches people to examine evidence, question assumptions, understand opposing perspectives, articulate their positions, and reconsider their conclusions when presented with stronger reasoning.
              </p>
              <p>
                ZENVITRA seeks to create opportunities for this kind of engagement through MUNs, parliamentary simulations, discussions, youth forums, and related initiatives.
              </p>
              <p>
                The goal is to encourage participants to engage with complicated questions, understand the processes behind decisions, and learn how to disagree constructively.
              </p>
              <p>
                This philosophy recognises that young people do not need to agree on everything to work together. In fact, a healthy community should make room for disagreement while maintaining respect, intellectual honesty, and a willingness to listen.
              </p>
              <p className="text-[#C5A46D] font-serif italic text-base">
                ZENVITRA aims to encourage that culture — one in which the strength of an idea is not determined merely by the popularity of the person expressing it.
              </p>
            </div>
          </section>

          {/* 5. ZENVITRA AS AN EVENT AND EXPERIENCE PLATFORM */}
          <section id="events" className="space-y-5 scroll-mt-28">
            <div className="flex items-center gap-3">
              <span className="font-mono text-xs font-black text-[#C5A46D] px-2 py-0.5 rounded-md bg-[#C5A46D]/10 border border-[#C5A46D]/20">
                05
              </span>
              <h2 className="text-2xl sm:text-3xl font-black font-display uppercase tracking-tight text-white">
                ZENVITRA AS AN EVENT AND EXPERIENCE PLATFORM
              </h2>
            </div>

            <div className="space-y-4 text-neutral-300 text-sm sm:text-base leading-relaxed font-light">
              <p className="text-white font-medium">
                Youth engagement should not exist only online.
              </p>
              <p>
                Events create opportunities for people to meet, collaborate, learn, compete, celebrate, and experience ideas in a more direct way. They can turn online connections into real relationships and transform shared interests into collective experiences.
              </p>
              <p>
                ZENVITRA&apos;s wider vision includes organising and supporting events such as Model United Nations conferences, youth forums, discussions, creative experiences, cultural programmes, and other community-driven initiatives.
              </p>
              <p>
                These experiences are intended to offer more than a certificate or a temporary addition to someone&apos;s profile. They should provide participants with opportunities to meet new people, discover interests, test their abilities, exchange ideas, and become part of a community.
              </p>
              <p>
                The objective is to build experiences that people remember for what they learned, whom they met, what they contributed, and how the experience influenced their perspective.
              </p>
              <p>
                As the ecosystem develops, digital infrastructure and physical experiences can complement one another, allowing communities to remain connected beyond an individual event.
              </p>
            </div>
          </section>

          {/* 6. ZENVITRA AND SOCIAL IMPACT */}
          <section id="social-impact" className="space-y-5 scroll-mt-28">
            <div className="flex items-center gap-3">
              <span className="font-mono text-xs font-black text-[#C5A46D] px-2 py-0.5 rounded-md bg-[#C5A46D]/10 border border-[#C5A46D]/20">
                06
              </span>
              <h2 className="text-2xl sm:text-3xl font-black font-display uppercase tracking-tight text-white">
                ZENVITRA AND SOCIAL IMPACT
              </h2>
            </div>

            <div className="space-y-4 text-neutral-300 text-sm sm:text-base leading-relaxed font-light">
              <p>
                A youth-led initiative should aspire to contribute beyond its own community.
              </p>
              <p>
                ZENVITRA&apos;s social-impact orientation reflects the belief that opportunities, resources, and collective attention can be directed towards causes that benefit others.
              </p>
              <p>
                This can involve community initiatives, awareness programmes, charitable contributions associated with events, and collaborations designed to address relevant social concerns.
              </p>

              {/* 50% Charity Allocation Pillar Card */}
              <div className="p-6 rounded-2xl bg-gradient-to-br from-[#0E131F] to-[#0D111A] border-2 border-[#C5A46D]/40 shadow-xl space-y-3">
                <div className="flex items-center gap-2 text-[#C5A46D] font-mono text-xs font-bold uppercase tracking-wider">
                  <HeartHandshake className="w-4 h-4" />
                  <span>The 50% Event Charity Principle</span>
                </div>
                <p className="text-white text-sm sm:text-base font-medium leading-relaxed">
                  For instance, ZENVITRA&apos;s event philosophy has included the principle of allocating <strong>50% of event funds to charity</strong>. Such commitments should be communicated transparently, with the relevant arrangements and actual allocations clearly documented for each applicable event.
                </p>
                <p className="text-xs text-neutral-400">
                  The broader idea is that community-building and social responsibility need not exist separately. Young people can create meaningful experiences for themselves while also contributing to causes beyond their immediate interests.
                </p>
              </div>

              <p>
                Impact, however, should not be measured solely through slogans or intentions. It must ultimately be demonstrated through responsible execution, transparent reporting, consistent participation, and tangible outcomes.
              </p>
            </div>
          </section>

          {/* 7. WHAT MAKES ZENVITRA DIFFERENT? */}
          <section id="different" className="space-y-5 scroll-mt-28">
            <div className="flex items-center gap-3">
              <span className="font-mono text-xs font-black text-[#C5A46D] px-2 py-0.5 rounded-md bg-[#C5A46D]/10 border border-[#C5A46D]/20">
                07
              </span>
              <h2 className="text-2xl sm:text-3xl font-black font-display uppercase tracking-tight text-white">
                WHAT MAKES ZENVITRA DIFFERENT?
              </h2>
            </div>

            <div className="space-y-4 text-neutral-300 text-sm sm:text-base leading-relaxed font-light">
              <p>
                ZENVITRA&apos;s distinguishing ambition lies in the combination of its different dimensions.
              </p>
              <p>
                A conventional event organiser may focus primarily on running events. A social platform may focus primarily on user engagement. A debate organisation may focus primarily on conferences. A community may provide connections without offering the infrastructure needed to turn those connections into organised work.
              </p>
              <p className="text-white font-medium">
                ZENVITRA seeks to connect these experiences.
              </p>
              <p>
                It combines the ambition of a digital platform with the community-building purpose of a youth initiative, the participatory nature of debate and diplomacy, the experiential value of events, and an orientation towards social contribution.
              </p>
              <p>
                This integrated approach is intended to make participation more continuous.
              </p>
              <p className="p-4 rounded-xl bg-white/[0.02] border border-white/10 text-neutral-200">
                A person might discover ZENVITRA through an event, join a community, participate in discussions, collaborate on a proposal, contribute to an initiative, and remain connected with people they meet along the way.
              </p>
              <p>
                Rather than treating each activity as an isolated experience, ZENVITRA aims to connect them within a broader ecosystem.
              </p>
              <p className="text-xs text-neutral-400">
                This is an evolving vision, and its success depends on the quality of its execution, the usefulness of its products, the strength of its communities, and the trust it builds with its participants.
              </p>
            </div>
          </section>

          {/* 8. WHO IS ZENVITRA FOR? */}
          <section id="who-is-it-for" className="space-y-5 scroll-mt-28">
            <div className="flex items-center gap-3">
              <span className="font-mono text-xs font-black text-[#C5A46D] px-2 py-0.5 rounded-md bg-[#C5A46D]/10 border border-[#C5A46D]/20">
                08
              </span>
              <h2 className="text-2xl sm:text-3xl font-black font-display uppercase tracking-tight text-white">
                WHO IS ZENVITRA FOR?
              </h2>
            </div>

            <div className="space-y-4 text-neutral-300 text-sm sm:text-base leading-relaxed font-light">
              <p className="text-white font-medium">
                ZENVITRA is for young people who want to participate, contribute, create, collaborate, or explore something beyond their immediate environment.
              </p>
              <p>It can be relevant to:</p>

              <div className="space-y-2.5 pt-1">
                {[
                  'Individuals interested in diplomacy, international relations, governance, public policy, and debate.',
                  'Young people who want to express their opinions and engage in constructive discussions.',
                  'Creators interested in media, communication, storytelling, and cultural expression.',
                  'Aspiring organisers who want to coordinate events, communities, and initiatives.',
                  'People who want to discover new interests and build meaningful connections.',
                  'Young individuals who want to contribute to community initiatives and social-impact activities.',
                  'Anyone interested in participating in a youth-led ecosystem rather than remaining a passive observer.',
                ].map((item, idx) => (
                  <div key={idx} className="flex items-start gap-3 p-3 rounded-xl bg-[#0D111A]/60 border border-white/[0.06]">
                    <CheckCircle2 className="w-4 h-4 text-[#C5A46D] shrink-0 mt-0.5" />
                    <span className="text-xs sm:text-sm text-neutral-200">{item}</span>
                  </div>
                ))}
              </div>

              <p className="pt-2">
                You do not need to fit into one particular category to be part of the larger vision. The intention is to create room for different interests to coexist and for individuals to discover new opportunities through participation.
              </p>
            </div>
          </section>

          {/* 9. THE MEANING OF “BY YOUTH. FOR YOUTH.” */}
          <section id="by-youth-for-youth" className="space-y-5 scroll-mt-28">
            <div className="flex items-center gap-3">
              <span className="font-mono text-xs font-black text-[#C5A46D] px-2 py-0.5 rounded-md bg-[#C5A46D]/10 border border-[#C5A46D]/20">
                09
              </span>
              <h2 className="text-2xl sm:text-3xl font-black font-display uppercase tracking-tight text-white">
                THE MEANING OF “BY YOUTH. FOR YOUTH.”
              </h2>
            </div>

            <div className="space-y-4 text-neutral-300 text-sm sm:text-base leading-relaxed font-light">
              <p className="text-white font-medium">
                The slogan is more than a branding statement. It describes the philosophy behind ZENVITRA.
              </p>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-1">
                <div className="p-5 rounded-2xl bg-[#0D111A] border-2 border-[#C5A46D]/30 space-y-2">
                  <h3 className="font-display font-black text-lg text-[#C5A46D]">BY YOUTH</h3>
                  <p className="text-xs text-neutral-300 leading-relaxed font-light">
                    Represents the importance of young people taking initiative, developing ideas, accepting responsibility, building solutions, and participating in the creation of opportunities rather than waiting for someone else to create them.
                  </p>
                </div>

                <div className="p-5 rounded-2xl bg-[#0D111A] border-2 border-cyan-500/30 space-y-2">
                  <h3 className="font-display font-black text-lg text-cyan-300">FOR YOUTH</h3>
                  <p className="text-xs text-neutral-300 leading-relaxed font-light">
                    Represents the purpose of that effort: building experiences, communities, and tools that respond to the interests and needs of young people.
                  </p>
                </div>
              </div>

              <p>
                It does not mean that young people must work in isolation. Mentorship, partnerships, institutional support, and collaboration with people from different generations can all be valuable.
              </p>
              <p>
                Instead, it emphasises that young people should have meaningful agency in shaping the spaces they participate in.
              </p>
              <p className="text-white font-medium p-4 rounded-xl bg-white/[0.02] border-l-2 border-cyan-400">
                ZENVITRA&apos;s identity rests on that principle: young people should not merely be the audience for initiatives created around them. They should also have the opportunity to become their organisers, contributors, decision-makers, and builders.
              </p>
            </div>
          </section>

          {/* 10. THE LONG-TERM VISION */}
          <section id="long-term-vision" className="space-y-5 scroll-mt-28">
            <div className="flex items-center gap-3">
              <span className="font-mono text-xs font-black text-[#C5A46D] px-2 py-0.5 rounded-md bg-[#C5A46D]/10 border border-[#C5A46D]/20">
                10
              </span>
              <h2 className="text-2xl sm:text-3xl font-black font-display uppercase tracking-tight text-white">
                THE LONG-TERM VISION
              </h2>
            </div>

            <div className="space-y-4 text-neutral-300 text-sm sm:text-base leading-relaxed font-light">
              <p>
                ZENVITRA is an evolving initiative, and its long-term ambition is larger than any single feature, conference, or campaign.
              </p>
              <p className="text-white font-medium">
                The vision is to develop a sustainable youth ecosystem in which digital tools, communities, events, discussions, and social initiatives reinforce one another.
              </p>
              <p>
                That means continuing to develop useful platform features, improving the participant experience, building responsible community practices, supporting youth-led initiatives, expanding opportunities for collaboration, and establishing trust through transparent operations.
              </p>
              <p>
                It also means recognising that growth alone is not enough. A large community is not automatically a meaningful one, and a sophisticated platform is not automatically a useful one.
              </p>
              <p>
                Long-term success will depend on whether ZENVITRA genuinely helps people connect, participate, create, learn, organise, and contribute.
              </p>
              <p className="text-[#C5A46D] font-serif italic text-base">
                The ambition is to build something that can grow without losing its central purpose: making youth participation more accessible, connected, and meaningful.
              </p>
            </div>
          </section>

          {/* 11. ZENVITRA IN ONE SENTENCE */}
          <section id="one-sentence" className="space-y-6 scroll-mt-28 pt-4">
            <div className="flex items-center gap-3">
              <span className="font-mono text-xs font-black text-[#C5A46D] px-2 py-0.5 rounded-md bg-[#C5A46D]/10 border border-[#C5A46D]/20">
                11
              </span>
              <h2 className="text-2xl sm:text-3xl font-black font-display uppercase tracking-tight text-white">
                ZENVITRA IN ONE SENTENCE
              </h2>
            </div>

            {/* Master Definition Spotlight */}
            <div className="p-8 sm:p-10 rounded-3xl bg-gradient-to-br from-[#0F1424] via-[#0A0D15] to-[#08090C] border-2 border-[#C5A46D] shadow-[0_0_50px_rgba(197,164,109,0.2)] space-y-4">
              <p className="text-xl sm:text-2xl md:text-3xl font-display font-black text-white leading-snug">
                “ZENVITRA is a youth-led digital ecosystem and foundation that brings together technology, community, diplomacy, discussion, creative experiences, and social impact to help young people connect, collaborate, and turn ideas into action.”
              </p>
              <p className="text-xs sm:text-sm font-mono text-[#C5A46D] tracking-wide uppercase">
                It is not just about providing a place to participate. It is about creating more ways for participation to lead somewhere.
              </p>
            </div>

            {/* THE BIGGER IDEA */}
            <div className="space-y-6 pt-6">
              <h3 className="text-2xl font-black font-display uppercase tracking-tight text-white">
                THE BIGGER IDEA
              </h3>

              <div className="space-y-4 text-neutral-300 text-sm sm:text-base leading-relaxed font-light">
                <p>
                  ZENVITRA begins with a simple recognition: young people already have ideas, abilities, ambitions, and perspectives. What they often need are the right spaces, tools, communities, and opportunities to bring those things together.
                </p>
                <p className="text-white font-medium">
                  ZENVITRA seeks to help create that environment.
                </p>

                <div className="p-6 rounded-2xl bg-white/[0.02] border border-white/10 text-neutral-200 space-y-2 text-sm sm:text-base font-serif italic">
                  <p>A place to speak. A space to listen.</p>
                  <p>A community to build with. Tools to develop ideas.</p>
                  <p>Experiences that bring people together. Opportunities to contribute beyond oneself.</p>
                </div>

                <p>
                  Not a promise that one platform can solve every problem facing young people, but an effort to build a connected ecosystem in which more young people can participate in shaping their own experiences and the world around them.
                </p>
              </div>

              {/* Final Slogan Banner */}
              <div className="text-center py-10 space-y-3 border-t border-b border-white/[0.08]">
                <h4 className="text-3xl sm:text-5xl font-black font-display tracking-tight text-white uppercase">
                  ZENVITRA. BY YOUTH. FOR YOUTH.
                </h4>
                <p className="text-base sm:text-lg font-serif italic text-[#C5A46D] tracking-wider uppercase font-semibold">
                  A NEW ZEN BEGINS.
                </p>
              </div>
            </div>
          </section>

          {/* ── ACTION FOOTER & ROUTE TRANSITIONS ── */}
          <div className="pt-6 space-y-6">
            <h4 className="text-xs font-mono font-bold uppercase tracking-widest text-neutral-400">
              Where to Go Next
            </h4>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <Link
                href="/pulse"
                className="p-6 rounded-2xl bg-gradient-to-br from-[#C5A46D] via-[#DFBA73] to-[#B3935B] text-[#08090C] font-display font-black hover:opacity-95 transition shadow-[0_0_30px_rgba(197,164,109,0.3)] flex flex-col justify-between group cursor-pointer"
              >
                <div>
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-mono uppercase tracking-widest bg-black/15 px-2 py-0.5 rounded font-bold">Live Social Feed</span>
                    <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                  </div>
                  <h3 className="text-xl font-black mt-4">ENTER ZENVITRA</h3>
                  <p className="text-xs font-sans text-black/80 font-normal mt-1">
                    Explore sovereign posts, verified dispatches, and public discussions.
                  </p>
                </div>
              </Link>

              <Link
                href="/dias/tour"
                className="p-6 rounded-2xl bg-[#0D111A] border border-white/10 hover:border-[#C5A46D]/50 transition flex flex-col justify-between group cursor-pointer"
              >
                <div>
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-mono uppercase tracking-widest text-[#C5A46D] bg-[#C5A46D]/10 px-2 py-0.5 rounded font-bold">Simulator</span>
                    <ArrowRight className="w-4 h-4 text-white group-hover:translate-x-1 transition-transform" />
                  </div>
                  <h3 className="text-xl font-display font-black text-white mt-4">EXPLORE DIAS TOUR</h3>
                  <p className="text-xs text-neutral-400 font-light mt-1">
                    Interactive simulation of the Chair Dais cockpit, gavel strikes &amp; roll call.
                  </p>
                </div>
              </Link>

              <Link
                href="/onboarding"
                className="p-5 rounded-2xl bg-white/[0.03] border border-white/10 hover:border-white/20 transition flex items-center justify-between group cursor-pointer"
              >
                <div className="flex items-center gap-3">
                  <Compass className="w-5 h-5 text-cyan-400" />
                  <div>
                    <h5 className="text-sm font-bold text-white">Revisit Onboarding Tour</h5>
                    <p className="text-[11px] text-neutral-400">Interactive platform walkthrough trailer</p>
                  </div>
                </div>
                <ChevronRight className="w-4 h-4 text-neutral-500 group-hover:translate-x-1 transition-transform" />
              </Link>

              <Link
                href="/join-core-team"
                className="p-5 rounded-2xl bg-white/[0.03] border border-white/10 hover:border-white/20 transition flex items-center justify-between group cursor-pointer"
              >
                <div className="flex items-center gap-3">
                  <Users className="w-5 h-5 text-[#C5A46D]" />
                  <div>
                    <h5 className="text-sm font-bold text-white">Join Core Team</h5>
                    <p className="text-[11px] text-neutral-400">Build, organise, and lead initiatives with us</p>
                  </div>
                </div>
                <ChevronRight className="w-4 h-4 text-neutral-500 group-hover:translate-x-1 transition-transform" />
              </Link>
            </div>
          </div>
        </main>
      </div>

      <Footer />
    </div>
  );
}
