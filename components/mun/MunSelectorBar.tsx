'use client';

import React, { useState } from 'react';
import {
  Calendar,
  Clock,
  ChevronDown,
  Shield,
  Play,
  FastForward,
  Award,
  History,
  CheckCircle2,
  AlertCircle,
  Building2,
  Sparkles
} from 'lucide-react';
import { useMun } from '@/context/MunContext';
import { MunConferenceStatus } from '@/types/mun';

interface MunSelectorBarProps {
  onOpenHistory?: () => void;
  onOpenSummary?: () => void;
}

export function MunSelectorBar({ onOpenHistory, onOpenSummary }: MunSelectorBarProps) {
  const {
    conferences,
    activeConferenceId,
    activeConference,
    setActiveConferenceId,
    setConferenceStatus,
    advanceConferenceDay,
    currentConferenceDay
  } = useMun();

  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [isSecControlsOpen, setIsSecControlsOpen] = useState(false);

  const getStatusBadge = (status: MunConferenceStatus) => {
    switch (status) {
      case 'NOT_STARTED':
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-mono font-bold bg-amber-500/15 text-amber-300 border border-amber-500/30">
            <Clock className="w-3 h-3 text-amber-400 animate-pulse" />
            <span>NOT STARTED &bull; STARTS NEXT WEEK</span>
          </span>
        );
      case 'DAY_1':
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-mono font-bold bg-emerald-500/15 text-emerald-300 border border-emerald-500/30 animate-pulse">
            <span className="w-2 h-2 rounded-full bg-emerald-400" />
            <span>DAY 1 IN SESSION</span>
          </span>
        );
      case 'DAY_2':
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-mono font-bold bg-cyan-500/15 text-cyan-300 border border-cyan-500/30 animate-pulse">
            <span className="w-2 h-2 rounded-full bg-cyan-400" />
            <span>DAY 2 ACTIVE DEBATE</span>
          </span>
        );
      case 'DAY_3':
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-mono font-bold bg-purple-500/15 text-purple-300 border border-purple-500/30 animate-pulse">
            <span className="w-2 h-2 rounded-full bg-purple-400" />
            <span>DAY 3 VOTING & PLENARY</span>
          </span>
        );
      case 'CONCLUDED':
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-mono font-bold bg-neutral-500/20 text-neutral-300 border border-neutral-500/30">
            <CheckCircle2 className="w-3 h-3 text-neutral-400" />
            <span>CONCLUDED &bull; AWARDS ISSUED</span>
          </span>
        );
    }
  };

  return (
    <div className="w-full bg-[#0b0e14]/95 border-b border-white/10 backdrop-blur-xl px-4 py-3 sticky top-16 z-30 shadow-2xl">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row md:items-center justify-between gap-3 text-left">
        
        {/* Left: Active MUN Selector Dropdown */}
        <div className="flex items-center gap-3 relative">
          <div className="relative">
            <button
              type="button"
              onClick={() => setIsDropdownOpen(!isDropdownOpen)}
              className="flex items-center gap-3 px-3.5 py-2 rounded-2xl bg-white/5 hover:bg-white/10 border border-white/10 text-left cursor-pointer transition shadow-sm group"
            >
              <div className="p-2 rounded-xl bg-cyan-500/10 border border-cyan-500/20 text-cyan-400 group-hover:scale-105 transition-transform">
                <Building2 className="w-4 h-4" />
              </div>
              <div>
                <div className="text-[10px] font-mono uppercase tracking-wider text-neutral-400 flex items-center gap-1.5">
                  <span>Enrolled Conference</span>
                  <span className="text-cyan-400 font-bold">&bull; Switch</span>
                </div>
                <div className="text-sm font-bold text-white flex items-center gap-2">
                  <span className="truncate max-w-[220px] sm:max-w-[320px]">
                    {activeConference?.name || 'Select Conference'}
                  </span>
                  <ChevronDown className="w-4 h-4 text-neutral-400 group-hover:text-white transition-transform" />
                </div>
              </div>
            </button>

            {/* Dropdown Menu */}
            {isDropdownOpen && (
              <div className="absolute left-0 top-full mt-2 w-80 sm:w-96 rounded-2xl bg-[#0e121a] border border-white/15 p-2 shadow-2xl z-50 animate-in fade-in slide-in-from-top-2">
                <div className="px-3 py-2 text-[10px] font-mono text-neutral-400 uppercase tracking-wider border-b border-white/10">
                  Your Enrolled MUN Conferences
                </div>
                <div className="space-y-1 mt-1">
                  {conferences.map((conf) => {
                    const isSelected = conf.id === activeConferenceId;
                    return (
                      <button
                        key={conf.id}
                        type="button"
                        onClick={() => {
                          setActiveConferenceId(conf.id);
                          setIsDropdownOpen(false);
                        }}
                        className={`w-full p-3 rounded-xl text-left transition flex items-start justify-between gap-3 ${
                          isSelected
                            ? 'bg-cyan-500/15 border border-cyan-500/30 text-white'
                            : 'hover:bg-white/5 border border-transparent text-neutral-300'
                        }`}
                      >
                        <div className="space-y-1">
                          <div className="font-bold text-xs sm:text-sm text-white flex items-center gap-1.5">
                            <span>{conf.shortName}</span>
                            {isSelected && <span className="w-1.5 h-1.5 rounded-full bg-cyan-400" />}
                          </div>
                          <div className="text-[11px] text-neutral-400 line-clamp-1">{conf.name}</div>
                          <div className="flex items-center gap-2 text-[10px] font-mono text-neutral-400">
                            <Calendar className="w-3 h-3 text-neutral-500" />
                            <span>{conf.startDate}</span>
                          </div>
                        </div>
                        <div className="shrink-0">{getStatusBadge(conf.status)}</div>
                      </button>
                    );
                  })}
                </div>
              </div>
            )}
          </div>

          {/* Current Status Badge */}
          <div className="hidden sm:block">
            {activeConference && getStatusBadge(activeConference.status)}
          </div>
        </div>

        {/* Right Actions: Secretariat Controls & Day History / Summary Buttons */}
        <div className="flex flex-wrap items-center gap-2">
          
          {/* Day History & GSL Logs */}
          {onOpenHistory && (
            <button
              type="button"
              onClick={onOpenHistory}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-xs font-mono text-neutral-300 hover:text-white transition cursor-pointer"
            >
              <History className="w-3.5 h-3.5 text-amber-400" />
              <span>Day 1/2/3 History</span>
            </button>
          )}

          {/* Committee Valedictory Summary Paper */}
          {onOpenSummary && (
            <button
              type="button"
              onClick={onOpenSummary}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-amber-500/10 hover:bg-amber-500/20 border border-amber-500/30 text-xs font-mono text-amber-300 transition cursor-pointer"
            >
              <Award className="w-3.5 h-3.5 text-amber-400" />
              <span>Summary Paper</span>
            </button>
          )}

          {/* Secretariat Engine Toggle */}
          <div className="relative">
            <button
              type="button"
              onClick={() => setIsSecControlsOpen(!isSecControlsOpen)}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-cyan-500/15 hover:bg-cyan-500/25 border border-cyan-500/30 text-xs font-mono text-cyan-300 transition cursor-pointer"
            >
              <Shield className="w-3.5 h-3.5 text-cyan-400" />
              <span>Secretariat Dais</span>
              <ChevronDown className="w-3 h-3 text-cyan-400" />
            </button>

            {/* Secretariat Dais Control Panel */}
            {isSecControlsOpen && activeConference && (
              <div className="absolute right-0 top-full mt-2 w-72 rounded-2xl bg-[#0e121a] border border-cyan-500/30 p-4 shadow-2xl z-50 space-y-3 animate-in fade-in slide-in-from-top-2">
                <div className="flex items-center justify-between border-b border-white/10 pb-2">
                  <div className="text-[11px] font-mono font-bold uppercase text-cyan-300 flex items-center gap-1.5">
                    <Sparkles className="w-3.5 h-3.5 text-cyan-400" />
                    <span>Secretariat Day Engine</span>
                  </div>
                  <span className="text-[10px] font-mono text-neutral-400">Day {currentConferenceDay}</span>
                </div>

                <div className="text-xs text-neutral-300">
                  <span className="text-neutral-400">Chair: </span>
                  <span className="font-semibold text-white">{activeConference.secretariatChair}</span>
                </div>

                <div className="space-y-1.5">
                  <div className="text-[10px] font-mono uppercase text-neutral-400">Conference State:</div>
                  <div className="grid grid-cols-2 gap-1.5">
                    {(['NOT_STARTED', 'DAY_1', 'DAY_2', 'DAY_3', 'CONCLUDED'] as MunConferenceStatus[]).map((st) => (
                      <button
                        key={st}
                        type="button"
                        onClick={() => {
                          setConferenceStatus(activeConference.id, st);
                          setIsSecControlsOpen(false);
                        }}
                        className={`px-2 py-1 rounded-lg text-[10px] font-mono font-bold transition ${
                          activeConference.status === st
                            ? 'bg-cyan-500 text-black'
                            : 'bg-white/5 hover:bg-white/10 text-neutral-300'
                        }`}
                      >
                        {st.replace('_', ' ')}
                      </button>
                    ))}
                  </div>
                </div>

                {activeConference.status === 'NOT_STARTED' && (
                  <button
                    type="button"
                    onClick={() => {
                      setConferenceStatus(activeConference.id, 'DAY_1');
                      setIsSecControlsOpen(false);
                    }}
                    className="w-full py-2 px-3 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-black font-bold text-xs flex items-center justify-center gap-2 cursor-pointer shadow-lg shadow-emerald-500/20"
                  >
                    <Play className="w-3.5 h-3.5 fill-black" />
                    <span>Secretariat: Start Day 1</span>
                  </button>
                )}

                {activeConference.status !== 'NOT_STARTED' && activeConference.status !== 'CONCLUDED' && (
                  <button
                    type="button"
                    onClick={() => {
                      advanceConferenceDay(activeConference.id);
                      setIsSecControlsOpen(false);
                    }}
                    className="w-full py-2 px-3 rounded-xl bg-white/10 hover:bg-white/20 border border-white/15 text-white font-bold text-xs flex items-center justify-center gap-2 cursor-pointer"
                  >
                    <FastForward className="w-3.5 h-3.5 text-cyan-400" />
                    <span>Advance Next Day &rarr;</span>
                  </button>
                )}
              </div>
            )}
          </div>

        </div>

      </div>
    </div>
  );
}
