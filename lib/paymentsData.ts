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

  // Flat Platform Fee: Standard ₹9, Pulse Pass ₹5, Pulse Elite ₹0
  const normalizedTier = (passTier || '').toLowerCase();
  let gatewayTax = currency === 'INR' ? 9 : 0.15;
  if (normalizedTier.includes('elite')) {
    gatewayTax = 0;
  } else if (normalizedTier.includes('pass')) {
    gatewayTax = currency === 'INR' ? 5 : 0.08;
  }

  let gstRate = 0.12;
  let gstLabel = '12% Statutory GST';

  if (userAge <= 18) {
    gstRate = 0;
    gstLabel = '0% Student Exemption (Age ≤ 18)';
  } else if ((userAge >= 19 && userAge <= 21) || isCollegeStudent) {
    gstRate = 0.05;
    gstLabel = isCollegeStudent && userAge > 21
      ? '5% College Student Concession'
      : '5% Concessional GST (Ages 19-21 / College)';
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
