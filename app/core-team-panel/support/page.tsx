'use client';

import React, { Suspense } from 'react';
import Link from 'next/link';
import { ArrowLeft, LifeBuoy, ShieldCheck } from 'lucide-react';
import { StaffSupportWorkspace } from '@/components/support/StaffSupportWorkspace';

export default function CoreTeamSupportPage() {
  return (
    <div className="min-h-screen bg-[#030407] text-white p-4 sm:p-6 lg:p-8 space-y-6">
      
      {/* Top Breadcrumb */}
      <div className="flex items-center justify-between border-b border-white/10 pb-4">
        <div className="flex items-center gap-3">
          <Link
            href="/core-team-panel"
            className="p-2 rounded-xl bg-white/5 hover:bg-white/10 text-neutral-400 hover:text-white transition flex items-center gap-1.5 font-mono text-xs"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Core Team Panel</span>
          </Link>
          <span className="text-neutral-600">/</span>
          <span className="font-mono text-xs text-cyan-300 font-bold flex items-center gap-1.5">
            <LifeBuoy className="w-4 h-4 text-cyan-400" />
            <span>ZEN.SUPPORT Operations Desk</span>
          </span>
        </div>

        <div className="flex items-center gap-2 font-mono text-[11px] text-neutral-400">
          <ShieldCheck className="w-4 h-4 text-emerald-400" />
          <span>Restricted Operational Zone</span>
        </div>
      </div>

      <Suspense fallback={<div className="p-8 text-neutral-500 font-mono text-xs">Loading Support Operations Desk...</div>}>
        <StaffSupportWorkspace />
      </Suspense>
    </div>
  );
}
