'use client';

import { useEffect, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';

export const dynamic = 'force-dynamic';

function CommitteeRedirectInner() {
  const router = useRouter();
  const searchParams = useSearchParams();

  useEffect(() => {
    const q = searchParams ? searchParams.toString() : '';
    router.replace(`/host${q ? `?${q}` : ''}`);
  }, [router, searchParams]);

  return (
    <div className="min-h-screen bg-[#030407] text-white flex items-center justify-center font-mono text-xs">
      Transitioning to ZEN.HOST Dais...
    </div>
  );
}

export default function CommitteeIndexPage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-[#030407] text-white flex items-center justify-center font-mono text-xs">Loading...</div>}>
      <CommitteeRedirectInner />
    </Suspense>
  );
}
