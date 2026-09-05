import React from 'react';
import { Metadata } from 'next';
import { PaymentsHubClient } from '@/components/payments/PaymentsHubClient';

export const metadata: Metadata = {
  title: 'ZEN.PAYMENTS — Sovereign Payment & Financial Layer | ZENVITRA',
  description: 'ZENVITRA unified payment orchestration, checkout, billing, transactions, invoices, and payouts.'
};

export default function PaymentsPage() {
  return <PaymentsHubClient />;
}
