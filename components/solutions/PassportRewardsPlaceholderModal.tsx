'use client';

import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Award, Sparkles, Gift, ArrowRight, ShieldCheck, Ticket, BookOpen, Globe } from 'lucide-react';
import Link from 'next/link';

interface PassportRewardsPlaceholderModalProps {
  isOpen: boolean;
  onClose: () => void;
  userPoints: number;
}

export function PassportRewardsPlaceholderModal({
  isOpen,
  onClose,
  userPoints
}: PassportRewardsPlaceholderModalProps) {
  if (!isOpen) return null;

  const rewards = [
    {
      id: 'conf_pass',
      icon: Ticket,
      title: 'Model UN Delegate Summit Pass',
      category: 'CONFERENCE ACCESS',
      pointsRequired: 500,
      description: '100% registration fee waiver for any accredited ZENVITRA Model UN summit.',
      status: 'Coming in Phase 2'
    },
    {
      id: 'diplomat_crest',
      icon: ShieldCheck,
      title: 'Verified Diplomat Holographic Crest',
      category: 'IDENTITY CREDENTIAL',
      pointsRequired: 250,
      description: 'Permanent Level 3 sovereign identity credential on your public passport card.',
      status: 'Coming in Phase 2'
    },
    {
      id: 'policy_grant',
      icon: BookOpen,
      title: 'Civic Policy Research Grant',
      category: 'ACADEMIC & CIVIC',
      pointsRequired: 1000,
      description: 'Full editorial review, DOI registration, and global press syndicate distribution.',
      status: 'Coming in Phase 2'
    },
    {
      id: 'travel_subsidy',
      icon: Globe,
      title: 'Multilateral Delegation Travel Grant',
      category: 'GLOBAL TRAVEL',
      pointsRequired: 2500,
      description: 'Travel subsidy support for international youth diplomatic delegations.',
      status: 'Coming in Phase 2'
    }
  ];

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-[60] overflow-y-auto flex items-center justify-center p-3 sm:p-4 bg-black/85 backdrop-blur-md">
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 15 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 15 }}
          className="relative w-full max-w-2xl rounded-3xl bg-[#090b14] border border-cyan-500/30 p-5 sm:p-7 shadow-[0_25px_80px_rgba(0,0,0,0.95)] text-white font-sans space-y-5"
        >
          {/* Header */}
          <div className="flex items-start justify-between border-b border-white/10 pb-4">
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <span className="px-2.5 py-0.5 rounded-full bg-cyan-500/15 border border-cyan-500/30 text-cyan-300 font-mono text-[10px] font-bold uppercase tracking-wider flex items-center gap-1">
                  <Gift className="w-3 h-3 text-cyan-400" />
                  <span>Passport Rewards Hub</span>
                </span>
                <span className="text-[10px] font-mono text-neutral-400">
                  Modular Redemption Protocol
                </span>
              </div>
              <h3 className="text-lg sm:text-xl font-bold font-display text-white">
                Redeem Your Passport Points
              </h3>
              <p className="text-xs text-neutral-400 font-sans">
                Passport Points can be redeemed for rewards across conferences, identity credentials, and grants.
              </p>
            </div>

            <button
              type="button"
              onClick={onClose}
              className="p-1.5 rounded-xl bg-white/5 hover:bg-white/10 text-neutral-400 hover:text-white transition cursor-pointer"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          {/* User Balance Banner */}
          <div className="p-4 rounded-2xl bg-gradient-to-r from-cyan-950/40 via-purple-950/30 to-black border border-cyan-500/30 flex items-center justify-between">
            <div className="space-y-0.5">
              <span className="text-[10px] font-mono text-cyan-400 uppercase tracking-widest font-bold block">
                YOUR SOVEREIGN PASSPORT BALANCE
              </span>
              <div className="flex items-baseline gap-2">
                <span className="text-2xl sm:text-3xl font-black font-display text-white">
                  {userPoints}
                </span>
                <span className="text-xs font-mono text-cyan-300 font-bold">
                  PASSPORT POINTS
                </span>
              </div>
            </div>
            <Link
              href="/passport"
              onClick={onClose}
              className="px-3.5 py-2 rounded-xl bg-white/10 hover:bg-white/20 border border-white/15 text-xs font-mono font-bold transition flex items-center gap-1.5 text-neutral-200 hover:text-white"
            >
              <span>View Passport</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          {/* Rewards Placeholder List */}
          <div className="space-y-2.5 max-h-[45vh] overflow-y-auto pr-1">
            {rewards.map((reward) => {
              const Icon = reward.icon;
              const canAfford = userPoints >= reward.pointsRequired;

              return (
                <div
                  key={reward.id}
                  className="p-3.5 rounded-2xl bg-white/[0.02] border border-white/10 hover:border-cyan-500/30 transition flex flex-col sm:flex-row sm:items-center justify-between gap-3"
                >
                  <div className="flex items-start gap-3">
                    <div className="w-9 h-9 rounded-xl bg-cyan-500/10 border border-cyan-500/20 flex items-center justify-center shrink-0 mt-0.5">
                      <Icon className="w-4 h-4 text-cyan-400" />
                    </div>
                    <div className="space-y-0.5">
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-sm text-white font-sans">{reward.title}</span>
                        <span className="text-[9px] font-mono px-1.5 py-0.2 rounded bg-white/5 text-neutral-400 uppercase">
                          {reward.category}
                        </span>
                      </div>
                      <p className="text-[11px] text-neutral-400 font-sans leading-relaxed">
                        {reward.description}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center justify-between sm:justify-end gap-3 shrink-0 pt-2 sm:pt-0 border-t sm:border-t-0 border-white/5 font-mono">
                    <div className="text-right">
                      <span className="text-xs font-bold text-cyan-300 block">
                        {reward.pointsRequired} PTS
                      </span>
                      <span className="text-[10px] text-neutral-500">
                        {canAfford ? 'Eligible' : `Need ${reward.pointsRequired - userPoints} more`}
                      </span>
                    </div>

                    <button
                      type="button"
                      disabled
                      className="px-3 py-1.5 rounded-xl bg-white/5 border border-white/10 text-[10px] text-neutral-400 font-bold uppercase tracking-wider cursor-not-allowed opacity-75"
                    >
                      {reward.status}
                    </button>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Footer */}
          <div className="flex flex-col sm:flex-row items-center justify-between gap-3 pt-3 border-t border-white/10 text-xs font-mono text-neutral-400">
            <span className="text-[11px] text-neutral-400 text-center sm:text-left">
              * Dedicated redemption system will connect into conference passes and sovereign grants.
            </span>
            <button
              type="button"
              onClick={onClose}
              className="w-full sm:w-auto px-5 py-2 rounded-xl bg-cyan-400 text-black font-bold font-mono text-xs hover:bg-cyan-300 transition cursor-pointer"
            >
              Done
            </button>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
