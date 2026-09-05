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
  Flame,
  Globe2,
  Terminal,
  Radio,
  CheckCircle2,
  Lock
} from 'lucide-react';
import { Navbar } from '@/components/layout/Navbar';
import { Footer } from '@/components/layout/Footer';
import { useReaderTheme } from '@/hooks/useReaderTheme';
import { ReaderThemeToggle } from '@/components/ui/ReaderThemeToggle';
import {
  TERMS_OF_SERVICE_DATA,
  LegalSection,
  LegalSubsection
} from '@/lib/legalData';

export default function TermsOfServicePage() {
  const { isLight, toggleTheme } = useReaderTheme();
  const [searchQuery, setSearchQuery] = useState('');
  const [activeSectionId, setActiveSectionId] = useState<string>('1');

  // Filter sections based on search
  const filteredSections = useMemo(() => {
    if (!searchQuery.trim()) return TERMS_OF_SERVICE_DATA;
    const query = searchQuery.toLowerCase();

    return TERMS_OF_SERVICE_DATA.filter((sec: LegalSection) => {
      const matchesTitle = sec.title.toLowerCase().includes(query);
      const matchesSubsections = sec.subsections.some(
        (sub: LegalSubsection) =>
          sub.heading.toLowerCase().includes(query) ||
          sub.paragraphs.some((p: string) => p.toLowerCase().includes(query))
      );
      return matchesTitle || matchesSubsections;
    });
  }, [searchQuery]);

  // Ref to the sidebar navigation container to auto-scroll active items into view
  const sidebarNavRef = useRef<HTMLElement | null>(null);
  const isClickScrollingRef = useRef(false);

  // Sync active section on scroll using IntersectionObserver
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
          if (targetId && targetId.startsWith('section-')) {
            setActiveSectionId(targetId.replace('section-', ''));
          }
        }
      },
      {
        rootMargin: '-10% 0px -70% 0px',
        threshold: [0, 0.1, 0.25, 0.5]
      }
    );

    TERMS_OF_SERVICE_DATA.forEach((sec) => {
      const el = document.getElementById(`section-${sec.id}`);
      if (el) observer.observe(el);
    });

    return () => observer.disconnect();
  }, [filteredSections]);

  // Auto-scroll the sidebar item into view inside the sticky container when activeSectionId changes
  useEffect(() => {
    if (!sidebarNavRef.current) return;
    const activeItem = sidebarNavRef.current.querySelector(`[data-section-id="${activeSectionId}"]`) as HTMLElement | null;
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
        ? 'bg-[#fcfaf7] text-stone-900 selection:bg-cyan-200 selection:text-cyan-950' 
        : 'bg-[#030405] text-neutral-300 selection:bg-white selection:text-black'
    }`}>
      <Navbar />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 w-full space-y-12">
        {/* Header Banner */}
        <div className={`space-y-4 border-b pb-8 text-left ${isLight ? 'border-stone-200' : 'border-white/10'}`}>
          <div className="flex flex-wrap items-center gap-2">
            <div className={`inline-flex items-center gap-2 px-3 py-1 rounded-full font-mono text-[10px] uppercase font-bold tracking-wider ${
              isLight ? 'bg-stone-100 border border-stone-300 text-stone-800' : 'bg-white/10 border border-white/20 text-white'
            }`}>
              <Scale className="w-3.5 h-3.5" />
              <span>INTERMEDIARY RULES 2021/2026 // DIGITAL PROTOCOL COVENANT</span>
            </div>
            <span className={`text-[11px] font-mono px-2.5 py-1 rounded-full border ${
              isLight ? 'bg-stone-50 border-stone-200 text-stone-500' : 'bg-white/5 border-white/10 text-neutral-400'
            }`}>
              46 Sections &bull; Full Ecosystem Covenant &bull; Binding Legal Terms
            </span>
          </div>

          <h1 className={`text-3xl sm:text-5xl font-black font-display tracking-tight leading-tight ${
            isLight ? 'text-stone-950' : 'text-white'
          }`}>
            ZENVITRA TERMS OF SERVICE
          </h1>

          <p className={`text-sm sm:text-base max-w-3xl leading-relaxed ${
            isLight ? 'text-stone-600' : 'text-neutral-300'
          }`}>
            These Terms of Service constitute a legally binding agreement between you and [LEGAL ENTITY NAME], governing your access and usage across all <strong className={isLight ? 'text-stone-950' : 'text-white'}>ZENVITRA</strong> ecosystem technologies.
          </p>

          {/* Mandatory Secular & Civic Charter Callout */}
          <div className={`p-5 rounded-2xl border space-y-3 font-sans ${
            isLight ? 'bg-cyan-50/70 border-cyan-200' : 'bg-cyan-500/[0.04] border-cyan-500/25'
          }`}>
            <div className={`flex items-center gap-2 font-bold font-mono text-xs uppercase ${
              isLight ? 'text-cyan-800' : 'text-cyan-300'
            }`}>
              <Shield className="w-4 h-4 text-cyan-600" />
              <span>MANDATORY PROTOCOL TENET: STRICT SECULAR &amp; CIVIC CHARTER</span>
            </div>
            <p className={`text-xs sm:text-sm leading-relaxed ${
              isLight ? 'text-stone-800' : 'text-zinc-200'
            }`}>
              <strong>ZENVITRA is strictly a civic innovation, youth policy deliberation, grassroots action, science, and independent journalism ecosystem.</strong> This platform is <strong>NOT a space to spread, promote, or proselytize ANY religion, nor is it a space to spread anti-religious vitriol or sectarian hostility</strong>.
            </p>
            <div className={`grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs font-mono ${
              isLight ? 'text-stone-600' : 'text-zinc-400'
            }`}>
              <div className={`p-3 rounded-xl border space-y-1 ${
                isLight ? 'bg-white border-stone-200' : 'bg-black/40 border-white/5'
              }`}>
                <span className={`font-bold block ${isLight ? 'text-stone-900' : 'text-white'}`}>&bull; Zero Devotional Spam:</span>
                <p>Posting devotional clickbait, prayer chains, or religious scripture forwards across channels is strictly prohibited.</p>
              </div>
              <div className={`p-3 rounded-xl border space-y-1 ${
                isLight ? 'bg-white border-stone-200' : 'bg-black/40 border-white/5'
              }`}>
                <span className={`font-bold block ${isLight ? 'text-stone-900' : 'text-white'}`}>&bull; Zero Culture Wars:</span>
                <p>Using Zenvitra dispatches, FLUX streams, or Chat relays to debate religious dogmas or denigrate beliefs results in immediate purge.</p>
              </div>
            </div>
          </div>
        </div>

        {/* Search & Action Bar */}
        <div className={`flex flex-col sm:flex-row items-center justify-between gap-4 p-4 rounded-2xl border ${
          isLight ? 'bg-white border-stone-200 shadow-sm' : 'bg-white/[0.03] border-white/10'
        }`}>
          <div className="relative w-full sm:w-96">
            <Search className={`w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 ${isLight ? 'text-stone-400' : 'text-neutral-500'}`} />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search Terms (e.g. MUN, Content, Liability, AI, Payments)..."
              className={`w-full pl-10 pr-4 py-2 rounded-xl text-xs font-mono focus:outline-none transition ${
                isLight 
                  ? 'bg-stone-50 border border-stone-300 text-stone-900 placeholder:text-stone-400 focus:border-cyan-600' 
                  : 'bg-black border border-white/15 text-white placeholder-neutral-500 focus:border-cyan-400'
              }`}
            />
          </div>

          <div className="flex items-center gap-3 w-full sm:w-auto justify-end">
            <ReaderThemeToggle isLight={isLight} onToggle={toggleTheme} />

            <button
              onClick={handlePrint}
              className={`inline-flex items-center gap-1.5 px-3 py-2 rounded-xl border text-xs font-mono transition cursor-pointer ${
                isLight ? 'bg-stone-100 hover:bg-stone-200 border-stone-300 text-stone-700' : 'bg-white/5 hover:bg-white/10 border-white/10 text-neutral-300'
              }`}
              title="Print Terms"
            >
              <Printer className="w-3.5 h-3.5" />
              <span>Print</span>
            </button>
            <Link
              href="/privacy"
              className={`inline-flex items-center gap-1.5 px-4 py-2 rounded-xl border text-xs font-mono transition ${
                isLight 
                  ? 'bg-emerald-50 hover:bg-emerald-100 border-emerald-300 text-emerald-900' 
                  : 'bg-emerald-500/10 hover:bg-emerald-500/20 border-emerald-500/30 text-emerald-300'
              }`}
            >
              <span>Privacy Policy</span>
              <ChevronRight className="w-3.5 h-3.5" />
            </Link>
          </div>
        </div>

        {/* Document Body: Table of Contents + Section Stream */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 text-left">
          {/* Sticky Table of Contents (Desktop) */}
          <aside className="hidden lg:block lg:col-span-3 self-start sticky top-24 z-20 space-y-3 max-h-[calc(100vh-7rem)] overflow-y-auto pr-2 custom-scrollbar text-xs font-mono">
            <div className={`text-[10px] uppercase font-bold tracking-wider px-2 ${
              isLight ? 'text-stone-400' : 'text-neutral-400'
            }`}>
              SECTIONS (1 &ndash; 46)
            </div>
            <nav 
              ref={sidebarNavRef}
              className="space-y-1"
            >
              {TERMS_OF_SERVICE_DATA.map((sec: LegalSection) => {
                const isActive = activeSectionId === sec.id;
                return (
                  <a
                    key={sec.id}
                    href={`#section-${sec.id}`}
                    data-section-id={sec.id}
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
                          ? 'bg-cyan-50 text-cyan-900 border border-cyan-300 font-bold shadow-xs ring-1 ring-cyan-400/40'
                          : 'bg-cyan-500/20 text-cyan-300 border border-cyan-400/50 font-bold shadow-md ring-1 ring-cyan-400/40'
                        : isLight
                          ? 'text-stone-600 hover:text-stone-900 hover:bg-stone-100'
                          : 'text-neutral-400 hover:text-white hover:bg-white/5'
                    }`}
                  >
                    <span className="truncate">{sec.title}</span>
                  </a>
                );
              })}
            </nav>
          </aside>

          {/* Main Terms Sections Stream */}
          <main className="lg:col-span-9 space-y-8">
            {filteredSections.length === 0 ? (
              <div className={`p-12 text-center rounded-3xl border space-y-3 ${
                isLight ? 'bg-white border-stone-200' : 'bg-white/[0.02] border-white/10'
              }`}>
                <p className={`text-sm font-mono ${isLight ? 'text-stone-600' : 'text-neutral-400'}`}>
                  No terms found matching &ldquo;{searchQuery}&rdquo;
                </p>
                <button
                  onClick={() => setSearchQuery('')}
                  className={`px-4 py-1.5 rounded-xl text-xs font-mono transition cursor-pointer ${
                    isLight ? 'bg-stone-100 hover:bg-stone-200 text-stone-800' : 'bg-white/10 text-white hover:bg-white/20'
                  }`}
                >
                  Clear Search
                </button>
              </div>
            ) : (
              filteredSections.map((sec: LegalSection) => (
                <article
                  key={sec.id}
                  id={`section-${sec.id}`}
                  className={`p-6 sm:p-8 rounded-2xl border space-y-4 shadow-xs scroll-mt-28 ${
                    isLight ? 'bg-white border-stone-200' : 'bg-[#07080d] border-white/10'
                  }`}
                >
                  <div className={`border-b pb-3 flex items-center justify-between ${
                    isLight ? 'border-stone-100' : 'border-white/10'
                  }`}>
                    <h2 className={`text-base sm:text-lg font-bold font-mono tracking-wide ${
                      isLight ? 'text-stone-950' : 'text-white'
                    }`}>
                      {sec.title}
                    </h2>
                    <span className={`text-[10px] font-mono px-2 py-0.5 rounded ${
                      isLight ? 'bg-stone-100 text-stone-600' : 'bg-white/5 text-neutral-400'
                    }`}>
                      CLAUSE {sec.sectionNumber}
                    </span>
                  </div>

                  <div className={`space-y-4 text-xs sm:text-sm font-sans leading-relaxed ${
                    isLight ? 'text-stone-700' : 'text-neutral-300'
                  }`}>
                    {sec.subsections.map((sub: LegalSubsection, idx: number) => (
                      <div key={idx} className={`space-y-1.5 pl-3 border-l-2 ${
                        isLight ? 'border-stone-200' : 'border-white/10'
                      }`}>
                        <h3 className={`font-mono text-xs font-semibold ${
                          isLight ? 'text-stone-900' : 'text-neutral-200'
                        }`}>
                          {sub.number} {sub.heading}
                        </h3>
                        {sub.paragraphs.map((p: string, pIdx: number) => (
                          <p key={pIdx} className={`whitespace-pre-line leading-relaxed ${
                            isLight ? 'text-stone-600' : 'text-neutral-400'
                          }`}>
                            {p}
                          </p>
                        ))}
                      </div>
                    ))}
                  </div>
                </article>
              ))
            )}
          </main>
        </div>
      </div>

      <Footer />
    </div>
  );
}
