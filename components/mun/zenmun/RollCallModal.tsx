'use client';

import React from 'react';
import { X, Check, CheckCheck, Users, ShieldAlert } from 'lucide-react';
import { useZenMun } from '@/context/ZenMunContext';
import { AttendanceStatus } from '@/types/zenMun';

export function RollCallModal() {
  const {
    session,
    showRollCallModal,
    setShowRollCallModal,
    setDelegateAttendance,
    quorum,
  } = useZenMun();

  if (!showRollCallModal) return null;

  const handleBulk = (status: AttendanceStatus) => {
    session.roster.forEach((del) => {
      setDelegateAttendance(del.id, status);
    });
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 animate-fade-in">
      <div className="w-full max-w-3xl bg-[#F5F3EB] rounded-3xl border border-[#D6D1C4] shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="px-6 py-4 bg-[#243928] text-white flex items-center justify-between border-b border-[#324f38]">
          <div className="flex items-center gap-2.5">
            <Users className="w-5 h-5 text-[#E4DB98]" />
            <h2 className="text-base font-black tracking-tight uppercase">Roll Call Attendance</h2>
          </div>
          <button
            type="button"
            onClick={() => setShowRollCallModal(false)}
            className="text-neutral-400 hover:text-white p-1 rounded-full cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Quorum Bar & Bulk Actions */}
        <div className="px-6 py-3 bg-[#EFECE4] border-b border-[#D6D1C4] flex flex-wrap items-center justify-between gap-3 text-xs">
          <div className="flex items-center gap-4">
            <div className="font-bold text-[#1A1D1A]">
              Present: <span className="text-[#243928] font-black">{quorum.present}</span>
            </div>
            <div className="text-[#7A7870] font-mono">
              2/3 Majority: <span className="text-[#1A1D1A] font-bold">{quorum.twoThirds}</span>
            </div>
            <div className="text-[#7A7870] font-mono">
              Simple (1/2+1): <span className="text-[#1A1D1A] font-bold">{quorum.simpleMajority}</span>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => handleBulk('present')}
              className="px-2.5 py-1 rounded-lg bg-white hover:bg-emerald-50 text-emerald-800 border border-[#D6D1C4] font-bold text-[11px] cursor-pointer"
            >
              All Present
            </button>
            <button
              type="button"
              onClick={() => handleBulk('present_voting')}
              className="px-2.5 py-1 rounded-lg bg-[#243928] hover:bg-[#324f38] text-[#E4DB98] font-bold text-[11px] cursor-pointer"
            >
              All Present &amp; Voting
            </button>
            <button
              type="button"
              onClick={() => handleBulk('absent')}
              className="px-2.5 py-1 rounded-lg bg-white hover:bg-rose-50 text-rose-700 border border-[#D6D1C4] font-bold text-[11px] cursor-pointer"
            >
              All Absent
            </button>
          </div>
        </div>

        {/* Delegations List */}
        <div className="p-6 overflow-y-auto flex-1 space-y-2">
          {session.roster.map((d) => (
            <div
              key={d.id}
              className="p-3 rounded-2xl bg-white border border-[#E0DCCE] flex items-center justify-between gap-3 shadow-2xs"
            >
              <div className="flex items-center gap-3 min-w-0">
                <img
                  src={`https://flagcdn.com/w80/${d.countryCode.toLowerCase()}.png`}
                  alt={d.name}
                  className="w-6 h-6 rounded-full object-cover shadow-2xs border border-black/10 shrink-0"
                  onError={(e) => {
                    (e.target as HTMLElement).style.display = 'none';
                  }}
                />
                <span className="text-sm font-bold text-[#1A1D1A] truncate">{d.name}</span>
                {d.isP5 && (
                  <span className="text-[10px] font-mono font-bold uppercase bg-amber-100 text-amber-900 px-1.5 py-0.5 rounded border border-amber-300">
                    P5
                  </span>
                )}
                {d.role === 'observer' && (
                  <span className="text-[10px] font-mono uppercase bg-neutral-100 text-neutral-600 px-1.5 py-0.5 rounded">
                    Observer
                  </span>
                )}
              </div>

              {/* 3-way toggle */}
              <div className="inline-flex rounded-xl bg-[#EFECE4] p-1 border border-[#D6D1C4] shrink-0">
                <button
                  type="button"
                  onClick={() => setDelegateAttendance(d.id, 'absent')}
                  className={`px-3 py-1 rounded-lg font-bold text-xs transition cursor-pointer ${
                    d.attendance === 'absent'
                      ? 'bg-rose-600 text-white shadow-xs'
                      : 'text-[#7A7870] hover:text-[#1A1D1A]'
                  }`}
                >
                  Absent
                </button>
                <button
                  type="button"
                  onClick={() => setDelegateAttendance(d.id, 'present')}
                  className={`px-3 py-1 rounded-lg font-bold text-xs transition cursor-pointer ${
                    d.attendance === 'present'
                      ? 'bg-emerald-700 text-white shadow-xs'
                      : 'text-[#7A7870] hover:text-[#1A1D1A]'
                  }`}
                >
                  Present
                </button>
                <button
                  type="button"
                  onClick={() => setDelegateAttendance(d.id, 'present_voting')}
                  className={`px-3 py-1 rounded-lg font-bold text-xs transition cursor-pointer flex items-center gap-1 ${
                    d.attendance === 'present_voting'
                      ? 'bg-[#243928] text-[#E4DB98] shadow-xs'
                      : 'text-[#7A7870] hover:text-[#1A1D1A]'
                  }`}
                >
                  <span>P &amp; V</span>
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* Footer */}
        <div className="px-6 py-4 bg-[#EFECE4] border-t border-[#D6D1C4] flex items-center justify-between text-xs">
          <span className="text-[#7A7870]">
            Delegates marked Present or Present &amp; Voting receive <strong>+5 Attendance points</strong>.
          </span>
          <button
            type="button"
            onClick={() => setShowRollCallModal(false)}
            className="px-5 py-2 rounded-xl bg-[#243928] hover:bg-[#324f38] text-[#E4DB98] font-bold cursor-pointer"
          >
            Save &amp; Close
          </button>
        </div>
      </div>
    </div>
  );
}
