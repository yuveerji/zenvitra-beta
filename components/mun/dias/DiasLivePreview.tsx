'use client';

import React, { useState, useEffect } from 'react';
import { Play, Pause, RotateCcw, Gavel, Volume2, Users, FileText, Vote, Sparkles, Clock, ShieldCheck, ChevronRight } from 'lucide-react';
import { daisAudio } from '@/lib/daisAudio';
import { DiasBadge } from './DiasBadge';

export const DiasLivePreview: React.FC = () => {
  const [seconds, setSeconds] = useState(72);
  const [isRunning, setIsRunning] = useState(false);
  const [activeTab, setActiveTab] = useState<'gsl' | 'mod' | 'parliament'>('gsl');

  // Strict Portfolio State Separation
  const isParliamentary = activeTab === 'parliament';

  const internationalSpeakers = {
    gsl: {
      name: 'Hon. Delegate of Japan',
      seat: 'JAPAN',
      flag: '🇯🇵',
      topic: 'Sustainable Maritime Navigation & Indo-Pacific Security',
      header: 'SESSION LIVE • UN SECURITY COUNCIL / UNGA-01',
      quorum: 'Quorum Confirmed: 15 Member States Present • 5 Permanent Members (P5)',
      queue: [
        { code: 'US', flag: '🇺🇸', name: 'United States of America', role: 'Permanent Member (P5) • #2', time: '01:30' },
        { code: 'GB', flag: '🇬🇧', name: 'United Kingdom', role: 'Permanent Member (P5) • #3', time: '01:30' },
        { code: 'IN', flag: '🇮🇳', name: 'Republic of India', role: 'Elected Member • #4', time: '01:30' },
        { code: 'DE', flag: '🇩🇪', name: 'Federal Republic of Germany', role: 'Observer Delegation • #5', time: '01:30' },
      ],
      pendingMotion: {
        title: 'Motion for Moderated Caucus on Indo-Pacific Corridors',
        meta: 'Proposed by Hon. Delegate of France • Seconded by United States',
        badge: 'Procedural',
      },
    },
    mod: {
      name: 'Hon. Representative of France',
      seat: 'FRANCE',
      flag: '🇫🇷',
      topic: 'Moderated Caucus: AI Governance & Nuclear Command Safeguards',
      header: 'SESSION LIVE • UN HUMAN RIGHTS COUNCIL / UNHRC',
      quorum: 'Quorum Confirmed: 47 Member States Present • Simple Majority 24',
      queue: [
        { code: 'CA', flag: '🇨🇦', name: 'Canada', role: 'Member State • #2', time: '01:00' },
        { code: 'BR', flag: '🇧🇷', name: 'Federative Republic of Brazil', role: 'Member State • #3', time: '01:00' },
        { code: 'ZA', flag: '🇿🇦', name: 'Republic of South Africa', role: 'Member State • #4', time: '01:00' },
        { code: 'AU', flag: '🇦🇺', name: 'Commonwealth of Australia', role: 'Member State • #5', time: '01:00' },
      ],
      pendingMotion: {
        title: 'Motion for 10-Minute Unmoderated Caucus on Draft Resolution 1.1',
        meta: 'Proposed by Hon. Representative of Germany • Seconded by Brazil',
        badge: 'Caucus Motion',
      },
    },
  };

  const parliamentaryState = {
    name: 'Hon. Member for Varanasi (Prime Minister / Leader of the House)',
    seat: 'VARANASI',
    flag: '🇮🇳',
    topic: 'Delimitation of Constituencies, Federal Autonomy & Electoral Representation',
    header: 'SESSION LIVE • LOK SABHA (HOUSE OF THE PEOPLE)',
    quorum: 'Quorum Confirmed: 543 Members • 272 Required for Simple Majority',
    queue: [
      { code: 'OP', flag: '🇮🇳', name: 'Opposition Bench', role: 'Leader of Opposition • #2', time: '01:30' },
      { code: 'UP', flag: '🇮🇳', name: 'Hon. Member for Wayanad', role: 'Kerala • #3', time: '01:30' },
      { code: 'MH', flag: '🇮🇳', name: 'Hon. Member for Baramati', role: 'Maharashtra • #4', time: '01:30' },
      { code: 'GJ', flag: '🇮🇳', name: 'Hon. Member for Gandhinagar (Home Minister)', role: 'Gujarat • #5', time: '01:30' },
    ],
    pendingMotion: {
      title: 'Division Vote on Clause 4 (Electoral Reforms Bill, 2026)',
      meta: 'Proposed by Opposition Bench • Supported by Member for Baramati',
      badge: 'Recorded Division',
    },
  };

  const currentState = isParliamentary
    ? parliamentaryState
    : activeTab === 'gsl'
    ? internationalSpeakers.gsl
    : internationalSpeakers.mod;

  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (isRunning && seconds > 0) {
      interval = setInterval(() => {
        setSeconds((s) => {
          if (s <= 1) {
            daisAudio.playTimeExpired();
            setIsRunning(false);
            return 0;
          }
          if (s === 11) {
            daisAudio.playWarningBell();
          }
          return s - 1;
        });
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [isRunning, seconds]);

  const toggleTimer = () => {
    if (!isRunning && seconds === 0) {
      setSeconds(90);
    }
    setIsRunning(!isRunning);
  };

  const resetTimer = () => {
    setIsRunning(false);
    setSeconds(90);
  };

  const handleGavel = () => {
    daisAudio.playGavelStrike(1.0);
  };

  const formatTime = (total: number) => {
    const mins = Math.floor(total / 60);
    const secs = total % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <div className="w-full bg-[#08090B] border border-[#232731] rounded-3xl p-4 sm:p-7 shadow-[0_25px_80px_rgba(0,0,0,0.6)] relative overflow-hidden select-none">
      {/* Subtle background glow */}
      <div className="absolute top-0 right-1/4 w-96 h-96 bg-[#6366F1]/5 rounded-full blur-3xl pointer-events-none" />

      {/* Header bar of preview */}
      <div className="flex flex-wrap items-center justify-between gap-3 pb-5 border-b border-[#181B21]">
        <div className="flex items-center gap-3">
          <div className="w-2.5 h-2.5 rounded-full bg-[#22C55E] animate-pulse" />
          <div className="flex flex-col text-left">
            <span className="text-xs font-bold tracking-wider text-[#F4F2ED] uppercase font-mono">
              {currentState.header}
            </span>
            <span className="text-[11px] text-[#9A9DA5]">
              {currentState.quorum}
            </span>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <DiasBadge variant={isParliamentary ? 'charcoal' : 'indigo'} size="sm" dot>
            {isParliamentary ? 'PARLIAMENTARY CODEX' : 'INTERNATIONAL UN CODEX'}
          </DiasBadge>
          <button
            onClick={() => daisAudio.toggle()}
            title="Toggle Procedural Audio"
            className="p-1.5 rounded-lg bg-[#181B21] border border-[#2A2E39] text-[#6366F1] hover:bg-[#20242C] transition-colors cursor-pointer"
          >
            <Volume2 className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* Mode Selector pills with Clear Separation */}
      <div className="flex items-center gap-2 pt-4 pb-4 overflow-x-auto text-xs no-scrollbar">
        <button
          onClick={() => {
            setActiveTab('gsl');
            setSeconds(90);
            setIsRunning(false);
          }}
          className={`px-3.5 py-1.5 rounded-xl font-medium transition-all flex items-center gap-1.5 cursor-pointer ${
            activeTab === 'gsl'
              ? 'bg-[#6366F1] text-[#08090B] font-bold shadow-sm'
              : 'bg-[#111318] text-[#9A9DA5] hover:text-[#F4F2ED] border border-[#232731]'
          }`}
        >
          <span>🌐</span>
          <span>General Speakers' List (UN)</span>
        </button>

        <button
          onClick={() => {
            setActiveTab('mod');
            setSeconds(60);
            setIsRunning(false);
          }}
          className={`px-3.5 py-1.5 rounded-xl font-medium transition-all flex items-center gap-1.5 cursor-pointer ${
            activeTab === 'mod'
              ? 'bg-[#6366F1] text-[#08090B] font-bold shadow-sm'
              : 'bg-[#111318] text-[#9A9DA5] hover:text-[#F4F2ED] border border-[#232731]'
          }`}
        >
          <span>⚡</span>
          <span>Moderated Caucus (UN)</span>
        </button>

        <button
          onClick={() => {
            setActiveTab('parliament');
            setSeconds(90);
            setIsRunning(false);
          }}
          className={`px-3.5 py-1.5 rounded-xl font-medium transition-all flex items-center gap-1.5 cursor-pointer ${
            activeTab === 'parliament'
              ? 'bg-[#6366F1] text-[#08090B] font-bold shadow-sm'
              : 'bg-[#111318] text-[#9A9DA5] hover:text-[#F4F2ED] border border-[#232731]'
          }`}
        >
          <span>🇮🇳</span>
          <span>Parliamentary Debate (Lok Sabha)</span>
        </button>
      </div>

      {/* Main Preview Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 pt-1">
        {/* Left Column: Active Speaker Stage & Timer */}
        <div className="lg:col-span-8 bg-[#111318] border border-[#232731] rounded-2xl p-5 sm:p-6 flex flex-col justify-between relative overflow-hidden">
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-[11px] font-mono tracking-widest text-[#6366F1] uppercase flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-[#6366F1] animate-ping" />
                Floor Recognized
              </span>
              <span className="text-xs text-[#9A9DA5] font-mono">
                Allocated: {seconds > 60 ? '90s' : '60s'}
              </span>
            </div>

            <div className="flex items-center gap-4">
              <div className="w-16 h-16 rounded-2xl bg-[#181B21] border border-[#2A2E39] flex items-center justify-center text-3xl shadow-inner shrink-0">
                {currentState.flag}
              </div>
              <div className="text-left space-y-1">
                <h3 className="text-lg sm:text-xl font-semibold text-[#F4F2ED]">
                  {currentState.name}
                </h3>
                <p className="text-xs sm:text-sm text-[#9A9DA5] line-clamp-1">
                  {currentState.topic}
                </p>
              </div>
            </div>
          </div>

          {/* Central Authoritative Timer Display */}
          <div className="py-6 sm:py-8 text-center space-y-2">
            <div className="font-mono text-6xl sm:text-7xl font-bold tracking-tight text-[#F4F2ED] select-none">
              {formatTime(seconds)}
            </div>
            <p className="text-[11px] text-[#575B66] font-mono">
              {isRunning ? 'CHAIR SYNCHRONIZATION ACTIVE' : 'TIMER PAUSED • PRESS RESUME OR STRIKE GAVEL'}
            </p>
          </div>

          {/* Interactive Controls Deck */}
          <div className="flex flex-wrap items-center justify-between gap-3 pt-4 border-t border-[#181B21]">
            <div className="flex items-center gap-2">
              <button
                onClick={toggleTimer}
                className={`flex items-center gap-2 px-5 py-2.5 rounded-full text-xs font-bold transition-all duration-300 cursor-pointer hover:scale-[1.02] active:scale-[0.98] ${
                  isRunning
                    ? 'bg-[#B87A24]/30 text-[#FCD34D] border border-[#F59E0B]/40 hover:bg-[#B87A24]/40'
                    : 'bg-[#6366F1] text-[#08090B] hover:bg-[#818CF8] border border-[#C7D2FE]/60 shadow-[0_0_25px_rgba(99,102,241,0.3)] hover:shadow-[0_0_40px_rgba(99,102,241,0.5)]'
                }`}
              >
                {isRunning ? (
                  <>
                    <Pause className="w-3.5 h-3.5" /> Pause
                  </>
                ) : (
                  <>
                    <Play className="w-3.5 h-3.5 fill-current" /> Start Speech
                  </>
                )}
              </button>

              <button
                onClick={resetTimer}
                className="p-2.5 rounded-full bg-[#181B21] border border-white/15 text-[#9A9DA5] hover:text-[#F4F2ED] hover:border-white/30 transition-all duration-300 cursor-pointer hover:scale-[1.02] active:scale-[0.98]"
                title="Reset Timer"
              >
                <RotateCcw className="w-3.5 h-3.5" />
              </button>
            </div>

            {/* Procedural Gavel Strike Button */}
            <button
              onClick={handleGavel}
              className="flex items-center gap-2 px-5 py-2.5 rounded-full bg-[#181B21] border border-[#6366F1]/40 text-[#C7D2FE] hover:border-[#6366F1] hover:bg-[#20242C] transition-all duration-300 text-xs font-bold group shadow-[0_0_20px_rgba(99,102,241,0.15)] hover:shadow-[0_0_30px_rgba(99,102,241,0.3)] hover:scale-[1.02] active:scale-[0.98] cursor-pointer"
            >
              <Gavel className="w-3.5 h-3.5 text-[#6366F1] group-hover:rotate-12 transition-transform" />
              <span>Strike Gavel [G]</span>
            </button>
          </div>
        </div>

        {/* Right Column: Live Speaker Queue & Raised Hands (100% STRICT PORTFOLIO MATCH) */}
        <div className="lg:col-span-4 bg-[#111318] border border-[#232731] rounded-2xl p-5 flex flex-col justify-between">
          <div className="space-y-4">
            <div className="flex items-center justify-between pb-2 border-b border-[#181B21]">
              <span className="text-xs font-semibold text-[#F4F2ED] tracking-wide uppercase flex items-center gap-2">
                <Users className="w-3.5 h-3.5 text-[#6366F1]" />
                Speaking Queue ({currentState.queue.length})
              </span>
              <span className="text-[11px] font-mono text-[#575B66]">Next Up</span>
            </div>

            <div className="space-y-2">
              {currentState.queue.map((item, idx) => (
                <div
                  key={item.name + idx}
                  className="p-2.5 rounded-xl bg-[#181B21] border border-[#2A2E39] flex items-center justify-between text-left"
                >
                  <div className="flex items-center gap-2.5 min-w-0">
                    <span className="w-7 h-7 rounded-md bg-[#232731] text-sm flex items-center justify-center border border-[#2B2F37] shrink-0">
                      {item.flag}
                    </span>
                    <div className="flex flex-col min-w-0">
                      <span className="text-xs font-medium text-[#F4F2ED] truncate">
                        {item.name}
                      </span>
                      <span className="text-[10px] text-[#9A9DA5] truncate">
                        {item.role}
                      </span>
                    </div>
                  </div>
                  <DiasBadge variant="charcoal" size="sm">
                    {item.time}
                  </DiasBadge>
                </div>
              ))}
            </div>
          </div>

          {/* Pending Procedural Motion Section */}
          <div className="pt-4 border-t border-[#181B21] space-y-2 text-left">
            <div className="flex items-center justify-between">
              <span className="text-[10px] font-mono tracking-wider text-[#9A9DA5] uppercase">
                PENDING PROCEDURAL MOTION
              </span>
              <span className="text-[9px] font-mono font-bold text-[#C7D2FE] bg-[#6366F1]/15 px-1.5 py-0.5 rounded">
                {currentState.pendingMotion.badge}
              </span>
            </div>

            <div className="p-3 rounded-xl bg-[#08090B] border border-[#232731] space-y-1">
              <div className="text-xs font-semibold text-[#F4F2ED]">
                {currentState.pendingMotion.title}
              </div>
              <div className="text-[10px] text-[#9A9DA5]">
                {currentState.pendingMotion.meta}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
