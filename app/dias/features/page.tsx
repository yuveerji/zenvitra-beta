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

export default function DiasFeaturesPage() {
  return (
    <div className="min-h-screen bg-[#08090B] text-[#F4F2ED] font-sans antialiased selection:bg-[#6366F1]/30 selection:text-[#C7D2FE]">
      <DiasNav />

      <main className="pt-32 sm:pt-40 pb-24 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto space-y-24">
        {/* Header */}
        <div className="text-center space-y-4 max-w-3xl mx-auto">
          <DiasBadge variant="indigo" size="sm">
            PROCEDURAL ARCHITECTURE
          </DiasBadge>
          <h1 className="text-4xl sm:text-6xl font-serif text-[#F4F2ED] tracking-tight">
            Engineered for <span className="italic text-[#6366F1]">Diplomatic Excellence.</span>
          </h1>
          <p className="text-sm sm:text-base text-[#9A9DA5] leading-relaxed">
            Every procedural rule, timer calculation, voting threshold, and document lifecycle has been built from the ground up for authentic summits.
          </p>
        </div>

        {/* Feature Grid Section 1: Parliamentary Legislative Engine */}
        <section id="parliament" className="space-y-8 scroll-mt-28">
          <div className="flex items-center gap-3 border-b border-[#181B21] pb-4">
            <Building2 className="w-6 h-6 text-[#6366F1]" />
            <h2 className="text-2xl sm:text-3xl font-serif text-[#F4F2ED]">
              Indian Parliamentary & Legislative Engine
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <DiasCard variant="elevated" className="p-6 space-y-3">
              <h3 className="text-base font-semibold text-[#F4F2ED]">Clause-by-Clause Bill Editor</h3>
              <p className="text-xs text-[#9A9DA5] leading-relaxed">
                Structured drafting interface for Lok Sabha and Rajya Sabha bills. Draft preamble, statement of objects, and numbered statutory clauses with immutable version tracking.
              </p>
            </DiasCard>

            <DiasCard variant="elevated" className="p-6 space-y-3">
              <h3 className="text-base font-semibold text-[#F4F2ED]">Amendment Review Lifecycle</h3>
              <p className="text-xs text-[#9A9DA5] leading-relaxed">
                Members propose line-item amendments to specific clauses. The Speaker reviews, admits for debate, and puts them to a voice or division vote before incorporating into the bill.
              </p>
            </DiasCard>

            <DiasCard variant="elevated" className="p-6 space-y-3">
              <h3 className="text-base font-semibold text-[#F4F2ED]">Question Hour & Zero Hour</h3>
              <p className="text-xs text-[#9A9DA5] leading-relaxed">
                Submit starred and unstarred parliamentary questions to designated ministries. Track ministerial replies, supplementary questions, and calling attention notices.
              </p>
            </DiasCard>
          </div>
        </section>

        {/* Feature Grid Section 2: UN General Assembly & UNSC */}
        <section id="un" className="space-y-8 scroll-mt-28">
          <div className="flex items-center gap-3 border-b border-[#181B21] pb-4">
            <Globe2 className="w-6 h-6 text-[#6366F1]" />
            <h2 className="text-2xl sm:text-3xl font-serif text-[#F4F2ED]">
              United Nations Rules of Procedure
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <DiasCard variant="elevated" className="p-6 space-y-3">
              <h3 className="text-base font-semibold text-[#F4F2ED]">General Speakers' List & Yields</h3>
              <p className="text-xs text-[#9A9DA5] leading-relaxed">
                Reorderable speaking queue with instant yields to the Chair, questions, or another delegation. Automatic time transfer and procedural point handling.
              </p>
            </DiasCard>

            <DiasCard variant="elevated" className="p-6 space-y-3">
              <h3 className="text-base font-semibold text-[#F4F2ED]">Caucuses & Tour de Table</h3>
              <p className="text-xs text-[#9A9DA5] leading-relaxed">
                Moderated caucuses with configurable total times and individual speaking limits. Consultation periods, unmoderated caucuses, and structured round-robin speaking.
              </p>
            </DiasCard>

            <DiasCard variant="elevated" className="p-6 space-y-3">
              <h3 className="text-base font-semibold text-[#F4F2ED]">UNSC Veto & Substantive Voting</h3>
              <p className="text-xs text-[#9A9DA5] leading-relaxed">
                Automatic enforcement of Permanent Five (P5) veto power on substantive draft resolutions. Roll-call voting, 2/3 majority calculations, and division of the question.
              </p>
            </DiasCard>
          </div>
        </section>

        {/* Feature Grid Section 3: Press Corps & Media */}
        <section id="press" className="space-y-8 scroll-mt-28">
          <div className="flex items-center gap-3 border-b border-[#181B21] pb-4">
            <Newspaper className="w-6 h-6 text-[#6366F1]" />
            <h2 className="text-2xl sm:text-3xl font-serif text-[#F4F2ED]">
              International Press Corps (IPC) Newsroom
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <DiasCard variant="elevated" className="p-6 space-y-3">
              <h3 className="text-base font-semibold text-[#F4F2ED]">Editorial Review Pipeline</h3>
              <p className="text-xs text-[#9A9DA5] leading-relaxed">
                Correspondents submit breaking articles and press releases to the Editor-in-Chief. Edit, request revisions, and publish official conference dispatches.
              </p>
            </DiasCard>

            <DiasCard variant="elevated" className="p-6 space-y-3">
              <h3 className="text-base font-semibold text-[#F4F2ED]">Time-Locked Embargoes</h3>
              <p className="text-xs text-[#9A9DA5] leading-relaxed">
                Embargoed communiqués and press releases remain cryptographically locked and invisible until the authorized release time arrives.
              </p>
            </DiasCard>

            <DiasCard variant="elevated" className="p-6 space-y-3">
              <h3 className="text-base font-semibold text-[#F4F2ED]">Press Conferences & Interviews</h3>
              <p className="text-xs text-[#9A9DA5] leading-relaxed">
                Request formal interviews with ambassadors and cabinet ministers directly through diplomatic chits and dedicated press conference queues.
              </p>
            </DiasCard>
          </div>
        </section>

        {/* Feature Grid Section 4: Crisis Directives */}
        <section id="crisis" className="space-y-8 scroll-mt-28">
          <div className="flex items-center gap-3 border-b border-[#181B21] pb-4">
            <Flame className="w-6 h-6 text-[#6366F1]" />
            <h2 className="text-2xl sm:text-3xl font-serif text-[#F4F2ED]">
              Cabinet & Crisis Simulation Terminal
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <DiasCard variant="elevated" className="p-6 space-y-3">
              <h3 className="text-base font-semibold text-[#F4F2ED]">Targeted Directives</h3>
              <p className="text-xs text-[#9A9DA5] leading-relaxed">
                Submit covert or overt action orders to the Crisis Director. Directives are targeted only to authorized cabinet members without public chamber leakage.
              </p>
            </DiasCard>

            <DiasCard variant="elevated" className="p-6 space-y-3">
              <h3 className="text-base font-semibold text-[#F4F2ED]">Situation Report Bulletins</h3>
              <p className="text-xs text-[#9A9DA5] leading-relaxed">
                Live crisis updates broadcast directly into the session with breaking alerts, intelligence documents, and real-time scenario updates.
              </p>
            </DiasCard>

            <DiasCard variant="elevated" className="p-6 space-y-3">
              <h3 className="text-base font-semibold text-[#F4F2ED]">Restricted War Room Channels</h3>
              <p className="text-xs text-[#9A9DA5] leading-relaxed">
                Cryptographically isolated chambers for emergency national security deliberations and cabinet sub-committees.
              </p>
            </DiasCard>
          </div>
        </section>

        {/* Bottom CTA */}
        <div className="text-center pt-12 space-y-4">
          <h3 className="text-2xl sm:text-3xl font-serif text-[#F4F2ED]">
            Ready to experience the platform in action?
          </h3>
          <div className="flex items-center justify-center gap-4">
            <Link href="/dias?dais=true">
              <DiasButton variant="indigo" size="md">
                Launch Live Dais
              </DiasButton>
            </Link>
            <Link href="/dias">
              <DiasButton variant="charcoal" size="md">
                Back to Overview
              </DiasButton>
            </Link>
          </div>
        </div>
      </main>

      <DiasFooter />
    </div>
  );
}
