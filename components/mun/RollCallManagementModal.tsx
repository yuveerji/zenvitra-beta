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
    { country: 'Republic of India', flag: '🇮🇳', subTitle: 'Special Invitee & G4 Candidate', status: 'absent' },
    { country: 'Japan', flag: '🇯🇵', subTitle: 'Elected Member (Asia-Pacific)', status: 'absent' },
    { country: 'Republic of Korea', flag: '🇰🇷', subTitle: 'Elected Member (Asia-Pacific)', status: 'absent' },
    { country: 'Swiss Confederation', flag: '🇨🇭', subTitle: 'Elected Member (WEOG)', status: 'absent' },
    { country: 'Republic of Sierra Leone', flag: '🇸🇱', subTitle: 'Elected Member (African Group)', status: 'absent' },
    { country: 'People’s Democratic Republic of Algeria', flag: '🇩🇿', subTitle: 'Elected Member (Arab Group)', status: 'absent' },
    { country: 'Co-operative Republic of Guyana', flag: '🇬🇾', subTitle: 'Elected Member (GRULAC)', status: 'absent' },
    { country: 'Republic of Malta', flag: '🇲🇹', subTitle: 'Elected Member (WEOG)', status: 'absent' },
    { country: 'Republic of Mozambique', flag: '🇲🇿', subTitle: 'Elected Member (African Group)', status: 'absent' },
    { country: 'Republic of Slovenia', flag: '🇸🇮', subTitle: 'Elected Member (Eastern Europe)', status: 'absent' },
  ],
  AIPPM: [
    { country: 'Narendra Modi', flag: '🇮🇳', subTitle: 'Prime Minister of India / Varanasi MP', status: 'absent' },
    { country: 'Amit Shah', flag: '🇮🇳', subTitle: 'Minister of Home Affairs / Gandhinagar MP', status: 'absent' },
    { country: 'Rahul Gandhi', flag: '🇮🇳', subTitle: 'Leader of Opposition (Lok Sabha)', status: 'absent' },
    { country: 'Rajnath Singh', flag: '🇮🇳', subTitle: 'Minister of Defence', status: 'absent' },
    { country: 'Nirmala Sitharaman', flag: '🇮🇳', subTitle: 'Minister of Finance', status: 'absent' },
    { country: 'Mallikarjun Kharge', flag: '🇮🇳', subTitle: 'Leader of Opposition (Rajya Sabha)', status: 'absent' },
    { country: 'Akhilesh Yadav', flag: '🇮🇳', subTitle: 'Samajwadi Party Chief / Kannauj MP', status: 'absent' },
    { country: 'Mamata Banerjee', flag: '🇮🇳', subTitle: 'All India Trinamool Congress (TMC)', status: 'absent' },
    { country: 'Nitin Gadkari', flag: '🇮🇳', subTitle: 'Minister of Road Transport & Highways', status: 'absent' },
    { country: 'Asaduddin Owaisi', flag: '🇮🇳', subTitle: 'AIMIM Chief / Hyderabad MP', status: 'absent' },
  ],
  EMI: [
    { country: 'Dharmendra Pradhan', flag: '🇮🇳', subTitle: 'Union Minister of Education', status: 'absent' },
    { country: 'Prof. M. Jagadesh Kumar', flag: '🇮🇳', subTitle: 'Chairman, University Grants Commission (UGC)', status: 'absent' },
    { country: 'Prof. T.G. Sitharam', flag: '🇮🇳', subTitle: 'Chairman, AICTE', status: 'absent' },
    { country: 'Director, NCERT', flag: '🇮🇳', subTitle: 'Curriculum & Textbook Framework Directorate', status: 'absent' },
    { country: 'Director, IIT Delhi', flag: '🇮🇳', subTitle: 'Institutes of National Importance (INIs)', status: 'absent' },
    { country: 'Vice-Chancellor, Delhi University', flag: '🇮🇳', subTitle: 'Central Universities Consortium', status: 'absent' },
    { country: 'State Education Secretary (Tamil Nadu)', flag: '🇮🇳', subTitle: 'State Language & Curriculum Autonomy', status: 'absent' },
    { country: 'National Student Union Representative', flag: '🇮🇳', subTitle: 'Youth Democratic Student Body', status: 'absent' },
  ],
  ECOSOC: [
    { country: 'Republic of India', flag: '🇮🇳', subTitle: 'President of ECOSOC Bureau / Global South Anchor', status: 'absent' },
    { country: 'United States of America', flag: '🇺🇸', subTitle: 'Development Finance & Multilateral Aid Directorate', status: 'absent' },
    { country: 'Federal Republic of Germany', flag: '🇩🇪', subTitle: 'Climate Adaptation & Green Transition Envoy', status: 'absent' },
    { country: 'Federative Republic of Brazil', flag: '🇧🇷', subTitle: 'Troika / Global Alliance Against Hunger & Poverty', status: 'absent' },
    { country: 'Republic of South Africa', flag: '🇿🇦', subTitle: 'African Union Debt Relief & Financing Caucus', status: 'absent' },
    { country: 'Barbados (Prime Minister Envoy)', flag: '🇧🇧', subTitle: 'Bridgetown Initiative on Climate Finance Architecture', status: 'absent' },
    { country: 'Republic of Kenya', flag: '🇰🇪', subTitle: 'East African Energy Transition & Digital Development', status: 'absent' },
    { country: 'Japan', flag: '🇯🇵', subTitle: 'SDGs Financing & International Development Agency (JICA)', status: 'absent' },
  ],
  UNODC: [
    { country: 'Republic of Colombia', flag: '🇨🇴', subTitle: 'Andean Narcotics & Crop Substitution Board', status: 'absent' },
    { country: 'United Mexican States', flag: '🇲🇽', subTitle: 'Transnational Cartel Border & Maritime Taskforce', status: 'absent' },
    { country: 'Kingdom of the Netherlands', flag: '🇳🇱', subTitle: 'Port of Rotterdam Interception Directorate', status: 'absent' },
    { country: 'Republic of the Union of Myanmar', flag: '🇲🇲', subTitle: 'Golden Triangle Synthetic Drug Precursor Taskforce', status: 'absent' },
    { country: 'Federal Republic of Nigeria', flag: '🇳🇬', subTitle: 'West African Transshipment Command', status: 'absent' },
    { country: 'INTERPOL Secretariat', flag: '🌐', subTitle: 'Transnational Organized Crime Taskforce', status: 'absent' },
    { country: 'Islamic Republic of Afghanistan', flag: '🇦🇫', subTitle: 'Opiate Eradication Directorate', status: 'absent' },
    { country: 'Commonwealth of Australia', flag: '🇦🇺', subTitle: 'Pacific Border & Darknet Interdiction Branch', status: 'absent' },
  ],
};

function getRosterForCommittee(committee: any): CountryRollCallEntry[] {
  const norm = String(committee?.shortName || committee?.id || committee?.name || '').toUpperCase();
  if (norm.includes('UNSC')) return COMMITTEE_ROSTERS.UNSC;
  if (norm.includes('AIPPM')) return COMMITTEE_ROSTERS.AIPPM;
  if (norm.includes('EMI')) return COMMITTEE_ROSTERS.EMI;
  if (norm.includes('ECOSOC')) return COMMITTEE_ROSTERS.ECOSOC;
  if (norm.includes('UNODC')) return COMMITTEE_ROSTERS.ECOSOC;
  return COMMITTEE_ROSTERS.UNSC;
}

export function RollCallManagementModal({ isOpen, onClose }: RollCallManagementModalProps) {
  const { activeCommitteeId, getCommitteeById, committees, updateCommitteeDetails } = useMun();
  const committee = getCommitteeById(activeCommitteeId) || committees[0];

  const [delegations, setDelegations] = useState<CountryRollCallEntry[]>([]);

  useEffect(() => {
    if (isOpen && committee) {
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
  const quorumMet = totalPresent >= Math.ceil(totalDelegates / 3);

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
                Reset All (0 Present)
              </button>
            </div>
          </div>

          {/* Country / Portfolio Delegation List */}
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
                    {d.subTitle && (
                      <p className="text-[11px] font-mono text-neutral-400 truncate">{d.subTitle}</p>
                    )}
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
