'use client';

import React, { Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import { ZenCommsComingSoon } from '@/components/comms/ZenCommsComingSoon';

function ZenMeetContent() {
  return <ZenCommsComingSoon appType="meet" />;
}

export default function ZenMeetHubPage() {
  return (
    <Suspense fallback={<ZenCommsComingSoon appType="meet" />}>
      <ZenMeetContent />
    </Suspense>
  );
}
