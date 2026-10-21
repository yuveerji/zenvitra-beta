'use client';

import React, { Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import { ZenCommsComingSoon } from '@/components/comms/ZenCommsComingSoon';
import { ZenCallLobby } from '@/components/call/ZenCallLobby';

function ZenCallContent() {
  const searchParams = useSearchParams();
  const isDevPreview = searchParams.get('preview') === 'lobby' || searchParams.get('dev') === 'true';

  if (isDevPreview) {
    return <ZenCallLobby />;
  }

  return <ZenCommsComingSoon appType="call" />;
}

export default function ZenCallLobbyPage() {
  return (
    <Suspense fallback={<ZenCommsComingSoon appType="call" />}>
      <ZenCallContent />
    </Suspense>
  );
}
