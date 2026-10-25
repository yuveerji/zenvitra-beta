'use client';

import React, { useState } from 'react';
import { X, Check, Lock, Sparkles, Shield, Award } from 'lucide-react';
import { PulseBadgeType } from '@/types/pulse';
import { MASTER_BADGES, evaluateUserBadges, UserBadgeEvaluation, BadgeMeta } from '@/lib/badgeSystem';

interface BadgeSelectorModalProps {
  isOpen: boolean;
  onClose: () => void;
  userProfile: any;
  currentBadge: PulseBadgeType;
  onEquipBadge: (badge: PulseBadgeType) => void;
}

export function BadgeSelectorModal({
  isOpen,
  onClose,
  userProfile,
  currentBadge,
  onEquipBadge,
}: BadgeSelectorModalProps) {
  const [selectedBadge, setSelectedBadge] = useState<PulseBadgeType>(currentBadge || 'DELEGATE');
  const [savedSuccess, setSavedSuccess] = useState(false);

  if (!isOpen) return null;

  const evaluations: UserBadgeEvaluation[] = evaluateUserBadges(userProfile, currentBadge);
  const unlockedBadges = evaluations.filter((e) => e.isUnlocked);
  const lockedBadges = evaluations.filter((e) => !e.isUnlocked);

  const activeMeta: BadgeMeta = MASTER_BADGES[selectedBadge] || MASTER_BADGES['DELEGATE'];

  const handleEquip = (badgeId: PulseBadgeType) => {
    setSelectedBadge(badgeId);
    onEquipBadge(badgeId);
    setSavedSuccess(true);
    setTimeout(() => {
      setSavedSuccess(false);
      onClose();
    }, 900);
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/85 backdrop-blur-md p-3 sm:p-6 flex flex-col justify-start sm:justify-center items-center animate-in fade-in duration-200">
      <div 
        className="relative w-full max-w-lg bg-[#0b0e14] border border-white/10 rounded-3xl p-6 sm:p-7 space-y-6 shadow-2xl my-auto max-h-[92vh] overflow-y-auto"
        style={{
          boxShadow: '0 25px 60px -15px rgba(0,0,0,0.9), 0 0 40px rgba(99,102,241,0.1)'
        }}
      >
        {/* Modal Header */}
        <div className="flex items-center justify-between pb-4 border-b border-white/10">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-indigo-500/20 border border-indigo-500/30 flex items-center justify-center text-indigo-300">
              <Award className="w-4 h-4" />
            </div>
            <div>
              <h3 className="font-bold text-base sm:text-lg text-white font-display flex items-center gap-2">
                Configure Sovereign Badge
              </h3>
              <p className="text-xs text-neutral-400 font-sans">
                Equip any badge you have earned across the ecosystem
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-xl bg-white/5 hover:bg-white/10 text-neutral-400 hover:text-white transition cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Success Alert */}
        {savedSuccess && (
          <div className="p-3.5 rounded-2xl bg-emerald-500/15 border border-emerald-500/30 text-emerald-200 text-xs font-semibold flex items-center gap-2 animate-in fade-in">
            <Check className="w-4 h-4 text-emerald-400 shrink-0" />
            <span>Badge equipped successfully! Displaying across your profile and dispatches.</span>
          </div>
        )}

        {/* Currently Equipped Live Preview */}
        <div className="p-4 rounded-2xl bg-gradient-to-r from-white/[0.04] to-white/[0.01] border border-white/10 space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-mono uppercase tracking-wider text-neutral-400">
              Currently Equipped Badge
            </span>
            <span className="text-[10px] font-mono text-indigo-300 font-bold bg-indigo-500/15 border border-indigo-500/30 px-2 py-0.5 rounded-md">
              LIVE ON PROFILE
            </span>
          </div>
          <div className="flex items-center gap-3 pt-1">
            <span className="text-2xl">{activeMeta.icon}</span>
            <div>
              <div className="flex items-center gap-2">
                <span className={`px-2.5 py-0.5 rounded-full border text-[11px] font-bold font-sans tracking-wide ${activeMeta.colorClass}`}>
                  {activeMeta.icon} {activeMeta.label}
                </span>
                {activeMeta.rarity === 'GENESIS_LIMITED' && (
                  <span className="text-[9px] font-mono font-bold text-indigo-300 bg-indigo-500/15 border border-indigo-500/30 px-1.5 py-0.5 rounded">
                    FIRST 500 COHORT
                  </span>
                )}
              </div>
              <p className="text-xs text-neutral-300 mt-1">
                {activeMeta.description}
              </p>
            </div>
          </div>
        </div>

        {/* Unlocked Badges Section */}
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <h4 className="text-xs font-mono font-bold tracking-wider uppercase text-neutral-300 flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5 text-indigo-400" />
              <span>Unlocked Badges ({unlockedBadges.length})</span>
            </h4>
            <span className="text-[11px] text-neutral-500">Tap to equip</span>
          </div>

          <div className="space-y-2 max-h-[36vh] overflow-y-auto pr-1">
            {unlockedBadges.map(({ badge, isEquipped }) => {
              const isSelected = selectedBadge === badge.id;
              return (
                <div
                  key={badge.id}
                  onClick={() => handleEquip(badge.id)}
                  className={`p-3.5 rounded-2xl border transition-all cursor-pointer flex items-center justify-between gap-3 ${
                    isSelected
                      ? 'bg-indigo-500/10 border-indigo-400/50 shadow-[0_0_15px_rgba(99,102,241,0.15)]'
                      : 'bg-white/[0.02] border-white/5 hover:border-white/20 hover:bg-white/[0.05]'
                  }`}
                >
                  <div className="flex items-center gap-3 min-w-0">
                    <span className="text-xl shrink-0">{badge.icon}</span>
                    <div className="min-w-0">
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className={`px-2 py-0.5 rounded-full border text-[10px] font-bold font-sans ${badge.colorClass}`}>
                          {badge.label}
                        </span>
                        {badge.id === 'FOUNDING MEMBER' && (
                          <span className="text-[9px] font-mono font-bold text-indigo-300 bg-indigo-950/60 border border-indigo-500/30 px-1.5 py-0.2 rounded">
                            TOP 500
                          </span>
                        )}
                      </div>
                      <p className="text-[11px] text-neutral-400 mt-1 line-clamp-1">
                        {badge.description}
                      </p>
                    </div>
                  </div>

                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleEquip(badge.id);
                    }}
                    className={`px-3 py-1.5 rounded-xl text-xs font-semibold font-sans transition shrink-0 cursor-pointer ${
                      isSelected
                        ? 'bg-indigo-500 text-white shadow-[0_0_12px_rgba(99,102,241,0.4)]'
                        : 'bg-white/10 text-white hover:bg-white/20'
                    }`}
                  >
                    {isSelected ? 'Equipped' : 'Equip'}
                  </button>
                </div>
              );
            })}
          </div>
        </div>

        {/* Locked Badges Section */}
        {lockedBadges.length > 0 && (
          <div className="space-y-2.5 pt-2 border-t border-white/5">
            <h4 className="text-xs font-mono font-bold tracking-wider uppercase text-neutral-400 flex items-center gap-1.5">
              <Lock className="w-3.5 h-3.5 text-neutral-500" />
              <span>Locked Badges ({lockedBadges.length})</span>
            </h4>

            <div className="space-y-2 opacity-65">
              {lockedBadges.map(({ badge, lockedReason }) => (
                <div
                  key={badge.id}
                  className="p-3 rounded-2xl bg-white/[0.01] border border-white/5 flex items-center justify-between gap-3 text-neutral-500"
                >
                  <div className="flex items-center gap-3 min-w-0">
                    <span className="text-lg grayscale opacity-60 shrink-0">{badge.icon}</span>
                    <div className="min-w-0">
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-bold text-neutral-400 font-sans">
                          {badge.label}
                        </span>
                        <Lock className="w-3 h-3 text-neutral-500" />
                      </div>
                      <p className="text-[10px] text-neutral-500 mt-0.5 line-clamp-1">
                        {lockedReason || badge.description}
                      </p>
                    </div>
                  </div>
                  <span className="text-[10px] font-mono text-neutral-600 uppercase shrink-0">
                    Locked
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Footer */}
        <div className="flex items-center justify-between pt-2 border-t border-white/10 text-xs text-neutral-400">
          <span>Founding Member status guaranteed for Genesis cohort #1–500.</span>
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 rounded-xl bg-white/10 hover:bg-white/20 text-white font-medium transition cursor-pointer"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
}
