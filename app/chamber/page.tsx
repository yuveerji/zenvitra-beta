'use client';

import React, { Suspense } from 'react';
import { DiasWorkspace } from '@/components/mun/dias/DiasWorkspace';

export default function ChamberPage() {
  return (
    <Suspense fallback={<div className="h-screen w-screen bg-[#08090B] flex items-center justify-center text-[#C5A46D] font-mono">CONNECTING TO CHAMBER...</div>}>
      <DiasWorkspace
        sessionCode="CHAMBER-01"
        committeeName="UN General Assembly • First Committee (DISEC)"
        committeeAcronym="UNGA DISEC"
        topic="Regulation of Lethal Autonomous Weapon Systems (LAWS) and Outer Space Weaponization"
        isIndianCommittee={false}
      />
    </Suspense>
  );
}
