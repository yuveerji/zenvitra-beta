'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  QrCode,
  X,
  CheckCircle2,
  AlertTriangle,
  XCircle,
  Sparkles,
  Camera,
  ShieldCheck,
  Search,
  Users
} from 'lucide-react';
import { useZenPass } from '@/context/ZenPassContext';
import { ZenPassTicket } from '@/types/zenpass';

interface ZenPassScannerModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function ZenPassScannerModal({ isOpen, onClose }: ZenPassScannerModalProps) {
  const { validateAndCheckInPass, userPasses } = useZenPass();

  const [inputCode, setInputCode] = useState<string>('');
  const [scanResult, setScanResult] = useState<{
    status: 'idle' | 'success' | 'warning' | 'error';
    message: string;
    ticket?: ZenPassTicket;
  }>({
    status: 'idle',
    message: ''
  });

  if (!isOpen) return null;

  const handleScanSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputCode.trim()) return;

    const res = validateAndCheckInPass(inputCode.trim());
    if (res.success) {
      setScanResult({
        status: 'success',
        message: res.message,
        ticket: res.ticket
      });
    } else if (res.ticket) {
      setScanResult({
        status: 'warning',
        message: res.message,
        ticket: res.ticket
      });
    } else {
      setScanResult({
        status: 'error',
        message: res.message
      });
    }
  };

  const handleQuickDemoScan = (ticket: ZenPassTicket) => {
    setInputCode(ticket.ticketNumber);
    const res = validateAndCheckInPass(ticket.ticketNumber);
    setScanResult({
      status: res.success ? 'success' : res.ticket ? 'warning' : 'error',
      message: res.message,
      ticket: res.ticket || ticket
    });
  };

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 overflow-y-auto select-none">
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
          className="relative w-full max-w-lg bg-[#090a0f] border border-emerald-500/30 rounded-3xl shadow-2xl flex flex-col overflow-hidden z-10 text-white"
        >
          {/* Header */}
          <div className="p-5 sm:p-6 border-b border-white/10 flex items-center justify-between bg-white/[0.02]">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-2xl bg-emerald-500/15 border border-emerald-500/30 flex items-center justify-center text-emerald-400">
                <Camera className="w-5 h-5" />
              </div>
              <div>
                <h2 className="font-display font-bold text-lg text-white flex items-center gap-2">
                  <span>ZenPass Door Scanner</span>
                  <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-300 font-bold">
                    Organizer Console
                  </span>
                </h2>
                <p className="text-xs text-neutral-400">
                  Scan QR passes or type ticket numbers for instant gate admission.
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

          <div className="p-5 sm:p-7 space-y-6">
            
            {/* Viewfinder Simulation */}
            <div className="relative w-full h-48 rounded-2xl bg-black border border-emerald-500/30 flex flex-col items-center justify-center overflow-hidden">
              <div className="w-36 h-36 border-2 border-dashed border-emerald-400/50 rounded-xl relative flex items-center justify-center">
                <QrCode className="w-16 h-16 text-emerald-400/40" />
                
                {/* Laser Bar */}
                <motion.div
                  animate={{ y: [-60, 60, -60] }}
                  transition={{ repeat: Infinity, duration: 2, ease: 'linear' }}
                  className="absolute left-0 right-0 h-0.5 bg-emerald-400 shadow-[0_0_12px_rgba(52,211,153,1)]"
                />
              </div>
              <span className="text-[10px] font-mono text-emerald-400/70 mt-3 uppercase tracking-wider">
                Optical Scanner Active &bull; Point at attendee QR
              </span>
            </div>

            {/* Manual Ticket Input */}
            <form onSubmit={handleScanSubmit} className="space-y-2">
              <label className="text-xs font-mono font-bold text-neutral-300 uppercase tracking-wider block">
                Enter Ticket Number or Security Hash
              </label>
              <div className="flex items-center gap-2">
                <input
                  type="text"
                  required
                  value={inputCode}
                  onChange={(e) => setInputCode(e.target.value)}
                  placeholder="e.g. ZEN-PASS-88492"
                  className="flex-1 bg-black/60 border border-white/15 rounded-xl px-4 py-2.5 text-xs text-white placeholder-neutral-500 font-mono uppercase focus:outline-none focus:border-emerald-400"
                />
                <button
                  type="submit"
                  className="px-5 py-2.5 rounded-xl bg-emerald-400 hover:bg-emerald-300 text-black font-display font-bold text-xs shadow-md transition cursor-pointer flex items-center gap-1.5"
                >
                  <ShieldCheck className="w-4 h-4" />
                  <span>Verify Pass</span>
                </button>
              </div>
            </form>

            {/* Scan Feedback Card */}
            {scanResult.status !== 'idle' && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className={`p-4 rounded-2xl border ${
                  scanResult.status === 'success'
                    ? 'bg-emerald-500/10 border-emerald-500/40 text-emerald-300'
                    : scanResult.status === 'warning'
                    ? 'bg-amber-500/10 border-amber-500/40 text-amber-300'
                    : 'bg-rose-500/10 border-rose-500/40 text-rose-300'
                }`}
              >
                <div className="flex items-center gap-2 font-bold text-sm">
                  {scanResult.status === 'success' ? (
                    <CheckCircle2 className="w-5 h-5 text-emerald-400" />
                  ) : scanResult.status === 'warning' ? (
                    <AlertTriangle className="w-5 h-5 text-amber-400" />
                  ) : (
                    <XCircle className="w-5 h-5 text-rose-400" />
                  )}
                  <span>{scanResult.message}</span>
                </div>

                {scanResult.ticket && (
                  <div className="mt-3 pt-2 border-t border-white/10 text-xs font-mono text-white space-y-1">
                    <div>Attendee: <strong>{scanResult.ticket.attendeeName}</strong> (@{scanResult.ticket.attendeeHandle})</div>
                    <div>Tier: <strong>{scanResult.ticket.tierName}</strong></div>
                    {scanResult.ticket.allocatedPortfolio && (
                      <div>Role: <strong>{scanResult.ticket.allocatedPortfolio}</strong></div>
                    )}
                  </div>
                )}
              </motion.div>
            )}

            {/* Quick Demo Passes */}
            <div className="space-y-2 pt-2 border-t border-white/10">
              <span className="text-[11px] font-mono text-neutral-400 block">
                Quick Test Sample Tickets:
              </span>
              <div className="flex flex-wrap gap-2">
                {userPasses.map((pass) => (
                  <button
                    key={pass.id}
                    type="button"
                    onClick={() => handleQuickDemoScan(pass)}
                    className="px-3 py-1.5 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-[11px] font-mono text-neutral-300 hover:text-white transition cursor-pointer"
                  >
                    <span>{pass.ticketNumber} ({pass.tierName})</span>
                  </button>
                ))}
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
