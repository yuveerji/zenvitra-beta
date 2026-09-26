import React from 'react';
import { Metadata } from 'next';
import { ZenDiplomacyPortal } from '@/components/mun/ZenDiplomacyPortal';

export const metadata: Metadata = {
  title: 'ZEN.DIPLOMACY MUN 2026 — Sovereign Online MUN Assembly',
  description: 'Official Online Model United Nations convening on October 24th & 25th, 2026. Featuring AIPPM, Education Ministry of India (EMI), ECOSOC, and UNSC. Organized by Yuveer.',
  openGraph: {
    title: 'ZEN.DIPLOMACY MUN 2026 — Online Assembly',
    description: 'Online Model UN hosted on October 24th & 25th, 2026. Real-time portfolio matrix and live resolution drafting.',
    images: ['/assets/events/zen_diplomacy_mun_2026.png'],
  },
};

export default function MunZenDiplomacyPage() {
  return <ZenDiplomacyPortal />;
}
