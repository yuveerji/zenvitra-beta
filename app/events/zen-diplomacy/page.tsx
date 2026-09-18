import React from 'react';
import { Metadata } from 'next';
import { ZenDiplomacyPortal } from '@/components/mun/ZenDiplomacyPortal';

export const metadata: Metadata = {
  title: 'ZEN.DIPLOMACY MUN 2026 — Sovereign Online Summit',
  description: 'Official Online Model United Nations assembly hosted on October 24th & 25th, 2026. Organized by Yuveer.',
  openGraph: {
    title: 'ZEN.DIPLOMACY MUN 2026',
    description: 'Online Model UN hosted on October 24th & 25th, 2026.',
    images: ['/assets/events/zen_diplomacy_mun_2026.png'],
  },
};

export default function EventsZenDiplomacyPage() {
  return <ZenDiplomacyPortal />;
}
