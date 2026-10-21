'use client';

import React, { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  X, 
  Award, 
  ShieldCheck, 
  Sparkles, 
  Clock, 
  CheckCircle2, 
  Copy, 
  Check, 
  ExternalLink,
  Filter,
  History,
  TrendingUp,
  FileSpreadsheet
} from 'lucide-react';
import { getUserPointHistory, PointHistoryItem } from '@/lib/onboardingRewards';

interface PointsHistoryModalProps {
  isOpen: boolean;
  onClose: () => void;
  username?: string;
  userDisplayName?: string;
}

export function PointsHistoryModal({
  isOpen,
  onClose,
  username,
  userDisplayName
}: PointsHistoryModalProps) {
  const [activeCategory, setActiveCategory] = useState<string>('ALL');
  const [copiedNotification, setCopiedNotification] = useState(false);

  const cleanUser = (username || '').toLowerCase().replace(/^@/, '').trim();
  const historyData = useMemo(() => getUserPointHistory(cleanUser), [cleanUser, isOpen]);

  const filteredItems = useMemo(() => {
    if (activeCategory === 'ALL') return historyData.items;
    return historyData.items.filter((item) => {
      if (activeCategory === 'GRANTS') return item.category === 'ONBOARDING_GRANT';
      if (activeCategory === 'CONTRIBUTIONS') return item.category === 'CONTRIBUTION';
      if (activeCategory === 'SPEAKING') return item.category === 'SPEAKING';
      if (activeCategory === 'VERIFICATION') return item.category === 'VERIFICATION';
      if (activeCategory === 'ACHIEVEMENTS') return item.category === 'ACHIEVEMENT';
      return true;
    });
  }, [historyData.items, activeCategory]);

  const handleCopyLedger = () => {
    const text = [
      `ZENVITRA PROTOCOL — SOVEREIGN MERIT POINTS LEDGER`,
      `Account: @${cleanUser}`,
      `Verified Balance: ${historyData.totalPoints} PTS`,
      `Audited At: ${new Date().toISOString()}`,
      `----------------------------------------`,
      ...historyData.items.map((i) => `[${i.date}] +${i.points} PTS • ${i.title} (${i.badgeText || i.category})`)
    ].join('\n');

    navigator.clipboard.writeText(text);
    setCopiedNotification(true);
    setTimeout(() => setCopiedNotification(false), 2000);
  };

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 overflow-y-auto selection:bg-amber-500/20">
        {/* Backdrop */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          className="fixed inset-0 bg-black/80 backdrop-blur-xl"
        />

        {/* Modal Window */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 15 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 15 }}
          transition={{ type: 'spring', damping: 25, stiffness: 300 }}
          className="relative w-full max-w-3xl rounded-3xl bg-[#080a11] border border-white/10 shadow-[0_25px_80px_rgba(0,0,0,0.85)] overflow-hidden my-auto"
        >
          {/* Subtle Ambient Radial Highlight */}
          <div className="absolute top-0 right-1/4 w-96 h-48 bg-amber-500/10 rounded-full blur-[100px] pointer-events-none" />
          <div className="absolute bottom-0 left-1/4 w-96 h-48 bg-cyan-500/10 rounded-full blur-[100px] pointer-events-none" />

          {/* Modal Header */}
          <div className="relative flex items-center justify-between p-5 sm:p-6 border-b border-white/10">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-amber-400/20 to-amber-600/10 border border-amber-400/20 flex items-center justify-center shadow-inner">
                <History className="w-5 h-5 text-amber-300" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-emerald-400 shadow-[0_0_8px_#34d399] animate-pulse" />
                  <span className="font-mono text-[10px] tracking-widest text-neutral-400 uppercase">
                    IMMUTABLE LEDGER &bull; PROVENANCE RECORD
                  </span>
                </div>
                <h3 className="font-display text-lg sm:text-xl font-black tracking-tight text-white uppercase">
                  SOVEREIGN POINT HISTORY
                </h3>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={handleCopyLedger}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white/[0.04] hover:bg-white/[0.08] border border-white/10 text-xs font-mono text-neutral-300 hover:text-white transition cursor-pointer"
                title="Copy ledger text"
              >
                {copiedNotification ? (
                  <>
                    <Check className="w-3.5 h-3.5 text-emerald-400" />
                    <span className="text-emerald-400 font-bold">Copied</span>
                  </>
                ) : (
                  <>
                    <Copy className="w-3.5 h-3.5 text-neutral-400" />
                    <span>Copy Ledger</span>
                  </>
                )}
              </button>

              <button
                type="button"
                onClick={onClose}
                className="w-9 h-9 rounded-xl bg-white/[0.04] hover:bg-white/[0.08] border border-white/10 flex items-center justify-center text-neutral-400 hover:text-white transition cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Balance Overview Banner */}
          <div className="relative p-5 sm:p-6 bg-gradient-to-r from-amber-500/10 via-transparent to-cyan-500/10 border-b border-white/10 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="space-y-1">
              <span className="text-xs font-mono uppercase tracking-widest text-neutral-400">
                Verified Merit Balance
              </span>
              <div className="flex items-baseline gap-2">
                <span className="text-3xl sm:text-4xl font-display font-black text-white tracking-tight">
                  {historyData.totalPoints}
                </span>
                <span className="text-sm font-mono font-bold text-amber-400">PTS</span>
              </div>
              <p className="text-xs text-neutral-400 font-sans">
                Accumulated across sovereign onboarding allocations, summit citations, debate contributions, and protocol verification.
              </p>
            </div>

            <div className="flex flex-col sm:items-end gap-1 shrink-0">
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-300 text-[10px] font-mono uppercase tracking-wider">
                <ShieldCheck className="w-3 h-3 text-emerald-400" />
                <span>Ed25519 Sovereign Verified</span>
              </div>
              <span className="text-[10px] text-neutral-500 font-mono">
                {historyData.items.length} Immutable Ledger Events
              </span>
            </div>
          </div>

          {/* Filter Pills */}
          <div className="p-4 sm:px-6 bg-white/[0.01] border-b border-white/5 flex items-center gap-2 overflow-x-auto no-scrollbar">
            {[
              { id: 'ALL', label: 'All Events' },
              { id: 'GRANTS', label: 'Onboarding Grants' },
              { id: 'CONTRIBUTIONS', label: 'Contributions' },
              { id: 'SPEAKING', label: 'Speaking' },
              { id: 'ACHIEVEMENTS', label: 'Honors' },
              { id: 'VERIFICATION', label: 'Credentials' }
            ].map((f) => (
              <button
                key={f.id}
                type="button"
                onClick={() => setActiveCategory(f.id)}
                className={`px-3 py-1 rounded-lg text-xs font-mono tracking-wider uppercase transition cursor-pointer whitespace-nowrap ${
                  activeCategory === f.id
                    ? 'bg-amber-400 text-black font-bold shadow-md shadow-amber-400/20'
                    : 'bg-white/[0.04] text-neutral-400 hover:text-white hover:bg-white/[0.08]'
                }`}
              >
                {f.label}
              </button>
            ))}
          </div>

          {/* Ledger Events List */}
          <div className="p-5 sm:p-6 max-h-[420px] overflow-y-auto space-y-3">
            {filteredItems.length === 0 ? (
              <div className="py-12 text-center space-y-2">
                <Award className="w-8 h-8 text-neutral-600 mx-auto" />
                <p className="text-sm font-sans font-medium text-neutral-400">No ledger events recorded in this category.</p>
                <p className="text-xs font-mono text-neutral-600">Points awarded in summits, resolutions, and community initiatives reflect here instantly.</p>
              </div>
            ) : (
              filteredItems.map((item, idx) => (
                <div
                  key={item.id || idx}
                  className="p-4 rounded-2xl bg-white/[0.02] hover:bg-white/[0.04] border border-white/5 hover:border-white/10 transition flex items-center justify-between gap-4"
                >
                  <div className="flex items-start gap-3 min-w-0">
                    <div className="w-8 h-8 rounded-xl bg-white/[0.05] border border-white/10 flex items-center justify-center shrink-0 mt-0.5">
                      {item.category === 'ONBOARDING_GRANT' ? (
                        <Sparkles className="w-4 h-4 text-amber-300" />
                      ) : item.category === 'CONTRIBUTION' ? (
                        <TrendingUp className="w-4 h-4 text-cyan-300" />
                      ) : item.category === 'SPEAKING' ? (
                        <Award className="w-4 h-4 text-purple-300" />
                      ) : (
                        <CheckCircle2 className="w-4 h-4 text-emerald-300" />
                      )}
                    </div>

                    <div className="space-y-1 min-w-0">
                      <div className="flex flex-wrap items-center gap-2">
                        <h4 className="text-sm font-sans font-bold text-white truncate">
                          {item.title}
                        </h4>
                        <span className="px-2 py-0.5 rounded-full bg-white/[0.05] border border-white/10 text-[9px] font-mono text-neutral-300 tracking-wider uppercase">
                          {item.badgeText || item.category}
                        </span>
                      </div>
                      {item.initiative && (
                        <p className="text-xs font-sans text-neutral-400 truncate">
                          {item.initiative}
                        </p>
                      )}
                      <div className="flex items-center gap-2 text-[10px] font-mono text-neutral-500">
                        <span>{item.date}</span>
                        <span>&bull;</span>
                        <span className="text-emerald-400/80">Permanent Record</span>
                      </div>
                    </div>
                  </div>

                  <div className="text-right shrink-0">
                    <div className="text-base sm:text-lg font-display font-black text-amber-300">
                      +{item.points}
                    </div>
                    <span className="text-[9px] font-mono uppercase tracking-wider text-neutral-500">
                      CREDITED
                    </span>
                  </div>
                </div>
              ))
            )}
          </div>

          {/* Footer */}
          <div className="p-4 sm:p-5 bg-white/[0.02] border-t border-white/10 flex items-center justify-between text-xs text-neutral-400 font-mono">
            <span>ZENVITRA PASSPORT &bull; REGISTER 46</span>
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-xl bg-white text-black font-sans font-bold text-xs uppercase tracking-wider hover:bg-neutral-200 transition cursor-pointer"
            >
              Close Dossier
            </button>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}

export default PointsHistoryModal;
