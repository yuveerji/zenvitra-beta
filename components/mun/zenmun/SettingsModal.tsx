'use client';

import React, { useState } from 'react';
import {
  X,
  Shield,
  FileText,
  Vote,
  Star,
  Users,
  Copy,
  Check,
  Info,
  BookOpen,
  Link2,
  RefreshCw,
} from 'lucide-react';
import { useZenMun } from '@/context/ZenMunContext';

export function SettingsModal() {
  const {
    session,
    setSession,
    regenerateSessionCode,
    showSettingsModal,
    setShowSettingsModal,
    activeSettingsTab,
    setActiveSettingsTab,
    removeSeat,
  } = useZenMun();

  const [copiedCode, setCopiedCode] = useState(false);
  const [rotatedCode, setRotatedCode] = useState(false);
  const [selectedLanguage, setSelectedLanguage] = useState('EN');

  // Score source item toggles
  const [enabledSources, setEnabledSources] = useState<Record<string, boolean>>({
    attendance: true,
    gslSpeech: true,
    caucusSpeech: true,
    speakingTimePer10s: true,
    motionRaised: true,
    motionPassed: true,
    rightOfReply: true,
    workingPaper: true,
    draftResolution: true,
    drPassed: true,
  });

  const [rateSpeechesEnabled, setRateSpeechesEnabled] = useState(true);

  if (!showSettingsModal) return null;

  const handleCopyCode = () => {
    navigator.clipboard.writeText(session.sessionCode);
    setCopiedCode(true);
    setTimeout(() => setCopiedCode(false), 2000);
  };

  const updateSetting = <K extends keyof typeof session.settings>(
    key: K,
    value: typeof session.settings[K]
  ) => {
    setSession((prev) => ({
      ...prev,
      settings: { ...prev.settings, [key]: value },
    }));
  };

  const updatePointValue = (key: keyof typeof session.settings.pointValues, delta: number) => {
    setSession((prev) => {
      const current = prev.settings.pointValues[key] ?? 5;
      const nextVal = Math.max(0, current + delta);
      return {
        ...prev,
        settings: {
          ...prev.settings,
          pointValues: {
            ...prev.settings.pointValues,
            [key]: nextVal,
          },
        },
      };
    });
  };

  const toggleSource = (key: string) => {
    setEnabledSources((prev) => ({ ...prev, [key]: !prev[key] }));
  };

  // Ranking Blend Calculation
  const blend = session.settings.rankingBlend ?? 0;
  const objectivePercent = 100 - blend;
  const qualityPercent = blend;

  // Donut SVG circumference calculation
  const radius = 64;
  const strokeWidth = 20;
  const circumference = 2 * Math.PI * radius;
  const objectiveDash = (objectivePercent / 100) * circumference;
  const qualityDash = (qualityPercent / 100) * circumference;

  const scoreSourceItems: Array<{
    key: keyof typeof session.settings.pointValues;
    label: string;
    defaultVal: number;
  }> = [
    { key: 'attendance', label: 'Attendance (P/PV)', defaultVal: 5 },
    { key: 'gslSpeech', label: 'GSL speech', defaultVal: 10 },
    { key: 'caucusSpeech', label: 'Caucus speech', defaultVal: 8 },
    { key: 'speakingTimePer10s', label: 'Speaking time /10s', defaultVal: 1 },
    { key: 'motionRaised', label: 'Motion raised', defaultVal: 10 },
    { key: 'motionPassed', label: 'Motion passed', defaultVal: 10 },
    { key: 'rightOfReply', label: 'Right of reply', defaultVal: 5 },
    { key: 'workingPaper', label: 'Working paper', defaultVal: 10 },
    { key: 'draftResolution', label: 'Draft resolution', defaultVal: 20 },
    { key: 'drPassed', label: 'DR passed', defaultVal: 10 },
  ];

  return (
    <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-3 sm:p-6 animate-fade-in select-none">
      <div className="w-full max-w-5xl bg-[#090d16] rounded-3xl border border-white/15 shadow-2xl overflow-hidden flex flex-col md:flex-row h-[90vh] max-h-[820px]">
        
        {/* ─────────────────────────────────────────────────────────────
            LEFT SIDEBAR: Sovereign Obsidian
        ───────────────────────────────────────────────────────────── */}
        <aside className="w-full md:w-52 bg-[#070a12]/95 text-white flex flex-col justify-between shrink-0 select-none border-b md:border-b-0 md:border-r border-white/10">
          {/* Tabs List */}
          <div className="p-3 pt-5 space-y-1.5">
            {[
              { id: 'access', label: 'Access', icon: Shield },
              { id: 'motions', label: 'Motions', icon: FileText },
              { id: 'voting', label: 'Voting', icon: Vote },
              { id: 'points', label: 'Points', icon: Star },
              { id: 'people', label: 'People', icon: Users },
            ].map((tab) => {
              const Icon = tab.icon;
              const isActive = activeSettingsTab === tab.id;

              if (isActive) {
                return (
                  <button
                    key={tab.id}
                    type="button"
                    onClick={() => setActiveSettingsTab(tab.id as any)}
                    style={{
                      clipPath: 'polygon(0 0, calc(100% - 10px) 0, 100% 50%, calc(100% - 10px) 100%, 0 100%)',
                    }}
                    className="w-full text-left py-2.5 px-4 bg-cyan-500 text-black font-black text-xs flex items-center gap-2.5 shadow-md transition cursor-pointer pr-5"
                  >
                    <Icon className="w-4 h-4 fill-black text-black" />
                    <span className="tracking-wide">{tab.label}</span>
                  </button>
                );
              }

              return (
                <button
                  key={tab.id}
                  type="button"
                  onClick={() => setActiveSettingsTab(tab.id as any)}
                  className="w-full text-left py-2.5 px-4 rounded-xl text-neutral-400 hover:text-white hover:bg-white/5 font-bold text-xs flex items-center gap-2.5 transition cursor-pointer"
                >
                  <Icon className="w-4 h-4 text-neutral-400" />
                  <span>{tab.label}</span>
                </button>
              );
            })}
          </div>

          {/* Bottom Language Switcher */}
          <div className="p-4 border-t border-white/10 space-y-2.5">
            <div className="flex items-center gap-1.5 flex-wrap">
              {['EN', 'ES', 'FR', 'PT', 'ع'].map((lang) => (
                <button
                  key={lang}
                  type="button"
                  onClick={() => setSelectedLanguage(lang)}
                  className={`px-2 py-0.5 rounded text-[10px] font-bold transition cursor-pointer ${
                    selectedLanguage === lang
                      ? 'bg-cyan-500 text-black'
                      : 'text-neutral-400 hover:text-white bg-white/5'
                  }`}
                >
                  {lang}
                </button>
              ))}
            </div>
            <button
              type="button"
              className="text-[11px] text-neutral-400 hover:text-cyan-400 transition cursor-pointer flex items-center gap-1"
            >
              <span>+</span>
              <span>Request a language</span>
            </button>
          </div>
        </aside>

        {/* ─────────────────────────────────────────────────────────────
            RIGHT MAIN PANE
        ───────────────────────────────────────────────────────────── */}
        <main className="flex-1 flex flex-col min-w-0 bg-[#090d16] overflow-hidden">
          
          {/* Header Bar */}
          <header className="px-6 py-4 border-b border-white/10 flex items-center justify-between shrink-0 bg-[#0a0f1d]">
            <div>
              <h2 className="text-xl font-black text-white tracking-tight">
                {activeSettingsTab === 'points'
                  ? 'Points and ranking'
                  : `${activeSettingsTab.charAt(0).toUpperCase() + activeSettingsTab.slice(1)} Settings`}
              </h2>
              <p className="text-xs text-neutral-400 font-medium pt-0.5">
                {activeSettingsTab === 'points'
                  ? 'How delegates are scored and ranked.'
                  : 'Configure rules and parameters for this session.'}
              </p>
            </div>

            <div className="flex items-center gap-3">
              {/* Saves Instantly Badge */}
              <div className="hidden sm:inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-[11px] font-bold">
                <Check className="w-3.5 h-3.5 text-emerald-400" />
                <span>Saves instantly</span>
              </div>

              {/* Close Button */}
              <button
                type="button"
                onClick={() => setShowSettingsModal(false)}
                className="w-8 h-8 rounded-full bg-white/5 hover:bg-white/10 text-neutral-400 hover:text-white flex items-center justify-center transition cursor-pointer border border-white/10"
                title="Close"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          </header>

          {/* Content Body */}
          <div className="flex-1 overflow-y-auto p-4 sm:p-6 text-white">
            
            {/* ══════════════════════════════════════════════════════════
                TAB: POINTS
            ══════════════════════════════════════════════════════════ */}
            {activeSettingsTab === 'points' && (
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
                
                {/* ─────────────────── LEFT: Score Sources (5 cols) ─────────────────── */}
                <div className="lg:col-span-5 space-y-3.5">
                  <div className="flex items-center gap-1.5 text-white">
                    <BookOpen className="w-4 h-4 text-cyan-400" />
                    <h3 className="text-sm font-black tracking-tight">Score sources</h3>
                    <Info className="w-3.5 h-3.5 text-neutral-400 cursor-pointer" />
                  </div>

                  <div className="space-y-1.5">
                    {scoreSourceItems.map((item) => {
                      const isEnabled = enabledSources[item.key] ?? true;
                      const val = session.settings.pointValues[item.key] ?? item.defaultVal;

                      return (
                        <div
                          key={item.key}
                          className="flex items-center justify-between py-2 px-3 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 transition"
                        >
                          {/* Left: Switch + Label */}
                          <div className="flex items-center gap-2.5 min-w-0">
                            <button
                              type="button"
                              onClick={() => toggleSource(item.key)}
                              className={`w-8 h-4 rounded-full transition-colors relative cursor-pointer shrink-0 ${
                                isEnabled ? 'bg-cyan-500' : 'bg-white/20'
                              }`}
                            >
                              <span
                                className={`w-3 h-3 rounded-full bg-black absolute top-0.5 transition-transform ${
                                  isEnabled ? 'left-4.5' : 'left-0.5'
                                }`}
                              />
                            </button>
                            <span
                              className={`text-xs font-semibold truncate ${
                                isEnabled ? 'text-white' : 'text-neutral-500 line-through'
                              }`}
                            >
                              {item.label}
                            </span>
                          </div>

                          {/* Right: Stepper [-] val pts [+] */}
                          <div className="flex items-center gap-1 bg-black/40 border border-white/10 rounded-lg px-1.5 py-0.5 shrink-0">
                            <button
                              type="button"
                              disabled={!isEnabled}
                              onClick={() => updatePointValue(item.key, -1)}
                              className="text-xs font-black text-neutral-400 hover:text-white px-1 disabled:opacity-30 cursor-pointer"
                            >
                              -
                            </button>
                            <span className="font-mono font-bold text-xs text-cyan-400 px-1">
                              {val} pts
                            </span>
                            <button
                              type="button"
                              disabled={!isEnabled}
                              onClick={() => updatePointValue(item.key, 1)}
                              className="text-xs font-black text-neutral-400 hover:text-white px-1 disabled:opacity-30 cursor-pointer"
                            >
                              +
                            </button>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>

                {/* ─────────────────── CENTER: Ranking Blend (4 cols) ─────────────────── */}
                <div className="lg:col-span-4 flex flex-col items-center text-center space-y-4 px-2">
                  <div className="space-y-1">
                    <div className="flex items-center justify-center gap-1.5 text-white">
                      <Link2 className="w-4 h-4 text-cyan-400" />
                      <h3 className="text-sm font-black tracking-tight">Ranking blend</h3>
                      <Info className="w-3.5 h-3.5 text-neutral-400 cursor-pointer" />
                    </div>
                    <p className="text-[11px] text-neutral-400 max-w-xs mx-auto leading-relaxed">
                      Decide whether ranking is based on objective score, chair quality rating, or a blend of both.
                    </p>
                  </div>

                  {/* Circular Donut Gauge */}
                  <div className="relative w-44 h-44 flex items-center justify-center my-2">
                    <svg className="w-full h-full -rotate-90" viewBox="0 0 160 160">
                      {/* Background circle */}
                      <circle
                        cx="80"
                        cy="80"
                        r={radius}
                        fill="none"
                        stroke="#1f293d"
                        strokeWidth={strokeWidth}
                      />
                      {/* Objective Arc (Cyan) */}
                      <circle
                        cx="80"
                        cy="80"
                        r={radius}
                        fill="none"
                        stroke="#06b6d4"
                        strokeWidth={strokeWidth}
                        strokeDasharray={`${objectiveDash} ${circumference}`}
                        strokeDashoffset="0"
                        strokeLinecap="round"
                        className="transition-all duration-300"
                      />
                      {/* Quality Arc (Amber) */}
                      {qualityPercent > 0 && (
                        <circle
                          cx="80"
                          cy="80"
                          r={radius}
                          fill="none"
                          stroke="#f59e0b"
                          strokeWidth={strokeWidth}
                          strokeDasharray={`${qualityDash} ${circumference}`}
                          strokeDashoffset={-objectiveDash}
                          strokeLinecap="round"
                          className="transition-all duration-300"
                        />
                      )}
                    </svg>

                    {/* Donut Center Ratio Display */}
                    <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
                      <span className="font-mono text-2xl font-black text-white tracking-tight">
                        {objectivePercent} / {qualityPercent}
                      </span>
                    </div>
                  </div>

                  {/* Legend */}
                  <div className="flex items-center justify-center gap-4 text-xs font-bold text-white">
                    <div className="flex items-center gap-1.5">
                      <span className="w-3 h-3 rounded-xs bg-cyan-400" />
                      <span>Objective {objectivePercent}%</span>
                    </div>
                    <div className="flex items-center gap-1.5">
                      <span className="w-3 h-3 rounded-xs bg-amber-400" />
                      <span>Quality {qualityPercent}%</span>
                    </div>
                  </div>

                  {/* Tick-Mark Horizontal Slider */}
                  <div className="w-full max-w-xs space-y-2 pt-2">
                    <div className="relative py-2 flex items-center">
                      <input
                        type="range"
                        min={0}
                        max={100}
                        step={5}
                        value={session.settings.rankingBlend ?? 0}
                        onChange={(e) => updateSetting('rankingBlend', parseInt(e.target.value) || 0)}
                        className="w-full h-2 bg-white/10 rounded-lg appearance-none cursor-pointer accent-cyan-400"
                      />
                    </div>

                    {/* Flank Labels */}
                    <div className="flex items-center justify-between text-[11px] font-bold text-neutral-400 uppercase tracking-wider px-1">
                      <span>Objective</span>
                      <span>Quality</span>
                    </div>
                  </div>
                </div>

                {/* ─────────────────── RIGHT: Quality Factors (3 cols) ─────────────────── */}
                <div className="lg:col-span-3 space-y-4">
                  <div className="space-y-1">
                    <div className="flex items-center gap-1.5 text-white">
                      <Star className="w-4 h-4 text-amber-400" />
                      <h3 className="text-sm font-black tracking-tight">Quality factors</h3>
                      <Info className="w-3.5 h-3.5 text-neutral-400 cursor-pointer" />
                    </div>
                    <p className="text-[11px] text-neutral-400 leading-relaxed">
                      Commenters can rate speeches on a 1-5 scale.
                    </p>
                  </div>

                  {/* Rate speeches toggle row */}
                  <div className="p-3.5 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-between shadow-xs">
                    <div className="flex items-center gap-2.5">
                      <button
                        type="button"
                        onClick={() => setRateSpeechesEnabled(!rateSpeechesEnabled)}
                        className={`w-8 h-4 rounded-full transition-colors relative cursor-pointer ${
                          rateSpeechesEnabled ? 'bg-cyan-500' : 'bg-white/20'
                        }`}
                      >
                        <span
                          className={`w-3 h-3 rounded-full bg-black absolute top-0.5 transition-transform ${
                            rateSpeechesEnabled ? 'left-4.5' : 'left-0.5'
                          }`}
                        />
                      </button>
                      <div className="flex items-center gap-1 text-xs font-bold text-white">
                        <span>Rate speeches</span>
                        <Info className="w-3 h-3 text-neutral-400" />
                      </div>
                    </div>

                    <div className="flex items-center gap-1 px-2 py-0.5 rounded-md bg-amber-500/20 border border-amber-500/30 text-[11px] font-bold text-amber-300">
                      <Star className="w-3 h-3 fill-amber-400 text-amber-400" />
                      <span>1-5</span>
                    </div>
                  </div>

                  {/* "How it breaks down" Card */}
                  <div className="p-4 rounded-2xl bg-white/5 border border-white/10 space-y-3.5 shadow-xs">
                    <div className="text-xs font-black uppercase text-white tracking-wide">
                      How it breaks down
                    </div>

                    <div className="space-y-2.5 text-xs">
                      {/* Points share */}
                      <div className="space-y-1">
                        <div className="flex justify-between text-[11px] font-bold text-neutral-400">
                          <span>Points share</span>
                          <span className="font-mono text-cyan-400">80</span>
                        </div>
                        <div className="w-full h-2 rounded-full bg-white/10 overflow-hidden">
                          <div className="h-full bg-cyan-500 rounded-full" style={{ width: '80%' }} />
                        </div>
                      </div>

                      {/* Quality rating */}
                      <div className="space-y-1">
                        <div className="flex justify-between text-[11px] font-bold text-neutral-400">
                          <span>Quality rating</span>
                          <span className="font-mono text-amber-400">60</span>
                        </div>
                        <div className="w-full h-2 rounded-full bg-white/10 overflow-hidden">
                          <div className="h-full bg-amber-400 rounded-full" style={{ width: '60%' }} />
                        </div>
                      </div>

                      {/* Headline score */}
                      <div className="space-y-1 pt-1 border-t border-white/10">
                        <div className="flex justify-between text-xs font-black text-white">
                          <span>Headline score</span>
                          <span className="font-mono text-emerald-400">80</span>
                        </div>
                        <div className="w-full h-2.5 rounded-full bg-white/10 overflow-hidden">
                          <div className="h-full bg-gradient-to-r from-emerald-500 to-teal-400 rounded-full" style={{ width: '80%' }} />
                        </div>
                      </div>
                    </div>

                    <p className="text-[10px] text-neutral-400 leading-relaxed pt-1">
                      A delegate&apos;s headline score combines their relative share of points with their average quality rating from the chair.
                    </p>
                  </div>
                </div>

              </div>
            )}

            {/* ══════════════════════════════════════════════════════════
                TAB: ACCESS
            ══════════════════════════════════════════════════════════ */}
            {activeSettingsTab === 'access' && (
              <div className="space-y-6 max-w-2xl">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="p-4 rounded-2xl bg-white/5 border border-white/10 space-y-2">
                    <div className="text-[10px] font-bold uppercase text-neutral-400">Session Code</div>
                    <div className="flex items-center justify-between">
                      <span className="font-mono text-2xl font-black text-cyan-400 tracking-widest">
                        {session.sessionCode}
                      </span>
                      <div className="flex items-center gap-1.5">
                        <button
                          type="button"
                          onClick={() => {
                            regenerateSessionCode();
                            setRotatedCode(true);
                            setTimeout(() => setRotatedCode(false), 1500);
                          }}
                          className="px-2.5 py-1.5 rounded-lg bg-white/5 hover:bg-white/10 text-xs font-bold flex items-center gap-1 text-cyan-400 cursor-pointer transition active:scale-95 border border-white/10"
                          title="Generate a brand new unseeded session code"
                        >
                          <RefreshCw className={`w-3.5 h-3.5 ${rotatedCode ? 'animate-spin' : ''}`} />
                          <span>{rotatedCode ? 'Generated!' : 'Rotate'}</span>
                        </button>
                        <button
                          type="button"
                          onClick={handleCopyCode}
                          className="px-3 py-1.5 rounded-lg bg-white/5 hover:bg-white/10 text-xs font-bold flex items-center gap-1 cursor-pointer transition active:scale-95 border border-white/10 text-white"
                        >
                          {copiedCode ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                          <span>{copiedCode ? 'Copied' : 'Copy'}</span>
                        </button>
                      </div>
                    </div>
                    <div className="text-[11px] text-neutral-400">Delegates enter this at zenvitra.xyz to join the live committee room.</div>
                  </div>

                  <div className="p-4 rounded-2xl bg-white/5 border border-white/10 space-y-2">
                    <div className="text-[10px] font-bold uppercase text-neutral-400">Chair 4-Digit Password</div>
                    <input
                      type="text"
                      value={session.chairPassword}
                      onChange={(e) => setSession((prev) => ({ ...prev, chairPassword: e.target.value }))}
                      className="w-full px-3 py-1.5 rounded-lg bg-black/40 border border-white/10 font-mono text-xl font-bold text-white focus:outline-none focus:border-cyan-400"
                    />
                    <div className="text-[11px] text-neutral-400">Other chairs use this to join the dais as Commenters.</div>
                  </div>
                </div>

                <div className="p-5 rounded-2xl bg-white/5 border border-white/10 space-y-3">
                  <h3 className="text-xs font-black uppercase text-cyan-400">Delegate Permissions</h3>
                  <div className="space-y-2.5 text-xs text-white">
                    {[
                      { key: 'allowDelegateGslRequest', label: 'Allow delegates to request GSL floor from their phone' },
                      { key: 'allowDelegateMotion', label: 'Allow delegates to raise motions from their phone' },
                      { key: 'allowDelegateDocs', label: 'Allow delegates to submit working papers and resolutions' },
                      { key: 'allowDelegateDMs', label: 'Allow delegate-to-delegate direct messaging (DMs)' },
                      { key: 'allowPhoneVoting', label: 'Allow live phone voting on draft resolutions' },
                    ].map((perm) => (
                      <label key={perm.key} className="flex items-center gap-2.5 cursor-pointer">
                        <input
                          type="checkbox"
                          checked={Boolean((session.settings as any)[perm.key])}
                          onChange={(e) => updateSetting(perm.key as any, e.target.checked)}
                          className="rounded border-white/20 text-cyan-500 focus:ring-cyan-400 bg-white/5"
                        />
                        <span>{perm.label}</span>
                      </label>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* ══════════════════════════════════════════════════════════
                TAB: MOTIONS
            ══════════════════════════════════════════════════════════ */}
            {activeSettingsTab === 'motions' && (
              <div className="space-y-4 max-w-2xl">
                <p className="text-xs text-neutral-400">
                  Configure which motion types are available during session deliberations and their precedence ordering.
                </p>
                <div className="space-y-2">
                  {[
                    { name: 'Moderated Caucus', desc: 'Debate with fixed speaking slots', enabled: true },
                    { name: 'Unmoderated Caucus', desc: 'Informal lobbying and drafting', enabled: true },
                    { name: 'Tour de Table', desc: 'Every delegation speaks sequentially', enabled: true },
                    { name: 'Consultation of the Whole', desc: 'Informal open dais consultation', enabled: true },
                    { name: 'Custom Motion', desc: 'Any user-defined motion and time slot', enabled: true },
                    { name: 'Suspension of the Meeting', desc: 'Procedural motion to pause the session', enabled: true },
                    { name: 'Closure of Debate', desc: 'End debate and move immediately to voting', enabled: true },
                  ].map((m) => (
                    <div key={m.name} className="p-3.5 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-between">
                      <div>
                        <div className="text-xs font-bold text-white">{m.name}</div>
                        <div className="text-[11px] text-neutral-400">{m.desc}</div>
                      </div>
                      <span className="text-xs font-bold text-emerald-400 bg-emerald-500/20 border border-emerald-500/30 px-2.5 py-0.5 rounded-full">
                        Active
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* ══════════════════════════════════════════════════════════
                TAB: VOTING
            ══════════════════════════════════════════════════════════ */}
            {activeSettingsTab === 'voting' && (
              <div className="space-y-4 max-w-2xl">
                <div className="p-5 rounded-2xl bg-white/5 border border-white/10 space-y-4">
                  <h3 className="text-xs font-black uppercase text-cyan-400">Substantive Majority Rule</h3>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <button
                      type="button"
                      onClick={() => updateSetting('majorityRule', 'simple')}
                      className={`p-3 rounded-xl border text-xs font-bold text-left cursor-pointer transition ${
                        session.settings.majorityRule === 'simple'
                          ? 'bg-cyan-500 text-black border-cyan-400'
                          : 'bg-white/5 text-white border-white/10 hover:bg-white/10'
                      }`}
                    >
                      <div>Simple Majority (1/2 + 1)</div>
                      <div className="text-[10px] opacity-80 pt-0.5">Used for standard procedural and general resolutions.</div>
                    </button>
                    <button
                      type="button"
                      onClick={() => updateSetting('majorityRule', 'two_thirds')}
                      className={`p-3 rounded-xl border text-xs font-bold text-left cursor-pointer transition ${
                        session.settings.majorityRule === 'two_thirds'
                          ? 'bg-cyan-500 text-black border-cyan-400'
                          : 'bg-white/5 text-white border-white/10 hover:bg-white/10'
                      }`}
                    >
                      <div>Two-Thirds Majority (2/3)</div>
                      <div className="text-[10px] opacity-80 pt-0.5">Mandatory for substantive resolutions and treaties.</div>
                    </button>
                  </div>
                </div>

                <div className="p-5 rounded-2xl bg-white/5 border border-white/10 space-y-3">
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="text-xs font-black uppercase text-cyan-400">Permanent 5 (P5) Veto Power</h3>
                      <p className="text-[11px] text-neutral-400">
                        If enabled, a single &ldquo;Against&rdquo; vote from any P5 member fails a substantive draft resolution.
                      </p>
                    </div>
                    <input
                      type="checkbox"
                      checked={session.settings.p5VetoEnabled}
                      onChange={(e) => updateSetting('p5VetoEnabled', e.target.checked)}
                      className="rounded border-white/20 text-cyan-500 focus:ring-cyan-400 bg-white/5 scale-125 cursor-pointer"
                    />
                  </div>
                </div>
              </div>
            )}

            {/* ══════════════════════════════════════════════════════════
                TAB: PEOPLE
            ══════════════════════════════════════════════════════════ */}
            {activeSettingsTab === 'people' && (
              <div className="space-y-4 max-w-2xl">
                <div className="flex items-center justify-between">
                  <h3 className="text-xs font-black uppercase text-cyan-400">
                    Seated Delegations ({session.roster.length})
                  </h3>
                </div>
                <div className="max-h-96 overflow-y-auto space-y-2 pr-1">
                  {session.roster.map((d) => (
                    <div
                      key={d.id}
                      className="p-3 rounded-xl bg-white/5 border border-white/10 flex items-center justify-between text-xs"
                    >
                      <div className="flex items-center gap-2.5">
                        <img
                          src={`https://flagcdn.com/w40/${d.countryCode.toLowerCase()}.png`}
                          alt=""
                          className="w-5 h-5 rounded-full object-cover border border-white/20"
                        />
                        <span className="font-bold text-white">{d.name}</span>
                        <span className="text-[10px] font-mono text-neutral-400">
                          ({d.attendance.replace('_', ' ').toUpperCase()})
                        </span>
                      </div>
                      <button
                        type="button"
                        onClick={() => removeSeat(d.id)}
                        className="px-2.5 py-1 rounded-lg bg-rose-500/20 hover:bg-rose-500/30 text-rose-300 font-bold text-[11px] cursor-pointer transition border border-rose-500/30"
                      >
                        Remove Seat
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            )}

          </div>

          {/* Footer Bar */}
          <footer className="px-6 py-3.5 bg-[#0a0f1d] border-t border-white/10 flex items-center justify-between shrink-0">
            <span className="text-[11px] text-neutral-400">
              ZENVITRA MUN • Dais Ecosystem Rules
            </span>
            <button
              type="button"
              onClick={() => setShowSettingsModal(false)}
              className="px-5 py-2 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-400 hover:from-emerald-400 text-black font-black text-xs cursor-pointer shadow-md transition active:scale-95"
            >
              Done
            </button>
          </footer>
        </main>

      </div>
    </div>
  );
}

export default SettingsModal;
