'use client';

import React, { Suspense } from 'react';
import ZenMunMasterDais from '@/components/mun/zenmun/ZenMunMasterDais';

export const dynamic = 'force-dynamic';

export default function CommitteeCreatePage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen bg-[#ede8df] flex items-center justify-center font-serif text-[#2d2822]">
          <div className="flex flex-col items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-[#1b3d29] text-white flex items-center justify-center animate-pulse">
              🏛️
            </div>
            <span className="text-xs font-mono font-bold uppercase tracking-wider text-[#8c7860]">
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
