'use client';

import React, { Suspense } from 'react';
import { ZenCommsComingSoon } from '@/components/comms/ZenCommsComingSoon';

export default function ChitsPage() {
  return (
    <Suspense fallback={<ZenCommsComingSoon appType="chits" />}>
      <ZenCommsComingSoon appType="chits" />
    </Suspense>
  );
}
