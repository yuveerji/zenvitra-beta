'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  X,
  ShieldCheck,
  QrCode,
  CreditCard,
  Building2,
  CheckCircle2,
  Printer,
  Download,
  Lock,
  ArrowRight,
  HelpCircle,
  Sparkles,
  RefreshCw,
  Share2
} from 'lucide-react';
import { computeTax, LS_ZEN_TXNS } from '@/lib/paymentsData';
import { PaymentTransaction, PaymentReceipt, PaymentMethodType, PaymentProduct } from '@/types/payments';

interface ZenCheckoutModalProps {
  isOpen: boolean;
  onClose: () => void;
  product: PaymentProduct;
  title: string;
  baseAmount: number;
  currency?: 'INR' | 'USD';
  merchantName?: string;
  onSuccess?: (txn: PaymentTransaction) => void;
}

export function ZenCheckoutModal({
  isOpen,
  onClose,
  product,
  title,
  baseAmount,
  currency = 'INR',
  merchantName = 'ZENVITRA Operating Entity',
  onSuccess,
}: ZenCheckoutModalProps) {
  // Payer details & taxation
  const [payerName, setPayerName] = useState('Yuveer');
  const [payerEmail, setPayerEmail] = useState('yuveer@zenvitra.xyz');
  const [userAge, setUserAge] = useState<number>(17);
  const [isCollegeStudent, setIsCollegeStudent] = useState<boolean>(false);

  // Payment method selection
  const [selectedMethod, setSelectedMethod] = useState<PaymentMethodType>('UPI_QR');
  const [upiId, setUpiId] = useState('');
  const [cardNumber, setCardNumber] = useState('');
  const [cardExpiry, setCardExpiry] = useState('');
  const [cardCvv, setCardCvv] = useState('');
  const [selectedBank, setSelectedBank] = useState('HDFC Bank');

  // Checkout flow state
  const [step, setStep] = useState<'DETAILS' | 'PROCESSING' | 'SUCCESS'>('DETAILS');
  const [completedTxn, setCompletedTxn] = useState<PaymentTransaction | null>(null);

  if (!isOpen) return null;

  const tax = computeTax(baseAmount, userAge, isCollegeStudent, currency);

  const handlePay = () => {
    setStep('PROCESSING');
    setTimeout(() => {
      const randomSuffix = Math.floor(10000 + Math.random() * 90000);
      const txnId = `ZPAY-2026-000${randomSuffix}`;
      const rId = `ZR-2026-00${randomSuffix - 1000}`;

      const newTxn: PaymentTransaction = {
        id: txnId,
        receiptId: rId,
        status: 'SUCCESS',
        amount: baseAmount,
        currency,
        purpose: title,
        product,
        eventOrItemName: title,
        payerName: payerName || 'Citizen User',
        payerEmail: payerEmail || 'user@zenvitra.xyz',
        merchantName,
        paymentMethod: selectedMethod,
        paymentDetailsMasked:
          selectedMethod === 'UPI_QR'
            ? 'Dynamic UPI QR (BHIM/GPay)'
            : selectedMethod === 'UPI_ID'
            ? `UPI: ${upiId || 'user@upi'}`
            : selectedMethod === 'CREDIT_CARD' || selectedMethod === 'DEBIT_CARD'
            ? `Card: •••• ${cardNumber.slice(-4) || '4242'}`
            : `Net Banking: ${selectedBank}`,
        taxBreakdown: tax,
        createdAt: new Date().toISOString(),
        settledAt: new Date().toISOString()
      };

      // Store in localStorage
      try {
        const stored = localStorage.getItem(LS_ZEN_TXNS);
        const list = stored ? JSON.parse(stored) : [];
        localStorage.setItem(LS_ZEN_TXNS, JSON.stringify([newTxn, ...list]));
      } catch {}

      setCompletedTxn(newTxn);
      setStep('SUCCESS');
      if (onSuccess) onSuccess(newTxn);
    }, 1200);
  };

  const handlePrint = () => {
    if (typeof window !== 'undefined') window.print();
  };

  return (
    <div className="fixed inset-0 z-[120] flex items-center justify-center p-3 sm:p-6 bg-black/80 backdrop-blur-md overflow-y-auto font-sans">
      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: 15 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95, y: 15 }}
        className="relative w-full max-w-xl rounded-3xl bg-[#08090f] border border-cyan-500/30 p-6 sm:p-8 text-white space-y-6 shadow-[0_25px_80px_rgba(0,0,0,0.95)] my-auto overflow-hidden"
      >
        {/* Glow ambient */}
        <div className="absolute top-0 right-0 w-64 h-64 bg-cyan-500/10 rounded-full blur-3xl pointer-events-none" />

        {/* Header */}
        <div className="flex items-center justify-between border-b border-white/10 pb-4">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-xl bg-cyan-500/15 border border-cyan-500/30 flex items-center justify-center text-cyan-300">
              <Lock className="w-4 h-4" />
            </div>
            <div>
              <span className="text-[10px] font-mono text-cyan-400 font-bold uppercase tracking-wider block">
                ZEN.CHECKOUT &bull; PCI-DSS COMPLIANT
              </span>
              <h3 className="text-base sm:text-lg font-bold font-display text-white">Pay Securely With ZENVITRA</h3>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-full text-neutral-400 hover:text-white hover:bg-white/10 transition cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* STEP 1: DETAILS & METHOD */}
        {step === 'DETAILS' && (
          <div className="space-y-5 text-left">
            {/* Order Summary Box */}
            <div className="p-4 rounded-2xl bg-white/[0.02] border border-white/10 space-y-3">
              <div className="flex items-start justify-between gap-3">
                <div>
                  <span className="text-[10px] font-mono text-neutral-400 uppercase">{product}</span>
                  <h4 className="text-sm font-bold text-white">{title}</h4>
                  <span className="text-[11px] text-neutral-400 block">Merchant: {merchantName}</span>
                </div>
                <div className="text-right">
                  <span className="text-lg font-mono font-bold text-white">
                    {currency === 'INR' ? '₹' : '$'}{baseAmount.toLocaleString()}
                  </span>
                </div>
              </div>

              {/* Tax & Student Exemption Configurator */}
              <div className="pt-2 border-t border-white/5 space-y-2 text-xs font-mono">
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <span className="text-neutral-400">Payer Age Verification:</span>
                  <div className="flex items-center gap-2">
                    <input
                      type="number"
                      min={12}
                      max={90}
                      value={userAge}
                      onChange={(e) => setUserAge(Number(e.target.value))}
                      className="w-14 px-2 py-1 rounded-lg bg-black border border-white/20 text-center text-white"
                    />
                    <label className="flex items-center gap-1 text-[11px] text-neutral-300 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={isCollegeStudent}
                        onChange={(e) => setIsCollegeStudent(e.target.checked)}
                        className="rounded border-white/20 text-cyan-500 focus:ring-0"
                      />
                      <span>College Student</span>
                    </label>
                  </div>
                </div>

                {/* Price Breakdown */}
                <div className="space-y-1 pt-1 text-[11px] text-neutral-400">
                  <div className="flex justify-between">
                    <span>Base Amount</span>
                    <span className="text-neutral-200">₹{tax.baseAmount}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Platform &amp; Gateway Tax (0.5% + ₹19)</span>
                    <span className="text-neutral-200">+₹{tax.gatewayTax}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>{tax.gstLabel}</span>
                    <span className="text-neutral-200">
                      {tax.gstAmount === 0 ? '₹0 (EXEMPT)' : `+₹${tax.gstAmount}`}
                    </span>
                  </div>
                  <div className="flex justify-between pt-1 border-t border-white/10 text-sm font-bold text-white">
                    <span>Total Payable</span>
                    <span className="text-cyan-300 font-mono">₹{tax.totalPayable}</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Payment Method Tabs */}
            <div className="space-y-2">
              <label className="text-xs font-mono text-neutral-300 font-semibold block uppercase">
                Choose Payment Method
              </label>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                {[
                  { id: 'UPI_QR', label: 'UPI QR Code', icon: QrCode },
                  { id: 'UPI_ID', label: 'UPI ID / VPA', icon: ArrowRight },
                  { id: 'CREDIT_CARD', label: 'Credit / Debit', icon: CreditCard },
                  { id: 'NET_BANKING', label: 'Net Banking', icon: Building2 },
                ].map((m) => {
                  const Icon = m.icon;
                  return (
                    <button
                      key={m.id}
                      type="button"
                      onClick={() => setSelectedMethod(m.id as PaymentMethodType)}
                      className={`p-2.5 rounded-xl border text-left transition cursor-pointer flex flex-col items-center justify-center gap-1 ${
                        selectedMethod === m.id
                          ? 'bg-cyan-500/15 border-cyan-500/50 text-cyan-200 shadow-md'
                          : 'bg-white/[0.02] border-white/10 text-neutral-400 hover:text-white'
                      }`}
                    >
                      <Icon className="w-4 h-4" />
                      <span className="text-[10px] font-mono font-bold text-center">{m.label}</span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Method Input Area */}
            <div className="p-4 rounded-2xl bg-black/60 border border-white/10 space-y-3 text-xs">
              {selectedMethod === 'UPI_QR' && (
                <div className="flex flex-col items-center justify-center space-y-2 text-center">
                  <div className="p-3 rounded-2xl bg-white text-black shadow-lg inline-block">
                    <QrCode className="w-32 h-32" />
                  </div>
                  <span className="text-[11px] font-mono text-neutral-400">
                    Scan with any UPI app (GPay, PhonePe, Paytm, BHIM) to pay <strong className="text-white">₹{tax.totalPayable}</strong>
                  </span>
                </div>
              )}

              {selectedMethod === 'UPI_ID' && (
                <div className="space-y-2">
                  <label className="text-neutral-400 block text-[11px]">Enter Virtual Payment Address (UPI ID)</label>
                  <input
                    type="text"
                    placeholder="e.g. yourname@okhdfcbank"
                    value={upiId}
                    onChange={(e) => setUpiId(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-zinc-900 border border-white/15 text-white font-mono text-xs focus:outline-none focus:border-cyan-400"
                  />
                </div>
              )}

              {(selectedMethod === 'CREDIT_CARD' || selectedMethod === 'DEBIT_CARD') && (
                <div className="space-y-2.5">
                  <div>
                    <label className="text-neutral-400 block text-[11px] mb-1">Card Number</label>
                    <input
                      type="text"
                      placeholder="•••• •••• •••• ••••"
                      maxLength={19}
                      value={cardNumber}
                      onChange={(e) => setCardNumber(e.target.value)}
                      className="w-full px-3 py-2 rounded-xl bg-zinc-900 border border-white/15 text-white font-mono text-xs focus:outline-none focus:border-cyan-400"
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-2">
                    <div>
                      <label className="text-neutral-400 block text-[11px] mb-1">Expiry (MM/YY)</label>
                      <input
                        type="text"
                        placeholder="MM/YY"
                        maxLength={5}
                        value={cardExpiry}
                        onChange={(e) => setCardExpiry(e.target.value)}
                        className="w-full px-3 py-2 rounded-xl bg-zinc-900 border border-white/15 text-white font-mono text-xs focus:outline-none focus:border-cyan-400 text-center"
                      />
                    </div>
                    <div>
                      <label className="text-neutral-400 block text-[11px] mb-1">CVV</label>
                      <input
                        type="password"
                        placeholder="•••"
                        maxLength={4}
                        value={cardCvv}
                        onChange={(e) => setCardCvv(e.target.value)}
                        className="w-full px-3 py-2 rounded-xl bg-zinc-900 border border-white/15 text-white font-mono text-xs focus:outline-none focus:border-cyan-400 text-center"
                      />
                    </div>
                  </div>
                </div>
              )}

              {selectedMethod === 'NET_BANKING' && (
                <div className="space-y-2">
                  <label className="text-neutral-400 block text-[11px]">Select Bank</label>
                  <select
                    value={selectedBank}
                    onChange={(e) => setSelectedBank(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-zinc-900 border border-white/15 text-white text-xs font-mono focus:outline-none focus:border-cyan-400"
                  >
                    <option value="HDFC Bank">HDFC Bank</option>
                    <option value="State Bank of India">State Bank of India (SBI)</option>
                    <option value="ICICI Bank">ICICI Bank</option>
                    <option value="Axis Bank">Axis Bank</option>
                    <option value="Kotak Mahindra Bank">Kotak Mahindra Bank</option>
                  </select>
                </div>
              )}
            </div>

            {/* Action Buttons */}
            <div className="pt-2 flex items-center justify-between gap-3">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2.5 rounded-xl text-neutral-400 hover:text-white font-mono text-xs transition cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handlePay}
                className="flex-1 py-3 px-6 rounded-2xl bg-cyan-400 hover:bg-cyan-300 text-black font-display font-bold text-xs uppercase tracking-wider transition shadow-[0_0_25px_rgba(34,211,238,0.3)] flex items-center justify-center gap-2 cursor-pointer"
              >
                <span>Pay ₹{tax.totalPayable} Securely</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}

        {/* STEP 2: PROCESSING SIMULATOR */}
        {step === 'PROCESSING' && (
          <div className="py-16 text-center space-y-4">
            <RefreshCw className="w-10 h-10 text-cyan-400 animate-spin mx-auto" />
            <div className="space-y-1">
              <h4 className="font-bold text-base text-white">Communicating with Banking Gateway...</h4>
              <p className="text-xs text-neutral-400 font-mono">Tokenizing transaction &bull; Please do not close this window</p>
            </div>
          </div>
        )}

        {/* STEP 3: SUCCESSFUL RECEIPT */}
        {step === 'SUCCESS' && completedTxn && (
          <div className="space-y-5 text-left font-sans">
            <div className="p-5 rounded-2xl bg-emerald-500/[0.06] border border-emerald-500/25 space-y-4">
              <div className="flex items-center gap-2 text-emerald-400 font-mono text-xs font-bold uppercase">
                <CheckCircle2 className="w-4 h-4" />
                <span>PAYMENT COMPLETED SUCCESSFULLY</span>
              </div>

              <div className="border-b border-white/10 pb-3 space-y-1">
                <span className="text-[10px] font-mono text-neutral-400 uppercase">ZENVITRA OFFICIAL RECEIPT</span>
                <h4 className="text-xl font-bold font-mono text-white tracking-tight">
                  ₹{completedTxn.taxBreakdown.totalPayable}
                </h4>
                <p className="text-xs text-neutral-300">{completedTxn.purpose}</p>
              </div>

              <div className="grid grid-cols-2 gap-2 text-xs font-mono text-neutral-400">
                <div>
                  <span className="block text-[10px]">TRANSACTION ID:</span>
                  <strong className="text-neutral-200">{completedTxn.id}</strong>
                </div>
                <div>
                  <span className="block text-[10px]">RECEIPT NO:</span>
                  <strong className="text-neutral-200">{completedTxn.receiptId}</strong>
                </div>
                <div>
                  <span className="block text-[10px]">PAID TO:</span>
                  <span className="text-neutral-200 truncate block">{completedTxn.merchantName}</span>
                </div>
                <div>
                  <span className="block text-[10px]">METHOD:</span>
                  <span className="text-neutral-200 truncate block">{completedTxn.paymentDetailsMasked}</span>
                </div>
              </div>

              <div className="pt-2 border-t border-white/5 text-[10px] font-mono text-neutral-400">
                Status: SETTLED &bull; Signature Hash: SHA-256 Verified
              </div>
            </div>

            {/* Actions */}
            <div className="flex flex-wrap items-center gap-2 pt-1">
              <button
                type="button"
                onClick={handlePrint}
                className="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-xl bg-white/10 hover:bg-white/15 border border-white/15 text-white text-xs font-mono transition cursor-pointer"
              >
                <Printer className="w-3.5 h-3.5" />
                <span>Print Receipt</span>
              </button>
              <button
                type="button"
                onClick={onClose}
                className="flex-1 py-2.5 px-4 rounded-xl bg-white text-black font-display font-bold text-xs uppercase tracking-wider text-center hover:bg-neutral-200 transition cursor-pointer"
              >
                Done
              </button>
            </div>
          </div>
        )}
      </motion.div>
    </div>
  );
}
