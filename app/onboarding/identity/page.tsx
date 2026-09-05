'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Sparkles, ArrowRight, User, AlignLeft, ShieldCheck, Loader2 } from 'lucide-react';
import { UsernameAvailabilityButton } from '@/components/auth/UsernameAvailabilityButton';

export default function IdentityOnboardingPage() {
  const router = useRouter();
  const [username, setUsername] = useState('');
  const [bio, setBio] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      const res = await fetch('/api/user/update', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, bio }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Failed to claim handle.');

      router.push('/pulse');
      router.refresh();
    } catch (err: any) {
      setError(err.message || 'Something went wrong.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#030405] text-white flex items-center justify-center p-6 relative overflow-hidden font-sans">
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-white/[0.02] rounded-full blur-[140px] pointer-events-none" />

      <div className="relative z-10 w-full max-w-md p-8 rounded-3xl border border-white/10 bg-[#06070a]/90 backdrop-blur-2xl shadow-2xl space-y-6">
        <div className="text-center space-y-2">
          <div className="inline-flex items-center justify-center w-10 h-10 rounded-2xl bg-white/10 border border-white/20 mx-auto">
            <Sparkles className="w-5 h-5 text-white" />
          </div>
          <h1 className="text-lg font-bold font-mono tracking-tight uppercase">
            Claim Your Zenvitra ID
          </h1>
          <p className="text-xs text-neutral-400 font-mono">
            Set your permanent sovereign namespace and public bio.
          </p>
        </div>

        {error && (
          <div className="p-3 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-300 text-xs font-mono">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4 text-xs font-mono">
          <div className="space-y-1">
            <label className="text-neutral-400">Sovereign Handle (@)</label>
            <div className="relative flex items-center">
              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-neutral-500 pointer-events-none">@</span>
              <input
                type="text"
                required
                placeholder="handle"
                value={username}
                onChange={(e) => setUsername(e.target.value.toLowerCase().replace(/[^a-z0-9_]/g, ''))}
                className="w-full pl-8 pr-28 py-2.5 rounded-xl bg-white/[0.03] border border-white/10 focus:border-white/40 focus:outline-none text-white text-xs placeholder:text-neutral-600"
              />
              <div className="absolute right-1.5 top-1/2 -translate-y-1/2">
                <UsernameAvailabilityButton username={username} />
              </div>
            </div>
          </div>

          <div className="space-y-1">
            <label className="text-neutral-400">Sovereign Bio / Philosophy</label>
            <div className="relative">
              <textarea
                rows={3}
                placeholder="Architecting sovereign protocols and decentralized networks..."
                value={bio}
                onChange={(e) => setBio(e.target.value)}
                className="w-full p-3 rounded-xl bg-white/[0.03] border border-white/10 focus:border-white/40 focus:outline-none text-white text-xs placeholder:text-neutral-600 resize-none font-sans"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 rounded-xl bg-white text-black font-semibold hover:bg-neutral-200 transition flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
          >
            {loading ? (
              <Loader2 className="w-4 h-4 animate-spin" />
            ) : (
              <>
                <span>Lock Namespace & Enter</span>
                <ArrowRight className="w-4 h-4" />
              </>
            )}
          </button>
        </form>
      </div>
    </div>
  );
}