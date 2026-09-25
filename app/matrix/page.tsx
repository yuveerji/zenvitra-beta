'use client';

import React from 'react';
import Link from 'next/link';
import { ArrowLeft, Sparkles, FileSpreadsheet, Layers, ShieldCheck } from 'lucide-react';
import { Navbar } from '@/components/layout/Navbar';
import { Footer } from '@/components/layout/Footer';
import { PortfolioMatrixView } from '@/components/mun/PortfolioMatrixView';

export default function MatrixPage() {
  return (
    <div className="min-h-screen bg-[#030712] text-neutral-100 flex flex-col selection:bg-cyan-500 selection:text-black font-sans">
      <Navbar />

      <main className="flex-1 max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8 pt-28 pb-20 space-y-8">
        {/* Navigation Breadcrumb */}
        <div className="flex flex-wrap items-center justify-between gap-4">
          <Link
            href="/zen-diplomacy"
            className="inline-flex items-center gap-2 text-xs font-mono text-cyan-400 hover:text-cyan-300 transition group"
          >
            <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
            <span>Back to ZEN.DIPLOMACY Portal</span>
          </Link>

          <div className="flex items-center gap-2">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-cyan-500/10 border border-cyan-500/20 text-cyan-400 font-mono text-xs">
              <ShieldCheck className="w-3.5 h-3.5" />
              <span>Official 2026 Allocations</span>
            </span>
          </div>
        </div>

        {/* Matrix Header Banner */}
        <div className="rounded-3xl p-6 sm:p-10 bg-gradient-to-r from-[#0c1424] via-[#080d1a] to-[#0d1627] border border-cyan-500/30 relative overflow-hidden shadow-2xl">
          <div className="absolute top-0 right-0 w-96 h-96 bg-cyan-500/10 rounded-full blur-[120px] pointer-events-none" />
          
          <div className="relative z-10 max-w-3xl space-y-3">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/15 border border-emerald-500/30 text-emerald-300 font-mono text-[11px] font-bold uppercase tracking-wider">
              <Sparkles className="w-3.5 h-3.5 text-emerald-400" />
              <span>Live In-App Interactive Matrix &bull; Real-Time Allotment Ledger</span>
            </div>
            
            <h1 className="font-display font-extrabold text-3xl sm:text-5xl text-white tracking-tight">
              Committee Portfolio Matrix
            </h1>
            
            <p className="text-neutral-300 text-sm sm:text-base font-light leading-relaxed">
              Explore open ministerial portfolios, member states, and stakeholder seats across <strong>AIPPM</strong>, <strong>Education Ministry of India (EMI)</strong>, <strong>UNSC</strong>, and <strong>UNODC</strong>. Track allotments, submit delegate preferences, and view live status updates.
            </p>
          </div>
        </div>

        {/* Interactive In-App Portfolio Matrix Component */}
        <PortfolioMatrixView standalone={true} />
      </main>

      <Footer />
    </div>
  );
}
