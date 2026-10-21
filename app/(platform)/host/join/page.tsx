'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { KeyRound, ArrowRight, ShieldCheck, Sparkles } from 'lucide-react';

export const dynamic = 'force-dynamic';

export default function HostJoinPage() {
  const router = useRouter();
  const [code, setCode] = useState('');
  const [name, setName] = useState('');
  const [seatOrCountry, setSeatOrCountry] = useState('');

  const handleJoin = (e: React.FormEvent) => {
    e.preventDefault();
    const cleanCode = code.trim().toUpperCase();
    if (!cleanCode) return;
    router.push(`/host?room=${cleanCode}&control=true&user=${encodeURIComponent(name || 'Participant')}`);
  };

  return (
    <div className="min-h-screen bg-[#030407] text-white flex items-center justify-center p-4 relative overflow-hidden font-sans">
      <div className="fixed inset-0 pointer-events-none opacity-20 bg-[radial-gradient(ellipse_80%_80%_at_50%_-20%,rgba(6,182,212,0.2),rgba(255,255,255,0))]" />

      <div className="w-full max-w-md p-8 rounded-3xl bg-[#080d1a] border border-white/10 shadow-[0_0_60px_rgba(0,0,0,0.9)] space-y-6 relative z-10">
        <div className="text-center space-y-2">
          <div className="w-12 h-12 mx-auto rounded-2xl bg-cyan-500/15 border border-cyan-500/30 flex items-center justify-center text-cyan-300">
            <KeyRound className="w-6 h-6" />
          </div>
          <h1 className="text-2xl font-black uppercase tracking-tight text-white">Join Live Session</h1>
          <p className="text-xs text-neutral-400">
            Enter the 6-character room broadcast code shared by the session host or dais presidium.
          </p>
        </div>

        <form onSubmit={handleJoin} className="space-y-4">
          <div>
            <label className="block text-[10px] font-bold uppercase tracking-wider text-neutral-400 mb-1">
              Room Broadcast Code
            </label>
            <input
              type="text"
              required
              maxLength={8}
              value={code}
              onChange={(e) => setCode(e.target.value.toUpperCase())}
              placeholder="e.g. 3RV7E9"
              className="w-full px-4 py-3 rounded-xl bg-black/60 border border-white/15 font-mono text-center text-xl font-bold tracking-widest text-cyan-300 focus:outline-none focus:border-cyan-400 placeholder:text-neutral-700"
            />
          </div>

          <div>
            <label className="block text-[10px] font-bold uppercase tracking-wider text-neutral-400 mb-1">
              Your Name
            </label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Full name or alias..."
              className="w-full px-4 py-2.5 rounded-xl bg-black/60 border border-white/15 text-xs text-white focus:outline-none focus:border-cyan-400"
            />
          </div>

          <div>
            <label className="block text-[10px] font-bold uppercase tracking-wider text-neutral-400 mb-1">
              Assigned Seat / Delegation (Optional)
            </label>
            <input
              type="text"
              value={seatOrCountry}
              onChange={(e) => setSeatOrCountry(e.target.value)}
              placeholder="e.g. Delegate of France, Performer #3..."
              className="w-full px-4 py-2.5 rounded-xl bg-black/60 border border-white/15 text-xs text-white focus:outline-none focus:border-cyan-400"
            />
          </div>

          <button
            type="submit"
            className="w-full py-3.5 rounded-xl bg-gradient-to-r from-cyan-500 to-teal-400 hover:from-cyan-400 hover:to-teal-300 text-black font-black text-xs uppercase tracking-wider transition shadow-lg shadow-cyan-500/25 active:scale-98 cursor-pointer flex items-center justify-center gap-2"
          >
            <span>Connect to Stage</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </form>
      </div>
    </div>
  );
}
