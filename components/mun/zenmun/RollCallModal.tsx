'use client';

import React, { useState } from 'react';
import { X, Users, Smartphone, Plus, Volume2, VolumeX, Edit2, Check, QrCode } from 'lucide-react';
import { useZenMun } from '@/context/ZenMunContext';
import { AttendanceStatus, ZenDelegate } from '@/types/zenMun';

export function RollCallModal() {
  const {
    session,
    setSession,
    showRollCallModal,
    setShowRollCallModal,
    setDelegateAttendance,
    quorum,
  } = useZenMun();

  const [phoneJoinDecision, setPhoneJoinDecision] = useState<'prompt' | 'yes' | 'no'>('prompt');
  const [newSeatName, setNewSeatName] = useState('');
  const [isAddingSeat, setIsAddingSeat] = useState(false);
  const [isEditingTopic, setIsEditingTopic] = useState(false);
  const [topicInput, setTopicInput] = useState(session.topic || '');

  if (!showRollCallModal) return null;

  const handleBulk = (status: AttendanceStatus) => {
    session.roster.forEach((del) => {
      setDelegateAttendance(del.id, status);
    });
  };

  const handleAddSeat = (e: React.FormEvent) => {
    e.preventDefault();
    const clean = newSeatName.trim();
    if (!clean) return;

    const newDel: ZenDelegate = {
      id: `del_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`,
      name: clean,
      countryCode: clean.toLowerCase().replace(/[^a-z]/g, '').substring(0, 2) || 'un',
      role: 'member',
      attendance: 'present',
      isP5: false,
    };

    setSession((prev) => ({
      ...prev,
      roster: [...prev.roster, newDel],
    }));

    setNewSeatName('');
    setIsAddingSeat(false);
  };

  const handleSaveTopic = () => {
    if (topicInput.trim()) {
      setSession((prev) => ({ ...prev, topic: topicInput.trim() }));
    }
    setIsEditingTopic(false);
  };

  const joinUrl = typeof window !== 'undefined'
    ? `${window.location.origin}/committee?room=${session.sessionCode}`
    : `https://zenvitra.xyz/committee?room=${session.sessionCode}`;

  const qrUrl = `https://api.qrserver.com/v1/create-qr-code/?size=180x180&data=${encodeURIComponent(joinUrl)}`;

  return (
    <div className="fixed inset-0 z-50 bg-[#102016]/80 backdrop-blur-md flex items-center justify-center p-3 sm:p-6 animate-fade-in select-none">
      <div className="w-full max-w-4xl flex flex-col md:flex-row items-center md:items-start justify-center gap-6 max-h-[92vh]">
        
        {/* Floating Phone Join Card (Zenvitra Mobile) */}
        <div className="w-full md:w-56 shrink-0 bg-[#0E131F] rounded-3xl p-5 border border-white/10 text-white shadow-2xl space-y-3.5 order-2 md:order-1 animate-in fade-in slide-in-from-left-4">
          <div className="flex items-center justify-between">
            <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-[#C5A46D] to-[#9E7D47] text-[#08090C] font-black flex items-center justify-center shadow-[0_0_15px_rgba(197,164,109,0.3)]">
              <Smartphone className="w-5 h-5 text-emerald-300" />
            </div>
            <span className="text-[9px] font-mono font-bold uppercase tracking-wider text-[#C5A46D] bg-[#C5A46D]/15/10 px-2 py-0.5 rounded-full">
              Zenvitra Mobile
            </span>
          </div>

          <div>
            <h4 className="text-sm font-black font-serif text-white leading-tight">
              Will delegates join on their phones?
            </h4>
            <p className="text-[11px] text-[#78716c] font-medium leading-tight mt-1">
              Allow delegates to scan placards and cast digital votes directly from mobile.
            </p>
          </div>

          {phoneJoinDecision === 'prompt' ? (
            <div className="grid grid-cols-2 gap-2 pt-1">
              <button
                type="button"
                onClick={() => setPhoneJoinDecision('yes')}
                className="py-2.5 rounded-xl bg-[#C5A46D] hover:bg-[#DFBA73] text-[#08090C] text-xs font-black transition shadow-xs cursor-pointer active:scale-95"
              >
                Yes
              </button>
              <button
                type="button"
                onClick={() => setPhoneJoinDecision('no')}
                className="py-2.5 rounded-xl bg-[#141A29] hover:bg-[#1C2438] text-slate-300 text-xs font-bold transition cursor-pointer active:scale-95"
              >
                No
              </button>
            </div>
          ) : phoneJoinDecision === 'yes' ? (
            <div className="space-y-2.5 pt-1 border-t border-white/10">
              <div className="bg-[#141A29] p-2 rounded-xl flex items-center justify-center border border-white/10">
                <img src={qrUrl} alt="Join QR Code" className="w-28 h-28 object-contain rounded-lg" />
              </div>
              <div className="text-center space-y-0.5">
                <span className="text-[10px] font-mono text-[#8c7860] uppercase">Chamber PIN</span>
                <div className="text-base font-black font-mono tracking-widest text-[#C5A46D]">
                  {session.sessionCode}
                </div>
              </div>
              <button
                type="button"
                onClick={() => setPhoneJoinDecision('prompt')}
                className="w-full text-[10px] text-[#8c7860] hover:text-black font-bold text-center underline cursor-pointer"
              >
                Change option
              </button>
            </div>
          ) : (
            <div className="pt-1 text-center">
              <span className="text-xs text-[#8c7860] font-medium italic">Standard Floor Roll Call</span>
              <button
                type="button"
                onClick={() => setPhoneJoinDecision('prompt')}
                className="block mx-auto text-[10px] text-[#8c7860] hover:text-black font-bold underline mt-1 cursor-pointer"
              >
                Show QR Code
              </button>
            </div>
          )}
        </div>

        {/* Center Main Roll Call Chamber Panel (Image 4 exact match) */}
        <div className="flex-1 max-w-xl w-full bg-[#1b3425] rounded-[30px] border border-[#2d4d38] shadow-[0_25px_80px_rgba(0,0,0,0.5)] overflow-hidden flex flex-col max-h-[88vh] text-white order-1 md:order-2">
          
          {/* Header Bar */}
          <div className="p-5 sm:p-6 border-b border-white/10 space-y-4">
            <div className="flex items-center justify-between gap-3">
              <div className="flex items-center gap-3.5 min-w-0">
                <div className="w-12 h-12 rounded-full bg-white/10 border border-white/20 shadow-xs flex items-center justify-center p-2 shrink-0 overflow-hidden">
                  {session.isIndianCommittee ? (
                    <img src="/assets/committees/emblem_of_india.svg" alt="India" className="w-full h-full object-contain" />
                  ) : session.emblemUrl && session.emblemUrl.startsWith('/') ? (
                    <img src={session.emblemUrl} alt="Emblem" className="w-full h-full object-contain" />
                  ) : (
                    <span className="text-2xl">{session.emblemUrl || '🏛️'}</span>
                  )}
                </div>

                <div className="min-w-0">
                  <h3 className="text-xl font-black font-serif text-white tracking-tight truncate">
                    {session.committeeName || 'Committee Session'}
                  </h3>
                  
                  {isEditingTopic ? (
                    <div className="flex items-center gap-1.5 mt-1">
                      <input
                        type="text"
                        value={topicInput}
                        onChange={(e) => setTopicInput(e.target.value)}
                        className="px-2 py-0.5 rounded bg-black/40 border border-white/30 text-xs text-white outline-none w-48"
                        autoFocus
                      />
                      <button onClick={handleSaveTopic} className="text-emerald-400 p-1 hover:text-emerald-300">
                        <Check className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  ) : (
                    <div className="text-xs text-neutral-300 flex items-center gap-1 mt-0.5 truncate">
                      <span className="text-amber-400 font-bold">Topic:</span>
                      <span className="truncate">{session.topic || 'General Debate'}</span>
                      <button
                        onClick={() => {
                          setTopicInput(session.topic || '');
                          setIsEditingTopic(true);
                        }}
                        className="text-neutral-400 hover:text-white p-0.5"
                      >
                        <Edit2 className="w-3 h-3" />
                      </button>
                    </div>
                  )}
                </div>
              </div>

              <button
                type="button"
                onClick={() => setShowRollCallModal(false)}
                className="text-neutral-400 hover:text-white p-1 rounded-full cursor-pointer transition"
                title="Close"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Quorum Gauges & + Add a Seat */}
            <div className="flex items-center justify-between gap-3 pt-1">
              <div className="flex items-center gap-4">
                {/* Present Quorum Gauge */}
                <div className="flex flex-col items-center">
                  <span className="text-[9px] font-mono text-neutral-400 uppercase tracking-wider">Present</span>
                  <div className="w-9 h-9 rounded-full border-2 border-emerald-400/80 bg-emerald-950/40 flex items-center justify-center font-bold text-xs text-emerald-300 mt-0.5">
                    {quorum.present}
                  </div>
                </div>

                {/* 2/3 Majority Gauge */}
                <div className="flex flex-col items-center">
                  <span className="text-[9px] font-mono text-neutral-400 uppercase tracking-wider">2/3</span>
                  <div className="w-9 h-9 rounded-full border-2 border-amber-400/60 bg-amber-950/40 flex items-center justify-center font-bold text-xs text-amber-200 mt-0.5">
                    {quorum.twoThirds}
                  </div>
                </div>

                {/* 1/2+1 Simple Majority Gauge */}
                <div className="flex flex-col items-center">
                  <span className="text-[9px] font-mono text-neutral-400 uppercase tracking-wider">1/2+1</span>
                  <div className="w-9 h-9 rounded-full border-2 border-white/30 bg-black/40 flex items-center justify-center font-bold text-xs text-neutral-200 mt-0.5">
                    {quorum.simpleMajority}
                  </div>
                </div>
              </div>

              {/* + Add a seat */}
              {isAddingSeat ? (
                <form onSubmit={handleAddSeat} className="flex items-center gap-1.5">
                  <input
                    type="text"
                    value={newSeatName}
                    onChange={(e) => setNewSeatName(e.target.value)}
                    placeholder="Seat name..."
                    className="px-3 py-1.5 rounded-full bg-black/40 border border-white/20 text-xs text-white placeholder:text-neutral-500 outline-none w-32"
                    autoFocus
                  />
                  <button type="submit" className="p-1.5 rounded-full bg-emerald-600 hover:bg-emerald-500 text-white cursor-pointer">
                    <Check className="w-3.5 h-3.5" />
                  </button>
                  <button type="button" onClick={() => setIsAddingSeat(false)} className="text-neutral-400 hover:text-white p-1">
                    <X className="w-3.5 h-3.5" />
                  </button>
                </form>
              ) : (
                <button
                  type="button"
                  onClick={() => setIsAddingSeat(true)}
                  className="px-3 py-1.5 rounded-full bg-white/10 hover:bg-white/15 text-xs font-bold text-neutral-200 flex items-center gap-1.5 cursor-pointer border border-white/15 transition"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>Add a seat</span>
                </button>
              )}
            </div>

            {/* 3 Bulk Action Pills (Image 4 exact match) */}
            <div className="grid grid-cols-3 gap-2.5 pt-1">
              <button
                type="button"
                onClick={() => handleBulk('absent')}
                className="py-2 rounded-xl bg-[#3f221e] hover:bg-[#522b26] text-rose-200 border border-rose-900/50 text-xs font-bold uppercase tracking-wider transition cursor-pointer active:scale-95 text-center"
              >
                CLEAR ALL
              </button>
              <button
                type="button"
                onClick={() => handleBulk('present')}
                className="py-2 rounded-xl bg-[#234932] hover:bg-[#2d5f41] text-emerald-100 border border-emerald-800/50 text-xs font-bold uppercase tracking-wider transition cursor-pointer active:scale-95 text-center"
              >
                ALL PRESENT
              </button>
              <button
                type="button"
                onClick={() => handleBulk('present_voting')}
                className="py-2 rounded-xl bg-[#453e1a] hover:bg-[#584f22] text-amber-100 border border-amber-800/50 text-xs font-bold uppercase tracking-wider transition cursor-pointer active:scale-95 text-center"
              >
                ALL P+V
              </button>
            </div>
          </div>

          {/* Delegation Roster with [ A ] [ P ] [ PV ] Pills (Image 4 exact match) */}
          <div className="p-4 sm:p-5 overflow-y-auto flex-1 space-y-2.5 divide-y divide-white/5">
            {session.roster.map((d) => {
              const isAbsent = d.attendance === 'absent';
              const isPresent = d.attendance === 'present';
              const isPV = d.attendance === 'present_voting';

              return (
                <div
                  key={d.id}
                  className="pt-2.5 first:pt-0 flex items-center justify-between gap-3"
                >
                  <div className="flex items-center gap-3 min-w-0">
                    <img
                      src={`https://flagcdn.com/w80/${d.countryCode.toLowerCase()}.png`}
                      alt={d.name}
                      className="w-7 h-7 rounded-full object-cover shadow-xs border border-white/20 shrink-0"
                      onError={(e) => {
                        (e.target as HTMLElement).style.display = 'none';
                      }}
                    />
                    <span className="text-sm font-bold text-white truncate">{d.name}</span>
                    {d.isP5 && (
                      <span className="text-[9px] font-mono font-bold uppercase bg-amber-500/20 text-amber-300 px-1 py-0.2 rounded border border-amber-500/30 shrink-0">
                        P5
                      </span>
                    )}
                  </div>

                  <div className="flex items-center gap-2 shrink-0">
                    {/* Speaker Megaphone Toggle */}
                    <button
                      type="button"
                      className="p-1.5 rounded-full text-neutral-400 hover:text-white hover:bg-white/10 transition"
                      title="Microphone state"
                    >
                      <Volume2 className="w-4 h-4 text-neutral-400" />
                    </button>

                    {/* Attendance 3-Pills */}
                    <div className="flex items-center gap-1 bg-black/30 p-1 rounded-xl border border-white/10">
                      <button
                        type="button"
                        onClick={() => setDelegateAttendance(d.id, 'absent')}
                        className={`w-7 h-7 rounded-lg text-xs font-black transition cursor-pointer flex items-center justify-center ${
                          isAbsent
                            ? 'bg-[#991b1b] text-white shadow-xs'
                            : 'text-neutral-400 hover:text-white hover:bg-white/10'
                        }`}
                        title="Mark Absent"
                      >
                        A
                      </button>
                      <button
                        type="button"
                        onClick={() => setDelegateAttendance(d.id, 'present')}
                        className={`w-7 h-7 rounded-lg text-xs font-black transition cursor-pointer flex items-center justify-center ${
                          isPresent
                            ? 'bg-[#166534] text-white shadow-xs'
                            : 'text-neutral-400 hover:text-white hover:bg-white/10'
                        }`}
                        title="Mark Present"
                      >
                        P
                      </button>
                      <button
                        type="button"
                        onClick={() => setDelegateAttendance(d.id, 'present_voting')}
                        className={`px-2 h-7 rounded-lg text-[11px] font-black transition cursor-pointer flex items-center justify-center ${
                          isPV
                            ? 'bg-[#854d0e] text-white shadow-xs'
                            : 'text-neutral-400 hover:text-white hover:bg-white/10'
                        }`}
                        title="Mark Present and Voting"
                      >
                        PV
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Bottom Action Button (Image 4 exact match) */}
          <div className="p-4 sm:p-5 border-t border-white/10 bg-[#162c1f]">
            {quorum.present === 0 ? (
              <div className="w-full py-3.5 rounded-2xl bg-[#263b2f] text-[#6b8273] font-bold text-xs uppercase tracking-wider text-center cursor-not-allowed">
                MARK AT LEAST 1 DELEGATE PRESENT
              </div>
            ) : (
              <button
                type="button"
                onClick={() => setShowRollCallModal(false)}
                className="w-full py-3.5 rounded-2xl bg-[#234932] hover:bg-[#2c5c3f] text-white font-bold text-xs uppercase tracking-wider transition shadow-md shadow-black/30 cursor-pointer active:scale-98 text-center"
              >
                CONFIRM ATTENDANCE &amp; PROCEED ({quorum.present} PRESENT)
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default RollCallModal;
