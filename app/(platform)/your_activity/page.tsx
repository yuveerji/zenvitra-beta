'use client';

import React, { Suspense } from 'react';
import { YourActivityHub } from '@/components/activity/YourActivityHub';

export default function YourActivityPage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-black" />}>
      <YourActivityHub />
    </Suspense>
  );
}
