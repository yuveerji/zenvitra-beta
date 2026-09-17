'use client';

import React, { useState } from 'react';
import {
  History,
  X,
  Calendar,
  CheckCircle2,
  XCircle,
  Clock,
  Mic2,
  Vote,
  FileCheck2,
  Award,
  Sparkles,
  Search,
  Filter
} from 'lucide-react';
import { useMun } from '@/context/MunContext';
import { MunMotion, MunSpeaker } from '@/types/mun';

interface ChamberDayHistoryModalProps {
  isOpen: boolean;
  onClose: () => void;
  committeeName?: string;
}

export function ChamberDayHistoryModal({
  isOpen,
  onClose,
  committeeName = 'Committee Chamber',
}: ChamberDayHistoryModalProps) {
  const { sessionState, currentConferenceDay, activeConference } = useMun();
  const motionsList: MunMotion[] = sessionState.motionHistory || [];
  const speakersList: MunSpeaker[] = sessionState.speakerHistory || [];
  const billsList = sessionState.passedBills || [];

  const maxRecordedDay = Math.max(
    activeConference?.totalDays || 3,
    currentConferenceDay || 1,
    ...motionsList.map((m) => m.day || 1),
    ...speakersList.map((s) => s.day || 1),
    ...billsList.map((b) => b.day || 1),
    1
  );

  const [selectedDay, setSelectedDay] = useState<number | 'ALL'>(currentConferenceDay || 1);
  const [activeTab, setActiveTab] = useState<'MOTIONS' | 'SPEAKERS' | 'BILLS'>('MOTIONS');

  if (!isOpen) return null;

  // Motions filter
  const filteredMotions = motionsList.filter((m) => {
    if (selectedDay === 'ALL') return true;
    return (m.day || 1) === selectedDay;
  });

  // Speakers filter
  const filteredSpeakers = speakersList.filter((s) => {
    if (selectedDay === 'ALL') return true;
    return (s.day || 1) === selectedDay;
  });

  // Bills filter
  const filteredBills = billsList.filter((b) => {
    if (selectedDay === 'ALL') return true;
    return (b.day || 1) === selectedDay;
  });

  // Stats calculation
  const passedMotions = filteredMotions.filter((m) => String(m.verdict).toUpperCase() === 'PASSED').length;
  const failedMotions = filteredMotions.filter((m) => String(m.verdict).toUpperCase() === 'FAILED').length;
  const totalSpeeches = filteredSpeakers.length;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-black/80 backdrop-blur-md animate-fade-in text-left">
      <div className="w-full max-w-4xl max-h-[90vh] bg-gradient-to-b from-[#0e121a] via-[#090c12] to-[#040609] border border-amber-500/30 rounded-3xl p-5 sm:p-8 shadow-[0_0_60px_rgba(245,158,11,0.15)] flex flex-col relative overflow-hidden space-y-5">
        
        {/* Ambient Glow */}
        <div className="absolute top-0 right-0 w-80 h-80 bg-amber-500/10 blur-[100px] pointer-events-none rounded-full" />
        <div className="absolute bottom-0 left-0 w-60 h-60 bg-cyan-500/10 blur-[90px] pointer-events-none rounded-full" />

        {/* Header */}
        <div className="flex items-start justify-between relative z-10 border-b border-white/10 pb-4">
          <div className="space-y-1">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-500/10 border border-amber-500/30 text-amber-300 font-mono text-[10px] uppercase font-bold tracking-wider">
              <History className="w-3.5 h-3.5 text-amber-400" />
              <span>{committeeName} &bull; DAY-BY-DAY CHAMBER LOGS</span>
            </div>
            <h2 className="text-xl sm:text-2xl font-bold font-display text-white">
              Committee Productivity & Chamber History
            </h2>
            <p className="text-xs text-neutral-400 font-sans">
              Comprehensive log of all caucus motions, roll calls, and General Speakers List (GSL) turns across conference days.
            </p>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="p-2 rounded-xl bg-white/5 hover:bg-white/10 text-neutral-400 hover:text-white transition cursor-pointer shrink-0"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Day Selector Navigation Pills */}
        <div className="flex flex-wrap items-center justify-between gap-3 relative z-10">
          <div className="flex flex-wrap items-center gap-1.5 p-1 rounded-2xl bg-white/5 border border-white/10 font-mono text-xs">
            {Array.from({ length: maxRecordedDay }, (_, i) => i + 1).map((day) => (
              <button
                key={day}
                type="button"
                onClick={() => setSelectedDay(day)}
                className={`px-3 py-1.5 rounded-xl font-bold transition cursor-pointer ${
                  selectedDay === day
                    ? 'bg-amber-500 text-black shadow-md'
                    : 'text-neutral-400 hover:text-white'
                }`}
              >
                Day {day}
              </button>
            ))}
            <button
              type="button"
              onClick={() => setSelectedDay('ALL')}
              className={`px-3 py-1.5 rounded-xl font-bold transition cursor-pointer ${
                selectedDay === 'ALL'
                  ? 'bg-amber-500 text-black shadow-md'
                  : 'text-neutral-400 hover:text-white'
              }`}
            >
              All Days
            </button>
          </div>

          {/* Sub-tab Navigation */}
          <div className="flex items-center gap-1 p-1 rounded-2xl bg-white/5 border border-white/10 font-sans text-xs">
            <button
              type="button"
              onClick={() => setActiveTab('MOTIONS')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl font-semibold transition cursor-pointer ${
                activeTab === 'MOTIONS' ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/30' : 'text-neutral-400 hover:text-white'
              }`}
            >
              <Vote className="w-3.5 h-3.5" />
              <span>Motions ({filteredMotions.length})</span>
            </button>
            <button
              type="button"
              onClick={() => setActiveTab('SPEAKERS')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl font-semibold transition cursor-pointer ${
                activeTab === 'SPEAKERS' ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/30' : 'text-neutral-400 hover:text-white'
              }`}
            >
              <Mic2 className="w-3.5 h-3.5" />
              <span>GSL & Speeches ({filteredSpeakers.length})</span>
            </button>
            <button
              type="button"
              onClick={() => setActiveTab('BILLS')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl font-semibold transition cursor-pointer ${
                activeTab === 'BILLS' ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/30' : 'text-neutral-400 hover:text-white'
              }`}
            >
              <FileCheck2 className="w-3.5 h-3.5" />
              <span>Passed Bills ({filteredBills.length})</span>
            </button>
          </div>
        </div>

        {/* Quick Stats Strip */}
        <div className="grid grid-cols-3 gap-3 relative z-10 font-mono text-xs">
          <div className="p-3 rounded-2xl bg-white/[0.02] border border-white/5 flex items-center justify-between">
            <span className="text-neutral-400">Total Motions:</span>
            <span className="font-bold text-white text-sm">{filteredMotions.length}</span>
          </div>
          <div className="p-3 rounded-2xl bg-white/[0.02] border border-white/5 flex items-center justify-between">
            <span className="text-emerald-400">Motions Passed:</span>
            <span className="font-bold text-emerald-300 text-sm">{passedMotions}</span>
          </div>
          <div className="p-3 rounded-2xl bg-white/[0.02] border border-white/5 flex items-center justify-between">
            <span className="text-cyan-400">Speeches Delivered:</span>
            <span className="font-bold text-cyan-300 text-sm">{totalSpeeches}</span>
          </div>
        </div>

        {/* Main Content Area */}
        <div className="flex-1 overflow-y-auto space-y-3 pr-1 relative z-10">
          
          {/* TAB 1: MOTIONS */}
          {activeTab === 'MOTIONS' && (
            <div className="space-y-2.5">
              {filteredMotions.length === 0 ? (
                <div className="py-12 text-center text-neutral-500 font-sans text-xs space-y-2">
                  <Vote className="w-8 h-8 mx-auto text-neutral-600" />
                  <p>No motions recorded for {selectedDay === 'ALL' ? 'any day' : `Day ${selectedDay}`} yet.</p>
                  <p className="text-[11px] text-neutral-600">Raise and conclude a caucus motion from the chamber dais to generate logs.</p>
                </div>
              ) : (
                filteredMotions.map((motion, idx) => (
                  <div
                    key={motion.id || idx}
                    className="p-4 rounded-2xl bg-white/5 border border-white/10 hover:border-white/20 transition flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-left"
                  >
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded-full bg-cyan-500/20 text-cyan-300">
                          {motion.type.replace('_', ' ')}
                        </span>
                        <span className="text-[10px] font-mono text-neutral-400">
                          Day {motion.day || 1}
                        </span>
                        {motion.proposedBy && (
                          <span className="text-[11px] text-neutral-300 font-sans">
                            by <span className="font-semibold text-white">
                              {typeof motion.proposedBy === 'object' ? (motion.proposedBy.portfolio || motion.proposedBy.userName) : motion.proposedBy}
                            </span>
                          </span>
                        )}
                      </div>
                      <h4 className="font-bold text-sm text-white">{motion.topic}</h4>
                      <div className="flex items-center gap-3 text-xs text-neutral-400 font-mono">
                        <span>Total: {motion.totalMinutes}m</span>
                        <span>&bull;</span>
                        <span>Individual: {motion.individualSpeakerSeconds}s</span>
                      </div>
                    </div>

                    <div className="shrink-0 flex items-center gap-2">
                      {String(motion.verdict).toUpperCase() === 'PASSED' ? (
                        <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-mono font-bold bg-emerald-500/20 text-emerald-300 border border-emerald-500/40">
                          <CheckCircle2 className="w-3.5 h-3.5" />
                          <span>PASSED</span>
                        </span>
                      ) : String(motion.verdict).toUpperCase() === 'FAILED' ? (
                        <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-mono font-bold bg-rose-500/20 text-rose-300 border border-rose-500/40">
                          <XCircle className="w-3.5 h-3.5" />
                          <span>FAILED</span>
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-mono font-bold bg-amber-500/20 text-amber-300 border border-amber-500/40">
                          <Clock className="w-3.5 h-3.5" />
                          <span>RECORDED</span>
                        </span>
                      )}
                    </div>
                  </div>
                ))
              )}
            </div>
          )}

          {/* TAB 2: SPEAKERS & GSL */}
          {activeTab === 'SPEAKERS' && (
            <div className="space-y-2.5">
              {filteredSpeakers.length === 0 ? (
                <div className="py-12 text-center text-neutral-500 font-sans text-xs space-y-2">
                  <Mic2 className="w-8 h-8 mx-auto text-neutral-600" />
                  <p>No speaker speeches logged for {selectedDay === 'ALL' ? 'any day' : `Day ${selectedDay}`} yet.</p>
                  <p className="text-[11px] text-neutral-600">Recognize delegates on the GSL or caucus to automatically record speeches.</p>
                </div>
              ) : (
                filteredSpeakers.map((speaker, idx) => (
                  <div
                    key={speaker.id || idx}
                    className="p-3.5 rounded-2xl bg-white/5 border border-white/10 hover:border-white/20 transition flex items-center justify-between gap-3 text-left"
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-xl bg-amber-500/10 border border-amber-500/20 text-amber-300 font-mono font-bold flex items-center justify-center text-xs">
                        #{idx + 1}
                      </div>
                      <div>
                        <div className="font-bold text-sm text-white flex items-center gap-2">
                          <span>{speaker.portfolio}</span>
                          <span className="text-[10px] font-mono px-2 py-0.2 rounded-full bg-white/10 text-neutral-300">
                            Day {speaker.day || 1}
                          </span>
                        </div>
                        <div className="text-xs text-neutral-400 font-sans">
                          {speaker.delegateName || 'Delegate'} &bull; {speaker.hasSpoken ? 'Speech Concluded' : 'On Floor'}
                        </div>
                      </div>
                    </div>

                    <div className="text-right font-mono text-xs">
                      {speaker.yieldType && (
                        <span className="text-[10px] px-2 py-0.5 rounded-full bg-cyan-500/10 text-cyan-300 border border-cyan-500/20">
                          Yield: {speaker.yieldType.replace('_', ' ')}
                        </span>
                      )}
                      <div className="text-neutral-400 text-[11px] mt-0.5">
                        Allotted: {speaker.speakingSeconds}s
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>
          )}

          {/* TAB 3: PASSED BILLS / RESOLUTIONS */}
          {activeTab === 'BILLS' && (
            <div className="space-y-2.5">
              {filteredBills.length === 0 ? (
                <div className="py-12 text-center text-neutral-500 font-sans text-xs space-y-2">
                  <FileCheck2 className="w-8 h-8 mx-auto text-neutral-600" />
                  <p>No statutory bills or draft resolutions passed on {selectedDay === 'ALL' ? 'any day' : `Day ${selectedDay}`} yet.</p>
                  <p className="text-[11px] text-neutral-600">Draft and pass a bill via ZEN.LEGISLATE / ZEN.DOCS to archive here and in /solutions.</p>
                </div>
              ) : (
                filteredBills.map((bill, idx) => (
                  <div
                    key={bill.id || idx}
                    className="p-4 rounded-2xl bg-gradient-to-r from-amber-500/10 to-transparent border border-amber-500/30 hover:border-amber-400/50 transition space-y-2 text-left"
                  >
                    <div className="flex items-center justify-between">
                      <span className="text-[10px] font-mono font-bold px-2.5 py-0.5 rounded-full bg-amber-500/20 text-amber-300 border border-amber-500/30">
                        {bill.code} &bull; DAY {bill.day || 1}
                      </span>
                      <span className="text-[11px] font-mono text-emerald-400 font-semibold flex items-center gap-1">
                        <CheckCircle2 className="w-3.5 h-3.5" />
                        <span>ENACTED INTO LAW / SOVEREIGN ARCHIVES</span>
                      </span>
                    </div>
                    <h4 className="font-bold text-base text-white">{bill.title}</h4>
                    <p className="text-xs text-neutral-300 font-sans line-clamp-2">{bill.summary}</p>
                    {bill.sponsors && bill.sponsors.length > 0 && (
                      <div className="text-[11px] font-mono text-neutral-400">
                        Lead Sponsors: <span className="text-white">{bill.sponsors.join(', ')}</span>
                      </div>
                    )}
                  </div>
                ))
              )}
            </div>
          )}

        </div>

        {/* Footer */}
        <div className="pt-3 border-t border-white/10 flex items-center justify-between text-xs text-neutral-400 font-mono">
          <span>Active Conference: {activeConference?.shortName || 'MUN 2026'}</span>
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 rounded-xl bg-white/10 hover:bg-white/20 text-white font-bold transition cursor-pointer"
          >
            Close Logs
          </button>
        </div>

      </div>
    </div>
  );
}
