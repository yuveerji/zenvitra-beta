'use client';

import React, { useEffect } from 'react';
import { useParams, useRouter, useSearchParams } from 'next/navigation';
import EventCommitteeMatrixPage from '@/app/[mun]/[committee]/matrix/page';

export default function EventNestedCommitteeMatrixPage() {
  return <EventCommitteeMatrixPage />;
}
