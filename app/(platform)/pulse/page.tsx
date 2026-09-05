'use client';

import React, { Suspense } from 'react';
import { ZenPulseCore } from '@/components/pulse/ZenPulseCore';

export default function ZenPulsePlatformPage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-[#030405]" />}>
      <ZenPulseCore />
    </Suspense>
  );
}