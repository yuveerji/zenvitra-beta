'use client';

import React, { useState, useEffect } from 'react';
import { Play, Pause, RotateCcw, Gavel, Volume2, Users, FileText, Vote, Sparkles, Clock, ShieldCheck, ChevronRight } from 'lucide-react';
import { daisAudio } from '@/lib/daisAudio';
import { DiasBadge } from './DiasBadge';

export const DiasLivePreview: React.FC = () => {
  const [seconds, setSeconds] = useState(72);
  const [isRunning, setIsRunning] = useState(false);
  const [activeTab, setActiveTab] = useState<'gsl' | 'mod' | 'bill'>('gsl');
  const [currentSpeaker, setCurrentSpeaker] = useState({
    name: 'Hon. Delegate of Japan',
    seat: 'JAPAN',
    flag: '🇯🇵',
    topic: 'Sustainable Maritime Navigation & Indo-Pacific Security',
  });

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
      <div className="absolute top-0 right-1/4 w-96 h-96 bg-[#C5A46D]/5 rounded-full blur-3xl pointer-events-none" />

      {/* Header bar of preview */}
      <div className="flex flex-wrap items-center justify-between gap-3 pb-5 border-b border-[#181B21]">
        <div className="flex items-center gap-3">
          <div className="w-2.5 h-2.5 rounded-full bg-[#22C55E] animate-pulse" />
          <div className="flex flex-col text-left">
            <span className="text-xs font-bold tracking-wider text-[#F4F2ED] uppercase font-mono">
              SESSION LIVE • LOK SABHA / UNGA-01
            </span>
            <span className="text-[11px] text-[#9A9DA5]">
              Quorum Confirmed: 48 Present, 14 Present & Voting
            </span>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <DiasBadge variant="gold" size="sm" dot>
            CHAIR CONSOLE PREVIEW
          </DiasBadge>
          <button
            onClick={() => daisAudio.toggle()}
            title="Toggle Procedural Audio"
            className="p-1.5 rounded-lg bg-[#181B21] border border-[#2A2E39] text-[#C5A46D] hover:bg-[#20242C] transition-colors"
          >
            <Volume2 className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* Mode Selector pills */}
      <div className="flex items-center gap-2 pt-4 pb-4 overflow-x-auto text-xs no-scrollbar">
        <button
          onClick={() => {
            setActiveTab('gsl');
            setCurrentSpeaker({
              name: 'Hon. Delegate of Japan',
              seat: 'JAPAN',
              flag: '🇯🇵',
              topic: 'Sustainable Maritime Navigation & Indo-Pacific Security',
            });
          }}
          className={`px-3 py-1.5 rounded-xl font-medium transition-all ${
            activeTab === 'gsl'
              ? 'bg-[#C5A46D] text-[#08090B] font-semibold shadow-sm'
              : 'bg-[#111318] text-[#9A9DA5] hover:text-[#F4F2ED] border border-[#232731]'
          }`}
        >
          General Speakers' List
        </button>
        <button
          onClick={() => {
            setActiveTab('mod');
            setCurrentSpeaker({
              name: 'Hon. Representative of France',
              seat: 'FRANCE',
              flag: '🇫🇷',
              topic: 'Moderated Caucus: AI Governance & Nuclear Command Systems',
            });
          }}
          className={`px-3 py-1.5 rounded-xl font-medium transition-all ${
            activeTab === 'mod'
              ? 'bg-[#C5A46D] text-[#08090B] font-semibold shadow-sm'
              : 'bg-[#111318] text-[#9A9DA5] hover:text-[#F4F2ED] border border-[#232731]'
          }`}
        >
          Moderated Caucus
        </button>
        <button
          onClick={() => {
            setActiveTab('bill');
            setCurrentSpeaker({
              name: 'Treasury Bench • Hon. Minister of External Affairs',
              seat: 'INDIA',
              flag: '🇮🇳',
              topic: 'Clause 4 Amendment: Maritime Economic Corridors Bill, 2026',
            });
          }}
          className={`px-3 py-1.5 rounded-xl font-medium transition-all ${
            activeTab === 'bill'
              ? 'bg-[#C5A46D] text-[#08090B] font-semibold shadow-sm'
              : 'bg-[#111318] text-[#9A9DA5] hover:text-[#F4F2ED] border border-[#232731]'
          }`}
        >
          Parliamentary Bill Debate
        </button>
      </div>

      {/* Main Preview Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 pt-1">
        {/* Left Column: Active Speaker Stage & Timer */}
        <div className="lg:col-span-8 bg-[#111318] border border-[#232731] rounded-2xl p-5 sm:p-6 flex flex-col justify-between relative overflow-hidden">
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-[11px] font-mono tracking-widest text-[#C5A46D] uppercase flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-[#C5A46D] animate-ping" />
                Floor Recognized
              </span>
              <span className="text-xs text-[#9A9DA5] font-mono">
                Allocated: 90s
              </span>
            </div>

            <div className="flex items-center gap-4">
              <div className="w-16 h-16 rounded-2xl bg-[#181B21] border border-[#2A2E39] flex items-center justify-center text-3xl shadow-inner">
                {currentSpeaker.flag}
              </div>
              <div className="text-left space-y-1">
                <h3 className="text-lg sm:text-xl font-semibold text-[#F4F2ED]">
                  {currentSpeaker.name}
                </h3>
                <p className="text-xs sm:text-sm text-[#9A9DA5] line-clamp-1">
                  {currentSpeaker.topic}
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
                className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-semibold transition-all ${
                  isRunning
                    ? 'bg-[#B87A24]/30 text-[#FCD34D] border border-[#F59E0B]/40 hover:bg-[#B87A24]/40'
                    : 'bg-[#C5A46D] text-[#08090B] hover:bg-[#D4B57E] shadow-[0_2px_12px_rgba(197,164,109,0.3)]'
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
                className="p-2.5 rounded-xl bg-[#181B21] border border-[#2A2E39] text-[#9A9DA5] hover:text-[#F4F2ED] transition-colors"
                title="Reset Timer"
              >
                <RotateCcw className="w-3.5 h-3.5" />
              </button>
            </div>

            {/* Procedural Gavel Strike Button */}
            <button
              onClick={handleGavel}
              className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-[#181B21] border border-[#C5A46D]/40 text-[#E6D1A5] hover:border-[#C5A46D] hover:bg-[#20242C] transition-all text-xs font-semibold group shadow-sm active:scale-95"
            >
              <Gavel className="w-3.5 h-3.5 text-[#C5A46D] group-hover:rotate-12 transition-transform" />
              <span>Strike Gavel [G]</span>
            </button>
          </div>
        </div>

        {/* Right Column: Live Speaker Queue & Raised Hands */}
        <div className="lg:col-span-4 bg-[#111318] border border-[#232731] rounded-2xl p-5 flex flex-col justify-between">
          <div className="space-y-4">
            <div className="flex items-center justify-between pb-2 border-b border-[#181B21]">
              <span className="text-xs font-semibold text-[#F4F2ED] tracking-wide uppercase flex items-center gap-2">
                <Users className="w-3.5 h-3.5 text-[#C5A46D]" />
                Speaking Queue (4)
              </span>
              <span className="text-[11px] font-mono text-[#575B66]">Next Up</span>
            </div>

            <div className="space-y-2">
              <div className="p-2.5 rounded-xl bg-[#181B21] border border-[#2A2E39] flex items-center justify-between text-left">
                <div className="flex items-center gap-2.5">
                  <span className="w-6 h-6 rounded-md bg-[#C5A46D]/15 text-[#E6D1A5] text-[11px] font-bold flex items-center justify-center border border-[#C5A46D]/30">OP</span>
                  <div className="flex flex-col">
                    <span className="text-xs font-medium text-[#F4F2ED]">Opposition Bench</span>
                    <span className="text-[10px] text-[#9A9DA5]">Leader of Opposition • #2</span>
                  </div>
                </div>
                <DiasBadge variant="charcoal" size="sm">01:30</DiasBadge>
              </div>

              <div className="p-2.5 rounded-xl bg-[#181B21] border border-[#2A2E39] flex items-center justify-between text-left">
                <div className="flex items-center gap-2.5">
                  <span className="w-6 h-6 rounded-md bg-[#232731] text-[#9A9DA5] text-[11px] font-bold flex items-center justify-center border border-[#2B2F37]">UP</span>
                  <div className="flex flex-col">
                    <span className="text-xs font-medium text-[#F4F2ED]">Member for Varanasi</span>
                    <span className="text-[10px] text-[#9A9DA5]">Uttar Pradesh • #3</span>
                  </div>
                </div>
                <DiasBadge variant="charcoal" size="sm">01:30</DiasBadge>
              </div>

              <div className="p-2.5 rounded-xl bg-[#181B21] border border-[#2A2E39] flex items-center justify-between text-left">
                <div className="flex items-center gap-2.5">
                  <span className="w-6 h-6 rounded-md bg-[#232731] text-[#9A9DA5] text-[11px] font-bold flex items-center justify-center border border-[#2B2F37]">KL</span>
                  <div className="flex flex-col">
                    <span className="text-xs font-medium text-[#F4F2ED]">Member for Wayanad</span>
                    <span className="text-[10px] text-[#9A9DA5]">Kerala • #4</span>
                  </div>
                </div>
                <DiasBadge variant="charcoal" size="sm">01:30</DiasBadge>
              </div>
            </div>
          </div>

          {/* Quick Parliamentary Motion Bar */}
          <div className="pt-4 border-t border-[#181B21] space-y-2">
            <span className="text-[11px] font-mono text-[#9A9DA5] uppercase block text-left">
              Pending Procedural Motion
            </span>
            <div className="p-2.5 rounded-xl bg-[#C5A46D]/10 border border-[#C5A46D]/20 text-left space-y-1">
              <div className="flex items-center justify-between">
                <span className="text-xs font-semibold text-[#E6D1A5]">Division Vote on Clause 4</span>
                <span className="text-[10px] font-mono text-[#C5A46D]">Recorded</span>
              </div>
              <p className="text-[11px] text-[#9A9DA5]">Proposed by Opposition Bench • Member for Baramati</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
