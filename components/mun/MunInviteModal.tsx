'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import {
  ShieldCheck,
  Award,
  Crown,
  CheckCircle2,
  X,
  FileText,
  Sparkles,
  ArrowRight,
  Globe2,
  Calendar,
  Lock,
  ExternalLink,
  Layers,
  Radio
} from 'lucide-react';
import { useMun } from '@/context/MunContext';
import { MunInvite } from '@/types/mun';

export function MunInviteModal() {
  const router = useRouter();
  const { selectedInviteModal, setSelectedInviteModal, acceptMunInvite, declineMunInvite, setActiveCommitteeId } = useMun();
  const [isAccepting, setIsAccepting] = useState(false);
  const [acceptedSuccess, setAcceptedSuccess] = useState(false);

  if (!selectedInviteModal) return null;

  const handleAccept = () => {
    setIsAccepting(true);
    acceptMunInvite(selectedInviteModal.id);
    setActiveCommitteeId(selectedInviteModal.committeeId);

    setTimeout(() => {
      setIsAccepting(false);
      setAcceptedSuccess(true);
    }, 600);
  };

  const handleEnterChamber = () => {
    const committeeId = selectedInviteModal.committeeId;
    setSelectedInviteModal(null);
    setAcceptedSuccess(false);
    router.push(`/committee/${committeeId}`);
  };

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-[99999] overflow-y-auto flex flex-col justify-start sm:justify-center items-center p-3 sm:p-6 select-none font-sans">
        {/* Backdrop */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={() => setSelectedInviteModal(null)}
          className="fixed inset-0 bg-black/90 backdrop-blur-2xl"
        />

        {/* Holographic Diplomatic Parchment Card */}
        <motion.div
          initial={{ opacity: 0, scale: 0.93, y: 25 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.93, y: 25 }}
          transition={{ type: 'spring', stiffness: 380, damping: 28 }}
          className="relative w-full max-w-2xl rounded-3xl bg-[#07080c] border border-white/15 shadow-2xl overflow-hidden text-white z-10 my-auto max-h-[92vh] overflow-y-auto"
        >
          {/* Subtle Grid Overlay */}
          <div 
            className="absolute inset-0 opacity-15 pointer-events-none"
            style={{
              backgroundImage: 'linear-gradient(rgba(255, 255, 255, 0.05) 1px, transparent 1px), linear-gradient(90deg, rgba(255, 255, 255, 0.05) 1px, transparent 1px)',
              backgroundSize: '32px 32px'
            }}
          />

          {/* Close Icon */}
          <button
            type="button"
            onClick={() => {
              setSelectedInviteModal(null);
              setAcceptedSuccess(false);
            }}
            className="absolute top-5 right-5 p-2 rounded-full bg-white/5 border border-white/10 text-neutral-400 hover:text-white hover:bg-white/10 transition cursor-pointer z-20"
          >
            <X className="w-4 h-4" />
          </button>

          <div className="p-6 sm:p-9 space-y-6 relative z-10">
            {/* Seal & Heading */}
            <div className="flex items-start gap-4">
              <div className="w-14 h-14 rounded-2xl bg-white/10 border border-white/15 flex items-center justify-center p-0.5 shrink-0">
                <div className="w-full h-full rounded-[14px] bg-[#090b10] flex items-center justify-center">
                  <Award className="w-7 h-7 text-white" />
                </div>
              </div>

              <div className="space-y-1">
                <div className="inline-flex items-center gap-2 px-3 py-0.5 rounded-full bg-amber-500/10 border border-amber-500/30 text-amber-300 font-mono text-[10px] font-bold tracking-widest uppercase">
                  <ShieldCheck className="w-3 h-3 text-amber-400" />
                  <span>OFFICIAL SECRETARIAT ALLOTMENT</span>
                </div>
                <h2 className="font-display font-bold text-xl sm:text-2xl text-white tracking-tight">
                  Diplomatic Credential Allotment
                </h2>
                <p className="text-xs font-mono text-neutral-400">
                  {selectedInviteModal.eventName}
                </p>
              </div>
            </div>

            {/* Allotted Portfolio & Committee Spotlight */}
            <div className="p-5 sm:p-6 rounded-2xl bg-gradient-to-r from-amber-500/[0.08] via-white/[0.03] to-transparent border border-amber-500/25 space-y-4">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-white/10">
                <div>
                  <span className="text-[10px] font-mono text-amber-400/80 uppercase tracking-widest block font-bold">
                    RATIFIED ALLOTMENT
                  </span>
                  <div className="flex items-center gap-2.5 mt-0.5">
                    <span className="text-2xl">{selectedInviteModal.flagEmoji}</span>
                    <span className="font-display font-bold text-lg sm:text-xl text-white">
                      {selectedInviteModal.portfolio}
                    </span>
                  </div>
                </div>

                <div className="px-3 py-1.5 rounded-xl bg-black/60 border border-white/15 text-xs font-mono text-neutral-300 flex items-center gap-2 self-start sm:self-auto">
                  <Globe2 className="w-3.5 h-3.5 text-cyan-400" />
                  <span>{selectedInviteModal.committeeName}</span>
                </div>
              </div>

              {/* Letter of Allotment text */}
              <div className="text-xs sm:text-sm text-neutral-300 font-sans leading-relaxed whitespace-pre-wrap bg-black/40 p-4 rounded-xl border border-white/5 font-normal">
                "{selectedInviteModal.allotmentLetterText}"
              </div>

              {/* Presiding Dais / Executive Board */}
              <div className="flex items-center justify-between text-xs font-mono text-neutral-400 pt-1">
                <div className="flex items-center gap-2">
                  <Crown className="w-3.5 h-3.5 text-amber-400" />
                  <span>Presiding Chair: <strong className="text-white">{selectedInviteModal.ebChair}</strong></span>
                </div>
                {selectedInviteModal.ebViceChair && (
                  <span className="hidden sm:inline text-neutral-500">Vice Chair: {selectedInviteModal.ebViceChair}</span>
                )}
              </div>
            </div>

            {/* Unlocked Features Summary */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-left">
              <div className="p-3 rounded-xl bg-white/[0.03] border border-white/10 space-y-1">
                <div className="flex items-center gap-2 text-cyan-400 text-xs font-bold font-mono">
                  <Radio className="w-3.5 h-3.5" />
                  <span>Delegate Node</span>
                </div>
                <p className="text-[11px] text-neutral-400">
                  Live synchronous chamber access, speech floor & caucus relays.
                </p>
              </div>

              <div className="p-3 rounded-xl bg-white/[0.03] border border-white/10 space-y-1">
                <div className="flex items-center gap-2 text-amber-400 text-xs font-bold font-mono">
                  <Layers className="w-3.5 h-3.5" />
                  <span>Motions Queue</span>
                </div>
                <p className="text-[11px] text-neutral-400">
                  Raise Moderated/Unmod motions with custom timers & voting.
                </p>
              </div>

              <div className="p-3 rounded-xl bg-white/[0.03] border border-white/10 space-y-1">
                <div className="flex items-center gap-2 text-emerald-400 text-xs font-bold font-mono">
                  <FileText className="w-3.5 h-3.5" />
                  <span>Draft Resolutions</span>
                </div>
                <p className="text-[11px] text-neutral-400">
                  Collaborate, sponsor & introduce binding UN policy resolutions.
                </p>
              </div>
            </div>

            {/* Action Buttons */}
            {acceptedSuccess ? (
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="p-4 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 flex flex-col sm:flex-row items-center justify-between gap-4"
              >
                <div className="flex items-center gap-3">
                  <CheckCircle2 className="w-6 h-6 text-emerald-400 shrink-0" />
                  <div>
                    <p className="text-xs font-bold text-white font-mono">ALLOTMENT ACCEPTED &amp; SEED RECORD MINIED</p>
                    <p className="text-[11px] text-emerald-300 font-mono">Your diplomatic passport is active in the chamber.</p>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={handleEnterChamber}
                  className="w-full sm:w-auto px-5 py-2.5 rounded-xl bg-white text-black font-display font-bold text-xs hover:bg-neutral-200 transition-all flex items-center justify-center gap-2 cursor-pointer"
                >
                  <span>Launch Chamber</span>
                  <ArrowRight className="w-4 h-4 text-black" />
                </button>
              </motion.div>
            ) : (
              <div className="flex flex-col sm:flex-row items-center justify-between gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => {
                    declineMunInvite(selectedInviteModal.id);
                    setSelectedInviteModal(null);
                  }}
                  className="w-full sm:w-auto px-4 py-3 rounded-2xl border border-white/15 bg-transparent hover:bg-white/5 text-neutral-400 hover:text-white font-mono text-xs transition cursor-pointer"
                >
                  Decline Allotment
                </button>

                <button
                  type="button"
                  onClick={handleAccept}
                  disabled={isAccepting}
                  className="w-full sm:w-auto flex-1 sm:max-w-md py-3.5 px-6 rounded-2xl bg-white text-black font-display font-bold text-xs hover:bg-neutral-200 transition-all duration-200 flex items-center justify-center gap-2.5 cursor-pointer"
                >
                  {isAccepting ? (
                    <span>INITIALIZING CREDENTIALS...</span>
                  ) : (
                    <>
                      <Sparkles className="w-4 h-4 text-black fill-black" />
                      <span>ACCEPT ALLOTMENT &amp; ENTER CHAMBER</span>
                      <ArrowRight className="w-4 h-4 text-black" />
                    </>
                  )}
                </button>
              </div>
            )}
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}

export default MunInviteModal;
