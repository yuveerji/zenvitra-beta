import React, { Suspense } from 'react';
import { Metadata } from 'next';
import { PlanCheckoutClient } from '@/components/pricing/PlanCheckoutClient';

export const metadata: Metadata = {
  title: 'Secure Plan Checkout — ZENVITRA',
  description: 'Review your selected ZENVITRA membership and activate instant provisioning.',
};

export default function CheckoutPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen bg-[#04060a] flex items-center justify-center text-cyan-400 font-mono text-sm">
          Loading ZENVITRA Secure Checkout...
        </div>
      }
    >
      <PlanCheckoutClient />
    </Suspense>
  );
}
