'use client';

import React from 'react';
import { useParams } from 'next/navigation';
import { DiasWorkspace } from '@/components/mun/dias/DiasWorkspace';

export default function DiasSessionPage() {
  const params = useParams();
  const sessionId = (params?.sessionId as string) || 'IF8RV5';

  return (
    <DiasWorkspace
      sessionCode={sessionId.toUpperCase()}
      committeeName="Lok Sabha • Parliament of India"
      committeeAcronym="LOK SABHA"
      topic="Delimitation of Constituencies, Federalism & Democratic Governance"
      isIndianCommittee={true}
    />
  );
}
