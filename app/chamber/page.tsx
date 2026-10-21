'use client';

import React, { Suspense } from 'react';
import { ZenCommsComingSoon } from '@/components/comms/ZenCommsComingSoon';

export default function ChamberPage() {
  return (
    <Suspense fallback={<ZenCommsComingSoon appType="chamber" />}>
      <ZenCommsComingSoon appType="chamber" />
    </Suspense>
  );
}
