'use client';

import React, { useState } from 'react';
import { X, Play, Check, Flame, Clock, Users, ArrowRight } from 'lucide-react';
import { useZenMun } from '@/context/ZenMunContext';
import { ZenMotion } from '@/types/zenMun';

export function RaiseMotionModal() {
  const {
    session,
    showMotionsModal,
    setShowMotionsModal,
    raiseMotion,
    passAndStartMotion,
    voteOnMotion,
  } = useZenMun();

  const [motionType, setMotionType] = useState<ZenMotion['type']>('moderated');
  const [topic, setTopic] = useState('');
  const [proposerId, setProposerId] = useState(session.roster[0]?.id || '');
  const [proposerSearch, setProposerSearch] = useState('');
  const [proposerDropdown, setProposerDropdown] = useState(false);

  const [totalMin, setTotalMin] = useState(10);
  const [totalSec, setTotalSec] = useState(0);
  const [delegateSec, setDelegateSec] = useState(60);

  if (!showMotionsModal) return null;

  const totalCalculatedSeconds = totalMin * 60 + totalSec;
  const maxSpeakers = delegateSec > 0 ? Math.floor(totalCalculatedSeconds / delegateSec) : 0;

  const filteredProposers = session.roster.filter((d) =>
    d.name.toLowerCase().includes(proposerSearch.toLowerCase())
  );

  const handleSelectProposer = (delId: string) => {
    setProposerId(delId);
    const del = session.roster.find((d) => d.id === delId);
    if (del) setProposerSearch(del.name);
    setProposerDropdown(false);
  };

  const handleTypeSelect = (type: ZenMotion['type']) => {
    setMotionType(type);
    if (type === 'unmoderated') {
      setTotalMin(15);
      setTotalSec(0);
    } else if (type === 'tour_de_table') {
      setDelegateSec(45);
    } else if (type === 'suspend') {
      setTopic('Suspension of the meeting');
    } else if (type === 'end_debate') {
      setTopic('Closure of debate and move into voting procedure');
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!topic.trim()) return;

    const proposer = session.roster.find((d) => d.id === proposerId) || session.roster[0];
    const typeNames: Record<ZenMotion['type'], string> = {
      moderated: 'Moderated Caucus',
      unmoderated: 'Unmoderated Caucus',
      tour_de_table: 'Tour de Table',
      consultation: 'Consultation of the Whole',
      custom: 'Custom Motion',
      suspend: 'Suspension of the Meeting',
      end_debate: 'Closure of Debate',
    };

    raiseMotion({
      type: motionType,
      typeName: typeNames[motionType],
      topic: topic.trim(),
      proposedById: proposer.id,
      proposedByName: proposer.name,
      totalSeconds: totalCalculatedSeconds,
      delegateSeconds: delegateSec,
    });

    setTopic('');
    setShowMotionsModal(false);
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-4 animate-fade-in">
      <div className="w-full max-w-2xl bg-[#090d16] rounded-3xl border border-white/15 shadow-2xl overflow-hidden flex flex-col max-h-[92vh]">
        {/* Header */}
        <div className="px-6 py-4 bg-[#0c1220] text-white flex items-center justify-between border-b border-white/10">
          <h2 className="text-sm font-black tracking-widest uppercase text-cyan-400">RAISE A MOTION</h2>
          <button
            type="button"
            onClick={() => setShowMotionsModal(false)}
            className="text-neutral-400 hover:text-white p-1 rounded-full cursor-pointer transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 overflow-y-auto space-y-6">
          {/* Motion Type Selector Row */}
          <div className="space-y-2">
            <label className="text-[10px] font-bold uppercase tracking-wider text-neutral-400">
              MOTION TYPE
            </label>
            <div className="grid grid-cols-5 gap-2">
              {[
                { id: 'moderated', label: 'Moderated Caucus' },
                { id: 'unmoderated', label: 'Unmoderated Caucus' },
                { id: 'tour_de_table', label: 'Tour de Table' },
                { id: 'consultation', label: 'Consultation of Whole' },
                { id: 'custom', label: 'Custom' },
              ].map((t) => (
                <button
                  key={t.id}
                  type="button"
                  onClick={() => handleTypeSelect(t.id as any)}
                  className={`p-2.5 rounded-xl border text-[11px] font-black text-center leading-tight transition cursor-pointer ${
                    motionType === t.id
                      ? 'bg-cyan-500 text-black border-cyan-400 shadow-md'
                      : 'bg-white/5 hover:bg-white/10 text-white border-white/10'
                  }`}
                >
                  {t.label}
                </button>
              ))}
            </div>

            {/* Procedural Pills (Suspend / End Debate) */}
            <div className="flex items-center gap-2 pt-1">
              <button
                type="button"
                onClick={() => handleTypeSelect('suspend')}
                className={`px-3 py-1.5 rounded-full border text-xs font-bold transition cursor-pointer ${
                  motionType === 'suspend'
                    ? 'bg-rose-600 text-white border-rose-500 shadow-xs'
                    : 'bg-rose-500/10 text-rose-300 border-rose-500/30 hover:bg-rose-500/20'
                }`}
              >
                Suspend
              </button>
              <button
                type="button"
                onClick={() => handleTypeSelect('end_debate')}
                className={`px-3 py-1.5 rounded-full border text-xs font-bold transition cursor-pointer ${
                  motionType === 'end_debate'
                    ? 'bg-rose-600 text-white border-rose-500 shadow-xs'
                    : 'bg-rose-500/10 text-rose-300 border-rose-500/30 hover:bg-rose-500/20'
                }`}
              >
                End Debate
              </button>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Topic Input */}
            <div>
              <label className="block text-[10px] font-bold uppercase tracking-wider text-neutral-400 mb-1">
                Topic <span className="text-rose-400">*</span>
              </label>
              <input
                type="text"
                value={topic}
                onChange={(e) => setTopic(e.target.value)}
                placeholder="e.g. Humanitarian response in conflict zones"
                required
                className="w-full px-4 py-2.5 rounded-xl bg-white/5 border border-white/10 focus:outline-none focus:border-cyan-400 text-sm font-semibold text-white placeholder-white/30"
              />
            </div>

            {/* Proposed by Autocomplete */}
            <div className="relative">
              <label className="block text-[10px] font-bold uppercase tracking-wider text-cyan-400 mb-1">
                Proposed by
              </label>
              <input
                type="text"
                value={proposerSearch || session.roster.find((d) => d.id === proposerId)?.name || ''}
                onChange={(e) => {
                  setProposerSearch(e.target.value);
                  setProposerDropdown(true);
                }}
                onFocus={() => setProposerDropdown(true)}
                placeholder="Type country name..."
                className="w-full px-4 py-2.5 rounded-xl bg-white/5 border border-white/10 focus:outline-none focus:border-cyan-400 text-sm font-semibold text-white placeholder-white/30"
              />

              {proposerDropdown && filteredProposers.length > 0 && (
                <div className="absolute top-16 left-0 right-0 z-30 bg-[#0a0f1d] rounded-2xl shadow-2xl border border-white/15 max-h-48 overflow-y-auto">
                  {filteredProposers.map((d) => (
                    <button
                      key={d.id}
                      type="button"
                      onClick={() => handleSelectProposer(d.id)}
                      className="w-full px-4 py-2.5 text-left hover:bg-white/10 flex items-center gap-2 border-b border-white/5 last:border-none cursor-pointer text-white"
                    >
                      <img
                        src={`https://flagcdn.com/w40/${d.countryCode.toLowerCase()}.png`}
                        alt=""
                        className="w-4 h-4 rounded-full object-cover border border-white/10"
                      />
                      <span className="text-xs font-bold text-white">{d.name}</span>
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Time Columns (Total Time & / Delegate) */}
            {motionType !== 'suspend' && motionType !== 'end_debate' && (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
                {/* Total Time */}
                <div className="p-4 rounded-2xl bg-white/5 border border-white/10 space-y-3">
                  <div className="text-[10px] font-bold uppercase tracking-wider text-neutral-400">
                    Total time
                  </div>
                  <div className="flex items-center gap-2">
                    <input
                      type="number"
                      min={1}
                      max={60}
                      value={totalMin}
                      onChange={(e) => setTotalMin(Math.max(1, parseInt(e.target.value) || 1))}
                      className="w-16 px-2 py-1.5 rounded-lg bg-black/40 border border-white/10 font-mono text-center font-bold text-sm text-white focus:outline-none focus:border-cyan-400"
                    />
                    <span className="text-xs font-bold text-neutral-400">min</span>
                    <input
                      type="number"
                      min={0}
                      max={59}
                      value={totalSec}
                      onChange={(e) => setTotalSec(Math.min(59, Math.max(0, parseInt(e.target.value) || 0)))}
                      className="w-16 px-2 py-1.5 rounded-lg bg-black/40 border border-white/10 font-mono text-center font-bold text-sm text-white focus:outline-none focus:border-cyan-400"
                    />
                    <span className="text-xs font-bold text-neutral-400">sec</span>
                  </div>
                  <div className="flex flex-wrap gap-1.5">
                    {[2, 5, 10, 15, 20].map((m) => (
                      <button
                        key={m}
                        type="button"
                        onClick={() => {
                          setTotalMin(m);
                          setTotalSec(0);
                        }}
                        className={`px-2.5 py-1 rounded-lg text-xs font-bold border cursor-pointer transition ${
                          totalMin === m && totalSec === 0
                            ? 'bg-cyan-500 text-black border-cyan-400'
                            : 'bg-white/5 text-white border-white/10 hover:bg-white/10'
                        }`}
                      >
                        {m}m
                      </button>
                    ))}
                  </div>
                </div>

                {/* Per Delegate */}
                {motionType !== 'unmoderated' && (
                  <div className="p-4 rounded-2xl bg-white/5 border border-white/10 space-y-3">
                    <div className="text-[10px] font-bold uppercase tracking-wider text-neutral-400">
                      / delegate
                    </div>
                    <div className="flex items-center gap-2">
                      <input
                        type="number"
                        min={10}
                        max={300}
                        step={5}
                        value={delegateSec}
                        onChange={(e) => setDelegateSec(Math.max(10, parseInt(e.target.value) || 60))}
                        className="w-20 px-2 py-1.5 rounded-lg bg-black/40 border border-white/10 font-mono text-center font-bold text-sm text-white focus:outline-none focus:border-cyan-400"
                      />
                      <span className="text-xs font-bold text-neutral-400">sec</span>
                    </div>
                    <div className="flex flex-wrap gap-1.5">
                      {[30, 45, 60, 90, 120].map((s) => (
                        <button
                          key={s}
                          type="button"
                          onClick={() => setDelegateSec(s)}
                          className={`px-2.5 py-1 rounded-lg text-xs font-bold border cursor-pointer transition ${
                            delegateSec === s
                              ? 'bg-cyan-500 text-black border-cyan-400'
                              : 'bg-white/5 text-white border-white/10 hover:bg-white/10'
                          }`}
                        >
                          {s}s
                        </button>
                      ))}
                    </div>

                    {/* Capacity Pill */}
                    <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-cyan-950/40 border border-cyan-500/30 text-[11px] text-cyan-300">
                      <Users className="w-3 h-3 text-cyan-400" />
                      <span><strong>{maxSpeakers}</strong> delegates can speak</span>
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* Submit Button */}
            <div className="pt-2">
              <button
                type="submit"
                disabled={!topic.trim()}
                className={`w-full py-4 rounded-2xl font-black text-sm uppercase tracking-wider transition shadow-lg cursor-pointer flex items-center justify-center gap-2 ${
                  topic.trim()
                    ? 'bg-gradient-to-r from-emerald-500 to-teal-400 hover:from-emerald-400 hover:to-teal-300 text-black shadow-emerald-500/20 active:scale-95'
                    : 'bg-white/10 text-neutral-500 cursor-not-allowed'
                }`}
              >
                <span>RAISE MOTION &rarr;</span>
              </button>
            </div>
          </form>

          {/* Active Motions Queue */}
          {session.motions.length > 0 && (
            <div className="pt-4 border-t border-white/10 space-y-2">
              <div className="text-[10px] font-bold uppercase tracking-wider text-neutral-400">
                QUEUED MOTIONS ({session.motions.length})
              </div>
              <div className="space-y-2">
                {session.motions.map((m) => (
                  <div
                    key={m.id}
                    className="p-3.5 rounded-2xl bg-[#0d1424] border border-white/10 flex items-center justify-between gap-3 shadow-xs"
                  >
                    <div className="min-w-0 flex-1">
                      <div className="flex items-center gap-2">
                        <span className="text-[10px] font-bold uppercase bg-white/10 px-2 py-0.5 rounded text-cyan-300 border border-white/10">
                          {m.typeName}
                        </span>
                        <span className="text-xs text-neutral-400 font-medium">
                          by <strong className="text-white">{m.proposedByName}</strong>
                        </span>
                      </div>
                      <div className="text-sm font-bold text-white truncate pt-0.5">
                        {m.topic}
                      </div>
                      <div className="text-[10px] font-mono text-neutral-400">
                        {Math.floor(m.totalSeconds / 60)}m {m.totalSeconds % 60}s total &bull; {m.delegateSeconds}s / speaker
                      </div>
                    </div>

                    <div className="flex items-center gap-2 shrink-0">
                      <button
                        type="button"
                        onClick={() => {
                          passAndStartMotion(m.id);
                          setShowMotionsModal(false);
                        }}
                        className="px-3 py-1.5 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-400 text-black text-xs font-black flex items-center gap-1 cursor-pointer transition shadow-md active:scale-95"
                      >
                        <Play className="w-3 h-3 fill-black" />
                        <span>Pass &amp; Start</span>
                      </button>
                      <button
                        type="button"
                        onClick={() => voteOnMotion(m.id, false)}
                        className="px-2.5 py-1.5 rounded-xl bg-rose-500/10 hover:bg-rose-500/20 text-rose-300 border border-rose-500/30 text-xs font-bold cursor-pointer transition"
                      >
                        Fail
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
