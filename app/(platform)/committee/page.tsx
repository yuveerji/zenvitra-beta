'use client';

import React, { useState, useEffect, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import {
  Gavel,
  Shield,
  Sparkles,
  Users,
  Play,
  Sliders,
  KeyRound,
  Tv,
  ArrowRight,
  Landmark,
  Flame,
  FileText,
  Vote,
  Clock,
  Radio,
  BookOpen,
  Scale,
  Scroll,
  CheckCircle2,
  HelpCircle,
  ExternalLink,
  ChevronRight,
  Flag,
} from 'lucide-react';
import ZenMunMasterDais from '@/components/mun/zenmun/ZenMunMasterDais';
import { CommitteeEmblemDisplay } from '@/components/mun/zenmun/ZenMunChairConsole';

interface CommitteePreset {
  id: string;
  name: string;
  acronym: string;
  category: 'Indian Parliamentary' | 'UN General Assembly' | 'Crisis & Security' | 'Human Rights & Specialized';
  topic: string;
  emblem: string;
  isIndian: boolean;
  speakingTimeSeconds: number;
  description: string;
  accentColor: string;
  ruleMode: string;
  seatsCount: number;
}

const COMMITTEE_PRESETS: CommitteePreset[] = [
  // ── 1. INDIAN PARLIAMENTARY & CONSTITUTIONAL CHAMBERS ──
  {
    id: 'lok_sabha',
    name: 'Lok Sabha (House of the People)',
    acronym: 'LOK SABHA',
    category: 'Indian Parliamentary',
    topic: 'Delimitation of Constituencies, Federal Autonomy & Electoral Reforms',
    emblem: '/assets/committees/emblem_of_india.svg',
    isIndian: true,
    speakingTimeSeconds: 90,
    seatsCount: 543,
    description: 'Bicameral legislative floor featuring Zero Hour debates, Calling Attention notices (Rule 197), and Division Bell recorded votes.',
    accentColor: 'from-amber-500 to-orange-500',
    ruleMode: 'Lok Sabha Rules of Procedure & Conduct of Business',
  },
  {
    id: 'rajya_sabha',
    name: 'Rajya Sabha (Council of States)',
    acronym: 'RAJYA SABHA',
    category: 'Indian Parliamentary',
    topic: 'Fiscal Federalism, Centre-State Tax Sharing & Special Economic Zones',
    emblem: '/assets/committees/emblem_of_india.svg',
    isIndian: true,
    speakingTimeSeconds: 90,
    seatsCount: 245,
    description: 'Upper House debate representing state legislatures, permanent chamber procedures, and constitutional amendment reviews.',
    accentColor: 'from-red-600 to-rose-700',
    ruleMode: 'Council of States Procedural Rules',
  },
  {
    id: 'aippm',
    name: 'All India Political Parties Meet',
    acronym: 'AIPPM',
    category: 'Indian Parliamentary',
    topic: 'Simultaneous Elections (One Nation One Election) & Model Code Revisions',
    emblem: '🇮🇳',
    isIndian: true,
    speakingTimeSeconds: 90,
    seatsCount: 45,
    description: 'Multi-party consensus consultations, press statements, legislative pacts, coalition politics, and policy white papers.',
    accentColor: 'from-orange-500 to-amber-600',
    ruleMode: 'Indian Multi-Party Convention Rules',
  },
  {
    id: 'ccs',
    name: 'Cabinet Committee on Security (CCS)',
    acronym: 'CCS',
    category: 'Crisis & Security',
    topic: 'Northern Border Preparedness, Cyber Espionage & Defense Procurement Directives',
    emblem: '🛡️',
    isIndian: true,
    speakingTimeSeconds: 60,
    seatsCount: 12,
    description: 'Apex national executive body: Prime Minister, Home, Defence, External Affairs & Finance Ministers, with covert intelligence briefings.',
    accentColor: 'from-amber-600 to-yellow-600',
    ruleMode: 'Cabinet Executive Confidential Directives',
  },
  {
    id: 'jpc',
    name: 'Joint Parliamentary Committee (JPC)',
    acronym: 'JPC',
    category: 'Indian Parliamentary',
    topic: 'Inquiry into Cross-Border Data Privacy Regulations & Sovereign AI Infrastructure',
    emblem: '🏛️',
    isIndian: true,
    speakingTimeSeconds: 90,
    seatsCount: 30,
    description: 'Cross-party investigative committee with witness examination powers, report drafting, and statutory recommendations.',
    accentColor: 'from-emerald-600 to-teal-700',
    ruleMode: 'Parliamentary Committee Inquiry Procedure',
  },
  {
    id: 'cai',
    name: 'Constituent Assembly of India (1946–1950)',
    acronym: 'CAI 1946',
    category: 'Indian Parliamentary',
    topic: 'Drafting Part III (Fundamental Rights), Directive Principles & Union Judiciary',
    emblem: '📜',
    isIndian: true,
    speakingTimeSeconds: 120,
    seatsCount: 299,
    description: 'Historical constitutional drafting dais: Dr. B.R. Ambedkar, Jawaharlal Nehru, and provincial leaders shaping the Sovereign Republic.',
    accentColor: 'from-amber-700 to-yellow-800',
    ruleMode: 'Constituent Assembly Drafting Rules',
  },

  // ── 2. UNITED NATIONS & MULTILATERAL DIPLOMATIC CHAMBERS ──
  {
    id: 'unsc',
    name: 'United Nations Security Council',
    acronym: 'UNSC',
    category: 'Crisis & Security',
    topic: 'Non-Proliferation, Cyber Warfare & Humanitarian Ceasefire Protocols',
    emblem: '🏛️',
    isIndian: false,
    speakingTimeSeconds: 120,
    seatsCount: 15,
    description: 'High-stakes diplomacy with 15 member states, P5 permanent veto powers, and Chapter VII legally binding directives.',
    accentColor: 'from-blue-600 to-cyan-700',
    ruleMode: 'UN Security Council Procedure (P5 Veto Enabled)',
  },
  {
    id: 'unga_disec',
    name: 'UN General Assembly (DISEC - First Committee)',
    acronym: 'UNGA DISEC',
    category: 'UN General Assembly',
    topic: 'Regulation of Autonomous Weapons Systems & Militarization of Artificial Intelligence',
    emblem: '🌐',
    isIndian: false,
    speakingTimeSeconds: 90,
    seatsCount: 193,
    description: 'Universal plenary debate of 193 sovereign states, structured working papers, sponsor blocs, and substantive draft resolutions.',
    accentColor: 'from-cyan-500 to-blue-600',
    ruleMode: 'Classic UNA-USA Parliamentary Procedure',
  },
  {
    id: 'unhrc',
    name: 'United Nations Human Rights Council',
    acronym: 'UNHRC',
    category: 'Human Rights & Specialized',
    topic: 'Protection of Displaced Populations, Climate Migration & Civil Liberties',
    emblem: '🕊️',
    isIndian: false,
    speakingTimeSeconds: 90,
    seatsCount: 47,
    description: 'Universal periodic reviews, rapporteur investigations, human rights treaties, and universal declaration amendments.',
    accentColor: 'from-teal-400 to-emerald-600',
    ruleMode: 'UNHRC Rules of Procedure',
  },
  {
    id: 'ccc',
    name: 'Continuous Crisis Committee (Cabinet Simulation)',
    acronym: 'CCC CRISIS',
    category: 'Crisis & Security',
    topic: 'Indo-Pacific Strategic Escalation & Critical Sea Lanes Defense',
    emblem: '⚡',
    isIndian: false,
    speakingTimeSeconds: 60,
    seatsCount: 20,
    description: 'Rapid-tempo scenario simulations, back-room crisis communiqués, executive covert actions, and breaking press bulletins.',
    accentColor: 'from-rose-500 to-red-700',
    ruleMode: 'Continuous Crisis Directives & Joint Orders',
  },
  {
    id: 'niti_aayog',
    name: 'NITI Aayog Governing Council',
    acronym: 'NITI AAYOG',
    category: 'Human Rights & Specialized',
    topic: 'National Green Hydrogen Mission, Sovereign Semiconductor Fabs & State GDP Targets',
    emblem: '📊',
    isIndian: true,
    speakingTimeSeconds: 90,
    seatsCount: 36,
    description: 'Chief Ministers, Lieutenant Governors, and union domain experts charting competitive and cooperative federal economic roadmaps.',
    accentColor: 'from-emerald-500 to-green-600',
    ruleMode: 'Governing Council Consultative Procedure',
  },
];

function CommitteePortalInner() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const [joinCodeInput, setJoinCodeInput] = useState('');
  const [activeFleetCategory, setActiveFleetCategory] = useState<'all' | 'indian' | 'un' | 'crisis'>('all');
  const [activeStoredSession, setActiveStoredSession] = useState<{
    sessionCode: string;
    committeeName: string;
    topic: string;
    isIndianCommittee?: boolean;
    rosterCount: number;
    activeMode: string;
  } | null>(null);

  // Custom Chamber Creator Modal State
  const [isCustomCreatorOpen, setIsCustomCreatorOpen] = useState(false);
  const [customName, setCustomName] = useState('');
  const [customAcronym, setCustomAcronym] = useState('');
  const [customTopic, setCustomTopic] = useState('');
  const [customSpeakingTime, setCustomSpeakingTime] = useState('90');
  const [customIsIndian, setCustomIsIndian] = useState(false);

  useEffect(() => {
    if (typeof window === 'undefined') return;
    try {
      const raw = localStorage.getItem('zenvitra_zenmun_live_session_v1');
      if (raw) {
        const parsed = JSON.parse(raw);
        if (parsed?.sessionCode && parsed?.committeeName) {
          setActiveStoredSession({
            sessionCode: parsed.sessionCode,
            committeeName: parsed.committeeName,
            topic: parsed.topic || 'Parliamentary Floor Open',
            isIndianCommittee: Boolean(parsed.isIndianCommittee),
            rosterCount: Array.isArray(parsed.roster) ? parsed.roster.length : 0,
            activeMode: parsed.activeMode || 'gsl',
          });
        }
      }
    } catch {
      // Ignore parse errors
    }
  }, []);

  // Conditional Dais / Setup Rendering
  const isDaisMode =
    searchParams?.get('control') === 'true' ||
    searchParams?.get('dais') === 'true' ||
    Boolean(searchParams?.get('chamber')) ||
    Boolean(searchParams?.get('room'));

  const isSetupMode =
    searchParams?.get('create') === 'true' ||
    searchParams?.get('new') === 'true' ||
    searchParams?.get('setup') === 'true';

  if (isDaisMode) {
    return <ZenMunMasterDais initialView="chair" />;
  }

  if (isSetupMode) {
    return <ZenMunMasterDais initialView="setup" />;
  }

  const handleJoinChamber = (e: React.FormEvent) => {
    e.preventDefault();
    const clean = joinCodeInput.trim().toUpperCase();
    if (clean) {
      router.push(`/committee?room=${clean}&control=true`);
    }
  };

  const handleLaunchPreset = (preset: CommitteePreset) => {
    if (typeof window !== 'undefined') {
      try {
        const existingRaw = localStorage.getItem('zenvitra_zenmun_live_session_v1');
        const baseSession = existingRaw ? JSON.parse(existingRaw) : {};
        const updated = {
          ...baseSession,
          committeeName: preset.name,
          committeeAcronym: preset.acronym,
          topic: preset.topic,
          emblemUrl: preset.emblem,
          isIndianCommittee: preset.isIndian,
          speakingTimeSeconds: preset.speakingTimeSeconds,
          remainingSeconds: preset.speakingTimeSeconds,
          sessionState: 'in-session',
        };
        localStorage.setItem('zenvitra_zenmun_live_session_v1', JSON.stringify(updated));
      } catch {}
    }
    router.push(`/committee?dais=true&chamber=${preset.id}`);
  };

  const handleCreateCustomChamber = (e: React.FormEvent) => {
    e.preventDefault();
    if (!customName.trim()) return;

    const timeSec = parseInt(customSpeakingTime, 10) || 90;
    if (typeof window !== 'undefined') {
      try {
        const existingRaw = localStorage.getItem('zenvitra_zenmun_live_session_v1');
        const baseSession = existingRaw ? JSON.parse(existingRaw) : {};
        const updated = {
          ...baseSession,
          committeeName: customName.trim(),
          committeeAcronym: customAcronym.trim() || customName.trim().substring(0, 8).toUpperCase(),
          topic: customTopic.trim() || 'Floor Debate & Resolution Drafting',
          emblemUrl: customIsIndian ? '/assets/committees/emblem_of_india.svg' : '🏛️',
          isIndianCommittee: customIsIndian,
          speakingTimeSeconds: timeSec,
          remainingSeconds: timeSec,
          sessionState: 'in-session',
        };
        localStorage.setItem('zenvitra_zenmun_live_session_v1', JSON.stringify(updated));
      } catch {}
    }
    setIsCustomCreatorOpen(false);
    router.push(`/committee?dais=true&chamber=custom`);
  };

  const filteredPresets = COMMITTEE_PRESETS.filter((p) => {
    if (activeFleetCategory === 'all') return true;
    if (activeFleetCategory === 'indian') return p.isIndian;
    if (activeFleetCategory === 'un') return !p.isIndian && p.category !== 'Crisis & Security';
    if (activeFleetCategory === 'crisis') return p.category === 'Crisis & Security';
    return true;
  });

  return (
    <div className="min-h-screen bg-[#070b14] text-[#f4efe6] font-sans antialiased relative selection:bg-amber-600/30 selection:text-amber-200">
      {/* ── PARLIAMENTARY & DIPLOMATIC PRESIDIUM AMBIENCE ── */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden">
        {/* Subtle Parliamentary Emerald & Gold Rays */}
        <div className="absolute -top-32 left-1/2 -translate-x-1/2 w-[1000px] h-[500px] bg-[radial-gradient(ellipse_60%_50%_at_50%_0%,rgba(180,130,50,0.12),rgba(20,60,35,0.08),rgba(0,0,0,0))]" />
        {/* Heraldic graticule pattern */}
        <div className="absolute inset-0 opacity-[0.03] bg-[radial-gradient(#d4af37_1px,transparent_1px)] [background-size:24px_24px]" />
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-10 space-y-10 sm:space-y-12">
        {/* ── 1. OFFICIAL DIPLOMATIC PRESIDIUM HEADER ── */}
        <header className="border-b border-[#e5d8bf]/15 pb-8 flex flex-col lg:flex-row lg:items-center justify-between gap-6">
          <div className="space-y-3">
            <div className="flex flex-wrap items-center gap-2">
              <span className="px-3 py-1 rounded-full bg-[#1b3d29]/80 border border-[#2e5d40] text-emerald-300 text-[10px] font-mono font-bold tracking-[0.2em] uppercase shadow-xs flex items-center gap-1.5">
                <Gavel className="w-3.5 h-3.5 text-amber-400" />
                <span>ZEN.COMMITTEE &bull; DIPLOMATIC PRESIDIUM DAIS</span>
              </span>
              <span className="px-2.5 py-0.5 rounded-full bg-amber-500/10 border border-amber-500/30 text-amber-300 font-mono text-[9px] font-bold uppercase tracking-wider">
                GA &bull; PARLIAMENTARY &bull; CRISIS
              </span>
            </div>

            <div>
              <h1 className="text-3xl sm:text-5xl font-black font-serif tracking-tight text-[#fbf8f2] leading-tight">
                Parliamentary Chambers <span className="font-sans font-light text-amber-400">&amp;</span> Diplomatic Dais
              </h1>
              <p className="text-sm sm:text-base text-[#c4b8a5] max-w-2xl leading-relaxed mt-2 font-normal">
                Command suite for official Model United Nations, Indian Parliament (Lok Sabha &amp; Rajya Sabha), and historical cabinets. Real-time GSL, moderated caucuses, roll-call voting, and draft resolutions.
              </p>
            </div>
          </div>

          {/* Presidium Primary Action Gateway */}
          <div className="flex flex-wrap items-center gap-3 shrink-0">
            <button
              type="button"
              onClick={() => router.push('/committee/create')}
              className="px-5 py-3 rounded-2xl bg-[#1b3d29] hover:bg-[#142d1f] text-white font-bold text-xs uppercase tracking-wider transition shadow-lg shadow-[#1b3d29]/30 active:scale-95 flex items-center gap-2 cursor-pointer border border-emerald-500/30"
            >
              <Sparkles className="w-4 h-4 text-emerald-300" />
              <span>Open Setup Studio &rarr;</span>
            </button>

            <button
              type="button"
              onClick={() => router.push('/committee?dais=true')}
              className="px-5 py-3 rounded-2xl bg-[#f5efe6]/10 hover:bg-[#f5efe6]/15 border border-[#ede3cf]/25 text-[#f5efe6] font-bold text-xs uppercase tracking-wider transition flex items-center gap-2 cursor-pointer backdrop-blur-md active:scale-95"
            >
              <Gavel className="w-4 h-4 text-amber-400" />
              <span>Enter Dais (Chair)</span>
            </button>

            <Link
              href="/host"
              className="px-4 py-3 rounded-2xl bg-black/40 hover:bg-black/60 border border-white/10 text-neutral-300 hover:text-white text-xs font-mono font-medium transition flex items-center gap-1.5"
              title="Looking for Open Mic, Pitching or Hackathons?"
            >
              <span>⚡ Switch to ZEN.HOST</span>
            </Link>
          </div>
        </header>

        {/* ── 2. ACTIVE CHAMBER RADAR (IF IN-SESSION) ── */}
        {activeStoredSession && (
          <section className="p-6 sm:p-7 rounded-3xl bg-[#0f172a]/70 border border-amber-500/30 shadow-xl flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6 backdrop-blur-md relative overflow-hidden">
            <div className="flex items-center gap-4 relative z-10">
              <div className="w-14 h-14 rounded-2xl bg-[#1b3d29] border border-emerald-500/40 flex items-center justify-center text-emerald-300 shrink-0 shadow-md">
                <Radio className="w-7 h-7 animate-pulse text-emerald-400" />
              </div>
              <div className="space-y-1">
                <div className="flex items-center gap-2 flex-wrap">
                  <span className="px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 font-mono text-[9px] font-bold uppercase tracking-wider border border-emerald-500/40">
                    ACTIVE CHAMBER DETECTED
                  </span>
                  <span className="font-mono text-xs text-neutral-300">
                    PIN: <strong className="text-amber-300 tracking-widest">{activeStoredSession.sessionCode}</strong>
                  </span>
                  <span className="px-2 py-0.5 rounded-full bg-black/40 text-neutral-300 font-mono text-[9px] font-bold uppercase border border-white/10">
                    MODE: {activeStoredSession.activeMode.toUpperCase()}
                  </span>
                  <span className="text-[10px] text-neutral-400 font-mono">
                    ({activeStoredSession.rosterCount} Delegates)
                  </span>
                </div>
                <h3 className="text-xl sm:text-2xl font-black font-serif text-[#fbf8f2] tracking-tight">
                  {activeStoredSession.committeeName}
                </h3>
                <p className="text-xs text-neutral-300 italic max-w-xl">
                  &ldquo;{activeStoredSession.topic}&rdquo;
                </p>
              </div>
            </div>

            <div className="flex items-center gap-3 shrink-0 relative z-10">
              <button
                type="button"
                onClick={() => router.push(`/committee?dais=true`)}
                className="px-6 py-3 rounded-2xl bg-[#1b3d29] hover:bg-[#152e1f] text-white font-bold text-xs uppercase tracking-wider transition shadow-md active:scale-95 cursor-pointer flex items-center gap-2 border border-emerald-500/30"
              >
                <span>Resume Dais Console &rarr;</span>
              </button>
            </div>
          </section>
        )}

        {/* ── 3. FOUR DISTINCT DIPLOMATIC CHAMBER GATEWAYS ── */}
        <section className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
          {/* Gateway 1: Dais Command */}
          <div className="p-6 rounded-3xl bg-[#0b1120] border border-amber-500/30 flex flex-col justify-between space-y-4 hover:border-amber-400/60 transition shadow-lg group">
            <div className="space-y-3">
              <div className="w-12 h-12 rounded-2xl bg-[#1b3d29] text-emerald-300 flex items-center justify-center border border-emerald-500/30 shadow-xs">
                <Gavel className="w-5 h-5 text-amber-300" />
              </div>
              <div>
                <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-amber-400">
                  PRESIDIUM SUITE
                </span>
                <h3 className="text-lg font-black font-serif text-white mt-0.5">Executive Dais Console</h3>
              </div>
              <p className="text-xs text-neutral-400 leading-relaxed">
                Full presidential dais: GSL, Moderated Caucuses, Right of Reply, P5 Veto roll-calls, and live delegate scoreboard.
              </p>
            </div>
            <button
              type="button"
              onClick={() => router.push('/committee?dais=true')}
              className="w-full py-2.5 rounded-xl bg-[#1b3d29] hover:bg-[#142d1f] text-white font-bold text-xs uppercase tracking-wider transition cursor-pointer flex items-center justify-center gap-2 shadow-sm"
            >
              <span>Take the Gavel &rarr;</span>
            </button>
          </div>

          {/* Gateway 2: Gavelling Setup Studio */}
          <div className="p-6 rounded-3xl bg-[#0b1120] border border-[#ede3cf]/20 flex flex-col justify-between space-y-4 hover:border-emerald-500/50 transition shadow-lg group">
            <div className="space-y-3">
              <div className="w-12 h-12 rounded-2xl bg-amber-500/10 text-amber-300 flex items-center justify-center border border-amber-500/30 shadow-xs">
                <Sparkles className="w-5 h-5 text-amber-400" />
              </div>
              <div>
                <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-emerald-400">
                  CHAMBER ARCHITECT
                </span>
                <h3 className="text-lg font-black font-serif text-white mt-0.5">Setup Studio &amp; Matrices</h3>
              </div>
              <p className="text-xs text-neutral-400 leading-relaxed">
                Gavelling-standard setup: P5, G20, EU, NDA, I.N.D.I.A., Union Cabinet &amp; Indian States quick bundles.
              </p>
            </div>
            <button
              type="button"
              onClick={() => router.push('/committee/create')}
              className="w-full py-2.5 rounded-xl bg-white/10 hover:bg-white/15 text-white font-bold text-xs uppercase tracking-wider transition cursor-pointer flex items-center justify-center gap-2 border border-white/15"
            >
              <span>Launch Studio &rarr;</span>
            </button>
          </div>

          {/* Gateway 3: Floor Code Entry */}
          <div className="p-6 rounded-3xl bg-[#0b1120] border border-cyan-500/25 flex flex-col justify-between space-y-4 hover:border-cyan-400/50 transition shadow-lg group">
            <div className="space-y-3">
              <div className="w-12 h-12 rounded-2xl bg-cyan-950/40 text-cyan-300 flex items-center justify-center border border-cyan-500/30 shadow-xs">
                <KeyRound className="w-5 h-5 text-cyan-300" />
              </div>
              <div>
                <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-cyan-400">
                  DELEGATE ENTRY
                </span>
                <h3 className="text-lg font-black font-serif text-white mt-0.5">Floor Room PIN Join</h3>
              </div>
              <p className="text-xs text-neutral-400 leading-relaxed">
                Enter your committee room PIN to vote on resolutions, cast roll-call ballots, and raise parliamentary motions.
              </p>
            </div>
            <form onSubmit={handleJoinChamber} className="flex items-center gap-1.5">
              <input
                type="text"
                maxLength={8}
                value={joinCodeInput}
                onChange={(e) => setJoinCodeInput(e.target.value.toUpperCase())}
                placeholder="ROOM PIN..."
                className="flex-1 px-3 py-2 rounded-xl bg-black/60 border border-white/15 text-xs font-mono font-bold tracking-widest text-amber-300 placeholder-neutral-500 focus:outline-none focus:border-amber-400"
              />
              <button
                type="submit"
                className="px-3 py-2 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-black font-bold text-xs uppercase cursor-pointer transition shrink-0"
              >
                Join
              </button>
            </form>
          </div>

          {/* Gateway 4: Projector / Assembly Wall */}
          <div className="p-6 rounded-3xl bg-[#0b1120] border border-purple-500/25 flex flex-col justify-between space-y-4 hover:border-purple-400/50 transition shadow-lg group">
            <div className="space-y-3">
              <div className="w-12 h-12 rounded-2xl bg-purple-950/40 text-purple-300 flex items-center justify-center border border-purple-500/30 shadow-xs">
                <Tv className="w-5 h-5 text-purple-300" />
              </div>
              <div>
                <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-purple-400">
                  AUDITORIUM PROJECTION
                </span>
                <h3 className="text-lg font-black font-serif text-white mt-0.5">Stage Display Wall</h3>
              </div>
              <p className="text-xs text-neutral-400 leading-relaxed">
                Full-screen projection mode for chamber auditoriums: live speaking timer, active country flag, and motion podium.
              </p>
            </div>
            <Link
              href="/host/display?format=mun"
              className="w-full py-2.5 rounded-xl bg-purple-500/20 hover:bg-purple-500/30 text-purple-200 hover:text-white font-bold text-xs uppercase tracking-wider transition cursor-pointer flex items-center justify-center gap-2 border border-purple-500/30"
            >
              <span>Project Screen &rarr;</span>
            </Link>
          </div>
        </section>

        {/* ── 4. OFFICIAL CHAMBER FLEET WITH DIPLOMATIC CATEGORY FILTER ── */}
        <section className="space-y-6 pt-2">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-white/10 pb-4">
            <div>
              <div className="flex items-center gap-2">
                <Landmark className="w-4 h-4 text-amber-400" />
                <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-amber-400">
                  OFFICIAL CHAMBER FLEET
                </span>
              </div>
              <h2 className="text-2xl font-black font-serif text-[#fbf8f2] tracking-tight">
                Pre-Configured Chamber Daits
              </h2>
            </div>

            {/* Category Filter Pills */}
            <div className="flex flex-wrap items-center gap-1.5 bg-[#0b1120] p-1 rounded-2xl border border-white/10">
              <button
                type="button"
                onClick={() => setActiveFleetCategory('all')}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold transition cursor-pointer ${
                  activeFleetCategory === 'all'
                    ? 'bg-[#1b3d29] text-white shadow-xs'
                    : 'text-neutral-400 hover:text-white'
                }`}
              >
                All ({COMMITTEE_PRESETS.length})
              </button>
              <button
                type="button"
                onClick={() => setActiveFleetCategory('indian')}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold transition cursor-pointer flex items-center gap-1.5 ${
                  activeFleetCategory === 'indian'
                    ? 'bg-[#1b3d29] text-white shadow-xs'
                    : 'text-neutral-400 hover:text-white'
                }`}
              >
                <span>🇮🇳</span>
                <span>Parliamentary ({COMMITTEE_PRESETS.filter((p) => p.isIndian).length})</span>
              </button>
              <button
                type="button"
                onClick={() => setActiveFleetCategory('un')}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold transition cursor-pointer flex items-center gap-1.5 ${
                  activeFleetCategory === 'un'
                    ? 'bg-[#1b3d29] text-white shadow-xs'
                    : 'text-neutral-400 hover:text-white'
                }`}
              >
                <span>🌐</span>
                <span>United Nations</span>
              </button>
              <button
                type="button"
                onClick={() => setActiveFleetCategory('crisis')}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold transition cursor-pointer flex items-center gap-1.5 ${
                  activeFleetCategory === 'crisis'
                    ? 'bg-[#1b3d29] text-white shadow-xs'
                    : 'text-neutral-400 hover:text-white'
                }`}
              >
                <span>⚡</span>
                <span>Crisis &amp; Security</span>
              </button>
            </div>
          </div>

          {/* Chamber Cards Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredPresets.map((preset) => (
              <div
                key={preset.id}
                className="p-6 rounded-3xl bg-[#0b1120] border border-white/10 hover:border-amber-400/50 hover:shadow-xl transition-all duration-300 flex flex-col justify-between space-y-5 group"
              >
                <div className="space-y-4">
                  <div className="flex items-start justify-between gap-2">
                    <span className="px-2.5 py-0.5 rounded-full bg-white/5 border border-white/10 text-[9px] font-mono font-bold text-neutral-300 uppercase tracking-wider">
                      {preset.category}
                    </span>
                    <div className="flex items-center gap-2">
                      <span className="text-[10px] font-mono text-amber-300/90 font-bold">
                        {preset.speakingTimeSeconds}s GSL
                      </span>
                      <span className="text-[10px] font-mono text-neutral-400">
                        &bull; {preset.seatsCount} Seats
                      </span>
                    </div>
                  </div>

                  <div className="flex items-center gap-3.5">
                    <div className="w-13 h-13 rounded-2xl bg-black/40 border border-white/10 flex items-center justify-center shrink-0 p-1">
                      <CommitteeEmblemDisplay
                        emblem={preset.emblem}
                        acronym={preset.acronym}
                        isIndian={preset.isIndian}
                        size={36}
                      />
                    </div>
                    <div className="min-w-0">
                      <h4 className="text-base font-black font-serif text-white group-hover:text-amber-300 transition truncate leading-snug">
                        {preset.name}
                      </h4>
                      <div className="text-[10px] font-mono font-bold text-neutral-400 truncate mt-0.5">
                        {preset.acronym} &bull; {preset.ruleMode}
                      </div>
                    </div>
                  </div>

                  <div className="p-3 rounded-2xl bg-black/40 border border-white/5 space-y-1">
                    <div className="text-[9px] font-mono font-bold text-amber-400/90 uppercase tracking-wider">
                      AGENDA / TOPIC
                    </div>
                    <p className="text-xs text-neutral-300 font-normal line-clamp-2 leading-relaxed">
                      {preset.topic}
                    </p>
                  </div>

                  <p className="text-xs text-neutral-400 line-clamp-2 leading-relaxed">
                    {preset.description}
                  </p>
                </div>

                <div className="pt-2 flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => handleLaunchPreset(preset)}
                    className="flex-1 py-2.5 rounded-xl bg-[#1b3d29] hover:bg-[#142d1f] text-white text-xs font-bold transition flex items-center justify-center gap-1.5 cursor-pointer shadow-xs border border-emerald-500/30"
                  >
                    <Gavel className="w-3.5 h-3.5 text-amber-300" />
                    <span>Launch Dais</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => router.push(`/committee/create`)}
                    className="px-3 py-2.5 rounded-xl bg-white/5 hover:bg-white/10 text-neutral-300 hover:text-white text-xs font-bold transition cursor-pointer border border-white/10"
                    title="Customize Chamber in Setup Studio"
                  >
                    <Sliders className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* ── 5. DIPLOMATIC RULES OF PROCEDURE & MOTIONS VAULT ── */}
        <section className="p-7 sm:p-8 rounded-3xl bg-[#0b1120] border border-amber-500/20 shadow-xl space-y-6">
          <div className="space-y-1 border-b border-white/10 pb-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <div className="flex items-center gap-2">
                <BookOpen className="w-4 h-4 text-amber-400" />
                <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-amber-400">
                  PARLIAMENTARY CODEX &bull; RULES OF PROCEDURE
                </span>
              </div>
              <h3 className="text-xl sm:text-2xl font-black font-serif text-white">
                Diplomatic Motions, Points &amp; Yields Matrix
              </h3>
            </div>
            <span className="text-xs text-neutral-400 font-mono">
              UNA-USA &bull; THIMUN &bull; LOK SABHA PROTOCOLS
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Column 1: Parliamentary Motions */}
            <div className="p-5 rounded-2xl bg-black/40 border border-white/5 space-y-3">
              <div className="flex items-center gap-2 text-amber-400">
                <Gavel className="w-4 h-4" />
                <h4 className="text-xs font-bold uppercase tracking-wider font-mono">Procedural Motions</h4>
              </div>
              <ul className="space-y-2 text-xs text-neutral-300 leading-relaxed font-normal">
                <li className="flex items-start gap-2">
                  <span className="text-amber-400 font-bold">&bull;</span>
                  <div>
                    <strong className="text-white">Moderated Caucus:</strong> Topic, total time &amp; individual speaking slot. Simple majority.
                  </div>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-amber-400 font-bold">&bull;</span>
                  <div>
                    <strong className="text-white">Unmoderated Caucus:</strong> Informal floor consultation and resolution drafting. Simple majority.
                  </div>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-amber-400 font-bold">&bull;</span>
                  <div>
                    <strong className="text-white">Closure of Debate:</strong> Moves chamber directly into substantive resolution voting. 2/3 majority.
                  </div>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-amber-400 font-bold">&bull;</span>
                  <div>
                    <strong className="text-white">Division Bell (Lok Sabha):</strong> Electronic division recorded vote for legislative clauses.
                  </div>
                </li>
              </ul>
            </div>

            {/* Column 2: Parliamentary Points */}
            <div className="p-5 rounded-2xl bg-black/40 border border-white/5 space-y-3">
              <div className="flex items-center gap-2 text-cyan-400">
                <Scale className="w-4 h-4" />
                <h4 className="text-xs font-bold uppercase tracking-wider font-mono">Floor Points</h4>
              </div>
              <ul className="space-y-2 text-xs text-neutral-300 leading-relaxed font-normal">
                <li className="flex items-start gap-2">
                  <span className="text-cyan-400 font-bold">&bull;</span>
                  <div>
                    <strong className="text-white">Point of Personal Privilege:</strong> Audibility, discomfort, temperature. May interrupt speaker only for inaudibility.
                  </div>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-cyan-400 font-bold">&bull;</span>
                  <div>
                    <strong className="text-white">Point of Order:</strong> Raised when procedural rules or time limits are violated by dais or delegate.
                  </div>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-cyan-400 font-bold">&bull;</span>
                  <div>
                    <strong className="text-white">Point of Parliamentary Inquiry:</strong> Clarification directed to the Chair regarding chamber rules.
                  </div>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-cyan-400 font-bold">&bull;</span>
                  <div>
                    <strong className="text-white">Point of Information:</strong> Substantive inquiry to the speaking delegate if floor time was yielded.
                  </div>
                </li>
              </ul>
            </div>

            {/* Column 3: Yields & Right to Reply */}
            <div className="p-5 rounded-2xl bg-black/40 border border-white/5 space-y-3">
              <div className="flex items-center gap-2 text-emerald-400">
                <Scroll className="w-4 h-4" />
                <h4 className="text-xs font-bold uppercase tracking-wider font-mono">Yields &amp; RTR</h4>
              </div>
              <ul className="space-y-2 text-xs text-neutral-300 leading-relaxed font-normal">
                <li className="flex items-start gap-2">
                  <span className="text-emerald-400 font-bold">&bull;</span>
                  <div>
                    <strong className="text-white">Yield to the Chair:</strong> Returns remaining speaking time to the Dais. No questions permitted.
                  </div>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-emerald-400 font-bold">&bull;</span>
                  <div>
                    <strong className="text-white">Yield to Delegate:</strong> Passes remaining time to another delegation. No second yield allowed.
                  </div>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-emerald-400 font-bold">&bull;</span>
                  <div>
                    <strong className="text-white">Yield to Questions:</strong> Opens floor to points of information from the chamber.
                  </div>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-emerald-400 font-bold">&bull;</span>
                  <div>
                    <strong className="text-white">Right of Reply (RTR):</strong> Granted if national sovereignty or integrity was personally insulted.
                  </div>
                </li>
              </ul>
            </div>
          </div>
        </section>

        {/* ── 6. DIPLOMATIC FOOTER & BRIDGE TO ZEN.HOST ── */}
        <footer className="p-6 rounded-3xl bg-[#0b1120] border border-white/10 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-neutral-400">
          <div className="flex items-center gap-3">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-400" />
            <span>ZENVITRA Diplomatic Presidium Operating Engine &bull; Zero Seeded Data Compliance</span>
          </div>

          <div className="flex items-center gap-4">
            <Link href="/committee/create" className="text-amber-400 hover:text-amber-300 font-bold underline">
              Open Setup Studio
            </Link>
            <span className="text-neutral-600">&bull;</span>
            <Link href="/host" className="text-cyan-400 hover:text-cyan-300 font-bold">
              Switch to Universal ZEN.HOST &rarr;
            </Link>
          </div>
        </footer>
      </div>

      {/* ── CUSTOM CHAMBER CREATOR MODAL ── */}
      {isCustomCreatorOpen && (
        <div className="fixed inset-0 z-50 bg-black/85 backdrop-blur-md flex items-center justify-center p-4 animate-fade-in">
          <div className="w-full max-w-lg rounded-3xl bg-[#0b1120] border border-amber-500/30 p-6 sm:p-8 space-y-5 text-white shadow-2xl">
            <div className="flex items-center justify-between border-b border-white/10 pb-3">
              <div className="space-y-0.5">
                <div className="text-[10px] font-mono font-bold uppercase tracking-wider text-amber-400">
                  CHAMBER ARCHITECT
                </div>
                <h3 className="text-lg font-black font-serif uppercase tracking-tight">Configure Custom Chamber</h3>
              </div>
              <button
                type="button"
                onClick={() => setIsCustomCreatorOpen(false)}
                className="text-neutral-400 hover:text-white p-1 cursor-pointer text-xl"
              >
                &times;
              </button>
            </div>

            <form onSubmit={handleCreateCustomChamber} className="space-y-4">
              <div>
                <label className="block text-[10px] font-mono font-bold uppercase tracking-wider text-neutral-400 mb-1">
                  Committee Name
                </label>
                <input
                  type="text"
                  required
                  value={customName}
                  onChange={(e) => setCustomName(e.target.value)}
                  placeholder="e.g. Rajya Sabha, UNEP, NATO Defense Council..."
                  className="w-full px-3.5 py-2.5 rounded-xl bg-black/60 border border-white/15 text-xs text-white focus:outline-none focus:border-amber-400"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-[10px] font-mono font-bold uppercase tracking-wider text-neutral-400 mb-1">
                    Acronym / Code
                  </label>
                  <input
                    type="text"
                    value={customAcronym}
                    onChange={(e) => setCustomAcronym(e.target.value.toUpperCase())}
                    placeholder="e.g. UNEP, NATO"
                    className="w-full px-3.5 py-2.5 rounded-xl bg-black/60 border border-white/15 text-xs font-mono font-bold text-amber-300 focus:outline-none focus:border-amber-400"
                  />
                </div>
                <div>
                  <label className="block text-[10px] font-mono font-bold uppercase tracking-wider text-neutral-400 mb-1">
                    GSL Speaking Slot (s)
                  </label>
                  <input
                    type="number"
                    min="30"
                    max="300"
                    value={customSpeakingTime}
                    onChange={(e) => setCustomSpeakingTime(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-black/60 border border-white/15 text-xs font-mono font-bold text-white focus:outline-none focus:border-amber-400"
                  />
                </div>
              </div>

              <div>
                <label className="block text-[10px] font-mono font-bold uppercase tracking-wider text-neutral-400 mb-1">
                  Agenda / Topic
                </label>
                <textarea
                  rows={2}
                  value={customTopic}
                  onChange={(e) => setCustomTopic(e.target.value)}
                  placeholder="Official agenda for floor debate and resolutions..."
                  className="w-full px-3.5 py-2.5 rounded-xl bg-black/60 border border-white/15 text-xs text-white focus:outline-none focus:border-amber-400 resize-none"
                />
              </div>

              <div className="flex items-center justify-between p-3.5 rounded-xl bg-black/40 border border-white/10">
                <div>
                  <div className="text-xs font-bold text-white">Indian Parliamentary Rules</div>
                  <div className="text-[10px] text-neutral-400">Enable Lok Sabha emblem and Zero Hour procedure</div>
                </div>
                <input
                  type="checkbox"
                  checked={customIsIndian}
                  onChange={(e) => setCustomIsIndian(e.target.checked)}
                  className="w-5 h-5 accent-emerald-500 cursor-pointer"
                />
              </div>

              <div className="pt-2">
                <button
                  type="submit"
                  className="w-full py-3.5 rounded-2xl bg-[#1b3d29] hover:bg-[#152e1f] text-white font-bold text-xs uppercase tracking-wider transition shadow-lg shadow-[#1b3d29]/30 active:scale-95 cursor-pointer border border-emerald-500/30"
                >
                  INITIALIZE &amp; ENTER CHAMBER DAIS &rarr;
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

export default function CommitteePage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-[#070b14] text-white flex items-center justify-center font-mono text-xs">Connecting to Diplomatic Presidium...</div>}>
      <CommitteePortalInner />
    </Suspense>
  );
}
