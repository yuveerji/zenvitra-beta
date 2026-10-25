'use client';

import React, { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
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
  Compass,
  Sparkles,
  ArrowRight,
  HelpCircle,
  CheckCircle2,
} from 'lucide-react';
import { PRESET_COMMITTEES, QUICK_BLOC_BUNDLES, ZenDelegate, PresetCommitteeDef } from '@/types/zenMun';
import { useZenMun, generateSessionCode } from '@/context/ZenMunContext';
import { useAuth } from '@/context/AuthContext';
import { isFounder, isAdmin } from '@/lib/founderControl';
import { checkFeatureAccess } from '@/lib/subscriptionTiers';
import { ZenProLockModal } from '@/components/pricing/ZenProFeatureGate';

// Comprehensive ISO 3166-1 alpha-2 mapping for accurate FlagCDN resolution
const COUNTRY_CODE_MAP: Record<string, string> = {
  // P5 & Major Powers
  'united states': 'us',
  'united states of america': 'us',
  'usa': 'us',
  'us senate': 'us',
  'united states senate': 'us',
  'senate': 'us',
  'us house': 'us',
  'united states house of representatives': 'us',
  'us congress': 'us',
  'united kingdom': 'gb',
  'uk': 'gb',
  'great britain': 'gb',
  'britain': 'gb',
  'house of commons': 'gb',
  'house of lords': 'gb',
  'uk parliament': 'gb',
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
  const searchParams = useSearchParams();
  const { session, setSession } = useZenMun();

  // Step 1: Committee Details - ALWAYS INITIALIZE 100% CLEAN & EMPTY BY DEFAULT (STRICT DATA INTEGRITY)
  const hasGenuineExistingRoster = Boolean(session.roster && session.roster.length > 0 && session.sessionState === 'in-session');
  const [committeeName, setCommitteeName] = useState(hasGenuineExistingRoster ? (session.committeeName || '') : '');
  const [acronym, setAcronym] = useState(hasGenuineExistingRoster ? (session.committeeAcronym || '') : '');
  const [topic, setTopic] = useState(hasGenuineExistingRoster ? (session.topic || '') : '');
  const [emblem, setEmblem] = useState(
    hasGenuineExistingRoster && session.emblemUrl
      ? session.emblemUrl
      : '/assets/committees/un.svg'
  );
  const [isIndian, setIsIndian] = useState(hasGenuineExistingRoster ? Boolean(session.isIndianCommittee) : false);

  // Chairs list
  const [chairInput, setChairInput] = useState('');
  const [chairs, setChairs] = useState<string[]>(
    hasGenuineExistingRoster && session.chairName && session.chairName !== 'Chair' ? [session.chairName] : []
  );

  // Step 2: Delegations - Strict zero seeded items
  const [searchCountry, setSearchCountry] = useState('');
  const [pasteList, setPasteList] = useState('');
  const [delegations, setDelegations] = useState<ZenDelegate[]>(hasGenuineExistingRoster ? (session.roster || []) : []);
  const [autocompleteOpen, setAutocompleteOpen] = useState(false);
  const [highlightedIndex, setHighlightedIndex] = useState(0);
  const [blocTab, setBlocTab] = useState<'all' | 'indian' | 'international'>('international');

  // First-Timer Explore Tour & Demo States
  const [exploreTourOpen, setExploreTourOpen] = useState(false);
  const [exploreStep, setExploreStep] = useState(1);
  const [firstTimerBannerVisible, setFirstTimerBannerVisible] = useState(() => {
    if (typeof window === 'undefined') return true;
    return !localStorage.getItem('zenvitra_committee_first_timer_dismissed');
  });
  const [demoToastMessage, setDemoToastMessage] = useState<string | null>(null);
  const [showProLockModal, setShowProLockModal] = useState(false);

  const { user, profile } = useAuth();
  const isFOrA = Boolean(
    isFounder(profile?.username || profile?.email, profile?.role) ||
    isAdmin(profile?.username || profile?.email, profile?.role) ||
    profile?.role === 'founder' ||
    profile?.role === 'admin'
  );

  const hasProAccess = checkFeatureAccess('UNLIMITED_CHAMBER_ROSTER', profile || user, isFOrA).hasAccess;

  const autocompleteRef = useRef<HTMLDivElement>(null);

  // Sync chamber from URL params on mount
  useEffect(() => {
    if (searchParams?.get('explore') === 'true') {
      setExploreStep(1);
      setExploreTourOpen(true);
    }
    const chamberParam = searchParams?.get('chamber');
    if (!chamberParam) return;
    const clean = chamberParam.toLowerCase().trim();
    const found = PRESET_COMMITTEES.find(
      (p) =>
        p.logoKey.toLowerCase() === clean ||
        p.acronym.toLowerCase().replace(/\s+/g, '_') === clean ||
        p.acronym.toLowerCase() === clean ||
        p.name.toLowerCase().includes(clean)
    );
    if (found) {
      setCommitteeName(found.name);
      setAcronym(found.acronym);
      setEmblem(found.emblem);
      if (found.defaultTopic) setTopic(found.defaultTopic);
      const ind = Boolean(found.isIndian);
      setIsIndian(ind);
      if (ind) setBlocTab('indian');
      else setBlocTab('international');
      if (delegations.length === 0 && found.suggestedBundleId) {
        const bundle = QUICK_BLOC_BUNDLES.find((b) => b.id === found.suggestedBundleId);
        if (bundle) {
          const toAdd = bundle.countries.map((c) => ({
            id: `del_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`,
            name: c.name,
            countryCode: c.code,
            role: 'member' as const,
            attendance: 'present' as const,
            isP5: Boolean(c.isP5),
          }));
          setDelegations(toAdd);
        }
      }
    }
  }, [searchParams]);

  // Click outside to close autocomplete
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (autocompleteRef.current && !autocompleteRef.current.contains(e.target as Node)) {
        setAutocompleteOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Comprehensive Committee Autocomplete Filter with Strict Category Separation
  const cleanQuery = committeeName.trim().toLowerCase();
  const filteredPresets = PRESET_COMMITTEES.filter((p) => {
    // Strict Portfolio Separation: Never mix International with Parliamentary
    if (!isIndian && p.isIndian) return false;
    if (isIndian && !p.isIndian) return false;

    if (!cleanQuery) return true;
    if (p.name.toLowerCase().includes(cleanQuery)) return true;
    if (p.acronym.toLowerCase().includes(cleanQuery)) return true;
    if (p.category.toLowerCase().includes(cleanQuery)) return true;
    if (p.searchTags && p.searchTags.some((tag) => tag.toLowerCase().includes(cleanQuery) || cleanQuery.includes(tag.toLowerCase()))) {
      return true;
    }
    return false;
  }).slice(0, 10);

  const handleSelectPreset = (p: PresetCommitteeDef) => {
    setCommitteeName(p.name);
    setAcronym(p.acronym);
    setEmblem(p.emblem);
    if (!topic && p.defaultTopic) {
      setTopic(p.defaultTopic);
    }
    const ind = Boolean(p.isIndian);
    setIsIndian(ind);
    if (ind) {
      setBlocTab('indian');
    } else {
      setBlocTab('international');
    }

    // Auto-populate delegations if currently empty
    if (delegations.length === 0 && p.suggestedBundleId) {
      const bundle = QUICK_BLOC_BUNDLES.find((b) => b.id === p.suggestedBundleId);
      if (bundle) {
        const toAdd = bundle.countries.map((c) => ({
          id: `del_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`,
          name: c.name,
          countryCode: c.code,
          role: 'member' as const,
          attendance: 'present' as const,
          isP5: Boolean(c.isP5),
        }));
        setDelegations(toAdd);
      }
    }
    setAutocompleteOpen(false);
  };

  const handleDismissFirstTimerBanner = () => {
    setFirstTimerBannerVisible(false);
    if (typeof window !== 'undefined') {
      localStorage.setItem('zenvitra_committee_first_timer_dismissed', 'true');
    }
  };

  // Instant Sample Chamber for First-Timers
  const handleLoadDemoChamber = (type: 'unsc' | 'loksabha' = 'unsc') => {
    if (type === 'loksabha') {
      const found = PRESET_COMMITTEES.find((p) => p.acronym === 'LOK SABHA');
      if (found) {
        setCommitteeName(found.name);
        setAcronym(found.acronym);
        setEmblem(found.emblem);
        setTopic(found.defaultTopic || 'Delimitation of Constituencies, Federal Autonomy & Electoral Reforms');
        setIsIndian(true);
        setBlocTab('indian');
        setChairs(['Speaker of the Lok Sabha', 'Deputy Speaker']);
        const bundle = QUICK_BLOC_BUNDLES.find((b) => b.id === 'major_parties_in');
        if (bundle) {
          const toAdd = bundle.countries.map((c) => ({
            id: `del_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`,
            name: c.name,
            countryCode: c.code,
            role: 'member' as const,
            attendance: 'present' as const,
            isP5: false,
          }));
          setDelegations(toAdd);
        }
      }
    } else {
      const found = PRESET_COMMITTEES.find((p) => p.acronym === 'UNSC');
      if (found) {
        setCommitteeName(found.name);
        setAcronym(found.acronym);
        setEmblem(found.emblem);
        setTopic(found.defaultTopic || 'Non-Proliferation, Cyber Warfare & Maritime Security in Disputed Corridors');
        setIsIndian(false);
        setBlocTab('international');
        setChairs(['President of the Security Council', 'Director General']);
        const bundle = QUICK_BLOC_BUNDLES.find((b) => b.id === 'unsc_2026');
        if (bundle) {
          const toAdd = bundle.countries.map((c) => ({
            id: `del_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`,
            name: c.name,
            countryCode: c.code,
            role: 'member' as const,
            attendance: 'present' as const,
            isP5: Boolean(c.isP5),
          }));
          setDelegations(toAdd);
        }
      }
    }
    setDemoToastMessage('✨ Loaded Sample Chamber! Review delegations and click "Start session" to operate the live Dais.');
    setTimeout(() => setDemoToastMessage(null), 5000);
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

    if (delegations.length >= 15 && !hasProAccess) {
      setShowProLockModal(true);
      return;
    }

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
    if (delegations.length + bundle.countries.length > 15 && !hasProAccess) {
      setShowProLockModal(true);
      return;
    }

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
    if (delegations.length >= 15 && !hasProAccess) {
      setShowProLockModal(true);
      return;
    }
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
      router.push('/dias');
    }
  };

  // Readiness validation
  const isReadyToStart = committeeName.trim().length > 0 && delegations.length > 0;

  const handleLaunch = () => {
    if (!isReadyToStart) return;

    const finalDelegates = delegations;
    const firstQueue: string[] = []; // STRICT DATA INTEGRITY: queue starts completely empty
    const cleanAcronym = (acronym.trim() || committeeName.trim() || 'LOK SABHA').replace(/_/g, ' ');
    const isInd = Boolean(isIndian || cleanAcronym.toLowerCase().includes('lok'));
    const emblemToUse = isInd
      ? '/assets/committees/emblem_of_india.svg'
      : (emblem || '/assets/committees/un.svg');

    const cleanCode =
      session.sessionCode && session.sessionCode.trim().length >= 4
        ? session.sessionCode
        : generateSessionCode();

    const hasSeenTutorial =
      typeof window !== 'undefined' &&
      Boolean(localStorage.getItem('zenvitra_has_seen_dais_tutorial_v1'));

    const updated = {
      ...session,
      sessionCode: cleanCode,
      chairName: chairs.length > 0 ? chairs.join(', ') : session.chairName || 'Chair',
      sessionState: 'in-session' as const,
      tutorial: {
        ...session.tutorial,
        welcomeModalOpen: !hasSeenTutorial,
        isActive: false,
      },
      committeeName: (committeeName.trim() || 'United Nations Committee').replace(/_/g, ' '),
      committeeAcronym: cleanAcronym,
      topic: topic.trim() || 'General Floor Debate & Parliamentary Substantive Business',
      emblemUrl: emblemToUse,
      isIndianCommittee: isInd,
      roster: finalDelegates,
      speakerQueue: firstQueue,
      currentSpeakerId: null,
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
    <div className="min-h-screen bg-[#08090C] text-[#F8FAFC] font-sans antialiased flex flex-col select-none relative overflow-x-hidden">
      {/* Top Navbar matching Zenvitra Dais Header */}
      <header className="w-full bg-[#0D111A]/90 backdrop-blur-md border-b border-white/[0.08] px-4 sm:px-8 py-3.5 flex items-center justify-between z-30">
        <div className="flex items-center gap-4 sm:gap-6">
          {/* Logo Brand */}
          <Link href="/dias" className="flex items-center gap-2.5 group cursor-pointer">
            <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-[#C5A46D] to-[#9E7D47] flex items-center justify-center text-[#08090C] font-black shadow-[0_0_15px_rgba(197,164,109,0.3)] group-hover:scale-105 transition-transform">
              <Gavel className="w-4 h-4" />
            </div>
            <div className="flex flex-col text-left">
              <span className="font-serif font-black text-sm tracking-tight text-white leading-none">
                ZENVITRA MUN DIAS
              </span>
              <span className="text-[9px] font-bold text-[#C5A46D] uppercase tracking-wider leading-none mt-0.5">
                Committee Configuration Studio &bull; Presidium 2.4
              </span>
            </div>
          </Link>

          {/* BACK Button */}
          <button
            type="button"
            onClick={handleBackNavigation}
            className="text-xs font-bold text-slate-400 hover:text-white flex items-center gap-1 cursor-pointer transition uppercase tracking-wider pl-2"
          >
            <ChevronLeft className="w-4 h-4" />
            <span>BACK TO DIAS</span>
          </button>
        </div>

        {/* Right Section: Explore Tour and Language */}
        <div className="flex items-center gap-2 sm:gap-3">
          <button
            type="button"
            onClick={() => {
              setExploreStep(1);
              setExploreTourOpen(true);
            }}
            className="text-xs font-bold text-[#C5A46D] hover:text-[#E6D1A5] bg-[#C5A46D]/10 hover:bg-[#C5A46D]/20 border border-[#C5A46D]/30 px-3.5 py-1.5 rounded-full transition flex items-center gap-1.5 cursor-pointer shadow-2xs"
            title="Open Interactive Explore Tour for First-Timers"
          >
            <Compass className="w-3.5 h-3.5 text-[#C5A46D]" />
            <span>Explore Tour</span>
          </button>

          <div className="text-xs font-bold text-slate-300 flex items-center gap-1.5 px-2 py-1">
            <Globe className="w-4 h-4 text-[#C5A46D]" />
            <span>EN</span>
          </div>
        </div>
      </header>

      {/* Floating Toast Notification */}
      {demoToastMessage && (
        <div className="fixed top-18 left-1/2 -translate-x-1/2 z-50 px-5 py-2.5 rounded-2xl bg-[#121826] text-white text-xs font-bold shadow-2xl border border-[#C5A46D]/40 flex items-center gap-2">
          <Sparkles className="w-4 h-4 text-amber-300" />
          <span>{demoToastMessage}</span>
        </div>
      )}

      {/* First-Timer Onboarding Explore Banner */}
      {firstTimerBannerVisible && (
        <div className="max-w-[1240px] w-full mx-auto px-4 sm:px-6 lg:px-8 pt-4 pb-0">
          <div className="p-3.5 sm:p-4 rounded-2xl bg-[#0E131F] border border-white/[0.08] shadow-xs flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-[#C5A46D] to-[#9E7D47] text-[#08090C] flex items-center justify-center shrink-0 shadow-xs">
                <Compass className="w-5 h-5" />
              </div>
              <div>
                <div className="text-xs font-black text-white uppercase tracking-wider flex items-center gap-2">
                  <span>First Time Chairing a Committee?</span>
                  <span className="text-[10px] font-mono text-[#C5A46D] bg-[#C5A46D]/15 border border-[#C5A46D]/30 px-1.5 py-0.2 rounded font-bold">
                    EXPLORE GUIDE
                  </span>
                </div>
                <div className="text-xs text-slate-400 font-medium mt-0.5">
                  Explore how to setup your chamber in 4 steps or load a pre-configured sample chamber to test the live Dais.
                </div>
              </div>
            </div>

            <div className="flex items-center gap-2 self-stretch sm:self-auto shrink-0">
              <button
                type="button"
                onClick={() => {
                  setExploreStep(1);
                  setExploreTourOpen(true);
                }}
                className="flex-1 sm:flex-none px-3.5 py-1.5 rounded-xl bg-[#C5A46D] hover:bg-[#DFBA73] text-[#08090C] text-xs font-black transition flex items-center justify-center gap-1.5 cursor-pointer shadow-2xs"
              >
                <Compass className="w-3.5 h-3.5" />
                <span>Explore Tour</span>
              </button>
              <button
                type="button"
                onClick={() => handleLoadDemoChamber('unsc')}
                className="flex-1 sm:flex-none px-3 py-1.5 rounded-xl bg-[#141A29] hover:bg-[#1C2438] text-slate-200 text-xs font-bold transition flex items-center justify-center gap-1.5 cursor-pointer border border-white/10"
                title="Preload UNSC 2026 with 15 delegations"
              >
                <Sparkles className="w-3.5 h-3.5 text-amber-600" />
                <span>⚡ Load Demo</span>
              </button>
              <button
                type="button"
                onClick={handleDismissFirstTimerBanner}
                className="p-1.5 text-slate-400 hover:text-white transition rounded-lg hover:bg-white/5 cursor-pointer"
                title="Dismiss banner"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Main 2-Column Split Stage */}
      <main className="flex-1 max-w-[1240px] w-full mx-auto p-4 sm:p-6 lg:p-8 grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Left Card: Committee & Delegations Setup */}
        <div className="lg:col-span-7 bg-[#0E131F] rounded-[26px] p-6 sm:p-8 border border-white/[0.08] shadow-[0_8px_32px_rgba(0,0,0,0.5)]px_24px_rgba(0,0,0,0.03)] space-y-7">
          {/* STEP 1: COMMITTEE */}
          <div className="space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div className="flex items-center gap-2.5">
                <span className="w-7 h-7 rounded-full bg-gradient-to-br from-[#C5A46D] to-[#9E7D47] text-[#08090C] font-black text-xs flex items-center justify-center shrink-0 shadow-[0_0_12px_rgba(197,164,109,0.3)]">
                  1
                </span>
                <h2 className="text-xl font-bold text-[#1f2421] tracking-tight">Committee</h2>
              </div>

              {/* Strict Committee Category Selector (International vs Parliamentary) */}
              <div className="flex items-center p-1 bg-[#141A29] rounded-xl border border-white/10 self-stretch sm:self-auto">
                <button
                  type="button"
                  onClick={() => {
                    setIsIndian(false);
                    setBlocTab('international');
                    if (emblem === '/assets/committees/emblem_of_india.svg') {
                      setEmblem('/assets/committees/un.svg');
                    }
                  }}
                  className={`flex-1 sm:flex-none px-3 py-1.5 rounded-lg text-xs font-bold transition flex items-center justify-center gap-1.5 cursor-pointer ${
                    !isIndian
                      ? 'bg-white text-[#1f2937] shadow-2xs'
                      : 'text-[#64748b] hover:text-[#1f2937]'
                  }`}
                >
                  <span>🌐</span>
                  <span>International UN Committee</span>
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setIsIndian(true);
                    setBlocTab('indian');
                    setEmblem('/assets/committees/emblem_of_india.svg');
                  }}
                  className={`flex-1 sm:flex-none px-3 py-1.5 rounded-lg text-xs font-bold transition flex items-center justify-center gap-1.5 cursor-pointer ${
                    isIndian
                      ? 'bg-white text-[#1f2937] shadow-2xs'
                      : 'text-[#64748b] hover:text-[#1f2937]'
                  }`}
                >
                  <span>🇮🇳</span>
                  <span>Parliamentary / Lok Sabha</span>
                </button>
              </div>
            </div>

            {/* Committee Live Preview Card */}
            <div className="p-4 rounded-2xl bg-[#141A29] border border-white/10 flex items-center gap-4">
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
              <div className="relative" ref={autocompleteRef}>
                <label className="block text-[11px] font-bold text-[#64748b] tracking-wider uppercase mb-1.5">
                  COMMITTEE NAME
                </label>
                <input
                  type="text"
                  value={committeeName}
                  onChange={(e) => {
                    setCommitteeName(e.target.value);
                    setAutocompleteOpen(true);
                    setHighlightedIndex(0);
                  }}
                  onFocus={() => {
                    setAutocompleteOpen(true);
                    setHighlightedIndex(0);
                  }}
                  onKeyDown={(e) => {
                    if (autocompleteOpen && filteredPresets.length > 0) {
                      if (e.key === 'ArrowDown') {
                        e.preventDefault();
                        setHighlightedIndex((prev) => (prev + 1) % filteredPresets.length);
                      } else if (e.key === 'ArrowUp') {
                        e.preventDefault();
                        setHighlightedIndex((prev) => (prev - 1 + filteredPresets.length) % filteredPresets.length);
                      } else if (e.key === 'Enter') {
                        e.preventDefault();
                        if (filteredPresets[highlightedIndex]) {
                          handleSelectPreset(filteredPresets[highlightedIndex]);
                        }
                      } else if (e.key === 'Escape') {
                        setAutocompleteOpen(false);
                      }
                    }
                  }}
                  placeholder="e.g. Human Rights Council or HRC"
                  className="w-full px-4 py-3 rounded-xl bg-[#141A29] border border-white/10 focus:border-[#C5A46D] focus:ring-1 focus:ring-[#C5A46D] text-sm font-semibold text-white placeholder:text-slate-500 outline-none transition"
                />

                {/* Floating Autocomplete Dropdown matching Zenvitra UX */}
                {autocompleteOpen && filteredPresets.length > 0 && (
                  <div className="absolute top-[calc(100%+6px)] left-0 right-0 z-40 bg-[#101522] rounded-2xl shadow-2xl border border-white/10 overflow-hidden divide-y divide-[#ffffff/10] max-h-72 overflow-y-auto">
                    {filteredPresets.map((p, idx) => {
                      const isHighlighted = idx === highlightedIndex;
                      return (
                        <button
                          key={p.name}
                          type="button"
                          onClick={() => handleSelectPreset(p)}
                          onMouseEnter={() => setHighlightedIndex(idx)}
                          className={`w-full px-4 py-3 text-left flex items-center justify-between gap-3 cursor-pointer transition ${
                            isHighlighted ? 'bg-[#f5f0e6]' : 'hover:bg-[#fbf9f5]'
                          }`}
                        >
                          <div className="flex items-center gap-3 min-w-0">
                            {/* Emblem Container with Seal Border */}
                            <div className="w-9 h-9 rounded-full bg-[#141A29] border border-white/10 shadow-2xs flex items-center justify-center p-1 shrink-0 overflow-hidden">
                              {p.isIndian || (p.acronym && p.acronym.toLowerCase().includes('lok')) ? (
                                <img
                                  src="/assets/committees/emblem_of_india.svg"
                                  alt={p.name}
                                  className="w-full h-full object-contain"
                                />
                              ) : p.emblem.startsWith('/') ? (
                                <img
                                  src={p.emblem}
                                  alt={p.name}
                                  className="w-full h-full object-contain"
                                />
                              ) : (
                                <span className="text-base">{p.emblem}</span>
                              )}
                            </div>

                            <div className="min-w-0">
                              <div className="text-sm font-bold text-[#1f2937] tracking-tight truncate">
                                {p.name}
                              </div>
                              <div className="text-[10px] text-[#78716c] font-medium flex items-center gap-1.5 mt-0.5 truncate">
                                <span>{p.category}</span>
                                {p.seatsCount && (
                                  <>
                                    <span>&bull;</span>
                                    <span>{p.seatsCount} Seats</span>
                                  </>
                                )}
                                {p.isIndian && (
                                  <span className="text-[9px] font-bold text-amber-800 bg-amber-100 border border-amber-300 px-1 rounded">
                                    🇮🇳 Parliamentary
                                  </span>
                                )}
                              </div>
                            </div>
                          </div>

                          {/* Pill Tag with Acronym and Return arrow */}
                          <div className="shrink-0 flex items-center gap-1 px-2.5 py-1 rounded-lg bg-[#141A29] border border-white/10 text-xs font-mono font-bold text-[#C5A46D] shadow-2xs">
                            <span>{p.acronym}</span>
                            <span className="text-[10px]">↵</span>
                          </div>
                        </button>
                      );
                    })}
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
                  className="w-full px-4 py-3 rounded-xl bg-[#141A29] border border-white/10 focus:border-[#C5A46D] focus:ring-1 focus:ring-[#C5A46D] text-sm font-semibold text-white placeholder:text-slate-500 outline-none transition"
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
                  className="w-full pl-4 pr-24 py-3 rounded-xl bg-[#141A29] border border-white/10 focus:border-[#C5A46D] focus:ring-1 focus:ring-[#C5A46D] text-sm font-semibold text-white placeholder:text-slate-500 outline-none transition"
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
                      className="bg-[#141A29] border border-white/10 px-3 py-1 rounded-full text-xs font-semibold text-slate-200 flex items-center gap-1.5 shadow-2xs"
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
          <div className="space-y-4 pt-4 border-t border-white/10">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div className="flex items-center gap-2.5 shrink-0">
                <span className="w-7 h-7 rounded-full bg-gradient-to-br from-[#C5A46D] to-[#9E7D47] text-[#08090C] font-black text-xs flex items-center justify-center shrink-0 shadow-[0_0_12px_rgba(197,164,109,0.3)]">
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
                    placeholder={isIndian ? "Type an MP, Minister, or Constituency (e.g. Varanasi, Wayanad)" : "Type a country (e.g. Angola, Japan, France, USA)"}
                    className="w-full pl-10 pr-3 py-2.5 rounded-xl bg-[#141A29] border border-white/10 text-sm text-white placeholder:text-slate-500 outline-none focus:border-[#C5A46D] transition"
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
                <div className="flex items-center gap-1 bg-[#141A29] p-0.5 rounded-lg border border-white/10 self-start sm:self-auto">
                  <button
                    type="button"
                    onClick={() => setBlocTab('all')}
                    className={`px-2.5 py-1 rounded-md text-[10px] font-bold transition cursor-pointer ${
                      blocTab === 'all'
                        ? 'bg-[#C5A46D] text-[#08090C] font-black shadow-2xs'
                        : 'text-slate-400 hover:text-white'
                    }`}
                  >
                    All ({QUICK_BLOC_BUNDLES.length})
                  </button>
                  <button
                    type="button"
                    onClick={() => setBlocTab('indian')}
                    className={`px-2.5 py-1 rounded-md text-[10px] font-bold transition cursor-pointer flex items-center gap-1 ${
                      blocTab === 'indian'
                        ? 'bg-[#C5A46D] text-[#08090C] font-black shadow-2xs'
                        : 'text-slate-400 hover:text-white'
                    }`}
                  >
                    <span>🇮🇳</span>
                    <span>Indian &amp; Regional ({QUICK_BLOC_BUNDLES.filter((b) => b.category === 'indian').length})</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => setBlocTab('international')}
                    className={`px-2.5 py-1 rounded-md text-[10px] font-bold transition cursor-pointer flex items-center gap-1 ${
                      blocTab === 'international'
                        ? 'bg-[#C5A46D] text-[#08090C] font-black shadow-2xs'
                        : 'text-slate-400 hover:text-white'
                    }`}
                  >
                    <span>🌐</span>
                    <span>International ({QUICK_BLOC_BUNDLES.filter((b) => b.category === 'international').length})</span>
                  </button>
                </div>
              </div>

              <div className="flex flex-wrap gap-2 pt-0.5">
                {QUICK_BLOC_BUNDLES.filter((b) => {
                  if (blocTab === 'indian') return b.category === 'indian';
                  if (blocTab === 'international') return b.category === 'international';
                  return true;
                }).map((b) => (
                  <button
                    key={b.id}
                    type="button"
                    onClick={() => handleAddBundle(b)}
                    className="px-3 py-1.5 rounded-full bg-[#161D2D] hover:bg-[#1F283E] border border-white/10 hover:border-[#C5A46D]/50 text-xs font-semibold text-slate-200 hover:text-[#C5A46D] flex items-center gap-1.5 transition cursor-pointer active:scale-95 shadow-2xs"
                  >
                    <span className="text-sm">{b.icon}</span>
                    <span className="font-bold">{b.name}</span>
                    <span className="text-[10px] text-[#C5A46D] font-mono font-bold">+{b.count}</span>
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
              <div className="relative rounded-2xl border border-white/10 bg-[#141A29] p-3 space-y-2">
                <textarea
                  value={pasteList}
                  onChange={(e) => setPasteList(e.target.value)}
                  rows={4}
                  placeholder={isIndian ? "Prime Minister (Varanasi)\nLeader of Opposition\nMember for Wayanad\nMember for Baramati" : "Angola\nJapan\nUnited States\nFrance, Germany...\nObserver Delegation"}
                  className="w-full bg-transparent border-none text-xs font-mono text-white placeholder:text-slate-500 outline-none resize-none leading-relaxed"
                />
                <div className="flex justify-end pt-1">
                  <button
                    type="button"
                    onClick={handleAutoMatchAndAdd}
                    className="px-4 py-2 rounded-xl bg-[#C5A46D] hover:bg-[#DFBA73] text-[#08090C] text-xs font-black uppercase tracking-wider flex items-center gap-1.5 transition cursor-pointer shadow-xs active:scale-95"
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
        <div className="lg:col-span-5 bg-[#0E131F] rounded-[26px] p-6 sm:p-8 border border-white/[0.08] shadow-[0_8px_32px_rgba(0,0,0,0.5)]px_24px_rgba(0,0,0,0.03)] flex flex-col min-h-[580px]">
          {/* Header */}
          <div className="flex items-center justify-between pb-2">
            <div className="flex items-baseline gap-2 flex-wrap">
              <span className="text-3xl font-black text-[#57534e]">{delegations.length}</span>
              <span className="text-xl font-bold text-[#1f2421]">delegations</span>
              {!hasProAccess ? (
                <button
                  type="button"
                  onClick={() => setShowProLockModal(true)}
                  className="text-[10px] font-mono text-amber-800 bg-amber-100 hover:bg-amber-200 border border-amber-300 px-2 py-0.5 rounded-full cursor-pointer flex items-center gap-1 transition"
                  title="Free accounts can host up to 15 delegations. Unlock unlimited with ZEN PRO (or 1-Month Free Trial)"
                >
                  <Lock className="w-2.5 h-2.5 text-amber-700" />
                  <span>Max 15 (Free) • Unlock Unlimited</span>
                </button>
              ) : (
                <span className="text-[10px] font-mono text-emerald-800 bg-emerald-100 border border-emerald-300 px-2 py-0.5 rounded-full flex items-center gap-1">
                  <Sparkles className="w-2.5 h-2.5 text-emerald-700" />
                  <span>PRO Unlimited</span>
                </span>
              )}
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
          <div className="flex-1 rounded-2xl bg-[#090C13] p-4 flex flex-col overflow-hidden my-3 border border-white/[0.06]">
            {delegations.length === 0 ? (
              <div className="flex-1 flex flex-col items-center justify-center text-center p-6 space-y-2">
                <div className="w-14 h-14 rounded-full bg-[#161C2C] flex items-center justify-center text-[#C5A46D] shadow-2xs">
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
                    className="flex items-center justify-between p-2.5 rounded-xl bg-[#121724] border border-white/[0.08] shadow-2xs hover:border-[#C5A46D]/40 transition group"
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
                className="w-full py-4 px-6 rounded-2xl bg-gradient-to-r from-[#C5A46D] via-[#DFBA73] to-[#C5A46D] text-[#08090C] flex items-center justify-center gap-2.5 font-black text-sm tracking-wide uppercase transition shadow-[0_0_30px_rgba(197,164,109,0.35)] hover:shadow-[0_0_40px_rgba(197,164,109,0.5)] cursor-pointer active:scale-98"
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

      {/* ── FIRST-TIMER EXPLORE TOUR MODAL ── */}
      {exploreTourOpen && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="max-w-lg w-full bg-[#0E131F] border border-white/10 rounded-[28px] shadow-2xl overflow-hidden p-6 sm:p-7 space-y-6 animate-in fade-in zoom-in-95">
            {/* Modal Header */}
            <div className="flex items-center justify-between border-b border-white/10 pb-4">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-[#C5A46D] to-[#9E7D47] text-[#08090C] flex items-center justify-center font-bold text-sm shadow-xs">
                  <Compass className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="text-base font-black text-[#1f2937] tracking-tight">
                    Diplomatic Suite Explore Tour
                  </h3>
                  <p className="text-[11px] text-[#78716c] font-medium">
                    Step {exploreStep} of 4 &bull; First-Timer Chamber Guide
                  </p>
                </div>
              </div>

              <button
                type="button"
                onClick={() => setExploreTourOpen(false)}
                className="w-7 h-7 rounded-full bg-black/5 hover:bg-black/10 flex items-center justify-center text-[#78716c] hover:text-[#1f2937] transition cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Step Progress Indicators */}
            <div className="grid grid-cols-4 gap-2">
              {[1, 2, 3, 4].map((s) => (
                <div
                  key={s}
                  className={`h-1.5 rounded-full transition-all duration-300 ${
                    s === exploreStep
                      ? 'bg-[#C5A46D]'
                      : s < exploreStep
                      ? 'bg-[#C5A46D]/40'
                      : 'bg-white/10'
                  }`}
                />
              ))}
            </div>

            {/* Step Content */}
            {exploreStep === 1 && (
              <div className="space-y-4">
                <div className="p-4 rounded-2xl bg-[#141A29] border border-white/10 shadow-2xs space-y-2">
                  <div className="flex items-center gap-2 text-[#C5A46D] font-bold text-xs uppercase tracking-wider">
                    <span>🏛️</span>
                    <span>1. Smart Committee Suggestions</span>
                  </div>
                  <h4 className="text-lg font-black text-[#1f2937] tracking-tight">
                    Type Any Committee in the World
                  </h4>
                  <p className="text-xs text-[#57534e] leading-relaxed">
                    Type keywords like <span className="font-mono font-bold text-[#C5A46D]">senate</span>, <span className="font-mono font-bold text-[#C5A46D]">unsc</span>, <span className="font-mono font-bold text-[#C5A46D]">lok sabha</span>, or <span className="font-mono font-bold text-[#C5A46D]">disec</span>.
                    The autocomplete dropdown instantly presents official seals, acronyms, and seats count across 60+ global chambers.
                  </p>
                </div>

                <div className="p-3 rounded-xl bg-[#1A2234] border border-white/10 text-[11px] text-slate-300 flex items-center gap-2">
                  <Sparkles className="w-4 h-4 text-amber-600 shrink-0" />
                  <span>Selecting a committee automatically populates recommended topics and matching delegations.</span>
                </div>
              </div>
            )}

            {exploreStep === 2 && (
              <div className="space-y-4">
                <div className="p-4 rounded-2xl bg-[#141A29] border border-white/10 shadow-2xs space-y-2">
                  <div className="flex items-center gap-2 text-[#C5A46D] font-bold text-xs uppercase tracking-wider">
                    <span>⚡</span>
                    <span>2. Quick Blocs &amp; Roster Import</span>
                  </div>
                  <h4 className="text-lg font-black text-[#1f2937] tracking-tight">
                    Assemble Your Delegation Fleet in Seconds
                  </h4>
                  <p className="text-xs text-[#57534e] leading-relaxed">
                    Click 1-touch bundle pills like <span className="font-bold">P5 (+5)</span>, <span className="font-bold">G20 (+19)</span>, <span className="font-bold">BRICS+ (+10)</span>, <span className="font-bold">EU (+27)</span>, or Indian political coalitions (<span className="font-bold">NDA</span>, <span className="font-bold">I.N.D.I.A.</span>).
                    You can also paste a multi-line roster from Google Sheets or Excel and click <span className="font-bold text-[#C5A46D]">Auto-Match &amp; Add</span>.
                  </p>
                </div>

                <div className="p-3 rounded-xl bg-[#1A2234] border border-white/10 text-[11px] text-slate-300 flex items-center gap-2">
                  <Globe className="w-4 h-4 text-[#C5A46D] shrink-0" />
                  <span>Country flags, observer status, and P5 veto powers are assigned automatically.</span>
                </div>
              </div>
            )}

            {exploreStep === 3 && (
              <div className="space-y-4">
                <div className="p-4 rounded-2xl bg-[#141A29] border border-white/10 shadow-2xs space-y-2">
                  <div className="flex items-center gap-2 text-[#C5A46D] font-bold text-xs uppercase tracking-wider">
                    <span>⏱️</span>
                    <span>3. Executive Dais Operations</span>
                  </div>
                  <h4 className="text-lg font-black text-[#1f2937] tracking-tight">
                    General Speakers' List &amp; Dual Caucuses
                  </h4>
                  <p className="text-xs text-[#57534e] leading-relaxed">
                    Once in session, the live Dais Console provides synchronised timers for GSL and Moderated Caucuses, speaker queue reordering, and floor yields (Yield to Chair, Questions, or another Delegate).
                  </p>
                </div>

                <div className="p-3 rounded-xl bg-[#1A2234] border border-white/10 text-[11px] text-slate-300 flex items-center gap-2">
                  <Gavel className="w-4 h-4 text-amber-600 shrink-0" />
                  <span>Use keyboard shortcuts like <kbd className="px-1.5 py-0.5 rounded bg-black/10 font-mono text-[10px]">Space</kbd> for timer and <kbd className="px-1.5 py-0.5 rounded bg-black/10 font-mono text-[10px]">N</kbd> for next speaker.</span>
                </div>
              </div>
            )}

            {exploreStep === 4 && (
              <div className="space-y-4">
                <div className="p-4 rounded-2xl bg-[#141A29] border border-white/10 shadow-2xs space-y-2">
                  <div className="flex items-center gap-2 text-[#C5A46D] font-bold text-xs uppercase tracking-wider">
                    <span>🔔</span>
                    <span>4. Roll Call &amp; Division Bell Voting</span>
                  </div>
                  <h4 className="text-lg font-black text-[#1f2937] tracking-tight">
                    Quorum &amp; Automated Supermajorities
                  </h4>
                  <p className="text-xs text-[#57534e] leading-relaxed">
                    Perform roll-call attendance with <span className="font-bold">Present</span> vs <span className="font-bold">Present and Voting</span>.
                    Launch recorded Division Bell votes on draft resolutions with instant calculation of 2/3 supermajorities and P5 veto detection.
                  </p>
                </div>

                <div className="p-3 rounded-xl bg-emerald-50 border border-emerald-200 text-[11px] text-emerald-800 flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                  <span>You're ready! You can load a pre-configured sample chamber right now or configure your own.</span>
                </div>
              </div>
            )}

            {/* Modal Actions */}
            <div className="pt-2 flex flex-col sm:flex-row items-center justify-between gap-3">
              <div className="flex items-center gap-2 w-full sm:w-auto">
                {exploreStep > 1 && (
                  <button
                    type="button"
                    onClick={() => setExploreStep((prev) => Math.max(1, prev - 1))}
                    className="px-3 py-2 rounded-xl bg-[#141A29] hover:bg-[#1C2438] text-slate-300 text-xs font-bold transition cursor-pointer"
                  >
                    Back
                  </button>
                )}
                {exploreStep < 4 ? (
                  <button
                    type="button"
                    onClick={() => setExploreStep((prev) => Math.min(4, prev + 1))}
                    className="px-4 py-2 rounded-xl bg-[#C5A46D] hover:bg-[#DFBA73] text-white text-xs font-bold transition flex items-center gap-1.5 cursor-pointer shadow-xs"
                  >
                    <span>Next Step</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                ) : (
                  <button
                    type="button"
                    onClick={() => {
                      setExploreTourOpen(false);
                      handleDismissFirstTimerBanner();
                    }}
                    className="px-4 py-2 rounded-xl bg-[#C5A46D] hover:bg-[#DFBA73] text-white text-xs font-bold transition cursor-pointer shadow-xs"
                  >
                    Finish Guide
                  </button>
                )}
              </div>

              <button
                type="button"
                onClick={() => {
                  handleLoadDemoChamber('unsc');
                  setExploreTourOpen(false);
                  handleDismissFirstTimerBanner();
                }}
                className="w-full sm:w-auto px-4 py-2 rounded-xl bg-gradient-to-r from-amber-600 to-amber-500 hover:from-amber-500 hover:to-amber-400 text-white text-xs font-bold transition flex items-center justify-center gap-1.5 cursor-pointer shadow-sm"
              >
                <Sparkles className="w-3.5 h-3.5" />
                <span>⚡ Load Demo &amp; Start</span>
              </button>
            </div>
          </div>
        </div>
      )}
      {/* Zen Pro Unlimited Chamber Roster Lock Modal */}
      <ZenProLockModal
        isOpen={showProLockModal}
        onClose={() => setShowProLockModal(false)}
        feature="UNLIMITED_CHAMBER_ROSTER"
      />
    </div>
  );
}
