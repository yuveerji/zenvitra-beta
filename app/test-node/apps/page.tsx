'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { 
  Layers, 
  Video, 
  Mail, 
  FileText, 
  User, 
  Award, 
  PhoneCall, 
  TrendingUp, 
  CheckCircle2, 
  Sparkles,
  ExternalLink,
  ShieldCheck,
  Send,
  Lock
} from 'lucide-react';
import { TestNodeProvider, useTestNode } from '@/context/TestNodeContext';
import { TestNodeShell } from '@/components/test-node/TestNodeShell';

function TestAppsContent() {
  const { activePersona } = useTestNode();

  // Simulated Chit Send State
  const [chitTarget, setChitTarget] = useState('Delegation of France');
  const [chitContent, setChitContent] = useState('');
  const [chitSentNotice, setChitSentNotice] = useState(false);

  // Simulated Call State
  const [callStatus, setCallStatus] = useState<'idle' | 'calling' | 'connected'>('idle');

  const handleSendChit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!chitContent.trim()) return;
    setChitSentNotice(true);
    setTimeout(() => setChitSentNotice(false), 3000);
    setChitContent('');
  };

  const handleSimulateCall = () => {
    setCallStatus('calling');
    setTimeout(() => {
      setCallStatus('connected');
    }, 1500);
  };

  return (
    <div className="space-y-8 text-left">
      {/* Header Banner */}
      <div className="p-6 sm:p-8 rounded-3xl bg-gradient-to-r from-indigo-950/40 via-[#0a0d18] to-black border border-indigo-500/30 space-y-3">
        <div className="flex items-center gap-2">
          <span className="px-3 py-1 rounded-full bg-indigo-500/20 text-indigo-300 font-mono text-[10px] uppercase font-bold tracking-wider">
            ZEN.APPS // FULL ECOSYSTEM SIMULATION
          </span>
          <span className="px-2 py-0.5 rounded-full bg-cyan-500/20 text-cyan-300 text-[10px] font-mono font-bold">
            100% ISOLATED DEMONSTRATIONS
          </span>
        </div>

        <h1 className="text-2xl sm:text-3xl font-black text-white uppercase font-display">
          Simulated ZEN.APPS Suite
        </h1>
        <p className="text-xs sm:text-sm text-neutral-400 max-w-2xl font-sans">
          Experience functional demonstrations across every implemented auxiliary application — including meeting rooms, electronic chits, holographic passports, and simulated call relays.
        </p>
      </div>

      {/* Grid of Interactive Modules */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {/* 1. ZEN.CHITS (Electronic Page Runner) */}
        <div className="p-6 rounded-3xl bg-[#080d1c] border border-white/10 space-y-4">
          <div className="flex items-center justify-between">
            <div className="p-2.5 rounded-xl bg-purple-500/20 text-purple-300">
              <Mail className="w-5 h-5" />
            </div>
            <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-purple-500/20 text-purple-300 font-bold uppercase">
              ZEN.CHITS
            </span>
          </div>

          <div>
            <h3 className="text-base font-bold text-white font-display">Diplomatic Chits Simulator</h3>
            <p className="text-xs text-neutral-400 mt-1 font-sans">
              Send an electronic chit to a fellow delegation or Dais chair via the simulated floor page.
            </p>
          </div>

          <form onSubmit={handleSendChit} className="space-y-2.5 font-mono text-xs">
            <input
              type="text"
              value={chitTarget}
              onChange={(e) => setChitTarget(e.target.value)}
              placeholder="Recipient Delegation..."
              className="w-full bg-[#111422] border border-white/15 rounded-xl px-3 py-1.5 text-white text-xs focus:outline-none"
            />
            <textarea
              rows={2}
              value={chitContent}
              onChange={(e) => setChitContent(e.target.value)}
              placeholder="Enter message for the delegation..."
              className="w-full bg-[#111422] border border-white/15 rounded-xl px-3 py-1.5 text-white text-xs focus:outline-none resize-none font-sans"
            />
            <button
              type="submit"
              className="w-full py-2 rounded-xl bg-purple-500 hover:bg-purple-400 text-white font-mono text-xs font-bold transition cursor-pointer flex items-center justify-center gap-1.5"
            >
              <Send className="w-3.5 h-3.5" />
              <span>Send Simulated Chit</span>
            </button>
          </form>

          {chitSentNotice && (
            <div className="p-2.5 rounded-xl bg-emerald-500/15 border border-emerald-500/30 text-emerald-300 text-[10px] font-mono flex items-center gap-1.5">
              <CheckCircle2 className="w-3.5 h-3.5" />
              <span>Chit dispatched to {chitTarget} page queue!</span>
            </div>
          )}
        </div>

        {/* 2. ZEN.CALL (Simulated Voice/Video Interface) */}
        <div className="p-6 rounded-3xl bg-[#080d1c] border border-white/10 space-y-4">
          <div className="flex items-center justify-between">
            <div className="p-2.5 rounded-xl bg-cyan-500/20 text-cyan-300">
              <PhoneCall className="w-5 h-5" />
            </div>
            <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-cyan-500/20 text-cyan-300 font-bold uppercase">
              ZEN.CALL
            </span>
          </div>

          <div>
            <h3 className="text-base font-bold text-white font-display">Diplomatic Voice Relay</h3>
            <p className="text-xs text-neutral-400 mt-1 font-sans">
              Simulated audio/video call room with WebRTC mock signalling without calling real users.
            </p>
          </div>

          <div className="p-4 rounded-2xl bg-black/50 border border-white/10 text-center space-y-3 font-mono text-xs">
            <div className="text-[11px] text-neutral-400">
              STATUS: <strong className={callStatus === 'connected' ? 'text-emerald-400' : 'text-cyan-300'}>{callStatus.toUpperCase()}</strong>
            </div>

            {callStatus === 'idle' && (
              <button
                type="button"
                onClick={handleSimulateCall}
                className="w-full py-2.5 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-black font-bold transition cursor-pointer"
              >
                Initiate Sandbox Call
              </button>
            )}

            {callStatus === 'calling' && (
              <div className="text-xs text-cyan-300 animate-pulse">Connecting to Mock Signaling Server...</div>
            )}

            {callStatus === 'connected' && (
              <div className="space-y-2">
                <div className="text-xs text-emerald-300 font-bold flex items-center justify-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
                  <span>Audio Feed Active (Simulated)</span>
                </div>
                <button
                  type="button"
                  onClick={() => setCallStatus('idle')}
                  className="px-3 py-1 rounded-lg bg-rose-500/20 text-rose-300 text-[10px] font-bold cursor-pointer"
                >
                  End Call
                </button>
              </div>
            )}
          </div>
        </div>

        {/* 3. ZEN.PASSPORT (Holographic Credentials) */}
        <div className="p-6 rounded-3xl bg-[#080d1c] border border-white/10 space-y-4">
          <div className="flex items-center justify-between">
            <div className="p-2.5 rounded-xl bg-amber-500/20 text-amber-300">
              <Award className="w-5 h-5" />
            </div>
            <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-amber-500/20 text-amber-300 font-bold uppercase">
              ZEN.PASSPORT
            </span>
          </div>

          <div>
            <h3 className="text-base font-bold text-white font-display">Holographic Passport Preview</h3>
            <p className="text-xs text-neutral-400 mt-1 font-sans">
              Sample achievements, merit badges, and cryptographic pass clearances for the active persona.
            </p>
          </div>

          <div className="p-4 rounded-2xl bg-gradient-to-br from-amber-500/10 to-indigo-950 border border-amber-500/30 font-mono text-xs space-y-2">
            <div className="flex justify-between text-neutral-400">
              <span>Passport ID:</span>
              <span className="text-white font-bold">{activePersona.passportId}</span>
            </div>
            <div className="flex justify-between text-neutral-400">
              <span>Bearer:</span>
              <span className="text-white">{activePersona.name}</span>
            </div>
            <div className="flex justify-between text-neutral-400">
              <span>Clearance:</span>
              <span className="text-emerald-400 font-bold">SOVEREIGN LEVEL 3</span>
            </div>
            <div className="flex justify-between text-neutral-400">
              <span>Conference Medals:</span>
              <span className="text-amber-300">★ 4 Commendations</span>
            </div>
          </div>
        </div>

        {/* 4. ZEN.MEET (Virtual Plenary Rooms) */}
        <div className="p-6 rounded-3xl bg-[#080d1c] border border-white/10 space-y-3">
          <div className="flex items-center justify-between">
            <div className="p-2.5 rounded-xl bg-teal-500/20 text-teal-300">
              <Video className="w-5 h-5" />
            </div>
            <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-teal-500/20 text-teal-300 font-bold uppercase">
              ZEN.MEET
            </span>
          </div>
          <h3 className="text-base font-bold text-white font-display">Virtual Plenary Chambers</h3>
          <p className="text-xs text-neutral-400 font-sans">
            Simulated high-bandwidth multi-delegate caucus rooms with automated gavel queuing.
          </p>
          <div className="p-3 rounded-xl bg-white/[0.03] border border-white/5 font-mono text-[11px] text-cyan-300">
            ✓ 4 Virtual Rooms Synchronized in Sandbox
          </div>
        </div>

        {/* 5. ZEN.FORMS (Simulated Applications) */}
        <div className="p-6 rounded-3xl bg-[#080d1c] border border-white/10 space-y-3">
          <div className="flex items-center justify-between">
            <div className="p-2.5 rounded-xl bg-blue-500/20 text-blue-300">
              <FileText className="w-5 h-5" />
            </div>
            <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-blue-500/20 text-blue-300 font-bold uppercase">
              ZEN.FORMS
            </span>
          </div>
          <h3 className="text-base font-bold text-white font-display">Conditional Delegate Forms</h3>
          <p className="text-xs text-neutral-400 font-sans">
            Simulated portfolio application questionnaires with automatic priority allotment scoring.
          </p>
          <div className="p-3 rounded-xl bg-white/[0.03] border border-white/5 font-mono text-[11px] text-purple-300">
            ✓ Dynamic Logic • Simulated Submissions
          </div>
        </div>

        {/* 6. ZEN.LEADERBOARD (Demo Rankings) */}
        <div className="p-6 rounded-3xl bg-[#080d1c] border border-white/10 space-y-3">
          <div className="flex items-center justify-between">
            <div className="p-2.5 rounded-xl bg-emerald-500/20 text-emerald-300">
              <TrendingUp className="w-5 h-5" />
            </div>
            <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-300 font-bold uppercase">
              ZEN.LEADERBOARD
            </span>
          </div>
          <h3 className="text-base font-bold text-white font-display">Simulated Merit Standings</h3>
          <p className="text-xs text-neutral-400 font-sans">
            Demonstration delegate points tally, Best Delegate projections, and speech metrics.
          </p>
          <div className="p-3 rounded-xl bg-white/[0.03] border border-white/5 font-mono text-[11px] text-emerald-300">
            ✓ Live Points Radar • Top 10 Placements
          </div>
        </div>
      </div>
    </div>
  );
}

export default function TestAppsPage() {
  return (
    <TestNodeProvider>
      <TestNodeShell>
        <TestAppsContent />
      </TestNodeShell>
    </TestNodeProvider>
  );
}
