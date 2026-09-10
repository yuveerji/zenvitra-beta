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

const SAMPLE_QUEUE: SpeakerQueueItem[] = [
  { country: 'Republic of India', flag: '🇮🇳', delegate: 'Delegate Yuveer', timeRemaining: '01:24', status: 'SPEAKING' },
  { country: 'French Republic', flag: '🇫🇷', delegate: 'Delegate Camille', timeRemaining: '01:30', status: 'NEXT' },
  { country: 'State of Japan', flag: '🇯🇵', delegate: 'Delegate Kenji', timeRemaining: '01:30', status: 'QUEUED' },
  { country: 'Federative Republic of Brazil', flag: '🇧🇷', delegate: 'Delegate Sofia', timeRemaining: '01:30', status: 'QUEUED' },
  { country: 'United Kingdom', flag: '🇬🇧', delegate: 'Delegate Arthur', timeRemaining: '01:30', status: 'QUEUED' },
];

export function LiveSpeakerQueue() {
  const currentSpeaker = SAMPLE_QUEUE[0];
  const upcomingSpeakers = SAMPLE_QUEUE.slice(1);

  return (
    <div className="rounded-3xl bg-[#06070a]/95 border border-white/[0.08] p-6 space-y-6 backdrop-blur-2xl shadow-2xl">
      <div className="flex items-center justify-between border-b border-white/[0.06] pb-3">
        <div className="flex items-center gap-2">
          <Mic className="w-4 h-4 text-amber-400 animate-pulse" />
          <span className="font-mono text-xs font-bold uppercase tracking-widest text-white">
            GENERAL SPEAKERS LIST (GSL) // LIVE DAIS QUEUE
          </span>
        </div>
        <span className="px-2.5 py-0.5 rounded-full bg-amber-500/10 border border-amber-500/30 text-amber-300 font-mono text-[10px] font-bold">
          05 IN QUEUE
        </span>
      </div>

      {/* Hero Speaker in Dais */}
      <div className="p-6 rounded-2xl bg-gradient-to-r from-amber-500/[0.08] via-amber-500/[0.02] to-transparent border border-amber-500/25 space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <span className="text-3xl">{currentSpeaker.flag}</span>
            <div>
              <span className="font-mono text-[10px] tracking-widest text-amber-400 uppercase font-bold block">
                CURRENT RECOGNIZED SPEAKER
              </span>
              <h4 className="font-display font-bold text-xl text-white">
                {currentSpeaker.country}
              </h4>
              <span className="text-xs font-outfit text-neutral-400">
                {currentSpeaker.delegate}
              </span>
            </div>
          </div>

          <div className="text-right font-mono">
            <div className="text-2xl sm:text-3xl font-black text-amber-300 tabular-nums">
              {currentSpeaker.timeRemaining}
            </div>
            <span className="text-[10px] text-neutral-500 uppercase">SECONDS REMAINING</span>
          </div>
        </div>

        {/* Progress Bar */}
        <div className="h-1.5 w-full bg-black/40 rounded-full overflow-hidden">
          <div className="h-full bg-amber-400 rounded-full w-[65%]" />
        </div>
      </div>

      {/* Next In Line */}
      <div className="space-y-2">
        <span className="font-mono text-[10px] text-neutral-500 tracking-widest uppercase block">
          RECOGNIZED NEXT IN LINE
        </span>
        <div className="space-y-1.5">
          {upcomingSpeakers.map((spk, idx) => (
            <div
              key={idx}
              className="flex items-center justify-between p-3 rounded-xl bg-white/[0.02] border border-white/[0.04] text-xs font-outfit"
            >
              <div className="flex items-center gap-2.5">
                <span className="text-lg">{spk.flag}</span>
                <span className="text-white font-medium">{spk.country}</span>
                <span className="text-neutral-500 text-[11px]">• {spk.delegate}</span>
              </div>
              <div className="flex items-center gap-3 font-mono text-[11px]">
                <span className="text-neutral-500">{spk.timeRemaining}</span>
                <span
                  className={`px-2 py-0.5 rounded text-[9px] font-bold uppercase ${
                    spk.status === 'NEXT'
                      ? 'bg-amber-400/20 text-amber-300 border border-amber-400/40'
                      : 'bg-white/5 text-neutral-400'
                  }`}
                >
                  {spk.status}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
