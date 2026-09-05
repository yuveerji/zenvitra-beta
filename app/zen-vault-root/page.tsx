import { auth } from '@/lib/auth';
import { db } from '@/lib/db';
import { VaultDashboardClient } from '@/components/founder/VaultDashboardClient';

export default async function SovereignVaultPage() {
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
    <VaultDashboardClient
      totalUsers={totalUsers}
      suspendedUsers={suspendedUsers}
      totalAccounts={totalAccounts}
    />
  );
}
