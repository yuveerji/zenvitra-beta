'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Vote,
  X,
  Sparkles,
  Mic,
  FileText,
  Clock,
  CheckCircle2,
  Users,
  Award,
  Zap,
  Plus,
  Trash2,
  Sliders,
  ShieldCheck,
  Globe2
} from 'lucide-react';
import { useMun } from '@/context/MunContext';
import { VotingSessionType, VotingRuleMode } from '@/types/mun';

interface LiveVotingModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function LiveVotingModal({ isOpen, onClose }: { isOpen: boolean; onClose: () => void }) {
  const {
    activeCommitteeId,
    sessionState,
    stagePerformers,
    launchVotingSession
  } = useMun();

  const [category, setCategory] = useState<VotingSessionType>('mun_motion');
  const [ruleMode, setRuleMode] = useState<VotingRuleMode>('simple_majority');
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [durationSeconds, setDurationSeconds] = useState(90);
  const [selectedPerformerId, setSelectedPerformerId] = useState<string>('');
  
  // Custom multi-options for polls
  const [options, setOptions] = useState<Array<{ label: string; sublabel?: string }>>([
    { label: 'In Favor / Yes', sublabel: 'Adopt Motion' },
    { label: 'Against / No', sublabel: 'Reject Motion' },
    { label: 'Abstain', sublabel: 'Neutral Vote' },
  ]);

  if (!isOpen) return null;

  const handleCategoryChange = (cat: VotingSessionType) => {
    setCategory(cat);
    if (cat === 'mun_motion') {
      setTitle(sessionState.currentMotion ? `Vote on Motion: ${sessionState.currentMotion.topic}` : 'Vote on Moderated Caucus Motion');
      setRuleMode('simple_majority');
      setOptions([
        { label: 'In Favor / Yes', sublabel: 'Adopt Motion' },
        { label: 'Against / No', sublabel: 'Reject Motion' },
        { label: 'Abstain', sublabel: 'Neutral' },
      ]);
    } else if (cat === 'mun_resolution_rollcall') {
      const activeRes = sessionState.resolutions[0];
      setTitle(activeRes ? `Substantive Roll Call: ${activeRes.code} — ${activeRes.title}` : 'Formal Resolution Roll Call Vote');
      setRuleMode('roll_call');
      setOptions([
        { label: 'Yes', sublabel: 'Adopt Resolution' },
        { label: 'No', sublabel: 'Reject / Veto' },
        { label: 'Abstain', sublabel: 'Abstention' },
        { label: 'Pass', sublabel: 'Pass on 1st Call' },
      ]);
    } else if (cat === 'lok_sabha_division') {
      setTitle('Lok Sabha Division Vote: Digital Sovereignty & Youth AI Bill');
      setRuleMode('division_voice_vote');
      setOptions([
        { label: 'AYES (In Favor)', sublabel: 'Adopt Bill / Motion' },
        { label: 'NOES (Against)', sublabel: 'Reject Bill / Motion' },
        { label: 'ABSTAIN', sublabel: 'Neutral MP' },
      ]);
    } else if (cat === 'open_mic_poll') {
      setTitle('Open Mic: Audience Choice Best Performance');
      setRuleMode('single_choice');
      const performerOptions = stagePerformers.length > 0
        ? stagePerformers.map((p) => ({ label: `${p.performerName} — "${p.actTitle}"`, sublabel: p.genre }))
        : [
            { label: 'Performer 1 — Spoken Word', sublabel: 'Poetry' },
            { label: 'Performer 2 — Acoustic Solo', sublabel: 'Music' },
            { label: 'Performer 3 — Standup Act', sublabel: 'Comedy' },
          ];
      setOptions(performerOptions);
    } else if (cat === 'performer_rating') {
      const currentPerformer = stagePerformers.find((p) => p.status === 'on_stage') || stagePerformers[0];
      setSelectedPerformerId(currentPerformer?.id || '');
      setTitle(`Live Scorecard: ${currentPerformer?.performerName || 'Current Performer'} — "${currentPerformer?.actTitle || 'Stage Act'}"`);
      setRuleMode('star_rating');
      setOptions([]);
    } else if (cat === 'pitch_evaluation') {
      setTitle('Jury Venture Ballot: Climate BioTech Pitch');
      setRuleMode('star_rating');
      setOptions([
        { label: 'Fund & Advance', sublabel: 'Strong Conviction' },
        { label: 'Syndicate Review', sublabel: 'Needs Due Diligence' },
        { label: 'Pass', sublabel: 'Not Ready' },
      ]);
    } else if (cat === 'quick_referendum') {
      setTitle('Assembly Quick Referendum / Floor Consensus');
      setRuleMode('single_choice');
      setOptions([
        { label: 'Option A — Proceed Immediately' },
        { label: 'Option B — Extend Floor Deliberation by 15 mins' },
        { label: 'Option C — Adjourn to Working Groups' },
      ]);
    } else {
      setTitle('Universal Chamber Custom Ballot');
      setRuleMode('single_choice');
      setOptions([
        { label: 'In Accordance / Approve', sublabel: 'Primary Resolution' },
        { label: 'Disapprove / Dissent', sublabel: 'Alternative Proposal' },
        { label: 'Abstain', sublabel: 'Neutral' }
      ]);
    }
  };

  const addOption = () => {
    if (options.length < 8) {
      setOptions([...options, { label: `Option ${options.length + 1}` }]);
    }
  };

  const removeOption = (index: number) => {
    if (options.length > 2) {
      setOptions(options.filter((_, i) => i !== index));
    }
  };

  const updateOption = (index: number, label: string, sublabel?: string) => {
    setOptions(options.map((opt, i) => (i === index ? { ...opt, label, sublabel } : opt)));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return;

    const selectedPerformer = stagePerformers.find((p) => p.id === selectedPerformerId);

    launchVotingSession({
      title: title.trim(),
      description: description.trim() || undefined,
      category,
      ruleMode,
      durationSeconds,
      options: options.length > 0 ? options : [{ label: 'Score 1 to 10' }],
      performerTarget: selectedPerformer ? {
        id: selectedPerformer.id,
        name: selectedPerformer.performerName,
        actTitle: selectedPerformer.actTitle,
      } : undefined,
    });

    onClose();
  };

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 overflow-y-auto flex flex-col justify-start sm:justify-center items-center p-3 sm:p-6 select-none">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          className="fixed inset-0 bg-black/85 backdrop-blur-xl"
        />

        {/* Modal Container */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 20 }}
          className="relative w-full max-w-2xl my-auto max-h-[92vh] bg-[#090a0f] border border-white/20 rounded-3xl shadow-2xl flex flex-col overflow-hidden z-10 text-white"
        >
          {/* Header */}
          <div className="p-5 sm:p-6 border-b border-white/10 flex items-center justify-between bg-white/[0.02]">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-2xl bg-amber-500/15 border border-amber-500/30 flex items-center justify-center text-amber-400">
                <Vote className="w-5 h-5" />
              </div>
              <div>
                <h2 className="font-display font-bold text-lg text-white flex items-center gap-2">
                  <span>Launch Live Voting Session</span>
                  <span className="text-[10px] font-mono font-semibold px-2 py-0.5 rounded-full bg-amber-500/20 text-amber-300 border border-amber-500/40">
                    Dais Host
                  </span>
                </h2>
                <p className="text-xs text-neutral-400">
                  Host live ballots, roll calls, audience polls, or judge scoring for your chamber.
                </p>
              </div>
            </div>

            <button
              type="button"
              onClick={onClose}
              className="p-2 rounded-xl bg-white/5 hover:bg-white/10 text-neutral-400 hover:text-white transition cursor-pointer"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          {/* Form Content */}
          <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto p-5 sm:p-7 space-y-6">
            
            {/* 1. Category Selector */}
            <div className="space-y-2">
              <label className="text-xs font-mono font-bold text-neutral-300 uppercase tracking-wider block">
                1. Select Voting Format
              </label>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                {[
                  { id: 'mun_motion' as const, label: '🏛️ MUN Motion', sub: 'Simple / 2/3rds Majority' },
                  { id: 'mun_resolution_rollcall' as const, label: '📜 Roll Call Vote', sub: 'Yes / No / Veto / Abstain' },
                  { id: 'lok_sabha_division' as const, label: '🇮🇳 Lok Sabha Division', sub: 'Ayes vs Noes Voice Vote' },
                  { id: 'open_mic_poll' as const, label: '🎤 Open Mic Poll', sub: 'Audience Favorite Act' },
                  { id: 'performer_rating' as const, label: '⭐ Stage Scorecard', sub: '1-10 Live Star Rating' },
                  { id: 'pitch_evaluation' as const, label: '🚀 Venture Ballot', sub: 'Startup Demo Rating' },
                  { id: 'quick_referendum' as const, label: '🗳️ Quick Referendum', sub: 'Custom Multi-Choice' },
                  { id: 'other_vote' as const, label: '✨ Custom / Other', sub: 'Open Assembly Ballot' },
                ].map((item) => (
                  <button
                    key={item.id}
                    type="button"
                    onClick={() => handleCategoryChange(item.id)}
                    className={`p-3 rounded-2xl text-left border transition-all cursor-pointer ${
                      category === item.id
                        ? 'bg-amber-500/15 border-amber-500 text-white shadow-[0_0_15px_rgba(245,158,11,0.2)]'
                        : 'bg-white/[0.03] border-white/10 text-neutral-400 hover:border-white/20 hover:text-white'
                    }`}
                  >
                    <span className="font-bold text-xs block text-white">{item.label}</span>
                    <span className="text-[10px] text-neutral-400 font-mono block mt-0.5">{item.sub}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* 2. Title & Subject */}
            <div className="space-y-2">
              <label className="text-xs font-mono font-bold text-neutral-300 uppercase tracking-wider block">
                2. Motion / Voting Title *
              </label>
              <input
                type="text"
                required
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="e.g. Vote on Motion for Moderated Caucus on Cyber Security"
                className="w-full bg-black/60 border border-white/15 rounded-2xl px-4 py-3 text-sm text-white placeholder-neutral-500 focus:outline-none focus:border-amber-400 font-medium"
              />
            </div>

            {/* Optional Description */}
            <div className="space-y-2">
              <label className="text-xs font-mono text-neutral-400 block">
                Background Note / Clause Reference (Optional)
              </label>
              <input
                type="text"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="e.g. Requires 50%+1 of present delegates. Abstentions do not affect outcome."
                className="w-full bg-black/60 border border-white/10 rounded-2xl px-4 py-2 text-xs text-white placeholder-neutral-500 focus:outline-none focus:border-amber-400"
              />
            </div>

            {/* 3. Duration Selector */}
            <div className="space-y-2">
              <label className="text-xs font-mono font-bold text-neutral-300 uppercase tracking-wider block">
                3. Voting Floor Duration
              </label>
              <div className="grid grid-cols-4 gap-2">
                {[
                  { label: '30s (Rapid)', val: 30 },
                  { label: '60s (Standard)', val: 60 },
                  { label: '90s (Roll Call)', val: 90 },
                  { label: '3 mins (Extended)', val: 180 },
                ].map((t) => (
                  <button
                    key={t.val}
                    type="button"
                    onClick={() => setDurationSeconds(t.val)}
                    className={`py-2 px-2 rounded-xl text-center font-mono text-xs border transition cursor-pointer ${
                      durationSeconds === t.val
                        ? 'bg-white text-black font-bold border-white shadow-md'
                        : 'bg-white/[0.03] border-white/10 text-neutral-400 hover:text-white'
                    }`}
                  >
                    {t.label}
                  </button>
                ))}
              </div>
            </div>

            {/* 4. Options List (For choice polls) */}
            {category !== 'performer_rating' && (
              <div className="space-y-3 pt-2 border-t border-white/10">
                <div className="flex items-center justify-between">
                  <label className="text-xs font-mono font-bold text-neutral-300 uppercase tracking-wider">
                    Ballot Options ({options.length})
                  </label>
                  {category === 'quick_referendum' && (
                    <button
                      type="button"
                      onClick={addOption}
                      className="text-[11px] font-mono text-amber-400 hover:underline flex items-center gap-1 cursor-pointer"
                    >
                      <Plus className="w-3.5 h-3.5" />
                      <span>Add Option</span>
                    </button>
                  )}
                </div>

                <div className="space-y-2">
                  {options.map((opt, idx) => (
                    <div key={idx} className="flex items-center gap-2">
                      <div className="w-6 h-6 rounded-lg bg-white/5 border border-white/10 flex items-center justify-center font-mono text-xs text-neutral-400 shrink-0">
                        {idx + 1}
                      </div>
                      <input
                        type="text"
                        value={opt.label}
                        onChange={(e) => updateOption(idx, e.target.value, opt.sublabel)}
                        placeholder={`Option ${idx + 1}`}
                        className="flex-1 bg-black/60 border border-white/10 rounded-xl px-3 py-2 text-xs text-white placeholder-neutral-500 focus:outline-none focus:border-amber-400"
                      />
                      {category === 'quick_referendum' && options.length > 2 && (
                        <button
                          type="button"
                          onClick={() => removeOption(idx)}
                          className="p-2 text-neutral-500 hover:text-rose-400 transition cursor-pointer"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Submit Action */}
            <div className="pt-4 border-t border-white/10 flex items-center justify-end gap-3">
              <button
                type="button"
                onClick={onClose}
                className="px-5 py-2.5 rounded-2xl bg-white/5 hover:bg-white/10 text-neutral-300 text-xs font-semibold transition cursor-pointer"
              >
                Cancel
              </button>

              <button
                type="submit"
                className="px-7 py-2.5 rounded-2xl bg-gradient-to-r from-amber-400 via-rose-500 to-purple-600 text-white font-display font-bold text-xs shadow-[0_0_20px_rgba(245,158,11,0.3)] hover:scale-105 transition-all cursor-pointer flex items-center gap-2"
              >
                <Vote className="w-4 h-4" />
                <span>OPEN LIVE FLOOR VOTE</span>
              </button>
            </div>
          </form>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
