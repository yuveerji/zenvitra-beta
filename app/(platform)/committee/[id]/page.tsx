'use client';

import React, { useEffect } from 'react';
import { useParams } from 'next/navigation';
import { CommitteeChamber } from '@/components/mun/CommitteeChamber';
import { useMun } from '@/context/MunContext';

export const dynamic = 'force-dynamic';

export default function CommitteeChamberPage() {
  const params = useParams();
  const committeeId = params?.id as string;
  const { setActiveCommitteeId, committees } = useMun();

  useEffect(() => {
    if (committeeId && committees.some((c) => c.id === committeeId)) {
      setActiveCommitteeId(committeeId);
    }
  }, [committeeId, committees, setActiveCommitteeId]);

  return <CommitteeChamber />;
}
