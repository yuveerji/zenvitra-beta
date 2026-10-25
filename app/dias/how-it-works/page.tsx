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
} from 'lucide-react';
import { DiasNav } from '@/components/mun/dias/DiasNav';
import { DiasFooter } from '@/components/mun/dias/DiasFooter';
import { DiasButton } from '@/components/mun/dias/DiasButton';
import { DiasBadge } from '@/components/mun/dias/DiasBadge';
import { DiasCard } from '@/components/mun/dias/DiasCard';

export default function DiasHowItWorksPage() {
  const steps = [
    {
      step: '01',
      title: 'Initialize Committee & Roster',
      subtitle: 'Instant Presets for Any Format',
      description:
        'Select your committee template—Indian Parliamentary, UN General Assembly, Press Corps, or Crisis Cabinet. Generate an unambiguous 6-character session code and invite delegates without pre-seeding fake attendees.',
      tags: ['Template Presets', 'Join Code', 'Real Attendees'],
    },
    {
      step: '02',
      title: 'Roll Call & Automatic Quorum Math',
      subtitle: 'Zero Mathematical Errors',
      description:
        'Conduct roll call with simple switches for Absent, Present, and Present & Voting. The engine automatically calculates the quorum threshold and tracks voting majorities in real time.',
      tags: ['Present & Voting', 'Quorum Verification', 'Simple Majority'],
    },
    {
      step: '03',
      title: 'Debate, Timers & Gavel Controls',
      subtitle: 'Server-Anchored Precision',
      description:
        'Manage the speaking queue seamlessly. Recognized delegates speak against an authoritative server timestamp that survives reloads. Strike the acoustic procedural gavel anytime with [G] for parliamentary order.',
      tags: ['Synchronized Clock', 'Physical Wood Gavel', 'Floor Yields'],
    },
    {
      step: '04',
      title: 'Motions, Caucuses & Points',
      subtitle: 'Structured Procedural Transitions',
      description:
        'Delegates raise points of personal privilege or propose moderated caucuses. The chair accepts, queues, or puts motions to a procedural vote with one tap, seamlessly transitioning debate modes.',
      tags: ['Points of Order', 'Moderated Caucuses', 'Instant Switching'],
    },
    {
      step: '05',
      title: 'Resolution & Legislative Bill Drafting',
      subtitle: 'Structured Clause-by-Clause Governance',
      description:
        'Draft working papers, draft resolutions, or parliamentary bills directly inside the built-in document workspace. Propose line-item amendments and track author edits without messy third-party documents.',
      tags: ['Clause Editor', 'Amendment Review', 'Version Tracking'],
    },
    {
      step: '06',
      title: 'Substantive Voting & Division',
      subtitle: 'Confidential Ballots & Veto Rules',
      description:
        'Enter voting procedure with complete rule enforcement: 2/3 majority, consensus, UNSC P5 vetoes, or division of the house. Secret ballots strip user IDs automatically to preserve full voter privacy.',
      tags: ['Division Votes', 'Veto Safeguards', 'Secret Ballots'],
    },
  ];

  return (
    <div className="min-h-screen bg-[#08090B] text-[#F4F2ED] font-sans antialiased selection:bg-[#C5A46D]/30 selection:text-[#E6D1A5]">
      <DiasNav />

      <main className="pt-32 sm:pt-40 pb-24 px-4 sm:px-6 lg:px-8 max-w-5xl mx-auto space-y-20">
        {/* Header */}
        <div className="text-center space-y-4 max-w-2xl mx-auto">
          <DiasBadge variant="gold" size="sm">
            WORKFLOW PROTOCOL
          </DiasBadge>
          <h1 className="text-4xl sm:text-6xl font-serif text-[#F4F2ED] tracking-tight">
            How ZENVITRA <span className="italic text-[#C5A46D]">Operates.</span>
          </h1>
          <p className="text-sm sm:text-base text-[#9A9DA5] leading-relaxed">
            From the opening gavel strike to the final resolution vote, experience a smooth, mathematically verifiable diplomatic summit.
          </p>
        </div>

        {/* Steps List */}
        <div className="space-y-8 relative">
          {/* Central connecting line for desktop */}
          <div className="hidden md:block absolute left-8 top-10 bottom-10 w-px bg-gradient-to-b from-[#C5A46D]/40 via-[#232731] to-transparent pointer-events-none" />

          {steps.map((item, index) => (
            <div key={index} className="relative flex flex-col md:flex-row items-start gap-6 md:gap-10">
              {/* Step indicator node */}
              <div className="w-16 h-16 rounded-2xl bg-[#111318] border border-[#C5A46D]/40 flex items-center justify-center font-mono font-bold text-lg text-[#C5A46D] shadow-[0_0_20px_rgba(197,164,109,0.15)] shrink-0 z-10">
                {item.step}
              </div>

              {/* Step content card */}
              <DiasCard variant="elevated" className="flex-1 p-6 sm:p-8 space-y-3 text-left">
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <h3 className="text-xl sm:text-2xl font-serif font-semibold text-[#F4F2ED]">
                    {item.title}
                  </h3>
                  <span className="text-xs font-mono text-[#C5A46D]">{item.subtitle}</span>
                </div>
                <p className="text-xs sm:text-sm text-[#9A9DA5] leading-relaxed">
                  {item.description}
                </p>
                <div className="flex flex-wrap items-center gap-2 pt-2">
                  {item.tags.map((tag, tIndex) => (
                    <DiasBadge key={tIndex} variant="charcoal" size="sm">
                      {tag}
                    </DiasBadge>
                  ))}
                </div>
              </DiasCard>
            </div>
          ))}
        </div>

        {/* Bottom CTA */}
        <div className="text-center pt-8 space-y-4">
          <h3 className="text-2xl sm:text-3xl font-serif text-[#F4F2ED]">
            Experience a session right now
          </h3>
          <p className="text-xs sm:text-sm text-[#9A9DA5] max-w-md mx-auto">
            Test the chair controls, speaker timer, and procedural gavel without any setup.
          </p>
          <div className="flex items-center justify-center gap-4 pt-2">
            <Link href="/host?dais=true">
              <DiasButton variant="gold" size="md">
                Launch Live Dais
              </DiasButton>
            </Link>
            <Link href="/dias">
              <DiasButton variant="charcoal" size="md">
                Return to Overview
              </DiasButton>
            </Link>
          </div>
        </div>
      </main>

      <DiasFooter />
    </div>
  );
}
