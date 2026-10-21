'use client';

import React, { Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import ZenMunMasterDais from '@/components/mun/zenmun/ZenMunMasterDais';

export const dynamic = 'force-dynamic';

function CommitteePageContent() {
  const searchParams = useSearchParams();
  const isCreate =
    searchParams?.get('create') === 'true' ||
    searchParams?.get('new') === 'true' ||
    searchParams?.get('setup') === 'true';

  return <ZenMunMasterDais initialView={isCreate ? 'setup' : 'chair'} />;
}

export default function CommitteeIndexPage() {
  return (
    <Suspense fallback={<ZenMunMasterDais initialView="chair" />}>
      <CommitteePageContent />
    </Suspense>
  );
}
