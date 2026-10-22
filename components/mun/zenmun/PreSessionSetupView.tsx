'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import {
  Globe,
  Gavel,
  Lock,
  Plus,
  X,
  Search,
  Wand2,
  FileText,
  ChevronLeft,
  Check,
} from 'lucide-react';
import { PRESET_COMMITTEES, QUICK_BLOC_BUNDLES, ZenDelegate } from '@/types/zenMun';
import { useZenMun, generateSessionCode } from '@/context/ZenMunContext';

// Comprehensive ISO 3166-1 alpha-2 mapping for accurate FlagCDN resolution
const COUNTRY_CODE_MAP: Record<string, string> = {
  // P5 & Major Powers
  'united states': 'us',
  'united states of america': 'us',
  'usa': 'us',
  'united kingdom': 'gb',
  'uk': 'gb',
  'great britain': 'gb',
  'britain': 'gb',
  'france': 'fr',
  'russian federation': 'ru',
  'russia': 'ru',
  'china': 'cn',
  "people's republic of china": 'cn',
  'prc': 'cn',
  'india': 'in',
  'germany': 'de',
  'japan': 'jp',
  'italy': 'it',
  'canada': 'ca',
  'brazil': 'br',
  'south africa': 'za',
  'australia': 'au',
  'argentina': 'ar',
  'mexico': 'mx',
  'indonesia': 'id',
  'saudi arabia': 'sa',
  'turkey': 'tr',
  'türkiye': 'tr',
  'south korea': 'kr',
  'republic of korea': 'kr',
  'korea': 'kr',
  'north korea': 'kp',
  'dprk': 'kp',
  'egypt': 'eg',
  'spain': 'es',
  'netherlands': 'nl',
  'switzerland': 'ch',
  'sweden': 'se',
  'poland': 'pl',
  'belgium': 'be',
  'norway': 'no',
  'austria': 'at',
  'iran': 'ir',
  'iraq': 'iq',
  'israel': 'il',
  'palestine': 'ps',
  'ukraine': 'ua',
  'vietnam': 'vn',
  'thailand': 'th',
  'singapore': 'sg',
  'malaysia': 'my',
  'philippines': 'ph',
  'pakistan': 'pk',
  'bangladesh': 'bd',
  'nigeria': 'ng',
  'kenya': 'ke',
  'colombia': 'co',
  'chile': 'cl',
  'peru': 'pe',
  'venezuela': 've',
  'greece': 'gr',
  'portugal': 'pt',
  'denmark': 'dk',
  'finland': 'fi',
  'ireland': 'ie',
  'czech republic': 'cz',
  'czechia': 'cz',
  'hungary': 'hu',
  'romania': 'ro',
  'new zealand': 'nz',
  'united arab emirates': 'ae',
  'uae': 'ae',
  'qatar': 'qa',
  'kuwait': 'kw',
  'oman': 'om',
  'algeria': 'dz',
  'morocco': 'ma',
  'ethiopia': 'et',
  'ghana': 'gh',
  'cuba': 'cu',
  'syria': 'sy',
  'lebanon': 'lb',
  'jordan': 'jo',
  'yemen': 'ye',

  // Indian States & Territories (Flagged with Indian Tricolor)
  'uttar pradesh': 'in',
  'maharashtra': 'in',
  'bihar': 'in',
  'west bengal': 'in',
  'madhya pradesh': 'in',
  'tamil nadu': 'in',
  'rajasthan': 'in',
  'gujarat': 'in',
  'karnataka': 'in',
  'andhra pradesh': 'in',
  'odisha': 'in',
  'kerala': 'in',
  'telangana': 'in',
  'punjab': 'in',
  'assam': 'in',
  'haryana': 'in',
  'delhi': 'in',
  'jammu & kashmir': 'in',
  'jammu and kashmir': 'in',
  'j&k': 'in',
  'ladakh': 'in',
  'goa': 'in',
  'uttarakhand': 'in',
  'himachal pradesh': 'in',
  'jharkhand': 'in',
  'chhattisgarh': 'in',

  // Indian Political Parties & Coalitions
  'bjp': 'in',
  'bharatiya janata party': 'in',
  'inc': 'in',
  'congress': 'in',
  'indian national congress': 'in',
  'aap': 'in',
  'aam aadmi party': 'in',
  'sp': 'in',
  'samajwadi party': 'in',
  'tmc': 'in',
  'aitc': 'in',
  'trinamool': 'in',
  'trinamool congress': 'in',
  'dmk': 'in',
  'dravida munnetra kazhagam': 'in',
  'tdp': 'in',
  'telugu desam party': 'in',
  'jdu': 'in',
  'jd(u)': 'in',
  'janata dal united': 'in',
  'shiv sena': 'in',
  'shiv sena (ubt)': 'in',
  'shiv sena (shinde)': 'in',
  'ncp': 'in',
  'ncp (sp)': 'in',
  'rjd': 'in',
  'rashtriya janata dal': 'in',
  'ysrcp': 'in',
  'bjd': 'in',
  'cpi': 'in',
  'cpim': 'in',
  'cpi(m)': 'in',
  'jmm': 'in',
  'ljp': 'in',
  'jana sena': 'in',
  'nda': 'in',
  'nda bloc': 'in',
  'india bloc': 'in',
  'i.n.d.i.a': 'in',

  // Indian Ministries & Executive Organs
  'pmo': 'in',
  "prime minister's office": 'in',
  'mha': 'in',
  'ministry of home affairs': 'in',
  'mea': 'in',
  'ministry of external affairs': 'in',
  'mod': 'in',
  'ministry of defence': 'in',
  'mof': 'in',
  'ministry of finance': 'in',
  'nsa': 'in',
  'national security advisor': 'in',
  'meity': 'in',
  'law commission': 'in',
  'niti aayog': 'in',

  // South Asian & Regional Partners
  'sri lanka': 'lk',
  'nepal': 'np',
  'bhutan': 'bt',
  'maldives': 'mv',
  'afghanistan': 'af',
  'myanmar': 'mm',
  'kazakhstan': 'kz',
  'kyrgyzstan': 'kg',
  'tajikistan': 'tj',
  'uzbekistan': 'uz',
  'belarus': 'by',
};

function resolveCountryCode(name: string): string {
  const clean = name.trim().toLowerCase();
  if (COUNTRY_CODE_MAP[clean]) {
    return COUNTRY_CODE_MAP[clean];
  }
  // Try partial word match
  for (const [key, code] of Object.entries(COUNTRY_CODE_MAP)) {
    if (clean.includes(key) || key.includes(clean)) {
      return code;
    }
  }
  // Fallback to first 2 letters
  const alphaOnly = clean.replace(/[^a-z]/g, '');
  return alphaOnly.length >= 2 ? alphaOnly.substring(0, 2) : 'un';
}

interface PreSessionSetupViewProps {
  onStartSession: () => void;
  onBack?: () => void;
}

export function PreSessionSetupView({ onStartSession, onBack }: PreSessionSetupViewProps) {
  const router = useRouter();
  const { session, setSession } = useZenMun();

  // Step 1: Committee Details
  const [committeeName, setCommitteeName] = useState(session.committeeName || '');
  const [acronym, setAcronym] = useState(session.committeeAcronym || '');
  const [topic, setTopic] = useState(session.topic || '');
  const [emblem, setEmblem] = useState(session.emblemUrl || '/assets/committees/un.svg');
  const [isIndian, setIsIndian] = useState(Boolean(session.isIndianCommittee));

  // Chairs list
  const [chairInput, setChairInput] = useState('');
  const [chairs, setChairs] = useState<string[]>(
    session.chairName && session.chairName !== 'Chair' ? [session.chairName] : []
  );

  // Step 2: Delegations
  const [searchCountry, setSearchCountry] = useState('');
  const [pasteList, setPasteList] = useState('');
  const [delegations, setDelegations] = useState<ZenDelegate[]>(session.roster || []);
  const [autocompleteOpen, setAutocompleteOpen] = useState(false);
  const [blocTab, setBlocTab] = useState<'all' | 'indian' | 'international'>(
    session.isIndianCommittee ? 'indian' : 'all'
  );

  // Committee Autocomplete Filter
  const filteredPresets = PRESET_COMMITTEES.filter(
    (p) =>
      !committeeName ||
      p.name.toLowerCase().includes(committeeName.toLowerCase()) ||
      p.acronym.toLowerCase().includes(committeeName.toLowerCase())
  );

  const handleSelectPreset = (p: typeof PRESET_COMMITTEES[0]) => {
    setCommitteeName(p.name);
    setAcronym(p.acronym);
    setEmblem(p.emblem);
    const ind = Boolean(p.isIndian);
    setIsIndian(ind);
    if (ind) {
      setBlocTab('indian');
    }
    setAutocompleteOpen(false);
  };

  const handleAddChair = () => {
    const clean = chairInput.trim();
    if (!clean) return;
    if (!chairs.includes(clean)) {
      setChairs((prev) => [...prev, clean]);
    }
    setChairInput('');
  };

  const handleRemoveChair = (index: number) => {
    setChairs((prev) => prev.filter((_, i) => i !== index));
  };

  const handleAddCountry = (name: string, isObserver = false, customCode?: string) => {
    const clean = name.trim();
    if (!clean) return;
    if (delegations.some((d) => d.name.toLowerCase() === clean.toLowerCase())) return;

    const id = `del_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`;
    const code = customCode || resolveCountryCode(clean);
    const isP5Country = ['us', 'gb', 'fr', 'ru', 'cn'].includes(code);

    const newDel: ZenDelegate = {
      id,
      name: clean,
      countryCode: code,
      role: isObserver ? 'observer' : 'member',
      attendance: 'present',
      isP5: isP5Country,
    };
    setDelegations((prev) => [...prev, newDel]);
    setSearchCountry('');
  };

  const handleAddBundle = (bundle: typeof QUICK_BLOC_BUNDLES[0]) => {
    const existing = new Set(delegations.map((d) => d.name.toLowerCase()));
    const toAdd: ZenDelegate[] = [];
    bundle.countries.forEach((c) => {
      if (!existing.has(c.name.toLowerCase())) {
        toAdd.push({
          id: `del_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`,
          name: c.name,
          countryCode: c.code,
          role: 'member',
          attendance: 'present',
          isP5: Boolean(c.isP5),
        });
        existing.add(c.name.toLowerCase());
      }
    });
    setDelegations((prev) => [...prev, ...toAdd]);
  };

  const handleAutoMatchAndAdd = () => {
    if (!pasteList.trim()) return;
    const lines = pasteList
      .split(/[\n,;]+/)
      .map((s) => s.trim())
      .filter(Boolean);

    const existing = new Set(delegations.map((d) => d.name.toLowerCase()));
    const toAdd: ZenDelegate[] = [];

    lines.forEach((line) => {
      const isObs =
        line.toLowerCase().includes('(obs') ||
        line.toLowerCase().includes('observer') ||
        line.toLowerCase().includes('[obs]');
      const cleanName = line
        .replace(/\((obs|observer)\)/gi, '')
        .replace(/\[(obs|observer)\]/gi, '')
        .trim();

      if (cleanName && !existing.has(cleanName.toLowerCase())) {
        const code = resolveCountryCode(cleanName);
        const isP5Country = ['us', 'gb', 'fr', 'ru', 'cn'].includes(code);
        toAdd.push({
          id: `del_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`,
          name: cleanName,
          countryCode: code,
          role: isObs ? 'observer' : 'member',
          attendance: 'present',
          isP5: isP5Country,
        });
        existing.add(cleanName.toLowerCase());
      }
    });

    setDelegations((prev) => [...prev, ...toAdd]);
    setPasteList('');
  };

  const handleRemoveDelegation = (id: string) => {
    setDelegations((prev) => prev.filter((d) => d.id !== id));
  };

  const handleBackNavigation = () => {
    if (onBack) {
      onBack();
    } else {
      router.push('/committee');
    }
  };

  // Readiness validation
  const isReadyToStart = committeeName.trim().length > 0 && delegations.length > 0;

  const handleLaunch = () => {
    if (!isReadyToStart) return;

    const finalDelegates = delegations;
    const firstQueue = finalDelegates.slice(0, 4).map((d) => d.id);
    const cleanAcronym = (acronym.trim() || committeeName.trim() || 'LOK SABHA').replace(/_/g, ' ');
    const isInd = Boolean(isIndian || cleanAcronym.toLowerCase().includes('lok'));
    const emblemToUse = isInd
      ? '/assets/committees/emblem_of_india.svg'
      : (emblem || '/assets/committees/un.svg');

    const cleanCode =
      session.sessionCode && session.sessionCode !== 'PJL6KY'
        ? session.sessionCode
        : generateSessionCode();

    const updated = {
      ...session,
      sessionCode: cleanCode,
      chairName: chairs.length > 0 ? chairs.join(', ') : session.chairName || 'Chair',
      sessionState: 'in-session' as const,
      tutorial: {
        ...session.tutorial,
        welcomeModalOpen: false,
        isActive: false,
      },
      committeeName: (committeeName.trim() || 'United Nations Committee').replace(/_/g, ' '),
      committeeAcronym: cleanAcronym,
      topic: topic.trim() || 'General Floor Debate & Parliamentary Substantive Business',
      emblemUrl: emblemToUse,
      isIndianCommittee: isInd,
      roster: finalDelegates,
      speakerQueue: firstQueue,
      currentSpeakerId: firstQueue[0] || null,
      remainingSeconds: session.speakingTimeSeconds,
      isTimerRunning: false,
    };

    setSession(updated);
    try {
      localStorage.setItem('zenvitra_zenmun_live_session_v1', JSON.stringify(updated));
    } catch {}

    onStartSession();
  };

  return (
    <div className="min-h-screen bg-[#ede8df] text-[#2d2822] font-sans antialiased flex flex-col select-none">
      {/* Top Navbar matching Gavelling Header */}
      <header className="w-full bg-[#ede8df] border-b border-[#ded7ca]/70 px-4 sm:px-8 py-3.5 flex items-center justify-between z-30">
        <div className="flex items-center gap-4 sm:gap-6">
          {/* Logo Brand */}
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-lg bg-[#ded7cb] flex items-center justify-center text-[#5c4a3b]">
              <Gavel className="w-4 h-4" />
            </div>
            <div className="flex flex-col">
              <span className="font-serif font-black text-sm tracking-tight text-[#2d2822] leading-none">
                GAVELLING
              </span>
              <span className="text-[9px] font-bold text-[#8c7860] uppercase tracking-wider leading-none mt-0.5">
                The #1 MUN Ecosystem
              </span>
            </div>
          </div>

          {/* BACK Button */}
          <button
            type="button"
            onClick={handleBackNavigation}
            className="text-xs font-bold text-[#3f3b35] hover:text-black flex items-center gap-0.5 cursor-pointer transition uppercase tracking-wider pl-2"
          >
            <ChevronLeft className="w-4 h-4" />
            <span>BACK</span>
          </button>
        </div>

        {/* Right Section: Bridge to ZEN.HOST and Language */}
        <div className="flex items-center gap-3">
          <Link
            href="/host"
            className="hidden sm:flex text-xs font-semibold text-[#4a453e] hover:text-black bg-white/70 hover:bg-white border border-[#ded8cb] px-3 py-1.5 rounded-full transition items-center gap-1.5 shadow-2xs cursor-pointer"
          >
            <span>⚡</span>
            <span>Switch to ZEN.HOST</span>
          </Link>

          <div className="text-xs font-bold text-[#2d2822] flex items-center gap-1.5 px-2 py-1">
            <Globe className="w-4 h-4 text-[#3f3b35]" />
            <span>EN</span>
          </div>
        </div>
      </header>

      {/* Main 2-Column Split Stage */}
      <main className="flex-1 max-w-[1240px] w-full mx-auto p-4 sm:p-6 lg:p-8 grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Left Card: Committee & Delegations Setup */}
        <div className="lg:col-span-7 bg-white rounded-[26px] p-6 sm:p-8 border border-[#ded8cb] shadow-[0_4px_24px_rgba(0,0,0,0.03)] space-y-7">
          {/* STEP 1: COMMITTEE */}
          <div className="space-y-4">
            <div className="flex items-center gap-2.5">
              <span className="w-7 h-7 rounded-full bg-[#1b3d29] text-white font-bold text-xs flex items-center justify-center shrink-0">
                1
              </span>
              <h2 className="text-xl font-bold text-[#1f2421] tracking-tight">Committee</h2>
            </div>

            {/* Committee Live Preview Card */}
            <div className="p-4 rounded-2xl bg-[#fbfaf8] border border-[#ede7dc] flex items-center gap-4">
              <div className="w-16 h-16 rounded-full bg-white border border-[#e2dcd0] shadow-2xs flex items-center justify-center p-2.5 shrink-0 overflow-hidden">
                {isIndian || (acronym && acronym.toLowerCase().includes('lok')) ? (
                  <img
                    src="/assets/committees/emblem_of_india.svg"
                    alt="Emblem of India"
                    className="w-full h-full object-contain"
                  />
                ) : emblem.startsWith('/') || emblem.startsWith('http') ? (
                  <img src={emblem} alt="Emblem" className="w-full h-full object-contain" />
                ) : (
                  <span className="text-2xl">{emblem}</span>
                )}
              </div>
              <div className="flex-1 min-w-0">
                <div className="text-2xl font-black text-[#5c4a3b] tracking-tight leading-tight truncate">
                  {committeeName.trim() || 'Untitled committee'}
                </div>
                <div className="text-xs text-[#78716c] font-medium truncate mt-0.5">
                  <span className="font-bold text-[#967448]">Topic: </span>
                  <span>{topic.trim() || 'Your topic appears here'}</span>
                </div>
              </div>
            </div>

            {/* Two-Column Inputs: Committee Name & Topic */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 relative">
              <div className="relative">
                <label className="block text-[11px] font-bold text-[#64748b] tracking-wider uppercase mb-1.5">
                  COMMITTEE NAME
                </label>
                <input
                  type="text"
                  value={committeeName}
                  onChange={(e) => {
                    setCommitteeName(e.target.value);
                    setAutocompleteOpen(true);
                  }}
                  onFocus={() => setAutocompleteOpen(true)}
                  placeholder="e.g. Human Rights Council or HRC"
                  className="w-full px-4 py-3 rounded-xl bg-white border border-[#ded8cb] focus:border-[#1b3d29] focus:ring-1 focus:ring-[#1b3d29] text-sm font-semibold text-[#1f2937] placeholder:text-[#9ca3af] outline-none transition"
                />

                {/* Floating Autocomplete Dropdown */}
                {autocompleteOpen && filteredPresets.length > 0 && (
                  <div className="absolute top-18 left-0 right-0 z-30 bg-white rounded-2xl shadow-xl border border-[#ded8cb] overflow-hidden max-h-64 overflow-y-auto">
                    {filteredPresets.map((p) => (
                      <button
                        key={p.name}
                        type="button"
                        onClick={() => handleSelectPreset(p)}
                        className="w-full px-4 py-2.5 text-left hover:bg-[#f5f2eb] flex items-center justify-between border-b border-[#ede7dc] last:border-none cursor-pointer transition text-[#1f2937]"
                      >
                        <div className="flex items-center gap-2.5 min-w-0">
                          <span className="text-lg shrink-0">{p.emblem}</span>
                          <div className="min-w-0">
                            <div className="text-xs font-bold text-[#1f2937] truncate">{p.name}</div>
                            <div className="flex items-center gap-1.5 mt-0.5">
                              <span className="text-[10px] text-[#8c7860] font-mono font-bold">{p.acronym}</span>
                              {p.isIndian && (
                                <span className="text-[9px] font-bold text-amber-800 bg-amber-100 border border-amber-300 px-1 py-0.2 rounded">
                                  🇮🇳 Parliamentary
                                </span>
                              )}
                              {p.category && !p.isIndian && (
                                <span className="text-[9px] font-bold text-neutral-600 bg-neutral-100 border border-neutral-300 px-1 py-0.2 rounded">
                                  {p.category}
                                </span>
                              )}
                            </div>
                          </div>
                        </div>
                        <span className="text-[10px] font-mono text-[#8c7860] bg-[#ede8df] px-2 py-0.5 rounded border border-[#ded8cb]">
                          ↵
                        </span>
                      </button>
                    ))}
                  </div>
                )}
              </div>

              <div>
                <label className="block text-[11px] font-bold text-[#64748b] tracking-wider uppercase mb-1.5">
                  TOPIC
                </label>
                <input
                  type="text"
                  value={topic}
                  onChange={(e) => setTopic(e.target.value)}
                  placeholder="e.g. The right to education"
                  className="w-full px-4 py-3 rounded-xl bg-white border border-[#ded8cb] focus:border-[#1b3d29] focus:ring-1 focus:ring-[#1b3d29] text-sm font-semibold text-[#1f2937] placeholder:text-[#9ca3af] outline-none transition"
                />
              </div>
            </div>

            {/* Chairs Section */}
            <div>
              <label className="block text-[11px] font-bold text-[#64748b] tracking-wider uppercase mb-1.5">
                CHAIRS (OPTIONAL)
              </label>
              <div className="relative flex items-center">
                <input
                  type="text"
                  value={chairInput}
                  onChange={(e) => setChairInput(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') {
                      e.preventDefault();
                      handleAddChair();
                    }
                  }}
                  placeholder="Your name"
                  className="w-full pl-4 pr-24 py-3 rounded-xl bg-white border border-[#ded8cb] focus:border-[#1b3d29] focus:ring-1 focus:ring-[#1b3d29] text-sm font-semibold text-[#1f2937] placeholder:text-[#9ca3af] outline-none transition"
                />
                <button
                  type="button"
                  onClick={handleAddChair}
                  className="absolute right-2 px-4 py-1.5 rounded-lg bg-[#ded9ce] hover:bg-[#cfc8bc] text-[#4a453e] font-bold text-xs transition cursor-pointer flex items-center gap-1"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>Add</span>
                </button>
              </div>

              {/* Added Chairs Tags */}
              {chairs.length > 0 && (
                <div className="flex flex-wrap gap-1.5 mt-2">
                  {chairs.map((chair, idx) => (
                    <span
                      key={chair + idx}
                      className="bg-[#f4f1ea] border border-[#e4ded4] px-3 py-1 rounded-full text-xs font-semibold text-[#2f3832] flex items-center gap-1.5 shadow-2xs"
                    >
                      <span>{chair}</span>
                      <button
                        type="button"
                        onClick={() => handleRemoveChair(idx)}
                        className="text-[#8c8273] hover:text-rose-500 cursor-pointer p-0.5"
                      >
                        <X className="w-3 h-3" />
                      </button>
                    </span>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* STEP 2: DELEGATIONS */}
          <div className="space-y-4 pt-4 border-t border-[#ede7dc]">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div className="flex items-center gap-2.5 shrink-0">
                <span className="w-7 h-7 rounded-full bg-[#1b3d29] text-white font-bold text-xs flex items-center justify-center shrink-0">
                  2
                </span>
                <h2 className="text-xl font-bold text-[#1f2421] tracking-tight">Delegations</h2>
              </div>

              {/* Search + Add delegation input */}
              <div className="flex items-center gap-2 flex-1 sm:max-w-md">
                <div className="relative flex-1">
                  <Search className="w-4 h-4 text-[#9ca3af] absolute left-3.5 top-3" />
                  <input
                    type="text"
                    value={searchCountry}
                    onChange={(e) => setSearchCountry(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter') {
                        e.preventDefault();
                        handleAddCountry(searchCountry);
                      }
                    }}
                    placeholder="Type a country, or any custom name"
                    className="w-full pl-10 pr-3 py-2.5 rounded-xl bg-white border border-[#ded8cb] text-sm text-[#1f2937] placeholder:text-[#9ca3af] outline-none focus:border-[#1b3d29] transition"
                  />
                </div>
                <button
                  type="button"
                  onClick={() => handleAddCountry(searchCountry)}
                  className="px-4 py-2.5 rounded-xl bg-[#94a39b] hover:bg-[#83938b] text-white text-xs font-bold cursor-pointer transition shrink-0 flex items-center gap-1 shadow-xs"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>Add</span>
                </button>
              </div>
            </div>

            {/* Quick-Add Bloc Bundles with Indian / International Filter Tabs */}
            <div className="space-y-2 pt-1">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                <span className="text-[10px] font-bold text-[#64748b] uppercase tracking-wider">
                  QUICK-ADD BLOCS
                </span>
                <div className="flex items-center gap-1 bg-[#ede8df] p-0.5 rounded-lg border border-[#ded8cb] self-start sm:self-auto">
                  <button
                    type="button"
                    onClick={() => setBlocTab('all')}
                    className={`px-2.5 py-1 rounded-md text-[10px] font-bold transition cursor-pointer ${
                      blocTab === 'all'
                        ? 'bg-white text-[#1f2937] shadow-2xs'
                        : 'text-[#64748b] hover:text-[#1f2937]'
                    }`}
                  >
                    All ({QUICK_BLOC_BUNDLES.length})
                  </button>
                  <button
                    type="button"
                    onClick={() => setBlocTab('indian')}
                    className={`px-2.5 py-1 rounded-md text-[10px] font-bold transition cursor-pointer flex items-center gap-1 ${
                      blocTab === 'indian'
                        ? 'bg-white text-[#1f2937] shadow-2xs'
                        : 'text-[#64748b] hover:text-[#1f2937]'
                    }`}
                  >
                    <span>🇮🇳</span>
                    <span>Indian &amp; Regional</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => setBlocTab('international')}
                    className={`px-2.5 py-1 rounded-md text-[10px] font-bold transition cursor-pointer flex items-center gap-1 ${
                      blocTab === 'international'
                        ? 'bg-white text-[#1f2937] shadow-2xs'
                        : 'text-[#64748b] hover:text-[#1f2937]'
                    }`}
                  >
                    <span>🌐</span>
                    <span>International</span>
                  </button>
                </div>
              </div>

              <div className="flex flex-wrap gap-2 pt-0.5">
                {QUICK_BLOC_BUNDLES.filter((b) => blocTab === 'all' || b.category === blocTab).map((b) => (
                  <button
                    key={b.id}
                    type="button"
                    onClick={() => handleAddBundle(b)}
                    className="px-3 py-1.5 rounded-full bg-[#f4f1ea] hover:bg-[#eae5dc] border border-[#e4ded4] text-xs font-semibold text-[#2f3832] flex items-center gap-1.5 transition cursor-pointer active:scale-95 shadow-2xs"
                  >
                    <span className="text-sm">{b.icon}</span>
                    <span className="font-bold">{b.name}</span>
                    <span className="text-[10px] text-[#6b7280] font-mono">+{b.count}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Paste a List Container */}
            <div className="space-y-1.5 pt-2">
              <div className="flex items-center gap-1.5 text-[11px] font-bold text-[#64748b] tracking-wider uppercase">
                <FileText className="w-3.5 h-3.5 text-[#8c8273]" />
                <span>PASTE A LIST</span>
              </div>
              <div className="relative rounded-2xl border border-[#ded8cb] bg-white p-3 space-y-2">
                <textarea
                  value={pasteList}
                  onChange={(e) => setPasteList(e.target.value)}
                  rows={4}
                  placeholder={"France\nGermany\nBrazil, India...\nObserver Delegation"}
                  className="w-full bg-transparent border-none text-xs font-mono text-[#1f2937] placeholder:text-[#9ca3af] outline-none resize-none leading-relaxed"
                />
                <div className="flex justify-end pt-1">
                  <button
                    type="button"
                    onClick={handleAutoMatchAndAdd}
                    className="px-4 py-2 rounded-xl bg-[#94a39b] hover:bg-[#83938b] text-white text-xs font-bold uppercase tracking-wider flex items-center gap-1.5 transition cursor-pointer shadow-xs active:scale-95"
                  >
                    <Wand2 className="w-3.5 h-3.5" />
                    <span>AUTO-MATCH &amp; ADD</span>
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Right Card: Live Roster & Start Session */}
        <div className="lg:col-span-5 bg-white rounded-[26px] p-6 sm:p-8 border border-[#ded8cb] shadow-[0_4px_24px_rgba(0,0,0,0.03)] flex flex-col min-h-[580px]">
          {/* Header */}
          <div className="flex items-center justify-between pb-2">
            <div className="flex items-baseline gap-2">
              <span className="text-3xl font-black text-[#57534e]">{delegations.length}</span>
              <span className="text-xl font-bold text-[#1f2421]">delegations</span>
            </div>
            {delegations.length > 0 && (
              <button
                type="button"
                onClick={() => setDelegations([])}
                className="text-xs font-bold text-rose-500 hover:text-rose-600 hover:underline cursor-pointer"
              >
                Clear all
              </button>
            )}
          </div>

          {/* Inner Canvas: Warm Linen Box */}
          <div className="flex-1 rounded-2xl bg-[#ede8df] p-4 flex flex-col overflow-hidden my-3 border border-[#ded8cb]">
            {delegations.length === 0 ? (
              <div className="flex-1 flex flex-col items-center justify-center text-center p-6 space-y-2">
                <div className="w-14 h-14 rounded-full bg-[#ded8cb] flex items-center justify-center text-[#5c4a3b] shadow-2xs">
                  <Globe className="w-7 h-7 text-[#5c4a3b]" />
                </div>
                <h4 className="text-base font-bold text-[#292524] pt-1">No Delegates Yet</h4>
                <p className="text-xs text-[#78716c] max-w-[240px] leading-relaxed">
                  Add a country, paste a list, or use a quick bundle
                </p>
              </div>
            ) : (
              <div className="overflow-y-auto max-h-[440px] space-y-1.5 pr-1">
                {delegations.map((d) => (
                  <div
                    key={d.id}
                    className="flex items-center justify-between p-2.5 rounded-xl bg-white border border-[#ded8cb] shadow-2xs hover:border-[#1b3d29]/40 transition group"
                  >
                    <div className="flex items-center gap-2.5 min-w-0">
                      <img
                        src={`https://flagcdn.com/w80/${d.countryCode.toLowerCase()}.png`}
                        alt={d.name}
                        className="w-5 h-3.5 rounded-xs object-cover shadow-2xs border border-black/10 shrink-0"
                        onError={(e) => {
                          (e.target as HTMLElement).style.display = 'none';
                        }}
                      />
                      <span className="text-xs font-bold text-[#1f2937] truncate">{d.name}</span>
                      {d.role === 'observer' && (
                        <span className="text-[9px] font-bold uppercase bg-amber-100 text-amber-800 border border-amber-300 px-1 rounded shrink-0">
                          OBS
                        </span>
                      )}
                      {d.isP5 && (
                        <span className="text-[9px] font-bold uppercase bg-blue-100 text-blue-800 border border-blue-300 px-1 rounded shrink-0">
                          P5
                        </span>
                      )}
                    </div>
                    <button
                      type="button"
                      onClick={() => handleRemoveDelegation(d.id)}
                      className="text-[#9ca3af] hover:text-rose-500 p-1 cursor-pointer transition opacity-70 group-hover:opacity-100"
                    >
                      <X className="w-3.5 h-3.5" />
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Bottom Action: Start Session Button */}
          <div className="pt-2">
            {!isReadyToStart ? (
              <div className="w-full py-3.5 px-4 rounded-2xl bg-[#e5e0d5] text-[#78716c] flex items-center justify-center gap-2.5 font-bold cursor-not-allowed">
                <Lock className="w-4 h-4 text-[#8a8377]" />
                <div className="text-left">
                  <div className="text-xs font-bold text-[#57534e]">Start session</div>
                  <div className="text-[10px] text-[#8a8377] font-normal">
                    {!committeeName.trim()
                      ? 'Add a name and a topic'
                      : 'Add at least 1 delegation'}
                  </div>
                </div>
              </div>
            ) : (
              <button
                type="button"
                onClick={handleLaunch}
                className="w-full py-3.5 px-4 rounded-2xl bg-[#1b3d29] hover:bg-[#142d1f] text-white flex items-center justify-center gap-2.5 font-bold transition shadow-md shadow-[#1b3d29]/20 cursor-pointer active:scale-98"
              >
                <Lock className="w-4 h-4 text-emerald-300" />
                <div className="text-left">
                  <div className="text-xs font-bold text-white">Start session</div>
                  <div className="text-[10px] text-emerald-200/80 font-normal">
                    Lock roster &amp; launch session
                  </div>
                </div>
              </button>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}
