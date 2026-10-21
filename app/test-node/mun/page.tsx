'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { 
  Radio, 
  Users, 
  Clock, 
  Gavel, 
  FileText, 
  Vote, 
  Plus, 
  CheckCircle2, 
  Play, 
  Pause, 
  RotateCcw,
  Sparkles,
  Award,
  ChevronRight,
  Globe2,
  ShieldCheck,
  Send
} from 'lucide-react';
import { TestNodeProvider, useTestNode } from '@/context/TestNodeContext';
import { TestNodeShell } from '@/components/test-node/TestNodeShell';
import { daisAudio } from '@/lib/daisAudio';

function TestMunContent() {
  const { 
    conference, 
    committees, 
    delegates, 
    motions, 
    documents, 
    activePersona, 
    raiseMotion, 
    castVote 
  } = useTestNode();

  const [activeCommId, setActiveCommId] = useState(committees[0].id);
  const activeCommittee = committees.find((c) => c.id === activeCommId) || committees[0];

  // Chamber Floor Timer State
  const [timerSeconds, setTimerSeconds] = useState(60);
  const [isTimerRunning, setIsTimerRunning] = useState(false);
  const [gavelActive, setGavelActive] = useState(false);

  // New Motion Form State
  const [showMotionForm, setShowMotionForm] = useState(false);
  const [motionTopic, setMotionTopic] = useState('');
  const [motionTotalMins, setMotionTotalMins] = useState(10);
  const [motionSpeakerSecs, setMotionSpeakerSecs] = useState(60);

  // Gavel Strike Action
  const handleStrikeGavel = () => {
    daisAudio.playDoubleGavel();
    setGavelActive(true);
    setTimeout(() => setGavelActive(false), 2000);
  };

  // Timer Tick
  React.useEffect(() => {
    let interval: any = null;
    if (isTimerRunning && timerSeconds > 0) {
      interval = setInterval(() => setTimerSeconds((s) => s - 1), 1000);
    } else if (timerSeconds === 0 && isTimerRunning) {
      setIsTimerRunning(false);
      handleStrikeGavel();
    }
    return () => clearInterval(interval);
  }, [isTimerRunning, timerSeconds]);

  const handleRaiseMotionSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!motionTopic.trim()) return;
    raiseMotion(activeCommittee.id, motionTopic.trim(), motionTotalMins, motionSpeakerSecs);
    setMotionTopic('');
    setShowMotionForm(false);
  };

  const commDelegates = delegates.filter((d) => d.committeeId === activeCommittee.id);
  const commMotions = motions.filter((m) => m.committeeId === activeCommittee.id);
  const commDocs = documents.filter((d) => d.committee === activeCommittee.name);

  return (
    <div className="space-y-8">
      {/* ── 1. CONFERENCE HEADER ── */}
      <div className="p-6 sm:p-8 rounded-3xl bg-gradient-to-r from-[#0d1428] via-[#080d1a] to-black border border-cyan-500/30 relative overflow-hidden space-y-4">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <span className="px-3 py-1 rounded-full bg-cyan-500/15 border border-cyan-500/30 text-cyan-300 font-mono text-[10px] font-bold uppercase tracking-wider">
                ZEN.MUN // DEMO SESSION
              </span>
              <span className="px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 text-[10px] font-mono font-bold">
                100% SIMULATED
              </span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-black text-white uppercase font-display">
              {conference.name}
            </h1>
            <p className="text-xs font-mono text-neutral-400">
              {conference.venue} &bull; {conference.city} &bull; {conference.tagline}
            </p>
          </div>

          {/* Quick Gavel Strike */}
          <button
            type="button"
            onClick={handleStrikeGavel}
            className={`px-4 py-2.5 rounded-2xl font-mono text-xs font-bold transition flex items-center gap-2 cursor-pointer shadow-lg ${
              gavelActive
                ? 'bg-amber-400 text-black scale-105'
                : 'bg-white/10 hover:bg-white/20 text-white border border-white/15'
            }`}
          >
            <Gavel className="w-4 h-4 text-amber-400" />
            <span>{gavelActive ? '🔨 GAVEL STRUCK!' : 'Strike Dais Gavel'}</span>
          </button>
        </div>

        {/* Committee Chamber Selector Pills */}
        <div className="flex items-center gap-2 overflow-x-auto pt-3 border-t border-white/10 font-mono text-xs no-scrollbar">
          {committees.map((comm) => (
            <button
              key={comm.id}
              type="button"
              onClick={() => {
                setActiveCommId(comm.id);
                setTimerSeconds(60);
                setIsTimerRunning(false);
              }}
              className={`px-3.5 py-2 rounded-xl transition cursor-pointer shrink-0 font-bold ${
                activeCommId === comm.id
                  ? 'bg-cyan-500 text-black shadow-[0_0_15px_rgba(6,182,212,0.3)]'
                  : 'bg-white/5 hover:bg-white/10 text-neutral-300 border border-white/10'
              }`}
            >
              <span>{comm.shortName}</span>
              <span className="ml-1.5 opacity-60 text-[10px]">({comm.totalSeats})</span>
            </button>
          ))}
        </div>
      </div>

      {/* ── 2. ACTIVE CHAMBER FLOOR & AGENDA ── */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Left: Speaker Timer & Caucus Controls (5 Cols) */}
        <div className="lg:col-span-5 p-6 rounded-3xl bg-[#080d1c] border border-white/15 space-y-6">
          <div className="space-y-1">
            <div className="flex items-center justify-between text-xs font-mono">
              <span className="text-cyan-400 font-bold uppercase">{activeCommittee.shortName} DAIS CONSOLE</span>
              <span className="text-neutral-400">Quorum: {activeCommittee.presentCount}/{activeCommittee.totalSeats}</span>
            </div>
            <h2 className="text-lg font-bold text-white font-display leading-snug">
              {activeCommittee.agenda}
            </h2>
          </div>

          {/* Interactive Speaker Timer Clock */}
          <div className="p-6 rounded-2xl bg-black/60 border border-cyan-500/30 text-center space-y-4 shadow-inner">
            <div className="text-[10px] font-mono text-neutral-400 uppercase tracking-widest font-bold">
              CURRENT SPEAKER TIME
            </div>
            <div className="text-5xl sm:text-6xl font-black font-mono text-cyan-300 tracking-tight">
              00:{timerSeconds.toString().padStart(2, '0')}
            </div>

            <div className="flex items-center justify-center gap-2 pt-2">
              <button
                type="button"
                onClick={() => setIsTimerRunning(!isTimerRunning)}
                className={`px-5 py-2 rounded-xl font-mono text-xs font-bold transition flex items-center gap-1.5 cursor-pointer ${
                  isTimerRunning
                    ? 'bg-amber-500 text-black hover:bg-amber-400'
                    : 'bg-emerald-500 text-black hover:bg-emerald-400'
                }`}
              >
                {isTimerRunning ? <Pause className="w-3.5 h-3.5" /> : <Play className="w-3.5 h-3.5" />}
                <span>{isTimerRunning ? 'Pause' : 'Start Timer'}</span>
              </button>

              <button
                type="button"
                onClick={() => {
                  setIsTimerRunning(false);
                  setTimerSeconds(60);
                }}
                className="p-2 rounded-xl bg-white/10 hover:bg-white/20 text-neutral-300 transition cursor-pointer"
                title="Reset to 60s"
              >
                <RotateCcw className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Raise Motion Trigger */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-mono text-white font-bold uppercase">Floor Motions Queue</span>
              <button
                type="button"
                onClick={() => setShowMotionForm(!showMotionForm)}
                className="px-2.5 py-1 rounded-lg bg-cyan-500/20 hover:bg-cyan-500/30 border border-cyan-500/40 text-cyan-300 text-[10px] font-mono font-bold flex items-center gap-1 cursor-pointer"
              >
                <Plus className="w-3 h-3" />
                <span>+ Raise Motion</span>
              </button>
            </div>

            {showMotionForm && (
              <form onSubmit={handleRaiseMotionSubmit} className="p-4 rounded-2xl bg-white/5 border border-cyan-500/40 space-y-3 text-xs font-mono">
                <div>
                  <label className="text-[10px] text-neutral-400 uppercase block mb-1">Motion Topic</label>
                  <input
                    type="text"
                    value={motionTopic}
                    onChange={(e) => setMotionTopic(e.target.value)}
                    placeholder="e.g. Surveillance drone protocol safeguards..."
                    className="w-full bg-[#111422] border border-white/15 rounded-xl px-3 py-2 text-white focus:outline-none focus:border-cyan-400"
                  />
                </div>
                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <label className="text-[10px] text-neutral-400 uppercase block mb-1">Total Mins</label>
                    <input
                      type="number"
                      value={motionTotalMins}
                      onChange={(e) => setMotionTotalMins(parseInt(e.target.value) || 10)}
                      className="w-full bg-[#111422] border border-white/15 rounded-xl px-3 py-2 text-white focus:outline-none"
                    />
                  </div>
                  <div>
                    <label className="text-[10px] text-neutral-400 uppercase block mb-1">Secs / Speaker</label>
                    <input
                      type="number"
                      value={motionSpeakerSecs}
                      onChange={(e) => setMotionSpeakerSecs(parseInt(e.target.value) || 60)}
                      className="w-full bg-[#111422] border border-white/15 rounded-xl px-3 py-2 text-white focus:outline-none"
                    />
                  </div>
                </div>
                <div className="flex justify-end gap-2 pt-1">
                  <button type="button" onClick={() => setShowMotionForm(false)} className="px-3 py-1 text-neutral-400 hover:text-white">Cancel</button>
                  <button type="submit" className="px-4 py-1.5 rounded-lg bg-cyan-400 text-black font-bold">Transmit to Dais</button>
                </div>
              </form>
            )}

            {/* Motions List */}
            <div className="space-y-2 max-h-56 overflow-y-auto">
              {commMotions.map((m) => (
                <div key={m.id} className="p-3 rounded-xl bg-white/[0.03] border border-white/10 space-y-1 text-xs">
                  <div className="flex items-center justify-between text-[10px] font-mono">
                    <span className="text-cyan-300 font-bold">{m.type.replace('_', ' ')}</span>
                    <span className="text-neutral-400">{m.totalMinutes}m &bull; {m.speakerSeconds}s</span>
                  </div>
                  <div className="text-white font-medium text-xs leading-snug">{m.topic}</div>
                  <div className="text-[10px] font-mono text-neutral-500 pt-1 flex items-center justify-between">
                    <span>Proposed by: {m.proposedBy}</span>
                    <span className="text-emerald-400 font-bold">{m.status} ({m.votesFor}-{m.votesAgainst})</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right: Roll Call & Working Resolutions (7 Cols) */}
        <div className="lg:col-span-7 space-y-6">
          {/* Working Resolutions & Voting Section */}
          <div className="p-6 rounded-3xl bg-[#080d1c] border border-white/15 space-y-4">
            <div className="flex items-center justify-between border-b border-white/10 pb-3">
              <div className="flex items-center gap-2">
                <FileText className="w-4 h-4 text-cyan-400" />
                <h3 className="text-base font-bold text-white font-display">
                  Working Resolutions &amp; Draft Papers
                </h3>
              </div>
              <span className="text-xs font-mono text-neutral-400">Live Multilateral Voting Active</span>
            </div>

            {commDocs.map((doc) => (
              <div key={doc.id} className="p-4 rounded-2xl bg-black/40 border border-cyan-500/30 space-y-3">
                <div className="flex items-center justify-between text-xs font-mono">
                  <span className="px-2 py-0.5 rounded bg-cyan-500/20 text-cyan-300 font-bold">{doc.code}</span>
                  <span className="px-2 py-0.5 rounded bg-purple-500/20 text-purple-300 uppercase text-[10px] font-bold">{doc.status}</span>
                </div>

                <h4 className="text-sm font-bold text-white leading-snug">{doc.title}</h4>

                <div className="text-xs text-neutral-400 space-y-1.5 font-sans">
                  {doc.operativeClauses.slice(0, 2).map((c, i) => (
                    <p key={i} className="text-[11px] leading-relaxed italic">{c}</p>
                  ))}
                </div>

                {/* Simulated Roll Call Vote Buttons */}
                <div className="pt-3 border-t border-white/10 flex items-center justify-between gap-3 font-mono text-xs">
                  <span className="text-[11px] text-neutral-400">Cast Simulated Vote:</span>
                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={() => castVote(doc.id, 'AYE')}
                      className="px-3 py-1.5 rounded-lg bg-emerald-500/20 hover:bg-emerald-500/30 text-emerald-300 border border-emerald-500/40 text-[10px] font-bold transition cursor-pointer"
                    >
                      Aye ({doc.ayeVotes})
                    </button>
                    <button
                      type="button"
                      onClick={() => castVote(doc.id, 'NAY')}
                      className="px-3 py-1.5 rounded-lg bg-rose-500/20 hover:bg-rose-500/30 text-rose-300 border border-rose-500/40 text-[10px] font-bold transition cursor-pointer"
                    >
                      Nay ({doc.nayVotes})
                    </button>
                    <button
                      type="button"
                      onClick={() => castVote(doc.id, 'ABSTAIN')}
                      className="px-3 py-1.5 rounded-lg bg-amber-500/20 hover:bg-amber-500/30 text-amber-300 border border-amber-500/40 text-[10px] font-bold transition cursor-pointer"
                    >
                      Abstain ({doc.abstainVotes})
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Seeded Delegates Matrix Dossier */}
          <div className="p-6 rounded-3xl bg-[#080d1c] border border-white/15 space-y-4">
            <div className="flex items-center justify-between border-b border-white/10 pb-3">
              <div className="flex items-center gap-2">
                <Users className="w-4 h-4 text-cyan-400" />
                <h3 className="text-base font-bold text-white font-display">
                  Seeded Committee Envoys ({commDelegates.length})
                </h3>
              </div>
              <span className="text-xs font-mono text-neutral-500">Synthetic Profiles</span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 max-h-64 overflow-y-auto">
              {commDelegates.map((del) => (
                <div key={del.id} className="p-3 rounded-xl bg-white/[0.03] border border-white/10 flex items-center justify-between gap-3 text-xs">
                  <div className="flex items-center gap-2.5 min-w-0">
                    <img src={del.avatar} alt="" className="w-8 h-8 rounded-full object-cover shrink-0 border border-cyan-400/40" />
                    <div className="min-w-0">
                      <div className="font-bold text-white truncate">{del.name}</div>
                      <div className="text-[10px] font-mono text-cyan-300 truncate">{del.country}</div>
                    </div>
                  </div>
                  <div className="text-right font-mono text-[10px] shrink-0">
                    <span className="px-1.5 py-0.5 rounded bg-emerald-500/20 text-emerald-300 font-bold uppercase">{del.attendance.replace('_', ' ')}</span>
                    <div className="text-neutral-500 mt-0.5">{del.speechesCount} speeches</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function TestMunPage() {
  return (
    <TestNodeProvider>
      <TestNodeShell>
        <TestMunContent />
      </TestNodeShell>
    </TestNodeProvider>
  );
}
