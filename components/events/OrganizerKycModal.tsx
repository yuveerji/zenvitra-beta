'use client';

import React, { useState, useEffect } from 'react';
import { 
  X, 
  ShieldCheck, 
  Building2, 
  CreditCard, 
  CheckCircle2, 
  AlertCircle, 
  Lock,
  ArrowRight,
  ExternalLink,
  Sparkles,
  RefreshCw,
  Landmark,
  BadgeCheck,
  User,
  Users,
  GraduationCap,
  HeartHandshake
} from 'lucide-react';
import { CustomSelect, SelectOption } from '@/components/ui/CustomSelect';

interface OrganizerKycModalProps {
  isOpen: boolean;
  onClose: () => void;
  userId: string;
  userEmail: string;
  userHandle?: string;
  onSuccess?: () => void;
}

const ORGANIZER_ENTITY_OPTIONS: SelectOption[] = [
  {
    value: 'INDIVIDUAL',
    label: 'Individual Event Host',
    description: 'Solo curator, independent delegate, or campus host',
    icon: User,
    badge: 'SOLO NODE',
  },
  {
    value: 'STUDENT_BODY',
    label: 'Student Council / School Club',
    description: 'Official high school or campus club committee',
    icon: Users,
    badge: 'CAMPUS',
  },
  {
    value: 'COLLEGE_SOCIETY',
    label: 'College MUN Society / University Body',
    description: 'University society, Model UN circuit, or debater bureau',
    icon: GraduationCap,
    badge: 'COLLEGIATE',
  },
  {
    value: 'NGO',
    label: 'Registered NGO / Youth Foundation',
    description: 'Non-profit organization, trust, or civic foundation',
    icon: HeartHandshake,
    badge: 'CIVIC TRUST',
  },
  {
    value: 'COMPANY',
    label: 'Private Limited / Enterprise Organizer',
    description: 'Registered commercial entity, firm, or agency',
    icon: Building2,
    badge: 'ENTERPRISE',
  },
];

export default function OrganizerKycModal({
  isOpen,
  onClose,
  userId,
  userEmail,
  userHandle,
  onSuccess,
}: OrganizerKycModalProps) {
  const [legalName, setLegalName] = useState('');
  const [organizationName, setOrganizationName] = useState('');
  const [organizationType, setOrganizationType] = useState('INDIVIDUAL');
  const [panNumber, setPanNumber] = useState('');
  const [bankAccountNumber, setBankAccountNumber] = useState('');
  const [confirmAccountNumber, setConfirmAccountNumber] = useState('');
  const [bankIfscCode, setBankIfscCode] = useState('');
  const [bankName, setBankName] = useState('');
  const [bankBranch, setBankBranch] = useState('');
  const [accountHolderName, setAccountHolderName] = useState('');
  const [upiVpa, setUpiVpa] = useState('');

  const [loading, setLoading] = useState(false);
  const [fetchingKyc, setFetchingKyc] = useState(true);
  const [existingKyc, setExistingKyc] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  // Cashfree Secure ID Real-Time Verification States
  const [isResolvingIfsc, setIsResolvingIfsc] = useState(false);
  const [ifscVerified, setIfscVerified] = useState(false);
  const [isVerifyingBav, setIsVerifyingBav] = useState(false);
  const [bavVerificationResult, setBavVerificationResult] = useState<any>(null);

  // Load existing KYC if any
  useEffect(() => {
    if (!isOpen || (!userId && !userEmail)) return;

    setFetchingKyc(true);
    fetch(`/api/organizer/kyc?userId=${encodeURIComponent(userId)}&userEmail=${encodeURIComponent(userEmail)}`)
      .then((res) => res.json())
      .then((data) => {
        if (data.success && data.kyc) {
          setExistingKyc(data.kyc);
          setLegalName(data.kyc.legalName || '');
          setOrganizationName(data.kyc.organizationName || '');
          setOrganizationType(data.kyc.organizationType || 'INDIVIDUAL');
          setPanNumber(data.kyc.panNumber || '');
          setBankAccountNumber(data.kyc.bankAccountNumber || '');
          setConfirmAccountNumber(data.kyc.bankAccountNumber || '');
          setBankIfscCode(data.kyc.bankIfscCode || '');
          setBankName(data.kyc.bankName || '');
          setAccountHolderName(data.kyc.accountHolderName || '');
          setUpiVpa(data.kyc.upiVpa || '');
          if (data.kyc.bankIfscCode) setIfscVerified(true);
        }
      })
      .catch((err) => console.error('Failed to load organizer KYC', err))
      .finally(() => setFetchingKyc(false));
  }, [isOpen, userId, userEmail]);

  // Real-time IFSC code auto-resolution via Cashfree Secure ID
  useEffect(() => {
    const cleanIfsc = bankIfscCode.trim().toUpperCase();
    if (cleanIfsc.length === 11 && /^[A-Z]{4}0[A-Z0-9]{6}$/.test(cleanIfsc)) {
      setIsResolvingIfsc(true);
      fetch(`/api/verification/ifsc?ifsc=${encodeURIComponent(cleanIfsc)}`)
        .then((res) => res.json())
        .then((data) => {
          if (data.success && data.details) {
            setBankName(data.details.bank_name || '');
            setBankBranch(data.details.branch || '');
            setIfscVerified(true);
          }
        })
        .catch((err) => console.warn('IFSC lookup notice', err))
        .finally(() => setIsResolvingIfsc(false));
    } else {
      setIfscVerified(false);
    }
  }, [bankIfscCode]);

  if (!isOpen) return null;

  // Single test penny-drop verification trigger
  const handleTestPennyDrop = async () => {
    setError(null);
    if (!bankAccountNumber.trim()) {
      setError('Enter a bank account number first.');
      return;
    }
    if (!bankIfscCode.trim()) {
      setError('Enter an 11-digit IFSC code first.');
      return;
    }

    setIsVerifyingBav(true);
    try {
      const res = await fetch('/api/verification/bank-account', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          bankAccount: bankAccountNumber.trim(),
          ifsc: bankIfscCode.trim().toUpperCase(),
          name: accountHolderName.trim() || legalName.trim(),
        }),
      });

      const data = await res.json();
      if (!res.ok || !data.success) {
        throw new Error(data.error || 'Bank account verification failed');
      }

      setBavVerificationResult(data.verification);
      if (data.verification.name_at_bank && !accountHolderName) {
        setAccountHolderName(data.verification.name_at_bank);
      }
    } catch (err: any) {
      setError(err?.message || 'Bank account verification failed. Please check the account number and IFSC.');
    } finally {
      setIsVerifyingBav(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSuccessMessage(null);

    if (bankAccountNumber !== confirmAccountNumber) {
      setError('Bank account numbers do not match.');
      return;
    }

    setLoading(true);

    try {
      const res = await fetch('/api/organizer/kyc', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          userId,
          userEmail,
          userHandle,
          legalName,
          organizationName,
          organizationType,
          panNumber,
          bankAccountNumber,
          bankIfscCode,
          bankName,
          accountHolderName,
          upiVpa,
        }),
      });

      const data = await res.json();
      if (!res.ok || !data.success) {
        throw new Error(data.error || 'Failed to submit settlement KYC');
      }

      setExistingKyc(data.kyc);
      setSuccessMessage(data.message || 'Settlement KYC verified via Cashfree Secure ID. Payouts enabled.');
      if (onSuccess) onSuccess();
    } catch (err: any) {
      setError(err?.message || 'Verification failed. Please check your bank and PAN details.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div 
      className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/85 backdrop-blur-md animate-fade-in font-sans"
      onClick={onClose}
    >
      <div 
        className="relative w-full max-w-lg max-h-[92vh] overflow-y-auto rounded-3xl bg-[#08090f] border border-cyan-500/30 shadow-2xl p-6 sm:p-8 space-y-6 text-white custom-scrollbar"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-white/10">
          <div>
            <div className="flex items-center gap-2">
              <span className="text-[10px] font-mono uppercase tracking-widest text-cyan-400 font-bold bg-cyan-500/10 px-2.5 py-0.5 rounded-full border border-cyan-500/20 flex items-center gap-1.5">
                <ShieldCheck className="w-3.5 h-3.5 text-cyan-400" />
                <span>CASHFREE SECURE ID &bull; KYC</span>
              </span>
              {existingKyc?.status === 'VERIFIED' && (
                <span className="inline-flex items-center gap-1 text-[10px] font-mono text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded-full border border-emerald-500/20 font-bold">
                  <CheckCircle2 className="w-3 h-3" />
                  <span>PAYOUTS ACTIVE</span>
                </span>
              )}
            </div>
            <h2 className="text-xl sm:text-2xl font-bold font-heading text-white tracking-tight mt-1.5">
              Host Settlement &amp; Bank KYC
            </h2>
            <p className="text-xs text-neutral-400 font-sans mt-0.5">
              Verify your PAN and Bank Account with Cashfree Secure ID Penny Drop for automated event pass disbursements.
            </p>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-2 rounded-xl bg-white/5 hover:bg-white/10 text-neutral-400 hover:text-white transition cursor-pointer"
            title="Close"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {error && (
          <div className="p-3.5 rounded-xl bg-red-500/10 border border-red-500/20 text-red-300 text-xs flex items-center gap-2">
            <AlertCircle className="w-4 h-4 shrink-0" />
            <span>{error}</span>
          </div>
        )}

        {successMessage && (
          <div className="p-3.5 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-300 text-xs flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 shrink-0" />
            <span>{successMessage}</span>
          </div>
        )}

        {/* Real-time BAV Penny Drop Success Preview */}
        {bavVerificationResult && (
          <div className="p-3.5 rounded-2xl bg-cyan-500/10 border border-cyan-500/30 text-xs space-y-1.5">
            <div className="flex items-center justify-between text-cyan-300 font-mono font-bold text-[11px]">
              <span className="flex items-center gap-1.5">
                <BadgeCheck className="w-4 h-4 text-cyan-400" />
                CASHFREE BAV PENNY DROP CONFIRMED
              </span>
              <span className="text-emerald-400">STATUS: VALID</span>
            </div>
            <div className="text-white text-xs">
              Registered Account Holder: <span className="font-bold text-cyan-200">{bavVerificationResult.name_at_bank}</span>
            </div>
            <div className="text-[11px] text-neutral-400 font-mono flex items-center justify-between">
              <span>Match Score: {bavVerificationResult.name_match_score}% ({bavVerificationResult.name_match_result})</span>
              {bavVerificationResult.utr && <span>UTR: {bavVerificationResult.utr}</span>}
            </div>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Entity Type */}
          <div className="space-y-1.5">
            <div className="flex items-center justify-between">
              <label className="text-xs font-mono text-neutral-300 block">
                Organizer Entity Type
              </label>
              <span className="text-[10px] font-mono text-neutral-500">Verified KYC Tier</span>
            </div>
            <CustomSelect
              value={organizationType}
              onChange={(val) => setOrganizationType(val)}
              options={ORGANIZER_ENTITY_OPTIONS}
            />
          </div>

          {/* Legal / Beneficiary Name */}
          <div className="space-y-1.5">
            <label className="text-xs font-mono text-neutral-300 block">
              Beneficiary Legal Full Name <span className="text-cyan-400">*</span>
            </label>
            <input
              type="text"
              required
              placeholder="As per Government ID and Bank Passbook"
              value={legalName}
              onChange={(e) => setLegalName(e.target.value)}
              className="w-full px-3.5 py-2.5 rounded-xl bg-white/[0.03] border border-white/10 text-xs text-white placeholder-neutral-500 focus:outline-none focus:border-cyan-500/50"
            />
          </div>

          {/* Organization Name (Optional) */}
          <div className="space-y-1.5">
            <label className="text-xs font-mono text-neutral-300 block">
              Organization / Institution Name (Optional)
            </label>
            <input
              type="text"
              placeholder="e.g. Cambridge MUN Society / Youth Parliament Secretariat"
              value={organizationName}
              onChange={(e) => setOrganizationName(e.target.value)}
              className="w-full px-3.5 py-2.5 rounded-xl bg-white/[0.03] border border-white/10 text-xs text-white placeholder-neutral-500 focus:outline-none focus:border-cyan-500/50"
            />
          </div>

          {/* PAN Number */}
          <div className="space-y-1.5">
            <div className="flex items-center justify-between">
              <label className="text-xs font-mono text-neutral-300 block">
                Permanent Account Number (PAN) <span className="text-cyan-400">*</span>
              </label>
              <span className="text-[10px] font-mono text-neutral-400">Cashfree PAN KYC</span>
            </div>
            <input
              type="text"
              required
              maxLength={10}
              placeholder="e.g. ABCDE1234F"
              value={panNumber}
              onChange={(e) => setPanNumber(e.target.value.toUpperCase())}
              className="w-full px-3.5 py-2.5 rounded-xl bg-white/[0.03] border border-white/10 text-xs font-mono text-white placeholder-neutral-500 focus:outline-none focus:border-cyan-500/50 uppercase"
            />
          </div>

          {/* Bank Account Number & Confirm */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div className="space-y-1.5">
              <label className="text-xs font-mono text-neutral-300 block">
                Bank Account Number <span className="text-cyan-400">*</span>
              </label>
              <input
                type="password"
                required
                placeholder="Account number"
                value={bankAccountNumber}
                onChange={(e) => setBankAccountNumber(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl bg-white/[0.03] border border-white/10 text-xs font-mono text-white placeholder-neutral-500 focus:outline-none focus:border-cyan-500/50"
              />
            </div>
            <div className="space-y-1.5">
              <label className="text-xs font-mono text-neutral-300 block">
                Confirm Account Number <span className="text-cyan-400">*</span>
              </label>
              <input
                type="text"
                required
                placeholder="Re-enter account number"
                value={confirmAccountNumber}
                onChange={(e) => setConfirmAccountNumber(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl bg-white/[0.03] border border-white/10 text-xs font-mono text-white placeholder-neutral-500 focus:outline-none focus:border-cyan-500/50"
              />
            </div>
          </div>

          {/* IFSC Code & Account Holder Name */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div className="space-y-1.5">
              <div className="flex items-center justify-between">
                <label className="text-xs font-mono text-neutral-300 block">
                  Bank IFSC Code <span className="text-cyan-400">*</span>
                </label>
                {ifscVerified && (
                  <span className="text-[10px] font-mono text-emerald-400 flex items-center gap-1">
                    <CheckCircle2 className="w-3 h-3" /> Valid
                  </span>
                )}
                {isResolvingIfsc && (
                  <span className="text-[10px] font-mono text-cyan-400 animate-pulse">
                    Resolving...
                  </span>
                )}
              </div>
              <input
                type="text"
                required
                maxLength={11}
                placeholder="e.g. HDFC0001234"
                value={bankIfscCode}
                onChange={(e) => setBankIfscCode(e.target.value.toUpperCase())}
                className="w-full px-3.5 py-2.5 rounded-xl bg-white/[0.03] border border-white/10 text-xs font-mono text-white placeholder-neutral-500 focus:outline-none focus:border-cyan-500/50 uppercase"
              />
            </div>
            <div className="space-y-1.5">
              <label className="text-xs font-mono text-neutral-300 block">
                Account Holder Name <span className="text-cyan-400">*</span>
              </label>
              <input
                type="text"
                required
                placeholder="Name on bank record"
                value={accountHolderName}
                onChange={(e) => setAccountHolderName(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl bg-white/[0.03] border border-white/10 text-xs text-white placeholder-neutral-500 focus:outline-none focus:border-cyan-500/50"
              />
            </div>
          </div>

          {/* Auto-resolved Bank & Branch Card */}
          {bankName && (
            <div className="p-3 rounded-xl bg-white/[0.02] border border-white/10 text-xs font-mono flex items-center justify-between text-neutral-300">
              <div className="flex items-center gap-2">
                <Landmark className="w-4 h-4 text-cyan-400 shrink-0" />
                <div>
                  <div className="font-bold text-white">{bankName}</div>
                  {bankBranch && <div className="text-[10px] text-neutral-400">{bankBranch}</div>}
                </div>
              </div>
              <span className="text-[10px] text-emerald-400 px-2 py-0.5 rounded-lg bg-emerald-500/10 border border-emerald-500/20 font-bold">
                RTGS &bull; NEFT &bull; IMPS
              </span>
            </div>
          )}

          {/* Quick Penny-Drop Pre-Check Trigger */}
          <div className="flex items-center justify-between pt-1">
            <span className="text-[11px] text-neutral-400 font-mono">
              Test validity before saving:
            </span>
            <button
              type="button"
              onClick={handleTestPennyDrop}
              disabled={isVerifyingBav || !bankAccountNumber || !bankIfscCode}
              className="text-[11px] font-mono text-cyan-400 hover:text-cyan-300 flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-cyan-500/10 border border-cyan-500/20 transition cursor-pointer disabled:opacity-40"
            >
              {isVerifyingBav ? (
                <>
                  <RefreshCw className="w-3 h-3 animate-spin" />
                  <span>Checking Bank CBS...</span>
                </>
              ) : (
                <>
                  <Sparkles className="w-3 h-3" />
                  <span>Instant Penny Drop Check</span>
                </>
              )}
            </button>
          </div>

          {/* UPI ID / VPA (Optional) */}
          <div className="space-y-1.5">
            <label className="text-xs font-mono text-neutral-300 block">
              UPI VPA / ID (Optional for Instant Payouts)
            </label>
            <input
              type="text"
              placeholder="e.g. organizer@okaxis / 9876543210@paytm"
              value={upiVpa}
              onChange={(e) => setUpiVpa(e.target.value.toLowerCase())}
              className="w-full px-3.5 py-2.5 rounded-xl bg-white/[0.03] border border-white/10 text-xs font-mono text-white placeholder-neutral-500 focus:outline-none focus:border-cyan-500/50"
            />
          </div>

          {/* Security & Regulatory Notice */}
          <div className="p-3.5 rounded-xl bg-white/[0.02] border border-white/10 text-[11px] text-neutral-400 flex items-start gap-2.5">
            <Lock className="w-4 h-4 text-cyan-400 shrink-0 mt-0.5" />
            <p className="leading-relaxed">
              Ticket earnings are settled via Cashfree Payout rails with statutory compliance. Account and PAN numbers are verified in real time via Cashfree Secure ID (Penny Drop) and encrypted with AES-256 protocols.
            </p>
          </div>

          {/* Action Buttons */}
          <div className="flex items-center justify-end gap-2.5 pt-3 border-t border-white/10">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2.5 rounded-xl bg-white/5 hover:bg-white/10 text-xs font-mono text-neutral-300 hover:text-white transition cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="px-6 py-2.5 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-neutral-950 font-mono font-bold text-xs uppercase tracking-wider transition shadow-lg shadow-cyan-500/25 disabled:opacity-50 cursor-pointer active:scale-95 flex items-center gap-2"
            >
              <ShieldCheck className="w-4 h-4 text-neutral-950" />
              <span>{loading ? 'Verifying with Cashfree...' : existingKyc ? 'Update & Re-Verify' : 'Verify & Enable Payouts'}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
