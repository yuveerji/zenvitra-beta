'use client';

import React from 'react';
import { X, Users } from 'lucide-react';
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
    <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-4 animate-fade-in">
      <div className="w-full max-w-3xl bg-[#090d16] rounded-3xl border border-white/15 shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="px-6 py-4 bg-[#0c1220] text-white flex items-center justify-between border-b border-white/10">
          <div className="flex items-center gap-2.5">
            <Users className="w-5 h-5 text-cyan-400" />
            <h2 className="text-base font-black tracking-tight uppercase">Roll Call Attendance</h2>
          </div>
          <button
            type="button"
            onClick={() => setShowRollCallModal(false)}
            className="text-neutral-400 hover:text-white p-1 rounded-full cursor-pointer transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Quorum Bar & Bulk Actions */}
        <div className="px-6 py-3 bg-[#0a0f1d] border-b border-white/10 flex flex-wrap items-center justify-between gap-3 text-xs">
          <div className="flex items-center gap-4">
            <div className="font-bold text-white">
              Present: <span className="text-cyan-400 font-black">{quorum.present}</span>
            </div>
            <div className="text-neutral-400 font-mono">
              2/3 Majority: <span className="text-white font-bold">{quorum.twoThirds}</span>
            </div>
            <div className="text-neutral-400 font-mono">
              Simple (1/2+1): <span className="text-white font-bold">{quorum.simpleMajority}</span>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => handleBulk('present')}
              className="px-2.5 py-1 rounded-lg bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 font-bold text-[11px] cursor-pointer transition"
            >
              All Present
            </button>
            <button
              type="button"
              onClick={() => handleBulk('present_voting')}
              className="px-2.5 py-1 rounded-lg bg-cyan-500/10 hover:bg-cyan-500/20 text-cyan-300 border border-cyan-500/30 font-bold text-[11px] cursor-pointer transition"
            >
              All Present &amp; Voting
            </button>
            <button
              type="button"
              onClick={() => handleBulk('absent')}
              className="px-2.5 py-1 rounded-lg bg-rose-500/10 hover:bg-rose-500/20 text-rose-300 border border-rose-500/30 font-bold text-[11px] cursor-pointer transition"
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
              className="p-3 rounded-2xl bg-[#0d1424] border border-white/10 flex items-center justify-between gap-3 shadow-xs"
            >
              <div className="flex items-center gap-3 min-w-0">
                <img
                  src={`https://flagcdn.com/w80/${d.countryCode.toLowerCase()}.png`}
                  alt={d.name}
                  className="w-6 h-6 rounded-full object-cover shadow-xs border border-white/20 shrink-0"
                  onError={(e) => {
                    (e.target as HTMLElement).style.display = 'none';
                  }}
                />
                <span className="text-sm font-bold text-white truncate">{d.name}</span>
                {d.isP5 && (
                  <span className="text-[10px] font-mono font-bold uppercase bg-amber-500/20 text-amber-300 px-1.5 py-0.5 rounded border border-amber-500/30">
                    P5
                  </span>
                )}
                {d.role === 'observer' && (
                  <span className="text-[10px] font-mono uppercase bg-white/10 text-neutral-400 px-1.5 py-0.5 rounded border border-white/10">
                    Observer
                  </span>
                )}
              </div>

              {/* 3-way toggle */}
              <div className="inline-flex rounded-xl bg-black/40 p-1 border border-white/10 shrink-0">
                <button
                  type="button"
                  onClick={() => setDelegateAttendance(d.id, 'absent')}
                  className={`px-3 py-1 rounded-lg font-bold text-xs transition cursor-pointer ${
                    d.attendance === 'absent'
                      ? 'bg-rose-500 text-white shadow-xs'
                      : 'text-neutral-400 hover:text-white'
                  }`}
                >
                  Absent
                </button>
                <button
                  type="button"
                  onClick={() => setDelegateAttendance(d.id, 'present')}
                  className={`px-3 py-1 rounded-lg font-bold text-xs transition cursor-pointer ${
                    d.attendance === 'present'
                      ? 'bg-emerald-500 text-black font-black shadow-xs'
                      : 'text-neutral-400 hover:text-white'
                  }`}
                >
                  Present
                </button>
                <button
                  type="button"
                  onClick={() => setDelegateAttendance(d.id, 'present_voting')}
                  className={`px-3 py-1 rounded-lg font-bold text-xs transition cursor-pointer flex items-center gap-1 ${
                    d.attendance === 'present_voting'
                      ? 'bg-cyan-500 text-black font-black shadow-xs'
                      : 'text-neutral-400 hover:text-white'
                  }`}
                >
                  <span>P &amp; V</span>
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* Footer */}
        <div className="px-6 py-4 bg-[#0a0f1d] border-t border-white/10 flex items-center justify-between text-xs">
          <span className="text-neutral-400">
            Delegates marked Present or Present &amp; Voting receive <strong className="text-cyan-400">+5 Attendance points</strong>.
          </span>
          <button
            type="button"
            onClick={() => setShowRollCallModal(false)}
            className="px-5 py-2 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-400 hover:from-emerald-400 hover:to-teal-300 text-black font-black cursor-pointer shadow-lg shadow-emerald-500/20 active:scale-95 transition"
          >
            Done
          </button>
        </div>
      </div>
    </div>
  );
}
