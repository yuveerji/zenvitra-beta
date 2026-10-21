'use client';

import React, { Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import { ZenChatComingSoon } from '@/components/chat/coming-soon/ZenChatComingSoon';
import { ZenChatMesh } from '@/components/chat/ZenChatMesh';

function ZenChatContent() {
  const searchParams = useSearchParams();
  const isDevPreview = searchParams.get('preview') === 'mesh' || searchParams.get('dev') === 'true';

  // Allow developers/secretariat to view experimental internal mesh with ?preview=mesh
  if (isDevPreview) {
    return <ZenChatMesh />;
  }

  // Official public product announcement & reveal experience
  return <ZenChatComingSoon />;
}

export default function ZenChatPlatformPage() {
  return (
    <Suspense fallback={<ZenChatComingSoon />}>
      <ZenChatContent />
    </Suspense>
  );
}