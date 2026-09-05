'use client';

import React, { useState } from 'react';
import { 
  X, 
  Calculator, 
  Coins, 
  TrendingUp, 
  ShieldCheck, 
  Zap, 
  DollarSign, 
  ArrowRight, 
  Sparkles,
  Ticket,
  Building2,
  Users
} from 'lucide-react';
import { useZenPulse } from '@/context/ZenPulsePlatformContext';

interface RevenueFeeSimulatorModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function RevenueFeeSimulatorModal({ isOpen, onClose }: RevenueFeeSimulatorModalProps) {
  const { civicPointsBalance } = useZenPulse();

  /* Simulator States */
  const [ticketPrice, setTicketPrice] = useState(1500);
  const [ticketCount, setTicketCount] = useState(250);
  const [attendeeTier, setAttendeeTier] = useState<'standard' | 'pass' | 'elite'>('standard');
  const [hostTier, setHostTier] = useState<'standard' | 'pro' | 'institutional'>('standard');

  if (!isOpen) return null;

  /* Fee Calculations */
  const grossGMV = ticketPrice * ticketCount;

  // Attendee Take-Rate (Reduced to 0.5% + Rs 19 for transparent civic pricing)
  const attendeeFeeRate = attendeeTier === 'elite' ? 0 : attendeeTier === 'pass' ? 0.0025 : 0.005;
  const attendeeFixedFee = attendeeTier === 'elite' ? 0 : attendeeTier === 'pass' ? 10 : 19;
  const totalAttendeeFee = (grossGMV * attendeeFeeRate) + (ticketCount * attendeeFixedFee);

  // Host Take-Rate
  const hostFeeRate = hostTier === 'institutional' ? 0 : hostTier === 'pro' ? 0.0075 : 0.015;
  const totalHostFee = grossGMV * hostFeeRate;

  // Platform Net Margin
  const totalPlatformTake = totalAttendeeFee + totalHostFee;
  const netHostPayout = grossGMV - totalHostFee;

  return (
    <div 
      className="fixed inset-0 z-[150] flex items-center justify-center p-4 sm:p-6 bg-black/85 backdrop-blur-2xl overflow-y-auto"
      onClick={onClose}
    >
      <div 
        className="relative w-full max-w-3xl max-h-[90vh] flex flex-col rounded-3xl bg-[#090b10] border border-emerald-500/40 shadow-[0_25px_80px_rgba(0,0,0,0.95)] overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between p-5 sm:p-6 border-b border-white/10 bg-gradient-to-r from-emerald-950/30 via-neutral-900 to-cyan-950/30">
          <div className="flex items-center gap-3">
            <div className="w-11 h-11 rounded-2xl bg-emerald-500/20 border border-emerald-500/40 flex items-center justify-center text-emerald-400">
              <Calculator className="w-6 h-6" />
            </div>
            <div>
              <h2 className="font-display font-bold text-lg text-white">
                Dual-Sided Take-Rate Settlement Simulator
              </h2>
              <p className="text-xs font-mono text-neutral-400">
                Transparent Event Monetization &amp; Civic Micropayment Settlement Protocol
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 rounded-xl text-neutral-400 hover:text-white hover:bg-white/10 transition cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6">

          {/* Interactive Sliders */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="p-4 rounded-2xl bg-white/[0.02] border border-white/10 space-y-2">
              <div className="flex justify-between text-xs font-mono">
                <span className="text-neutral-400">Average Ticket Price</span>
                <span className="font-bold text-white">₹{ticketPrice.toLocaleString()}</span>
              </div>
              <input
                type="range"
                min="100"
                max="10000"
                step="50"
                value={ticketPrice}
                onChange={(e) => setTicketPrice(Number(e.target.value))}
                className="w-full accent-emerald-400"
              />
            </div>

            <div className="p-4 rounded-2xl bg-white/[0.02] border border-white/10 space-y-2">
              <div className="flex justify-between text-xs font-mono">
                <span className="text-neutral-400">Registered Delegates</span>
                <span className="font-bold text-white">{ticketCount.toLocaleString()} Seats</span>
              </div>
              <input
                type="range"
                min="10"
                max="5000"
                step="10"
                value={ticketCount}
                onChange={(e) => setTicketCount(Number(e.target.value))}
                className="w-full accent-cyan-400"
              />
            </div>
          </div>

          {/* Tier Toggles */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {/* Attendee Side */}
            <div className="space-y-2">
              <label className="text-xs font-mono text-neutral-400 flex items-center gap-1.5">
                <Users className="w-3.5 h-3.5 text-cyan-400" />
                <span>Attendee Convenience Take-Rate:</span>
              </label>
              <div className="grid grid-cols-3 gap-2">
                {[
                  { id: 'standard', label: 'Standard (0.5% + ₹19)' },
                  { id: 'pass', label: 'Pulse Pass (0.25% + ₹10)' },
                  { id: 'elite', label: 'Pulse Elite (0%)' },
                ].map((tier) => (
                  <button
                    key={tier.id}
                    type="button"
                    onClick={() => setAttendeeTier(tier.id as any)}
                    className={`p-2 rounded-xl border text-[11px] font-mono transition cursor-pointer ${
                      attendeeTier === tier.id
                        ? 'bg-cyan-500/20 border-cyan-400 text-cyan-300 font-bold'
                        : 'bg-white/[0.02] border-white/10 text-neutral-400 hover:text-white'
                    }`}
                  >
                    {tier.label}
                  </button>
                ))}
              </div>
            </div>


            {/* Host Side */}
            <div className="space-y-2">
              <label className="text-xs font-mono text-neutral-400 flex items-center gap-1.5">
                <Building2 className="w-3.5 h-3.5 text-emerald-400" />
                <span>Host Processing Take-Rate:</span>
              </label>
              <div className="grid grid-cols-3 gap-2">
                {[
                  { id: 'standard', label: 'Standard (1.5%)' },
                  { id: 'pro', label: 'Pro Host (0.75%)' },
                  { id: 'institutional', label: 'Summit (0%)' },
                ].map((tier) => (
                  <button
                    key={tier.id}
                    type="button"
                    onClick={() => setHostTier(tier.id as any)}
                    className={`p-2 rounded-xl border text-[11px] font-mono transition cursor-pointer ${
                      hostTier === tier.id
                        ? 'bg-emerald-500/20 border-emerald-400 text-emerald-300 font-bold'
                        : 'bg-white/[0.02] border-white/10 text-neutral-400 hover:text-white'
                    }`}
                  >
                    {tier.label}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Financial Settlement Breakdown Card */}
          <div className="p-6 rounded-3xl bg-gradient-to-br from-neutral-950 via-neutral-900 to-emerald-950/40 border border-emerald-500/40 space-y-4 shadow-[0_0_35px_rgba(16,185,129,0.15)]">
            <div className="flex items-center justify-between pb-3 border-b border-white/10">
              <span className="font-mono text-xs text-neutral-400 uppercase">Gross Merchandise Value (GMV)</span>
              <span className="font-display font-extrabold text-xl text-white">₹{grossGMV.toLocaleString()}</span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div className="p-3.5 rounded-2xl bg-white/[0.03] border border-white/10">
                <span className="text-[10px] font-mono text-neutral-400 uppercase">Net Host Payout</span>
                <div className="font-mono text-base font-bold text-emerald-300 mt-1">₹{Math.round(netHostPayout).toLocaleString()}</div>
                <div className="text-[10px] text-neutral-500 font-mono">{(100 - (hostFeeRate * 100)).toFixed(2)}% of Gross GMV</div>
              </div>

              <div className="p-3.5 rounded-2xl bg-white/[0.03] border border-white/10">
                <span className="text-[10px] font-mono text-neutral-400 uppercase">Platform Take (Both Sides)</span>
                <div className="font-mono text-base font-bold text-cyan-300 mt-1">₹{Math.round(totalPlatformTake).toLocaleString()}</div>
                <div className="text-[10px] text-neutral-500 font-mono">Attendee + Host Fees</div>
              </div>

              <div className="p-3.5 rounded-2xl bg-white/[0.03] border border-white/10">
                <span className="text-[10px] font-mono text-neutral-400 uppercase">Attendee Total Paid</span>
                <div className="font-mono text-base font-bold text-amber-300 mt-1">₹{Math.round(grossGMV + totalAttendeeFee).toLocaleString()}</div>
                <div className="text-[10px] text-neutral-500 font-mono">+₹{Math.round(totalAttendeeFee).toLocaleString()} Total Fees</div>
              </div>
            </div>
          </div>

          {/* Micro-Bounties Settlement Protocol info */}
          <div className="p-4 rounded-2xl bg-white/[0.02] border border-white/10 flex items-start gap-3">
            <Sparkles className="w-5 h-5 text-amber-400 shrink-0 mt-0.5" />
            <div className="text-xs text-neutral-300 leading-relaxed font-sans">
              <strong className="text-white font-mono">Civic Micro-Grant Escrow:</strong> 15% of all platform take-rate margins are automatically diverted into the sovereign community pool for rewarding peer-audited research and zero-hallucination fact verification.
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}
