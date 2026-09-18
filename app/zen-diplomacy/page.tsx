import React from 'react';
import { Metadata } from 'next';
import { ZenDiplomacyPortal } from '@/components/mun/ZenDiplomacyPortal';

export const metadata: Metadata = {
  title: 'ZEN.DIPLOMACY MUN 2026 — Online Model United Nations & Parliamentary Assembly',
  description: 'Official Online Model United Nations convening on October 24th & 25th, 2026. Featuring AIPPM, Education Ministry of India, UNESCO, and UNSC chambers with live resolution drafting on ZEN.DOCS. Organized by Yuveer.',
  openGraph: {
    title: 'ZEN.DIPLOMACY MUN 2026 — Sovereign Online Model United Nations',
    description: 'Online Model UN hosted on October 24th & 25th, 2026. Check the live Portfolio Matrix Google Sheet and secure your delegate seat.',
    images: ['/assets/events/zen_diplomacy_mun_2026.png'],
  },
};

export default function ZenDiplomacyPage() {
  return <ZenDiplomacyPortal />;
}
