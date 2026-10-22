'use client';

import React, { useEffect, useState, Suspense } from 'react';
import { useParams } from 'next/navigation';
import ZenMunMasterDais from '@/components/mun/zenmun/ZenMunMasterDais';

export const dynamic = 'force-dynamic';

function ChamberPageContent() {
  const params = useParams();
  const committeeId = (params?.id as string) || 'chamber';

  // Configure chamber details in localStorage if recognized
  useEffect(() => {
    if (typeof window === 'undefined' || !committeeId) return;
    try {
      const existingRaw = localStorage.getItem('zenvitra_zenmun_live_session_v1');
      const baseSession = existingRaw ? JSON.parse(existingRaw) : {};
      
      const isIndian = committeeId.toLowerCase().includes('lok') || committeeId.toLowerCase().includes('parliament') || committeeId.toLowerCase().includes('aippm');
      const formattedName = committeeId
        .split('_')
        .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
        .join(' ');

      const updated = {
        ...baseSession,
        committeeName: baseSession.committeeName || formattedName,
        isIndianCommittee: isIndian,
        emblemUrl: isIndian ? '/assets/committees/emblem_of_india.svg' : baseSession.emblemUrl || '🏛️',
        sessionState: 'in-session',
      };
      localStorage.setItem('zenvitra_zenmun_live_session_v1', JSON.stringify(updated));
    } catch {
      // Ignore
    }
  }, [committeeId]);

  return <ZenMunMasterDais initialView="chair" />;
}

export default function CommitteeChamberPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen bg-[#070b14] text-white flex items-center justify-center font-mono text-xs">
          Connecting to Chamber Dais...
        </div>
      }
    >
      <ChamberPageContent />
    </Suspense>
  );
}
