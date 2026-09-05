'use client';

import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Award, ShieldCheck, Sparkles, ArrowRight, X } from 'lucide-react';
import { useMun } from '@/context/MunContext';

export function MunInviteBanner() {
  const { userInvites, setSelectedInviteModal } = useMun();
  const pendingInvite = userInvites.find((inv) => inv.status === 'pending');

  if (!pendingInvite) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0, y: -12 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -12 }}
        className="w-full mb-6 select-none"
      >
        <div className="p-4 sm:p-5 rounded-3xl bg-gradient-to-r from-amber-500/15 via-[#0b0d13] to-[#07080b] border border-amber-500/30 shadow-[0_10px_35px_rgba(245,158,11,0.12)] flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center gap-3.5">
            <div className="w-10 h-10 rounded-2xl bg-amber-400/20 border border-amber-400/40 flex items-center justify-center shrink-0 shadow-inner">
              <Award className="w-5 h-5 text-amber-400" />
            </div>

            <div className="space-y-0.5">
              <div className="flex items-center gap-2">
                <span className="text-[10px] font-mono font-bold tracking-widest text-amber-300 uppercase px-2 py-0.5 rounded bg-amber-500/20">
                  ACTION REQUIRED
                </span>
                <span className="text-xs font-mono text-neutral-400">{pendingInvite.eventName}</span>
              </div>
              <h4 className="font-display font-bold text-sm sm:text-base text-white">
                Secretariat Allotment Ready: <span className="text-amber-300">{pendingInvite.flagEmoji} {pendingInvite.portfolio}</span> ({pendingInvite.committeeName})
              </h4>
            </div>
          </div>

          <button
            type="button"
            onClick={() => setSelectedInviteModal(pendingInvite)}
            className="group px-4 py-2.5 rounded-2xl bg-white hover:bg-neutral-200 text-black font-display font-bold text-xs transition-all flex items-center justify-center gap-2 cursor-pointer hover:scale-[1.02] active:scale-[0.98] self-start sm:self-auto shrink-0"
          >
            <Sparkles className="w-3.5 h-3.5 text-black" />
            <span>Review &amp; Accept Allotment</span>
            <ArrowRight className="w-3.5 h-3.5 text-black group-hover:translate-x-0.5 transition-transform" />
          </button>
        </div>
      </motion.div>
    </AnimatePresence>
  );
}

export default MunInviteBanner;
