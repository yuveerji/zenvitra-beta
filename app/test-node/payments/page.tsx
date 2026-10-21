'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { 
  CreditCard, 
  IndianRupee, 
  CheckCircle2, 
  Clock, 
  AlertTriangle, 
  ShieldCheck, 
  RefreshCw, 
  Download, 
  QrCode, 
  FileText, 
  Lock,
  ArrowRight,
  Sparkles,
  Zap
} from 'lucide-react';
import { TestNodeProvider, useTestNode } from '@/context/TestNodeContext';
import { TestNodeShell } from '@/components/test-node/TestNodeShell';
import { TestTransaction } from '@/lib/test-node/testNodeData';

function TestPaymentsContent() {
  const { transactions, simulatePayment, activePersona } = useTestNode();

  // Simulated Checkout Form
  const [selectedPass, setSelectedPass] = useState<'STANDARD' | 'PRIORITY' | 'DELEGATION'>('STANDARD');
  const [delegateNameInput, setDelegateNameInput] = useState(activePersona.name);
  const [committeeInput, setCommitteeInput] = useState('UNSC');
  const [paymentMode, setPaymentMode] = useState<TestTransaction['paymentMode']>('UPI_COLLECT');
  const [isProcessing, setIsProcessing] = useState(false);
  const [latestSuccessTxn, setLatestSuccessTxn] = useState<TestTransaction | null>(null);

  // Active Receipt Modal
  const [activeReceipt, setActiveReceipt] = useState<TestTransaction | null>(null);

  const passPrices = {
    STANDARD: 1499,
    PRIORITY: 1999,
    DELEGATION: 4999,
  };

  const currentAmount = passPrices[selectedPass];

  const handleSimulatePayment = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!delegateNameInput.trim()) return;

    setIsProcessing(true);
    setLatestSuccessTxn(null);

    try {
      const txn = await simulatePayment(currentAmount, delegateNameInput.trim(), committeeInput, paymentMode);
      setLatestSuccessTxn(txn);
    } catch (err) {
      console.error(err);
    } finally {
      setIsProcessing(false);
    }
  };

  const totalSimulatedRevenue = transactions.reduce(
    (acc, t) => acc + (t.status === 'SUCCESS' ? t.amount : 0),
    0
  );

  return (
    <div className="space-y-8">
      {/* ── 1. HEADER BANNER & FINANCIAL SAFETY NOTICE ── */}
      <div className="p-6 sm:p-8 rounded-3xl bg-gradient-to-r from-emerald-950/40 via-[#090d18] to-black border border-emerald-500/30 space-y-4">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <span className="px-3 py-1 rounded-full bg-emerald-500/20 text-emerald-300 font-mono text-[10px] uppercase font-bold tracking-wider flex items-center gap-1.5">
                <CreditCard className="w-3.5 h-3.5 text-emerald-400" />
                <span>ZEN.PAYMENTS // CASHFREE MOCK SANDBOX</span>
              </span>
              <span className="px-2 py-0.5 rounded-full bg-cyan-500/20 text-cyan-300 text-[10px] font-mono font-bold">
                100% SIMULATED MONEY (₹0 REAL CHARGE)
              </span>
            </div>

            <h1 className="text-2xl sm:text-3xl font-black text-white uppercase font-display">
              Payment Gateway &amp; Revenue Sandbox
            </h1>
            <p className="text-xs sm:text-sm text-neutral-400 max-w-2xl font-sans">
              Test end-to-end event registration checkouts, UPI collect dispatches, instant QR generation, and simulated Cashfree webhooks. No credit card or actual payment details are ever required.
            </p>
          </div>

          <div className="p-4 rounded-2xl bg-black/60 border border-emerald-500/40 text-right font-mono text-xs">
            <span className="text-[10px] text-neutral-400 uppercase tracking-wider block">Total Simulated Volume</span>
            <span className="text-2xl font-black text-emerald-400 font-mono mt-1 block">
              ₹{totalSimulatedRevenue.toLocaleString()}
            </span>
            <span className="text-[10px] text-neutral-500">Across {transactions.length} mock ledger entries</span>
          </div>
        </div>

        {/* Safety Callout */}
        <div className="p-3.5 rounded-2xl bg-amber-500/10 border border-amber-500/30 text-amber-300 text-xs font-mono flex items-center gap-2">
          <AlertTriangle className="w-4 h-4 text-amber-400 shrink-0" />
          <span>
            CRITICAL GUARANTEE: Never input real banking credentials, real UPI PINs, or live credit cards. All payments in this enclave trigger simulated callbacks only.
          </span>
        </div>
      </div>

      {/* ── 2. TWO-COLUMN LAYOUT: SIMULATED CHECKOUT + TRANSACTION LEDGER ── */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Left: Interactive Simulated Checkout (5 Cols) */}
        <div className="lg:col-span-5 p-6 rounded-3xl bg-[#080d1c] border border-white/15 space-y-5">
          <div className="flex items-center justify-between border-b border-white/10 pb-3">
            <div className="flex items-center gap-2">
              <Zap className="w-4 h-4 text-emerald-400" />
              <h2 className="text-base font-bold text-white font-display">
                Simulate Registration Checkout
              </h2>
            </div>
            <span className="text-xs font-mono text-neutral-400">Cashfree PG v3 Mock</span>
          </div>

          <form onSubmit={handleSimulatePayment} className="space-y-4 font-mono text-xs">
            {/* Pass Selection */}
            <div>
              <label className="text-[10px] text-neutral-400 uppercase block mb-1.5">Choose Pass Tier</label>
              <div className="grid grid-cols-3 gap-2">
                {[
                  { id: 'STANDARD', label: 'Standard', price: '₹1,499' },
                  { id: 'PRIORITY', label: 'Priority', price: '₹1,999' },
                  { id: 'DELEGATION', label: 'Delegation', price: '₹4,999' },
                ].map((tier) => (
                  <button
                    key={tier.id}
                    type="button"
                    onClick={() => setSelectedPass(tier.id as any)}
                    className={`p-2.5 rounded-xl border text-center transition cursor-pointer ${
                      selectedPass === tier.id
                        ? 'bg-emerald-500/20 border-emerald-400 text-emerald-300 font-bold'
                        : 'bg-white/5 border-white/10 text-neutral-400 hover:text-white'
                    }`}
                  >
                    <div className="text-[10px] uppercase">{tier.label}</div>
                    <div className="text-xs font-black text-white mt-0.5">{tier.price}</div>
                  </button>
                ))}
              </div>
            </div>

            {/* Delegate Name */}
            <div>
              <label className="text-[10px] text-neutral-400 uppercase block mb-1">Delegate Name</label>
              <input
                type="text"
                value={delegateNameInput}
                onChange={(e) => setDelegateNameInput(e.target.value)}
                placeholder="Enter delegate full name..."
                className="w-full bg-[#111422] border border-white/15 rounded-xl px-3 py-2 text-white focus:outline-none focus:border-emerald-400"
              />
            </div>

            {/* Target Committee */}
            <div>
              <label className="text-[10px] text-neutral-400 uppercase block mb-1">Target Committee</label>
              <select
                value={committeeInput}
                onChange={(e) => setCommitteeInput(e.target.value)}
                className="w-full bg-[#111422] border border-white/15 rounded-xl px-3 py-2 text-white focus:outline-none focus:border-emerald-400 cursor-pointer"
              >
                <option value="UNSC">UN Security Council (UNSC)</option>
                <option value="UNHRC">UN Human Rights Council (UNHRC)</option>
                <option value="LOK_SABHA">Lok Sabha (Parliament)</option>
                <option value="CRISIS">Continuous Crisis Committee</option>
              </select>
            </div>

            {/* Payment Method Simulator */}
            <div>
              <label className="text-[10px] text-neutral-400 uppercase block mb-1.5">Simulated Payment Mode</label>
              <div className="grid grid-cols-2 gap-2">
                {[
                  { id: 'UPI_COLLECT', label: '📱 Mock UPI Collect' },
                  { id: 'UPI_QR', label: '🔲 Mock UPI QR' },
                  { id: 'CARD', label: '💳 Test Virtual Card' },
                  { id: 'NET_BANKING', label: '🏦 Sandbox Netbanking' },
                ].map((mode) => (
                  <button
                    key={mode.id}
                    type="button"
                    onClick={() => setPaymentMode(mode.id as any)}
                    className={`p-2 rounded-xl text-left border transition cursor-pointer text-[10px] ${
                      paymentMode === mode.id
                        ? 'bg-cyan-500/20 border-cyan-400 text-cyan-300 font-bold'
                        : 'bg-white/5 border-white/10 text-neutral-400 hover:text-white'
                    }`}
                  >
                    {mode.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Checkout Trigger */}
            <button
              type="submit"
              disabled={isProcessing}
              className="w-full py-3 rounded-2xl bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-400 hover:to-teal-400 text-black font-display font-bold text-xs uppercase tracking-wider transition cursor-pointer shadow-lg shadow-emerald-500/20 flex items-center justify-center gap-2 active:scale-95 disabled:opacity-50"
            >
              {isProcessing ? (
                <>
                  <RefreshCw className="w-4 h-4 animate-spin text-black" />
                  <span>Processing Mock Checkout...</span>
                </>
              ) : (
                <>
                  <ShieldCheck className="w-4 h-4 fill-black text-black" />
                  <span>Simulate Payment of ₹{currentAmount.toLocaleString()}</span>
                </>
              )}
            </button>
          </form>

          {/* Success Flash Banner */}
          {latestSuccessTxn && (
            <div className="p-4 rounded-2xl bg-emerald-500/15 border border-emerald-500/40 text-emerald-300 space-y-2 font-mono text-xs animate-in fade-in">
              <div className="flex items-center gap-2 font-bold">
                <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                <span>Simulated Payment Verified!</span>
              </div>
              <div className="text-[11px] text-neutral-300">
                Order ID: <strong>{latestSuccessTxn.orderId}</strong> &bull; UTR: {latestSuccessTxn.utrNumber}
              </div>
              <button
                type="button"
                onClick={() => setActiveReceipt(latestSuccessTxn)}
                className="text-[10px] text-cyan-300 hover:text-white underline font-bold cursor-pointer"
              >
                View Mock Receipt &rarr;
              </button>
            </div>
          )}
        </div>

        {/* Right: Mock Transactions Ledger (7 Cols) */}
        <div className="lg:col-span-7 p-6 rounded-3xl bg-[#080d1c] border border-white/15 space-y-4">
          <div className="flex items-center justify-between border-b border-white/10 pb-3">
            <div className="flex items-center gap-2">
              <FileText className="w-4 h-4 text-emerald-400" />
              <h2 className="text-base font-bold text-white font-display">
                Mock Transactions Ledger ({transactions.length})
              </h2>
            </div>
            <span className="text-xs font-mono text-neutral-400">Sandbox Database</span>
          </div>

          <div className="space-y-2.5 max-h-[500px] overflow-y-auto pr-1">
            {transactions.map((txn) => {
              const isSuccess = txn.status === 'SUCCESS';
              const isRefunded = txn.status === 'REFUNDED';
              const isPending = txn.status === 'PENDING';

              return (
                <div
                  key={txn.id}
                  onClick={() => setActiveReceipt(txn)}
                  className="p-3.5 rounded-2xl bg-white/[0.03] hover:bg-white/[0.06] border border-white/10 transition cursor-pointer flex items-center justify-between gap-3 text-xs font-sans group"
                >
                  <div className="space-y-0.5 min-w-0">
                    <div className="flex items-center gap-2 font-mono text-[10px]">
                      <span className="font-bold text-cyan-400">{txn.orderId}</span>
                      <span className="text-neutral-500">&bull;</span>
                      <span className="text-neutral-400">{txn.timestamp}</span>
                    </div>
                    <div className="font-bold text-white group-hover:text-cyan-300 transition truncate">
                      {txn.delegateName} ({txn.committee})
                    </div>
                    <div className="text-[10px] font-mono text-neutral-500">
                      Mode: {txn.paymentMode.replace('_', ' ')} &bull; UTR: {txn.utrNumber}
                    </div>
                  </div>

                  <div className="text-right shrink-0 font-mono">
                    <div className="text-sm font-bold text-white">₹{txn.amount.toLocaleString()}</div>
                    <span
                      className={`px-2 py-0.5 rounded uppercase font-bold text-[9px] inline-block mt-0.5 ${
                        isSuccess
                          ? 'bg-emerald-500/20 text-emerald-300'
                          : isRefunded
                          ? 'bg-purple-500/20 text-purple-300'
                          : isPending
                          ? 'bg-amber-500/20 text-amber-300'
                          : 'bg-rose-500/20 text-rose-300'
                      }`}
                    >
                      {txn.status}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* ── 3. MOCK INVOICE / RECEIPT MODAL ── */}
      {activeReceipt && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
          <div className="w-full max-w-lg bg-[#0a0f1d] border border-emerald-500/40 rounded-3xl p-6 shadow-2xl space-y-5 text-left font-sans">
            {/* Modal Header */}
            <div className="flex items-center justify-between border-b border-white/10 pb-4">
              <div className="flex items-center gap-2 text-emerald-400 font-bold text-sm font-mono">
                <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                <span>MOCK PAYMENT INVOICE (DEMO ONLY)</span>
              </div>
              <button
                type="button"
                onClick={() => setActiveReceipt(null)}
                className="text-neutral-400 hover:text-white font-mono text-xs cursor-pointer"
              >
                ✕ Close
              </button>
            </div>

            {/* Receipt Body */}
            <div className="space-y-3 font-mono text-xs">
              <div className="p-4 rounded-2xl bg-black/60 border border-white/10 space-y-2">
                <div className="flex justify-between text-neutral-400">
                  <span>Order Reference:</span>
                  <span className="text-white font-bold">{activeReceipt.orderId}</span>
                </div>
                <div className="flex justify-between text-neutral-400">
                  <span>Bank UTR Number:</span>
                  <span className="text-cyan-300 font-bold">{activeReceipt.utrNumber}</span>
                </div>
                <div className="flex justify-between text-neutral-400">
                  <span>Registered Delegate:</span>
                  <span className="text-white">{activeReceipt.delegateName}</span>
                </div>
                <div className="flex justify-between text-neutral-400">
                  <span>Allotted Committee:</span>
                  <span className="text-white">{activeReceipt.committee}</span>
                </div>
                <div className="flex justify-between text-neutral-400">
                  <span>Payment Gateway:</span>
                  <span className="text-emerald-300 font-bold">Cashfree Payments (Sandbox Simulator)</span>
                </div>
                <div className="pt-2 border-t border-white/10 flex justify-between text-sm">
                  <span className="font-bold text-white">Amount Settled:</span>
                  <span className="font-black text-emerald-400">₹{activeReceipt.amount.toLocaleString()}</span>
                </div>
              </div>

              <div className="p-3 rounded-xl bg-amber-500/10 border border-amber-500/20 text-amber-300 text-[10px]">
                NOTICE: This receipt was produced inside the ZENVITRA Test Node for functional testing. It holds no monetary value and does not represent a commercial transaction.
              </div>
            </div>

            <div className="flex items-center justify-end gap-3 pt-2">
              <button
                type="button"
                onClick={() => setActiveReceipt(null)}
                className="px-5 py-2.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-black font-display font-bold text-xs uppercase tracking-wider transition cursor-pointer"
              >
                Close Receipt
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default function TestPaymentsPage() {
  return (
    <TestNodeProvider>
      <TestNodeShell>
        <TestPaymentsContent />
      </TestNodeShell>
    </TestNodeProvider>
  );
}
