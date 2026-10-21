// ─── ZEN.PAYMENTS STATE & DATA ENGINE ───
import {
  PaymentTransaction,
  PaymentReceipt,
  PaymentInvoice,
  PaymentSubscription,
  PayoutRecord,
  AccountBalance,
  TaxBreakdown
} from '@/types/payments';

export const LS_ZEN_TXNS = 'zenvitra_payments_txns_v1';
export const LS_ZEN_INVOICES = 'zenvitra_payments_invoices_v1';
export const LS_ZEN_PAYOUTS = 'zenvitra_payments_payouts_v1';

export const SEEDED_TRANSACTION_IDS = ['ZPAY-2026-00018472', 'ZPAY-2026-00018471', 'ZPAY-2026-00018470'];
export const SEEDED_INVOICE_IDS = ['INV-2026-00481'];
export const SEEDED_PAYOUT_IDS = ['PO-2026-0089', 'PO-2026-0090'];
export const SEEDED_SUBSCRIPTION_IDS = ['SUB-2026-089'];

export const INITIAL_TRANSACTIONS: PaymentTransaction[] = [];

export const INITIAL_INVOICES: PaymentInvoice[] = [];

export const INITIAL_SUBSCRIPTIONS: PaymentSubscription[] = [];

export const INITIAL_BALANCE: AccountBalance = {
  available: 0,
  pending: 0,
  onHold: 0,
  currency: 'INR',
  bankAccountMasked: 'No Bank Account Linked'
};

export const INITIAL_PAYOUTS: PayoutRecord[] = [];

// Helper: Calculate tax formula (₹9 Flat Platform Fee; ₹5 for Pulse Pass; ₹0 for Pulse Elite)
export function computeTax(
  baseAmount: number,
  userAge: number = 17,
  isCollegeStudent: boolean = false,
  currency: 'INR' | 'USD' = 'INR',
  passTier?: 'standard' | 'pass' | 'elite' | string
): TaxBreakdown {
  if (baseAmount <= 0) {
    return {
      baseAmount: 0,
      gatewayTax: 0,
      gstAmount: 0,
      gstRate: 0,
      gstLabel: '0% Exempt',
      totalPayable: 0
    };
  }

  // Flat Attendee Convenience Fee: Standard ₹29, Pulse Pass ₹15, Pulse Elite ₹0
  const normalizedTier = (passTier || '').toLowerCase();
  let gatewayTax = currency === 'INR' ? 29 : 0.40;
  if (normalizedTier.includes('elite')) {
    gatewayTax = 0;
  } else if (normalizedTier.includes('pass')) {
    gatewayTax = currency === 'INR' ? 15 : 0.20;
  }

  // GST rules: Student under or equal to age 18: 0% GST; Student over 18: 6% GST
  let gstRate = 0.06;
  let gstLabel = '6% Student GST (Age > 18)';

  if (userAge <= 18) {
    gstRate = 0;
    gstLabel = '0% Student Exemption (Age ≤ 18)';
  }

  const gstAmount = Math.round((baseAmount * gstRate) * 100) / 100;
  const totalPayable = Math.round((baseAmount + gatewayTax + gstAmount) * 100) / 100;

  return {
    baseAmount,
    gatewayTax,
    gstAmount,
    gstRate,
    gstLabel,
    totalPayable
  };
}
