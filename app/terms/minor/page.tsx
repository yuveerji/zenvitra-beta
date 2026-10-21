'use client';

import React, { useState, useMemo, useEffect, useRef } from 'react';
import Link from 'next/link';
import {
  Scale,
  Shield,
  Search,
  FileText,
  ChevronRight,
  Printer,
  AlertTriangle,
  Globe2,
  Lock,
  HeartHandshake,
  ArrowRight,
  UserCheck,
  ShieldCheck
} from 'lucide-react';
import { Navbar } from '@/components/layout/Navbar';
import { Footer } from '@/components/layout/Footer';
import { useReaderTheme } from '@/hooks/useReaderTheme';
import { ReaderThemeToggle } from '@/components/ui/ReaderThemeToggle';
import {
  MINOR_TERMS_OF_SERVICE_DATA,
  LegalSection,
  LegalSubsection
} from '@/lib/legalData';

export default function MinorTermsOfServicePage() {
  const { isLight, toggleTheme } = useReaderTheme();
  const [searchQuery, setSearchQuery] = useState('');
  const [activeSectionId, setActiveSectionId] = useState<string>('1');

  // Filter sections based on search
  const filteredSections = useMemo(() => {
    if (!searchQuery.trim()) return MINOR_TERMS_OF_SERVICE_DATA;
    const query = searchQuery.toLowerCase();

    return MINOR_TERMS_OF_SERVICE_DATA.filter((sec: LegalSection) => {
      const matchesTitle = sec.title.toLowerCase().includes(query);
      const matchesSubsections = sec.subsections.some(
        (sub: LegalSubsection) =>
          sub.heading.toLowerCase().includes(query) ||
          sub.paragraphs.some((p: string) => p.toLowerCase().includes(query))
      );
      return matchesTitle || matchesSubsections;
    });
  }, [searchQuery]);

  // Ref to the sidebar navigation container
  const sidebarNavRef = useRef<HTMLElement | null>(null);
  const isClickScrollingRef = useRef(false);

  // Sync active section on scroll
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
          if (targetId && targetId.startsWith('minor-section-')) {
            setActiveSectionId(targetId.replace('minor-section-', ''));
          }
        }
      },
      {
        rootMargin: '-10% 0px -70% 0px',
        threshold: [0, 0.1, 0.25, 0.5]
      }
    );

    MINOR_TERMS_OF_SERVICE_DATA.forEach((sec) => {
      const el = document.getElementById(`minor-section-${sec.id}`);
      if (el) observer.observe(el);
    });

    return () => observer.disconnect();
  }, [filteredSections]);

  // Auto-scroll the sidebar item into view inside the sticky container
  useEffect(() => {
    if (!sidebarNavRef.current) return;
    const activeItem = sidebarNavRef.current.querySelector(`[data-minor-section-id="${activeSectionId}"]`) as HTMLElement | null;
    if (activeItem) {
      activeItem.scrollIntoView({
        behavior: 'smooth',
        block: 'nearest',
        inline: 'nearest'
      });
    }
  }, [activeSectionId]);

  const handlePrint = () => {
    if (typeof window !== 'undefined') {
      window.print();
    }
  };

  return (
    <div className={`min-h-screen flex flex-col justify-between font-sans pt-20 sm:pt-24 transition-colors duration-200 ${
      isLight 
        ? 'bg-[#fcfaf7] text-stone-900 selection:bg-amber-200 selection:text-amber-950' 
        : 'bg-[#030405] text-neutral-300 selection:bg-amber-400 selection:text-black'
    }`}>
      <Navbar />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 w-full space-y-10">
        
        {/* Terms Switcher Tabs: Major vs Minor */}
        <div className={`flex flex-wrap items-center gap-3 p-2 rounded-2xl border ${
          isLight ? 'bg-stone-100 border-stone-200' : 'bg-[#090b10] border-white/10'
        }`}>
          <Link
            href="/terms"
            className={`flex-1 min-w-[240px] px-4 py-3 rounded-xl text-center text-xs font-mono font-medium transition flex items-center justify-center gap-2 ${
              isLight ? 'text-stone-600 hover:text-stone-900 hover:bg-white' : 'text-neutral-400 hover:text-white hover:bg-white/5'
            }`}
          >
            <Scale className="w-4 h-4 text-cyan-400" />
            <span>Standard Terms of Service (Adults 18+ &amp; Organizers)</span>
          </Link>
          <div className={`flex-1 min-w-[240px] px-4 py-3 rounded-xl text-center text-xs font-mono font-bold shadow-md flex items-center justify-center gap-2 ${
            isLight
              ? 'bg-amber-100 border border-amber-300 text-amber-900'
              : 'bg-amber-500/15 border border-amber-500/40 text-amber-300'
          }`}>
            <HeartHandshake className="w-4 h-4 text-amber-400" />
            <span>Minor Terms of Service &amp; Parental Consent Accord</span>
            <span className="text-[9px] uppercase px-1.5 py-0.5 rounded bg-amber-400/20 text-amber-400 font-black">Active</span>
          </div>
        </div>

        {/* Header Banner */}
        <div className={`space-y-4 border-b pb-8 text-left ${isLight ? 'border-stone-200' : 'border-white/10'}`}>
          <div className="flex flex-wrap items-center gap-2">
            <div className={`inline-flex items-center gap-2 px-3 py-1 rounded-full font-mono text-[10px] uppercase font-bold tracking-wider ${
              isLight ? 'bg-amber-50 border border-amber-300 text-amber-900' : 'bg-amber-500/10 border border-amber-500/30 text-amber-300'
            }`}>
              <Shield className="w-3.5 h-3.5 text-amber-500" />
              <span>UNDER-18 CIVIC ACCORD // STATUTORY GUARDIAN COMPACT</span>
            </div>
            <span className={`text-[11px] font-mono px-2.5 py-1 rounded-full border ${
              isLight ? 'bg-stone-50 border-stone-200 text-stone-500' : 'bg-white/5 border-white/10 text-neutral-400'
            }`}>
              8 Sections &bull; DPDP 2023 Statutory Harmony &bull; Legally Enforceable Compact
            </span>
          </div>

          <h1 className={`text-3xl sm:text-5xl font-black font-display tracking-tight leading-tight ${
            isLight ? 'text-stone-950' : 'text-white'
          }`}>
            MINOR TERMS OF SERVICE &amp; PARENTAL CONSENT ACCORD
          </h1>

          <p className={`text-sm sm:text-base max-w-3xl leading-relaxed ${
            isLight ? 'text-stone-600' : 'text-neutral-300'
          }`}>
            A specialized covenant governing young participants under the age of 18, their legal guardians, and their participation across <strong className={isLight ? 'text-stone-900' : 'text-white'}>ZENVITRA MUNs, writing circles, debates, and public forums</strong>.
          </p>

          <div className={`p-4 rounded-2xl border text-xs font-mono flex items-start gap-3 ${
            isLight
              ? 'bg-amber-50/70 border-amber-200 text-amber-900'
              : 'bg-amber-500/[0.04] border-amber-500/20 text-amber-200/90'
          }`}>
            <AlertTriangle className="w-4 h-4 text-amber-500 shrink-0 mt-0.5" />
            <div className="space-y-1">
              <div>
                <strong className={isLight ? 'text-amber-950' : 'text-amber-300'}>Statutory Legal Compact:</strong> Under applicable Indian law (including the Indian Contract Act, 1872 and the Digital Personal Data Protection Act, 2023), minors participate under guardian sponsorship. This Accord ensures lawful representation while guaranteeing that young delegates are never deprived of their independent right to think, speak, and write.
              </div>
              <div className={isLight ? 'text-stone-600' : 'text-neutral-400'}>
                Adult delegates, dais leaders, and institutional organizers should consult the <Link href="/terms" className="underline font-bold hover:text-amber-500">Standard Terms of Service</Link>.
              </div>
            </div>
          </div>
        </div>

        {/* Quick Summary Highlights */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-left">
          <div className={`p-5 rounded-2xl border space-y-2 ${
            isLight ? 'bg-white border-stone-200' : 'bg-[#080a10] border-white/10'
          }`}>
            <div className="flex items-center gap-2 text-amber-500 font-mono text-xs font-bold uppercase">
              <UserCheck className="w-4 h-4" />
              <span>Accurate Representation</span>
            </div>
            <p className={`text-xs leading-relaxed ${isLight ? 'text-stone-600' : 'text-neutral-300'}`}>
              Users agree to provide accurate age coordinates. Age falsification to bypass guardian verification constitutes a platform violation.
            </p>
          </div>

          <div className={`p-5 rounded-2xl border space-y-2 ${
            isLight ? 'bg-white border-stone-200' : 'bg-[#080a10] border-white/10'
          }`}>
            <div className="flex items-center gap-2 text-cyan-500 font-mono text-xs font-bold uppercase">
              <Scale className="w-4 h-4" />
              <span>Freedom with Decorum</span>
            </div>
            <p className={`text-xs leading-relaxed ${isLight ? 'text-stone-600' : 'text-neutral-300'}`}>
              Being under 18 does not diminish your right to challenge arguments or debate fearlessly. Mutual respect and anti-harassment standards apply equally to all.
            </p>
          </div>

          <div className={`p-5 rounded-2xl border space-y-2 ${
            isLight ? 'bg-white border-stone-200' : 'bg-[#080a10] border-white/10'
          }`}>
            <div className="flex items-center gap-2 text-emerald-500 font-mono text-xs font-bold uppercase">
              <ShieldCheck className="w-4 h-4" />
              <span>Statutory Supremacy</span>
            </div>
            <p className={`text-xs leading-relaxed ${isLight ? 'text-stone-600' : 'text-neutral-300'}`}>
              No clause in these terms may infringe upon or waive the statutory rights granted to minors and guardians under mandatory national laws.
            </p>
          </div>
        </div>

        {/* Search, Filter & Utility Controls Bar */}
        <div className={`p-4 rounded-2xl border flex flex-col sm:flex-row items-center justify-between gap-4 ${
          isLight ? 'bg-white border-stone-200' : 'bg-[#080a10] border-white/10'
        }`}>
          <div className="relative w-full sm:max-w-md">
            <Search className="w-4 h-4 text-neutral-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search minor terms (e.g. Guardian, Events, Rights, Suspension)..."
              className={`w-full pl-10 pr-4 py-2 rounded-xl border text-xs font-mono focus:outline-none focus:border-amber-500 transition ${
                isLight 
                  ? 'bg-stone-50 border-stone-300 text-stone-900 placeholder-stone-400' 
                  : 'bg-black border-white/15 text-white placeholder-neutral-500'
              }`}
            />
          </div>

          <div className="flex items-center gap-3 w-full sm:w-auto justify-end">
            <ReaderThemeToggle isLight={isLight} onToggle={toggleTheme} />
            <button
              onClick={handlePrint}
              className={`inline-flex items-center gap-1.5 px-3 py-2 rounded-xl border text-xs font-mono transition cursor-pointer ${
                isLight 
                  ? 'bg-stone-50 hover:bg-stone-100 border-stone-300 text-stone-700' 
                  : 'bg-white/5 hover:bg-white/10 border-white/10 text-neutral-300'
              }`}
              title="Print Terms"
            >
              <Printer className="w-3.5 h-3.5" />
              <span>Print</span>
            </button>
            <Link
              href="/privacy/minor"
              className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-amber-500/10 hover:bg-amber-500/20 border border-amber-500/30 text-xs font-mono text-amber-400 transition"
            >
              <span>Minor Privacy Policy</span>
              <ChevronRight className="w-3.5 h-3.5" />
            </Link>
          </div>
        </div>

        {/* Document Body: Table of Contents + Full Terms Reader */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 text-left">
          {/* Sticky Table of Contents (Desktop) */}
          <aside className="hidden lg:block lg:col-span-3 self-start sticky top-24 z-20 space-y-3 max-h-[calc(100vh-7rem)] overflow-y-auto pr-2 custom-scrollbar text-xs font-mono">
            <div className={`text-[10px] uppercase font-bold tracking-wider px-2 ${
              isLight ? 'text-stone-500' : 'text-neutral-400'
            }`}>
              ACCORD DIRECTORY
            </div>
            <nav 
              ref={sidebarNavRef}
              className="space-y-1"
            >
              {MINOR_TERMS_OF_SERVICE_DATA.map((sec: LegalSection) => {
                const isActive = activeSectionId === sec.id;
                return (
                  <a
                    key={sec.id}
                    href={`#minor-section-${sec.id}`}
                    data-minor-section-id={sec.id}
                    onClick={() => {
                      isClickScrollingRef.current = true;
                      setActiveSectionId(sec.id);
                      setTimeout(() => {
                        isClickScrollingRef.current = false;
                      }, 1000);
                    }}
                    className={`block px-3 py-2 rounded-xl transition truncate ${
                      isActive
                        ? isLight
                          ? 'bg-amber-100 text-amber-950 border border-amber-300 font-bold shadow-sm'
                          : 'bg-amber-500/20 text-amber-300 border border-amber-400/50 font-bold shadow-md ring-1 ring-amber-400/40'
                        : isLight
                          ? 'text-stone-600 hover:text-stone-900 hover:bg-stone-100'
                          : 'text-neutral-400 hover:text-white hover:bg-white/5'
                    }`}
                  >
                    <span className="text-[10px] opacity-70 block">SECTION {sec.sectionNumber}</span>
                    <span className="truncate">{sec.title.replace(/^\d+\.\s*/, '')}</span>
                  </a>
                );
              })}
            </nav>
          </aside>

          {/* Main Legal Sections Stream */}
          <main className="lg:col-span-9 space-y-12">
            {filteredSections.length === 0 ? (
              <div className={`p-12 text-center rounded-3xl border space-y-3 ${
                isLight ? 'bg-white border-stone-200' : 'bg-[#080a10] border-white/10'
              }`}>
                <Search className="w-8 h-8 text-neutral-500 mx-auto" />
                <h3 className={`font-bold text-base ${isLight ? 'text-stone-900' : 'text-white'}`}>
                  No Matching Minor Sections Found
                </h3>
                <p className={`text-xs font-mono ${isLight ? 'text-stone-500' : 'text-neutral-400'}`}>
                  Try adjusting your search query or clear the filter.
                </p>
                <button
                  onClick={() => setSearchQuery('')}
                  className={`px-4 py-2 rounded-xl text-xs font-mono transition ${
                    isLight ? 'bg-stone-100 hover:bg-stone-200 text-stone-900' : 'bg-white/10 hover:bg-white/15 text-white'
                  }`}
                >
                  Clear Search Filter
                </button>
              </div>
            ) : (
              filteredSections.map((sec: LegalSection) => (
                <section
                  key={sec.id}
                  id={`minor-section-${sec.id}`}
                  className="space-y-6 pt-4 scroll-mt-24"
                >
                  {/* Section Title Header */}
                  <div className={`p-4 sm:p-5 rounded-2xl border-l-4 border-l-amber-500 border space-y-1 ${
                    isLight 
                      ? 'bg-amber-50/50 border-stone-200' 
                      : 'bg-gradient-to-r from-amber-500/10 via-[#0a0c14] to-black border-white/10'
                  }`}>
                    <span className="text-[11px] font-mono text-amber-500 font-bold tracking-widest uppercase">
                      SECTION {sec.sectionNumber}
                    </span>
                    <h2 className={`text-xl sm:text-2xl font-bold font-display tracking-tight ${
                      isLight ? 'text-stone-950' : 'text-white'
                    }`}>
                      {sec.title}
                    </h2>
                  </div>

                  {/* Subsections Card */}
                  <article className={`p-6 sm:p-8 rounded-3xl border space-y-6 transition shadow-sm ${
                    isLight 
                      ? 'bg-white border-stone-200 hover:border-stone-300' 
                      : 'bg-[#080a10] border-white/10 hover:border-white/20'
                  }`}>
                    <div className="space-y-6">
                      {sec.subsections.map((sub: LegalSubsection) => (
                        <div key={sub.number} className="space-y-2 text-xs sm:text-sm">
                          <h3 className={`font-mono text-xs font-bold flex items-center gap-2 ${
                            isLight ? 'text-amber-800' : 'text-amber-300'
                          }`}>
                            <span className={`px-2 py-0.5 rounded font-normal ${
                              isLight ? 'bg-stone-100 text-stone-700' : 'bg-white/5 text-neutral-300'
                            }`}>
                              {sub.number}
                            </span>
                            <span>{sub.heading}</span>
                          </h3>
                          <div className={`space-y-2 leading-relaxed font-sans pl-1 sm:pl-3 border-l-2 ${
                            isLight ? 'border-stone-200 text-stone-700' : 'border-white/5 text-neutral-300'
                          }`}>
                            {sub.paragraphs.map((p: string, pIdx: number) => (
                              <p key={pIdx}>{p}</p>
                            ))}
                          </div>
                        </div>
                      ))}
                    </div>
                  </article>
                </section>
              ))
            )}
          </main>
        </div>

        {/* Bottom Advisory */}
        <div className={`p-6 sm:p-8 rounded-3xl border text-left space-y-4 ${
          isLight ? 'bg-amber-50/50 border-amber-200' : 'bg-[#080a10] border-amber-500/20'
        }`}>
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div>
              <h3 className={`text-base font-bold ${isLight ? 'text-stone-950' : 'text-white'}`}>
                Questions Regarding Minor Participation?
              </h3>
              <p className={`text-xs font-mono mt-1 ${isLight ? 'text-stone-600' : 'text-neutral-400'}`}>
                Secretariat &amp; Parental Liaison Desk:
              </p>
            </div>
            <div className="flex items-center gap-3">
              <a
                href="mailto:support@zenvitra.xyz"
                className="px-4 py-2 rounded-xl bg-amber-500/15 border border-amber-500/30 text-amber-500 text-xs font-mono font-bold hover:bg-amber-500/25 transition"
              >
                support@zenvitra.xyz
              </a>
              <Link
                href="/privacy/minor"
                className={`px-4 py-2 rounded-xl border text-xs font-mono transition flex items-center gap-1.5 ${
                  isLight ? 'bg-stone-100 border-stone-300 text-stone-900 hover:bg-stone-200' : 'bg-white/10 border-white/15 text-white hover:bg-white/15'
                }`}
              >
                <span>Minor Privacy</span>
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
