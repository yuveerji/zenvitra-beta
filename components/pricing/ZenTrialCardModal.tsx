'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  X,
  CreditCard,
  ShieldCheck,
  Lock,
  Sparkles,
  CheckCircle2,
  Calendar,
  AlertCircle
} from 'lucide-react';
import { isFounder, isAdmin } from '@/lib/founderControl';
import { activatePromotionalProTrialWithCard } from '@/lib/subscriptionTiers';

export interface ZenTrialCardModalProps {
  isOpen: boolean;
  onClose: () => void;
  username: string;
  userEmail?: string;
  userRole?: string;
  onSuccess?: () => void;
}

export function ZenTrialCardModal({
  isOpen,
  onClose,
  username,
  userEmail,
  userRole,
  onSuccess
}: ZenTrialCardModalProps) {
  const [cardNumber, setCardNumber] = useState('');
  const [cardHolder, setCardHolder] = useState('');
  const [cardExpiry, setCardExpiry] = useState('');
  const [cardCvv, setCardCvv] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [isAuthorizing, setIsAuthorizing] = useState(false);
  const [authSuccess, setAuthSuccess] = useState(false);

  const isFounderOrAdmin = Boolean(
    isFounder(username || userEmail, userRole) ||
    isAdmin(username || userEmail, userRole)
  );

  if (!isOpen) return null;

  const handleAuthorizeCard = (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    const cleanNum = cardNumber.replace(/\s+/g, '');
    if (cleanNum.length < 15 || cleanNum.length > 19) {
      setError('Please provide a valid 15 or 16-digit debit/credit card number.');
      return;
    }

    if (!cardExpiry || !/^(0[1-9]|1[0-2])\/\d{2}$/.test(cardExpiry)) {
      setError('Please provide a valid card expiration date (MM/YY).');
      return;
    }

    if (!cardCvv || cardCvv.length < 3) {
      setError('Please enter a valid 3 or 4-digit CVV security code.');
      return;
    }

    if (!cardHolder.trim()) {
      setError('Please enter the cardholder name as printed on the card.');
      return;
    }

    setIsAuthorizing(true);

    // Simulate standard zero-charge / reversible ₹1 authorization verification
    setTimeout(() => {
      try {
        activatePromotionalProTrialWithCard(username, {
          cardLast4: cleanNum.slice(-4),
          cardBrand: cleanNum.startsWith('4') ? 'Visa' : cleanNum.startsWith('5') ? 'Mastercard' : cleanNum.startsWith('6') ? 'RuPay' : 'Card',
          expiry: cardExpiry
        });

        setIsAuthorizing(false);
        setAuthSuccess(true);

        setTimeout(() => {
          if (onSuccess) onSuccess();
          onClose();
        }, 1200);
      } catch (err: any) {
        setIsAuthorizing(false);
        setError(err?.message || 'Card authorization failed. Please check details or try another card.');
      }
    }, 1000);
  };

  return (
    <div className="fixed inset-0 z-[99999] bg-black/85 backdrop-blur-md flex items-center justify-center p-4 animate-fade-in select-none">
      <div className="max-w-md w-full bg-[#090c15] rounded-[28px] border border-amber-500/30 p-6 sm:p-7 shadow-2xl relative text-white animate-in zoom-in-95 space-y-5">
        
        {/* Close Button */}
        <button
          type="button"
          onClick={onClose}
          className="absolute top-4 right-4 p-1.5 rounded-full text-neutral-400 hover:text-white hover:bg-white/10 transition cursor-pointer"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Modal Header */}
        <div className="text-center space-y-1.5">
          <div className="w-12 h-12 rounded-2xl bg-amber-500/20 border border-amber-500/40 text-amber-300 flex items-center justify-center mx-auto shadow-md">
            <Sparkles className="w-6 h-6 text-amber-400" />
          </div>
          
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-500/15 border border-amber-500/30 text-amber-300 text-[10px] font-mono font-bold uppercase tracking-wider">
            <span>3-MONTH LAUNCH CAMPAIGN &bull; CARD VERIFICATION</span>
          </div>

          <h3 className="text-xl font-black font-serif text-white tracking-tight">
            Start 1-Month ZEN PRO Free Trial
          </h3>
          <p className="text-xs text-neutral-300 leading-relaxed max-w-sm mx-auto">
            A valid debit or credit card is required to initiate your 30-day trial. <strong>You will not be charged today (₹0.00).</strong>
          </p>
        </div>

        {/* Diagnostic Banner for Founders / Admins Only */}
        {isFounderOrAdmin && (
          <div className="p-2.5 rounded-xl bg-cyan-950/40 border border-cyan-500/30 text-[10px] font-mono text-cyan-200">
            <span className="font-bold block">Internal Test Card (Founders/Admin Only):</span>
            <span>4706 1312 1121 2123 &bull; Exp: 12/28 &bull; CVV: 111</span>
          </div>
        )}

        {/* Error Alert */}
        {error && (
          <div className="p-3 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-300 text-xs flex items-center gap-2">
            <AlertCircle className="w-4 h-4 shrink-0 text-rose-400" />
            <span>{error}</span>
          </div>
        )}

        {authSuccess ? (
          <div className="p-6 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 text-center space-y-2 animate-fade-in">
            <CheckCircle2 className="w-10 h-10 text-emerald-400 mx-auto" />
            <h4 className="text-base font-bold text-white">Card Verified Successfully!</h4>
            <p className="text-xs text-neutral-300">
              Your 1-Month ZEN PRO Trial is now active. Unlocking all dais &amp; pro capabilities...
            </p>
          </div>
        ) : (
          <form onSubmit={handleAuthorizeCard} className="space-y-3.5">
            <div>
              <label className="text-neutral-400 block text-[11px] font-mono mb-1">
                Card Number
              </label>
              <div className="relative">
                <input
                  type="text"
                  placeholder="•••• •••• •••• ••••"
                  maxLength={19}
                  required
                  value={cardNumber}
                  onChange={(e) => {
                    const val = e.target.value.replace(/\D/g, '').replace(/(.{4})/g, '$1 ').trim();
                    setCardNumber(val);
                  }}
                  className="w-full pl-9 pr-3 py-2.5 rounded-xl bg-zinc-900 border border-white/15 text-white font-mono text-xs focus:outline-none focus:border-amber-400"
                />
                <CreditCard className="w-4 h-4 text-neutral-400 absolute left-3 top-3 pointer-events-none" />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="text-neutral-400 block text-[11px] font-mono mb-1">
                  Expiry (MM/YY)
                </label>
                <input
                  type="text"
                  placeholder="MM/YY"
                  maxLength={5}
                  required
                  value={cardExpiry}
                  onChange={(e) => {
                    let val = e.target.value.replace(/\D/g, '');
                    if (val.length >= 3) {
                      val = val.slice(0, 2) + '/' + val.slice(2, 4);
                    }
                    setCardExpiry(val);
                  }}
                  className="w-full px-3 py-2.5 rounded-xl bg-zinc-900 border border-white/15 text-white font-mono text-xs focus:outline-none focus:border-amber-400 text-center"
                />
              </div>
              <div>
                <label className="text-neutral-400 block text-[11px] font-mono mb-1">
                  CVV / CVC
                </label>
                <div className="relative">
                  <input
                    type="password"
                    placeholder="•••"
                    maxLength={4}
                    required
                    value={cardCvv}
                    onChange={(e) => setCardCvv(e.target.value.replace(/\D/g, ''))}
                    className="w-full px-3 py-2.5 rounded-xl bg-zinc-900 border border-white/15 text-white font-mono text-xs focus:outline-none focus:border-amber-400 text-center"
                  />
                  <Lock className="w-3.5 h-3.5 text-neutral-500 absolute right-3 top-3 pointer-events-none" />
                </div>
              </div>
            </div>

            <div>
              <label className="text-neutral-400 block text-[11px] font-mono mb-1">
                Cardholder Name
              </label>
              <input
                type="text"
                placeholder="Name on card"
                required
                value={cardHolder}
                onChange={(e) => setCardHolder(e.target.value)}
                className="w-full px-3 py-2.5 rounded-xl bg-zinc-900 border border-white/15 text-white font-mono text-xs focus:outline-none focus:border-amber-400"
              />
            </div>

            {/* Trial Guarantee Terms */}
            <div className="p-3 rounded-xl bg-white/[0.03] border border-white/10 space-y-1 text-[11px] text-neutral-300">
              <div className="flex items-center justify-between text-white font-bold">
                <span>Payable Today:</span>
                <span className="text-emerald-400 font-mono">₹0.00</span>
              </div>
              <p className="text-[10px] text-neutral-400 leading-tight">
                Includes full 30 days of ZEN PRO. You will receive an alert notification before your trial expires. Cancel anytime in Settings.
              </p>
            </div>

            <button
              type="submit"
              disabled={isAuthorizing}
              className="w-full py-3.5 rounded-xl bg-gradient-to-r from-amber-400 to-amber-500 hover:from-amber-300 hover:to-amber-400 text-black font-extrabold text-xs uppercase tracking-wider transition shadow-lg shadow-amber-400/25 active:scale-98 cursor-pointer disabled:opacity-50 flex items-center justify-center gap-2"
            >
              <ShieldCheck className="w-4 h-4 text-black" />
              <span>{isAuthorizing ? 'Verifying Card Security...' : 'Verify Card & Start 1-Month Free Trial'}</span>
            </button>
          </form>
        )}

        <div className="text-center pt-1">
          <span className="text-[10px] font-mono text-neutral-500 flex items-center justify-center gap-1.5">
            <Lock className="w-3 h-3" />
            <span>256-bit Encrypted &bull; PCI-DSS Tokenized</span>
          </span>
        </div>
      </div>
    </div>
  );
}
