'use client';

import React, { Suspense } from 'react';
import { useParams, useSearchParams, useRouter } from 'next/navigation';
import ZenMunMasterDais from '@/components/mun/zenmun/ZenMunMasterDais';
import ZenHostLiveDais from '@/components/host/ZenHostLiveDais';
import { HostSessionFormat } from '@/types/zenHost';

export const dynamic = 'force-dynamic';

function HostSessionControlInner() {
  const params = useParams();
  const searchParams = useSearchParams();
  const router = useRouter();

  const sessionId = (params?.sessionId as string) || '';
  const format = (searchParams?.get('format') as HostSessionFormat) || 'open_mic';
  const title = searchParams?.get('title') || undefined;

  if (format === 'mun') {
    return <ZenMunMasterDais initialView="chair" />;
  }

  return (
    <ZenHostLiveDais
      sessionCode={sessionId.startsWith('ZH-') ? sessionId : `ZH-${sessionId}`}
      initialFormat={format}
      initialTitle={title}
      onExit={() => router.push('/host')}
    />
  );
}

export default function HostSessionControlPage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-[#030407] text-white flex items-center justify-center font-mono text-xs">Loading Live Dais...</div>}>
      <HostSessionControlInner />
    </Suspense>
  );
}
