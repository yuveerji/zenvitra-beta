'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Users,
  X,
  CheckCircle2,
  XCircle,
  AlertCircle,
  Sparkles,
  ShieldCheck,
  RotateCcw,
  Check,
  Layers,
  Award,
  Globe2
} from 'lucide-react';
import { useMun } from '@/context/MunContext';

interface RollCallManagementModalProps {
  isOpen: boolean;
  onClose: () => void;
}

type AttendanceStatus = 'present_voting' | 'present' | 'absent';

interface CountryRollCallEntry {
  country: string;
  flag: string;
  isP5?: boolean;
  status: AttendanceStatus;
}

export function RollCallManagementModal({ isOpen, onClose }: RollCallManagementModalProps) {
  const { activeCommitteeId, getCommitteeById, committees } = useMun();
  const committee = getCommitteeById(activeCommitteeId) || committees[0];

  const INITIAL_COUNTRIES: CountryRollCallEntry[] = [
    { country: 'United States', flag: '🇺🇸', isP5: true, status: 'present_voting' },
    { country: 'United Kingdom', flag: '🇬🇧', isP5: true, status: 'present_voting' },
    { country: 'France', flag: '🇫🇷', isP5: true, status: 'present_voting' },
    { country: 'China', flag: '🇨🇳', isP5: true, status: 'present_voting' },
    { country: 'Russian Federation', flag: '🇷🇺', isP5: true, status: 'present_voting' },
    { country: 'India', flag: '🇮🇳', status: 'present_voting' },
    { country: 'Japan', flag: '🇯🇵', status: 'present' },
    { country: 'Germany', flag: '🇩🇪', status: 'present' },
    { country: 'Brazil', flag: '🇧🇷', status: 'present_voting' },
    { country: 'South Africa', flag: '🇿🇦', status: 'present' },
    { country: 'United Arab Emirates', flag: '🇦🇪', status: 'present_voting' },
    { country: 'Switzerland', flag: '🇨🇭', status: 'present' },
    { country: 'Republic of Korea', flag: '🇰🇷', status: 'present_voting' },
    { country: 'Ghana', flag: '🇬🇭', status: 'present' },
    { country: 'Ecuador', flag: '🇪🇨', status: 'present' }
  ];

  const [delegations, setDelegations] = useState<CountryRollCallEntry[]>(INITIAL_COUNTRIES);

  if (!isOpen) return null;

  const totalDelegates = delegations.length;
  const presentVotingCount = delegations.filter((d) => d.status === 'present_voting').length;
  const presentCount = delegations.filter((d) => d.status === 'present').length;
  const totalPresent = presentVotingCount + presentCount;
  const absentCount = delegations.filter((d) => d.status === 'absent').length;

  const simpleMajority = Math.floor(totalPresent / 2) + 1;
  const twoThirdsMajority = Math.ceil((totalPresent * 2) / 3);
  const quorumMet = totalPresent >= Math.ceil(totalDelegates / 3);

  const setCountryStatus = (country: string, status: AttendanceStatus) => {
    setDelegations((prev) =>
      prev.map((d) => (d.country === country ? { ...d, status } : d))
    );
  };

  const markAll = (status: AttendanceStatus) => {
    setDelegations((prev) => prev.map((d) => ({ ...d, status })));
  };

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 overflow-y-auto flex flex-col justify-start sm:justify-center items-center p-3 sm:p-6 select-none">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          className="fixed inset-0 bg-black/85 backdrop-blur-xl"
        />

        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 20 }}
          className="relative w-full max-w-3xl my-auto max-h-[92vh] bg-[#090a0f] border border-cyan-500/30 rounded-3xl shadow-2xl flex flex-col overflow-hidden z-10 text-white"
        >
          {/* Header */}
          <div className="p-5 sm:p-6 border-b border-white/10 flex items-center justify-between bg-white/[0.02]">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-2xl bg-cyan-500/15 border border-cyan-500/30 flex items-center justify-center text-cyan-400">
                <Users className="w-5 h-5" />
              </div>
              <div>
                <h2 className="font-display font-bold text-lg text-white flex items-center gap-2">
                  <span>Roll Call &amp; Quorum Intelligence</span>
                  <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-cyan-500/20 text-cyan-300 font-bold">
                    MUN Command
                  </span>
                </h2>
                <p className="text-xs text-neutral-400">
                  Track country attendance, enforce Present &amp; Voting mandates, and calculate majority thresholds.
                </p>
              </div>
            </div>

            <button
              type="button"
              onClick={onClose}
              className="p-2 rounded-xl bg-white/5 hover:bg-white/10 text-neutral-400 hover:text-white transition cursor-pointer"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          {/* Quorum Math Dashboard */}
          <div className="p-5 bg-black/40 border-b border-white/10 grid grid-cols-2 sm:grid-cols-4 gap-3">
            <div className="p-3.5 rounded-2xl bg-white/[0.02] border border-white/10 space-y-1">
              <span className="text-[10px] font-mono text-neutral-400 uppercase font-bold block">
                TOTAL ATTENDANCE
              </span>
              <div className="flex items-center gap-2 font-mono font-bold text-lg text-white">
                <span>{totalPresent}/{totalDelegates}</span>
                <span className={`text-[10px] px-1.5 py-0.5 rounded font-bold ${
                  quorumMet ? 'bg-emerald-500/20 text-emerald-300' : 'bg-rose-500/20 text-rose-300'
                }`}>
                  {quorumMet ? 'Quorum Met' : 'No Quorum'}
                </span>
              </div>
            </div>

            <div className="p-3.5 rounded-2xl bg-white/[0.02] border border-white/10 space-y-1">
              <span className="text-[10px] font-mono text-emerald-400/80 uppercase font-bold block">
                PRESENT &amp; VOTING
              </span>
              <div className="font-mono font-bold text-lg text-emerald-300">
                {presentVotingCount} <span className="text-xs text-neutral-500 font-normal">(Cannot Abstain)</span>
              </div>
            </div>

            <div className="p-3.5 rounded-2xl bg-white/[0.02] border border-white/10 space-y-1">
              <span className="text-[10px] font-mono text-amber-400/80 uppercase font-bold block">
                SIMPLE MAJORITY
              </span>
              <div className="font-mono font-bold text-lg text-amber-300">
                {simpleMajority} <span className="text-xs text-neutral-500 font-normal">Votes Needed</span>
              </div>
            </div>

            <div className="p-3.5 rounded-2xl bg-white/[0.02] border border-white/10 space-y-1">
              <span className="text-[10px] font-mono text-purple-400/80 uppercase font-bold block">
                2/3RDS MAJORITY
              </span>
              <div className="font-mono font-bold text-lg text-purple-300">
                {twoThirdsMajority} <span className="text-xs text-neutral-500 font-normal">Votes Needed</span>
              </div>
            </div>
          </div>

          {/* Quick Bulk Actions */}
          <div className="px-5 py-3 border-b border-white/10 flex flex-wrap items-center justify-between gap-2 bg-white/[0.01]">
            <span className="text-xs font-mono text-neutral-400">
              Bulk Roll Call Controls:
            </span>
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => markAll('present_voting')}
                className="px-3 py-1 rounded-xl bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 text-xs font-mono font-semibold transition cursor-pointer"
              >
                All Present &amp; Voting
              </button>
              <button
                type="button"
                onClick={() => markAll('present')}
                className="px-3 py-1 rounded-xl bg-blue-500/10 hover:bg-blue-500/20 text-blue-400 border border-blue-500/30 text-xs font-mono font-semibold transition cursor-pointer"
              >
                All Present
              </button>
              <button
                type="button"
                onClick={() => markAll('absent')}
                className="px-3 py-1 rounded-xl bg-white/5 hover:bg-white/10 text-neutral-400 border border-white/10 text-xs font-mono transition cursor-pointer"
              >
                Reset All
              </button>
            </div>
          </div>

          {/* Country Delegation List */}
          <div className="flex-1 overflow-y-auto p-5 sm:p-6 space-y-2.5 max-h-[50vh]">
            {delegations.map((d) => (
              <div
                key={d.country}
                className="p-3 sm:p-3.5 rounded-2xl bg-black/50 border border-white/10 flex items-center justify-between gap-3 hover:border-white/20 transition"
              >
                <div className="flex items-center gap-3 min-w-0">
                  <span className="text-2xl">{d.flag}</span>
                  <div className="min-w-0">
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-xs sm:text-sm text-white truncate">{d.country}</span>
                      {d.isP5 && (
                        <span className="text-[9px] font-mono font-bold px-1.5 py-0.5 rounded bg-amber-500/20 text-amber-300 border border-amber-500/40">
                          P5 VETO
                        </span>
                      )}
                    </div>
                  </div>
                </div>

                {/* 3 Status Switcher Buttons */}
                <div className="flex items-center gap-1.5 shrink-0 font-mono text-[10px]">
                  <button
                    type="button"
                    onClick={() => setCountryStatus(d.country, 'present_voting')}
                    className={`px-2.5 py-1.5 rounded-xl border transition cursor-pointer font-bold ${
                      d.status === 'present_voting'
                        ? 'bg-emerald-500 text-black border-emerald-400 shadow-sm'
                        : 'bg-white/5 text-neutral-400 hover:text-white border-white/10'
                    }`}
                  >
                    Present &amp; Voting
                  </button>

                  <button
                    type="button"
                    onClick={() => setCountryStatus(d.country, 'present')}
                    className={`px-2.5 py-1.5 rounded-xl border transition cursor-pointer font-bold ${
                      d.status === 'present'
                        ? 'bg-blue-500 text-white border-blue-400 shadow-sm'
                        : 'bg-white/5 text-neutral-400 hover:text-white border-white/10'
                    }`}
                  >
                    Present
                  </button>

                  <button
                    type="button"
                    onClick={() => setCountryStatus(d.country, 'absent')}
                    className={`px-2.5 py-1.5 rounded-xl border transition cursor-pointer ${
                      d.status === 'absent'
                        ? 'bg-rose-500/30 text-rose-300 border-rose-500/50 font-bold'
                        : 'bg-white/5 text-neutral-500 hover:text-white border-white/10'
                    }`}
                  >
                    Absent
                  </button>
                </div>
              </div>
            ))}
          </div>

          {/* Footer */}
          <div className="p-5 border-t border-white/10 flex items-center justify-between bg-white/[0.02]">
            <span className="text-xs font-mono text-neutral-400">
              Quorum changes update real-time voting calculations.
            </span>

            <button
              type="button"
              onClick={onClose}
              className="px-6 py-2.5 rounded-2xl bg-cyan-400 hover:bg-cyan-300 text-black font-display font-bold text-xs shadow-md transition cursor-pointer"
            >
              Save &amp; Update Dais Quorum
            </button>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
