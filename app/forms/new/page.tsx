'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function NewFormRedirectPage() {
  const router = useRouter();

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const search = window.location.search;
      router.replace(`/forms/edit/new${search}`);
    } else {
      router.replace('/forms/edit/new');
    }
  }, [router]);

  return (
    <div className="min-h-screen bg-[#07090e] flex items-center justify-center text-neutral-400 font-mono text-sm">
      <div className="flex items-center gap-3">
        <div className="w-5 h-5 border-2 border-amber-400 border-t-transparent rounded-full animate-spin" />
        <span>Initializing ZenForms Canvas...</span>
      </div>
    </div>
  );
}
