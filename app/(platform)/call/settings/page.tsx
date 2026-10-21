'use client';

import React, { Suspense } from 'react';
import { ZenCommsComingSoon } from '@/components/comms/ZenCommsComingSoon';

export default function CallSettingsPage() {
  return (
    <Suspense fallback={<ZenCommsComingSoon appType="call" />}>
      <ZenCommsComingSoon appType="call" />
    </Suspense>
  );
}
