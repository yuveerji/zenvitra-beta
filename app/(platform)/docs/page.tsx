'use client';

import React, { Suspense } from 'react';
import { ZenDocsClient } from '@/components/docs/ZenDocsClient';

export default function PlatformDocsPage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-[#06080e]" />}>
      <ZenDocsClient />
    </Suspense>
  );
}
