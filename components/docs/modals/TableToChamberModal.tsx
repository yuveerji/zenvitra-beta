'use client';

import React, { useEffect } from 'react';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Radio, ExternalLink, ShieldCheck, FileCheck2, Users, Hash } from 'lucide-react';
import { ZenDocument } from '@/types/docs';

export interface TableToChamberModalProps {
  isOpen: boolean;
  onClose: () => void;
  activeDoc: ZenDocument;
  onToast: (msg: string) => void;
}

export function TableToChamberModal({
  isOpen,
  onClose,
  activeDoc,
  onToast
}: TableToChamberModalProps) {
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

  const handleConfirmTransmission = () => {
    onClose();
    onToast('Resolution successfully tabled to live chamber floor!');
  };

  const hashDisplay = activeDoc.cryptographicHash
    ? activeDoc.cryptographicHash
    : '0x8f3c2b1a99d45e0287cb8921a1ef4c29d00b731e847ad3e1987d6052f38ab4c1';

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
          aria-labelledby="chamber-modal-title"
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            transition={{ type: 'spring', damping: 25, stiffness: 350 }}
            onClick={(e) => e.stopPropagation()}
            className="w-full max-w-lg rounded-3xl bg-[#0b0e17] border border-purple-500/40 p-6 sm:p-8 space-y-6 shadow-2xl relative text-left shadow-purple-950/20"
          >
            {/* Header */}
            <div className="flex items-center justify-between border-b border-white/10 pb-4">
              <div className="space-y-1">
                <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-purple-500/20 text-purple-300 font-mono text-[10px] uppercase font-bold border border-purple-500/30">
                  <Radio className="w-3 h-3 text-purple-400 animate-pulse" />
                  <span>LIVE DAIS TRANSMISSION</span>
                </div>
                <h3 id="chamber-modal-title" className="text-xl font-bold font-display text-white">
                  Table onto Committee Floor
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

            {/* Modal Body Content */}
            <div className="space-y-4">
              <p className="text-xs text-neutral-300 leading-relaxed font-sans">
                You are about to table <strong className="text-white font-medium">&ldquo;{activeDoc.title}&rdquo;</strong>{' '}
                <span className="font-mono text-cyan-400 font-semibold">({activeDoc.docCode})</span> directly into the active
                MUN Chamber floor. This will notify the Dais Chairperson, update the quorum voting roster, and transmit resolution text
                to all delegate desks.
              </p>

              {/* Transmission Metadata Card */}
              <div className="p-4 rounded-2xl bg-black/60 border border-white/10 space-y-3 font-mono text-xs">
                <div className="flex items-center justify-between gap-2 border-b border-white/5 pb-2">
                  <span className="text-neutral-400 flex items-center gap-1.5">
                    <Radio className="w-3.5 h-3.5 text-purple-400" />
                    Target Dais:
                  </span>
                  <span className="text-cyan-400 font-bold text-right truncate max-w-[240px]">
                    {activeDoc.committeeOrChamber}
                  </span>
                </div>

                <div className="flex items-center justify-between gap-2 border-b border-white/5 pb-2">
                  <span className="text-neutral-400 flex items-center gap-1.5">
                    <Users className="w-3.5 h-3.5 text-amber-400" />
                    Lead Sponsors:
                  </span>
                  <span className="text-white font-medium text-right truncate max-w-[240px]">
                    {activeDoc.leadSponsors && activeDoc.leadSponsors.length > 0
                      ? activeDoc.leadSponsors.join(', ')
                      : 'None registered'}
                  </span>
                </div>

                {activeDoc.signatories && activeDoc.signatories.length > 0 && (
                  <div className="flex items-center justify-between gap-2 border-b border-white/5 pb-2">
                    <span className="text-neutral-400 flex items-center gap-1.5">
                      <FileCheck2 className="w-3.5 h-3.5 text-blue-400" />
                      Signatories:
                    </span>
                    <span className="text-neutral-300 text-right truncate max-w-[240px]">
                      {activeDoc.signatories.length} delegations registered
                    </span>
                  </div>
                )}

                <div className="flex items-center justify-between gap-2 pt-0.5">
                  <span className="text-neutral-400 flex items-center gap-1.5">
                    <Hash className="w-3.5 h-3.5 text-emerald-400" />
                    Cryptographic Hash:
                  </span>
                  <span
                    className="text-emerald-400 truncate max-w-[200px] text-[11px] font-semibold"
                    title={hashDisplay}
                  >
                    {hashDisplay}
                  </span>
                </div>
              </div>

              {/* Status Indicator */}
              <div className="p-3 rounded-xl bg-purple-500/10 border border-purple-500/20 flex items-center gap-2.5 text-xs text-purple-200 font-mono">
                <ShieldCheck className="w-4 h-4 text-purple-400 shrink-0" />
                <span className="text-[11px] leading-tight">
                  Cryptographically sealed. Once tabled, delegates in chamber will receive synchronized roll-call amendments.
                </span>
              </div>

              {/* Actions */}
              <div className="flex items-center justify-end gap-3 pt-2">
                <button
                  type="button"
                  onClick={onClose}
                  className="px-4 py-2 rounded-xl bg-white/10 hover:bg-white/15 text-neutral-300 hover:text-white text-xs font-mono transition cursor-pointer"
                >
                  Cancel
                </button>
                <Link
                  href="/committee"
                  onClick={handleConfirmTransmission}
                  className="px-5 py-2 rounded-xl bg-purple-600 hover:bg-purple-500 text-white font-mono text-xs font-bold transition flex items-center gap-2 cursor-pointer shadow-lg shadow-purple-600/30 ring-1 ring-purple-400/50"
                >
                  <span>Confirm &amp; Enter Chamber</span>
                  <ExternalLink className="w-3.5 h-3.5" />
                </Link>
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
