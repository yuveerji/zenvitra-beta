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
        welcomeModalOpen: false,
        isActive: false,
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
    <div className="min-h-screen bg-[#030407] text-white font-sans antialiased flex flex-col relative select-none">
      {/* Ambient background glow */}
      <div className="fixed inset-0 pointer-events-none opacity-20 bg-[radial-gradient(ellipse_80%_80%_at_50%_-20%,rgba(6,182,212,0.2),rgba(255,255,255,0))]" />

      {/* Top Navbar */}
      <header className="w-full bg-[#070a12]/95 backdrop-blur-md border-b border-white/10 px-6 py-4 flex items-center justify-between z-40 relative">
        <div className="flex items-center gap-4">
          <span className="font-black tracking-wider text-xs uppercase text-cyan-400">
            ZENVITRA • ZEN.MUN — THE PREMIER MUN DAIS ECOSYSTEM
          </span>
          {onBack && (
            <button
              type="button"
              onClick={onBack}
              className="text-xs font-bold text-neutral-400 hover:text-white flex items-center gap-1 cursor-pointer transition"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>BACK</span>
            </button>
          )}
        </div>
        <div className="flex items-center gap-2">
          <span className="text-xs font-bold text-cyan-300 bg-cyan-950/40 px-3 py-1 rounded-full border border-cyan-500/30 flex items-center gap-1.5 shadow-xs">
            <Globe className="w-3.5 h-3.5" />
            <span>EN</span>
          </span>
        </div>
      </header>

      {/* Main 2-Column Split Stage */}
      <main className="flex-1 max-w-7xl w-full mx-auto p-6 grid grid-cols-1 lg:grid-cols-12 gap-8 items-start relative z-10">
        {/* Left Card: Sections 1 & 2 */}
        <div className="lg:col-span-7 bg-[#070a12]/90 backdrop-blur-md rounded-3xl p-6 sm:p-8 border border-white/10 shadow-2xl space-y-8">
          
          {/* Section 1: Committee */}
          <div className="space-y-4">
            <div className="flex items-center gap-2.5">
              <span className="w-6 h-6 rounded-full bg-cyan-500/10 text-cyan-400 border border-cyan-500/30 font-bold text-xs flex items-center justify-center">
                1
              </span>
              <h2 className="text-lg font-black tracking-tight uppercase text-white">Committee</h2>
            </div>

            {/* Live Preview Card */}
            <div className="p-4 rounded-2xl bg-white/5 border border-white/10 flex items-center gap-4">
              <div className="w-14 h-14 rounded-2xl bg-[#0d1424] shadow-md flex items-center justify-center text-3xl border border-white/10 overflow-hidden p-1.5">
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
                <div className="text-xl font-black text-white truncate tracking-tight">
                  {(acronym || committeeName || 'LOK SABHA').replace(/_/g, ' ')}
                </div>
                <div className="text-xs text-neutral-400 font-medium truncate">
                  Topic: {topic || 'Your topic appears here'}
                </div>
              </div>
            </div>

            {/* Inputs */}
            <div className="space-y-3 relative">
              <div>
                <label className="block text-[10px] font-bold uppercase tracking-wider text-neutral-400 mb-1">
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
                  className="w-full px-4 py-2.5 rounded-xl bg-white/5 border border-white/10 focus:outline-none focus:border-cyan-400 text-sm font-semibold text-white placeholder-white/30"
                />

                {/* Floating Autocomplete Dropdown */}
                {autocompleteOpen && filteredPresets.length > 0 && (
                  <div className="absolute top-16 left-0 right-0 z-30 bg-[#0a0f1d] rounded-2xl shadow-2xl border border-white/15 overflow-hidden animate-fade-in">
                    {filteredPresets.map((p) => (
                      <button
                        key={p.name}
                        type="button"
                        onClick={() => handleSelectPreset(p)}
                        className="w-full px-4 py-3 text-left hover:bg-white/10 flex items-center justify-between border-b border-white/5 last:border-none cursor-pointer transition text-white"
                      >
                        <div className="flex items-center gap-2.5">
                          <span className="text-xl">{p.emblem}</span>
                          <div>
                            <div className="text-xs font-bold text-white">{p.name}</div>
                            <div className="text-[10px] text-cyan-400 font-mono">{p.acronym}</div>
                          </div>
                        </div>
                        <span className="text-[10px] font-mono text-neutral-400 bg-white/5 px-2 py-0.5 rounded border border-white/10">
                          ↵
                        </span>
                      </button>
                    ))}
                  </div>
                )}
              </div>

              <div>
                <label className="block text-[10px] font-bold uppercase tracking-wider text-neutral-400 mb-1">
                  TOPIC
                </label>
                <input
                  type="text"
                  value={topic}
                  onChange={(e) => setTopic(e.target.value)}
                  placeholder="e.g. The right to education"
                  className="w-full px-4 py-2.5 rounded-xl bg-white/5 border border-white/10 focus:outline-none focus:border-cyan-400 text-sm font-semibold text-white placeholder-white/30"
                />
              </div>
            </div>
          </div>

          {/* Section 2: Delegations */}
          <div className="space-y-4 pt-4 border-t border-white/10">
            <div className="flex items-center gap-2.5">
              <span className="w-6 h-6 rounded-full bg-cyan-500/10 text-cyan-400 border border-cyan-500/30 font-bold text-xs flex items-center justify-center">
                2
              </span>
              <h2 className="text-lg font-black tracking-tight uppercase text-white">Delegations</h2>
            </div>

            {/* Search Country Input */}
            <div className="flex items-center gap-2">
              <div className="relative flex-1">
                <Search className="w-4 h-4 text-neutral-400 absolute left-3 top-3" />
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
                  className="w-full pl-9 pr-4 py-2.5 rounded-xl bg-white/5 border border-white/10 focus:outline-none focus:border-cyan-400 text-sm font-medium text-white placeholder-white/30"
                />
              </div>
              <button
                type="button"
                onClick={() => handleAddCountry(searchCountry)}
                className="px-4 py-2.5 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-black text-xs font-black cursor-pointer transition shadow-md"
              >
                + Add
              </button>
            </div>

            {/* 11 Quick-Add Bloc Bundles */}
            <div className="space-y-1.5">
              <div className="text-[10px] font-bold uppercase tracking-wider text-neutral-400">
                QUICK-ADD BLOCS
              </div>
              <div className="flex flex-wrap gap-2">
                {QUICK_BLOC_BUNDLES.map((b) => (
                  <button
                    key={b.id}
                    type="button"
                    onClick={() => handleAddBundle(b)}
                    className="px-3 py-1.5 rounded-full bg-white/5 hover:bg-white/10 border border-white/10 text-xs font-bold text-white flex items-center gap-1.5 transition cursor-pointer active:scale-95 shadow-xs"
                  >
                    <span>{b.icon}</span>
                    <span>{b.name}</span>
                    <span className="text-[10px] text-cyan-400 font-mono font-medium">+{b.count}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Paste a List */}
            <div className="space-y-1.5 pt-2">
              <div className="flex items-center justify-between">
                <label className="text-[10px] font-bold uppercase tracking-wider text-neutral-400">
                  • PASTE A LIST
                </label>
                {pasteList.trim() && (
                  <button
                    type="button"
                    onClick={handleParsePasteList}
                    className="text-[10px] font-bold text-cyan-400 hover:underline cursor-pointer"
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
                className="w-full px-4 py-2.5 rounded-xl bg-white/5 border border-white/10 focus:outline-none focus:border-cyan-400 text-xs font-mono text-white placeholder-white/30"
              />
            </div>
          </div>
        </div>

        {/* Right Card: Live Roster Preview */}
        <div className="lg:col-span-5 bg-[#070a12]/90 backdrop-blur-md rounded-3xl p-6 sm:p-8 border border-white/10 shadow-2xl flex flex-col min-h-[620px]">
          <div className="flex items-center justify-between pb-4 border-b border-white/10">
            <h3 className="text-xl font-black text-white tracking-tight">
              {delegations.length} delegations
            </h3>
            {delegations.length > 0 && (
              <button
                type="button"
                onClick={() => setDelegations([])}
                className="text-[10px] font-bold uppercase tracking-wider text-rose-400 hover:underline cursor-pointer"
              >
                Clear all
              </button>
            )}
          </div>

          {/* Roster Area */}
          <div className="flex-1 py-4 overflow-y-auto max-h-[460px] space-y-2 pr-1">
            {delegations.length === 0 ? (
              <div className="h-full flex flex-col items-center justify-center text-center py-20 text-neutral-400 space-y-3">
                <div className="w-16 h-16 rounded-full bg-white/5 border border-white/10 flex items-center justify-center text-3xl">
                  🌐
                </div>
                <div>
                  <div className="text-sm font-bold text-white">No Delegates Yet</div>
                  <div className="text-xs max-w-xs leading-relaxed text-neutral-400">
                    Add a country, paste a list, or use a quick bundle above.
                  </div>
                </div>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                {delegations.map((d) => (
                  <div
                    key={d.id}
                    className="p-2.5 rounded-xl bg-[#0d1424] border border-white/10 flex items-center justify-between group hover:border-cyan-500/40 transition"
                  >
                    <div className="flex items-center gap-2 min-w-0">
                      <img
                        src={`https://flagcdn.com/w80/${d.countryCode.toLowerCase()}.png`}
                        alt={d.name}
                        className="w-5 h-5 rounded-full object-cover shadow-xs border border-white/20 shrink-0"
                        onError={(e) => {
                          (e.target as HTMLElement).style.display = 'none';
                        }}
                      />
                      <span className="text-xs font-bold text-white truncate">{d.name}</span>
                      {d.role === 'observer' && (
                        <span className="text-[9px] font-mono uppercase bg-amber-500/20 text-amber-300 border border-amber-500/30 px-1 rounded shrink-0">
                          Obs
                        </span>
                      )}
                    </div>
                    <button
                      type="button"
                      onClick={() => handleRemoveDelegation(d.id)}
                      className="text-neutral-500 hover:text-rose-400 opacity-60 group-hover:opacity-100 p-0.5 cursor-pointer transition"
                    >
                      <X className="w-3.5 h-3.5" />
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Launch Button */}
          <div className="pt-4 border-t border-white/10">
            <button
              type="button"
              onClick={handleLaunch}
              className="w-full py-4 rounded-2xl bg-gradient-to-r from-emerald-500 to-teal-400 hover:from-emerald-400 hover:to-teal-300 text-black font-black text-sm uppercase tracking-wider transition shadow-lg shadow-emerald-500/20 flex items-center justify-center gap-2 cursor-pointer active:scale-98"
            >
              <span>Start Committee Session &rarr;</span>
            </button>
          </div>
        </div>
      </main>
    </div>
  );
}
