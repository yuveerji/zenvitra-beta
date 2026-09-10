'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Edit3, HelpCircle, FileText, Sparkles, Scale, Send, Image as ImageIcon } from 'lucide-react';

export type PostMode = 'WRITE' | 'ASK' | 'REPORT' | 'CREATE' | 'DEBATE';

interface SpatialPostComposerProps {
  onPublish?: (post: { mode: PostMode; title: string; content: string }) => void;
}

export function SpatialPostComposer({ onPublish }: SpatialPostComposerProps) {
  const [activeMode, setActiveMode] = useState<PostMode>('WRITE');
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');

  const modes: { key: PostMode; label: string; icon: any; color: string; placeholder: string }[] = [
    { key: 'WRITE', label: 'WRITE', icon: Edit3, color: 'text-cyan-400 bg-cyan-500/10 border-cyan-500/30', placeholder: 'Draft your perspective, essay, or youth dispatch...' },
    { key: 'ASK', label: 'ASK', icon: HelpCircle, color: 'text-amber-400 bg-amber-500/10 border-amber-500/30', placeholder: 'What crucial question should young minds debate today?' },
    { key: 'REPORT', label: 'REPORT', icon: FileText, color: 'text-emerald-400 bg-emerald-500/10 border-emerald-500/30', placeholder: 'File an on-the-ground report with verified sources...' },
    { key: 'CREATE', label: 'CREATE', icon: Sparkles, color: 'text-purple-400 bg-purple-500/10 border-purple-500/30', placeholder: 'Share a creative project, campaign, or artwork...' },
    { key: 'DEBATE', label: 'DEBATE', icon: Scale, color: 'text-rose-400 bg-rose-500/10 border-rose-500/30', placeholder: 'Frame a formal resolution or controversial policy thesis...' },
  ];

  const currentModeInfo = modes.find((m) => m.key === activeMode) || modes[0];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!content.trim()) return;
    if (onPublish) {
      onPublish({ mode: activeMode, title: title.trim(), content: content.trim() });
    }
    setTitle('');
    setContent('');
  };

  return (
    <div className="rounded-3xl bg-[#08090d]/95 border border-white/[0.08] p-6 space-y-4 backdrop-blur-2xl shadow-2xl">
      <div className="flex items-center justify-between border-b border-white/[0.06] pb-3">
        <span className="font-mono text-xs uppercase tracking-widest text-neutral-400">
          WHAT&apos;S ON YOUR MIND?
        </span>
        <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-mono font-bold uppercase border ${currentModeInfo.color}`}>
          {currentModeInfo.label} MODE
        </span>
      </div>

      {/* Mode Selector Tabs */}
      <div className="grid grid-cols-5 gap-1.5 p-1 rounded-2xl bg-white/[0.02] border border-white/[0.06]">
        {modes.map((m) => {
          const Icon = m.icon;
          const isActive = activeMode === m.key;
          return (
            <button
              key={m.key}
              type="button"
              onClick={() => setActiveMode(m.key)}
              className={`flex flex-col sm:flex-row items-center justify-center gap-1.5 py-2 px-2 rounded-xl text-[10px] font-mono tracking-wider transition-all duration-200 cursor-pointer ${
                isActive
                  ? 'bg-white text-black font-bold shadow-md'
                  : 'text-neutral-400 hover:text-white hover:bg-white/[0.04]'
              }`}
            >
              <Icon className="w-3.5 h-3.5" />
              <span>{m.label}</span>
            </button>
          );
        })}
      </div>

      {/* Dynamic Composer Inputs */}
      <form onSubmit={handleSubmit} className="space-y-3">
        {(activeMode === 'ASK' || activeMode === 'DEBATE' || activeMode === 'REPORT') && (
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder={activeMode === 'DEBATE' ? 'Motion / Thesis Title...' : 'Headline / Topic...'}
            className="w-full px-4 py-2.5 rounded-xl bg-white/[0.02] border border-white/[0.08] text-sm text-white font-outfit placeholder:text-neutral-600 focus:outline-none focus:border-white/20"
          />
        )}

        <textarea
          rows={3}
          value={content}
          onChange={(e) => setContent(e.target.value)}
          placeholder={currentModeInfo.placeholder}
          className="w-full px-4 py-3 rounded-2xl bg-white/[0.02] border border-white/[0.08] text-sm text-neutral-200 font-outfit placeholder:text-neutral-600 focus:outline-none focus:border-white/20 resize-none leading-relaxed"
        />

        <div className="flex items-center justify-between pt-1">
          <div className="flex items-center gap-2 text-neutral-500">
            <button
              type="button"
              className="p-2 rounded-xl bg-white/[0.02] hover:bg-white/[0.06] border border-white/[0.06] text-neutral-400 hover:text-white transition"
              title="Attach Media / Citations"
            >
              <ImageIcon className="w-4 h-4" />
            </button>
            <span className="font-mono text-[10px] text-neutral-500">
              ZERO ALGORITHMIC BIAS
            </span>
          </div>

          <button
            type="submit"
            disabled={!content.trim()}
            className="inline-flex items-center gap-2 px-5 py-2 rounded-full bg-white text-black font-mono font-bold text-xs hover:bg-neutral-200 transition disabled:opacity-40 disabled:cursor-not-allowed shadow-md cursor-pointer"
          >
            <span>BROADCAST</span>
            <Send className="w-3 h-3" />
          </button>
        </div>
      </form>
    </div>
  );
}
