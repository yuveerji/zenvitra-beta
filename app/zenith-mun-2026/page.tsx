import React from 'react';
import { Metadata } from 'next';
import { ZenithMun2026Portal } from '@/components/events/ZenithMun2026Portal';

export const metadata: Metadata = {
  title: 'ZENITH MODEL UNITED NATIONS 2026 — Udaipur Offline Summit | ZENVITRA',
  description: 'A NEW ZEN BEGINS. Official offline Model UN conference convening in Udaipur, Rajasthan. Secretariat applications are now live.',
  openGraph: {
    title: 'ZENITH MODEL UNITED NATIONS 2026 — Udaipur Offline Summit',
    description: 'A NEW ZEN BEGINS. Official offline Model UN conference convening in Udaipur, Rajasthan. Secretariat applications are now live.',
  }
};

export default function ZenithMunShortRoutePage() {
  return <ZenithMun2026Portal />;
}
