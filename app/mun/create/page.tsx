'use client';

import React from 'react';
import ZenMunMasterDais from '@/components/mun/zenmun/ZenMunMasterDais';

export const dynamic = 'force-dynamic';

export default function MunCreateSessionPage() {
  return <ZenMunMasterDais initialView="setup" />;
}
