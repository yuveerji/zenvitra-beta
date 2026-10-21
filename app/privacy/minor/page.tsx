'use client';

import React, { useState, useMemo, useEffect, useRef } from 'react';
import Link from 'next/link';
import {
  ShieldCheck,
  Lock,
  Search,
  Scale,
  FileText,
  ChevronRight,
  Gavel,
  CheckCircle2,
  AlertCircle,
  HelpCircle,
  Clock,
  Printer,
  Shield,
  UserCheck,
  HeartHandshake,
  ArrowRight
} from 'lucide-react';
import { Navbar } from '@/components/layout/Navbar';
import { Footer } from '@/components/layout/Footer';
import {
  MINOR_PRIVACY_POLICY_DATA,
  LegalPart,
  LegalClause,
  LegalSubsection
} from '@/lib/legalData';

// Helper to generate consistent element ID for each part
const getPartId = (partNumber: string) =>
  `part-${partNumber.toLowerCase().trim().replace(/[^a-z0-9]+/g, '-')}`;

export default function MinorPrivacyPolicyPage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [activePart, setActivePart] = useState<string>('PART I');

  // Filter clauses based on search
  const filteredParts = useMemo(() => {
    if (!searchQuery.trim()) return MINOR_PRIVACY_POLICY_DATA;
    const query = searchQuery.toLowerCase();

    return MINOR_PRIVACY_POLICY_DATA
      .map((part: LegalPart) => {
        const matchesPart =
          part.partNumber.toLowerCase().includes(query) ||
          part.partTitle.toLowerCase().includes(query);

        const filteredClauses = part.clauses.filter((clause: LegalClause) => {
          const matchesTitle = clause.title.toLowerCase().includes(query);
          const matchesSubsections = clause.subsections.some(
            (sub: LegalSubsection) =>
              sub.heading.toLowerCase().includes(query) ||
              sub.paragraphs.some((p: string) => p.toLowerCase().includes(query))
          );
          return matchesTitle || matchesSubsections;
        });

        if (matchesPart || filteredClauses.length > 0) {
          return {
            ...part,
            clauses: matchesPart ? part.clauses : filteredClauses
          };
        }
        return null;
      })
      .filter(Boolean) as LegalPart[];
  }, [searchQuery]);

  // Ref to sidebar nav to scroll active item into view
  const sidebarNavRef = useRef<HTMLElement | null>(null);
  const isClickScrollingRef = useRef(false);

  // Sync active part on scroll
  useEffect(() => {
    if (typeof window === 'undefined') return;

    const handleScroll = () => {
      if (isClickScrollingRef.current) return;

      const headerOffset = 140;
      const partElements = MINOR_PRIVACY_POLICY_DATA
        .map((p) => ({
          partNumber: p.partNumber,
          el: document.getElementById(getPartId(p.partNumber))
        }))
        .filter((item): item is { partNumber: string; el: HTMLElement } => item.el !== null);

      if (partElements.length === 0) return;

      let currentPart = partElements[0].partNumber;
      for (const item of partElements) {
        const rect = item.el.getBoundingClientRect();
        if (rect.top <= headerOffset) {
          currentPart = item.partNumber;
        } else {
          break;
        }
      }

      setActivePart(currentPart);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll();
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Auto-scroll the sidebar item into view
  useEffect(() => {
    if (!sidebarNavRef.current) return;
    const activeItem = sidebarNavRef.current.querySelector(`[data-part-number="${activePart}"]`) as HTMLElement | null;
    if (activeItem) {
      activeItem.scrollIntoView({
        behavior: 'smooth',
        block: 'nearest',
        inline: 'nearest'
      });
    }
  }, [activePart]);

  const handlePrint = () => {
    if (typeof window !== 'undefined') {
      window.print();
    }
  };

  return (
    <div className="min-h-screen bg-[#030405] text-neutral-300 flex flex-col justify-between font-sans selection:bg-amber-400 selection:text-black pt-20 sm:pt-24">
      <Navbar />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 w-full space-y-10">
        
        {/* Policy Switcher Tabs: Major vs Minor */}
        <div className="flex flex-wrap items-center gap-3 p-2 rounded-2xl bg-[#090b10] border border-white/10">
          <Link
            href="/privacy"
            className="flex-1 min-w-[240px] px-4 py-3 rounded-xl text-center text-xs font-mono font-medium text-neutral-400 hover:text-white hover:bg-white/5 transition flex items-center justify-center gap-2"
          >
            <ShieldCheck className="w-4 h-4 text-emerald-400" />
            <span>Standard Privacy Policy (Adults 18+ &amp; Entities)</span>
          </Link>
          <div className="flex-1 min-w-[240px] px-4 py-3 rounded-xl text-center text-xs font-mono font-bold bg-amber-500/15 border border-amber-500/40 text-amber-300 shadow-md flex items-center justify-center gap-2">
            <HeartHandshake className="w-4 h-4 text-amber-400" />
            <span>Under-18 User Protection &amp; Parental Consent Policy</span>
            <span className="text-[9px] uppercase px-1.5 py-0.5 rounded bg-amber-400/20 text-amber-300 font-black">Active</span>
          </div>
        </div>

        {/* Header Banner */}
        <div className="space-y-4 border-b border-white/10 pb-8 text-left">
          <div className="flex flex-wrap items-center gap-2">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-500/10 border border-amber-500/30 text-amber-300 font-mono text-[10px] uppercase font-bold tracking-wider">
              <Shield className="w-3.5 h-3.5 text-amber-400" />
              <span>DPDP ACT 2023 // DPDP RULES 2025 // UNDER-18 DEDICATED POLICY</span>
            </div>
            <span className="text-[11px] font-mono text-neutral-400 bg-white/5 px-2.5 py-1 rounded-full border border-white/10">
              6 Parts &bull; 10 Statutory Clauses &bull; Verifiable Parental Consent Framework
            </span>
          </div>

          <h1 className="text-3xl sm:text-5xl font-black font-display text-white tracking-tight leading-tight">
            UNDER-18 USER PROTECTION &amp; PARENTAL CONSENT POLICY
          </h1>

          <p className="text-sm sm:text-base text-neutral-300 max-w-3xl leading-relaxed">
            A dedicated statutory privacy and data governance charter governing minors (users under 18 years of age) and their parents or lawful guardians across <strong className="text-white">ZENVITRA, ZEN.MUN, ZEN.PULSE, ZEN.DOCS, ZEN.EVENTS, and ZEN.PRESS</strong>.
          </p>

          <div className="p-4 rounded-2xl bg-amber-500/[0.05] border border-amber-500/25 text-xs font-mono text-amber-200/90 flex items-start gap-3">
            <AlertCircle className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
            <div className="space-y-1">
              <div>
                <strong className="text-amber-300">Section 9 DPDP Act, 2023 Statutory Protection:</strong> ZENVITRA strictly prohibits targeted advertising to children, behavioural tracking, or processing that causes detrimental effects on child wellbeing. Verifiable parental or guardian consent is obtained and verified prior to personal data ingestion where required by law.
              </div>
              <div className="text-[11px] text-neutral-400">
                Adult users (18+) and institutional event organizers should consult the <Link href="/privacy" className="text-white underline hover:text-amber-300">Standard Privacy Policy</Link>.
              </div>
            </div>
          </div>
        </div>

        {/* Quick Highlights Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-left">
          <div className="p-5 rounded-2xl bg-[#080a10] border border-white/10 space-y-2">
            <div className="flex items-center gap-2 text-amber-400 font-mono text-xs font-bold uppercase">
              <Lock className="w-4 h-4" />
              <span>Zero Tracking &amp; No Ads</span>
            </div>
            <p className="text-xs text-neutral-300 font-sans leading-relaxed">
              No behavioural profiling, no cross-platform tracking, and zero commercial data selling. Children are never treated as commercial marketing targets.
            </p>
          </div>

          <div className="p-5 rounded-2xl bg-[#080a10] border border-white/10 space-y-2">
            <div className="flex items-center gap-2 text-cyan-400 font-mono text-xs font-bold uppercase">
              <UserCheck className="w-4 h-4" />
              <span>Verifiable Guardian Consent</span>
            </div>
            <p className="text-xs text-neutral-300 font-sans leading-relaxed">
              Parent or guardian authorization is validated via direct coordinate confirmation and authenticated verification tokens, not just unchecked checkboxes.
            </p>
          </div>

          <div className="p-5 rounded-2xl bg-[#080a10] border border-white/10 space-y-2">
            <div className="flex items-center gap-2 text-emerald-400 font-mono text-xs font-bold uppercase">
              <ShieldCheck className="w-4 h-4" />
              <span>Parental Erasure Rights</span>
            </div>
            <p className="text-xs text-neutral-300 font-sans leading-relaxed">
              Parents or lawful guardians can inspect, modify, withdraw consent, or request complete cryptographic erasure of minor data by contacting privacy@zenvitra.xyz.
            </p>
          </div>
        </div>

        {/* Search & Actions Bar */}
        <div className="p-4 rounded-2xl bg-[#080a10] border border-white/10 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="relative w-full sm:max-w-md">
            <Search className="w-4 h-4 text-neutral-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search minor safeguards (e.g. Guardian, Consent, DPDP, Erasure)..."
              className="w-full pl-10 pr-4 py-2 rounded-xl bg-black border border-white/15 text-xs text-white placeholder-neutral-500 focus:outline-none focus:border-amber-400 font-mono"
            />
          </div>

          <div className="flex items-center gap-3 w-full sm:w-auto justify-end">
            <button
              onClick={handlePrint}
              className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-xs font-mono text-neutral-300 transition cursor-pointer"
              title="Print Policy"
            >
              <Printer className="w-3.5 h-3.5" />
              <span>Print</span>
            </button>
            <Link
              href="/terms/minor"
              className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-amber-500/10 hover:bg-amber-500/20 border border-amber-500/30 text-xs font-mono text-amber-300 transition"
            >
              <span>Minor Terms of Service</span>
              <ChevronRight className="w-3.5 h-3.5" />
            </Link>
          </div>
        </div>

        {/* Document Body: Table of Contents + Clause-by-Clause Reader */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 text-left">
          {/* Sticky Table of Contents (Desktop) */}
          <aside className="hidden lg:block lg:col-span-3 self-start sticky top-24 z-20 space-y-3 max-h-[calc(100vh-7rem)] overflow-y-auto pr-2 custom-scrollbar text-xs font-mono">
            <div className="text-[10px] uppercase text-neutral-400 font-bold tracking-wider px-2">
              MINOR POLICY DIRECTORY
            </div>
            <nav 
              ref={sidebarNavRef}
              className="space-y-1"
            >
              {MINOR_PRIVACY_POLICY_DATA.map((p: LegalPart) => {
                const isActive = activePart === p.partNumber;
                return (
                  <a
                    key={p.partNumber}
                    href={`#${getPartId(p.partNumber)}`}
                    data-part-number={p.partNumber}
                    onClick={() => {
                      isClickScrollingRef.current = true;
                      setActivePart(p.partNumber);
                      setTimeout(() => {
                        isClickScrollingRef.current = false;
                      }, 1000);
                    }}
                    className={`block px-3 py-2 rounded-xl transition truncate ${
                      isActive
                        ? 'bg-amber-500/20 text-amber-300 border border-amber-400/50 font-bold shadow-md ring-1 ring-amber-400/40'
                        : 'text-neutral-400 hover:text-white hover:bg-white/5'
                    }`}
                  >
                    <span className="text-[10px] opacity-70 block">{p.partNumber}</span>
                    <span className="truncate">{p.partTitle}</span>
                  </a>
                );
              })}
            </nav>
          </aside>

          {/* Main Legal Clauses Stream */}
          <main className="lg:col-span-9 space-y-12">
            {filteredParts.length === 0 ? (
              <div className="p-12 text-center rounded-3xl bg-[#080a10] border border-white/10 space-y-3">
                <Search className="w-8 h-8 text-neutral-600 mx-auto" />
                <h3 className="text-white font-bold text-base">No Matching Minor Clauses Found</h3>
                <p className="text-xs text-neutral-400 font-mono">
                  Try adjusting your search terms or view the full table of contents on the left.
                </p>
                <button
                  onClick={() => setSearchQuery('')}
                  className="px-4 py-2 rounded-xl bg-white/10 hover:bg-white/15 text-xs font-mono text-white mt-2"
                >
                  Clear Search Filter
                </button>
              </div>
            ) : (
              filteredParts.map((part: LegalPart) => (
                <section
                  key={part.partNumber}
                  id={getPartId(part.partNumber)}
                  className="space-y-6 pt-4 scroll-mt-24"
                >
                  {/* Part Header */}
                  <div className="p-4 sm:p-5 rounded-2xl bg-gradient-to-r from-amber-500/10 via-[#0a0c14] to-black border-l-4 border-l-amber-400 border border-white/10 space-y-1">
                    <span className="text-[11px] font-mono text-amber-400 font-bold tracking-widest uppercase">
                      {part.partNumber}
                    </span>
                    <h2 className="text-xl sm:text-2xl font-bold font-display text-white tracking-tight">
                      {part.partTitle}
                    </h2>
                  </div>

                  {/* Clauses inside this Part */}
                  <div className="space-y-6">
                    {part.clauses.map((clause: LegalClause) => (
                      <article
                        key={clause.id}
                        className="p-6 rounded-3xl bg-[#080a10] border border-white/10 space-y-5 hover:border-white/20 transition shadow-lg"
                      >
                        <h3 className="text-lg font-bold font-display text-white border-b border-white/5 pb-3">
                          {clause.title}
                        </h3>

                        <div className="space-y-5">
                          {clause.subsections.map((sub: LegalSubsection) => (
                            <div key={sub.number} className="space-y-2 text-xs sm:text-sm">
                              <h4 className="font-mono text-xs font-bold text-amber-300 flex items-center gap-2">
                                <span className="px-2 py-0.5 rounded bg-white/5 text-neutral-300 font-normal">
                                  {sub.number}
                                </span>
                                <span>{sub.heading}</span>
                              </h4>
                              <div className="space-y-2 text-neutral-300 leading-relaxed font-sans pl-1 sm:pl-3 border-l-2 border-white/5">
                                {sub.paragraphs.map((p: string, pIdx: number) => (
                                  <p key={pIdx}>{p}</p>
                                ))}
                              </div>
                            </div>
                          ))}
                        </div>
                      </article>
                    ))}
                  </div>
                </section>
              ))
            )}
          </main>
        </div>

        {/* Bottom Navigation & Contact Desk */}
        <div className="p-6 sm:p-8 rounded-3xl bg-[#080a10] border border-amber-500/20 text-left space-y-4">
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div>
              <h3 className="text-base font-bold text-white">Dedicated Minor &amp; Parental Privacy Desk</h3>
              <p className="text-xs text-neutral-400 font-mono mt-1">
                For consent verification, subject rights, or grievance redressal under DPDP Rules 2025:
              </p>
            </div>
            <div className="flex items-center gap-3">
              <a
                href="mailto:privacy@zenvitra.xyz"
                className="px-4 py-2 rounded-xl bg-amber-500/15 border border-amber-500/30 text-amber-300 text-xs font-mono font-bold hover:bg-amber-500/25 transition"
              >
                privacy@zenvitra.xyz
              </a>
              <Link
                href="/terms/minor"
                className="px-4 py-2 rounded-xl bg-white/10 border border-white/15 text-white text-xs font-mono hover:bg-white/15 transition flex items-center gap-1.5"
              >
                <span>Minor Terms</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>
          </div>
        </div>

      </div>

      <Footer />
    </div>
  );
}
