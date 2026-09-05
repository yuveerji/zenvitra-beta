'use client';

import React, { Suspense } from 'react';
import { AdaptiveDashboard } from '@/components/dashboard/AdaptiveDashboard';

export default function DashboardPage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-[#040508]" />}>
      <AdaptiveDashboard initialMode="user" />
    </Suspense>
  );
}
