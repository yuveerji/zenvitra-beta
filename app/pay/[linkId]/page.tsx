'use client';

import React, { useState, useEffect, use } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import QRCode from 'qrcode';
import {
  CreditCard,
  ShieldCheck,
  CheckCircle2,
  AlertTriangle,
  QrCode,
  Sparkles,
  ArrowRight,
  ExternalLink,
  RefreshCw,
  Ticket,
  Calendar,
  Lock,
  User,
  Mail,
  Phone
} from 'lucide-react';
import { ZenCheckoutModal } from '@/components/payments/ZenCheckoutModal';

interface PayPageProps {
  params: Promise<{ linkId: string }>;
}

export default function PayLinkPage({ params }: PayPageProps) {
  const resolvedParams = use(params);
  const linkId = resolvedParams.linkId;

  const [loading, setLoading] = useState(true);
  const [linkData, setLinkData] = useState<any | null>(null);
  const [qrCodeDataUrl, setQrCodeDataUrl] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  // Payer details form
  const [attendeeName, setAttendeeName] = useState('');
  const [attendeeEmail, setAttendeeEmail] = useState('');
  const [attendeePhone, setAttendeePhone] = useState('9876543210');
  const [isPaid, setIsPaid] = useState(false);
  const [showCheckoutModal, setShowCheckoutModal] = useState(false);

  const fetchLinkData = async () => {
    try {
      const res = await fetch(`/api/payments/cashfree/links/${encodeURIComponent(linkId)}`);
      const data = await res.json();
      if (!res.ok || !data.link) {
        throw new Error(data.error || 'Payment link not found or expired');
      }

      setLinkData(data.link);
      if (data.link.link_status === 'PAID') {
        setIsPaid(true);
      }

      if (data.link.customer_details) {
        if (data.link.customer_details.customer_name) {
          setAttendeeName(data.link.customer_details.customer_name);
        }
        if (data.link.customer_details.customer_email) {
          setAttendeeEmail(data.link.customer_details.customer_email);
        }
        if (data.link.customer_details.customer_phone) {
          setAttendeePhone(data.link.customer_details.customer_phone);
        }
      }

      // Generate QR
      try {
        const qr = await QRCode.toDataURL(data.link.link_url || window.location.href, {
          width: 320,
          margin: 2,
          color: { dark: '#000000', light: '#ffffff' }
        });
        setQrCodeDataUrl(qr);
      } catch (_) {}

    } catch (err: any) {
      setError(err.message || 'Failed to load payment link');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchLinkData();
  }, [linkId]);

  // Periodic polling if not paid to detect mobile payment completion
  useEffect(() => {
    if (isPaid || !linkData) return;
    const interval = setInterval(async () => {
      try {
        const res = await fetch(`/api/payments/cashfree/links/${encodeURIComponent(linkId)}`);
        const data = await res.json();
        if (data?.link?.link_status === 'PAID') {
          setIsPaid(true);
          setLinkData(data.link);
        }
      } catch (_) {}
    }, 4000);
    return () => clearInterval(interval);
  }, [isPaid, linkData, linkId]);

  if (loading) {
    return (
      <div className="min-h-screen bg-[#07090e] text-white flex items-center justify-center font-mono">
        <div className="text-center space-y-3">
          <RefreshCw className="w-8 h-8 text-cyan-400 animate-spin mx-auto" />
          <p className="text-sm text-neutral-400">Loading Cashfree Payment Gateway...</p>
        </div>
      </div>
    );
  }

  if (error || !linkData) {
    return (
      <div className="min-h-screen bg-[#07090e] text-white flex items-center justify-center p-4 font-mono">
        <div className="max-w-md w-full p-6 rounded-3xl bg-[#0c0f18] border border-red-500/30 text-center space-y-4">
          <AlertTriangle className="w-10 h-10 text-red-400 mx-auto" />
          <h2 className="text-lg font-bold text-white">Payment Link Error</h2>
          <p className="text-xs text-neutral-400">{error || 'This link may have expired or been removed.'}</p>
          <Link
            href="/"
            className="inline-block px-5 py-2.5 rounded-xl bg-white/10 hover:bg-white/15 text-white text-xs font-bold transition"
          >
            Return to Zenvitra Home
          </Link>
        </div>
      </div>
    );
  }

  const amount = linkData.link_amount || 0;
  const currency = linkData.link_currency || 'INR';
  const purpose = linkData.link_purpose || 'Event Registration';

  return (
    <div className="min-h-screen bg-[#06080e] text-white flex flex-col justify-between py-8 px-4 font-sans select-none">
      {/* Background radial gradient */}
      <div className="fixed inset-0 pointer-events-none bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-cyan-900/20 via-transparent to-transparent" />

      <div className="relative max-w-lg w-full mx-auto space-y-6">
        {/* Brand Header */}
        <div className="flex items-center justify-between border-b border-white/10 pb-4">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-cyan-500/20 border border-cyan-500/40 flex items-center justify-center text-cyan-300 font-black font-display text-sm">
              Z
            </div>
            <div>
              <span className="font-display font-black text-sm tracking-wide text-white block">
                ZENVITRA PAYMENTS
              </span>
              <span className="text-[10px] font-mono text-cyan-400 block">
                Cashfree Gateway &bull; V1
              </span>
            </div>
          </div>

          <div className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-[10px] font-mono font-bold">
            <ShieldCheck className="w-3.5 h-3.5" />
            <span>256-Bit SSL Encrypted</span>
          </div>
        </div>

        {/* Status Card: Paid vs Active */}
        {isPaid ? (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="p-6 rounded-3xl bg-emerald-500/[0.08] border border-emerald-500/40 text-center space-y-4"
          >
            <div className="w-16 h-16 rounded-full bg-emerald-500/20 border border-emerald-500/40 flex items-center justify-center text-emerald-400 mx-auto">
              <CheckCircle2 className="w-8 h-8" />
            </div>

            <div className="space-y-1">
              <h2 className="text-xl font-black font-display text-white">Payment Confirmed!</h2>
              <p className="text-xs text-neutral-300 font-mono">
                Your registration pass is fully secured and verified on-chain.
              </p>
            </div>

            <div className="p-4 rounded-2xl bg-black/60 border border-white/10 text-xs font-mono space-y-2 text-left">
              <div className="flex justify-between text-neutral-400">
                <span>Purpose:</span>
                <span className="text-white font-bold">{purpose}</span>
              </div>
              <div className="flex justify-between text-neutral-400">
                <span>Amount Paid:</span>
                <span className="text-emerald-400 font-bold">₹{amount} {currency}</span>
              </div>
              <div className="flex justify-between text-neutral-400">
                <span>Reference:</span>
                <span className="text-neutral-300 font-bold">{linkId}</span>
              </div>
            </div>

            <div className="pt-2 flex flex-col sm:flex-row gap-2">
              <Link
                href="/pulse?tab=events"
                className="flex-1 py-3 rounded-2xl bg-emerald-400 hover:bg-emerald-300 text-black font-mono text-xs font-bold transition flex items-center justify-center gap-2"
              >
                <Ticket className="w-4 h-4" />
                <span>View Event Passes</span>
              </Link>

              <Link
                href="/"
                className="py-3 px-5 rounded-2xl bg-white/5 hover:bg-white/10 text-white font-mono text-xs transition"
              >
                Home
              </Link>
            </div>
          </motion.div>
        ) : (
          <div className="p-6 rounded-3xl bg-[#0b0e18] border border-white/15 space-y-5 shadow-2xl">
            {/* Amount Banner */}
            <div className="p-4 rounded-2xl bg-gradient-to-r from-cyan-500/10 via-purple-500/10 to-amber-500/10 border border-cyan-500/30 flex items-center justify-between">
              <div>
                <span className="text-[10px] font-mono uppercase text-cyan-400 font-bold block">
                  Registration Checkout
                </span>
                <h3 className="text-base font-bold text-white font-display mt-0.5">
                  {purpose}
                </h3>
              </div>
              <div className="text-right">
                <span className="text-[10px] font-mono text-neutral-400 block uppercase">Total Payable</span>
                <span className="text-2xl font-black font-mono text-amber-400">₹{amount}</span>
              </div>
            </div>

            {/* Attendee Details Form */}
            <div className="space-y-3 text-xs font-mono">
              <span className="text-[11px] uppercase tracking-wider text-neutral-400 font-bold block">
                Delegate Contact Details
              </span>

              <div className="space-y-1">
                <label className="text-[10px] text-neutral-400 flex items-center gap-1">
                  <User className="w-3 h-3 text-cyan-400" />
                  <span>Full Name</span>
                </label>
                <input
                  type="text"
                  value={attendeeName}
                  onChange={(e) => setAttendeeName(e.target.value)}
                  placeholder="e.g. John Doe"
                  className="w-full px-3.5 py-2.5 rounded-xl bg-black/60 border border-white/10 text-white placeholder:text-neutral-600 focus:outline-none focus:border-cyan-500/50"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="text-[10px] text-neutral-400 flex items-center gap-1">
                    <Mail className="w-3 h-3 text-cyan-400" />
                    <span>Email Address</span>
                  </label>
                  <input
                    type="email"
                    value={attendeeEmail}
                    onChange={(e) => setAttendeeEmail(e.target.value)}
                    placeholder="john@example.com"
                    className="w-full px-3.5 py-2.5 rounded-xl bg-black/60 border border-white/10 text-white placeholder:text-neutral-600 focus:outline-none focus:border-cyan-500/50"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-[10px] text-neutral-400 flex items-center gap-1">
                    <Phone className="w-3 h-3 text-cyan-400" />
                    <span>Mobile (UPI Verified)</span>
                  </label>
                  <input
                    type="tel"
                    value={attendeePhone}
                    onChange={(e) => setAttendeePhone(e.target.value)}
                    placeholder="9876543210"
                    className="w-full px-3.5 py-2.5 rounded-xl bg-black/60 border border-white/10 text-white placeholder:text-neutral-600 focus:outline-none focus:border-cyan-500/50"
                  />
                </div>
              </div>
            </div>

            {/* QR Code and Quick Pay Option */}
            {qrCodeDataUrl && (
              <div className="p-4 rounded-2xl bg-black/60 border border-white/10 flex items-center gap-4">
                <div className="w-24 h-24 p-1.5 rounded-xl bg-white flex items-center justify-center shrink-0">
                  <img src={qrCodeDataUrl} alt="UPI QR" className="w-full h-full object-contain" />
                </div>
                <div className="space-y-1 text-xs">
                  <span className="font-bold text-white font-mono block">Instant Scan &amp; Pay</span>
                  <p className="text-neutral-400 text-[11px] leading-relaxed">
                    Scan using Google Pay, PhonePe, Paytm, or BHIM. Your session updates automatically upon confirmation.
                  </p>
                </div>
              </div>
            )}

            {/* Checkout Action Button */}
            <div className="pt-2">
              <button
                type="button"
                onClick={() => setShowCheckoutModal(true)}
                className="w-full py-3.5 rounded-2xl bg-gradient-to-r from-amber-400 via-rose-500 to-cyan-500 hover:from-amber-300 hover:to-cyan-400 text-black font-display font-black text-xs uppercase tracking-wider transition flex items-center justify-center gap-2 cursor-pointer shadow-[0_0_30px_rgba(245,158,11,0.3)]"
              >
                <CreditCard className="w-4 h-4" />
                <span>Pay ₹{amount} via Cashfree</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>

            {/* Supported Payment Logos / Text */}
            <div className="pt-2 text-center text-[10px] font-mono text-neutral-500">
              UPI Intent &bull; Google Pay &bull; PhonePe &bull; Paytm &bull; Visa &bull; Mastercard &bull; RuPay &bull; NetBanking
            </div>
          </div>
        )}

        {/* Footer */}
        <div className="text-center space-y-1 text-xs text-neutral-500 font-mono">
          <p>Powered by Cashfree Payments Gateway &bull; Zenvitra Operating Entity</p>
          <p className="text-[10px] text-neutral-600">Protocol Release V1</p>
        </div>
      </div>

      {/* Cashfree Checkout Modal */}
      {showCheckoutModal && (
        <ZenCheckoutModal
          isOpen={showCheckoutModal}
          onClose={() => setShowCheckoutModal(false)}
          product="ZEN.EVENTS"
          title={purpose}
          baseAmount={amount}
          currency="INR"
          merchantName="ZENVITRA Conference Platform"
          onSuccess={() => {
            setIsPaid(true);
            setShowCheckoutModal(false);
          }}
        />
      )}
    </div>
  );
}
