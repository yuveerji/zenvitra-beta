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
    <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 animate-fade-in">
      <div className="w-full max-w-2xl bg-[#F5F3EB] rounded-3xl border border-[#D6D1C4] shadow-2xl overflow-hidden flex flex-col max-h-[92vh]">
        {/* Header */}
        <div className="px-6 py-4 bg-[#243928] text-white flex items-center justify-between border-b border-[#324f38]">
          <h2 className="text-sm font-black tracking-widest uppercase">RAISE A MOTION</h2>
          <button
            type="button"
            onClick={() => setShowMotionsModal(false)}
            className="text-neutral-400 hover:text-white p-1 rounded-full cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 overflow-y-auto space-y-6">
          {/* Motion Type Selector Row */}
          <div className="space-y-2">
            <label className="text-[10px] font-bold uppercase tracking-wider text-[#7A7870]">
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
                  className={`p-2.5 rounded-xl border text-[11px] font-extrabold text-center leading-tight transition cursor-pointer ${
                    motionType === t.id
                      ? 'bg-[#243928] text-white border-[#243928] shadow-sm'
                      : 'bg-white hover:bg-[#FAF9F5] text-[#1A1D1A] border-[#D6D1C4]'
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
                    ? 'bg-[#7D2E2E] text-white border-[#7D2E2E]'
                    : 'bg-[#EED8D6] text-[#7D2E2E] border-[#D9B2AE] hover:brightness-95'
                }`}
              >
                Suspend
              </button>
              <button
                type="button"
                onClick={() => handleTypeSelect('end_debate')}
                className={`px-3 py-1.5 rounded-full border text-xs font-bold transition cursor-pointer ${
                  motionType === 'end_debate'
                    ? 'bg-[#7D2E2E] text-white border-[#7D2E2E]'
                    : 'bg-[#EED8D6] text-[#7D2E2E] border-[#D9B2AE] hover:brightness-95'
                }`}
              >
                End Debate
              </button>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Topic Input */}
            <div>
              <label className="block text-[10px] font-bold uppercase tracking-wider text-[#7A7870] mb-1">
                Topic <span className="text-rose-600">*</span>
              </label>
              <input
                type="text"
                value={topic}
                onChange={(e) => setTopic(e.target.value)}
                placeholder="e.g. Humanitarian response in conflict zones"
                required
                className="w-full px-4 py-2.5 rounded-xl bg-white border border-[#D6D1C4] focus:outline-none focus:ring-2 focus:ring-[#243928] text-sm font-semibold"
              />
            </div>

            {/* Proposed by Autocomplete */}
            <div className="relative">
              <label className="block text-[10px] font-bold uppercase tracking-wider text-[#39683C] mb-1">
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
                className="w-full px-4 py-2.5 rounded-xl bg-white border border-[#D6D1C4] focus:outline-none focus:ring-2 focus:ring-[#243928] text-sm font-semibold"
              />

              {proposerDropdown && filteredProposers.length > 0 && (
                <div className="absolute top-16 left-0 right-0 z-30 bg-white rounded-2xl shadow-xl border border-[#D6D1C4] max-h-48 overflow-y-auto">
                  {filteredProposers.map((d) => (
                    <button
                      key={d.id}
                      type="button"
                      onClick={() => handleSelectProposer(d.id)}
                      className="w-full px-4 py-2.5 text-left hover:bg-[#F5F3EB] flex items-center gap-2 border-b border-[#F0EDE4] last:border-none cursor-pointer"
                    >
                      <img
                        src={`https://flagcdn.com/w40/${d.countryCode.toLowerCase()}.png`}
                        alt=""
                        className="w-4 h-4 rounded-full object-cover"
                      />
                      <span className="text-xs font-bold text-[#1A1D1A]">{d.name}</span>
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Time Columns (Total Time & / Delegate) */}
            {motionType !== 'suspend' && motionType !== 'end_debate' && (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
                {/* Total Time */}
                <div className="p-4 rounded-2xl bg-[#EFECE4] border border-[#D6D1C4] space-y-3">
                  <div className="text-[10px] font-bold uppercase tracking-wider text-[#7A7870]">
                    Total time
                  </div>
                  <div className="flex items-center gap-2">
                    <input
                      type="number"
                      min={1}
                      max={60}
                      value={totalMin}
                      onChange={(e) => setTotalMin(Math.max(1, parseInt(e.target.value) || 1))}
                      className="w-16 px-2 py-1.5 rounded-lg bg-white border border-[#D6D1C4] font-mono text-center font-bold text-sm"
                    />
                    <span className="text-xs font-bold text-[#7A7870]">min</span>
                    <input
                      type="number"
                      min={0}
                      max={59}
                      value={totalSec}
                      onChange={(e) => setTotalSec(Math.min(59, Math.max(0, parseInt(e.target.value) || 0)))}
                      className="w-16 px-2 py-1.5 rounded-lg bg-white border border-[#D6D1C4] font-mono text-center font-bold text-sm"
                    />
                    <span className="text-xs font-bold text-[#7A7870]">sec</span>
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
                        className={`px-2.5 py-1 rounded-lg text-xs font-bold border cursor-pointer ${
                          totalMin === m && totalSec === 0
                            ? 'bg-[#243928] text-white border-[#243928]'
                            : 'bg-white text-[#1A1D1A] border-[#D6D1C4] hover:bg-[#FAF9F5]'
                        }`}
                      >
                        {m}m
                      </button>
                    ))}
                  </div>
                </div>

                {/* Per Delegate */}
                {motionType !== 'unmoderated' && (
                  <div className="p-4 rounded-2xl bg-[#EFECE4] border border-[#D6D1C4] space-y-3">
                    <div className="text-[10px] font-bold uppercase tracking-wider text-[#7A7870]">
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
                        className="w-20 px-2 py-1.5 rounded-lg bg-white border border-[#D6D1C4] font-mono text-center font-bold text-sm"
                      />
                      <span className="text-xs font-bold text-[#7A7870]">sec</span>
                    </div>
                    <div className="flex flex-wrap gap-1.5">
                      {[30, 45, 60, 90, 120].map((s) => (
                        <button
                          key={s}
                          type="button"
                          onClick={() => setDelegateSec(s)}
                          className={`px-2.5 py-1 rounded-lg text-xs font-bold border cursor-pointer ${
                            delegateSec === s
                              ? 'bg-[#243928] text-white border-[#243928]'
                              : 'bg-white text-[#1A1D1A] border-[#D6D1C4] hover:bg-[#FAF9F5]'
                          }`}
                        >
                          {s}s
                        </button>
                      ))}
                    </div>

                    {/* Capacity Pill */}
                    <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white border border-[#D6D1C4] text-[11px] text-[#243928]">
                      <Users className="w-3 h-3 text-[#39683C]" />
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
                    ? 'bg-[#243928] hover:bg-[#324f38] text-[#E4DB98] shadow-[#243928]/20'
                    : 'bg-[#D6D1C2] text-neutral-500 cursor-not-allowed'
                }`}
              >
                <span>RAISE MOTION &rarr;</span>
              </button>
            </div>
          </form>

          {/* Active Motions Queue */}
          {session.motions.length > 0 && (
            <div className="pt-4 border-t border-[#D6D1C4] space-y-2">
              <div className="text-[10px] font-bold uppercase tracking-wider text-[#7A7870]">
                QUEUED MOTIONS ({session.motions.length})
              </div>
              <div className="space-y-2">
                {session.motions.map((m) => (
                  <div
                    key={m.id}
                    className="p-3.5 rounded-2xl bg-white border border-[#D6D1C4] flex items-center justify-between gap-3 shadow-2xs"
                  >
                    <div className="min-w-0 flex-1">
                      <div className="flex items-center gap-2">
                        <span className="text-[10px] font-bold uppercase bg-[#EFECE4] px-2 py-0.5 rounded text-[#243928]">
                          {m.typeName}
                        </span>
                        <span className="text-xs text-[#7A7870] font-medium">
                          by <strong>{m.proposedByName}</strong>
                        </span>
                      </div>
                      <div className="text-sm font-bold text-[#1A1D1A] truncate pt-0.5">
                        {m.topic}
                      </div>
                      <div className="text-[10px] font-mono text-[#7A7870]">
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
                        className="px-3 py-1.5 rounded-xl bg-[#39683C] hover:bg-[#2e5531] text-white text-xs font-bold flex items-center gap-1 cursor-pointer"
                      >
                        <Play className="w-3 h-3 fill-white" />
                        <span>Pass &amp; Start</span>
                      </button>
                      <button
                        type="button"
                        onClick={() => voteOnMotion(m.id, false)}
                        className="px-2.5 py-1.5 rounded-xl bg-white hover:bg-rose-50 text-rose-600 border border-[#D6D1C4] text-xs font-bold cursor-pointer"
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
