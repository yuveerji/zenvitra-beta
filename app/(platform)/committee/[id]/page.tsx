'use client';

import { useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';

export const dynamic = 'force-dynamic';

export default function CommitteeChamberPage() {
  const params = useParams();
  const router = useRouter();
  const committeeId = params?.id as string;

  useEffect(() => {
    if (committeeId) {
      router.replace(`/host?chamber=${committeeId}&dais=true`);
    } else {
      router.replace('/host?dais=true');
    }
  }, [committeeId, router]);

  return (
    <div className="min-h-screen bg-[#030407] text-white flex items-center justify-center font-mono text-xs">
      Transitioning to ZEN.HOST Chamber...
    </div>
  );
}
