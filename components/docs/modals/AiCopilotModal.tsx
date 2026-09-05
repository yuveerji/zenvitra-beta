'use client';

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Sparkles, Loader2, Wand2, Lightbulb } from 'lucide-react';
import { UN_PREAMBLE_PREFIXES, UN_OPERATIVE_PREFIXES } from '@/lib/docsData';

export interface AiCopilotModalProps {
  isOpen: boolean;
  onClose: () => void;
  onInsertHTML: (html: string) => void;
  paperMode: 'light' | 'dark';
  onToast: (msg: string) => void;
}

const POLICY_SUGGESTIONS = [
  'Independent AI audit nodes and neutral telemetry',
  '25% civic endowment allocation for youth debaters',
  'Multilateral compute subsidies for global south delegations',
  'Cryptographic verifiability of parliamentary notifications'
];

export function AiCopilotModal({
  isOpen,
  onClose,
  onInsertHTML,
  paperMode,
  onToast
}: AiCopilotModalProps) {
  const [promptInput, setPromptInput] = useState<string>('');
  const [isGenerating, setIsGenerating] = useState<boolean>(false);

  // Close on Escape key (unless currently generating)
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen && !isGenerating) {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, isGenerating, onClose]);

  const handleGenerateAndInsert = () => {
    const cleanPrompt = promptInput.trim();
    if (!cleanPrompt || isGenerating) return;

    setIsGenerating(true);

    setTimeout(() => {
      const textColor = paperMode === 'light' ? '#1f2937' : '#e5e7eb';
      const subTextColor = paperMode === 'light' ? '#374151' : '#9ca3af';

      // Pick dynamic authentic UN prefixes
      const preamble1 = UN_PREAMBLE_PREFIXES[Math.floor(Math.random() * 5)] || 'Guided by';
      const preamble2 = UN_PREAMBLE_PREFIXES[20] || 'Reaffirming';
      const operative1 = UN_OPERATIVE_PREFIXES[5] || 'Calls upon';
      const operative2 = UN_OPERATIVE_PREFIXES[14] || 'Decides';

      const generatedHtml = `
<p style="font-size: 14px; line-height: 1.8; color: ${textColor}; margin-bottom: 12px;">
  <strong style="text-decoration: underline;">${preamble1}</strong> the sovereign equality of all Member States and the urgent necessity of upholding transparent, verifiable multilateral governance,
</p>
<p style="font-size: 14px; line-height: 1.8; color: ${textColor}; margin-bottom: 14px;">
  <strong style="text-decoration: underline;">${preamble2}</strong> with the utmost conviction that ${cleanPrompt.replace(/\.$/, '')},
</p>
<p style="font-size: 14px; line-height: 1.8; color: ${textColor}; margin-bottom: 8px;">
  <strong>1. <span style="text-decoration: underline;">${operative1}</span></strong> all delegations and statutory authorities to formulate verifiable international standards addressing these critical mandates;
</p>
<ul style="font-size: 13px; line-height: 1.8; margin-left: 28px; color: ${subTextColor}; margin-bottom: 14px;">
  <li>(a) Establishing open, tamper-proof telemetry audits across civic and judicial interfaces;</li>
  <li>(b) Subsidizing neutral verification nodes for academic institutions and youth debate forums;</li>
  <li>(c) Ensuring zero secret extraterritorial telemetry extraction without plenipotentiary consent;</li>
</ul>
<p style="font-size: 14px; line-height: 1.8; color: ${textColor}; margin-bottom: 12px;">
  <strong>2. <span style="text-decoration: underline;">${operative2}</span></strong> to remain actively seized of the matter.
</p>`.trim();

      onInsertHTML(generatedHtml);
      setIsGenerating(false);
      setPromptInput('');
      onToast('AI Diplomatic Clauses Generated & Inserted');
      onClose();
    }, 800);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if ((e.metaKey || e.ctrlKey) && e.key === 'Enter') {
      e.preventDefault();
      handleGenerateAndInsert();
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.15 }}
          onClick={() => {
            if (!isGenerating) onClose();
          }}
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md"
          role="dialog"
          aria-modal="true"
          aria-labelledby="copilot-modal-title"
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            transition={{ type: 'spring', damping: 25, stiffness: 350 }}
            onClick={(e) => e.stopPropagation()}
            className="w-full max-w-lg rounded-3xl bg-[#0b0e17] border border-amber-500/40 p-6 sm:p-8 space-y-6 shadow-2xl relative text-left shadow-amber-950/20"
          >
            {/* Header */}
            <div className="flex items-center justify-between border-b border-white/10 pb-4">
              <div className="space-y-1">
                <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-amber-500/20 text-amber-300 font-mono text-[10px] uppercase font-bold border border-amber-500/30">
                  <Sparkles className="w-3 h-3 text-amber-400" />
                  <span>SOVEREIGN DIPLOMATIC COPILOT</span>
                </div>
                <h3 id="copilot-modal-title" className="text-xl font-bold font-display text-white">
                  Generate Diplomatic Clauses
                </h3>
              </div>
              <button
                type="button"
                onClick={onClose}
                disabled={isGenerating}
                title="Close modal"
                className="p-2 rounded-xl bg-white/5 hover:bg-white/10 text-neutral-400 hover:text-white transition cursor-pointer disabled:opacity-40"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="space-y-4">
              <p className="text-xs text-neutral-300 font-sans leading-relaxed">
                Enter your key policy ideas, debate notes, or treaty objectives below. The Sovereign AI Assistant will
                transform them into structured UN preambular and operative clauses formatted directly for your document.
              </p>

              {/* Quick Idea Presets */}
              <div className="space-y-1.5">
                <div className="flex items-center gap-1.5 text-[10px] font-mono text-neutral-400 uppercase font-semibold">
                  <Lightbulb className="w-3 h-3 text-amber-400" />
                  <span>Quick Policy Sparks</span>
                </div>
                <div className="flex flex-wrap gap-1.5">
                  {POLICY_SUGGESTIONS.map((suggestion) => (
                    <button
                      key={suggestion}
                      type="button"
                      onClick={() => setPromptInput(suggestion)}
                      disabled={isGenerating}
                      className="px-2.5 py-1 rounded-lg bg-white/[0.03] hover:bg-amber-500/10 border border-white/10 hover:border-amber-500/30 text-[11px] text-neutral-300 hover:text-amber-300 text-left transition font-mono cursor-pointer disabled:opacity-50"
                    >
                      + {suggestion}
                    </button>
                  ))}
                </div>
              </div>

              {/* Prompt Textarea */}
              <div className="space-y-1">
                <textarea
                  rows={4}
                  value={promptInput}
                  onChange={(e) => setPromptInput(e.target.value)}
                  onKeyDown={handleKeyDown}
                  disabled={isGenerating}
                  placeholder="e.g. Member states should share AI safety benchmarks and subsidize neutral compute centers for youth..."
                  className="w-full px-4 py-3 rounded-2xl bg-black/60 border border-white/15 text-xs text-white placeholder:text-neutral-500 focus:border-amber-400 focus:outline-none resize-none font-mono transition disabled:opacity-50"
                />
                <div className="flex justify-between items-center px-1 text-[10px] font-mono text-neutral-500">
                  <span>Press Ctrl+Enter to generate</span>
                  <span>{promptInput.length} chars</span>
                </div>
              </div>

              {/* Actions */}
              <div className="flex items-center justify-end gap-3 pt-2">
                <button
                  type="button"
                  onClick={onClose}
                  disabled={isGenerating}
                  className="px-4 py-2 rounded-xl bg-white/10 hover:bg-white/15 text-neutral-300 hover:text-white text-xs font-mono transition cursor-pointer disabled:opacity-40"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={handleGenerateAndInsert}
                  disabled={isGenerating || !promptInput.trim()}
                  className="px-5 py-2 rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-black font-mono text-xs font-bold transition flex items-center gap-1.5 cursor-pointer disabled:opacity-50 shadow-lg shadow-amber-500/20"
                >
                  {isGenerating ? (
                    <>
                      <Loader2 className="w-3.5 h-3.5 animate-spin text-black" />
                      <span>Drafting Clauses...</span>
                    </>
                  ) : (
                    <>
                      <Wand2 className="w-3.5 h-3.5 text-black" />
                      <span>Generate &amp; Insert</span>
                    </>
                  )}
                </button>
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
