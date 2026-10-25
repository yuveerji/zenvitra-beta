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
    // If a valid code was provided in the URL
    if (rawCode && rawCode.trim().length >= 4) {
      const codeUpper = rawCode.trim().toUpperCase();
      if (codeUpper !== session.sessionCode) {
        setSession((prev) => ({
          ...prev,
          sessionCode: codeUpper,
          chairName,
        }));
      }
    } else if (!session.sessionCode) {
      // Dynamic session code generation
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
