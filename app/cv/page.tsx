'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function CvRedirectPage() {
  const router = useRouter();

  useEffect(() => {
    let target = 'test';
    try {
      const stored = localStorage.getItem('zenvitra_session_user');
      if (stored) {
        const parsed = JSON.parse(stored);
        if (parsed.username) {
          target = parsed.username.toLowerCase();
        }
      }
    } catch (_) {}

    router.replace(`/cv/${target}`);
  }, [router]);

  return (
    <div className="min-h-screen bg-[#030407] text-white flex items-center justify-center p-4">
      <div className="text-center space-y-4 font-sans">
        <div className="w-6 h-6 rounded-full border-2 border-amber-400 border-t-transparent animate-spin mx-auto" />
        <p className="text-xs text-neutral-400">Loading your Model UN CV...</p>
        <button
          type="button"
          onClick={() => router.push('/dashboard')}
          className="text-xs text-neutral-500 hover:text-white underline cursor-pointer"
        >
          Cancel &bull; Return to Dashboard
        </button>
      </div>
    </div>
  );
}
