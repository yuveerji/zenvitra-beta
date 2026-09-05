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
  CreditCard,
  Film,
  Bot,
  Newspaper,
  ExternalLink,
  Sliders,
  CheckCircle2,
  AlertCircle,
  HelpCircle,
  Clock,
  Printer
} from 'lucide-react';
import { Navbar } from '@/components/layout/Navbar';
import { Footer } from '@/components/layout/Footer';
import {
  privacyPolicyParts,
  DATA_LIFECYCLE_EXPLAINERS,
  DataLifecycleExplainer,
  LegalPart,
  LegalClause,
  LegalSubsection
} from '@/lib/legalData';

export default function PrivacyPolicyPage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [activePart, setActivePart] = useState<string>('PART I');
  const [selectedExplainer, setSelectedExplainer] = useState<DataLifecycleExplainer>(DATA_LIFECYCLE_EXPLAINERS[0]);

  // Filter clauses based on search
  const filteredParts = useMemo(() => {
    if (!searchQuery.trim()) return privacyPolicyParts;
    const query = searchQuery.toLowerCase();

    return privacyPolicyParts
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

  // Sync active part on scroll using IntersectionObserver
  useEffect(() => {
    if (typeof window === 'undefined') return;

    const observer = new IntersectionObserver(
      (entries) => {
        if (isClickScrollingRef.current) return;

        const visibleEntries = entries.filter((e) => e.isIntersecting);
        if (visibleEntries.length > 0) {
          visibleEntries.sort((a, b) => {
            return Math.abs(a.boundingClientRect.top - 120) - Math.abs(b.boundingClientRect.top - 120);
          });
          const targetId = visibleEntries[0].target.id;
          if (targetId) {
            // Find corresponding part in privacyPolicyParts
            const matched = privacyPolicyParts.find(
              (p) => p.partNumber.toLowerCase().replace(/\s+/g, '-') === targetId
            );
            if (matched) {
              setActivePart(matched.partNumber);
            }
          }
        }
      },
      {
        rootMargin: '-10% 0px -70% 0px',
        threshold: [0, 0.1, 0.25, 0.5]
      }
    );

    privacyPolicyParts.forEach((p) => {
      const el = document.getElementById(p.partNumber.toLowerCase().replace(/\s+/g, '-'));
      if (el) observer.observe(el);
    });

    return () => observer.disconnect();
  }, [filteredParts]);

  // Auto-scroll the sidebar item into view inside the sticky container when activePart changes
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
    <div className="min-h-screen bg-[#030405] text-neutral-300 flex flex-col justify-between font-sans selection:bg-white selection:text-black pt-20 sm:pt-24">
      <Navbar />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 w-full space-y-12">
        {/* Header Banner */}
        <div className="space-y-4 border-b border-white/10 pb-8 text-left">
          <div className="flex flex-wrap items-center gap-2">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 font-mono text-[10px] uppercase font-bold tracking-wider">
              <ShieldCheck className="w-3.5 h-3.5" />
              <span>MEITY DPDP RULES 2025 // IT RULES 2026 ALIGNED</span>
            </div>
            <span className="text-[11px] font-mono text-neutral-400 bg-white/5 px-2.5 py-1 rounded-full border border-white/10">
              73 Clauses &bull; 22 Parts &bull; Full Ecosystem Architecture
            </span>
          </div>

          <h1 className="text-3xl sm:text-5xl font-black font-display text-white tracking-tight leading-tight">
            ZENVITRA PRIVACY POLICY
          </h1>

          <p className="text-sm sm:text-base text-neutral-300 max-w-3xl leading-relaxed">
            A comprehensive, clause-by-clause data governance specification governing <strong className="text-white">ZEN.CHAT, ZEN.PULSE, ZEN.FLUX, International Press, ZEN.EVENTS, ZEN.MUN, ZEN.DOCS, ZEN.LEGISLATE, ZEN.PAYMENTS, ZEN.PROFILE, ZEN.CERTIFY, and ZEN AI</strong>.
          </p>

          <div className="p-4 rounded-2xl bg-amber-500/[0.04] border border-amber-500/20 text-xs font-mono text-amber-200/90 flex items-start gap-3">
            <AlertCircle className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
            <div>
              <strong className="text-amber-300">Statutory Notice:</strong> This privacy framework operates in accordance with India&apos;s Digital Personal Data Protection Act, 2023, the MeitY Digital Personal Data Protection Rules, 2025 (including verifiable parental consent and prohibition of behavioral tracking on children), and the Information Technology (Intermediary Guidelines and Digital Media Ethics Code) Rules, 2021 as amended through February 2026.
            </div>
          </div>
        </div>

        {/* Interactive Data Lifecycle Explainer: "WHY AM I SEEING THIS?" */}
        <section className="space-y-6 text-left">
          <div className="flex items-center justify-between">
            <div className="space-y-1">
              <div className="inline-flex items-center gap-1.5 text-xs font-mono text-cyan-400 uppercase tracking-wider font-semibold">
                <HelpCircle className="w-3.5 h-3.5" />
                <span>Interactive Transparency Engine</span>
              </div>
              <h2 className="text-xl sm:text-2xl font-bold font-display text-white">
                “Why Is ZENVITRA Processing This Data?”
              </h2>
            </div>
            <div className="hidden sm:flex items-center gap-2 text-xs font-mono text-neutral-400">
              <span>Purpose &rarr; Permission &rarr; Access &rarr; Security &rarr; Retention &rarr; Deletion</span>
            </div>
          </div>

          {/* Lifecycle Product Selector Tabs */}
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-2">
            {DATA_LIFECYCLE_EXPLAINERS.map((ex: DataLifecycleExplainer) => (
              <button
                key={ex.id}
                onClick={() => setSelectedExplainer(ex)}
                className={`p-3 rounded-2xl border text-left transition-all cursor-pointer ${
                  selectedExplainer.id === ex.id
                    ? 'bg-cyan-500/15 border-cyan-500/40 text-white shadow-lg'
                    : 'bg-[#080a10] border-white/10 text-neutral-400 hover:text-white hover:border-white/20'
                }`}
              >
                <span className="text-[10px] font-mono block text-cyan-400 font-bold uppercase">{ex.product}</span>
                <span className="text-xs font-bold block truncate mt-0.5">{ex.title}</span>
              </button>
            ))}
          </div>

          {/* Active Explainer Card */}
          <div className="p-6 sm:p-8 rounded-3xl bg-gradient-to-br from-[#0c0e16] to-[#06070a] border border-cyan-500/25 space-y-6">
            <div className="flex flex-wrap items-center justify-between gap-3 border-b border-white/10 pb-4">
              <div>
                <span className="text-[10px] font-mono text-cyan-400 uppercase tracking-widest font-bold">
                  {selectedExplainer.product} DATA LIFECYCLE
                </span>
                <h3 className="text-xl font-bold text-white mt-0.5">{selectedExplainer.title}</h3>
              </div>
              <span className="px-3 py-1 rounded-full bg-cyan-500/10 border border-cyan-500/30 text-cyan-300 text-xs font-mono">
                {selectedExplainer.legalBasis}
              </span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs font-mono">
              <div className="p-4 rounded-2xl bg-black/50 border border-white/10 space-y-1.5">
                <span className="text-neutral-400 uppercase text-[10px] flex items-center gap-1.5">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                  1. Purpose of Processing
                </span>
                <p className="text-neutral-200 font-sans text-xs leading-relaxed">{selectedExplainer.purpose}</p>
              </div>

              <div className="p-4 rounded-2xl bg-black/50 border border-white/10 space-y-1.5">
                <span className="text-neutral-400 uppercase text-[10px] flex items-center gap-1.5">
                  <Lock className="w-3.5 h-3.5 text-amber-400" />
                  2. Permission Boundary
                </span>
                <p className="text-neutral-200 font-sans text-xs leading-relaxed">{selectedExplainer.permission}</p>
              </div>

              <div className="p-4 rounded-2xl bg-black/50 border border-white/10 space-y-1.5">
                <span className="text-neutral-400 uppercase text-[10px] flex items-center gap-1.5">
                  <Sliders className="w-3.5 h-3.5 text-cyan-400" />
                  3. Who Can Access This
                </span>
                <p className="text-neutral-200 font-sans text-xs leading-relaxed">{selectedExplainer.access}</p>
              </div>

              <div className="p-4 rounded-2xl bg-black/50 border border-white/10 space-y-1.5">
                <span className="text-neutral-400 uppercase text-[10px] flex items-center gap-1.5">
                  <ShieldCheck className="w-3.5 h-3.5 text-purple-400" />
                  4. Security Safeguards
                </span>
                <p className="text-neutral-200 font-sans text-xs leading-relaxed">{selectedExplainer.security}</p>
              </div>

              <div className="p-4 rounded-2xl bg-black/50 border border-white/10 space-y-1.5">
                <span className="text-neutral-400 uppercase text-[10px] flex items-center gap-1.5">
                  <Clock className="w-3.5 h-3.5 text-blue-400" />
                  5. Retention Period
                </span>
                <p className="text-neutral-200 font-sans text-xs leading-relaxed">{selectedExplainer.retention}</p>
              </div>

              <div className="p-4 rounded-2xl bg-black/50 border border-white/10 space-y-1.5">
                <span className="text-neutral-400 uppercase text-[10px] flex items-center gap-1.5">
                  <Scale className="w-3.5 h-3.5 text-rose-400" />
                  6. Erasure &amp; Deletion
                </span>
                <p className="text-neutral-200 font-sans text-xs leading-relaxed">{selectedExplainer.deletion}</p>
              </div>
            </div>
          </div>
        </section>

        {/* Search & Actions Bar */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 p-4 rounded-2xl bg-white/[0.03] border border-white/10">
          <div className="relative w-full sm:w-96">
            <Search className="w-4 h-4 text-neutral-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search clauses (e.g. MUN, AI, DPDP, Children, Chat, Retention)..."
              className="w-full pl-10 pr-4 py-2 rounded-xl bg-black border border-white/15 text-xs text-white placeholder-neutral-500 focus:outline-none focus:border-emerald-400 font-mono"
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
              href="/terms"
              className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-white/10 hover:bg-white/15 border border-white/20 text-xs font-mono text-white transition"
            >
              <span>Terms of Service</span>
              <ChevronRight className="w-3.5 h-3.5" />
            </Link>
          </div>
        </div>

        {/* Document Body: Table of Contents + Clause-by-Clause Reader */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 text-left">
          {/* Sticky Table of Contents (Desktop) */}
          <aside className="hidden lg:block lg:col-span-3 self-start sticky top-24 z-20 space-y-3 max-h-[calc(100vh-7rem)] overflow-y-auto pr-2 custom-scrollbar text-xs font-mono">
            <div className="text-[10px] uppercase text-neutral-400 font-bold tracking-wider px-2">
              TABLE OF CONTENTS
            </div>
            <nav 
              ref={sidebarNavRef}
              className="space-y-1"
            >
              {privacyPolicyParts.map((p: LegalPart) => {
                const isActive = activePart === p.partNumber;
                return (
                  <a
                    key={p.partNumber}
                    href={`#${p.partNumber.toLowerCase().replace(/\s+/g, '-')}`}
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
                        ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-400/50 font-bold shadow-md ring-1 ring-emerald-400/40'
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
              <div className="p-12 text-center rounded-3xl bg-white/[0.02] border border-white/10 space-y-3">
                <p className="text-neutral-400 text-sm font-mono">No clauses found matching &ldquo;{searchQuery}&rdquo;</p>
                <button
                  onClick={() => setSearchQuery('')}
                  className="px-4 py-1.5 rounded-xl bg-white/10 text-white text-xs font-mono hover:bg-white/20 transition cursor-pointer"
                >
                  Clear Search
                </button>
              </div>
            ) : (
              filteredParts.map((part: LegalPart) => (
                <section
                  key={part.partNumber}
                  id={part.partNumber.toLowerCase().replace(/\\s+/g, '-')}
                  className="space-y-6 pt-4 scroll-mt-28"
                >
                  {/* Part Header */}
                  <div className="border-b border-white/15 pb-3">
                    <span className="text-xs font-mono font-bold text-emerald-400 tracking-wider">
                      {part.partNumber}
                    </span>
                    <h2 className="text-xl sm:text-2xl font-bold font-display text-white tracking-tight mt-0.5">
                      {part.partTitle}
                    </h2>
                  </div>

                  {/* Clauses in Part */}
                  <div className="space-y-6">
                    {part.clauses.map((clause: LegalClause) => (
                      <div
                        key={clause.id}
                        id={`clause-${clause.id}`}
                        className="p-6 rounded-2xl bg-[#07080d] border border-white/10 space-y-4 shadow-sm"
                      >
                        <h3 className="text-base font-bold font-mono text-white tracking-wide flex items-center justify-between">
                          <span>{clause.title}</span>
                          <span className="text-[10px] text-neutral-400 font-normal px-2 py-0.5 rounded bg-white/5">
                            § {clause.id}
                          </span>
                        </h3>

                        <div className="space-y-4 text-xs sm:text-sm text-neutral-300 font-sans leading-relaxed">
                          {clause.subsections.map((sub: LegalSubsection, idx: number) => (
                            <div key={idx} className="space-y-1.5 pl-3 border-l-2 border-white/10">
                              <h4 className="font-mono text-xs font-semibold text-neutral-200">
                                {sub.number} {sub.heading}
                              </h4>
                              {sub.paragraphs.map((p: string, pIdx: number) => (
                                <p key={pIdx} className="text-neutral-400 whitespace-pre-line leading-relaxed">
                                  {p}
                                </p>
                              ))}
                            </div>
                          ))}
                        </div>
                      </div>
                    ))}
                  </div>
                </section>
              ))
            )}
          </main>
        </div>
      </div>

      <Footer />
    </div>
  );
}
