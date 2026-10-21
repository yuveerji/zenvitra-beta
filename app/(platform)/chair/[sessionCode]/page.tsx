'use client';

import React, { useEffect } from 'react';
import { useParams, useSearchParams } from 'next/navigation';
import ZenMunMasterDais from '@/components/mun/zenmun/ZenMunMasterDais';
import { useZenMun, generateSessionCode } from '@/context/ZenMunContext';

export const dynamic = 'force-dynamic';

function ChairSessionInitializer() {
  const params = useParams();
  const searchParams = useSearchParams();
  const rawCode = (params?.sessionCode as string) || '';
  const chairName = searchParams?.get('chairName') || 'Chair';
  const { session, setSession } = useZenMun();

  useEffect(() => {
    // If a valid code was provided in the URL (and not the deprecated seeded placeholder)
    if (rawCode && rawCode.toUpperCase() !== 'PJL6KY') {
      const codeUpper = rawCode.toUpperCase();
      if (codeUpper !== session.sessionCode) {
        setSession((prev) => ({
          ...prev,
          sessionCode: codeUpper,
          chairName,
        }));
      }
    } else if (!session.sessionCode || session.sessionCode === 'PJL6KY') {
      // Non-seeded dynamic code generation
      const freshCode = generateSessionCode();
      setSession((prev) => ({
        ...prev,
        sessionCode: freshCode,
        chairName,
      }));
    }
  }, [rawCode, chairName, session.sessionCode, setSession]);

  return <ZenMunMasterDais initialView="chair" />;
}

export default function ChairSessionPage() {
  return <ChairSessionInitializer />;
}
