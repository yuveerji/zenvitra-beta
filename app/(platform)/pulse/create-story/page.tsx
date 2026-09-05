'use client';

import React from 'react';
import { RelayStudio } from '@/components/pulse/RelayStudio';
import { useRouter } from 'next/navigation';

export default function CreateStoryPage() {
  const router = useRouter();

  return <RelayStudio onExit={() => router.push('/pulse')} />;
}
