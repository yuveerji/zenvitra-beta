'use client';

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Mic,
  Clock,
  Plus,
  Trash2,
  SkipForward,
  Gavel,
  ArrowRight,
  HelpCircle,
  MessageSquare,
  Users,
  CheckCircle2,
  X,
  Volume2,
  Timer
} from 'lucide-react';
import { useMun } from '@/context/MunContext';
import { lookupFlag } from '@/lib/sessionPresetsData';
import { daisAudio } from '@/lib/daisAudio';

export function LiveSpeakerQueue() {
  const {
    sessionState,
    joinSpeakersList,
    addSpeakerToQueue,
    removeSpeakerFromQueue,
    advanceSpeaker,
    yieldSpeakerTime,
    setTimerSeconds,
    activeCommitteeId,
    getCommitteeById,
    committees
  } = useMun();

  const [newSpeakerName, setNewSpeakerName] = useState('');
  const [showYieldDelegateModal, setShowYieldDelegateModal] = useState(false);
  const [targetDelegateInput, setTargetDelegateInput] = useState('');
  const [poiCountdown, setPoiCountdown] = useState<number | null>(null);
  const [commentsSlots, setCommentsSlots] = useState<{ slot: number; speaker: string; seconds: number }[] | null>(null);

  const committee = getCommitteeById(activeCommitteeId) || committees[0];
  const speakers = sessionState?.speakersList || [];
  const currentSpeaker = speakers.find((s) => s.status === 'speaking') || speakers[0];
  const upcomingSpeakers = speakers.filter((s) => s.id !== currentSpeaker?.id);

  // Active speaker POI countdown interval
  useEffect(() => {
    if (poiCountdown === null) return;
    if (poiCountdown <= 0) {
      daisAudio.playTimeExpired();
      setPoiCountdown(null);
      return;
    }
    const timer = setInterval(() => {
      setPoiCountdown((prev) => (prev !== null ? prev - 1 : null));
    }, 1000);
    return () => clearInterval(timer);
  }, [poiCountdown]);

  const handleAddSpeaker = () => {
    const trimmed = newSpeakerName.trim();
    if (!trimmed) return;
    addSpeakerToQueue(trimmed);
    daisAudio.playGavelStrike(0.4);
    setNewSpeakerName('');
  };

  const handleAdvance = () => {
    daisAudio.playGavelStrike(0.8);
    advanceSpeaker();
  };

  // 1. Yield to Chair
  const handleYieldToChair = () => {
    daisAudio.playDoubleGavel();
    yieldSpeakerTime('chair');
    advanceSpeaker();
  };

  // 2. Yield to Another Delegate
  const handleYieldToDelegateConfirm = (targetPortfolio: string) => {
    if (!targetPortfolio.trim()) return;
    daisAudio.playGavelStrike(0.6);
    yieldSpeakerTime('another_delegate');
    // Place recipient at head of queue
    addSpeakerToQueue(targetPortfolio.trim());
    advanceSpeaker();
    setShowYieldDelegateModal(false);
    setTargetDelegateInput('');
  };

  // 3. Yield to Questions (Points of Information)
  const handleYieldToQuestions = () => {
    daisAudio.playWarningBell();
    yieldSpeakerTime('points_of_info');
    setPoiCountdown(30); // 30 second POI window
  };

  // 4. Yield to Comments
  const handleYieldToComments = () => {
    daisAudio.playGavelStrike(0.6);
    setCommentsSlots([
      { slot: 1, speaker: 'Floor Commentator 1', seconds: 30 },
      { slot: 2, speaker: 'Floor Commentator 2', seconds: 30 },
    ]);
  };

  const currentSpeakerFlag = currentSpeaker ? lookupFlag(currentSpeaker.portfolio) : '🇺🇳';

  const renderAddSpeakerBar = () => (
    <div className="flex items-center gap-2 pt-2">
      <input
        type="text"
        value={newSpeakerName}
        onChange={(e) => setNewSpeakerName(e.target.value)}
        onKeyDown={(e) => e.key === 'Enter' && handleAddSpeaker()}
        placeholder="Enter Country or Delegate Name to queue..."
        className="flex-1 bg-black/60 border border-white/10 focus:border-amber-400/60 px-3.5 py-2 rounded-xl text-xs text-white placeholder-neutral-500 font-mono focus:outline-none transition-colors"
      />
      <button
        type="button"
        onClick={handleAddSpeaker}
        className="px-4 py-2 rounded-xl bg-amber-500 hover:bg-amber-400 text-black font-mono text-xs font-bold transition cursor-pointer flex items-center gap-1.5 shrink-0 active:scale-95 shadow-md shadow-amber-500/10"
      >
        <Plus className="w-3.5 h-3.5" />
        <span>Add to GSL</span>
      </button>
    </div>
  );

  if (!currentSpeaker) {
    return (
      <div className="rounded-3xl bg-[#06070a]/95 border border-white/[0.08] p-6 space-y-4 backdrop-blur-2xl shadow-2xl text-left">
        <div className="flex items-center justify-between border-b border-white/[0.06] pb-3">
          <div className="flex items-center gap-2">
            <Mic className="w-4 h-4 text-amber-400" />
            <span className="font-mono text-xs font-bold uppercase tracking-widest text-white">
              GENERAL SPEAKERS LIST (GSL) // LIVE DAIS QUEUE
            </span>
          </div>
          <span className="px-2.5 py-0.5 rounded-full bg-white/5 border border-white/10 text-neutral-400 font-mono text-[10px] font-bold">
            0 IN QUEUE
          </span>
        </div>
        <div className="p-8 rounded-2xl bg-white/[0.02] border border-white/5 text-center space-y-4">
          <Mic className="w-8 h-8 text-neutral-600 mx-auto" />
          <p className="text-xs text-neutral-400 font-mono">
            No delegates are currently queued on the GSL floor. Type a country or delegate to recognize them.
          </p>
          {renderAddSpeakerBar()}
          <div className="pt-2">
            <button
              type="button"
              onClick={() => joinSpeakersList()}
              className="px-4 py-2 rounded-xl bg-white/[0.06] hover:bg-white/[0.1] border border-white/10 text-neutral-300 font-mono text-xs transition cursor-pointer inline-flex items-center gap-1.5 active:scale-95"
            >
              <span>Join as Current User</span>
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="rounded-3xl bg-[#06070a]/95 border border-white/[0.08] p-6 space-y-6 backdrop-blur-2xl shadow-2xl text-left">
      <div className="flex items-center justify-between border-b border-white/[0.06] pb-3">
        <div className="flex items-center gap-2">
          <Mic className="w-4 h-4 text-amber-400 animate-pulse" />
          <span className="font-mono text-xs font-bold uppercase tracking-widest text-white">
            GENERAL SPEAKERS LIST (GSL) // LIVE DAIS QUEUE
          </span>
        </div>
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => daisAudio.playDoubleGavel()}
            className="p-1.5 px-2.5 rounded-lg bg-white/5 hover:bg-white/10 border border-white/10 text-[11px] font-mono text-neutral-300 hover:text-white transition flex items-center gap-1 cursor-pointer active:scale-95"
            title="Strike Gavel"
          >
            <Gavel className="w-3 h-3 text-amber-400" />
            <span className="hidden sm:inline">Gavel</span>
          </button>
          <span className="px-2.5 py-0.5 rounded-full bg-amber-500/10 border border-amber-500/30 text-amber-300 font-mono text-[10px] font-bold">
            {speakers.length.toString().padStart(2, '0')} IN QUEUE
          </span>
        </div>
      </div>

      {/* Quick Add Speaker Bar */}
      {renderAddSpeakerBar()}

      {/* Hero Active Speaker Spotlight */}
      <motion.div
        layout
        className="p-6 rounded-2xl bg-gradient-to-r from-amber-500/[0.08] via-amber-500/[0.02] to-transparent border border-amber-500/25 space-y-5"
      >
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="flex items-center gap-3.5">
            <span className="text-4xl filter drop-shadow-sm">{currentSpeakerFlag}</span>
            <div>
              <span className="font-mono text-[10px] tracking-widest text-amber-400 uppercase font-bold flex items-center gap-1.5">
                <span className="w-1.5 h-1.5 rounded-full bg-amber-400 animate-pulse" />
                CURRENT RECOGNIZED SPEAKER
              </span>
              <h4 className="font-display font-bold text-2xl text-white">
                {currentSpeaker.portfolio}
              </h4>
              <span className="text-xs font-outfit text-neutral-400">
                {currentSpeaker.delegateName || 'Accredited Delegate'}
              </span>
            </div>
          </div>

          <div className="flex items-center gap-4">
            <div className="text-right font-mono">
              <div className="text-2xl sm:text-3xl font-black text-amber-300 tabular-nums">
                {Math.floor((currentSpeaker.timeRemainingSeconds || 90) / 60)}:
                {((currentSpeaker.timeRemainingSeconds || 90) % 60).toString().padStart(2, '0')}
              </div>
              <span className="text-[10px] text-neutral-500 uppercase">SECONDS REMAINING</span>
            </div>

            {/* Dais Advance Controls */}
            <div className="flex items-center gap-1.5 pl-2 border-l border-white/10">
              <button
                type="button"
                onClick={handleAdvance}
                className="p-2 px-3 rounded-xl bg-amber-500/20 hover:bg-amber-500/30 text-amber-300 border border-amber-500/40 transition cursor-pointer active:scale-95 flex items-center gap-1.5 text-xs font-mono font-semibold"
                title="Advance to next speaker [N]"
              >
                <SkipForward className="w-3.5 h-3.5" />
                <span>Next</span>
              </button>
              <button
                type="button"
                onClick={() => removeSpeakerFromQueue(currentSpeaker.id)}
                className="p-2 rounded-xl bg-white/[0.04] hover:bg-red-500/20 text-neutral-400 hover:text-red-300 border border-white/10 hover:border-red-500/30 transition cursor-pointer active:scale-95 text-xs"
                title="Remove speaker from queue"
              >
                <Trash2 className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        </div>

        {/* Dynamic Progress Bar */}
        <div className="h-2 w-full bg-black/50 rounded-full overflow-hidden p-0.5 border border-white/5">
          <div
            className="h-full bg-gradient-to-r from-amber-500 to-amber-300 rounded-full transition-all duration-300"
            style={{ width: `${Math.min(100, Math.max(5, ((currentSpeaker.timeRemainingSeconds || 90) / 90) * 100))}%` }}
          />
        </div>

        {/* ── PARLIAMENTARY YIELDS TOOLBAR (ZENVITRA STYLE) ── */}
        <div className="pt-2 border-t border-white/[0.06] space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-mono font-semibold text-neutral-400 uppercase tracking-wider">
              PARLIAMENTARY YIELDS // FLOOR CONCLUSION
            </span>
            <span className="text-[10px] font-mono text-neutral-500">
              Rule 14.3 Parliamentary Order
            </span>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
            {/* Yield to Chair */}
            <button
              type="button"
              onClick={handleYieldToChair}
              className="p-2 px-3 rounded-xl bg-white/[0.03] hover:bg-white/[0.08] border border-white/10 text-neutral-200 hover:text-white font-mono text-xs transition cursor-pointer flex items-center justify-center gap-1.5 active:scale-95 text-center group"
              title="Yield remaining speech time back to Dais"
            >
              <Gavel className="w-3.5 h-3.5 text-amber-400 group-hover:rotate-12 transition-transform" />
              <span>To Chair</span>
            </button>

            {/* Yield to Delegate */}
            <button
              type="button"
              onClick={() => setShowYieldDelegateModal(true)}
              className="p-2 px-3 rounded-xl bg-white/[0.03] hover:bg-white/[0.08] border border-white/10 text-neutral-200 hover:text-white font-mono text-xs transition cursor-pointer flex items-center justify-center gap-1.5 active:scale-95 text-center group"
              title="Yield remaining speech time to an allied state"
            >
              <Users className="w-3.5 h-3.5 text-cyan-400 group-hover:scale-110 transition-transform" />
              <span>To Delegate</span>
            </button>

            {/* Yield to Questions */}
            <button
              type="button"
              onClick={handleYieldToQuestions}
              className="p-2 px-3 rounded-xl bg-white/[0.03] hover:bg-white/[0.08] border border-white/10 text-neutral-200 hover:text-white font-mono text-xs transition cursor-pointer flex items-center justify-center gap-1.5 active:scale-95 text-center group"
              title="Yield to Points of Information (Questions from the floor)"
            >
              <HelpCircle className="w-3.5 h-3.5 text-emerald-400 group-hover:rotate-12 transition-transform" />
              <span>To Questions</span>
            </button>

            {/* Yield to Comments */}
            <button
              type="button"
              onClick={handleYieldToComments}
              className="p-2 px-3 rounded-xl bg-white/[0.03] hover:bg-white/[0.08] border border-white/10 text-neutral-200 hover:text-white font-mono text-xs transition cursor-pointer flex items-center justify-center gap-1.5 active:scale-95 text-center group"
              title="Yield to 2 x 30s comments from the floor"
            >
              <MessageSquare className="w-3.5 h-3.5 text-purple-400 group-hover:scale-110 transition-transform" />
              <span>To Comments</span>
            </button>
          </div>
        </div>

        {/* POI Active Window Banner */}
        {poiCountdown !== null && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="p-3.5 rounded-xl bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-between"
          >
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
              <span className="font-mono text-xs text-emerald-300 font-semibold">
                POINTS OF INFORMATION (POI) WINDOW OPEN
              </span>
            </div>
            <div className="flex items-center gap-3">
              <span className="font-mono text-base font-bold text-white tabular-nums">
                00:{poiCountdown.toString().padStart(2, '0')}
              </span>
              <button
                type="button"
                onClick={() => setPoiCountdown(null)}
                className="text-neutral-400 hover:text-white text-xs font-mono"
              >
                Close POI
              </button>
            </div>
          </motion.div>
        )}

        {/* Floor Comments Slots */}
        {commentsSlots && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            className="p-3.5 rounded-xl bg-purple-500/10 border border-purple-500/30 space-y-2"
          >
            <div className="flex items-center justify-between">
              <span className="font-mono text-xs text-purple-300 font-semibold">
                FLOOR COMMENTS ALLOCATION (2 SLOTS &bull; 30s EACH)
              </span>
              <button
                type="button"
                onClick={() => setCommentsSlots(null)}
                className="text-neutral-400 hover:text-white text-xs font-mono"
              >
                Done
              </button>
            </div>
            <div className="grid grid-cols-2 gap-2 text-xs font-mono">
              {commentsSlots.map((slot) => (
                <div key={slot.slot} className="p-2 rounded-lg bg-black/40 border border-white/5 flex items-center justify-between text-neutral-300">
                  <span>Slot #{slot.slot}: 30s Floor</span>
                  <button
                    type="button"
                    onClick={() => daisAudio.playWarningBell()}
                    className="text-[10px] text-amber-300 hover:underline"
                  >
                    Start 30s
                  </button>
                </div>
              ))}
            </div>
          </motion.div>
        )}
      </motion.div>

      {/* Upcoming Speakers Queue */}
      {upcomingSpeakers.length > 0 && (
        <div className="space-y-2.5">
          <div className="flex items-center justify-between">
            <span className="font-mono text-[10px] text-neutral-500 tracking-widest uppercase block">
              RECOGNIZED NEXT IN LINE // QUEUED SPEAKERS
            </span>
            <span className="text-[10px] font-mono text-neutral-500">
              {upcomingSpeakers.length} delegations waiting
            </span>
          </div>

          <div className="space-y-1.5">
            <AnimatePresence initial={false}>
              {upcomingSpeakers.map((spk, idx) => {
                const flag = lookupFlag(spk.portfolio);
                return (
                  <motion.div
                    key={spk.id || idx}
                    initial={{ opacity: 0, y: 4 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, x: -10 }}
                    transition={{ duration: 0.15 }}
                    className="flex items-center justify-between p-3 rounded-xl bg-white/[0.02] hover:bg-white/[0.04] border border-white/[0.04] text-xs font-outfit transition-colors"
                  >
                    <div className="flex items-center gap-2.5">
                      <span className="text-xl">{flag}</span>
                      <span className="text-white font-medium">{spk.portfolio}</span>
                      <span className="text-neutral-500 text-[11px]">&bull; {spk.delegateName || 'Delegate'}</span>
                    </div>

                    <div className="flex items-center gap-2.5 font-mono text-[11px]">
                      <span className="text-neutral-500">
                        {Math.floor((spk.timeRemainingSeconds || 90) / 60)}:
                        {((spk.timeRemainingSeconds || 90) % 60).toString().padStart(2, '0')}
                      </span>
                      <span
                        className={`px-2 py-0.5 rounded text-[9px] font-bold uppercase ${
                          idx === 0
                            ? 'bg-amber-400/20 text-amber-300 border border-amber-400/40'
                            : 'bg-white/5 text-neutral-400'
                        }`}
                      >
                        {idx === 0 ? 'ON DECK' : `ORDER #${idx + 1}`}
                      </span>
                      <button
                        type="button"
                        onClick={() => removeSpeakerFromQueue(spk.id)}
                        className="p-1 rounded text-neutral-500 hover:text-red-400 transition cursor-pointer"
                        title="Remove from queue"
                      >
                        <Trash2 className="w-3 h-3" />
                      </button>
                    </div>
                  </motion.div>
                );
              })}
            </AnimatePresence>
          </div>
        </div>
      )}

      {/* Yield to Delegate Modal */}
      {showYieldDelegateModal && (
        <div className="fixed inset-0 z-[99999] flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
          <motion.div
            initial={{ scale: 0.95, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="w-full max-w-md bg-[#0a0c10] border border-white/15 rounded-3xl p-6 space-y-4 shadow-2xl"
          >
            <div className="flex items-center justify-between border-b border-white/10 pb-3">
              <div className="flex items-center gap-2">
                <Users className="w-4 h-4 text-cyan-400" />
                <h3 className="font-display font-semibold text-white text-base">
                  Yield Floor to Another Delegate
                </h3>
              </div>
              <button
                type="button"
                onClick={() => setShowYieldDelegateModal(false)}
                className="p-1 rounded-lg text-neutral-400 hover:text-white"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <p className="text-xs text-neutral-400 font-mono">
              The recognized speaker ({currentSpeaker.portfolio}) is conceding their remaining time to another delegation.
            </p>

            <input
              type="text"
              value={targetDelegateInput}
              onChange={(e) => setTargetDelegateInput(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleYieldToDelegateConfirm(targetDelegateInput)}
              placeholder="Enter recipient country (e.g. France, Japan, India)..."
              autoFocus
              className="w-full bg-black/60 border border-white/15 focus:border-cyan-400 px-3.5 py-2.5 rounded-xl text-xs text-white placeholder-neutral-500 font-mono focus:outline-none"
            />

            <div className="flex items-center justify-end gap-2 pt-2">
              <button
                type="button"
                onClick={() => setShowYieldDelegateModal(false)}
                className="px-3 py-1.5 rounded-xl bg-white/5 hover:bg-white/10 text-neutral-300 font-mono text-xs"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={() => handleYieldToDelegateConfirm(targetDelegateInput)}
                disabled={!targetDelegateInput.trim()}
                className="px-4 py-1.5 rounded-xl bg-cyan-500 hover:bg-cyan-400 disabled:opacity-50 text-black font-mono text-xs font-bold transition flex items-center gap-1"
              >
                <CheckCircle2 className="w-3.5 h-3.5" />
                <span>Confirm Yield</span>
              </button>
            </div>
          </motion.div>
        </div>
      )}
    </div>
  );
}
