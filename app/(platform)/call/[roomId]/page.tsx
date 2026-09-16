'use client';

import React, { Suspense } from 'react';
import { useParams } from 'next/navigation';
import { ZenCallActiveRoom } from '@/components/call/ZenCallActiveRoom';

function ZenCallActiveRoomContent() {
  const params = useParams();
  const roomId = typeof params?.roomId === 'string' 
    ? params.roomId 
    : (Array.isArray(params?.roomId) ? params.roomId[0] : 'zen-room');

  return <ZenCallActiveRoom roomId={roomId} />;
}

export default function ZenCallRoomPage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-black flex items-center justify-center text-slate-400">Connecting to ZEN.CALL Room...</div>}>
      <ZenCallActiveRoomContent />
    </Suspense>
  );
}
