import React, { Suspense } from 'react';
import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { verifySession } from '@/lib/session';
import { ZenAdminControlRoom } from '@/components/admin/ZenAdminControlRoom';

export const metadata: Metadata = {
  title: 'Core Team Panel — Sovereign Operational Mission Control',
  description: 'Unified administrative system controlling people, content, communities, events, MUNs, payments, moderation, press, and infrastructure.',
  robots: {
    index: false,
    follow: false,
  },
};

const ALLOWED_ADMIN_ROLES = [
  'FOUNDER',
  'CO_FOUNDER',
  'CHIEF_OF_STAFF',
  'ADMIN',
  'SECRETARY_GENERAL',
  'DIRECTOR_GENERAL',
  'CHAIRPERSON',
  'VICE_CHAIR',
  'TECH_LEAD',
  'FULLSTACK_DEV',
  'DESIGN_LEAD',
  'POLICY_RESEARCHER',
  'FINANCE_LEAD',
  'OUTREACH_LEAD',
  'OPERATIONS_LEAD',
  'COMMUNITY_LEAD',
  'MODERATOR',
  'SECRETARIAT_CHAIR',
  'CORE_TEAM',
  'founder',
  'co_founder',
  'admin',
  'core_team',
];

export default async function CoreTeamPanelPage() {
  const session = await verifySession();

  // If user is at normal status or not in core team / admin list, throw stealth 404
  if (!session.isAuth || !session.role || !ALLOWED_ADMIN_ROLES.includes(session.role)) {
    notFound();
  }

  return (
    <Suspense fallback={<div className="min-h-screen bg-[#030405] text-neutral-500 font-mono text-xs flex items-center justify-center">Loading Operations Desk...</div>}>
      <ZenAdminControlRoom />
    </Suspense>
  );
}
