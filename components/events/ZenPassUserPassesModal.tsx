'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Ticket,
  X,
  Sparkles,
  ArrowRight,
  ShieldCheck,
  Calendar,
  MapPin,
  Clock,
  Crown,
  RefreshCw,
  CheckCircle2,
  AlertCircle,
  Ban,
  DollarSign
} from 'lucide-react';
import { useZenPass } from '@/context/ZenPassContext';
import { ZenPassTicket } from '@/types/zenpass';

interface ZenPassUserPassesModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectPass: (pass: ZenPassTicket) => void;
}

export function ZenPassUserPassesModal({ isOpen, onClose, onSelectPass }: ZenPassUserPassesModalProps) {
  const { userPasses, refundPass } = useZenPass();
  const [refundingId, setRefundingId] = useState<string | null>(null);
  const [refundResult, setRefundResult] = useState<{ passId: string; message: string; success: boolean } | null>(null);
  const [showRefundConfirm, setShowRefundConfirm] = useState<string | null>(null);

  if (!isOpen) return null;

  const activePasses = userPasses.filter((p) => p.status === 'valid' || p.status === 'checked_in');
  const refundedPasses = userPasses.filter((p) => p.status === 'refunded');

  const handleRefundRequest = async (passId: string) => {
    setRefundingId(passId);
    setShowRefundConfirm(null);

    // Small delay to simulate processing
    await new Promise((r) => setTimeout(r, 800));

    const result = refundPass(passId, 'Attendee requested manual refund');
    setRefundResult({
      passId,
      success: result.success,
      message: result.message,
    });
    setRefundingId(null);

    // Auto-clear the result after 4 seconds
    setTimeout(() => setRefundResult(null), 4000);
  };

  const getStatusBadge = (pass: ZenPassTicket) => {
    switch (pass.status) {
      case 'refunded':
        return (
          <span className="flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-rose-500/20 text-rose-300 border border-rose-500/30 text-[10px] font-mono font-bold">
            <Ban className="w-2.5 h-2.5" />
            REFUNDED
          </span>
        );
      case 'checked_in':
        return (
          <span className="flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 text-[10px] font-mono font-bold">
            <CheckCircle2 className="w-2.5 h-2.5" />
            CHECKED IN
          </span>
        );
      default:
        return (
          <span className="flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-amber-400/20 text-amber-300 border border-amber-400/30 text-[10px] font-mono font-bold">
            <ShieldCheck className="w-2.5 h-2.5" />
            VALID
          </span>
        );
    }
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
          className="relative w-full max-w-2xl max-h-[90vh] bg-[#090a0f] border border-amber-500/30 rounded-3xl shadow-2xl flex flex-col overflow-hidden z-10 text-white"
        >
          {/* Header */}
          <div className="p-5 sm:p-6 border-b border-white/10 flex items-center justify-between bg-white/[0.02]">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-2xl bg-amber-500/15 border border-amber-500/30 flex items-center justify-center text-amber-400">
                <Ticket className="w-5 h-5" />
              </div>
              <div>
                <h2 className="font-display font-bold text-lg text-white flex items-center gap-2">
                  <span>My ZenPass Wallet</span>
                  <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-amber-500/20 text-amber-300 font-bold">
                    {activePasses.length} Active
                  </span>
                  {refundedPasses.length > 0 && (
                    <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-rose-500/20 text-rose-300 font-bold">
                      {refundedPasses.length} Refunded
                    </span>
                  )}
                </h2>
                <p className="text-xs text-neutral-400">
                  Your official gate passes, seat allotments, and chamber credentials.
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

          {/* Refund Success Banner */}
          <AnimatePresence>
            {refundResult && (
              <motion.div
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: 'auto', opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                className="overflow-hidden"
              >
                <div className={`mx-5 mt-4 p-4 rounded-2xl border text-xs font-mono ${
                  refundResult.success
                    ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-300'
                    : 'bg-rose-500/10 border-rose-500/30 text-rose-300'
                }`}>
                  <div className="flex items-center gap-2">
                    {refundResult.success ? (
                      <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                    ) : (
                      <AlertCircle className="w-4 h-4 text-rose-400 shrink-0" />
                    )}
                    <span>{refundResult.message}</span>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Passes List */}
          <div className="flex-1 overflow-y-auto p-5 sm:p-7 space-y-4 max-h-[65vh]">
            {userPasses.length === 0 ? (
              <div className="p-12 text-center text-neutral-500 font-mono text-xs">
                No active ZenPasses found. Book an event pass from the district directory!
              </div>
            ) : (
              <>
                {/* Active Passes */}
                {activePasses.length > 0 && (
                  <div className="space-y-3">
                    <h3 className="text-[10px] font-mono text-neutral-500 uppercase tracking-widest font-bold">
                      Active Passes ({activePasses.length})
                    </h3>
                    {activePasses.map((pass) => (
                      <div
                        key={pass.id}
                        className="p-5 rounded-2xl bg-gradient-to-r from-amber-500/[0.06] via-purple-500/[0.04] to-black border border-white/15 hover:border-amber-400/60 shadow-lg hover:shadow-[0_0_30px_rgba(245,158,11,0.2)] transition flex flex-col gap-4 group"
                      >
                        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 cursor-pointer"
                          onClick={() => {
                            onSelectPass(pass);
                            onClose();
                          }}
                        >
                          <div className="space-y-2 flex-1">
                            <div className="flex items-center gap-2 flex-wrap">
                              <span className="px-2.5 py-0.5 rounded-full bg-amber-400/20 text-amber-300 border border-amber-400/30 text-[10px] font-mono font-bold">
                                {pass.tierName}
                              </span>
                              {getStatusBadge(pass)}
                              <span className="text-xs font-mono text-neutral-400">
                                #{pass.ticketNumber}
                              </span>
                            </div>

                            <h3 className="font-display font-bold text-base sm:text-lg text-white group-hover:text-amber-300 transition">
                              {pass.eventTitle}
                            </h3>

                            {pass.allocatedPortfolio && (
                              <div className="flex items-center gap-1.5 text-xs font-mono text-amber-200">
                                <Crown className="w-3.5 h-3.5 text-amber-400" />
                                <span>{pass.allocatedPortfolio}</span>
                              </div>
                            )}

                            <div className="flex flex-wrap items-center gap-3 text-xs font-mono text-neutral-400">
                              <span className="flex items-center gap-1">
                                <Calendar className="w-3 h-3 text-neutral-500" />
                                <span>{pass.eventDate}</span>
                              </span>
                              <span className="flex items-center gap-1">
                                <MapPin className="w-3 h-3 text-neutral-500" />
                                <span>{pass.venueCity}</span>
                              </span>
                              <span className="flex items-center gap-1">
                                <DollarSign className="w-3 h-3 text-neutral-500" />
                                <span>₹{pass.totalAmount}</span>
                              </span>
                            </div>
                          </div>

                          <div className="flex items-center gap-2 self-end sm:self-center font-display font-bold text-xs text-amber-300 group-hover:translate-x-1 transition shrink-0">
                            <span>View Pass &amp; QR</span>
                            <ArrowRight className="w-4 h-4" />
                          </div>
                        </div>

                        {/* Refund Action Row */}
                        {pass.status === 'valid' && (
                          <div className="border-t border-white/[0.06] pt-3 flex items-center justify-between">
                            {showRefundConfirm === pass.id ? (
                              <div className="flex items-center gap-2 w-full">
                                <span className="text-[11px] font-mono text-rose-300 flex-1">
                                  Confirm 100% refund of ₹{pass.totalAmount}?
                                </span>
                                <button
                                  type="button"
                                  onClick={() => setShowRefundConfirm(null)}
                                  className="px-3 py-1.5 rounded-xl bg-white/[0.04] border border-white/10 text-xs font-mono text-neutral-300 hover:bg-white/10 transition cursor-pointer"
                                >
                                  Cancel
                                </button>
                                <button
                                  type="button"
                                  disabled={refundingId === pass.id}
                                  onClick={() => handleRefundRequest(pass.id)}
                                  className="px-3 py-1.5 rounded-xl bg-rose-600 hover:bg-rose-500 text-white font-display font-bold text-xs transition cursor-pointer flex items-center gap-1.5 disabled:opacity-50 shadow-md"
                                >
                                  {refundingId === pass.id ? (
                                    <RefreshCw className="w-3 h-3 animate-spin" />
                                  ) : (
                                    <>
                                      <Ban className="w-3 h-3" />
                                      <span>Confirm Refund</span>
                                    </>
                                  )}
                                </button>
                              </div>
                            ) : (
                              <button
                                type="button"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  setShowRefundConfirm(pass.id);
                                }}
                                className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-rose-500/10 border border-rose-500/20 text-xs font-mono text-rose-300 hover:bg-rose-500/20 hover:text-rose-200 transition cursor-pointer"
                              >
                                <RefreshCw className="w-3 h-3" />
                                <span>Request Refund</span>
                              </button>
                            )}
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                )}

                {/* Refunded Passes */}
                {refundedPasses.length > 0 && (
                  <div className="space-y-3 pt-4">
                    <h3 className="text-[10px] font-mono text-neutral-500 uppercase tracking-widest font-bold">
                      Refunded Passes ({refundedPasses.length})
                    </h3>
                    {refundedPasses.map((pass) => (
                      <div
                        key={pass.id}
                        onClick={() => {
                          onSelectPass(pass);
                          onClose();
                        }}
                        className="p-5 rounded-2xl bg-rose-950/20 border border-rose-500/20 hover:border-rose-500/40 shadow-lg transition cursor-pointer flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 group opacity-80 hover:opacity-100"
                      >
                        <div className="space-y-2 flex-1">
                          <div className="flex items-center gap-2 flex-wrap">
                            <span className="px-2.5 py-0.5 rounded-full bg-rose-500/20 text-rose-300 border border-rose-500/30 text-[10px] font-mono font-bold">
                              {pass.tierName}
                            </span>
                            {getStatusBadge(pass)}
                            <span className="text-xs font-mono text-neutral-400">
                              #{pass.ticketNumber}
                            </span>
                          </div>

                          <h3 className="font-display font-bold text-base sm:text-lg text-neutral-300 group-hover:text-rose-200 transition line-through decoration-rose-500/60">
                            {pass.eventTitle}
                          </h3>

                          <div className="flex flex-wrap items-center gap-3 text-xs font-mono text-neutral-500">
                            <span className="flex items-center gap-1">
                              <Calendar className="w-3 h-3" />
                              <span>{pass.eventDate}</span>
                            </span>
                            <span className="flex items-center gap-1">
                              <MapPin className="w-3 h-3" />
                              <span>{pass.venueCity}</span>
                            </span>
                          </div>

                          {/* Refund Receipt Details */}
                          <div className="p-3 rounded-xl bg-black/40 border border-rose-500/10 space-y-1 mt-1">
                            <div className="flex items-center justify-between text-[10px] font-mono">
                              <span className="text-neutral-500 uppercase">Refund Amount</span>
                              <span className="text-emerald-400 font-bold">₹{pass.refundAmount || pass.totalAmount}</span>
                            </div>
                            {pass.refundTransactionId && (
                              <div className="flex items-center justify-between text-[10px] font-mono">
                                <span className="text-neutral-500 uppercase">Transaction Ref</span>
                                <span className="text-neutral-300 font-bold">{pass.refundTransactionId}</span>
                              </div>
                            )}
                            {pass.refundedAt && (
                              <div className="flex items-center justify-between text-[10px] font-mono">
                                <span className="text-neutral-500 uppercase">Refunded On</span>
                                <span className="text-neutral-300">{new Date(pass.refundedAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' })}</span>
                              </div>
                            )}
                            {pass.refundReason && (
                              <div className="flex items-center justify-between text-[10px] font-mono">
                                <span className="text-neutral-500 uppercase">Reason</span>
                                <span className="text-rose-300 max-w-[200px] truncate">{pass.refundReason}</span>
                              </div>
                            )}
                          </div>
                        </div>

                        <div className="flex items-center gap-2 self-end sm:self-center font-display font-bold text-xs text-rose-300 group-hover:translate-x-1 transition shrink-0">
                          <span>View Receipt</span>
                          <ArrowRight className="w-4 h-4" />
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </>
            )}
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
