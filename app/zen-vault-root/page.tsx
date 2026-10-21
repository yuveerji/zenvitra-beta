import React, { Suspense } from 'react';
import { notFound } from 'next/navigation';
import { verifySession } from '@/lib/session';
import { db } from '@/lib/db';
import { VaultDashboardClient } from '@/components/founder/VaultDashboardClient';

const ALLOWED_FOUNDER_ROLES = ['FOUNDER', 'CO_FOUNDER', 'founder', 'co_founder'];

export default async function SovereignVaultPage() {
  const session = await verifySession();

  // If user is not verified Founder, throw stealth 404
  if (!session.isAuth || !session.role || !ALLOWED_FOUNDER_ROLES.includes(session.role)) {
    notFound();
  }

  let totalUsers = 0;
  let suspendedUsers = 0;
  let totalAccounts = 0;

  try {
    const userModel = db.user as any;
    const [u, s] = await Promise.all([
      userModel.count(),
      userModel.count({ where: { role: 'SUSPENDED' } }).catch(() => 0),
    ]);
    totalUsers = Number(u) || 0;
    suspendedUsers = Number(s) || 0;
    totalAccounts = totalUsers;
  } catch {}

  return (
    <Suspense fallback={<div className="p-8 text-neutral-500 font-mono text-xs">Loading Sovereign Vault...</div>}>
      <VaultDashboardClient
        totalUsers={totalUsers}
        suspendedUsers={suspendedUsers}
        totalAccounts={totalAccounts}
      />
    </Suspense>
  );
}
