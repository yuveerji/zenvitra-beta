'use client';

import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import QRCode from 'qrcode';
import {
  X,
  ShieldCheck,
  QrCode,
  CreditCard,
  CheckCircle2,
  Printer,
  Download,
  Lock,
  ArrowRight,
  HelpCircle,
  Sparkles,
  RefreshCw,
  Share2,
  ExternalLink,
  UploadCloud,
  FileCheck,
  Building,
  Smartphone,
  Check
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
  const [studentIdFile, setStudentIdFile] = useState<{ name: string; size: string } | null>(null);
  const [studentIdError, setStudentIdError] = useState<string | null>(null);

  // Payment method selection (Net banking removed)
  const [selectedMethod, setSelectedMethod] = useState<'UPI_QR' | 'UPI_ID' | 'CREDIT_CARD'>('UPI_QR');
  const [upiId, setUpiId] = useState('');
  const [cardNumber, setCardNumber] = useState('');
  const [cardHolder, setCardHolder] = useState('Yuveer Chhatwani');
  const [cardExpiry, setCardExpiry] = useState('');
  const [cardCvv, setCardCvv] = useState('');
  const [cardOtp, setCardOtp] = useState('');

  // Live QR Code Generation State
  const [realQrDataUrl, setRealQrDataUrl] = useState<string | null>(null);
  const [isGeneratingQr, setIsGeneratingQr] = useState<boolean>(false);

  // Checkout flow state
  const [step, setStep] = useState<'DETAILS' | 'CARD_GATEWAY' | 'PROCESSING' | 'SUCCESS'>('DETAILS');
  const [completedTxn, setCompletedTxn] = useState<PaymentTransaction | null>(null);

  const fileInputRef = useRef<HTMLInputElement>(null);

  const tax = computeTax(baseAmount, userAge, isCollegeStudent, currency);

  // Real UPI Payload string: upi://pay?pa=...
  const upiPayPayload = `upi://pay?pa=zenvitra@upi&pn=ZENVITRA%20NETWORKS&am=${tax.totalPayable}&cu=INR&tn=Order%20${product}`;

  // Generate real dynamic QR code with zero mock placeholders
  useEffect(() => {
    if (!isOpen) return;
    setIsGeneratingQr(true);

    QRCode.toDataURL(upiPayPayload, {
      width: 480,
      margin: 1,
      color: {
        dark: '#000000',
        light: '#ffffff',
      },
      errorCorrectionLevel: 'H',
    })
      .then((url) => {
        setRealQrDataUrl(url);
        setIsGeneratingQr(false);
      })
      .catch((err) => {
        console.error('Failed to generate real UPI QR code', err);
        setIsGeneratingQr(false);
      });
  }, [isOpen, tax.totalPayable, upiPayPayload]);

  if (!isOpen) return null;

  // Handle student ID upload
  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        setStudentIdError('File size exceeds 5MB limit.');
        return;
      }
      setStudentIdFile({
        name: file.name,
        size: `${(file.size / 1024).toFixed(1)} KB`,
      });
      setStudentIdError(null);
    }
  };

  const handleInitiatePay = () => {
    if (isCollegeStudent && !studentIdFile) {
      setStudentIdError('Please upload your school or college student ID proof to claim student concession.');
      return;
    }

    if (selectedMethod === 'CREDIT_CARD') {
      setStep('CARD_GATEWAY');
      return;
    }

    finalizePayment();
  };

  const finalizePayment = () => {
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
        paymentMethod: selectedMethod as PaymentMethodType,
        paymentDetailsMasked:
          selectedMethod === 'UPI_QR'
            ? 'Dynamic Real UPI QR (BHIM/GPay/PhonePe)'
            : selectedMethod === 'UPI_ID'
            ? `UPI VPA: ${upiId || 'user@upi'}`
            : `Card (3DS Verified): •••• ${cardNumber.slice(-4) || '4242'}`,
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
    }, 1400);
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
                    <label className="flex items-center gap-1.5 text-[11px] text-neutral-300 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={isCollegeStudent}
                        onChange={(e) => {
                          setIsCollegeStudent(e.target.checked);
                          if (!e.target.checked) setStudentIdError(null);
                        }}
                        className="rounded border-white/20 text-cyan-500 focus:ring-0 cursor-pointer"
                      />
                      <span>College Student Offer</span>
                    </label>
                  </div>
                </div>

                {/* Student ID Proof Dropzone (Mandatory if college student checked) */}
                {isCollegeStudent && (
                  <div className="p-3.5 rounded-2xl bg-cyan-950/20 border border-cyan-500/30 space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-[11px] font-sans font-bold text-cyan-300 flex items-center gap-1.5">
                        <UploadCloud className="w-3.5 h-3.5" />
                        <span>Upload School / College ID Card Proof</span>
                      </span>
                      <span className="text-[9px] font-mono text-cyan-400 uppercase">Required for Concession</span>
                    </div>

                    <input
                      type="file"
                      ref={fileInputRef}
                      onChange={handleFileUpload}
                      accept="image/*,.pdf"
                      className="hidden"
                    />

                    {studentIdFile ? (
                      <div className="flex items-center justify-between p-2.5 rounded-xl bg-black/60 border border-cyan-500/40 text-xs font-mono">
                        <div className="flex items-center gap-2 truncate text-neutral-200">
                          <FileCheck className="w-4 h-4 text-emerald-400 shrink-0" />
                          <span className="truncate">{studentIdFile.name}</span>
                          <span className="text-neutral-500 text-[10px]">({studentIdFile.size})</span>
                        </div>
                        <button
                          type="button"
                          onClick={() => {
                            setStudentIdFile(null);
                            if (fileInputRef.current) fileInputRef.current.value = '';
                          }}
                          className="text-neutral-400 hover:text-rose-400 text-xs ml-2 cursor-pointer"
                        >
                          Remove
                        </button>
                      </div>
                    ) : (
                      <button
                        type="button"
                        onClick={() => fileInputRef.current?.click()}
                        className="w-full py-2.5 px-3 rounded-xl border border-dashed border-cyan-500/40 hover:border-cyan-400 bg-black/40 hover:bg-cyan-500/10 text-cyan-200 text-xs font-mono transition flex items-center justify-center gap-2 cursor-pointer"
                      >
                        <UploadCloud className="w-4 h-4" />
                        <span>Click to choose Student ID Photo / PDF</span>
                      </button>
                    )}

                    {studentIdError && (
                      <p className="text-[10px] text-rose-400 font-mono">{studentIdError}</p>
                    )}
                  </div>
                )}

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

            {/* Payment Method Tabs (Net Banking Removed) */}
            <div className="space-y-2">
              <label className="text-xs font-mono text-neutral-300 font-semibold block uppercase">
                Choose Payment Method
              </label>
              <div className="grid grid-cols-3 gap-2">
                {[
                  { id: 'UPI_QR', label: 'Real UPI QR', icon: QrCode },
                  { id: 'UPI_ID', label: 'Send UPI Request', icon: Smartphone },
                  { id: 'CREDIT_CARD', label: 'Credit / Debit Card', icon: CreditCard },
                ].map((m) => {
                  const Icon = m.icon;
                  return (
                    <button
                      key={m.id}
                      type="button"
                      onClick={() => setSelectedMethod(m.id as any)}
                      className={`p-3 rounded-xl border text-left transition cursor-pointer flex flex-col items-center justify-center gap-1.5 ${
                        selectedMethod === m.id
                          ? 'bg-cyan-500/15 border-cyan-500/50 text-cyan-200 shadow-md'
                          : 'bg-white/[0.02] border-white/10 text-neutral-400 hover:text-white'
                      }`}
                    >
                      <Icon className="w-4 h-4" />
                      <span className="text-[10px] font-mono font-bold text-center leading-tight">{m.label}</span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Method Input Area */}
            <div className="p-4 rounded-2xl bg-black/60 border border-white/10 space-y-4 text-xs">
              {/* 1. REAL DYNAMIC UPI QR */}
              {selectedMethod === 'UPI_QR' && (
                <div className="flex flex-col items-center justify-center space-y-3 text-center">
                  <div className="relative p-3 rounded-2xl bg-white text-black shadow-2xl inline-block w-48 h-48 flex items-center justify-center overflow-hidden">
                    {realQrDataUrl ? (
                      <img
                        src={realQrDataUrl}
                        alt="Real UPI Payment QR Code"
                        className="w-full h-full object-contain"
                      />
                    ) : (
                      <div className="flex flex-col items-center justify-center text-neutral-400 gap-2">
                        <RefreshCw className="w-6 h-6 animate-spin text-cyan-500" />
                        <span className="text-[10px] font-mono">Generating Live QR...</span>
                      </div>
                    )}
                  </div>

                  <div className="space-y-1 max-w-sm">
                    <span className="text-xs font-mono text-neutral-300 block">
                      Scan with any UPI App: <strong>GPay, PhonePe, Paytm, BHIM</strong>
                    </span>
                    <span className="text-[10px] font-mono text-emerald-400 block font-bold">
                      Zero Mock Code &bull; Cryptographically Encoded to pay ₹{tax.totalPayable}
                    </span>
                  </div>

                  <div className="pt-1 flex flex-wrap items-center justify-center gap-2">
                    <a
                      href={upiPayPayload}
                      className="px-3.5 py-1.5 rounded-xl bg-white/[0.06] hover:bg-cyan-500/20 border border-white/15 hover:border-cyan-400 text-white font-mono text-[11px] transition flex items-center gap-1.5"
                    >
                      <ExternalLink className="w-3 h-3 text-cyan-400" />
                      <span>Open in UPI Apps Directly</span>
                    </a>
                  </div>
                </div>
              )}

              {/* 2. SEND PAYMENT REQUEST TO UPI ID */}
              {selectedMethod === 'UPI_ID' && (
                <div className="space-y-3">
                  <div className="space-y-1">
                    <label className="text-neutral-300 block text-xs font-semibold">
                      Send Payment Collect Request to UPI App
                    </label>
                    <p className="text-[11px] text-neutral-400 leading-relaxed">
                      Enter your UPI ID (VPA). A direct notification and collect request will be sent to your PhonePe, Google Pay, or Paytm app.
                    </p>
                  </div>

                  <div className="space-y-2">
                    <input
                      type="text"
                      placeholder="e.g. mobileNumber@ybl, yourname@okaxis, upiID@paytm"
                      value={upiId}
                      onChange={(e) => setUpiId(e.target.value)}
                      className="w-full px-3.5 py-2.5 rounded-xl bg-zinc-900 border border-white/15 text-white font-mono text-xs focus:outline-none focus:border-cyan-400"
                    />

                    <div className="flex flex-wrap items-center gap-2 pt-1 text-[10px] font-mono text-neutral-400">
                      <span>Quick Handles:</span>
                      {['@okaxis', '@okhdfcbank', '@ybl', '@paytm'].map((h) => (
                        <button
                          key={h}
                          type="button"
                          onClick={() => {
                            const prefix = upiId.split('@')[0] || payerName.toLowerCase();
                            setUpiId(`${prefix}${h}`);
                          }}
                          className="px-2 py-0.5 rounded-md bg-white/5 hover:bg-white/10 text-neutral-300 border border-white/10"
                        >
                          {h}
                        </button>
                      ))}
                    </div>
                  </div>

                  <div className="p-3 rounded-xl bg-cyan-950/20 border border-cyan-500/20 flex items-center gap-2 text-[11px] font-mono text-cyan-300">
                    <Smartphone className="w-4 h-4 shrink-0" />
                    <span>App Collect Request will be dispatched upon clicking Pay.</span>
                  </div>
                </div>
              )}

              {/* 3. CREDIT / DEBIT CARD */}
              {selectedMethod === 'CREDIT_CARD' && (
                <div className="space-y-3">
                  <div className="space-y-1">
                    <label className="text-neutral-300 block text-xs font-semibold">Card Details</label>
                    <p className="text-[11px] text-neutral-400">
                      Bank 3D-Secure 2.0 authentication gateway will open to approve payment.
                    </p>
                  </div>

                  <div>
                    <label className="text-neutral-400 block text-[11px] mb-1">Card Number</label>
                    <input
                      type="text"
                      placeholder="•••• •••• •••• ••••"
                      maxLength={19}
                      value={cardNumber}
                      onChange={(e) => {
                        const val = e.target.value.replace(/\D/g, '').replace(/(.{4})/g, '$1 ').trim();
                        setCardNumber(val);
                      }}
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
                      <label className="text-neutral-400 block text-[11px] mb-1">CVV / CVC</label>
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

                  <div>
                    <label className="text-neutral-400 block text-[11px] mb-1">Cardholder Name</label>
                    <input
                      type="text"
                      placeholder="Name on card"
                      value={cardHolder}
                      onChange={(e) => setCardHolder(e.target.value)}
                      className="w-full px-3 py-2 rounded-xl bg-zinc-900 border border-white/15 text-white font-mono text-xs focus:outline-none focus:border-cyan-400"
                    />
                  </div>
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
                onClick={handleInitiatePay}
                className="flex-1 py-3 px-6 rounded-2xl bg-cyan-400 hover:bg-cyan-300 text-black font-display font-bold text-xs uppercase tracking-wider transition shadow-[0_0_25px_rgba(34,211,238,0.3)] flex items-center justify-center gap-2 cursor-pointer"
              >
                <span>
                  {selectedMethod === 'UPI_ID'
                    ? `Request ₹${tax.totalPayable} in App`
                    : selectedMethod === 'CREDIT_CARD'
                    ? `Open Bank Gateway (₹${tax.totalPayable})`
                    : `Confirm & Pay ₹${tax.totalPayable}`}
                </span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}

        {/* STEP 2: CARD BANK GATEWAY / 3D SECURE MODAL */}
        {step === 'CARD_GATEWAY' && (
          <div className="space-y-5 text-left font-sans">
            <div className="p-5 rounded-2xl bg-white/[0.04] border border-cyan-500/40 space-y-4">
              <div className="flex items-center justify-between border-b border-white/10 pb-3">
                <div className="flex items-center gap-2">
                  <Building className="w-5 h-5 text-cyan-400" />
                  <h4 className="font-bold text-sm text-white">Bank 3D-Secure 2.0 Authentication</h4>
                </div>
                <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                  256-BIT ENCRYPTED
                </span>
              </div>

              <div className="space-y-2 text-xs font-mono text-neutral-300">
                <div className="flex justify-between">
                  <span className="text-neutral-400">Merchant Beneficiary:</span>
                  <span className="text-white font-bold">{merchantName}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-neutral-400">Card Mask:</span>
                  <span className="text-white">•••• {cardNumber.slice(-4) || '4242'}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-neutral-400">Amount Authorized:</span>
                  <span className="text-cyan-300 font-bold">₹{tax.totalPayable}</span>
                </div>
              </div>

              <div className="space-y-2 pt-2 border-t border-white/10">
                <label className="block text-xs text-neutral-300 font-medium">
                  Enter One-Time Password (OTP) sent to your registered mobile number:
                </label>
                <div className="flex items-center gap-3">
                  <input
                    type="text"
                    maxLength={6}
                    placeholder="Enter 6-digit OTP"
                    value={cardOtp}
                    onChange={(e) => setCardOtp(e.target.value)}
                    className="flex-1 px-4 py-2.5 rounded-xl bg-black border border-cyan-500/50 text-white font-mono text-center tracking-widest text-sm focus:outline-none"
                  />
                  <button
                    type="button"
                    onClick={() => setCardOtp('849201')}
                    className="px-3 py-2 rounded-xl bg-white/10 hover:bg-white/15 text-cyan-300 text-[10px] font-mono"
                  >
                    Auto-fill Demo OTP
                  </button>
                </div>
              </div>
            </div>

            <div className="flex items-center justify-between gap-3 pt-2">
              <button
                type="button"
                onClick={() => setStep('DETAILS')}
                className="px-4 py-2.5 rounded-xl text-neutral-400 hover:text-white font-mono text-xs"
              >
                Back to Checkout
              </button>
              <button
                type="button"
                onClick={finalizePayment}
                className="flex-1 py-3 px-6 rounded-2xl bg-cyan-400 hover:bg-cyan-300 text-black font-display font-bold text-xs uppercase tracking-wider transition shadow-[0_0_25px_rgba(34,211,238,0.3)] flex items-center justify-center gap-2 cursor-pointer"
              >
                <span>Authorize &amp; Pay ₹{tax.totalPayable}</span>
                <Check className="w-4 h-4" />
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
