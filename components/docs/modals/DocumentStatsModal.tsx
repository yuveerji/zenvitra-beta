'use client';

import React, { useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, BarChart3, FileText, Type, BookOpen, Clock, Mic, GitBranch, Layers, ShieldCheck } from 'lucide-react';
import { ZenDocument } from '@/types/docs';

export interface DocumentStatsModalProps {
  isOpen: boolean;
  onClose: () => void;
  wordCount: number;
  charCount: number;
  activeDoc: ZenDocument;
}

export function DocumentStatsModal({
  isOpen,
  onClose,
  wordCount,
  charCount,
  activeDoc
}: DocumentStatsModalProps) {
  // Close on Escape key
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  const approxPages = Math.max(1, Math.ceil(wordCount / 500));
  const readingTimeMin = Math.max(1, Math.ceil(wordCount / 200));
  const speakingTimeMin = Math.max(1, Math.ceil(wordCount / 130));

  const statsRows = [
    {
      label: 'Words',
      value: wordCount.toLocaleString(),
      icon: FileText,
      valueColor: 'text-white'
    },
    {
      label: 'Characters',
      value: charCount.toLocaleString(),
      icon: Type,
      valueColor: 'text-white'
    },
    {
      label: 'Pages (approx.)',
      value: approxPages.toString(),
      icon: BookOpen,
      valueColor: 'text-white',
      note: '~500 words / page'
    },
    {
      label: 'Estimated Reading Time',
      value: `~${readingTimeMin} min`,
      icon: Clock,
      valueColor: 'text-cyan-400',
      note: 'silent reading'
    },
    {
      label: 'Dais Speaking Time',
      value: `~${speakingTimeMin} min`,
      icon: Mic,
      valueColor: 'text-amber-400',
      note: 'GSL speech cadence'
    },
    {
      label: 'Document Version',
      value: `v${activeDoc.version || 1}`,
      icon: GitBranch,
      valueColor: 'text-purple-400'
    },
    {
      label: 'Document Status',
      value: activeDoc.status || 'DRAFT',
      icon: Layers,
      valueColor: 'text-emerald-400'
    }
  ];

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.15 }}
          onClick={onClose}
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md"
          role="dialog"
          aria-modal="true"
          aria-labelledby="doc-stats-modal-title"
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            transition={{ type: 'spring', damping: 25, stiffness: 350 }}
            onClick={(e) => e.stopPropagation()}
            className="w-full max-w-md rounded-3xl bg-[#0b0e17] border border-white/20 p-6 sm:p-8 space-y-6 shadow-2xl relative text-left"
          >
            {/* Header */}
            <div className="flex items-center justify-between border-b border-white/10 pb-4">
              <div className="space-y-1">
                <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-cyan-500/10 text-cyan-300 font-mono text-[10px] uppercase font-bold border border-cyan-500/20">
                  <BarChart3 className="w-3 h-3 text-cyan-400" />
                  <span>Telemetry Analytics</span>
                </div>
                <h3 id="doc-stats-modal-title" className="text-xl font-bold font-display text-white">
                  Document Statistics
                </h3>
              </div>
              <button
                type="button"
                onClick={onClose}
                title="Close modal"
                className="p-2 rounded-xl bg-white/5 hover:bg-white/10 text-neutral-400 hover:text-white transition cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Document Reference Pill */}
            <div className="px-3.5 py-2 rounded-xl bg-black/50 border border-white/10 flex items-center justify-between text-xs font-mono">
              <span className="text-neutral-400 truncate max-w-[200px]">{activeDoc.title}</span>
              <span className="text-cyan-400 font-bold shrink-0">{activeDoc.docCode}</span>
            </div>

            {/* Clean Statistics Table */}
            <div className="space-y-2.5 font-mono text-xs">
              {statsRows.map((row) => {
                const IconComponent = row.icon;
                return (
                  <div
                    key={row.label}
                    className="flex items-center justify-between py-2 px-2.5 rounded-lg border-b border-white/5 hover:bg-white/[0.02] transition"
                  >
                    <span className="text-neutral-400 flex items-center gap-2">
                      <IconComponent className="w-3.5 h-3.5 text-neutral-500" />
                      <span>{row.label}</span>
                      {row.note && (
                        <span className="text-[10px] text-neutral-600 hidden sm:inline">
                          ({row.note})
                        </span>
                      )}
                    </span>
                    <span className={`font-bold text-sm ${row.valueColor}`}>{row.value}</span>
                  </div>
                );
              })}
            </div>

            {/* Cryptographic Proof Footer Badge */}
            <div className="flex items-center gap-2 text-[10px] font-mono text-neutral-500 bg-white/[0.02] p-2.5 rounded-xl border border-white/5">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
              <span className="truncate">
                Hash: {activeDoc.cryptographicHash ? `${activeDoc.cryptographicHash.slice(0, 16)}...` : 'Ratified on mesh'}
              </span>
            </div>

            {/* Bottom Close Button */}
            <button
              type="button"
              onClick={onClose}
              className="w-full py-2.5 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-black font-mono font-bold text-xs transition cursor-pointer shadow-md"
            >
              Close
            </button>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
