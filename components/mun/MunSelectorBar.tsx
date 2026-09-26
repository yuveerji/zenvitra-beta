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
    setConferenceDay,
    setConferenceTotalDays,
    addConferenceDay,
    advanceConferenceDay,
    concludeConference,
    currentConferenceDay
  } = useMun();

  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [isSecControlsOpen, setIsSecControlsOpen] = useState(false);

  const getStatusBadge = (status: MunConferenceStatus, day?: number) => {
    if (status === 'NOT_STARTED') {
      return (
        <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-mono font-bold bg-amber-500/15 text-amber-300 border border-amber-500/30">
          <Clock className="w-3 h-3 text-amber-400 animate-pulse" />
          <span>NOT STARTED &bull; GAVEL PENDING</span>
        </span>
      );
    }
    if (status === 'CONCLUDED') {
      return (
        <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-mono font-bold bg-neutral-500/20 text-neutral-300 border border-neutral-500/30">
          <CheckCircle2 className="w-3 h-3 text-neutral-400" />
          <span>CONCLUDED &bull; AWARDS ISSUED</span>
        </span>
      );
    }
    const currentNum = day !== undefined && day > 0 ? day : (status.startsWith('DAY_') ? parseInt(status.replace('DAY_', ''), 10) : 1);
    return (
      <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-mono font-bold bg-emerald-500/15 text-emerald-300 border border-emerald-500/30 animate-pulse">
        <span className="w-2 h-2 rounded-full bg-emerald-400" />
        <span>DAY {currentNum} IN SESSION</span>
      </span>
    );
  };

  return (
    <div className="w-full bg-[#0b0e14]/95 border-b border-white/10 backdrop-blur-xl px-4 py-3 sticky top-16 sm:top-[68px] xl:top-[72px] z-30 shadow-2xl">
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
                    {(activeConference || conferences[0])?.name || 'Zen Diplomacy 2026'}
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
                    const isSelected = conf.id === (activeConferenceId || conferences[0]?.id);
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
            {(activeConference || conferences[0]) && getStatusBadge((activeConference || conferences[0]).status, currentConferenceDay)}
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
                  <span className="text-[10px] font-mono text-neutral-400">
                    Day {activeConference.status === 'NOT_STARTED' ? '0 (Not Started)' : currentConferenceDay} of {activeConference.totalDays || 3}
                  </span>
                </div>

                <div className="text-xs text-neutral-300">
                  <span className="text-neutral-400">Chair: </span>
                  <span className="font-semibold text-white">{activeConference.secretariatChair}</span>
                </div>

                {/* Total Days Selector (No Limit - Any Natural Number n) */}
                <div className="p-2.5 rounded-xl bg-black/40 border border-white/10 space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-mono uppercase text-neutral-400">Conference Total Days:</span>
                    <span className="text-xs font-mono font-bold text-cyan-300">{activeConference.totalDays || 3} Days</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <button
                      type="button"
                      onClick={() => setConferenceTotalDays(activeConference.id, Math.max(1, (activeConference.totalDays || 3) - 1))}
                      className="px-2.5 py-1 rounded-lg bg-white/5 hover:bg-white/10 text-xs font-mono text-neutral-300 border border-white/10"
                      title="Decrease total days"
                    >
                      -1
                    </button>
                    <button
                      type="button"
                      onClick={() => addConferenceDay(activeConference.id)}
                      className="flex-1 py-1 rounded-lg bg-cyan-500/20 hover:bg-cyan-500/30 text-xs font-mono font-bold text-cyan-300 border border-cyan-500/30 text-center"
                      title="Add one more day to conference"
                    >
                      + Add Day (Day {(activeConference.totalDays || 3) + 1})
                    </button>
                  </div>
                </div>

                {/* Day Switcher Grid */}
                <div className="space-y-1.5">
                  <div className="text-[10px] font-mono uppercase text-neutral-400">Switch Conference Day:</div>
                  <div className="flex flex-wrap gap-1.5 max-h-32 overflow-y-auto">
                    <button
                      type="button"
                      onClick={() => {
                        setConferenceStatus(activeConference.id, 'NOT_STARTED');
                        setConferenceDay(activeConference.id, 0);
                        setIsSecControlsOpen(false);
                      }}
                      className={`px-2 py-1 rounded-lg text-[10px] font-mono font-bold transition ${
                        activeConference.status === 'NOT_STARTED'
                          ? 'bg-amber-500 text-black'
                          : 'bg-white/5 hover:bg-white/10 text-neutral-300'
                      }`}
                    >
                      Not Started
                    </button>
                    {Array.from({ length: Math.max(activeConference.totalDays || 3, currentConferenceDay, 1) }, (_, i) => i + 1).map((d) => (
                      <button
                        key={d}
                        type="button"
                        onClick={() => {
                          setConferenceDay(activeConference.id, d);
                          setIsSecControlsOpen(false);
                        }}
                        className={`px-2 py-1 rounded-lg text-[10px] font-mono font-bold transition ${
                          activeConference.status !== 'NOT_STARTED' && activeConference.status !== 'CONCLUDED' && currentConferenceDay === d
                            ? 'bg-cyan-500 text-black'
                            : 'bg-white/5 hover:bg-white/10 text-neutral-300'
                        }`}
                      >
                        Day {d}
                      </button>
                    ))}
                    <button
                      type="button"
                      onClick={() => {
                        concludeConference(activeConference.id);
                        setIsSecControlsOpen(false);
                      }}
                      className={`px-2 py-1 rounded-lg text-[10px] font-mono font-bold transition ${
                        activeConference.status === 'CONCLUDED'
                          ? 'bg-purple-500 text-white'
                          : 'bg-white/5 hover:bg-white/10 text-neutral-300'
                      }`}
                    >
                      Concluded
                    </button>
                  </div>
                </div>

                {/* Action Buttons */}
                {activeConference.status === 'NOT_STARTED' && (
                  <button
                    type="button"
                    onClick={() => {
                      setConferenceDay(activeConference.id, 1);
                      setIsSecControlsOpen(false);
                    }}
                    className="w-full py-2 px-3 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-black font-bold text-xs flex items-center justify-center gap-2 cursor-pointer shadow-lg shadow-emerald-500/20"
                  >
                    <Play className="w-3.5 h-3.5 fill-black" />
                    <span>Secretariat: Start Day 1</span>
                  </button>
                )}

                {activeConference.status !== 'NOT_STARTED' && activeConference.status !== 'CONCLUDED' && (
                  <div className="space-y-2">
                    <button
                      type="button"
                      onClick={() => {
                        advanceConferenceDay(activeConference.id);
                        setIsSecControlsOpen(false);
                      }}
                      className="w-full py-2 px-3 rounded-xl bg-white/10 hover:bg-white/20 border border-white/15 text-white font-bold text-xs flex items-center justify-center gap-2 cursor-pointer"
                    >
                      <FastForward className="w-3.5 h-3.5 text-cyan-400" />
                      <span>Advance to Day {currentConferenceDay + 1} &rarr;</span>
                    </button>

                    <button
                      type="button"
                      onClick={() => {
                        concludeConference(activeConference.id);
                        setIsSecControlsOpen(false);
                      }}
                      className="w-full py-2 px-3 rounded-xl bg-rose-500/20 hover:bg-rose-500/30 border border-rose-500/40 text-rose-300 font-bold text-xs flex items-center justify-center gap-2 cursor-pointer"
                    >
                      <CheckCircle2 className="w-3.5 h-3.5 text-rose-400" />
                      <span>Adjourn Conference (Conclude)</span>
                    </button>
                  </div>
                )}
              </div>
            )}
          </div>

        </div>

      </div>
    </div>
  );
}
