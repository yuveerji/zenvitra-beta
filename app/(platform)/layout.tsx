import { auth } from '@/lib/auth';
import { PlatformShell } from '@/components/layout/PlatformShell';
import { PlatformProviders } from '@/components/layout/PlatformProviders';

export default async function PlatformLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  let session = null;
  try {
    session = await auth();
  } catch {
    session = null;
  }

  const isFounder = Boolean(
    (session?.user as any)?.role === 'FOUNDER' ||
    session?.user?.email?.toLowerCase() === 'founder@zenvitra.org' ||
    (session?.user as any)?.username?.toLowerCase() === 'founder'
  );

  return (
    <PlatformProviders session={session}>
      <PlatformShell
        session={session}
        isFounder={isFounder}
      >
        {children}
      </PlatformShell>
    </PlatformProviders>
  );
}