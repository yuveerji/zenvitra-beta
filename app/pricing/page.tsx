import React from 'react';
import { Metadata } from 'next';
import { PricingClient } from '@/components/pricing/PricingClient';

export const metadata: Metadata = {
  title: 'Pricing & Monetization Architecture — ZENVITRA',
  description: 'One ZENVITRA membership unlocks increasing levels of power across the ecosystem. Free to participate, paid to unlock greater capability.',
};

export default function PricingPage() {
  return <PricingClient />;
}
