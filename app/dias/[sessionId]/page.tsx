'use client';

import React, { useState, useEffect, Suspense } from 'react';
import { useParams, useSearchParams } from 'next/navigation';
import { DiasWorkspace } from '@/components/mun/dias/DiasWorkspace';
import { DelegateWorkspace } from '@/components/mun/dias/DelegateWorkspace';

function DiasSessionInner() {
  const params = useParams();
  const searchParams = useSearchParams();
  const sessionId = ((params?.sessionId as string) || 'IF8RV5').toUpperCase();
  const initialRoleParam = searchParams.get('role');

  const [activeRole, setActiveRole] = useState<'chair' | 'delegate'>(
    initialRoleParam === 'delegate' ? 'delegate' : 'chair'
  );

  const [sessionMeta, setSessionMeta] = useState({
    committeeName: 'Lok Sabha • Parliament of India',
    committeeAcronym: 'LOK SABHA',
    topic: 'Delimitation of Constituencies, Federalism & Democratic Governance',
    isIndianCommittee: true,
  });

  useEffect(() => {
    if (typeof window === 'undefined') return;
    try {
      const raw = localStorage.getItem('zenvitra_dias_active_session');
      if (raw) {
        const parsed = JSON.parse(raw);
        if (parsed?.committeeName) {
          setSessionMeta({
            committeeName: parsed.committeeName,
            committeeAcronym: parsed.committeeAcronym || 'CHAMBER',
            topic: parsed.topic || 'General Diplomatic Deliberation',
            isIndianCommittee: Boolean(parsed.isIndianCommittee),
          });
        }
      }
    } catch {}
  }, [sessionId]);

  if (activeRole === 'delegate') {
    return (
      <DelegateWorkspace
        sessionCode={sessionId}
        committeeName={sessionMeta.committeeName}
        committeeAcronym={sessionMeta.committeeAcronym}
        topic={sessionMeta.topic}
        isIndianCommittee={sessionMeta.isIndianCommittee}
        onSwitchToChair={() => setActiveRole('chair')}
      />
    );
  }

  return (
    <DiasWorkspace
      sessionCode={sessionId}
      committeeName={sessionMeta.committeeName}
      committeeAcronym={sessionMeta.committeeAcronym}
      topic={sessionMeta.topic}
      isIndianCommittee={sessionMeta.isIndianCommittee}
      onSwitchToDelegate={() => setActiveRole('delegate')}
    />
  );
}

export default function DiasSessionPage() {
  return (
    <Suspense
      fallback={
        <div className="h-screen w-screen bg-[#08090B] flex items-center justify-center text-[#C5A46D] font-mono text-xs">
          CONNECTING TO SOVEREIGN CHAMBER...
        </div>
      }
    >
      <DiasSessionInner />
    </Suspense>
  );
}
