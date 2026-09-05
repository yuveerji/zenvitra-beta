'use client';

import React, { useState, useEffect, useMemo } from 'react';
import Link from 'next/link';
import {
  CreditCard,
  ShieldCheck,
  Search,
  CheckCircle2,
  AlertCircle,
  Clock,
  Printer,
  Download,
  Plus,
  ArrowUpRight,
  TrendingUp,
  Building2,
  Calendar,
  Lock,
  Sparkles,
  Receipt,
  FileText,
  DollarSign,
  ChevronRight,
  Filter,
  Eye,
  Send,
  RotateCcw,
  Layers,
  HelpCircle,
  ExternalLink,
  X
} from 'lucide-react';
import { Navbar } from '@/components/layout/Navbar';
import { Footer } from '@/components/layout/Footer';
import {
  INITIAL_TRANSACTIONS,
  INITIAL_INVOICES,
  INITIAL_SUBSCRIPTIONS,
  INITIAL_BALANCE,
  INITIAL_PAYOUTS,
  LS_ZEN_TXNS,
  LS_ZEN_INVOICES,
  LS_ZEN_PAYOUTS
} from '@/lib/paymentsData';
import {
  PaymentTransaction,
  PaymentInvoice,
  PaymentSubscription,
  PayoutRecord,
  AccountBalance
} from '@/types/payments';
import { ZenCheckoutModal } from './ZenCheckoutModal';
import { useAuth } from '@/context/AuthContext';
import { useZenPulse } from '@/context/ZenPulsePlatformContext';
import { 
  ZENMUN_2026_MASTER, 
  checkRevenueAccess 
} from '@/lib/conferenceData';

type HubAudience = 'CONSUMER' | 'PROFESSIONAL' | 'ORGANIZER';

export function PaymentsHubClient() {
  const { user, profile } = useAuth();
  const { currentUserUsername } = useZenPulse();

  const activeUser = {
    username: currentUserUsername || profile?.username || user?.user_metadata?.username,
    email: user?.email || profile?.email,
    role: profile?.role,
  };

  const revenueAccess = checkRevenueAccess(activeUser, ZENMUN_2026_MASTER);

  const [audience, setAudience] = useState<HubAudience>('CONSUMER');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedProductFilter, setSelectedProductFilter] = useState<string>('ALL');

  // Transactions State
  const [transactions, setTransactions] = useState<PaymentTransaction[]>(() => {
    if (typeof window === 'undefined') return INITIAL_TRANSACTIONS;
    try {
      const stored = localStorage.getItem(LS_ZEN_TXNS);
      return stored ? JSON.parse(stored) : INITIAL_TRANSACTIONS;
    } catch {
      return INITIAL_TRANSACTIONS;
    }
  });

  // Invoices State
  const [invoices, setInvoices] = useState<PaymentInvoice[]>(() => {
    if (typeof window === 'undefined') return INITIAL_INVOICES;
    try {
      const stored = localStorage.getItem(LS_ZEN_INVOICES);
      return stored ? JSON.parse(stored) : INITIAL_INVOICES;
    } catch {
      return INITIAL_INVOICES;
    }
  });

  // Balance & Payouts State
  const [balance, setBalance] = useState<AccountBalance>(INITIAL_BALANCE);
  const [payouts, setPayouts] = useState<PayoutRecord[]>(INITIAL_PAYOUTS);

  // Modals
  const [isCheckoutOpen, setIsCheckoutOpen] = useState(false);
  const [activeReceiptTxn, setActiveReceiptTxn] = useState<PaymentTransaction | null>(null);
  const [isNewInvoiceOpen, setIsNewInvoiceOpen] = useState(false);
  const [isPayoutModalOpen, setIsPayoutModalOpen] = useState(false);
  const [payoutAmountInput, setPayoutAmountInput] = useState('25000');

  // New Invoice Fields
  const [invClientName, setInvClientName] = useState('');
  const [invClientEmail, setInvClientEmail] = useState('');
  const [invItemDesc, setInvItemDesc] = useState('');
  const [invItemAmount, setInvItemAmount] = useState('5000');

  // Filtered transactions
  const filteredTxns = useMemo(() => {
    return transactions.filter((t) => {
      const matchesSearch =
        t.purpose.toLowerCase().includes(searchQuery.toLowerCase()) ||
        t.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
        t.payerName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (t.receiptId && t.receiptId.toLowerCase().includes(searchQuery.toLowerCase()));

      const matchesProduct =
        selectedProductFilter === 'ALL' || t.product === selectedProductFilter;

      return matchesSearch && matchesProduct;
    });
  }, [transactions, searchQuery, selectedProductFilter]);

  const handleCreateInvoice = (e: React.FormEvent) => {
    e.preventDefault();
    const amt = Number(invItemAmount) || 0;
    const tax = Math.round(amt * 0.18);
    const newInv: PaymentInvoice = {
      id: `INV-2026-00${Math.floor(100 + Math.random() * 900)}`,
      billToName: invClientName || 'Client Organization',
      billToEmail: invClientEmail || 'billing@client.org',
      invoiceDate: new Date().toISOString().split('T')[0],
      dueDate: new Date(Date.now() + 14 * 86400000).toISOString().split('T')[0],
      items: [
        {
          id: '1',
          description: invItemDesc || 'Professional Advisory & Consultation Services',
          quantity: 1,
          unitPrice: amt,
          amount: amt
        }
      ],
      subtotal: amt,
      taxAmount: tax,
      totalAmount: amt + tax,
      status: 'SENT',
      paymentLinkUrl: `/payments?pay=INV-${Date.now()}`
    };

    const nextInvoices = [newInv, ...invoices];
    setInvoices(nextInvoices);
    try {
      localStorage.setItem(LS_ZEN_INVOICES, JSON.stringify(nextInvoices));
    } catch {}

    setIsNewInvoiceOpen(false);
    setInvClientName('');
    setInvClientEmail('');
    setInvItemDesc('');
  };

  const handleRequestPayout = () => {
    const amt = Number(payoutAmountInput) || 0;
    if (amt <= 0 || amt > balance.available) return;

    const newPO: PayoutRecord = {
      id: `PO-2026-00${Math.floor(100 + Math.random() * 900)}`,
      amount: amt,
      currency: 'INR',
      bankAccountMasked: balance.bankAccountMasked,
      status: 'PROCESSING',
      requestedAt: new Date().toISOString()
    };

    setBalance({
      ...balance,
      available: balance.available - amt,
      pending: balance.pending + amt
    });
    setPayouts([newPO, ...payouts]);
    setIsPayoutModalOpen(false);
  };

  return (
    <div className="min-h-screen bg-[#030407] text-neutral-300 flex flex-col justify-between font-sans selection:bg-cyan-500/30 pt-20 sm:pt-24">
      <Navbar />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 w-full space-y-10 text-left">
        {/* Header Ribbon */}
        <div className="space-y-4 border-b border-white/10 pb-8">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div className="space-y-1">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-500/10 border border-cyan-500/30 text-cyan-400 font-mono text-[10px] uppercase font-bold tracking-wider">
                <ShieldCheck className="w-3.5 h-3.5" />
                <span>ZEN.PAYMENTS &bull; UNIFIED FINANCIAL ORCHESTRATION</span>
              </div>
              <h1 className="text-3xl sm:text-5xl font-black font-display text-white tracking-tight leading-tight">
                PAY. COLLECT. MANAGE. GROW.
              </h1>
            </div>

            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => setIsCheckoutOpen(true)}
                className="px-5 py-2.5 rounded-2xl bg-white text-black font-display font-bold text-xs uppercase tracking-wider hover:bg-neutral-200 transition shadow-[0_0_25px_rgba(255,255,255,0.2)] flex items-center gap-2 cursor-pointer"
              >
                <Sparkles className="w-4 h-4 text-black" />
                <span>Test ZEN.CHECKOUT</span>
              </button>
            </div>
          </div>

          <p className="text-sm text-neutral-400 max-w-3xl leading-relaxed font-sans">
            The sovereign financial layer for <strong className="text-white">ZEN.EVENTS, ZEN.MUN, subscriptions, B2B invoices, and creator payouts</strong>. Incorporating verifiable PCI-DSS tokenization, 0.5% + ₹19 statutory gateway tax, and student GST exemptions.
          </p>

          {/* Audience Mode Switcher */}
          <div className="flex items-center p-1 bg-white/[0.03] border border-white/10 rounded-2xl max-w-lg font-mono text-xs">
            {[
              { id: 'CONSUMER', label: 'My Payments (Citizen)' },
              { id: 'PROFESSIONAL', label: 'Professional Orgs (Invoices)' },
              { id: 'ORGANIZER', label: revenueAccess.allowed ? 'Event Revenue & Payouts' : 'Event Revenue 🔒' },
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setAudience(tab.id as HubAudience)}
                className={`flex-1 py-2 px-3 rounded-xl transition cursor-pointer text-center truncate ${
                  audience === tab.id
                    ? 'bg-cyan-500/20 text-cyan-300 font-bold border border-cyan-500/40 shadow-sm'
                    : 'text-neutral-400 hover:text-white'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>
        </div>

        {/* ─── AUDIENCE 1: CONSUMER VIEW (MY PAYMENTS & SUBSCRIPTIONS) ─── */}
        {audience === 'CONSUMER' && (
          <div className="space-y-8">
            {/* Quick Metrics */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div className="p-5 rounded-3xl bg-white/[0.02] border border-white/10 space-y-1">
                <span className="text-[10px] font-mono text-neutral-400 uppercase">Total Settled Payments</span>
                <h3 className="text-2xl font-bold font-mono text-white">₹548</h3>
                <span className="text-[11px] text-emerald-400 font-mono">2 Active Products</span>
              </div>
              <div className="p-5 rounded-3xl bg-white/[0.02] border border-white/10 space-y-1">
                <span className="text-[10px] font-mono text-neutral-400 uppercase">Active Subscriptions</span>
                <h3 className="text-2xl font-bold font-mono text-cyan-300">ZEN PRO</h3>
                <span className="text-[11px] text-neutral-400 font-mono">Renews Oct 1, 2026</span>
              </div>
              <div className="p-5 rounded-3xl bg-white/[0.02] border border-white/10 space-y-1">
                <span className="text-[10px] font-mono text-neutral-400 uppercase">Refunds Processed</span>
                <h3 className="text-2xl font-bold font-mono text-neutral-300">₹499</h3>
                <span className="text-[11px] text-neutral-400 font-mono">1 Completed Refund</span>
              </div>
            </div>

            {/* Active Subscription Details Card */}
            <div className="p-6 rounded-3xl bg-gradient-to-r from-purple-950/20 via-black to-black border border-purple-500/30 flex flex-wrap items-center justify-between gap-4">
              <div className="space-y-1">
                <span className="text-[10px] font-mono text-purple-400 uppercase tracking-widest font-bold">
                  ACTIVE RECURRING BILLING &bull; ZEN.SUBSCRIPTIONS
                </span>
                <h4 className="text-lg font-bold text-white">ZEN PRO Sovereign Membership</h4>
                <p className="text-xs text-neutral-400 font-mono">₹249/month &bull; Billed via Mastercard •••• 8821 &bull; Status: ACTIVE</p>
              </div>
              <div className="flex items-center gap-2">
                <Link
                  href="/pricing"
                  className="px-4 py-2 rounded-xl bg-purple-500/20 hover:bg-purple-500/30 border border-purple-500/40 text-purple-300 text-xs font-mono transition"
                >
                  Manage Subscription
                </Link>
              </div>
            </div>

            {/* Transactions Explorer */}
            <div className="space-y-4">
              <div className="flex flex-col sm:flex-row items-center justify-between gap-3">
                <h3 className="text-lg font-bold font-display text-white">Transaction History</h3>
                <div className="flex items-center gap-2 w-full sm:w-auto">
                  <div className="relative flex-1 sm:w-64">
                    <Search className="w-3.5 h-3.5 text-neutral-500 absolute left-3 top-1/2 -translate-y-1/2" />
                    <input
                      type="text"
                      placeholder="Search transactions..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="w-full pl-9 pr-3 py-1.5 rounded-xl bg-black border border-white/15 text-xs text-white placeholder-neutral-500 font-mono focus:outline-none focus:border-cyan-400"
                    />
                  </div>
                  <select
                    value={selectedProductFilter}
                    onChange={(e) => setSelectedProductFilter(e.target.value)}
                    className="px-3 py-1.5 rounded-xl bg-black border border-white/15 text-xs font-mono text-neutral-300 cursor-pointer"
                  >
                    <option value="ALL">All Products</option>
                    <option value="ZEN.MUN">ZEN.MUN</option>
                    <option value="ZEN.EVENTS">ZEN.EVENTS</option>
                    <option value="ZEN_PRO">ZEN PRO</option>
                  </select>
                </div>
              </div>

              {/* Transactions Table */}
              <div className="rounded-3xl bg-black/40 border border-white/10 overflow-hidden">
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs font-mono">
                    <thead className="bg-white/[0.02] border-b border-white/10 text-neutral-400 uppercase text-[10px]">
                      <tr>
                        <th className="p-4">Transaction ID</th>
                        <th className="p-4">Purpose / Product</th>
                        <th className="p-4">Amount</th>
                        <th className="p-4">Payment Method</th>
                        <th className="p-4">Status</th>
                        <th className="p-4 text-right">Receipt</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-white/5">
                      {filteredTxns.map((t) => (
                        <tr key={t.id} className="hover:bg-white/[0.02] transition">
                          <td className="p-4 font-bold text-white">{t.id}</td>
                          <td className="p-4 font-sans">
                            <span className="font-bold text-neutral-200 block text-xs">{t.purpose}</span>
                            <span className="text-[11px] text-neutral-400 font-mono">{t.product} &bull; {t.merchantName}</span>
                          </td>
                          <td className="p-4 font-bold text-white">₹{t.taxBreakdown.totalPayable}</td>
                          <td className="p-4 text-neutral-400">{t.paymentDetailsMasked}</td>
                          <td className="p-4">
                            <span
                              className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold ${
                                t.status === 'SUCCESS' || t.status === 'SETTLED'
                                  ? 'bg-emerald-500/15 text-emerald-400 border border-emerald-500/30'
                                  : t.status === 'REFUNDED'
                                  ? 'bg-amber-500/15 text-amber-300 border border-amber-500/30'
                                  : 'bg-rose-500/15 text-rose-400 border border-rose-500/30'
                              }`}
                            >
                              {t.status}
                            </span>
                          </td>
                          <td className="p-4 text-right">
                            <button
                              type="button"
                              onClick={() => setActiveReceiptTxn(t)}
                              className="px-3 py-1 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-neutral-200 hover:text-white transition cursor-pointer text-[11px]"
                            >
                              Receipt
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* ─── AUDIENCE 2: PROFESSIONAL ORG (INVOICES & B2B BILLING) ─── */}
        {audience === 'PROFESSIONAL' && (
          <div className="space-y-8">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <div>
                <h3 className="text-xl font-bold font-display text-white">ZEN.INVOICES &amp; Institutional Billing</h3>
                <p className="text-xs text-neutral-400 font-mono">Create, dispatch, and track client consulting &amp; sponsorship invoices</p>
              </div>
              <button
                type="button"
                onClick={() => setIsNewInvoiceOpen(true)}
                className="px-5 py-2.5 rounded-2xl bg-purple-600 hover:bg-purple-500 text-white font-mono text-xs font-bold transition flex items-center gap-2 cursor-pointer shadow-[0_0_20px_rgba(168,85,247,0.3)]"
              >
                <Plus className="w-4 h-4" />
                <span>Create New Invoice</span>
              </button>
            </div>

            {/* Invoices List */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {invoices.map((inv) => (
                <div key={inv.id} className="p-6 rounded-3xl bg-black/50 border border-white/10 space-y-4 text-left">
                  <div className="flex items-center justify-between border-b border-white/10 pb-3">
                    <div>
                      <span className="text-[10px] font-mono text-neutral-400 uppercase block">INVOICE #{inv.id}</span>
                      <h4 className="font-bold text-white text-base mt-0.5">{inv.billToName}</h4>
                      {inv.billToOrg && <span className="text-xs text-neutral-400 block font-mono">{inv.billToOrg}</span>}
                    </div>
                    <span className="px-2.5 py-1 rounded-full text-[10px] font-mono font-bold bg-cyan-500/15 text-cyan-300 border border-cyan-500/30">
                      {inv.status}
                    </span>
                  </div>

                  <div className="space-y-2 text-xs font-mono text-neutral-300">
                    {inv.items.map((item) => (
                      <div key={item.id} className="flex justify-between py-1 border-b border-white/5">
                        <span className="text-neutral-400">{item.description}</span>
                        <span className="text-white">₹{item.amount.toLocaleString()}</span>
                      </div>
                    ))}
                    <div className="flex justify-between text-neutral-400 text-[11px] pt-1">
                      <span>GST (18%)</span>
                      <span>₹{inv.taxAmount.toLocaleString()}</span>
                    </div>
                    <div className="flex justify-between text-sm font-bold text-white pt-1 border-t border-white/10">
                      <span>Total Amount</span>
                      <span className="text-cyan-300">₹{inv.totalAmount.toLocaleString()}</span>
                    </div>
                  </div>

                  <div className="pt-2 flex items-center justify-between text-xs font-mono">
                    <span className="text-neutral-500 text-[11px]">Due: {inv.dueDate}</span>
                    <button
                      type="button"
                      onClick={() => alert(`Payment link copied: https://zenvitra.xyz${inv.paymentLinkUrl}`)}
                      className="px-3 py-1.5 rounded-xl bg-white/10 hover:bg-white/15 text-white transition cursor-pointer"
                    >
                      Copy Payment Link
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ─── AUDIENCE 3: ORGANIZER REVENUE & PAYOUTS ─── */}
        {audience === 'ORGANIZER' && (
          <div className="space-y-8">
            {!revenueAccess.allowed ? (
              <div className="p-10 sm:p-16 rounded-3xl bg-black/60 border border-white/10 text-center space-y-4 max-w-xl mx-auto shadow-2xl">
                <div className="w-16 h-16 rounded-2xl bg-white/[0.03] border border-white/10 mx-auto flex items-center justify-center text-neutral-400 shadow-inner">
                  <Lock className="w-8 h-8 text-neutral-400" />
                </div>
                <div className="space-y-2">
                  <h3 className="text-xl font-bold font-display text-white">Confidential Organizer Revenue Ledger</h3>
                  <p className="text-xs text-neutral-400 leading-relaxed font-sans">
                    Under ZENVITRA Sovereign Governance, event ticket sales, bank settlement ledgers, and creator payouts are confidential. They can only be accessed by the <strong>MUN Creator</strong>, the <strong>ZENVITRA Payments &amp; Finance Team</strong>, and <strong>individuals explicitly delegated by the Creator</strong>.
                  </p>
                </div>
                <div className="pt-2">
                  <span className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/[0.04] border border-white/10 text-[11px] font-mono">
                    <span>Logged in as @{activeUser.username || 'guest'}</span>
                    <span className="text-rose-400 font-bold">• Access Denied</span>
                  </span>
                </div>
                <div className="pt-4 flex items-center justify-center gap-2">
                  <button
                    type="button"
                    onClick={() => setAudience('CONSUMER')}
                    className="px-5 py-2.5 rounded-xl bg-white/10 hover:bg-white/15 text-white font-mono text-xs transition cursor-pointer"
                  >
                    Return to My Payments
                  </button>
                </div>
              </div>
            ) : (
              <>
                {/* Account Balance Card */}
                <div className="p-6 rounded-3xl bg-gradient-to-br from-[#0c0e18] to-black border border-cyan-500/25 space-y-6">
              <div className="flex flex-wrap items-center justify-between gap-3 border-b border-white/10 pb-4">
                <div>
                  <span className="text-[10px] font-mono text-cyan-400 uppercase font-bold tracking-wider">
                    ORGANIZER SETTLEMENT LEDGER &bull; ZEN.BALANCE
                  </span>
                  <h3 className="text-2xl font-bold font-mono text-white mt-1">₹{balance.available.toLocaleString()}</h3>
                  <span className="text-xs text-neutral-400 font-mono">Available For Immediate Settlement</span>
                </div>
                <button
                  type="button"
                  onClick={() => setIsPayoutModalOpen(true)}
                  className="px-6 py-3 rounded-2xl bg-cyan-400 hover:bg-cyan-300 text-black font-display font-bold text-xs uppercase tracking-wider transition shadow-[0_0_20px_rgba(34,211,238,0.3)] cursor-pointer"
                >
                  Request Payout
                </button>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs font-mono">
                <div className="p-4 rounded-2xl bg-black/60 border border-white/10 space-y-1">
                  <span className="text-neutral-400 text-[10px] uppercase block">Pending Settlement</span>
                  <strong className="text-lg text-neutral-200">₹{balance.pending.toLocaleString()}</strong>
                  <p className="text-[10px] text-neutral-500">T+2 clearing window</p>
                </div>
                <div className="p-4 rounded-2xl bg-black/60 border border-white/10 space-y-1">
                  <span className="text-neutral-400 text-[10px] uppercase block">On Hold (Dispute Reserve)</span>
                  <strong className="text-lg text-neutral-200">₹{balance.onHold.toLocaleString()}</strong>
                  <p className="text-[10px] text-neutral-500">Standard security reserve</p>
                </div>
                <div className="p-4 rounded-2xl bg-black/60 border border-white/10 space-y-1">
                  <span className="text-neutral-400 text-[10px] uppercase block">Payout Destination</span>
                  <strong className="text-sm text-neutral-200 block truncate">{balance.bankAccountMasked}</strong>
                  <p className="text-[10px] text-emerald-400">Verified Direct Deposit</p>
                </div>
              </div>
            </div>

            {/* Event Revenue Telemetry */}
            <div className="p-6 rounded-3xl bg-black/50 border border-white/10 space-y-4">
              <div className="flex items-center justify-between border-b border-white/10 pb-3">
                <div className="space-y-0.5">
                  <span className="text-[10px] font-mono text-neutral-400 uppercase">ACTIVE EVENT REVENUE</span>
                  <h4 className="text-lg font-bold text-white">ZENMUN 2026 — Sovereign Youth Diplomatic Assembly</h4>
                </div>
                <span className="px-3 py-1 rounded-full text-xs font-mono bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 font-bold">
                  817 Paid Registrations
                </span>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-xs font-mono">
                <div>
                  <span className="text-neutral-400 text-[10px] block uppercase">Gross Revenue:</span>
                  <strong className="text-base text-white">₹2,43,283</strong>
                </div>
                <div>
                  <span className="text-neutral-400 text-[10px] block uppercase">Refunds (Cancelled):</span>
                  <strong className="text-base text-amber-400">₹7,980</strong>
                </div>
                <div>
                  <span className="text-neutral-400 text-[10px] block uppercase">Platform Fees:</span>
                  <strong className="text-base text-neutral-300">₹6,082</strong>
                </div>
                <div>
                  <span className="text-neutral-400 text-[10px] block uppercase">Net Payable:</span>
                  <strong className="text-base text-cyan-300">₹2,29,221</strong>
                </div>
              </div>
            </div>

            {/* Payout History */}
            <div className="space-y-3">
              <h4 className="text-base font-bold font-display text-white">Payout History</h4>
              <div className="rounded-3xl bg-black/40 border border-white/10 overflow-hidden">
                <table className="w-full text-left text-xs font-mono">
                  <thead className="bg-white/[0.02] border-b border-white/10 text-neutral-400 uppercase text-[10px]">
                    <tr>
                      <th className="p-4">Payout ID</th>
                      <th className="p-4">Amount</th>
                      <th className="p-4">Destination</th>
                      <th className="p-4">Status</th>
                      <th className="p-4">Date</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-white/5">
                    {payouts.map((p) => (
                      <tr key={p.id}>
                        <td className="p-4 font-bold text-white">{p.id}</td>
                        <td className="p-4 font-bold text-cyan-300">₹{p.amount.toLocaleString()}</td>
                        <td className="p-4 text-neutral-400">{p.bankAccountMasked}</td>
                        <td className="p-4">
                          <span
                            className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold ${
                              p.status === 'COMPLETED'
                                ? 'bg-emerald-500/15 text-emerald-400 border border-emerald-500/30'
                                : 'bg-cyan-500/15 text-cyan-300 border border-cyan-500/30'
                            }`}
                          >
                            {p.status}
                          </span>
                        </td>
                        <td className="p-4 text-neutral-500">{new Date(p.requestedAt).toLocaleDateString()}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </>
        )}
      </div>
    )}

        {/* ─── MODAL 1: CHECKOUT MODAL ─── */}
        <ZenCheckoutModal
          isOpen={isCheckoutOpen}
          onClose={() => setIsCheckoutOpen(false)}
          product="ZEN.MUN"
          title="ZENMUN 2026 - Sovereign Delegate Pass"
          baseAmount={299}
          currency="INR"
          merchantName="ZENMUN Secretariat"
          onSuccess={(txn) => {
            setTransactions([txn, ...transactions]);
          }}
        />

        {/* ─── MODAL 2: RECEIPT MODAL ─── */}
        {activeReceiptTxn && (
          <div className="fixed inset-0 z-[130] flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
            <div className="w-full max-w-lg rounded-3xl bg-[#090b10] border border-cyan-500/30 p-6 sm:p-8 text-white space-y-5 font-mono text-xs text-left shadow-2xl">
              <div className="flex items-center justify-between border-b border-white/10 pb-3">
                <span className="text-[10px] text-cyan-400 uppercase font-bold">ZENVITRA PAYMENT RECEIPT</span>
                <button onClick={() => setActiveReceiptTxn(null)} className="text-neutral-400 hover:text-white cursor-pointer">
                  Close
                </button>
              </div>
              <div className="space-y-2 font-sans">
                <h3 className="text-2xl font-bold font-mono text-white">₹{activeReceiptTxn.taxBreakdown.totalPayable}</h3>
                <p className="text-xs text-neutral-300">{activeReceiptTxn.purpose}</p>
              </div>
              <div className="p-4 rounded-2xl bg-black border border-white/10 space-y-2 text-[11px] text-neutral-400">
                <div className="flex justify-between"><span>Receipt No:</span><strong className="text-white">{activeReceiptTxn.receiptId}</strong></div>
                <div className="flex justify-between"><span>Transaction ID:</span><strong className="text-white">{activeReceiptTxn.id}</strong></div>
                <div className="flex justify-between"><span>Payer:</span><span className="text-white">{activeReceiptTxn.payerName} ({activeReceiptTxn.payerEmail})</span></div>
                <div className="flex justify-between"><span>Merchant:</span><span className="text-white">{activeReceiptTxn.merchantName}</span></div>
                <div className="flex justify-between"><span>Method:</span><span className="text-white">{activeReceiptTxn.paymentDetailsMasked}</span></div>
                <div className="flex justify-between"><span>Status:</span><span className="text-emerald-400 font-bold">{activeReceiptTxn.status}</span></div>
              </div>
              <div className="flex gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => window.print()}
                  className="flex-1 py-2.5 rounded-xl bg-white text-black font-display font-bold text-xs uppercase tracking-wider text-center cursor-pointer"
                >
                  Print Receipt
                </button>
              </div>
            </div>
          </div>
        )}

        {/* ─── MODAL 3: CREATE INVOICE MODAL ─── */}
        {isNewInvoiceOpen && (
          <div className="fixed inset-0 z-[130] flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
            <form onSubmit={handleCreateInvoice} className="w-full max-w-md rounded-3xl bg-[#090b10] border border-purple-500/30 p-6 sm:p-8 text-white space-y-4 font-sans text-xs text-left shadow-2xl">
              <div className="flex items-center justify-between border-b border-white/10 pb-3">
                <span className="text-xs font-mono font-bold text-purple-400 uppercase">NEW B2B INVOICE</span>
                <button type="button" onClick={() => setIsNewInvoiceOpen(false)} className="text-neutral-400 hover:text-white cursor-pointer">
                  <X className="w-4 h-4" />
                </button>
              </div>
              <div className="space-y-1.5">
                <label className="text-neutral-400 block text-[11px]">Bill To (Client / Org Name)</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Model UN Secretariat"
                  value={invClientName}
                  onChange={(e) => setInvClientName(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl bg-black border border-white/15 text-white"
                />
              </div>
              <div className="space-y-1.5">
                <label className="text-neutral-400 block text-[11px]">Client Email</label>
                <input
                  type="email"
                  required
                  placeholder="billing@org.com"
                  value={invClientEmail}
                  onChange={(e) => setInvClientEmail(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl bg-black border border-white/15 text-white"
                />
              </div>
              <div className="space-y-1.5">
                <label className="text-neutral-400 block text-[11px]">Item Description</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Dais Consultation & Rules of Procedure Setup"
                  value={invItemDesc}
                  onChange={(e) => setInvItemDesc(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl bg-black border border-white/15 text-white"
                />
              </div>
              <div className="space-y-1.5">
                <label className="text-neutral-400 block text-[11px]">Amount (₹)</label>
                <input
                  type="number"
                  required
                  value={invItemAmount}
                  onChange={(e) => setInvItemAmount(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl bg-black border border-white/15 text-white font-mono"
                />
              </div>
              <button
                type="submit"
                className="w-full py-3 rounded-xl bg-purple-600 hover:bg-purple-500 text-white font-bold uppercase font-display text-xs cursor-pointer mt-2"
              >
                Create &amp; Dispatch Invoice
              </button>
            </form>
          </div>
        )}

        {/* ─── MODAL 4: REQUEST PAYOUT MODAL ─── */}
        {isPayoutModalOpen && (
          <div className="fixed inset-0 z-[130] flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
            <div className="w-full max-w-sm rounded-3xl bg-[#090b10] border border-cyan-500/30 p-6 text-white space-y-4 font-sans text-xs text-left shadow-2xl">
              <div className="flex items-center justify-between border-b border-white/10 pb-3">
                <span className="text-xs font-mono font-bold text-cyan-400 uppercase">REQUEST REVENUE SETTLEMENT</span>
                <button onClick={() => setIsPayoutModalOpen(false)} className="text-neutral-400 hover:text-white cursor-pointer">
                  <X className="w-4 h-4" />
                </button>
              </div>
              <p className="text-neutral-400 text-xs">
                Funds will be deposited into your verified account: <strong className="text-white block font-mono">{balance.bankAccountMasked}</strong>
              </p>
              <div className="space-y-1.5">
                <label className="text-neutral-400 block text-[11px]">Payout Amount (₹)</label>
                <input
                  type="number"
                  max={balance.available}
                  value={payoutAmountInput}
                  onChange={(e) => setPayoutAmountInput(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl bg-black border border-white/15 text-white font-mono text-sm"
                />
                <span className="text-[10px] text-neutral-500 font-mono">Max available: ₹{balance.available.toLocaleString()}</span>
              </div>
              <button
                type="button"
                onClick={handleRequestPayout}
                className="w-full py-3 rounded-xl bg-cyan-400 hover:bg-cyan-300 text-black font-bold uppercase font-display text-xs cursor-pointer"
              >
                Confirm Payout Request
              </button>
            </div>
          </div>
        )}
      </main>

      <Footer />
    </div>
  );
}
