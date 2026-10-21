'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  ShieldAlert,
  RotateCcw,
  LogOut,
  ExternalLink,
  Users,
  CreditCard,
  MessageSquare,
  FileText,
  Building,
  Radio,
  Flame,
  Globe2,
  Sparkles,
  ChevronDown,
  CheckCircle2,
  AlertTriangle,
  Layers,
  ArrowRight,
  Compass
} from 'lucide-react';
import { useTestNode } from '@/context/TestNodeContext';
import { JourneyProvider } from '@/context/JourneyContext';
import { GuidedJourneyOverlay } from '@/components/test-node/journey/GuidedJourneyOverlay';
import { TEST_PERSONAS } from '@/lib/test-node/testNodeData';

interface TestNodeShellProps {
  children: React.ReactNode;
}

export function TestNodeShell({ children }: TestNodeShellProps) {
  const pathname = usePathname();
  const { activePersona, switchPersona, resetSandbox } = useTestNode();
  const [showPersonaMenu, setShowPersonaMenu] = useState(false);
  const [showResetConfirm, setShowResetConfirm] = useState(false);

  const navLinks = [
    { href: '/test-node', label: 'Sandbox Gateway', icon: Sparkles },
    { href: '/test-node/journey', label: 'Guided Demo', icon: Compass },
    { href: '/test-node/mun', label: 'ZEN.MUN (Apex)', icon: Radio },
    { href: '/test-node/sec', label: 'ZEN.SEC (Dais)', icon: Building },
    { href: '/test-node/payments', label: 'Mock Payments', icon: CreditCard },
    { href: '/test-node/chat', label: 'Simulated Chat', icon: MessageSquare },
    { href: '/test-node/pulse', label: 'Synthetic Pulse', icon: Flame },
    { href: '/test-node/solutions', label: 'Policy Docs', icon: FileText },
    { href: '/test-node/apps', label: 'All Test Apps', icon: Layers },
  ];

  return (
    <div className="min-h-screen bg-[#020408] text-neutral-300 font-sans selection:bg-cyan-500/30 flex flex-col justify-between">
      {/* ── 1. PERSISTENT MANDATORY DISCLOSURE & ISOLATION BANNER ── */}
      <div className="w-full bg-gradient-to-r from-cyan-950 via-slate-900 to-indigo-950 border-b border-cyan-500/40 px-4 py-2.5 shadow-lg relative z-50 text-left">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-start md:items-center justify-between gap-3 font-mono text-xs">
          <div className="flex items-center gap-2.5">
            <span className="px-2.5 py-0.5 rounded-full bg-cyan-400 text-black font-black text-[10px] uppercase tracking-wider flex items-center gap-1 shadow-sm">
              <span className="w-1.5 h-1.5 rounded-full bg-black animate-ping" />
              <span>ZENVITRA TEST NODE — SANDBOX ENVIRONMENT</span>
            </span>
            <span className="text-[11px] text-cyan-200 hidden lg:inline">
              You&apos;re exploring a demonstration environment. All events, accounts, applications, messages, payments, and records here are simulated. Nothing you do in this environment affects the live ZENVITRA platform.
            </span>
          </div>

          <div className="flex items-center gap-2.5 shrink-0 self-end md:self-auto">
            {/* Reset Sandbox Trigger */}
            <button
              type="button"
              onClick={() => setShowResetConfirm(true)}
              className="px-2.5 py-1 rounded-lg bg-rose-500/15 hover:bg-rose-500/25 border border-rose-500/30 text-rose-300 text-[10px] font-bold flex items-center gap-1 transition cursor-pointer"
              title="Reset Test Node to initial state"
            >
              <RotateCcw className="w-3 h-3" />
              <span>Reset Sandbox</span>
            </button>

            {/* Leave Test Node Return Link */}
            <Link
              href="/"
              className="px-3 py-1 rounded-lg bg-white/10 hover:bg-white/20 border border-white/20 text-white text-[10px] font-bold flex items-center gap-1 transition"
              title="Return to the live ZENVITRA platform"
            >
              <LogOut className="w-3 h-3" />
              <span>Exit to Live ZENVITRA &rarr;</span>
            </Link>
          </div>
        </div>
      </div>

      {/* ── 2. TEST NODE PRIMARY HEADER & PERSONA SWITCHER ── */}
      <header className="sticky top-0 z-40 bg-[#060913]/90 border-b border-white/10 backdrop-blur-xl px-4 sm:px-6 lg:px-8 py-3.5">
        <div className="max-w-7xl mx-auto flex items-center justify-between gap-4">
          {/* Brand & Orb Indicator */}
          <Link href="/test-node" className="flex items-center gap-3 group">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-cyan-400 to-indigo-600 p-0.5 shadow-[0_0_20px_rgba(6,182,212,0.4)] group-hover:scale-105 transition">
              <div className="w-full h-full bg-[#070b14] rounded-[10px] flex items-center justify-center text-cyan-300 font-black text-sm">
                TN
              </div>
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <span className="font-display font-black text-white text-base tracking-tight uppercase">
                  ZENVITRA TEST NODE
                </span>
                <span className="px-1.5 py-0.2 rounded bg-cyan-500/20 text-cyan-300 font-mono text-[9px] uppercase font-bold">
                  v2.0 Sandbox
                </span>
              </div>
              <div className="text-[10px] font-mono text-neutral-400 flex items-center gap-1">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
                <span>Zero Production Writes Enforced</span>
              </div>
            </div>
          </Link>

          {/* Persona Switcher Dropdown */}
          <div className="relative">
            <button
              type="button"
              onClick={() => setShowPersonaMenu(!showPersonaMenu)}
              className="px-3 py-1.5 rounded-xl bg-white/[0.04] hover:bg-white/[0.08] border border-white/15 flex items-center gap-2.5 text-left transition cursor-pointer"
            >
              <img
                src={activePersona.avatar}
                alt={activePersona.name}
                className="w-6 h-6 rounded-full object-cover border border-cyan-400"
              />
              <div className="hidden sm:block text-xs font-mono">
                <div className="text-white font-bold leading-tight">{activePersona.name}</div>
                <div className="text-[10px] text-cyan-300">{activePersona.role} {activePersona.country ? `(${activePersona.country})` : ''}</div>
              </div>
              <ChevronDown className="w-3.5 h-3.5 text-neutral-400" />
            </button>

            {showPersonaMenu && (
              <>
                <div 
                  className="fixed inset-0 z-40 bg-transparent" 
                  onClick={() => setShowPersonaMenu(false)} 
                />
                <div className="absolute right-0 mt-2 w-72 rounded-2xl bg-[#0a0f1d] border border-cyan-500/40 shadow-2xl p-2 z-50 space-y-1 animate-in fade-in duration-150 text-left font-mono text-xs max-h-96 overflow-y-auto">
                  <div className="px-3 py-1.5 text-[10px] text-neutral-400 uppercase tracking-wider border-b border-white/10 font-bold sticky top-0 bg-[#0a0f1d] z-10">
                    Switch Test Persona (Simulated Roles)
                  </div>
                {TEST_PERSONAS.map((p) => {
                  const isCurrent = p.id === activePersona.id;
                  return (
                    <button
                      key={p.id}
                      type="button"
                      onClick={() => {
                        switchPersona(p.id);
                        setShowPersonaMenu(false);
                      }}
                      className={`w-full text-left p-2.5 rounded-xl flex items-center gap-2.5 transition cursor-pointer ${
                        isCurrent
                          ? 'bg-cyan-500/15 border border-cyan-500/40 text-cyan-300'
                          : 'hover:bg-white/5 text-neutral-300'
                      }`}
                    >
                      <img src={p.avatar} alt={p.name} className="w-7 h-7 rounded-full object-cover shrink-0" />
                      <div className="min-w-0 flex-1">
                        <div className="font-bold text-white text-xs truncate">{p.name}</div>
                        <div className="text-[10px] text-neutral-400 truncate">{p.role} {p.country ? `• ${p.country}` : ''}</div>
                      </div>
                      {isCurrent && <span className="text-[10px] text-cyan-400 font-bold">Active</span>}
                    </button>
                  );
                })}
                </div>
              </>
            )}
          </div>
        </div>

        {/* Horizontal Module Navigation Rail */}
        <div className="max-w-7xl mx-auto flex items-center gap-1.5 overflow-x-auto pt-3 border-t border-white/5 font-mono text-xs no-scrollbar">
          {navLinks.map((link) => {
            const Icon = link.icon;
            const isActive = pathname === link.href;
            return (
              <Link
                key={link.href}
                href={link.href}
                className={`px-3 py-1.5 rounded-xl flex items-center gap-1.5 whitespace-nowrap transition cursor-pointer text-xs ${
                  isActive
                    ? 'bg-cyan-500 text-black font-bold shadow-[0_0_15px_rgba(6,182,212,0.35)]'
                    : 'bg-white/[0.03] hover:bg-white/[0.08] text-neutral-300 border border-white/5'
                }`}
              >
                <Icon className="w-3.5 h-3.5" />
                <span>{link.label}</span>
              </Link>
            );
          })}
        </div>
      </header>

      <JourneyProvider>
        {/* ── 3. MAIN SANDBOX BODY ── */}
        <main className="flex-1 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 w-full text-left space-y-8 pb-32">
          {children}
        </main>

        {/* ── GUIDED DEMO DOCK & MAP OVERLAY ── */}
        <GuidedJourneyOverlay />
      </JourneyProvider>

      {/* ── 4. CONFIRM RESET MODAL ── */}
      {showResetConfirm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
          <div className="w-full max-w-md bg-[#0a0f1d] border border-rose-500/40 rounded-3xl p-6 shadow-2xl space-y-4 text-left">
            <div className="flex items-center gap-3 text-rose-400">
              <div className="p-2.5 rounded-xl bg-rose-500/20 border border-rose-500/30">
                <RotateCcw className="w-5 h-5 text-rose-400" />
              </div>
              <h3 className="text-lg font-bold text-white font-display">Reset Sandbox Environment?</h3>
            </div>

            <p className="text-xs text-neutral-300 font-sans leading-relaxed">
              This will restore all Test Node events, mock transactions, chat channels, motions, and draft documents back to their original factory demonstration values.
            </p>

            <div className="p-3 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-300 text-[11px] font-mono">
              ✓ The live ZENVITRA production database is never touched.
            </div>

            <div className="flex items-center justify-end gap-3 pt-2">
              <button
                type="button"
                onClick={() => setShowResetConfirm(false)}
                className="px-4 py-2 rounded-xl bg-white/5 hover:bg-white/10 text-neutral-400 hover:text-white text-xs font-mono transition cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={() => {
                  resetSandbox();
                  setShowResetConfirm(false);
                }}
                className="px-5 py-2 rounded-xl bg-rose-500 hover:bg-rose-400 text-white font-display font-bold text-xs uppercase tracking-wider transition cursor-pointer shadow-lg shadow-rose-500/20"
              >
                Confirm Reset
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ── 5. SANDBOX FOOTER ── */}
      <footer className="border-t border-white/10 bg-black/60 px-4 py-6 text-center font-mono text-xs text-neutral-500 space-y-2">
        <div className="flex flex-wrap items-center justify-center gap-4 text-neutral-400">
          <Link href="/test-node" className="hover:text-white transition">Test Node Gateway</Link>
          <span>•</span>
          <Link href="/test-node/mun" className="hover:text-white transition">Demo MUN</Link>
          <span>•</span>
          <Link href="/test-node/payments" className="hover:text-white transition">Mock Payments</Link>
          <span>•</span>
          <Link href="/test-node/solutions" className="hover:text-white transition">Drafting Studio</Link>
          <span>•</span>
          <Link href="/" className="text-cyan-400 hover:text-cyan-300 transition">Return to Live Platform</Link>
        </div>
        <p className="text-[11px]">
          ZENVITRA TEST NODE • Isolated Sandbox • Zero Production Records Blended • Clean State Law Compliant
        </p>
      </footer>
    </div>
  );
}

export default TestNodeShell;
