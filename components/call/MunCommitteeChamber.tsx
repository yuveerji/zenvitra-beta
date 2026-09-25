'use client';

import React, { useState, useEffect } from 'react';
import { 
  Gavel, 
  Clock, 
  Timer, 
  Users, 
  Plus, 
  Play, 
  Pause, 
  RotateCcw, 
  Check, 
  X, 
  Vote, 
  ShieldAlert, 
  Award,
  ChevronRight
} from 'lucide-react';
import { MunSpeakerItem, MunMotionItem } from '@/types/call';

interface MunCommitteeChamberProps {
  committeeName?: string;
  isChair?: boolean;
}

export function MunCommitteeChamber({
  committeeName = 'United Nations Security Council',
  isChair = true,
}: MunCommitteeChamberProps) {
  // GSL (General Speaker's List) - Starts empty, populated dynamically by session delegates
  const [speakers, setSpeakers] = useState<MunSpeakerItem[]>([]);

  const [gslTimerRunning, setGslTimerRunning] = useState(false);
  const [activeSpeakerTime, setActiveSpeakerTime] = useState(90);

  // Caucus Timer
  const [caucusMode, setCaucusMode] = useState<'MODERATED' | 'UNMODERATED' | 'CONSULTATION'>('MODERATED');
  const [caucusTopic, setCaucusTopic] = useState('');
  const [caucusTotalTime, setCaucusTotalTime] = useState(600); // 10 mins in seconds
  const [caucusTimeLeft, setCaucusTimeLeft] = useState(600);
  const [caucusRunning, setCaucusRunning] = useState(false);

  // Motions - Starts empty, introduced dynamically during session
  const [motions, setMotions] = useState<MunMotionItem[]>([]);

  // GSL Timer interval
  useEffect(() => {
    if (!gslTimerRunning) return;
    const interval = setInterval(() => {
      setActiveSpeakerTime((prev) => {
        if (prev <= 1) {
          setGslTimerRunning(false);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
    return () => clearInterval(interval);
  }, [gslTimerRunning]);

  // Caucus Timer interval
  useEffect(() => {
    if (!caucusRunning) return;
    const interval = setInterval(() => {
      setCaucusTimeLeft((prev) => {
        if (prev <= 1) {
          setCaucusRunning(false);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
    return () => clearInterval(interval);
  }, [caucusRunning]);

  const formatTimer = (sec: number) => {
    const m = Math.floor(sec / 60);
    const s = sec % 60;
    return `${m}:${s < 10 ? '0' : ''}${s}`;
  };

  const nextSpeaker = () => {
    setGslTimerRunning(false);
    setActiveSpeakerTime(90);
    setSpeakers((prev) => {
      if (prev.length <= 1) return prev;
      const [current, ...rest] = prev;
      return [...rest, { ...current, isSpeaking: false }].map((item, idx) => ({
        ...item,
        isSpeaking: idx === 0,
      }));
    });
  };

  const handleVoteMotion = (motionId: string, voteType: 'for' | 'against') => {
    setMotions((prev) =>
      prev.map((m) => {
        if (m.id !== motionId) return m;
        const newFor = voteType === 'for' ? m.votesFor + 1 : m.votesFor;
        const newAgainst = voteType === 'against' ? m.votesAgainst + 1 : m.votesAgainst;
        const passed = newFor > 7; // simple majority of 15 members
        return {
          ...m,
          votesFor: newFor,
          votesAgainst: newAgainst,
          status: passed ? 'PASSED' : m.status,
        };
      })
    );
  };

  return (
    <div className="h-full flex flex-col bg-[#070912] border-l border-white/10 text-white font-sans overflow-y-auto no-scrollbar">
      {/* ── HEADER ── */}
      <div className="p-4 border-b border-white/10 bg-black/40 flex items-center justify-between">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-xl bg-amber-500/20 border border-amber-500/40 flex items-center justify-center text-amber-400">
            <Gavel className="w-4 h-4" />
          </div>
          <div>
            <h3 className="text-xs font-bold font-mono uppercase tracking-wider text-white">
              MUN COMMITTEE CHAMBER
            </h3>
            <p className="text-[10px] text-amber-300 font-mono truncate">{committeeName}</p>
          </div>
        </div>
        {isChair && (
          <span className="px-2 py-0.5 rounded text-[9px] font-mono font-bold bg-amber-500/20 text-amber-300 border border-amber-500/30">
            CHAIR CONTROLS
          </span>
        )}
      </div>

      {/* ── SECTION 1: GENERAL SPEAKER'S LIST (GSL) ── */}
      <div className="p-4 border-b border-white/10 space-y-3 bg-black/20">
        <div className="flex items-center justify-between">
          <span className="text-[11px] font-mono uppercase tracking-wider font-bold text-zinc-300 flex items-center gap-1.5">
            <Users className="w-3.5 h-3.5 text-cyan-400" />
            <span>General Speaker's List</span>
          </span>
          <span className="text-[10px] font-mono text-zinc-400">{speakers.length} Delegates Queued</span>
        </div>

        {speakers.length === 0 ? (
          <div className="p-4 rounded-xl border border-dashed border-white/10 bg-white/[0.02] text-center space-y-1">
            <p className="text-xs text-neutral-400">No delegates on the Speaker&apos;s List.</p>
            <p className="text-[10px] font-mono text-neutral-500">Delegates can request the floor to speak.</p>
          </div>
        ) : (
          /* Active Speaker Spotlight Box */
          <div className="p-3 rounded-2xl bg-gradient-to-r from-amber-500/10 via-black to-cyan-500/10 border border-amber-500/30 space-y-2">
            <div className="flex items-center justify-between">
              <div>
                <span className="text-sm font-bold text-white block">{speakers[0].country}</span>
                <span className="text-[10px] text-zinc-400 font-mono">{speakers[0].delegateName}</span>
              </div>
              <div className="text-right">
                <span className="font-mono text-xl font-bold text-amber-400">
                  {formatTimer(activeSpeakerTime)}
                </span>
                <span className="text-[9px] font-mono text-zinc-500 block">Remaining</span>
              </div>
            </div>

            {/* GSL Controls */}
            {isChair && (
              <div className="flex items-center gap-1.5 pt-1">
                <button
                  type="button"
                  onClick={() => setGslTimerRunning(!gslTimerRunning)}
                  className="flex-1 py-1.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-black font-mono font-bold text-xs flex items-center justify-center gap-1 transition cursor-pointer"
                >
                  {gslTimerRunning ? <Pause className="w-3.5 h-3.5" /> : <Play className="w-3.5 h-3.5" />}
                  <span>{gslTimerRunning ? 'Pause Speaker' : 'Start Speech'}</span>
                </button>

                <button
                  type="button"
                  onClick={nextSpeaker}
                  className="px-3 py-1.5 rounded-xl bg-white/10 hover:bg-white/20 text-white font-mono text-xs transition cursor-pointer"
                  title="Next Speaker"
                >
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>
            )}
          </div>
        )}

        {/* Up Next List */}
        {speakers.length > 1 && (
          <div className="space-y-1">
            <span className="text-[9px] font-mono uppercase tracking-wider text-zinc-500 block">Next in Queue</span>
            {speakers.slice(1, 4).map((spk, idx) => (
              <div
                key={spk.id}
                className="px-2.5 py-1.5 rounded-xl bg-white/[0.03] border border-white/5 flex items-center justify-between text-xs"
              >
                <div className="flex items-center gap-2">
                  <span className="text-[10px] font-mono text-zinc-500">#{idx + 2}</span>
                  <span className="font-semibold text-zinc-200">{spk.country}</span>
                </div>
                <span className="text-[10px] font-mono text-zinc-500">90s</span>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* ── SECTION 2: CAUCUS CLOCK ── */}
      <div className="p-4 border-b border-white/10 space-y-3 bg-black/30">
        <div className="flex items-center justify-between">
          <span className="text-[11px] font-mono uppercase tracking-wider font-bold text-zinc-300 flex items-center gap-1.5">
            <Timer className="w-3.5 h-3.5 text-rose-400" />
            <span>Caucus Debate Session</span>
          </span>
          <span className="text-[10px] font-mono font-bold px-1.5 py-0.5 rounded bg-rose-500/20 text-rose-300 border border-rose-500/30">
            {caucusMode}
          </span>
        </div>

        <div className="p-3 rounded-2xl bg-black border border-white/10 space-y-2">
          <input
            type="text"
            value={caucusTopic}
            onChange={(e) => setCaucusTopic(e.target.value)}
            disabled={!isChair}
            className="w-full bg-transparent border-b border-white/10 pb-1 text-xs text-white font-medium focus:outline-none focus:border-rose-400"
          />

          <div className="flex items-center justify-between">
            <span className="text-2xl font-mono font-bold text-white tracking-widest">
              {formatTimer(caucusTimeLeft)}
            </span>
            {isChair && (
              <div className="flex items-center gap-1">
                <button
                  type="button"
                  onClick={() => setCaucusRunning(!caucusRunning)}
                  className="p-2 rounded-xl bg-rose-500 hover:bg-rose-400 text-white transition cursor-pointer"
                >
                  {caucusRunning ? <Pause className="w-3.5 h-3.5" /> : <Play className="w-3.5 h-3.5" />}
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setCaucusRunning(false);
                    setCaucusTimeLeft(caucusTotalTime);
                  }}
                  className="p-2 rounded-xl bg-white/10 hover:bg-white/20 text-zinc-300 transition cursor-pointer"
                >
                  <RotateCcw className="w-3.5 h-3.5" />
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* ── SECTION 3: MOTIONS & VOTING PROCEDURE ── */}
      <div className="p-4 space-y-3 flex-1">
        <div className="flex items-center justify-between">
          <span className="text-[11px] font-mono uppercase tracking-wider font-bold text-zinc-300 flex items-center gap-1.5">
            <Vote className="w-3.5 h-3.5 text-emerald-400" />
            <span>Chamber Motions ({motions.length})</span>
          </span>
        </div>

        <div className="space-y-2">
          {motions.length === 0 ? (
            <div className="p-4 rounded-xl border border-dashed border-white/10 bg-white/[0.02] text-center space-y-1">
              <p className="text-xs text-neutral-400">No active caucus motions on the floor.</p>
              <p className="text-[10px] font-mono text-neutral-500">Delegates can table procedural caucus motions.</p>
            </div>
          ) : (
            motions.map((motion) => (
              <div
                key={motion.id}
                className="p-3 rounded-2xl bg-black/60 border border-white/10 space-y-2"
              >
                <div className="flex items-start justify-between gap-2">
                  <div>
                    <span className="text-[10px] font-mono text-zinc-400">{motion.proposer} moves for</span>
                    <p className="text-xs font-bold text-white font-display leading-tight">{motion.topic}</p>
                  </div>
                  <span
                    className={`text-[9px] font-mono font-bold px-1.5 py-0.5 rounded uppercase ${
                      motion.status === 'PASSED'
                        ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'
                        : 'bg-amber-500/20 text-amber-300 border border-amber-500/30'
                    }`}
                  >
                    {motion.status}
                  </span>
                </div>

                <div className="flex items-center justify-between pt-1 border-t border-white/5 text-[10px] font-mono">
                  <span className="text-zinc-400">
                    {motion.totalTime}m Total • {motion.speakingTime}s Speaking
                  </span>
                  <div className="flex items-center gap-1.5">
                    <button
                      type="button"
                      onClick={() => handleVoteMotion(motion.id, 'for')}
                      className="px-2 py-0.5 rounded bg-emerald-500/20 hover:bg-emerald-500/30 text-emerald-300 border border-emerald-500/30 cursor-pointer"
                    >
                      Aye ({motion.votesFor})
                    </button>
                    <button
                      type="button"
                      onClick={() => handleVoteMotion(motion.id, 'against')}
                      className="px-2 py-0.5 rounded bg-rose-500/20 hover:bg-rose-500/30 text-rose-300 border border-rose-500/30 cursor-pointer"
                    >
                      Nay ({motion.votesAgainst})
                    </button>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}

