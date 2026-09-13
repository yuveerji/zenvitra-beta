'use client';

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Radio, X, Sparkles, Tag } from 'lucide-react';
import { ZenDocument } from '@/types/docs';

export interface ShareToPulseModalProps {
  isOpen: boolean;
  onClose: () => void;
  activeDoc: ZenDocument;
  onConfirmPublish: (caucusTag: string, summary: string) => void;
  onToast: (msg: string) => void;
}

export function ShareToPulseModal({
  isOpen,
  onClose,
  activeDoc,
  onConfirmPublish,
  onToast,
}: ShareToPulseModalProps) {
  const [caucusTag, setCaucusTag] = useState('General Assembly');
  const [summary, setSummary] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (activeDoc) {
      const sponsors = (activeDoc.leadSponsors || ['Primary Delegation']).join(', ');
      setSummary(
        `📜 Resolution ${activeDoc.docCode}: "${activeDoc.title}". Sponsored by ${sponsors}. Open for diplomatic deliberation, co-signatures, and redline amendments.`
      );
      setCaucusTag(activeDoc.committeeOrChamber || 'General Assembly');
    }
  }, [activeDoc]);

  // Close on Escape key
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen && !isSubmitting) {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, isSubmitting, onClose]);

  const handleBroadcast = () => {
    if (!summary.trim() || isSubmitting) return;
    setIsSubmitting(true);
    setTimeout(() => {
      onConfirmPublish(caucusTag, summary.trim());
      setIsSubmitting(false);
      onClose();
    }, 400);
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
            if (!isSubmitting) onClose();
          }}
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md"
          role="dialog"
          aria-modal="true"
          aria-labelledby="pulse-modal-title"
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            transition={{ type: 'spring', damping: 25, stiffness: 350 }}
            onClick={(e) => e.stopPropagation()}
            className="w-full max-w-lg rounded-3xl bg-[#0b0e17] border border-cyan-500/40 p-6 sm:p-8 space-y-6 shadow-2xl relative text-left shadow-cyan-950/20"
          >
            {/* Header */}
            <div className="flex items-center justify-between border-b border-white/10 pb-4">
              <div className="space-y-1">
                <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-cyan-500/10 text-cyan-300 font-mono text-[10px] uppercase font-bold border border-cyan-500/20">
                  <Radio className="w-3 h-3 text-cyan-400 animate-pulse" />
                  <span>ZEN.DOCS &rarr; ZEN.PULSE WIRE</span>
                </div>
                <h3 id="pulse-modal-title" className="text-xl font-bold font-display text-white">
                  Broadcast to ZEN.PULSE
                </h3>
              </div>
              <button
                type="button"
                onClick={onClose}
                disabled={isSubmitting}
                className="p-2 rounded-xl bg-white/5 hover:bg-white/10 text-neutral-400 hover:text-white transition cursor-pointer disabled:opacity-40"
                title="Close modal"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="space-y-4">
              {/* Document Identity Card */}
              <div className="p-4 rounded-2xl bg-black/60 border border-white/10 space-y-2 font-mono text-xs">
                <div className="flex items-center justify-between text-neutral-400">
                  <span>Document Title:</span>
                  <span className="text-white font-bold truncate max-w-[200px]">{activeDoc.title}</span>
                </div>
                <div className="flex items-center justify-between text-neutral-400">
                  <span>Plenary Code:</span>
                  <span className="text-cyan-400 font-bold">{activeDoc.docCode}</span>
                </div>
                <div className="flex items-center justify-between text-neutral-400">
                  <span>Status:</span>
                  <span className="px-2 py-0.5 rounded bg-emerald-500/15 text-emerald-300 border border-emerald-500/30 text-[10px] font-bold">
                    {activeDoc.status || 'DRAFT'}
                  </span>
                </div>
              </div>

              {/* Caucus Tag Selector */}
              <div className="space-y-1.5">
                <label className="text-xs font-mono text-neutral-300 flex items-center gap-1.5">
                  <Tag className="w-3 h-3 text-cyan-400" />
                  <span>Target Caucus / Committee Floor</span>
                </label>
                <select
                  value={caucusTag}
                  onChange={(e) => setCaucusTag(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-black/60 border border-white/15 text-xs text-white font-mono focus:border-cyan-400 focus:outline-none transition cursor-pointer"
                >
                  <option value="General Assembly">General Assembly (UNGA)</option>
                  <option value="Security Council">United Nations Security Council (UNSC)</option>
                  <option value="Human Rights Council">Human Rights Council (UNHRC)</option>
                  <option value="Lok Sabha">Lok Sabha / Parliamentary Chamber</option>
                  <option value="Crisis Cabinet">Crisis Cabinet / Covert Node</option>
                  <option value="Sovereign Compute Guild">Sovereign Compute &amp; AI Working Group</option>
                </select>
              </div>

              {/* Broadcast Post Content / Note */}
              <div className="space-y-1.5">
                <label className="text-xs font-mono text-neutral-300 flex items-center justify-between">
                  <span>Accompanying Wire Dispatch</span>
                  <span className="text-[10px] text-neutral-500">Will display on global Pulse feed</span>
                </label>
                <textarea
                  rows={4}
                  value={summary}
                  onChange={(e) => setSummary(e.target.value)}
                  className="w-full p-3.5 rounded-2xl bg-black/60 border border-white/15 text-xs text-neutral-200 placeholder:text-neutral-500 font-sans focus:border-cyan-400 focus:outline-none transition resize-none leading-relaxed"
                  placeholder="Draft your public dispatch announcement..."
                />
              </div>

              {/* Verified Badge footnote */}
              <div className="p-3.5 rounded-2xl bg-cyan-500/10 border border-cyan-500/20 text-neutral-300 flex items-start gap-2.5 text-xs">
                <Sparkles className="w-4 h-4 text-cyan-400 shrink-0 mt-0.5" />
                <p className="leading-relaxed font-sans">
                  This will generate an official <strong>Treaty / Resolution wire card</strong> on ZEN.PULSE, enabling multilateral roll-call voting, redline diff amendment proposals, and cryptographic co-signatures from across the mesh.
                </p>
              </div>
            </div>

            {/* Actions */}
            <div className="flex items-center justify-end gap-3 pt-2 border-t border-white/10">
              <button
                type="button"
                onClick={onClose}
                disabled={isSubmitting}
                className="px-4 py-2 rounded-xl bg-white/10 text-neutral-300 hover:text-white text-xs font-mono transition cursor-pointer disabled:opacity-40"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleBroadcast}
                disabled={isSubmitting || !summary.trim()}
                className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-500 hover:from-cyan-400 hover:to-blue-400 disabled:opacity-40 text-black font-mono text-xs font-bold transition flex items-center gap-1.5 cursor-pointer shadow-lg shadow-cyan-500/20"
              >
                <Radio className="w-3.5 h-3.5" />
                <span>{isSubmitting ? 'Broadcasting...' : 'Broadcast to Pulse'}</span>
              </button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

