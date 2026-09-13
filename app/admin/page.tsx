import React from 'react';
import { Metadata } from 'next';
import { ZenAdminControlRoom } from '@/components/admin/ZenAdminControlRoom';

export const metadata: Metadata = {
  title: 'ZEN.ADMIN — Sovereign Operational Mission Control',
  description: 'Unified administrative system controlling people, content, communities, events, MUNs, payments, moderation, press, and infrastructure.',
  robots: {
    index: false,
    follow: false,
  },
};

export default function AdminPage() {
  return <ZenAdminControlRoom />;
}
