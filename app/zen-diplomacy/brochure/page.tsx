'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { 
  Printer, 
  ChevronLeft, 
  ChevronRight, 
  ExternalLink, 
  Maximize2, 
  FileText, 
  LayoutList, 
  Sparkles,
  ArrowUpRight,
  Shield,
  Award,
  Globe2,
  Users,
  CheckCircle2
} from 'lucide-react';

export default function ZenDiplomacyBrochurePage() {
  const [viewMode, setViewMode] = useState<'continuous' | 'deck'>('continuous');
  const [currentSlide, setCurrentSlide] = useState(0);

  // Keyboard navigation for deck mode
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (viewMode !== 'deck') return;
      if (e.key === 'ArrowRight' || e.key === 'PageDown' || e.key === ' ') {
        e.preventDefault();
        setCurrentSlide((prev) => Math.min(prev + 1, 11));
      } else if (e.key === 'ArrowLeft' || e.key === 'PageUp') {
        e.preventDefault();
        setCurrentSlide((prev) => Math.max(prev - 1, 0));
      } else if (e.key === 'Home') {
        e.preventDefault();
        setCurrentSlide(0);
      } else if (e.key === 'End') {
        e.preventDefault();
        setCurrentSlide(11);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [viewMode]);

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="min-h-screen bg-[#030407] text-white selection:bg-[#e2f952] selection:text-black">
      {/* ── TOP FLOATING CONTROL BAR ── */}
      <div className="print:hidden sticky top-0 z-50 w-full backdrop-blur-xl bg-[#07090e]/85 border-b border-white/10 px-4 sm:px-8 py-3.5 flex flex-wrap items-center justify-between gap-4 shadow-2xl">
        <div className="flex items-center gap-3">
          <Link 
            href="/zen-diplomacy" 
            className="flex items-center gap-2 text-xs font-mono font-semibold tracking-wider text-slate-400 hover:text-white transition-colors uppercase py-1.5 px-3 rounded-lg hover:bg-white/5 border border-transparent hover:border-white/10"
          >
            <ChevronLeft className="w-4 h-4" />
            Back to Portal
          </Link>
          <div className="h-4 w-px bg-white/15" />
          <div className="flex items-center gap-2.5">
            <img 
              src="/assets/logo.png" 
              alt="ZENVITRA Logo" 
              className="w-5 h-5 object-contain"
            />
            <img 
              src="/assets/brochure/zenvitra-seal.png" 
              alt="ZENVITRA Official Seal" 
              className="w-6 h-6 rounded-full border border-[#e2f952]/40 object-cover shadow-sm"
            />
            <span className="text-xs sm:text-sm font-bold tracking-tight font-sans text-white">
              ZEN.DIPLOMACY 2026 <span className="text-[#e2f952] font-mono text-xs ml-1 font-normal uppercase">Official Prospectus</span>
            </span>
          </div>
        </div>

        <div className="flex items-center gap-2 sm:gap-3">
          {/* Mode Switcher */}
          <div className="flex items-center bg-black/50 border border-white/10 rounded-full p-0.5 text-xs font-mono">
            <button
              onClick={() => setViewMode('continuous')}
              className={`px-3 py-1.5 rounded-full transition-all flex items-center gap-1.5 ${
                viewMode === 'continuous' 
                  ? 'bg-white/15 text-white font-bold shadow-sm' 
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              <LayoutList className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">All Pages</span>
            </button>
            <button
              onClick={() => setViewMode('deck')}
              className={`px-3 py-1.5 rounded-full transition-all flex items-center gap-1.5 ${
                viewMode === 'deck' 
                  ? 'bg-[#e2f952] text-black font-bold shadow-sm' 
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              <Maximize2 className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Deck Mode</span>
            </button>
          </div>

          {/* Deck Controls (if in deck mode) */}
          {viewMode === 'deck' && (
            <div className="flex items-center gap-1 bg-black/50 border border-white/10 rounded-full px-2 py-1 text-xs font-mono">
              <button 
                onClick={() => setCurrentSlide((prev) => Math.max(prev - 1, 0))}
                disabled={currentSlide === 0}
                className="p-1 rounded-full hover:bg-white/10 disabled:opacity-30 disabled:hover:bg-transparent"
                title="Previous Page (Left Arrow)"
              >
                <ChevronLeft className="w-4 h-4" />
              </button>
              <span className="px-2 text-slate-300 font-semibold">
                {String(currentSlide + 1).padStart(2, '0')} / 14
              </span>
              <button 
                onClick={() => setCurrentSlide((prev) => Math.min(prev + 1, 13))}
                disabled={currentSlide === 13}
                className="p-1 rounded-full hover:bg-white/10 disabled:opacity-30 disabled:hover:bg-transparent"
                title="Next Page (Right Arrow)"
              >
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          )}

          {/* Print / Save PDF */}
          <button
            onClick={handlePrint}
            className="inline-flex items-center gap-2 bg-white/10 hover:bg-white/20 text-white text-xs font-mono font-bold px-3.5 py-1.5 rounded-full border border-white/15 transition-all shadow-sm hover:border-[#e2f952]/40"
            title="Export or print entire document to PDF"
          >
            <Printer className="w-3.5 h-3.5 text-[#e2f952]" />
            <span>Print PDF</span>
          </button>

          {/* Secretariat Link */}
          <Link
            href="/zen-diplomacy/secretariat"
            className="hidden md:inline-flex items-center gap-1.5 bg-white/10 hover:bg-white/20 text-white text-xs font-sans font-bold px-3.5 py-1.5 rounded-full border border-white/15 transition-all hover:border-[#e2f952]/40"
          >
            <span>Apply Secretariat</span>
          </Link>

          {/* Portal Link */}
          <Link
            href="/zen-diplomacy"
            className="inline-flex items-center gap-1.5 bg-[#e2f952] hover:bg-[#d6f032] text-black text-xs font-sans font-bold px-4 py-1.5 rounded-full shadow-lg shadow-[#e2f952]/20 transition-all hover:scale-105"
          >
            <span>Portal</span>
            <ArrowUpRight className="w-3.5 h-3.5 stroke-[2.5]" />
          </Link>
        </div>
      </div>

      {/* ── EMBEDDED IFRAME OR DIRECT CLEAN VIEW ── */}
      <div className="w-full flex justify-center py-6 px-2 sm:px-6">
        <iframe 
          src="/zen-diplomacy-brochure.html" 
          title="ZEN.DIPLOMACY Brochure"
          className="w-full max-w-[960px] h-[calc(100vh-80px)] border-0 rounded-2xl shadow-2xl bg-black"
        />
      </div>
    </div>
  );
}
