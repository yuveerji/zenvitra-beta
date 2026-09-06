'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, MessageSquare, Sparkles, Radio, HelpCircle, Tag, Plus, Check } from 'lucide-react';
import { OpenDiscussion, DiscussionCategory } from '@/types/discussions';
import { useAuth } from '@/context/AuthContext';

interface CreateDiscussionModalProps {
  isOpen: boolean;
  onClose: () => void;
  onDiscussionCreated: (disc: OpenDiscussion) => void;
}

const CATEGORY_OPTIONS: { cat: DiscussionCategory; label: string }[] = [
  { cat: 'MARVEL', label: 'Marvel, Multiverse & Pop Culture Geopolitics' },
  { cat: 'EDUCATION', label: 'Education & Academic Reform' },
  { cat: 'AI', label: 'Artificial Intelligence & Ethics' },
  { cat: 'ENVIRONMENT', label: 'Climate Crisis & Energy Transition' },
  { cat: 'GLOBAL_AFFAIRS', label: 'Geopolitics, Peacekeeping & MUN' },
  { cat: 'HUMAN_RIGHTS', label: 'Human Rights & Free Press' },
  { cat: 'GOVERNANCE', label: 'Youth Governance & Policy' },
];

export function CreateDiscussionModal({ isOpen, onClose, onDiscussionCreated }: CreateDiscussionModalProps) {
  const { profile } = useAuth();

  const [title, setTitle] = useState('');
  const [question, setQuestion] = useState('');
  const [contextSummary, setContextSummary] = useState('');
  const [category, setCategory] = useState<DiscussionCategory>('EDUCATION');
  const [tagInput, setTagInput] = useState('');

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !question.trim()) return;

    const tags = tagInput
      .split(',')
      .map(t => t.trim().replace(/^#/, ''))
      .filter(Boolean);

    const newDiscussion: OpenDiscussion = {
      id: `disc-${Date.now()}`,
      title: title.trim(),
      slug: title.toLowerCase().replace(/[^a-z0-9]+/g, '-').slice(0, 60),
      question: question.trim(),
      contextSummary: contextSummary.trim() || 'A critical public discussion opened for youth delegates, debaters, and civic researchers.',
      category,
      tags: tags.length > 0 ? tags : ['YouthPolicy', 'PublicDiscourse'],
      authorId: profile?.id || 'usr-anon',
      authorName: profile?.display_name || 'Student Delegate',
      authorUsername: profile?.username || 'delegate_author',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      viewCount: 1,
      participantCount: 1,
      proCount: 0,
      conCount: 0,
      evidenceCount: 0,
      isFeatured: false,
      status: 'ACTIVE',
      arguments: []
    };

    onDiscussionCreated(newDiscussion);
    onClose();
  };

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 overflow-y-auto">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          className="fixed inset-0 bg-black/85 backdrop-blur-md cursor-pointer"
        />

        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 20 }}
          className="relative w-full max-w-2xl rounded-3xl bg-[#08090e] border border-white/20 p-5 sm:p-8 shadow-[0_30px_100px_rgba(0,0,0,0.95)] z-10 text-left space-y-6 my-auto"
        >
          {/* Header */}
          <div className="flex items-start justify-between gap-4 border-b border-white/10 pb-4">
            <div>
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[10px] font-mono font-bold uppercase tracking-widest text-purple-300 bg-purple-500/10 border border-purple-500/30">
                <Radio className="w-3.5 h-3.5 text-purple-400" />
                OPEN TOPIC DELIBERATION
              </span>
              <h2 className="text-xl sm:text-2xl font-display font-bold text-white tracking-tight pt-1">
                Start a Structured Topic Discussion
              </h2>
              <p className="text-xs font-mono text-neutral-400">
                Pose a critical question for global delegates, provide background context, and invite affirmative/counter arguments.
              </p>
            </div>

            <button
              type="button"
              onClick={onClose}
              className="p-2 rounded-full bg-white/5 border border-white/10 text-neutral-400 hover:text-white transition cursor-pointer"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Topic Category */}
            <div className="space-y-1.5">
              <label className="text-xs font-mono text-neutral-300 font-bold uppercase tracking-wider block">
                Topic Domain / Assembly Focus
              </label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value as DiscussionCategory)}
                className="w-full px-4 py-2.5 rounded-xl bg-[#0e1017] border border-white/15 text-sm text-white focus:outline-none focus:border-purple-400 cursor-pointer"
              >
                {CATEGORY_OPTIONS.map((c) => (
                  <option key={c.cat} value={c.cat}>{c.label}</option>
                ))}
              </select>
            </div>

            {/* Topic Title */}
            <div className="space-y-1.5">
              <label className="text-xs font-mono text-neutral-300 font-bold uppercase tracking-wider block">
                Topic Title *
              </label>
              <input
                type="text"
                required
                placeholder="e.g. Standardized Competitive Testing vs. Holistic Project Portfolios"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="w-full px-4 py-2.5 rounded-xl bg-white/[0.05] border border-white/15 text-sm text-white focus:outline-none focus:border-purple-400 font-display font-semibold"
              />
            </div>

            {/* Central Debate Question */}
            <div className="space-y-1.5">
              <label className="text-xs font-mono text-purple-300 font-bold uppercase tracking-wider block flex items-center gap-1.5">
                <HelpCircle className="w-3.5 h-3.5 text-purple-400" />
                <span>Central Core Question (The Resolution Query) *</span>
              </label>
              <input
                type="text"
                required
                placeholder="e.g. Should high-stakes rote examinations be legally replaced with peer-reviewed portfolio evaluations in secondary education?"
                value={question}
                onChange={(e) => setQuestion(e.target.value)}
                className="w-full px-4 py-2.5 rounded-xl bg-purple-500/[0.05] border border-purple-500/30 text-sm text-purple-100 focus:outline-none focus:border-purple-400 font-serif italic"
              />
            </div>

            {/* Context Dossier */}
            <div className="space-y-1.5">
              <label className="text-xs font-mono text-neutral-300 font-bold uppercase tracking-wider block">
                Context Summary &amp; Background Dossier
              </label>
              <textarea
                rows={3}
                placeholder="Provide factual background, current statistics, or policy context to ground the debate..."
                value={contextSummary}
                onChange={(e) => setContextSummary(e.target.value)}
                className="w-full px-4 py-2.5 rounded-xl bg-white/[0.05] border border-white/15 text-sm text-white focus:outline-none focus:border-purple-400 resize-none font-sans"
              />
            </div>

            {/* Tags */}
            <div className="space-y-1.5">
              <label className="text-xs font-mono text-neutral-300 font-bold uppercase tracking-wider block flex items-center gap-1.5">
                <Tag className="w-3.5 h-3.5 text-neutral-400" />
                <span>Topic Tags (Comma separated)</span>
              </label>
              <input
                type="text"
                placeholder="e.g. EducationReform, StudentWellness, OECD, ExaminationEthics"
                value={tagInput}
                onChange={(e) => setTagInput(e.target.value)}
                className="w-full px-4 py-2.5 rounded-xl bg-white/[0.05] border border-white/15 text-sm text-white focus:outline-none focus:border-purple-400 font-mono text-xs"
              />
            </div>

            {/* Actions */}
            <div className="flex items-center justify-end gap-3 pt-4 border-t border-white/10">
              <button
                type="button"
                onClick={onClose}
                className="px-5 py-2.5 rounded-full border border-white/15 text-neutral-300 hover:text-white text-xs font-mono transition cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-6 py-2.5 rounded-full bg-gradient-to-r from-purple-500 to-indigo-600 hover:from-purple-400 hover:to-indigo-500 text-white font-display font-bold text-xs uppercase tracking-wider transition shadow-[0_0_20px_rgba(168,85,247,0.4)] cursor-pointer"
              >
                Launch Topic Deliberation
              </button>
            </div>
          </form>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
