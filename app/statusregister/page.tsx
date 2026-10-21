'use client';

import React, { useEffect, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { Loader2 } from 'lucide-react';

function RedirectContent() {
  const router = useRouter();
  const searchParams = useSearchParams();

  useEffect(() => {
    const query = searchParams ? searchParams.toString() : '';
    const dest = query ? `/pre-register?${query}` : '/pre-register';
    router.replace(dest);
  }, [router, searchParams]);

  return (
    <div className="min-h-screen bg-[#07090e] text-white flex flex-col items-center justify-center p-4">
      <div className="flex items-center gap-3 text-amber-400 font-mono text-sm">
        <Loader2 className="w-5 h-5 animate-spin" />
        <span>Redirecting to Sovereign Pre-Register Clearance...</span>
      </div>
      <p className="text-neutral-500 text-xs mt-3 font-mono">
        If you are not redirected automatically, <Link href="/pre-register" className="text-amber-400 underline">click here</Link>.
      </p>
    </div>
  );
}

export default function StatusRegisterRedirectPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-[#07090e] text-white flex items-center justify-center font-mono text-sm text-neutral-400">
        Redirecting...
      </div>
    }>
      <RedirectContent />
    </Suspense>
  );
}
