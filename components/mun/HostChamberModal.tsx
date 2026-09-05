'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Crown,
  X,
  Sparkles,
  Globe2,
  Mic,
  Zap,
  Vote,
  ShieldCheck,
  Layers,
  Plus
} from 'lucide-react';
import { useMun } from '@/context/MunContext';
import { ChamberCategory } from '@/types/mun';

interface HostChamberModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function HostChamberModal({ isOpen, onClose }: HostChamberModalProps) {
  const { createChamberRoom } = useMun();

  const [category, setCategory] = useState<ChamberCategory>('MUN_COMMITTEE');
  const [title, setTitle] = useState('');
  const [agenda, setAgenda] = useState('');

  if (!isOpen) return null;

  const handleCategorySelect = (cat: ChamberCategory) => {
    setCategory(cat);
    if (cat === 'MUN_COMMITTEE') {
      setTitle('UN Human Rights Council (UNHRC) — Universal Digital Rights');
      setAgenda('Protection of Sovereign Data Privacy, Free Speech & Youth Political Participation');
    } else if (cat === 'LOK_SABHA') {
      setTitle('Lok Sabha (House of the People) — Youth Parliamentary Session');
      setAgenda('National Digital Sovereignty, AI Ethics & Youth Entrepreneurship Promotion Bill');
    } else if (cat === 'OPEN_MIC') {
      setTitle('Geneva Midnight Youth Open Mic & Poetry Slam');
      setAgenda('Acoustic sets, spoken word poetry, and live storytelling from youth delegations');
    } else if (cat === 'PITCH_STAGE') {
      setTitle('Global Climate & DeepTech Sovereign Pitch Arena');
      setAgenda('Lightning 3-minute founder demos and real-time investor jury venture balloting');
    } else if (cat === 'GENERAL_VOTING') {
      setTitle('Youth Assembly Direct Referendum & Governance Polls');
      setAgenda('Community-wide consensus voting on youth resolution amendments and proposals');
    } else {
      setTitle('Universal Multidisciplinary Youth Assembly & Round Table');
      setAgenda('Cross-sector student discourse, creative policy frameworks, and open collaboration');
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !agenda.trim()) return;

    createChamberRoom(title.trim(), category, agenda.trim());
    onClose();
  };

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 select-none overflow-y-auto">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          className="fixed inset-0 bg-black/85 backdrop-blur-xl"
        />

        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 20 }}
          className="relative w-full max-w-xl bg-[#090a0f] border border-white/20 rounded-3xl p-6 sm:p-8 shadow-2xl z-10 space-y-6 text-white"
        >
          <div className="flex items-center justify-between border-b border-white/10 pb-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-2xl bg-amber-500/15 border border-amber-500/30 flex items-center justify-center text-amber-400">
                <Crown className="w-5 h-5" />
              </div>
              <div>
                <h2 className="font-display font-bold text-lg text-white">
                  Host New Chamber or Stage
                </h2>
                <p className="text-xs text-neutral-400">
                  Create a live room for MUN committees, Lok Sabha, open mics, pitches, or custom forums.
                </p>
              </div>
            </div>

            <button
              type="button"
              onClick={onClose}
              className="p-1.5 rounded-xl bg-white/5 hover:bg-white/10 text-neutral-400 hover:text-white transition cursor-pointer"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5">
            {/* 1. Chamber Category */}
            <div className="space-y-2">
              <label className="text-xs font-mono font-bold text-neutral-300 uppercase tracking-wider block">
                1. Chamber Format
              </label>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                {[
                  { id: 'MUN_COMMITTEE' as const, label: '🏛️ MUN Committee', desc: 'Motions, GSL, Roll Call' },
                  { id: 'LOK_SABHA' as const, label: '🇮🇳 Lok Sabha', desc: 'Bills, Zero Hour, Division' },
                  { id: 'OPEN_MIC' as const, label: '🎤 Open Mic Stage', desc: 'Performers, Claps, Polls' },
                  { id: 'PITCH_STAGE' as const, label: '🚀 Pitch Arena', desc: '3-Min Demos, Jury Scorecards' },
                  { id: 'GENERAL_VOTING' as const, label: '🗳️ Referendum', desc: 'Direct Assembly Consensus' },
                  { id: 'OTHER' as const, label: '✨ Other / Custom', desc: 'Roundtable, Forum, Assembly' },
                ].map((item) => (
                  <button
                    key={item.id}
                    type="button"
                    onClick={() => handleCategorySelect(item.id)}
                    className={`p-3 rounded-2xl text-left border transition-all cursor-pointer ${
                      category === item.id
                        ? 'bg-amber-500/15 border-amber-500 text-white shadow-[0_0_15px_rgba(245,158,11,0.2)]'
                        : 'bg-white/[0.03] border-white/10 text-neutral-400 hover:text-white hover:border-white/20'
                    }`}
                  >
                    <span className="font-bold text-xs block text-white">{item.label}</span>
                    <span className="text-[10px] text-neutral-400 font-mono block mt-0.5">{item.desc}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* 2. Room Title */}
            <div className="space-y-2">
              <label className="text-xs font-mono font-bold text-neutral-300 uppercase tracking-wider block">
                2. Chamber / Stage Title *
              </label>
              <input
                type="text"
                required
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="e.g. UN Human Rights Council Plenary"
                className="w-full bg-black/60 border border-white/15 rounded-2xl px-4 py-2.5 text-xs text-white placeholder-neutral-500 focus:outline-none focus:border-amber-400"
              />
            </div>

            {/* 3. Agenda / Mandate */}
            <div className="space-y-2">
              <label className="text-xs font-mono font-bold text-neutral-300 uppercase tracking-wider block">
                3. Agenda Mandate / Theme *
              </label>
              <textarea
                required
                rows={3}
                value={agenda}
                onChange={(e) => setAgenda(e.target.value)}
                placeholder="Define the primary agenda, theme, or rules of deliberation..."
                className="w-full bg-black/60 border border-white/15 rounded-2xl p-3.5 text-xs text-white placeholder-neutral-500 focus:outline-none focus:border-amber-400 leading-relaxed resize-none"
              />
            </div>

            <div className="pt-4 border-t border-white/10 flex justify-end gap-3">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 rounded-xl bg-white/5 text-neutral-400 hover:text-white text-xs transition"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-7 py-2.5 rounded-2xl bg-gradient-to-r from-amber-400 via-rose-500 to-purple-600 text-white font-display font-bold text-xs shadow-md hover:scale-105 transition cursor-pointer"
              >
                Launch Chamber
              </button>
            </div>
          </form>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
