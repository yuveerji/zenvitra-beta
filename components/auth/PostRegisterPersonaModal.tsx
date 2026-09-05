'use client';

import React, { useState, useEffect } from 'react';
import { X, Sparkles, ArrowRight, ShieldCheck, Check, User, Compass, Zap } from 'lucide-react';
import { useRouter } from 'next/navigation';

export default function PostRegisterPersonaModal() {
  const router = useRouter();
  const [isOpen, setIsOpen] = useState(false);
  const [selectedPersona, setSelectedPersona] = useState<string>('CREATOR');
  const [selectedInterests, setSelectedInterests] = useState<string[]>([]);
  const [bioInput, setBioInput] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    // Check if triggered from registration
    const shouldShow = sessionStorage.getItem('zenvitra_show_persona_modal');
    if (shouldShow === 'true') {
      setIsOpen(true);
    }
  }, []);

  const handleDismiss = () => {
    sessionStorage.removeItem('zenvitra_show_persona_modal');
    setIsOpen(false);
  };

  const toggleInterest = (tag: string) => {
    if (selectedInterests.includes(tag)) {
      setSelectedInterests(selectedInterests.filter((t) => t !== tag));
    } else {
      setSelectedInterests([...selectedInterests, tag]);
    }
  };

  const handleSavePersona = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      await fetch('/api/user/update', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          bio: bioInput,
          persona: selectedPersona,
          interests: selectedInterests,
        }),
      });

      handleDismiss();
      router.push('/pulse');
      router.refresh();
    } catch (err) {
      console.error(err);
      handleDismiss();
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-xl animate-in fade-in duration-300">
      <div className="relative w-full max-w-xl p-8 rounded-3xl border border-white/20 bg-[#06070a] shadow-2xl space-y-6 font-sans">
        
        {/* Prominent Dismiss Button (X) */}
        <button
          onClick={handleDismiss}
          className="absolute top-6 right-6 p-2 rounded-xl bg-white/5 hover:bg-white/15 text-neutral-400 hover:text-white transition flex items-center gap-1.5 font-mono text-[11px] cursor-pointer"
          title="Skip setup and enter platform"
        >
          <span>Skip to Matrix</span>
          <X className="w-4 h-4" />
        </button>

        {/* Modal Header */}
        <div className="space-y-1.5 pr-20">
          <div className="inline-flex items-center gap-2 px-2.5 py-0.5 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 font-mono text-[10px]">
            <Sparkles className="w-3 h-3" />
            <span>INITIALIZE SOVEREIGN PROFILE</span>
          </div>
          <h2 className="text-xl sm:text-2xl font-bold font-mono text-white tracking-tight uppercase">
            Define Your Sovereign Persona
          </h2>
          <p className="text-xs text-neutral-400 leading-relaxed">
            Customize how your node interfaces with Pulse audio broadcasts, Press feeds, and the Events summit registry.
          </p>
        </div>

        <form onSubmit={handleSavePersona} className="space-y-6 text-xs font-mono">
          
          {/* Persona Track Selector */}
          <div className="space-y-2">
            <label className="text-neutral-400 block font-semibold">1. Select Your Primary Role</label>
            <div className="grid grid-cols-3 gap-2.5">
              {[
                { id: 'CREATOR', title: 'Creator', desc: 'Audio & Visuals' },
                { id: 'RESEARCHER', title: 'Thinker', desc: 'Press & Philosophy' },
                { id: 'ARCHITECT', title: 'Architect', desc: 'Code & Protocols' },
              ].map((p) => (
                <button
                  key={p.id}
                  type="button"
                  onClick={() => setSelectedPersona(p.id)}
                  className={`p-3 rounded-2xl border text-left transition flex flex-col justify-between space-y-2 ${
                    selectedPersona === p.id
                      ? 'bg-white text-black border-white font-semibold'
                      : 'bg-white/[0.02] border-white/10 text-neutral-300 hover:bg-white/5'
                  }`}
                >
                  <span className="font-bold">{p.title}</span>
                  <span className={`text-[10px] ${selectedPersona === p.id ? 'text-neutral-700' : 'text-neutral-500'}`}>
                    {p.desc}
                  </span>
                </button>
              ))}
            </div>
          </div>

          {/* Focus Tags / Interests */}
          <div className="space-y-2">
            <label className="text-neutral-400 block font-semibold">2. Network Nodes & Core Interests</label>
            <div className="flex flex-wrap gap-2">
              {[
                'Lossless Audio',
                'Zero-Knowledge Proofs',
                'Network States',
                'Cryptographic UI',
                'Physical Summits',
                'Long-Form Press',
                'Hardware Relays'
              ].map((tag) => {
                const active = selectedInterests.includes(tag);
                return (
                  <button
                    key={tag}
                    type="button"
                    onClick={() => toggleInterest(tag)}
                    className={`px-3 py-1.5 rounded-xl border text-[11px] transition ${
                      active
                        ? 'bg-white/15 border-white text-white font-bold'
                        : 'bg-white/[0.02] border-white/10 text-neutral-400 hover:text-white'
                    }`}
                  >
                    {tag}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Sovereign Bio */}
          <div className="space-y-1.5">
            <label className="text-neutral-400 block font-semibold">3. Sovereign Manifesto / Bio</label>
            <textarea
              rows={2}
              placeholder="Architecting lossless audio relays and sovereign networks..."
              value={bioInput}
              onChange={(e) => setBioInput(e.target.value)}
              className="w-full p-3 rounded-xl bg-white/[0.03] border border-white/10 focus:border-white/40 focus:outline-none text-white text-xs placeholder:text-neutral-600 resize-none font-sans"
            />
          </div>

          {/* Modal Action Buttons */}
          <div className="flex items-center gap-3 pt-2">
            <button
              type="button"
              onClick={handleDismiss}
              className="w-1/3 py-3 rounded-xl bg-white/5 border border-white/10 hover:bg-white/10 text-neutral-400 hover:text-white transition cursor-pointer"
            >
              Skip (✕)
            </button>
            <button
              type="submit"
              disabled={loading}
              className="w-2/3 py-3 rounded-xl bg-white text-black font-semibold hover:bg-neutral-200 transition flex items-center justify-center gap-2 cursor-pointer shadow-lg disabled:opacity-50"
            >
              <span>Lock Identity & Enter</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>

        </form>

      </div>
    </div>
  );
}