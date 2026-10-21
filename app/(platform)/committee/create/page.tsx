'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

export const dynamic = 'force-dynamic';

export default function CommitteeCreatePage() {
  const router = useRouter();

  useEffect(() => {
    router.replace('/host/create');
  }, [router]);

  return (
    <div className="min-h-screen bg-[#030407] text-white flex items-center justify-center font-mono text-xs">
      Transitioning to ZEN.HOST Studio...
    </div>
  );
}
