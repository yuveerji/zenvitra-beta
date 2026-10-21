'use client';

import React, { Suspense } from 'react';
import { useParams, useSearchParams } from 'next/navigation';
import { ZenCommsComingSoon } from '@/components/comms/ZenCommsComingSoon';
import { ZenCallActiveRoom } from '@/components/call/ZenCallActiveRoom';

function ZenCallActiveRoomContent() {
  const params = useParams();
  const searchParams = useSearchParams();
  const isDevPreview = searchParams.get('preview') === 'room' || searchParams.get('dev') === 'true';

  const roomId = typeof params?.roomId === 'string' 
    ? params.roomId 
    : (Array.isArray(params?.roomId) ? params.roomId[0] : 'zen-room');

  if (isDevPreview) {
    return <ZenCallActiveRoom roomId={roomId} />;
  }

  return <ZenCommsComingSoon appType="call" />;
}

export default function ZenCallRoomPage() {
  return (
    <Suspense fallback={<ZenCommsComingSoon appType="call" />}>
      <ZenCallActiveRoomContent />
    </Suspense>
  );
}
