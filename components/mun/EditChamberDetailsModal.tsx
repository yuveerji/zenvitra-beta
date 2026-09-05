'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Edit3,
  X,
  Plus,
  Trash2,
  Check,
  Globe2,
  Sparkles,
  Layers,
  Users,
  ShieldCheck
} from 'lucide-react';
import { useMun } from '@/context/MunContext';
import { MunCommitteeType } from '@/types/mun';

interface EditChamberDetailsModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function EditChamberDetailsModal({ isOpen, onClose }: EditChamberDetailsModalProps) {
  const { activeCommitteeId, getCommitteeById, committees, updateCommitteeDetails } = useMun();
  const committee = getCommitteeById(activeCommitteeId) || committees[0];

  const [name, setName] = useState(committee?.name || '');
  const [shortName, setShortName] = useState(committee?.shortName || '');
  const [type, setType] = useState<MunCommitteeType>(committee?.type || 'OTHER');
  const [agenda, setAgenda] = useState(committee?.agenda || '');
  const [newPortfolio, setNewPortfolio] = useState('');
  const [portfolios, setPortfolios] = useState<string[]>([
    'President of the Assembly',
    'Delegate of France',
    'Delegate of United States',
    'Delegate of India',
    'Delegate of Germany',
    'Chief Diplomatic Envoy',
    'Lead Policy Analyst'
  ]);

  if (!isOpen) return null;

  const handleAddPortfolio = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newPortfolio.trim()) return;
    if (!portfolios.includes(newPortfolio.trim())) {
      setPortfolios([...portfolios, newPortfolio.trim()]);
    }
    setNewPortfolio('');
  };

  const handleRemovePortfolio = (item: string) => {
    setPortfolios(portfolios.filter((p) => p !== item));
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !agenda.trim()) return;

    if (updateCommitteeDetails) {
      updateCommitteeDetails(activeCommitteeId, {
        name: name.trim(),
        shortName: shortName.trim() || name.slice(0, 8).toUpperCase(),
        type,
        agenda: agenda.trim()
      });
    }

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

        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 20 }}
          className="relative w-full max-w-xl my-auto max-h-[92vh] bg-[#090a0f] border border-amber-500/30 rounded-3xl shadow-2xl flex flex-col overflow-hidden z-10 text-white"
        >
          {/* Header */}
          <div className="p-5 sm:p-6 border-b border-white/10 flex items-center justify-between bg-white/[0.02]">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-2xl bg-amber-500/15 border border-amber-500/30 flex items-center justify-center text-amber-400">
                <Edit3 className="w-5 h-5" />
              </div>
              <div>
                <h2 className="font-display font-bold text-lg text-white">
                  Customize Committee, Agenda &amp; Portfolios
                </h2>
                <p className="text-xs text-neutral-400">
                  Type your own custom committee title, set the floor agenda, and add custom portfolios.
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

          <form onSubmit={handleSave} className="p-5 sm:p-7 space-y-5 overflow-y-auto max-h-[75vh]">
            {/* 1. Committee Name */}
            <div className="space-y-1.5">
              <label className="text-xs font-mono font-bold text-neutral-300 uppercase tracking-wider block">
                1. Custom Committee / Chamber Name *
              </label>
              <input
                type="text"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="e.g. All India Political Parties Meet (AIPPM) or Custom Crisis Assembly"
                className="w-full bg-black/60 border border-white/15 rounded-2xl px-4 py-3 text-xs sm:text-sm text-white placeholder-neutral-500 focus:outline-none focus:border-amber-400 font-sans font-bold"
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1.5">
                <label className="text-xs font-mono font-bold text-neutral-300 uppercase tracking-wider block">
                  Short Tag / Acronym
                </label>
                <input
                  type="text"
                  value={shortName}
                  onChange={(e) => setShortName(e.target.value)}
                  placeholder="e.g. AIPPM, HCC, LOK_SABHA"
                  className="w-full bg-black/60 border border-white/15 rounded-xl px-3 py-2 text-xs text-white placeholder-neutral-500 focus:outline-none focus:border-amber-400 font-mono"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-mono font-bold text-neutral-300 uppercase tracking-wider block">
                  Chamber Category
                </label>
                <select
                  value={type}
                  onChange={(e) => setType(e.target.value as MunCommitteeType)}
                  className="w-full bg-neutral-900 border border-white/15 rounded-xl px-3 py-2 text-xs text-white focus:outline-none cursor-pointer font-sans"
                >
                  <option value="OTHER">✨ Other / Custom Forum</option>
                  <option value="LOK_SABHA">🇮🇳 Lok Sabha / Parliamentary</option>
                  <option value="UNSC">🏛️ UN Security Council (UNSC)</option>
                  <option value="UNGA">🏛️ UN General Assembly (UNGA)</option>
                  <option value="UNHRC">🏛️ UN Human Rights Council</option>
                  <option value="UNODC">🏛️ UNODC (Drugs &amp; Crime)</option>
                  <option value="DISEC">🏛️ DISEC (Disarmament)</option>
                  <option value="ECOSOC">🏛️ ECOSOC (Economic &amp; Social)</option>
                  <option value="AIPPM">🇮🇳 AIPPM (Political Parties)</option>
                </select>
              </div>
            </div>

            {/* 2. Custom Agenda Mandate */}
            <div className="space-y-1.5">
              <label className="text-xs font-mono font-bold text-neutral-300 uppercase tracking-wider block">
                2. Custom Agenda / Deliberation Mandate *
              </label>
              <textarea
                required
                rows={3}
                value={agenda}
                onChange={(e) => setAgenda(e.target.value)}
                placeholder="Type the exact debate agenda, resolution mandate, or discussion theme..."
                className="w-full bg-black/60 border border-white/15 rounded-2xl p-3.5 text-xs sm:text-sm text-white placeholder-neutral-500 focus:outline-none focus:border-amber-400 font-mono leading-relaxed resize-none"
              />
            </div>

            {/* 3. Custom Portfolios & Delegations Matrix */}
            <div className="space-y-2">
              <label className="text-xs font-mono font-bold text-neutral-300 uppercase tracking-wider flex items-center justify-between">
                <span>3. Custom Portfolios &amp; Delegations ({portfolios.length})</span>
                <span className="text-[10px] text-neutral-500 font-normal">Add custom roles</span>
              </label>

              {/* Add portfolio input */}
              <div className="flex items-center gap-2">
                <input
                  type="text"
                  value={newPortfolio}
                  onChange={(e) => setNewPortfolio(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') {
                      e.preventDefault();
                      handleAddPortfolio(e);
                    }
                  }}
                  placeholder="e.g. Minister of Finance, Delegate of Japan, Chief Justice..."
                  className="flex-1 bg-black/60 border border-white/15 rounded-xl px-3 py-2 text-xs text-white placeholder-neutral-500 focus:outline-none focus:border-amber-400"
                />
                <button
                  type="button"
                  onClick={handleAddPortfolio}
                  className="px-3.5 py-2 rounded-xl bg-amber-400 hover:bg-amber-300 text-black font-mono font-bold text-xs flex items-center gap-1 transition cursor-pointer"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>Add</span>
                </button>
              </div>

              {/* Portfolios Chip list */}
              <div className="flex flex-wrap gap-2 max-h-36 overflow-y-auto p-2 rounded-2xl bg-black/40 border border-white/10">
                {portfolios.map((p) => (
                  <span
                    key={p}
                    className="px-2.5 py-1 rounded-xl bg-white/[0.04] border border-white/10 text-xs font-mono text-neutral-200 flex items-center gap-1.5 hover:border-white/20"
                  >
                    <span>{p}</span>
                    <button
                      type="button"
                      onClick={() => handleRemovePortfolio(p)}
                      className="text-neutral-500 hover:text-rose-400 transition"
                      title="Remove"
                    >
                      <X className="w-3 h-3" />
                    </button>
                  </span>
                ))}
              </div>
            </div>

            {/* Footer buttons */}
            <div className="pt-3 border-t border-white/10 flex items-center justify-end gap-3">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2.5 rounded-xl bg-white/5 text-neutral-400 hover:text-white text-xs transition"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-6 py-2.5 rounded-2xl bg-amber-400 hover:bg-amber-300 text-black font-display font-bold text-xs shadow-md transition cursor-pointer flex items-center gap-1.5"
              >
                <Check className="w-4 h-4" />
                <span>Save Chamber Settings</span>
              </button>
            </div>
          </form>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
