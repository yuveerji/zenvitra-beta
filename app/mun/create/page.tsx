'use client';

import React, { Suspense } from 'react';
import ZenMunMasterDais from '@/components/mun/zenmun/ZenMunMasterDais';

export const dynamic = 'force-dynamic';

export default function MunCreateSessionPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen bg-[#08090C] flex items-center justify-center font-serif text-white">
          <div className="flex flex-col items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-[#C5A46D] to-[#9E7D47] text-[#08090C] font-black flex items-center justify-center animate-pulse shadow-[0_0_20px_rgba(197,164,109,0.3)]">
              🏛️
            </div>
            <span className="text-xs font-mono font-bold uppercase tracking-wider text-[#C5A46D]">
              Loading Chamber Architect Studio...
            </span>
          </div>
        </div>
      }
    >
      <ZenMunMasterDais initialView="setup" />
    </Suspense>
  );
}
