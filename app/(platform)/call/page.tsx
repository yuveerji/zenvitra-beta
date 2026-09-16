'use client';

import React, { Suspense } from 'react';
import { ZenCallLobby } from '@/components/call/ZenCallLobby';

export default function ZenCallLobbyPage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-black flex items-center justify-center text-slate-400">Loading ZEN.CALL Lobby...</div>}>
      <ZenCallLobby />
    </Suspense>
  );
}
