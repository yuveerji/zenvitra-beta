'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Mic,
  Sparkles,
  Flame,
  Zap,
  Crown,
  Users,
  Clock,
  Play,
  Plus,
  Star,
  Award,
  ChevronRight,
  Vote,
  X,
  Radio,
  CheckCircle2,
  Share2,
  Check,
  Music,
  Smile
} from 'lucide-react';
import { useMun } from '@/context/MunContext';
import { StagePerformer } from '@/types/mun';

interface OpenMicStageProps {
  onOpenVotingForPerformer: (performer: StagePerformer) => void;
}

export function OpenMicStage({ onOpenVotingForPerformer }: OpenMicStageProps) {
  const {
    stagePerformers,
    addStagePerformer,
    advanceStagePerformer,
    triggerStageReaction,
    stageReactions,
    toggleTimer,
    sessionState
  } = useMun();

  const [showJoinModal, setShowJoinModal] = useState(false);
  const [performerName, setPerformerName] = useState('');
  const [actTitle, setActTitle] = useState('');
  const [genre, setGenre] = useState<StagePerformer['genre']>('Poetry');
  const [durationMinutes, setDurationMinutes] = useState(4);
  const [floatingParticles, setFloatingParticles] = useState<Array<{ id: number; emoji: string; x: number }>>([]);

  const currentPerformer = stagePerformers.find((p) => p.status === 'on_stage') || stagePerformers[0];
  const queuedPerformers = stagePerformers.filter((p) => p.status === 'queued');
  const completedPerformers = stagePerformers.filter((p) => p.status === 'completed');

  // Sorted Leaderboard
  const leaderboard = [...stagePerformers]
    .filter((p) => (p.averageScore || 0) > 0 || p.totalVotes > 0)
    .sort((a, b) => (b.averageScore || 0) - (a.averageScore || 0));

  const handleReactionClick = (emoji: string) => {
    triggerStageReaction(emoji);
    const newParticle = {
      id: Date.now() + Math.random(),
      emoji,
      x: Math.random() * 80 + 10,
    };
    setFloatingParticles((prev) => [...prev, newParticle]);
    setTimeout(() => {
      setFloatingParticles((prev) => prev.filter((p) => p.id !== newParticle.id));
    }, 2000);
  };

  const handleJoinQueueSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!actTitle.trim()) return;
    addStagePerformer(performerName.trim(), actTitle.trim(), genre, durationMinutes);
    setActTitle('');
    setShowJoinModal(false);
  };

  return (
    <div className="w-full space-y-8 select-none">
      
      {/* ─────────────────────────────────────────────────────────────
          1. LIVE SPOTLIGHT STAGE
      ───────────────────────────────────────────────────────────── */}
      <div className="relative rounded-3xl bg-gradient-to-b from-[#141026] via-[#090812] to-[#050508] border border-purple-500/30 p-6 sm:p-10 shadow-[0_20px_80px_rgba(139,92,246,0.15)] overflow-hidden">
        {/* Spotlight Beam Visual Background */}
        <div className="absolute -top-24 left-1/2 -translate-x-1/2 w-96 h-96 bg-purple-500/20 blur-[120px] rounded-full pointer-events-none" />
        <div className="absolute top-0 right-10 w-72 h-72 bg-amber-500/10 blur-[100px] rounded-full pointer-events-none" />

        {/* Floating Reaction Particles Overlay */}
        <div className="absolute inset-0 pointer-events-none overflow-hidden">
          {floatingParticles.map((particle) => (
            <motion.div
              key={particle.id}
              initial={{ opacity: 1, y: 300, scale: 0.8, x: `${particle.x}%` }}
              animate={{ opacity: 0, y: -50, scale: 1.5 }}
              transition={{ duration: 1.8, ease: 'easeOut' }}
              className="absolute text-3xl"
            >
              {particle.emoji}
            </motion.div>
          ))}
        </div>

        <div className="relative z-10 space-y-6">
          {/* Stage Header */}
          <div className="flex flex-wrap items-center justify-between gap-4 pb-5 border-b border-white/10">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-amber-400 via-rose-500 to-purple-600 p-[2px] shadow-lg">
                <div className="w-full h-full rounded-2xl bg-black flex items-center justify-center text-white">
                  <Mic className="w-6 h-6 text-amber-300 animate-bounce" />
                </div>
              </div>

              <div>
                <div className="flex items-center gap-2">
                  <span className="text-[10px] font-mono font-bold px-2.5 py-0.5 rounded-full bg-rose-500/20 text-rose-300 border border-rose-500/40 flex items-center gap-1.5 animate-pulse">
                    <span className="w-1.5 h-1.5 rounded-full bg-rose-400" />
                    LIVE ON STAGE
                  </span>
                  <span className="text-xs font-mono text-purple-300">
                    Open Mic &amp; Cultural Stage
                  </span>
                </div>
                <h2 className="font-display font-bold text-xl sm:text-2xl text-white tracking-tight">
                  {currentPerformer ? currentPerformer.actTitle : 'Open Stage Floor'}
                </h2>
              </div>
            </div>

            {/* Stage Actions */}
            <div className="flex items-center gap-2.5">
              {currentPerformer && (
                <button
                  type="button"
                  onClick={() => onOpenVotingForPerformer(currentPerformer)}
                  className="px-4 py-2.5 rounded-2xl bg-amber-400 hover:bg-amber-300 text-black font-display font-bold text-xs shadow-md transition cursor-pointer flex items-center gap-1.5"
                >
                  <Vote className="w-4 h-4" />
                  <span>Launch Live Vote for Act</span>
                </button>
              )}

              <button
                type="button"
                onClick={advanceStagePerformer}
                className="px-4 py-2.5 rounded-2xl bg-white/10 hover:bg-white/20 text-white font-display font-bold text-xs border border-white/15 transition cursor-pointer flex items-center gap-1.5"
              >
                <span>Next Performer →</span>
              </button>
            </div>
          </div>

          {/* Current Performer Showcase */}
          {currentPerformer ? (
            <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-center">
              <div className="md:col-span-8 space-y-3">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-purple-500/20 border border-purple-400 flex items-center justify-center font-display font-bold text-sm text-purple-200">
                    {currentPerformer.performerName?.[0]?.toUpperCase() || 'P'}
                  </div>
                  <div>
                    <span className="font-bold text-base text-white block">
                      {currentPerformer.performerName}
                    </span>
                    <span className="text-xs text-neutral-400 font-mono">
                      @{currentPerformer.userHandle} &bull; Genre: <strong className="text-purple-300">{currentPerformer.genre}</strong>
                    </span>
                  </div>
                </div>

                <p className="text-xs sm:text-sm text-neutral-300 leading-relaxed font-sans bg-black/40 p-4 rounded-2xl border border-white/10">
                  ⚡ <strong>Stage Brief:</strong> "{currentPerformer.actTitle}" — Duration: {currentPerformer.durationMinutes} minutes. Floor open for live audience clapping, star ratings, and community voting!
                </p>
              </div>

              {/* Live Rating & Stats */}
              <div className="md:col-span-4 p-5 rounded-2xl bg-black/60 border border-white/10 space-y-2 text-center">
                <span className="text-[10px] font-mono text-neutral-400 uppercase tracking-wider block font-bold">
                  LIVE AUDIENCE SCORE
                </span>
                <div className="flex items-center justify-center gap-1 text-amber-400 font-mono font-bold text-3xl">
                  <Star className="w-7 h-7 fill-amber-400" />
                  <span>{currentPerformer.averageScore ? currentPerformer.averageScore.toFixed(1) : '9.2'}</span>
                  <span className="text-sm text-neutral-500 font-normal">/10</span>
                </div>
                <span className="text-[11px] font-mono text-neutral-400 block">
                  {currentPerformer.totalVotes || 18} Judges &amp; Audience Ballots
                </span>
              </div>
            </div>
          ) : (
            <div className="p-8 text-center text-neutral-400 text-sm font-mono">
              Stage is currently open. Step up to the mic to begin!
            </div>
          )}

          {/* ── LIVE FLOATING REACTIONS BAR ── */}
          <div className="pt-4 border-t border-white/10 flex flex-wrap items-center justify-between gap-3">
            <div className="flex items-center gap-2">
              <span className="text-xs font-mono text-neutral-400 mr-2 flex items-center gap-1">
                <Flame className="w-3.5 h-3.5 text-rose-400" />
                <span>Audience Claps &amp; Energy:</span>
              </span>

              {stageReactions.map((r) => (
                <button
                  key={r.id}
                  type="button"
                  onClick={() => handleReactionClick(r.emoji)}
                  className="px-3 py-1.5 rounded-2xl bg-white/[0.04] hover:bg-white/15 border border-white/10 hover:scale-110 active:scale-95 transition-all cursor-pointer flex items-center gap-1.5 font-mono text-xs text-white"
                >
                  <span className="text-base">{r.emoji}</span>
                  <span className="text-[11px] text-neutral-400 font-bold">{r.count}</span>
                </button>
              ))}
            </div>

            <button
              type="button"
              onClick={() => setShowJoinModal(true)}
              className="px-5 py-2 rounded-2xl bg-gradient-to-r from-purple-500 to-rose-500 text-white font-display font-bold text-xs shadow-md hover:scale-105 transition cursor-pointer flex items-center gap-1.5"
            >
              <Plus className="w-4 h-4" />
              <span>+ Step Up / Join Stage Queue</span>
            </button>
          </div>
        </div>
      </div>

      {/* ─────────────────────────────────────────────────────────────
          2. STAGE LINEUP QUEUE & HALL OF FAME LEADERBOARD
      ───────────────────────────────────────────────────────────── */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Left: Performer Lineup Queue (7 cols) */}
        <div className="lg:col-span-7 space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 text-sm font-display font-bold text-white uppercase tracking-wide">
              <Users className="w-4 h-4 text-purple-400" />
              <span>Stage Lineup &amp; Queue ({stagePerformers.length})</span>
            </div>

            <button
              type="button"
              onClick={() => setShowJoinModal(true)}
              className="text-xs font-mono text-purple-400 hover:underline flex items-center gap-1 cursor-pointer"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Register Act</span>
            </button>
          </div>

          <div className="space-y-3">
            {stagePerformers.map((performer, idx) => (
              <div
                key={performer.id}
                className={`p-4 rounded-2xl border transition-all flex items-center justify-between gap-4 ${
                  performer.status === 'on_stage'
                    ? 'bg-purple-500/15 border-purple-400 shadow-[0_0_20px_rgba(168,85,247,0.2)]'
                    : performer.status === 'completed'
                    ? 'bg-white/[0.01] border-white/5 opacity-70'
                    : 'bg-white/[0.03] border-white/10 hover:border-white/20'
                }`}
              >
                <div className="flex items-center gap-3 min-w-0">
                  <div className={`w-8 h-8 rounded-xl flex items-center justify-center font-mono text-xs font-bold shrink-0 ${
                    performer.status === 'on_stage'
                      ? 'bg-purple-400 text-black'
                      : 'bg-white/10 text-neutral-400'
                  }`}>
                    {idx + 1}
                  </div>

                  <div className="min-w-0">
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-sm text-white truncate">
                        {performer.performerName}
                      </span>
                      <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-white/10 text-neutral-300">
                        {performer.genre}
                      </span>
                      {performer.status === 'on_stage' && (
                        <span className="text-[9px] font-mono font-bold px-2 py-0.5 rounded-full bg-rose-500/20 text-rose-300 border border-rose-500/40 animate-pulse">
                          ON STAGE
                        </span>
                      )}
                    </div>
                    <p className="text-xs text-neutral-300 truncate">
                      "{performer.actTitle}" &bull; {performer.durationMinutes} mins
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-2 shrink-0">
                  {performer.averageScore && (
                    <div className="flex items-center gap-1 font-mono text-xs font-bold text-amber-400 bg-amber-500/10 px-2 py-1 rounded-lg border border-amber-500/30">
                      <Star className="w-3 h-3 fill-amber-400" />
                      <span>{performer.averageScore.toFixed(1)}</span>
                    </div>
                  )}

                  <button
                    type="button"
                    onClick={() => onOpenVotingForPerformer(performer)}
                    className="p-2 rounded-xl bg-white/5 hover:bg-amber-400 hover:text-black text-neutral-400 border border-white/10 transition cursor-pointer"
                    title="Launch Vote for Act"
                  >
                    <Vote className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Right: Hall of Fame & Leaderboard (5 cols) */}
        <div className="lg:col-span-5 space-y-4">
          <div className="flex items-center gap-2 text-sm font-display font-bold text-white uppercase tracking-wide">
            <Crown className="w-4 h-4 text-amber-400" />
            <span>Stage Leaderboard &amp; Awards</span>
          </div>

          <div className="p-5 rounded-3xl bg-[#08090e] border border-white/15 space-y-4 shadow-xl">
            {leaderboard.length > 0 ? (
              leaderboard.slice(0, 5).map((entry, rank) => (
                <div
                  key={entry.id}
                  className="flex items-center justify-between p-3 rounded-2xl bg-white/[0.02] border border-white/10"
                >
                  <div className="flex items-center gap-3">
                    <div className={`w-7 h-7 rounded-lg flex items-center justify-center font-mono font-bold text-xs ${
                      rank === 0 ? 'bg-amber-400 text-black shadow-md' : rank === 1 ? 'bg-neutral-300 text-black' : rank === 2 ? 'bg-amber-700 text-white' : 'bg-white/10 text-neutral-400'
                    }`}>
                      #{rank + 1}
                    </div>

                    <div>
                      <span className="font-bold text-xs text-white block">
                        {entry.performerName}
                      </span>
                      <span className="text-[10px] text-neutral-400 font-mono">
                        "{entry.actTitle}"
                      </span>
                    </div>
                  </div>

                  <div className="text-right font-mono">
                    <div className="flex items-center gap-1 text-xs font-bold text-amber-300">
                      <Star className="w-3 h-3 fill-amber-300" />
                      <span>{entry.averageScore ? entry.averageScore.toFixed(1) : '—'}</span>
                    </div>
                    <span className="text-[10px] text-neutral-500">{entry.totalVotes} votes</span>
                  </div>
                </div>
              ))
            ) : (
              <div className="p-6 text-center text-xs font-mono text-neutral-500">
                Scores will populate as live votes and judge ratings are cast during performances.
              </div>
            )}
          </div>
        </div>
      </div>

      {/* ─────────────────────────────────────────────────────────────
          3. JOIN STAGE QUEUE MODAL
      ───────────────────────────────────────────────────────────── */}
      {showJoinModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 select-none animate-in fade-in">
          <div className="fixed inset-0 bg-black/85 backdrop-blur-md" onClick={() => setShowJoinModal(false)} />
          
          <div className="relative w-full max-w-lg bg-[#090a0f] border border-white/20 rounded-3xl p-6 sm:p-7 shadow-2xl z-10 space-y-5 text-white">
            <div className="flex items-center justify-between border-b border-white/10 pb-4">
              <div className="flex items-center gap-2.5">
                <Mic className="w-5 h-5 text-purple-400" />
                <h3 className="font-display font-bold text-lg text-white">
                  Step Up to the Mic / Register Act
                </h3>
              </div>
              <button
                type="button"
                onClick={() => setShowJoinModal(false)}
                className="p-1.5 rounded-xl bg-white/5 hover:bg-white/10 text-neutral-400 hover:text-white transition cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleJoinQueueSubmit} className="space-y-4">
              <div>
                <label className="text-xs font-mono font-bold text-neutral-300 block mb-1">Performer / Stage Name *</label>
                <input
                  type="text"
                  required
                  value={performerName}
                  onChange={(e) => setPerformerName(e.target.value)}
                  placeholder="e.g. Maya Lin or The Sovereign Collective"
                  className="w-full bg-black/60 border border-white/15 rounded-xl px-3.5 py-2.5 text-xs text-white placeholder-neutral-500 focus:outline-none focus:border-purple-400"
                />
              </div>

              <div>
                <label className="text-xs font-mono font-bold text-neutral-300 block mb-1">Act / Performance Title *</label>
                <input
                  type="text"
                  required
                  value={actTitle}
                  onChange={(e) => setActTitle(e.target.value)}
                  placeholder="e.g. 'A Hymn for Clean Oceans' or '3-Min Pitch'"
                  className="w-full bg-black/60 border border-white/15 rounded-xl px-3.5 py-2.5 text-xs text-white placeholder-neutral-500 focus:outline-none focus:border-purple-400"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-mono font-bold text-neutral-300 block mb-1">Genre / Format</label>
                  <select
                    value={genre}
                    onChange={(e) => setGenre(e.target.value as any)}
                    className="w-full bg-neutral-900 border border-white/15 rounded-xl px-3 py-2 text-xs text-white focus:outline-none cursor-pointer"
                  >
                    <option value="Poetry">Spoken Word / Poetry</option>
                    <option value="Music">Acoustic / Music</option>
                    <option value="Standup">Standup Comedy</option>
                    <option value="Speech">Youth Keynote / Speech</option>
                    <option value="Startup Pitch">Startup / Project Pitch</option>
                    <option value="Storytelling">Oral Storytelling</option>
                    <option value="Debate">Freestyle Debate</option>
                  </select>
                </div>

                <div>
                  <label className="text-xs font-mono font-bold text-neutral-300 block mb-1">Duration</label>
                  <select
                    value={durationMinutes}
                    onChange={(e) => setDurationMinutes(Number(e.target.value))}
                    className="w-full bg-neutral-900 border border-white/15 rounded-xl px-3 py-2 text-xs text-white focus:outline-none cursor-pointer"
                  >
                    <option value={3}>3 Minutes (Rapid)</option>
                    <option value={4}>4 Minutes (Standard)</option>
                    <option value={5}>5 Minutes (Extended)</option>
                  </select>
                </div>
              </div>

              <div className="pt-4 border-t border-white/10 flex justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setShowJoinModal(false)}
                  className="px-4 py-2 rounded-xl bg-white/5 text-neutral-400 hover:text-white text-xs transition"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-6 py-2 rounded-xl bg-gradient-to-r from-purple-500 to-rose-500 text-white font-display font-bold text-xs shadow-md hover:scale-105 transition"
                >
                  Join Queue
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
