'use client';

import React, { useState } from 'react';
import { Globe, ArrowLeft, Plus, X, Search, Check, Building2 } from 'lucide-react';
import { PRESET_COMMITTEES, QUICK_BLOC_BUNDLES, ZenDelegate } from '@/types/zenMun';
import { useZenMun, generateSessionCode } from '@/context/ZenMunContext';

interface PreSessionSetupViewProps {
  onStartSession: () => void;
  onBack?: () => void;
}

export function PreSessionSetupView({ onStartSession, onBack }: PreSessionSetupViewProps) {
  const { session, setSession } = useZenMun();

  const [committeeName, setCommitteeName] = useState(session.committeeName || 'Lok Sabha');
  const [acronym, setAcronym] = useState(session.committeeAcronym || 'LOK SABHA');
  const [topic, setTopic] = useState(session.topic || 'delimitation');
  const [emblem, setEmblem] = useState(session.emblemUrl || '🏛️');
  const [isIndian, setIsIndian] = useState(Boolean(session.isIndianCommittee));

  const [autocompleteOpen, setAutocompleteOpen] = useState(false);
  const [searchCountry, setSearchCountry] = useState('');
  const [pasteList, setPasteList] = useState('');

  const [delegations, setDelegations] = useState<ZenDelegate[]>(session.roster || []);

  // Filter autocomplete
  const filteredPresets = PRESET_COMMITTEES.filter(
    (p) =>
      p.name.toLowerCase().includes(committeeName.toLowerCase()) ||
      p.acronym.toLowerCase().includes(committeeName.toLowerCase())
  );

  const handleSelectPreset = (p: typeof PRESET_COMMITTEES[0]) => {
    setCommitteeName(p.name);
    setAcronym(p.acronym);
    setEmblem(p.emblem);
    setIsIndian(Boolean(p.isIndian));
    setAutocompleteOpen(false);
  };

  const handleAddCountry = (name: string, isObserver = false, customCode?: string) => {
    const clean = name.trim();
    if (!clean) return;
    if (delegations.some((d) => d.name.toLowerCase() === clean.toLowerCase())) return;

    const id = `del_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`;
    const code = customCode || clean.slice(0, 2).toLowerCase();
    const newDel: ZenDelegate = {
      id,
      name: clean,
      countryCode: code,
      role: isObserver ? 'observer' : 'member',
      attendance: 'present',
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
          id: `del_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`,
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

  const handleParsePasteList = () => {
    if (!pasteList.trim()) return;
    const lines = pasteList
      .split(/[\n,]+/)
      .map((s) => s.trim())
      .filter(Boolean);

    const existing = new Set(delegations.map((d) => d.name.toLowerCase()));
    const toAdd: ZenDelegate[] = [];
    lines.forEach((line) => {
      const isObs = line.toLowerCase().includes('(obs') || line.toLowerCase().includes('observer');
      const cleanName = line.replace(/\((obs|observer)\)/gi, '').trim();
      if (cleanName && !existing.has(cleanName.toLowerCase())) {
        toAdd.push({
          id: `del_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`,
          name: cleanName,
          countryCode: cleanName.slice(0, 2).toLowerCase(),
          role: isObs ? 'observer' : 'member',
          attendance: 'present',
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

  const handleLaunch = () => {
    const finalDelegates = delegations.length > 0 ? delegations : session.roster;
    const firstQueue = finalDelegates.slice(0, 4).map((d) => d.id);
    const cleanAcronym = (acronym.trim() || committeeName.trim() || 'LOK SABHA').replace(/_/g, ' ');
    const isInd = Boolean(isIndian || cleanAcronym.toLowerCase().includes('lok'));
    const emblemToUse = isInd ? '/assets/committees/emblem_of_india.svg' : (emblem || '/assets/committees/un.svg');

    const cleanCode =
      session.sessionCode && session.sessionCode !== 'PJL6KY'
        ? session.sessionCode
        : generateSessionCode();

    const updated = {
      ...session,
      sessionCode: cleanCode,
      sessionState: 'in-session' as const,
      tutorial: {
        ...session.tutorial,
        welcomeModalOpen: true,
      },
      committeeName: (committeeName.trim() || 'Lok Sabha').replace(/_/g, ' '),
      committeeAcronym: cleanAcronym,
      topic: topic.trim() || 'delimitation',
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
    <div className="min-h-screen bg-[#E5E1D5] text-[#1A1D1A] font-sans antialiased flex flex-col">
      {/* Top Navbar */}
      <header className="w-full bg-[#E5E1D5] border-b border-[#D6D1C4] px-6 py-4 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <span className="font-extrabold tracking-wider text-xs uppercase text-[#243928]">
            ZENVITRA &bull; ZEN.MUN &mdash; THE PREMIER MUN DAIS ECOSYSTEM
          </span>
          {onBack && (
            <button
              type="button"
              onClick={onBack}
              className="text-xs font-bold text-[#555] hover:text-black flex items-center gap-1 cursor-pointer"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>BACK</span>
            </button>
          )}
        </div>
        <div className="flex items-center gap-2">
          <span className="text-xs font-bold text-[#243928] bg-white/70 px-3 py-1 rounded-full border border-[#D6D1C4] flex items-center gap-1.5 shadow-sm">
            <Globe className="w-3.5 h-3.5" />
            <span>EN</span>
          </span>
        </div>
      </header>

      {/* Main 2-Column Split Stage */}
      <main className="flex-1 max-w-7xl w-full mx-auto p-6 grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left Card: Sections 1 & 2 */}
        <div className="lg:col-span-7 bg-[#FAF9F5] rounded-3xl p-6 sm:p-8 border border-[#D6D1C4] shadow-sm space-y-8">
          
          {/* Section 1: Committee */}
          <div className="space-y-4">
            <div className="flex items-center gap-2.5">
              <span className="w-6 h-6 rounded-full bg-[#243928] text-[#E4DB98] font-bold text-xs flex items-center justify-center">
                1
              </span>
              <h2 className="text-lg font-black tracking-tight uppercase text-[#243928]">Committee</h2>
            </div>

            {/* Live Preview Card */}
            <div className="p-4 rounded-2xl bg-[#F0EDE4] border border-[#E0DCCE] flex items-center gap-4">
              <div className="w-14 h-14 rounded-2xl bg-white shadow-sm flex items-center justify-center text-3xl border border-[#D6D1C4] overflow-hidden p-1.5">
                {isIndian || acronym.toLowerCase().includes('lok') ? (
                  <img
                    src="/assets/committees/emblem_of_india.svg"
                    alt="Emblem of India"
                    className="w-full h-full object-contain"
                  />
                ) : emblem.startsWith('/') || emblem.startsWith('http') ? (
                  <img src={emblem} alt="Emblem" className="w-full h-full object-contain" />
                ) : (
                  <span>{emblem}</span>
                )}
              </div>
              <div className="flex-1 min-w-0">
                <div className="text-xl font-black text-[#1A1D1A] truncate tracking-tight">
                  {(acronym || committeeName || 'LOK SABHA').replace(/_/g, ' ')}
                </div>
                <div className="text-xs text-[#7A7870] font-medium truncate">
                  Topic: {topic || 'Your topic appears here'}
                </div>
              </div>
            </div>

            {/* Inputs */}
            <div className="space-y-3 relative">
              <div>
                <label className="block text-[10px] font-bold uppercase tracking-wider text-[#7A7870] mb-1">
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
                  placeholder="e.g. UN Human Rights Council"
                  className="w-full px-4 py-2.5 rounded-xl bg-white border border-[#D6D1C4] focus:outline-none focus:ring-2 focus:ring-[#243928] text-sm font-semibold text-[#1A1D1A]"
                />

                {/* Floating Autocomplete Dropdown */}
                {autocompleteOpen && filteredPresets.length > 0 && (
                  <div className="absolute top-16 left-0 right-0 z-30 bg-white rounded-2xl shadow-xl border border-[#D6D1C4] overflow-hidden animate-fade-in">
                    {filteredPresets.map((p) => (
                      <button
                        key={p.name}
                        type="button"
                        onClick={() => handleSelectPreset(p)}
                        className="w-full px-4 py-3 text-left hover:bg-[#F5F3EB] flex items-center justify-between border-b border-[#F0EDE4] last:border-none cursor-pointer"
                      >
                        <div className="flex items-center gap-2.5">
                          <span className="text-xl">{p.emblem}</span>
                          <div>
                            <div className="text-xs font-bold text-[#1A1D1A]">{p.name}</div>
                            <div className="text-[10px] text-[#7A7870] font-mono">{p.acronym}</div>
                          </div>
                        </div>
                        <span className="text-[10px] font-mono text-[#7A7870] bg-[#EFECE4] px-1.5 py-0.5 rounded">
                          &crarr;
                        </span>
                      </button>
                    ))}
                  </div>
                )}
              </div>

              <div>
                <label className="block text-[10px] font-bold uppercase tracking-wider text-[#7A7870] mb-1">
                  TOPIC
                </label>
                <input
                  type="text"
                  value={topic}
                  onChange={(e) => setTopic(e.target.value)}
                  placeholder="e.g. The right to education"
                  className="w-full px-4 py-2.5 rounded-xl bg-white border border-[#D6D1C4] focus:outline-none focus:ring-2 focus:ring-[#243928] text-sm font-semibold text-[#1A1D1A]"
                />
              </div>
            </div>
          </div>

          {/* Section 2: Delegations */}
          <div className="space-y-4 pt-4 border-t border-[#EFECE4]">
            <div className="flex items-center gap-2.5">
              <span className="w-6 h-6 rounded-full bg-[#243928] text-[#E4DB98] font-bold text-xs flex items-center justify-center">
                2
              </span>
              <h2 className="text-lg font-black tracking-tight uppercase text-[#243928]">Delegations</h2>
            </div>

            {/* Search Country Input */}
            <div className="flex items-center gap-2">
              <div className="relative flex-1">
                <Search className="w-4 h-4 text-[#7A7870] absolute left-3 top-3" />
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
                  className="w-full pl-9 pr-4 py-2.5 rounded-xl bg-white border border-[#D6D1C4] focus:outline-none focus:ring-2 focus:ring-[#243928] text-sm font-medium"
                />
              </div>
              <button
                type="button"
                onClick={() => handleAddCountry(searchCountry)}
                className="px-4 py-2.5 rounded-xl bg-[#243928] hover:bg-[#324f38] text-white text-xs font-bold cursor-pointer transition"
              >
                + Add
              </button>
            </div>

            {/* 11 Quick-Add Bloc Bundles */}
            <div className="space-y-1.5">
              <div className="text-[10px] font-bold uppercase tracking-wider text-[#7A7870]">
                QUICK-ADD BLOCS
              </div>
              <div className="flex flex-wrap gap-2">
                {QUICK_BLOC_BUNDLES.map((b) => (
                  <button
                    key={b.id}
                    type="button"
                    onClick={() => handleAddBundle(b)}
                    className="px-3 py-1.5 rounded-full bg-[#EFECE4] hover:bg-[#E2DDD2] border border-[#D6D1C4] text-xs font-bold text-[#1A1D1A] flex items-center gap-1.5 transition cursor-pointer active:scale-95 shadow-2xs"
                  >
                    <span>{b.icon}</span>
                    <span>{b.name}</span>
                    <span className="text-[10px] text-[#7A7870] font-mono font-medium">+{b.count}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Paste a List */}
            <div className="space-y-1.5 pt-2">
              <div className="flex items-center justify-between">
                <label className="text-[10px] font-bold uppercase tracking-wider text-[#7A7870]">
                  &bull; PASTE A LIST
                </label>
                {pasteList.trim() && (
                  <button
                    type="button"
                    onClick={handleParsePasteList}
                    className="text-[10px] font-bold text-[#243928] hover:underline cursor-pointer"
                  >
                    Parse &amp; Add List
                  </button>
                )}
              </div>
              <textarea
                value={pasteList}
                onChange={(e) => setPasteList(e.target.value)}
                onBlur={handleParsePasteList}
                rows={3}
                placeholder={"France\nGermany\nBrazil, India...\nObserver Delegation"}
                className="w-full px-4 py-2.5 rounded-xl bg-white border border-[#D6D1C4] focus:outline-none focus:ring-2 focus:ring-[#243928] text-xs font-mono"
              />
            </div>
          </div>
        </div>

        {/* Right Card: Live Roster Preview */}
        <div className="lg:col-span-5 bg-[#FAF9F5] rounded-3xl p-6 sm:p-8 border border-[#D6D1C4] shadow-sm flex flex-col min-h-[620px]">
          <div className="flex items-center justify-between pb-4 border-b border-[#EFECE4]">
            <h3 className="text-xl font-black text-[#1A1D1A] tracking-tight">
              {delegations.length} delegations
            </h3>
            {delegations.length > 0 && (
              <button
                type="button"
                onClick={() => setDelegations([])}
                className="text-[10px] font-bold uppercase tracking-wider text-rose-600 hover:underline cursor-pointer"
              >
                Clear all
              </button>
            )}
          </div>

          {/* Roster Area */}
          <div className="flex-1 py-4 overflow-y-auto max-h-[460px] space-y-2 pr-1">
            {delegations.length === 0 ? (
              <div className="h-full flex flex-col items-center justify-center text-center py-20 text-[#7A7870] space-y-3">
                <div className="w-16 h-16 rounded-full bg-[#EFECE4] flex items-center justify-center text-3xl">
                  🌐
                </div>
                <div>
                  <div className="text-sm font-bold text-[#1A1D1A]">No Delegates Yet</div>
                  <div className="text-xs max-w-xs leading-relaxed text-[#7A7870]">
                    Add a country, paste a list, or use a quick bundle above.
                  </div>
                </div>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                {delegations.map((d) => (
                  <div
                    key={d.id}
                    className="p-2.5 rounded-xl bg-[#F0EDE4] border border-[#E0DCCE] flex items-center justify-between group hover:border-[#243928]/40 transition"
                  >
                    <div className="flex items-center gap-2 min-w-0">
                      <img
                        src={`https://flagcdn.com/w80/${d.countryCode.toLowerCase()}.png`}
                        alt={d.name}
                        className="w-5 h-5 rounded-full object-cover shadow-2xs border border-black/10 shrink-0"
                        onError={(e) => {
                          (e.target as HTMLElement).style.display = 'none';
                        }}
                      />
                      <span className="text-xs font-bold text-[#1A1D1A] truncate">{d.name}</span>
                      {d.role === 'observer' && (
                        <span className="text-[9px] font-mono uppercase bg-amber-200/80 text-amber-900 px-1 rounded shrink-0">
                          Obs
                        </span>
                      )}
                    </div>
                    <button
                      type="button"
                      onClick={() => handleRemoveDelegation(d.id)}
                      className="text-[#7A7870] hover:text-rose-600 opacity-60 group-hover:opacity-100 p-0.5 cursor-pointer"
                    >
                      <X className="w-3.5 h-3.5" />
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Launch Button */}
          <div className="pt-4 border-t border-[#EFECE4]">
            <button
              type="button"
              onClick={handleLaunch}
              className="w-full py-4 rounded-2xl bg-[#243928] hover:bg-[#324f38] text-[#E4DB98] font-black text-sm uppercase tracking-wider transition shadow-lg shadow-[#243928]/20 flex items-center justify-center gap-2 cursor-pointer active:scale-98"
            >
              <span>Start Committee Session &rarr;</span>
            </button>
          </div>
        </div>
      </main>
    </div>
  );
}
