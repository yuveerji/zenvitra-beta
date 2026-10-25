'use client';

import React, { useState, useEffect, useRef } from 'react';
import {
  Play,
  Pause,
  RotateCcw,
  Gavel,
  Volume2,
  VolumeX,
  Users,
  Vote,
  Sparkles,
  Clock,
  ShieldCheck,
  ChevronRight,
  Hand,
  CheckCircle2,
  XCircle,
  HelpCircle,
  Smartphone,
  Monitor,
  Tv,
  Building2,
  SlidersHorizontal,
  ArrowRight,
  Layers,
  Send,
  FileText,
  AlertTriangle,
  Flame,
  Radio,
  Plus,
  Trash2,
} from 'lucide-react';
import { daisAudio } from '@/lib/daisAudio';
import { DiasBadge } from './DiasBadge';
import { DiasButton } from './DiasButton';

type Perspective = 'chair' | 'delegate' | 'projection' | 'parliament';
type ProceduralMode = 'GSL' | 'MOD' | 'UNMOD' | 'ROLLCALL' | 'VOTING';

interface Speaker {
  id: string;
  country: string;
  flag: string;
  delegateName: string;
  timeRemaining: number;
}

export const DiasInteractiveTourSimulator: React.FC = () => {
  const [perspective, setPerspective] = useState<Perspective>('chair');
  const [mode, setMode] = useState<ProceduralMode>('GSL');
  const [seconds, setSeconds] = useState(90);
  const [totalSeconds, setTotalSeconds] = useState(90);
  const [isRunning, setIsRunning] = useState(false);
  const [soundEnabled, setSoundEnabled] = useState(true);
  const [activeSpeakerIndex, setActiveSpeakerIndex] = useState(0);

  // Roll call states
  const [rollCall, setRollCall] = useState<Record<string, 'present' | 'present_voting' | 'absent'>>({
    US: 'present_voting',
    GB: 'present_voting',
    FR: 'present_voting',
    JP: 'present',
    IN: 'present_voting',
    DE: 'present',
    BR: 'present',
    ZA: 'present',
    CA: 'present',
    AU: 'present',
  });

  // Delegate mobile state
  const [hasRaisedHand, setHasRaisedHand] = useState(false);
  const [delegateVote, setDelegateVote] = useState<'yes' | 'no' | 'abstain' | null>(null);

  // Voting tallies
  const [votes, setVotes] = useState({ yes: 8, no: 2, abstain: 1 });

  // Speakers list
  const [speakers, setSpeakers] = useState<Speaker[]>([
    { id: '1', country: 'Japan', flag: '🇯🇵', delegateName: 'Kenji Sato', timeRemaining: 90 },
    { id: '2', country: 'United States', flag: '🇺🇸', delegateName: 'Sarah Jenkins', timeRemaining: 90 },
    { id: '3', country: 'France', flag: '🇫🇷', delegateName: 'Alexandre Moreau', timeRemaining: 90 },
    { id: '4', country: 'India', flag: '🇮🇳', delegateName: 'Aarav Sharma', timeRemaining: 90 },
    { id: '5', country: 'United Kingdom', flag: '🇬🇧', delegateName: 'Eleanor Vance', timeRemaining: 90 },
  ]);

  // Timer interval
  useEffect(() => {
    let interval: any = null;
    if (isRunning && seconds > 0) {
      interval = setInterval(() => {
        setSeconds((prev) => {
          if (prev === 11) {
            // Warning bell at 10s
            daisAudio.playWarningBell();
          }
          if (prev <= 1) {
            setIsRunning(false);
            daisAudio.playTimeExpired();
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [isRunning, seconds]);

  const handleToggleTimer = () => {
    if (!isRunning && seconds === 0) {
      setSeconds(totalSeconds);
    }
    setIsRunning(!isRunning);
  };

  const handleResetTimer = () => {
    setIsRunning(false);
    setSeconds(totalSeconds);
  };

  const handleStrikeGavel = () => {
    daisAudio.playGavelStrike(1.1);
  };

  const handleModeChange = (newMode: ProceduralMode) => {
    setMode(newMode);
    setIsRunning(false);
    if (newMode === 'GSL') {
      setTotalSeconds(90);
      setSeconds(90);
    } else if (newMode === 'MOD') {
      setTotalSeconds(60);
      setSeconds(60);
    } else if (newMode === 'UNMOD') {
      setTotalSeconds(600);
      setSeconds(600);
    }
    daisAudio.playGavelStrike(0.5);
  };

  // Quorum calculations
  const presentCount = Object.values(rollCall).filter((v) => v === 'present' || v === 'present_voting').length;
  const presentAndVotingCount = Object.values(rollCall).filter((v) => v === 'present_voting').length;
  const simpleMajority = Math.floor(presentCount / 2) + 1;
  const twoThirdsMajority = Math.ceil((presentCount * 2) / 3);

  // Format time mm:ss
  const formatTime = (sec: number) => {
    const m = Math.floor(sec / 60);
    const s = sec % 60;
    return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  };

  const currentSpeaker = speakers[activeSpeakerIndex] || speakers[0];

  const handleNextSpeaker = () => {
    if (activeSpeakerIndex < speakers.length - 1) {
      setActiveSpeakerIndex(activeSpeakerIndex + 1);
      setSeconds(totalSeconds);
      setIsRunning(false);
      daisAudio.playGavelStrike(0.5);
    }
  };

  const handleRaisePlacard = () => {
    if (!hasRaisedHand) {
      setHasRaisedHand(true);
      daisAudio.playGavelStrike(0.5);
      setSpeakers((prev) => [
        ...prev,
        {
          id: Date.now().toString(),
          country: 'Germany',
          flag: '🇩🇪',
          delegateName: 'Hans Weber (You)',
          timeRemaining: 90,
        },
      ]);
    } else {
      setHasRaisedHand(false);
      setSpeakers((prev) => prev.filter((s) => !s.delegateName.includes('(You)')));
    }
  };

  const handleCastDelegateVote = (v: 'yes' | 'no' | 'abstain') => {
    setDelegateVote(v);
    daisAudio.playGavelStrike(0.5);
    setVotes((prev) => ({
      ...prev,
      [v]: prev[v] + 1,
    }));
  };

  return (
    <div className="w-full rounded-3xl bg-[#0B0D12] border border-[#232731] shadow-[0_25px_90px_rgba(0,0,0,0.95)] overflow-hidden text-left font-sans">
      {/* ─── 1. SIMULATOR CONTROLLER TOP BAR ─── */}
      <div className="px-4 sm:px-6 py-4 bg-[#111318] border-b border-[#232731] flex flex-wrap items-center justify-between gap-4">
        {/* Left: Perspective Switcher */}
        <div className="flex items-center gap-1.5 p-1 rounded-2xl bg-[#08090B] border border-[#232731]">
          <button
            type="button"
            onClick={() => setPerspective('chair')}
            className={`px-3 py-1.5 rounded-xl text-xs font-semibold flex items-center gap-2 transition-all cursor-pointer ${
              perspective === 'chair'
                ? 'bg-[#6366F1] text-black font-bold shadow-md'
                : 'text-[#9A9DA5] hover:text-[#F4F2ED]'
            }`}
          >
            <Monitor className="w-3.5 h-3.5" />
            <span>Chair Dais</span>
          </button>

          <button
            type="button"
            onClick={() => setPerspective('delegate')}
            className={`px-3 py-1.5 rounded-xl text-xs font-semibold flex items-center gap-2 transition-all cursor-pointer ${
              perspective === 'delegate'
                ? 'bg-[#6366F1] text-black font-bold shadow-md'
                : 'text-[#9A9DA5] hover:text-[#F4F2ED]'
            }`}
          >
            <Smartphone className="w-3.5 h-3.5" />
            <span>Delegate Mobile</span>
          </button>

          <button
            type="button"
            onClick={() => setPerspective('projection')}
            className={`px-3 py-1.5 rounded-xl text-xs font-semibold flex items-center gap-2 transition-all cursor-pointer ${
              perspective === 'projection'
                ? 'bg-[#6366F1] text-black font-bold shadow-md'
                : 'text-[#9A9DA5] hover:text-[#F4F2ED]'
            }`}
          >
            <Tv className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Auditorium Screen</span>
            <span className="sm:hidden">Screen</span>
          </button>

          <button
            type="button"
            onClick={() => setPerspective('parliament')}
            className={`px-3 py-1.5 rounded-xl text-xs font-semibold flex items-center gap-2 transition-all cursor-pointer ${
              perspective === 'parliament'
                ? 'bg-[#6366F1] text-black font-bold shadow-md'
                : 'text-[#9A9DA5] hover:text-[#F4F2ED]'
            }`}
          >
            <Building2 className="w-3.5 h-3.5" />
            <span className="hidden md:inline">Lok Sabha Engine</span>
            <span className="md:hidden">LS</span>
          </button>
        </div>

        {/* Right: Sound & Action Tools */}
        <div className="flex items-center gap-2 sm:gap-3">
          <button
            type="button"
            onClick={() => {
              const next = daisAudio.toggle();
              setSoundEnabled(next);
            }}
            className={`p-2 rounded-xl border text-xs flex items-center gap-1.5 transition-colors cursor-pointer ${
              soundEnabled
                ? 'bg-[#181B21] border-[#6366F1]/40 text-[#6366F1]'
                : 'bg-[#08090B] border-[#232731] text-[#575B66]'
            }`}
            title={soundEnabled ? 'Acoustic Sound Active' : 'Sound Muted'}
          >
            {soundEnabled ? <Volume2 className="w-4 h-4" /> : <VolumeX className="w-4 h-4" />}
            <span className="text-[11px] font-mono hidden md:inline">
              {soundEnabled ? 'Audio Synthesizer' : 'Muted'}
            </span>
          </button>

          {/* Test Strike Gavel */}
          <DiasButton
            variant="indigo"
            size="sm"
            onClick={handleStrikeGavel}
            leftIcon={<Gavel className="w-3.5 h-3.5" />}
          >
            Strike Gavel
          </DiasButton>
        </div>
      </div>

      {/* ─── 2. MAIN SIMULATOR VIEWPORT ─── */}
      <div className="p-4 sm:p-6 lg:p-8">
        {/* PERSPECTIVE 1: CHAIR DAIS COCKPIT */}
        {perspective === 'chair' && (
          <div className="space-y-6">
            {/* Procedure Mode Bar */}
            <div className="flex flex-wrap items-center justify-between gap-3 pb-4 border-b border-[#181B21]">
              <div className="flex flex-wrap items-center gap-2">
                <span className="text-xs font-mono text-[#9A9DA5] uppercase tracking-wider mr-2">
                  Chamber Mode:
                </span>
                {(['GSL', 'MOD', 'UNMOD', 'ROLLCALL', 'VOTING'] as ProceduralMode[]).map((m) => (
                  <button
                    key={m}
                    type="button"
                    onClick={() => handleModeChange(m)}
                    className={`px-3 py-1.5 rounded-xl text-xs font-mono font-bold transition-all cursor-pointer ${
                      mode === m
                        ? 'bg-[#6366F1] text-black shadow-sm'
                        : 'bg-[#181B21] text-[#9A9DA5] hover:text-[#F4F2ED] hover:bg-[#20242C]'
                    }`}
                  >
                    {m === 'GSL'
                      ? 'General Speakers (GSL)'
                      : m === 'MOD'
                      ? 'Moderated Caucus'
                      : m === 'UNMOD'
                      ? 'Unmoderated'
                      : m === 'ROLLCALL'
                      ? 'Roll Call'
                      : 'Division & Voting'}
                  </button>
                ))}
              </div>

              {/* Quorum Badge */}
              <div className="flex items-center gap-2 text-xs font-mono">
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                <span className="text-[#9A9DA5]">
                  Quorum: <strong className="text-[#F4F2ED]">{presentCount}/10</strong> (Maj: {simpleMajority})
                </span>
              </div>
            </div>

            {/* Dais Main Stage Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
              {/* Center Main Stage (Col 8) */}
              <div className="lg:col-span-8 space-y-6">
                {/* Active Speaker / Active Mode Card */}
                {mode === 'ROLLCALL' ? (
                  <div className="p-6 rounded-3xl bg-[#111318] border border-[#232731] space-y-6">
                    <div className="flex items-center justify-between">
                      <div className="space-y-1">
                        <span className="text-[10px] font-mono text-[#6366F1] uppercase tracking-widest font-bold">
                          PROCEDURAL QUORUM DETERMINATION
                        </span>
                        <h3 className="text-xl font-bold text-white">Chamber Roll Call Ledger</h3>
                      </div>
                      <div className="text-right text-xs font-mono text-[#9A9DA5]">
                        Threshold 2/3: <strong className="text-[#6366F1]">{twoThirdsMajority} votes</strong>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                      {Object.entries(rollCall).map(([code, status]) => (
                        <div
                          key={code}
                          className="p-3 rounded-2xl bg-[#08090B] border border-[#232731] flex items-center justify-between"
                        >
                          <div className="flex items-center gap-2">
                            <span className="text-lg">
                              {code === 'US'
                                ? '🇺🇸'
                                : code === 'GB'
                                ? '🇬🇧'
                                : code === 'FR'
                                ? '🇫🇷'
                                : code === 'JP'
                                ? '🇯🇵'
                                : code === 'IN'
                                ? '🇮🇳'
                                : code === 'DE'
                                ? '🇩🇪'
                                : code === 'BR'
                                ? '🇧🇷'
                                : code === 'ZA'
                                ? '🇿🇦'
                                : code === 'CA'
                                ? '🇨🇦'
                                : '🇦🇺'}
                            </span>
                            <span className="text-xs font-semibold text-white">{code}</span>
                          </div>

                          <div className="flex items-center gap-1 text-[11px] font-mono">
                            <button
                              type="button"
                              onClick={() => {
                                setRollCall((prev) => ({ ...prev, [code]: 'present' }));
                                daisAudio.playGavelStrike(0.5);
                              }}
                              className={`px-2 py-1 rounded-lg transition cursor-pointer ${
                                status === 'present'
                                  ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 font-bold'
                                  : 'text-[#575B66] hover:text-[#9A9DA5]'
                              }`}
                            >
                              Present
                            </button>
                            <button
                              type="button"
                              onClick={() => {
                                setRollCall((prev) => ({ ...prev, [code]: 'present_voting' }));
                                daisAudio.playGavelStrike(0.5);
                              }}
                              className={`px-2 py-1 rounded-lg transition cursor-pointer ${
                                status === 'present_voting'
                                  ? 'bg-amber-500/20 text-amber-300 border border-amber-500/40 font-bold'
                                  : 'text-[#575B66] hover:text-[#9A9DA5]'
                              }`}
                            >
                              P &amp; V
                            </button>
                            <button
                              type="button"
                              onClick={() => {
                                setRollCall((prev) => ({ ...prev, [code]: 'absent' }));
                                daisAudio.playGavelStrike(0.5);
                              }}
                              className={`px-2 py-1 rounded-lg transition cursor-pointer ${
                                status === 'absent'
                                  ? 'bg-red-500/20 text-red-300 border border-red-500/40 font-bold'
                                  : 'text-[#575B66] hover:text-[#9A9DA5]'
                              }`}
                            >
                              Absent
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                ) : mode === 'VOTING' ? (
                  <div className="p-6 rounded-3xl bg-[#111318] border border-[#232731] space-y-6">
                    <div className="flex items-center justify-between pb-3 border-b border-[#232731]">
                      <div>
                        <span className="text-[10px] font-mono text-[#6366F1] uppercase tracking-widest font-bold">
                          SUBSTANTIVE DIVISION ON DRAFT RESOLUTION 1.1
                        </span>
                        <h3 className="text-xl font-bold text-white mt-1">
                          Draft Resolution on Maritime Security &amp; Non-Proliferation
                        </h3>
                      </div>
                      <DiasBadge variant="indigo" size="sm">
                        2/3 Supermajority Required
                      </DiasBadge>
                    </div>

                    {/* Voting Progress Tally */}
                    <div className="space-y-3">
                      <div className="flex items-center justify-between text-xs font-mono">
                        <span className="text-emerald-400 font-bold">IN FAVOR: {votes.yes}</span>
                        <span className="text-red-400 font-bold">AGAINST: {votes.no}</span>
                        <span className="text-amber-400 font-bold">ABSTAIN: {votes.abstain}</span>
                      </div>

                      <div className="h-4 w-full rounded-full bg-[#08090B] border border-[#232731] overflow-hidden flex">
                        <div
                          className="bg-emerald-500 transition-all duration-500"
                          style={{
                            width: `${(votes.yes / (votes.yes + votes.no + votes.abstain || 1)) * 100}%`,
                          }}
                        />
                        <div
                          className="bg-red-500 transition-all duration-500"
                          style={{
                            width: `${(votes.no / (votes.yes + votes.no + votes.abstain || 1)) * 100}%`,
                          }}
                        />
                        <div
                          className="bg-amber-500 transition-all duration-500"
                          style={{
                            width: `${(votes.abstain / (votes.yes + votes.no + votes.abstain || 1)) * 100}%`,
                          }}
                        />
                      </div>

                      <div className="p-4 rounded-2xl bg-[#08090B] border border-[#232731] flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <CheckCircle2 className="w-5 h-5 text-emerald-400" />
                          <span className="text-sm font-semibold text-white">
                            Status: Resolution Passes with {Math.round((votes.yes / (votes.yes + votes.no || 1)) * 100)}% Majority
                          </span>
                        </div>
                        <DiasButton
                          variant="indigo"
                          size="sm"
                          onClick={() => {
                            daisAudio.playTripleGavel();
                          }}
                        >
                          Adopt Resolution [3 Gavel]
                        </DiasButton>
                      </div>
                    </div>
                  </div>
                ) : (
                  /* Standard Speaker / Timer Console */
                  <div className="p-6 sm:p-8 rounded-3xl bg-[#111318] border border-[#232731] relative overflow-hidden space-y-6">
                    {/* Active Speaker Identity */}
                    <div className="flex flex-wrap items-center justify-between gap-4">
                      <div className="flex items-center gap-4">
                        <div className="text-4xl sm:text-5xl">{currentSpeaker.flag}</div>
                        <div>
                          <div className="flex items-center gap-2">
                            <span className="text-[10px] font-mono text-[#6366F1] uppercase tracking-widest font-bold">
                              NOW ON THE FLOOR
                            </span>
                            <span className="px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400 text-[10px] font-mono font-bold">
                              LIVE
                            </span>
                          </div>
                          <h3 className="text-2xl sm:text-3xl font-bold text-white tracking-tight">
                            {currentSpeaker.country}
                          </h3>
                          <p className="text-xs text-[#9A9DA5] font-mono">{currentSpeaker.delegateName}</p>
                        </div>
                      </div>

                      {/* Next Speaker CTA */}
                      <DiasButton variant="charcoal" size="sm" onClick={handleNextSpeaker}>
                        Yield Floor / Next &rarr;
                      </DiasButton>
                    </div>

                    {/* Giant Digital Countdown Clock */}
                    <div className="flex flex-col sm:flex-row items-center justify-between gap-6 p-6 rounded-2xl bg-[#08090B] border border-[#232731]">
                      <div className="flex items-baseline gap-2">
                        <span
                          className={`text-6xl sm:text-7xl font-mono font-black tracking-tight ${
                            seconds <= 10 ? 'text-red-400 animate-pulse' : 'text-[#C7D2FE]'
                          }`}
                        >
                          {formatTime(seconds)}
                        </span>
                        <span className="text-xs font-mono text-[#575B66] uppercase">
                          / {formatTime(totalSeconds)}
                        </span>
                      </div>

                      {/* Clock Action Buttons */}
                      <div className="flex items-center gap-2">
                        <button
                          type="button"
                          onClick={handleToggleTimer}
                          className={`h-12 px-5 rounded-2xl font-bold text-xs uppercase font-mono tracking-wider flex items-center gap-2 transition-all cursor-pointer ${
                            isRunning
                              ? 'bg-amber-400 text-black shadow-[0_0_20px_rgba(251,191,36,0.3)]'
                              : 'bg-[#6366F1] text-black shadow-[0_0_20px_rgba(99,102,241,0.3)]'
                          }`}
                        >
                          {isRunning ? <Pause className="w-4 h-4 fill-black" /> : <Play className="w-4 h-4 fill-black" />}
                          <span>{isRunning ? 'Pause' : 'Start Timer'}</span>
                        </button>

                        <button
                          type="button"
                          onClick={handleResetTimer}
                          className="h-12 w-12 rounded-2xl bg-[#181B21] hover:bg-[#20242C] border border-[#232731] text-[#9A9DA5] hover:text-white flex items-center justify-center transition-colors cursor-pointer"
                          title="Reset Timer"
                        >
                          <RotateCcw className="w-4 h-4" />
                        </button>
                      </div>
                    </div>

                    {/* Active Topic Banner */}
                    <div className="p-3.5 rounded-2xl bg-[#08090B]/60 border border-[#181B21] flex items-center justify-between text-xs">
                      <div className="flex items-center gap-2">
                        <SlidersHorizontal className="w-4 h-4 text-[#6366F1]" />
                        <span className="text-[#9A9DA5]">Agenda Topic:</span>
                        <span className="text-white font-medium">
                          Indo-Pacific Strategic Shipping &amp; Open Maritime Corridors
                        </span>
                      </div>
                      <span className="text-[10px] font-mono text-[#6366F1] font-bold">UNSC #1024</span>
                    </div>
                  </div>
                )}
              </div>

              {/* Right Sidebar: Speakers Queue & Raised Hands (Col 4) */}
              <div className="lg:col-span-4 space-y-4">
                <div className="p-5 rounded-3xl bg-[#111318] border border-[#232731] space-y-4">
                  <div className="flex items-center justify-between pb-3 border-b border-[#232731]">
                    <div className="flex items-center gap-2">
                      <Users className="w-4 h-4 text-[#6366F1]" />
                      <span className="text-xs font-bold text-white uppercase tracking-wider">
                        Speaking Order ({speakers.length})
                      </span>
                    </div>
                    <span className="text-[10px] font-mono text-[#6366F1]">Live Sync</span>
                  </div>

                  <div className="space-y-2">
                    {speakers.map((s, idx) => (
                      <div
                        key={s.id}
                        className={`p-3 rounded-2xl border transition flex items-center justify-between text-xs ${
                          idx === activeSpeakerIndex
                            ? 'bg-[#181B21] border-[#6366F1]/60 shadow-[0_0_15px_rgba(99,102,241,0.15)]'
                            : 'bg-[#08090B] border-[#232731] text-[#9A9DA5]'
                        }`}
                      >
                        <div className="flex items-center gap-2.5">
                          <span className="text-base">{s.flag}</span>
                          <div>
                            <div className="font-semibold text-white">
                              #{idx + 1} {s.country}
                            </div>
                            <div className="text-[10px] text-[#575B66] font-mono">{s.delegateName}</div>
                          </div>
                        </div>

                        {idx === activeSpeakerIndex ? (
                          <span className="px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-400 text-[10px] font-mono font-bold">
                            FLOOR
                          </span>
                        ) : (
                          <span className="text-[10px] font-mono text-[#575B66]">01:30</span>
                        )}
                      </div>
                    ))}
                  </div>

                  {/* Add Demo Speaker */}
                  <button
                    type="button"
                    onClick={() => {
                      const newCountry = {
                        id: Date.now().toString(),
                        country: 'Canada',
                        flag: '🇨🇦',
                        delegateName: 'Liam O’Connor',
                        timeRemaining: 90,
                      };
                      setSpeakers((prev) => [...prev, newCountry]);
                      daisAudio.playGavelStrike(0.5);
                    }}
                    className="w-full py-2.5 rounded-xl border border-dashed border-[#232731] hover:border-[#6366F1]/40 text-xs text-[#9A9DA5] hover:text-[#6366F1] transition flex items-center justify-center gap-1.5 cursor-pointer"
                  >
                    <Plus className="w-3.5 h-3.5" />
                    <span>Quick Add Delegate to Queue</span>
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* PERSPECTIVE 2: DELEGATE MOBILE TERMINAL */}
        {perspective === 'delegate' && (
          <div className="flex flex-col items-center justify-center py-6">
            <div className="text-center space-y-2 mb-6">
              <span className="text-[10px] font-mono text-[#6366F1] uppercase tracking-widest font-bold">
                NO APP DOWNLOAD REQUIRED &bull; 3-SECOND ZERO-FRICTION JOIN
              </span>
              <h3 className="text-2xl font-bold text-white">The Delegate Floor Experience</h3>
              <p className="text-xs text-[#9A9DA5] max-w-md mx-auto">
                Delegates simply scan the podium QR code on their smartphone to follow debate, raise placards, propose caucuses, and vote.
              </p>
            </div>

            {/* Simulated Smartphone Bezel */}
            <div className="w-[320px] sm:w-[360px] rounded-[3rem] bg-[#000000] border-[6px] border-[#2A2E39] p-4 shadow-[0_30px_90px_rgba(0,0,0,0.98)] space-y-4 relative">
              {/* Phone Dynamic Island */}
              <div className="w-24 h-4 bg-[#111318] rounded-full mx-auto" />

              {/* Delegate Header */}
              <div className="flex items-center justify-between pb-3 border-b border-[#232731]">
                <div className="flex items-center gap-2">
                  <span className="text-xl">🇩🇪</span>
                  <div className="text-left">
                    <div className="text-xs font-bold text-white">DELEGATE OF GERMANY</div>
                    <div className="text-[10px] text-emerald-400 font-mono">Present &amp; Voting</div>
                  </div>
                </div>
                <div className="px-2 py-0.5 rounded-full bg-[#181B21] border border-[#6366F1]/30 text-[#C7D2FE] text-[10px] font-mono font-bold">
                  UNSC 1024
                </div>
              </div>

              {/* Current Speaker Display */}
              <div className="p-4 rounded-2xl bg-[#111318] border border-[#232731] text-center space-y-2">
                <span className="text-[10px] font-mono text-[#6366F1] uppercase">CURRENT SPEAKER</span>
                <div className="text-2xl font-bold text-white flex items-center justify-center gap-2">
                  <span>{currentSpeaker.flag}</span>
                  <span>{currentSpeaker.country}</span>
                </div>
                <div className="text-3xl font-mono font-bold text-[#C7D2FE]">{formatTime(seconds)}</div>
                <p className="text-[10px] text-[#9A9DA5]">Your Speaking Position: #{speakers.length} in queue</p>
              </div>

              {/* Quick Actions (Raise Placard & Motion) */}
              <div className="space-y-2">
                <button
                  type="button"
                  onClick={handleRaisePlacard}
                  className={`w-full py-3 rounded-2xl font-bold text-xs uppercase tracking-wider flex items-center justify-center gap-2 transition cursor-pointer ${
                    hasRaisedHand
                      ? 'bg-amber-400 text-black shadow-[0_0_20px_rgba(251,191,36,0.3)]'
                      : 'bg-[#181B21] hover:bg-[#20242C] border border-[#232731] text-white'
                  }`}
                >
                  <Hand className="w-4 h-4" />
                  <span>{hasRaisedHand ? 'Placard Raised (In Queue)' : 'Raise Placard to Speak'}</span>
                </button>

                {/* Substantive Voting Widget on Phone */}
                <div className="p-3.5 rounded-2xl bg-[#111318] border border-[#232731] space-y-2">
                  <div className="text-[10px] font-mono text-[#9A9DA5] uppercase">ACTIVE DIVISION: DRAFT RES 1.1</div>
                  <div className="grid grid-cols-3 gap-1.5">
                    <button
                      type="button"
                      onClick={() => handleCastDelegateVote('yes')}
                      className={`py-2 rounded-xl text-xs font-mono font-bold transition cursor-pointer ${
                        delegateVote === 'yes'
                          ? 'bg-emerald-500 text-black'
                          : 'bg-[#08090B] text-emerald-400 border border-emerald-500/30'
                      }`}
                    >
                      Yes
                    </button>
                    <button
                      type="button"
                      onClick={() => handleCastDelegateVote('no')}
                      className={`py-2 rounded-xl text-xs font-mono font-bold transition cursor-pointer ${
                        delegateVote === 'no'
                          ? 'bg-red-500 text-black'
                          : 'bg-[#08090B] text-red-400 border border-red-500/30'
                      }`}
                    >
                      No
                    </button>
                    <button
                      type="button"
                      onClick={() => handleCastDelegateVote('abstain')}
                      className={`py-2 rounded-xl text-xs font-mono font-bold transition cursor-pointer ${
                        delegateVote === 'abstain'
                          ? 'bg-amber-500 text-black'
                          : 'bg-[#08090B] text-amber-400 border border-amber-500/30'
                      }`}
                    >
                      Abstain
                    </button>
                  </div>
                  {delegateVote && (
                    <div className="text-[10px] font-mono text-emerald-400 text-center">
                      ✓ Your vote ({delegateVote.toUpperCase()}) recorded into Dais ledger
                    </div>
                  )}
                </div>
              </div>

              {/* Bottom Home Indicator */}
              <div className="w-32 h-1 bg-white/20 rounded-full mx-auto mt-2" />
            </div>
          </div>
        )}

        {/* PERSPECTIVE 3: AUDITORIUM STAGE PROJECTION */}
        {perspective === 'projection' && (
          <div className="space-y-6">
            <div className="text-center space-y-1 pb-4 border-b border-[#181B21]">
              <span className="text-[10px] font-mono text-[#6366F1] uppercase tracking-widest font-bold">
                HIGH-CONTRAST DUAL-SCREEN AUDITORIUM PROJECTION
              </span>
              <h3 className="text-xl font-bold text-white">Chamber Podium Projector Display</h3>
              <p className="text-xs text-[#9A9DA5]">
                Designed for large wall screens and projectors. Distraction-free, visible from 50 meters away.
              </p>
            </div>

            <div className="p-8 sm:p-12 rounded-3xl bg-[#030406] border-2 border-[#6366F1]/30 shadow-[0_0_50px_rgba(99,102,241,0.15)] text-center space-y-8">
              {/* Chamber Crest & Header */}
              <div className="flex items-center justify-between border-b border-white/10 pb-4">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-[#181B21] border border-[#6366F1]/50 flex items-center justify-center text-[#6366F1]">
                    <Gavel className="w-5 h-5" />
                  </div>
                  <div className="text-left">
                    <h4 className="text-sm font-bold text-white font-mono tracking-widest uppercase">
                      UNITED NATIONS SECURITY COUNCIL
                    </h4>
                    <span className="text-xs text-[#9A9DA5]">Agenda: Maritime Corridors &amp; Indo-Pacific Sovereignty</span>
                  </div>
                </div>

                <div className="px-3 py-1 rounded-full bg-[#181B21] text-[#C7D2FE] text-xs font-mono font-bold border border-[#6366F1]/40">
                  CODE: UNSC-1024
                </div>
              </div>

              {/* Giant Podium Stage Display */}
              <div className="space-y-4">
                <span className="text-sm font-mono text-[#6366F1] tracking-widest uppercase font-bold">
                  FLOOR RECOGNITION
                </span>
                <div className="text-5xl sm:text-7xl font-serif text-white tracking-tight flex items-center justify-center gap-4">
                  <span>{currentSpeaker.flag}</span>
                  <span>{currentSpeaker.country}</span>
                </div>
                <div className="text-8xl sm:text-9xl font-mono font-black text-[#C7D2FE] tracking-tight">
                  {formatTime(seconds)}
                </div>
              </div>

              {/* Next in Order Pill Bar */}
              <div className="flex flex-wrap items-center justify-center gap-2 pt-6 border-t border-white/10 text-xs font-mono">
                <span className="text-[#9A9DA5] mr-2">UPCOMING ORDER:</span>
                {speakers.slice(1, 5).map((s, idx) => (
                  <span
                    key={s.id}
                    className="px-3 py-1 rounded-xl bg-[#111318] border border-[#232731] text-white flex items-center gap-1.5"
                  >
                    <span>{s.flag}</span>
                    <span>#{idx + 2} {s.country}</span>
                  </span>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* PERSPECTIVE 4: LOK SABHA PARLIAMENTARY ENGINE */}
        {perspective === 'parliament' && (
          <div className="space-y-6">
            <div className="text-center space-y-1 pb-4 border-b border-[#181B21]">
              <span className="text-[10px] font-mono text-[#6366F1] uppercase tracking-widest font-bold">
                SOVEREIGN PARLIAMENTARY LEGISLATIVE SUITE
              </span>
              <h3 className="text-xl font-bold text-white">Lok Sabha &amp; AIPPM Parliamentary Mode</h3>
              <p className="text-xs text-[#9A9DA5]">
                Tailored for Indian Parliamentary committees, Lok Sabha, Rajya Sabha, and AIPPM with Question Hour, Zero Hour, and Clause-by-Clause Bill Amendments.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Question & Zero Hour Tracker */}
              <div className="p-6 rounded-3xl bg-[#111318] border border-[#232731] space-y-4">
                <div className="flex items-center gap-2 text-xs font-bold text-amber-300 font-mono uppercase">
                  <Clock className="w-4 h-4 text-amber-400" />
                  <span>PARLIAMENTARY TIMINGS &amp; ORDERS</span>
                </div>

                <div className="space-y-3">
                  <div className="p-3.5 rounded-2xl bg-[#08090B] border border-[#232731] flex items-center justify-between">
                    <div>
                      <div className="text-xs font-bold text-white">Question Hour (Starred &amp; Unstarred)</div>
                      <div className="text-[10px] text-[#9A9DA5]">Ministerial oral answers with supplementary inquiries</div>
                    </div>
                    <span className="px-2.5 py-1 rounded-lg bg-emerald-500/20 text-emerald-400 font-mono text-xs font-bold">
                      ACTIVE
                    </span>
                  </div>

                  <div className="p-3.5 rounded-2xl bg-[#08090B] border border-[#232731] flex items-center justify-between">
                    <div>
                      <div className="text-xs font-bold text-white">Zero Hour Urgent Submissions</div>
                      <div className="text-[10px] text-[#9A9DA5]">Issues of urgent public importance without notice</div>
                    </div>
                    <span className="px-2.5 py-1 rounded-lg bg-[#181B21] text-[#9A9DA5] font-mono text-xs">
                      SCHEDULED
                    </span>
                  </div>
                </div>
              </div>

              {/* Clause by Clause Division */}
              <div className="p-6 rounded-3xl bg-[#111318] border border-[#232731] space-y-4">
                <div className="flex items-center gap-2 text-xs font-bold text-[#6366F1] font-mono uppercase">
                  <Building2 className="w-4 h-4 text-[#6366F1]" />
                  <span>LEGISLATIVE BILL DIVISION (AYES / NOES)</span>
                </div>

                <div className="p-4 rounded-2xl bg-[#08090B] border border-[#232731] space-y-3">
                  <div className="text-xs font-bold text-white">
                    The Maritime Border Protection &amp; Coastal Surveillance Bill, 2026
                  </div>
                  <div className="text-[11px] text-[#9A9DA5] leading-relaxed">
                    Clause 4(2): Compulsory radar telemetry allocation for all vessels within 200 nautical miles of EEZ.
                  </div>

                  <div className="pt-2 flex items-center justify-between">
                    <span className="text-xs font-mono text-emerald-400 font-bold">AYES: 284</span>
                    <span className="text-xs font-mono text-red-400 font-bold">NOES: 112</span>
                    <DiasButton
                      variant="indigo"
                      size="sm"
                      onClick={() => {
                        daisAudio.playGavelStrike(1.0);
                      }}
                    >
                      Adopt Clause
                    </DiasButton>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* ─── 3. SIMULATOR FOOTER CTA BAR ─── */}
      <div className="p-4 sm:p-5 bg-[#08090B] border-t border-[#232731] flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center gap-2 text-xs text-[#9A9DA5]">
          <span className="w-2 h-2 rounded-full bg-emerald-400" />
          <span>Interactive Tour Sandbox &bull; Realtime Procedural Rules Simulated</span>
        </div>

        <div className="flex items-center gap-3">
          <a
            href="/dias?create=true"
            className="px-4 py-2 rounded-xl bg-[#6366F1] hover:bg-[#818CF8] text-black text-xs font-mono font-bold transition flex items-center gap-1.5 shadow-sm"
          >
            <span>Launch Live Chamber</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </a>
        </div>
      </div>
    </div>
  );
};
