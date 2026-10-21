'use client';

import React from 'react';
import Link from 'next/link';
import { 
  Radio, 
  Building, 
  CreditCard, 
  MessageSquare, 
  Flame, 
  FileText, 
  Layers, 
  ShieldCheck, 
  Sparkles, 
  ArrowRight, 
  Users, 
  CheckCircle2, 
  Zap, 
  Globe2, 
  Award,
  Lock,
  RotateCcw,
  Compass
} from 'lucide-react';
import { TestNodeProvider, useTestNode } from '@/context/TestNodeContext';
import { TestNodeShell } from '@/components/test-node/TestNodeShell';
import { TestNodeOrb } from '@/components/test-node/TestNodeOrb';

function TestNodeHubContent() {
  const { conference, committees, delegates, documents, transactions, posts, activePersona, switchPersona } = useTestNode();

  const totalMockVolume = transactions.reduce((acc, t) => acc + (t.status === 'SUCCESS' ? t.amount : 0), 0);

  const modules = [
    {
      id: 'mun',
      title: 'ZEN.MUN — Demo Conference',
      desc: 'Explore APEX 2026 Model UN with live floor debate, GSL timers, caucuses, roll call, and delegate dossiers across 4 committees.',
      href: '/test-node/mun',
      icon: Radio,
      badge: '4 Active Chambers',
      badgeColor: 'bg-cyan-500/20 text-cyan-300 border-cyan-500/40',
      stats: '14/15 Quorum • UNSC In Session',
    },
    {
      id: 'sec',
      title: 'ZEN.SEC — Demo Secretariat',
      desc: 'Full event management suite: review Executive Board applications, manage committee permissions, and broadcast emergency alerts.',
      href: '/test-node/sec',
      icon: Building,
      badge: 'Secretariat Suite',
      badgeColor: 'bg-purple-500/20 text-purple-300 border-purple-500/40',
      stats: '3 EB Applications • Run of Show',
    },
    {
      id: 'payments',
      title: 'ZEN.PAYMENTS — Mock Gateway',
      desc: '100% simulated Cashfree sandbox. Test pass checkouts, UPI/Card flows, mock webhooks, and view revenue analytics with ZERO real money.',
      href: '/test-node/payments',
      icon: CreditCard,
      badge: 'Cashfree Sandbox',
      badgeColor: 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40',
      stats: `₹${totalMockVolume.toLocaleString()} Simulated Volume`,
    },
    {
      id: 'chat',
      title: 'ZEN.CHAT — Sample Comms',
      desc: 'Simulated committee backchannels, direct messages, and official Secretariat wires with auto-reply simulated envoys.',
      href: '/test-node/chat',
      icon: MessageSquare,
      badge: 'Encrypted Wires',
      badgeColor: 'bg-blue-500/20 text-blue-300 border-blue-500/40',
      stats: '2 Active Channels • Unread Alerts',
    },
    {
      id: 'pulse',
      title: 'ZEN.PULSE — Synthetic Social',
      desc: 'Fictional social feed with policy debates, live polls, comment threads, and holographic passport achievements.',
      href: '/test-node/pulse',
      icon: Flame,
      badge: 'Sovereign Feed',
      badgeColor: 'bg-amber-500/20 text-amber-300 border-amber-500/40',
      stats: `${posts.length} Synthetic Posts • Active Polls`,
    },
    {
      id: 'solutions',
      title: 'ZEN.SOLUTIONS — Policy Studio',
      desc: 'Interactive multilateral legislative drafting: UN Resolutions, parliamentary bills, and live voting (Aye / Nay / Abstain).',
      href: '/test-node/solutions',
      icon: FileText,
      badge: 'Legislative Drafting',
      badgeColor: 'bg-teal-500/20 text-teal-300 border-teal-500/40',
      stats: `${documents.length} Seeded Resolutions & Bills`,
    },
  ];

  return (
    <div className="space-y-12">
      {/* ── 1. HERO SECTION WITH THE FLOATING CODE ORB ── */}
      <div className="p-8 sm:p-12 rounded-3xl bg-gradient-to-br from-[#0a0f20] via-[#050811] to-[#020306] border border-cyan-500/30 relative overflow-hidden shadow-[0_20px_80px_rgba(0,0,0,0.9)]">
        <div className="absolute top-0 right-1/4 w-96 h-96 bg-cyan-500/10 blur-[150px] rounded-full pointer-events-none" />
        <div className="absolute bottom-0 left-10 w-80 h-80 bg-purple-600/10 blur-[140px] rounded-full pointer-events-none" />

        <div className="relative z-10 grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
          {/* Left: Manifesto & Overview */}
          <div className="lg:col-span-7 space-y-5">
            <div className="flex flex-wrap items-center gap-2">
              <span className="px-3 py-1 rounded-full bg-cyan-500/15 border border-cyan-500/40 text-cyan-300 font-mono text-[11px] uppercase tracking-wider font-bold flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5 text-cyan-400" />
                <span>PARALLEL DIGITAL SANDBOX</span>
              </span>
              <span className="px-2.5 py-0.5 rounded-full bg-emerald-500/15 border border-emerald-500/30 text-emerald-300 font-mono text-[10px] font-bold">
                PROD INTEGRITY PROTECTED
              </span>
            </div>

            <h1 
              className="text-3xl sm:text-5xl font-black text-white tracking-tight uppercase leading-tight font-display"
            >
              Experience ZENVITRA Without Boundary
            </h1>

            <p className="text-sm sm:text-base text-neutral-300 leading-relaxed font-sans max-w-xl">
              Welcome to the <strong>ZENVITRA Test Node</strong> — an isolated, fully interactive demonstration enclave. Explore complete Model UN sessions, test simulated Cashfree payments, draft sovereign legislation, and experiment across all apps.
            </p>

            <div className="flex flex-wrap items-center gap-3 pt-2">
              <Link
                href="/test-node/journey"
                className="px-6 py-3.5 rounded-2xl bg-gradient-to-r from-cyan-400 via-sky-400 to-indigo-500 hover:from-cyan-300 hover:to-indigo-400 text-black font-display font-black text-xs uppercase tracking-wider transition-all shadow-[0_0_35px_rgba(6,182,212,0.45)] flex items-center gap-2 hover:scale-102 active:scale-95"
              >
                <Compass className="w-4 h-4 text-black animate-spin-slow" />
                <span>START GUIDED DEMO (12 Steps) &rarr;</span>
              </Link>

              <Link
                href="/test-node/mun"
                className="px-5 py-3.5 rounded-2xl bg-white/[0.04] hover:bg-white/[0.08] text-white border border-white/15 font-mono text-xs font-bold transition flex items-center gap-2"
              >
                <Radio className="w-4 h-4 text-cyan-400" />
                <span>Explore Freely</span>
              </Link>

              <Link
                href="/test-node/payments"
                className="px-5 py-3.5 rounded-2xl bg-white/[0.04] hover:bg-white/[0.08] text-white border border-white/15 font-mono text-xs font-bold transition flex items-center gap-2"
              >
                <CreditCard className="w-4 h-4 text-emerald-400" />
                <span>Mock Payments</span>
              </Link>
            </div>
          </div>

          {/* Right: The Floating Spherical Orb Centerpiece */}
          <div className="lg:col-span-5 flex justify-center py-4">
            <TestNodeOrb size="lg" />
          </div>
        </div>

        {/* Real-Time Sandbox Telemetry Banner */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-8 border-t border-white/10 mt-8 font-mono text-xs">
          <div className="p-3.5 rounded-2xl bg-white/[0.03] border border-white/10">
            <div className="text-[10px] text-neutral-400 uppercase tracking-wider">Demo Delegates</div>
            <div className="text-xl font-black text-white mt-1">{conference.totalDelegates} Active Envoys</div>
          </div>
          <div className="p-3.5 rounded-2xl bg-cyan-500/10 border border-cyan-500/30">
            <div className="text-[10px] text-cyan-300 uppercase tracking-wider">Chambers Seeded</div>
            <div className="text-xl font-black text-cyan-400 mt-1">{committees.length} Rooms In Session</div>
          </div>
          <div className="p-3.5 rounded-2xl bg-emerald-500/10 border border-emerald-500/30">
            <div className="text-[10px] text-emerald-300 uppercase tracking-wider">Simulated Volume</div>
            <div className="text-xl font-black text-emerald-400 mt-1">₹{totalMockVolume.toLocaleString()}</div>
          </div>
          <div className="p-3.5 rounded-2xl bg-purple-500/10 border border-purple-500/30">
            <div className="text-[10px] text-purple-300 uppercase tracking-wider">Active Persona</div>
            <div className="text-sm font-bold text-white mt-1 truncate">{activePersona.name}</div>
          </div>
        </div>
      </div>

      {/* ── 2. SEEDED MODULE DOORWAYS ── */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-xl font-bold font-display text-white">Interactive Sandbox Modules</h2>
            <p className="text-xs text-neutral-400 font-mono">
              Click any module below to interact with realistic seeded data.
            </p>
          </div>
          <span className="text-xs font-mono text-cyan-400 hidden sm:inline">100% Client-Side Isolated</span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {modules.map((mod) => {
            const Icon = mod.icon;
            return (
              <Link
                key={mod.id}
                href={mod.href}
                className="p-6 rounded-3xl bg-[#080c18] hover:bg-[#0c1224] border border-white/10 hover:border-cyan-500/40 text-left space-y-4 transition group cursor-pointer shadow-lg relative overflow-hidden"
              >
                <div className="flex items-center justify-between">
                  <div className="p-3 rounded-2xl bg-white/5 border border-white/10 group-hover:border-cyan-500/40 transition">
                    <Icon className="w-5 h-5 text-cyan-400" />
                  </div>
                  <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-mono font-bold border ${mod.badgeColor}`}>
                    {mod.badge}
                  </span>
                </div>

                <div className="space-y-1.5">
                  <h3 className="text-base font-bold text-white group-hover:text-cyan-300 transition flex items-center justify-between">
                    <span>{mod.title}</span>
                    <ArrowRight className="w-4 h-4 text-neutral-500 group-hover:text-cyan-400 group-hover:translate-x-1 transition" />
                  </h3>
                  <p className="text-xs text-neutral-400 leading-relaxed font-sans line-clamp-3">
                    {mod.desc}
                  </p>
                </div>

                <div className="pt-3 border-t border-white/5 text-[11px] font-mono text-neutral-400 flex items-center gap-1.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-cyan-400" />
                  <span>{mod.stats}</span>
                </div>
              </Link>
            );
          })}
        </div>
      </div>

      {/* ── 3. PERSONA SHOWCASE: ROLE EXPERIENCES ── */}
      <div className="p-8 rounded-3xl bg-[#070a14] border border-white/10 space-y-6">
        <div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-purple-500/15 border border-purple-500/30 text-purple-300 font-mono text-[10px] uppercase font-bold">
            <Users className="w-3.5 h-3.5" />
            <span>MULTI-PERSONA SIMULATION</span>
          </div>
          <h2 className="text-xl font-bold font-display text-white mt-2">
            Experience ZENVITRA Through Different Roles
          </h2>
          <p className="text-xs text-neutral-400 font-mono">
            Switch between personas to test how permissions, menus, and views dynamically adapt.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {[
            {
              id: 'persona_del_france',
              name: 'Elena Rostova',
              role: 'Delegate (France)',
              committee: 'UNSC',
              desc: 'Speaks on floor, raises caucus motions, and sponsors draft resolutions.',
              active: activePersona.id === 'persona_del_france',
            },
            {
              id: 'persona_sec_gen',
              name: 'Amb. Marcus Sterling',
              role: 'Secretary-General',
              committee: 'Executive Secretariat',
              desc: 'Oversees all 4 chambers, issues conference decrees, and approves EB applications.',
              active: activePersona.id === 'persona_sec_gen',
            },
            {
              id: 'persona_chair_unsc',
              name: 'Tara Mukherjee',
              role: 'Committee Chair (UNSC)',
              committee: 'UNSC',
              desc: 'Gavels debate, manages speaker queues, enforces ROP, and conducts roll-call voting.',
              active: activePersona.id === 'persona_chair_unsc',
            },
          ].map((item) => (
            <button
              key={item.id}
              type="button"
              onClick={() => switchPersona(item.id)}
              className={`p-4 rounded-2xl border text-left transition cursor-pointer space-y-2 ${
                item.active
                  ? 'bg-cyan-500/15 border-cyan-500/50 shadow-[0_0_20px_rgba(6,182,212,0.2)]'
                  : 'bg-white/[0.02] hover:bg-white/[0.05] border-white/10'
              }`}
            >
              <div className="flex items-center justify-between text-xs font-mono">
                <span className="font-bold text-white">{item.name}</span>
                {item.active ? (
                  <span className="px-2 py-0.5 rounded bg-cyan-400 text-black font-bold text-[9px] uppercase">
                    Active
                  </span>
                ) : (
                  <span className="text-[10px] text-neutral-500 hover:text-white">Switch &rarr;</span>
                )}
              </div>
              <div className="text-[11px] font-mono text-cyan-300 font-semibold">{item.role} &bull; {item.committee}</div>
              <p className="text-[11px] text-neutral-400 font-sans leading-relaxed">{item.desc}</p>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}

export default function TestNodeHubPage() {
  return (
    <TestNodeProvider>
      <TestNodeShell>
        <TestNodeHubContent />
      </TestNodeShell>
    </TestNodeProvider>
  );
}
