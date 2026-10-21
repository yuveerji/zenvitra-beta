'use client';

import React, { Suspense } from 'react';
import Link from 'next/link';
import { ArrowLeft, Video, ShieldCheck, Crown } from 'lucide-react';
import { StaffCallWorkspace } from '@/components/calls/StaffCallWorkspace';

export default function CoreTeamCallsPage() {
  return (
    <div className="min-h-screen bg-[#030407] text-white p-4 sm:p-6 lg:p-8 space-y-6">
      
      {/* Top Breadcrumb & Navigation Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-white/10 pb-4">
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
            <Video className="w-4 h-4 text-cyan-400" />
            <span>ZEN.CALL Operations Desk</span>
          </span>
        </div>

        <div className="flex items-center gap-3">
          <Link
            href="/zen-vault-root/calls"
            className="px-3 py-1.5 rounded-xl bg-amber-500/15 hover:bg-amber-500/25 border border-amber-500/30 text-amber-300 font-mono text-xs font-bold transition flex items-center gap-1.5"
          >
            <Crown className="w-3.5 h-3.5" />
            <span>Founder Oversight</span>
          </Link>

          <div className="flex items-center gap-2 font-mono text-[11px] text-neutral-400">
            <ShieldCheck className="w-4 h-4 text-emerald-400" />
            <span>Active Operational Zone</span>
          </div>
        </div>
      </div>

      <Suspense fallback={<div className="p-8 text-neutral-500 font-mono text-xs">Loading Calling Operations Desk...</div>}>
        <StaffCallWorkspace />
      </Suspense>
    </div>
  );
}
