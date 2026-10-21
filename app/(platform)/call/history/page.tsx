'use client';

import React, { Suspense } from 'react';
import { ZenCommsComingSoon } from '@/components/comms/ZenCommsComingSoon';

export default function CallHistoryPage() {
  return (
    <Suspense fallback={<ZenCommsComingSoon appType="call" />}>
      <ZenCommsComingSoon appType="call" />
    </Suspense>
  );
}
