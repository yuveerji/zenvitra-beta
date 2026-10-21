'use client';

import React, { useState } from 'react';
import Link from 'next/link';
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
  Sparkles,
  Menu,
  Plus,
  Layers,
  ArrowRight,
  Zap
} from 'lucide-react';
import { useMun } from '@/context/MunContext';
import { MunConferenceStatus } from '@/types/mun';
import { computeConferenceStatus } from '@/lib/conferenceStatusHelper';
import { CreateMunConferenceModal } from './CreateMunConferenceModal';

interface MunSelectorBarProps {
  onOpenHistory?: () => void;
  onOpenSummary?: () => void;
  onOpenInstantEvent?: () => void;
  onOpenMatrix?: () => void;
  isEmbedded?: boolean;
}

export function MunSelectorBar({ onOpenHistory, onOpenSummary, onOpenInstantEvent, onOpenMatrix, isEmbedded = false }: MunSelectorBarProps) {
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
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);

  const statusInfo = computeConferenceStatus(activeConference);

  const getStatusBadge = () => {
    if (!activeConference) {
      return (
        <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-mono font-bold bg-neutral-500/15 text-neutral-400 border border-neutral-500/30">
          <span>HOST TO LAUNCH CHAMBER</span>
        </span>
      );
    }
    if (statusInfo.status === 'NOT_STARTED') {
      return (
        <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-mono font-bold bg-amber-500/15 text-amber-300 border border-amber-500/30">
          <Clock className="w-3.5 h-3.5 text-amber-400 animate-pulse" />
          <span>{statusInfo.displayText}</span>
        </span>
      );
    }
    if (statusInfo.status === 'CONCLUDED') {
      return (
        <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-mono font-bold bg-neutral-500/20 text-neutral-300 border border-neutral-500/30">
          <CheckCircle2 className="w-3.5 h-3.5 text-neutral-400" />
          <span>CONCLUDED &bull; ADJOURNED SINE DIE</span>
        </span>
      );
    }
    return (
      <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-mono font-bold bg-emerald-500/15 text-emerald-300 border border-emerald-500/30 animate-pulse">
        <span className="w-2 h-2 rounded-full bg-emerald-400" />
        <span>{statusInfo.displayText}</span>
      </span>
    );
  };

  return (
    <>
      <div className={
        isEmbedded
          ? "w-full bg-[#0a0c10]/95 rounded-3xl border border-white/10 backdrop-blur-xl px-4 py-3 shadow-xl relative z-40"
          : "w-full bg-[#0b0e14]/95 border-b border-white/10 backdrop-blur-xl px-4 py-3 sticky top-16 sm:top-[68px] xl:top-[72px] z-40 shadow-2xl"
      }>
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row md:items-center justify-between gap-3 text-left">
          
          {/* Left: Menu Drawer Toggle + Active MUN Selector Dropdown */}
          <div className="flex items-center gap-2.5 relative flex-wrap sm:flex-nowrap">
            {/* Inline Platform Drawer Toggle Button (Prevents floating button collision!) */}
            <button
              type="button"
              onClick={() => {
                window.dispatchEvent(new CustomEvent('zenvitra-toggle-platform-sidebar'));
              }}
              className="h-10 w-10 sm:h-11 sm:w-11 rounded-2xl flex items-center justify-center cursor-pointer transition-all duration-200 border backdrop-blur-2xl shadow-md shrink-0 bg-[#0c101a] hover:bg-zinc-800 text-zinc-300 hover:text-white border-white/15 hover:border-white/30 hover:scale-105 active:scale-95"
              title="Toggle Platform Navigation Menu"
              aria-label="Toggle Platform Navigation Menu"
            >
              <Menu className="w-5 h-5" />
            </button>

            {/* Conference Selector Pill */}
            <div className="relative flex-1 sm:flex-initial">
              <button
                type="button"
                onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                className="w-full sm:w-auto flex items-center gap-3 px-3.5 py-2 rounded-2xl bg-white/5 hover:bg-white/10 border border-white/10 text-left cursor-pointer transition shadow-sm group"
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
                    <span className="truncate max-w-[180px] sm:max-w-[280px]">
                      {activeConference?.name || 'No Active Event Selected'}
                    </span>
                    <ChevronDown className="w-4 h-4 text-neutral-400 group-hover:text-white transition-transform" />
                  </div>
                </div>
              </button>

              {/* Dropdown Menu */}
              {isDropdownOpen && (
                <>
                  <div
                    className="fixed inset-0 z-40 cursor-default"
                    onClick={() => setIsDropdownOpen(false)}
                  />
                  <div className="absolute left-0 top-full mt-2 w-80 sm:w-96 rounded-2xl bg-[#0e121a] border border-white/15 p-2 shadow-2xl z-50 animate-in fade-in slide-in-from-top-2">
                  <div className="px-3 py-2 text-[10px] font-mono text-neutral-400 uppercase tracking-wider border-b border-white/10 flex items-center justify-between">
                    <span>Your Hosted &amp; Enrolled Events</span>
                    <span className="text-cyan-400 font-bold">{conferences.length} Active</span>
                  </div>
                  <div className="space-y-1 mt-1 max-h-60 overflow-y-auto no-scrollbar">
                    {conferences.length === 0 ? (
                      <div className="p-4 text-center text-xs text-neutral-400">
                        No events hosted yet. Host a conference or summit below.
                      </div>
                    ) : (
                      conferences.map((conf) => {
                        const isSelected = conf.id === (activeConferenceId || conferences[0]?.id);
                        const confInfo = computeConferenceStatus(conf);
                        return (
                          <button
                            key={conf.id}
                            type="button"
                            onClick={() => {
                              setActiveConferenceId(conf.id);
                              setIsDropdownOpen(false);
                            }}
                            className={`w-full p-2.5 rounded-xl text-left transition flex items-start justify-between gap-3 ${
                              isSelected
                                ? 'bg-cyan-500/15 border border-cyan-500/30 text-white'
                                : 'hover:bg-white/5 border border-transparent text-neutral-300'
                            }`}
                          >
                            <div className="space-y-1 min-w-0">
                              <div className="font-bold text-xs sm:text-sm text-white flex items-center gap-1.5">
                                <span className="truncate">{conf.shortName || conf.name}</span>
                                {isSelected && <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 shrink-0" />}
                              </div>
                              <div className="text-[11px] text-neutral-400 truncate">{conf.name}</div>
                              <div className="flex items-center gap-2 text-[10px] font-mono text-neutral-400">
                                <Calendar className="w-3 h-3 text-neutral-500" />
                                <span>{conf.startDate}</span>
                              </div>
                            </div>
                            <div className="shrink-0 text-[10px] font-mono font-bold">
                              {confInfo.status === 'NOT_STARTED' && (
                                <span className="text-amber-400">UPCOMING</span>
                              )}
                              {confInfo.status === 'CONCLUDED' && (
                                <span className="text-neutral-400">CONCLUDED</span>
                              )}
                              {confInfo.status.startsWith('DAY_') && (
                                <span className="text-emerald-400">LIVE</span>
                              )}
                            </div>
                          </button>
                        );
                      })
                    )}
                  </div>

                  {/* Host New Conference Button */}
                  <div className="pt-2 border-t border-white/10 mt-1">
                    <button
                      type="button"
                      onClick={() => {
                        setIsDropdownOpen(false);
                        setIsCreateModalOpen(true);
                      }}
                      className="w-full p-2.5 rounded-xl bg-gradient-to-r from-cyan-500/15 via-emerald-500/15 to-transparent hover:from-cyan-500/25 hover:to-emerald-500/25 border border-cyan-500/30 text-cyan-300 font-bold text-xs flex items-center justify-center gap-2 cursor-pointer transition shadow-sm"
                    >
                      <Plus className="w-4 h-4 text-cyan-400" />
                      <span>Host New Event</span>
                    </button>
                  </div>
                </div>
              </>
            )}
            </div>

            {/* Current Real-Time Date Status Badge */}
            <div className="hidden sm:block">
              {getStatusBadge()}
            </div>
          </div>

          {/* Right Actions: Connect Matrix, Secretariat Controls & Day History */}
          <div className="flex flex-wrap items-center gap-2">
            
            {/* ── CONNECT MATRIX BUTTON ── */}
            {onOpenMatrix ? (
              <button
                type="button"
                onClick={onOpenMatrix}
                className="flex items-center gap-1.5 px-3.5 py-2 rounded-2xl bg-cyan-500/15 hover:bg-cyan-500/25 border border-cyan-500/40 text-cyan-300 font-bold text-xs transition cursor-pointer shadow-md group active:scale-95"
                title="Inspect Live Country & Portfolio Matrix"
              >
                <Layers className="w-4 h-4 text-cyan-400 group-hover:scale-110 transition-transform" />
                <span>Connect Matrix</span>
              </button>
            ) : (
              <Link
                href={activeConference?.id ? `/${activeConference.id}/matrix` : '/mun/matrix'}
                className="flex items-center gap-1.5 px-3.5 py-2 rounded-2xl bg-cyan-500/15 hover:bg-cyan-500/25 border border-cyan-500/40 text-cyan-300 font-bold text-xs transition cursor-pointer shadow-md group active:scale-95"
                title="Inspect Live Country & Portfolio Matrix"
              >
                <Layers className="w-4 h-4 text-cyan-400 group-hover:scale-110 transition-transform" />
                <span>Connect Matrix</span>
              </Link>
            )}

            {/* ── CREATE INSTANT EVENT BUTTON ── */}
            <button
              type="button"
              onClick={() => {
                if (onOpenInstantEvent) {
                  onOpenInstantEvent();
                } else {
                  setIsCreateModalOpen(true);
                }
              }}
              className="flex items-center gap-1.5 px-3.5 py-2 rounded-2xl bg-gradient-to-r from-amber-500/15 via-cyan-500/15 to-emerald-500/15 hover:from-amber-500/25 hover:via-cyan-500/25 hover:to-emerald-500/25 border border-amber-400/40 text-amber-200 font-bold text-xs transition cursor-pointer shadow-md group active:scale-95"
              title="Create an Instant Event (Live Chamber / Assembly Now)"
            >
              <Zap className="w-3.5 h-3.5 text-amber-300 fill-amber-300 group-hover:scale-110 transition-transform" />
              <span>Instant Event</span>
            </button>

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
                      Day {currentConferenceDay} of {activeConference.totalDays || 2}
                    </span>
                  </div>

                  <div className="space-y-2 text-xs font-mono">
                    <div className="text-[11px] text-neutral-400">
                      Dates: <strong className="text-white">{activeConference.startDate}</strong> to <strong className="text-white">{activeConference.endDate}</strong>
                    </div>

                    {/* Day Advancer Buttons */}
                    <div className="grid grid-cols-2 gap-2 pt-1">
                      <button
                        type="button"
                        onClick={() => {
                          setConferenceDay(activeConference.id, Math.max(0, currentConferenceDay - 1));
                          setIsSecControlsOpen(false);
                        }}
                        className="py-2 px-3 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-white text-[11px] font-bold transition cursor-pointer"
                      >
                        &larr; Prev Day
                      </button>
                      <button
                        type="button"
                        onClick={() => {
                          advanceConferenceDay(activeConference.id);
                          setIsSecControlsOpen(false);
                        }}
                        className="py-2 px-3 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-black text-[11px] font-bold flex items-center justify-center gap-1 transition cursor-pointer shadow-md"
                      >
                        <span>Next Day</span>
                        <FastForward className="w-3.5 h-3.5" />
                      </button>
                    </div>

                    <div className="pt-2 border-t border-white/10 space-y-1.5">
                      <button
                        type="button"
                        onClick={() => {
                          setConferenceStatus(activeConference.id, 'NOT_STARTED');
                          setIsSecControlsOpen(false);
                        }}
                        className="w-full py-1.5 px-2 rounded-lg bg-amber-500/10 hover:bg-amber-500/20 text-amber-300 border border-amber-500/20 text-[10px] transition cursor-pointer text-left flex items-center gap-1.5"
                      >
                        <Clock className="w-3 h-3 text-amber-400" />
                        <span>Reset to Pre-Session Recess</span>
                      </button>
                      <button
                        type="button"
                        onClick={() => {
                          concludeConference(activeConference.id);
                          setIsSecControlsOpen(false);
                        }}
                        className="w-full py-1.5 px-2 rounded-lg bg-rose-500/10 hover:bg-rose-500/20 text-rose-300 border border-rose-500/20 text-[10px] transition cursor-pointer text-left flex items-center gap-1.5"
                      >
                        <CheckCircle2 className="w-3 h-3 text-rose-400" />
                        <span>Adjourn Conference Sine Die</span>
                      </button>
                    </div>
                  </div>
                </div>
              )}
            </div>

          </div>
        </div>
      </div>

      {/* Host New Conference Modal */}
      <CreateMunConferenceModal
        isOpen={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
      />
    </>
  );
}
