'use client';

import React, { useState, useEffect } from 'react';
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
  Globe2,
  Plus,
  Trash2
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
  subTitle?: string;
  isP5?: boolean;
  status: AttendanceStatus;
}

const COMMITTEE_ROSTERS: Record<string, CountryRollCallEntry[]> = {
  UNSC: [
    { country: 'United States of America', flag: '🇺🇸', subTitle: 'Permanent Member (P5) • Veto Power', isP5: true, status: 'absent' },
    { country: 'United Kingdom', flag: '🇬🇧', subTitle: 'Permanent Member (P5) • Veto Power', isP5: true, status: 'absent' },
    { country: 'French Republic', flag: '🇫🇷', subTitle: 'Permanent Member (P5) • Veto Power', isP5: true, status: 'absent' },
    { country: 'Russian Federation', flag: '🇷🇺', subTitle: 'Permanent Member (P5) • Veto Power', isP5: true, status: 'absent' },
    { country: 'People’s Republic of China', flag: '🇨🇳', subTitle: 'Permanent Member (P5) • Veto Power', isP5: true, status: 'absent' },
  ],
  AIPPM: [
    { country: 'Prime Minister of India', flag: '🇮🇳', subTitle: 'Leader of the House', status: 'absent' },
    { country: 'Leader of Opposition', flag: '🇮🇳', subTitle: 'Lok Sabha Opposition Bench', status: 'absent' },
  ],
  ECOSOC: [
    { country: 'Republic of India', flag: '🇮🇳', subTitle: 'Bureau Member', status: 'absent' },
    { country: 'United States of America', flag: '🇺🇸', subTitle: 'Development Directorate', status: 'absent' },
  ],
};

function getRosterForCommittee(committee: any): CountryRollCallEntry[] {
  const norm = String(committee?.shortName || committee?.id || committee?.name || '').toUpperCase();
  if (norm.includes('UNSC')) return COMMITTEE_ROSTERS.UNSC;
  if (norm.includes('AIPPM')) return COMMITTEE_ROSTERS.AIPPM;
  if (norm.includes('ECOSOC')) return COMMITTEE_ROSTERS.ECOSOC;
  return [];
}

export function RollCallManagementModal({ isOpen, onClose }: RollCallManagementModalProps) {
  const { activeCommitteeId, getCommitteeById, committees, updateCommitteeDetails } = useMun();
  const committee = getCommitteeById(activeCommitteeId) || committees[0];

  const [delegations, setDelegations] = useState<CountryRollCallEntry[]>([]);
  const [newCountryName, setNewCountryName] = useState('');
  const [newCountryRole, setNewCountryRole] = useState('');
  const [newIsP5, setNewIsP5] = useState(false);

  useEffect(() => {
    if (isOpen && committee) {
      try {
        const stored = localStorage.getItem(`zenvitra_rollcall_${committee.id}`);
        if (stored) {
          const parsed = JSON.parse(stored);
          if (Array.isArray(parsed) && parsed.length > 0) {
            setDelegations(parsed);
            return;
          }
        }
      } catch {}

      const roster = getRosterForCommittee(committee);
      setDelegations(roster.map(r => ({ ...r, status: 'absent' })));
    }
  }, [isOpen, committee?.id]);

  if (!isOpen) return null;

  const totalDelegates = delegations.length;
  const presentVotingCount = delegations.filter((d) => d.status === 'present_voting').length;
  const presentCount = delegations.filter((d) => d.status === 'present').length;
  const totalPresent = presentVotingCount + presentCount;
  const absentCount = delegations.filter((d) => d.status === 'absent').length;

  const simpleMajority = Math.floor(totalPresent / 2) + 1;
  const twoThirdsMajority = Math.ceil((totalPresent * 2) / 3);
  const quorumMet = totalDelegates > 0 ? totalPresent >= Math.ceil(totalDelegates / 3) : false;

  const saveRoster = (updated: CountryRollCallEntry[]) => {
    if (committee?.id) {
      try {
        localStorage.setItem(`zenvitra_rollcall_${committee.id}`, JSON.stringify(updated));
      } catch {}
    }
  };

  const syncAttendanceToContext = (currentList: CountryRollCallEntry[]) => {
    if (!committee?.id) return;
    const pVoting = currentList.filter((d) => d.status === 'present_voting').length;
    const pNormal = currentList.filter((d) => d.status === 'present').length;
    const tPresent = pVoting + pNormal;
    updateCommitteeDetails(committee.id, {
      presentCount: tPresent,
      presentAndVotingCount: pVoting,
      totalDelegates: currentList.length,
      quorumNeeded: Math.ceil(currentList.length / 3),
    });
    saveRoster(currentList);
  };

  const handleAddCountry = () => {
    const trimmedName = newCountryName.trim();
    if (!trimmedName) return;

    const flag = trimmedName.toLowerCase().includes('india') ? '🇮🇳'
      : trimmedName.toLowerCase().includes('united states') || trimmedName.toLowerCase().includes('usa') ? '🇺🇸'
      : trimmedName.toLowerCase().includes('united kingdom') || trimmedName.toLowerCase().includes('uk') ? '🇬🇧'
      : trimmedName.toLowerCase().includes('france') ? '🇫🇷'
      : trimmedName.toLowerCase().includes('russia') ? '🇷🇺'
      : trimmedName.toLowerCase().includes('china') ? '🇨🇳'
      : '🌐';

    const newEntry: CountryRollCallEntry = {
      country: trimmedName,
      flag,
      subTitle: newCountryRole.trim() || undefined,
      isP5: newIsP5,
      status: 'present_voting',
    };

    const updated = [...delegations, newEntry];
    setDelegations(updated);
    setNewCountryName('');
    setNewCountryRole('');
    setNewIsP5(false);
    syncAttendanceToContext(updated);
  };

  const handleRemoveCountry = (country: string) => {
    const updated = delegations.filter((d) => d.country !== country);
    setDelegations(updated);
    syncAttendanceToContext(updated);
  };

  const handleClearRoster = () => {
    if (window.confirm('Clear all delegates from this committee roster? You will build a fresh roster from scratch.')) {
      setDelegations([]);
      syncAttendanceToContext([]);
    }
  };

  const setCountryStatus = (country: string, status: AttendanceStatus) => {
    setDelegations((prev) => {
      const updated = prev.map((d) => (d.country === country ? { ...d, status } : d));
      syncAttendanceToContext(updated);
      return updated;
    });
  };

  const markAll = (status: AttendanceStatus) => {
    setDelegations((prev) => {
      const updated = prev.map((d) => ({ ...d, status }));
      syncAttendanceToContext(updated);
      return updated;
    });
  };

  const handleSaveAndClose = () => {
    syncAttendanceToContext(delegations);
    onClose();
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
                    {committee?.shortName || 'CHAMBER'}
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

          {/* Quick Bulk Actions & Add Delegate Bar */}
          <div className="px-5 py-3 border-b border-white/10 flex flex-wrap items-center justify-between gap-2 bg-white/[0.01]">
            <span className="text-xs font-mono text-neutral-400">
              Bulk Roll Call Controls:
            </span>
            <div className="flex items-center flex-wrap gap-2">
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
                Reset All (0 Present)
              </button>
              <button
                type="button"
                onClick={handleClearRoster}
                className="px-3 py-1 rounded-xl bg-red-500/10 hover:bg-red-500/20 text-red-400 border border-red-500/30 text-xs font-mono transition cursor-pointer"
                title="Clear all delegates to build custom roster"
              >
                Clear Roster
              </button>
            </div>
          </div>

          {/* Add Delegate Bar (MUN Command style) */}
          <div className="p-4 bg-white/[0.02] border-b border-white/10 flex flex-col sm:flex-row items-stretch sm:items-center gap-2">
            <input
              type="text"
              value={newCountryName}
              onChange={(e) => setNewCountryName(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleAddCountry()}
              placeholder="Country or Delegate Name (e.g. Canada, Shashi Tharoor)"
              className="flex-1 bg-black/60 border border-white/15 focus:border-cyan-400 px-3 py-1.5 rounded-xl text-xs text-white placeholder-neutral-500 font-mono focus:outline-none"
            />
            <input
              type="text"
              value={newCountryRole}
              onChange={(e) => setNewCountryRole(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleAddCountry()}
              placeholder="Title/Role (optional)"
              className="sm:w-48 bg-black/60 border border-white/15 focus:border-cyan-400 px-3 py-1.5 rounded-xl text-xs text-white placeholder-neutral-500 font-mono focus:outline-none"
            />
            <label className="flex items-center gap-1.5 text-xs font-mono text-neutral-400 cursor-pointer select-none shrink-0 px-2">
              <input
                type="checkbox"
                checked={newIsP5}
                onChange={(e) => setNewIsP5(e.target.checked)}
                className="rounded border-white/20 text-cyan-500 focus:ring-0"
              />
              <span>P5 Veto</span>
            </label>
            <button
              type="button"
              onClick={handleAddCountry}
              className="px-4 py-1.5 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-black font-mono font-bold text-xs transition cursor-pointer flex items-center justify-center gap-1 shrink-0 active:scale-95"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>+ Add Delegate</span>
            </button>
          </div>

          {/* Country / Portfolio Delegation List */}
          <div className="flex-1 overflow-y-auto p-5 sm:p-6 space-y-2.5 max-h-[50vh]">
            {delegations.length === 0 ? (
              <div className="py-12 text-center space-y-2 text-neutral-500 font-mono text-xs">
                <Users className="w-8 h-8 text-neutral-600 mx-auto" />
                <p>No delegates in this chamber roster yet.</p>
                <p className="text-[11px] text-neutral-600">Type a country or delegate name above and click "+ Add Delegate".</p>
              </div>
            ) : (
              delegations.map((d) => (
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
                      {d.subTitle && (
                        <p className="text-[11px] font-mono text-neutral-400 truncate">{d.subTitle}</p>
                      )}
                    </div>
                  </div>

                  {/* 3 Status Switcher Buttons + Delete */}
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

                    <button
                      type="button"
                      onClick={() => handleRemoveCountry(d.country)}
                      className="p-1.5 rounded-lg text-neutral-500 hover:text-red-400 hover:bg-white/5 transition"
                      title="Remove delegate from roster"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>

          {/* Footer */}
          <div className="p-5 border-t border-white/10 flex items-center justify-between bg-white/[0.02]">
            <span className="text-xs font-mono text-neutral-400">
              Quorum changes update real-time voting calculations.
            </span>

            <button
              type="button"
              onClick={handleSaveAndClose}
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
