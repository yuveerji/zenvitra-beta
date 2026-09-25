'use client';

import React from 'react';
import { Crown, Mic, Clock, Users, Flame, FileText, CheckCircle2, Radio } from 'lucide-react';

interface SpeakerQueueItem {
  country: string;
  flag: string;
  delegate: string;
  timeRemaining: string;
  status: 'SPEAKING' | 'NEXT' | 'QUEUED';
}

import { useMun } from '@/context/MunContext';

export function LiveSpeakerQueue() {
  const { sessionState, joinSpeakersList } = useMun();
  const speakers = sessionState?.speakersList || [];
  const currentSpeaker = speakers.find((s) => s.status === 'speaking') || speakers[0];
  const upcomingSpeakers = speakers.filter((s) => s.id !== currentSpeaker?.id);

  if (!currentSpeaker) {
    return (
      <div className="rounded-3xl bg-[#06070a]/95 border border-white/[0.08] p-6 space-y-4 backdrop-blur-2xl shadow-2xl text-left">
        <div className="flex items-center justify-between border-b border-white/[0.06] pb-3">
          <div className="flex items-center gap-2">
            <Mic className="w-4 h-4 text-amber-400" />
            <span className="font-mono text-xs font-bold uppercase tracking-widest text-white">
              GENERAL SPEAKERS LIST (GSL) // LIVE DAIS QUEUE
            </span>
          </div>
          <span className="px-2.5 py-0.5 rounded-full bg-white/5 border border-white/10 text-neutral-400 font-mono text-[10px] font-bold">
            0 IN QUEUE
          </span>
        </div>
        <div className="p-8 rounded-2xl bg-white/[0.02] border border-white/5 text-center space-y-3">
          <Mic className="w-8 h-8 text-neutral-600 mx-auto" />
          <p className="text-xs text-neutral-400 font-mono">
            No delegates are currently queued on the GSL floor.
          </p>
          <button
            type="button"
            onClick={() => joinSpeakersList()}
            className="px-4 py-2 rounded-xl bg-amber-500 hover:bg-amber-400 text-black font-mono text-xs font-bold transition cursor-pointer shadow-md inline-flex items-center gap-1.5"
          >
            <span>Join Speakers List</span>
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="rounded-3xl bg-[#06070a]/95 border border-white/[0.08] p-6 space-y-6 backdrop-blur-2xl shadow-2xl text-left">
      <div className="flex items-center justify-between border-b border-white/[0.06] pb-3">
        <div className="flex items-center gap-2">
          <Mic className="w-4 h-4 text-amber-400 animate-pulse" />
          <span className="font-mono text-xs font-bold uppercase tracking-widest text-white">
            GENERAL SPEAKERS LIST (GSL) // LIVE DAIS QUEUE
          </span>
        </div>
        <span className="px-2.5 py-0.5 rounded-full bg-amber-500/10 border border-amber-500/30 text-amber-300 font-mono text-[10px] font-bold">
          {speakers.length.toString().padStart(2, '0')} IN QUEUE
        </span>
      </div>

      {/* Hero Speaker in Dais */}
      <div className="p-6 rounded-2xl bg-gradient-to-r from-amber-500/[0.08] via-amber-500/[0.02] to-transparent border border-amber-500/25 space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <span className="text-3xl">🏛️</span>
            <div>
              <span className="font-mono text-[10px] tracking-widest text-amber-400 uppercase font-bold block">
                CURRENT RECOGNIZED SPEAKER
              </span>
              <h4 className="font-display font-bold text-xl text-white">
                {currentSpeaker.portfolio}
              </h4>
              <span className="text-xs font-outfit text-neutral-400">
                {currentSpeaker.delegateName}
              </span>
            </div>
          </div>

          <div className="text-right font-mono">
            <div className="text-2xl sm:text-3xl font-black text-amber-300 tabular-nums">
              {Math.floor((currentSpeaker.timeRemainingSeconds || 90) / 60)}:
              {((currentSpeaker.timeRemainingSeconds || 90) % 60).toString().padStart(2, '0')}
            </div>
            <span className="text-[10px] text-neutral-500 uppercase">SECONDS REMAINING</span>
          </div>
        </div>

        {/* Progress Bar */}
        <div className="h-1.5 w-full bg-black/40 rounded-full overflow-hidden">
          <div 
            className="h-full bg-amber-400 rounded-full transition-all duration-300"
            style={{ width: `${Math.min(100, Math.max(5, ((currentSpeaker.timeRemainingSeconds || 90) / 90) * 100))}%` }}
          />
        </div>
      </div>

      {/* Next In Line */}
      {upcomingSpeakers.length > 0 && (
        <div className="space-y-2">
          <span className="font-mono text-[10px] text-neutral-500 tracking-widest uppercase block">
            RECOGNIZED NEXT IN LINE
          </span>
          <div className="space-y-1.5">
            {upcomingSpeakers.map((spk, idx) => (
              <div
                key={spk.id || idx}
                className="flex items-center justify-between p-3 rounded-xl bg-white/[0.02] border border-white/[0.04] text-xs font-outfit"
              >
                <div className="flex items-center gap-2.5">
                  <span className="text-lg">📍</span>
                  <span className="text-white font-medium">{spk.portfolio}</span>
                  <span className="text-neutral-500 text-[11px]">• {spk.delegateName}</span>
                </div>
                <div className="flex items-center gap-3 font-mono text-[11px]">
                  <span className="text-neutral-500">
                    {Math.floor((spk.timeRemainingSeconds || 90) / 60)}:
                    {((spk.timeRemainingSeconds || 90) % 60).toString().padStart(2, '0')}
                  </span>
                  <span
                    className={`px-2 py-0.5 rounded text-[9px] font-bold uppercase ${
                      idx === 0
                        ? 'bg-amber-400/20 text-amber-300 border border-amber-400/40'
                        : 'bg-white/5 text-neutral-400'
                    }`}
                  >
                    {idx === 0 ? 'NEXT' : 'QUEUED'}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
