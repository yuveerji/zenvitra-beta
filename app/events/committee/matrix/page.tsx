'use client';

import React, { Suspense } from 'react';
import DynamicMunMatrixPage from '@/app/[mun]/matrix/page';

export default function EventsCommitteeMatrixRoutePage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-[#030712] text-white flex items-center justify-center">
        <div className="text-center space-y-3 font-sans">
          <div className="w-7 h-7 rounded-full border-2 border-cyan-400 border-t-transparent animate-spin mx-auto" />
          <p className="text-xs text-neutral-400 font-sans">Loading Event Committee Matrix...</p>
        </div>
      </div>
    }>
      <DynamicMunMatrixPage />
    </Suspense>
  );
}
