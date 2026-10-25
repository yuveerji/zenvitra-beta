'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import {
  Gavel,
  Shield,
  Sparkles,
  Users,
  Play,
  KeyRound,
  ArrowRight,
  Landmark,
  FileText,
  Clock,
  Radio,
  BookOpen,
  Scale,
  Scroll,
  Plus,
  X,
  Search,
  Globe2,
  Building2,
  Flame,
  CheckCircle2,
  SlidersHorizontal,
} from 'lucide-react';
import { DiasBadge } from './DiasBadge';
import { DiasButton } from './DiasButton';
import { DiasCard } from './DiasCard';

export interface CommitteePreset {
  id: string;
  name: string;
  acronym: string;
  category: 'Indian Parliamentary' | 'UN General Assembly' | 'Crisis & Security' | 'Specialized';
  topic: string;
  emblem: string;
  isIndian: boolean;
  speakingTimeSeconds: number;
  description: string;
  accentColor: string;
  ruleMode: string;
  seatsCount: number;
}

export const COMMITTEE_PRESETS: CommitteePreset[] = [
  // ── 1. INDIAN PARLIAMENTARY CHAMBERS ──
  {
    id: 'lok_sabha',
    name: 'Lok Sabha (House of the People)',
    acronym: 'LOK SABHA',
    category: 'Indian Parliamentary',
    topic: 'Delimitation of Constituencies, Federal Autonomy & Electoral Reforms',
    emblem: '🏛️',
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
    emblem: '🏛️',
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
    id: 'jpc',
    name: 'Joint Parliamentary Committee (JPC)',
    acronym: 'JPC',
    category: 'Indian Parliamentary',
    topic: 'Cross-Border Data Privacy Regulations & Sovereign AI Infrastructure',
    emblem: '📜',
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
    emblem: '⚖️',
    isIndian: true,
    speakingTimeSeconds: 120,
    seatsCount: 299,
    description: 'Historical constitutional drafting dais: Dr. B.R. Ambedkar, Jawaharlal Nehru, and provincial leaders shaping the Sovereign Republic.',
    accentColor: 'from-amber-700 to-yellow-800',
    ruleMode: 'Constituent Assembly Drafting Rules',
  },

  // ── 2. UNITED NATIONS & MULTILATERAL CHAMBERS ──
  {
    id: 'unsc',
    name: 'United Nations Security Council',
    acronym: 'UNSC',
    category: 'Crisis & Security',
    topic: 'Non-Proliferation, Cyber Warfare & Humanitarian Ceasefire Protocols',
    emblem: '🌐',
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
    topic: 'Regulation of Autonomous Weapons Systems & Militarization of AI',
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
    category: 'Specialized',
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
    id: 'ccs',
    name: 'Cabinet Committee on Security (CCS)',
    acronym: 'CCS',
    category: 'Crisis & Security',
    topic: 'Northern Border Preparedness, Cyber Espionage & Defense Directives',
    emblem: '🛡️',
    isIndian: true,
    speakingTimeSeconds: 60,
    seatsCount: 12,
    description: 'Apex national executive body: Prime Minister, Home, Defence, External Affairs & Finance Ministers, with covert intelligence briefings.',
    accentColor: 'from-amber-600 to-yellow-600',
    ruleMode: 'Cabinet Executive Confidential Directives',
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
    category: 'Specialized',
    topic: 'National Green Hydrogen Mission, Semiconductor Fabs & State GDP Targets',
    emblem: '📊',
    isIndian: true,
    speakingTimeSeconds: 90,
    seatsCount: 36,
    description: 'Chief Ministers, Lieutenant Governors, and union domain experts charting competitive and cooperative federal economic roadmaps.',
    accentColor: 'from-emerald-500 to-green-600',
    ruleMode: 'Governing Council Consultative Procedure',
  },
];

export const CommitteeFleetSection: React.FC = () => {
  const router = useRouter();

  const [activeCategory, setActiveCategory] = useState<'ALL' | 'INDIAN' | 'UN' | 'CRISIS' | 'SPECIALIZED'>('ALL');
  const [searchQuery, setSearchQuery] = useState('');
  const [sessionCodeInput, setSessionCodeInput] = useState('');

  // Custom Chamber Creator Modal State
  const [isCustomCreatorOpen, setIsCustomCreatorOpen] = useState(false);
  const [customName, setCustomName] = useState('');
  const [customAcronym, setCustomAcronym] = useState('');
  const [customTopic, setCustomTopic] = useState('');
  const [customSpeakingTime, setCustomSpeakingTime] = useState('90');
  const [customIsIndian, setCustomIsIndian] = useState(true);

  // Active Session Stored in localStorage
  const [storedSession, setStoredSession] = useState<{
    sessionCode: string;
    committeeName: string;
    topic: string;
  } | null>(null);

  useEffect(() => {
    if (typeof window === 'undefined') return;
    try {
      const raw = localStorage.getItem('zenvitra_dias_active_session');
      if (raw) {
        const parsed = JSON.parse(raw);
        if (parsed?.sessionCode && parsed?.committeeName) {
          setStoredSession(parsed);
        }
      }
    } catch {}
  }, []);

  const filteredPresets = COMMITTEE_PRESETS.filter((p) => {
    const matchesCategory =
      activeCategory === 'ALL' ||
      (activeCategory === 'INDIAN' && p.category === 'Indian Parliamentary') ||
      (activeCategory === 'UN' && p.category === 'UN General Assembly') ||
      (activeCategory === 'CRISIS' && p.category === 'Crisis & Security') ||
      (activeCategory === 'SPECIALIZED' && p.category === 'Specialized');

    const matchesSearch =
      searchQuery.trim() === '' ||
      p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.acronym.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.topic.toLowerCase().includes(searchQuery.toLowerCase());

    return matchesCategory && matchesSearch;
  });

  const handleLaunchPreset = (preset: CommitteePreset) => {
    const sessionCode = `${preset.acronym.replace(/[^A-Z0-9]/g, '').slice(0, 4)}${Math.floor(10 + Math.random() * 90)}`;
    const sessionData = {
      sessionCode,
      committeeName: preset.name,
      committeeAcronym: preset.acronym,
      topic: preset.topic,
      isIndianCommittee: preset.isIndian,
      speakingTimeSeconds: preset.speakingTimeSeconds,
      remainingSeconds: preset.speakingTimeSeconds,
      sessionState: 'setup',
    };
    if (typeof window !== 'undefined') {
      localStorage.setItem('zenvitra_dias_active_session', JSON.stringify(sessionData));
      localStorage.setItem('zenvitra_zenmun_live_session_v1', JSON.stringify(sessionData));
    }
    router.push(`/dias/${sessionCode}`);
  };

  const handleJoinByCode = (e: React.FormEvent) => {
    e.preventDefault();
    const clean = sessionCodeInput.trim().toUpperCase();
    if (clean) {
      router.push(`/dias/${clean}`);
    }
  };

  const handleCreateCustom = (e: React.FormEvent) => {
    e.preventDefault();
    if (!customName.trim()) return;

    const acronym = (customAcronym.trim() || customName.slice(0, 4)).toUpperCase();
    const sessionCode = `${acronym.replace(/[^A-Z0-9]/g, '').slice(0, 4)}${Math.floor(100 + Math.random() * 900)}`;
    const timeSec = parseInt(customSpeakingTime, 10) || 90;
    const sessionData = {
      sessionCode,
      committeeName: customName.trim(),
      committeeAcronym: acronym,
      topic: customTopic.trim() || 'General Diplomatic Deliberation',
      isIndianCommittee: customIsIndian,
      speakingTimeSeconds: timeSec,
      remainingSeconds: timeSec,
      sessionState: 'setup',
    };

    if (typeof window !== 'undefined') {
      localStorage.setItem('zenvitra_dias_active_session', JSON.stringify(sessionData));
      localStorage.setItem('zenvitra_zenmun_live_session_v1', JSON.stringify(sessionData));
    }
    setIsCustomCreatorOpen(false);
    router.push(`/dias/${sessionCode}`);
  };

  return (
    <section id="fleet" className="py-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10">
      {/* Active Stored Session Banner */}
      {storedSession && (
        <div className="p-4 rounded-2xl bg-[#C5A46D]/10 border border-[#C5A46D]/30 flex flex-col sm:flex-row items-center justify-between gap-4 text-left">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-[#C5A46D]/20 border border-[#C5A46D]/40 flex items-center justify-center text-[#E6D1A5]">
              <Radio className="w-5 h-5 animate-pulse" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-[10px] font-mono uppercase px-2 py-0.5 rounded bg-[#C5A46D]/20 text-[#E6D1A5] font-bold">
                  ACTIVE CHAMBER DETECTED
                </span>
                <span className="text-xs font-mono text-[#9A9DA5]">Code: {storedSession.sessionCode}</span>
              </div>
              <h3 className="text-sm font-semibold text-[#F4F2ED]">{storedSession.committeeName}</h3>
              <p className="text-xs text-[#9A9DA5] line-clamp-1">{storedSession.topic}</p>
            </div>
          </div>
          <Link href={`/dias/${storedSession.sessionCode}`}>
            <DiasButton variant="gold" size="sm" rightIcon={<ArrowRight className="w-3.5 h-3.5" />}>
              Rejoin Session
            </DiasButton>
          </Link>
        </div>
      )}

      {/* Header & Controls */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 pb-6 border-b border-[#181B21]">
        <div className="space-y-2 text-left">
          <DiasBadge variant="gold" size="sm">
            COMMITTEE FLEET & SUMMIT CHAMBERS
          </DiasBadge>
          <h2 className="text-3xl sm:text-4xl font-serif text-[#F4F2ED]">
            Select Chamber or <span className="italic text-[#C5A46D]">Launch Live Dais.</span>
          </h2>
          <p className="text-sm text-[#9A9DA5] max-w-2xl font-light">
            Deploy full Indian Parliamentary procedures, UN Multilateral chambers, or Crisis Directives in one click. Fully synchronized with zero latency.
          </p>
        </div>

        {/* Join With Code & Custom Chamber Buttons */}
        <div className="flex flex-wrap items-center gap-3">
          <form onSubmit={handleJoinByCode} className="flex items-center gap-2">
            <div className="relative">
              <KeyRound className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-[#575B66]" />
              <input
                type="text"
                value={sessionCodeInput}
                onChange={(e) => setSessionCodeInput(e.target.value)}
                placeholder="Passcode / IF8RV5"
                className="h-10 pl-9 pr-3 bg-[#111318] border border-[#232731] focus:border-[#C5A46D] rounded-xl text-xs font-mono text-[#F4F2ED] uppercase tracking-wider outline-none w-44"
              />
            </div>
            <DiasButton type="submit" variant="charcoal" size="sm">
              Enter
            </DiasButton>
          </form>

          <DiasButton
            onClick={() => setIsCustomCreatorOpen(true)}
            variant="gold"
            size="sm"
            leftIcon={<Plus className="w-3.5 h-3.5" />}
          >
            Create Chamber
          </DiasButton>
        </div>
      </div>

      {/* Filter Tabs & Search Bar */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
        {/* Category Tabs */}
        <div className="flex items-center gap-1.5 p-1 rounded-xl bg-[#111318] border border-[#181B21] overflow-x-auto w-full sm:w-auto">
          {[
            { id: 'ALL', label: 'All Chambers' },
            { id: 'INDIAN', label: 'Indian Parliament' },
            { id: 'UN', label: 'UN Multilateral' },
            { id: 'CRISIS', label: 'Crisis & Security' },
            { id: 'SPECIALIZED', label: 'Specialized' },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveCategory(tab.id as any)}
              className={`px-4 py-2 rounded-full text-xs font-semibold transition-all duration-200 whitespace-nowrap cursor-pointer hover:scale-[1.02] active:scale-[0.98] ${
                activeCategory === tab.id
                  ? 'bg-[#C5A46D] text-[#08090B] font-bold shadow-[0_0_20px_rgba(197,164,109,0.3)]'
                  : 'text-[#9A9DA5] hover:text-[#F4F2ED] hover:bg-white/[0.06]'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Search Input */}
        <div className="relative w-full sm:w-64">
          <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-[#575B66]" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search by name, topic..."
            className="w-full h-9 pl-9 pr-3 bg-[#111318] border border-[#232731] focus:border-[#C5A46D] rounded-xl text-xs text-[#F4F2ED] outline-none placeholder-[#575B66]"
          />
        </div>
      </div>

      {/* Committee Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredPresets.map((preset) => (
          <DiasCard
            key={preset.id}
            variant="elevated"
            isHoverable
            className="p-6 flex flex-col justify-between text-left space-y-4 border border-[#181B21] hover:border-[#C5A46D]/40 transition-all duration-300"
          >
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2.5">
                  <span className="text-2xl">{preset.emblem}</span>
                  <div>
                    <span className="text-[10px] font-mono uppercase tracking-wider text-[#C5A46D] font-bold block">
                      {preset.acronym}
                    </span>
                    <h3 className="text-sm font-semibold text-[#F4F2ED] line-clamp-1">{preset.name}</h3>
                  </div>
                </div>
                <DiasBadge variant={preset.isIndian ? 'gold' : 'charcoal'} size="sm">
                  {preset.category}
                </DiasBadge>
              </div>

              {/* Topic Box */}
              <div className="p-3 rounded-xl bg-[#08090B] border border-[#181B21] space-y-1">
                <span className="text-[10px] font-mono uppercase text-[#575B66]">Agenda Topic</span>
                <p className="text-xs text-[#F4F2ED] line-clamp-2 font-medium">{preset.topic}</p>
              </div>

              <p className="text-xs text-[#9A9DA5] leading-relaxed line-clamp-2">{preset.description}</p>
            </div>

            <div className="pt-4 border-t border-[#181B21] space-y-3">
              <div className="flex items-center justify-between text-[11px] font-mono text-[#9A9DA5]">
                <span className="flex items-center gap-1.5">
                  <Clock className="w-3.5 h-3.5 text-[#C5A46D]" />
                  {preset.speakingTimeSeconds}s Speaking Time
                </span>
                <span className="flex items-center gap-1.5">
                  <Users className="w-3.5 h-3.5 text-[#575B66]" />
                  {preset.seatsCount} Seats
                </span>
              </div>

              <div className="flex items-center gap-2">
                <DiasButton
                  onClick={() => handleLaunchPreset(preset)}
                  variant="gold"
                  size="sm"
                  className="flex-1 justify-center"
                  leftIcon={<Play className="w-3.5 h-3.5" />}
                >
                  Launch Chamber
                </DiasButton>
                <Link href={`/dias?create=true&chamber=${preset.id}`} title="Customize in Setup Studio">
                  <DiasButton variant="charcoal" size="sm" className="px-3">
                    <SlidersHorizontal className="w-3.5 h-3.5" />
                  </DiasButton>
                </Link>
              </div>
            </div>
          </DiasCard>
        ))}
      </div>

      {/* ── Custom Chamber Creator Modal ── */}
      {isCustomCreatorOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-fadeIn">
          <div className="bg-[#111318] border border-[#232731] rounded-2xl p-6 max-w-lg w-full text-left space-y-5 shadow-2xl">
            <div className="flex items-center justify-between pb-3 border-b border-[#181B21]">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-lg bg-[#C5A46D]/15 flex items-center justify-center text-[#C5A46D]">
                  <Gavel className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="text-base font-semibold text-[#F4F2ED]">Create Custom Dais Chamber</h3>
                  <p className="text-xs text-[#9A9DA5]">Configure a bespoke legislative or diplomatic floor</p>
                </div>
              </div>
              <button
                onClick={() => setIsCustomCreatorOpen(false)}
                className="p-1 rounded-lg text-[#9A9DA5] hover:text-white transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCreateCustom} className="space-y-4">
              <div>
                <label className="text-xs text-[#9A9DA5] block mb-1">Chamber Name</label>
                <input
                  required
                  value={customName}
                  onChange={(e) => setCustomName(e.target.value)}
                  placeholder="e.g. United Nations Security Council or Lok Sabha"
                  className="w-full h-10 px-3 bg-[#08090B] border border-[#232731] focus:border-[#C5A46D] rounded-xl text-xs text-[#F4F2ED] outline-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs text-[#9A9DA5] block mb-1">Acronym</label>
                  <input
                    value={customAcronym}
                    onChange={(e) => setCustomAcronym(e.target.value)}
                    placeholder="e.g. UNSC or LS"
                    className="w-full h-10 px-3 bg-[#08090B] border border-[#232731] focus:border-[#C5A46D] rounded-xl text-xs text-[#F4F2ED] uppercase outline-none"
                  />
                </div>
                <div>
                  <label className="text-xs text-[#9A9DA5] block mb-1">Speaking Time (Sec)</label>
                  <input
                    type="number"
                    min="30"
                    max="300"
                    value={customSpeakingTime}
                    onChange={(e) => setCustomSpeakingTime(e.target.value)}
                    className="w-full h-10 px-3 bg-[#08090B] border border-[#232731] focus:border-[#C5A46D] rounded-xl text-xs text-[#F4F2ED] outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="text-xs text-[#9A9DA5] block mb-1">Deliberation Topic / Agenda</label>
                <input
                  value={customTopic}
                  onChange={(e) => setCustomTopic(e.target.value)}
                  placeholder="e.g. Crisis Escalation in Eastern Mediterranean"
                  className="w-full h-10 px-3 bg-[#08090B] border border-[#232731] focus:border-[#C5A46D] rounded-xl text-xs text-[#F4F2ED] outline-none"
                />
              </div>

              <div className="p-3 rounded-xl bg-[#08090B] border border-[#181B21] flex items-center justify-between">
                <div className="space-y-0.5">
                  <span className="text-xs font-medium text-[#F4F2ED] block">Indian Parliamentary Mode</span>
                  <span className="text-[11px] text-[#9A9DA5] block">
                    Enables clause-by-clause bill drafting, amendment deck, and Question Hour.
                  </span>
                </div>
                <input
                  type="checkbox"
                  checked={customIsIndian}
                  onChange={(e) => setCustomIsIndian(e.target.checked)}
                  className="w-4 h-4 accent-[#C5A46D] rounded cursor-pointer"
                />
              </div>

              <div className="pt-3 border-t border-[#181B21] flex items-center justify-end gap-3">
                <DiasButton
                  type="button"
                  variant="charcoal"
                  size="sm"
                  onClick={() => setIsCustomCreatorOpen(false)}
                >
                  Cancel
                </DiasButton>
                <DiasButton type="submit" variant="gold" size="sm">
                  Launch Custom Chamber
                </DiasButton>
              </div>
            </form>
          </div>
        </div>
      )}
    </section>
  );
};
