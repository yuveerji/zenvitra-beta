'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Layers, ArrowRight } from 'lucide-react';

export default function MatrixRedirectPage() {
  const router = useRouter();

  useEffect(() => {
    router.replace('/mun/matrix');
  }, [router]);

  return (
    <div className="min-h-screen bg-[#030712] text-neutral-100 flex flex-col items-center justify-center p-6 font-mono text-xs">
      <div className="p-6 rounded-3xl bg-neutral-950/80 border border-white/10 text-center space-y-4 max-w-sm">
        <div className="w-12 h-12 rounded-2xl bg-cyan-500/10 border border-cyan-500/30 text-cyan-400 flex items-center justify-center mx-auto animate-pulse">
          <Layers className="w-6 h-6" />
        </div>
        <div>
          <h2 className="text-base font-bold text-white">Redirecting to MUN Matrix...</h2>
          <p className="text-[11px] text-neutral-400 mt-1">
            Matrix ledgers operate under active conference chambers.
          </p>
        </div>
        <Link
          href="/mun/matrix"
          className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-black font-bold transition"
        >
          <span>Continue to /mun/matrix</span>
          <ArrowRight className="w-4 h-4" />
        </Link>
      </div>
    </div>
  );
}
