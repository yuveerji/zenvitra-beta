'use client';

import React, { Suspense } from 'react';
import { ZenCommsComingSoon } from '@/components/comms/ZenCommsComingSoon';

export default function MeetingPreJoinLobbyPage() {
  return (
    <Suspense fallback={<ZenCommsComingSoon appType="meet" />}>
      <ZenCommsComingSoon appType="meet" />
    </Suspense>
  );
}
