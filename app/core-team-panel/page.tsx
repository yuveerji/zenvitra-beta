import React, { Suspense } from 'react';
import { Metadata } from 'next';
import { ZenAdminControlRoom } from '@/components/admin/ZenAdminControlRoom';

export const metadata: Metadata = {
  title: 'Core Team Panel — Sovereign Operational Mission Control',
  description: 'Unified administrative system controlling people, content, communities, events, MUNs, payments, moderation, press, and infrastructure.',
  robots: {
    index: false,
    follow: false,
  },
};

export default function CoreTeamPanelPage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-[#030405] text-neutral-500 font-mono text-xs flex items-center justify-center">Loading Operations Desk...</div>}>
      <ZenAdminControlRoom />
    </Suspense>
  );
}
