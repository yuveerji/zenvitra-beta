'use client';

import React, { Suspense } from 'react';
import { ZenDocsClient } from '@/components/docs/ZenDocsClient';

export default function PlatformLegislatePage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-[#06080e]" />}>
      <ZenDocsClient initialMode="legislate" initialCommittee="lok_sabha" />
    </Suspense>
  );
}
