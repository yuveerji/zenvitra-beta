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
  RotateCcw,
  Sliders,
  KeyRound,
  Tv,
  ArrowRight,
  Globe2,
  Landmark,
  Flame,
  FileText,
  Vote,
  Clock,
  CheckCircle2,
  ChevronRight,
  Radio,
  BookOpen,
  MessageSquare,
  Share2,
  ExternalLink,
} from 'lucide-react';
import ZenMunMasterDais from '@/components/mun/zenmun/ZenMunMasterDais';
import { CommitteeEmblemDisplay } from '@/components/mun/zenmun/ZenMunChairConsole';
import StageAmbientBackground from '@/components/host/StageAmbientBackground';

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
}

const COMMITTEE_PRESETS: CommitteePreset[] = [
  {
    id: 'lok_sabha',
    name: 'Lok Sabha (House of the People)',
    acronym: 'LOK SABHA',
    category: 'Indian Parliamentary',
    topic: 'Delimitation of Constituencies, Federal Autonomy & Electoral Reforms',
    emblem: '/assets/committees/emblem_of_india.svg',
    isIndian: true,
    speakingTimeSeconds: 90,
    description: 'Bicameral legislative procedure featuring Zero Hour debates, Calling Attention motions, and Division Bell roll-call votes.',
    accentColor: 'from-amber-500 to-orange-500',
    ruleMode: 'Lok Sabha Parliamentary Rules',
  },
  {
    id: 'unsc',
    name: 'United Nations Security Council',
    acronym: 'UNSC',
    category: 'Crisis & Security',
    topic: 'Non-Proliferation, Cyber Warfare & Humanitarian Ceasefire Protocols',
    emblem: '🏛️',
    isIndian: false,
    speakingTimeSeconds: 120,
    description: 'High-stakes diplomacy with 15 member states, P5 permanent veto powers, and Chapter VII legally binding directives.',
    accentColor: 'from-red-500 to-rose-600',
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
    description: 'Universal periodic reviews, rapporteur investigations, human rights treaties, and universal declaration amendments.',
    accentColor: 'from-teal-400 to-emerald-600',
    ruleMode: 'UNHRC Rules of Procedure',
  },
  {
    id: 'ccc',
    name: 'Continuous Crisis Committee (Cabinet Simulation)',
    acronym: 'CCC CRISIS',
    category: 'Crisis & Security',
    topic: 'Indo-Pacific Strategic Escalation & Critical Infrastructure Protection',
    emblem: '⚡',
    isIndian: false,
    speakingTimeSeconds: 60,
    description: 'Rapid-tempo scenario simulations, back-room crisis communiqués, executive covert actions, and breaking press bulletins.',
    accentColor: 'from-amber-400 to-yellow-600',
    ruleMode: 'Continuous Crisis Directives & Joint Orders',
  },
  {
    id: 'aippm',
    name: 'All India Political Parties Meet',
    acronym: 'AIPPM',
    category: 'Indian Parliamentary',
    topic: 'One Nation One Election & Constitutional Division of Powers',
    emblem: '🇮🇳',
    isIndian: true,
    speakingTimeSeconds: 90,
    description: 'Multi-party consensus consultations, press conferences, political pacts, and legislative policy manifestos.',
    accentColor: 'from-orange-500 to-amber-600',
    ruleMode: 'Indian Multi-Party Convention Rules',
  },
];

function CommitteePortalInner() {
  const router = useRouter();
  const searchParams = useSearchParams();

  // ── 1. ALL HOOKS CALLED UNCONDITIONALLY AT THE TOP LEVEL (REACT RULES OF HOOKS) ──
  const [joinCodeInput, setJoinCodeInput] = useState('');
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

  // ── 2. CONDITIONAL DAIS / SETUP RENDERING AFTER ALL HOOKS ──
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
    // Configure in localStorage and launch Dais
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
      } catch {
        // Fallback
      }
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
      } catch {
        // Fallback
      }
    }
    setIsCustomCreatorOpen(false);
    router.push(`/committee?dais=true&chamber=custom`);
  };

  return (
    <div className="min-h-screen bg-[#020307] text-white font-sans antialiased selection:bg-amber-500/20 selection:text-amber-200 relative overflow-hidden">
      {/* ── STAGE AMBIENT THEATRICAL BACKGROUND ── */}
      <StageAmbientBackground theme="mun" />

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-12">
        {/* ── 1. HEADER & PRESIDIUM BANNER ── */}
        <header className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6 border-b border-white/[0.08] pb-8">
          <div className="space-y-2.5">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-950/60 border border-amber-500/40 text-amber-300 text-[10px] font-mono font-bold tracking-[0.2em] uppercase shadow-[0_0_15px_rgba(245,158,11,0.25)]">
              <span className="w-1.5 h-1.5 rounded-full bg-amber-400 animate-ping" />
              <Gavel className="w-3.5 h-3.5 text-amber-400" />
              <span>ZEN.COMMITTEE &bull; DIPLOMATIC PRESIDIUM</span>
            </div>
            <h1 className="text-3xl sm:text-5xl font-black font-space text-white tracking-tight uppercase">
              COMMITTEE <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-400 via-yellow-300 to-cyan-300">CHAMBERS &amp; DAIS</span>
            </h1>
            <p className="text-sm sm:text-base text-neutral-400 max-w-2xl leading-relaxed font-outfit">
              Official Model United Nations &amp; Parliamentary Chamber Command Suite. Real-time GSL timers, Moderated Caucuses, Right to Reply, Roll-Call voting, and resolution drafting.
            </p>
          </div>

          {/* Quick Engine Telemetry & Actions */}
          <div className="flex flex-wrap items-center gap-3 shrink-0">
            <button
              type="button"
              onClick={() => router.push('/committee?dais=true')}
              className="px-5 py-2.5 rounded-2xl bg-gradient-to-r from-amber-500 via-amber-400 to-amber-300 hover:brightness-110 text-black font-black font-space text-xs uppercase tracking-wider transition shadow-[0_0_25px_rgba(245,158,11,0.35)] active:scale-95 flex items-center gap-2 cursor-pointer"
            >
              <Gavel className="w-4 h-4 text-black" />
              <span>Launch Dais (Chair)</span>
            </button>
            <button
              type="button"
              onClick={() => setIsCustomCreatorOpen(true)}
              className="px-4 py-2.5 rounded-2xl bg-white/[0.04] border border-white/15 hover:border-amber-400/50 hover:bg-white/[0.08] text-neutral-200 hover:text-white text-xs font-bold font-space uppercase tracking-wider transition flex items-center gap-2 cursor-pointer backdrop-blur-md"
            >
              <Sliders className="w-4 h-4 text-amber-400" />
              <span>Custom Chamber</span>
            </button>
            <Link
              href="/host/display?format=mun"
              className="px-4 py-2.5 rounded-2xl bg-cyan-950/40 hover:bg-cyan-900/50 border border-cyan-400/40 text-cyan-300 text-xs font-bold font-space uppercase tracking-wider transition flex items-center gap-2 backdrop-blur-md shadow-[0_0_15px_rgba(6,182,212,0.2)]"
            >
              <Tv className="w-4 h-4 text-cyan-400" />
              <span>Stage Screen</span>
            </Link>
          </div>
        </header>

        {/* ── 2. ACTIVE CHAMBER RESUME RADAR ── */}
        {activeStoredSession && (
          <section className="p-6 sm:p-7 rounded-3xl bg-gradient-to-r from-amber-950/40 via-[#0a0f1d] to-[#040711] border border-amber-500/30 shadow-[0_10px_40px_rgba(0,0,0,0.6)] flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6 backdrop-blur-xl relative overflow-hidden">
            <div className="absolute top-0 right-0 w-80 h-40 bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />
            <div className="flex items-center gap-4 relative z-10">
              <div className="w-14 h-14 rounded-2xl bg-amber-500/20 border border-amber-500/40 flex items-center justify-center text-amber-300 shrink-0 shadow-[0_0_20px_rgba(245,158,11,0.25)]">
                <Radio className="w-7 h-7 animate-pulse text-amber-400" />
              </div>
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <span className="px-2 py-0.5 rounded-full bg-amber-500/20 text-amber-300 font-mono text-[9px] font-bold uppercase tracking-wider border border-amber-500/40">
                    ACTIVE CHAMBER DETECTED
                  </span>
                  <span className="font-mono text-xs text-neutral-400">
                    PIN: <strong className="text-white tracking-widest">{activeStoredSession.sessionCode}</strong>
                  </span>
                  <span className="px-2 py-0.5 rounded-full bg-cyan-950/60 text-cyan-300 font-mono text-[9px] font-bold uppercase border border-cyan-500/30">
                    MODE: {activeStoredSession.activeMode.toUpperCase()}
                  </span>
                </div>
                <h3 className="text-xl sm:text-2xl font-black font-space text-white tracking-tight">
                  {activeStoredSession.committeeName}
                </h3>
                <p className="text-xs text-neutral-400 italic max-w-xl font-outfit">
                  &ldquo;{activeStoredSession.topic}&rdquo;
                </p>
              </div>
            </div>

            <div className="flex items-center gap-3 shrink-0 relative z-10">
              <button
                type="button"
                onClick={() => router.push(`/committee?dais=true`)}
                className="px-6 py-3 rounded-2xl bg-gradient-to-r from-amber-500 to-amber-400 hover:brightness-110 text-black font-black font-space text-xs uppercase tracking-wider transition shadow-[0_0_25px_rgba(245,158,11,0.4)] active:scale-95 cursor-pointer flex items-center gap-2"
              >
                <span>Resume Dais Console &rarr;</span>
              </button>
            </div>
          </section>
        )}

        {/* ── 3. OPERATING GATEWAYS: INSTANT LAUNCH & ROOM PIN JOIN ── */}
        <section className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Card 1: Executive Board Dais */}
          <div className="p-7 rounded-3xl bg-[#060a14]/90 border border-amber-500/30 shadow-[0_10px_40px_rgba(0,0,0,0.6)] relative overflow-hidden group hover:border-amber-400/70 transition-all duration-300 flex flex-col justify-between backdrop-blur-xl">
            <div className="absolute top-0 right-0 w-36 h-36 bg-amber-500/15 rounded-full blur-3xl group-hover:bg-amber-500/25 transition duration-500" />
            <div className="space-y-4 relative z-10">
              <div className="w-12 h-12 rounded-2xl bg-amber-500/15 border border-amber-500/40 flex items-center justify-center text-amber-300 shadow-[0_0_15px_rgba(245,158,11,0.2)]">
                <Gavel className="w-5 h-5" />
              </div>
              <div className="space-y-1.5">
                <div className="text-[10px] font-mono font-bold uppercase tracking-[0.2em] text-amber-400">CHAIR OPERATING SYSTEM</div>
                <h3 className="text-xl font-black font-space text-white tracking-tight uppercase">Executive Board Dais</h3>
                <p className="text-xs text-neutral-400 leading-relaxed font-outfit">
                  Full presidential presidium console: General Speakers&apos; List, Caucuses, RTR, Roll-Call voting, and live points ledger.
                </p>
              </div>
            </div>

            <button
              type="button"
              onClick={() => router.push('/committee?dais=true')}
              className="mt-6 w-full py-3 rounded-2xl bg-gradient-to-r from-amber-500 to-amber-400 hover:brightness-110 text-black font-black font-space text-xs uppercase tracking-wider transition shadow-[0_0_25px_rgba(245,158,11,0.35)] active:scale-98 flex items-center justify-center gap-2 cursor-pointer"
            >
              <span>Take the Dais &rarr;</span>
            </button>
          </div>

          {/* Card 2: Delegate Room Code Join */}
          <div className="p-7 rounded-3xl bg-[#060a14]/90 border border-white/10 shadow-[0_10px_40px_rgba(0,0,0,0.6)] relative overflow-hidden group hover:border-cyan-500/50 transition-all duration-300 flex flex-col justify-between backdrop-blur-xl">
            <div className="absolute top-0 right-0 w-36 h-36 bg-cyan-500/15 rounded-full blur-3xl group-hover:bg-cyan-500/25 transition duration-500" />
            <div className="space-y-4 relative z-10">
              <div className="w-12 h-12 rounded-2xl bg-cyan-500/15 border border-cyan-500/40 flex items-center justify-center text-cyan-300 shadow-[0_0_15px_rgba(6,182,212,0.2)]">
                <KeyRound className="w-5 h-5" />
              </div>
              <div className="space-y-1.5">
                <div className="text-[10px] font-mono font-bold uppercase tracking-[0.2em] text-cyan-400">DELEGATE &amp; FLOOR ENTRY</div>
                <h3 className="text-xl font-black font-space text-white tracking-tight uppercase">Join by Chamber Code</h3>
                <p className="text-xs text-neutral-400 leading-relaxed font-outfit">
                  Enter your committee room PIN or scan QR to participate in roll calls, motions, and floor speeches.
                </p>
              </div>
            </div>

            <form onSubmit={handleJoinChamber} className="mt-6 flex items-center gap-2 relative z-10">
              <input
                type="text"
                maxLength={8}
                value={joinCodeInput}
                onChange={(e) => setJoinCodeInput(e.target.value.toUpperCase())}
                placeholder="ROOM PIN..."
                className="flex-1 px-3.5 py-2.5 rounded-xl bg-black/60 border border-white/15 text-xs font-mono font-bold tracking-widest text-amber-300 placeholder-neutral-600 focus:outline-none focus:border-amber-400"
              />
              <button
                type="submit"
                className="px-4 py-2.5 rounded-xl bg-gradient-to-r from-cyan-500 to-teal-400 hover:brightness-110 text-black font-black font-space text-xs uppercase cursor-pointer transition shadow-[0_0_20px_rgba(6,182,212,0.3)] active:scale-95 shrink-0"
              >
                Join
              </button>
            </form>
          </div>

          {/* Card 3: Pre-Session Setup & Roster Studio */}
          <div className="p-7 rounded-3xl bg-[#060a14]/90 border border-white/10 shadow-[0_10px_40px_rgba(0,0,0,0.6)] relative overflow-hidden group hover:border-purple-500/50 transition-all duration-300 flex flex-col justify-between backdrop-blur-xl">
            <div className="absolute top-0 right-0 w-36 h-36 bg-purple-500/15 rounded-full blur-3xl group-hover:bg-purple-500/25 transition duration-500" />
            <div className="space-y-4 relative z-10">
              <div className="w-12 h-12 rounded-2xl bg-purple-500/15 border border-purple-500/40 flex items-center justify-center text-purple-300 shadow-[0_0_15px_rgba(168,85,247,0.2)]">
                <Users className="w-5 h-5" />
              </div>
              <div className="space-y-1.5">
                <div className="text-[10px] font-mono font-bold uppercase tracking-[0.2em] text-purple-400">CHAMBER ARCHITECT</div>
                <h3 className="text-xl font-black font-space text-white tracking-tight uppercase">Pre-Session Setup</h3>
                <p className="text-xs text-neutral-400 leading-relaxed font-outfit">
                  Configure committee agenda, customize delegate seats, import country matrices, and set speaking time limits.
                </p>
              </div>
            </div>

            <button
              type="button"
              onClick={() => router.push('/committee?setup=true')}
              className="mt-6 w-full py-3 rounded-2xl bg-white/[0.06] hover:bg-white/[0.12] text-white font-black font-space text-xs uppercase tracking-wider transition border border-white/15 active:scale-98 flex items-center justify-center gap-2 text-center cursor-pointer"
            >
              <span>Open Setup Studio &rarr;</span>
            </button>
          </div>
        </section>

        {/* ── 4. COMMITTEE FLEET & ACTIVE PRESETS ── */}
        <section className="space-y-6 pt-4">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-white/[0.08] pb-4">
            <div>
              <h2 className="text-2xl font-black font-space text-white tracking-tight uppercase">
                Ready-to-Launch Committee Chambers
              </h2>
              <p className="text-xs text-neutral-400 mt-1 font-outfit">
                Pre-configured procedural rules, official emblems, speaking slot defaults, and voting thresholds.
              </p>
            </div>
            <div className="flex items-center gap-3">
              <span className="text-xs font-mono font-bold text-amber-400 px-3 py-1 rounded-full bg-amber-950/50 border border-amber-500/30">
                {COMMITTEE_PRESETS.length} Official Presets
              </span>
              <button
                type="button"
                onClick={() => setIsCustomCreatorOpen(true)}
                className="px-3.5 py-1.5 rounded-xl bg-amber-500/10 hover:bg-amber-500/20 border border-amber-400/30 text-amber-300 text-xs font-bold font-space transition flex items-center gap-1.5 cursor-pointer"
              >
                <Sliders className="w-3.5 h-3.5" />
                <span>Custom Chamber</span>
              </button>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {COMMITTEE_PRESETS.map((preset) => (
              <div
                key={preset.id}
                className="p-6 rounded-3xl bg-[#060a14]/85 border border-white/[0.08] hover:border-amber-400/50 hover:shadow-[0_0_35px_rgba(245,158,11,0.15)] transition-all duration-300 flex flex-col justify-between space-y-5 group backdrop-blur-md"
              >
                <div className="space-y-4">
                  <div className="flex items-start justify-between gap-3">
                    <span className="px-2.5 py-0.5 rounded-full bg-white/[0.06] border border-white/10 text-[9px] font-mono font-bold text-neutral-300 uppercase tracking-wider">
                      {preset.category}
                    </span>
                    <span className="text-[10px] font-mono text-amber-400 font-semibold tabular-nums">
                      {preset.speakingTimeSeconds}s GSL Slot
                    </span>
                  </div>

                  <div className="flex items-center gap-3.5">
                    <div className="w-12 h-12 rounded-2xl bg-black/40 border border-white/10 flex items-center justify-center shrink-0 shadow-inner">
                      <CommitteeEmblemDisplay
                        emblem={preset.emblem}
                        acronym={preset.acronym}
                        isIndian={preset.isIndian}
                        size={32}
                      />
                    </div>
                    <div>
                      <h4 className="text-base font-black font-space text-white group-hover:text-amber-300 transition leading-tight">
                        {preset.name}
                      </h4>
                      <div className="text-[10px] font-mono font-bold text-neutral-400 mt-0.5">
                        {preset.acronym} &bull; {preset.ruleMode}
                      </div>
                    </div>
                  </div>

                  <div className="p-3 rounded-2xl bg-black/40 border border-white/5 space-y-1">
                    <div className="text-[9px] font-mono font-bold text-amber-400/90 uppercase tracking-wider">AGENDA / TOPIC</div>
                    <p className="text-xs text-neutral-300 font-outfit line-clamp-2 leading-relaxed">
                      {preset.topic}
                    </p>
                  </div>

                  <p className="text-xs text-neutral-400 font-outfit line-clamp-2 leading-relaxed">
                    {preset.description}
                  </p>
                </div>

                <div className="pt-2">
                  <button
                    type="button"
                    onClick={() => handleLaunchPreset(preset)}
                    className="w-full py-2.5 rounded-xl bg-white/[0.04] hover:bg-gradient-to-r hover:from-amber-500 hover:to-amber-400 hover:text-black text-neutral-200 text-xs font-bold font-space transition flex items-center justify-center gap-1.5 cursor-pointer border border-white/10 hover:border-transparent hover:shadow-[0_0_20px_rgba(245,158,11,0.3)]"
                  >
                    <span>Launch Chamber Dais</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* ── 5. PROCEDURAL ARCHITECTURE: HOW ZEN.COMMITTEE OPERATES ── */}
        <section className="p-8 rounded-3xl bg-[#060a14]/90 border border-white/[0.08] shadow-[0_15px_50px_rgba(0,0,0,0.5)] backdrop-blur-xl space-y-6">
          <div className="space-y-1 border-b border-white/[0.08] pb-4">
            <div className="text-[10px] font-mono font-bold uppercase tracking-[0.2em] text-cyan-400">
              PROCEDURAL ENGINES
            </div>
            <h3 className="text-2xl font-black font-space text-white tracking-tight uppercase">
              The 4 Pillars of the Committee Dais
            </h3>
            <p className="text-xs text-neutral-400 font-outfit">
              Everything required to run formal parliamentary sessions and diplomatic conferences with zero lag.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="p-5 rounded-2xl bg-white/[0.02] border border-white/[0.06] space-y-2.5">
              <div className="w-9 h-9 rounded-xl bg-amber-500/15 border border-amber-500/30 flex items-center justify-center text-amber-400">
                <Clock className="w-4 h-4" />
              </div>
              <h4 className="text-sm font-black font-space text-white">General Speakers&apos; List</h4>
              <p className="text-xs text-neutral-400 font-outfit leading-relaxed">
                Continuous speaker queue with procedural yields to the Chair, to other delegates, or to points of information.
              </p>
            </div>

            <div className="p-5 rounded-2xl bg-white/[0.02] border border-white/[0.06] space-y-2.5">
              <div className="w-9 h-9 rounded-xl bg-cyan-500/15 border border-cyan-500/30 flex items-center justify-center text-cyan-400">
                <Flame className="w-4 h-4" />
              </div>
              <h4 className="text-sm font-black font-space text-white">Moderated Caucuses</h4>
              <p className="text-xs text-neutral-400 font-outfit leading-relaxed">
                Focused thematic debate with custom total caucus timers, individual slot durations, and automated speaker queues.
              </p>
            </div>

            <div className="p-5 rounded-2xl bg-white/[0.02] border border-white/[0.06] space-y-2.5">
              <div className="w-9 h-9 rounded-xl bg-purple-500/15 border border-purple-500/30 flex items-center justify-center text-purple-400">
                <FileText className="w-4 h-4" />
              </div>
              <h4 className="text-sm font-black font-space text-white">Resolution &amp; Working Papers</h4>
              <p className="text-xs text-neutral-400 font-outfit leading-relaxed">
                Document introduction runners, preambulatory and operative clauses, formal amendments, and review phases.
              </p>
            </div>

            <div className="p-5 rounded-2xl bg-white/[0.02] border border-white/[0.06] space-y-2.5">
              <div className="w-9 h-9 rounded-xl bg-emerald-500/15 border border-emerald-500/30 flex items-center justify-center text-emerald-400">
                <Vote className="w-4 h-4" />
              </div>
              <h4 className="text-sm font-black font-space text-white">Substantive Roll-Call</h4>
              <p className="text-xs text-neutral-400 font-outfit leading-relaxed">
                Official roll-call voting with options for In Favor, Against, Abstain, Pass, and With Rights, with P5 veto protection.
              </p>
            </div>
          </div>
        </section>

        {/* ── 6. CONNECTED SUITE CROSSWAYS (ZEN.MUN & ZEN.HOST) ── */}
        <section className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="p-6 sm:p-7 rounded-3xl bg-gradient-to-br from-cyan-950/30 via-[#060a14] to-black border border-cyan-500/20 flex flex-col justify-between space-y-4 backdrop-blur-xl">
            <div className="space-y-2">
              <div className="text-[10px] font-mono font-bold uppercase tracking-[0.2em] text-cyan-400">
                CONFERENCE PLATFORM
              </div>
              <h3 className="text-xl font-black font-space text-white">ZEN.MUN Conference Suite</h3>
              <p className="text-xs text-neutral-400 font-outfit leading-relaxed">
                Explore full conference matrices, delegate allotment rosters, digital diplomatic chits, awards, and post-conference reports.
              </p>
            </div>
            <Link
              href="/mun"
              className="px-5 py-2.5 rounded-xl bg-cyan-500/20 hover:bg-cyan-500/30 border border-cyan-400/40 text-cyan-300 font-bold font-space text-xs uppercase tracking-wider transition w-fit flex items-center gap-2"
            >
              <span>Explore ZEN.MUN &rarr;</span>
            </Link>
          </div>

          <div className="p-6 sm:p-7 rounded-3xl bg-gradient-to-br from-amber-950/30 via-[#060a14] to-black border border-amber-500/20 flex flex-col justify-between space-y-4 backdrop-blur-xl">
            <div className="space-y-2">
              <div className="text-[10px] font-mono font-bold uppercase tracking-[0.2em] text-amber-400">
                STAGE INFRASTRUCTURE
              </div>
              <h3 className="text-xl font-black font-space text-white">ZEN.HOST Universal Dais</h3>
              <p className="text-xs text-neutral-400 font-outfit leading-relaxed">
                Need a live stage for open mics, workshops, keynote panels, storylines, or pitch competitions? Switch to the universal engine.
              </p>
            </div>
            <Link
              href="/host"
              className="px-5 py-2.5 rounded-xl bg-amber-500/20 hover:bg-amber-500/30 border border-amber-400/40 text-amber-300 font-bold font-space text-xs uppercase tracking-wider transition w-fit flex items-center gap-2"
            >
              <span>Switch to ZEN.HOST &rarr;</span>
            </Link>
          </div>
        </section>
      </div>

      {/* ── CUSTOM CHAMBER CREATOR MODAL ── */}
      {isCustomCreatorOpen && (
        <div className="fixed inset-0 z-50 bg-black/85 backdrop-blur-md flex items-center justify-center p-4 animate-fade-in">
          <div className="w-full max-w-lg rounded-3xl bg-[#060a14] border border-amber-500/30 p-6 sm:p-8 space-y-5 text-white shadow-2xl">
            <div className="flex items-center justify-between border-b border-white/10 pb-3">
              <div className="space-y-0.5">
                <div className="text-[10px] font-mono font-bold uppercase tracking-wider text-amber-400">
                  CHAMBER ARCHITECT
                </div>
                <h3 className="text-lg font-black font-space uppercase tracking-tight">Configure Custom Chamber</h3>
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
                  className="w-full px-3.5 py-2 rounded-xl bg-black/60 border border-white/15 text-xs text-white focus:outline-none focus:border-amber-400 font-outfit"
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
                    className="w-full px-3.5 py-2 rounded-xl bg-black/60 border border-white/15 text-xs font-mono font-bold text-amber-300 focus:outline-none focus:border-amber-400"
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
                    className="w-full px-3.5 py-2 rounded-xl bg-black/60 border border-white/15 text-xs font-mono font-bold text-white focus:outline-none focus:border-amber-400"
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
                  className="w-full px-3.5 py-2 rounded-xl bg-black/60 border border-white/15 text-xs text-white focus:outline-none focus:border-amber-400 font-outfit resize-none"
                />
              </div>

              <div className="flex items-center justify-between p-3 rounded-xl bg-black/40 border border-white/10">
                <div>
                  <div className="text-xs font-bold text-white">Indian Parliamentary Rules</div>
                  <div className="text-[10px] text-neutral-400">Enable Lok Sabha emblem and Zero Hour procedure</div>
                </div>
                <input
                  type="checkbox"
                  checked={customIsIndian}
                  onChange={(e) => setCustomIsIndian(e.target.checked)}
                  className="w-5 h-5 accent-amber-400 cursor-pointer"
                />
              </div>

              <div className="pt-2">
                <button
                  type="submit"
                  className="w-full py-3 rounded-2xl bg-gradient-to-r from-amber-500 to-amber-400 hover:brightness-110 text-black font-black font-space text-xs uppercase tracking-wider transition shadow-lg shadow-amber-500/25 active:scale-95 cursor-pointer"
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
    <Suspense fallback={<div className="min-h-screen bg-[#020409] text-white flex items-center justify-center font-mono text-xs">Connecting to Diplomatic Presidium...</div>}>
      <CommitteePortalInner />
    </Suspense>
  );
}
