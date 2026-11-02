'use client';

import React from 'react';
import { useParams } from 'next/navigation';
import CanonicalMunMatrixPage from '@/app/mun/matrix/page';

export default function EventMunMatrixPage() {
  const params = useParams();
  const munId = (params?.id as string) || '';

  return <CanonicalMunMatrixPage forcedMunId={munId} />;
}
